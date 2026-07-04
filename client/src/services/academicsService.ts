import api from "./api";

export const getAcademicDashboard = async () => {
  const response = await api.get("/academics/dashboard");
  return response.data;
};

export const createAcademicTask = async (payload: {
  title: string;
  course?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}) => {
  const response = await api.post("/academics/tasks", payload);
  return response.data;
};

export const updateAcademicTask = async (
  id: string,
  payload: Partial<{ title: string; course: string; dueDate: string; completed: boolean; priority: "low" | "medium" | "high" }>
) => {
  const response = await api.patch(`/academics/tasks/${id}`, payload);
  return response.data;
};

export const createStudyPlan = async (payload: { title: string; description?: string }) => {
  const response = await api.post("/academics/study-plans", payload);
  return response.data;
};
