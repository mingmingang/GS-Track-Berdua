import React, { useState, useEffect, useCallback, useContext } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as DocumentPicker from "expo-document-picker";
import { AuthContext } from '../../../backbone/AuthContext';
import DateTimePicker from "@react-native-community/datetimepicker";
import { fetchUserData, fetchAllDiagnosa, fetchRumahSakit, submitReimbursement } from "../../../backbone/api";

// Konfigurasi tetap sama
const reimbursementConfig = {
  "Rawat Jalan": { title: "Pengajuan Rawat Jalan", dateType: "single", uploads: { rbm_file_path_kwitansi: "Kwitansi", rbm_file_path_rincian_obat: "Rincian Obat Lengkap"}, note: "Lampirkan Kwitansi dan Rincian Obat Lengkap" },
  "Rawat Inap": { title: "Pengajuan Rawat Inap", dateType: "range", uploads: { rbm_file_path_kwitansi: "Kwitansi", rbm_file_path_rincian_obat: "Rincian Obat Lengkap", rbm_file_path_hasil_lab: "Hasil Lab", rbm_file_path_resume_medis: "Resume Medis" }, note: "Lampirkan Rincian Obat Lengkap, Hasil lab, dan Resume Medis" },
  "Maternity": { title: "Pengajuan Maternity", dateType: "range", uploads: { rbm_file_path_kwitansi: "Kwitansi", rbm_file_path_rincian_obat: "Rincian Obat Lengkap", rbm_file_path_hasil_lab: "Hasil Lab", rbm_file_path_resume_medis: "Resume Medis" }, note: "Lampirkan Kwitansi, Rincian Obat Lengkap, dan Resume Medis" },
  "KB": { title: "Pengajuan KB", dateType: "single", uploads: { rbm_file_path_kwitansi: "Kwitansi KB" }, note: "Lampirkan Kwitansi KB lengkap" },
};

// Komponen FileInput tetap sama
const FileInput = ({ label, onFilePick, fileName }) => (
  <View style={styles.fileInputSection}>
    <Text style={styles.label}>{label} <Text style={{ color: "red" }}>*</Text></Text>
    <View style={styles.fileInputContainer}>
      <TouchableOpacity style={styles.browseButton} onPress={onFilePick}>
        <Text style={styles.browseButtonText}>{fileName ? fileName.length > 20 ? `${fileName.substring(0, 17)}...` : fileName : "Browse..."}</Text>
      </TouchableOpacity>
      <Text style={styles.fileHint}>* pdf/jpg/png (Max 2mb)</Text>
    </View>
  </View>
);

const PengajuanReimbursementScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { type = "Rawat Jalan" } = route.params || {};
  const kryNpk = user.npk;
  const config = reimbursementConfig[type];

  // State
  const [rsLoading, setRsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [karyawan, setKaryawan] = useState({ npk: kryNpk, nama: 'Loading...' });
  const [itemsPasien, setItemsPasien] = useState([]);
  const [allDiagnosaItems, setAllDiagnosaItems] = useState([]);
  const [fullRumahSakitList, setFullRumahSakitList] = useState([]);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isValidationErrorVisible, setValidationErrorVisible] = useState(false);
  const [isDateErrorVisible, setIsDateErrorVisible] = useState(false);
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  
  // State Dropdowns dan Input tetap sama...
  const [openPasien, setOpenPasien] = useState(false);
  const [valuePasien, setValuePasien] = useState(null);
  const [openDiagnosa, setOpenDiagnosa] = useState(false);
  const [valueDiagnosa, setValueDiagnosa] = useState(null);
  const [openTipeRS, setOpenTipeRS] = useState(false);
  const [valueTipeRS, setValueTipeRS] = useState(null);
  const [itemsTipeRS] = useState([
    { key: "Rayon", label: "Rayon", value: "Rayon" },
    { key: "Non Rayon", label: "Non Rayon", value: "Non Rayon" },
  ]);
  const [openRumahSakit, setOpenRumahSakit] = useState(false);
  const [valueRumahSakit, setValueRumahSakit] = useState(null);
  const [otherDiagnosa, setOtherDiagnosa] = useState("");
  const [cost, setCost] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [files, setFiles] = useState({});
  const [isAnyDropDownOpen, setIsAnyDropDownOpen] = useState(false);

  // Sisa fungsi hooks dan handler tetap sama hingga handleSubmit
  const onOpenPicker = useCallback((setter) => { setOpenPasien(false); setOpenDiagnosa(false); setOpenTipeRS(false); setOpenRumahSakit(false); setter(true); }, []);
  const handleTipeRSChange = (val) => { setValueTipeRS(val); setValueRumahSakit(null); };
  const handlePickFile = async (fileKey) => { try { const result = await DocumentPicker.getDocumentAsync({ type: ["image/jpeg", "image/png", "application/pdf"], copyToCacheDirectory: false }); if (result.assets && result.assets.length > 0) { const pickedFile = result.assets[0]; const maxSizeInBytes = 2 * 1024 * 1024; if (pickedFile.size > maxSizeInBytes) { Alert.alert("Ukuran File Terlalu Besar", `File "${pickedFile.name}" melebihi batas maksimal 2MB.`, [{ text: "OK" }]); return; } setFiles(prev => ({ ...prev, [fileKey]: pickedFile })); } } catch (error) { console.log("Error saat memilih file:", error); Alert.alert("Gagal Memilih File", "Terjadi kesalahan, silakan coba lagi."); } };
  
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialDataLoading(true);
      try {
        const userData = await fetchUserData(kryNpk);
        // Log the data to inspect it in the console!
        console.log("User Data from API:", JSON.stringify(userData, null, 2));

        setKaryawan({ npk: userData.kry_npk, nama: userData.kry_nama });

        // [PERBAIKAN] Filter out any family members with a missing or null orgId
        const familyList = userData.keluarga
          .filter(p => p.org_id != null && p.org_nama) // Ensure ID and name exist
          .map(p => ({
            key: p.org_id,
            value: p.org_id,
            label: `${p.org_nama} - ${p.org_hubungan === '-' ? 'Anda' : p.org_hubungan}`,
          }));
        setItemsPasien(familyList);

        const diagnosaData = await fetchAllDiagnosa();
        // Log the data
        console.log("Diagnosa Data from API:", JSON.stringify(diagnosaData, null, 2));

        // Tambahkan setelah fetchAllDiagnosa dipanggil
        const diagnosaList = diagnosaData.filter(d => d.dgsId != null && d.dgsNama).map(d => ({ key: d.dgsId, value: d.dgsId, label: d.dgsNama }));

        // Urutkan agar yang memiliki value '1' berada di atas
        const sortedDiagnosa = [
          ...diagnosaList.filter(d => d.value === '1'),
          ...diagnosaList.filter(d => d.value !== '1')
        ];

        setAllDiagnosaItems(sortedDiagnosa);

      } catch (error) {
        console.error("Gagal memuat data awal:", error);
      } finally {
        setInitialDataLoading(false);
      }
    };
    loadInitialData();
  }, [kryNpk]);

  useEffect(() => {
    const loadRumahSakit = async () => {
      if (valueTipeRS) {
        setRsLoading(true);
        setFullRumahSakitList([]);
        try {
          const rsData = await fetchRumahSakit(valueTipeRS);
          // Log the data
          console.log("Rumah Sakit Data from API:", JSON.stringify(rsData, null, 2));

          // [PERBAIKAN] Filter out any hospitals with a missing or null rsId
          const rsList = rsData
            .filter(rs => rs.rsId != null && rs.rsNama) // Ensure ID and name exist
            .map(rs => ({
              key: rs.rsId,
              value: rs.rsId,
              label: rs.rsNama,
            }));
          setFullRumahSakitList(rsList);
        } catch (error) {
          console.error(`Gagal memuat RS untuk tipe ${valueTipeRS}:`, error);
          setFullRumahSakitList([]);
        } finally {
          setRsLoading(false);
        }
      } else {
        setFullRumahSakitList([]);
      }
    };
    loadRumahSakit();
  }, [valueTipeRS]);

  const validateForm = () => { if (!valuePasien || !cost.trim() || !valueDiagnosa || (valueDiagnosa === '1' && !otherDiagnosa.trim()) || !valueTipeRS || !valueRumahSakit || !doctorName.trim()) { return false; } for (const key of Object.keys(config.uploads)) { if (!files[key]) return false; } return true; };
  
  const handleSubmit = () => {
    if (!validateForm()) {
      setValidationErrorVisible(true);
      return;
    }
    
    if (config.dateType === 'range') {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);

        if (start > end) {
            setDateErrorMessage("Tanggal Mulai tidak boleh melewati Tanggal Selesai.");
            setIsDateErrorVisible(true);
            return;
        }

        if (start.getTime() === end.getTime()) {
            setDateErrorMessage("Untuk tanggal yang sama, silakan ajukan melalui menu Rawat Jalan / KB. Pengajuan tidak dapat dilanjutkan.");
            setIsDateErrorVisible(true);
            return;
        }
    }
    
    setIsConfirmModalVisible(true);
  };
  
  const handleConfirmSave = async () => {
    setIsSubmitting(true);
    setIsConfirmModalVisible(false);

    const formData = new FormData();

    // 1. Tambahkan semua field yang WAJIB ada
    formData.append('kry_npk', kryNpk);
    formData.append('org_id', valuePasien);
    formData.append('rbm_tipe', type);
    formData.append('rbm_cost', cost);
    formData.append('rbm_dokter', doctorName);
    formData.append('rbm_created_by', kryNpk);
    formData.append('dgs_id', valueDiagnosa);
    formData.append('rs_id', valueRumahSakit);
    formData.append('rbm_tanggal_mulai', startDate.toISOString().split('T')[0]);

    // 2. [PERBAIKAN] Tambahkan field OPSIONAL hanya jika punya nilai
    if (config.dateType === 'range' && endDate) {
      formData.append('rbm_tanggal_selesai', endDate.toISOString().split('T')[0]);
    }
    // Hanya kirim rbm_diagnosa_other jika diagnosa-nya 'other' dan teksnya tidak kosong
    if (valueDiagnosa === '1' && otherDiagnosa.trim() !== '') {
      formData.append('rbm_diagnosa_other', otherDiagnosa);
    }
    
    // 3. [PERBAIKAN] Tambahkan file hanya jika ada
    for (const key in files) {
      if (files[key]) {
        const file = files[key];
        const fileToUpload = {
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
          name: file.name
        };
        formData.append(key, fileToUpload);
      }
    }
    
    // Log untuk debugging terakhir
    console.log("FormData to be sent (Final):", JSON.stringify(formData, null, 2));

    try {
      await submitReimbursement(formData);
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error("Submission Failed:", error);
      if (error.response && error.response.data) {
        console.error("Server Error Body:", error.response.data);
      }
      Alert.alert(`Gagal menyimpan data`, `Terjadi kesalahan saat mengirim data ke server. \n\nDetail: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => { setIsSuccessModalVisible(false); navigation.goBack(); };
  const onStartDateChange = (event, selectedDate) => { setShowStartDatePicker(Platform.OS === "ios"); if (selectedDate) setStartDate(selectedDate); };
  const onEndDateChange = (event, selectedDate) => { setShowEndDatePicker(Platform.OS === "ios"); if (selectedDate) setEndDate(selectedDate); };
  const renderDatePickers = () => { const singleDatePicker = (<View style={{ marginBottom: 12 }}><Text style={styles.label}>Tanggal Berobat <Text style={{ color: "red" }}>*</Text></Text><TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}><Text style={styles.dateText}>{startDate.toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric'})}</Text><Ionicons name="calendar-outline" size={20} color="#555" /></TouchableOpacity>{showStartDatePicker && <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartDateChange} />}</View>); if (config.dateType === "single") return singleDatePicker; return (<View style={styles.row}><View style={{ flex: 1 }}><Text style={styles.label}>Tanggal Mulai <Text style={{ color: "red" }}>*</Text></Text><TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}><Text style={styles.dateText}>{startDate.toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric'})}</Text><Ionicons name="calendar-outline" size={20} color="#555" /></TouchableOpacity>{showStartDatePicker && <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartDateChange} />}</View><View style={{ flex: 1 }}><Text style={styles.label}>Sampai Dengan <Text style={{ color: "red" }}>*</Text></Text><TouchableOpacity style={styles.dateInput} onPress={() => setShowEndDatePicker(true)}><Text style={styles.dateText}>{endDate.toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric'})}</Text><Ionicons name="calendar-outline" size={20} color="#555" /></TouchableOpacity>{showEndDatePicker && <DateTimePicker value={endDate} mode="date" display="default" onChange={onEndDateChange} />}</View></View>); };
  if (initialDataLoading) { return (<View style={styles.loadingContainer}><ActivityIndicator size="large" color="#05318D"/><Text>Memuat data...</Text></View>); }

  return (
    <View style={styles.container}>
      <ImageBackground source={require("../../../../assets/bg_navbar.png")} style={styles.header} resizeMode="cover">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{config.title}</Text>
        <View style={{ width: 24 }} />
      </ImageBackground>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={40} // agar tombol tidak ketimpa keyboard
        enableOnAndroid={true}
        nestedScrollEnabled={true}
        // scrollEnabled={!isAnyDropDownOpen}
      >
        <Text style={styles.label}>NPK</Text>
        <TextInput style={styles.inputDisabled} value={karyawan.npk} editable={false} />
        <Text style={styles.label}>Nama Karyawan</Text>
        <TextInput style={styles.inputDisabled} value={karyawan.nama} editable={false} />

        {/* PASIEN */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Nama Pasien <Text style={{ color: "red" }}>*</Text></Text>
          <DropDownPicker
          zIndex= {4000}
            open={openPasien}
            value={valuePasien}
            items={itemsPasien}
            setOpen={setOpenPasien}
            setValue={setValuePasien}
            onOpen={() => onOpenPicker(setOpenPasien)}
            placeholder="Pilih Nama Pasien"
            listMode="SCROLLVIEW"
            searchable={true}
            dropDownDirection="BOTTOM"
            dropDownContainerStyle={styles.dropdownList}
            style={styles.dropdown}
            // onOpen={() => {
            //   onOpenPicker(setOpenPasien);
            //   setIsAnyDropDownOpen(true);
            // }}
            // onClose={() => {
            //   setIsAnyDropDownOpen(false);
            // }}
          />
        </View>

        {renderDatePickers()}

        <Text style={styles.label}>Reimbursement Cost <Text style={{ color: "red" }}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Biaya Pengobatan"
          keyboardType="numeric"
          value={cost}
          onChangeText={setCost}
        />

        {/* DIAGNOSA */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Diagnosa <Text style={{ color: "red" }}>*</Text></Text>
          <DropDownPicker
            zIndex= {3000}
            open={openDiagnosa}
            value={valueDiagnosa}
            items={allDiagnosaItems}
            setOpen={setOpenDiagnosa}
            setValue={setValueDiagnosa}
            onOpen={() => onOpenPicker(setOpenDiagnosa)}
            placeholder="Pilih Diagnosa"
            listMode="SCROLLVIEW"
            searchable={true}
            dropDownDirection="AUTO"
            dropDownContainerStyle={styles.dropdownList}
            style={styles.dropdown}
            // nestedScrollEnabled={true}
          />
        </View>

        {valueDiagnosa === '1' && (
          <View style={{ marginTop: -4, marginBottom: 12 }}>
            <Text style={styles.label}>Diagnosa Lainnya <Text style={{color: 'red'}}>*</Text></Text>
            <TextInput
            zIndex= {2500}
              style={styles.input}
              placeholder="Ketik diagnosa lainnya"
              value={otherDiagnosa}
              onChangeText={setOtherDiagnosa}
            />
          </View>
        )}

        {/* TIPE RS */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Tipe RS <Text style={{ color: "red" }}>*</Text></Text>
          <DropDownPicker
          zIndex= {2000}
            open={openTipeRS}
            value={valueTipeRS}
            items={itemsTipeRS}
            setOpen={setOpenTipeRS}
            setValue={handleTipeRSChange}
            onOpen={() => onOpenPicker(setOpenTipeRS)}
            placeholder="Pilih Tipe Rumah Sakit"
            listMode="SCROLLVIEW"
            searchable={true}
            dropDownDirection="BOTTOM"
            dropDownContainerStyle={styles.dropdownList}
            style={styles.dropdown}
            nestedScrollEnabled={true}
          />
        </View>

        {/* RS */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Rumah Sakit <Text style={{ color: "red" }}>*</Text></Text>
          <DropDownPicker
          zIndex= {1000}
            open={openRumahSakit}
            value={valueRumahSakit}
            items={fullRumahSakitList}
            setOpen={setOpenRumahSakit}
            setValue={setValueRumahSakit}
            onOpen={() => onOpenPicker(setOpenRumahSakit)}
            placeholder="Pilih Rumah Sakit"
            disabled={!valueTipeRS || rsLoading}
            loading={rsLoading}
            searchable={true}
            listMode="SCROLLVIEW"
            dropDownDirection="BOTTOM"
            dropDownContainerStyle={styles.dropdownList}
            style={styles.dropdown}
            nestedScrollEnabled={true}
            ListEmptyComponent={() => (
              <View style={styles.listEmptyContainer}>
                <Text style={styles.listEmptyText}>
                  {rsLoading ? "Memuat..." : "Data tidak tersedia"}
                </Text>
              </View>
            )}
          />
        </View>

        <Text style={styles.label}>Dokter <Text style={{ color: "red" }}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Nama Dokter Pemeriksa"
          value={doctorName}
          onChangeText={setDoctorName}
        />

        {/* Upload File */}
        {Object.entries(config.uploads).map(([key, label]) => (
          <FileInput
            key={key}
            label={label}
            fileName={files[key]?.name}
            onFilePick={() => handlePickFile(key)}
          />
        ))}

        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>{config.note}</Text>
        </View>
      </KeyboardAwareScrollView>

      {/* Footer dan Modal tetap */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && { backgroundColor: '#6c757d' }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Kirim</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Mohon kwitansi diserahkan ke HC maksimal 2x 24 jam dan di ttd atasan
        </Text>
      </View>

      {/* --- MODAL --- */}
      <Modal animationType="fade" transparent={true} visible={isValidationErrorVisible} onRequestClose={() => setValidationErrorVisible(false)} >
          <View style={styles.modalOverlay}><View style={styles.modalContent}><Ionicons name="warning-outline" size={50} style={styles.warningIcon} /><Text style={styles.modalErrorTitle}>Data Tidak Lengkap</Text><Text style={styles.modalErrorMessage}>Mohon lengkapi semua data yang wajib diisi (*).</Text><TouchableOpacity style={[styles.modalButton, styles.confirmButton, { width: '100%', flex: undefined, marginHorizontal: 0 }]} onPress={() => setValidationErrorVisible(false)}><Text style={styles.confirmButtonText}>Tutup</Text></TouchableOpacity></View></View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={isDateErrorVisible} onRequestClose={() => setIsDateErrorVisible(false)}>
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Ionicons name="warning-outline" size={50} style={styles.warningIcon} />
                  <Text style={styles.modalErrorTitle}>Kesalahan Tanggal</Text>
                  <Text style={styles.modalErrorMessage}>{dateErrorMessage}</Text>
                  <TouchableOpacity style={[styles.modalButton, styles.confirmButton, { width: '100%', flex: undefined, marginHorizontal: 0 }]} onPress={() => setIsDateErrorVisible(false)}>
                      <Text style={styles.confirmButtonText}>Tutup</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
      
      <Modal animationType="fade" transparent={true} visible={isConfirmModalVisible} onRequestClose={() => setIsConfirmModalVisible(false)} >
        <View style={styles.modalOverlay}><View style={styles.modalContent}><Text style={styles.modalTitle}>Simpan Data</Text><Text style={styles.modalMessage}>Anda yakin ingin menyimpannya?</Text><View style={styles.modalButtonRow}><TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsConfirmModalVisible(false)}><Text style={styles.cancelButtonText}>Tidak</Text></TouchableOpacity><TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirmSave}><Text style={styles.confirmButtonText}>Simpan</Text></TouchableOpacity></View></View></View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={isSuccessModalVisible} onRequestClose={handleCloseSuccess} >
          <View style={styles.modalOverlay}><View style={styles.modalContent}><View style={styles.successIconWrapper}><Ionicons name="checkmark" size={36} color="#22C55E" style={{fontWeight: 'bold'}} /></View><Text style={styles.modalSuccessMessage}>Reimbursement berhasil disimpan</Text><TouchableOpacity style={[styles.modalButton, styles.confirmButton, {width: '100%', flex: undefined, marginHorizontal: 0 }]} onPress={handleCloseSuccess}><Text style={styles.confirmButtonText}>Tutup</Text></TouchableOpacity></View></View>
      </Modal>
    </View>
  );
};

export default PengajuanReimbursementScreen;

const styles = StyleSheet.create({ 
  container: { flex: 1, backgroundColor: "#fff" }, 
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: Platform.OS === 'ios' ? 40 : 20, paddingBottom: 20, height: Platform.OS === 'ios' ? 90 : 80, paddingHorizontal: 16 }, 
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" }, 
  form: { padding: 16, paddingBottom: 20, position: 'relative' }, 
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
  dropdown: { borderColor: '#ddd', backgroundColor: '#fff' }, 
  dropdownList: { borderColor: 'red', borderWidth: 2, borderColor: '#ddd', backgroundColor: '#fff', maxHeight: 200 }, 
  listEmptyContainer: { paddingVertical: 10, alignItems: 'center' }, 
  listEmptyText: { color: '#888' }, 
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20, }, 
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 24, alignItems: 'center', width: '100%', maxWidth: 340, elevation: 10, }, 
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#1F2937' }, 
  modalMessage: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 24 }, 
  modalSuccessMessage: { fontSize: 16, color: '#4B5563', textAlign: 'center', marginBottom: 24 }, 
  modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' }, 
  modalButton: { borderRadius: 50, paddingVertical: 12, paddingHorizontal: 20, flex: 1, marginHorizontal: 8, alignItems: 'center' }, 
  cancelButton: { backgroundColor: '#E5E7EB' }, 
  cancelButtonText: { color: '#374151', fontWeight: 'bold', fontSize: 16 }, 
  confirmButton: { backgroundColor: '#05318D' }, 
  confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }, 
  successIconWrapper: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 3, borderColor: '#22C55E' }, 
  warningIcon: { color: '#F97316', marginBottom: 16 }, 
  modalErrorTitle: { fontSize: 17, fontWeight: '600', color: '#4B5563', marginBottom: 4, textAlign: 'center' }, 
  modalErrorMessage: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 24 }, 
});