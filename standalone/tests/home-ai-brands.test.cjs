const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('standalone/index.html','utf8'),css=fs.readFileSync('standalone/style.css','utf8');
test('home brand grid has exactly eight local passive SVGs before the chat form',()=>{
 const start=html.indexOf('id="homeAiBrands"'),end=html.indexOf('</div>',start),grid=html.slice(start,end);
 assert.equal([...grid.matchAll(/<svg\b/g)].length,8);
 assert.equal([...grid.matchAll(/class="home-ai-brand"/g)].length,8);
 assert.doesNotMatch(grid,/<(?:a|button|img|script)\b|\bonclick=|\btabindex=/);
 assert.ok(start<html.indexOf('id="chatForm"'));
});
test('home grid shows four columns, only on the empty chat; focus and keyboard hide it',()=>{
 assert.match(css,/\.home-ai-brands\{display:none;grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
 assert.match(css,/\.conversation\.empty-chat:not\(\[hidden\]\)~\.composer-area \.home-ai-brands\{display:grid\}/);
 assert.match(css,/html\.aigzt-keyboard-visible[^\n]+:has\(#prompt:focus\)[^\n]+\{display:none\}/);
 assert.match(css,/\.home-ai-brand\{[^}]*width:42px;height:42px/);
 assert.match(css,/\.home-ai-brands\{[^}]*pointer-events:none/);
});
