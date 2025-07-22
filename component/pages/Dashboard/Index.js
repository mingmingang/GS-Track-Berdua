import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../backbone/Header";
import BASE_URL from "../../backbone/Constant";
import { BarChart } from "react-native-chart-kit";
import haversine from "haversine-distance";

const departemenList = ["All", "HR", "Finance", "Marketing", "Production", "Engineering", "Procurement"];
const statusLabel = ["Alpa", "Hadir", "Cuti", "IMP", "IDL"];
const screenWidth = Dimensions.get("window").width;

const DashboardScreen = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedDept, setSelectedDept] = useState("All");
  const [summary, setSummary] = useState([0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState({ totalJam: 0, rataJam: 0, telat: 0, rataJarak: 0 });

  const handleFetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}kehadiran/get`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: startDate ?? null, endDate: endDate ?? null }),
      });

      const result = await response.json();
      if (result.result !== 200) {
        alert("Gagal ambil data");
        return;
      }

      const filtered = result.data.filter((item) => {
        if (!item.karyawan) return false;
        return selectedDept === "All" || item.karyawan.departemen === selectedDept;
      });

      const count = [0, 0, 0, 0, 0];
      let totalJam = 0;
      let telat = 0;
      let totalJarak = 0;

      filtered.forEach((item) => {
        const status = Number(item.indikatorKehadiran);
        if (status >= 0 && status <= 4) count[status]++;

        if (item.masukAbsen && item.keluarAbsen) {
          const jam = (new Date(item.keluarAbsen) - new Date(item.masukAbsen)) / 3600000;
          totalJam += jam;

          if (new Date(item.masukAbsen).getHours() > 8) telat++;

          if (item.latitudeMasuk && item.longitudeMasuk && item.latitudeKeluar && item.longitudeKeluar) {
            totalJarak += haversine(
              { lat: item.latitudeMasuk, lng: item.longitudeMasuk },
              { lat: item.latitudeKeluar, lng: item.longitudeKeluar }
            ) / 1000;
          }
        }
      });

      setSummary(count);
      setInsight({
        totalJam: totalJam.toFixed(1),
        rataJam: (totalJam / filtered.length || 0).toFixed(1),
        telat,
        rataJarak: (totalJarak / filtered.length || 0).toFixed(1),
      });
    } catch (error) {
      console.error("🔥 Error fetching data:", error);
      alert("Terjadi error pas ambil data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="📊 Dashboard Kehadiran" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🎯 Filter Data</Text>
          <View style={styles.rowBetween}>
            <TouchableOpacity style={styles.inputBox} onPress={() => setShowStartPicker(true)}>
              <Text style={styles.inputText}>{startDate ? startDate.toLocaleDateString() : "Tanggal Mulai"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputBox} onPress={() => setShowEndPicker(true)}>
              <Text style={styles.inputText}>{endDate ? endDate.toLocaleDateString() : "Tanggal Akhir"}</Text>
            </TouchableOpacity>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, selected) => {
                setShowStartPicker(false);
                if (selected) setStartDate(selected);
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, selected) => {
                setShowEndPicker(false);
                if (selected) setEndDate(selected);
              }}
            />
          )}

          <Text style={styles.label}>Departemen:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.departemenContainer}>
              {departemenList.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.deptButton, selectedDept === d && styles.selectedDept]}
                  onPress={() => {
                    setSelectedDept(d);
                    handleFetchData();
                  }}
                >
                  <Text style={[styles.deptText, selectedDept === d && styles.selectedDeptText]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.fetchButton} onPress={handleFetchData}>
            <Text style={styles.fetchText}>🔍 Lihat Laporan</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2196f3" />
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>📌 Ringkasan</Text>
              <Text>Total Jam Kerja: {insight.totalJam} jam</Text>
              <Text>Rata-rata Jam Kerja: {insight.rataJam} jam</Text>
              <Text>Karyawan Telat: {insight.telat}</Text>
              <Text>Rata-rata Jarak: {insight.rataJarak} km</Text>
            </View>

            <View style={{ borderRadius: 16, overflow: "hidden" }}>
              <BarChart
                data={{ labels: statusLabel, datasets: [{ data: summary }] }}
                width={screenWidth - 40}
                height={220}
                fromZero
                yAxisLabel=""
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForBackgroundLines: {
                    stroke: "#ccc",
                  },
                }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f2f4f7",
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  inputBox: {
    backgroundColor: "#f0f4f8",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d0d7de",
    flex: 1,
  },
  inputText: {
    fontSize: 14,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  departemenContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8,
    marginBottom: 10,
  },
  deptButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedDept: {
    backgroundColor: "#2196f3",
  },
  deptText: {
    fontSize: 14,
    color: "#333",
  },
  selectedDeptText: {
    color: "#fff",
    fontWeight: "bold",
  },
  fetchButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  fetchText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default DashboardScreen;
