const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const w=fs.readFileSync("standalone/worker.js","utf8"),c=fs.readFileSync("standalone/client.js","utf8");
test("long video prompts keep their full description during second attempt",()=>{
 const route=new Function(w.slice(w.indexOf("const FREE_VIDEO="),w.indexOf("async function fvCreate"))+";return fvRoute")();
 assert.equal(route("freetext",1,{prompt:"x".repeat(1398)}),route("freetext",0));
 assert.notEqual(route("freetext",1,{prompt:"short"}),route("freetext",0));
});
test("failed inline video stays in chat and retries same task",()=>{
 const inline=c.slice(c.indexOf("function inlineVideoJob"),c.indexOf("// Fold presentation"));
 assert.doesNotMatch(inline,/打开免费来源/);
 assert.match(inline,/inlineVideoJob\(bubble,id,true\)/);
 assert.match(inline,/\/api\/video\/retry/);
 assert.match(w,/async function fvRetry/);
 assert.match(w,/AND status='failed'/);
 assert.match(w,/m.body LIKE '免费视频未完成:%'/);
});
test("recover only exact same-user real saved video",()=>{
 const recover=w.slice(w.indexOf("async function fvRecoverMatchingMedia"),w.indexOf("async function fvRetry"));
 assert.match(recover,/user_id=\?/);
 assert.match(recover,/json_extract\(external_id,'\$\.request'\)=\?/);
 assert.match(recover,/message_id IS NULL/);
 assert.match(recover,/env.MEDIA.head\(user.id\+"\/"\+match.media_id\)/);
 assert.match(recover,/video\/mp4/);
});
test("syntax",()=>{assert.doesNotThrow(()=>new Function(c));assert.doesNotThrow(()=>new Function(w.replace(/export default \{/,"return {")))});
