import React, { useContext, useEffect, useState } from 'react';
import chatBg from '../images/ChatBg.png';
import UserBar from './UserBar';
import MessageBox from './MessageBox';
import Keyboard from './Keyboard';
import { useLocation } from 'react-router-dom';
import RequestWindow from './RequestWindow';
import ChatContext from '../context/chats/ChatContext';

const ChatWindow = ({
  selectedChat,
  setSelectedChat,
  isMobile,
  users,
  sentRequests,
  pendingRequests,
  friends,
  handleSkip,
  selectedUser,
  setSelectedUser,
  handleAccept,
  handleReject,
}) => {
  const location = useLocation();
  const { fetchMessages, sendmessage, currentUser } = useContext(ChatContext);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat?._id || !currentUser?._id) {
        setMessages([]);
        return;
      }

      try {
        const fetchedMessages = await fetchMessages(selectedChat._id);

        // Add type and text properties for easier rendering in MessageBox
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

    loadMessages();
  }, [selectedChat, currentUser, fetchMessages]);

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
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const showLilyapperWelcome =
    !selectedChat && !['/friends', '/arrequest', '/groups'].includes(location.pathname);

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
      {/* Main Chat View */}
      {(location.pathname === '/' || location.pathname === '/groups') && selectedChat && (
        <>
          <UserBar
            name={selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.username}
            avatar={selectedChat?.avatar || '/avatars/laughing.png'}
            setSelectedChat={setSelectedChat}
          />
          <div
            className="flex-grow-1 overflow-auto hide-scrollbar w-100"
            style={{ padding: '1rem', height: 'calc(100vh - 150px)' }}
          >
            <div style={{ padding: '1rem', borderRadius: '8px' }}>
              {/* Debugging messages */}
              
              <MessageBox messages={messages} />
            </div>
          </div>
          <div
            style={{
              padding: '10px 16px',
              position: 'relative',
              zIndex: 10,
              width: '100%',
            }}
          >
            <Keyboard onSend={handleSend} />
          </div>
        </>
      )}

      {/* Friend Request View */}
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

      {/* Lilyapper Welcome Screen */}
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
