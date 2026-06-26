import { Response } from "express";
import Schedule from "../models/Schedule";
import { AuthRequest } from "../middleware/auth";

export const saveSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { classes } = req.body;

    let schedule = await Schedule.findOne({ userId });

    if (schedule) {
      schedule.classes = classes;
      schedule.updatedAt = new Date();
      await schedule.save();
    } else {
      schedule = await Schedule.create({
        userId,
        classes
      });
    }

    res.status(200).json({ message: "Schedule saved successfully", schedule });
  } catch (error: any) {
    console.error("Save Schedule Error:", error.message);
    res.status(500).json({ error: "Server error saving schedule" });
  }
};

export const getSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const schedule = await Schedule.findOne({ userId });
    
    if (!schedule) {
      res.status(200).json({ classes: [] });
      return;
    }
    
    res.status(200).json(schedule);
  } catch (error: any) {
    console.error("Get Schedule Error:", error.message);
    res.status(500).json({ error: "Server error getting schedule" });
  }
};
