import { getServerIP } from "./ApiConfig";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import BASE_URL from "./Constant";


const handleResponse = async (response) => {
  const textResponse = await response.text();
  try {
    const jsonResponse = JSON.parse(textResponse);

    if (!response.ok) {
      const errorMessage =
        jsonResponse.message || `Server error with status: ${response.status}`;
      throw new Error(errorMessage);
    }
    return jsonResponse;
  } catch (e) {
    console.error("Failed to parse JSON or invalid response:", textResponse);
    throw new Error(
      `Invalid response from server. Status: ${response.status}.`
    );
  }
};

export const uploadLampiran = async (fileUri, fileName, api) => {
  try {
    if (!fileUri) return null;

    const ip = await getServerIP();
    const extension = fileName.split(".").pop().toLowerCase();
    const mimeType =
      {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        pdf: "application/pdf",
        zip: "application/zip",
      }[extension] || "application/octet-stream";

        const fileInfo = await FileSystem.getInfoAsync(fileUri);
    console.log("📁 File Info:");
    console.log("→ URI:", fileUri);
    console.log("→ Name:", fileName);
    console.log("→ MIME Type:", mimeType);
    console.log("→ Size (bytes):", fileInfo.size);
    if (!fileInfo.exists) {
      console.warn("⚠️ File tidak ditemukan di path:", fileUri);
      return null;
    }


    const formDataUpload = new FormData();
    formDataUpload.append("file", {
      uri: fileUri,
      name: fileName,
      type: mimeType,
    });

    const response = await fetch(`http://${ip}:8080/${api}`, {
      method: "POST",
      body: formDataUpload,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("responess", response)

    if (!response.ok) throw new Error("Upload lampiran gagal");

    return await response.text();
  } catch (error) {
    console.error("Error upload lampiran:", error);
    return null;
  }
};

export const updateUserPassword = async ({ npk, oldPassword, newPassword }) => {
  console.log("coba", npk, oldPassword, newPassword);
  try {
    const ip = await getServerIP();
    const response = await fetch(`http://${ip}:8080/karyawan/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ npk, password: oldPassword, newPassword }),
    });

    return await response.json();
  } catch (err) {
    console.log("Password update error:", err);
    throw err;
  }
};

export const updateProfileData = async (npk, formData) => {
  try {
    let uploadedFileName = "";
    if (formData.fileUri) {
      uploadedFileName = await uploadLampiran(
        formData.fileUri,
        formData.fileName,
        "karyawan/upload-lampiran"
      );
    }

    console.log("data alamat", formData.alamat);

    const payload = {
      npk: npk,
      namaKaryawan: formData.namaKaryawan,
      email: formData.email,
      noHandphone: formData.noHandphone,
      departemen: formData.departemen,
      plant: formData.plant,
      tanggalLahir: formData.tanggalLahir,
      status: formData.status || "Aktif",
      fotoKaryawan: uploadedFileName || null,
      alamat: JSON.stringify(formData.alamat),
      modifBy: npk,
      modifDate: new Date().toISOString(),
    };

    console.log("payload", payload);
    const ip = await getServerIP();
    const response = await fetch(`http://${ip}:8080/karyawan`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return {
      ...result,
      uploadedFileName,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { status: 500, message: "Update gagal" };
  }
};

export const pickFileFromDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf", "application/zip"],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const pickedFile = result.assets[0];
      return {
        fileName: pickedFile.name,
        fileUri: pickedFile.uri,
      };
    }

    return null;
  } catch (error) {
    console.error("Document Picker Error:", error);
    throw error;
  }
};
export const pickFileFromCamera = async () => {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      throw new Error("Camera permission denied");
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        fileName: asset.fileName || `photo_${Date.now()}.jpg`,
        fileUri: asset.uri,
      };
    }
    return null;
  } catch (error) {
    console.error("Camera Picker Error:", error);
    throw error;
  }
};

export const fetchUserData = async (npk) => {
  try {
    const ip = await getServerIP();
    const response = await fetch(`http://${ip}:8080/karyawan/${npk}/keluarga`);
    return handleResponse(response);
  } catch (error) {
    console.error("Gagal mengambil data karyawan:", error);
    throw error;
  }
};

