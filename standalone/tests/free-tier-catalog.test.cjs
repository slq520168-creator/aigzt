const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('standalone/client.js','utf8'),w=fs.readFileSync('standalone/worker.js','utf8');
test('published free-tier catalog has twelve distinct personal-key routes and never marks these unconditional free',()=>{
 const source=w.slice(w.indexOf('const PERSONAL_FREE_TIER_MODELS='),w.indexOf('const HOSTS='));
 const rows=new Function(source+';return PERSONAL_FREE_TIER_MODELS')();
 assert.equal(rows.length,12);
 assert.equal(new Set(rows.map(m=>m.provider+'|'+m.id)).size,12);
 assert.ok(rows.every(m=>m.free===false&&m.freeTier&&m.requiresPersonalKey&&m.type==='text'));
 assert.equal(rows.filter(m=>m.provider==='groq').length,3);
 assert.equal(rows.filter(m=>m.provider==='gemini').length,9);
});
test('free filter includes conditional models; existing personal billing consent is not relaxed',()=>{
 const code=js.slice(js.indexOf('function hasFreeAccess('),js.indexOf('function modelMatches('));
 const isFree=new Function(code+';return hasFreeAccess')();
 assert.ok(isFree({freeTier:true,free:false}));assert.ok(isFree({free:true}));assert.equal(isFree({free:false}),false);
 assert.match(js,/个人免费额度 · 付费账号可能收费/);
 assert.match(w,/!isOpenRouterFree&&!isPublishedFree&&consent!==true/);
 assert.match(w,/freeTierModels:PERSONAL_FREE_TIER_MODELS/);
 assert.doesNotThrow(()=>new Function(js));
});
test('connected models merge with official free-tier rows instead of duplicating',()=>{
 const code=js.slice(js.indexOf('function allModels(){'),js.indexOf('function hasFreeAccess('));
 const row={id:'openai/gpt-oss-20b',provider:'groq',type:'text',free:false,freeTier:true};
 const S={freeModels:[],remoteModels:[],freeTierModels:[row],connected:{groq:[{id:row.id,name:'GPT OSS',type:'text'}]}};
 const merged=new Function('S','BUILTIN_VIDEO_MODELS',code+';return allModels()')(S,[]);
 assert.equal(merged.length,1);assert.equal(merged[0].freeTier,true);assert.equal(merged[0].free,false);
});
