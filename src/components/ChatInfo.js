import React from 'react';
import Avatar from './Avatar';

const ChatInfo = ({
    selectedChat,
    onBack,
    onDeleteChat,
    selectedUser,
    setInspectedUser,
    removeFromGroup,
    onAddMembers
}) => {
    if (!selectedChat) return null;

    const { avatar, username, bio, date, isGroupChat, chatName, groupAdmin } = selectedChat;
    const isAdmin= groupAdmin?._id===localStorage.getItem('userId');

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const onRemoveUser=(id)=>{
        console.log('dhaka',selectedChat._id)
        removeFromGroup(selectedChat._id,[id]);
    }

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
                <Avatar src={avatar} size={120} isGroup={isGroupChat} />
                <h3 className="mt-3 text-center">
                    {isGroupChat ? chatName : username}
                </h3>
                {bio && (
                    <p
                        className="text-center mt-2"
                        style={{ fontStyle: 'italic', opacity: 0.8 }}
                    >
                        {bio}
                    </p>
                )}
            </div>

            <div className="flex-grow-1 overflow-auto w-100">
                {isGroupChat ? (
                    <>
                    {console.log('ddddd',selectedChat)}
                        <div className="mb-3 d-flex gap-4 align-items-center">
                            <strong>Group Admin:</strong>
                            <span>{selectedChat.groupAdmin?.username || 'N/A'}</span>
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
                            {selectedChat.users?.map((u) => (
                                <li key={u._id} className="mb-2 d-flex align-items-center justify-content-between" style={{ cursor: 'pointer' }}>
                                    <div
                                        className="d-flex align-items-center gap-2 w-100"
                                        style={{
                                            border: '1px solid white',
                                            borderRadius: '6px',
                                            padding: '6px'
                                        }}
                                        onClick={() => setInspectedUser(u)}
                                    >
                                        <Avatar src={u.avatar} width="4" height="4" size="14" isGroup={false} />
                                        <span>{u.username}</span>
                                    </div>
                                    {isAdmin && selectedChat.groupAdmin?._id !== u._id && (
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
                            )) || <li>No members</li>}
                        </ul>
                    </>
                ) : (
                    <>
                        <div className="mb-2">
                            <strong>Status:</strong>{' '}
                            <span>{selectedChat.isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                        <div className="mb-2">
                            <strong>Date Joined:</strong>{' '}
                            <span>{formatDate(date)}</span>
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
