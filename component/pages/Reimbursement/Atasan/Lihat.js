import React, { useState } from 'react';
// --- TAMBAHAN: Import Modal dari react-native untuk popup kustom ---
import { 
    Modal as CustomModal, // Ganti nama agar tidak konflik dengan react-native-modal
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    ImageBackground, 
    TouchableOpacity, 
    Alert, 
    Image,
    ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal'; // Ini untuk modal gambar
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getServerIP } from "../../../backbone/ApiConfig";
import * as WebBrowser from 'expo-web-browser';

const DetailRow = ({ label, value }) => {
    if (!value) return null;
    return (
        <View style={styles.detailRow}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const ActionModal = ({ visible, type, onClose, onConfirm, onFinalClose, isLoading }) => {
    // Component ini tetap sama, untuk logic approve/reject
    const modalContent = {
        confirm_approve: { icon: "help-circle", color: "#0288D1", title: 'Ingin Setujui?', subtitle: 'Anda yakin ingin menyetujui pengajuan ini?', confirmText: 'Ya, Setujui' },
        confirm_reject: { icon: "alert-circle", color: "#EF4444", title: 'Reimbursement Ditolak?', subtitle: 'Anda yakin ingin menolak pengajuan ini?', confirmText: 'Ya, Tolak' },
        success_approve: { icon: "checkmark-circle", color: "#4CAF50", message: 'Reimbursement berhasil disetujui' },
        success_reject: { icon: "checkmark-circle", color: "#4CAF50", message: 'Reimbursement berhasil ditolak' },
        error_update: { icon: "close-circle", color: "#D32F2F", message: 'Gagal memperbarui status. Coba lagi.' },
    };
    const content = modalContent[type];
    if (!visible || !content) return null;
    const isConfirmation = type?.includes('confirm');
    return (
        <CustomModal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.actionModalOverlay}>
                <View style={styles.actionModalContent}>
                    <Ionicons name={content.icon} size={60} color={content.color} style={{ marginBottom: 16 }}/>
                    {isConfirmation ? (
                        <>
                            <Text style={styles.actionModalTitle}>{content.title}</Text>
                            <Text style={styles.actionModalSubtitle}>{content.subtitle}</Text>
                            <View style={styles.actionModalButtonRow}>
                                <TouchableOpacity style={styles.actionModalCancelButton} onPress={onClose}><Text style={styles.actionModalCancelButtonText}>Batal</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.actionModalMainButton} onPress={onConfirm}><Text style={styles.actionModalMainButtonText}>{content.confirmText}</Text></TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={styles.actionModalSuccessText}>{content.message}</Text>
                            <TouchableOpacity style={[styles.actionModalMainButton, { width: '100%', flex: undefined, marginTop: 16 }]} onPress={onFinalClose}><Text style={styles.actionModalMainButtonText}>Tutup</Text></TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </CustomModal>
    );
};

const FileLink = ({ label, noBukti, onFilePress, fileType, itemData }) => {
  const handleOpenFile = async () => {
    if (!noBukti) {
      Alert.alert("Error", "Nomor bukti tidak ditemukan.");
      return;
    }
    const cleanedNoBukti = noBukti.startsWith('#') ? noBukti.substring(1) : noBukti;

    try {
      const ip = await getServerIP();
      const filename = `${itemData.type || 'claim'}_${itemData.kryNpk || 'npk'}_${cleanedNoBukti}`.replace(/\s+/g, '_');
      const url = `http://${ip}:8080/reimbursement/file/${cleanedNoBukti}/${fileType}`;
      
      console.log("Generated URL:", url);
      console.log("Desired Filename (for backend):", filename);
      
      onFilePress(url); 

    } catch (error) {
      console.error("Gagal membuat URL file:", error);
      Alert.alert("Gagal", "Tidak dapat memproses link file.");
    }
  };

  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={handleOpenFile}>
        <Text style={styles.fileLinkText}>Lihat File</Text>
      </TouchableOpacity>
    </View>
  );
};


export default function DetailReimbursementScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { itemData } = route.params || {};

    const [isUpdating, setIsUpdating] = useState(false);
    
    // State untuk modal approve/reject
    const [isActionModalVisible, setActionModalVisible] = useState(false);
    const [actionModalType, setActionModalType] = useState(null);
    
    // --- MODIFIKASI: State disamakan dengan file referensi ---
    const [isModalVisible, setModalVisible] = useState(false); // Untuk Image Viewer
    const [currentFileUrl, setCurrentFileUrl] = useState(null);
    // --- TAMBAHAN: State untuk visibility popup konfirmasi browser ---
    const [isBrowserConfirmVisible, setBrowserConfirmVisible] = useState(false);

    if (!itemData) {
      return (
          <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Data tidak ditemukan.</Text>
          </View>
      );
    }
    
    // --- MODIFIKASI: Logika untuk membuka file, sekarang memicu modal kustom ---
    const handleFilePress = (url) => {
        setCurrentFileUrl(url); 
        const isImage = /\.(jpg|jpeg|png)$/i.test(url);
        
        if (isImage) {
            setModalVisible(true);
        } else {
            // Tampilkan popup kustom, bukan Alert.alert()
            setBrowserConfirmVisible(true);
        }
    };
    
    // --- TAMBAHAN: Handler untuk tombol "Lanjutkan" pada popup konfirmasi ---
    const handleConfirmOpenBrowser = async () => {
        setBrowserConfirmVisible(false); // Tutup popup dulu
        if (!currentFileUrl) {
            Alert.alert("Error", "URL tidak valid.");
            return;
        }
        try {
            await WebBrowser.openBrowserAsync(currentFileUrl, { 
                controlsColor: '#2A458A',
                presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN, 
            });
        } catch(error) {
            console.error("Gagal membuka browser:", error);
            Alert.alert("Error", "Tidak dapat membuka link di browser.");
        }
    };

    const handleDownloadFileFromModal = async () => {
        if (!currentFileUrl) {
            Alert.alert("Error", "URL file tidak ditemukan.");
            return;
        }
        try {
            if (isModalVisible) {
                setModalVisible(false);
            }
            await WebBrowser.openBrowserAsync(currentFileUrl);
        } catch (error) {
            console.error("Gagal membuka browser untuk mengunduh:", error);
            Alert.alert("Gagal", "Tidak dapat membuka link download.");
        }
    };

    // ... sisa kode fungsi (getStatusStyle, renderFileLinks, dll) tetap sama ...

    const getStatusStyle = (status) => {
        switch (status) {
            case "Menunggu Persetujuan": return { text: "Menunggu Persetujuan", backgroundColor: "#0288D1" };
            case "Belum Diverifikasi": return { text: "Belum Diverifikasi", backgroundColor: "#FFA000" };
            case "Disetujui": return { text: "Disetujui", backgroundColor: "#4CAF50" };
            case "Paid": return { text: "Telah Dibayar", backgroundColor: "#4CAF50" };
            case "Dibatalkan": return { text: "Dibatalkan", backgroundColor: "#EF4444" };
            default: return { text: status, backgroundColor: '#6B7280' };
        }
    };

    const statusStyle = getStatusStyle(itemData.status);

    const renderFileLinks = (type, noBukti) => {
      let files = [];
      switch (type) {
          case 'Rawat Jalan': files = ['Kwitansi', 'Rincian Obat']; break;
          case 'Rawat Inap':
          case 'Maternity': files = ['Kwitansi', 'Rincian Obat', 'Hasil Lab', 'Resume Medis']; break;
          case 'KB': files = ['Kwitansi']; break;
          default: return null;
      }
      return files.map(file => {
          const fileType = file.replace(/\s+/g, '_').toLowerCase();
          return (
            <FileLink 
              key={file} 
              label={file}
              fileType={fileType} 
              noBukti={noBukti} 
              itemData={itemData}
              onFilePress={handleFilePress} 
            />
          );
      });
    };

    const biayaDigantiTampil = (itemData.status === "Disetujui" || itemData.status === "Paid") ? itemData.biayaDiganti : 'Rp 0';
    
    const dataToShow = {
      noBukti: itemData.noBukti,
      npkKaryawan: itemData.kryNpk || 'N/A', 
      namaKaryawan: itemData.kryNama || 'N/A',
      namaPasien: itemData.yangBerobat || 'N/A',
      hubungan: itemData.hubungan || 'N/A',
      jenisClaim: itemData.type || 'N/A',
      tipeRS: itemData.rsTipe || 'N/A',
      rumahSakit: itemData.rsNama || 'N/A',
      dokter: itemData.rbmDokter || 'N/A',
      tanggalPengajuan: itemData.headerDate || 'N/A',
      tanggalBerobat: itemData.tanggalPeriksa || 'N/A',
      biayaPeriksa: itemData.biayaPeriksa || 'N/A',
      biayaDiganti: biayaDigantiTampil || 'N/A',
      jenisPembayaran: itemData.jenisPembayaran || 'N/A',
      diagnosis: itemData.dgsNama || 'N/A',
      tipe: itemData.type || 'N/A',
      status: itemData.status || 'N/A',
      alasanPembatalan: itemData.rbmAlasanPembatalan || null,
      createdDate: itemData.rbmCreatedDate || 'N/A',
    };

    // --- Logic untuk Approval / Rejection (Tetap Sama) ---
    const handleUpdateStatus = async (newStatus) => {
        // Gunakan 'itemData.noBukti' yang sudah pasti ada
        const cleanedNoBukti = itemData.noBukti.startsWith('#') 
            ? itemData.noBukti.substring(1) 
            : itemData.noBukti;
        
        // NPK juga ambil dari itemData atau dari state user yang login
        const loggedInUserNpk = itemData.kryNpk; // <-- PASTIKAN INI NPK USER YANG LOGIN

        try {
            const serverIP = await getServerIP();
            const response = await fetch(`http://${serverIP}:8080/reimbursement/update/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    rbmId: cleanedNoBukti, 
                    newStatus: newStatus,
                    modifiedByNpk: loggedInUserNpk 
                }),
            });

            if (!response.ok) {
                console.error("Server Error:", await response.text());
                return false; // Gagal
            }
            
            return true; // Sukses
            
        } catch (e) {
            console.error("Fetch Error:", e);
            return false; // Gagal
        }
    };

    const handleActionPress = (type) => {
        setActionModalType(`confirm_${type}`);
        setActionModalVisible(true);
    };

    const handleConfirmAction = async () => {
        if (isUpdating) return; // Mencegah klik ganda

        setIsUpdating(true); // Mulai loading
        
        const statusToUpdate = actionModalType === 'confirm_approve' ? 'Setujui' : 'Ditolak';
        
        // Panggil fungsi yang sudah diperbaiki dan tunggu hasilnya
        const success = await handleUpdateStatus(statusToUpdate);

        // Sekarang tampilkan hasil ke pengguna
        if (success) {
            const successType = statusToUpdate === 'Ditolak' ? 'success_reject' : 'success_approve';
            setActionModalType(successType);
        } else {
            setActionModalType('error_update');
        }
        
        // Jangan lupa matikan loading SETELAH SEMUA SELESAI
        // State loading sekarang hanya mengontrol tombol di modal, bukan di background
        setIsUpdating(false); 
    };

    const handleFinalClose = () => {
        setActionModalVisible(false);
        setActionModalType(null);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* --- TAMBAHAN: Popup konfirmasi untuk membuka browser --- */}
            <CustomModal
                animationType="fade"
                transparent={true}
                visible={isBrowserConfirmVisible}
                onRequestClose={() => setBrowserConfirmVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Ionicons name="information-circle-outline" size={50} style={styles.infoIcon} />
                        <Text style={styles.modalTitle}>Buka di Browser</Text>
                        <Text style={styles.modalMessage}>File ini akan dibuka di browser. Lanjutkan?</Text>
                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.customCancelButton]}
                                onPress={() => setBrowserConfirmVisible(false)}
                            >
                                <Text style={styles.customCancelButtonText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleConfirmOpenBrowser}
                            >
                                <Text style={styles.confirmButtonText}>Lanjutkan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </CustomModal>

            <ScrollView showsVerticalScrollIndicator={false}>
               <ImageBackground 
                source={require("../../../../assets/bg_navbar.png")} 
                style={styles.header} 
                resizeMode="cover"
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Detail Reimbursement</Text>
                <View style={{ width: 24 }} />
              </ImageBackground>

              <View style={styles.statusContainer}>
                <View style={styles.statusBox}>
                  <Text style={styles.statusLabel}>Status Reimbursement</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                    <Text style={styles.statusText}>{statusStyle.text}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Detail Reimbursement</Text>
                <DetailRow label="No. Bukti" value={dataToShow.noBukti} />
                <DetailRow label="NPK Karyawan" value={dataToShow.npkKaryawan} />
                <DetailRow label="Nama Karyawan" value={dataToShow.namaKaryawan} />
                <DetailRow label="Nama Pasien" value={dataToShow.namaPasien} />
                <DetailRow label="Hubungan" value={dataToShow.hubungan} />
                <DetailRow label="Jenis Claim" value={dataToShow.jenisClaim} />
                <DetailRow label="Tipe RS" value={dataToShow.tipeRS} />
                <DetailRow label="Rumah Sakit" value={dataToShow.rumahSakit} />
                <DetailRow label="Dokter" value={dataToShow.dokter} />
                <DetailRow label="Tgl. Pengajuan" value={dataToShow.tanggalPengajuan} />
                <DetailRow label="Tgl. Berobat" value={dataToShow.tanggalBerobat} />
                <DetailRow label="Biaya Periksa" value={dataToShow.biayaPeriksa} />
                <DetailRow label="Biaya Diganti" value={dataToShow.biayaDiganti} />
                <DetailRow label="Jenis Pembayaran" value={dataToShow.jenisPembayaran} />
                
                {renderFileLinks(dataToShow.tipe, dataToShow.noBukti)} 
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Diagnosa</Text>
                <DetailRow label="Diagnosa" value={dataToShow.diagnosis} />
              </View>

              {/* 2. Render card alasan pembatalan secara kondisional */}
              {dataToShow.status === 'Dibatalkan' && dataToShow.alasanPembatalan && (
                <View style={[styles.card, styles.cancellationCard]}>
                    <View style={styles.cancellationHeader}>
                        <Ionicons name="information-circle-outline" size={22} color="#EF4444" />
                        <Text style={[styles.cardTitle, styles.cancellationTitle]}>Alasan Pembatalan</Text>
                    </View>
                    <Text style={styles.cancellationReasonText}>
                        {dataToShow.alasanPembatalan}
                    </Text>
                </View>
              )}
              <View style={{ height: (dataToShow.status === 'Menunggu Persetujuan' && 
                new Date(dataToShow.createdDate).getFullYear() === new Date().getFullYear()) ? 110 : 50 }} />

            </ScrollView>

            {dataToShow.status === 'Menunggu Persetujuan' && 
                new Date(dataToShow.createdDate).getFullYear() === new Date().getFullYear() && (
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity style={styles.rejectButton} onPress={() => handleActionPress('reject')} disabled={isUpdating}>
                    {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionButtonText}>Tolak</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.approveButton} onPress={() => handleActionPress('approve')} disabled={isUpdating}>
                    {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionButtonText}>Setujui</Text>}
                    </TouchableOpacity>
                </View>
            )}
            
            <Modal 
              isVisible={isModalVisible} 
              onBackdropPress={() => setModalVisible(false)}
              onBackButtonPress={() => setModalVisible(false)}
              style={{ margin: 0 }}
              onModalHide={() => setCurrentFileUrl(null)} 
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity style={styles.modalButton} onPress={handleDownloadFileFromModal}>
                        <MaterialIcons name="file-download" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                        <MaterialIcons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                {currentFileUrl ? (
                  <Image
                    source={{ uri: currentFileUrl }}
                    style={styles.fileViewer}
                    resizeMode='contain'
                  />
                ) : (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                )}
              </View>
            </Modal>

            {/* ---- MODALS (diperbarui sesuai file referensi) ---- */}
            <ActionModal visible={isActionModalVisible} type={actionModalType} onClose={() => setActionModalVisible(false)} onConfirm={handleConfirmAction} onFinalClose={handleFinalClose}/>
            
            {/* MODAL KONFIRMASI BUKA BROWSER (baru ditambahkan) */}
            <CustomModal
                animationType="fade"
                transparent={true}
                visible={isBrowserConfirmVisible}
                onRequestClose={() => setBrowserConfirmVisible(false)}
            >
                <View style={styles.confirmBrowserOverlay}>
                    <View style={styles.confirmBrowserContent}>
                        <Ionicons name="information-circle-outline" size={50} style={styles.confirmBrowserInfoIcon} />
                        <Text style={styles.confirmBrowserTitle}>Buka di Browser</Text>
                        <Text style={styles.confirmBrowserMessage}>File ini akan dibuka di browser. Lanjutkan?</Text>
                        <View style={styles.confirmBrowserButtonRow}>
                            <TouchableOpacity
                                style={[styles.confirmBrowserButton, styles.customCancelButton]}
                                onPress={() => setBrowserConfirmVisible(false)}
                            >
                                <Text style={styles.customCancelButtonText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.confirmBrowserButton, styles.confirmButton]}
                                onPress={handleConfirmOpenBrowser}
                            >
                                <Text style={styles.confirmButtonText}>Lanjutkan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </CustomModal>
        </View>
    );
}

// --- TAMBAHAN: Style untuk popup modal kustom ---
const styles = StyleSheet.create({
    cancellationCard: {
        backgroundColor: '#FFF1F2', // Latar belakang pink/merah muda
        borderColor: '#FECDD3',   // Border merah muda lebih gelap
        borderWidth: 1,
    },
    cancellationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cancellationTitle: {
        color: '#991B1B', // Warna teks merah tua
        marginBottom: 0,  // Reset margin bottom dari cardTitle umum
        marginLeft: 8,
    },
    cancellationReasonText: {
        fontSize: 14,
        color: '#4B5563', // Warna teks abu-abu
        lineHeight: 20,
    },
    container: {
      flex: 1,
      backgroundColor: '#F5F7FA',
    },
    header: { 
      flexDirection: "row", 
      alignItems: "center", 
      justifyContent: "space-between", 
      paddingTop: 40, 
      paddingBottom: 15,
      paddingHorizontal: 16 
    },
    headerText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    statusContainer: {
      paddingHorizontal: 16,
      marginTop: 16,
    },
    statusBox: {
      backgroundColor: '#E0EDFF',
      borderRadius: 8,
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statusLabel: {
      color: '#1E2D56',
      fontWeight: 'bold',
      fontSize: 14,
    },
    statusBadge: {
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    statusText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
    },
    card: {
      backgroundColor: '#fff',
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },
    cardTitle: {
      fontWeight: 'bold',
      marginBottom: 16,
      fontSize: 16,
      color: '#333',
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingVertical: 8,
    },
    label: {
      color: '#6B7280',
      fontSize: 14,
      width: '40%',
    },
    value: {
      color: '#111827',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'right',
      flex: 1,
    },
    fileLinkText: {
      color: '#3B82F6',
      fontWeight: 'bold',
      fontSize: 14,
      textDecorationLine: 'underline',
    },
    bottomButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
    },
    bottomCancelButton: { // Diubah namanya dari cancelButton
      backgroundColor: '#EF4444', 
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
      width: '100%',
    },
    cancelButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20
    },
    errorText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center'
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.9)', 
    },
    modalHeader: {
        position: 'absolute',
        top: 50,
        right: 15,
        zIndex: 10,
        flexDirection: 'row',
    },
    modalButton: { // style umum untuk button di modal
      flex: 1,
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 8,
    },
    fileViewer: {
        flex: 1,
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Style untuk Popup Konfirmasi
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    infoIcon: {
        color: '#3B82F6', // Biru untuk informasi
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#111827',
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 15,
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    customCancelButton: {
        backgroundColor: '#E5E7EB', // abu-abu muda
    },
    customCancelButtonText: {
        color: '#4B5563',
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmButton: {
        backgroundColor: '#2A458A', // warna biru utama
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 40, paddingBottom: 15, paddingHorizontal: 16 },
    headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    statusContainer: { paddingHorizontal: 16, marginTop: 16 },
    statusBox: { backgroundColor: '#E0EDFF', borderRadius: 8, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusLabel: { color: '#1E2D56', fontWeight: 'bold', fontSize: 14 },
    statusBadge: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
    statusText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    card: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    cardTitle: { fontWeight: 'bold', marginBottom: 16, fontSize: 16, color: '#333' },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 8 },
    label: { color: '#6B7280', fontSize: 14, flex: 1 },
    value: { color: '#111827', fontSize: 14, fontWeight: 'bold', textAlign: 'right', flex: 1.5, marginLeft: 10 },
    diagnosaText: { color: '#111827', fontSize: 14, lineHeight: 20 },
    fileLinkText: { color: '#3B82F6', fontWeight: 'bold', fontSize: 14, textDecorationLine: 'underline' },
    bottomButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
    rejectButton: { backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 12, alignItems: 'center', flex: 1 },
    approveButton: { backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 12, alignItems: 'center', flex: 1 },
    actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    // Style untuk Modal Action (Approve/Reject)
    actionModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    actionModalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', width: '100%' },
    actionModalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8, textAlign: 'center' },
    actionModalSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
    actionModalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 12 },
    actionModalCancelButton: { flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    actionModalCancelButtonText: { color: '#374151', fontSize: 16, fontWeight: 'bold' },
    actionModalMainButton: { flex: 1, backgroundColor: '#2A458A', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    actionModalMainButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    actionModalSuccessText: { fontSize: 18, fontWeight: 'bold', color: '#4B5563', textAlign: 'center' },
    
    // Style untuk Modal Penampil Gambar (baru/diperbarui)
    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' },
    modalHeader: { position: 'absolute', top: 50, right: 15, zIndex: 10, flexDirection: 'row' },
    modalHeaderButton: { padding: 10, marginHorizontal: 5, borderRadius: 20 },
    fileViewer: { flex: 1, width: '100%' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    
    // Style untuk Modal Konfirmasi Browser (baru)
    confirmBrowserOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    confirmBrowserContent: { width: '85%', backgroundColor: 'white', borderRadius: 12, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    confirmBrowserInfoIcon: { color: '#3B82F6', marginBottom: 10 },
    confirmBrowserTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#111827', textAlign: 'center' },
    confirmBrowserMessage: { fontSize: 15, color: '#4B5563', textAlign: 'center', marginBottom: 20 },
    confirmBrowserButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    confirmBrowserButton: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginHorizontal: 8, },
    customCancelButton: { backgroundColor: '#E5E7EB' },
    customCancelButtonText: { color: '#4B5563', fontSize: 16, fontWeight: 'bold' },
    confirmButton: { backgroundColor: '#2A458A' },
    confirmButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});