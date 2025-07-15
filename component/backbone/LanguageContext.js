import React, { createContext, useState, useEffect } from "react";
import i18n from "./i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.locale);

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem("appLanguage");
      if (storedLang) {
        i18n.locale = storedLang;
        setLanguage(storedLang);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lang) => {
    i18n.locale = lang;
    setLanguage(lang);
    await AsyncStorage.setItem("appLanguage", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
