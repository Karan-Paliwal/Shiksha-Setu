const fs = require('fs');
const filePath = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/profile/ProfileHome.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace styles and add classes
content = content.replace(/className="([^"]+)"\s*style={{ width: '80px', height: '80px' }}/g, 'className="$1 ph-profile-pic"');
content = content.replace(/className="([^"]+)"\s*style={{ fontSize: '0.75rem' }}/g, 'className="$1 ph-text-xs"');
content = content.replace(/className="([^"]+)"\s*style={{ height: '10px' }}/g, 'className="$1 ph-progress-container"');
content = content.replace(/className="([^"]+)"\s*style={{ width: `\$\{progress\}%`, transitionDuration: '1s' }}/g, 'className="$1 ph-progress-bar" style={{ width: `${progress}%` }}');
content = content.replace(/className="([^"]+)"\s*style={{ fontSize: '0.85rem' }}/g, 'className="$1 ph-text-sm"');
content = content.replace(/className="([^"]+)"\s*style={{ width: '35px', height: '35px' }}/g, 'className="$1 ph-icon-wrapper"');
content = content.replace(/className="([^"]+)"\s*style={{ fontSize: '0.7rem' }}/g, 'className="$1 ph-text-xxs"');

if (!content.includes('ProfileHome.css')) {
  content = content.replace(/import React[^;]*;/g, match => match + '\nimport "./ProfileHome.css";');
}
fs.writeFileSync(filePath, content);
