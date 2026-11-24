const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const w=fs.readFileSync("standalone/worker.js","utf8"),c=fs.readFileSync("standalone/client.js","utf8");
const chat=w.slice(w.indexOf("async function chat(req"),w.indexOf("/* POST SSE:"));
const dispatch=chat.match(/if\(provider==="free"\)\{\s*result=await freeText[\s\S]+?(?=\n\s*\}catch\(e\)\{)/)[0];
const f=new Function("provider","model","freeText","keyForProvider","callExternal","chatOutputBudget","env","user","body","selectedMessages","mode","replyLevel","onDelta","return (async()=>{let result;"+dispatch+";return result;})()");
test("named model failures do not trigger free routing",async()=>{
 for(const status of [404,429,403,503]){
  let direct=0,free=0;
  await assert.rejects(f("groq","openai/gpt-oss-120b",async()=>{free++;return{}},async()=>({key:"fake-key",consent:true}),async(p,m)=>{direct++;assert.equal(p,"groq");assert.equal(m,"openai/gpt-oss-120b");throw Object.assign(Error("upstream error"),{upstreamStatus:status})},()=>8192,{},{},{},[],"general","long",null),/upstream error/);
  assert.equal(direct,1);assert.equal(free,0);
 }
});
test("named models remain pinned; free auto still works",async()=>{
 const run=(p,m)=>f(p,m,async()=>({actualModel:"free-test"}),async()=>({key:"fake",consent:true}),async(p,m)=>({actualModel:m}),()=>8192,{},{},{},[],"general","long",null);
 assert.equal((await run("groq","openai/gpt-oss-120b")).actualModel,"openai/gpt-oss-120b");
 assert.equal((await run("free","free:auto")).actualModel,"free-test");
 assert.match(chat,/usedModel:result\.actualModel,provider/);
 assert.match(chat,/provider,model,stamp,chatId,user\.id/);
 assert.doesNotMatch(c,/result\.provider==="free"&&S\.provider!=="free"/);
 assert.doesNotMatch(w,/adaptedChatModel/);
});
test("connection catalog and key verification preserve explicit selections",()=>{
 assert.match(w,/model=desired\|\|selected\?\.id\|\|""/);
 assert.match(w,/const next=row\.model_id\|\|/);
 assert.match(c,/model:manualModel\|\|selectedModel\|\|undefined/);
 assert.match(c,/model:saved\.model\|\|undefined/);
 assert.match(c,/S\.model=saved\.provider==="free"\?"free:auto":saved\.model/);
});
test("source syntax and model receipt",()=>{
 assert.doesNotThrow(()=>new Function(c));assert.doesNotThrow(()=>new Function(w.replace(/export default \{/,"return {")));
 assert.match(c,/回复模型：/);
});
