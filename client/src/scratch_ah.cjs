const fs = require('fs');
const file = 'c:/Users/khush/OneDrive/Desktop/ShikshaSetu/Shiksha-Setu/client/src/pages/ai/AIHome.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/className="([^"]+)"\s*style={{ paddingBottom: '2rem' }}/g, 'className="$1 ai-page-pb"');
c = c.replace(/className="([^"]+)"\s*style={{ minHeight: '850px' }}/g, 'className="$1 ai-chat-container"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.75rem', letterSpacing: '1px' }}/g, 'className="$1 ai-text-xs-spacing"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.9rem' }}/g, 'className="$1 ai-text-base"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.75rem' }}/g, 'className="$1 ai-text-xs"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.85rem' }}/g, 'className="$1 ai-text-sm"');
c = c.replace(/className="([^"]+)"\s*style={{ backgroundColor: '#fcfcfc' }}/g, 'className="$1 ai-chat-bg"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '80px', height: '80px' }}/g, 'className="$1 ai-icon-lg"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '2.5rem' }}/g, 'className="$1 ai-icon-text-lg"');
c = c.replace(/className="([^"]+)"\s*style={{ maxWidth: '400px' }}/g, 'className="$1 ai-max-w-400"');
c = c.replace(/className="([^"]+)"\s*style={{ maxWidth: '500px' }}/g, 'className="$1 ai-max-w-500"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.8rem', letterSpacing: '1px' }}/g, 'className="$1 ai-text-xs-alt-spacing"');
c = c.replace(/className="([^"]+)"\s*style={{ maxWidth: '85%' }}/g, 'className="$1 ai-max-w-85"');
c = c.replace(/className="([^"]+)"\s*style={{ lineHeight: '1.6', fontSize: '0.95rem' }}/g, 'className="$1 ai-text-md-lh"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.7rem' }}/g, 'className="$1 ai-text-xxs"');
c = c.replace(/className="([^"]+)"\s*style={{ animationDelay: '0.2s' }}/g, 'className="$1 ai-delay-1"');
c = c.replace(/className="([^"]+)"\s*style={{ animationDelay: '0.4s' }}/g, 'className="$1 ai-delay-2"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.95rem' }}/g, 'className="$1 ai-text-md"');
c = c.replace(/className="([^"]+)"\s*style={{ width: '40px', height: '40px' }}/g, 'className="$1 ai-icon-sm"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.65rem' }}/g, 'className="$1 ai-text-xxs-alt"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '3rem', lineHeight: '1', fontWeight: 800 }}/g, 'className="$1 ai-timer-text"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '0.8rem' }}/g, 'className="$1 ai-text-xs-alt"');
c = c.replace(/className="([^"]+)"\s*style={{ fontSize: '3rem' }}/g, 'className="$1 ai-icon-xl"');

if (!c.includes('AIHome.css')) {
  c = c.replace(/import React[^;]*;/g, match => match + '\nimport "./AIHome.css";');
}
fs.writeFileSync(file, c);
