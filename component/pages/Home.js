import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Login from "./Login";
import { AuthContext } from "../backbone/AuthContext";
import Navbar from "../backbone/Navbar";


const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 40) / 4;

const menuItems = [
  {
    title: "Kehadiran",
    icon: "home",
    iconType: "MaterialIcons", // dari MaterialIcons
    color: "#BFD7FF",
  },
  {
    title: "Cuti",
    icon: "calendar-today", // nama yang benar di MaterialIcons
    iconType: "MaterialIcons",
    color: "#F5C6C6",
  },
  {
    title: "IDL",
    icon: "airplane-ticket",
    iconType: "MaterialIcons", // dari FontAwesome
    color: "#DCC6F5",
  },
  {
    title: "Aktivitas",
    icon: "access-time",
    iconType: "MaterialIcons",
    color: "#F5D2B3",
  },
  {
    title: "Surat Jaminan",
    icon: "location-city",
    iconType: "MaterialIcons",
    color: "#C9E6C1",
  },
  {
    title: "Lembur",
    icon: "account-balance-wallet",
    iconType: "MaterialIcons",
    color: "#E8D4AE",
  },
  {
    title: "Reimburse Obat",
    icon: "credit-card",
    iconType: "FontAwesome", // alternatif: MaterialIcons
    color: "#C9E6E3",
  },
  {
    title: "Pusaka",
    icon: "bar-chart",
    iconType: "FontAwesome",
    color: "#C7DBF7",
  },
  {
    title: "IMP",
    icon: "directions-walk",
    iconType: "MaterialIcons",
    color: "#FBE59D",
  },
  {
    title: "Permintaan",
    icon: "local-cafe",
    iconType: "MaterialIcons",
    color: "#B4F1EE",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.leftSection}>
              <MaterialIcons
                name="account-circle"
                size={50}
                color="#1E3668"
                style={{ marginRight: 5 }}
              />
              <View style={styles.headerText}>
                <Text style={styles.welcomeText}>Selamat Datang Kembali</Text>
                <Text style={styles.userName}>{user?.nama || "Pengguna"}!</Text>
              </View>
            </View>
            <TouchableOpacity>
              <MaterialIcons name="notifications" size={28} color="#1E3668" />
            </TouchableOpacity>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusTag}>
              <Text style={styles.statusText}>📶 Sinyal Baik</Text>
            </View>
            <View style={styles.statusTag}>
              <Text style={styles.statusText}>🛰️ GPS Terhubung</Text>
            </View>
          </View>
        </View>

        <View style={styles.attendanceCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <MaterialIcons name="home" size={20} color="#fff" />
              <Text style={styles.attendanceTitle}>Kehadiranku hari ini</Text>
            </View>
            <Text style={styles.attendanceDate}>
              {new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>07:11</Text>
              <Text style={styles.timeLabel}>Masuk</Text>
            </View>

            <Text style={styles.arrow}>→</Text>

            <View style={styles.timeItem}>
              <Text style={styles.timeText}>16:01</Text>
              <Text style={styles.timeLabel}>Keluar</Text>
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

            const handlePress = () => {
              if (item.title === "Cuti") {
              navigation.navigate("Cuti", { user: user });
              }
              if (item.title === "IDL") {
                navigation.navigate("IDL");
              }
              if (item.title === "IMP") {
                navigation.navigate("IMP");
              }
            };

            return (
              <TouchableOpacity key={idx} onPress={handlePress}>
                <View
                  style={[styles.menuItem, { backgroundColor: item.color }]}
                >
                  <IconComponent name={item.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <Navbar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 30 },
  header: {
    padding: 16,
    backgroundColor: "#fff",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10, // Bagi dua sisi kiri-kanan
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    flexDirection: "column",
  },
  welcomeText: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Poppins_400Regular",
  },
  userName: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    fontWeight: "bold",
    color: "#1E3668",
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
    fontFamily: "Poppins_600SemiBold",
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendanceTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: "Poppins_600SemiBold",
  },
  attendanceDate: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  timeItem: {
    alignItems: "center",
  },
  timeText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  timeLabel: {
    marginTop: 4,
    fontSize: 14,
    color: "#bfc6d6",
  },
  arrow: {
    fontSize: 28,
    color: "#fff",
    marginHorizontal: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  menuItem: {
    width: itemWidth - 16, // 16 adalah total margin (8 kiri, 8 kanan)
    margin: 10,
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: { fontSize: 24, marginBottom: 5 },
  menuText: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  vaksinNote: {
    margin: 20,
    padding: 15,
    backgroundColor: "#A4DE8F",
    borderRadius: 10,
  },
  vaksinText: { color: "#fff", fontWeight: "bold", textAlign: "center" }
});
