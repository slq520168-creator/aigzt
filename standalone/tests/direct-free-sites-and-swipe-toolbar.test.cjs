const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('standalone/index.html','utf8');
const js=fs.readFileSync('standalone/client.js','utf8');
const css=fs.readFileSync('standalone/style.css','utf8');
test('Free tools page is only direct real HTTPS external links, no GZT chat cards',()=>{
 assert.doesNotMatch(js,/INTERNAL_FREE_TOOLS|launchInternalFreeTool|free-tool-internal/);
 assert.match(js,/const EXTERNAL_FREE_TOOLS=\[\.\.\.ORIGINAL_GENERATION_SITES/);
 assert.match(js,/const a=node\("a","free-tool-card"\)/);
 assert.match(js,/a\.href=item\.url;a\.target="_blank";a\.rel="noopener noreferrer"/);
 assert.match(js,/const u=new URL\(item\.url\);if\(u\.protocol!=="https:"\)return false/);
});
test('Original upstream source links and ArtBot GUI are directly navigable',()=>{
 for(const url of [
 "https://krea-krea-2.hf.space/",
 "https://multimodalart-glm-image.hf.space/",
 "https://rioshiina-imagegen.hf.space/",
 "https://aihorde.net/",
 "https://artbot.site/create",
 "https://alexcheng0072-wan27-free-video-generator.hf.space/",
 "https://zerogpu-aoti-wan2-2-fp8da-aoti-faster.hf.space/",
 "https://mcp-tools-wan-2-2-first-last-frame.hf.space/"
 ])assert.ok(js.includes(url),url);
});
test('Composer retains old three icons and extends with four tiny icon-labelled tools horizontally swipeable',()=>{
 const row=html.slice(html.indexOf('id="toolTray"'),html.indexOf('</div>',html.indexOf('id="toolTray"')));
 const ids=['imageMode','videoMode','codeToggle','miniImageEdit','miniTextVideo','miniImageVideo','miniFrameVideo'];
 let previous=-1;for(const id of ids){const p=row.indexOf('id="'+id+'"');assert.ok(p>previous,id);previous=p}
 for(const icon of ['images','video','film','clapperboard'])assert.ok(row.includes('data-icon="'+icon+'"'),icon);
 assert.match(css,/\.tool-tray\{[^\n]*flex-wrap:nowrap[^\n]*overflow-x:auto[^\n]*touch-action:pan-x/);
 assert.match(css,/\.tool-tray \.mini-tool \.ui-icon/);
 assert.doesNotThrow(()=>new Function(js));
});
