

Car Marketplace - Fullstack Web Application

A feature-rich automotive marketplace built with a modern, scalable tech stack.

🚀 Tech Stack

Backend

  - Node.js + Express — Server-side platform
  - PostgreSQL + Sequelize ORM — Relational database & modeling
  - GraphQL (Apollo Server) — API for complex data fetching
  - JWT — Stateless authentication & authorization
  - Bcrypt — Password hashing
  - Multer — File upload handling

Frontend

  - React + Vite — Fast, modern frontend development
  - TailwindCSS — Utility-first styling
  - Apollo Client — GraphQL client & state management
  - React Router — Client-side routing
  - React Hook Form — Efficient form handling
  - React Hot Toast — Slick notifications

DevOps & Tooling

  - Docker + Docker Compose — Containerization
  - GitHub Actions — CI/CD pipelines
  - ESLint + Prettier — Code quality & formatting

📁 Project Structure

car-marketplace/
├── backend/                 # Node.js API Server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # REST API endpoints
│   │   ├── middleware/      # Auth & error middlewares
│   │   ├── services/        # Business logic layer
│   │   ├── utils/           # Helper functions
│   │   ├── graphql/         # GraphQL schema & resolvers
│   │   └── config/          # Environment configuration
│   ├── migrations/          # Database migrations
│   ├── seeders/             # Initial data seeds
│   └── uploads/             # Static file storage
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Route views
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API communication
│   │   ├── utils/           # Frontend helpers
│   │   └── context/         # React Context API
│   └── public/              # Static assets
├── .github/workflows/       # Automated CI/CD pipelines
├── docker-compose.yml       # Docker orchestration
└── README.md                # Documentation

🚀 Quick Start

Prerequisites

  - Node.js 18+
  - PostgreSQL 15+
  - Docker (optional)

1. Clone the repository

git clone <repository-url>
cd car-marketplace

2. Install dependencies

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

3. Database Setup

# Create PostgreSQL database
createdb car_marketplace

# Configure environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your DB credentials

4. Run Migrations & Seeds

cd backend
npm run migrate
npm run seed

5. Launch Application

Local Development:

# Run backend (port 5000)
cd backend && npm run dev

# Run frontend (port 3000)
cd ../frontend && npm run dev

Using Docker:

docker-compose up -d
docker-compose logs -f

🌐 Accessing the App

  - Frontend: http://localhost:3000
  - Backend API: http://localhost:5000/api
  - GraphQL Playground: http://localhost:5000/graphql

👥 User Roles

  - Admin: Full access to system management.
  - Seller: Create and manage car listings.
  - Buyer: Browse cars and manage favorites.

📚 API Documentation

REST API Endpoints

Authentication

  - POST /api/auth/register — Register new user
  - POST /api/auth/login — Login & get token
  - POST /api/auth/logout — Clear session
  - GET /api/auth/me — Get current user profile

User Management

  - GET /api/users — List all users (Admin only)
  - GET /api/users/:id — Get specific user details
  - PUT /api/users/:id — Update profile
  - DELETE /api/users/:id — Remove user (Admin only)

Car Listings

  - GET /api/cars — Browse all listings
  - GET /api/cars/:id — Detailed car view
  - POST /api/cars — Create listing (Seller/Admin)
  - PUT /api/cars/:id — Update listing (Owner/Admin)
  - DELETE /api/cars/:id — Delete listing (Owner/Admin)

🛠️ Development Commands

Backend: npm run dev, npm run test, npm run lint Frontend: npm run dev, npm run
build, npm run preview Project-wide: npm run dev (concurrently runs both)

🔄 CI/CD The project uses GitHub Actions for:

  - Code Linting (ESLint)
  - Automated Testing (Jest)
  - Docker Image Builds
  - Continuous Deployment (to main branch)

🔒 Security Features

  - JWT for secure sessions
  - Bcrypt for password encryption
  - Helmet for HTTP header protection
  - CORS configuration
  - Rate limiting to prevent brute-force attacks
  - Input Validation & Sanitization

🎯 Roadmap

- [ ] Mobile App (React Native)
- [ ] Real-time Notifications (WebSockets)
- [ ] Payment Gateway Integration (Stripe)
- [ ] Rating & Review System
- [ ] Built-in Buyer-Seller Chat
- [ ] Recommendation System (ML-based)

📝 License Licensed under the MIT License.


