const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const js=fs.readFileSync("standalone/client.js","utf8");
const worker=fs.readFileSync("standalone/worker.js","utf8");
const css=fs.readFileSync("standalone/style.css","utf8");
test("Translate icon has its own SVG glyph instead of the folder fallback",()=>{
 const begin=js.indexOf("const ICONS={"),end=js.indexOf("/* Local two-tone",begin);
 assert.ok(begin>=0&&end>begin);
 const icons=new Function("return "+js.slice(begin+"const ICONS=".length,end).trim().replace(/;$/,""))();
 assert.ok(icons.languages?.includes("<path"));
 assert.notEqual(icons.languages,icons.folder);
 assert.match(js,/languages:"blue"/);
});
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
test("Translation uses dedicated low-latency providers without message writes",()=>{
 const begin=worker.indexOf("async function translateChatMessage("),end=worker.indexOf("const FREE_CREATIVE_PROMPTS",begin);
 const body=worker.slice(begin,end);
 assert.match(worker,/path===\"\/api\/message\/translate\"&&req\.method===\"POST\"/);
 assert.match(body,/GROQ_FREE_KEY/);
 assert.match(body,/OPENROUTER_FREE_KEY/);
 assert.match(body,/reasoning_effort="low"/);
 assert.match(body,/source\.length>8000/);
 assert.doesNotMatch(body,/freeText\(env|INSERT INTO|UPDATE messages|env\.MEDIA\.put/);
 assert.doesNotThrow(()=>new Function(js));
});
test("Translation errors are retryable instead of permanently cached",()=>{
 assert.match(js,/if\(state\?\.failed\)/);
 assert.match(js,/state\.failed=true/);
});
test("All literal toolbar icons are implemented without file-folder fallback",()=>{
 const html=fs.readFileSync("standalone/index.html","utf8");
 const part=js.slice(js.indexOf("const ICONS={")+12,js.indexOf("};\n/* Local two-tone"));
 const keys=[...part.matchAll(/(?:^|\n)\s*(?:'([^']+)'|([a-zA-Z0-9_-]+))\s*:/g)].map(m=>m[1]||m[2]);
 const used=[...html.matchAll(/data-icon="([^"]+)"/g),...js.matchAll(/(?:iconSlot|messageTool|iconButton)\("([^"]+)"/g)].map(m=>m[1]);
 for(const name of used)assert.ok(keys.includes(name),"Missing icon: "+name);
 assert.match(js,/path=ICONS\[name\]\|\|ICONS\.info/);
 for(const icon of ["languages","scan","film","clapperboard"])assert.ok(keys.includes(icon));
});
test("Fast translator returns real Chinese output using a mocked upstream response",async()=>{
 const begin=worker.indexOf("async function translateChatMessage("),end=worker.indexOf("const FREE_CREATIVE_PROMPTS",begin);
 const fnCode=worker.slice(begin,end);
 let calls=0;
 const mockFetch=async(url,opts)=>{
  calls++;
  assert.equal(url,"https://api.groq.com/openai/v1/chat/completions");
  assert.equal(opts.headers.authorization,"Bearer testing-groq-123456");
  const payload=JSON.parse(opts.body);
  assert.equal(payload.model,"openai/gpt-oss-20b");
  assert.equal(payload.reasoning_effort,"low");
  return {ok:true,status:200,json:async()=>({choices:[{message:{content:"这是一条测试消息。"}}]})};
 };
 const fn=new Function("requireUser","parseJSON","fetch","AbortSignal",fnCode+"return translateChatMessage;")(
  user=>assert.ok(user),async()=>({text:"This is a test message.",target:"zh-CN"}),mockFetch,AbortSignal);
 const translated=await fn({}, {GROQ_FREE_KEY:"testing-groq-123456"}, {id:"test"});
 assert.equal(translated.translation,"这是一条测试消息。");
 assert.equal(calls,1);
});
