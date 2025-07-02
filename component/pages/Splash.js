import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Pindah ke Login setelah 2 detik
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
         <View style={styles.circleTopRight} />
      <View style={styles.circleBottomLeft} />
      <Text style={styles.gs}>GS</Text>
      <Text style={styles.track}>Track</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#21376A', // warna biru tua latar
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gs: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 2,
  },
  track: {
    fontSize: 40,
    color: '#fff',
    zIndex: 2,
    marginTop: -5,
  },
  circleTopRight: {
    position: 'absolute',
    top: -70,
    right: -70,
    width: 200,
    height: 200,
    backgroundColor: '#2C4591',
    borderRadius: 100,
  },
  circleBottomLeft: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    backgroundColor: '#2C4591',
    borderRadius: 150,
    opacity: 0.7,
  },
});

