import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import { io } from "socket.io-client";

const WebSocketScreen = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Connect to the Socket.IO server
        const socketInstance = io("http://192.168.1.2:8000"); // Replace with your server URL
        setSocket(socketInstance);

        socketInstance.on("connect", () => {
            console.log("Connected to the server!", socketInstance.id);
        });

        socketInstance.on("newMessage", (message) => {
            console.log("New message received:", message);
            setMessages((prevMessages) => [...prevMessages, message.text]);
        });

        socketInstance.on("hny", (message1) => {
            console.log("New message received2:", message1);
            setMessages((prevMessages) => [...prevMessages, message1.text]);
        });

        socketInstance.on("disconnect", () => {
            console.log("Disconnected from the server.");
        });

        // Handle connection errors
        socketInstance.on("connect_error", (error) => {
            console.error("Connection error:", error);
        });

        // Clean up the connection on component unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (socket) {
            socket.emit("createMessage", { text: input });
            setInput(''); // Clear input field
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Socket.IO Example</Text>
            <View style={styles.messagesContainer}>
                {messages.map((msg, index) => (
                    <Text key={index} style={styles.message}>{msg}</Text>
                ))}
            </View>
            <TextInput
                style={styles.input}
                placeholder="Type a message"
                value={input}
                onChangeText={setInput}
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    messagesContainer: {
        flex: 1,
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        marginVertical: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default WebSocketScreen;
