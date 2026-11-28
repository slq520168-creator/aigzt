const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),w=fs.readFileSync("standalone/worker.js","utf8"),h=fs.readFileSync("standalone/index.html","utf8");
test("mode histories distinguish platform and personal free models",()=>{
 const pick=new Function(c.slice(c.indexOf("function pickModeModel("),c.indexOf("function modeModelAllowed("))+";return pickModeModel")();
 const rows={"free\0free:auto":{success:100},"free\0free:or/a:free":{success:90},"groq\0free-a":{success:20},"openai\0paid-b":{success:30},"groq\0free-c":{success:40,failure:41}};
 const free=(p,m)=>p==="groq"&&m.startsWith("free");
 assert.equal(pick("free",rows,()=>true,free).model,"free-a");
 assert.equal(pick("personal",rows,()=>true,free).model,"paid-b");
 assert.equal(pick("free",rows,()=>false,free),null);
 assert.match(c,/openModels\(false,selectedChatMode\)/);
 const handler=c.slice(c.indexOf('for(const b of composerModeMenu.querySelectorAll'),c.indexOf('document.addEventListener("click",e=>{if(!composerModeMenu'));
 assert.doesNotMatch(handler,/openModels\(/);assert.match(handler,/switchChatMode\(choice\)/);
 assert.doesNotMatch(h,/id="headerChatModels"|id="composerModeNote"/);
 assert.match(c,/const active=selectedChatMode==="auto"\?"":/);
 assert.match(w,/body.chatMode==="free"&&!isPersonalFreeChoice/);
});
test("automatic terminal state retains actual content and suppresses provider error text",()=>{assert.match(c,/automaticTurn\?\(nativeAnalysis\|\|attached\.length\?"原图及消息已保留":"消息已保留"\):humanError\(e\)/);assert.match(c,/automaticTurn\?"继续":"重试"/);assert.match(c,/!automaticTurn&&submittedMode/);assert.match(c,/automaticTurn\?"已保留当前内容"/);});
test("automatic retry rotates eligible provider pools and does not permanently block model 429",()=>{assert.match(w,/for\(const source of isAuto\?\[\.\.\.first,\.\.\.rest\]:all\)if\(eligible\(source\)\)/);assert.match(w,/if\(sharedAuto&&attempts>=6\)break/);assert.match(w,/if\(isAuto&&\[401,402,403\]\.includes\(status\)\)blockedProviders\.add/);});
