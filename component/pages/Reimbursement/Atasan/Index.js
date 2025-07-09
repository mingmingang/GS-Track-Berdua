import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  ImageBackground,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PanduanCuti from "../../../part/PanduanCutiReimburse";

// --- DATA DUMMY ---
const reimbursementData = [
  { noBukti: "#217727", headerDate: "Kamis, 09 Jan 2025", tanggalPeriksa: "Kamis, 09 Jan 2025", yangBerobat: "Elshanum Widya Safira", hubungan: "ANAK", type: "Rawat Jalan", biayaPeriksa: "Rp. 1.208.570", biayaDiganti: "Rp. 1.208.570", jenisPembayaran: "Transfer", status: "Fully Approved" },
  { noBukti: "#223050", headerDate: "Senin, 10 Feb 2025", tanggalPeriksa: "Senin, 10 Feb 2025", yangBerobat: "Maudy Ayunda", hubungan: "ISTRI", type: "Maternity", biayaPeriksa: "Rp. 16.070.090", biayaDiganti: "Rp. 16.070.090", jenisPembayaran: "Transfer", status: "Waiting for Verification" },
  { noBukti: "#204511", headerDate: "Selasa, 15 Okt 2024", tanggalPeriksa: "Selasa, 15 Okt 2024", yangBerobat: "Pengguna", hubungan: "KARYAWAN", type: "Rawat Jalan", biayaPeriksa: "Rp. 550.000", biayaDiganti: "Rp. 550.000", jenisPembayaran: "Transfer", status: "Fully Approved" },
  { noBukti: "#209987", headerDate: "Jumat, 20 Des 2024", tanggalPeriksa: "Jumat, 20 Des 2024", yangBerobat: "Elshanum Widya Safira", hubungan: "ANAK", type: "Rawat Inap", biayaPeriksa: "Rp. 2.500.000", biayaDiganti: "Rp. 2.500.000", jenisPembayaran: "Transfer", status: "Waiting Approval" },
  { noBukti: "#205123", headerDate: "Jumat, 22 Nov 2024", tanggalPeriksa: "Jumat, 22 Nov 2024", yangBerobat: "Jesse Jisseok Choi", hubungan: "SUAMI", type: "Rawat Jalan", biayaPeriksa: "Rp. 400.000", biayaDiganti: "Rp. 0", jenisPembayaran: "Transfer", status: "Canceled" },
  { noBukti: "#198345", headerDate: "Rabu, 01 Mar 2023", tanggalPeriksa: "Rabu, 01 Mar 2023", yangBerobat: "Maudy Ayunda", hubungan: "ISTRI", type: "Maternity", biayaPeriksa: "Rp. 12.000.000", biayaDiganti: "Rp. 12.000.000", jenisPembayaran: "Transfer", status: "Fully Approved" },
  { noBukti: "#188888", headerDate: "Senin, 05 Sep 2022", tanggalPeriksa: "Senin, 05 Sep 2022", yangBerobat: "Jesse Jisseok Choi", hubungan: "SUAMI", type: "Rawat Jalan", biayaPeriksa: "Rp. 350.000", biayaDiganti: "Rp. 350.000", jenisPembayaran: "Transfer", status: "Fully Approved" },
];

const annualPlafonds = { 2025: 20000000, 2024: 15000000, 2023: 12500000, 2022: 10000000 };
const DEFAULT_PLAFOND = 10000000;

// --- HELPER FUNCTIONS ---
const statusMap = {
  "Waiting Approval":       { text: "Menunggu Persetujuan", color: "#0288D1", order: 1 },
  "Waiting for Verification": { text: "Belum Diverifikasi",   color: "#FFA000", order: 2 },
  "Fully Approved":         { text: "Disetujui",              color: "#4CAF50", order: 3 },
  "Canceled":               { text: "Dibatalkan",             color: "#FF0000", order: 4 },
};

const getStatusDetails = (status) => {
  return statusMap[status] || { text: status, color: "#333", order: 99 };
};
const parseCurrency = (currencyString) => {
    if (typeof currencyString !== 'string') return 0;
    return parseInt(currencyString.replace(/[^0-9]/g, ''), 10) || 0;
};
const formatCurrency = (number) => `Rp. ${new Intl.NumberFormat('id-ID').format(number)}`;
const DetailRow = ({ label, value, valueStyle }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
  </View>
);

// --- MAIN COMPONENT ---
const ReimbursementScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Semua");
  const [isYearModalVisible, setYearModalVisible] = useState(false);
  const currentYear = new Date().getFullYear();
  const [appliedYear, setAppliedYear] = useState(currentYear);
  const [tempSelectedYear, setTempSelectedYear] = useState(currentYear);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const [modalVisible, setModalVisible] = useState(false);

  const displayData = useMemo(() => {
    const yearFiltered = reimbursementData.filter(item => 
      parseInt(item.headerDate.split(' ')[3], 10) === appliedYear
    );
    
    const sortedData = yearFiltered.sort((a, b) => {
      const orderA = getStatusDetails(a.status).order;
      const orderB = getStatusDetails(b.status).order;
      return orderA - orderB;
    });

    if (activeTab === "Setujui") {
      return sortedData.filter(item => item.status === "Waiting Approval");
    }

    return sortedData;
  }, [appliedYear, activeTab]);
  
  const openYearModal = () => { setTempSelectedYear(appliedYear); setYearModalVisible(true); };
  const handleApplyYear = () => { setAppliedYear(tempSelectedYear); setYearModalVisible(false); };
  const handleBackFromModal = () => { setYearModalVisible(false); };
  const showGuidancePopup = () => Alert.alert( "Informasi", "Tahun yang muncul dan dapat dipilih adalah tahun sejak Anda masuk bekerja sampai sekarang.", [{ text: "Mengerti" }] );
  const changeTempYear = (direction) => {
    const currentIndex = years.indexOf(tempSelectedYear);
    if (direction === 'up' && currentIndex > 0) { setTempSelectedYear(years[currentIndex - 1]); } 
    else if (direction === 'down' && currentIndex < years.length - 1) { setTempSelectedYear(years[currentIndex + 1]); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2A458A" />
      
      {/* ===== BLUE SECTION ===== */}
      <View style={styles.blueSection}>
        <ImageBackground
          source={require("../../../../assets/bg_navbartop_index_reimbursement.png")}
          style={styles.header}
          resizeMode="cover"
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Menu Reimbursement</Text>
          <TouchableOpacity>
            <Ionicons name="help-circle-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </ImageBackground>
        
        <ImageBackground
          source={require("../../../../assets/bg_navbarbot_index_reimbursement.png")}
          style={styles.blueContent}
          resizeMode="cover"
        >
          <TouchableOpacity style={styles.yearSelector} onPress={openYearModal}>
            <Text style={styles.yearText}>{appliedYear}</Text>
            <Ionicons name="search-outline" size={22} color="#2A458A" />
          </TouchableOpacity>

          <View style={styles.approvalHeader}>
            <Text style={styles.subHeaderText}>Approval Reimbursement Uang Obat</Text>
            <View style={styles.headerRightContainer}>
                <Text style={styles.headerSeparator}>|</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <MaterialIcons name="book" size={22} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
          </View>
          <PanduanCuti
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />
        </ImageBackground>
      </View>

      {/* ===== SCROLLABLE WHITE SECTION ===== */}
      <ScrollView style={styles.whiteSection} showsVerticalScrollIndicator={false}>
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
                const statusDetails = getStatusDetails(item.status);
                return (
                    <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate("LihatReimbursement", { itemData: item })}>
                        <View style={styles.cardHeader}><Text style={styles.cardTitle}>No. Bukti {item.noBukti}</Text><Text style={styles.cardHeaderDate}>{item.headerDate}</Text></View>
                        <View style={styles.cardBody}>
                            <DetailRow label="Tanggal Periksa" value={item.tanggalPeriksa} />
                            <DetailRow label="Yang Berobat" value={item.yangBerobat} />
                            <DetailRow label="Hubungan" value={item.hubungan} />
                            <DetailRow label="Type" value={item.type} />
                            <DetailRow label="Biaya Periksa" value={item.biayaPeriksa} />
                            <DetailRow label="Biaya Diganti" value={item.biayaDiganti} />
                            <DetailRow label="Jenis Pembayaran" value={item.jenisPembayaran} />
                            <DetailRow 
                                label="Status" 
                                value={statusDetails.text} 
                                valueStyle={{ color: statusDetails.color, fontWeight: "bold" }}
                            />
                        </View>
                    </TouchableOpacity>
                )
            })
          ) : (<View style={styles.emptyContainer}><Text style={styles.emptyText}>Tidak ada data pengajuan pada tahun {appliedYear}.</Text></View>)}
      </ScrollView>

      {/* Modal */}
      <Modal animationType="fade" transparent={true} visible={isYearModalVisible} onRequestClose={handleBackFromModal}><TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={handleBackFromModal}><View style={styles.modalContent}><View style={styles.modalHeader}><TouchableOpacity onPress={handleBackFromModal} style={styles.modalBackIcon}><Ionicons name="chevron-back" size={28} color="#2A458A" /></TouchableOpacity><Text style={styles.modalTitle}>Filter Tahun</Text><TouchableOpacity onPress={showGuidancePopup}><Ionicons name="help-circle-outline" size={26} color="#2A458A" /></TouchableOpacity></View><View style={styles.yearPickerContainer}><TouchableOpacity onPress={() => changeTempYear('up')}><Ionicons name="chevron-up" size={32} color="#2A458A" /></TouchableOpacity><View style={styles.yearDisplay}><Text style={styles.yearTextInactive}>{years[years.indexOf(tempSelectedYear) - 1] || ""}</Text><Text style={styles.yearTextActive}>{tempSelectedYear}</Text><Text style={styles.yearTextInactive}>{years[years.indexOf(tempSelectedYear) + 1] || ""}</Text></View><TouchableOpacity onPress={() => changeTempYear('down')}><Ionicons name="chevron-down" size={32} color="#2A458A" /></TouchableOpacity></View><TouchableOpacity style={styles.applyButton} onPress={handleApplyYear}><Text style={styles.applyButtonText}>Terapkan</Text></TouchableOpacity></View></TouchableOpacity></Modal>
    </SafeAreaView>
  );
};

