const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const w=fs.readFileSync("standalone/worker.js","utf8"),c=fs.readFileSync("standalone/client.js","utf8");
const f=new Function(w.slice(w.indexOf("function workSafePath("),w.indexOf("function workEvidenceExcerpt("))+w.slice(w.indexOf("function auditSourcePath("),w.indexOf("async function runRepositoryAudit("))+";return {auditManifest,auditSlice,auditNextBatch}")();
test("audit recursively inventories all eligible files, not the first five",()=>{
 const tree={tree:Array.from({length:53},(_,i)=>({type:"blob",path:"src/nested/f"+i+".js",size:20,sha:"a".repeat(40),mode:"100644"})).concat([{type:"blob",path:".env",size:10,sha:"b".repeat(40)}])};
 const m=f.auditManifest(tree,"检查仓库");assert.equal(m.files.length,53);assert.equal(m.excluded,1);
});
test("chunk offsets cover full long source without rereading cached file",async()=>{
 const raw="const x = 1;\n".repeat(1100),state={files:[{path:"a.js",sha:"a".repeat(40)}],index:0,offset:0,cache:null};let reads=0,parts=[];
 while(state.index===0){const b=await f.auditNextBatch(state,async()=>{reads++;return raw});parts.push(b.sections[0].slice(b.sections[0].indexOf("\n")+1));}
 assert.equal(reads,1);assert.equal(parts.join(""),raw);
});
test("coverage only advances on a complete evidence-bearing model output",()=>{
 assert.match(w,/if\(r\.answer\.incomplete\|\|!batch\.paths\.every/);
 assert.match(w,/state\.checked=nextChecked;state\.batches\+\+;state\.pending=null/);
 assert.match(w,/const complete=done&&!limitations\.length/);
 assert.match(c,/coverage\?2000:12/);
});