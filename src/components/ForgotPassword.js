import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavbar from './Sidebarnavbar';

const ForgotPassword = ({ showAlert }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: enter email, 2: verify OTP, 3: set new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBack = () => navigate(-1);

    // Step 1: Send reset email
    const handleSendEmail = async () => {
        if (!email) return showAlert("Enter your email", "warning");
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                showAlert(data.message || "OTP sent to your email", "warning");
                setStep(2);
            }

        } catch (err) {
            console.error(err);
            showAlert("Something went wrong", "danger");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async () => {
        if (!otp) return showAlert("Enter OTP", "warning");
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();
            if (res.ok) {
                showAlert("OTP verified! Set your new password", "success");
                setStep(3);
            } else {
                showAlert(data.error || "Invalid OTP", "danger");
            }
        } catch (err) {
            console.error(err);
            showAlert("Something went wrong", "danger");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Set new password
    const handleSetNewPassword = async () => {
        if (!newPassword || !confirmPassword) return showAlert("Fill all fields", "warning");
        if (newPassword !== confirmPassword) return showAlert("Passwords do not match", "warning");
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/reset-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                showAlert("Password changed successfully!", "success");
                navigate('/login');
            } else {
                showAlert(data.error || "Failed to reset password", "danger");
            }
        } catch (err) {
            console.error(err);
            showAlert("Something went wrong", "danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            {/* Sidebar for medium+ */}
            <div className="d-none d-md-block">
                <SidebarNavbar />
            </div>

            <div className="flex-grow-1 p-3 body" style={{ marginLeft: '0', marginTop: '20px' }}>
                <div className="container" style={{ maxWidth: '500px' }}>
                    <div className="d-flex align-items-center mb-4">
                        <button className="btn btn-outline-dark me-3" onClick={handleBack}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <h4 className="ms-3 mb-0">Forgot Password</h4>
                    </div>

                    <div className="bg-light p-4 rounded shadow-sm body">
                        {step === 1 && (
                            <>
                                <p>Enter your registered email to receive OTP</p>
                                <input
                                    type="email"
                                    className="form-control mb-3"
                                    placeholder="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <button className="btn btn-primary w-100" onClick={handleSendEmail} disabled={loading}>
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <p>Enter the OTP sent to your email</p>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="OTP"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                />
                                <button className="btn btn-primary w-100" onClick={handleVerifyOtp} disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <p>Set your new password</p>
                                <input
                                    type="password"
                                    className="form-control mb-3"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    className="form-control mb-3"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                                <button className="btn btn-primary w-100" onClick={handleSetNewPassword} disabled={loading}>
                                    {loading ? 'Setting...' : 'Set Password'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
