import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";
import { analyzeMarksheetWithAI } from "../services/aiScannerService";

export const setupProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { category, income, interests, currentSemester, currentCgpa, targetCgpa, creditsEarned, totalCredits } = req.body;
    
    // Parse files from multer
    const files = req.files as Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.academicProfile) user.academicProfile = { currentSemester: 1 } as any;
    if (!user.profileDetails) user.profileDetails = {};
    if (!user.documents) {
      user.documents = { marksheets: new Map() } as any;
    } else if (!user.documents.marksheets) {
      user.documents.marksheets = new Map();
    }

    if (currentSemester) user.academicProfile!.currentSemester = Number(currentSemester);
    if (currentCgpa) user.academicProfile!.currentCgpa = Number(currentCgpa);
    if (targetCgpa) user.academicProfile!.targetCgpa = Number(targetCgpa);
    if (creditsEarned) user.academicProfile!.creditsEarned = Number(creditsEarned);
    if (totalCredits) user.academicProfile!.totalCredits = Number(totalCredits);

    if (category) user.profileDetails!.category = category;
    if (income) user.profileDetails!.income = income;
    if (interests) user.profileDetails!.interests = interests;

    // Update files
    if (files) {
      const fileArray = Array.isArray(files) ? files : Object.values(files).flat();
      for (const file of fileArray) {
        const fileUrl = file.path; // Cloudinary URL
        const fieldname = file.fieldname;
        
        if (fieldname.startsWith('marksheet_')) {
          const semesterStr = fieldname.split('_')[1];
          const semester = Number(semesterStr);
          // Ensure marksheets is a Map (Mongoose handles it if initialized properly)
          if (user.documents && user.documents.marksheets && typeof user.documents.marksheets.set === 'function') {
            user.documents.marksheets.set(semesterStr, fileUrl);
          } else if (user.documents && user.documents.marksheets) {
            // Fallback if it's a plain object
            (user.documents.marksheets as any)[semesterStr] = fileUrl;
          }

          // === AI Marks Analysis ===
          const aiResult = await analyzeMarksheetWithAI(fileUrl, semester);
          if (aiResult) {
             if (!user.academicProfile) user.academicProfile = {} as any;
             if (!user.academicProfile!.semesterGpas) {
               user.academicProfile!.semesterGpas = [];
             }
             
             // Ensure array has enough elements up to the current semester
             while (user.academicProfile!.semesterGpas.length < semester) {
               user.academicProfile!.semesterGpas.push(0); // 0 acts as placeholder for missing semesters
             }
             
             if (aiResult.sgpa !== null) {
               user.academicProfile!.semesterGpas[semester - 1] = aiResult.sgpa;
             }
             
             if (aiResult.cgpa !== null) {
                user.academicProfile!.currentCgpa = aiResult.cgpa;
             } else if (semester === 1 && aiResult.sgpa !== null) {
                user.academicProfile!.currentCgpa = aiResult.sgpa;
             } else {
                const validGpas = user.academicProfile!.semesterGpas.filter(g => g > 0);
                if (validGpas.length > 0) {
                   user.academicProfile!.currentCgpa = Number((validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2));
                }
             }
             
             if (aiResult.creditsEarned !== null) {
                user.academicProfile!.creditsEarned = (user.academicProfile!.creditsEarned || 0) + aiResult.creditsEarned;
             }
             
             // Re-calculate average CGPA if possible
             const validGpas = user.academicProfile!.semesterGpas.filter(g => g > 0);
             if (validGpas.length > 0) {
               const sum = validGpas.reduce((a, b) => a + b, 0);
               user.academicProfile!.averageCgpa = Number((sum / validGpas.length).toFixed(2));
               user.academicProfile!.highestCgpa = Math.max(...validGpas);

               let trend = 0;
               if (user.academicProfile!.semesterGpas.length > 1) {
                 trend = user.academicProfile!.semesterGpas[user.academicProfile!.semesterGpas.length - 1] - user.academicProfile!.semesterGpas[0];
               }
               user.academicProfile!.predictedCgpa = Number(
                 Math.min(10.0, Math.max(4.0, user.academicProfile!.averageCgpa + trend * 0.15 + 0.2)).toFixed(2)
               );
             }
             
             if (aiResult.subjects && aiResult.subjects.length > 0) {
               user.academicProfile!.subjects = aiResult.subjects;
             }
          }
        } else if (fieldname === 'timetable') {
          if (user.documents) {
            user.documents.timetable = fileUrl;
          }
        } else if (fieldname === 'profilePicture') {
          user.profilePicture = fileUrl;
        }
      }
    }

    user.isProfileComplete = true;
    user.markModified('academicProfile');
    user.markModified('documents');

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
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
