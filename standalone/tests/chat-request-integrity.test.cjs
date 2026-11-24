const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const worker=fs.readFileSync("standalone/worker.js","utf8"),html=fs.readFileSync("standalone/index.html","utf8");
const helpers=new Function(worker.slice(worker.indexOf("function truncate("),worker.indexOf("async function listModels("))+";return {chatProviderHistory,legacyQueryPrompt,chatOutputBudget}")();
test("direct and free routes preserve full current user turn",()=>{
 const body="测试".repeat(12000)+"END";
 const history=helpers.chatProviderHistory([{role:"user",body:"old".repeat(3000)},{role:"assistant",body:"previous"},{role:"user",body}]);
 assert.equal(history.at(-1).content,body);assert.equal(history[0].content.length,3000);
 assert.equal(helpers.legacyQueryPrompt(history),null);
 assert.match(worker,/const history=chatProviderHistory\(messages\);/);
 assert.match(worker,/const history=chatProviderHistory\(messages.slice\(-14\)\);/);
 assert.doesNotMatch(html,/id="prompt"[^>]*maxlength="8000"/);
 assert.doesNotMatch(worker,/if\(typed.length>8000\)/);
});
test("legacy route never truncates current user content",()=>{
 const body="a".repeat(2797);
 const result=helpers.legacyQueryPrompt([{role:"user",content:"old"},{role:"assistant",content:"previous"},{role:"user",content:body}]);
 assert.ok(result.endsWith(body));assert.ok(result.length<=2800);
 assert.equal(helpers.legacyQueryPrompt([{role:"user",content:body+"x"}]),null);
});
test("Groq reasoning budgets preserve selected reply level",()=>{
 assert.equal(helpers.chatOutputBudget("groq","openai/gpt-oss-120b","short"),600);
 assert.equal(helpers.chatOutputBudget("groq","openai/gpt-oss-120b","long"),8192);
 assert.equal(helpers.chatOutputBudget("openrouter","other/model","long"),2600);
});
test("memory switch retains current, project and ordinary cross-chat context",()=>{
 assert.match(worker,/WHERE chat_id=\? AND user_id=\? ORDER BY created_at DESC LIMIT 12/);
 assert.match(worker,/if\(preference\?\.memory_enabled!==0\)/);
 assert.match(worker,/WHERE m\.user_id=\? AND c\.id<>\? ORDER BY m\.created_at DESC LIMIT 6/);
 assert.match(worker,/WHERE m\.user_id=\? AND c\.project_id=\?/);
});
test("chat transport is bounded by UTF-8 bytes",()=>{
 assert.match(worker,/const CHAT_REQUEST_BYTES=256\*1024/);
 assert.match(worker,/parseJSON\(req,CHAT_REQUEST_BYTES\)/);
 assert.match(worker,/parseJSON\(req,maxBytes=64000\)/);
 assert.match(worker,/new TextEncoder\(\).encode\(text\).byteLength>maxBytes/);
});
