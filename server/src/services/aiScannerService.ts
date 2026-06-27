import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
// Load .env from project root — works whether running from server/ or root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config(); // fallback

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export interface MarksheetAnalysisResult {
  sgpa: number | null;       // GPA for the specific semester
  cgpa: number | null;       // Cumulative GPA up to that semester
  creditsEarned: number | null;
  allSemesterGpas: Record<string, number> | null; // e.g. { "1": 8.2, "2": 8.6 }
  subjects: { name: string; score: number }[] | null;
}

/**
 * Analyzes a marksheet image/PDF uploaded to Cloudinary using Groq Vision (Llama 4 Scout).
 * Returns real extracted GPA data from the actual document.
 */
export const analyzeMarksheetWithAI = async (
  fileUrl: string,
  semester: number
): Promise<MarksheetAnalysisResult | null> => {
  if (!genAI) {
    console.warn("[AI Scanner] GEMINI_API_KEY is not set. Skipping AI analysis.");
    return null;
  }

  try {
    console.log(`[AI Scanner] Fetching document from Cloudinary: ${fileUrl}`);

    // Fetch the file from Cloudinary and convert to base64
    const response = await fetch(fileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "image/*,application/pdf,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Cloudinary: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Gemini natively supports image/* and application/pdf
    let mimeType = contentType;
    if (fileUrl.toLowerCase().endsWith(".pdf")) {
      mimeType = "application/pdf";
    }
    console.log(`[AI Scanner] Sending to Gemini (gemini-2.5-flash) model (mime: ${mimeType})...`);

    const prompt = `You are an expert Indian university academic document analyzer with deep knowledge of Indian grading systems.

This is a student marksheet or academic transcript for Semester ${semester}.
It could be a single semester result, or a consolidated transcript showing multiple semesters.

TASK: Extract grade/GPA data from this document with 100% accuracy. Read every number visible.

IMPORTANT NOTES FOR INDIAN UNIVERSITIES:
- SGPA / SPI / SGPI / Grade Point = Semester GPA
- CGPA / CPI / CGPI / Cumulative GPA = Overall GPA across all semesters  
- Some marksheets use 10-point scale, some use 4-point or percentage
- Common formats: "CGPA: 8.45", "SPI: 9.12", "SGPA 7.85", etc.
- Look in footer rows, summary rows, and totals sections

RETURN ONLY this exact JSON format, no markdown, no explanation:
{
  "sgpa": <number or null>,
  "cgpa": <number or null>,
  "creditsEarned": <number or null>,
  "allSemesterGpas": <{"1": 8.2, "2": 8.6, ...} or null>,
  "subjects": [{"name": "string", "score": <number>}]
}

Rules:
- "sgpa" = the GPA/SPI/SGPA for semester ${semester} specifically
- "cgpa" = the cumulative/overall GPA shown on this document
- "creditsEarned" = total credits earned (cumulative number if shown)
- "allSemesterGpas" = ONLY fill this if the document shows results for MORE than one semester (consolidated transcript). Map each visible semester number to its SGPA.
- "subjects" = Extract all individual subjects listed. "score" MUST BE normalized to a 0-100 percentage scale (e.g. if the student scored 8.5/10, score=85. If 85/100, score=85).
- If a value is not clearly visible, set it to null
- NEVER guess or invent numbers — only return what is clearly printed in the document`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const parts = [
      { text: "You are a precise data extraction tool. You ALWAYS respond with ONLY valid JSON. No markdown, no explanation, no code fences. Just the raw JSON object." },
      { text: prompt },
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ];

    const completion = await model.generateContent(parts);
    const rawText = completion.response.text() || "";
    console.log(`[AI Scanner] Raw Gemini response:`, rawText);

    // ── Robust JSON extraction ─────────────────────────────────────────────────
    // Find the first {...} block in the response — handles text before/after JSON
    // and markdown code fences like ```json ... ```
    let jsonString: string | null = null;

    // Try: extract JSON between first { and last }
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    } else {
      // Fallback: strip markdown fences and try the whole thing
      jsonString = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
    }

    if (!jsonString) {
      console.error("[AI Scanner] Could not extract JSON from Gemini response.");
      return null;
    }

    const parsed = JSON.parse(jsonString) as MarksheetAnalysisResult;

    // Validate the parsed result
    const result: MarksheetAnalysisResult = {
      sgpa: typeof parsed.sgpa === "number" && parsed.sgpa > 0 ? parsed.sgpa : null,
      cgpa: typeof parsed.cgpa === "number" && parsed.cgpa > 0 ? parsed.cgpa : null,
      creditsEarned: typeof parsed.creditsEarned === "number" && parsed.creditsEarned > 0 ? parsed.creditsEarned : null,
      allSemesterGpas: parsed.allSemesterGpas && typeof parsed.allSemesterGpas === "object"
        ? parsed.allSemesterGpas
        : null,
      subjects: Array.isArray(parsed.subjects) 
        ? parsed.subjects.map(s => ({
            name: s.name ? String(s.name) : "Unknown",
            score: Number(s.score) || 0
          })).filter(s => s.score > 0)
        : null,
    };

    console.log(`[AI Scanner] ✅ Extracted result:`, result);
    return result;

  } catch (error: any) {
    console.error("[AI Scanner] ❌ Error during Gemini analysis:", error.message || error);
    return null;
  }
};
