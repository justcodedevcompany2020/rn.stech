import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

const sendLocalNotification = async (title, body) => {
  // Создаем локальное уведомление
  PushNotification.localNotification({
    channelId: 'default-channel-id',
    title: title,
    message: body,
    android: {
      smallIcon: 'logo', // Drawable resource name for the collapsed notification icon
    },
  });
};

export default sendLocalNotification;
