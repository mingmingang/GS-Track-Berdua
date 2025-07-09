import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

// --- DATA DUMMY (Tidak diubah) ---
const fullReimbursementDetails = {
    '#217727': { status: 'Fully Approved', type: 'RAWAT_JALAN', details: { noBukti: '217727', npkKaryawan: '230093', namaKaryawan: 'Maudy Ayunda', namaPasien: 'Elshanum Widya Safira', hubungan: 'Anak', tipeRS: 'Non Rayon', rumahSakit: 'Klinik Kusuma Medika', dokter: 'Dr. Kusuma', tanggalPengajuan: 'Kamis, 09 Jan 2025', tanggalRawat: 'Kamis, 09 Jan 2025', reimbursementCost: 'Rp. 1.208.570', jenisPembayaran: 'Transfer' }, diagnosis: 'Pemeriksaan demam & batuk' },
    '#223050': { status: 'Waiting for Verification', type: 'MATERNITY', details: { noBukti: '223050', npkKaryawan: '230093', namaKaryawan: 'Maudy Ayunda', namaPasien: 'Maudy Ayunda', hubungan: 'Istri', tipeRS: 'Rayon', rumahSakit: 'RSIA Hermina', dokter: 'Dr. Richard', tanggalPengajuan: 'Kamis, 13 Feb 2025', tanggalMulaiRawat: 'Senin, 10 Feb 2025', tanggalSelesaiRawat: 'Rabu, 12 Feb 2025', reimbursementCost: 'Rp. 16.070.090', jenisPembayaran: 'Transfer' }, diagnosis: 'Pemeriksaan USG Kehamilan' },
    '#204511': { status: 'Fully Approved', type: 'RAWAT_JALAN', details: { noBukti: '204511', npkKaryawan: '230093', namaKaryawan: 'Maudy Ayunda', namaPasien: 'Pengguna', hubungan: 'Karyawan', tipeRS: 'Non Rayon', rumahSakit: 'Klinik Sehat Bugar', dokter: 'Dr. Budi', tanggalPengajuan: 'Selasa, 15 Okt 2024', tanggalRawat: 'Selasa, 15 Okt 2024', reimbursementCost: 'Rp. 550.000', jenisPembayaran: 'Transfer' }, diagnosis: 'Influenza' },
    '#209987': { status: 'Waiting Approval', type: 'RAWAT_INAP', details: { noBukti: '209987', npkKaryawan: '230093', namaKaryawan: 'Maudy Ayunda', namaPasien: 'Elshanum Widya Safira', hubungan: 'Anak', tipeRS: 'Rayon', rumahSakit: 'RSUD Karawang', dokter: 'Dr. Aksara Mahesa', tanggalPengajuan: 'Jumat, 27 Des 2024', tanggalMulaiRawat: 'Jumat, 20 Des 2024', tanggalSelesaiRawat: 'Kamis, 26 Des 2024', reimbursementCost: 'Rp. 2.500.000', jenisPembayaran: 'Transfer' }, diagnosis: 'Demam Berdarah (DBD)' },
    '#205123': { status: 'Canceled', type: 'RAWAT_JALAN', details: { noBukti: '205123', npkKaryawan: '230093', namaKaryawan: 'Maudy Ayunda', namaPasien: 'Jesse Jisseok Choi', hubungan: 'Suami', tipeRS: 'Rayon', rumahSakit: 'Apotek K-24', dokter: '-', tanggalPengajuan: 'Jumat, 22 Nov 2024', tanggalRawat: 'Jumat, 22 Nov 2024', reimbursementCost: 'Rp. 400.000', jenisPembayaran: 'Transfer' }, diagnosis: 'Demam Tifoid (Tipes)' },
    '#198345': { status: 'Fully Approved', type: 'MATERNITY', details: { noBukti: '198345', npkKaryawan: '230093', namaKaryawan: 'Maudy Ayunda', namaPasien: 'Maudy Ayunda', hubungan: 'Istri', tipeRS: 'Rayon', rumahSakit: 'RSIA Tambun', dokter: 'Dr. Sarah', tanggalPengajuan: 'Selasa, 07 Mar 2023', tanggalMulaiRawat: 'Rabu, 01 Mar 2023', tanggalSelesaiRawat: 'Minggu, 05 Mar 2023', reimbursementCost: 'Rp. 12.000.000', jenisPembayaran: 'Transfer' }, diagnosis: 'Biaya Persalinan' },
    '#188888': { status: 'Fully Approved', type: 'RAWAT_JALAN', details: { noBukti: '188888', npkKaryawan: '230093', namaKaryawan: 'Maudy Ayunda', namaPasien: 'Jesse Jisseok Choi', hubungan: 'Suami', tipeRS: 'Non Rayon', rumahSakit: 'Klinik Medika Utama', dokter: 'Dr. Santoso', tanggalPengajuan: 'Senin, 05 Sep 2022', tanggalRawat: 'Senin, 05 Sep 2022', reimbursementCost: 'Rp. 350.000', jenisPembayaran: 'Transfer' }, diagnosis: 'Konsultasi Umum' }
};

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>
);
const FileLink = ({ label }) => (
    <View style={styles.detailRow}><Text style={styles.label}>{label}</Text><TouchableOpacity><Text style={styles.fileLinkText}>Lihat File</Text></TouchableOpacity></View>
);
const statusMap = {
    'Waiting Approval': { text: 'Menunggu Persetujuan', color: '#0288D1' }, 'Waiting for Verification': { text: 'Belum Diverifikasi', color: '#FFA000' }, 'Fully Approved': { text: 'Disetujui', color: '#4CAF50' }, 'Canceled': { text: 'Dibatalkan', color: '#EF4444' },
};

