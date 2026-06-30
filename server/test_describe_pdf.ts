import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  const fileUrl = "https://res.cloudinary.com/dqsjov8i7/image/upload/v1782846601/shikshasetu_marksheets/marksheet_6a3f974d3bdefc85dedacbb5_sem2_1782846595470.png";
  const response = await fetch(fileUrl, {
    headers: { "User-Agent": "Mozilla/5.0", "Accept": "image/png" },
  });
  const arrayBuffer = await response.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const parts = [
    { text: "Describe what this document is. Does it contain grades, SGPA, CGPA, credits, or semester information? Print all text and values you find." },
    {
      inlineData: {
        data: base64Data,
        mimeType: "image/png",
      },
    },
  ];
  
  const completion = await model.generateContent(parts);
  console.log("Description:", completion.response.text());
}

run().catch(console.error);
