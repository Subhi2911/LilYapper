import React, { useEffect, useState } from 'react';
import ChooseAvatar from './ChooseAvatar';
import LoginBg from '../images/LoginBg.png';

const NewGroupModal = ({ isOpen, onClose, onGroupCreated, refreshGroups }) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [avatar, setAvatar] = useState('/avatars/hugging.png'); // default
    const host = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        if (!isOpen) return;

        const fetchFriends = async () => {
            try {
                const response = await fetch(`${host}/api/auth/friends`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token'),
                    },
                });
                const json = await response.json();
                setFriends(Array.isArray(json) ? json : []);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();

        // Disable background scrolling when modal is open
        document.body.style.overflow = 'hidden';

        // Cleanup on close
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, host]);

    const toggleFriend = (id) => {
        setSelectedFriends((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        setError('');
        if (!groupName.trim()) {
            setError('Group name is required.');
            return;
        }
        if (selectedFriends.length < 2) {
            setError('Select at least 2 friends to create a group.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${host}/api/chat/group`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    chatName: groupName.trim(),
                    userIds: selectedFriends,
                    avatar: avatar,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (onGroupCreated) onGroupCreated(data);
                setGroupName('');
                setSelectedFriends([]);
                refreshGroups(); // Refresh groups in ChatLayout
                onClose();
                //refreshGroups(); // Refresh groups in ChatLayout
            } else {
                setError(data.error || (data.errors && data.errors[0]?.msg) || 'Failed to create group');
            }
        } catch (error) {
            console.error('Error creating group:', error);
            setError('Something went wrong');
        } finally {
            setLoading(false);
            
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1040 }}
                onClick={onClose} // optional: click outside closes modal
            />

            {/* Modal */}
            <div
                className="modal fade show"
                style={{ display: 'block', zIndex: 1050 }}
                tabIndex="-1"
                aria-modal="true"
                role="dialog"
                onClick={(e) => e.stopPropagation()} // prevent closing modal when clicking inside
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        {/* Modal header */}
                        <div className="modal-header" style={{
                            backgroundImage: `url(${LoginBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                            <h5 className="modal-title" style={{ color: 'white' }}>Create New Group</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={onClose}
                                disabled={loading}
                            />
                        </div>

                        {/* Modal body */}
                        <div className="modal-body" style={{
                            backgroundImage: `url(${LoginBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <ChooseAvatar onAvatarSelect={(value) => setAvatar(value)} />
                            <input
                                type="text"
                                placeholder="Group Name"
                                className="form-control mb-3"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                disabled={loading}
                                autoFocus
                            />

                            {friends.length === 0 ? (
                                <p>No friends to add.</p>
                            ) : (
                                <ul
                                    className="list-group"
                                    style={{ maxHeight: '300px', overflowY: 'auto' }}
                                >
                                    {friends.map((friend) => (
                                        <li
                                            key={friend._id}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                            onClick={() => toggleFriend(friend._id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span>{friend.username}</span>
                                            <input
                                                type="checkbox"
                                                checked={selectedFriends.includes(friend._id)}
                                                style={{ transform: 'scale(1.5)' }}
                                                onChange={() => toggleFriend(friend._id)}
                                                disabled={loading}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Modal footer */}
                        <div className="modal-footer" style={{
                            backgroundImage: `url(${LoginBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-warning"
                                onClick={handleSubmit}
                                disabled={loading || !groupName.trim() || selectedFriends.length < 2}
                            >
                                {loading ? 'Creating...' : 'Create Group'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewGroupModal;
