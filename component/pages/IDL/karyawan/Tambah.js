import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ImageBackground,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";

const TambahIDLScreen = () => {
  const navigation = useNavigation();

  // Kegiatan dropdown state
  const [openKegiatan, setOpenKegiatan] = useState(false);
  const [jenisKegiatan, setJenisKegiatan] = useState(null);
  const [itemsKegiatan, setItemsKegiatan] = useState([
    { label: "Rapat", value: "Rapat" },
    { label: "Training", value: "Training" },
    { label: "Seminar", value: "Seminar" },
    { label: "Workshop", value: "Workshop" },
    { label: "Kunjungan", value: "Kunjungan" },
  ]);

  // Date and time states
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);
  const [departureTime, setDepartureTime] = useState(new Date());
  const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);

  const [returnDate, setReturnDate] = useState(new Date());
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const [returnTime, setReturnTime] = useState(new Date());
  const [showReturnTimePicker, setShowReturnTimePicker] = useState(false);

  // Temporary states for picker values (for iOS modal)
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());
  const [currentPickerType, setCurrentPickerType] = useState(null);

  // Multiple locations state
  const [locations, setLocations] = useState([""]);

  // Description state
  const [description, setDescription] = useState("");

  // File upload state
  const [fileName, setFileName] = useState(null);
  const [fileUri, setFileUri] = useState(null);

  // Add new location
  const addLocation = () => {
    if (locations.length < 3) {
      setLocations([...locations, ""]);
    }
  };

  // Remove location
  const removeLocation = (index) => {
    if (locations.length > 1) {
      const newLocations = locations.filter((_, i) => i !== index);
      setLocations(newLocations);
    }
  };

  // Update location value
  const updateLocation = (index, value) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  // Generic date/time picker handlers
  const handleDateTimePickerOpen = (type, currentValue) => {
    if (Platform.OS === "ios") {
      setCurrentPickerType(type);
      if (type.includes("date")) {
        setTempDate(currentValue);
      } else {
        setTempTime(currentValue);
      }
    }

    switch (type) {
      case "departureDate":
        setShowDepartureDatePicker(true);
        break;
      case "departureTime":
        setShowDepartureTimePicker(true);
        break;
      case "returnDate":
        setShowReturnDatePicker(true);
        break;
      case "returnTime":
        setShowReturnTimePicker(true);
        break;
    }
  };

  const handleDateTimePickerConfirm = () => {
    switch (currentPickerType) {
      case "departureDate":
        setDepartureDate(tempDate);
        break;
      case "departureTime":
        setDepartureTime(tempTime);
        break;
      case "returnDate":
        setReturnDate(tempDate);
        break;
      case "returnTime":
        setReturnTime(tempTime);
        break;
    }
    handleDateTimePickerCancel();
  };

  const handleDateTimePickerCancel = () => {
    setShowDepartureDatePicker(false);
    setShowDepartureTimePicker(false);
    setShowReturnDatePicker(false);
    setShowReturnTimePicker(false);
    setCurrentPickerType(null);
  };

  // Date change handlers
  const onDateTimeChange = (event, selectedValue) => {
    if (Platform.OS === "android") {
      // Android - directly update the state
      handleDateTimePickerCancel();
      if (selectedValue) {
        switch (currentPickerType || getCurrentPickerType()) {
          case "departureDate":
            setDepartureDate(selectedValue);
            break;
          case "departureTime":
            setDepartureTime(selectedValue);
            break;
          case "returnDate":
            setReturnDate(selectedValue);
            break;
          case "returnTime":
            setReturnTime(selectedValue);
            break;
        }
      }
    } else {
      // iOS - update temp value
      if (selectedValue) {
        if (currentPickerType && currentPickerType.includes("date")) {
          setTempDate(selectedValue);
        } else {
          setTempTime(selectedValue);
        }
      }
    }
  };

  const getCurrentPickerType = () => {
    if (showDepartureDatePicker) return "departureDate";
    if (showDepartureTimePicker) return "departureTime";
    if (showReturnDatePicker) return "returnDate";
    if (showReturnTimePicker) return "returnTime";
    return null;
  };

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

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Custom DateTimePicker Component
  const CustomDateTimePicker = ({
    show,
    mode,
    value,
    onChange,
    onConfirm,
    onCancel,
  }) => {
    if (Platform.OS === "android") {
      return show ? (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={onChange}
        />
      ) : null;
    }

    // iOS Modal
    return (
      <Modal visible={show} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onCancel}>
                <Text style={styles.modalButton}>Batal</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {mode === "date" ? "Pilih Tanggal" : "Pilih Waktu"}
              </Text>
              <TouchableOpacity onPress={onConfirm}>
                <Text style={[styles.modalButton, styles.confirmButton]}>
                  Selesai
                </Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={value}
              mode={mode}
              display="spinner"
              onChange={onChange}
              style={styles.picker}
            />
          </View>
        </View>
      </Modal>
    );
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
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Pengajuan Dinas Luar</Text>
        <View style={{ width: 24 }} />
      </ImageBackground>

      {/* Form */}
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Kegiatan */}
        <Text style={styles.label}>
          Kegiatan <Text style={{ color: "red" }}>*</Text>
        </Text>
        <DropDownPicker
          open={openKegiatan}
          value={jenisKegiatan}
          items={itemsKegiatan}
          setOpen={setOpenKegiatan}
          setValue={setJenisKegiatan}
          setItems={setItemsKegiatan}
          placeholder="Pilih Jenis Kegiatan"
          placeholderStyle={{
            color: "#888",
            fontFamily: "Poppins_400Regular",
          }}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
          listItemContainerStyle={styles.listItem}
          listItemLabelStyle={styles.listItemLabel}
          selectedItemContainerStyle={styles.selectedItem}
          selectedItemLabelStyle={styles.selectedItemLabel}
        />

        {/* Waktu Berangkat */}
        <Text style={styles.label}>
          Waktu Berangkat <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity
            style={[styles.dateTimeInput, { flex: 1, marginRight: 8 }]}
            onPress={() =>
              handleDateTimePickerOpen("departureDate", departureDate)
            }
          >
            <Text style={styles.dateTimeText}>{formatDate(departureDate)}</Text>
            <Ionicons name="calendar" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dateTimeInput, { flex: 1, marginLeft: 8 }]}
            onPress={() =>
              handleDateTimePickerOpen("departureTime", departureTime)
            }
          >
            <Text style={styles.dateTimeText}>{formatTime(departureTime)}</Text>
            <Ionicons name="time" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Waktu Kembali */}
        <Text style={styles.label}>
          Waktu Kembali <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity
            style={[styles.dateTimeInput, { flex: 1, marginRight: 8 }]}
            onPress={() => handleDateTimePickerOpen("returnDate", returnDate)}
          >
            <Text style={styles.dateTimeText}>{formatDate(returnDate)}</Text>
            <Ionicons name="calendar" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dateTimeInput, { flex: 1, marginLeft: 8 }]}
            onPress={() => handleDateTimePickerOpen("returnTime", returnTime)}
          >
            <Text style={styles.dateTimeText}>{formatTime(returnTime)}</Text>
            <Ionicons name="time" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Lokasi - Multiple locations */}
        <Text style={styles.label}>
          Lokasi <Text style={{ color: "red" }}>*</Text>
        </Text>
        {locations.map((location, index) => (
          <View key={index} style={styles.locationContainer}>
            <View style={styles.locationInputContainer}>
              <Ionicons
                name="location"
                size={20}
                color="#666"
                style={styles.locationIcon}
              />
              <TextInput
                style={styles.locationInput}
                placeholder={`Lokasi ${index + 1}`}
                value={location}
                onChangeText={(text) => updateLocation(index, text)}
              />
              {locations.length > 1 && (
                <TouchableOpacity
                  style={styles.removeLocationButton}
                  onPress={() => removeLocation(index)}
                >
                  <Ionicons name="close" size={20} color="#FF5252" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {locations.length < 3 && (
          <TouchableOpacity
            style={styles.addLocationButton}
            onPress={addLocation}
          >
            <Text style={styles.addLocationText}>+ Tambah Lokasi</Text>
          </TouchableOpacity>
        )}

        {/* Keterangan */}
        <Text style={styles.label}>
          Keterangan <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Masukan Keterangan ..."
          value={description}
          onChangeText={setDescription}
        />

        {/* Berkas Lampiran */}
        <Text style={styles.label}>
          Berkas Lampiran <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.fileUploadButton}
          onPress={handlePickFile}
        >
          <Text style={styles.fileUploadText}>
            {fileName ? fileName : "Browse..."}
          </Text>
        </TouchableOpacity>
        <Text style={styles.fileNote}>* jpg, pdf, zip (Max 2mb)</Text>

        {/* Note */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>
            Pengisian IDL dilakukan paling lambat H-1
          </Text>
        </View>

        {/* Bottom Buttons - Now inside ScrollView */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.printButton]}>
            <Ionicons
              name="print"
              size={15}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Print</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveButton]}>
            <Text style={styles.buttonText}>Simpan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.sendButton]}>
            <Text style={styles.buttonText}>Kirim</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Custom Date/Time Pickers */}
      <CustomDateTimePicker
        show={showDepartureDatePicker}
        mode="date"
        value={Platform.OS === "ios" ? tempDate : departureDate}
        onChange={onDateTimeChange}
        onConfirm={handleDateTimePickerConfirm}
        onCancel={handleDateTimePickerCancel}
      />

      <CustomDateTimePicker
        show={showDepartureTimePicker}
        mode="time"
        value={Platform.OS === "ios" ? tempTime : departureTime}
        onChange={onDateTimeChange}
        onConfirm={handleDateTimePickerConfirm}
        onCancel={handleDateTimePickerCancel}
      />

      <CustomDateTimePicker
        show={showReturnDatePicker}
        mode="date"
        value={Platform.OS === "ios" ? tempDate : returnDate}
        onChange={onDateTimeChange}
        onConfirm={handleDateTimePickerConfirm}
        onCancel={handleDateTimePickerCancel}
      />

      <CustomDateTimePicker
        show={showReturnTimePicker}
        mode="time"
        value={Platform.OS === "ios" ? tempTime : returnTime}
        onChange={onDateTimeChange}
        onConfirm={handleDateTimePickerConfirm}
        onCancel={handleDateTimePickerCancel}
      />
    </View>
  );
};

