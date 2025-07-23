import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import ChatContext from '../context/chats/ChatContext';

const ChatLayout = ({ chatList }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchGroups } = useContext(ChatContext);
    const [showChatInfo, setShowChatInfo] = useState(false);
    const token = localStorage.getItem('token');
    const host = process.env.REACT_APP_BACKEND_URL;
    const [inspectedUser, setInspectedUser] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [showAddMembersModal, setShowAddMembersModal] = useState(false);

    //const [groupUsers, setGroupUsers] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [messages, setMessages] = useState([]);

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
    const [selectedChat, setSelectedChat] = useState(null);
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


    const onAddSystemMessage = (messageText) => {
        const systemMessage = {
            isSystem: true,
            content: messageText,
            _id: Date.now(), // dummy unique ID
        };
        setMessages((prev) => [...prev, systemMessage]);
    };

    //update localchatlist what chat is selected
    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        // Mark messages as read
        markMessagesAsRead(chat._id);

        // Update unreadCount to 0 locally for this chat
        setLocalChatList(prev =>
            prev.map(c =>
                c._id === chat._id ? { ...c, unreadCount: 0 } : c
            )
        );
    };

    // Create groups 
    const handleGroupCreated = (newGroup) => {
        setGroups(prev => [newGroup, ...prev]);
    };

    const updateGroupLatestMessage = (chatId, newMessage) => {
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
                        unreadCount: 0, // reset or keep as needed
                    }
                    : group
            )
        );
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
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat/group-remove/${chatId}`, {
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
            if (data.systemMessage) {
                setMessages(prev => [
                    ...prev,
                    {
                        _id: Date.now().toString(),
                        content: data.systemMessage,
                        type: 'system',
                        isSystem: true,
                        createdAt: new Date().toISOString()
                    }
                ]);
            }

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
                alert('Members added successfully');

                if (Array.isArray(data.users)) {
                    setSelectedChat(prev => ({
                        ...prev,
                        users: data.users // overwrite with full updated user list
                    }));

                    // Add system message to the messages state if applicable
                    if (data.systemMessage) {
                        setMessages(prev => [
                            ...prev,
                            {
                                _id: Date.now().toString(), // Temporary ID
                                content: data.systemMessage,
                                type: 'system', // You can handle this in MessageBox styling
                                createdAt: new Date().toISOString()
                            }
                        ]);
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

                //  Remove from UI immediately
                setLocalChatList(prev => prev.filter(chat => chat._id !== chatId));
                setGroups(prev => prev.filter(group => group._id !== chatId));
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
                    />
                    <ChatWindow
                        selectedChat={selectedUser}
                        setSelectedChat={setSelectedUser}
                        isMobile={isMobile}
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
                            />
                            <ChatWindow
                                selectedChat={selectedUser}
                                isMobile={isMobile}
                                handleAccept={handleAccept}
                                handleReject={handleReject}
                                setSelectedUser={setSelectedUser}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ChatLayout;
