import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarNavbar from './Sidebarnavbar';
import Avatar from './Avatar';

const Account = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = location.pathname === '/profile' ? '#648DB3' : '';
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setUser(storedUser);
        return () => { document.body.style.backgroundColor = ''; };
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure? This will permanently delete your account!")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/delete`, {
                method: 'DELETE',
                headers: { 'auth-token': token }
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                localStorage.clear();
                navigate('/login');
            } else {
                alert(data.error || "Failed to delete account");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };

    const handleBack = () => navigate(-1);

    if (!user) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="d-flex">
            {/* Sidebar for medium+ */}
            <div className="d-none d-md-block">
                <SidebarNavbar handleLogout={handleLogout} />
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 p-3 body" style={{ marginLeft: '0', marginTop: '20px' }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    
                    {/* Top Mobile Back */}
                    <div className="d-flex align-items-center mb-4">
                        <button
                            className="btn btn-outline-dark me-3"
                            onClick={handleBack}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <h4 className="ms-3 mb-0">Account</h4>
                    </div>

                    {/* Profile Card */}
                    <div className={`bg-light p-4 rounded shadow-sm body ${darkMode ? 'bg-dark text-white' : ''}`}>
                        <div className="text-center">
                            <div className='d-flex justify-content-center'>
                                <Avatar src={user?.avatar || "/avatars/laughing.png"} size={120} isGroup={false} isOnline={true} name={user?.username}/>
                            </div>
                            <h3 className="mt-3">{user?.username}</h3>
                            {user.bio && <p style={{ fontStyle: 'italic', opacity: 0.8 }}>{user.bio}</p>}
                            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                            <p><strong>Date Joined:</strong> {new Date(user.date || Date.now()).toLocaleDateString()}</p>
                        </div>

                        {/* Action buttons stacked like Privacy page */}
                        <div className="d-flex flex-column gap-2 mt-4">
                            <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                                Edit Profile
                            </button>
                            <button className="btn btn-warning" onClick={() => navigate('/profile/change-password')}>
                                Change Password
                            </button>
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Logout
                            </button>
                            <button className="btn btn-outline-danger" onClick={handleDeleteAccount}>
                                Delete Account
                            </button>
                        </div>

                        {/* Dark mode toggle */}
                        <div className="mt-3 d-flex align-items-center justify-content-center">
                            <label className="form-check-label me-2">Dark Mode:</label>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                            />
                        </div>

                        {/* Recent activity */}
                        <div className="mt-4">
                            <h5>Recent Activity</h5>
                            <ul className="list-group" style={{ maxHeight: 150, overflowY: 'auto', paddingRight: '5px' }}>
                                <li className="list-group-item">Joined group "Techies"</li>
                                <li className="list-group-item">Sent a new message in "General"</li>
                                <li className="list-group-item">Updated profile bio</li>
                                <li className="list-group-item">Changed password</li>
                                <li className="list-group-item">Joined group "Designers"</li>
                                <li className="list-group-item">Edited profile picture</li>
                                <li className="list-group-item">Updated email</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
