import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../../../backbone/AuthContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const TambahCutiScreen = () => {
  const navigation = useNavigation();

  const [open, setOpen] = useState(false);
  const [tipeCuti, setTipeCuti] = useState(null);
  const [items, setItems] = useState([
    { label: "Cuti Pribadi", value: "Cuti Pribadi" },
    { label: "Cuti Besar", value: "Cuti Besar" },
    { label: "Cuti Khusus", value: "Cuti Khusus" },
  ]);

  const [openKhusus, setOpenKhusus] = useState(false);
  const [tipeCutiKhusus, setTipeCutiKhusus] = useState(null);
  const [itemsKhusus, setItemsKhusus] = useState([
    {
      label: "Cuti Dispensasi Bencana Alam dan Tugas Negara",
      value: "Cuti Dispensasi Bencana Alam dan Tugas Negara",
    },
    {
      label: "Cuti Dispensasi Sakit Mata dan Cacar",
      value: "Cuti Dispensasi Sakit Mata dan Cacar",
    },
    {
      label: "Cuti Dispensasi Tetangga Meninggal",
      value: "Cuti Dispensasi Tetangga Meninggal",
    },
    { label: "Cuti Haid", value: "Cuti Haid" },
    {
      label: "Cuti Istri Melahirkan/Keguguran",
      value: "Cuti Istri Melahirkan/Keguguran",
    },
    { label: "Cuti Karyawan Menikah", value: "Cuti Karyawan Menikah" },
    {
      label: "Cuti Karyawati Melahirkan/Keguguran",
      value: "Cuti Karyawati Melahirkan/Keguguran",
    },
    {
      label: "Cuti Kematian Istri/Suami/Anak",
      value: "Cuti Kematian Istri/Suami/Anak",
    },
    {
      label: "Cuti Kematian Istri/Suami/Anak > 200km",
      value: "Cuti Kematian Istri/Suami/Anak > 200km",
    },
    {
      label: "Cuti Kematian Kakek/Nenek/Cucu (karyawan)",
      value: "Cuti Kematian Kakek/Nenek/Cucu (karyawan)",
    },
    {
      label: "Cuti Kematian Kakek/Nenek/Cucu (karyawan) > 200km",
      value: "Cuti Kematian Kakek/Nenek/Cucu (karyawan) > 200km",
    },
    {
      label: "Cuti Kematian Org tua/Mrtua/SdrKdg/OrgSermh",
      value: "Cuti Kematian Org tua/Mrtua/SdrKdg/OrgSermh",
    },
    {
      label: "Cuti Kematian Org tua/Mrtua/SdrKdg/OrgSermh > 200km",
      value: "Cuti Kematian Org tua/Mrtua/SdrKdg/OrgSermh > 200km",
    },
    { label: "Cuti Khitan / Baptis", value: "Cuti Khitan / Baptis" },
    {
      label: "Cuti Khusus Haji dan Kerohanian",
      value: "Cuti Khusus Haji dan Kerohanian",
    },
    { label: "Cuti Khusus Umroh", value: "Cuti Khusus Umroh" },
    { label: "Cuti Menikahkan Anak", value: "Cuti Menikahkan Anak" },
    {
      label: "Cuti Opname Bapak/Ibu/Mertua/Saudara Kandung",
      value: "Cuti Opname Bapak/Ibu/Mertua/Saudara Kandung",
    },
    {
      label: "Cuti Opname Istri/Suami/Anak",
      value: "Cuti Opname Istri/Suami/Anak",
    },
    {
      label: "Cuti Opname Kakek/Nenek/Orang Serumah",
      value: "Cuti Opname Kakek/Nenek/Orang Serumah",
    },
    { label: "Cuti Opname Karyawan", value: "Cuti Opname Karyawan" },
    { label: "Cuti Tugas Negara", value: "Cuti Tugas Negara" },
  ]);

  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  const [endDate, setEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  const [fileName, setFileName] = useState(null);
  const [fileData, setFileData] = useState(null);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf", "application/zip"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        setFileName(pickedFile.name);
        setFileUri(pickedFile.uri);
      }
    } catch (error) {
      console.log("Error picking file:", error);
    }
  };

  const { user } = useContext(AuthContext);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../../assets/bg_navbar.png")}
        style={styles.header}
        resizeMode="cover"
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Tambah Cuti</Text>
        <View style={{ width: 24 }} />
      </ImageBackground>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>No. Pengajuan Cuti</Text>
        <TextInput
          style={styles.inputClose}
          editable={false}
          value="LVR202503012458"
        />

        <Text style={styles.label}>
          Permohonan Untuk <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          style={styles.inputClose}
          value={user.nama}
          editable={false}
        />

        <Text style={styles.label}>
          Tipe Cuti <Text style={{ color: "red" }}>*</Text>
        </Text>
        <DropDownPicker
          open={open}
          value={tipeCuti}
          items={items}
          setOpen={setOpen}
          setValue={setTipeCuti}
          setItems={setItems}
          placeholder="Pilih Jenis Cuti"
          placeholderStyle={{
            color: "#888",
            fontFamily: "Poppins_400Regular",
          }}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            minHeight: 45,
            backgroundColor: "#fff",
            marginBottom: open ? items.length * 55 : 5,
            paddingHorizontal: 12,
          }}
          textStyle={{
            fontFamily: "Poppins_400Regular",
            fontSize: 14,
            color: "#1E2D56",
          }}
          dropDownContainerStyle={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            backgroundColor: "#fff",
            marginTop: 2,
          }}
          listItemContainerStyle={{
            height: 50,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
          }}
          listItemLabelStyle={{
            fontFamily: "Poppins_400Regular",
            color: "#1E2D56",
          }}
          selectedItemContainerStyle={{
            backgroundColor: "#E5F0FF",
          }}
          selectedItemLabelStyle={{
            fontFamily: "Poppins_700Bold",
            color: "#1E2D56",
          }}
          arrowIconStyle={{
            width: 20,
            height: 20,
          }}
          tickIconStyle={{
            width: 20,
            height: 20,
          }}
          showArrowIcon={true}
          showTickIcon={true}
          modalProps={{
            animationType: "fade",
          }}
          modalTitle="Pilih Jenis Cuti"
          modalTitleStyle={{
            fontFamily: "Poppins_700Bold",
            color: "#1E2D56",
          }}
        />

        {tipeCuti === "Cuti Khusus" && (
          <>
            <Text style={{ marginTop: 10, marginBottom: 8 }}>
              Cuti Khusus<Text style={{ color: "red" }}> *</Text>
            </Text>
            <DropDownPicker
              open={openKhusus}
              value={tipeCutiKhusus}
              items={itemsKhusus}
              setOpen={setOpenKhusus}
              setValue={setTipeCutiKhusus}
              setItems={setItemsKhusus}
              placeholder="Pilih Jenis Cuti Khusus"
              placeholderStyle={{
                color: "#888",
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
              }}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                minHeight: 45,
                backgroundColor: "#fff",
                marginBottom: openKhusus
                  ? Math.min(itemsKhusus.length * 50, 300)
                  : 12,
                paddingHorizontal: 12,
                zIndex: 1000,
              }}
              textStyle={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: "#1E2D56",
              }}
              dropDownContainerStyle={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                backgroundColor: "#fff",
                marginTop: 2,
                maxHeight: 300,
                elevation: 5,
              }}
              listItemContainerStyle={{
                height: 50,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
              listItemLabelStyle={{
                fontFamily: "Poppins_400Regular",
                color: "#1E2D56",
                fontSize: 13,
              }}
              selectedItemContainerStyle={{
                backgroundColor: "#E5F0FF",
              }}
              selectedItemLabelStyle={{
                fontFamily: "Poppins_700Bold",
              }}
              scrollViewProps={{
                showsVerticalScrollIndicator: true,
                persistentScrollbar: true,
              }}
              searchable={true}
              searchPlaceholder="Cari jenis cuti..."
              searchTextInputStyle={{
                fontFamily: "Poppins_400Regular",
                borderColor: "#ddd",
              }}
              searchContainerStyle={{
                borderBottomColor: "#ddd",
                padding: 10,
              }}
              mode="BADGE"
              badgeDotColors={["#1E2D56"]}
              disabledItemLabelStyle={{
                color: "#ccc",
              }}
              extendableBadgeContainer={true}
              activityIndicatorColor="#1E2D56"
              itemSeparator={true}
              itemSeparatorStyle={{
                backgroundColor: "#eee",
              }}
            />
          </>
        )}

        <View style={{ marginBottom: "10", marginTop: "10" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>
                Mulai Dari <Text style={{ color: "red" }}>*</Text>
              </Text>
                <View>
    <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
      <View
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  height: 35
                }}
              >
      <Text style={{paddingTop:8, paddingLeft:5}}>{selectedDate.toDateString()}</Text>
      </View>
    </TouchableOpacity>

    <DateTimePickerModal
       isVisible={isDatePickerVisible}
  mode="date"
  onConfirm={handleConfirm}
  onCancel={hideDatePicker}
  display="inline" // Lebih stabil daripada "inline"
  locale="id-ID"
  themeVariant="light"
    />
  </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>
                Sampai Dengan <Text style={{ color: "red" }}>*</Text>
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  overflow: "hidden",
                }}
              >
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
                  style={{
                    backgroundColor: "transparent",
                    height: 50,
                  }}
                  themeVariant="light"
                />
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Durasi</Text>
        <TextInput
          style={styles.input}
          placeholder="3"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Keterangan</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          placeholder="Masukan Keterangan ..."
        />

        <>
          <Text style={{ marginTop: 0, fontWeight: "bold" }}>
            Berkas Lampiran{" "}
            {tipeCuti === "Cuti Khusus" && (
              <Text style={{ color: "red" }}>*</Text>
            )}
          </Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 12,
              borderRadius: 6,
              marginTop: 8,
              backgroundColor: "#F8F9FA",
            }}
            onPress={handlePickFile}
          >
            <Text style={{ color: "#888" }}>
              {fileName ? fileName : "Browse..."}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            * jpg, pdf, zip (Max 2mb)
          </Text>

          <View
            style={{
              backgroundColor: "#E5F0FF",
              padding: 10,
              marginTop: 12,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Note:</Text>
            <Text style={{ fontSize: 12 }}>
              {tipeCuti === "Cuti Khusus"
                ? "Cuti Khusus wajib melampirkan berkas (max 2mb)"
                : "Lampiran bersifat opsional untuk tipe cuti ini."}
            </Text>
          </View>
        </>
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
          ]}
        >
          <Ionicons
            name="print"
            size={15}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Print</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FFC107" }]}
        >
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
        >
          <Text style={styles.buttonText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TambahCutiScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#1E2D56",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingHorizontal: 16,
    height: 100,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  form: { padding: 16 },
  label: {
    marginBottom: 4,
    fontFamily: "Poppins_700Bold",
    color: "#1E2D56",
  },
  inputClose: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#F8F9FA",
    fontFamily: "Poppins_400Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontFamily: "Poppins_400Regular",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
});
