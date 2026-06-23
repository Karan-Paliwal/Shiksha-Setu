const fs = require('fs');
const file = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/Dashboard.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '4rem', marginRight: '-10px', marginTop: '-10px' }}/g, 'className="$1 db-icon-bg"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.75rem', letterSpacing: '1px' }}/g, 'className="$1 db-text-xs-spacing"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.75rem' }}/g, 'className="$1 db-text-xs"');
c = c.replace(/className="([^"]+)"\s*style={{ height: '6px' }}/g, 'className="$1 db-progress-bg"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '80px', height: '80px' }}/g, 'className="$1 db-chart-container"');
c = c.replace(/className="([^"]+)"\s*style={{ transform: 'rotate\(-90deg\)' }}/g, 'className="$1 db-chart-svg"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.8rem' }}/g, 'className="$1 db-text-xs-alt"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.85rem' }}/g, 'className="$1 db-text-sm"');
c = c.replace(/className="([^"]+)"\s*style={{ height: '300px' }}/g, 'className="$1 db-chart-area-container"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '30px', left: 0, fontSize: '0.8rem', paddingBottom: '30px' }}/g, 'className="$1 db-chart-y-axis"');
c = c.replace(/className="([^"]+)"\s*style={{ left: '40px', right: '20px', bottom: '30px' }}/g, 'className="$1 db-chart-main-area"');
c = c.replace(/className="([^"]+)"\s*style={{ top: '33.33%', borderColor: 'rgba\(0,0,0,0.05\)' }}/g, 'className="$1 db-chart-grid-1"');
c = c.replace(/className="([^"]+)"\s*style={{ top: '66.66%', borderColor: 'rgba\(0,0,0,0.05\)' }}/g, 'className="$1 db-chart-grid-2"');
c = c.replace(/className="([^"]+)"\s*style={{ bottom: '-30px', fontSize: '0.8rem', paddingLeft: '0', paddingRight: '0' }}/g, 'className="$1 db-chart-x-axis"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '40px', height: '40px' }}/g, 'className="$1 db-icon-sm"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.7rem', letterSpacing: '1px' }}/g, 'className="$1 db-text-xxs-spacing"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.9rem' }}/g, 'className="$1 db-text-base"');

if (!c.includes('Dashboard.css')) {
  c = c.replace(/import React[^;]*;/g, match => match + '\nimport "./Dashboard.css";');
}
fs.writeFileSync(file, c);
