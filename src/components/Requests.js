import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo'; // Your existing UserInfo component

const Requests = () => {
  // Sample requests data (replace with your API data)
  const [requests, setRequests] = useState([
    { id: 1, username: 'alice', message: 'Wants to connect' },
    { id: 2, username: 'bob', message: 'Sent you a friend request' },
  ]);

  // You could fetch real requests here if needed
  // useEffect(() => { fetchRequestsFromAPI(); }, []);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        maxWidth: '100vw',
        backgroundColor: '#f0f2f5',
        padding: '1rem',
        boxSizing: 'border-box',
        gap: '1rem',
      }}
    >
      {/* Left side: Requests */}
      <div
        style={{
          flex: '1 1 40%',
          backgroundColor: '#fff',
          borderRadius: '1rem',
          boxShadow: '0 0 8px rgba(0,0,0,0.1)',
          padding: '1rem',
          overflowY: 'auto',
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Requests</h3>
        {requests.length === 0 ? (
          <p>No requests</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {requests.map((req) => (
              <li
                key={req.id}
                style={{
                  padding: '0.75rem',
                  marginBottom: '0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  backgroundColor: '#fafafa',
                }}
              >
                <strong>{req.username}</strong> <br />
                <small>{req.message}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right side: UserInfo */}
      <div
        style={{
          flex: '1 1 60%',
          backgroundColor: '#fff',
          borderRadius: '1rem',
          boxShadow: '0 0 8px rgba(0,0,0,0.1)',
          padding: '1rem',
          overflowY: 'auto',
        }}
      >
        <UserInfo />
      </div>
    </div>
  );
};

export default Requests;
