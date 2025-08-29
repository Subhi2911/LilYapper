import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import ChatReceiver from './ChatReceiver';
import { useLocation } from 'react-router-dom';
import RequestSidebar from './RequestSidebar';
import AcceptRequest from './AcceptRequest';
import { useSocket } from '../context/chats/socket/SocketContext';
import PlaceHolder from './PlaceHolder';

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
    updateGroupLatestMessage,
    setGroups,
    setProgress,
    setMessages,
    selectedUser
}) => {
    const currentUser = localStorage.getItem('userId');
    const [localGroups, setLocalGroups] = useState(groups);
    const [localChats, setLocalChats] = useState(chatList);

    const location = useLocation();
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    
    const safeChatList = Array.isArray(localChats) ? localChats : [];
    const safeGroups = Array.isArray(localGroups) ? localGroups : [];
    const socket = useSocket();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000); // 3 sec delay
        return () => clearTimeout(timer);
    }, []);

    //const currentUser=localStorage.getItem('userId');

    let displayChats = [];
    useEffect(() => {
        if (selectedChat) {
            // Clear unread count for the selected chat
            setLocalChats(prev =>
                prev.map(chat =>
                    chat?._id === selectedChat?._id
                        ? { ...chat, unreadCount: 0 }
                        : chat
                )
            );
            setLocalGroups(prev =>
                prev.map(chat =>
                    chat._id === selectedChat._id
                        ? { ...chat, unreadCount: 0 }
                        : chat
                )
            );
        }
    }, [selectedChat]);


    useEffect(() => {
        if (!groups || groups.length === 0) return;

        setLocalGroups(prev => {
            // Prevent updates if groups are exactly the same (by ID)
            const sameLength = prev.length === groups.length;
            const sameIds = sameLength && prev.every((p, i) => p._id === groups[i]._id);

            if (sameIds) {
                // Also check if latest messages are identical
                const sameLatest = prev.every((p, i) =>
                    p.latestMessage?.content === groups[i].latestMessage?.content &&
                    p.latestMessage?.createdAt === groups[i].latestMessage?.createdAt
                );
                if (sameLatest) return prev;
            }

            const prevMap = new Map(prev.map(g => [g._id, g]));
            const merged = groups.map(g => {
                const oldGroup = prevMap.get(g._id);
                if (!oldGroup) return g;

                const newerLatest =
                    oldGroup.latestMessage && g.latestMessage
                        ? (new Date(oldGroup.latestMessage.createdAt) > new Date(g.latestMessage.createdAt)
                            ? oldGroup.latestMessage
                            : g.latestMessage)
                        : (oldGroup.latestMessage || g.latestMessage);

                return {
                    ...g,
                    latestMessage: newerLatest,
                    unreadCount: oldGroup.unreadCount || g.unreadCount
                };
            });

            const prevIds = new Set(groups.map(g => g._id));
            const extras = prev.filter(g => !prevIds.has(g._id));

            return [...merged, ...extras];
        });
    }, [groups]);

    const userId = user?._id;

    useEffect(() => {
        const filtered = chatList
            .filter(chat => chat) // remove null/undefined
            .filter(chat => !chat.deletedFor?.includes(userId));

        setLocalChats(prev => {
            const same = prev.length === filtered.length &&
                prev.every((c, i) => c?._id === filtered[i]._id);
            return same ? prev : filtered;
        });
    }, [chatList, userId]);


    useEffect(() => {
        const filtered = groups.filter(chat => !chat.deletedFor?.includes(userId));
        setLocalGroups(prev => {
            const same = prev.length === filtered.length &&
                prev.every((c, i) => c._id === filtered[i]._id);
            return same ? prev : filtered;
        });
    }, [groups, userId]);


    // useEffect(() => {
    //     setLocalChats((prev) => {
    //         if (JSON.stringify(prev) !== JSON.stringify(chatList)) {
    //             return chatList;
    //         }
    //         return prev;
    //     });
    // }, [chatList]);


    const selectedChatRef = useRef(selectedChat);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    
    //useEffect(()=>{},[])
    useEffect(() => {
        if (!socket) return;
        

        const seenMessages = new Set();
        const handleNewMessage = (newMsg) => {
            
            if (!newMsg?._id || newMsg?.isSystem) return; // must have an ID to track

            // Skip if we've already processed this message
            if (seenMessages.has(newMsg._id)) {
                return;
            }
            seenMessages.add(newMsg._id);
            
            
            const updateLatest = (setList) => {
                setList(prevList => {
                    const found = prevList.some(chat => chat?._id === newMsg?.chat?._id);

                    if (!found) {
                        return [newMsg.chat, ...prevList];
                    }


                    return prevList.map(chat => {
                        
                        if (chat?._id === newMsg?.chat?._id) {
                            const isSender = newMsg.sender?._id === currentUser?._id;
                            
                            const unreadIncrement = isSender
                                ? 0 //  don’t increment for my own messages
                                : (selectedChatRef?.current?._id === newMsg.chat?._id ? 0 : 1);
                            
                            return {
                                ...chat,
                                latestMessage: newMsg,
                                unreadCount: (chat?.unreadCount || 0) + unreadIncrement
                            };
                        }
                        return chat;
                    });
                });
            };
            
            if (newMsg.chat.isGroupChat) {
                updateLatest(setLocalGroups);
            } else {
                updateLatest(setLocalChats);
            }
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

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
        displayChats = [...safeChatList, ...safeGroups].filter(
            chat => !chat?.deletedFor?.includes(user?._id)
        );
    } else if (location.pathname === '/groups') {
        displayChats = safeGroups.filter(
            chat => !chat?.deletedFor?.includes(user?._id)
        );
    }
    
    // Sort chats by latestMessage timestamp (descending)
    displayChats.sort((a, b) => {
        const timeA = new Date(a?.latestMessage?.createdAt || a?.updatedAt || 0).getTime();
        const timeB = new Date(b?.latestMessage?.createdAt || b?.updatedAt || 0).getTime();
        return timeB - timeA;
    });

    const pendingRequestsArray = Array.isArray(pendingRequests)
        ? pendingRequests
        : Array.from(pendingRequests);

    useEffect(() => {
        if (!socket) return;

        const handleChatRead = ({ chatId }) => {
            setLocalGroups(prevGroups =>
                prevGroups.map(chat =>
                    chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
                )
            );
            setLocalChats(prevChats =>
                prevChats.map(chat =>
                    chat?._id === chatId ? { ...chat, unreadCount: 0 } : chat
                )
            );
        };

        socket.on('chat-read', handleChatRead);

        return () => {
            socket.off('chat-read', handleChatRead);
        };
    }, [socket]);



    const handleChatSelect = (chat) => {
        
        setSelectedChat(chat);
        // Get the latest message id
        if (chat?.latestMessage?._id) {
            socket.emit("mark-read", {
                chatId: chat?._id,
                messageId: chat?.latestMessage._id,
            });

            // ✅ Optimistically update local messages for instant UI feedback
            setMessages(prev =>
                prev.map(m =>
                    m.chat === chat._id && !m.readBy?.includes(currentUser)
                        ? { ...m, readBy: [...(m.readBy || []), currentUser] }
                        : m
                )
            );
        }

        // Reset unread count locally immediately
        if (chat.isGroupChat) {
            setLocalGroups(prevGroups =>
                prevGroups.map(g =>
                    g._id === chat._id ? { ...g, unreadCount: 0 } : g
                )
            );
        } else {
            setLocalChats(prevChats =>
                prevChats.map(c =>
                    c?._id === chat?._id ? { ...c, unreadCount: 0 } : c
                )
            );
        }
    };



    return (
        (!isMobile || !selectedChat) && (
            <div
                style={{
                    width: isMobile ? '100vw' : '350px',
                    maxWidth: isMobile ? '100vw' : '400px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: isMobile ? 'none' : '1px solid #ccc',
                    backgroundColor: '#5459AC',
                    boxSizing: 'border-box',
                }}

            >
                <Navbar refreshGroups={refreshGroups}
                    onGroupCreated={onGroupCreated}
                    setSelectedChat={setSelectedChat}
                    setProgress={setProgress} />

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
                            {loading ? ( //show placeholders during 3 sec
                                <>
                                    {[...Array(displayChats?.length || 4)].map((_, i) => (
                                        <div key={i} className="my-3">
                                            <PlaceHolder />
                                        </div>
                                    ))}
                                </>
                            ) : (
                                displayChats.map((item) => (
                                    <li
                                        key={item?._id}
                                        className="list-group-item my-2"
                                        onClick={() => {
                                            handleChatSelect(item);
                                            if (isMobile) setShowChatInfo(false);
                                        }}
                                        style={{ cursor: 'pointer', borderRadius: 'inherit' }}
                                    >
                                        <ChatReceiver
                                            isGroup={item?.isGroupChat}
                                            lastMessageTime={item?.latestMessage?.createdAt || ''}
                                            sent={
                                                localStorage.getItem('userId') === item?.latestMessage?.sender?._id
                                                    ? 'You :'
                                                    : item?.latestMessage?.sender?.username
                                                        ? `${item?.latestMessage?.sender?.username} :`
                                                        : ''
                                            }
                                            avatar={
                                                item?.isGroupChat
                                                    ? item?.avatar || '/avatars/hugging.png'
                                                    : item?.avatar || '/avatars/laughing.png'
                                            }
                                            name={item?.isGroupChat ? item?.chatName : item?.username}
                                            latestMessage={
                                                item?.latestMessage?.content ||
                                                (item?.isGroupChat ? 'Group chat' : 'Tap to start chat')
                                            }
                                            unreadCount={item?.unreadCount || 0}
                                            onlineUsers={onlineUsers}
                                            id={item?.otherUserId}
                                            selectedChat={selectedChat}
                                            setSelectedChat={setSelectedChat}
                                            
                                        />
                                        
                                    </li>
                                ))
                            )}
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
                        selectedUser={selectedUser}
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
