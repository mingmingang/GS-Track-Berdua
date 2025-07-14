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
import NotificationScreen from "./component/pages/Notifications";
import CameraScreen from "./component/pages/Camera";
import KalenderScreen from "./component/pages/Kalender";
import DokumenFolderScreen from "./component/pages/Dokumen/Index";
import AlamatAdd from "./component/pages/Profile/AlamatAdd";

const Stack = createNativeStackNavigator();


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{ animation: "fade", headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ animation: "fade", headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ animation: "fade", headerShown: false }}
            />
            <Stack.Screen
              name="Kalender"
              component={KalenderScreen}
              options={{ animation: "fade", headerShown: false }}
            />
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
              name="Profile"
              component={Profile}
              options={{ animation: "fade", headerShown: false }}
            />

            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{ animation: "slide_from_right", headerShown: false }}
            />
            <Stack.Screen name="Kehadiran" component={KehadiranScreen} options={{ headerShown: false }} />
            <Stack.Screen name="IDL" component={IDLScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="TambahIDL" component={TambahIDLScreen}  options={{ headerShown: false }}/>
            <Stack.Screen name="FilterIDL" component={FilterIDLScreen}  options={{ headerShown: false }}/>
            <Stack.Screen name="LihatIDL" component={DetailIDLScreen}  options={{ headerShown: false }}/>
            <Stack.Screen name="IMP" component={IMPScreen}  options={{ headerShown: false }} />
            <Stack.Screen name="TambahIMP" component={TambahIMPScreen}   options={{ headerShown: false }}/>
            <Stack.Screen name="FilterIMP" component={FilterIMPScreen}  options={{ headerShown: false }}/>
            <Stack.Screen name="LihatIMP" component={DetailIMPScreen}  options={{ headerShown: false }} />
            <Stack.Screen
              name="Checkin"
              options={{ headerShown: false }}
            >
              {(props) => (
                <CameraScreen
                  {...props}
                  mode="checkin" // atau "checkout"
                  onSuccess={() => {
                    console.log("✅ Berhasil checkin");
                    navigation.navigate('Kalender')
                  }}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Checkout"
              options={{ headerShown: false }}
            >
              {(props) => (
                <CameraScreen
                  {...props}
                  mode="checkout" 
                  onSuccess={() => {
                    console.log("✅ Berhasil checkout");
                    navigation.navigate('Kalender')
                  }}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </AuthProvider>

      {/* Toast diletakkan di luar agar bisa tampil di atas semua layar */}
      <Toast />
    </>
  );
}
