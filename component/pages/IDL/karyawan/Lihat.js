import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function DetailIDLScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ImageBackground
        source={require("../../../../assets/bg_navbar.png")}
        style={styles.header}
        resizeMode="cover"
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          style={{ paddingLeft: 20 }}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Detail Dinas Luar</Text>
        <View style={{ width: 24 }} />
      </ImageBackground>

      {/* Status IDL */}
      <View style={styles.statusBox}>
        <View style={styles.statusLeft}>
          <View style={styles.statusIcon}>
            <Ionicons name="information-circle" size={20} color="#6B7280" />
          </View>
          <Text style={styles.statusLabel}>Status IDL</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Menunggu Persetujuan</Text>
        </View>
      </View>

      {/* Detail Izin Dinas Luar */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detail Izin Dinas Luar</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>No. Pengajuan</Text>
          <Text style={styles.value}>IDL202503013458</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>NPK Karyawan</Text>
          <Text style={styles.value}>007970</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Nama Karyawan</Text>
          <Text style={styles.value}>Amalia Tresna</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Kegiatan</Text>
          <Text style={styles.value}>Gemba</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Tanggal Pengajuan</Text>
          <Text style={styles.value}>Kamis, 15 Mei 2025</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Waktu Berangkat</Text>
          <Text style={styles.value}>Senin, 19 Mei 2025 - 10.00</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Waktu Kembali</Text>
          <Text style={styles.value}>Selasa, 20 Mei 2025 - 15.00</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Tanggal Dinas Luar</Text>
          <Text style={styles.value}>19 Mei 2025 - 20 Mei 2025</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>File Pendukung</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Lihat File</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lokasi 1 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lokasi 1</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Politeknik Astra</Text>
          <Text style={styles.valueRight}>
            Cikarang Selatan, Kab Bekasi, Jawa Barat
          </Text>
        </View>
      </View>

      {/* Lokasi 2 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lokasi 2</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Astra Honda Motor</Text>
          <Text style={styles.valueRight}>
            Pasirranji, Kec. Cikarang Pusat, Kab bekasi, Jawa Barat
          </Text>
        </View>
      </View>

      {/* Lokasi 3 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lokasi 3</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Astra Honda Motor</Text>
          <Text style={styles.valueRight}>Cibatu, Kab Bekasi, Jawa Barat</Text>
        </View>
      </View>

      {/* Keterangan Tambahan */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Keterangan Tambahan</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Keterangan</Text>
          <Text style={styles.value}>Gemba Supplier di Politeknik Astra</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    height: 100,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  statusBox: {
    backgroundColor: "#E5E7EB",
    margin: 16,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    marginRight: 8,
  },
  statusLabel: {
    color: "#6B7280",
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },
  statusBadge: {
    backgroundColor: "#2196F3",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 16,
    fontSize: 16,
    color: "#111827",
    fontFamily: "Poppins_700Bold",
  },
  detailRow: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: {
    color: "#9CA3AF",
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    flex: 1,
  },
  value: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
    width: "60%",
    textAlign: "right",
    numberOfLines: 1,
  },
  valueRight: {
    color: "#9CA3AF",
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    flex: 1,
    textAlign: "right",
  },
  linkText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },
});
