import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { AuthContext } from "../../../backbone/AuthContext";

export default function PembatalanCutiScreen() {
  const [checkedDates, setCheckedDates] = useState({});
  const navigation = useNavigation();
  const [alasan, setAlasan] = useState("");

  const tanggalCuti = ["19 Mei 2025", "20 Mei 2025", "21 Mei 2025"];

  const toggleDate = (tanggal) => {
    setCheckedDates((prev) => ({
      ...prev,
      [tanggal]: !prev[tanggal],
    }));
  };

  const handleSubmit = () => {
    console.log(
      "Tanggal dibatalkan:",
      Object.keys(checkedDates).filter((k) => checkedDates[k])
    );
    console.log("Alasan:", alasan);
  };

  const route = useRoute();
  const { cutiId } = route.params || {};
  const { user } = useContext(AuthContext);

  const [cuti, setCuti] = useState(null);
  useEffect(() => {
    if (!cutiId) return;

    fetch(`http://172.20.10.2:8080/cuti/${cutiId}`)
      .then((res) => res.json())
      .then((data) => setCuti(data))
      .catch((err) => {
        console.error("Gagal mengambil detail cuti", err);
        setCuti(null);
      });
  }, [cutiId]);

  const formatTanggal = (tanggalStr) => {
    const bulanIndo = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const tgl = new Date(tanggalStr);
    return `${tgl.getDate()} ${bulanIndo[tgl.getMonth()]} ${tgl.getFullYear()}`;
  };

  if (!cuti) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Memuat detail cuti...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require("../../../../assets/bg_navbar.png")}
        style={styles.header}
        resizeMode="cover"
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          style={{ paddingLeft: "20" }}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Pembatalan Cuti</Text>
        <View style={{ width: 24 }} />
      </ImageBackground>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>No. Pengajuan Cuti</Text>
        <TextInput
          style={styles.disabledInput}
          value={cuti.cutiId}
          editable={false}
        />

        <Text style={styles.label}>Tipe Cuti</Text>
        <TextInput
          style={styles.disabledInput}
          value={cuti.jenisCuti}
          editable={false}
        />

        <Text style={styles.label}>Pengajuan Oleh</Text>
        <TextInput
          style={styles.disabledInput}
          value={user.nama || "-"}
          editable={false}
        />

        <Text style={styles.label}>Tanggal Cuti</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.dateInput}
            value={formatTanggal(cuti.tanggalAwal)}
            editable={false}
          />
          <TextInput
            style={styles.dateInput}
            value={formatTanggal(cuti.tanggalAkhir)}
            editable={false}
          />
        </View>

        <Text style={styles.label}>Tanggal Pembatalan</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Tanggal</Text>
            <Text style={styles.tableHeaderText}>Check</Text>
          </View>
          {tanggalCuti.map((tgl, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableText}>{tgl}</Text>
              {/* <CheckBox
                value={checkedDates[tgl] || false}
                onValueChange={() => toggleDate(tgl)}
                tintColors={{ true: "#1E2D56", false: "#aaa" }}
              /> */}
            </View>
          ))}
        </View>

        <Text style={styles.label}>Alasan Pembatalan</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Masukan alasan"
          multiline
          numberOfLines={4}
          value={alasan}
          onChangeText={setAlasan}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#1E2D56",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    height: 100,
    justifyContent: "space-between",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins_700bold",
  },
  form: {
    padding: 16,
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "#333",
    fontFamily: "Poppins_700Bold",
  },
  disabledInput: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 12,
    color: "#A0AEC0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateInput: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 12,
    color: "#333",
    marginRight: 8,
  },
  table: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#1E3A8A",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableHeaderText: {
    color: "white",
    fontWeight: "bold",
  },
  tableRow: {
    backgroundColor: "#EEF3FF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableText: {
    color: "#333",
  },
  textArea: {
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 12,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#3CCA49",
    borderRadius: 12,
    marginTop: 20,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
  },
});
