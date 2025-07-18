import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Avatar from './Avatar'

const UserBar = () => {
    const location= useLocation();
    
    return (
        <>
            <div>
                <nav className="navbar navbar-expand-lg " style={{height:'56px', backgroundColor:'#52357B'}}>
                    <div className="container-fluid d-flex align-items-center" >
                        <Link
                            to="/profile"
                            title="Profile"
                            className='my-1 mx-3'
                            style={{
                                fontSize: "1.5rem",
                                marginBottom: "20px",
                                textDecoration: "none",
                            }}
                        >
                            <Avatar name="Nikki Pandey" width="2" height="2" size="12" />
                        </Link>
                        <p className="navbar-brand my-1" href="/profile" style={{color:'white'}}>Reciever</p>

                        <div className="d-flex align-items-center ms-auto gap-5" id="navbarSupportedContent">
                            {/* Search Icon */}
                            <Link
                                to="/search"
                                className="text-decoration-none"
                                aria-label="New Chat"
                            >
                                <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '1.4rem',color: location.pathname==='/search' ? "#B2D8CE" : "white", }}></i>
                            </Link>
                            {/* More Options Icon */}
                            <Link
                                to="/moreoptions"
                                className="text-decoration-none "
                                aria-label="More Options"
                            >
                                <i className="fa-solid fa-ellipsis-vertical mx-2" style={{ fontSize: '1.4rem',color: location.pathname==='/moreoptions' ? "#B2D8CE" : "white", }}></i>
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default UserBar
