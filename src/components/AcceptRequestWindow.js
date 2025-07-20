import React from 'react';
import Avatar from './Avatar';

const AcceptRequestWindow = ({
  selectedUser,
  handleAccept,
  handleReject,
  handleBack
}) => {
  if (!selectedUser) return null;

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        padding: '1rem',
        backgroundColor: '#ffffffcc',
        borderRadius: '1rem',
        boxShadow: '0 0 8px rgba(0,0,0,0.1)',
      }}
    >
      <button
        className="btn btn-secondary mb-3"
        onClick={handleBack}
      >
        🔙 Back
      </button>

      <div className="text-center">
        <Avatar src={selectedUser.avatar} height="5" width="5" />
        <h4 className="mt-3">{selectedUser.username}</h4>
        <p>{selectedUser.bio || "No bio provided"}</p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            className="btn btn-success px-4"
            onClick={() => handleAccept(selectedUser)}
          >
            ✅ Accept
          </button>
          <button
            className="btn btn-danger px-4"
            onClick={() => handleReject(selectedUser)}
          >
            ❌ Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptRequestWindow;
