import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import Navbar from "../backbone/Navbar";
import { MaterialIcons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../backbone/Constant";
import Header from "../backbone/Header";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("❌ Gagal ambil data:", e);
    return null;
  }
};

const getStatusBackgroundColor = (status) => {
  switch (status) {
    case "Hadir":
      return "rgba(76, 175, 80, 0.15)"; // green soft
    case "Alpa":
      return "rgba(244, 67, 54, 0.15)"; // red soft
    case "Cuti":
      return "rgba(255, 193, 7, 0.15)"; // yellow soft
    case "IMP":
      return "rgba(33, 150, 243, 0.15)"; // blue soft
    case "IDL":
      return "rgba(0, 188, 212, 0.15)"; // cyan soft
    default:
      return "rgba(0,0,0,0.05)"; // fallback soft gray
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Hadir":
      return "rgba(76, 175, 80, 0.15)"; // green soft
    case "Alpa":
      return "rgba(244, 67, 54, 0.15)"; // red soft
    case "Cuti":
      return "rgba(255, 193, 7, 0.15)"; // yellow soft
    case "IMP":
      return "rgba(33, 150, 243, 0.15)"; // blue soft
    case "IDL":
      return "rgba(0, 188, 212, 0.15)"; // cyan soft
    default:
      return "rgba(0,0,0,0.05)"; // fallback gray
  }
};

const getStatusTextColor = (status) => {
  switch (status) {
    case "Hadir":
      return "#4CAF50";
    case "Alpa":
      return "#F44336";
    case "Cuti":
      return "#FFC107";
    case "IMP":
      return "#2196F3";
    case "IDL":
      return "#00BCD4";
    default:
      return "#000";
  }
};

