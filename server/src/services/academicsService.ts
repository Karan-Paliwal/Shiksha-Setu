// ─── Academics Service ───────────────────────────────────
// TODO: Implement actual business logic for academic features

export const getAcademicsStatus = () => {
  return {
    module: "academics",
    status: "ok",
    message: "Academic Planner API is working.",
    features: [
      "CGPA Predictor",
      "Exam Countdown",
      "Study Planner",
    ],
  };
};

export const calculateCGPA = (grades: number[]) => {
  if (grades.length === 0) return { cgpa: 0 };
  const sum = grades.reduce((a, b) => a + b, 0);
  return { cgpa: Math.round((sum / grades.length) * 100) / 100 };
};
