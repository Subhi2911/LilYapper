import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavbar from './Sidebarnavbar';

const Privacy = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleBack = () => {
        navigate(-1); // go back to previous page
    };

    return (
        <div className="d-flex">
            {/* Sidebar only on medium+ screens */}
            <div className="d-none d-md-block">
                <SidebarNavbar handleLogout={handleLogout} />
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 p-3 body" style={{ marginLeft: '0', marginTop: '20px' }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    
                    {/* Top Mobile Logo and Back */}
                    <div className="d-flex align-items-center mb-4">
                        <button
                            className="btn btn-outline-dark me-3"
                            onClick={handleBack}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        
                        <h4 className="ms-3 mb-0">Privacy Policy</h4>
                    </div>

                    {/* Policy Content */}
                    <div className="bg-light p-4 rounded shadow-sm body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <p>
                            Your privacy is important to us. This Privacy Policy outlines how Lilyapper collects, uses, and protects your information.
                        </p>
                        <h6>1. Information Collection</h6>
                        <p>
                            We collect user data such as username, bio, and contact details to personalize your experience on Lilyapper.
                        </p>
                        <h6>2. How We Use Your Data</h6>
                        <p>
                            Your data is used to enhance your app experience, display relevant content, and support communication features.
                        </p>
                        <h6>3. Data Sharing</h6>
                        <p>
                            We do not sell or rent your personal data. Some third-party services may have access only as necessary to operate our platform.
                        </p>
                        <h6>4. Security</h6>
                        <p>
                            We use advanced encryption and security practices to safeguard your information.
                        </p>
                        <h6>5. Your Choices</h6>
                        <p>
                            You can update or delete your information from your account settings at any time.
                        </p>
                        <p className="text-muted mt-4">
                            For any concerns or questions, contact us via the Help section.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
