const fs = require('fs');
const file = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/components/Sidebar.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/className="([^"]+)"\s*style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}/g, 'className="$1 sb-logo-img"');
c = c.replace(/className=\{`([^`]+)`\}\s*style=\{\{ fontSize: '1.2rem', letterSpacing: '0.5px' \}\}/g, 'className={`$1 sb-brand-text`}');

if (!c.includes('Sidebar.css')) {
  c = c.replace(/import React[^;]*;/g, match => match + '\nimport "./Sidebar.css";');
}
fs.writeFileSync(file, c);
