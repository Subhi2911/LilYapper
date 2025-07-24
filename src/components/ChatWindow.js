import React, { useContext, useEffect, useRef, useState } from 'react';
import UserBar from './UserBar';
import MessageBox from './MessageBox';
import Keyboard from './Keyboard';
import { useLocation, useNavigate } from 'react-router-dom';
import RequestWindow from './RequestWindow';
import ChatContext from '../context/chats/ChatContext';
import GroupMessageBox from './GroupMessageBox';
import Spinner from './Spinner';
import { useSocket } from '../context/chats/socket/SocketContext';
import ChatInfo from './ChatInfo';
import UserDetails from './UserDetails';
import AddMembersModal from './AddMembersModal';
import WallpaperSelectorModal from './WallpaperSelectorModal';

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
    onDeleteChat,
    onRemoveFriend,
    inspectedUser,
    setInspectedUser,
    handleMakeAdmin,
    handleRemoveUser,
    removeFromGroup,
    addToGroup,
    setShowAddMembersModal,
    showAddMembersModal,
    handleAddMembers,
    onAddSystemMessage,
    updateGroupLatestMessage
}) => {
    const location = useLocation();
    const host = process.env.REACT_APP_BACKEND_URL;
    const { fetchMessages, sendmessage, currentUser, loadingUser } = useContext(ChatContext);
    const socket = useSocket();
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const [isFriend, setIsFriend] = useState(true);
    const [replyTo, setReplyTo] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const wallpaperUrl = selectedChat?.wallpaper?.url;
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    // eslint-disable-next-line no-unused-vars
    const [showWallpaperModal, setShowWallpaperModal] = useState(false);
    const navigate = useNavigate();

    const handleReply = (msg) => {
        setReplyTo(msg);
    };

    const cancelReply = () => {
        setReplyTo(null);
    };
    useEffect(() => {
        if (selectedChat && socket) {
            socket.emit('join chat', selectedChat._id);
        }
    }, [selectedChat, socket]);

    useEffect(() => {
        if (!socket) return;

        const handleMessageReceived = (newMessage) => {
            // Only add if it's for the selected chat
            if (newMessage.chat._id === selectedChat?._id) {
                setMessages(prev => [...prev, newMessage]);
            }
        };

        socket.on('message received', handleMessageReceived);

        return () => {
            socket.off('message received', handleMessageReceived);
        };
    }, [socket, selectedChat?._id]);

    useEffect(() => {
        if (!socket) return;

        const handleUserOnlineStatus = (onlineUserIds) => {
            setOnlineUsers(new Set(onlineUserIds));
        };

        socket.on('user-online-status', handleUserOnlineStatus);

        return () => {
            socket.off('user-online-status', handleUserOnlineStatus);
        };
    }, [socket]);

    useEffect(() => {
        console.log('hgdg', selectedChat)
        if (selectedChat && !isMobile) {
            const checkFriendship = async () => {
                if (!selectedChat || selectedChat.isGroupChat) {
                    setIsFriend(true);
                    return;
                }

                try {
                    const response = await fetch(`${host}/api/auth/friends`, {
                        headers: {
                            'auth-token': localStorage.getItem('token'),
                        },
                    });

                    const data = await response.json();
                    const friendIds = data.map(friend => friend._id);
                    setIsFriend(friendIds.includes(selectedChat.otherUserId));
                } catch (error) {
                    console.error('Error checking friendship:', error);
                    setIsFriend(false);
                }
            };

            checkFriendship();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat, isMobile]);

    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (newMsg) => {
            // Check if it's for the currently selected chat
            if (selectedChat && selectedChat._id === newMsg.chat._id) {
                setMessages(prev => [...prev, newMsg]);
            } else {
                // Optionally show notification or unread indicator
            }
        });

        return () => {
            socket.off('new-message');
        };
    }, [socket, selectedChat]);


    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedChat?._id || !currentUser?._id) {
                setMessages([]);
                return;
            }

            try {
                const fetchedMessages = await fetchMessages(selectedChat?._id);

                const typedMessages = (fetchedMessages || []).map((msg) => ({
                    ...msg,
                    type: msg.sender?._id === currentUser._id ? 'sent' : 'received',
                    text: msg?.content,
                    replyTo: msg.replyTo,
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
    }, [selectedChat?._id, currentUser?._id, fetchMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg) => {
            if (selectedChat && msg.chat._id === selectedChat._id) {
                setMessages((prev) => [...prev, {
                    ...msg,
                    type: msg.sender._id === currentUser._id ? 'sent' : 'received',
                    text: msg.content,
                    replyTo: msg.replyTo,
                }]);
            } else {
                //..
            }
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, selectedChat, currentUser]);

    useEffect(() => {
        if (!socket || !currentUser) return;
        socket.emit('join', currentUser._id);
    }, [socket, currentUser]);


    useEffect(() => {
        if (!socket) return;

        const handleTyping = ({ chatId, userId }) => {
            if (chatId !== selectedChat._id) return;
            if (userId === currentUser?._id) return;

            setTypingUsers((prev) => new Set(prev).add(userId));
        };

        const handleStopTyping = ({ chatId, userId }) => {
            if (chatId !== selectedChat?._id) return;

            setTypingUsers((prev) => {
                const copy = new Set(prev);
                copy.delete(userId);
                return copy;
            });
        };


        socket.on('typing', handleTyping);
        socket.on('stop typing', handleStopTyping);

        return () => {
            socket.off('typing', handleTyping);
            socket.off('stop typing', handleStopTyping);
        };
    }, [socket, currentUser?._id, selectedChat?._id]);

    const typingTimeoutRef = useRef(null);
    const typingStartedRef = useRef(false);

    const handleUserTyping = () => {
        if (!socket || !selectedChat) return;

        if (!typingStartedRef.current) {
            typingStartedRef.current = true;
            socket.emit('typing', {
                chatId: selectedChat?._id,
                userId: currentUser?._id,
            });
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            typingStartedRef.current = false;
            socket.emit('stop typing', {
                chatId: selectedChat?._id,
                userId: currentUser?._id,
            });
        }, 2000);
    };

    const handleSend = async (newText) => {

        if (!newText.trim() || !selectedChat?._id) return;

        try {
            const newMessage = await sendmessage(newText, selectedChat._id, replyTo?._id || null);

            if (newMessage && newMessage.sender && newMessage.content) {
                const typedMessage = {
                    ...newMessage,
                    type: newMessage.sender._id === currentUser._id ? 'sent' : 'received',
                    text: newMessage.content,
                    replyTo: newMessage.replyTo ? {
                        _id: newMessage.replyTo._id,
                        text: newMessage.replyTo.content || '[deleted]',
                        sender: newMessage.replyTo.sender || { _id: '', username: 'Unknown' }
                    } : null,
                };


                setMessages((prev) => [...prev, typedMessage]);
                setReplyTo(null);

                // Update latest message for groups immediately
                if (selectedChat.isGroupChat && typeof updateGroupLatestMessage === 'function') {
                    updateGroupLatestMessage(selectedChat._id, typedMessage);
                }

            } else {
                console.warn('Empty or invalid message returned', newMessage);
            }
            // Emit the message through socket after updating UI
            if (socket) {
                socket.emit('send-message', newMessage);
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

    //edit messages
    const handleEditMessage = async (id, newText) => {
        try {
            const res = await fetch(`${host}/api/message/edit/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ newText }),
            });

            if (!res.ok) {
                const error = await res.json();
                console.error('Edit failed:', error.error);
                return;
            }

            // eslint-disable-next-line no-unused-vars
            const data = await res.json();
            setMessages(prev =>
                prev.map(msg => (msg._id === id ? { ...msg, text: newText } : msg))
            );
        } catch (err) {
            console.error('Edit message error:', err.message);
        }
    };


    //Delete Message
    const handleDeleteMessage = async (messageId) => {
        try {
            const response = await fetch(`${host}/api/message/delete/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                // Remove deleted message from local messages state
                setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== messageId));

                // If deleted message was the latest message in the chat, update latest message accordingly
                if (selectedChat.latestMessage?._id === messageId) {
                    // Find the new latest message after deletion (last message in messages)
                    const newLatestMessage = messages
                        .filter(msg => msg._id !== messageId)
                        .slice(-1)[0] || null;

                    // Update latestMessage in selectedChat state and optionally global chat list
                    setSelectedChat(prevChat => ({
                        ...prevChat,
                        latestMessage: newLatestMessage,
                    }));

                    // Also call a function to update the chat list/global state if you have one
                    if (typeof updateGroupLatestMessage === 'function') {
                        updateGroupLatestMessage(selectedChat._id, newLatestMessage);
                    }
                }
            } else {
                console.warn('Failed to delete message:', data.error);
            }
        } catch (err) {
            console.error('Error deleting message:', err);
        }
    }

    console.log(typingUsers)
    const typingUsernames = Array.from(typingUsers)
        .map((id) => {
            // For personal chat, get the username from `otherUserId`
            if (!selectedChat.isGroupChat) {
                // For personal chat, selectedChat.otherUserId is the other user
                if (id === selectedChat.otherUserId) {
                    return selectedChat.username; // or however you store username
                }
            } else {
                // For groups, search users array for matching _id
                const user = selectedChat.users?.find((u) => u._id === id);
                if (user) return user.username;
            }

            // fallback to friends list or 'Someone'
            const friendUser = friends?.find((f) => f._id === id);
            return friendUser?.username || 'Someone';
        });



    const showLilyapperWelcome =
        !selectedChat && !['/friends', '/arrequest', '/groups'].includes(location.pathname);
    console.log('currentUser:', currentUser);

    if (loadingUser) return <Spinner />;
    if (!currentUser?._id) {
        // optionally redirect to login
        return navigate("/login");
    }
    return (
        <div
            className="flex-grow-1 d-flex flex-column"
            style={{
                backgroundImage: wallpaperUrl ? `url(${wallpaperUrl})` : '',
                backgroundColor: '#5459AC',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: isMobile ? '100vw' : 'auto',
            }}
        >
            {(location.pathname === '/' || location.pathname === '/groups') && selectedChat && (
                <>
                    {/* Main Chat UI */}
                    <>
                        <UserBar
                            name={selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.username}
                            isGroup={selectedChat.isGroupChat}
                            avatar={selectedChat?.avatar || '/avatars/laughing.png'}
                            setSelectedChat={setSelectedChat}
                            hideBorder={true}
                            selectedChat={selectedChat}
                            onDeleteChat={onDeleteChat}
                            setShowChatInfo={setShowChatInfo}
                            onRemoveFriend={onRemoveFriend}
                            setInspectedUser={setInspectedUser}
                            setShowWallpaperModal={setShowWallpaperModal}
                            currentUser={currentUser}
                            onlineUsers={onlineUsers}
                        />

                        <div
                            className="flex-grow-1 overflow-auto hide-scrollbar w-100"
                            style={{ padding: '1rem', height: 'calc(100vh - 180px)' }}
                        >
                            <div style={{ padding: '1rem', borderRadius: '8px' }}>
                                {selectedChat?.isGroupChat ? (
                                    <GroupMessageBox messages={messages} currentUser={currentUser} onReply={handleReply} onDeleteMessage={handleDeleteMessage} onEditMessage={handleEditMessage} setEditingMessageId={setEditingMessageId} setEditingText={setEditingText} />
                                ) : (
                                    <MessageBox messages={messages} currentUser={currentUser} onReply={handleReply} onDeleteMessage={handleDeleteMessage} onEditMessage={handleEditMessage} setEditingMessageId={setEditingMessageId} setEditingText={setEditingText} selectedChat={selectedChat} />
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <div
                            className="px-3"
                            style={{
                                minHeight: '24px',
                                fontSize: '0.9rem',
                                color: '#78C841',
                                fontStyle: 'italic',
                                marginBottom: '4px',
                                height: '24px',
                                overflow: 'hidden',
                            }}
                        >
                            {console.log(typingUsernames)}
                            {typingUsernames.length === 1
                                ? `${typingUsernames[0]} is typing...`
                                : typingUsernames.length > 1
                                    ? `${typingUsernames.join(', ')} are typing...`
                                    : ''}
                        </div>
                        {replyTo && (
                            <div
                                style={{
                                    backgroundColor: '#ddd',
                                    padding: '8px 12px',
                                    marginBottom: '8px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <div style={{ flex: 1, fontSize: '0.9rem' }}>
                                    Replying to: <strong>{replyTo.text}</strong>
                                </div>
                                <button
                                    onClick={cancelReply}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        color: '#555',
                                    }}
                                    title="Cancel reply"
                                >
                                    &times;
                                </button>
                            </div>
                        )}

                        <div
                            style={{
                                padding: '10px 16px',
                                position: 'relative',
                                zIndex: 10,
                                width: '100%',
                            }}
                        >
                            <Keyboard onSend={(text) => {
                                if (editingMessageId) {
                                    handleEditMessage(editingMessageId, text);  // edit existing
                                    setEditingMessageId(null);
                                    setEditingText('');
                                } else {
                                    handleSend(text);  // regular send
                                }
                            }}
                                editingText={editingText}
                                setEditingText={setEditingText}
                                isEditing={!!editingMessageId}
                                onTyping={handleUserTyping}
                                isDisabled={!isFriend} />
                        </div>
                    </>

                    {/* MODAL OVERLAY */}
                    {showChatInfo && (
                        <div
                            className="modal show d-block"
                            tabIndex="-1"

                        >
                            <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down modal-lg">
                                <div className="modal-content bg-dark text-white position-relative">
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                                        aria-label="Close"
                                        onClick={() => setShowChatInfo(false)}
                                    ></button>

                                    <div className="modal-body p-4" style={{ backgroundColor: '#648DB3', padding: '5px' }}>
                                        <div style={{ border: '1px solid white' }}>
                                            {inspectedUser ? (
                                                <UserDetails
                                                    user={inspectedUser}
                                                    currentUser={currentUser} // From auth or context
                                                    groupAdmin={selectedChat.groupAdmin}
                                                    onMakeAdmin={handleMakeAdmin}
                                                    onRemove={handleRemoveUser}
                                                    onClose={() => setInspectedUser(null)}
                                                    removeFromGroup={removeFromGroup}
                                                    selectedChat={selectedChat}
                                                />
                                            ) : (
                                                <>
                                                    <ChatInfo
                                                        selectedChat={selectedChat}
                                                        onBack={() => setShowChatInfo(false)}
                                                        selectedUser={selectedUser}
                                                        setInspectedUser={setInspectedUser}
                                                        removeFromGroup={removeFromGroup}
                                                        onAddMembers={() => setShowAddMembersModal(true)}
                                                        currentUserId={currentUser._id}
                                                        addToGroup={addToGroup}
                                                    />
                                                    {showAddMembersModal && (
                                                        <AddMembersModal
                                                            show={showAddMembersModal}
                                                            onClose={() => setShowAddMembersModal(false)}
                                                            friendsList={[...friends]}
                                                            existingUserIds={selectedChat?.users?.map(u => u._id) || []}
                                                            chatId={selectedChat._id}
                                                            friends={friends}
                                                            onSubmit={addToGroup}
                                                            onAddSystemMessage={onAddSystemMessage}
                                                        />
                                                    )}

                                                </>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {showWallpaperModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                            <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
                                <WallpaperSelectorModal
                                    chatId={selectedChat._id}
                                    onClose={() => setShowWallpaperModal(false)}
                                    selectedChat={selectedChat}
                                    setSelectedChat={setSelectedChat}
                                />
                            </div>
                        </div>
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
