import React from 'react'
import { Link } from 'react-router-dom';

const OffCanvasNavbar = ({ handleLogout, closeOffcanvasleft, offcanvasLeftRef, userAvatar }) => {
    const token = localStorage.getItem('token');

    return (
        <div>
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" ref={offcanvasLeftRef} style={{ backgroundColor: '#648DB3' }}>
                <div className="offcanvas-header">
                    <i className="fa-solid fa-bars fs-5 mx-3" style={{ cursor: 'pointer' }} onClick={closeOffcanvasleft}></i>
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">LilYapper</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="list-group">
                        <li className="list-group-item border-top my-2">
                            <i className="fa-solid fa-message mx-3"></i>
                            <Link onClick={closeOffcanvasleft} to="/" className="text-decoration-none text-dark">Home</Link>
                        </li>
                        <li className="list-group-item border-top my-2">
                            <i className="fa-solid fa-user-group mx-3"></i>
                            <Link onClick={closeOffcanvasleft} to="/groups" className="text-decoration-none text-dark">Groups</Link>
                        </li>
                        <li className="list-group-item border-top my-2">
                            <i className="fa-solid fa-user-plus mx-3"></i>
                            <Link onClick={closeOffcanvasleft} to="/arrequest" className="text-decoration-none text-dark">Requests</Link>
                        </li>
                        <li className="list-group-item border-top my-2">
                            <i className="fa-solid fa-handshake mx-3"></i>
                            <Link onClick={closeOffcanvasleft} to="/friends" className="text-decoration-none text-dark">Friends</Link>
                        </li>
                        <li className="list-group-item border-top my-2">
                            <i class="fa-solid fa-circle-user mx-3"></i>
                            <Link onClick={closeOffcanvasleft} to="/profile" className="text-decoration-none text-dark">Profile</Link>
                        </li>

                        {(!token || token === undefined || token === null) ? (
                            <li className="list-group-item border-top my-2">
                                <i className="fa-solid fa-right-to-bracket mx-3"></i>
                                <Link onClick={closeOffcanvasleft} to="/login" className="text-decoration-none text-dark">Login</Link>
                            </li>
                        ) : (
                            <li className="list-group-item border-top my-2">
                                <i className="fa-solid fa-right-from-bracket mx-3"></i>
                                <button type="button" onClick={() => { handleLogout(); closeOffcanvasleft(); }} className="text-dark text-decoration-none" style={{ border: 'none', backgroundColor: 'transparent', padding: '0' }}>Logout</button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>


    )
}

export default OffCanvasNavbar
