const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const html=fs.readFileSync("standalone/index.html","utf8"),js=fs.readFileSync("standalone/client.js","utf8"),css=fs.readFileSync("standalone/style.css","utf8");
test("Original composer actions are present and have a handler",()=>{
 for(const id of ["imageMode","videoMode","codeToggle","miniImageEdit","miniImageVideo","miniFrameVideo"])
  assert.ok(html.includes('id="'+id+'"'),id+" is missing in HTML");
 for(const id of ["imageMode","videoMode","codeToggle"])
  assert.ok(js.includes('$("'+id+'").addEventListener("click"'),id+" handler missing");
 assert.ok(js.includes('["miniImageEdit","image-edit"]'));
 assert.ok(js.includes('["miniImageVideo","image-video"]'));
 assert.ok(js.includes('["miniFrameVideo","frame-video"]'));
 assert.doesNotThrow(()=>new Function(js));
});
test("iPhone native picker labels remain user-activated, with real file inputs",()=>{
 for(const [label,input] of [["cameraAction","cameraInput"],["photosAction","photosInput"],["filesAction","attachmentInput"]]){
  assert.ok(html.includes('id="'+label+'" for="'+input+'"'),label+" has no native input association");
  const raw=html.slice(html.indexOf('id="'+input+'"')-9,html.indexOf('id="'+input+'"')+240);
  assert.ok(raw.includes('type="file"'),input+" not a file input");
  assert.ok(!raw.includes(" hidden>"),input+" is display:none and cannot be activated on iOS");
 }
 assert.ok(css.includes(".native-media-file-input{"));
 assert.ok(js.includes("Leave native label's default activation untouched"));
 assert.ok(!js.includes('$("photosInput").click()'));
});
test("Tool selection leaves original tray and photo picker visible",()=>{
 const begin=js.indexOf("function chooseMiniTool(action){"),end=js.indexOf("function setComposerMode(",begin);
 const segment=js.slice(begin,end);
 assert.ok(segment.includes('$("toolTray").hidden=false;'));
 assert.ok(segment.includes('$("attachMenu").hidden=false;'));
 assert.ok(segment.includes('$("photosAction").focus'));
 assert.ok(segment.includes("syncMiniTools();updateComposerModel();"));
 assert.ok(!segment.includes('photosInput").click()'));
});
test("Composer shows mode including code, image edit and first-last video",()=>{
 assert.ok(js.includes('S.code?"代码 · "+active'));
 assert.ok(js.includes('S.miniToolChoice==="image-edit"?"图生图'));
 assert.ok(js.includes('S.videoProvider==="freeloop"?"首尾帧视频"'));
 assert.ok(js.includes('S.code?"描述编程任务'));
 assert.ok(js.includes('$("codeToggle").setAttribute("aria-pressed",String(S.code))'));
});
test("Original mini tools select their corresponding mode without hidden clicks",()=>{
 const begin=js.indexOf("function chooseMiniTool(action){"),end=js.indexOf("function setComposerMode(",begin);
 const code=js.slice(begin,end);
 const els=new Map(),S={busy:false,user:{id:"test"},attachments:[],composerMode:"text",videoProvider:"freetext",miniToolChoice:null};
 const $=id=>{if(!els.has(id))els.set(id,{hidden:true,placeholder:"",focus(){this.focused=true}});return els.get(id)};
 let syncs=0;
 const choose=new Function("S","$","hideAttachMenu","setComposerMode","selectVideoModel","syncMiniTools","updateComposerModel","VIDEO_OPTIONS",
 code+"return chooseMiniTool")(S,$,()=>{$("attachMenu").hidden=true},m=>{S.composerMode=m},p=>{S.videoProvider=p},()=>{syncs++},()=>{}, {freewan:["m1"],freeloop:["m2"]});
 choose("image-edit");assert.equal(S.composerMode,"image");assert.equal(S.miniToolChoice,"image-edit");
 assert.equal($("toolTray").hidden,false);assert.equal($("attachMenu").hidden,false);
 choose("image-video");assert.equal(S.videoProvider,"freewan");assert.equal(S.composerMode,"video");
 choose("frame-video");assert.equal(S.videoProvider,"freeloop");assert.equal($("attachMenu").hidden,false);assert.equal(syncs,3);
});
test("Existing external tools remain available",()=>{
 for(const host of ["krea-krea-2.hf.space","multimodalart-glm-image.hf.space","rioshiina-imagegen.hf.space","aihorde.net"])assert.ok(js.includes(host),host);
});