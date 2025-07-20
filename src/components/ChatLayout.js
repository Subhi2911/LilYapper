import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
//import ChatWindow from './ChatWindow';


const ChatLayout = ({ chatList }) => {
    const location = useLocation(); // ← Fix: get location from React Router

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [selectedChat, setSelectedChat] = useState(null);
    const token = localStorage.getItem('token');
    const host = process.env.REACT_APP_BACKEND_URL
    const [sentRequests, setSentRequests] = useState(new Set());
    const [pendingRequests, setPendingRequests] = useState(new Set());
    const [friends, setFriends] = useState(new Set());
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (!token) navigate('/login');
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [token, navigate]);

    const fetchUsers = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await fetch(`${host}/api/auth/allusers?page=${page}&limit=10`, {
                headers: { 'auth-token': token },
            });
            const data = await response.json();
            if (!data.success || !Array.isArray(data.users)) {
                setHasMore(false);
                return;
            }
            setUsers(prev => {
                const existingIds = new Set(prev.map(u => u._id));
                const newUsers = data.users.filter(u => !existingIds.has(u._id));
                if (newUsers.length === 0) setHasMore(false);
                return [...prev, ...newUsers];
            });
            if (page >= data.pagination?.totalPages || data.users.length === 0) {
                setHasMore(false);
            } else {
                setPage(prev => prev + 1);
            }
        } catch (e) {
            console.error("Error fetching users:", e);
            setHasMore(false);
        }
        setLoading(false);
    }, [host, page, token, loading, hasMore]);


    const fetchRequestsAndFriends = useCallback(async () => {
        try {
            const pendingRes = await fetch(`${host}/api/auth/friendrequests`, {
                headers: { 'auth-token': token },
            });
            const pendingData = await pendingRes.json();
            setPendingRequests(new Set(pendingData.pendingRequests?.map(u => u._id) || []));

            const sentRes = await fetch(`${host}/api/auth/sent-requests`, {
                headers: { 'auth-token': token },
            });
            const sentData = await sentRes.json();
            setSentRequests(new Set(sentData.sentRequests || []));

            const userRes = await fetch(`${host}/api/auth/getuser`, {
                method: 'POST',
                headers: { 'auth-token': token },
            });
            const userData = await userRes.json();
            setFriends(new Set(userData?.user?.friends?.map(id => id.toString()) || []));
        } catch (error) {
            console.error("Error fetching request data:", error);
        }
    }, [host, token]);
    const handleAccept = async (user) => {
        try {
            const res = await fetch(`${host}/api/auth/accept-request/${user._id}`, {
                method: 'POST',
                headers: { 'auth-token': token },
            });
            if (res.ok) {
                alert('Friend request accepted!');
                fetchRequestsAndFriends(); // refresh requests and friends lists
            } else {
                alert('Failed to accept request');
            }
        } catch (err) {
            console.error(err);
            alert('Error accepting request');
        }
    };

    const handleReject = async (user) => {
        try {
            const res = await fetch(`${host}/api/auth/reject-request/${user._id}`, {
                method: 'POST',
                headers: { 'auth-token': token },
            });
            if (res.ok) {
                alert('Friend request rejected!');
                fetchRequestsAndFriends();
            } else {
                alert('Failed to reject request');
            }
        } catch (err) {
            console.error(err);
            alert('Error rejecting request');
        }
    };


    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        fetchRequestsAndFriends();
    }, [fetchRequestsAndFriends]);

    const handleClick = async (user) => {
        try {
            const response = await fetch(`${host}/api/auth/send-request/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                }
            });
            const data = await response.json();
            if (response.ok) {
                setSentRequests(prev => new Set(prev).add(user._id));
                alert("Request sent successfully!");
                fetchRequestsAndFriends();
            } else {
                alert(data.error || "Failed to send request");
            }
        } catch (error) {
            console.error('Send request error:', error);
            alert("Something went wrong");
        }
    };

    const cancelRequest = async (user) => {
        try {
            const response = await fetch(`${host}/api/auth/cancel-request/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                }
            });
            const data = await response.json();
            if (response.ok) {
                setSentRequests(prev => new Set([...prev].filter(id => id !== user._id)));
                alert("Request cancelled successfully!");
                fetchRequestsAndFriends();
            } else {
                alert(data.error || "Failed to cancel request");
            }
        } catch (error) {
            console.error('Cancel request error:', error);
            alert("Something went wrong");
        }
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch(`${host}/api/auth/friendrequests`, {
                    headers: { 'auth-token': token },
                });
                const data = await response.json();
                if (response.ok && data.pendingRequests) {
                    setRequests(data.pendingRequests);
                } else {
                    console.error(data.error || 'Failed to fetch requests');
                }
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchRequests();
    }, [host, token]);



    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setSelectedChat(null);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const savedChatId = localStorage.getItem('selectedChatId');
        if (savedChatId && chatList.length > 0) {
            const match = chatList.find((c) => c._id === savedChatId);
            if (match) setSelectedChat(match);
        }
    }, [chatList]);

    const messages = [
        { type: 'received', text: 'Hello! 👋 How are you today?' },
        { type: 'sent', text: 'I am good, thanks! Just working on some React code.' },
    ];

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
            {location.pathname === '/' && (
                <>
                    <ChatSidebar
                        chatList={chatList}
                        isMobile={isMobile}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                    />
                    <ChatWindow
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                        messages={messages}
                        isMobile={isMobile}
                    />
                </>
            )}
            {location.pathname === '/friends' && (
                <>
                    <ChatSidebar
                        users={users}
                        sentRequests={sentRequests}
                        pendingRequests={pendingRequests}   // FIXED prop name here
                        friends={friends}
                        setSelectedUser={setSelectedUser}
                        handleClick={handleClick}
                        cancelRequest={cancelRequest}
                        fetchUsers={fetchUsers}
                        hasMore={hasMore}
                        isMobile={isMobile}
                    />

                    <ChatWindow
                        selectedChat={selectedUser}
                        setSelectedChat={setSelectedUser}
                        messages={messages}
                        isMobile={isMobile}
                    />
                </>
            )}
            {location.pathname === '/arrequest' && (
                <>
                    <ChatSidebar
                        users={users}
                        pendingRequests={pendingRequests}
                        setSelectedUser={setSelectedUser}
                        handleClick={handleClick}
                        fetchUsers={fetchUsers}
                        hasMore={hasMore}
                        isMobile={isMobile}
                        handleAccept={handleAccept}
                        handleReject={handleReject}
                        setSelectedChat={setSelectedChat}
                    />

                    <ChatWindow
                        selectedChat={selectedUser}
                        
                        messages={messages}
                        isMobile={isMobile}
                        setSelectedUser={setSelectedUser}
                    />
                </>
            )}

        </div>
    );
};

export default ChatLayout;
