"use strict";
const S={
 user:null,quota:null,chats:[],chatId:null,model:"free:auto",
 modelTitle:"免费自动",provider:"free",keys:{},connected:{},selectedFree:true,connectionsLoaded:false,connectionsLoading:false,
 allowPaid:false,savedProviders:{},freeToolsMode:false,freeToolsCategory:"全部",projectsExpanded:false,freeModels:[{id:"free:auto",name:"免费自动",provider:"free",type:"text",free:true}],freePoolRoutes:[],remoteModels:[],freeTierModels:[],sharedFreeModels:[],loadedCatalog:false,
 modelPage:0,source:"all",filter:"all",query:"",busy:false,code:false,
 authRegister:false,createMode:"image",drawBatch:null,composerMode:"text",creativeMode:null,attachments:[],projects:[],activeProjectId:null,actionChatId:null,editProjectId:null,archivedView:false,memoryEnabled:true,notes:[],currentTheme:"rainbow"
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
 'briefcase':'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 13h20M10 13v2h4v-2"/>',
 'folder-plus':'<path d="M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4l2 2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z M12 10v6m-3-3h6"/>',
 dice:'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="7.5" cy="7.5" r="0.9"/><circle cx="16.5" cy="7.5" r="0.9"/><circle cx="12" cy="12" r="0.9"/><circle cx="7.5" cy="16.5" r="0.9"/><circle cx="16.5" cy="16.5" r="0.9"/>',
 menu:'<path d="M4 6h16M4 12h10M4 18h16"/>',
 "arrow-left":'<path d="M19 12H5m7 7-7-7 7-7"/>',
 'panel-left':'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
 layers:'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',
 zap:'<path d="m13 2-3 8h8l-7 12 2-9H5l8-11Z"/>',
 'list-checks':'<path d="m3 7 2 2 3-3M3 15l2 2 3-3M12 8h9M12 16h9"/>',
 x:'<path d="M18 6 6 18M6 6l12 12"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 'square-pen':'<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M16 3a2.83 2.83 0 1 1 4 4l-9 9-4 1 1-4Z"/>',
 search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
 'audio-lines':'<path d="M2 10v4m4-8v12m4-15v18m4-13v8m4-11v14m4-11v6"/>',
 'copy':'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
 'message-circle':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
 compass:'<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
 paperclip:'<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 1 1 5.66 5.66L9.4 17.41a2 2 0 0 1-2.83-2.83l8.48-8.49"/>',
 link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
 'circle-user':'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="9" r="3"/><path d="M6 19a6 6 0 0 1 12 0"/>',
 settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
 folder:'<path d="M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.7.9l1 1.2a2 2 0 0 0 1.5.9H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z"/>',
 'folder-open':'<path d="M2 18V6a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.7.9l1 1.2a2 2 0 0 0 1.5.9H20a2 2 0 0 1 2 2v1"/><path d="M4 20h14.3a2 2 0 0 0 1.9-1.4L22 12a1 1 0 0 0-1-1H7a2 2 0 0 0-1.9 1.4L2.8 19a1 1 0 0 0 1.2 1Z"/>',
 languages:'<path d="M2 5h12M7 2h1M4 14l6-6 2-3M5 8l6 6"/><path d="m22 22-5-10-5 10M14 18h6"/>',
 scan:'<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><rect x="8" y="8" width="8" height="8" rx="1"/><circle cx="12" cy="12" r="1"/>',
 film:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4"/><path d="m10 8 5 4-5 4z"/>',
 clapperboard:'<rect x="3" y="10" width="18" height="11" rx="2"/><path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4M7 4l4 6M15 4l4 6"/><path d="m10 13 5 3-5 3z"/>',
 'chevron-down':'<path d="m6 9 6 6 6-6"/>',
 'chevron-right':'<path d="m9 18 6-6-6-6"/>',
 history:'<path d="M3 12a9 9 0 1 1 9 9 9.75 9.75 0 0 1-6.74-2.74L3 15"/><path d="M3 21v-6h6"/><path d="M12 7v5l4 2"/>',
 database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>',
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
  if(el.closest(".model-mode-button,.composer-model-switch,.sidebar-projects,.sidebar-mode-dock,#projectDialog,#moveDialog,#videoProjectDialog,#filmSettingsDialog,#filmHistoryDialog")){el.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>';continue;}
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
 if(S.freeToolsMode){returnWorkspace();return}
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
  const replyEdge=!open&&!S.freeToolsMode&&touch.clientX<=replyEdgeWidth;
  if(blockedTarget(target,replyEdge))return;
  let action="",direction=0;
  if(open){
   if(!(target instanceof Element)||!target.closest("#sidebar,#sideShade"))return;
   action="close";direction=-1;
  }else if(S.freeToolsMode){
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
  else if(origin.action==="open"&&!open&&!S.freeToolsMode)openMenu();

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
async function api(path,body,timeoutMs=0){
 const options={headers:{Accept:"application/json"},credentials:"same-origin",cache:"no-store"};
 if(body!==undefined){
  options.method="POST";options.headers["content-type"]="application/json";options.body=JSON.stringify(body);
 }
 const controller=timeoutMs?new AbortController():null,timer=controller?setTimeout(()=>controller.abort(),timeoutMs):null;
 if(controller)options.signal=controller.signal;
 try{
  let resp;
  try{resp=await fetch(path,options)}catch(e){throw Error(e?.name==="AbortError"?"连接超时，请重试":"网络连接失败，请检查当前网络")}
  const data=await resp.json().catch(()=>null);
  if(!resp.ok||!data?.ok)throw Object.assign(Error(data?.error||"请求失败，HTTP "+resp.status),{code:data?.code||null,upstreamStatus:data?.upstreamStatus||null});
  return data;
 }finally{if(timer!==null)clearTimeout(timer)}
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
 resetVideoProjectOwner(uid);
 $("accountName").textContent=logged?S.user.email:"登录 / 注册";
 $("avatarQuickInput").disabled=!logged;
 if(uid!==avatarOwner){avatarOwner=uid;refreshAvatar()}
 const q=S.quota;
 $("quotaLabel").textContent=logged?(Number.isFinite(q?.remaining)&&Number.isFinite(q?.limit)?"免费请求保护配额："+q.remaining+"/"+q.limit:"上游额度以实际统计为准"):"外部免费 · 登录后使用";
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
 cerebras:{url:"https://cloud.cerebras.ai/platform",name:"打开 Cerebras 密钥控制台"},
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
 kimi:{url:"https://platform.kimi.com/console/api-keys",name:"获取 Kimi 密钥"},
 minimax:{url:"https://platform.minimaxi.com/user-center/basic-information/interface-key",name:"获取 MiniMax 密钥"},
 siliconflow:{url:"https://cloud.siliconflow.cn/account/ak",name:"获取硅基流动密钥"},
 doubao:{url:"https://console.volcengine.com/ark/region:cn-beijing/apikey",name:"获取豆包 / 方舟密钥"},
 qianfan:{url:"https://console.bce.baidu.com/qianfan/ais/console/apiKey",name:"获取百度千帆密钥"},
 hunyuan:{url:"https://console.cloud.tencent.com/hunyuan/start",name:"打开腾讯混元 API 开通与密钥页面"},
 stepfun:{url:"https://platform.stepfun.com/interface-key",name:"获取阶跃星辰 API Key"},
 xiaomi:{url:"https://platform.xiaomimimo.com/#/console/api-keys",name:"获取小米 MiMo API Key"},
 longcat:{url:"https://longcat.chat/platform/",name:"获取美团 LongCat API Key"},
 baichuan:{url:"https://platform.baichuan-ai.com/",name:"获取百川智能 API Key"},
 iflytek:{url:"https://console.xfyun.cn/services/bm35",name:"获取讯飞星火 API Password"},
 sensetime:{url:"https://token.sensetime.com/",name:"获取商汤 SenseNova API Key"},
 yandex:{url:"https://aistudio.yandex.cloud/platform/",name:"获取 Yandex AI Studio 密钥"},
 gigachat:{url:"https://developers.sber.ru/studio/workspaces/",name:"打开 GigaChat 项目授权控制台"}
};
const MODEL_FIELD_LINKS=Object.freeze({openai:"https://platform.openai.com/docs/models",claude:"https://platform.claude.com/docs/en/about-claude/models/overview",groq:"https://console.groq.com/docs/models",openrouter:"https://openrouter.ai/models",deepseek:"https://api-docs.deepseek.com/quick_start/pricing",cerebras:"https://inference-docs.cerebras.ai/"});
function refreshManualFieldLink(){
 const provider=$("keyProvider").value,link=$("manualModelLink"),value=$("manualModel").value.trim();
 if(provider==="yandex"){
  const folder=value.match(/^gpt:\/\/([^/]+)\//)?.[1]||value;
  const valid=/^b1g[a-z0-9]{8,61}$/i.test(folder);
  const url=valid?"https://console.yandex.cloud/folders/"+encodeURIComponent(folder):"https://console.yandex.cloud/";
  link.href=url;link.textContent="获取 Folder ID ↗";
  $("yandexPermissionsLink").href=url;
  $("yandexAccessLinks").hidden=false;
 }else{
  link.href=MODEL_FIELD_LINKS[provider]||KEY_SITES[provider].url;
  link.textContent=MODEL_FIELD_LINKS[provider]?"查看模型 ↗":"服务商控制台 ↗";
  $("yandexAccessLinks").hidden=true;
 }
}
const VIDEO_ONLY_PROVIDERS=new Set(["runway","luma","vidu","freetext","freewan","freeloop"]);
const RETIRED_VIDEO_MODEL_IDS=new Set(["wan2.2-ti2v","wan2.2-i2v-fast","wan2.2-firstlast","grok-imagine-video-1.5","gen4.5","veo3.1_fast","seedance2_fast","ray-2","ray-flash-2","viduq3-turbo","viduq3-pro","viduq2"]);
const retiredVideoModel=(provider,id)=>VIDEO_ONLY_PROVIDERS.has(provider)||RETIRED_VIDEO_MODEL_IDS.has(String(id||"").split("/").pop());
const THIRD_PARTY_PROVIDERS=new Set(["openrouter","groq","cerebras","novai","novai_pro","siliconflow"]);
const PROVIDER_BRAND_DOMAINS={freetext:"ltx.studio",openai:"openai.com",claude:"anthropic.com",gemini:"google.com",grok:"x.ai",deepseek:"deepseek.com",qwen:"qwen.ai",zhipu:"bigmodel.cn",kimi:"kimi.com",minimax:"minimax.io",doubao:"doubao.com",qianfan:"baidu.com",hunyuan:"tencent.com",stepfun:"stepfun.com",xiaomi:"mi.com",longcat:"longcat.chat",baichuan:"baichuan-ai.com",iflytek:"xfyun.cn",sensetime:"sensetime.com",yandex:"yandex.com",gigachat:"giga.chat",runway:"runwayml.com",luma:"lumalabs.ai",vidu:"vidu.com",openrouter:"openrouter.ai",groq:"groq.com",cerebras:"cerebras.ai",novai:"novai.su",novai_pro:"aiapi-pro.com",siliconflow:"siliconflow.cn"};
const providerRoute=p=>p==="free"||["freetext","freewan","freeloop"].includes(p)?"free":THIRD_PARTY_PROVIDERS.has(p)?"third":Object.hasOwn(KEY_SITES,p)?"official":"unknown";
const providerRouteLabel=p=>({official:"官方直连",third:"第三方",free:"免费线路",unknown:"其他线路"})[providerRoute(p)];
const modelRoute=m=>m.availableWith==="openrouter-key"?"openrouter":m.provider;
const CHAT_PROVIDER_LABELS=Object.freeze({free:"免费自动",freetext:"LTX",freewan:"Wan",freeloop:"Wan",openrouter:"OpenRouter",groq:"Groq",openai:"OpenAI",claude:"Claude",gemini:"Gemini",grok:"Grok",qwen:"千问",cerebras:"Cerebras",deepseek:"DeepSeek",yandex:"Yandex",gigachat:"GigaChat",runway:"Runway",luma:"Luma",vidu:"Vidu"});
function providerLabel(p){return Object.hasOwn(CHAT_PROVIDER_LABELS,p)?CHAT_PROVIDER_LABELS[p]:$("keyProvider")?.querySelector('option[value="'+p+'"]')?.textContent||p}
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
 const summaryKey=p+":"+Boolean(S.savedProviders[p])+":"+Boolean(S.savedProviders[p]?.verified);if(summary.dataset.provider!==summaryKey){summary.dataset.provider=summaryKey;summary.replaceChildren(providerLogo(p),node("strong","",providerLabel(p)),node("span","compact-connect-state"+(S.savedProviders[p]?.verified?" connected":""),S.savedProviders[p]?.verified?"已连接":S.savedProviders[p]?"待验证":""))}
 if(!picker.open)return;
 const options=Array.from(select.options);
 const signature=p+"|"+options.map(o=>o.value+":"+Boolean(S.savedProviders[o.value])).join("|");
 if(list.dataset.signature===signature)return;list.dataset.signature=signature;list.replaceChildren();
 for(const kind of ["official","third"]){
  const heading=node("div","provider-picker-heading",kind==="official"?"官方直连 · 优先绑定":"第三方聚合 / 推理平台");
  const grid=node("div","provider-picker-grid");
  for(const o of options.filter(o=>providerRoute(o.value)===kind)){
   const id=o.value,b=node("button","provider-picker-option"+(id===p?" selected":""));b.type="button";b.setAttribute("aria-pressed",String(id===p));
   const info=node("span","provider-picker-info");info.append(node("strong","",o.textContent),node("small","",S.savedProviders[id]?.verified?"已连接":S.savedProviders[id]?"待验证":""));
   b.append(providerLogo(id),info);b.addEventListener("click",()=>{select.value=id;picker.open=false;refreshKeyPanel()});grid.append(b);
  }list.append(heading,grid);
 }
}
function connected(p){return !!(S.savedProviders[p]||S.keys[p])}
function refreshKeyPanel(){
 const provider=$("keyProvider").value,rec=S.savedProviders[provider],site=KEY_SITES[provider];
 renderProviderPicker();
 const a=$("providerKeyLink");a.href=site.url;a.textContent="获取";a.title=site.name;
 $("providerHelp").textContent=provider==="yandex"?"使用 AI Studio 创建的密钥与同一文件夹 ID。需要有效计费账户；本站不自动开通付费。":
 provider==="gigachat"?"填写 GigaChat 项目的授权密钥（默认个人版 PERS；企业版可加 B2B: 前缀）。本站按需兑换短期令牌。":
 provider==="iflytek"?"使用官方 HTTP API Password；模型目录可能不支持，请按控制台填写实际模型 ID（例如 generalv3.5），未实测不会显示已验证。":
 provider==="sensetime"?"使用 TokenPlan 的 API Key，模型是否可调用以该账号目录和权限为准。":
 VIDEO_ONLY_PROVIDERS.has(provider)?"专用于视频生成。密钥加密保存，只有点击生成并授权额度才会发起可能收费的请求。":
 provider==="qwen"?"请选择新加坡地区的密钥。":
 provider==="novai"?"聚合多个模型。API 使用 us.novaiapi.com/v1，免费模型可能变化。":
 provider==="novai_pro"?"部分 Flash 模型限额免费；其他模型可能收费。":
 provider==="openrouter"?"可用官方账号授权，或创建 API Key。":"登录服务商账号创建 API Key，再返回粘贴。";
 $("personalKey").value="";
 $("personalKey").placeholder=rec?"••••••••••":"API Key";
 $("keySaveLabel").textContent="连接";
 $("savedConnectionPanel").hidden=!rec;
 $("useSavedKey").hidden=!rec;
 $("disconnectProvider").hidden=!rec;
 if(!$("personalKey").value)$("keyAdvanced").open=!rec;
 $("keyAdvancedSummary").textContent=rec?"更换 API Key（不需要时无需展开）":"首次连接 · 输入 API Key";
 $("manualModelWrap").hidden=provider==="openrouter"||provider==="gemini"||VIDEO_ONLY_PROVIDERS.has(provider);
 const manualInput=$("manualModel"),manualWrap=$("manualModelWrap");
 if(manualInput.dataset.provider!==provider){
  manualInput.dataset.provider=provider;manualInput.value=provider==="yandex"?(String(rec?.model||"").match(/^gpt:\/\/([^/]+)\//)?.[1]||""):"";
 }
 $("manualModelLabel").textContent=provider==="yandex"?"Folder ID":"模型 ID（选填）";
 manualInput.oninput=refreshManualFieldLink;refreshManualFieldLink();
 manualInput.placeholder=provider==="yandex"?"b1g…":provider==="gigachat"?"GigaChat":"官方模型 ID";
 $("allowPaid").checked=Boolean(rec?.consent);
 $("keyStatus").textContent=rec&&!rec.verified?"待验证":"";
 $("openrouterLogin").hidden=provider!=="openrouter";
}
let connectionsFlight=null;
async function fetchConnections(){
 const owner=String(S.user?.id||"");
 if(!owner){S.savedProviders={};S.connected={};S.connectionsLoaded=false;return false}
 if(connectionsFlight?.owner===owner)return connectionsFlight.promise;
 const flight={owner,promise:null};connectionsFlight=flight;S.connectionsLoading=true;
 flight.promise=(async()=>{
 try{
  const result=await api("/api/connections",undefined,10000),saved={};
  if(String(S.user?.id||"")!==owner||connectionsFlight!==flight)return false;
  for(const item of result.connections||[]){
   saved[item.provider]={model:item.model||"",consent:!!item.consent,verified:!!item.verified,updatedAt:item.updatedAt};
   if(item.model&&!S.connected[item.provider])S.connected[item.provider]=[{id:item.model,name:item.model,type:/(?:^|[\/_-])whisper(?:$|[\/_-])/i.test(item.model)?"audio":"text"}];
  }
  S.savedProviders=saved;S.connectionsLoaded=true;refreshSourceChips();
  S.allowPaid=Boolean(S.savedProviders[S.provider]?.consent);
  S.selectedFree=isFreeModel(S.provider,S.model);
  updateModelTitle();
  if(!$("keyDialog").open||!$("personalKey").value)refreshKeyPanel();
  if($("modelDialog").open)renderModels();
  return true;
 }catch(e){
  if(String(S.user?.id||"")===owner&&connectionsFlight===flight){
   if($("keyDialog").open){refreshKeyPanel();$("keyStatus").textContent="连接同步失败："+humanError(e)+"，可重试或使用自动模式"}
  }
  return false;
 }finally{if(connectionsFlight===flight){connectionsFlight=null;S.connectionsLoading=false}}
 })();
 return flight.promise;
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
let restoredChatModelOwner=null,chatModelPreferenceReady=false,freeModeChoosing=false,accountFetchEpoch=0,accountCheckedAt=0;
let selectedChatMode="auto",modeSwitchSerial=0,composerCatalogMode=null;
function chatModelStorageKey(userId){return "aigzt:chat-model:v1:"+String(userId)}
const PERSONAL_FREE_CHOICES=new Set([["groq","openai/gpt-oss-20b","GPT-OSS 20B"],["groq","openai/gpt-oss-120b","GPT-OSS 120B"],["groq","qwen/qwen3.8-27b","Qwen 3.8 27B"],["gemini","gemini-3.8-flash","Gemini 3.8 Flash"],["gemini","gemini-3.5-flash-lite","Gemini 3.5 Flash-Lite"],["gemini","gemini-3.6-flash","Gemini 3.6 Flash"],["gemini","gemini-3.5-flash","Gemini 3.5 Flash"],["gemini","gemma-4-26b-a4b-it","Gemma 4 26B A4B"],["gemini","gemma-4-31b-it","Gemma 4 31B"],["gemini","gemini-3.1-flash-lite","Gemini 3.1 Flash-Lite"],["gemini","gemini-2.5-flash","Gemini 2.5 Flash"],["gemini","gemini-2.5-flash-lite","Gemini 2.5 Flash-Lite"]].map(([provider,model])=>provider+"\0"+model));
function personalFreeChoice(provider,model){return provider!=="free"&&!!provider&&!!model&&(isFreeModel(provider,model)||PERSONAL_FREE_CHOICES.has(provider+"\0"+model))}
function modeStorageKey(owner){return chatModelStorageKey(owner)+":mode"}
function saveModeIdentity(){if(S.user?.id)writeModelPref(modeStorageKey(S.user.id),{mode:selectedChatMode,provider:S.provider,model:S.model})}

const modelPrefSync={owner:null,loaded:false,loading:null,attemptedAt:0,revision:{chat:0},serial:0,versions:{chat:0},queue:Promise.resolve()};
function modelPrefLocalKey(owner,mode){return chatModelStorageKey(owner)}
function modelPrefPendingKey(owner,mode){return modelPrefLocalKey(owner,mode)+":pending"}
function readModelPref(key){try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}}
function writeModelPref(key,value){try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,JSON.stringify(value))}catch{}}
function activateModelPrefOwner(owner){
 if(modelPrefSync.owner===owner)return;
 Object.assign(modelPrefSync,{owner,loaded:false,loading:null,attemptedAt:0,revision:{chat:0},versions:{chat:0},queue:Promise.resolve()});
 modelPrefSync.serial++;
}
function enqueueModelPref(mode,pref,baseRevision){
 const owner=String(S.user?.id||"");if(!owner)return;
 activateModelPrefOwner(owner);
 const serial=modelPrefSync.serial,version=++modelPrefSync.versions[mode],key=modelPrefPendingKey(owner,mode);
 const selection={provider:pref.provider,model:pref.model,title:pref.title||""};
 writeModelPref(key,{...selection,baseRevision:baseRevision??(modelPrefSync.loaded?modelPrefSync.revision[mode]:null)});
 const run=async()=>{
  if(S.user?.id!==owner||modelPrefSync.serial!==serial)return;
  try{
   const data=await api("/api/model-preferences",{owner,mode,...selection,...(baseRevision!==undefined?{baseRevision}:{})});
   if(S.user?.id!==owner||modelPrefSync.serial!==serial||data.owner!==owner)return;
   modelPrefSync.revision[mode]=data.preference.updatedAt;
   if(modelPrefSync.versions[mode]===version)writeModelPref(key,null);
  }catch(e){
   if(S.user?.id===owner&&modelPrefSync.serial===serial&&modelPrefSync.versions[mode]===version){
    if(baseRevision!==undefined&&/其他设备已更新/.test(String(e.message||""))){writeModelPref(key,null);modelPrefSync.loaded=false;modelPrefSync.attemptedAt=0;void hydrateModelPreferences(owner)}
    else flashError("模型选择已保存在本机，云端同步暂未成功");
   }
  }
 };
 modelPrefSync.queue=modelPrefSync.queue.catch(()=>{}).then(run);
}
function rememberChatModelSelection(){
 if(!S.user?.id)return;
 const pref={provider:S.provider,model:S.model,title:S.modelTitle};
 freeModeChoosing=false;
 if(S.provider==="free"){selectedChatMode="auto";if(S.model!=="free:auto"){setFreeDefault(false);pref.model=S.model;pref.title=S.modelTitle}}
 else if(S.provider&&S.model){if(selectedChatMode!=="free"||!personalFreeChoice(S.provider,S.model))selectedChatMode="personal";writeModelPref(chatModelStorageKey(S.user.id)+":manual",pref)}
 saveModeIdentity();if(!S.provider||!S.model)return;
 try{localStorage.setItem(chatModelStorageKey(S.user.id),JSON.stringify(pref))}catch{}
 enqueueModelPref("chat",pref);
}
async function hydrateModelPreferences(owner){
 if(!owner)return;
 activateModelPrefOwner(owner);
 if(modelPrefSync.loaded)return;
 if(modelPrefSync.loading)return modelPrefSync.loading;
 if(Date.now()-modelPrefSync.attemptedAt<15000)return;
 modelPrefSync.attemptedAt=Date.now();
 const serial=modelPrefSync.serial,versions={...modelPrefSync.versions};
 const job=(async()=>{
  try{
   const data=await api("/api/model-preferences",undefined,8000);
   if(S.user?.id!==owner||modelPrefSync.serial!==serial||data.owner!==owner)return;
   for(const mode of ["chat"]){
    if(versions[mode]!==modelPrefSync.versions[mode]||freeModeChoosing||!S.model)continue;
    if(S.busy){modelPrefSync.attemptedAt=0;return}
    const localKey=modelPrefLocalKey(owner,mode),pendingKey=modelPrefPendingKey(owner,mode);
    const remote=data.preferences?.[mode],pending=readModelPref(pendingKey),local=readModelPref(localKey);
    const revision=remote?.updatedAt||0;modelPrefSync.revision[mode]=revision;
    if(pending&&(!remote||pending.baseRevision===revision)){
     enqueueModelPref(mode,pending,revision);continue;
    }
    if(remote){
     writeModelPref(localKey,{provider:remote.provider,model:remote.model,title:remote.title||""});writeModelPref(pendingKey,null);
     if(mode==="chat"){restoredChatModelOwner=null;restoreChatModelSelection()}
    }else if(local){enqueueModelPref(mode,local,0)}
   }
   modelPrefSync.loaded=true;updateModelTitle();
  }catch(e){/* Local choice remains usable; retry on a later account refresh. */}
 })();
 modelPrefSync.loading=job;
 try{await job}finally{if(modelPrefSync.loading===job)modelPrefSync.loading=null}
}
function restoreChatModelSelection(){
 const id=String(S.user?.id||"");
 if(!id||restoredChatModelOwner===id)return;
 restoredChatModelOwner=id;
 const localMode=readModelPref(modeStorageKey(id));
 if(localMode&&["free","personal"].includes(localMode.mode)&&!localMode.model){selectedChatMode=localMode.mode;S.provider="";S.model="";S.modelTitle="";S.allowPaid=false;S.selectedFree=false;updateModelTitle();return}
 let saved=null;
 try{saved=JSON.parse(localStorage.getItem(chatModelStorageKey(id))||"null")}catch{}
 if(saved&&typeof saved.provider==="string"&&/^[a-z][a-z0-9_-]{0,35}$/.test(saved.provider)&&
   typeof saved.model==="string"&&saved.model.length>0&&saved.model.length<=180&&
   typeof saved.title==="string"&&saved.title.length<=240){
  S.provider=saved.provider;
  S.model=saved.provider==="free"?"free:auto":saved.model;
  selectedChatMode=S.provider==="free"?"auto":localMode?.mode==="free"&&localMode.provider===S.provider&&localMode.model===S.model&&personalFreeChoice(S.provider,S.model)?"free":"personal";
  S.modelTitle=saved.provider==="free"&&S.model==="free:auto"?"免费自动":saved.title;
  // Respect saved consent only after connections have loaded; login requests may finish in either order.
  S.allowPaid=S.connectionsLoaded===true&&Boolean(S.savedProviders[S.provider]?.consent);
  S.selectedFree=isFreeModel(S.provider,S.model);
  if(!isAutoChatModel())writeModelPref(chatModelStorageKey(id)+":manual",{provider:S.provider,model:S.model,title:S.modelTitle});
 }else setFreeDefault(false);
 updateModelTitle();
}
function setFreeDefault(render=true){
 freeModeChoosing=false;selectedChatMode="auto";S.provider="free";S.model="free:auto";S.modelTitle="免费自动";S.allowPaid=false;S.selectedFree=true;
 if(render)updateModelTitle();
}
async function useSavedConnection(){
 const provider=$("keyProvider").value,entry=S.savedProviders[provider];
 if(homeBrandBinding?.provider===provider&&entry){const route=homeBrandBinding;homeBrandBinding=null;hide("keyDialog");openHomeBrandModels(route);return}
 if(!entry){$("keyStatus").textContent="请先保存密钥";return}
 const button=$("useSavedKey");button.disabled=true;
 try{
  if(VIDEO_ONLY_PROVIDERS.has(provider)){hide("keyDialog");return}
  let model=S.provider===provider&&S.model?S.model:entry.model;
  if(provider==="openai"){
   const catalog=await api("/api/connections/openai/models",{});
   if(!catalog.verified||!Array.isArray(catalog.models)||!catalog.models.length)throw Error("OpenAI 官方目录未验证，请稍后再试");
   S.connected.openai=catalog.models;entry.verified=true;refreshSourceChips();
   const directId=S.provider==="openrouter"&&S.model.startsWith("openai/")?S.model.slice(7):null;
   const candidate=[directId,model].find(id=>id&&catalog.models.some(m=>m.id===id&&m.type==="text"));
   if(!candidate){hide("keyDialog");activateSource("openai");openModels(true);return}
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
 const epoch=++accountFetchEpoch;
 try{
  const v=await api("/api/me",undefined,8000);if(epoch!==accountFetchEpoch)return;
  const old=String(S.user?.id||""),owner=String(v.user?.id||"");
  if(old!==owner){++chatOpenEpoch;chatOpenLoading=false;S.savedProviders={};S.connected={};S.connectionsLoaded=false;S.connectionsLoading=false;connectionsFlight=null;restoredChatModelOwner=null;activateModelPrefOwner(owner||null);setFreeDefault(false)}
  S.user=v.user;S.quota=v.quota;S.voiceTranscriptionConfigured=v.voiceTranscriptionConfigured===true;accountCheckedAt=Date.now();if(old&&old!==owner){S.chats=[];S.projects=[];S.notes=[];S.activeProjectId=null;newChat();renderProjects();if(owner){void fetchProjects();void fetchChats()}}setAuthUI();
  restoreChatModelSelection();chatModelPreferenceReady=true;updateModelTitle();void loadModelHistory();
  if(owner){void hydrateModelPreferences(owner);if(!S.connectionsLoaded)void fetchConnections();if($("modelDialog").open)void syncCatalogFavorites("models");if(S.freeToolsMode)void syncCatalogFavorites("tools")}
 }catch(e){if(epoch!==accountFetchEpoch)return;chatModelPreferenceReady=true;updateModelTitle();flashError("账号状态读取失败："+humanError(e))}
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
 for(const p of S.projects){
  const row=node("div","project-row"+(S.activeProjectId===p.id?" active":""));
  const b=node("button","project-select");b.append(iconSlot(S.activeProjectId===p.id?"folder-open":"folder"),node("span","project-name",p.name));b.setAttribute("aria-pressed",String(S.activeProjectId===p.id));b.title=p.name;
  b.addEventListener("click",()=>{S.activeProjectId=p.id;S.archivedView=false;newChat();void fetchChats();renderProjects()});
  const edit=node("button","project-edit");edit.title="项目设置";edit.setAttribute("aria-label","编辑项目");
  edit.append(iconSlot("ellipsis"));edit.addEventListener("click",()=>openProject(p));row.append(b,edit);box.append(row);renderIcons(row);
 }
 if(!S.projects.length)box.append(node("div","hint","暂无个人项目"));
}
const VIDEO_PROJECT_SKILLS=Object.freeze([["视频规划 Skill","list-checks","免费策划","输出主题、受众、分段时长、镜头清单、素材需求和完整时间轴。","https://github.com/agentara/skills/blob/main/skills/aigc/video-plan/SKILL.md"],["Seedance 导演 Skill","clapperboard","免费策划","输出连续镜头脚本、人物一致性约束、镜头运动、转场及逐镜头中英文提示词。","https://github.com/liyue-aigc/seedance-2-5-video-director"],["AI 电影导演 Skills","film","免费策划","输出叙事结构、景别、构图、光线、运镜及逐镜头提示词。","https://github.com/smixs/visual-skills"],["可灵提示词 Skill","file-text","免费策划","输出可灵适用的主体、动作、环境、镜头、时长及负面约束的中英文提示词。","https://github.com/kevingao-ai/kling-ai-guide"],["TikTok 视频 Skill","video","免费策划","输出开场钩子、短视频脚本、镜头、口播、字幕与音乐节奏表。","https://github.com/Fangyuan025/tiktok-video-skill"],["UGC 视频 Skill","camera","免费策划","输出真实感用户原创视频的口播、场景、动作、镜头和字幕脚本，避免虚假体验。","https://github.com/Jarad-z/ugc-video-skill"],["即梦 Skills","image","生成需授权","输出即梦适用的素材与逐镜头中英文提示词；不声称已调用即梦。","https://github.com/full-aigc-skills/dreamina-skills"],["可灵 Skills","video","生成需授权","输出可灵视频镜头描述、动作与镜头约束；不声称已调用可灵。","https://github.com/full-aigc-skills/kling-skills"],["Remotion 视频 Skill","code-2","渲染环境待接入","输出可运行的 Remotion React 源码、素材清单、依赖和本地渲染命令；不声称已经渲染。","https://github.com/remotion-dev/skills"],["HeyGen Hyperframes","layers","渲染环境待接入","输出 HTML 动画视频场景、时间轴、素材清单及渲染步骤；不声称已经渲染。","https://github.com/heygen-com/hyperframes"]]);
let filmStage="script",filmPlanJob=null,filmPlanOwner=null,filmPlanEpoch=0,filmPlanBusy=false,filmPlanStopPending=false,filmPlanCreating=false,filmPrefs=null,filmSettingsEpoch=0,filmHistoryEpoch=0;
const filmDrafts={project:null,script:null,storyboard:null};
function initFilmSkills(){
 const choice=$("videoSkillChoice"),list=$("videoSkillList");if(choice.options.length)return;
 const auto=node("option","","自动匹配");auto.value="auto";choice.append(auto);
 VIDEO_PROJECT_SKILLS.forEach(([name,icon,status,task,url],index)=>{
  const option=node("option","",name);option.value=String(index);choice.append(option);
  const row=node("div","video-skill-row"),button=node("button","video-skill-select"),label=node("span","video-skill-label");button.type="button";label.append(node("strong","",name),node("small","",status));button.append(iconSlot(icon),label);button.addEventListener("click",()=>{choice.value=String(index);choice.focus({preventScroll:true})});
  const source=node("a","video-skill-source","来源");source.href=url;source.target="_blank";source.rel="noopener noreferrer";source.setAttribute("aria-label",name+" 技能来源");row.append(button,source);list.append(row);renderIcons(row);
 });
}
function filmPlanUI(status,busy){$("filmPlanStatus").textContent=status;$("videoProjectPlan").disabled=busy;$("filmPlanStop").hidden=!busy;$("filmPlanStop").disabled=filmPlanStopPending;}
// Structured project results and read-only compatibility with old Markdown records.
function filmCleanText(value){return String(value||"").replace(/\*\*|__|^[ \t]*#{1,6}\s+/gm,"").trim()}
function filmProjectContent(draft){
 const raw=String(draft?.result||"").trim();
 if(!raw)return {title:"",script:"",shots:[]};
 let parsed=null;try{parsed=JSON.parse(raw.replace(/^\s*```(?:json)?\s*|\s*```\s*$/gi,""))}catch{}
 if(parsed&&typeof parsed==="object"&&!Array.isArray(parsed)){
  const shots=(Array.isArray(parsed.shots)?parsed.shots:[]).slice(0,20).flatMap((x,i)=>{
   const prompt=String(x?.prompt||x?.prompt_zh||x?.prompt_en||"").trim();
   if(!prompt||prompt.length>1200)return [];
   const duration=[3,5,8].includes(Number(x.duration))?Number(x.duration):5;
   return [{number:i+1,title:filmCleanText(x.title||"镜头 "+(i+1)).slice(0,100),description:filmCleanText(x.description||prompt).slice(0,500),prompt,duration}];
  });
  return {title:filmCleanText(parsed.title).slice(0,120),script:filmCleanText(parsed.script),shots};
 }
 const shots=[];let header=null;
 for(const line of raw.split("\n")){
  if(!line.includes("|"))continue;
  const cells=line.trim().replace(/^\||\|$/g,"").split("|").map(filmCleanText);
  if(cells.some(x=>/提示词|English Prompt|prompt/i.test(x))&&cells.some(x=>/时长|秒|duration/i.test(x))){header=cells;continue}
  if(!header||cells.length!==header.length||!/^镜头\s*\d+|\d+$/i.test(cells[0])||cells.every(x=>/^[-: ]+$/.test(x)))continue;
  const find=re=>header.findIndex(x=>re.test(x));
  const pi=find(/中文.*提示词|正向.*提示词|^提示词$|^prompt$/i),en=find(/English Prompt|英文.*提示词/i),di=find(/时长|秒|duration/i),desc=find(/动作|画面内容|描述|场景/i);
  const prompt=String(cells[pi]||cells[en]||"").trim();if(!prompt||prompt.length>1200)continue;
  const n=Number((cells[di]||"").match(/\d+(?:\.\d+)?/)?.[0]||5),duration=[3,5,8].reduce((a,b)=>Math.abs(b-n)<Math.abs(a-n)?b:a);
  shots.push({number:shots.length+1,title:"镜头 "+(shots.length+1),description:cells[desc]||prompt,prompt,duration});if(shots.length>=20)break;
 }
 return {title:"",script:draft.kind==="script"||!shots.length?filmCleanText(raw):"",shots};
}
function currentFilmDraft(){return filmDrafts.project||filmDrafts.storyboard||filmDrafts.script}
function renderFilmDraft(){
 const draft=currentFilmDraft(),root=$("filmShotList");root.replaceChildren();$("filmPlanOutput").hidden=!draft;if(!draft)return;
 const data=filmProjectContent(draft);$("filmOutputTitle").textContent=data.title||"创作结果";$("filmPlanResult").value=draft.result||"";
 $("filmScriptDetails").hidden=!data.script;$("filmScriptText").textContent=data.script;$("filmScriptDetails").open=!!data.script&&!data.shots.length;
 for(const shot of data.shots){
  const row=node("article","film-shot"),head=node("div","film-shot-heading");head.append(node("strong","",String(shot.number).padStart(2,"0")+" · "+shot.title),node("span","film-shot-duration",shot.duration+" 秒"));row.append(head,node("p","",shot.description));
  const detail=node("details","film-shot-prompt"),summary=node("summary","","查看提示词");detail.append(summary,node("p","",shot.prompt));row.append(detail);
  if(!filmSequence||filmSequence.planId!==draft.id){const button=node("button","film-shot-generate","生成视频");button.type="button";button.addEventListener("click",()=>void generateFilmShot(shot));row.append(button)}root.append(row);
 }
 if(!data.shots.length&&draft.kind!=="script")root.append(node("p","video-project-note","此记录未包含可识别的镜头，仍可查看原内容或直接生成视频。"));
}
function selectFilmStage(stage){
 filmStage=stage==="video"?"video":"script";
 $("filmPlanPanel").hidden=filmStage==="video";$("filmVideoPanel").hidden=filmStage!=="video";
 if(filmStage!=="video")renderFilmDraft();
}
async function generateFilmShot(shot){
 if(filmSequenceRunning){filmPlanUI("完整影片正在制作",false);return}
 if(videoProjectJob||videoProjectSubmitting){selectFilmStage("video");return}
 $("videoProjectPrompt").value=shot.prompt;$("videoProjectRatio").value=shot.ratio||$("filmQuickRatio").value;$("videoProjectDuration").value=String(shot.duration);$("filmSelectedShot").textContent=shot.title||"视频制作";selectFilmStage("video");await startVideoProject({preventDefault(){}});
}
function openVideoProject(){
 initFilmSkills();show("videoProjectDialog");void loadFilmPreferences(false);void restoreFilmSequence();
}
function filmCurrent(owner,epoch){return S.user?.id===owner&&epoch===filmPlanEpoch;}
function resetFilmOwner(owner){
 if(filmPlanOwner===owner)return;
 resetFilmSequence(owner);
 filmPlanOwner=owner;++filmPlanEpoch;++filmSettingsEpoch;++filmHistoryEpoch;filmPlanJob=null;filmPlanBusy=false;filmPlanStopPending=false;filmPlanCreating=false;filmPrefs=null;filmDrafts.project=null;filmDrafts.script=null;filmDrafts.storyboard=null;
 $("filmPlanPrompt").value="";$("filmPlanResult").value="";$("filmApiKey").value="";$("filmQuotaResults").replaceChildren();$("filmHistoryList").replaceChildren();filmPlanUI("",false);selectFilmStage("script");
}
async function restoreFilmPlans(){
 const owner=S.user?.id;if(!owner||filmPlanBusy)return;const epoch=filmPlanEpoch;
 try{const d=await api("/api/film/history",undefined,10000);if(!filmCurrent(owner,epoch)||filmPlanBusy)return;
  for(const stage of ["project","script","storyboard"]){const row=d.plans?.find(x=>x.kind===stage&&x.status==="complete");if(row&&!filmDrafts[stage])filmDrafts[stage]=row}
  if(filmStage!=="video")renderFilmDraft();
  const active=d.plans?.find(x=>x.status==="pending"||x.status==="running");
  if(active&&!filmPlanBusy){filmPlanJob=active.id;filmPlanBusy=true;filmPlanUI("恢复创作任务…",true);void advanceFilmPlan(owner,epoch,active.id)}
 }catch{}
}
async function startVideoProjectPlan(e){
 e.preventDefault();if(filmPlanBusy)return;
 if(!S.user){show("authDialog");return}
 const topic=$("filmPlanPrompt").value.trim();if(!topic||filmStage==="video")return;
 const owner=S.user.id,epoch=++filmPlanEpoch,id=crypto.randomUUID(),kind="project";
 filmPlanJob=id;filmPlanBusy=true;filmPlanStopPending=false;filmPlanCreating=true;filmPlanUI("创作中…",true);
 try{
  const result=await api("/api/film/plan/create",{id,kind,prompt:topic,source:""},15000);
  if(!filmCurrent(owner,epoch))return;filmPlanCreating=false;filmPlanJob=result.job.id;
  if(filmPlanStopPending){filmPlanStopPending=false;await stopFilmPlan();return}
  await advanceFilmPlan(owner,epoch,result.job.id);
 }catch(e){if(!filmCurrent(owner,epoch))return;filmPlanBusy=false;filmPlanJob=null;filmPlanStopPending=false;filmPlanCreating=false;filmPlanUI(humanError(e),false);if(e.code==="FILM_CONSENT_REQUIRED")openFilmSettings()}
}
async function advanceFilmPlan(owner,epoch,id){
 try{
  let d=await api("/api/film/plan/"+id+"/advance",{},110000);
  for(let i=0;i<8&&["pending","running"].includes(d.job?.status);i++){await new Promise(resolve=>setTimeout(resolve,5000));if(!filmCurrent(owner,epoch))return;if(filmPlanStopPending)continue;d=await api("/api/film/plan/"+id,undefined,10000)}
  if(!filmCurrent(owner,epoch)||filmPlanStopPending)return;const job=d.job;
  if(job?.status==="complete"){filmDrafts[job.kind]=job;if(filmStage!=="video")renderFilmDraft();filmPlanUI(job.incomplete?"已保存 · 回复未完整":"已保存",false)}
  else filmPlanUI(job?.status==="cancelled"?"已停止":job?.error||"原任务尚未确认，可从创作记录恢复",false);
 }catch(e){if(filmCurrent(owner,epoch)&&!filmPlanStopPending)filmPlanUI("连接中断，原任务已保留，可从创作记录恢复",false)}
 finally{if(filmCurrent(owner,epoch)&&!filmPlanStopPending){filmPlanBusy=false;filmPlanJob=null}}
}
async function stopFilmPlan(){
 const id=filmPlanJob,owner=S.user?.id;if(!id||!owner||filmPlanStopPending)return;
 filmPlanStopPending=true;filmPlanUI("正在停止…",true);
 if(filmPlanCreating)return;
 try{const r=await api("/api/film/plan/"+id+"/cancel",{},12000);if(S.user?.id!==owner)return;++filmPlanEpoch;filmPlanJob=null;filmPlanBusy=false;filmPlanStopPending=false;if(r.job?.status==="complete"){filmDrafts[r.job.kind]=r.job;if(filmStage!=="video")renderFilmDraft();filmPlanUI("创作已完成",false)}else filmPlanUI("已停止",false)}
 catch(e){if(S.user?.id===owner){filmPlanStopPending=false;filmPlanUI("停止尚未确认，可重试停止",true)}}
}
async function saveFilmDraft(){
 const draft=currentFilmDraft(),owner=S.user?.id;if(!draft||!owner)return;const result=$("filmPlanResult").value.trim();if(!result)return;
 try{const r=await api("/api/film/plan/"+draft.id+"/edit",{result},10000);if(S.user?.id!==owner)return;filmDrafts[draft.kind]=r.job;renderFilmDraft();$("filmEditDetails").open=false;filmPlanUI("已保存",filmPlanBusy)}catch(e){filmPlanUI(humanError(e),filmPlanBusy)}
}

// Film orchestration uses dedicated task IDs and device storage; never chat send state.
let filmSequence=null,filmSequenceOwner=null,filmSequenceEpoch=0,filmSequenceRunning=false,filmSequenceWorker=null,filmSequenceReject=null,filmSequenceUrl=null,filmSequenceCreating=false,filmSequenceStopRequested=false;
function filmSequenceKey(owner){return "aigzt:film-sequence:v1:"+owner}
function filmSequenceSchedule(seconds){const clip=seconds<=60?5:8;return Array.from({length:Math.ceil(seconds/clip)},()=>clip)}
function filmSequenceValid(x){return x&&typeof x.id==="string"&&typeof x.planId==="string"&&Number.isInteger(x.seconds)&&x.seconds>=5&&x.seconds<=120&&Array.isArray(x.clips)&&x.clips.length<=15&&["landscape","portrait","square"].includes(x.ratio)}
function filmSequenceCurrent(owner,epoch){return owner===S.user?.id&&owner===filmSequenceOwner&&epoch===filmSequenceEpoch}
function saveFilmSequence(){if(!filmSequence||!filmSequenceOwner)return;try{localStorage.setItem(filmSequenceKey(filmSequenceOwner),JSON.stringify(filmSequence))}catch{throw Error("无法保存创作进度，请检查本机存储")}}
function filmSequenceDelay(ms){return new Promise(r=>setTimeout(r,ms))}
function filmSequenceUI(message){
 const q=filmSequence,root=$("filmSequenceRows");$("filmSequenceProgress").hidden=!q;$("filmDirectVideo").disabled=filmSequenceRunning;$("filmSequenceStop").hidden=!q||q.phase==="complete"||q.phase==="stopped";$("filmSequenceStop").disabled=filmSequenceStopRequested;$("filmSequenceResume").hidden=!q||filmSequenceRunning||q.phase==="complete";
 $("filmSequenceStatus").textContent=message||q?.message||"";root.replaceChildren();
 if(!q)return;
 const finished=q.clips.filter(x=>x.state==="complete").length;$("filmSequenceBar").value=q.phase==="complete"?100:q.clips.length?Math.floor(10+80*finished/q.clips.length):0;
 for(let i=0;i<q.clips.length;i++){const shot=q.clips[i],line=node("div","film-sequence-row");line.append(node("span","",String(i+1).padStart(2,"0")+" · "+shot.title),node("small","",({waiting:"等待",running:"生成中",complete:"已完成",failed:"待重试"}[shot.state]||"等待")));root.append(line)}
}
function resetFilmSequence(owner){
 if(filmSequenceOwner===owner)return;
 ++filmSequenceEpoch;filmSequenceOwner=owner;filmSequence=null;filmSequenceRunning=false;filmSequenceCreating=false;filmSequenceStopRequested=false;
 if(filmSequenceWorker){filmSequenceWorker.terminate();filmSequenceWorker=null}if(filmSequenceReject){filmSequenceReject(Error("任务已停止"));filmSequenceReject=null}
 if(filmSequenceUrl)URL.revokeObjectURL(filmSequenceUrl);filmSequenceUrl=null;$("filmFinalResult").replaceChildren();filmSequenceUI("");
}
async function filmSequenceOutput(owner,epoch,q,blob){
 if(!filmSequenceCurrent(owner,epoch))return;
 if(!(blob instanceof Blob)||!blob.size)throw Error("成片文件未找到");
 if(filmSequenceUrl)URL.revokeObjectURL(filmSequenceUrl);filmSequenceUrl=URL.createObjectURL(blob);
 const root=$("filmFinalResult"),video=node("video");video.controls=true;video.playsInline=true;video.preload="metadata";video.src=filmSequenceUrl;
 const dl=node("a","chat-image-stop","下载 MP4");dl.href=filmSequenceUrl;dl.download="film-"+q.id.slice(0,8)+".mp4";root.replaceChildren(video,dl);
}
async function restoreFilmSequence(){
 const owner=S.user?.id;if(!owner)return;resetFilmSequence(owner);if(filmSequenceRunning)return;
 if(!filmSequence){try{const q=JSON.parse(localStorage.getItem(filmSequenceKey(owner))||"null");if(filmSequenceValid(q))filmSequence=q}catch{}}
 if(!filmSequence){void restoreFilmPlans();void restoreVideoProject();return}
 selectFilmStage("script");$("filmPlanPrompt").value=filmSequence.prompt;$("filmQuickRatio").value=filmSequence.ratio;
 const dur=$("filmQuickDuration");dur.value=[5,15,30,60,120].includes(filmSequence.seconds)?String(filmSequence.seconds):"custom";$("filmCustomDurationWrap").hidden=dur.value!=="custom";$("filmCustomDuration").value=String(filmSequence.seconds);
 const epoch=filmSequenceEpoch,q=filmSequence;
 if(q.planResult){filmDrafts.project={id:q.planId,kind:"project",result:q.planResult};renderFilmDraft()}
 if(q.phase==="complete"){const blob=await deviceMediaGet(owner+":film-final:"+q.id);if(!filmSequenceCurrent(owner,epoch))return;if(blob instanceof Blob&&blob.size)await filmSequenceOutput(owner,epoch,q,blob);else{q.phase="editing";q.message="本机成片已丢失，可使用已保存片段重新剪辑";saveFilmSequence()}}
 filmSequenceUI();
}
async function startFilmSequence(){
 if(filmSequenceRunning||filmSequenceStopRequested||filmPlanBusy||videoProjectJob||videoProjectSubmitting)return;
 if(!S.user){show("authDialog");return}
 if(!filmPrefs?.accepted){openFilmSettings();$("filmSettingsStatus").textContent="请先确认服务授权";return}
 const prompt=$("filmPlanPrompt").value.trim(),choice=$("filmQuickDuration").value,seconds=Number(choice==="custom"?$("filmCustomDuration").value:choice);
 if(!prompt){$("filmPlanPrompt").focus();return}if(!Number.isInteger(seconds)||seconds<5||seconds>120){filmPlanUI("总时长请选择5–120秒",false);return}
 resetFilmSequence(S.user.id);
 if(filmSequence&&filmSequence.phase!=="complete"&&filmSequence.prompt===prompt&&filmSequence.seconds===seconds&&filmSequence.ratio===$("filmQuickRatio").value){void runFilmSequence();return}
 if(filmSequence&&filmSequence.phase!=="complete"){filmSequenceUI("已有未完成作品，请先继续或停止后再创作");if(filmSequence.phase!=="stopped")return}
 filmSequence={id:crypto.randomUUID(),planId:crypto.randomUUID(),prompt,ratio:$("filmQuickRatio").value,seconds,phase:"planning",clips:[],planResult:"",message:"",createdAt:Date.now()};
 if(filmSequenceUrl)URL.revokeObjectURL(filmSequenceUrl);filmSequenceUrl=null;$("filmFinalResult").replaceChildren();filmDrafts.project=null;filmDrafts.storyboard=null;filmDrafts.script=null;renderFilmDraft();
 try{saveFilmSequence();void runFilmSequence()}catch(e){filmSequenceUI(humanError(e))}
}
async function sequencePlan(owner,epoch,q){
 const schedule=filmSequenceSchedule(q.seconds),instruction=q.prompt+"\n按连续短片制作：必须恰好输出 "+schedule.length+" 个镜头，每个镜头 "+schedule[0]+" 秒，全部镜头保持人物、服装、环境和光线一致。";
 filmSequenceCreating=true;let d;
 try{d=await api("/api/film/plan/create",{id:q.planId,kind:"project",prompt:instruction.slice(0,4000),source:""},15000)}finally{filmSequenceCreating=false}
 if(d.job?.id!==q.planId)throw Error("已有另一创作任务，等待其结束后再继续");
 if(!filmSequenceCurrent(owner,epoch))return;
 if(filmSequenceStopRequested){await api("/api/film/plan/"+q.planId+"/cancel",{},12000);return}
 let job=d.job;
 for(let i=0;i<24&&["pending","running"].includes(job?.status);i++){
  if(!filmSequenceCurrent(owner,epoch)||filmSequenceStopRequested)return;
  const r=job.status==="pending"?await api("/api/film/plan/"+q.planId+"/advance",{},110000):await api("/api/film/plan/"+q.planId,undefined,10000);job=r.job;
  if(["pending","running"].includes(job?.status))await filmSequenceDelay(5000);
 }
 if(!filmSequenceCurrent(owner,epoch)||filmSequenceStopRequested)return;
 if(job?.status!=="complete"){if(["failed","cancelled"].includes(job?.status))q.planRetry=true;saveFilmSequence();throw Error(job?.error||"剧本与分镜尚未完成")}
 const data=filmProjectContent(job);
 if(data.shots.length!==schedule.length||job.incomplete){q.planRetry=true;saveFilmSequence();throw Error("分镜数量不完整，继续创作可重新生成分镜")}
 q.planResult=job.result;q.clips=data.shots.map((shot,i)=>({title:shot.title,prompt:shot.prompt,duration:schedule[i],id:crypto.randomUUID(),state:"waiting"}));q.phase="clips";q.planRetry=false;saveFilmSequence();
 filmDrafts.project=job;renderFilmDraft();
}
async function sequenceClip(owner,epoch,q,clip,index){
 const key=owner+":film-clip:"+clip.id;
 let blob=await deviceMediaGet(key);
 if(blob instanceof Blob&&blob.size){clip.state="complete";saveFilmSequence();return}
 if(clip.state==="complete"){blob=await deviceMediaBlob("/api/video/result/"+clip.id);if(!(blob instanceof Blob)||!blob.size)throw Error("第"+(index+1)+"段原文件不可读取；不会自动重新生成");if(!await deviceMediaPut(key,blob))throw Error("本机存储空间不足");return}
 if(clip.state==="failed"){clip.id=crypto.randomUUID();clip.state="waiting";saveFilmSequence();return sequenceClip(owner,epoch,q,clip,index)}
 clip.state="running";q.message="第 "+(index+1)+" / "+q.clips.length+" 段生成中";saveFilmSequence();filmSequenceUI();
 filmSequenceCreating=true;let result;
 try{result=await api("/api/video/project/create",{requestId:clip.id,prompt:clip.prompt,ratio:q.ratio,duration:clip.duration,mode:"film"},15000)}finally{filmSequenceCreating=false}
 if(result.job?.id!==clip.id)throw Error("另一视频任务尚未完成，请稍后继续");
 if(!filmSequenceCurrent(owner,epoch))return;
 if(filmSequenceStopRequested){await api("/api/video/project/"+clip.id+"/cancel",{},12000);return}
 let job=result.job;
 for(let attempt=0;attempt<45&&!["complete","failed"].includes(job?.status);attempt++){
  if(!filmSequenceCurrent(owner,epoch)||filmSequenceStopRequested)return;
  try{job=await api("/api/video/project/"+clip.id+"/advance",{},200000)}catch{await filmSequenceDelay(12000);continue}
  if(!["complete","failed"].includes(job?.status))await filmSequenceDelay(Math.max(1500,Math.min(15000,(job.waitSeconds||3)*1000)));
 }
 if(!filmSequenceCurrent(owner,epoch)||filmSequenceStopRequested)return;
 if(job?.status==="failed"){clip.state="failed";saveFilmSequence();throw Error("第"+(index+1)+"段："+(job.error||"免费模型暂不可用"))}
 if(job?.status!=="complete")throw Error("第"+(index+1)+"段仍在等待，可继续原任务");
 blob=await deviceMediaBlob("/api/video/result/"+clip.id);
 if(!(blob instanceof Blob)||!blob.size)throw Error("第"+(index+1)+"段已生成，等待重新读取文件");
 if(!filmSequenceCurrent(owner,epoch)||filmSequenceStopRequested)return;
 if(!await deviceMediaPut(key,blob))throw Error("本机存储空间不足，无法保存第"+(index+1)+"段");
 clip.state="complete";saveFilmSequence();filmSequenceUI();
}
async function sequenceEdit(owner,epoch,q){
 const blobs=[];let bytes=0;for(const clip of q.clips){const b=await deviceMediaGet(owner+":film-clip:"+clip.id);if(!(b instanceof Blob)||!b.size)throw Error("缺少片段，请继续恢复");bytes+=b.size;if(bytes>160*1024*1024)throw Error("本机剪辑文件超过160MB");blobs.push(b)}
 if(!filmSequenceCurrent(owner,epoch)||filmSequenceStopRequested)return;
 q.phase="editing";q.message="正在自动剪辑合成…";saveFilmSequence();filmSequenceUI();
 const blob=await new Promise((resolve,reject)=>{
  let worker;try{worker=new Worker("/film-editor/worker.js",{type:"module"})}catch(e){reject(e);return}
  filmSequenceWorker=worker;filmSequenceReject=reject;
  const finish=()=>{clearTimeout(timer);worker.terminate();if(filmSequenceWorker===worker){filmSequenceWorker=null;filmSequenceReject=null}};
  const timer=setTimeout(()=>{finish();reject(Error("本机剪辑超时，可继续剪辑，片段已保留"))},300000);
  worker.onmessage=e=>{const d=e.data;if(d.type==="progress"){if(filmSequenceCurrent(owner,epoch)){$("filmSequenceStatus").textContent=d.message||"正在剪辑…";$("filmSequenceBar").value=90+Math.min(9,Math.max(0,d.progress||0)*9)}return}finish();if(d.type==="complete"&&d.blob instanceof Blob)resolve(d.blob);else reject(Error(d.error||"本机剪辑未完成"))};
  worker.onerror=()=>{finish();reject(Error("本机剪辑引擎无法启动，可继续重试"))};
  worker.postMessage({blobs,seconds:q.seconds});
 });
 if(!filmSequenceCurrent(owner,epoch)||filmSequenceStopRequested)return;
 if(!await deviceMediaPut(owner+":film-final:"+q.id,blob))throw Error("成片已生成但本机空间不足，无法持久保存");
 q.phase="complete";q.message="成片已完成";saveFilmSequence();await filmSequenceOutput(owner,epoch,q,blob);
}
async function runFilmSequence(){
 if(filmSequenceRunning||filmSequenceStopRequested||!filmSequence||!S.user)return;
 const owner=S.user.id,epoch=++filmSequenceEpoch,q=filmSequence;filmSequenceRunning=true;filmSequenceStopRequested=false;
 try{
  if(q.phase==="complete")return;
  if(!q.clips.length){if(q.planRetry){q.planId=crypto.randomUUID();q.planRetry=false}q.phase="planning";q.message="正在生成剧本与分镜…";saveFilmSequence();filmSequenceUI();await sequencePlan(owner,epoch,q)}
  if(!filmSequenceCurrent(owner,epoch)||filmSequenceStopRequested)return;
  q.phase="clips";saveFilmSequence();
  for(let i=0;i<q.clips.length;i++){if(!filmSequenceCurrent(owner,epoch)||filmSequenceStopRequested)return;await sequenceClip(owner,epoch,q,q.clips[i],i)}
  if(!filmSequenceCurrent(owner,epoch)||filmSequenceStopRequested)return;
  await sequenceEdit(owner,epoch,q);
 }catch(e){if(filmSequenceCurrent(owner,epoch)&&!filmSequenceStopRequested){q.message=humanError(e);q.phase=q.clips.length?"paused":"planning";try{saveFilmSequence()}catch{};filmSequenceUI()}}
 finally{if(filmSequenceCurrent(owner,epoch)&&!filmSequenceStopRequested){filmSequenceRunning=false;filmSequenceUI()}}
}
async function stopFilmSequence(){
 if(!filmSequence||filmSequence.phase==="complete"||filmSequenceStopRequested||!S.user)return;const owner=S.user.id,epoch=filmSequenceEpoch,q=filmSequence;filmSequenceStopRequested=true;filmSequenceRunning=true;q.message="正在停止…";filmSequenceUI();
 if(filmSequenceWorker){filmSequenceWorker.terminate();filmSequenceWorker=null;if(filmSequenceReject){filmSequenceReject(Error("已停止剪辑"));filmSequenceReject=null}}
 try{
  if(filmSequenceCreating){for(let i=0;i<35&&filmSequenceCreating;i++)await filmSequenceDelay(500);if(filmSequenceCreating)throw Error("提交尚未确认，请重试停止")}
  if(!filmSequenceCurrent(owner,epoch))return;
  const active=q.clips.find(x=>x.state==="running");
  if(active){const r=await api("/api/video/project/"+active.id+"/cancel",{},12000);if(r.status==="failed")active.state="failed"}
  else if(!q.clips.length){const r=await api("/api/film/plan/"+q.planId+"/cancel",{},12000);if(r.job?.status==="cancelled")q.planRetry=true}
  if(!filmSequenceCurrent(owner,epoch))return;++filmSequenceEpoch;q.phase="stopped";q.message="已停止，已完成片段保留";filmSequenceRunning=false;filmSequenceStopRequested=false;saveFilmSequence();filmSequenceUI()
 }catch(e){if(filmSequenceCurrent(owner,epoch)){filmSequenceStopRequested=false;q.message="停止尚未确认："+humanError(e);filmSequenceRunning=false;saveFilmSequence();filmSequenceUI()}}
}

function directFilmVideo(e){e?.preventDefault();void startFilmSequence()}
function updateFilmPersonalFields(){
 const provider=$("filmProvider").value;$("filmPersonalFields").hidden=provider==="auto";$("filmProviderLogo").replaceChildren(providerLogo(provider==="auto"?"free":provider));$("filmVideoLogo").replaceChildren(providerLogo("freetext"));const state=$("filmProviderState"),own=filmPrefs?.connections?.find(x=>x.provider===provider);const verified=provider!=="auto"&&(own?.filmKey===true||(filmPrefs?.provider===provider&&filmPrefs?.hasKey===true));state.textContent=provider==="auto"?"平台免费":verified?"已连接":own?"待验证":"";state.classList.toggle("connected",verified);if(KEY_SITES[provider])$("filmKeyLink").href=KEY_SITES[provider].url;
 if(provider!=="auto"&&filmPrefs?.provider!==provider){
  const item=filmPrefs?.connections?.find(x=>x.provider===provider);
  $("filmModel").value=item?.model||"";$("filmApiKey").value="";$("filmPaidConsent").checked=false;
  $("filmApiKey").placeholder=item?"••••••••••":"API Key";
 }
}
function fillFilmPreferences(p){
 filmPrefs=p;$("filmProvider").value=p.provider||"auto";$("filmModel").value=p.model||"";$("filmApiKey").value="";$("filmApiKey").placeholder=p.hasKey||p.linked?"••••••••••":"API Key";
 $("filmPaidConsent").checked=p.allowPaid===true;$("filmExternalConsent").checked=p.accepted===true;$("filmDefaultRatio").value=p.ratio||"landscape";$("filmDefaultDuration").value=String(p.duration||5);$("videoSkillChoice").value=String(p.skill||"auto");updateFilmPersonalFields();
 if(!videoProjectJob){if(!filmSequence){$("filmQuickRatio").value=p.ratio||"landscape";} $("videoProjectRatio").value=p.ratio||"landscape";$("videoProjectDuration").value=String(p.duration||5)}
}
async function loadFilmPreferences(showStatus=true){
 const owner=S.user?.id;if(!owner)return;const epoch=++filmSettingsEpoch;
 try{const r=await api("/api/film/settings",undefined,10000);if(S.user?.id===owner&&filmSettingsEpoch===epoch)fillFilmPreferences(r.settings)}
 catch(e){if(showStatus&&S.user?.id===owner)$("filmSettingsStatus").textContent=humanError(e)}
}
function openFilmSettings(){initFilmSkills();show("filmSettingsDialog");void loadFilmPreferences();void loadFilmQuota();}
async function saveFilmPreferences(e){
 e.preventDefault();if(!S.user){show("authDialog");return}const owner=S.user.id,button=$("filmSettingsSave");button.disabled=true;$("filmConnect").disabled=true;
 try{const r=await api("/api/film/settings",{provider:$("filmProvider").value,model:$("filmModel").value.trim(),apiKey:$("filmApiKey").value.trim(),allowPaid:$("filmPaidConsent").checked,accepted:$("filmExternalConsent").checked,ratio:$("filmDefaultRatio").value,duration:Number($("filmDefaultDuration").value),skill:$("videoSkillChoice").value},20000);if(S.user?.id===owner){fillFilmPreferences(r.settings);$("filmSettingsStatus").textContent="已保存";void loadFilmQuota()}}
 catch(e){if(S.user?.id===owner)$("filmSettingsStatus").textContent=humanError(e)}
 finally{button.disabled=false;$("filmConnect").disabled=false}
}
async function saveFilmSkill(){
 if(!S.user)return;const owner=S.user.id,skill=$("videoSkillChoice").value;
 try{const r=await api("/api/film/settings/skill",{skill},10000);if(S.user?.id===owner){filmPrefs=r.settings;$("filmSettingsStatus").textContent="技能选择已保存";$("filmSkillSave").textContent="已保存";setTimeout(()=>{$("filmSkillSave").textContent="保存技能选择"},1500)}}catch(e){$("filmSettingsStatus").textContent=humanError(e)}
}
async function clearFilmKey(){if(!S.user)return;try{const r=await api("/api/film/settings/clear-key",{},10000);fillFilmPreferences(r.settings);$("filmSettingsStatus").textContent="已清除电影专用密钥";void loadFilmQuota()}catch(e){$("filmSettingsStatus").textContent=humanError(e)}}
let filmQuotaEpoch=0;
async function loadFilmQuota(){
 const owner=S.user?.id,epoch=++filmQuotaEpoch,root=$("filmQuotaResults");if(!owner){root.replaceChildren(node("p","video-project-note","登录后查看额度"));return}
 root.replaceChildren(node("p","video-project-note","读取额度…"));
 try{const d=await api("/api/film/quota",undefined,15000);if(S.user?.id!==owner||filmQuotaEpoch!==epoch)return;root.replaceChildren();
  for(const q of d.quotas||[]){const group=node("section","film-quota-group");group.append(node("strong","",q.name+" · "+q.kind),node("p","video-project-note",q.model||""));
   if(!q.snapshots?.some(x=>x.fields?.length))group.append(node("p","video-project-note","总量、剩余及重置时间：服务商未提供"));
   for(const snap of q.snapshots||[]){if(!snap.fields?.length)continue;group.append(node("p","video-project-note",(snap.model||"账号额度")+" · "+new Date(snap.at).toLocaleString()+(snap.stale?"（上次记录）":"")));group.append(usageTable(["额度","总量","已用","剩余","重置"],snap.fields.map(f=>[f.label,usageNum(f.limit),usageNum(f.limit-f.remaining),usageNum(f.remaining),f.resetAt?new Date(f.resetAt).toLocaleString():"未提供"])))}
   root.append(group);
  }
  root.append(node("h3","","今日电影模式使用量"),usageTable(["类型 / 模型","任务","成功"],(d.usage||[]).map(x=>[x.kind+" / "+(x.model||"未确认"),usageNum(x.total),usageNum(x.succeeded)])));
 }catch(e){if(S.user?.id===owner&&filmQuotaEpoch===epoch)root.replaceChildren(node("p","video-project-note",humanError(e)))}
}
async function openFilmHistory(){
 show("filmHistoryDialog");const owner=S.user?.id,epoch=++filmHistoryEpoch,root=$("filmHistoryList");root.replaceChildren(node("p","video-project-note",owner?"读取记录…":"登录后查看记录"));if(!owner)return;
 try{const d=await api("/api/film/history",undefined,10000);if(S.user?.id!==owner||filmHistoryEpoch!==epoch)return;root.replaceChildren();
  const entries=[...(d.plans||[]),...(d.videos||[]).map(x=>({...x,kind:"video"}))].sort((a,b)=>b.createdAt-a.createdAt);
  for(const row of entries){const b=node("button","film-history-row");b.type="button";b.append(node("strong","",(row.kind==="project"?"创作":row.kind==="script"?"剧本":row.kind==="storyboard"?"分镜":"成片")+" · "+(row.prompt||"创作记录").slice(0,80)),node("small","",new Date(row.createdAt).toLocaleString()+" · "+({complete:"已完成",cancelled:"已停止",failed:"未完成",pending:"待执行",running:"进行中",recovering:"进行中"}[row.status]||row.status)));b.addEventListener("click",()=>{hide("filmHistoryDialog");if(row.kind==="video"){selectFilmStage("video");if(row.status==="complete"&&!videoProjectJob){const ep=++videoProjectEpoch;void deliverVideoProject(owner,ep,row.id)}else void restoreVideoProject();return}selectFilmStage("script");if(row.status==="complete"){filmDrafts.project=null;filmDrafts.storyboard=null;filmDrafts.script=null;filmDrafts[row.kind]=row;renderFilmDraft()}else void restoreFilmPlans()});root.append(b)}
  if(!entries.length)root.append(node("p","video-project-note","暂无创作记录"));
 }catch(e){if(S.user?.id===owner&&filmHistoryEpoch===epoch)root.replaceChildren(node("p","video-project-note",humanError(e)))}
}
let videoProjectJob=null,videoProjectEpoch=0,videoProjectFlight=false,videoProjectOwner=null,videoProjectObjectUrl=null,videoProjectTimer=null;
let videoProjectSubmitting=false,videoProjectStopPending=false,videoProjectRestoreFlight=null;
function videoProjectUI(status,busy){
 $("videoProjectStatus").textContent=status;$("videoProjectStart").disabled=busy;
 $("videoProjectStop").hidden=!busy;$("videoProjectStop").disabled=!videoProjectJob||videoProjectStopPending;
}
function clearVideoProjectOutput(){
 if(videoProjectObjectUrl)URL.revokeObjectURL(videoProjectObjectUrl);
 videoProjectObjectUrl=null;$("videoProjectResult").replaceChildren();
}
function videoProjectCurrent(owner,epoch){return owner===S.user?.id&&epoch===videoProjectEpoch}
async function showVideoProjectResult(owner,epoch,id){
 const key=owner+":"+id;
 let blob=await deviceMediaGet(key);
 if(!(blob instanceof Blob)||!blob.type.startsWith("video/")){
  blob=await deviceMediaBlob("/api/video/result/"+id);
  if(!(blob instanceof Blob)||!blob.size)throw Error("视频已生成，但原文件暂时不可下载；可重新打开电影模式恢复");
  await deviceMediaPut(key,blob);
 }
 if(!videoProjectCurrent(owner,epoch))return;
 clearVideoProjectOutput();videoProjectObjectUrl=URL.createObjectURL(blob);
 const video=node("video","chat-generated-video");video.controls=true;video.playsInline=true;video.preload="metadata";video.src=videoProjectObjectUrl;
 const link=node("a","chat-image-stop","下载 MP4");link.href=videoProjectObjectUrl;link.download="aigzt-"+id.slice(0,8)+".mp4";
 $("videoProjectResult").append(video,link);videoProjectUI("视频已生成",false);
}
async function deliverVideoProject(owner,epoch,id){
 if(!videoProjectCurrent(owner,epoch))return;
 videoProjectJob=null;videoProjectUI("视频已生成，正在读取文件…",false);
 try{await showVideoProjectResult(owner,epoch,id)}
 catch(e){if(videoProjectCurrent(owner,epoch)){
  videoProjectUI("视频已生成，文件暂不可读取",false);
  const retry=node("button","chat-image-stop","重新读取视频");retry.type="button";retry.addEventListener("click",()=>{retry.remove();void deliverVideoProject(owner,epoch,id)},{once:true});$("videoProjectResult").append(retry);
 }}
}
function scheduleVideoProject(owner,epoch,id,delay=1500){
 clearTimeout(videoProjectTimer);
 videoProjectTimer=setTimeout(()=>void runVideoProject(owner,epoch,id),delay);
}
async function runVideoProject(owner,epoch,id){
 if(!videoProjectCurrent(owner,epoch)||videoProjectFlight)return;
 videoProjectFlight=true;let again=false,delay=3000;
 try{
  const result=await api("/api/video/project/"+id+"/advance",{},200000);
  if(!videoProjectCurrent(owner,epoch))return;
  if(result.status==="complete"){await deliverVideoProject(owner,epoch,id)}
  else if(result.status==="failed"){videoProjectUI(result.cancelled?"已停止生成":result.error||"免费视频服务暂不可用",false);videoProjectJob=null}
  else{const kind=result.mode==="film"?"电影镜头":"视频";videoProjectUI(result.phase==="delivered"?kind+"已生成，正在验证文件…":result.phase==="new"?"等待提交免费模型…":result.phase==="submitting"?"正在连接免费模型…":kind+"生成中 · 共享 GPU 排队",true);again=true;delay=Math.max(1500,Math.min(15000,(result.waitSeconds||3)*1000))}
 }catch(e){
  if(videoProjectCurrent(owner,epoch)){videoProjectUI("连接中断，保留原任务并继续查询",true);again=true;delay=12000}
 }finally{
  if(videoProjectCurrent(owner,epoch)){videoProjectFlight=false;if(again)scheduleVideoProject(owner,epoch,id,delay)}
 }
}
function resetVideoProjectOwner(owner){
 resetFilmOwner(owner);
 if(videoProjectOwner===owner)return;
 clearTimeout(videoProjectTimer);++videoProjectEpoch;videoProjectJob=null;videoProjectFlight=false;videoProjectSubmitting=false;videoProjectStopPending=false;videoProjectRestoreFlight=null;clearVideoProjectOutput();videoProjectOwner=owner;
 $("videoProjectPrompt").value="";videoProjectUI(owner?"":"登录后使用免费视频生成",false);
}
async function restoreVideoProject(){
 const owner=S.user?.id||null;resetVideoProjectOwner(owner);
 if(!owner){videoProjectUI("登录后使用免费视频生成",false);return}
 if(videoProjectJob||videoProjectRestoreFlight)return;
 const epoch=videoProjectEpoch,token={owner,epoch};videoProjectRestoreFlight=token;
 try{
  const r=await api("/api/video/project/latest",undefined,10000);
  if(!videoProjectCurrent(owner,epoch)||videoProjectJob||!r.job)return;
  if(r.job.status==="complete"){await deliverVideoProject(owner,epoch,r.job.id);return}
  if(r.job.status==="pending"||r.job.status==="recovering"){videoProjectJob=r.job.id;videoProjectUI("恢复视频任务…",true);void runVideoProject(owner,epoch,r.job.id)}
  else videoProjectUI(r.job.cancelled?"已停止生成":r.job.error||"",false);
 }catch(e){if(videoProjectCurrent(owner,epoch))videoProjectUI(humanError(e),false)}finally{if(videoProjectRestoreFlight===token)videoProjectRestoreFlight=null}
}
async function startVideoProject(e){
 e.preventDefault();if(!S.user){hide("videoProjectDialog");show("authDialog");return}
 if(videoProjectJob||$("videoProjectStart").disabled)return;
 if(!filmPrefs?.accepted){openFilmSettings();$("filmSettingsStatus").textContent="请先确认服务授权";return}
 const prompt=$("videoProjectPrompt").value.trim();if(!prompt)return;
 const owner=S.user.id,epoch=++videoProjectEpoch,id=crypto.randomUUID();
 videoProjectOwner=owner;videoProjectJob=id;videoProjectFlight=false;videoProjectSubmitting=true;videoProjectStopPending=false;clearTimeout(videoProjectTimer);clearVideoProjectOutput();videoProjectUI("正在创建视频任务…",true);
 const payload={requestId:id,prompt,ratio:$("videoProjectRatio").value,duration:Number($("videoProjectDuration").value),mode:"film"};
 let job=null;
 try{
  const r=await api("/api/video/project/create",payload,15000);job=r.job;
 }catch(e){
  if(!videoProjectCurrent(owner,epoch))return;
  // Reconcile uncertain creation without allocating a second request id.
  try{const latest=await api("/api/video/project/latest",undefined,8000);if(latest.job?.id===id)job=latest.job}catch{}
  if(!videoProjectCurrent(owner,epoch))return;
  if(!job){videoProjectSubmitting=false;videoProjectJob=null;videoProjectStopPending=false;videoProjectUI("原任务未确认，请重新打开页面核对后再生成",false);return}
 }
 if(!videoProjectCurrent(owner,epoch))return;
 videoProjectSubmitting=false;videoProjectJob=job.id;
 if(videoProjectStopPending){videoProjectStopPending=false;void stopVideoProject();return}
 if(job.status==="complete"){await deliverVideoProject(owner,epoch,job.id);return}
 if(job.status==="failed"){videoProjectJob=null;videoProjectUI(job.cancelled?"已停止生成":job.error||"视频任务未完成",false);return}
 videoProjectUI("正在连接 LTX 免费模型…",true);void runVideoProject(owner,epoch,job.id);
}
async function stopVideoProject(){
 const id=videoProjectJob,owner=S.user?.id;if(!id||!owner||videoProjectStopPending)return;
 if(videoProjectSubmitting){videoProjectStopPending=true;videoProjectUI("正在停止生成…",true);return}
 const epoch=++videoProjectEpoch;clearTimeout(videoProjectTimer);videoProjectFlight=false;videoProjectStopPending=true;videoProjectUI("正在停止生成…",true);
 try{
  const r=await api("/api/video/project/"+id+"/cancel",{},12000);
  if(!videoProjectCurrent(owner,epoch))return;
  videoProjectJob=null;videoProjectStopPending=false;
  if(r.status==="complete")await deliverVideoProject(owner,epoch,id);
  else videoProjectUI("已停止生成；已发送的上游计算可能仍在运行",false);
 }catch(e){if(videoProjectCurrent(owner,epoch)){videoProjectStopPending=false;videoProjectUI("停止尚未确认，可重试停止",true)}}
}
let projectFetchSerial=0;
async function fetchProjects(){
 const owner=S.user?.id,seq=++projectFetchSerial;
 if(!owner){S.projects=[];renderProjects();return}
 try{const d=await api("/api/projects");if(owner!==S.user?.id||seq!==projectFetchSerial)return;S.projects=d.projects||[];renderProjects()}
 catch(e){if(owner===S.user?.id&&seq===projectFetchSerial)flashError("项目加载失败："+humanError(e))}
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
async function openSettings(expandUsage=false){
 if(!S.user){show("authDialog");return}
 show("settingsDialog");closeMenu();$("settingsEmail").textContent=S.user.email;
 syncChatTextSizeSettings();
 showDeviceMediaSettings();
 for(const item of $("settingsDialog").querySelectorAll(".settings-entry,.settings-about"))item.open=false;
 $("settingsDialog").querySelector(".settings-scroll").scrollTop=0;
 $("savedMessagesList").hidden=true;
 $("settingsExportChat").disabled=!S.chatId;
 if(expandUsage){$("settingsUsage").open=true;void loadUsageOverview()}
 $("settingsDictationLang").value=settingsDictationLanguage();
 updateTokenSettingsSummary();
 try{
  const owner=S.user?.id;const d=await api("/api/memory");if(owner!==S.user?.id)return;S.notes=d.notes||[];S.memoryEnabled=d.enabled;applyTheme(d.theme);
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
let usageOverviewCache=null,usageOverviewFlight=null;
function usageNum(n){return typeof n==="number"&&Number.isFinite(n)?n.toLocaleString("zh-CN"):"未提供"}
function usageSum(rows){
 return rows.reduce((v,r)=>{for(const k of ["requests","succeeded","failed","reported","input_tokens","output_tokens","total_tokens"])v[k]+=(Number(r[k])||0);return v},{requests:0,succeeded:0,failed:0,reported:0,input_tokens:0,output_tokens:0,total_tokens:0});
}
function usageToken(n,reported,requests){return reported||!requests?usageNum(n):"未报告"}
function usageTable(headers,rows){
 const wrap=node("div","usage-table-wrap"),table=node("table","usage-table"),thead=node("thead"),tr=node("tr");
 for(const x of headers)tr.append(node("th","",String(x)));
 thead.append(tr);table.append(thead);
 const body=node("tbody");
 for(const values of rows){const row=node("tr");for(const x of values)row.append(node("td","",String(x)));body.append(row)}
 table.append(body);wrap.append(table);return wrap;
}
function usageProviderName(p){return p?providerLabel(p):"未确定"}
function usagePercent(pool){
 if(!pool||!pool.known||!Number.isFinite(pool.total)||pool.total<=0)return {percent:null,label:"额度待核实",reference:false};
 if(!pool.unknown)return {percent:100*pool.used/pool.total,label:"已用",reference:false};
 if(Number.isFinite(pool.referencePercent))return {percent:pool.referencePercent,label:"已知消耗 / 参考额度",reference:true};
 return {percent:null,label:"总体额度待核实",reference:false};
}
function usageModeBar(title,mode,total,pool){
 const section=node("section","usage-mode"),head=node("div","usage-mode-head");
 const p=usagePercent(pool),shared=mode==="auto";
 head.append(node("strong","",title),node("span","usage-mode-count",p.percent===null?"—%":p.percent.toLocaleString("zh-CN",{maximumFractionDigits:1})+"%"+(p.reference?" 参考":"")));
 section.append(head);
 const track=node("div","usage-progress"+(p.percent===null?" unknown":p.reference?" reference":""));
 track.setAttribute("role","progressbar");track.setAttribute("aria-label",title+" "+p.label);
 if(p.percent!==null){
  const fill=node("span","usage-progress-fill");fill.style.width=Math.max(0,Math.min(100,p.percent))+"%";
  track.append(fill);track.setAttribute("aria-valuemin","0");track.setAttribute("aria-valuemax","100");track.setAttribute("aria-valuenow",String(p.percent));
  if(p.reference)track.setAttribute("aria-valuetext",p.percent.toFixed(1)+"% 已知消耗占参考额度，其他用量未知");
 }else track.setAttribute("aria-valuetext",p.label);
 section.append(track);
 const foot=node("div","usage-mode-foot");
 foot.append(node("span","","本人今日 "+usageNum(total.requests)+" 次"));
 if(p.reference)foot.append(node("span","","参考 "+usageNum(pool.referenceTotal)+" 次 · 用量未齐"));
 else if(p.percent!==null)foot.append(node("span","",(shared?"共享剩余 ":"剩余 ")+usageNum(pool.remaining)+"/"+usageNum(pool.total)));
 else foot.append(node("span","",p.label));
 section.append(foot);return section;
}
function usageModelRows(d){
 const models=new Map();
 function add(provider,model,name,record){
  provider=provider||"unknown";model=String(model||"未确定").replace(/^free:or\//,"");
  const key=JSON.stringify([provider,model]);
  if(!models.has(key))models.set(key,{provider,model,name:name||model,requests:0});
  const item=models.get(key);if(name)item.name=name;
  if(record)item.requests+=Number(record.requests)||0;
 }
 for(const m of [...(d.automaticModels||d.sharedModels||[]),...(!d.catalogComplete?(S.sharedFreeModels||[]).map(m=>({provider:"openrouter",model:m.sharedModel||m.id,name:m.name})):[])])if(m.model)add(m.provider,m.model,m.name);
 for(const m of d.personalFreeModels||[])if(m.connected)add(m.provider,m.model,m.name);
 for(const q of d.quotas||[])if(q.selectedModel&&q.selectedModel!=="openrouter/free")add(q.provider,q.selectedModel,q.selectedModel==="auto"?usageProviderName(q.provider)+" · 自动":null);
 for(const r of d.rows||[]){
  const provider=r.actual_provider||(r.provider==="free"?(String(r.model).startsWith("free:or/")?"openrouter":"unknown"):r.provider);
  add(provider,r.actual_model||r.model,null,r);
 }
 return [...models.values()].sort((a,b)=>b.requests-a.requests||a.name.localeCompare(b.name,"zh-CN")).map(m=>[m.name+(m.name.startsWith(usageProviderName(m.provider))?"":" · "+usageProviderName(m.provider)),usageNum(m.requests)+" 次"]);
}
function renderUsageOverview(d){
 const root=$("settingsUsageResults"),fragment=document.createDocumentFragment();
 const rows=Array.isArray(d.rows)?d.rows:[],pools=d.pools||{};
 fragment.append(usageModeBar("自动模式","auto",usageSum(rows.filter(r=>r.mode==="auto"||r.mode==="shared")),pools.shared));
 fragment.append(usageModeBar("自由模式","free",usageSum(rows.filter(r=>r.mode==="free")),pools.free));
 fragment.append(usageModeBar("个人模式","personal",usageSum(rows.filter(r=>r.mode==="personal")),pools.personal));
 const automaticCount=new Set([...(d.automaticModels||d.sharedModels||[]),...(!d.catalogComplete?(S.sharedFreeModels||[]).map(m=>({provider:"openrouter",model:m.sharedModel||String(m.id||"").replace(/^free:or\//,"")})):[])].filter(m=>m.model).map(m=>m.provider+"|"+m.model)).size;
 const modelHeading=node("div","usage-mode-head usage-title");modelHeading.append(node("strong","","模型用量"),node("span","usage-mode-count",(d.catalogComplete?"":"已知 ")+"免费自动线路 "+automaticCount+" 项"));fragment.append(modelHeading);
 const list=usageModelRows(d);if(list.length)fragment.append(usageTable(["模型名称","今日用量"],list));else fragment.append(node("p","small-note","暂无模型统计"));
 root.replaceChildren(fragment);
 renderUsageDetails(d);
}
function renderUsageDetails(d){
 const root=$("settingsUsageDetails");root.replaceChildren();
 root.append(node("p","settings-hint","自动模式使用平台共享免费额度；自由模式使用用户绑定的免费模型；个人模式使用本人授权的模型。自由与个人模式可能共用同一服务商账号，额度不可相加。旧版误归入个人模式的记录无法可靠拆分，保留历史分类。仅汇总已核实且未过恢复时间的每日请求额度。"));
 if(d.pools?.shared){
  const p=d.pools.shared;
  root.append(node("p","settings-hint","共享已知 "+p.known+" 个额度池 · 未知 "+p.unknown+" 个；个人已知 "+d.pools.personal.known+" 个 · 未知 "+d.pools.personal.unknown+" 个。额度为上次实测，不保证此刻可用。"));
  if(p.referenceEntries?.length)root.append(node("p","settings-hint","参考值：Groq GPT-OSS 20B 官方免费方案每日 1,000 次；参考总量 "+usageNum(p.referenceTotal)+" 次。参考百分比只计算已测额度池消耗占参考总量的比例，Groq 实际使用量和其他线路总额度未知，不是实际整体使用率。官方来源：https://console.groq.com/docs/rate-limits"));
  const same=(d.quotas||[]).filter(q=>q.sharesSitePool);if(same.length)root.append(node("p","settings-hint",same.map(q=>usageProviderName(q.provider)).join("、")+" 与本站使用同一密钥，不另算个人额度。"));
 }
 root.append(node("p","settings-hint","本站统计目前覆盖聊天请求；图片及语音等其他计量单位不混入请求额度。"));

 const rows=Array.isArray(d.rows)?d.rows:[],all=usageSum(rows);
 const modeRows=[["自动模式（含旧共享）",rows.filter(r=>r.mode==="auto"||r.mode==="shared")],["自由模式",rows.filter(r=>r.mode==="free")],["个人模式（含旧未区分记录）",rows.filter(r=>r.mode==="personal")],["合计",rows]];
 root.append(node("h3","usage-title","今日聊天使用量"),usageTable(["模式","请求","成功/失败","Tokens"],modeRows.map(([label,list])=>{const t=usageSum(list);return [label,usageNum(t.requests),usageNum(t.succeeded)+"/"+usageNum(t.failed),usageToken(t.total_tokens,t.reported,t.requests)]})));
 root.append(node("p","settings-hint","输入 "+usageToken(all.input_tokens,all.reported,all.requests)+" · 输出 "+usageToken(all.output_tokens,all.reported,all.requests)+" · 已报告 "+usageNum(all.reported)+"/"+usageNum(all.requests)+" 次。本站不设统一每日聊天上限，实际可用量取决于服务商。"));
 if(d.historical?.reported>0)root.append(node("p","settings-hint","今日未分类历史：已保存 "+usageNum(d.historical.reported)+" 条回复，已报告 "+usageNum(d.historical.total_tokens)+" Tokens（不重复计入新统计；旧记录不能可靠区分自动与自由模式）。"));
 const groups=new Map();
 for(const r of rows){const key=JSON.stringify([r.mode,r.actual_provider||r.provider,r.actual_model||r.model]);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r)}
 root.append(node("h3","usage-title","模型与服务商明细"));
 if(groups.size)root.append(usageTable(["模式 / 服务商 / 模型","请求","Tokens"],[...groups.entries()].map(([key,list])=>{const [mode,provider,model]=JSON.parse(key),t=usageSum(list);return [(mode==="auto"?"自动":mode==="shared"?"旧共享":mode==="free"?"自由":"个人")+" · "+usageProviderName(provider)+" · "+model,usageNum(t.requests),usageToken(t.total_tokens,t.reported,t.requests)]})));
 else root.append(node("p","settings-hint","今日尚无新版统计记录。"));
 for(const [kind,title] of [["shared","自动模式及共享免费线路额度"],["personal","个人 API 额度"]]){
  root.append(node("h3","usage-title",title));
  const items=(d.quotas||[]).filter(x=>x.kind===kind);
  if(!items.length){root.append(node("p","settings-hint",kind==="personal"?"暂无已连接个人服务商":"暂无共享线路"));continue}
  for(const q of items){
   const box=node("section","usage-provider");
   box.append(node("strong","usage-provider-title",usageProviderName(q.provider)));
   const providerRows=rows.filter(r=>(kind==="personal"?["personal","free"].includes(r.mode):["auto","shared"].includes(r.mode))&&(r.actual_provider||r.provider)===q.provider),used=usageSum(providerRows);
   box.append(node("p","settings-hint","本人今日本站请求 "+usageNum(used.requests)+" 次 · Tokens "+usageToken(used.total_tokens,used.reported,used.requests)));
   if(!q.snapshots?.length){
    box.append(node("p","settings-hint",(q.selectedModel?q.selectedModel+" · ":"")+(q.sharesSitePool?"共用本站额度":q.unavailable?"额度暂时无法读取":"总额度及剩余额度未提供；已使用量见上方")));
   }else for(const snap of q.snapshots){
    const current=Date.now(),age=Number(snap.at)||0;
    box.append(node("p","usage-observed",(snap.model==="account"?"账号额度":snap.model)+" · "+(age?new Date(age).toLocaleString():"未知时间")+(snap.stale?" · 读取失败，保留上次":" · 上次实测")));
    if(snap.fields?.length)box.append(usageTable(["额度项目","总量","上次已用","上次剩余"],snap.fields.map(f=>[f.label+(f.resetAt&&f.resetAt<=current?"（已过恢复时间）":""),usageNum(f.limit),usageNum(f.limit-f.remaining),usageNum(f.remaining)])));
    else box.append(node("p","settings-hint","服务商未返回可核实的请求总量与剩余。"));
    const resets=(snap.fields||[]).filter(f=>f.resetAt).map(f=>f.label+"："+new Date(f.resetAt).toLocaleString()+(f.resetAt<=current?"（等待新数据）":""));
    if(resets.length)box.append(node("p","settings-hint","恢复时间："+resets.join("；")));
    if(q.provider==="groq")box.append(node("p","settings-hint","每日 Token 总额度及剩余需以 Groq 账号页面为准，响应头未提供。"));
    if(snap.source==="key"){
     const credits=[];if(snap.dailyCredit!==null&&snap.dailyCredit!==undefined)credits.push("今日 Key 消耗 $"+usageNum(snap.dailyCredit));
     if(snap.creditLimit!==null&&snap.creditLimit!==undefined)credits.push("Key 支出上限 $"+usageNum(snap.creditLimit));
     if(snap.creditRemaining!==null&&snap.creditRemaining!==undefined)credits.push("Key 剩余支出限额 $"+usageNum(snap.creditRemaining));
     if(credits.length)box.append(node("p","settings-hint",credits.join(" · ")+"（不是充值余额）"));
    }
   }
   root.append(box);
  }
 }
 $("settingsQuotaSummary").textContent="更新 "+new Date(d.at).toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"});
}
async function loadUsageOverview(force=false){
 const owner=S.user?.id;if(!owner||!$("settingsUsage").open)return;
 const target=$("settingsQuotaSummary"),button=$("settingsUsageRefresh");
 if(usageOverviewCache?.owner!==owner){usageOverviewCache=null;$("settingsUsageResults").replaceChildren();$("settingsUsageDetails").replaceChildren();$("settingsUsageExplanation").hidden=true;$("settingsUsageExplain").setAttribute("aria-expanded","false")}
 if(!force&&usageOverviewCache&&Date.now()-usageOverviewCache.at<30000&&usageOverviewCache.data.day===new Date().toISOString().slice(0,10)){renderUsageOverview(usageOverviewCache.data);return}
 if(usageOverviewFlight?.owner===owner)return usageOverviewFlight.job;
 const flight={owner,job:null};usageOverviewFlight=flight;button.disabled=true;target.textContent="正在读取真实用量…";
 flight.job=(async()=>{try{
  const d=await api("/api/usage/overview",undefined,15000);
  if(S.user?.id!==owner||usageOverviewFlight!==flight)return;
  usageOverviewCache={owner,at:Date.now(),data:d};renderUsageOverview(d);
 }catch(e){if(S.user?.id===owner&&usageOverviewFlight===flight){if(usageOverviewCache)renderUsageOverview(usageOverviewCache.data);target.textContent="读取失败"+(usageOverviewCache?"，保留上次数据":"")+"，可刷新重试"}}
 finally{if(usageOverviewFlight===flight){usageOverviewFlight=null;button.disabled=false}}})();
 return flight.job;
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
 document.body.classList.toggle("home-ambient",!!view&&view.classList.contains("empty-chat")&&!view.hidden&&!S.freeToolsMode);
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
function showChatImageWaiting(bubble,label,onStop){
 bubble.classList.add("chat-image-task");
 const actions=node("div","chat-image-progress");actions.append(label);
 if(onStop){const stop=node("button","chat-image-stop","停止作图");stop.type="button";stop.setAttribute("aria-label","停止作图");stop.addEventListener("click",onStop,{once:true});actions.append(stop)}
 bubble.replaceChildren(actions,createImageWaitingFrame());
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
 if(!(blob instanceof Blob)&&kind==="image"&&await restoreReplyImages(bubble,id,true))return true;
 if(!(blob instanceof Blob)&&legacyUrl){try{blob=await deviceMediaBlob(legacyUrl);if(blob)await deviceMediaPut(key,blob)}catch{}}
 if(blob instanceof Blob&&bubble.isConnected&&deviceMediaKey(id)===key){renderDeviceMedia(bubble,blob,kind);return true}return false;
}

function showImageStopped(bubble,detail="已停止作图"){
 delete bubble.dataset.imageTask;delete bubble.dataset.imageFinalizing;bubble.classList.remove("chat-image-task");
 bubble.replaceChildren(node("div","image-stop-status",detail));
 setPortraitState(bubble.closest(".message"),"idle");
}
async function cancelChatImageJob(bubble,id){
 delete bubble.dataset.imageTask;delete bubble.dataset.imageFinalizing;
 showImageStopped(bubble,"正在停止作图…");
 try{
  const result=await api("/api/image/task/"+id+"/cancel",{},12000);
  if(!bubble.isConnected)return;
  if(result.completed){showImageStopped(bubble,"图片已生成，无法撤销已完成的计算");const view=node("button","chat-image-stop","查看图片");view.type="button";view.addEventListener("click",()=>renderImageJob(bubble,id),{once:true});bubble.append(view);return}
  showImageStopped(bubble,"已停止作图");
 }catch(e){
  if(!bubble.isConnected)return;
  showImageStopped(bubble,"停止尚未确认");const retry=node("button","chat-image-stop","重试停止");retry.type="button";retry.addEventListener("click",()=>void cancelChatImageJob(bubble,id),{once:true});bubble.append(retry);
 }
}
function renderImageJob(bubble,id){
 bubble.dataset.imageTask=id;
 const mediaLabel="作图中";
 const label=node("span","image-job-label",mediaLabel+" 1秒");
 bubble.dataset.imageStart=String(Date.now());
 showChatImageWaiting(bubble,label,()=>void cancelChatImageJob(bubble,id));
 const interval=window.setInterval(()=>{
  if(!bubble.isConnected||bubble.dataset.imageTask!==id){window.clearInterval(interval);return}
  const elapsed=Math.max(1,Math.floor((Date.now()-Number(bubble.dataset.imageStart||Date.now()))/1000)+1);
  label.textContent=mediaLabel+" "+elapsed+"秒";
 },1000);
 window.setTimeout(()=>void pollImageJob(bubble,id,false),0);
}
function showImageRetry(bubble){
 delete bubble.dataset.imageTask;delete bubble.dataset.imageFinalizing;bubble.classList.remove("chat-image-task");
 const row=bubble.closest(".message");
 if(row&&retiredImageMessage(row)){row.remove();return}
 const button=messageTool("refresh-cw","重新作图",()=>{if(row)void retryImageMessage(row)});
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
  const r=await api("/api/image/task/"+id,undefined,55000);
  let cached=false,blob=null;
  if(r.done&&!r.failed&&r.image){
   try{blob=await deviceMediaBlob(r.image);cached=blob instanceof Blob&&blob.size>0&&blob.type.startsWith("image/")&&await deviceMediaPut(key,blob)}catch{cached=false}
  }
  if(!bubble.isConnected||bubble.dataset.imageTask!==id||S.user?.id!==owner)return;
  if(Number.isFinite(r.startedAt)&&r.startedAt>0)bubble.dataset.imageStart=String(r.startedAt);
  if(r.done){
   delete bubble.dataset.imageTask;
   if(r.cancelled){showImageStopped(bubble);return}
   if(r.retired){delete bubble.dataset.imageFinalizing;bubble.classList.remove("chat-image-task");bubble.closest(".message")?.remove();return}
   if(r.failed){showImageRetry(bubble);return}
   const img=blob instanceof Blob?localImageElement(blob):node("img","chat-generated-image");
   img.alt="生成图片";img.loading="eager";bubble.dataset.imageFinalizing=id;
   img.onload=()=>{
    if(!bubble.isConnected||bubble.dataset.imageFinalizing!==id)return;
    const follow=chatImageNearBottom(bubble);
    delete bubble.dataset.imageFinalizing;
    bubble.classList.remove("chat-image-task");bubble.replaceChildren(img);
    const row=bubble.closest(".message");
    if(row){row.dataset.messageKind="image";appendMessageCopy(row,"")}
    if(!cached)mediaCacheWarning(bubble);
    setPortraitState(row,"finished");
    // The final image can have a different height from the loading frame.
    if(follow)followLatestImage(bubble);
   };
   img.onerror=()=>{if(bubble.dataset.imageFinalizing!==id)return;showImageRetry(bubble)};
   if(blob instanceof Blob){if(img.complete&&img.naturalWidth)img.onload()}else img.src=r.image;return;
  }
  delay=Math.max(1000,Math.min(45000,Number(r.waitSeconds||12)*1000));
 }catch(e){/* Polling interruptions retain the original task; no new generation. */}
 finally{
  bubble.dataset.imageBusy="0";if(!bubble.dataset.imageStart)bubble.dataset.imageStart=String(Date.now());
  if(bubble.isConnected&&bubble.dataset.imageTask===id){if(Date.now()-Number(bubble.dataset.imageStart)<720000)window.setTimeout(()=>void pollImageJob(bubble,id,false),delay);else showImageRetry(bubble)}
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
 const s=String(line||"").trim().replace(/^(?:(?:>\s*)|(?:#{1,6}\s+)|(?:[-*]\s+)|(?:\d+[.)、]\s+))+/,"").replace(/^\*\*/,"").replace(/\*\*\s*$/,"");
 const m=s.match(/^((?:建议|推荐|完整|最终|优化后|可复制|通用)?\s*(?:(?:中文|英文|English|Chinese|中英双语)\s*)?(?:正向|负面|反向|否定|positive|negative)?\s*(?:AI\s*)?(?:作图|画图|绘图|生图|图像|图片|摄影|image|drawing|text.to.image|midjourney|flux|SDXL)?\s*(?:提示词|prompt(?:s)?)(?:\s*(?:正向|负面|反向|positive|negative))?(?:\s*[（(][^）)]{1,60}[）)]|\s*(?:中文版|英文版|中文|英文|Chinese|English))?)\s*(?:\*\*)?(?:[:：]\s*(?:\*\*)?\s*(.*)|$)/i);
 if(!m)return null;
 const label=m[1].trim();return {label,body:(m[2]||"").replace(/^\*\*|\*\*$/g,"").trim(),negative:/负面|反向|否定|negative/i.test(label),generic:/^(?:提示词|prompts?)$/i.test(label)};
}
function promptSectionBoundary(line){
 const s=String(line||"").trim().replace(/^(?:>\s*|#{1,6}\s+|\*\*)+/,"");
 return !!imagePromptLabel(line)||/^(?:主题|人物(?:档案|姓名|设定|一致性)|固定(?:身份|档案)|推荐(?:画面|图片)?比例|比例|参数|摄影(?:风格|参数)|镜头参数|光圈|继续完成|变体\s*[A-Z0-9一二三四五六七八九十]|第\s*\d+\s*[套组]|[-]{3,}|(?:parameters?|settings|aspect ratio|negative prompt)\b)(?:\s*[:：、.（(]|\s|$)/i.test(s)||/^\s*#{1,6}\s+\S/.test(line)||/^\s*\d{1,2}[.)、]\s+\S/.test(line);
}
function isImagePromptContext(value){
 const s=String(value||"");
 return /(?:提示词|prompts?)/i.test(s)&&/(?:作图|画图|绘图|生图|图像|图片|照片|摄影|人物|插画|海报|写实|角色|image|photo|portrait|illustration|midjourney|stable diffusion|flux|sdxl)/i.test(s)&&!/(?:系统提示词|system prompt|视频提示词|音乐提示词|编程提示词)/i.test(s);
}
function looksLikeImagePrompt(value){
 const s=String(value||"").trim();
 if(s.length<18||/^\s*(?:def |class |function |const |let |var |import |export |SELECT\s|CREATE\s|<\/?\w|#!|package\s|return\s|\{|\[)/m.test(s))return false;
 const matches=s.match(/photorealistic|portrait|photography|cinematic|lighting|camera|lens|background|full.body|close.up|high.quality|ultra.detailed|illustration|anime|render|bokeh|composition|selfie|masterpiece|detailed|8k|4k|--ar\b|写实|摄影|画面|镜头|光线|光影|背景|高清|服装|发型|构图|特写|全身|景深|插画|画质|细节|色调/gi)||[];
 return new Set(matches.map(x=>x.toLowerCase())).size>=2;
}
function normalizePromptSections(lines,imageContext=false){
 const out=[],mark=line=>String(line||"").trim().match(/^(\x60{3,}|~{3,})\s*([\w+-]*)\s*$/);
 const isText=lang=>/^(?:text|plaintext|txt|prompt|imageprompt|positive-prompt)?$/i.test(lang);
 const negativeLine=s=>/^(?:\*\*)?(?:建议|推荐|通用)?\s*(?:负面|反向|否定|negative)/i.test(String(s||"").trim().replace(/^#{1,6}\s+/,""));
 const wrap=(payload,negative,eligible)=>{if(payload.trim())out.push("\x60\x60\x60"+(!negative&&eligible?"image-prompt":"text"),payload.trim(),"\x60\x60\x60")};
 const closeAt=(from,open)=>{let j=from;for(;j<lines.length;j++){const f=mark(lines[j]);if(f&&!f[2]&&f[1][0]===open[1][0]&&f[1].length>=open[1].length)break}return j};
 for(let i=0;i<lines.length;i++){
  const label=imagePromptLabel(lines[i]),f=mark(lines[i]);
  if(/^\s*>\s?/.test(lines[i])&&!label){
   let j=i;const quoted=[];
   while(j<lines.length&&/^\s*>/.test(lines[j])){quoted.push(lines[j].replace(/^\s*>\s?/,""));j++}
   const value=quoted.join("\n").trim();
   if(!negativeLine(value)&&pastedImagePrompt(value)){wrap(value,false,true);i=j-1;continue}
  }
  if(label){
   const body=label.body?[label.body]:[];let j=i+1;
   while(j<lines.length&&!lines[j].trim())j++;
   const next=mark(lines[j]);
   if(next&&isText(next[2])){
    const end=closeAt(j+1,next);body.push(...lines.slice(j+1,end));j=end<lines.length?end+1:end;
   }else if(!next){
    for(;j<lines.length&&!promptSectionBoundary(lines[j])&&!mark(lines[j]);j++){
     if(!lines[j].trim()&&body.length)break;
     if(lines[j].trim())body.push(lines[j]);
    }
   }
   const payload=body.join("\n").trim();
   out.push("**"+label.label+"**");
   wrap(payload,label.negative,!label.generic||imageContext||looksLikeImagePrompt(payload));
   i=j-1;continue;
  }
  if(f){
   const end=closeAt(i+1,f),body=lines.slice(i+1,end).join("\n");
   const prev=lines.slice(0,i).reverse().find(x=>x.trim())||"";
   const neg=negativeLine(prev)||negativeLine(body);
   if(isText(f[2])&&!neg&&!body.split("\n").some(line=>imagePromptLabel(line))&&(pastedImagePrompt(body)||imageContext&&/^(?:prompt|imageprompt|positive-prompt)$/i.test(f[2]))){
    wrap(body,false,true);
   }else if(isText(f[2])&&body.split("\n").some(line=>imagePromptLabel(line))){
    const inner=body.split("\n"),tail=imagePromptLabel(inner.at(-1));
    if(tail&&!tail.body&&!tail.negative){let j=end+1;while(j<lines.length&&!lines[j].trim())j++;for(;j<lines.length&&lines[j].trim()&&!mark(lines[j])&&!promptSectionBoundary(lines[j]);j++)inner.push(lines[j]);if(j>end+1){out.push(...normalizePromptSections(inner,imageContext));i=j-1;continue}}
    out.push(...normalizePromptSections(inner,imageContext));
   }else out.push(...lines.slice(i,end<lines.length?end+1:end));
   i=end;continue;
  }
  // Unlabelled natural-language image descriptions with an adjacent generation parameter.
  if(looksLikeImagePrompt(lines[i])&&(/^\s*(?:参数|parameters?|--ar\b)/i.test(lines[i+1]||"")||/--ar\s+\d+:\d+/i.test(lines[i]))){wrap(lines[i],false,true);continue}
  if(!label&&pastedImagePrompt(lines[i])&&!negativeLine(lines[i])){wrap(lines[i],false,true);continue}
  out.push(lines[i]);
 }
 return out;
}
function imagePromptPayload(value){
 const text=String(value||"").trim(),lines=text.split("\n"),positive=[];let started=false;
 for(const line of lines){
  const label=imagePromptLabel(line);
  if(label){if(label.negative){if(!started)return "";break}if(started)break;started=true;if(label.body)positive.push(label.body);continue}
  if(started){if(promptSectionBoundary(line))break;positive.push(line)}
 }
 return (started?positive.join("\n"):text).trim();
}
function isDirectVideoRequest(value){
 const p=String(value||"").trim();
 if(!p)return false;
 // Only a negation of video creation itself blocks generation; a request
 // not to reply with text or code does not negate a requested video.
 const first=p.split(/[。！？\n;；]/)[0];
 if(/(?:不要|不用|禁止|无需|不需要|先别|别)(?:再|直接|真的|实际)?\s*(?:生成|制作|创建|做|拍|渲染|合成|输出)\s*[^，。！？\n]{0,16}视频/.test(p)||/\b(?:do not|don't|never)\s+(?:generate|create|make|animate|render)\b[^.!?\n]{0,45}\b(?:video|clip|animation)\b/i.test(p))return false;
 if(/^(?:(?:请|麻烦|帮我|请你|你|给我)\s*){0,4}(?:如何|怎么|为什么|能不能|是否|分析|识别|检查|解释|写|提供|给出|整理|优化|修改|下载|播放|搜索|查找)/.test(p)||/^(?:please\s+)?(?:how|why|can you explain|explain|write|provide|review|find|download|search)\b/i.test(p))return false;
 if(/(?:生成|制作|创建|设计|输出|写|提供|给出).{0,22}(?:视频提示词|视频脚本|视频代码|视频教程|视频方案|视频文案)|(?:生成|制作|创建|输出).{0,20}视频(?:的|用的)?(?:提示词|脚本|代码|教程|方案|文案)|(?:video|animation)\s+(?:prompt|script|code|tutorial)\b/i.test(first))return false;
 return /^(?:(?:请|麻烦|帮我|给我|直接|现在|再|继续|请你|为我|你|来)\s*){0,5}(?:(?:生成|制作|创建|做|拍|渲染|合成|输出)(?:一段|一个|一条|一部|一支|短)?[^，。！？\n]{0,20}视频|(?:文生视频|图生视频|首尾帧视频)|(?:让|把).{1,35}(?:动起来|变成视频|做成视频))/.test(p)||/^(?:please\s+)?(?:generate|create|make|animate|render)\b.{0,40}\b(?:video|clip|animation)\b/i.test(p);
}
// Distinguish a pasted visual prompt from requests to discuss or write prompts.
function imagePromptDiscussion(value){
 const s=String(value||"").trim().replace(/^[\s*#>]+/,"");
 return /^(?:(?:请|麻烦|帮我|请你|你|给我)\s*){0,4}(?:不要|不用|无需|禁止|先别|不需要|只写|仅写|如何|怎么|为什么|能不能|是否|什么是|分析|识别|检查|解释|评价|翻译|总结|润色|优化|修改提示词|改写|转换提示词|写(?!实)|编写|提供|给出|整理|列出|查询|搜索|教我|请问|tell me\b|explain\b|analy[sz]e\b|translate\b|rewrite\b|improve\b|review\b|describe\b|what\b|why\b|how\b|do not\b|don't\b|write\s+(?:an?\s+)?(?:image\s+)?prompt)/i.test(s)||
 /(?:只|仅)(?:写|生成|输出|提供|给出).{0,20}提示词|(?:写|提供|输出|整理|设计|生成|编写|给出|制作|优化).{0,24}(?:提示词|prompts?)\s*(?:[。！!？?]|$)|(?:不|别)(?:要)?(?:直接)?(?:生成|制作|画)(?:任何)?(?:图片|图像|照片|图)/i.test(s)&&!/^(?:根据|按照|使用|用|using|based on).{0,45}(?:提示词|prompt).{0,35}(?:生成|绘制|画|作图|generate|create)/i.test(s);
}
function pastedImagePrompt(value){
 const raw=String(value||"").trim();
 if(!raw||imagePromptDiscussion(raw))return false;
 if(/^\s*(?:def |class |function |const |let |var |import |export |SELECT\s|CREATE\s|<\/?\w|#!|package\s|return\s|\{|\[)/m.test(raw))return false;
 const fences=Array.from(raw.matchAll(/^\s*(?:\x60{3,}|~{3,})\s*([\w+-]*)\s*$/gm));
 if(fences.some(x=>! /^(?:text|plaintext|txt|image-prompt|prompt-set)?$/i.test(x[1])))return false;
 if(/^(?:[#*\s>-]*)(?:视频|音乐|音效|音频|video|music|audio)\s*(?:生成|正向)?\s*(?:提示词|prompt)/im.test(raw))return false;
 const labels=raw.split("\n").map(imagePromptLabel).filter(Boolean);
 if(labels.length&&labels.every(x=>x.negative))return false;
 const clean=raw.replace(/^\s*(?:\x60{3,}|~{3,})(?:image-prompt|prompt-set|text|plaintext|txt)?\s*$/gim,"").trim();
 const body=imagePromptPayload(clean)||clean;
 const groups=[
 /(?:photorealistic|ultra.realistic|hyper.realistic|写实|超写实|真实摄影|真实感|摄影|photography|realistic photo|8k|4k|high.resolution|高清)/i,
 /(?:portrait|full.body|half.body|close.up|wide.shot|medium.shot|人像|人物|全身|半身|特写|近景|远景|俯拍|仰拍|构图|composition)/i,
 /(?:lighting|light\s+(?:and|from)|soft light|golden hour|bokeh|光线|光影|灯光|逆光|柔光|自然光|景深)/i,
 /(?:lens|camera|aperture|[0-9]{2,3}\s*mm|f\/[0-9]|镜头|相机|光圈|胶片)/i,
 /(?:background|scenery|setting|scene|environment|背景|场景|海边|街道|室内|户外)/i,
 /(?:wearing|outfit|clothing|hair|hairstyle|pose|expression|服装|穿着|身穿|发型|长发|短发|姿势|表情|动作)/i,
 /(?:anime|illustration|digital art|watercolor|oil painting|3d render|cinematic|插画|动漫|卡通|水彩|油画|电影感|渲染|艺术风格)/i
 ];
 const score=groups.reduce((n,re)=>n+Number(re.test(body)),0);
 const structured=/(?:image[- ]prompt|prompt[- ]set|(?:正向|中文|英文|图片|图像|作图|绘图|摄影)\s*提示词|(?:positive|image|english|chinese)\s*prompt)\s*(?:[:：*]|\n)/i.test(raw);
 const separators=(body.match(/[,，、;；\n]/g)||[]).length;
 if(/(?:[?？]\s*$|请问|你觉得|什么意思|有什么区别|有什么问题|能不能|是否可以|怎么做|如何做|请告诉我|告诉我|what is|how to|why does|could you explain)/i.test(body))return false;
 const imageLabel=labels.some(x=>!x.negative&&/(?:作图|画图|绘图|生图|图像|图片|摄影|image|drawing|text.to.image|midjourney|flux|sdxl)/i.test(x.label));
 const visualSubject=/(?:少女|女性|男子|女孩|男孩|少年|人物|小猫|小狗|动物|森林|雪山|花朵|海边|建筑|城市|街景|天空|星空|夕阳|山水|风景|woman|girl|man|boy|cat|dog|forest|mountain|landscape|city|flower|sunset|sky|character)/i.test(body);
 const strongVisual=/(?:超写实|真实摄影|真实人体摄影|高清摄影|写实风格|电影感|插画|动漫|水彩|油画|photorealistic|cinematic|illustration|anime|watercolor|oil painting|masterpiece|--ar\s+\d+:\d+)/i.test(body);
 return imageLabel&&body.length>=4||
  structured&&score>=1&&body.length>=10||
  labels.some(x=>!x.negative)&&score>=1&&body.length>=10||
  body.length>=12&&visualSubject&&strongVisual||
  body.length>=18&&score>=2&&(separators>=1||strongVisual)||
  body.length>=25&&score>=3;

}
// Automatic generation requires an explicit command or a high-confidence, standalone visual prompt.
function automaticImagePrompt(value){
 const raw=String(value||"").trim();
 if(!raw||raw.length>1800||imagePromptDiscussion(raw))return false;
 if(/(?:工作台|工作模式|个人项目|技能库|免费额度|服务商|接入|部署|验收|接口|数据库|代码|源代码|技术方案|执行要求|使用策略|优先级|禁止未经授权|自动匹配|自动切换|提示词生成|视频制作|镜头规划|Agent\s+Skills|AIGZT|\bAPI\b|\bSDK\b|\bCLI\b|\bJSON\b|\bGitHub\b|\bRemotion\b|\bHyperframes\b)/i.test(raw))return false;
 if(/^\s*(?:#{1,6}\s|[-*]\s|\d+[.)、]\s|\|)|\|[^\n]+\|/m.test(raw))return false;
 const lines=raw.split("\n").map(x=>x.trim()).filter(Boolean);
 const first=imagePromptLabel(lines[0]);
 if(first&&!first.negative&&/(?:作图|画图|绘图|生图|图片|图像|摄影|正向|positive|image|drawing|midjourney|flux|sdxl)/i.test(first.label))return pastedImagePrompt(raw);
 if(lines.length>3||/[。！？?!]/.test(raw)||/https?:\/\//i.test(raw))return false;
 const visual=/(?:真实摄影|真实人体摄影|超写实|高清摄影|写实风格|photorealistic|cinematic|illustration|anime|watercolor|oil painting|masterpiece|--ar\s+\d+:\d+)/i.test(raw);
 return visual&&(raw.match(/[,，、;；]/g)||[]).length>=2&&pastedImagePrompt(raw);
}
function isDirectImageRequest(value){
 const s=String(value||"").trim();
 if(!s||imagePromptDiscussion(s))return false;
 if(/(?:写|生成|输出|提供).{0,20}(?:代码|网页|网站|功能|按钮|指令|视频|文章|故事)/.test(s))return false;
 if(/(?:画图|作图|绘图|生成图片).{0,6}(?:提示词|prompts?)\s*$/i.test(s))return false;
 return /^(?:(?:请|麻烦|帮我|给我|直接|现在|再|继续|请你|为我|你|来)\s*){0,5}(?:画(?!面|质|风|笔|册|法)(?:一张|一幅|一只|个|出|一下)?|绘制|作图(?!功能|模式|提示词|按钮|设置)|(?:生成|制作|创建|设计)(?:一张|一幅|一组|一套|一个)?[^，。！？\n]{0,25}?(?:图片|图像|照片|写真|海报|插画|头像|壁纸|人物图|效果图))/.test(s)||
 /^(?:根据|按照|使用|用)(?:以下|下面|这[个段套])?提示词.{0,20}(?:生成|绘制|画|作图)/.test(s)||
 /^(?:please\s+)?(?:generate|create|draw|make|render|paint)\b.{0,40}\b(?:image|picture|photo|portrait|illustration|poster|artwork|wallpaper)\b/i.test(s);
}
function renderAssistantText(bubble,answer,imageContext=false){
 const lines=normalizePromptSections(normalizeAssistantMarkdown(answer),imageContext);
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
 const row=bubble.closest(".message");
 const imageContext=!!row&&isImagePromptContext(messageQuestion(row));
 const renderKey=(imageContext?"image:":"text:")+(complete?"final:":"stream:")+text;
 if(assistantTextState.get(bubble)===renderKey)return;
 const staged=node("div");
 renderAssistantText(staged,text,imageContext);
 bubble.classList.remove("chat-revealing");
 syncAssistantChildren(bubble,staged);
 if(row)markImageMessage(row,row.dataset.messageKind==="image"||!!bubble.querySelector(".chat-image-prompt"));
 assistantTextState.set(bubble,renderKey);
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
let dictationRecognition=null,dictationCapture=null;
function dictationButton(active,waiting=false){
 const b=$("voiceInput");b.classList.toggle("listening",active);b.disabled=waiting;b.setAttribute("aria-pressed",String(active));b.title=waiting?"识别中":active?"正在录音，点击结束":"语音转文字";
}
function finishDictation(rec){
 if(dictationRecognition!==rec)return;
 dictationRecognition=null;clearTimeout(rec._timer);dictationButton(false);
}
function releaseDictationCapture(state){
 clearTimeout(state.timer);state.stream?.getTracks().forEach(t=>t.stop());state.stream=null;
 if(dictationCapture===state){dictationCapture=null;dictationButton(false)}
}
function stopDictation(abort=false){
 const state=dictationCapture;
 if(state){
  if(abort){state.cancelled=true;state.request?.abort();if(state.recorder?.state==="recording")try{state.recorder.stop()}catch{};releaseDictationCapture(state);return}
  if(state.recorder?.state==="recording"){dictationButton(false,true);try{state.recorder.stop()}catch{releaseDictationCapture(state)}}else if(!state.recorder&&!state.request){state.cancelled=true;releaseDictationCapture(state)}
  return;
 }
 const rec=dictationRecognition;if(!rec)return;
 if(abort){finishDictation(rec);try{rec.abort()}catch{};return}
 if(rec._stopping)return;rec._stopping=true;
 try{rec.stop();clearTimeout(rec._timer);rec._timer=setTimeout(()=>{if(dictationRecognition===rec){finishDictation(rec);try{rec.abort()}catch{}}},4000)}catch{finishDictation(rec)}
}
function insertDictation(text){
 const input=$("prompt"),value=String(text||"").trim();if(!value)return;
 const before=input.value;input.value=before+(before&&!/\s$/.test(before)?" ":"")+value;settlePromptSize();
}
async function transcribeRecordedAudio(audio,lang,signal){
 if(!audio.size||audio.size>1500000)throw Error("录音为空或超过大小限制");
 const response=await fetch("/api/voice/transcribe",{method:"POST",headers:{"content-type":audio.type||"audio/mp4","x-voice-lang":lang},body:audio,credentials:"same-origin",cache:"no-store",signal});
 const data=await response.json().catch(()=>null);if(!response.ok||!data?.ok||!String(data.text||"").trim())throw Error(data?.error||"未识别到语句");
 return String(data.text).trim();
}
async function startRecordedDictation(){
 if(dictationCapture||dictationRecognition||!S.user)return;
 if(!voiceRecordSupported()){flashError("当前浏览器不支持录音，请使用键盘听写");return}
 const state={stream:null,recorder:null,request:null,timer:null,cancelled:false,chat:S.chatId,owner:S.user.id};dictationCapture=state;dictationButton(true);
 try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
  if(dictationCapture!==state||state.cancelled){stream.getTracks().forEach(t=>t.stop());return}
  state.stream=stream;const mime=["audio/mp4","audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus"].find(x=>window.MediaRecorder.isTypeSupported?.(x));
  const rec=new window.MediaRecorder(stream,mime?{mimeType:mime,audioBitsPerSecond:64000}:{audioBitsPerSecond:64000}),chunks=[];state.recorder=rec;
  rec.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};
  rec.onerror=()=>{state.cancelled=true;releaseDictationCapture(state);flashError("录音中断，请重试")};
  rec.onstop=async()=>{
   clearTimeout(state.timer);state.stream?.getTracks().forEach(t=>t.stop());state.stream=null;
   if(dictationCapture!==state||state.cancelled)return;
   const ctrl=new AbortController();state.request=ctrl;dictationButton(false,true);state.timer=setTimeout(()=>ctrl.abort(),18000);
   try{const audio=new Blob(chunks,{type:rec.mimeType||chunks[0]?.type||"audio/mp4"});const result=await transcribeRecordedAudio(audio,settingsDictationLanguage(),ctrl.signal);if(dictationCapture===state&&!state.cancelled&&state.owner===S.user?.id&&state.chat===S.chatId)insertDictation(result)}
   catch(e){if(dictationCapture===state&&!state.cancelled)flashError(e.name==="AbortError"?"语音识别超时，请重试":e.message)}
   finally{releaseDictationCapture(state)}
  };
  rec.start();state.timer=setTimeout(()=>{if(dictationCapture===state&&rec.state==="recording")rec.stop()},30000);
 }catch(e){if(dictationCapture===state){releaseDictationCapture(state);flashError(e.name==="NotAllowedError"?"请允许麦克风权限":"无法开启麦克风，请重试")}}
}
function settingsDictationLanguage(){
 try{const value=localStorage.getItem("aigzt:dictation-language")||"auto";return ["auto","zh-CN","zh-TW","en-US","ja-JP"].includes(value)?value:"auto"}catch{return "auto"}
}
function startDictation(){
 if(dictationCapture||dictationRecognition){stopDictation();return}
 if(!S.user){show("authDialog");return}
 if(voiceSession.active||voiceSession.reading||voiceSession.opening||voiceSession.request)voiceStop();stopMessageReader();
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(voiceRecordSupported()&&(S.voiceTranscriptionConfigured!==false||!Speech)){void startRecordedDictation();return}
 if(!Speech){flashError("当前浏览器不支持录音，请使用键盘听写");return}
 const rec=new Speech();dictationRecognition=rec;const chosen=settingsDictationLanguage();
 rec.lang=chosen==="auto"?(navigator.language||"zh-CN"):chosen;rec.interimResults=false;rec.continuous=false;
 let last=0;
 rec.onresult=event=>{if(dictationRecognition!==rec)return;for(let i=event.resultIndex||0;i<event.results.length;i++){const r=event.results[i];if(r.isFinal&&i>=last){insertDictation(r[0]?.transcript);last=i+1}}};
 rec.onerror=event=>{if(dictationRecognition!==rec)return;finishDictation(rec);if(!["aborted","no-speech"].includes(event.error))flashError(event.error==="not-allowed"?"请允许麦克风权限后重试":"语音识别中断，请重试")};
 rec.onend=()=>finishDictation(rec);
 try{rec.start();dictationButton(true);rec._timer=setTimeout(()=>stopDictation(),30000)}catch{finishDictation(rec);flashError("无法开始语音识别，请检查麦克风权限")}
}
function wireDictation(){
 $("voiceInput").addEventListener("click",startDictation);
 document.addEventListener("visibilitychange",()=>{if(document.hidden)stopDictation(true)});
}
const voiceSession={active:false,opening:false,pending:false,listening:false,reading:false,resumePending:false,recognition:null,token:0,turn:0,button:null,voice:"",lang:"zh-CN",rate:1,lastReply:"",utterance:null,primer:null,primed:false,watchdog:null,recorder:null,stream:null,recordTimer:null,request:null,context:null,analyser:null,source:null,frame:null,sessionChat:null};
function sayStatus(t){$("voiceStatus").textContent=t;const phase=voiceSession.reading?"speaking":voiceSession.listening?"listening":voiceSession.pending||voiceSession.request?"thinking":"idle";$("voiceDialog").dataset.voicePhase=phase}
function voiceTranscript(role,text){
 const entry=node("div","voice-transcript-entry");entry.append(node("strong","",role==="user"?"你":"IMAI"),node("p","",text));$("voiceTranscript").append(entry);$("voiceTranscript").scrollTop=$("voiceTranscript").scrollHeight;
}
function voiceSilenceStep(state,rms,now){
 if(rms>=0.018){if(!state.speechSince)state.speechSince=now;state.lastLoud=now;if(now-state.speechSince>=160)state.heard=true}
 else if(!state.heard)state.speechSince=0;
 if(state.heard&&now-state.lastLoud>=1050)return "send";
 if(!state.heard&&now-state.started>=15000)return "idle";
 return "";
}
function voiceAutoNext(){
 if(!voiceSession.active||!$("voiceDialog").open||voiceSession.listening||voiceSession.opening||voiceSession.reading)return;
 if(S.busy||voiceSession.pending||voiceSession.request){voiceSession.resumePending=true;return}
 voiceListen(true);
}
function voiceAudioContext(){
 try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return; if(!voiceSession.context||voiceSession.context.state==="closed")voiceSession.context=new C();void voiceSession.context.resume().catch(()=>{})}catch{}
}
function voiceWatchSilence(stream,recorder,turn){
 const ctx=voiceSession.context;if(!ctx||ctx.state!=="running")return false;
 try{
 const analyser=ctx.createAnalyser(),source=ctx.createMediaStreamSource(stream);analyser.fftSize=1024;source.connect(analyser);voiceSession.analyser=analyser;voiceSession.source=source;
 const samples=new Float32Array(analyser.fftSize),state={started:performance.now(),speechSince:0,lastLoud:0,heard:false};
 const check=()=>{
 if(turn!==voiceSession.turn||voiceSession.recorder!==recorder||recorder.state!=="recording")return;
 analyser.getFloatTimeDomainData(samples);let sum=0;for(const value of samples)sum+=value*value;
 const action=voiceSilenceStep(state,Math.sqrt(sum/samples.length),performance.now());
 if(action==="send"){recorder.stop();return}
 if(action==="idle"){voiceSession.recorder=null;voiceSession.listening=false;recorder.stop();voiceReleaseMic();voiceReady("继续说话");sayStatus("暂未听到说话，点击继续");return}
 voiceSession.frame=requestAnimationFrame(check);
 };voiceSession.frame=requestAnimationFrame(check);return true;
 }catch{try{voiceSession.source?.disconnect()}catch{}voiceSession.source=null;voiceSession.analyser=null;return false}
}
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
 voiceSession.token++;voiceSession.reading=false;voiceSession.primer=null;
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
function voiceSpeak(value,button=null,continueAfter=false,onComplete=null){
 stopMessageReader();
 const synth=window.speechSynthesis,t=speechContent(value);
 if(!synth||typeof window.SpeechSynthesisUtterance!=="function"||!t)return false;
 voiceCancel();const token=voiceSession.token,lang=voiceLanguage(t),voices=synth.getVoices();
 const matching=voices.filter(v=>v.lang.toLowerCase().split("-")[0]===lang.toLowerCase().split("-")[0]);
 const voice=matching.find(v=>v.voiceURI===voiceSession.voice)||matching.find(v=>v.localService&&v.lang.toLowerCase()===lang.toLowerCase())||matching.find(v=>v.localService)||matching[0];
 const chunks=voiceChunks(t);let index=0;
 voiceSession.reading=true;voiceSession.button=button;if(button===$("voiceReplay"))button.disabled=false;voicePlaybackButton(button,true);
 sayStatus("正在准备播报…");
 const fail=()=>{
  if(token!==voiceSession.token)return;
  voiceCancel();if(voiceSession.active)voiceReady();
  if(button?.classList.contains("message-copy-btn"))flashError("设备未能开始或完成播报，请检查媒体音量后再次点击");
  else sayStatus("设备未能完成播报，点击播放回答重试");
  onComplete?.(false);
 };
 const next=()=>{
  if(token!==voiceSession.token)return;
  clearTimeout(voiceSession.watchdog);voiceSession.watchdog=null;
  if(index>=chunks.length){
   voiceSession.reading=false;voiceSession.utterance=null;voicePlaybackButton(button,false);voiceSession.button=null;
   if(onComplete){onComplete(true)}
   else if(continueAfter&&voiceSession.active){voiceReady();sayStatus("继续聆听");voiceAutoNext()}
   else sayStatus("播报结束");
   return;
  }
  const u=new window.SpeechSynthesisUtterance(chunks[index++]);
  u.lang=voice?.lang||lang;u.rate=voiceSession.rate;u.volume=1;if(voice)u.voice=voice;
  voiceSession.utterance=u;
  u.onstart=()=>{
   if(token!==voiceSession.token)return;
   voiceSession.primed=true;sayStatus("正在播报…");clearTimeout(voiceSession.watchdog);
   voiceSession.watchdog=setTimeout(fail,Math.max(25000,u.text.length*650));
  };
  u.onend=()=>{if(voiceSession.utterance===u)next()};u.onerror=()=>{if(voiceSession.utterance===u)fail()};
  voiceSession.watchdog=setTimeout(fail,10000);
  try{if(synth.paused)synth.resume();synth.speak(u)}catch{fail()}
 };
 next();return token===voiceSession.token;
}

let voiceStream=null;
function voiceStreamReset(){voiceStream=null}
function voiceStreamFeed(turn,text,done=false){
 if(turn!==voiceSession.turn||!voiceSession.active)return;
 if(!voiceStream||voiceStream.turn!==turn)voiceStream={turn,raw:"",offset:0,queue:[],playing:false,done:false,failed:false};
 const state=voiceStream;if(state.failed)return;
 const incoming=String(text||"").trimStart();
 // The final response can add citations or trim whitespace, never replay text already queued.
 if(incoming.startsWith(state.raw)||!state.raw)state.raw=incoming;
 else if(done&&incoming.startsWith(state.raw.trimEnd()))state.raw=incoming;
 const pending=state.raw.slice(state.offset);
 let cut=0,inside=false;
 for(let i=0;i<pending.length;i++){
  if(pending.slice(i,i+3)==="\x60\x60\x60"){inside=!inside;i+=2;continue}
  if(!inside&&/[。！？!?；;\n]/.test(pending[i]))cut=i+1;
  if(!inside&&i>=100&&/[,，、\s]/.test(pending[i]))cut=i+1;
 }
 if(done)cut=pending.length;
 if(cut>0){const part=pending.slice(0,cut);state.offset+=cut;const clean=speechContent(part);if(clean)state.queue.push(clean)}
 if(done)state.done=true;
 voiceStreamPump(state);
}
function voiceStreamPump(state){
 if(voiceStream!==state||state.turn!==voiceSession.turn||!voiceSession.active||state.playing||state.failed)return;
 const next=state.queue.shift();
 if(next){
  state.playing=true;
  const started=voiceSpeak(next,$("voiceReplay"),false,ok=>{
   if(voiceStream!==state)return;state.playing=false;
   if(!ok){state.failed=true;voiceReady();sayStatus("播报中断，可播放完整回答重试");return}
   voiceStreamPump(state);
  });
  if(!started){state.playing=false;state.failed=true;voiceReady();sayStatus("设备无法自动播报，可播放完整回答重试")}
 }else if(state.done){voiceStreamReset();voiceReady();sayStatus("继续聆听");voiceAutoNext()}
 else sayStatus("正在等待后续回答");
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
 if(p.audio){p.audio.onended=p.audio.onerror=p.audio.onplaying=p.audio.onpause=null;p.audio.pause();p.audio.removeAttribute("src");p.audio.load()}if(p.url){URL.revokeObjectURL(p.url);p.url=null}
 p.phase="failed";p.pause.hidden=true;voicePlaybackButton(p.button,false);
 readerStatus(p,why);p.retry.hidden=false;p.cloud.hidden=!connected("gemini");
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
 const chunks=p.chunks||(p.chunks=voiceChunks(p.text));let i=p.index||0;
 function next(){
  if(messageReader!==p)return;
  clearTimeout(p.timer);
  if(i>=chunks.length){p.utterance=null;readerDone(p);return}
  const part=chunks[i],lang=voiceLanguage(part),u=new window.SpeechSynthesisUtterance(part);p.index=i;
  const voices=synth.getVoices(),matching=voices.filter(v=>v.lang.toLowerCase().split("-")[0]===lang.toLowerCase().split("-")[0]);
  const selected=matching.find(v=>v.voiceURI===voiceSession.voice)||matching.find(v=>v.localService&&v.lang.toLowerCase()===lang.toLowerCase())||matching.find(v=>v.localService)||matching[0];
  u.lang=selected?.lang||lang;u.rate=voiceSession.rate;u.volume=1;if(selected)u.voice=selected;
  p.utterance=u;p.phase="loading";p.pause.hidden=true;
  readerStatus(p,"准备朗读 "+(i+1)+"/"+chunks.length+"…");
  p.timer=setTimeout(()=>readerFail(p,"系统语音未启动，可重试或使用云朗读"),10000);
  u.onstart=()=>{if(messageReader!==p||p.utterance!==u)return;clearTimeout(p.timer);p.phase="playing";p.pause.hidden=false;p.pause.textContent="暂停";readerStatus(p,"朗读中 "+(i+1)+"/"+chunks.length);p.timer=setTimeout(()=>readerFail(p,"系统语音播放超时"),Math.max(30000,part.length*900))};
  u.onend=()=>{if(messageReader===p&&p.utterance===u){p.index=++i;next()}};
  u.onerror=e=>{if(messageReader===p&&p.utterance===u)readerFail(p,"系统朗读中断，点击重试继续当前段")};
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
   const res=await fetch("/api/message/read-aloud",{method:"POST",credentials:"same-origin",cache:"no-store",headers:{"content-type":"application/json"},body:JSON.stringify({text:chunks[i],confirmed:true}),signal:ctrl.signal});
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
 p.retry=control("重试",()=>{if(messageReader!==p)return;if(p.phase==="done")p.index=0;readerLocal(p)});p.cloud=control("云朗读",()=>void readerCloud(p));p.stop=control("关闭",()=>stopMessageReader());
 p.pause.hidden=true;p.retry.hidden=true;p.cloud.hidden=true;
 panel.append(status,p.pause,p.retry,p.cloud,p.stop);button.closest(".message-copy-bar").append(panel);messageReader=p;
 if(!p.text){readerFail(p,"这条消息没有可朗读文字");return}
 readerLocal(p);
}

function voiceReleaseMic(){
 clearTimeout(voiceSession.recordTimer);voiceSession.recordTimer=null;
 if(voiceSession.frame!==null)cancelAnimationFrame(voiceSession.frame);voiceSession.frame=null;
 try{voiceSession.source?.disconnect()}catch{}voiceSession.source=null;voiceSession.analyser=null;
 const stream=voiceSession.stream;voiceSession.stream=null;
 if(stream)for(const track of stream.getTracks())track.stop();
}
function voiceStop(){
 voiceStreamReset();voiceSession.active=false;voiceSession.opening=false;voiceSession.pending=false;voiceSession.listening=false;voiceSession.resumePending=false;voiceSession.turn++;
 voiceSession.request?.abort();voiceSession.request=null;
 const recorder=voiceSession.recorder;voiceSession.recorder=null;
 if(recorder?.state==="recording")try{recorder.stop()}catch{}
 voiceReleaseMic();
 const rec=voiceSession.recognition;voiceSession.recognition=null;
 if(rec)try{rec.abort()}catch{}
 voiceCancel();const context=voiceSession.context;voiceSession.context=null;if(context)void context.close().catch(()=>{});voiceReady("开始说话");sayStatus("已停止对话");
}
function voiceSendTranscript(text,turn){
 if(turn!==voiceSession.turn||!voiceSession.active)return;
 const transcript=String(text||"").trim();
 if(!transcript){voiceReady("重新说话");sayStatus("没有识别到语句，请重新说话");return}
 $("voiceHeard").hidden=true;$("voiceHeard").textContent=transcript;
 if(S.busy||$("prompt").value.trim()||S.attachments.length){voiceReady();$("voiceHeard").hidden=false;$("voiceHeard").textContent=transcript;sayStatus("聊天已有请求或草稿，识别文字已保留");return}
 $("prompt").value=transcript;settlePromptSize();voiceSession.pending=true;$("voiceStart").disabled=true;$("voiceStart").textContent="等待回答…";
 voiceStreamReset();$("voiceReplay").disabled=true;voiceTranscript("user",transcript);sayStatus("正在思考");void sendMessage(null,false,turn).finally(()=>{if(turn===voiceSession.turn&&voiceSession.pending){voiceSession.pending=false;$("voiceReplay").disabled=!voiceSession.lastReply;voiceReady();sayStatus("发送未完成，请返回聊天检查原消息")}});
}
function voiceRecordSupported(){return typeof window.MediaRecorder==="function"&&!!navigator.mediaDevices?.getUserMedia}
function voiceRecognitionSupported(){return voiceRecordSupported()||!!(window.SpeechRecognition||window.webkitSpeechRecognition)}
async function voiceRecord(turn){
 $("voiceStart").disabled=true;$("voiceStart").textContent="开启麦克风…";sayStatus("正在开启麦克风");
 try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
  if(turn!==voiceSession.turn||!voiceSession.active){for(const track of stream.getTracks())track.stop();return}
  voiceSession.opening=false;voiceSession.stream=stream;
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
    const text=await transcribeRecordedAudio(audio,voiceSession.lang,request.signal);
   if(voiceSession.request===request)voiceSession.request=null;
   voiceSendTranscript(text,turn);
   }catch(e){if(turn===voiceSession.turn&&voiceSession.active){voiceReady("重新说话");sayStatus(e?.name==="AbortError"?"语音识别超时，请重试":String(e?.message||"识别失败，请重试"))}}
   finally{clearTimeout(timeout);if(voiceSession.request===request)voiceSession.request=null;if(turn===voiceSession.turn&&voiceSession.resumePending)voiceAutoNext()}
  };
  recorder.start();if(voiceSession.context?.state!=="running")try{await Promise.race([voiceSession.context?.resume(),new Promise(resolve=>setTimeout(resolve,600))])}catch{}
  if(turn!==voiceSession.turn||voiceSession.recorder!==recorder)return;
  const automatic=voiceWatchSilence(stream,recorder,turn);
  $("voiceStart").disabled=false;$("voiceStart").textContent="结束本句";$("voiceHeard").textContent="正在录音…";sayStatus(automatic?"正在聆听":"点击结束本句发送");
  voiceSession.recordTimer=setTimeout(()=>{
   if(turn!==voiceSession.turn||recorder.state!=="recording")return;
   recorder.stop();
  },30000);
 }catch(e){
  if(turn!==voiceSession.turn)return;
  voiceSession.opening=false;voiceSession.recorder=null;voiceSession.listening=false;voiceReleaseMic();voiceReady("重新说话");
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
 if(voiceSession.opening||auto&&voiceSession.listening)return;
 if(voiceSession.reading){sayStatus("正在播报，结束后继续聆听");return}
 if(voiceSession.listening){
  const recorder=voiceSession.recorder,rec=voiceSession.recognition;
  $("voiceStart").disabled=true;$("voiceStart").textContent="识别中…";
  try{if(recorder?.state==="recording")recorder.stop();else if(rec)rec.stop()}catch{voiceStop()}
  return;
 }
 if(!S.user){sayStatus("请先登录");return}
 if(S.freeToolsMode){sayStatus("请返回聊天模式");return}
 if(S.busy||voiceSession.pending||voiceSession.request){if(auto)voiceSession.resumePending=true;else sayStatus("等待上一轮回复完成");return}
 if($("prompt").value.trim()||S.attachments.length){sayStatus("输入框已有草稿，请先处理");return}
 if(S.provider!=="free"&&!connected(S.provider)){sayStatus("模型未连接，请先选择可用模型");return}
 if(S.provider!=="free"&&!isFreeModel(S.provider,S.model)&&!S.allowPaid){sayStatus("当前模型未授权使用额度");return}
 stopDictation(true);stopMessageReader();voiceCancel();voiceSession.active=true;voiceSession.resumePending=false;
 if(!auto){voiceStreamReset();voiceAudioContext();voicePrime()}
 const turn=++voiceSession.turn;
 if(voiceRecordSupported()&&(S.voiceTranscriptionConfigured!==false||!(window.SpeechRecognition||window.webkitSpeechRecognition))){voiceSession.opening=true;void voiceRecord(turn)}else voiceNativeListen(turn);
}
function voiceOpen(){
 voiceLoad();$("voiceLang").value=voiceSession.lang;$("voiceRate").value=String(voiceSession.rate);
 if(S.freeToolsMode)setFreeToolsMode(false);
 voiceStop();stopDictation(true);stopMessageReader();if(S.composerMode!=="text")setComposerMode("text");voiceChoices();show("voiceDialog");
 voiceSession.lastReply="";$("voiceHeard").hidden=true;$("voiceTranscript").replaceChildren();$("voiceHeard").textContent="";$("voiceReply").textContent="";$("voiceReplay").disabled=true;
 $("voiceStart").disabled=!voiceRecognitionSupported();$("voiceStart").textContent="开始说话";
 sayStatus(voiceRecognitionSupported()?"点击开始说话":"当前浏览器不支持录音，可使用系统键盘听写");
 if(voiceRecognitionSupported())voiceListen();
}
function voiceWire(){
 voiceLoad();
 $("voiceChatOpen").addEventListener("click",voiceOpen);
 $("voiceReplay").addEventListener("click",()=>{if(voiceSession.reading){if(voiceStream)voiceStream.failed=true;voiceCancel();voiceReady();sayStatus("已停止播报");return}if(voiceSession.listening||voiceSession.opening||voiceSession.pending||voiceSession.request)return;if(voiceSession.lastReply&&!voiceSpeak(voiceSession.lastReply,$("voiceReplay"),true))sayStatus("当前设备不支持播报")});
 $("voiceStart").addEventListener("click",()=>voiceListen());
 $("voiceStop").addEventListener("click",()=>{voiceStop();hide("voiceDialog")});
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
 if(S.busy||S.freeToolsMode)return false;
 const text=String(content||"").trim(),input=$("prompt");if(!text)return false;
 if(input.value.trim()&&input.value.trim()!==text&&!confirm("替换当前未发送的草稿？"))return false;
 if(send&&/\[文件：/.test(text)){flashError("原消息包含附件，请重新选择文件后发送");return false}
 input.value=text;setComposerMode(mode);settlePromptSize();
 if(send)void sendMessage(continueFrom);else input.focus();
 return true;
}
function retiredImageMessage(row){
 return Boolean(row?.dataset.mediaFormat)||row?.dataset.messageKind==="video"||/图生图/.test(String(row?.dataset.usedModel||""))||/^(?:图生图失败|图生图排队超时|图生图已下线)/.test(String(row?.textContent||"").trim())||/\[文件：参考图\]\(\/api\/files\//.test(messageQuestion(row));
}
function retryImageMessage(row){
 if(S.busy||S.freeToolsMode||!row?.isConnected||retiredImageMessage(row))return;
 const original=messageQuestion(row);
 if(/\[文件：/.test(original))return;
 if(messageDraft(original,false,"image"))void sendMessage();
}
function retryMessage(row){
 if(retiredImageMessage(row))return;
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
  if(!retiredImageMessage(row))bar.append(messageTool("refresh-cw","重新生成",()=>retryMessage(row)));
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
   if(!retiredImageMessage(row)&&text.trim()&&text.length<480000&&!row.dataset.messageKind&&!/^!\[/.test(text)){
    const next=messageTool("continue-write","继续生成",b=>continueTextReply(row,text,b));
    next.classList.add("message-continue-btn");bar.append(next);
   }
  }
 }
 if(!user){bar.append(trigger);renderIcons(trigger);const stamp=Number(row.dataset.createdAt);if(stamp>0){const time=node("time","message-time",new Intl.DateTimeFormat("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:false}).format(stamp));time.dateTime=new Date(stamp).toISOString();time.title=new Date(stamp).toLocaleString("zh-CN");bar.append(time)}bar.append(panel)}
 const translated=row.querySelector(":scope > .message-translation");
 if(translated)row.append(bar,translated);else row.append(bar);
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
function markImageMessage(row,active){
 if(!row)return;let tag=row.querySelector(":scope > .image-message-tag");
 if(active&&!tag){tag=node("span","image-message-tag","作图");row.append(tag)}
 else if(!active&&tag)tag.remove();
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
  if(model==="GIF动图")row.dataset.mediaFormat="gif";else if(model==="贴纸")row.dataset.mediaFormat="sticker";
  const pending=String(content||"").match(/^\[\[aigzt:image-job:([0-9a-f-]{36})\]\]$/i);
  if(pending){row.dataset.messageKind="image";bubble.replaceChildren();if(model==="贴纸")void restoreDeviceMedia(bubble,messageId||pending[1],"image","",pending[1]).then(found=>{if(!found&&bubble.isConnected)row.remove()});else if(existingRow)renderImageJob(bubble,pending[1]);else void restoreDeviceMedia(bubble,messageId||pending[1],"image","",pending[1]).then(found=>{if(!found&&bubble.isConnected)renderImageJob(bubble,pending[1])})}
  const picture=String(content||"").match(/^!\[生成图片\]\((\/api\/files\/[0-9a-f-]{36})\)$/);
  if(picture){row.dataset.messageKind="image";void restoreDeviceMedia(bubble,messageId,"image",picture[1])}
  const videoPending=String(content||"").match(/^\[\[aigzt:video-job:([0-9a-f-]{36})\]\]$/i);
  const paidVideo=String(content||"").match(/^\[\[aigzt:paid-video:(grok|runway|luma|vidu):([A-Za-z0-9_-]{4,160})\]\]$/);
  if(paidVideo){row.dataset.messageKind="video";void restoreDeviceMedia(bubble,messageId,"video").then(found=>{if(!found&&bubble.isConnected)row.remove()});}
  const videoDone=String(content||"").match(/^\[\[aigzt:video:([0-9a-f-]{36})\]\]$/i);
  if(videoPending){const kind=model==="GIF动图"?"image":"video";row.dataset.messageKind=kind;void restoreDeviceMedia(bubble,messageId||videoPending[1],kind).then(found=>{if(!found&&bubble.isConnected)row.remove()});}
  if(videoDone){row.dataset.messageKind="video";void restoreDeviceMedia(bubble,messageId||videoDone[1],"video","/api/video/media/"+videoDone[1]);}
  if(!pending&&!picture&&!videoPending&&!videoDone&&!paidVideo&&/^(?:视频、GIF 和贴纸生成已下线|图生图已下线(?:，仍可识别图片)?|(?:图生图|贴纸生成|视频生成|生成服务)已下线(?:，原有记录保留)?)$/.test(String(content||"").trim())){row.remove();return row}
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
  markImageMessage(row,row.dataset.messageKind==="image"&&!row.dataset.mediaFormat||!!bubble.querySelector(".chat-image-prompt")||!!replyImages?.length);
   if(!pending&&!videoPending&&!videoDone&&!paidVideo&&!picture&&!localDone)appendMessageCopy(row,content);
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
let chatOpenEpoch=0,chatOpenLoading=false;
function newChat(keepDrawer=false){
 ++chatOpenEpoch;chatOpenLoading=false;
 stopDictation(true);
 closeMessageMore();
 stopMessageReader();if(voiceSession.active||voiceSession.reading){voiceStop();hide("voiceDialog")}
 S.creativeMode=null;
 S.code=false;$("codeToggle").classList.remove("active");$("codeToggle").setAttribute("aria-pressed","false");
 if(S.freeToolsMode)setFreeToolsMode(false);
 
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
 const epoch=++chatOpenEpoch,owner=S.user?.id;chatOpenLoading=true;
 stopDictation(true);
 closeMessageMore();
 stopMessageReader();if(voiceSession.active||voiceSession.reading){voiceStop();hide("voiceDialog")}
 S.creativeMode=null;
 if(S.freeToolsMode)setFreeToolsMode(false);
 
 try{
  const v=await api("/api/chats/"+id,undefined,12000);
  if(epoch!==chatOpenEpoch||S.user?.id!==owner||S.busy)return;
  S.chatId=id;restoreChatInputMode();$("messageList").replaceChildren();hideWelcome();
  for(const m of v.messages){let incomplete=false;try{incomplete=Boolean(JSON.parse(m.usage_json||"null")?.incomplete)}catch{}appendMessage(m.role,m.body,m.model,null,incomplete,m.id,Boolean(m.saved),m.feedback,m.usage_json,m.created_at)}
  const c=S.chats.find(c=>c.id===id);
  if(c&&c.project_id!==undefined){S.activeProjectId=c.project_id||null;renderProjects()}
  // A chat's saved provider is historical; viewing it must not overwrite the active selection.
  updateModelTitle();
  renderHistory();closeMenu();
 }catch(e){if(epoch===chatOpenEpoch&&S.user?.id===owner)flashError("会话读取失败："+humanError(e))}
 finally{if(epoch===chatOpenEpoch)chatOpenLoading=false}
}
function isAutoChatModel(){return S.provider==="free"&&S.model==="free:auto"}
// Mode restoration is based on real successful calls, not the last catalog click.
function pickModeModel(mode,records,allowed,freeChoice=()=>false){
 if(mode!=="free"&&mode!=="personal")return null;
 const candidates=[];
 for(const [key,row] of Object.entries(records||{})){
  const [provider,model]=key.split("\0");
  if(!provider||provider==="free"||!model||!Number.isFinite(row.success)||row.success<=0||row.failure>row.success)continue;
  if(mode==="free"&&!freeChoice(provider,model))continue;
  if(allowed(provider,model))candidates.push({provider,model,at:row.success});
 }
 return candidates.sort((a,b)=>b.at-a.at)[0]||null;
}
function modeModelAllowed(provider,model){
 if(!provider||provider==="free"||!model||!connected(provider)||retiredVideoModel(provider,model)||unavailableChatModel(provider,model))return false;
 const known=allModels().find(m=>modelRoute(m)===provider&&m.id===model);
 return !known||known.type==="text";
}
function modeCandidate(mode){
 ensureModelHistory();
 const allowed=(provider,model)=>modeModelAllowed(provider,model)&&(mode!=="free"||personalFreeChoice(provider,model));
 const last=readModelPref(chatModelStorageKey(S.user?.id||"")+":success:"+mode);
 if(last&&allowed(last.provider,last.model)&&modelHealth(last.provider,last.model).success)return last;
 const history=pickModeModel(mode,modelHistoryRecords,allowed,personalFreeChoice);
 if(history)return history;
 // With no successful history, use a previously verified, already bound account.
 const saved=Object.entries(S.savedProviders).filter(([,v])=>v.verified).sort((a,b)=>(b[1].updatedAt||0)-(a[1].updatedAt||0));
 for(const [provider,entry] of saved){
  if(allowed(provider,entry.model))return {provider,model:entry.model};
  const row=allModels().find(m=>modelRoute(m)===provider&&m.type==="text"&&allowed(provider,m.id));
  if(row)return {provider,model:row.id};
 }
 return null;
}
function restoreSuccessfulMode(mode){
 if(mode==="auto"){modelPrefSync.versions.chat++;setFreeDefault(false);rememberChatModelSelection();updateModelTitle();return true}
 if(!["free","personal"].includes(mode))return false;
 selectedChatMode=mode;
 const selected=modeCandidate(mode);
 if(!selected){S.provider="";S.model="";S.modelTitle="";S.allowPaid=false;S.selectedFree=false;freeModeChoosing=false;saveModeIdentity();updateModelTitle();return false}
 const {provider,model}=selected;
 const known=allModels().find(m=>modelRoute(m)===provider&&m.id===model);
 S.provider=provider;S.model=model;S.modelTitle=known?.name||model;
 S.allowPaid=Boolean(S.savedProviders[provider]?.consent);S.selectedFree=isFreeModel(provider,model);
 freeModeChoosing=false;chatModelPreferenceReady=true;modelPrefSync.versions.chat++;
 rememberChatModelSelection();updateModelTitle();return true;
}
function switchChatMode(mode){
 const serial=++modeSwitchSerial,owner=S.user?.id;
 modelPrefSync.versions.chat++;
 if(restoreSuccessfulMode(mode)||mode==="auto")return;
 void (async()=>{
  await Promise.all([loadModelHistory(),S.connectionsLoaded?Promise.resolve():fetchConnections()]);
  if(serial!==modeSwitchSerial||S.user?.id!==owner||S.busy||selectedChatMode!==mode||S.model)return;
  restoreSuccessfulMode(mode);
 })();
}
function chatModeLabel(){return selectedChatMode==="auto"?"自动模式":selectedChatMode==="free"?"自由模式":"个人模式"}
function refreshChatModeUI(){
 const current=$("chatModeCurrent"),auto=$("chatAutoChoice"),mark=$("chatAutoMark"),manual=$("chatBoundChoice"),manualMark=$("chatBoundMark"),personal=$("chatPersonalChoice"),personalMark=$("chatPersonalMark");
 if(!current||!auto||!mark||!manual||!manualMark)return;
 const selected=chatModeLabel()==="自动模式";current.textContent=chatModeLabel();current.title=freeModeChoosing?"请选择模型":chatSelectedName();
 if($("composerCurrentMode"))$("composerCurrentMode").textContent=chatModeLabel();
 for(const b of $("composerModeMenu")?.querySelectorAll("[data-chat-mode]")||[]){const active=b.dataset.chatMode===(selected?"auto":chatModeLabel()==="个人模式"?"personal":"free");b.setAttribute("aria-pressed",String(active));b.classList.toggle("selected",active);const mark=b.querySelector(".composer-mode-mark");if(mark)mark.textContent=active?"✓":"";}
 auto.classList.toggle("selected",selected);auto.setAttribute("aria-pressed",String(selected));mark.textContent=selected?"✓":"";
 const free=selectedChatMode==="free",own=selectedChatMode==="personal";
 manual.classList.toggle("selected",free);manual.setAttribute("aria-pressed",String(free));manualMark.textContent=free?"✓":"";
 if(personal){personal.classList.toggle("selected",own);personal.setAttribute("aria-pressed",String(own));personalMark.textContent=own?"✓":"";}
}
function chooseFreeChatMode(){
 $("chatModeMenu").open=false;freeModeChoosing=true;modelPrefSync.versions.chat++;S.query="";$("modelSearch").value="";activateSource("all");updateModelTitle();$("modelScroll").scrollTop=0;void loadCatalog();
}
function chatSelectedName(){
 if(freeModeChoosing)return "自由模式 · 选择模型";
 if(S.provider==="free")return S.model==="free:auto"?"自动模式":(S.modelTitle||S.model);
 const raw=String(S.modelTitle||S.model||"").trim(),label=raw.startsWith(S.provider+" · ")?raw.slice(S.provider.length+3):raw;
 return providerRouteLabel(S.provider)+" · "+providerLabel(S.provider)+" · "+(label||S.model);
}
function updateComposerModel(){
 const line=$("composerModelLine"),name=$("composerModelName"),switcher=$("composerSwitchModel");
 if(!line||!name||!switcher)return;
 line.hidden=S.freeToolsMode;
 const active=selectedChatMode==="auto"?"":String(S.modelTitle||S.model||"").replace(/^free:or\//,"").replace(new RegExp("^"+String(S.provider||"").replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+" · "),"");
 name.textContent=active;name.title=active;
 name.hidden=!active;
 $("composerCurrentMode").textContent=chatModeLabel();
 switcher.setAttribute("aria-label","切换模式");switcher.title="切换模式";
}
function updateModelTitle(){
 updateComposerModel();refreshChatModeUI();
}
function setModel(row){
 if(row.type==="video"||retiredVideoModel(row.provider,row.id))return;
 const route=row.availableWith==="openrouter-key"?"openrouter":row.provider;
 if(unavailableChatModel(route,row.id)){flashError("此模型当前不可调用，请选择其他模型");return}
 if(row.type!=="text"&&!(row.type==="image"&&row.availableWith==="openrouter-key"&&row.outputImages)){
  if(row.type==="audio")return;
  freeModeChoosing=false;hide("modelDialog");
  if(row.type==="image"){setComposerMode("image");$("prompt").focus({preventScroll:true})}
  
  return;
 }
 setComposerMode("text");freeModeChoosing=false;chatModelPreferenceReady=true;
 // Models returned by the OpenRouter catalog must use OpenRouter authentication, not the model author's API.
 const via=row.availableWith==="openrouter-key"?"openrouter":row.provider;
 if(via==="free"){switchChatMode("auto");hide("modelDialog");return}
 modeSwitchSerial++;
 if(composerCatalogMode==="free"&&!personalFreeChoice(via,row.id))return;
 selectedChatMode=(composerCatalogMode==="free"||selectedChatMode==="free"&&personalFreeChoice(via,row.id))?"free":"personal";
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


function restoreChatInputMode(){
 S.code=false;$("codeToggle").classList.remove("active");$("codeToggle").setAttribute("aria-pressed","false");
 setComposerMode("text");hideAttachMenu();$("toolTray").hidden=true;$("toolsAction").setAttribute("aria-expanded","false");
}
function setComposerMode(mode){
 mode=mode==="image"?"image":"text";S.composerMode=mode;
 
 if(mode!=="text"&&S.code){S.code=false;$("codeToggle").classList.remove("active");$("codeToggle").setAttribute("aria-pressed","false")}
 $("imageMode").classList.toggle("active",mode==="image");
 $("imageMode").setAttribute("aria-pressed",String(mode==="image"));
 $("prompt").placeholder=mode==="image"?"描述想画的内容…":S.code?"描述编程任务…":"向 AI 提问…";
 resizePrompt();updateComposerModel();
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
 if(S.composerMode!=="image"&&arguments[1]!==true)return file;
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
 const owner=S.user.id,view=chatOpenEpoch;const current=()=>S.user?.id===owner&&chatOpenEpoch===view;
 S.uploading=true;$("attachButton").disabled=true;flashError("");
 try{
 for(const file of files){
  try{
   const heic=/^image\/hei[cf]$/i.test(file.type||"")||/\.(heic|heif)$/i.test(file.name||"");
   const autoReference=S.provider==="free"&&S.model==="free:auto"&&/^(?:image\/(?:jpeg|png|webp|hei[cf]))$/i.test(file.type||"");
   if(!current())break;
   const selected=await optimizeImageReference(file,heic||autoReference);
   if(!current())break;
   if(selected.size>8000000){flashError("单文件最大8MB："+file.name);continue}
   const body=new FormData();body.append("file",selected);
   const r=await fetch("/api/files/upload",{method:"POST",credentials:"same-origin",body});
   const d=await r.json().catch(()=>null);
   if(!r.ok||!d?.ok)throw Error(d?.error||"HTTP "+r.status);
   if(!current())break;
   S.attachments.push(d);renderAttachments();
  }catch(e){if(current())flashError("上传失败："+humanError(e))}
 }
 }finally{S.uploading=false;$("attachButton").disabled=false}
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



const CURATED_FREE_TOOLS=[{"provider":"PromptHero","name":"PromptHero · 提示词库","category":"作图","categories":["作图","视频","搜索","写作"],"url":"https://prompthero.com/","features":["图片提示词","视频提示词","创作灵感"],"access":"free","note":"免费浏览公开提示词；高级功能按原站收费。","verified":true,"aliases":["Prompt Hero","提示词"]},{"provider":"Unlimited AI","name":"Unlimited AI · 中文聊天","category":"聊天","categories":["聊天","综合","写作"],"url":"https://app.unlimitedai.chat/zh","features":["中文对话","故事创作"],"access":"free","guest":true,"login":"原站标注免登录","note":"标准模型有免费入口，VIP 功能及实际额度以原站为准。","verified":true,"aliases":["Unlimited AI Chat","无限AI"]},{"provider":"Venice AI","name":"Venice Agent · 智能体","category":"聊天","categories":["聊天","智能体","角色"],"url":"https://venice.ai/chat/agent/B2AcOHq","features":["智能体对话"],"access":"daily","login":"以原站为准","note":"用户提供的专属智能体直达链接，智能体访问权限及免费额度以原站为准。","aliases":["Venice","B2AcOHq"]},{"provider":"Venice AI","name":"Venice · 自由聊天","category":"聊天","categories":["聊天","角色","综合"],"url":"https://venice.ai/ai-tools/ai-chat","features":["私密聊天","开放创作","多模型"],"access":"daily","login":"需登录","note":"免费档约10次文本提问/天，部分模型功能收费。","featured":true,"verified":true,"policy":"开放创作"},{"provider":"Venice AI","name":"Venice · AI 作图","category":"作图","categories":["作图","综合"],"url":"https://venice.ai/ai-tools/ai-image-generator","features":["文生图","私密作图","开放创作"],"access":"daily","login":"需登录","note":"免费档约15次图片提示/天，高级功能可能收费。","featured":true,"verified":true,"policy":"开放创作"},{"provider":"Venice AI","name":"Venice · 图片编辑","category":"图生图","categories":["图生图","修图"],"url":"https://venice.ai/ai-tools/ai-photo-editor","features":["图生图","提示词修图","开放创作"],"access":"daily","login":"需登录","note":"共用免费图片额度，部分图片编辑能力需要订阅。","featured":false,"verified":true,"policy":"开放创作"},{"provider":"Mage","name":"Mage · 多模型作图","category":"作图","categories":["作图","综合"],"url":"https://www.mage.space/ai-image-generator","features":["多模型","文生图","写实与动漫"],"access":"trial","login":"按官网要求","note":"可使用初始免费Gems，不同模型费用不同。","featured":true,"verified":true},{"provider":"Mage","name":"Mage · 图生图","category":"图生图","categories":["图生图","修图"],"url":"https://www.mage.space/ai-image-to-image-generator","features":["图像变体","上传参考图","图片重绘"],"access":"trial","login":"按官网要求","note":"免费开始，后续按模型消耗Gems。","featured":false,"verified":true},{"provider":"Viggle","name":"Viggle · 图片转视频","category":"视频","categories":["视频","图生图","角色"],"url":"https://viggle.ai/tools/image-to-video-ai/","features":["图生视频","动作迁移","角色动画"],"access":"daily","login":"需登录","note":"官网说明免费账号约5条视频/天，免费导出带水印。","featured":true,"verified":true},{"provider":"Viggle","name":"Viggle · 图片动画","category":"视频","categories":["视频","角色"],"url":"https://viggle.ai/tools/ai-image-animator/","features":["人物动效","动作模板","照片动画"],"access":"daily","login":"需登录","note":"免费额度每日刷新；高质量导出有限制。","featured":false,"verified":true},{"provider":"PixVerse","name":"PixVerse · AI 视频","category":"视频","categories":["视频","综合"],"url":"https://pixverse.ai/en/product/ai-video-generator","features":["文生视频","镜头控制","视频效果"],"access":"daily","login":"需登录","note":"有免费积分，复杂视频和部分模型可能需要付费。","featured":false,"verified":true},{"provider":"PixVerse","name":"PixVerse · 图生视频","category":"视频","categories":["视频","图生图"],"url":"https://pixverse.ai/en/product/image-to-video","features":["图生视频","照片运动","镜头动画"],"access":"daily","login":"需登录","note":"每天免费积分，生成门槛随模型变化。","featured":false,"verified":true},{"provider":"Recraft","name":"Recraft · 图片设计","category":"作图","categories":["作图","修图"],"url":"https://www.recraft.ai/ai-image-generator","features":["文生图","文字海报","创意设计"],"access":"daily","login":"需登录","note":"免费账户有每日积分，部分作品限非商业用途。","featured":false,"verified":true},{"provider":"Recraft","name":"Recraft · 图片编辑","category":"图生图","categories":["图生图","修图"],"url":"https://www.recraft.ai/ai-photo-editor","features":["上传照片","自然语言修图","局部编辑"],"access":"daily","login":"需登录","note":"免费图像编辑与生成共用每日积分。","featured":false,"verified":true},{"provider":"Recraft","name":"Recraft · SVG 矢量图","category":"作图","categories":["作图","修图"],"url":"https://www.recraft.ai/vector-editor","features":["矢量图","SVG","设计素材"],"access":"daily","login":"需登录","note":"免费每日积分，商用权限和导出限制以套餐为准。","featured":false,"verified":true},{"provider":"Leonardo AI","name":"Leonardo · 创意生图","category":"作图","categories":["作图","图生图"],"url":"https://leonardo.ai/","features":["艺术作图","图像变体","风格生成"],"access":"daily","login":"需登录","note":"官方免费档有每日Token，高级模型付费。","featured":false,"verified":true},{"provider":"Ideogram","name":"Ideogram · 文字海报","category":"作图","categories":["作图","修图"],"url":"https://ideogram.ai/","features":["文字入图","海报","LOGO"],"access":"daily","login":"需登录","note":"符合条件的账号可获每周免费积分，注册渠道可能影响资格。","featured":false,"verified":true},{"provider":"SeaArt","name":"SeaArt · 图片视频创作","category":"综合","categories":["综合" ,"作图","修图"],"url":"https://www.seaart.ai/","features":["AI作图","图生视频","图片处理"],"access":"daily","login":"需登录","note":"免费每日体力或积分，具体模型各有消耗。","featured":false,"verified":true},{"provider":"Tensor.Art","name":"Tensor.Art · 模型画廊","category":"作图","categories":["作图","图生图","视频"],"url":"https://tensor.art/","features":["LoRA","模型作图","图生图"],"access":"daily","login":"需登录","note":"每日免费Energy，视频免费活动可能临时变化。","featured":false,"verified":true},{"provider":"Qwen Studio","name":"千问 · 聊天与作图","category":"聊天","categories":["聊天","作图","综合"],"url":"https://chat.qwen.ai/","features":["中文聊天","图片生成","多模态"],"access":"free","login":"按官网要求","note":"提供基础免费体验，模型和地区可能设限。","featured":false,"verified":true},{"provider":"Qwen Studio","name":"千问 · 图片编辑","category":"图生图","categories":["图生图","修图"],"url":"https://chat.qwen.ai/?inputFeature=image_edit","features":["中文修图","图像编辑","上传图片"],"access":"free","login":"按官网要求","note":"千问官方图像编辑入口，登录要求按网页提示。","featured":false,"verified":true},{"provider":"Character.AI","name":"Character.AI · 角色聊天","category":"聊天","categories":["聊天","角色"],"url":"https://character.ai/","features":["角色扮演","人物互动","故事对话"],"access":"free","login":"需登录","note":"基础消息聊天免费，并非无审核服务。","featured":false,"verified":true},{"provider":"Janitor","name":"Janitor · 角色互动","category":"角色","categories":["角色","聊天"],"url":"https://jani.com/","features":["社区角色","情景对话","自建人物"],"access":"free","login":"需登录","note":"Janitor 官方站点，模型和付费条件依使用方式决定。","featured":false,"verified":true},{"provider":"KoboldAI","name":"KoboldAI Lite · 社区聊天","category":"聊天","categories":["聊天","角色","写作"],"url":"https://lite.koboldai.net/","features":["AI Horde","自由聊天","故事写作"],"access":"community","login":"可直接体验","note":"社区志愿者模型可能排队，私密内容不要直接提交。","featured":false,"verified":true},{"provider":"Marvis AI","name":"Marvis · 免费视频体验","category":"视频","categories":["视频"],"url":"https://ai.jxzhihi.com/","features":["文生视频","短视频","免注册"],"access":"trial","login":"可直接体验","note":"官方说明无需注册即可免费尝试，但个人GPU可能排队。","featured":false,"verified":true},{"provider":"Hugging Face","name":"Qwen · 图像编辑演示","category":"图生图","categories":["图生图","修图"],"url":"https://huggingface.co/spaces/Qwen/Qwen-Image-Edit","features":["Qwen修图","图像编辑","社区演示"],"access":"community","login":"按官网要求","note":"第三方Space可能休眠排队或要求登录。","featured":false,"verified":true},{"provider":"Hugging Face","name":"Real-ESRGAN · 图片增强","category":"修图","categories":["修图"],"url":"https://huggingface.co/spaces/akhaliq/Real-ESRGAN","features":["高清放大","照片增强","清晰化"],"access":"community","login":"按官网要求","note":"社区Space可能休眠或暂停推理。","featured":false,"verified":true},{"provider":"Runway","name":"Runway · 视频试用","category":"视频","categories":["视频","图生图"],"url":"https://app.runwayml.com/","features":["文生视频","图生视频","视频编辑"],"access":"trial","login":"需登录","note":"免费计划主要为一次性试用积分，很多模型不在免费档。","featured":false,"verified":true},{"provider":"Luma","name":"Luma · Dream Machine","category":"视频","categories":["视频","图生图"],"url":"https://lumalabs.ai/dream-machine","features":["图转视频","镜头运动","短片生成"],"access":"trial","login":"需登录","note":"免费档有严格限制，功能和商用授权按官网规则。","featured":false,"verified":true}];
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
 {provider:"LTX Video",name:"LTX · 免费文生视频",category:"视频",categories:["视频"],url:"https://lightricks-ltx-video-distilled.hf.space/",features:["文生视频","原始模型页面"],access:"community",note:"实际生成能力受上游 ZeroGPU 额度限制"},
 {provider:"Wan I2V",name:"Wan · 免费图生视频",category:"视频",categories:["视频"],url:"https://zerogpu-aoti-wan2-2-fp8da-aoti-faster.hf.space/",features:["图生视频","原始模型页面"],access:"community",note:"共享 ZeroGPU 来源，可能无剩余额度"},
 {provider:"Wan Frame",name:"Wan · 免费首尾帧",category:"视频",categories:["视频"],url:"https://mcp-tools-wan-2-2-first-last-frame.hf.space/",features:["首尾帧生成","原始模型页面"],access:"community",note:"共享 ZeroGPU 来源，生成可能排队或失败"}
];
// Guest-access entries reflect published service information, not a live inference guarantee.
const GUEST_CHAT_TOOLS=[{"provider":"Lumo","name":"Lumo · 隐私聊天","category":"聊天","categories":["聊天"],"url":"https://lumo.proton.me/","features":["隐私聊天","写作"],"access":"free","login":"免注册体验","guest":true,"note":"官方支持免账号访客聊天，额度有限。","source":"https://proton.me/support/lumo-getting-started"},{"provider":"Brave","name":"Ask Brave · 联网问答","category":"聊天","categories":["聊天"],"url":"https://search.brave.com/","features":["联网问答","资料检索"],"access":"free","login":"免注册体验","guest":true,"note":"搜索首页切换 Ask，免费公开使用。","source":"https://brave.com/whats-new/ask-brave/"},{"provider":"Grok","name":"Grok · 访客聊天","category":"聊天","categories":["聊天"],"url":"https://grok.com/","features":["问答","联网搜索"],"access":"free","login":"免注册体验","guest":true,"note":"官方支持未登录使用；地区、功能和额度以实际页面为准。","source":"https://x.ai/legal/faq"},{"provider":"Venice AI","name":"Venice · 免登录体验","category":"聊天","categories":["聊天"],"url":"https://venice.ai/text-generation","features":["聊天","写作"],"access":"free","login":"免注册体验","guest":true,"note":"官方文字体验页可免注册试用，完整功能可能需账号。","source":"https://venice.ai/text-generation"},{"provider":"AskMe","name":"AskMe · 多语言问答","category":"聊天","categories":["聊天"],"url":"https://www.ask-me-ai.app/","features":["中文问答","写作","编程"],"access":"free","login":"免注册体验","guest":true,"note":"官网提供免登录聊天入口，免费用量以站点为准。","source":"https://www.ask-me-ai.app/"},{"provider":"ROK","name":"ROK · 聊天与代码","category":"聊天","categories":["聊天"],"url":"https://rok.rokteam.org/","features":["聊天","编程"],"access":"free","login":"免注册体验","guest":true,"note":"官网标示免注册基础聊天，进阶功能需账号。","source":"https://rok.rokteam.org/"},{"provider":"WKO AI","name":"WKO AI · 本地聊天","category":"聊天","categories":["聊天"],"url":"https://www.webkitonline.com/ai/chat/","features":["本地模型","Qwen","WebGPU"],"access":"free","login":"免注册体验","guest":true,"note":"浏览器本地运行，首次下载模型，需兼容设备及足够内存。","source":"https://webkitonline.com/free-llm-chat/"},{"provider":"Yiaho","name":"Yiaho · 免费问答","category":"聊天","categories":["聊天"],"url":"https://www.yiaho.com/en/ai/","features":["聊天","写作"],"access":"free","login":"免注册体验","guest":true,"note":"官网提供免注册聊天；第三方模型名称和额度以网站实际为准。","source":"https://www.yiaho.com/en/"}];
const MAINSTREAM_TOOL_ADDITIONS=[{"name":"Replit Agent","provider":"Replit","category":"编程","url":"https://replit.com/","access":"daily","categories":["编程","智能体"],"note":"原 Ghostwriter；Starter 免费额度有限","source":"https://replit.com/pricing","features":["编程","智能体"],"verified":true,"mainstream":true,"aliases":["Ghostwriter"]},{"name":"Tabnine","provider":"Tabnine","category":"编程","url":"https://www.tabnine.com/","access":"paid","categories":["编程"],"note":"原免费版不保证仍提供；按当前企业方案核实","source":"https://www.tabnine.com/pricing/","features":["编程"],"verified":true,"mainstream":true},{"name":"Jasper","provider":"Jasper","category":"写作","url":"https://www.jasper.ai/","access":"trial","categories":["写作","营销"],"note":"营销文案与品牌内容，试用后付费","source":"https://www.jasper.ai/pricing","features":["写作","营销"],"verified":true,"mainstream":true},{"name":"Grammarly","provider":"Grammarly","category":"写作","url":"https://www.grammarly.com/","access":"free","categories":["写作","办公"],"note":"基础拼写语法校正免费","source":"https://www.grammarly.com/plans","features":["写作","办公"],"verified":true,"mainstream":true},{"name":"DeepL 翻译","provider":"DeepL","category":"翻译","url":"https://www.deepl.com/translator","access":"free","categories":["翻译"],"note":"网页版基础翻译免费；API 与 Pro 独立计费","source":"https://www.deepl.com/translator","features":["翻译"],"verified":true,"mainstream":true},{"name":"Google 翻译","provider":"Google Translate","category":"翻译","url":"https://translate.google.com/","access":"free","categories":["翻译"],"note":"公开网页翻译；Cloud Translation API 独立计费","source":"https://translate.google.com/","features":["翻译"],"login":"基础文本翻译免注册","verified":true,"mainstream":true,"guest":true},{"name":"OpenAI Playground","provider":"OpenAI","category":"API/开发","url":"https://platform.openai.com/playground","access":"paid","categories":["API/开发","编程"],"note":"使用 API 账户额度，ChatGPT 订阅不等同 API 余额","source":"https://help.openai.com/en/articles/20001626-api-credits-benefit-for-eligible-chatgpt-subscriptions","features":["API/开发","编程"],"verified":true,"mainstream":true},{"name":"Copilot Studio","provider":"Microsoft","category":"智能体","url":"https://www.microsoft.com/en/copilot/microsoft-copilot-studio","access":"trial","categories":["智能体","办公"],"note":"原 Power Virtual Agents；试用及计费条件以官网为准","source":"https://www.microsoft.com/en/copilot/pricing/copilot-studio","features":["智能体","办公"],"verified":true,"mainstream":true,"aliases":["Power Virtual Agents","PVA"]},{"name":"watsonx Assistant","provider":"IBM","category":"智能体","url":"https://cloud.ibm.com/catalog/services/watsonx-assistant","access":"trial","categories":["智能体","API/开发"],"note":"原 Watson Assistant；Lite 评估额度及资格以账号为准","source":"https://cloud.ibm.com/docs/watson-assistant?topic=watson-assistant-watson-assistant-faqs","features":["智能体","API/开发"],"verified":true,"mainstream":true,"aliases":["IBM Watson Assistant","Watson Assistant Lite"]},{"name":"Brand Studio","provider":"Stability AI","category":"作图","url":"https://brandstudio.com/","access":"paid","categories":["作图","图生图","修图"],"note":"原 DreamStudio；旧域名已重定向，订阅额度不等于免费","source":"https://kb.stability.ai/knowledge-base/-fraud-alert-identifying-genuine-dream-studio-transactions-and-reporting-fraud","features":["作图","图生图","修图"],"verified":true,"mainstream":true,"aliases":["DreamStudio","Stable Diffusion"]},{"name":"Craiyon","provider":"Craiyon","category":"作图","url":"https://www.craiyon.com/en","access":"free","categories":["作图"],"note":"原 DALL-E Mini；基础文生图免费，付费功能另计","source":"https://www.craiyon.com/en","features":["作图"],"verified":true,"mainstream":true,"aliases":["DALL-E Mini","DALL·E Mini"]},{"name":"Copy.ai","provider":"Copy.ai","category":"写作","url":"https://www.copy.ai/","access":"paid","categories":["写作","营销","办公"],"note":"商业营销平台；当前免费试用资格待确认，不列作持续免费","source":"https://www.copy.ai/prices","features":["写作","营销","办公"],"verified":true,"mainstream":true},{"name":"Chatsonic","provider":"Writesonic","category":"聊天","url":"https://writesonic.com/chat","access":"free","categories":["聊天","写作","营销","搜索"],"note":"官方提供基础免费计划；高级功能付费","source":"https://writesonic.com/chat","features":["聊天","写作","营销","搜索"],"verified":true,"mainstream":true},{"name":"Poe","provider":"Quora Poe","category":"聊天","url":"https://poe.com/","access":"daily","categories":["聊天","作图"],"note":"多模型聊天；免费用户每日点数","source":"https://help.poe.com/hc/en-us/articles/19944206309524-Poe-FAQs","features":["聊天","作图"],"verified":true,"mainstream":true},{"name":"Elicit","provider":"Elicit","category":"搜索","url":"https://elicit.com/","access":"free","categories":["搜索","办公","写作"],"note":"论文检索与研究；Basic 免费，研究 Agent 有上限","source":"https://elicit.com/pricing","features":["搜索","办公","写作"],"verified":true,"mainstream":true},{"name":"Consensus","provider":"Consensus","category":"搜索","url":"https://consensus.app/","access":"free","categories":["搜索","办公"],"note":"论文循证问答；基础搜索免费","source":"https://help.consensus.app/en/articles/10087865-subscription-plans","features":["搜索","办公"],"verified":true,"mainstream":true},{"name":"ChatPDF","provider":"ChatPDF","category":"办公","url":"https://www.chatpdf.com/","access":"free","categories":["办公","聊天","搜索"],"note":"PDF、文件问答；基础功能有限","source":"https://www.chatpdf.com/","features":["办公","聊天","搜索"],"verified":true,"mainstream":true},{"name":"Cursor","provider":"Cursor","category":"编程","url":"https://cursor.com/","access":"free","categories":["编程","智能体"],"note":"AI 编程客户端；免费计划及用量以官网为准","source":"https://cursor.com/pricing","features":["编程","智能体"],"verified":true,"mainstream":true},{"name":"Antigravity","provider":"Google","category":"编程","url":"https://antigravity.google/","access":"free","categories":["编程","智能体"],"note":"Google AI 编程工具；个人免费计划有周限额","source":"https://antigravity.google/pricing","features":["编程","智能体"],"verified":true,"mainstream":true},{"name":"Ollama","provider":"Ollama","category":"本地","url":"https://ollama.com/","access":"local","categories":["本地","编程","聊天"],"note":"本地开源模型推理；需要安装及设备算力，云服务另计","source":"https://ollama.com/","features":["本地","编程","聊天"],"login":"需下载/部署","verified":true,"mainstream":true},{"name":"LM Studio","provider":"LM Studio","category":"本地","url":"https://lmstudio.ai/","access":"local","categories":["本地","聊天","编程"],"note":"本地模型与客户端；需要下载和设备算力","source":"https://lmstudio.ai/","features":["本地","聊天","编程"],"login":"需下载/部署","verified":true,"mainstream":true},{"name":"StableStudio","provider":"Stability AI","category":"本地","url":"https://github.com/Stability-AI/StableStudio","access":"local","categories":["本地","作图","编程"],"note":"开源生成界面；需自行部署，推理 API 可能收费","source":"https://github.com/Stability-AI/StableStudio","features":["本地","作图","编程"],"login":"需下载/部署","verified":true,"mainstream":true},{"name":"Groq Cloud","provider":"Groq","category":"API/开发","url":"https://console.groq.com/keys","access":"api","categories":["API/开发","免费API"],"note":"免费 API 计划限速；注册后申请密钥","source":"https://console.groq.com/docs/rate-limits","features":["API/开发","免费API"],"login":"需账号/API Key","verified":true,"mainstream":true},{"name":"Gemini API","provider":"Google","category":"API/开发","url":"https://aistudio.google.com/apikey","access":"api","categories":["API/开发","免费API"],"note":"部分模型有免费 API 层；账号及地区限制适用","source":"https://ai.google.dev/gemini-api/docs/pricing","features":["API/开发","免费API"],"login":"需账号/API Key","verified":true,"mainstream":true},{"name":"OpenRouter 免费模型","provider":"OpenRouter","category":"API/开发","url":"https://openrouter.ai/collections/free-models","access":"api","categories":["API/开发","免费API"],"note":"仅免费模型路由；付费模型单独计费","source":"https://openrouter.ai/collections/free-models","features":["API/开发","免费API"],"login":"需账号/API Key","verified":true,"mainstream":true},{"name":"Workers AI","provider":"Cloudflare","category":"API/开发","url":"https://developers.cloudflare.com/workers-ai/","access":"api","categories":["API/开发","免费API"],"note":"每天免费算力额度；部分模型仅付费计划可用","source":"https://developers.cloudflare.com/workers-ai/platform/pricing/","features":["API/开发","免费API"],"login":"需账号/API Key","verified":true,"mainstream":true},{"name":"Cohere API","provider":"Cohere","category":"API/开发","url":"https://dashboard.cohere.com/","access":"trial","categories":["API/开发"],"note":"免费试验密钥限额，仅评估；生产使用收费","source":"https://docs.cohere.com/v2/docs/cohere-faqs","features":["API/开发"],"verified":true,"mainstream":true},{"name":"Google AI 开发文档","provider":"Google","category":"API/开发","url":"https://ai.google.dev/","access":"free","categories":["API/开发","编程"],"note":"免费阅读开发文档；实际调用按模型与账号计费","source":"https://ai.google.dev/","features":["API/开发","编程"],"verified":true,"mainstream":true},{"name":"Microsoft Designer","provider":"Microsoft","category":"作图","url":"https://designer.microsoft.com/","access":"free","categories":["作图","修图","办公"],"note":"网页设计与图片工具；AI 额度随账号而变","source":"https://designer.microsoft.com/","features":["作图","修图","办公"],"verified":true,"mainstream":true},{"name":"Writesonic","provider":"Writesonic","category":"营销","url":"https://writesonic.com/","access":"trial","categories":["营销","写作"],"note":"SEO 与内容营销，免费试用后按计划收费","source":"https://writesonic.com/pricing","features":["营销","写作"],"verified":true,"mainstream":true},{"name":"IBM watsonx.ai","provider":"IBM","category":"API/开发","url":"https://www.ibm.com/products/watsonx-ai","access":"trial","categories":["API/开发","智能体"],"note":"Lite 及试用资源限额，生产服务可能收费","source":"https://www.ibm.com/products/watsonx-ai/pricing","features":["API/开发","智能体"],"verified":true,"mainstream":true}];
const MAINSTREAM_TOOL_META={"https://chatgpt.com/":{"mainstream":true,"aliases":["OpenAI","ChatGPT"],"categories":["聊天","写作","办公","作图"],"access":"free"},"https://claude.ai/":{"mainstream":true,"categories":["聊天","写作","编程","办公"]},"https://gemini.google.com/app":{"mainstream":true,"categories":["聊天","搜索","写作","编程","作图","办公"]},"https://www.perplexity.ai/":{"mainstream":true,"categories":["聊天","搜索","办公"]},"https://copilot.microsoft.com/":{"mainstream":true,"aliases":["Bing Chat","必应"],"categories":["聊天","搜索","办公"]},"https://github.com/features/copilot":{"mainstream":true,"categories":["编程","智能体"],"note":"Copilot Free 与符合资格的学生计划；用量有限"},"https://huggingface.co/spaces":{"mainstream":true,"categories":["目录","编程","作图","聊天"]},"https://aistudio.google.com/":{"mainstream":true,"categories":["编程","API/开发","聊天"]},"https://notebooklm.google.com/":{"mainstream":true,"categories":["写作","办公","搜索"]},"https://www.deepl.com/write":{"mainstream":true,"categories":["写作","办公"]},"https://chat.deepseek.com/":{"mainstream":true,"categories":["聊天","写作","编程"]},"https://www.canva.com/":{"mainstream":true,"categories":["作图","办公"]},"https://duck.ai/":{"mainstream":true,"categories":["聊天"],"access":"free"}};
const PERCHANCE_ADDITIONS=[{"provider":"Perchance","name":"Astra AI","category":"角色","categories":["角色","聊天"],"url":"https://perchance.org/astra-ai","features":["AI 陪伴","角色对话"],"access":"community","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。","aliases":["Astra","阿斯特拉","Астра"]},{"provider":"Perchance","name":"AI Chat 社区版","category":"聊天","categories":["聊天"],"url":"https://perchance.org/arkisbaj83","features":["AI 对话"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"SageSupport","category":"角色","categories":["角色","聊天"],"url":"https://perchance.org/sagesupport-chatbot","features":["角色聊天"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"Character Make","category":"作图","categories":["作图","角色创建"],"url":"https://perchance.org/charctermake","features":["角色图片"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"AI Logo Generator","category":"作图","categories":["作图"],"url":"https://perchance.org/ai-logo-generator","features":["Logo 设计"],"access":"community","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"AI Landscape","category":"作图","categories":["作图"],"url":"https://perchance.org/ai-landscape-generator","features":["风景生成"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"Pretty AI Art","category":"作图","categories":["作图"],"url":"https://perchance.org/43ho1oqd9l","features":["人物绘画"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"Nekonome Chan","category":"角色","categories":["角色","聊天"],"url":"https://perchance.org/nekonome-chan","features":["角色对话"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"AI Chat 社区版 2","category":"聊天","categories":["聊天"],"url":"https://perchance.org/7h81gglxqf","features":["AI 对话"],"access":"community","guest":true,"login":"页面标注免注册","note":"已核对原站页面入口；生成能力和额度以原站实际服务为准。"},{"provider":"Perchance","name":"ASChat · 高级角色代码","category":"角色","categories":["角色","聊天","角色创建","编程"],"url":"https://perchance.org/aschat","features":["自定义 JavaScript","角色编辑器","社区代码库"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"高级角色创建器 Enhanced","category":"角色","categories":["角色","角色创建","作图"],"url":"https://perchance.org/enhanced-character-generator","features":["角色卡","角色导出","人物图像"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"Unseen Scribe · 社区角色库","category":"角色","categories":["角色","角色创建","目录"],"url":"https://perchance.org/unseen-scribe-library","features":["社区角色","JSON 与 PNG 角色卡","搜索导出"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"Unseen Scribe · 创作者工具集","category":"目录","categories":["目录","角色","角色创建"],"url":"https://perchance.org/unseen-scribe","features":["社区工具合集","角色创作"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"Unseen Scribe · 图像实验室","category":"作图","categories":["作图","角色"],"url":"https://perchance.org/unseen-scribe-image-lab","features":["人物图像","多风格"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"Custom Code · 自定义代码","category":"编程","categories":["编程","角色创建"],"url":"https://perchance.org/custom-code","features":["自定义代码","生成器编辑"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"角色聊天开发文档","category":"编程","categories":["编程","角色","角色创建"],"url":"https://perchance.org/ai-character-chat-docs","features":["角色代码","记忆","世界观"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"高级人物生成器","category":"角色","categories":["角色","角色创建"],"url":"https://perchance.org/adv-char-gen","features":["人物设定","角色创建"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"Jerms · 人物生成器","category":"角色","categories":["角色","角色创建"],"url":"https://perchance.org/jermsgen","features":["角色生成"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"人物外貌生成器","category":"角色","categories":["角色","角色创建"],"url":"https://perchance.org/appearance-generator","features":["外貌设定"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"故事生成扩展版","category":"写作","categories":["写作"],"url":"https://perchance.org/ai-story-generator-extended","features":["故事创作","扩展工具"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance","name":"AS Ghost Writer","category":"写作","categories":["写作","角色"],"url":"https://perchance.org/as-ghost-writer","features":["人物故事","AI 写作"],"note":"社区生成器；实际可用性、登录和额度以原站为准。"},{"provider":"Perchance 社区","name":"角色卡与自定义代码库","category":"角色","categories":["角色","角色创建","编程","目录"],"url":"https://github.com/nosfertm/perchance-character-database","features":["共享角色","自定义代码","导入文档"],"note":"社区 GitHub 资源库，不是独立聊天服务。"}];
const PERCHANCE_COMMUNITY_TOOLS=[{"provider":"Perchance","name":"R.M Photo Generator","category":"作图","url":"https://perchance.org/rm-photo-generator","features":["写实摄影"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"专业摄影 2","category":"作图","url":"https://perchance.org/prpg2","features":["写实摄影","图片放大"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"专业摄影 1","category":"作图","url":"https://perchance.org/prpg","features":["写实摄影","风格控制"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"AI Image Studio","category":"作图","url":"https://perchance.org/w07bbo48qj","features":["图像工作室"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"BadGrampy 绘图","category":"作图","url":"https://perchance.org/badgrampy-simple-ai-image-generator","features":["简洁作图"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"想象王国","category":"作图","url":"https://perchance.org/tkoi","features":["多风格绘图"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"You Are THE BEST","category":"作图","url":"https://perchance.org/you-are-the-best","features":["多风格摄影"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"批量提示词测试","category":"作图","url":"https://perchance.org/mspt","features":["多提示词对比"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"图片提示词优化","category":"作图","url":"https://perchance.org/image-prompt-optimizer","features":["提示词优化","图像生成"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"Daveed 图片提示词","category":"作图","url":"https://perchance.org/daveeds-image-prompt-generator","features":["图片提示词"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"Multi-Flux 绘图","category":"作图","url":"https://perchance.org/ufo-flux1s-flux-upscaled","features":["图像生成"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"Real Image Editor","category":"修图","url":"https://perchance.org/ried","features":["图片编辑"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"互动拼图制作","category":"修图","url":"https://perchance.org/icollage","features":["拼图"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"Story AI","category":"写作","url":"https://perchance.org/story-ai","features":["故事创作"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"Burg 故事生成","category":"写作","url":"https://perchance.org/burgs-take-ai-story-generator","features":["故事创作"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"},{"provider":"Perchance","name":"代码项目生成","category":"编程","url":"https://perchance.org/code-project-generator-public-use","features":["项目代码"],"note":"独立社区工具；已核对页面入口，实际生成、额度及服务可用性以原站为准。"}];
const VERIFIED_PRODUCTIVITY_TOOLS=[{"name":"Fizzdoc · OCR 图片转文字","provider":"Fizzdoc","category":"识图","url":"https://fizzdoc.com/image-to-text/","categories":["识图","办公","修图","本地"],"features":["OCR","截图文字","扫描件"],"access":"local","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"Fizzdoc · 视频转文字","provider":"Fizzdoc","category":"视频","url":"https://fizzdoc.com/video-to-text/","categories":["视频","音频","办公","本地"],"features":["视频转录","字幕","Whisper"],"access":"local","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"Fizzdoc · Office 文件阅读","provider":"Fizzdoc","category":"办公","url":"https://fizzdoc.com/view/","categories":["办公","本地"],"features":["Word","Excel","PDF","CSV","文件查看"],"access":"local","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"Fizzdoc · 办公与音视频工具","provider":"Fizzdoc","category":"办公","url":"https://fizzdoc.com/","categories":["办公","本地","音频","视频","修图","识图"],"features":["Word","Excel","PPT","OCR","去背景","音频转文字"],"access":"local","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"WaveSpeed · AI 高清放大","provider":"WaveSpeed","category":"修图","url":"https://wavespeed.ai/free-tools/image-upscaler","categories":["修图","本地"],"features":["超分辨率","2倍","4倍","高清修复"],"access":"local","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"WaveSpeed · 图片尺寸转换","provider":"WaveSpeed","category":"修图","url":"https://wavespeed.ai/free-tools/image-resizer","categories":["修图","本地"],"features":["图片缩放","批量图片处理"],"access":"local","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"WaveSpeed · 本地免费工具箱","provider":"WaveSpeed","category":"综合","url":"https://wavespeed.ai/free-tools","categories":["综合","办公","识图","音频","视频","修图","本地"],"features":["背景移除","语音转文字","PDF转Word","图片增强"],"access":"local","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"WaveSpeed · 本地音乐生成","provider":"WaveSpeed","category":"音频","url":"https://wavespeed.ai/free-tools/ai-music-generator","categories":["音频","音乐","本地"],"features":["文字生成伴奏","原创器乐"],"access":"local","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"Mermaid · 流程图和思维导图","provider":"Mermaid","category":"办公","url":"https://mermaid.live/edit","categories":["办公","编程","思维导图"],"features":["流程图","思维导图","时序图","SVG"],"access":"free","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"draw.io · 免费图表编辑","provider":"draw.io","category":"办公","url":"https://app.diagrams.net/","categories":["办公","思维导图"],"features":["流程图","架构图","组织图"],"access":"free","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"Ezgif · 多图合成GIF","provider":"Ezgif","category":"动图","url":"https://ezgif.com/maker","categories":["动图","视频","修图"],"features":["GIF","多图合成","动态表情包"],"access":"free","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"Ezgif · GIF缩放与处理","provider":"Ezgif","category":"动图","url":"https://ezgif.com/resize","categories":["动图","修图","视频"],"features":["GIF缩放","动图压缩","批量处理"],"access":"free","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"DuckDuckGo · 网页搜索","provider":"DuckDuckGo","category":"搜索","url":"https://duckduckgo.com/","categories":["搜索"],"features":["网页搜索","实时检索"],"access":"free","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"MusicGen · 社区音乐演示","provider":"Meta","category":"音频","url":"https://huggingface.co/spaces/facebook/MusicGen","categories":["音频","音乐"],"features":["文字生成音乐","开源模型演示"],"access":"community","verified":true,"guest":false,"login":"社区演示或下载模型；可能需登录和算力","note":"模型演示或本地模型；不代表可直接调用的免费API。"},{"name":"AudioGen · 开源音效模型","provider":"Meta","category":"音频","url":"https://huggingface.co/facebook/audiogen-medium","categories":["音频","音乐","本地"],"features":["文字生成音效","本地GPU模型"],"access":"local","verified":true,"guest":false,"login":"社区演示或下载模型；可能需登录和算力","note":"模型演示或本地模型；不代表可直接调用的免费API。"},{"name":"Wasm Tools · 本地文件工具","provider":"Wasm Tools","category":"综合","url":"https://wasmtools.dev/","categories":["综合","本地","办公","音频","视频","修图","识图"],"features":["OCR","Word","Excel","PPT","背景移除","转录"],"access":"local","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"BrowseryTools · 本地AI工具","provider":"BrowseryTools","category":"综合","url":"https://browserytools.com/","categories":["综合","本地","办公","翻译","音频","视频","修图","识图"],"features":["语音转文字","字幕","图片增强","翻译","OCR"],"access":"local","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"PixelTools · 批量媒体和文件处理","provider":"PixelTools","category":"综合","url":"https://pixeltools.io/","categories":["综合","修图","音频","视频","办公","识图"],"features":["图片批量处理","文件转换","OCR","音频处理"],"access":"free","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"name":"Toolvy · 音视频字幕编辑","provider":"Toolvy","category":"视频","url":"https://toolvy.net/","categories":["视频","音频","本地","修图"],"features":["字幕","视频处理","音频处理"],"access":"local","verified":true,"guest":true,"login":"公开网页基础工具","note":"已核对公开功能说明；打开外部工具，是否需登录、限制和输出能力以实际页面为准。"},{"provider":"Thinkfree","name":"Thinkfree · Office 在线制作","category":"办公","categories":["办公"],"url":"https://onlineoffice.thinkfree.com/","features":["Word","Excel","PowerPoint","在线编辑"],"access":"free","verified":true,"note":"官方免费编辑器，登录及使用条件以页面为准。"},{"provider":"Chaxus","name":"Chaxus · 本地 Office 编辑","category":"办公","categories":["办公","本地"],"url":"https://edit.chaxus.com/","features":["创建文档","DOCX","XLSX","PPTX","本地编辑"],"access":"local","verified":true,"guest":true,"login":"无需账号","note":"公开说明为浏览器本地编辑，可创建空白文件；兼容性取决于设备。"},{"provider":"jsfxr","name":"jsfxr · 游戏音效生成","category":"音频","categories":["音频","音乐","本地"],"url":"https://sfxr.me/","features":["复古游戏音效","音效合成","WAV"],"access":"local","verified":true,"guest":true,"login":"无需账号","note":"浏览器音效合成，不是大模型文字生成音效。"}];
const PERCHANCE_IMAGE_CHAT_TOOLS=[{"provider":"Perchance","name":"Better AI Image Generator","category":"作图","categories":["作图"],"url":"https://perchance.org/better-ai-image-generator","features":["文字生成图片"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["better-ai-image-generator"],"source":"https://perchance.org/better-ai-image-generator"},{"provider":"Perchance","name":"AI Image Generator · Image URL","category":"作图","categories":["作图"],"url":"https://perchance.org/ai-image-url","features":["图片生成"],"access":"community","verified":true,"note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["ai-image-url"],"source":"https://perchance.org/ai-image-url"},{"provider":"Perchance","name":"AI Image Generator · 3ghr7wjn8e","category":"作图","categories":["作图"],"url":"https://perchance.org/3ghr7wjn8e","features":["文字生成图片"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["3ghr7wjn8e"],"source":"https://perchance.org/3ghr7wjn8e"},{"provider":"Perchance","name":"AI Image Generator · umgz4xz2xn","category":"作图","categories":["作图"],"url":"https://perchance.org/umgz4xz2xn","features":["文字生成图片"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["umgz4xz2xn"],"source":"https://perchance.org/umgz4xz2xn"},{"provider":"Perchance","name":"AI Image Generator · l7wjej7gt4","category":"作图","categories":["作图"],"url":"https://perchance.org/l7wjej7gt4","features":["文字生成图片"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["l7wjej7gt4"],"source":"https://perchance.org/l7wjej7gt4"},{"provider":"Perchance","name":"Fast Free AI Image Generator","category":"作图","categories":["作图"],"url":"https://perchance.org/new-image-gen","features":["文字生成图片"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["new-image-gen"],"source":"https://perchance.org/new-image-gen"},{"provider":"Perchance","name":"Imgevo · 批量提示词作图","category":"作图","categories":["作图"],"url":"https://perchance.org/imgevo","features":["批量提示词、种子、ZIP 下载"],"access":"community","verified":true,"note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["imgevo"],"source":"https://perchance.org/imgevo"},{"provider":"Perchance","name":"AI Image Generator · azkiohdwcj","category":"作图","categories":["作图"],"url":"https://perchance.org/azkiohdwcj","features":["文字生成图片"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["azkiohdwcj"],"source":"https://perchance.org/azkiohdwcj"},{"provider":"Perchance","name":"AI Image Generator · df7qgnkgxo","category":"作图","categories":["作图"],"url":"https://perchance.org/df7qgnkgxo","features":["文字生成图片"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["df7qgnkgxo"],"source":"https://perchance.org/df7qgnkgxo"},{"provider":"Perchance","name":"My AI Image Generator","category":"作图","categories":["作图"],"url":"https://perchance.org/uus69max0w","features":["文字生成图片、多风格"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["uus69max0w"],"source":"https://perchance.org/uus69max0w"},{"provider":"Perchance","name":"Stunning Images","category":"作图","categories":["作图"],"url":"https://perchance.org/stunning-images","features":["图片生成"],"access":"community","verified":true,"note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["stunning-images"],"source":"https://perchance.org/stunning-images"},{"provider":"Perchance","name":"Free The Vibe Arts","category":"作图","categories":["作图"],"url":"https://perchance.org/ftvaiart","features":["AI 艺术绘图"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["ftvaiart"],"source":"https://perchance.org/ftvaiart"},{"provider":"Perchance","name":"AI Image Generator · R&D","category":"作图","categories":["作图"],"url":"https://perchance.org/r-and-d","features":["图片生成"],"access":"community","verified":true,"note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["r-and-d"],"source":"https://perchance.org/r-and-d"},{"provider":"Perchance","name":"AI Image Generator · ImageGenAndCaption","category":"作图","categories":["作图"],"url":"https://perchance.org/imagegenandcaptionfromimagegen","features":["文字生成图片"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["imagegenandcaptionfromimagegen"],"source":"https://perchance.org/imagegenandcaptionfromimagegen"},{"provider":"Perchance","name":"Text to Image with Negative Prompt","category":"作图","categories":["作图"],"url":"https://perchance.org/text-to-image-with-neg","features":["正向及负向提示词"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["text-to-image-with-neg"],"source":"https://perchance.org/text-to-image-with-neg"},{"provider":"Perchance","name":"AI Chat · aq7t07461n","category":"聊天","categories":["聊天"],"url":"https://perchance.org/aq7t07461n","features":["AI 对话"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["aq7t07461n"],"source":"https://perchance.org/aq7t07461n"},{"provider":"Perchance","name":"Mr S's AI Chat","category":"聊天","categories":["聊天"],"url":"https://perchance.org/csm2b5489r","features":["AI 对话"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["csm2b5489r"],"source":"https://perchance.org/csm2b5489r"},{"provider":"Perchance","name":"AI Character Chat · 5pwegbx6om","category":"角色","categories":["角色","聊天"],"url":"https://perchance.org/5pwegbx6om","features":["角色聊天"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["5pwegbx6om"],"source":"https://perchance.org/5pwegbx6om"},{"provider":"Perchance","name":"AI Character Chat · zqk8zrlhwc","category":"角色","categories":["角色","聊天"],"url":"https://perchance.org/zqk8zrlhwc","features":["角色聊天"],"access":"community","verified":true,"guest":true,"login":"原站标注免注册","note":"已核对公开页面；实际生成能力与服务状态以原站为准。","aliases":["zqk8zrlhwc"],"source":"https://perchance.org/zqk8zrlhwc"}];
const EXTERNAL_FREE_TOOLS=[...PERCHANCE_IMAGE_CHAT_TOOLS,...VERIFIED_PRODUCTIVITY_TOOLS,...MAINSTREAM_TOOL_ADDITIONS,...ORIGINAL_GENERATION_SITES,...GUEST_CHAT_TOOLS,...VERIFIED_FREE_MEDIA_TOOLS,...CURATED_FREE_TOOLS,...ROLEPLAY_MEDIA_TOOLS,...VERIFIED_ADDITIONAL_FREE_TOOLS,...PERCHANCE_ADDITIONS,...PERCHANCE_COMMUNITY_TOOLS,{"provider":"FurAI · Perchance.org","name":"FurAI 综合创作助手","category":"综合","categories":["综合","聊天","角色","作图","修图","视频","写作"],"url":"https://perchance.org/fur-ai","featured":true,"features":["多角色聊天","AI 作图","提示词优化","图生图编辑","图片增强","去除背景","图片转视频","图片压缩","图片工作室","角色记忆"],"note":"进入 FurAI 后选择其内部工具。部分图像与视频功能使用第三方服务，可能需要排队、授权或受额度限制。"},{"provider":"Duck.ai","name":"Duck.ai · 多模型聊天","category":"聊天","url":"https://duck.ai/","guest":true,"login":"免注册","features":["多模型聊天","隐私"],"access":"free","note":"官方免费匿名聊天；有使用额度。","source":"https://duckduckgo.com/duckduckgo-help-pages/duckai","verified":true},{"provider":"Duck.ai","name":"免费 AI 作图与修改","category":"作图","url":"https://duck.ai/"},{"provider":"Perchance","name":"Perchance · 角色聊天","category":"聊天","url":"https://perchance.org/ai-character-chat","categories":["聊天","角色"],"guest":true,"login":"免注册","note":"官方页面标示免注册角色聊天。"},{"provider":"Perchance","name":"AI 文生图","category":"作图","url":"https://perchance.org/ai-text-to-image-generator"},{"provider":"Perchance","name":"写实照片","category":"作图","url":"https://perchance.org/ai-photo-generator"},{"provider":"Perchance","name":"角色形象","category":"角色","url":"https://perchance.org/ai-character-generator"},{"provider":"Perchance","name":"动漫作图","category":"作图","url":"https://perchance.org/ai-anime-generator"},{"provider":"Perchance","name":"人像生成","category":"作图","url":"https://perchance.org/ai-portrait-generator"},{"provider":"Perchance","name":"剧情场景","category":"写作","url":"https://perchance.org/ai-scenario-generator"},{"provider":"Perchance","name":"图片提示词","category":"作图","url":"https://perchance.org/ai-image-prompt"},{"provider":"Perchance","name":"Flux 提示词","category":"作图","url":"https://perchance.org/ai-image-prompt-generator"},{"provider":"Perchance","name":"Perchance · AI 聊天","category":"聊天","url":"https://perchance.org/ai-chat","guest":true,"login":"免注册","note":"官方页面标示免注册免费聊天。"},{"provider":"Perchance","name":"故事生成","category":"写作","url":"https://perchance.org/ai-story-generator"},{"provider":"Perchance","name":"文字冒险 RPG","category":"互动","url":"https://perchance.org/ai-rpg"},{"provider":"Perchance","name":"社区视频生成","category":"视频","url":"https://perchance.org/ai-video-generator"},{"provider":"PerchanceAI","name":"文生图","category":"作图","url":"https://perchanceai.com/t/text-to-image"},{"provider":"PerchanceAI","name":"图生图","category":"修图","url":"https://perchanceai.com/t/img2img"},{"provider":"PerchanceAI","name":"照片编辑","category":"修图","url":"https://perchanceai.com/t/photo-editor"},{"provider":"PerchanceAI","name":"照片增强","category":"修图","url":"https://perchanceai.com/t/ai-photo-enhancer"},{"provider":"PerchanceAI","name":"图片转文字","category":"修图","url":"https://perchanceai.com/t/photo-to-text"},{"provider":"PerchanceAI","name":"故事写作","category":"写作","url":"https://perchanceai.com/t/story"},{"provider":"PerchanceAI","name":"AI 助手","category":"聊天","url":"https://perchanceai.com/c/askbuddy"},{"provider":"PerchanceAI","name":"角色扮演聊天","category":"聊天","url":"https://perchanceai.com/c/ai-roleplay-chat","categories":["聊天","角色"]},{"provider":"PerchanceAI","name":"对话训练","category":"聊天","url":"https://perchanceai.com/c/crush-chat","categories":["聊天","角色"]},{"provider":"PerchanceAI","name":"专业图片生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-image-professional"},{"provider":"PerchanceAI","name":"摄影图片生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-photo"},{"provider":"PerchanceAI","name":"像素画生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-pixel-art-generator"},{"provider":"PerchanceAI","name":"无缝纹理生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/texture-generator"},{"provider":"PerchanceAI","name":"角色参考图","category":"角色","url":"https://perchanceai.com/ai/en/generate/character-reference-sheet"},{"provider":"PerchanceAI","name":"产品创意","category":"写作","url":"https://perchanceai.com/t/product-idea-generator"},{"provider":"PerchanceAI","name":"简笔人物画","category":"作图","url":"https://perchanceai.com/t/stick-figure-generator"},{"provider":"PerchanceAI","name":"角色姓名","category":"写作","url":"https://perchanceai.com/t/1920s-name-generator"},{"provider":"PerchanceAI","name":"角色创建","category":"角色","url":"https://perchanceai.com/c/character-creator"},{"provider":"PerchanceAI","name":"故事协作","category":"写作","url":"https://perchanceai.com/c/story-weaver"},{"provider":"PerchanceAI","name":"剧情互动","category":"互动","url":"https://perchanceai.com/c/dating-sim-text-game"},{"provider":"PerchanceAI","name":"图片变换","category":"修图","url":"https://perchanceai.com/t/image-transform-with-seed"},{"provider":"PerchanceAI","name":"艺术图像","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-art-generator"},{"provider":"PerchanceAI","name":"图像变体","category":"作图","url":"https://perchanceai.com/ai/en/generate/image-to-image"},{"provider":"PerchanceAI","name":"AI 绘图","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-drawing-generator"},{"provider":"PerchanceAI","name":"真假 AI 游戏","category":"互动","url":"https://perchanceai.com/c/bot-or-human"},{"provider":"PerchanceAI","name":"魔法灯互动","category":"互动","url":"https://perchanceai.com/c/ask-a-genie"},{"provider":"PerchanceAI","name":"照片工具库","category":"修图","url":"https://perchanceai.com/ai/en/image"},{"provider":"PerchanceAI","name":"所有免费工具","category":"目录","url":"https://perchanceai.com/explore?focus=1"},{"provider":"PerchanceAI","name":"热门工具","category":"目录","url":"https://perchanceai.com/explore/list/top"},{"provider":"PerchanceAI","name":"图像生成目录","category":"目录","url":"https://perchanceai.com/explore?category=image-generators"},{"provider":"PerchanceAI","name":"照片编辑目录","category":"目录","url":"https://perchanceai.com/explore?category=photo-editing"},{"provider":"PerchanceAI","name":"肖像工具目录","category":"目录","url":"https://perchanceai.com/explore?category=portrait"},{"provider":"PerchanceAI","name":"动漫工具目录","category":"目录","url":"https://perchanceai.com/explore?category=anime"},{"provider":"PerchanceAI","name":"长篇写作目录","category":"目录","url":"https://perchanceai.com/explore?category=prose_writing"},{"provider":"PerchanceAI","name":"写作工具目录","category":"目录","url":"https://perchanceai.com/explore?category=writing"},{"provider":"PerchanceAI","name":"角色互动目录","category":"目录","url":"https://perchanceai.com/explore?category=roleplay"},{"provider":"PerchanceAI","name":"AI 助手目录","category":"目录","url":"https://perchanceai.com/explore?type=assistants"},{"provider":"PerchanceAI","name":"命名工具目录","category":"目录","url":"https://perchanceai.com/explore?category=name_generator"},{"provider":"Perchance","name":"更多社区生成器","category":"目录","url":"https://perchance.org/generators"},{"provider":"FURAI","name":"Velorum 世界观","category":"互动","url":"https://furai.space/"},{"provider":"Perchance","name":"角色聊天扩展版","category":"聊天","url":"https://perchance.org/ai-character-chat-extended","categories":["聊天","角色"]},{"provider":"Perchance","name":"AI 现代聊天","category":"聊天","url":"https://perchance.org/ai-chat-modern"},{"provider":"Perchance","name":"AI 群组聊天","category":"聊天","url":"https://perchance.org/ai-group-chat","categories":["聊天","角色"]},{"provider":"Perchance","name":"角色扮演聊天 V2","category":"聊天","url":"https://perchance.org/ai-chat-roleplay-v2","categories":["聊天","角色"]},{"provider":"Perchance","name":"自由提问 AI","category":"聊天","url":"https://perchance.org/ask-ai"},{"provider":"Perchance","name":"人物性格与背景","category":"角色","url":"https://perchance.org/ai-character-description"},{"provider":"Perchance","name":"AI 人物照片","category":"作图","url":"https://perchance.org/ai-human-generator"},{"provider":"Perchance","name":"世界观生成","category":"写作","url":"https://perchance.org/ai-generated-hierarchical-world"},{"provider":"Perchance","name":"故事大纲","category":"写作","url":"https://perchance.org/ai-story-outline"},{"provider":"Perchance","name":"剧情情节生成","category":"写作","url":"https://perchance.org/ai-plot-generator"},{"provider":"Perchance","name":"文章改写","category":"写作","url":"https://perchance.org/ai-text-rewriter"},{"provider":"Perchance","name":"AI 文本生成","category":"写作","url":"https://perchance.org/ai-text-generator"},{"provider":"Perchance","name":"睡前故事","category":"写作","url":"https://perchance.org/ai-bedtime-story"},{"provider":"Perchance","name":"同人故事","category":"写作","url":"https://perchance.org/ai-fanfic-generator"},{"provider":"Perchance","name":"电影剧本","category":"写作","url":"https://perchance.org/ai-script-generator"},{"provider":"Perchance","name":"标题创作","category":"写作","url":"https://perchance.org/ai-title-generator"},{"provider":"Perchance","name":"诗歌创作","category":"写作","url":"https://perchance.org/ai-poem-generator"},{"provider":"Perchance","name":"歌词创作","category":"写作","url":"https://perchance.org/ai-lyrics-generator"},{"provider":"Perchance","name":"说唱歌词","category":"写作","url":"https://perchance.org/ai-rap-lyrics-generator"},{"provider":"Perchance","name":"AI 代码生成","category":"编程","url":"https://perchance.org/ai-code-generator"},{"provider":"Perchance","name":"AI 文字冒险","category":"互动","url":"https://perchance.org/ai-text-adventure"},{"provider":"Perchance","name":"高级 AI 绘图","category":"作图","url":"https://perchance.org/ai-art-generator-advanced"},{"provider":"Perchance","name":"多风格对比","category":"作图","url":"https://perchance.org/multiple-style-tester"},{"provider":"Perchance","name":"图片构图工具","category":"作图","url":"https://perchance.org/imageconstructor"},{"provider":"Perchance","name":"文本转音频","category":"音频","url":"https://perchance.org/ai-text-to-audio"},{"provider":"Perchance","name":"图片重绘","category":"修图","url":"https://perchance.org/urvillain-imagine"},{"provider":"Perchance","name":"兽人角色生成","category":"角色","url":"https://perchance.org/ai-furry-generator"},{"provider":"Perchance","name":"AI 互动问答","category":"互动","url":"https://perchance.org/question-this"},{"provider":"Perchance","name":"Story Forge 创作","category":"写作","url":"https://perchance.org/c0d3-story-forge"},{"provider":"Perchance","name":"最近更新工具","category":"目录","url":"https://perchance.org/recently-updated-generators-megalist"},{"provider":"Perchance","name":"Perchance 完整精选目录","category":"目录","url":"https://perchance.org/perlist"},{"provider":"Perchance AI","name":"智能更换背景","category":"修图","url":"https://perchanceai.com/t/background-changer"},{"provider":"Perchance AI","name":"车辆外观重设计","category":"修图","url":"https://perchanceai.com/t/car-redesigner"},{"provider":"Perchance AI","name":"AI 提示词生成","category":"写作","url":"https://perchanceai.com/t/prompt"},{"provider":"Perchance AI","name":"照片动漫化","category":"修图","url":"https://perchanceai.com/t/anime-me"},{"provider":"Perchance AI","name":"照片雪景效果","category":"修图","url":"https://perchanceai.com/t/snow-effect-photo-editor"},{"provider":"Perchance AI","name":"虚拟陪伴对话","category":"聊天","url":"https://perchanceai.com/c/virtual-mom","categories":["聊天","角色"]},{"provider":"Perchance AI","name":"Mean Girl 角色对话","category":"聊天","url":"https://perchanceai.com/c/mean-girl","categories":["聊天","角色"]},{"provider":"Perchance AI","name":"Kayla 角色对话","category":"聊天","url":"https://perchanceai.com/c/kayla","categories":["聊天","角色"]},{"provider":"Perchance AI","name":"Verity 角色对话","category":"聊天","url":"https://perchanceai.com/c/verity","categories":["聊天","角色"]},{"provider":"Perchance AI","name":"互动语言老师","category":"互动","url":"https://perchanceai.com/c/unhinged-language-teacher"},{"provider":"Perchance AI","name":"毛利文化 AI 聊天","category":"互动","url":"https://perchanceai.com/c/maori-culture-chat"},{"provider":"Perchance AI","name":"Nico 角色对话","category":"聊天","url":"https://perchanceai.com/c/nico","categories":["聊天","角色"]}];
const FREE_TOOL_CATEGORIES=["全部","收藏","最近使用","Perchance","P作图","P聊天","P修图","角色创建","P编程","P写作","聊天","免注册","免费API","翻译","搜索","编程","作图","修图","写作","办公","智能体","营销","API/开发","试用/付费","本地","综合","角色","互动","音频","识图","音乐","思维导图","目录"];
const FREE_ACCESS_LABELS={free:"基础免费",daily:"限额免费",trial:"试用/评估",community:"社区共享",paid:"付费/待核",local:"本地运行",api:"免费API额度"};

// Favorites are independent from recent activity, scoped to the signed-in account on this device.
const FAVORITE_LIMIT=40;
function favoriteScope(kind){return "aigzt:favorites:v1:"+kind+":"+String(S.user?.id||"guest")}
function normalizeFavorites(value){
 const out=[],seen=new Set();for(const item of Array.isArray(value)?value:[]){
  if(!item||typeof item.key!=="string"||!item.key||seen.has(item.key))continue;
  seen.add(item.key);out.push(item);if(out.length===FAVORITE_LIMIT)break;
 }return out;
}
const favoriteFlights=new Map(),favoriteAgain=new Set(),favoriteLastSync=new Map(),favoriteBackupTail=new Map();
function favoriteRecord(scope){
 try{
  const value=JSON.parse(localStorage.getItem(scope)||"null");
  if(value&&!Array.isArray(value))return {items:normalizeFavorites(value.items),seeded:value.seeded===true,ops:Array.isArray(value.ops)?value.ops.filter(x=>x&&typeof x.id==="string"&&typeof x.entry?.key==="string"&&typeof x.active==="boolean"):[]};
  const legacy=JSON.parse(localStorage.getItem(scope+":sync")||"null");
  return {items:normalizeFavorites(value),seeded:legacy?.seeded===true,ops:Array.isArray(legacy?.ops)?legacy.ops.filter(x=>x&&typeof x.id==="string"&&typeof x.entry?.key==="string"&&typeof x.active==="boolean"):[]};
 }catch{return {items:[],seeded:false,ops:[]}}
}
function readFavorites(kind){return favoriteRecord(favoriteScope(kind)).items}
function saveFavoriteRecord(scope,state){
 const raw=JSON.stringify(state);localStorage.setItem(scope,raw);
 if(typeof deviceMediaPut==="function"&&typeof Blob!=="undefined"){
  const previous=favoriteBackupTail.get(scope)||Promise.resolve();
  const next=previous.catch(()=>{}).then(()=>deviceMediaPut("favorites:"+scope,new Blob([raw],{type:"application/json"})));
  favoriteBackupTail.set(scope,next);void next.finally(()=>{if(favoriteBackupTail.get(scope)===next)favoriteBackupTail.delete(scope)}).catch(()=>{});
 }
}
function favoriteOp(entry,active){return {id:crypto.randomUUID(),entry,active}}
function prepareFavoriteRecord(record,owner){
 if(owner&&!record.seeded){
  const edited=new Set(record.ops.map(x=>x.entry.key));
  record.ops=[...record.items].reverse().filter(x=>!edited.has(x.key)).map(x=>favoriteOp(x,true)).concat(record.ops);
  record.seeded=true;
 }
 return record;
}
function overlayFavoriteOps(items,ops){
 let rows=normalizeFavorites(items);
 for(const op of ops)if(!op.active)rows=rows.filter(x=>x.key!==op.entry.key);
 for(const op of ops)if(op.active&&!rows.some(x=>x.key===op.entry.key)&&rows.length<FAVORITE_LIMIT)rows.unshift(op.entry);
 return rows;
}
function refreshFavoriteView(kind,scope){
 if(favoriteScope(kind)!==scope)return;
 if(kind==="models"&&$("modelDialog").open)renderModels();
 if(kind==="tools"&&S.freeToolsMode)renderFreeTools();
}
async function syncCatalogFavorites(kind,force=false){
 const owner=S.user?.id,scope=favoriteScope(kind);
 if(favoriteFlights.has(scope)){if(force)favoriteAgain.add(scope);return favoriteFlights.get(scope)}
 let synced=false;
 const flight=(async()=>{
  try{
   if(localStorage.getItem(scope)===null&&typeof deviceMediaGet==="function"){
    const backup=await deviceMediaGet("favorites:"+scope);
    if(backup&&localStorage.getItem(scope)===null&&favoriteScope(kind)===scope){localStorage.setItem(scope,await backup.text());refreshFavoriteView(kind,scope)}
   }
   if(!owner||S.user?.id!==owner||favoriteScope(kind)!==scope)return;
   const state=prepareFavoriteRecord(favoriteRecord(scope),owner);
   if(!force&&!state.ops.length&&Date.now()-(favoriteLastSync.get(scope)||0)<60000)return;
   saveFavoriteRecord(scope,state);
   const ops=state.ops.slice(0,80),result=await api("/api/catalog-favorites",{owner,kind,seed:null,ops},12000);
   if(S.user?.id!==owner||favoriteScope(kind)!==scope)return;
   const rejected=new Set(result.rejected||[]),completed=new Set(ops.filter(x=>!rejected.has(x.id)).map(x=>x.id)),latest=favoriteRecord(scope);
   latest.ops=latest.ops.filter(x=>!completed.has(x.id));
   latest.items=overlayFavoriteOps(result.items,latest.ops);latest.seeded=true;
   saveFavoriteRecord(scope,latest);favoriteLastSync.set(scope,Date.now());refreshFavoriteView(kind,scope);synced=true;
   if(rejected.size){flashError("另一设备的收藏已满，未同步项目已保留；取消收藏后可继续同步")}
   else if(latest.ops.length)favoriteAgain.add(scope);
  }catch{/* Preserve local data and pending operations when offline. */}
 })().finally(()=>{favoriteFlights.delete(scope);if(favoriteAgain.delete(scope)&&S.user?.id===owner&&favoriteScope(kind)===scope)void syncCatalogFavorites(kind,true)});
 favoriteFlights.set(scope,flight);return flight;
}
function toggleFavorite(kind,entry){
 const scope=favoriteScope(kind),record=favoriteRecord(scope),rows=record.items,exists=rows.some(x=>x.key===entry.key);
 if(!exists&&rows.length>=FAVORITE_LIMIT)return "full";
 try{
  prepareFavoriteRecord(record,S.user?.id);record.items=exists?rows.filter(x=>x.key!==entry.key):[entry,...rows];
  if(S.user?.id){record.ops=record.ops.filter(x=>x.entry.key!==entry.key);record.ops.push(favoriteOp(entry,!exists))}
  saveFavoriteRecord(scope,record);if(S.user?.id)void syncCatalogFavorites(kind,true);return exists?"removed":"added";
 }catch{return "storage"}
}
function modelFavoriteKey(m){return modelRoute(m)+"\0"+m.id}
function modelFavoriteEntry(m){
 const model={};for(const k of ["provider","id","name","type","free","freeTier","availableWith","shared","sharedModel","ownKey","requiresPersonalKey","inputImages","inputFiles","outputImages","inputPrice","outputPrice","author"])if(m[k]!==undefined)model[k]=m[k];
 return {key:modelFavoriteKey(m),model};
}
function syncFavoriteButton(button,active){
 button.classList.toggle("is-favorite",active);button.setAttribute("aria-pressed",String(active));
 button.title=active?"取消收藏":"收藏";button.setAttribute("aria-label",button.title);
}
function favoriteButton(kind,entry,onChange,active=readFavorites(kind).some(x=>x.key===entry.key)){
 const b=node("button","catalog-favorite");b.type="button";
 b.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9L12 3Z"/></svg>';
 syncFavoriteButton(b,active);
 b.onclick=e=>{e.preventDefault();e.stopPropagation();const result=toggleFavorite(kind,entry);
  if(result==="full"){window.alert("收藏已满（40个），请先取消一个收藏。");return}
  if(result==="storage"){window.alert("收藏未保存，请检查浏览器存储权限。");return}
  syncFavoriteButton(b,result==="added");onChange();
 };return b;
}
function wrapFreeToolCard(card,key,active){
 const tile=node("div","free-tool-tile");tile.dataset.freeToolKey=key;
 tile.append(card,favoriteButton("tools",{key},renderFreeTools,active));return tile;
}
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
 for(const b of list.children){const selected=b.dataset.category===S.freeToolsCategory;b.classList.toggle("active",selected);b.setAttribute("aria-pressed",String(selected));if(b.dataset.category==="收藏")b.textContent="收藏 "+readFavorites("tools").length+"/40"}
}
// Reuse decoded logos and permanent local category icons, including when a remote icon fails.
const freeToolCards=new Map();
const FREE_TOOL_ICON_REPAIRS={
 "krea-krea-2.hf.space":{domain:"krea.ai",glyph:"palette"},
 "multimodalart-glm-image.hf.space":{domain:"z.ai",glyph:"image"},
 "rioshiina-imagegen.hf.space":{domain:null,glyph:"camera"},
 "vexa-ai.pages.dev":{domain:null,glyph:"zap"},
 "lightricks-ltx-video-distilled.hf.space":{domain:"lightricks.com",glyph:"video"},
 "zerogpu-aoti-wan2-2-fp8da-aoti-faster.hf.space":{domain:"wan.video",glyph:"film"},
 "mcp-tools-wan-2-2-first-last-frame.hf.space":{domain:"wan.video",glyph:"clapperboard"}
};
function isPerchanceTool(item){
 try{return new URL(item.url).hostname==="perchance.org"||item.provider==="Perchance 社区"}catch{return false}
}
const PERCHANCE_CREATOR_PATHS=new Set(["/fur-ai","/ai-character-chat","/ai-character-chat-extended","/ai-character-generator","/ai-chat-roleplay-v2","/ai-character-description"]);
function freeToolGraphic(item){
 const graphic=node("span","free-tool-icon");graphic.setAttribute("aria-hidden","true");
 let hostname=null;try{hostname=item.url?new URL(item.url).hostname:null}catch{}
 const repair=FREE_TOOL_ICON_REPAIRS[hostname];
 const glyph=isPerchanceTool(item)?"dice":repair?.glyph||({聊天:"message-circle",综合:"blocks",作图:"image",图生图:"image",视频:"video",修图:"palette",角色:"circle-user",写作:"square-pen",互动:"zap",编程:"code-2",音频:"audio-lines",音乐:"audio-lines",识图:"scan",动图:"film",思维导图:"layers",翻译:"languages",办公:"file-text",搜索:"search",目录:"blocks"})[item.category]||"blocks";
 const fallback=node("span","free-tool-icon-fallback");
 fallback.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[glyph]||ICONS.blocks)+'</svg>';
 graphic.append(fallback);

 return graphic;
}
function renderFreeTools(){
 freeToolsFilters();
 const search=$("freeToolsSearch").value.trim().toLowerCase(),category=S.freeToolsCategory,seen=new Set(),list=$("freeToolsList");
 const desired=[],recent=category==="最近使用",favorites=category==="收藏",favoriteKeys=new Set(readFavorites("tools").map(x=>x.key)),recentRank=new Map(recent?freeToolRecentRead().map((key,index)=>[key,index]):[]);
 const hits=EXTERNAL_FREE_TOOLS.map(item=>MAINSTREAM_TOOL_META[item.url]?{...item,...MAINSTREAM_TOOL_META[item.url]}:item).filter(item=>{
  if(["视频","动图","贴纸","图生图"].includes(item.category))return false;
  const categories=Array.isArray(item.categories)?[...item.categories]:[item.category];
  if(isPerchanceTool(item)){
   categories.push("Perchance","骰子");
   if(categories.includes("作图"))categories.push("P作图");
   if(categories.includes("聊天"))categories.push("P聊天");
   if(item.category==="修图"||item.category==="图生图")categories.push("P修图");
   if(categories.includes("编程"))categories.push("P编程");
   if(categories.includes("写作"))categories.push("P写作");
   if(PERCHANCE_CREATOR_PATHS.has(new URL(item.url).pathname))categories.push("角色创建");
  }
  if(favorites?!favoriteKeys.has("site:"+item.url):recent?!recentRank.has("site:"+item.url):category==="免注册"?item.guest!==true:category==="试用/付费"?!["trial","paid"].includes(item.access):category!=="全部"&&!categories.includes(category))return false;
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
 const builtin=[{id:"ocr",name:"图片文字识别",category:"识图",categories:["识图","办公"],prompt:"提取图片中的全部文字，保留原文与顺序。",tool:"ocr"},{id:"search",name:"百科联网查询",category:"搜索",categories:["搜索"],prompt:"联网查询：",tool:"search"},{id:"translate",name:"多语种翻译",category:"翻译",categories:["翻译"],prompt:"翻译成中文：",tool:"translate"}];
 for(const item of builtin){const key="model:tool:"+item.id;if(favorites?!favoriteKeys.has(key):recent?!recentRank.has(key):category!=="全部"&&!item.categories.includes(category))continue;if(search&&![item.name,item.category,...item.categories].some(x=>x.toLowerCase().includes(search)))continue;if(freeToolCards.has(key)){desired.push(freeToolCards.get(key));nativeCount++;continue}const card=node("button","free-tool-card");card.type="button";card.dataset.freeToolKey=key;card.append(freeToolGraphic(item),node("strong","free-tool-name",item.name),node("small","free-tool-function","本站 · 自动模式可用"));card.onclick=()=>{if(S.busy)return;freeToolRemember(key);setFreeToolsMode(false);restoreChatInputMode();$("prompt").value=item.prompt;settlePromptSize();$("prompt").focus({preventScroll:true});if(item.tool==="ocr")showAttachMenu()};const tile=wrapFreeToolCard(card,key,favoriteKeys.has(key));freeToolCards.set(key,tile);desired.push(tile);nativeCount++}
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
  const tile=wrapFreeToolCard(a,key,favoriteKeys.has(key));freeToolCards.set(key,tile);desired.push(tile);
 }
 if(recent)desired.sort((a,b)=>recentRank.get(a.dataset.freeToolKey)-recentRank.get(b.dataset.freeToolKey));
 if(favorites){const rank=new Map([...favoriteKeys].map((key,i)=>[key,i]));desired.sort((a,b)=>rank.get(a.dataset.freeToolKey)-rank.get(b.dataset.freeToolKey))}
 for(const tile of desired)syncFavoriteButton(tile.querySelector(".catalog-favorite"),favoriteKeys.has(tile.dataset.freeToolKey));
 const keep=new Set(desired);
 for(const child of Array.from(list.children))if(!keep.has(child))child.remove();
 desired.forEach((card,i)=>{if(list.children[i]!==card)list.insertBefore(card,list.children[i]||null)});
 const empty=$("freeToolEmpty");empty.textContent=favorites&&!search?"暂无收藏":recent&&!search?"暂无最近使用的工具":"没有匹配的工具";empty.hidden=desired.length>0;
}
let restoringWorkspace=false;
function currentWorkspace(){return S.freeToolsMode?"tools":""}
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
  if(S.freeToolsMode)setFreeToolsMode(false);
 }
}
function syncTopMode(){}
function setFreeToolsMode(enabled){
 if(enabled){++chatOpenEpoch;chatOpenLoading=false;stopMessageReader()}
 S.freeToolsMode=!!enabled;$("shell").classList.toggle("free-tools-active",S.freeToolsMode);
 if(enabled){
  $("conversation").hidden=true;
  $("composerArea").hidden=true;
  $("navFreeTools").classList.add("active");renderFreeTools();$("freeToolsBoard").hidden=false;void freeToolRecentHydrate();void syncCatalogFavorites("tools");syncWorkspaceRoute("tools");
 }else{
  $("freeToolsBoard").hidden=true;$("composerArea").hidden=false;$("navFreeTools").classList.remove("active");
  $("conversation").hidden=false;syncWorkspaceRoute("");
 }
 closeMenu();syncHomeAmbient();syncTopMode();
}
function restoreWorkspaceRoute(){
 const next=location.hash==="#tools"?"tools":"";
 if(location.hash==="#work")history.replaceState({...history.state,aigztWorkspace:false},"",location.pathname+location.search);
 if(currentWorkspace()===next)return;
 restoringWorkspace=true;
 try{
  if(S.freeToolsMode&&next!=="tools")setFreeToolsMode(false);
  if(next==="tools")setFreeToolsMode(true);
 }finally{restoringWorkspace=false}
}

/* Streaming transport; only upstream emitted tokens are shown incrementally. */
async function apiChatStream(payload,onDelta){
 const controller=new AbortController();let reader=null;
 const extended=payload.replyLevel==="long"||payload.mode==="code"||/(?:提示词|image\s*prompts?)/i.test(payload.message||"")&&/(?:[2-9]|[1-9]\d|[二三四五六七八九十]+)\s*(?:套|组|个|条|sets?|prompts?)/i.test(payload.message||"");
 const deadline=setTimeout(()=>controller.abort(),extended?210000:90000);
 try{
  const resp=await fetch("/api/chat/stream",{method:"POST",headers:{"content-type":"application/json",accept:"text/event-stream"},credentials:"same-origin",cache:"no-store",body:JSON.stringify(payload),signal:controller.signal});
  if(!resp.ok){const data=await resp.json().catch(()=>null);throw Object.assign(Error(data?.error||"请求失败 HTTP "+resp.status),{code:data?.code||null})}
  if(!resp.body)throw Error("浏览器不支持流式传输");
  reader=resp.body.getReader();const decoder=new TextDecoder();let buffer="";
  for(;;){
   const {done,value}=await reader.read();if(done)break;
   buffer+=decoder.decode(value,{stream:true});if(buffer.length>8500000)throw Error("回复流格式异常");
   let end;while((end=buffer.indexOf("\n\n"))>=0){
    const packet=buffer.slice(0,end);buffer=buffer.slice(end+2);
    const data=packet.split("\n").find(line=>line.startsWith("data:"));if(!data)continue;
    let event;try{event=JSON.parse(data.slice(5).trim())}catch{continue}
    if(event.type==="delta"&&typeof event.text==="string")onDelta(event.text);
    else if(event.type==="error")throw Object.assign(Error(event.error||"回复中断"),{code:event.code||null,upstreamStatus:event.upstreamStatus||null,savedTurn:event.savedTurn||null});
    else if(event.type==="done"){
     if(!event.chatId||typeof event.reply!=="string")throw Error("回复中断，未收到完整结果");
     return event;
    }
   }
  }
  throw Error("回复中断，未收到完整结果");
 }catch(e){if(controller.signal.aborted)throw Object.assign(Error("回复等待超时，原消息已保留，请重试"),{code:"UPSTREAM_NETWORK"});throw e}
 finally{clearTimeout(deadline);if(reader)void reader.cancel().catch(()=>{})}
}
// One user click, one continuation request; retain the original row and draft.
async function continueTextReply(row,original,button){
 if(S.busy||chatOpenLoading||S.freeToolsMode||!S.chatId||!row.dataset.messageId)return;
 const chatId=S.chatId,provider=S.provider,model=S.model;
 if(provider!=="free"&&(!connected(provider)||(!isFreeModel(provider,model)&&!S.allowPaid))){openKeyPanel(provider);return}
 S.busy=true;button.disabled=true;$("sendBtn").disabled=true;
 const bubble=row.querySelector(".bubble"),status=node("span","message-send-pending","正在继续生成…");
 bubble.append(status);let tail="";
 try{
  const payload=row._continuationPayload||(row._continuationPayload={requestId:crypto.randomUUID(),chatId,provider,model,message:"请继续原任务，从中断处直接写，不重复已完成内容。",continueFrom:row.dataset.messageId,attachments:[],mode:S.code?"code":"general",chatMode:selectedChatMode,freeFallback:false,outputImages:false,imageOnly:false,replyLevel:"long",allowPaid:S.allowPaid});
  const result=await apiChatStream(payload,token=>{tail+=token});
  if(!row.isConnected||S.chatId!==chatId)return;
  if(result.assistantMessageId!==row.dataset.messageId)throw Error("续写消息编号不一致");
  delete row._continuationPayload;
  status.remove();delete row.dataset.usage;
  appendMessage("assistant",result.reply,result.usedModel||result.model||null,row,Boolean(result.incomplete),result.assistantMessageId,row.dataset.saved==="1",Number(row.dataset.feedback)||0,result.usage||null,result.createdAt);
  setPortraitState(row,"finished");void fetchChats();
 }catch(e){
  status.remove();
  if(row.isConnected&&S.chatId===chatId){
   let saved=null;
   try{const data=await api("/api/chats/"+chatId);saved=data.messages?.find(m=>m.id===row.dataset.messageId&&m.body!==original)}catch{}
   if(saved){delete row._continuationPayload;let incomplete=false;try{incomplete=!!JSON.parse(saved.usage_json||"null")?.incomplete}catch{}delete row.dataset.usage;appendMessage("assistant",saved.body,saved.model,row,incomplete,saved.id,!!saved.saved,saved.feedback,saved.usage_json,saved.created_at)}
   else {if(e?.code==="REQUEST_RETRYABLE")delete row._continuationPayload;flashError("续写未完成，原回复已保留");if(tail.trim()){const notice=node("div","message-send-pending","收到的续写未确认保存");notice.append(messageTool("copy","复制未保存内容",b=>copyMessageText(tail,b)));bubble.append(notice)}}
  }
 }finally{S.busy=false;button.disabled=false;$("sendBtn").disabled=false}
}
// Resolve each turn independently; the chosen chat model is never overwritten by media tools.
function resolveChatTurn({mode,provider,code,continueFrom,prompt,attachments}){
 if(code||continueFrom||attachments.length)return {mode:"text"};
 if(mode==="image")return {mode:"image"};
 if(isDirectVideoRequest(prompt))return {mode:"text"};
 if(isDirectImageRequest(prompt)||(provider==="free"&&automaticImagePrompt(prompt)))return {mode:"image"};
 return {mode:"text"};
}
async function sendMessage(continueFrom=null,forceFreeOnce=false,voiceTurn=null,retryContext=null,forceText=false){
 if(S.uploading){flashError("附件正在上传，请稍候再发送");return}
 
 if(S.busy||chatOpenLoading)return;
 if(!S.model&&!forceFreeOnce&&!retryContext?.payload)return;
 if(freeModeChoosing&&!forceFreeOnce&&!retryContext?.payload){openModels();return}
 const prompt=$("prompt").value.trim();if(!prompt&&S.attachments.length===0)return;
 const submittedCode=retryContext?.payload?retryContext.payload.mode==="code":S.code;
 const turn=retryContext?.payload?{mode:retryContext.payload.mode==="image"?"image":"text"}:forceText||voiceTurn!==null?{mode:"text"}:resolveChatTurn({mode:S.composerMode,provider:forceFreeOnce?"free":S.provider,code:submittedCode,continueFrom,prompt,attachments:S.attachments});
 const submittedMode=turn.mode;
 const requestId=retryContext?.requestId||crypto.randomUUID();
 let submittedPayload=null;
 ++chatOpenEpoch;
 if(!S.user){show("authDialog");return}
 if(submittedMode==="image"&&!prompt){flashError("请输入图片生成描述");return}
 // Request routing is independent of the selected model preference.
 let requestProvider=retryContext?.payload?.provider||S.provider,requestModel=retryContext?.payload?.model||S.model;
 const requestChatMode=retryContext?.payload?.chatMode||(forceFreeOnce?"auto":selectedChatMode);
 if(submittedMode==="text"&&S.provider!=="free"&&!forceFreeOnce&&!retryContext?.payload){
  if(requestChatMode==="free"&&!personalFreeChoice(S.provider,S.model))return;
  if(!S.connectionsLoaded&&!connected(S.provider)){
   const selectedProvider=S.provider,selectedModel=S.model,viewEpoch=chatOpenEpoch,owner=S.user?.id;
   if(!await fetchConnections()){flashError("个人模型连接暂未同步，可重试或切换自动模式");return}
   if(S.busy||chatOpenLoading||viewEpoch!==chatOpenEpoch||owner!==S.user?.id||S.provider!==selectedProvider||S.model!==selectedModel||$("prompt").value.trim()!==prompt)return;
  }
  const imageOutput=S.provider==="openrouter"&&S.remoteModels.some(m=>m.id===S.model&&m.outputImages);
  const incompatible=S.provider==="groq"&&S.attachments.some(x=>x.type?.startsWith("image/")||x.type==="application/pdf")&&
   (S.attachments.some(x=>x.type==="application/pdf")||!["qwen/qwen3.8-27b"].includes(S.model));
  if(!connected(S.provider)||(!isFreeModel(S.provider,S.model)&&!S.allowPaid)){openKeyPanel(S.provider);return}
  if(incompatible&&!imageOutput){flashError("当前个人模型不支持此附件，可选择自动模式识图");return}
 }
 if(submittedMode==="text"&&forceFreeOnce&&!retryContext?.payload){requestProvider="free";requestModel="free:auto"}
 hideWelcome();flashError("");
 const mediaOwner=S.user?.id;
 const requestChatId=retryContext&&"originalChatId" in retryContext?retryContext.originalChatId:S.chatId;
 const isNew=!S.chatId;
 const automaticTurn=forceFreeOnce||requestProvider==="free"&&requestModel==="free:auto";
 const isFreeMessage=submittedMode==="text"&&requestProvider==="free";
 const isImageMessage=submittedMode==="image";
 const attached=S.attachments.slice();
 const sentBody=prompt+(attached.length?"\n"+attached.map(a=>"[文件："+a.name+"]("+a.url+")").join("\n"):"");
 const sentRow=retryContext?.sentRow||appendMessage("user",sentBody);$("prompt").value="";S.attachments=[];renderAttachments();
 // Consume explicit tool choice once. Pending media owns its message, not the composer.
 if(submittedMode!=="text"||(submittedCode&&requestProvider==="free"))restoreChatInputMode();
 settlePromptSize();
 const loading=retryContext?.loading||appendMessage("assistant","");
 loading.dataset.automaticTurn=automaticTurn?"1":"0";
 if(isImageMessage){loading.dataset.messageKind="image";markImageMessage(loading,true)}
 if(retryContext){loading.querySelector(":scope > .message-copy-bar")?.remove();assistantTextState.delete(loading.querySelector(".bubble"));}
  setPortraitState(loading,isImageMessage?"creating":"thinking");
  let receivedStreamingText=false,streamedContent="";
 const loadingBubble=loading.querySelector(".bubble");const status=node("span","thinking-status");
 const nativeAnalysis=submittedMode==="text"&&attached.some(x=>x.type?.startsWith("image/")||x.type==="application/pdf");
 const waitLabel=node("span","",isImageMessage?"作图中 1秒":nativeAnalysis?"正在识别附件…":"正在思考");
 const dots=node("span","thinking-dots");
 for(let i=0;i<3;i++)dots.append(node("i"));
 dots.setAttribute("aria-hidden","true");status.append(dots,waitLabel);
 let imageStopRequested=false;
 if(isImageMessage)showChatImageWaiting(loadingBubble,waitLabel,()=>{imageStopRequested=true;showImageStopped(loadingBubble,"正在停止作图…")});
 else loadingBubble.replaceChildren(status);
 const textReading=submittedMode==="text"&&!(requestProvider==="openrouter"&&S.remoteModels.some(m=>m.id===requestModel&&m.outputImages));
 const releaseReadingSpace=textReading&&!retryContext?positionNewTextReply(loading,sentRow,$("conversation")):null;
 const startedAt=Date.now();
 const imageTimer=isImageMessage?window.setInterval(()=>{
  if(!loading.isConnected||imageStopRequested){window.clearInterval(imageTimer);return}
  waitLabel.textContent="正在创建您的图片 · "+Math.max(1,Math.floor((Date.now()-startedAt)/1000)+1)+"秒";
 },1000):null;
 S.busy=true;$("sendBtn").disabled=true;
 try{
  let result;
  if(submittedMode==="text"){
    let pending="",scheduled=false,active=true;
    const bubble=loadingBubble,viewport=$("conversation");
    const onDelta=token=>{
     if(!active||!loading.isConnected||S.user?.id!==mediaOwner)return;
     const first=!receivedStreamingText;
     if(first)setPortraitState(loading,"speaking");
      receivedStreamingText=true;
      streamedContent+=token;
     if(voiceTurn!==null)voiceStreamFeed(voiceTurn,streamedContent);
     if(first){updateAssistantText(bubble,streamedContent);return}
     pending+=token;if(scheduled)return;scheduled=true;
     window.setTimeout(()=>{
      scheduled=false;if(!active||!loading.isConnected)return;
      if(!pending)return;
      
      const nearBottom=loading.dataset.readFromStart!=="1"&&viewport.scrollHeight-viewport.scrollTop-viewport.clientHeight<140;
      updateAssistantText(bubble,streamedContent);pending="";
      if(nearBottom)viewport.scrollTop=viewport.scrollHeight;
     },60);
    };
    try{submittedPayload=retryContext?.payload?{...retryContext.payload,requestId}:{requestId,chatId:requestChatId,provider:requestProvider,model:requestModel,message:prompt,continueFrom:typeof continueFrom==="string"?continueFrom:undefined,attachments:attached.map(x=>x.id),
      mode:submittedCode?"code":"general",chatMode:requestChatMode,freeFallback:false,outputImages:requestProvider==="openrouter"&&S.remoteModels.some(m=>m.id===requestModel&&m.outputImages),imageOnly:requestProvider==="openrouter"&&S.remoteModels.some(m=>m.id===requestModel&&m.outputImages&&!m.outputText),replyLevel,creativeMode:S.creativeMode,projectId:S.activeProjectId,allowPaid:!forceFreeOnce&&requestProvider===S.provider&&S.allowPaid,apiKey:undefined};result=await apiChatStream(submittedPayload,onDelta);}
    finally{active=false;pending="";}
   }
  else if(isImageMessage){
    submittedPayload=retryContext?.payload?{...retryContext.payload,requestId}:{chatId:requestChatId,projectId:S.activeProjectId,mode:"image",requestId,prompt};result=await api("/api/chat/media",submittedPayload,25000);
   }
  if(isImageMessage&&imageStopRequested){
   if(S.user?.id===mediaOwner){
    if(loading.isConnected){S.chatId=result.chatId;if(result.userMessageId){sentRow.dataset.messageId=result.userMessageId;appendMessageCopy(sentRow,sentBody)}if(result.assistantMessageId)loading.dataset.messageId=result.assistantMessageId}
    if(result.jobId)await cancelChatImageJob(loadingBubble,result.jobId);
    void fetchChats();
   }
   return;
  }
  // A completed response never changes the user's selected model.
  if(loading.isConnected&&submittedMode==="text"&&!result.mediaMode&&!/^\[\[aigzt:video-job:/.test(result.reply||"")&&!receivedStreamingText&&!result.images?.length){setPortraitState(loading,"speaking");updateAssistantText(loadingBubble,result.reply,true)}
  if(loading.isConnected&&S.user?.id===mediaOwner){
   S.chatId=result.chatId;
   if(submittedMode==="text"){
    if(!result.incomplete&&(result.primarySucceeded===true||(!result.freeFallback&&result.primarySucceeded===undefined))){recordModelOutcome(requestProvider,requestProvider==="free"&&attached.some(x=>x.type?.startsWith("image/")||x.type==="application/pdf")?"free:auto":requestModel,true);unavailableChatModels.delete(chatModelKey(requestProvider,requestModel));if(S.user?.id&&["free","personal"].includes(requestChatMode))writeModelPref(chatModelStorageKey(S.user.id)+":success:"+requestChatMode,{provider:requestProvider,model:requestModel})}
    else if(result.primaryFailure)recordModelOutcome(requestProvider,requestModel,false,result.primaryFailure);
    if(result.freeFallback===true&&!result.incomplete)recordModelOutcome("free","free:auto",true);
   }
   // Keep the selected preference; the actual reply model is recorded below.
   if(result.userMessageId){sentRow.dataset.messageId=result.userMessageId;appendMessageCopy(sentRow,sentBody)}
   appendMessage("assistant",result.reply,result.usedModel||result.model||null,loading,Boolean(result.incomplete),result.assistantMessageId||null,false,0,result.usage||null,result.createdAt||Date.now(),result.images||[]);
     if(result.replayed&&!result.images?.length&&result.assistantMessageId)void restoreReplyImages(loading.querySelector(".bubble"),result.assistantMessageId);
     if(result.images?.length){void cacheReplyImages(mediaOwner,result.assistantMessageId,result.images).catch(()=>false).then(saved=>{if(!saved&&loading.isConnected&&S.user?.id===mediaOwner&&loading.dataset.messageId===result.assistantMessageId)mediaCacheWarning(loading.querySelector(".bubble"))})}
    if(submittedMode==="text")setPortraitState(loading,"finished");
  }
  if(VOICE_CHAT_ENABLED&&voiceTurn===voiceSession.turn&&submittedMode==="text"&&voiceSession.active&&voiceSession.pending){
   voiceSession.pending=false;voiceSession.lastReply=result.reply;$("voiceReply").textContent=result.reply;$("voiceReplay").disabled=false;voiceTranscript("assistant",result.reply);
   if(voiceStream?.turn===voiceTurn){if(voiceStream.failed){voiceReady();sayStatus("回答已保存，点击播放回答或继续说话")}else voiceStreamFeed(voiceTurn,result.reply,true)}
   else if(!voiceSpeak(result.reply,$("voiceReplay"),true)){voiceReady();sayStatus("本设备无法自动播报，可点击播放回答重试")}
  }
  void fetchChats();
  usageOverviewCache=null;
 }catch(e){
   if(S.user?.id!==mediaOwner||!loading.isConnected)return;
   if(isImageMessage&&imageStopRequested){showImageStopped(loadingBubble,"已停止等待，服务器状态未确认");return}
   if(e?.savedTurn?.chatId&&e.savedTurn.userMessageId){S.chatId=e.savedTurn.chatId;sentRow.dataset.messageId=e.savedTurn.userMessageId;appendMessageCopy(sentRow,sentBody);void fetchChats()}
   if(submittedMode==="text"&&["MODEL_RETIRED","MODEL_UNAVAILABLE","BILLING","BILLING_LIMIT","QUOTA","RATE_LIMIT","AUTH","ACCESS","UPSTREAM_NETWORK","UPSTREAM_EMPTY","FREE_FALLBACK_FAILED"].includes(e?.code))recordModelOutcome(requestProvider,requestModel,false,e.code);
   if(submittedMode==="text"&&requestProvider!=="free"&&["MODEL_RETIRED","MODEL_UNAVAILABLE"].includes(e?.code)){
    unavailableChatModels.set(chatModelKey(requestProvider,requestModel),{code:e.code,at:Date.now()});
    if(e.code==="MODEL_UNAVAILABLE")void refreshConnectedModelCatalog(requestProvider);
   }
   setPortraitState(loading,automaticTurn||submittedMode==="text"?"idle":"error");
   if(voiceTurn===voiceSession.turn&&voiceSession.active&&voiceSession.pending){voiceStreamReset();voiceCancel();voiceSession.pending=false;$("voiceReplay").disabled=!voiceSession.lastReply;voiceReady();sayStatus(automaticTurn?"已保留本轮对话，点击继续说话":"回复未完成，请再次点击开始说话")}
  // Never mutate a sent question or silently restart a paid request.
  // Show status in the assistant reply; retain all streamed content.
  const bubble=loadingBubble,status=node("div","message-send-pending chat-retry-status");
  status.setAttribute("role","status");
  if(streamedContent.trim()&&submittedMode==="text"){
   updateAssistantText(bubble,streamedContent,true);
   appendMessageCopy(loading,streamedContent);
  }else bubble.replaceChildren();
  const retry=messageTool("refresh-cw",automaticTurn?"继续":isImageMessage?"重新作图":"重试",()=>{
   if(S.busy||S.freeToolsMode||!sentRow.isConnected)return;
   const input=$("prompt");
   if((input.value.trim()||S.attachments.length)&&!confirm("重新发送会替换当前未发送的草稿和附件，继续吗？"))return;
   if(isImageMessage)setComposerMode("image");
   else{restoreChatInputMode();if(submittedCode){S.code=true;$("codeToggle").classList.add("active");$("codeToggle").setAttribute("aria-pressed","true");setComposerMode("text")}}
   input.value=prompt;S.attachments=attached.slice();renderAttachments();
   settlePromptSize();void sendMessage(continueFrom,forceFreeOnce||(requestProvider==="free"&&requestModel==="free:auto"),null,{sentRow,loading,requestId:e?.code==="REQUEST_RETRYABLE"?undefined:requestId,originalChatId:requestChatId,payload:submittedPayload});
  });
  retry.append(node("span","",["REQUEST_PENDING","REQUEST_UNCERTAIN"].includes(e?.code)?"继续查询":automaticTurn?"继续":"重试"));
  const transient=["REQUEST_PENDING","REQUEST_RETRYABLE","SAVED_RETRYABLE","UPSTREAM_NETWORK","UPSTREAM_EMPTY","UPSTREAM_ERROR","FREE_FALLBACK_FAILED","RATE_LIMIT","CAPACITY"].includes(e?.code);
  const detail=e?.code==="REQUEST_UNCERTAIN"?"原请求结果未确认，请核对聊天记录":e?.code==="REQUEST_PENDING"?"原请求尚未确认，点击继续查询":automaticTurn?(nativeAnalysis||attached.length?"原图及消息已保留":"消息已保留"):transient?"消息已保留":humanError(e);
  if(isImageMessage){status.append(node("span","",detail),retry);setPortraitState(loading,"idle")}else status.append(node("span","",streamedContent.trim()?(automaticTurn?"已保留当前内容":"回复中断，已保留收到的内容"):detail),retry);
  if(submittedMode==="text"&&requestProvider!=="free"&&e?.code==="REQUEST_RETRYABLE"){
    const alternate=messageTool("layers","手动使用免费自动重试",()=>{
    if(S.busy||S.freeToolsMode||!sentRow.isConnected)return;
    if(($("prompt").value.trim()||S.attachments.length)&&!confirm("重试会替换未发送的草稿及附件，继续吗？"))return;
    if(S.composerMode!=="text")setComposerMode("text");
    $("prompt").value=prompt;S.attachments=attached.slice();renderAttachments();settlePromptSize();
    void sendMessage(continueFrom,true,null,{sentRow,loading});
   });
   status.append(alternate);
  }
  bubble.append(status);if(!automaticTurn&&submittedMode!=="text"&&!isImageMessage)status.title=humanError(e);flashError("");
 }
 finally{S.busy=false;$("sendBtn").disabled=false;if(imageTimer!==null)window.clearInterval(imageTimer);releaseReadingSpace?.();if(voiceSession.active&&voiceSession.resumePending)voiceAutoNext()}
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
 const entries=Object.entries(modelHistoryRecords);const successes=entries.filter(([,v])=>v.success).sort((a,b)=>b[1].success-a[1].success).slice(0,40);const failures=entries.filter(([,v])=>!v.success).sort((a,b)=>(b[1].failure||0)-(a[1].failure||0)).slice(0,120);const rows=[...successes,...failures];
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
 ensureModelHistory();const owner=modelHistoryOwner;if(!owner||modelHistoryLoaded)return;if(modelHistoryPending)return modelHistoryPending.catch(()=>null);
 const pending=api("/api/model-history");modelHistoryPending=pending;
 try{const data=await pending;if(modelHistoryOwner!==owner||String(S.user?.id||"")!==owner)return;
  for(const r of data.models||[])if(typeof r.provider==="string"&&typeof r.model==="string"&&Number.isFinite(r.at))recordModelOutcome(r.provider,r.model,true,"",r.at,r.legacy!==false);
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
const PUBLIC_MODEL_CACHE="aigzt:public-model-catalog:v2";
let catalogError="",catalogCacheLoaded=false;
function validCatalogRows(rows){return Array.isArray(rows)?rows.filter(m=>m&&typeof m.id==="string"&&m.id.length>0&&typeof m.provider==="string"&&typeof m.type==="string"):[]}
function applyPublicCatalog(d){
 const routes=validCatalogRows(d.freeModels);if(routes.length)S.freeModels=routes.map(m=>({...m,provider:"free"}));
 const tier=validCatalogRows(d.freeTierModels).filter(m=>m.freeTier===true&&m.requiresPersonalKey===true&&["groq","gemini"].includes(m.provider)&&m.type==="text");if(tier.length)S.freeTierModels=tier;
 const rows=validCatalogRows(d.models);
 if(!d.catalogError&&rows.length){
  S.remoteModels=rows.map(m=>({...m,author:m.provider,provider:"openrouter"}));
  S.sharedFreeModels=validCatalogRows(d.sharedFreeModels).filter(m=>m.shared===true&&m.free===true&&m.provider==="free"&&m.id.startsWith("free:or/"));
  S.loadedCatalog=true;return true;
 }
 return false;
}
function restorePublicCatalog(){
 if(catalogCacheLoaded)return;catalogCacheLoaded=true;
 try{const cache=JSON.parse(localStorage.getItem(PUBLIC_MODEL_CACHE)||"null");if(cache?.at&&Date.now()-cache.at<7*86400000&&applyPublicCatalog(cache.data||{}))catalogError="正在更新上次目录"}catch{}
}
function storePublicCatalog(d){
 try{localStorage.setItem(PUBLIC_MODEL_CACHE,JSON.stringify({at:Date.now(),data:{freeModels:d.freeModels,freeTierModels:d.freeTierModels,sharedFreeModels:d.sharedFreeModels,models:d.models}}))}catch{}
}
async function loadCatalog(force=false){
 restorePublicCatalog();
 if(catalogRefreshPromise)return catalogRefreshPromise;
 if(!force&&S.loadedCatalog&&!catalogError&&Date.now()-catalogRefreshAt<15*60000)return;
 catalogRefreshAt=Date.now();
 catalogRefreshPromise=(async()=>{
  try{
   const d=await api("/api/models",undefined,25000);
   if(applyPublicCatalog(d)){catalogError="";storePublicCatalog(d)}
   else catalogError=d.catalogError||"模型目录暂未返回完整数据";
  }catch(e){catalogError=humanError(e)}
  finally{catalogRefreshPromise=null;if($("modelDialog").open)renderModels()}
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
 for(const m of [...S.freeModels,...shared,...remote,...S.freeTierModels])if(!index.has(key(m)))index.set(key(m),m);
 for(const [provider,items] of Object.entries(S.connected)){
  for(const x of items){
   if(!x.id)continue;const k=provider+"\0"+x.id,old=index.get(k);
   if(old?.freeTier){index.set(k,{...old,...x,id:x.id,name:x.name||old.name,provider,type:x.type||old.type,free:false,freeTier:true,ownKey:true,requiresPersonalKey:true,availableWith:undefined});continue}
   if(!old)index.set(k,{...x,id:x.id,name:x.name||x.id,provider,type:x.type||"text",free:!!x.free,ownKey:true,availableWith:undefined});
  }
 }
 return [...index.values()].filter(m=>m.type!=="video"&&!retiredVideoModel(m.provider,m.id));
}
function hasFreeAccess(m){return m.free===true||m.freeTier===true}
function modelMatches(m,favoriteRank=null){
 if(m.type==="video"||retiredVideoModel(m.provider,m.id))return false;
 const route=modelRoute(m);
 if(composerCatalogMode==="auto"&&route!=="free")return false;
 if(composerCatalogMode==="free"&&(!connected(route)||!personalFreeChoice(route,m.id)))return false;
 if(composerCatalogMode==="personal"&&(route==="free"||!connected(route)))return false;
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
 }else if(S.source==="favorites"){if(!(favoriteRank?favoriteRank.has(modelFavoriteKey(m)):readFavorites("models").some(x=>x.key===modelFavoriteKey(m))))return false}
 else if(S.source==="recent"){if(!modelHealth(modelRoute(m),m.id).last)return false}
 else if(S.source==="connected"){if(!connected(modelRoute(m)))return false}
 else if(S.source.startsWith("route:")){if(providerRoute(modelRoute(m))!==S.source.slice(6))return false}
 else if(S.source==="free"){if(!hasFreeAccess(m))return false}
 else if(S.source!=="all"&&modelRoute(m)!==S.source)return false;
 if(S.filter==="free"&&!hasFreeAccess(m))return false;
 if(S.filter==="text"&&m.type!=="text")return false;
 if(S.filter==="image"&&m.type!=="image"&&!m.outputImages)return false;
 
 if(S.filter==="code"&&!/cod(e|er|ing)|deepseek|qwen|gpt|claude|gemini|glm|devstral|starcoder/i.test(t))return false;
 return true;
}
function modelIsSelected(m){
 const via=m.availableWith==="openrouter-key"?"openrouter":m.provider;
 if(m.type==="video")return false;
 return !freeModeChoosing&&S.composerMode==="text"&&(m.type==="text"||m.outputImages)&&S.provider===via&&S.model===m.id;
}
function renderModels(){
 refreshChatModeUI();
 const models=allModels();ensureModelHistory();
 const savedFavorites=readFavorites("models"),favoriteRank=new Map(savedFavorites.map((x,i)=>[x.key,i]));
 const favoriteChip=$("sourceChips").querySelector('[data-source="favorites"]');if(favoriteChip)favoriteChip.textContent="收藏 "+savedFavorites.length+"/40";
 if(S.source==="favorites"){const known=new Set(models.map(modelFavoriteKey));for(const entry of savedFavorites){if(!known.has(entry.key)&&entry.model?.id&&entry.model?.provider&&!retiredVideoModel(entry.model.provider,entry.model.id)){models.push({...entry.model,unlisted:true,favoriteMissing:true});known.add(entry.key)}}}
 const history=Object.entries(modelHistoryRecords).filter(([,v])=>v.success).sort((a,b)=>b[1].success-a[1].success).slice(0,40);
 const recentChip=$("sourceChips").querySelector('[data-source="recent"]');if(recentChip)recentChip.textContent="常用成功"+(history.length?" "+history.length:"");
 if(S.source==="recent"){const known=new Set(models.map(m=>modelHistoryKey(modelRoute(m),m.id)));for(const [key] of history){const [provider,id]=key.split("\0");if(!provider||!id||known.has(key)||retiredVideoModel(provider,id))continue;models.push({id,name:id,provider,type:"text",free:provider==="free",unlisted:true});known.add(key)}}
 renderChinaBrands(models);
 let visible=models.filter(m=>modelMatches(m,favoriteRank)&&(!freeModeChoosing||m.id!=="free:auto"));
 if(S.source==="favorites"){const seen=new Set();visible=visible.filter(m=>{const k=modelFavoriteKey(m);if(seen.has(k))return false;seen.add(k);return true})}
 if(S.provider&&S.model&&S.provider!=="free"&&!visible.some(modelIsSelected)){
  const active={id:S.model,name:S.modelTitle||S.model,provider:S.provider,type:"text",free:isFreeModel(S.provider,S.model),unlisted:true};
  if(modelMatches(active,favoriteRank)&&!visible.some(m=>modelFavoriteKey(m)===modelFavoriteKey(active)))visible.unshift(active);
 }
 // The current selection always leads matching results, followed by successful routes and capability.
 const ranks=new Map(visible.map(m=>[m,modelOrdering(m)]));
 visible.sort((a,b)=>{if(S.source==="favorites")return favoriteRank.get(modelFavoriteKey(a))-favoriteRank.get(modelFavoriteKey(b));const x=ranks.get(a),y=ranks.get(b);return Number(hasFreeAccess(b))-Number(hasFreeAccess(a))||(S.source==="recent"?y.health.last-x.health.last:0)||Number(modelIsSelected(b))-Number(modelIsSelected(a))||x.group-y.group||y.tier.score-x.tier.score||y.health.last-x.health.last||Number(hasFreeAccess(b))-Number(hasFreeAccess(a))||Number(providerRoute(modelRoute(b))==="official")-Number(providerRoute(modelRoute(a))==="official")||a.id.localeCompare(b.id)});
 const count=visible.length,shown=visible.slice(0,(S.modelPage+1)*60);
 const sharedCount=visible.filter(m=>m.free===true&&(m.provider==="free"||m.builtinVideo)).length,personalFree=visible.filter(m=>m.freeTier===true||(m.free===true&&m.provider!=="free"&&!m.builtinVideo)).length;
 $("modelCount").textContent=count+" 个条目"+(S.source==="favorites"?" · 已收藏 "+savedFavorites.length+"/40":S.source==="recent"?" · 最近成功使用":S.source==="free"||S.filter==="free"?" · 直接免费 "+sharedCount+" · 个人额度 "+personalFree:" · 免费优先 · 成功优先");
 const retry=$("modelCatalogRetry");retry.hidden=!catalogError;retry.title=catalogError;retry.textContent=S.loadedCatalog?"更新目录":"重试目录";
 $("moreModels").hidden=count<=shown.length;
 const list=$("modelList"),viewKey=[S.source,S.filter,S.query].join("|");
 const signature=viewKey+"|"+JSON.stringify(savedFavorites.map(x=>x.key))+"|"+chatModeLabel()+":"+freeModeChoosing+"|"+S.composerMode+"|"+S.provider+":"+S.model+"|"+shown.map(m=>m.provider+":"+m.id+":"+m.name+":"+m.type+":"+m.free+":"+Boolean(m.freeTier)+":"+Boolean(S.savedProviders[m.availableWith==="openrouter-key"?"openrouter":m.provider]?.verified)+":"+(unavailableChatModel(m.availableWith==="openrouter-key"?"openrouter":m.provider,m.id)?.code||"")+":"+Boolean(m.unlisted)+":"+Boolean(m.favoriteMissing)+":"+ranks.get(m).group+":"+ranks.get(m).health.last+":"+ranks.get(m).tier.score).join("|");
 if(shown.length&&list.dataset.renderSignature===signature&&list.querySelectorAll(".model-row").length===shown.length)return;
 const dialog=$("modelScroll"),previousTop=list.dataset.viewKey===viewKey?dialog.scrollTop:0;
 list.replaceChildren();list.dataset.renderSignature=signature;list.dataset.viewKey=viewKey;
 if(!shown.length){list.append(node("p","hint",S.source==="favorites"?"暂无符合当前筛选的收藏模型":S.source==="recent"?"暂无成功记录，切换全部模型即可选择":!$("modelRegionLinks").hidden?"暂无符合当前筛选的已列出模型，可在上方连接对应服务商获取真实目录":catalogError?"目录暂未加载成功，请重试目录":S.loadedCatalog?"暂无符合条件的模型，请切换筛选":"模型目录加载中；免费自动仍可使用"));dialog.scrollTop=previousTop;return}
 for(const item of shown){
  const via=item.availableWith==="openrouter-key"?"openrouter":item.provider,selected=modelIsSelected(item);
  const row=node("div","model-row"+(selected?" selected":"")),info=node("div","model-info"),title=node("strong","",item.name||item.id);
  if(selected){row.setAttribute("aria-current","true");row.setAttribute("aria-label","当前聊天模型："+(item.name||item.id))}
  const saved=S.savedProviders[via],verified=!!saved?.verified,blocked=unavailableChatModel(via,item.id),rank=ranks.get(item);
  const tag=node("span","price-tag"+(item.free?" free":""),blocked?(blocked.code==="MODEL_RETIRED"?"已停用":"当前不可用"):item.unlisted?"目录未列出":selected?"✓ 当前使用":item.builtinVideo?(item.free?"共享免费额度":"个人 API · 可能收费"):via==="free"?(item.shared?"共享免费 · 无需绑定":"免费线路"):verified?"密钥已验证":saved?"待验证":item.free?"免费 · 需连接":"需连接");
  const priceLabel=item.freeTier?"个人免费额度 · 付费账号可能收费":item.free===true?"限额免费":via==="openrouter"&&item.inputPrice!=null&&item.outputPrice!=null?"付费":"按账号额度 / 可能收费";
  title.prepend(providerLogo(via));title.append(node("span","provider-route-label "+providerRoute(via),providerRouteLabel(via)),node("span","price-tag"+(item.free?" free":""),priceLabel));
  if(rank.health.recentFailure)title.append(node("span","price-tag","近期异常"));
  else if(rank.health.last)title.append(node("span","price-tag free",rank.health.legacy?"历史成功匹配":"已成功使用"));
  if(rank.tier.label)title.append(node("span","price-tag",rank.tier.label));title.append(tag);
  const owner=domesticGroupFor(item);
  info.append(title,node("small","",via==="free"?(item.shared?"本站共享零价文字模型 · 无需个人密钥 · ID："+item.sharedModel:"免费自动路由 · 实际上游模型可能变化"):(owner?"中国模型 · "+owner.name+" · ":"")+"接入："+providerLabel(via)+" · ID："+item.id+(item.freeTier?" · 需要本人免费计划/API Key，额度及计费由服务商决定":"")+(item.inputImages?" · 支持图片分析":"")+(item.inputFiles?" · 支持PDF":"")+(item.outputImages?" · 支持图片输出":"")));
  const actionable=["text","image"].includes(item.type);
  const button=node("button","model-action",blocked?"不可用":!actionable?"暂不支持":selected?"✓ 已选定":item.type!=="text"?"使用":via==="free"||verified?"选择":"连接");
  button.disabled=!!blocked||!actionable||selected||!!item.favoriteMissing&&!connected(via);
   if(item.favoriteMissing&&!connected(via))button.textContent="待目录确认";
  if(actionable&&!blocked&&(!item.favoriteMissing||connected(via)))button.addEventListener("click",()=>setModel(item));
  row.append(info,favoriteButton("models",modelFavoriteEntry(item),renderModels,favoriteRank.has(modelFavoriteKey(item))),button);list.append(row);
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
  if(VIDEO_ONLY_PROVIDERS.has(p))continue;
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
 openModels(true);activateSource(S.source);
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
function openModels(preserveFilter=false,modeScope=null){
 composerCatalogMode=modeScope;
 restorePublicCatalog();
 if(!preserveFilter){S.source="all";S.filter="all";S.query=""}
 $("modelSearch").value=S.query;$("modelFilter").value=S.filter;
 for(const el of els("#sourceChips .chip"))el.classList.toggle("active",el.dataset.source===S.source);
 S.modelPage=0;$("chatModeMenu").open=false;show("modelDialog");void loadCatalog();renderModels();void syncCatalogFavorites("models");$("modelScroll").scrollTop=0;$("sourceChips").scrollLeft=0;void loadModelHistory();
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
 const scope=img.closest(".draw-gallery,.messages,.media-preview,.result-list,#savedFiles")||img.closest("dialog,.main")||document.body;
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
 b.addEventListener("click",()=>{if(S.drawBatch)return;void retryDrawTile(tile)});tile.tile.append(b);
}
async function drawTrackJob(id,tile,batch){
 const deadline=Date.now()+720000;
 for(let tries=0;tries<150&&!batch.cancelled&&Date.now()<deadline;tries++){
  let waitMs=12000;
  try{
   const r=await api("/api/image/task/"+encodeURIComponent(id),undefined,55000);
   if(batch.cancelled)return false;
   if(r.done){
    if(r.failed){tile.jobId=null;tile.submitPayload=null;showDrawRetry(tile,r.error||"免费来源暂未返回图片");return false}
    if(typeof r.image==="string")return await drawResult(tile,r.image);
    showDrawRetry(tile,"作图服务未返回图片");return false;
   }
   tile.caption.textContent="正在生成";
   waitMs=Math.max(1000,Math.min(14000,Number(r.waitSeconds||12)*1000));
  }catch(e){
   if(e?.code==="IMAGE_TASK_NOT_FOUND"){tile.jobId=null;tile.submitPayload=null;showDrawRetry(tile,"原任务已不存在");return false}
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
async function retryDrawTile(tile){
 if(S.drawBatch||!S.user||!tile.tile.isConnected)return;
 const batch={cancelled:false,controller:new AbortController(),startedAt:Date.now(),clockTimer:null};S.drawBatch=batch;
 $("createButton").disabled=true;$("drawCancel").hidden=false;tile.tile.querySelector(".draw-retry")?.remove();tile.picture.replaceChildren(createImageWaitingFrame());
 try{
  if(!tile.jobId){const payload=tile.submitPayload||(tile.submitPayload={requestId:crypto.randomUUID(),prompt:tile.sourcePrompt,style:tile.sourceStyle,shape:tile.sourceShape});const r=await api("/api/image",payload,18000);if(typeof r.jobId!=="string")throw Error("没有返回图片任务编号");tile.jobId=r.jobId}
  if(!batch.cancelled)await drawTrackJob(tile.jobId,tile,batch);
 }catch(e){if(e?.code==="REQUEST_RETRYABLE")tile.submitPayload=null;if(!batch.cancelled)showDrawRetry(tile,humanError(e))}
 finally{if(S.drawBatch===batch){S.drawBatch=null;$("createButton").disabled=false;$("drawCancel").hidden=true}}
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
  tile.startedAt=Date.now();tile.sourcePrompt=prompt;tile.sourceStyle=style;tile.sourceShape=shape;tile.clock.hidden=false;tile.caption.textContent="正在提交";
  try{
   tile.submitPayload={prompt,style,shape,requestId:crypto.randomUUID()};const result=await api("/api/image",tile.submitPayload,18000);
   if(batch.cancelled)return;
   if(typeof result.jobId!=="string")throw Error("没有返回图片任务编号");tile.jobId=result.jobId;
   tile.caption.textContent="正在生成图片";
   const ok=await drawTrackJob(result.jobId,tile,batch);
   if(batch.cancelled)return;
   if(ok)success++;else failed++;
  }catch(error){
   if(batch.cancelled)return;
   if(error?.code==="REQUEST_RETRYABLE")tile.submitPayload=null;failed++;showDrawRetry(tile,humanError(error));
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
 $("createDialogTitle").textContent="作图模式";
 $("drawSettings").hidden=false;$("drawResultSection").hidden=false;
 $("drawCancel").hidden=!S.drawBatch;$("drawElapsed").hidden=!S.drawBatch&&$("drawElapsed").textContent==="00:00";
 $("createButton").textContent="生成免费图片";$("createPrompt").placeholder="描述你要生成的图片…";
}
function openCreate(){
 if(!S.user){show("authDialog");return}
 setCreationMode("image");show("createDialog");closeMenu();
 if(!$("drawResults").children.length&&!S.drawBatch){const owner=S.user.id;void (async()=>{let record;try{record=JSON.parse(localStorage.getItem(deviceMediaKey("draw-latest"))||"null")}catch{};if(!record||![1,2,4].includes(record.count))return;for(let i=0;i<record.count;i++){const blob=await deviceMediaGet(owner+":draw:"+record.id+":"+i);if(!blob||S.user?.id!==owner||S.drawBatch||S.createMode!=="image")continue;const tile=drawTile(i+1,"本机图片",record.shape);await drawResult(tile,URL.createObjectURL(blob))}})().catch(()=>{})}
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
  ++accountFetchEpoch;S.user=d.user;restoredChatModelOwner=null;activateModelPrefOwner(String(d.user.id));restoreChatModelSelection();chatModelPreferenceReady=true;setAuthUI();hide("authDialog");form.reset();newChat();void loadModelHistory();
  await Promise.all([fetchMe(),fetchProjects(),fetchChats(),fetchConnections()]);
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
 try{await api("/api/logout",{});stopDrawBatch();$("drawResults").replaceChildren();$("drawPrevious").replaceChildren();$("drawPreviousSection").hidden=true;$("drawElapsed").hidden=true;$("drawElapsed").textContent="00:00";$("createStatus").textContent="";uploadedFilesOwner=null;uploadedFilesSignature="";++uploadedFilesRequest;$("savedFiles").replaceChildren();++accountFetchEpoch;connectionsFlight=null;S.user=null;S.quota=null;S.chats=[];S.chatId=null;S.keys={};S.connected={};S.savedProviders={};S.connectionsLoaded=false;S.connectionsLoading=false;S.freeToolsMode=false;S.freeToolsCategory="全部";restoredChatModelOwner=null;activateModelPrefOwner(null);setFreeDefault(false);S.projects=[];S.activeProjectId=null;S.notes=[];newChat();setAuthUI();renderHistory();renderProjects()}
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
  const rawModel=$("manualModel").value.trim();
  const folderId=p==="yandex"?(rawModel.match(/^gpt:\/\/([^/]+)\//)?.[1]||rawModel):"";
  if(p==="yandex"&&!/^b1g[a-z0-9]{8,61}$/i.test(folderId))throw Error("请填写 Yandex 文件夹 Folder ID（b1g 开头），不要填写服务账号 ID");
  const manualModel=p==="yandex"?"":rawModel;
  const selectedModel=S.provider===p&&!VIDEO_ONLY_PROVIDERS.has(p)?S.model:"";
  const data=await api("/api/connections",{provider:p,apiKey:key,model:manualModel||(p==="yandex"?undefined:selectedModel)||undefined,...(p==="yandex"?{folderId}:{}),consent:$("allowPaid").checked});
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
  if(rec.model&&!retiredVideoModel(p,rec.model)){
   S.provider=p;S.model=rec.model;
   S.modelTitle=p+" · "+(S.connected[p].find(m=>m.id===rec.model)?.name||rec.model);
   S.selectedFree=isFreeModel(p,rec.model);
   rememberChatModelSelection();
  }
  if(!VIDEO_ONLY_PROVIDERS.has(p))S.allowPaid=!!rec.consent;
  updateModelTitle();refreshSourceChips();
  refreshKeyPanel();$("keyStatus").textContent=rec.verified?"":(data.warning||"待验证");
  
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
 const valid=()=>!viewport.hidden&&!viewport.classList.contains("empty-chat")&&!S.freeToolsMode&&!$("shell").classList.contains("menu-open")&&viewport.scrollHeight-viewport.clientHeight>16;
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
 $("navFreeTools").addEventListener("click",()=>enterWorkspace("tools"));
 $("navDraw").addEventListener("click",openCreate);
 $("freeToolsClose").addEventListener("click",returnWorkspace);
 $("freeToolsSearch").addEventListener("input",renderFreeTools);
 $("navCode").addEventListener("click",startCoding);
 
 $("domesticProviderList");initDomesticProviderLinks();

 $("groqQuick").addEventListener("click",()=>{hide("modelDialog");openKeyPanel("groq","modelDialog")});
 $("imageQuick").addEventListener("click",()=>{hide("modelDialog");setComposerMode("image");$("toolTray").hidden=true;$("prompt").focus()});
 $("navFiles").addEventListener("click",()=>void openFiles());
 $("navKeys").addEventListener("click",()=>{closeMenu();openKeyPanel()});
 $("groqConnect").addEventListener("click",()=>void openSettings(true));
 $("newChat").addEventListener("click",newChat);
 $("headerNew").addEventListener("click",newChat);
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
 $("settingsUsage").addEventListener("toggle",()=>{if($("settingsUsage").open)void loadUsageOverview()});
 $("settingsUsageRefresh").addEventListener("click",()=>void loadUsageOverview(true));
 $("settingsUsageExplain").addEventListener("click",()=>{const panel=$("settingsUsageExplanation"),button=$("settingsUsageExplain");panel.hidden=!panel.hidden;button.setAttribute("aria-expanded",String(!panel.hidden))});
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
 $("videoProjectForm").addEventListener("submit",e=>void startVideoProject(e));
 $("filmPlanForm").addEventListener("submit",directFilmVideo);
 $("filmQuickDuration").addEventListener("change",()=>{$("filmCustomDurationWrap").hidden=$("filmQuickDuration").value!=="custom"});
 $("filmSequenceResume").addEventListener("click",()=>void runFilmSequence());
 $("filmSequenceStop").addEventListener("click",()=>void stopFilmSequence());
 $("videoProjectPlan").addEventListener("click",e=>void startVideoProjectPlan(e));
 $("filmBackToPlan").addEventListener("click",()=>selectFilmStage("script"));
 $("filmPlanStop").addEventListener("click",()=>void stopFilmPlan());
 $("filmSettingsOpen").addEventListener("click",openFilmSettings);
 $("filmHistoryOpen").addEventListener("click",()=>void openFilmHistory());
 $("filmSettingsForm").addEventListener("submit",e=>void saveFilmPreferences(e));
 $("filmSkillSave").addEventListener("click",()=>void saveFilmSkill());
 $("filmProvider").addEventListener("change",updateFilmPersonalFields);
 $("filmRemoveKey").addEventListener("click",()=>void clearFilmKey());
 $("filmQuotaRefresh").addEventListener("click",()=>void loadFilmQuota());
 $("filmSave").addEventListener("click",()=>void saveFilmDraft());
 $("filmCopy").addEventListener("click",()=>void navigator.clipboard.writeText($("filmPlanResult").value).then(()=>filmPlanUI("已复制",filmPlanBusy)).catch(()=>filmPlanUI("无法复制，请长按选取文字",filmPlanBusy)));
 $("filmDownload").addEventListener("click",()=>{const blob=new Blob([$("filmPlanResult").value],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=node("a");a.href=url;a.download="电影创作.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
 $("videoProjectStop").addEventListener("click",()=>void stopVideoProject());
 $("filmProjectOpen").addEventListener("click",openVideoProject);
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
 
 $("attachButton").addEventListener("click",()=>{if($("attachMenu").hidden){showAttachMenu()}else hideAttachMenu()});
 // Native <label for=file-input> activation is a real iPhone user gesture.
 for(const id of ["cameraAction","photosAction","filesAction"]){
  // Leave native label's default activation untouched until the OS picker opens.
  $(id).addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();$(id).click()}});
 }
 $("toolsAction").addEventListener("click",()=>{const tray=$("toolTray");tray.hidden=!tray.hidden;$("toolsAction").setAttribute("aria-expanded",String(!tray.hidden))});
 for(const id of ["attachmentInput","cameraInput","photosInput"]){$(id).addEventListener("change",e=>{hideAttachMenu();void uploadSelected(Array.from(e.target.files||[]));e.target.value=""})}
 $("publicSearchMode").addEventListener("click",()=>{if(S.busy)return;restoreChatInputMode();const input=$("prompt");if(!input.value.startsWith("联网查询："))input.value="联网查询："+input.value;settlePromptSize();input.focus({preventScroll:true})});
 $("imageMode").addEventListener("click",()=>{
  hideAttachMenu();setComposerMode(S.composerMode==="image"?"text":"image");
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
 for(const [id,mode] of [["chatAutoChoice","auto"],["chatBoundChoice","free"],["chatPersonalChoice","personal"]])$(id).addEventListener("click",()=>{$("chatModeMenu").open=false;switchChatMode(mode);composerCatalogMode=mode;renderModels()});
 $("modelCatalogRetry").addEventListener("click",()=>{void loadCatalog(true)});
 $("modelDialog").addEventListener("click",e=>{const menu=$("chatModeMenu");if(menu.open&&!menu.contains(e.target))menu.open=false});
 const composerModeMenu=$("composerModeMenu"),composerSwitch=$("composerSwitchModel");
 const closeComposerMode=()=>{composerModeMenu.hidden=true;composerSwitch.setAttribute("aria-expanded","false")};
 composerSwitch.addEventListener("click",()=>{hideAttachMenu();closeReplyLevel();composerModeMenu.hidden=!composerModeMenu.hidden;composerSwitch.setAttribute("aria-expanded",String(!composerModeMenu.hidden));refreshChatModeUI()});
 $("composerModelCatalog").addEventListener("click",()=>{if(S.busy)return;closeComposerMode();hideAttachMenu();closeReplyLevel();openModels(false,selectedChatMode)});
 for(const b of composerModeMenu.querySelectorAll("[data-chat-mode]"))b.addEventListener("click",()=>{
  if(S.busy){closeComposerMode();return}
  const choice=b.dataset.chatMode;closeComposerMode();switchChatMode(choice);
 });
 document.addEventListener("click",e=>{if(!composerModeMenu.hidden&&!composerModeMenu.contains(e.target)&&!composerSwitch.contains(e.target))closeComposerMode()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeComposerMode()});
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
 $("keyDialog").addEventListener("close",()=>{if(!$("keyDialog").open){keyBackPage=null;homeBrandBinding=null}});
 if(VOICE_CHAT_ENABLED)voiceWire();
 wireDictation();wireReplyLevel();wireChatScrollArrows();
}
function showAttachMenu(){closeReplyLevel();$("attachMenu").hidden=false;$("attachButton").setAttribute("aria-expanded","true")}
function hideAttachMenu(){$("attachMenu").hidden=true;$("toolTray").hidden=true;$("attachButton").setAttribute("aria-expanded","false");$("toolsAction").setAttribute("aria-expanded","false")}

document.addEventListener("DOMContentLoaded",async()=>{
 wire();renderIcons();applyChatTextSize(savedChatTextSize());let enabled=true;try{enabled=localStorage.getItem("aigzt:rainbow")!=="0"}catch{}
 applyTheme(enabled?"rainbow":"plain");syncHomeAmbient();document.documentElement.classList.remove("pwa-boot-rainbow");setFreeDefault();resizePrompt();
 syncWorkspaceRoute("");showWelcome();updateModelTitle();
 restorePublicCatalog();void loadCatalog();await fetchMe();void fetchProjects();void fetchChats();void finishOpenRouterOAuth();
 document.addEventListener("visibilitychange",()=>{if(!document.hidden&&!S.busy&&Date.now()-accountCheckedAt>60000)void fetchMe()});
});