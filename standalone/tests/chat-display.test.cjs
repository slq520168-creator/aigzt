const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=x=>fs.readFileSync('standalone/'+x,'utf8');
test('Three text sizes preview before save and persist after save',()=>{
 const h=read('index.html'),s=read('style.css'),j=read('client.js');
 for(const value of ['small','normal','large'])assert.match(h,new RegExp('name="chatTextSize" value="'+value+'"'));
 assert.match(j,/previewChatTextSize\(radio\.value\)/);
 assert.match(j,/localStorage\.setItem\(CHAT_TEXT_SIZE_KEY,selected\)/);
 assert.match(j,/applyChatTextSize\(savedChatTextSize\(\)\)/);
 assert.match(s,/--aigzt-chat-text-size/);
});
test('Original chat and uploader show local images, including standalone image-only messages',()=>{
 const h=read('index.html'),s=read('style.css'),j=read('client.js');
 assert.match(h,/id="attachmentPreview"/);
 assert.match(j,/node\("img","attachment-thumb"\)/);
 assert.match(j,/chat-user-image-attachment/);
 assert.match(j,/heic\|heif/);
 assert.match(j,/parts\.some\(part=>part\.file\)/);
 assert.match(s,/max-width:1100px/);
 assert.match(s,/padding:10px 7px 18px/);
});
test('Chat client is syntactically valid',()=>{assert.doesNotThrow(()=>new Function(read('client.js')))});