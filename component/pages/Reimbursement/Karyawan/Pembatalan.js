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
  Modal,
  Alert, // <-- 1. Tambah import Alert
  ActivityIndicator, // <-- 1. Tambah import ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getServerIP } from "../../../backbone/ApiConfig"; // <-- 1. Tambah import getServerIP

// Helper Component untuk Input yang Tidak Bisa Diubah
const DisabledInput = ({ value }) => (
  <View style={styles.disabledInputContainer}>
    <Text style={styles.disabledInputText}>{!!value ? value : 'N/A'}</Text>
  </View>
);

export default function PembatalanReimbursementScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { itemData } = route.params || {};

  if (!itemData) {
      return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../../../assets/bg_navbar.png")}
                style={styles.header}
                resizeMode="cover" >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Error</Text>
                <View style={{ width: 24 }} />
            </ImageBackground>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>
                    Data pengajuan tidak ditemukan. Silakan kembali dan coba lagi.
                </Text>
            </View>
        </View>
      )
  }
  
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false); // <-- 2. Tambah state loading
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
  
  // <-- 3. Modifikasi fungsi ini
  const handleConfirmCancellation = async () => {
    setLoading(true);
    setConfirmCancelModalVisible(false);

    // Ambil noBukti dan bersihkan karakter '#' jika ada
    const reimbursementId = itemData.noBukti.startsWith('#') 
                            ? itemData.noBukti.substring(1) 
                            : itemData.noBukti;
    
    // Siapkan body request
    const requestBody = {
        kryNpk: itemData.kryNpk, // NPK yang membatalkan (diambil dari NPK yang login)
        rbmAlasanPembatalan: alasan.trim(),
    };

    try {
        const ip = await getServerIP();
        const url = `http://${ip}:8080/reimbursement/cancel/${reimbursementId}`;
        
        console.log("Sending cancellation request to:", url);
        console.log("Request body:", JSON.stringify(requestBody, null, 2));

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();

        if (response.ok) {
            console.log("Pembatalan berhasil:", responseData);
            setSuccessCancelModalVisible(true);
        } else {
            // Jika ada pesan error dari backend, tampilkan
            const errorMessage = responseData.message || 'Gagal membatalkan pengajuan.';
            console.error("Gagal membatalkan:", response.status, responseData);
            Alert.alert("Error", errorMessage);
        }
    } catch (error) {
        console.error("Terjadi error saat menghubungi server:", error);
        Alert.alert("Koneksi Gagal", "Tidak dapat menghubungi server. Silakan periksa koneksi internet Anda dan coba lagi.");
    } finally {
        setLoading(false); // Selalu set loading ke false setelah proses selesai
    }
  };

  const handleCloseSuccessAndNavigate = () => {
    setSuccessCancelModalVisible(false);
    navigation.pop(2); 
  };
  
  // Pastikan noBukti dibersihkan untuk tampilan
  const displayId = itemData.noBukti.startsWith('#') ? itemData.noBukti.substring(1) : itemData.noBukti;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} >
      <View style={styles.container}>
        <ImageBackground
          source={require("../../../../assets/bg_navbar.png")}
          style={styles.header}
          resizeMode="cover" >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Pembatalan Reimbursement</Text>
          <View style={{ width: 24 }} />
        </ImageBackground>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false} >
          <View style={styles.form}>
            <Text style={styles.label}>No. Bukti</Text>
            <DisabledInput value={displayId} /> 
            
            <Text style={styles.label}>NPK</Text>
            <DisabledInput value={itemData.kryNpk} />

            <Text style={styles.label}>Nama Karyawan</Text>
            <DisabledInput value={itemData.kryNama} />

            <Text style={styles.label}>Nama Pasien</Text>
            <DisabledInput value={itemData.yangBerobat} />

            <Text style={styles.label}>Hubungan</Text>
            <DisabledInput value={itemData.hubungan} />

            <Text style={styles.label}>Tipe Reimbursement</Text>
            <DisabledInput value={itemData.type} />
            
            <Text style={styles.label}>Tanggal Berobat</Text>
            <DisabledInput value={itemData.tanggalPeriksa} />

            <Text style={styles.label}>
              Alasan Pembatalan <Text style={{ color: 'red' }}>*</Text>
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder="Silahkan masukkan alasan pembatalan reimbursement."
              placeholderTextColor="#9CA3AF"
              multiline
              value={alasan}
              onChangeText={setAlasan} />
          </View>
        </ScrollView>

        {/* <-- 4. Tampilkan loading indicator di tombol */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.formCancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading} >
            <Text style={styles.formCancelButtonText}>Kembali</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.buttonDisabled]} // Ganti style jika loading
            onPress={handleOpenConfirmation} 
            disabled={loading} >
             {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.submitButtonText}>Batalkan</Text>
            )}
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
                      style={[styles.modalButton, styles.modalYesButton, { width: '100%', flex: undefined, marginHorizontal: 0 }]}
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
                      style={[styles.modalButton, styles.modalYesButton, { width: '100%', flex: undefined, marginHorizontal: 0 }]}
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


const styles = StyleSheet.create({
    // ... semua style Anda ...

    // TAMBAHKAN STYLE INI UNTUK TOMBOL DISABLED
    buttonDisabled: {
        backgroundColor: '#9CA3AF', // Warna abu-abu saat disabled
    },
    
    // Salin sisa stylesheet Anda di sini
    container: {
      flex: 1,
      backgroundColor: "#F7F8FA",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 40,
      paddingBottom: 15,
      paddingHorizontal: 16,
    },
    headerText: {
      color: "#fff",
      fontSize: 18,
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
    modalNoButton: {
      backgroundColor: '#E5E7EB',
    },
    modalNoButtonText: { 
      color: '#374151', 
      fontWeight: 'bold', 
      fontSize: 16, 
    },
    modalYesButton: { 
      backgroundColor: '#05318D' 
    },
    modalYesButtonText: { 
      color: 'white', 
      fontWeight: 'bold', 
      fontSize: 16,
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