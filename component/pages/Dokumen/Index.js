import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Navbar from "../../backbone/Navbar";
import Header from "../../backbone/Header";
import i18n from "../../backbone/i18n";
import { useNavigation } from "@react-navigation/native";

const folderData = [
  { key: "cuti", color: "#DCEEFF", iconColor: "#3A82EE", size: "2 MB" },
  {
    key: "izinDinasLuar",
    color: "#FFF3C4",
    iconColor: "#FFAF00",
    size: "1 MB",
  },
  { key: "aktivitas", color: "#FDE2E2", iconColor: "#E74C3C", size: "5 MB" },
  { key: "suratJaminan", color: "#D0F0EF", iconColor: "#00B894", size: "3 MB" },
  { key: "lembur", color: "#DCEEFF", iconColor: "#3A82EE", size: "500 KB" },
  {
    key: "reimburseObat",
    color: "#FFF3C4",
    iconColor: "#FFAF00",
    size: "850 KB",
  },
  { key: "pusaka", color: "#FDE2E2", iconColor: "#E74C3C", size: "720 KB" },
  {
    key: "izinMeninggalkanPekerjaan",
    color: "#D0F0EF",
    iconColor: "#00B894",
    size: "900 KB",
  },
  { key: "permintaan", color: "#DCEEFF", iconColor: "#3A82EE", size: "1.5 MB" },
];

const DokumenFolderScreen = () => {
  const navigation = useNavigation();
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
          data={folderData}
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
