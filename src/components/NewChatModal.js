import React, { useContext, useEffect, useState } from 'react';
import ChatContext from '../context/chats/ChatContext';
import LoginBg from '../images/LoginBg.png';

const NewChatModal = ({ isOpen, onClose }) => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const { createChat } = useContext(ChatContext);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return; // fetch only if modal is open
        const fetchFriends = async () => {
            try {
                const response = await fetch(`${host}/api/auth/friends`, {
                    headers: {
                        'auth-token': localStorage.getItem('token')
                    }
                });
                const json = await response.json();
                setFriends(Array.isArray(json) ? json : []);
            } catch (error) {
                console.error('Error fetching friends:', error);
                setFriends([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, [isOpen, host]);

    const handleCreateChat = async (friendId) => {
        console.log(friendId)
        await createChat(friendId);
        onClose();  // close modal after chat created
    };

    if (!isOpen) return null;

    return (
        <div className="modal d-block" tabIndex="-1" >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header" style={{
                        backgroundImage: `url(${LoginBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                        <h5 className="modal-title" style={{color:'white'}}>Start a New Chat</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body" style={{
                        backgroundImage: `url(${LoginBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                        {loading ? (
                            <p className="text-center">Loading friends...</p>
                        ) : friends.length === 0 ? (
                            <p className="text-center">No friends to chat with.</p>
                        ) : (
                            <div className="row">
                                {friends.map((friend) => (
                                    <div className="col-md-6 mb-3" key={friend._id}>
                                        <div className="card p-3 shadow-sm">
                                            <h5>{friend.username}</h5>
                                            <p className="text-muted">{friend.bio}</p>
                                            <button
                                                className="btn btn-warning mt-2"
                                                onClick={() => handleCreateChat(friend._id)}
                                                
                                            >
                                                Create Chat
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewChatModal;
