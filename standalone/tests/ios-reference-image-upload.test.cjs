const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const client=fs.readFileSync('standalone/client.js','utf8');
const start=client.indexOf('async function optimizeImageReference('),end=client.indexOf('async function uploadSelected(',start),fn=client.slice(start,end);
test('Only image-mode references are normalized; small supported attachments remain native',()=>{
 assert.match(fn,/if\(S\.composerMode!=="image"\)return file/);
 assert.match(fn,/if\(standard&&file\.size<=1450000\)return file/);
 assert.match(fn,/new File\(\[blob\]/);
});
test('iOS image decoding fallback avoids a hard createImageBitmap failure',()=>{
 assert.match(fn,/try\{bitmap=await createImageBitmap\(file\)\}catch\{\}/);
 assert.match(fn,/objectUrl=URL\.createObjectURL\(file\)/);
 assert.match(fn,/preview=await new Promise/);
 assert.match(fn,/new Image\(\)/);
 assert.match(fn,/URL\.revokeObjectURL\(objectUrl\)/);
});
test('Output is a valid JPEG no larger than image edit backend accepts',()=>{
 assert.match(fn,/blob\.type==="image\/jpeg"/);
 assert.match(fn,/blob\.size>1500000/);
 assert.match(fn,/type:"image\/jpeg"/);
 assert.doesNotThrow(()=>new Function(client));
});
