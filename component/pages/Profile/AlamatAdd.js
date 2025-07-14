import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../backbone/Header";
import { AuthContext } from "../../backbone/AuthContext";

export default function AlamatAdd() {
  const route = useRoute();
  const navigation = useNavigation();
  const data = route.params?.data || {};
  const { user, setUser } = useContext(AuthContext);
  const [label, setLabel] = useState(data.adrLabel || "");
  const [provinsi, setProvinsi] = useState(data.adrProvince || "");
  const [kota, setKota] = useState(data.adrCity || "");
  const [kecamatan, setKecamatan] = useState(data.adrSubdistrict || "");
  const [kodePos, setKodePos] = useState(data.adrPostalCode || "");
  const [catatan, setCatatan] = useState(data.adrNotes || "");
  const [alamatLengkap, setAlamatLengkap] = useState(
    typeof user?.alamat === "object" ? user.alamat.alamat : ""
  );

  const [location, setLocation] = useState({
    latitude: user?.alamat?.latitude || "",
    longitude: user?.alamat?.longitude || "",
  });

  console.log("dataa location", user.alamat.alamat);

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const API_KEY = "AIzaSyCT7-70Kff7AsV0on-oNgaZiHv3HU74--g";

  useEffect(() => {
    updateAlamatLengkapFromData();
  }, []);

  const updateAlamatLengkapFromData = () => {
    const full = `${data.adrSubdistrict}, ${data.adrCity}, ${data.adrProvince} ${data.adrPostalCode}`;
    setAlamatLengkap(full);
  };

  const fetchSuggestions = async (text) => {
    setSearchText(text);
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text
        )}&key=${API_KEY}&language=id&components=country:id`
      );
      const json = await res.json();
      if (json.status === "OK") {
        setSuggestions(json.predictions);
      } else {
        console.warn("Autocomplete error:", json.status);
      }
    } catch (err) {
      console.error("Autocomplete fetch error:", err);
    }
  };

  const getPlaceDetail = async (placeId, description) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`
      );
      const json = await res.json();

      if (json.status === "OK") {
        const loc = json.result.geometry.location;
        const components = json.result.address_components;

        // Fungsi bantu untuk ambil komponen alamat
        const getComponent = (type) => {
          const comp = components.find((c) => c.types.includes(type));
          return comp ? comp.long_name : "";
        };

        // Set lokasi koordinat
        setLocation({ latitude: loc.lat, longitude: loc.lng });

        // Set alamat lengkap (dari Google)
        setAlamatLengkap(json.result.formatted_address || description);
        setSearchText(description);
        setSuggestions([]);

        setProvinsi(getComponent("administrative_area_level_1"));
        setKota(getComponent("administrative_area_level_2"));
        setKecamatan(getComponent("administrative_area_level_3"));
        setKodePos(getComponent("postal_code"));
      } else {
        console.warn("Detail fetch error:", json.status);
      }
    } catch (err) {
      console.error("Detail fetch error:", err);
      Alert.alert(
        "Gagal mengambil detail lokasi",
        err.message || "Unknown error"
      );
    }
  };

  const gunakanLokasiSaatIni = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Izin lokasi dibutuhkan");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      let address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (address.length > 0) {
        let a = address[0];
        setProvinsi(a.region || "");
        setKota(a.subregion || "");
        setKecamatan(a.district || "");
        setKodePos(a.postalCode || "");
        let full = `${a.name || ""} ${a.street || ""}, ${a.subregion || ""}, ${
          a.district || ""
        }, ${a.region || ""} ${a.postalCode || ""}`;
        setAlamatLengkap(full);
      }
    } catch (error) {
      Alert.alert("Gagal mendapatkan lokasi", error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedAlamat = {
        alamat: alamatLengkap,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().toISOString(),
      };

      const updatedData = {
        adrLabel: label,
        adrProvince: provinsi,
        adrCity: kota,
        adrSubdistrict: kecamatan,
        adrPostalCode: kodePos,
        adrNotes: catatan,
        adrLatitude: location.latitude,
        adrLongitude: location.longitude,
        adrStatus: data.adrStatus,
        adrFull: alamatLengkap,
        kry_alamat: JSON.stringify(updatedAlamat),
      };

      Alert.alert("Sukses", "Alamat berhasil diperbarui");

      if (route.params?.onSelect) {
        route.params.onSelect(updatedAlamat);
      }

      const updatedUser = {
        ...user,
        alamat: {
          alamat: alamatLengkap,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date().toISOString(),
        },
      };
      setUser(updatedUser);

      navigation.goBack();
    } catch (error) {
      Alert.alert("Gagal", error.message || "Gagal memperbarui alamat");
    }
  };

  return (
    <>
      <Header title="Edit Alamat" />

      <SafeAreaView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
            <Text style={styles.label}>Cari Alamat</Text>
            <TextInput
              placeholder="Cari alamat..."
              value={searchText}
              onChangeText={fetchSuggestions}
              style={styles.input}
            />
            {suggestions.length > 0 && (
              <View style={styles.suggestionContainer}>
                {suggestions.map((item) => (
                  <TouchableOpacity
                    key={item.place_id}
                    onPress={() =>
                      getPlaceDetail(item.place_id, item.description)
                    }
                  >
                    <Text style={styles.suggestionText}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.mapContainer}>
            <MapView
              provider="google"
              style={styles.map}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Lokasi Alamat"
                description="Alamat ini dipilih"
              />
            </MapView>
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.label}>Alamat Saat Ini</Text>
            <Text style={styles.addressSubtitle}>
              {alamatLengkap && alamatLengkap.includes("undefined")
                ? user?.alamat?.alamat || "Memuat alamat..."
                : alamatLengkap || "Memuat alamat..."}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.useCurrentButton}
            onPress={gunakanLokasiSaatIni}
          >
            <Text style={styles.buttonText}>Gunakan Lokasi Saat Ini</Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Simpan Alamat</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 25 },

  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },

  mapContainer: {
    height: 200,
    backgroundColor: "#ccc",
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  addressContainer: {
    padding: 16,
  },

  label: {
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
    fontSize: 16,
  },

  addressSubtitle: {
    fontFamily: "Poppins_400Regular",
    color: "#444",
    marginTop: 4,
  },

  form: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },

  useCurrentButton: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#43de2eff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  updateButton: {
    marginHorizontal: 16,
    marginBottom: 50,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },

  suggestionContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 4,
    maxHeight: 150,
  },

  suggestionText: {
    fontFamily: "Poppins_400Regular",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
