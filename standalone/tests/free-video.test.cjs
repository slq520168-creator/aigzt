const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const base='standalone/';const read=x=>fs.readFileSync(base+x,'utf8');
test('Free video is default in original GZT input UI',()=>{const app=read('client.js'),html=read('index.html');assert.match(app,/videoProvider:"freetext"/);assert.match(app,/freetext:\["wan2\.2-ti2v"\]/);assert.match(app,/freewan:\["wan2\.2-i2v-fast"\]/);assert.match(app,/freeloop:\["wan2\.2-firstlast"\]/);assert.match(html,/data-video-provider="freetext"/);assert.match(html,/data-video-provider="freewan"/);assert.match(html,/data-video-provider="freeloop"/);assert.match(html,/id="videoImageInput"/)});
test('Free route never asks for paid authorization, and preserves optional BYOK providers',()=>{const app=read('client.js'),worker=read('worker.js');assert.match(worker,/if\(Object\.hasOwn\(FREE_VIDEO,provider\)\)return fvCreate/);assert.match(worker,/if\(Object\.hasOwn\(FREE_VIDEO,provider\)\)return fvStatus/);for(const p of ['grok','runway','luma','vidu'])assert.match(worker,new RegExp(p+':'));assert.match(app,/if\(!free&&\!videoKeyPermitted\(provider\)\)/);assert.match(app,/if\(!free&&\!\$\("confirmVideo"\)\.checked\)/)});
test('Result media has authenticated route, verified MP4 bytes, bounded requests and no infinite polling',()=>{const worker=read('worker.js');assert.match(worker,/\/api\/video\/media\//);assert.match(worker,/freeVideoFile/);assert.match(worker,/fvMedia\(req,env,user/);assert.match(worker,/12000000/);assert.match(worker,/readVideoMedia|fvMedia/);assert.match(worker,/charged_day='video-free'/);assert.match(worker,/checked_at<\?/);assert.doesNotMatch(worker,/setInterval\(.*fvPoll/)});

test('GZT chat input sends site free-video jobs without opening a paid popup',()=>{
 const js=read('client.js'),worker=read('worker.js');
 assert.match(js,/const freeVideo=submittedMode==="video"/);
 assert.match(js,/result=await api\("\/api\/chat\/media",\{chatId:S\.chatId,projectId:S\.activeProjectId,mode:"video"/);
 assert.match(js,/inlineVideoJob\(bubble,videoPending\[1\]\)/);
 assert.match(js,/inlineVideo\(bubble,videoDone\[1\]\)/);
 assert.match(js,/video\.src=url/);
 assert.match(worker,/if\(mode==="video"&&Object\.hasOwn\(FREE_VIDEO,String\(b\.provider\|\|""\)\)\)/);
 assert.match(worker,/UPDATE image_jobs SET chat_id=\?,message_id=\?/);
 assert.match(worker,/UPDATE messages SET body=\?/);
 assert.match(worker,/charged_day='video-free'/);
});
test('All site free models remain separate from user BYOK models',()=>{
 const app=read('client.js'),backend=read('worker.js');
 assert.match(app,/freetext:\["wan2\.2-ti2v"\]/);
 assert.match(app,/freewan:\["wan2\.2-i2v-fast"\]/);
 assert.match(app,/freeloop:\["wan2\.2-firstlast"\]/);
 for(const provider of ['grok','runway','luma','vidu'])assert.match(backend,new RegExp(provider+':'));
 assert.match(backend,/if\(Object\.hasOwn\(FREE_VIDEO,provider\)\)return fvCreate/);
});

test('Default free text-video source also accepts an uploaded source image',()=>{const client=read('client.js'),server=read('worker.js');assert.match(client,/imageId:img\?\.id/);assert.match(server,/if\(b\.imageId\)/);assert.match(server,/provider==="freetext"\?\[file,prompt/);});
