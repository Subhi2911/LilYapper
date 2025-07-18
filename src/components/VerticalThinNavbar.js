import React from "react";
import { Link, useLocation } from "react-router-dom";
import Avatar from "./Avatar";

export default function VerticalThinNavbar() {
    const location = useLocation();
    const token = localStorage.getItem('token');
    
    const links = [
        { to: "/", icon: <i className="fa-solid fa-message"></i>, label: "Home" },
        { to: "/groups", icon: <i className="fa-solid fa-user-group"></i>, label: "Groups" },
        { to: "/requests", icon: <i className="fa-solid fa-user-plus"></i>, label: "Requests" },
        { to: "/friends", icon: <i className="fa-solid fa-handshake"></i>, label: "Friends" }
    ];

    if (!token) {
        links.push({
            to: "/login",
            icon: <i className="fa-solid fa-right-to-bracket"></i>,
            label: "Login",
        });
    }

    return (
        <nav
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                width: "50px",
                backgroundColor: "#52357B",
                borderRight: "1px solid #ddd",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "15px",
                zIndex: 1001,
            }}
            aria-label="Vertical navigation"
        >
            {/* Hamburger for offcanvas */}
            <div
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasExample"
                aria-controls="offcanvasExample"
                style={{
                    cursor: 'pointer',
                    color: "white",
                    fontSize: "1.5rem",
                    marginBottom: '1rem'
                }}
            >
                <i className="fa-solid fa-bars"></i>
            </div>

            {/* Navigation Links */}
            {links.map(({ to, icon, label }) => {
                const isActive = location.pathname === to;
                return (
                    <Link
                        key={to}
                        to={to}
                        title={label}
                        style={{
                            color: isActive ? "#B2D8CE" : "white",
                            margin: "25px 0",
                            fontSize: "1.5rem",
                            textDecoration: "none",
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        {icon}
                    </Link>
                );
            })}

            {/* Spacer to push settings to bottom */}
            <div style={{ flexGrow: 1 }}></div>

            {/* Settings Icon */}
            <Link
                to="/settings"
                title="Settings"
                style={{
                    color: location.pathname === '/settings' ? "#B2D8CE" : "white",
                    fontSize: "1.5rem",
                    marginBottom: "20px",
                    textDecoration: "none",
                }}
            >
                <i className="fa-solid fa-gear"></i>
            </Link>
            <Link
                to="/profile"
                title="Profile"
                style={{
                    color: location.pathname === '/settings' ? "#B2D8CE" : "white",
                    fontSize: "1.5rem",
                    marginBottom: "20px",
                    textDecoration: "none",
                }}
            >
                <Avatar name="Nikki Pandey" width="2" height="2" size="12"/>
            </Link>
        </nav>
    );
}
