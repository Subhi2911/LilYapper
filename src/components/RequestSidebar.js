import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Avatar from './Avatar';
import Spinner from './Spinner';
import { useLocation } from 'react-router-dom';

const RequestSidebar = ({
  users,
  sentRequests,
  pendingRequests,
  friends,
  setSelectedUser,
  handleClick,
  cancelRequest,
  fetchUsers,
  hasMore,
  isMobile,
  handleSkip
}) => {
    const location=useLocation() 
  return (
    <div
      style={{
        flex: '1 1 40%',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: location.pathname==='/requests'?`url(${require('../images/LoginBg.png')})`:'',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '1rem',
        boxShadow: '0 0 8px rgba(0,0,0,0.1)',
        padding: '1rem',
        overflow: 'hidden',
      }}
    >
      <h3 style={{ marginBottom: '1rem', color: 'white' }}>
        {location.pathname==='/requests'?'Send request to users':'Add Friends'}
      </h3>

      {isMobile && location.pathname==='/requests'&& (
        <button
          onClick={handleSkip}
          className="btn btn-warning mb-2"
          style={{ alignSelf: 'flex-end' }}
        >
          Skip →
        </button>
      )}

      <div
        id="scrollableDiv"
        style={{
          flexGrow: 1,
          overflowY: 'scroll',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {users.length === 0 && !hasMore ? (
          <p className="text-white">No users found</p>
        ) : (
          <InfiniteScroll
            dataLength={users.length}
            next={fetchUsers}
            hasMore={hasMore}
            loader={<Spinner color="white"/>}
            scrollableTarget="scrollableDiv"
          >
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {users.map((user) => {
                const isSent = sentRequests.has(user._id);
                const isPending = pendingRequests.has(user._id);
                const isFriend = friends.has(user._id);

                let btnText = '📨 Add Friend';
                let btnDisabled = false;

                if (isFriend) {
                  btnText = 'Friends';
                  btnDisabled = true;
                } else if (isSent) {
                  btnText = 'Sent';
                  btnDisabled = true;
                } else if (isPending) {
                  btnText = 'Pending';
                  btnDisabled = true;
                }

                return (
                  <li
                    key={user._id}
                    style={{
                      padding: '0.75rem',
                      marginBottom: '0.75rem',
                      border: '1px solid #ccc',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      backgroundColor: '#fafafa',
                    }}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className='d-flex gap-3 my-2 align-items-center'>
                      <Avatar src={user.avatar} height='2' width='2' name={user?.username} />
                      <strong>{user.username}</strong>
                    </div>
                    <div className='d-flex justify-content-around'>
                      <button
                        className="btn btn-warning text-dark px-4 mt-2 me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!btnDisabled) handleClick(user);
                        }}
                        disabled={btnDisabled}
                      >
                        {btnText}
                      </button>

                      {isSent && (
                        <button
                          className="btn btn-outline-secondary px-4 mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelRequest(user);
                          }}
                        >
                          ❌ Cancel
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default RequestSidebar;
