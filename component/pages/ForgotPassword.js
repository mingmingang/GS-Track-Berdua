// screens/ForgotPassword.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";
import Toast from "react-native-toast-message";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("http://172.20.10.2:8080/forgot-password", {
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
          text1: "Email Terkirim",
          text2: "Silakan cek email Anda untuk reset password.",
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: "Gagal",
          text2: result.message || "Email tidak ditemukan.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Kesalahan Server",
        text2: "Tidak dapat mengirim permintaan reset.",
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

      <Text style={styles.title}>Lupa Kata Sandi</Text>
      <Text style={styles.subtitle}>
        Masukkan email yang terdaftar untuk menerima link reset kata sandi.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Masukkan Email..."
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Kirim Email Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Kembali ke Login</Text>
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
    fontFamily:"Poppins_700Bold"
  },
  subtitle: {
    color: "#666",
    marginBottom: 10,
    fontSize: 15,
    fontFamily:"Poppins_500Medium"
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
