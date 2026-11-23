const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const w=fs.readFileSync("standalone/worker.js","utf8"),c=fs.readFileSync("standalone/client.js","utf8");
const imageStart=w.indexOf("async function imageV4Status("),imageEnd=w.indexOf("async function imageJobStatus(",imageStart);
const statusCode=w.slice(imageStart,imageEnd);
test("All free text-to-image sources switch at 50 seconds, not at 140 or 160 seconds",()=>{
 assert.ok(w.includes('IM_IMAGE_STAGES_QUICK=Object.freeze(["zimage","vexa","krea","glm"])'));
 assert.ok(w.includes('async function submitZImageFast('));
 assert.ok(statusCode.includes('if(now-(ref.stageAt||now)>=50000)'));
 assert.ok(statusCode.includes("return imageV4Move(env,job,ref,ref.stage+1)"));
 assert.ok(!statusCode.includes("140000"));
 assert.ok(!statusCode.includes("160000"));
 assert.ok(!statusCode.includes("155000"));
 assert.ok(w.includes("ref.v===9?215000:30*60000"));
});
test("At 49.999 seconds source is still pending; at 50.000 it atomically moves to the next source",async()=>{
 let now=50999,claims=0,advanced=0;
 const run=async()=>{claims++;return {meta:{changes:1}}};
 const mock=new Function("Date","dbRun","imagePending","imageV4Move","failKreaJob","response","IM_IMAGE_STAGES_QUICK","IM_IMAGE_STAGES_FAST","IM_IMAGE_STAGES",
 statusCode+"return imageV4Status;")(
 {now:()=>now},run,()=>({pending:true}),async(_env,_job,ref,stage)=>{advanced++;return {moved:true,stage}},
 async()=>{},x=>x,["zimage","vexa","krea","glm"],["krea","vexa","rio","glm"],["krea","rio","vexa","glm"]);
 const job={id:"j",user_id:"u",status:"pending",created_at:1000,checked_at:50400,external_id:"{}"};
 const ref={v:9,stage:0,stageAt:1000,p:"hello",phase:"event",id:"confirmed"};
 const before=await mock({}, {id:"u"},job,ref);
 assert.equal(before.pending,true);assert.equal(advanced,0);
 now=51000;
 const after=await mock({}, {id:"u"},job,ref);
 assert.equal(after.moved,true);assert.equal(after.stage,1);assert.equal(advanced,1);assert.equal(claims,1);
});
test("Final seconds shorten polling interval but do not continuously query the database",()=>{
 const start=w.indexOf("function imagePending(job){"),end=w.indexOf("function imageRioFindTask(",start);
 const pending=new Function("Date","response",w.slice(start,end)+"return imagePending")(
  {now:()=>50000},x=>x);
 const row={created_at:1000,external_id:JSON.stringify({v:9,stage:0,stageAt:1000})};
 const result=pending(row);
 assert.equal(result.waitSeconds,1);
 assert.ok(c.includes('delay=Math.max(1000,Math.min(18000,Number(r.waitSeconds||12)*1000));'));
 assert.ok(c.includes('now-Number(bubble.dataset.lastImagePoll||0)<900'));
});
test("Unknown source submission waits for its deadline rather than duplicating GPU jobs",()=>{
 assert.ok(statusCode.includes('error?.uncertain&&ref.phase==="new"'));
 assert.ok(statusCode.includes('phase:"unknown"'));
 assert.ok(statusCode.includes('if(ref.phase==="unknown")return imageV4Pending(env,job,ref)'));
 assert.ok(statusCode.includes("status='recovering',checked_at=?"));
 assert.ok(w.includes('DELETE FROM image_jobs WHERE id=? AND user_id=? AND status=\'recovering\''));
});
test("Image-to-image Qwen and anonymous Horde each have a 50-second deadline",()=>{
 const qwen=w.slice(w.indexOf("async function qwenEditStatus("),w.indexOf("async function submitHordeGeneration("));
 const horde=w.slice(w.indexOf("async function hordeStatus("),w.indexOf("const KREA="));
 assert.ok(qwen.includes("now-job.created_at>=50000"));
 assert.ok(qwen.includes("qwenFailoverToHorde"));
 assert.ok(horde.includes("ref.startedAt)||job.created_at)>=50000"));
 assert.ok(w.includes('const next={v:7,p:"horde",id:eventId,startedAt:Date.now()}'));
 assert.doesNotThrow(()=>new Function(w.replace(/^export default\s*\{/m,"const workerEntry = {")));
});
