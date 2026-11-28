const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),w=fs.readFileSync("standalone/worker.js","utf8");
test("Cross-device favorite overflow preserves prior entries and repeated operations do not resurrect removals",async()=>{
 const rows=new Map(),env={DB:{}},user={id:"a"};
 const get=async(db,sql,u,k)=>rows.get(u+"|"+k)||null;
 const run=async(db,sql,...args)=>{if(sql.startsWith("UPDATE")){const [items_json,revision,u,k,prev]=args,key=u+"|"+k;if(rows.get(key)?.revision!==prev)return {meta:{changes:0}};rows.set(key,{items_json,revision})}else{const [u,k,items_json,revision]=args,key=u+"|"+k;if(rows.has(key))return {meta:{changes:0}};rows.set(key,{items_json,revision})}return {meta:{changes:1}}};
 const f=new Function("requireUser","parseJSON","ensureStabilitySchema","dbGet","dbRun","response","fail",w.slice(w.indexOf("function cleanCatalogFavorite("),w.indexOf("async function reservedSubmission("))+";return catalogFavorites")(()=>{},async req=>req,async()=>{},get,run,x=>x,(message,status)=>({message,status}));
 const entry=i=>({key:"site:https://example.com/"+i}),ops=Array.from({length:40},(_,i)=>({id:"a"+i,entry:entry(i),active:true})),call=ops=>f({owner:"a",kind:"tools",ops},env,user);
 assert.equal((await call(ops)).items.length,40);
 assert.deepEqual((await call([{id:"extra",entry:entry(40),active:true}])).rejected,["extra"]);
 assert.equal((await call([{id:"del",entry:entry(0),active:false},{id:"extra",entry:entry(40),active:true}])).items.length,40);
 assert.ok(!(await call([ops[0]])).items.some(x=>x.key===entry(0).key));
});
test("Continuation reuses request payload and chat opening blocks competing sends",()=>{assert.ok(c.includes("row._continuationPayload"));assert.ok(c.includes("S.busy||chatOpenLoading"));assert.ok(c.includes("delete row._continuationPayload"));});
