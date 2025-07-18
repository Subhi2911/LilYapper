import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const host = process.env.REACT_APP_BACKEND_URL;

    let navigate = useNavigate(); 
    const [credentials, setCredentials] = useState({ username: '', email: '', password: '', cpassword: '' })
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    useEffect(() => {
            document.body.classList.add('signup-body');
            
            return () => {
                document.body.classList.remove('signup-body');
                
            };
        }, []); 
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (credentials.password !== credentials.cpassword) {
            //props.showAlert("Passwords do not match", "danger");
            return;
        }

        try {
            
            const response = await fetch(`${host}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: credentials.username,
                    email: credentials.email,
                    password: credentials.password
                }),
            });
            
            let json = {};
            const text = await response.text(); // first get raw text
            
            try {
                json = JSON.parse(text); // try to parse JSON
            } catch (err) {
                console.warn("Could not parse JSON:", text);
            }
            if (response.ok && json.success) {
                localStorage.setItem("token", json.authToken);


                navigate("/chooseavatar");
                
                props.showAlert("Account Created Successfully!", "success");
            } else {
                console.error(json.error)
                //props.showAlert(json.error || "Signup failed", "danger");
            }
        } catch (err) {
            console.error("Network error:", err);
            //props.showAlert("Network error. Please try again later.", "danger");
           
        }
    };

return (
    <div style={{marginTop:'1rem'}}>
        <div className='container ' style={{backgroundColor:"rgb(84, 89, 172,0.5)",border:'2px solid white', borderRadius:"inherit", color:"white"}}>
            <h2 style={{marginBottom:'2rem', color:"#FFCC00"}}>Create an account to continue..</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="username" className="form-control" name='username' id="username" onChange={onChange} value={credentials.username} aria-describedby="usernameHelp" />

                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' onChange={onChange}  value={credentials.email} aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text" style={{color:"#FFCC00"}}>We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" onChange={onChange} value={credentials.password} name='password' />
                    <div id="passwordHelp" className="form-text" style={{color:"#FFCC00"}}>Password mush be 8 characters long.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" onChange={onChange} value={credentials.cpassword} name='cpassword' />
                    <div style={{height:'0.8rem'}}>
                        <div id="passwordHelp" style={{visibility: credentials.password===credentials.cpassword?'hidden':'visible',transition: 'visibility 0.2s ease',color:"#FFCC00"}} className="form-text">Password is not matching.</div>
                    </div>
                    
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
                <p className='mx-1 my-3' style={{color:"#FFCC00"}}>Already have an account? <Link className="btn btn-outline-light mx-3 my-1" to='/login' type="submit">Login</Link></p>
            </form>
        </div>
    </div>
)
}

export default Signup

