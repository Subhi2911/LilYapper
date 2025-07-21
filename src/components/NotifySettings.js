import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavbar from './Sidebarnavbar';


const NotifySettings = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleBack = () => {
        navigate(-1);
    };

    const [notifications, setNotifications] = useState({
        messages: true,
        friendRequests: true,
        groupInvites: false,
        sound: true,
        vibration: false
    });

    const toggleSetting = (key) => {
        setNotifications((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="d-flex">
            {/* Sidebar only on medium+ screens */}
            <div className="d-none d-md-block">
                <SidebarNavbar handleLogout={handleLogout} />
            </div>

            {/* Main content */}
            <div className="flex-grow-1 p-3 body" style={{ marginLeft: '0', marginTop: '20px' }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    {/* Top bar */}
                    <div className="d-flex align-items-center mb-4">
                        <button className="btn btn-outline-dark me-3" onClick={handleBack}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        
                        <h4 className="ms-3 mb-0">Notification Settings</h4>
                    </div>

                    {/* Switch List */}
                    <ul className="list-group gap-3">
                        {[
                            { key: 'messages', label: 'Messages' },
                            { key: 'friendRequests', label: 'Friend Requests' },
                            { key: 'groupInvites', label: 'Group Invites' },
                            { key: 'sound', label: 'Sound Alerts' },
                            { key: 'vibration', label: 'Vibration' }
                        ].map(({ key, label }) => (
                            <li
                                key={key}
                                className="list-group-item d-flex justify-content-between align-items-center border rounded"
                            >
                                <span>{label}</span>
                                <div className="form-check form-switch m-0">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={key}
                                        checked={notifications[key]}
                                        onChange={() => toggleSetting(key)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NotifySettings;
