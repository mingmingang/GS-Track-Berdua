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

    const [isModalVisible, setModalVisible] = useState(false);
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
              <View style={{ height: (dataToShow.status === 'Menunggu Persetujuan' || dataToShow.status === 'Belum Diverifikasi') ? 110 : 50 }} />

            </ScrollView>
            
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
            
            {(dataToShow.status === 'Menunggu Persetujuan' || dataToShow.status === 'Belum Diverifikasi') && (
                 <View style={styles.bottomButtonContainer}>
                    {/* --- PERUBAHAN DI SINI --- */}
                    <TouchableOpacity 
                      style={styles.bottomCancelButton} 
                      onPress={() => navigation.navigate('PembatalanReimbursement', { itemData: itemData })}
                    >
                         <Text style={styles.cancelButtonText}>Batalkan Pengajuan</Text>
                     </TouchableOpacity>
                 </View>
            )}
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
});