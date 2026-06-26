// ─── Academics Service ───────────────────────────────────
// TODO: Implement actual business logic for academic features

export const getAcademicsStatus = () => {
  return {
    module: "academics",
    status: "ok",
    message: "Academic Planner API is working.",
    features: [
      "Attendance Predictor",
      "CGPA Predictor",
      "Exam Countdown",
      "Study Planner",
    ],
  };
};

// TODO: Implement attendance prediction logic
export const predictAttendance = (attended: number, total: number) => {
  const percentage = total > 0 ? (attended / total) * 100 : 0;
  return {
    attended,
    total,
    percentage: Math.round(percentage * 100) / 100,
    status: percentage >= 75 ? "Safe" : "At Risk",
  };
};

// TODO: Implement CGPA calculation
export const calculateCGPA = (grades: number[]) => {
  if (grades.length === 0) return { cgpa: 0 };
  const sum = grades.reduce((a, b) => a + b, 0);
  return { cgpa: Math.round((sum / grades.length) * 100) / 100 };
};
