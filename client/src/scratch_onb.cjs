const fs = require('fs');
const file = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/Onboarding.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/className="([^"]+)"\s*style={{ alignItems: 'flex-start', paddingTop: '5rem' }}/g, 'className="$1 ob-page-layout"');
c = c.replace(/className="([^"]+)"\s*style={{ maxWidth: '700px' }}/g, 'className="$1 ob-card-container"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '64px', height: '64px' }}/g, 'className="$1 ob-icon-wrapper"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '40px', height: '6px' }}/g, 'className="$1 ob-progress-step"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.85rem' }}/g, 'className="$1 ob-text-sm"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '120px' }}/g, 'className="$1 ob-day-select"');

if (!c.includes('Onboarding.css')) {
  c = c.replace(/import React[^;]*;/g, match => match + '\nimport "./Onboarding.css";');
}
fs.writeFileSync(file, c);
