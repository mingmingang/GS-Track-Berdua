import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import file bahasa
import en from "../../locales/en/en.json";
import id from "../../locales/id/id.json";
import ja from "../../locales/ja/ja.json";
import ko from "../../locales/ko/ko.json";
import th from "../../locales/th/th.json";

// Custom language detector
const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    try {
      const storedLang = await AsyncStorage.getItem("appLanguage");
      const locale = storedLang || Localization.locale?.substring(0, 2) || "id";
      callback(locale);
    } catch (e) {
      console.log("Error detecting language:", e);
      callback("id");
    }
  },
  init: () => {},
  cacheUserLanguage: async (lang) => {
    try {
      await AsyncStorage.setItem("appLanguage", lang);
    } catch (e) {
      console.log("Error caching language", e);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    fallbackLng: "id",
    resources: {
      en: { translation: en },
      id: { translation: id },
      ja: { translation: ja },
      ko: { translation: ko },
      th: { translation: th },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
