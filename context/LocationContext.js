import React, { createContext, useContext, useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { useAuth } from "./AuthContext"; // Import AuthContext to check user role

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const { user } = useAuth(); // Get user info from AuthContext

    const getLocationAndSend = async () => {
        try {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) return;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    console.log("Updated Location:", latitude, longitude);
                    // Send to backend if needed
                },
                (error) => console.error("Location Error:", error),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
            );
        } catch (error) {
            console.log("Error fetching location:", error);
        }
    };

    useEffect(() => {
        let interval;

        if (user?.role === "driver") {
            // Only start location updates if the user is a driver
            interval = setInterval(() => {
                getLocationAndSend();
            }, 3 * 60 * 1000);
        }

        return () => clearInterval(interval);
    }, [user?.role]); // Re-run when user role changes

    return (
        <LocationContext.Provider value={location}>{children}</LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);

// Function to request location permissions (for Android)
const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
};
