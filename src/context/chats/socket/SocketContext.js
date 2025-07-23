import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Create the Context
const SocketContext = createContext(null);

// Provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const host = process.env.REACT_APP_BACKEND_URL

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn("No token found, socket not initialized.");
      return;
    }

    const newSocket = io(host, {
      auth: {
        token,
      },
      transports: ['websocket'], // enforce websocket
      reconnection: true,        // optional: enables auto-reconnect
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook to use socket
export const useSocket = () => {
  return useContext(SocketContext);
};
