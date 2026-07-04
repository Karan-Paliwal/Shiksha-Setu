import InterviewPrep from "../models/InterviewPrep";
import User from "../models/User";

const codingProblems = [
  {
    id: "two-sum",
    type: "coding",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    prompt: "Return indices of two numbers that add up to the target.",
    starterCode: "function twoSum(nums, target) {\n  return [];\n}",
    expectedKeywords: ["map", "target", "return"],
    hints: ["Track seen values while scanning the array.", "Use target - current value to find the complement."],
  },
  {
    id: "validate-bst",
    type: "coding",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    category: "Trees",
    prompt: "Given the root of a binary tree, determine whether it is a valid binary search tree.",
    starterCode: "function isValidBST(root) {\n  return true;\n}",
    expectedKeywords: ["min", "max", "left", "right", "return"],
    hints: ["Carry valid lower and upper bounds through recursion.", "Each subtree needs stricter bounds than its parent."],
  },
  {
    id: "lru-cache",
    type: "coding",
    title: "Design LRU Cache",
    difficulty: "Hard",
    category: "System Design",
    prompt: "Design a cache that evicts the least recently used key when capacity is exceeded.",
    starterCode: "class LRUCache {\n  constructor(capacity) {}\n}",
    expectedKeywords: ["map", "delete", "set", "capacity"],
    hints: ["Combine O(1) lookup with recency tracking.", "Refreshing a key should make it most recently used."],
  },
  {
    id: "sql-second-highest",
    type: "coding",
    title: "Second Highest Salary",
    difficulty: "Medium",
    category: "SQL",
    prompt: "Write a query to return the second highest distinct salary from an Employee table.",
    starterCode: "SELECT NULL AS SecondHighestSalary;",
    expectedKeywords: ["select", "distinct", "salary", "limit"],
    hints: ["Remove duplicates before ranking.", "Handle the case where no second salary exists."],
  },
  {
    id: "rate-limiter",
    type: "coding",
    title: "Design a Rate Limiter",
    difficulty: "Hard",
    category: "System Design",
    prompt: "Design a service that limits each user to a fixed number of requests per time window.",
    starterCode: "// Describe data model, algorithm, and API behavior.",
    expectedKeywords: ["window", "token", "redis", "limit", "user"],
    hints: ["Compare fixed window, sliding window, and token bucket approaches.", "Call out distributed storage and expiry."],
  },
];

const behavioralQuestions = [
  {
    id: "failure",
    type: "behavioral",
    title: "Tell me about a time you failed.",
    difficulty: "Medium",
    category: "Ownership",
    prompt: "Answer using situation, task, action, result, and learning.",
    tip: "Focus on what you learned and how your process changed.",
    expectedKeywords: ["learned", "improved", "result", "action"],
  },
  {
    id: "conflict",
    type: "behavioral",
    title: "How do you handle conflict in a team?",
    difficulty: "Easy",
    category: "Teamwork",
    prompt: "Describe a real disagreement and how you moved the team forward.",
    tip: "Emphasize empathy, ownership, and resolution-oriented communication.",
    expectedKeywords: ["listen", "team", "resolve", "communication"],
  },
  {
    id: "deadline",
    type: "behavioral",
    title: "Describe a time you worked under a tight deadline.",
    difficulty: "Medium",
    category: "Execution",
    prompt: "Explain prioritization, trade-offs, communication, and outcome.",
    tip: "Show prioritization, communication, and trade-off decisions.",
    expectedKeywords: ["priority", "deadline", "communicated", "delivered"],
  },
];

const resources = [
  { title: "The Ultimate System Design Primer", type: "Article", category: "System Design", url: "https://github.com/donnemartin/system-design-primer" },
  { title: "React Performance Optimization", type: "Article", category: "Frontend", url: "https://react.dev/learn/render-and-commit" },
  { title: "Big O Notation Cheatsheet", type: "Cheatsheet", category: "Algorithms", url: "https://www.bigocheatsheet.com/" },
  { title: "SQL Interview Practice", type: "Practice", category: "SQL", url: "https://sqlbolt.com/" },
];

