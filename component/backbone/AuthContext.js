import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (userData) => {
    const parsedAlamat =
      typeof userData.alamat === "string"
        ? JSON.parse(userData.alamat)
        : userData.alamat;

    const updatedUserData = {
      ...userData,
      alamat: parsedAlamat,
    };

    setUser(updatedUserData);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (e) {
      console.error("Gagal melakukan logout:", e);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Gagal memuat sesi user:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
