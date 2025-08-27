import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import ChatContext from '../context/chats/ChatContext';
import { useSocket } from '../context/chats/socket/SocketContext';

const ChatLayout = ({ chatList, selectedChat, setSelectedChat, getConnections, setProgress }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchGroups } = useContext(ChatContext);
    const [showChatInfo, setShowChatInfo] = useState(false);
    const token = localStorage.getItem('token');
    const host = process.env.REACT_APP_BACKEND_URL;
    const [inspectedUser, setInspectedUser] = useState(null);
    const currentUser = localStorage.getItem('userId');

    const socket = useSocket();
    // eslint-disable-next-line no-unused-vars
    const [showAddMembersModal, setShowAddMembersModal] = useState(false);

    //const [groupUsers, setGroupUsers] = useState([]);
    const { messages = [], setMessages } = useContext(ChatContext);

    // States for groups
    const [groups, setGroups] = useState([]);
    const [groupsPage, setGroupsPage] = useState(1);
    const [groupsHasMore, setGroupsHasMore] = useState(true);
    const [groupsLoading, setGroupsLoading] = useState(false);

    // States for users (for friend requests and other users)
    const [users, setUsers] = useState([]);
    const [usersPage, setUsersPage] = useState(1);
    const [usersHasMore, setUsersHasMore] = useState(true);
    const [usersLoading, setUsersLoading] = useState(false);

    // Other states
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const [selectedUser, setSelectedUser] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [localChatList, setLocalChatList] = useState(chatList || []);

    // Friend request related sets
    const [sentRequests, setSentRequests] = useState(new Set());
    const [pendingRequests, setPendingRequests] = useState(new Set());
    const [friends, setFriends] = useState(new Set());
    const initialized = useRef(false); // prevent multiple initial calls

    //set local chatlist to pass it as a prop
    useEffect(() => {
        setLocalChatList(chatList || []);
    }, [chatList]);

    //handelers
    const handleAddMembers = (newUsers) => {
        // update selectedChat.users if needed
        setSelectedChat((prev) => ({
            ...prev,
            users: [...prev.users, ...newUsers]
        }));
    };

    useEffect(() => {
        if (!socket || !selectedChat) return;
        console.log("jhimri")

        const handleNewMessage = (msg) => {
            const msgChatId = msg?.chatId || msg?.chat
            console.log(msg, String(msgChatId) === String(selectedChat?._id))
            if (String(msgChatId) === String(selectedChat?._id)) {
                setMessages(prev => {
                    console.log(prev)
                    if (prev.some(m =>
                        (m._id && msg._id && String(m._id) === String(msg._id)) ||
                        (m?.populatedSystemMessage?._id && msg?.populatedSystemMessage?._id &&
                            String(m.populatedSystemMessage._id) === String(msg.populatedSystemMessage._id))
                    )) {
                        return prev; // duplicate found
                    }

                    //{console.log('musafir')}
                    return [...prev, {
                        ...msg,
                        chat: msg.chat,
                        type: 'system',
                        text: msg.content || msg.text,
                        isSystem: msg.isSystem,
                    }];
                });

                // Call this outside setMessages to avoid side effects in render
                markMessagesAsRead(selectedChat._id);
            }
        };

        socket.on('newMessage', handleNewMessage);
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selectedChat]);



    const onAddSystemMessage = (messageText) => {
        const systemMessage = {
            isSystem: true,
            content: messageText,
            _id: `system-${Date.now()}`, // dummy unique ID
        };
        //setMessages((prev) => [...prev, systemMessage]);
        if (socket) {
            socket.emit('send-message', systemMessage);
        }
    };

    // Mark messages as read after viewed by the user & update badge immediately
    const markMessagesAsRead = async (chatId) => {
        if (!chatId) return;
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/message/markRead/${chatId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
            });

            // Immediately update unreadCount for the group/chat to 0 to hide badge
            setGroups((prevGroups) =>
                prevGroups.map((group) =>
                    group._id === chatId
                        ? { ...group, unreadCount: 0 }
                        : group
                )
            );

            // If you want to update chatList (non-groups), do it here similarly (not shown)

        } catch (error) {
            console.error('Failed to mark messages as read:', error);
        }
    };


    //update localchatlist what chat is selected
    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        // Mark messages as read
        markMessagesAsRead(chat?._id);

        // Update unreadCount to 0 locally for this chat
        setLocalChatList(prev =>
            prev.map(c =>
                c?._id === chat?._id ? { ...c, unreadCount: 0 } : c
            )
        );
    };

    // Create groups 
    const handleGroupCreated = (newGroup) => {
        setGroups(prev => [newGroup, ...prev]);
    };

    const updateChatLatestMessage = (chatId, newMessage, selectedChatId) => {
        //const isSender = newMessage.sender?._id === currentUser?._id;
        const unreadIncrement = (chatId === newMessage.chat._id && newMessage.sender._id === currentUser) ? 0 : 1;
        setLocalChatList(prevChats =>
            prevChats.map(chat =>
                chat._id === chatId
                    ? {
                        ...chat,
                        latestMessage: {
                            content: newMessage.content || newMessage.text || '',
                            createdAt: newMessage.createdAt || new Date().toISOString(),
                            sender: newMessage.sender || {},
                        },
                        unreadCount: (chat.unreadCount || 0) + unreadIncrement, // reset or keep as needed

                    }
                    : chat
            )
        );
    };



    const updateGroupLatestMessage = (chatId, newMessage) => {
        console.log('d', newMessage)
        console.log('ddweded', newMessage.sender._id === currentUser)
        const unreadIncrement = (chatId === newMessage.chat._id && newMessage.sender._id === currentUser) ? 0 : 1;
        setGroups(prevGroups =>
            prevGroups.map(group =>

                group._id === chatId
                    ? {
                        ...group,
                        latestMessage: {
                            content: newMessage.content || newMessage.text || '',
                            createdAt: newMessage.createdAt || new Date().toISOString(),
                            sender: newMessage.sender || {},
                        },
                        unreadCount: (group.unreadCount || 0) + unreadIncrement, // reset or keep as needed
                    }
                    : group
            )
        );
    };

    //permission to change group settings
    const handlePermissionChange = async (permKey, newValue) => {
        try {
            const res = await fetch(`${host}/api/chat/group-permissions/${selectedChat._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'auth-token': localStorage.getItem("token")
                },
                body: JSON.stringify({
                    permissions: { [permKey]: newValue }
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update");
            }

            const data = await res.json();

            console.log(data);
            if (data.populatedSystemMessage) {
                const systemMessage = {
                    ...data,
                    content: data.populatedSystemMessage.content,
                    type: 'system',
                    createdAt: new Date().toISOString(),
                    chat: data.chat,
                    users: data.users,
                    isSystem: true
                };

                if (socket) {
                    socket.emit('send-message', systemMessage);
                }
            }
            // Update local chat object so UI reflects change instantly
            setSelectedChat((prev) => ({
                ...prev,
                permissions: data.permissions
            }));



        } catch (err) {
            console.error("Permission update error:", err);
            alert(err.message);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const [chats, setChats] = useState([]); // your chats state

    //handle remove friend
    const removeFriend = async (toRemoveId, chatId) => {
        try {
            const response = await fetch(`${host}/api/auth/removefriends/${toRemoveId}`, {
                method: "POST",
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });

            if (response.ok) {
                setSelectedChat(null); // close the chat

                //  Remove from UI immediately
                setLocalChatList(prev => prev.filter(chat => chat._id !== chatId));
                setGroups(prev => prev.filter(group => group._id !== chatId));

            }
        } catch (error) {
            console.error("Error sending messages:", error);
            return null;
        }
    }

    //remove from group
    const removeFromGroup = async (chatId, userIds) => {
        try {
            const res = await fetch(`${host}/api/chat/group-remove/${chatId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ userIds }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to remove users');

            // Update selectedChat's user list
            if (Array.isArray(data.users)) {
                setSelectedChat(prev => ({
                    ...prev,
                    users: data.users,
                }));
            }

            // Append system message
            console.log(data)
            if (data?.populatedSystemMessage) {
                const systemMessage = {
                    ...data,
                    content: data.populatedSystemMessage.content,
                    type: 'system', // handle this in MessageBox styling
                    createdAt: new Date().toISOString(),
                    chat: data.chat,
                    isSystem: true,
                    users: data.users

                };
                if (socket) {
                    socket.emit('send-message', systemMessage);
                }
            }
            fetchGroups(); // Optional refresh
            return data;
        } catch (error) {
            console.error('Error removing from group:', error.message);
            throw error;
        }
    };


    //Add to group
    const addToGroup = async (chatId, userIds) => {
        try {
            const res = await fetch(`${host}/api/chat/group-add/${chatId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ userIds })
            });

            const data = await res.json();
            if (res.ok) {
                console.log(data)
                alert('Members added successfully');

                if (Array.isArray(data.users)) {
                    setSelectedChat(prev => ({
                        ...prev,
                        users: data.users // overwrite with full updated user list
                    }));

                    // Add system message to the messages state if applicable
                    console.log(data)
                    if (data.populatedSystemMessage) {
                        const systemMessage = {
                            ...data,
                            content: data.populatedSystemMessage.content,
                            type: 'system', // handle this in MessageBox styling
                            createdAt: new Date().toISOString(),
                            chat: data.chat,
                            users: data.users,
                            isSystem: true

                        };
                        if (socket) {
                            socket.emit('send-message', systemMessage);
                        }
                    }
                }

                fetchGroups(); // Optional refresh
            } else {
                alert(data.error || 'Failed to add members');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong');
        }
    };

    //handle make admin function
    const handleMakeAdmin = async (chatId, userId) => {
        try {
            const response = await fetch(`${host}/api/chat/chats/${chatId}/make-admin/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'), // or your auth header
                },
            });

            const data = await response.json();
            if (response.ok) {
                // Assume data.updatedChat has updated chat info, including groupAdmin

                // Update the chat state locally
                setSelectedChat(prev => ({
                    ...prev,
                    groupAdmin: data.groupAdmin
                }));

                // Optionally update the chat list if you keep it separately
                // setChats(prevChats => prevChats.map(chat => chat._id === chatId ? data.updatedChat : chat));
            } else {
                console.error('Failed to make admin:', data.error || data.message);
            }
        } catch (error) {
            console.error('Error making admin:', error);
        }
    };

    // Handle delete chat function
    const handleDeleteChat = async (chatId) => {
        try {
            const res = await fetch(`${host}/api/chat/deletechat/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            if (res.ok) {
                setSelectedChat(null); // close the chat

                // Remove from UI immediately
                setLocalChatList(prev => prev.filter(chat => chat._id !== chatId));
                setGroups(prev => prev.filter(group => group._id !== chatId));

                // Refresh chat list from server
                getConnections?.();
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };
    // Fetch groups paginated and append
    const loadMoreGroups = useCallback(async () => {
        if (groupsLoading || !groupsHasMore) return;
        setGroupsLoading(true);
        try {
            const data = await fetchGroups(groupsPage, 10); // passing page and limit
            if (Array.isArray(data.groups)) {
                setGroups((prev) => {
                    const existingIds = new Set(prev.map((g) => g._id));
                    const filteredNew = data.groups.filter((g) => !existingIds.has(g._id));
                    return [...prev, ...filteredNew];
                });
            }
            if (groupsPage >= data.totalPages) setGroupsHasMore(false);
            else setGroupsPage((p) => p + 1);
        } catch (err) {
            console.error('Error loading groups:', err);
        } finally {
            setGroupsLoading(false);
        }
    }, [fetchGroups, groupsHasMore, groupsLoading, groupsPage]);


    useEffect(() => {
        if (selectedChat?._id) {
            markMessagesAsRead(selectedChat._id);
        }
    }, [selectedChat]);

    // Fetch users paginated and append
    const loadMoreUsers = useCallback(async () => {
        if (usersLoading || !usersHasMore) return;
        setUsersLoading(true);
        try {
            const response = await fetch(`${host}/api/auth/allusers?page=${usersPage}&limit=10`, {
                headers: { 'auth-token': token },
            });
            const data = await response.json();

            if (!data.success || !Array.isArray(data.users)) {
                setUsersHasMore(false);
                return;
            }

            const existingIds = new Set(users.map((u) => u._id));
            const newUsers = data.users.filter((u) => !existingIds.has(u._id));

            setUsers((prev) => [...prev, ...newUsers]);

            if (usersPage >= data.pagination?.totalPages || data.users.length === 0) {
                setUsersHasMore(false);
            } else {
                setUsersPage((p) => p + 1);
            }
        } catch (e) {
            console.error('Error fetching users:', e);
        } finally {
            setUsersLoading(false);
        }
    }, [host, token, users, usersPage, usersHasMore, usersLoading]);



    // Fetch friend requests and friends
    const fetchRequestsAndFriends = useCallback(async () => {
        try {
            const [pendingRes, sentRes, userRes] = await Promise.all([
                fetch(`${host}/api/auth/friendrequests`, { headers: { 'auth-token': token } }),
                fetch(`${host}/api/auth/sent-requests`, { headers: { 'auth-token': token } }),
                fetch(`${host}/api/auth/getuser`, {
                    method: 'POST',
                    headers: { 'auth-token': token },
                }),
            ]);

            const pendingData = await pendingRes.json();
            const sentData = await sentRes.json();
            const userData = await userRes.json();

            setPendingRequests(new Set(pendingData.pendingRequests?.map((u) => u._id) || []));
            setSentRequests(new Set(sentData.sentRequests || []));
            setFriends(new Set(userData?.user?.friends?.map((id) => id.toString()) || []));

        } catch (error) {
            console.error('Error fetching request data:', error);
        }
    }, [host, token]);

    useEffect(() => {
        fetchRequestsAndFriends();
    }, [fetchRequestsAndFriends]);

    // Initialization on mount
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        if (!initialized.current) {
            loadMoreGroups();
            loadMoreUsers();
            fetchRequestsAndFriends();
            initialized.current = true;
        }

        // Handle resize
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [token, navigate, loadMoreGroups, loadMoreUsers, fetchRequestsAndFriends]);

    // Scroll handler for users sidebar (infinite scroll)
    const onUsersScroll = (e) => {
        const bottomReached =
            e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottomReached && usersHasMore && !usersLoading) {
            loadMoreUsers();
        }
    };

    // Scroll handler for groups sidebar (infinite scroll)
    const onGroupsScroll = (e) => {
        const bottomReached =
            e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottomReached && groupsHasMore && !groupsLoading) {
            loadMoreGroups();
        }
    };

    // Friend request handlers 
    const handleClick = async (user) => {
        try {
            const response = await fetch(`${host}/api/auth/send-request/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setSentRequests((prev) => new Set(prev).add(user._id));
                fetchRequestsAndFriends();
            } else {
                console.warn(data.error || 'Failed to send request');
            }
        } catch (error) {
            console.error('Send request error:', error);
        }
    };

    const cancelRequest = async (user) => {
        try {
            const response = await fetch(`${host}/api/auth/cancel-request/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setSentRequests((prev) => new Set([...prev].filter((id) => id !== user._id)));
                fetchRequestsAndFriends();
            } else {
                console.warn(data.error || 'Failed to cancel request');
            }
        } catch (error) {
            console.error('Cancel request error:', error);
        }
    };

    const handleAccept = async (user) => {
        try {
            const res = await fetch(`${host}/api/auth/accept-request/${user._id}`, {
                method: 'POST',
                headers: { 'auth-token': token },
            });
            if (res.ok) fetchRequestsAndFriends();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async (user) => {
        try {
            const res = await fetch(`${host}/api/auth/reject-request/${user._id}`, {
                method: 'POST',
                headers: { 'auth-token': token },
            });
            if (res.ok) fetchRequestsAndFriends();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            className="d-flex"
            style={{
                position: 'absolute',
                left: isMobile ? 0 : 50,
                top: 0,
                right: 0,
                bottom: 0,
                height: '100vh',
                overflow: 'hidden',
                backgroundColor: '#f8f9fa',
            }}
        >
            {(location.pathname === '/' || location.pathname === '/groups') && (
                <>
                    <ChatSidebar
                        chatList={localChatList}
                        groups={groups}
                        isMobile={isMobile}
                        selectedChat={selectedChat}
                        setSelectedChat={handleSelectChat}
                        onGroupsScroll={onGroupsScroll}
                        groupsLoading={groupsLoading}
                        groupsHasMore={groupsHasMore}
                        refreshGroups={fetchGroups}
                        onGroupCreated={handleGroupCreated}
                        setShowChatInfo={setShowChatInfo}
                        setGroups={setGroups}
                        setLocalChats={setLocalChatList}
                        updateGroupLatestMessage={updateGroupLatestMessage}
                        setProgress={setProgress}

                    />
                    <ChatWindow
                        selectedChat={selectedChat}
                        selectedUser={selectedUser}
                        setSelectedChat={setSelectedChat}
                        isMobile={isMobile}
                        onDeleteChat={handleDeleteChat}
                        showChatInfo={showChatInfo}
                        friends={friends}
                        setShowChatInfo={setShowChatInfo}
                        onRemoveFriend={removeFriend}
                        inspectedUser={inspectedUser}
                        setInspectedUser={setInspectedUser}
                        removeFromGroup={removeFromGroup}
                        addToGroup={addToGroup}
                        setShowAddMembersModal={setShowAddMembersModal}
                        showAddMembersModal={showAddMembersModal}
                        handleAddMembers={handleAddMembers}
                        onAddSystemMessage={onAddSystemMessage}
                        updateGroupLatestMessage={updateGroupLatestMessage}
                        setGroups={setGroups}
                        setLocalChatList={setLocalChatList}
                        markMessagesAsRead={(chatId) => { markMessagesAsRead(chatId) }}
                        handlePermissionChange={handlePermissionChange}
                        handleMakeAdmin={handleMakeAdmin}
                        messages={messages}
                        setMessages={setMessages}
                        updateChatLatestMessage={updateChatLatestMessage}
                        setProgress={setProgress}
                    />
                </>
            )}

            {location.pathname === '/arrequest' && (
                <>
                    <ChatSidebar
                        users={users}
                        sentRequests={sentRequests}
                        pendingRequests={pendingRequests}
                        friends={friends}
                        setSelectedUser={setSelectedUser}
                        handleClick={handleClick}
                        cancelRequest={cancelRequest}
                        fetchUsers={loadMoreUsers} // This is now the paginated loader
                        hasMore={usersHasMore}
                        isMobile={isMobile}
                        onUsersScroll={onUsersScroll}
                        usersLoading={usersLoading}
                        setMessages={setMessages}
                        messages={messages}
                    />
                    <ChatWindow
                        selectedChat={selectedUser}
                        setSelectedChat={setSelectedUser}
                        isMobile={isMobile}
                        setMessages={setMessages}
                        messages={messages}
                    />
                </>
            )}

            {location.pathname === '/friends' && (
                <>
                    {isMobile && selectedUser ? (
                        <ChatWindow
                            selectedChat={selectedUser}
                            isMobile={isMobile}
                            handleAccept={handleAccept}
                            handleReject={handleReject}
                            setSelectedUser={setSelectedUser}
                            setMessages={setMessages}
                            messages={messages}
                        />
                    ) : (
                        <>
                            <ChatSidebar
                                users={users}
                                pendingRequests={pendingRequests}
                                setSelectedUser={setSelectedUser}
                                handleClick={handleClick}
                                fetchUsers={loadMoreUsers}
                                hasMore={usersHasMore}
                                isMobile={isMobile}
                                handleAccept={handleAccept}
                                handleReject={handleReject}
                                setSelectedChat={setSelectedChat}
                                onUsersScroll={onUsersScroll}
                                usersLoading={usersLoading}
                                setMessages={setMessages}
                                messages={messages}
                            />
                            <ChatWindow
                                selectedChat={selectedUser}
                                isMobile={isMobile}
                                handleAccept={handleAccept}
                                handleReject={handleReject}
                                setSelectedUser={setSelectedUser}
                                messages={messages}
                                setMessages={setMessages}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ChatLayout;
