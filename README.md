# 🚗 Car Marketplace - Fullstack Web Application

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Comprehensive automotive trading platform featuring a modern architecture, robust backend logic, and a responsive user interface.

---

## 🌟 Key Features

- **Dual-Protocol API:** Combines REST for authentication and file uploads with GraphQL for complex car listing queries.
- **Role-Based Access Control (RBAC):** Distinct permissions for **Admin**, **Seller**, and **Buyer**.
- **Advanced Filtering:** Multi-parameter search (brand, price range, fuel type, etc.) powered by GraphQL resolvers.
- **Security First:** JWT-based stateless authentication, password hashing with Bcrypt, and protected API routes.
- **Cloud Ready:** Fully containerized environment with production-optimized Docker builds.

---

## 🛠 Tech Stack

### **Backend & Database**
- **Runtime:** Node.js (Express.js)
- **Database:** PostgreSQL with **Sequelize ORM**
- **Query Language:** GraphQL (Apollo Server)
- **Auth:** JWT (JSON Web Tokens) & Bcrypt

### **Frontend**
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS (Utility-first)
- **Data Fetching:** Apollo Client (GraphQL)
- **Form Management:** React Hook Form & Zod

### **DevOps & CI/CD**
- **Containerization:** Docker & Docker Compose
- **Automation:** GitHub Actions (Linting, Testing, Build)
- **Web Server:** Nginx (Reverse Proxy)

---

## 📁 Project Structure

```text
├── backend/                 # Node.js API Server
│   ├── src/
│   │   ├── controllers/     # REST request handlers
│   │   ├── models/          # Database schemas (Sequelize)
│   │   ├── graphql/         # TypeDefs & Resolvers
│   │   ├── services/        # Core business logic
│   │   └── middleware/      # Auth & Error handlers
│   └── migrations/          # DB version control
├── frontend/                # React/Vite Application
│   ├── src/
│   │   ├── components/      # Reusable UI atoms/molecules
│   │   ├── pages/           # Route-level views
│   │   └── hooks/           # Custom React logic
└── docker-compose.yml       # Production orchestration
🚀 Getting Started
Prerequisites
Node.js (v18+)
PostgreSQL (v15+)
Docker (Optional)
Installation
Clone & Install:
code
Bash
git clone https://github.com/Ivansi52/Car_Marketplace.git
cd Car_Marketplace
npm run setup # Custom script to install all dependencies
Environment Setup:
Create a .env file in the backend/ directory:
code
Env
PORT=5000
DB_NAME=car_marketplace
JWT_SECRET=your_secret_key
Run with Docker:
code
Bash
docker-compose up --build
🔒 Security & Performance
Optimized Queries: Implemented SQL indexing and eager loading to prevent N+1 issues in GraphQL.
Middleware Protection: Custom auth and roleCheck middlewares for secure resource access.
Modern Form Handling: Client-side validation to reduce unnecessary server load.
🎯 Roadmap & Future Updates

Real-time Chat: Implementing WebSockets for buyer-seller communication.

Payment Integration: Stripe/Stripe integration for premium listings.

Image Optimization: Automated WebP conversion and CDN delivery.
📄 License
Distributed under the MIT License. See LICENSE for more information.
