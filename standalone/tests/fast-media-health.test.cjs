const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const worker=fs.readFileSync("standalone/worker.js","utf8"),client=fs.readFileSync("standalone/client.js","utf8");
function span(from,to){const a=worker.indexOf(from),b=worker.indexOf(to,a+from.length);assert.ok(a>=0&&b>a,from+" boundaries");return worker.slice(a,b)}
test("New image jobs start at fast source, never at a 140-second Krea queue",()=>{
 assert.ok(worker.includes('const IM_IMAGE_STAGES_QUICK=Object.freeze(["zimage","vexa","krea","glm"])'));
 assert.ok(worker.includes('const IM_IMAGE_STAGES_FAST=Object.freeze(["krea","vexa","rio","glm"])'));
 const submit=span("async function submitKrea(","async function failKreaJob(");
 assert.ok(submit.includes("v:9,stage:0,phase:"));
 assert.ok(!submit.includes('submitGradioImage(env,"krea"'));
 assert.ok(submit.includes('INSERT INTO image_jobs'));
 const status=span("async function imageV4Status(","async function imageJobStatus(");
 assert.ok(status.includes('ref.v===9?IM_IMAGE_STAGES_QUICK'));
 assert.ok(status.includes('ref.v===9?75000'));
 assert.ok(status.includes('ref.phase!=="new"'));
 assert.ok(worker.includes('if([4,5,6,9].includes(ref.v)'));
});
test("Z-Image uses exact official six input arguments and a real Gradio event",async()=>{
 const source=span("async function submitZImageFast(","async function submitKrea(");
 const calls=[];
 const run=new Function("ZIMAGE_FAST","imageShape","imageStyledPrompt","hfHeaders","fetch","AbortSignal",source+"return submitZImageFast;")(
  "https://mrfakename-z-image-turbo.hf.space",()=>[768,1024],s=>s,()=>({}),async(url,opts)=>{
   calls.push({url,body:JSON.parse(opts.body)});
   return {ok:true,status:200,json:async()=>({event_id:"testevent123456789"})}
  },{timeout:()=>({})});
 const result=await run({}, {p:"cat under a tree",s:"portrait",t:"",seed:7});
 assert.equal(result,"testevent123456789");
 assert.equal(calls.length,1);
 assert.equal(calls[0].url,"https://mrfakename-z-image-turbo.hf.space/gradio_api/call/generate_image");
 assert.deepEqual(calls[0].body.data,["cat under a tree",1024,768,9,7,false]);
});
test("Confirmed Qwen generation failure transitions the SAME job to one Horde fallback",async()=>{
 const source=span("async function qwenEditStatus(","async function submitHordeGeneration("),updates=[];
 let submissions=0;
 const run=new Function("hordeUuid","dbRun","response","queryGradioImageEvent","submitHordeGeneration","QWEN_EDIT_OFFICIAL","saveKreaImage",source+"return qwenEditStatus;")(
  v=>/^[0-9a-f-]{36}$/.test(v),async(db,sql,...args)=>{updates.push({sql,args});return {meta:{changes:1}}},
  d=>d,async()=>({status:"failed"}),async()=>{submissions++;return "12345678-1234-1234-1234-123456789012"},
  "https://huggingface.co/spaces/multimodalart/Qwen-Image-Edit-Fast",()=>{throw Error("unexpected image download")});
 const job={id:"00000000-0000-4000-8000-000000000001",created_at:Date.now()-20000,checked_at:0,status:"pending"};
 const ref={v:8,p:"qwenedit",id:"testevent123456789",imageId:"00000000-0000-4000-8000-000000000002",prompt:"Make the sky blue"};
 const r=await run({DB:{}},{id:"u"},job,ref);
 assert.equal(r.pending,true);assert.equal(submissions,1);
 assert.ok(updates.some(x=>x.sql.includes("status='recovering'")));
 const persisted=updates.find(x=>x.sql.includes("status='pending',checked_at=0"));
 assert.ok(persisted);
 assert.deepEqual(JSON.parse(persisted.args[0]),{v:7,p:"horde",id:"12345678-1234-1234-1234-123456789012"});
});
test("Video terminal SSE quota failure is visible, sanitized and releases task",async()=>{
 const source=span("function freeVideoFailure(","async function fvSave(");
 const wire="event: error\ndata: You have exceeded your GPU quota\n\n";
 const buf=new TextEncoder().encode(wire);
 let count=0;
 const f=new Function("fetch","hfHeaders","AbortSignal","TextDecoder",source+"return fvPoll;")(
  async()=>({ok:true,status:200,body:{getReader:()=>({read:async()=>count++?{done:true}:{done:false,value:buf},cancel:async()=>{}})}}),
  ()=>({}),{timeout:()=>({})},TextDecoder);
 const state=await f({},{url:"https://example.hf.space"},"event12345678");
 assert.deepEqual(state,{status:"failed",error:"免费GPU额度或请求次数已耗尽"});
 assert.ok(worker.includes('status=\'failed\',error=? WHERE id=? AND user_id=? AND status=\'pending\''));
 assert.ok(worker.includes('Date.now()-job.created_at>600000'));
});
test("Chat and modal display the actual failure and a verified official source",()=>{
 assert.ok(client.includes('作图未完成："+detail'));
 assert.ok(client.includes('response.status==="failed"?response.error'));
 assert.ok(client.includes('打开免费来源查看使用条件'));
 assert.ok(client.includes('r.error||"免费来源暂不可用"'));
 assert.doesNotThrow(()=>new Function(client));
 assert.doesNotThrow(()=>new Function(worker.replace(/^export default\s*\{/m,"const workerEntry = {")));
});
