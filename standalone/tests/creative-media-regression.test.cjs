const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),w=fs.readFileSync("standalone/worker.js","utf8"),h=fs.readFileSync("standalone/index.html","utf8");
test("Two distinct frames are required and uploaded into separate source slots",()=>{
 const s=w.slice(w.indexOf("async function fvCreate("),w.indexOf("function fvOutput("));
 assert.ok(s.includes('!fvId(b.endImageId)||b.endImageId===b.imageId'));
 assert.ok(s.includes('const file=b.imageId?await uploadImage(b.imageId):null'));
 assert.ok(s.includes('const endFile=provider==="freeloop"?await uploadImage(b.endImageId):null'));
 assert.ok(s.includes('[file,endFile,prompt,FV_BAD,2.1,8,1,1,42,true]'));
 assert.ok(h.includes('id="videoEndImageInput"'));
});
test("All video modes share a safe free task status resolver",()=>{
 assert.ok(c.includes('provider:"free",requestId:id'));
 assert.ok(w.includes('provider==="free"&&fvId(id)'));
 assert.ok(w.includes('if(Object.hasOwn(FREE_VIDEO,provider))return fvStatus(env,user,id)'));
});
test("Completed videos never wait forever on media persistence",()=>{
 const s=w.slice(w.indexOf("async function fvStatus("),w.indexOf("async function fvMedia("));
 assert.ok(s.includes("status='complete',external_id=?"));
 assert.ok(s.includes('temporaryUrl:true'));
 assert.ok(s.includes("上游视频结果格式不兼容"));
 assert.ok(c.includes("下载临时视频"));
});
test("No app-shell, normal chat, or paid-video route replaced",()=>{
 assert.ok(c.includes('if(submittedMode==="text")'));
 assert.ok(w.includes('const FREE_VIDEO=Object.freeze'));
 assert.ok(w.includes('async function createVideo('));
 assert.ok(w.includes('async function submitKrea('));
 assert.ok(w.includes('async function chat('));
 assert.ok(h.includes('id="chatForm"'));
});
