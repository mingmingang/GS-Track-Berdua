import React, { useState, useContext, useEffect } from "react";
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
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { AuthContext } from "../backbone/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getServerIP } from "../backbone/ApiConfig";
import i18n from "../backbone/i18n"; 

const Login = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadLastLogin = async () => {
      const saved = await AsyncStorage.getItem("lastLogin");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUsername(parsed.username);
        setPassword(parsed.password);
        setRemember(true);
      }
    };
    loadLastLogin();
  }, []);

  const handleLogin = async () => {
    try {
      const ip = await getServerIP();
      const response = await fetch(`http://${ip}:8080/karyawan/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          npk: username,
          password: password,
        }),
      });

      if (remember) {
        await AsyncStorage.setItem(
          "lastLogin",
          JSON.stringify({ username, password })
        );
      } else {
        await AsyncStorage.removeItem("lastLogin");
      }

      const result = await response.json();

      if (result.result === 200) {
        await login(result.data);

        console.log("data abis log", result.data);

        Toast.show({
          type: "success",
          text1: i18n.t("login_success"),
          text2: i18n.t("welcome_user", { name: result.data.namaKaryawan }),
        });

        setTimeout(() => {
          navigation.replace("Home");
        }, 1500);
      } else {
        Toast.show({
          type: "error",
          text1: i18n.t("login_failed"),
          text2: result.message || i18n.t("check_credentials"),
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: i18n.t("server_error"),
        text2: i18n.t("server_unreachable"),
      });
      console.error(error);
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
        source={require("../../assets/loginimg.png")}
        style={styles.image}
      />

      <View style={styles.formWrapper}>
        <Text style={styles.title}>
          <Text style={styles.titleBold}>GS</Text> Track
        </Text>

        <Text style={styles.subtitle}>{i18n.t("login_instruction")}</Text>

        <Text style={styles.label}>{i18n.t("username_label")}</Text>
        <TextInput
          style={styles.input}
          placeholder={i18n.t("username_placeholder")}
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>{i18n.t("password_label")}</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.inputPassword}
            placeholder={i18n.t("password_placeholder")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.rememberMe}>
            <TouchableOpacity
              onPress={() => setRemember(!remember)}
              style={[
                styles.checkbox,
                { backgroundColor: remember ? "#21376A" : "#fff" },
              ]}
            >
              {remember && (
                <MaterialIcons name="check" size={16} color="white" />
              )}
            </TouchableOpacity>
            <Text style={styles.rememberText}>{i18n.t("remember_me")}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgot}>{i18n.t("forgot_password")}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{i18n.t("login_button")}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

// Styles tidak perlu diubah
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 80,
  },
  circleTopRight: {
    position: "absolute",
    top: -100,
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
    fontSize: 60,
    textAlign: "center",
    color: "#21376A",
    fontFamily: "Poppins_500Medium",
  },
  titleBold: {
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    textAlign: "justify",
    marginVertical: 10,
    fontSize: 15,
    color: "#999",
    fontFamily: "Poppins_400Regular",
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#21376A",
    fontFamily: "Poppins_600SemiBold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    fontFamily: "Poppins_500Medium",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    color: "#21376A",
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
  },
  forgot: {
    color: "#21376A",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins_700Bold",
  },
  button: {
    backgroundColor: "#21376A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    fontFamily: "Poppins_600SemiBold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins_600SemiBold",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#21376A",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  image: {
    width: 500,
    height: 250,
    resizeMode: "contain",
    alignSelf: "center",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  inputPassword: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 5,
    fontSize: 16,
    color: "#000",
    fontFamily: "Poppins_500Medium",
  },
});