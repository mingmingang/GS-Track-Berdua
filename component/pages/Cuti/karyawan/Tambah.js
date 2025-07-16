import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../backbone/AuthContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Dropdown from "../../../part/Dropdown";
import Header from "../../../backbone/Header";
import Toast from "react-native-toast-message";
import styles from "../../../styles/Cuti/TambahCutiStyle";
import {
  fetchLastCutiId,
  uploadLampiran,
  submitPengajuanCuti,
} from "../../../backbone/api";
import {
  pickFileFromCamera,
  pickFileFromDocument,
} from "../../../backbone/api";
import i18n from "../../../backbone/i18n";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { getServerIP } from "../../../backbone/ApiConfig";
import { usePushNotif } from "../../PushNotifContext";
import { pushNotifKeUser } from "../../notifUtils";
import BASE_URL from "../../../backbone/Constant";
import { sendPushNotification } from "../../ExpoClientPushNotification";

const TambahCutiScreen = () => {
  const { token } = usePushNotif();
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
    { label: i18n.t("cuti.pribadi"), value: "Cuti Pribadi" },
    { label: i18n.t("cuti.besar"), value: "Cuti Besar" },
    { label: i18n.t("cuti.khusus"), value: "Cuti Khusus" },
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
    const getCutiId = async () => {
      try {
        const data = await fetchLastCutiId();
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

    getCutiId();
  }, []);

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

  const handleSubmit = async () => {
    try {
      const today = new Date();

      let uploadedFileName = "";
      if (formData.fileUri) {
        uploadedFileName = await uploadLampiran(
          formData.fileUri,
          formData.fileName,
          "cuti/upload-lampiran"
        );
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

      const { response, result } = await submitPengajuanCuti(payload);

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Berhasil",
          text2: "Pengajuan cuti berhasil disimpan.",
        });

        const now = new Date();
        const formattedDate = now.toLocaleString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        // const ip = await getServerIP();

        try {
          const notifResponse = await fetch(
            `${BASE_URL}notifikasi/save`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                idKaryawan: user?.npk,
                judulNotifikasi: "Pengajuan Cuti",
                pesanNotifikasi: `Pengajuan cuti Anda berhasil dikirim pada ${formattedDate}.`,
                tipeNotif: 2,
              }),
            }
          );

          sendPushNotification(token,"Pengajuan Cuti",`Pengajuan cuti Anda berhasil dikirim pada ${formattedDate}.`);

          const notifResult = await notifResponse.json();
          console.log("Notifikasi terkirim:", notifResult);
        } catch (notifError) {
          console.log("Gagal mengirim notifikasi:", notifError);
        }

        console.log("Before showLocalNotification()");
        await showLocalNotification();
        console.log("After showLocalNotification()");

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

  useEffect(() => {
    const requestPermissions = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Izin notifikasi tidak diberikan.");
        }
      } else {
        alert("Notifikasi hanya tersedia di perangkat fisik.");
      }
    };

    requestPermissions();
  }, []);

  const handlePickFile = async (source) => {
    try {
      let picked = null;
      if (source === "camera") {
        picked = await pickFileFromCamera();
      } else {
        picked = await pickFileFromDocument();
      }

      if (picked) {
        setFileName(picked.fileName);
        setFileUri(picked.fileUri);
        setFormData((prev) => ({
          ...prev,
          fileName: picked.fileName,
          fileUri: picked.fileUri,
        }));
      }
    } catch (error) {
      alert("Gagal memilih file.");
    }
  };

  const showLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pengajuan Cuti Berhasil ✅",
        body: "Permohonan cuti kamu berhasil diajukan dan menunggu persetujuan.",
        sound: "default",
      },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <Header title={i18n.t("tambahCuti.judulHalaman")} />

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>{i18n.t("tambahCuti.noPengajuan")}</Text>
        <TextInput
          style={styles.inputClose}
          editable={false}
          value={generatedCutiId}
        />

        <Text style={styles.label}>
          {i18n.t("tambahCuti.permohonanUntuk")}{" "}
          <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          style={styles.inputClose}
          value={formData.nama}
          editable={false}
        />

        <Text style={styles.label}>
          {i18n.t("tambahCuti.tipeCuti")}{" "}
          <Text style={{ color: "red" }}>*</Text>
        </Text>
        <Dropdown
          open={open}
          value={tipeCuti}
          items={items}
          setOpen={setOpen}
          setValue={setTipeCuti}
          setItems={setItems}
          placeholder={i18n.t("tambahCuti.placeholderTipeCuti")}
          modalTitle={i18n.t("tambahCuti.modalTipeCuti")}
          zIndex={1000}
        />

        {tipeCuti === "Cuti Khusus" && (
          <>
            <Text style={{ marginTop: 10, marginBottom: 8 }}>
     Cuti Khusus
              <Text style={{ color: "red" }}> *</Text>
            </Text>
            <Dropdown
              open={openKhusus}
              value={tipeCutiKhusus}
              items={itemsKhusus}
              setOpen={setOpenKhusus}
              setValue={setTipeCutiKhusus}
              setItems={setItemsKhusus}
              placeholder={i18n.t("tambahCuti.placeholderTipeCutiKhusus")}
              modalTitle={i18n.t("tambahCuti.modalTipeCutiKhusus")}
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
                {i18n.t("tambahCuti.mulaiDari")}{" "}
                <Text style={{ color: "red" }}>*</Text>
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
                {i18n.t("tambahCuti.sampaiDengan")}{" "}
                <Text style={{ color: "red" }}>*</Text>
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

        <Text style={styles.label}>{i18n.t("tambahCuti.durasi")}</Text>
        <TextInput
          style={styles.input}
          value={durasi.toString()}
          editable={false}
        />

        <Text style={styles.label}>{i18n.t("tambahCuti.keterangan")}</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          placeholder={i18n.t("tambahCuti.placeholderKeterangan")}
          value={formData.keterangan}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, keterangan: text }))
          }
        />

        <>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
              {i18n.t("tambahCuti.lampiran")}{" "}
              {formData.tipeCuti === "Cuti Khusus" && (
                <Text style={{ color: "red" }}> *</Text>
              )}
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={() => handlePickFile("file")}
              >
                <Ionicons name="document" size={20} color="#1E2D56" />
                <Text style={{ fontFamily: "Poppins_600SemiBold" }}>
                  {i18n.t("tambahCuti.pilihFile")}
                </Text>
              </TouchableOpacity>
            </View>

            {fileName && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontFamily: "Poppins_500Medium" }}>
                  {i18n.t("tambahCuti.fileTerpilih")}: {fileName}
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
                    <Text style={{ marginTop: 8 }}>
                      {i18n.t("tambahCuti.previewPDF")}
                    </Text>
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
                    <Text style={{ marginTop: 8 }}>
                      {i18n.t("tambahCuti.previewZIP")}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
          <Text style={{ color: "red", fontSize: 12 }}>
            {i18n.t("tambahCuti.formatFile")}
          </Text>

          <View
            style={{
              backgroundColor: "#E5F0FF",
              padding: 10,
              marginTop: 12,
              borderRadius: 6,
            }}
          >
            <Text>{i18n.t("tambahCuti.note")}</Text>
            <Text style={{ fontSize: 12 }}>
              {tipeCuti === "Cuti Khusus"
                ? i18n.t("tambahCuti.lampiranWajib")
                : i18n.t("tambahCuti.lampiranOpsional")}
            </Text>
          </View>
        </>
      </ScrollView>

      <View style={styles.buttonRow}>
        {/* <TouchableOpacity
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
          <Text style={styles.buttonText}>
            {i18n.t("tambahCuti.tombolPrint")}
          </Text>
        </TouchableOpacity> */}

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
          <Text style={styles.buttonText}>
            {i18n.t("tambahCuti.tombolSubmit")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TambahCutiScreen;
