const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const html=fs.readFileSync('standalone/index.html','utf8'),js=fs.readFileSync('standalone/client.js','utf8'),css=fs.readFileSync('standalone/style.css','utf8');
test('Small text actions appear after original three controls in same row',()=>{
 const start=html.indexOf('id="toolTray"'),end=html.indexOf('</div>',start),row=html.slice(start,end);
 const ids=['imageMode','videoMode','codeToggle','miniImageEdit','miniTextVideo','miniImageVideo','miniFrameVideo'];
 let last=-1;for(const id of ids){const pos=row.indexOf('id="'+id+'"');assert.ok(pos>last,id);last=pos}
 assert.match(css,/\.tool-tray\{[^\n]*flex-wrap:nowrap/);assert.match(css,/\.tool-tray \.mini-tool\{[^\n]*font-size:10px/);
});
test('Small tool labels select real existing creation modes',()=>{
 for(const id of ['miniImageEdit','miniTextVideo','miniImageVideo','miniFrameVideo'])assert.match(js,new RegExp('"'+id+'"'));
 assert.match(js,/function chooseMiniTool\(action\)/);assert.match(js,/selectVideoModel\(provider,VIDEO_OPTIONS\[provider\]\[0\]\)/);
 assert.match(js,/setComposerMode\("image"\)/);assert.match(js,/setComposerMode\("video"\)/);
 assert.doesNotThrow(()=>new Function(js));
});
test('Free directory contains upstream generation source website addresses',()=>{
 for(const host of ['krea-krea-2.hf.space','multimodalart-glm-image.hf.space','rioshiina-imagegen.hf.space','aihorde.net','alexcheng0072-wan27-free-video-generator.hf.space','zerogpu-aoti-wan2-2-fp8da-aoti-faster.hf.space'])assert.ok(js.includes(host),host);
 assert.match(js,/\.\.\.ORIGINAL_GENERATION_SITES/);
});
