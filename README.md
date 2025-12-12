# ScoreScreener

**ScoreScreener** is a modern, high-performance stock screening application designed with a minimalist "Swiss Grid" aesthetic. It allows users to filter, analyze, and track stocks with ease.

## Features

### 🔍 Powerful Screener
- **Filtering**: Filter stocks by Sector, Market Cap, Price, and Dividend Yield.
- **Sorting**: Sort results by any metric (Market Cap, P/E Ratio, Beta, etc.).
- **Interactive Table**: Clean, data-dense display using Shadcn UI.
- **Stock Details**: Click any stock to view historical price charts (Sparklines) and key statistics.

### 🔐 Authentication & Profiles
- **JWT Authentication**: Secure Sign Up and Sign In flow.
- **User Profiles**: Personalized profile page with Bio and Join date.
- **Offline Support**: The authentication system works even without a database connection (temporarily stores users in memory).

### ⭐️ Watchlist
- **Track Favorites**: Add interesting stocks to your personal watchlist for quick access.
- **Real-time Updates**: Watchlist stays in sync with market data.

### 🎨 Design
- **Swiss Grid System**: A strict, content-first layout system.
- **Dark Mode**: Sleek dark aesthetic by default.
- **Responsive**: Fully responsive sidebar and content area.

---

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
- **Charts**: Recharts
- **State Management**: React Context (Auth)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or Local)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/score-screener.git
    cd score-screener
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    - Create a `.env` file:
        ```env
        PORT=5001
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_secret_key
        ```
    - Seed the database (optional but recommended):
        ```bash
        # You can call the seed endpoint after starting the server
        # GET http://localhost:5001/api/seed
        ```
    - Start the server:
        ```bash
        npm start
        ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    ```
    - Create a `.env.local` file:
        ```env
        NEXT_PUBLIC_API_URL=http://localhost:5001/api
        ```
    - Start the development server:
        ```bash
        npm run dev
        ```

4.  **Open the App**
    - Visit `http://localhost:3000`

---

## Project Structure

```
score-screener/
├── backend/
│   ├── src/
│   │   ├── config/         # DB Connection
│   │   ├── models/         # Mongoose Models (User, Stock, Profile)
│   │   ├── routes/         # Express Routes
│   │   ├── middleware/     # Auth Middleware
│   │   └── data/           # Mock data for seeding
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router Pages
│   │   ├── components/     # React Components (UI, Auth, Screener)
│   │   ├── context/        # Global State (AuthContext)
│   │   ├── lib/            # Utilities & Types
│   │   └── ...
│   └── ...
└── ...
```

## Potential Future Updates
- **Real-time Data**: Integration with WebSocket APIs for live ticking prices.
- **Social Features**: Share watchlists or analysis with other users.
- **Portfolio Tracking**: Simulate buy/sell orders and track portfolio performance.
- **News Feed**: Integrate financial news APIs for relevant stock news.
