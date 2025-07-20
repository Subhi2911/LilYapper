import React from 'react';
import Navbar from './Navbar';
import ChatReceiver from './ChatReceiver';
import { useLocation } from 'react-router-dom';
import RequestSidebar from './RequestSidebar';
import AcceptRequest from './AcceptRequest';

const ChatSidebar = ({
  refreshGroups,
  chatList = [],
  groups = [],
  isMobile,
  selectedChat,
  setSelectedChat,
  users = [],
  sentRequests = new Set(),
  pendingRequests = new Set(),
  friends = new Set(),
  setSelectedUser,
  handleClick,
  cancelRequest,
  fetchUsers,
  hasMore,
  handleSkip,
  handleAccept,
  handleReject,
  user,
}) => {
  const location = useLocation();

  const safeChatList = Array.isArray(chatList) ? chatList : [];
  const safeGroups = Array.isArray(groups) ? groups : [];

  let displayChats = [];
  if (location.pathname === '/') {
    displayChats = [...safeChatList, ...safeGroups];
  } else if (location.pathname === '/groups') {
    displayChats = safeGroups;
  }

  const pendingRequestsArray = Array.isArray(pendingRequests)
    ? pendingRequests
    : Array.from(pendingRequests);

  return (
    (!isMobile || !selectedChat) && (
      <div
        style={{
          width: isMobile ? '100vw' : '350px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRight: isMobile ? 'none' : '1px solid #ccc',
          backgroundColor: '#5459AC',
        }}
      >
        <Navbar refreshGroups={refreshGroups} setSelectedChat={setSelectedChat}/>

        {(location.pathname === '/' || location.pathname === '/groups') && (
          <div className="p-3 overflow-auto" style={{ flex: 1 }}>
            <h5 className="text-white mb-3">Chats</h5>
            <ul className="list-group">
              {displayChats.map((item) => (
                <li
                  key={item._id}
                  className="list-group-item my-2"
                  onClick={() => {
                    console.log("Clicked chat:", item);
                    setSelectedChat(item);
                  }}
                  style={{ cursor: 'pointer', borderRadius: 'inherit' }}
                >
                  {console.log("item", item)}
                  <ChatReceiver
                    avatar={
                      item.isGroupChat
                        ? item.avatar || '/avatars/hugging.png'
                        : item.avatar || '/avatars/laughing.png'
                    }
                    name={item.isGroupChat ? item.chatName : item.username}
                    latestMessage={
                      item.latestMessage?.content ||
                      (item.isGroupChat ? 'Group chat' : 'Tap to start chat')
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {location.pathname === '/arrequest' && (
          <RequestSidebar
            users={users}
            sentRequests={sentRequests}
            pendingRequests={pendingRequests}
            friends={friends}
            setSelectedUser={setSelectedUser}
            handleClick={handleClick}
            cancelRequest={cancelRequest}
            fetchUsers={fetchUsers}
            hasMore={hasMore}
            isMobile={isMobile}
            handleSkip={handleSkip}
          />
        )}

        {location.pathname === '/friends' && (
          <AcceptRequest
            receivedRequests={pendingRequestsArray}
            users={users}
            setSelectedUser={setSelectedUser}
            handleClick={handleClick}
            fetchUsers={fetchUsers}
            hasMore={hasMore}
            isMobile={isMobile}
            handleSkip={handleSkip}
            handleAccept={handleAccept}
            handleReject={handleReject}
            setSelectedChat={setSelectedChat}
          />
        )}
      </div>
    )
  );
};

export default ChatSidebar;
