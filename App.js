import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import "./i18n";
import { LanguageProvider } from "./component/backbone/LanguageContext";
import { LanguageContext } from "./component/backbone/LanguageContext";

// Import Context
import { AuthContext, AuthProvider } from "./component/backbone/AuthContext";

// Import Screens
import Home from "./component/pages/Home";
import Login from "./component/pages/Login";
import Splash from "./component/pages/Splash";
import Profile from "./component/pages/Profile/Profile";
import ForgotPassword from "./component/pages/ForgotPassword";

// ... (Import semua layar Anda yang lain tetap di sini)
import CutiScreen from "./component/pages/Cuti/karyawan/Index";
import TambahCutiScreen from "./component/pages/Cuti/karyawan/Tambah";
import PembatalanCutiScreen from "./component/pages/Cuti/karyawan/Pembatalan";
import DetailCutiScreen from "./component/pages/Cuti/karyawan/Lihat";
import IDLScreen from "./component/pages/IDL/karyawan/Index";
import TambahIDLScreen from "./component/pages/IDL/karyawan/Tambah";
import FilterIDLScreen from "./component/pages/IDL/karyawan/Filter";
import DetailIDLScreen from "./component/pages/IDL/karyawan/Lihat";
import IMPScreen from "./component/pages/IMP/karyawan/Index";
import TambahIMPScreen from "./component/pages/IMP/karyawan/Tambah";
import FilterIMPScreen from "./component/pages/IMP/karyawan/Filter";
import DetailIMPScreen from "./component/pages/IMP/karyawan/Lihat";

{
  /* Import Menu Reimbursement Karyawan */
}
import ReimbursementScreen from "./component/pages/Reimbursement/Karyawan/Index";
import TambahReimbursementScreen from "./component/pages/Reimbursement/Karyawan/Tambah";
import PembatalanReimbursementScreen from "./component/pages/Reimbursement/Karyawan/Pembatalan";
import DetailReimbursementScreen from "./component/pages/Reimbursement/Karyawan/Lihat";

{
  /* Import Menu Reimbursement Atasan */
}
import ReimbursementScreenAtasan from "./component/pages/Reimbursement/Atasan/Index";
import LihatReimbursementAtasan from "./component/pages/Reimbursement/Atasan/Lihat";
import EditProfile from "./component/pages/Profile/EditProfile";
import ChangePassword from "./component/pages/Profile/ChangePassword";
import FaqScreen from "./component/pages/Profile/FAQs";
import LanguageScreen from "./component/pages/Profile/UbahBahasa";
import { initLanguage } from "./component/backbone/i18n";
import OnboardingScreen from "./component/pages/OnBoarding";
import NotificationScreen from "./component/pages/Notification";
import KehadiranScreen from "./component/pages/Kehadiran/Index";
import CameraScreen from "./component/pages/Camera";
import KalenderScreen from "./component/pages/Kalender";
import DokumenFolderScreen from "./component/pages/Dokumen/Index";
import AlamatAdd from "./component/pages/Profile/AlamatAdd";

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();

// 1. Tumpukan layar untuk pengguna yang BELUM LOGIN
const AuthStack = () => (
  <Stack.Navigator initialRouteName="Splash">
    <Stack.Screen
      name="Splash"
      component={Splash}
      options={{ animation: "fade", headerShown: false }}
    />
    <Stack.Screen
      name="Onboarding"
      component={OnboardingScreen}
      options={{ animation: "fade", headerShown: false }}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ animation: "fade", headerShown: false }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ animation: "fade", headerShown: false }}
    />
    <Stack.Screen
      name="Kehadiran"
      component={KehadiranScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="Kalender"
      component={KalenderScreen}
      options={{ animation: "fade", headerShown: false }}
    />
    <Stack.Screen
      name="Dokumen"
      component={DokumenFolderScreen}
      options={{ animation: "fade", headerShown: false }}
    />
    <Stack.Screen name="Checkin" options={{ headerShown: false }}>
      {(props) => (
        <CameraScreen
          {...props}
          mode="checkin"
          onSuccess={() => {
            console.log("✅ Berhasil checkin");
            navigation.navigate("Kalender");
          }}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="Checkout" options={{ headerShown: false }}>
      {(props) => (
        <CameraScreen
          {...props}
          mode="checkout"
          onSuccess={() => {
            console.log("✅ Berhasil checkout");
            navigation.navigate("Kalender");
          }}
        />
      )}
    </Stack.Screen>
    
    <Stack.Screen
      name="AlamatAdd"
      component={AlamatAdd}
      options={{ animation: "slide_from_right", headerShown: false }}
    />

    <Stack.Screen
      name="Notification"
      component={NotificationScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />

    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{ animation: "fade", headerShown: false }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="FAQs"
      component={FaqScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="UbahBahasa"
      component={LanguageScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    {/* Pindahkan semua layar lain ke sini */}
    <Stack.Screen
      name="Cuti"
      component={CutiScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="TambahCuti"
      component={TambahCutiScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="PembatalanCuti"
      component={PembatalanCutiScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="LihatCuti"
      component={DetailCutiScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="IDL"
      component={IDLScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="TambahIDL"
      component={TambahIDLScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="FilterIDL"
      component={FilterIDLScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="LihatIDL"
      component={DetailIDLScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="IMP"
      component={IMPScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="TambahIMP"
      component={TambahIMPScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="FilterIMP"
      component={FilterIMPScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="LihatIMP"
      component={DetailIMPScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />

    {/* Navigasi Menu Reimbursement Obat Karyawan */}
    <Stack.Screen
      name="ReimbursementKaryawan"
      component={ReimbursementScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="TambahReimbursement"
      component={TambahReimbursementScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="PembatalanReimbursement"
      component={PembatalanReimbursementScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="LihatReimbursement"
      component={DetailReimbursementScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />

    {/* Navigasi Menu Reimbursement Obat Atasan */}
    <Stack.Screen
      name="ReimbursementAtasan"
      component={ReimbursementScreenAtasan}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="LihatReimbursementAtasan"
      component={LihatReimbursementAtasan}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
  </Stack.Navigator>
);

// 3. Komponen utama yang memilih stack mana yang akan ditampilkan
const RootNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);
  const { language } = useContext(LanguageContext); // 🟢 Tambahkan ini

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    const prepareApp = async () => {
      await initLanguage();
    };
    prepareApp();
  }, []);

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

// 4. Komponen App utama yang sekarang lebih bersih
export default function App() {
  return (
    <>
      <AuthProvider>
        <LanguageProvider>
          <RootNavigator />
        </LanguageProvider>
      </AuthProvider>

      {/* Toast diletakkan di luar agar bisa tampil di atas semua layar */}
      <Toast />
    </>
  );
}
