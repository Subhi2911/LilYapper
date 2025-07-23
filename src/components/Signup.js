import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const host = process.env.REACT_APP_BACKEND_URL;
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', email: '', password: '', cpassword: '' });

    useEffect(() => {
        document.body.classList.add('signup-body');
        return () => {
            document.body.classList.remove('signup-body');
        };
    }, []);

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (credentials.password !== credentials.cpassword) return;

        try {
            const response = await fetch(`${host}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: credentials.username,
                    email: credentials.email,
                    password: credentials.password
                }),
            });
            let json = {};
            const text = await response.text();
            
            try { json = JSON.parse(text); } catch { }

            if (response.ok && json.success) {
                console.log(json)
                localStorage.setItem('token', json.authToken);
                localStorage.setItem('userId', json.user._id);
                localStorage.setItem('user', JSON.stringify(json.user)); 
                navigate("/chooseavatar");
                //props.showAlert("Account Created Successfully!", "success");
            }
        } catch (err) {
            console.error("Network error:", err);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 px-3" style={{marginTop:"5rem",marginBottom:"5rem"}}>
            <div className="container p-4 rounded" style={{
                maxWidth: '500px',
                backgroundColor: "white",
                border: '2px solid white',
                color: "white",
                
            }}>
                <h2 className="text-center mb-4" style={{ color: "black" }}>Create an account to continue</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label" style={{ color: "black" }}>Username</label>
                        <input type="text" className="form-control" name="username" id="username" onChange={onChange} value={credentials.username} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label" style={{ color: "black" }}>Email address</label>
                        <input type="email" className="form-control" id="email" name="email" onChange={onChange} value={credentials.email} />
                        <div className="form-text" style={{ color: "#471396" }}>We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label" style={{ color: "black" }}>Password</label>
                        <input type="password" className="form-control" id="password" name="password" onChange={onChange} value={credentials.password} />
                        <div className="form-text" style={{ color: "#471396" }}>Password must be at least 8 characters.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cpassword" className="form-label" style={{ color: "black" }}>Confirm Password</label>
                        <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} value={credentials.cpassword} />
                        <div style={{ height: '0.8rem' }}>
                            <div className="form-text" style={{
                                visibility: credentials.password === credentials.cpassword ? 'hidden' : 'visible',
                                transition: 'visibility 0.2s ease',
                                color: "#471396"
                            }}>
                                Passwords do not match.
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-warning w-100">Submit</button>
                    <div className="d-flex justify-content-center align-items-center mt-4" style={{ color: 'black' }}>
                        <p className="mb-0 me-1">Already have an account?</p>
                        <Link to='/login' className="text-primary text-decoration-underline">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