const allQuestions = [...codingProblems, ...behavioralQuestions];

const getOrCreatePrep = async (userId: string) => {
  let prep = await InterviewPrep.findOne({ userId });

  if (!prep) {
    prep = await InterviewPrep.create({
      userId,
      attempts: [
        {
          mode: "coding",
          problemId: "two-sum",
          title: "Two Sum",
          category: "Arrays",
          score: 76,
          language: "JavaScript",
          difficulty: "Easy",
          feedback: "Solid start. Add clearer edge-case handling and explain complexity.",
          strengths: ["Uses the target value directly", "Readable structure"],
          improvements: ["Mention time complexity", "Handle duplicate values carefully"],
        },
      ],
      mocks: [],
      posts: [],
    });
  }

  return prep;
};

const clampScore = (score: number) => Math.min(100, Math.max(0, Math.round(score)));

const recomputeSkills = (attempts: { mode: string; score: number }[]) => {
  const codingScores = attempts.filter((attempt) => attempt.mode === "coding").map((attempt) => attempt.score);
  const behavioralScores = attempts.filter((attempt) => attempt.mode === "behavioral").map((attempt) => attempt.score);
  const allScores = attempts.map((attempt) => attempt.score);
  const average = (scores: number[], fallback: number) =>
    scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : fallback;

  return {
    technicalAccuracy: clampScore(average(codingScores, average(allScores, 70))),
    communication: clampScore(average(behavioralScores, average(allScores, 65))),
    problemSolving: clampScore(average(allScores, 70) + 4),
  };
};

const scoreAnswer = (answer: string, expectedKeywords: string[], difficulty: string) => {
  const normalized = answer.toLowerCase();
  const words = normalized.split(/\s+/).filter(Boolean);
  const matchedKeywords = expectedKeywords.filter((keyword) => normalized.includes(keyword.toLowerCase()));
  const keywordScore = expectedKeywords.length ? (matchedKeywords.length / expectedKeywords.length) * 45 : 25;
  const lengthScore = Math.min(25, words.length / 4);
  const structureScore = /complexity|edge|trade|test|result|because|therefore|first|then/.test(normalized) ? 15 : 6;
  const difficultyBonus = difficulty === "Hard" ? 4 : difficulty === "Medium" ? 7 : 10;
  const score = clampScore(25 + keywordScore + lengthScore + structureScore + difficultyBonus);

  const strengths = [
    matchedKeywords.length ? `Covers ${matchedKeywords.slice(0, 3).join(", ")}` : "Submitted a concrete response",
    words.length > 60 ? "Gives enough detail for review" : "Keeps the answer concise",
  ];
  const improvements = [
    ...expectedKeywords.filter((keyword) => !matchedKeywords.includes(keyword)).slice(0, 2).map((keyword) => `Include ${keyword}`),
    words.length < 40 ? "Add more explanation and edge cases" : "Tighten the final summary",
  ].slice(0, 3);

  return { score, strengths, improvements };
};

export const getQuestionBank = (query = "", difficulty = "All", category = "All", type = "All") => {
  const normalizedQuery = query.toLowerCase().trim();
  return allQuestions.filter((question) => {
    const matchesQuery = !normalizedQuery ||
      question.title.toLowerCase().includes(normalizedQuery) ||
      question.category.toLowerCase().includes(normalizedQuery) ||
      question.prompt.toLowerCase().includes(normalizedQuery);
    const matchesDifficulty = difficulty === "All" || question.difficulty === difficulty;
    const matchesCategory = category === "All" || question.category === category;
    const matchesType = type === "All" || question.type === type;
    return matchesQuery && matchesDifficulty && matchesCategory && matchesType;
  });
};

