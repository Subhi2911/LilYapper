import React from 'react'
import ChatContext from './ChatContext';

const FriendState = (props) => {
    const host = process.env.REACT_APP_BACKEND_URL
    const fetchFriends = async () => { 
	try {
		const res = await fetch(`${host}/api/auth/friends`, {
			headers: {
				'auth-token': localStorage.getItem('token'),
			}
		});
		const data = await res.json();
		return data.friends || [];
	} catch (err) {
		console.error("Failed to fetch friends", err);
		return [];
	}
};
  return (
    

    <ChatContext.Provider
            value={{
                fetchFriends
            }}
        >
            {props.children}
        </ChatContext.Provider>
  )
}

export default FriendState
