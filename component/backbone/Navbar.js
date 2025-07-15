import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRoute = route.name;

  const getColor = (routeName) => {
    return currentRoute === routeName ? "#1B3F6B" : "#9DA3AE";
  };

  return (
    <View style={styles.bottomNav}>
      {/* Home */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Home")}
      >
        <MaterialIcons
          name="home"
          size={24}
          color={getColor("Home")}
          style={styles.icon}
        />
        <Text style={[styles.navText, { color: getColor("Home") }]}>
          Beranda
        </Text>
      </TouchableOpacity>

      {/* Kalender */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Kalender")} // ganti kalau nama screen kalender berbeda
      >
        <MaterialIcons
          name="calendar-today"
          size={24}
          color={getColor("Kalender")}
          style={styles.icon}
        />
        <Text style={[styles.navText, { color: getColor("Kalender") }]}>
          Kalender
        </Text>
      </TouchableOpacity>

      {/* Dokumen */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Dokumen")} // pastikan ada screen ini
      >
        <MaterialIcons
          name="folder"
          size={24}
          color={getColor("Dokumen")}
          style={styles.icon}
        />
        <Text style={[styles.navText, { color: getColor("Dokumen") }]}>
          Dokumen
        </Text>
      </TouchableOpacity>

      {/* Profil */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Profile")}
      >
        <FontAwesome5
          name="user"
          size={22}
          color={getColor("Profile")}
          style={styles.icon}
        />
        <Text style={[styles.navText, { color: getColor("Profile") }]}>
          Profil
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 80,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
  },
  icon: {
    alignSelf: "center",
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
});
