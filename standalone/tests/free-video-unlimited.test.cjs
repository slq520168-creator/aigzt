const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const code=fs.readFileSync('standalone/worker.js','utf8');
const begin=code.indexOf('async function fvCreate('),end=code.indexOf('\nfunction fvOutput(',begin);
const create=code.slice(begin,end);
test('Free video has no daily count query or hard 2-per-day cap',()=>{
 assert.ok(begin>0&&end>begin);
 assert.doesNotMatch(create,/COUNT\(\*\).*video-free/);
 assert.doesNotMatch(create,/今天免费生成已达到两次上限|>=2\)/);
 assert.doesNotMatch(create,/Math\.floor\(Date\.now\(\)\/86400000\)/);
});
test('Free video retains one active task guard to prevent duplicate generation',()=>{
 assert.match(create,/status IN \('pending','recovering'\)/);
 assert.match(create,/已有免费视频任务正在生成/);
 assert.match(create,/\/gradio_api\/call\/generate_video/);
 assert.match(create,/INSERT INTO image_jobs/);
});
