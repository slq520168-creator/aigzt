const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),w=fs.readFileSync("standalone/worker.js","utf8"),h=fs.readFileSync("standalone/index.html","utf8");
test("Removed media generation stays inaccessible without blocking normal chat",()=>{
 for(const id of ["miniImageEdit","miniImageVideo","miniFrameVideo","videoMode","miniSticker","miniGif"])assert.doesNotMatch(h,new RegExp('id="'+id+'"'));
 assert.doesNotMatch(w,/submitHordeImageEdit|QWEN_EDIT_HOST|source_processing:"img2img"|fvCreate\(|fvRetry\(|fvStatus\(|automaticVideoRequest\(|createVideo\(|queryVideo\(|已下线/);
 assert.match(w,/mode!=="image"\|\|b\.format\|\|b\.imageId/);
 assert.match(w,/job\.charged_day==="image-edit-free"\|\|job\.charged_day==="video-free"\|\|job\.message_model==="贴纸"/);
 assert.match(w,/retired:true/);assert.match(w,/await submitKrea\(mediaReq,env,user\)/);assert.match(w,/function fvMedia\(/);assert.match(c,/function restoreDeviceMedia\(/);
 assert.doesNotThrow(()=>new Function(c));assert.doesNotThrow(()=>new Function(w.replace(/^export default\s*\{/m,"const workerEntry = {")));
});
test("Automatic chat detects real prompts, not requests to write or analyze prompts",()=>{
 const helper=c.slice(c.indexOf("function imagePromptLabel("),c.indexOf("function renderAssistantText("));
 const router=c.slice(c.indexOf("function resolveChatTurn("),c.indexOf("async function sendMessage("));
 const f=new Function(helper+"\n"+router+";return resolveChatTurn")();
 const input={mode:"text",provider:"free",code:false,continueFrom:null,attachments:[]};
 for(const [prompt,mode,attach] of [["一位年轻女性，黑色长发，白色连衣裙，海边夕阳，真实摄影，高清画质","image"],["图片提示词：一只白猫","image"],["English prompt: a woman, soft lighting, portrait, realistic photography","image"],["真实摄影，一名女性，黑发，雨夜街道，衣服上有贴纸图案","image"],["生成视频","text"],["制作GIF","text"],["制作贴纸","text"],["写一个图片提示词","text"],["分析这张图片","text",true],["参考这张图换背景","text",true],["你好","text"]])assert.equal(f({...input,prompt,attachments:attach?[{type:"image/jpeg"}]:[]}).mode,mode,prompt);
});
test("Legacy generation request is rejected before any provider call",async()=>{
 const f=new Function("requireUser","parseJSON","truncate",w.slice(w.indexOf("async function mediaChat("),w.indexOf("const KREA="))+";return mediaChat")(()=>{},async b=>b,s=>s||"");
 for(const body of [{mode:"video",prompt:"p"},{mode:"image",format:"gif",prompt:"p"},{mode:"image",format:"sticker",prompt:"p"},{mode:"image",imageId:"a",prompt:"p"}])await assert.rejects(()=>f(body,{},{}),e=>e.status===410);
});