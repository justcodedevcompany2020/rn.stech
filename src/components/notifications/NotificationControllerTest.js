import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { check, request, PERMISSIONS, RESULTS, openSettings } from "react-native-permissions";

const NotificationControllerTest = () => {

  useEffect(() => {
    // Запросить разрешения на получение push-уведомлений
    const requestPermissions = async () => {
      const notificationPermission = Platform.select({
        android: PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ios: PERMISSIONS.IOS.NOTIFICATIONS,
      });
      const status = await check(notificationPermission);
      if (status !== RESULTS.GRANTED) {
        const granted = await request(notificationPermission);
        if (!granted) {
          console.warn('Push notifications permission denied');
          return;
        }
      }
    };
    requestPermissions();

    // Подписаться на получение push-уведомлений
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Push-уведомление получено:', remoteMessage);
      // Обработать уведомление (показать локальное уведомление, обновить UI и т.д.)
      PushNotification.localNotification({
        title: remoteMessage.notification?.title,
        message: remoteMessage.notification?.body,
        channelId: 'default',
      });
    });

    // Получить идентификатор устройства (необязательно)
    messaging().getToken().then((token) => {
      console.log('Token устройства:', token);
    });

    return () => unsubscribe();
  }, []);

  return null; // Верните нулевой компонент, чтобы PushNotificationComponent не влиял на отрисовку
};

export default NotificationControllerTest;
