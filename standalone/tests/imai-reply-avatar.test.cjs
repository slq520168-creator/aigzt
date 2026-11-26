const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('standalone/client.js','utf8'),css=fs.readFileSync('standalone/style.css','utf8');
test('IMAI reply uses one local SVG head and no image-generation or atlas request',()=>{
 const code=js.slice(js.indexOf('let aiPortraitSerial=0;'),js.indexOf('function setPortraitState(row,state){'));
 const node=()=>({dataset:{},setAttribute(){}});
 const portrait=new Function('node',code+';return makeAssistantPortrait();')(node);
 assert.match(portrait.innerHTML,/<svg viewBox="0 0 64 64"/);
 assert.equal((portrait.innerHTML.match(/<svg /g)||[]).length,1);
 assert.doesNotMatch(code,/fetch\(|api\(|\.src=|robot-atlas/);
 assert.match(js,/function setPortraitState\(row,state\)/);
 for(const state of ['idle','thinking','creating','speaking','finished','error'])assert.ok(css.includes('data-state="'+state+'"'));
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.doesNotThrow(()=>new Function(js));
});
test('image viewer excludes robot and decoration; accepts chat images and other media',()=>{
 const code=js.slice(js.indexOf('function isPreviewableImage('),js.indexOf('function ivOpen('));
 const allow=new Function(code+';return isPreviewableImage;')();
 const image=(type,chat=true)=>({src:'blob:local',getClientRects:()=>[{}],closest:s=>s.includes('.avatar-ai')?(type==='robot'||type==='logo'?{}:null):chat?{}:null,matches:s=>type==='generated'||type==='uploaded'});
 assert.equal(allow(image('robot')),false);assert.equal(allow(image('logo')),false);
 assert.equal(allow(image('other')),false);assert.equal(allow(image('generated')),true);
 assert.equal(allow(image('uploaded')),true);assert.equal(allow(image('other',false)),true);
 assert.match(js,/filter\(isPreviewableImage\)/);
 assert.match(js,/function ivOpen\(img\)\{\s*if\(!isPreviewableImage\(img\)\)return/);
});
