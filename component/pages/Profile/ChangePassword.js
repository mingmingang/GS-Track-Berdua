import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/EditProfileStyles";
import Header from "../../backbone/Header";
import { AuthContext } from "../../backbone/AuthContext";
import Toast from "react-native-toast-message";
import { updateUserPassword } from "../../backbone/api";
import i18n from "../../backbone/i18n";

const ChangePassword = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Validasi", i18n.t("change_password_required"));
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert("Validasi", i18n.t("change_password_min"));
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Validasi", i18n.t("change_password_mismatch"));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validatePassword()) return;

    try {
      const res = await updateUserPassword({
        npk: user.npk,
        oldPassword,
        newPassword,
      });

      if (res.result === 200) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: i18n.t("change_password_success"),
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: "Failed",
          text2: i18n.t("change_password_failed"),
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: i18n.t("change_password_error"),
      });
      console.log(error);
    }
  };

  const renderPasswordInput = (label, value, onChange, show, toggle) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={{ position: "relative" }}>
        <TextInput
          style={[styles.input, { paddingRight: 40 }]}
          secureTextEntry={!show}
          value={value}
          onChangeText={onChange}
        />
        <TouchableOpacity
          style={{ position: "absolute", right: 10, top: 10 }}
          onPress={toggle}
        >
          <Ionicons
            name={show ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Header title={i18n.t("change_password_title")} />
      <ScrollView contentContainerStyle={styles.form}>
        {renderPasswordInput(
          i18n.t("change_password_old"),
          oldPassword,
          setOldPassword,
          showOldPassword,
          () => setShowOldPassword((prev) => !prev)
        )}

        {renderPasswordInput(
          i18n.t("change_password_new"),
          newPassword,
          setNewPassword,
          showNewPassword,
          () => setShowNewPassword((prev) => !prev)
        )}

        {renderPasswordInput(
          i18n.t("change_password_confirm"),
          confirmPassword,
          setConfirmPassword,
          showConfirmPassword,
          () => setShowConfirmPassword((prev) => !prev)
        )}
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="save" color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.submitText}>
            {i18n.t("change_password_button")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePassword;
