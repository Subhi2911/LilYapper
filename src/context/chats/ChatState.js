import React, { useState } from 'react'
import ChatContext from './ChatContext'

const ChatState = (props) => {
    const host = process.env.REACT_APP_BACKEND_URL
    const [chats, setChats] = useState([])

    // Create new chat
    const createChat = async (userId) => {
        try {
            const response = await fetch(`${host}/api/chat/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ userId })
            });
            const chat = await response.json();

            setChats(prev => {
                const exists = prev.some(c => c._id === chat._id);
                if (exists) {
                    // Update existing chat (in case data changed)
                    return prev.map(c => (c._id === chat._id ? chat : c));
                } else {
                    // Add new chat
                    return [...prev, chat];
                }
            });

            return chat;
        } catch (error) {
            console.error("Error creating chat:", error);
            return null;
        }
    };

    // Fetch all chats
    const fetchChats = async (page = 1, limit = 4) => {
        try {
            const response = await fetch(`${host}/api/chat/?page=${page}&limit=${limit}`, {
                method: "GET",
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });
            const json = await response.json();
            const chatList = Array.isArray(json.chats) ? json.chats : [];
            setChats(chatList);
            console.log(chats)
            return {
                chats: chatList,
                total: json.total || 0,
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
            return { chats: [], total: 0 };
        }
    }

    const fetchConnections = async () => {
        try {
            const response = await fetch(`${host}/api/chat/connections`, {
                method:'GET',
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });

            const json = await response.json();
            const chatList = json;
            setChats(chatList);
           
            return chatList;
        } catch (err) {
            console.error("Error fetching connections:", err);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                createChat,
                fetchChats,
                fetchConnections,
                chats
            }}
        >
            {props.children}
        </ChatContext.Provider>
    )
}

export default ChatState
