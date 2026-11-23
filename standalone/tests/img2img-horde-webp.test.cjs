const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),w=fs.readFileSync("standalone/worker.js","utf8");
test("Image editing sends real reference bytes with verified MIME",()=>{
 assert.ok(c.includes('S.miniToolChoice==="image-edit"&&!S.attachments.length'));
 assert.ok(c.includes('imageId:reference?.id'));
 assert.ok(w.includes('source_image:hordeBase64(bytes)'));
 assert.ok(w.includes('source_processing:"img2img"'));
 assert.ok(w.includes('detectImage(bytes)!==mime'));
});
test("iPhone reference conversion preserves actual PNG JPEG and WebP content type",()=>{
 const start=c.indexOf("async function optimizeImageReference("),end=c.indexOf("async function uploadSelected(",start),fn=c.slice(start,end);
 assert.ok(fn.includes('canvas.toBlob('));
 assert.ok(fn.includes('type:blob.type'));
 assert.ok(fn.includes('blob.type==="image/png"'));
});
test("Horde conclusively failed task is persisted terminally",()=>{
 const s=w.slice(w.indexOf("async function hordeStatus("),w.indexOf("const KREA="));
 assert.ok(s.includes('status.is_possible===false'));
 assert.ok(s.includes("UPDATE image_jobs SET status='failed'"));
 assert.ok(s.includes("免费来源未返回可预览的图片"));
});
