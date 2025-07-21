import React, { useContext, useState, useRef, useEffect } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import LoginBg from '../images/LoginBg.png';

const BellIcon = () => {
    const { notifications, markAllAsRead, unread } = useContext(NotificationContext);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const togglePanel = () => {
        setOpen(prev => {
            if (!prev) markAllAsRead();
            return !prev;
        });
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} style={{ minWidth: '40px' }}>
            <i
                className="fa-solid fa-bell text-white fs-5 mx-2 my-2"
                style={{ cursor: 'pointer' }}
                onClick={togglePanel}
            ></i>

            {unread && (
                <span
                    className="position-absolute translate-middle p-1 bg-danger border border-light rounded-circle"
                    style={{ zIndex: 1051, top: '20px', right: '120px' }}
                >
                    <span className="visually-hidden">unread messages</span>
                </span>
            )}

            {open && (
                <div
                    className="dropdown-menu show mt-2 p-2"
                    style={{
                        minWidth: '300px',
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        zIndex: 1050,
                        maxHeight: '400px',
                        overflowY: 'auto',
                        boxShadow: '0 0.5rem 1rem rgb(0 0 0 / 0.15)',
                        backgroundImage: `url(${LoginBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <h6 className="dropdown-header" style={{ color: 'white' }}>Notifications</h6>
                    {notifications.length === 0 ? (
                        <span className="dropdown-item " style={{ color: 'white' }}>No notifications</span>
                    ) : (
                        notifications.map(n => (
                            <div key={n._id} className="dropdown-item d-flex align-items-center" style={{ backgroundColor: 'white', borderRadius: 'inherit' }}>
                                {!n.isRead && (
                                    <span
                                        className="badge bg-danger rounded-circle me-2"
                                        style={{ width: '10px', height: '10px' }}
                                    ></span>
                                )}

                                <span>{n.message}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default BellIcon;
