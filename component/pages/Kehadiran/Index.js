import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ImageBackground, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../backbone/Constant";
import FilterTahun from "../../part/Filter";
import MapView, { Marker, Callout } from "react-native-maps";

const KehadiranScreen = ({ route }) => {
  const navigation = useNavigation();
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [kehadiranList, setKehadiranList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("❌ Gagal ambil data:", e);
      return null;
    }
  };

  const getStatusFromIndikator = (indikator) => {
  switch (indikator) {
    case 1: return "Hadir";
    case 0: return "Alpa";
    case 2: return "Cuti";
    case 3: return "IMP";
    case 4: return "IDL";
    default: return "Unknown";
  }
};


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
    const fetchKehadiranList = async () => {
      try {
        const user = await getData("lastLogin");
        if (!user?.username) return Alert.alert("Error", "Data login tidak ditemukan.");

        const response = await fetch(`${BASE_URL}kehadiran/currentlogged`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idKaryawan: user.username }),
        });

        const result = await response.json();
        const data = result?.data || [];

        console.log("👉 item dari API:", data); // Tambahkan ini! console.log("👉 item dari API:", item); // Tambahkan ini!
        const formatted = data.map((item) => ({
          tanggal: item.tanggalMasuk,
          status: getStatusFromIndikator(item.indikatorKehadiran),
          jamMasuk: item.masukAbsen ? item.masukAbsen.slice(11, 16).replace(":", ".") : null,
          jamKeluar: item.keluarAbsen ? item.keluarAbsen.slice(11, 16).replace(":", ".") : null,
          lokasiMasuk: item.latitudeMasuk && item.longitudeMasuk ? {
            latitude: item.latitudeMasuk,
            longitude: item.longitudeMasuk
          } : null,
          lokasiKeluar: item.latitudeKeluar && item.longitudeKeluar ? {
            latitude: item.latitudeKeluar,
            longitude: item.longitudeKeluar
          } : null,
        }));

        setKehadiranList(formatted);
      } catch (error) {
        console.error("❌ Gagal fetch kehadiran list:", error);
        Alert.alert("Gagal", "Tidak bisa memuat data kehadiran.");
      }
    };

    fetchKehadiranList();
  }, []);

  const filteredKehadiran = kehadiranList.filter((item) => {
    const itemYear = new Date(item.tanggal).getFullYear();
    return (
      (selectedStatus === "Semua" || item.status === selectedStatus) &&
      itemYear === parseInt(selectedYear)
    );
});



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
      <ImageBackground source={require("../../../assets/bg_navbar.png")} style={styles.header} resizeMode="cover">
        <Ionicons name="arrow-back" size={24} color="#fff" style={{ paddingLeft: 20 }} />
        <Text style={styles.headerText}>Kehadiran</Text>
        <View style={{ width: 24 }} />
      </ImageBackground>

      {/* Modal Filter Tahun */}
      <FilterTahun
        visible={yearModalVisible}
        onClose={() => setYearModalVisible(false)}
        selectedYear={selectedYear}
        onSelectYear={(year) => setSelectedYear(year)}
      />

      {/* Modal Map Lokasi */}
      {mapModalVisible && selectedLocation && (
        <Modal visible={mapModalVisible} transparent animationType="slide">
          <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '90%', height: 450, backgroundColor: 'white', borderRadius: 12, overflow: 'hidden' }}>
              
              {/* Legenda */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 8, backgroundColor: '#f0f0f0' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'green', marginRight: 6 }} />
                  <Text style={{ fontSize: 12 }}>Lokasi Masuk</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'red', marginRight: 6 }} />
                  <Text style={{ fontSize: 12 }}>Lokasi Keluar</Text>
                </View>
              </View>

              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: selectedLocation?.masuk?.latitude || -6.2,
                  longitude: selectedLocation?.masuk?.longitude || 106.8,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
              >
                {/* Marker Masuk */}
                {selectedLocation.masuk && (
                  <Marker coordinate={selectedLocation.masuk} pinColor="green">
                    <Callout>
                      <Text>Lokasi Masuk</Text>
                    </Callout>
                  </Marker>
                )}

                {/* Marker Keluar */}
                {selectedLocation.keluar && (
                  <Marker coordinate={selectedLocation.keluar} pinColor="red">
                    <Callout>
                      <Text>Lokasi Keluar</Text>
                    </Callout>
                  </Marker>
                )}
              </MapView>

              {/* Tombol Tutup */}
              <TouchableOpacity
                onPress={() => setMapModalVisible(false)}
                style={{ padding: 12, backgroundColor: '#1E2D56', alignItems: 'center' }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}


      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dateRangeBox}>
          <Text style={styles.dateRangeText}>{getTanggalRange(selectedYear)}</Text>
          <TouchableOpacity onPress={() => setYearModalVisible(true)}>
            <MaterialIcons name="filter-list" size={20} color="#1E2D56" />
          </TouchableOpacity>
        </View>

        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Kehadiran</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterBar}>
            {["Semua", "Hadir", "Alpa", "Cuti", "IDL", "IMP"].map((status) => (
              <TouchableOpacity key={status} onPress={() => setSelectedStatus(status)}>
                <Text style={[
                  styles.filterItem,
                  selectedStatus === status && styles.filterItemActive,
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {filteredKehadiran.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: '#666', fontStyle: 'italic' }}>Data kehadiran tidak ada</Text>
          </View>
        ) : (
          filteredKehadiran.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                if (item.lokasiMasuk) {
                  setSelectedLocation({
                    masuk: item.lokasiMasuk,
                    keluar: item.lokasiKeluar,
                  });
                  setMapModalVisible(true);
                } else {
                  Alert.alert("Lokasi Tidak Tersedia", "Belum ada lokasi untuk data ini.");
                }
              }}
            >
              <View style={styles.attendanceCard}>
                <View style={styles.cardContentRow}>
                  <View style={styles.leftContent}>
                    <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
                      <Text style={styles.badgeText}>{item.status}</Text>
                    </View>
                    <View style={styles.dateRow}>
                      <MaterialIcons name="calendar-today" size={18} color="#333" />
                      <Text style={styles.dateText}>{formatTanggal(item.tanggal)}</Text>
                    </View>
                  </View>
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
            </TouchableOpacity>
          ))
        )}
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
