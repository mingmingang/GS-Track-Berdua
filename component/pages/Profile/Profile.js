import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AuthContext } from "../../backbone/AuthContext"; 
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import Navbar from "../../backbone/Navbar";

const Profile = () => {
  const { user } = useContext(AuthContext); 

  return (
    <>
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <MaterialIcons
                name="account-circle"
                size={50}
                color="#1E3668"
                style={{ marginRight: 5 }}
              />
        <Text style={styles.name}>{user?.nama || "Nama Pengguna"}</Text>
        <Text style={styles.role}>{user?.tipeAkun || "Peran"}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>User ID</Text>
        <Text style={styles.info}>{user?.userId}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.info}>{user?.email || "-"}</Text>

        <Text style={styles.label}>Jabatan</Text>
        <Text style={styles.info}>{user?.jabatan || "-"}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => console.log("Logout")}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </View>
    <Navbar/>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#21376A",
  },
  role: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
});
