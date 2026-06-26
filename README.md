# 🎓 ShikshaSetu

> **The all-in-one AI-powered student companion platform.**

ShikshaSetu is designed to simplify a student's journey from admission to employment. It acts as a centralized dashboard combining academic management, AI-powered learning tools, government opportunities, and career preparation.

---

## 🏗️ Tech Stack

This project is built using the modern **MERN Stack** with TypeScript:

- **Frontend:** React.js, TypeScript, Vite, React Router DOM, Bootstrap 5, Axios.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** MongoDB, Mongoose.
- **Authentication:** JWT (JSON Web Tokens), bcrypt.

**Why this stack?**
The MERN stack with TypeScript ensures type safety, excellent developer experience, and scalability. It is an industry standard, making it perfect for a college project team to learn enterprise-level development patterns while building a high-quality SaaS-like dashboard.

---

## 📁 Repository Structure

```text
ShikshaSetu/
│
├── client/                 # React Frontend
│   ├── public/             # Static assets (favicon, etc.)
│   ├── src/
│   │   ├── assets/         # CSS and images (main.css design system)
│   │   ├── components/     # Reusable UI components (Cards, Navbar, Sidebar)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── hooks/          # Custom hooks (useAuth)
│   │   ├── layouts/        # Page layouts (DashboardLayout)
│   │   ├── pages/          # Application pages (Login, Dashboard, Modules)
│   │   ├── routes/         # Routing logic (AppRoutes, Protected Routes)
│   │   ├── services/       # API integration (Axios, authService)
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Helpers and Mock Data
│   │   ├── App.tsx         # Root component
│   │   └── main.tsx        # React entry point
│   │
│   └── package.json        # Frontend dependencies
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── config/         # Environment variables and DB connection
│   │   ├── controllers/    # Request handlers (Business logic bridge)
│   │   ├── middleware/     # Express middleware (JWT Auth)
│   │   ├── models/         # Mongoose schemas (User, Attendance, etc.)
│   │   ├── routes/         # API endpoint definitions
│   │   ├── services/       # Core business logic and database queries
│   │   ├── utils/          # Helpers
│   │   ├── seed/           # Database seeding scripts
│   │   └── server.ts       # Express app entry point
│   │
│   └── package.json        # Backend dependencies
│
├── docs/                   # Additional documentation
├── .gitignore
├── .env.example            # Environment variables template
└── README.md               # You are here!
```

---

## 🚀 Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone <repository_url>
cd ShikshaSetu
```

### 2. Backend Setup
```bash
cd server
npm install
```

Configure environment variables:
1. Copy the `.env.example` file in the root directory to `.env`.
2. Ensure MongoDB is running locally (`mongodb://localhost:27017/shikshasetu`) or replace `MONGO_URI` with your MongoDB Atlas connection string.

Seed the database (Creates the demo user and mock data):
```bash
npm run seed
```

Start the backend server (runs on `http://localhost:5000`):
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```

Start the frontend development server (runs on `http://localhost:5173`):
```bash
npm run dev
```

---

## 🔐 Authentication Flow

1. **Signup:** User provides name, email, and password. Password is hashed using `bcrypt` and stored in MongoDB.
2. **Login:** Compares hashed password. On success, the backend returns a `JWT` (JSON Web Token).
3. **Session:** The frontend stores the JWT in `localStorage`. The `AuthContext` makes the user state globally available.
4. **Protected Routes:** `Axios` automatically attaches the JWT as a `Bearer` token to every request. `authMiddleware` on the server verifies the token to protect sensitive endpoints.

**Demo Credentials:**
- Email: `demo@shikshasetu.local`
- Password: `password123`

---

## 📡 API Documentation

Currently, the backend provides the following endpoints:

| Endpoint | Method | Protected | Description |
|----------|--------|-----------|-------------|
| `/api/auth/signup` | POST | No | Create a new user account |
| `/api/auth/login` | POST | No | Authenticate and receive JWT |
| `/api/auth/logout` | POST | No | Logout (stateless) |
| `/api/auth/profile` | GET | Yes | Retrieve logged-in user profile |
| `/api/academics/status` | GET | No | Check Academics API health |
| `/api/ai/status` | GET | No | Check AI Assistant API health |
| `/api/opportunities/scholarships` | GET | No | Retrieve list of scholarships |
| `/api/opportunities/schemes` | GET | No | Retrieve list of government schemes |
| `/api/career/interview-questions` | GET | No | Retrieve interview question bank |
| `/api/career/roadmap` | GET | No | Retrieve skill roadmap |

*(Note: Several endpoints currently return placeholder/mock data while business logic is being built.)*

---

## 🗄️ Database Models

- **User:** Stores authentication details (name, email, hashed password).
- **AttendanceRecord:** Tracks classes attended vs total for subjects, linked to a User.
- **StudyPlan:** User's custom study schedule and tasks.
- **Scholarship:** Platform-wide data on available scholarships.
- **GovernmentScheme:** Platform-wide data on state/central schemes.
- **Resume:** Links a saved resume profile to a User.
- **InternshipApplication:** Tracks the status (applied, interviewing, accepted) of a user's applications.
- **AIChatHistory:** Persists a user's past prompts and AI responses.

---

## 🤝 Team Workflow & Git Strategy

We use a feature-branch workflow to minimize merge conflicts.

**Main Branches:**
- `main` (Production-ready code only)
- `dev` (Active integration branch)

**Workflow Steps:**
1. Checkout the `dev` branch: `git checkout dev`
2. Pull the latest changes: `git pull origin dev`
3. Create your feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes and commit: `git commit -m "feat: added new thing"`
5. Push to GitHub: `git push origin feature/your-feature-name`
6. Open a Pull Request (PR) against the `dev` branch.

---

## 👥 Developer Responsibilities (Team Assignment)

This scaffold has been modularized so that each team member can work independently. You can copy the code from your assigned folders and provide it to your AI coding assistant.

| Developer | Primary Responsibility | Main Folders |
|-----------|------------------------|--------------|
| **Karan** | Frontend & Integration | `client/src/pages`, `routes`, `services` |
| **Khush** | Backend & Database | `server/src/routes`, `models`, `controllers` |
| **Kashish** | UI/UX & Styling | `client/src/components`, `assets/styles/main.css` |
| **Khushbu** | Feature Content & Docs | `utils/mockData.ts`, `seed/seedData.ts`, `docs` |

### Detailed Breakdown:

**1. Karan (Frontend & Integration)**
- Focus: Building React pages, forms, and linking them to backend APIs.
- AI Prompt Idea: *"I am working on `client/src/pages/academics/AcademicsHome.tsx`. Help me connect this page to my backend API using the Axios service in `client/src/services`."*

**2. Khush (Backend & Database)**
- Focus: Implementing business logic, AI API integration, and MongoDB queries.
- AI Prompt Idea: *"I need to implement the attendance prediction logic in `server/src/services/academicsService.ts` and save it to the `AttendanceRecord` Mongoose model."*

**3. Kashish (UI/UX & Styling)**
- Focus: Polishing the Bootstrap UI, adding responsive behavior, and improving the CSS design system.
- AI Prompt Idea: *"Help me improve the `FeatureCard.tsx` component to have a glassmorphism effect and better hover animations based on `main.css`."*

**4. Khushbu (Feature Content & Supporting Modules)**
- Focus: Managing the datasets, documentation, and ensuring the application has rich, realistic data.
- AI Prompt Idea: *"Help me expand `mockData.ts` and `seedData.ts` with 20 realistic government schemes and scholarships for college students."*
