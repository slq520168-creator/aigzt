const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),h=fs.readFileSync("standalone/index.html","utf8"),s=fs.readFileSync("standalone/style.css","utf8");
const send=c.slice(c.indexOf("async function sendMessage("),c.indexOf("// Keep confirmed failures scoped"));
test("fallback never persists a model preference",()=>{
 assert.doesNotMatch(send,/setFreeDefault\(|rememberChatModelSelection\(|S\.provider\s*=(?!=)|S\.model\s*=(?!=)/);
 assert.match(send,/let requestProvider=S\.provider,requestModel=S\.model/);
 assert.match(send,/provider:requestProvider,model:requestModel,message:prompt/);
 assert.match(send,/sendMessage\(continueFrom,true\)/);
 assert.match(send,/if\(!S\.connectionsLoaded\)/);
});
test("restore selection before showing model name",()=>{
 assert.match(c,/restoreChatModelSelection\(\);restoreWorkModelSelection\(\);chatModelPreferenceReady=true;updateModelTitle\(\)/);
 assert.match(c,/if\(!chatModelPreferenceReady\)return "恢复模型…"/);
 assert.match(c,/localStorage\.setItem\(chatModelStorageKey\(S\.user\.id\)/);
});
test("arrows are hidden until user scrolls",()=>{
 assert.match(h,/id="chatScrollArrows"[^>]*hidden/);
 assert.match(s,/\.chat-scroll-arrows\[hidden\]\{display:none\}/);
 assert.match(c,/viewport\.addEventListener\("touchmove",mark/);
 assert.match(c,/setTimeout\(hideArrows,2000\)/);
 assert.match(c,/top:end\?viewport\.scrollHeight:0/);
 assert.doesNotThrow(()=>new Function(c));
});