import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Avatar from './Avatar';
import ThreeDotChatMenu from './ThreeDotChatMenu';

const UserBar = ({ name, avatar, setSelectedChat, onlineUsers, isGroup, hideBorder, selectedChat, onDeleteChat, setShowChatInfo, onRemoveFriend, setInspectedUser, setShowWallpaperModal, userStatus }) => {
    let isOnline = false;

    if (!isGroup && selectedChat?.otherUserId) {
        isOnline = onlineUsers.has(selectedChat.otherUserId);
    }
    const onlineCount = isGroup
        ? selectedChat.users.filter(u => onlineUsers.has(u._id)).length
        : 0;


    const location = useLocation();

    //const navigate= useNavigate()
    const handleClick = () => {
        if (typeof setShowChatInfo === 'function') {
            setShowChatInfo(true);
        } else {
            console.warn('setShowChatInfo is not a function:', setShowChatInfo);
        }
    }

    return (
        <nav
            className="navbar navbar-expand-lg sticky-top"
            style={{
                backgroundColor: '#52357B',
                paddingBottom: '0.25rem',  // add some padding bottom for space
                flexDirection: 'column',    // stack children vertically
                height: '60px',
                cursor: 'pointer',
                marginBottom: '1rem'
            }}
            onClick={handleClick}
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
                    <Avatar src={avatar} width="2" height="2" size="12" isGroup={isGroup} isOnline={isOnline} name={name} />

                </Link>

                <p className="navbar-brand my-1" style={{ color: 'white' }}>
                    {name}
                    {!isGroup && <span className='small mx-2' style={{ fontSize: '0.8rem', color: isOnline ? '#4CAF50' : '#E57373' }}>{isOnline ? 'Online' : 'Offline'}</span>}
                    {isGroup && (
                        <span className="small mx-2" style={{ fontSize: '0.8rem', color: '#B2D8CE' }}>
                            {onlineCount} online
                        </span>
                    )}
                </p>

                <div className="d-flex align-items-center ms-auto gap-5" id="navbarSupportedContent">
                    <Link to="/search" className="text-decoration-none" aria-label="New Chat" onClick={(e) => {
                        e.stopPropagation(); // Prevents click from reaching parent
                        console.log('Child clicked');
                    }}>
                        <i
                            className="fa-solid fa-magnifying-glass my-1"
                            style={{ fontSize: '1.4rem', color: location.pathname === '/search' ? '#B2D8CE' : 'white' }}
                        ></i>
                    </Link>
                    <ThreeDotChatMenu
                        isGroup={selectedChat.isGroupChat}
                        selectedChat={selectedChat}
                        onDeleteChat={onDeleteChat}
                        onContactInfo={() => setShowChatInfo(true)}
                        onCloseChat={() => setSelectedChat(null)}
                        onRemoveFriend={onRemoveFriend}
                        onDeleteGroup={onDeleteChat}
                        onLeaveGroup={() => console.log('Leave group')}
                        onGroupInfo={() => setShowChatInfo(true)}
                        setInspectedUser={setInspectedUser}
                        setShowWallpaperModal={setShowWallpaperModal}
                        isOnline={isOnline}
                    />
                </div>
            </div>
        </nav>
    );
};

export default UserBar;
