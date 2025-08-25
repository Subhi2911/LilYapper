import React from 'react';
//import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';

const AcceptRequest= ({
    receivedRequests = [],
    users = [],
    handleAccept,
    handleReject,
    setSelectedUser,
    isMobile,
    setSelectedChat,
}) => {
    //const navigate = useNavigate();
    const requestUsers = users?.filter(user => receivedRequests?.includes(user?._id));

    const handleClick = (user) => {
        console?.log('User clicked:', user);
        setSelectedUser(user);
        if (isMobile && setSelectedChat) {
            console?.log('Setting selected chat on mobile', user);
            setSelectedChat(user);
        }
    };


    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                padding: '1rem',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '1rem',
                boxShadow: '0 0 8px rgba(0,0,0,0.1)',
                overflowY: 'auto',
            }}
        >
            <h3 className="text-white mb-3">Incoming Friend Requests</h3>

            {requestUsers?.length === 0 ? (
                <p className="text-white">No pending requests</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    {requestUsers?.map((user) => (
                        <li
                            key={user?._id}
                            onClick={() => handleClick(user)}
                            style={{
                                padding: '0.75rem',
                                marginBottom: '0.75rem',
                                border: '1px solid #ccc',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                backgroundColor: '#ffffffc5',
                            }}

                        >
                            <div className="d-flex align-items-center gap-3 mb-2">
                                <Avatar src={user?.avatar} height="2" width="2" name={user?.username}/>
                                <strong>{user?.username}</strong>
                            </div>
                            <div
                                style={{
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    marginBottom: '0.5rem',
                                    color: '#333',
                                    fontSize: '0.85rem'
                                }}
                            >
                                <small>{user?.bio || 'No bio provided'}</small>
                            </div>
                            <div className="d-flex justify-content-around">
                                <button
                                    className="btn btn-success px-3"
                                    onClick={(e) => {
                                        e?.stopPropagation();
                                        handleAccept(user);
                                    }}
                                >
                                    ✅ Accept
                                </button>
                                <button
                                    className="btn btn-danger px-3"
                                    onClick={(e) => {
                                        e?.stopPropagation();
                                        handleReject(user);
                                    }}
                                >
                                    ❌ Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AcceptRequest;
