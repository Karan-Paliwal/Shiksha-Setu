import { Request, Response } from "express";
import * as authService from "../services/authService";
import { AuthRequest } from "../middleware/auth";

// ─── Signup ─────────────────────────────────────────────
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const result = await authService.signupUser(name, email, password);
    res.status(201).json({
      message: "Account created successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ─── Login ──────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const result = await authService.loginUser(email, password);
    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

// ─── Logout (client-side token removal) ─────────────────
export const logout = async (_req: Request, res: Response): Promise<void> => {
  // JWT is stateless — logout is handled on the client by removing the token.
  // This endpoint exists for API completeness.
  res.json({ message: "Logged out successfully" });
};

// ─── Get Profile ────────────────────────────────────────
export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await authService.getUserProfile(req.userId!);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
