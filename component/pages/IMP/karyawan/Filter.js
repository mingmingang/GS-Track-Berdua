import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PanduanIMP from "../../../part/PanduanIMP";

const FilterIMPScreen = () => {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState("23 Apr 2025");
  const [endDate, setEndDate] = useState("23 Mei 2025");
  const [statusFilters, setStatusFilters] = useState({
    selesai: false,
    belumDiverifikasi: false,
    menungguPersetujuan: false,
    ditolak: false,
    semuaStatus: false,
  });

  const toggleStatusFilter = (status) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const resetFilters = () => {
    setStatusFilters({
      selesai: false,
      belumDiverifikasi: false,
      menungguPersetujuan: false,
      ditolak: false,
      semuaStatus: false,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
        <Text style={styles.headerText}>Filter IMP</Text>
        <View style={{ width: 24 }} />
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color="#4A90E2" />
          <Text style={styles.infoText}>
            IMP yang diperlihatkan dari hari setelah ini dan setelahnya tidak
            akan menampilkan apa-apa.
          </Text>
        </View>

        {/* Periode IMP */}
        <Text style={styles.sectionTitle}>Periode IMP</Text>
        <View style={styles.dateRangeContainer}>
          <View style={styles.dateInputContainer}>
            <TextInput
              style={styles.dateInput}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="DD MMM YYYY"
            />
            <MaterialIcons
              name="date-range"
              size={20}
              color="#999"
              style={styles.dateIcon}
            />
          </View>

          <Text style={styles.dateSeparator}>—</Text>

          <View style={styles.dateInputContainer}>
            <TextInput
              style={styles.dateInput}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="DD MMM YYYY"
            />
            <MaterialIcons
              name="date-range"
              size={20}
              color="#999"
              style={styles.dateIcon}
            />
          </View>
        </View>

        {/* Status IMP */}
        <Text style={styles.sectionTitle}>Status IMP</Text>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleStatusFilter("selesai")}
        >
          <View
            style={[
              styles.checkbox,
              statusFilters.selesai && styles.checkboxChecked,
            ]}
          >
            {statusFilters.selesai && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Selesai</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleStatusFilter("belumDiverifikasi")}
        >
          <View
            style={[
              styles.checkbox,
              statusFilters.belumDiverifikasi && styles.checkboxChecked,
            ]}
          >
            {statusFilters.belumDiverifikasi && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Belum Diverifikasi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleStatusFilter("menungguPersetujuan")}
        >
          <View
            style={[
              styles.checkbox,
              statusFilters.menungguPersetujuan && styles.checkboxChecked,
            ]}
          >
            {statusFilters.menungguPersetujuan && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Menunggu Persetujuan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleStatusFilter("ditolak")}
        >
          <View
            style={[
              styles.checkbox,
              statusFilters.ditolak && styles.checkboxChecked,
            ]}
          >
            {statusFilters.ditolak && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Ditolak</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleStatusFilter("semuaStatus")}
        >
          <View
            style={[
              styles.checkbox,
              statusFilters.semuaStatus && styles.checkboxChecked,
            ]}
          >
            {statusFilters.semuaStatus && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Semua Status</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Action Buttons - Fixed at bottom */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            resetFilters();
          }}
        >
          <Text style={styles.cancelButtonText}>Batal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            // Apply filter logic here
            console.log("Filter applied");
          }}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterIMPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    fontFamily: "Poppins_600SemiBold",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: "#1976D2",
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    marginTop: 8,
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dateInputContainer: {
    flex: 1,
    position: "relative",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    fontSize: 14,
  },
  dateIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  dateSeparator: {
    marginHorizontal: 12,
    fontSize: 16,
    color: "#666",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  actionButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  filterButton: {
    flex: 1,
    backgroundColor: "#1E2D56",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});
