import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AnotherUser = ({ userId ,disable,text}) => {
    const location = useLocation();
    const [user, setUser] = useState({ avatar: '', username: '', bio: '', dateOfJoining: '', _id: '' });
    const host = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchAnotherUser = async () => {
            try {
                const response = await fetch(`${host}/api/auth/getanotheruser/${userId}`, {
                    method: "POST",
                    headers: {
                        "auth-token": localStorage.getItem('token')
                    }
                });
                const data = await response.json();

                setUser({
                    _id: data._id,
                    avatar: data.avatar,
                    username: data.username,
                    bio: data.bio,
                    dateOfJoining: data.date
                        ? new Date(data.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })
                        : 'N/A'
                });

            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        if (userId) {
            fetchAnotherUser();
        }
    }, [host, userId]);

    const handleClick = async () => {
        try {
            const response = await fetch(`${host}/api/auth/send-request/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert("Request sent successfully!");
            } else {
                alert(data.error || "Failed to send request");
            }

        } catch (error) {
            console.error('Failed to send request:', error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center mt-4 px-2">
            <div
                className="card shadow p-4 border-0 w-100"
                style={{
                    maxWidth: '500px',
                    width: '100%',
                    borderRadius: '1rem',
                    backgroundColor: '#5459AC',
                    boxSizing: 'border-box'
                }}
            >
                <h4 className="text-center mb-4" style={{ color: '#FFCC00' }}>👤 Profile Details</h4>

                {/* Username */}
                <div className="mb-3">
                    <label className="form-label fw-semibold text-light">Username</label>
                    <div className="p-2 border rounded bg-light">{user.username}</div>
                </div>

                {/* Bio */}
                <div className="mb-3">
                    <label className="form-label fw-semibold text-light">Bio</label>
                    <div className="p-2 border rounded bg-light" style={{ whiteSpace: 'pre-line' }}>{user.bio}</div>
                </div>

                {/* Date of Joining */}
                <div className="mb-3">
                    <label className="form-label fw-semibold text-light">Date of Joining</label>
                    <div className="p-2 border rounded bg-light">{user.dateOfJoining}</div>
                </div>

                {/* Send Request Button */}
                {location.pathname === '/requests' && (
                    <div className="text-center">
                        <button className="btn btn-warning text-dark px-4 mt-2" onClick={handleClick} disabled={disable}>
                            {disable?'📨 Send Request':text}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnotherUser;
