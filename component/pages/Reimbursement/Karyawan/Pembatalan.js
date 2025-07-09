import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Modal, // Modal sudah diimpor
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

// Helper Component untuk Input yang Tidak Bisa Diubah
const DisabledInput = ({ value }) => (
  <View style={styles.disabledInputContainer}>
    <Text style={styles.disabledInputText}>{value || 'N/A'}</Text>
  </View>
);

// Helper untuk memformat tipe reimbursement
const formatReimbursementType = (type) => {
    if (!type) return 'N/A';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Fungsi helper untuk mendapatkan tanggal berobat yang benar
const getTanggalBerobat = (item) => {
    if (!item || !item.details) return 'N/A';
    const { type, details } = item;
    if ((type === 'RAWAT_INAP' || type === 'MATERNITY') && details.tanggalMulaiRawat && details.tanggalSelesaiRawat) {
        return `${details.tanggalMulaiRawat} s/d ${details.tanggalSelesaiRawat}`;
    }
    return details.tanggalRawat || 'N/A';
};


export default function PembatalanReimbursementScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { itemData } = route.params || {}; 
  const details = itemData?.details || {}; 

  const [alasan, setAlasan] = useState("");
  
  const [isConfirmCancelModalVisible, setConfirmCancelModalVisible] = useState(false);
  const [isSuccessCancelModalVisible, setSuccessCancelModalVisible] = useState(false);
  const [isValidationErrorVisible, setValidationErrorVisible] = useState(false);


  const handleOpenConfirmation = () => {
    if (!alasan.trim()) {
      setValidationErrorVisible(true);
      return;
    }
    setConfirmCancelModalVisible(true);
  };
  
  const handleConfirmCancellation = () => {
    setConfirmCancelModalVisible(false);
    console.log("Pengajuan yang dibatalkan (No. Bukti):", details.noBukti);
    console.log("Alasan:", alasan);
    setSuccessCancelModalVisible(true);
  };

  const handleCloseSuccessAndNavigate = () => {
    setSuccessCancelModalVisible(false);
    navigation.pop(2);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <ImageBackground
          source={require("../../../../assets/bg_navbar.png")}
          style={styles.header}
          resizeMode="cover"
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Pembatalan Reimbursement</Text>
          <View style={{ width: 24 }} />
        </ImageBackground>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Text style={styles.label}>No. Bukti</Text>
            <DisabledInput value={details.noBukti} />
            <Text style={styles.label}>NPK</Text>
            <DisabledInput value={details.npkKaryawan} />
            <Text style={styles.label}>Nama Karyawan</Text>
            <DisabledInput value={details.namaKaryawan} />
            <Text style={styles.label}>Nama Pasien</Text>
            <DisabledInput value={details.namaPasien} />
            <Text style={styles.label}>Hubungan</Text>
            <DisabledInput value={details.hubungan} />
            <Text style={styles.label}>Tipe Reimbursement</Text>
            <DisabledInput value={formatReimbursementType(itemData?.type)} />
            <Text style={styles.label}>Tanggal Berobat</Text>
            <DisabledInput value={getTanggalBerobat(itemData)} />

            {/* BARIS YANG DIPERBAIKI */}
            <Text style={styles.label}>
              Alasan Pembatalan <Text style={{ color: 'red' }}>*</Text>
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder="Silahkan masukkan alasan pembatalan reimbursement."
              placeholderTextColor="#9CA3AF"
              multiline
              value={alasan}
              onChangeText={setAlasan}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.formCancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.formCancelButtonText}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleOpenConfirmation}>
            <Text style={styles.submitButtonText}>Kirim</Text>
          </TouchableOpacity>
        </View>

        {/* Modal Validasi */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={isValidationErrorVisible}
            onRequestClose={() => setValidationErrorVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Ionicons name="warning-outline" size={50} style={styles.warningIcon} />
                    <Text style={styles.modalErrorTitle}>Alasan Pembatalan Diperlukan!</Text>
                    <Text style={styles.modalErrorMessage}>Silahkan isi alasan pembatalan terlebih dahulu</Text>
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        styles.modalYesButton,
                        {
                          width: '100%',
                          flex: undefined,
                          marginHorizontal: 0
                        }
                      ]}
                      onPress={() => setValidationErrorVisible(false)}
                    >
                        <Text style={styles.modalYesButtonText}>Tutup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

        {/* Modal Konfirmasi Pembatalan */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={isConfirmCancelModalVisible}
            onRequestClose={() => setConfirmCancelModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Konfirmasi Pembatalan</Text>
                    <Text style={styles.modalMessage}>Anda yakin ingin membatalkannya?</Text>
                    <View style={styles.modalButtonRow}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalNoButton]}
                            onPress={() => setConfirmCancelModalVisible(false)}
                        >
                            <Text style={styles.modalNoButtonText}>Tidak</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalYesButton]}
                            onPress={handleConfirmCancellation}
                        >
                            <Text style={styles.modalYesButtonText}>Iya</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        {/* Modal Berhasil Dibatalkan */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={isSuccessCancelModalVisible}
            onRequestClose={handleCloseSuccessAndNavigate}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.successIconWrapper}>
                        <Ionicons name="checkmark" size={36} color="#22C55E" style={{fontWeight: 'bold'}} />
                    </View>
                    <Text style={styles.modalSuccessMessage}>Reimbursement berhasil dibatalkan</Text>
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        styles.modalYesButton,
                        {
                          width: '100%',
                          flex: undefined,
                          marginHorizontal: 0
                        }
                      ]}
                      onPress={handleCloseSuccessAndNavigate}
                    >
                        <Text style={styles.modalYesButtonText}>Tutup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 40 : 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  form: {
    padding: 20,
  },
  label: {
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
    color: "#111827",
  },
  disabledInputContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  disabledInputText: {
    color: "#374151",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  textArea: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    paddingTop: 12,
    textAlignVertical: "top",
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#111827",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  formCancelButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  formCancelButtonText: {
    color: "#374151",
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    flex: 1,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },
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
    fontFamily: 'Poppins_700Bold',
  },
  modalMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Poppins_400Regular',
  },
  modalSuccessMessage: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Poppins_500Medium',
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
  modalNoButton: {
    backgroundColor: '#E5E7EB',
  },
  modalNoButtonText: { 
    color: '#374151', 
    fontWeight: 'bold', 
    fontSize: 16, 
    fontFamily: "Poppins_700Bold",
  },
  modalYesButton: { 
    backgroundColor: '#05318D' 
  },
  modalYesButtonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
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
  warningIcon: {
    color: '#F97316',
    marginBottom: 16,
  },
  modalErrorTitle: {
    fontSize: 17,
    color: '#4B5563',
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalErrorMessage: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Poppins_400Regular',
  },
});