const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),w=fs.readFileSync("standalone/worker.js","utf8");
test("history cursor is scoped, ordered and bounded",()=>{
 const src=w.slice(w.indexOf(' if(path==="/api/chats"&&req.method==="GET"){'),w.indexOf(' const hit=path.match('));
 assert.match(src,/where=\["user_id=\?","archived_at"/);
 assert.match(src,/\(pinned_at,updated_at,id\)<\(\?,\?,\?\)/);
 assert.match(src,/ORDER BY pinned_at DESC,updated_at DESC,id DESC LIMIT 101/);
 assert.match(src,/rows.slice\(0,100\)/);
 assert.match(src,/nextCursor:/);
 assert.match(c,/historyScope!==scope/);
 assert.match(c,/box.scrollHeight-box.clientHeight-box.scrollTop>120/);
 assert.match(c,/if\(!currentHistoryRequest\(seq,scope\)\)return/);
});
test("older history merges without duplicate rows",()=>{
 const f=new Function(c.slice(c.indexOf("function mergeHistoryRows("),c.indexOf("function currentHistoryRequest("))+";return mergeHistoryRows")();
 assert.deepEqual(f([{id:"a",title:"old"},{id:"b"}],[{id:"a",title:"new"},{id:"c"}]),[{id:"a",title:"new"},{id:"b"},{id:"c"}]);
});
test("actions do not reopen a manually closed drawer",()=>{
 const src=c.slice(c.indexOf("function actionItem("),c.indexOf("function openChatActions("));
 assert.doesNotMatch(src,/openMenu\(/);
 assert.match(c,/newChat\(Boolean\(anchor\)\)/);
 assert.match(c,/if\(keepDrawer!==true\)closeMenu\(\)/);
});
