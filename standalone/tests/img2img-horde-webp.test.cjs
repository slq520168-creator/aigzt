const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const client=fs.readFileSync('standalone/client.js','utf8'),server=fs.readFileSync('standalone/worker.js','utf8');
const start=client.indexOf('async function optimizeImageReference('),end=client.indexOf('async function uploadSelected(',start),optimizer=client.slice(start,end);
test('Client converts JPEG/PNG/HEIC references into the WebP required by Horde',()=>{
 assert.match(optimizer,/canvas\.toBlob\(/);
 assert.match(optimizer,/blob\.type!=="image\/webp"/);
 assert.match(optimizer,/new File\(\[blob\]/);
 assert.match(optimizer,/type:"image\/webp"/);
 assert.match(optimizer,/if\(S\.composerMode!=="image"\)return file/);
 assert.match(optimizer,/if\(type==="image\/webp"&&file\.size<=1450000\)return file/);
 assert.match(optimizer,/bitmap=await createImageBitmap\(file\)/);
 assert.match(optimizer,/new Image\(\)/);
});
test('Server enforces WebP and does not send incompatible JPG/PNG bytes',()=>{
 assert.match(server,/mime!=="image\/webp"/);
 assert.match(server,/source_processing:"img2img",r2:true,nsfw:false/);
 assert.doesNotMatch(server,/source_processing:"img2img",r2:false,shared:false/);
});
test('Image-edit can never silently turn into text-only generation',()=>{
 assert.match(client,/S\.miniToolChoice==="image-edit"&&!S\.attachments\.length/);
 assert.match(client,/S\.miniToolChoice==="image-edit"&&S\.attachments\.length===1/);
 assert.match(client,/图生图一次仅允许一张参考图片/);
});
test('Original image generation and video paths remain unchanged',()=>{
 assert.match(server,/imgId\?await submitHordeImageEdit\(env,user,imgId,prompt\):await submitKrea\(mediaReq,env,user\)/);
 assert.match(server,/const KREA=/);
 assert.match(server,/const FREE_VIDEO=Object\.freeze/);
 assert.doesNotThrow(()=>new Function(client));
});
