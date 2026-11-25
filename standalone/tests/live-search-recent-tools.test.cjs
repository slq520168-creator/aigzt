const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('standalone/client.js','utf8'),worker=fs.readFileSync('standalone/worker.js','utf8');
test('fuzzy chat matches partial and separated characters, with live input and IME guards',()=>{
 const match=new Function(js.slice(js.indexOf('function fuzzyChatMatch('),js.indexOf('function renderChatSearchRows('))+'return fuzzyChatMatch')();
 assert.equal(match('开放的源代码','开源'),true);assert.equal(match('OpenRouter','open router'),true);assert.equal(match('闭源模型','开源'),false);
 assert.match(js,/chatSearchInput"\)\.addEventListener\("input"/);assert.match(js,/compositionend/);assert.match(js,/setTimeout\(run,350\)/);assert.match(worker,/EXISTS \(SELECT 1 FROM messages m WHERE m.chat_id=c.id AND m.user_id=c.user_id/);
});
test('recent tools retain only 24 unique newest keys and backup to IndexedDB',()=>{
 const normalize=new Function('const FREE_TOOL_RECENT_LIMIT=24;'+js.slice(js.indexOf('function normalizeFreeToolRecent('),js.indexOf('function freeToolRecentRead('))+'return normalizeFreeToolRecent')();
 const keys=Array.from({length:30},(_,i)=>'site:'+i);assert.equal(normalize(keys).length,24);
 assert.deepEqual(normalize(['site:4',...keys]).slice(0,3),['site:4','site:0','site:1']);
 assert.match(js,/deviceMediaPut\("free-tools:"\+scope/);assert.match(js,/deviceMediaGet\("free-tools:"\+scope/);
});
