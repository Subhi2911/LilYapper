import React from 'react';
import Avatar from './Avatar';

const ChatInfo = ({
    selectedChat,
    onBack,
    onDeleteChat,
    selectedUser,
    setInspectedUser,
    removeFromGroup,
    onAddMembers,
    onlineUsers,
    handlePermissionChange
}) => {
    if (!selectedChat) return null;

    let isOnline = onlineUsers.has(selectedChat.otherUserId) ? true : false;

    const { avatar, username, bio, date, isGroupChat, chatName, groupAdmin = [] } = selectedChat;

    const currentUserId = localStorage.getItem('userId');
    const isAdmin = groupAdmin.some(admin => admin._id === currentUserId);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const onRemoveUser = (id) => {
        removeFromGroup(selectedChat._id, [id]);
    };

    // Move current user to the top
    const sortedMembers = [...(selectedChat.users || [])].sort((a, b) => {
        if (a._id === currentUserId) return -1;
        if (b._id === currentUserId) return 1;
        return 0;
    });


    return (
        <div className="p-4 text-white d-flex flex-column">
            <button
                className="btn btn-light mb-4"
                onClick={onBack}
                style={{ alignSelf: 'flex-start' }}
            >
                ← Back to Chat
            </button>

            <div className="d-flex flex-column align-items-center mb-4">
                <Avatar src={avatar} size={120} isGroup={isGroupChat} isOnline={isOnline} />
                <h3 className="mt-3 text-center">
                    {isGroupChat ? chatName : username}
                </h3>
                {bio && (
                    <p className="text-center mt-2" style={{ fontStyle: 'italic', opacity: 0.8 }}>
                        {bio}
                    </p>
                )}
            </div>

            <div className="flex-grow-1 overflow-auto w-100">
                {isGroupChat ? (
                    <>
                    {console.log(selectedChat)}
                        {isAdmin && (
                            <div className="mt-3">
                                <h5>Group Permissions</h5>
                                {Object.keys(selectedChat.permissions || {}).map((permKey) => (
                                    <div key={permKey} className="mb-2">
                                        <label className="form-label">{permKey}</label>
                                        <select
                                            className="form-select"
                                            value={selectedChat.permissions[permKey]}
                                            onChange={(e) =>
                                                handlePermissionChange(permKey, e.target.value)
                                            }
                                        >
                                            <option value="admin">Admin Only</option>
                                            <option value="all">Everyone</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Multiple Group Admins */}
                        <div className="mb-3">
                            <strong>Group Admin(s):</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {groupAdmin.length > 0 ? (
                                    groupAdmin.map(admin => (
                                        <div key={admin._id} className="d-flex flex-column align-items-center gap-2">
                                            <Avatar src={admin.avatar} width="4" height="4" size="14" isGroup={false} isOnline={onlineUsers?.has?.(admin._id) ?? false} />
                                            <span>{admin.username}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span> N/A </span>
                                )}
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <strong>Members ({selectedChat.users?.length || 0}):</strong>
                            {isAdmin && (
                                <button className="btn btn-sm btn-success" onClick={onAddMembers}>
                                    + Add Members
                                </button>
                            )}
                        </div>

                        <ul
                            className="list-unstyled mt-2"
                            style={{ maxHeight: 200, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {sortedMembers.map((u) => (
                                <li
                                    key={u._id}
                                    className="mb-2 d-flex align-items-center justify-content-between"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div
                                        className="d-flex align-items-center gap-2 w-100"
                                        style={{
                                            border: '1px solid white',
                                            borderRadius: '6px',
                                            padding: '6px',
                                            backgroundColor: u._id === currentUserId ? '#222' : 'transparent'
                                        }}
                                        onClick={() => setInspectedUser(u)}
                                    >
                                        <Avatar
                                            src={u.avatar}
                                            width="4"
                                            height="4"
                                            size="14"
                                            isGroup={false}
                                            isOnline={onlineUsers?.has?.(u._id) ?? false}
                                        />
                                        <span>
                                            {u.username}
                                            {u._id === currentUserId && ' (You)'}
                                        </span>
                                    </div>

                                    {isAdmin &&
                                        u._id !== currentUserId && (
                                            <button
                                                className="btn btn-sm btn-danger ms-2"
                                                onClick={() => {
                                                    if (window.confirm(`Remove ${u.username} from the group?`)) {
                                                        onRemoveUser(u._id);
                                                    }
                                                }}
                                            >
                                                ❌
                                            </button>
                                        )}
                                </li>
                            ))}
                        </ul>

                    </>
                ) : (
                    <>
                        <div className="mb-2">
                            <strong>Status:</strong> <span>{isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                        <div className="mb-2">
                            <strong>Date Joined:</strong> <span>{formatDate(date)}</span>
                        </div>
                    </>
                )}
            </div>

            <button
                className="btn btn-danger mt-auto"
                onClick={() => {
                    if (window.confirm(`Are you sure you want to delete the chat with ${isGroupChat ? chatName : username}? This action cannot be undone.`)) {
                        onDeleteChat(selectedChat._id);
                    }
                }}
            >
                Delete Chat
            </button>
        </div>
    );
};

export default ChatInfo;
