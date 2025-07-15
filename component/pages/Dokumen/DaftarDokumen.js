import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Header from "../../backbone/Header";
import Navbar from "../../backbone/Navbar";
import { useRoute } from "@react-navigation/native";
import i18n from "../../backbone/i18n";
import { fetchCutiListAPI } from "../../backbone/api"; // pastikan path-nya benar
import { AuthContext } from "../../backbone/AuthContext";

const allDocuments = {
  lembur: [
    { id: "1", name: "Form Lembur 1", date: "2024-02-20" },
  ],
};

const DaftarDokumenScreen = () => {
  const route = useRoute();
  const { folderKey } = route.params;
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
const { user, logout } = useContext(AuthContext);


  useEffect(() => {
    const loadDokumen = async () => {
      setLoading(true);

      if (folderKey === "cuti") {
        const data = await fetchCutiListAPI(user?.npk, "", "Semua");

        const formatted = data.map((item) => ({
          id: item.id?.toString() || Math.random().toString(),
          name: `Cuti ${item.subTipeCuti || "-"}`,
          date: item.tanggalAwal,
        }));
        setDokumen(formatted);
      } else {
        setDokumen(allDocuments[folderKey] || []);
      }

      setLoading(false);
    };

    loadDokumen();
  }, [folderKey]);

  return (
    <>
      <Header title={i18n.t(`folders.${folderKey}`)} />
      <View style={styles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : dokumen.length === 0 ? (
          <Text style={styles.emptyText}>Tidak ada dokumen.</Text>
        ) : (
          <FlatList
            data={dokumen}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.documentItem}>
                <Text style={styles.documentName}>{item.name}</Text>
                <Text style={styles.documentDate}>{item.date}</Text>
              </View>
            )}
          />
        )}
      </View>
    </>
  );
};

export default DaftarDokumenScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FBFC",
  },
  documentItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  documentName: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  documentDate: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#888",
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
});

