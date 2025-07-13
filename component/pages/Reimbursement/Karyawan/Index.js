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
  Alert,
  ImageBackground,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import PanduanCuti from "../../../part/PanduanCutiReimburse";
import { getServerIP } from "../../../backbone/ApiConfig";
import { AuthContext } from "../../../backbone/AuthContext";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PLAFON_CONFIG = {
    RAWAT_INAP: { plafon: 'unlimited' },
    MATERNITY: { plafon: 'unlimited' },
    KB: { plafon: 830000, periodeTahun: 3 },
    RAWAT_JALAN: {
        'Gol.1-3': { 'Kawin': 10000000, 'Lajang': 5800000 },
        'Gol.4up': { 'Kawin': 11000000, 'Lajang': 7000000 }
    }
};

const getPlafonRawatJalan = (golongan, status) => {
    const grupGolongan = golongan >= 4 ? 'Gol.4up' : 'Gol.1-3';
    return PLAFON_CONFIG.RAWAT_JALAN[grupGolongan]?.[status] || 0;
};

const getStatusInfo = (status) => {
  switch (status) {
    case "Menunggu Persetujuan": return { text: "Menunggu Persetujuan", color: "#0288D1" };
    case "Belum Diverifikasi": return { text: "Belum Diverifikasi", color: "#FFA000" };
    case "Disetujui": return { text: "Disetujui", color: "#4CAF50" };
    case "Dibatalkan": return { text: "Dibatalkan", color: "#FF0000" };
    case "Paid": return { text: "Telah Dibayar", color: "#4CAF50" };
    default: return { text: status, color: "#333" };
  }
};
const statusOrder = { "Menunggu Persetujuan": 1, "Belum Diverifikasi": 2, "Disetujui": 3, "Paid": 4, "Dibatalkan": 5 };
const parseCurrency = (currencyString) => {
    if (typeof currencyString !== 'string') return 0;
    return parseInt(currencyString.replace(/[^0-9]/g, ''), 10) || 0;
};
const formatCurrency = (number) => {
    if (typeof number === 'string' && number.toLowerCase() === 'unlimited') return 'Unlimited';
    if (isNaN(number)) return 'Rp. 0';
    return `Rp. ${new Intl.NumberFormat('id-ID').format(number)}`;
};
const DetailRow = ({ label, value, valueStyle }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
  </View>
);

const ReimbursementScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Semua");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isYearModalVisible, setYearModalVisible] = useState(false);
  const [selectedClaimType, setSelectedClaimType] = useState(null);
  const currentYear = new Date().getFullYear();
  const [appliedYear, setAppliedYear] = useState(currentYear);
  const [tempSelectedYear, setTempSelectedYear] = useState(currentYear);
  const [modalVisible, setModalVisible] = useState(false);
  const [reimbursementList, setReimbursementList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSummaryExpanded, setSummaryExpanded] = useState(true);
  const [isInfoPopupVisible, setInfoPopupVisible] = useState(false);

  const KARYAWAN_INFO = {
      NPK: user?.npk,
      GOLONGAN: parseInt(user?.golongan, 10), 
      STATUS: user?.statusKawin,
      KRY_CREATED_DATE: user?.createdDate,
  };
  
  const years = useMemo(() => {
    if (!KARYAWAN_INFO.KRY_CREATED_DATE) {
        return Array.from({ length: 10 }, (_, i) => currentYear - i);
    }
    const startYear = new Date(KARYAWAN_INFO.KRY_CREATED_DATE).getFullYear();
    const yearCount = currentYear - startYear + 1;
    return Array.from({ length: yearCount }, (_, i) => currentYear - i);
  }, [KARYAWAN_INFO.KRY_CREATED_DATE, currentYear]);


  const fetchReimbursements = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      setReimbursementList([])
      try {
        const serverIP = await getServerIP();
        const url = `http://${serverIP}:8080/reimbursement/list-karyawan?npk=${KARYAWAN_INFO.NPK}&year=${appliedYear}`;
        
        console.log(`Fetching data from: ${url}`);
        const response = await fetch(url);
        const responseText = await response.text();
        const fixedJsonText = responseText.replace(/("rbmId":\s*)(\d{16,})/g, '$1"$2"');
        const responseData = JSON.parse(fixedJsonText);
        
        if (!response.ok && responseData?.message?.includes('No reimbursements found')) {
            console.log("No data found for the given criteria, setting list to empty.");
        } else if (!response.ok) {
            const errorMessage = responseData.message || `Gagal mengambil data. Status: ${response.status}`;
            throw new Error(errorMessage);
        } else {
            if (Array.isArray(responseData)) {
                const formattedData = responseData.map(item => ({
                    ...item,
                    noBukti: `#${item.rbmId.toString()}`,
                    headerDate: new Date(item.rbmCreatedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
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
            } else {
                console.log("Data yang diterima bukan array, dianggap sebagai list kosong:", responseData);
                setReimbursementList([]);
            }
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
      return () => {};
    }, [fetchReimbursements])
  );

  const summaryByCategory = useMemo(() => {
    const approvedReimbursements = reimbursementList.filter(item => ["Disetujui", "Paid"].includes(item.status));
    const usage = {
      'Rawat Jalan': approvedReimbursements.filter(i => i.type === 'Rawat Jalan').reduce((sum, item) => sum + item.biayaDiganti, 0),
      'Maternity': approvedReimbursements.filter(i => i.type === 'Maternity').reduce((sum, item) => sum + item.biayaDiganti, 0),
      'KB': approvedReimbursements.filter(i => i.type === 'KB').reduce((sum, item) => sum + item.biayaDiganti, 0),
      'Rawat Inap': approvedReimbursements.filter(i => i.type === 'Rawat Inap').reduce((sum, item) => sum + item.biayaDiganti, 0),
    };
    
    const employeeStartYear = KARYAWAN_INFO.KRY_CREATED_DATE ? new Date(KARYAWAN_INFO.KRY_CREATED_DATE).getFullYear() : currentYear;
    const cycleStartYear = employeeStartYear + Math.floor((appliedYear - employeeStartYear) / 3) * 3;
    const cycleEndYear = cycleStartYear + 2;
    const kbNote = `Plafon untuk periode ${cycleStartYear} - ${cycleEndYear}`;
    
    const plafonRawatJalan = getPlafonRawatJalan(KARYAWAN_INFO.GOLONGAN, KARYAWAN_INFO.STATUS);
    const jikaKawin = `${KARYAWAN_INFO.STATUS === 'Kawin' ? 'Keluarga' : 'Lajang'}`;

    return {
        'Rawat Jalan': { title: `Rawat Jalan (${jikaKawin || 'N/A'})`, plafon: plafonRawatJalan, digunakan: usage['Rawat Jalan'], sisa: plafonRawatJalan - usage['Rawat Jalan'] },
        'Maternity': { title: 'Maternity', plafon: PLAFON_CONFIG.MATERNITY.plafon, digunakan: usage['Maternity'], sisa: 'unlimited' },
        'KB': { title: 'Kawin Berencana (KB)', plafon: PLAFON_CONFIG.KB.plafon, digunakan: usage['KB'], sisa: PLAFON_CONFIG.KB.plafon - usage['KB'], note: kbNote },
        'Rawat Inap': { title: 'Rawat Inap', plafon: PLAFON_CONFIG.RAWAT_INAP.plafon, digunakan: usage['Rawat Inap'], sisa: 'unlimited' },
    };
  }, [reimbursementList, appliedYear, KARYAWAN_INFO]); 
  
  const displayData = useMemo(() => {
    const finalStatuses = ["Disetujui", "Dibatalkan", "Paid"];
    const tabFiltered = activeTab === 'On Progress' ? reimbursementList.filter(item => !finalStatuses.includes(item.status)) : reimbursementList;
    return tabFiltered.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));
  }, [activeTab, reimbursementList]); 
  
  const toggleSummary = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSummaryExpanded(!isSummaryExpanded);
  };
  
  const claimTypes = ["Rawat Jalan", "Rawat Inap", "Maternity", "KB"];
  const handleClaimPress = () => { if (selectedClaimType) { navigation.navigate("TambahReimbursement", { type: selectedClaimType }); } else { Alert.alert( "Jenis Reimbursement belum dipilih!", "Silahkan pilih jenis reimbursement terlebih dahulu" ); } };
  const openYearModal = () => { setTempSelectedYear(appliedYear); setYearModalVisible(true); };
  const handleApplyYear = () => { setAppliedYear(tempSelectedYear); setYearModalVisible(false); };
  const handleBackFromModal = () => { setYearModalVisible(false); };
  
  // ==============================================
  // [MODIFIKASI 3]: Ubah fungsi untuk menampilkan popup kustom
  // ==============================================
  const showGuidancePopup = () => {
    setInfoPopupVisible(true);
  };
  
  const changeTempYear = (direction) => { const currentIndex = years.indexOf(tempSelectedYear); if (direction === 'up' && currentIndex > 0) { setTempSelectedYear(years[currentIndex - 1]); } else if (direction === 'down' && currentIndex < years.length - 1) { setTempSelectedYear(years[currentIndex + 1]); } };
  
  const SummaryDetailRow = ({ title, plafon, digunakan, sisa, note }) => (
    <View style={styles.summaryCardRow}>
      <View style={styles.summaryCardHeader}>
          <Text style={styles.summaryCardTitle}>{title}</Text>
          {note && <Text style={styles.summaryCardNote}>{note}</Text>}
      </View>
      <View style={styles.summaryCardBody}>
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryColumnLabel}>Plafon</Text>
          <Text style={[styles.summaryColumnValue, styles.summaryValueGreen]}>{formatCurrency(plafon)}</Text>
        </View>
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryColumnLabel}>Digunakan</Text>
          <Text style={[styles.summaryColumnValue, styles.summaryValueRed]}>{formatCurrency(digunakan)}</Text>
        </View>
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryColumnLabel}>Sisa</Text>
          <Text style={[styles.summaryColumnValue, styles.summaryValueBlack]}>{formatCurrency(sisa)}</Text>
        </View>
      </View>
    </View>
  );

  const renderHeaderAndBlueSection = () => (
    <>
      <View style={styles.blueSection}>
        <ImageBackground source={require("../../../../assets/bg_navbartop_index_reimbursement.png")} style={styles.header} resizeMode="cover">
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
          <Text style={styles.headerText}>Menu Reimbursement</Text>
          <TouchableOpacity><Ionicons name="help-circle-outline" size={26} color="#fff" /></TouchableOpacity>
        </ImageBackground>
        <ImageBackground source={require("../../../../assets/bg_navbarbot_index_reimbursement.png")} style={styles.blueContent} resizeMode="cover">
          <TouchableOpacity style={styles.yearSelector} onPress={openYearModal}>
            <Text style={styles.yearText}>{appliedYear}</Text>
            <Ionicons name="search-outline" size={22} color="#2A458A" />
          </TouchableOpacity>
          <View style={styles.summaryContainerWhite}>
            <View style={styles.sisaTitleContainer}>
              <Text style={styles.sisaTitle}>Ringkasan Plafon Reimbursement</Text>
              <View style={styles.iconsRightContainer}>
                <Text style={styles.separatorLine}>|</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <MaterialIcons name="book" size={22} color="#1E2D56" />
                </TouchableOpacity>
              </View>
            </View>
            <PanduanCuti visible={modalVisible} onClose={() => setModalVisible(false)} />
            {isSummaryExpanded && (
              <>
                <View style={styles.summaryDetailContainer}>
                  <SummaryDetailRow {...summaryByCategory['Rawat Jalan']} />
                  <SummaryDetailRow {...summaryByCategory['Maternity']} />
                  <SummaryDetailRow {...summaryByCategory['KB']} />
                  <SummaryDetailRow {...summaryByCategory['Rawat Inap']} />
                </View>
                <View style={styles.infoBox}><Text style={styles.infoText}>Biaya yang sedang diajukan (On Progress) belum mengurangi sisa plafon.</Text></View>
              </>
            )}
            <TouchableOpacity onPress={toggleSummary} style={styles.summaryToggler}>
              <View style={styles.summaryTogglerLine} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#2A458A" />
        {renderHeaderAndBlueSection()}
        {isLoading ? (
            <View style={styles.centeredContainer}><ActivityIndicator size="large" color="#2A458A" /><Text style={styles.loadingText}>Memuat data...</Text></View>
        ) : error ? (
            <View style={styles.centeredContainer}><MaterialIcons name="error-outline" size={48} color="#D32F2F" /><Text style={styles.errorText}>Gagal memuat data</Text><Text style={styles.errorSubText}>{error.message}</Text></View>
        ) : (
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

                <Text style={styles.listTitle}>Daftar Pengajuan Reimbursement</Text>
                <View style={styles.tabContainer}>
                  {["Semua", "On Progress"].map((tab) => (
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
                    <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate("LihatReimbursement", { itemData: { ...item, biayaPeriksa: formatCurrency(item.biayaPeriksa), biayaDiganti: formatCurrency(item.biayaDiganti) }})}>
                        <View style={styles.cardHeader}><Text style={styles.cardTitle}>No. Bukti {item.noBukti}</Text><Text style={styles.cardHeaderDate}>{item.headerDate}</Text></View>
                        <View style={styles.cardBody}>
                            <DetailRow label="Tanggal Periksa" value={item.tanggalPeriksa} />
                            <DetailRow label="Yang Berobat" value={item.yangBerobat} /><DetailRow label="Hubungan" value={item.hubungan} />
                            <DetailRow label="Jenis Claim" value={item.type} /><DetailRow label="Biaya Periksa" value={formatCurrency(item.biayaPeriksa)} />
                            <DetailRow label="Biaya Diganti" value={formatCurrency(displayBiayaDiganti)} />
                            <DetailRow label="Jenis Pembayaran" value={item.jenisPembayaran} />
                            <DetailRow label="Status" value={statusInfo.text} valueStyle={{ color: statusInfo.color, fontWeight: "bold" }}/>
                        </View>
                    </TouchableOpacity>
                    )
                })
                ) : (
                    <>
                      <MaterialIcons name="info-outline" size={48} color="#999" style={{ alignSelf: 'center', marginTop: 40 }} />
                      <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginTop: 8 }}>Belum Ada Pengajuan</Text>
                      <Text style={{ textAlign: 'center', color: '#666', fontSize: 14, paddingHorizontal: 20, marginTop: 4 }}>
                          Tidak ada riwayat pengajuan reimbursement yang ditemukan pada tahun {appliedYear}.
                      </Text>
                    </>
                )}
                
                <View style={{height: 50}}/>
            </ScrollView>
        )}
        <Modal animationType="fade" transparent={true} visible={isYearModalVisible} onRequestClose={handleBackFromModal}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={handleBackFromModal}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleBackFromModal} style={styles.modalBackIcon}>
                  <Ionicons name="chevron-back" size={28} color="#2A458A" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Filter Tahun</Text>
                <TouchableOpacity onPress={showGuidancePopup}>
                  <Ionicons name="help-circle-outline" size={26} color="#2A458A" />
                </TouchableOpacity>
              </View>
              <View style={styles.yearPickerContainer}>
                <TouchableOpacity onPress={() => changeTempYear('up')}>
                  <Ionicons name="chevron-up" size={32} color="#2A458A" />
                </TouchableOpacity>
                <View style={styles.yearDisplay}>
                  <Text style={styles.yearTextInactive}>{years[years.indexOf(tempSelectedYear) - 1] || ""}</Text>
                  <Text style={styles.yearTextActive}>{tempSelectedYear}</Text><Text style={styles.yearTextInactive}>{years[years.indexOf(tempSelectedYear) + 1] || ""}</Text>
                </View>
                <TouchableOpacity onPress={() => changeTempYear('down')}>
                  <Ionicons name="chevron-down" size={32} color="#2A458A" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyYear}>
                <Text style={styles.applyButtonText}>Terapkan</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* ======================================================= */}
      {/* [MODIFIKASI 4]: Tambahkan JSX untuk popup info kustom */}
      {/* ======================================================= */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isInfoPopupVisible}
        onRequestClose={() => setInfoPopupVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={() => setInfoPopupVisible(false)} // Menutup modal jika klik di luar
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
                Tahun yang muncul dan dapat dipilih adalah tahun sejak Anda masuk bekerja sampai sekarang.
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
export default ReimbursementScreen;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F4F7FC" },
    blueSection: { backgroundColor: "#2A458A", paddingBottom: 70 }, 
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 15, paddingHorizontal: 16 },
    headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    blueContent: { paddingHorizontal: 16, paddingTop: 4 },
    yearSelector: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: {width: 0, height: 1}, },
    yearText: { fontSize: 16, color: "#2A458A", fontWeight: 'bold' },
    summaryContainerWhite: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, marginTop: 20, elevation: 3 },
    sisaTitleContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    sisaTitle: { fontSize: 15, fontWeight: "bold", color: "#1F2937", flex: 1 },
    iconsRightContainer: { flexDirection: "row", alignItems: "center" },
    separatorLine: { fontSize: 20, color: '#E5E7EB', marginHorizontal: 10 },
    summaryDetailContainer: { width: '100%', gap: 10 },
    summaryCardRow: { backgroundColor: '#F9FAFB', borderRadius: 8, borderWidth: 1, borderColor: '#F3F4F6', padding: 12, },
    summaryCardHeader: { marginBottom: 10, },
    summaryCardTitle: { fontSize: 14, fontWeight: '600', color: '#111827', },
    summaryCardNote: { fontSize: 11, color: '#6B7280', marginTop: 2, },
    summaryCardBody: { flexDirection: 'row', justifyContent: 'space-between', },
    summaryColumn: { flex: 1, alignItems: 'flex-start', paddingHorizontal: 4, },
    summaryColumnLabel: { fontSize: 11, color: '#6B7280', marginBottom: 4, },
    summaryColumnValue: { fontSize: 14, fontWeight: 'bold', },
    summaryValueGreen: { color: "#16A34A" },
    summaryValueRed: { color: "#DC2626" },
    summaryValueBlack: { color: "#1F2937" },
    infoBox: { backgroundColor: "#EAF2FF", padding: 12, borderRadius: 8, marginTop: 16 },
    infoText: { fontSize: 12, color: "#395BA9", textAlign: "center", lineHeight: 16 },
    summaryToggler: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, },
    summaryTogglerLine: { width: 50, height: 5, backgroundColor: '#D1D5DB', borderRadius: 2.5, },
    whiteSection: { flex: 1, backgroundColor: '#F4F7FC', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -60, paddingTop: 24, paddingHorizontal: 16, },
    claimActionContainer: { zIndex: 1 }, 
    actionButtonDisabled: { backgroundColor: "#E5E7EB", padding: 14, borderRadius: 8, alignItems: "center" },
    actionTextDisabled: { color: "#9CA3AF", fontSize: 15, fontWeight: "500" },
    actionButtonEnabled: { backgroundColor: "#395BA9", padding: 14, borderRadius: 8, alignItems: "center" },
    actionTextEnabled: { color: "#fff", fontSize: 15, fontWeight: "bold" },
    dropdownButton: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: "#D1D5DB", marginTop: 8 },
    dropdownButtonText: { color: "#395BA9", fontSize: 15, fontWeight: "bold" },
    dropdownMenu: { position: 'absolute', top: 110, left: 0, right: 0, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', marginTop: 4, elevation: 5, zIndex: 10 },
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
    emptyContainer: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 50,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 16,
        elevation: 1,
    },
    emptyIcon: {
        fontSize: 60,
        color: '#A0B4D0',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'center'
    },
    emptyText: { 
        fontSize: 14, 
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20
    },
    enteredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F7FC', padding: 20, marginTop: -60 },
    loadingText: { marginTop: 10, fontSize: 16, color: '#1F2937' },
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F7FC', padding: 20, marginTop: -60 },
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

    infoModalContent: {
      width: '85%',
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    infoModalIcon: {
      marginBottom: 12,
    },
    infoModalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 8,
    },
    infoModalMessage: {
      fontSize: 15,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
    },
    infoModalButton: {
      backgroundColor: '#2A458A',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 20,
      width: '100%',
      alignItems: 'center',
    },
    infoModalButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });