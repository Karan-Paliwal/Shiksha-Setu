const fs = require('fs');
const file = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/career/CareerHome.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/className="([^"]+)"\s*style={{ maxHeight: '800px' }}/g, 'className="$1 ch-left-column"');
c = c.replace(/className="([^"]+)"\s*style={{ height: '8px' }}/g, 'className="$1 ch-progress-bg"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '65%' }}/g, 'className="$1 ch-w-65"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.8rem' }}/g, 'className="$1 ch-text-xs"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '40px', height: '40px' }}/g, 'className="$1 ch-icon-sm"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.85rem' }}/g, 'className="$1 ch-text-sm"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.75rem' }}/g, 'className="$1 ch-time-text"');
c = c.replace(/className="([^"]+)"\s*style={{ minHeight: '800px' }}/g, 'className="$1 ch-right-column"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.9rem' }}/g, 'className="$1 ch-text-base"');
c = c.replace(/className="([^"]+)"\s*style={{ width:'32px', height:'32px' }}/g, 'className="$1 ch-btn-icon"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '210mm', minHeight: '297mm', padding: '12mm 15mm', transformOrigin: 'top center', transform: 'scale\(0.85\)' }}/g, 'className="$1 ch-resume-doc"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '28pt', letterSpacing: '2px' }}/g, 'className="$1 ch-resume-title"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '11pt', letterSpacing: '1px' }}/g, 'className="$1 ch-resume-heading"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '10pt', lineHeight: '1.6' }}/g, 'className="$1 ch-resume-body"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '11pt' }}/g, 'className="$1 ch-resume-subhead"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '10pt' }}/g, 'className="$1 ch-resume-text"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '9pt' }}/g, 'className="$1 ch-resume-text-sm"');

if (!c.includes('CareerHome.css')) {
  c = c.replace(/import React[^;]*;/g, match => match + '\nimport "./CareerHome.css";');
}
fs.writeFileSync(file, c);
