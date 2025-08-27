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
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import LoadingBar from "react-top-loading-bar";
import Alert from './components/Alert';

//import ChatContext from './context/chats/ChatContext';
//import VerticalThinNavbar from './components/VerticalThinNavbar';

function App() {
    //const context = useContext(ChatContext);
    const [selectedChat, setSelectedChat] = useState(null);
    const [progress, setProgress] = useState(0);

    const [alert, setAlert] = useState(null);
    const showAlert = (message, type) => {
        setAlert({
            msg: message,
            type: type
        })
        setTimeout(() => {
            setAlert(null);
        }, 1500)
    }

    return (
        <>

            <ChatState>
                <LoadingBar
                    color="#C71E64"
                    progress={progress}
                    onLoaderFinished={() => setProgress(0)}
                />
                <Alert alert={alert}/>
                <Router>
                    <Notifications selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
                    <Routes>
                         
                        <Route path='/' element={<Home showAlert={showAlert} selectedChat={selectedChat} setSelectedChat={setSelectedChat} setProgress={setProgress} />} />
                        <Route path='/groups' element={<Home showAlert={showAlert} selectedChat={selectedChat} setSelectedChat={setSelectedChat} setProgress={setProgress} />} />
                        <Route path='/friends' element={<Home showAlert={showAlert} selectedChat={selectedChat} setSelectedChat={setSelectedChat} setProgress={setProgress} />} />
                        <Route path='/arrequest' element={<Home showAlert={showAlert} selectedChat={selectedChat} setSelectedChat={setSelectedChat} setProgress={setProgress} />} />
                        <Route path='/login' element={<Login showAlert={showAlert} setProgress={setProgress} />} />
                        <Route path='/signup' element={<Signup showAlert={showAlert} setProgress={setProgress} />} />
                        <Route path='/ChooseAvatar' element={<ChooseAvatar showAlert={showAlert} setProgress={setProgress} />} />
                        <Route path='/requests' element={<Requests showAlert={showAlert} setProgress={setProgress} />} />
                        <Route path='/settings' element={<Settings showAlert={showAlert} setProgress={setProgress} />} />
                        <Route path='/help' element={<Help showAlert={showAlert} setProgress={setProgress} />} />
                        <Route path='/privacy' element={<Privacy showAlert={showAlert} setProgress={setProgress} />} />
                        <Route path='/notifysettings' element={<NotifySettings showAlert={showAlert} setProgress={setProgress} />} />
                        <Route path='/profile' element={<Profile showAlert={showAlert} setProgress={setProgress} />} />
                        <Route path='/account' element={<Account showAlert={showAlert} setProgress={setProgress} />} />
                        <Route path='/profile/change-password' element={<ChangePassword showAlert={showAlert} setProgress={setProgress} />} />
                        <Route path='/profile/forgot-password' element={<ForgotPassword showAlert={showAlert} setProgress={setProgress} show={false}/>} />
                        

                    </Routes>

                </Router>

            </ChatState>
        </>
    );
}

export default App;
