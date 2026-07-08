import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";
import { analyzeMarksheetWithAI } from "../services/aiScannerService";

export const clearMarksheets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.documents && user.documents.marksheets) {
      user.documents.marksheets = new Map();
    }

    if (user.academicProfile) {
      user.academicProfile.currentCgpa = 0;
      user.academicProfile.predictedCgpa = 0;
      user.academicProfile.highestCgpa = 0;
      user.academicProfile.averageCgpa = 0;
      user.academicProfile.semesterGpas = [];
      user.academicProfile.semesterCredits = [];
      user.academicProfile.subjects = [];
      user.academicProfile.creditsEarned = 0;
    }

    user.markModified('documents.marksheets');
    user.markModified('academicProfile');
    await user.save();

    res.status(200).json({ message: "Marksheets and associated academic data cleared successfully", user });
  } catch (error: any) {
    console.error("Clear Marksheets Error:", error.message);
    res.status(500).json({ error: "Server error clearing marksheets" });
  }
};


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

          // Validate semester BEFORE running AI analysis and saving
          const currentSem = Number(currentSemester) || user.academicProfile?.currentSemester || 1;
          if (semester >= currentSem) {
            res.status(400).json({
              error: `Invalid marksheet. You are currently in Semester ${currentSem}, so you can only upload marksheets for previous semesters (Semester 1 to ${currentSem - 1}).`
            });
            return;
          }

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
             if (!user.academicProfile!.semesterCredits) {
                user.academicProfile!.semesterCredits = [];
             }
             
             // Use AI-detected semester or fall back to the one from fieldname
             const actualSem = aiResult.semester || semester;

             if (actualSem >= user.academicProfile!.currentSemester) {
                res.status(400).json({
                  error: `Invalid marksheet. You are currently in Semester ${user.academicProfile!.currentSemester}, so you can only upload marksheets for previous semesters (Semester 1 to ${user.academicProfile!.currentSemester - 1}). The uploaded marksheet was detected as Semester ${actualSem}.`
                });
                return;
             }

             // Ensure array has enough elements
             while (user.academicProfile!.semesterGpas.length < actualSem) {
                user.academicProfile!.semesterGpas.push(0);
             }
             while (user.academicProfile!.semesterCredits.length < actualSem) {
                user.academicProfile!.semesterCredits.push(0);
             }

             // Handle consolidated transcript if available, otherwise single semester GPA
             if (aiResult.allSemesterGpas && Object.keys(aiResult.allSemesterGpas).length > 0) {
               for (const [semStr, gpa] of Object.entries(aiResult.allSemesterGpas)) {
                 const idx = Number(semStr) - 1;
                 if (idx >= 0 && gpa > 0) {
                   while (user.academicProfile!.semesterGpas.length <= idx) {
                     user.academicProfile!.semesterGpas.push(0);
                   }
                   user.academicProfile!.semesterGpas[idx] = Number(gpa.toFixed(2));
                 }
               }
             } else if (aiResult.sgpa !== null && aiResult.sgpa > 0) {
                user.academicProfile!.semesterGpas[actualSem - 1] = aiResult.sgpa;
             }
             
             if (aiResult.cgpa !== null && aiResult.cgpa > 0) {
                 user.academicProfile!.currentCgpa = aiResult.cgpa;
             } else if (actualSem === 1 && aiResult.sgpa !== null && aiResult.sgpa > 0) {
                 user.academicProfile!.currentCgpa = aiResult.sgpa;
             } else {
                 const validGpas = user.academicProfile!.semesterGpas.filter(g => g > 0);
                 if (validGpas.length > 0) {
                    user.academicProfile!.currentCgpa = Number((validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2));
                 }
             }
             
             if (aiResult.creditsEarned !== null && aiResult.creditsEarned > 0) {
                 user.academicProfile!.semesterCredits[actualSem - 1] = aiResult.creditsEarned;
             }
             
             // Recalculate total credits earned
             user.academicProfile!.creditsEarned = user.academicProfile!.semesterCredits.reduce((sum, val) => sum + (val || 0), 0);
             
             // Limit to completed semesters only (less than current semester)
             const currentSem = user.academicProfile!.currentSemester || 1;
             if (user.academicProfile!.semesterGpas.length >= currentSem) {
                user.academicProfile!.semesterGpas = user.academicProfile!.semesterGpas.slice(0, currentSem - 1);
             }
             if (user.academicProfile!.semesterCredits.length >= currentSem) {
                user.academicProfile!.semesterCredits = user.academicProfile!.semesterCredits.slice(0, currentSem - 1);
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
                user.academicProfile!.subjects = aiResult.subjects as any;
             }

             if (aiResult.hasActiveBacklogs) {
                user.academicProfile!.hasActiveBacklogs = true;
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

    // Clean up current or higher semester marksheets from documents.marksheets Map
    const currentSem = user.academicProfile?.currentSemester || 1;
    const documents = user.documents || ({ marksheets: new Map() } as any);
    if (documents.marksheets) {
      if (typeof documents.marksheets.delete === "function") {
        for (const key of Array.from(documents.marksheets.keys())) {
          if (Number(key) >= currentSem) {
            documents.marksheets.delete(key);
          }
        }
      } else {
        for (const key of Object.keys(documents.marksheets)) {
          if (Number(key) >= currentSem) {
            delete (documents.marksheets as any)[key];
          }
        }
      }
    }

    user.isProfileComplete = true;
    user.markModified('academicProfile');
    user.markModified('documents');
    user.markModified('documents.marksheets');

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
    res.status(500).json({ error: "Server error getting profile" });
  }
};

export const updateSkills = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      res.status(400).json({ error: "Skills must be an array of strings" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.skills = skills;
    await user.save();

    res.status(200).json({ message: "Skills updated successfully", skills: user.skills });
  } catch (error: any) {
    console.error("Update Skills Error:", error.message);
    res.status(500).json({ error: "Server error updating skills" });
  }
};
