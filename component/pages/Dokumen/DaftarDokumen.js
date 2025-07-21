import React, { useContext, useEffect, useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, Alert, SafeAreaView } from "react-native";
import Header from "../../backbone/Header";
import Navbar from "../../backbone/Navbar";
import { useRoute } from "@react-navigation/native";
import i18n from "../../backbone/i18n";
import { fetchCutiListAPI } from "../../backbone/api"; // pastikan path-nya benar
import { AuthContext } from "../../backbone/AuthContext";
import { downloadLampiranFile } from "../../utils/DownloadLampiran";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";

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
  const { user } = useContext(AuthContext);
  const [searchText, setSearchText] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");

  useEffect(() => {
    const loadDokumen = async () => {
      setLoading(true);

      if (folderKey === "cuti") {
        const data = await fetchCutiListAPI(user?.npk, "", "Semua");

        const formatted = data.map((item) => ({
          id: item.id?.toString() || Math.random().toString(),
          name: `Cuti ${item.sub_tipe_cuti || item.subTipeCuti || "-"}`,
          date: item.tanggal_awal || item.tanggal || item.tanggalAwal,
          lampiran: item.lampiran,
        }));

        setDokumen(formatted);
      } else {
        setDokumen(allDocuments[folderKey] || []);
      }

      setLoading(false);
    };

    loadDokumen();
  }, [folderKey]);

  const handleDownload = (filename) => {
    if (!filename) {
      Alert.alert("Gagal", "Lampiran tidak tersedia.");
      return;
    }
    downloadLampiranFile(filename);
  };

  const filteredDokumen = dokumen.filter((item) => {
    const nameMatch = item.lampiran?.toLowerCase().includes(searchText.toLowerCase());
    const extension = item.lampiran?.split(".").pop().toLowerCase() || "";
    const fileTypeMatch = fileTypeFilter === "All" || extension === fileTypeFilter.toLowerCase();

    const itemDate = moment(item.date);
    const monthMatch = monthFilter === "All" || itemDate.format("MM") === monthFilter;
    const yearMatch = yearFilter === "All" || itemDate.format("YYYY") === yearFilter;

    return nameMatch && fileTypeMatch && monthMatch && yearMatch;
  });

  const fileTypes = useMemo(() => {
    return Array.from(
      new Set(
        dokumen
          .map((d) => d.lampiran?.split(".").pop()?.toLowerCase())
          .filter((ext) => ext)
      )
    );
  }, [dokumen]);

  const years = useMemo(() => {
    return Array.from(new Set(dokumen.map((d) => moment(d.date).format("YYYY"))));
  }, [dokumen]);

  return (
    <>
      <Header title={i18n.t(`folders.${folderKey}`)} />
      <SafeAreaView style={styles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : dokumen.length === 0 ? (
          <Text style={styles.emptyText}>Tidak ada dokumen.</Text>
        ) : (
          <>
            <View style={{ marginBottom: 20 }}>
              <TextInput
                placeholder="Cari berdasarkan nama file..."
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
              />

              <View style={styles.filterRow}>
                {/* Tipe File */}
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Tipe File</Text>
                  <Picker
                    selectedValue={fileTypeFilter}
                    onValueChange={setFileTypeFilter}
                    style={styles.picker}
                    dropdownIconColor="#333"
                  >
                    <Picker.Item label="Semua Tipe" value="All" />
                    {fileTypes.map((ext) => (
                      <Picker.Item key={ext} label={ext.toUpperCase()} value={ext} />
                    ))}
                  </Picker>
                </View>

                {/* Bulan */}
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Bulan</Text>
                  <Picker
                    selectedValue={monthFilter}
                    onValueChange={setMonthFilter}
                    style={styles.picker}
                    dropdownIconColor="#333"
                  >
                    <Picker.Item label="Semua Bulan" value="All" />
                    {moment.months().map((month, index) => (
                      <Picker.Item
                        key={index}
                        label={month}
                        value={String(index + 1).padStart(2, "0")}
                      />
                    ))}
                  </Picker>
                </View>

                {/* Tahun */}
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Tahun</Text>
                  <Picker
                    selectedValue={yearFilter}
                    onValueChange={setYearFilter}
                    style={styles.picker}
                    dropdownIconColor="#333"
                  >
                    <Picker.Item label="Semua Tahun" value="All" />
                    {years.map((year) => (
                      <Picker.Item key={year} label={year} value={year} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>



            <FlatList
              data={filteredDokumen}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 80 }}
              renderItem={({ item }) => (
                <View style={styles.documentItem}>
                  <Text style={styles.documentName}>{item.name}</Text>
                  <Text style={styles.documentDate}>{item.date}</Text>
                  {item.lampiran && (
                    <>
                      <Text style={styles.documentLampiran}>📎 {item.lampiran}</Text>
                      <Text
                        style={styles.downloadLink}
                        onPress={() => handleDownload(item.lampiran)}
                      >
                        📥 Download
                      </Text>
                    </>
                  )}
                </View>
              )}
            />
          </>
        )}
      </SafeAreaView>
      <Navbar />
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
  documentLampiran: {
    fontSize: 12,
    color: "#555",
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
  },
  downloadLink: {
    marginTop: 6,
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontFamily: "Poppins_400Regular",
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  filterItem: {
    flex: 1,
    zIndex: 10, // buat jaga-jaga overlapping
    elevation: 2,
  },

  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: '#444',
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    height: 50, // dinaikin dari 40 ke 50
    paddingHorizontal: 10, // buat kasih ruang di kiri-kanan
    color: '#000',
    fontSize: 14, // tambahin biar teks gak kekecilan
    justifyContent: 'center',
  },
});