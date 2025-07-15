import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title, hideBack = false }) => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../assets/bg_navbar.png")}
      style={styles.header}
      resizeMode="cover"
    >
      {hideBack ? (
        <View style={{ width: 24 }} /> // space kosong jika disembunyikan
      ) : (
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          style={{ marginLeft: 15 }}
          onPress={() => navigation.goBack()}
        />
      )}
      <Text style={styles.headerText}>{title}</Text>
      <View style={{ width: 24 }} />
    </ImageBackground>
  );
};

export default Header;

const styles = StyleSheet.create({
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
    fontFamily: "Poppins_700Bold",
    marginRight:10

  },
});