export default TambahIDLScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
  form: {
    padding: 16,
    paddingBottom: 30,
  },
  label: {
    marginBottom: 8,
    marginTop: 16,
    fontFamily: "Poppins_700Bold",
    color: "#333",
    fontSize: 14,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    minHeight: 50,
    backgroundColor: "#fff",
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#333",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginTop: 2,
  },
  listItem: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  listItemLabel: {
    fontFamily: "Poppins_400Regular",
    color: "#333",
  },
  selectedItem: {
    backgroundColor: "#E3F2FD",
  },
  selectedItemLabel: {
    fontFamily: "Poppins_600SemiBold",
    color: "#1976D2",
  },
  dateTimeRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dateTimeInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 50,
  },
  dateTimeText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#333",
  },
  locationContainer: {
    marginBottom: 8,
  },
  locationInputContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  locationIcon: {
    marginRight: 12,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#333",
  },
  removeLocationButton: {
    marginLeft: 8,
    padding: 4,
  },
  addLocationButton: {
    marginBottom: 8,
  },
  addLocationText: {
    color: "#2196F3",
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 120,
    textAlignVertical: "top",
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  fileUploadButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 4,
  },
  fileUploadText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#888",
  },
  fileNote: {
    color: "red",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginBottom: 16,
  },
  noteContainer: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  noteTitle: {
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 4,
  },
  noteText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  printButton: {
    backgroundColor: "#2196F3",
  },
  saveButton: {
    backgroundColor: "#FFC107",
  },
  sendButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  // Modal styles for iOS
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  modalButton: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#666",
  },
  confirmButton: {
    color: "#2196F3",
  },
  picker: {
    backgroundColor: "#fff",
  },
});
