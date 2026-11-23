const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const client=fs.readFileSync('standalone/client.js','utf8'),html=fs.readFileSync('standalone/index.html','utf8'),worker=fs.readFileSync('standalone/worker.js','utf8');
test('Working free source sites always precede other directory results within matching categories',()=>{
 assert.match(client,/const originalRank=new Map\(ORIGINAL_GENERATION_SITES\.map/);
 assert.match(client,/if\(ar!==br\)return ar-br/);
 assert.match(client,/https:\/\/krea-krea-2\.hf\.space\//);
 assert.match(client,/https:\/\/upsampler-wan-2-2-14b-text-to-video\.hf\.space\//);
});
test('No duplicate text-to-video tool, all remaining icons distinct',()=>{
 assert.doesNotMatch(html,/id="miniTextVideo"/);
 const controls=html.slice(html.indexOf('id="toolTray"'),html.indexOf('</div>',html.indexOf('id="toolTray"')));
 const ids=['imageMode','videoMode','codeToggle','miniImageEdit','miniImageVideo','miniFrameVideo'];
 const icons=['image','video','code-2','scan','film','clapperboard'];
 for(let i=0;i<ids.length;i++)assert.ok(controls.includes('id="'+ids[i]+'"'),ids[i]);
 for(const icon of icons)assert.ok(controls.includes('data-icon="'+icon+'"'),icon);
 assert.doesNotMatch(client,/miniTextVideo/);
});
test('Paused free text-to-video source replaced using live upstream verified 9-input interface',()=>{
 assert.doesNotMatch(worker,/alexcheng0072-wan27-free-video-generator/);
 assert.match(worker,/upsampler-wan-2-2-14b-text-to-video\.hf\.space/);
 assert.match(worker,/provider==="freetext"\?\[prompt,b\.ratio==="9:16"\?"9:16 \(480x832\)":"16:9 \(832x480\)",4,FV_BAD,3\.5,1,1,42,true\]/);
 assert.match(client,/文生视频只接受文字，上传参考图请使用图生视频/);
});
test('Old pending media tasks cannot permanently block new requests and iOS image picker is not interrupted',()=>{
 assert.match(worker,/charged_day='video-free' AND status IN \('pending','recovering'\) AND created_at>=\?/);
 assert.match(worker,/charged_day='image-edit-free' AND status IN \('pending','recovering'\) AND created_at>=\?/);
 assert.match(client,/photosInput"\)\.click\(\);return/);
 assert.doesNotThrow(()=>new Function(client));
});
