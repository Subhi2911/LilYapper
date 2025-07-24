import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import Avatar from './Avatar';

const MessageBox = ({ messages = [], currentUser, onReply, onDeleteMessage, onEditMessage, setEditingMessageId, setEditingText, selectedChat }) => {
  const containerRef = useRef(null);
  const receiverbubble = selectedChat?.wallpaper?.receiverbubble || 'white';
  const senderbubble = selectedChat?.wallpaper?.senderbubble || '#52357B';

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
        // System message
        if (msg.isSystem || msg.type === 'system') {
          return (
            <div
              key={index}
              className="text"
              style={{
                textAlign: 'center',
                fontSize: '0.85rem',
                color: 'white',
                textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)',
                fontStyle: 'italic',
              }}
            >
              {msg.content || msg.text}
            </div>
          );
        }

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
                hideBorder={isSent}
              />


              <div
                style={{
                  backgroundColor: isSent ? senderbubble : receiverbubble,
                  color: isSent ? '#fff' : '#000',
                  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)',
                  padding: '10px 14px',
                  borderRadius: '18px',
                  maxWidth: '70%',
                  fontSize: '0.95rem',
                  wordBreak: 'break-word',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  position: 'relative',
                }}
              >
                {/* Replied message preview */}
                {msg.replyTo && (
                  <div
                    style={{
                      backgroundColor: isSent ? senderbubble : receiverbubble,
                      color: isSent ? '#ddd' : '#444',
                      padding: '6px 10px',
                      borderLeft: '4px solid #888',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      fontSize: '0.85rem',
                    }}
                  >
                    <strong>{msg.replyTo.sender?.username || 'Unknown'}: </strong>
                    {msg.replyTo.content || msg.replyTo.text || 'Message unavailable'}
                  </div>
                )}

                {msg.text}

                {/* Reply icon for messages NOT sent by current user */}
                {!isSent && (
                  <i
                    className="fa-solid fa-reply fa-flip-horizontal"
                    onClick={() => onReply(msg)}
                    style={{
                      cursor: 'pointer',
                      position: 'absolute',
                      bottom: 4,
                      right: '-30px',
                      fontSize: '14px',
                      userSelect: 'none',
                      color:receiverbubble
                    }}
                    title="Reply to this message"
                  />

                )}
              </div>
              {isSent && (
                <>
                  <div className='d-flex align-items-center gap-3' style={{ cursor: 'pointer' ,color:receiverbubble,}}>
                    <div onClick={() => {
                      setEditingMessageId(msg._id);
                      setEditingText(msg.text); // Prefill text in Keyboard
                    }} style={{ fontSize: '0.8rem' }}>
                      <i className="fa-solid fa-pen-to-square" ></i>
                    </div>
                    <div onClick={() => { onDeleteMessage(msg._id) }} style={{ fontSize: '0.8rem', color:receiverbubble, }}>
                      <i className="fa-solid fa-trash" ></i>
                    </div>

                  </div>
                </>
              )}
              
            </div>

            <div
              style={{
                fontSize: '0.72rem',
                color: 'white',
                textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)',
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
