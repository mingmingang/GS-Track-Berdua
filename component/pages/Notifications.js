import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/NotificationStyles"; // pastikan lo punya file style
import Header from "../backbone/Header"; // atau komponen header lo
import i18n from "../backbone/i18n"; // kalau lo pakai i18n
import BASE_URL from "../backbone/Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("❌ Gagal ambil data:", e);
    return null;
  }
};

const getNotifIconProps = (tipeNotif) => {
  switch (tipeNotif) {
    case 1: // Kehadiran
      return {
        icon: "home",
        iconType: "MaterialIcons",
        bgColor: "#BFD7FF",
      };
    case 2: // Cuti
      return {
        icon: "calendar-today",
        iconType: "MaterialIcons",
        bgColor: "#F5C6C6",
      };
    case 3: // IDL
      return {
        icon: "airplane-ticket",
        iconType: "MaterialIcons",
        bgColor: "#DCC6F5",
      };
    case 4: // Aktivitas
      return {
        icon: "access-time",
        iconType: "MaterialIcons",
        bgColor: "#F5D2B3",
      };
    case 5: // Surat Jaminan
      return {
        icon: "location-city",
        iconType: "MaterialIcons",
        bgColor: "#C9E6C1",
      };
    case 6: // Lembur
      return {
        icon: "account-balance-wallet",
        iconType: "MaterialIcons",
        bgColor: "#E8D4AE",
      };
    case 7: // Reimburse Obat
      return {
        icon: "credit-card",
        iconType: "FontAwesome",
        bgColor: "#C9E6E3",
      };
    case 8: // Pusaka
      return {
        icon: "bar-chart",
        iconType: "FontAwesome",
        bgColor: "#C7DBF7",
      };
    case 9: // IMP
      return {
        icon: "directions-walk",
        iconType: "MaterialIcons",
        bgColor: "#FBE59D",
      };
    case 10: // Permintaan
      return {
        icon: "local-cafe",
        iconType: "MaterialIcons",
        bgColor: "#B4F1EE",
      };
    default:
      return {
        icon: "notifications",
        iconType: "MaterialIcons",
        bgColor: "#EEE",
      };
  }
};

export default function NotificationScreen() {
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Background warna berdasarkan tipe
  const renderIconBackground = (type) => {
    switch (type) {
      case "success":
        return "#D1FADF";
      case "cancel":
        return "#FDE2E2";
      case "wallet":
        return "#E6ECFF";
      case "complete":
        return "#FFF1CC";
      case "ongoing":
        return "#FFE9D6";
      default:
        return "#EEE";
    }
  };

  // Warna icon berdasarkan tipe
  const renderIconColor = (type) => {
    switch (type) {
      case "success":
        return "#1D9B54";
      case "cancel":
        return "#E74C3C";
      case "wallet":
        return "#2D7BF4";
      case "complete":
        return "#F5A623";
      case "ongoing":
        return "#F39C12";
      default:
        return "#666";
    }
  };

  const handleNotifPress = async (notif) => {
    setSelectedNotif(notif);
    setModalVisible(true);

    // Kalau belum dibaca, langsung update status
    if (notif.statusDibaca === 0) {
      try {
        await fetch(`${BASE_URL}notifikasi/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idNotif: notif.idNotif,
          }),
        });

        setNotifications((prev) =>
          prev.map((n) =>
            n.idNotif === notif.idNotif ? { ...n, statusDibaca: 1 } : n
          )
        );
      } catch (err) {
        console.error("❌ Gagal update status notifikasi:", err);
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      const user = await getData("lastLogin");
      console.log("userrr", user.username)
      const response = await fetch(`${BASE_URL}notifikasi/getAll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idKaryawan: user.username,
        }),
      });
      console.log("responn", response);

      const json = await response.json();
      console.log("Data notifikasi:", json);

      if (Array.isArray(json.data)) {
        const sortedData = json.data.sort((a, b) => {
          return new Date(b.tanggalNotifikasi) - new Date(a.tanggalNotifikasi);
        });

        setNotifications(sortedData);
      } else {
        console.warn("Data notifikasi bukan array:", json.data);
        setNotifications([]);
      }
    } catch (error) {
      //console.error("Gagal fetch notifikasi:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredData =
    filter === "unread"
      ? notifications.filter((n) => n.statusDibaca === 0)
      : notifications;

  const renderItem = ({ item }) => {
    const { icon, iconType, bgColor } = getNotifIconProps(item.tipeNotif);

    return (
      <TouchableOpacity onPress={() => handleNotifPress(item)}>
        <View style={styles.notificationItem}>
          <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
            {iconType === "MaterialIcons" ? (
              <MaterialIcons name={icon} size={18} color="#1E3668" />
            ) : (
              <FontAwesome name={icon} size={18} color="#1E3668" />
            )}
          </View>

          <View style={styles.notificationContent}>
            <Text style={styles.title}>{item.judulNotifikasi}</Text>
            <Text style={styles.message}>{item.pesanNotifikasi}</Text>
          </View>

          {item.statusDibaca === 0 && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Header title={i18n.t("notif_title")} />
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setFilter("all")}
            style={[styles.tabButton, filter === "all" && styles.tabActive]}
          >
            <Text
              style={filter === "all" ? styles.tabTextActive : styles.tabText}
            >
              {i18n.t("notif_tab_all")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter("unread")}
            style={[styles.tabButton, filter === "unread" && styles.tabActive]}
          >
            <Text
              style={
                filter === "unread" ? styles.tabTextActive : styles.tabText
              }
            >
              {i18n.t("notif_tab_unread")}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1E3668" />
        ) : filteredData.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ color: "#888", fontSize: 16 }}>
              🔔 Belum ada notifikasi
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: "85%",
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              elevation: 5,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              {selectedNotif?.judulNotifikasi}
            </Text>
            <Text style={{ fontSize: 16, color: "#333" }}>
              {selectedNotif?.pesanNotifikasi}
            </Text>

            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 20,
                backgroundColor: "#1E3668",
                padding: 10,
                borderRadius: 5,
                alignSelf: "flex-end",
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Tutup</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
