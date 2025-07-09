import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../../backbone/AuthContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getServerIP } from "../../../backbone/ApiConfig";
import Dropdown from "../../../part/Dropdown";
import Header from "../../../backbone/Header";
import Toast from "react-native-toast-message";

const TambahCutiScreen = () => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [tipeCuti, setTipeCuti] = useState(null);
  const [generatedCutiId, setGeneratedCutiId] = useState("");
  const [currentDateField, setCurrentDateField] = useState(null);
  const [durasi, setDurasi] = useState(1);
  const [formData, setFormData] = useState({
    cutiId: "",
    nama: user?.namaKaryawan,
    tipeCuti: null,
    tipeCutiKhusus: null,
    tanggalMulai: new Date(),
    tanggalSelesai: new Date(),
    durasi: 1,
    keterangan: "",
    fileName: null,
    fileUri: null,
  });
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

  const { user } = useContext(AuthContext);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const [fileUri, setFileUri] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handlePickFile = async (source) => {
    try {
      if (source === "camera") {
        const cameraPermission =
          await ImagePicker.requestCameraPermissionsAsync();

        if (!cameraPermission.granted) {
          alert("Permission to access camera is required!");
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.cancelled) {
          const fileName = `photo_${Date.now()}.jpg`;
          setFileName(fileName);
          setFileUri(result.uri);

          setFormData((prev) => ({
            ...prev,
            fileName,
            fileUri: result.uri,
          }));
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: ["image/*", "application/pdf", "application/zip"],
          copyToCacheDirectory: true,
          multiple: false,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const pickedFile = result.assets[0];
          setFileName(pickedFile.name);
          setFileUri(pickedFile.uri);

          setFormData((prev) => ({
            ...prev,
            fileName: pickedFile.name,
            fileUri: pickedFile.uri,
          }));
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchLastCutiId = async () => {
    try {
      const ip = await getServerIP();
      const response = await fetch(`http://${ip}:8080/cuti`);
      const data = await response.json();

      if (data.length === 0) {
        const newId = generateNewCutiId(null);
        setGeneratedCutiId(newId);
        setFormData((prev) => ({ ...prev, cutiId: newId }));
      } else {
        const validData = data.filter((item) => item && item.cutiId);
        const sorted = validData.sort((a, b) =>
          a.cutiId.localeCompare(b.cutiId)
        );

        const lastId = sorted[sorted.length - 1].cutiId;
        const newId = generateNewCutiId(lastId);

        setGeneratedCutiId(newId);
        setFormData((prev) => ({ ...prev, cutiId: newId }));
      }
    } catch (error) {
      console.error("Gagal mengambil data cuti:", error);
    }
  };

  const generateNewCutiId = (lastId) => {
    const now = new Date();
    const prefix = `LVR${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

    let lastNumber = 0;
    if (lastId && lastId.startsWith(prefix)) {
      lastNumber = parseInt(lastId.slice(-4));
    }

    const newNumber = String(lastNumber + 1).padStart(4, "0");
    return `${prefix}${newNumber}`;
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hitungDurasi = (start, end) => {
    const satuHari = 1000 * 60 * 60 * 24;
    const selisih = Math.ceil((end - start) / satuHari) + 1;
    const durasiFinal = selisih > 0 ? selisih : 1;
    setDurasi(durasiFinal);
    setFormData((prev) => ({
      ...prev,
      durasi: durasiFinal,
    }));
  };

  const handleConfirmDate = (date) => {
    if (currentDateField === "start") {
      setSelectedStartDate(date);
      hitungDurasi(date, selectedEndDate);
      setFormData((prev) => ({
        ...prev,
        tanggalMulai: date,
      }));
    } else if (currentDateField === "end") {
      setSelectedEndDate(date);
      hitungDurasi(selectedStartDate, date);
      setFormData((prev) => ({
        ...prev,
        tanggalSelesai: date,
      }));
    }
    hideDatePicker();
  };

  useEffect(() => {
    fetchLastCutiId();
  }, []);

  useEffect(() => {
    if (user?.namaKaryawan) {
      setFormData((prev) => ({
        ...prev,
        nama: user.namaKaryawan,
      }));
    }
  }, [user]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      tipeCuti,
    }));
  }, [tipeCuti]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      tipeCutiKhusus,
    }));
  }, [tipeCutiKhusus]);

  const uploadLampiran = async () => {
    try {
      if (!formData.fileUri) return null;

      const ip = await getServerIP();
      const uri = formData.fileUri;
      const filename = formData.fileName;

      const formDataUpload = new FormData();
      formDataUpload.append("file", {
        uri: uri,
        name: filename,
        type: "application/octet-stream",
      });

      const response = await fetch(`http://${ip}:8080/cuti/upload-lampiran`, {
        method: "POST",
        body: formDataUpload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("hasil unggah", response);
      if (!response.ok) {
        throw new Error("Upload lampiran gagal");
      }

      const uploadedFileName = await response.text();
      return uploadedFileName;
    } catch (error) {
      console.error("Error upload lampiran:", error);
      return null;
    }
  };

  const subTipeCutiOptions = {
    CH: "Cuti Haid",
    CIL: "Cuti Istri Melahirkan/Keguguran",
    CK: "Cuti Kematian Istri/suami/anak >200km",
    CK1: "Cuti Kematian Istri/suami/anak",
    CKB: "Cuti Khitan / Baptis",
    CKH: "Cuti khusus Haji dan Kerohanian",
    CKK: "Cuti kematian Kakek/Nenek/Cucu (karyawan) >200km",
    CKK1: "Cuti kematian Kakek/Nenek/Cucu (karyawan)",
    CKP: "Cuti Kematian Org tua/Mrtua/SdrKdg/OrgSermh >200km",
    CKP1: "Cuti Kematian Org tua/Mrtua/SdrKdg/OrgSermh",
    CKU: "Cuti Khusus Umroh",
    CL: "Cuti Karyawati Melahirkan/Keguguran",
    CN: "Cuti Karyawan Menikah",
    CNA: "Cuti Menikahkan Anak",
    COPN: "Cuti Opname Istri/Suami/Anak",
    COPNB: "Cuti Opname Bapak/ibu/mertua/saudara kandung",
    COPNK: "Cuti Opname Kakek/nenek/orang serumah",
    CP: "Cuti Pribadi",
    CPS: "Cuti Pribadi Security",
    CTN: "Cuti Tugas Negara",
    DISLAIN: "Dispensasi Lain Lain",
    DISP: "Cuti Dispensasi Bencana Alam dan Tugas Negara",
    DM: "Dispensasi Mumps (Gondongan)",
    DP: "Cuti Dispensasi Sakit Mata dan Cacar",
    DPTM: "Cuti Dispensasi Tetangga Meninggal",
    MPP: "Masa Persiapan Pensiun",
    OPN: "Cuti Opname Karyawan",
    SDC: "Sakit dgn Surat Dokter selain klinik GS Battery",
    SDK: "Surat Dokter Kecelakaan Kerja",
    SSGS: "Sakit dgn Surat Dokter klinik GS Battery",
  };

  const handleSubmit = async () => {
    try {
      const ip = await getServerIP();
      const today = new Date();

      let uploadedFileName = "";
      if (formData.fileUri) {
        uploadedFileName = await uploadLampiran();
      }

      const subTipe = (() => {
        if (formData.tipeCuti === "Cuti Khusus" && formData.tipeCutiKhusus) {
          return `${formData.tipeCutiKhusus} - ${
            subTipeCutiOptions[formData.tipeCutiKhusus] || ""
          }`;
        } else if (formData.tipeCuti === "Cuti Pribadi") {
          return "CP - Cuti Pribadi";
        } else if (formData.tipeCuti === "Cuti Besar") {
          return "CB - Cuti Besar";
        } else {
          return null;
        }
      })();

      const payload = {
        cutiId: formData.cutiId,
        npk: user?.npk,
        tipeCuti: formData.tipeCuti,
        subTipeCuti: subTipe,
        mulaiDari: new Date(selectedStartDate).toISOString().split("T")[0],
        sampaiDengan: new Date(selectedEndDate).toISOString().split("T")[0],
        durasi: durasi,
        status: "Menunggu Persetujuan",
        alasan: formData.keterangan,
        lampiran: uploadedFileName || "",
        tanggalPengajuan: today.toISOString().split("T")[0],
        masaBerlakuCuti: selectedEndDate.toISOString().split("T")[0],
        jenisCuti: formData.tipeCuti,
        tanggalAkhir: selectedEndDate.toISOString().split("T")[0],
        tanggalAwal: selectedStartDate.toISOString().split("T")[0],
      };

      console.log("Data yang akan disubmit:", payload);

      const response = await fetch(`http://${ip}:8080/cuti`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Berhasil",
          text2: "Pengajuan cuti berhasil disimpan.",
        });
        navigation.goBack();
      } else {
        console.error("Gagal:", result);
        Toast.show({
          type: "error",
          text1: "Gagal",
          text2: "Pengajuan cuti gagal dikirim.",
        });
      }
    } catch (error) {
      console.error("Error saat submit:", error);
      alert("Terjadi kesalahan saat mengajukan cuti.");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Tambah Cuti" />

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>No. Pengajuan Cuti</Text>
        <TextInput
          style={styles.inputClose}
          editable={false}
          value={generatedCutiId}
        />

        <Text style={styles.label}>
          Permohonan Untuk <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          style={styles.inputClose}
          value={formData.nama}
          editable={false}
        />

        <Text style={styles.label}>
          Tipe Cuti <Text style={{ color: "red" }}>*</Text>
        </Text>
        <Dropdown
          open={open}
          value={tipeCuti}
          items={items}
          setOpen={setOpen}
          setValue={setTipeCuti}
          setItems={setItems}
          placeholder="Pilih Jenis Cuti"
          modalTitle="Pilih Jenis Cuti"
          zIndex={1000}
        />

        {tipeCuti === "Cuti Khusus" && (
          <>
            <Text style={{ marginTop: 10, marginBottom: 8 }}>
              Cuti Khusus<Text style={{ color: "red" }}> *</Text>
            </Text>
            <Dropdown
              open={openKhusus}
              value={tipeCutiKhusus}
              items={itemsKhusus}
              setOpen={setOpenKhusus}
              setValue={setTipeCutiKhusus}
              setItems={setItemsKhusus}
              placeholder="Pilih Jenis Cuti Khusus"
              modalTitle="Pilih Jenis Cuti Khusus"
              zIndex={1000}
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
                <TouchableOpacity
                  onPress={() => {
                    setCurrentDateField("start");
                    showDatePicker();
                  }}
                  style={styles.dateInput}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#ddd",
                      borderRadius: 8,
                      backgroundColor: "#fff",
                      overflow: "hidden",
                      height: 35,
                    }}
                  >
                    <Text
                      style={{
                        paddingTop: 8,
                        paddingLeft: 5,
                        fontFamily: "Poppins_400Regular",
                      }}
                    >
                      {selectedStartDate.toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </TouchableOpacity>

                <DateTimePickerModal
                  key={currentDateField}
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirmDate}
                  onCancel={hideDatePicker}
                  display="inline"
                  locale="id-ID"
                  themeVariant="light"
                  date={
                    currentDateField === "start"
                      ? selectedStartDate
                      : selectedEndDate
                  }
                />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>
                Sampai Dengan <Text style={{ color: "red" }}>*</Text>
              </Text>

              <View>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentDateField("end");
                    showDatePicker();
                  }}
                  style={styles.dateInput}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#ddd",
                      borderRadius: 8,
                      backgroundColor: "#fff",
                      overflow: "hidden",
                      height: 35,
                    }}
                  >
                    <Text
                      style={{
                        paddingTop: 8,
                        paddingLeft: 5,
                        fontFamily: "Poppins_400Regular",
                      }}
                    >
                      {selectedEndDate.toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirmDate}
                  onCancel={hideDatePicker}
                  display="inline"
                  locale="id-ID"
                  themeVariant="light"
                />
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Durasi</Text>
        <TextInput
          style={styles.input}
          value={durasi.toString()}
          editable={false}
        />

        <Text style={styles.label}>Keterangan</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          placeholder="Masukan Keterangan ..."
          value={formData.keterangan}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, keterangan: text }))
          }
        />

        <>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
              Berkas Lampiran
              {formData.tipeCuti === "Cuti Khusus" && (
                <Text style={{ color: "red" }}> *</Text>
              )}
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              {/* <TouchableOpacity
                style={styles.attachmentButton}
                onPress={() => handlePickFile("camera")}
              >
                <Ionicons name="camera" size={20} color="#1E2D56" />
                <Text>Ambil Foto</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={() => handlePickFile("file")}
              >
                <Ionicons name="document" size={20} color="#1E2D56" />
                <Text style={{ fontFamily: "Poppins_600SemiBold" }}>
                  Pilih File
                </Text>
              </TouchableOpacity>
            </View>

            {fileName && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontFamily: "Poppins_500Medium" }}>
                  File terpilih: {fileName}
                </Text>

                {fileUri &&
                  (fileName.endsWith(".jpg") ||
                    fileName.endsWith(".png") ||
                    fileName.endsWith(".jpeg")) && (
                    <Image
                      source={{ uri: fileUri }}
                      style={{
                        width: "100%",
                        height: 200,
                        resizeMode: "contain",
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 8,
                        marginBottom: 12,
                      }}
                    />
                  )}

                {fileUri && fileName.endsWith(".pdf") && (
                  <View
                    style={{
                      backgroundColor: "#f0f0f0",
                      padding: 16,
                      borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "#ddd",
                    }}
                  >
                    <Ionicons name="document-text" size={48} color="#e74c3c" />
                    <Text style={{ marginTop: 8 }}>Dokumen PDF</Text>
                  </View>
                )}

                {fileUri && fileName.endsWith(".zip") && (
                  <View
                    style={{
                      backgroundColor: "#f0f0f0",
                      padding: 16,
                      borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "#ddd",
                    }}
                  >
                    <Ionicons name="folder" size={48} color="#f39c12" />
                    <Text style={{ marginTop: 8 }}>File ZIP</Text>
                  </View>
                )}
              </View>
            )}
          </View>
          <Text
            style={{
              color: "red",
              fontSize: 12,
              marginTop: 4,
              fontFamily: "Poppins_400Regular",
            }}
          >
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
            <Text
              style={{ marginBottom: 4, fontFamily: "Poppins_600SemiBold" }}
            >
              Note:
            </Text>
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular" }}>
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
          style={[
            styles.button,
            {
              backgroundColor: "#2196F3",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            },
            { backgroundColor: "#4CAF50" },
          ]}
          onPress={() => {
            handleSubmit();
          }}
        >
          <Ionicons
            name="send"
            size={15}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Submit</Text>
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
  attachmentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1E2D56",
    padding: 10,
    borderRadius: 8,
    gap: 5,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
  },
});
