import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  const fileUrl = "https://res.cloudinary.com/dqsjov8i7/image/upload/v1782556162/shikshasetu_marksheets/marksheet_6a3f974d3bdefc85dedacbb5_sem2_1782556158660.pdf";
  const response = await fetch(fileUrl, {
    headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/pdf" },
  });
  const arrayBuffer = await response.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const parts = [
    { text: "Describe what this document is. Does it contain grades? If so, what are they?" },
    {
      inlineData: {
        data: base64Data,
        mimeType: "application/pdf",
      },
    },
  ];
  
  const completion = await model.generateContent(parts);
  console.log("Description:", completion.response.text());
}

run().catch(console.error);
