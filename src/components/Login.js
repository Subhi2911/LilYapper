import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Login = (props) => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    useEffect(() => {
        document.body.classList.add('login-body');
        
        return () => {
            document.body.classList.remove('login-body');
            
        };
    }, []); 
    
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
            
        });
        const json = await response.json();

        if (json.success) {
            //save the token and resirect
            localStorage.setItem('token', json.authToken);
            //props.showAlert("Logged in Successfully!! ","success" )
            navigate('/chooseavatar');

        }
        else {
            //props.showAlert(json.error,"danger" )
        }
    }
    return (
        <div
            style={{
                width: '450px',
                backgroundColor: '#5459AC',
                borderRadius: '10px',
                color: 'white',
                padding: '20px',
            }}
        >
            <div className='container text-center my-2' style={{marginBottom:'2rem', color:'#FFCC00'}}>
                <h2>Login to continue..</h2>
            </div>
            <form className='my-2' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input type="email" className="form-control" id="email" name='email'  onChange={onChange} aria-describedby="emailHelp"/>
                    <div id="emailHelp" className="form-text text-light"  >
                        We'll never share your email with anyone else.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input type="password" className="form-control" name='password'  onChange={onChange} id="password"/>
                </div>
                <button type="submit" className="btn btn-light">
                    Submit
                </button>
                <p className='mx-1 my-3'>Don't have an account? Create new <Link className="btn btn-outline-light mx-3 my-1" to='/signup' type="submit">Signup</Link></p>
            </form>
        </div>

    );
};

export default Login;
