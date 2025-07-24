import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import ChatReceiver from './ChatReceiver';
import { useLocation } from 'react-router-dom';
import RequestSidebar from './RequestSidebar';
import AcceptRequest from './AcceptRequest';
import { useSocket } from '../context/chats/socket/SocketContext';

const ChatSidebar = ({
    refreshGroups,
    onGroupCreated,
    chatList = [],
    groups = [],
    isMobile,
    selectedChat,
    setSelectedChat,
    users = [],
    sentRequests = new Set(),
    pendingRequests = new Set(),
    friends = new Set(),
    setSelectedUser,
    handleClick,
    cancelRequest,
    fetchUsers,
    hasMore,
    handleSkip,
    handleAccept,
    handleReject,
    user,
    setShowChatInfo,
}) => {
    const location = useLocation();
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const safeChatList = Array.isArray(chatList) ? chatList : [];
    const safeGroups = Array.isArray(groups) ? groups : [];
    const socket = useSocket(); 

    let displayChats = [];

    useEffect(() => {
        if (!socket) return;

        const handleUserOnlineStatus = (onlineUserIds) => {
            setOnlineUsers(new Set(onlineUserIds));
        };

        socket.on('user-online-status', handleUserOnlineStatus);

        return () => {
            socket.off('user-online-status', handleUserOnlineStatus);
        };
    }, [socket]);
    if (location.pathname === '/') {
        displayChats = [...safeChatList, ...safeGroups];
    } else if (location.pathname === '/groups') {
        displayChats = safeGroups;
    }

    if (selectedChat?.deletedFor?.includes?.(user._id)) {
        displayChats = displayChats.filter(chat => chat._id !== selectedChat?._id);
    }

    // Sort chats by latestMessage timestamp (descending)
    displayChats.sort((a, b) => {
        const timeA = new Date(a.latestMessage?.createdAt || a.updatedAt || 0).getTime();
        const timeB = new Date(b.latestMessage?.createdAt || b.updatedAt || 0).getTime();
        return timeB - timeA;
    });

    const pendingRequestsArray = Array.isArray(pendingRequests)
        ? pendingRequests
        : Array.from(pendingRequests);

    return (
        (!isMobile || !selectedChat) && (
            <div
                style={{
                    width: isMobile ? '100vw' : '350px',
                    maxWidth: isMobile ? '100vw' : '350px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: isMobile ? 'none' : '1px solid #ccc',
                    backgroundColor: '#5459AC',
                    boxSizing: 'border-box',
                }}

            >
                <Navbar refreshGroups={refreshGroups}
                    onGroupCreated={onGroupCreated} />

                {(location.pathname === '/' || location.pathname === '/groups') && (
                    <div
                        className="p-3"
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        <style>
                            {`
                                div::-webkit-scrollbar {
                                    display: none;
                                }
                            `}
                        </style>

                        <h5 className="text-white mb-3">Chats</h5>
                        <ul className="list-group">

                            {displayChats.map((item) => (
                                <li
                                    key={item._id}
                                    className="list-group-item my-2"
                                    onClick={() => {
                                        setSelectedChat(item);
                                        if (isMobile) setShowChatInfo(false); // <- close modal when clicking a chat
                                    }}
                                    style={{ cursor: 'pointer', borderRadius: 'inherit' }}
                                >
                                    {console.log('item',item)}
                                    <ChatReceiver
                                        isGroup={item.isGroupChat}
                                        lastMessageTime={item.latestMessage?.createdAt || ''}
                                        sent={
                                            localStorage.getItem('userId') === item.latestMessage?.sender?._id
                                                ? 'You :'
                                                : item.latestMessage?.sender?.username
                                                    ? `${item.latestMessage.sender.username} :`
                                                    : ''
                                        }
                                        avatar={
                                            item.isGroupChat
                                                ? item.avatar || '/avatars/hugging.png'
                                                : item.avatar || '/avatars/laughing.png'
                                        }
                                        name={item.isGroupChat ? item.chatName : item.username}
                                        latestMessage={
                                            item.latestMessage?.content ||
                                            (item.isGroupChat ? 'Group chat' : 'Tap to start chat')
                                        }
                                        unreadCount={item.unreadCount || 0}
                                        onlineUsers={onlineUsers}
                                        id={item.otherUserId}
                                    />

                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {location.pathname === '/arrequest' && (
                    <RequestSidebar
                        users={users}
                        sentRequests={sentRequests}
                        pendingRequests={pendingRequests}
                        friends={friends}
                        setSelectedUser={setSelectedUser}
                        handleClick={handleClick}
                        cancelRequest={cancelRequest}
                        fetchUsers={fetchUsers}
                        hasMore={hasMore}
                        isMobile={isMobile}
                        handleSkip={handleSkip}
                    />
                )}

                {location.pathname === '/friends' && (
                    <AcceptRequest
                        receivedRequests={pendingRequestsArray}
                        users={users}
                        setSelectedUser={setSelectedUser}
                        handleClick={handleClick}
                        fetchUsers={fetchUsers}
                        hasMore={hasMore}
                        isMobile={isMobile}
                        handleSkip={handleSkip}
                        handleAccept={handleAccept}
                        handleReject={handleReject}
                        setSelectedChat={setSelectedChat}
                    />
                )}
            </div>
        )
    );
};

export default ChatSidebar;
