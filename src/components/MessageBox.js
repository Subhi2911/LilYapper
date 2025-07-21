import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import Avatar from './Avatar';

const MessageBox = ({ messages = [], currentUser }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="message-container hide-scrollbar"
      style={{
        flexGrow: 1,
        padding: '10px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflowY: 'auto',
      }}
    >
      {messages.map((msg, index) => {
        const isSent = msg.sender._id === currentUser._id;

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isSent ? 'flex-end' : 'flex-start',
              maxWidth: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: isSent ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: '8px',
              }}
            >
              <Avatar
                src={msg.sender.avatar || '/avatars/laughing.png'}
                width="2"
                height="2"
                hideBorder={ isSent?true:false}
              />

              <div
                style={{
                  backgroundColor: isSent ? '#52357B' : '#f0f2f5',
                  color: isSent ? '#fff' : '#000',
                  padding: '10px 14px',
                  borderRadius: '18px',
                  maxWidth: '70%',
                  fontSize: '0.95rem',
                  wordBreak: 'break-word',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
              >
                {msg.text}
              </div>
            </div>

            <div
              style={{
                fontSize: '0.72rem',
                color: isSent?'white':'black',
                marginTop: '4px',
                paddingLeft: isSent ? '0' : '40px',
                paddingRight: isSent ? '40px' : '0',
              }}
            >
              {moment(msg.createdAt).format('h:mm A')}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageBox;