// --- PERBAIKAN: MEMBUAT KOMPONEN MODAL KUSTOM ---
const ActionModal = ({ visible, type, onClose, onConfirm, onFinalClose }) => {
    const modalContent = {
        confirm_approve: { title: 'Ingin Setujui?', subtitle: 'Anda yakin ingin menyetujui?', confirmText: 'Setujui' },
        confirm_reject: { title: 'Reimbursement Ditolak?', subtitle: 'Anda yakin ingin menolaknya?', confirmText: 'Tolak' },
        success_approve: { message: 'Reimbursement berhasil disetujui' },
        success_reject: { message: 'Reimbursement berhasil ditolak' },
    };

    const content = modalContent[type];
    const isSuccess = type?.includes('success');

    if (!visible || !content) return null;

    return (
        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={isSuccess ? null : onClose}>
                <View style={styles.modalContainer}>
                    {isSuccess ? (
                        <>
                            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" style={{ marginBottom: 16 }}/>
                            <Text style={styles.modalSuccessText}>{content.message}</Text>
                            <TouchableOpacity 
                              style={[
                                styles.modalMainButton, 
                                  { 
                                    width: '100%', 
                                    flex: undefined, 
                                    marginTop: 16, 
                                    marginHorizontal: 0 
                                  }
                              ]} onPress={onFinalClose}
                            >
                              <Text style={styles.modalMainButtonText}>Tutup</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.modalTitle}>{content.title}</Text>
                            <Text style={styles.modalSubtitle}>{content.subtitle}</Text>
                            <View style={styles.modalButtonRow}>
                                <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
                                    <Text style={styles.modalCancelButtonText}>Batal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalMainButton} onPress={onConfirm}>
                                    <Text style={styles.modalMainButtonText}>{content.confirmText}</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </TouchableOpacity>
        </Modal>
    );
};


