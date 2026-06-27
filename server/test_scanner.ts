import dotenv from "dotenv";
dotenv.config();

import { analyzeMarksheetWithAI } from "./src/services/aiScannerService";

async function run() {
  const dummyImageUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
  console.log("Testing with dummy image:", dummyImageUrl);
  const result = await analyzeMarksheetWithAI(dummyImageUrl, 1);
  console.log("Result:", result);
}

run().catch(console.error);
