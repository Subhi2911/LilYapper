import React, { useContext, useEffect, useRef, useState } from 'react';
import chatBg from '../images/ChatBg.png';
import UserBar from './UserBar';
import MessageBox from './MessageBox';
import Keyboard from './Keyboard';
import { useLocation } from 'react-router-dom';
import RequestWindow from './RequestWindow';
import ChatContext from '../context/chats/ChatContext';
import GroupMessageBox from './GroupMessageBox';
import Spinner from './Spinner';
import { useSocket } from '../context/chats/socket/SocketContext';
import ChatInfo from './ChatInfo';

const ChatWindow = ({
    selectedChat,
    setSelectedChat,
    isMobile,
    users,
    showChatInfo,
    setShowChatInfo,
    sentRequests,
    pendingRequests,
    friends,
    handleSkip,
    selectedUser,
    setSelectedUser,
    handleAccept,
    handleReject,
    onDeleteChat
}) => {
    const location = useLocation();
    const { fetchMessages, sendmessage, currentUser } = useContext(ChatContext);
    const socket = useSocket();
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Set());

    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedChat?._id || !currentUser?._id) {
                setMessages([]);
                return;
            }

            try {
                const fetchedMessages = await fetchMessages(selectedChat._id);

                const typedMessages = (fetchedMessages || []).map((msg) => ({
                    ...msg,
                    type: msg.sender._id === currentUser._id ? 'sent' : 'received',
                    text: msg.content,
                }));

                setMessages(typedMessages);
            } catch (err) {
                console.error('Error loading messages:', err);
                setMessages([]);
            }
        };

        if (selectedChat?._id && currentUser?._id) {
            loadMessages();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat?._id, currentUser?._id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        const handleTyping = (typingUserId) => {
            if (typingUserId === currentUser._id) return;
            setTypingUsers((prev) => new Set(prev).add(typingUserId));
        };

        const handleStopTyping = (typingUserId) => {
            setTypingUsers((prev) => {
                const copy = new Set(prev);
                copy.delete(typingUserId);
                return copy;
            });
        };

        socket.on('typing', handleTyping);
        socket.on('stop typing', handleStopTyping);

        return () => {
            socket.off('typing', handleTyping);
            socket.off('stop typing', handleStopTyping);
        };
    }, [socket, currentUser?._id]);

    const typingTimeoutRef = useRef(null);
    const typingStartedRef = useRef(false);

    const handleUserTyping = () => {
        if (!socket || !selectedChat) return;

        if (!typingStartedRef.current) {
            typingStartedRef.current = true;
            socket.emit('typing', selectedChat._id);
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            typingStartedRef.current = false;
            socket.emit('stop typing', selectedChat._id);
        }, 2000);
    };

    const handleSend = async (newText) => {
        if (!newText.trim() || !selectedChat?._id) return;

        try {
            const newMessage = await sendmessage(newText, selectedChat._id);

            if (newMessage) {
                const typedMessage = {
                    ...newMessage,
                    type: newMessage.sender._id === currentUser._id ? 'sent' : 'received',
                    text: newMessage.content,
                };

                setMessages((prev) => [...prev, typedMessage]);
            }

            if (socket) {
                typingStartedRef.current = false;
                socket.emit('stop typing', selectedChat._id);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const typingUsernames = Array.from(typingUsers)
        .filter((id) => id !== currentUser._id)
        .map((id) => {
            const user = selectedChat?.users?.find((u) => u._id === id) || friends?.find((f) => f._id === id);
            return user?.username || 'Someone';
        });

    const showLilyapperWelcome =
        !selectedChat && !['/friends', '/arrequest', '/groups'].includes(location.pathname);

    if (!currentUser?._id) return <Spinner />;

    return (
        <div
            className="flex-grow-1 d-flex flex-column"
            style={{
                backgroundImage: `url(${chatBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: isMobile ? '100vw' : 'auto',
            }}
        >
            {(location.pathname === '/' || location.pathname === '/groups') && selectedChat && (
                <>
                    {!showChatInfo  && (<UserBar
                        name={selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.username}
                        isGroup={selectedChat.isGroupChat}
                        avatar={selectedChat?.avatar || '/avatars/laughing.png'}
                        setSelectedChat={setSelectedChat}
                        hideBorder={true}
                        selectedChat={selectedChat}
                        onDeleteChat={onDeleteChat}
                        setShowChatInfo={setShowChatInfo}
                    />)}

                    {/* Chat Info View */}
                    {showChatInfo ? (
                        <ChatInfo selectedChat={selectedChat} onBack={()=>setShowChatInfo(false)}/>
                        
                    ) : (
                        <>
                            <div
                                className="flex-grow-1 overflow-auto hide-scrollbar w-100"
                                style={{ padding: '1rem', height: 'calc(100vh - 180px)' }}
                            >
                                <div style={{ padding: '1rem', borderRadius: '8px' }}>
                                    {selectedChat?.isGroupChat ? (
                                        <GroupMessageBox messages={messages} currentUser={currentUser} />
                                    ) : (
                                        <MessageBox messages={messages} currentUser={currentUser} />
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            <div
                                className="px-3"
                                style={{
                                    minHeight: '24px',
                                    fontSize: '0.9rem',
                                    color: '#666',
                                    fontStyle: 'italic',
                                    marginBottom: '4px',
                                    height: '24px',
                                    overflow: 'hidden',
                                }}
                            >
                                {typingUsernames.length === 1
                                    ? `${typingUsernames[0]} is typing...`
                                    : typingUsernames.length > 1
                                    ? `${typingUsernames.join(', ')} are typing...`
                                    : ''}
                            </div>

                            <div
                                style={{
                                    padding: '10px 16px',
                                    position: 'relative',
                                    zIndex: 10,
                                    width: '100%',
                                }}
                            >
                                <Keyboard onSend={handleSend} onTyping={handleUserTyping} />
                            </div>
                        </>
                    )}
                </>
            )}

            {(location.pathname === '/friends' || location.pathname === '/arrequest') && (
                <RequestWindow
                    selectedUser={selectedUser || selectedChat}
                    setSelectedUser={setSelectedUser || setSelectedChat}
                    users={users}
                    sentRequests={sentRequests}
                    pendingRequests={pendingRequests}
                    friends={friends}
                    handleSkip={handleSkip}
                    handleAccept={handleAccept}
                    handleReject={handleReject}
                    handleBack={() => {
                        if (setSelectedUser) setSelectedUser(null);
                        else if (setSelectedChat) setSelectedChat(null);
                    }}
                    isMobile={isMobile}
                    setSelectedChat={setSelectedChat}
                />
            )}

            {showLilyapperWelcome && (
                <div className="text-center mt-5">
                    <img
                        src={require('../images/lilyapper.png')}
                        alt="lilyapper"
                        style={{ maxWidth: 300, opacity: 0.8 }}
                    />
                    <h4 className="mt-3">LilYapper - Because Silence is Boring</h4>
                    <p className="text-muted">A real-time chat app with private & group messaging.</p>
                    <p className="text-muted">Select a chat to start messaging.</p>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
