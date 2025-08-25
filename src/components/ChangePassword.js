import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarNavbar from "./Sidebarnavbar";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBack = () => navigate(-1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || "Password changed successfully!");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage(data.error || "Failed to change password.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Server error. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            <div className="d-none d-md-block">
                <SidebarNavbar />
            </div>

            <div className="flex-grow-1 p-3 body" style={{ marginLeft: '0', marginTop: '20px' }}>
                <div className="container" style={{ maxWidth: '500px' }}>
                    {/* Back button */}
                    <div className="d-flex align-items-center mb-4">
                        <button className="btn btn-outline-dark me-3" onClick={handleBack}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <h4 className="ms-3 mb-0">Change Password</h4>
                    </div>

                    {/* Form Card */}
                    <div className="bg-light p-4 rounded shadow-sm body">
                        <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className="form-control"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Changing..." : "Change Password"}
                            </button>
                            <Link to ='/profile/forgot-password' style={{textDecoration:'underline', color:'blue'}}>Forgot Password</Link>
                        </form>
                        {message && <p className="mt-3 text-danger">{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
