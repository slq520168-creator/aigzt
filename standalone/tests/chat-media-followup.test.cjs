const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),w=fs.readFileSync("standalone/worker.js","utf8");
test("done event releases chat even before transport EOF",async()=>{
 const encoder=new TextEncoder();let canceled=false,reads=0;
 const fakeFetch=async()=>({ok:true,body:{getReader:()=>({read:async()=>{if(++reads>1)throw Error("must not wait for EOF");return {done:false,value:encoder.encode('data: {"type":"delta","text":"ok"}\n\ndata: {"type":"done","chatId":"c","reply":"ok"}\n\n')}},cancel:async()=>{canceled=true}})}});
 const fn=new Function("fetch",c.slice(c.indexOf("async function apiChatStream("),c.indexOf("// One user click"))+";return apiChatStream")(fakeFetch);
 let output="";const r=await fn({},x=>output+=x);assert.equal(r.reply,"ok");assert.equal(output,"ok");assert.equal(reads,1);assert.equal(canceled,true);
});
test("media markers remain readable history without leaking task IDs or inventing completion",()=>{
 const fn=new Function(w.slice(w.indexOf("function truncate("),w.indexOf("function groqVisionModel("))+";return chatProviderHistory")();
 const result=fn([{role:"user",body:"画一张海报"},{role:"assistant",body:"[[aigzt:image-job:private-id]]"},{role:"user",body:"下一步怎么做"}]);
 assert.equal(result[0].content,"画一张海报");assert.match(result[1].content,/不代表已完成/);assert.doesNotMatch(result[1].content,/private-id/);assert.equal(result[2].content,"下一步怎么做");
});
test("media saving and history refresh do not own the send lock",()=>{
 const s=c.slice(c.indexOf("async function sendMessage("),c.indexOf("// Keep confirmed failures"));
 assert.match(s,/if\(submittedMode!=="text"\|\|\(submittedCode&&requestProvider==="free"\)\)restoreChatInputMode\(\)/);
 assert.doesNotMatch(s,/await fetchChats\(\)|await cacheReplyImages\(/);
 assert.match(s,/finally\{S\.busy=false;\$\("sendBtn"\)\.disabled=false/);
});
