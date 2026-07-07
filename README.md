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

## ✨ Comprehensive Feature List

### 1. 🔐 Core Authentication & User Management
* **JWT-Based Authentication**: Secure login and signup flow using encrypted tokens.
* **Smart Onboarding Flow**: Automatic detection of incomplete profiles with a forced redirection to an onboarding form.
* **Dynamic Profile Avatars**: Auto-generation of profile avatars based on the user's initials (using UI Avatars API) if a custom picture isn't provided.
* **Protected & Public Routing**: Strict route guards ensuring authenticated users can't access login pages, and unauthenticated users can't access the dashboard.

### 2. 📊 Academic Hub & Dashboard
* **AI Marksheet Scanner**: Allows users to upload a marksheet image (JPG/PNG/PDF), triggering a 5-step AI vision process (Cloudinary + Gemini) that extracts SGPAs and CGPAs automatically.
* **Interactive Semester Trend Graph**: A custom-built SVG line chart that plots semester-over-semester GPA trends dynamically without relying on heavy chart libraries.
* **Academic Metric Cards**: Glassmorphism cards displaying Current CGPA vs Target CGPA, Progress bar tracking Credits Earned out of Total Credits, and Predicted Degree CGPA.
* **Performance Analytics Panel**: Calculates your "Highest CGPA," "Average CGPA," and percentage-based "Improvement Rate."
* **Timetable/Schedule Manager**: A modal-driven feature allowing students to map out their weekly classes (Course Name, Day, Time, and Location) and view them in a clean table.

### 3. 🔍 Navigation & UI Elements
* **Smart Global Search**: The top navbar search bar scans keywords (e.g., typing "cv" or "portfolio" redirects to the resume builder, "mock" redirects to interview prep) instead of just filtering text.
* **Responsive 3x3 Features Grid**: A dedicated `/features` page and a smooth, animated landing page layout for feature discovery.
* **Interactive FAQ Accordion**: A togglable FAQ section on the landing page for quick information access.

### 4. 📄 ATS-Friendly AI Resume Builder
* **Strict ATS Compliance**: Enforces a single-column layout with standard fonts (no graphics or tables) ensuring high parse rates in ATS software.
* **Conditional "Fresher" Logic**: Automatically hides or formats the work experience section if the user classifies as a fresher.
* **Searchable PDF Export**: Generates and downloads resumes with selectable text metadata for accurate parsing by recruiters.

### 5. 🤖 AI Study Assistant 
* **Conversational AI Tutor**: Interface to chat and solve doubts instantly.
* **Personalized Generation**: Ability to generate study guides, revision notes, and syllabus-based flashcards.

### 6. 💼 Opportunities & Placement Tracker
* **Scholarship Matcher**: Filters national and international scholarships based on the student's academic profile.
* **Application Status Tracking**: A Kanban or list-style dashboard to track stages of internships/job applications.

### 7. 🎯 Skill Development & Interview Prep
* **Explore Courses Portal**: Browse expert-curated learning roadmaps.
* **Integrated Course Player**: A dedicated page (`/dashboard/skill-dev/course/:playlistId`) for streaming tutorials.
* **Interview Question Bank**: Access to practice questions and mock interview preparations.

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

---

## 🔄 Recent Updates & Changes

The following features and improvements have been recently added to the platform:

1. **AI-Powered Marksheet Processing Implementation**: 
   - Integrated Google Gemini AI for automatic marksheet scanning and SGPA extraction.
   - Added robust backend services (`aiScannerService.ts`, `aiService.ts`) and AI routes.
2. **Enhanced Technical Interview Prep**: 
   - Created a dedicated AI Mock Interview module (`AIMockInterview.tsx`).
   - Improved the Interview Prep Hub routing and UI components.
3. **Dashboard & UI Refinements**: 
   - Refined Dashboard UI Navigation for better user experience.
   - Reorganized content: Moved the "Top Internship Alerts" widget directly to the Dashboard.
   - Updated detailed analytics views (`DetailedAnalytics.tsx`).
4. **Profile & Academic Data Enhancements**: 
   - Updated the `User` model and `profileService.ts` for expanded user data tracking.
   - Enhanced `profileController` and `academicsController` to serve the new profile and academic metrics.
