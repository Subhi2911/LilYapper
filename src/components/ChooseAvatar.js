import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';
import UserInfo from './UserInfo';
import { useLocation, useNavigate } from 'react-router-dom';

const avatarList = [
    '/avatars/laughing.png',
    '/avatars/crying.png',
    '/avatars/hugging.png',
    '/avatars/excited.png',
    '/avatars/angry.png',
    '/avatars/sad.png',
    '/avatars/cycling.png',
    '/avatars/greeting.png',
    '/avatars/sarcastic.png',
    '/avatars/arrogant.png',
    '/avatars/rude.png',
];

const ChooseAvatar = ({ onAvatarSelect, userAvatar }) => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();
    // eslint-disable-next-line no-unused-vars
    const [user, setUser] = useState(null);

    const [selectedAvatar, setSelectedAvatar] = useState(userAvatar || avatarList[0]);
    const [showOptions, setShowOptions] = useState(false);
    useEffect(() => {
        if (userAvatar) {
            setSelectedAvatar(userAvatar);
        }
    }, [userAvatar]);

    useEffect(() => {
        if (location.pathname === '/chooseavatar') {
            document.body.classList.add('signup-body');
            return () => document.body.classList.remove('signup-body');
        }
        console.log(userAvatar)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNext = () => {
        navigate('/requests');
    };

    const editAvatar = async (avatar) => {
        try {
            const response = await fetch(`${host}/api/auth/avatar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ avatar }),
            });

            const json = await response.json();
            if (json.success) {
                setUser((prev) => ({ ...prev, avatar: json.avatar }));
            }
        } catch (error) {
            console.error('Error changing avatar:', error);
        }
    };

    const handleAvatarClick = (avatar) => {
        setSelectedAvatar(avatar);
        if (typeof onAvatarSelect === 'function') {
            onAvatarSelect(avatar);
        } else {
            editAvatar(avatar || '/avatars/laughing.png');
        }
        setShowOptions(false);
    };

    return (
        <div className="container-fluid d-flex flex-column align-items-center pt-4">

            <div style={{ position: 'relative', marginBottom: '3rem' }}>
                <Avatar src={selectedAvatar} />

                {/* Camera icon inside black circular background */}
                <div
                    onClick={() => setShowOptions(!showOptions)}
                    style={{
                        position: 'absolute',
                        bottom: 4,
                        right: 4,
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'black',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 0 6px rgba(0,0,0,0.6)',
                        transition: 'background-color 0.2s ease',
                    }}
                    aria-label="Change avatar"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setShowOptions(!showOptions);
                        }
                    }}
                >
                    <i
                        className="fa-solid fa-camera"
                        style={{ color: 'white', fontSize: '16px' }}
                    ></i>
                </div>

                {showOptions && (
                    <div
                        className="avatar-grid"
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 50px)',
                            gap: '8px',
                            backgroundColor: '#fff',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            zIndex: 10,
                        }}
                    >
                        {avatarList.map((avatar, index) => (
                            <img
                                key={index}
                                src={avatar}
                                alt={`Avatar ${index}`}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    border: selectedAvatar === avatar ? '2px solid #5459AC' : '1px solid #ccc',
                                }}
                                onClick={() => handleAvatarClick(avatar)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {location.pathname === '/chooseavatar' && (
                <div>
                    <UserInfo />
                    <button
                        type="button"
                        className="btn btn-warning my-3"
                        onClick={handleNext}
                        style={{ marginLeft: '1.5rem', width: '90%' }}
                    >
                        Next
                    </button>
                </div>)}

        </div>
    );
};

export default ChooseAvatar;
