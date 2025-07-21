import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SocketProvider } from './context/chats/socket/SocketContext';
import ChatState from './context/chats/ChatState';
import {NotificationProvider} from './context/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider>
      <NotificationProvider>
        <ChatState>
          <App />
        </ChatState>
      </NotificationProvider>
    </SocketProvider>
  </React.StrictMode>
);
reportWebVitals();
