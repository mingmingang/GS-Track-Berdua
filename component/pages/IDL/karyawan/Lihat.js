import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const formatDateTime = (tanggal, waktu) => {
  if (!tanggal || !waktu) return "-";
  const date = new Date(`${tanggal}T${waktu}`);

  const tanggalPart = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jamPart = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${tanggalPart} - ${jamPart}`;
};

const formatDateTimeRange = (tanggal1, waktu1, tanggal2, waktu2) => {
  if (!tanggal1 || !waktu1 || !tanggal2 || !waktu2) return "-";

  const date1 = new Date(`${tanggal1}T${waktu1}`);
  const date2 = new Date(`${tanggal2}T${waktu2}`);

  const isSameDay =
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  if (isSameDay) {
    const hariTanggal = date1.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const jam1 = date1.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const jam2 = date2.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${hariTanggal} - ${jam1} - ${jam2}`;
  } else {
    const tanggal1Str = date1.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const tanggal2Str = date2.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${tanggal1Str} - ${tanggal2Str}`;
  }
};

const formatTanggal = (dateTimeString) => {
  if (!dateTimeString) return "-";
  const date = new Date(dateTimeString);

  const tanggalPart = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jamPart = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${tanggalPart} - ${jamPart}`;
};

const splitLokasi = (lokasi) => {
  if (!lokasi) return { nama: "-", alamat: "-" };
  const [nama, ...alamatParts] = lokasi.split(" - ");
  return {
    nama: nama?.trim() || "-",
    alamat: alamatParts.join(" - ").trim() || "-",
  };
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    {typeof value === "string" ? (
      <Text style={styles.value}>{value}</Text>
    ) : (
      <View style={styles.value}>{value}</View>
    )}
  </View>
);

export default function DetailIDLScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { idlData } = route.params || {};

  if (!idlData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Data IDL tidak ditemukan.</Text>
      </View>
    );
  }

  const tanggalDinasLuar = formatDateTimeRange(
    idlData.tanggalBerangkat,
    idlData.jamBerangkat,
    idlData.tanggalKembali,
    idlData.jamKembali
  );

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
          style={{ paddingLeft: 20 }}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Detail Izin Dinas Luar</Text>
        <View style={{ width: 24 }} />
      </ImageBackground>

      <ScrollView>
        {/* Status */}
        <View style={styles.statusBox}>
          <View style={styles.statusLeft}>
            <Ionicons
              name="information-circle"
              size={20}
              color="#6B7280"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.statusLabel}>Status IDL</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: idlData.labelColor },
            ]}
          >
            <Text style={styles.statusText}>{idlData.status}</Text>
          </View>
        </View>

        {/* Detail */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detail Izin Dinas Luar</Text>
          <DetailRow label="No. Pengajuan" value={idlData.id} />
          <DetailRow label="NPK Karyawan" value={idlData.npk} />
          <DetailRow label="Nama Karyawan" value={idlData.nama} />
          <DetailRow label="Kegiatan" value={idlData.alasan} />
          <DetailRow
            label="Tanggal Pengajuan"
            value={formatTanggal(idlData.tanggalPengajuan)}
          />
          <DetailRow
            label="Waktu Berangkat"
            value={formatDateTime(
              idlData.tanggalBerangkat,
              idlData.jamBerangkat
            )}
          />
          <DetailRow
            label="Waktu Kembali"
            value={formatDateTime(idlData.tanggalKembali, idlData.jamKembali)}
          />
          <DetailRow label="Tanggal Dinas Luar" value={tanggalDinasLuar} />

          {idlData.berkasLampiran && (
            <DetailRow
              label="File Pendukung"
              value={
                <TouchableOpacity>
                  <Text style={styles.linkText}>Lihat File</Text>
                </TouchableOpacity>
              }
            />
          )}
        </View>

        {/* Lokasi */}
        {idlData.lokasi1 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lokasi 1</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {splitLokasi(idlData.lokasi1).nama}
              </Text>
              <Text style={styles.value}>
                {splitLokasi(idlData.lokasi1).alamat}
              </Text>
            </View>
          </View>
        )}
        {idlData.lokasi2 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lokasi 2</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {splitLokasi(idlData.lokasi2).nama}
              </Text>
              <Text style={styles.value}>
                {splitLokasi(idlData.lokasi2).alamat}
              </Text>
            </View>
          </View>
        )}
        {idlData.lokasi3 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lokasi 3</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {splitLokasi(idlData.lokasi3).nama}
              </Text>
              <Text style={styles.value}>
                {splitLokasi(idlData.lokasi3).alamat}
              </Text>
            </View>
          </View>
        )}

        {/* Keterangan Tambahan */}
        {idlData.keterangan && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Keterangan Tambahan</Text>
            <DetailRow label="Keterangan" value={idlData.keterangan} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
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
  statusBox: {
    backgroundColor: "#E5E7EB",
    margin: 16,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabel: {
    color: "#6B7280",
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "Poppins_700Bold",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins_700Bold",
  },
  detailRow: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: {
    color: "#A0AEC0",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    flex: 1,
  },
  value: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
    flex: 1,
    textAlign: "right",
    alignItems: "flex-end",
  },
  linkText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },
});
