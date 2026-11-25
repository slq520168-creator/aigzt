const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('standalone/client.js','utf8');
const h=new Function(js.slice(js.indexOf('function imagePromptLabel('),js.indexOf('function renderAssistantText('))+'return {normalizePromptSections,imagePromptPayload,isDirectImageRequest}')();
test('repairs label-only blocks and keeps the actual prompt copyable',()=>{
 const mark='\x60\x60\x60';const out=h.normalizePromptSections([mark,'人物：美月','中文正向提示词:',mark,'','真实高清摄影','',mark,'English prompt:',mark,'','ultra-realistic photo']).join('\n');
 assert.ok(out.includes(mark+'image-prompt\n真实高清摄影'));assert.ok(out.includes(mark+'image-prompt\nultra-realistic photo'));
 assert.match(js,/b\.closest\("pre"\)\?\.querySelector\("code"\)/);
});
test('explicit image requests route to media and prompt writing stays text',()=>{
 assert.equal(h.isDirectImageRequest('帮我画一张海边照片'),true);
 assert.equal(h.isDirectImageRequest('生成20套人物作图提示词'),false);
 assert.equal(h.isDirectImageRequest('只生成提示词，不直接生成图片'),false);
 assert.equal(h.imagePromptPayload('姓名：美月\n中文正向提示词：高清摄影\nEnglish prompt: photo\n负面提示词：模糊'),'高清摄影');
});
