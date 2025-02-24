import React from "react";
import { AuthProvider } from "./context/AuthContext.js";
import { NotificationProvider } from "./context/NotificationContext.js";
import { LocationProvider } from "./context/LocationContext.js"; // Import your LocationProvider

const Providers = ({ children }) => {
    return (
        <AuthProvider>
            <NotificationProvider>
                <LocationProvider>{children}</LocationProvider>
            </NotificationProvider>
        </AuthProvider>
    );
};

export default Providers;
