import React from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import i18n from "../backbone/i18n"; // pastikan kamu sudah setup i18n

const { width } = Dimensions.get("window");
const slides = [
  {
    key: "slide1",
    titleKey: "onboarding_title1",
    textKey: "onboarding_text1",
    image: require("../../assets/onboarding1.png"),
  },
  {
    key: "slide2",
    titleKey: "onboarding_title2",
    textKey: "onboarding_text2",
    image: require("../../assets/onboarding2.png"),
  },
  {
    key: "slide3",
    titleKey: "onboarding_title3",
    textKey: "onboarding_text3",
    image: require("../../assets/onboarding3.png"),
  },
];


export default function OnboardingScreen({ navigation }) {
const renderItem = ({ item }) => (
  <View style={styles.slide}>
    <Image source={item.image} style={styles.image} resizeMode="contain" />
    <Text style={styles.title}>{i18n.t(item.titleKey)}</Text>
    <Text style={styles.text}>{i18n.t(item.textKey)}</Text>
  </View>
);


  return (
    <AppIntroSlider
      data={slides}
      renderItem={renderItem}
      onDone={() => navigation.replace("Login")}
      showSkipButton
      onSkip={() => navigation.replace("Login")}
      renderNextButton={() => <Text style={styles.button}>{i18n.t("onboarding_next")}</Text>}
      renderDoneButton={() => <Text style={styles.button}>{i18n.t("onboarding_done")}</Text>}
      renderSkipButton={() => <Text style={styles.buttonOutline}>{i18n.t("onboarding_skip")}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: width * 1.2,
    height: 300,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    marginTop: 30,
    textAlign: "center",
    color: "#21376A",
  },
  text: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginTop: 15,
    fontFamily: "Poppins_400Regular",
  },
  button: {
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#213b78ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    fontFamily: "Poppins_600SemiBold",
  },
  buttonOutline: {
    fontSize: 16,
    color: "#213b78ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontFamily: "Poppins_600SemiBold",
  },
});
