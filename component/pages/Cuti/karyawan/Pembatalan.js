import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { AuthContext } from "../../../backbone/AuthContext";
import Header from "../../../backbone/Header";
import { ActivityIndicator } from "react-native";
import styles from "../../../styles/Cuti/PembatalanStyles";
import { formatTanggal, generateTanggalCuti } from "../../../part/Date";
import { fetchDetailCuti, fetchTanggalCuti } from "../../../backbone/api";
import { getServerIP } from "../../../backbone/ApiConfig";

export default function PembatalanCutiScreen() {
  const [checkedDates, setCheckedDates] = useState({});
  const navigation = useNavigation();
  const [alasan, setAlasan] = useState("");
  const [tanggalCutiList, setTanggalCutiList] = useState([]);

  const toggleDate = (tanggal) => {
    setCheckedDates((prev) => ({
      ...prev,
      [tanggal]: !prev[tanggal],
    }));
  };
  const convertToSqlDate = (tanggalStr) => {
  const [day, monthStr, year] = tanggalStr.split(" ");
  const monthMap = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04",
    May: "05", Jun: "06", Jul: "07", Aug: "08",
    Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };
  const month = monthMap[monthStr];
  return `${year}-${month}-${day.padStart(2, "0")}`; // yyyy-MM-dd
};


  const handleSubmit = async () => {
    const selectedDates = Object.keys(checkedDates).filter(
      (k) => checkedDates[k]
    );
    if (selectedDates.length === 0) {
      alert("Pilih minimal satu tanggal untuk dibatalkan.");
      return;
    }

    const formattedDates = selectedDates.map(convertToSqlDate);

    console.log("tanggalnya", formattedDates);
    try {
      const ip = await getServerIP();
      const BASE_URL = `http://${ip}:8080`;

      const response = await fetch(
        `${BASE_URL}/cuti-detail/update-status?cutiId=${cutiId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tanggalList: formattedDates,
            alasan: alasan,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Pembatalan tanggal cuti berhasil.");
        navigation.goBack();
      } else {
        console.error(result);
        alert("Gagal membatalkan cuti.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    }
  };

  const route = useRoute();
  const { cutiId } = route.params || {};
  const { user } = useContext(AuthContext);

  const [cuti, setCuti] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      if (!cutiId) return;
      try {
        const data = await fetchDetailCuti(cutiId);
        const tanggalList = await fetchTanggalCuti(cutiId);

        setCuti(data);
        setTanggalCutiList(tanggalList);
      } catch (err) {
        setCuti(null);
        setTanggalCutiList([]);
      }
    };

    fetchData();
  }, [cutiId]);

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
            {tanggalCutiList.map((item, idx) => {
              const tanggalStr = formatTanggal(item.tanggalCuti);
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
            })}
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
