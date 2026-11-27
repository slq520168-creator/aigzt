const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const w=fs.readFileSync("standalone/worker.js","utf8"),c=fs.readFileSync("standalone/client.js","utf8");
const normalize=new Function("HOSTS","validModelIdentifier","sharedFreeModelId",w.slice(w.indexOf("function normalizeModelPreference("),w.indexOf("function requireModelId("))+";return normalizeModelPreference")({groq:{},openrouter:{}},s=>/^[\w.:/\-]+$/.test(s),s=>s.startsWith("free:or/")?s.slice(8):null);
test("separate chat/work preference validation",()=>{
 assert.ok(normalize({mode:"chat",provider:"free",model:"free:auto",title:"自动模式"}));
 assert.ok(normalize({mode:"chat",provider:"free",model:"free:or/example/model:free",title:"Example"}));
 assert.ok(normalize({mode:"work",provider:"auto",model:"",title:""}));
 assert.ok(normalize({mode:"work",provider:"groq",model:"openai/gpt-oss-120b",title:""}));
 assert.equal(normalize({mode:"work",provider:"free",model:"free:auto",title:""}),null);
 assert.equal(normalize({mode:"chat",provider:"unknown",model:"test",title:""}),null);
});
test("sync is owner-scoped and conditional migrations cannot overwrite another device",()=>{
 assert.match(w,/b\.owner!==user\.id/);
 assert.match(w,/WHERE user_id=\? AND mode=\? AND updated_at=\?/);
 assert.match(w,/ON CONFLICT\(user_id,mode\) DO NOTHING/);
 assert.match(c,/versions\[mode\]!==modelPrefSync\.versions\[mode\]/);
 assert.match(c,/pending\.baseRevision===revision/);
 assert.match(c,/activateModelPrefOwner\(null\)/);
 assert.match(c,/enqueueModelPref\("chat",pref\)/);
 assert.match(c,/enqueueModelPref\("work",workModelPreference\)/);
});
