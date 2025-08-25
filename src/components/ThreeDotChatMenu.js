import React, { useState, useRef, useEffect } from 'react';


const ThreeDotChatMenu = ({
  isGroup,
  onDeleteChat,
  onContactInfo,
  onCloseChat,
  onRemoveFriend,
  onDeleteGroup,
  onLeaveGroup,
  onGroupInfo,
  selectedChat,
  setShowWallpaperModal,
  
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const currentUser=localStorage.getItem('userId');
  const isAdmin = selectedChat?.groupAdmin?.some(adminId => adminId?._id?.toString() === currentUser?.toString());
  console.log(isAdmin,'kskskksks',selectedChat)


  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setOpen(prev => !prev);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={menuRef} onClick={(e) => {e.stopPropagation()}}>
      <button
        aria-label="Menu"
        onClick={toggleMenu}
        className='btn text-decoration-none'
      >
        <i
          className="fa-solid fa-ellipsis-vertical mx-2"
          style={{ fontSize: '1.4rem', color: 'white' }}
        ></i>
      </button>

      {open && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            borderRadius: '4px',
            padding: '8px 0',
            margin: 0,
            listStyle: 'none',
            minWidth: '200px',
            zIndex: 1000,
          }}
        >
          {!isGroup ? (
            <>
            <li
                onClick={() => { setOpen(false); setShowWallpaperModal(true) }}
                style={menuItemStyle}
                tabIndex={0}
                onKeyDown={e => {if (e.key === 'Enter' || e.key === ' ') {setShowWallpaperModal(true);setOpen(false);}}}
              >
                Change Wallpaper
              </li>
              <li
                onClick={() => { onDeleteChat(selectedChat._id); setOpen(false); }}
                style={menuItemStyle}
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (onDeleteChat(), setOpen(false))}
              >
                Delete Chat
              </li>
              <li
                onClick={() => { onContactInfo(); setOpen(false); }}
                style={menuItemStyle}
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (onContactInfo(), setOpen(false))}
              >
                Contact Info
              </li>
              <li
                onClick={() => { onCloseChat(); setOpen(false); }}
                style={menuItemStyle}
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (onCloseChat(), setOpen(false))}
              >
                Close Chat
              </li>
              <li
                onClick={() => { onRemoveFriend(selectedChat.otherUserId, selectedChat._id); setOpen(false); }}
                style={{ ...menuItemStyle, color: 'red' }}
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (onRemoveFriend(), setOpen(false))}
              >
                Remove Friend
              </li>
            </>
          ) : (
            <>
            {(isAdmin || selectedChat.permissions.rename==='all') && <li
                onClick={() => { setOpen(false); setShowWallpaperModal(true) }}
                style={menuItemStyle}
                tabIndex={0}
                onKeyDown={e => {if (e.key === 'Enter' || e.key === ' ') {setShowWallpaperModal(true);setOpen(false);}}}
              >
                Change Wallpaper
              </li>}
              <li
                onClick={() => { onDeleteGroup(selectedChat._id); setOpen(false); }}
                style={{ ...menuItemStyle, color: 'red' }}
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (onDeleteGroup(), setOpen(false))}
              >
                Delete Group
              </li>
              <li
                onClick={() => { onLeaveGroup(); setOpen(false); }}
                style={menuItemStyle}
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (onLeaveGroup(), setOpen(false))}
              >
                Leave Group
              </li>
              <li
                onClick={() => { onGroupInfo(); setOpen(false); }}
                style={menuItemStyle}
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (onGroupInfo(), setOpen(false))}
              >
                Group Info
              </li>
              <li
                onClick={() => { onCloseChat(); setOpen(false); }}
                style={menuItemStyle}
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (onCloseChat(), setOpen(false))}
              >
                Close Chat
              </li>
            </>
          )}
        </ul>
      )}
      
    </div>
  );
};

const menuItemStyle = {
  padding: '8px 16px',
  cursor: 'pointer',
  userSelect: 'none',
};

export default ThreeDotChatMenu;
