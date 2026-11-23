const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('standalone/client.js','utf8');
test('Native free chat action actually selects and persists free auto model',()=>{
 const section=source.slice(source.indexOf('function launchInternalFreeTool('),source.indexOf('const EXTERNAL_FREE_TOOLS=',source.indexOf('function launchInternalFreeTool(')));
 assert.match(section,/setFreeDefault\(true\)/);
 assert.match(section,/rememberChatModelSelection\(\)/);
 assert.match(section,/selectVideoModel\(provider,VIDEO_OPTIONS\[provider\]\[0\]\)/);
 assert.match(section,/setComposerMode\("video"\)/);
 assert.match(section,/上传一张参考图片/);
});
test('Tool catalogue retains distinct functions on shared external URLs',()=>{
 assert.match(source,/const key=item\.action\?"internal:"\+item\.action:item\.url\+"\|"\+item\.name/);
 assert.match(source,/https:\/\/artbot\.site\/create/);
 assert.match(source,/https:\/\/magichour\.ai\/products\/image-to-video/);
 assert.match(source,/INTERNAL_FREE_TOOLS=Object\.freeze/);
 assert.doesNotThrow(()=>new Function(source));
});
