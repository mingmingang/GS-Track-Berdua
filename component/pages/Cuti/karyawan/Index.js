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
import PanduanCuti from "../../../part/PanduanCuti";
import FilterTahun from "../../../part/Filter";

const dataCuti = [
  {
    id: "LVR202503013458",
    jenis: "Cuti Besar",
    status: "Terlaksana",
    tanggal: "27 Feb 2025 s/d 28 Feb 2025",
    statusColor: "#4CAF50",
    labelColor: "#4CAF50",
  },
  {
    id: "LVR202503013459",
    jenis: "Cuti Pribadi",
    status: "Belum Terlaksana",
    tanggal: "27 Feb 2025 s/d 28 Feb 2025",
    statusColor: "#FFEB3B",
    labelColor: "#FFC107",
  },
  {
    id: "LVR202503013460",
    jenis: "Cuti Pribadi",
    status: "Menunggu Persetujuan",
    tanggal: "27 Feb 2025 s/d 28 Feb 2025",
    statusColor: "#2196F3",
    labelColor: "#2196F3",
  },
  {
    id: "LVR202503013461",
    jenis: "Cuti Khusus",
    status: "Belum Terlaksana",
    tanggal: "27 Feb 2025 s/d 28 Feb 2025",
    statusColor: "#FFEB3B",
    labelColor: "#FFC107",
  },
  {
    id: "LVR202503013462",
    jenis: "Cuti Khusus",
    status: "Belum Terlaksana",
    tanggal: "27 Feb 2025 s/d 28 Feb 2025",
    statusColor: "#FFEB3B",
    labelColor: "#FFC107",
  },
  {
    id: "LVR202503013463",
    jenis: "Cuti Khusus",
    status: "Belum Terlaksana",
    tanggal: "27 Feb 2025 s/d 28 Feb 2025",
    statusColor: "#FFEB3B",
    labelColor: "#FFC107",
  },
];

