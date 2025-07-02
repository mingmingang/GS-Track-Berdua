import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PanduanIDL from "../../../part/PanduanIDL";

const dataIDL = [
  {
    id: "007970",
    nama: "Amalia Tresna",
    alasan: "Meeting Proyek",
    status: "Menunggu Persetujuan",
    tanggal: "12 Jan 2025",
    statusColor: "#2196F3",
    labelColor: "#2196F3",
  },
  {
    id: "008006",
    nama: "Amalia Tresna",
    alasan: "Forum Diskusi",
    status: "Menunggu Persetujuan",
    tanggal: "02 Mei 2025",
    statusColor: "#2196F3",
    labelColor: "#2196F3",
  },
  {
    id: "008007",
    nama: "Amalia Tresna",
    alasan: "Pengajuan Cuti",
    status: "Menunggu Persetujuan",
    tanggal: "10 Mei 2025",
    statusColor: "#2196F3",
    labelColor: "#2196F3",
  },

  // Belum Diverifikasi
  {
    id: "007971",
    nama: "Amalia Tresna",
    alasan: "Gemba Supplier",
    status: "Belum Diverifikasi",
    tanggal: "12 Okt 2025",
    statusColor: "#FFEB3B",
    labelColor: "#FFEB3B",
  },
  {
    id: "008002",
    nama: "Amalia Tresna",
    alasan: "Audit Internal",
    status: "Belum Diverifikasi",
    tanggal: "22 Feb 2025",
    statusColor: "#FFEB3B",
    labelColor: "#FFEB3B",
  },
  {
    id: "008005",
    nama: "Amalia Tresna",
    alasan: "Kegiatan Sosial",
    status: "Belum Diverifikasi",
    tanggal: "28 Apr 2025",
    statusColor: "#FFEB3B",
    labelColor: "#FFEB3B",
  },

  // Selesai
  {
    id: "007972",
    nama: "Amalia Tresna",
    alasan: "Meeting",
    status: "Selesai",
    tanggal: "05 Aug 2025",
    statusColor: "#4CAF50",
    labelColor: "#4CAF50",
  },
  {
    id: "008003",
    nama: "Amalia Tresna",
    alasan: "Kunjungan Pabrik",
    status: "Selesai",
    tanggal: "15 Mar 2025",
    statusColor: "#4CAF50",
    labelColor: "#4CAF50",
  },
  {
    id: "008008",
    nama: "Amalia Tresna",
    alasan: "Pelatihan Eksternal",
    status: "Selesai",
    tanggal: "30 Apr 2025",
    statusColor: "#4CAF50",
    labelColor: "#4CAF50",
  },

  // Ditolak
  {
    id: "007973",
    nama: "Amalia Tresna",
    alasan: "Jalan-Jalan",
    status: "Ditolak",
    tanggal: "05 Aug 2025",
    statusColor: "#F44336",
    labelColor: "#F44336",
  },
  {
    id: "008004",
    nama: "Amalia Tresna",
    alasan: "Pribadi (Libur)",
    status: "Ditolak",
    tanggal: "20 Mar 2025",
    statusColor: "#F44336",
    labelColor: "#F44336",
  },
  {
    id: "008009",
    nama: "Amalia Tresna",
    alasan: "Acara Keluarga",
    status: "Ditolak",
    tanggal: "12 Apr 2025",
    statusColor: "#F44336",
    labelColor: "#F44336",
  },
];

const IDLScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../../assets/bg_navbar.png")}
        style={styles.header}
        resizeMode="cover"
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          style={{ paddingLeft: "20" }}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Menu Izin Dinas Luar</Text>
        <View style={{ width: 24 }} />
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dateRangeBox}>
          <Text style={styles.dateRangeText}>2025 s/d 2026</Text>
          <View style={styles.iconsRight}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <MaterialIcons name="book" size={20} color="#1E2D56" />
            </TouchableOpacity>

            <PanduanIDL
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
            />
            <View
              style={{
                width: 1,
                height: 20,
                backgroundColor: "#ddd",
                marginHorizontal: 8,
              }}
            />
            <TouchableOpacity onPress={() => navigation.navigate("FilterIDL")}>
              <MaterialIcons name="filter-list" size={20} color="#1E2D56" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Daftar IDL */}
        {dataIDL.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>NPK: {item.id}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.labelColor },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.cardNama}>{item.nama}</Text>
            <Text style={styles.cardSub}>Alasan: {item.alasan}</Text>

            {/* Tanggal dan Tombol Lihat dalam satu baris */}
            <View
              style={[
                styles.cardRow,
                { justifyContent: "space-between", alignItems: "center" },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="access-time" size={16} color="#333" />
                <Text style={styles.cardDate}>{item.tanggal}</Text>
              </View>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => navigation.navigate("LihatIDL")}
              >
                <Text style={styles.viewText}>Lihat →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TambahIDL")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IDLScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#1E2D56",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    height: 100,
    justifyContent: "space-between",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },

  scrollContent: { padding: 16 },

  dateRangeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateRangeText: {
    color: "#1E2D56",
    fontWeight: "500",
    fontFamily: "Poppins_600SemiBold",
    backgroundColor: "#E7EFFD",
    padding: 10,
    borderRadius: 8,
  },
  iconsRight: { flexDirection: "row", alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    elevation: 8,
    borderRadius: 10,
    padding: 12,
    shadowColor: "#888",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: 12,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "#666",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  cardNama: {
    marginTop: 3,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 2,
  },
  cardSub: {
    color: "#666",
    marginTop: 3,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 2,
  },
  cardRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  cardDate: { marginLeft: 4, color: "#333", fontFamily: "Poppins_500Medium" },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins_700Bold",
  },
  statusX: {
    color: "#fff",
    fontSize: 14,
    backgroundColor: "red",
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 20,
    fontWeight: "bold",
  },

  viewButton: { alignSelf: "flex-end", marginTop: 8 },
  viewText: { color: "#1E2D56", fontWeight: "bold" },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#1E2D56",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabText: { color: "#fff", fontSize: 32, lineHeight: 32 },
});
