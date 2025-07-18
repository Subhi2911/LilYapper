import React, { useEffect, useRef } from 'react';

const MessageBox = ({ messages = [] }) => {
    const containerRef = useRef(null);

    // Scroll to bottom whenever messages change
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
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderRadius: '10px',
            }}
        >
            {messages.map((msg, index) => (
                <div
                    key={index}
                    style={{
                        display: 'flex',
                        justifyContent: msg.type === 'sent' ? 'flex-end' : 'flex-start',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: msg.type === 'sent' ? '#52357B' : '#e4e6eb',
                            color: msg.type === 'sent' ? '#fff' : '#000',
                            padding: '10px 16px',
                            borderRadius: '18px',
                            maxWidth: '70%',
                            fontSize: '0.95rem',
                            wordBreak: 'break-word',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                    >
                        {msg.text}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageBox;
