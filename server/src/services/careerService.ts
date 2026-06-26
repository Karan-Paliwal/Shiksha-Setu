// ─── Career Service ──────────────────────────────────────
// TODO: Implement resume builder, roadmap, and tracking logic

export const getCareerStatus = () => {
  return {
    module: "career",
    status: "ok",
    message: "Career Builder API is working.",
    features: [
      "Resume Builder",
      "Skill Roadmap",
      "Interview Preparation",
      "Internship Tracker",
    ],
  };
};

// TODO: Generate from database
export const getInterviewQuestions = () => {
  return [
    {
      id: 1,
      category: "Technical",
      question: "What is the difference between var, let, and const in JavaScript?",
      difficulty: "Easy",
    },
    {
      id: 2,
      category: "Technical",
      question: "Explain the concept of closures in JavaScript.",
      difficulty: "Medium",
    },
    {
      id: 3,
      category: "Behavioral",
      question: "Tell me about a time you worked on a team project.",
      difficulty: "Easy",
    },
    {
      id: 4,
      category: "Technical",
      question: "What is the difference between SQL and NoSQL databases?",
      difficulty: "Medium",
    },
    {
      id: 5,
      category: "HR",
      question: "Where do you see yourself in 5 years?",
      difficulty: "Easy",
    },
    {
      id: 6,
      category: "Technical",
      question: "Explain RESTful API design principles.",
      difficulty: "Medium",
    },
  ];
};

export const getSkillRoadmap = (track: string = "fullstack") => {
  const roadmaps: Record<string, string[]> = {
    fullstack: [
      "HTML & CSS Fundamentals",
      "JavaScript ES6+",
      "React.js",
      "Node.js & Express",
      "MongoDB & Mongoose",
      "REST API Design",
      "Authentication & Security",
      "Deployment & DevOps",
    ],
    frontend: [
      "HTML5 & CSS3",
      "JavaScript & TypeScript",
      "React.js / Next.js",
      "State Management",
      "CSS Frameworks (Bootstrap/Tailwind)",
      "Testing (Jest, RTL)",
      "Performance Optimization",
    ],
    backend: [
      "Node.js Fundamentals",
      "Express.js",
      "Database Design (SQL & NoSQL)",
      "Authentication & Authorization",
      "API Design & Documentation",
      "Caching & Message Queues",
      "Containerization (Docker)",
    ],
  };

  return {
    track,
    steps: roadmaps[track] || roadmaps.fullstack,
  };
};
