// ─── Mock Data ───────────────────────────────────────────
// Use this data for frontend development before backend APIs are ready.
// Replace with API calls once backend endpoints are implemented.

import {
  DashboardStats,
  Scholarship,
  GovernmentScheme,
  InterviewQuestion,
  AttendanceRecord,
  StudyPlan,
  AIChatMessage,
} from "../types";

// ─── Dashboard Stats ─────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
  attendance: "82%",
  cgpa: "8.4",
  scholarships: 12,
  applications: 3,
};

// ─── Attendance Records ──────────────────────────────────
export const mockAttendance: AttendanceRecord[] = [
  { subject: "Data Structures", attendedClasses: 38, totalClasses: 42, percentage: 90.5 },
  { subject: "Operating Systems", attendedClasses: 30, totalClasses: 40, percentage: 75.0 },
  { subject: "Database Management", attendedClasses: 35, totalClasses: 38, percentage: 92.1 },
  { subject: "Computer Networks", attendedClasses: 28, totalClasses: 40, percentage: 70.0 },
  { subject: "Software Engineering", attendedClasses: 32, totalClasses: 36, percentage: 88.9 },
];

// ─── Study Plans ─────────────────────────────────────────
export const mockStudyPlans: StudyPlan[] = [
  { title: "DSA Revision Sprint", description: "Complete arrays, linked lists, trees, and graphs revision before end-sem." },
  { title: "DBMS Practical Prep", description: "Practice SQL queries, normalization, and ER diagrams." },
  { title: "OS Concepts Deep Dive", description: "Review process scheduling, memory management, and deadlocks." },
  { title: "Mini Project Documentation", description: "Prepare SRS document, UML diagrams, and final report." },
];

// ─── Scholarships ────────────────────────────────────────
export const mockScholarships: Scholarship[] = [
  { id: 1, title: "National Merit Scholarship", amount: "₹50,000/year", eligibility: "Students with 90%+ in Class 12", deadline: "2026-12-31", category: "Merit-based" },
  { id: 2, title: "Post-Matric Scholarship for SC/ST Students", amount: "Full tuition + ₹10,000/month", eligibility: "SC/ST students with family income below ₹2.5 LPA", deadline: "2026-10-15", category: "Government" },
  { id: 3, title: "INSPIRE Scholarship", amount: "₹80,000/year", eligibility: "Top 1% in Class 12 Board Exams", deadline: "2026-11-30", category: "Research" },
  { id: 4, title: "Pragati Scholarship for Girls", amount: "₹50,000/year", eligibility: "Girl students in technical education, family income < ₹8 LPA", deadline: "2026-09-30", category: "Women" },
  { id: 5, title: "Central Sector Scheme of Scholarships", amount: "₹20,000/year", eligibility: "Top 82nd percentile in Class 12 Board Exams", deadline: "2026-10-31", category: "Merit-based" },
];

// ─── Government Schemes ──────────────────────────────────
export const mockGovernmentSchemes: GovernmentScheme[] = [
  { id: 1, title: "PM Vidyalaxmi Scheme", description: "Collateral-free, guarantor-free education loans for students admitted to QHEIs.", eligibility: "Students admitted to quality higher education institutions" },
  { id: 2, title: "Skill India Digital Hub", description: "Free online courses and certifications to enhance employability skills.", eligibility: "All Indian citizens above 15 years" },
  { id: 3, title: "PMKVY (Pradhan Mantri Kaushal Vikas Yojana)", description: "Skill development training and certification with placement assistance.", eligibility: "Indian nationals, class 10 pass or above" },
  { id: 4, title: "Digital India Internship Scheme", description: "Internship opportunities in government departments working on digital initiatives.", eligibility: "B.Tech/MCA/M.Tech students in CS/IT/Electronics" },
];

