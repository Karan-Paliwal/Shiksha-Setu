const fs = require('fs');
const filePath = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/resume/ResumeBuilderHome.tsx';
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/className="([^"]+)" style={{ width: '45px', height: '45px' }}/g, 'className="$1 rb-icon-wrapper"');
content = content.replace(/className="([^"]+)" style={{ fontSize: '0.85rem' }}/g, 'className="$1 rb-text-sm"');
if (!content.includes('ResumeBuilderHome.css')) {
  content = content.replace(/import React[^;]*;/g, match => match + '\nimport "./ResumeBuilderHome.css";');
}
fs.writeFileSync(filePath, content);
