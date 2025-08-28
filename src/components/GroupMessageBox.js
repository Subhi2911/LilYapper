import React, { useEffect } from 'react';
import Avatar from './Avatar';
import moment from 'moment';
import { useSocket } from '../context/chats/socket/SocketContext';

// Generate consistent color for each username
const generateColor = (username = '') => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 55%)`;
};

const GroupMessageBox = ({
    messages = [],
    currentUser,
    onReply,
    onDeleteMessage,
    onEditMessage,
    setEditingMessageId,
    setEditingText,
    selectedChat,
    groupMessagesByDate,
    formatChatDate,
    hasMore,
    observerRefs
}) => {
    const groupedMessages = groupMessagesByDate(messages);

    const receiverbubble = selectedChat?.wallpaper?.receiverbubble || 'white';
    const senderbubble = selectedChat?.wallpaper?.senderbubble || '#52357B';
    const rMesColor = selectedChat?.wallpaper?.rMesColor || 'black';
    const sMesColor = selectedChat?.wallpaper?.sMesColor || 'white';
    const systemMesColor = selectedChat?.wallpaper?.systemMesColor || 'black';
    const iColor = selectedChat?.wallpaper?.iColor || 'black';
    const socket = useSocket();

    // track last read msg per user
    const lastReads = {};
    messages.forEach((m) => {
        if (m.readBy && m.readBy.length > 0) {
            m.readBy.forEach((uid) => {
                lastReads[uid] = m._id;
            });
        }
    });

    useEffect(() => {
            if (selectedChat && messages.length > 0) {
                const lastMessageId = messages[messages.length - 1]._id;
                socket.emit("mark-read", {
                    chatId: selectedChat._id,
                    messageId: lastMessageId,
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selectedChat]); 

    return (
        <div className="d-flex flex-column gap-2">
            {groupedMessages.map((group, idx) => (
                <div
                    key={idx}
                    data-date={group.date}
                    ref={(el) => {
                        if (el) observerRefs.current[group.date] = el;
                        else delete observerRefs.current[group.date];
                    }}
                >
                    <div className="text-center my-3 text-sm" style={{ color: systemMesColor }}>
                        {!hasMore || idx > 0 ? formatChatDate(group.date) : ""}
                    </div>

                    {group?.messages?.map((msg, index) => {
                        const isSystem = msg.isSystem;
                        const isCurrentUser = msg.sender?._id === currentUser?._id;
                        const nameColor = generateColor(msg.sender?.username);

                        if (isSystem) {
                            return (
                                <div
                                    key={index}
                                    className="text-center my-2"
                                    style={{
                                        fontSize: '0.85rem',
                                        textAlign: 'center',
                                        color: systemMesColor,
                                        textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)',
                                        fontStyle: 'italic',
                                        whiteSpace: 'normal',
                                        overflowWrap: 'break-word',
                                        maxWidth: '300px',
                                        margin: 'auto'
                                    }}
                                >
                                    {msg.content}
                                </div>
                            );
                        }

                        const replied = msg.replyTo;

                        return (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: isCurrentUser ? "flex-end" : "flex-start",
                                    gap: "2px"
                                }}
                            >
                                {/* Bubble row */}
                                <div
                                    className={`d-flex ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}
                                    style={{ position: 'relative', width: "100%" }}
                                >
                                    {!isCurrentUser && (
                                        <Avatar
                                            src={msg.sender?.avatar || '/avatars/laughing.png'}
                                            width="2"
                                            height="2"
                                            className="me-2"
                                        />
                                    )}
                                    {isCurrentUser && (
                                        <div className='d-flex align-items-center gap-3' style={{ cursor: 'pointer' }}>
                                            <div
                                                onClick={() => {
                                                    setEditingMessageId(msg._id);
                                                    setEditingText(msg.text);
                                                }}
                                                style={{ fontSize: '0.8rem', color: iColor }}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </div>
                                            <div
                                                onClick={() => { onDeleteMessage(msg._id); }}
                                                style={{ fontSize: '0.8rem', color: iColor }}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mx-2" style={{ maxWidth: '70%', position: 'relative' }}>
                                        {/* Sender name */}
                                        {!isCurrentUser && msg.sender?.username && (
                                            <div
                                                className="fw-bold mb-1"
                                                style={{
                                                    fontSize: '0.85rem',
                                                    color: nameColor,
                                                    textShadow: `
                                                        0.2px 0 black, 
                                                        -0.2px 0 white, 
                                                        0 0.2px black, 
                                                        0 -0.2px black
                                                    `
                                                }}
                                            >
                                                {msg.sender?.username}
                                            </div>
                                        )}

                                        {/* Replied message */}
                                        {replied && (
                                            <div
                                                style={{
                                                    backgroundColor: isCurrentUser ? senderbubble : receiverbubble,
                                                    color: isCurrentUser ? sMesColor : rMesColor,
                                                    padding: '6px 10px',
                                                    borderLeft: '4px solid #888',
                                                    borderRadius: '8px',
                                                    marginBottom: '3px',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                <strong>{replied.sender?.username || 'Unknown'}: </strong>
                                                {replied.content || replied.text || 'Message unavailable'}
                                            </div>
                                        )}

                                        {/* Actual message */}
                                        <div
                                            className="p-2 rounded-3 shadow-sm"
                                            style={{
                                                backgroundColor: isCurrentUser ? senderbubble : receiverbubble,
                                                color: isCurrentUser ? sMesColor : rMesColor,
                                                whiteSpace: 'normal',
                                                overflowWrap: 'break-word',
                                                maxWidth: '300px',
                                                margin: 'auto'
                                            }}
                                        >
                                            {msg.text}
                                        </div>

                                        {/* Reply icon */}
                                        {!isCurrentUser && onReply && (
                                            <i
                                                className="fa-solid fa-reply fa-flip-horizontal"
                                                onClick={() => onReply(msg)}
                                                style={{
                                                    cursor: 'pointer',
                                                    position: 'absolute',
                                                    bottom: '20px',
                                                    right: '-25px',
                                                    fontSize: '14px',
                                                    userSelect: 'none',
                                                    color: iColor
                                                }}
                                                title="Reply to this message"
                                            />
                                        )}

                                        {/* Timestamp */}
                                        <div className="text-end text-muted" style={{ fontSize: '0.7rem', color: systemMesColor }}>
                                            {moment(msg.createdAt).format('h:mm A')}
                                        </div>
                                    </div>

                                    {/* Status / avatar for current user */}
                                    {isCurrentUser ? (
                                        msg.status === "sending" ? (
                                            <div style={{ color: iColor }}>
                                                <i className="fa-solid fa-paper-plane"></i>
                                            </div>
                                        ) : msg.status === "failed" ? (
                                            <div style={{ color: "red" }}>
                                                <i className="fa-solid fa-circle-exclamation"></i>
                                            </div>
                                        ) : (
                                            <Avatar
                                                src={msg.sender?.avatar || '/avatars/laughing.png'}
                                                width="2"
                                                height="2"
                                                className="ms-2"
                                                hideBorder={true}
                                            />
                                        )
                                    ) : null}
                                </div>

                                {/* Seen by avatars BELOW bubble */}
                                <div
                                className='my-2'
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: "4px",
                                        marginTop: "2px",
                                        width: "100%"
                                    }}
                                >
                                    {Object.entries(lastReads).map(([userId, lastMsgId]) => {
                                        if (lastMsgId === msg._id && userId !== currentUser._id) {
                                            const user = selectedChat?.users?.find((u) => u._id === userId);
                                            return (
                                                <Avatar
                                                    key={userId}
                                                    src={user?.avatar || "/avatars/laughing.png"}
                                                    width="1.5"
                                                    height="1.5"
                                                    hideBorder
                                                    title={`Seen by ${user?.username}`}
                                                />
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default GroupMessageBox;
