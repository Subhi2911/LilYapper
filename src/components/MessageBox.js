import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import Avatar from './Avatar';
import { useSocket } from '../context/chats/socket/SocketContext';

const MessageBox = ({
    messages = [],
    currentUser,
    id,
    onReply,
    onDeleteMessage,
    onEditMessage,
    setEditingMessageId,
    setEditingText,
    selectedChat,
    onlineUsers,
    groupMessagesByDate,
    formatChatDate,
    hasMore,
    observerRefs,
    sent
}) => {
    const containerRef = useRef(null);
    const receiverbubble = selectedChat?.wallpaper?.receiverbubble || 'white';
    const senderbubble = selectedChat?.wallpaper?.senderbubble || '#52357B';
    const rMesColor = selectedChat?.wallpaper?.rMesColor || 'black';
    const sMesColor = selectedChat?.wallpaper?.sMesColor || 'white';
    const systemMesColor = selectedChat?.wallpaper?.systemMesColor || 'black';
    const iColor = selectedChat?.wallpaper?.iColor || 'black';
    let isOnline = onlineUsers.has(id);
    const socket = useSocket()

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
            console.log(messages);
        }
    }, [messages]);


    const lastReads = {};
    messages.forEach((m) => {
        if (m.readBy && m.readBy.length > 0) {
            m.readBy.forEach((uid) => {
                // overwrite so only the latest read remains
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


    const groupedMessages = groupMessagesByDate(messages);

    console.log(groupedMessages)
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
            {groupedMessages?.map((group, idx) => (
                <div
                    key={idx}
                    data-date={group.date} // always set this
                    ref={(el) => {
                        if (el) observerRefs.current[group.date] = el;
                        else delete observerRefs.current[group.date]; // cleanup
                    }}>
                    {/* Date header */}
                    <div className="text-center my-3 text-sm" style={{ color: systemMesColor }}>
                        {console.log(hasMore)}
                        {formatChatDate(group.date)}

                    </div>
                    {console.log(group.date)}
                    {console.log(group.date)}

                    {/* Messages under this date */}
                    {group.messages.map((msg, index) => {

                        // System message
                        if (msg?.isSystem || msg?.type === 'system') {
                            return (
                                <div
                                    key={msg._id || index}
                                    className="text"
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '0.85rem',
                                        color: systemMesColor,
                                        textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)',
                                        fontStyle: 'italic',
                                        whiteSpace: 'normal',
                                        overflowWrap: 'break-word',
                                        maxWidth: '300px',
                                        margin: 'auto',
                                    }}
                                >
                                    {msg?.content || msg?.text}
                                </div>
                            );
                        }

                        const isSent = msg?.sender?._id === currentUser?._id;

                        return (
                            <>
                                <div
                                    key={msg?._id || index || `${msg.createdAt}-${index}`}
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
                                        {isSent ? (
                                            msg.status === "sending" ? (
                                                <div style={{ color: iColor }}>
                                                    <i className="fa-solid fa-paper-plane"></i>
                                                </div>
                                            ) : msg.status === 'failed' ? (
                                                <div style={{ color: "red" }}>
                                                    <i className="fa-solid fa-circle-exclamation"></i>
                                                </div>
                                            ) : (<Avatar
                                                src={msg?.sender?.avatar || '/avatars/laughing.png'}
                                                width="2"
                                                height="2"
                                                hideBorder={isSent}
                                                isOnline={isOnline}
                                            />
                                            )
                                        ) : (

                                            <Avatar
                                                src={msg?.sender?.avatar || '/avatars/laughing.png'}
                                                width="2"
                                                height="2"
                                                hideBorder={isSent}
                                                isOnline={isOnline}
                                            />
                                        )
                                        }

                                        <div
                                            style={{
                                                backgroundColor: isSent ? senderbubble : receiverbubble,
                                                color: isSent ? sMesColor : rMesColor,
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
                                            {msg?.replyTo && (
                                                <div
                                                    style={{
                                                        backgroundColor: isSent ? senderbubble : receiverbubble,
                                                        color: isSent ? sMesColor : rMesColor,
                                                        padding: '6px 10px',
                                                        borderLeft: '4px solid #888',
                                                        borderRadius: '8px',
                                                        marginBottom: '8px',
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    <strong>{msg?.replyTo.sender?.username || 'Unknown'}: </strong>
                                                    {msg?.replyTo?.content || msg?.replyTo?.text || 'Message unavailable'}


                                                </div>
                                            )}

                                            {msg?.text}
                                            {/* {isSent && <div>
                                            <Stamp avatar={selectedChat?.avatar} />
                                        </div>} */}

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
                                                        color: iColor
                                                    }}
                                                    title="Reply to this message"
                                                />
                                            )}
                                        </div>

                                        {isSent && (
                                            <div
                                                className="d-flex align-items-center gap-3"
                                                style={{ cursor: 'pointer', color: iColor }}
                                            >
                                                <div
                                                    onClick={() => {
                                                        setEditingMessageId(msg?._id);
                                                        setEditingText(msg?.text);
                                                    }}
                                                    style={{ fontSize: '0.8rem' }}
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </div>
                                                <div
                                                    onClick={() => onDeleteMessage(msg?._id)}
                                                    style={{ fontSize: '0.8rem', color: iColor }}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: '0.72rem',
                                            color: systemMesColor,
                                            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)',
                                            marginTop: '4px',
                                            paddingLeft: isSent ? '0' : '40px',
                                            paddingRight: isSent ? '40px' : '0',
                                        }}
                                    >
                                        {moment(msg?.createdAt).format('h:mm A')}
                                    </div>
                                    {/* Only for your messages → show Seen/Unseen
                                {isSent && (
                                    <span style={{ color: readers.length > 0 ? "green" : "gray" }}>
                                        {readers.length > 0 ? `Seen by ${selectedChat?.avatar}` : "Unseen"}
                                    </span>
                                )} */}

                                </div>
                                {/* Read receipts*/}
                                <div
                                    className="my-2"
                                    style={{
                                        display: "flex",
                                        gap: "4px",
                                        marginTop: "4px",
                                        paddingLeft: "40px",
                                        paddingRight: "s0px",
                                    }}
                                >
                                    {Object.entries(lastReads).map(([userId, lastMsgId]) => {
                                        if (lastMsgId === msg._id && userId !== currentUser._id) {
                                            const user = selectedChat?.otherUserId === userId;
                                            return (
                                                <>
                                                    <Avatar
                                                        key={userId}
                                                        src={user ? selectedChat?.avatar : "/avatars/laughing.png"}
                                                        width="1.5"
                                                        height="1.5"
                                                        hideBorder
                                                    />
                                                </>

                                            );
                                        }
                                        return null;
                                    })}
                                </div>

                            </>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default MessageBox;
