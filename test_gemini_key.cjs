// Quick Gemini API Key tester
// Run: node test_gemini_key.cjs

const https = require("https");

// Reading key from .env dynamically
const fs = require("fs");
const envContent = fs.readFileSync(".env", "utf-8");
const match = envContent.match(/GEMINI_API_KEY=(.+)/);
const API_KEY = match ? match[1].trim() : "";

// Format check
console.log("\n=== Gemini API Key Diagnostic ===\n");
console.log("Key value   :", API_KEY);
console.log("Key length  :", API_KEY.length);
console.log("Starts with :", API_KEY.substring(0, 8));
console.log("Format valid:", API_KEY.startsWith("AIzaSy") ? "✅ YES (starts with AIzaSy)" : "❌ NO (should start with AIzaSy)");

// Live API test — send a minimal request to Gemini
const payload = JSON.stringify({
  contents: [{ parts: [{ text: "Reply with the word: OK" }] }]
});

const options = {
  hostname: "generativelanguage.googleapis.com",
  path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload)
  }
};

console.log("\n⏳ Sending live test request to Gemini API...\n");

const req = https.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log("HTTP Status   :", res.statusCode, res.statusMessage);
    try {
      const parsed = JSON.parse(data);
      if (res.statusCode === 200) {
        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log("API Response  :", text?.trim());
        console.log("\n✅ RESULT: API key is VALID and WORKING!\n");
      } else {
        const errMsg = parsed?.error?.message || data;
        console.log("API Error     :", errMsg);
        console.log("\n❌ RESULT: API key is INVALID or has no access.\n");
        console.log("Fix: Go to https://aistudio.google.com/app/apikey → Create API Key → Paste in .env\n");
      }
    } catch (e) {
      console.log("Raw response  :", data.substring(0, 300));
    }
  });
});

req.on("error", (e) => {
  console.error("Network error :", e.message);
  console.log("\n❌ Could not reach Google API. Check your internet connection.\n");
});

req.write(payload);
req.end();
