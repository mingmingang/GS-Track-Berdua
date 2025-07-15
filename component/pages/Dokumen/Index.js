import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Navbar from "../../backbone/Navbar";
import Header from "../../backbone/Header";
import i18n from "../../backbone/i18n";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "../../backbone/Constant";

const getFolderData = (cutiSizeBytes) => ([
  {
    key: "cuti",
    color: "#DCEEFF",
    iconColor: "#3A82EE",
    size: formatSize(cutiSizeBytes),
  },
  {
    key: "izinDinasLuar",
    color: "#FFF3C4",
    iconColor: "#FFAF00",
    size: "-",
  },
  {
    key: "aktivitas",
    color: "#FDE2E2",
    iconColor: "#E74C3C",
    size: "-",
  },
  {
    key: "suratJaminan",
    color: "#D0F0EF",
    iconColor: "#00B894",
    size: "-",
  },
  {
    key: "lembur",
    color: "#DCEEFF",
    iconColor: "#3A82EE",
    size: "-",
  },
  {
    key: "reimburseObat",
    color: "#FFF3C4",
    iconColor: "#FFAF00",
    size: "-",
  },
  {
    key: "pusaka",
    color: "#FDE2E2",
    iconColor: "#E74C3C",
    size: "-",
  },
  {
    key: "izinMeninggalkanPekerjaan",
    color: "#D0F0EF",
    iconColor: "#00B894",
    size: "-",
  },
  {
    key: "permintaan",
    color: "#DCEEFF",
    iconColor: "#3A82EE",
    size: "-",
  },
]);

const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return "-";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
};


const DokumenFolderScreen = () => {
  const navigation = useNavigation();
  const [cutiSize, setCutiSize] = useState(0);

  useEffect(() => {
    const fetchCutiSize = async () => {
      try {
        const res = await fetch(BASE_URL + "cuti/size");
        const data = await res.json(); // { cuti: 2097152 }
        setCutiSize(data?.cuti || 0);
      } catch (err) {
        console.error("❌ Gagal ambil ukuran cuti:", err);
      }
    };

    fetchCutiSize();
  }, []);



  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.folderCard, { backgroundColor: item.color }]}
      onPress={() =>
        navigation.navigate("OpenFolder", { folderKey: item.key })
      }
    >
      <View style={styles.folderRow}>
        <MaterialCommunityIcons
          name="folder"
          size={30}
          color={item.iconColor}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.folderName}>{i18n.t(`folders.${item.key}`)}</Text>
          <Text style={styles.folderSize}>{item.size}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="dots-vertical" size={20} color="#777" />
    </TouchableOpacity>
  );

  return (
    <>
      <Header title={i18n.t("documentFolders")} hideBack={true} />
      <View style={styles.container}>
        <FlatList
          data={getFolderData(cutiSize)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
      <Navbar />
    </>
  );
};

export default DokumenFolderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FBFC",
  },
  folderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  folderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  folderName: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  folderSize: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins_400Regular",
  },
  documentFolders: "Folder Dokumen",
  folders: {
    cuti: "Cuti",
    izinDinasLuar: "Izin Dinas Luar",
    aktivitas: "Aktivitas",
    suratJaminan: "Surat Jaminan",
    lembur: "Lembur",
    reimburseObat: "Reimburse Obat",
    pusaka: "Pusaka",
    izinMeninggalkanPekerjaan: "Izin Meninggalkan Pekerjaan",
    permintaan: "Permintaan",
  },
});
