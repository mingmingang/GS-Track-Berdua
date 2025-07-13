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
import { fetchDetailCuti } from "../../../backbone/api";

export default function PembatalanCutiScreen() {
  const [checkedDates, setCheckedDates] = useState({});
  const navigation = useNavigation();
  const [alasan, setAlasan] = useState("");

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
        const data = await fetchDetailCuti(cutiId);
        setCuti(data);
      } catch (err) {
        setCuti(null);
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
