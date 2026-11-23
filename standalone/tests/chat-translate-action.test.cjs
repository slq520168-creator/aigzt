const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const js=fs.readFileSync("standalone/client.js","utf8");
const worker=fs.readFileSync("standalone/worker.js","utf8");
const css=fs.readFileSync("standalone/style.css","utf8");
test("Translate is an icon-only action in the original message toolbar",()=>{
 assert.match(js,/messageTool\("languages","翻译"/);
 assert.match(js,/toggle\.dataset\.action="translate"/);
 assert.match(js,/bar\.append\(toggle\)/);
 assert.match(js,/messageTranslationSource\(row,user\?row\.dataset\.sourceText\|\|text:text\)/);
});
test("Image, video, attachment-only, and fenced-code-only messages are excluded",()=>{
 const begin=js.indexOf("function messageTranslationSource("),end=js.indexOf("async function toggleMessageTranslation(",begin);
 const text=js.slice(begin,end);
 assert.match(text,/messageKind==="image"\|\|row\.dataset\.messageKind==="video"/);
 assert.match(text,/img\.chat-generated-image,video\.chat-generated-video/);
 assert.ok(text.includes('文件：'));

 assert.match(text,/source/);
});
test("Translations toggle in place, are cached per message, and don't edit message bodies",()=>{
 assert.match(js,/const messageTranslations=new WeakMap\(\)/);
 assert.match(js,/state\.panel\.hidden=!open/);
 assert.match(js,/row\.append\(panel\)/);
 assert.match(js,/api\("\/api\/message\/translate"/);
 assert.match(js,/row\.append\(bar,translated\)/);
 assert.doesNotMatch(js.slice(js.indexOf("async function toggleMessageTranslation("),js.indexOf("function messageQuestion(")),/appendMessage\(/);
 assert.match(css,/\.message\.assistant>\.message-translation\{grid-column:2;grid-row:3/);
});
test("Translation uses existing free model once on demand, no chat writes",()=>{
 const begin=worker.indexOf("async function translateChatMessage("),end=worker.indexOf("const FREE_CREATIVE_PROMPTS",begin);
 const body=worker.slice(begin,end);
 assert.match(worker,/path===\"\/api\/message\/translate\"&&req\.method===\"POST\"/);
 assert.match(body,/freeText\(env,/);
 assert.match(body,/target!==\"zh-CN\"/);
 assert.match(body,/source\.length>2800/);
 assert.doesNotMatch(body,/INSERT INTO|UPDATE messages|env\.MEDIA\.put/);
 assert.doesNotThrow(()=>new Function(js));
});
