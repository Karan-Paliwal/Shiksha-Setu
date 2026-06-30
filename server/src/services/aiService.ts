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
  // We use gemini-2.5-flash as it is fast and supports JSON response format
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const parts: any[] = [];
  
  let systemPrompt = "";
  if (mode === "viva") {
    systemPrompt = "You are an expert examiner conducting a viva. Ask relevant questions and evaluate answers based on the user's prompt. ";
  } else if (mode === "summarize") {
    systemPrompt = "You are a study assistant. Please provide a clear, concise, and structured summary of the following. ";
  } else if (mode === "computer_science") {
    systemPrompt = "You are an expert Computer Science Professor and Lead Software Engineer. Help B.Tech students with coding, algorithms (like trees, graphs, dynamic programming), data structures, databases, and system design. Provide code snippets in popular languages (C++, Java, Python, TypeScript) when helpful and explain time/space complexity (Big O). ";
  } else if (mode === "mathematics") {
    systemPrompt = "You are an expert Engineering Mathematics Professor. Help B.Tech students with topics like Linear Algebra, Calculus, Differential Equations, Probability & Statistics, and Discrete Mathematics. Break down mathematical derivations, proofs, and equations clearly step-by-step. ";
  } else if (mode === "engineering_physics") {
    systemPrompt = "You are an expert Core Engineering and Physics Professor. Help B.Tech engineering students understand electromagnetism, quantum physics, thermodynamics, mechanics, and circuit analysis. Explain physical laws, circuit theorems (Thevenin, Norton), and how they apply in engineering contexts. ";
  } else if (mode === "exam_prep") {
    systemPrompt = "You are an expert placement coach and GATE exam tutor. Help B.Tech students prepare for technical interviews, coding assessments, competitive tests, and core CS/IT placement topics (like OS, DBMS, Computer Networks). Ask practice questions or conduct mock revisions to test knowledge. ";
  } else {
    systemPrompt = "You are a helpful and expert AI Study Assistant. Help the B.Tech student with their academic doubts clearly and concisely. ";
  }

  const jsonPromptInstruction = "\n\nYou MUST respond ONLY in the following JSON format structure:\n" +
    "{\n" +
    "  \"response\": \"Your detailed explanation/answer in Markdown format (keep it engaging and helpful)\",\n" +
    "  \"takeaways\": [\"A key concept, formula, or fact discussed\", \"Another key takeaway\"],\n" +
    "  \"recommendations\": [\"An actionable study next step, quiz topic, or prep tip\", \"Another study tip\"]\n" +
    "}\n\nMake sure to provide 1-3 highly relevant items for takeaways and recommendations arrays.";

  parts.push({ text: systemPrompt + prompt + jsonPromptInstruction });

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

  let parsedResponse = {
    response: responseText,
    takeaways: [] as string[],
    recommendations: [] as string[]
  };

  try {
    const parsed = JSON.parse(responseText);
    if (parsed.response) parsedResponse.response = parsed.response;
    if (Array.isArray(parsed.takeaways)) parsedResponse.takeaways = parsed.takeaways;
    if (Array.isArray(parsed.recommendations)) parsedResponse.recommendations = parsed.recommendations;
  } catch (err) {
    console.warn("Failed to parse Gemini response as JSON. Falling back using regex.", err);
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.response) parsedResponse.response = parsed.response;
        if (Array.isArray(parsed.takeaways)) parsedResponse.takeaways = parsed.takeaways;
        if (Array.isArray(parsed.recommendations)) parsedResponse.recommendations = parsed.recommendations;
      }
    } catch (nestedErr) {
      // Fallback: keep responseText as response text
    }
  }

  return {
    prompt,
    response: parsedResponse.response,
    insights: {
      takeaways: parsedResponse.takeaways,
      recommendations: parsedResponse.recommendations
    },
    mode,
    timestamp: new Date().toISOString(),
  };
};
