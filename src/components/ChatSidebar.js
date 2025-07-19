import React from 'react';
import Navbar from './Navbar';
import ChatReceiver from './ChatReceiver';
import { useLocation } from 'react-router-dom';
import RequestSidebar from './RequestSidebar';
import AcceptRejectRequests from './AcceptRequest';

const ChatSidebar = ({
    chatList,
    isMobile,
    selectedChat,
    setSelectedChat,
    users,
    sentRequests,
    pendingRequests,
    friends,
    setSelectedUser,
    handleClick,
    cancelRequest,
    fetchUsers,
    hasMore,
    handleSkip,
    receivedRequests,
    handleAccept,
    handleReject
}) => {
    const location = useLocation();

    return (
        (!isMobile || !selectedChat) && (
            <div
                style={{
                    width: isMobile ? '100vw' : '350px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: isMobile ? 'none' : '1px solid #ccc',
                    backgroundColor: '#5459AC',
                }}
            >
                <Navbar />
                {location.pathname === '/' && (
                    <>
                        <div className="p-3 overflow-auto" style={{ flex: 1 }}>
                            <h5 className="text-white mb-3">Chats</h5>
                            <ul className="list-group">
                                {chatList.map((item) => (
                                    <li
                                        key={item._id}
                                        className="list-group-item my-2"
                                        onClick={() => setSelectedChat(item)}
                                        style={{ cursor: 'pointer', borderRadius: 'inherit' }}
                                    >
                                        <ChatReceiver
                                            avatar={
                                                item.isGroupChat
                                                    ? item?.avatar || '/avatars/group.png'
                                                    : item.avatar || '/avatars/laughing.png'
                                            }
                                            name={item.isGroupChat ? item.chatName : item.username}
                                            latestMessage={
                                                item.latestMessage?.content ||
                                                (item.isGroupChat ? 'Group chat' : 'Tap to start chat')
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
                {location.pathname === '/friends' && (
                    <>
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
                    </>
                )}
                {location.pathname === '/arrequest' && (
                    <>
                        <AcceptRejectRequests
                            receivedRequests={Array.isArray(pendingRequests) ? pendingRequests : Array.from(pendingRequests)}
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
                    </>
                )}
            </div>
        )
    );
};

export default ChatSidebar;
