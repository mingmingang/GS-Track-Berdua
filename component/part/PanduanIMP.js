import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const PanduanCuti = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <MaterialIcons name="book" size={20} color="#1E2D56" />
            <Text style={styles.modalTitle}>Panduan Status</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#1E2D56" />
            </TouchableOpacity>
          </View>

          <View style={styles.statusBox}>
            <View style={styles.statusRow}>
              <Text
                style={[styles.statusLabel, { backgroundColor: "#448AFF" }]}
              >
                Menunggu Persetujuan
              </Text>
              <Text style={styles.statusText}>
                Keterangan : Pengajuan IMP yang anda ajukan sedang dalam proses
                persetujuan oleh Atasan.
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text
                style={[styles.statusLabel, { backgroundColor: "#FFBF00" }]}
              >
                Belum Diverifikasi
              </Text>
              <Text style={styles.statusText}>
                Keterangan : Pengajuan IMP yang anda ajukan sedang dalam proses
                verifikasi oleh HC dan telah disetujui oleh Atasan
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text
                style={[styles.statusLabel, { backgroundColor: "#4CAF50" }]}
              >
                Selesai
              </Text>
              <Text style={styles.statusText}>
                Keterangan : Pengajuan IMP yang anda ajukan telah diverifikasi
                oleh HC dan dapat dilaksanakan.
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text
                style={[styles.statusLabel, { backgroundColor: "#F44336" }]}
              >
                Ditolak
              </Text>
              <Text style={styles.statusText}>
                Keterangan : Pengajuan IMP yang anda ajukan ditolak.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PanduanCuti;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E2D56",
    flex: 1,
    marginLeft: 8,
    fontFamily: "Poppins_700Bold",
  },
  statusBox: {
    gap: 12,
  },
  statusRow: {
    marginBottom: 10,
  },
  statusLabel: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 4,
    fontFamily: "Poppins_600SemiBold",
  },
  statusText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins_500Medium",
    textAlign: "justify",
  },
});
