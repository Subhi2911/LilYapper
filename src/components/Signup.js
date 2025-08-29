import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const host = process.env.REACT_APP_BACKEND_URL;
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', email: '', password: '', cpassword: '' });
    const [verified, setVeriefied] = useState(false);
    const [step, setStep] = useState(1); // 1: enter email, 2: verify OTP
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        document.body.classList.add('signup-body');
        return () => {
            document.body.classList.remove('signup-body');
        };
    }, []);

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    // Step 1: Send email

    const handleSendEmail = async () => {
        if (!credentials.email) return props.showAlert("Enter your email", "warning");
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: credentials?.email })
            });
            const data = await res.json();
            if (res.ok) {
                props.showAlert(data.message || "OTP sent to your email", "warning");
                setStep(2);
            }

        } catch (err) {
            console.error(err);
            props.showAlert("Something went wrong", "danger");
        } finally {
            setVeriefied('wait');
            setLoading(false);
        }
    };



    // Step 2: Verify OTP
    const handleVerifyOtp = async () => {
        if (!otp) return props.showAlert("Enter OTP", "warning");
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: credentials.email, otp })
            });
            const data = await res.json();
            if (res.ok) {
                props.showAlert("OTP verified! Set your new password", "success");
                setStep(3);
                setVeriefied(true);
            } else {
                props.showAlert(data.error || "Invalid OTP", "danger");
            }
        } catch (err) {
            console.error(err);
            props.showAlert("Something went wrong", "danger");
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault();
        if (credentials.password !== credentials.cpassword) return;
        props.setProgress(30);
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
            props.setProgress(50);
            let json = {};
            const text = await response.text();
            props.setProgress(70);
            try { json = JSON.parse(text); } catch { }

            if (response.ok && json.success) {

                localStorage.setItem('token', json.authToken);
                localStorage.setItem('userId', json.user._id);
                localStorage.setItem('user', JSON.stringify(json.user));
                navigate("/chooseavatar");
                props.showAlert("Account Created Successfully!", "success");
            }
            props.setProgress(100);
            console.log(response)
            if (!response.ok)
                props.showAlert(response.error || "Something went Wrong", "danger")
        } catch (err) {
            props.showAlert("Internal Server Error", "danger");
        }
    };

    return (
        <>

            <div className="vh-100 px-3" style={{ marginTop: "5rem", marginBottom: "5rem" }}>
                <div className="d-flex justify-content-center align-items-center">
                    <p className="mx-2 my-3">powered by</p>
                    <h2 className="mt-3 text-center" style={{ color: 'yellow' }}>LittleAalu </h2>
                    
                </div>
                <div className="d-flex justify-content-center align-items-center" >

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
                            {
                                <>
                                    <div >
                                        <div className="mb-3 ">
                                            <label htmlFor="email" className="form-label" style={{ color: "black" }}>Email address</label>
                                            <div className='d-flex justify-content-start align-items-center'>
                                                <input type="email" className="form-control" id="email" name="email" onChange={onChange} value={credentials.email} style={{ width: '90%', marginRight: '1rem' }} />
                                                <button type='button' className={`mx-1 btn btn-${verified ? 'success' : 'primary'}`} onClick={handleSendEmail} >
                                                    {verified === true
                                                        ? "verified"
                                                        : verified === "wait"
                                                            ? "wait"
                                                            : 'verify' || ""}

                                                </button>
                                            </div>
                                            <div className="form-text" style={{ color: "#471396" }}>We'll never share your email with anyone else.</div>
                                        </div>

                                    </div>
                                </>}
                            {step === 2 && (
                                <>

                                    <label htmlFor="email" className="form-label" style={{ color: "black" }}>OTP</label>
                                    <div className='d-flex justify-content-start align-items-center'>
                                        <input
                                            type="text"
                                            className="form-control mb-3"
                                            placeholder="OTP"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            style={{ width: '90%', marginRight: '1rem', marginTop: '10px' }}
                                        />
                                        <button className="btn btn-primary " onClick={handleVerifyOtp} disabled={loading} style={{ fontSize: '0.5rem' }}>
                                            {loading ? 'Verifying...' : 'Verify OTP'}
                                        </button>
                                    </div>
                                </>
                            )}


                            {step === 3 && verified &&
                                <>
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
                                </>}
                            <button type="submit" className="btn btn-warning w-100">Submit</button>
                            <div className="d-flex justify-content-center align-items-center mt-4" style={{ color: 'black' }}>
                                <p className="mb-0 me-1">Already have an account?</p>
                                <Link to='/login' className="text-primary text-decoration-underline">Login</Link>
                            </div>
                        </form>
                    </div>
                </div >
            </div>
        </>
    );
};

export default Signup;
