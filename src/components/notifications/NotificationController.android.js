import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, Alert } from "react-native";
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, request, PERMISSIONS, RESULTS, openSettings } from "react-native-permissions";

const NotificationController = () => {

  const checkAllPermissions = async () => {
    const locationPermission = Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    });

    const notificationPermission = Platform.select({
      android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      ios: PERMISSIONS.IOS.NOTIFICATIONS,
    });

    // Define backgroundLocationPermission outside of the Platform.OS condition
    let backgroundLocationPermission;

    try {
      // Check and request location permission
      const locationStatus = await check(locationPermission);

      if (locationStatus === RESULTS.GRANTED) {
        console.log('ACCESS_FINE_LOCATION permission granted');
      } else {


       Alert.alert(
            'Внимание',
            'Для работы карты в приложение необходим доступ к локации!',
            [
              {
                text: 'Разрешить',
                onPress: () => {
                  console.log('Requesting ACCESS_FINE_LOCATION permission');
                  const locationRequestResult = request(locationPermission);

                  if (locationRequestResult === RESULTS.GRANTED) {
                    console.log('ACCESS_FINE_LOCATION permission granted');
                  } else {
                    console.log('ACCESS_FINE_LOCATION permission denied');
                  }
                },
              },
              {
                text: 'Отменить',
                onPress: () => {

                },
              },
            ],
        );

      }

      // Check and request background location permission (for Android 10 and above);

      // if (Platform.OS === 'android') {
      //   backgroundLocationPermission = PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
      //   const backgroundLocationStatus = await check(backgroundLocationPermission);
      //
      //   alert('backgroundLocationStatus')
      //   if (backgroundLocationStatus === RESULTS.GRANTED) {
      //     console.log('ACCESS_BACKGROUND_LOCATION permission granted');
      //   } else {
      //     console.log('Requesting ACCESS_BACKGROUND_LOCATION permission');
      //     const backgroundLocationRequestResult = await request(backgroundLocationPermission);
      //
      //     if (backgroundLocationRequestResult === RESULTS.GRANTED) {
      //       console.log('ACCESS_BACKGROUND_LOCATION permission granted');
      //     } else {
      //       console.log('ACCESS_BACKGROUND_LOCATION permission denied');
      //     }
      //   }
      // }

      // Check and request notification permission (for Android and iOS)
      const notificationStatus = await check(notificationPermission);

      if (notificationStatus === RESULTS.GRANTED) {
        console.log('NOTIFICATION permission granted');
      } else {
        console.log('Requesting NOTIFICATION permission');
        const notificationRequestResult = await request(notificationPermission);

        if (notificationRequestResult === RESULTS.GRANTED) {
          console.log('NOTIFICATION permission granted');
        } else {
          console.log('NOTIFICATION permission denied');
        }
      }

      // Continue with your existing code...

      // Open settings if all permissions are granted
      // const allPermissionsGranted = (
      //     (await check(locationPermission)) === RESULTS.GRANTED &&
      //     (await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)) === RESULTS.GRANTED &&
      //     (await check(notificationPermission)) === RESULTS.GRANTED &&
      //     (Platform.OS !== 'android' || (await check(backgroundLocationPermission)) === RESULTS.GRANTED)
      // );
      //
      // if (allPermissionsGranted) {
      //   console.log('All permissions granted, opening settings...');
      //   // openSettings();
      // }
    } catch (error) {
      console.error('Error checking or requesting permissions:', error);
    }
  };



  // const checkAllPermissions = async () => {
  //   const locationPermission = Platform.select({
  //     android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  //     ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  //   });
  //
  //   // Define backgroundLocationPermission outside of the Platform.OS condition
  //   let backgroundLocationPermission;
  //
  //   try {
  //     // Check and request location permission
  //     const locationStatus = await check(locationPermission);
  //
  //     if (locationStatus === RESULTS.GRANTED) {
  //       console.log('ACCESS_FINE_LOCATION permission granted');
  //     } else {
  //       console.log('Requesting ACCESS_FINE_LOCATION permission');
  //       const locationRequestResult = await request(locationPermission);
  //
  //       if (locationRequestResult === RESULTS.GRANTED) {
  //         console.log('ACCESS_FINE_LOCATION permission granted');
  //       } else {
  //         console.log('ACCESS_FINE_LOCATION permission denied');
  //       }
  //     }
  //
  //     // Check and request background location permission (for Android 10 and above)
  //     if (Platform.OS === 'android') {
  //       backgroundLocationPermission = PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
  //       const backgroundLocationStatus = await check(backgroundLocationPermission);
  //
  //       if (backgroundLocationStatus === RESULTS.GRANTED) {
  //         console.log('ACCESS_BACKGROUND_LOCATION permission granted');
  //       } else {
  //         console.log('Requesting ACCESS_BACKGROUND_LOCATION permission');
  //         const backgroundLocationRequestResult = await request(backgroundLocationPermission);
  //
  //         if (backgroundLocationRequestResult === RESULTS.GRANTED) {
  //           console.log('ACCESS_BACKGROUND_LOCATION permission granted');
  //         } else {
  //           console.log('ACCESS_BACKGROUND_LOCATION permission denied');
  //         }
  //       }
  //     }
  //
  //     // Check and request notification permission (for Android)
  //     if (Platform.OS === 'android') {
  //       const notificationPermission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
  //       const notificationStatus = await check(notificationPermission);
  //
  //       if (notificationStatus === RESULTS.GRANTED) {
  //         console.log('POST_NOTIFICATIONS permission granted');
  //       } else {
  //         console.log('Requesting POST_NOTIFICATIONS permission');
  //         const notificationRequestResult = await request(notificationPermission);
  //
  //         if (notificationRequestResult === RESULTS.GRANTED) {
  //           console.log('POST_NOTIFICATIONS permission granted');
  //         } else {
  //           console.log('POST_NOTIFICATIONS permission denied');
  //         }
  //       }
  //     }
  //
  //     // Check and request foreground and background location permissions using Expo Location
  //     // const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  //     // if (foregroundStatus !== 'granted') {
  //     //   console.log('Foreground location permission denied');
  //     //   return;
  //     // }
  //     //
  //     // if (Platform.OS === 'android') {
  //     //   const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  //     //   if (backgroundStatus !== 'granted') {
  //     //     console.log('Background location permission denied');
  //     //     return;
  //     //   }
  //     // }
  //
  //
  //     // Continue with your existing code...
  //
  //     // Open settings if all permissions are granted
  //     const allPermissionsGranted = (
  //         (await check(locationPermission)) === RESULTS.GRANTED &&
  //         (await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)) === RESULTS.GRANTED &&
  //         // (await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)) === RESULTS.GRANTED &&
  //         // (foregroundStatus === 'granted') &&
  //         (Platform.OS !== 'android' || (await check(backgroundLocationPermission)) === RESULTS.GRANTED)
  //     );
  //
  //     if (allPermissionsGranted) {
  //       // const { granted } = await Location.getBackgroundPermissionsAsync()
  //
  //       // backgroundService.startBackgroundLocationUpdate();
  //       // setTimeout(()=> {
  //       // backgroundService.stopBackgroundLocationUpdate();
  //       // }, 3000)
  //
  //       // console.log(granted, 'getBackgroundPermissionsAsync');
  //
  //
  //       console.log('All permissions granted, opening settings...');
  //       // openSettings();
  //     }
  //   } catch (error) {
  //     console.error('Error checking or requesting permissions:', error);
  //   }
  // };


  useEffect(()=>{
    const requestBackgroundLocationPermission = async () => {
      try {

        await checkAllPermissions();

      } catch (err) {
        console.warn(err);
      }
    };
    requestBackgroundLocationPermission();
  }, [])


  const saveTokenForUser = async (fcmToken) => {
    await AsyncStorage.setItem('fcmToken', fcmToken)
  }


  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const requestPermission = async () => {
    const checkPermission = await checkNotificationPermission();
    if (checkPermission !== RESULTS.GRANTED) {
      const requestResult = await requestNotificationPermission();
      if (requestResult !== RESULTS.GRANTED) {
        // Permission not granted
        console.log('Permission not granted');
      }
    }
  };




  useEffect(() => {

    messaging().requestPermission().then(() => {
      console.log('Notification permission granted.');
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {

      if (Platform.OS === 'ios') {

        // Запросите разрешение на отправку уведомлений
        PushNotificationIOS.requestPermissions();

        PushNotificationIOS.presentLocalNotification({
          alertTitle: remoteMessage.notification?.title,
          alertBody: remoteMessage.notification?.body,
          applicationIconBadgeNumber: 1,
        });
        console.log('Приложение открыто, пришел пуш на ios')
      } else {

        console.log('Приложение открыто, пришел пуш на android')
        PushNotification.createChannel(
          {
            channelId: 'channel-id1', // уникальный идентификатор канала уведомлений
            channelName: 'My channel', // название канала уведомлений
            channelDescription: 'A channel to categorise your notifications', // описание канала уведомлений
            soundName: 'default', // звук уведомлений (по умолчанию)
            importance: 4, // приоритет уведомлений (0 - 4, 4 - наивысший)
            vibrate: true, // включение вибрации
            icon: 'logo'
          },
          (created) => console.log(`createChannel returned '${created}'`), // обработчик успешного создания канала уведомлений
        );

        // Create a local notification
        PushNotification.localNotification({
          channelId: 'channel-id1',
          title: remoteMessage.notification?.title,
          message: remoteMessage.notification?.body,
          android: {
            smallIcon: "@drawable/logo", // Drawable resource name for the collapsed notification icon
          },
        });

      }

    });

    // Get the device token
    messaging().getToken().then((token) => {
        if (token) {
          saveTokenForUser(token)
          console.log('Device token:', token);
        }
      });

    // Check whether the app is running in the background or foreground
    const isAppInForeground = async () => {
      const state = await messaging().getAppState();
      return state === messaging().AppState.ACTIVE;
    };


    // If the app is in the foreground, handle notifications differently
    if (Platform.OS === 'ios') {
      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log('Notification caused app to open from background state: IOS', remoteMessage);

        // if (await isAppInForeground()) {
        //   // If the app is in the foreground, display the notification directly
        //   PushNotification.localNotification({
        //     title: remoteMessage.notification.title,
        //     message: remoteMessage.notification.body,
        //     channelId: 'default',
        //   });
        // } else {
        //   // If the app is in the background, wait for the user to click on the notification to display it
        //   console.log('Waiting for user to click on notification...');
        //   PushNotification.localNotification({
        //     title: remoteMessage.notification.title,
        //     message: remoteMessage.notification.body,
        //     channelId: 'default',
        //   });
        // }
      });
    } else {
      // If the app is in the foreground on Android, display the notification directly
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Приложение закрыто, пришел пуш на android');
        // actionAfterPush(remoteMessage)
        PushNotification.localNotification({
          title: remoteMessage.notification?.title,
          message: remoteMessage.notification?.body,
          channelId: 'default',
          android: {
            smallIcon: "@drawable/logo", // Drawable resource name for the collapsed notification icon
          },
        });

      });


      PushNotification.configure({
        onNotification: function (notification) {
          console.log('Tapped Notification:', notification);
          // const {navigation} = this.props;
          // if (notification?.data?.type == 'new_message') {
          //       this.props.navigation.navigate("SignUp");
          // }

          // (optional) Process the notification
          // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-push-notification-ios/push-notification-ios#finish)
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
      });


    }

    return unsubscribe;
  }, []);

  return null;
};

export default NotificationController;
