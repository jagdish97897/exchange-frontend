import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import { io } from "socket.io-client";
import { API_END_POINT } from '../app.config';

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

export const sendMessage = () => {
    if (socketInstance) {
        socketInstance.emit("createMessage", { text: input });
    }
};

