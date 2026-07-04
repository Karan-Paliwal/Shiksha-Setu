import api from "./api";

export const getInterviewDashboard = async () => {
  const response = await api.get("/interview/dashboard");
  return response.data;
};

export const searchInterviewQuestions = async (params: {
  q?: string;
  difficulty?: string;
  category?: string;
  type?: string;
}) => {
  const response = await api.get("/interview/questions", { params });
  return response.data;
};

export const recordInterviewAttempt = async (payload: {
  problemId: string;
  mode?: "coding" | "behavioral";
  answer: string;
  language?: string;
}) => {
  const response = await api.post("/interview/attempts", payload);
  return response.data;
};

export const scheduleMockInterview = async (payload: {
  mentorName?: string;
  company?: string;
  scheduledAt: string;
}) => {
  const response = await api.post("/interview/mocks", payload);
  return response.data;
};

export const updateMockInterview = async (
  id: string,
  status: "scheduled" | "completed" | "cancelled"
) => {
  const response = await api.patch(`/interview/mocks/${id}`, { status });
  return response.data;
};

export const createInterviewPost = async (text: string) => {
  const response = await api.post("/interview/posts", { text });
  return response.data;
};

export const markInterviewPostHelpful = async (id: string) => {
  const response = await api.post(`/interview/posts/${id}/helpful`);
  return response.data;
};
