import React from 'react';
import Avatar from './Avatar';

const ChatInfo = ({ selectedChat, onBack, onDeleteChat }) => {
  if (!selectedChat) return null;

  const {
    avatar,
    chatName,
    username,
    bio,
    dateOfJoining,
    isGroupChat,
    groupAdmin,
    users,
    isOnline,
  } = selectedChat;

  // Format dateOfJoining nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    console.log(selectedChat)
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="p-4 text-white d-flex flex-column"
      style={{
        height: '100vh',
        backgroundColor: '#52357B',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
    >
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
            style={{ fontStyle: 'italic', opacity: 0.8, maxWidth: '100%' }}
          >
            {bio}
          </p>
        )}
      </div>

      <div className="flex-grow-1 overflow-auto">
        {isGroupChat ? (
          <>
            <div className="mb-3">
              <strong>Group Admin:</strong>{' '}
              <span>{groupAdmin?.username || 'N/A'}</span>
            </div>
            <div>
              <strong>Members ({users?.length || 0}):</strong>
              <ul className="list-unstyled mt-2" style={{ maxHeight: 200, overflowY: 'auto' }}>
                {users?.map((u) => (
                  <li key={u._id} className="mb-1">
                    <Avatar
                      src={u.avatar}
                      size={30}
                      isGroup={false}
                      style={{ marginRight: 10 }}
                    />
                    {u.username}
                  </li>
                )) || <li>No members</li>}
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="mb-2">
              <strong>Status:</strong>{' '}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <div className="mb-2">
              <strong>Date Joined:</strong> <span>{formatDate(dateOfJoining)}</span>
            </div>
          </>
        )}
      </div>

      <button
        className="btn btn-danger mt-auto"
        onClick={() => {
          if (
            window.confirm(
              `Are you sure you want to delete the chat with ${
                isGroupChat ? chatName : username
              }? This action cannot be undone.`
            )
          ) {
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
