import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotifications";

// interface NotificationContextType {
//     expoPushToken: string | null;
//     notification: Notifications.Notification | null;
//     error: Error | null;
// }

const NotificationContext = createContext(
    undefined
);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};

// interface NotificationProviderProps {
//     children: ReactNode;
// }

export const NotificationProvider = ({
    children,
}) => {
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [notification, setNotification] =
        useState(null);
    const [error, setError] = useState(null);
    const [notificationData, setNotificationData] = useState(null); // Store notification data


    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then(
            (token) => setExpoPushToken(token),
            (error) => setError(error)
        );

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log("🔔 Notification Received: ", notification.request.content.data);
                setNotification(notification);
                setNotificationData(notification.request.content.data); // Store data in state
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(
                    "🔔 Notification Response: ",
                    JSON.stringify(response, null, 2),
                    JSON.stringify(response.notification.request.content.data, null, 2)
                );
                // Handle the notification response here
                setNotification(response.notification);
                setNotificationData(response.notification.request.content.data);
            });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                );
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    return (
        <NotificationContext.Provider
            value={{ expoPushToken, notification, notificationData, error }}
        >
            {children}
        </NotificationContext.Provider>
    );
};