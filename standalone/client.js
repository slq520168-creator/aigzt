"use strict";
const S={
 user:null,quota:null,chats:[],chatId:null,model:"free:auto",
 modelTitle:"免费自动",provider:"free",keys:{},connected:{},selectedFree:true,connectionsLoaded:false,connectionsLoading:false,
 allowPaid:false,savedProviders:{},freeToolsMode:false,freeToolsCategory:"全部",projectsExpanded:false,workMode:false,workBusy:false,workEpoch:0,workTasks:[],workDetail:null,workTaskId:null,workStages:[],workRoutes:[],workFallback:true,freeModels:[{id:"free:auto",name:"免费自动",provider:"free",type:"text",free:true}],freePoolRoutes:[],remoteModels:[],freeTierModels:[],sharedFreeModels:[],loadedCatalog:false,
 modelPage:0,source:"all",filter:"all",query:"",workModelRegion:"推荐",busy:false,code:false,
 authRegister:false,createMode:"image",drawBatch:null,videoTask:null,videoProvider:"freetext",videoModel:"wan2.2-ti2v",videoTaskProvider:"freetext",videoImageId:null,videoEndImageId:null,videoRatio:"16:9",composerMode:"text",creativeMode:null,attachments:[],projects:[],activeProjectId:null,actionChatId:null,editProjectId:null,archivedView:false,memoryEnabled:true,notes:[],currentTheme:"rainbow"
};
const $=id=>document.getElementById(id);
const els=id=>document.querySelectorAll(id);
const fmtDate=ms=>new Date(ms).toLocaleDateString("zh-CN",{month:"2-digit",day:"2-digit"});
const humanError=e=>e instanceof Error?e.message:String(e);
function node(tag,cls,text){
 const e=document.createElement(tag);
 if(cls)e.className=cls;if(text!=null)e.textContent=String(text);
 return e;
}
const ICONS={
 dice:'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="7.5" cy="7.5" r="0.9"/><circle cx="16.5" cy="7.5" r="0.9"/><circle cx="12" cy="12" r="0.9"/><circle cx="7.5" cy="16.5" r="0.9"/><circle cx="16.5" cy="16.5" r="0.9"/>',
 menu:'<path d="M4 6h16M4 12h10M4 18h16"/>',
 "arrow-left":'<path d="M19 12H5m7 7-7-7 7-7"/>',
 'panel-left':'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
 layers:'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',
 zap:'<path d="m13 2-3 8h8l-7 12 2-9H5l8-11Z"/>',
 'list-checks':'<path d="m3 7 2 2 3-3M3 15l2 2 3-3M12 8h9M12 16h9"/>',
 x:'<path d="M18 6 6 18M6 6l12 12"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 'square-pen':'<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.37 3.63a1 1 0 0 1 3 3L12 16l-4 1 1-4Z"/>',
 search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
 'audio-lines':'<path d="M2 10v4m4-8v12m4-15v18m4-13v8m4-11v14m4-11v6"/>',
 'copy':'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
 'message-circle':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
 compass:'<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
 paperclip:'<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 1 1 5.66 5.66L9.4 17.41a2 2 0 0 1-2.83-2.83l8.48-8.49"/>',
 link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
 'circle-user':'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="9" r="3"/><path d="M6 19a6 6 0 0 1 12 0"/>',
 settings:'<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="m19.4 15 .6 1-2 2-1-.6a2 2 0 0 0-2 .1L14 20h-4l-.5-2.5a2 2 0 0 0-2-.1l-1 .6-2-2 .6-1a2 2 0 0 0-.1-2L2.5 12v-2l2.5-.5a2 2 0 0 0 .1-2l-.6-1 2-2 1 .6a2 2 0 0 0 2-.1L10 2.5h4l.5 2.5a2 2 0 0 0 2 .1l1-.6 2 2-.6 1a2 2 0 0 0 .1 2l2.5.5v2l-2.5.5a2 2 0 0 0-.1 2Z"/>',
 folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
 languages:'<path d="M2 5h12M7 2h1M4 14l6-6 2-3M5 8l6 6"/><path d="m22 22-5-10-5 10M14 18h6"/>',
 scan:'<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><rect x="8" y="8" width="8" height="8" rx="1"/><circle cx="12" cy="12" r="1"/>',
 film:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4"/><path d="m10 8 5 4-5 4z"/>',
 clapperboard:'<rect x="3" y="10" width="18" height="11" rx="2"/><path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4M7 4l4 6M15 4l4 6"/><path d="m10 13 5 3-5 3z"/>',
 'chevron-down':'<path d="m6 9 6 6 6-6"/>',
 history:'<path d="M3 12a9 9 0 1 1 3 6.7M3 5v7h7M12 7v5l3 2"/>',
 ellipsis:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8" cy="7" r="1"/><circle cx="6.5" cy="12" r="1"/><path d="M12 22a10 10 0 1 1 10-10c0 2-1 3-3 3h-3a2 2 0 0 0-2 2 2 2 0 0 1-2 5"/>',
 camera:'<path d="M14 4h-4l-2 3H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4z"/><circle cx="12" cy="13" r="3"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
 blocks:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/>',
 'arrow-up':'<path d="m12 19 0-14m-7 7 7-7 7 7"/>',
 'continue-write':'<path d="M3 5h18M3 10h18M3 15h7M13 18h8m-4-4 4 4-4 4"/>',
 mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5m-5 0h10"/>',
 'sliders-horizontal':'<path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
 'brain-circuit':'<path d="M9 18a4 4 0 0 1-4-4 4 4 0 0 1 .3-1.5A4 4 0 0 1 7 5a4 4 0 0 1 5-1 4 4 0 0 1 5 1 4 4 0 0 1 1.7 7.5A4 4 0 0 1 15 18v2a2 2 0 0 1-4 0v-2"/><path d="M9 9v3m6-3v3"/>',
 video:'<rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3"/>',
 'code-2':'<path d="m8 17-5-5 5-5m8 10 5-5-5-5m-4-8-4 20"/>',
 pin:'<path d="m16 3 5 5-4 1-3 6-2 2-5-5 2-2 6-3zM5 19l6-6"/>',
 archive:'<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8M10 12h4"/>',
 trash:'<path d="M3 6h18m-2 0-.9 14H5.9L5 6m3 0V4h8v2m-6 4v7m4-7v7"/>',
 bookmark:'<path d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18l-7-5-7 5z"/>',
 'refresh-cw':'<path d="M20 11a8 8 0 0 0-14.5-4.5L3 9m0-6v6h6M4 13a8 8 0 0 0 14.5 4.5L21 15m0 6v-6h-6"/>',
 'thumbs-up':'<path d="M7 10v12H3V10zM7 10l5-8a2 2 0 0 1 2 2v5h6a2 2 0 0 1 2 2l-2 9a2 2 0 0 1-2 2H7"/>',
 'thumbs-down':'<path d="M7 14V2H3v12zM7 14l5 8a2 2 0 0 0 2-2v-5h6a2 2 0 0 0 2-2l-2-9a2 2 0 0 0-2-2H7"/>',
 'volume-2':'<path d="M11 5 6 9H3v6h3l5 4V5ZM15 9a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/>',
 share:'<path d="M12 16V3m-5 5 5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/>',
 'file-text':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
 'log-out':'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
};
/* Local two-tone professional vector icons, rendered consistently on all pages. */
const ICON_GRADIENTS={blue:["#4e78e6","#32b2c8"],teal:["#2498bd","#30c1a1"],violet:["#7662dc","#b374d9"],rose:["#b86dd8","#e47d9f"],amber:["#eaa143","#ee775c"],slate:["#6481bf","#619fc9"]};
const ICON_TONES={
 menu:"blue","panel-left":"blue",layers:"violet",zap:"amber","list-checks":"violet",x:"slate",plus:"teal",
 "square-pen":"blue",search:"teal","message-circle":"teal",compass:"teal",paperclip:"blue",link:"teal",
 "circle-user":"violet",settings:"slate",folder:"amber",languages:"blue",scan:"teal",film:"violet",clapperboard:"rose","chevron-down":"slate",ellipsis:"slate",
 palette:"rose",camera:"blue",image:"rose",blocks:"violet","arrow-up":"teal",mic:"teal",
 "brain-circuit":"violet",video:"rose","code-2":"blue","sliders-horizontal":"violet",pin:"amber",archive:"slate",trash:"rose",
 bookmark:"violet","refresh-cw":"blue","thumbs-up":"teal","thumbs-down":"rose","volume-2":"blue",share:"teal",download:"blue","file-text":"slate",info:"slate","log-out":"rose"
};
// Distinct two-tone colors for message actions.
const MESSAGE_ICON_COLORS=Object.freeze({
 copy:["#3565db","#537de9"],"square-pen":["#a56b17","#dd9b2c"],
 languages:["#168349","#31b469"],share:["#087f9e","#28b3ce"],
 download:["#b65b18","#e99a36"],bookmark:["#8051ce","#a978e5"],
 "refresh-cw":["#be466a","#e7808d"],ellipsis:["#4d50bb","#777cda"],
 "thumbs-up":["#168349","#31b469"],"thumbs-down":["#be466a","#e7808d"],
 "volume-2":["#087f9e","#28b3ce"],"file-text":["#3565db","#537de9"],
 layers:["#8051ce","#a978e5"],"arrow-up":["#168349","#31b469"],"continue-write":["#168349","#31b469"]
});
let iconGradientSerial=0;
function renderIcons(scope=document){
 const icons=[...scope.querySelectorAll("[data-icon]")];
 if(scope.matches?.("[data-icon]"))icons.unshift(scope);
 for(const el of icons){
  const name=el.dataset.icon,path=ICONS[name]||ICONS.info;
  const [from,to]=(el.closest(".message-copy-btn")&&MESSAGE_ICON_COLORS[name])||ICON_GRADIENTS[ICON_TONES[name]||"blue"];
  const id="aigzt-icon-"+(++iconGradientSerial);
  el.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="url(#'+id+')" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="'+from+'"/><stop offset="100%" stop-color="'+to+'"/></linearGradient></defs>'+path+'</svg>';
 }
}
function iconSlot(name){const e=node("span","ui-icon");e.dataset.icon=name;return e;}
function iconButton(icon,text,onClick){
 const b=node("button","action-row"),el=iconSlot(icon);b.type="button";
 b.append(el,node("span","",text));b.addEventListener("click",onClick);renderIcons(b);return b;
}

const drawerPageOrder=[];
let keyBackPage=null;
function show(id){
 const el=$(id);if(!el||el.open)return;
 if(el.classList.contains("workspace-view")||el.classList.contains("context-popover")){el.show();closeMenu();}
 else el.showModal();
 for(let i=drawerPageOrder.length-1;i>=0;i--)if(!drawerPageOrder[i].open||drawerPageOrder[i]===el)drawerPageOrder.splice(i,1);
 drawerPageOrder.push(el);
 if(id==="searchDialog")queueChatSearch();
}
function hide(id){if($(id).open)$(id).close()}
function activeBackDialog(){
 if($("actionsDialog").open&&historyActionAnchor)return $("actionsDialog");
 const open=drawerPageOrder.filter(el=>el.open&&!el.hidden);
 return open[open.length-1]||Array.from(document.querySelectorAll("dialog[open]")).at(-1)||null;
}
function backDialog(id){
 if(id==="authDialog")pendingHomeBrand=null;
 if(id==="keyDialog")homeBrandBinding=null;
 if(id==="actionsDialog"){closeHistoryActions();return}
 const parent=id==="keyDialog"?keyBackPage:null;
 if(id==="keyDialog")keyBackPage=null;
 hide(id);
 if(parent)show(parent);
}
function goBack(){
 if(!$("imageViewer").hidden){ivClose();return}
 const page=activeBackDialog();if(page){backDialog(page.id);return}
 if($("shell").classList.contains("menu-open")){closeMenu();return}
 if(S.freeToolsMode||S.workMode){returnWorkspace();return}
 openMenu();
}
function closeMenu(){
 if(historyActionAnchor)closeHistoryActions();
 $("shell").classList.remove("menu-open");
 $("sideShade").hidden=true;
 $("menuBtn").setAttribute("aria-expanded","false");
}
function openMenu(){
 if($("shell").classList.contains("menu-open"))return;
 closeMessageMore();
 // The composer must release the iOS keyboard before the independent drawer opens.
 const focused=document.activeElement;
 if(focused?.closest?.("#composerArea")&&focused.matches?.("input,textarea,[contenteditable]")){focused.blur();syncMobileHeight()}
 if(!$("attachMenu").hidden||!$("toolTray").hidden)hideAttachMenu();
 $("shell").classList.add("menu-open");
 $("sideShade").hidden=false;
 $("menuBtn").setAttribute("aria-expanded","true");
}
function wireDrawerGestures(){
 let gesture=null;
 const isMobile=()=>window.matchMedia("(max-width:900px)").matches;
 const edgeWidth=24,minDistance=75,drawerEdgeWidth=44,replyEdgeWidth=22,drawerOpenDistance=34;
 const excluded="input,textarea,select,[contenteditable='true'],[role='slider'],.chat-table-scroll,table,pre,code,img,video,canvas,.iv-stage,.iv-thumbs,.source-chips,.model-region-links,.work-progress,.free-tool-filters,.tool-tray,.attachment-preview";
 function blockedTarget(target,replyEdge=false){
  if(!(target instanceof Element))return false;
  // A full-width reply can cover the whole left edge; only non-interactive text can start there.
  // A photo or a folded user message can fill the entire edge. Keep tap/zoom intact;
  // permit only an intentional single-finger edge swipe on the chat image itself.
  const chatPhoto=replyEdge&&target.closest(".chat-generated-image,.chat-upload-image");
  const selector=replyEdge?excluded.replace(".chat-table-scroll,table,pre,code,","").replace(chatPhoto?"img,":"\u0000",""):excluded;
  if(target.closest(selector))return true;
  // Only known horizontal surfaces need layout checks. Do not force layout through every ancestor.
  const horizontal=target.closest(".chat-table-scroll,pre,.bubble,.sidebar-chat-scroll");
  if(horizontal&&horizontal.scrollWidth>horizontal.clientWidth+2&&/^(auto|scroll|overlay)$/.test(window.getComputedStyle(horizontal).overflowX))return true;
  return false;
 }
 function activePage(){return activeBackDialog()}
 document.addEventListener("touchstart",event=>{
  gesture=null;
  if(!isMobile()||event.touches.length!==1)return;
  const touch=event.touches[0],target=event.target,open=$("shell").classList.contains("menu-open");
  const left=touch.clientX<=edgeWidth;
  const page=activePage(),viewer=!$("imageViewer").hidden;
  if(viewer){
   if(!left||iv.scale!==1||target instanceof Element&&target.closest("button,.iv-thumbs"))return;
   gesture={id:touch.identifier,x:touch.clientX,y:touch.clientY,action:"viewer",direction:1,page};return;
  }
  if(page){
   const rect=page.getBoundingClientRect();
   const panelEdge=touch.clientX>=rect.left-2&&touch.clientX<=rect.left+edgeWidth;
   if(!left&&!panelEdge)return;
   if(!(target instanceof Element)||!page.contains(target)||target.closest("button,a,summary,label,input,textarea,select,video,canvas,[contenteditable]"))return;
   if(blockedTarget(target,true))return;
   gesture={id:touch.identifier,x:touch.clientX,y:touch.clientY,action:"page",direction:1,page};return;
  }
  if(!open&&touch.clientX>drawerEdgeWidth)return;
  const replyEdge=!open&&!S.freeToolsMode&&!S.workMode&&touch.clientX<=replyEdgeWidth;
  if(blockedTarget(target,replyEdge))return;
  let action="",direction=0;
  if(open){
   if(!(target instanceof Element)||!target.closest("#sidebar,#sideShade"))return;
   action="close";direction=-1;
  }else if(S.freeToolsMode||S.workMode){
   if(!left||target instanceof Element&&target.closest("button,a,summary,label"))return;
   action="back";direction=1;
  }else{
   if(target instanceof Element&&target.closest(".message-copy-bar,.message-translation,button,a,summary,label"))return;
   if(window.getSelection?.()?.toString())return;
   action="open";direction=1;
  }
  gesture={id:touch.identifier,x:touch.clientX,y:touch.clientY,action,direction,page};
 },{passive:true});
 document.addEventListener("touchmove",event=>{
  if(!gesture)return;
  if(event.touches.length!==1||event.touches[0].identifier!==gesture.id){gesture=null;return}
  const touch=event.touches[0],dx=touch.clientX-gesture.x,dy=touch.clientY-gesture.y;
  if(gesture.committed){if(event.cancelable)event.preventDefault();return}
  if(gesture.action==="open"||gesture.action==="close"){
   const distance=dx*gesture.direction;
   if(Math.abs(dy)>32||(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)*.7)||distance< -16){gesture=null;return}
   // Begin the drawer transition as soon as horizontal intent is clear, not on touchend.
   if(distance>12&&distance>Math.abs(dy)*2.2){
    if(event.cancelable)event.preventDefault();
    if(distance>=drawerOpenDistance&&Math.abs(dy)<=24){
     if(gesture.action==="open"&&window.getSelection?.()?.toString()){gesture=null;return}
     gesture.committed=true;
     if(gesture.action==="open")openMenu();else closeMenu();
    }
   }
  }
  if((Math.abs(dy)>14&&Math.abs(dy)>Math.abs(dx))||dx*gesture.direction< -16){gesture=null;return}
  if(["page","back","viewer"].includes(gesture.action)&&dx>12&&dx>Math.abs(dy)*2&&event.cancelable)event.preventDefault();
 },{passive:false});
 document.addEventListener("touchend",event=>{
  const origin=gesture;gesture=null;
  if(!origin||origin.committed||event.touches.length!==0||event.changedTouches.length!==1||!isMobile())return;
  if((origin.action==="viewer")!==!$("imageViewer").hidden)return;
  const touch=event.changedTouches[0];
  if(touch.identifier!==origin.id||activePage()!==origin.page)return;
  const dx=touch.clientX-origin.x,dy=touch.clientY-origin.y;
  const opening=origin.action==="open";
   if(dx*origin.direction<((opening||origin.action==="close")?drawerOpenDistance:minDistance)||Math.abs(dx)<Math.abs(dy)*(opening?1.7:1.5)||(opening&&Math.abs(dy)>42))return;
   if(opening&&window.getSelection?.()?.toString())return;
  if(["page","back","viewer"].includes(origin.action)){goBack();return}
  if(document.querySelector("dialog[open]"))return;
  const open=$("shell").classList.contains("menu-open");
  if(origin.action==="close"&&open)closeMenu();
  else if(origin.action==="open"&&!open&&!S.freeToolsMode&&!S.workMode)openMenu();

 },{passive:true});
 document.addEventListener("touchcancel",()=>{gesture=null},{passive:true});
 window.addEventListener("resize",()=>{
  gesture=null;
  if(!isMobile()&&$("shell").classList.contains("menu-open"))closeMenu();
 },{passive:true});
}
function flashError(message){
 const bar=$("errorBanner");bar.textContent=message;bar.hidden=!message;
 if(message)setTimeout(()=>{if(bar.textContent===message)bar.hidden=true},9000);
}
async function api(path,body){
 const options={headers:{Accept:"application/json"},credentials:"same-origin",cache:"no-store"};
 if(body!==undefined){
  options.method="POST";options.headers["content-type"]="application/json";options.body=JSON.stringify(body);
 }
 let resp;
 try{resp=await fetch(path,options)}
 catch{throw Error("网络连接失败，请检查当前网络")}
 const data=await resp.json().catch(()=>null);
 if(!resp.ok||!data?.ok)throw Object.assign(Error(data?.error||"请求失败，HTTP "+resp.status),{code:data?.code||null,upstreamStatus:data?.upstreamStatus||null});
 return data;
}
let avatarOwner=null,avatarEpoch=0;
/* Same-origin avatar URLs comply with the site's img-src CSP. Never use blob: here. */
async function refreshAvatar(){
 const uid=S.user?.id||null,letter=S.user?.email?.slice(0,1).toUpperCase()||"A",epoch=++avatarEpoch;
 const targets=[$("accountAvatar"),$("settingsAvatarThumb")].filter(Boolean);
 if(!uid){for(const target of targets)target.textContent=letter;return false}
 return new Promise(resolve=>{
  const img=new Image();img.alt="";img.decoding="async";
  img.onload=()=>{
   if(epoch!==avatarEpoch||S.user?.id!==uid){resolve(false);return}
   for(const target of targets){const copy=img.cloneNode(false);copy.alt="";target.replaceChildren(copy)}
   resolve(true);
  };
  img.onerror=()=>{
   if(epoch===avatarEpoch){for(const target of targets)if(!target.querySelector("img"))target.textContent=letter}
   resolve(false);
  };
  img.src="/api/avatar?v="+Date.now();
 });
}
function setAuthUI(){
 const logged=!!S.user,uid=S.user?.id||null;
 $("accountName").textContent=logged?S.user.email:"登录 / 注册";
 $("avatarQuickInput").disabled=!logged;
 if(uid!==avatarOwner){avatarOwner=uid;refreshAvatar()}
 const q=S.quota;
 $("quotaLabel").textContent=q&&logged?"免费请求保护配额："+q.remaining+"/"+q.limit+" · 全站剩余 "+q.siteRemaining:"外部免费 · 登录后使用";
}
async function uploadAvatar(file){
 if(!S.user){show("authDialog");return}
 if(!file)return;
 const status=$("avatarStatus"),label=$("changeAvatar");
 if(file.size>12000000||!/^image\//.test(file.type)){status.textContent="请选择12MB以内的图片";return}
 if(label.getAttribute("aria-busy")==="true")return;
 label.setAttribute("aria-busy","true");status.textContent="正在处理头像…";
 try{
  // CSP allows data: images; blob: URLs were blocked on iOS PWA.
  const preview=await new Promise((resolve,reject)=>{
   const reader=new FileReader();
   reader.onerror=()=>reject(Error("无法读取照片"));
   reader.onload=()=>typeof reader.result==="string"?resolve(reader.result):reject(Error("无法读取照片"));
   reader.readAsDataURL(file);
  });
  const photo=new Image();
  await new Promise((resolve,reject)=>{photo.onload=resolve;photo.onerror=()=>reject(Error("照片格式无法解码"));photo.src=preview});
  const canvas=document.createElement("canvas");canvas.width=256;canvas.height=256;
  const ctx=canvas.getContext("2d");if(!ctx)throw Error("设备不支持处理图片");
  const side=Math.min(photo.naturalWidth,photo.naturalHeight),sx=(photo.naturalWidth-side)/2,sy=(photo.naturalHeight-side)/2;
  ctx.drawImage(photo,sx,sy,side,side,0,0,256,256);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",.86));
  if(!blob)throw Error("头像压缩失败");
  const form=new FormData();form.append("file",blob,"avatar.jpg");
  const resp=await fetch("/api/avatar",{method:"POST",credentials:"same-origin",body:form});
  const data=await resp.json().catch(()=>null);
  if(!resp.ok||!data?.ok)throw Error(data?.error||"头像保存失败");
  const verified=await refreshAvatar();if(!verified)throw Error("头像已保存，但图片读取失败");
  status.textContent="头像已更换";
 }catch(error){status.textContent="更换失败："+humanError(error)}
 finally{label.removeAttribute("aria-busy")}
}

const KEY_SITES={
 openrouter:{url:"https://openrouter.ai/settings/keys",name:"获取 OpenRouter 密钥"},
 groq:{url:"https://console.groq.com/keys",name:"获取 Groq 密钥"},
 cerebras:{url:"https://cloud.cerebras.ai/",name:"打开 Cerebras 控制台"},
 openai:{url:"https://platform.openai.com/api-keys",name:"获取 OpenAI 密钥"},
 claude:{url:"https://console.anthropic.com/settings/keys",name:"获取 Claude API 密钥"},
 novai:{url:"https://once-cf.novai.su/",name:"Nova AI（novai.su）创建令牌"},
 novai_pro:{url:"https://aiapi-pro.com/",name:"NovAI（aiapi-pro.com）创建令牌"},
 grok:{url:"https://console.x.ai/",name:"打开 xAI 控制台"},
 runway:{url:"https://dev.runwayml.com/",name:"获取 Runway API Key"},
 luma:{url:"https://platform.lumalabs.ai/",name:"获取 Luma API Key"},
 vidu:{url:"https://platform.vidu.com/",name:"获取 Vidu API Key"},
 gemini:{url:"https://aistudio.google.com/apikey",name:"获取 Gemini 密钥"},
 qwen:{url:"https://modelstudio.console.alibabacloud.com/",name:"打开千问密钥控制台"},
 deepseek:{url:"https://platform.deepseek.com/api_keys",name:"获取DeepSeek密钥"},
 zhipu:{url:"https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys",name:"获取智谱 GLM密钥"},
 kimi:{url:"https://platform.kimi.com/",name:"获取Kimi密钥"},
 minimax:{url:"https://platform.minimaxi.com/",name:"获取MiniMax密钥"},
 siliconflow:{url:"https://cloud.siliconflow.cn/account/ak",name:"获取硅基流动密钥"},
 doubao:{url:"https://console.volcengine.com/ark/region:cn-beijing/apikey",name:"获取豆包 / 方舟密钥"},
 qianfan:{url:"https://console.bce.baidu.com/qianfan/overview",name:"获取百度千帆密钥"},
 hunyuan:{url:"https://console.cloud.tencent.com/hunyuan",name:"获取腾讯混元密钥"},
 stepfun:{url:"https://platform.stepfun.com/",name:"获取阶跃星辰 API Key"},
 xiaomi:{url:"https://platform.xiaomimimo.com/",name:"获取小米 MiMo API Key"},
 longcat:{url:"https://longcat.chat/platform/",name:"获取美团 LongCat API Key"},
 baichuan:{url:"https://platform.baichuan-ai.com/",name:"获取百川智能 API Key"},
 iflytek:{url:"https://console.xfyun.cn/services/bm35",name:"获取讯飞星火 API Password"},
 sensetime:{url:"https://token.sensetime.com/",name:"获取商汤 SenseNova API Key"},
 yandex:{url:"https://console.yandex.cloud/",name:"打开 Yandex Cloud API 密钥设置"},
 gigachat:{url:"https://developers.sber.ru/",name:"获取 GigaChat 授权密钥"}
};
const VIDEO_ONLY_PROVIDERS=new Set(["runway","luma","vidu"]);
const VIDEO_OPTIONS=Object.freeze({
 freetext:["wan2.2-ti2v"],
 freewan:["wan2.2-i2v-fast"],
 freeloop:["wan2.2-firstlast"],
 grok:["grok-imagine-video-1.5"],
 runway:["gen4.5","veo3.1_fast","seedance2_fast"],
 luma:["ray-2","ray-flash-2"],
 vidu:["viduq3-turbo","viduq3-pro","viduq2"]
});
const VIDEO_PROVIDER_NAMES={freetext:"免费 Wan 文字视频",freewan:"免费 Wan 2.2 图生视频",freeloop:"免费 Wan 2.2 首尾帧",grok:"xAI Grok",runway:"Runway",luma:"Luma",vidu:"Vidu"};
const BUILTIN_VIDEO_MODELS=[{"provider":"freetext","id":"wan2.2-ti2v","name":"Wan 文字生成视频","type":"video","free":true,"builtinVideo":true},{"provider":"freewan","id":"wan2.2-i2v-fast","name":"Wan 2.2 图生视频","type":"video","free":true,"builtinVideo":true},{"provider":"freeloop","id":"wan2.2-firstlast","name":"Wan 2.2 首尾帧","type":"video","free":true,"builtinVideo":true},{"provider":"grok","id":"grok-imagine-video-1.5","name":"Grok Imagine 1.5","type":"video","free":false,"builtinVideo":true},{"provider":"runway","id":"gen4.5","name":"Runway Gen-4.5","type":"video","free":false,"builtinVideo":true},{"provider":"runway","id":"veo3.1_fast","name":"Google Veo 3.1 Fast","type":"video","free":false,"builtinVideo":true},{"provider":"runway","id":"seedance2_fast","name":"Seedance 2 Fast","type":"video","free":false,"builtinVideo":true},{"provider":"luma","id":"ray-2","name":"Luma Ray 2","type":"video","free":false,"builtinVideo":true},{"provider":"luma","id":"ray-flash-2","name":"Luma Ray Flash 2","type":"video","free":false,"builtinVideo":true},{"provider":"vidu","id":"viduq3-turbo","name":"Vidu Q3 Turbo","type":"video","free":false,"builtinVideo":true},{"provider":"vidu","id":"viduq3-pro","name":"Vidu Q3 Pro","type":"video","free":false,"builtinVideo":true},{"provider":"vidu","id":"viduq2","name":"Vidu Q2","type":"video","free":false,"builtinVideo":true}];
const THIRD_PARTY_PROVIDERS=new Set(["openrouter","groq","cerebras","novai","novai_pro","siliconflow"]);
const PROVIDER_BRAND_DOMAINS={openai:"openai.com",claude:"anthropic.com",gemini:"google.com",grok:"x.ai",deepseek:"deepseek.com",qwen:"qwen.ai",zhipu:"bigmodel.cn",kimi:"kimi.com",minimax:"minimax.io",doubao:"doubao.com",qianfan:"baidu.com",hunyuan:"tencent.com",stepfun:"stepfun.com",xiaomi:"mi.com",longcat:"longcat.chat",baichuan:"baichuan-ai.com",iflytek:"xfyun.cn",sensetime:"sensetime.com",yandex:"yandex.com",gigachat:"giga.chat",runway:"runwayml.com",luma:"lumalabs.ai",vidu:"vidu.com",openrouter:"openrouter.ai",groq:"groq.com",cerebras:"cerebras.ai",novai:"novai.su",novai_pro:"aiapi-pro.com",siliconflow:"siliconflow.cn"};
const providerRoute=p=>p==="free"||["freetext","freewan","freeloop"].includes(p)?"free":THIRD_PARTY_PROVIDERS.has(p)?"third":Object.hasOwn(KEY_SITES,p)?"official":"unknown";
const providerRouteLabel=p=>({official:"官方直连",third:"第三方",free:"免费线路",unknown:"其他线路"})[providerRoute(p)];
const modelRoute=m=>m.availableWith==="openrouter-key"?"openrouter":m.provider;
function providerLabel(p){return $("keyProvider")?.querySelector('option[value="'+p+'"]')?.textContent||WORK_PROVIDER_SHORT[p]||p}
function providerLogo(p){
 const mark=node("span","provider-brand-mark");mark.setAttribute("aria-hidden","true");
 const domain=PROVIDER_BRAND_DOMAINS[p];
 mark.append(node("span","provider-brand-fallback",p==="free"?"AI":String(p||"AI").slice(0,2).toUpperCase()));
 if(domain){const img=node("img","provider-brand-img");img.alt="";img.width=24;img.height=24;img.loading="lazy";img.decoding="async";img.referrerPolicy="no-referrer";
  img.addEventListener("load",()=>{if(img.naturalWidth>=24&&img.naturalHeight>=24)mark.classList.add("has-logo");else img.remove()},{once:true});
  img.addEventListener("error",()=>img.remove(),{once:true});mark.append(img);img.src="https://www.google.com/s2/favicons?domain="+encodeURIComponent(domain)+"&sz=64";
 }
 return mark;
}
function renderProviderPicker(){
 const select=$("keyProvider"),picker=$("providerPicker"),summary=$("providerPickerSummary"),list=$("providerPickerList"),p=select.value;
 $("keyProviderNative").hidden=true;picker.hidden=false;
 if(summary.dataset.provider!==p){summary.dataset.provider=p;summary.replaceChildren(providerLogo(p),node("strong","",providerLabel(p)),node("span","provider-route-label "+providerRoute(p),providerRouteLabel(p)))}
 if(!picker.open)return;
 const options=Array.from(select.options);
 const signature=p+"|"+options.map(o=>o.value+":"+Boolean(S.savedProviders[o.value])).join("|");
 if(list.dataset.signature===signature)return;list.dataset.signature=signature;list.replaceChildren();
 for(const kind of ["official","third"]){
  const heading=node("div","provider-picker-heading",kind==="official"?"官方直连 · 优先绑定":"第三方聚合 / 推理平台");
  const grid=node("div","provider-picker-grid");
  for(const o of options.filter(o=>providerRoute(o.value)===kind)){
   const id=o.value,b=node("button","provider-picker-option"+(id===p?" selected":""));b.type="button";b.setAttribute("aria-pressed",String(id===p));
   const info=node("span","provider-picker-info");info.append(node("strong","",o.textContent),node("small","",S.savedProviders[id]?"密钥已保存":providerRouteLabel(id)));
   b.append(providerLogo(id),info);b.addEventListener("click",()=>{select.value=id;picker.open=false;refreshKeyPanel()});grid.append(b);
  }list.append(heading,grid);
 }
}
function connected(p){return !!(S.savedProviders[p]||S.keys[p])}
function refreshKeyPanel(){
 const provider=$("keyProvider").value,rec=S.savedProviders[provider],site=KEY_SITES[provider];
 renderProviderPicker();
 const a=$("providerKeyLink");a.href=site.url;a.textContent=site.name;
 $("providerHelp").textContent=provider==="yandex"?"请输入 Yandex AI Studio API Key，且在模型 ID 中填写 gpt://你的FolderID/yandexgpt-5.1 或 gpt://你的FolderID/aliceai-llm。":
 provider==="gigachat"?"填写 GigaChat 项目的授权密钥（默认个人版 PERS；企业版可加 B2B: 前缀）。本站按需兑换短期令牌。":
 provider==="iflytek"?"使用官方 HTTP API Password；模型目录可能不支持，请按控制台填写实际模型 ID（例如 generalv3.5），未实测不会显示已验证。":
 provider==="sensetime"?"使用 TokenPlan 的 API Key，模型是否可调用以该账号目录和权限为准。":
 VIDEO_ONLY_PROVIDERS.has(provider)?"专用于视频生成。密钥加密保存，只有点击生成并授权额度才会发起可能收费的请求。":
 provider==="qwen"?"请选择新加坡地区的密钥。":
 provider==="novai"?"聚合多个模型。API 使用 us.novaiapi.com/v1，免费模型可能变化。":
 provider==="novai_pro"?"部分 Flash 模型限额免费；其他模型可能收费。":
 provider==="openrouter"?"可用官方账号授权，或创建 API Key。":"登录服务商账号创建 API Key，再返回粘贴。";
 $("personalKey").value="";
 $("personalKey").placeholder=rec?"已保存，无需再次填写；更换时才输入新密钥":"粘贴 API Key";
 $("keySaveLabel").textContent=rec?"更换并保存密钥":"加密保存密钥";
 $("savedConnectionPanel").hidden=!rec;
 $("useSavedKey").hidden=!rec;
 $("disconnectProvider").hidden=!rec;
 if(!$("personalKey").value)$("keyAdvanced").open=!rec;
 $("keyAdvancedSummary").textContent=rec?"更换 API Key（不需要时无需展开）":"首次连接 · 输入 API Key";
 $("manualModelWrap").hidden=provider==="openrouter"||provider==="gemini"||VIDEO_ONLY_PROVIDERS.has(provider);
 $("manualModel").placeholder=provider==="yandex"?"gpt://你的FolderID/yandexgpt-5.1":provider==="gigachat"?"GigaChat":"官方模型 ID";
 $("allowPaid").checked=Boolean(rec?.consent);
 $("keyStatus").textContent=rec?(VIDEO_ONLY_PROVIDERS.has(provider)?"视频密钥已加密保存（未收费测试）":rec.verified?"密钥已加密保存 · 模型目录已验证":"密钥已加密保存 · 模型目录未验证"):"";
 $("openrouterLogin").hidden=provider!=="openrouter";
}
async function fetchConnections(){
 if(!S.user){S.savedProviders={};S.connected={};S.connectionsLoaded=false;return}
 if(S.connectionsLoading)return;
 S.connectionsLoading=true;
 try{
  const result=await api("/api/connections"),saved={};
  for(const item of result.connections||[]){
   saved[item.provider]={model:item.model||"",consent:!!item.consent,verified:!!item.verified,updatedAt:item.updatedAt};
   if(item.model&&!S.connected[item.provider])S.connected[item.provider]=[{id:item.model,name:item.model,type:/(?:^|[\/_-])whisper(?:$|[\/_-])/i.test(item.model)?"audio":"text"}];
  }
  S.savedProviders=saved;S.connectionsLoaded=true;refreshSourceChips();if(S.workMode)renderWorkAgentCatalog();
  // Never silently switch the user to a different model during connection refresh.
  S.allowPaid=Boolean(S.savedProviders[S.provider]?.consent);
  S.selectedFree=isFreeModel(S.provider,S.model);
  updateModelTitle();
  if(!$("keyDialog").open||!$("personalKey").value)refreshKeyPanel();
 }catch(e){
  S.connectionsLoaded=false;
  flashError("密钥状态暂未同步："+humanError(e));
 }finally{S.connectionsLoading=false}
}
function isFreeModel(provider,model){
 if(provider==="free")return true;
 if(typeof model!=="string")return false;
 if(provider==="openrouter")return model==="openrouter/free"||model.endsWith(":free");
 if(provider==="novai")return /^\[free\]/i.test(model);
 if(provider==="novai_pro")return ["glm-4.7-flash","glm-4.1v-thinking-flash","glm-4.6v-flash"].includes(model);
 return false;
}
// Account-scoped model preference, independent of a chat's historical model.
let restoredChatModelOwner=null,restoredWorkModelOwner=null,workModelPreference=null,chatModelPreferenceReady=false;
function chatModelStorageKey(userId){return "aigzt:chat-model:v1:"+String(userId)}
function rememberChatModelSelection(){
 if(!S.user?.id)return;
 try{localStorage.setItem(chatModelStorageKey(S.user.id),JSON.stringify({provider:S.provider,model:S.model,title:S.modelTitle}))}catch{}
}
function restoreChatModelSelection(){
 const id=String(S.user?.id||"");
 if(!id||restoredChatModelOwner===id)return;
 restoredChatModelOwner=id;
 let saved=null;
 try{saved=JSON.parse(localStorage.getItem(chatModelStorageKey(id))||"null")}catch{}
 if(saved&&typeof saved.provider==="string"&&/^[a-z][a-z0-9_-]{0,35}$/.test(saved.provider)&&
   typeof saved.model==="string"&&saved.model.length>0&&saved.model.length<=180&&
   typeof saved.title==="string"&&saved.title.length<=240){
  S.provider=saved.provider;
  S.model=saved.provider==="free"&&!/^free:or\/[\w./-]+:free$/.test(saved.model)?"free:auto":saved.model;
  S.modelTitle=saved.provider==="free"&&S.model==="free:auto"?"免费自动":saved.title;
  // Respect saved consent only after connections have loaded; login requests may finish in either order.
  S.allowPaid=S.connectionsLoaded===true&&Boolean(S.savedProviders[S.provider]?.consent);
  S.selectedFree=isFreeModel(S.provider,S.model);
 }else setFreeDefault(false);
 updateModelTitle();
}
function setFreeDefault(render=true){
 S.provider="free";S.model="free:auto";S.modelTitle="免费自动";S.allowPaid=false;S.selectedFree=true;
 if(render)updateModelTitle();
}
async function useSavedConnection(){
 const provider=$("keyProvider").value,entry=S.savedProviders[provider];
 if(homeBrandBinding?.provider===provider&&entry){const route=homeBrandBinding;homeBrandBinding=null;hide("keyDialog");openHomeBrandModels(route);return}
 if(!entry){$("keyStatus").textContent="请先保存密钥";return}
 const button=$("useSavedKey");button.disabled=true;
 try{
  if(VIDEO_ONLY_PROVIDERS.has(provider)||S.videoPendingKeyReturn){hide("keyDialog");if(S.videoPendingKeyReturn){S.videoPendingKeyReturn=false;setComposerMode("video");$("prompt").focus({preventScroll:true})}return}
  let model=S.provider===provider&&S.model?S.model:entry.model;
  if(provider==="openai"){
   const catalog=await api("/api/connections/openai/models",{});
   if(!catalog.verified||!Array.isArray(catalog.models)||!catalog.models.length)throw Error("OpenAI 官方目录未验证，请稍后再试");
   S.connected.openai=catalog.models;entry.verified=true;refreshSourceChips();
   const directId=S.provider==="openrouter"&&S.model.startsWith("openai/")?S.model.slice(7):null;
   const candidate=[directId,model].find(id=>id&&catalog.models.some(m=>m.id===id&&m.type==="text"));
   if(!candidate){hide("keyDialog");activateSource("openai");openModels();return}
   model=candidate;
   await api("/api/connections/openai/selected",{model});entry.model=model;
  }
  if(!model){
   const manual=$("manualModel").value.trim();
   if(manual){
    await api("/api/connections/"+provider+"/selected",{model:manual});
    entry.model=manual;model=manual;
   }
  }
  if(!model){
   try{
    const models=await api("/api/connections/"+provider+"/models",{});
    const item=(models.models||[]).find(x=>x.type==="text")||(models.models||[])[0];
    if(item){model=item.id;entry.model=model;entry.verified=true;S.connected[provider]=models.models}
   }catch(e){$("keyStatus").textContent="密钥已保存。"+humanError(e)+"。可填写官方模型 ID 后使用。";return}
  }
  if(!model){$("keyStatus").textContent="密钥已保存。请填写官方模型 ID 后使用。";return}
  if(keyBackPage==="workModelDialog"){keyBackPage=null;hide("keyDialog");show("workModelDialog");renderWorkAgentCatalog();await chooseDedicatedWorkModel(provider,model);return}
  S.provider=provider;S.model=model;S.modelTitle=provider+" · "+model;
  S.allowPaid=!!entry.consent;S.selectedFree=isFreeModel(provider,model);
  rememberChatModelSelection();updateModelTitle();hide("keyDialog");$("prompt").focus();
 }catch(e){if(e?.code==="AUTH"){entry.verified=false;refreshKeyPanel();$("keyAdvanced").open=true} $("keyStatus").textContent=humanError(e)}
 finally{button.disabled=false}
}
async function removeSavedKey(){
 const p=$("keyProvider").value;
 if(!S.savedProviders[p])return;
 if(!confirm("删除已保存的 "+p+" 密钥？"))return;
 try{
  await api("/api/connections/"+p+"/delete",{});
  delete S.savedProviders[p];delete S.connected[p];delete S.keys[p];
  if(S.provider===p){setFreeDefault(false);rememberChatModelSelection();updateModelTitle()}
  refreshKeyPanel();$("keyStatus").textContent="已断开";
 }catch(e){$("keyStatus").textContent=humanError(e)}
}

async function fetchMe(){
 try{const v=await api("/api/me");S.user=v.user;S.quota=v.quota;restoreChatModelSelection();restoreWorkModelSelection();chatModelPreferenceReady=true;updateModelTitle();setAuthUI()}
 catch(e){flashError("账号状态读取失败："+humanError(e))}
}
let chatFetchSerial=0,historyScope="",historyNextCursor=null,historyLoading=false;
function chatHistoryScope(){return JSON.stringify([S.user?.id||"",S.activeProjectId||"",!!S.archivedView])}
function chatHistoryUrl(cursor=null){
 const params=new URLSearchParams();
 if(S.activeProjectId)params.set("project",S.activeProjectId);
 if(S.archivedView)params.set("archived","1");
 if(cursor)params.set("cursor",cursor);
 const query=params.toString();
 return "/api/chats"+(query?"?"+query:"");
}
function mergeHistoryRows(previous,next){
 const map=new Map(previous.map(x=>[x.id,x]));
 for(const x of next)map.set(x.id,x);
 return [...map.values()];
}
function currentHistoryRequest(seq,scope){return seq===chatFetchSerial&&scope===chatHistoryScope()}
function renderHistory(){
 const recent=$("history"),pinned=$("pinnedHistory"),pinHeading=$("pinHeading"),scroller=$("sidebarChatScroll");
 const rows=S.chats||[],hasPinned=!S.archivedView&&rows.some(x=>!!x.pinned_at);
 const normal=rows.filter(x=>!hasPinned||!x.pinned_at);
 const heading=S.archivedView?"已归档聊天":S.activeProjectId?"项目聊天":"最近聊天";
 if($("historyHeading").textContent!==heading)$("historyHeading").textContent=heading;
 const navHidden=!(S.activeProjectId||S.archivedView);
 if($("navChat").hidden!==navHidden)$("navChat").hidden=navHidden;
 const count=rows.length?String(rows.length):"";
 if($("chatCount").textContent!==count)$("chatCount").textContent=count;
 if(pinHeading.hidden===hasPinned)pinHeading.hidden=!hasPinned;
 if(pinned.hidden===hasPinned)pinned.hidden=!hasPinned;
 const existing=new Map([...pinned.children,...recent.children].filter(el=>el.dataset.chatId).map(el=>[el.dataset.chatId,el]));
 const makeRow=x=>{
  const row=node("div","history-row");row.dataset.chatId=x.id;
  const select=node("button","history-select");select.type="button";
  select.append(iconSlot("message-circle"),node("span","history-title",""));
  select.addEventListener("click",()=>void loadChat(x.id));
  const more=node("button","history-more");more.type="button";more.title="聊天操作";
  more.setAttribute("aria-haspopup","dialog");more.setAttribute("aria-expanded","false");
   more.append(iconSlot("ellipsis"));more.addEventListener("click",event=>{event.stopPropagation();openChatActions(x.id,more)});
  row.append(select,more);renderIcons(row);return row;
 };
 const update=x=>{
  const row=existing.get(x.id)||makeRow(x),active=S.chatId===x.id;
  if(row.classList.contains("active")!==active)row.classList.toggle("active",active);
  const name=x.title||"新对话",select=row.querySelector(".history-select"),text=row.querySelector(".history-title"),more=row.querySelector(".history-more");
  if(text.textContent!==name)text.textContent=name;
  if(select.title!==name)select.title=name;
  const aria=name+"的操作";if(more.getAttribute("aria-label")!==aria)more.setAttribute("aria-label",aria);
  existing.set(x.id,row);return row;
 };
 const reconcile=(target,items,emptyText)=>{
  if(!items.length){
   if(!emptyText){if(target.childNodes.length)target.replaceChildren();return}
   for(const el of [...target.children])if(!el.classList.contains("hint"))el.remove();
   let hint=target.firstElementChild;
   if(!hint){hint=node("div","hint",emptyText);target.append(hint)}
   else if(hint.textContent!==emptyText)hint.textContent=emptyText;
   return;
  }
  let cursor=target.firstChild;const keep=new Set();
  for(const x of items){
   const row=update(x);keep.add(row);
   if(row!==cursor)target.insertBefore(row,cursor);
   cursor=row.nextSibling;
  }
  for(const child of [...target.children])if(!keep.has(child))child.remove();
 };
 const top=scroller.scrollTop;
 reconcile(pinned,hasPinned?rows.filter(x=>x.pinned_at):[],"");
 const empty=!S.user?"登录后查看聊天记录":!rows.length?(S.archivedView?"暂无归档聊天":"暂无聊天记录"):"";
 reconcile(recent,normal,empty);
 if(scroller.scrollTop!==top)scroller.scrollTop=top;
 if(historyActionAnchor)positionHistoryActions();
}
async function fetchChats(){
 const seq=++chatFetchSerial,scope=chatHistoryScope(),sameScope=historyScope===scope;
 const targetCount=sameScope&&$("shell").classList.contains("menu-open")?Math.max(100,S.chats.length):100;
 historyLoading=true;historyNextCursor=null;
 if(!S.user){historyScope=scope;historyLoading=false;S.chats=[];renderHistory();return}
 try{
  let rows=[],cursor=null;
  do{
   const data=await api(chatHistoryUrl(cursor));
   if(!currentHistoryRequest(seq,scope))return;
   rows=mergeHistoryRows(rows,data.chats||[]);
   const next=typeof data.nextCursor==="string"&&data.nextCursor!==cursor?data.nextCursor:null;
   cursor=next;
   if(!(data.chats||[]).length)cursor=null;
  }while(cursor&&rows.length<targetCount);
  if(!currentHistoryRequest(seq,scope))return;
  historyScope=scope;historyNextCursor=cursor;
  if(!sameScope)$("sidebarChatScroll").scrollTop=0;
  S.chats=rows;renderHistory();
 }catch(e){if(currentHistoryRequest(seq,scope))flashError("聊天列表读取失败："+humanError(e))}
 finally{if(seq===chatFetchSerial)historyLoading=false}
}
async function loadOlderHistory(){
 const scope=chatHistoryScope(),seq=chatFetchSerial,cursor=historyNextCursor,box=$("sidebarChatScroll");
 if(!S.user||historyLoading||!cursor||historyScope!==scope||!$("shell").classList.contains("menu-open")||box.scrollHeight-box.clientHeight-box.scrollTop>120)return;
 historyLoading=true;
 try{
  const data=await api(chatHistoryUrl(cursor));
  if(!currentHistoryRequest(seq,scope))return;
  S.chats=mergeHistoryRows(S.chats,data.chats||[]);
  historyNextCursor=(data.chats||[]).length&&typeof data.nextCursor==="string"&&data.nextCursor!==cursor?data.nextCursor:null;
  renderHistory();
 }catch(e){if(currentHistoryRequest(seq,scope))flashError("旧聊天读取失败："+humanError(e))}
 finally{if(seq===chatFetchSerial)historyLoading=false}
}
function renderProjects(){
 const box=$("projectsList");box.replaceChildren();box.hidden=!S.projectsExpanded;
 $("projectsToggle").setAttribute("aria-expanded",String(S.projectsExpanded));
 $("projectsToggle").classList.toggle("expanded",S.projectsExpanded);
 if(!S.projectsExpanded)return;
 if(!S.user){box.append(node("div","hint","登录后查看个人项目"));return}
 const tasks=S.workTasks||[],known=new Set(S.projects.map(p=>p.id));
 const taskRow=t=>{
  const b=node("button","project-task-row"+(S.workTaskId===t.id?" active":""));
  b.type="button";b.title=t.title||"工作任务";
  b.append(iconSlot("list-checks"),node("span","project-task-name",t.title||"工作任务"),node("small","project-task-status",workStatus(t)));
  b.addEventListener("click",()=>{
   if(S.workBusy&&S.workTaskId!==t.id){flashError("当前任务执行中，暂不能切换任务");return}
   S.workTaskId=t.id;setWorkMode(true);void selectWorkTask(t.id);
  });
  renderIcons(b);return b;
 };
 for(const p of S.projects){
  const row=node("div","project-row"+(S.activeProjectId===p.id?" active":""));
  const b=node("button","project-select");b.append(iconSlot("folder"),node("span","project-name",p.name));b.title=p.name;
  b.addEventListener("click",()=>{S.activeProjectId=p.id;S.archivedView=false;newChat();void fetchChats();renderProjects()});
  const edit=node("button","project-edit");edit.title="项目设置";edit.setAttribute("aria-label","编辑项目");
  edit.append(iconSlot("ellipsis"));edit.addEventListener("click",()=>openProject(p));row.append(b,edit);box.append(row);renderIcons(row);
  const belong=tasks.filter(t=>t.projectId===p.id);
  if(belong.length){const group=node("div","project-task-group");for(const t of belong)group.append(taskRow(t));box.append(group)}
 }
 const unassigned=tasks.filter(t=>!t.projectId||!known.has(t.projectId));
 if(unassigned.length){
  box.append(node("div","project-task-section-title","未分类任务"));
  for(const t of unassigned)box.append(taskRow(t));
 }
 if(!S.projects.length&&!tasks.length)box.append(node("div","hint","暂无个人项目"));
}
async function fetchProjects(){
 if(!S.user){S.projects=[];renderProjects();return}
 try{const d=await api("/api/projects");S.projects=d.projects||[];renderProjects()}
 catch(e){flashError("项目加载失败："+humanError(e))}
}
function openProject(project=null){
 if(!S.user){show("authDialog");return}
 S.editProjectId=project?.id||null;$("projectTitle").textContent=project?"项目设置":"新建项目";
 $("projectName").value=project?.name||"";$("projectInstructions").value=project?.instructions||"";
 $("deleteProject").hidden=!project;show("projectDialog");closeMenu();
}
async function saveProject(e){
 e.preventDefault();const body={name:$("projectName").value.trim(),instructions:$("projectInstructions").value.trim()};
 try{
  const p=S.editProjectId,answer=await api(p?"/api/projects/"+p+"/edit":"/api/projects",body);
  hide("projectDialog");if(!p)S.activeProjectId=answer.project.id;
  await fetchProjects();newChat();await fetchChats();
 }catch(e){flashError(humanError(e))}
}
async function deleteProject(){
 if(!S.editProjectId||!confirm("删除项目？项目内聊天将保留在全部聊天中。"))return;
 try{
  await api("/api/projects/"+S.editProjectId+"/delete",{});
  if(S.activeProjectId===S.editProjectId)S.activeProjectId=null;
  S.editProjectId=null;hide("projectDialog");await fetchProjects();await fetchChats()
 }catch(e){flashError(humanError(e))}
}
let historyActionAnchor=null;
function closeHistoryActions(){
 const dialog=$("actionsDialog"),anchor=historyActionAnchor;
 historyActionAnchor=null;
 if(anchor)anchor.setAttribute("aria-expanded","false");
 if(dialog.open)dialog.close();
 dialog.classList.remove("history-anchored");
 for(const key of ["left","right","top","max-height","width"])dialog.style.removeProperty(key);
}
function historyMenuPosition(anchor,drawer,menuHeight,viewportHeight){
 const left=drawer.left+8,right=drawer.right-8,width=Math.min(224,Math.max(0,right-left));
 const maxHeight=Math.max(60,viewportHeight-16),height=Math.min(menuHeight,maxHeight);
 const below=viewportHeight-8-anchor.bottom,above=anchor.top-8;
 const preferred=below>=height||below>=above?anchor.bottom+4:anchor.top-height-4;
 return {left:Math.max(left,Math.min(anchor.right-width,right-width)),top:Math.max(8,Math.min(preferred,viewportHeight-height-8)),width,maxHeight};
}
function positionHistoryActions(){
 const anchor=historyActionAnchor,dialog=$("actionsDialog");
 if(!anchor||!dialog.open)return;
 if(!anchor.isConnected||!$("shell").classList.contains("menu-open")){closeHistoryActions();return}
 const a=anchor.getBoundingClientRect(),d=$("sidebar").getBoundingClientRect(),scroller=$("sidebarChatScroll").getBoundingClientRect();
 if(a.bottom<=scroller.top||a.top>=scroller.bottom){closeHistoryActions();return}
 const height=window.visualViewport?.height||window.innerHeight;
 const pos=historyMenuPosition(a,d,dialog.scrollHeight+2,height);
 Object.assign(dialog.style,{left:pos.left+"px",top:pos.top+"px",right:"auto",width:pos.width+"px",maxHeight:pos.maxHeight+"px"});
}
function showHistoryActions(anchor){
 const dialog=$("actionsDialog");
 historyActionAnchor=anchor;anchor.setAttribute("aria-expanded","true");
 dialog.classList.add("history-anchored");
 if(!dialog.open)dialog.show();
 positionHistoryActions();
}
function actionItem(icon,label,job){
 return iconButton(icon,label,async()=>{closeHistoryActions();try{await job()}catch(e){flashError(humanError(e))}});
}
function openChatActions(chatId=S.chatId,anchor=null){
 if(anchor&&historyActionAnchor===anchor&&$("actionsDialog").open){closeHistoryActions();return}
 closeHistoryActions();
 S.actionChatId=chatId;
 const list=$("chatActionList");list.replaceChildren();
 if(!chatId){list.append(actionItem("square-pen","新聊天",async()=>newChat()),actionItem("search","搜索聊天",async()=>show("searchDialog")),actionItem("folder","新建项目",async()=>openProject()));show("actionsDialog");return}
 const item=S.chats.find(x=>x.id===chatId)||{id:chatId};
 list.append(
  actionItem("share","分享 / 导出聊天",async()=>exportChat(chatId)),
  actionItem("pin",item.pinned_at?"取消置顶":"置顶聊天",async()=>{await api("/api/chats/"+chatId+"/pin",{pinned:!item.pinned_at});await fetchChats()}),
  anchor?iconButton("folder","添加到项目",()=>showHistoryProjects(chatId,anchor)):actionItem("folder","添加到项目",async()=>openMoveDialog(chatId)),
  anchor?iconButton("square-pen","重命名",()=>showHistoryRename(chatId,item.title,anchor)):actionItem("square-pen","重命名",async()=>{const name=prompt("聊天名称",item.title||"新对话");if(name?.trim()){await api("/api/chats/"+chatId+"/rename",{title:name.trim()});await fetchChats()}}),
  actionItem("archive",item.archived_at?"恢复聊天":"归档聊天",async()=>{await api("/api/chats/"+chatId+"/archive",{archived:!item.archived_at});if(S.chatId===chatId)newChat(Boolean(anchor));await fetchChats()}),
  actionItem("trash","删除聊天",async()=>{if(!confirm("永久删除这段聊天及消息？"))return;await api("/api/chats/"+chatId+"/delete",{});if(S.chatId===chatId)newChat(Boolean(anchor));await fetchChats()})
 );
 if(anchor)showHistoryActions(anchor);else show("actionsDialog");
}
function showHistoryProjects(chatId,anchor){
 const list=$("chatActionList");list.replaceChildren();
 list.append(iconButton("message-circle","不属于任何项目",()=>void assign(null)));
 for(const p of S.projects)list.append(iconButton("folder",p.name,()=>void assign(p.id)));
 list.append(iconButton("arrow-up","返回聊天操作",()=>{closeHistoryActions();openChatActions(chatId,anchor)}));
 positionHistoryActions();
 async function assign(projectId){
  try{await api("/api/chats/"+chatId+"/project",{projectId});closeHistoryActions();await fetchChats();await fetchProjects()}
  catch(e){flashError(humanError(e))}
 }
}
function showHistoryRename(chatId,title,anchor){
 const list=$("chatActionList"),form=node("form","history-inline-rename"),input=node("input"),save=node("button","action-row","保存名称");
 list.replaceChildren();input.value=title||"新对话";input.maxLength=120;input.setAttribute("aria-label","聊天名称");save.type="submit";
 form.append(input,save);list.append(form,iconButton("arrow-up","取消",()=>{closeHistoryActions();openChatActions(chatId,anchor)}));
 form.addEventListener("submit",async event=>{
  event.preventDefault();const name=input.value.trim();if(!name)return;
  save.disabled=true;
  try{await api("/api/chats/"+chatId+"/rename",{title:name});closeHistoryActions();await fetchChats()}
  catch(e){flashError(humanError(e));save.disabled=false}
 });
 positionHistoryActions();input.focus({preventScroll:true});input.select();
}
async function exportChat(id){
 const d=await api("/api/chats/"+id),title=d.chat?.title||"聊天";
 const text=d.messages.map(x=>(x.role==="assistant"?"AI":"我")+"："+x.body).join("\n\n");
 const file=new File([text],title.replace(/[\\/:*?"<>|]/g,"_")+".txt",{type:"text/plain"});
 if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title}).catch(e=>{if(e.name!=="AbortError")throw e});return}
 const link=document.createElement("a"),url=URL.createObjectURL(file);link.href=url;link.download=file.name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function openMoveDialog(id){
 S.actionChatId=id;const list=$("moveProjectList");list.replaceChildren();
 list.append(iconButton("message-circle","不属于任何项目",()=>void moveChat(null)));
 for(const p of S.projects)list.append(iconButton("folder",p.name,()=>void moveChat(p.id)));
 list.append(iconButton("plus","新建项目",()=>{hide("moveDialog");openProject()}));
 show("moveDialog");
}
async function moveChat(id){
 try{
  await api("/api/chats/"+S.actionChatId+"/project",{projectId:id});hide("moveDialog");await fetchChats();await fetchProjects();
 }catch(e){flashError(humanError(e))}
}
let chatSearchTimer=0,chatSearchSerial=0,chatSearchComposing=false;
function fuzzyChatMatch(value,query){
 const text=String(value||"").toLocaleLowerCase(),q=String(query||"").trim().toLocaleLowerCase();
 if(!q||text.includes(q))return true;
 let index=0;for(const char of q.replace(/\s+/g,"")){index=text.indexOf(char,index);if(index<0)return false;index+=char.length}return true;
}
function renderChatSearchRows(rows){
 const r=$("searchResults");r.replaceChildren();
 for(const c of rows){const b=iconButton("message-circle",c.title||"未命名聊天",()=>{hide("searchDialog");void loadChat(c.id)});r.append(b)}
}
function queueChatSearch(immediate=false){
 clearTimeout(chatSearchTimer);const serial=++chatSearchSerial,owner=S.user?.id,q=$("chatSearchInput").value.trim(),r=$("searchResults");
 if(!$("searchDialog").open)return;
 if(!owner){r.replaceChildren(node("div","hint","登录后搜索聊天记录"));return}
 const local=(S.chats||[]).filter(c=>fuzzyChatMatch(c.title,q)).slice(0,35);renderChatSearchRows(local);
 if(!q){if(!local.length)r.append(node("div","hint","暂无聊天记录"));return}
 if(!local.length)r.append(node("div","hint","搜索中…"));
 const current=()=>serial===chatSearchSerial&&S.user?.id===owner&&$("searchDialog").open&&$("chatSearchInput").value.trim()===q;
 const run=async()=>{try{
  const d=await api("/api/chats/search?q="+encodeURIComponent(q));if(!current())return;
  const rows=Array.isArray(d.chats)?d.chats:[];renderChatSearchRows(rows);
  if(!rows.length)r.append(node("div","hint","未找到聊天"));
 }catch(e){if(current()){renderChatSearchRows(local);r.append(node("div","hint",humanError(e)))}}};
 if(immediate)void run();else chatSearchTimer=setTimeout(run,350);
}
function searchChats(e){e.preventDefault();if(!chatSearchComposing)queueChatSearch(true)}
let uploadedFilesOwner=null,uploadedFilesSignature="",uploadedFilesRequest=0;
function uploadedFileKind(f){
 const type=String(f.type||"").toLowerCase(),name=String(f.name||"").toLowerCase();
 if(type.startsWith("image/")||/\.(png|jpe?g|webp|gif|avif|heic|heif)$/.test(name))return "image";
 if(type.startsWith("video/")||/\.(mp4|mov|webm|m4v|mkv|avi)$/.test(name))return "video";
 return "file-text";
}
function renderUploadedFiles(files,box){
 const signature=JSON.stringify(files.map(f=>[f.id,f.name,f.type,f.size,f.uploadedAt]));
 if(signature===uploadedFilesSignature&&box.children.length)return;
 const fragment=document.createDocumentFragment();
 for(const f of files){
  const a=node("a","file-link uploaded-file"),kind=uploadedFileKind(f);
  a.href=f.url;a.target="_blank";a.rel="noopener noreferrer";
  const media=node("span","uploaded-file-media");const glyph=iconSlot(kind);media.append(glyph);renderIcons(media);
  if(kind==="image"){
   const img=node("img");img.alt="";img.loading="lazy";img.decoding="async";
   img.addEventListener("load",()=>{media.classList.add("has-thumbnail")},{once:true});
   img.addEventListener("error",()=>img.remove(),{once:true});
   media.append(img);img.src=f.url;
  }
  const info=node("span","uploaded-file-info");const title=node("strong","",f.name||"附件");const stamp=new Date(f.uploadedAt||NaN);
  const time=node("time","uploaded-file-time",Number.isFinite(stamp.getTime())?new Intl.DateTimeFormat("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(stamp):"上传时间未记录");
  if(Number.isFinite(stamp.getTime()))time.dateTime=stamp.toISOString();
  info.append(title,time);a.append(media,info);fragment.append(a);
 }
 if(!files.length)fragment.append(node("div","hint","尚无已上传文件"));
 box.replaceChildren(fragment);uploadedFilesSignature=signature;
}
async function openFiles(){
 if(!S.user){show("authDialog");return}
 const owner=S.user.id,box=$("savedFiles"),request=++uploadedFilesRequest;
 if(uploadedFilesOwner!==owner){uploadedFilesOwner=owner;uploadedFilesSignature="";box.replaceChildren(node("div","hint","读取文件中…"))}
 show("filesDialog");closeMenu();
 try{
  const d=await api("/api/files");if(S.user?.id!==owner||request!==uploadedFilesRequest)return;
  renderUploadedFiles(d.files||[],box);
 }catch(e){if(S.user?.id===owner&&request===uploadedFilesRequest&&!uploadedFilesSignature)box.replaceChildren(node("div","hint",humanError(e)))}
}
const CHAT_TEXT_SIZE_KEY="aigzt:chat-text-size";
const CHAT_TEXT_SIZES=Object.freeze({small:"12px",normal:"14px",large:"18px"});
function savedChatTextSize(){
 try{const value=localStorage.getItem(CHAT_TEXT_SIZE_KEY);return Object.hasOwn(CHAT_TEXT_SIZES,value)?value:"normal"}
 catch{return "normal"}
}
function applyChatTextSize(value){
 const size=Object.hasOwn(CHAT_TEXT_SIZES,value)?value:"normal";
 document.documentElement.style.setProperty("--aigzt-chat-text-size",CHAT_TEXT_SIZES[size]);
 document.documentElement.dataset.chatTextSize=size;
 requestAnimationFrame(refreshUserMessageFolds);
}
function previewChatTextSize(value){
 const preview=$("chatTextSizePreview");
 if(preview)preview.dataset.size=Object.hasOwn(CHAT_TEXT_SIZES,value)?value:"normal";
}
function syncChatTextSizeSettings(){
 const size=savedChatTextSize();
 const radio=$('settingsTextSize')?.querySelector('input[value="'+size+'"]');
 if(radio)radio.checked=true;
 previewChatTextSize(size);
 $("chatTextSizeStatus").textContent="";
}
function applyTheme(mode){
 S.currentTheme=mode;const enabled=mode==="rainbow";
 document.body.classList.toggle("rainbow-enabled",enabled);
 $("settingRainbow").checked=enabled;
 try{localStorage.setItem("aigzt:rainbow",enabled?"1":"0")}catch{}
}
async function persistPrefs(){
 if(!S.user)return;
 await api("/api/preferences",{memoryEnabled:S.memoryEnabled,theme:S.currentTheme});
}
async function openSettings(){
 if(!S.user){show("authDialog");return}
 show("settingsDialog");closeMenu();$("settingsEmail").textContent=S.user.email;
 syncChatTextSizeSettings();
 showDeviceMediaSettings();
 for(const item of $("settingsDialog").querySelectorAll(".settings-entry,.settings-about"))item.open=false;
 $("settingsDialog").querySelector(".settings-scroll").scrollTop=0;
 $("savedMessagesList").hidden=true;
 $("settingsExportChat").disabled=!S.chatId;
 const quota=S.quota;
 $("settingsQuotaSummary").textContent=quota&&Number.isFinite(quota.remaining)&&Number.isFinite(quota.limit)?
  "免费请求保护配额：剩余 "+quota.remaining+" / "+quota.limit+(Number.isFinite(quota.siteRemaining)?" · 全站剩余 "+quota.siteRemaining:""):
  "外部免费模型的额度由相应服务商提供，当前没有可确认的配额统计。";
 $("settingsDictationLang").value=settingsDictationLanguage();
 updateTokenSettingsSummary();
 try{
  const d=await api("/api/memory");S.notes=d.notes||[];S.memoryEnabled=d.enabled;applyTheme(d.theme);
  $("settingMemory").checked=S.memoryEnabled;renderNotes();
 }catch(e){flashError(humanError(e))}
}
function updateTokenSettingsSummary(){
 const target=$("settingsTokenSummary");if(!target)return;
 let reported=0,input=0,output=0,total=0;
 for(const row of $("messageList").querySelectorAll(".message.assistant")){
  let u=null;try{u=JSON.parse(row.dataset.usage||"null")}catch{}
  if(!u||typeof u!=="object")continue;
  if(!Number.isSafeInteger(u.total)||u.total<0)continue;
  reported++;total+=u.total;
  if(Number.isSafeInteger(u.input)&&u.input>=0)input+=u.input;
  if(Number.isSafeInteger(u.output)&&u.output>=0)output+=u.output;
 }
 target.textContent=reported?"当前已加载聊天 · "+reported+" 条已报告用量 · 输入 "+input.toLocaleString()+" · 输出 "+output.toLocaleString()+" · 合计 "+total.toLocaleString()+" tokens":"当前聊天暂无服务商返回的 Token 统计";
}
async function loadModelInstruction(){
 const model=S.model,provider=S.provider,key=provider+"|"+model;
 $("instructionModelName").textContent=chatSelectedName();
 const field=$("modelInstruction");field.dataset.modelKey=key;field.value="";
 $("modelInstructionStatus").textContent="正在读取当前模型设置";
 try{
  const x=await api("/api/model-directive?provider="+encodeURIComponent(provider)+"&model="+encodeURIComponent(model));
  if(field.dataset.modelKey!==key||!$("settingsDialog").open)return;
  field.value=x.instruction||"";$("modelInstructionStatus").textContent="仅应用于此模型的后续回复";
 }catch(e){if(field.dataset.modelKey===key)$("modelInstructionStatus").textContent=humanError(e)}
}
async function saveModelInstruction(){
 const field=$("modelInstruction"),model=S.model,provider=S.provider;
 if(field.dataset.modelKey!==provider+"|"+model){await loadModelInstruction();return}
 const save=$("modelInstructionSave");save.disabled=true;
 try{
  await api("/api/model-directive",{provider,model,instruction:field.value.trim()});
  $("modelInstructionStatus").textContent="已保存，仅对该模型后续回复生效";
 }catch(e){$("modelInstructionStatus").textContent=humanError(e)}
 finally{save.disabled=false}
}
async function toggleSavedMessages(){
 const list=$("savedMessagesList");if(!list.hidden){list.hidden=true;return}
 list.hidden=false;list.replaceChildren(node("div","hint","正在读取收藏…"));
 try{
  const data=await api("/api/saved-messages"),items=data.items||[];
  list.replaceChildren();
  if(!items.length){list.append(node("div","hint","没有已保存的消息"));return}
  for(const item of items){
   const kind=item.role==="assistant"?"AI":"我";
   const label=kind+" · "+(item.title||"对话")+" · "+String(item.preview||"").replace(/\s+/g," ").slice(0,85);
   const button=iconButton("bookmark",label,async()=>{
    hide("settingsDialog");
    await loadChat(item.chat_id);
    const wanted=Array.from($("messageList").querySelectorAll(".message")).find(x=>x.dataset.messageId===item.message_id);
    if(wanted)wanted.scrollIntoView({behavior:"smooth",block:"center"});
    else flashError("该消息不在当前加载范围，已打开对应聊天");
   });
   list.append(button);
  }
 }catch(e){list.replaceChildren(node("div","hint","收藏读取失败："+humanError(e)))}
}
function renderNotes(){
 const list=$("memoryList");list.replaceChildren();
 if(!S.notes.length){list.append(node("div","hint","还没有保存的长期记忆"));return}
 for(const m of S.notes){
  const row=node("div","memory-row"),text=node("span","",m.note),del=node("button","icon-btn","");del.title="删除记忆";del.append(iconSlot("x"));
  del.addEventListener("click",async()=>{try{await api("/api/memory/"+m.id+"/delete",{});S.notes=S.notes.filter(x=>x.id!==m.id);renderNotes()}catch(e){flashError(humanError(e))}});
  row.append(text,del);list.append(row);renderIcons(row)
 }
}
async function saveNote(e){
 e.preventDefault();
 try{const d=await api("/api/memory",{note:$("memoryInput").value.trim()});S.notes.unshift(d.note);$("memoryInput").value="";renderNotes()}
 catch(e){flashError(humanError(e))}
}
async function listArchived(){
 hide("settingsDialog");S.archivedView=true;S.activeProjectId=null;newChat();await fetchChats();openMenu();
}

function syncHomeAmbient(){
 const view=$("conversation");
 document.body.classList.toggle("home-ambient",!!view&&view.classList.contains("empty-chat")&&!view.hidden&&!S.workMode&&!S.freeToolsMode);
}
function hideWelcome(){$("welcome").hidden=true;$("conversation").classList.remove("empty-chat");syncHomeAmbient()}
function showWelcome(){$("welcome").hidden=false;$("conversation").classList.add("empty-chat");syncHomeAmbient()}



/* The assistant's expression follows actual response progress; older rows do not animate. */
let aiPortraitSerial=0;
function makeAssistantPortrait(){
 const el=node("span","avatar-ai");el.dataset.state="idle";
 el.setAttribute("role","img");el.setAttribute("aria-label","IMAI 助手");
 const id="aigzt-portrait-"+(++aiPortraitSerial);
 el.innerHTML="<svg viewBox=\"0 0 64 64\" width=\"36\" height=\"36\" aria-hidden=\"true\" focusable=\"false\">\n<defs><radialGradient id=\"AVID-halo\" cx=\"25%\" cy=\"16%\" r=\"90%\"><stop stop-color=\"#fcffff\"/><stop offset=\".46\" stop-color=\"#b4e7f5\"/><stop offset=\"1\" stop-color=\"#7493df\"/></radialGradient>\n<linearGradient id=\"AVID-shell\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop stop-color=\"#ffffff\"/><stop offset=\".48\" stop-color=\"#e1ecf8\"/><stop offset=\"1\" stop-color=\"#94b7d5\"/></linearGradient>\n<linearGradient id=\"AVID-screen\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop stop-color=\"#285f78\"/><stop offset=\"1\" stop-color=\"#152d4a\"/></linearGradient>\n<linearGradient id=\"AVID-eye\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop stop-color=\"#5bf8e5\"/><stop offset=\"1\" stop-color=\"#99bbff\"/></linearGradient></defs>\n<circle class=\"ai-avatar-halo\" cx=\"32\" cy=\"32\" r=\"30\" fill=\"url(#AVID-halo)\"/><circle cx=\"32\" cy=\"32\" r=\"29.2\" stroke=\"#fff\" stroke-opacity=\".85\" stroke-width=\"1.4\" fill=\"none\"/>\n<g class=\"ai-avatar-core\">\n<path d=\"M32 14V9\" fill=\"none\" stroke=\"#367b97\" stroke-linecap=\"round\" stroke-width=\"2.1\"/><circle class=\"ai-avatar-beacon\" cx=\"32\" cy=\"7.6\" r=\"3.1\" fill=\"#69e9df\" stroke=\"#fff\" stroke-width=\"1.3\"/>\n<rect x=\"7\" y=\"29\" width=\"8\" height=\"15\" rx=\"4\" fill=\"#c5e0ef\" stroke=\"#7ca6c2\"/><rect x=\"49\" y=\"29\" width=\"8\" height=\"15\" rx=\"4\" fill=\"#c5e0ef\" stroke=\"#7ca6c2\"/>\n<rect x=\"11\" y=\"15\" width=\"42\" height=\"42\" rx=\"17\" fill=\"url(#AVID-shell)\" stroke=\"#83a4bd\" stroke-width=\"1.2\"/>\n<path d=\"M17 24c3-5 7.5-7 13.5-7h9\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".85\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n<rect x=\"15.5\" y=\"25.5\" width=\"33\" height=\"23\" rx=\"11.5\" fill=\"url(#AVID-screen)\" stroke=\"#719fb9\"/><path d=\"M19 29c5.5-3.7 17-4.6 26 0\" fill=\"none\" stroke=\"#d2ffff\" stroke-opacity=\".19\" stroke-width=\"1.7\"/>\n<ellipse class=\"ai-avatar-eye\" cx=\"25\" cy=\"35\" rx=\"3.2\" ry=\"3.9\" fill=\"url(#AVID-eye)\"/><ellipse class=\"ai-avatar-eye\" cx=\"39\" cy=\"35\" rx=\"3.2\" ry=\"3.9\" fill=\"url(#AVID-eye)\"/>\n<circle cx=\"26\" cy=\"33.8\" r=\".95\" fill=\"#fff\"/><circle cx=\"40\" cy=\"33.8\" r=\".95\" fill=\"#fff\"/>\n<path class=\"ai-avatar-smile\" d=\"M27 42q5 4 10 0\" fill=\"none\" stroke=\"#a9edf8\" stroke-width=\"1.9\" stroke-linecap=\"round\"/>\n<ellipse class=\"ai-avatar-mouth\" cx=\"32\" cy=\"43\" rx=\"3.7\" ry=\"2.3\" fill=\"#8ee7f5\"/>\n<circle cx=\"17.5\" cy=\"43\" r=\"2.2\" fill=\"#f4a7c1\" opacity=\".68\"/><circle cx=\"46.5\" cy=\"43\" r=\"2.2\" fill=\"#f4a7c1\" opacity=\".68\"/>\n<path d=\"M26 52q6 3 12 0\" fill=\"none\" stroke=\"#95abc5\" stroke-width=\"1.1\" stroke-linecap=\"round\"/>\n</g></svg>".replaceAll("AVID",id);
 return el;
}
function setPortraitState(row,state){
 const avatar=row?.querySelector(":scope > .avatar-ai");
 if(!avatar||avatar.dataset.state===state)return;
 avatar.dataset.state=state;
 if(state==="finished")window.setTimeout(()=>{
  if(avatar.isConnected&&avatar.dataset.state==="finished")setPortraitState(row,"idle");
 },900);
}
function createImageWaitingFrame(){
 const frame=node("div","image-loading-card");frame.setAttribute("role","img");frame.setAttribute("aria-label","七彩图片生成中");
 frame.append(node("span","image-loading-glow"),node("span","image-loading-shimmer"));return frame;
}
/* New image content changes the conversation height after the empty reply has been positioned. */
function followLatestImage(bubble){
 const viewport=$("conversation"),row=bubble?.closest(".message"),list=$("messageList");
 if(!viewport||viewport.hidden||!row?.isConnected||row!==list?.lastElementChild)return;
 requestAnimationFrame(()=>{
  if(!row.isConnected||row!==list.lastElementChild||viewport.hidden)return;
  viewport.scrollTop=viewport.scrollHeight-viewport.clientHeight;
 });
}
function chatImageNearBottom(bubble){
 const viewport=$("conversation"),row=bubble?.closest(".message");
 return !!viewport&&!viewport.hidden&&!!row?.isConnected&&row===$("messageList")?.lastElementChild&&
  viewport.scrollHeight-viewport.scrollTop-viewport.clientHeight<140;
}
function showChatImageWaiting(bubble,label){
 bubble.classList.add("chat-image-task");bubble.replaceChildren(label,createImageWaitingFrame());
 // Follow only the newly submitted picture, never historical jobs during chat restore.
 if(S.busy)followLatestImage(bubble);
}

/* Generated media is stored only on this device; reading history never submits jobs. */
let localMediaDB;
function openLocalMedia(){
 if(!localMediaDB)localMediaDB=new Promise((resolve,reject)=>{
  const req=indexedDB.open("aigzt-device-media-v1",1);
  req.onupgradeneeded=()=>req.result.createObjectStore("media");
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
 }).catch(e=>{localMediaDB=null;throw e});
 return localMediaDB;
}
function deviceMediaKey(id){return S.user?.id&&id?S.user.id+":"+id:null}
const localImageFiles=new WeakMap();
function localImageElement(blob,loading="eager"){
 const img=node("img","chat-generated-image");img.alt="生成图片";img.loading=loading;
 localImageFiles.set(img,blob);img.src=URL.createObjectURL(blob);return img;
}
let mediaPersistenceRequested=false;
function requestDeviceMediaPersistence(){
 if(mediaPersistenceRequested)return;
 mediaPersistenceRequested=true;
 try{void navigator.storage?.persist?.().catch(()=>{})}catch{}
}
async function deviceMediaPut(key,value){
 if(!key||(!(value instanceof Blob&&value.size>0)&&!(Array.isArray(value)&&value.length&&value.every(b=>b instanceof Blob&&b.size>0))))return false;
 try{const db=await openLocalMedia();await new Promise((resolve,reject)=>{
  const tx=db.transaction("media","readwrite");
  tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  tx.objectStore("media").put(value,key);
 });return true}catch(e){console.warn("Device media cache write failed",e?.name||"unknown");return false}
}
function mediaCacheWarning(bubble){
 if(!bubble?.isConnected)return;
 if(!bubble.querySelector(".device-media-warning"))bubble.append(node("span","video-job-hint device-media-warning","本机缓存未写入，请先下载图片或视频，关闭后可能无法恢复。"));
}
async function cacheReplyImages(owner,id,sources){
 if(!sources?.length)return true;
 if(!owner||!id)return false;
 requestDeviceMediaPersistence();
 const results=await Promise.all(sources.map(src=>deviceMediaBlob(src).catch(()=>null)));
 const blobs=results.filter(b=>b instanceof Blob&&b.size>0&&b.type.startsWith("image/"));
 if(!blobs.length)return false;
 const saved=await deviceMediaPut(owner+":"+id+":reply-images",blobs);
 return saved&&blobs.length===sources.length;
}
async function restoreReplyImages(bubble,id,replace=false){
 const key=deviceMediaKey(id);if(!key)return false;
 let blobs=await deviceMediaGet(key+":reply-images");
 if(!Array.isArray(blobs)||!blobs.length){const legacy=await deviceMediaGet(key);blobs=legacy instanceof Blob&&legacy.type.startsWith("image/")?[legacy]:[]}
 blobs=blobs.filter(b=>b instanceof Blob&&b.type.startsWith("image/"));
 if(!blobs.length||!bubble.isConnected||deviceMediaKey(id)!==key||bubble.closest(".message")?.dataset.messageId!==id)return false;
 if(replace)bubble.replaceChildren();
 for(const blob of blobs){
  bubble.append(localImageElement(blob,"lazy"));
 }
 return true;
}
async function visitDeviceMedia(owner,remove=false){
 const db=await openLocalMedia();
 return new Promise((resolve,reject)=>{
  const totals={image:0,video:0,images:0,videos:0};
  const tx=db.transaction("media",remove?"readwrite":"readonly"),store=tx.objectStore("media");
  tx.oncomplete=()=>resolve(totals);tx.onabort=()=>reject(tx.error);tx.onerror=()=>reject(tx.error);
  const req=store.openCursor();
  req.onsuccess=()=>{
   const c=req.result;if(!c)return;
   if(typeof c.key==="string"&&c.key.startsWith(owner+":")){
    const blobs=Array.isArray(c.value)?c.value:[c.value];let generated=false;
    for(const b of blobs){if(!(b instanceof Blob))continue;
     if(b.type.startsWith("image/")){totals.image+=b.size;totals.images++;generated=true}
     else if(b.type.startsWith("video/")){totals.video+=b.size;totals.videos++;generated=true}
    }
    if(remove&&generated)c.delete();
   }
   c.continue();
  };
 });
}
function formatDeviceMediaSize(bytes){
 if(bytes>=1073741824)return (bytes/1073741824).toFixed(2)+" GB";
 if(bytes>=1048576)return (bytes/1048576).toFixed(2)+" MB";
 if(bytes>=1024)return (bytes/1024).toFixed(1)+" KB";
 return bytes+" B";
}
function showDeviceMediaSettings(){
 if(!S.user)return;
 let panel=$("deviceMediaSettings");
 if(!panel){
  panel=node("details","settings-entry");panel.id="deviceMediaSettings";
  const heading=node("summary","settings-row"),iconWrap=node("span","settings-entry-icon"),icon=node("span","ui-icon");
  icon.dataset.icon="folder";icon.setAttribute("aria-hidden","true");iconWrap.append(icon);
  const label=node("span","settings-row-text"),hint=node("small","","图片与视频");hint.id="deviceMediaSummary";
  label.append(node("strong","","存储空间"),hint);
  const chevron=node("span","settings-chevron ui-icon");chevron.dataset.icon="chevron-down";chevron.setAttribute("aria-hidden","true");
  heading.append(iconWrap,label,chevron);
  const body=node("div","settings-entry-body"),total=node("p","small-note","正在读取…");total.id="deviceMediaStatus";
  const images=node("p","small-note","图片 —");images.id="deviceMediaImageSize";
  const videos=node("p","small-note","视频 —");videos.id="deviceMediaVideoSize";
  const actions=node("div","settings-actions"),clear=node("button","outline full","清理缓存");clear.type="button";clear.id="deviceMediaClear";clear.disabled=true;
  const note=node("p","settings-hint","仅保存在此设备。清理后无法恢复。");
  clear.onclick=async()=>{const account=S.user?.id;if(!account||clear.disabled||!confirm("清理后，本机生成的图片和视频将无法恢复。确定清理？"))return;
   clear.disabled=true;try{await visitDeviceMedia(account,true);if(S.user?.id===account)await refreshDeviceMediaSettings(account)}catch{if(S.user?.id===account){total.textContent="清理失败，请重试";clear.disabled=false}}};
  actions.append(clear);body.append(total,images,videos,actions,note);panel.append(heading,body);
  const anchor=$("settingsUsage");if(anchor)anchor.after(panel);else $("settingsDialog").querySelector(".settings-scroll").append(panel);
  renderIcons(panel);
  panel.addEventListener("toggle",()=>{if(panel.open&&S.user)void refreshDeviceMediaSettings(S.user.id)});
 }
}
async function refreshDeviceMediaSettings(owner){
 const status=$("deviceMediaStatus"),clear=$("deviceMediaClear");if(!status||!clear)return;
 status.textContent="正在读取…";clear.disabled=true;
 try{
  const t=await visitDeviceMedia(owner);if(S.user?.id!==owner)return;
  const size=formatDeviceMediaSize(t.image+t.video);
  $("deviceMediaSummary").textContent=size+" · 此设备";
  status.textContent="已用空间　"+size;
  $("deviceMediaImageSize").textContent="图片　"+t.images+" 张 · "+formatDeviceMediaSize(t.image);
  $("deviceMediaVideoSize").textContent="视频　"+t.videos+" 个 · "+formatDeviceMediaSize(t.video);
  clear.disabled=t.images+t.videos===0;
 }catch{if(S.user?.id===owner)status.textContent="无法读取存储空间";}
}
async function deviceMediaGet(key){
 if(!key)return null;
 try{const db=await openLocalMedia();return await new Promise((resolve,reject)=>{
  const req=db.transaction("media","readonly").objectStore("media").get(key);
  req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);
 })}catch{return null}
}
async function deviceMediaBlob(src){
 const match=String(src||"").match(/^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/=]+)$/i);
 if(match){const raw=atob(match[2]),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return new Blob([bytes],{type:match[1]})}
 if(!/^\/api\/(?:files|video\/(?:media|result))\/[0-9a-f-]{36}$/i.test(src))return null;
 const res=await fetch(src,{cache:"no-store",credentials:"same-origin"});
 if(!res.ok)return null;
 const blob=await res.blob();return /^(image\/|video\/)/.test(blob.type)?blob:null;
}
function localMediaNotice(bubble,kind){bubble.replaceChildren(node("span","video-job-hint",kind==="video"?"视频仅保留在原设备；不会自动重新生成":"图片仅保留在原设备；不会自动重新生成"))}
function renderDeviceMedia(bubble,blob,kind){
 if(kind==="video"){
  const url=URL.createObjectURL(blob);
  const video=node("video","chat-generated-video");video.controls=true;video.playsInline=true;video.preload="metadata";video.src=url;
  const link=node("a","chat-video-save","下载");link.href=url;link.download="aigzt-video.mp4";bubble.replaceChildren(video,link);
 }else{
  bubble.replaceChildren(localImageElement(blob));
  const row=bubble.closest(".message");if(row)appendMessageCopy(row,"");
 }
}
async function restoreDeviceMedia(bubble,id,kind,legacyUrl="",legacyJobId=""){
 const key=deviceMediaKey(id);localMediaNotice(bubble,kind);
 let blob=await deviceMediaGet(key);
 if(!(blob instanceof Blob)&&kind==="image"&&legacyJobId&&legacyJobId!==id){
  const legacyKey=deviceMediaKey(legacyJobId);blob=await deviceMediaGet(legacyKey);
  if(blob instanceof Blob&&blob.size&&key)await deviceMediaPut(key,blob);
 }
 if(!(blob instanceof Blob)&&kind==="image"&&await restoreReplyImages(bubble,id,true))return;
 if(!(blob instanceof Blob)&&legacyUrl){try{blob=await deviceMediaBlob(legacyUrl);if(blob)await deviceMediaPut(key,blob)}catch{}}
 if(blob instanceof Blob&&bubble.isConnected&&deviceMediaKey(id)===key)renderDeviceMedia(bubble,blob,kind);
}

function renderImageJob(bubble,id){
 bubble.dataset.imageTask=id;
 const label=node("span","image-job-label","作图中 1秒");
 bubble.dataset.imageStart=String(Date.now());
 showChatImageWaiting(bubble,label);
 const interval=window.setInterval(()=>{
  if(!bubble.isConnected||bubble.dataset.imageTask!==id){window.clearInterval(interval);return}
  const elapsed=Math.max(1,Math.floor((Date.now()-Number(bubble.dataset.imageStart||Date.now()))/1000)+1);
  label.textContent="作图中 "+elapsed+"秒";
 },1000);
 window.setTimeout(()=>void pollImageJob(bubble,id,false),0);
}
function showImageRetry(bubble){
 delete bubble.dataset.imageTask;delete bubble.dataset.imageFinalizing;bubble.classList.remove("chat-image-task");
 const row=bubble.closest(".message");
 const button=messageTool("refresh-cw","重新作图",()=>{if(row)retryMessage(row)});
 bubble.replaceChildren(button);renderIcons(button);setPortraitState(row,"idle");
}
async function pollImageJob(bubble,id,manual){
 if(!bubble.isConnected||bubble.dataset.imageTask!==id||bubble.dataset.imageBusy==="1")return;
 const now=Date.now();
 if(!manual&&now-Number(bubble.dataset.lastImagePoll||0)<900)return;
 bubble.dataset.imageBusy="1";bubble.dataset.lastImagePoll=String(now);
 let delay=10000;
 try{
  const messageId=bubble.closest(".message")?.dataset.messageId||id;
  const key=deviceMediaKey(messageId),owner=S.user?.id;
  requestDeviceMediaPersistence();
  const r=await api("/api/image/task/"+id);
  let cached=false,blob=null;
  if(r.done&&!r.failed&&r.image){
   try{blob=await deviceMediaBlob(r.image);cached=blob instanceof Blob&&blob.size>0&&blob.type.startsWith("image/")&&await deviceMediaPut(key,blob)}catch{cached=false}
  }
  if(!bubble.isConnected||bubble.dataset.imageTask!==id||S.user?.id!==owner)return;
  if(Number.isFinite(r.startedAt)&&r.startedAt>0)bubble.dataset.imageStart=String(r.startedAt);
  if(r.done){
   delete bubble.dataset.imageTask;
   if(r.failed){showImageRetry(bubble);return}
   const img=cached?localImageElement(blob):node("img","chat-generated-image");
   img.alt="生成图片";img.loading="eager";bubble.dataset.imageFinalizing=id;
   img.onload=()=>{
    if(!bubble.isConnected||bubble.dataset.imageFinalizing!==id)return;
    const follow=chatImageNearBottom(bubble);
    delete bubble.dataset.imageFinalizing;
    bubble.classList.remove("chat-image-task");bubble.replaceChildren(img);
    const row=bubble.closest(".message");
    if(row){row.dataset.messageKind="image";appendMessageCopy(row,"")}
    if(!cached)mediaCacheWarning(bubble);
    // The final image can have a different height from the loading frame.
    if(follow)followLatestImage(bubble);
   };
   img.onerror=()=>{if(bubble.dataset.imageFinalizing!==id)return;showImageRetry(bubble)};
   if(cached){if(img.complete&&img.naturalWidth)img.onload()}else img.src=r.image;return;
  }
  delay=Math.max(1000,Math.min(18000,Number(r.waitSeconds||12)*1000));
 }catch(e){/* 网络短暂故障仍保持秒数，后续继续查询 */}
 finally{
  bubble.dataset.imageBusy="0";if(!bubble.dataset.imageStart)bubble.dataset.imageStart=String(Date.now());
  if(bubble.isConnected&&bubble.dataset.imageTask===id){if(Date.now()-Number(bubble.dataset.imageStart)<300000)window.setTimeout(()=>void pollImageJob(bubble,id,false),delay);else showImageRetry(bubble)}
 }
}

/* Construct HTTP(S) chat links as DOM anchors; no model HTML is executed. */
const CHAT_LINKS=/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|https?:\/\/[^\s<>"'\x60]+|www\.[^\s<>"'\x60]+|\b(?:[a-z0-9-]+\.)+(?:com|net|org|io|ai|cn|app|online|dev|site|co|me|info|xyz)(?::\d{2,5})?(?:\/[^\s<>"'\x60]*)?/gi;
function appendChatLinks(target,value){
 const input=String(value||"");CHAT_LINKS.lastIndex=0;let offset=0,match;
 while((match=CHAT_LINKS.exec(input))){
  if(match.index>offset)target.append(document.createTextNode(input.slice(offset,match.index)));
  const isMd=Boolean(match[2]),raw=isMd?match[2]:match[0],tail=isMd?"":(raw.match(/[.,!?;:，。！？；：）)\]}]+$/)||[""])[0];
  const cleaned=raw.slice(0,raw.length-tail.length),display=isMd?match[1]:cleaned;
  let url;try{url=new URL(/^https?:\/\//i.test(cleaned)?cleaned:"https://"+cleaned)}catch{}
  if(url&&["http:","https:"].includes(url.protocol)&&url.hostname){
   const a=node("a","chat-inline-link",display);a.href=url.href;a.target="_blank";a.rel="noopener noreferrer";target.append(a);
   if(tail)target.append(document.createTextNode(tail));
  }else target.append(document.createTextNode(match[0]));
  offset=CHAT_LINKS.lastIndex;
 }
 if(offset<input.length)target.append(document.createTextNode(input.slice(offset)));
}
/* Format AI output as a single conversational reply. No model-supplied HTML is executed. */
function appendReplyImage(target,raw,alt="模型返回的图片"){
 const src=String(raw||"");let safe=false;
 if(/^data:image\/(?:png|jpeg|webp|gif|avif);base64,[A-Za-z0-9+/=]+$/i.test(src)&&src.length<=8000000)safe=true;
 else if(/^\/api\/files\/[0-9a-f-]{36}$/i.test(src))safe=true;
 else{try{const u=new URL(src);safe=u.protocol==="https:"&&!u.username&&!u.password&&!u.port&&u.hostname.includes(".")&&!/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)&&!u.hostname.endsWith(".local")}catch{}}
 if(!safe)return false;
 const im=node("img","chat-generated-image");im.alt=String(alt||"模型返回的图片").slice(0,120);im.loading="lazy";im.referrerPolicy="no-referrer";
 im.addEventListener("error",()=>{if(src.startsWith("https:")){const a=node("a","chat-inline-link","打开原图");a.href=src;a.target="_blank";a.rel="noopener noreferrer";im.replaceWith(a)}else im.remove()},{once:true});
 im.src=src;target.append(im);return true;
}
// Some models surround ordinary Markdown with a Markdown fence. Unwrap only prose,
// never a language-tagged program or a genuine unlabelled code sample.
function normalizeAssistantMarkdown(answer){
 const lines=String(answer||"").replace(/\r\n?/g,"\n").split("\n"),out=[];
 for(let i=0;i<lines.length;i++){
  const open=lines[i].match(/^\s*(\x60{3,}|~{3,})\s*([\w+-]*)\s*$/);
  if(!open){out.push(lines[i]);continue}
  const fence=open[1],lang=open[2].toLowerCase();
  let end=i+1;
  for(;end<lines.length;end++){
   const close=lines[end].trim();
   if(close.length>=fence.length&&Array.from(close).every(ch=>ch===fence[0]))break;
  }
  const body=lines.slice(i+1,end),heading=body.filter(x=>/^\s*#{1,6}\s+\S/.test(x)).length,
   table=body.some((x,j)=>x.includes("|")&&/^\s*\|?\s*:?-{3,}:?\s*\|/.test(body[j+1]||"")),
   bullets=body.filter(x=>/^\s*(?:[-*]|\d+\.)\s+\S/.test(x)).length,
   prose=body.some(x=>/[\u3400-\u9fff]{5,}|[.!?。！？]\s*$/.test(x.trim())),
   code=body.some(x=>/^\s*(?:def |class |function |const |let |var |import |export |SELECT\s|CREATE\s|<\/?\w|#!|package\s|public\s|private\s|return\s|if\s*\(|for\s*\(|while\s*\(|[A-Za-z_$][\w$]*\s*=\s*[^=])/.test(x));
  const unwrap=["markdown","md","mdx"].includes(lang)||(!lang&&!code&&prose&&((table&&(heading>0||bullets>0))||heading>=2||(heading>0&&bullets>=2)));
  if(unwrap)out.push(...body);
  else{out.push(lines[i],...body);if(end<lines.length)out.push(lines[end])}
  i=end;
 }
 return out;
}
// Recover model-generated prompt sections without treating real program code as prompts.
function imagePromptLabel(line){
 const s=String(line||"").trim().replace(/^(?:(?:>\s*)|(?:#{1,6}\s+)|(?:[-*]\s+)|(?:\d+[.)、]\s+))+/,"").replace(/^\*\*/,"");
 const m=s.match(/^((?:(?:中文|英文|Chinese|English)\s*(?:正向\s*)?(?:作图|绘图|图像|图片)?\s*(?:提示词|prompt)|(?:正向|负面|反向|作图|绘图|图像|图片)\s*提示词|(?:negative|positive|image)\s*prompt)(?:\s*[（(][^）)]{1,30}[）)])?)\s*(?:\*\*)?(?:[:：]\s*(?:\*\*)?\s*(.*)|$)/i);
 if(!m)return null;return {label:m[1],body:(m[2]||"").trim(),negative:/负面|反向|negative/i.test(m[1])};
}
function promptSectionBoundary(line){
 const s=String(line||"").trim().replace(/^(?:>\s*|#{1,6}\s+|\*\*)+/,"");
 return !!imagePromptLabel(line)||/^(?:主题|人物(?:档案|姓名|设定|一致性)|固定(?:身份|档案)|推荐(?:画面|图片)?比例|比例|摄影(?:风格|参数)|镜头|光圈|继续完成|第\s*\d+\s*[套组]|[-]{3,})(?:\s*[:：、.]|\s|$)/.test(s)||/^\s*#{1,6}\s+\S/.test(line)||/^\s*\d{1,2}[.)、]\s+\S/.test(line);
}
function normalizePromptSections(lines){
 if(!lines.some(imagePromptLabel))return lines;
 const out=[];let outside=null;
 const mark=line=>String(line||"").trim().match(/^(\x60{3,}|~{3,})\s*([\w+-]*)\s*$/);
 for(let i=0;i<lines.length;i++){
  const f=mark(lines[i]),label=imagePromptLabel(lines[i]);
  if(label&&(!outside||/^(?:text|plaintext|txt)?$/i.test(outside.lang))){
   if(outside){
    if(out.length===outside.index+1)out.pop();else out.push(outside.mark);
    outside=null;
   }
   let body=label.body?[label.body]:[],inside=false,j=i+1;
   for(;j<lines.length;j++){
    const line=lines[j],s=line.trim(),fm=mark(line);
    if(promptSectionBoundary(line))break;
    if(fm){
     if(inside){inside=false;j++;break}
     if(body.length)break;
     // Model may have closed the label-only block before the actual text.
     // A subsequent fence with content is handled as the payload.
     if(fm[2])inside=true;
     else if(!mark(lines[j+1])&&lines[j+1]?.trim()&&!promptSectionBoundary(lines[j+1]))inside=true;
     continue;
    }
    if(!s){
     if(body.length&&!inside)break;
     if(body.length)body.push("");continue;
    }
    body.push(line);
   }
   const payload=body.join("\n").trim();
   out.push("**"+label.label+"**");
   if(payload){out.push("\x60\x60\x60"+(label.negative?"text":"image-prompt"),payload,"\x60\x60\x60")}
   i=j-1;continue;
  }
  if(f){
   if(outside&&f[1][0]===outside.mark[0]&&!f[2])outside=null;
   else if(!outside)outside={mark:f[1],lang:f[2],index:out.length};
  }
  out.push(lines[i]);
 }
 return out;
}
function imagePromptPayload(value){
 const lines=String(value||"").trim().split("\n");
 const positive=[];let started=false;
 for(const line of lines){
  const label=imagePromptLabel(line);
  if(label){if(label.negative||started)break;started=true;if(label.body)positive.push(label.body);continue}
  if(started){if(promptSectionBoundary(line))break;positive.push(line)}
 }
 return (started?positive.join("\n"):String(value||"")).trim();
}
function isDirectImageRequest(value){
 const s=String(value||"").trim();if(!s)return false;
 if(/(?:只|仅|不要|不用|无需|禁止|先别|不需要)(?:直接)?(?:生成|制作|画|绘制)(?:任何)?(?:图片|图像|照片|图)|(?:只|仅)(?:写|生成|输出|提供|给出).{0,16}提示词|(?:怎么|如何|为什么|能不能|是否|什么是).{0,24}(?:作图|画图|生成图片)/.test(s))return false;
 if(/(?:写|提供|输出|整理|设计|生成|编写|给出|制作).{0,24}(?:提示词|prompts?)/i.test(s)&&!/(?:根据|按照|使用|用)(?:以下|下面|这[个段套])?提示词.{0,20}(?:生成|绘制|画|作图)/.test(s))return false;
 if(/(?:写|生成|输出|提供).{0,20}(?:代码|网页|网站|功能|按钮|指令|视频|文章|故事)/.test(s))return false;
 return /^(?:(?:请|麻烦|帮我|给我|直接|现在|再|继续|请你|为我|你|来)\s*){0,5}(?:画(?:一张|一幅|个|出|一下)?|绘制|作图|生成(?:一张|一幅|一组|一套)?(?:图片|图像|照片|写真|海报|插画|头像|壁纸|人物图|效果图)|制作(?:一张|一幅)?(?:图片|图像|照片|海报|头像|壁纸))/.test(s)||/^(?:根据|按照|使用|用)(?:以下|下面|这[个段套])?提示词.{0,20}(?:生成|绘制|画)(?:一张|一幅)?(?:图片|图像|照片)/.test(s);
}
function renderAssistantText(bubble,answer){
 const lines=normalizePromptSections(normalizeAssistantMarkdown(answer));
 bubble.classList.remove("chat-revealing");bubble.replaceChildren();let paragraph=[],list=null,pre=null,code=null,activeFence=null;
 function inline(target,value){
  const pattern=/(!\[[^\]]*\]\((?:https:\/\/[^\s)]+|\/api\/files\/[0-9a-f-]{36})\)|\*\*[^*]+\*\*|(\x60+)[^\x60]+\2)/gi;
  let index=0,match;
  while((match=pattern.exec(value))){
   if(match.index>index)appendChatLinks(target,value.slice(index,match.index));
   const raw=match[0],bold=raw.startsWith("**");
   if(raw.startsWith("![")){const m=raw.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);if(!m||!appendReplyImage(target,m[2],m[1]))appendChatLinks(target,raw)}
   else if(bold){const strong=node("strong");appendChatLinks(strong,raw.slice(2,-2));target.append(strong)}
   else{
    const fence=raw.match(/^\x60+/)[0],value=raw.slice(fence.length,-fence.length),candidate=value.trim();
    // A URL formatted as inline code is still a link. Keep actual code literal.
    if(/^(?:https?:\/\/|www\.)[^\s<>"'\x60]+$/i.test(candidate)||/^(?:[a-z0-9-]+\.)+(?:com|net|org|io|ai|cn|app|online|dev|site|co|me|info|xyz)(?::\d{2,5})?(?:\/[^\s<>"'\x60]*)?$/i.test(candidate))appendChatLinks(target,candidate);
    else target.append(node("code","",value));
   }
   index=pattern.lastIndex;
  }
  if(index<value.length)appendChatLinks(target,value.slice(index));
 }
 function flush(){
  if(paragraph.length){const p=node("p");inline(p,paragraph.join("\n"));bubble.append(p);paragraph=[]}
 }
 function markdownCells(value){
  const line=String(value||"").trim();if(!line.includes("|"))return null;
  const part=line.replace(/\\\|/g,"\uE000"),inner=part.replace(/^\|/,"").replace(/\|$/,"");
  const cells=inner.split("|").map(x=>x.replace(/\uE000/g,"|").trim());
  return cells.length>=2?cells:null;
 }
 for(let lineIndex=0;lineIndex<lines.length;lineIndex++){
  const original=lines[lineIndex],line=original.trimEnd(),trim=line.trim();
  if(!pre){
   const heads=markdownCells(trim),divider=markdownCells(lines[lineIndex+1]||"");
   if(heads&&divider&&heads.length===divider.length&&divider.every(cell=>/^:?-{3,}:?$/.test(cell))){
    flush();list=null;
    const wrapper=node("div","chat-table-scroll"),table=node("table","chat-markdown-table"),thead=node("thead"),header=node("tr"),tbody=node("tbody");
    table.classList.toggle("chat-table-wide",heads.length>=3);
    table.setAttribute("role","table");thead.setAttribute("role","rowgroup");tbody.setAttribute("role","rowgroup");header.setAttribute("role","row");
    for(const item of heads){const th=node("th");th.setAttribute("scope","col");th.setAttribute("role","columnheader");inline(th,item);header.append(th)}
    thead.append(header);table.append(thead,tbody);
    let next=lineIndex+2;
    for(;next<lines.length;next++){
     const cells=markdownCells(lines[next]);if(!cells||cells.length!==heads.length)break;
     const tr=node("tr");tr.setAttribute("role","row");for(const [i,item] of cells.entries()){const td=node("td");td.setAttribute("role","cell");td.dataset.label=heads[i].replace(/\*\*|\x60/g,"");inline(td,item);tr.append(td)}tbody.append(tr);
    }
    wrapper.append(table);bubble.append(wrapper);lineIndex=next-1;continue;
   }
  }
  const fence=trim.match(/^(\x60{3,}|~{3,})\s*([\w+-]*)\s*$/);
  if(fence&&(!pre||(!fence[2]&&fence[1][0]===activeFence[0]&&fence[1].length>=activeFence.length))){
   flush();list=null;
   if(pre){pre=null;code=null;activeFence=null}
   else{activeFence=fence[1];pre=node("pre","chat-code");code=node("code");
    const promptBlock=/^(?:image-prompt|prompt-set)$/i.test(fence[2]||"");
    const button=node("button","chat-code-copy");button.type="button";button.title=promptBlock?"复制完整提示词":"复制内容";button.dataset.originalTitle=button.title;button.setAttribute("aria-label",button.title);
    button.append(iconSlot("copy"),node("span","","复制"));
    // Reconciliation can retain a button while replacing its code node. Always read the live DOM.
    button.addEventListener("click",event=>{const b=event.currentTarget;void copyMessageText(b.closest("pre")?.querySelector("code")?.textContent?.trimEnd(),b)});
    pre.append(button,code);
    if(promptBlock){
     pre.classList.add("chat-image-prompt");
     const generate=node("button","chat-prompt-generate");generate.type="button";generate.title="使用此提示词作图";generate.append(iconSlot("image"),node("span","","作图"));
     generate.addEventListener("click",event=>{const text=imagePromptPayload(event.currentTarget.closest("pre")?.querySelector("code")?.textContent);if(text)messageDraft(text,true,"image")});
     pre.prepend(generate);renderIcons(generate);
    }
    bubble.append(pre);renderIcons(button);
   }
   continue;
  }
  if(pre){code.append(document.createTextNode(original+"\n"));continue}
  if(!trim){flush();list=null;continue}
  if(/^(?:-{3,}|\*{3,}|_{3,})$/.test(trim)){flush();list=null;bubble.append(node("hr","chat-markdown-rule"));continue}
  const heading=trim.match(/^(#{1,6})\s+(.+)$/);
  if(heading){flush();list=null;const h=node("h"+Math.min(4,heading[1].length+2));inline(h,heading[2]);bubble.append(h);continue}
  const bullet=trim.match(/^([-*]|\d+\.)\s+(.+)$/);
  if(bullet){
   flush();const listType=/^\d/.test(bullet[1])?"ol":"ul";
   if(!list||list.tagName.toLowerCase()!==listType){list=node(listType);bubble.append(list)}
   const item=node("li");inline(item,bullet[2]);list.append(item);continue;
  }
  if(trim.startsWith("> ")){flush();list=null;const quote=node("blockquote");inline(quote,trim.slice(2));bubble.append(quote);continue}
  list=null;paragraph.push(line);
 }
 flush();
}
// One Markdown renderer for streaming, completed replies and restored history.
const assistantTextState=new WeakMap();
function streamingMarkdownPrefix(answer){
 const lines=String(answer||"").replace(/\r\n?/g,"\n").split("\n");
 let tail=lines.pop()||"";
 const cells=line=>String(line||"").trim().includes("|");
 const separator=line=>/^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line||"");
 let fence=null;
 for(let i=0;i<lines.length;i++){
  const m=lines[i].trim().match(/^(\x60{3,}|~{3,})\s*([\w+-]*)\s*$/);
  if(!m)continue;
  if(!fence)fence={index:i,mark:m[1],lang:m[2]};
  else if(!m[2]&&m[1][0]===fence.mark[0]&&m[1].length>=fence.mark.length)fence=null;
 }
 if(fence&&!fence.lang)return lines.slice(0,fence.index).join("\n");
 if(fence&&!/^(?:markdown|md|mdx)$/i.test(fence.lang)){
  return lines.concat(/^\s*(?:\x60{1,}|~{1,})\s*$/.test(tail)?[]:[tail]).join("\n");
 }
 // Wait for a table separator before displaying the header; wait for each full row.
 let inTable=false;
 for(let i=0;i<lines.length;i++){
  if(separator(lines[i])&&i>0&&cells(lines[i-1]))inTable=true;
  else if(!cells(lines[i]))inTable=false;
 }
 if(lines.length&&cells(lines[lines.length-1])&&!inTable&&!separator(lines[lines.length-1]))return lines.slice(0,-1).join("\n");
 if(cells(tail)||/^\s*(?:#{1,6}|\d+\.?|[-*~_]{1,}|\x60{1,})\s*$/.test(tail))return lines.join("\n");
 // Incomplete inline markers are held, rather than appearing raw and changing style later.
 const bold=Array.from(tail.matchAll(/\*\*/g));
 if(bold.length%2)tail=tail.slice(0,bold[bold.length-1].index);
 const code=Array.from(tail.matchAll(/\x60/g));
 if(code.length%2)tail=tail.slice(0,code[code.length-1].index);
 const link=tail.match(/!?\[[^\]]*(?:\]\([^)]*)?$/);
 if(link)tail=tail.slice(0,link.index);
 if(tail.endsWith("*")&&!tail.endsWith("**"))tail=tail.slice(0,-1);
 return lines.concat(tail).join("\n");
}
function syncAssistantChildren(target,source){
 const children=Array.from(source.childNodes);
 for(const [index,desired] of children.entries()){
  const current=target.childNodes[index];
  if(!current){target.append(desired);continue}
  if(current.isEqualNode(desired))continue;
  if(current.nodeType===3&&desired.nodeType===3){current.nodeValue=desired.nodeValue;continue}
  if(current.nodeType===1&&desired.nodeType===1&&current.tagName===desired.tagName&&
     current.attributes.length===desired.attributes.length&&Array.from(current.attributes).every(a=>desired.getAttribute(a.name)===a.value)&&
     !["IMG","BUTTON","A","SVG"].includes(current.tagName)){
   syncAssistantChildren(current,desired);continue;
  }
  target.replaceChild(desired,current);
 }
 while(target.childNodes.length>children.length)target.lastChild.remove();
}
// Double-tap copies only the touched text block. No per-cell buttons or layout changes.
const assistantCopyGestures=new WeakSet();
function assistantDoubleCopyTarget(bubble,target){
 const el=target?.nodeType===1?target:target?.parentElement;
 if(!el||!bubble.contains(el)||el.closest("button,a,input,textarea,select,img,video,canvas,summary,[contenteditable=true]"))return null;
 const block=el.closest("code,td,th,p,li,blockquote,h1,h2,h3,h4,h5,h6");
 return block&&bubble.contains(block)?block:null;
}
function assistantDoubleCopyValue(block){
 const value=String(block?.textContent||"");
 return value.trim()?value:"";
}
let assistantCopyToastTimer=null;
function assistantCopyNotice(){
 let toast=document.getElementById("assistantCopyNotice");
 if(!toast){
  toast=node("div");toast.id="assistantCopyNotice";toast.setAttribute("role","status");toast.setAttribute("aria-live","polite");
  toast.style.cssText="position:fixed;z-index:10000;top:calc(env(safe-area-inset-top,0px) + 12px);left:50%;transform:translateX(-50%);padding:7px 15px;border-radius:18px;background:#233b49;color:#fff;font-size:13px;pointer-events:none;white-space:nowrap";
  document.body.append(toast);
 }
 toast.textContent="已复制";toast.hidden=false;clearTimeout(assistantCopyToastTimer);
 assistantCopyToastTimer=setTimeout(()=>{toast.hidden=true},1500);
}
function wireAssistantDoubleCopy(bubble){
 if(assistantCopyGestures.has(bubble))return;assistantCopyGestures.add(bubble);
 let start=null,last=null,lastTouchCopy=0;
 const copy=block=>{const value=assistantDoubleCopyValue(block);if(value)void copyMessageText(value,null).then(ok=>{if(ok)assistantCopyNotice()})};
 bubble.addEventListener("touchstart",event=>{
  start=null;
  if(event.touches.length!==1){last=null;return}
  const t=event.touches[0],block=assistantDoubleCopyTarget(bubble,event.target);
  if(!block){last=null;return}
  start={id:t.identifier,x:t.clientX,y:t.clientY,block,time:Date.now()};
 },{passive:true});
 bubble.addEventListener("touchmove",event=>{
  if(!start)return;
  const t=event.touches[0];
  if(event.touches.length!==1||t.identifier!==start.id||Math.hypot(t.clientX-start.x,t.clientY-start.y)>10){start=null;last=null}
 },{passive:true});
 bubble.addEventListener("touchcancel",()=>{start=null;last=null},{passive:true});
 bubble.addEventListener("touchend",event=>{
  const tap=start;start=null;
  if(!tap||event.touches.length||event.changedTouches.length!==1){last=null;return}
  const t=event.changedTouches[0],now=Date.now();
  if(t.identifier!==tap.id||now-tap.time>260||Math.hypot(t.clientX-tap.x,t.clientY-tap.y)>10){last=null;return}
  if(last&&last.block===tap.block&&now-last.time<=350&&Math.hypot(t.clientX-last.x,t.clientY-last.y)<=24){
   last=null;lastTouchCopy=now;if(event.cancelable)event.preventDefault();copy(tap.block);
  }else last={block:tap.block,x:t.clientX,y:t.clientY,time:now};
 },{passive:false});
 bubble.addEventListener("dblclick",event=>{
  if(Date.now()-lastTouchCopy<650)return;
  const block=assistantDoubleCopyTarget(bubble,event.target);
  if(!block)return;event.preventDefault();copy(block);
 });
}
function updateAssistantText(bubble,answer,complete=false){
 wireAssistantDoubleCopy(bubble);
 const text=complete?String(answer||""):streamingMarkdownPrefix(answer);
 if(assistantTextState.get(bubble)===text)return;
 const staged=node("div");
 renderAssistantText(staged,text);
 bubble.classList.remove("chat-revealing");
 syncAssistantChildren(bubble,staged);
 assistantTextState.set(bubble,text);
}
// Position the new text turn once; do not chase its growing end while reading.
function positionNewTextReply(row,question,viewport){
 if(!row?.isConnected||!viewport||viewport.hidden||viewport.clientHeight<=0)return;
 const height=viewport.clientHeight;
 const oldMinHeight=row.style.minHeight,oldAlignContent=row.style.alignContent;
 row.dataset.readFromStart="1";
 row.style.minHeight=Math.max(0,height-24)+"px";
 row.style.alignContent="start";
 const questionRect=question.getBoundingClientRect();
 const anchor=questionRect.height<=height*.35?question:row;
 viewport.scrollTop+=anchor.getBoundingClientRect().top-viewport.getBoundingClientRect().top-12;
 return ()=>{row.style.minHeight=oldMinHeight;row.style.alignContent=oldAlignContent};
}
async function revealCompletedReply(row,reply){
 const bubble=row?.querySelector(".bubble");if(!bubble||!row.isConnected)return;
 const viewport=$("conversation"),letters=Array.from(String(reply||""));
 if(!letters.length)return;
 if(letters.length>6000||document.hidden||window.matchMedia("(prefers-reduced-motion:reduce)").matches){updateAssistantText(bubble,letters.join(""),true);return}
 const batch=Math.max(7,Math.ceil(letters.length/65));let index=0;
 await new Promise(resolve=>{
  const frame=()=>{
   if(!row.isConnected){resolve();return}
   const next=Math.min(letters.length,index+batch);
   const nearBottom=row.dataset.readFromStart!=="1"&&viewport.scrollHeight-viewport.scrollTop-viewport.clientHeight<155;
   updateAssistantText(bubble,letters.slice(0,next).join(""),next===letters.length);
   index=next;if(nearBottom)viewport.scrollTop=viewport.scrollHeight;
   if(index>=letters.length)resolve();else requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
 });
}


const VOICE_CHAT_ENABLED=true;
const MESSAGE_READ_ALOUD_ENABLED=true;
const REPLY_LEVELS={short:"简短",standard:"标准",long:"详细"};
let replyLevel="standard";
function closeReplyLevel(){
 $("replyLevelMenu").hidden=true;
 $("replyLevelTrigger").setAttribute("aria-expanded","false");
}
function chooseReplyLevel(level){
 if(!Object.hasOwn(REPLY_LEVELS,level))return;
 replyLevel=level;
 $("replyLevelLabel").textContent=REPLY_LEVELS[level];
 const button=$("replyLevelTrigger");
 button.title="回复长度："+REPLY_LEVELS[level];
 button.setAttribute("aria-label",button.title);
 for(const el of $("replyLevelMenu").querySelectorAll("[data-reply-level]")){
  const selected=el.dataset.replyLevel===level;
  el.classList.toggle("selected",selected);
  el.setAttribute("aria-pressed",String(selected));
 }
 try{localStorage.setItem("aigzt:reply-level:v1",level)}catch{}
 closeReplyLevel();
}
function wireReplyLevel(){
 let saved="standard";
 try{saved=localStorage.getItem("aigzt:reply-level:v1")||saved}catch{}
 chooseReplyLevel(saved);
 const button=$("replyLevelTrigger"),menu=$("replyLevelMenu");
 button.addEventListener("click",()=>{
  hideAttachMenu();menu.hidden=!menu.hidden;
  button.setAttribute("aria-expanded",String(!menu.hidden));
 });
 menu.addEventListener("click",event=>{
  const option=event.target.closest("[data-reply-level]");
  if(option)chooseReplyLevel(option.dataset.replyLevel);
 });
 document.addEventListener("pointerdown",event=>{
  if(!menu.hidden&&!menu.contains(event.target)&&!button.contains(event.target))closeReplyLevel();
 });
 document.addEventListener("keydown",event=>{if(event.key==="Escape")closeReplyLevel()});
}
let dictationRecognition=null;
function finishDictation(rec){
 if(dictationRecognition!==rec)return;
 dictationRecognition=null;
 const button=$("voiceInput");
 button.classList.remove("listening");
 button.setAttribute("aria-pressed","false");
 button.title="语音转文字，点击开始或结束录音";
}
function stopDictation(abort=false){
 const rec=dictationRecognition;
 if(!rec)return;
 if(abort){finishDictation(rec);try{rec.abort()}catch{};return}
 if(rec._stopping)return;
 rec._stopping=true;
 try{rec.stop()}catch{finishDictation(rec)}
}
function settingsDictationLanguage(){
 try{const value=localStorage.getItem("aigzt:dictation-language")||"auto";return ["auto","zh-CN","zh-TW","en-US","ja-JP"].includes(value)?value:"auto"}catch{return "auto"}
}
function startDictation(){
 if(dictationRecognition){stopDictation();return}
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Speech){flashError("当前浏览器不支持网页语音识别，可使用系统键盘的语音听写");return}
 const input=$("prompt"),button=$("voiceInput"),rec=new Speech();
 dictationRecognition=rec;
 const chosenLanguage=settingsDictationLanguage();
 rec.lang=chosenLanguage==="auto"?( /^zh/i.test(navigator.language)?navigator.language:"zh-CN" ):chosenLanguage;
 rec.interimResults=false;
 rec.continuous=false;
 rec.onresult=event=>{
  if(dictationRecognition!==rec)return;
  const transcript=Array.from(event.results).filter(r=>r.isFinal).map(r=>r[0]?.transcript||"").join("").trim();
  if(!transcript)return;
  const before=input.value,separator=before&&!before.endsWith(" ")?" ":"";
  input.value=before+separator+transcript;
  settlePromptSize();input.focus();
 };
 rec.onerror=event=>{
  if(dictationRecognition!==rec)return;
  finishDictation(rec);
  if(!["aborted","no-speech"].includes(event.error))
   flashError(event.error==="not-allowed"?"请允许麦克风权限后重试":"语音识别中断，请重试");
 };
 rec.onend=()=>finishDictation(rec);
 try{
  rec.start();button.classList.add("listening");
  button.setAttribute("aria-pressed","true");
  button.title="正在听写，点击结束";
 }catch{finishDictation(rec);flashError("无法开始语音识别，请检查麦克风权限")}
}
function wireDictation(){
 $("voiceInput").addEventListener("click",startDictation);
 document.addEventListener("visibilitychange",()=>{if(document.hidden)stopDictation(true)});
}
const voiceSession={active:false,pending:false,listening:false,reading:false,resumePending:false,recognition:null,token:0,turn:0,button:null,voice:"",lang:"zh-CN",rate:1,lastReply:"",utterance:null,primer:null,primed:false,watchdog:null,recorder:null,stream:null,recordTimer:null,request:null};
function sayStatus(t){$("voiceStatus").textContent=t}
function voiceSave(){try{localStorage.setItem("aigzt:voice:v1",JSON.stringify({voice:voiceSession.voice,lang:voiceSession.lang,rate:voiceSession.rate}))}catch{}}
function voiceLoad(){try{const x=JSON.parse(localStorage.getItem("aigzt:voice:v1")||"null");if(x){if(typeof x.voice==="string")voiceSession.voice=x.voice;if(["zh-CN","zh-TW","en-US","ja-JP"].includes(x.lang))voiceSession.lang=x.lang;if([0.85,1,1.15,1.3].includes(Number(x.rate)))voiceSession.rate=Number(x.rate)}}catch{}}
function voiceChoices(){
 if(!window.speechSynthesis)return;
 const sel=$("voiceSelect"),voices=window.speechSynthesis.getVoices();
 sel.replaceChildren(new Option("系统默认声音",""));
 for(const v of voices)sel.add(new Option(v.name+" ("+v.lang+")",v.voiceURI));
 sel.value=voices.some(v=>v.voiceURI===voiceSession.voice)?voiceSession.voice:"";
}
function voicePlaybackButton(b,playing){
 if(!b)return;
 if(b.classList.contains("message-copy-btn")){b.classList.toggle("is-active",playing);b.title=playing?"停止播放":"播放回复";b.setAttribute("aria-label",b.title)}
 else b.textContent=playing?"停止播放":"播放回答";
 b.setAttribute("aria-pressed",String(playing));
}
function voiceReady(label="继续说话"){
 $("voiceStart").disabled=false;$("voiceStart").textContent=label;
}
function voiceCancel(){
 voiceSession.token++;voiceSession.reading=false;
 clearTimeout(voiceSession.watchdog);voiceSession.watchdog=null;
 voicePlaybackButton(voiceSession.button,false);voiceSession.button=null;voiceSession.utterance=null;
 try{const synth=window.speechSynthesis;if(synth?.speaking||synth?.pending||synth?.paused)synth.cancel()}catch{}
}
function voicePrime(){
 const synth=window.speechSynthesis;
 if(!synth||typeof window.SpeechSynthesisUtterance!=="function"||voiceSession.primed||voiceSession.reading)return;
 try{
  const u=new window.SpeechSynthesisUtterance("。");u.volume=0;u.lang=voiceSession.lang;
  voiceSession.primer=u;
  u.onstart=()=>{voiceSession.primed=true};
  u.onend=()=>{voiceSession.primed=true;voiceSession.primer=null};
  u.onerror=()=>{voiceSession.primer=null};
  synth.speak(u);
 }catch{}
}
function speechContent(v){return String(v||"").replace(/\x60{3}[\s\S]*?\x60{3}/g,"代码已省略").replace(/!\[[^\]]*\]\([^)]+\)/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/https?:\/\/\S+/g,"链接").replace(/[*_#|~]+/g," ").trim()}
function voiceChunks(text){
 const out=[];let part="";
 for(const ch of text){part+=ch;if(part.length>=130||(/[。！？!?；;\n]/.test(ch)&&part.length>=35)){if(part.trim())out.push(part.trim());part=""}}
 if(part.trim())out.push(part.trim());return out;
}
function voiceLanguage(text){
 if(/[\u3040-\u30ff]/.test(text))return "ja-JP";
 if(/[\u3400-\u9fff]/.test(text))return voiceSession.lang==="zh-TW"?"zh-TW":"zh-CN";
 if(/[A-Za-z]/.test(text))return "en-US";
 return voiceSession.lang;
}
function voiceSpeak(value,button=null,continueAfter=false){
 stopMessageReader();
 const synth=window.speechSynthesis,t=speechContent(value);
 if(!synth||typeof window.SpeechSynthesisUtterance!=="function"||!t)return false;
 voiceCancel();const token=voiceSession.token,lang=voiceLanguage(t),voices=synth.getVoices();
 const selected=voices.find(v=>v.voiceURI===voiceSession.voice);
 const voice=selected||voices.find(v=>v.lang.toLowerCase()===lang.toLowerCase())||voices.find(v=>v.lang.split("-")[0]===lang.split("-")[0]);
 const chunks=voiceChunks(t);let index=0;
 voiceSession.reading=true;voiceSession.button=button;voicePlaybackButton(button,true);
 sayStatus("正在准备播报…");
 const fail=()=>{
  if(token!==voiceSession.token)return;
  voiceCancel();if(voiceSession.active)voiceReady();
  if(button?.classList.contains("message-copy-btn"))flashError("设备未能开始或完成播报，请检查媒体音量后再次点击");
  else sayStatus("设备未能完成播报，点击播放回答重试");
 };
 const next=()=>{
  if(token!==voiceSession.token)return;
  clearTimeout(voiceSession.watchdog);voiceSession.watchdog=null;
  if(index>=chunks.length){
   voiceSession.reading=false;voiceSession.utterance=null;voicePlaybackButton(button,false);voiceSession.button=null;
   if(continueAfter&&voiceSession.active){voiceReady();sayStatus("播报结束，点击继续说话")}
   else sayStatus("播报结束");
   return;
  }
  const u=new window.SpeechSynthesisUtterance(chunks[index++]);
  u.lang=voice?.lang||lang;u.rate=voiceSession.rate;if(voice)u.voice=voice;
  voiceSession.utterance=u;
  u.onstart=()=>{
   if(token!==voiceSession.token)return;
   voiceSession.primed=true;sayStatus("正在播报…");clearTimeout(voiceSession.watchdog);
   voiceSession.watchdog=setTimeout(fail,Math.max(25000,u.text.length*650));
  };
  u.onend=next;u.onerror=fail;
  voiceSession.watchdog=setTimeout(fail,6000);
  try{if(synth.paused)synth.resume();synth.speak(u)}catch{fail()}
 };
 next();return token===voiceSession.token;
}

/* Independent, single-owner message reader. Never start paid/cloud speech silently. */
let messageReader=null;
function stopMessageReader(remove=true){
 const p=messageReader;if(!p)return;messageReader=null;p.cancelled=true;
 clearTimeout(p.timer);p.abort?.abort();
 if(p.local&&p.utterance){p.utterance.onstart=p.utterance.onend=p.utterance.onerror=null;try{window.speechSynthesis.cancel()}catch{}}
 if(p.audio){p.audio.onended=p.audio.onerror=p.audio.onplaying=p.audio.onpause=null;p.audio.pause();p.audio.removeAttribute("src");p.audio.load()}
 if(p.url)URL.revokeObjectURL(p.url);
 voicePlaybackButton(p.button,false);if(remove)p.panel.remove();
}
function readerStatus(p,value){if(messageReader===p)p.status.textContent=value}
function readerFail(p,why){
 if(messageReader!==p)return;
 clearTimeout(p.timer);p.timer=null;p.abort?.abort();p.abort=null;
 if(p.utterance){p.utterance.onstart=p.utterance.onend=p.utterance.onerror=null;try{window.speechSynthesis.cancel()}catch{}p.utterance=null}
 p.phase="failed";p.pause.hidden=true;voicePlaybackButton(p.button,false);
 readerStatus(p,why);p.retry.hidden=false;p.cloud.hidden=false;
}
function readerDone(p){
 if(messageReader!==p)return;
 clearTimeout(p.timer);p.phase="done";p.pause.hidden=true;
 voicePlaybackButton(p.button,false);readerStatus(p,"朗读完成");p.retry.hidden=false;
}
function readerLocal(p){
 if(messageReader!==p)return;
 p.local=true;p.phase="loading";p.retry.hidden=true;p.cloud.hidden=true;
 p.pause.hidden=true;voicePlaybackButton(p.button,true);
 const synth=window.speechSynthesis;
 if(!synth||typeof window.SpeechSynthesisUtterance!=="function"){readerFail(p,"本机没有可用朗读引擎");return}
 const chunks=voiceChunks(p.text);let i=0;
 function next(){
  if(messageReader!==p)return;
  clearTimeout(p.timer);
  if(i>=chunks.length){p.utterance=null;readerDone(p);return}
  const part=chunks[i++],lang=voiceLanguage(part),u=new window.SpeechSynthesisUtterance(part);
  const voices=synth.getVoices(),matching=voices.filter(v=>v.lang.toLowerCase().split("-")[0]===lang.toLowerCase().split("-")[0]);
  const selected=matching.find(v=>v.voiceURI===voiceSession.voice)||matching.find(v=>v.localService&&v.lang.toLowerCase()===lang.toLowerCase())||matching.find(v=>v.localService)||matching[0];
  u.lang=selected?.lang||lang;u.rate=voiceSession.rate;u.volume=1;if(selected)u.voice=selected;
  p.utterance=u;p.phase="loading";p.pause.hidden=true;
  readerStatus(p,"准备朗读 "+i+"/"+chunks.length+"…");
  p.timer=setTimeout(()=>readerFail(p,"系统语音未启动，可重试或使用云朗读"),10000);
  u.onstart=()=>{if(messageReader!==p||p.utterance!==u)return;clearTimeout(p.timer);p.phase="playing";p.pause.hidden=false;p.pause.textContent="暂停";readerStatus(p,"朗读中 "+i+"/"+chunks.length);p.timer=setTimeout(()=>readerFail(p,"系统语音播放超时"),Math.max(30000,part.length*900))};
  u.onend=()=>{if(messageReader===p&&p.utterance===u)next()};
  u.onerror=e=>{if(messageReader===p&&p.utterance===u)readerFail(p,"系统朗读失败："+String(e.error||"未知错误"))};
  try{if(synth.paused)synth.resume();synth.speak(u)}catch(e){readerFail(p,"系统朗读启动失败")}
 }
 next();
}
async function readerCloud(p){
 if(messageReader!==p)return;
 if(!connected("gemini")){readerStatus(p,"云朗读需要在设置连接个人 Gemini API");return}
 if(!confirm("使用个人 Gemini 生成音频？朗读文字会发送给 Google；免费额度之外可能产生费用。"))return;
 if(p.utterance){p.utterance.onstart=p.utterance.onend=p.utterance.onerror=null;try{window.speechSynthesis.cancel()}catch{}p.utterance=null}
 clearTimeout(p.timer);p.local=false;p.retry.hidden=true;p.cloud.hidden=true;p.pause.hidden=true;
 voicePlaybackButton(p.button,true);
 const chunks=[];let part="";
 for(const ch of p.text){part+=ch;if(part.length>=420||(/[。！？!?；;\n]/.test(ch)&&part.length>=220)){if(part.trim())chunks.push(part.trim());part=""}}
 if(part.trim())chunks.push(part.trim());
 let i=0;
 async function next(){
  if(messageReader!==p)return;
  if(p.url){URL.revokeObjectURL(p.url);p.url=null}
  if(i>=chunks.length){readerDone(p);return}
  p.phase="loading";readerStatus(p,"生成语音 "+(i+1)+"/"+chunks.length+"…");p.pause.hidden=true;
  const ctrl=new AbortController();p.abort=ctrl;
  p.timer=setTimeout(()=>{ctrl.abort();readerFail(p,"云朗读生成超时，请重试")},45000);
  try{
   const res=await fetch("/api/message/read-aloud",{method:"POST",credentials:"same-origin",cache:"no-store",headers:{"content-type":"application/json"},body:JSON.stringify({text:chunks[i],confirmed:true,apiKey:S.keys.gemini||undefined}),signal:ctrl.signal});
   if(messageReader!==p||p.phase!=="loading")return;
   if(!res.ok){const err=await res.json().catch(()=>null);throw Error(err?.error||"语音服务 HTTP "+res.status)}
   const blob=await res.blob();if(messageReader!==p||p.phase!=="loading")return;
   if(!blob.size||!blob.type.startsWith("audio/"))throw Error("语音服务没有返回音频");
   clearTimeout(p.timer);p.abort=null;p.url=URL.createObjectURL(blob);
   const audio=p.audio||(p.audio=document.createElement("audio"));audio.preload="auto";audio.src=p.url;audio.playbackRate=voiceSession.rate;
   audio.onplaying=()=>{if(messageReader!==p)return;p.phase="playing";p.pause.hidden=false;p.pause.textContent="暂停";readerStatus(p,"云朗读 "+(i+1)+"/"+chunks.length)};
   audio.onended=()=>{if(messageReader===p){i++;void next()}};
   audio.onerror=()=>readerFail(p,"音频无法播放，请重试");
   p.phase="ready";p.pause.hidden=false;p.pause.textContent="播放";readerStatus(p,"音频已生成，点击播放");
   try{await audio.play()}catch{if(messageReader===p&&p.phase==="ready")readerStatus(p,"音频已生成，点击播放")}
  }catch(e){if(messageReader===p&&p.phase==="loading")readerFail(p,e.message||"云朗读失败")}
 }
 void next();
}
function startMessageReader(row,text,button){
 if(messageReader?.button===button&&["loading","ready","playing","paused"].includes(messageReader.phase)){stopMessageReader();return}
 stopMessageReader();if(voiceSession.reading||voiceSession.active)voiceStop();
 const panel=node("div","message-reader"),status=node("span","message-reader-status","准备朗读…");
 status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 const control=(name,fn)=>{const b=node("button","message-reader-control",name);b.type="button";b.addEventListener("click",e=>{e.stopPropagation();fn()});return b};
 const p={row,button,panel,status,text:speechContent(text),local:false,phase:"loading",timer:null,utterance:null,audio:null,url:null,abort:null};
 p.pause=control("暂停",()=>{
  if(messageReader!==p)return;
  if(p.phase==="playing"){
   if(p.local){window.speechSynthesis.pause();clearTimeout(p.timer)}else p.audio?.pause();
   p.phase="paused";p.pause.textContent="继续";readerStatus(p,"已暂停");
  }else if(p.phase==="paused"||p.phase==="ready"){
   if(p.local){window.speechSynthesis.resume();p.phase="playing";p.pause.textContent="暂停";readerStatus(p,"朗读中");p.timer=setTimeout(()=>readerFail(p,"系统语音播放超时"),Math.max(30000,(p.utterance?.text.length||130)*900))}
   else void p.audio?.play().catch(()=>readerStatus(p,"播放未启动，请再次点击播放"));
  }
 });
 p.retry=control("重试",()=>startMessageReader(row,text,button));p.cloud=control("云朗读",()=>void readerCloud(p));p.stop=control("关闭",()=>stopMessageReader());
 p.pause.hidden=true;p.retry.hidden=true;p.cloud.hidden=true;
 panel.append(status,p.pause,p.retry,p.cloud,p.stop);button.closest(".message-copy-bar").append(panel);messageReader=p;
 if(!p.text){readerFail(p,"这条消息没有可朗读文字");return}
 readerLocal(p);
}

function voiceReleaseMic(){
 clearTimeout(voiceSession.recordTimer);voiceSession.recordTimer=null;
 const stream=voiceSession.stream;voiceSession.stream=null;
 if(stream)for(const track of stream.getTracks())track.stop();
}
function voiceStop(){
 voiceSession.active=false;voiceSession.pending=false;voiceSession.listening=false;voiceSession.resumePending=false;voiceSession.turn++;
 voiceSession.request?.abort();voiceSession.request=null;
 const recorder=voiceSession.recorder;voiceSession.recorder=null;
 if(recorder?.state==="recording")try{recorder.stop()}catch{}
 voiceReleaseMic();
 const rec=voiceSession.recognition;voiceSession.recognition=null;
 if(rec)try{rec.abort()}catch{}
 voiceCancel();voiceReady("开始说话");sayStatus("已停止对话");
}
function voiceSendTranscript(text,turn){
 if(turn!==voiceSession.turn||!voiceSession.active)return;
 const transcript=String(text||"").trim();
 if(!transcript){voiceReady("重新说话");sayStatus("没有识别到语句，请重新说话");return}
 $("voiceHeard").textContent=transcript;
 if(S.busy||$("prompt").value.trim()||S.attachments.length){voiceReady();sayStatus("聊天已有请求或草稿，已保留原输入");return}
 $("prompt").value=transcript;settlePromptSize();voiceSession.pending=true;$("voiceStart").disabled=true;$("voiceStart").textContent="等待回答…";
 sayStatus("正在等待 AI 回复…");void sendMessage();
}
function voiceRecordSupported(){return typeof window.MediaRecorder==="function"&&!!navigator.mediaDevices?.getUserMedia}
function voiceRecognitionSupported(){return voiceRecordSupported()||!!(window.SpeechRecognition||window.webkitSpeechRecognition)}
async function voiceRecord(turn){
 $("voiceStart").disabled=true;$("voiceStart").textContent="开启麦克风…";sayStatus("正在开启麦克风");
 try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
  if(turn!==voiceSession.turn||!voiceSession.active){for(const track of stream.getTracks())track.stop();return}
  voiceSession.stream=stream;
  const mime=["audio/mp4","audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus"].find(x=>window.MediaRecorder.isTypeSupported?.(x));
  const recorder=new window.MediaRecorder(stream,mime?{mimeType:mime,audioBitsPerSecond:64000}:{audioBitsPerSecond:64000});
  const chunks=[];let failed=false;
  voiceSession.recorder=recorder;voiceSession.listening=true;
  recorder.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};
  recorder.onerror=()=>{failed=true;if(turn!==voiceSession.turn)return;voiceSession.recorder=null;voiceSession.listening=false;voiceReleaseMic();voiceReady("重新说话");sayStatus("录音中断，请重新说话")};
  recorder.onstop=async()=>{
   if(turn!==voiceSession.turn||voiceSession.recorder!==recorder)return;
   voiceSession.recorder=null;voiceSession.listening=false;voiceReleaseMic();
   if(failed)return;
   const audio=new Blob(chunks,{type:recorder.mimeType||chunks[0]?.type||"audio/mp4"});
   if(!audio.size){voiceReady("重新说话");sayStatus("未录到声音，请重试");return}
   if(audio.size>1500000){voiceReady("重新说话");sayStatus("录音文件过大，请缩短语句");return}
   const request=new AbortController();voiceSession.request=request;
   $("voiceStart").disabled=true;$("voiceStart").textContent="识别中…";sayStatus("正在识别语音…");
   const timeout=setTimeout(()=>request.abort(),18000);
   try{
    const response=await fetch("/api/voice/transcribe",{method:"POST",headers:{"content-type":audio.type||"audio/mp4","x-voice-lang":voiceSession.lang},body:audio,credentials:"same-origin",cache:"no-store",signal:request.signal});
    const data=await response.json().catch(()=>null);
    if(!response.ok||!data?.ok)throw Error(data?.error||"语音识别服务暂时不可用");
    voiceSendTranscript(data.text,turn);
   }catch(e){if(turn===voiceSession.turn&&voiceSession.active){voiceReady("重新说话");sayStatus(e?.name==="AbortError"?"语音识别超时，请重试":String(e?.message||"识别失败，请重试"))}}
   finally{clearTimeout(timeout);if(voiceSession.request===request)voiceSession.request=null}
  };
  recorder.start();
  $("voiceStart").disabled=false;$("voiceStart").textContent="结束并发送";$("voiceHeard").textContent="正在录音…";sayStatus("正在收听，点击结束并发送");
  voiceSession.recordTimer=setTimeout(()=>{if(turn===voiceSession.turn&&recorder.state==="recording")recorder.stop()},30000);
 }catch(e){
  if(turn!==voiceSession.turn)return;
  voiceSession.recorder=null;voiceSession.listening=false;voiceReleaseMic();voiceReady("重新说话");
  sayStatus(e?.name==="NotAllowedError"?"请在浏览器设置中允许麦克风":"无法开启录音，请检查麦克风权限");
 }
}
function voiceNativeListen(turn){
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Speech){voiceReady();sayStatus("当前浏览器不支持录音或语音识别");return}
 const rec=new Speech();voiceSession.recognition=rec;voiceSession.listening=true;rec.lang=voiceSession.lang;rec.interimResults=true;rec.continuous=false;
 let text="",failed=false;
 rec.onresult=e=>{if(turn!==voiceSession.turn)return;let partial="";text="";for(const item of Array.from(e.results)){const v=item[0]?.transcript||"";if(item.isFinal)text+=v;else partial+=v}$("voiceHeard").textContent=text+partial};
 rec.onerror=e=>{if(turn!==voiceSession.turn)return;failed=true;sayStatus(e.error==="not-allowed"?"麦克风权限未开放":"识别中断，请重新说话")};
 rec.onend=()=>{if(turn!==voiceSession.turn||voiceSession.recognition!==rec)return;voiceSession.recognition=null;voiceSession.listening=false;clearTimeout(voiceSession.recordTimer);voiceSession.recordTimer=null;voiceReady();if(!failed)voiceSendTranscript(text,turn)};
 try{rec.start();$("voiceStart").disabled=false;$("voiceStart").textContent="结束并发送";sayStatus("正在收听…");voiceSession.recordTimer=setTimeout(()=>{if(voiceSession.recognition!==rec)return;voiceSession.recognition=null;voiceSession.listening=false;try{rec.abort()}catch{};voiceReady("重新说话");sayStatus("识别未响应，请重新说话")},30000)}
 catch{voiceSession.recognition=null;voiceSession.listening=false;voiceReady("重新说话");sayStatus("无法开启语音识别")}
}
function voiceListen(auto=false){
 if(voiceSession.listening){
  const recorder=voiceSession.recorder,rec=voiceSession.recognition;
  $("voiceStart").disabled=true;$("voiceStart").textContent="识别中…";
  try{if(recorder?.state==="recording")recorder.stop();else if(rec)rec.stop()}catch{voiceStop()}
  return;
 }
 if(!S.user){sayStatus("请先登录");return}
 if(S.workMode||S.freeToolsMode){sayStatus("请返回聊天模式");return}
 if(S.busy||voiceSession.pending||voiceSession.request){sayStatus("等待上一轮回复完成");return}
 if($("prompt").value.trim()||S.attachments.length){sayStatus("输入框已有草稿，请先处理");return}
 if(S.provider!=="free"&&!connected(S.provider)){sayStatus("模型未连接，请先选择可用模型");return}
 if(S.provider!=="free"&&!isFreeModel(S.provider,S.model)&&!S.allowPaid){sayStatus("当前模型未授权使用额度");return}
 stopDictation(true);voiceCancel();voiceSession.active=true;voiceSession.resumePending=false;
 const turn=++voiceSession.turn;
 if(voiceRecordSupported())void voiceRecord(turn);else voiceNativeListen(turn);
}
function voiceOpen(){
 voiceLoad();$("voiceLang").value=voiceSession.lang;$("voiceRate").value=String(voiceSession.rate);
 if(S.workMode)setWorkMode(false);if(S.freeToolsMode)setFreeToolsMode(false);
 stopDictation(true);if(S.composerMode!=="text")setComposerMode("text");voiceChoices();show("voiceDialog");voicePrime();
 $("voiceStart").disabled=!voiceRecognitionSupported();$("voiceStart").textContent="开始说话";
 $("voiceReplay").disabled=!voiceSession.lastReply;
 sayStatus(voiceRecognitionSupported()?"点击开始说话":"当前浏览器不支持录音，可使用系统键盘听写");
}
function voiceWire(){
 voiceLoad();
 $("voiceChatOpen").addEventListener("click",voiceOpen);
 $("voiceReplay").addEventListener("click",()=>{if(voiceSession.reading){voiceCancel();voiceReady();return}if(voiceSession.lastReply&&!voiceSpeak(voiceSession.lastReply,$("voiceReplay"),true))sayStatus("当前设备不支持播报")});
 $("voiceStart").addEventListener("click",()=>voiceListen());
 $("voiceStop").addEventListener("click",voiceStop);
 $("voiceDialog").addEventListener("close",voiceStop);
 $("voiceSelect").addEventListener("change",e=>{voiceSession.voice=e.target.value;voiceSave()});
 $("voiceLang").addEventListener("change",e=>{voiceSession.lang=e.target.value;voiceSave();voiceChoices()});
 $("voiceRate").addEventListener("change",e=>{voiceSession.rate=Number(e.target.value);voiceSave()});
 window.speechSynthesis?.addEventListener?.("voiceschanged",voiceChoices);
 document.addEventListener("visibilitychange",()=>{if(document.hidden){stopMessageReader();if(voiceSession.active||voiceSession.reading)voiceStop()}});
}

async function copyMessageText(value,button){
 const content=String(value||"");if(!content)return false;
 let copied=false;
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(content);copied=true}}catch{}
 if(!copied){
  const temp=document.createElement("textarea");
  temp.value=content;temp.setAttribute("readonly","");temp.style.cssText="position:fixed;left:-9999px;top:0;opacity:0";
  document.body.append(temp);
  try{temp.focus({preventScroll:true});temp.select();temp.setSelectionRange(0,temp.value.length);copied=document.execCommand("copy")}catch{}
  finally{temp.remove()}
 }
 if(!copied){flashError("复制失败，请长按消息选择文字");return false}
 if(!button)return true;
 button.classList.add("is-copied");
 button.title="已复制";button.setAttribute("aria-label","已复制");
 if(button._copyLabelTimer)clearTimeout(button._copyLabelTimer);
 button._copyLabelTimer=setTimeout(()=>{
  if(button.isConnected){button.classList.remove("is-copied");button.title=button.dataset.originalTitle||"复制";button.setAttribute("aria-label",button.dataset.originalTitle||"复制")}
  button._copyLabelTimer=null;
 },1300);
 return true;
}
function messageTool(icon,label,action){
 const b=node("button","message-copy-btn");b.type="button";
 b.title=label;b.dataset.originalTitle=label;b.setAttribute("aria-label",label);
 b.append(iconSlot(icon));b.addEventListener("click",event=>{
  event.stopPropagation();
  try{
   const result=action(b);
   if(result&&typeof result.catch==="function")void result.catch(e=>flashError(humanError(e)));
  }catch(e){flashError(humanError(e))}
 });
 renderIcons(b);return b;
}
/* One-tap, per-message translation. The original message is immutable;
 * translations stay in memory only, and never create another chat message. */
const messageTranslations=new WeakMap();
function messageTranslationSource(row,content){
 if(!row||row.dataset.messageKind==="image"||row.dataset.messageKind==="video")return "";
 if(row.querySelector("img.chat-generated-image,video.chat-generated-video"))return "";
 let source=String(content||"").trim();
 if(!source||/^\[\[aigzt:(?:image|video)/i.test(source))return "";
 source=source.replace(/(?:^|\n)\[文件：[^\]]+\]\(\/api\/files\/[0-9a-f-]{36}\)/gi,"").trim();
 if(!source)return "";
 return source;
}

/* User text has no whole-message length limit. Split only for provider context;
 * preserve original whitespace and source order without censoring any words. */
function splitMessageForTranslation(value){
 const source=String(value||""),result=[];
 let from=0;
 while(from<source.length){
  let to=Math.min(source.length,from+2000);
  if(to<source.length){
   const part=source.slice(from,to);
   const breakAt=Math.max(part.lastIndexOf("\n\n"),part.lastIndexOf("\n"),part.lastIndexOf("。"),part.lastIndexOf("！"),part.lastIndexOf("？"),part.lastIndexOf(". "),part.lastIndexOf("? "),part.lastIndexOf("! "));
   if(breakAt>1200)to=from+breakAt+1;
   if(to<source.length&&to>from&&source.charCodeAt(to-1)>=0xD800&&source.charCodeAt(to-1)<=0xDBFF)to--;
  }
  if(to<=from)to=from+1;
  result.push(source.slice(from,to));from=to;
 }
 return result;
}
async function continueMessageTranslation(row,state,button){
 if(state.pending)return;
 state.pending=true;state.failed=false;
 try{
  for(let i=state.nextIndex;i<state.chunks.length;i++){
   if(messageTranslations.get(row)!==state||!row.isConnected)return;
   const part=state.chunks[i],leading=(part.match(/^\s*/)||[""])[0],trailing=(part.match(/\s*$/)||[""])[0];
   const source=part.slice(leading.length,part.length-trailing.length);
   state.panel.textContent=state.chunks.length>1?"正在翻译 "+(i+1)+"/"+state.chunks.length+"…":"正在翻译…";
   if(!source){state.parts[i]=part;state.nextIndex=i+1;continue}
   const result=await api("/api/message/translate",{text:source,target:state.target});
   if(messageTranslations.get(row)!==state||!row.isConnected)return;
   const translated=typeof result?.translation==="string"?result.translation:"";
   if(!translated.trim())throw Error("翻译来源未返回完整译文");
   state.parts[i]=leading+translated+trailing;
   state.nextIndex=i+1;
  }
  if(messageTranslations.get(row)!==state||!row.isConnected)return;
  state.panel.textContent=state.parts.join("");
  state.failed=false;button.title="收起翻译";button.setAttribute("aria-label","收起翻译");
 }catch(error){
  if(messageTranslations.get(row)!==state||!row.isConnected)return;
  state.failed=true;
  state.panel.textContent="翻译中断（已完成 "+state.nextIndex+"/"+state.chunks.length+" 段），再次点击可接着翻译。";
  button.title="继续翻译";button.setAttribute("aria-label","继续翻译");
 }finally{state.pending=false}
}
async function toggleMessageTranslation(row,source,button){
 let state=messageTranslations.get(row);
 const currentSource=messageTranslationSource(row,source);
 if(!currentSource||!row.isConnected)return;
 if(state&&state.source!==currentSource){state.panel.remove();messageTranslations.delete(row);state=null}
 if(state?.failed){
  state.panel.hidden=false;
  button.classList.add("is-active");button.setAttribute("aria-pressed","true");
  await continueMessageTranslation(row,state,button);
  return;
 }
 if(state){
  const open=state.panel.hidden;
  state.panel.hidden=!open;
  button.classList.toggle("is-active",open);
  button.setAttribute("aria-pressed",String(open));
  button.title=open?"收起翻译":"翻译";button.setAttribute("aria-label",button.title);
  return;
 }
 const panel=node("div","message-translation");
 panel.setAttribute("role","status");panel.setAttribute("aria-live","polite");
 panel.textContent="正在翻译…";row.append(panel);
 state={source:currentSource,panel,pending:false,failed:false,chunks:splitMessageForTranslation(currentSource),parts:[],nextIndex:0,target:"zh-CN"};
 messageTranslations.set(row,state);
 button.classList.add("is-active");button.setAttribute("aria-pressed","true");
 button.title="收起翻译";button.setAttribute("aria-label","收起翻译");
 await continueMessageTranslation(row,state,button);
}

function messageQuestion(row){
 let previous=row?.previousElementSibling||(!row?.isConnected?$("messageList").lastElementChild:null);
 while(previous&&!previous.classList.contains("user"))previous=previous.previousElementSibling;
 return String(previous?.dataset.sourceText||"");
}
function messageDraft(content,send=false,mode="text",continueFrom=null){
 if(S.busy||S.workMode||S.freeToolsMode)return false;
 const text=String(content||"").trim(),input=$("prompt");if(!text)return false;
 if(input.value.trim()&&input.value.trim()!==text&&!confirm("替换当前未发送的草稿？"))return false;
 if(send&&/\[文件：/.test(text)){flashError("原消息包含附件，请重新选择文件后发送");return false}
 input.value=text;setComposerMode(mode);settlePromptSize();
 if(send)void sendMessage(continueFrom);else input.focus();
 return true;
}
function retryMessage(row){
 const text=messageQuestion(row);
 if(!text){flashError("找不到当前回复对应的问题");return}
 const image=row.dataset.messageKind==="image"||!!row.querySelector("img.chat-generated-image");
 messageDraft(text,true,image?"image":"text");
}
/* File content is created on this device; image bytes are not stored online. */
function messageIsIOS(){
 return /iPhone|iPad|iPod/i.test(navigator.userAgent||"")||
  (navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
}
function messageTextFile(content,format="auto"){
 const text=String(content||"");
 const md=format==="md"||(format==="auto"&&/(^|\n)\s*(?:#{1,6}\s|[-*]\s|\d+\.\s|>\s|\|.+\|)|\*\*[^*]+\*\*|\x60{3}/m.test(text));
 const extension=md?"md":"txt";
 return new File([text],"IMAI-message."+extension,{type:(md?"text/markdown":"text/plain")+";charset=utf-8"});
}
function messageImageFile(image){
 const local=localImageFiles.get(image);
 if(local instanceof Blob&&local.size){const mime=local.type||"image/png",ext=mime==="image/jpeg"?"jpg":mime.slice(6);return new File([local],"IMAI-image."+ext,{type:mime})}
 const url=image?.currentSrc||image?.src||"";
 const match=url.match(/^data:(image\/(?:png|jpeg|webp|gif|avif));base64,([A-Za-z0-9+/=\s]+)$/i);
 if(!match)return null;
 const base64=match[2].replace(/\s/g,"");
 if(base64.length>16000000)throw Error("图片超出本机处理上限，请长按图片保存");
 const binary=atob(base64),bytes=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
 const mime=match[1].toLowerCase(),extension=mime==="image/jpeg"?"jpg":mime.slice(6);
 return new File([bytes],"IMAI-image."+extension,{type:mime});
}
function messageNativeFileShare(file,title){
 if(!navigator.share||!navigator.canShare)return null;
 try{if(navigator.canShare({files:[file]}))return navigator.share({files:[file],title})}catch{}
 return null;
}
function messageSaveFile(file,remoteUrl=""){
 const a=node("a");a.style.display="none";
 const objectURL=file?URL.createObjectURL(file):null;
 a.href=objectURL||remoteUrl;a.download=file?.name||"IMAI-image";
 document.body.append(a);a.click();a.remove();
 if(objectURL)window.setTimeout(()=>URL.revokeObjectURL(objectURL),30000);
}
function messageDownload(row,content,format="auto"){
 const image=row.querySelector("img.chat-generated-image");
 let file;
 try{file=image?messageImageFile(image):messageTextFile(content,format)}
 catch(e){flashError(humanError(e));return}
 // On iOS/PWA, use the native share sheet's "Save to Files" target.
 // Call navigator.share synchronously, before the user-activation window closes.
 if(messageIsIOS()&&file){
  const request=messageNativeFileShare(file,image?"保存 IMAI 图片":"保存 IMAI 消息");
  if(request){
   void request.catch(error=>{
    if(error?.name==="AbortError")return;
    try{messageSaveFile(file);flashError("系统文件菜单不可用，已尝试浏览器下载")}
    catch(e){flashError(humanError(e))}
   });
   return;
  }
 }
 try{
  if(file)messageSaveFile(file);
  else if(image){
   const url=image.currentSrc||image.src;
   if(!url)throw Error("图片内容尚未加载");
   messageSaveFile(null,url);
   if(messageIsIOS())flashError("若没有出现下载，请长按图片保存");
  }else flashError("消息内容为空");
 }catch(e){flashError(humanError(e))}
}
async function messageShare(row,content,button){
 const image=row.querySelector("img.chat-generated-image");
 if(image){
  let file;
  try{file=messageImageFile(image)}catch(e){flashError(humanError(e));return}
  // A fetch-before-share loses the mobile browser's user gesture. Decode the
  // already loaded in-chat image synchronously instead.
  if(file){
   const request=messageNativeFileShare(file,"IMAI 图片");
   if(request){
    try{await request;return}
    catch(e){if(e?.name==="AbortError")return}
   }
   messageDownload(row,content);return;
  }
  const imageUrl=image.currentSrc||image.src;
  if(navigator.share&&/^https?:/i.test(imageUrl)){
   try{await navigator.share({title:"IMAI 图片",url:new URL(imageUrl,location.href).href});return}
   catch(e){if(e?.name==="AbortError")return}
  }
  messageDownload(row,content);return;
 }
 const value=String(content||"");
 if(!value.trim()){flashError("没有可以分享的消息");return}
 if(navigator.share){
  try{
   const file=value.length>1800?messageTextFile(value):null;
   const request=file?messageNativeFileShare(file,"IMAI 回复"):null;
   if(request){await request;return}
   await navigator.share({title:"IMAI 回复",text:value});return;
  }catch(e){if(e?.name==="AbortError")return}
 }
 if(await copyMessageText(value,button))flashError("系统分享未能打开，已复制消息内容");
}
async function messageSetAction(row,type,value,button){
 const id=row?.dataset.messageId;
 if(!id){flashError("消息尚未完成保存，请稍后再操作");return}
 if(button.disabled)return;
 button.disabled=true;
 try{
  const r=await api("/api/messages/"+id+"/action",{type,value});
  if(type==="bookmark")row.dataset.saved=r.saved?"1":"0";
  else row.dataset.feedback=String(r.feedback||0);
  for(const b of row.querySelectorAll(".message-copy-bar [data-action]")){
   const k=b.dataset.action,selected=k==="bookmark"?row.dataset.saved==="1":k==="up"?row.dataset.feedback==="1":k==="down"?row.dataset.feedback==="-1":false;
   b.classList.toggle("is-active",selected);
   if(k==="bookmark"){b.title=selected?"取消收藏":"保存消息";b.setAttribute("aria-label",b.title)}
  }
 }catch(e){flashError(humanError(e))}
 finally{button.disabled=false}
}
function messageTokenText(row){
 let usage=null;
 try{usage=JSON.parse(row.dataset.usage||"null")}catch{}
 if(!usage||typeof usage!=="object"||![usage.input,usage.output,usage.total].some(Number.isSafeInteger))return "未提供 Token 用量";
 const fmt=x=>Number.isSafeInteger(x)&&x>=0?x.toLocaleString():"—";
 let text="输入 "+fmt(usage.input)+" · 输出 "+fmt(usage.output)+" · 合计 "+fmt(usage.total);
 if(Number.isSafeInteger(usage.reasoning)&&usage.reasoning>=0)text+=" · 推理 "+fmt(usage.reasoning);
 return text+" tokens";
}
// One anchored non-modal menu; opening does not participate in message layout.
let activeMessageMore=null;
function setMessageMoreOpen(menu,open){
 if(open&&activeMessageMore&&activeMessageMore!==menu)setMessageMoreOpen(activeMessageMore,false);
 menu.panel.hidden=!open;
 menu.trigger.setAttribute("aria-expanded",String(Boolean(open)));
 menu.trigger.classList.toggle("is-active",Boolean(open));
 if(open){
  activeMessageMore=menu;
  const anchor=menu.trigger.getBoundingClientRect(),bar=menu.panel.parentElement.getBoundingClientRect(),viewport=$("conversation").getBoundingClientRect();
  const width=menu.panel.offsetWidth;
  menu.panel.style.setProperty("--message-menu-left",Math.max(viewport.left+8,Math.min(anchor.right-width,viewport.right-width-8))-bar.left+"px");
  menu.panel.style.setProperty("--message-menu-height",Math.max(48,bar.top-Math.max(viewport.top,0)-12)+"px");
 }else if(activeMessageMore===menu)activeMessageMore=null;
}
function wireMessageMore(trigger,panel){
 const menu={trigger,panel};
 panel.hidden=true;trigger.type="button";
 trigger.addEventListener("click",()=>setMessageMoreOpen(menu,panel.hidden));
 return menu;
}
function closeOutsideMessageMore(event){
 const menu=activeMessageMore;if(!menu)return;
 if(!menu.trigger.isConnected||(!menu.trigger.contains(event.target)&&!menu.panel.contains(event.target)))setMessageMoreOpen(menu,false);
}
function closeMessageMore(){
 if(activeMessageMore)setMessageMoreOpen(activeMessageMore,false);
}
function appendMessageCopy(row,content){
 if(!row?.classList?.contains("message"))return;
 if(messageReader?.row===row)stopMessageReader();
 if(activeMessageMore&&row.contains(activeMessageMore.trigger))closeMessageMore();
 row.querySelector(":scope > .message-copy-bar")?.remove();
 const text=String(content||""),image=row.querySelector("img.chat-generated-image");
 if(row.dataset.messageKind==="video")return;
 if(!text.trim()&&!image)return;
 const user=row.classList.contains("user"),bar=node("div","message-copy-bar");
 if(!image)bar.append(messageTool("copy","复制",b=>copyMessageText(text,b)));
 if(user)bar.append(messageTool("square-pen","编辑消息",()=>messageDraft(row.dataset.sourceText||text)));
 const translatable=messageTranslationSource(row,user?row.dataset.sourceText||text:text);
 if(translatable){
  const toggle=messageTool("languages","翻译",b=>toggleMessageTranslation(row,translatable,b));
  toggle.dataset.action="translate";
  const open=Boolean(messageTranslations.get(row)&&!messageTranslations.get(row).panel.hidden);
  toggle.classList.toggle("is-active",open);
  toggle.setAttribute("aria-pressed",String(open));
  bar.append(toggle);
 }
 bar.append(messageTool("share","分享",b=>messageShare(row,text,b)));
 bar.append(messageTool("download","下载",()=>messageDownload(row,text)));
 if(!image&&row.dataset.messageId){
  const bm=messageTool("bookmark",row.dataset.saved==="1"?"取消收藏":"保存消息",b=>messageSetAction(row,"bookmark",row.dataset.saved!=="1",b));
  bm.dataset.action="bookmark";bm.classList.toggle("is-active",row.dataset.saved==="1");bar.append(bm);
 }
 if(!user){
  bar.append(messageTool("refresh-cw","重新生成",()=>retryMessage(row)));
  if(MESSAGE_READ_ALOUD_ENABLED&&!image){
   const play=messageTool("volume-2","朗读回复",b=>startMessageReader(row,text,b));
   play.setAttribute("aria-pressed","false");bar.append(play);
  }
 }
 const trigger=node("button","message-copy-btn message-more-trigger"),panel=node("div","message-more-panel");
 trigger.setAttribute("aria-label","更多消息操作");trigger.setAttribute("aria-expanded","false");trigger.title="更多消息操作";trigger.append(iconSlot("ellipsis"));
 const more=wireMessageMore(trigger,panel);
 if(!user){
  if(!image)panel.append(messageTool("file-text","下载 TXT",()=>{setMessageMoreOpen(more,false);messageDownload(row,text,"txt")}));
  const reported=node("div","message-token-report",messageTokenText(row));
  reported.title="仅展示服务商实际报告的 Token；未返回则不估算";
  panel.append(reported);
   if(row.dataset.usedModel){const modelReport=node("div","message-token-report","回复模型："+row.dataset.usedModel);modelReport.title="服务端记录的回复模型；不改变当前选定模型";panel.append(modelReport);}
  const current=Number(row.dataset.feedback||0);
  if(!image&&row.dataset.messageId){
   for(const [score,icon,name] of [[1,"thumbs-up","有帮助"],[-1,"thumbs-down","没有帮助"]]){
    const feedback=messageTool(icon,name,b=>{
     setMessageMoreOpen(more,false);
     messageSetAction(row,"feedback",Number(row.dataset.feedback)===score?0:score,b);
    });
    feedback.dataset.action=score===1?"up":"down";feedback.classList.toggle("is-active",current===score);
    panel.append(feedback);
   }
   if(messageQuestion(row)){
    panel.append(messageTool("layers","换模型重问",()=>{
     setMessageMoreOpen(more,false);if(messageDraft(messageQuestion(row)))openModels();
    }));
   }
   if(text.trim()&&text.length<100000&&!row.dataset.messageKind&&!/^!\[/.test(text)){
    const next=messageTool("continue-write","继续生成",b=>continueTextReply(row,text,b));
    next.classList.add("message-continue-btn");bar.append(next);
   }
  }
 }
 if(!user){bar.append(trigger);renderIcons(trigger);const stamp=Number(row.dataset.createdAt);if(stamp>0){const time=node("time","message-time",new Intl.DateTimeFormat("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:false}).format(stamp));time.dateTime=new Date(stamp).toISOString();time.title=new Date(stamp).toLocaleString("zh-CN");bar.append(time)}bar.append(panel)}
 const translated=row.querySelector(":scope > .message-translation");
 if(translated)row.append(bar,translated);else row.append(bar);
}



function renderPaidVideo(bubble,provider,id){
 const label=node("span","video-job-hint","视频任务已提交"),button=node("button","chat-video-save","查询视频");
 button.type="button";bubble.replaceChildren(label,button);
 button.addEventListener("click",async()=>{
  if(button.disabled)return;button.disabled=true;
  try{
   const r=await api("/api/video/status",{provider,requestId:id});
   if(!bubble.isConnected)return;
   if(r.status==="completed"&&/^https:\/\//i.test(r.url||"")){
    const video=node("video","chat-generated-video");video.controls=true;video.playsInline=true;video.preload="metadata";video.src=r.url;
    const link=node("a","chat-video-save","下载原视频");link.href=r.url;link.target="_blank";link.rel="noopener noreferrer";link.download="aigzt-video.mp4";
    bubble.replaceChildren(video,link);
   }else label.textContent=r.status==="failed"?"视频生成失败":r.status==="completed"?"视频链接已失效或不可用":"视频仍在生成";
  }catch(e){label.textContent=humanError(e)}finally{button.disabled=false}
 });
}
function inlineVideo(bubble,id){
 const url="/api/video/media/"+id,video=node("video","chat-generated-video");
 video.controls=true;video.playsInline=true;video.preload="metadata";video.src=url;
 const actions=node("div","chat-video-actions"),link=node("a","chat-video-save","下载");
 link.href=url;link.download="aigzt-"+id+".mp4";actions.append(link);
 bubble.replaceChildren(video,actions);
}
/* Local elapsed clock with bounded automatic server status checks.
 * Only the existing free job is queried; this never resubmits generation. */
function inlineVideoJob(bubble,id,retry=false){
 bubble.dataset.videoTask=id;
 bubble.dataset.videoStarted=String(Date.now());
 const label=node("span","video-job-label","视频生成中 · 0:00");
 const frame=createImageWaitingFrame();
 frame.classList.add("video-loading-card");
 frame.setAttribute("aria-label","视频生成中");
 const mark=node("div","video-loading-mark");
 mark.append(iconSlot("video"));renderIcons(mark);frame.append(mark);
 const hint=node("span","video-job-hint","正在等待免费来源生成视频");
 bubble.classList.add("chat-video-task");
 bubble.replaceChildren(label,frame,hint);
 if(S.busy)followLatestImage(bubble);
 const active=()=>bubble.isConnected&&bubble.dataset.videoTask===id;
 let taskTimer=0,errors=0,polling=false;
 const clock=window.setInterval(()=>{
  if(!active()){cleanup();return}
  if(!document.hidden){
   const elapsed=Math.max(0,Math.floor((Date.now()-Number(bubble.dataset.videoStarted||Date.now()))/1000));
   label.textContent="视频生成中 · "+Math.floor(elapsed/60)+":"+String(elapsed%60).padStart(2,"0");
  }
 },1000);
 function cleanup(){
  window.clearInterval(clock);window.clearTimeout(taskTimer);taskTimer=0;
  document.removeEventListener("visibilitychange",onReturn);
  window.removeEventListener("online",onReturn);
  delete bubble.dataset.videoTask;delete bubble.dataset.videoStarted;
  bubble.classList.remove("chat-video-task");
 }
 function schedule(delay){
  if(!active()||document.hidden)return;
  if(taskTimer)window.clearTimeout(taskTimer);
  taskTimer=window.setTimeout(()=>{taskTimer=0;void poll()},delay);
 }
 function onReturn(){
  if(!active()){cleanup();return}
  if(document.hidden){hint.textContent="已暂停查询，返回页面后继续";window.clearTimeout(taskTimer);taskTimer=0;return}
  if(!polling)schedule(800);
 }
 async function poll(){
  if(!active()||polling)return;
  if(document.hidden){hint.textContent="已暂停查询，返回页面后继续";return}
  polling=true;hint.textContent="正在确认视频状态…";
  let delay=17000;
  try{
   const path=retry?"/api/video/retry":"/api/video/status";
   retry=false;
   const r=await api(path,{provider:"free",requestId:id});
   if(!active())return;
   errors=0;
   if(Number.isFinite(r.startedAt)&&r.startedAt>0)bubble.dataset.videoStarted=String(r.startedAt);
   if(r.status==="completed"){
    const local=/^\/api\/video\/media\/[0-9a-f-]{36}$/i.test(r.url||"");
    const external=r.temporaryUrl===true&&/^https:\/\/[a-z0-9-]+\.hf\.space\/gradio_api\/file=/i.test(r.url||"");
    if(local){
     const row=bubble.closest(".message"),mediaId=r.url.split("/").pop();
     cleanup();
     if(row){appendMessage("assistant","[[aigzt:video:"+mediaId+"]]","免费视频",row,false,row.dataset.messageId);setPortraitState(row,"finished")}
     else inlineVideo(bubble,mediaId);
     if(r.recovered){const target=row?.querySelector(".bubble")||bubble;target.append(node("span","video-job-hint","已恢复同一请求生成的视频"));}
     return;
    }
    if(r.status==="completed"&&r.temporaryUrl===true&&String(r.url||"").startsWith("/api/video/result/")){
     const key=deviceMediaKey(bubble.closest(".message")?.dataset.messageId||id);cleanup();
     try{const blob=await deviceMediaBlob(r.url);if(!blob)throw Error("视频下载失败");const saved=await deviceMediaPut(key,blob);if(bubble.isConnected){renderDeviceMedia(bubble,blob,"video");if(!saved)mediaCacheWarning(bubble);setPortraitState(bubble.closest(".message"),"finished")}}
     catch{if(bubble.isConnected){localMediaNotice(bubble,"video");const link=node("a","chat-video-save","下载原视频");link.href=r.url;link.download="aigzt-video.mp4";bubble.append(link)}}return;
    }
    if(external){
     const video=node("video","chat-generated-video");video.controls=true;video.playsInline=true;video.preload="metadata";video.src=r.url;
     const link=node("a","chat-video-save","下载临时视频");link.href=r.url;link.target="_blank";link.rel="noopener noreferrer";
     cleanup();bubble.replaceChildren(video,link);setPortraitState(bubble.closest(".message"),"finished");return;
    }
   }
   if(r.status==="failed"){
    cleanup();frame.remove();
    label.textContent="视频生成失败";hint.textContent=r.error||"免费来源暂不可用";
    if(r.retryable){
     const button=node("button","chat-video-save","重新生成");button.type="button";
     button.addEventListener("click",()=>{button.disabled=true;inlineVideoJob(bubble,id,true)});
     bubble.append(button);
    }
    setPortraitState(bubble.closest(".message"),"error");
    return;
   }
   hint.textContent=r.stage===1?"正在等待备用视频来源…":"等待免费来源返回视频…";
   delay=Math.max(1000,Math.min(15000,Number(r.waitSeconds||8)*1000));
  }catch(error){
   if(!active())return;
   errors++;delay=Math.min(60000,17000*2**Math.min(errors,2));
   hint.textContent=navigator.onLine===false?"网络离线，连接恢复后继续":"查询遇到网络问题，将自动重试";
  }finally{
   polling=false;
   if(active())schedule(delay);
  }
 }
 document.addEventListener("visibilitychange",onReturn);
 window.addEventListener("online",onReturn);
 schedule(0);
}

// Fold presentation only; sourceText and message actions keep the full message.
const USER_MESSAGE_PREVIEW_LINES=5;
function setUserMessageExpanded(row,expanded){
 const body=row.querySelector(".user-message-text"),toggle=row.querySelector(".user-message-toggle");
 if(!body||!toggle)return;
 row.dataset.userMessageExpanded=expanded?"1":"0";
 body.classList.toggle("is-collapsed",!expanded);
 toggle.setAttribute("aria-expanded",String(expanded));
 toggle.textContent=expanded?"收起":"展开全文";
}
function updateUserMessageFold(row){
 const body=row.querySelector(".user-message-text"),toggle=row.querySelector(".user-message-toggle");
 if(!body||!toggle||!body.isConnected||!body.clientWidth)return;
 const lineHeight=parseFloat(window.getComputedStyle(body).lineHeight);
 const overflow=Number.isFinite(lineHeight)&&body.scrollHeight>lineHeight*USER_MESSAGE_PREVIEW_LINES+1;
 toggle.hidden=!overflow;
 if(!overflow&&row.dataset.userMessageExpanded==="1")setUserMessageExpanded(row,false);
}
function refreshUserMessageFolds(){
 for(const row of document.querySelectorAll("#messageList .message.user"))updateUserMessageFold(row);
}
function attachUserMessageText(row,bubble,textBody){
 if(!textBody.childNodes.length)return;
 textBody.classList.add("is-collapsed");
 const toggle=node("button","user-message-toggle","展开全文");
 toggle.type="button";toggle.hidden=true;
 toggle.setAttribute("aria-expanded","false");
 row.dataset.userMessageExpanded="0";
 toggle.addEventListener("click",()=>{setUserMessageExpanded(row,row.dataset.userMessageExpanded!=="1");updateUserMessageFold(row)});
 textBody.addEventListener("focusin",event=>{
  if(event.target.matches?.(":focus-visible")&&row.dataset.userMessageExpanded!=="1"){
   setUserMessageExpanded(row,true);updateUserMessageFold(row);
  }
 });
 bubble.prepend(textBody,toggle);
}
function appendMessage(role,content,model,existingRow=null,incomplete=false,messageId=null,saved=false,feedback=0,usage=null,createdAt=null,replyImages=[]){
 const row=existingRow||node("div","message "+role),bubble=existingRow?.querySelector(".bubble")||node("div","bubble");
 if(existingRow){
  row.querySelector(":scope > .message-copy-bar")?.remove();
  row.querySelector(":scope > .message-translation")?.remove();
  messageTranslations.delete(row);
  delete bubble.dataset.imageFinalizing;
 }
 if(messageId)row.dataset.messageId=messageId;
 if(Number(createdAt)>0)row.dataset.createdAt=String(createdAt);else if(!row.dataset.createdAt&&!existingRow&&String(content||"").trim())row.dataset.createdAt=String(Date.now());
 row.dataset.saved=saved?"1":(row.dataset.saved||"0");
 row.dataset.feedback=String(Number(feedback)||0);
 row.dataset.usage=typeof usage==="string"?usage:usage?JSON.stringify(usage):(row.dataset.usage||"");
 bubble.classList.remove("chat-image-task");
 if(role==="user")row.dataset.sourceText=String(content||"");
 if(role!=="assistant"||!assistantTextState.has(bubble))bubble.textContent=String(content||"");
 if(role==="assistant"){
  if(!existingRow)row.append(makeAssistantPortrait(),bubble);
  else if(!row.querySelector(":scope > .avatar-ai"))row.prepend(makeAssistantPortrait());
  const pending=String(content||"").match(/^\[\[aigzt:image-job:([0-9a-f-]{36})\]\]$/i);
  if(pending){row.dataset.messageKind="image";bubble.replaceChildren();if(existingRow)renderImageJob(bubble,pending[1]);else void restoreDeviceMedia(bubble,messageId||pending[1],"image","",pending[1])}
  const picture=String(content||"").match(/^!\[生成图片\]\((\/api\/files\/[0-9a-f-]{36})\)$/);
  if(picture){row.dataset.messageKind="image";void restoreDeviceMedia(bubble,messageId,"image",picture[1])}
  const videoPending=String(content||"").match(/^\[\[aigzt:video-job:([0-9a-f-]{36})\]\]$/i);
  const paidVideo=String(content||"").match(/^\[\[aigzt:paid-video:(grok|runway|luma|vidu):([A-Za-z0-9_-]{4,160})\]\]$/);
  if(paidVideo){row.dataset.messageKind="video";renderPaidVideo(bubble,paidVideo[1],paidVideo[2])}
  const videoDone=String(content||"").match(/^\[\[aigzt:video:([0-9a-f-]{36})\]\]$/i);
  if(videoPending){row.dataset.messageKind="video";if(existingRow)inlineVideoJob(bubble,videoPending[1]);else void restoreDeviceMedia(bubble,messageId||videoPending[1],"video");}
  if(videoDone){row.dataset.messageKind="video";void restoreDeviceMedia(bubble,messageId||videoDone[1],"video","/api/video/media/"+videoDone[1]);}
  const localDone=/^(图片已生成[（(]|图生图已生成[（(]|视频已生成[（(])/.test(String(content||""));
  if(localDone){const kind=String(content).startsWith("视频")?"video":"image";row.dataset.messageKind=kind;void restoreDeviceMedia(bubble,messageId,kind)}
  if(!pending&&!picture&&!videoPending&&!videoDone&&!paidVideo&&!localDone&&String(content||"").trim()){
   updateAssistantText(bubble,content,true);
   // Keep the answer clean; all actions are in the compact toolbar.
   row.dataset.usedModel=typeof model==="string"?model:"";
   row.dataset.incomplete=incomplete?"1":"0";
  }
  if(Array.isArray(replyImages)&&replyImages.length){for(const src of replyImages)appendReplyImage(bubble,src)}
  else if(!existingRow&&messageId&&!pending&&!picture&&!localDone&&!videoPending&&!videoDone&&!paidVideo)void restoreReplyImages(bubble,messageId);
   if(!pending&&!videoPending&&!videoDone&&!picture&&!localDone)appendMessageCopy(row,content);
 }else{
  const lines=String(content||"").split(/\n(?=\[文件：)/);
   bubble.replaceChildren();
   const textBody=node("div","user-message-text");
  const marker=/^\[文件：([^\]]+)\]\((\/api\/files\/[0-9a-f-]{36})\)$/i;
  const parts=lines.map(line=>({line,file:line.match(marker)}));
  if(parts.some(part=>part.file)){
   for(const part of parts){
    if(!part.file){if(part.line.trim()){if(textBody.childNodes.length)textBody.append(document.createTextNode("\n"));appendChatLinks(textBody,part.line)}continue;}
    const [,name,url]=part.file;
    const isImage=/\.(jpe?g|png|webp|gif|heic|heif)$/i.test(name)||name==="参考图";
    if(isImage){
     const frame=node("div","chat-user-image-attachment");
     const img=node("img","chat-upload-image");img.src=url;img.alt=name;img.loading="lazy";
     img.addEventListener("error",()=>{frame.replaceChildren();const link=node("a","chat-file","图片无法预览 · 点击打开");link.href=url;link.target="_blank";link.rel="noopener";frame.append(link)},{once:true});
     frame.append(img);bubble.append(frame);
    }else{
     const link=node("a","chat-file",name);link.href=url;link.target="_blank";link.rel="noopener";bubble.append(link);
    }
   }
  }else appendChatLinks(textBody,content);
   attachUserMessageText(row,bubble,textBody);
   row.append(bubble);
  // Keep the sent-message copy action below its bubble, not inside the text background.
  appendMessageCopy(row,content);
 }
 if(!existingRow)$("messageList").append(row);
  if(role==="user")updateUserMessageFold(row);
  const viewport=$("conversation");
 if(viewport&&!viewport.hidden){
  const nearBottom=viewport.scrollHeight-viewport.scrollTop-viewport.clientHeight<150;
  if(row.dataset.readFromStart!=="1"&&(nearBottom||role==="user"))viewport.scrollTop=viewport.scrollHeight;
 }
 return row;
}
function newChat(keepDrawer=false){
 closeMessageMore();
 stopMessageReader();if(voiceSession.reading)voiceCancel();
 S.creativeMode=null;
 S.code=false;$("codeToggle").classList.remove("active");$("codeToggle").setAttribute("aria-pressed","false");
 if(S.freeToolsMode)setFreeToolsMode(false);
 if(S.workMode)setWorkMode(false);
 if(history.state?.aigztWorkspace)history.replaceState({...history.state,aigztWorkspace:false},"",location.pathname+location.search);
 S.chatId=null;S.attachments=[];renderAttachments();setComposerMode("text");$("messageList").replaceChildren();showWelcome();
 $("prompt").value="";$("prompt").placeholder="向 AI 提问…";settlePromptSize();flashError("");renderHistory();if(keepDrawer!==true)closeMenu();
}
function startCoding(){
 if(S.busy)return;
 newChat();
 S.code=true;$("codeToggle").classList.add("active");$("codeToggle").setAttribute("aria-pressed","true");
 $("prompt").value="请帮我完成以下编程需求，提供完整可运行的代码、错误处理和验证步骤：\n";
 settlePromptSize();$("prompt").focus();
}
async function loadChat(id){
 if(S.busy)return;
 closeMessageMore();
 stopMessageReader();if(voiceSession.reading)voiceCancel();
 S.creativeMode=null;
 if(S.freeToolsMode)setFreeToolsMode(false);
 if(S.workMode)setWorkMode(false);
 try{
  const v=await api("/api/chats/"+id);
  S.chatId=id;$("messageList").replaceChildren();hideWelcome();
  for(const m of v.messages){let incomplete=false;try{incomplete=Boolean(JSON.parse(m.usage_json||"null")?.incomplete)}catch{}appendMessage(m.role,m.body,m.model,null,incomplete,m.id,Boolean(m.saved),m.feedback,m.usage_json,m.created_at)}
  const c=S.chats.find(c=>c.id===id);
  if(c&&c.project_id!==undefined){S.activeProjectId=c.project_id||null;renderProjects()}
  // A chat's saved provider is historical; viewing it must not overwrite the active selection.
  updateModelTitle();
  renderHistory();closeMenu();
 }catch(e){flashError("会话读取失败："+humanError(e))}
}
function chatSelectedName(){
 if(!chatModelPreferenceReady)return "恢复模型…";
 if(S.provider==="free")return S.model==="free:auto"?"自动模式":(S.modelTitle||S.model);
 const raw=String(S.modelTitle||S.model||"").trim(),label=raw.startsWith(S.provider+" · ")?raw.slice(S.provider.length+3):raw;
 return providerRouteLabel(S.provider)+" · "+(WORK_PROVIDER_SHORT[S.provider]||S.provider)+" · "+(label||S.model);
}
function updateComposerModel(){
 const line=$("composerModelLine"),name=$("composerModelName"),switcher=$("composerSwitchModel");
 if(!line||!name||!switcher)return;
 const imageMode=S.composerMode==="image",videoMode=S.composerMode==="video";
 line.hidden=(!imageMode&&!videoMode&&S.composerMode!=="text")||S.freeToolsMode;
 const work=Boolean(S.workMode),active=work?currentWorkModelName():chatSelectedName();
 $("replyLevelTrigger").hidden=work;if(work)closeReplyLevel();
 name.classList.toggle("is-auto-model",work?["auto","free"].includes(currentWorkStage().step.provider):S.provider==="free"&&S.model==="free:auto");
 name.textContent=imageMode?(S.miniToolChoice==="image-edit"?"图生图 · 上传参考图":"免费作图"):videoMode?(S.videoProvider==="freeloop"?"首尾帧视频":S.videoProvider==="freewan"?"图生视频":VIDEO_PROVIDER_NAMES[S.videoProvider]||"免费视频"):S.code?"代码 · "+active:active;
 name.title=imageMode?"图片生成或修改将在当前聊天展示":videoMode?"正在使用"+(VIDEO_PROVIDER_NAMES[S.videoProvider]||"视频")+"，点击模型图标返回聊天":S.code?"代码模式 · "+active:(work?"当前工作选择：":"当前聊天选择：")+active;
 $("composerModelCaption").textContent=imageMode?"作图模式":videoMode?"视频模式":work?"工作模型":"聊天模型";
 switcher.setAttribute("aria-label",(videoMode||imageMode||S.code)?"切回普通聊天":work?"切换工作模型":"切换聊天模型");
 switcher.title=(videoMode||imageMode||S.code)?"切回普通聊天":work?"切换工作模型":"切换聊天模型";
}
function updateModelTitle(){
 $("modelTitle").textContent=!chatModelPreferenceReady?"恢复模型…":S.provider==="free"&&S.model==="free:auto"?"免费自动":S.modelTitle;
 updateComposerModel();
}
function setModel(row){
 const route=row.availableWith==="openrouter-key"?"openrouter":row.provider;
 if(unavailableChatModel(route,row.id)){flashError("此模型当前不可调用，请选择其他模型");return}
 if(row.type!=="text"&&!(row.type==="image"&&row.availableWith==="openrouter-key"&&row.outputImages)){
  if(row.type==="audio")return;
  hide("modelDialog");
  if(row.type==="image"){setComposerMode("image");$("prompt").focus({preventScroll:true})}
  else if(row.type==="video"){if(VIDEO_OPTIONS[row.provider]?.includes(row.id))chooseChatVideo(row.provider,row.id);else flashError("此视频模型暂无本站生成接口，请选择已接入的视频模型。")}
  
  return;
 }
 setComposerMode("text");
 // Models returned by the OpenRouter catalog must use OpenRouter authentication, not the model author's API.
 const via=row.availableWith==="openrouter-key"?"openrouter":row.provider;
 S.provider=via;S.model=row.id;S.modelTitle=row.name||row.id;
 S.allowPaid=Boolean(S.savedProviders[via]?.consent);S.selectedFree=isFreeModel(via,S.model);
 rememberChatModelSelection();
 if(via!=="free"&&!connected(via)){
  updateModelTitle();hide("modelDialog");$("manualModel").value="";openKeyPanel(via,"modelDialog");
  $("keyStatus").textContent="已选定 "+row.id+"，请保存该服务商 API Key";
  return;
 }
 if(S.savedProviders[via])void api("/api/connections/"+via+"/selected",{model:row.id}).catch(e=>flashError(humanError(e)));
 updateModelTitle();hide("modelDialog");flashError("");
}

function resizePrompt(){
 const textarea=$("prompt");if(!textarea)return;
 const layout=$("chatForm"),value=textarea.value;
 const threshold=window.innerWidth<=900?18:52;
 const multiline=value.includes("\n")||Array.from(value).length>=threshold;
 layout.classList.toggle("composer-multiline",multiline);
 textarea.style.height="32px";
 const needed=Math.max(32,textarea.scrollHeight),max=multiline?76:104;
 textarea.style.height=Math.min(needed,max)+"px";
 textarea.style.overflowY=needed>max?"auto":"hidden";
}
let promptLayoutFrame=0;
function settlePromptSize(){
 if(promptLayoutFrame)return;
 promptLayoutFrame=requestAnimationFrame(()=>{promptLayoutFrame=0;resizePrompt()});
}
let viewportLayoutFrame=0,composerViewportBaseline=0,composerViewportWidth=0,installedStableWidth=0;
function composerViewportMetrics(height,offsetTop,baseline,focused,wasVisible){
 const h=Math.max(0,Math.round(height));
 const keyboardVisible=(focused||wasVisible)&&baseline-h>100;
 return {keyboardVisible,height:h,top:Math.max(0,Math.round(offsetTop||0))};
}
/* Use the real installed viewport rather than a potentially shorter dvh.
   Keyboard geometry remains owned by composerViewportMetrics. */
function installedViewportMetrics(inner,client,visual,offset,screenHeight){
 const values=[inner,client,visual+Math.max(0,offset||0)].filter(n=>Number.isFinite(n)&&n>0);
 const h=Math.round(Math.max(0,...values));
 const screen=Number(screenHeight);
 const missing=Number.isFinite(screen)&&screen>=h&&screen-h<160?Math.round(screen-h):0;
 // A standalone iOS window can report a shortened layout after keyboard dismissal.
 // Restore only a plausible portrait screen gap; never use an unrelated screen size.
 return {height:missing>0&&missing<=96?Math.round(screen):h,missing:0};
}
function stableInstalledHeight(previous,candidate,orientationChanged){
 return orientationChanged||!previous?candidate:Math.max(previous,candidate);
}
function syncMobileHeight(){
 if(viewportLayoutFrame)return;
 viewportLayoutFrame=requestAnimationFrame(()=>{
  viewportLayoutFrame=0;
  const root=document.documentElement,vv=window.visualViewport,prompt=$("prompt");
  const focused=document.activeElement===prompt&&!$("composerArea").hidden;
  const mobile=window.matchMedia("(max-width:900px)").matches;
  const width=Math.round(vv?.width||window.innerWidth),height=vv?.height||window.innerHeight;
  const previous=root.classList.contains("aigzt-keyboard-visible");
  if(!composerViewportBaseline||Math.abs(width-composerViewportWidth)>80){
   composerViewportBaseline=Math.max(height,window.innerHeight);
   composerViewportWidth=width;
  }
  if(!focused&&!previous)composerViewportBaseline=Math.max(height,window.innerHeight);
  const metrics=composerViewportMetrics(height,vv?.offsetTop||0,composerViewportBaseline,focused,previous);
  const active=mobile&&metrics.keyboardVisible&&(!document.querySelector("dialog[open]"))&&!$("composerArea").hidden;
  if(previous!==active)root.classList.toggle("aigzt-keyboard-visible",active);
  if(active){
   if(root.style.getPropertyValue("--aigzt-visible-height")!==metrics.height+"px")root.style.setProperty("--aigzt-visible-height",metrics.height+"px");
   if(root.style.getPropertyValue("--aigzt-visible-top")!==metrics.top+"px")root.style.setProperty("--aigzt-visible-top",metrics.top+"px");
  }else{
   root.style.removeProperty("--aigzt-visible-height");
   root.style.removeProperty("--aigzt-visible-top");
   if(!focused)composerViewportBaseline=Math.max(height,window.innerHeight);
   if(root.classList.contains("aigzt-ios-pwa")&&!focused&&!metrics.keyboardVisible){
    // Exclude the CSS-controlled root height from viewport measurement.
    const pwa=installedViewportMetrics(window.innerHeight,0,height,0,window.screen?.height);
    const layoutWidth=Math.round(window.innerWidth),changed=installedStableWidth>0&&Math.abs(layoutWidth-installedStableWidth)>80;
    installedStableWidth=layoutWidth;
    const prior=parseInt(root.style.getPropertyValue("--aigzt-pwa-height"),10)||0;
    const stable=stableInstalledHeight(prior,pwa.height,changed);
    if(stable>0&&stable!==prior)root.style.setProperty("--aigzt-pwa-height",stable+"px");
   }
  }
 });
}

/* Tool selections live exclusively in the + menu. */
function syncMiniTools(){
 const active={
  miniImageEdit:S.composerMode==="image"&&S.miniToolChoice==="image-edit",
  miniImageVideo:S.composerMode==="video"&&S.videoProvider==="freewan",
  miniFrameVideo:S.composerMode==="video"&&S.videoProvider==="freeloop"
 };
 for(const [id,yes] of Object.entries(active)){
  const btn=$(id);if(!btn)continue;
  btn.classList.toggle("active",yes);btn.setAttribute("aria-pressed",String(yes));
 }
}
/* The selected mode is shown in the model line. Native file pickers remain in the + menu. */
function chooseMiniTool(action){
 if(S.busy)return;
 hideAttachMenu();
 const isEdit=action==="image-edit";
 const isImageVideo=action==="image-video";
 const isFrameVideo=action==="frame-video";
 if(!isEdit&&!isImageVideo&&!isFrameVideo)return;
 if(isEdit){
  setComposerMode("image");
  S.miniToolChoice="image-edit";
  $("prompt").placeholder="上传参考图，然后描述需要修改的内容…";
 }else{
  const provider=isImageVideo?"freewan":"freeloop";
  selectVideoModel(provider,VIDEO_OPTIONS[provider][0]);
  setComposerMode("video");
  $("prompt").placeholder=isFrameVideo?"添加首帧和尾帧两张图，描述过渡动作…":"添加参考图，描述画面需要的动作…";
 }
 syncMiniTools();updateComposerModel();
 $("prompt").focus({preventScroll:true});
}

function setComposerMode(mode){
 if(mode!=="image")S.miniToolChoice=null;
 S.composerMode=mode;
 if(S.workMode&&mode!=="text")setWorkMode(false);
 if(mode!=="text"&&S.code){S.code=false;$("codeToggle").classList.remove("active");$("codeToggle").setAttribute("aria-pressed","false")}
 $("imageMode").classList.toggle("active",mode==="image");
 $("videoMode").classList.toggle("active",mode==="video");
 $("imageMode").setAttribute("aria-pressed",String(mode==="image"));
 $("videoMode").setAttribute("aria-pressed",String(mode==="video"));
 $("prompt").placeholder=mode==="image"?"描述想画的内容…":mode==="video"?"描述想生成的视频…":S.code?"描述编程任务…":"向 AI 提问…";
 resizePrompt();updateComposerModel();syncMiniTools();
}
function renderAttachments(){
 const el=$("attachmentPreview");if(!el)return;el.replaceChildren();
 for(const item of S.attachments){
  const badge=node("span","attachment-item"),title=node("span","",item.name),del=node("button");del.append(iconSlot("x"));del.setAttribute("aria-label","移除附件："+item.name);renderIcons(del);
  del.type="button";del.title="取消附件";
  del.addEventListener("click",()=>{S.attachments=S.attachments.filter(x=>x.id!==item.id);renderAttachments()});
  if(item.type?.startsWith("image/")&&/^\/api\/files\/[0-9a-f-]{36}$/i.test(item.url||"")){
   badge.classList.add("attachment-image-item");
   const thumb=node("img","attachment-thumb");thumb.src=item.url;thumb.alt="";thumb.loading="lazy";
   thumb.addEventListener("error",()=>thumb.replaceWith(node("span","attachment-image-error","图片不可预览")),{once:true});
   badge.append(thumb,del);
  }else badge.append(title,del);
  el.append(badge);

 }
}
/* Resize an image-edit reference in the visitor's browser before uploading.
 * No remote conversion service, additional site generations or saved result. */
/* Normal JPG/PNG/WebP attachments stay unchanged.
 * Convert only an oversized reference or HEIC/HEIF used in image-edit mode.
 * Use an Image fallback for iPhone Safari when createImageBitmap cannot decode HEIC. */
/* AI Horde source_image accepts Base64 WebP. Keep the ordinary text-to-image
 * implementation unchanged: only optimize a reference added in image mode. */
/* Reference-image compatibility: WebP is preferred, not required.
 * iOS Safari may return PNG from canvas.toBlob("image/webp"). Preserve the
 * actual MIME and filename, never label PNG bytes as WebP or block uploading.
 * This runs only for image mode; text/chat/video attachments remain untouched. */
async function optimizeImageReference(file){
 if(S.composerMode!=="image"&&!(S.composerMode==="video"&&S.videoProvider!=="freetext")&&arguments[1]!==true)return file;
 const type=String(file.type||"").toLowerCase();
 const supported=["image/jpeg","image/png","image/webp"].includes(type);
 const heic=["image/heic","image/heif"].includes(type)||/\.(heic|heif)$/i.test(file.name||"");
 if(!supported&&!heic)return file;
 // Small native JPG/PNG/WebP files do not need browser conversion at all.
 if(supported&&file.size<=1450000)return file;
 let bitmap=null,preview=null,objectUrl="";
 try{
  if(typeof createImageBitmap==="function"){
   try{bitmap=await createImageBitmap(file)}catch{}
  }
  if(!bitmap){
   objectUrl=URL.createObjectURL(file);
   preview=await new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(Error("参考图片无法读取，请选择 JPG 或 PNG 图片"));
    img.src=objectUrl;
   });
  }
  const source=bitmap||preview,width=source.width||source.naturalWidth,height=source.height||source.naturalHeight;
  if(!width||!height)throw Error("参考图片尺寸无效");
  const canvas=document.createElement("canvas");
  const encode=(maxSide,mime,quality)=>new Promise((resolve,reject)=>{
   const scale=Math.min(1,maxSide/Math.max(width,height));
   canvas.width=Math.max(1,Math.round(width*scale));
   canvas.height=Math.max(1,Math.round(height*scale));
   const ctx=canvas.getContext("2d");
   if(!ctx)return reject(Error("浏览器无法处理参考图片"));
   ctx.drawImage(source,0,0,canvas.width,canvas.height);
   canvas.toBlob(blob=>blob&&["image/webp","image/jpeg","image/png"].includes(blob.type)?
    resolve(blob):reject(Error("图片编码失败，请换一张图片")),mime,quality);
  });
  let blob=await encode(768,"image/webp",.76);
  // A PNG result is Safari's normal unsupported-WebP fallback, not a failure.
  if(blob.size>1450000)blob=await encode(640,"image/jpeg",.7);
  if(blob.size>1450000)blob=await encode(448,"image/png",1);
  if(blob.size>1500000)throw Error("参考图片过大，请换一张较小的图片");
  const ext=blob.type==="image/webp"?"webp":blob.type==="image/png"?"png":"jpg";
  const base=String(file.name||"reference").replace(/\.[^.]+$/,"")||"reference";
  return new File([blob],base+"."+ext,{type:blob.type});
 }finally{
  bitmap?.close?.();
  if(objectUrl)URL.revokeObjectURL(objectUrl);
 }
}

async function uploadSelected(files){
 if(!S.user){show("authDialog");return}
 if(S.uploading)return;
 if(!files.length)return;
 if(S.attachments.length+files.length>4){flashError("一次最多上传4个附件");return}
 if(S.composerMode==="video"&&S.videoProvider==="freeloop"&&S.attachments.length+files.length>2){flashError("首尾帧需要两张图片，请先移除多余附件");return}
 if(S.composerMode==="image"&&S.miniToolChoice==="image-edit"&&(files.length!==1||S.attachments.length)){
  flashError("图生图一次仅允许一张参考图片，请先移除原图再选择");return
 }
 S.uploading=true;$("attachButton").disabled=true;flashError("");
 try{
 for(const file of files){
  try{
   const heic=/^image\/hei[cf]$/i.test(file.type||"")||/\.(heic|heif)$/i.test(file.name||"");
   const selected=await optimizeImageReference(file,heic);
   if(selected.size>8000000){flashError("单文件最大8MB："+file.name);continue}
   const body=new FormData();body.append("file",selected);
   const r=await fetch("/api/files/upload",{method:"POST",credentials:"same-origin",body});
   const d=await r.json().catch(()=>null);
   if(!r.ok||!d?.ok)throw Error(d?.error||"HTTP "+r.status);
   S.attachments.push(d);renderAttachments();
  }catch(e){flashError("上传失败："+humanError(e))}
 }
 }finally{S.uploading=false;$("attachButton").disabled=false}
}



const WORK_PROVIDER_NAMES={
 free:"平台免费接口",openrouter:"OpenRouter API",groq:"Groq API",cerebras:"Cerebras API",openai:"OpenAI API",claude:"Anthropic Claude API",novai:"Nova AI · 多模型",novai_pro:"NovAI · 中国模型",
 grok:"xAI API",gemini:"Gemini API",qwen:"阿里百炼 API",deepseek:"DeepSeek API",zhipu:"智谱 API",kimi:"Moonshot API",
 minimax:"MiniMax API",siliconflow:"硅基流动 API",doubao:"火山方舟 API",qianfan:"百度千帆 API",hunyuan:"腾讯混元 API",stepfun:"阶跃星辰 API",xiaomi:"小米 MiMo API",longcat:"美团 LongCat API",baichuan:"百川智能 API",iflytek:"讯飞星火 API",sensetime:"商汤 SenseNova API",yandex:"Yandex AI Studio · 俄罗斯",gigachat:"GigaChat · 俄罗斯"
};
/* Work-task models are independent from the chat model and its selector. */
const WORK_PROVIDER_SHORT={free:"免费自动",auto:"免费自动",groq:"Groq",openrouter:"OpenRouter",deepseek:"DeepSeek",yandex:"YandexGPT",gigachat:"GigaChat",qwen:"千问",zhipu:"智谱",kimi:"Kimi",minimax:"MiniMax",siliconflow:"硅基流动",doubao:"豆包",qianfan:"千帆",hunyuan:"混元",stepfun:"阶跃",xiaomi:"MiMo",longcat:"LongCat",baichuan:"百川",iflytek:"星火",sensetime:"商汤",novai:"NovaAI",novai_pro:"NovaAI 中国",openai:"OpenAI",claude:"Claude",grok:"Grok",gemini:"Gemini",cerebras:"Cerebras"};
function currentWorkStage(){
 const index=Math.min(S.workDetail?.task?.nextStep||0,Math.max(0,S.workStages.length-1));
 return {index,step:S.workStages[index]||{provider:"auto",model:""}};
}
function currentWorkModelName(){
 const s=currentWorkStage().step,p=s.provider||"auto";
 return p==="auto"||p==="free"?"自动模式":(WORK_PROVIDER_SHORT[p]||WORK_PROVIDER_NAMES[p]||p)+(s.model?" · "+s.model:"");
}
function updateWorkSelectedModel(){
 const label=$("workSelectedModel");if(!label)return;
 const {index,step}=currentWorkStage(),future=S.workStages.slice(index);
 const same=future.every(s=>s.provider===step.provider&&s.model===step.model);
 const name=currentWorkModelName();label.textContent=name+(same?"":" · 多模型接力");
 const title=$("workCurrentModelName"),note=$("workCurrentModelNote");
 if(title)title.textContent=name;
 if(note){
  const automatic=step.provider==="auto"||step.provider==="free";
  const last=String(S.workDetail?.task?.model||"");
  note.textContent=(automatic?"实际免费模型由线路自动选择":"当前阶段已选择具体模型")+(same?"":" · 后续阶段可不同")+
   (S.workDetail?.steps?.length&&last&&last!=="free:auto"?" · 上次执行："+last:"");
 }
 updateComposerModel();
}
async function chooseDedicatedWorkModel(provider,model){
 if(S.workBusy||S.workDetail?.task?.status==="running"){$("workModelMessage").textContent="执行中不能更改模型";return}
 if(provider!=="free"){
  const record=S.savedProviders[provider];
  if(!record?.verified||!(record.consent||isFreeModel(provider,model))){
   hide("workModelDialog");openKeyPanel(provider,"workModelDialog");return;
  }
  if(!model||!/^[a-zA-Z0-9][a-zA-Z0-9._:/@+\[\]-]{0,159}$/.test(model)){
   $("workModelMessage").textContent="请选择有效的官方模型 ID";return;
  }
 }
 if(["completed","cancelled"].includes(S.workDetail?.task?.status))newWorkDraft();
 if(!S.workStages.length)resetWorkPlan();
 const before=S.workStages.map(s=>({...s})),beforeFallback=S.workFallback,start=S.workDetail?.task?.nextStep||0;
 S.workFallback=provider==="free";
 for(let i=start;i<S.workStages.length;i++){
  S.workStages[i].provider=provider==="free"?"auto":provider;
  S.workStages[i].model=provider==="free"?"":model;
 }
 renderWorkEditor();updateWorkSelectedModel();
 if(S.workTaskId&&["pending","paused"].includes(S.workDetail?.task?.status)){
  $("workModelMessage").textContent="正在保存到工作任务…";
  const promise=saveWorkConfiguration();pendingWorkModelSave=promise;
  let ok=false;try{ok=await promise}finally{if(pendingWorkModelSave===promise)pendingWorkModelSave=null}
  if(!ok){
   S.workStages=before;S.workFallback=beforeFallback;renderWorkEditor();updateWorkSelectedModel();
   $("workModelMessage").textContent="未保存，已恢复先前选择";return;
  }
 }
 rememberWorkModelSelection(provider,model);
 $("workModelMessage").textContent="";hide("workModelDialog");updateWorkSelectedModel();
}
function renderWorkProviderModels(provider){
 const panel=$("workSpecificChooser");panel.hidden=false;panel.replaceChildren();
 const record=S.savedProviders[provider],models=workModelsFor(provider);
 const active=currentWorkStage().step;
 let chosen=active.provider===provider&&active.model?active.model:record?.model||models[0]?.id||"";
 const title=node("div","work-choose-head");
 title.append(node("strong","",WORK_PROVIDER_NAMES[provider]||provider),node("small","","只对工作任务生效"));
 const control=workModelPicker(provider,chosen,value=>{chosen=value},false);
 const apply=node("button","work-model-apply","使用此模型");
 apply.type="button";apply.addEventListener("click",()=>void chooseDedicatedWorkModel(provider,chosen));
 panel.append(title,control,apply);panel.scrollIntoView({block:"nearest"});
}
function renderWorkAgentCatalog(){
 updateWorkSelectedModel();
 const target=$("workAgentCatalog");target.replaceChildren();
 const regions=["推荐","中国","国际","俄罗斯"];
 const regionMap={
  推荐:["free","groq","openrouter","deepseek","yandex","gigachat"],
  中国:["free","qwen","deepseek","zhipu","kimi","minimax","siliconflow","doubao","qianfan","hunyuan","stepfun","xiaomi","longcat","baichuan","iflytek","sensetime","novai_pro"],
  国际:["free","groq","openrouter","cerebras","openai","claude","novai","grok","gemini"],
  俄罗斯:["yandex","gigachat"]
 };
 if(!regions.includes(S.workModelRegion))S.workModelRegion="推荐";
 const selector=node("div","work-region-tabs");
 for(const region of regions){
  const button=node("button","work-region-tab"+(S.workModelRegion===region?" active":""));
  button.type="button";button.textContent=region;
  button.setAttribute("aria-pressed",String(S.workModelRegion===region));
  button.addEventListener("click",()=>{
   S.workModelRegion=region;S.workPickingProvider="";$("workSpecificChooser").hidden=true;
   $("workModelMessage").textContent="";
   renderWorkAgentCatalog();
  });
  selector.append(button);
 }
 target.append(selector);
 const grid=node("div","work-region-models");
 for(const provider of regionMap[S.workModelRegion]){
  const name=provider==="free"?"自动模式":WORK_PROVIDER_NAMES[provider];
  const record=S.savedProviders[provider];
  const ready=provider==="free"||!!record?.verified&&(!!record.consent||isFreeModel(provider,record.model));
  const active=currentWorkStage().step;
  const selected=provider==="free"?(!active.provider||active.provider==="auto"||active.provider==="free"):active.provider===provider;
  const button=node("button","work-model-option "+(ready?"ready":"connect")+(selected?" selected":""));
  button.type="button";button.setAttribute("aria-pressed",String(selected));
  const top=node("span","work-model-option-head");
  top.append(node("strong","",WORK_PROVIDER_SHORT[provider]||name),node("span","work-model-option-action",selected?"✓ 当前使用":ready?"选择":"连接"));
  button.append(top,node("small","",selected?(provider==="free"?"自动匹配站内直接免费模型":"已选模型："+(active.model||record?.model||"未指定")):provider==="free"?"自动调用真实免费线路":ready?"已验证连接 · 点击选择模型":record?"需要验证连接或授权":"连接官方 API 后使用"));button.title=selected?(provider==="free"?"当前使用：免费自动线路":"当前使用："+name+" / "+(active.model||record?.model||"未指定")):name;
  button.addEventListener("click",()=>{
   if(S.workBusy||S.workDetail?.task?.status==="running"){$("workModelMessage").textContent="当前任务正在执行，不能更换模型";return}
   if(!ready){hide("workModelDialog");openKeyPanel(provider,"workModelDialog");return}
   if(provider==="free"){void chooseDedicatedWorkModel("free","");return}
   S.workPickingProvider=provider;renderWorkProviderModels(provider);
   // Fetch only after an actual user click, not on each render or dialog open.
   if(S.savedProviders[provider]&&S.workCatalogLoading?.[provider]!=="done"&&S.workCatalogLoading?.[provider]!=="busy"){
    if(!S.workCatalogLoading)S.workCatalogLoading={};
    S.workCatalogLoading[provider]="busy";
    $("workModelMessage").textContent="正在读取已连接的官方模型…";
    void api("/api/connections/"+provider+"/models",{}).then(data=>{
     if(!Array.isArray(data.models)||!data.models.length)throw Error("没有获取到可用模型");
     S.connected[provider]=data.models;
     S.workCatalogLoading[provider]="done";
     if($("workModelDialog").open&&!$("workSpecificChooser").hidden&&S.workPickingProvider===provider){
      renderWorkProviderModels(provider);$("workModelMessage").textContent="";
     }
    }).catch(e=>{
     S.workCatalogLoading[provider]="error";
     $("workModelMessage").textContent=humanError(e);
    });
   }
  });
  grid.append(button);
 }
 target.append(grid);
 if(S.workModelRegion==="俄罗斯"){
  const details=node("div","russian-model-guide");
  details.append(node("strong","","俄罗斯官方模型"));
  details.append(node("p","","YandexGPT Pro 5.1 · Alice AI LLM · Alice AI LLM Flash · GigaChat"));
  details.append(node("small","","Yandex 需要 API Key 与 Folder ID；GigaChat 需要项目授权密钥。官方模型列表只有连接验证后才能选择和执行。"));
  details.append(node("small","","原有俄罗斯工作产品：GigaAgent · GigaCowork · GigaCode · Alice AI Agents。它们不是独立模型 API，不冒充本站可执行代理。"));
  target.append(details);
 }
}
function workModelStorageKey(userId){return "aigzt:work-model:v1:"+String(userId)}
function restoreWorkModelSelection(){
 const owner=String(S.user?.id||"");if(!owner||restoredWorkModelOwner===owner)return;
 restoredWorkModelOwner=owner;workModelPreference=null;
 try{const p=JSON.parse(localStorage.getItem(workModelStorageKey(owner))||"null");if(p&&typeof p.provider==="string"&&(p.provider==="auto"||Object.hasOwn(WORK_PROVIDER_NAMES,p.provider))&&typeof p.model==="string"&&p.model.length<=180&&(p.provider==="auto"||p.model))workModelPreference=p}catch{}
 if(!S.workTaskId)resetWorkPlan();
}
function rememberWorkModelSelection(provider,model){
 workModelPreference={provider:provider==="free"?"auto":provider,model:provider==="free"?"":model};
 if(S.user?.id)try{localStorage.setItem(workModelStorageKey(S.user.id),JSON.stringify(workModelPreference))}catch{}
}
function resetWorkPlan(){
 S.workStages=[
  {name:"规划",instruction:"理解需求，明确任务与交付内容",provider:"auto",model:""},
  {name:"制作",instruction:"根据规划完成可用成果",provider:"auto",model:""},
  {name:"检查交付",instruction:"核对并修正问题，提供最终成果",provider:"auto",model:""}
 ];
 const selection=workModelPreference||{provider:"auto",model:""};
 S.workStages=S.workStages.map(stage=>({...stage,...selection}));
 S.workRoutes=[];S.workFallback=selection.provider==="auto";
}
function chooseWorkProvider(value,auto=false){
 const select=node("select","work-provider");
 const options=auto?[["auto","自动选择"],...Object.entries(WORK_PROVIDER_NAMES)]:Object.entries(WORK_PROVIDER_NAMES);
 for(const [id,name] of options){
  const opt=node("option","",name+(id!=="free"&&id!=="auto"&&!connected(id)?" · 未连接":""));
  opt.value=id;select.append(opt);
 }
 select.value=value;return select;
}

function workModelsFor(provider){
 if(provider==="auto")return [];
 if(provider==="free")return S.freeModels.length?S.freeModels.map(m=>({id:m.id,name:m.name})):
 [{id:"free:auto",name:"免费自动"}];
 const models=new Map();
 const add=(m)=>{if(m&&typeof m.id==="string"&&m.id.trim()&&!models.has(m.id))models.set(m.id,{id:m.id,name:typeof m.name==="string"&&m.name.trim()?m.name:m.id})};
 if(provider==="openrouter")for(const m of S.remoteModels)add(m);
 for(const m of S.connected[provider]||[])add(m);
 const saved=S.savedProviders[provider]?.model;
 if(saved&&!models.has(saved))add({id:saved,name:saved+"（已保存，需验证）"});
 return [...models.values()];
}
function ensureWorkProviderCatalog(provider){
 if(!provider||["auto","free"].includes(provider)||!S.savedProviders[provider])return;
 if(!S.workCatalogLoading)S.workCatalogLoading={};
 if(S.workCatalogLoading[provider])return;
 S.workCatalogLoading[provider]="busy";
 void api("/api/connections/"+provider+"/models",{}).then(d=>{
  S.workCatalogLoading[provider]="done";
  if(Array.isArray(d.models)&&d.models.length)S.connected[provider]=d.models;
  if(S.workMode)renderWorkEditor();
 }).catch(()=>{S.workCatalogLoading[provider]="error"});
}
function workModelPicker(provider,selected,update,disabled){
 const holder=node("div","work-specific-model");
 if(provider==="auto"){
  holder.append(node("span","work-model-explainer","自动接力（按当前任务授权）"));return holder;
 }
 const catalog=workModelsFor(provider),choice=node("select","work-model-select");
 choice.disabled=disabled;
 const place=node("option","",provider==="free"?"请选择免费接口":"请选择真实模型");
 place.value="";choice.append(place);
 const known=catalog.some(m=>m.id===selected);
 if(selected&&!known){
  const customOpt=node("option","",selected+"（自定义，未验证）");
  customOpt.value=selected;choice.append(customOpt);
 }
 for(const m of catalog.slice(0,500)){
  const label=m.name===m.id?m.id:m.name+" · "+m.id;
  const opt=node("option","",label);opt.value=m.id;choice.append(opt);
 }
 const custom=node("option","","输入官方模型 ID…");custom.value="__manual";choice.append(custom);
 const input=node("input","work-model-manual");
 input.type="text";input.maxLength=160;input.placeholder="填写该平台官方模型 ID";input.autocomplete="off";input.disabled=disabled;
 input.hidden=!selected||known;input.value=selected&&!known?selected:"";
 choice.value=selected||"";
 choice.addEventListener("change",()=>{
  if(choice.value==="__manual"){input.hidden=false;input.value="";update("");input.focus()}
  else{input.hidden=true;input.value="";update(choice.value)}
 });
 input.addEventListener("input",()=>update(input.value.trim()));
 const note=node("small","work-model-hint",provider==="free"?"免费接口不是具体模型，真实底层模型可能变化":
   !connected(provider)?"此 API 尚未连接；不能参与自动接力":
   catalog.length?"模型名称与 ID 来自当前服务商的模型目录":"未获取到模型目录，请输入官方模型 ID");
 holder.append(choice,input,note);return holder;
}
function workModelHints(){
 if(S.workMode)renderWorkEditor();
}

function renderWorkEditor(){
 const locked=S.workBusy||S.workDetail?.task?.status==="running"||["completed","cancelled"].includes(S.workDetail?.task?.status);
 const completed=S.workDetail?.task?.nextStep||0;
 const stageBox=$("workStageEditor");stageBox.replaceChildren();
 for(const [i,item] of S.workStages.entries()){
  const row=node("div","work-config-row"),head=node("div","work-config-row-head");
  head.append(node("strong","",String(i+1)+" · "+(item.name||"步骤")));
  const del=node("button","work-remove","删除");del.type="button";del.disabled=locked||i<completed||S.workStages.length<=1;
  del.addEventListener("click",()=>{S.workStages.splice(i,1);renderWorkEditor()});head.append(del);
  const title=node("input","work-stage-title");title.maxLength=36;title.placeholder="阶段名称";title.value=item.name;
  title.disabled=locked||i<completed;title.addEventListener("input",()=>{item.name=title.value;head.querySelector("strong").textContent=(i+1)+" · "+title.value});
  const instructions=node("textarea","work-stage-notes");instructions.rows=2;instructions.maxLength=700;instructions.placeholder="这个 AI 需要完成什么？";instructions.value=item.instruction;
  instructions.disabled=locked||i<completed;instructions.addEventListener("input",()=>{item.instruction=instructions.value});
  const rowModel=node("div","work-stage-model"),provider=chooseWorkProvider(item.provider,true);
  provider.disabled=locked||i<completed;
  provider.setAttribute("aria-label","选择 API 服务商");
  provider.addEventListener("change",()=>{
   item.provider=provider.value;
   item.model=item.provider==="free"?"free:auto":item.provider==="auto"?"":S.savedProviders[item.provider]?.model||"";
   ensureWorkProviderCatalog(item.provider);
   renderWorkEditor();
  });
  const model=workModelPicker(item.provider,item.model,v=>item.model=v,locked||i<completed);
  rowModel.append(provider,model);
  row.append(head,title,instructions,rowModel);stageBox.append(row);
 }
 $("workAddStage").disabled=locked||S.workStages.length>=12;
 $("workSaveConfig").disabled=locked;
 $("workConfigSummary").textContent=S.workStages.length+" 个步骤 · 手动模型不自动切换";
 updateWorkSelectedModel();
}
function newWorkDraft(){
 if(S.workBusy)return;
 S.workTaskId=null;S.workDetail=null;resetWorkPlan();renderWorkDetail();renderWorkTasks();renderProjects();renderWorkEditor();if(S.workMode)renderWorkAgentCatalog();
 $("workConfigMessage").textContent="已准备新任务";$("prompt").value="";$("workConfig").open=false;$("workScroll").scrollTop=0;
}
function loadWorkEditor(task){
 S.workStages=Array.isArray(task?.steps)&&task.steps.length?task.steps.map(x=>({...x})):[];if(!S.workStages.length)resetWorkPlan();
 S.workRoutes=Array.isArray(task?.routes)?task.routes.map(x=>({...x})):[];
 S.workFallback=task?.fallback!==false;
 renderWorkEditor();
}
let pendingWorkModelSave=null;
async function saveWorkConfiguration(){
 const id=S.workTaskId;
 if(!id){$("workConfigMessage").textContent="已准备好，新任务发送时自动保存";return true}
 if(!S.workStages.length){$("workConfigMessage").textContent="至少保留一个步骤";return false}
 const payload={steps:S.workStages,routes:[],fallback:false};
 $("workSaveConfig").disabled=true;$("workContinue").disabled=true;
 try{const d=await api("/api/work/tasks/"+id+"/configure",payload);S.workDetail=d;renderWorkDetail();$("workConfigMessage").textContent="已保存到当前任务";return true}
 catch(e){$("workConfigMessage").textContent="模型配置保存失败："+humanError(e);return false}
 finally{renderWorkEditor();$("workContinue").disabled=S.workBusy}
}
function initDomesticProviderLinks(){
 const el=$("domesticProviderList"),options=Array.from($("keyProvider").options);
 const signature=options.map(o=>o.value+":"+Boolean(S.savedProviders[o.value])).join("|");
 if(el.dataset.signature===signature)return;el.dataset.signature=signature;el.replaceChildren();
 for(const kind of ["official","third"]){
  const heading=node("div","provider-picker-heading",kind==="official"?"官方直连":"第三方");
  const grid=node("div","provider-picker-grid");
  for(const o of options.filter(o=>providerRoute(o.value)===kind)){
   const id=o.value,b=node("button","provider-picker-option");b.type="button";
   const info=node("span","provider-picker-info");info.append(node("strong","",o.textContent),node("small","",connected(id)?"密钥已保存":providerRouteLabel(id)));
   b.append(providerLogo(id),info);b.addEventListener("click",()=>{hide("modelDialog");openKeyPanel(id,"modelDialog")});grid.append(b);
  }el.append(heading,grid);
 }
}



const CURATED_FREE_TOOLS=[{"provider":"PromptHero","name":"PromptHero · 提示词库","category":"作图","categories":["作图","视频","搜索","写作"],"url":"https://prompthero.com/","features":["图片提示词","视频提示词","创作灵感"],"access":"free","note":"免费浏览公开提示词；高级功能按原站收费。","verified":true,"aliases":["Prompt Hero","提示词"]},{"provider":"Unlimited AI","name":"Unlimited AI · 中文聊天","category":"聊天","categories":["聊天","综合","写作"],"url":"https://app.unlimitedai.chat/zh","features":["中文对话","故事创作"],"access":"free","guest":true,"login":"原站标注免登录","note":"标准模型有免费入口，VIP 功能及实际额度以原站为准。","verified":true,"aliases":["Unlimited AI Chat","无限AI"]},{"provider":"Venice AI","name":"Venice Agent · 智能体","category":"聊天","categories":["聊天","智能体","角色"],"url":"https://venice.ai/chat/agent/B2AcOHq","features":["智能体对话"],"access":"daily","login":"以原站为准","note":"用户提供的专属智能体直达链接，智能体访问权限及免费额度以原站为准。","aliases":["Venice","B2AcOHq"]},{"provider":"Venice AI","name":"Venice · 自由聊天","category":"聊天","categories":["聊天","角色","综合"],"url":"https://venice.ai/ai-tools/ai-chat","features":["私密聊天","开放创作","多模型"],"access":"daily","login":"需登录","note":"免费档约10次文本提问/天，部分模型功能收费。","featured":true,"verified":true,"policy":"开放创作"},{"provider":"Venice AI","name":"Venice · AI 作图","category":"作图","categories":["作图","综合"],"url":"https://venice.ai/ai-tools/ai-image-generator","features":["文生图","私密作图","开放创作"],"access":"daily","login":"需登录","note":"免费档约15次图片提示/天，高级功能可能收费。","featured":true,"verified":true,"policy":"开放创作"},{"provider":"Venice AI","name":"Venice · 图片编辑","category":"图生图","categories":["图生图","修图"],"url":"https://venice.ai/ai-tools/ai-photo-editor","features":["图生图","提示词修图","开放创作"],"access":"daily","login":"需登录","note":"共用免费图片额度，部分图片编辑能力需要订阅。","featured":false,"verified":true,"policy":"开放创作"},{"provider":"Mage","name":"Mage · 多模型作图","category":"作图","categories":["作图","综合"],"url":"https://www.mage.space/ai-image-generator","features":["多模型","文生图","写实与动漫"],"access":"trial","login":"按官网要求","note":"可使用初始免费Gems，不同模型费用不同。","featured":true,"verified":true},{"provider":"Mage","name":"Mage · 图生图","category":"图生图","categories":["图生图","修图"],"url":"https://www.mage.space/ai-image-to-image-generator","features":["图像变体","上传参考图","图片重绘"],"access":"trial","login":"按官网要求","note":"免费开始，后续按模型消耗Gems。","featured":false,"verified":true},{"provider":"Viggle","name":"Viggle · 图片转视频","category":"视频","categories":["视频","图生图","角色"],"url":"https://viggle.ai/tools/image-to-video-ai/","features":["图生视频","动作迁移","角色动画"],"access":"daily","login":"需登录","note":"官网说明免费账号约5条视频/天，免费导出带水印。","featured":true,"verified":true},{"provider":"Viggle","name":"Viggle · 图片动画","category":"视频","categories":["视频","角色"],"url":"https://viggle.ai/tools/ai-image-animator/","features":["人物动效","动作模板","照片动画"],"access":"daily","login":"需登录","note":"免费额度每日刷新；高质量导出有限制。","featured":false,"verified":true},{"provider":"PixVerse","name":"PixVerse · AI 视频","category":"视频","categories":["视频","综合"],"url":"https://pixverse.ai/en/product/ai-video-generator","features":["文生视频","镜头控制","视频效果"],"access":"daily","login":"需登录","note":"有免费积分，复杂视频和部分模型可能需要付费。","featured":false,"verified":true},{"provider":"PixVerse","name":"PixVerse · 图生视频","category":"视频","categories":["视频","图生图"],"url":"https://pixverse.ai/en/product/image-to-video","features":["图生视频","照片运动","镜头动画"],"access":"daily","login":"需登录","note":"每天免费积分，生成门槛随模型变化。","featured":false,"verified":true},{"provider":"Recraft","name":"Recraft · 图片设计","category":"作图","categories":["作图","修图"],"url":"https://www.recraft.ai/ai-image-generator","features":["文生图","文字海报","创意设计"],"access":"daily","login":"需登录","note":"免费账户有每日积分，部分作品限非商业用途。","featured":false,"verified":true},{"provider":"Recraft","name":"Recraft · 图片编辑","category":"图生图","categories":["图生图","修图"],"url":"https://www.recraft.ai/ai-photo-editor","features":["上传照片","自然语言修图","局部编辑"],"access":"daily","login":"需登录","note":"免费图像编辑与生成共用每日积分。","featured":false,"verified":true},{"provider":"Recraft","name":"Recraft · SVG 矢量图","category":"作图","categories":["作图","修图"],"url":"https://www.recraft.ai/vector-editor","features":["矢量图","SVG","设计素材"],"access":"daily","login":"需登录","note":"免费每日积分，商用权限和导出限制以套餐为准。","featured":false,"verified":true},{"provider":"Leonardo AI","name":"Leonardo · 创意生图","category":"作图","categories":["作图","图生图"],"url":"https://leonardo.ai/","features":["艺术作图","图像变体","风格生成"],"access":"daily","login":"需登录","note":"官方免费档有每日Token，高级模型付费。","featured":false,"verified":true},{"provider":"Ideogram","name":"Ideogram · 文字海报","category":"作图","categories":["作图","修图"],"url":"https://ideogram.ai/","features":["文字入图","海报","LOGO"],"access":"daily","login":"需登录","note":"符合条件的账号可获每周免费积分，注册渠道可能影响资格。","featured":false,"verified":true},{"provider":"SeaArt","name":"SeaArt · 图片视频创作","category":"综合","categories":["综合","作图","图生图","视频","修图"],"url":"https://www.seaart.ai/","features":["AI作图","图生视频","图片处理"],"access":"daily","login":"需登录","note":"免费每日体力或积分，具体模型各有消耗。","featured":false,"verified":true},{"provider":"Tensor.Art","name":"Tensor.Art · 模型画廊","category":"作图","categories":["作图","图生图","视频"],"url":"https://tensor.art/","features":["LoRA","模型作图","图生图"],"access":"daily","login":"需登录","note":"每日免费Energy，视频免费活动可能临时变化。","featured":false,"verified":true},{"provider":"Qwen Studio","name":"千问 · 聊天与作图","category":"聊天","categories":["聊天","作图","综合"],"url":"https://chat.qwen.ai/","features":["中文聊天","图片生成","多模态"],"access":"free","login":"按官网要求","note":"提供基础免费体验，模型和地区可能设限。","featured":false,"verified":true},{"provider":"Qwen Studio","name":"千问 · 图片编辑","category":"图生图","categories":["图生图","修图"],"url":"https://chat.qwen.ai/?inputFeature=image_edit","features":["中文修图","图像编辑","上传图片"],"access":"free","login":"按官网要求","note":"千问官方图像编辑入口，登录要求按网页提示。","featured":false,"verified":true},{"provider":"Character.AI","name":"Character.AI · 角色聊天","category":"聊天","categories":["聊天","角色"],"url":"https://character.ai/","features":["角色扮演","人物互动","故事对话"],"access":"free","login":"需登录","note":"基础消息聊天免费，并非无审核服务。","featured":false,"verified":true},{"provider":"Janitor","name":"Janitor · 角色互动","category":"角色","categories":["角色","聊天"],"url":"https://jani.com/","features":["社区角色","情景对话","自建人物"],"access":"free","login":"需登录","note":"Janitor 官方站点，模型和付费条件依使用方式决定。","featured":false,"verified":true},{"provider":"KoboldAI","name":"KoboldAI Lite · 社区聊天","category":"聊天","categories":["聊天","角色","写作"],"url":"https://lite.koboldai.net/","features":["AI Horde","自由聊天","故事写作"],"access":"community","login":"可直接体验","note":"社区志愿者模型可能排队，私密内容不要直接提交。","featured":false,"verified":true},{"provider":"Marvis AI","name":"Marvis · 免费视频体验","category":"视频","categories":["视频"],"url":"https://ai.jxzhihi.com/","features":["文生视频","短视频","免注册"],"access":"trial","login":"可直接体验","note":"官方说明无需注册即可免费尝试，但个人GPU可能排队。","featured":false,"verified":true},{"provider":"Hugging Face","name":"Qwen · 图像编辑演示","category":"图生图","categories":["图生图","修图"],"url":"https://huggingface.co/spaces/Qwen/Qwen-Image-Edit","features":["Qwen修图","图像编辑","社区演示"],"access":"community","login":"按官网要求","note":"第三方Space可能休眠排队或要求登录。","featured":false,"verified":true},{"provider":"Hugging Face","name":"Real-ESRGAN · 图片增强","category":"修图","categories":["修图"],"url":"https://huggingface.co/spaces/akhaliq/Real-ESRGAN","features":["高清放大","照片增强","清晰化"],"access":"community","login":"按官网要求","note":"社区Space可能休眠或暂停推理。","featured":false,"verified":true},{"provider":"Runway","name":"Runway · 视频试用","category":"视频","categories":["视频","图生图"],"url":"https://app.runwayml.com/","features":["文生视频","图生视频","视频编辑"],"access":"trial","login":"需登录","note":"免费计划主要为一次性试用积分，很多模型不在免费档。","featured":false,"verified":true},{"provider":"Luma","name":"Luma · Dream Machine","category":"视频","categories":["视频","图生图"],"url":"https://lumalabs.ai/dream-machine","features":["图转视频","镜头运动","短片生成"],"access":"trial","login":"需登录","note":"免费档有严格限制，功能和商用授权按官网规则。","featured":false,"verified":true}];
const VERIFIED_ADDITIONAL_FREE_TOOLS=[{"name":"ChatGPT · AI 对话","provider":"OpenAI","category":"聊天","categories":["聊天"],"url":"https://chatgpt.com/","features":["AI 对话"],"access":"free","note":"支持地区可免登录基础对话；有额度限制，历史及高级功能需登录。","verified":true,"guest":true,"login":"部分地区免登录","source":"https://help.openai.com/en/articles/9125172-the-chatgpt-home-page"},{"name":"Claude · AI 写作与分析","provider":"Anthropic","category":"聊天","categories":["聊天"],"url":"https://claude.ai/","features":["AI 写作与分析"],"access":"free","note":"免费版有额度及地区限制","verified":true},{"name":"Gemini · Google AI 助手","provider":"Google","category":"聊天","categories":["聊天"],"url":"https://gemini.google.com/app","features":["Google AI 助手"],"access":"free","note":"支持地区及设备可使用基础访客聊天；部分功能需账号。","verified":true,"guest":true,"login":"部分地区免登录","source":"https://support.google.com/gemini/answer/13275745"},{"name":"DeepSeek · 免费 AI 对话","provider":"DeepSeek","category":"聊天","categories":["聊天"],"url":"https://chat.deepseek.com/","features":["免费 AI 对话"],"access":"free","note":"提供免费网页聊天","verified":true},{"name":"Mistral Vibe · AI 聊天与工作","provider":"Mistral AI","category":"聊天","categories":["聊天"],"url":"https://chat.mistral.ai/","features":["AI 聊天与工作"],"access":"free","note":"原 Le Chat；免费版有限额","verified":true},{"name":"Perplexity · AI 搜索问答","provider":"Perplexity","category":"综合","categories":["综合","聊天"],"url":"https://www.perplexity.ai/","features":["AI 搜索问答"],"access":"free","note":"免费基础搜索，访客可用性因地区及版本变化，可能需要登录。","verified":true,"login":"访客待核实"},{"name":"Microsoft Copilot · AI 搜索与聊天","provider":"Microsoft","category":"聊天","categories":["聊天"],"url":"https://copilot.microsoft.com/","features":["AI 搜索与聊天"],"access":"free","note":"部分功能需登录","verified":true},{"name":"Gemini Notebook · 资料研究助手","provider":"Google","category":"写作","categories":["写作"],"url":"https://notebooklm.google.com/","features":["资料研究助手"],"access":"free","note":"原 NotebookLM，额度有限","verified":true},{"name":"Hugging Face · AI 工具演示馆","provider":"Hugging Face","category":"目录","categories":["目录"],"url":"https://huggingface.co/spaces","features":["AI 工具演示馆"],"access":"community","note":"社区演示各有使用规则","verified":true},{"name":"Bing Image Creator · 免费 AI 生图","provider":"Microsoft","category":"作图","categories":["作图"],"url":"https://www.bing.com/images/create","features":["免费 AI 生图"],"access":"free","note":"登录微软账号，额度与速度受限","verified":true},{"name":"Canva · AI 设计与海报","provider":"Canva","category":"作图","categories":["作图"],"url":"https://www.canva.com/","features":["AI 设计与海报"],"access":"free","note":"免费设计与有限 AI 额度","verified":true},{"name":"Adobe Firefly · AI 图像创作","provider":"Adobe","category":"作图","categories":["作图"],"url":"https://firefly.adobe.com/","features":["AI 图像创作"],"access":"trial","note":"免费试用额度有限","verified":true},{"name":"Photopea · 在线 PSD 修图","provider":"Photopea","category":"修图","categories":["修图"],"url":"https://www.photopea.com/","features":["在线 PSD 修图"],"access":"free","note":"在线免费编辑","verified":true},{"name":"Pixlr Editor · 高级图片编辑","provider":"Pixlr","category":"修图","categories":["修图"],"url":"https://pixlr.com/editor/","features":["高级图片编辑"],"access":"free","note":"免费基础功能","verified":true},{"name":"Pixlr Express · 快捷 AI 修图","provider":"Pixlr","category":"修图","categories":["修图"],"url":"https://pixlr.com/express/","features":["快捷 AI 修图"],"access":"free","note":"免费基础功能","verified":true},{"name":"remove.bg · 智能图片抠图","provider":"remove.bg","category":"修图","categories":["修图"],"url":"https://www.remove.bg/","features":["智能图片抠图"],"access":"free","note":"低清免费，高清需付费","verified":true},{"name":"Cleanup.pictures · 图片物体消除","provider":"Cleanup.pictures","category":"修图","categories":["修图"],"url":"https://cleanup.pictures/","features":["图片物体消除"],"access":"free","note":"免费版有分辨率限制","verified":true},{"name":"Upscale.media · AI 照片增强","provider":"Upscale.media","category":"修图","categories":["修图"],"url":"https://www.upscale.media/","features":["AI 照片增强"],"access":"free","note":"免费使用有次数限制","verified":true},{"name":"Pixelcut · AI 图片放大","provider":"Pixelcut","category":"修图","categories":["修图"],"url":"https://www.pixelcut.ai/image-upscaler","features":["AI 图片放大"],"access":"free","note":"提供免费放大","verified":true},{"name":"Pixelcut · AI 扩图","provider":"Pixelcut","category":"图生图","categories":["图生图"],"url":"https://www.pixelcut.ai/uncrop","features":["AI 扩图"],"access":"free","note":"每日免费额度有限","verified":true},{"name":"Pika · AI 视频创作","provider":"Pika","category":"视频","categories":["视频"],"url":"https://pika.art/","features":["AI 视频创作"],"access":"free","note":"每月免费积分有限","verified":true},{"name":"Clipchamp · 在线视频剪辑","provider":"Microsoft","category":"视频","categories":["视频"],"url":"https://clipchamp.com/en/video-editor/","features":["在线视频剪辑"],"access":"free","note":"基本视频编辑与1080p导出免费","verified":true},{"name":"CapCut · AI 视频剪辑","provider":"CapCut","category":"视频","categories":["视频"],"url":"https://www.capcut.com/features/free-ai-video-editor","features":["AI 视频剪辑"],"access":"free","note":"免费编辑，部分素材收费","verified":true},{"name":"Suno · AI 音乐生成","provider":"Suno","category":"音频","categories":["音频"],"url":"https://suno.com/","features":["AI 音乐生成"],"access":"free","note":"免费额度有限，不含商业使用权","verified":true},{"name":"ElevenLabs · AI 语音朗读","provider":"ElevenLabs","category":"音频","categories":["音频"],"url":"https://elevenlabs.io/text-to-speech","features":["AI 语音朗读"],"access":"free","note":"免费额度有限，商用需付费","verified":true},{"name":"TTSMaker · 免费文字转语音","provider":"TTSMaker","category":"音频","categories":["音频"],"url":"https://ttsmaker.com/","features":["免费文字转语音"],"access":"free","note":"有字数限制","verified":true},{"name":"ttsMP3 · 文字朗读 MP3","provider":"ttsMP3","category":"音频","categories":["音频"],"url":"https://ttsmp3.com/","features":["文字朗读 MP3"],"access":"free","note":"有每日字符限制","verified":true},{"name":"Gamma · AI 幻灯片","provider":"Gamma","category":"写作","categories":["写作"],"url":"https://gamma.app/","features":["AI 幻灯片"],"access":"free","note":"免费生成额度有限","verified":true},{"name":"Napkin AI · 文字转信息图","provider":"Napkin AI","category":"作图","categories":["作图"],"url":"https://www.napkin.ai/","features":["文字转信息图"],"access":"free","note":"免费额度有限","verified":true},{"name":"DeepL Write · AI 润色改写","provider":"DeepL","category":"写作","categories":["写作"],"url":"https://www.deepl.com/write","features":["AI 润色改写"],"access":"free","note":"免费版有功能限制","verified":true},{"name":"LanguageTool · 语法纠错","provider":"LanguageTool","category":"写作","categories":["写作"],"url":"https://languagetool.org/","features":["语法纠错"],"access":"free","note":"免费基础纠错","verified":true},{"name":"QuillBot · 文章改写","provider":"QuillBot","category":"写作","categories":["写作"],"url":"https://quillbot.com/paraphrasing-tool","features":["文章改写"],"access":"free","note":"免费基础改写","verified":true},{"name":"GitHub Copilot · AI 编程助手","provider":"GitHub","category":"编程","categories":["编程"],"url":"https://github.com/features/copilot","features":["AI 编程助手"],"access":"free","note":"免费版有月度额度限制","verified":true},{"name":"Google AI Studio · AI 模型试验","provider":"Google","category":"编程","categories":["编程"],"url":"https://aistudio.google.com/","features":["AI 模型试验"],"access":"free","note":"免费使用与地区限额","verified":true},{"name":"Excalidraw · 免费白板绘图","provider":"Excalidraw","category":"作图","categories":["作图"],"url":"https://excalidraw.com/","features":["免费白板绘图"],"access":"free","note":"无AI生成功能的免费白板","verified":true},{"name":"Figma · 在线 UI 设计","provider":"Figma","category":"作图","categories":["作图"],"url":"https://www.figma.com/","features":["在线 UI 设计"],"access":"free","note":"Starter 免费版有限制","verified":true},{"name":"Pixelcut · 免费 AI 文生图","provider":"Pixelcut","category":"作图","categories":["作图"],"url":"https://www.pixelcut.ai/ai-image-generator","features":["免费 AI 文生图"],"access":"free","note":"免费额度有限","verified":true}];
const ROLEPLAY_MEDIA_TOOLS=[{"provider":"Yollo AI","name":"Yollo · 角色聊天","category":"角色","categories":["角色","聊天","作图","视频"],"url":"https://www.yollo.ai/","features":["角色扮演","AI 图片","AI 视频"],"roleLabel":"聊天·图片·视频","access":"free","verified":true,"note":"官方宣称聊天、图片和视频有基础免费使用量，具体额度以网站显示为准。"},{"provider":"Bubio","name":"Bubio · 场景角色聊天","category":"角色","categories":["角色","聊天","作图","视频"],"url":"https://bubio.ai/roleplay-chat","features":["角色扮演","AI 图片","视频生成"],"roleLabel":"聊天·图视频积分","access":"trial","verified":true,"note":"注册可领取免费积分；图片、视频生成使用相应积分，免费额度有限。"},{"provider":"PolyBuzz","name":"PolyBuzz · 动态角色互动","category":"角色","categories":["角色","聊天","作图","视频"],"url":"https://www.polybuzz.ai/","features":["角色聊天","Live Photo","Live Video"],"roleLabel":"聊天·图片·视频","access":"trial","verified":true,"note":"官方活动称首张 Live Photo 和首个 Live Video 可免费；后续生成消耗 Coins，且需角色支持。"},{"provider":"DomoAI / Elymi","name":"Elymi · 场景角色互动","category":"角色","categories":["角色","聊天","作图","视频"],"url":"https://www.domoai.app/en/ai-tools/ai-character-chat","features":["角色聊天","角色生图","视频制作"],"roleLabel":"聊天免费·图视频积分","access":"free","verified":true,"note":"文字角色聊天免费；图片和视频消耗 Stars，可通过签到获得部分免费 Stars。"},{"provider":"Rabu AI","name":"Rabu · 故事角色聊天","category":"角色","categories":["角色","聊天","作图","视频"],"url":"https://rabu.ai/roleplay/ai-roleplay-chat","features":["角色聊天","角色图片","短视频"],"roleLabel":"聊天免费·媒体代币","access":"free","verified":true,"note":"广告支持的免费聊天每天约20条；生成图片和短视频消耗代币，不承诺媒体无限免费。"},{"provider":"Anione","name":"Anione · 动漫角色聊天","category":"角色","categories":["角色","聊天","作图","视频"],"url":"https://www.anione.me/","features":["动漫角色聊天","对话生图","图片动画"],"roleLabel":"聊天·图片·视频试用","access":"trial","verified":true,"note":"官网说明新账号有免费聊天和图片试用额度；视频动画可能需要额外积分或付费。"},{"provider":"Talkie","name":"Talkie · 角色语音聊天","category":"角色","categories":["角色","聊天","作图"],"url":"https://www.talkie-ai.com/","features":["角色聊天","角色图像","语音"],"roleLabel":"角色·图片·语音","access":"free","verified":true,"note":"提供免费角色聊天和人物创建；图片生成、视频功能的实际可用次数以账户权益为准。"},{"provider":"Joyland","name":"Joyland · 剧情角色聊天","category":"角色","categories":["角色","聊天","作图"],"url":"https://www.joyland.ai/","features":["角色剧情聊天","聊天中生图"],"roleLabel":"聊天·免费角色图片","access":"free","verified":true,"note":"官方文档支持聊天中生成角色图片；不标称免费角色视频。"},{"provider":"SpicyChat","name":"SpicyChat · 自由角色聊天","category":"角色","categories":["角色","聊天","作图"],"url":"https://spicychat.ai/","features":["剧情角色聊天","有限图片生成"],"roleLabel":"角色聊天·有限图片","access":"free","verified":true,"note":"未登录用户可以有限文本和图片生成；部分内容面向成年人，视频不属于已证实的免费功能。"},{"provider":"Nomi","name":"Nomi · 记忆角色聊天","category":"角色","categories":["角色","聊天","作图"],"url":"https://nomi.ai/","features":["长期角色记忆","每日自拍"],"roleLabel":"聊天·每日免费图片","access":"free","verified":true,"note":"官网说明免费账号可获每日有限图片；视频生成属于付费功能。"}];
/* External destinations remain links; no unverified API integration or paywall bypass. */
const VERIFIED_FREE_MEDIA_TOOLS=[
 {provider:"AICreate",name:"AICreate · 免费 AI 修图",category:"图生图",categories:["图生图","修图"],url:"https://aicreate.com/ai-photo-editor/",features:["参考图编辑","自然语言修图"],access:"free",login:"无需登录",note:"公开网页提供免费体验，受站点实际算力影响",verified:true},
 {provider:"Upsampler",name:"Upsampler · Qwen 图像编辑",category:"图生图",categories:["图生图","修图"],url:"https://upsampler.com/free-image-editing-model-no-signup",features:["Qwen Image Edit","参考图重绘"],access:"community",login:"按来源要求",note:"使用公共 GPU 可能排队或耗尽免费额度",verified:true},
 {provider:"Clipaist",name:"Clipaist · 免费图生图",category:"图生图",categories:["图生图","修图"],url:"https://www.clipaist.com/image-to-image/",features:["上传照片","提示词改图"],access:"daily",login:"无需登录",note:"公开页面标示每网络每日约15次，以实际为准",verified:true},
 {provider:"Free.ai",name:"Free.ai · AI 编辑图片",category:"图生图",categories:["图生图","修图"],url:"https://free.ai/image/edit/",features:["图片编辑","图生图"],access:"free",login:"网站规则",note:"免费池可能排队，部分模型需另购额度",verified:true},
 {provider:"ArtBot / AI Horde",name:"ArtBot · 社区免费绘图",category:"作图",categories:["作图","图生图"],url:"https://artbot.site/create",features:["文生图","参考图 img2img"],access:"community",login:"匿名可试",note:"志愿者算力，匿名优先级低并可能限流",verified:true},
 {provider:"Wan2.Video",name:"Wan2.Video · 免费视频",category:"视频",categories:["视频"],url:"https://wan2.video/free-ai-video-generator",features:["文生视频","图生视频"],access:"community",login:"无需登录",note:"公共 Hugging Face Space 可能排队或限额",verified:true},
 {provider:"Raphael",name:"Raphael · 免费 AI 视频",category:"视频",categories:["视频"],url:"https://raphael.app/ai-video-generator",features:["文生视频","图生视频"],access:"daily",login:"无需登录可体验",note:"免费生成受每日额度限制",verified:true},
 {provider:"Magic Hour",name:"Magic Hour · 图生视频",category:"视频",categories:["视频"],url:"https://magichour.ai/products/image-to-video",features:["图片动画","短视频"],access:"daily",login:"无需登录可体验",note:"官网提供有限免费生成次数",verified:true},
 {provider:"Free.ai",name:"Free.ai · 图生视频",category:"视频",categories:["视频"],url:"https://free.ai/video/image-to-video/",features:["上传图片","短视频"],access:"community",login:"按官网要求",note:"免费模型及排队情况可能变化",verified:true},
 {provider:"Magic Hour",name:"Magic Hour · 图生视频",category:"视频",categories:["视频"],url:"https://magichour.ai/products/image-to-video",features:["图生视频","短视频"],access:"daily",login:"按官网要求",note:"官方免费体验受每日生成次数和模型限制",verified:true}
];
const ORIGINAL_GENERATION_SITES=[
 {provider:"Krea 2",name:"Krea 2 · 原生作图",category:"作图",categories:["作图"],url:"https://krea-krea-2.hf.space/",features:["文生图","原始模型页面"],access:"community",note:"GZT 原始生成来源，是否在线以 Hugging Face Space 为准"},
 {provider:"GLM Image",name:"GLM Image · 图像生成",category:"作图",categories:["作图"],url:"https://multimodalart-glm-image.hf.space/",features:["GLM","原始模型页面"],access:"community",note:"GZT 图像生成来源，可能休眠或限流"},
 {provider:"RioShiina",name:"RioShiina · 图片生成",category:"作图",categories:["作图"],url:"https://rioshiina-imagegen.hf.space/",features:["AI 绘图","原始模型页面"],access:"community",note:"GZT 图像生成来源，上游状态可能变化"},
 {provider:"Vexa",name:"Vexa · 图片接口",category:"作图",categories:["作图"],url:"https://vexa-ai.pages.dev/",features:["免费生图","来源页面"],access:"community",note:"原始接口对应页面不一定提供交互式网页"},
 {provider:"AI Horde",name:"AI Horde · 免费图生图",category:"图生图",categories:["图生图","作图"],url:"https://aihorde.net/",features:["社区算力","生成服务"],access:"community",note:"这是社区服务主页；使用网页生成器可打开 ArtBot"},
 {provider:"ArtBot",name:"ArtBot · 图生图工具",category:"图生图",categories:["图生图","作图"],url:"https://artbot.site/create",features:["上传参考图","AI Horde 网页生成"],access:"community",note:"AI Horde 的网页客户端；志愿者算力可能排队"},
 {provider:"Wan Free",name:"Wan · 免费文生视频",category:"视频",categories:["视频"],url:"https://upsampler-wan-2-2-14b-text-to-video.hf.space/",features:["文生视频","原始模型页面"],access:"community",note:"实际生成能力受上游 ZeroGPU 额度限制"},
 {provider:"Wan I2V",name:"Wan · 免费图生视频",category:"视频",categories:["视频"],url:"https://zerogpu-aoti-wan2-2-fp8da-aoti-faster.hf.space/",features:["图生视频","原始模型页面"],access:"community",note:"共享 ZeroGPU 来源，可能无剩余额度"},
 {provider:"Wan Frame",name:"Wan · 免费首尾帧",category:"视频",categories:["视频"],url:"https://mcp-tools-wan-2-2-first-last-frame.hf.space/",features:["首尾帧生成","原始模型页面"],access:"community",note:"共享 ZeroGPU 来源，生成可能排队或失败"}
];
// Guest-access entries reflect published service information, not a live inference guarantee.
const GUEST_CHAT_TOOLS=[{"provider":"Lumo","name":"Lumo · 隐私聊天","category":"聊天","categories":["聊天"],"url":"https://lumo.proton.me/","features":["隐私聊天","写作"],"access":"free","login":"免注册体验","guest":true,"note":"官方支持免账号访客聊天，额度有限。","source":"https://proton.me/support/lumo-getting-started"},{"provider":"Brave","name":"Ask Brave · 联网问答","category":"聊天","categories":["聊天"],"url":"https://search.brave.com/","features":["联网问答","资料检索"],"access":"free","login":"免注册体验","guest":true,"note":"搜索首页切换 Ask，免费公开使用。","source":"https://brave.com/whats-new/ask-brave/"},{"provider":"Grok","name":"Grok · 访客聊天","category":"聊天","categories":["聊天"],"url":"https://grok.com/","features":["问答","联网搜索"],"access":"free","login":"免注册体验","guest":true,"note":"官方支持未登录使用；地区、功能和额度以实际页面为准。","source":"https://x.ai/legal/faq"},{"provider":"Venice AI","name":"Venice · 免登录体验","category":"聊天","categories":["聊天"],"url":"https://venice.ai/text-generation","features":["聊天","写作"],"access":"free","login":"免注册体验","guest":true,"note":"官方文字体验页可免注册试用，完整功能可能需账号。","source":"https://venice.ai/text-generation"},{"provider":"AskMe","name":"AskMe · 多语言问答","category":"聊天","categories":["聊天"],"url":"https://www.ask-me-ai.app/","features":["中文问答","写作","编程"],"access":"free","login":"免注册体验","guest":true,"note":"官网提供免登录聊天入口，免费用量以站点为准。","source":"https://www.ask-me-ai.app/"},{"provider":"ROK","name":"ROK · 聊天与代码","category":"聊天","categories":["聊天"],"url":"https://rok.rokteam.org/","features":["聊天","编程"],"access":"free","login":"免注册体验","guest":true,"note":"官网标示免注册基础聊天，进阶功能需账号。","source":"https://rok.rokteam.org/"},{"provider":"WKO AI","name":"WKO AI · 本地聊天","category":"聊天","categories":["聊天"],"url":"https://www.webkitonline.com/ai/chat/","features":["本地模型","Qwen","WebGPU"],"access":"free","login":"免注册体验","guest":true,"note":"浏览器本地运行，首次下载模型，需兼容设备及足够内存。","source":"https://webkitonline.com/free-llm-chat/"},{"provider":"Yiaho","name":"Yiaho · 免费问答","category":"聊天","categories":["聊天"],"url":"https://www.yiaho.com/en/ai/","features":["聊天","写作"],"access":"free","login":"免注册体验","guest":true,"note":"官网提供免注册聊天；第三方模型名称和额度以网站实际为准。","source":"https://www.yiaho.com/en/"}];
const MAINSTREAM_TOOL_ADDITIONS=[{"name":"Replit Agent","provider":"Replit","category":"编程","url":"https://replit.com/","access":"daily","categories":["编程","智能体"],"note":"原 Ghostwriter；Starter 免费额度有限","source":"https://replit.com/pricing","features":["编程","智能体"],"verified":true,"mainstream":true,"aliases":["Ghostwriter"]},{"name":"Tabnine","provider":"Tabnine","category":"编程","url":"https://www.tabnine.com/","access":"paid","categories":["编程"],"note":"原免费版不保证仍提供；按当前企业方案核实","source":"https://www.tabnine.com/pricing/","features":["编程"],"verified":true,"mainstream":true},{"name":"Jasper","provider":"Jasper","category":"写作","url":"https://www.jasper.ai/","access":"trial","categories":["写作","营销"],"note":"营销文案与品牌内容，试用后付费","source":"https://www.jasper.ai/pricing","features":["写作","营销"],"verified":true,"mainstream":true},{"name":"Grammarly","provider":"Grammarly","category":"写作","url":"https://www.grammarly.com/","access":"free","categories":["写作","办公"],"note":"基础拼写语法校正免费","source":"https://www.grammarly.com/plans","features":["写作","办公"],"verified":true,"mainstream":true},{"name":"DeepL 翻译","provider":"DeepL","category":"翻译","url":"https://www.deepl.com/translator","access":"free","categories":["翻译"],"note":"网页版基础翻译免费；API 与 Pro 独立计费","source":"https://www.deepl.com/translator","features":["翻译"],"verified":true,"mainstream":true},{"name":"Google 翻译","provider":"Google Translate","category":"翻译","url":"https://translate.google.com/","access":"free","categories":["翻译"],"note":"公开网页翻译；Cloud Translation API 独立计费","source":"https://translate.google.com/","features":["翻译"],"login":"基础文本翻译免注册","verified":true,"mainstream":true,"guest":true},{"name":"OpenAI Playground","provider":"OpenAI","category":"API/开发","url":"https://platform.openai.com/playground","access":"paid","categories":["API/开发","编程"],"note":"使用 API 账户额度，ChatGPT 订阅不等同 API 余额","source":"https://help.openai.com/en/articles/20001626-api-credits-benefit-for-eligible-chatgpt-subscriptions","features":["API/开发","编程"],"verified":true,"mainstream":true},{"name":"Copilot Studio","provider":"Microsoft","category":"智能体","url":"https://www.microsoft.com/en/copilot/microsoft-copilot-studio","access":"trial","categories":["智能体","办公"],"note":"原 Power Virtual Agents；试用及计费条件以官网为准","source":"https://www.microsoft.com/en/copilot/pricing/copilot-studio","features":["智能体","办公"],"verified":true,"mainstream":true,"aliases":["Power Virtual Agents","PVA"]},{"name":"watsonx Assistant","provider":"IBM","category":"智能体","url":"https://cloud.ibm.com/catalog/services/watsonx-assistant","access":"trial","categories":["智能体","API/开发"],"note":"原 Watson Assistant；Lite 评估额度及资格以账号为准","source":"https://cloud.ibm.com/docs/watson-assistant?topic=watson-assistant-watson-assistant-faqs","features":["智能体","API/开发"],"verified":true,"mainstream":true,"aliases":["IBM Watson Assistant","Watson Assistant Lite"]},{"name":"Brand Studio","provider":"Stability AI","category":"作图","url":"https://brandstudio.com/","access":"paid","categories":["作图","图生图","修图"],"note":"原 DreamStudio；旧域名已重定向，订阅额度不等于免费","source":"https://kb.stability.ai/knowledge-base/-fraud-alert-identifying-genuine-dream-studio-transactions-and-reporting-fraud","features":["作图","图生图","修图"],"verified":true,"mainstream":true,"aliases":["DreamStudio","Stable Diffusion"]},{"name":"Craiyon","provider":"Craiyon","category":"作图","url":"https://www.craiyon.com/en","access":"free","categories":["作图"],"note":"原 DALL-E Mini；基础文生图免费，付费功能另计","source":"https://www.craiyon.com/en","features":["作图"],"verified":true,"mainstream":true,"aliases":["DALL-E Mini","DALL·E Mini"]},{"name":"Copy.ai","provider":"Copy.ai","category":"写作","url":"https://www.copy.ai/","access":"paid","categories":["写作","营销","办公"],"note":"商业营销平台；当前免费试用资格待确认，不列作持续免费","source":"https://www.copy.ai/prices","features":["写作","营销","办公"],"verified":true,"mainstream":true},{"name":"Chatsonic","provider":"Writesonic","category":"聊天","url":"https://writesonic.com/chat","access":"free","categories":["聊天","写作","营销","搜索"],"note":"官方提供基础免费计划；高级功能付费","source":"https://writesonic.com/chat","features":["聊天","写作","营销","搜索"],"verified":true,"mainstream":true},{"name":"Poe","provider":"Quora Poe","category":"聊天","url":"https://poe.com/","access":"daily","categories":["聊天","作图"],"note":"多模型聊天；免费用户每日点数","source":"https://help.poe.com/hc/en-us/articles/19944206309524-Poe-FAQs","features":["聊天","作图"],"verified":true,"mainstream":true},{"name":"Elicit","provider":"Elicit","category":"搜索","url":"https://elicit.com/","access":"free","categories":["搜索","办公","写作"],"note":"论文检索与研究；Basic 免费，研究 Agent 有上限","source":"https://elicit.com/pricing","features":["搜索","办公","写作"],"verified":true,"mainstream":true},{"name":"Consensus","provider":"Consensus","category":"搜索","url":"https://consensus.app/","access":"free","categories":["搜索","办公"],"note":"论文循证问答；基础搜索免费","source":"https://help.consensus.app/en/articles/10087865-subscription-plans","features":["搜索","办公"],"verified":true,"mainstream":true},{"name":"ChatPDF","provider":"ChatPDF","category":"办公","url":"https://www.chatpdf.com/","access":"free","categories":["办公","聊天","搜索"],"note":"PDF、文件问答；基础功能有限","source":"https://www.chatpdf.com/","features":["办公","聊天","搜索"],"verified":true,"mainstream":true},{"name":"Cursor","provider":"Cursor","category":"编程","url":"https://cursor.com/","access":"free","categories":["编程","智能体"],"note":"AI 编程客户端；免费计划及用量以官网为准","source":"https://cursor.com/pricing","features":["编程","智能体"],"verified":true,"mainstream":true},{"name":"Antigravity","provider":"Google","category":"编程","url":"https://antigravity.google/","access":"free","categories":["编程","智能体"],"note":"Google AI 编程工具；个人免费计划有周限额","source":"https://antigravity.google/pricing","features":["编程","智能体"],"verified":true,"mainstream":true},{"name":"Ollama","provider":"Ollama","category":"本地","url":"https://ollama.com/","access":"local","categories":["本地","编程","聊天"],"note":"本地开源模型推理；需要安装及设备算力，云服务另计","source":"https://ollama.com/","features":["本地","编程","聊天"],"login":"需下载/部署","verified":true,"mainstream":true},{"name":"LM Studio","provider":"LM Studio","category":"本地","url":"https://lmstudio.ai/","access":"local","categories":["本地","聊天","编程"],"note":"本地模型与客户端；需要下载和设备算力","source":"https://lmstudio.ai/","features":["本地","聊天","编程"],"login":"需下载/部署","verified":true,"mainstream":true},{"name":"StableStudio","provider":"Stability AI","category":"本地","url":"https://github.com/Stability-AI/StableStudio","access":"local","categories":["本地","作图","编程"],"note":"开源生成界面；需自行部署，推理 API 可能收费","source":"https://github.com/Stability-AI/StableStudio","features":["本地","作图","编程"],"login":"需下载/部署","verified":true,"mainstream":true},{"name":"Groq Cloud","provider":"Groq","category":"API/开发","url":"https://console.groq.com/keys","access":"api","categories":["API/开发","免费API"],"note":"免费 API 计划限速；注册后申请密钥","source":"https://console.groq.com/docs/rate-limits","features":["API/开发","免费API"],"login":"需账号/API Key","verified":true,"mainstream":true},{"name":"Gemini API","provider":"Google","category":"API/开发","url":"https://aistudio.google.com/apikey","access":"api","categories":["API/开发","免费API"],"note":"部分模型有免费 API 层；账号及地区限制适用","source":"https://ai.google.dev/gemini-api/docs/pricing","features":["API/开发","免费API"],"login":"需账号/API Key","verified":true,"mainstream":true},{"name":"OpenRouter 免费模型","provider":"OpenRouter","category":"API/开发","url":"https://openrouter.ai/collections/free-models","access":"api","categories":["API/开发","免费API"],"note":"仅免费模型路由；付费模型单独计费","source":"https://openrouter.ai/collections/free-models","features":["API/开发","免费API"],"login":"需账号/API Key","verified":true,"mainstream":true},{"name":"Workers AI","provider":"Cloudflare","category":"API/开发","url":"https://developers.cloudflare.com/workers-ai/","access":"api","categories":["API/开发","免费API"],"note":"每天免费算力额度；部分模型仅付费计划可用","source":"https://developers.cloudflare.com/workers-ai/platform/pricing/","features":["API/开发","免费API"],"login":"需账号/API Key","verified":true,"mainstream":true},{"name":"Cohere API","provider":"Cohere","category":"API/开发","url":"https://dashboard.cohere.com/","access":"trial","categories":["API/开发"],"note":"免费试验密钥限额，仅评估；生产使用收费","source":"https://docs.cohere.com/v2/docs/cohere-faqs","features":["API/开发"],"verified":true,"mainstream":true},{"name":"Google AI 开发文档","provider":"Google","category":"API/开发","url":"https://ai.google.dev/","access":"free","categories":["API/开发","编程"],"note":"免费阅读开发文档；实际调用按模型与账号计费","source":"https://ai.google.dev/","features":["API/开发","编程"],"verified":true,"mainstream":true},{"name":"Microsoft Designer","provider":"Microsoft","category":"作图","url":"https://designer.microsoft.com/","access":"free","categories":["作图","修图","办公"],"note":"网页设计与图片工具；AI 额度随账号而变","source":"https://designer.microsoft.com/","features":["作图","修图","办公"],"verified":true,"mainstream":true},{"name":"Writesonic","provider":"Writesonic","category":"营销","url":"https://writesonic.com/","access":"trial","categories":["营销","写作"],"note":"SEO 与内容营销，免费试用后按计划收费","source":"https://writesonic.com/pricing","features":["营销","写作"],"verified":true,"mainstream":true},{"name":"IBM watsonx.ai","provider":"IBM","category":"API/开发","url":"https://www.ibm.com/products/watsonx-ai","access":"trial","categories":["API/开发","智能体"],"note":"Lite 及试用资源限额，生产服务可能收费","source":"https://www.ibm.com/products/watsonx-ai/pricing","features":["API/开发","智能体"],"verified":true,"mainstream":true}];
const MAINSTREAM_TOOL_META={"https://chatgpt.com/":{"mainstream":true,"aliases":["OpenAI","ChatGPT"],"categories":["聊天","写作","办公","作图"],"access":"free"},"https://claude.ai/":{"mainstream":true,"categories":["聊天","写作","编程","办公"]},"https://gemini.google.com/app":{"mainstream":true,"categories":["聊天","搜索","写作","编程","作图","办公"]},"https://www.perplexity.ai/":{"mainstream":true,"categories":["聊天","搜索","办公"]},"https://copilot.microsoft.com/":{"mainstream":true,"aliases":["Bing Chat","必应"],"categories":["聊天","搜索","办公"]},"https://github.com/features/copilot":{"mainstream":true,"categories":["编程","智能体"],"note":"Copilot Free 与符合资格的学生计划；用量有限"},"https://huggingface.co/spaces":{"mainstream":true,"categories":["目录","编程","作图","聊天"]},"https://aistudio.google.com/":{"mainstream":true,"categories":["编程","API/开发","聊天"]},"https://notebooklm.google.com/":{"mainstream":true,"categories":["写作","办公","搜索"]},"https://www.deepl.com/write":{"mainstream":true,"categories":["写作","办公"]},"https://chat.deepseek.com/":{"mainstream":true,"categories":["聊天","写作","编程"]},"https://www.canva.com/":{"mainstream":true,"categories":["作图","办公"]},"https://duck.ai/":{"mainstream":true,"categories":["聊天"],"access":"free"}};
const PERCHANCE_ADDITIONS=[{"provider":"Perchance","name":"Astra AI","category":"角色","categories":["角色","聊天"],"url":"https://perchance.org/astra-ai","features":["AI 陪伴","角色对话"],"access":"community","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。","aliases":["Astra","阿斯特拉","Астра"]},{"provider":"Perchance","name":"AI Chat 社区版","category":"聊天","categories":["聊天"],"url":"https://perchance.org/arkisbaj83","features":["AI 对话"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"SageSupport","category":"角色","categories":["角色","聊天"],"url":"https://perchance.org/sagesupport-chatbot","features":["角色聊天"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"Character Make","category":"作图","categories":["作图","角色创建"],"url":"https://perchance.org/charctermake","features":["角色图片"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"AI Logo Generator","category":"作图","categories":["作图"],"url":"https://perchance.org/ai-logo-generator","features":["Logo 设计"],"access":"community","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"AI Landscape","category":"作图","categories":["作图"],"url":"https://perchance.org/ai-landscape-generator","features":["风景生成"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"Pretty AI Art","category":"作图","categories":["作图"],"url":"https://perchance.org/43ho1oqd9l","features":["人物绘画"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"Nekonome Chan","category":"角色","categories":["角色","聊天"],"url":"https://perchance.org/nekonome-chan","features":["角色对话"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"AI Chat 社区版 2","category":"聊天","categories":["聊天"],"url":"https://perchance.org/7h81gglxqf","features":["AI 对话"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"ASChat · 高级角色代码","category":"角色","categories":["角色","聊天","角色创建","编程"],"url":"https://perchance.org/aschat","features":["自定义 JavaScript","角色编辑器","社区代码库"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"高级角色创建器 Enhanced","category":"角色","categories":["角色","角色创建","作图"],"url":"https://perchance.org/enhanced-character-generator","features":["角色卡","角色导出","人物图像"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"Unseen Scribe · 社区角色库","category":"角色","categories":["角色","角色创建","目录"],"url":"https://perchance.org/unseen-scribe-library","features":["社区角色","JSON 与 PNG 角色卡","搜索导出"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"Unseen Scribe · 创作者工具集","category":"目录","categories":["目录","角色","角色创建"],"url":"https://perchance.org/unseen-scribe","features":["社区工具合集","角色创作"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"Unseen Scribe · 图像实验室","category":"作图","categories":["作图","角色"],"url":"https://perchance.org/unseen-scribe-image-lab","features":["人物图像","多风格"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"Custom Code · 自定义代码","category":"编程","categories":["编程","角色创建"],"url":"https://perchance.org/custom-code","features":["自定义代码","生成器编辑"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"角色聊天开发文档","category":"编程","categories":["编程","角色","角色创建"],"url":"https://perchance.org/ai-character-chat-docs","features":["角色代码","记忆","世界观"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"高级人物生成器","category":"角色","categories":["角色","角色创建"],"url":"https://perchance.org/adv-char-gen","features":["人物设定","角色创建"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"Jerms · 人物生成器","category":"角色","categories":["角色","角色创建"],"url":"https://perchance.org/jermsgen","features":["角色生成"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"人物外貌生成器","category":"角色","categories":["角色","角色创建"],"url":"https://perchance.org/appearance-generator","features":["外貌设定"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"故事生成扩展版","category":"写作","categories":["写作"],"url":"https://perchance.org/ai-story-generator-extended","features":["故事创作","扩展工具"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"AS Ghost Writer","category":"写作","categories":["写作","角色"],"url":"https://perchance.org/as-ghost-writer","features":["人物故事","AI 写作"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance 社区","name":"角色卡与自定义代码库","category":"角色","categories":["角色","角色创建","编程","目录"],"url":"https://github.com/nosfertm/perchance-character-database","features":["共享角色","自定义代码","导入文档"],"note":"社区 GitHub 资源库，不是独立聊天服务。"}];
const PERCHANCE_COMMUNITY_TOOLS=[{"provider":"Perchance","name":"R.M Photo Generator","category":"作图","url":"https://perchance.org/rm-photo-generator","features":["写实摄影"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"专业摄影 2","category":"作图","url":"https://perchance.org/prpg2","features":["写实摄影","图片放大"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"专业摄影 1","category":"作图","url":"https://perchance.org/prpg","features":["写实摄影","风格控制"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"AI Image Studio","category":"作图","url":"https://perchance.org/w07bbo48qj","features":["图像工作室"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"BadGrampy 绘图","category":"作图","url":"https://perchance.org/badgrampy-simple-ai-image-generator","features":["简洁作图"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"想象王国","category":"作图","url":"https://perchance.org/tkoi","features":["多风格绘图"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"You Are THE BEST","category":"作图","url":"https://perchance.org/you-are-the-best","features":["多风格摄影"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"批量提示词测试","category":"作图","url":"https://perchance.org/mspt","features":["多提示词对比"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"图片提示词优化","category":"作图","url":"https://perchance.org/image-prompt-optimizer","features":["提示词优化","图像生成"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"Daveed 图片提示词","category":"作图","url":"https://perchance.org/daveeds-image-prompt-generator","features":["图片提示词"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"Multi-Flux 绘图","category":"作图","url":"https://perchance.org/ufo-flux1s-flux-upscaled","features":["图像生成"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"Real Image Editor","category":"修图","url":"https://perchance.org/ried","features":["图片编辑"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"互动拼图制作","category":"修图","url":"https://perchance.org/icollage","features":["拼图"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"Story AI","category":"写作","url":"https://perchance.org/story-ai","features":["故事创作"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"Burg 故事生成","category":"写作","url":"https://perchance.org/burgs-take-ai-story-generator","features":["故事创作"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"代码项目生成","category":"编程","url":"https://perchance.org/code-project-generator-public-use","features":["项目代码"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"}];
const EXTERNAL_FREE_TOOLS=[...MAINSTREAM_TOOL_ADDITIONS,...ORIGINAL_GENERATION_SITES,...GUEST_CHAT_TOOLS,...VERIFIED_FREE_MEDIA_TOOLS,...CURATED_FREE_TOOLS,...ROLEPLAY_MEDIA_TOOLS,...VERIFIED_ADDITIONAL_FREE_TOOLS,...PERCHANCE_ADDITIONS,...PERCHANCE_COMMUNITY_TOOLS,{"provider":"FurAI · Perchance.org","name":"FurAI 综合创作助手","category":"综合","categories":["综合","聊天","角色","作图","修图","视频","写作"],"url":"https://perchance.org/fur-ai","featured":true,"features":["多角色聊天","AI 作图","提示词优化","图生图编辑","图片增强","去除背景","图片转视频","图片压缩","图片工作室","角色记忆"],"note":"进入 FurAI 后选择其内部工具。部分图像与视频功能使用第三方服务，可能需要排队、授权或受额度限制。"},{"provider":"Duck.ai","name":"Duck.ai · 多模型聊天","category":"聊天","url":"https://duck.ai/","guest":true,"login":"免注册","features":["多模型聊天","隐私"],"access":"free","note":"官方免费匿名聊天；有使用额度。","source":"https://duckduckgo.com/duckduckgo-help-pages/duckai","verified":true},{"provider":"Duck.ai","name":"免费 AI 作图与修改","category":"作图","url":"https://duck.ai/"},{"provider":"Perchance","name":"Perchance · 角色聊天","category":"聊天","url":"https://perchance.org/ai-character-chat","categories":["聊天","角色"],"guest":true,"login":"免注册","note":"官方页面标示免注册角色聊天。"},{"provider":"Perchance","name":"AI 文生图","category":"作图","url":"https://perchance.org/ai-text-to-image-generator"},{"provider":"Perchance","name":"写实照片","category":"作图","url":"https://perchance.org/ai-photo-generator"},{"provider":"Perchance","name":"角色形象","category":"角色","url":"https://perchance.org/ai-character-generator"},{"provider":"Perchance","name":"动漫作图","category":"作图","url":"https://perchance.org/ai-anime-generator"},{"provider":"Perchance","name":"人像生成","category":"作图","url":"https://perchance.org/ai-portrait-generator"},{"provider":"Perchance","name":"剧情场景","category":"写作","url":"https://perchance.org/ai-scenario-generator"},{"provider":"Perchance","name":"图片提示词","category":"作图","url":"https://perchance.org/ai-image-prompt"},{"provider":"Perchance","name":"Flux 提示词","category":"作图","url":"https://perchance.org/ai-image-prompt-generator"},{"provider":"Perchance","name":"Perchance · AI 聊天","category":"聊天","url":"https://perchance.org/ai-chat","guest":true,"login":"免注册","note":"官方页面标示免注册免费聊天。"},{"provider":"Perchance","name":"故事生成","category":"写作","url":"https://perchance.org/ai-story-generator"},{"provider":"Perchance","name":"文字冒险 RPG","category":"互动","url":"https://perchance.org/ai-rpg"},{"provider":"Perchance","name":"社区视频生成","category":"视频","url":"https://perchance.org/ai-video-generator"},{"provider":"PerchanceAI","name":"文生图","category":"作图","url":"https://perchanceai.com/t/text-to-image"},{"provider":"PerchanceAI","name":"图生图","category":"修图","url":"https://perchanceai.com/t/img2img"},{"provider":"PerchanceAI","name":"照片编辑","category":"修图","url":"https://perchanceai.com/t/photo-editor"},{"provider":"PerchanceAI","name":"照片增强","category":"修图","url":"https://perchanceai.com/t/ai-photo-enhancer"},{"provider":"PerchanceAI","name":"图片转文字","category":"修图","url":"https://perchanceai.com/t/photo-to-text"},{"provider":"PerchanceAI","name":"故事写作","category":"写作","url":"https://perchanceai.com/t/story"},{"provider":"PerchanceAI","name":"AI 助手","category":"聊天","url":"https://perchanceai.com/c/askbuddy"},{"provider":"PerchanceAI","name":"角色扮演聊天","category":"聊天","url":"https://perchanceai.com/c/ai-roleplay-chat","categories":["聊天","角色"]},{"provider":"PerchanceAI","name":"对话训练","category":"聊天","url":"https://perchanceai.com/c/crush-chat","categories":["聊天","角色"]},{"provider":"PerchanceAI","name":"专业图片生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-image-professional"},{"provider":"PerchanceAI","name":"摄影图片生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-photo"},{"provider":"PerchanceAI","name":"像素画生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-pixel-art-generator"},{"provider":"PerchanceAI","name":"无缝纹理生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/texture-generator"},{"provider":"PerchanceAI","name":"角色参考图","category":"角色","url":"https://perchanceai.com/ai/en/generate/character-reference-sheet"},{"provider":"PerchanceAI","name":"产品创意","category":"写作","url":"https://perchanceai.com/t/product-idea-generator"},{"provider":"PerchanceAI","name":"简笔人物画","category":"作图","url":"https://perchanceai.com/t/stick-figure-generator"},{"provider":"PerchanceAI","name":"角色姓名","category":"写作","url":"https://perchanceai.com/t/1920s-name-generator"},{"provider":"PerchanceAI","name":"角色创建","category":"角色","url":"https://perchanceai.com/c/character-creator"},{"provider":"PerchanceAI","name":"故事协作","category":"写作","url":"https://perchanceai.com/c/story-weaver"},{"provider":"PerchanceAI","name":"剧情互动","category":"互动","url":"https://perchanceai.com/c/dating-sim-text-game"},{"provider":"PerchanceAI","name":"图片变换","category":"修图","url":"https://perchanceai.com/t/image-transform-with-seed"},{"provider":"PerchanceAI","name":"艺术图像","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-art-generator"},{"provider":"PerchanceAI","name":"图像变体","category":"作图","url":"https://perchanceai.com/ai/en/generate/image-to-image"},{"provider":"PerchanceAI","name":"AI 绘图","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-drawing-generator"},{"provider":"PerchanceAI","name":"真假 AI 游戏","category":"互动","url":"https://perchanceai.com/c/bot-or-human"},{"provider":"PerchanceAI","name":"魔法灯互动","category":"互动","url":"https://perchanceai.com/c/ask-a-genie"},{"provider":"PerchanceAI","name":"照片工具库","category":"修图","url":"https://perchanceai.com/ai/en/image"},{"provider":"PerchanceAI","name":"所有免费工具","category":"目录","url":"https://perchanceai.com/explore?focus=1"},{"provider":"PerchanceAI","name":"热门工具","category":"目录","url":"https://perchanceai.com/explore/list/top"},{"provider":"PerchanceAI","name":"图像生成目录","category":"目录","url":"https://perchanceai.com/explore?category=image-generators"},{"provider":"PerchanceAI","name":"照片编辑目录","category":"目录","url":"https://perchanceai.com/explore?category=photo-editing"},{"provider":"PerchanceAI","name":"肖像工具目录","category":"目录","url":"https://perchanceai.com/explore?category=portrait"},{"provider":"PerchanceAI","name":"动漫工具目录","category":"目录","url":"https://perchanceai.com/explore?category=anime"},{"provider":"PerchanceAI","name":"长篇写作目录","category":"目录","url":"https://perchanceai.com/explore?category=prose_writing"},{"provider":"PerchanceAI","name":"写作工具目录","category":"目录","url":"https://perchanceai.com/explore?category=writing"},{"provider":"PerchanceAI","name":"角色互动目录","category":"目录","url":"https://perchanceai.com/explore?category=roleplay"},{"provider":"PerchanceAI","name":"AI 助手目录","category":"目录","url":"https://perchanceai.com/explore?type=assistants"},{"provider":"PerchanceAI","name":"命名工具目录","category":"目录","url":"https://perchanceai.com/explore?category=name_generator"},{"provider":"Perchance","name":"更多社区生成器","category":"目录","url":"https://perchance.org/generators"},{"provider":"FURAI","name":"Velorum 世界观","category":"互动","url":"https://furai.space/"},{"provider":"Perchance","name":"角色聊天扩展版","category":"聊天","url":"https://perchance.org/ai-character-chat-extended","categories":["聊天","角色"]},{"provider":"Perchance","name":"AI 现代聊天","category":"聊天","url":"https://perchance.org/ai-chat-modern"},{"provider":"Perchance","name":"AI 群组聊天","category":"聊天","url":"https://perchance.org/ai-group-chat","categories":["聊天","角色"]},{"provider":"Perchance","name":"角色扮演聊天 V2","category":"聊天","url":"https://perchance.org/ai-chat-roleplay-v2","categories":["聊天","角色"]},{"provider":"Perchance","name":"自由提问 AI","category":"聊天","url":"https://perchance.org/ask-ai"},{"provider":"Perchance","name":"人物性格与背景","category":"角色","url":"https://perchance.org/ai-character-description"},{"provider":"Perchance","name":"AI 人物照片","category":"作图","url":"https://perchance.org/ai-human-generator"},{"provider":"Perchance","name":"世界观生成","category":"写作","url":"https://perchance.org/ai-generated-hierarchical-world"},{"provider":"Perchance","name":"故事大纲","category":"写作","url":"https://perchance.org/ai-story-outline"},{"provider":"Perchance","name":"剧情情节生成","category":"写作","url":"https://perchance.org/ai-plot-generator"},{"provider":"Perchance","name":"文章改写","category":"写作","url":"https://perchance.org/ai-text-rewriter"},{"provider":"Perchance","name":"AI 文本生成","category":"写作","url":"https://perchance.org/ai-text-generator"},{"provider":"Perchance","name":"睡前故事","category":"写作","url":"https://perchance.org/ai-bedtime-story"},{"provider":"Perchance","name":"同人故事","category":"写作","url":"https://perchance.org/ai-fanfic-generator"},{"provider":"Perchance","name":"电影剧本","category":"写作","url":"https://perchance.org/ai-script-generator"},{"provider":"Perchance","name":"标题创作","category":"写作","url":"https://perchance.org/ai-title-generator"},{"provider":"Perchance","name":"诗歌创作","category":"写作","url":"https://perchance.org/ai-poem-generator"},{"provider":"Perchance","name":"歌词创作","category":"写作","url":"https://perchance.org/ai-lyrics-generator"},{"provider":"Perchance","name":"说唱歌词","category":"写作","url":"https://perchance.org/ai-rap-lyrics-generator"},{"provider":"Perchance","name":"AI 代码生成","category":"编程","url":"https://perchance.org/ai-code-generator"},{"provider":"Perchance","name":"AI 文字冒险","category":"互动","url":"https://perchance.org/ai-text-adventure"},{"provider":"Perchance","name":"高级 AI 绘图","category":"作图","url":"https://perchance.org/ai-art-generator-advanced"},{"provider":"Perchance","name":"多风格对比","category":"作图","url":"https://perchance.org/multiple-style-tester"},{"provider":"Perchance","name":"图片构图工具","category":"作图","url":"https://perchance.org/imageconstructor"},{"provider":"Perchance","name":"文本转音频","category":"音频","url":"https://perchance.org/ai-text-to-audio"},{"provider":"Perchance","name":"图片重绘","category":"修图","url":"https://perchance.org/urvillain-imagine"},{"provider":"Perchance","name":"兽人角色生成","category":"角色","url":"https://perchance.org/ai-furry-generator"},{"provider":"Perchance","name":"AI 互动问答","category":"互动","url":"https://perchance.org/question-this"},{"provider":"Perchance","name":"Story Forge 创作","category":"写作","url":"https://perchance.org/c0d3-story-forge"},{"provider":"Perchance","name":"最近更新工具","category":"目录","url":"https://perchance.org/recently-updated-generators-megalist"},{"provider":"Perchance","name":"Perchance 完整精选目录","category":"目录","url":"https://perchance.org/perlist"},{"provider":"Perchance AI","name":"智能更换背景","category":"修图","url":"https://perchanceai.com/t/background-changer"},{"provider":"Perchance AI","name":"车辆外观重设计","category":"修图","url":"https://perchanceai.com/t/car-redesigner"},{"provider":"Perchance AI","name":"AI 提示词生成","category":"写作","url":"https://perchanceai.com/t/prompt"},{"provider":"Perchance AI","name":"照片动漫化","category":"修图","url":"https://perchanceai.com/t/anime-me"},{"provider":"Perchance AI","name":"照片雪景效果","category":"修图","url":"https://perchanceai.com/t/snow-effect-photo-editor"},{"provider":"Perchance AI","name":"虚拟陪伴对话","category":"聊天","url":"https://perchanceai.com/c/virtual-mom","categories":["聊天","角色"]},{"provider":"Perchance AI","name":"Mean Girl 角色对话","category":"聊天","url":"https://perchanceai.com/c/mean-girl","categories":["聊天","角色"]},{"provider":"Perchance AI","name":"Kayla 角色对话","category":"聊天","url":"https://perchanceai.com/c/kayla","categories":["聊天","角色"]},{"provider":"Perchance AI","name":"Verity 角色对话","category":"聊天","url":"https://perchanceai.com/c/verity","categories":["聊天","角色"]},{"provider":"Perchance AI","name":"互动语言老师","category":"互动","url":"https://perchanceai.com/c/unhinged-language-teacher"},{"provider":"Perchance AI","name":"毛利文化 AI 聊天","category":"互动","url":"https://perchanceai.com/c/maori-culture-chat"},{"provider":"Perchance AI","name":"Nico 角色对话","category":"聊天","url":"https://perchanceai.com/c/nico","categories":["聊天","角色"]}];
const FREE_TOOL_CATEGORIES=["全部","最近使用","Perchance","P作图","P修图","角色创建","P编程","P写作","聊天","免注册","免费API","翻译","搜索","编程","作图","图生图","视频","修图","写作","办公","智能体","营销","API/开发","试用/付费","本地","综合","角色","互动","音频","目录"];
const FREE_ACCESS_LABELS={free:"基础免费",daily:"限额免费",trial:"试用/评估",community:"社区共享",paid:"付费/待核",local:"本地运行",api:"免费API额度"};

// Account-scoped durable launch history; 24 most recently used, newest first.
const FREE_TOOL_RECENT_LIMIT=24,freeToolRecentMemory=new Map(),freeToolRecentHydrating=new Map();
function freeToolRecentKey(){return "aigzt:free-tools:recent:v1:"+String(S.user?.id||"guest")}
function normalizeFreeToolRecent(keys){
 return Array.isArray(keys)?Array.from(new Set(keys.filter(key=>typeof key==="string"&&(key.startsWith("site:")||key.startsWith("model:"))))).slice(0,FREE_TOOL_RECENT_LIMIT):[];
}
function freeToolRecentRead(scope=freeToolRecentKey()){
 if(freeToolRecentMemory.has(scope))return freeToolRecentMemory.get(scope);
 let keys=[];try{keys=normalizeFreeToolRecent(JSON.parse(localStorage.getItem(scope)||"[]"))}catch{}
 freeToolRecentMemory.set(scope,keys);return keys;
}
function freeToolRecentSave(scope,keys){
 keys=normalizeFreeToolRecent(keys);freeToolRecentMemory.set(scope,keys);
 try{localStorage.setItem(scope,JSON.stringify(keys))}catch{}
 // The existing device IndexedDB provides an independent persistent backup.
 void deviceMediaPut("free-tools:"+scope,new Blob([JSON.stringify(keys)],{type:"application/json"}));
 return keys;
}
function freeToolRecentRefresh(scope){
 if(S.freeToolsMode&&S.freeToolsCategory==="最近使用"&&freeToolRecentKey()===scope)renderFreeTools();
}
async function freeToolRecentHydrate(scope=freeToolRecentKey()){
 if(freeToolRecentHydrating.has(scope))return freeToolRecentHydrating.get(scope);
 const task=(async()=>{
  const initial=freeToolRecentRead(scope);
  const blob=await deviceMediaGet("free-tools:"+scope);
  let backup=[];try{if(blob)backup=normalizeFreeToolRecent(JSON.parse(await blob.text()))}catch{}
  const current=freeToolRecentRead(scope);
  // Existing local data is authoritative; restore backup only when it was missing.
  // A click made while restoring stays at the front of the recovered history.
  if(!initial.length&&backup.length){freeToolRecentSave(scope,[...current,...backup]);freeToolRecentRefresh(scope)}
  else if(current.length){freeToolRecentSave(scope,current)}
 })().finally(()=>freeToolRecentHydrating.delete(scope));
 freeToolRecentHydrating.set(scope,task);return task;
}
function freeToolRemember(key){
 const scope=freeToolRecentKey();
 // Start recovery before writing, so a missing local record cannot erase the backup.
 void freeToolRecentHydrate(scope);
 const keys=normalizeFreeToolRecent([key,...freeToolRecentRead(scope).filter(value=>value!==key)]);
 freeToolRecentSave(scope,keys);
 if(S.freeToolsMode&&S.freeToolsCategory==="最近使用")setTimeout(()=>freeToolRecentRefresh(scope),0);
}
function freeToolsFilters(){
 const list=$("freeToolFilters");
 if(list.children.length!==FREE_TOOL_CATEGORIES.length){
  const fragment=document.createDocumentFragment();
  for(const label of FREE_TOOL_CATEGORIES){
   const b=node("button","free-filter");b.type="button";b.textContent=label;b.dataset.category=label;
   b.setAttribute("aria-label",label.startsWith("P")&&label!=="Perchance"?"Perchance "+label.slice(1):label);
   b.addEventListener("click",()=>{S.freeToolsCategory=label;renderFreeTools();b.scrollIntoView({block:"nearest",inline:"nearest"})});fragment.append(b);
  }
  list.replaceChildren(fragment);
 }
 for(const b of list.children){const selected=b.dataset.category===S.freeToolsCategory;b.classList.toggle("active",selected);b.setAttribute("aria-pressed",String(selected))}
}
// Reuse decoded logos and permanent local category icons, including when a remote icon fails.
const freeToolCards=new Map();
const FREE_TOOL_ICON_REPAIRS={
 "krea-krea-2.hf.space":{domain:"krea.ai",glyph:"palette"},
 "multimodalart-glm-image.hf.space":{domain:"z.ai",glyph:"image"},
 "rioshiina-imagegen.hf.space":{domain:null,glyph:"camera"},
 "vexa-ai.pages.dev":{domain:null,glyph:"zap"},
 "upsampler-wan-2-2-14b-text-to-video.hf.space":{domain:"wan.video",glyph:"video"},
 "zerogpu-aoti-wan2-2-fp8da-aoti-faster.hf.space":{domain:"wan.video",glyph:"film"},
 "mcp-tools-wan-2-2-first-last-frame.hf.space":{domain:"wan.video",glyph:"clapperboard"}
};
function isPerchanceTool(item){
 try{return new URL(item.url).hostname==="perchance.org"||item.provider==="Perchance 社区"}catch{return false}
}
const PERCHANCE_CREATOR_PATHS=new Set(["/fur-ai","/ai-character-chat","/ai-character-chat-extended","/ai-character-generator","/ai-chat-roleplay-v2","/ai-character-description"]);
const freeToolLogoLoads=new Map();
function freeToolGraphic(item){
 const graphic=node("span","free-tool-icon");graphic.setAttribute("aria-hidden","true");
 let hostname=null;try{hostname=item.url?new URL(item.url).hostname:null}catch{}
 const repair=FREE_TOOL_ICON_REPAIRS[hostname];
 const glyph=isPerchanceTool(item)?"dice":repair?.glyph||({聊天:"message-circle",综合:"blocks",作图:"image",图生图:"image",视频:"video",修图:"palette",角色:"circle-user",写作:"square-pen",互动:"zap",编程:"code-2",音频:"audio-lines",翻译:"languages",办公:"file-text",搜索:"search",目录:"blocks"})[item.category]||"blocks";
 const fallback=node("span","free-tool-icon-fallback");
 fallback.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[glyph]||ICONS.blocks)+'</svg>';
 graphic.append(fallback);
 if(isPerchanceTool(item))return graphic;
 const domain=repair?repair.domain:hostname;
 if(domain){
  let load=freeToolLogoLoads.get(domain);
  if(!load){
   load=new Promise(resolve=>{const img=new Image();img.referrerPolicy="no-referrer";
    img.onload=()=>resolve(img.naturalWidth>=24&&img.naturalHeight>=24?img.src:null);
    img.onerror=()=>resolve(null);img.src="https://www.google.com/s2/favicons?domain="+encodeURIComponent(domain)+"&sz=64";
   });freeToolLogoLoads.set(domain,load);
  }
  void load.then(src=>{if(!src)return;const logo=node("img","free-tool-logo");logo.alt="";logo.width=32;logo.height=32;logo.referrerPolicy="no-referrer";
   logo.onload=()=>graphic.classList.add("has-logo");logo.onerror=()=>logo.remove();graphic.append(logo);logo.src=src;
  });
 }
 return graphic;
}
function renderFreeTools(){
 freeToolsFilters();
 const search=$("freeToolsSearch").value.trim().toLowerCase(),category=S.freeToolsCategory,seen=new Set(),list=$("freeToolsList");
 const desired=[],recent=category==="最近使用",recentRank=new Map(recent?freeToolRecentRead().map((key,index)=>[key,index]):[]);
 const hits=EXTERNAL_FREE_TOOLS.map(item=>MAINSTREAM_TOOL_META[item.url]?{...item,...MAINSTREAM_TOOL_META[item.url]}:item).filter(item=>{
  const categories=Array.isArray(item.categories)?[...item.categories]:[item.category];
  if(isPerchanceTool(item)){
   categories.push("Perchance","骰子");
   if(item.category==="作图"||new URL(item.url).pathname==="/ai-character-generator")categories.push("P作图");
   if(item.category==="修图"||item.category==="图生图")categories.push("P修图");
   if(categories.includes("编程"))categories.push("P编程");
   if(categories.includes("写作"))categories.push("P写作");
   if(PERCHANCE_CREATOR_PATHS.has(new URL(item.url).pathname))categories.push("角色创建");
  }
  if(recent?!recentRank.has("site:"+item.url):category==="免注册"?item.guest!==true:category==="试用/付费"?!["trial","paid"].includes(item.access):category!=="全部"&&!categories.includes(category))return false;
  if(search&&![item.name,item.provider,item.category,item.login,item.guest?"免注册 免登录 游客":null,FREE_ACCESS_LABELS[item.access],...(item.aliases||[]),...categories,...(item.features||[])].some(x=>String(x||"").toLowerCase().includes(search)))return false;
  // A directory entry is always a real HTTPS destination, never an internal chat action.
  let key;try{const u=new URL(item.url);if(u.protocol!=="https:")return false;key=u.href}catch{return false}
  if(seen.has(key))return false;
  seen.add(key);return true;
 });
 // Each category starts with the exact upstream sites used by this website.
 const originalRank=new Map(ORIGINAL_GENERATION_SITES.map((item,index)=>[item.url,index]));
 hits.sort((a,b)=>{
  if(category==="P作图"||category==="P修图"){
   const rank=t=>{const i=PERCHANCE_COMMUNITY_TOOLS.findIndex(x=>x.url===t.url);return i<0?Infinity:i};
   const aRank=rank(a),bRank=rank(b);if(aRank!==bRank)return aRank-bRank;
  }
  if(category==="Perchance"||category==="角色创建"){
   const priority=t=>PERCHANCE_ADDITIONS.findIndex(x=>x.url===t.url);
   const ar=priority(a),br=priority(b);
   if(ar!==br&&(ar>=0||br>=0))return (ar<0?Infinity:ar)-(br<0?Infinity:br);
  }
  const ar=originalRank.has(a.url)?originalRank.get(a.url):Infinity;
  const br=originalRank.has(b.url)?originalRank.get(b.url):Infinity;
  if(ar!==br)return ar-br;
  const paidRank=t=>["trial","paid"].includes(t.access)?1:0;
  if(category!=="试用/付费"&&paidRank(a)!==paidRank(b))return paidRank(a)-paidRank(b);
  if(Boolean(a.mainstream)!==Boolean(b.mainstream))return Number(Boolean(b.mainstream))-Number(Boolean(a.mainstream));
  if(["全部","聊天","免注册"].includes(category)&&Boolean(a.guest)!==Boolean(b.guest))return Number(Boolean(b.guest))-Number(Boolean(a.guest));
  return category==="角色"
   ?Number(Boolean(b.roleLabel))-Number(Boolean(a.roleLabel))||Number(Boolean(b.verified))-Number(Boolean(a.verified))
   :Number(Boolean(b.verified))-Number(Boolean(a.verified));
 });
 let nativeCount=0;
 if(recent||category==="全部"||category==="视频")for(const model of BUILTIN_VIDEO_MODELS){
  if(search&&![model.name,model.id,model.provider,"视频",model.free?"免费":"个人 API"].some(x=>String(x).toLowerCase().includes(search)))continue;
  const key="model:"+model.provider+":"+model.id;
  if(recent&&!recentRank.has(key))continue;
  if(freeToolCards.has(key)){desired.push(freeToolCards.get(key));nativeCount++;continue}
  const card=node("button","free-tool-card");card.type="button";
  const graphic=freeToolGraphic({category:"视频"});
  card.append(graphic,node("strong","free-tool-name",model.name),node("small","free-tool-function",model.free?"本站 · 共享免费":"个人 API · 可能收费"));
  card.dataset.freeToolKey=key;
  card.addEventListener("click",()=>{if(S.busy||!VIDEO_OPTIONS[model.provider]?.includes(model.id))return;freeToolRemember(key);chooseChatVideo(model.provider,model.id)});freeToolCards.set(key,card);desired.push(card);nativeCount++;
 }
 for(const item of hits){
  const key="site:"+item.url;
  if(freeToolCards.has(key)){desired.push(freeToolCards.get(key));continue}
  const a=node("a","free-tool-card");
  a.href=item.url;a.target="_blank";a.rel="noopener noreferrer";
  a.dataset.freeToolKey=key;
  a.addEventListener("click",event=>{if(!event.defaultPrevented)freeToolRemember(key)});
  a.addEventListener("auxclick",event=>{if(event.button===1&&!event.defaultPrevented)freeToolRemember(key)});
  const functions=Array.isArray(item.features)&&item.features.length?item.features:[item.category];
  a.title=item.name+" · "+functions.join(" · ");
  a.setAttribute("aria-label",item.name+"，"+functions.join("、")+"，打开外部网站");
  const parts=String(item.name||"").split(/\s*·\s*/);
  const shortName=String(item.name||"");if(parts.length>1)parts.shift();
  const shortFunction=(item.guest?(item.login==="部分地区免登录"?"地区限定 · ":"免注册 · "):"")+(item.roleLabel||(parts.length?parts.join(" · ").trim():(item.category||functions[0])))+(item.access&&FREE_ACCESS_LABELS[item.access]?" · "+FREE_ACCESS_LABELS[item.access]:item.mainstream?" · 额度待核":"");
  const graphic=freeToolGraphic(item);
  a.append(graphic,node("strong","free-tool-name",shortName),node("small","free-tool-function",shortFunction));
  a.title=item.name+" · "+functions.join(" · ")+(FREE_ACCESS_LABELS[item.access]?"\n"+FREE_ACCESS_LABELS[item.access]:"")+(item.login?"\n"+item.login:"")+(item.note?"\n"+item.note:"");
  freeToolCards.set(key,a);desired.push(a);
 }
 if(recent)desired.sort((a,b)=>recentRank.get(a.dataset.freeToolKey)-recentRank.get(b.dataset.freeToolKey));
 const keep=new Set(desired);
 for(const child of Array.from(list.children))if(!keep.has(child))child.remove();
 desired.forEach((card,i)=>{if(list.children[i]!==card)list.insertBefore(card,list.children[i]||null)});
 const empty=$("freeToolEmpty");empty.textContent=recent&&!search?"暂无最近使用的工具":"没有匹配的工具";empty.hidden=desired.length>0;
}
let restoringWorkspace=false;
function currentWorkspace(){return S.workMode?"work":S.freeToolsMode?"tools":""}
function syncWorkspaceRoute(name){
 if(restoringWorkspace)return;
 const hash=name?"#"+name:"";
 if(location.hash!==hash)history.replaceState({...history.state,aigztWorkspace:false},"",location.pathname+location.search+hash);
}
function enterWorkspace(name){
 const previous=currentWorkspace();
 if(previous===name){closeMenu();return}
 const state={...history.state,aigztWorkspace:true};
 history.pushState(state,"",location.pathname+location.search+"#"+name);
 restoreWorkspaceRoute();
}
function returnWorkspace(){
 if(history.state?.aigztWorkspace&&location.hash){
  history.back();
 }else{
  if(S.workMode)setWorkMode(false);
  else if(S.freeToolsMode)setFreeToolsMode(false);
 }
}
/* Floating page actions follow the active workspace; work remains accessible in the drawer. */
function syncTopMode(){
 const chatting=!S.workMode&&!S.freeToolsMode,working=!!S.workMode;
 $("shell").classList.toggle("work-active",working);
 $("headerChatModels").hidden=!chatting;
 $("headerNew").setAttribute("aria-label",working?"新建工作任务":"新建聊天");
 $("headerNew").title=working?"新建工作任务":"新建聊天";
}
function setFreeToolsMode(enabled){
 if(enabled)stopMessageReader();
 S.freeToolsMode=!!enabled;$("shell").classList.toggle("free-tools-active",S.freeToolsMode);
 if(enabled){
  S.workMode=false;$("workBoard").hidden=true;$("conversation").hidden=true;
  $("composerArea").hidden=true;
  $("navFreeTools").classList.add("active");renderFreeTools();$("freeToolsBoard").hidden=false;void freeToolRecentHydrate();syncWorkspaceRoute("tools");
 }else{
  $("freeToolsBoard").hidden=true;$("composerArea").hidden=false;$("navFreeTools").classList.remove("active");
  if(!S.workMode){$("conversation").hidden=false;syncWorkspaceRoute("")}
 }
 closeMenu();syncHomeAmbient();syncTopMode();
}
function restoreWorkspaceRoute(){
 const next=location.hash==="#tools"?"tools":location.hash==="#work"?"work":"";
 if(currentWorkspace()===next)return;
 restoringWorkspace=true;
 try{
  if(S.workMode&&next!=="work")setWorkMode(false);
  if(S.freeToolsMode&&next!=="tools")setFreeToolsMode(false);
  if(next==="tools")setFreeToolsMode(true);
  else if(next==="work")setWorkMode(true);
 }finally{restoringWorkspace=false}
}

/* Real engineering work actions: no background writes, no simulated results. */
const WK={connections:[],file:null,rows:null,proposal:null,busy:false};
function wkStatus(v){$("workToolStatus").textContent=String(v||"")}
function wkTask(){if(!S.workTaskId){wkStatus("请先新建或选择一个工作任务");return null}return S.workTaskId}
async function wkConnections(){
 if(!S.user)return;
 try{
  const d=await api("/api/work/integrations");WK.connections=d.integrations||[];
  for(const [type,status,button,field] of [["github","workGithubInfo","workGithubDisconnect","workGithubRepo"],["supabase","workDbInfo","workDbDisconnect","workDbRef"]]){
   const x=WK.connections.find(c=>c.kind===type);
   $(status).textContent=x?"已连接 "+x.label+(x.branch?" · "+x.branch:" · 仅只读"):"未连接";
   $(button).disabled=!x;
   if(x&&!$(field).value)$(field).value=x.ref;
  }
 }catch(e){wkStatus(humanError(e))}
}
async function wkConnect(kind){
 if(WK.busy)return;if(!S.user){show("authDialog");return}
 WK.busy=true;wkStatus("正在验证并保存连接…");
 const form=$(kind==="github"?"workGithubForm":"workDbForm"),b=form.querySelector('[type="submit"]');b.disabled=true;
 try{
  const payload=kind==="github"?{repo:$("workGithubRepo").value.trim(),branch:$("workGithubBranch").value.trim(),token:$("workGithubToken").value.trim()}:{ref:$("workDbRef").value.trim(),token:$("workDbToken").value.trim()};
  const d=await api("/api/work/integrations/"+kind,payload);
  form.querySelector('input[type="password"]').value="";WK.file=null;WK.proposal=null;wkShowProposal();
  await wkConnections();wkStatus("已连接 "+d.label+"，凭据已加密保存");
 }catch(e){wkStatus("连接失败："+humanError(e))}
 finally{WK.busy=false;b.disabled=false}
}
async function wkDisconnect(kind){
 if(WK.busy||!S.user)return;
 if(!confirm("确认断开 "+kind+" 连接？已创建的任务记录会保留。"))return;
 WK.busy=true;
 try{
  await api("/api/work/integrations/"+kind+"/disconnect",{});
  WK.connections=WK.connections.filter(c=>c.kind!==kind);
  if(kind==="github"){WK.file=null;WK.proposal=null;wkShowProposal()}
  await wkConnections();wkStatus("连接已断开");
 }catch(e){wkStatus(humanError(e))}finally{WK.busy=false}
}
async function wkReadRepo(){
 if(WK.busy||!S.user)return;WK.busy=true;wkStatus("读取真实 GitHub 文件…");
 try{
  const d=await api("/api/work/repository?path="+encodeURIComponent($("workRepoPath").value.trim()));
  WK.file=d.type==="file"?d:null;WK.proposal=null;wkShowProposal();
  const list=$("workRepoEntries");list.replaceChildren();
  if(d.type==="directory"){
   for(const x of d.items||[]){const b=node("button","outline",(x.type==="dir"?"目录 · ":"文件 · ")+x.name);b.type="button";b.addEventListener("click",()=>{$("workRepoPath").value=x.path;void wkReadRepo()});list.append(b)}
  }
  $("workRepoPreview").hidden=d.type!=="file";$("workRepoPreview").textContent=d.type==="file"?d.text:"";
  wkStatus(d.type==="file"?"已读取 "+d.repo+"/"+d.path+" · SHA "+d.sha.slice(0,9):"已列出 "+(d.items||[]).length+" 项");
 }catch(e){WK.file=null;wkStatus("读取失败："+humanError(e))}finally{WK.busy=false}
}
async function wkReadDb(){
 if(WK.busy||!S.user)return;WK.busy=true;wkStatus("正在执行 Supabase 匿名只读查询…");
 try{
  const d=await api("/api/work/database?table="+encodeURIComponent($("workDbTable").value.trim()));
  WK.rows=d;$("workDbRows").hidden=false;$("workDbRows").textContent=JSON.stringify(d.rows,null,2);
  wkStatus("已读取 "+d.table+" "+d.rows.length+" 行，未修改数据库");
 }catch(e){WK.rows=null;$("workDbRows").hidden=true;wkStatus("查询失败："+humanError(e))}finally{WK.busy=false}
}
async function wkContext(kind){
 const id=wkTask();if(!id||WK.busy)return;
 const path=kind==="github"?WK.file?.path:WK.rows?.table;
 if(!path){wkStatus("先读取真实文件或表，再加入任务上下文");return}
 if(!confirm(kind==="github"?"把真实仓库文件加入任务上下文，供各 AI 共享？":"确认把查询返回的数据发送给后续 AI？请先检查是否包含敏感信息。"))return;
 WK.busy=true;
 try{const d=await api("/api/work/tasks/"+id+"/"+(kind==="github"?"repo-context":"db-context"),kind==="github"?{path}:{table:path});wkStatus("已加入任务上下文："+d.summary)}
 catch(e){wkStatus(humanError(e))}finally{WK.busy=false}
}
function wkShowProposal(){
 const p=WK.proposal;$("workDraftArea").hidden=!p;if(!p)return;
 $("workDraftMeta").textContent=p.repo+" / "+p.path+" @ "+p.branch+" · "+p.baseSha.slice(0,9)+" · "+(p.status==="committed"?"已提交":"待审核");
 $("workDiffOld").textContent=p.search;$("workDiffNew").textContent=p.replace;
 $("workCommit").hidden=p.status!=="pending";
}
async function wkLoadProposal(){
 if(!S.user||!S.workTaskId)return;
 const id=S.workTaskId;
 try{const d=await api("/api/work/tasks/"+id+"/proposal");if(id!==S.workTaskId)return;WK.proposal=d.proposal;wkShowProposal()}
 catch{WK.proposal=null;wkShowProposal()}
}
async function wkPropose(){
 const id=wkTask();if(!id||WK.busy)return;if(!WK.file){wkStatus("先选择要修改的 GitHub 文本文件");return}
 WK.busy=true;$("workPropose").disabled=true;wkStatus("AI 正在分析真实文件并生成局部修改草稿…");
 try{
  const d=await api("/api/work/tasks/"+id+"/propose",{path:WK.file.path,anchor:$("workPatchAnchor").value.trim(),instruction:$("workPatchInstruction").value.trim()});
  WK.proposal=d.proposal;wkShowProposal();wkStatus("生成了真实文件修改草稿；尚未写入仓库，请审核原文与替换内容");
 }catch(e){wkStatus("AI 修改未完成："+humanError(e))}finally{WK.busy=false;$("workPropose").disabled=false}
}
async function wkCommit(){
 const id=wkTask(),p=WK.proposal;if(!id||!p||p.status!=="pending"||WK.busy)return;
 if(!confirm("确认把这处修改提交到 "+p.repo+" 的 "+p.branch+" 分支？\n文件："+p.path+"\n仅提交审核的内容。"))return;
 WK.busy=true;$("workCommit").disabled=true;wkStatus("检查远程 SHA 并提交单个文件…");
 try{
  const r=await api("/api/work/tasks/"+id+"/commit",{confirm:true,baseSha:p.baseSha});
  p.status="committed";p.commitSha=r.sha;wkShowProposal();wkStatus("GitHub 已确认提交 "+r.sha+"；还没有运行测试或部署");
  const a=node("a","","查看实际提交 "+r.sha.slice(0,9));a.href=r.url;a.target="_blank";a.rel="noopener noreferrer";$("workRunResults").replaceChildren(a);
  await selectWorkTask(id);
 }catch(e){wkStatus("提交未确认："+humanError(e))}
 finally{WK.busy=false;$("workCommit").disabled=WK.proposal?.status!=="pending"}
}
async function wkDeploy(){
 const id=wkTask();if(!id||WK.busy)return;
 const workflow=$("workWorkflow").value.trim();if(!workflow){wkStatus("请输入仓库已有的 workflow_dispatch 工作流文件名");return}
 if(!confirm("确认触发 "+workflow+"？这可能执行正式部署或产生费用。触发不代表部署成功。"))return;
 WK.busy=true;wkStatus("正在触发 GitHub Actions…");
 try{const d=await api("/api/work/tasks/"+id+"/deploy",{confirm:true,workflow});wkStatus("仅已触发工作流，请检查实际运行状态");const a=node("a","","查看 GitHub Actions");a.href=d.url;a.target="_blank";a.rel="noopener noreferrer";$("workRunResults").replaceChildren(a)}
 catch(e){wkStatus("未确认触发："+humanError(e))}finally{WK.busy=false}
}
async function wkRuns(){
 const id=wkTask();if(!id||WK.busy)return;WK.busy=true;wkStatus("核对实际 GitHub Actions 运行结果…");
 try{
  const d=await api("/api/work/tasks/"+id+"/runs"),target=$("workRunResults");target.replaceChildren();
  for(const r of d.runs||[]){const a=node("a","",(r.name||"workflow")+" · "+r.status+(r.conclusion?" · "+r.conclusion:""));a.href=r.url;a.target="_blank";a.rel="noopener noreferrer";target.append(a)}
  if(!(d.runs||[]).length)target.append(node("span","","暂无运行记录"));
  wkStatus("以上是 GitHub 返回的真实执行状态");
 }catch(e){wkStatus(humanError(e))}finally{WK.busy=false}
}

const WORK_LABELS=["规划","制作","复核","交付"];
let chatComposerBeforeWork=null,workComposerDraft=null;
function captureComposer(){return {text:$("prompt").value,attachments:S.attachments.slice(),mode:S.composerMode,miniToolChoice:S.miniToolChoice,code:S.code}}
function restoreComposer(draft){
 if(!draft)return;
 S.code=!!draft.code;$("codeToggle").classList.toggle("active",S.code);$("codeToggle").setAttribute("aria-pressed",String(S.code));
 S.miniToolChoice=draft.miniToolChoice;S.attachments=draft.attachments.slice();$("prompt").value=draft.text;
 setComposerMode(draft.mode||"text");renderAttachments();settlePromptSize();
}
function setWorkMode(on){
 const wasWork=S.workMode;
 if(on&&wasWork)return;
 if(on){stopMessageReader();chatComposerBeforeWork=captureComposer()}
 if(!on&&wasWork)workComposerDraft=captureComposer();
 setFreeToolsMode(false);S.workMode=!!on;
 if(on){
  if(!S.workStages.length)resetWorkPlan();
  $("workConfig").open=false;renderWorkEditor();void loadCatalog();
  restoreComposer(workComposerDraft||{text:"",attachments:[],mode:"text",miniToolChoice:null,code:false});$("conversation").hidden=true;$("workBoard").hidden=false;
  void wkConnections();
  $("prompt").placeholder="描述要完成的工作任务…";
  hideAttachMenu();$("toolTray").hidden=true;void fetchWorkTasks();syncWorkspaceRoute("work");
 }else{
  $("workBoard").hidden=true;$("conversation").hidden=false;hide("workModelDialog");hide("workSettingsDialog");hide("workHistoryDialog");
  if(wasWork){restoreComposer(chatComposerBeforeWork);chatComposerBeforeWork=null}
  else $("prompt").placeholder="向 AI 提问…";
  syncWorkspaceRoute("");
 }
 closeMenu();syncHomeAmbient();syncTopMode();updateComposerModel();
}
function workStatus(t){return t?.status==="completed"?"已完成":t?.status==="paused"?"已暂停 · 可继续":t?.status==="cancelled"?"已停止":t?.status==="running"?"正在执行":"待执行"}
function renderWorkTasks(){
 const box=$("workTaskList");box.replaceChildren();
 if(!S.user){box.append(node("div","hint","登录后保存工作任务"));return}
 if(!S.workTasks.length){box.append(node("div","hint","暂无任务"));return}
 for(const t of S.workTasks){
  const b=node("button","work-task-row"+(S.workTaskId===t.id?" active":""));
  b.type="button";b.append(node("span","work-task-name",t.title),node("small","",workStatus(t)));
  b.addEventListener("click",()=>{if(S.workBusy&&S.workTaskId!==t.id)return;hide("workHistoryDialog");void selectWorkTask(t.id)});box.append(b);
 }
}
function renderWorkDetail(){
 const d=S.workDetail,task=d?.task,container=$("workDetail");
 container.hidden=!task;$("workEmpty").hidden=!!task;
 if(!task){$("workStepList").replaceChildren();$("workTitle").textContent="";$("workGoal").textContent="";$("workState").textContent="";$("workErrorSlot").replaceChildren();$("workProgress").replaceChildren();$("workActionHistory").hidden=true;$("workAuditList").replaceChildren();return;}
 $("workTitle").textContent=task.title;
 $("workGoal").textContent=task.prompt||"";
 const failed=task.status==="paused",stageName=task.steps?.[task.nextStep]?.name||"当前阶段";
 const partial=(d.steps||[]).some(x=>x.step===task.nextStep);
 $("workState").textContent=failed?"执行暂停 · "+stageName+(partial?"已保存断点，可继续执行":"未完成，可重试或调整模型"):workStatus(task);
 const errorSlot=$("workErrorSlot");errorSlot.replaceChildren();
 if(task.error){
  const details=node("details","work-error-detail"),summary=node("summary","",failed?"查看线路失败详情":"查看执行详情");
  details.append(summary,node("p","",task.error));errorSlot.append(details);
 }
 const progress=$("workProgress");progress.replaceChildren();
 const progressHead=node("div","work-progress-head");progressHead.append(node("strong","","任务进度"),node("small","",Math.min(task.nextStep,task.totalSteps)+" / "+task.totalSteps));
 const meter=node("progress","work-progress-meter");meter.max=Math.max(1,task.totalSteps);meter.value=Math.min(task.nextStep,task.totalSteps);meter.setAttribute("aria-label","已完成步骤");progress.append(progressHead,meter);
 for(let i=0;i<task.totalSteps;i++){
  const configured=task.steps?.[i],name=configured?.name||WORK_LABELS[i]||"步骤 "+(i+1),done=i<task.nextStep,active=i===task.nextStep&&!["completed","cancelled"].includes(task.status);
  const item=node("div","work-progress-step"+(done?" done":active?" current":""));
  const mark=node("span","work-step-mark",done?"✓":String(i+1));mark.setAttribute("aria-hidden","true");
  const label=done?"已完成":active?(task.status==="paused"?"已暂停":task.status==="running"||S.workBusy?"执行中":"待执行"):"待执行";
  item.append(mark,node("span","work-step-name",name),node("small","",label));progress.append(item);
 }
 const list=$("workStepList"),keep=new Map(Array.from(list.children).map(el=>[el.dataset.step,el]));
 for(const step of d.steps||[]){
  const key=String(step.step),signature=JSON.stringify([step.body,step.provider,step.model,step.attempts,step.step>=task.nextStep]);let section=keep.get(key);
  if(section?.dataset.signature===signature){keep.delete(key);continue}
  const next=node("section","work-step");next.dataset.step=key;next.dataset.signature=signature;
  const header=node("div","work-step-head");header.append(node("strong","",step.phase+(step.step>=task.nextStep?" · 未完成":"")),node("small","",step.model||step.provider||"上游未公开"));
  const content=node("div","work-step-body");renderAssistantText(content,step.body);next.append(header,content);
  if(step.attempts?.length)next.append(node("div","work-switch-note","实际尝试 "+step.attempts.length+" 条未成功线路"));
  if(section)section.replaceWith(next);else list.append(next);keep.delete(key);
 }
 for(const obsolete of keep.values())obsolete.remove();
 const audit=$("workAuditList"),actions=d.actions||[];$("workActionHistory").hidden=!actions.length;audit.replaceChildren();
 for(const action of actions){const row=node("div","work-audit-row");row.append(node("strong","",action.action),node("span","",String(action.detail||"")),node("small","",new Date(action.created_at).toLocaleString()));audit.append(row)}
 $("workContinue").hidden=task.status==="completed"||task.status==="cancelled";
 $("workContinue").disabled=S.workBusy;
 $("workStop").hidden=task.status==="completed"||task.status==="cancelled";
 $("workExport").disabled=!(d.steps||[]).length;
 $("workDelete").disabled=S.workBusy;
 if(S.workMode){renderWorkEditor();renderWorkAgentCatalog()}
}
async function fetchWorkTasks(){
 if(!S.user){S.workTasks=[];renderWorkTasks();renderProjects();return}
 try{
  const data=await api("/api/work/tasks");S.workTasks=data.tasks||[];renderWorkTasks();renderProjects();
  
 }catch(e){$("workState").textContent="任务列表读取失败："+humanError(e)}
}
async function selectWorkTask(id){
 if(S.workBusy&&S.workTaskId!==id)return;
 try{
  const d=await api("/api/work/tasks/"+id);S.workTaskId=id;S.workDetail=d;
  loadWorkEditor(d.task);$("workConfig").open=false;renderWorkDetail();renderWorkTasks();renderProjects();
  void wkLoadProposal();
 }catch(e){$("workState").textContent=humanError(e)}
}
async function startWorkTask(){
 if(S.workBusy)return;
 if(!S.user){show("authDialog");return}
 const prompt=$("prompt").value.trim();if(prompt.length<3){flashError("请描述需要完成的任务");return}
 S.workBusy=true;const epoch=++S.workEpoch;
 $("sendBtn").disabled=true;$("workState").textContent="正在创建工作任务…";
 try{
  const data=await api("/api/work/tasks",{prompt,projectId:S.activeProjectId,
   attachments:S.attachments.map(x=>x.id),steps:S.workStages,routes:[],fallback:false,autoPlan:S.workStages.length===3&&S.workStages.every((step,i)=>step.name===["规划","制作","检查交付"][i]&&step.instruction===["理解需求，明确任务与交付内容","根据规划完成可用成果","核对并修正问题，提供最终成果"][i]&&step.provider===S.workStages[0].provider&&step.model===S.workStages[0].model)});
  if(epoch!==S.workEpoch)return;
  $("prompt").value="";settlePromptSize();S.attachments=[];renderAttachments();
  S.workTaskId=data.id;S.workDetail=null;
  await selectWorkTask(data.id);await fetchWorkTasks();
 }catch(e){flashError(humanError(e));$("workState").textContent=humanError(e)}
 finally{S.workBusy=false;$("sendBtn").disabled=false}
 if(epoch===S.workEpoch&&S.workTaskId===S.workDetail?.task?.id)void executeWorkTask(S.workTaskId);
}
async function executeWorkTask(id){
 if(pendingWorkModelSave){
  const saved=await pendingWorkModelSave;
  if(!saved){$("workState").textContent="新模型尚未保存，任务未继续";return}
 }
 if(S.workBusy||!S.user)return;
 S.workBusy=true;const epoch=++S.workEpoch;
 $("sendBtn").disabled=true;$("workContinue").disabled=true;
 try{
  for(let i=0;i<12;i++){
   if(epoch!==S.workEpoch)break;
   const current=S.workDetail?.task;
   if(!current||current.id!==id||["completed","cancelled","paused"].includes(current.status)&&i>0)break;
   $("workState").textContent="正在执行 "+(current.steps?.[current.nextStep]?.name||"步骤 "+(current.nextStep+1))+" · 不可用时切换候补 AI";
   const d=await api("/api/work/tasks/"+id+"/advance",{});
   if(epoch!==S.workEpoch)break;
   if(d.busy){$("workState").textContent="此任务正在其他页面执行";break}
   S.workDetail=d;renderWorkDetail();
   await fetchWorkTasks();
   const t=d.task;
   if(!t||t.status==="completed"||t.status==="paused"||t.status==="cancelled")break;
  }
 }catch(e){$("workState").textContent="暂时无法继续："+humanError(e)}
 finally{
  if(epoch===S.workEpoch){S.workBusy=false;$("sendBtn").disabled=false;$("workContinue").disabled=false;renderWorkDetail();void fetchWorkTasks()}
 }
}
async function stopWorkTask(){
 const id=S.workTaskId;if(!id)return;
 ++S.workEpoch;S.workBusy=false;$("sendBtn").disabled=false;
 try{S.workDetail=await api("/api/work/tasks/"+id+"/cancel",{});renderWorkDetail();await fetchWorkTasks()}
 catch(e){$("workState").textContent=humanError(e)}
}
async function deleteWorkTask(){
 const id=S.workTaskId;if(!id||S.workBusy)return;
 if(!confirm("删除这个任务及步骤记录？删除后不能恢复。"))return;
 try{
  await api("/api/work/tasks/"+id+"/delete",{});
  S.workTaskId=null;S.workDetail=null;renderWorkDetail();await fetchWorkTasks();
 }catch(e){$("workState").textContent=humanError(e)}
}
function exportWorkTask(){
 const d=S.workDetail;if(!d?.steps?.length)return;
 const content="# "+d.task.title+"\n\n"+
  "任务："+d.task.prompt+"\n\n"+
  d.steps.map(s=>"## "+s.phase+"\n\n"+s.body+"\n").join("\n");
 const file=new Blob([content],{type:"text/markdown;charset=utf-8"});
 const url=URL.createObjectURL(file),a=document.createElement("a");
 a.href=url;a.download="IMAI-"+d.task.title.replace(/[\\/:*?"<>|]/g,"_").slice(0,34)+".md";
 document.body.append(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),2000);
}

/* Streaming transport; only upstream emitted tokens are shown incrementally. */
async function apiChatStream(payload,onDelta){
 const resp=await fetch("/api/chat/stream",{method:"POST",headers:{"content-type":"application/json",accept:"text/event-stream"},credentials:"same-origin",cache:"no-store",body:JSON.stringify(payload)});
 if(!resp.ok){const data=await resp.json().catch(()=>null);throw Error(data?.error||"请求失败 HTTP "+resp.status)}
 if(!resp.body)throw Error("浏览器不支持流式传输");
 const reader=resp.body.getReader(),decoder=new TextDecoder();let buffer="",final=null;
 for(;;){
  const {done,value}=await reader.read();if(done)break;
  buffer+=decoder.decode(value,{stream:true});if(buffer.length>8500000)throw Error("回复流格式异常");
  let end;while((end=buffer.indexOf("\n\n"))>=0){
   const packet=buffer.slice(0,end);buffer=buffer.slice(end+2);
   const data=packet.split("\n").find(line=>line.startsWith("data:"));if(!data)continue;
   let event;try{event=JSON.parse(data.slice(5).trim())}catch{continue}
   if(event.type==="delta"&&typeof event.text==="string")onDelta(event.text);
   else if(event.type==="error")throw Object.assign(Error(event.error||"回复中断"),{code:event.code||null,upstreamStatus:event.upstreamStatus||null});
   else if(event.type==="done")final=event;
  }
 }
 if(!final?.chatId||typeof final.reply!=="string")throw Error("回复中断，未收到完整结果");
 return final;
}
// One user click, one continuation request; retain the original row and draft.
async function continueTextReply(row,original,button){
 if(S.busy||S.workMode||S.freeToolsMode||!S.chatId||!row.dataset.messageId)return;
 const chatId=S.chatId,provider=S.provider,model=S.model;
 if(provider!=="free"&&(!connected(provider)||(!isFreeModel(provider,model)&&!S.allowPaid))){openKeyPanel(provider);return}
 S.busy=true;button.disabled=true;$("sendBtn").disabled=true;
 const bubble=row.querySelector(".bubble"),status=node("span","message-send-pending","正在继续生成…");
 bubble.append(status);let tail="";
 try{
  const result=await apiChatStream({chatId,provider,model,message:"请继续原任务，从中断处直接写，不重复已完成内容。",continueFrom:row.dataset.messageId,attachments:[],mode:S.code?"code":"general",freeFallback:false,outputImages:false,imageOnly:false,replyLevel:"long",allowPaid:S.allowPaid},token=>{tail+=token});
  if(!row.isConnected||S.chatId!==chatId)return;
  if(result.assistantMessageId!==row.dataset.messageId)throw Error("续写消息编号不一致");
  status.remove();delete row.dataset.usage;
  appendMessage("assistant",result.reply,result.usedModel||result.model||null,row,Boolean(result.incomplete),result.assistantMessageId,row.dataset.saved==="1",Number(row.dataset.feedback)||0,result.usage||null,result.createdAt);
  setPortraitState(row,"finished");await fetchChats();
 }catch(e){
  status.remove();
  if(row.isConnected&&S.chatId===chatId){
   let saved=null;
   try{const data=await api("/api/chats/"+chatId);saved=data.messages?.find(m=>m.id===row.dataset.messageId&&m.body!==original)}catch{}
   if(saved){let incomplete=false;try{incomplete=!!JSON.parse(saved.usage_json||"null")?.incomplete}catch{}delete row.dataset.usage;appendMessage("assistant",saved.body,saved.model,row,incomplete,saved.id,!!saved.saved,saved.feedback,saved.usage_json,saved.created_at)}
   else {flashError("续写未完成，原回复已保留");if(tail.trim()){const notice=node("div","message-send-pending","收到的续写未确认保存");notice.append(messageTool("copy","复制未保存内容",b=>copyMessageText(tail,b)));bubble.append(notice)}}
  }
 }finally{S.busy=false;button.disabled=false;$("sendBtn").disabled=false}
}
async function sendMessage(continueFrom=null,forceFreeOnce=false){
 if(S.uploading){flashError("附件正在上传，请稍候再发送");return}
 if(S.workMode){await startWorkTask();return}
 if(S.busy)return;
 const prompt=$("prompt").value.trim();if(!prompt&&S.attachments.length===0)return;
 const autoImage=S.composerMode==="text"&&!S.code&&!continueFrom&&S.attachments.every(a=>["image/jpeg","image/png","image/webp"].includes(a.type))&&isDirectImageRequest(prompt);
 const submittedMode=autoImage?"image":S.composerMode;
 const submittedVideoProvider=S.videoProvider,submittedVideoModel=S.videoModel,submittedVideoRatio=S.videoRatio;
 if(!S.user){show("authDialog");return}
 const freeVideo=submittedMode==="video"&&["freetext","freewan","freeloop"].includes(S.videoProvider);
 const videoImages=S.attachments.filter(a=>["image/jpeg","image/png","image/webp"].includes(a.type));
 if(submittedMode==="video"&&!freeVideo){
  if(!prompt){flashError("请输入视频描述");return}
  if(S.attachments.length){flashError("当前个人 API 视频接口仅支持文字描述，请选择图生视频处理附件");return}
  if(!videoKeyPermitted(S.videoProvider)){S.videoPendingKeyReturn=true;openKeyPanel(S.videoProvider);return}
  if(!confirm("确认使用 "+VIDEO_PROVIDER_NAMES[S.videoProvider]+" 个人 API 额度生成视频？可能产生费用。"))return;
 }
 if(freeVideo&&!prompt){flashError("请输入视频描述");return}
 if(freeVideo&&S.videoProvider==="freetext"&&S.attachments.length){flashError("文生视频只接受文字，上传参考图请使用图生视频");return}
 if(submittedMode==="image"&&!prompt){flashError("请输入图片生成或修改描述");return}
 if(submittedMode==="image"&&S.miniToolChoice==="image-edit"&&!S.attachments.length){
  flashError("请点击＋中的照片上传参考图片");$("attachMenu").hidden=false;return
 }
 if(freeVideo&&S.videoProvider!=="freetext"&&videoImages.length<(S.videoProvider==="freeloop"?2:1)){
  flashError(S.videoProvider==="freeloop"?"请点击＋中的照片上传首帧与尾帧":"请点击＋中的照片上传参考图");
  $("attachMenu").hidden=false;return
 }
 if(freeVideo&&S.videoProvider==="freeloop"&&(videoImages.length!==2||videoImages[0].id===videoImages[1].id)){
  flashError("首尾帧需要两张不同的图片附件");return
 }
 if(submittedMode==="image"&&S.attachments.length&&(S.attachments.length!==1||!["image/jpeg","image/png","image/webp"].includes(S.attachments[0]?.type))){
  flashError("图生图请只上传一张 JPG、PNG 或 WebP 参考图");return
 }
 // Request routing is independent of the selected model preference.
 let requestProvider=S.provider,requestModel=S.model;
 if(submittedMode==="text"&&S.provider!=="free"&&!forceFreeOnce){
  if(!S.connectionsLoaded){
   if(!S.connectionsLoading)void fetchConnections();
   flashError("正在同步模型连接，请稍后再发送");return;
  }
  const imageOutput=S.provider==="openrouter"&&S.remoteModels.some(m=>m.id===S.model&&m.outputImages);
  const incompatible=S.provider==="groq"&&S.attachments.some(x=>x.type?.startsWith("image/")||x.type==="application/pdf")&&
   (S.attachments.some(x=>x.type==="application/pdf")||!["qwen/qwen3.8-27b","qwen/qwen3.6-27b"].includes(S.model));
  if(!connected(S.provider)||(!isFreeModel(S.provider,S.model)&&!S.allowPaid)){openKeyPanel(S.provider);return}
  if(incompatible&&!imageOutput){flashError("当前模型不支持该附件，请手动切换模型后发送");return}
 }
 if(submittedMode==="text"&&forceFreeOnce){requestProvider="free";requestModel="free:auto"}
 S.busy=true;$("sendBtn").disabled=true;hideWelcome();flashError("");
 const mediaOwner=S.user?.id;
 const isNew=!S.chatId;
 const isFreeMessage=submittedMode==="text"&&requestProvider==="free";
 const isImageMessage=submittedMode==="image";
 const attached=S.attachments.slice();
 const sentBody=prompt+(attached.length?"\n"+attached.map(a=>"[文件："+a.name+"]("+a.url+")").join("\n"):"");
 const sentRow=appendMessage("user",sentBody);$("prompt").value="";settlePromptSize();S.attachments=[];renderAttachments();
 const loading=appendMessage("assistant","");
  setPortraitState(loading,isImageMessage?"creating":"thinking");
  let receivedStreamingText=false,streamedContent="";
 const loadingBubble=loading.querySelector(".bubble");const status=node("span","thinking-status");
 const waitLabel=node("span","",isImageMessage?"作图中 1秒":submittedMode==="video"?"正在创建视频…":"正在思考");
 const dots=node("span","thinking-dots");
 for(let i=0;i<3;i++)dots.append(node("i"));
 dots.setAttribute("aria-hidden","true");status.append(dots,waitLabel);
 if(isImageMessage)showChatImageWaiting(loadingBubble,waitLabel);
 else loadingBubble.replaceChildren(status);
 const textReading=submittedMode==="text"&&!(requestProvider==="openrouter"&&S.remoteModels.some(m=>m.id===requestModel&&m.outputImages));
 const releaseReadingSpace=textReading?positionNewTextReply(loading,sentRow,$("conversation")):null;
 const startedAt=Date.now();
 const imageTimer=isImageMessage?window.setInterval(()=>{
  if(!loading.isConnected){window.clearInterval(imageTimer);return}
  waitLabel.textContent="正在创建您的图片 · "+Math.max(1,Math.floor((Date.now()-startedAt)/1000)+1)+"秒";
 },1000):null;
 try{
  let result;
  if(submittedMode==="text"){
    let pending="",scheduled=false,active=true;
    const bubble=loadingBubble,viewport=$("conversation");
    const onDelta=token=>{
     if(!active||!loading.isConnected)return;
     if(!receivedStreamingText)setPortraitState(loading,"speaking");
      receivedStreamingText=true;
      streamedContent+=token;
     pending+=token;if(scheduled)return;scheduled=true;
     window.setTimeout(()=>{
      scheduled=false;if(!active||!loading.isConnected)return;
      if(!pending)return;
      
      const nearBottom=loading.dataset.readFromStart!=="1"&&viewport.scrollHeight-viewport.scrollTop-viewport.clientHeight<140;
      updateAssistantText(bubble,streamedContent);pending="";
      if(nearBottom)viewport.scrollTop=viewport.scrollHeight;
     },100);
    };
    try{result=await apiChatStream({chatId:S.chatId,provider:requestProvider,model:requestModel,message:prompt,continueFrom:typeof continueFrom==="string"?continueFrom:undefined,attachments:attached.map(x=>x.id),
      mode:S.code?"code":"general",freeFallback:false,outputImages:requestProvider==="openrouter"&&S.remoteModels.some(m=>m.id===requestModel&&m.outputImages),imageOnly:requestProvider==="openrouter"&&S.remoteModels.some(m=>m.id===requestModel&&m.outputImages&&!m.outputText),replyLevel,creativeMode:S.creativeMode,projectId:S.activeProjectId,allowPaid:requestProvider===S.provider&&S.allowPaid,apiKey:undefined},onDelta);}
    finally{active=false;pending="";}
   }
  else if(isImageMessage){
   const reference=attached.find(x=>["image/jpeg","image/png","image/webp"].includes(x.type));
   result=await api("/api/chat/media",{chatId:S.chatId,projectId:S.activeProjectId,mode:"image",prompt,imageId:reference?.id});
  }
  else if(freeVideo){
   const img=attached.find(a=>["image/jpeg","image/png","image/webp"].includes(a.type));
   result=await api("/api/chat/media",{chatId:S.chatId,projectId:S.activeProjectId,mode:"video",provider:S.videoProvider,model:S.videoModel,imageId:img?.id,endImageId:S.videoProvider==="freeloop"?videoImages[1]?.id:undefined,ratio:S.videoRatio,prompt});
  }
  else{
   result=await api("/api/chat/media",{chatId:S.chatId,projectId:S.activeProjectId,mode:"video",provider:submittedVideoProvider,model:submittedVideoModel,ratio:submittedVideoRatio,prompt,confirmed:true});
  }
  const replyMediaCached=await cacheReplyImages(mediaOwner,result.assistantMessageId,result.images||[]);
  // A completed response never changes the user's selected model.
  if(loading.isConnected&&submittedMode==="text"&&!receivedStreamingText&&!result.images?.length){setPortraitState(loading,"speaking");await revealCompletedReply(loading,result.reply)}
  if(loading.isConnected){
   S.chatId=result.chatId;
   if(submittedMode==="text"){
    if(result.primarySucceeded===true||(!result.freeFallback&&result.primarySucceeded===undefined)){recordModelOutcome(requestProvider,requestModel,true);unavailableChatModels.delete(chatModelKey(requestProvider,requestModel))}
    else if(result.primaryFailure)recordModelOutcome(requestProvider,requestModel,false,result.primaryFailure);
    if(result.freeFallback===true)recordModelOutcome("free","free:auto",true);
   }
   // Keep the selected preference; the actual reply model is recorded below.
   if(result.userMessageId){sentRow.dataset.messageId=result.userMessageId;appendMessageCopy(sentRow,sentBody)}
   appendMessage("assistant",result.reply,result.usedModel||result.model||null,loading,Boolean(result.incomplete),result.assistantMessageId||null,false,0,result.usage||null,result.createdAt||Date.now(),result.images||[]);
     if(!replyMediaCached)mediaCacheWarning(loading.querySelector(".bubble"));
    if(submittedMode==="text")setPortraitState(loading,"finished");
  }
  if(VOICE_CHAT_ENABLED&&submittedMode==="text"&&voiceSession.active&&voiceSession.pending){
   voiceSession.pending=false;voiceSession.lastReply=result.reply;$("voiceReply").textContent=result.reply;$("voiceReplay").disabled=false;
   if(!voiceSpeak(result.reply,$("voiceReplay"),true)){voiceReady();sayStatus("本设备无法自动播报，可点击播放回答重试")}
  }
  await fetchChats();void fetchMe();
 }catch(e){
   if(submittedMode==="text"&&["MODEL_RETIRED","MODEL_UNAVAILABLE","BILLING","BILLING_LIMIT","QUOTA","RATE_LIMIT","AUTH","ACCESS","UPSTREAM_NETWORK","UPSTREAM_EMPTY","FREE_FALLBACK_FAILED"].includes(e?.code))recordModelOutcome(requestProvider,requestModel,false,e.code);
   if(submittedMode==="text"&&requestProvider!=="free"&&["MODEL_RETIRED","MODEL_UNAVAILABLE"].includes(e?.code)){
    unavailableChatModels.set(chatModelKey(requestProvider,requestModel),{code:e.code,at:Date.now()});
    if(e.code==="MODEL_UNAVAILABLE")void refreshConnectedModelCatalog(requestProvider);
   }
   setPortraitState(loading,submittedMode==="text"?"idle":"error");
   if(voiceSession.active&&voiceSession.pending){voiceSession.pending=false;voiceReady();sayStatus("回复未完成，请再次点击开始说话")}
  // Never mutate a sent question or silently restart a paid request.
  // Show status in the assistant reply; retain all streamed content.
  const bubble=loadingBubble,status=node("span","message-send-pending");
  if(streamedContent.trim()&&submittedMode==="text"){
   updateAssistantText(bubble,streamedContent,true);
   appendMessageCopy(loading,streamedContent);
  }else bubble.replaceChildren();
  const retry=messageTool("refresh-cw",isImageMessage?"重新作图":"手动重试",()=>{
   if(S.busy||S.workMode||S.freeToolsMode||!sentRow.isConnected)return;
   const input=$("prompt");
   if((input.value.trim()||S.attachments.length)&&!confirm("重新发送会替换当前未发送的草稿和附件，继续吗？"))return;
   if(isImageMessage&&S.composerMode!=="image")setComposerMode("image");
   if(freeVideo){selectVideoModel(submittedVideoProvider,submittedVideoModel);S.videoRatio=submittedVideoRatio;if(S.composerMode!=="video")setComposerMode("video")}
   else if(!isImageMessage&&S.composerMode!=="text")setComposerMode("text");
   input.value=prompt;S.attachments=attached.slice();renderAttachments();
   loading.remove();sentRow.remove();settlePromptSize();void sendMessage(continueFrom,forceFreeOnce);
  });
  const detail=submittedMode==="text"?"当前线路暂时繁忙，原消息已保留，可继续重试。":humanError(e);
  if(isImageMessage){status.append(node("span","",detail),retry);setPortraitState(loading,"idle")}else status.append(node("span","",streamedContent.trim()?"回复中断，已保留收到的内容":detail),retry);
  if(!isImageMessage&&submittedMode==="text"&&requestProvider!=="free"){
   const alternate=messageTool("layers","手动使用免费自动重试",()=>{
    if(S.busy||S.workMode||S.freeToolsMode||!sentRow.isConnected)return;
    if(($("prompt").value.trim()||S.attachments.length)&&!confirm("重试会替换未发送的草稿及附件，继续吗？"))return;
    if(S.composerMode!=="text")setComposerMode("text");
    $("prompt").value=prompt;S.attachments=attached.slice();renderAttachments();settlePromptSize();
    loading.remove();sentRow.remove();void sendMessage(continueFrom,true);
   });
   status.append(alternate);
  }
  bubble.append(status);if(submittedMode!=="text"&&!isImageMessage)status.title=humanError(e);flashError("");
 }
 finally{releaseReadingSpace?.();if(imageTimer!==null)window.clearInterval(imageTimer);S.busy=false;$("sendBtn").disabled=false;if(voiceSession.active&&voiceSession.resumePending&&!voiceSession.pending&&!voiceSession.reading)voiceListen(true)}
}
// Keep confirmed failures scoped to the current account, provider and exact model.
const unavailableChatModels=new Map();
const chatModelKey=(provider,model)=>String(S.user?.id||"")+"\0"+provider+"\0"+model;
let modelHistoryOwner=null,modelHistoryRecords={},modelHistoryLoaded=false,modelHistoryPending=null;
function modelHistoryStorage(owner){return "aigzt:model-health:v1:"+owner}
function ensureModelHistory(){
 const owner=String(S.user?.id||"");
 if(owner===modelHistoryOwner)return;
 modelHistoryOwner=owner;modelHistoryRecords={};modelHistoryLoaded=false;modelHistoryPending=null;
 if(owner){try{const saved=JSON.parse(localStorage.getItem(modelHistoryStorage(owner))||"{}");if(saved&&typeof saved==="object"&&!Array.isArray(saved))modelHistoryRecords=saved}catch{}}
}
function modelHistoryKey(provider,model){return provider+"\0"+model}
function saveModelHistory(){
 if(!modelHistoryOwner)return;
 const rows=Object.entries(modelHistoryRecords).sort((a,b)=>Math.max(b[1].success||0,b[1].failure||0)-Math.max(a[1].success||0,a[1].failure||0)).slice(0,160);
 modelHistoryRecords=Object.fromEntries(rows);
 try{localStorage.setItem(modelHistoryStorage(modelHistoryOwner),JSON.stringify(modelHistoryRecords))}catch{}
}
function recordModelOutcome(provider,model,success,code="",at=Date.now(),legacy=false){
 ensureModelHistory();if(!modelHistoryOwner||!provider||!model)return;
 const key=modelHistoryKey(provider,model),row=modelHistoryRecords[key]||{};
 if(success){if(at>(row.success||0)){row.success=at;row.legacy=legacy}}
 else if(at>(row.failure||0)){row.failure=at;row.code=code}
 modelHistoryRecords[key]=row;saveModelHistory();
}
function modelHealth(provider,model,now=Date.now()){
 ensureModelHistory();
 const r=modelHistoryRecords[modelHistoryKey(provider,model)]||{};
 const failed=(r.failure||0)>(r.success||0);
 const ttl=["BILLING","BILLING_LIMIT","QUOTA","AUTH","ACCESS","CONSENT_REQUIRED"].includes(r.code)?6*3600000:15*60000;
 return {success:!failed&&!!r.success,recentFailure:failed&&now-r.failure<ttl,last:r.success||0,legacy:!!r.legacy};
}
async function loadModelHistory(){
 ensureModelHistory();const owner=modelHistoryOwner;if(!owner||modelHistoryLoaded||modelHistoryPending)return;
 const pending=api("/api/model-history");modelHistoryPending=pending;
 try{const data=await pending;if(modelHistoryOwner!==owner||String(S.user?.id||"")!==owner)return;
  for(const r of data.models||[])if(typeof r.provider==="string"&&typeof r.model==="string"&&Number.isFinite(r.at))recordModelOutcome(r.provider,r.model,true,"",r.at,true);
  modelHistoryLoaded=true;if($("modelDialog").open)renderModels();
 }catch{/* The local success history remains available if the bounded legacy read fails. */}
 finally{if(modelHistoryPending===pending)modelHistoryPending=null}
}
// Product tier is a transparent estimate, not a cross-vendor benchmark. Do not infer capability from price.
function modelCapability(m){
 const id=String(m.id||"").toLowerCase().replace(/:free$/,"").replace(/-\d{4}-\d{2}-\d{2}$/,"");
 const name=id.split("/").pop()||id;
 if(m.type!=="text"||id==="free:auto"||id==="openrouter/free")return {score:0,label:""};
 if(/\b(?:embedding|rerank|moderation|whisper|tts)\b/.test(name))return {score:0,label:""};
 if(/(?:^|[-_.])(?:nano|tiny|lite|1b|2b|3b|4b|7b|8b)(?:$|[-_.])/.test(name))return {score:1,label:"轻量"};
 if(/(?:^|[-_.])(?:mini|flash|haiku|small|fast|turbo)(?:$|[-_.])/.test(name))return {score:2,label:"轻快"};
 if(/(?:^|[-_.])(?:pro|opus|ultra|flagship|reasoner|thinking|reasoning|astra|max|r1)(?:$|[-_.])/.test(name)||/^o[134](?:$|-)/.test(name))return {score:4,label:"高阶"};
 if(/^(?:gpt-[56](?:[.-]|$)|claude-(?:sonnet|[45])|gemini-[23]|grok-[345]|deepseek-(?:v[34]|r1)|qwen[345]|glm-[45]|kimi-k[23]|minimax-m[23]|mimo-v[23])/.test(name))return {score:3,label:"主流"};
 return {score:0,label:"未评级"};
}
function modelSortGroup({blocked,recentFailure,success,ready,freeAuto}){
 if(blocked||recentFailure)return 4;
 if(success&&ready)return 0;
 if(freeAuto)return 1;
 if(ready)return 2;
 return 3;
}
function modelOrdering(m){
 const p=modelRoute(m),health=modelHealth(p,m.id),ready=p==="free"||m.builtinVideo||connected(p)&&(isFreeModel(p,m.id)||S.savedProviders[p]?.consent===true);
 const blocked=!!unavailableChatModel(p,m.id);
 return {group:modelSortGroup({blocked,recentFailure:health.recentFailure,success:health.success,ready,freeAuto:p==="free"}),health,tier:modelCapability(m),ready};
}
function unavailableChatModel(provider,model){
 const entry=unavailableChatModels.get(chatModelKey(provider,model));
 if(!entry)return null;
 if(entry.code!=="MODEL_RETIRED"&&Date.now()-entry.at>=15*60000){unavailableChatModels.delete(chatModelKey(provider,model));return null}
 return entry;
}
let catalogRefreshAt=0,catalogRefreshPromise=null;
const providerCatalogRefresh=new Map();
async function refreshConnectedModelCatalog(provider){
 if(!S.user?.id||!S.savedProviders[provider]||VIDEO_ONLY_PROVIDERS.has(provider)||provider==="free")return;
 const owner=S.user.id,key=owner+"\0"+provider,old=providerCatalogRefresh.get(key);
 if(old?.pending)return old.pending;
 if(old&&Date.now()-old.at<15*60000)return;
 const entry={at:Date.now(),pending:null};providerCatalogRefresh.set(key,entry);
 entry.pending=(async()=>{
  try{
   const data=await api("/api/connections/"+provider+"/models",{});
   if(S.user?.id!==owner||!data.verified||!Array.isArray(data.models)||!data.models.length)return;
   S.connected[provider]=data.models;
   for(const model of data.models){const k=chatModelKey(provider,model.id);const blocked=unavailableChatModels.get(k);if(blocked?.code==="MODEL_UNAVAILABLE")unavailableChatModels.delete(k)}
   refreshSourceChips();if($("modelDialog").open)renderModels();
  }catch(e){if(e?.code==="AUTH"&&S.user?.id===owner&&S.savedProviders[provider]){S.savedProviders[provider].verified=false;if($("modelDialog").open)renderModels();if($("keyDialog").open&&$("keyProvider").value===provider&&!$("personalKey").value){refreshKeyPanel();$("keyStatus").textContent=humanError(e)}}}
  finally{entry.pending=null}
 })();
 return entry.pending;
}
async function loadCatalog(){
 if(catalogRefreshPromise)return catalogRefreshPromise;
 if(S.loadedCatalog&&Date.now()-catalogRefreshAt<15*60000)return;
 if(!S.loadedCatalog)$("modelCount").textContent="模型目录";
 catalogRefreshAt=Date.now();
 catalogRefreshPromise=(async()=>{
  try{
   const d=await api("/api/models");
   S.freeModels=(d.freeModels||[]).map(m=>({...m,provider:"free"}));
   if(Array.isArray(d.sharedFreeModels)&&!d.catalogError)S.sharedFreeModels=d.sharedFreeModels.filter(m=>m.shared===true&&m.free===true&&m.provider==="free"&&typeof m.id==="string"&&m.id.startsWith("free:or/"));
   if(Array.isArray(d.freeTierModels))S.freeTierModels=d.freeTierModels.filter(m=>m.freeTier===true&&m.requiresPersonalKey===true&&["groq","gemini"].includes(m.provider)&&m.type==="text");
   if(!d.catalogError&&Array.isArray(d.models)&&d.models.length){
    S.remoteModels=d.models.map(m=>({...m,author:m.provider,provider:"openrouter"}));
    S.loadedCatalog=true;
   }
   if(S.workMode)workModelHints();
  }catch{/* Keep the last successful model directory. */}
  finally{catalogRefreshPromise=null;renderModels()}
 })();
 return catalogRefreshPromise;
}
// Public catalog ownership is independent of the API gateway used to invoke the model.
const CHINA_MODEL_GROUPS=[
 {id:"qwen",name:"阿里千问",api:"qwen",authors:["qwen","alibaba"]},
 {id:"deepseek",name:"DeepSeek",api:"deepseek",authors:["deepseek"]},
 {id:"zhipu",name:"智谱 GLM",api:"zhipu",authors:["z-ai","zhipu","zhipuai"]},
 {id:"kimi",name:"Kimi 月之暗面",api:"kimi",authors:["moonshotai","moonshot"]},
 {id:"minimax",name:"MiniMax",api:"minimax",authors:["minimax"]},
 {id:"doubao",name:"字节豆包",api:"doubao",authors:["bytedance-seed","bytedance"]},
 {id:"qianfan",name:"百度文心",api:"qianfan",authors:["baidu"]},
 {id:"hunyuan",name:"腾讯混元",api:"hunyuan",authors:["tencent"]},
 {id:"stepfun",name:"阶跃星辰",api:"stepfun",authors:["stepfun"]},
 {id:"xiaomi",name:"小米 MiMo",api:"xiaomi",authors:["xiaomi"]},
 {id:"longcat",name:"美团 LongCat",api:"longcat",authors:["meituan"]},
 {id:"baichuan",name:"百川智能",api:"baichuan",authors:["baichuan"]},
 {id:"kwaipilot",name:"快手 KAT",authors:["kwaipilot","kuaishou"]},
 {id:"opengvlab",name:"上海 AI Lab",authors:["opengvlab"]},
 {id:"yi",name:"零一万物 Yi",authors:["01-ai","01ai"]},
 {id:"iflytek",name:"讯飞星火",api:"iflytek",authors:["iflytek"]},
 {id:"sensetime",name:"商汤 SenseNova",api:"sensetime",authors:["sensetime","sensenova"]},
 {id:"siliconflow",name:"硅基流动",api:"siliconflow",authors:[]}
];
function domesticGroupFor(m){
 const author=String(m.author||m.sharedModel||m.id||"").toLowerCase().split("/")[0];
 const provider=String(m.provider||"").toLowerCase();
 return CHINA_MODEL_GROUPS.find(group=>group.authors.includes(author)||group.api===provider)||null;
}
const RUSSIAN_MODEL_GROUPS=[{id:"yandex",name:"Yandex AI Studio",aliases:/yandex|alice[-_ ]?ai|алиса|яндекс/i},{id:"gigachat",name:"Sber · GigaChat",aliases:/giga[-_ ]?chat|sber|сбер/i},{id:"novai",name:"NovaAI",aliases:/novai|nova[-_ ]?ai/i}];
function russianGroupFor(m){
 const identity=[m.id,m.name,m.author,m.provider].filter(Boolean).join(" ");
 return RUSSIAN_MODEL_GROUPS.find(g=>m.provider===g.id||g.aliases.test(identity))||null;
}
const FAMILY_CONNECTIONS={gpt:[["openai","OpenAI"]],claude:[["claude","Claude"]],grok:[["grok","Grok"]],gemini:[["gemini","Gemini"]],qwen:[["qwen","千问"]],deepseek:[["deepseek","DeepSeek"]],kimi:[["kimi","Kimi"]],novai:[["novai","NovaAI"]]};
function renderChinaBrands(models){
 const target=$("modelRegionLinks"),chinese=S.source==="family:china"||S.source.startsWith("family:cn:");
 const russian=S.source==="family:russian"||S.source.startsWith("family:ru:");
 const family=S.source.slice(7),providers=FAMILY_CONNECTIONS[family];
 target.hidden=!chinese&&!russian&&!providers;if(target.hidden)return;
 if(russian||providers){
  const groups=russian?RUSSIAN_MODEL_GROUPS:providers.map(([id,name])=>({id,name}));
  const counts=groups.map(g=>models.filter(m=>russian?russianGroupFor(m)?.id===g.id:m.provider===g.id||modelMatches(m)).length);
  const signature=S.source+"|"+counts.join("|")+"|"+groups.map(g=>Boolean(S.savedProviders[g.id]?.verified)).join("|");
  if(target.dataset.renderSignature===signature)return;
  target.replaceChildren();
  for(let i=0;i<groups.length;i++){
   const g=groups[i],count=counts[i],selected=S.source==="family:ru:"+g.id;
   const b=node("button","model-provider-card"+(selected?" selected":""));b.type="button";
   b.append(node("strong","",g.name),node("small","",count?count+" 个匹配模型":S.savedProviders[g.id]?.verified?"读取已连接模型":"连接官方服务商 · 尚未接入"));
   b.addEventListener("click",()=>{if(russian&&count)activateSource("family:ru:"+g.id);else if(S.savedProviders[g.id]?.verified){void refreshConnectedModelCatalog(g.id);if(russian)activateSource("family:ru:"+g.id)}else{hide("modelDialog");openKeyPanel(g.id,"modelDialog")}});
   target.append(b);
  }
  target.dataset.renderSignature=signature;return;
 }
 const counts=new Map(CHINA_MODEL_GROUPS.map(group=>[group.id,0]));
 for(const m of models){const id=domesticGroupFor(m)?.id;if(id)counts.set(id,(counts.get(id)||0)+1)}
 const signature=S.source+"|"+CHINA_MODEL_GROUPS.map(g=>g.id+":"+counts.get(g.id)).join("|");
 if(target.dataset.renderSignature===signature)return;
 const previousScroll=target.scrollLeft;target.replaceChildren();
 for(const group of CHINA_MODEL_GROUPS){
  const count=counts.get(group.id)||0,selected=S.source==="family:cn:"+group.id;
  const button=node("button","model-provider-card"+(selected?" selected":""));
  button.type="button";button.setAttribute("aria-pressed",String(selected));
  button.append(node("strong","",group.name),node("small","",count?count+" 个真实目录模型":group.api?"连接官方 API":"暂无公开模型"));
  if(count)button.addEventListener("click",()=>activateSource("family:cn:"+group.id));
  else if(group.api)button.addEventListener("click",()=>{hide("modelDialog");openKeyPanel(group.api,"modelDialog")});
  else button.disabled=true;
  target.append(button);
 }
 target.dataset.renderSignature=signature;target.scrollLeft=previousScroll;
}
function allModels(){
 const index=new Map(),key=m=>m.provider+"\0"+m.id;
 const shared=S.sharedFreeModels||[],sharedIds=new Set(shared.map(m=>m.sharedModel));
 const remote=S.remoteModels.filter(m=>!sharedIds.has(m.id)||Boolean(S.savedProviders?.openrouter));
 for(const m of [...BUILTIN_VIDEO_MODELS,...S.freeModels,...shared,...remote,...S.freeTierModels])if(!index.has(key(m)))index.set(key(m),m);
 for(const [provider,items] of Object.entries(S.connected)){
  for(const x of items){
   if(!x.id)continue;const k=provider+"\0"+x.id,old=index.get(k);
   if(old?.freeTier){index.set(k,{...old,...x,id:x.id,name:x.name||old.name,provider,type:x.type||old.type,free:false,freeTier:true,ownKey:true,requiresPersonalKey:true,availableWith:undefined});continue}
   if(!old)index.set(k,{...x,id:x.id,name:x.name||x.id,provider,type:x.type||"text",free:!!x.free,ownKey:true,availableWith:undefined});
  }
 }
 return [...index.values()];
}
function hasFreeAccess(m){return m.free===true||m.freeTier===true}
function modelMatches(m){
 const query=S.query.trim().toLowerCase();
 const owner=domesticGroupFor(m),russian=russianGroupFor(m);const t=(m.name+" "+m.id+" "+m.provider+" "+(m.author||"")+" "+(m.description||"")+" "+(owner?.name||"")+" "+(russian?russian.name+" 俄罗斯":"")).toLowerCase();
 if(query&&!t.includes(query))return false;
 if(S.source.startsWith("family:")){
  const family=S.source.slice(7),id=(m.id+" "+m.name).toLowerCase();
  const re={gpt:/gpt|openai\/|\bo[1-9]-/,claude:/claude|anthropic/,
   grok:/grok|x-ai\/|xai\//,gemini:/gemini|google\//,qwen:/qwen|alibaba|tongyi/,
   novai:/novai|nova-ai|novaiapi/,deepseek:/deepseek/,kimi:/kimi|moonshot/,llama:/\bllama\b|meta-llama/,
   russian:/yandex|gigachat|giga-chat|sber|alice-ai|\.su\//};
  const groupMatch=family==="china"&&Boolean(owner)
   ||family.startsWith("cn:")&&owner?.id===family.slice(3)
   ||family==="russian"&&Boolean(russian)
   ||family.startsWith("ru:")&&russian?.id===family.slice(3)
   ||family==="international"&&!owner&&!russian&&["openrouter","openai","claude","grok","gemini","groq","cerebras","novai_pro"].includes(m.provider)
   ||Boolean(FAMILY_CONNECTIONS[family]?.some(([provider])=>m.provider===provider))
   ||re[family]?.test(id+" "+(m.author||""));
  if(!groupMatch)return false;
 }else if(S.source==="recent"){if(modelOrdering(m).group!==0)return false}
 else if(S.source==="connected"){if(!connected(modelRoute(m)))return false}
 else if(S.source.startsWith("route:")){if(providerRoute(modelRoute(m))!==S.source.slice(6))return false}
 else if(S.source==="free"){if(!hasFreeAccess(m))return false}
 else if(S.source!=="all"&&modelRoute(m)!==S.source)return false;
 if(S.filter==="free"&&!hasFreeAccess(m))return false;
 if(S.filter==="text"&&m.type!=="text")return false;
 if(S.filter==="image"&&m.type!=="image"&&!m.outputImages)return false;
 if(S.filter==="video"&&m.type!=="video")return false;
 if(S.filter==="code"&&!/cod(e|er|ing)|deepseek|qwen|gpt|claude|gemini|glm|devstral|starcoder/i.test(t))return false;
 return true;
}
function modelIsSelected(m){
 const via=m.availableWith==="openrouter-key"?"openrouter":m.provider;
 if(m.type==="video")return S.composerMode==="video"&&S.videoProvider===m.provider&&S.videoModel===m.id;
 return S.composerMode==="text"&&(m.type==="text"||m.outputImages)&&S.provider===via&&S.model===m.id;
}
function renderModels(){
 const models=allModels();renderChinaBrands(models);
 const visible=models.filter(modelMatches);
 if(S.provider!=="free"&&!visible.some(modelIsSelected)){
  const active={id:S.model,name:S.modelTitle||S.model,provider:S.provider,type:"text",free:isFreeModel(S.provider,S.model),unlisted:true};
  if(modelMatches(active))visible.unshift(active);
 }
 // The current selection always leads matching results, followed by successful routes and capability.
 const ranks=new Map(visible.map(m=>[m,modelOrdering(m)]));
 visible.sort((a,b)=>{const x=ranks.get(a),y=ranks.get(b);return Number(modelIsSelected(b))-Number(modelIsSelected(a))||x.group-y.group||y.tier.score-x.tier.score||y.health.last-x.health.last||Number(hasFreeAccess(b))-Number(hasFreeAccess(a))||Number(providerRoute(modelRoute(b))==="official")-Number(providerRoute(modelRoute(a))==="official")||a.id.localeCompare(b.id)});
 const count=visible.length,shown=visible.slice(0,(S.modelPage+1)*60);
 const sharedCount=visible.filter(m=>m.free===true&&(m.provider==="free"||m.builtinVideo)).length,personalFree=visible.filter(m=>m.freeTier===true||(m.free===true&&m.provider!=="free"&&!m.builtinVideo)).length;
 $("modelCount").textContent=count+" 个条目"+(S.source==="free"||S.filter==="free"?" · 直接免费 "+sharedCount+" · 个人额度 "+personalFree:" · 常用成功优先 · 能力分层参考");
 $("moreModels").hidden=count<=shown.length;
 const list=$("modelList"),viewKey=[S.source,S.filter,S.query].join("|");
 const signature=viewKey+"|"+S.composerMode+":"+S.videoProvider+":"+S.videoModel+"|"+S.provider+":"+S.model+"|"+shown.map(m=>m.provider+":"+m.id+":"+m.name+":"+m.type+":"+m.free+":"+Boolean(m.freeTier)+":"+Boolean(S.savedProviders[m.availableWith==="openrouter-key"?"openrouter":m.provider]?.verified)+":"+(unavailableChatModel(m.availableWith==="openrouter-key"?"openrouter":m.provider,m.id)?.code||"")+":"+Boolean(m.unlisted)+":"+ranks.get(m).group+":"+ranks.get(m).health.last+":"+ranks.get(m).tier.score).join("|");
 if(list.dataset.renderSignature===signature&&list.querySelectorAll(".model-row").length===shown.length)return;
 const dialog=$("modelScroll"),previousTop=list.dataset.viewKey===viewKey?dialog.scrollTop:0;
 list.replaceChildren();list.dataset.renderSignature=signature;list.dataset.viewKey=viewKey;
 if(!shown.length){list.append(node("p","hint",!$("modelRegionLinks").hidden?"暂无符合当前筛选的已列出模型，可在上方连接对应服务商获取真实目录":S.loadedCatalog?"暂无符合条件的模型，请切换筛选":"模型目录加载中；免费自动仍可使用"));dialog.scrollTop=previousTop;return}
 for(const item of shown){
  const via=item.availableWith==="openrouter-key"?"openrouter":item.provider,selected=modelIsSelected(item);
  const row=node("div","model-row"+(selected?" selected":"")),info=node("div","model-info"),title=node("strong","",item.name||item.id);
  if(selected){row.setAttribute("aria-current","true");row.setAttribute("aria-label","当前聊天模型："+(item.name||item.id))}
  const saved=S.savedProviders[via],verified=!!saved?.verified,blocked=unavailableChatModel(via,item.id),rank=ranks.get(item);
  const tag=node("span","price-tag"+(item.free?" free":""),blocked?(blocked.code==="MODEL_RETIRED"?"已停用":"当前不可用"):item.unlisted?"目录未列出":selected?"✓ 当前使用":item.builtinVideo?(item.free?"共享免费额度":"个人 API · 可能收费"):via==="free"?(item.shared?"共享免费 · 无需绑定":"免费线路"):verified?"密钥已验证":saved?"待验证":item.free?"免费 · 需连接":"需连接");
  const priceLabel=item.freeTier?"个人免费额度 · 付费账号可能收费":item.free===true?"限额免费":via==="openrouter"&&item.inputPrice!=null&&item.outputPrice!=null?"付费":"按账号额度 / 可能收费";
  title.prepend(providerLogo(via));title.append(node("span","provider-route-label "+providerRoute(via),providerRouteLabel(via)),node("span","price-tag"+(item.free?" free":""),priceLabel));
  if(rank.health.recentFailure)title.append(node("span","price-tag","近期异常"));
  else if(rank.group===0)title.append(node("span","price-tag free",rank.health.legacy?"历史成功匹配":"已成功使用"));
  if(rank.tier.label)title.append(node("span","price-tag",rank.tier.label));title.append(tag);
  const owner=domesticGroupFor(item);
  info.append(title,node("small","",via==="free"?(item.shared?"本站共享零价文字模型 · 无需个人密钥 · ID："+item.sharedModel:"免费自动路由 · 实际上游模型可能变化"):(owner?"中国模型 · "+owner.name+" · ":"")+"接入："+providerLabel(via)+" · ID："+item.id+(item.freeTier?" · 需要本人免费计划/API Key，额度及计费由服务商决定":"")+(item.inputImages?" · 支持图片分析":"")+(item.inputFiles?" · 支持PDF":"")+(item.outputImages?" · 支持图片输出":"")));
  const actionable=["text","image"].includes(item.type)||(item.type==="video"&&VIDEO_OPTIONS[item.provider]?.includes(item.id));
  const button=node("button","model-action",blocked?"不可用":!actionable?"暂不支持":selected?"✓ 已选定":item.type!=="text"?"使用":via==="free"||verified?"选择":"连接");
  button.disabled=!!blocked||!actionable||selected;
  if(actionable&&!blocked)button.addEventListener("click",()=>setModel(item));
  row.append(info,button);list.append(row);
 }
 dialog.scrollTop=previousTop;
}
const domesticCatalogRequested=new Set();
async function loadConnectedDomesticCatalogs(){
 const userId=String(S.user?.id||"");if(!userId)return;
 const providers=[...new Set(CHINA_MODEL_GROUPS.map(group=>group.api).filter(Boolean))]
  .filter(provider=>S.savedProviders[provider]?.verified&&!domesticCatalogRequested.has(userId+":"+provider));
 for(let index=0;index<providers.length;index+=2){
  await Promise.all(providers.slice(index,index+2).map(async provider=>{
   domesticCatalogRequested.add(userId+":"+provider);
   try{
    const data=await api("/api/connections/"+provider+"/models",{});
    if(String(S.user?.id||"")!==userId)return;
    if(!Array.isArray(data.models)||!data.models.length)return;
    S.connected[provider]=data.models;
    const chip=$("sourceChips").querySelector('[data-source="'+provider+'"]');
    if(chip)chip.textContent=provider+" · "+data.models.length;
    if(S.source==="family:china"||S.source.startsWith("family:cn:"))renderModels();
   }catch{/* Keep the last chosen model when a provider does not expose a model catalog. */}
  }));
 }
}
function activateSource(name){
 S.source=name;S.modelPage=0;S.filter=name==="free"?"free":"all";$("modelFilter").value=S.filter;
 for(const el of els("#sourceChips .chip"))el.classList.toggle("active",el.dataset.source===name);
 renderModels();
 if(name==="family:china"||name.startsWith("family:cn:"))void loadConnectedDomesticCatalogs();
 if(name==="family:russian"||name.startsWith("family:ru:"))for(const g of RUSSIAN_MODEL_GROUPS)if(S.savedProviders[g.id]?.verified&&(name==="family:russian"||name==="family:ru:"+g.id))void refreshConnectedModelCatalog(g.id);
 for(const [provider] of FAMILY_CONNECTIONS[name.slice(7)]||[])if(S.savedProviders[provider]?.verified)void refreshConnectedModelCatalog(provider);
 if(name==="family:gpt"&&S.savedProviders.openai)void refreshConnectedModelCatalog("openai");
 else if(S.savedProviders[name])void refreshConnectedModelCatalog(name);
}
function refreshSourceChips(){
 const container=$("sourceChips");
 initDomesticProviderLinks();
 for(const [p,items] of Object.entries(S.connected)){
  if(container.querySelector('[data-source="'+p+'"]'))continue;
  const btn=node("button","chip",p+" · "+items.length);
  btn.dataset.source=p;btn.addEventListener("click",()=>activateSource(p));
  container.append(btn);
 }
}
const HOME_BRAND_ROUTES=Object.freeze({
 openai:{provider:"openai",family:"gpt"}, "claude-color":{provider:"claude",family:"claude"},
 "gemini-color":{provider:"gemini",family:"gemini"},grok:{provider:"grok",family:"grok"},
 "deepseek-color":{provider:"deepseek",family:"deepseek"},"qwen-color":{provider:"qwen",family:"qwen"},
 "kimi-color":{provider:"kimi",family:"kimi"},"metaai-color":{provider:"openrouter",family:"llama",alternate:"groq"}
});
let pendingHomeBrand=null,homeBrandBinding=null;
function openHomeBrandModels(route){
 S.query="";S.source="family:"+route.family;S.filter="all";S.modelPage=0;
 openModels();activateSource(S.source);
 for(const p of [route.provider,route.alternate].filter(Boolean))if(S.savedProviders[p]?.verified)void refreshConnectedModelCatalog(p);
 $("sourceChips").querySelector('[data-source="'+S.source+'"]')?.scrollIntoView({block:"nearest",inline:"nearest"});
}
function openHomeBrand(brand){
 const route=HOME_BRAND_ROUTES[brand];if(!route)return;
 if(!S.user){pendingHomeBrand=brand;show("authDialog");return}
 if(connected(route.provider)||(route.alternate&&connected(route.alternate))){openHomeBrandModels(route);return}
 homeBrandBinding=route;
 openKeyPanel(route.provider);
 if(route.family==="llama"&&S.connectionsLoaded)$("keyStatus").textContent="Meta Llama 通过 OpenRouter 接入；绑定后选择 Llama 模型。";
}
function openModels(){
 $("modelSearch").value=S.query;$("modelFilter").value=S.filter;
 for(const el of els("#sourceChips .chip"))el.classList.toggle("active",el.dataset.source===S.source);
 S.modelPage=0;show("modelDialog");renderModels();$("modelScroll").scrollTop=0;void loadModelHistory();void loadCatalog();
 if(S.source==="family:gpt"&&S.savedProviders.openai)void refreshConnectedModelCatalog("openai");
 else if(S.savedProviders[S.source])void refreshConnectedModelCatalog(S.source);
 else if(S.provider!=="free"&&S.savedProviders[S.provider])void refreshConnectedModelCatalog(S.provider);
 if(S.source==="family:china"||S.source.startsWith("family:cn:"))void loadConnectedDomesticCatalogs();
}
function openKeyPanel(provider,backPage=null){
 keyBackPage=backPage;
 $("providerPicker").open=false;
 if(typeof provider==="string"&&$("keyProvider").querySelector('option[value="'+provider+'"]'))$("keyProvider").value=provider;
 else $("keyProvider").value="openai";
 if(S.user&&!S.connectionsLoaded){
  // Do not flash a fresh API-key form before saved account connections have loaded.
  $("keyAdvanced").open=false;
  $("savedConnectionPanel").hidden=true;
  $("keyStatus").textContent="正在恢复已保存连接";
  show("keyDialog");
  if(!S.connectionsLoading)void fetchConnections();
  return;
 }
 refreshKeyPanel();show("keyDialog");
}


const iv={items:[],i:0,scale:1,x:0,y:0,touch:null,lastTap:null,lastTouchEnd:0,origin:null};
function ivTransform(){$("ivImage").style.transform="translate("+iv.x+"px,"+iv.y+"px) scale("+iv.scale+")"}
function ivReset(){iv.scale=1;iv.x=0;iv.y=0;ivTransform()}
function ivClose(){
 if($("imageViewer").hidden)return;
 $("imageViewer").hidden=true;document.documentElement.classList.remove("image-viewing");document.body.classList.remove("image-viewing");
 $("ivImage").removeAttribute("src");$("ivThumbs").replaceChildren();iv.items=[];iv.touch=null;iv.lastTap=null;
 iv.origin?.focus?.({preventScroll:true});iv.origin=null;
}
function ivShow(i){
 if(!iv.items.length)return;
 iv.i=(i+iv.items.length)%iv.items.length;
 const it=iv.items[iv.i];$("ivImage").src=it.src;$("ivImage").alt=it.alt||"图片预览";
 $("ivCounter").textContent=(iv.i+1)+" / "+iv.items.length;ivReset();$("ivThumbs").replaceChildren();
 for(const [k,item] of iv.items.entries()){
  const b=node("button","iv-thumb"+(k===iv.i?" active":""));b.type="button";b.setAttribute("aria-label","第 "+(k+1)+" 张图片");
  const t=node("img");t.src=item.src;t.alt="";t.loading="lazy";b.append(t);
  b.addEventListener("click",()=>ivShow(k));$("ivThumbs").append(b);
  if(k===iv.i)requestAnimationFrame(()=>{if(b.isConnected)b.scrollIntoView({block:"nearest",inline:"nearest"})});
 }
}
function isPreviewableImage(img){
 if(!img||!img.src||!img.getClientRects().length)return false;
 if(img.closest("#imageViewer,.sidebar,.brand-lockup,.avatar-ai,.ai-avatar-frame,.provider-brand-img,.free-tool-logo,a[href],button,[role='button']"))return false;
 // Conversation galleries contain only actual message media, never decorative assets.
 if(img.closest(".messages,.message"))return img.matches(".chat-generated-image,.chat-upload-image");
 return true;
}
function ivOpen(img){
 if(!isPreviewableImage(img))return;
 const scope=img.closest(".draw-gallery,.messages,.media-preview,.result-list,#savedFiles,.work-board")||img.closest("dialog,.main")||document.body;
 const found=Array.from(scope.querySelectorAll("img")).filter(isPreviewableImage);
 if(!found.includes(img))found.push(img);
 iv.items=found.map(x=>({src:x.currentSrc||x.src,alt:x.alt||""}));iv.origin=img;iv.lastTap=null;
 $("imageViewer").hidden=false;document.documentElement.classList.add("image-viewing");document.body.classList.add("image-viewing");
 ivShow(found.indexOf(img));$("imageViewer").focus({preventScroll:true});
}
function ivZoom(){if(iv.scale>1)ivReset();else{iv.scale=2.7;iv.x=0;iv.y=0;ivTransform()}}
function ivDistance(a,b){return Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)}
function wireImageViewer(){
 document.addEventListener("click",e=>{
  if(!(e.target instanceof Element))return;
  const img=e.target.closest("img");
  if(!isPreviewableImage(img))return;
  e.preventDefault();e.stopPropagation();ivOpen(img);
 },true);
 $("ivClose").addEventListener("click",ivClose);
 $("ivPrev").addEventListener("click",()=>ivShow(iv.i-1));$("ivNext").addEventListener("click",()=>ivShow(iv.i+1));
 document.addEventListener("keydown",e=>{
  if($("imageViewer").hidden)return;
  if(e.key==="Escape"){e.preventDefault();ivClose()}
  if(e.key==="ArrowLeft"&&iv.scale===1){e.preventDefault();ivShow(iv.i-1)}
  if(e.key==="ArrowRight"&&iv.scale===1){e.preventDefault();ivShow(iv.i+1)}
 });
 const stage=$("ivStage");
 stage.addEventListener("dblclick",e=>{e.preventDefault();if(Date.now()-iv.lastTouchEnd>550)ivZoom()});
 stage.addEventListener("touchstart",e=>{
  if(e.touches.length===2){iv.touch={pinch:true,d:ivDistance(e.touches[0],e.touches[1]),s:iv.scale};iv.lastTap=null}
  else if(e.touches.length===1){const t=e.touches[0];if(iv.scale===1&&t.clientX<=24){iv.touch=null;return}iv.touch={x:t.clientX,y:t.clientY,lx:t.clientX,ly:t.clientY,moved:false,pinch:false}}
 },{passive:false});
 stage.addEventListener("touchmove",e=>{
  const s=iv.touch;if(!s)return;
  if(s.pinch&&e.touches.length===2){e.preventDefault();iv.scale=Math.max(1,Math.min(4,s.s*ivDistance(e.touches[0],e.touches[1])/Math.max(1,s.d)));ivTransform();return}
  if(!s.pinch&&e.touches.length===1){const t=e.touches[0],x=t.clientX,y=t.clientY;
   if(Math.abs(x-s.x)>8||Math.abs(y-s.y)>8)s.moved=true;
   if(iv.scale>1){e.preventDefault();iv.x+=x-s.lx;iv.y+=y-s.ly;ivTransform()}s.lx=x;s.ly=y}
 },{passive:false});
 stage.addEventListener("touchend",e=>{
  const s=iv.touch;if(!s)return;
  if(s.pinch){if(!e.touches.length){iv.touch=null;if(iv.scale<1.05)ivReset()}return}
  if(e.touches.length)return;iv.touch=null;iv.lastTouchEnd=Date.now();const t=e.changedTouches[0];if(!t)return;
  const dx=t.clientX-s.x,dy=t.clientY-s.y;
  if(iv.scale===1){
   if(dy>90&&Math.abs(dy)>Math.abs(dx)*1.3){ivClose();return}
   if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.3){ivShow(iv.i+(dx<0?1:-1));return}
  }
  if(!s.moved){
   const now=Date.now();
   if(iv.lastTap&&now-iv.lastTap.at<310&&ivDistance(t,iv.lastTap)<45){ivZoom();iv.lastTap=null}
   else iv.lastTap={at:now,clientX:t.clientX,clientY:t.clientY};
  }
 },{passive:true});
 stage.addEventListener("touchcancel",()=>{iv.touch=null;iv.lastTap=null},{passive:true});
}

function drawTile(index,status="准备生成",shape="portrait"){
 const tile=node("article","draw-tile"),picture=node("div","draw-photo"),caption=node("small","draw-caption","第 "+index+" 张 · "+status),clock=node("time","draw-tile-clock","00:00");
 picture.append(createImageWaitingFrame());
 picture.dataset.shape=shape;clock.hidden=true;tile.append(picture,clock,caption);
 $("drawResults").append(tile);return {tile,picture,caption,clock};
}
function drawElapsedText(ms){
 const seconds=Math.floor(Math.max(0,ms)/1000);
 const two=n=>String(n).padStart(2,"0");
 return seconds>=3600?Math.floor(seconds/3600)+":"+two(Math.floor(seconds/60)%60)+":"+two(seconds%60):two(Math.floor(seconds/60))+":"+two(seconds%60);
}
function paintDrawStopwatch(batch,tiles){
 const now=Date.now();
 $("drawElapsed").textContent=drawElapsedText(now-batch.startedAt);
 for(const tile of tiles){
  if(!tile.startedAt)continue;
  tile.clock.textContent=drawElapsedText((tile.finishedAt||now)-tile.startedAt);
 }
}
async function drawResult(tile,url){
 let cached=true;
 if(tile.cacheKey){requestDeviceMediaPersistence();try{cached=await deviceMediaPut(tile.cacheKey,await deviceMediaBlob(url))}catch{cached=false}}
 const img=node("img");img.alt="生成图片";img.loading="eager";img.className="draw-image-reveal";
 const ok=await new Promise(resolve=>{img.onload=()=>resolve(true);img.onerror=()=>resolve(false);img.src=url});
 if(!ok||!tile.picture.isConnected){showDrawRetry(tile,"图片暂时未能加载，可重新尝试");return false}
 tile.picture.replaceChildren(img);
 tile.tile.querySelector(".draw-tile-actions")?.remove();
 const actions=node("div","draw-tile-actions"),download=node("a","","下载图片");
 download.href=url;download.download="aigzt-image.png";actions.append(download);
 const revise=node("button","draw-revise","调整描述再生成");revise.type="button";
 revise.title="保留原图供对比；修改描述重新出图，不直接修改原图像素";
 revise.addEventListener("click",()=>{
  if(S.drawBatch)return;
  const input=$("createPrompt");input.value=tile.sourcePrompt||input.value;
  $("createStatus").textContent="修改描述再生成新图；原图保留供对比。";input.focus();
 });
 const duck=node("a","draw-duck-edit","Duck.ai 编辑原图");
 duck.href="https://duck.ai/";duck.target="_blank";duck.rel="noopener noreferrer";
 duck.title="先下载这张图片，再到 Duck.ai 上传原图继续编辑";
 actions.append(revise,duck);tile.tile.append(actions);
 tile.caption.textContent=cached?"保留在本机 · 网站不保存":"本机缓存失败，请下载图片";
 return true;
}
function drawSleep(ms,signal){
 return new Promise(resolve=>{
  if(signal.aborted){resolve(false);return}
  const finish=ok=>{clearTimeout(timer);signal.removeEventListener("abort",abort);resolve(ok)};
  const abort=()=>finish(false);
  const timer=setTimeout(()=>finish(true),ms);
  signal.addEventListener("abort",abort,{once:true});
 });
}
function showDrawRetry(tile,reason){
 tile.picture.replaceChildren(node("span","draw-stopped","暂未出图"));
 tile.caption.textContent=String(reason||"免费来源暂未返回图片");
 if(tile.tile.querySelector(".draw-retry"))return;
 const b=node("button","outline draw-retry","重新尝试");b.type="button";
 b.addEventListener("click",()=>{if(S.drawBatch)return;void runFreeDraw()});tile.tile.append(b);
}
async function drawTrackJob(id,tile,batch){
 for(let tries=0;tries<150&&!batch.cancelled;tries++){
  let waitMs=12000;
  try{
   const r=await api("/api/image/task/"+encodeURIComponent(id));
   if(batch.cancelled)return false;
   if(r.done){
    if(r.failed){showDrawRetry(tile,r.error||"免费来源暂未返回图片");return false}
    if(typeof r.image==="string")return await drawResult(tile,r.image);
    showDrawRetry(tile,"作图服务未返回图片");return false;
   }
   tile.caption.textContent="正在生成";
   waitMs=Math.max(1000,Math.min(14000,Number(r.waitSeconds||12)*1000));
  }catch(e){
   tile.caption.textContent="本次查询暂时中断";
  }
  if(!await drawSleep(waitMs,batch.controller.signal))return false;
 }
 if(!batch.cancelled){showDrawRetry(tile,"等待时间已结束，可重新尝试")}
 return false;
}
function stopDrawBatch(){
 const b=S.drawBatch;
 if(!b)return;
 b.cancelled=true;b.controller.abort();clearInterval(b.clockTimer);S.drawBatch=null;
 $("drawCancel").hidden=true;$("createButton").disabled=false;
 for(const el of $("drawResults").querySelectorAll(".draw-photo"))if(el.querySelector(".image-loading-card"))el.replaceChildren(node("span","draw-stopped","已停止查询"));
 $("createStatus").textContent="已停止查询；离开后无法恢复生成图片";
}
async function runFreeDraw(){
 const prompt=$("createPrompt").value.trim();
 if(!prompt){$("createStatus").textContent="请输入画面描述";return}
 if(!S.user){show("authDialog");return}
 if(S.drawBatch){$("createStatus").textContent="上一批作图尚未完成";return}
 const count=Number(drawChoice("drawCount")),shape=drawChoice("drawShape"),style=drawChoice("drawStyle");
 if(![1,2,4].includes(count)){$("createStatus").textContent="图片数量不正确";return}
 const batch={cancelled:false,controller:new AbortController(),startedAt:Date.now(),clockTimer:null};
 S.drawBatch=batch;
 // Retain at most one prior batch as DOM nodes, not duplicated base64 data.
 const ready=Array.from($("drawResults").children).filter(el=>el.querySelector(".draw-photo img"));
 if(ready.length){$("drawPrevious").replaceChildren(...ready);$("drawPreviousSection").hidden=false}
 $("drawResults").replaceChildren();
 $("drawResultTitle").textContent="本次图片";
 const batchId=crypto.randomUUID();
 try{localStorage.setItem(deviceMediaKey("draw-latest"),JSON.stringify({id:batchId,count,shape}))}catch{}
 const tiles=Array.from({length:count},(_,i)=>{const tile=drawTile(i+1,"准备生成",shape);tile.cacheKey=deviceMediaKey("draw:"+batchId+":"+i);return tile});
 $("createButton").disabled=true;$("drawCancel").hidden=false;$("drawElapsed").hidden=false;
 const renderClock=()=>{if(S.drawBatch===batch)paintDrawStopwatch(batch,tiles)};
 renderClock();
 // The stopwatch changes only local DOM once per second; no extra API reads or D1 queries.
 batch.clockTimer=setInterval(renderClock,1000);
 $("createStatus").textContent="同时生成 "+count+" 张图片";
 let success=0,failed=0,finished=0;
 const task=async tile=>{
  if(batch.cancelled)return;
  tile.startedAt=Date.now();tile.sourcePrompt=prompt;tile.clock.hidden=false;tile.caption.textContent="正在提交";
  try{
   const result=await api("/api/image",{prompt,style,shape});
   if(batch.cancelled)return;
   if(typeof result.jobId!=="string")throw Error("没有返回图片任务编号");
   tile.caption.textContent="正在生成图片";
   const ok=await drawTrackJob(result.jobId,tile,batch);
   if(batch.cancelled)return;
   if(ok)success++;else failed++;
  }catch(error){
   if(batch.cancelled)return;
   failed++;showDrawRetry(tile,humanError(error));
  }finally{
   tile.finishedAt=Date.now();finished++;
   if(!batch.cancelled&&S.drawBatch===batch)
    $("createStatus").textContent="已完成 "+finished+"/"+count+" 张 · 成功 "+success+" 张"+(failed?" · 待重试 "+failed+" 张":"");
   renderClock();
  }
 };
 try{
  // Start all selected 1 / 2 / 4 tasks together. Each task keeps its own existing
  // 12-second bounded status polling and IM's fixed model fallback order.
  await Promise.all(tiles.map(task));
 }finally{
  clearInterval(batch.clockTimer);
  if(S.drawBatch===batch){
   paintDrawStopwatch(batch,tiles);
   S.drawBatch=null;$("drawCancel").hidden=true;$("createButton").disabled=false;
   $("createStatus").textContent="生成结束：成功 "+success+"/"+count+" 张"+(failed?" · 待重试 "+failed+" 张":"");
  }
 }
}
function drawChoice(id){return $(id).dataset.value||""}
function setDrawChoice(id,value){
 const group=$(id),btn=Array.from(group.querySelectorAll("button[data-value]")).find(x=>x.dataset.value===value);
 if(!btn)return false;
 group.dataset.value=value;
 for(const b of group.querySelectorAll("button[data-value]")){const active=b===btn;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active))}
 if(id==="drawStyle"&&Array.from(group.querySelectorAll("button[data-value]")).indexOf(btn)>=8){group.classList.add("expanded");$("drawMore").textContent="收起风格";$("drawMore").setAttribute("aria-expanded","true")}
 return true;
}
function drawPrefs(){
 const ids=["drawStyle","drawShape","drawCount"];let state={};
 try{state=JSON.parse(localStorage.getItem("aigzt:draw-prefs")||"{}")}catch{}
 const save=()=>{try{localStorage.setItem("aigzt:draw-prefs",JSON.stringify(Object.fromEntries(ids.map(id=>[id,drawChoice(id)]))))}catch{}};
 for(const id of ids){if(typeof state[id]==="string")setDrawChoice(id,state[id]);
  $(id).addEventListener("click",e=>{const btn=e.target.closest("button[data-value]");if(btn&&setDrawChoice(id,btn.dataset.value))save()})
 }
 $("drawMore").addEventListener("click",()=>{
  const expanded=$("drawStyle").classList.toggle("expanded");
  $("drawMore").textContent=expanded?"收起风格":"更多风格";$("drawMore").setAttribute("aria-expanded",String(expanded));
 });
}
function setCreationMode(){
 $("createDialogTitle").textContent="免费作图";
 $("drawSettings").hidden=false;$("drawResultSection").hidden=false;
 $("drawCancel").hidden=!S.drawBatch;$("drawElapsed").hidden=!S.drawBatch&&$("drawElapsed").textContent==="00:00";
 $("createButton").textContent="生成免费图片";$("createPrompt").placeholder="描述你要生成的图片…";
}
function openCreate(){
 if(!S.user){show("authDialog");return}
 setCreationMode("image");show("createDialog");closeMenu();
 if(!$("drawResults").children.length&&!S.drawBatch){const owner=S.user.id;void (async()=>{let record;try{record=JSON.parse(localStorage.getItem(deviceMediaKey("draw-latest"))||"null")}catch{};if(!record||![1,2,4].includes(record.count))return;for(let i=0;i<record.count;i++){const blob=await deviceMediaGet(owner+":draw:"+record.id+":"+i);if(!blob||S.user?.id!==owner||S.drawBatch||S.createMode!=="image")continue;const tile=drawTile(i+1,"本机图片",record.shape);await drawResult(tile,URL.createObjectURL(blob))}})().catch(()=>{})}
}
function videoKeyPermitted(provider){
 if(provider==="freetext"||provider==="freewan"||provider==="freeloop")return true;
 const record=S.savedProviders[provider];return Boolean(record&&record.consent);
}
function selectVideoModel(provider,model){
 if(!VIDEO_OPTIONS[provider]?.includes(model))return;
 S.videoProvider=provider;S.videoModel=model;if(provider==="grok")S.videoRatio="16:9";
 updateComposerModel();syncMiniTools();
}
function chooseChatVideo(provider,model){
 if(S.busy||!VIDEO_OPTIONS[provider]?.includes(model))return;
 if(S.freeToolsMode)setFreeToolsMode(false);
 if(S.workMode)setWorkMode(false);
 hideAttachMenu();closeMenu();selectVideoModel(provider,model);setComposerMode("video");
 $("prompt").focus({preventScroll:true});
}
async function generateMedia(){if(!S.user){show("authDialog");return}await runFreeDraw()}
const oauthBase64=(b)=>btoa(Array.from(b,x=>String.fromCharCode(x)).join("")).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"");
async function beginOpenRouterOAuth(){
 if(!S.user){show("authDialog");return}
 const verifier=oauthBase64(crypto.getRandomValues(new Uint8Array(32)));
 const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(verifier)));
 const state=oauthBase64(crypto.getRandomValues(new Uint8Array(16)));
 sessionStorage.setItem("aigzt:or-pkce",JSON.stringify({verifier,state,created:Date.now(),model:S.provider==="openrouter"?S.model:undefined}));
 const callback=new URL("/",location.origin);
 callback.searchParams.set("oauth_state",state);
 location.assign("https://openrouter.ai/auth?callback_url="+encodeURIComponent(callback.toString())+
  "&code_challenge="+oauthBase64(digest)+"&code_challenge_method=S256");
}
async function finishOpenRouterOAuth(){
 const u=new URL(location.href),code=u.searchParams.get("code"),state=u.searchParams.get("oauth_state");
 if(!code)return;
 history.replaceState(null,"",location.pathname);
 const pending=sessionStorage.getItem("aigzt:or-pkce");
 sessionStorage.removeItem("aigzt:or-pkce");
 if(!pending||!state){flashError("OpenRouter 授权状态已失效，请重新登录授权");return}
 let saved;
 try{saved=JSON.parse(pending)}catch{flashError("OpenRouter 授权状态损坏");return}
 if(saved.state!==state||Date.now()-saved.created>600000){flashError("OpenRouter 授权超时或校验失败");return}
 if(!S.user){flashError("请先登录 IMAI 后重新授权 OpenRouter");return}
 try{
  const result=await api("/api/openrouter/exchange",{code,verifier:saved.verifier});
  const d=await api("/api/connections",{provider:"openrouter",apiKey:result.key,model:saved.model||undefined,consent:false});
  S.savedProviders.openrouter={model:d.connection.model,consent:false,verified:!!d.connection.verified,updatedAt:d.connection.updatedAt};
  S.connected.openrouter=d.models||[];
  S.provider="openrouter";S.model=d.connection.model;S.modelTitle="OpenRouter · "+S.model;S.allowPaid=false;rememberChatModelSelection();updateModelTitle();
  refreshSourceChips();$("keyProvider").value="openrouter";refreshKeyPanel();show("keyDialog");
  $("keyStatus").textContent="授权成功，密钥已加密保存";
 }catch(e){flashError("OpenRouter 授权失败："+humanError(e))}
}
async function login(event){
 event.preventDefault();
 const form=$("authForm"),email=form.elements.email.value.trim(),password=form.elements.password.value;
 $("authSubmit").disabled=true;$("authError").textContent="";
 try{
  const d=await api(S.authRegister?"/api/register":"/api/login",{email,password});
  S.user=d.user;hide("authDialog");form.reset();newChat();
  await Promise.all([fetchMe(),fetchProjects(),fetchChats(),fetchConnections(),fetchWorkTasks()]);
  const brand=pendingHomeBrand;pendingHomeBrand=null;if(brand)openHomeBrand(brand);
 }catch(e){$("authError").textContent=humanError(e)}
 finally{$("authSubmit").disabled=false}
}
function toggleAuth(){
 S.authRegister=!S.authRegister;
 $("authTitle").textContent=S.authRegister?"注册":"登录";
 $("authSubmit").textContent=S.authRegister?"注册":"登录";
 $("switchAuth").textContent=S.authRegister?"已有账号？登录":"没有账号？注册";
 $("authError").textContent="";
 $("authPassword").setAttribute("autocomplete",S.authRegister?"new-password":"current-password");
}
async function account(){
 if(!S.user){show("authDialog");return}
 if(!confirm("确定退出当前 IMAI 账号？聊天记录会保存在你的云端。"))return;
 try{await api("/api/logout",{});stopDrawBatch();$("drawResults").replaceChildren();$("drawPrevious").replaceChildren();$("drawPreviousSection").hidden=true;$("drawElapsed").hidden=true;$("drawElapsed").textContent="00:00";$("createStatus").textContent="";uploadedFilesOwner=null;uploadedFilesSignature="";++uploadedFilesRequest;$("savedFiles").replaceChildren();S.user=null;S.quota=null;S.chats=[];S.chatId=null;++S.workEpoch;S.workBusy=false;S.keys={};S.connected={};S.savedProviders={};S.connectionsLoaded=false;S.connectionsLoading=false;S.freeToolsMode=false;S.freeToolsCategory="全部";chatComposerBeforeWork=null;workComposerDraft=null;restoredChatModelOwner=null;restoredWorkModelOwner=null;workModelPreference=null;S.workStages=[];setFreeDefault(false);S.workTasks=[];S.workDetail=null;S.workTaskId=null;setWorkMode(false);renderWorkDetail();renderWorkTasks();S.projects=[];S.activeProjectId=null;S.notes=[];newChat();setAuthUI();renderHistory();renderProjects()}
 catch(e){flashError("退出失败："+humanError(e))}
}
async function verifyKey(event){
 event.preventDefault();
 if(!S.user){show("authDialog");return}
 const p=$("keyProvider").value,key=$("personalKey").value.trim(),shortcut=homeBrandBinding?.provider===p?homeBrandBinding:null;
 if(!key){if(S.savedProviders[p]){await useSavedConnection();return}$("keyStatus").textContent="请先从官方页面获取 API Key";return}
 const submit=event.submitter||$("keyForm").querySelector('[type="submit"]');
 if(submit)submit.disabled=true;
 $("keyStatus").textContent="验证连接中…";
 try{
  const manualModel=$("manualModel").value.trim();
  const selectedModel=keyBackPage==="workModelDialog"?(currentWorkStage().step.provider===p?currentWorkStage().step.model:""):S.provider===p&&!VIDEO_ONLY_PROVIDERS.has(p)?S.model:"";
  const data=await api("/api/connections",{provider:p,apiKey:key,model:manualModel||selectedModel||undefined,consent:$("allowPaid").checked});
  const rec=data.connection;
  if(!rec)throw Error("密钥保存失败");
  S.savedProviders[p]={model:rec.model||"",consent:!!rec.consent,verified:!!rec.verified,updatedAt:rec.updatedAt};
  if(VIDEO_ONLY_PROVIDERS.has(p))delete S.connected[p];else S.connected[p]=Array.isArray(data.models)?data.models:[];
  delete S.keys[p];
  if(shortcut){
   refreshSourceChips();refreshKeyPanel();
   if(rec.verified){homeBrandBinding=null;hide("keyDialog");openHomeBrandModels(shortcut)}
   else $("keyStatus").textContent=data.warning||"密钥已保存，模型目录待验证";
   return;
  }
  if(keyBackPage==="workModelDialog"&&!VIDEO_ONLY_PROVIDERS.has(p)){
   refreshSourceChips();refreshKeyPanel();if(rec.verified&&rec.model){keyBackPage=null;hide("keyDialog");show("workModelDialog");renderWorkAgentCatalog();await chooseDedicatedWorkModel(p,rec.model)}else $("keyStatus").textContent=data.warning||"密钥已保存，请验证后选择工作模型";return;
  }
  if(rec.model&&!VIDEO_ONLY_PROVIDERS.has(p)&&!S.videoPendingKeyReturn){
   S.provider=p;S.model=rec.model;
   S.modelTitle=p+" · "+(S.connected[p].find(m=>m.id===rec.model)?.name||rec.model);
   S.selectedFree=isFreeModel(p,rec.model);
   rememberChatModelSelection();
  }
  if(!VIDEO_ONLY_PROVIDERS.has(p)&&!S.videoPendingKeyReturn)S.allowPaid=!!rec.consent;
  updateModelTitle();refreshSourceChips();
  refreshKeyPanel();$("keyStatus").textContent=data.warning||(rec.verified?"密钥已保存，下次打开直接使用":"密钥已保存，请选择官方模型 ID");
  if(VIDEO_ONLY_PROVIDERS.has(p)||S.videoPendingKeyReturn){
   $("keyStatus").textContent=rec.consent?"视频密钥已加密保存并授权，可以在聊天中生成视频。":"视频密钥已保存，但尚未授权收费调用。";
   if(rec.consent){hide("keyDialog");if(S.videoPendingKeyReturn){S.videoPendingKeyReturn=false;setComposerMode("video");$("prompt").focus({preventScroll:true})}}
  }else if(rec.consent&&rec.verified&&rec.model){hide("keyDialog");$("prompt").focus()}
 }catch(e){$("keyStatus").textContent="连接失败："+humanError(e)}
 finally{if(submit)submit.disabled=false}
}
function syncInstalledPwaLayout(){
 const ios=/iPhone|iPad|iPod/i.test(navigator.userAgent);
 const installed=navigator.standalone===true||(ios&&window.matchMedia("(display-mode: standalone)").matches);
 document.documentElement.classList.toggle("aigzt-ios-pwa",ios&&installed);
}
// Chat-only shortcuts: reveal on manual scrolling, without changing message geometry.
function wireChatScrollArrows(){
 const viewport=$("conversation"),control=$("chatScrollArrows"),up=$("chatScrollUp"),down=$("chatScrollDown");
 if(!viewport||!control||!up||!down)return;
 let intentUntil=0,timer=null;
 const hideArrows=()=>{clearTimeout(timer);timer=null;control.hidden=true};
 const valid=()=>!viewport.hidden&&!viewport.classList.contains("empty-chat")&&!S.workMode&&!S.freeToolsMode&&!$("shell").classList.contains("menu-open")&&viewport.scrollHeight-viewport.clientHeight>16;
 const showArrows=()=>{
  if(!valid()){hideArrows();return}
  const main=viewport.parentElement.getBoundingClientRect(),bounds=viewport.getBoundingClientRect();
  control.style.bottom=Math.max(8,main.bottom-bounds.bottom+10)+"px";
  up.disabled=viewport.scrollTop<=5;down.disabled=viewport.scrollHeight-viewport.clientHeight-viewport.scrollTop<=5;
  control.hidden=false;clearTimeout(timer);timer=setTimeout(hideArrows,2000);
 };
 const mark=()=>{intentUntil=Date.now()+2200};
 viewport.addEventListener("touchmove",mark,{passive:true});
 viewport.addEventListener("wheel",mark,{passive:true});
 viewport.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse")mark()},{passive:true});
 viewport.addEventListener("scroll",()=>{if(!valid())hideArrows();else if(Date.now()<intentUntil||!control.hidden)showArrows()},{passive:true});
 const jump=end=>{if(!valid()){hideArrows();return}mark();viewport.scrollTo({top:end?viewport.scrollHeight:0,behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"instant":"smooth"});showArrows()};
 up.addEventListener("click",()=>jump(false));down.addEventListener("click",()=>jump(true));
 window.addEventListener("resize",hideArrows,{passive:true});
 window.visualViewport?.addEventListener("resize",hideArrows,{passive:true});
 document.addEventListener("visibilitychange",()=>{if(document.hidden)hideArrows()});
 const observer=new MutationObserver(()=>{if(!valid())hideArrows()});
 observer.observe(viewport,{attributes:true,attributeFilter:["hidden","class"]});observer.observe($("shell"),{attributes:true,attributeFilter:["class"]});
}

function wire(){
 syncInstalledPwaLayout();
 wireDrawerGestures();
 for(const button of $("homeAiBrands").querySelectorAll("button[data-brand]"))button.addEventListener("click",()=>openHomeBrand(button.dataset.brand));
 $("sidebarChatScroll").addEventListener("scroll",()=>{positionHistoryActions();void loadOlderHistory()},{passive:true});
 window.addEventListener("resize",positionHistoryActions,{passive:true});
 window.visualViewport?.addEventListener("resize",positionHistoryActions,{passive:true});
 $("actionsDialog").addEventListener("close",()=>{if(!$("actionsDialog").open)closeHistoryActions()});
 document.addEventListener("pointerdown",event=>{
  if(historyActionAnchor&&!$("actionsDialog").contains(event.target)&&!historyActionAnchor.contains(event.target))closeHistoryActions();
 });
 // Capture click also covers iOS touch-generated clicks and keyboard activation.
 document.addEventListener("click",closeOutsideMessageMore,true);
 $("conversation").addEventListener("scroll",closeMessageMore,{passive:true});
 window.addEventListener("resize",closeMessageMore,{passive:true});
 document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMessageMore()});
 window.addEventListener("resize",refreshUserMessageFolds,{passive:true});
 window.addEventListener("hashchange",restoreWorkspaceRoute);
 window.addEventListener("popstate",restoreWorkspaceRoute);
 $("menuBtn").addEventListener("click",openMenu);
 $("sideShade").addEventListener("click",closeMenu);
 $("navChat").addEventListener("click",()=>{S.activeProjectId=null;S.archivedView=false;newChat();void fetchChats();renderProjects()});
 $("projectsToggle").addEventListener("click",()=>{S.projectsExpanded=!S.projectsExpanded;renderProjects()});
 $("navModels").addEventListener("click",()=>{closeMenu();openModels()});
 $("navFreeTools").addEventListener("click",()=>enterWorkspace("tools"));
 $("navDraw").addEventListener("click",openCreate);
 $("freeToolsClose").addEventListener("click",returnWorkspace);
 $("freeToolsSearch").addEventListener("input",renderFreeTools);
 $("navWork").addEventListener("click",()=>enterWorkspace("work"));
 $("navCode").addEventListener("click",startCoding);
 
 $("domesticProviderList");initDomesticProviderLinks();
 $("workClose").addEventListener("click",returnWorkspace);
 $("workNewTask").addEventListener("click",newWorkDraft);
 $("workSettingsOpen").addEventListener("click",()=>{renderWorkEditor();show("workSettingsDialog");void wkConnections()});
 $("workHistoryOpen").addEventListener("click",()=>{renderWorkTasks();show("workHistoryDialog");void fetchWorkTasks()});
 $("workEmpty").querySelectorAll("[data-work-draft]").forEach(button=>button.addEventListener("click",()=>{if(S.workBusy)return;const input=$("prompt");if(input.value.trim())return input.focus();input.value=button.dataset.workDraft+"\n";settlePromptSize();input.focus()}));
 $("workModelChoose").addEventListener("click",()=>{
  $("workModelMessage").textContent="";
  $("workSpecificChooser").hidden=true;
  $("workSpecificChooser").replaceChildren();
  S.workPickingProvider="";
  const p=currentWorkStage().step.provider;
  S.workModelRegion=["yandex","gigachat"].includes(p)?"俄罗斯":
    ["qwen","deepseek","zhipu","kimi","minimax","siliconflow","doubao","qianfan","hunyuan","novai_pro"].includes(p)?"中国":
    ["groq","openrouter","cerebras","openai","claude","novai","grok","gemini"].includes(p)?"国际":"推荐";
  renderWorkAgentCatalog();show("workModelDialog");
  requestAnimationFrame(()=>{$("workModelDialog").querySelector(".work-model-dialog-content").scrollTop=0});
 });
 $("workAddStage").addEventListener("click",()=>{if(S.workStages.length<12){S.workStages.push({name:"新步骤",instruction:"",provider:"auto",model:""});renderWorkEditor()}});

 $("workSaveConfig").addEventListener("click",()=>void saveWorkConfiguration());
 $("workContinue").addEventListener("click",()=>void executeWorkTask(S.workTaskId));
 $("workStop").addEventListener("click",()=>void stopWorkTask());
 $("workDelete").addEventListener("click",()=>void deleteWorkTask());
 $("workExport").addEventListener("click",exportWorkTask);

 $("workGithubForm").addEventListener("submit",e=>{e.preventDefault();void wkConnect("github")});
 $("workDbForm").addEventListener("submit",e=>{e.preventDefault();void wkConnect("supabase")});
 $("workGithubDisconnect").addEventListener("click",()=>void wkDisconnect("github"));
 $("workDbDisconnect").addEventListener("click",()=>void wkDisconnect("supabase"));
 $("workRepoRead").addEventListener("click",()=>void wkReadRepo());
 $("workDbPreview").addEventListener("click",()=>void wkReadDb());
 $("workRepoContext").addEventListener("click",()=>void wkContext("github"));
 $("workDbContext").addEventListener("click",()=>void wkContext("supabase"));
 $("workPropose").addEventListener("click",()=>void wkPropose());
 $("workCommit").addEventListener("click",()=>void wkCommit());
 $("workDeploy").addEventListener("click",()=>void wkDeploy());
 $("workRuns").addEventListener("click",()=>void wkRuns());

 $("groqQuick").addEventListener("click",()=>{hide("modelDialog");openKeyPanel("groq","modelDialog")});
 $("imageQuick").addEventListener("click",()=>{hide("modelDialog");setComposerMode("image");$("toolTray").hidden=true;$("prompt").focus()});
 $("navFiles").addEventListener("click",()=>void openFiles());
 $("navKeys").addEventListener("click",()=>{closeMenu();openKeyPanel()});
 $("groqConnect").addEventListener("click",()=>openKeyPanel("groq"));
 $("newChat").addEventListener("click",newChat);
 $("headerChatModels").addEventListener("click",()=>{if(!S.workMode&&!S.freeToolsMode){if(S.composerMode==="video"){S.source="all";S.filter="video";S.query="";S.modelPage=0}openModels()}});
 $("headerNew").addEventListener("click",()=>S.workMode?newWorkDraft():newChat());
 $("searchBtn").addEventListener("click",()=>{closeMenu();show("searchDialog");$("chatSearchInput").focus()});
 $("newProject").addEventListener("click",()=>openProject());
 $("accountBtn").addEventListener("click",()=>{if(!S.user)show("authDialog");else void openSettings()});
 $("accountAvatar").addEventListener("click",()=>{if(!S.user)show("authDialog")});
 $("settingsBtn").addEventListener("click",()=>void openSettings());
 $("settingsCustom").addEventListener("toggle",event=>{if(event.currentTarget.open)void loadModelInstruction()});
 for(const radio of els('input[name="chatTextSize"]')){
  radio.addEventListener("change",()=>{if(radio.checked){previewChatTextSize(radio.value);$("chatTextSizeStatus").textContent=""}});
 }
 $("chatTextSizeSave").addEventListener("click",()=>{
  const selected=$('settingsTextSize').querySelector('input[name="chatTextSize"]:checked')?.value||"normal";
  if(!Object.hasOwn(CHAT_TEXT_SIZES,selected))return;
  try{localStorage.setItem(CHAT_TEXT_SIZE_KEY,selected)}
  catch{$("chatTextSizeStatus").textContent="保存失败，请检查浏览器存储权限";return;}
  applyChatTextSize(selected);
  $("chatTextSizeStatus").textContent="已保存，聊天文字大小已应用";
 });
 $("settingsDictationLang").addEventListener("change",event=>{
  const lang=event.target.value;
  if(!["auto","zh-CN","zh-TW","en-US","ja-JP"].includes(lang))return;
  try{localStorage.setItem("aigzt:dictation-language",lang)}catch{flashError("语音语言设置未保存，请检查浏览器权限")}
 });
 $("settingsOpenConnections").addEventListener("click",()=>{hide("settingsDialog");openKeyPanel(undefined,"settingsDialog")});
 $("settingsOpenFiles").addEventListener("click",()=>{hide("settingsDialog");void openFiles()});
 $("settingsOpenCoding").addEventListener("click",()=>{
  if($("prompt").value.trim()&&!confirm("进入编程助手会替换当前未发送的草稿，继续吗？"))return;
  hide("settingsDialog");startCoding();
 });
 $("settingsExportChat").addEventListener("click",()=>{
  if(!S.chatId)return;
  const btn=$("settingsExportChat");btn.disabled=true;
  void exportChat(S.chatId).catch(e=>flashError(humanError(e))).finally(()=>{btn.disabled=false});
 });
 /* Photo input is physically over the labeled control; native click opens the iOS picker. */
 for(const id of ["avatarInput","avatarQuickInput"]){$(id).addEventListener("change",e=>{
  const file=e.target.files?.[0];e.target.value="";
  if(!file)return;
  if(S.user&&!$("settingsDialog").open){$("settingsEmail").textContent=S.user.email;show("settingsDialog")}
  void uploadAvatar(file);
 })}
 $("settingsLogout").addEventListener("click",()=>{hide("settingsDialog");void account(true)});
 $("projectForm").addEventListener("submit",e=>void saveProject(e));
 $("deleteProject").addEventListener("click",()=>void deleteProject());
 $("searchForm").addEventListener("submit",searchChats);
 $("chatSearchInput").addEventListener("compositionstart",()=>{chatSearchComposing=true;clearTimeout(chatSearchTimer);++chatSearchSerial});
 $("chatSearchInput").addEventListener("compositionend",()=>{chatSearchComposing=false;queueChatSearch()});
 $("chatSearchInput").addEventListener("input",e=>{if(!chatSearchComposing&&!e.isComposing)queueChatSearch()});
 $("searchDialog").addEventListener("close",()=>{clearTimeout(chatSearchTimer);++chatSearchSerial;chatSearchComposing=false});
 $("memoryForm").addEventListener("submit",e=>void saveNote(e));
 $("settingMemory").addEventListener("change",e=>{S.memoryEnabled=e.target.checked;void persistPrefs().catch(err=>flashError(humanError(err)))});
 $("settingRainbow").addEventListener("change",e=>{applyTheme(e.target.checked?"rainbow":"plain");void persistPrefs().catch(err=>flashError(humanError(err)))});
 $("archivedChats").addEventListener("click",()=>void listArchived());
 $("modelInstructionSave").addEventListener("click",()=>void saveModelInstruction());
 $("savedMessagesBtn").addEventListener("click",()=>void toggleSavedMessages());
 
 $("attachButton").addEventListener("click",()=>{if($("attachMenu").hidden){$("attachMenu").hidden=false}else hideAttachMenu()});
 // Native <label for=file-input> activation is a real iPhone user gesture.
 for(const id of ["cameraAction","photosAction","filesAction"]){
  // Leave native label's default activation untouched until the OS picker opens.
  $(id).addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();$(id).click()}});
 }
 $("toolsAction").addEventListener("click",()=>{const tray=$("toolTray");tray.hidden=!tray.hidden;$("toolsAction").setAttribute("aria-expanded",String(!tray.hidden))});
 for(const id of ["attachmentInput","cameraInput","photosInput"]){$(id).addEventListener("change",e=>{hideAttachMenu();void uploadSelected(Array.from(e.target.files||[]));e.target.value=""})}
 $("imageMode").addEventListener("click",()=>{
  hideAttachMenu();setComposerMode(S.composerMode==="image"?"text":"image");
  $("prompt").focus({preventScroll:true});
 });
 $("videoMode").addEventListener("click",()=>{
  hideAttachMenu();
  if(S.composerMode==="video")setComposerMode("text");
  else{selectVideoModel("freetext",VIDEO_OPTIONS.freetext[0]);setComposerMode("video")}
  $("prompt").focus({preventScroll:true});
 });
 $("codeToggle").addEventListener("click",()=>{
  hideAttachMenu();
  if(S.composerMode!=="text")setComposerMode("text");
  S.code=!S.code;
  $("codeToggle").classList.toggle("active",S.code);
  $("codeToggle").setAttribute("aria-pressed",String(S.code));
  $("prompt").placeholder=S.code?"描述编程任务…":"向 AI 提问…";
  updateComposerModel();
  $("prompt").focus({preventScroll:true});
 });
 for(const [id,action] of [["miniImageEdit","image-edit"],["miniImageVideo","image-video"],["miniFrameVideo","frame-video"]]){
  $(id).addEventListener("click",()=>chooseMiniTool(action));
 }
 $("composerSwitchModel").addEventListener("click",()=>{
  hideAttachMenu();
  if(S.composerMode!=="text"||S.code){S.code=false;$("codeToggle").classList.remove("active");$("codeToggle").setAttribute("aria-pressed","false");setComposerMode("text");$("prompt").focus({preventScroll:true})}
  else if(S.workMode)$("workModelChoose").click();else openModels();
 });
 $("chatForm").addEventListener("submit",e=>{e.preventDefault();hideAttachMenu();void sendMessage()});
 $("prompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){e.preventDefault();void sendMessage()}});
 $("prompt").addEventListener("input",settlePromptSize);
 $("prompt").addEventListener("focus",syncMobileHeight);
 $("prompt").addEventListener("blur",()=>{syncMobileHeight();settlePromptSize()});
 window.addEventListener("resize",syncMobileHeight,{passive:true});
 window.addEventListener("orientationchange",()=>{composerViewportBaseline=0;installedStableWidth=0;document.documentElement.style.removeProperty("--aigzt-pwa-height");syncMobileHeight()},{passive:true});
 if(window.visualViewport){
  window.visualViewport.addEventListener("resize",syncMobileHeight,{passive:true});
  window.visualViewport.addEventListener("scroll",()=>{if(!document.documentElement.classList.contains("aigzt-ios-pwa")||document.documentElement.classList.contains("aigzt-keyboard-visible")||document.activeElement===$("prompt"))syncMobileHeight()},{passive:true});
 }
 syncMobileHeight();

 document.addEventListener("click",e=>{if(!$("attachMenu").hidden&&!$("attachMenu").contains(e.target)&&!$("attachButton").contains(e.target))hideAttachMenu()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")hideAttachMenu()});
 for(const btn of els("[data-close]"))btn.addEventListener("click",()=>backDialog(btn.dataset.close));
 $("authForm").addEventListener("submit",e=>void login(e));
 $("switchAuth").addEventListener("click",toggleAuth);
 $("keyForm").addEventListener("submit",e=>void verifyKey(e));
 $("useSavedKey").addEventListener("click",()=>void useSavedConnection());
 $("allowPaid").addEventListener("change",()=>{
  const provider=$("keyProvider").value,consent=$("allowPaid").checked;
  if(!S.savedProviders[provider])return;
  void api("/api/connections/"+provider+"/consent",{consent}).then(()=>{
    S.savedProviders[provider].consent=consent;
    if(S.provider===provider)S.allowPaid=consent;
    $("keyStatus").textContent=consent?"已授权使用个人额度":"已关闭个人额度授权";
  }).catch(e=>{$("allowPaid").checked=!consent;$("keyStatus").textContent=humanError(e)});
 });
 $("openrouterLogin").addEventListener("click",()=>void beginOpenRouterOAuth().catch(e=>{$("keyStatus").textContent=humanError(e)}));
 $("keyProvider").addEventListener("change",refreshKeyPanel);
 $("providerPicker").addEventListener("toggle",()=>{if($("providerPicker").open)renderProviderPicker()});
 $("bindProviderQuick").addEventListener("click",()=>{hide("modelDialog");openKeyPanel(undefined,"modelDialog");$("providerPicker").open=true;renderProviderPicker()});
 $("disconnectProvider").addEventListener("click",()=>void removeSavedKey());
 $("modelSearch").addEventListener("input",e=>{S.query=e.target.value;S.modelPage=0;renderModels()});
 $("modelFilter").addEventListener("change",e=>{S.filter=e.target.value;S.modelPage=0;renderModels()});
 for(const btn of els("#sourceChips .chip"))btn.addEventListener("click",()=>activateSource(btn.dataset.source));
 $("moreModels").addEventListener("click",()=>{S.modelPage++;renderModels()});
 $("createButton").addEventListener("click",()=>void generateMedia());
 $("drawCancel").addEventListener("click",stopDrawBatch);
 drawPrefs();wireImageViewer();
 // Closing the page must not cancel a task or delete images; cancellation is explicit via drawCancel.
 $("keyDialog").addEventListener("close",()=>{if(!$("keyDialog").open){S.videoPendingKeyReturn=false;keyBackPage=null;homeBrandBinding=null}});
 if(VOICE_CHAT_ENABLED)voiceWire();
 wireDictation();wireReplyLevel();wireChatScrollArrows();
}
function hideAttachMenu(){$("attachMenu").hidden=true;$("toolTray").hidden=true;$("toolsAction").setAttribute("aria-expanded","false")}

document.addEventListener("DOMContentLoaded",async()=>{
 wire();renderIcons();applyChatTextSize(savedChatTextSize());let enabled=true;try{enabled=localStorage.getItem("aigzt:rainbow")!=="0"}catch{}
 applyTheme(enabled?"rainbow":"plain");syncHomeAmbient();document.documentElement.classList.remove("pwa-boot-rainbow");setFreeDefault();resizePrompt();await fetchMe();await Promise.all([fetchProjects(),fetchChats(),fetchConnections(),fetchWorkTasks()]);await finishOpenRouterOAuth();
 // Fresh launches always start at the homepage; opening history explicitly restores local media.
 syncWorkspaceRoute("");showWelcome();updateModelTitle();
});