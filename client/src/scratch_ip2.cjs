const fs = require('fs');
const file = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/interview/InterviewPrepHome.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/className="([^"]+)"([\s\S]*?)style={{ resize: 'none' }}/g, 'className="$1 ip-textarea"$2');
fs.writeFileSync(file, c);
