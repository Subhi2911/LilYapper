import React, { useEffect } from 'react';
import { useSocket } from '../context/chats/socket/SocketContext';



const wallpapers = [
    { name: "ChatBg", url: '/wallpapers/ChatBg.png', senderbubble: '#52357B', receiverbubble: 'white', rMesColor:'black', sMesColor:'white', systemMesColor:' white' , iColor:'white' },
    { name: "Blank", url: '/wallpapers/Blank.jpg', senderbubble: '#86275e', receiverbubble: 'black', rMesColor:'white', sMesColor:'white', systemMesColor:' black', iColor:'black'  },
    { name: "ColoredSky", url: '/wallpapers/ColoredSky.jpg', senderbubble: '#52357B', receiverbubble: 'white' , rMesColor:'black', sMesColor:'white', systemMesColor:' white' , iColor:'white' },
    { name: "DancingCat", url: '/wallpapers/DancingCat.jpg', senderbubble: '#52357B', receiverbubble: 'black' , rMesColor:'white', sMesColor:'white', systemMesColor:' white' , iColor:'black' },
    { name: "IceAndCoffee", url: '/wallpapers/IceAndCoffee.jpg', senderbubble: '#52357B', receiverbubble: 'black' , rMesColor:'white', sMesColor:'white', systemMesColor:' white' , iColor:'black' },
    { name: "LittleCat", url: '/wallpapers/LittleCat.jpg', senderbubble: '#52357B', receiverbubble: 'black' , rMesColor:'white', sMesColor:'white', systemMesColor:' white' , iColor:'black' },
    { name: "InternetDark", url: '/wallpapers/InternetDark.jpg', senderbubble: '#5459AC', receiverbubble: 'white' , rMesColor:'black', sMesColor:'white', systemMesColor:' white' , iColor:'white' },
    { name: "LittlePlushie", url: '/wallpapers/LittlePlushie.jpg', senderbubble: '#471396', receiverbubble: 'white' , rMesColor:'black', sMesColor:'white', systemMesColor:' white' , iColor:'white' },
    { name: "Love1", url: '/wallpapers/Love1.jpg', senderbubble: '#D50B8B', receiverbubble: 'white' , rMesColor:'black', sMesColor:'white', systemMesColor:' white' , iColor:'white' },
    { name: "Love2", url: '/wallpapers/Love2.jpg', senderbubble: '#D50B8B', receiverbubble: 'white' , rMesColor:'black', sMesColor:'white', systemMesColor:' white' , iColor:'white' },
    { name: "Potato", url: '/wallpapers/Potato.jpg', senderbubble: '#FFDE63', receiverbubble: 'black' , rMesColor:'white', sMesColor:'black', systemMesColor:' black' , iColor:'black' },
    { name: "TomAndJerry", url: '/wallpapers/TomAndJerry.jpg', senderbubble: '#FFDE63', receiverbubble: 'white' , rMesColor:'black', sMesColor:'black', systemMesColor:' white' , iColor:'white' },
];


const WallpaperSelectorModal = ({ chatId, onClose, setWallpaperUrl, setSelectedChat, selectedChat }) => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const socket = useSocket();
    //const {fetchChats} = useContext(ChatContext)

    // useEffect(() => {
    //     if (!socket) return;
    //     console.log('djdjjdjddj')

    //     const handleWallpaperUpdated = ({ chatId, newWallpaper }) => {
    //         console.log("wallpaper change", newWallpaper);
    //         if (selectedChat?._id === chatId) {
    //             setSelectedChat(prevChat => ({
    //                 ...prevChat,
    //                 wallpaper: newWallpaper, // Correct access
    //                 receiverbubble: newWallpaper.receiverbubble,
    //                 senderbubble: newWallpaper.senderbubble
    //             }));
    //             console.log(selectedChat)
    //         }
    //         if (fetchChats) fetchChats()
            
    //     };


    //     socket.on('wallpaper-updated', handleWallpaperUpdated);
    //     return () => socket.off('wallpaper-updated', handleWallpaperUpdated);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [socket, selectedChat?._id]);

    // Close modal on Escape key press
    useEffect(() => {
        const onEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [onClose]);

    const handleWallpaperChange = async (wallpaper) => {
        console.log(wallpaper)
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
                    rMesColor: wallpaper.rMesColor,
                    sMesColor: wallpaper.sMesColor,
                    systemMesColor: wallpaper.systemMesColor,
                    iColor: wallpaper.iColor
                }),
                
            });

            if (res.ok) {
                const data = await res.json();
                console.log(data)

                // Update local selectedChat wallpaper immediately
                // setSelectedChat(prevChat => ({
                //     ...prevChat,
                //     wallpaper: data.wallpaper,
                //     receiverbubble: data.receiverbubble,
                //     senderbubble: data.senderbubble
                // }));
                const wallpaperData = {
                    url: data.wallpaper.url,
                    senderbubble: data.wallpaper.senderbubble,
                    receiverbubble: data.wallpaper.receiverbubble,
                    rMesColor: data.wallpaper.rMesColor,
                    sMesColor: data.wallpaper.sMesColor,
                    systemMesColor: data.wallpaper.systemMesColor,
                    iColor: data.wallpaper.iColor
                };
                console.log(wallpaperData)
                if (socket) {
                    socket.emit('change-wallpaper', {
                        _id:data._id,
                        chatId: selectedChat._id,
                        username: data.username,
                        wallpaperData
                    })
                }


                
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
