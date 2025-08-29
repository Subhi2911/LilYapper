import React from 'react';
import Avatar from './Avatar';
import moment from 'moment';
import Stamp from './Stamp';


const ChatReceiver = ({
  avatar,
  name,
  latestMessage,
  onlineUsers,
  unreadCount,
  isGroup,
  lastMessageTime,
  sent,
  id,
  selectedChat,
  setSelectedChat,
  readBy
}) => {
  let isOnline = false;

  if (!isGroup && id) {
    isOnline = onlineUsers.has(id);
  }
  return (
    <div className="p-2 border-bottom" >
      <div className="d-flex justify-content-between align-items-center mb-1" >
        <div className="d-flex align-items-center" >

          <Avatar
            src={avatar}
            width="2"
            height="2"
            size="12"
            isOnline={isOnline}
            isGroup={isGroup}
            name={name}
          />
          

          <p className="mb-0 ms-3 fw-semibold">{name}</p>
        </div>

        <div className="text-muted small text-nowrap">
          {lastMessageTime ? moment(lastMessageTime).format('h:mm A') : ''}
        </div>

      </div>

      <div className="d-flex justify-content-between align-items-center">
        {/* Sent status or icon */}
        <div className="text-muted small me-3" style={{ minWidth: '50px' }}>
          {sent}
        </div>

        {/* Latest message with text truncation */}
        <p
          className="mb-0 text-truncate flex-grow-1"
          style={{ fontSize: '0.9rem' }}
          title={latestMessage}
        >
          {`${latestMessage.slice(0, 15)} ${latestMessage.length > 15 ? '...' : ''}`}
        </p>
        

        {/* Unread badge */}
        {unreadCount > 0 ? (
          <span className="badge bg-danger ms-3">{unreadCount}</span>
        ): <Stamp/>}
        
      </div>
    </div>
  );
};

export default ChatReceiver;
