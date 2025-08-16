import React, { useContext, useEffect, useState } from 'react';
import ChatLayout from './ChatLayout';
import { useNavigate } from 'react-router-dom';
import ChatContext from '../context/chats/ChatContext';
import NewChatModal from './NewChatModal';

const Home = ({ selectedChat, setSelectedChat }) => {
	const navigate = useNavigate();
	const token = localStorage.getItem('token');
	const { fetchConnections } = useContext(ChatContext);
	const [chatList, setChatList] = useState([]);

	useEffect(() => {
		const savedToken = token;
		if (!savedToken) {
			navigate('/login');
			return;
		}
		getConnections(); // initial fetch
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navigate, token]);


	const getConnections = async () => {
		try {
			const data = await fetchConnections();
			if (data) setChatList(data);
		} catch (error) {
			console.error("Error fetching connections:", error);
		}
	};


	return (
		<div>
			<ChatLayout chatList={chatList} selectedChat={selectedChat} setSelectedChat={setSelectedChat} getConnections={getConnections}/>
			<NewChatModal />
		</div>
	);
};

export default Home;
