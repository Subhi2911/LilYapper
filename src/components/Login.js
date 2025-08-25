import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = (props) => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    useEffect(() => {
        document.body.classList.add('login-body');
        return () => {
            document.body.classList.remove('login-body');
        };
    }, []);

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        props.setProgress(30);
        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        props.setProgress(50);

        const json = await response.json();
        props.setProgress(70);
        if (json.success) {
            localStorage.setItem('token', json.authToken);
            localStorage.setItem('userId', json.user._id);
            localStorage.setItem('user', JSON.stringify(json.user));
            props.showAlert("Logged in Successfully!! ","success" )
            navigate('/');
        }
        props.setProgress(100);
    };


    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div
                className="w-100 p-4 shadow"
                style={{
                    maxWidth: '450px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    color: 'white',
                }}
            >
                <div className='text-center mb-4' style={{ color: 'black' }}>
                    <h2>Login to continue..</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label" style={{ color: 'black' }}>
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            onChange={onChange}
                            aria-describedby="emailHelp"
                        />
                        <div id="emailHelp" className="form-text" style={{ color: '#471396' }}>
                            We'll never share your email with anyone else.
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label" style={{ color: 'black' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={onChange}
                            id="password"
                        />
                    </div>

                    <button type="submit" className="btn btn-warning w-100">
                        Submit
                    </button>
                    <div className="d-flex justify-content-center align-items-center mt-4" >
                        <Link to='/profile/forgot-password' style={{ textDecoration: 'underline', color: 'blue' }}>Forgot Password</Link>
                    </div>

                    <div className="d-flex justify-content-center align-items-center mt-4" style={{ color: 'black' }}>
                        <p className="mb-0 me-1">Don't have an account?</p>
                        <Link to='/signup' style={{ textDecoration: 'underline', color: 'blue' }}>Signup</Link>
                    </div>
                    

                </form>
            </div>
        </div>
    );
};

export default Login;
