import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Avatar from './Avatar';

const UserBar = ({ name, avatar, setSelectedChat, isOnline }) => {
    const location = useLocation();

    return (
        <nav
            className="navbar navbar-expand-lg"
            style={{
                backgroundColor: '#52357B',
                paddingBottom: '0.25rem',  // add some padding bottom for space
                flexDirection: 'column',    // stack children vertically
                height: '56px'              // let height expand for 2 lines
            }}
        >
            {/* First row with avatar, name, icons */}
            <div className="container-fluid d-flex align-items-center w-100" style={{ paddingBottom: 0 }}>
                <div className="d-block d-md-none">
                    <button
                        className="btn"
                        onClick={() => setSelectedChat(null)}
                        style={{ padding: '0' }}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                </div>

                <Link
                    to="/profile"
                    title="Profile"
                    className="my-1 mx-3"
                    style={{
                        fontSize: '1.5rem',
                        marginBottom: '20px',
                        textDecoration: 'none',
                    }}
                >
                    <Avatar src={avatar} width="2" height="2" size="12" />
                    
                </Link>

                <p className="navbar-brand my-1" style={{ color: 'white' }}>
                    {name} <span class='small' style={{ fontSize: '0.8rem', color: isOnline ? '#4CAF50' : '#E57373' }}>{isOnline ? 'Online' : 'Offline'}</span>
                </p>

                <div className="d-flex align-items-center ms-auto gap-5" id="navbarSupportedContent">
                    <Link to="/search" className="text-decoration-none" aria-label="New Chat">
                        <i
                            className="fa-solid fa-magnifying-glass"
                            style={{ fontSize: '1.4rem', color: location.pathname === '/search' ? '#B2D8CE' : 'white' }}
                        ></i>
                    </Link>

                    <Link to="/moreoptions" className="text-decoration-none" aria-label="More Options">
                        <i
                            className="fa-solid fa-ellipsis-vertical mx-2"
                            style={{ fontSize: '1.4rem', color: location.pathname === '/moreoptions' ? '#B2D8CE' : 'white' }}
                        ></i>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default UserBar;
