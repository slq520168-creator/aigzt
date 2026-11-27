const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const worker=fs.readFileSync("standalone/worker.js","utf8");
const h=new Function(worker.slice(worker.indexOf("function truncate("),worker.indexOf("async function listModels("))+";return {groqRequestPlan,groqMessageCost,chatOutputBudget,chatProviderHistory}")();
const history=[{role:"system",content:"当前指令"},{role:"system",content:"以下是同一用户的相关上下文\n用户记忆：测试\n"+"旧记录".repeat(1000)},...Array.from({length:10},(_,i)=>({role:i%2?"assistant":"user",content:"历史".repeat(1500)})),{role:"user",content:"最新的聊天ai"}];
test("short question after long conversation fits normal and retry budget",()=>{
 for(const budget of [7400,4800]){
  const p=h.groqRequestPlan(history,6500,budget);
  assert.equal(p.messages.at(-1).content,"最新的聊天ai");
  assert.ok(p.messages.some(m=>m.content==="当前指令"));
  assert.ok(160+p.messages.reduce((n,m)=>n+h.groqMessageCost(m),0)+p.maxTokens<=budget);
 }
});
test("long user input is not silently cut; memory is not changed",()=>{
 const input="测试".repeat(10000)+"END",turns=[{role:"system",content:"以下是同一用户的相关上下文\n记忆"},{role:"user",content:input}];
 const snapshot=JSON.stringify(turns);
 assert.equal(h.groqRequestPlan(turns,4096,64000).messages.at(-1).content,input);
 assert.equal(JSON.stringify(turns),snapshot);
});
test("413 retries once without switching provider or model",async()=>{
 const src=worker.slice(worker.indexOf("async function callExternal("),worker.indexOf("// Storage uploads retain bounded protection"));
 const helper=worker.slice(worker.indexOf("const CHAT_REPLY_CHARS="),worker.indexOf("const SHARED_FREE_PREFIX="));
 const factory=new Function("requireModelId","HOSTS","providerModelIsFree","chatProviderHistory","groqRequestPlan","fetch","replyMedia","verifiedTokenUsage","truncate","AbortSignal","replyWasLimited",helper+"\n"+src+";return callExternal;");
 const attempts=[];
 const mock=async(url,options)=>{attempts.push(JSON.parse(options.body));return attempts.length===1?{status:413,ok:false,body:{cancel:async()=>{}}}:{status:200,ok:true,json:async()=>({model:"openai/gpt-oss-120b",choices:[{message:{content:"正常"},finish_reason:"stop"}]})}};
 const call=factory(()=>{}, {groq:{host:"api.groq.com",path:"/openai/v1/chat/completions"}},()=>false,h.chatProviderHistory,h.groqRequestPlan,mock,text=>({content:text,images:[],add(){}}),()=>null,(s,n)=>s.slice(0,n),{timeout:()=>undefined},reason=>reason==="length");
 const result=await call("groq","openai/gpt-oss-120b","fake-key-123456789",history.map(m=>({role:m.role,body:m.content})),true,15000,4096);
 assert.equal(result.content,"正常");assert.equal(attempts.length,2);
 for(const a of attempts){assert.equal(a.model,"openai/gpt-oss-120b");assert.equal(a.messages.at(-1).content,"最新的聊天ai");}
 assert.ok(attempts[1].max_completion_tokens<attempts[0].max_completion_tokens);
 assert.match(worker,/if\(status!==413\)await freeRouteFailure/);
});

test("long creative output uses available Groq budget without exceeding free TPM guard",()=>{
 const p=h.groqRequestPlan([{role:"system",content:"完整输出"},{role:"user",content:"写20套提示词"}],h.chatOutputBudget("groq","openai/gpt-oss-120b","long"));
 assert.ok(p.maxTokens>6500);
 assert.ok(160+p.messages.reduce((n,m)=>n+h.groqMessageCost(m),0)+p.maxTokens<=7800);
 assert.match(worker,/reasoning_effort:level==="short"\?"low":"medium"/);
});
