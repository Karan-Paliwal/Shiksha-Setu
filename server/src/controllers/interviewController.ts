import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import * as interviewService from "../services/interviewService";

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const dashboard = await interviewService.getDashboard(req.userId!);
    res.status(200).json(dashboard);
  } catch (error: any) {
    console.error("Get Interview Dashboard Error:", error.message);
    res.status(500).json({ error: "Server error loading interview prep dashboard" });
  }
};

export const recordAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await interviewService.recordAttempt(req.userId!, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Unable to record attempt" });
  }
};

export const getQuestionBank = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const questions = interviewService.getQuestionBank(
      String(req.query.q || ""),
      String(req.query.difficulty || "All"),
      String(req.query.category || "All"),
      String(req.query.type || "All")
    );
    res.status(200).json({ questions });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Unable to search question bank" });
  }
};

export const scheduleMock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mock = await interviewService.scheduleMock(req.userId!, req.body);
    res.status(201).json(mock);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Unable to schedule mock interview" });
  }
};

export const updateMockStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mock = await interviewService.updateMockStatus(req.userId!, req.params.id, req.body.status);
    res.status(200).json(mock);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Unable to update mock interview" });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await interviewService.createPost(req.userId!, req.body);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Unable to publish post" });
  }
};

export const markPostHelpful = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await interviewService.markPostHelpful(req.userId!, req.params.id);
    res.status(200).json(post);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Unable to mark post helpful" });
  }
};
