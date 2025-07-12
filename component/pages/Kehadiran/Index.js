import React, { useState, useEffect } from "react";

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
import FilterTahun from "../../part/Filter";

const KehadiranScreen = ({ route }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [cutiList, setCutiList] = useState([]);
  const userId = route?.params?.user?.userId || "";
  const [selectedJenis, setSelectedJenis] = useState("Cuti Pribadi");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [kehadiranList, setKehadiranList] = useState([]);

  const formatTanggal = (tanggalString) => {
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
    const tanggal = new Date(tanggalString);
    const hari = tanggal.getDate();
    const bulan = bulanIndo[tanggal.getMonth()];
    const tahun = tanggal.getFullYear();
    return `${hari} ${bulan} ${tahun}`;
  };

  const getTanggalRange = (tahun) => {
    const now = new Date();
    const thisYear = now.getFullYear();

    const bulanIndo = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const awal = `1 Januari ${tahun}`;

    let akhir;
    if (parseInt(tahun) === thisYear) {
      akhir = `${now.getDate()} ${bulanIndo[now.getMonth()]} ${tahun}`;
    } else {
      akhir = `31 Desember ${tahun}`;
    }
    return `${awal} - ${akhir}`;
  };

  const [selectedStatus, setSelectedStatus] = useState("Semua");

   // Dummy data (replace with API call)
  useEffect(() => {
    setKehadiranList([
      {
        tanggal: "2025-05-16",
        status: "Hadir",
        jamMasuk: "08.15",
        jamKeluar: "13.43",
      },
      {
        tanggal: "2025-05-15",
        status: "Cuti",
        jamMasuk: null,
        jamKeluar: null,
      },
      {
        tanggal: "2025-05-13",
        status: "Alpa",
        jamMasuk: null,
        jamKeluar: null,
      },
      {
        tanggal: "2025-05-09",
        status: "IMP",
        jamMasuk: null,
        jamKeluar: null,
      },
      {
        tanggal: "2025-05-08",
        status: "IDL",
        jamMasuk: "07.48",
        jamKeluar: "16.45",
      },
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Hadir": return "#4CAF50";
      case "Cuti": return "#FBC02D";
      case "Alpa": return "#F44336";
      case "IDL": return "#AB47BC";
      case "IMP": return "#29B6F6";
      default: return "#9E9E9E";
    }
  };


  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/bg_navbar.png")}
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
        <Text style={styles.headerText}>Kehadiran</Text>
        <View style={{ width: 24 }} />
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>Anda tidak absen hari ini</Text>
        </View>

        <View style={styles.dateRangeBox}>
          <Text style={styles.dateRangeText}>24 Apr 2025 - 23 May 2025</Text>
          <TouchableOpacity onPress={() => setYearModalVisible(true)}>
            <MaterialIcons name="filter-list" size={20} color="#1E2D56" />
          </TouchableOpacity>
        </View>

        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Kehadiran</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterBar}>
            {["Semua", "Hadir", "Alpa", "Cuti", "IDL", "IMP"].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  style={[
                    styles.filterItem,
                    selectedStatus === status && styles.filterItemActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {kehadiranList.map((item, idx) => (
          <View key={idx} style={styles.attendanceCard}>
            <View style={styles.cardContentRow}>
              {/* Kiri: Badge dan Tanggal */}
              <View style={styles.leftContent}>
                <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
                <View style={styles.dateRow}>
                  <MaterialIcons name="calendar-today" size={18} color="#333" style={styles.calendarIcon} />
                  <Text style={styles.dateText}>{formatTanggal(item.tanggal)}</Text>
                </View>
              </View>

              {/* Kanan: Jam Masuk dan Keluar */}
              <View style={styles.rightContent}>
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Masuk</Text>
                  <Text style={styles.timeText}>{item.jamMasuk || "--.--"}</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Keluar</Text>
                  <Text style={styles.timeText}>{item.jamKeluar || "--.--"}</Text>
                </View>
              </View>
            </View>
          </View>

        ))}
      </ScrollView>
    </View>
  );
};

export default KehadiranScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
    fontFamily: "Poppins_700Bold",
  },
  scrollContent: { padding: 16 },
  infoBanner: {
    backgroundColor: "#D1F1FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoText: {
    color: "#1E2D56",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  dateRangeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateRangeText: {
    color: "#1E2D56",
    fontWeight: "500",
    fontFamily: "Poppins_600SemiBold",
    backgroundColor: "#E7EFFD",
    padding: 10,
    borderRadius: 8,
  },
  filterBar: { flexDirection: "row", marginBottom: 12 },
  filterItem: {
    marginRight: 12,
    color: "#999",
    fontFamily: "Poppins_600SemiBold",
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  filterItemActive: {
    backgroundColor: "#1E2D56",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    color: "#fff",
  },
  attendanceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start", // penting biar badge gak manjang
    marginBottom: 10, // tambahin gap ke tanggal
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  arrow: {
    fontSize: 20,
    color: "#888",
    marginHorizontal: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins_500Medium",
    marginTop: 2,
  },
  timeItem: {
    alignItems: "center",
    flex: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarIcon: {
    marginRight: 6, // buat jarak ke teks tanggal
    alignSelf: "center",
  },  
  dateText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#333",
  },
  cardContentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flex: 1,
    justifyContent: "center"
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1.2,
    gap: 8, // atau pakai marginHorizontal di arrow kalau React Native belum support gap
  },
  kehadiranTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16, // opsional biar lebih keliatan "title"
    fontFamily: "Poppins_700Bold", // kalau lo pakai Poppins
  },
});
