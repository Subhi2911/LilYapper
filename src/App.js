import './App.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ChatState from './context/chats/ChatState';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import ChooseAvatar from './components/ChooseAvatar';
import Requests from './components/Requests';

//import ChatContext from './context/chats/ChatContext';
//import VerticalThinNavbar from './components/VerticalThinNavbar';

function App() {
    //const context = useContext(ChatContext);

    return (
        <>
            <ChatState>
                <Router>
                    
                    <Routes>
                        <Route path='/' element={<Home/>}/>
                        <Route path='/friends' element={<Home/>}/>
                        <Route path='/arrequest' element={<Home/>}/>
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/ChooseAvatar' element={<ChooseAvatar />} />
                        <Route path='/requests' element={<Requests />} />
                    </Routes>
                </Router>
            </ChatState>
        </>
    );
}

export default App;
