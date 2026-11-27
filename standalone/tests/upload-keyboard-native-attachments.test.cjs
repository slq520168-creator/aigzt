const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const w=fs.readFileSync("standalone/worker.js","utf8"),c=fs.readFileSync("standalone/client.js","utf8"),s=fs.readFileSync("standalone/style.css","utf8");
test("upload has no arbitrary daily counters and retains authenticated bounded storage",()=>{
 const f=w.slice(w.indexOf("async function uploadFile("),w.indexOf("async function avatarUpload("));
 assert.doesNotMatch(w,/uploadQuota|今日上传次数已用完|网站今日上传保护额度已用完/);
 assert.match(f,/requireUser\(user\)/);assert.match(f,/file.size>8000000/);assert.match(f,/env.MEDIA.put\(user.id/);assert.match(w,/env.RATE.limit\(\{key:ip\+":"\+path\}\)/);
});
test("drawer releases composer keyboard without losing the draft, independent of main height",()=>{
 const fn=new Function("$","document","hideAttachMenu","syncMobileHeight",c.slice(c.indexOf("function openMenu(){"),c.indexOf("function wireDrawerGestures(){"))+";return openMenu");
 let blurred=0,shown=0,hidden=0,synced=0;
 const els={shell:{classList:{add:()=>shown++}},sideShade:{hidden:true},menuBtn:{setAttribute(){}}};
 const focused={value:"未发送草稿",closest:()=>true,matches:()=>true,blur(){blurred++}};
 fn(id=>els[id],{activeElement:focused},()=>hidden++,()=>synced++)();
 assert.deepEqual([blurred,shown,hidden,synced],[1,1,1,1]);assert.equal(focused.value,"未发送草稿");assert.equal(els.sideShade.hidden,false);
 for(const line of s.split("\n").filter(x=>/\.sidebar\{/.test(x)))assert.doesNotMatch(line,/--aigzt-visible-height/);
 assert.match(s,/\.sidebar-chat-scroll\{flex:1 1 0;min-height:96px/);
});
test("native attachment parts stay with latest user turn and same model",()=>{
 const f=new Function(w.slice(w.indexOf("function groqVisionModel"),w.indexOf("async function planNativeChatAttachments"))+";return {groqVisionModel,attachNativeChatParts}")();
 assert.equal(f.groqVisionModel("openai/gpt-oss-120b"),false);
 assert.equal(f.groqVisionModel("qwen/qwen3.8-27b"),true);
 const history=[{role:"user",content:"old"},{role:"assistant",content:"ok"},{role:"user",content:"analyse"}],parts=[{type:"image_url",image_url:{url:"data:image/png;base64,AA=="}}];
 const result=f.attachNativeChatParts(history,parts);
 assert.equal(result[0].content,"old");assert.equal(history[2].content,"analyse");
 assert.deepEqual(result[2].content,[{type:"text",text:"analyse"},...parts]);
 assert.match(w,/nativePlan\?\.parts\|\|\[\]/);assert.match(w,/attachNativeChatParts\(smaller.messages,inputParts\)/);
});
test("attachment request carries real bytes, free routing stays free and text-only selection fails before transmission",async()=>{
 const source=w.slice(w.indexOf("function groqVisionModel"),w.indexOf("function legacyQueryPrompt"));
 const catalog={models:[{id:"paid/vision",free:false,inputImages:true,outputText:true},{id:"free/vision:free",free:true,zeroText:true,zeroImage:true,inputImages:true,outputText:true}]};
 const bytes=new Uint8Array([137,80,78,71,1,2,3,4]);let reads=0;
 const env={OPENROUTER_FREE_KEY:"fake-test-key",MEDIA:{get:async()=>{reads++;return {size:bytes.length,arrayBuffer:async()=>bytes.buffer}}}};
 const f=new Function("listModels","detectImage","toB64",source+";return planNativeChatAttachments")(async()=>catalog,()=>"image/png",()=> "iVBORwECAwQ=");
 const files=[{key:"u/id",name:"test.png",type:"image/png",size:bytes.length}];
 await assert.rejects(f(env,"groq","openai/gpt-oss-120b",files),/不支持/);assert.equal(reads,0);
 const p=await f(env,"groq","qwen/qwen3.8-27b",files);assert.equal(p.model,"qwen/qwen3.8-27b");assert.equal(p.parts[0].image_url.url,"data:image/png;base64,iVBORwECAwQ=");
 const free=await f(env,"free","free:auto",files);assert.equal(free.model,"free/vision:free");assert.equal(reads,2);
});
test("upload awaits reference conversion and protects unsent attachments",()=>{
 assert.match(c,/if\(S.uploading\)\{flashError/);assert.match(c,/finally\{S.uploading=false/);
 assert.match(c,/const selected=await optimizeImageReference\(file,heic\|\|autoReference\);/);
 assert.match(c,/原附件和草稿已保留/);
 assert.doesNotThrow(()=>new Function(c));assert.doesNotThrow(()=>new Function(w.replace(/export default \{/,"return {")));
});
