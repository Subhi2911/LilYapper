import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RequestSidebar from './RequestSidebar';
import RequestWindow from './RequestWindow';

const Requests = () => {
  const host = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [sentRequests, setSentRequests] = useState(new Set());
  const [pendingRequests, setPendingRequests] = useState(new Set());
  const [friends, setFriends] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height: '100vh',
        maxWidth: '100vw',
        backgroundColor: '#648DB3',
        padding: '1rem',
        boxSizing: 'border-box',
        gap: '1rem',
      }}
    >
      {(!isMobile || !selectedUser) && (
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

      {(!isMobile || selectedUser) && (
        <RequestWindow
          selectedUser={selectedUser}
          isMobile={isMobile}
          handleBack={() => setSelectedUser(null)}
          sentRequests={sentRequests}
          pendingRequests={pendingRequests}
          handleSkip={handleSkip}
        />
      )}
    </div>
  );
};

export default Requests;
