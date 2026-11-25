const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('standalone/client.js','utf8'),css=fs.readFileSync('standalone/style.css','utf8');
const metrics=new Function(js.slice(js.indexOf('function installedViewportMetrics('),js.indexOf('function syncMobileHeight(){'))+'return installedViewportMetrics')();
test('installed viewport uses the largest reported layout height and preserves keyboard ownership',()=>{
 assert.deepEqual(metrics(876,920,876,0,956),{height:920,missing:36});
 assert.deepEqual(metrics(956,956,956,0,956),{height:956,missing:0});
 assert.deepEqual(metrics(880,880,840,40,956),{height:880,missing:76});
 assert.deepEqual(metrics(800,800,800,0,2000),{height:800,missing:0});
 assert.match(css,/aigzt-ios-pwa\.aigzt-keyboard-visible \.composer-area\{padding-bottom:5px\}/);
 assert.doesNotThrow(()=>new Function(js));
});