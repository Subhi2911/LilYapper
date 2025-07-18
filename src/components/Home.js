import React, { useEffect } from 'react'
import ChatLayout from './ChatLayout'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate=useNavigate();
    const token=localStorage.getItem('token');

    useEffect(()=>{
        if (!token || token === 'undefined' || token === 'null') {
        navigate('/login');
        return;
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[token])

  return (
    <div>
        
      <ChatLayout/>
    </div>
  )
}

export default Home
