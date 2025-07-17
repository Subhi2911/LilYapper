import './App.css';
import {BrowserRouter as Router} from 'react-router-dom';
import ChatState from './context/chats/ChatState';

function App() {
  return (
    <>
    <Router>
        <ChatState>

        </ChatState>
    </Router>
    </>
  );
}

export default App;
