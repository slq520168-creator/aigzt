"use strict";
const S={
 user:null,quota:null,chats:[],chatId:null,model:"free:auto",
 modelTitle:"免费自动",provider:"free",keys:{},connected:{},selectedFree:true,connectionsLoaded:false,connectionsLoading:false,
 allowPaid:false,savedProviders:{},freeToolsMode:false,freeToolsCategory:"全部",historyExpanded:false,projectsExpanded:false,workMode:false,workBusy:false,workEpoch:0,workTasks:[],workDetail:null,workTaskId:null,workStages:[],workRoutes:[],workFallback:true,freeModels:[{id:"free:auto",name:"免费自动",provider:"free",type:"text",free:true}],freePoolRoutes:[],remoteModels:[],loadedCatalog:false,
 modelPage:0,source:"all",filter:"all",query:"",workModelRegion:"推荐",busy:false,code:false,
 authRegister:false,createMode:"image",drawBatch:null,videoTask:null,videoProvider:"freetext",videoModel:"wan2.2-ti2v",videoTaskProvider:"freetext",videoImageId:null,videoRatio:"16:9",composerMode:"text",creativeMode:null,attachments:[],projects:[],activeProjectId:null,actionChatId:null,editProjectId:null,archivedView:false,memoryEnabled:true,notes:[],currentTheme:"rainbow"
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
 menu:'<path d="M4 6h16M4 12h10M4 18h16"/>',
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
 ellipsis:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8" cy="7" r="1"/><circle cx="6.5" cy="12" r="1"/><path d="M12 22a10 10 0 1 1 10-10c0 2-1 3-3 3h-3a2 2 0 0 0-2 2 2 2 0 0 1-2 5"/>',
 camera:'<path d="M14 4h-4l-2 3H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4z"/><circle cx="12" cy="13" r="3"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
 blocks:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/>',
 'arrow-up':'<path d="m12 19 0-14m-7 7 7-7 7 7"/>',
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
let iconGradientSerial=0;
function renderIcons(scope=document){
 const icons=[...scope.querySelectorAll("[data-icon]")];
 if(scope.matches?.("[data-icon]"))icons.unshift(scope);
 for(const el of icons){
  const name=el.dataset.icon,path=ICONS[name]||ICONS.info;
  const [from,to]=ICON_GRADIENTS[ICON_TONES[name]||"blue"];
  const id="aigzt-icon-"+(++iconGradientSerial);
  el.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="url(#'+id+')" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="'+from+'"/><stop offset="100%" stop-color="'+to+'"/></linearGradient></defs>'+path+'</svg>';
 }
}
function iconSlot(name){const e=node("span","ui-icon");e.dataset.icon=name;return e;}
function iconButton(icon,text,onClick){
 const b=node("button","action-row"),el=iconSlot(icon);b.type="button";
 b.append(el,node("span","",text));b.addEventListener("click",onClick);renderIcons(b);return b;
}

function show(id){
 const el=$(id);if(!el||el.open)return;
 if(el.classList.contains("workspace-view")||el.classList.contains("context-popover")){el.show();closeMenu();}
 else el.showModal();
}
function hide(id){if($(id).open)$(id).close()}
function closeMenu(){
 $("shell").classList.remove("menu-open");
 $("sideShade").hidden=true;
 $("menuBtn").setAttribute("aria-expanded","false");
}
function openMenu(){
 $("shell").classList.add("menu-open");
 $("sideShade").hidden=false;
 $("menuBtn").setAttribute("aria-expanded","true");
}
function wireDrawerGestures(){
 let gesture=null;
 const isMobile=()=>window.matchMedia("(max-width:900px)").matches;
 document.addEventListener("touchstart",event=>{
  gesture=null;
  if(!isMobile()||event.touches.length!==1||document.querySelector("dialog[open]"))return;
  const target=event.target;
  if(target instanceof Element&&target.closest("input,textarea,select,[contenteditable='true'],[role='slider']"))return;
  const touch=event.touches[0],open=$("shell").classList.contains("menu-open");
  if(!open){
   if(touch.clientX>Math.min(window.innerWidth*.65,300))return;
   if(target instanceof Element&&target.closest("button,a,summary,.source-chips,.model-list,.work-progress"))return;
  }
  gesture={x:touch.clientX,y:touch.clientY,open};
 },{passive:true});
 document.addEventListener("touchend",event=>{
  if(!gesture||event.changedTouches.length!==1){gesture=null;return}
  const origin=gesture;gesture=null;
  if(!isMobile()||document.querySelector("dialog[open]"))return;
  const dx=event.changedTouches[0].clientX-origin.x;
  const dy=event.changedTouches[0].clientY-origin.y;
  if(Math.abs(dx)<75||Math.abs(dx)<Math.abs(dy)*1.5)return;
  if(origin.open&&dx<0)closeMenu();
  else if(!origin.open&&dx>0)openMenu();
 },{passive:true});
 document.addEventListener("touchcancel",()=>{gesture=null},{passive:true});
 window.addEventListener("resize",()=>{
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
 if(!resp.ok||!data?.ok)throw Error(data?.error||"请求失败，HTTP "+resp.status);
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
function connected(p){return !!(S.savedProviders[p]||S.keys[p])}
function refreshKeyPanel(){
 const provider=$("keyProvider").value,rec=S.savedProviders[provider],site=KEY_SITES[provider];
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
function chatTextModel(provider,model){
 return provider==="groq"&&/(?:^|[\/_-])whisper(?:$|[\/_-])/i.test(String(model||""))?"openai/gpt-oss-20b":model;
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
let restoredChatModelOwner=null;
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
  S.model=saved.provider==="free"?"free:auto":chatTextModel(saved.provider,saved.model);
  S.modelTitle=saved.provider==="free"?"免费自动":saved.title;
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
 if(!entry){$("keyStatus").textContent="请先保存密钥";return}
 const button=$("useSavedKey");button.disabled=true;
 try{
  if(VIDEO_ONLY_PROVIDERS.has(provider)||S.videoPendingKeyReturn){hide("keyDialog");if(S.videoPendingKeyReturn){S.videoPendingKeyReturn=false;openVideoCreate()}else if($("createDialog").open)syncVideoSelector();return}
  let model=chatTextModel(provider,entry.model);
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
 }catch(e){$("keyStatus").textContent=humanError(e)}
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
 try{const v=await api("/api/me");S.user=v.user;S.quota=v.quota;restoreChatModelSelection();setAuthUI()}
 catch(e){flashError("账号状态读取失败："+humanError(e))}
}
let chatFetchSerial=0;
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
 const moreHidden=normal.length<=6;
 if($("historyToggle").hidden!==moreHidden)$("historyToggle").hidden=moreHidden;
 const label=S.historyExpanded?"收起":"显示更多";
 if($("historyToggle").firstChild.textContent!==label)$("historyToggle").firstChild.textContent=label;
 const expanded=String(S.historyExpanded);
 if($("historyToggle").getAttribute("aria-expanded")!==expanded)$("historyToggle").setAttribute("aria-expanded",expanded);
 if(pinHeading.hidden===hasPinned)pinHeading.hidden=!hasPinned;
 if(pinned.hidden===hasPinned)pinned.hidden=!hasPinned;
 const existing=new Map([...pinned.children,...recent.children].filter(el=>el.dataset.chatId).map(el=>[el.dataset.chatId,el]));
 const makeRow=x=>{
  const row=node("div","history-row");row.dataset.chatId=x.id;
  const select=node("button","history-select");select.type="button";
  select.append(iconSlot("message-circle"),node("span","history-title",""));
  select.addEventListener("click",()=>void loadChat(x.id));
  const more=node("button","history-more");more.type="button";more.title="聊天操作";
  more.append(iconSlot("ellipsis"));more.addEventListener("click",()=>openChatActions(x.id));
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
 reconcile(recent,S.historyExpanded?normal:normal.slice(0,6),empty);
 if(scroller.scrollTop!==top)scroller.scrollTop=top;
}
async function fetchChats(){
 const seq=++chatFetchSerial,uid=S.user?.id||"",project=S.activeProjectId||"",archived=!!S.archivedView;
 if(!uid){S.chats=[];renderHistory();return}
 try{
  const url="/api/chats"+(project?"?project="+encodeURIComponent(project)+(archived?"&archived=1":""):archived?"?archived=1":"");
  const data=await api(url);
  if(seq!==chatFetchSerial||S.user?.id!==uid||(S.activeProjectId||"")!==project||!!S.archivedView!==archived)return;
  S.chats=data.chats||[];renderHistory();
 }catch(e){if(seq===chatFetchSerial&&S.user?.id===uid)flashError("聊天列表读取失败："+humanError(e))}
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
function actionItem(icon,label,job){
 return iconButton(icon,label,async()=>{hide("actionsDialog");try{await job()}catch(e){flashError(humanError(e))}});
}
function openChatActions(chatId=S.chatId){
 S.actionChatId=chatId;
 const list=$("chatActionList");list.replaceChildren();
 if(!chatId){list.append(actionItem("square-pen","新聊天",async()=>newChat()),actionItem("search","搜索聊天",async()=>show("searchDialog")),actionItem("folder","新建项目",async()=>openProject()));show("actionsDialog");return}
 const item=S.chats.find(x=>x.id===chatId)||{id:chatId};
 list.append(
  actionItem("share","分享 / 导出聊天",async()=>exportChat(chatId)),
  actionItem("pin",item.pinned_at?"取消置顶":"置顶聊天",async()=>{await api("/api/chats/"+chatId+"/pin",{pinned:!item.pinned_at});await fetchChats()}),
  actionItem("folder","添加到项目",async()=>openMoveDialog(chatId)),
  actionItem("square-pen","重命名",async()=>{const name=prompt("聊天名称",item.title||"新对话");if(name?.trim()){await api("/api/chats/"+chatId+"/rename",{title:name.trim()});await fetchChats()}}),
  actionItem("archive",item.archived_at?"恢复聊天":"归档聊天",async()=>{await api("/api/chats/"+chatId+"/archive",{archived:!item.archived_at});if(S.chatId===chatId)newChat();await fetchChats()}),
  actionItem("trash","删除聊天",async()=>{if(!confirm("永久删除这段聊天及消息？"))return;await api("/api/chats/"+chatId+"/delete",{});if(S.chatId===chatId)newChat();await fetchChats()})
 );
 show("actionsDialog");
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
async function searchChats(e){
 e.preventDefault();if(!S.user){show("authDialog");return}
 const q=$("chatSearchInput").value.trim(),r=$("searchResults");r.replaceChildren();if(!q)return;
 try{const d=await api("/api/chats/search?q="+encodeURIComponent(q));if(!d.chats.length)r.append(node("div","hint","未找到聊天"));
  for(const c of d.chats){const b=iconButton("message-circle",c.title,()=>{hide("searchDialog");void loadChat(c.id)});r.append(b)}
 }catch(e){r.append(node("div","hint",humanError(e)))}
}
async function openFiles(){
 if(!S.user){show("authDialog");return}
 show("filesDialog");const box=$("savedFiles");box.replaceChildren(node("div","hint","读取文件中…"));closeMenu();
 try{
  const d=await api("/api/files");box.replaceChildren();
  if(!d.files?.length)box.append(node("div","hint","尚无已上传文件"));
  for(const f of d.files||[]){const a=document.createElement("a");a.className="file-link";a.href=f.url;a.target="_blank";a.rel="noopener";a.append(iconSlot("paperclip"),node("span","",f.name));box.append(a);renderIcons(a)}
 }catch(e){box.replaceChildren(node("div","hint",humanError(e)))}
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
 el.setAttribute("role","img");el.setAttribute("aria-label","AI 助手");
 const id="aigzt-portrait-"+(++aiPortraitSerial);
 el.innerHTML="<svg viewBox=\"0 0 64 64\" width=\"36\" height=\"36\" aria-hidden=\"true\" focusable=\"false\">\n<defs><radialGradient id=\"AVID-halo\" cx=\"25%\" cy=\"16%\" r=\"90%\"><stop stop-color=\"#fcffff\"/><stop offset=\".46\" stop-color=\"#b4e7f5\"/><stop offset=\"1\" stop-color=\"#7493df\"/></radialGradient>\n<linearGradient id=\"AVID-shell\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop stop-color=\"#ffffff\"/><stop offset=\".48\" stop-color=\"#e1ecf8\"/><stop offset=\"1\" stop-color=\"#94b7d5\"/></linearGradient>\n<linearGradient id=\"AVID-screen\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop stop-color=\"#285f78\"/><stop offset=\"1\" stop-color=\"#152d4a\"/></linearGradient>\n<linearGradient id=\"AVID-eye\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop stop-color=\"#5bf8e5\"/><stop offset=\"1\" stop-color=\"#99bbff\"/></linearGradient></defs>\n<circle class=\"ai-avatar-halo\" cx=\"32\" cy=\"32\" r=\"30\" fill=\"url(#AVID-halo)\"/><circle cx=\"32\" cy=\"32\" r=\"29.2\" stroke=\"#fff\" stroke-opacity=\".85\" stroke-width=\"1.4\" fill=\"none\"/>\n<g class=\"ai-avatar-core\">\n<path d=\"M32 14V9\" fill=\"none\" stroke=\"#367b97\" stroke-linecap=\"round\" stroke-width=\"2.1\"/><circle class=\"ai-avatar-beacon\" cx=\"32\" cy=\"7.6\" r=\"3.1\" fill=\"#69e9df\" stroke=\"#fff\" stroke-width=\"1.3\"/>\n<rect x=\"7\" y=\"29\" width=\"8\" height=\"15\" rx=\"4\" fill=\"#c5e0ef\" stroke=\"#7ca6c2\"/><rect x=\"49\" y=\"29\" width=\"8\" height=\"15\" rx=\"4\" fill=\"#c5e0ef\" stroke=\"#7ca6c2\"/>\n<rect x=\"11\" y=\"15\" width=\"42\" height=\"42\" rx=\"17\" fill=\"url(#AVID-shell)\" stroke=\"#83a4bd\" stroke-width=\"1.2\"/>\n<path d=\"M17 24c3-5 7.5-7 13.5-7h9\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".85\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n<rect x=\"15.5\" y=\"25.5\" width=\"33\" height=\"23\" rx=\"11.5\" fill=\"url(#AVID-screen)\" stroke=\"#719fb9\"/><path d=\"M19 29c5.5-3.7 17-4.6 26 0\" fill=\"none\" stroke=\"#d2ffff\" stroke-opacity=\".19\" stroke-width=\"1.7\"/>\n<ellipse class=\"ai-avatar-eye\" cx=\"25\" cy=\"35\" rx=\"3.2\" ry=\"3.9\" fill=\"url(#AVID-eye)\"/><ellipse class=\"ai-avatar-eye\" cx=\"39\" cy=\"35\" rx=\"3.2\" ry=\"3.9\" fill=\"url(#AVID-eye)\"/>\n<circle cx=\"26\" cy=\"33.8\" r=\".95\" fill=\"#fff\"/><circle cx=\"40\" cy=\"33.8\" r=\".95\" fill=\"#fff\"/>\n<path class=\"ai-avatar-smile\" d=\"M27 42q5 4 10 0\" fill=\"none\" stroke=\"#a9edf8\" stroke-width=\"1.9\" stroke-linecap=\"round\"/>\n<ellipse class=\"ai-avatar-mouth\" cx=\"32\" cy=\"43\" rx=\"3.7\" ry=\"2.3\" fill=\"#8ee7f5\"/>\n<circle cx=\"17.5\" cy=\"43\" r=\"2.2\" fill=\"#f4a7c1\" opacity=\".68\"/><circle cx=\"46.5\" cy=\"43\" r=\"2.2\" fill=\"#f4a7c1\" opacity=\".68\"/>\n<path d=\"M26 52q6 3 12 0\" fill=\"none\" stroke=\"#95abc5\" stroke-width=\"1.1\" stroke-linecap=\"round\"/>\n</g></svg>".replaceAll("AVID",id);
 return el;
}
function setPortraitState(row,state){
 const avatar=row?.querySelector(":scope > .avatar-ai");
 if(!avatar||avatar.dataset.state===state)return;
 avatar.dataset.state=state;
 if(state==="finished")window.setTimeout(()=>{
  if(avatar.isConnected&&avatar.dataset.state==="finished")avatar.dataset.state="idle";
 },750);
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
async function pollImageJob(bubble,id,manual){
 if(!bubble.isConnected||bubble.dataset.imageTask!==id||bubble.dataset.imageBusy==="1")return;
 const now=Date.now();
 if(!manual&&now-Number(bubble.dataset.lastImagePoll||0)<6500)return;
 bubble.dataset.imageBusy="1";bubble.dataset.lastImagePoll=String(now);
 let delay=10000;
 try{
  const r=await api("/api/image/task/"+id);
  if(!bubble.isConnected||bubble.dataset.imageTask!==id)return;
  if(Number.isFinite(r.startedAt)&&r.startedAt>0)bubble.dataset.imageStart=String(r.startedAt);
  if(r.done){
   delete bubble.dataset.imageTask;
   if(r.failed){bubble.classList.remove("chat-image-task");bubble.replaceChildren(node("span","image-job-error","生成失败："+(r.error||"上游繁忙")));return}
   const img=node("img","chat-generated-image");img.alt="生成图片";img.loading="eager";bubble.dataset.imageFinalizing=id;
   img.onload=()=>{
    if(!bubble.isConnected||bubble.dataset.imageFinalizing!==id)return;
    const follow=chatImageNearBottom(bubble);
    delete bubble.dataset.imageFinalizing;
    bubble.classList.remove("chat-image-task");bubble.replaceChildren(img);
    const row=bubble.closest(".message");
    if(row){row.dataset.messageKind="image";appendMessageCopy(row,"")}
    // The final image can have a different height from the loading frame.
    if(follow)followLatestImage(bubble);
   };
   img.onerror=()=>{if(bubble.dataset.imageFinalizing!==id)return;delete bubble.dataset.imageFinalizing;bubble.classList.remove("chat-image-task");bubble.replaceChildren(node("span","image-job-error","图片加载失败"))};
   img.src=r.image;return;
  }
  delay=Math.max(7000,Math.min(18000,Number(r.waitSeconds||12)*1000));
 }catch(e){/* 网络短暂故障仍保持秒数，后续继续查询 */}
 finally{
  bubble.dataset.imageBusy="0";if(!bubble.dataset.imageStart)bubble.dataset.imageStart=String(Date.now());
  if(bubble.isConnected&&bubble.dataset.imageTask===id&&Date.now()-Number(bubble.dataset.imageStart)<1860000)window.setTimeout(()=>void pollImageJob(bubble,id,false),delay);
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
function renderAssistantText(bubble,answer){
 const lines=String(answer||"").replace(/\r\n/g,"\n").split("\n");
 bubble.classList.remove("chat-revealing");bubble.replaceChildren();let paragraph=[],list=null,pre=null,code=null;
 function inline(target,value){
  const pattern=/(\*\*[^*]+\*\*|\x60[^\x60]+\x60)/g;
  let index=0,match;
  while((match=pattern.exec(value))){
   if(match.index>index)appendChatLinks(target,value.slice(index,match.index));
   const raw=match[0],bold=raw.startsWith("**");
   if(bold){const strong=node("strong");appendChatLinks(strong,raw.slice(2,-2));target.append(strong)}
   else target.append(node("code","",raw.slice(1,-1)));
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
    for(const item of heads){const th=node("th");inline(th,item);header.append(th)}
    thead.append(header);table.append(thead,tbody);
    let next=lineIndex+2;
    for(;next<lines.length;next++){
     const cells=markdownCells(lines[next]);if(!cells||cells.length!==heads.length)break;
     const tr=node("tr");for(const item of cells){const td=node("td");inline(td,item);tr.append(td)}tbody.append(tr);
    }
    wrapper.append(table);bubble.append(wrapper);lineIndex=next-1;continue;
   }
  }
  if(/^\x60{3}/.test(trim)){
   flush();list=null;
   if(pre){pre=null;code=null}
   else{pre=node("pre","chat-code");code=node("code");
    const codeNode=code,button=node("button","chat-code-copy");button.type="button";button.title="复制代码";button.setAttribute("aria-label","复制代码");
    button.append(iconSlot("copy"));
    button.addEventListener("click",()=>{void copyMessageText(codeNode.textContent,button)});
    pre.append(button,code);bubble.append(pre);renderIcons(button);
   }
   continue;
  }
  if(pre){code.append(document.createTextNode(original+"\n"));continue}
  if(!trim){flush();list=null;continue}
  const heading=trim.match(/^(#{1,3})\s+(.+)$/);
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
async function revealCompletedReply(row,reply){
 const bubble=row?.querySelector(".bubble");if(!bubble||!row.isConnected)return;
 const viewport=$("conversation"),letters=Array.from(String(reply||""));
 if(!letters.length)return;
 bubble.classList.add("chat-revealing");bubble.replaceChildren();
 if(document.hidden||window.matchMedia("(prefers-reduced-motion:reduce)").matches){bubble.textContent=letters.join("");return}
 const batch=Math.max(7,Math.ceil(letters.length/65));let index=0;
 await new Promise(resolve=>{
  const frame=()=>{
   if(!row.isConnected){resolve();return}
   const next=Math.min(letters.length,index+batch);
   const nearBottom=viewport.scrollHeight-viewport.scrollTop-viewport.clientHeight<155;
   bubble.append(document.createTextNode(letters.slice(index,next).join("")));
   index=next;if(nearBottom)viewport.scrollTop=viewport.scrollHeight;
   if(index>=letters.length)resolve();else requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
 });
}


const VOICE_CHAT_ENABLED=false; // Keep two-way voice conversation hidden.
const MESSAGE_READ_ALOUD_ENABLED=false; // Paused until the user explicitly re-enables playback.
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
const voiceSession={active:false,pending:false,listening:false,reading:false,resumePending:false,recognition:null,token:0,button:null,voice:"",lang:"zh-CN",rate:1,lastReply:""};
function sayStatus(t){$("voiceStatus").textContent=t}
function voiceSave(){try{localStorage.setItem("aigzt:voice:v1",JSON.stringify({voice:voiceSession.voice,lang:voiceSession.lang,rate:voiceSession.rate}))}catch{}}
function voiceChoices(){
 if(!window.speechSynthesis)return;
 const sel=$("voiceSelect"),voices=window.speechSynthesis.getVoices();
 sel.replaceChildren(new Option("系统默认声音",""));
 for(const v of voices)sel.add(new Option(v.name+" ("+v.lang+")",v.voiceURI));
 sel.value=voices.some(v=>v.voiceURI===voiceSession.voice)?voiceSession.voice:"";
}
function voiceCancel(){
 voiceSession.token++;voiceSession.reading=false;
 if(voiceSession.button){
  const b=voiceSession.button;
  if(b.classList.contains("message-copy-btn")){b.classList.remove("is-active");b.title="播放回复";b.setAttribute("aria-label","播放回复")}
  else b.textContent="朗读";
  b.setAttribute("aria-pressed","false");voiceSession.button=null
 }
 try{window.speechSynthesis?.cancel()}catch{}
}
function speechContent(v){return String(v||"").replace(/\x60{3}[\s\S]*?\x60{3}/g,"代码已省略").replace(/!\[[^\]]*\]\([^)]+\)/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/https?:\/\/\S+/g,"链接").replace(/[*_#|~]+/g," ").trim()}
function voiceSpeak(value,button=null,continueAfter=false){
 if(!window.speechSynthesis||typeof SpeechSynthesisUtterance!=="function"){sayStatus("浏览器不支持朗读");return false}
 const t=speechContent(value);if(!t)return false;
 voiceCancel();const token=voiceSession.token,synth=window.speechSynthesis,voice=synth.getVoices().find(v=>v.voiceURI===voiceSession.voice);
 voiceSession.reading=true;voiceSession.button=button;
 if(button){
  if(button.classList.contains("message-copy-btn")){button.classList.add("is-active");button.title="停止播放";button.setAttribute("aria-label","停止播放")}
  else button.textContent="停止朗读";
  button.setAttribute("aria-pressed","true")
 }
 let pos=0;sayStatus("正在朗读…");
 const next=()=>{
  if(token!==voiceSession.token)return;
  if(pos>=t.length){
   voiceSession.reading=false;voiceSession.button=null;
   if(button){
    if(button.classList.contains("message-copy-btn")){button.classList.remove("is-active");button.title="播放回复";button.setAttribute("aria-label","播放回复")}
    else button.textContent="朗读";
    button.setAttribute("aria-pressed","false")
   }
   if(continueAfter&&voiceSession.active){if(/iPhone|iPad|iPod/i.test(navigator.userAgent))sayStatus("播报结束，点击开始说话可继续");else{sayStatus("播报结束，继续收听");voiceListen(true)}}
   return;
  }
  const u=new SpeechSynthesisUtterance(t.slice(pos,pos+140));pos+=140;
  u.lang=voice?.lang||voiceSession.lang;u.rate=voiceSession.rate;if(voice)u.voice=voice;
  u.onend=next;u.onerror=()=>{if(token===voiceSession.token){voiceCancel();if(button?.classList.contains("message-copy-btn"))flashError("播放中断，请检查设备音量或静音设置");else sayStatus("播报中断，请手动继续")}};
  try{synth.speak(u)}catch{voiceCancel();if(button?.classList.contains("message-copy-btn"))flashError("播放失败，请检查设备音量");else sayStatus("播放失败，请检查设备音量")}
 };
 next();return true;
}
function voiceStop(){
 voiceSession.active=false;voiceSession.pending=false;voiceSession.listening=false;voiceSession.resumePending=false;
 const rec=voiceSession.recognition;voiceSession.recognition=null;
 if(rec)try{rec.abort()}catch{}
 voiceCancel();$("voiceStart").disabled=false;$("voiceStart").textContent="开始说话";sayStatus("已停止对话");
}
function voiceListen(auto=false){
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Speech){sayStatus("浏览器不支持语音识别，可使用键盘听写");return}
 if(!S.user){sayStatus("请先登录");return}
 if(S.workMode||S.freeToolsMode){sayStatus("请返回聊天模式");return}
 if(S.busy||voiceSession.pending){if(auto&&voiceSession.active)voiceSession.resumePending=true;sayStatus("等待上一轮回复完成");return}
 if(voiceSession.listening)return;
 if(S.provider!=="free"&&!connected(S.provider)){sayStatus("模型未连接，请先选择可用模型");return}
 if(S.provider!=="free"&&!isFreeModel(S.provider,S.model)&&!S.allowPaid){sayStatus("当前模型未授权使用额度，请先在连接设置确认");return}
 voiceSession.resumePending=false;stopDictation(true);voiceCancel();voiceSession.active=true;voiceSession.listening=true;
 $("voiceStart").disabled=true;$("voiceStart").textContent="正在收听…";
 const rec=new Speech();voiceSession.recognition=rec;rec.lang=voiceSession.lang;rec.interimResults=true;rec.continuous=false;
 let text="",failed=false;
 rec.onresult=e=>{
  let partial="";text="";
  for(let i=0;i<e.results.length;i++){const v=e.results[i]?.[0]?.transcript||"";if(e.results[i].isFinal)text+=v;else partial+=v}
  $("voiceHeard").textContent=text+partial||"正在收听";
 };
 rec.onerror=e=>{failed=true;$("voiceStart").disabled=false;$("voiceStart").textContent="重新说话";sayStatus(e.error==="not-allowed"?"麦克风权限未开放":"识别中断："+e.error)};
 rec.onend=()=>{
  if(voiceSession.recognition!==rec)return;
  voiceSession.recognition=null;voiceSession.listening=false;
  $("voiceStart").disabled=false;$("voiceStart").textContent="继续说话";
  if(!voiceSession.active)return;
  if(!text.trim()){if(!failed)sayStatus("没听到完整语句，请重新点击说话");return}
  if($("prompt").value.trim()||S.attachments.length){sayStatus("输入框已有草稿，已保留，请先处理");return}
  $("prompt").value=text.trim();settlePromptSize();voiceSession.pending=true;sayStatus("正在等待 AI 回复…");void sendMessage();
 };
 try{rec.start();sayStatus(auto?"正在尝试自动收听…":"正在收听…");$("voiceHeard").textContent="正在收听…"}
 catch{voiceSession.recognition=null;voiceSession.listening=false;$("voiceStart").disabled=false;$("voiceStart").textContent="重新说话";sayStatus("无法开启语音识别，请检查麦克风权限")}
}
function voiceOpen(){
 try{const x=JSON.parse(localStorage.getItem("aigzt:voice:v1")||"null");if(x){if(typeof x.voice==="string")voiceSession.voice=x.voice;if(["zh-CN","zh-TW","en-US","ja-JP"].includes(x.lang))voiceSession.lang=x.lang;if([0.85,1,1.15,1.3].includes(Number(x.rate)))voiceSession.rate=Number(x.rate)}}catch{}
 $("voiceLang").value=voiceSession.lang;$("voiceRate").value=String(voiceSession.rate);
 if(S.workMode)setWorkMode(false);if(S.freeToolsMode)setFreeToolsMode(false);
 stopDictation(true);if(S.composerMode!=="text")setComposerMode("text");voiceChoices();show("voiceDialog");
 $("voiceStart").disabled=!(window.SpeechRecognition||window.webkitSpeechRecognition);$("voiceStart").textContent="开始说话";
 $("voiceReplay").disabled=!voiceSession.lastReply;
 sayStatus(window.SpeechRecognition||window.webkitSpeechRecognition?"点击开始说话":"当前浏览器不支持语音识别，可使用系统键盘听写");
}
function voiceWire(){
 $("voiceChatOpen").addEventListener("click",voiceOpen);
 $("voiceReplay").addEventListener("click",()=>{if(voiceSession.lastReply)voiceSpeak(voiceSession.lastReply,null,false)});
 $("voiceStart").addEventListener("click",()=>voiceListen());
 $("voiceStop").addEventListener("click",voiceStop);
 $("voiceDialog").addEventListener("close",voiceStop);
 $("voiceSelect").addEventListener("change",e=>{voiceSession.voice=e.target.value;voiceSave()});
 $("voiceLang").addEventListener("change",e=>{voiceSession.lang=e.target.value;voiceSave();voiceChoices()});
 $("voiceRate").addEventListener("change",e=>{voiceSession.rate=Number(e.target.value);voiceSave()});
 window.speechSynthesis?.addEventListener?.("voiceschanged",voiceChoices);
 // Dictation and opt-in voice conversation use separate microphone lifecycles.
 document.addEventListener("visibilitychange",()=>{if(document.hidden&&voiceSession.active)voiceStop()});
}

async function copyMessageText(value,button){
 const content=String(value||"");if(!content)return false;
 let copied=false;
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(content);copied=true}}catch{}
 if(!copied){
  const temp=document.createElement("textarea");
  temp.value=content;temp.setAttribute("readonly","");temp.style.cssText="position:fixed;left:-9999px;top:0;opacity:0";
  document.body.append(temp);
  try{temp.focus();temp.select();copied=document.execCommand("copy")}catch{}
  finally{temp.remove()}
 }
 if(!copied){flashError("复制失败，请长按消息选择文字");return false}
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
 if(!source||/^```[\s\S]*```$/.test(source))return "";
 return source;
}
async function toggleMessageTranslation(row,source,button){
 let state=messageTranslations.get(row);
 const currentSource=messageTranslationSource(row,source);
 if(!currentSource||!row.isConnected)return;
 if(state&&state.source!==currentSource){
  state.panel.remove();messageTranslations.delete(row);state=null;
 }
 if(state?.failed){state.panel.remove();messageTranslations.delete(row);state=null;}
 if(state){
  const open=state.panel.hidden;
  state.panel.hidden=!open;
  button.classList.toggle("is-active",open);
  button.setAttribute("aria-pressed",String(open));
  button.title=open?"收起翻译":"翻译";
  button.setAttribute("aria-label",button.title);
  return;
 }
 const panel=node("div","message-translation");
 panel.setAttribute("role","status");panel.setAttribute("aria-live","polite");
 panel.textContent="正在翻译…";
 row.append(panel);
 state={source:currentSource,panel,pending:true};
 messageTranslations.set(row,state);
 button.classList.add("is-active");
 button.setAttribute("aria-pressed","true");
 button.title="收起翻译";button.setAttribute("aria-label","收起翻译");
 if(currentSource.length>8000){
  state.pending=false;
  panel.textContent="这条消息超过单次 8000 字符的翻译上限，请分段翻译。";
  return;
 }
 try{
  const result=await api("/api/message/translate",{text:currentSource,target:"zh-CN"});
  if(messageTranslations.get(row)!==state||!row.isConnected)return;
  state.pending=false;const translated=String(result.translation||"").trim();if(!translated)throw Error("翻译服务没有返回译文");state.failed=false;panel.textContent=translated;
 }catch(error){
  if(messageTranslations.get(row)!==state||!row.isConnected)return;
  state.pending=false;state.failed=true;
  panel.textContent="翻译暂不可用，请再次点击翻译图标重试";
  button.title="重试翻译";button.setAttribute("aria-label","重试翻译");
 }
}

function messageQuestion(row){
 let previous=row?.previousElementSibling||(!row?.isConnected?$("messageList").lastElementChild:null);
 while(previous&&!previous.classList.contains("user"))previous=previous.previousElementSibling;
 return String(previous?.dataset.sourceText||"");
}
function messageDraft(content,send=false,mode="text"){
 if(S.busy||S.workMode||S.freeToolsMode)return false;
 const text=String(content||"").trim(),input=$("prompt");if(!text)return false;
 if(input.value.trim()&&input.value.trim()!==text&&!confirm("替换当前未发送的草稿？"))return false;
 if(send&&/\[文件：/.test(text)){flashError("原消息包含附件，请重新选择文件后发送");return false}
 input.value=text;setComposerMode(mode);settlePromptSize();
 if(send)void sendMessage();else input.focus();
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
 return new File([text],"AIGZT-message."+extension,{type:(md?"text/markdown":"text/plain")+";charset=utf-8"});
}
function messageImageFile(image){
 const url=image?.currentSrc||image?.src||"";
 const match=url.match(/^data:(image\/(?:png|jpeg|webp|gif|avif));base64,([A-Za-z0-9+/=\s]+)$/i);
 if(!match)return null;
 const base64=match[2].replace(/\s/g,"");
 if(base64.length>16000000)throw Error("图片超出本机处理上限，请长按图片保存");
 const binary=atob(base64),bytes=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
 const mime=match[1].toLowerCase(),extension=mime==="image/jpeg"?"jpg":mime.slice(6);
 return new File([bytes],"AIGZT-image."+extension,{type:mime});
}
function messageNativeFileShare(file,title){
 if(!navigator.share||!navigator.canShare)return null;
 try{if(navigator.canShare({files:[file]}))return navigator.share({files:[file],title})}catch{}
 return null;
}
function messageSaveFile(file,remoteUrl=""){
 const a=node("a");a.style.display="none";
 const objectURL=file?URL.createObjectURL(file):null;
 a.href=objectURL||remoteUrl;a.download=file?.name||"AIGZT-image";
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
  const request=messageNativeFileShare(file,image?"保存 AIGZT 图片":"保存 AIGZT 消息");
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
   const request=messageNativeFileShare(file,"AIGZT 图片");
   if(request){
    try{await request;return}
    catch(e){if(e?.name==="AbortError")return}
   }
   messageDownload(row,content);return;
  }
  const imageUrl=image.currentSrc||image.src;
  if(navigator.share&&/^https?:/i.test(imageUrl)){
   try{await navigator.share({title:"AIGZT 图片",url:new URL(imageUrl,location.href).href});return}
   catch(e){if(e?.name==="AbortError")return}
  }
  messageDownload(row,content);return;
 }
 const value=String(content||"");
 if(!value.trim()){flashError("没有可以分享的消息");return}
 if(navigator.share){
  try{
   const file=value.length>1800?messageTextFile(value):null;
   const request=file?messageNativeFileShare(file,"AIGZT 回复"):null;
   if(request){await request;return}
   await navigator.share({title:"AIGZT 回复",text:value});return;
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
 if(!usage||typeof usage!=="object")return "未提供 Token 用量";
 const fmt=x=>Number.isSafeInteger(x)&&x>=0?x.toLocaleString():"—";
 let text="输入 "+fmt(usage.input)+" · 输出 "+fmt(usage.output)+" · 合计 "+fmt(usage.total);
 if(Number.isSafeInteger(usage.reasoning)&&usage.reasoning>=0)text+=" · 推理 "+fmt(usage.reasoning);
 return text+" tokens";
}
function appendMessageCopy(row,content){
 if(!row?.classList?.contains("message"))return;
 row.querySelector(":scope > .message-copy-bar")?.remove();
 const text=String(content||""),image=row.querySelector("img.chat-generated-image");
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
  if(MESSAGE_READ_ALOUD_ENABLED&&!image&&window.speechSynthesis&&typeof SpeechSynthesisUtterance==="function"){
   const play=messageTool("volume-2","播放回复",b=>{
    if(voiceSession.button===b&&voiceSession.reading){voiceCancel();return}
    if(!voiceSpeak(text,b,false))flashError("本设备暂不支持播放回复");
   });
   play.setAttribute("aria-pressed","false");bar.append(play);
  }
 }
 const more=node("details","message-more-wrap"),trigger=node("summary","message-copy-btn message-more-trigger"),panel=node("div","message-more-panel");
 trigger.setAttribute("aria-label","更多消息操作");trigger.title="更多消息操作";trigger.append(iconSlot("ellipsis"));
 if(!user){
  if(!image)panel.append(messageTool("file-text","下载 TXT",()=>{more.open=false;messageDownload(row,text,"txt")}));
  const reported=node("div","message-token-report",messageTokenText(row));
  reported.title="仅展示服务商实际报告的 Token；未返回则不估算";
  panel.append(reported);
  const current=Number(row.dataset.feedback||0);
  if(!image&&row.dataset.messageId){
   for(const [score,icon,name] of [[1,"thumbs-up","有帮助"],[-1,"thumbs-down","没有帮助"]]){
    const feedback=messageTool(icon,name,b=>{
     more.open=false;
     messageSetAction(row,"feedback",Number(row.dataset.feedback)===score?0:score,b);
    });
    feedback.dataset.action=score===1?"up":"down";feedback.classList.toggle("is-active",current===score);
    panel.append(feedback);
   }
   if(messageQuestion(row)){
    panel.append(messageTool("layers","换模型重问",()=>{
     more.open=false;if(messageDraft(messageQuestion(row)))openModels();
    }));
   }
   if(row.dataset.incomplete==="1"){
    panel.append(messageTool("arrow-up","继续回答",()=>{
     more.open=false;messageDraft("请从上一条未完成的回答中断处继续写完，不要重复已经写出的内容。",true);
    }));
   }
  }
 }
 if(!user){more.append(trigger,panel);bar.append(more);renderIcons(trigger)}
 const translated=row.querySelector(":scope > .message-translation");
 if(translated)row.append(bar,translated);else row.append(bar);
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
function inlineVideoJob(bubble,id){
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
   const r=await api("/api/video/status",{provider:"freewan",requestId:id});
   if(!active())return;
   errors=0;
   if(Number.isFinite(r.startedAt)&&r.startedAt>0)bubble.dataset.videoStarted=String(r.startedAt);
   if(r.status==="completed"&&/^\/api\/video\/media\/[0-9a-f-]{36}$/i.test(r.url||"")){
    const row=bubble.closest(".message"),mediaId=r.url.split("/").pop();
    cleanup();
    if(row){appendMessage("assistant","[[aigzt:video:"+mediaId+"]]","免费视频",row,false,row.dataset.messageId);setPortraitState(row,"finished")}
    else inlineVideo(bubble,mediaId);
    return;
   }
   if(r.status==="failed"){
    cleanup();frame.classList.add("video-job-failed");
    label.textContent="视频生成失败";hint.textContent=r.error||"免费来源暂不可用";
    setPortraitState(bubble.closest(".message"),"error");
    return;
   }
   hint.textContent="等待免费来源返回视频…";
   delay=Math.max(15000,Math.min(60000,Number(r.waitSeconds||17)*1000));
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

function appendMessage(role,content,model,existingRow=null,incomplete=false,messageId=null,saved=false,feedback=0,usage=null){
 const row=existingRow||node("div","message "+role),bubble=existingRow?.querySelector(".bubble")||node("div","bubble");
 if(existingRow){
  row.querySelector(":scope > .message-copy-bar")?.remove();
  row.querySelector(":scope > .message-translation")?.remove();
  messageTranslations.delete(row);
  delete bubble.dataset.imageFinalizing;
 }
 if(messageId)row.dataset.messageId=messageId;
 row.dataset.saved=saved?"1":(row.dataset.saved||"0");
 row.dataset.feedback=String(Number(feedback)||0);
 row.dataset.usage=typeof usage==="string"?usage:usage?JSON.stringify(usage):(row.dataset.usage||"");
 bubble.classList.remove("chat-image-task");
 if(role==="user")row.dataset.sourceText=String(content||"");
 bubble.textContent=String(content||"");
 if(role==="assistant"){
  if(!existingRow)row.append(makeAssistantPortrait(),bubble);
  else if(!row.querySelector(":scope > .avatar-ai"))row.prepend(makeAssistantPortrait());
  const pending=String(content||"").match(/^\[\[aigzt:image-job:([0-9a-f-]{36})\]\]$/i);
  if(pending){row.dataset.messageKind="image";bubble.replaceChildren();renderImageJob(bubble,pending[1])}
  const picture=String(content||"").match(/^!\[生成图片\]\((\/api\/files\/[0-9a-f-]{36})\)$/);
  if(picture){row.dataset.messageKind="image";bubble.replaceChildren();const im=node("img","chat-generated-image");im.src=picture[1];im.alt="AI生成的图片";im.loading="lazy";bubble.append(im)}
  const videoPending=String(content||"").match(/^\[\[aigzt:video-job:([0-9a-f-]{36})\]\]$/i);
  const videoDone=String(content||"").match(/^\[\[aigzt:video:([0-9a-f-]{36})\]\]$/i);
  if(videoPending){row.dataset.messageKind="video";inlineVideoJob(bubble,videoPending[1]);}
  if(videoDone){row.dataset.messageKind="video";inlineVideo(bubble,videoDone[1]);}
  if(!pending&&!picture&&!videoPending&&!videoDone&&String(content||"").trim()){
   renderAssistantText(bubble,content);
   // Keep the answer clean; all actions are in the compact toolbar.
   row.dataset.usedModel=typeof model==="string"?model:"";
   row.dataset.incomplete=incomplete?"1":"0";
  }
  if(!pending&&!videoPending)appendMessageCopy(row,videoDone?"视频已生成":content);
 }else{
  const lines=String(content||"").split(/\n(?=\[文件：)/);
  bubble.replaceChildren();
  const marker=/^\[文件：([^\]]+)\]\((\/api\/files\/[0-9a-f-]{36})\)$/i;
  const parts=lines.map(line=>({line,file:line.match(marker)}));
  if(parts.some(part=>part.file)){
   for(const part of parts){
    if(!part.file){if(part.line.trim())appendChatLinks(bubble,part.line);continue;}
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
  }else appendChatLinks(bubble,content);
  row.append(bubble);
  // Keep the sent-message copy action below its bubble, not inside the text background.
  appendMessageCopy(row,content);
 }
 if(!existingRow)$("messageList").append(row);
 const viewport=$("conversation");
 if(viewport&&!viewport.hidden){
  const nearBottom=viewport.scrollHeight-viewport.scrollTop-viewport.clientHeight<150;
  if(nearBottom||role==="user")viewport.scrollTop=viewport.scrollHeight;
 }
 return row;
}
function newChat(){
 if(voiceSession.reading)voiceCancel();
 S.creativeMode=null;
 S.code=false;$("codeToggle").classList.remove("active");$("codeToggle").setAttribute("aria-pressed","false");
 if(S.freeToolsMode)setFreeToolsMode(false);
 if(S.workMode)setWorkMode(false);
 S.chatId=null;S.attachments=[];renderAttachments();setComposerMode("text");$("messageList").replaceChildren();showWelcome();
 $("prompt").value="";$("prompt").placeholder="向 AI 提问…";settlePromptSize();flashError("");renderHistory();closeMenu();
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
 if(voiceSession.reading)voiceCancel();
 S.creativeMode=null;
 if(S.freeToolsMode)setFreeToolsMode(false);
 if(S.workMode)setWorkMode(false);
 try{
  const v=await api("/api/chats/"+id);
  S.chatId=id;$("messageList").replaceChildren();hideWelcome();
  for(const m of v.messages)appendMessage(m.role,m.body,m.model,null,false,m.id,Boolean(m.saved),m.feedback,m.usage_json);
  const c=S.chats.find(c=>c.id===id);
  if(c&&c.project_id!==undefined){S.activeProjectId=c.project_id||null;renderProjects()}
  // A chat's saved provider is historical; viewing it must not overwrite the active selection.
  updateModelTitle();
  renderHistory();closeMenu();
 }catch(e){flashError("会话读取失败："+humanError(e))}
}
function chatSelectedName(){
 if(S.provider==="free")return "免费自动";
 const raw=String(S.modelTitle||S.model||"").trim(),label=raw.startsWith(S.provider+" · ")?raw.slice(S.provider.length+3):raw;
 return (WORK_PROVIDER_SHORT[S.provider]||S.provider)+" · "+(label||S.model);
}
function updateChatActiveModel(){
 const title=$("chatActiveModelName"),note=$("chatActiveModelNote");
 if(!title||!note)return;
 title.textContent=chatSelectedName();
 note.textContent=S.provider==="free"?"免费线路自动选择上游，具体模型按每次请求决定":
 "选定模型 ID："+S.model+" · "+(S.savedProviders[S.provider]?.verified?"连接已保存":"连接尚待验证");
}
function updateComposerModel(){
 const line=$("composerModelLine"),name=$("composerModelName"),switcher=$("composerSwitchModel");
 if(!line||!name||!switcher)return;
 const imageMode=S.composerMode==="image",videoMode=S.composerMode==="video";
 line.hidden=(!imageMode&&!videoMode&&S.composerMode!=="text")||S.freeToolsMode;
 const work=Boolean(S.workMode),active=work?currentWorkModelName():chatSelectedName();
 name.textContent=imageMode?"免费作图 · 点击左侧返回聊天":videoMode?(VIDEO_PROVIDER_NAMES[S.videoProvider]||"免费视频")+" · 点击切换":active;
 name.title=imageMode?"当前在聊天中生成图片，成功后直接显示在对话内":videoMode?"选择免费来源或个人 API 视频模型":(work?"当前工作选择：":"当前聊天选择：")+active;
 $("composerModelCaption").textContent=imageMode?"作图模式":videoMode?"视频模式":work?"工作模型":"聊天模型";
 switcher.setAttribute("aria-label",imageMode||videoMode?"切回普通聊天":work?"切换工作模型":"切换聊天模型");
 switcher.title=imageMode||videoMode?"切回普通聊天":work?"切换工作模型":"切换聊天模型";
}
function updateModelTitle(){
 $("modelTitle").textContent=S.provider==="free"?"免费自动":S.modelTitle;
 updateChatActiveModel();updateComposerModel();
}
function setModel(row){
 if(row.type!=="text"){
  if(row.type==="audio")return;
  hide("modelDialog");
  if(row.type==="image"){setComposerMode("image");$("prompt").focus()}else openVideoCreate();
  return;
 }
 // Models returned by the OpenRouter catalog must use OpenRouter authentication, not the model author's API.
 const via=row.availableWith==="openrouter-key"?"openrouter":row.provider;
 if(via!=="free"&&!connected(via)){
  hide("modelDialog");openKeyPanel(via);
  $("keyStatus").textContent="获取并保存 "+via+" 的 API Key 后选择模型";
  return;
 }
 S.provider=via;S.model=via==="free"?"free:auto":row.id;S.modelTitle=via==="free"?"免费自动":row.name||row.id;
 S.allowPaid=Boolean(S.savedProviders[via]?.consent);S.selectedFree=isFreeModel(via,S.model);
 rememberChatModelSelection();
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
let viewportLayoutFrame=0;
function syncMobileHeight(){
 if(!window.visualViewport||viewportLayoutFrame)return;
 viewportLayoutFrame=requestAnimationFrame(()=>{
  viewportLayoutFrame=0;
  const root=document.documentElement;
  const keyboardVisible=document.activeElement===$("prompt")&&window.innerHeight-window.visualViewport.height>140;
  root.classList.toggle("aigzt-keyboard-visible",keyboardVisible);
  const next=keyboardVisible?Math.round(window.visualViewport.height)+"px":"";
  if(root.style.getPropertyValue("--aigzt-visible-height")!==next){
   if(next)root.style.setProperty("--aigzt-visible-height",next);
   else root.style.removeProperty("--aigzt-visible-height");
  }
 });
}

/* Compact text-only tool selectors follow the original 作图／视频／代码 controls. */
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
function chooseMiniTool(action){
 if(S.busy)return;
 hideAttachMenu();$("toolTray").hidden=true;
 if(action==="image-edit"){
  setComposerMode("image");
  S.miniToolChoice="image-edit";
  $("prompt").placeholder="添加参考图片，描述你想修改的内容…";
  syncMiniTools();
  if(S.user&&!S.attachments.some(a=>["image/jpeg","image/png","image/webp"].includes(a.type))){$("photosInput").click();return}
 }else{
  const provider=action==="image-video"?"freewan":action==="frame-video"?"freeloop":null;
  if(!provider)return;
  selectVideoModel(provider,VIDEO_OPTIONS[provider][0]);
  setComposerMode("video");
  if(provider!=="freetext")$("prompt").placeholder="添加参考图，描述想生成的动作…";
  syncMiniTools();
  if(provider!=="freetext"&&S.user&&!S.attachments.some(a=>["image/jpeg","image/png","image/webp"].includes(a.type))){$("photosInput").click();return}
 }
 $("prompt").focus({preventScroll:true});
}

function setComposerMode(mode){
 if(mode!=="image")S.miniToolChoice=null;
 S.composerMode=mode;
 if(S.workMode&&mode!=="text")setWorkMode(false);
 $("imageMode").classList.toggle("active",mode==="image");
 $("videoMode").classList.toggle("active",mode==="video");
 $("imageMode").setAttribute("aria-pressed",String(mode==="image"));
 $("videoMode").setAttribute("aria-pressed",String(mode==="video"));
 $("prompt").placeholder=mode==="image"?"描述想画的内容…":mode==="video"?"描述想生成的视频…":"向 AI 提问…";
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
 if(S.composerMode!=="image")return file;
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
 if(S.attachments.length+files.length>4){flashError("一次最多上传4个附件");return}
 if(S.composerMode==="image"&&S.miniToolChoice==="image-edit"&&(files.length!==1||S.attachments.length)){
  flashError("图生图一次仅允许一张参考图片，请先移除原图再选择");return
 }
 for(const file of files){
  if(file.size>8000000){flashError("单文件最大8MB："+file.name);continue}
  try{
   $("attachButton").disabled=true;
   const selected=await optimizeImageReference(file);
   const body=new FormData();body.append("file",selected);
   const r=await fetch("/api/files/upload",{method:"POST",credentials:"same-origin",body});
   const d=await r.json().catch(()=>null);
   if(!r.ok||!d?.ok)throw Error(d?.error||"HTTP "+r.status);
   S.attachments.push(d);renderAttachments();
  }catch(e){flashError("上传失败："+humanError(e))}
  finally{$("attachButton").disabled=false}
 }
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
 return p==="auto"||p==="free"?"免费自动":(WORK_PROVIDER_SHORT[p]||WORK_PROVIDER_NAMES[p]||p)+(s.model?" · "+s.model:"");
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
   hide("workModelDialog");openKeyPanel(provider);return;
  }
  if(!model||!/^[a-zA-Z0-9][a-zA-Z0-9._:/@+\[\]-]{0,159}$/.test(model)){
   $("workModelMessage").textContent="请选择有效的官方模型 ID";return;
  }
 }
 if(["completed","cancelled"].includes(S.workDetail?.task?.status))newWorkDraft();
 if(!S.workStages.length)resetWorkPlan();
 const before=S.workStages.map(s=>({...s})),start=S.workDetail?.task?.nextStep||0;
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
   S.workStages=before;renderWorkEditor();updateWorkSelectedModel();
   $("workModelMessage").textContent="未保存，已恢复先前选择";return;
  }
 }
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
  const name=provider==="free"?"免费自动":WORK_PROVIDER_NAMES[provider];
  const record=S.savedProviders[provider];
  const ready=provider==="free"||!!record?.verified&&(!!record.consent||isFreeModel(provider,record.model));
  const active=currentWorkStage().step;
  const selected=provider==="free"?(!active.provider||active.provider==="auto"||active.provider==="free"):active.provider===provider;
  const button=node("button","work-model-option "+(ready?"ready":"connect")+(selected?" selected":""));
  button.type="button";button.setAttribute("aria-pressed",String(selected));
  const top=node("span","work-model-option-head");
  top.append(node("strong","",WORK_PROVIDER_SHORT[provider]||name),node("span","work-model-option-action",selected?"✓ 当前使用":ready?"选择":"连接"));
  button.append(top,node("small","",selected?(provider==="free"?"免费自动线路 · 每次实际模型由上游决定":"已选模型："+(active.model||record?.model||"未指定")):provider==="free"?"自动调用真实免费线路":ready?"已验证连接 · 点击选择模型":record?"需要验证连接或授权":"连接官方 API 后使用"));button.title=selected?(provider==="free"?"当前使用：免费自动线路":"当前使用："+name+" / "+(active.model||record?.model||"未指定")):name;
  button.addEventListener("click",()=>{
   if(S.workBusy||S.workDetail?.task?.status==="running"){$("workModelMessage").textContent="当前任务正在执行，不能更换模型";return}
   if(!ready){hide("workModelDialog");openKeyPanel(provider);return}
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
function resetWorkPlan(){
 S.workStages=[
  {name:"规划",instruction:"理解需求，明确任务与交付内容",provider:"auto",model:""},
  {name:"制作",instruction:"根据规划完成可用成果",provider:"auto",model:""},
  {name:"检查交付",instruction:"核对并修正问题，提供最终成果",provider:"auto",model:""}
 ];
 S.workRoutes=[];S.workFallback=true;
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
 const routeBox=$("workRouteEditor");routeBox.replaceChildren();
 if(!S.workRoutes.length)routeBox.append(node("p","work-no-routes","未指定候补线路，将优先使用免费模型与已授权的连接"));
 for(const [i,item] of S.workRoutes.entries()){
  const row=node("div","work-route-row"),provider=chooseWorkProvider(item.provider,false);
  provider.disabled=locked;provider.setAttribute("aria-label","候补 API 服务商");
  provider.addEventListener("change",()=>{
   item.provider=provider.value;item.model=provider.value==="free"?"free:auto":S.savedProviders[provider.value]?.model||"";
   ensureWorkProviderCatalog(item.provider);renderWorkEditor();
  });
  const model=workModelPicker(item.provider,item.model,v=>item.model=v,locked);
  const up=node("button","work-route-move","↑");up.type="button";up.title="上移";up.disabled=locked||i===0;
  up.addEventListener("click",()=>{[S.workRoutes[i-1],S.workRoutes[i]]=[S.workRoutes[i],S.workRoutes[i-1]];renderWorkEditor()});
  const down=node("button","work-route-move","↓");down.type="button";down.title="下移";down.disabled=locked||i===S.workRoutes.length-1;
  down.addEventListener("click",()=>{[S.workRoutes[i],S.workRoutes[i+1]]=[S.workRoutes[i+1],S.workRoutes[i]];renderWorkEditor()});
  const del=node("button","work-route-move","×");del.type="button";del.title="移除";del.disabled=locked;del.addEventListener("click",()=>{S.workRoutes.splice(i,1);renderWorkEditor()});
  row.append(provider,model,up,down,del);routeBox.append(row);
 }
 $("workAddStage").disabled=locked||S.workStages.length>=12;
 $("workAddRoute").disabled=locked||S.workRoutes.length>=20;
 $("workSaveConfig").disabled=locked;
 $("workFallback").disabled=locked;
 $("workFallback").checked=S.workFallback;
 $("workConfigSummary").textContent=S.workStages.length+" 个步骤 · "+S.workRoutes.length+" 条自选候补线路";
 updateWorkSelectedModel();
}
function newWorkDraft(){
 if(S.workBusy)return;
 S.workTaskId=null;S.workDetail=null;resetWorkPlan();renderWorkDetail();renderWorkTasks();renderProjects();renderWorkEditor();if(S.workMode)renderWorkAgentCatalog();
 $("workConfigMessage").textContent="已准备新任务";$("prompt").value="";$("workConfig").open=false;$("workBoard").scrollTop=0;
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
 const payload={steps:S.workStages,routes:S.workRoutes,fallback:S.workFallback};
 $("workSaveConfig").disabled=true;$("workContinue").disabled=true;
 try{const d=await api("/api/work/tasks/"+id+"/configure",payload);S.workDetail=d;renderWorkDetail();$("workConfigMessage").textContent="已保存到当前任务";return true}
 catch(e){$("workConfigMessage").textContent="模型配置保存失败："+humanError(e);return false}
 finally{renderWorkEditor();$("workContinue").disabled=S.workBusy}
}
function initDomesticProviderLinks(){
 const el=$("domesticProviderList");el.replaceChildren();
 for(const id of ["qwen","deepseek","zhipu","kimi","minimax","doubao","qianfan","hunyuan","stepfun","xiaomi","longcat","baichuan","iflytek","sensetime","siliconflow","novai","novai_pro"]){
  const b=node("button","domestic-provider",WORK_PROVIDER_NAMES[id]+(connected(id)?" · 已连接":""));
  b.type="button";b.addEventListener("click",()=>{hide("modelDialog");openKeyPanel(id)});
  el.append(b);
 }
}



const CURATED_FREE_TOOLS=[{"provider":"Venice AI","name":"Venice · 自由聊天","category":"聊天","categories":["聊天","角色","综合"],"url":"https://venice.ai/ai-tools/ai-chat","features":["私密聊天","开放创作","多模型"],"access":"daily","login":"需登录","note":"免费档约10次文本提问/天，部分模型功能收费。","featured":true,"verified":true,"policy":"开放创作"},{"provider":"Venice AI","name":"Venice · AI 作图","category":"作图","categories":["作图","综合"],"url":"https://venice.ai/ai-tools/ai-image-generator","features":["文生图","私密作图","开放创作"],"access":"daily","login":"需登录","note":"免费档约15次图片提示/天，高级功能可能收费。","featured":true,"verified":true,"policy":"开放创作"},{"provider":"Venice AI","name":"Venice · 图片编辑","category":"图生图","categories":["图生图","修图"],"url":"https://venice.ai/ai-tools/ai-photo-editor","features":["图生图","提示词修图","开放创作"],"access":"daily","login":"需登录","note":"共用免费图片额度，部分图片编辑能力需要订阅。","featured":false,"verified":true,"policy":"开放创作"},{"provider":"Mage","name":"Mage · 多模型作图","category":"作图","categories":["作图","综合"],"url":"https://www.mage.space/ai-image-generator","features":["多模型","文生图","写实与动漫"],"access":"trial","login":"按官网要求","note":"可使用初始免费Gems，不同模型费用不同。","featured":true,"verified":true},{"provider":"Mage","name":"Mage · 图生图","category":"图生图","categories":["图生图","修图"],"url":"https://www.mage.space/ai-image-to-image-generator","features":["图像变体","上传参考图","图片重绘"],"access":"trial","login":"按官网要求","note":"免费开始，后续按模型消耗Gems。","featured":false,"verified":true},{"provider":"Viggle","name":"Viggle · 图片转视频","category":"视频","categories":["视频","图生图","角色"],"url":"https://viggle.ai/tools/image-to-video-ai/","features":["图生视频","动作迁移","角色动画"],"access":"daily","login":"需登录","note":"官网说明免费账号约5条视频/天，免费导出带水印。","featured":true,"verified":true},{"provider":"Viggle","name":"Viggle · 图片动画","category":"视频","categories":["视频","角色"],"url":"https://viggle.ai/tools/ai-image-animator/","features":["人物动效","动作模板","照片动画"],"access":"daily","login":"需登录","note":"免费额度每日刷新；高质量导出有限制。","featured":false,"verified":true},{"provider":"PixVerse","name":"PixVerse · AI 视频","category":"视频","categories":["视频","综合"],"url":"https://pixverse.ai/en/product/ai-video-generator","features":["文生视频","镜头控制","视频效果"],"access":"daily","login":"需登录","note":"有免费积分，复杂视频和部分模型可能需要付费。","featured":false,"verified":true},{"provider":"PixVerse","name":"PixVerse · 图生视频","category":"视频","categories":["视频","图生图"],"url":"https://pixverse.ai/en/product/image-to-video","features":["图生视频","照片运动","镜头动画"],"access":"daily","login":"需登录","note":"每天免费积分，生成门槛随模型变化。","featured":false,"verified":true},{"provider":"Recraft","name":"Recraft · 图片设计","category":"作图","categories":["作图","修图"],"url":"https://www.recraft.ai/ai-image-generator","features":["文生图","文字海报","创意设计"],"access":"daily","login":"需登录","note":"免费账户有每日积分，部分作品限非商业用途。","featured":false,"verified":true},{"provider":"Recraft","name":"Recraft · 图片编辑","category":"图生图","categories":["图生图","修图"],"url":"https://www.recraft.ai/ai-photo-editor","features":["上传照片","自然语言修图","局部编辑"],"access":"daily","login":"需登录","note":"免费图像编辑与生成共用每日积分。","featured":false,"verified":true},{"provider":"Recraft","name":"Recraft · SVG 矢量图","category":"作图","categories":["作图","修图"],"url":"https://www.recraft.ai/vector-editor","features":["矢量图","SVG","设计素材"],"access":"daily","login":"需登录","note":"免费每日积分，商用权限和导出限制以套餐为准。","featured":false,"verified":true},{"provider":"Leonardo AI","name":"Leonardo · 创意生图","category":"作图","categories":["作图","图生图"],"url":"https://leonardo.ai/","features":["艺术作图","图像变体","风格生成"],"access":"daily","login":"需登录","note":"官方免费档有每日Token，高级模型付费。","featured":false,"verified":true},{"provider":"Ideogram","name":"Ideogram · 文字海报","category":"作图","categories":["作图","修图"],"url":"https://ideogram.ai/","features":["文字入图","海报","LOGO"],"access":"daily","login":"需登录","note":"符合条件的账号可获每周免费积分，注册渠道可能影响资格。","featured":false,"verified":true},{"provider":"SeaArt","name":"SeaArt · 图片视频创作","category":"综合","categories":["综合","作图","图生图","视频","修图"],"url":"https://www.seaart.ai/","features":["AI作图","图生视频","图片处理"],"access":"daily","login":"需登录","note":"免费每日体力或积分，具体模型各有消耗。","featured":false,"verified":true},{"provider":"Tensor.Art","name":"Tensor.Art · 模型画廊","category":"作图","categories":["作图","图生图","视频"],"url":"https://tensor.art/","features":["LoRA","模型作图","图生图"],"access":"daily","login":"需登录","note":"每日免费Energy，视频免费活动可能临时变化。","featured":false,"verified":true},{"provider":"Qwen Studio","name":"千问 · 聊天与作图","category":"聊天","categories":["聊天","作图","综合"],"url":"https://chat.qwen.ai/","features":["中文聊天","图片生成","多模态"],"access":"free","login":"按官网要求","note":"提供基础免费体验，模型和地区可能设限。","featured":false,"verified":true},{"provider":"Qwen Studio","name":"千问 · 图片编辑","category":"图生图","categories":["图生图","修图"],"url":"https://chat.qwen.ai/?inputFeature=image_edit","features":["中文修图","图像编辑","上传图片"],"access":"free","login":"按官网要求","note":"千问官方图像编辑入口，登录要求按网页提示。","featured":false,"verified":true},{"provider":"Character.AI","name":"Character.AI · 角色聊天","category":"聊天","categories":["聊天","角色"],"url":"https://character.ai/","features":["角色扮演","人物互动","故事对话"],"access":"free","login":"需登录","note":"基础消息聊天免费，并非无审核服务。","featured":false,"verified":true},{"provider":"Janitor","name":"Janitor · 角色互动","category":"角色","categories":["角色","聊天"],"url":"https://jani.com/","features":["社区角色","情景对话","自建人物"],"access":"free","login":"需登录","note":"Janitor 官方站点，模型和付费条件依使用方式决定。","featured":false,"verified":true},{"provider":"KoboldAI","name":"KoboldAI Lite · 社区聊天","category":"聊天","categories":["聊天","角色","写作"],"url":"https://lite.koboldai.net/","features":["AI Horde","自由聊天","故事写作"],"access":"community","login":"可直接体验","note":"社区志愿者模型可能排队，私密内容不要直接提交。","featured":false,"verified":true},{"provider":"Marvis AI","name":"Marvis · 免费视频体验","category":"视频","categories":["视频"],"url":"https://ai.jxzhihi.com/","features":["文生视频","短视频","免注册"],"access":"trial","login":"可直接体验","note":"官方说明无需注册即可免费尝试，但个人GPU可能排队。","featured":false,"verified":true},{"provider":"Hugging Face","name":"Qwen · 图像编辑演示","category":"图生图","categories":["图生图","修图"],"url":"https://huggingface.co/spaces/Qwen/Qwen-Image-Edit","features":["Qwen修图","图像编辑","社区演示"],"access":"community","login":"按官网要求","note":"第三方Space可能休眠排队或要求登录。","featured":false,"verified":true},{"provider":"Hugging Face","name":"Real-ESRGAN · 图片增强","category":"修图","categories":["修图"],"url":"https://huggingface.co/spaces/akhaliq/Real-ESRGAN","features":["高清放大","照片增强","清晰化"],"access":"community","login":"按官网要求","note":"社区Space可能休眠或暂停推理。","featured":false,"verified":true},{"provider":"Runway","name":"Runway · 视频试用","category":"视频","categories":["视频","图生图"],"url":"https://app.runwayml.com/","features":["文生视频","图生视频","视频编辑"],"access":"trial","login":"需登录","note":"免费计划主要为一次性试用积分，很多模型不在免费档。","featured":false,"verified":true},{"provider":"Luma","name":"Luma · Dream Machine","category":"视频","categories":["视频","图生图"],"url":"https://lumalabs.ai/dream-machine","features":["图转视频","镜头运动","短片生成"],"access":"trial","login":"需登录","note":"免费档有严格限制，功能和商用授权按官网规则。","featured":false,"verified":true}];
const VERIFIED_ADDITIONAL_FREE_TOOLS=[{"name":"ChatGPT · AI 对话","provider":"OpenAI","category":"聊天","categories":["聊天"],"url":"https://chatgpt.com/","features":["AI 对话"],"access":"free","note":"免费使用有额度限制","verified":true},{"name":"Claude · AI 写作与分析","provider":"Anthropic","category":"聊天","categories":["聊天"],"url":"https://claude.ai/","features":["AI 写作与分析"],"access":"free","note":"免费版有额度及地区限制","verified":true},{"name":"Gemini · Google AI 助手","provider":"Google","category":"聊天","categories":["聊天"],"url":"https://gemini.google.com/app","features":["Google AI 助手"],"access":"free","note":"免费版有使用限制","verified":true},{"name":"DeepSeek · 免费 AI 对话","provider":"DeepSeek","category":"聊天","categories":["聊天"],"url":"https://chat.deepseek.com/","features":["免费 AI 对话"],"access":"free","note":"提供免费网页聊天","verified":true},{"name":"Mistral Vibe · AI 聊天与工作","provider":"Mistral AI","category":"聊天","categories":["聊天"],"url":"https://chat.mistral.ai/","features":["AI 聊天与工作"],"access":"free","note":"原 Le Chat；免费版有限额","verified":true},{"name":"Perplexity · AI 搜索问答","provider":"Perplexity","category":"综合","categories":["综合"],"url":"https://www.perplexity.ai/","features":["AI 搜索问答"],"access":"free","note":"免费标准版，专业功能有限额","verified":true},{"name":"Microsoft Copilot · AI 搜索与聊天","provider":"Microsoft","category":"聊天","categories":["聊天"],"url":"https://copilot.microsoft.com/","features":["AI 搜索与聊天"],"access":"free","note":"部分功能需登录","verified":true},{"name":"Gemini Notebook · 资料研究助手","provider":"Google","category":"写作","categories":["写作"],"url":"https://notebooklm.google.com/","features":["资料研究助手"],"access":"free","note":"原 NotebookLM，额度有限","verified":true},{"name":"Hugging Face · AI 工具演示馆","provider":"Hugging Face","category":"目录","categories":["目录"],"url":"https://huggingface.co/spaces","features":["AI 工具演示馆"],"access":"community","note":"社区演示各有使用规则","verified":true},{"name":"Bing Image Creator · 免费 AI 生图","provider":"Microsoft","category":"作图","categories":["作图"],"url":"https://www.bing.com/images/create","features":["免费 AI 生图"],"access":"free","note":"登录微软账号，额度与速度受限","verified":true},{"name":"Canva · AI 设计与海报","provider":"Canva","category":"作图","categories":["作图"],"url":"https://www.canva.com/","features":["AI 设计与海报"],"access":"free","note":"免费设计与有限 AI 额度","verified":true},{"name":"Adobe Firefly · AI 图像创作","provider":"Adobe","category":"作图","categories":["作图"],"url":"https://firefly.adobe.com/","features":["AI 图像创作"],"access":"trial","note":"免费试用额度有限","verified":true},{"name":"Photopea · 在线 PSD 修图","provider":"Photopea","category":"修图","categories":["修图"],"url":"https://www.photopea.com/","features":["在线 PSD 修图"],"access":"free","note":"在线免费编辑","verified":true},{"name":"Pixlr Editor · 高级图片编辑","provider":"Pixlr","category":"修图","categories":["修图"],"url":"https://pixlr.com/editor/","features":["高级图片编辑"],"access":"free","note":"免费基础功能","verified":true},{"name":"Pixlr Express · 快捷 AI 修图","provider":"Pixlr","category":"修图","categories":["修图"],"url":"https://pixlr.com/express/","features":["快捷 AI 修图"],"access":"free","note":"免费基础功能","verified":true},{"name":"remove.bg · 智能图片抠图","provider":"remove.bg","category":"修图","categories":["修图"],"url":"https://www.remove.bg/","features":["智能图片抠图"],"access":"free","note":"低清免费，高清需付费","verified":true},{"name":"Cleanup.pictures · 图片物体消除","provider":"Cleanup.pictures","category":"修图","categories":["修图"],"url":"https://cleanup.pictures/","features":["图片物体消除"],"access":"free","note":"免费版有分辨率限制","verified":true},{"name":"Upscale.media · AI 照片增强","provider":"Upscale.media","category":"修图","categories":["修图"],"url":"https://www.upscale.media/","features":["AI 照片增强"],"access":"free","note":"免费使用有次数限制","verified":true},{"name":"Pixelcut · AI 图片放大","provider":"Pixelcut","category":"修图","categories":["修图"],"url":"https://www.pixelcut.ai/image-upscaler","features":["AI 图片放大"],"access":"free","note":"提供免费放大","verified":true},{"name":"Pixelcut · AI 扩图","provider":"Pixelcut","category":"图生图","categories":["图生图"],"url":"https://www.pixelcut.ai/uncrop","features":["AI 扩图"],"access":"free","note":"每日免费额度有限","verified":true},{"name":"Pika · AI 视频创作","provider":"Pika","category":"视频","categories":["视频"],"url":"https://pika.art/","features":["AI 视频创作"],"access":"free","note":"每月免费积分有限","verified":true},{"name":"Clipchamp · 在线视频剪辑","provider":"Microsoft","category":"视频","categories":["视频"],"url":"https://clipchamp.com/en/video-editor/","features":["在线视频剪辑"],"access":"free","note":"基本视频编辑与1080p导出免费","verified":true},{"name":"CapCut · AI 视频剪辑","provider":"CapCut","category":"视频","categories":["视频"],"url":"https://www.capcut.com/features/free-ai-video-editor","features":["AI 视频剪辑"],"access":"free","note":"免费编辑，部分素材收费","verified":true},{"name":"Suno · AI 音乐生成","provider":"Suno","category":"音频","categories":["音频"],"url":"https://suno.com/","features":["AI 音乐生成"],"access":"free","note":"免费额度有限，不含商业使用权","verified":true},{"name":"ElevenLabs · AI 语音朗读","provider":"ElevenLabs","category":"音频","categories":["音频"],"url":"https://elevenlabs.io/text-to-speech","features":["AI 语音朗读"],"access":"free","note":"免费额度有限，商用需付费","verified":true},{"name":"TTSMaker · 免费文字转语音","provider":"TTSMaker","category":"音频","categories":["音频"],"url":"https://ttsmaker.com/","features":["免费文字转语音"],"access":"free","note":"有字数限制","verified":true},{"name":"ttsMP3 · 文字朗读 MP3","provider":"ttsMP3","category":"音频","categories":["音频"],"url":"https://ttsmp3.com/","features":["文字朗读 MP3"],"access":"free","note":"有每日字符限制","verified":true},{"name":"Gamma · AI 幻灯片","provider":"Gamma","category":"写作","categories":["写作"],"url":"https://gamma.app/","features":["AI 幻灯片"],"access":"free","note":"免费生成额度有限","verified":true},{"name":"Napkin AI · 文字转信息图","provider":"Napkin AI","category":"作图","categories":["作图"],"url":"https://www.napkin.ai/","features":["文字转信息图"],"access":"free","note":"免费额度有限","verified":true},{"name":"DeepL Write · AI 润色改写","provider":"DeepL","category":"写作","categories":["写作"],"url":"https://www.deepl.com/write","features":["AI 润色改写"],"access":"free","note":"免费版有功能限制","verified":true},{"name":"LanguageTool · 语法纠错","provider":"LanguageTool","category":"写作","categories":["写作"],"url":"https://languagetool.org/","features":["语法纠错"],"access":"free","note":"免费基础纠错","verified":true},{"name":"QuillBot · 文章改写","provider":"QuillBot","category":"写作","categories":["写作"],"url":"https://quillbot.com/paraphrasing-tool","features":["文章改写"],"access":"free","note":"免费基础改写","verified":true},{"name":"GitHub Copilot · AI 编程助手","provider":"GitHub","category":"编程","categories":["编程"],"url":"https://github.com/features/copilot","features":["AI 编程助手"],"access":"free","note":"免费版有月度额度限制","verified":true},{"name":"Google AI Studio · AI 模型试验","provider":"Google","category":"编程","categories":["编程"],"url":"https://aistudio.google.com/","features":["AI 模型试验"],"access":"free","note":"免费使用与地区限额","verified":true},{"name":"Excalidraw · 免费白板绘图","provider":"Excalidraw","category":"作图","categories":["作图"],"url":"https://excalidraw.com/","features":["免费白板绘图"],"access":"free","note":"无AI生成功能的免费白板","verified":true},{"name":"Figma · 在线 UI 设计","provider":"Figma","category":"作图","categories":["作图"],"url":"https://www.figma.com/","features":["在线 UI 设计"],"access":"free","note":"Starter 免费版有限制","verified":true},{"name":"Pixelcut · 免费 AI 文生图","provider":"Pixelcut","category":"作图","categories":["作图"],"url":"https://www.pixelcut.ai/ai-image-generator","features":["免费 AI 文生图"],"access":"free","note":"免费额度有限","verified":true}];
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
const EXTERNAL_FREE_TOOLS=[...ORIGINAL_GENERATION_SITES,...VERIFIED_FREE_MEDIA_TOOLS,...CURATED_FREE_TOOLS,...ROLEPLAY_MEDIA_TOOLS,...VERIFIED_ADDITIONAL_FREE_TOOLS,{"provider":"FurAI · Perchance.org","name":"FurAI 综合创作助手","category":"综合","categories":["综合","聊天","角色","作图","修图","视频","写作"],"url":"https://perchance.org/fur-ai","featured":true,"features":["多角色聊天","AI 作图","提示词优化","图生图编辑","图片增强","去除背景","图片转视频","图片压缩","图片工作室","角色记忆"],"note":"进入 FurAI 后选择其内部工具。部分图像与视频功能使用第三方服务，可能需要排队、授权或受额度限制。"},{"provider":"Duck.ai","name":"私密多模型聊天","category":"聊天","url":"https://duck.ai/"},{"provider":"Duck.ai","name":"免费 AI 作图与修改","category":"作图","url":"https://duck.ai/"},{"provider":"Perchance","name":"AI 角色聊天","category":"聊天","url":"https://perchance.org/ai-character-chat","categories":["聊天","角色"]},{"provider":"Perchance","name":"AI 文生图","category":"作图","url":"https://perchance.org/ai-text-to-image-generator"},{"provider":"Perchance","name":"写实照片","category":"作图","url":"https://perchance.org/ai-photo-generator"},{"provider":"Perchance","name":"角色形象","category":"角色","url":"https://perchance.org/ai-character-generator"},{"provider":"Perchance","name":"动漫作图","category":"作图","url":"https://perchance.org/ai-anime-generator"},{"provider":"Perchance","name":"人像生成","category":"作图","url":"https://perchance.org/ai-portrait-generator"},{"provider":"Perchance","name":"剧情场景","category":"写作","url":"https://perchance.org/ai-scenario-generator"},{"provider":"Perchance","name":"图片提示词","category":"作图","url":"https://perchance.org/ai-image-prompt"},{"provider":"Perchance","name":"Flux 提示词","category":"作图","url":"https://perchance.org/ai-image-prompt-generator"},{"provider":"Perchance","name":"AI 聊天","category":"聊天","url":"https://perchance.org/ai-chat"},{"provider":"Perchance","name":"故事生成","category":"写作","url":"https://perchance.org/ai-story-generator"},{"provider":"Perchance","name":"文字冒险 RPG","category":"互动","url":"https://perchance.org/ai-rpg"},{"provider":"Perchance","name":"社区视频生成","category":"视频","url":"https://perchance.org/ai-video-generator"},{"provider":"PerchanceAI","name":"文生图","category":"作图","url":"https://perchanceai.com/t/text-to-image"},{"provider":"PerchanceAI","name":"图生图","category":"修图","url":"https://perchanceai.com/t/img2img"},{"provider":"PerchanceAI","name":"照片编辑","category":"修图","url":"https://perchanceai.com/t/photo-editor"},{"provider":"PerchanceAI","name":"照片增强","category":"修图","url":"https://perchanceai.com/t/ai-photo-enhancer"},{"provider":"PerchanceAI","name":"图片转文字","category":"修图","url":"https://perchanceai.com/t/photo-to-text"},{"provider":"PerchanceAI","name":"故事写作","category":"写作","url":"https://perchanceai.com/t/story"},{"provider":"PerchanceAI","name":"AI 助手","category":"聊天","url":"https://perchanceai.com/c/askbuddy"},{"provider":"PerchanceAI","name":"角色扮演聊天","category":"聊天","url":"https://perchanceai.com/c/ai-roleplay-chat","categories":["聊天","角色"]},{"provider":"PerchanceAI","name":"对话训练","category":"聊天","url":"https://perchanceai.com/c/crush-chat","categories":["聊天","角色"]},{"provider":"PerchanceAI","name":"专业图片生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-image-professional"},{"provider":"PerchanceAI","name":"摄影图片生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-photo"},{"provider":"PerchanceAI","name":"像素画生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-pixel-art-generator"},{"provider":"PerchanceAI","name":"无缝纹理生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/texture-generator"},{"provider":"PerchanceAI","name":"角色参考图","category":"角色","url":"https://perchanceai.com/ai/en/generate/character-reference-sheet"},{"provider":"PerchanceAI","name":"产品创意","category":"写作","url":"https://perchanceai.com/t/product-idea-generator"},{"provider":"PerchanceAI","name":"简笔人物画","category":"作图","url":"https://perchanceai.com/t/stick-figure-generator"},{"provider":"PerchanceAI","name":"角色姓名","category":"写作","url":"https://perchanceai.com/t/1920s-name-generator"},{"provider":"PerchanceAI","name":"角色创建","category":"角色","url":"https://perchanceai.com/c/character-creator"},{"provider":"PerchanceAI","name":"故事协作","category":"写作","url":"https://perchanceai.com/c/story-weaver"},{"provider":"PerchanceAI","name":"剧情互动","category":"互动","url":"https://perchanceai.com/c/dating-sim-text-game"},{"provider":"PerchanceAI","name":"图片变换","category":"修图","url":"https://perchanceai.com/t/image-transform-with-seed"},{"provider":"PerchanceAI","name":"艺术图像","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-art-generator"},{"provider":"PerchanceAI","name":"图像变体","category":"作图","url":"https://perchanceai.com/ai/en/generate/image-to-image"},{"provider":"PerchanceAI","name":"AI 绘图","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-drawing-generator"},{"provider":"PerchanceAI","name":"真假 AI 游戏","category":"互动","url":"https://perchanceai.com/c/bot-or-human"},{"provider":"PerchanceAI","name":"魔法灯互动","category":"互动","url":"https://perchanceai.com/c/ask-a-genie"},{"provider":"PerchanceAI","name":"照片工具库","category":"修图","url":"https://perchanceai.com/ai/en/image"},{"provider":"PerchanceAI","name":"所有免费工具","category":"目录","url":"https://perchanceai.com/explore?focus=1"},{"provider":"PerchanceAI","name":"热门工具","category":"目录","url":"https://perchanceai.com/explore/list/top"},{"provider":"PerchanceAI","name":"图像生成目录","category":"目录","url":"https://perchanceai.com/explore?category=image-generators"},{"provider":"PerchanceAI","name":"照片编辑目录","category":"目录","url":"https://perchanceai.com/explore?category=photo-editing"},{"provider":"PerchanceAI","name":"肖像工具目录","category":"目录","url":"https://perchanceai.com/explore?category=portrait"},{"provider":"PerchanceAI","name":"动漫工具目录","category":"目录","url":"https://perchanceai.com/explore?category=anime"},{"provider":"PerchanceAI","name":"长篇写作目录","category":"目录","url":"https://perchanceai.com/explore?category=prose_writing"},{"provider":"PerchanceAI","name":"写作工具目录","category":"目录","url":"https://perchanceai.com/explore?category=writing"},{"provider":"PerchanceAI","name":"角色互动目录","category":"目录","url":"https://perchanceai.com/explore?category=roleplay"},{"provider":"PerchanceAI","name":"AI 助手目录","category":"目录","url":"https://perchanceai.com/explore?type=assistants"},{"provider":"PerchanceAI","name":"命名工具目录","category":"目录","url":"https://perchanceai.com/explore?category=name_generator"},{"provider":"Perchance","name":"更多社区生成器","category":"目录","url":"https://perchance.org/generators"},{"provider":"FURAI","name":"Velorum 世界观","category":"互动","url":"https://furai.space/"},{"provider":"Perchance","name":"角色聊天扩展版","category":"聊天","url":"https://perchance.org/ai-character-chat-extended","categories":["聊天","角色"]},{"provider":"Perchance","name":"AI 现代聊天","category":"聊天","url":"https://perchance.org/ai-chat-modern"},{"provider":"Perchance","name":"AI 群组聊天","category":"聊天","url":"https://perchance.org/ai-group-chat","categories":["聊天","角色"]},{"provider":"Perchance","name":"角色扮演聊天 V2","category":"聊天","url":"https://perchance.org/ai-chat-roleplay-v2","categories":["聊天","角色"]},{"provider":"Perchance","name":"自由提问 AI","category":"聊天","url":"https://perchance.org/ask-ai"},{"provider":"Perchance","name":"人物性格与背景","category":"角色","url":"https://perchance.org/ai-character-description"},{"provider":"Perchance","name":"AI 人物照片","category":"作图","url":"https://perchance.org/ai-human-generator"},{"provider":"Perchance","name":"世界观生成","category":"写作","url":"https://perchance.org/ai-generated-hierarchical-world"},{"provider":"Perchance","name":"故事大纲","category":"写作","url":"https://perchance.org/ai-story-outline"},{"provider":"Perchance","name":"剧情情节生成","category":"写作","url":"https://perchance.org/ai-plot-generator"},{"provider":"Perchance","name":"文章改写","category":"写作","url":"https://perchance.org/ai-text-rewriter"},{"provider":"Perchance","name":"AI 文本生成","category":"写作","url":"https://perchance.org/ai-text-generator"},{"provider":"Perchance","name":"睡前故事","category":"写作","url":"https://perchance.org/ai-bedtime-story"},{"provider":"Perchance","name":"同人故事","category":"写作","url":"https://perchance.org/ai-fanfic-generator"},{"provider":"Perchance","name":"电影剧本","category":"写作","url":"https://perchance.org/ai-script-generator"},{"provider":"Perchance","name":"标题创作","category":"写作","url":"https://perchance.org/ai-title-generator"},{"provider":"Perchance","name":"诗歌创作","category":"写作","url":"https://perchance.org/ai-poem-generator"},{"provider":"Perchance","name":"歌词创作","category":"写作","url":"https://perchance.org/ai-lyrics-generator"},{"provider":"Perchance","name":"说唱歌词","category":"写作","url":"https://perchance.org/ai-rap-lyrics-generator"},{"provider":"Perchance","name":"AI 代码生成","category":"编程","url":"https://perchance.org/ai-code-generator"},{"provider":"Perchance","name":"AI 文字冒险","category":"互动","url":"https://perchance.org/ai-text-adventure"},{"provider":"Perchance","name":"高级 AI 绘图","category":"作图","url":"https://perchance.org/ai-art-generator-advanced"},{"provider":"Perchance","name":"多风格对比","category":"作图","url":"https://perchance.org/multiple-style-tester"},{"provider":"Perchance","name":"图片构图工具","category":"作图","url":"https://perchance.org/imageconstructor"},{"provider":"Perchance","name":"文本转音频","category":"音频","url":"https://perchance.org/ai-text-to-audio"},{"provider":"Perchance","name":"图片重绘","category":"修图","url":"https://perchance.org/urvillain-imagine"},{"provider":"Perchance","name":"兽人角色生成","category":"角色","url":"https://perchance.org/ai-furry-generator"},{"provider":"Perchance","name":"AI 互动问答","category":"互动","url":"https://perchance.org/question-this"},{"provider":"Perchance","name":"Story Forge 创作","category":"写作","url":"https://perchance.org/c0d3-story-forge"},{"provider":"Perchance","name":"最近更新工具","category":"目录","url":"https://perchance.org/recently-updated-generators-megalist"},{"provider":"Perchance","name":"Perchance 完整精选目录","category":"目录","url":"https://perchance.org/perlist"},{"provider":"Perchance AI","name":"智能更换背景","category":"修图","url":"https://perchanceai.com/t/background-changer"},{"provider":"Perchance AI","name":"车辆外观重设计","category":"修图","url":"https://perchanceai.com/t/car-redesigner"},{"provider":"Perchance AI","name":"AI 提示词生成","category":"写作","url":"https://perchanceai.com/t/prompt"},{"provider":"Perchance AI","name":"照片动漫化","category":"修图","url":"https://perchanceai.com/t/anime-me"},{"provider":"Perchance AI","name":"照片雪景效果","category":"修图","url":"https://perchanceai.com/t/snow-effect-photo-editor"},{"provider":"Perchance AI","name":"虚拟陪伴对话","category":"聊天","url":"https://perchanceai.com/c/virtual-mom","categories":["聊天","角色"]},{"provider":"Perchance AI","name":"Mean Girl 角色对话","category":"聊天","url":"https://perchanceai.com/c/mean-girl","categories":["聊天","角色"]},{"provider":"Perchance AI","name":"Kayla 角色对话","category":"聊天","url":"https://perchanceai.com/c/kayla","categories":["聊天","角色"]},{"provider":"Perchance AI","name":"Verity 角色对话","category":"聊天","url":"https://perchanceai.com/c/verity","categories":["聊天","角色"]},{"provider":"Perchance AI","name":"互动语言老师","category":"互动","url":"https://perchanceai.com/c/unhinged-language-teacher"},{"provider":"Perchance AI","name":"毛利文化 AI 聊天","category":"互动","url":"https://perchanceai.com/c/maori-culture-chat"},{"provider":"Perchance AI","name":"Nico 角色对话","category":"聊天","url":"https://perchanceai.com/c/nico","categories":["聊天","角色"]}];
const FREE_TOOL_CATEGORIES=["全部","综合","聊天","角色","作图","图生图","视频","修图","写作","互动","编程","音频","目录"];
const FREE_ACCESS_LABELS={free:"基础免费",daily:"定期免费额度",trial:"免费试用",community:"社区免费"};

function freeToolsFilters(){
 const list=$("freeToolFilters"),x=list.scrollLeft;list.replaceChildren();
 for(const label of FREE_TOOL_CATEGORIES){
  const b=node("button","free-filter"+(label===S.freeToolsCategory?" active":""));
  b.type="button";b.textContent=label;b.setAttribute("aria-pressed",String(label===S.freeToolsCategory));
  b.addEventListener("click",()=>{S.freeToolsCategory=label;renderFreeTools();list.querySelector(".free-filter.active")?.scrollIntoView({block:"nearest",inline:"nearest"})});
  list.append(b);
 }
 list.scrollLeft=x;
}
function renderFreeTools(){
 freeToolsFilters();
 const search=$("freeToolsSearch").value.trim().toLowerCase(),category=S.freeToolsCategory,seen=new Set(),list=$("freeToolsList");
 list.replaceChildren();
 const hits=EXTERNAL_FREE_TOOLS.filter(item=>{
  const categories=Array.isArray(item.categories)?item.categories:[item.category];
  if(category!=="全部"&&!categories.includes(category))return false;
  if(search&&![item.name,item.provider,item.category,...categories,...(item.features||[])].some(x=>String(x||"").toLowerCase().includes(search)))return false;
  // A directory entry is always a real HTTPS destination, never an internal chat action.
  let key;try{const u=new URL(item.url);if(u.protocol!=="https:")return false;key=u.href}catch{return false}
  if(seen.has(key))return false;
  seen.add(key);return true;
 });
 // Each category starts with the exact upstream sites used by this website.
 const originalRank=new Map(ORIGINAL_GENERATION_SITES.map((item,index)=>[item.url,index]));
 hits.sort((a,b)=>{
  const ar=originalRank.has(a.url)?originalRank.get(a.url):Infinity;
  const br=originalRank.has(b.url)?originalRank.get(b.url):Infinity;
  if(ar!==br)return ar-br;
  return category==="角色"
   ?Number(Boolean(b.roleLabel))-Number(Boolean(a.roleLabel))||Number(Boolean(b.verified))-Number(Boolean(a.verified))
   :Number(Boolean(b.verified))-Number(Boolean(a.verified));
 });
 for(const item of hits){
  const a=node("a","free-tool-card");
  a.href=item.url;a.target="_blank";a.rel="noopener noreferrer";
  const functions=Array.isArray(item.features)&&item.features.length?item.features:[item.category];
  a.title=item.name+" · "+functions.join(" · ");
  a.setAttribute("aria-label",item.name+"，"+functions.join("、")+"，打开外部网站");
  const parts=String(item.name||"").split(/\s*·\s*/);
  const shortName=parts.length>1?parts.shift().trim():String(item.name||"");
  const shortFunction=item.roleLabel||(parts.length?parts.join(" · ").trim():(item.category||functions[0]));
  const graphic=node("span","free-tool-icon");graphic.setAttribute("aria-hidden","true");
  const glyph=({聊天:"message-circle",综合:"blocks",作图:"image",图生图:"image",视频:"video",修图:"palette",角色:"circle-user",写作:"square-pen",互动:"zap",编程:"code-2",音频:"audio-lines",目录:"blocks"})[item.category]||"blocks";
  const fallback=iconSlot(glyph);fallback.classList.add("free-tool-icon-fallback");graphic.append(fallback);
  try{
   const domain=item.url?new URL(item.url).hostname:null;
   if(domain){
   const logo=node("img","free-tool-logo");
   logo.width=32;logo.height=32;logo.alt="";logo.loading="lazy";logo.decoding="async";logo.referrerPolicy="no-referrer";
   logo.addEventListener("load",()=>{if(logo.naturalWidth>=8)graphic.classList.add("has-logo")},{once:true});
   logo.addEventListener("error",()=>logo.remove(),{once:true});
   logo.src="https://www.google.com/s2/favicons?domain="+encodeURIComponent(domain)+"&sz=64";
   graphic.append(logo);
   }
  }catch{}
  a.append(graphic,node("strong","free-tool-name",shortName),node("small","free-tool-function",shortFunction));
  a.title=item.name+" · "+functions.join(" · ")+(item.note?"\n"+item.note:"");
  list.append(a);
 }
 renderIcons(list);
 $("freeToolEmpty").hidden=hits.length>0;
}
function syncWorkspaceRoute(name){
 const hash=name?"#"+name:"";
 if(location.hash!==hash)history.replaceState(history.state,"",location.pathname+location.search+hash);
}
/* Top-level mode tabs are a single App Shell control, never a chat message or model control. */
function syncTopMode(){
 const chatting=!S.workMode&&!S.freeToolsMode,working=!!S.workMode;
 for(const [id,active] of [["topChat",chatting],["topWork",working]]){
  const button=$(id);button.classList.toggle("active",active);button.setAttribute("aria-selected",String(active));
 }
 $("headerChatModels").hidden=!chatting;
 $("headerMore").hidden=!chatting;
 $("headerNew").setAttribute("aria-label",working?"新建工作任务":"新建聊天");
 $("headerNew").title=working?"新建工作任务":"新建聊天";
}
function setFreeToolsMode(enabled){
 S.freeToolsMode=!!enabled;$("shell").classList.toggle("free-tools-active",S.freeToolsMode);
 if(enabled){
  S.workMode=false;$("workBoard").hidden=true;$("conversation").hidden=true;
  $("freeToolsBoard").hidden=false;$("composerArea").hidden=true;
  $("navFreeTools").classList.add("active");renderFreeTools();syncWorkspaceRoute("tools");
 }else{
  $("freeToolsBoard").hidden=true;$("composerArea").hidden=false;$("navFreeTools").classList.remove("active");
  if(!S.workMode){$("conversation").hidden=false;syncWorkspaceRoute("")}
 }
 closeMenu();syncHomeAmbient();syncTopMode();
}
function restoreWorkspaceRoute(){
 if(location.hash==="#tools")setFreeToolsMode(true);
 else if(location.hash==="#work")setWorkMode(true);
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
function setWorkMode(on){
 setFreeToolsMode(false);S.workMode=!!on;
 if(on){
  if(!S.workStages.length)resetWorkPlan();
  $("workConfig").open=false;renderWorkEditor();void loadCatalog();
  setComposerMode("text");$("conversation").hidden=true;$("workBoard").hidden=false;
  void wkConnections();
  $("prompt").placeholder="描述要完成的工作任务…";
  hideAttachMenu();$("toolTray").hidden=true;void fetchWorkTasks();syncWorkspaceRoute("work");
 }else{
  $("workBoard").hidden=true;$("conversation").hidden=false;hide("workModelDialog");
  $("prompt").placeholder="向 AI 提问…";syncWorkspaceRoute("");
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
  b.addEventListener("click",()=>void selectWorkTask(t.id));box.append(b);
 }
}
function renderWorkDetail(){
 const d=S.workDetail,task=d?.task,container=$("workDetail");
 container.hidden=!task;$("workEmpty").hidden=!!task;
 if(!task){$("workStepList").replaceChildren();$("workTitle").textContent="";$("workState").textContent="";$("workErrorSlot").replaceChildren();return;}
 $("workTitle").textContent=task.title;
 const failed=task.status==="paused",stageName=task.steps?.[task.nextStep]?.name||"当前阶段";
 $("workState").textContent=failed?"执行暂停 · "+stageName+"未完成，请选择可用模型再继续":workStatus(task);
 const errorSlot=$("workErrorSlot");errorSlot.replaceChildren();
 if(task.error){
  const details=node("details","work-error-detail"),summary=node("summary","",failed?"查看线路失败详情":"查看执行详情");
  details.append(summary,node("p","",task.error));errorSlot.append(details);
 }
 const progress=$("workProgress");progress.replaceChildren();
 for(let i=0;i<task.totalSteps;i++){
  const configured=task.steps?.[i],name=configured?.name||WORK_LABELS[i]||"步骤 "+(i+1);
  const item=node("span","work-progress-step"+(i<task.nextStep?" done":i===task.nextStep?" current":""),name);
  if(configured?.provider&&configured.provider!=="auto")item.title="执行："+(WORK_PROVIDER_NAMES[configured.provider]||configured.provider)+(configured.model?" / "+configured.model:"");
  progress.append(item);
 }
 const list=$("workStepList");list.replaceChildren();
 for(const step of d.steps||[]){
  const section=node("section","work-step");
  const header=node("div","work-step-head");
  header.append(node("strong","",step.phase),node("small","",step.provider==="free"?"免费自动":step.provider+(step.model&&step.model!==step.provider?" · "+step.model:"")));
  section.append(header,node("div","work-step-body",step.body));
  if(step.attempts?.length&&step.provider!=="free"){section.append(node("div","work-switch-note","已切换 "+step.attempts.length+" 条不可用线路，继续使用 "+step.provider))}
  list.append(section);
 }
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
  if(!S.workDetail&&S.workTasks.length&&!S.workTaskId&&S.workMode)void selectWorkTask(S.workTasks[0].id);
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
   attachments:S.attachments.map(x=>x.id),steps:S.workStages,routes:S.workRoutes,fallback:S.workFallback});
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
 a.href=url;a.download="AIGZT-"+d.task.title.replace(/[\\/:*?"<>|]/g,"_").slice(0,34)+".md";
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
  buffer+=decoder.decode(value,{stream:true});if(buffer.length>200000)throw Error("回复流格式异常");
  let end;while((end=buffer.indexOf("\n\n"))>=0){
   const packet=buffer.slice(0,end);buffer=buffer.slice(end+2);
   const data=packet.split("\n").find(line=>line.startsWith("data:"));if(!data)continue;
   let event;try{event=JSON.parse(data.slice(5).trim())}catch{continue}
   if(event.type==="delta"&&typeof event.text==="string")onDelta(event.text);
   else if(event.type==="error")throw Error(event.error||"回复中断");
   else if(event.type==="done")final=event;
  }
 }
 if(!final?.chatId||typeof final.reply!=="string")throw Error("回复中断，未收到完整结果");
 return final;
}
async function sendMessage(){
 if(S.workMode){await startWorkTask();return}
 if(S.busy)return;
 const submittedMode=S.composerMode;
 const prompt=$("prompt").value.trim();if(!prompt&&S.attachments.length===0)return;
 if(!S.user){show("authDialog");return}
 const freeVideo=submittedMode==="video"&&["freetext","freewan","freeloop"].includes(S.videoProvider);
 if(submittedMode==="video"&&!freeVideo){$("createPrompt").value=prompt;openVideoCreate();return}
 if(freeVideo&&!prompt){flashError("请输入视频描述");return}
 if(freeVideo&&S.videoProvider==="freetext"&&S.attachments.length){flashError("文生视频只接受文字，上传参考图请使用图生视频");return}
 if(submittedMode==="image"&&!prompt){flashError("请输入图片生成或修改描述");return}
 if(submittedMode==="image"&&S.miniToolChoice==="image-edit"&&!S.attachments.length){
  flashError("请先上传一张参考图");$("photosInput").click();return
 }
 if(freeVideo&&S.videoProvider!=="freetext"&&!S.attachments.some(a=>["image/jpeg","image/png","image/webp"].includes(a.type))){flashError("请先从左侧＋上传参考图");return}
 if(submittedMode==="image"&&S.attachments.length&&(S.attachments.length!==1||!["image/jpeg","image/png","image/webp"].includes(S.attachments[0]?.type))){
  flashError("图生图请只上传一张 JPG、PNG 或 WebP 参考图");return
 }
 if(submittedMode==="text"&&S.provider!=="free"&&!connected(S.provider)){
  openKeyPanel(S.provider);return;
 }
 const freeRoute=isFreeModel(S.provider,S.model);
 if(submittedMode==="text"&&!freeRoute&&!S.allowPaid){
  flashError(connected(S.provider)?"密钥已保存，请授权使用此服务商额度；无需再次填写密钥。":"此模型需要服务商密钥。");
  openKeyPanel(S.provider);return;
 }
 S.busy=true;$("sendBtn").disabled=true;hideWelcome();flashError("");
 const isNew=!S.chatId;
 const isFreeMessage=submittedMode==="text"&&S.provider==="free";
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
     requestAnimationFrame(()=>{
      scheduled=false;if(!active||!loading.isConnected)return;
      if(!pending)return;
      if(bubble.querySelector(".thinking-status")){bubble.classList.add("chat-revealing");bubble.replaceChildren()}
      const nearBottom=viewport.scrollHeight-viewport.scrollTop-viewport.clientHeight<140;
      bubble.textContent+=pending;pending="";
      if(nearBottom)viewport.scrollTop=viewport.scrollHeight;
     });
    };
    try{result=await apiChatStream({chatId:S.chatId,provider:S.provider,model:S.model,message:prompt,attachments:attached.map(x=>x.id),
      mode:S.code?"code":"general",replyLevel,creativeMode:S.creativeMode,projectId:S.activeProjectId,allowPaid:S.allowPaid,apiKey:undefined},onDelta);}
    finally{active=false;pending="";}
   }
  else if(isImageMessage){
   const reference=attached.find(x=>["image/jpeg","image/png","image/webp"].includes(x.type));
   result=await api("/api/chat/media",{chatId:S.chatId,projectId:S.activeProjectId,mode:"image",prompt,imageId:reference?.id});
  }
  else if(freeVideo){
   const img=attached.find(a=>["image/jpeg","image/png","image/webp"].includes(a.type));
   result=await api("/api/chat/media",{chatId:S.chatId,projectId:S.activeProjectId,mode:"video",provider:S.videoProvider,model:S.videoModel,imageId:img?.id,ratio:S.videoRatio,prompt});
   if(result.requestId)rememberVideoTask(S.videoProvider,S.videoModel,result.requestId);
  }
  else{
   if(submittedMode==="video"&&!connected("grok")){openKeyPanel("grok");throw Error("请先连接 Grok 密钥");}
   const confirmed=confirm("视频可能收费。确定使用自己的Grok API额度生成吗？");
   if(!confirmed)throw Error("已取消视频请求");
   result=await api("/api/chat/media",{chatId:S.chatId,projectId:S.activeProjectId,mode:"video",prompt,apiKey:undefined,confirmed});
   if(result.requestId)S.videoTask=result.requestId;
  }
  if(submittedMode==="text"&&result.provider==="free"&&S.provider!=="free"&&result.model==="free:auto"){
   setFreeDefault(false);rememberChatModelSelection();updateModelTitle();
  }
  if(loading.isConnected&&submittedMode==="text"&&!receivedStreamingText){setPortraitState(loading,"speaking");await revealCompletedReply(loading,result.reply)}
  if(loading.isConnected){
   S.chatId=result.chatId;
   if(result.userMessageId){sentRow.dataset.messageId=result.userMessageId;appendMessageCopy(sentRow,sentBody)}
   appendMessage("assistant",result.reply,result.usedModel||result.model||null,loading,Boolean(result.incomplete),result.assistantMessageId||null,false,0,result.usage||null);
    if(submittedMode==="text")setPortraitState(loading,"finished");
  }
  if(VOICE_CHAT_ENABLED&&submittedMode==="text"&&voiceSession.active&&voiceSession.pending){
   voiceSession.pending=false;voiceSession.lastReply=result.reply;$("voiceReply").textContent=result.reply;$("voiceReplay").disabled=false;
   if(!voiceSpeak(result.reply,null,true))sayStatus("本设备无法朗读，请手动点击开始说话");
  }
  await fetchChats();void fetchMe();
 }catch(e){
   setPortraitState(loading,"error");
   if(voiceSession.active&&voiceSession.pending){voiceSession.pending=false;sayStatus("回复未完成，请再次点击开始说话")}
  // Never mutate a sent question or silently restart a paid request.
  // Show status in the assistant reply; retain all streamed content.
  const bubble=loadingBubble,status=node("span","message-send-pending");
  if(streamedContent.trim()&&submittedMode==="text"){
   renderAssistantText(bubble,streamedContent);
   appendMessageCopy(loading,streamedContent);
  }else bubble.replaceChildren();
  const retry=messageTool("refresh-cw",isImageMessage?"重新作图":"手动重试",()=>{
   if(S.busy||S.workMode||S.freeToolsMode||!sentRow.isConnected)return;
   const input=$("prompt");
   if((input.value.trim()||S.attachments.length)&&!confirm("重新发送会替换当前未发送的草稿和附件，继续吗？"))return;
   if(isImageMessage&&S.composerMode!=="image")setComposerMode("image");
   if(freeVideo&&S.composerMode!=="video")setComposerMode("video");
   else if(!isImageMessage&&S.composerMode!=="text")setComposerMode("text");
   input.value=prompt;S.attachments=attached.slice();renderAttachments();
   loading.remove();sentRow.remove();settlePromptSize();void sendMessage();
  });
  const detail=humanError(e);
  status.append(node("span","",isImageMessage?"本次作图未完成":streamedContent.trim()?"回复中断，已保留收到的内容":detail),retry);
  if(!isImageMessage){
   const alternate=messageTool("layers","切换免费模型",()=>{
    if(S.busy||S.workMode||S.freeToolsMode)return;
    setFreeDefault(false);rememberChatModelSelection();updateModelTitle();
    if(S.composerMode!=="text")setComposerMode("text");
    if(!$("prompt").value.trim()){$("prompt").value=prompt;settlePromptSize()}
    $("prompt").focus();
   });
   status.append(alternate);
  }
  bubble.append(status);status.title=humanError(e);flashError("");
 }
 finally{if(imageTimer!==null)window.clearInterval(imageTimer);S.busy=false;$("sendBtn").disabled=false;if(voiceSession.active&&voiceSession.resumePending&&!voiceSession.pending&&!voiceSession.reading)voiceListen(true)}
}
async function loadCatalog(){
 if(S.loadedCatalog)return;
 $("modelCount").textContent="模型目录";
 try{
  const d=await api("/api/models");
  S.freeModels=(d.freeModels||[]).map(m=>({...m,provider:"free"}));
  S.remoteModels=(d.models||[]).map(m=>({...m,provider:"openrouter"}));
  S.loadedCatalog=true;
  if(S.workMode)workModelHints();
  const chinaCount=S.remoteModels.filter(m=>domesticGroupFor(m)).length;
   $("modelSummary").textContent="公开目录 "+S.remoteModels.length+" 个 · 国内 "+chinaCount+" 个 · 需对应 API 授权";
 }catch(e){
  $("modelSummary").textContent="免费自动";
  S.freeModels=[{id:"free:auto",name:"免费自动",provider:"free",type:"text",free:true}];
 }
 renderModels();
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
 const author=String(m.id||"").toLowerCase().split("/")[0];
 const provider=String(m.provider||"").toLowerCase();
 return CHINA_MODEL_GROUPS.find(group=>group.authors.includes(author)||group.api===provider)||null;
}
function renderChinaBrands(models){
 const target=$("modelRegionLinks"),chinese=S.source==="family:china"||S.source.startsWith("family:cn:");
 target.hidden=!chinese;if(!chinese)return;
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
  else if(group.api)button.addEventListener("click",()=>{hide("modelDialog");openKeyPanel(group.api)});
  else button.disabled=true;
  target.append(button);
 }
 target.dataset.renderSignature=signature;target.scrollLeft=previousScroll;
}
function allModels(){
 const result=[...S.freeModels,...S.remoteModels],seen=new Set(result.map(m=>m.provider+"\0"+m.id));
 for(const [provider,items] of Object.entries(S.connected)){
  for(const x of items){
   if(!x.id)continue;const key=provider+"\0"+x.id;
   if(seen.has(key))continue;
   result.push({id:x.id,name:x.name||x.id,provider,type:x.type||"text",free:!!x.free,ownKey:true});seen.add(key);
  }
 }
 return result;
}
function modelMatches(m){
 const query=S.query.trim().toLowerCase();
 const owner=domesticGroupFor(m);const t=(m.name+" "+m.id+" "+m.provider+" "+(m.description||"")+" "+(owner?.name||"")).toLowerCase();
 if(query&&!t.includes(query))return false;
 if(S.source.startsWith("family:")){
  const family=S.source.slice(7),id=(m.id+" "+m.name).toLowerCase();
  const re={gpt:/gpt|openai\/|\bo[1-9]-/,claude:/claude|anthropic/,
   grok:/grok|x-ai\/|xai\//,gemini:/gemini|google\//,qwen:/qwen|alibaba|tongyi/,
   novai:/novai|nova-ai|novaiapi/,deepseek:/deepseek/,
   russian:/yandex|gigachat|giga-chat|sber|alice-ai|\.su\//};
  const groupMatch=family==="china"&&Boolean(owner)
   ||family.startsWith("cn:")&&owner?.id===family.slice(3)
   ||family==="russian"&&m.provider==="novai"
   ||family==="international"&&["openrouter","openai","claude","grok","gemini","groq","cerebras","novai","novai_pro"].includes(m.provider)
   ||re[family]?.test(id);
  if(!groupMatch)return false;
 }else if(S.source==="connected"&&!connected(m.provider))return false;
 else if(S.source!=="all"&&m.provider!==S.source)return false;
 if(S.filter==="free"&&!m.free)return false;
 if(S.filter==="text"&&m.type!=="text")return false;
 if(S.filter==="image"&&m.type!=="image")return false;
 if(S.filter==="video"&&m.type!=="video")return false;
 if(S.filter==="code"&&!/cod(e|er|ing)|deepseek|qwen|gpt|claude|gemini|glm|devstral|starcoder/i.test(t))return false;
 return true;
}
function modelIsSelected(m){
 const via=m.availableWith==="openrouter-key"?"openrouter":m.provider;
 return m.type==="text"&&S.provider===via&&S.model===(via==="free"?"free:auto":m.id);
}
function renderModels(){
 updateChatActiveModel();
 const models=allModels();renderChinaBrands(models);
 const visible=models.filter(modelMatches);
 if(S.provider!=="free"&&!visible.some(modelIsSelected)){
  const active={id:S.model,name:S.modelTitle||S.model,provider:S.provider,type:"text",free:isFreeModel(S.provider,S.model)};
  if(modelMatches(active))visible.unshift(active);
 }
 visible.sort((a,b)=>Number(modelIsSelected(b))-Number(modelIsSelected(a)));
 const count=visible.length,shown=visible.slice(0,(S.modelPage+1)*30);
 $("modelCount").textContent=(S.source==="family:china"||S.source.startsWith("family:cn:")?"国内真实目录 · ":"")+count+" 个模型 · 当前："+(S.provider==="free"?"免费自动":WORK_PROVIDER_SHORT[S.provider]||S.provider);
 $("moreModels").hidden=count<=shown.length;
 const list=$("modelList"),viewKey=[S.source,S.filter,S.query].join("|");
 const signature=viewKey+"|"+S.provider+":"+S.model+"|"+shown.map(m=>m.provider+":"+m.id+":"+m.name+":"+m.type+":"+m.free+":"+Boolean(S.savedProviders[m.availableWith==="openrouter-key"?"openrouter":m.provider]?.verified)).join("|");
 if(list.dataset.renderSignature===signature&&list.querySelectorAll(".model-row").length===shown.length)return;
 const previousTop=list.dataset.viewKey===viewKey?list.scrollTop:0;
 list.replaceChildren();list.dataset.renderSignature=signature;list.dataset.viewKey=viewKey;
 if(!shown.length){list.append(node("p","hint",S.loadedCatalog?"暂无符合条件的模型，请切换筛选":"模型目录加载中；免费自动仍可使用"));return}
 for(const item of shown){
  const via=item.availableWith==="openrouter-key"?"openrouter":item.provider,selected=modelIsSelected(item);
  const row=node("div","model-row"+(selected?" selected":"")),info=node("div","model-info"),title=node("strong","",item.name||item.id);
  if(selected){row.setAttribute("aria-current","true");row.setAttribute("aria-label","当前聊天模型："+(item.name||item.id))}
  const saved=S.savedProviders[via],verified=!!saved?.verified;
  const tag=node("span","price-tag"+(item.free?" free":""),selected?"✓ 当前使用":via==="free"?"免费线路":verified?"已连接":saved?"待验证":item.free?"免费 · 需连接":"需连接");
  title.append(tag);
  const owner=domesticGroupFor(item);
  info.append(title,node("small","",via==="free"?"免费自动路由 · 实际上游模型可能变化":(owner?"中国模型 · "+owner.name+" · ":"")+"接入："+(WORK_PROVIDER_SHORT[via]||via)+" · ID："+item.id));
  const actionable=["text","image","video"].includes(item.type);
  const button=node("button","model-action",!actionable?"暂不支持":selected?"✓ 已选定":item.type!=="text"?"使用":via==="free"||verified?"选择":"连接");
  button.disabled=!actionable||selected;
  if(actionable)button.addEventListener("click",()=>setModel(item));
  row.append(info,button);list.append(row);
 }
 list.scrollTop=previousTop;
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
 if(S.savedProviders[name]&&S.connected[name]?.length<2){
  void api("/api/connections/"+name+"/models",{}).then(result=>{
   S.connected[name]=result.models||S.connected[name];
   if(S.source===name)renderModels();
  }).catch(e=>flashError(humanError(e)));
 }
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
function openModels(){
 $("modelSearch").value=S.query;$("modelFilter").value=S.filter;
 for(const el of els("#sourceChips .chip"))el.classList.toggle("active",el.dataset.source===S.source);
 show("modelDialog");renderModels();void loadCatalog();
 if(S.source==="family:china"||S.source.startsWith("family:cn:"))void loadConnectedDomesticCatalogs();
}
function openKeyPanel(provider){
 if(typeof provider==="string"&&$("keyProvider").querySelector('option[value="'+provider+'"]'))$("keyProvider").value=provider;
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
function ivOpen(img){
 const scope=img.closest(".draw-gallery,.messages,.media-preview,.result-list,#savedFiles,.work-board")||img.closest("dialog,.main")||document.body;
 const found=Array.from(scope.querySelectorAll("img")).filter(x=>x.getClientRects().length&&x.src&&!x.closest("#imageViewer,.sidebar,.brand-lockup"));
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
  if(!img||img.closest("#imageViewer,.sidebar,.brand-lockup")||!img.src||!img.getClientRects().length)return;
  // Images inside navigation or controls belong to those actions, not the media viewer.
  if(img.closest("a[href],button,[role='button']"))return;
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
  else if(e.touches.length===1){const t=e.touches[0];iv.touch={x:t.clientX,y:t.clientY,lx:t.clientX,ly:t.clientY,moved:false,pinch:false}}
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
 const img=node("img");img.alt="生成图片";img.loading="eager";img.className="draw-image-reveal";
 const ok=await new Promise(resolve=>{img.onload=()=>resolve(true);img.onerror=()=>resolve(false);img.src=url});
 if(!ok||!tile.picture.isConnected){tile.caption.textContent="图片加载失败";return false}
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
 tile.caption.textContent="仅当前页面显示 · 网站不保存";
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
async function drawTrackJob(id,tile,batch){
 for(let tries=0;tries<150&&!batch.cancelled;tries++){
  let waitMs=12000;
  try{
   const r=await api("/api/image/task/"+encodeURIComponent(id));
   if(batch.cancelled)return false;
   if(r.done){
    if(r.failed){tile.picture.textContent="生成失败";tile.caption.textContent=r.error||"作图服务暂不可用";return false}
    if(typeof r.image==="string")return await drawResult(tile,r.image);
    tile.picture.textContent="结果为空";tile.caption.textContent="作图服务未返回图片";return false;
   }
   tile.caption.textContent="正在生成";
   waitMs=Math.max(7000,Math.min(14000,Number(r.waitSeconds||12)*1000));
  }catch(e){
   tile.caption.textContent="本次查询暂时中断";
  }
  if(!await drawSleep(waitMs,batch.controller.signal))return false;
 }
 if(!batch.cancelled){tile.caption.textContent="任务未完成，请在当前页面继续尝试"}
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
 const tiles=Array.from({length:count},(_,i)=>drawTile(i+1,"准备生成",shape));
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
   failed++;tile.picture.textContent="未完成";tile.caption.textContent=humanError(error);
  }finally{
   tile.finishedAt=Date.now();finished++;
   if(!batch.cancelled&&S.drawBatch===batch)
    $("createStatus").textContent="已完成 "+finished+"/"+count+" 张 · 成功 "+success+" 张"+(failed?" · 失败 "+failed+" 张":"");
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
   $("createStatus").textContent="生成结束：成功 "+success+"/"+count+" 张"+(failed?" · 失败 "+failed+" 张":"");
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
function setCreationMode(mode){
 S.createMode=mode;
 const isImage=mode==="image";
 $("createDialogTitle").textContent=isImage?"免费作图":"视频创作";
 $("videoSettings").hidden=isImage;
 $("drawSettings").hidden=!isImage;
 $("drawResultSection").hidden=!isImage;
 $("drawCancel").hidden=!isImage||!S.drawBatch;
 $("drawElapsed").hidden=!isImage||!S.drawBatch&&$("drawElapsed").textContent==="00:00";
 $("createButton").textContent=isImage?"生成免费图片":"生成视频";
 if(!isImage)$("createPrompt").placeholder="描述想生成的视频：人物、场景、镜头、动作…";else $("createPrompt").placeholder="描述你要生成的图片…";
 $("createStatus").textContent="";$("mediaPreview").replaceChildren();$("refreshVideo").hidden=isImage||!S.videoTask;
}
function openCreate(){
 if(!S.user){show("authDialog");return}
 setCreationMode("image");show("createDialog");closeMenu();
}
function videoKeyPermitted(provider){
 if(provider==="freetext"||provider==="freewan"||provider==="freeloop")return true;
 const record=S.savedProviders[provider];return Boolean(record&&record.consent);
}
function videoStorageKey(provider){return "aigzt:video-task:"+S.user.id+":"+provider}
function rememberVideoTask(provider,model,id){
 if(!S.user||!VIDEO_OPTIONS[provider]?.includes(model)||!/^[A-Za-z0-9_-]{4,160}$/.test(id))return;
 S.videoTask=id;S.videoTaskProvider=provider;
 try{sessionStorage.setItem(videoStorageKey(provider),JSON.stringify({id,model,at:Date.now()}))}catch{}
}
function restoreVideoTask(){
 S.videoTask=null;S.videoTaskProvider=S.videoProvider;
 if(!S.user)return;
 try{
  const raw=sessionStorage.getItem(videoStorageKey(S.videoProvider));
  const record=raw?JSON.parse(raw):null;
  if(record&&VIDEO_OPTIONS[S.videoProvider].includes(record.model)&&/^[A-Za-z0-9_-]{4,160}$/.test(record.id)){
   S.videoTask=record.id;return;
  }
  // Compatibility with the original Grok session task; never read it under another provider.
  if(S.videoProvider==="grok"){
   const old=sessionStorage.getItem("aigzt:video-task:"+S.user.id);
   if(typeof old==="string"&&/^[A-Za-z0-9_-]{4,160}$/.test(old))S.videoTask=old;
  }
 }catch{}
}
function syncVideoSelector(){
 for(const el of els("#videoModelGrid [data-video-provider][data-video-model]")){
  const active=el.dataset.videoProvider===S.videoProvider&&el.dataset.videoModel===S.videoModel;
  el.classList.toggle("selected",active);el.setAttribute("aria-pressed",String(active));
  const badge=el.querySelector(".video-card-status"),provider=el.dataset.videoProvider;
  if(badge)badge.textContent=provider==="freetext"||provider==="freewan"||provider==="freeloop"?"免费额度":videoKeyPermitted(provider)?"已授权":connected(provider)?"未授权":"需绑定";
 }
 for(const el of els("#videoRatio [data-ratio]")){
  const active=el.dataset.ratio===S.videoRatio;
  el.classList.toggle("active",active);el.setAttribute("aria-pressed",String(active));
  el.disabled=S.videoProvider==="grok"||S.videoProvider==="freewan"||S.videoProvider==="freeloop";
 }
 const provider=S.videoProvider,free=provider==="freetext"||provider==="freewan"||provider==="freeloop",connectedKey=free||connected(provider),allowed=videoKeyPermitted(provider);
 $("videoConnectedStatus").textContent=free?"共享免费 ZeroGPU：额度随上游变化，已用完时不会转付费":
  allowed?"已授权 "+VIDEO_PROVIDER_NAMES[provider]+" API（提交才可能计费）":
  connectedKey?"已保存 "+VIDEO_PROVIDER_NAMES[provider]+" 密钥，但未授权调用":"未连接 "+VIDEO_PROVIDER_NAMES[provider]+" API Key";
 $("videoConnectKey").hidden=free;
 $("videoConfirmRow").hidden=free;
 $("videoImageRow").hidden=!free;
 $("videoModelInfo").textContent=free?(provider==="freetext"?"仅文字生成视频。需要参考图片请切换图生视频。":provider==="freewan"?"图生视频约 3 秒。上传一张图片，生成后保存在本人账号媒体中。":"首尾帧约 2 秒。默认使用同一张图片作为首尾帧。"):
  provider==="grok"?"Grok Imagine：固定 6 秒、720p；以 xAI 账号实际计费为准。":
  provider==="runway"?"Runway 多模型 API：按照所选视频模型和时长计费。":
  provider==="luma"?"Luma Dream Machine：画质、时长由服务商支持的参数和额度决定。":
  "Vidu 视频 API：默认 5 秒、720p，按服务商实际积分计费。";
 $("refreshVideo").hidden=!S.videoTask||S.videoTaskProvider!==provider;
 $("createButton").textContent=free?"免费生成视频":allowed?"提交视频任务":"先连接并授权 API Key";
}
function selectVideoModel(provider,model){
 if(!VIDEO_OPTIONS[provider]?.includes(model))return;
 S.videoProvider=provider;S.videoModel=model;S.videoRatio=provider==="grok"?"16:9":S.videoRatio;
 $("confirmVideo").checked=false;
 try{if(S.user)sessionStorage.setItem("aigzt:video-selection:"+S.user.id,JSON.stringify({provider,model,ratio:S.videoRatio}))}catch{}
 restoreVideoTask();$("mediaPreview").replaceChildren();$("createStatus").textContent="";
 syncVideoSelector();updateComposerModel();syncMiniTools();
 if(S.videoTask)$("createStatus").textContent="此服务商有一条已保存的视频任务，可以查询状态。";
}
function openVideoCreate(){
 if(!S.user){show("authDialog");return}
 try{
  const prev=JSON.parse(sessionStorage.getItem("aigzt:video-selection:"+S.user.id)||"null");
  if(prev&&VIDEO_OPTIONS[prev.provider]?.includes(prev.model)){
   S.videoProvider=prev.provider;S.videoModel=prev.model;
   S.videoRatio=prev.ratio==="9:16"?"9:16":"16:9";
  }
 }catch{}
 restoreVideoTask();setCreationMode("video");syncVideoSelector();show("createDialog");closeMenu();
 if(S.videoTask)$("createStatus").textContent="上一条视频任务可继续查询状态。";
 if(!S.videoImageId){const attached=S.attachments.find(x=>x.type?.startsWith("image/"));if(attached)S.videoImageId=attached.id;}
 $("videoImageName").textContent=S.videoImageId?"已选择参考图片":"文字生成可不上传；图生视频需要 JPG、PNG 或 WebP 图片";
}
async function generateMedia(){
 if(!S.user){show("authDialog");return}
 if(S.createMode==="image"){await runFreeDraw();return}
 const prompt=$("createPrompt").value.trim();
 if(!prompt){$("createStatus").textContent="请填写视频画面描述";return}
 const provider=S.videoProvider,model=S.videoModel;
 if(!VIDEO_OPTIONS[provider]?.includes(model)){$("createStatus").textContent="请选择有效的视频模型";return}
 const free=provider==="freetext"||provider==="freewan"||provider==="freeloop";
 if(free&&provider!=="freetext"&&!S.videoImageId){$("createStatus").textContent="请先上传一张人物或场景图片";return}
 if(!free&&!videoKeyPermitted(provider)){
  $("createStatus").textContent="需要先保存并授权 "+VIDEO_PROVIDER_NAMES[provider]+" 个人 API 额度";
  S.videoPendingKeyReturn=true;hide("createDialog");openKeyPanel(provider);return;
 }
 if(!free&&!$("confirmVideo").checked){$("createStatus").textContent="请先勾选费用确认";return}
 const btn=$("createButton");btn.disabled=true;$("refreshVideo").hidden=true;$("mediaPreview").replaceChildren();
 $("createStatus").textContent="正在向 "+VIDEO_PROVIDER_NAMES[provider]+" 提交视频任务…";
 try{
  const response=await api("/api/video",{provider,model,prompt,ratio:S.videoRatio,confirmed:!free,imageId:free?S.videoImageId:undefined});
  if(!response.requestId)throw Error(free?"免费来源未返回任务编号":"视频 API 未返回任务编号，可能已经扣费，请到服务商后台核查");
  rememberVideoTask(provider,model,response.requestId);
  $("createStatus").textContent=free?"已提交免费任务。点击「查询视频任务」查看生成进度；额度不足时不会转收费模型。":"视频任务已提交。点击「查询视频任务」查看进度（无自动请求）。";
  $("refreshVideo").hidden=false;$("confirmVideo").checked=false;
 }catch(e){$("createStatus").textContent=free?"视频暂未生成："+humanError(e):"视频提交未确认："+humanError(e)+"。如果已扣费，请到服务商后台查任务，勿立即重复提交。"}
 finally{btn.disabled=false;syncVideoSelector()}
}
async function queryVideo(){
 const provider=S.videoTaskProvider,id=S.videoTask;
 if(!S.user||!id||!VIDEO_OPTIONS[provider]||!videoKeyPermitted(provider))return;
 $("refreshVideo").disabled=true;$("createStatus").textContent="查询视频任务状态…";
 try{
  const response=await api("/api/video/status",{provider,requestId:id});
  if(S.videoTask!==id||S.videoTaskProvider!==provider)return;
  $("createStatus").textContent=response.status==="completed"?(response.temporaryUrl?"视频生成完成（第三方下载链接可能过期）":"视频已保存到你的媒体空间"):
   response.status==="failed"?"服务商生成失败，可查看账户中的任务详情":"视频仍在排队或生成中，稍后手动查询即可。";
  if(response.url){
   const video=node("video");video.controls=true;video.playsInline=true;video.src=response.url;video.preload="metadata";
   const link=node("a","","打开或保存视频");link.href=response.url;link.target="_blank";link.rel="noopener noreferrer";
   $("mediaPreview").replaceChildren(video,link);$("refreshVideo").hidden=true;
  }else $("refreshVideo").hidden=response.status==="failed";
 }catch(e){$("createStatus").textContent="视频任务查询失败："+humanError(e)}
 finally{$("refreshVideo").disabled=false}
}
const oauthBase64=(b)=>btoa(Array.from(b,x=>String.fromCharCode(x)).join("")).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"");
async function beginOpenRouterOAuth(){
 if(!S.user){show("authDialog");return}
 const verifier=oauthBase64(crypto.getRandomValues(new Uint8Array(32)));
 const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(verifier)));
 const state=oauthBase64(crypto.getRandomValues(new Uint8Array(16)));
 sessionStorage.setItem("aigzt:or-pkce",JSON.stringify({verifier,state,created:Date.now()}));
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
 if(!S.user){flashError("请先登录 AIGZT 后重新授权 OpenRouter");return}
 try{
  const result=await api("/api/openrouter/exchange",{code,verifier:saved.verifier});
  const d=await api("/api/connections",{provider:"openrouter",apiKey:result.key,consent:false});
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
 if(!confirm("确定退出当前 AIGZT 账号？聊天记录会保存在你的云端。"))return;
 try{await api("/api/logout",{});S.user=null;S.quota=null;S.chats=[];S.chatId=null;++S.workEpoch;S.workBusy=false;S.keys={};S.connected={};S.savedProviders={};S.connectionsLoaded=false;S.connectionsLoading=false;S.freeToolsMode=false;S.freeToolsCategory="全部";restoredChatModelOwner=null;setFreeDefault(false);S.workTasks=[];S.workDetail=null;S.workTaskId=null;setWorkMode(false);renderWorkDetail();renderWorkTasks();S.projects=[];S.activeProjectId=null;S.notes=[];newChat();setAuthUI();renderHistory();renderProjects()}
 catch(e){flashError("退出失败："+humanError(e))}
}
async function verifyKey(event){
 event.preventDefault();
 if(!S.user){show("authDialog");return}
 const p=$("keyProvider").value,key=$("personalKey").value.trim();
 if(!key){if(S.savedProviders[p]){await useSavedConnection();return}$("keyStatus").textContent="请先从官方页面获取 API Key";return}
 const submit=event.submitter||$("keyForm").querySelector('[type="submit"]');
 if(submit)submit.disabled=true;
 $("keyStatus").textContent="验证连接中…";
 try{
  const manualModel=$("manualModel").value.trim();
  const data=await api("/api/connections",{provider:p,apiKey:key,model:manualModel||undefined,consent:$("allowPaid").checked});
  const rec=data.connection;
  if(!rec)throw Error("密钥保存失败");
  S.savedProviders[p]={model:rec.model||"",consent:!!rec.consent,verified:!!rec.verified,updatedAt:rec.updatedAt};
  if(VIDEO_ONLY_PROVIDERS.has(p))delete S.connected[p];else S.connected[p]=Array.isArray(data.models)?data.models:[];
  delete S.keys[p];
  if(rec.model&&!VIDEO_ONLY_PROVIDERS.has(p)&&!S.videoPendingKeyReturn){
   S.provider=p;S.model=rec.model;
   S.modelTitle=p+" · "+(S.connected[p].find(m=>m.id===rec.model)?.name||rec.model);
   S.selectedFree=isFreeModel(p,rec.model);
   rememberChatModelSelection();
  }
  if(!VIDEO_ONLY_PROVIDERS.has(p)&&!S.videoPendingKeyReturn)S.allowPaid=!!rec.consent;
  updateModelTitle();refreshSourceChips();
  refreshKeyPanel();$("keyStatus").textContent=rec.verified?"密钥已保存，下次打开直接使用":(data.warning||"密钥已保存，请选择官方模型 ID");
  if(VIDEO_ONLY_PROVIDERS.has(p)||S.videoPendingKeyReturn){
   $("keyStatus").textContent=rec.consent?"视频密钥已加密保存并授权，可以返回视频页面。":"视频密钥已保存，但尚未授权收费调用。";
   if(rec.consent){hide("keyDialog");if(S.videoPendingKeyReturn){S.videoPendingKeyReturn=false;openVideoCreate()}else if($("createDialog").open)syncVideoSelector()}
  }else if(rec.consent&&rec.verified&&rec.model){hide("keyDialog");$("prompt").focus()}
 }catch(e){$("keyStatus").textContent="连接失败："+humanError(e)}
 finally{if(submit)submit.disabled=false}
}
function syncInstalledPwaLayout(){
 const ios=/iPhone|iPad|iPod/i.test(navigator.userAgent);
 const installed=navigator.standalone===true||(ios&&window.matchMedia("(display-mode: standalone)").matches);
 document.documentElement.classList.toggle("aigzt-ios-pwa",ios&&installed);
}
function wire(){
 syncInstalledPwaLayout();
 wireDrawerGestures();
 window.addEventListener("hashchange",restoreWorkspaceRoute);
 $("menuBtn").addEventListener("click",openMenu);
 $("closeSide").addEventListener("click",closeMenu);$("sideShade").addEventListener("click",closeMenu);
 $("navChat").addEventListener("click",()=>{S.activeProjectId=null;S.archivedView=false;S.historyExpanded=false;newChat();void fetchChats();renderProjects()});
 $("historyToggle").addEventListener("click",()=>{S.historyExpanded=!S.historyExpanded;renderHistory()});
 $("projectsToggle").addEventListener("click",()=>{S.projectsExpanded=!S.projectsExpanded;renderProjects()});
 $("navModels").addEventListener("click",()=>{closeMenu();openModels()});
 $("navFreeTools").addEventListener("click",()=>setFreeToolsMode(true));
 $("navDraw").addEventListener("click",openCreate);
 $("freeToolsClose").addEventListener("click",()=>setFreeToolsMode(false));
 $("freeToolsSearch").addEventListener("input",renderFreeTools);
 $("navWork").addEventListener("click",()=>setWorkMode(true));
 $("navCode").addEventListener("click",startCoding);
 
 $("domesticProviderList");initDomesticProviderLinks();
 $("workClose").addEventListener("click",()=>setWorkMode(false));
 $("workNewTask").addEventListener("click",newWorkDraft);
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
  requestAnimationFrame(()=>{$("workModelDialog").scrollTop=0});
 });
 $("workAddStage").addEventListener("click",()=>{if(S.workStages.length<12){S.workStages.push({name:"新步骤",instruction:"",provider:"auto",model:""});renderWorkEditor()}});
 $("workAddRoute").addEventListener("click",()=>{if(S.workRoutes.length<20){S.workRoutes.push({provider:"free",model:"free:auto"});renderWorkEditor()}});
 $("workFallback").addEventListener("change",e=>{S.workFallback=e.target.checked});
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

 $("groqQuick").addEventListener("click",()=>{hide("modelDialog");openKeyPanel("groq")});
 $("imageQuick").addEventListener("click",()=>{hide("modelDialog");setComposerMode("image");$("toolTray").hidden=true;$("prompt").focus()});
 $("navFiles").addEventListener("click",()=>void openFiles());
 $("navKeys").addEventListener("click",()=>{closeMenu();openKeyPanel()});
 $("groqConnect").addEventListener("click",()=>openKeyPanel("groq"));
 $("newChat").addEventListener("click",newChat);
 $("headerMore").addEventListener("click",()=>openChatActions());
 $("headerChatModels").addEventListener("click",()=>{if(!S.workMode&&!S.freeToolsMode)openModels()});
 $("topChat").addEventListener("click",()=>{if(S.workMode)setWorkMode(false);else if(S.freeToolsMode)setFreeToolsMode(false);else syncTopMode()});
 $("topWork").addEventListener("click",()=>{if(!S.workMode)setWorkMode(true);else syncTopMode()});
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
 $("settingsOpenConnections").addEventListener("click",()=>{hide("settingsDialog");openKeyPanel()});
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
 $("searchForm").addEventListener("submit",e=>void searchChats(e));
 $("memoryForm").addEventListener("submit",e=>void saveNote(e));
 $("settingMemory").addEventListener("change",e=>{S.memoryEnabled=e.target.checked;void persistPrefs().catch(err=>flashError(humanError(err)))});
 $("settingRainbow").addEventListener("change",e=>{applyTheme(e.target.checked?"rainbow":"plain");void persistPrefs().catch(err=>flashError(humanError(err)))});
 $("archivedChats").addEventListener("click",()=>void listArchived());
 $("modelInstructionSave").addEventListener("click",()=>void saveModelInstruction());
 $("savedMessagesBtn").addEventListener("click",()=>void toggleSavedMessages());
 
 $("attachButton").addEventListener("click",()=>{$("attachMenu").hidden=!$("attachMenu").hidden;$("toolTray").hidden=true});
 $("cameraAction").addEventListener("click",()=>{hideAttachMenu();$("cameraInput").click()});
 $("photosAction").addEventListener("click",()=>{hideAttachMenu();$("photosInput").click()});
 $("filesAction").addEventListener("click",()=>{hideAttachMenu();$("attachmentInput").click()});
 $("toolsAction").addEventListener("click",()=>{hideAttachMenu();$("toolTray").hidden=!$("toolTray").hidden});
 for(const id of ["attachmentInput","cameraInput","photosInput"]){$(id).addEventListener("change",e=>{void uploadSelected(Array.from(e.target.files||[]));e.target.value=""})}
 $("imageMode").addEventListener("click",()=>{setComposerMode(S.composerMode==="image"?"text":"image");$("toolTray").hidden=true;$("prompt").focus()});
 $("videoMode").addEventListener("click",()=>{hideAttachMenu();$("toolTray").hidden=true;setComposerMode(S.composerMode==="video"?"text":"video");$("prompt").focus()});
 $("codeToggle").addEventListener("click",()=>{S.code=!S.code;$("codeToggle").classList.toggle("active",S.code);$("codeToggle").setAttribute("aria-pressed",String(S.code))});
 for(const [id,action] of [["miniImageEdit","image-edit"],["miniImageVideo","image-video"],["miniFrameVideo","frame-video"]]){
  $(id).addEventListener("click",()=>chooseMiniTool(action));
 }
 $("composerSwitchModel").addEventListener("click",()=>{hideAttachMenu();if(S.composerMode==="video")openVideoCreate();else if(S.composerMode==="image"){setComposerMode("text");$("prompt").focus()}else if(S.workMode)$("workModelChoose").click();else openModels()});
 $("chatForm").addEventListener("submit",e=>{e.preventDefault();hideAttachMenu();void sendMessage()});
 $("prompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){e.preventDefault();void sendMessage()}});
 $("prompt").addEventListener("input",settlePromptSize);
 $("prompt").addEventListener("blur",()=>{syncMobileHeight();settlePromptSize()});
 window.addEventListener("resize",syncMobileHeight);
 if(window.visualViewport)window.visualViewport.addEventListener("resize",syncMobileHeight)

 document.addEventListener("click",e=>{if(!$("attachMenu").hidden&&!$("attachMenu").contains(e.target)&&!$("attachButton").contains(e.target))hideAttachMenu()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")hideAttachMenu()});
 for(const btn of els("[data-close]"))btn.addEventListener("click",()=>hide(btn.dataset.close));
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
 $("disconnectProvider").addEventListener("click",()=>void removeSavedKey());
 $("modelSearch").addEventListener("input",e=>{S.query=e.target.value;S.modelPage=0;renderModels()});
 $("modelFilter").addEventListener("change",e=>{S.filter=e.target.value;S.modelPage=0;renderModels()});
 for(const btn of els("#sourceChips .chip"))btn.addEventListener("click",()=>activateSource(btn.dataset.source));
 $("moreModels").addEventListener("click",()=>{S.modelPage++;renderModels()});
 $("createButton").addEventListener("click",()=>void generateMedia());
 $("drawCancel").addEventListener("click",stopDrawBatch);
 drawPrefs();wireImageViewer();
 $("createDialog").addEventListener("close",()=>{
  stopDrawBatch();$("drawResults").replaceChildren();
  $("drawPrevious").replaceChildren();$("drawPreviousSection").hidden=true;
  $("drawElapsed").hidden=true;$("drawElapsed").textContent="00:00";
 });
 $("refreshVideo").addEventListener("click",()=>void queryVideo());
 for(const button of els("#videoModelGrid [data-video-provider][data-video-model]")){
  button.addEventListener("click",()=>selectVideoModel(button.dataset.videoProvider,button.dataset.videoModel));
 }
 for(const button of els("#videoRatio [data-ratio]")){
  button.addEventListener("click",()=>{if(S.videoProvider==="grok")return;S.videoRatio=button.dataset.ratio;
   $("confirmVideo").checked=false;syncVideoSelector();
  });
 }
 $("videoImageInput").addEventListener("change",async event=>{
  const file=event.target.files?.[0];if(!file)return;
  if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>7500000){
   $("createStatus").textContent="请选择 7.5 MB 内的 JPG、PNG 或 WebP 图片";return;
  }
  const form=new FormData();form.append("file",file);
  const name=$("videoImageName");name.textContent="正在上传图片…";
  try{
   const resp=await fetch("/api/files/upload",{method:"POST",credentials:"same-origin",body:form});
   const data=await resp.json().catch(()=>null);if(!resp.ok||!data?.ok)throw Error(data?.error||"图片上传失败");
   S.videoImageId=data.id;name.textContent=file.name;
   $("createStatus").textContent="";
  }catch(error){name.textContent="未选择图片";$("createStatus").textContent=humanError(error)}
  finally{event.target.value=""}
 });
 $("videoConnectKey").addEventListener("click",()=>{S.videoPendingKeyReturn=true;hide("createDialog");openKeyPanel(S.videoProvider)});
 $("keyDialog").addEventListener("close",()=>{S.videoPendingKeyReturn=false});
 if(VOICE_CHAT_ENABLED)voiceWire();
 wireDictation();wireReplyLevel();
}
function hideAttachMenu(){$("attachMenu").hidden=true}

document.addEventListener("DOMContentLoaded",async()=>{
 wire();renderIcons();applyChatTextSize(savedChatTextSize());let enabled=true;try{enabled=localStorage.getItem("aigzt:rainbow")!=="0"}catch{}
 applyTheme(enabled?"rainbow":"plain");syncHomeAmbient();setFreeDefault();resizePrompt();await fetchMe();await Promise.all([fetchProjects(),fetchChats(),fetchConnections(),fetchWorkTasks()]);await finishOpenRouterOAuth();
 restoreWorkspaceRoute();updateModelTitle();
});