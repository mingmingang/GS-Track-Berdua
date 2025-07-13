import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../backbone/AuthContext";
import { LanguageContext } from "../../backbone/LanguageContext"; // ✅ Tambahkan ini
import Navbar from "../../backbone/Navbar";
import styles from "../../styles/ProfileStyles";
import { getServerIP } from "../../backbone/ApiConfig";
import i18n from "../../backbone/i18n";

export default function Profile() {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const { language } = useContext(LanguageContext); // ✅ Gunakan context untuk trigger re-render
  const [isPushEnabled, setIsPushEnabled] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  const toggleSwitch = () => setIsPushEnabled((prev) => !prev);

  const handleLogoutPress = () => {
    Alert.alert(
      i18n.t("confirm_logout"),
      i18n.t("logout_message"),
      [
        { text: i18n.t("cancel"), style: "cancel" },
        { text: i18n.t("logout"), style: "destructive", onPress: logout },
      ]
    );
  };

  useEffect(() => {
    const buildImageUrl = async () => {
      if (user?.fotoKaryawan) {
        const ip = await getServerIP();
        const fullUrl = `http://${ip}:8080/karyawan/lampiran/${encodeURIComponent(
          user.fotoKaryawan
        )}?t=${Date.now()}`;
        setImageUrl(fullUrl);
      }
    };
    buildImageUrl();
  }, [user]);

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{i18n.t("loading_user_data")}</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.headerSection}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <FontAwesome name="user" size={40} color="#666" />
            </View>
          )}
          <Text style={styles.username}>{user?.namaKaryawan}</Text>
          <Text style={styles.welcome}>{user?.email}</Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <View style={styles.menuLeft}>
              <FontAwesome name="user-o" size={20} color="#333" />
              <Text style={styles.menuLabel}>{i18n.t("profile")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={styles.menuLeft}>
              <MaterialIcons name="lock-outline" size={20} color="#333" />
              <Text style={styles.menuLabel}>{i18n.t("change_password")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("FAQs")}
          >
            <View style={styles.menuLeft}>
              <Feather name="help-circle" size={20} color="#333" />
              <Text style={styles.menuLabel}>{i18n.t("faqs")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("UbahBahasa")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="language-outline" size={20} color="#333" />
              <Text style={styles.menuLabel}>{i18n.t("change_language")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color="#333" />
              <Text style={styles.menuLabel}>{i18n.t("push_notification")}</Text>
            </View>
            <Switch
              value={isPushEnabled}
              onValueChange={toggleSwitch}
              trackColor={{ false: "#ccc", true: "#3CCA49" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
          <MaterialIcons name="logout" size={22} color="red" />
          <Text style={styles.logoutText}>{i18n.t("logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
      <Navbar />
    </>
  );
}
