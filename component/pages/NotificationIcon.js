import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from "../backbone/Constant";

const NotificationIcon = ({ navigation }) => {
  const [count, setCount] = useState(0);

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("❌ Gagal ambil data:", e);
      return null;
    }
  };

  const fetchCount = async () => {
    try {
      const user = await getData("lastLogin");
      if (!user || !user.username) return;

      const response = await fetch(BASE_URL + "notifikasi/count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idKaryawan: user.username }),
      });

      const data = await response.json();

      if (response.ok && data?.data != null) {
        setCount(data.data);
      } else {
        console.warn("⚠️ Response error:", data);
      }
    } catch (err) {
      //console.error("❌ Gagal fetch notifikasi:", err);
    }
  };

  useEffect(() => {
    fetchCount(); // initial load
    const interval = setInterval(fetchCount, 5000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="notifications" size={28} color="#1E3668" />
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {count > 99 ? "99+" : count}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NotificationIcon;

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
    padding: 5,
  },
  badge: {
    position: "absolute",
    right: -2,
    top: -2,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});