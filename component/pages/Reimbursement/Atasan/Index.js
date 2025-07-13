import React, { useState, useMemo, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert, // Dibiarkan jika masih dipakai di tempat lain, tapi tidak untuk guidance
  ImageBackground,
  ActivityIndicator,
  TouchableWithoutFeedback 
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import PanduanCuti from "../../../part/PanduanCutiReimburse";
import { getServerIP } from "../../../backbone/ApiConfig";
import { AuthContext } from "../../../backbone/AuthContext";

// --- HELPER FUNCTIONS ---
// (Tidak ada perubahan di sini)
const getStatusInfo = (status) => {
  switch (status) {
    case "Menunggu Persetujuan": return { text: "Menunggu Persetujuan", color: "#0288D1" };
    case "Belum Diverifikasi": return { text: "Belum Diverifikasi", color: "#FFA000" };
    case "Disetujui": return { text: "Disetujui", color: "#4CAF50" };
    case "Dibatalkan": return { text: "Dibatalkan", color: "#FF0000" };
    case "Ditolak": return { text: "Ditolak", color: "#FF0000" };
    case "Paid": return { text: "Telah Dibayar", color: "#4CAF50" };
    default: return { text: status, color: "#333" };
  }
};
const statusOrder = { "Menunggu Persetujuan": 1, "Belum Diverifikasi": 2, "Disetujui": 3, "Paid": 4, "Dibatalkan": 5 };
const formatCurrency = (number) => {
    if (isNaN(number)) return 'Rp. 0';
    return `Rp. ${new Intl.NumberFormat('id-ID').format(number)}`;
};
const DetailRow = ({ label, value, valueStyle }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
  </View>
);

// --- MAIN COMPONENT ---
const ReimbursementScreenAtasan = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Semua");
  const [isYearModalVisible, setYearModalVisible] = useState(false);
  const currentYear = new Date().getFullYear();
  const [appliedYear, setAppliedYear] = useState(currentYear);
  const [tempSelectedYear, setTempSelectedYear] = useState(currentYear);
  const [modalVisible, setModalVisible] = useState(false);
  const [earliestYear, setEarliestYear] = useState(currentYear);
  
  // State untuk menampung data dari API, loading, dan error
  const [reimbursementList, setReimbursementList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // =======================================================
  // [MODIFIKASI 1]: Tambahkan state untuk popup informasi
  // =======================================================
  const [isInfoPopupVisible, setInfoPopupVisible] = useState(false);


  const KARYAWAN_INFO = { NPK: user?.npk };

  // (Tidak ada perubahan di sini sampai fungsi showGuidancePopup)
  const years = useMemo(() => {
    return Array.from({ length: currentYear - earliestYear + 1 }, (_, i) => currentYear - i);
  }, [currentYear, earliestYear]);

  const fetchReimbursements = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const serverIP = await getServerIP();
        const url = `http://${serverIP}:8080/reimbursement/list-atasan?year=${appliedYear}`;
        
        console.log(`Fetching approval data from: ${url}`); 
        const response = await fetch(url);
        
        const responseText = await response.text();
        const fixedJsonText = responseText.replace(/("rbmId":\s*)(\d{16,})/g, '$1"$2"');
        const responseData = JSON.parse(fixedJsonText);
        
        if (!response.ok) {
          const errorMessage = responseData.message || `Gagal mengambil data dari server. Status: ${response.status}.`;
          throw new Error(errorMessage);
        }
        
        if (!Array.isArray(responseData)) {
            setReimbursementList([]);
        } else {
            const formattedData = responseData.map(item => ({
                ...item,
                noBukti: `#${item.rbmId.toString()}`,
                headerDate: new Date(item.rbmCreatedDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
                tanggalPeriksa: new Date(item.rbmTanggalMulai).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                yangBerobat: item.orgNama, 
                hubungan: item.orgHubungan, 
                type: item.rbmTipe,
                biayaPeriksa: parseFloat(item.rbmCost), 
                biayaDiganti: parseFloat(item.rbmCost),
                jenisPembayaran: 'Transfer', 
                status: item.rbmStatusSubmit,
            }));
            setReimbursementList(formattedData);
        }
      } catch (e) {
        console.error("Gagal mengambil data reimbursement:", e);
        setError(e); 
      } finally {
        setIsLoading(false);
      }
    }, [appliedYear, KARYAWAN_INFO.NPK]);

  useFocusEffect(
    useCallback(() => {
      fetchReimbursements();
    }, [fetchReimbursements])
  );

  useEffect(() => {
    const fetchEarliestYear = async () => {
      try {
        const serverIP = await getServerIP();
        const url = `http://${serverIP}:8080/reimbursement/earliest-year`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.earliestYear) {
          setEarliestYear(data.earliestYear);
          if (appliedYear > currentYear || appliedYear < data.earliestYear) {
            setAppliedYear(currentYear);
            setTempSelectedYear(currentYear);
          }
        }
      } catch (error) {
        console.warn("Gagal memuat tahun paling awal:", error);
      }
    };
    fetchEarliestYear();
  }, []);

  const displayData = useMemo(() => {
    let filteredList = reimbursementList;
    if (activeTab === "Setujui") {
      filteredList = reimbursementList.filter(item => item.status === "Menunggu Persetujuan");
    }
    return filteredList.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));
  }, [activeTab, reimbursementList]);
  
  const openYearModal = () => { setTempSelectedYear(appliedYear); setYearModalVisible(true); };
  const handleApplyYear = () => { setAppliedYear(tempSelectedYear); setYearModalVisible(false); };
  const handleBackFromModal = () => { setYearModalVisible(false); };
  
  // ========================================================
  // [MODIFIKASI 2]: Ubah fungsi ini untuk membuka modal kustom
  // ========================================================
  const showGuidancePopup = () => setInfoPopupVisible(true);
  
  const changeTempYear = (direction) => {
    const currentIndex = years.indexOf(tempSelectedYear);
    if (direction === 'up' && currentIndex > 0) { setTempSelectedYear(years[currentIndex - 1]); } 
    else if (direction === 'down' && currentIndex < years.length - 1) { setTempSelectedYear(years[currentIndex + 1]); }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#2A458A" />
          <Text style={styles.loadingText}>Memuat Daftar Pengajuan...</Text>
        </View>
      );
    }
    if (error) {
       return (
        <View style={styles.centeredContainer}>
          <MaterialIcons name="error-outline" size={48} color="#D32F2F" />
          <Text style={styles.errorText}>Gagal memuat data</Text>
          <Text style={styles.errorSubText}>{error.message}</Text>
        </View>
      );
    }
    return (
        <>
            <Text style={styles.listTitle}>Daftar Pengajuan Reimbursement</Text>
            <View style={styles.tabContainer}>
            {["Semua", "Setujui"].map((tab) => (
                <TouchableOpacity key={tab} style={[styles.tabItem, activeTab === tab && styles.tabItemActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                </TouchableOpacity>
            ))}
            </View>
            
            {displayData.length > 0 ? (
                displayData.map((item, index) => {
                    const statusInfo = getStatusInfo(item.status);
                    const displayBiayaDiganti = ["Disetujui", "Paid"].includes(item.status) ? item.biayaDiganti : 0;

                    return (
                        <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate("LihatReimbursementAtasan", { itemData: {...item, biayaPeriksa: formatCurrency(item.biayaPeriksa), biayaDiganti: formatCurrency(item.biayaDiganti)}})}>
                            <View style={styles.cardHeader}><Text style={styles.cardTitle}>No. Bukti {item.noBukti}</Text><Text style={styles.cardHeaderDate}>{item.headerDate}</Text></View>
                            <View style={styles.cardBody}><DetailRow label="Tanggal Periksa" value={item.tanggalPeriksa} /><DetailRow label="Yang Berobat" value={item.yangBerobat} /><DetailRow label="Hubungan" value={item.hubungan} /><DetailRow label="Jenis Claim" value={item.type} /><DetailRow label="Biaya Periksa" value={formatCurrency(item.biayaPeriksa)} /><DetailRow label="Biaya Diganti" value={formatCurrency(displayBiayaDiganti)} /><DetailRow label="Jenis Pembayaran" value={item.jenisPembayaran} /><DetailRow label="Status" value={statusInfo.text} valueStyle={{ color: statusInfo.color, fontWeight: "bold" }} /></View>
                        </TouchableOpacity>
                    )
                })
            ) : (<View style={styles.emptyContainer}><Text style={styles.emptyText}>Tidak ada data pengajuan pada tab ini untuk tahun {appliedYear}.</Text></View>)}
            <View style={{height: 20}} />
        </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2A458A" />
      
      <View style={styles.blueSection}>
        <ImageBackground source={require("../../../../assets/bg_navbartop_index_reimbursement.png")} style={styles.header} resizeMode="cover">
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
          <Text style={styles.headerText}>Menu Reimbursement</Text>
          <TouchableOpacity><Ionicons name="help-circle-outline" size={26} color="#fff" /></TouchableOpacity>
        </ImageBackground>
        
        <ImageBackground source={require("../../../../assets/bg_navbarbot_index_reimbursement.png")} style={styles.blueContent} resizeMode="cover">
          <TouchableOpacity style={styles.yearSelector} onPress={openYearModal}>
            <Text style={styles.yearText}>{appliedYear}</Text><Ionicons name="search-outline" size={22} color="#2A458A" />
          </TouchableOpacity>
          <View style={styles.approvalHeader}>
            <Text style={styles.subHeaderText}>Approval Reimbursement Uang Obat</Text>
            <View style={styles.headerRightContainer}>
                <Text style={styles.headerSeparator}>|</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}><MaterialIcons name="book" size={22} color="#FFFFFF" /></TouchableOpacity>
            </View>
          </View>
          <PanduanCuti visible={modalVisible} onClose={() => setModalVisible(false)}/>
        </ImageBackground>
      </View>

      <ScrollView style={styles.whiteSection} showsVerticalScrollIndicator={false}>
          {renderContent()}
      </ScrollView>

      {/* Modal Filter Tahun */}
      <Modal animationType="fade" transparent={true} visible={isYearModalVisible} onRequestClose={handleBackFromModal}><TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={handleBackFromModal}><View style={styles.modalContent}><View style={styles.modalHeader}><TouchableOpacity onPress={handleBackFromModal} style={styles.modalBackIcon}><Ionicons name="chevron-back" size={28} color="#2A458A" /></TouchableOpacity><Text style={styles.modalTitle}>Filter Tahun</Text><TouchableOpacity onPress={showGuidancePopup}><Ionicons name="help-circle-outline" size={26} color="#2A458A" /></TouchableOpacity></View><View style={styles.yearPickerContainer}><TouchableOpacity onPress={() => changeTempYear('up')}><Ionicons name="chevron-up" size={32} color="#2A458A" /></TouchableOpacity><View style={styles.yearDisplay}><Text style={styles.yearTextInactive}>{years[years.indexOf(tempSelectedYear) - 1] || ""}</Text><Text style={styles.yearTextActive}>{tempSelectedYear}</Text><Text style={styles.yearTextInactive}>{years[years.indexOf(tempSelectedYear) + 1] || ""}</Text></View><TouchableOpacity onPress={() => changeTempYear('down')}><Ionicons name="chevron-down" size={32} color="#2A458A" /></TouchableOpacity></View><TouchableOpacity style={styles.applyButton} onPress={handleApplyYear}><Text style={styles.applyButtonText}>Terapkan</Text></TouchableOpacity></View></TouchableOpacity></Modal>

      {/* ============================================== */}
      {/* [MODIFIKASI 3]: Tambahkan JSX untuk popup info */}
      {/* ============================================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isInfoPopupVisible}
        onRequestClose={() => setInfoPopupVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={() => setInfoPopupVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.infoModalContent}>
              <Ionicons 
                name="information-circle-outline" 
                size={50} 
                color="#2A458A"
                style={styles.infoModalIcon}
              />
              <Text style={styles.infoModalTitle}>Informasi</Text>
              <Text style={styles.infoModalMessage}>
                Tahun yang muncul berdasarkan pengajuan yang dibuat pertama kali sampai saat ini.
              </Text>
              <TouchableOpacity 
                style={styles.infoModalButton} 
                onPress={() => setInfoPopupVisible(false)}
              >
                <Text style={styles.infoModalButtonText}>Mengerti</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

export default ReimbursementScreenAtasan;

// ==========================================================
// [MODIFIKASI 4]: Tambahkan style baru di bawah ini
// ==========================================================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F7FC" },
  blueSection: { backgroundColor: "#2A458A", paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 15, paddingHorizontal: 16 },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  blueContent: { paddingHorizontal: 16, paddingTop: 4 },
  yearSelector: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: {width: 0, height: 1}, },
  yearText: { fontSize: 16, color: "#2A458A", fontWeight: 'bold' },
  approvalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingBottom: 10 },
  headerRightContainer: { flexDirection: 'row', alignItems: 'center' },
  headerSeparator: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 20, marginRight: 12 },
  subHeaderText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  whiteSection: { flex: 1, backgroundColor: '#F4F7FC', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -30, paddingTop: 20, paddingHorizontal: 16, },
  listTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 16 },
  tabContainer: { flexDirection: "row", marginBottom: 16 },
  tabItem: { paddingBottom: 8, marginRight: 24 },
  tabItemActive: { borderBottomWidth: 3, borderBottomColor: "#395BA9" },
  tabText: { fontSize: 16, color: "#9CA3AF", fontWeight: "500" },
  tabTextActive: { color: "#395BA9", fontWeight: "bold" },
  card: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: {width: 0, height: 1}, shadowRadius: 3 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1F2937" },
  cardHeaderDate: { fontSize: 13, color: "#6B7280" },
  cardBody: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  detailLabel: { fontSize: 14, color: "#9CA3AF" },
  detailValue: { fontSize: 14, color: "#1F2937", fontWeight: "bold", textAlign: 'right' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, },
  emptyText: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, minHeight: 200 },
  loadingText: { marginTop: 10, fontSize: 16, color: '#1F2937' },
  errorText: { marginTop: 10, fontSize: 18, fontWeight: 'bold', color: '#D32F2F', textAlign: 'center' },
  errorSubText: { marginTop: 4, fontSize: 14, color: '#6B7280', textAlign: 'center'},
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "white", borderRadius: 16, padding: 20, width: "80%", elevation: 10 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalBackIcon: { marginRight: 12 },
  modalTitle: { flex: 1, fontSize: 20, fontWeight: "bold", color: '#2A458A' },
  yearPickerContainer: { alignItems: 'center', justifyContent: 'center' },
  yearDisplay: { marginVertical: 10, alignItems: 'center' },
  yearTextInactive: { fontSize: 22, color: '#D1D5DB', fontWeight: '500' },
  yearTextActive: { fontSize: 36, fontWeight: 'bold', color: '#2A458A', marginVertical: 8, textAlign: 'center'},
  applyButton: { backgroundColor: '#2A458A', borderRadius: 8, paddingVertical: 14, marginTop: 24, alignItems: 'center' },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  // Style untuk Popup Informasi
  infoModalContent: {
    width: '85%',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  infoModalIcon: {
    marginBottom: 15,
  },
  infoModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoModalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  infoModalButton: {
    backgroundColor: '#2A458A',
    borderRadius: 10,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  infoModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});