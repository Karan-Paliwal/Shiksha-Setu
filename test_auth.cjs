const http = require('http');

function request(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body });
      });
    });

    req.on('error', error => reject(error));
    req.write(data);
    req.end();
  });
}

async function testAuth() {
  try {
    console.log("Testing Signup...");
    const signupRes = await request('/api/auth/signup', {
      name: "Test User",
      email: "test_script@test.com",
      password: "password123"
    });
    console.log("Signup Response:", signupRes.statusCode, signupRes.body);

    console.log("\nTesting Login...");
    const loginRes = await request('/api/auth/login', {
      email: "test_script@test.com",
      password: "password123"
    });
    console.log("Login Response:", loginRes.statusCode, loginRes.body);
  } catch (err) {
    console.error("Error:", err);
  }
}

testAuth();