export const fetchAllDiagnosa = async () => {
  try {
    const ip = await getServerIP();
    const response = await fetch(`http://${ip}:8080/diagnosa`);
    return handleResponse(response);
  } catch (error) {
    console.error("Gagal mengambil data diagnosa:", error);
    throw error;
  }
};

export const fetchRumahSakit = async (tipe) => {
  try {
    const ip = await getServerIP();
    const encodedTipe = encodeURIComponent(tipe);
    const url = `http://${ip}:8080/rumahsakit?tipe=${encodedTipe}`;
    const response = await fetch(url);
    return handleResponse(response);
  } catch (error) {
    console.error("Gagal mengambil data rumah sakit:", error);
    throw error;
  }
};

export const submitReimbursement = async (formData) => {
  try {
    const ip = await getServerIP();
    const url = `http://${ip}:8080/reimbursement`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Gagal mengirim data reimbursement:", error);
    throw error;
  }
};

// API CUTI
export const fetchJatahCutiAPI = async (
  userId,
  selectedYear,
  selectedJenis,
  cutiList
) => {
  try {
    const ip = await getServerIP();
    const response = await fetch(
      `http://${ip}:8080/jatahcuti/karyawan?npk=${userId}&tahun=${selectedYear}&tipe=${selectedJenis}`
    );
    const data = await response.json();

    const onProgres = cutiList.filter(
      (item) => item.tipeCuti === "Menunggu Persetujuan"
    ).length;

    return {
      hakCuti: data[0]?.hakCuti || 0,
      cutiDipakai: data[0]?.cutiDipakai || 0,
      sisaCuti: data[0]?.cutiSisa || 0,
      onProgres,
      masaBerlaku: data[0]?.masaBerlaku || 0,
    };
  } catch (error) {
    console.error("Gagal mengambil jatah cuti", error);
    throw error;
  }
};

export const fetchCutiListAPI = async (
  userId,
  selectedJenis,
  selectedStatus
) => {
  try {
    const query = new URLSearchParams({
      npk: userId,
      ...(selectedJenis && { jenis: selectedJenis }),
      ...(selectedStatus !== "Semua" && { status: selectedStatus }),
    });

    const response = await fetch(
      `${BASE_URL}cuti/karyawan?${query.toString()}`
    );
    const data = await response.json();

    console.log("dataa", response)

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Gagal mengambil data cuti", error);
    return [];
  }
};

export const fetchFolderSizes = async () => {
  try {
    const res = await fetch(`${BASE_URL}cuti/size`);
    const data = await res.json();
    return data; // objek key-folder : byte
  } catch (err) {
    console.error("Gagal ambil ukuran folder", err);
    return {};
  }
};



export const fetchCutiListAPIAtasan = async (
  selectedJenis,
  selectedStatus
) => {
  try {
    const ip = await getServerIP();

    const query = new URLSearchParams({
      ...(selectedJenis && { tipeCuti: selectedJenis }),
      ...(selectedStatus !== "Semua" && { status: selectedStatus }),
    });

    const response = await fetch(
      `http://${ip}:8080/cuti/atasan?${query.toString()}`
    );
    const data = await response.json();
    console.log("cuti atasana", data);

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Gagal mengambil data cuti", error);
    return [];
  }
};

export const fetchDetailCuti = async (cutiId) => {
  if (!cutiId) return null;

  try {
    const ip = await getServerIP();
    const BASE_URL = `http://${ip}:8080`;

    const response = await fetch(`${BASE_URL}/cuti/${cutiId}`);
    const data = await response.json();

    return {
      ...data,
      fileUri: `${BASE_URL}/cuti/lampiran/${encodeURIComponent(data.lampiran)}`,
    };
  } catch (err) {
    console.error("Gagal mengambil detail cuti:", err);
    throw err;
  }
};

export const fetchLastCutiId = async () => {
  const ip = await getServerIP();
  const response = await fetch(`http://${ip}:8080/cuti`);
  const data = await response.json();
  return data;
};

export const submitPengajuanCuti = async (payload) => {
  try {
    const ip = await getServerIP();
    const response = await fetch(`http://${ip}:8080/cuti`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    return { response, result };
  } catch (error) {
    console.error("Error saat submit:", error);
    throw error;
  }
};
