const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),h=fs.readFileSync("standalone/index.html","utf8"),s=fs.readFileSync("standalone/style.css","utf8");
test("all loaded histories render without show more",()=>{assert.match(c,/reconcile\(recent,normal,empty\)/);assert.doesNotMatch(c+h+s,/historyToggle|historyExpanded|history-show-more/);});
test("sidebar actions stay anchored and preserve drawer",()=>{
 assert.match(c,/openChatActions\(x.id,more\)/);
 assert.match(c,/if\(anchor\)showHistoryActions\(anchor\)/);
 const source=c.slice(c.indexOf("function showHistoryActions("),c.indexOf("function actionItem("));
 assert.match(source,/dialog.show\(\)/);assert.doesNotMatch(source,/closeMenu\(/);
 assert.match(c,/showHistoryRename\(chatId,item.title,anchor\)/);
 assert.match(c,/showHistoryProjects\(chatId,anchor\)/);
 const f=new Function(c.slice(c.indexOf("function historyMenuPosition("),c.indexOf("function positionHistoryActions("))+";return historyMenuPosition")();
 for(const a of [{top:100,bottom:134,right:265},{top:650,bottom:684,right:265},{top:5,bottom:39,right:265}]){
 const p=f(a,{left:0,right:280},235,760);assert.ok(p.left>=8&&p.left+p.width<=272&&p.top>=8&&p.top+235<=752);
 }
});
test("narrower drawer and visible three dots",()=>{assert.match(s,/width:min\(72vw,280px\)/);assert.match(s,/\.history-more\{width:34px;height:34px/);assert.match(s,/\.history-more svg\{stroke:#263746;stroke-width:2.5\}/);assert.doesNotThrow(()=>new Function(c));});
