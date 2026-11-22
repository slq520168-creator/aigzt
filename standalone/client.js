"use strict";
const S={
 user:null,quota:null,chats:[],chatId:null,model:"free:auto",
 modelTitle:"免费自动",provider:"free",keys:{},connected:{},selectedFree:true,connectionsLoaded:false,connectionsLoading:false,
 allowPaid:false,savedProviders:{},freeToolsMode:false,freeToolsCategory:"全部",historyExpanded:false,projectsExpanded:false,workMode:false,workBusy:false,workEpoch:0,workTasks:[],workDetail:null,workTaskId:null,workStages:[],workRoutes:[],workFallback:true,freeModels:[],freePoolRoutes:[],remoteModels:[],loadedCatalog:false,
 modelPage:0,source:"all",filter:"all",query:"",busy:false,code:false,
 authRegister:false,createMode:"image",drawBatch:null,videoTask:null,composerMode:"text",creativeMode:null,attachments:[],projects:[],activeProjectId:null,actionChatId:null,editProjectId:null,archivedView:false,memoryEnabled:true,notes:[],currentTheme:"rainbow"
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
 'message-circle':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
 compass:'<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
 paperclip:'<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 1 1 5.66 5.66L9.4 17.41a2 2 0 0 1-2.83-2.83l8.48-8.49"/>',
 link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
 'circle-user':'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="9" r="3"/><path d="M6 19a6 6 0 0 1 12 0"/>',
 settings:'<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="m19.4 15 .6 1-2 2-1-.6a2 2 0 0 0-2 .1L14 20h-4l-.5-2.5a2 2 0 0 0-2-.1l-1 .6-2-2 .6-1a2 2 0 0 0-.1-2L2.5 12v-2l2.5-.5a2 2 0 0 0 .1-2l-.6-1 2-2 1 .6a2 2 0 0 0 2-.1L10 2.5h4l.5 2.5a2 2 0 0 0 2 .1l1-.6 2 2-.6 1a2 2 0 0 0 .1 2l2.5.5v2l-2.5.5a2 2 0 0 0-.1 2Z"/>',
 folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
 'chevron-down':'<path d="m6 9 6 6 6-6"/>',
 ellipsis:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8" cy="7" r="1"/><circle cx="6.5" cy="12" r="1"/><path d="M12 22a10 10 0 1 1 10-10c0 2-1 3-3 3h-3a2 2 0 0 0-2 2 2 2 0 0 1-2 5"/>',
 camera:'<path d="M14 4h-4l-2 3H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4z"/><circle cx="12" cy="13" r="3"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
 blocks:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/>',
 'arrow-up':'<path d="m12 19 0-14m-7 7 7-7 7 7"/>',
 mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5m-5 0h10"/>',
 'brain-circuit':'<path d="M9 18a4 4 0 0 1-4-4 4 4 0 0 1 .3-1.5A4 4 0 0 1 7 5a4 4 0 0 1 5-1 4 4 0 0 1 5 1 4 4 0 0 1 1.7 7.5A4 4 0 0 1 15 18v2a2 2 0 0 1-4 0v-2"/><path d="M9 9v3m6-3v3"/>',
 video:'<rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3"/>',
 'code-2':'<path d="m8 17-5-5 5-5m8 10 5-5-5-5m-4-8-4 20"/>',
 pin:'<path d="m16 3 5 5-4 1-3 6-2 2-5-5 2-2 6-3zM5 19l6-6"/>',
 archive:'<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8M10 12h4"/>',
 trash:'<path d="M3 6h18m-2 0-.9 14H5.9L5 6m3 0V4h8v2m-6 4v7m4-7v7"/>',
 share:'<path d="M12 16V3m-5 5 5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/>'
};
/* Local two-tone professional vector icons, rendered consistently on all pages. */
const ICON_GRADIENTS={blue:["#4e78e6","#32b2c8"],teal:["#2498bd","#30c1a1"],violet:["#7662dc","#b374d9"],rose:["#b86dd8","#e47d9f"],amber:["#eaa143","#ee775c"],slate:["#6481bf","#619fc9"]};
const ICON_TONES={
 menu:"blue","panel-left":"blue",layers:"violet",zap:"amber","list-checks":"violet",x:"slate",plus:"teal",
 "square-pen":"blue",search:"teal","message-circle":"teal",compass:"teal",paperclip:"blue",link:"teal",
 "circle-user":"violet",settings:"slate",folder:"amber","chevron-down":"slate",ellipsis:"slate",
 palette:"rose",camera:"blue",image:"rose",blocks:"violet","arrow-up":"teal",mic:"teal",
 "brain-circuit":"violet",video:"rose","code-2":"blue",pin:"amber",archive:"slate",trash:"rose",
 share:"teal",download:"blue"
};
let iconGradientSerial=0;
function renderIcons(scope=document){
 const icons=[...scope.querySelectorAll("[data-icon]")];
 if(scope.matches?.("[data-icon]"))icons.unshift(scope);
 for(const el of icons){
  const name=el.dataset.icon,path=ICONS[name]||ICONS.folder;
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
 gemini:{url:"https://aistudio.google.com/apikey",name:"获取 Gemini 密钥"},
 qwen:{url:"https://modelstudio.console.alibabacloud.com/",name:"打开千问密钥控制台"},
 deepseek:{url:"https://platform.deepseek.com/api_keys",name:"获取DeepSeek密钥"},
 zhipu:{url:"https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys",name:"获取智谱 GLM密钥"},
 kimi:{url:"https://platform.kimi.com/",name:"获取Kimi密钥"},
 minimax:{url:"https://platform.minimaxi.com/",name:"获取MiniMax密钥"},
 siliconflow:{url:"https://cloud.siliconflow.cn/account/ak",name:"获取硅基流动密钥"},
 doubao:{url:"https://console.volcengine.com/ark/region:cn-beijing/apikey",name:"获取豆包 / 方舟密钥"},
 qianfan:{url:"https://console.bce.baidu.com/qianfan/overview",name:"获取百度千帆密钥"},
 hunyuan:{url:"https://console.cloud.tencent.com/hunyuan",name:"获取腾讯混元密钥"}
};
function connected(p){return !!(S.savedProviders[p]||S.keys[p])}
function refreshKeyPanel(){
 const provider=$("keyProvider").value,rec=S.savedProviders[provider],site=KEY_SITES[provider];
 const a=$("providerKeyLink");a.href=site.url;a.textContent=site.name;
 $("providerHelp").textContent=provider==="qwen"?"请选择新加坡地区的密钥。":
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
 $("manualModelWrap").hidden=provider==="openrouter"||provider==="gemini";
 $("allowPaid").checked=Boolean(rec?.consent);
 $("keyStatus").textContent=rec?(rec.verified?"密钥已加密保存 · 模型目录已验证":"密钥已加密保存 · 模型目录未验证"):"";
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
   if(item.model&&!S.connected[item.provider])S.connected[item.provider]=[{id:item.model,name:item.model}];
  }
  S.savedProviders=saved;S.connectionsLoaded=true;refreshSourceChips();if(S.workMode)renderWorkAgentCatalog();
  if(S.provider!=="free"&&!connected(S.provider))setFreeDefault(false);
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
function setFreeDefault(render=true){
 S.provider="free";S.model="free:auto";S.modelTitle="免费自动";S.allowPaid=false;S.selectedFree=true;
 if(render)updateModelTitle();
}
async function useSavedConnection(){
 const provider=$("keyProvider").value,entry=S.savedProviders[provider];
 if(!entry){$("keyStatus").textContent="请先保存密钥";return}
 const button=$("useSavedKey");button.disabled=true;
 try{
  let model=entry.model;
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
  updateModelTitle();hide("keyDialog");$("prompt").focus();
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
  if(S.provider===p){S.provider="free";S.model="free:auto";S.modelTitle="免费模型";S.allowPaid=false;updateModelTitle()}
  refreshKeyPanel();$("keyStatus").textContent="已断开";
 }catch(e){$("keyStatus").textContent=humanError(e)}
}

async function fetchMe(){
 try{const v=await api("/api/me");S.user=v.user;S.quota=v.quota;setAuthUI()}
 catch(e){flashError("账号状态读取失败："+humanError(e))}
}
function renderHistory(){
 const recent=$("history"),pinned=$("pinnedHistory"),pinHeading=$("pinHeading");
 recent.replaceChildren();pinned.replaceChildren();
 const rows=S.chats||[],showPinned=!S.archivedView&&rows.some(item=>!!item.pinned_at);
 const normal=rows.filter(item=>!showPinned||!item.pinned_at);
 $("historyHeading").textContent=S.archivedView?"已归档聊天":S.activeProjectId?"项目聊天":"最近聊天";
 $("navChat").hidden=!(S.activeProjectId||S.archivedView);
 $("chatCount").textContent=rows.length?String(rows.length):"";
 $("historyToggle").hidden=normal.length<=2;
 $("historyToggle").textContent=S.historyExpanded?"收起":"展开";
 $("historyToggle").setAttribute("aria-expanded",String(S.historyExpanded));
 pinHeading.hidden=!showPinned;pinned.hidden=!showPinned;
 if(!S.user){recent.append(node("div","hint","登录后查看聊天记录"));return}
 if(!rows.length){recent.append(node("div","hint",S.archivedView?"暂无归档聊天":"暂无聊天记录"));return}
 const makeRow=item=>{
  const row=node("div","history-row"+(S.chatId===item.id?" active":""));
  const select=node("button","history-select",item.title||"新对话");select.type="button";select.title=item.title||"";
  select.addEventListener("click",()=>void loadChat(item.id));
  const more=node("button","history-more");more.type="button";more.title="聊天操作";
  more.setAttribute("aria-label",(item.title||"聊天")+"的操作");more.append(iconSlot("ellipsis"));
  more.addEventListener("click",()=>openChatActions(item.id));row.append(select,more);renderIcons(row);return row;
 };
 if(showPinned)for(const item of rows.filter(x=>x.pinned_at))pinned.append(makeRow(item));
 for(const item of (S.historyExpanded?normal:normal.slice(0,2)))recent.append(makeRow(item));
}
async function fetchChats(){
 if(!S.user){S.chats=[];renderHistory();return}
 try{
  const url="/api/chats"+(S.activeProjectId?"?project="+encodeURIComponent(S.activeProjectId)+(S.archivedView?"&archived=1":""):S.archivedView?"?archived=1":"");
  const d=await api(url);S.chats=d.chats||[];renderHistory();
 }catch(e){flashError("聊天列表读取失败："+humanError(e))}
}
function renderProjects(){
 const box=$("projectsList");box.replaceChildren();box.hidden=!S.projectsExpanded;
 $("projectsToggle").setAttribute("aria-expanded",String(S.projectsExpanded));
 $("projectsToggle").classList.toggle("expanded",S.projectsExpanded);
 if(!S.user){if(S.projectsExpanded)box.append(node("div","hint","登录后创建项目"));return}
 for(const p of S.projects){
  const row=node("div","project-row"+(S.activeProjectId===p.id?" active":""));
  const b=node("button","project-select");b.append(iconSlot("folder"),node("span","project-name",p.name));b.title=p.name;
  b.addEventListener("click",()=>{S.activeProjectId=p.id;S.archivedView=false;newChat();void fetchChats();renderProjects()});
  const edit=node("button","project-edit");edit.title="项目设置";edit.setAttribute("aria-label","编辑项目");
  edit.append(iconSlot("ellipsis"));edit.addEventListener("click",()=>openProject(p));row.append(b,edit);box.append(row);renderIcons(row);
 }
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
 try{
  const d=await api("/api/memory");S.notes=d.notes||[];S.memoryEnabled=d.enabled;applyTheme(d.theme);
  $("settingMemory").checked=S.memoryEnabled;renderNotes();
 }catch(e){flashError(humanError(e))}
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

function renderImageJob(bubble,id){
 bubble.dataset.imageTask=id;
 const label=node("span","image-job-label","作图中 1秒");
 bubble.dataset.imageStart=String(Date.now());
 bubble.replaceChildren(label);
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
 if(!manual&&now-Number(bubble.dataset.lastImagePoll||0)<7000)return;
 bubble.dataset.imageBusy="1";bubble.dataset.lastImagePoll=String(now);
 let delay=10000;
 try{
  const r=await api("/api/image/task/"+id);
  if(!bubble.isConnected||bubble.dataset.imageTask!==id)return;
  if(Number.isFinite(r.startedAt)&&r.startedAt>0)bubble.dataset.imageStart=String(r.startedAt);
  if(r.done){
   delete bubble.dataset.imageTask;
   if(r.failed){bubble.replaceChildren(node("span","image-job-error","生成失败："+(r.error||"上游繁忙")));return}
   const img=node("img","chat-generated-image");img.src=r.image;img.alt="生成图片";img.loading="lazy";
   bubble.replaceChildren(img);return;
  }
  delay=Math.max(9000,Math.min(18000,Number(r.waitSeconds||10)*1000));
 }catch(e){/* 网络短暂故障仍保持秒数，后续继续查询 */}
 finally{
  bubble.dataset.imageBusy="0";if(!bubble.dataset.imageStart)bubble.dataset.imageStart=String(Date.now());
  if(bubble.isConnected&&bubble.dataset.imageTask===id&&Date.now()-Number(bubble.dataset.imageStart)<1860000)window.setTimeout(()=>void pollImageJob(bubble,id,false),delay);
 }
}

/* Format AI output as a single conversational reply. No model-supplied HTML is executed. */
function renderAssistantText(bubble,answer){
 const lines=String(answer||"").replace(/\r\n/g,"\n").split("\n");
 bubble.classList.remove("chat-revealing");bubble.replaceChildren();let paragraph=[],list=null,pre=null,code=null;
 function inline(target,value){
  const pattern=/(\*\*[^*]+\*\*|\x60[^\x60]+\x60)/g;
  let index=0,match;
  while((match=pattern.exec(value))){
   if(match.index>index)target.append(document.createTextNode(value.slice(index,match.index)));
   const raw=match[0],bold=raw.startsWith("**");
   target.append(node(bold?"strong":"code","",bold?raw.slice(2,-2):raw.slice(1,-1)));
   index=pattern.lastIndex;
  }
  if(index<value.length)target.append(document.createTextNode(value.slice(index)));
 }
 function flush(){
  if(paragraph.length){const p=node("p");inline(p,paragraph.join("\n"));bubble.append(p);paragraph=[]}
 }
 for(const original of lines){
  const line=original.trimEnd(),trim=line.trim();
  if(/^\x60{3}/.test(trim)){
   flush();list=null;
   if(pre){pre=null;code=null}
   else{pre=node("pre","chat-code");code=node("code");pre.append(code);bubble.append(pre)}
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

function appendMessage(role,content,model,existingRow=null){
 const row=existingRow||node("div","message "+role),bubble=existingRow?.querySelector(".bubble")||node("div","bubble");
 bubble.textContent=String(content||"");
 if(role==="assistant"){
  const icon=node("span","avatar-ai");icon.innerHTML="<svg viewBox=\"0 0 36 36\" width=\"34\" height=\"34\" aria-hidden=\"true\"><rect x=\"4\" y=\"6\" width=\"28\" height=\"27\" rx=\"12\" fill=\"#d6eef1\" stroke=\"#92c4ce\" stroke-width=\"1.2\"/><path d=\"M4 15C0 12 3 7 8 10M32 15c4-3 1-8-4-5\" fill=\"#b0d9e6\"/><circle cx=\"13\" cy=\"19\" r=\"2.3\" fill=\"#395e6c\"/><circle cx=\"23\" cy=\"19\" r=\"2.3\" fill=\"#395e6c\"/><path d=\"M14 26q4 3 8 0\" fill=\"none\" stroke=\"#496f77\" stroke-width=\"1.7\" stroke-linecap=\"round\"/><circle cx=\"8.5\" cy=\"25\" r=\"2.3\" fill=\"#f6b6c7\"/><circle cx=\"27.5\" cy=\"25\" r=\"2.3\" fill=\"#f6b6c7\"/><path d=\"M18 6V2\" stroke=\"#74aab6\" stroke-width=\"1.8\"/><circle cx=\"18\" cy=\"3\" r=\"2\" fill=\"#f7c975\"/></svg>";if(!existingRow)row.append(icon,bubble);
  const pending=String(content||"").match(/^\[\[aigzt:image-job:([0-9a-f-]{36})\]\]$/i);
  if(pending){bubble.replaceChildren();renderImageJob(bubble,pending[1])}
  const picture=String(content||"").match(/^!\[生成图片\]\((\/api\/files\/[0-9a-f-]{36})\)$/);
  if(picture){bubble.replaceChildren();const im=node("img","chat-generated-image");im.src=picture[1];im.alt="AI生成的图片";im.loading="lazy";bubble.append(im)}
  if(!pending&&!picture&&String(content||"").trim())renderAssistantText(bubble,content);

  if(model&&!/^free:(?:auto|vireonix|vexa|openrouter|groq|cehpoint)$|^(?:vireonix|vexa|groq)\/|^openrouter\/openrouter\/free(?:$|\b)/i.test(model))bubble.append(node("div","message-model",model));
 }else{
  const lines=String(content||"").split(/\n(?=\[文件：)/);
  if(lines.length>1){
   bubble.textContent=lines.shift();
   for(const line of lines){
    const f=line.match(/^\[文件：([^\]]+)\]\((\/api\/files\/[0-9a-f-]{36})\)$/);
    if(!f)continue;
    const a=node("a","chat-file",f[1]);a.href=f[2];a.target="_blank";a.rel="noopener";bubble.append(a);
    if(/\.(jpg|jpeg|png|webp|gif)$/i.test(f[1])){const img=node("img","chat-upload-image");img.src=f[2];img.alt=f[1];img.loading="lazy";bubble.append(img)}
   }
  }
  row.append(bubble);
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
 S.creativeMode=null;
 S.code=false;$("codeToggle").classList.remove("active");$("codeToggle").setAttribute("aria-pressed","false");
 if(S.freeToolsMode)setFreeToolsMode(false);
 if(S.workMode)setWorkMode(false);
 S.chatId=null;S.attachments=[];renderAttachments();setFreeDefault();setComposerMode("text");$("messageList").replaceChildren();showWelcome();
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
 S.creativeMode=null;
 if(S.freeToolsMode)setFreeToolsMode(false);
 if(S.workMode)setWorkMode(false);
 try{
  const v=await api("/api/chats/"+id);
  S.chatId=id;$("messageList").replaceChildren();hideWelcome();
  for(const m of v.messages)appendMessage(m.role,m.body,m.model);
  const c=S.chats.find(c=>c.id===id);
  if(c&&c.project_id!==undefined){S.activeProjectId=c.project_id||null;renderProjects()}
  if(c&&c.model&&c.provider){S.provider=["free","cloudflare"].includes(c.provider)?"free":c.provider;S.model=S.provider==="free"?"free:auto":c.model;S.modelTitle=S.provider==="free"?"免费自动":c.model;S.allowPaid=Boolean(S.savedProviders[S.provider]?.consent);S.selectedFree=isFreeModel(S.provider,S.model);updateModelTitle()}
  renderHistory();closeMenu();
 }catch(e){flashError("会话读取失败："+humanError(e))}
}
function updateModelTitle(){
 $("modelTitle").textContent=S.provider==="free"?"免费自动":S.modelTitle;
}
function setModel(row){
 if(row.type!=="text"){
  hide("modelDialog");
  if(row.type==="image")openCreate();else setComposerMode("video");
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
 if(S.savedProviders[via])void api("/api/connections/"+via+"/selected",{model:row.id}).catch(e=>flashError(humanError(e)));
 updateModelTitle();hide("modelDialog");flashError("");
}

function resizePrompt(){
 const textarea=$("prompt");if(!textarea)return;
 textarea.style.height="24px";
 const needed=textarea.scrollHeight,max=96;
 textarea.style.height=Math.max(24,Math.min(needed,max))+"px";
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

function setComposerMode(mode){
 S.composerMode=mode;
 if(S.workMode&&mode!=="text")setWorkMode(false);
 $("imageMode").classList.toggle("active",mode==="image");
 $("videoMode").classList.toggle("active",mode==="video");
 $("imageMode").setAttribute("aria-pressed",String(mode==="image"));
 $("videoMode").setAttribute("aria-pressed",String(mode==="video"));
 $("prompt").placeholder=mode==="image"?"描述想画的内容…":mode==="video"?"描述想生成的视频…":"向 AI 提问…";
 resizePrompt();
}
function renderAttachments(){
 const el=$("attachmentPreview");if(!el)return;el.replaceChildren();
 for(const item of S.attachments){
  const badge=node("span","attachment-item"),title=node("span","",item.name),del=node("button");del.append(iconSlot("x"));del.setAttribute("aria-label","移除附件");renderIcons(del);
  del.type="button";del.title="取消附件";
  del.addEventListener("click",()=>{S.attachments=S.attachments.filter(x=>x.id!==item.id);renderAttachments()});
  badge.append(title,del);el.append(badge);
 }
}
async function uploadSelected(files){
 if(!S.user){show("authDialog");return}
 if(S.attachments.length+files.length>4){flashError("一次最多上传4个附件");return}
 for(const file of files){
  if(file.size>8000000){flashError("单文件最大8MB："+file.name);continue}
  const body=new FormData();body.append("file",file);
  try{
   $("attachButton").disabled=true;
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
 minimax:"MiniMax API",siliconflow:"硅基流动 API",doubao:"火山方舟 API",qianfan:"百度千帆 API",hunyuan:"腾讯混元 API"
};
/* Work-task models are independent from the chat model and its selector. */
function updateWorkSelectedModel(){
 const label=$("workSelectedModel");if(!label)return;
 const next=Math.min(S.workDetail?.task?.nextStep||0,Math.max(0,S.workStages.length-1));
 const plan=S.workStages.slice(next);
 if(!plan.length){label.textContent="免费自动";return}
 const first=plan[0],same=plan.every(s=>s.provider===first.provider&&s.model===first.model);
 label.textContent=!same?"多模型分阶段执行":first.provider==="auto"||first.provider==="free"?"免费自动":(WORK_PROVIDER_NAMES[first.provider]||first.provider)+(first.model?" · "+first.model:"");
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
 let chosen=record?.model||models[0]?.id||"";
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
 const options=[["free","免费自动"],...Object.entries(WORK_PROVIDER_NAMES).filter(([id])=>id!=="free")];
 options.sort((a,b)=>{
  const rank=id=>id==="free"?0:S.savedProviders[id]?.verified?1:S.savedProviders[id]?2:3;
  return rank(a[0])-rank(b[0]);
 });
 for(const [provider,name] of options){
  const record=S.savedProviders[provider],ready=provider==="free"||!!record?.verified&&(!!record.consent||isFreeModel(provider,record.model));
  const button=node("button","work-model-option "+(ready?"ready":"connect"));button.type="button";
  button.append(node("strong","",name),node("small","",provider==="free"?"自动使用已配置免费线路":ready?"已验证 · 可选模型":record?"需要验证连接或授权":"连接 API 后使用"),node("span","work-model-option-action",ready?"选择":"连接"));
  button.addEventListener("click",()=>{
   if(S.workBusy||S.workDetail?.task?.status==="running"){$("workModelMessage").textContent="当前正在执行，不能更改";return}
   if(!ready){hide("workModelDialog");openKeyPanel(provider);return}
   if(provider==="free"){void chooseDedicatedWorkModel("free","");return}
   renderWorkProviderModels(provider);
  });
  target.append(button);
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
 S.workTaskId=null;S.workDetail=null;resetWorkPlan();renderWorkDetail();renderWorkTasks();renderWorkEditor();if(S.workMode)renderWorkAgentCatalog();
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
 for(const id of ["deepseek","zhipu","kimi","qwen","minimax","siliconflow","doubao","qianfan","hunyuan","novai","novai_pro"]){
  const b=node("button","domestic-provider",WORK_PROVIDER_NAMES[id]+(connected(id)?" · 已连接":""));
  b.type="button";b.addEventListener("click",()=>{hide("modelDialog");openKeyPanel(id)});
  el.append(b);
 }
}



const EXTERNAL_FREE_TOOLS=[{"provider":"Perchance","name":"AI 文生图","category":"作图","url":"https://perchance.org/ai-text-to-image-generator"},{"provider":"Perchance","name":"写实照片","category":"作图","url":"https://perchance.org/ai-photo-generator"},{"provider":"Perchance","name":"角色形象","category":"角色","url":"https://perchance.org/ai-character-generator"},{"provider":"Perchance","name":"动漫作图","category":"作图","url":"https://perchance.org/ai-anime-generator"},{"provider":"Perchance","name":"人像生成","category":"作图","url":"https://perchance.org/ai-portrait-generator"},{"provider":"Perchance","name":"剧情场景","category":"写作","url":"https://perchance.org/ai-scenario-generator"},{"provider":"Perchance","name":"图片提示词","category":"作图","url":"https://perchance.org/ai-image-prompt"},{"provider":"Perchance","name":"Flux 提示词","category":"作图","url":"https://perchance.org/ai-image-prompt-generator"},{"provider":"Perchance","name":"AI 聊天","category":"聊天","url":"https://perchance.org/ai-chat"},{"provider":"Perchance","name":"故事生成","category":"写作","url":"https://perchance.org/ai-story-generator"},{"provider":"Perchance","name":"文字冒险 RPG","category":"互动","url":"https://perchance.org/ai-rpg"},{"provider":"Perchance","name":"社区视频生成","category":"视频","url":"https://perchance.org/ai-video-generator"},{"provider":"PerchanceAI","name":"文生图","category":"作图","url":"https://perchanceai.com/t/text-to-image"},{"provider":"PerchanceAI","name":"图生图","category":"修图","url":"https://perchanceai.com/t/img2img"},{"provider":"PerchanceAI","name":"照片编辑","category":"修图","url":"https://perchanceai.com/t/photo-editor"},{"provider":"PerchanceAI","name":"照片增强","category":"修图","url":"https://perchanceai.com/t/ai-photo-enhancer"},{"provider":"PerchanceAI","name":"图片转文字","category":"修图","url":"https://perchanceai.com/t/photo-to-text"},{"provider":"PerchanceAI","name":"故事写作","category":"写作","url":"https://perchanceai.com/t/story"},{"provider":"PerchanceAI","name":"AI 助手","category":"聊天","url":"https://perchanceai.com/c/askbuddy"},{"provider":"PerchanceAI","name":"角色扮演聊天","category":"聊天","url":"https://perchanceai.com/c/ai-roleplay-chat"},{"provider":"PerchanceAI","name":"对话训练","category":"聊天","url":"https://perchanceai.com/c/crush-chat"},{"provider":"PerchanceAI","name":"专业图片生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-image-professional"},{"provider":"PerchanceAI","name":"摄影图片生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-photo"},{"provider":"PerchanceAI","name":"像素画生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-pixel-art-generator"},{"provider":"PerchanceAI","name":"无缝纹理生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/texture-generator"},{"provider":"PerchanceAI","name":"角色参考图","category":"角色","url":"https://perchanceai.com/ai/en/generate/character-reference-sheet"},{"provider":"PerchanceAI","name":"产品创意","category":"写作","url":"https://perchanceai.com/t/product-idea-generator"},{"provider":"PerchanceAI","name":"简笔人物画","category":"作图","url":"https://perchanceai.com/t/stick-figure-generator"},{"provider":"PerchanceAI","name":"角色姓名","category":"写作","url":"https://perchanceai.com/t/1920s-name-generator"},{"provider":"PerchanceAI","name":"角色创建","category":"角色","url":"https://perchanceai.com/c/character-creator"},{"provider":"PerchanceAI","name":"故事协作","category":"写作","url":"https://perchanceai.com/c/story-weaver"},{"provider":"PerchanceAI","name":"剧情互动","category":"互动","url":"https://perchanceai.com/c/dating-sim-text-game"},{"provider":"PerchanceAI","name":"图片变换","category":"修图","url":"https://perchanceai.com/t/image-transform-with-seed"},{"provider":"PerchanceAI","name":"艺术图像","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-art-generator"},{"provider":"PerchanceAI","name":"图像变体","category":"作图","url":"https://perchanceai.com/ai/en/generate/image-to-image"},{"provider":"PerchanceAI","name":"AI 绘图","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-drawing-generator"},{"provider":"PerchanceAI","name":"真假 AI 游戏","category":"互动","url":"https://perchanceai.com/c/bot-or-human"},{"provider":"PerchanceAI","name":"魔法灯互动","category":"互动","url":"https://perchanceai.com/c/ask-a-genie"},{"provider":"PerchanceAI","name":"照片工具库","category":"修图","url":"https://perchanceai.com/ai/en/image"},{"provider":"PerchanceAI","name":"所有免费工具","category":"目录","url":"https://perchanceai.com/explore?focus=1"},{"provider":"PerchanceAI","name":"热门工具","category":"目录","url":"https://perchanceai.com/explore/list/top"},{"provider":"PerchanceAI","name":"图像生成目录","category":"目录","url":"https://perchanceai.com/explore?category=image-generators"},{"provider":"PerchanceAI","name":"照片编辑目录","category":"目录","url":"https://perchanceai.com/explore?category=photo-editing"},{"provider":"PerchanceAI","name":"肖像工具目录","category":"目录","url":"https://perchanceai.com/explore?category=portrait"},{"provider":"PerchanceAI","name":"动漫工具目录","category":"目录","url":"https://perchanceai.com/explore?category=anime"},{"provider":"PerchanceAI","name":"长篇写作目录","category":"目录","url":"https://perchanceai.com/explore?category=prose_writing"},{"provider":"PerchanceAI","name":"写作工具目录","category":"目录","url":"https://perchanceai.com/explore?category=writing"},{"provider":"PerchanceAI","name":"角色互动目录","category":"目录","url":"https://perchanceai.com/explore?category=roleplay"},{"provider":"PerchanceAI","name":"AI 助手目录","category":"目录","url":"https://perchanceai.com/explore?type=assistants"},{"provider":"PerchanceAI","name":"命名工具目录","category":"目录","url":"https://perchanceai.com/explore?category=name_generator"},{"provider":"Perchance","name":"更多社区生成器","category":"目录","url":"https://perchance.org/generators"},{"provider":"FURAI","name":"Velorum 世界观","category":"互动","url":"https://furai.space/"}];
const FREE_TOOL_CATEGORIES=["全部","作图","修图","聊天","写作","角色","互动","视频","目录"];
function freeToolsFilters(){
 const container=$("freeToolFilters");container.replaceChildren();
 for(const label of FREE_TOOL_CATEGORIES){
  const b=node("button","free-filter"+(label===S.freeToolsCategory?" active":""));b.type="button";
  b.textContent=label;b.setAttribute("aria-pressed",String(label===S.freeToolsCategory));
  b.addEventListener("click",()=>{S.freeToolsCategory=label;renderFreeTools()});container.append(b);
 }
}
function renderFreeTools(){
 freeToolsFilters();
 const search=$("freeToolsSearch").value.trim().toLowerCase(),filter=S.freeToolsCategory;
 const items=EXTERNAL_FREE_TOOLS.filter(x=>(filter==="全部"||x.category===filter)&&(!search||[x.name,x.provider,x.category].some(v=>String(v).toLowerCase().includes(search))));
 $("freeToolsCount").textContent=items.length+" 个";
 const list=$("freeToolsList");list.replaceChildren();
 const icons={作图:"image",修图:"palette",聊天:"message-circle",写作:"square-pen",角色:"circle-user",互动:"compass",视频:"video",目录:"layers"};
 for(const item of items){
  const a=node("a","free-tool-card");a.href=item.url;a.target="_blank";a.rel="noopener noreferrer";
  a.dataset.category=item.category;a.setAttribute("aria-label",item.name+" · 在新页面打开");
  const symbol=node("span","free-tool-symbol");symbol.append(iconSlot(icons[item.category]||"blocks"));
  const copy=node("span","free-tool-copy");copy.append(node("strong","free-tool-name",item.name),node("span","free-tool-provider",item.provider));
  a.append(symbol,copy,iconSlot("arrow-up"));list.append(a);renderIcons(a);
 }
 if(!items.length)list.append(node("p","free-tools-empty","没有匹配的工具"));
}
function syncWorkspaceRoute(name){
 const hash=name?"#"+name:"";
 if(location.hash!==hash)history.replaceState(history.state,"",location.pathname+location.search+hash);
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
 closeMenu();syncHomeAmbient();
}
function restoreWorkspaceRoute(){
 if(location.hash==="#tools")setFreeToolsMode(true);
 else if(location.hash==="#work")setWorkMode(true);
}
const WORK_LABELS=["规划","制作","复核","交付"];
function setWorkMode(on){
 setFreeToolsMode(false);S.workMode=!!on;
 if(on){
  if(!S.workStages.length)resetWorkPlan();
  $("workConfig").open=false;renderWorkEditor();void loadCatalog();
  setComposerMode("text");$("conversation").hidden=true;$("workBoard").hidden=false;
  $("prompt").placeholder="描述要完成的工作任务…";
  hideAttachMenu();$("toolTray").hidden=true;void fetchWorkTasks();syncWorkspaceRoute("work");
 }else{
  $("workBoard").hidden=true;$("conversation").hidden=false;hide("workModelDialog");
  $("prompt").placeholder="向 AI 提问…";syncWorkspaceRoute("");
 }
 closeMenu();syncHomeAmbient();
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
 if(!S.user){S.workTasks=[];renderWorkTasks();return}
 try{
  const data=await api("/api/work/tasks");S.workTasks=data.tasks||[];renderWorkTasks();
  if(!S.workDetail&&S.workTasks.length&&!S.workTaskId&&S.workMode)void selectWorkTask(S.workTasks[0].id);
 }catch(e){$("workState").textContent="任务列表读取失败："+humanError(e)}
}
async function selectWorkTask(id){
 if(S.workBusy&&S.workTaskId!==id)return;
 try{
  const d=await api("/api/work/tasks/"+id);S.workTaskId=id;S.workDetail=d;
  loadWorkEditor(d.task);$("workConfig").open=false;renderWorkDetail();renderWorkTasks();
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
 if(S.composerMode==="image"){
  const prompt=$("prompt").value.trim();
  openCreate();if($("createDialog").open&&prompt)$("createPrompt").value=prompt;
  return;
 }
 if(S.busy)return;
 const prompt=$("prompt").value.trim();if(!prompt&&S.attachments.length===0)return;
 if(!S.user){show("authDialog");return}
 if(S.composerMode==="text"&&S.provider!=="free"&&!connected(S.provider)){
  openKeyPanel(S.provider);return;
 }
 const freeRoute=isFreeModel(S.provider,S.model);
 if(S.composerMode==="text"&&!freeRoute&&!S.allowPaid){
  flashError(connected(S.provider)?"密钥已保存，请授权使用此服务商额度；无需再次填写密钥。":"此模型需要服务商密钥。");
  openKeyPanel(S.provider);return;
 }
 S.busy=true;$("sendBtn").disabled=true;hideWelcome();flashError("");
 const isNew=!S.chatId;
 const isFreeMessage=S.composerMode==="text"&&S.provider==="free";
 const attached=S.attachments.slice();
 const sentBody=prompt+(attached.length?"\n"+attached.map(a=>"[文件："+a.name+"]("+a.url+")").join("\n"):"");
 const sentRow=appendMessage("user",sentBody);$("prompt").value="";settlePromptSize();S.attachments=[];renderAttachments();
 const loading=appendMessage("assistant","");
  let receivedStreamingText=false;
 const loadingBubble=loading.querySelector(".bubble");const status=node("span","thinking-status");
 const waitLabel=node("span","",S.composerMode==="image"?"作图中 1秒":S.composerMode==="video"?"正在创建视频…":"正在思考");
 const dots=node("span","thinking-dots");
 for(let i=0;i<3;i++)dots.append(node("i"));
 dots.setAttribute("aria-hidden","true");status.append(dots,waitLabel);loadingBubble.replaceChildren(status);
 const startedAt=Date.now();
 const imageTimer=S.composerMode==="image"?window.setInterval(()=>{
  if(!loading.isConnected){window.clearInterval(imageTimer);return}
  waitLabel.textContent="作图中 "+Math.max(1,Math.floor((Date.now()-startedAt)/1000)+1)+"秒";
 },1000):null;
 try{
  let result;
  if(S.composerMode==="text"){
    let pending="",scheduled=false,active=true;
    const bubble=loadingBubble,viewport=$("conversation");
    const onDelta=token=>{
     if(!active||!loading.isConnected)return;
     receivedStreamingText=true;
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
      mode:S.code?"code":"general",creativeMode:S.creativeMode,projectId:S.activeProjectId,allowPaid:S.allowPaid,apiKey:undefined},onDelta);}
    finally{active=false;pending="";}
   }
  else{
   if(S.composerMode==="video"&&!connected("grok")){openKeyPanel("grok");throw Error("请先连接 Grok 密钥");}
   const confirmed=S.composerMode==="video"?confirm("视频可能收费。确定使用自己的Grok API额度生成吗？"):false;
   if(S.composerMode==="video"&&!confirmed)throw Error("已取消视频请求");
   result=await api("/api/chat/media",{chatId:S.chatId,projectId:S.activeProjectId,mode:S.composerMode,prompt,apiKey:undefined,confirmed});
   if(result.requestId)S.videoTask=result.requestId;
  }
  if(loading.isConnected&&S.composerMode==="text"&&!receivedStreamingText)await revealCompletedReply(loading,result.reply);
  if(loading.isConnected){S.chatId=result.chatId;appendMessage("assistant",result.reply,isFreeMessage?null:result.model,loading)}
  await fetchChats();void fetchMe();
 }catch(e){
  loading.remove();
  if(isFreeMessage){
   // All free-provider diagnostics remain on the server. No red alert,
   // no synthetic assistant error and no lost user input or attachment.
   sentRow.remove();flashError("");
   const input=$("prompt"),newDraft=input.value.trim();
   input.value=newDraft?(prompt&&newDraft!==prompt?prompt+"\n"+newDraft:prompt||newDraft):prompt;
   if(attached.length){
    const ids=new Set(S.attachments.map(a=>a.id));
    for(const a of attached)if(!ids.has(a.id)){S.attachments.push(a);ids.add(a.id)}
    renderAttachments();
   }
   settlePromptSize();
   if(isNew&&!$("messageList").children.length)showWelcome();
  }else{
   flashError(humanError(e));appendMessage("assistant","请求未完成："+humanError(e));
  }
 }
 finally{if(imageTimer!==null)window.clearInterval(imageTimer);S.busy=false;$("sendBtn").disabled=false}
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
  $("modelSummary").textContent="免费自动已就绪 · 可选连接个人模型";
 }catch(e){
  $("modelSummary").textContent="免费自动";
  S.freeModels=[{id:"free:auto",name:"免费自动",provider:"free",type:"text",free:true}];
 }
 renderModels();
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
 const t=(m.name+" "+m.id+" "+m.provider+" "+(m.description||"")).toLowerCase();
 if(query&&!t.includes(query))return false;
 if(S.source.startsWith("family:")){
  const family=S.source.slice(7),id=(m.id+" "+m.name).toLowerCase();
  const re={gpt:/gpt|openai\/|\bo[1-9]-/,claude:/claude|anthropic/,
   grok:/grok|x-ai\/|xai\//,gemini:/gemini|google\//,qwen:/qwen|alibaba|tongyi/,
   novai:/novai|nova-ai|novaiapi/,deepseek:/deepseek/,
   russian:/yandex|gigachat|giga-chat|sber|alice-ai|\.su\//};
  const groupMatch=family==="russian"&&m.provider==="novai"
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
function renderModels(){
 $("modelRegionLinks").hidden=true;
 const visible=allModels().filter(modelMatches);
 const count=visible.length,shown=visible.slice(0,(S.modelPage+1)*30);
 $("modelCount").textContent=count+" 项"+(S.source==="free"?" · 当前默认：免费自动":"");
 $("moreModels").hidden=count<=shown.length;
 const list=$("modelList");list.replaceChildren();
 if(!shown.length){list.append(node("p","hint",S.loadedCatalog?"暂无符合条件的真实模型，请切换筛选。":"模型目录尚未连接成功。"));return}
 for(const item of shown){
  const selected=S.model===item.id&&S.provider===item.provider;
  const row=node("div","model-row"+(selected?" selected":"")),info=node("div","model-info"),title=node("strong","",item.name||item.id);
  const saved=Boolean(S.savedProviders[item.provider]);
  const tag=node("span","price-tag"+(item.free?" free":""),item.provider==="free"?"免费线路":saved?"已连接":item.free?"免费 · 需连接":"需连接");
  title.append(tag);info.append(title,node("small","",item.provider==="free"?"平台路由 · 真实模型由上游决定":"接入平台："+item.provider+" · 模型 ID："+item.id));
  const actionable=["text","image","video"].includes(item.type);
  const button=node("button","model-action",actionable?(item.type!=="text"?"使用":S.model===item.id?"已选":item.provider==="free"||saved?"使用":"连接"):"暂不支持");
  button.disabled=!actionable||selected;
  if(actionable)button.addEventListener("click",()=>setModel(item));
  row.append(info,button);list.append(row);
 }
}
function activateSource(name){
 S.source=name;S.modelPage=0;S.filter=name==="free"?"free":"all";$("modelFilter").value=S.filter;
 for(const el of els("#sourceChips .chip"))el.classList.toggle("active",el.dataset.source===name);
 renderModels();
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
 S.modelPage=0;S.filter="all";S.source="all";S.query="";$("modelSearch").value="";
 $("modelFilter").value="all";
 for(const el of els("#sourceChips .chip"))el.classList.toggle("active",el.dataset.source==="all");
 show("modelDialog");renderModels();void loadCatalog();
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
 const tile=node("article","draw-tile"),picture=node("div","draw-photo",status),caption=node("small","draw-caption","第 "+index+" 张 · "+status),clock=node("time","draw-tile-clock","00:00");
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
function drawResult(tile,url){
 const img=node("img");img.src=url;img.alt="生成图片";img.loading="lazy";tile.picture.replaceChildren(img);
 tile.tile.querySelector(".draw-tile-actions")?.remove();
 const actions=node("div","draw-tile-actions"),download=node("a","","下载图片");
 download.href=url;download.download="aigzt-image.png";actions.append(download);tile.tile.append(actions);
 tile.caption.textContent="仅当前页面显示 · 网站不保存";
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
  try{
   const r=await api("/api/image/task/"+encodeURIComponent(id));
   if(batch.cancelled)return false;
   if(r.done){
    if(r.failed){tile.picture.textContent="生成失败";tile.caption.textContent=r.error||"作图服务暂不可用";return false}
    if(typeof r.image==="string"){drawResult(tile,r.image);return true}
    tile.picture.textContent="结果为空";tile.caption.textContent="作图服务未返回图片";return false;
   }
   tile.caption.textContent="正在生成";
  }catch(e){
   tile.caption.textContent="本次查询暂时中断";
  }
  if(!await drawSleep(12000,batch.controller.signal))return false;
 }
 if(!batch.cancelled){tile.caption.textContent="任务未完成，请在当前页面继续尝试"}
 return false;
}
function stopDrawBatch(){
 const b=S.drawBatch;
 if(!b)return;
 b.cancelled=true;b.controller.abort();clearInterval(b.clockTimer);S.drawBatch=null;
 $("drawCancel").hidden=true;$("createButton").disabled=false;
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
 S.drawBatch=batch;$("drawResults").replaceChildren();
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
  tile.startedAt=Date.now();tile.clock.hidden=false;tile.picture.textContent="正在提交";
  try{
   const result=await api("/api/image",{prompt,style,shape});
   if(batch.cancelled)return;
   if(typeof result.jobId!=="string")throw Error("没有返回图片任务编号");
   tile.picture.textContent="生成中";tile.caption.textContent="正在等待结果";
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
 $("createButton").textContent=isImage?"生成免费图片":"使用我的 Grok 生成视频";
 $("createStatus").textContent="";$("mediaPreview").replaceChildren();$("refreshVideo").hidden=true;
}
function openCreate(){
 if(!S.user){show("authDialog");return}
 setCreationMode("image");show("createDialog");closeMenu();
}
function openVideoCreate(){
 if(!S.user){show("authDialog");return}
 setCreationMode("video");show("createDialog");closeMenu();
}
async function generateMedia(){
 if(!S.user){show("authDialog");return}
 if(S.createMode==="image"){await runFreeDraw();return}
 const prompt=$("createPrompt").value.trim();if(!prompt){$("createStatus").textContent="请填写画面描述";return}
 const btn=$("createButton");btn.disabled=true;$("createStatus").textContent="正在创建…";$("mediaPreview").replaceChildren();$("refreshVideo").hidden=true;
 try{
   if(!connected("grok"))throw Error("请先连接 Grok 密钥");
   if(!$("confirmVideo").checked)throw Error("视频可能收费，请先勾选费用确认");
   const d=await api("/api/video",{prompt,model:$("videoModel").value,confirmed:true});
   S.videoTask=d.requestId;
   $("createStatus").textContent="视频请求已提交，任务编号 "+d.requestId+"。点击「查询视频任务」获取结果。";
   $("refreshVideo").hidden=false;
 }catch(e){$("createStatus").textContent="未完成："+humanError(e)}
 finally{btn.disabled=false}
}
async function queryVideo(){
 if(!S.videoTask||!connected("grok"))return;
 $("refreshVideo").disabled=true;$("createStatus").textContent="正在查询真实视频任务…";
 try{
  const d=await api("/api/video/status",{requestId:S.videoTask});
  $("createStatus").textContent="任务状态："+d.status;
  if(d.url){
   const video=node("video");video.controls=true;video.src=d.url;video.playsInline=true;
   const link=node("a","","打开原始视频");link.href=d.url;link.rel="noopener noreferrer";link.target="_blank";
   $("mediaPreview").replaceChildren(video,link);$("refreshVideo").hidden=true;
  }else if(d.status==="failed")$("refreshVideo").hidden=true;
 }catch(e){$("createStatus").textContent=humanError(e)}
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
  S.provider="openrouter";S.model=d.connection.model;S.modelTitle="OpenRouter · "+S.model;S.allowPaid=false;updateModelTitle();
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
 try{await api("/api/logout",{});S.user=null;S.quota=null;S.chats=[];S.chatId=null;++S.workEpoch;S.workBusy=false;S.keys={};S.connected={};S.savedProviders={};S.connectionsLoaded=false;S.connectionsLoading=false;S.freeToolsMode=false;S.freeToolsCategory="全部";S.workTasks=[];S.workDetail=null;S.workTaskId=null;setWorkMode(false);renderWorkDetail();renderWorkTasks();S.projects=[];S.activeProjectId=null;S.notes=[];newChat();setAuthUI();renderHistory();renderProjects()}
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
  S.connected[p]=Array.isArray(data.models)?data.models:[];delete S.keys[p];
  if(rec.model){
   S.provider=p;S.model=rec.model;
   S.modelTitle=p+" · "+(S.connected[p].find(m=>m.id===rec.model)?.name||rec.model);
   S.selectedFree=isFreeModel(p,rec.model);
  }
  S.allowPaid=!!rec.consent;updateModelTitle();refreshSourceChips();
  refreshKeyPanel();$("keyStatus").textContent=rec.verified?"密钥已保存，下次打开直接使用":(data.warning||"密钥已保存，请选择官方模型 ID");
  if(rec.consent&&rec.verified&&rec.model){hide("keyDialog");$("prompt").focus()}
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
  renderWorkAgentCatalog();show("workModelDialog");
 });
 $("workAddStage").addEventListener("click",()=>{if(S.workStages.length<12){S.workStages.push({name:"新步骤",instruction:"",provider:"auto",model:""});renderWorkEditor()}});
 $("workAddRoute").addEventListener("click",()=>{if(S.workRoutes.length<20){S.workRoutes.push({provider:"free",model:"free:auto"});renderWorkEditor()}});
 $("workFallback").addEventListener("change",e=>{S.workFallback=e.target.checked});
 $("workSaveConfig").addEventListener("click",()=>void saveWorkConfiguration());
 $("workContinue").addEventListener("click",()=>void executeWorkTask(S.workTaskId));
 $("workStop").addEventListener("click",()=>void stopWorkTask());
 $("workDelete").addEventListener("click",()=>void deleteWorkTask());
 $("workExport").addEventListener("click",exportWorkTask);
 $("groqQuick").addEventListener("click",()=>{hide("modelDialog");openKeyPanel("groq")});
 $("imageQuick").addEventListener("click",()=>{hide("modelDialog");openCreate();$("toolTray").hidden=true});
 $("navFiles").addEventListener("click",()=>void openFiles());
 $("navKeys").addEventListener("click",()=>{closeMenu();openKeyPanel()});
 $("groqConnect").addEventListener("click",()=>openKeyPanel("groq"));
 $("newChat").addEventListener("click",newChat);$("headerNew").addEventListener("click",newChat);
 $("headerMore").addEventListener("click",()=>openChatActions());
 $("searchBtn").addEventListener("click",()=>{closeMenu();show("searchDialog");$("chatSearchInput").focus()});
 $("newProject").addEventListener("click",()=>openProject());
 $("accountBtn").addEventListener("click",()=>{if(!S.user)show("authDialog");else void openSettings()});
 $("accountAvatar").addEventListener("click",()=>{if(!S.user)show("authDialog")});
 $("settingsBtn").addEventListener("click",()=>void openSettings());
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
 
 $("composeModels").addEventListener("click",()=>{hideAttachMenu();openModels()});
 $("attachButton").addEventListener("click",()=>{$("attachMenu").hidden=!$("attachMenu").hidden;$("toolTray").hidden=true});
 $("cameraAction").addEventListener("click",()=>{hideAttachMenu();$("cameraInput").click()});
 $("photosAction").addEventListener("click",()=>{hideAttachMenu();$("photosInput").click()});
 $("filesAction").addEventListener("click",()=>{hideAttachMenu();$("attachmentInput").click()});
 $("toolsAction").addEventListener("click",()=>{hideAttachMenu();$("toolTray").hidden=!$("toolTray").hidden});
 for(const id of ["attachmentInput","cameraInput","photosInput"]){$(id).addEventListener("change",e=>{void uploadSelected(Array.from(e.target.files||[]));e.target.value=""})}
 $("imageMode").addEventListener("click",()=>{openCreate();$("toolTray").hidden=true});
 $("videoMode").addEventListener("click",()=>{hideAttachMenu();$("toolTray").hidden=true;openVideoCreate()});
 $("codeToggle").addEventListener("click",()=>{S.code=!S.code;$("codeToggle").classList.toggle("active",S.code);$("codeToggle").setAttribute("aria-pressed",String(S.code))});
 $("chatForm").addEventListener("submit",e=>{e.preventDefault();hideAttachMenu();void sendMessage()});
 $("prompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();void sendMessage()}});
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
  $("drawElapsed").hidden=true;$("drawElapsed").textContent="00:00";
 });
 $("refreshVideo").addEventListener("click",()=>void queryVideo());
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(Speech){$("voiceInput").hidden=false;$("voiceInput").addEventListener("click",()=>{const sr=new Speech();sr.lang="zh-CN";sr.interimResults=false;sr.onresult=e=>{$("prompt").value+=(e.results[0]?.[0]?.transcript||"");$("prompt").focus()};sr.onerror=e=>flashError("语音识别不可用："+e.error);sr.start()})}
}
function hideAttachMenu(){$("attachMenu").hidden=true}

document.addEventListener("DOMContentLoaded",async()=>{
 wire();renderIcons();let enabled=true;try{enabled=localStorage.getItem("aigzt:rainbow")!=="0"}catch{}
 applyTheme(enabled?"rainbow":"plain");syncHomeAmbient();setFreeDefault();resizePrompt();await fetchMe();await Promise.all([fetchProjects(),fetchChats(),fetchConnections(),fetchWorkTasks()]);await finishOpenRouterOAuth();
 restoreWorkspaceRoute();updateModelTitle();
});