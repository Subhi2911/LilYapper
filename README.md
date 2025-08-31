# 🌸 Lilyapper-Because Silence is boring

Lilyapper is a **real-time MERN chat application** built with **React, Node.js, Express, MongoDB, and Socket.IO**.  
It’s designed for smooth one-on-one and group conversations with modern social features like friend requests, notifications, chat wallpapers, and typing indicators.

---

## ✨ Features

- 🔐 **Authentication & Authorization**

  - Secure login & signup with JWT
  - User profiles with username & bio editing

- 👥 **Friendship System**

  - Send, accept, or reject friend requests
  - View pending requests in a dedicated sidebar

- 💬 **Real-Time Messaging**

  - One-on-one and group chats
  - Typing indicators
  - Message editing & deletion
  - Read receipts
  - Online/Offline status

- 👨‍👩‍👧‍👦 **Groups**

  - Create and manage groups
  - Admin controls (remove/make admin)
  - Add/remove members

- 🔔 **Notifications**

  - Friend request sent/accepted
  - Added to a group
  - Unread indicators (red dot system)

- 🎨 **Customization**

  - Chat wallpaper selector with system message confirmation

- ⚡ **Performance**
  - Infinite scrolling for chats, groups, and user lists
  - Optimized layout to prevent unnecessary API calls

---

## 🛠️ Tech Stack

- **Frontend:** React, Context API, React Router, TailwindCSS, shadcn/ui, Socket.IO client
- **Backend:** Node.js, Express, Mongoose, Socket.IO
- **Database:** MongoDB
- **Auth:** JWT
- **Other:** Infinite scrolling, modular component structure

---

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18)
- MongoDB (local or Atlas)
- npm / yarn

### Installation

1.  Clone the repository

    ```bash
    git clone https://github.com/subhi2911/lilyapper.git
    cd lilyapper

    ```

2.  Install Dependencies

    # for backend

    cd server
    npm install

    # for frontend

    cd ../client
    npm install

3.  Setup Environment Variables

    # server/.env

    MONGO_URI=YOUR_MONGO_URL
    JWT_SECRET=YOUR_JWT_SECRET
    ENCRYPTION_SECRET=YOUR_ENCRYPTION_SECRET
    EMAIL_USER=YOUR_EMAIL_ADDRESS
    EMAIL_PASS=YOUR_APP_PASSWORD

    # client/.env

    REACT_APP_BACKEND_URL=http://localhost:5000

4.  Run the app 
    # start backend
    cd server
    npm run dev

    # start frontend
    cd ../client
    npm start

# 🎯 Roadmap

 File sharing in chats

 Voice/video calls

 Message reactions

 Dark mode

# 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss changes.
Make sure to update tests as appropriate.

# 🌸 About

Lilyapper is a fun, modern chat app made for real-time conversations with friends and groups — blending social media vibes with messaging convenience.
