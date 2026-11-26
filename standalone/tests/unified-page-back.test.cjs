const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('standalone/index.html','utf8'),js=fs.readFileSync('standalone/client.js','utf8'),css=fs.readFileSync('standalone/style.css','utf8');
test('each dialog and secondary page has an arrow back action',()=>{
 for(const d of html.matchAll(/<dialog id="([^"]+)"[\s\S]*?<\/dialog>/g)){assert.ok(d[0].includes('data-close="'+d[1]+'"'));assert.ok(d[0].includes('data-icon="arrow-left"'))}
 for(const id of ['workClose','freeToolsClose','ivClose'])assert.match(html,new RegExp('id="'+id+'"[^>]*>\\s*<span[^>]*data-icon="arrow-left"'));
 assert.match(css,/\.page-back\{[^}]*border:0;[^}]*background:transparent/);
 assert.doesNotMatch(html,/id="(?:chatBack|closeSide)"/);
 assert.doesNotMatch(js,/\$\("(?:chatBack|closeSide)"\)|syncChatBack/);
 assert.match(js,/\$\("sideShade"\)\.addEventListener\("click",closeMenu\)/);
 assert.match(js,/action="close";direction=-1/);
 assert.match(js,/if\(chatBackAvailable\(\)\)returnFromChat\(\)/);
 assert.doesNotThrow(()=>new Function(js));
});
test('back priority is viewer, modal, drawer, workspace, chat',()=>{
 const code=js.slice(js.indexOf('function goBack(){'),js.indexOf('function closeMenu(){'));
 const calls=[],state={viewer:true,dialog:{id:'settingsDialog'},drawer:true,tools:true,work:true,chat:true};
 const run=new Function('$','activeBackDialog','ivClose','closeHistoryActions','hide','closeMenu','S','setFreeToolsMode','setWorkMode','chatBackAvailable','returnFromChat',code+';goBack();');
 const S={get freeToolsMode(){return state.tools},get workMode(){return state.work}};
 const invoke=()=>run(id=>id==='imageViewer'?{hidden:!state.viewer}:{classList:{contains:()=>state.drawer}},()=>state.dialog,()=>calls.push('viewer'),()=>calls.push('actions'),id=>calls.push(id),()=>calls.push('drawer'),S,()=>calls.push('tools'),()=>calls.push('work'),()=>state.chat,()=>calls.push('chat'));
 invoke();state.viewer=false;invoke();state.dialog=null;invoke();state.drawer=false;invoke();state.tools=false;invoke();state.work=false;invoke();
 assert.deepEqual(calls,['viewer','settingsDialog','drawer','tools','work','chat']);
 assert.match(js,/\["page","back","viewer"\]\.includes\(origin\.action\)\)\{goBack\(\);return\}/);
});

test("secondary pages have standalone return controls and no full-width navigation headers",()=>{
 assert.doesNotMatch(html,/class="[^"]*(?:modal-head|settings-topbar|iv-header|work-header|free-tools-title)/);
 assert.doesNotMatch(css,/\.modal-head|\.settings-topbar|\.iv-header|\.work-header|\.free-tools-title/);
 for(const d of html.matchAll(/<dialog id="([^"]+)"[^>]*>\s*([^\n]*)/g))assert.match(d[2],/^<button[^>]*page-back[^>]*>/);
 assert.match(js,/\$\("modelScroll"\)\.scrollTop=0/);
 assert.match(js,/\$\("workScroll"\)\.scrollTop=0/);
});

 test("long pages scroll content without moving the return arrow",()=>{for(const id of ["modelScroll","workScroll"])assert.ok(html.includes('id="'+id+'"'));for(const selector of [".page-content",".work-page-content",".free-tools-content",".settings-scroll",".work-model-dialog-content"])assert.ok(css.includes(selector));assert.match(css,/\.page-content\{[^}]*overflow-y:auto/);assert.match(css,/\.work-page-content\{[^}]*overflow-y:auto/);assert.match(css,/\.free-tools-content\{[^}]*overflow-y:auto/);});