// ─── Interview Questions ─────────────────────────────────
export const mockInterviewQuestions: InterviewQuestion[] = [
  { id: 1, category: "Technical", question: "What is the difference between var, let, and const in JavaScript?", difficulty: "Easy" },
  { id: 2, category: "Technical", question: "Explain the concept of closures in JavaScript.", difficulty: "Medium" },
  { id: 3, category: "Behavioral", question: "Tell me about a time you worked on a team project.", difficulty: "Easy" },
  { id: 4, category: "Technical", question: "What is the difference between SQL and NoSQL databases?", difficulty: "Medium" },
  { id: 5, category: "HR", question: "Where do you see yourself in 5 years?", difficulty: "Easy" },
  { id: 6, category: "Technical", question: "Explain RESTful API design principles.", difficulty: "Medium" },
  { id: 7, category: "Technical", question: "What is the virtual DOM in React?", difficulty: "Easy" },
  { id: 8, category: "Technical", question: "Explain the event loop in Node.js.", difficulty: "Hard" },
  { id: 9, category: "Behavioral", question: "How do you handle tight deadlines?", difficulty: "Easy" },
  { id: 10, category: "Technical", question: "What are design patterns? Name a few.", difficulty: "Medium" },
];

// ─── AI Mock Responses ───────────────────────────────────
export const mockAIResponses: AIChatMessage[] = [
  {
    prompt: "What is polymorphism in OOP?",
    response: "Polymorphism is one of the four pillars of OOP. It allows objects to take many forms. There are two types:\n\n1. **Compile-time (Static)**: Method overloading — same method name with different parameters.\n2. **Runtime (Dynamic)**: Method overriding — a subclass provides a specific implementation of a method defined in its parent class.\n\nExample: A `Shape` class with a `draw()` method can be overridden by `Circle`, `Rectangle`, etc.",
    timestamp: new Date().toISOString(),
  },
  {
    prompt: "Explain normalization in DBMS",
    response: "Normalization is the process of organizing a database to reduce redundancy and dependency.\n\n- **1NF**: Eliminate repeating groups; each cell holds a single value.\n- **2NF**: 1NF + remove partial dependencies.\n- **3NF**: 2NF + remove transitive dependencies.\n- **BCNF**: Every determinant is a candidate key.\n\nBenefits: Reduces data anomalies, saves storage, improves data integrity.",
    timestamp: new Date().toISOString(),
  },
];

// ─── Exam Countdown Data ─────────────────────────────────
export const mockExams = [
  { subject: "Data Structures", date: "2026-07-15", type: "End Semester" },
  { subject: "Operating Systems", date: "2026-07-18", type: "End Semester" },
  { subject: "DBMS", date: "2026-07-20", type: "End Semester" },
  { subject: "Computer Networks", date: "2026-07-22", type: "End Semester" },
  { subject: "Software Engineering", date: "2026-07-25", type: "End Semester" },
];

// ─── Education Loan Data ─────────────────────────────────
export const mockEducationLoans = [
  { bank: "State Bank of India", interestRate: "8.50%", maxAmount: "₹20 Lakhs", repayment: "15 years" },
  { bank: "Bank of Baroda", interestRate: "8.85%", maxAmount: "₹20 Lakhs", repayment: "15 years" },
  { bank: "Punjab National Bank", interestRate: "9.00%", maxAmount: "₹15 Lakhs", repayment: "15 years" },
  { bank: "HDFC Bank", interestRate: "9.50%", maxAmount: "₹20 Lakhs", repayment: "12 years" },
];

// ─── Skill Development Courses ───────────────────────────
export const mockSkillCourses = [
  { title: "Full-Stack Web Development", provider: "NPTEL", duration: "12 weeks", free: true },
  { title: "Data Science with Python", provider: "Coursera", duration: "8 weeks", free: false },
  { title: "Cloud Computing Fundamentals", provider: "Skill India", duration: "6 weeks", free: true },
  { title: "Cybersecurity Essentials", provider: "NASSCOM", duration: "10 weeks", free: true },
];
