import React, { useEffect, useRef } from "react";

const ChatWinPlaceholder = ({ length }) => {
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom (like real chat window)
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [length]);

    return (
        <div className="d-flex flex-column h-100 p-3 gap-3">
            {/* Chat messages placeholder */}
            <div className="flex-grow-1 overflow-auto d-flex flex-column gap-3">
                {[...Array(length || 10)].map((_, i) => (
                    <div
                        key={i}
                        className={`d-flex ${i % 2 === 0 ? "justify-content-start" : "justify-content-end"}`}
                    >
                        {i % 2 === 0 && (
                            <div
                                className="rounded-circle bg-secondary me-2"
                                style={{ width: "36px", height: "36px" }}
                            ></div>
                        )}
                        <div
                            className={`p-2 rounded-3 placeholder-glow ${
                                i % 2 === 0
                                    ? "bg-secondary text-start rounded-start"
                                    : "bg-primary text-end rounded-end"
                            }`}
                            style={{
                                width: i % 3 === 0 ? "180px" : "120px",
                                height: "20px",
                            }}
                        >
                            <span className="placeholder col-12 my-3"></span>
                        </div>
                    </div>
                ))}
                {/* Invisible div to force scroll-to-bottom */}
                <div ref={messagesEndRef}></div>
            </div>
        </div>
    );
};

export default ChatWinPlaceholder;
