// expoPushClient.js

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Minta izin dan ambil Expo Push Token
 * @returns {Promise<string|null>}
 */
export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.warn('❌ Harus di device fisik');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (finalStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('❌ Izin notifikasi ditolak');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('✅ Expo Push Token:', token);
  return token;
}

/**
 * Kirim notifikasi sederhana
 * @param {string} token Expo Push Token
 * @param {{ title: string, body: string }} notif
 */
export async function sendPushNotification(token, notif) {
  const message = {
    to: token,
    sound: 'default',
    title: notif.title,
    body: notif.body,
    data: {}, // bisa ditambahin nanti kalau mau
  };

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  const result = await response.json();
  console.log('📨 Notif terkirim:', result);
  return result;
}

/**
 * Optional: Listener buat masukin log atau interaksi
 */
export function setupNotificationListeners(onReceive, onResponse) {
  const notifListener = Notifications.addNotificationReceivedListener(onReceive);
  const respListener = Notifications.addNotificationResponseReceivedListener(onResponse);

  return () => {
    Notifications.removeNotificationSubscription(notifListener);
    Notifications.removeNotificationSubscription(respListener);
  };
}
