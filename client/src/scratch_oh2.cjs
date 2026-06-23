const fs = require('fs');
const file = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/opportunities/OpportunitiesHome.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/className="([^"]+)" style={{fontSize:'0.85rem'}}/g, 'className="$1 oh-text-sm"');
fs.writeFileSync(file, c);
