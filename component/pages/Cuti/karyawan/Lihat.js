import React, { useContext } from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { AuthContext } from "../../../backbone/AuthContext";
import { ActivityIndicator, Image } from "react-native";
import Header from "../../../backbone/Header";
import { WebView } from "react-native-webview";
import styles from "../../../styles/Cuti/DetailCutiStyle";
import { formatTanggal } from "../../../part/Date";
import { fetchDetailCuti, fetchTanggalCuti } from "../../../backbone/api";
import i18n from "../../../backbone/i18n";

export default function DetailCutiScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { cutiId } = route.params || {};
  const { user } = useContext(AuthContext);

  const [cuti, setCuti] = useState(null);

  const [tanggalCutiList, setTanggalCutiList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detail = await fetchDetailCuti(cutiId);
        const tanggalList = await fetchTanggalCuti(cutiId);

        setCuti(detail);
        setTanggalCutiList(tanggalList);
      } catch (err) {
        setCuti(null);
        setTanggalCutiList([]);
      }
    };

    if (cutiId) fetchData();
  }, [cutiId]);

  if (!cuti) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E2D56" />
        <Text style={{ marginTop: 10 }}>{i18n.t("loading.detailCuti")}</Text>
      </View>
    );
  }

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

  return (
    <>
      <Header title={i18n.t("cuti_detail.title")} />
      <ScrollView style={styles.container}>
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>{i18n.t("cuti_detail.status")}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(cuti.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {i18n.t(
                `cuti_status.${cuti.status?.toLowerCase().replace(/ /g, "_")}`,
                {
                  defaultValue: cuti.status,
                }
              )}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {i18n.t("cuti_detail.section_detail")}
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>
              {i18n.t("cuti_detail.no_pengajuan")}
            </Text>
            <Text style={styles.value}>{cuti.cutiId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>{i18n.t("cuti_detail.plant")}</Text>
            <Text style={styles.value}>{user.plant || "-"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>
              {i18n.t("cuti_detail.pengajuan_oleh")}
            </Text>
            <Text style={styles.value}>{user.namaKaryawan || "-"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>{i18n.t("cuti_detail.tipe")}</Text>
            <Text style={styles.value}>{cuti.tipeCuti}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>
              {i18n.t("cuti_detail.tanggal_pengajuan")}
            </Text>
            <Text style={styles.value}>
              {formatTanggal(cuti.tanggalPengajuan)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>
              {i18n.t("cuti_detail.tanggal_cuti")}
            </Text>
            <Text style={styles.value}>
              {formatTanggal(cuti.tanggalAwal)} -{" "}
              {formatTanggal(cuti.tanggalAkhir)}
            </Text>
          </View>
        </View>

     <View style={styles.card}>
  <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12 }}>
    Daftar Tanggal Cuti
  </Text>

  {tanggalCutiList.length > 0 ? (
    tanggalCutiList.map((item, index) => (
      <View
        key={index}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
          backgroundColor: "#F8F9FA",
          marginBottom: 8,
          borderWidth: 1,
          borderColor: "#E0E0E0",
        }}
      >
        <Text style={{ fontSize: 14, color: "#333" }}>
          {formatTanggal(item.tanggalCuti)}
        </Text>

        <View
          style={{
            backgroundColor: getStatusColor(item.status),
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 12, color: "#fff", fontWeight: "bold" }}>
            {i18n.t(
              `cuti_status.${item.status.toLowerCase().replace(/ /g, "_")}`,
              { defaultValue: item.status }
            )}
          </Text>
        </View>
      </View>
    ))
  ) : (
    <Text style={{ fontSize: 14, color: "#777" }}>
      Tidak ada tanggal cuti terdaftar.
    </Text>
  )}
</View>


        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {i18n.t("cuti_detail.keterangan")}
          </Text>

          <View style={styles.detailKeternagan}>
            <Text style={styles.value}>{cuti.alasan || "-"}</Text>
          </View>
        </View>

        {cuti.lampiran && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{i18n.t("cuti_detail.berkas")}</Text>

            <View style={styles.detailKeternagan}>
              <Text style={styles.label}>
                {i18n.t("cuti_detail.nama_file")}
              </Text>
              <Text style={styles.value}>{cuti.lampiran}</Text>

              {(() => {
                const isImage = /\.(jpg|jpeg|png)$/i.test(cuti.lampiran);
                if (isImage) {
                  return (
                    <Image
                      source={{ uri: cuti.fileUri }}
                      style={{
                        width: "100%",
                        height: 200,
                        marginTop: 8,
                        borderRadius: 8,
                      }}
                      resizeMode="contain"
                    />
                  );
                } else {
                  return (
                    <View style={{ flex: 1, height: 400 }}>
                      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        {i18n.t("cuti_detail.berkas_pdf")}
                      </Text>

                      <WebView
                        source={{ uri: cuti.fileUri }}
                        style={{ flex: 1, marginTop: 10 }}
                      />
                    </View>
                  );
                }
              })()}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}
