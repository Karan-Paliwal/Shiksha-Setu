const fs = require('fs');
const file = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/Onboarding.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/className=\{`([^`]+)`\}\s*style={{ width: '40px', height: '6px' }}/g, 'className={`$1 ob-progress-step`}');
fs.writeFileSync(file, c);
