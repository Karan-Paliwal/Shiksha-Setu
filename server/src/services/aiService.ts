// ─── AI Service ──────────────────────────────────────────
// TODO: Integrate actual AI/ML APIs (OpenAI, Gemini, etc.)

const mockAIResponses: Record<string, string> = {
  default:
    "I'm your AI Study Assistant! I can help with viva preparation, doubt solving, and notes summarization. This is a placeholder response — real AI integration coming soon!",
  viva: "Here are some common viva questions for your topic:\n1. Explain the concept in your own words.\n2. What are the real-world applications?\n3. How does this differ from related concepts?\n4. Can you draw a diagram to illustrate?",
  doubt:
    "Great question! Let me break this down for you step by step. [This is a placeholder — actual AI-powered explanations will be added once the AI API is integrated.]",
  summarize:
    "Here is a summary of your notes:\n• Key Point 1: [Placeholder]\n• Key Point 2: [Placeholder]\n• Key Point 3: [Placeholder]\n\nThis summary was generated as a placeholder. Real AI summarization coming soon!",
};

export const getAIStatus = () => {
  return {
    module: "ai",
    status: "ok",
    message: "AI Study Assistant API is working.",
    features: ["Viva Preparation", "Doubt Solver", "Notes Summarizer"],
  };
};

// TODO: Replace with actual AI API call
export const getAIResponse = (prompt: string, mode: string = "default") => {
  const response = mockAIResponses[mode] || mockAIResponses.default;
  return {
    prompt,
    response,
    mode,
    timestamp: new Date().toISOString(),
    note: "This is a mock response. Integrate your preferred AI API here.",
  };
};
