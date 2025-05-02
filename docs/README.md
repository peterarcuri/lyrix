# 🎵 Lyrix

**Lyrix** is a full-stack MERN (MongoDB, Express, React, Node.js) application that lets users search for song lyrics, create custom playlists, and manage their favorite songs — all secured with **JWT authentication**.

---

## 🚀 Features

- 🔐 User registration and login with JWT authentication  
- 🔎 Search song lyrics by **Title** or **Artist**  
- 🎶 Save songs to custom-named playlists  
- 🗑️ Remove songs from playlists  
- 💾 Playlists saved locally in browser **localStorage**

---

## 🏗️ Tech Stack

- **Frontend:** React (Vite + TypeScript)  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **Authentication:** JWT  
- **Storage:** Browser localStorage (for playlists)

---

## 📂 Project Structure

```
/backend
├── models/
├── routes/
├── middleware/
├── config/
├── app.ts
└── server.ts

/frontend
└── src/
    ├── components/
    ├── pages/
    ├── context/
    ├── services/
    ├── utils/
    ├── types.ts
    ├── App.tsx
    └── main.tsx
```

---

## 🛣️ API Routes

### 🔐 Authentication

- `POST /api/auth/signup` – Register a new user  
- `POST /api/auth/login` – Login and receive a JWT token  

### 🎵 Songs

- `GET /api/songs?title=...&artist=...` – Search for song lyrics *(requires JWT token)*

---

## 🔑 Authentication Flow

1. User signs up or logs in  
2. A JWT token is generated and stored in **localStorage**  
3. The token is attached to all protected API requests

---

## 🎼 Playlist Management (Frontend)

- Custom playlists are saved under the `lyrix_playlists` key in `localStorage`
- Helper functions manage adding/removing songs

```ts
interface Playlist {
  name: string;
  songs: Song[];
}
```

---

## ⚙️ Setup Instructions

### 🔧 Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in `/backend` with:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

### 🎨 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## ✨ Future Improvements

- Move playlists to backend (MongoDB) for cross-device syncing  
- Add full-text search on lyrics  
- Responsive UI/UX improvements  
- Forgot password / Reset password feature  
- Dark mode toggle 🌙  

---

## 🧑‍💻 Developer

**Peter Arcuri**

---

## 🎧 Enjoy using Lyrix!
