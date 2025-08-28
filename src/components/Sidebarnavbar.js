import React from 'react';
import { Link } from 'react-router-dom';
import LoginBg from '../images/LoginBg.png';
import lilyapper from '../images/lilyapper.png';

const SidebarNavbar = ({ handleLogout }) => {
    const token = localStorage.getItem('token')
    return (
        <div
            className="d-flex flex-column flex-shrink-0 p-3 text-white"
            style={{
                width: '250px',
                height: '100vh',
                backgroundImage: `url(${LoginBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1040,
                objectFit:'cover'
            }}
        >
            <div className="navbar-brand m-0 p-0">
                <img
                    src={lilyapper}
                    alt="LilYapper"
                    style={{ height: '60px', width: "10rem", objectFit: 'cover' }}
                />
            </div>

            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item my-1">
                    <Link to="/" className="nav-link text-white">
                        <i className="fa-solid fa-message me-2"></i> Home
                    </Link>
                </li>
                <li className="nav-item my-1">
                    <Link to="/groups" className="nav-link text-white">
                        <i className="fa-solid fa-user-group me-2"></i> Groups
                    </Link>
                </li>
                <li className="nav-item my-1">
                    <Link to="/arrequest" className="nav-link text-white">
                        <i className="fa-solid fa-user-plus me-2"></i> Requests
                    </Link>
                </li>
                <li className="nav-item my-1">
                    <Link to="/friends" className="nav-link text-white">
                        <i className="fa-solid fa-handshake me-2"></i> Friends
                    </Link>
                </li>

                {(!token || token === undefined || token === null) ? (
                    <li className="nav-item my-1">
                        <Link to="/login" className="nav-link text-white">
                            <i className="fa-solid fa-right-to-bracket me-2"></i> Login
                        </Link>
                    </li>
                ) : (
                    <li className="nav-item my-1">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="nav-link text-white bg-transparent border-0 p-0 mx-3 my-2"
                        >
                            <i className="fa-solid fa-right-from-bracket me-2"></i> Logout
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default SidebarNavbar;
