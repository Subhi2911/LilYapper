import React from 'react';
import Avatar from './Avatar';
import moment from 'moment';

// Generate consistent color for each username
const generateColor = (username) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

const GroupMessageBox = ({ messages = [], currentUser }) => {
  return (
    <div className="d-flex flex-column gap-2">
      {messages.map((msg, index) => {
        const isCurrentUser = msg.sender._id === currentUser._id;
        const nameColor = generateColor(msg.sender.username);

        return (
          <div
            key={index}
            className={`d-flex ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}
          >
            {!isCurrentUser && (
              <Avatar
                src={msg.sender.avatar || '/avatars/laughing.png'}
                width="2" height="2"
                className="me-2"
              />
            )}

            <div className='mx-2' style={{ maxWidth: '70%' }}>
              {!isCurrentUser && (
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
                    `
                  }}
                >
                  {msg.sender.username}
                </div>
              )}
              <div
                className={`p-2 rounded-3 shadow-sm ${
                  isCurrentUser ? 'bg-primary text-dark' : 'text-light'
                }`}
                style={{ backgroundColor: '#52357B' }}
              >
                {msg.text}
              </div>
              <div className="text-end text-muted" style={{ fontSize: '0.7rem' }}>
                {moment(msg.createdAt).format('h:mm A')}
              </div>
            </div>

            {isCurrentUser && (
              <Avatar
                src={msg.sender.avatar || '/avatars/laughing.png'}
                width="2" height="2"
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
