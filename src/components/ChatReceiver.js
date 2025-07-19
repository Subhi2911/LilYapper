import React from 'react'
import Avatar from './Avatar'

const ChatReceiver = (props) => {
    return (
        <div>
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <Avatar src={props.avatar} width="2" height="2" size="12" isOnline={props.isOnline} />
                    <p className="mx-3 mb-0">{props.name}</p>
                    
                </div>
                <span className="badge text-bg-secondary">4</span>
            </div>
            <span className='mx-5'>{props.latestMessage}</span>
        </div>
    )
}

export default ChatReceiver
