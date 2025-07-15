import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useCameraPermissions, CameraView } from "expo-camera";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../backbone/Constant";
import CameraButton from "./CameraButton";


const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("❌ Gagal ambil data:", e);
    return null;
  }
};

export default function CameraScreen({ navigation, mode = "checkin", onSuccess }) {
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
  if (permission == null) {
    requestPermission();
  }
}, [permission]);

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePhoto = async () => {
    // if (!hasPermission) {
    //   Alert.alert("Izin kamera belum diberikan");
    //   return;
    // }

    if (cameraRef.current) {
      try {
        const result = await cameraRef.current.takePictureAsync({ quality: 1, base64: true });
        setPhotoUri(result.uri);
      } catch (e) {
        console.error("❌ Gagal ambil foto:", e);
        Alert.alert("Gagal ambil foto");
      }
    }
  };

  const reset = () => setPhotoUri(null);

  const getTimeNow = () => {
    const now = new Date();
    return now.toTimeString().split(" ")[0];
  };

  const sendPhoto = async () => {
    try {
      setLoading(true);
      const current = await getData("lastLogin");
      console.log(current);
      if (!current?.username) throw new Error("Data login tidak ditemukan");

      const npk = current.username;
      const now = new Date();
      const tanggal = now.toISOString().split("T")[0];

      const formData = new FormData();
      const filename = photoUri.split("/").pop();

      formData.append("foto", {
        uri: photoUri,
        name: filename,
        type: "image/jpeg",
      });

      const location = await Location.getCurrentPositionAsync({});

      if (mode === "checkin") {
        const locPerm = await Location.requestForegroundPermissionsAsync();
        if (locPerm.status !== "granted") {
          Alert.alert("Akses lokasi ditolak");
          return;
        }

        formData.append("data", JSON.stringify({
          idKaryawan: npk,
          latitudeMasuk: location.coords.latitude,
          longitudeMasuk: location.coords.longitude,
          tanggalMasuk: now.toISOString(),
          indikatorKehadiran: 1
        }));
      } else if (mode === "checkout") {
        formData.append("data", JSON.stringify({
          idKaryawan: npk,
          latitudeKeluar: location.coords.latitude,
          longitudeKeluar: location.coords.longitude,
        }));
        formData.append("tanggal", tanggal);
      }

      const endpoint = mode === "checkin"
        ? BASE_URL + "kehadiran/checkin"
        : BASE_URL + "kehadiran/checkout";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const resJson = await response.json();
      if (!response.ok) throw new Error(resJson.message || "Gagal mengirim data");

      Alert.alert(`${mode === "checkin" ? "Check-in" : "Check-out"} berhasil`);
      reset();
      if (onSuccess) onSuccess();
      navigation.goBack();
    } catch (err) {
      console.error("❌ Gagal kirim data:", err);
      Alert.alert(`Gagal ${mode}: ${err.message}`);
    }finally{
      setLoading(false);
    }
  };

  if (permission == null) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E3668" />
        <Text style={{ marginTop: 10 }}>Memuat izin kamera...</Text>
      </SafeAreaView>
    );
  }

  if (!permission?.granted) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Izin kamera tidak diberikan.</Text>
        <TouchableOpacity onPress={() => requestPermission} style={btnStyle}>
          <Text style={textStyle}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {!photoUri ? (
        <View style={{ flex: 1 }}>
          <CameraView
            ref={cameraRef}
            facing={facing}
            style={{ flex: 1 }}
          />

          <View style={bottomBarStyle}>
            <CameraButton icon="flip-camera-android" label="Ganti" onPress={toggleCameraFacing} />
            <CameraButton icon="close" label="Batal" onPress={() => navigation.goBack()} />
            <CameraButton icon="camera-alt" label="Potret" onPress={takePhoto} />
          </View>

        </View>

      ) : (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: photoUri }} style={{ flex: 1 }} />
          <View style={bottomBarStyle}>
            <CameraButton icon="refresh" label="Ulangi" onPress={reset} />
            <CameraButton icon="send" label="Kirim" onPress={sendPhoto} />
          </View>
        </View>
      )}
      {loading && (
        <View style={loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>Mengirim data...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const bottomBarStyle = {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 20,
};

const loadingOverlay = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