const getMonthIndex = (bulan) => {
  const bulanIndex = [
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
  return bulanIndex.indexOf(bulan) + 1;
};

export default function KalenderScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("Juli");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [currentDate, setCurrentDate] = useState("2025-07-01");
  const [showDateModal, setShowDateModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});

  const getStatusFromIndikator = (indikator) => {
    switch (indikator) {
      case 1:
        return "Hadir";
      case 0:
        return "Alpa";
      case 2:
        return "Cuti";
      case 3:
        return "IMP";
      case 4:
        return "IDL";
      default:
        return "Unknown";
    }
  };

  const fetchKehadiranByMonth = async () => {
    try {
      const user = await getData("lastLogin");

      if (!user?.username) {
        Alert.alert("Error", "Data login tidak ditemukan.");
        return;
      }

      const response = await fetch(`${BASE_URL}kehadiran/currentlogged`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idKaryawan: user.username,
        }),
      });

      const data = await response.json();
      // console.log("✅ Kehadiran data:", data);

      // Cek kalau isinya array
      if (Array.isArray(data.data)) {
        const formatted = {};
        data.data.forEach((item) => {
          formatted[item.tanggalMasuk] = {
            status: getStatusFromIndikator(item.indikatorKehadiran),
          };
        });
        console.log("✅ formatted data", formatted); // ✔ buat debugging
        setAttendanceData(formatted); // ✅ baru ini nge-set state
      } else {
        setAttendanceData({});
      }
    } catch (err) {
      console.error("❌ Error fetch kehadiran:", err);
      Alert.alert("Gagal", "Tidak bisa memuat data kehadiran.");
    }
  };

  const bulanList = [
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

  const tahunList = Array.from({ length: 100 }, (_, i) =>
    (2001 + i).toString()
  ); // 2020 - 2030

  const toggleFilter = (status) => {
    setActiveFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };
  const filteredMarkedDates = Object.keys(attendanceData).reduce(
    (acc, date) => {
      const entry = attendanceData[date];
      if (!entry) return acc;

      const status = entry.status;

      if (activeFilters.length === 0 || activeFilters.includes(status)) {
        acc[date] = {
          customStyles: {
            container: {
              backgroundColor: getStatusBackgroundColor(status),
              borderRadius: 6,
            },
            text: {
              color: getStatusTextColor(status),
              fontWeight: "600",
            },
          },
        };
      }

      return acc;
    },
    {}
  );

  useEffect(() => {
    fetchKehadiranByMonth();
  }, []);

  return (
    <>
      <Header title="Kalendar" hideBack={true} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.dateLabel}>
              {selectedMonth} {selectedYear}
            </Text>

            <View style={styles.rightActions}>
              <TouchableOpacity
                onPress={() => setShowDateModal(true)}
                style={styles.iconBtn}
              >
                <MaterialIcons name="calendar-month" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkinBtn}
                onPress={async () => {
                  try {
                    const current = await getData("lastLogin");
                    if (!current?.username) {
                      Alert.alert("Error", "Data login tidak ditemukan.");
                      return;
                    }

                    const response = await fetch(
                      `${BASE_URL}kehadiran/currenthadir`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          idKaryawan: current.username,
                        }),
                      }
                    );

                    const resJson = await response.json();

                    if (resJson.data?.masukAbsen !== null) {
                      Alert.alert(
                        "Info",
                        "Anda sudah melakukan check-in hari ini."
                      );
                      return;
                    }

                    const now = new Date();
                    const jam = now.getHours();
                    const menit = now.getMinutes();

                    if (jam < 6) {
                      Alert.alert(
                        "Terlalu pagi!",
                        "Check-in hanya bisa dilakukan mulai jam 06:00 pagi."
                      );
                      return;
                    }

                    if (jam > 9 || (jam === 9 && menit > 0)) {
                      Alert.alert(
                        "Terlambat!",
                        "Check-in hanya bisa dilakukan sebelum jam 09:00."
                      );
                      return;
                    }

                    navigation.navigate("Checkin");
                  } catch (err) {
                    console.error("❌ Gagal fetch atau parsing:", err);
                    Alert.alert(
                      "Gagal",
                      "Terjadi kesalahan saat memproses check-in."
                    );
                  }
                }}
              >
                <Text style={styles.checkBtnText}>Check-in</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={async () => {
                  try {
                    const current = await getData("lastLogin");
                    if (!current?.username) {
                      Alert.alert("Error", "Data login tidak ditemukan.");
                      return;
                    }

                    const response = await fetch(
                      `${BASE_URL}kehadiran/currenthadir`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          idKaryawan: current.username,
                        }),
                      }
                    );

                    const resJson = await response.json();
                    console.log("✅ Response:", resJson);

                    if (!resJson.data) {
                      Alert.alert("Info", "Anda sudah terlambat.");
                      return;
                    }

                    const { masukAbsen, keluarAbsen, indikatorKehadiran } =
                      resJson.data;

                    if (indikatorKehadiran === 0) {
                      Alert.alert("Info", "Anda sudah tercatat alpa.");
                      return;
                    }

                    if (masukAbsen === null) {
                      Alert.alert("Info", "Anda belum melakukan check-in.");
                      return;
                    }

                    if (keluarAbsen !== null) {
                      Alert.alert("Info", "Anda sudah melakukan check-out.");
                      return;
                    }

                    const now = new Date();
                    const jam = now.getHours();

                    if (jam < 16) {
                      Alert.alert(
                        "Belum waktunya!",
                        "Check-out hanya bisa dilakukan setelah jam 16:00."
                      );
                      return;
                    }

                    // Lolos validasi
                    navigation.navigate("Checkout");
                  } catch (err) {
                    console.error("❌ Gagal fetch atau parsing:", err);
                    Alert.alert(
                      "Gagal",
                      "Terjadi kesalahan saat memproses check-out."
                    );
                  }
                }}
              >
                <Text style={styles.checkBtnText}>Check-out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView>
          <Calendar
            key={currentDate}
            current={currentDate}
            markingType="custom"
            markedDates={filteredMarkedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              backgroundColor: "#fff",
              calendarBackground: "#fff",
              dayTextColor: "rgba(30, 30, 30, 0.8)",
              todayTextColor: "#1E3668",
              selectedDayBackgroundColor: "#1E3668",
              selectedDayTextColor: "#fff",
              textDisabledColor: "rgba(0,0,0,0.1)",
              monthTextColor: "#1E3668",
              arrowColor: "#1E3668",
              textDayFontFamily: "Poppins_500Medium",
              textMonthFontFamily: "Poppins_600SemiBold",
              textDayHeaderFontFamily: "Poppins_500Medium",
              textDayFontSize: 15,
              textMonthFontSize: 17,
              textDayHeaderFontSize: 13,
            }}
          />

          <View style={styles.legendContainer}>
            {["Hadir", "Alpa", "Cuti", "IMP", "IDL"].map((status) => (
              <View key={status} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: getStatusColor(status) },
                  ]}
                />
                <Text style={styles.legendLabel}>{status}</Text>
              </View>
            ))}
          </View>

          {selectedDate && attendanceData[selectedDate] && (
            <View style={styles.detailCard}>
              <Text style={styles.detailText}>
                Tanggal {selectedDate} - Status:{" "}
                {attendanceData[selectedDate].status}
              </Text>
            </View>
          )}
        </ScrollView>

        <Navbar />

        <Modal visible={showDateModal} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalContainer}
              >
                <Text style={styles.modalTitle}>Pilih Bulan & Tahun</Text>

                <Text style={styles.modalSubTitle}>Bulan</Text>
                <View
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                  }}
                >
                  <Picker
                    selectedValue={selectedMonth}
                    onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                    style={{ color: "#000" }}
                  >
                    {bulanList.map((bulan) => (
                      <Picker.Item key={bulan} label={bulan} value={bulan} />
                    ))}
                  </Picker>
                </View>

                <Text style={styles.modalSubTitle}>Tahun</Text>
                <View
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                  }}
                >
                  <Picker
                    selectedValue={selectedYear}
                    onValueChange={(itemValue) => setSelectedYear(itemValue)}
                    style={{ color: "#000" }}
                  >
                    {tahunList.map((tahun) => (
                      <Picker.Item key={tahun} label={tahun} value={tahun} />
                    ))}
                  </Picker>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    const monthNumber = getMonthIndex(selectedMonth)
                      .toString()
                      .padStart(2, "0");
                    const newDate = `${selectedYear}-${monthNumber}-01`;
                    setCurrentDate(newDate);
                    setShowDateModal(false);
                  }}
                  style={styles.closeModalBtn}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Simpan
                  </Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  imageHeader: {
    backgroundColor: "#1E2D56",
    height: 100,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
    paddingTop: 15,
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1E3668",
    flex: 1,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    backgroundColor: "#1E3668",
    borderRadius: 8,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  checkinBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  checkoutBtn: {
    backgroundColor: "#F44336",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  checkBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 14,
    color: "#1E2D56",
    fontWeight: "500",
  },
  detailCard: {
    margin: 16,
    backgroundColor: "#E7EFFD",
    padding: 12,
    borderRadius: 8,
  },
  detailText: {
    color: "#1E2D56",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    elevation: 5, // untuk Android
    shadowColor: "#000", // untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalSubTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
    color: "#1E2D56",
    alignSelf: "flex-start",
  },
  closeModalBtn: {
    backgroundColor: "#1E2D56",
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
    width: "100%",
  },
  picker: {
    width: "100%",
    height: 50,
    marginBottom: 16,
  },
});
