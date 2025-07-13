import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Toast from "react-native-toast-message";
import i18n from "../../component/backbone/i18n";
import { getServerIP } from "../backbone/ApiConfig";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      const ip = await getServerIP();
      const response = await fetch(`http://${ip}:8080/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        Toast.show({
          type: "success",
          text1: i18n.t("forgot.success_title"),
          text2: i18n.t("forgot.success_message"),
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: i18n.t("forgot.failed_title"),
          text2: result.message || i18n.t("forgot.failed_message"),
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: i18n.t("forgot.server_error_title"),
        text2: i18n.t("forgot.server_error_message"),
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.circleTopRight} />
      <View style={styles.circleBottomLeft} />

      <Image
        source={require("../../assets/forgotpass.png")}
        style={styles.image}
      />

      <Text style={styles.title}>{i18n.t("forgot.title")}</Text>
      <Text style={styles.subtitle}>{i18n.t("forgot.subtitle")}</Text>

      <TextInput
        style={styles.input}
        placeholder={i18n.t("forgot.placeholder")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>{i18n.t("forgot.button")}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← {i18n.t("forgot.back")}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 100,
  },
  circleTopRight: {
    position: "absolute",
    top: -90,
    right: -90,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#2C4591",
  },
  circleBottomLeft: {
    position: "absolute",
    bottom: -120,
    left: -120,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#2C4591",
    opacity: 0.8,
  },
  title: {
    fontSize: 28,
    color: "#21376A",
    fontWeight: "bold",
    marginBottom: 15,
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    color: "#666",
    marginBottom: 10,
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#21376A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backText: {
    color: "#21376A",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  image: {
    width: 380,
    height: 220,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
});
