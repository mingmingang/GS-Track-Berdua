import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const FilterTahun = ({ visible, onClose, selectedYear, onSelectYear }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse();

  const scrollRef = useRef();

  useEffect(() => {
    if (visible && scrollRef.current) {
      const index = years.findIndex(
        (y) => y.toString() === selectedYear.toString()
      );
      if (index >= 0) {
        scrollRef.current.scrollTo({
          y: index * 44, // kira-kira tinggi tiap item
          animated: true,
        });
      }
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>Pilih Tahun</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#1E2D56" />
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={scrollRef}
            style={{ maxHeight: 200 }}
            showsVerticalScrollIndicator={false}
          >
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                onPress={() => {
                  onSelectYear(year.toString());
                  onClose();
                }}
                style={styles.item}
              >
                <Text
                  style={[
                    styles.text,
                    selectedYear === year.toString() && styles.selectedText,
                  ]}
                >
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterTahun;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    height: 44,
  },
  text: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  selectedText: {
    color: "#1E2D56",
    fontWeight: "bold",
  },
});
