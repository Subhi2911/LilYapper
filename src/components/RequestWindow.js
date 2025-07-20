import React from 'react';
import Avatar from './Avatar';
import AnotherUser from './AnotherUser';
import { useLocation } from 'react-router-dom';

const RequestWindow = ({
    handleAccept,
    handleReject,
    selectedUser,
    isMobile,
    handleBack,
    sentRequests = new Set(),
    pendingRequests = new Set(),
    handleSkip
}) => {
    const location = useLocation();
    const getButtonState = (userId) => {
        if (sentRequests.has(userId)) return { text: 'Sent', disabled: true };
        if (pendingRequests.has(userId)) return { text: 'Pending', disabled: true };
        return { text: '📨 Add Friend', disabled: false };
    };

    const { text: btnText, disabled: btnDisabled } = selectedUser
        ? getButtonState(selectedUser._id)
        : { text: '', disabled: true };

    return (
        <div
            style={{
                flex: '1 1 60%',
                backgroundImage: location.pathname === '/requests' ? `url(${require('../images/LoginBg.png')})` : '',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '1rem',
                boxShadow: '0 0 8px rgba(0,0,0,0.1)',
                padding: '1rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
        >
            {isMobile && selectedUser && (
                <button className="btn btn-light mb-3" onClick={handleBack} style={{ width: '6rem' }}>
                    ← Back
                </button>
            )}

            {selectedUser ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                        <Avatar src={selectedUser.avatar} height="6" width="6" />
                    </div>

                    <div style={{ marginBottom: '0.5rem' }}>
                        <AnotherUser userId={selectedUser._id} disable={btnDisabled} text={btnText} />
                    </div>
                </>
            ) : (
                <div className='container text-center'>
                    <img
                        src={require('../images/lilyapper.png')}
                        alt='img'
                        style={{ height: '10rem', width: '10rem', objectFit: 'contain' }}
                    />
                    <h4>LilYapper - Because Silence is Boring</h4>
                    <p>A real-time chat application with private messaging, group chats, and online/offline status.</p>
                    <h2>Select a user to view details</h2>
                </div>
            )}

            {!isMobile && location.pathname === '/requests' && (

                <button
                    onClick={handleSkip}
                    className="btn btn-warning"
                    style={{
                        position: 'sticky',
                        bottom: '1rem',
                        alignSelf: 'flex-end',
                        marginRight: '1rem',
                        width: '100px',
                        zIndex: 10,
                    }}
                >
                    {selectedUser && sentRequests.size > 0 ? 'Next →' : 'Skip →'}
                </button>
            )}
            {isMobile && location.pathname === '/friends' && selectedUser && (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        className="btn btn-success px-3"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(selectedUser);
                        }}
                    >
                        ✅ Accept
                    </button>
                    <button
                        className="btn btn-danger px-3"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReject(selectedUser);
                        }}
                    >
                        ❌ Reject
                    </button>
                </div>
            )}

        </div>
    );
};

export default RequestWindow;