export const getDashboard = async (userId: string) => {
  const [prep, user] = await Promise.all([
    getOrCreatePrep(userId),
    User.findById(userId).select("name"),
  ]);

  const categories = Array.from(new Set(allQuestions.map((question) => question.category))).sort();

  return {
    userName: user?.name || "Student",
    problemOfTheDay: codingProblems[1],
    codingProblems,
    behavioralQuestions,
    questionBank: allQuestions,
    categories,
    resources,
    attempts: prep.attempts.slice(-8).reverse(),
    mocks: prep.mocks
      .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
      .slice(0, 8),
    posts: prep.posts.slice(-6).reverse(),
    skills: prep.skills,
  };
};

export const recordAttempt = async (
  userId: string,
  payload: { problemId?: string; mode?: "coding" | "behavioral"; answer?: string; language?: string }
) => {
  const prep = await getOrCreatePrep(userId);
  const question = allQuestions.find((item) => item.id === payload.problemId);

  if (!question) {
    throw new Error("Question not found");
  }

  const answer = payload.answer?.trim() || "";
  if (answer.length < 12) {
    throw new Error("Please write a fuller answer before submitting");
  }

  const result = scoreAnswer(answer, question.expectedKeywords, question.difficulty);
  const mode = question.type === "behavioral" ? "behavioral" : "coding";

  prep.attempts.push({
    mode,
    problemId: question.id,
    title: question.title,
    category: question.category,
    score: result.score,
    language: payload.language || "JavaScript",
    difficulty: question.difficulty,
    feedback: result.score >= 80
      ? "Strong attempt. Keep practicing concise explanation and final complexity."
      : result.score >= 60
        ? "Good foundation. Strengthen the missing concepts and explain trade-offs."
        : "Needs another pass. Use the hints, cover core concepts, and resubmit.",
    strengths: result.strengths,
    improvements: result.improvements,
    answerSnippet: answer.slice(0, 180),
    createdAt: new Date(),
  });
  prep.skills = recomputeSkills(prep.attempts);
  await prep.save();

  return {
    attempt: prep.attempts[prep.attempts.length - 1],
    skills: prep.skills,
  };
};

export const scheduleMock = async (
  userId: string,
  payload: { mentorName?: string; company?: string; scheduledAt?: string }
) => {
  if (!payload.scheduledAt) {
    throw new Error("Scheduled date is required");
  }

  const scheduledAt = new Date(payload.scheduledAt);
  if (Number.isNaN(scheduledAt.getTime())) {
    throw new Error("Scheduled date is invalid");
  }

  const prep = await getOrCreatePrep(userId);
  prep.mocks.push({
    mentorName: payload.mentorName?.trim() || "Assigned Mentor",
    company: payload.company?.trim() || "Mentor Network",
    scheduledAt,
    status: "scheduled",
  });
  await prep.save();
  return prep.mocks[prep.mocks.length - 1];
};

export const updateMockStatus = async (
  userId: string,
  mockId: string,
  status: "scheduled" | "completed" | "cancelled"
) => {
  const prep = await getOrCreatePrep(userId);
  const mock = (prep.mocks as any).id(mockId);
  if (!mock) {
    throw new Error("Mock interview not found");
  }

  mock.status = status;
  await prep.save();
  return mock;
};

export const createPost = async (userId: string, payload: { text?: string }) => {
  if (!payload.text?.trim()) {
    throw new Error("Post text is required");
  }

  const [prep, user] = await Promise.all([
    getOrCreatePrep(userId),
    User.findById(userId).select("name"),
  ]);

  prep.posts.push({
    authorName: user?.name || "Student",
    text: payload.text.trim(),
    helpfulCount: 0,
    createdAt: new Date(),
  });
  await prep.save();
  return prep.posts[prep.posts.length - 1];
};

export const markPostHelpful = async (userId: string, postId: string) => {
  const prep = await getOrCreatePrep(userId);
  const post = (prep.posts as any).id(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  post.helpfulCount += 1;
  await prep.save();
  return post;
};
