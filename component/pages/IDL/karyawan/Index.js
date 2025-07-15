import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PanduanIDL from "../../../part/PanduanIDL";
import { getServerIP } from "../../../backbone/ApiConfig";
import { AuthContext } from "../../../backbone/AuthContext";

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

const getColorByStatus = (status) => {
  switch (status?.toLowerCase()) {
    case "menunggu persetujuan":
      return "#648DF0";
    case "belum diverifikasi":
      return "#FFC107";
    case "selesai":
      return "#4CAF50";
    case "ditolak":
      return "#f44336";
    default:
      return "#9E9E9E";
  }
};

const IDLScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [dataIDL, setDataIDL] = useState([]);
  const { user } = useContext(AuthContext);
  const userId = user?.npk || "";
  const nama = user?.namaKaryawan || "";

  useEffect(() => {
    const fetchIDL = async () => {
      try {
        const ip = await getServerIP();
        const url = `http://${ip}:8080/IDL/karyawan?idlNpk=${userId}`;
        console.log("🔗 Request URL:", url);

        const response = await fetch(url);
        const json = await response.json();

        console.log("📥 Raw Response:", json);

        const statusPriority = {
          "menunggu persetujuan": 1,
          "belum diverifikasi": 2,
          selesai: 3,
          ditolak: 4,
        };

        const mappedData = json
          .map((item) => ({
            id: item.idlNoRequest,
            npk: userId,
            nama: nama,
            alasan: item.idlJenisKegiatan,
            tanggal: formatTanggal(item.idlTanggalBerangkat),
            status: item.idlStatus,
            labelColor: getColorByStatus(item.idlStatus),

            // Tambahan data untuk detail:
            tanggalPengajuan: item.idlCreatedDate,
            tanggalBerangkat: item.idlTanggalBerangkat,
            jamBerangkat: item.idlWaktuBerangkat,
            tanggalKembali: item.idlTanggalKembali,
            jamKembali: item.idlWaktuKembali,
            lokasi1: item.idlLokasiPertama,
            lokasi2: item.idlLokasiKedua,
            lokasi3: item.idlLokasiKetiga,
            keterangan: item.idlKeterangan,
            berkasLampiran: item.idlBerkasLampiran,
          }))
          .sort((a, b) => {
            const statusA = a.status?.toLowerCase() || "";
            const statusB = b.status?.toLowerCase() || "";
            return (
              (statusPriority[statusA] || 999) -
              (statusPriority[statusB] || 999)
            );
          });

        setDataIDL(mappedData);

        console.log("✅ Mapped Data:", mappedData);
      } catch (error) {
        console.error("❌ Gagal fetch data IDL:", error);
      }
    };

    if (userId) {
      fetchIDL();
    } else {
      console.log("⚠️ userId kosong, fetchIDL tidak dipanggil");
    }
  }, [userId]);

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
        {dataIDL.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#999" }}>
            Belum ada data IDL.
          </Text>
        ) : (
          dataIDL.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>NPK: {item.npk}</Text>
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
                  onPress={() =>
                    navigation.navigate("LihatIDL", { idlData: item })
                  }
                >
                  <Text style={styles.viewText}>Lihat →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
