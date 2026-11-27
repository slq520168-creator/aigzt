const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('standalone/client.js','utf8'),w=fs.readFileSync('standalone/worker.js','utf8');
test('only real zero-price text models with a configured shared key are exposed',()=>{
 const code=w.slice(w.indexOf('const SHARED_FREE_PREFIX='),w.indexOf('async function verifiedSharedFreeModel('));
 const catalog=new Function('validModelIdentifier',code+';return sharedFreeCatalog')(()=>true);
 const row={id:'google/gemma:free',name:'Gemma (free)',provider:'google',type:'text',free:true,zeroText:true,outputText:true,outputImages:false};
 const env={OPENROUTER_FREE_KEY:'test-only-example-key'};
 const r=catalog(env,[row,{...row,id:'x/paid',free:false},{...row,id:'x/image:free',outputImages:true},{...row,id:'x/request:free',zeroText:false}]);
 assert.equal(r.length,1);assert.equal(r[0].id,'free:or/google/gemma:free');assert.equal(r[0].shared,true);assert.equal(catalog({},[row]).length,0);
});
test('named route validates live catalog, pins requested model and sets hard zero price',()=>{
 assert.match(w,/await verifiedSharedFreeModel\(env,model\)/);
 assert.match(w,/result=sharedModel\?await callExternal\("openrouter",sharedModel,env.OPENROUTER_FREE_KEY/);
 assert.match(w,/max_price:\{prompt:0,completion:0,request:0,image:0\}/);
 assert.match(w,/if\(!sharedModel&&result.incomplete/);
 assert.match(js,/S.provider=via;S.model=row.id/);
 assert.match(js,/S.model===m.id/);
 assert.doesNotThrow(()=>new Function(js));
});
test('same upstream model is not counted twice for unbound accounts',()=>{
 const code=js.slice(js.indexOf('function allModels(){'),js.indexOf('function hasFreeAccess('));
 const S={freeModels:[],remoteModels:[{provider:'openrouter',id:'a:free'}],sharedFreeModels:[{provider:'free',id:'free:or/a:free',sharedModel:'a:free'}],freeTierModels:[],connected:{},savedProviders:{}};
 const rows=new Function('S','BUILTIN_VIDEO_MODELS',code+';return allModels()')(S,[]);
 assert.equal(rows.length,1);assert.equal(rows[0].provider,'free');
});
