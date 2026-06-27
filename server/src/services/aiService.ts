// ─── AI Service ──────────────────────────────────────────
import { GoogleGenerativeAI } from "@google/generative-ai";

export const getAIStatus = () => {
  return {
    module: "ai",
    status: "ok",
    message: "AI Study Assistant API is working.",
    features: ["Viva Preparation", "Doubt Solver", "Notes Summarizer", "Document Analysis"],
  };
};

export const getAIResponse = async (prompt: string, mode: string = "default", file?: Express.Multer.File) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // We use gemini-2.5-flash as it is fast and supports multimodal inputs
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const parts: any[] = [];
  
  let systemPrompt = "";
  if (mode === "viva") {
    systemPrompt = "You are an expert examiner conducting a viva. Ask relevant questions and evaluate answers based on the user's prompt. ";
  } else if (mode === "summarize") {
    systemPrompt = "You are a study assistant. Please provide a clear, concise, and structured summary of the following. ";
  } else {
    systemPrompt = "You are a helpful and expert AI Study Assistant. Help the student with their academic doubts clearly and concisely. ";
  }

  parts.push({ text: systemPrompt + prompt });

  if (file) {
    parts.push({
      inlineData: {
        data: file.buffer.toString("base64"),
        mimeType: file.mimetype
      }
    });
  }

  const result = await model.generateContent(parts);
  const responseText = result.response.text();

  return {
    prompt,
    response: responseText,
    mode,
    timestamp: new Date().toISOString(),
  };
};
