import api from "./api";
import { AuthResponse } from "../types";

// ─── Auth API Service ────────────────────────────────────

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },

  signup: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getProfile: async () => {
    const { data } = await api.get("/auth/profile");
    return data;
  },
};
