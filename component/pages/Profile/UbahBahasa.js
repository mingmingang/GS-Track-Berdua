import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { LanguageContext } from "../../backbone/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import Header from "../../backbone/Header";
import * as Updates from "expo-updates";
import { useTranslation } from "react-i18next";

export default function UbahBahasa() {
  const navigation = useNavigation();
  const { language, changeLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();

  const handleChangeLanguage = (lang) => {
    Alert.alert(
      t("language_confirm_title"),  // "Konfirmasi Bahasa"
      t("language_confirm_message"), // "Terapkan bahasa ini dan muat ulang aplikasi?"
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("apply"),
          onPress: async () => {
            await changeLanguage(lang);
            Updates.reloadAsync(); // Reload app
          },
        },
      ]
    );
  };

  const languages = [
    { code: "id", label: "🇮🇩 Bahasa Indonesia" },
    { code: "en", label: "🇺🇸 English" },
    { code: "ko", label: "🇰🇷 한국어 (Korean)" },
    { code: "ja", label: "🇯🇵 日本語 (Japanese)" },
    { code: "th", label: "🇹🇭 ภาษาไทย (Thai)" },
  ];

  return (
    <>
      <Header title={t("change_language")} />

      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
          {t("language_select")}
        </Text>

        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => handleChangeLanguage(lang.code)}
            style={{
              backgroundColor: language === lang.code ? "#3CCA49" : "#f0f0f0",
              padding: 16,
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: language === lang.code ? "white" : "#333",
              }}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
