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
        const res = await fetch(`${host}/api/notifications/notifications`, {
          method: "GET",
          headers: {
            'auth-token': token
          }
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications.map(note => ({
            ...note,
            _tempId: Date.now() + Math.random(),
            fromSocket: false, // ✅ this is a fetched (old) notification
          })));
        }
        else {
          console.error("Failed to fetch notifications");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchNotifications();
  }, [host, token]);

  // 🔹 Handle incoming notifications
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      const notification = {
        ...data,
        _tempId: Date.now() + Math.random(),
        fromSocket: true, // real-time notification
      };

      setNotifications(prev => [notification, ...prev]);

      // Auto-remove only if real-time
      setTimeout(() => {
        setNotifications(prev =>
          prev.filter(n => n._tempId !== notification._tempId)
        );
      }, 5000);
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket]);

  // ❌ Manual remove handler
  const handleRemove = (_tempId) => {
    setNotifications(prev => prev.filter(n => n._tempId !== _tempId));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      maxWidth: 300,
      zIndex: 1023,
    }}>
      {notifications.filter(n => n.fromSocket).map((note) => (
        <div key={note._tempId} style={{
          position: 'relative',
          background: 'darkblue',
          color: '#fff',
          padding: '10px 30px 10px 10px',
          marginBottom: '5px',
          borderRadius: '5px',
          zIndex: '1021'
        }}>
          {/* ❌ Close button */}
          <span
            onClick={() => handleRemove(note._tempId)}
            style={{
              position: 'absolute',
              top: 4,
              right: 8,
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '16px'
            }}
          >
            X
          </span>
            {console.log(note)}
          {note.type === 'friend_request' && (
            <>👤 Friend request from <b>{note.senderUsername}</b></>
          )}
          {note.type === 'request_accepted' && (
            <>✅ <b>{note.senderUsername}</b> accepted your friend request</>
          )}
          {note.type === 'message' && (
            <>💬 New message from <b>{note.senderUsername}</b>: <i>{note.message}</i></>
          )}
          {note.type === 'group_added' && (
            <>{note.message}<b></b> by <b>{note.senderUsername}</b></>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
