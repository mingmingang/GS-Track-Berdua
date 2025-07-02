import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./component/pages/Home";
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
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useEffect, useCallback } from "react";
import Login from "./component/pages/Login";
import Splash from "./component/pages/Splash";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./component/backbone/AuthContext";
import Profile from "./component/pages/Profile/Profile";
import ForgotPassword from "./component/pages/ForgotPassword";
import './i18n';
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

            <Stack.Screen name="IDL" component={IDLScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="TambahIDL" component={TambahIDLScreen}  options={{ headerShown: false }}/>
            <Stack.Screen name="FilterIDL" component={FilterIDLScreen}  options={{ headerShown: false }}/>
            <Stack.Screen name="LihatIDL" component={DetailIDLScreen}  options={{ headerShown: false }}/>
            <Stack.Screen name="IMP" component={IMPScreen}  options={{ headerShown: false }} />
            <Stack.Screen name="TambahIMP" component={TambahIMPScreen}   options={{ headerShown: false }}/>
            <Stack.Screen name="FilterIMP" component={FilterIMPScreen}  options={{ headerShown: false }}/>
            <Stack.Screen name="LihatIMP" component={DetailIMPScreen}  options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </AuthProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
