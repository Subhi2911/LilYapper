import React, { useState, useEffect } from 'react';
import loginBg from '../images/LoginBg.png';

const AddMembersModal = ({
    show,
    onClose,
    friendsList,
    onSubmit,
    existingUserIds,
    chatId,
    onAddSystemMessage
}) => {
    const [friendsData, setFriendsData] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const host = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchFriendsInfo = async () => {
            try {
                const promises = friendsList.map(async (id) => {
                    const res = await fetch(`${host}/api/auth/getanotheruser/${id}`, {
                        method: 'POST',
                        headers: {
                            'auth-token': localStorage.getItem('token')
                        }
                    });
                    return await res.json();
                });

                const data = await Promise.all(promises);
                setFriendsData(data);
            } catch (err) {
                console.error('Failed to load friend info:', err);
            }
        };

        if (show) {
            setSelectedUserIds([]);
            fetchFriendsInfo();
        }
    }, [show, friendsList, host]);

    const handleToggle = (id) => {
        setSelectedUserIds(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        if (selectedUserIds.length > 0) {
            onSubmit(chatId,selectedUserIds);
            onClose();
        } else {
            alert('Select at least one user to add.');
        }
    };

    if (!show) return null;

    return (
        <div
            className="modal d-block"
            tabIndex="-1"
            style={{
            }}
        >
            
            <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: '80vh' }}>
                <div className="modal-content" style={{border:'2px solid white'}}>
                    <div className="modal-header" style={{
                        backgroundImage: `url(${loginBg})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backdropFilter: 'blur(4px)',
                        objectFit:'cover'
                    }}>
                        <h5 className="modal-title text-light">Add Members</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{
                        backgroundImage: `url(${loginBg})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backdropFilter: 'blur(4px)',
                        objectFit:'cover'
                    }}>
                        {friendsData.length === 0 ? (
                            <p>No friends available to add.</p>
                        ) : (
                            <ul className="list-group">
                                {friendsData
                                    .filter(friend => !existingUserIds.includes(friend._id))
                                    .map(friend => (
                                        <li
                                            key={friend._id}
                                            className={`list-group-item d-flex align-items-center my-2 justify-content-between ${selectedUserIds.includes(friend._id) ? 'active' : ''
                                                }`}
                                            style={{ cursor: 'pointer', borderRadius: 'inherit' }}
                                            onClick={() => handleToggle(friend._id)}
                                        >
                                            <div className="d-flex align-items-center my-1">
                                                <img
                                                    src={friend.avatar || 'https://via.placeholder.com/40'}
                                                    alt="avatar"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        marginRight: '10px'
                                                    }}
                                                />
                                                <div>
                                                    <div><strong>{friend.username}</strong></div>
                                                    <div style={{ fontSize: '0.85rem',  }}>{friend.bio}</div>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={selectedUserIds.includes(friend._id)}
                                                onChange={() => handleToggle(friend._id)}
                                                onClick={e => e.stopPropagation()}
                                                style={{ transform: 'scale(1.5)' }}
                                            />
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                    <div className="modal-footer" style={{
                        backgroundImage: `url(${loginBg})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backdropFilter: 'blur(4px)',
                        objectFit:'cover'
                    }}>
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSubmit}>Add Selected</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMembersModal;
