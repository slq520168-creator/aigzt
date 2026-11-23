const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const worker=fs.readFileSync('standalone/worker.js','utf8');
const begin=worker.indexOf('function hordeImageResult('),end=worker.indexOf('async function hordeStatus(',begin);
const resolve=new Function('URL','detectImage',worker.slice(begin,end)+'return hordeImageResult;')(URL,a=>a[0]===137?'image/png':'image/webp');
test('Accept documented Horde HTTPS results instead of interpreting them as base64',()=>{
 assert.equal(resolve('https://cdn.example.com/output.webp'),'https://cdn.example.com/output.webp');
 assert.match(worker,/const image=hordeImageResult\(raw\)/);
 assert.doesNotMatch(worker,/const payload=raw\.startsWith\("data:image\/webp/);
});
test('Reject loopback, HTTP, and credentialed result URLs',()=>{
 for(const input of ['http://cdn.example.com/output.webp','https://127.0.0.1/output.webp','https://localhost/output.webp','https://u:p@example.com/img.png']){
  assert.equal(resolve(input),'',input);
 }
 assert.doesNotMatch(worker.slice(begin,end),/fetch\(/);
});
test('Generated image results remain temporary',()=>{
 assert.match(worker,/return response\(\{ok:true,done:true,image,temporary:true/);
 assert.match(worker,/now-Number\(job\.checked_at\|\|0\)<15000/);
});
