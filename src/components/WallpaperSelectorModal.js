import React, { useEffect } from 'react';

const wallpapers = [
    { name: "ChatBg", url: '/wallpapers/ChatBg.png', senderbubble: '#52357B', receiverbubble: 'white' },
    { name: "Blank", url: '/wallpapers/Blank.jpg', senderbubble: '#86275e', receiverbubble: 'black' },
    { name: "ColoredSky", url: '/wallpapers/ColoredSky.jpg', senderbubble: '#52357B', receiverbubble: 'white' },
    { name: "DancingCat", url: '/wallpapers/DancingCat.jpg', senderbubble: '#52357B', receiverbubble: 'black' },
    { name: "IceAndCoffee", url: '/wallpapers/IceAndCoffee.jpg', senderbubble: '#52357B', receiverbubble: 'black' },
    { name: "LittleCat", url: '/wallpapers/LittleCat.jpg', senderbubble: '#52357B', receiverbubble: 'black' },
    { name: "InternetDark", url: '/wallpapers/InternetDark.jpg', senderbubble: '#5459AC', receiverbubble: 'white' },
    { name: "LittlePlushie", url: '/wallpapers/LittlePlushie.jpg', senderbubble: '#471396', receiverbubble: 'white' },
    { name: "Love1", url: '/wallpapers/Love1.jpg', senderbubble: '#D50B8B', receiverbubble: 'white' },
    { name: "Love2", url: '/wallpapers/Love2.jpg', senderbubble: '#D50B8B', receiverbubble: 'white' },
    { name: "Potato", url: '/wallpapers/Potato.jpg', senderbubble: '#FFDE63', receiverbubble: 'black' },
    { name: "TomAndJerry", url: '/wallpapers/TomAndJerry.jpg', senderbubble: '#FFDE63', receiverbubble: 'white' },
];

const WallpaperSelectorModal = ({ chatId, onClose, fetchChats, setSelectedChat, selectedChat }) => {
    const host = process.env.REACT_APP_BACKEND_URL;
    // Close modal on Escape key press
    useEffect(() => {
        const onEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [onClose]);

    const handleWallpaperChange = async (wallpaper) => {
  try {
    const res = await fetch(`${host}/api/chat/${chatId}/wallpaper`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token') 
      },
      body: JSON.stringify({
        url: wallpaper.url,
        senderbubble: wallpaper.senderbubble,
        receiverbubble: wallpaper.receiverbubble,
      }),
    });

    if (res.ok) {
      const data = await res.json();

      // Update local selectedChat wallpaper immediately
      setSelectedChat(prevChat => ({
        ...prevChat,
        wallpaper: data.wallpaper,
        receiverbubble: data.receiverbubble,
        senderbubble: data.senderbubble
      }));

      if (fetchChats) fetchChats();
      onClose();
    } else {
      console.error('Failed to update wallpaper');
    }
  } catch (err) {
    console.error('Error updating wallpaper:', err);
  }
};



    // Prevent modal content click from closing modal
    const modalContentClick = (e) => e.stopPropagation();

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={onClose}
            aria-modal="true"
            aria-labelledby="wallpaperModalLabel"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div
                className="modal-dialog modal-dialog-centered modal-lg"
                role="document"
                onClick={modalContentClick}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="wallpaperModalLabel">Choose a wallpaper</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <div className="row">
                            {wallpapers.map((wallpaper, idx) => (
                                <div
                                    key={idx}
                                    className="col-6 col-sm-4 mb-3"
                                >
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className="border rounded overflow-hidden shadow-sm"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleWallpaperChange(wallpaper)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleWallpaperChange(wallpaper); }}
                                    >
                                        <img
                                            src={wallpaper.url}
                                            alt={wallpaper.name}
                                            className="img-fluid"
                                            style={{ height: '120px', objectFit: 'cover', width: '100%' }}
                                        />
                                        <div className="text-center py-2">{wallpaper.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WallpaperSelectorModal;
