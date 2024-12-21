import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import { io } from "socket.io-client";

let socketInstance;


export const getSocket = (token) => {
    if (!socketInstance) {
        socketInstance = io("http://192.168.1.9:8000", {
            query: { token },
        });
    }
    return socketInstance;
};

export const closeSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};
// const SocketIO = (token) => {

//     // Connect to the Socket.IO server
//     socketInstance = io("http://192.168.1.9:8000", { query: { token } });

//     socketInstance.on("connect", () => {
//         console.log("Connected to the server!", socketInstance.id);
//     });

//     socketInstance.on("newMessage", (message) => {
//         console.log("New message received:", message);
//     });



//     socketInstance.on("disconnect", () => {
//         console.log("Disconnected from the server.");
//     });

//     // Handle connection errors
//     socketInstance.on("connect_error", (error) => {
//         console.error("Connection error:", error);
//     });

//     // Clean up the connection on component unmount
//     return () => {
//         socketInstance.disconnect();
//     };
// };

const sendMessage = () => {
    if (socketInstance) {
        socketInstance.emit("createMessage", { text: input });
    }
};

export { sendMessage };
