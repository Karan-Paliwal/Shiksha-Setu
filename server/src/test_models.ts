import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const apiKey = process.env.GEMINI_API_KEY || "";
console.log("Using API Key:", apiKey.substring(0, 10) + "...");

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Hello, are you there? Please reply with 'Yes, I am working!'");
    console.log("Gemini 2.5 Flash Response:", result.response.text());
  } catch (error) {
    console.error("Error with gemini-2.5-flash:", error);
  }
}

run();
