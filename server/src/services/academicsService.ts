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
    id: "cse-swayam-os",
    program: "Computer Science",
    title: "Operating Systems",
    subject: "Operating Systems",
    university: "SWAYAM",
    type: "Syllabus",
    size: "Course outline + resources",
    url: "https://swayam.gov.in/explorer?searchText=operating%20systems",
  },
  {
    id: "cse-swayam-dsa",
    program: "Computer Science",
    title: "Data Structures and Algorithms",
    subject: "Data Structures",
    university: "SWAYAM",
    type: "Syllabus",
    size: "Course outline + resources",
    url: "https://swayam.gov.in/explorer?searchText=data%20structures%20algorithms",
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
    id: "ece-swayam-signals",
    program: "Electronics and Communication",
    title: "Signals and Systems",
    subject: "Signals",
    university: "SWAYAM",
    type: "Syllabus",
    size: "Course outline + resources",
    url: "https://swayam.gov.in/explorer?searchText=signals%20and%20systems",
  },
  {
    id: "ece-swayam-analog",
    program: "Electronics and Communication",
    title: "Analog Electronics",
    subject: "Analog Circuits",
    university: "SWAYAM",
    type: "Syllabus",
    size: "Course outline + resources",
    url: "https://swayam.gov.in/explorer?searchText=analog%20electronics",
  },
  {
    id: "ee-swayam-power",
    program: "Electrical Engineering",
    title: "Power Systems",
    subject: "Power Engineering",
    university: "SWAYAM",
    type: "Syllabus",
    size: "Course outline + resources",
    url: "https://swayam.gov.in/explorer?searchText=power%20systems",
  },
  {
    id: "mech-swayam-thermo",
    program: "Mechanical Engineering",
    title: "Thermodynamics",
    subject: "Thermodynamics",
    university: "SWAYAM",
    type: "Syllabus",
    size: "Course outline + resources",
    url: "https://swayam.gov.in/explorer?searchText=thermodynamics",
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
    id: "civil-swayam-structures",
    program: "Civil Engineering",
    title: "Structural Analysis",
    subject: "Structures",
    university: "SWAYAM",
    type: "Syllabus",
    size: "Course outline + resources",
    url: "https://swayam.gov.in/explorer?searchText=structural%20analysis",
  },
  {
    id: "civil-swayam-transport",
    program: "Civil Engineering",
    title: "Transportation Engineering",
    subject: "Transportation",
    university: "SWAYAM",
    type: "Syllabus",
    size: "Course outline + resources",
    url: "https://swayam.gov.in/explorer?searchText=transportation%20engineering",
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
    id: "mca-swayam-cloud",
    program: "MCA",
    title: "Cloud Computing",
    subject: "Cloud Computing",
    university: "SWAYAM",
    type: "Syllabus",
    size: "MOOC",
    url: "https://swayam.gov.in/explorer?searchText=cloud%20computing",
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

const pyqResources = [
  {
    id: "cse-os-pyq",
    program: "Computer Science",
    subject: "Operating Systems",
    title: "Operating Systems PYQs",
    university: "Subject Question Bank",
    type: "PYQ",
    size: "Previous papers + important questions",
    url: "https://drive.google.com/file/d/1XKLU6ZOPrkcdNl_TrwSq_aQuU0Y5tx_g/view?usp=drivesdk",
    links: [
      { label: "Open PYQs", url: "https://drive.google.com/file/d/1XKLU6ZOPrkcdNl_TrwSq_aQuU0Y5tx_g/view?usp=drivesdk" }
    ],
    questions: [
      {
        question: "Explain process synchronization and the critical section problem.",
        answer: "Define race condition, critical section, entry/exit sections, and describe mutual exclusion, progress, and bounded waiting."
      },
      {
        question: "Compare paging and segmentation.",
        answer: "Paging divides memory into fixed-size pages, while segmentation divides programs into logical variable-size segments such as code, stack, and data."
      }
    ],
  },
  {
    id: "cse-dsa-pyq",
    program: "Computer Science",
    subject: "Data Structures",
    title: "Data Structures PYQs",
    university: "Subject Question Bank",
    type: "PYQ",
    size: "Trees, graphs, sorting, hashing",
    url: "https://drive.google.com/file/d/1VkShgKsNb0u1ozwAaoEU-7W4W7qaYZO4/view?usp=drivesdk",
    links: [
      { label: "Open PYQs", url: "https://drive.google.com/file/d/1VkShgKsNb0u1ozwAaoEU-7W4W7qaYZO4/view?usp=drivesdk" }
    ],
    questions: [
      {
        question: "Write an algorithm for binary search and analyze its complexity.",
        answer: "Binary search repeatedly halves a sorted search space. Its time complexity is O(log n), with O(1) iterative space."
      },
      {
        question: "Differentiate between BFS and DFS.",
        answer: "BFS explores level by level using a queue. DFS explores deeply before backtracking, commonly using recursion or a stack."
      }
    ],
  },
  {
    id: "cse-dbms-pyq",
    program: "Computer Science",
    subject: "DBMS",
    title: "DBMS PYQs",
    university: "Subject Question Bank",
    type: "PYQ",
    size: "ER model, SQL, normalization",
    url: "https://drive.google.com/file/d/1BYPFfewbM-G4LopYudzzguGAQcLkxGNu/view?usp=drivesdk",
    links: [
      { label: "Open PYQs", url: "https://drive.google.com/file/d/1BYPFfewbM-G4LopYudzzguGAQcLkxGNu/view?usp=drivesdk" }
    ],
    questions: [
      {
        question: "Explain normalization and the need for 3NF.",
        answer: "Normalization reduces redundancy and update anomalies. 3NF removes transitive dependency for non-prime attributes."
      },
      {
        question: "What is a transaction? Explain ACID properties.",
        answer: "A transaction is a logical unit of work. ACID means atomicity, consistency, isolation, and durability."
      }
    ],
  },
  {
    id: "ece-signals-pyq",
    program: "Electronics and Communication",
    subject: "Signals and Systems",
    title: "Signals and Systems PYQs",
    university: "Subject Question Bank",
    type: "PYQ",
    size: "Transforms, convolution, LTI systems",
    url: "https://drive.google.com/file/d/1T9fTfstvJdsyjEDsvPvXBpZJoyi2u-V7/view?usp=drivesdk",
    links: [
      { label: "Open PYQs", url: "https://drive.google.com/file/d/1T9fTfstvJdsyjEDsvPvXBpZJoyi2u-V7/view?usp=drivesdk" }
    ],
    questions: [
      {
        question: "State and prove the convolution property of Fourier Transform.",
        answer: "Show that convolution in time maps to multiplication in frequency, using the Fourier integral definition and variable substitution."
      },
      {
        question: "Check whether a given system is linear and time invariant.",
        answer: "Test additivity and homogeneity for linearity, then shift the input and verify the output shifts identically for time invariance."
      }
    ],
  },
  {
    id: "ee-power-pyq",
    program: "Electrical Engineering",
    subject: "Power Systems",
    title: "Power Systems PYQs",
    university: "Subject Question Bank",
    type: "PYQ",
    size: "Load flow, faults, protection",
    url: "https://www.google.com/search?q=power+systems+previous+year+question+paper+BTech+pdf",
    links: [
      { label: "Open PYQs", url: "https://www.google.com/search?q=power+systems+previous+year+question+paper+BTech+pdf" }
    ],
    questions: [
      {
        question: "Explain per unit system and its advantages.",
        answer: "Per unit normalizes electrical quantities against base values, simplifying transformer and network calculations."
      },
      {
        question: "Compare symmetrical and unsymmetrical faults.",
        answer: "Symmetrical faults affect all phases equally. Unsymmetrical faults affect one or two phases and require sequence component analysis."
      }
    ],
  },
  {
    id: "mech-thermo-pyq",
    program: "Mechanical Engineering",
    subject: "Thermodynamics",
    title: "Thermodynamics PYQs",
    university: "Subject Question Bank",
    type: "PYQ",
    size: "Laws, cycles, entropy",
    url: "https://drive.google.com/file/d/1jXzGqRPWDMFlJi5sTriEWuzs28MM_Nre/view?usp=drivesdk",
    links: [
      { label: "Open PYQs", url: "https://drive.google.com/file/d/1jXzGqRPWDMFlJi5sTriEWuzs28MM_Nre/view?usp=drivesdk" }
    ],
    questions: [
      {
        question: "State the first law of thermodynamics for a closed system.",
        answer: "The change in internal energy equals heat added to the system minus work done by the system."
      },
      {
        question: "Derive efficiency of the Carnot cycle.",
        answer: "Carnot efficiency depends only on reservoir temperatures and is given by 1 - Tc/Th, with temperatures in Kelvin."
      }
    ],
  },
  {
    id: "civil-structures-pyq",
    program: "Civil Engineering",
    subject: "Structural Analysis",
    title: "Structural Analysis PYQs",
    university: "Subject Question Bank",
    type: "PYQ",
    size: "Beams, trusses, influence lines",
    url: "https://drive.google.com/file/d/1A-69VGWsc3fmxeSCiRj1AFpOsDyj_XZ4/view?usp=drivesdk",
    links: [
      { label: "Open PYQs", url: "https://drive.google.com/file/d/1A-69VGWsc3fmxeSCiRj1AFpOsDyj_XZ4/view?usp=drivesdk" }
    ],
    questions: [
      {
        question: "Draw shear force and bending moment diagrams for a simply supported beam.",
        answer: "Calculate reactions first, then evaluate shear and moment across each span using equilibrium equations."
      },
      {
        question: "Differentiate determinate and indeterminate structures.",
        answer: "Determinate structures are solved using equilibrium alone. Indeterminate structures require compatibility and material relations."
      }
    ],
  },
  {
    id: "bsc-math-pyq",
    program: "BSc",
    subject: "Mathematics",
    title: "Mathematics PYQs",
    university: "Subject Question Bank",
    type: "PYQ",
    size: "Calculus, algebra, differential equations",
    url: "https://www.google.com/search?q=calculus+linear+algebra+previous+year+question+paper+BSc+pdf",
    links: [
      { label: "Open PYQs", url: "https://www.google.com/search?q=calculus+linear+algebra+previous+year+question+paper+BSc+pdf" }
    ],
    questions: [
      {
        question: "Find eigenvalues and eigenvectors of a 2x2 matrix.",
        answer: "Solve det(A - lambda I) = 0 for eigenvalues, then solve (A - lambda I)x = 0 for each eigenvector."
      },
      {
        question: "State Rolle's theorem with conditions.",
        answer: "A function continuous on [a,b], differentiable on (a,b), and satisfying f(a)=f(b) has some c where f'(c)=0."
      }
    ],
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

export const getPyqResources = (filters: { program?: string; subject?: string } = {}) => {
  const programFilter = filters.program ? normalize(filters.program) : "";
  const subjectFilter = filters.subject ? normalize(filters.subject) : "";

  return pyqResources.filter((resource) => {
    const programMatches = !programFilter || normalize(resource.program).includes(programFilter);
    const subjectMatches = !subjectFilter || normalize(resource.subject).includes(subjectFilter);
    return programMatches && subjectMatches;
  });
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
    pyqResources: getPyqResources(),
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
