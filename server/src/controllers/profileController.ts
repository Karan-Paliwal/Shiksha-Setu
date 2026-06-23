import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

export const setupProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { currentCgpa, targetCgpa, creditsEarned, totalCredits, currentSemester } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.academicProfile = {
      currentCgpa: Number(currentCgpa),
      targetCgpa: Number(targetCgpa),
      creditsEarned: Number(creditsEarned),
      totalCredits: Number(totalCredits),
      currentSemester: Number(currentSemester)
    };
    user.isProfileComplete = true;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user: {
      name: user.name,
      email: user.email,
      isProfileComplete: user.isProfileComplete,
      academicProfile: user.academicProfile
    }});
  } catch (error: any) {
    console.error("Profile Setup Error:", error.message);
    res.status(500).json({ error: "Server error setting up profile" });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Get Profile Error:", error.message);
    res.status(500).json({ error: "Server error getting profile" });
  }
};
