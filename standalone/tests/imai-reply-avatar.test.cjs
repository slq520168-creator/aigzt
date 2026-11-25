const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('standalone/client.js','utf8'),css=fs.readFileSync('standalone/style.css','utf8');
test('IMAI reply avatar uses the same brand asset and preserves response state',()=>{
 assert.match(js,/image\.src="\/app-icon-192\.png\?v=57"/);
 assert.match(js,/function setPortraitState\(row,state\)/);
 for(const state of ['idle','thinking','creating','speaking','finished','error'])assert.ok(css.includes('data-state="'+state+'"'));
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.doesNotThrow(()=>new Function(js));
});