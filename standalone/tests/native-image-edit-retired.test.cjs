const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),w=fs.readFileSync("standalone/worker.js","utf8"),h=fs.readFileSync("standalone/index.html","utf8");
test("Retired creative features have no native entry or executable generation route",()=>{
 for(const id of ["miniImageEdit","miniImageVideo","miniFrameVideo","videoMode","miniSticker","miniGif"])assert.doesNotMatch(h,new RegExp('id="'+id+'"'));
 assert.doesNotMatch(c,/videoToGif\(|stickerPng\(|inlineVideoJob\(|renderPaidVideo\(|BUILTIN_VIDEO_MODELS|imageId:reference/);
 assert.doesNotMatch(w,/submitHordeImageEdit|QWEN_EDIT_HOST|source_processing:"img2img"|fvCreate\(|fvRetry\(|fvStatus\(|automaticVideoRequest\(|createVideo\(|queryVideo\(/);
 assert.match(w,/mode!=="image"\|\|b\.format\|\|b\.imageId/);
 assert.match(w,/job\.charged_day==="image-edit-free"\|\|job\.charged_day==="video-free"\|\|job\.message_model==="贴纸"/);
 assert.match(w,/retired:true/);
 assert.match(w,/await submitKrea\(mediaReq,env,user\)/);
 assert.match(w,/function fvMedia\(/);
 assert.match(c,/function restoreDeviceMedia\(/);
 assert.doesNotThrow(()=>new Function(c));
 assert.doesNotThrow(()=>new Function(w.replace(/^export default\s*\{/m,"const workerEntry = {")));
});
test("Text image and vision stay available; retired generation requests cannot be submitted",()=>{
 const helper=c.slice(c.indexOf("function requestedMediaFormat("),c.indexOf("// Distinguish a pasted visual prompt"));
 const router=c.slice(c.indexOf("function isReferenceImageEditRequest("),c.indexOf("async function sendMessage("));
 const f=new Function("imagePromptDiscussion","pastedImagePrompt","isDirectImageRequest",helper+"\n"+router+";return resolveChatTurn")(()=>false,()=>false,p=>p==="画一张图");
 const input={mode:"text",provider:"free",code:false,continueFrom:null,attachments:[]};
 assert.equal(f({...input,prompt:"画一张图"}).mode,"image");
 assert.equal(f({...input,attachments:[{type:"image/jpeg"}],prompt:"分析这张图"}).mode,"text");
 assert.equal(f({...input,prompt:"如何制作视频"}).mode,"text");
 for(const prompt of ["生成视频","制作GIF","制作贴纸"])assert.match(f({...input,prompt}).error,/已下线/);
 assert.match(f({...input,attachments:[{type:"image/jpeg"}],prompt:"换背景"}).error,/已下线/);
});
test("Legacy authenticated API rejects media generation before any DB or provider call",async()=>{
 const f=new Function("requireUser","parseJSON","truncate","isDirectVideoRequest","requestedMediaFormat",w.slice(w.indexOf("async function mediaChat("),w.indexOf("const KREA="))+";return mediaChat")(()=>{},async b=>b,s=>s||"",()=>false,()=>false);
 for(const body of [{mode:"video",prompt:"p"},{mode:"image",format:"gif",prompt:"p"},{mode:"image",format:"sticker",prompt:"p"},{mode:"image",imageId:"a",prompt:"p"}])await assert.rejects(()=>f(body,{},{}),e=>e.status===410);
});