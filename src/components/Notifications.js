import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/chats/socket/SocketContext';

const Notifications = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);

  const host = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem('token');

  // 🔹 Fetch from MongoDB on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${host}/api/notification/`, {
          headers: {
            'auth-token': token
          }
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchNotifications();
  }, [host, token]);

  // 🔹 Socket.io listener for new notifications
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      console.log('New notification:', data);
      setNotifications(prev => [data, ...prev]);
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket]);

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      maxWidth: 300,
      zIndex: 1000
    }}>
      {notifications.map((note, i) => (
        <div key={i} style={{
          background: '#333',
          color: '#fff',
          padding: '10px',
          marginBottom: '5px',
          borderRadius: '5px'
        }}>
          {note.type === 'friend_request' && (
            <>👤 Friend request from <b>{note.senderUsername}</b></>
          )}
          {note.type === 'request_accepted' && (
            <>✅ <b>{note.senderUsername}</b> accepted your friend request</>
          )}
          {note.type === 'message' && (
            <>💬 New message from <b>{note.senderUsername}</b>: {note.message}</>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
