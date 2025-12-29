# ScoreScreener

**ScoreScreener** is a full-stack stock screening and analysis application that enables users to filter, analyze, and track stocks based on various financial metrics. Built with modern web technologies, it provides real-time market data, personalized watchlists, and comprehensive stock analytics.

🚀 **Live Demo:** [https://score-screener.vercel.app/](https://score-screener.vercel.app/)

🎥 **Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/1zza1vHyKIZbt8S6k84Zo6UdIShhT4u6i/view?usp=sharing)

## What is ScoreScreener?

ScoreScreener is a comprehensive stock screening tool designed for investors and traders who need to quickly filter and analyze stocks based on fundamental metrics. The application provides:

- **Advanced Filtering System**: Screen stocks by sector, market capitalization, price range, and dividend yield to find investment opportunities that match your criteria
- **Real-time Market Data**: Integration with Alpha Vantage API provides up-to-date stock prices, company information, and historical data
- **Detailed Stock Analysis**: View comprehensive stock details including price charts, P/E ratios, beta values, dividend yields, and more
- **Personal Watchlists**: Save and track your favorite stocks for quick access and monitoring
- **User Authentication**: Secure account system with JWT-based authentication to protect user data and preferences
- **Responsive Design**: Fully responsive interface that works seamlessly across desktop and mobile devices

## Features

### 🔍 Stock Screening & Analysis
- **Multi-criteria Filtering**: Filter stocks by Sector, Market Cap, Price Range, and Dividend Yield
- **Dynamic Sorting**: Sort results by any metric (Market Cap, P/E Ratio, Beta, Dividend Yield, etc.)
- **Interactive Data Table**: Clean, data-dense display with sortable columns
- **Stock Detail View**: Click any stock to view:
  - Historical price charts with sparkline visualization
  - Key financial metrics (P/E Ratio, Market Cap, Beta, EPS)
  - Company information and sector classification
  - Dividend yield and payout information

### 🔐 User Authentication & Profiles
- **Secure Authentication**: JWT-based authentication system with encrypted password storage
- **User Registration**: Create an account with email and password
- **Profile Management**: Personalized profile page displaying user bio and account information
- **Session Management**: Persistent login sessions with secure token handling
- **Fallback Mode**: Application works with in-memory storage when database is unavailable

### ⭐️ Watchlist Management
- **Add to Watchlist**: Save stocks to your personal watchlist for easy tracking
- **Watchlist Page**: Dedicated page to view all your saved stocks
- **Protected Access**: Watchlist features require authentication to ensure data privacy
- **Persistent Storage**: Watchlist data is stored in MongoDB and associated with your user account
- **Quick Actions**: Add/remove stocks from watchlist directly from the screener table

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) with App Router - React framework for production-grade applications
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript for better development experience
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) - Re-usable components built with Radix UI primitives
- **Charts**: [Recharts](https://recharts.org/) - Composable charting library for data visualization
- **State Management**: React Context API - For global authentication state
- **HTTP Client**: Fetch API - For making API requests to the backend

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) - JavaScript runtime for server-side applications
- **Framework**: [Express.js](https://expressjs.com/) - Minimal and flexible Node.js web application framework
- **Database**: [MongoDB](https://www.mongodb.com/) - NoSQL database for flexible data storage
- **ODM**: [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling for Node.js
- **Authentication**: 
  - [JSON Web Tokens (JWT)](https://jwt.io/) - Secure token-based authentication
  - [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Password hashing for secure storage
- **Market Data**: [Alpha Vantage API](https://www.alphavantage.co/) - Real-time and historical stock market data
- **CORS**: [cors](https://www.npmjs.com/package/cors) - Enable cross-origin resource sharing

### Development Tools
- **Package Manager**: npm - Node package manager
- **Version Control**: Git - Distributed version control system
- **Deployment**: 
  - Frontend: [Vercel](https://vercel.com/) - Optimized for Next.js applications
  - Backend: Node.js hosting platform

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
        ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
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
│   │   └──middleware/     # Auth Middleware
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
