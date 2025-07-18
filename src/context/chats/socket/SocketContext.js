import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Create the Context
const SocketContext = createContext(null);

// Provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect socket to backend URL (adjust if needed)
    const newSocket = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token'), // pass JWT token if you use auth
      },
      transports: ['websocket'],
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context easily
export const useSocket = () => {
  return useContext(SocketContext);
};
