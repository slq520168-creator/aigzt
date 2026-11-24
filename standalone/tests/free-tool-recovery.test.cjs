const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const w=fs.readFileSync("standalone/worker.js","utf8"),c=fs.readFileSync("standalone/client.js","utf8");
const h=new Function(w.slice(w.indexOf("const FREE_VIDEO="),w.indexOf("async function fvCreate"))+";return {fvRoute,fvArgs,fvOperationalFailure,FV_ATTEMPT_MS}")();
test("video mode-specific payloads and deadlines",()=>{
 const r={prompt:"test",ratio:"9:16"};
 assert.equal(h.FV_ATTEMPT_MS,50000);
 assert.deepEqual(h.fvArgs("freetext",h.fvRoute("freetext",1),r,null,null),[null,"test","480x832",2]);
 assert.equal(h.fvArgs("freewan",h.fvRoute("freewan",1),r,"image",null)[0],"image");
 assert.deepEqual(h.fvArgs("freeloop",h.fvRoute("freeloop",1),r,"start","end").slice(0,3),["start","end","test"]);
 assert.match(w,/stage!==0\|\|!ref.request/);
 assert.match(w,/status='recovering',checked_at=\?/);
 assert.match(w,/state.retryable\?advance\(reason\):failJob\(reason\)/);
 assert.match(w,/if\(Date.now\(\)>=deadline\)return advance/);
});
test("translation uses correct Groq token field and no source echo shortcut",()=>{
 const t=w.slice(w.indexOf("async function translateChatMessage"),w.indexOf("async function chat("));
 assert.match(t,/payload.max_completion_tokens=payload.max_tokens/);
 assert.doesNotMatch(t,/return \{ok:true,translation:source\}/);
});
test("image edit timeout measured from attempt start and text video button uses correct mode",()=>{
 assert.match(w,/ref=\{v:8,p:"qwenedit",id:event,imageId,prompt:prompt.slice\(0,1100\),startedAt:attemptAt\}/);
 assert.match(w,/deadline=\(Number\(ref.startedAt\)\|\|job.created_at\)\+50000/);
 assert.match(c,/selectVideoModel\("freetext",VIDEO_OPTIONS.freetext\[0\]\);setComposerMode\("video"\)/);
});
test("syntax",()=>{assert.doesNotThrow(()=>new Function(c));assert.doesNotThrow(()=>new Function(w.replace(/export default \{/,"return {")))});
