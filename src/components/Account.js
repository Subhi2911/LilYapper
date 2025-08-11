import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarNavbar from './Sidebarnavbar';

const Account = () => {
    const location = useLocation();
    const navigate = useNavigate();

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
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        navigate('/login');
    };
    return (
        <div>
            {/* Sidebar for medium and up */}
            <div className="d-none d-md-block">
                <SidebarNavbar handleLogout={handleLogout} />
            </div>

        </div>
    )
}

export default Account
