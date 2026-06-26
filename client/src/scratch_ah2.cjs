const fs = require('fs');
const file = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/ai/AIHome.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/className=\{`([^`]+)`\}\s*style=\{\{ maxWidth: '85%' \}\}/g, 'className={`$1 ai-max-w-85`}');
c = c.replace(/role="status" style=\{\{ animationDelay: '0.2s' \}\}/g, 'role="status" className="ai-delay-1"');
c = c.replace(/role="status" style=\{\{ animationDelay: '0.4s' \}\}/g, 'role="status" className="ai-delay-2"');
c = c.replace(/className="form-control border-0 bg-transparent shadow-none px-3" \s*placeholder="Ask a doubt or paste a math problem..." \s*style=\{\{ fontSize: '0.95rem' \}\}/g, 'className="form-control border-0 bg-transparent shadow-none px-3 ai-text-md" placeholder="Ask a doubt or paste a math problem..."');
c = c.replace(/className=\{`([^`]+)`\}\s*style=\{\{ width: '40px', height: '40px' \}\}/g, 'className={`$1 ai-icon-sm`}');

fs.writeFileSync(file, c);
