const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),w=fs.readFileSync("standalone/worker.js","utf8");
test("Quoted visual prompts expose the same generation action as fenced prompts",()=>{
 const f=new Function(c.slice(c.indexOf("function imagePromptLabel("),c.indexOf("function renderAssistantText("))+";return normalizePromptSections")();
 const p="Close-up portrait photography of an adult woman in a car, rain droplets on glass, soft neon lighting, cinematic, shallow depth of field, photorealistic, 8K.";
 assert.equal(f(["> "+p])[0],"\x60\x60\x60image-prompt");
 assert.deepEqual(f(["> The meeting starts tomorrow."]),["> The meeting starts tomorrow."]);
 assert.ok(!f(["负面提示词：模糊，低质量"]).includes("\x60\x60\x60image-prompt"));
 assert.match(c,/markImageMessage\(row,/);
});
test("Request reservations serialize duplicate execution and replay the original result",async()=>{
 const rows=new Map(),env={DB:{prepare:x=>x,batch:async()=>[]}},key=(u,id)=>u+"|"+id;
 const get=async(db,sql,...args)=>rows.get(key(...args))||null;
 const run=async(db,sql,...args)=>{if(sql.startsWith("INSERT INTO imai_request_receipts")){const [u,id,fp]=args,k=key(u,id);if(rows.has(k))return {meta:{changes:0}};rows.set(k,{fingerprint:fp,state:"pending"});return {meta:{changes:1}}}if(sql.includes("SET state='complete'")){const [res,u,id]=args,k=key(u,id);rows.set(k,{...rows.get(k),state:"complete",result_json:res});return {meta:{changes:1}}}throw Error(sql)};
 const f=new Function("requireUser","parseJSON","CHAT_REQUEST_BYTES","sha","dbGet","dbRun",w.slice(w.indexOf("let stabilitySchema=null;"),w.indexOf("async function chat(req"))+";return reservedSubmission")(()=>{},async req=>req.body,64000,async x=>x,get,run);
 const user={id:"a"},id="11111111-1111-4111-8111-111111111111",req=p=>({body:{requestId:id,prompt:p},clone(){return this}});
 let count=0,release,entered;const gate=new Promise(r=>release=r),ready=new Promise(r=>entered=r);
 const p=f(req("a"),env,user,"image",async()=>{count++;entered();await gate;return {ok:true,jobId:"original"}});
 await ready;await assert.rejects(()=>f(req("a"),env,user,"image",async()=>{count++}),e=>e.code==="REQUEST_PENDING");release();await p;
 assert.equal((await f(req("a"),env,user,"image",async()=>{count++})).jobId,"original");assert.equal(count,1);
 await assert.rejects(()=>f(req("b"),env,user,"image",async()=>{count++}),e=>e.code==="REQUEST_CONFLICT");
});
test("History switch and generation delivery preserve ownership and prior results",()=>{
 assert.match(c,/epoch!==chatOpenEpoch\|\|S\.user\?\.id!==owner\|\|S\.busy/);
 assert.match(c,/mode:"image",requestId,prompt/);
 assert.match(w,/phase:"delivered"/);
 assert.match(w,/recoverDeliveredImage\(env,user,job\)/);
 assert.match(w,/status='failed' AND message_id IS NULL/);
 assert.doesNotThrow(()=>new Function(c));
 assert.doesNotThrow(()=>new Function(w.replace(/^export default\s*\{/m,"const workerEntry = {")));
});
test("Favorite sync validates identity, maximum and strips secret fields",()=>{
 const f=new Function(w.slice(w.indexOf("function cleanCatalogFavorite("),w.indexOf("async function catalogFavorites("))+";return normalizeCatalogFavorites")();
 assert.equal(f("tools",Array.from({length:42},(_,i)=>({key:"site:https://example.com/"+i}))).length,40);
 assert.equal(f("models",[{key:"openrouter\0model",model:{provider:"openrouter",id:"model",type:"text",apiKey:"secret"}}])[0].model.apiKey,undefined);
 assert.match(w,/b\.owner!==user\.id/);assert.match(c,/S\.user\?\.id!==owner\|\|favoriteScope\(kind\)!==scope/);
});