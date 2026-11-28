const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const file=n=>fs.readFileSync('standalone/'+n,'utf8');
test('Image thumbnails have no filename; documents preserve filenames',()=>{
 const s=file('client.js');
 assert.match(s,/badge\.append\(thumb,del\)/);
 assert.match(s,/else badge\.append\(title,del\)/);
 assert.match(s,/frame\.append\(img\);bubble\.append\(frame\)/);
 assert.doesNotMatch(s,/frame\.append\(img,node\("span","chat-file-caption",name\)\)/);
});
test("Historical video may be restored but never submits a new generation",()=>{assert.doesNotMatch(file("client.js"),/function inlineVideoJob\(/);assert.match(file("worker.js"),/function fvMedia\(/)});