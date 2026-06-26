const fs = require('fs');
const file = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/Landing.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.85rem' }}/g, 'className="$1 lp-badge-text"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, color: '#111827' }}/g, 'className="$1 lp-hero-title"');
c = c.replace(/className="([^"]+)"\s*style={{ maxWidth: '700px', lineHeight: 1.6 }}/g, 'className="$1 lp-hero-subtitle"');
c = c.replace(/className="([^"]+)"\s*style={{ maxWidth: '1000px', marginTop: '40px' }}/g, 'className="$1 lp-mockup-container"');
c = c.replace(/className="([^"]+)"\s*style={{ top: '-40px', left: '-20px', backdropFilter: 'blur\(10px\)', border: '1px solid rgba\(255,255,255,0.5\)', zIndex: 10 }}/g, 'className="$1 lp-floating-card"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.65rem', letterSpacing: '1px' }}/g, 'className="$1 lp-card-eyebrow"');
c = c.replace(/className="([^"]+)"\s*style={{ height: '300px', background: 'linear-gradient\(180deg, #1e293b 0%, #0f172a 100%\)' }}/g, 'className="$1 lp-mockup-window"');
c = c.replace(/className="([^"]+)"\s*style={{width:'12px', height:'12px'}}/g, 'className="$1 lp-window-btn"');
c = c.replace(/className="([^"]+)"\s*style={{ height: '200px' }}/g, 'className="$1 lp-mockup-content"');

if (!c.includes('Landing.css')) {
  c = c.replace(/import React[^;]*;/g, match => match + '\nimport "./Landing.css";');
}
fs.writeFileSync(file, c);
