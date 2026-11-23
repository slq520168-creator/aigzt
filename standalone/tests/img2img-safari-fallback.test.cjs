const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const client=fs.readFileSync('standalone/client.js','utf8'),worker=fs.readFileSync('standalone/worker.js','utf8');
const start=client.indexOf('async function optimizeImageReference('),end=client.indexOf('async function uploadSelected(',start);
const fnCode=client.slice(start,end);
test('Small JPG/PNG/WebP files upload directly without conversion',async()=>{
 const factory=new Function('S',fnCode+'return optimizeImageReference;');
 const transform=factory({composerMode:'image'});
 for(const type of ['image/jpeg','image/png','image/webp']){
  const src={type,size:1300000,name:'source.png'};
  assert.equal(await transform(src),src);
 }
});
test('Safari PNG fallback remains valid instead of throwing WebP unsupported',async()=>{
 const fakeFile=class {constructor(parts,name,opts){this.name=name;this.type=opts.type;this.size=parts[0].size}};
 const make=new Function('S','document','createImageBitmap','File',fnCode+'return optimizeImageReference;');
 const transform=make({composerMode:'image'},{
  createElement:()=>({width:0,height:0,getContext:()=>({drawImage(){}}),
   toBlob:cb=>cb({type:'image/png',size:270000})})
 },async()=>({width:1000,height:1000,close(){}}),fakeFile);
 const result=await transform({name:'photo.heic',type:'image/heic',size:1800000});
 assert.equal(result.type,'image/png');
 assert.equal(result.name,'photo.png');
});
test('A normal text/chat/video upload is untouched',async()=>{
 const transform=new Function('S',fnCode+'return optimizeImageReference;')({composerMode:'text'});
 const f={type:'image/jpeg',name:'a.jpg',size:2300000};
 assert.equal(await transform(f),f);
});
test('Server authenticates original R2 file and validates actual image type',()=>{
 assert.ok(worker.includes('["image/webp","image/jpeg","image/png"].includes(mime)'));
 assert.ok(worker.includes('detectImage(bytes)!==mime'));
 assert.ok(worker.includes('source_processing:"img2img"'));
 assert.ok(worker.includes('imgId?await submitHordeImageEdit'));
 assert.doesNotMatch(client,/浏览器无法生成 WebP 参考图|需要转换，请在图生图模式重新添加/);
 assert.doesNotThrow(()=>new Function(client));
});