export default function DetailReimbursementScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { itemData } = route.params || {};
    const dataToShow = fullReimbursementDetails[itemData?.noBukti] || null;

    // --- PERBAIKAN: STATE UNTUK MODAL ---
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState(null);

    const getStatusDetails = (status) => statusMap[status] || { text: status, color: '#6B7280' };
    const statusDetails = getStatusDetails(dataToShow?.status);

    // --- PERBAIKAN: FUNGSI-FUNGSI BARU UNTUK MENGONTROL MODAL ---
    const handleActionPress = (type) => { // type: 'approve' atau 'reject'
        setModalType(`confirm_${type}`);
        setIsModalVisible(true);
    };

    const handleConfirmAction = () => {
        if (modalType === 'confirm_approve') {
            console.log("Pengajuan disetujui!");
            setModalType('success_approve');
        } else if (modalType === 'confirm_reject') {
            console.log("Pengajuan ditolak!");
            setModalType('success_reject');
        }
    };
    
    const handleFinalClose = () => {
        setIsModalVisible(false);
        setModalType(null);
        navigation.goBack();
    };

    if (!dataToShow) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Data tidak ditemukan.</Text></View>
    }
    
    const getTanggalBerobat = (type, details) => (type === 'RAWAT_INAP' || type === 'MATERNITY') ? `${details.tanggalMulaiRawat} s/d ${details.tanggalSelesaiRawat}` : details.tanggalRawat;

    const renderFileLinks = (type) => {
        let files = [];
        switch (type) {
            case 'RAWAT_JALAN': files = ['Kwitansi', 'Rincian Obat']; break;
            case 'RAWAT_INAP': case 'MATERNITY': files = ['Kwitansi', 'Rincian Obat', 'Hasil Lab', 'Resume Medis']; break;
            default: break;
        }
        return files.map(file => <FileLink key={file} label={file} />);
    };

    return (
        <View style={{flex: 1}}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
              <ImageBackground source={require("../../../../assets/bg_navbar.png")} style={styles.header} resizeMode="cover">
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerText}>Detail Reimbursement</Text>
                <View style={{ width: 24 }} />
              </ImageBackground>
              <View style={styles.statusContainer}><View style={styles.statusBox}><Text style={styles.statusLabel}>Status Reimbursement</Text><View style={[styles.statusBadge, { backgroundColor: statusDetails.color }]}><Text style={styles.statusText}>{statusDetails.text}</Text></View></View></View>
              <View style={styles.card}><Text style={styles.cardTitle}>Detail Reimbursement</Text><DetailRow label="No. Bukti" value={dataToShow.details.noBukti} /><DetailRow label="NPK" value={dataToShow.details.npkKaryawan} /><DetailRow label="Nama Karyawan" value={dataToShow.details.namaKaryawan} /><DetailRow label="Nama Pasien" value={dataToShow.details.namaPasien} /><DetailRow label="Hubungan" value={dataToShow.details.hubungan} /><DetailRow label="Tipe RS" value={dataToShow.details.tipeRS} /><DetailRow label="Rumah Sakit" value={dataToShow.details.rumahSakit} /><DetailRow label="Dokter" value={dataToShow.details.dokter} /><DetailRow label="Tanggal Pengajuan" value={dataToShow.details.tanggalPengajuan} /><DetailRow label="Tanggal Berobat" value={getTanggalBerobat(dataToShow.type, dataToShow.details)} /><DetailRow label="Reimbursement Cost" value={dataToShow.details.reimbursementCost} /><DetailRow label="Jenis Pembayaran" value={dataToShow.details.jenisPembayaran} />{renderFileLinks(dataToShow.type)}</View>
              <View style={styles.card}><Text style={styles.cardTitle}>{dataToShow.type === 'MATERNITY' ? 'Keterangan & Diagnosa' : 'Diagnosa'}</Text><DetailRow label="Diagnosa" value={dataToShow.diagnosis} /></View>
              <View style={{height: 120}}/>
            </ScrollView>
            
            {dataToShow.status === 'Waiting Approval' && (
                 <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity style={styles.rejectButton} onPress={() => handleActionPress('reject')}>
                         <Text style={styles.actionButtonText}>Tolak</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.approveButton} onPress={() => handleActionPress('approve')}>
                         <Text style={styles.actionButtonText}>Setujui</Text>
                    </TouchableOpacity>
                 </View>
            )}

            {/* --- PERBAIKAN: TAMBAHKAN KOMPONEN MODAL DI SINI --- */}
            <ActionModal
                visible={isModalVisible}
                type={modalType}
                onClose={() => setIsModalVisible(false)}
                onConfirm={handleConfirmAction}
                onFinalClose={handleFinalClose}
            />
        </View>
    );
}

// Tambahkan gaya baru dan modifikasi yang sudah ada
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA', },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 15, paddingHorizontal: 16 },
    headerText: { color: "#fff", fontSize: 18, fontFamily: "Poppins_700Bold", fontWeight: "bold" },
    statusContainer: { paddingHorizontal: 16, marginTop: 16 },
    statusBox: { backgroundColor: '#E0EDFF', borderRadius: 8, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusLabel: { color: '#1E2D56', fontWeight: 'bold', fontFamily:"Poppins_700Bold", fontSize: 14 },
    statusBadge: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, },
    statusText: { color: 'white', fontWeight: 'bold', fontSize: 12, fontFamily:"Poppins_700Bold" },
    card: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    cardTitle: { fontWeight: 'bold', marginBottom: 16, fontSize: 16, color: '#333', fontFamily:"Poppins_700Bold" },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    label: { color: '#6B7280', fontSize: 14, fontFamily:"Poppins_400Regular" },
    value: { color: '#111827', fontSize: 14, fontWeight: 'bold', fontFamily:"Poppins_700Bold", textAlign: 'right', flex: 1, marginLeft: 10 },
    fileLinkText: { color: '#3B82F6', fontWeight: 'bold', fontSize: 14, fontFamily:"Poppins_700Bold" },
    bottomButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 15, paddingBottom: 25, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
    rejectButton: { backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 12, alignItems: 'center', flex: 1, },
    approveButton: { backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 12, alignItems: 'center', flex: 1, },
    actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily:"Poppins_700Bold", },
    
    // --- GAYA BARU UNTUK MODAL ---
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, },
    modalContainer: { backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', width: '100%', },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8, fontFamily: 'Poppins_700Bold' },
    modalSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 24, fontFamily: 'Poppins_400Regular' },
    modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 12, },
    modalCancelButton: { flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    modalCancelButtonText: { color: '#374151', fontSize: 16, fontWeight: 'bold', fontFamily: 'Poppins_700Bold' },
    modalMainButton: { flex: 1, backgroundColor: '#2A458A', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    modalMainButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', fontFamily: 'Poppins_700Bold' },
    modalSuccessText: { fontSize: 18, fontWeight: 'bold', color: '#4B5563', textAlign: 'center', fontFamily: 'Poppins_700Bold' }
});