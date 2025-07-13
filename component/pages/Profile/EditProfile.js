import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/EditProfileStyles";
import {
  pickFileFromCamera,
  pickFileFromDocument,
  updateProfileData,
} from "../../backbone/api";
import { AuthContext } from "../../backbone/AuthContext";
import Header from "../../backbone/Header";
import Dropdown from "../../part/Dropdown";
import PhoneInput from "react-native-phone-number-input";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatTanggal } from "../../part/Date";
import Toast from "react-native-toast-message";
import { getServerIP } from "../../backbone/ApiConfig";
import i18n from "../../backbone/i18n";

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [formData, setFormData] = useState({
    npk: user?.npk || "",
    namaKaryawan: user?.namaKaryawan || "",
    email: user?.email || "",
    noHandphone: user?.noHandphone
      ? user.noHandphone.replace(/^(\+62|62)/, "")
      : "",
    plant: user?.plant || "",
    departemen: user?.departemen || "",
    tanggalLahir: user?.tanggalLahir || "",
    fotoKaryawan: user?.fotoKaryawan || "",
    fileUri: "",
    fileName: "",
  });

  useEffect(() => {
    const buildImageUrl = async () => {
      if (user?.fotoKaryawan && !user.fotoKaryawan.startsWith("file://")) {
        const ip = await getServerIP();
        const fullUrl = `http://${ip}:8080/karyawan/lampiran/${encodeURIComponent(
          user.fotoKaryawan
        )}?t=${Date.now()}`;
        setImageUrl(fullUrl);
      }
    };

    buildImageUrl();
  }, [user?.fotoKaryawan]);

  const [openPlant, setOpenPlant] = useState(false);
  const [itemsPlant, setItemsPlant] = useState([
    { label: "Jakarta", value: "Jakarta" },
    { label: "Bandung", value: "Bandung" },
    { label: "Surabaya", value: "Surabaya" },
    { label: "Medan", value: "Medan" },
    { label: "Yogyakarta", value: "Yogyakarta" },
    { label: "Semarang", value: "Semarang" },
    { label: "Palembang", value: "Palembang" },
    { label: "Makassar", value: "Makassar" },
    { label: "Balikpapan", value: "Balikpapan" },
    { label: "Batam", value: "Batam" },
    { label: "Denpasar", value: "Denpasar" },
    { label: "Banjarmasin", value: "Banjarmasin" },
    { label: "Pekanbaru", value: "Pekanbaru" },
    { label: "Manado", value: "Manado" },
    { label: "Padang", value: "Padang" },
    { label: "Karawang", value: "Karawang" },
  ]);

  const [openDepartemen, setOpenDepartemen] = useState(false);
  const [itemsDepartemen, setItemsDepartemen] = useState([
    { label: "IT", value: "IT" },
    { label: "HR", value: "HR" },
    { label: "Finance", value: "Finance" },
    { label: "Marketing", value: "Marketing" },
    { label: "Production", value: "Production" },
    { label: "Engineering", value: "Engineering" },
    { label: "Procurement", value: "Procurement" },
    { label: "Quality", value: "Quality" },
  ]);

  useEffect(() => {
    if (user) {
      const rawPhone = user.noHandphone || "";

      // Jika nomor dimulai dengan +62 atau 62, ganti jadi 0 di depan
      const localPhone = rawPhone.replace(/^(\+62|62)/, "0");

      setFormData({
        npk: user.npk || "",
        namaKaryawan: user.namaKaryawan || "",
        email: user.email || "",
        noHandphone: localPhone, // tanpa kode negara
        plant: user.plant || "",
        departemen: user.departemen || "",
        tanggalLahir: user.tanggalLahir || "",
        fotoKaryawan: user.fotoKaryawan || "",
        fileUri: "",
        fileName: "",
      });
    }
  }, [user]);

  console.log("data", formData);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePickFile = async (source) => {
    try {
      const picked =
        source === "camera"
          ? await pickFileFromCamera()
          : await pickFileFromDocument();

      if (picked) {
        setFormData((prev) => ({
          ...prev,
          fileUri: picked.fileUri,
          fileName: picked.fileName,
          fotoKaryawan: picked.fileUri,
        }));
      }
    } catch (error) {
      alert(i18n.t("error_select_file"));
    }
  };

  const handleEditProfilePicture = () => {
    Alert.alert(
      i18n.t("change_photo"),
      i18n.t("select_photo_source"),
      [
        {
          text: i18n.t("camera"),
          onPress: () => handlePickFile("camera"),
        },
        {
          text: i18n.t("gallery"),
          onPress: () => handlePickFile("gallery"),
        },
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDate = (date) => {
    const formatted = date.toISOString().split("T")[0];
    setSelectedDate(date);
    handleChange("tanggalLahir", formatted);
    hideDatePicker();
  };

  const validateForm = () => {
    if (!formData.namaKaryawan || !formData.email || !formData.noHandphone) {
      Alert.alert(i18n.t("validation"), i18n.t("required_fields"));
      return false;
    }

    if (!formData.email.includes("@")) {
      Alert.alert(i18n.t("validation"), i18n.t("invalid_email"));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await updateProfileData(user.npk, formData);

      if (response.result === 200) {
        Toast.show({
          type: "success",
          text1: i18n.t("success"),
          text2: i18n.t("profile_updated"),
        });

        const updatedUser = {
          ...user,
          ...formData,
          fotoKaryawan: response.uploadedFileName || user.fotoKaryawan,
        };
        setUser(updatedUser);

        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: i18n.t("fail"),
          text2: i18n.t("profile_update_failed"),
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: i18n.t("error"),
        text2: i18n.t("profile_update_error"),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header title={i18n.t("edit_profile")} />
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.headerSection}>
          <View style={styles.profileWrapper}>
            {formData.fotoKaryawan ? (
              <Image
                source={{
                  uri: formData.fotoKaryawan.startsWith("file://")
                    ? formData.fotoKaryawan
                    : imageUrl,
                }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.defaultAvatar}>
                <FontAwesome name="user" size={40} color="#1E3668" />
              </View>
            )}
            <TouchableOpacity
              onPress={handleEditProfilePicture}
              style={styles.editIconWrapper}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>{i18n.t("label_name")}</Text>
        <TextInput
          style={styles.input}
          value={formData.namaKaryawan}
          onChangeText={(text) => handleChange("namaKaryawan", text)}
        />

        <Text style={styles.label}>{i18n.t("label_email")}</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        <Text style={styles.label}>{i18n.t("label_phone")}</Text>
        {formData.noHandphone !== "" && (
          <PhoneInput
            value={formData.noHandphone}
            defaultCode="ID"
            layout="first"
            onChangeFormattedText={(text) => handleChange("noHandphone", text)}
            withShadow
            autoFocus={false}
            containerStyle={styles.phoneContainer}
            textContainerStyle={styles.phoneTextContainer}
          />
        )}

        <Text style={styles.label}>{i18n.t("label_plant")}</Text>
        <Dropdown
          open={openPlant}
          value={formData.plant}
          items={itemsPlant}
          setOpen={setOpenPlant}
          setValue={(val) => handleChange("plant", val)}
          setItems={setItemsPlant}
          placeholder={i18n.t("select_plant")}
          modalTitle={i18n.t("select_plant")}
        />

        <Text style={styles.label}>{i18n.t("label_department")}</Text>
        <Dropdown
          open={openDepartemen}
          value={formData.departemen}
          items={itemsDepartemen}
          setOpen={setOpenDepartemen}
          setValue={(val) => handleChange("departemen", val)}
          setItems={setItemsDepartemen}
          placeholder={i18n.t("select_department")}
          modalTitle={i18n.t("select_department")}
        />

        <Text style={styles.label}>{i18n.t("label_birthdate")}</Text>
        <TouchableOpacity style={styles.input} onPress={showDatePicker}>
          <Text>
            {formatTanggal(formData.tanggalLahir) || i18n.t("select_birthdate")}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          date={
            formData.tanggalLahir ? new Date(formData.tanggalLahir) : new Date()
          }
          locale="id-ID"
          themeVariant="light"
        />
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="save" color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.submitText}>{i18n.t("save")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfile;
