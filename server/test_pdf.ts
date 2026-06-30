import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { analyzeMarksheetWithAI } from "./src/services/aiScannerService";

async function run() {
  const fileUrl = "https://res.cloudinary.com/dqsjov8i7/image/upload/v1782846601/shikshasetu_marksheets/marksheet_6a3f974d3bdefc85dedacbb5_sem2_1782846595470.png";
  console.log("Testing with real image sem 2 URL but passing sem 1:", fileUrl);
  const result = await analyzeMarksheetWithAI(fileUrl, 1);
  console.log("Result:", result);
}

run().catch(console.error);
