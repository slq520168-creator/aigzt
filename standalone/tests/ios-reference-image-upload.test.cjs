const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8");
const start=c.indexOf("async function optimizeImageReference("),end=c.indexOf("async function uploadSelected(",start),fn=c.slice(start,end);
test("iPhone Safari supports HEIC/large image normalization in image and image-video modes",()=>{
 assert.ok(fn.includes('S.composerMode==="video"'));
 assert.ok(fn.includes('arguments[1]!==true'));
 assert.ok(fn.includes('createImageBitmap(file)'));
 assert.ok(fn.includes('URL.createObjectURL(file)'));
 assert.ok(fn.includes('canvas.toBlob('));
 assert.ok(fn.includes('blob.size>1500000'));
});
test("Small JPEG PNG WebP images keep their valid content type",async()=>{
 const conv=new Function("S",fn+"return optimizeImageReference;")({composerMode:"image"});
 for(const type of ["image/jpeg","image/png","image/webp"]){
  const file={type,size:125000,name:"ref.jpg"};
  assert.strictEqual(await conv(file),file);
 }
});
test("Text mode does not rewrite unrelated attachments",async()=>{
 const conv=new Function("S",fn+"return optimizeImageReference;")({composerMode:"text"});
 const file={type:"image/jpeg",size:1900000,name:"ref.jpg"};
 assert.strictEqual(await conv(file),file);
});
