/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import ChatContext from './ChatContext';
import { useSocket } from './socket/SocketContext';


const ChatState = (props) => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const [chats, setChats] = useState([]);
    const [groups, setGroups] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const socket = useSocket()
    useEffect(() => {
        if (socket && currentUser?._id) {
            socket.emit('join', currentUser._id);
            console.log('Socket joined user room:', currentUser._id);
        }
    }, [socket, currentUser]);

    useEffect(() => {
        if (currentUser?._id) {
            fetchChats(1); // fetch first page
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setCurrentUser(JSON.parse(userData));
            } catch (error) {
                console.error("Failed to parse user:", error);
            }
        }
        setLoadingUser(false); // ✅ After parsing
    }, []);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch('/api/auth/getuser', {
                        headers: { 'auth-token': token }
                    });
                    const data = await res.json();
                    setCurrentUser(data);
                } catch (err) {
                    console.error('Failed to fetch user', err);
                }
            }
            setLoadingUser(false); // ✅ After fetch completes
        };

        fetchCurrentUser();
    }, []);


    // Create new chat
    const createChat = async (userId) => {
        try {
            const response = await fetch(`${host}/api/chat/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ userId }),
            });
            const chat = await response.json();

            setChats((prev) => {
                const exists = prev.some((c) => c._id === chat._id);
                if (exists) {
                    return prev.map((c) => (c._id === chat._id ? chat : c));
                } else {
                    return [...prev, chat];
                }
            });

            return chat;
        } catch (error) {
            console.error('Error creating chat:', error);
            return null;
        }
    };

    // Fetch chats with pagination; append new chats
    const fetchChats = async (page = 1, limit = 10) => {
        try {
            const response = await fetch(`${host}/api/chat/?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
            });
            const json = await response.json();

            const chatList = Array.isArray(json.chats) ? json.chats : [];
            if (page === 1) {
                // first page: replace
                setChats(chatList);
            } else {
                // append subsequent pages
                setChats((prev) => {
                    const existingIds = new Set(prev.map((c) => c._id));
                    const filteredNew = chatList.filter((c) => !existingIds.has(c._id));
                    return [...prev, ...filteredNew];
                });
            }

            return {
                chats: chatList,
                total: json.total || 0,
                totalPages: json.totalPages || 1,
            };
        } catch (error) {
            console.error('Error fetching chats:', error);
            return { chats: [], total: 0, totalPages: 1 };
        }
    };

    // Fetch groups with pagination; append new groups
    const fetchGroups = async (page = 1, limit = 10) => {
        try {
            const response = await fetch(`${host}/api/chat/groups?page=${page}&limit=${limit}`, {
                headers: { 'auth-token': localStorage.getItem('token') }
            });
            const json = await response.json();
            return {
                groups: json.groups || [],
                totalPages: json.pagination?.totalPages || 1,
                total: json.pagination?.total || 0,
            };
        } catch (err) {
            console.error("Error fetching groups:", err);
            return { groups: [], totalPages: 1, total: 0 };
        }
    };



    const fetchConnections = async () => {
        try {
            const response = await fetch(`${host}/api/chat/connections`, {
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch connections');
            }
            const data = await response.json();
            return data; // an array of connections expected
        } catch (error) {
            console.error("Error fetching connections:", error);
            return [];
        }
    };

    //Fetch messages
    const fetchMessages = async (chatId) => {
        console.log("Calling fetchMessages with chatId:", chatId); //
        try {
            const response = await fetch(`${host}/api/message/${chatId}`, {
                method: "GET",
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });

            const data = await response.json();
            const currentUserId = localStorage.getItem('userId');


            const formattedMessages = data.map(msg => {
                if (!msg.sender) {
                    return {
                        ...msg,
                        type: 'system',
                        text: msg.content,
                        replyTo: msg.replyTo,
                    };
                }

                return {
                    ...msg,
                    type: msg.sender._id === currentUserId ? 'sent' : 'received',
                    text: msg.content,
                };
            });


            console.log("formatted", formattedMessages)
            return formattedMessages;

        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    };

    //Send a new msg
    const sendmessage = async (content, chatId, replyToId = null) => {
        try {
            const payload = { content, chatId };
            if (replyToId) payload.replyTo = replyToId;  // only add if not null

            const response = await fetch(`${host}/api/message/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify(payload),
            });


            const data = await response.json();
            socket.emit('send-message', data);

            // Update the corresponding chat's latestMessage
            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat._id === chatId
                        ? { ...chat, latestMessage: data } // set the new message as latestMessage
                        : chat
                )
            );

            return data;
        } catch (error) {
            console.error("Error sending messages:", error);
            return null;
        }
    };





    return (
        <ChatContext.Provider
            value={{
                createChat,
                fetchChats,
                fetchConnections,
                fetchGroups,
                fetchMessages,
                sendmessage,
                currentUser,
                chats,
                groups,
                loadingUser
            }}
        >
            {props.children}
        </ChatContext.Provider>
    );
};

export default ChatState;
