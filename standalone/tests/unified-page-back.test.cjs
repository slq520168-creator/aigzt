const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('standalone/index.html','utf8'),js=fs.readFileSync('standalone/client.js','utf8'),css=fs.readFileSync('standalone/style.css','utf8');
test('all named secondary pages have one fixed compact heading containing the original back button and title',()=>{
 for(const d of html.matchAll(/<dialog id="([^"]+)"[\s\S]*?<\/dialog>/g)){
  assert.match(d[0],/^<dialog[^>]*>\s*<div class="page-heading[^"]*">\s*<button[^>]*page-back[\s\S]*?<\/button>\s*<h2/);
  assert.ok(d[0].includes('data-close="'+d[1]+'"'));
 }
 for(const id of ['workClose','freeToolsClose'])assert.match(html,new RegExp('<div class="page-heading[^"]*">\\s*<button[^>]*id="'+id+'"[^>]*>[\\s\\S]*?<\\/button><h2'));
 assert.match(css,/\.page-heading\{display:flex;align-items:center/);
 assert.match(css,/\.page-back\{[^}]*border:0;[^}]*background:transparent/);
 assert.doesNotThrow(()=>new Function(js));
});
test('right swipe in an existing conversation opens drawer on first gesture without creating chat',()=>{
 const code=js.slice(js.indexOf('function wireDrawerGestures(){'),js.indexOf('function flashError('));
 const events={},calls=[];let open=false;
 class El{closest(){return null}}
 const doc={addEventListener:(name,fn)=>events[name]=fn,querySelector:()=>null};
 const win={matchMedia:()=>({matches:true}),getSelection:()=>null,addEventListener:()=>{}};
 const $=id=>id==='shell'?{classList:{contains:()=>open}}:{hidden:true};
 const S={workMode:false,freeToolsMode:false};
 new Function('document','window','Element','$','S','activeBackDialog','openMenu','closeMenu','goBack','iv',code+';wireDrawerGestures();')(doc,win,El,$,S,()=>null,()=>{calls.push('drawer');open=true},()=>{open=false},()=>calls.push('back'),{scale:1});
 const touch=(x,y)=>({identifier:1,clientX:x,clientY:y}),target=new El();
 events.touchstart({touches:[touch(10,180)],target});
 events.touchmove({touches:[touch(60,181)],cancelable:true,preventDefault(){}});
 events.touchend({touches:[],changedTouches:[touch(90,181)]});
 assert.deepEqual(calls,['drawer']);
});
test('reply menu is out of layout and opens above action row',()=>{
 assert.match(css,/\.message-more-panel\{position:absolute;bottom:calc\(100% \+ 6px\)/);
 assert.match(js,/menu\.panel\.style\.setProperty\("--message-menu-height"/);
 assert.match(js,/addEventListener\("scroll",closeMessageMore/);
});
test('workspace return uses history and work composer has separate draft',()=>{
 assert.match(js,/history\.pushState\(state/);
 assert.match(js,/history\.back\(\)/);
 assert.match(js,/chatComposerBeforeWork=captureComposer\(\)/);
 assert.match(js,/restoreComposer\(chatComposerBeforeWork\)/);
});
test('connection page returns to actual parent',()=>{
 const code=js.slice(js.indexOf("function backDialog(id){"),js.indexOf("function goBack(){"));
 for(const parent of ["modelDialog","workModelDialog","settingsDialog",null]){
  const calls=[];new Function("hide","show","closeHistoryActions","initial","let keyBackPage=initial;"+code+";backDialog('keyDialog');")(id=>calls.push("hide:"+id),id=>calls.push("show:"+id),()=>{},parent);
  assert.deepEqual(calls,parent?["hide:keyDialog","show:"+parent]:["hide:keyDialog"]);
 }
});
test('free draw state is not cleared by reopening',()=>{
 const code=js.slice(js.indexOf('function setCreationMode(){'),js.indexOf('function openCreate(){'));
 assert.doesNotMatch(code,/createStatus.*textContent/);
});
