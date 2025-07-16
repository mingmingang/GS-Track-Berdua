// PushNotifContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import { registerForPushNotifications, sendPushNotification, setupNotificationListeners } from './ExpoClientPushNotification';

const PushNotifContext = createContext();

export const PushNotifProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    registerForPushNotifications().then(setToken);

    const cleanup = setupNotificationListeners(
      notif => console.log('📥 Notif diterima:', notif),
      resp => console.log('🧠 User klik notif:', resp)
    );

    return cleanup;
  }, []);

  return (
    <PushNotifContext.Provider value={{ token, sendPushNotification }}>
      {children}
    </PushNotifContext.Provider>
  );
};

export const usePushNotif = () => useContext(PushNotifContext);
