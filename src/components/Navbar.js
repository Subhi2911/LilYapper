import React, { useRef, useState } from 'react';
import lilyapper from '../images/lilyapper.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import VerticalThinNavbar from './VerticalThinNavbar';
import NewChatModal from './NewChatModal';

const Navbar = () => {
    const offcanvasLeftRef = useRef();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const closeOffcanvasleft = () => {
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasLeftRef.current);
        if (bsOffcanvas) bsOffcanvas.hide();
    };

    const handleLogout = () => {
        localStorage.removeItem('token','useInfo');
        navigate('/login');
    };

    return (
        <>
            <div>
                <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#52357B', minWidth: '350px', borderRight: '0.5px solid white' }}>
                    <div className="container-fluid d-flex align-items-center justify-content-start gap-3">
                        <div
                            type="button"
                            className="d-md-none"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasExample"
                            aria-controls="offcanvasExample"
                            style={{ cursor: 'pointer' }}
                        >
                            <i className="fa-solid fa-bars fs-5 text-white"></i>
                        </div>

                        <div className="navbar-brand m-0 p-0">
                            <img
                                src={lilyapper}
                                alt="LilYapper"
                                style={{ height: '40px', width: "7rem", objectFit: 'cover' }}
                            />
                        </div>

                        <div className="d-flex align-items-center ms-auto gap-4" id="navbarSupportedContent">
                            {/* Notification Icon */}
                            <Link
                                to="/notification"
                                className="text-decoration-none"
                                style={{ color: location.pathname === '/notification' ? '#B2D8CE' : 'white' }}
                                aria-label="Notification"
                            >
                                <i className="fa-solid fa-bell" style={{ fontSize: '1.3rem' }}></i>
                            </Link>

                            {/* New Chat Modal Trigger */}
                            <button
                                type="button"
                                className="btn btn-link text-decoration-none"
                                style={{ color: location.pathname === '/newchat' ? '#B2D8CE' : 'white', fontSize: '1.3rem' }}
                                onClick={() => setShowModal(true)}
                                aria-label="New Chat"
                            >
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>


                            {/* More Options */}
                            <Link
                                to="/more"
                                className="text-decoration-none"
                                style={{ color: location.pathname === '/more' ? '#B2D8CE' : 'white' }}
                                aria-label="More Options"
                            >
                                <i className="fa-solid fa-ellipsis-vertical mx-1" style={{ fontSize: '1.3rem' }}></i>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Left Sidebar Offcanvas */}
                <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" ref={offcanvasLeftRef} style={{ backgroundColor: '#648DB3' }}>
                    <div className="offcanvas-header">
                        <i className="fa-solid fa-bars fs-5 mx-3" style={{ cursor: 'pointer' }} onClick={closeOffcanvasleft}></i>
                        <h5 className="offcanvas-title" id="offcanvasExampleLabel">LilYapper</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="list-group">
                            <li className="list-group-item border-top my-2">
                                <i className="fa-solid fa-message mx-3"></i>
                                <Link onClick={closeOffcanvasleft} to="/" className="text-decoration-none text-dark">Home</Link>
                            </li>
                            <li className="list-group-item border-top my-2">
                                <i className="fa-solid fa-user-group mx-3"></i>
                                <Link onClick={closeOffcanvasleft} to="/groups" className="text-decoration-none text-dark">Groups</Link>
                            </li>
                            <li className="list-group-item border-top my-2">
                                <i className="fa-solid fa-user-plus mx-3"></i>
                                <Link onClick={closeOffcanvasleft} to="/arrequest" className="text-decoration-none text-dark">Requests</Link>
                            </li>
                            <li className="list-group-item border-top my-2">
                                <i className="fa-solid fa-handshake mx-3"></i>
                                <Link onClick={closeOffcanvasleft} to="/friends" className="text-decoration-none text-dark">Friends</Link>
                            </li>

                            {(!token || token === undefined || token === null) ? (
                                <li className="list-group-item border-top my-2">
                                    <i className="fa-solid fa-right-to-bracket mx-3"></i>
                                    <Link onClick={closeOffcanvasleft} to="/login" className="text-decoration-none text-dark">Login</Link>
                                </li>
                            ) : (
                                <li className="list-group-item border-top my-2">
                                    <i className="fa-solid fa-right-from-bracket mx-3"></i>
                                    <button type="button" onClick={() => { handleLogout(); closeOffcanvasleft(); }} className="text-dark text-decoration-none" style={{ border: 'none', backgroundColor: 'transparent', padding: '0' }}>Logout</button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Thin Navbar on large screens */}
            <div className="d-none d-lg-flex flex-column align-items-center">
                <VerticalThinNavbar />
            </div>

            {/* New Chat Modal */}
            <NewChatModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};

export default Navbar;
