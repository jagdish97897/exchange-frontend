import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import { io } from "socket.io-client";
import { API_END_POINT } from '../app.config';

// socket.js

let socket = null;

export const initializeSocket = (token) => {
    if (!socket) {
        socket = io(`${API_END_POINT}`, {
            query: {
                token: token,
            },
        });

        if (socket) {
            console.log('socket connected');
        }
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        throw new Error('Socket not initialized. Call initializeSocket(token) first.');
    }
    return socket;
};

export const closeSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

// const SocketIO = (token) => {

//     // Connect to the Socket.IO server
//     socketInstance = io(`${API_END_POINT}`, { query: { token } });

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

export const sendMessage = () => {
    if (socketInstance) {
        socketInstance.emit("createMessage", { text: input });
    }
};

