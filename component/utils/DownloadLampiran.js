import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import BASE_URL from '../backbone/Constant';

export const downloadLampiranFile = async (filename) => {
  try {
    const downloadUrl = `${BASE_URL}cuti/lampiran/${filename}`;
    const fileUri = FileSystem.documentDirectory + filename;

    console.log("🚀 Mulai download:", downloadUrl);

    const downloadResumable = FileSystem.createDownloadResumable(
      downloadUrl,
      fileUri
    );

    const result = await downloadResumable.downloadAsync();
    console.log("📄 Hasil download:", result);

    if (!result || !result.uri) {
      Alert.alert("Gagal", "Gagal mengunduh file.");
      return;
    }

    if (Platform.OS === 'android') {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        Alert.alert("Izin ditolak", "Tidak bisa akses penyimpanan.");
        return;
      }

      // CEK APAKAH FOLDER YANG DIPILIH ITU /Download
      if (permissions.directoryUri.includes("Download")) {
        Alert.alert(
          "Folder Ditolak",
          "Tidak bisa simpan langsung ke folder Download. Silakan pilih folder lain atau buat folder baru."
        );
        return;
      }

      const destUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        'application/pdf'
      );

      const fileContent = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.writeAsStringAsync(destUri, fileContent, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert("Berhasil", "File disimpan ke folder pilihan kamu!");
    } else {
       const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(result.uri, {
          UTI: 'com.adobe.pdf',
          mimeType: 'application/pdf',
        });
      } else {
        Alert.alert(
          "Gagal Membuka Share",
          "Perangkat ini tidak mendukung fitur berbagi file."
        );
      }
    }
  } catch (err) {
    console.error("❌ Gagal simpan file", err);
    Alert.alert("Error", "Gagal menyimpan file.");
  }
};
