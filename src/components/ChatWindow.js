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
import ChatWinPlaceholder from './ChatWinPlaceholder';

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
    updateGroupLatestMessage,
    updateChatLatestMessage,
    setGroups,
    setLocalChatList,
    markMessagesAsRead,
    handlePermissionChange,
    messages,
    setMessages,
    getConnections,

}) => {
    const location = useLocation();
    const host = process.env.REACT_APP_BACKEND_URL;
    const { fetchMessages, sendmessage, currentUser, loadingUser, fetchConnections, fetchGroups } = useContext(ChatContext);
    const socket = useSocket();
    const messagesEndRef = useRef(null);
    //const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const [isFriend, setIsFriend] = useState(true);
    const [replyTo, setReplyTo] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [wallpaperUrl, setWallpaperUrl] = useState(selectedChat?.wallpaper?.url);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    // eslint-disable-next-line no-unused-vars
    const [showWallpaperModal, setShowWallpaperModal] = useState(false);
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);
    const [showPlaceholder, setShowPlaceholder] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    //const chatContainerRef = useRef(null);
    const selectedChatRef = useRef(null);

    const [currentDate, setCurrentDate] = useState(null);
    const observerRefs = useRef({});
    const containerRef = useRef(null);

    const [showDate, setShowDate] = useState(false);

    const [sent, setSent] = useState(true);

    const [showDown, setShowDown] = useState(false);
    const showDownRef = useRef(showDown);

    const [unreadCount, setUnreadCount] = useState(false)

    const handleReply = (msg) => {
        setReplyTo(msg);
    };

    const cancelReply = () => {
        setReplyTo(null);
    };

    const formatChatDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isToday = date.toDateString() === today.toDateString();
        const isYesterday = date.toDateString() === yesterday.toDateString();

        if (isToday) return "Today";
        if (isYesterday) return "Yesterday";

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    };

    // Keep ref updated whenever showDown changes
    useEffect(() => {
        showDownRef.current = showDown;
    }, [showDown]);

    const groupMessagesByDate = (messages) => {
        if (!Array.isArray(messages)) return {};
        const grouped = messages?.reduce((groups, msg) => {
            if (!msg?.createdAt) return groups;
            const dateKey = new Date(msg.createdAt).toDateString();
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(msg);
            return groups;
        }, {});

        // ✅ sort keys in chronological order
        const sortedKeys = Object?.keys(grouped).sort(
            (a, b) => new Date(a) - new Date(b)
        );

        return sortedKeys.map((date) => ({
            date,
            messages: grouped[date].sort((m1, m2) => new Date(m1.createdAt) - new Date(m2.createdAt)), // keep messages ordered
        }));
    };

    function hexToRgba(hex, alpha = 0.25) {
        hex = hex.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }


    useEffect(() => {

        if (selectedChat?.wallpaper?.url) {

            setWallpaperUrl(selectedChat.wallpaper.url);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat?.wallpaper?.url]);

    useEffect(() => {
        if (!socket || !currentUser) return;

        socket.emit('join', currentUser?._id);

    }, [socket, currentUser]);

    useEffect(() => {
        if (socket && selectedChat?._id) {

            socket.emit("join chat", selectedChat?._id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selectedChat?._id]);

    useEffect(() => {
        if (selectedChat && socket) {
            socket.emit('join chat', selectedChat?._id);
        }
    }, [selectedChat, socket]);

    // 📌 Scroll to bottom helper
    const scrollToBottom = (behavior = "auto") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };


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

                    const friendIds = data?.map(friend => friend?._id);
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

    // 📌 Initial load: fetch latest messages
    useEffect(() => {
        const loadInitialMessages = async () => {
            if (!selectedChat?._id || !currentUser?._id) {
                setMessages([]);
                return;
            }

            setMessages([]);
            setPage(1);
            setHasMore(true);
            setLoading(false);
            setShowPlaceholder(true);

            try {
                const fetched = await fetchMessages(selectedChat._id, 1, 10);

                const formatted = fetched?.map((msg) => ({
                    ...msg,
                    type: msg.sender?._id === currentUser?._id ? "sent" : "received",
                    text: msg?.content,
                }));


                // set messages
                setMessages(formatted?.reverse());

                // ❌ don’t scroll yet (placeholder still visible)
            } catch (err) {
                console.error("Error loading messages:", err);
            } finally {
                setLoading(false);

                // ✅ after 2s hide placeholder AND then scroll to bottom
                setTimeout(() => {
                    setShowPlaceholder(false);

                    // ✅ scroll now, after placeholder is gone
                    setTimeout(() => scrollToBottom("auto"), 50);
                }, 2000);
            }
        };

        loadInitialMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat?._id, currentUser?._id]);


    // 2️⃣ Infinite scroll handler
    const handleScroll = async (e) => {
        const el = e.target;

        // 1️⃣ Infinite scroll (when at top)
        if (el.scrollTop === 0 && !loading && hasMore) {
            setLoading(true);
            const nextPage = page + 1;
            const older = await fetchMessages(selectedChat._id, nextPage, 10);

            if (older?.length > 0) {
                const prevHeight = el.scrollHeight;
                setMessages((prev) => [
                    ...older.map((msg) => ({
                        ...msg,
                        type: msg.sender?._id === currentUser?._id ? "sent" : "received",
                        text: msg?.content,
                    })),
                    ...prev,
                ]);
                setPage(nextPage);
                setHasMore(older.length === 10);

                requestAnimationFrame(() => {
                    el.scrollTop = el.scrollHeight - prevHeight;
                });
            } else {
                setHasMore(false);
            }
            setLoading(false);
        }

        // 2️⃣ Check if user is at bottom
        const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 5;
        setShowDown(!isAtBottom);

        if (isAtBottom) {
            // Mark messages as read when at bottom
            setUnreadCount(0);
            if (selectedChat?._id) {
                markMessagesAsRead(selectedChat._id);
            }
        }
    };

    // 3️⃣ Scroll when *I* send a message
    const prevMsgCount = useRef(0);
    const prevFirstMsgId = useRef(null);

    const handleAutoScroll = () => {
        if (messages.length === 0) return;

        const lastMsg = messages[messages.length - 1];
        const firstMsg = messages[0];

        // CASE 1: new message at the bottom (sent/received)
        if (
            lastMsg.sender?._id === currentUser?._id
        ) {
            setTimeout(() => scrollToBottom("smooth"), 50);
        }

        // update trackers
        prevMsgCount.current = messages.length;
        prevFirstMsgId.current = firstMsg._id;
    };


    const groupedMessages = groupMessagesByDate(messages);

    useEffect(() => {
        const container = containerRef?.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const date = entry.target.dataset.date; // safer than getAttribute
                        if (date) setCurrentDate(date);
                    }
                });
            },
            { root: container, threshold: 0.3 } // bump threshold for more stable results
        );

        Object.values(observerRefs.current).forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [groupedMessages]);

    useEffect(() => {
        if (!currentDate) return;

        setShowDate(true);

        const timer = setTimeout(() => {
            setShowDate(false);
        }, 2000); // 👈 visible for 2s

        return () => clearTimeout(timer);
    }, [currentDate]);

    useEffect(() => {

        if (!socket) return;

        const handleNewMessage = (msg) => {
            console.log(msg)
            setShowPlaceholder(false);
            const msgChatId = msg?.chat?._id || msg?.chatId;
            const currentSelectedChat = selectedChatRef.current;

            // Add to messages if this chat is currently open
            if (msgChatId === currentSelectedChat?._id) {
                setMessages(prev => [
                    ...prev.filter(m => m._id !== (msg.tempId || msg._id)), // avoid duplicates
                    {
                        ...msg,
                        type: msg.sender?._id === currentUser?._id ? 'sent' : 'received',
                        text: msg.text || msg.content,
                        replyTo: msg.replyTo,
                        //readBy:[currentUser._id, selectedChat?.otherUserId]
                    }
                ]);
                const isSender = msg.sender?._id === currentUser?._id;
                console.log(isSender, unreadCount, showDown);
                //console.log(unreadCount)
                if (showDownRef.current && !isSender) {
                    setUnreadCount(true);
                } else {
                    markMessagesAsRead(msgChatId);
                }
            }

            // Update either private connections or groups
            if (msg?.chat?.isGroupChat) {
                setGroups(prevGroups => {
                    const exists = prevGroups.find(c => c._id === msgChatId);
                    if (exists) {
                        return prevGroups.map(c =>
                            c._id === msgChatId ? { ...c, latestMessage: msg } : c
                        );
                    } else {
                        fetchGroups(1, 10).then(({ groups }) => {
                            const newGroup = groups.find(g => g._id === msgChatId);
                            if (newGroup) {
                                setGroups(prev => {
                                    // Deduplicate here too
                                    if (prev.some(c => c._id === newGroup?._id)) return prev;
                                    return [newGroup, ...prev];
                                });
                            }
                        });


                        return prevGroups;
                    }
                });
            } else {
                setLocalChatList(prevChats => {
                    const exists = prevChats.find(c => c?._id === msgChatId);
                    if (exists) {
                        return prevChats.map(c =>
                            c?._id === msgChatId ? { ...c, latestMessage: msg } : c
                        );
                    } else {
                        fetchConnections().then(connections => {
                            const newConn = connections.find(c => c?._id === msgChatId);
                            if (newConn) {
                                setLocalChatList(prev => {
                                    if (!prev) prev = []; // make sure prev is an array
                                    const exists = prev.some(c => c?._id === newConn._id);
                                    if (exists) return prev;
                                    return [newConn, ...prev]; // return new array
                                });
                            }
                        });


                        return prevChats;
                    }
                });
            }
        }

        socket.on('newMessage', handleNewMessage);
        return () => socket.off('newMessage', handleNewMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, currentUser, host, setLocalChatList, setSelectedChat, setMessages]);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);




    // useEffect(() => {
    //     if (!selectedChat) return;

    //     setGroups(prevGroups =>
    //         prevGroups.map(chat =>
    //             chat?._id === selectedChat?._id
    //                 ? { ...chat, unreadCount: 0 }
    //                 : chat)

    //     );


    //     setLocalChatList(prevChats =>
    //         prevChats.map(chat =>
    //             chat?._id === selectedChat?._id
    //                 ? { ...chat, unreadCount: 0 }
    //                 : chat
    //         )
    //     );
    //     markMessagesAsRead(selectedChat?._id)
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectedChat]);

    useEffect(() => {
        if (!socket) return;

        const handleWallpaperUpdated = ({ chatId, newWallpaper }) => {
            // Update selected chat if it's the one updated
            setSelectedChat(prev =>
                prev?._id === chatId
                    ? { ...prev, ...newWallpaper, wallpaper: newWallpaper }
                    : prev
            );

            // Update chat list if you have one
            setLocalChatList(prevChats =>
                prevChats.map(chat =>
                    chat._id === chatId
                        ? { ...chat, ...newWallpaper, wallpaper: newWallpaper }
                        : chat
                )
            );

            // Optionally update wallpaper URL separately
            if (selectedChat?._id === chatId) {
                setWallpaperUrl(newWallpaper.url);
            }
        };

        socket.on('wallpaper-updated', handleWallpaperUpdated);

        return () => socket.off('wallpaper-updated', handleWallpaperUpdated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selectedChat, setLocalChatList, setSelectedChat]);


    useEffect(() => {
        if (!socket) return;

        const handleTyping = ({ chatId, user }) => {
            if (user === currentUser?._id) return; // ignore own typing events
            if (chatId !== selectedChat?._id) return;

            setTypingUsers(prev => {
                const updated = new Set(prev);
                updated.add(user);
                return updated;
            });
        };

        const handleStopTyping = ({ chatId, user }) => {
            if (chatId !== selectedChat?._id) return;

            setTypingUsers(prev => {
                const updated = new Set(prev);
                updated.delete(user);
                return updated;
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
                // userId not sent here — server knows from socket auth
            });

            // Optionally start a timer to send stop typing after inactivity
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                typingStartedRef.current = false;
                socket.emit('stop typing', { chatId: selectedChat?._id });
            }, 3000);  // e.g. 3 seconds of no typing stops typing
        } else {
            // reset the timeout while user keeps typing
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                typingStartedRef.current = false;
                socket.emit('stop typing', { chatId: selectedChat?._id });
            }, 3000);
        }
    };

    const handleSend = async (newText) => {
        if (!newText.trim() || !selectedChat?._id) return;

        setShowPlaceholder(false);

        // 1️⃣ Create a temporary "sending" message
        const tempId = Date.now().toString();
        const optimisticMessage = {
            _id: null,               // reserved for real Mongo _id
            clientId: tempId,
            sender: currentUser,
            chat: selectedChat,
            type: "sent",
            text: newText,
            content: newText,
            status: "sending", // 👈 custom field
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticMessage]);
        handleAutoScroll();

        try {
            const newMessage = await sendmessage(newText, selectedChat?._id, replyTo?._id || null);

            if (newMessage && newMessage.sender && newMessage.content) {
                const typedMessage = {
                    ...newMessage,
                    clientId: tempId,
                    type: newMessage.sender?._id === currentUser?._id ? 'sent' : 'received',
                    text: newMessage.content,
                    replyTo: newMessage.replyTo ? {
                        _id: newMessage.replyTo?._id,
                        text: newMessage.replyTo.content || '[deleted]',
                        sender: newMessage.replyTo.sender || { _id: '', username: 'Unknown' }
                    } : null,
                    status: "sent"
                };

                setMessages((prev) =>
                    prev.map((msg) => (msg.clientId === tempId ? typedMessage : msg))
                );
                setSent(true);

                setReplyTo(null);

                if (selectedChat?.isGroupChat && typeof updateGroupLatestMessage === 'function') {
                    updateGroupLatestMessage(selectedChat?._id, typedMessage, selectedChat?._id);
                } else {
                    updateChatLatestMessage(selectedChat?._id, typedMessage);
                }

                if (socket) {
                    socket.emit('send-message', typedMessage);
                }
            } else {
                console.warn('Empty or invalid message returned', newMessage);
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === tempId ? { ...msg, status: "failed" } : msg
                    )
                );
                setSent("failed")
            }



            if (socket) {
                typingStartedRef.current = false;
                socket.emit('stop typing', {
                    chatId: selectedChat?._id,
                    user: currentUser?._id,
                });
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };


    // Track last read per chat
    const lastReadRef = useRef({});

    useEffect(() => {
        if (!socket) return;

        socket.on("message-read", ({ chatId, messageId, userId }) => {
            if (chatId !== selectedChat?._id) return;

            setMessages(prev =>
                prev.map(msg =>
                    msg._id === messageId
                        ? { ...msg, readBy: [...new Set([...(msg.readBy || []), userId])] }
                        : msg
                )
            );

            // Mark in ref so we don't emit again
            lastReadRef.current[chatId] = messageId;
        });

        return () => socket.off("message-read");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selectedChat]);

    useEffect(() => {
        if (!selectedChat || messages.length === 0) return;

        const lastMsg = messages[messages.length - 1];
        if (!lastMsg) return;

        // Only emit if not read AND not already emitted for this chat
        if (
            !lastMsg.readBy?.includes(currentUser?._id) &&
            lastReadRef.current[selectedChat._id] !== lastMsg._id
        ) {
            socket.emit("mark-read", {
                chatId: selectedChat._id,
                messageId: lastMsg._id,
            });
            lastReadRef.current[selectedChat._id] = lastMsg._id;
        }
        // 👇 Only depend on selectedChat + last message id
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat?._id, messages[messages.length - 1]?._id, currentUser, socket]);



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
                prev.map(msg => (msg?._id === id ? { ...msg, text: newText } : msg))
            );
        } catch (err) {
            console.error('Edit message error:', err.message);
        }
    };

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
                setMessages((prevMessages) => prevMessages.filter(msg => msg?._id !== messageId));

                if (selectedChat.latestMessage?._id === messageId) {
                    const newLatestMessage = messages
                        .filter(msg => msg?._id !== messageId)
                        .slice(-1)[0] || null;

                    //     setSelectedChat(prevChat => ({
                    //         ...prevChat,
                    //         latestMessage: newLatestMessage,
                    //     }));

                    if (typeof updateGroupLatestMessage === 'function') {
                        updateGroupLatestMessage(selectedChat?._id, newLatestMessage);
                    } else {
                        updateChatLatestMessage(selectedChat?._id, newLatestMessage)
                    }

                }
            } else {
                console.warn('Failed to delete message:', data.error);
            }
        } catch (err) {
            console.error('Error deleting message:', err);
        }
    };

    const typingUsernames = Array.from(typingUsers)
        .filter(id => id !== currentUser?._id)
        .map(id => {
            if (selectedChat?.isGroupChat) {
                const user = selectedChat.users.find(u => u?._id === id);
                return user?.username || 'Someone';
            } else {
                if (id === selectedChat?.otherUserId) {
                    return selectedChat.username || 'Someone';
                }
                return 'Someone';
            }
        });

    const showLilyapperWelcome =
        !selectedChat && !['/friends', '/arrequest', '/groups'].includes(location.pathname);



    if (loadingUser) return <Spinner color="white" />;


    if (!currentUser?._id) {
        return navigate("/login");
    }

    return (
        <div
            className="flex-grow-1 d-flex flex-column"
            style={{
                backgroundImage: selectedChat ? (wallpaperUrl ? `url(${wallpaperUrl})` : '') : '',
                backgroundColor: '#5459AC',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: isMobile ? '100vw' : 'auto',
                objectFit: 'cover'
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
                            handlePermissionChange={handlePermissionChange}
                        />

                        {loading && <div className="loader"><Spinner color={selectedChat?.wallpaper?.iColor || "black"} /></div>}
                        <div style={{ height: '3.5rem' }}>
                            {showDate && currentDate &&
                                <div className="text-center my-3 text-sm" style={{ color: selectedChat?.wallpaper?.systemMesColor, height: '8px' }}>

                                    {currentDate ? formatChatDate(currentDate) : ""}

                                </div>
                            }
                        </div>

                        <div
                            className="flex-grow-1 overflow-auto hide-scrollbar w-100"
                            ref={containerRef}
                            onScroll={handleScroll}
                            style={{ padding: '1rem', height: 'calc(100vh - 180px)' }}
                        >
                            {showPlaceholder ? (
                                <ChatWinPlaceholder length={messages?.length} />
                            ) : (
                                <div style={{ padding: '1rem', borderRadius: '8px' }}>
                                    {selectedChat?.isGroupChat ? (
                                        <GroupMessageBox
                                            messages={messages}
                                            currentUser={currentUser}
                                            onReply={handleReply}
                                            onDeleteMessage={handleDeleteMessage}
                                            onEditMessage={handleEditMessage}
                                            setEditingMessageId={setEditingMessageId}
                                            setEditingText={setEditingText}
                                            selectedChat={selectedChat}
                                            groupMessagesByDate={groupMessagesByDate}
                                            formatChatDate={formatChatDate}
                                            hasMore={hasMore}
                                            observerRefs={observerRefs}
                                            sent={sent}
                                        />
                                    ) : (
                                        <MessageBox
                                            messages={messages}
                                            currentUser={currentUser}
                                            onReply={handleReply}
                                            onDeleteMessage={handleDeleteMessage}
                                            onEditMessage={handleEditMessage}
                                            setEditingMessageId={setEditingMessageId}
                                            setEditingText={setEditingText}
                                            selectedChat={selectedChat}
                                            onlineUsers={onlineUsers}
                                            id={selectedChat.otherUserId}
                                            groupMessagesByDate={groupMessagesByDate}
                                            formatChatDate={formatChatDate}
                                            hasMore={hasMore}
                                            observerRefs={observerRefs}
                                            sent={sent}
                                        />
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>
                        {console.log("unreadCount", unreadCount)}
                        <div style={{ height: '2rem', }}>
                            {showDown &&
                                <div 
                                className="position-relative"
                                style={{ height: '2rem', display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
                                    onClick={() => {
                                        setTimeout(() => {
                                            scrollToBottom("smooth")
                                        }, 300);
                                    }}>
                                    {unreadCount?(
                                    <span
                                        className="position-relative top-0 translate-middle badge rounded-circle bg-danger border border-light"
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            fontSize: '0.2rem',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            left:'5%'
                                        }}
                                    >
                                        <span className="visually-hidden">unread messages</span>
                                    </span>):
                                    null}
                                    <div className='d-flex justify-content-center align-items-center'
                                        style={{ color: selectedChat?.wallpaper?.iColor, height: '2rem', width: '2rem', backgroundColor: hexToRgba(selectedChat?.wallpaper?.senderbubble, 0.50), borderRadius: '50%', }}>
                                        <i className="fa-solid fa-arrow-down"></i>
                                    </div>
                                </div>
                            }
                        </div>


                        <div
                            className="px-3"
                            style={{
                                minHeight: '24px',
                                fontSize: '0.9rem',
                                color: selectedChat?.wallpaper?.receiverbubble,
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
                                                    onlineUsers={onlineUsers}
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
                                                        currentUserId={currentUser?._id}
                                                        addToGroup={addToGroup}
                                                        onlineUsers={onlineUsers}
                                                        handlePermissionChange={handlePermissionChange}
                                                        setSelectedChat={setSelectedChat}
                                                        setMessages={setMessages}
                                                        setLocalChatList={setLocalChatList}
                                                        setGroups={setGroups}

                                                    />
                                                    {showAddMembersModal && (
                                                        <AddMembersModal
                                                            show={showAddMembersModal}
                                                            onClose={() => setShowAddMembersModal(false)}
                                                            friendsList={[...friends]}
                                                            existingUserIds={selectedChat?.users?.map(u => u?._id) || []}
                                                            chatId={selectedChat?._id}
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
                                    chatId={selectedChat?._id}
                                    onClose={() => setShowWallpaperModal(false)}
                                    selectedChat={selectedChat}
                                    setSelectedChat={setSelectedChat}
                                    setWallpaperUrl={setWallpaperUrl}
                                />
                            </div>
                        </div>
                    )}

                </>
            )
            }

            {
                (location.pathname === '/friends' || location.pathname === '/arrequest') && (
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
                        messages={messages}
                    />

                )
            }


            {
                showLilyapperWelcome && (
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
                )
            }
        </div >
    );
};

export default ChatWindow;
