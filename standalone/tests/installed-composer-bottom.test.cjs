const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('standalone/client.js','utf8'),css=fs.readFileSync('standalone/style.css','utf8');
const metrics=new Function(js.slice(js.indexOf('function installedViewportMetrics('),js.indexOf('function syncMobileHeight(){'))+'return installedViewportMetrics')();
test('installed viewport uses the largest reported layout height and preserves keyboard ownership',()=>{
 assert.deepEqual(metrics(876,920,876,0,956),{height:956,missing:0});
 assert.deepEqual(metrics(956,956,956,0,956),{height:956,missing:0});
 assert.deepEqual(metrics(880,880,840,40,956),{height:956,missing:0});
 assert.deepEqual(metrics(800,800,800,0,2000),{height:800,missing:0});
 assert.deepEqual(metrics(800,800,800,0,950),{height:800,missing:0});
 assert.match(css,/html:has\(body\.rainbow-enabled\.home-ambient\)/);
 assert.match(css,/aigzt-ios-pwa\.aigzt-keyboard-visible \.composer-area\{padding-bottom:5px\}/);
 assert.doesNotThrow(()=>new Function(js));
});
const stable=new Function(js.slice(js.indexOf("function stableInstalledHeight("),js.indexOf("function syncMobileHeight(){"))+"return stableInstalledHeight")();
test("PWA idle height never shrinks from transient WebKit geometry and resets on orientation",()=>{assert.equal(stable(956,880,false),956);assert.equal(stable(880,956,false),956);assert.equal(stable(956,430,true),430);assert.equal(stable(0,880,false),880);assert.doesNotMatch(js,/installedViewportMetrics\(window\.innerHeight,root\.clientHeight/);assert.match(css,/html\.aigzt-ios-pwa,html\.aigzt-ios-pwa body\{height:var\(--aigzt-pwa-height,100dvh\)/);assert.match(css,/filter:none;transform:none;background:radial-gradient/);});
