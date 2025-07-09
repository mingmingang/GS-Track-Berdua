import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ImageBackground,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

// --- DATA SIMULASI SESUAI GAMBAR ---
const employeeData = { name: "Fahmi Azzam Izzuddin", gender: "male", spouse: { name: "Maudy Ayunda" }, children: [ { name: "Abe Cekut" }, { name: "Ritsuki" } ] };
const allDiagnosaItems = [
    {label: "Other", value: "other"}, {label: "ISPA", value: "ispa"}, {label: "Comond Cold", value: "cold"},
    {label: "Faringitis", value: "faringitis"}, {label: "Myalgia", value: "myalgia"}, {label: "Chepalgia", value: "chepalgia"},
    {label: "Gastritis", value: "gastritis"}, {label: "Conjuntivitis", value: "conjuntivitis"}, {label: "Diare", value: "diare"},
    {label: "Dermatitis", value: "dermatitis"}, {label: "Gigi", value: "gigi"}, {label: "Bisul", value: "bisul"},
    {label: "Alergi", value: "alergi"}, {label: "Ambeien", value: "ambeien"}, {label: "Perawatan Ibu Hamil", value: "bumil"},
    {label: "Kurang Darah", value: "anemia"}, {label: "Sesak Nafas", value: "sesak"}, {label: "Batu Saluran Kemih", value: "bsk"},
    {label: "Bengkak Bernanah", value: "bengkak"}, {label: "Bronkitis", value: "bronkitis"}, {label: "Cacar Air", value: "cacar"},
    {label: "Nyeri Dada", value: "nyeri_dada"}, {label: "Campak", value: "campak"}, {label: "Sakit Perut", value: "sakit_perut"},
    {label: "Luka Bakar", value: "luka_bakar"}, {label: "Diare", value: "diare_2"}, {label: "Nyeri Lambung", value: "lambung"},
    {label: "Peny Gula", value: "gula"}
];
const rumahSakitRayon = [
    {label: "RS HERMINA KRW", value: "hermina_krw"}, {label: "RS ISLAM KARAWANG", value: "islam_krw"},
    {label: "RS KARYA MEDIKA 1 Cikarang Barat", value: "karmed_1"}, {label: "RS KARYA MEDIKA 2 - Tambun", value: "karmed_2"},
    {label: "RS Mitra Family Karawang", value: "mitra_family_krw"}, {label: "RS MITRA KELUARGA - Cikarang", value: "mitra_keluarga_ckr"},
    {label: "RS PRIMAYA KARAWANG", value: "primaya_krw"}, {label: "RSUD KARAWANG", value: "rsud_krw"},
    {label: "RSU MEKAR SARI BKS", value: "mekar_sari_bks"}
];
const rumahSakitNonRayon = [
    {label: "Klinik ProSehat Pribadi drg Asyraf", value: "prosehat"}, {label: "Klinik Dr. Massanto", value: "massanto"},
    {label: "Klinik Kusuma Medika", value: "kusuma"}, {label: "Klinik Musyayofah", value: "musyayofah"},
    {label: "Klinik Mutiara / dr. Zoerrot Abidin", value: "mutiara"}, {label: "KLINIK NAFILA MEDIKA (Dr. isda saly)", value: "nafila"},
    {label: "Klinik Siti Khodijah", value: "khodijah"}, {label: "RS ANNISA", value: "annisa"},
    {label: "RS BAYUKARTA", value: "bayukarta"}, {label: "RS CITO / MANDAYA", value: "cito"},
    {label: "RS CITRA SARI HUSADA", value: "csh"}, {label: "Klinik Dr. Massanto", value: "massanto2"},
    {label: "RS DEWI SRI", value: "dewi_sri"}, {label: "RS LIRA MEDIKA", value: "lira"}, {label: "RS ROSELA", value: "rosela"},
    {label: "RSU FIKRI MEDIKA GRUP", value: "fikri_grup"}, {label: "RSU Fikri Medika Grup / Klinik Griya MEDIKA", "value": "fikri_griya"},
    {label: "RSU Fikri Medika Grup / Klinik Fitri Medika", "value": "fikri_fitri"}, {label: "RSU Fikri Medika Grup / Klinik KARYA MEDIKA", value: "fikri_karya"},
    {label: "RSU SUKMA Sisma MEDIKA JKT", value: "sukma"}, {label: "Klinik Zafira Zhafira", value: "zafira"}, {label: "Klinik Em Hesti", value: "hesti"}
];
// --- AKHIR DATA SIMULASI ---

