import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../backbone/AuthContext";
import Navbar from "../backbone/Navbar";
import i18n from "../backbone/i18n";
import BASE_URL from "../backbone/Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { getServerIP } from "../backbone/ApiConfig";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 40) / 4;

const menuItems = [
  {
    titleKey: "menu_attendance",
    icon: "home",
    iconType: "MaterialIcons",
    color: "#BFD7FF",
  },
  {
    titleKey: "menu_leave",
    icon: "calendar-today",
    iconType: "MaterialIcons",
    color: "#F5C6C6",
  },
  {
    titleKey: "menu_idl",
    icon: "airplane-ticket",
    iconType: "MaterialIcons",
    color: "#DCC6F5",
  },
  {
    titleKey: "menu_activity",
    icon: "access-time",
    iconType: "MaterialIcons",
    color: "#F5D2B3",
  },
  {
    titleKey: "menu_guarantee",
    icon: "location-city",
    iconType: "MaterialIcons",
    color: "#C9E6C1",
  },
  {
    titleKey: "menu_overtime",
    icon: "account-balance-wallet",
    iconType: "MaterialIcons",
    color: "#E8D4AE",
  },
  {
    titleKey: "menu_reimburse",
    icon: "credit-card",
    iconType: "FontAwesome",
    color: "#C9E6E3",
  },
  {
    titleKey: "menu_pusaka",
    icon: "bar-chart",
    iconType: "FontAwesome",
    color: "#C7DBF7",
  },
  {
    titleKey: "menu_imp",
    icon: "directions-walk",
    iconType: "MaterialIcons",
    color: "#FBE59D",
  },
  {
    titleKey: "menu_request",
    icon: "local-cafe",
    iconType: "MaterialIcons",
    color: "#B4F1EE",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useContext(AuthContext);
  const [jamMasuk, setJamMasuk] = useState("-");
  const [jamKeluar, setJamKeluar] = useState("-");
  const [serverConnected, setServerConnected] = useState(true);
  const [gpsConnected, setGpsConnected] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const buildImageUrl = async () => {
      if (user?.fotoKaryawan) {
        const ip = await getServerIP();
        const fullUrl = `http://${ip}:8080/karyawan/lampiran/${encodeURIComponent(
          user.fotoKaryawan
        )}?t=${Date.now()}`;
        setImageUrl(fullUrl);
      }
    };
    buildImageUrl();
  }, [user]);
  console.log(" image", imageUrl);

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue !== null) {
        return JSON.parse(jsonValue);
      }
      return null;
    } catch (e) {
      console.error("❌ Gagal ambil data:", e);
      return null;
    }
  };

  const loadCurrentHadir = async () => {
    try {
      const current = await getData("lastLogin");
      const response = await fetch(BASE_URL + "kehadiran/currenthadir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idKaryawan: current.username,
        }),
      });

      const result = await response.json();

      if (result.result === 200 && result.data) {
        const masuk = result.data.masukAbsen;
        const keluar = result.data.keluarAbsen;

        const formatJam = (datetime) => {
          if (!datetime) return "-";
          const jam = new Date(datetime).getHours().toString().padStart(2, "0");
          const menit = new Date(datetime)
            .getMinutes()
            .toString()
            .padStart(2, "0");
          return `${jam}:${menit}`;
        };

        setJamMasuk(formatJam(masuk));
        setJamKeluar(formatJam(keluar));
      } else {
        setJamMasuk("-");
        setJamKeluar("-");
      }
    } catch (error) {
      console.error("Gagal ambil data kehadiran:", error);
      setJamMasuk("-");
      setJamKeluar("-");
    }
  };

  let locationSubscription = null;

  useEffect(() => {
    loadCurrentHadir();

    const interval = setInterval(() => {
      fetch(BASE_URL + "service/shoot")
        .then((res) => {
          setServerConnected(res.ok);
        })
        .catch(() => setServerConnected(false));
    }, 5000);

    const startWatchingLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("❌ Izin lokasi ditolak");
          setGpsConnected(false);
          return;
        }

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (location) => {
            console.log("📡 Lokasi Update:", location);
            setGpsConnected(true);
            if (!user.alamat) {
              const updatedUser = {
                ...user,
                alamat: {
                  alamat: "Belum ada",
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  timestamp: new Date().toISOString(),
                },
              };
              setUser(updatedUser);
            }
          },
          (error) => {
            console.log("❌ Gagal update lokasi:", error?.message || error);
            setGpsConnected(false);
          }
        );
      } catch (err) {
        console.error("❌ Error setup GPS:", err?.message || err);
        setGpsConnected(false);
      }
    };

    startWatchingLocation();

    return () => {
      clearInterval(interval);
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.leftSection}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <MaterialIcons
                  name="account-circle"
                  size={50}
                  color="#1E3668"
                  style={{ marginRight: 5 }}
                />
              )}

              <View style={styles.headerText}>
                <Text style={styles.welcomeText}>{i18n.t("welcome_back")}</Text>
                <Text style={styles.userName}>
                  {user?.namaKaryawan || "Pengguna"}!
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Notification")}
            >
              <MaterialIcons name="notifications" size={28} color="#1E3668" />
            </TouchableOpacity>
          </View>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusTag,
                { backgroundColor: serverConnected ? "#E3F6DC" : "#FFEBEE" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: serverConnected ? "#388E3C" : "#D32F2F" },
                ]}
              >
                {i18n.t(
                  serverConnected
                    ? "status.serverConnected"
                    : "status.serverDisconnected"
                )}
              </Text>
            </View>

            <View
              style={[
                styles.statusTag,
                { backgroundColor: gpsConnected ? "#E3F6DC" : "#FFEBEE" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: gpsConnected ? "#388E3C" : "#D32F2F" },
                ]}
              >
                {i18n.t(
                  gpsConnected
                    ? "status.gpsConnected"
                    : "status.gpsDisconnected"
                )}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.attendanceCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <MaterialIcons name="home" size={20} color="#fff" />
              <Text style={styles.attendanceTitle}>
                {i18n.t("my_attendance_today")}
              </Text>
            </View>
            <Text style={styles.attendanceDate}>
              {new Date().toLocaleDateString(i18n.language, {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>{jamMasuk}</Text>
              <Text style={styles.timeLabel}>{i18n.t("entry")}</Text>
            </View>

            <Text style={styles.arrow}>→</Text>

            <View style={styles.timeItem}>
              <Text style={styles.timeText}>{jamKeluar}</Text>
              <Text style={styles.timeLabel}>{i18n.t("exit")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          {menuItems.map((item, idx) => {
            const IconComponent =
              item.iconType === "FontAwesome"
                ? FontAwesome
                : item.iconType === "FontAwesome5"
                ? FontAwesome5
                : MaterialIcons;

            const title = i18n.t(item.titleKey);

            const handlePress = () => {
              switch (item.titleKey) {
                case "menu_attendance":
                  navigation.navigate("Kehadiran", { user });
                  break;
                case "menu_leave":
                  navigation.navigate(
                    user?.kry_jabatan === "Atasan" ? "CutiAtasan" : "Cuti",
                    { user }
                  );
                  break;
                case "menu_idl":
                  navigation.navigate("IDL");
                  break;
                case "menu_imp":
                  navigation.navigate("IMP");
                  break;
                case "menu_request":
                  navigation.navigate("PermintaanBerkas");
                  break;
                case "menu_reimburse":
                  navigation.navigate(
                    user?.jabatan === "Atasan"
                      ? "ReimbursementAtasan"
                      : "ReimbursementKaryawan"
                  );
                  break;
                default:
                  console.log("⚠️ Navigasi belum diatur untuk:", item.titleKey);
                  break;
              }
            };

            return (
              <TouchableOpacity key={idx} onPress={handlePress}>
                <View
                  style={[styles.menuItem, { backgroundColor: item.color }]}
                >
                  <IconComponent name={item.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.menuText}>{title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 30 },
  header: { padding: 16, backgroundColor: "#fff" },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  leftSection: { flexDirection: "row", alignItems: "center" },
  headerText: { flexDirection: "column" },
  welcomeText: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Poppins_400Regular",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E3668",
    fontFamily: "Poppins_600SemiBold",
  },
  statusRow: { flexDirection: "row", gap: 2, paddingLeft: 10 },
  statusTag: {
    backgroundColor: "#E3F6DC",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  statusText: {
    fontSize: 12,
    color: "#388E3C",
    fontFamily: "Poppins_500Medium",
  },
  attendanceCard: {
    backgroundColor: "#1E3668",
    borderRadius: 20,
    padding: 16,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  attendanceTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginLeft: 8,
  },
  attendanceDate: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  timeItem: { alignItems: "center" },
  timeText: {
    fontSize: 36,
    color: "#fff",
    fontFamily: "Poppins_700Bold",
  },
  timeLabel: {
    marginTop: 4,
    fontSize: 14,
    color: "#bfc6d6",
    fontFamily: "Poppins_400Regular",
  },
  arrow: { fontSize: 28, color: "#fff", marginHorizontal: 10 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  menuItem: {
    width: itemWidth - 16,
    margin: 10,
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 5,
    backgroundColor: "#ccc",
    borderColor: "#1E3668",
    borderWidth: 2,
  },
});
