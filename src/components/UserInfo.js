import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const UserInfo = () => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const location=useLocation()
    const [user, setUser] = useState({
        username: '',
        bio: '',
        dateOfJoining: ''
    });

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ username: '', bio: '' });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${host}/api/auth/getuser`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token')
                    }
                });
                
                const data = await res.json();
                console.log(data)
                setUser({
                    username: data.user.username,
                    bio: data.user.bio,
                    dateOfJoining: data.user.date
                        ? new Date(data.user.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })
                        : 'N/A'
                });
                setFormData({ username: data.user.username, bio: data.user.bio });
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchUser();
    }, [host]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`${host}/api/auth/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(formData)
            });
            const json = await res.json();
            if (json.success) {
                setUser(prev => ({
                    ...prev,
                    username: formData.username,
                    bio: formData.bio
                }));
                setEditMode(false);
            }
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    return (
        <div className="d-flex justify-content-center mt-4 px-3">
            <div
                className="card shadow p-4 border-0"
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    minWidth: '350px',  // fixed width - keeps width constant even on small edits
                    borderRadius: '1rem',
                    backgroundColor: '#5459AC',
                    boxSizing: 'border-box',
                }}
            >
                <h4 className="text-center mb-4" style={{ color: '#FFCC00' }}>👤 Profile Details</h4>

                {/* Username */}
                <div className="mb-3">
                    <label className="form-label fw-semibold text-light">Username</label>
                    {editMode ? (
                        <input
                            type="text"
                            className="form-control w-100"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    ) : (
                        <div className="p-2 border rounded bg-light">{user.username}</div>
                    )}
                </div>

                {/* Bio */}
                <div className="mb-3">
                    <label className="form-label fw-semibold text-light">Bio</label>
                    {editMode ? (
                        <textarea
                            className="form-control w-100"
                            name="bio"
                            rows="3"
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    ) : (
                        <div className="p-2 border rounded bg-light" style={{ whiteSpace: 'pre-line' }}>{user.bio}</div>
                    )}
                </div>

                {/* Date of Joining */}
                <div className="mb-3">
                    <label className="form-label fw-semibold text-light">Date of Joining</label>
                    <div className="p-2 border rounded bg-light">{user.dateOfJoining}</div>
                </div>

                {/* Buttons */}
                <div className="text-center">
                    {editMode ? (
                        <>
                            <button className="btn btn-success me-2 px-4" onClick={handleSave}>💾 Save</button>
                            <button className="btn btn-outline-dark  px-4" onClick={() => setEditMode(false)}>Cancel</button>
                        </>
                    ) : (
                        location.pathname==='/chooseavatar' || location.pathname==='/profile'?(
                        <button className="btn btn-outline-light  px-4" onClick={() => setEditMode(true)}>✏️ Edit</button>):(
                            null
                        )
                    )}
                
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
