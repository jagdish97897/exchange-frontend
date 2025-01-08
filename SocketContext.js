import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { API_END_POINT } from './app.config';

export const SocketContext = createContext();

export const SocketProvider = ({ children, token }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (token) {
            const socketInstance = io(API_END_POINT, {
                query: {
                    token,
                },
            });
            setSocket(socketInstance);

            // Clean up on unmount
            return () => {
                socketInstance.disconnect();
                setSocket(null);
            };
        }
    }, [token]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
