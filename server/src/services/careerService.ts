import { GoogleGenerativeAI } from "@google/generative-ai";

export const getCareerStatus = () => {
  return {
    module: "career",
    status: "ok",
    message: "Career Builder API is working.",
    features: [
      "Resume Builder",
      "Skill Roadmap",
      "Interview Preparation",
      "Internship Tracker",
    ],
  };
};

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-2.5-flash" });
};

export const getInterviewQuestions = async (role: string = "Software Engineer") => {
  try {
    const model = getGenAI();
    const prompt = `Generate exactly 5 interview questions for a ${role} role. Return a JSON array of objects with exactly this format: [{"id": 1, "category": "Technical", "question": "...", "difficulty": "Medium"}]. Only return the raw JSON array.`;
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (err) {
    console.error("AI Interview Generation Error:", err);
    // Fallback data
    return [
      { id: 1, category: "Technical", question: "What are your strongest technical skills?", difficulty: "Medium" }
    ];
  }
};

export const getSkillRoadmap = async (track: string = "fullstack") => {
  try {
    const model = getGenAI();
    const prompt = `Generate a learning roadmap for a ${track} developer. Return a JSON object with this exact format: {"track": "${track}", "steps": ["Step 1", "Step 2", "Step 3"]}. Provide exactly 6 to 8 steps. Only return the raw JSON object.`;
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (err) {
    console.error("AI Roadmap Generation Error:", err);
    // Fallback data
    return {
      track,
      steps: ["HTML/CSS", "JavaScript", "React", "Node.js", "Database Design"],
    };
  }
};