// --- KONFIGURASI ---
const reimbursementConfig = {
  "Rawat Jalan": { title: "Pengajuan Rawat Jalan", dateType: "single", uploads: ["Kwitansi", "Rincian Obat Lengkap"], note: "Lampirkan Kwitansi dan Rincian Obat Lengkap" },
  "Rawat Inap": { title: "Pengajuan Rawat Inap", dateType: "range", uploads: ["Kwitansi", "Rincian Obat Lengkap", "Hasil Lab", "Resume Medis"], note: "Lampirkan Rincian Obat Lengkap, Hasil lab, dan Resume Medis" },
  "Maternity": { title: "Pengajuan Maternity", dateType: "range", uploads: ["Kwitansi", "Rincian Obat Lengkap", "Hasil Lab", "Resume Medis"], note: "Lampirkan Kwitansi, Rincian Obat Lengkap, dan Resume Medis" },
  "KB": { title: "Pengajuan KB", dateType: "single", uploads: ["Kwitansi KB"], note: "Lampirkan Kwitansi KB lengkap" },
};

// --- KOMPONEN ---
const FileInput = ({ label, onFilePick, fileName }) => (
  <View style={styles.fileInputSection}>
    <Text style={styles.label}>{label} <Text style={{ color: "red" }}>*</Text></Text>
    <View style={styles.fileInputContainer}>
      <TouchableOpacity style={styles.browseButton} onPress={onFilePick}>
        <Text style={styles.browseButtonText}>{fileName ? fileName.length > 20 ? `${fileName.substring(0, 17)}...` : fileName : "Browse..."}</Text>
      </TouchableOpacity>
      <Text style={styles.fileHint}>* pdf/jpg (Max 2mb)</Text>
    </View>
  </View>
);

