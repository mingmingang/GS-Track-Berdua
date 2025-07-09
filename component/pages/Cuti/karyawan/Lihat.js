import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { AuthContext } from "../../../backbone/AuthContext";
import { getServerIP } from "../../../backbone/ApiConfig";
import { ActivityIndicator } from "react-native";
import Header from "../../../backbone/Header";

export default function DetailCutiScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { cutiId } = route.params || {};
  const { user } = useContext(AuthContext);

  const [cuti, setCuti] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!cutiId) return;

      try {
        const ip = await getServerIP();
        const response = await fetch(`http://${ip}:8080/cuti/${cutiId}`);
        const data = await response.json();

        setCuti(data);
      } catch (err) {
        console.error("Gagal mengambil detail cuti", err);
        setCuti(null);
      }
    };

    fetchData();
  }, [cutiId]);

  const formatTanggal = (tanggalStr) => {
    const bulanIndo = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const tgl = new Date(tanggalStr);
    return `${tgl.getDate()} ${bulanIndo[tgl.getMonth()]} ${tgl.getFullYear()}`;
  };

  if (!cuti) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E2D56" />
        <Text style={{ marginTop: 10 }}>Memuat detail cuti...</Text>
      </View>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "terlaksana":
        return "#4CAF50";
      case "belum terlaksana":
        return "#FFC107";
      case "menunggu persetujuan":
      case "menunggu":
        return "#2196F3";
        case "dibatalkan":
        return "red";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Detail Cuti"/>
      
      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>Status Cuti</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(cuti.status) },
          ]}
        >
          <Text style={styles.statusText}>{cuti.status}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detail Cuti</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>No. Pengajuan</Text>
          <Text style={styles.value}>{cuti.cutiId}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Plant</Text>
          <Text style={styles.value}>{user.plant || "-"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Pengajuan Oleh</Text>
          <Text style={styles.value}>{user.namaKaryawan || "-"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Tipe Cuti</Text>
          <Text style={styles.value}>{cuti.tipeCuti}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Tanggal Pengajuan</Text>
          <Text style={styles.value}>
            {formatTanggal(cuti.tanggalPengajuan)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Tanggal Cuti</Text>
          <Text style={styles.value}>
            {formatTanggal(cuti.tanggalAwal)} -{" "}
            {formatTanggal(cuti.tanggalAkhir)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Keterangan Tambahan</Text>

        <View style={styles.detailKeternagan}>
          <Text style={styles.value}>{cuti.alasan || "-"}</Text>
        </View>
      </View>

      {cuti.lampiran && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Berkas Lampiran</Text>

          <View style={styles.detailKeternagan}>
            <Text style={styles.label}>Nama File</Text>
            <Text style={styles.value}>{cuti.lampiran}</Text>

            <Text
              style={[styles.value, { color: "blue", marginTop: 8 }]}
              onPress={() => {
                if (cuti.fileUri) {
                  Linking.openURL(cuti.fileUri);
                }
              }}
            >
              Lihat Lampiran
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
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
    fontWeight: "bold",
    fontFamily: "Poppins_700bold",
  },
  statusBox: {
    backgroundColor: "#E0EDFF",
    margin: 16,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    color: "#333",
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  statusBadge: {
    backgroundColor: "#34D399",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "Poppins_700Bold",
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
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins_700Bold",
  },
  detailRow: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: {
    color: "#A0AEC0",
    fontSize: 14,
    marginBottom: 6,
    fontFamily: "Poppins_600SemiBold",
  },
  value: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins_700Bold",
  },
});
