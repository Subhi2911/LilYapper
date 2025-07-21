import React, { useEffect, useState } from 'react';
import SidebarNavbar from './Sidebarnavbar';
import lilyapper from '../images/lilyapper.png'; // Adjust path as needed
import { Link, useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token', 'useId','user');
        navigate('/login');
    };

    const settingsOptions = [
        { icon: 'fa-user', label: 'Account' ,to:'account'},
        { icon: 'fa-lock', label: 'Privacy' , to:'privacy' },
        { icon: 'fa-bell', label: 'Notifications', to:'notifysettings'},
        { icon: 'fa-circle-question', label: 'Help' , to:'help'},
        { icon: 'fa-right-from-bracket', label: 'Logout', danger: true, logout: true },
    ];

    const host = process.env.REACT_APP_BACKEND_URL;
    const [user, setUser] = useState({
        avatar: '',
        username: '',
        bio: '',
        dateOfJoining: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${host}/api/auth/getuser`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token')
                    }
                });

                const data = await res.json();
                setUser({
                    avatar: data.user.avatar,
                    username: data.user.username,
                    bio: data.user.bio,
                    dateOfJoining: data.user.date
                        ? new Date(data.user.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })
                        : 'N/A'
                });

            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="d-flex flex-column flex-md-row">
            {/* Sidebar only shown on medium and above screens */}
            <div className="d-none d-md-block">
                <SidebarNavbar handleLogout={handleLogout} />
            </div>

            {/* Mobile header */}
            <div className="d-md-none d-flex align-items-center  px-3 py-2 border-bottom body">
                <button className="btn btn-outline-dark text-decoration-none" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <img src={lilyapper} alt="Lilyapper" style={{height:'4rem', width:'6rem'}} />
            </div>

            {/* Settings Content */}
            <div className="flex-grow-1 p-3 body" style={{ marginTop: '20px' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    {/* Search Bar */}
                    <input
                        type="text"
                        className="form-control mb-4"
                        placeholder="Search settings..."
                    />

                    {/* Profile Section */}
                    <div className="d-flex align-items-center mb-4" >
                        <img
                            src={user.avatar || './avatars/laughing.png'}
                            alt="Profile"
                            className="rounded-circle"
                            width="80"
                            height="80"
                        />
                        <div className="ms-3">
                            <h5 className="mb-1 ">{user.username}</h5>
                            <p className="mb-0 text-muted">{user.bio}</p>
                        </div>
                    </div>

                    <hr />

                    {/* Settings Options in 2 Columns */}
                    <div className="row g-3" >
                        {settingsOptions.map((option, index) => (
                            <div className="col-12 col-md-6" key={index} >
                                <div
                                    className={`p-3 border rounded d-flex align-items-center ${
                                        option.danger ? 'text-danger' : ''
                                    }`}
                                    style={{ cursor: option.logout ? 'pointer' : 'default',backgroundColor:'white'}}
                                    onClick={option.logout ? handleLogout : undefined}
                                >
                                    <i className={`fa-solid ${option.icon} me-2`}></i>
                                    <Link  to={`/${option.to}`} className="text-decoration-none text-dark">{option.label}</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
