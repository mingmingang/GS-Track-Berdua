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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { AuthContext } from "../../../backbone/AuthContext";
import Header from "../../../backbone/Header";
import { getServerIP } from "../../../backbone/ApiConfig";
import { ActivityIndicator } from "react-native";

export default function PembatalanCutiScreen() {
  const [checkedDates, setCheckedDates] = useState({});
  const navigation = useNavigation();
  const [alasan, setAlasan] = useState("");
  const [remember, setRemember] = useState(false);

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
    const fetchData = async () => {
      if (!cutiId) return;

      try {
        const ip = await getServerIP();
        const response = await fetch(`http://${ip}:8080/cuti/${cutiId}`);
        const data = await response.json();
        console.log("data", data);

        setCuti(data);
      } catch (err) {
        console.error("Gagal mengambil detail cuti", err);
        setCuti(null);
      }
    };

    fetchData();
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

  const generateTanggalCuti = (start, end) => {
    const dates = [];
    const current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
      dates.push(new Date(current)); // simpan sebagai Date object
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  if (!cuti) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E2D56" />
        <Text style={{ marginTop: 10 }}>Memuat detail cuti...</Text>
      </View>
    );
  }

  return (
    <>
      <Header title="Pembatalan Cuti" />
      <ScrollView style={styles.container}>

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
          value={cuti.tipeCuti}
          editable={false}
        />

        <Text style={styles.label}>Pengajuan Oleh</Text>
        <TextInput
          style={styles.disabledInput}
          value={user.namaKaryawan || "-"}
          editable={false}
        />

        <Text style={styles.label}>Tanggal Cuti</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.dateInput}
            value={formatTanggal(cuti.mulaiDari)}
            editable={false}
          />
          <TextInput
            style={styles.dateInput}
            value={formatTanggal(cuti.sampaiDengan)}
            editable={false}
          />
        </View>

        <Text style={styles.label}>Tanggal Pembatalan</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Tanggal</Text>
            <Text style={styles.tableHeaderText}>Batalkan</Text>
          </View>
          {generateTanggalCuti(cuti.mulaiDari, cuti.sampaiDengan).map(
            (tgl, idx) => {
              const tanggalStr = formatTanggal(tgl);
              return (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.tableText}>{tanggalStr}</Text>
                  <TouchableOpacity
                    onPress={() => toggleDate(tanggalStr)}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: checkedDates[tanggalStr]
                          ? "#21376A"
                          : "#fff",
                      },
                    ]}
                  >
                    {checkedDates[tanggalStr] && (
                      <MaterialIcons name="check" size={16} color="white" />
                    )}
                  </TouchableOpacity>
                </View>
              );
            }
          )}
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
        
      </View>
       </ScrollView>

       <View style={styles.buttonRow}>
             
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: "#2196F3",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  { backgroundColor: "#3CCA49" },
                ]}
             onPress={handleSubmit}
              >
                <Ionicons
                  name="send"
                  size={15}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
            </>
   
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
    fontFamily:"Poppins_700Bold"
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#21376A",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
   buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
});
