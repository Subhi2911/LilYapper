import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarNavbar from './Sidebarnavbar';
import UserInfo from './UserInfo';
import ChooseAvatar from './ChooseAvatar';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const host = process.env.REACT_APP_BACKEND_URL
    const [user, setUser] = useState({
        avatar: '',
        username: '',
        bio: '',
        dateOfJoining: ''
    });


    useEffect(() => {
        if (location.pathname === '/profile') {
            document.body.style.backgroundColor = '#648DB3';
        } else {
            document.body.style.backgroundColor = '';
        }
        // Cleanup function to reset background on unmount or route change
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, [location.pathname]);
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
                console.log(data)
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
    }, [host]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* Sidebar for medium and up */}
            <div className="d-none d-md-block">
                <SidebarNavbar handleLogout={handleLogout} />
            </div>

            {/* Main content */}
            <div
                className="flex-grow-1 p-4"
                style={{ maxWidth: 600, margin: '0 auto', width: '100%' }}
            >
                <ChooseAvatar userAvatar={user.avatar} />
                <UserInfo />
            </div>
        </div>
    );
};

export default Profile;