const PaginatedDropDownPicker = ({ label, zIndex, open, value, allItems, setOpen, setValue, placeholder, disabled = false, onOpen }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(allItems.length / itemsPerPage);

    const displayedItems = allItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    
    useEffect(() => { setCurrentPage(1); }, [allItems]);

    const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
    const handlePrevious = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

    const ListFooterComponent = () => (
      <View style={styles.paginationContainer}>
        <Text style={styles.paginationText}>
          {allItems.length > 0 ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, allItems.length)} of ${allItems.length}` : 'No data'}
        </Text>
        <View style={styles.paginationButtons}>
          <TouchableOpacity onPress={handlePrevious} disabled={currentPage === 1}>
            <Text style={[styles.paginationNav, currentPage === 1 && styles.paginationDisabled]}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} disabled={currentPage === totalPages}>
            <Text style={[styles.paginationNav, currentPage === totalPages && styles.paginationDisabled]}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
        <View style={{ zIndex, marginBottom: 12 }}>
            <Text style={styles.label}>{label} <Text style={{ color: "red" }}>*</Text></Text>
            <DropDownPicker
                open={open}
                value={value}
                items={displayedItems}
                setOpen={setOpen}
                setValue={setValue}
                onOpen={onOpen}
                setItems={() => {}}
                placeholder={placeholder}
                style={styles.dropdown}
                placeholderStyle={styles.placeholder}
                textStyle={styles.dropdownText}
                dropDownContainerStyle={styles.dropdownContainer}
                ListFooterComponent={totalPages > 1 ? ListFooterComponent : null}
                disabled={disabled}
                disabledStyle={{ backgroundColor: '#F0F0F0' }}
                listMode="SCROLLVIEW" 
                searchable={false}
            />
        </View>
    );
};


const PengajuanReimbursementScreen = ({ route }) => {
  const navigation = useNavigation();
  const { type = "Rawat Jalan" } = route.params || {};
  const config = reimbursementConfig[type];

  // State untuk Modals
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isValidationErrorVisible, setValidationErrorVisible] = useState(false);

  // State untuk Dropdowns
  const [openPasien, setOpenPasien] = useState(false);
  const [valuePasien, setValuePasien] = useState(null);
  const [itemsPasien, setItemsPasien] = useState([]);
  const [openDiagnosa, setOpenDiagnosa] = useState(false);
  const [valueDiagnosa, setValueDiagnosa] = useState(null);
  const [openTipeRS, setOpenTipeRS] = useState(false);
  const [valueTipeRS, setValueTipeRS] = useState(null);
  const [itemsTipeRS] = useState([{ label: "Rayon", value: "rayon" }, { label: "Non Rayon", value: "non_rayon" }]);
  const [openRumahSakit, setOpenRumahSakit] = useState(false);
  const [valueRumahSakit, setValueRumahSakit] = useState(null);
  const [fullRumahSakitList, setFullRumahSakitList] = useState([]);
  
  // State untuk Input Teks
  const [otherDiagnosa, setOtherDiagnosa] = useState("");
  const [cost, setCost] = useState("");
  const [doctorName, setDoctorName] = useState("");

  const closeOtherPickers = (setter) => {
    setOpenPasien(false);
    setOpenDiagnosa(false);
    setOpenTipeRS(false);
    setOpenRumahSakit(false);
    setter(true);
  }

  useEffect(() => {
    const spouseLabel = employeeData.gender === 'male' ? 'Istri' : 'Suami';
    let patientList = [{ label: `${employeeData.name} - Anda`, value: 'self' }];
    if (employeeData.spouse) patientList.push({ label: `${employeeData.spouse.name} - ${spouseLabel}`, value: 'spouse' });
    employeeData.children.forEach((child, index) => patientList.push({ label: `${child.name} - Anak`, value: `child_${index}`}));
    setItemsPasien(patientList);
  }, []);

  useEffect(() => {
    setValueRumahSakit(null);
    if (valueTipeRS === 'rayon') setFullRumahSakitList(rumahSakitRayon);
    else if (valueTipeRS === 'non_rayon') setFullRumahSakitList(rumahSakitNonRayon);
    else setFullRumahSakitList([]);
  }, [valueTipeRS]);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => { setShowDatePicker(Platform.OS === "ios"); if (selectedDate) setDate(selectedDate); };
  const onStartDateChange = (event, selectedDate) => { setShowStartDatePicker(Platform.OS === "ios"); if (selectedDate) setStartDate(selectedDate); };
  const onEndDateChange = (event, selectedDate) => { setShowEndDatePicker(Platform.OS === "ios"); if (selectedDate) setEndDate(selectedDate); };

  const [files, setFiles] = useState({});
  const handlePickFile = async (fileKey) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ["image/jpeg", "image/png", "application/pdf"] });
      if (result.assets && result.assets.length > 0) setFiles(prev => ({ ...prev, [fileKey]: result.assets[0] }));
    } catch (error) { console.log("Error picking file:", error); }
  };
  
  const validateForm = () => {
    if (!valuePasien || !cost.trim() || !valueDiagnosa || (valueDiagnosa === 'other' && !otherDiagnosa.trim()) || !valueTipeRS || !valueRumahSakit || !doctorName.trim()) {
        return false;
    }
    for (const uploadLabel of config.uploads) {
        if (!files[uploadLabel]) {
            return false;
        }
    }
    return true;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
        setIsConfirmModalVisible(true);
    } else {
        setValidationErrorVisible(true);
    }
  };

  const handleConfirmSave = () => {
    setIsConfirmModalVisible(false);
    setIsSuccessModalVisible(true);
  };

  const handleCloseSuccess = () => {
    setIsSuccessModalVisible(false);
    navigation.goBack();
  };

  const renderDatePickers = () => {
    if (config.dateType === "single") {
      return (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Tanggal Berobat <Text style={{ color: "red" }}>*</Text></Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{date.toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric'})}</Text>
            <Ionicons name="calendar-outline" size={20} color="#555" />
          </TouchableOpacity>
          {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />}
        </View>
      );
    }
    return (
      <View style={styles.row}>
        <View style={{ flex: 1, zIndex: 0 }}><Text style={styles.label}>Tanggal Mulai <Text style={{ color: "red" }}>*</Text></Text><TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}><Text style={styles.dateText}>{startDate.toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric'})}</Text><Ionicons name="calendar-outline" size={20} color="#555" /></TouchableOpacity>{showStartDatePicker && <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartDateChange} />}</View>
        <View style={{ flex: 1, zIndex: 0 }}><Text style={styles.label}>Sampai Dengan <Text style={{ color: "red" }}>*</Text></Text><TouchableOpacity style={styles.dateInput} onPress={() => setShowEndDatePicker(true)}><Text style={styles.dateText}>{endDate.toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric'})}</Text><Ionicons name="calendar-outline" size={20} color="#555" /></TouchableOpacity>{showEndDatePicker && <DateTimePicker value={endDate} mode="date" display="default" onChange={onEndDateChange} />}</View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require("../../../../assets/bg_navbar.png")} 
        style={styles.header} 
        resizeMode="cover"
      >
        <Ionicons 
          name="arrow-back" 
          size={20} 
          color="#fff" 
          onPress={() => navigation.goBack()} 
        />
        <Text style={styles.headerText}>{config.title}</Text>
        <View style={{ width: 24 }} />
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>NPK</Text>
        <TextInput style={styles.inputDisabled} value="230093" editable={false} />

        <Text style={styles.label}>Nama Karyawan</Text>
        <TextInput style={styles.inputDisabled} value={employeeData.name} editable={false} />

        <View style={{ zIndex: 4000, marginBottom: 12 }}>
            <Text style={styles.label}>Nama Pasien <Text style={{ color: "red" }}>*</Text></Text>
            <DropDownPicker 
                open={openPasien}
                value={valuePasien}
                items={itemsPasien}
                setOpen={setOpenPasien}
                setValue={setValuePasien}
                setItems={setItemsPasien}
                onOpen={() => closeOtherPickers(setOpenPasien)}
                placeholder="Pilih Nama Pasien"
                style={styles.dropdown}
                listMode="SCROLLVIEW"
            />
        </View>
        
        {renderDatePickers()}

        <Text style={styles.label}>Reimbursement Cost <Text style={{ color: "red" }}>*</Text></Text>
        <TextInput style={styles.input} placeholder="Biaya Pengobatan" keyboardType="numeric" value={cost} onChangeText={setCost} />
        
        <PaginatedDropDownPicker 
            label="Diagnosa"
            zIndex={3000}
            open={openDiagnosa}
            value={valueDiagnosa}
            allItems={allDiagnosaItems}
            setOpen={setOpenDiagnosa}
            setValue={setValueDiagnosa}
            onOpen={() => closeOtherPickers(setOpenDiagnosa)}
            placeholder="Pilih Diagnosa"
        />

        {valueDiagnosa === 'other' && (
            <View style={{marginTop: -4, marginBottom: 12 }}>
                <Text style={styles.label}>Diagnosa Lainnya <Text style={{color: 'red'}}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ketik diagnosa lainnya"
                    value={otherDiagnosa}
                    onChangeText={setOtherDiagnosa}
                />
            </View>
        )}
        
        <View style={{ zIndex: 2000, marginBottom: 12 }}>
            <Text style={styles.label}>Tipe RS <Text style={{ color: "red" }}>*</Text></Text>
            <DropDownPicker
                open={openTipeRS}
                value={valueTipeRS}
                items={itemsTipeRS}
                setOpen={setOpenTipeRS}
                setValue={setValueTipeRS}
                onOpen={() => closeOtherPickers(setOpenTipeRS)}
                placeholder="Pilih Tipe Rumah Sakit"
                style={styles.dropdown}
                listMode="SCROLLVIEW"
            />
        </View>
        
        <PaginatedDropDownPicker
            label="Rumah Sakit"
            zIndex={1000}
            open={openRumahSakit}
            value={valueRumahSakit}
            allItems={fullRumahSakitList}
            setOpen={setOpenRumahSakit}
            setValue={setValueRumahSakit}
            onOpen={() => closeOtherPickers(setOpenRumahSakit)}
            placeholder="Pilih Rumah Sakit"
            disabled={!valueTipeRS}
        />

        <Text style={styles.label}>Dokter <Text style={{ color: "red" }}>*</Text></Text>
        <TextInput style={styles.input} placeholder="Nama Dokter Pemeriksa" value={doctorName} onChangeText={setDoctorName} />

        {config.uploads.map((uploadLabel) => (
          <FileInput key={uploadLabel} label={uploadLabel} fileName={files[uploadLabel]?.name} onFilePick={() => handlePickFile(uploadLabel)} />
        ))}

        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>{config.note}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Kirim</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Mohon kwitansi diserahkan ke HC maksimal 2x 24 jam dan di ttd atasan
        </Text>
      </View>
      
        {/* Validation Error Modal */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={isValidationErrorVisible}
            onRequestClose={() => setValidationErrorVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Ionicons name="warning-outline" size={50} style={styles.warningIcon} />
                    <Text style={styles.modalErrorTitle}>Data Tidak Lengkap</Text>
                    <Text style={styles.modalErrorMessage}>Mohon lengkapi semua data yang wajib diisi.</Text>
                    <TouchableOpacity
                        style={[styles.modalButton, styles.confirmButton, { width: '100%', flex: undefined, marginHorizontal: 0 }]}
                        onPress={() => setValidationErrorVisible(false)}
                    >
                        <Text style={styles.confirmButtonText}>Tutup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isConfirmModalVisible}
        onRequestClose={() => setIsConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Simpan Data</Text>
            <Text style={styles.modalMessage}>Anda yakin ingin menyimpannya?</Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsConfirmModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Tidak</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmSave}
              >
                <Text style={styles.confirmButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSuccessModalVisible}
        onRequestClose={handleCloseSuccess}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
             <View style={styles.successIconWrapper}>
                <Ionicons name="checkmark" size={36} color="#22C55E" style={{fontWeight: 'bold'}} />
             </View>
            <Text style={styles.modalSuccessMessage}>Reimbursement berhasil disimpan</Text>
            <TouchableOpacity 
              style={[
                styles.modalButton,
                styles.confirmButton,
                {
                  width: '100%',
                  flex: undefined,
                  marginHorizontal: 0
                }
              ]}
              onPress={handleCloseSuccess}
            >
              <Text style={styles.confirmButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PengajuanReimbursementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingTop: Platform.OS === 'ios' ? 40 : 15,
    paddingBottom: 15,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingHorizontal: 16 
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  form: { padding: 16, paddingBottom: 20 },
  label: { marginBottom: 8, fontWeight: "bold", color: "#333" },
  input: { borderWidth: 1, borderColor: "#ddd", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginBottom: 12, backgroundColor: "#fff" },
  inputDisabled: { borderWidth: 1, borderColor: "#ddd", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginBottom: 12, backgroundColor: "#F0F0F0", color: '#555' },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 16, marginBottom: 12 },
  dateInput: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ddd", paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, backgroundColor: "#fff" },
  dateText: { color: "#333" },
  
  fileInputSection: { marginBottom: 16 },
  fileInputContainer: { flexDirection: 'row', alignItems: 'center' },
  browseButton: { borderWidth: 1.5, borderColor: '#B0B0B0', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#fff' },
  browseButtonText: { color: '#888', fontWeight: '500' },
  fileHint: { color: "red", fontSize: 12, marginLeft: 12, flexShrink: 1 },

  noteContainer: { backgroundColor: "#E6F3FF", padding: 12, borderRadius: 8, marginTop: 10 },
  noteTitle: { fontWeight: "bold", color: "#005A9C" },
  noteText: { fontSize: 13, color: "#005A9C" },
  footer: { padding: 16, paddingTop: 10, paddingBottom: Platform.OS === "ios" ? 30 : 16, borderTopWidth: 1, borderColor: "#eee", backgroundColor: '#fff' },
  submitButton: { backgroundColor: "#28a745", paddingVertical: 14, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  footerText: { textAlign: 'center', color: '#555', fontSize: 12, fontWeight: 'bold' },
  
  dropdown: { borderColor: '#ddd', backgroundColor: '#fff', minHeight: 48 },
  placeholder: { color: "#888" },
  dropdownText: { color: '#333' },
  dropdownContainer: { borderColor: '#ddd', backgroundColor: '#fff' },

  paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  paginationText: { fontSize: 12, color: '#888' },
  paginationButtons: { flexDirection: 'row', gap: 20 },
  paginationNav: { color: '#007BFF', fontWeight: 'bold' },
  paginationDisabled: { color: '#ccc' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  modalMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalSuccessMessage: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonText: { color: '#374151', fontWeight: 'bold', fontSize: 16 },
  confirmButton: {
     backgroundColor: '#05318D' 
  },
  confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  successIconWrapper: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16, 
    borderWidth: 3, 
    borderColor: '#22C55E'
  },
  // Style untuk popup peringatan
  warningIcon: {
    color: '#F97316', // Orange-500
    marginBottom: 16,
  },
  modalErrorTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalErrorMessage: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
});