export default ReimbursementScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F7FC" },
  // --- PERBAIKAN 1: MENGURANGI PADDING ---
  blueSection: { backgroundColor: "#2A458A", paddingBottom: 40 }, // Nilai diubah dari 70 menjadi 40
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingVertical: 15, 
    paddingHorizontal: 16 
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  blueContent: { 
    paddingHorizontal: 16,
    paddingTop: 4 
  },
  yearSelector: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: {width: 0, height: 1}, },
  yearText: { fontSize: 16, color: "#2A458A", fontWeight: 'bold' },
  approvalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 10,
  },
  headerRightContainer: {
      flexDirection: 'row',
      alignItems: 'center'
  },
  headerSeparator: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: 20,
      marginRight: 12,
  },
  subHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  // --- PERBAIKAN 2: MENYESUAIKAN MARGIN TOP NEGATIF ---
  whiteSection: { 
    flex: 1, 
    backgroundColor: '#F4F7FC', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    marginTop: -30, // Nilai diubah dari -60 menjadi -30
    paddingTop: 20, // Mengurangi padding top sedikit
    paddingHorizontal: 16, 
  },
  // --- PERBAIKAN 3: MENGHAPUS MARGIN DARI JUDUL ---
  listTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#111827", 
    marginBottom: 16 // Margin atas dihapus, margin bawah ditambah sedikit
  },
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
  emptyText: { fontSize: 16, color: '#6B7280' },
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
});