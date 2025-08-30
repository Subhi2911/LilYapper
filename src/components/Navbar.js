import React, { useRef, useState } from 'react';
import lilyapper from '../images/lilyapper.png';
import { useLocation, useNavigate } from 'react-router-dom';
import VerticalThinNavbar from './VerticalThinNavbar';
import NewChatModal from './NewChatModal';
import ThreeDotsMenu from './ThreeDotsMenu';
import NewGroupModal from './NewGroupModal';
import NotificationBell from './NotificationBell';
import OffCanvasNavbar from './OffCanvasNavbar';

const Navbar = ({refreshGroups, onGroupCreated, setSelectedChat, setProgress, onChatCreated}) => {
    const offcanvasLeftRef = useRef();
    const location = useLocation();
    //const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [groups, setGroups] = useState([]);

    const options = [
        { label: 'New Group', action: () => setShowGroupModal(true) },
        { label: 'Settings', action: () => navigate('/settings') },
        {
            label: 'Logout', action: () => {
                localStorage.removeItem('token');
                navigate('/login');
            }
        },
    ];

    const handleSelect = (option) => {
        if (option.action) option.action();
    };
    const closeOffcanvasleft = () => {
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasLeftRef.current);
        if (bsOffcanvas) bsOffcanvas.hide();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('useId');
        localStorage.removeItem('user');
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
                            <NotificationBell/>

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
                            <ThreeDotsMenu options={options} onSelect={handleSelect} />
                        </div>
                    </div>
                </nav>

                {/* Left Sidebar Offcanvas */}
                <OffCanvasNavbar handleLogout={handleLogout}  closeOffcanvasleft={closeOffcanvasleft} offcanvasLeftRef={offcanvasLeftRef} />

            {/* Thin Navbar on large and medium screens */}
            <div className="d-none d-md-block d-lg-flex flex-column align-items-center">
                <VerticalThinNavbar setProgress={setProgress}/>
            </div>

            {/* New Chat Modal */}
            <NewChatModal isOpen={showModal} onClose={() => setShowModal(false)} setSelectedChat={setSelectedChat} onChatCreated={onChatCreated} />
            <NewGroupModal
                isOpen={showGroupModal}
                onClose={() => setShowGroupModal(false)}
                onGroupCreated={onGroupCreated}
                refreshGroups={refreshGroups}
                //setSelectedChat={setSelectedChat}
            />
            </div>
        </>
    );
};

export default Navbar;
