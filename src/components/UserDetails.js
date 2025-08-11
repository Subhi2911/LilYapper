import React from 'react';
import Avatar from './Avatar';

const UserDetails = ({ user, currentUser, groupAdmin, onMakeAdmin, onRemove, onClose, removeFromGroup, selectedChat }) => {
    const currentUserId = localStorage.getItem('userId');
    const isAdmin = groupAdmin.some(admin => admin._id === currentUserId);
    console.log(groupAdmin)
    const canManage = isAdmin && currentUser?._id !== user?._id;
    //console.log('hdydgydg8', currentUser)
    return (
        <div className="p-3 text-white" style={{ borderLeft: '1px solid #ccc', height: '100%' }}>
            <button className="btn btn-light mb-3" onClick={onClose}>← Back</button>
            <div className="d-flex flex-column align-items-center">
                <Avatar src={user.avatar} size={100} isGroup={false} />
                <h5 className="mt-2">{user.username}</h5>
                <p className="text-muted text-center">{user.bio || "No bio"}</p>
            </div>
        {console.log(selectedChat)}
            {canManage && (
                
                <div className="mt-4">
                    <button onClick={() => removeFromGroup(selectedChat?._id, user._id)} className="btn btn-warning mb-2 w-100">Remove from Group</button>
                    <button onClick={() => onMakeAdmin(selectedChat?._id,user._id)} className="btn btn-info w-100">Make Group Admin</button>
                </div>
            )}
        </div>
    );
};

export default UserDetails;
