const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const w=fs.readFileSync("standalone/worker.js","utf8"),c=fs.readFileSync("standalone/client.js","utf8");
test("free stream delivers text before completion without waiting for directory",async()=>{
 const events=['data: {"choices":[{"delta":{"content":"first"}}]}\\n','data: {"choices":[{"delta":{"content":" second"},"finish_reason":"stop"}]}\\n','data: [DONE]\\n'].map(x=>x.replace(/\\n/g,"\n"));
 let delivered=[],reads=0,requests=0,directory=0,payload;
 const response={ok:true,headers:{get:()=>null},body:{getReader:()=>({read:async()=>{if(reads===1)assert.deepEqual(delivered,["first"]);return reads<events.length?{done:false,value:new TextEncoder().encode(events[reads++])}:{done:true}},cancel:async()=>{}})}};
 const src=w.slice(w.indexOf("const CHAT_REPLY_CHARS="),w.indexOf("const SHARED_FREE_PREFIX="))+"\n"+w.slice(w.indexOf("async function readChatCompletionStream("),w.indexOf("async function callExternal("))+w.slice(w.indexOf("async function freeText("),w.indexOf("/* Reuse the site's existing free text providers"));
 const route={id:"groq",model:"openai/gpt-oss-20b",key:"test-key-not-real",endpoint:"https://example.invalid",ms:11000};
 const f=new Function("freeSources","automaticFreeSources","freeRouteStates","freeRouteRecover","freeRouteFailure","chatProviderHistory","chatOutputBudget","groqRequestPlan","verifiedTokenUsage","replyWasLimited","fetch",src+";return freeText")(()=>[route],async()=>{directory++;throw Error("unexpected catalog read")},async()=>new Map(),async()=>{},async()=>{},m=>m.map(x=>({role:x.role,content:x.body})),()=>3500,(m,n)=>({messages:m,maxTokens:n}),()=>null,()=>false,async(url,opt)=>{requests++;payload=JSON.parse(opt.body);return response});
 const result=await f({},[{role:"user",body:"hello"}],"general","free:auto",50000,false,"standard",false,true,true,t=>delivered.push(t));
 assert.equal(directory,0);assert.equal(requests,1);assert.equal(payload.stream,true);assert.equal(result.content,"first second");assert.equal(result.incomplete,false);
});
test("client renders first chunk immediately and complete non-stream replies without animation wait",()=>{assert.match(c,/if\(first\)\{updateAssistantText\(bubble,streamedContent\);return\}/);assert.doesNotMatch(c,/await revealCompletedReply/);assert.match(w,/false,true,true,forward\)/);assert.doesNotThrow(()=>new Function(c));});
