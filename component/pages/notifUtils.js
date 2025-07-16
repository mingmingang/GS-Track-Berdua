import { sendPushNotification } from "./ExpoClientPushNotification";

// Fungsi reusable di luar komponen
export function pushNotifKeUser(token,title,body) {
    console.log("pesannn");
    if (!token) {
        console.warn('❌ Token kosong bro!');
        return;
    }

    return sendPushNotification(token, { title, body });
}
