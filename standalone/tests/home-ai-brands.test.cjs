const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('standalone/index.html','utf8'),css=fs.readFileSync('standalone/style.css','utf8'),js=fs.readFileSync('standalone/client.js','utf8');
test('eight local accessible brand buttons above composer, no external images',()=>{
 const start=html.indexOf('id="homeAiBrands"'),end=html.indexOf('</div>',start),grid=html.slice(start,end);
 assert.equal([...grid.matchAll(/<svg\b/g)].length,8);
 assert.equal([...grid.matchAll(/<button type="button" class="home-ai-brand"/g)].length,8);
 assert.doesNotMatch(grid,/<(?:a|img|script)\b|\bonclick=/);
 assert.ok(start<html.indexOf('id="chatForm"'));
});
test('home grid is raised and only visible on unfocused empty chat',()=>{
 assert.match(css,/\.home-ai-brands\{display:none;grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
 assert.match(css,/margin:0 auto clamp\(72px,18dvh,150px\)/);
 assert.match(css,/\.conversation\.empty-chat:not\(\[hidden\]\)~\.composer-area \.home-ai-brands\{display:grid\}/);
 assert.match(css,/html\.aigzt-keyboard-visible[^\n]+:has\(#prompt:focus\)[^\n]+\{display:none\}/);
 assert.match(css,/\.home-ai-brand:active\{transform:scale\(\.88\)/);
});
test('brand shortcuts choose existing binding or filtered catalog without selecting a model',()=>{
 const code=js.slice(js.indexOf('const HOME_BRAND_ROUTES='),js.indexOf('function openModels(){'));
 const calls=[],S={user:{id:'1'}},connectedProviders=new Set();
 const run=new Function('S','connected','show','openKeyPanel','$',code+';return openHomeBrand;')(S,p=>connectedProviders.has(p),id=>calls.push(id),p=>calls.push('bind:'+p),()=>({}));
 run('openai');run('metaai-color');run('kimi-color');
 assert.deepEqual(calls,['bind:openai','bind:openrouter','bind:kimi']);
 assert.doesNotMatch(code.slice(code.indexOf('function openHomeBrand(')),/S\.model\s*=|S\.provider\s*=/);
 assert.match(js,/llama:\/\\bllama\\b\|meta-llama\//);
 assert.doesNotThrow(()=>new Function(js));
});
