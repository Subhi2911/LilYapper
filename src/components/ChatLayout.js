import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import ChatContext from '../context/chats/ChatContext';

const ChatLayout = ({ chatList }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const { fetchGroups } = useContext(ChatContext);

    const token = localStorage.getItem('token');
    const host = process.env.REACT_APP_BACKEND_URL;

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

    // Friend request related sets
    const [sentRequests, setSentRequests] = useState(new Set());
    const [pendingRequests, setPendingRequests] = useState(new Set());
    const [friends, setFriends] = useState(new Set());

    const initialized = useRef(false); // prevent multiple initial calls

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

    // fetch grp after it is created
    const refreshGroups = async () => {
        setGroups([]);
        setGroupsPage(1);
        setGroupsHasMore(true);
        await loadMoreGroups(); // reload first page
    };

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

    // Friend request handlers (same as you had)
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
                        chatList={chatList}
                        groups={groups}
                        isMobile={isMobile}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                        refreshGroups={refreshGroups}
                        // Pass group scroll handler and loading/hasMore for infinite scroll
                        onGroupsScroll={onGroupsScroll}
                        groupsLoading={groupsLoading}
                        groupsHasMore={groupsHasMore}
                    />
                    <ChatWindow
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                        isMobile={isMobile}
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
