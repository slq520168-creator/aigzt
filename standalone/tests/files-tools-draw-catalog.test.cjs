const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('standalone/client.js','utf8'),css=fs.readFileSync('standalone/style.css','utf8'),html=fs.readFileSync('standalone/index.html','utf8'),worker=fs.readFileSync('standalone/worker.js','utf8');
test('file library has original upload timestamp, type icon and persistent back button',()=>{
 assert.match(worker,/uploadedAt:x\.uploaded\?new Date\(x\.uploaded\)\.toISOString/);
 assert.match(html,/<button type="button" class="close-modal page-back" data-close="filesDialog"[\s\S]*?<svg/);
 const f=js.slice(js.indexOf('function uploadedFileKind('),js.indexOf('function renderUploadedFiles('));
 const kind=new Function(f+';return uploadedFileKind')();
 assert.equal(kind({type:'image/png'}),'image');assert.equal(kind({name:'video.mp4'}),'video');assert.equal(kind({name:'report.pdf'}),'file-text');
});
test('tool names and captions are not clipped and icon fallback is local',()=>{
 for(const selector of ['free-tool-name','free-tool-function']){const rule=css.match(new RegExp('\\.'+selector+'\\{[^}]+\\}'))[0];assert.doesNotMatch(rule,/line-clamp|overflow:hidden/);assert.match(rule,/white-space:normal/)}
 assert.match(js,/const freeToolLogoLoads=new Map/);assert.match(js,/fallback\.innerHTML='<svg/);
 assert.match(js,/if\(list\.children\.length!==FREE_TOOL_CATEGORIES\.length\)/);
});
test('Russia grouping matches actual owner, aliases and connected provider',()=>{
 const f=js.slice(js.indexOf('const RUSSIAN_MODEL_GROUPS='),js.indexOf('const FAMILY_CONNECTIONS='));
 const group=new Function(f+';return russianGroupFor')();
 assert.equal(group({provider:'yandex',id:'gpt://folder/model'}).id,'yandex');
 assert.equal(group({provider:'openrouter',author:'sber',id:'chat'}).id,'gigachat');
 assert.equal(group({provider:'openrouter',id:'openai/gpt-4o'}),null);
});
test('draw navigation does not cancel or erase images; delivery phase is not discarded at stage deadline',()=>{
 assert.doesNotMatch(js,/\$\("createDialog"\)\.addEventListener\("close",\(\)=>\{\s*stopDrawBatch/);
 assert.match(js,/function showDrawRetry\(/);assert.match(worker,/ref\.phase!=="deliver"&&now-\(ref\.stageAt\|\|now\)>=50000/);
 assert.match(js,/Math\.max\(1000,Math\.min\(14000,Number\(r\.waitSeconds/);
});
test('client parses',()=>assert.doesNotThrow(()=>new Function(js)));
