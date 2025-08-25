import React, { useState, useEffect } from "react";
import Avatar from "./Avatar";
import { useSocket } from "../context/chats/socket/SocketContext";

const avatarList = [
    "/avatars/laughing.png",
    "/avatars/crying.png",
    "/avatars/hugging.png",
    "/avatars/excited.png",
    "/avatars/angry.png",
    "/avatars/sad.png",
    "/avatars/cycling.png",
    "/avatars/greeting.png",
    "/avatars/sarcastic.png",
    "/avatars/arrogant.png",
    "/avatars/rude.png",
];

const GroupAvatarEditor = ({ selectedChat, setSelectedChat, avatar, width, height, size, showCamera, isOnline, isGroup, selectedavatar, onAvatarChange }) => {
    const socket = useSocket();

    const host = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem("token");

    const currentUserId = localStorage.getItem('userId');
    const isAdmin = selectedChat?.groupAdmin.some(admin => admin._id === currentUserId);

    const [selectedAvatar, setSelectedAvatar] = useState(selectedavatar || selectedChat?.avatar || avatarList[0]);
    const [showOptions, setShowOptions] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedChat?.avatar) {
            setSelectedAvatar(selectedChat.avatar);
        }
    }, [selectedChat]);

    const handleAvatarClick = async (avatar) => {
        setSelectedAvatar(avatar);
        setShowOptions(false);

        setLoading(true);
        try {
            const res = await fetch(`${host}/api/chat/avatar/${selectedChat?._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
                body: JSON.stringify({ avatar }),
            });

            const data = await res.json();
            if (res.ok) {
                // Update chat in parent
                setSelectedChat(prev => ({ ...prev, avatar: data.avatar }));

                if (onAvatarChange) {
                    onAvatarChange(data.avatar); // <- tell sidebar to refresh
                }
                if (data.populatedSystemMessage) {
                    const systemMessage = {
                        ...data,
                        content: data.populatedSystemMessage.content,
                        type: 'system', // handle this in MessageBox styling
                        createdAt: new Date().toISOString(),
                        chat: data.chat,
                        users: data.users,
                        isSystem: true

                    };
                    if (socket) {
                        socket.emit('send-message', systemMessage);
                    }
                    console.log(data)
                }
            } else {
                console.error(data.error || "Failed to update avatar");
            }
        } catch (err) {
            console.error("Error updating group avatar:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: "relative", textAlign: "center" }}>
            <div style={{ position: 'relative' }}>
                <Avatar
                    src={selectedAvatar}
                    width={width}
                    height={height}
                    size={size}
                    isOnline={isOnline}
                    isGroup={isGroup}
                />

                {/* Camera icon inside black circular background */}
                {(isAdmin || selectedChat?.permissions?.groupAvatar === 'all') && showCamera &&
                    <div
                        onClick={() => setShowOptions(!showOptions)}
                        style={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            width: '32px',
                            height: '32px',
                            backgroundColor: 'black',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 0 6px rgba(0,0,0,0.6)',
                            transition: 'background-color 0.2s ease',
                        }}
                        aria-label="Change avatar"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setShowOptions(!showOptions);
                            }
                        }}
                    >
                        <i
                            className="fa-solid fa-camera"
                            style={{ color: 'white', fontSize: '16px' }}
                        ></i>
                    </div>
                }
                {showOptions && (
                    <div
                        className="avatar-grid"
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 50px)',
                            gap: '8px',
                            backgroundColor: '#fff',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            zIndex: 10,
                        }}
                    >
                        {avatarList.map((avatar, index) => (
                            <img
                                key={index}
                                src={avatar}
                                alt={`Avatar ${index}`}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    border: selectedAvatar === avatar ? '2px solid #5459AC' : '1px solid #ccc',
                                }}
                                onClick={() => handleAvatarClick(avatar)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {loading && <p>Updating avatar...</p>}
        </div>
    );
};

export default GroupAvatarEditor;
