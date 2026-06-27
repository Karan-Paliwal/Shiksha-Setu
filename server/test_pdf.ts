import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { analyzeMarksheetWithAI } from "./src/services/aiScannerService";

async function run() {
  const fileUrl = "https://res.cloudinary.com/dqsjov8i7/image/upload/v1782556162/shikshasetu_marksheets/marksheet_6a3f974d3bdefc85dedacbb5_sem2_1782556158660.pdf";
  console.log("Testing with real PDF:", fileUrl);
  const result = await analyzeMarksheetWithAI(fileUrl, 2);
  console.log("Result:", result);
}

run().catch(console.error);
