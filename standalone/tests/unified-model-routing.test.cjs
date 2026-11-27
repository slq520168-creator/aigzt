const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const w=fs.readFileSync("standalone/worker.js","utf8"),c=fs.readFileSync("standalone/client.js","utf8"),h=fs.readFileSync("standalone/index.html","utf8");
test("work routes keep personal API pinned, auto never uses personal keys",()=>{
 const fn=new Function("workStepPlan","validModelIdentifier","providerModelIsFree",w.slice(w.indexOf("function workRoutes(t,"),w.indexOf("async function workPrompt("))+";return workRoutes")(t=>t.steps,()=>true,()=>true);
 const saved=[{provider:"groq",model_id:"a",consent:1},{provider:"openrouter",model_id:"b",consent:1}];
 assert.deepEqual(fn({steps:[{provider:"auto"}],fallback_enabled:1},saved).map(r=>r.id),["free:auto"]);
 assert.deepEqual(fn({steps:[{provider:"groq",model:"a"}],fallback_enabled:1},saved).map(r=>r.id),["groq:a"]);
 assert.equal(fn({steps:[{provider:"groq",model:"a"}]},[]).length,0);
 const locked=new Function("workStepPlan","validModelIdentifier","providerModelIsFree",w.slice(w.indexOf("function workRoutes(t,"),w.indexOf("async function workPrompt("))+";return workRoutes")(t=>t.steps,()=>true,()=>false);
 assert.equal(locked({steps:[{provider:"openrouter",model:"test/free:free"}]},[{provider:"openrouter",model_id:"test/free:free",consent:0}]).length,1);
 assert.equal(locked({steps:[{provider:"openrouter",model:"test/paid"}]},[{provider:"openrouter",model_id:"test/paid",consent:0}]).length,0);
});
test("all direct shared free text catalog entries are eligible for auto routing",async()=>{
 const src=w.slice(w.indexOf("async function automaticFreeSources("),w.indexOf("async function freeRouteStates("));
 const catalog={sharedFreeModels:Array.from({length:15},(_,i)=>({id:"free:or/test/"+i+":free",sharedModel:"test/"+i+":free",shared:true,free:true,type:"text",context:8192})).concat([{id:"paid",sharedModel:"paid",shared:true,free:false,type:"text"},{id:"image",sharedModel:"image:free",shared:true,free:true,type:"image"}])};
 const route=new Function("freeSources","listModels","catalogOutputCapacity",src+";return automaticFreeSources")(()=>[],async()=>catalog,()=>null);
 const rows=await route({OPENROUTER_FREE_KEY:"test-platform-key"},"code","long");
 assert.equal(rows.length,15);assert.ok(rows.every(x=>x.zeroOnly&&x.key==="test-platform-key"));
});
test("chat cannot automatically switch a personal API; work preference is independent",()=>{
 assert.doesNotMatch(w,/await freeChatAnswer\(/);
 assert.match(c,/freeFallback:false,outputImages:/);
 assert.doesNotMatch(c,/if\(incompatible&&!imageOutput\)\{requestProvider="free"/);
 assert.match(c,/aigzt:work-model:v1:/);assert.match(c,/rememberWorkModelSelection\(provider,model\)/);
 assert.match(c,/restoreChatModelSelection\(\);restoreWorkModelSelection\(\)/);
 assert.doesNotMatch(h,/id="workRouteEditor"/);assert.match(c,/\$\("replyLevelTrigger"\)\.hidden=work/);
});