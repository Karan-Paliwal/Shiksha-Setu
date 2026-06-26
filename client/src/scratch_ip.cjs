const fs = require('fs');
const file = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/interview/InterviewPrepHome.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '2rem' }}/g, 'className="$1 ip-title"');
c = c.replace(/className="([^"]+)"\s*style={{ maxWidth: '500px' }}/g, 'className="$1 ip-subtitle"');
c = c.replace(/className="([^"]+)"\s*style={{ backgroundColor: '#f8fafc' }}/g, 'className="$1 ip-bg-light"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '40px', height: '40px' }}/g, 'className="$1 ip-icon-sm"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.9rem' }}/g, 'className="$1 ip-text-base"');
c = c.replace(/className="([^"]+)"\s*style={{width: '120px'}}/g, 'className="$1 ip-select"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.9rem', lineHeight: '1.6' }}/g, 'className="$1 ip-text-body"');
c = c.replace(/className="([^"]+)"\s*style={{ backgroundColor: '#1e1e1e' }}/g, 'className="$1 ip-editor-header"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.85rem' }}/g, 'className="$1 ip-text-sm"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.9rem', color: '#d4d4d4', backgroundColor: '#1e1e1e', minHeight: '300px' }}/g, 'className="$1 ip-editor-body"');

// Special cases for spans without classNames
c = c.replace(/<span style={{color: '#c586c0'}}>/g, '<span className="ip-code-keyword">');
c = c.replace(/<span style={{color: '#dcdcaa'}}>/g, '<span className="ip-code-function">');
c = c.replace(/<span style={{color: '#9cdcfe'}}>/g, '<span className="ip-code-var">');
c = c.replace(/<span style={{color: '#569cd6'}}>/g, '<span className="ip-code-bool">');

c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.8rem' }}/g, 'className="$1 ip-text-xs"');
c = c.replace(/className="([^"]+)"\s*style={{ scrollSnapType: 'x mandatory' }}/g, 'className="$1 ip-scroll-container"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '320px', scrollSnapAlign: 'start' }}/g, 'className="$1 ip-scroll-item"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '45px', height: '45px' }}/g, 'className="$1 ip-avatar-md"');
c = c.replace(/className="([^"]+)"\s*style={{ resize: 'none' }}/g, 'className="$1 ip-textarea"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.7rem' }}/g, 'className="$1 ip-badge-text"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.75rem' }}/g, 'className="$1 ip-time-text"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.95rem', lineHeight: '1.6' }}/g, 'className="$1 ip-comment-text"');
c = c.replace(/className="([^"]+)"\s*style={{ height: '6px' }}/g, 'className="$1 ip-progress-bg"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '95%' }}/g, 'className="$1 ip-w-95"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '82%' }}/g, 'className="$1 ip-w-82"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '88%' }}/g, 'className="$1 ip-w-88"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '65%' }}/g, 'className="$1 ip-w-65"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '10px', height: '10px', left: '-6px', top: '8px' }}/g, 'className="$1 ip-timeline-dot"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '60px', height: '60px' }}/g, 'className="$1 ip-avatar-lg"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '14px', height: '14px', bottom: '2px', right: '2px' }}/g, 'className="$1 ip-status-dot"');

if (!c.includes('InterviewPrepHome.css')) {
  c = c.replace(/import React[^;]*;/g, match => match + '\nimport "./InterviewPrepHome.css";');
}
fs.writeFileSync(file, c);
