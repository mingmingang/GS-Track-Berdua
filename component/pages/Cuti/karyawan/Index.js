import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PanduanCuti from "../../../part/PanduanCuti";
import FilterTahun from "../../../part/Filter";
import Header from "../../../backbone/Header";
import { fetchJatahCutiAPI, fetchCutiListAPI } from "../../../backbone/api";
import { formatTanggal, getTanggalRange } from "../../../part/Date";
import styles from "../../../styles/Cuti/CutiStyles";
import i18n from "../../../backbone/i18n";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

const CutiScreen = ({ route }) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [cutiList, setCutiList] = useState([]);
  const userId = route?.params?.user?.npk || "";
  const [selectedJenis, setSelectedJenis] = useState("Cuti Pribadi");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [jatahCuti, setJatahCuti] = useState({
    hakCuti: 0,
    cutiDipakai: 0,
    sisaCuti: 0,
    onProgres: 0,
    masaBerlaku: "",
  });

  const [selectedStatus, setSelectedStatus] = useState("Semua");

  const fetchJatahCuti = async () => {
    try {
      const result = await fetchJatahCutiAPI(
        userId,
        selectedYear,
        selectedJenis,
        cutiList
      );
      setJatahCuti(result);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;

      const fetchData = async () => {
        setIsLoading(true);
        try {
          const data = await fetchCutiListAPI(
            userId,
            selectedJenis,
            selectedStatus
          );
          const dataFilteredByYear = data.filter((cuti) => {
            const tahunAwal = new Date(cuti.tanggalAwal).getFullYear();
            return tahunAwal.toString() === selectedYear;
          });
          setCutiList(dataFilteredByYear);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [userId, selectedJenis, selectedStatus, selectedYear])
  );

  useFocusEffect(
    useCallback(() => {
      if (selectedYear) {
        fetchJatahCuti();
      }
    }, [selectedYear])
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "terlaksana":
        return "#4CAF50";
      case "belum terlaksana":
        return "#FFC107";
      case "menunggu persetujuan":
      case "menunggu":
        return "#2196F3";
      case "dibatalkan":
        return "red";
      case "ditolak":
        return "red";
      default:
        return "#9E9E9E";
    }
  };

  const jenisList = ["Cuti Pribadi", "Cuti Besar", "Cuti Khusus"];
  const statusList = [
    "Semua",
    "Terlaksana",
    "Belum Terlaksana",
    "Menunggu Persetujuan",
    "Dibatalkan",
    "Ditolak",
  ];

  return (
    <View style={styles.container}>
      <Header title={i18n.t("cuti_menu_title")} />

      <View style={{ paddingHorizontal: 16, marginVertical: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabBar}>
            {jenisList.map((jenis) => (
              <TouchableOpacity
                key={jenis}
                onPress={() => setSelectedJenis(jenis)}
              >
                <Text
                  style={[
                    styles.tabItem,
                    selectedJenis === jenis && styles.tabItemActive,
                  ]}
                >
                  {i18n.t(
                    `cuti_jenis_${jenis.replace(/ /g, "_").toLowerCase()}`
                  )}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dateRangeBox}>
          <Text style={styles.dateRangeText}>
            {getTanggalRange(selectedYear)}
          </Text>

          <View style={styles.iconsRight}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <MaterialIcons name="book" size={20} color="#1E2D56" />
            </TouchableOpacity>

            <PanduanCuti
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
            />
            <View
              style={{
                width: 1,
                height: 20,
                backgroundColor: "#ddd",
                marginHorizontal: 8,
              }}
            />
            <TouchableOpacity onPress={() => setYearModalVisible(true)}>
              <MaterialIcons name="filter-list" size={20} color="#1E2D56" />
            </TouchableOpacity>
          </View>
        </View>

        <FilterTahun
          visible={yearModalVisible}
          onClose={() => setYearModalVisible(false)}
          selectedYear={selectedYear}
          onSelectYear={(year) => {
            setSelectedYear(year);
          }}
        />

        <View style={styles.summaryBox}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>
              {i18n.t("cuti_summary_jenis")}
            </Text>
            <Text style={styles.summaryTitle}>
              {i18n.t("cuti_summary_jumlah")}
            </Text>
          </View>
          {[
            { label: i18n.t("cuti_summary_hak"), jumlah: jatahCuti.hakCuti },
            {
              label: i18n.t("cuti_summary_pemakaian"),
              jumlah: jatahCuti.cutiDipakai,
            },
            {
              label: i18n.t("cuti_summary_onprogress"),
              jumlah: jatahCuti.onProgres,
            },
            { label: i18n.t("cuti_summary_sisa"), jumlah: jatahCuti.sisaCuti },
          ].map((item, idx, arr) => (
            <View
              style={[
                styles.summaryRow,
                idx === arr.length - 1 && styles.lastRow,
              ]}
              key={idx}
            >
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <View style={styles.valueCell}>
                <Text style={styles.summaryValue}>{item.jumlah}</Text>
              </View>
            </View>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <MaterialIcons name="date-range" size={20} color="#1E2D56" />
            <Text style={{ marginLeft: 6 }}>
              {i18n.t("cuti_masa_berlaku")}:{" "}
               <Text style={{ color: "red", fontWeight: "bold" }}>
                {jatahCuti?.masaBerlaku ? formatTanggal(jatahCuti.masaBerlaku) : "-"}
              </Text>
            </Text>
          </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterBar}>
            {statusList.map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  style={[
                    styles.filterItem,
                    selectedStatus === status && styles.filterItemActive,
                  ]}
                >
                  {i18n.t(
                    `cuti_status_${status.replace(/ /g, "_").toLowerCase()}`
                  )}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {cutiList.length === 0 && (
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              fontStyle: "italic",
              color: "#999",
            }}
          >
            {i18n.t("cuti_no_data")}
          </Text>
        )}

        {cutiList.map((item) => (
          <View key={item.cutiId} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.cutiId}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {i18n.t(
                      `cuti_status.${item.status
                        .toLowerCase()
                        .replace(/ /g, "_")}`
                    )}
                  </Text>
                </View>
                {item.status !== "Terlaksana" &&
                  item.status !== "Dibatalkan" && 
                  item.status !== "Ditolak" && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PembatalanCuti", {
                          cutiId: item.cutiId,
                        })
                      }
                      style={{
                        backgroundColor: "red",
                        borderRadius: 20,
                        padding: 6,
                        marginLeft: 4,
                      }}
                    >
                      <MaterialIcons name="cancel" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
              </View>
            </View>
            <Text style={styles.cardSub}>
              {i18n.t(`cuti_subtype.${item.subTipeCuti?.split(" ")[0]}`, {
                defaultValue: item.subTipeCuti,
              })}
            </Text>

            <View style={styles.cardRow}>
              <MaterialIcons name="access-time" size={16} color="#333" />
              <Text style={styles.cardDate}>
                {formatTanggal(item.tanggalAwal)} s/d{" "}
                {formatTanggal(item.tanggalAkhir)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() =>
                navigation.navigate("LihatCuti", { cutiId: item.cutiId })
              }
            >
              <Text style={styles.viewText}>{i18n.t("cuti_lihat")} →</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TambahCuti")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CutiScreen;
