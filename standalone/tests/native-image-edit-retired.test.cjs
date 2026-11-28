const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),w=fs.readFileSync("standalone/worker.js","utf8"),h=fs.readFileSync("standalone/index.html","utf8");
test("retire native image edit without retiring unrelated media",()=>{
 assert.doesNotMatch(h,/miniImageEdit/);
 assert.doesNotMatch(c,/miniImageEdit|imageId:reference/);
 assert.doesNotMatch(w,/submitHordeImageEdit|QWEN_EDIT_HOST|source_processing:"img2img"/);
 assert.match(w,/mode==="image"&&b\.imageId.*status:410/);
 assert.match(w,/job\.charged_day==="image-edit-free"/);
 assert.match(w,/retired:true/);
 assert.match(c,/miniImageVideo/);
 assert.match(c,/miniFrameVideo/);
 assert.match(w,/await submitKrea\(mediaReq,env,user\)/);
});
test("text image, vision and image-to-video remain independently routed",()=>{
 const f=new Function("imagePromptDiscussion","isDirectVideoRequest","requestedMediaFormat","pastedImagePrompt","isDirectImageRequest","VIDEO_OPTIONS",c.slice(c.indexOf("function isReferenceImageEditRequest("),c.indexOf("async function sendMessage("))+";return resolveChatTurn")(()=>false,p=>p==="生成视频",()=>"",()=>false,p=>p==="画一张图",{freewan:["m"],freeloop:["m"],freetext:["m"]});
 const input={mode:"text",provider:"free",code:false,continueFrom:null,videoProvider:"freetext",videoModel:"m"};
 const attachments=[{type:"image/jpeg"}];
 assert.equal(f({...input,attachments:[],prompt:"画一张图"}).mode,"image");
 assert.equal(f({...input,attachments,prompt:"分析这张图"}).mode,"text");
 assert.equal(f({...input,attachments,prompt:"生成视频"}).mode,"video");
 assert.match(f({...input,attachments,prompt:"换背景"}).error,/已下线/);
 assert.match(f({...input,attachments,prompt:"画一张图"}).error,/已下线/);
});
