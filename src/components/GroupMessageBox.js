import React from 'react';
import Avatar from './Avatar';
import moment from 'moment';

// Generate consistent color for each username
const generateColor = (username = '') => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

const GroupMessageBox = ({ messages = [], currentUser, onReply, onDeleteMessage, onEditMessage, setEditingMessageId, setEditingText }) => {
  return (
    <div className="d-flex flex-column gap-2">
      {console.log(messages)}
      {messages.map((msg, index) => {
        const isSystem = msg.isSystem;
        const isCurrentUser = msg.sender?._id === currentUser?._id;
        const nameColor = generateColor(msg.sender?.username);

        if (isSystem) {
          return (
            <div
              key={index}
              className="text-center text-muted my-2"
              style={{ fontSize: '0.85rem' }}
            >
              {msg.content}
            </div>
          );
        }

        const replied = msg.replyTo;

        return (
          <div
            key={index}
            className={`d-flex ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}
            style={{ position: 'relative' }} // Needed for reply icon absolute pos
          >
            {!isCurrentUser && (
              <Avatar
                src={msg.sender?.avatar || '/avatars/laughing.png'}
                width="2"
                height="2"
                className="me-2"
              />
            )}
            {isCurrentUser && (
              <>
                <div className='d-flex align-items-center gap-3' style={{ cursor: 'pointer' }}>
                  <div onClick={() => {
                    setEditingMessageId(msg._id);
                    setEditingText(msg.text); // Prefill text in Keyboard
                  }} style={{ fontSize: '0.8rem' }}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </div>
                  <div onClick={() => { onDeleteMessage(msg._id) }} style={{ fontSize: '0.8rem' }}>
                    <i className="fa-solid fa-trash"></i>
                  </div>

                </div>
              </>
            )}

            <div className="mx-2" style={{ maxWidth: '70%', position: 'relative' }}>
              {/* Sender's name */}
              {!isCurrentUser && msg.sender?.username && (
                <div
                  className="fw-bold mb-1"
                  style={{
                    fontSize: '0.85rem',
                    color: nameColor,
                    textShadow: `
                      0.2px 0 black, 
                      -0.2px 0 white, 
                      0 0.2px black, 
                      0 -0.2px black
                    `,
                  }}
                >
                  {msg.sender?.username}
                </div>
              )}

              {/* Replied message preview */}
              {replied && (
                <div
                  style={{
                    backgroundColor: isCurrentUser ? '#6e4d99' : '#e0e0e0',
                    color: isCurrentUser ? '#ddd' : '#444',
                    padding: '6px 10px',
                    borderLeft: '4px solid #888',
                    borderRadius: '8px',
                    marginBottom: '3px',
                    fontSize: '0.85rem',
                  }}
                >
                  <strong>{replied.sender?.username || 'Unknown'}: </strong>
                  {replied.content || replied.text || 'Message unavailable'}
                </div>
              )}


              {/* Actual message */}
              <div
                className="p-2 rounded-3 shadow-sm"
                style={{
                  backgroundColor: isCurrentUser ? '#52357B' : '#f1f1f1',
                  color: isCurrentUser ? 'white' : 'black',
                  whiteSpace: 'normal',
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                  maxWidth: '300px',
                  margin: 'auto',
                }}
              >
                {msg.text}
              </div>

              {/* Reply icon for messages NOT sent by current user */}
              {!isCurrentUser && onReply && (
                <i
                  className="fa-solid fa-reply fa-flip-horizontal"
                  onClick={() => onReply(msg)}
                  style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    bottom: '20px',
                    right: '-25px',
                    fontSize: '14px',
                    userSelect: 'none',

                  }}
                  title="Reply to this message"
                />
              )}

              {/* Timestamp */}
              <div className="text-end text-muted" style={{ fontSize: '0.7rem' }}>
                {moment(msg.createdAt).format('h:mm A')}
              </div>
            </div>

            {isCurrentUser && (
              <Avatar
                src={msg.sender?.avatar || '/avatars/laughing.png'}
                width="2"
                height="2"
                className="ms-2"
                hideBorder={true}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GroupMessageBox;
