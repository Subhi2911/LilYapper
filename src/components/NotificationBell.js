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
                    className="dropdown-menu show mt-2 p-3"
                    style={{
                        minWidth: '320px',
                        maxWidth: '90vw',
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        zIndex: 1050,
                        maxHeight: '400px',
                        overflowY: 'auto',
                        backgroundImage: `url(${LoginBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backdropFilter: 'blur(6px)',
                        borderRadius: '10px',
                        color: 'white',
                        objectFit:'cover'
                    }}
                >
                    <h6 className="dropdown-header text-white">Notifications</h6>
                    {notifications.length === 0 ? (
                        <div className="dropdown-item text-info">No notifications</div>
                    ) : (

                        notifications.map(n => (
                            <div
                                key={n._id || n._tempId}
                                className="dropdown-item d-flex align-items-start"
                                style={{
                                    backgroundColor: n.isRead ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    marginBottom: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    lineHeight: '1.4',
                                    whiteSpace: 'normal',
                                    wordWrap: 'break-word',
                                    color: '#090040',
                                    display: 'flex',
                                    gap: '10px',

                                }}
                            >
                                {!n.isRead && (
                                    <span
                                        className="badge bg-danger rounded-circle"
                                        style={{ width: '10px', height: '10px', flexShrink: 0 }}
                                    ></span>
                                )}
                                <span>
                                    {n.type === 'friend_request' && (
                                    <>👤 Friend request from <b>{n.senderUsername}</b></>
                                )}
                                    {n.type === 'request_accepted' && (
                                        <>✅ <b>{n.senderUsername}</b> accepted your friend request</>
                                    )}
                                    {n.type === 'group_added' && (
                                        <>{n.message}<b></b> by <b>{n.senderUsername}</b></>
                                    )}
                                </span>
                                <small>{new Date(n.createdAt).toLocaleString()}</small>
                            </div>

                        ))
                    )}
                </div>
            )}

        </div>
    );
};

export default BellIcon;
