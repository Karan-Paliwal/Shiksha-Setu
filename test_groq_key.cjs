// Groq API Key Live Test
const https = require("https");
const fs = require("fs");

const envContent = fs.readFileSync(".env", "utf-8");
const match = envContent.match(/GROQ_API_KEY=(.+)/);
const API_KEY = match ? match[1].trim() : "";

console.log("\n=== Groq API Key Diagnostic ===\n");
console.log("Key value   :", API_KEY.substring(0, 12) + "...(hidden)");
console.log("Key length  :", API_KEY.length);
console.log("Format valid:", API_KEY.startsWith("gsk_") ? "✅ YES (starts with gsk_)" : "❌ NO (should start with gsk_)");

const payload = JSON.stringify({
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
  messages: [{ role: "user", content: "Reply with exactly the word: OK" }],
  max_tokens: 10
});

const options = {
  hostname: "api.groq.com",
  path: "/openai/v1/chat/completions",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Length": Buffer.byteLength(payload)
  }
};

console.log("\n⏳ Sending live test to Groq API...\n");

const req = https.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log("HTTP Status :", res.statusCode, res.statusMessage);
    try {
      const parsed = JSON.parse(data);
      if (res.statusCode === 200) {
        const text = parsed?.choices?.[0]?.message?.content;
        console.log("AI Response :", text?.trim());
        console.log("\n✅ RESULT: Groq API key is VALID and WORKING!\n");
        console.log("✅ Model used : meta-llama/llama-4-scout-17b-16e-instruct");
        console.log("✅ Vision model available for marksheet analysis\n");
      } else {
        const errMsg = parsed?.error?.message || data;
        console.log("API Error   :", errMsg);
        console.log("\n❌ RESULT: Groq API key has an issue.\n");
      }
    } catch (e) {
      console.log("Raw response:", data.substring(0, 400));
    }
  });
});

req.on("error", (e) => {
  console.error("Network error:", e.message);
});

req.write(payload);
req.end();
