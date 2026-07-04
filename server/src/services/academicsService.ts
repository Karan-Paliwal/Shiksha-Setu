import AcademicTask from "../models/AcademicTask";
import Schedule from "../models/Schedule";
import StudyPlan from "../models/StudyPlan";
import User from "../models/User";

export const getAcademicsStatus = () => {
  return {
    module: "academics",
    status: "ok",
    message: "Academic Planner API is working.",
    features: [
      "CGPA Predictor",
      "Exam Countdown",
      "Study Planner",
      "Academic Tasks",
      "Resource Library",
    ],
  };
};

export const calculateCGPA = (grades: number[]) => {
  const cleanGrades = grades
    .map(Number)
    .filter((grade) => Number.isFinite(grade) && grade >= 0 && grade <= 10);

  if (cleanGrades.length === 0) return { cgpa: 0 };

  const sum = cleanGrades.reduce((a, b) => a + b, 0);
  return { cgpa: Math.round((sum / cleanGrades.length) * 100) / 100 };
};

const defaultResources = [
  {
    id: "cse-nptel-os",
    program: "Computer Science",
    title: "Operating Systems",
    subject: "Operating Systems",
    university: "NPTEL",
    type: "Course",
    size: "Video + Notes",
    url: "https://onlinecourses.nptel.ac.in/explorer?searchText=operating%20systems",
  },
  {
    id: "cse-nptel-dsa",
    program: "Computer Science",
    title: "Data Structures and Algorithms",
    subject: "Data Structures",
    university: "NPTEL",
    type: "Course",
    size: "Video + Assignments",
    url: "https://onlinecourses.nptel.ac.in/explorer?searchText=data%20structures%20algorithms",
  },
  {
    id: "cse-mit-db",
    program: "Computer Science",
    title: "Database Systems",
    subject: "DBMS",
    university: "MIT OpenCourseWare",
    type: "Course",
    size: "Lectures + Readings",
    url: "https://ocw.mit.edu/search/?q=database%20systems",
  },
  {
    id: "ece-nptel-signals",
    program: "Electronics and Communication",
    title: "Signals and Systems",
    subject: "Signals",
    university: "NPTEL",
    type: "Course",
    size: "Video + Notes",
    url: "https://onlinecourses.nptel.ac.in/explorer?searchText=signals%20and%20systems",
  },
  {
    id: "ece-nptel-analog",
    program: "Electronics and Communication",
    title: "Analog Electronics",
    subject: "Analog Circuits",
    university: "NPTEL",
    type: "Course",
    size: "Video + Assignments",
    url: "https://onlinecourses.nptel.ac.in/explorer?searchText=analog%20electronics",
  },
  {
    id: "ee-nptel-power",
    program: "Electrical Engineering",
    title: "Power Systems",
    subject: "Power Engineering",
    university: "NPTEL",
    type: "Course",
    size: "Video + Notes",
    url: "https://onlinecourses.nptel.ac.in/explorer?searchText=power%20systems",
  },
  {
    id: "mech-nptel-thermo",
    program: "Mechanical Engineering",
    title: "Thermodynamics",
    subject: "Thermodynamics",
    university: "NPTEL",
    type: "Course",
    size: "Video + Assignments",
    url: "https://onlinecourses.nptel.ac.in/explorer?searchText=thermodynamics",
  },
  {
    id: "mech-mit-fluid",
    program: "Mechanical Engineering",
    title: "Fluid Mechanics",
    subject: "Fluid Mechanics",
    university: "MIT OpenCourseWare",
    type: "Course",
    size: "Lectures + Readings",
    url: "https://ocw.mit.edu/search/?q=fluid%20mechanics",
  },
  {
    id: "civil-nptel-structures",
    program: "Civil Engineering",
    title: "Structural Analysis",
    subject: "Structures",
    university: "NPTEL",
    type: "Course",
    size: "Video + Notes",
    url: "https://onlinecourses.nptel.ac.in/explorer?searchText=structural%20analysis",
  },
  {
    id: "civil-nptel-transport",
    program: "Civil Engineering",
    title: "Transportation Engineering",
    subject: "Transportation",
    university: "NPTEL",
    type: "Course",
    size: "Video + Assignments",
    url: "https://onlinecourses.nptel.ac.in/explorer?searchText=transportation%20engineering",
  },
  {
    id: "bca-swayam-programming",
    program: "BCA",
    title: "Programming and Problem Solving",
    subject: "Programming",
    university: "SWAYAM",
    type: "Course",
    size: "MOOC",
    url: "https://swayam.gov.in/explorer?searchText=programming",
  },
  {
    id: "mca-nptel-cloud",
    program: "MCA",
    title: "Cloud Computing",
    subject: "Cloud Computing",
    university: "NPTEL",
    type: "Course",
    size: "Video + Certificate",
    url: "https://onlinecourses.nptel.ac.in/explorer?searchText=cloud%20computing",
  },
  {
    id: "bba-swayam-management",
    program: "BBA",
    title: "Principles of Management",
    subject: "Management",
    university: "SWAYAM",
    type: "Course",
    size: "MOOC",
    url: "https://swayam.gov.in/explorer?searchText=principles%20of%20management",
  },
  {
    id: "bcom-swayam-accounting",
    program: "BCom",
    title: "Financial Accounting",
    subject: "Accounting",
    university: "SWAYAM",
    type: "Course",
    size: "MOOC",
    url: "https://swayam.gov.in/explorer?searchText=financial%20accounting",
  },
  {
    id: "ba-swayam-economics",
    program: "BA",
    title: "Microeconomics",
    subject: "Economics",
    university: "SWAYAM",
    type: "Course",
    size: "MOOC",
    url: "https://swayam.gov.in/explorer?searchText=microeconomics",
  },
  {
    id: "bsc-swayam-maths",
    program: "BSc",
    title: "Calculus and Linear Algebra",
    subject: "Mathematics",
    university: "SWAYAM",
    type: "Course",
    size: "MOOC",
    url: "https://swayam.gov.in/explorer?searchText=calculus%20linear%20algebra",
  },
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const programAliases: Record<string, string[]> = {
  "Computer Science": ["computer", "cse", "cs", "data structure", "operating system", "dbms", "software", "algorithm"],
  "Electronics and Communication": ["ece", "electronics", "communication", "signal", "analog", "digital circuit"],
  "Electrical Engineering": ["electrical", "power system", "machine", "circuit"],
  "Mechanical Engineering": ["mechanical", "thermodynamics", "fluid", "machine design", "manufacturing"],
  "Civil Engineering": ["civil", "structural", "transportation", "surveying", "concrete"],
  BCA: ["bca", "programming", "web", "computer application"],
  MCA: ["mca", "cloud", "advanced programming", "computer application"],
  BBA: ["bba", "management", "marketing", "business"],
  BCom: ["bcom", "commerce", "accounting", "finance", "tax"],
  BA: ["ba", "economics", "political", "history", "english"],
  BSc: ["bsc", "physics", "chemistry", "math", "biology", "calculus"],
};

const inferProgramsFromCourses = (courseNames: string[]) => {
  const normalizedCourses = courseNames.map(normalize);
  return Object.entries(programAliases)
    .filter(([, aliases]) =>
      aliases.some((alias) => normalizedCourses.some((courseName) => courseName.includes(alias)))
    )
    .map(([program]) => program);
};

export const getDashboard = async (userId: string) => {
  const [user, tasks, studyPlans, schedule] = await Promise.all([
    User.findById(userId).select("academicProfile documents name email"),
    AcademicTask.find({ userId }).sort({ completed: 1, dueDate: 1, createdAt: -1 }).limit(10),
    StudyPlan.find({ userId }).sort({ createdAt: -1 }).limit(5),
    Schedule.findOne({ userId }).select("classes"),
  ]);

  const classNames = schedule?.classes.map((classItem) => classItem.courseName).filter(Boolean) || [];
  const recommendedPrograms = inferProgramsFromCourses(classNames);

  return {
    academicProfile: user?.academicProfile,
    documents: user?.documents,
    resources: defaultResources,
    courseOptions: Array.from(new Set(defaultResources.map((resource) => resource.program))).sort(),
    recommendedPrograms,
    userCourses: classNames,
    tasks,
    studyPlans,
  };
};

export const createTask = async (
  userId: string,
  payload: { title?: string; course?: string; dueDate?: string; priority?: "low" | "medium" | "high" }
) => {
  if (!payload.title?.trim()) {
    throw new Error("Task title is required");
  }

  return AcademicTask.create({
    userId,
    title: payload.title.trim(),
    course: payload.course?.trim() || "General",
    dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    priority: payload.priority || "medium",
  });
};

export const updateTask = async (
  userId: string,
  taskId: string,
  payload: Partial<{ title: string; course: string; dueDate: string; completed: boolean; priority: "low" | "medium" | "high" }>
) => {
  const updates: Record<string, unknown> = {};
  if (payload.title !== undefined) updates.title = payload.title.trim();
  if (payload.course !== undefined) updates.course = payload.course.trim() || "General";
  if (payload.dueDate !== undefined) updates.dueDate = payload.dueDate ? new Date(payload.dueDate) : undefined;
  if (payload.completed !== undefined) updates.completed = payload.completed;
  if (payload.priority !== undefined) updates.priority = payload.priority;

  return AcademicTask.findOneAndUpdate({ _id: taskId, userId }, updates, { new: true });
};

export const deleteTask = async (userId: string, taskId: string) => {
  return AcademicTask.findOneAndDelete({ _id: taskId, userId });
};

export const createStudyPlan = async (userId: string, payload: { title?: string; description?: string }) => {
  if (!payload.title?.trim()) {
    throw new Error("Study plan title is required");
  }

  return StudyPlan.create({
    userId,
    title: payload.title.trim(),
    description: payload.description?.trim() || "",
  });
};
