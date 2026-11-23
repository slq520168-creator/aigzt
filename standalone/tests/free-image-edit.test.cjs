const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const client=fs.readFileSync('standalone/client.js','utf8'),worker=fs.readFileSync('standalone/worker.js','utf8');
test('Image-to-image routes uploaded reference directly to authenticated same-chat job',()=>{
 assert.match(client,/async function optimizeImageReference\(file\)/);
 assert.match(client,/imageId:reference\?\.id/);
 assert.match(worker,/async function submitHordeImageEdit\(/);
 assert.match(worker,/source_processing:"img2img"/);
 assert.match(worker,/source_image:hordeBase64\(bytes\)/);
 assert.match(worker,/imgId\?await submitHordeImageEdit/);
 assert.match(worker,/\[文件：参考图\]/);
});
test('No new daily image-to-image credits; one active task and bounded status polling',()=>{
 const start=worker.indexOf("async function submitHordeImageEdit("),end=worker.indexOf("async function hordeStatus(",start);
 const h=worker.slice(start,end);
 assert.doesNotMatch(h,/COUNT\(\*\)|daily|每日|>=2/);
 assert.match(h,/status IN \('pending','recovering'\)/);
 assert.match(worker,/now-Number\(job\.checked_at\|\|0\)<15000/);
 assert.match(worker,/ref\.v===7&&ref\.p==="horde"/);
 assert.match(worker,/temporary:true/);
});
test('Text-to-image provider and default model selection are untouched',()=>{
 assert.match(client,/if\(isImageMessage\)/);
 assert.match(worker,/imgId\?await submitHordeImageEdit\(env,user,imgId,prompt\):await submitKrea\(mediaReq,env,user\)/);
 assert.match(worker,/const IM_IMAGE_STAGES_FAST/);
 assert.doesNotThrow(()=>new Function(client));
});
