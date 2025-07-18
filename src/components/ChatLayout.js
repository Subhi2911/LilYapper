import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import chatBg from '../images/ChatBg.png';
import UserBar from './UserBar';
import Keyboard from './Keyboard';
import MessageBox from './MessageBox';
import ChatReceiver from './ChatReceiver';

const ChatLayout = (props) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [selectedChat, setSelectedChat] = useState(null);
    const messages = [
        { type: 'received', text: 'Hello! 👋 How are you today?' },
        { type: 'sent', text: 'I am good, thanks! Just working on some React code.' },
        { type: 'received', text: 'That’s awesome! React is pretty cool.' },
        { type: 'sent', text: 'Yeah, totally. Have you tried hooks yet?' },
        { type: 'received', text: 'Yes, I love useState and useEffect.' },
        { type: 'sent', text: 'Great! Here’s a longer message to test how text wraps and if the box grows properly when typing a large message. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula.' },
        { type: 'received', text: 'Looks like it’s working perfectly!' },
        { type: 'sent', text: 'Awesome! 🎉' },
        { type: 'received', text: 'Catch up later, bye!' },
        { type: 'sent', text: 'Bye 👋' },
    ];


    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setSelectedChat(null);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const chatList = ["Alice", "Bob", "Charlie", "David", "Eve"];
    const verticalNavbarWidth = 50;

    return (
        <div
            className="d-flex"
            style={{
                position: 'absolute',
                left: isMobile ? 0 : `${verticalNavbarWidth}px`,
                top: 0,
                right: 0,
                bottom: 0,
                height: '100vh',
                overflow: 'hidden',
                backgroundColor: '#f8f9fa',
            }}
        >
            {/* Left Sidebar */}
            {(!isMobile || !selectedChat) && (
                <div style={{
                    width: isMobile ? '100%' : '350px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: isMobile ? 'none' : '1px solid #ccc',
                    backgroundColor: '#5459AC',
                }}>
                    <Navbar />
                    <div className="p-3 overflow-auto" style={{ flex: 1 }}>
                        <h5 className="text-white mb-3">Chats</h5>
                        <ul className="list-group">
                            {chatList.map(name => (
                                <li
                                    key={name}
                                    className="list-group-item  my-2"
                                    onClick={() => isMobile ? setSelectedChat(name) : null}
                                    style={{ cursor: 'pointer', borderRadius:'inherit' }}
                                >
                                    <ChatReceiver name={name}/>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            )}

            {/* Right Chat Area */}
            {(!isMobile || selectedChat) && (
                <div
                    className="flex-grow-1 d-flex flex-column"
                    style={{
                        backgroundImage: `url(${chatBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        width: isMobile ? '100%' : 'auto',
                    }}
                >
                    {/* 👇 Clean UserBar - no wrapper frame */}


                    {isMobile && selectedChat && (
                        <div className="px-3 mt-2">
                            <button
                                className="btn btn-sm btn-light"
                                onClick={() => setSelectedChat(null)}
                            >
                                ← Back to chats
                            </button>
                        </div>
                    )}
                    <UserBar name={props.name}/>
                    {/* Chat Content */}
                    <div className="flex-grow-1 overflow-auto hide-scrollbar" style={{ padding: '1rem', height: 'calc(100vh - 150px)' }}>
                        <div style={{ backgroundColor: 'transparent', padding: '1rem', borderRadius: '8px' }}>
                            <MessageBox messages={messages} />
                        </div>
                    </div>
                    <div style={{
                        //backgroundColor: '#e1e7f0',
                        padding: '10px 16px',
                        //borderTop: '1px solid #ccc',
                        position: 'relative',
                        zIndex: 10,
                    }}>
                        <Keyboard />
                    </div>

                </div>
            )}

        </div>
    );
};

export default ChatLayout;
