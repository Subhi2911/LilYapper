import React from 'react';
import chatBg from '../images/ChatBg.png';
import UserBar from './UserBar';
import MessageBox from './MessageBox';
import Keyboard from './Keyboard';
import { useLocation } from 'react-router-dom';
import RequestWindow from './RequestWindow';

const ChatWindow = ({
    selectedChat,
    setSelectedChat,
    messages,
    isMobile,
    users,
    sentRequests,
    pendingRequests,
    friends,
    handleSkip,
    selectedUser,
    setSelectedUser
}) => {
    const location = useLocation();

    return (
        (!isMobile || (isMobile && selectedChat)) && (
            <div
                className="flex-grow-1 d-flex flex-column"
                style={{
                    backgroundImage: `url(${chatBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: isMobile ? '100vw' : 'auto',
                }}
            >
                {location.pathname === '/' && selectedChat && (
                    <>
                        <UserBar
                            name={
                                selectedChat.isGroupChat
                                    ? selectedChat.chatName
                                    : selectedChat.username
                            }
                            avatar={selectedChat?.avatar || '/avatars/laughing.png'}
                            setSelectedChat={setSelectedChat}
                        />
                        <div
                            className="flex-grow-1 overflow-auto hide-scrollbar w-100"
                            style={{ padding: '1rem', height: 'calc(100vh - 150px)' }}
                        >
                            <div
                                style={{
                                    backgroundColor: 'transparent',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                }}
                            >
                                <MessageBox messages={messages} />
                            </div>
                        </div>
                        <div
                            style={{
                                padding: '10px 16px',
                                position: 'relative',
                                zIndex: 10,
                                width: '100%',
                            }}
                        >
                            <Keyboard />
                        </div>
                    </>
                )}

                {(location.pathname === '/friends' || location.pathname === '/arrequest') && (
                    <RequestWindow
                        selectedUser={selectedChat}
                        setSelectedUser={setSelectedChat}
                        users={users}
                        sentRequests={sentRequests}
                        pendingRequests={pendingRequests}
                        friends={friends}
                        handleSkip={handleSkip}
                        isMobile={isMobile}
                        setSelectedChat={setSelectedChat} 
                    />
                )}

                {location.pathname !== '/' &&
                    location.pathname !== '/friends' &&
                    location.pathname !== '/arrequest' && (
                        <div className="text-center">
                            <img
                                src={require('../images/lilyapper.png')}
                                alt="lilyapper"
                                style={{ maxWidth: '300px', opacity: 0.8 }}
                            />
                            <h4>LilYapper - Because Silence is Boring</h4>
                            <p>A real-time chat application with private messaging, group chats, and online/offline status.</p>
                            <p className="text-muted mt-3">Select a chat to start messaging</p>
                        </div>
                )}
            </div>
        )
    );
};

export default ChatWindow;