const CutiScreen = ({ route }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [cutiList, setCutiList] = useState([]);
  const userId = route?.params?.user?.userId || "";
  const [selectedJenis, setSelectedJenis] = useState("Cuti Pribadi");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [yearModalVisible, setYearModalVisible] = useState(false);

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

  useEffect(() => {
    if (!userId) return;

    const query = new URLSearchParams({
      userId: userId,
      ...(selectedJenis && { jenis: selectedJenis }),
      ...(selectedStatus !== "Semua" && { status: selectedStatus }),
    });

    console.log("data query", query);

    fetch(`http://172.20.10.2:8080/cuti/user?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setCutiList(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Gagal mengambil data cuti", err);
        setCutiList([]);
      });
  }, [userId, selectedJenis, selectedStatus]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "terlaksana":
        return "#4CAF50";
      case "belum terlaksana":
        return "#FFC107";
      case "menunggu persetujuan":
      case "menunggu":
        return "#2196F3";
      default:
        return "#9E9E9E";
    }
  };

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
          style={{ paddingLeft: 20 }}
          onPress={() => {
            navigation.goBack();
          }}
        />

        <Text style={styles.headerText}>Menu Cuti</Text>
        <View style={{ width: 24 }} />
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabBar}>
            {["Cuti Pribadi", "Cuti Besar", "Cuti Khusus"].map((jenis) => (
              <TouchableOpacity
                key={jenis}
                onPress={() => setSelectedJenis(jenis)}
              >
                <Text
                  style={[
                    styles.tabItem,
                    selectedJenis === jenis && styles.tabItemActive,
                  ]}
                >
                  {jenis}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.dateRangeBox}>
          <Text style={styles.dateRangeText}>
            {getTanggalRange(selectedYear)}
          </Text>

          <View style={styles.iconsRight}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <MaterialIcons name="book" size={20} color="#1E2D56" />
            </TouchableOpacity>

            <PanduanCuti
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
            <TouchableOpacity onPress={() => setYearModalVisible(true)}>
              <MaterialIcons name="filter-list" size={20} color="#1E2D56" />
            </TouchableOpacity>
          </View>
        </View>

        <FilterTahun
          visible={yearModalVisible}
          onClose={() => setYearModalVisible(false)}
          selectedYear={selectedYear}
          onSelectYear={(year) => {
            setSelectedYear(year);
            // TODO: fetch data ulang jika dibutuhkan
          }}
        />

        <View style={styles.summaryBox}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Jenis</Text>
            <Text style={styles.summaryTitle}>Jumlah</Text>
          </View>

          {[
            { label: "Hak Cuti", jumlah: 50 },
            { label: "Pemakaian Cuti", jumlah: 10 },
            { label: "Cuti On Progres", jumlah: 5 },
            { label: "Sisa Cuti", jumlah: 35 },
          ].map((item, idx, arr) => (
            <View
              style={[
                styles.summaryRow,
                idx === arr.length - 1 && styles.lastRow,
              ]}
              key={idx}
            >
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <View style={styles.valueCell}>
                <Text style={styles.summaryValue}>{item.jumlah}</Text>
              </View>
            </View>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <MaterialIcons name="date-range" size={20} color="#1E2D56" />
          <Text style={{ marginLeft: 6 }}>
            Masa berlaku cuti:{" "}
            <Text style={{ color: "red", fontWeight: "bold" }}>
              30 Juni 2025
            </Text>
          </Text>
        </View>

        {/* Filter Daftar Cuti */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterBar}>
            {[
              "Semua",
              "Terlaksana",
              "Belum Terlaksana",
              "Menunggu Persetujuan",
            ].map((status) => (
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

        {cutiList.length === 0 && (
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              fontStyle: "italic",
              color: "#999",
            }}
          >
            Belum ada data cuti.
          </Text>
        )}

        {cutiList.map((item) => (
          <View key={item.cutiId} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.cutiId}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
                {item.status !== "Terlaksana" && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("PembatalanCuti", {
                        cutiId: item.cutiId,
                      })
                    }
                    style={{
                      backgroundColor: "red",
                      borderRadius: 20,
                      padding: 6,
                      marginLeft: 4,
                    }}
                  >
                    <MaterialIcons name="cancel" size={16} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Text style={styles.cardSub}>{item.jenisCuti}</Text>
            <View style={styles.cardRow}>
              <MaterialIcons name="access-time" size={16} color="#333" />
              <Text style={styles.cardDate}>
                {formatTanggal(item.tanggalAwal)} s/d{" "}
                {formatTanggal(item.tanggalAkhir)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() =>
                navigation.navigate("LihatCuti", { cutiId: item.cutiId })
              }
            >
              <Text style={styles.viewText}>Lihat →</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TambahCuti")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CutiScreen;

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
    fontWeight: "bold",
    fontFamily: "Poppins_700bold",
  },

  scrollContent: { padding: 16 },
  tabBar: { flexDirection: "row", marginBottom: 12 },
  tabItem: {
    color: "#aaa",
    marginRight: 16,
    fontFamily: "Poppins_600SemiBold",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tabItemActive: {
    color: "#1E2D56",
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    borderBottomWidth: 2,
    borderBottomColor: "#1E2D56",
  },

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

  summaryBox: {
    backgroundColor: "#eef3ff",
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  summaryHeader: {
    flexDirection: "row",
    backgroundColor: "#223B82",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  summaryTitle: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
  },
  summaryRow: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  summaryLabel: {
    flex: 1,
    textAlign: "left",
    color: "#000",
    paddingLeft: 15,
    fontFamily: "Poppins_500Medium",
  },
  summaryValue: {
    fontSize: 15,
    color: "#000",
  },
  valueCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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

  card: {
    backgroundColor: "#fff",
    elevation: 8,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#888",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  cardSub: {
    color: "#666",
    marginTop: 6,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 5,
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

  viewButton: { alignSelf: "flex-end" },
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
  yearModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  yearModalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "80%",
  },
  yearModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
