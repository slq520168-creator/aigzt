const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const client=fs.readFileSync('standalone/client.js','utf8'),css=fs.readFileSync('standalone/style.css','utf8');
test('Internal free tools cover chatting, text/image creation and image/video references',()=>{
 for(const action of ['chat','text-image','image-edit','text-video','image-video','frame-video'])
  assert.match(client,new RegExp('action:"'+action+'"'));
 assert.match(client,/setFreeToolsMode\(false\)/);
 assert.match(client,/setComposerMode\("image"\)/);
 assert.match(client,/setComposerMode\("video"\)/);
 assert.match(client,/S\.videoModel=VIDEO_OPTIONS\[provider\]\[0\]/);
 assert.match(client,/launchInternalFreeTool\(item\.action\)/);
});
test('External no-login and free-community image/video tools are integrated without deleting existing catalog',()=>{
 for(const url of ['aicreate.com/ai-photo-editor/','wan2.video/free-ai-video-generator','raphael.app/ai-video-generator','magichour.ai/products/image-to-video','horde.tazlin.net/','upsampler.com/free-image-editing-model-no-signup'])
  assert.ok(client.includes(url),url);
 assert.match(client,/\.\.\.CURATED_FREE_TOOLS,\.\.\.ROLEPLAY_MEDIA_TOOLS,\.\.\.VERIFIED_ADDITIONAL_FREE_TOOLS/);
 assert.match(client,/item\.action\?"internal:"\+item\.action:item\.url/);
 assert.match(css,/repeat\(4,minmax\(0,1fr\)\)/);
});
test('iPhone HEIC references may convert to webp for image editing',()=>{
 assert.match(client,/image\/heic/);
 assert.match(client,/createImageBitmap\(file\)/);
 assert.doesNotThrow(()=>new Function(client));
});
