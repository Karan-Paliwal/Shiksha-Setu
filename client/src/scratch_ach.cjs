const fs = require('fs');
const file = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/academics/AcademicsHome.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.8rem', letterSpacing: '1px' }}/g, 'className="$1 ah-text-xs-spacing"');
c = c.replace(/className="([^"]+)"\s*style={{ maxWidth: '150px' }}/g, 'className="$1 ah-max-w-150"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.75rem' }}/g, 'className="$1 ah-text-xs"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '12rem', right: '-20px', top: '-40px' }}/g, 'className="$1 ah-icon-xl"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.9rem' }}/g, 'className="$1 ah-text-base"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.8rem' }}/g, 'className="$1 ah-text-sm-alt"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '4px', height: '100%', left: '-24px' }}/g, 'className="$1 ah-timeline-line"');
// Special case without className=
c = c.replace(/<span style={{ fontSize: '0.85rem' }}>/g, '<span className="ah-text-sm">');

if (!c.includes('AcademicsHome.css')) {
  c = c.replace(/import React[^;]*;/g, match => match + '\nimport "./AcademicsHome.css";');
}
fs.writeFileSync(file, c);
