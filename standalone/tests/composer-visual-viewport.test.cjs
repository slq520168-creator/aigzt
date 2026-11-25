const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('standalone/client.js','utf8'),css=fs.readFileSync('standalone/style.css','utf8');
const metrics=new Function(js.slice(js.indexOf('function composerViewportMetrics('),js.indexOf('function syncMobileHeight(){'))+'return composerViewportMetrics')();
test('visual viewport pan, resize, and keyboard dismissal are handled independently of innerHeight',()=>{
 assert.deepEqual(metrics(440,300,850,true,false),{keyboardVisible:true,height:440,top:300});
 assert.equal(metrics(440,120,850,false,true).keyboardVisible,true);
 assert.equal(metrics(850,0,850,false,true).keyboardVisible,false);
 assert.equal(metrics(850,0,850,true,false).keyboardVisible,false);
 assert.ok(js.includes('visualViewport.addEventListener("scroll",syncMobileHeight'));
 assert.ok(css.includes('top:var(--aigzt-visible-top,0px)'));
 assert.doesNotThrow(()=>new Function(js));
});