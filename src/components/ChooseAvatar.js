import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';
import UserInfo from './UserInfo';
import { useNavigate } from 'react-router-dom';

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

const ChooseAvatar = () => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState(avatarList[0]);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        document.body.classList.add('signup-body');
        return () => document.body.classList.remove('signup-body');
    }, []);

    const handleNext =()=>{
        navigate('/requests')
    }

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
        editAvatar(avatar); // Save to backend
        setShowOptions(false);
    };

    return (
        <div className="container-fluid d-flex flex-column align-items-center pt-4">

            <div style={{ position: 'relative', marginBottom: '3rem' }}>
                <Avatar src={selectedAvatar} />
                <i
                    className="fa-solid fa-camera camera-icon"
                    onClick={() => setShowOptions(!showOptions)}
                    style={{ position: 'absolute', bottom: 0, right: 0, cursor: 'pointer' }}
                ></i>

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

            <div>
                <UserInfo />
            </div>
            <button type="button" className="btn btn-outline-light my-3" onClick={handleNext}>Next</button>
        </div>
    );
};

export default ChooseAvatar;
