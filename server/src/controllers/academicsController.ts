import { Request, Response } from "express";
import * as academicsService from "../services/academicsService";

export const getStatus = (_req: Request, res: Response): void => {
  res.json(academicsService.getAcademicsStatus());
};

// TODO: Connect to AttendanceRecord model
export const predictAttendance = (req: Request, res: Response): void => {
  const { attended, total } = req.body;
  const result = academicsService.predictAttendance(
    Number(attended) || 0,
    Number(total) || 0
  );
  res.json(result);
};

// TODO: Connect to user's grade data
export const calculateCGPA = (req: Request, res: Response): void => {
  const { grades } = req.body;
  const result = academicsService.calculateCGPA(grades || []);
  res.json(result);
};
