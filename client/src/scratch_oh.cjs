const fs = require('fs');
const filePath = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/opportunities/OpportunitiesHome.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace styles and add classes
content = content.replace(/className="([^"]+)"\s*style={{ width: '48px', height: '48px' }}/g, 'className="$1 oh-icon-md"');
content = content.replace(/className="([^"]+)"\s*style={{ fontSize: '0.85rem' }}/g, 'className="$1 oh-text-sm"');
content = content.replace(/className="([^"]+)"\s*style={{ fontSize: '10rem', left: '-20px', top: '-10px' }}/g, 'className="$1 oh-hero-icon"');
content = content.replace(/className="([^"]+)"\s*style={{ width: '60px', height: '60px' }}/g, 'className="$1 oh-icon-lg"');
content = content.replace(/className="([^"]+)"\s*style={{ fontSize: '0.9rem' }}/g, 'className="$1 oh-text-base"');
content = content.replace(/className="([^"]+)"\s*style={{ fontSize: '0.75rem' }}/g, 'className="$1 oh-text-xs"');
content = content.replace(/className="([^"]+)"\s*style={{fontSize:'0.8rem'}}/g, 'className="$1 oh-text-xs-alt"');
content = content.replace(/className="([^"]+)"\s*style={{ height: '6px', background: 'rgba\(255,255,255,0.2\)' }}/g, 'className="$1 oh-progress-bg"');
content = content.replace(/className="([^"]+)"\s*style={{ width: '65%' }}/g, 'className="$1 oh-w-65"');
content = content.replace(/className="([^"]+)"\s*style={{ fontSize: '0.7rem' }}/g, 'className="$1 oh-text-xxs"');
content = content.replace(/className="([^"]+)"\s*style={{width:'50px', height:'50px'}}/g, 'className="$1 oh-icon-md-alt"');

if (!content.includes('OpportunitiesHome.css')) {
  content = content.replace(/import React[^;]*;/g, match => match + '\nimport "./OpportunitiesHome.css";');
}
fs.writeFileSync(filePath, content);
