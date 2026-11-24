const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8");
const position=new Function(c.slice(c.indexOf("function positionNewTextReply("),c.indexOf("async function revealCompletedReply("))+";return positionNewTextReply")();
function setup(questionHeight){
 const viewport={hidden:false,clientHeight:500,scrollTop:400,getBoundingClientRect:()=>({top:50})};
 const row={isConnected:true,dataset:{},style:{minHeight:"",alignContent:""},getBoundingClientRect:()=>({top:480})};
 const question={getBoundingClientRect:()=>({top:350,height:questionHeight})};
 return {viewport,row,question};
}
test("new text turn positions the short question once and reserves reading space",()=>{
 const {viewport,row,question}=setup(70);
 const cleanup=position(row,question,viewport);
 assert.equal(viewport.scrollTop,688);assert.equal(row.dataset.readFromStart,"1");
 assert.equal(row.style.minHeight,"476px");
 viewport.scrollTop=800;cleanup();
 assert.equal(viewport.scrollTop,800);assert.equal(row.style.minHeight,"");
});
test("long question anchors directly to beginning of reply",()=>{
 const {viewport,row,question}=setup(280);
 position(row,question,viewport);assert.equal(viewport.scrollTop,818);
});
test("stream, reveal and final render respect text anchor, media remains separate",()=>{
 assert.match(c,/loading\.dataset\.readFromStart!=="1"&&viewport\.scrollHeight/);
 assert.match(c,/row\.dataset\.readFromStart!=="1"&&viewport\.scrollHeight/);
 assert.match(c,/if\(row\.dataset\.readFromStart!=="1"&&\(nearBottom\|\|role==="user"\)\)/);
 assert.match(c,/releaseReadingSpace\?\.\(\)/);
 assert.match(c,/if\(S\.busy\)followLatestImage\(bubble\)/);
 assert.doesNotThrow(()=>new Function(c));
});
