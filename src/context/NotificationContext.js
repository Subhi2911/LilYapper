import React, { createContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(false);
    const host = process.env.REACT_APP_BACKEND_URL

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${host}/api/notifications/notifications`, {
                method:'GET',
                headers: { 'auth-token': localStorage.getItem('token') }
            });
            const data = await res.json();
            if (data.success) {
                setNotifications(data.notifications);
                setUnread(data.notifications.some(n => !n.isRead)); // use isRead here
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(`${host}/api/notifications/notifications/mark-read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))); // use isRead here
                setUnread(false);
            }
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        }
    };


    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, fetchNotifications, markAllAsRead, unread }}>
            {children}
        </NotificationContext.Provider>
    );
};

export { NotificationContext, NotificationProvider };
