const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const worker=fs.readFileSync("standalone/worker.js","utf8");
const begin=worker.indexOf("const QWEN_EDIT_HOST="),end=worker.indexOf("async function submitHordeImageEdit(",begin);
const section=worker.slice(begin,end);
test("Qwen public edit endpoint accepts one actual uploaded source image and instruction",()=>{
 assert.ok(begin>0&&end>begin);
 assert.ok(section.includes("multimodalart-qwen-image-edit-fast.hf.space"));
 assert.ok(section.includes('"/gradio_api/upload"'));
 assert.ok(section.includes('"/gradio_api/call/infer"'));
 assert.ok(section.includes("const args=[file,prompt.slice(0,1100)"));
 assert.ok(section.includes("detectImage(bytes)!==mime"));
 assert.ok(section.includes('charged_day'));
 assert.doesNotMatch(section,/env\.MEDIA\.put|UPDATE messages SET body=[^\n]*source_image/);
});
test("Qwen falls back to Horde only on definite rejection and not unknown status",()=>{
 const route=worker.slice(worker.indexOf("async function submitHordeImageEdit("),worker.indexOf("function hordeImageResult(",worker.indexOf("async function submitHordeImageEdit(")));
 assert.ok(route.includes("return await submitQwenImageEdit(env,user,imageId,prompt)"));
 assert.ok(route.includes("error?.definite!==true"));
 assert.ok(section.includes("提交结果不确定"));
 assert.ok(route.includes('source_processing:"img2img"'));
});
test("Qwen result is polled and returned to the existing chat inline image renderer",()=>{
 assert.ok(worker.includes('if(ref.v===8&&ref.p==="qwenedit")return qwenEditStatus(env,user,job,ref)'));
 assert.ok(worker.includes('provider==="qwen"?QWEN_EDIT_HOST:KREA'));
 assert.ok(section.includes('await queryGradioImageEvent(env,"qwen",ref.id)'));
 assert.ok(section.includes('saveKreaImage(env,user.id,state.url,true)'));
 assert.ok(section.includes('return response({ok:true,done:true,image,temporary:true'));
 assert.ok(section.includes('status=\'failed\''));
});
test("Qwen integration is syntactically valid and has bounded state transitions",()=>{
 assert.doesNotThrow(()=>new Function(worker.replace(/^export default\s*\{/m,"const workerEntry = {")));
 assert.ok(section.includes("now-job.created_at>15*60000"));
 assert.ok(section.includes("tries>=3"));
 assert.ok(section.includes('DELETE FROM image_jobs WHERE id=? AND user_id=? AND status=\'pending\''));
});
