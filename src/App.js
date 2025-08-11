import './App.css';
import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ChatState from './context/chats/ChatState';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import ChooseAvatar from './components/ChooseAvatar';
import Requests from './components/Requests';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Help from './components/Help';
import Privacy from './components/Privacy';
import NotifySettings from './components/NotifySettings';
import Profile from './components/Profile';
import Account from './components/Account';

//import ChatContext from './context/chats/ChatContext';
//import VerticalThinNavbar from './components/VerticalThinNavbar';

function App() {
    //const context = useContext(ChatContext);
    const [selectedChat, setSelectedChat] = useState(null); 

    return (
        <>
            <ChatState>
                <Router>
                    <Notifications selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>
                    <Routes>
                        <Route path='/' element={<Home selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>}/>
                        <Route path='/groups' element={<Home selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>}/>
                        <Route path='/friends' element={<Home selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>}/>
                        <Route path='/arrequest' element={<Home selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>}/>
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/ChooseAvatar' element={<ChooseAvatar />} />
                        <Route path='/requests' element={<Requests />} />
                        <Route path='/settings' element={<Settings/>}/>
                        <Route path='/help' element={<Help/>}/> 
                        <Route path='/privacy' element={<Privacy/>}/> 
                        <Route path='/notifysettings' element={<NotifySettings/>}/> 
                        <Route path='/profile' element={<Profile/>}/> 
                        <Route path='/account' element={<Account/>}/> 
                        
                    </Routes>
                    
                </Router>
            </ChatState>
        </>
    );
}

export default App;
