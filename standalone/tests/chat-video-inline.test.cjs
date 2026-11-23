const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const file=n=>fs.readFileSync('standalone/'+n,'utf8');
test('Video status automatically advances within the same assistant bubble',()=>{
 const s=file('client.js');
 assert.match(s,/function inlineVideoJob\(bubble,id\)/);
 assert.match(s,/createImageWaitingFrame\(\)/);
 assert.match(s,/schedule\(0\)/);
 assert.match(s,/Math\.max\(15000,Math\.min\(60000/);
 assert.match(s,/document\.hidden/);
 assert.match(s,/appendMessage\("assistant","\[\[aigzt:video:"/);
 assert.doesNotMatch(s,/视频已提交，点击查询进度/);
 assert.doesNotThrow(()=>new Function(s));
});
test('Image thumbnails have no filename; documents preserve filenames',()=>{
 const s=file('client.js');
 assert.match(s,/badge\.append\(thumb,del\)/);
 assert.match(s,/else badge\.append\(title,del\)/);
 assert.match(s,/frame\.append\(img\);bubble\.append\(frame\)/);
 assert.doesNotMatch(s,/frame\.append\(img,node\("span","chat-file-caption",name\)\)/);
});
test('Video status returns original start time without fabricating percentages',()=>{
 const s=file('worker.js');
 assert.match(s,/waitSeconds:15,startedAt:job\.created_at/);
 assert.doesNotMatch(file('client.js').slice(file('client.js').indexOf('function inlineVideoJob('),file('client.js').indexOf('function appendMessage(',file('client.js').indexOf('function inlineVideoJob('))),/\/api\/chat\/media/);
});