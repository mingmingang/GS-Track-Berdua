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

// --- PERBAIKAN 1: STATUS DAN WARNA ---
// Fungsi ini menggabungkan terjemahan status dan warna
const getStatusInfo = (status) => {
  switch (status) {
    case "Waiting Approval":
      return { text: "Menunggu Persetujuan", color: "#0288D1" }; // Biru
    case "Waiting for Verification":
      return { text: "Belum Diverifikasi", color: "#FFA000" }; // Kuning
    case "Fully Approved":
      return { text: "Disetujui", color: "#4CAF50" }; // Hijau
    case "Canceled":
      return { text: "Dibatalkan", color: "#FF0000" }; // Merah
    default:
      return { text: status, color: "#333" };
  }
};

// --- PERBAIKAN 5: URUTAN STATUS ---
// Objek untuk menentukan urutan sorting
const statusOrder = {
  "Waiting Approval": 1,
  "Waiting for Verification": 2,
  "Fully Approved": 3,
  "Canceled": 4,
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
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isYearModalVisible, setYearModalVisible] = useState(false);
  const [selectedClaimType, setSelectedClaimType] = useState(null);
  const currentYear = new Date().getFullYear();
  const [appliedYear, setAppliedYear] = useState(currentYear);
  const [tempSelectedYear, setTempSelectedYear] = useState(currentYear);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const [modalVisible, setModalVisible] = useState(false);

  const summaryValues = useMemo(() => {
    const plafon = annualPlafonds[appliedYear] || DEFAULT_PLAFOND;
    const digunakan = reimbursementData
      .filter(item => parseInt(item.headerDate.split(' ')[3], 10) === appliedYear && item.status === "Fully Approved")
      .reduce((sum, item) => sum + parseCurrency(item.biayaDiganti), 0);
    const sisa = plafon - digunakan;
    return { plafon, digunakan, sisa };
  }, [appliedYear]);
  
  // --- PERBAIKAN 5: LOGIKA SORTING ---
  const displayData = useMemo(() => {
    const yearFiltered = reimbursementData.filter(item => parseInt(item.headerDate.split(' ')[3], 10) === appliedYear);
    
    const finalStatuses = ["Fully Approved", "Canceled"];
    const tabFiltered = activeTab === 'On Progress' ? yearFiltered.filter(item => !finalStatuses.includes(item.status)) : yearFiltered;
    
    // Menambahkan .sort() untuk mengurutkan data sesuai 'statusOrder'
    return tabFiltered.sort((a, b) => {
      const orderA = statusOrder[a.status] || 99;
      const orderB = statusOrder[b.status] || 99;
      return orderA - orderB;
    });
  }, [appliedYear, activeTab]);
  
  const claimTypes = ["Rawat Jalan", "Rawat Inap", "Maternity", "KB"];
  const handleClaimPress = () => {
    if (selectedClaimType) { 
        navigation.navigate("TambahReimbursement", { type: selectedClaimType });
    } else { 
        Alert.alert( "Jenis Reimbursement belum dipilih!", "Silahkan pilih jenis reimbursement terlebih dahulu" ); 
    }
  };
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

          <View style={styles.summaryContainerWhite}>

            {/* --- PERBAIKAN 6: POSISI TEKS & IKON --- */}
            <View style={styles.sisaTitleContainer}>
              <Text style={styles.sisaTitle}>Plafon Reimbursement Obat</Text>
              <View style={styles.iconsRightContainer}>
                  <Text style={styles.iconSeparator}>|</Text>
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <MaterialIcons name="book" size={22} color="#1E2D56" />
                  </TouchableOpacity>
              </View>
            </View>

            <PanduanCuti
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
            />
            {/* --- AKHIR PERBAIKAN 6 --- */}
            
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValueGreen}>{formatCurrency(summaryValues.plafon)}</Text>
                <Text style={styles.summaryLabel}>Plafon</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValueRed}>{formatCurrency(summaryValues.digunakan)}</Text>
                <Text style={styles.summaryLabel}>Digunakan</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValueBlack}>{formatCurrency(summaryValues.sisa)}</Text>
                <Text style={styles.summaryLabel}>Sisa</Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Biaya yang sedang diajukan belum mengurangi sisa plafon.</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* ===== SCROLLABLE WHITE SECTION ===== */}
      <ScrollView style={styles.whiteSection} showsVerticalScrollIndicator={false}>
          <View style={styles.claimActionContainer}>
            <TouchableOpacity style={selectedClaimType ? styles.actionButtonEnabled : styles.actionButtonDisabled} onPress={handleClaimPress} disabled={!selectedClaimType}>
              <Text style={selectedClaimType ? styles.actionTextEnabled : styles.actionTextDisabled}>Claim Pengobatan / Perawatan ?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => setDropdownOpen(!isDropdownOpen)}>
              <Text style={styles.dropdownButtonText}>{selectedClaimType || "Ajukan Claim"}</Text>
              <Ionicons name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#395BA9" />
            </TouchableOpacity>
            {isDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {claimTypes.map((type) => (
                  <TouchableOpacity key={type} style={styles.dropdownItem} onPress={() => { setSelectedClaimType(type); setDropdownOpen(false); }}>
                    <Text style={styles.dropdownItemText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text style={styles.listTitle}>Daftar Pengajuan Uang Obat</Text>
          <View style={styles.tabContainer}>
            {["Semua", "On Progress"].map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tabItem, activeTab === tab && styles.tabItemActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {displayData.length > 0 ? (
            displayData.map((item, index) => {
              // Mengambil info status (teks dan warna)
              const statusInfo = getStatusInfo(item.status);
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
                        {/* --- PERBAIKAN 1 & 2 (IMPLEMENTASI) --- */}
                        <DetailRow label="Status" value={statusInfo.text} valueStyle={{ color: statusInfo.color, fontWeight: "bold" }}/>
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
  blueSection: { backgroundColor: "#2A458A", paddingBottom: 70 }, 
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
  summaryContainerWhite: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 20, elevation: 3 },
  // Style untuk perbaikan #6
  sisaTitleContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sisaTitle: { fontSize: 14, fontWeight: "bold", color: "#1F2937", flex: 1 }, // flex:1 agar teks mengambil ruang sisa
  iconsRightContainer: { flexDirection: "row", alignItems: "center" },
  iconSeparator: { color: '#D1D5DB', fontSize: 22, fontWeight: '200', paddingHorizontal: 8 },
  // Akhir style perbaikan #6
  summaryCard: { flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  summaryItem: { alignItems: "center", flex: 1 },
  summaryLabel: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  summaryValueGreen: { fontSize: 16, fontWeight: "bold", color: "#16A34A" },
  summaryValueRed: { fontSize: 16, fontWeight: "bold", color: "#DC2626" },
  summaryValueBlack: { fontSize: 16, fontWeight: "bold", color: "#1F2937" },
  separator: { width: 1, height: "80%", backgroundColor: "#E5E7EB" },
  infoBox: { backgroundColor: "#EAF2FF", padding: 12, borderRadius: 8, marginTop: 16 },
  infoText: { fontSize: 12, color: "#395BA9", textAlign: "center", lineHeight: 16 },
  whiteSection: { flex: 1, backgroundColor: '#F4F7FC', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -60, paddingTop: 24, paddingHorizontal: 16, },
  claimActionContainer: { zIndex: 1 }, 
  actionButtonDisabled: { backgroundColor: "#E5E7EB", padding: 14, borderRadius: 8, alignItems: "center" },
  actionTextDisabled: { color: "#9CA3AF", fontSize: 15, fontWeight: "500" },
  actionButtonEnabled: { backgroundColor: "#395BA9", padding: 14, borderRadius: 8, alignItems: "center" },
  actionTextEnabled: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  dropdownButton: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: "#D1D5DB", marginTop: 8 },
  dropdownButtonText: { color: "#395BA9", fontSize: 15, fontWeight: "bold" },
  dropdownMenu: { position: 'absolute', top: 110, left: 0, right: 0, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', marginTop: 4, elevation: 5 },
  dropdownItem: { paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownItemText: { fontSize: 15, color: '#1F2937' },
  listTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", marginTop: 24, marginBottom: 12 },
  tabContainer: { flexDirection: "row", marginBottom: 16 },
  tabItem: { paddingBottom: 8, marginRight: 24 },
  tabItemActive: { borderBottomWidth: 3, borderBottomColor: "#395BA9" },
  tabText: { fontSize: 16, color: "#9CA3AF", fontWeight: "500" },
  tabTextActive: { color: "#395BA9", fontWeight: "bold" },
  card: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 16, elevation: 2 },
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
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});