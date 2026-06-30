import { Request, Response } from "express";
import * as academicsService from "../services/academicsService";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";
import { cloudinary } from "../config/cloudinary";
import { analyzeMarksheetWithAI } from "../services/aiScannerService";

export const getStatus = (_req: Request, res: Response): void => {
  res.json(academicsService.getAcademicsStatus());
};

export const calculateCGPA = (req: Request, res: Response): void => {
  const { grades } = req.body;
  const result = academicsService.calculateCGPA(grades || []);
  res.json(result);
};

// No fallback/estimated GPAs — only real AI-extracted data is stored

export const uploadMarksheet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { fileName, fileType, fileData } = req.body;

    if (!fileName || !fileData) {
      res.status(400).json({ error: "File name and file data are required" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const semCount = user.academicProfile?.currentSemester || 5;

    if (semCount <= 1) {
      res.status(400).json({
        error: "Invalid action. You are currently in Semester 1, so there are no previous semester marksheets to upload."
      });
      return;
    }

    // ─── Step 1: Upload base64 file to Cloudinary ──────────────────────────────
    console.log(`[Marksheet] Uploading "${fileName}" to Cloudinary...`);
    let cloudinaryUrl: string | null = null;

    try {
      const uploadResult = await cloudinary.uploader.upload(fileData, {
        folder: "shikshasetu_marksheets",
        resource_type: "auto",
        public_id: `marksheet_${userId}_sem${semCount}_${Date.now()}`,
      });
      cloudinaryUrl = uploadResult.secure_url;
      console.log(`[Marksheet] Cloudinary upload success: ${cloudinaryUrl}`);
    } catch (uploadErr: any) {
      console.error("[Marksheet] Cloudinary upload failed:", uploadErr.message);
      // Not fatal — we'll fallback to simulated data below
    }

    // ─── Step 2: Run AI Vision analysis on the Cloudinary URL ──
    // ─── Step 2: Run AI Vision analysis on the Cloudinary URL ──
    let semesterGpas: number[] = user.academicProfile?.semesterGpas || [];
    let currentCgpa: number = user.academicProfile?.currentCgpa || 0;
    let creditsEarned: number = user.academicProfile?.creditsEarned || 0;
    let subjects: { name: string; score: number }[] = user.academicProfile?.subjects || [];
    let aiUsed = false;
    let actualSem = semCount;

    if (cloudinaryUrl) {
      console.log(`[Marksheet] Sending to Groq Vision AI for semester ${semCount} analysis...`);
      const aiResult = await analyzeMarksheetWithAI(cloudinaryUrl, semCount);

      if (aiResult) {
        aiUsed = true;
        console.log(`[Marksheet] AI Result:`, aiResult);

        // Use AI-detected semester or fall back to semCount
        actualSem = aiResult.semester || semCount;

        if (actualSem >= semCount) {
          res.status(400).json({
            error: `Invalid marksheet. You are currently in Semester ${semCount}, so you can only upload marksheets for previous semesters (Semester 1 to ${semCount - 1}). The uploaded marksheet was detected as Semester ${actualSem}.`
          });
          return;
        }

        // Ensure semesterGpas array has enough space for the target semester
        while (semesterGpas.length < actualSem) {
          semesterGpas.push(0);
        }

        // ── Case A: Consolidated transcript — AI returned GPAs for all semesters ──
        if (aiResult.allSemesterGpas && Object.keys(aiResult.allSemesterGpas).length > 0) {
          for (const [semStr, gpa] of Object.entries(aiResult.allSemesterGpas)) {
            const idx = Number(semStr) - 1;
            if (idx >= 0 && gpa > 0) {
              while (semesterGpas.length <= idx) {
                semesterGpas.push(0);
              }
              semesterGpas[idx] = Number(gpa.toFixed(2));
            }
          }
          console.log(`[Marksheet] Consolidated transcript — all semester GPAs extracted:`, semesterGpas);
        } else {
          // ── Case B: Single semester marksheet — only current semester SGPA known ──
          if (aiResult.sgpa !== null && aiResult.sgpa > 0) {
            semesterGpas[actualSem - 1] = aiResult.sgpa;
          }

          // ── Special: First semester — SGPA is the sole grade, treat it as CGPA too ──
          if (actualSem === 1 && aiResult.sgpa !== null && aiResult.sgpa > 0) {
            currentCgpa = aiResult.sgpa;  // SGPA = CGPA for sem 1
            console.log(`[Marksheet] Semester 1 upload — SGPA ${aiResult.sgpa} set as currentCgpa.`);
          }
        }

        // Set CGPA from AI if available
        if (aiResult.cgpa !== null && aiResult.cgpa > 0) {
          currentCgpa = aiResult.cgpa;
        } else {
          const validGpas = semesterGpas.filter(g => g > 0);
          currentCgpa = validGpas.length > 0
            ? Number((validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2))
            : 0;
        }

        if (aiResult.creditsEarned !== null && aiResult.creditsEarned > 0) {
          creditsEarned = aiResult.creditsEarned;
        }

        if (aiResult.subjects && aiResult.subjects.length > 0) {
          subjects = aiResult.subjects;
        }
      }
    }

    // ─── Step 3: If AI returned no data, preserve existing user data ────────────
    if (!aiUsed || semesterGpas.every(g => g === 0)) {
      console.warn("[Marksheet] AI returned no usable data — keeping existing user data as-is.");
      aiUsed = false;
      semesterGpas = user.academicProfile?.semesterGpas || [];
      currentCgpa = user.academicProfile?.currentCgpa || 0;
      actualSem = semCount;
    }

    // Limit to completed semesters only (less than current semester)
    if (semesterGpas.length >= semCount) {
      semesterGpas = semesterGpas.slice(0, semCount - 1);
    }

    // ─── Step 4: Compute aggregate stats ──────────────────────────────────────
    const validGpas = semesterGpas.filter(g => g > 0);
    const highestCgpa = validGpas.length > 0 ? Math.max(...validGpas) : 0;
    const averageCgpa = validGpas.length > 0
      ? Number((validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2))
      : 0;

    // Trend-based predicted CGPA
    let trend = 0;
    if (semesterGpas.length > 1) {
      trend = semesterGpas[semesterGpas.length - 1] - semesterGpas[0];
    }
    const predictedCgpa = Number(
      Math.min(10.0, Math.max(4.0, averageCgpa + trend * 0.15 + 0.2)).toFixed(2)
    );

    // ─── Step 5: Persist to DB ─────────────────────────────────────────────────
    user.academicProfile = {
      currentCgpa: currentCgpa || averageCgpa,
      targetCgpa: user.academicProfile?.targetCgpa || 9.0,
      creditsEarned,
      totalCredits: user.academicProfile?.totalCredits || 160,
      currentSemester: Math.max(semCount, actualSem),
      predictedCgpa,
      highestCgpa,
      averageCgpa,
      semesterGpas,
      subjects,
    };

    // Save Cloudinary URL (or a placeholder) in documents.marksheets
    const documents = user.documents || ({ marksheets: new Map() } as any);
    if (!user.documents) {
      user.documents = documents;
    }

    if (!documents.marksheets) {
      documents.marksheets = new Map() as any;
    }

    const marksheetUrl = cloudinaryUrl || `marksheet-dashboard-sem-${actualSem}`;
    const marksheetKey = actualSem.toString();
    const marksheets = documents.marksheets as unknown as Map<string, string>;

    if (typeof marksheets.set === "function") {
      marksheets.set(marksheetKey, marksheetUrl);
    } else {
      (marksheets as any)[marksheetKey] = marksheetUrl;
    }

    // Clean up current or higher semester marksheets
    if (typeof marksheets.delete === "function") {
      for (const key of Array.from(marksheets.keys())) {
        if (Number(key) >= semCount) {
          marksheets.delete(key);
        }
      }
    } else {
      for (const key of Object.keys(marksheets)) {
        if (Number(key) >= semCount) {
          delete (marksheets as any)[key];
        }
      }
    }

    user.isProfileComplete = true;
    user.markModified("academicProfile");
    user.markModified("documents.marksheets");
    await user.save();

    res.status(200).json({
      message: aiUsed
        ? "Marksheet analyzed successfully using AI Vision."
        : "Marksheet uploaded but AI could not extract grades. Your existing data has been preserved.",
      aiUsed,
      isSem1: semCount === 1,
      cloudinaryUrl,
      academicProfile: user.academicProfile,
      user: {
        name: user.name,
        email: user.email,
        isProfileComplete: user.isProfileComplete,
        academicProfile: user.academicProfile,
        documents: user.documents,
      },
    });

  } catch (error: any) {
    console.error("Upload Marksheet Error:", error.message);
    res.status(500).json({ error: "Server error during marksheet analysis: " + (error.message || "Unknown error") });
  }
};
