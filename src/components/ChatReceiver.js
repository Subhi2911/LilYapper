import React from 'react'
import Avatar from './Avatar'

const ChatReceiver = (props) => {
    return (
        <div>
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <Avatar name={props.name} width="2" height="2" size="12" />
                    <p className="mx-2 mb-0">{props.name}</p>
                </div>
                <span className="badge text-bg-secondary">4</span>
            </div>
        </div>
    )
}

export default ChatReceiver
