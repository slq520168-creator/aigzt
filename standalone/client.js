"use strict";
const S={
 user:null,quota:null,chats:[],chatId:null,model:"free:auto",
 modelTitle:"免费自动",provider:"free",keys:{},connected:{},selectedFree:true,connectionsLoaded:false,connectionsLoading:false,
 allowPaid:false,savedProviders:{},freeToolsMode:false,freeToolsCategory:"全部",workMode:false,workBusy:false,workEpoch:0,workTasks:[],workDetail:null,workTaskId:null,workStages:[],workRoutes:[],workFallback:true,freeModels:[],remoteModels:[],loadedCatalog:false,
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
function renderIcons(scope=document){
 for(const e of scope.querySelectorAll("[data-icon]")){
  const path=ICONS[e.dataset.icon]||ICONS.folder;
  e.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>';
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
 if(!window.matchMedia("(max-width:900px)").matches)return;
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
function setAuthUI(){
 const logged=!!S.user;
 $("accountName").textContent=logged?S.user.email:"登录 / 注册";
 $("accountAvatar").textContent=logged?S.user.email.slice(0,1).toUpperCase():"A";
 const q=S.quota;
 $("quotaLabel").textContent=q&&logged?"免费请求保护配额："+q.remaining+"/"+q.limit+" · 全站剩余 "+q.siteRemaining:"外部免费 · 登录后使用";
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
  S.savedProviders=saved;S.connectionsLoaded=true;refreshSourceChips();
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
 const rows=S.chats||[];
 $("chatCount").textContent=rows.length?String(rows.length):"";
 $("historyHeading").textContent=S.archivedView?"已归档聊天":S.activeProjectId?"项目聊天":"最近聊天";
 const showPinned=!S.archivedView&&rows.some(item=>Boolean(item.pinned_at));
 pinHeading.hidden=!showPinned;pinned.hidden=!showPinned;
 if(!S.user){recent.append(node("div","hint","登录后查看聊天记录"));return}
 if(!rows.length){recent.append(node("div","hint",S.archivedView?"暂无归档聊天":"暂无聊天记录"));return}
 const makeRow=item=>{
  const row=node("div","history-row"+(S.chatId===item.id?" active":""));
  const select=node("button","history-select",item.title||"新对话");
  select.type="button";select.title=item.title||"";
  select.addEventListener("click",()=>void loadChat(item.id));
  const more=node("button","history-more");more.type="button";
  more.title="聊天操作";more.setAttribute("aria-label",(item.title||"聊天")+"的操作");
  more.append(iconSlot("ellipsis"));more.addEventListener("click",()=>openChatActions(item.id));
  row.append(select,more);renderIcons(row);return row;
 };
 for(const item of rows){
  (showPinned&&item.pinned_at?pinned:recent).append(makeRow(item));
 }
 if(showPinned&&!recent.childElementCount)recent.append(node("div","hint","其他聊天显示在这里"));
}
async function fetchChats(){
 if(!S.user){S.chats=[];renderHistory();return}
 try{
  const url="/api/chats"+(S.activeProjectId?"?project="+encodeURIComponent(S.activeProjectId)+(S.archivedView?"&archived=1":""):S.archivedView?"?archived=1":"");
  const d=await api(url);S.chats=d.chats||[];renderHistory();
 }catch(e){flashError("聊天列表读取失败："+humanError(e))}
}
function renderProjects(){
 const box=$("projectsList");box.replaceChildren();
 if(!S.user){box.append(node("div","hint","登录后创建项目"));return}
 for(const p of S.projects){
  const row=node("div","project-row"+(S.activeProjectId===p.id?" active":""));
  const b=node("button","project-select");b.append(iconSlot("folder"),node("span","project-name",p.name));b.title=p.name;
  b.addEventListener("click",()=>{S.activeProjectId=p.id;S.archivedView=false;newChat();void fetchChats();renderProjects()});
  const edit=node("button","project-edit");edit.title="项目设置";edit.setAttribute("aria-label","编辑项目");edit.append(iconSlot("ellipsis"));
  edit.addEventListener("click",()=>openProject(p));row.append(b,edit);box.append(row);renderIcons(row);
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

function hideWelcome(){$("welcome").hidden=true}
function showWelcome(){$("welcome").hidden=false}

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

function appendMessage(role,content,model){
 const row=node("div","message "+role),bubble=node("div","bubble",content);
 if(role==="assistant"){
  const icon=node("span","avatar-ai");icon.innerHTML="<svg viewBox=\"0 0 36 36\" width=\"34\" height=\"34\" aria-hidden=\"true\"><rect x=\"4\" y=\"6\" width=\"28\" height=\"27\" rx=\"12\" fill=\"#d6eef1\" stroke=\"#92c4ce\" stroke-width=\"1.2\"/><path d=\"M4 15C0 12 3 7 8 10M32 15c4-3 1-8-4-5\" fill=\"#b0d9e6\"/><circle cx=\"13\" cy=\"19\" r=\"2.3\" fill=\"#395e6c\"/><circle cx=\"23\" cy=\"19\" r=\"2.3\" fill=\"#395e6c\"/><path d=\"M14 26q4 3 8 0\" fill=\"none\" stroke=\"#496f77\" stroke-width=\"1.7\" stroke-linecap=\"round\"/><circle cx=\"8.5\" cy=\"25\" r=\"2.3\" fill=\"#f6b6c7\"/><circle cx=\"27.5\" cy=\"25\" r=\"2.3\" fill=\"#f6b6c7\"/><path d=\"M18 6V2\" stroke=\"#74aab6\" stroke-width=\"1.8\"/><circle cx=\"18\" cy=\"3\" r=\"2\" fill=\"#f7c975\"/></svg>";row.append(icon,bubble);
  const pending=String(content||"").match(/^\[\[aigzt:image-job:([0-9a-f-]{36})\]\]$/i);
  if(pending){bubble.replaceChildren();renderImageJob(bubble,pending[1])}
  const picture=String(content||"").match(/^!\[生成图片\]\((\/api\/files\/[0-9a-f-]{36})\)$/);
  if(picture){bubble.replaceChildren();const im=node("img","chat-generated-image");im.src=picture[1];im.alt="AI生成的图片";im.loading="lazy";bubble.append(im)}

  if(model)bubble.append(node("div","message-model",model));
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
 $("messageList").append(row);
 $("conversation").scrollTop=$("conversation").scrollHeight;
 return row;
}
function newChat(){
 S.creativeMode=null;
 S.code=false;$("codeToggle").classList.remove("active");$("codeToggle").setAttribute("aria-pressed","false");
 if(S.freeToolsMode)setFreeToolsMode(false);
 if(S.workMode)setWorkMode(false);
 S.chatId=null;S.attachments=[];renderAttachments();setFreeDefault();setComposerMode("text");$("messageList").replaceChildren();showWelcome();
 $("prompt").value="";settlePromptSize();flashError("");renderHistory();closeMenu();
 $("prompt").focus();
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
  if(c&&c.model&&c.provider){S.model=c.provider==="cloudflare"?"free:auto":c.model;S.provider=c.provider==="cloudflare"?"free":c.provider;S.modelTitle=c.provider==="cloudflare"?"免费自动":c.model;S.allowPaid=Boolean(S.savedProviders[S.provider]?.consent);S.selectedFree=isFreeModel(S.provider,S.model);updateModelTitle()}
  renderHistory();closeMenu();
 }catch(e){flashError("会话读取失败："+humanError(e))}
}
function updateModelTitle(){
 let label=S.modelTitle;
 if(S.provider==="free"&&!label.includes("免费"))label="免费 · "+label;
 $("modelTitle").textContent=label;
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
 S.provider=via;S.model=row.id;S.modelTitle=row.name||row.id;
 S.allowPaid=Boolean(S.savedProviders[via]?.consent);S.selectedFree=isFreeModel(via,row.id);
 if(S.savedProviders[via])void api("/api/connections/"+via+"/selected",{model:row.id}).catch(e=>flashError(humanError(e)));
 updateModelTitle();hide("modelDialog");flashError("");
}

function resizePrompt(){
 const textarea=$("prompt");if(!textarea)return;
 textarea.style.height="auto";
 const max=Math.max(88,Math.min(116,Math.round((window.visualViewport?.height||window.innerHeight)*.21)));
 const needed=textarea.scrollHeight;
 textarea.style.height=Math.max(24,Math.min(needed,max))+"px";
 textarea.style.overflowY=needed>max?"auto":"hidden";
}
function settlePromptSize(){
 resizePrompt();
 requestAnimationFrame(resizePrompt);
}
function syncMobileHeight(){
 if(!window.visualViewport)return;
 const active=document.activeElement;
 const keyboardVisible=(active===$("prompt")||active?.matches?.("input,textarea"))&&window.visualViewport.height<window.innerHeight-90;
 if(keyboardVisible)document.documentElement.style.setProperty("--aigzt-visible-height",Math.round(window.visualViewport.height)+"px");
 else document.documentElement.style.removeProperty("--aigzt-visible-height");
 resizePrompt();
}

function setComposerMode(mode){
 S.composerMode=mode;
 if(S.workMode&&mode!=="text")setWorkMode(false);
 $("imageMode").classList.toggle("active",mode==="image");
 $("videoMode").classList.toggle("active",mode==="video");
 $("imageMode").setAttribute("aria-pressed",String(mode==="image"));
 $("videoMode").setAttribute("aria-pressed",String(mode==="video"));
 $("prompt").placeholder=mode==="image"?"描述想画的内容…":mode==="video"?"描述想生成的视频…":"向 AI 提问…";
 resizePrompt();$("prompt").focus();
}
function renderAttachments(){
 const el=$("attachmentPreview");if(!el)return;el.replaceChildren();
 for(const item of S.attachments){
  const badge=node("span","attachment-item"),title=node("span","",item.name),del=node("button","","×");
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
const WORK_AGENT_PRODUCTS=[
 {name:"QwenWork",desc:"千问 · 办公工作代理",url:"https://qwenwork.cn",region:"中国",kind:"work"},
 {name:"WorkBuddy",desc:"腾讯 · AI 办公工作台",url:"https://cloud.tencent.com/product/workbuddy",region:"中国",kind:"work"},
 {name:"Kimi Work",desc:"Kimi · 多步骤工作",url:"https://www.kimi.com/en/help/others/product-comparison",region:"中国",kind:"work"},
 {name:"Manus",desc:"通用任务代理",url:"https://manus.im",region:"中国",kind:"work"},
 {name:"Qwen Code",desc:"千问 · 编程代理",url:"https://github.com/QwenLM/qwen-code",region:"中国",kind:"dev"},
 {name:"Kimi Code",desc:"Kimi · 编程代理",url:"https://www.kimi.com/code/en",region:"中国",kind:"dev"},
 {name:"Claude（含 Cowork）",desc:"Anthropic · 办公与多步骤工作",url:"https://claude.com/product/cowork",region:"国际",kind:"work"},
 {name:"Claude Code",desc:"Anthropic · 编程代理",url:"https://claude.com/product/claude-code",region:"国际",kind:"dev"},
 {name:"ChatGPT Work",desc:"OpenAI · 工作代理",url:"https://chatgpt.com",region:"国际",kind:"work"},
 {name:"OpenAI Codex",desc:"OpenAI · 编程代理",url:"https://chatgpt.com/codex",region:"国际",kind:"dev"},
 {name:"Google Antigravity",desc:"Google · 开发代理",url:"https://antigravity.google",region:"国际",kind:"dev"},
 {name:"Nova AI（Mac Agent）",desc:"Mac · 网页、邮件和自动任务",url:"https://nova-ai-agent.com/",region:"国际",kind:"work"},
 {name:"Nova（Agent Workspace）",desc:"Mac · Claude / ChatGPT 代理工作台",url:"https://supernova.md/",region:"国际",kind:"work"},
 {name:"Nova AI（免费多模型）",desc:"novaai.one · 7 个模型自动路由，无需自带密钥；官网使用",url:"https://www.novaai.one/",region:"国际",kind:"web"},
 {name:"Nova AI（模型聚合）",desc:"novai.su · 多模型接口与免费模型",url:"https://once-cf.novai.su/",region:"国际",kind:"api"},
 {name:"NovAI（中国模型）",desc:"aiapi-pro.com · 中国模型与免费 Flash",url:"https://aiapi-pro.com/",region:"中国",kind:"api"},
 {name:"GigaAgent（ГигаАгент）",desc:"Sber · 俄罗斯自主任务代理",url:"https://www.sberbank.ru/ru/sberpress/all/article?blockID=1303&lang=ru&newsID=79a5051e-0de1-40eb-94b7-10ca383ca531&regionID=78&type=NEWS",region:"俄罗斯",kind:"work"},
 {name:"GigaCowork",desc:"Sber · 团队协作工作代理",url:"https://www.sberbank.ru/ru/sberpress/tekhnologii/article?blockID=69b149cd-6db4-45aa-ade1-b6920d771b11&lang=ru&newsID=d43562d5-d15c-49af-88bb-8ad23bdd3323&regionID=77&type=NEWS",region:"俄罗斯",kind:"work"},
 {name:"GigaCode",desc:"Sber · 编程代理",url:"https://www.sberbank.ru/ru/sberpress/tekhnologii/article?blockID=69b149cd-6db4-45aa-ade1-b6920d771b11&lang=ru&newsID=b91a0cfe-70f9-47cb-aa52-c19ebacc6197&regionID=16&type=NEWS",region:"俄罗斯",kind:"dev"},
 {name:"Alice AI Agents（Алиса AI）",desc:"Yandex · 研究、预约等工作代理",url:"https://alice.yandex.ru/support/ru/assistant/chat/agents",region:"俄罗斯",kind:"work"},
 {name:"Yandex AI Studio · Agent Atelier",desc:"Yandex Cloud · AI 代理开发",url:"https://yandex.cloud/en/docs/stackland/concepts/components/ai-studio",region:"俄罗斯",kind:"dev"},
 {name:"GigaChat",desc:"Sber · 俄罗斯模型及 AI 助手",url:"https://giga.chat/portal",region:"俄罗斯",kind:"assistant"},
 {name:"Alice AI / YandexGPT",desc:"Yandex · 俄罗斯 AI 助手及模型",url:"https://alice.yandex.ru/about",region:"俄罗斯",kind:"assistant"}
];
function renderWorkAgentCatalog(){
 const target=$("workAgentCatalog");target.replaceChildren();
 for(const region of ["中国","国际","俄罗斯"]){
  const group=node("details","work-agent-group");
  // Keep the huge directory compact on mobile while letting all groups open on demand.
  group.open=region==="中国";
  const items=WORK_AGENT_PRODUCTS.filter(x=>x.region===region);
  const heading=node("summary","work-agent-region",region+" · "+items.length+" 项");
  const grid=node("div","work-agent-items");
  for(const item of items){
   const link=node("a","work-agent-product");link.href=item.url;link.target="_blank";link.rel="noopener noreferrer";
   const details=node("span","work-agent-description");
   details.append(node("strong","",item.name),node("small","",item.desc));
   const meta=node("span","work-agent-meta",item.kind==="assistant"?"AI 助手":item.kind==="api"?"API 入口":item.kind==="web"?"免费官网":"官网");
   link.append(details,meta);grid.append(link);
  }
  group.append(heading,grid);target.append(group);
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
 if(provider==="free"){
  return [
   {id:"free:auto",name:"平台自动选择免费接口（底层模型不固定）"},
   {id:"free:vexa",name:"Vexa 接口（底层模型未公开）"},
   {id:"free:vireonix",name:"Vireonix 接口（底层模型未公开）"},
   {id:"free:cehpoint",name:"Cehpoint 接口（底层模型未公开）"},
   ...(S.freeModels.some(x=>x.id==="free:groq")?[{id:"free:groq",name:"Groq 接口（GPT-OSS 20B）"}]:[])
  ];
 }
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
 const locked=S.workBusy||["completed","cancelled","running"].includes(S.workDetail?.task?.status);
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
}
function newWorkDraft(){
 if(S.workBusy)return;
 S.workTaskId=null;S.workDetail=null;resetWorkPlan();renderWorkDetail();renderWorkTasks();renderWorkEditor();
 $("workConfigMessage").textContent="已准备新任务";$("prompt").value="";$("workConfig").open=true;$("prompt").focus();
}
function loadWorkEditor(task){
 S.workStages=Array.isArray(task?.steps)&&task.steps.length?task.steps.map(x=>({...x})):[];if(!S.workStages.length)resetWorkPlan();
 S.workRoutes=Array.isArray(task?.routes)?task.routes.map(x=>({...x})):[];
 S.workFallback=task?.fallback!==false;
 renderWorkEditor();
}
async function saveWorkConfiguration(){
 const id=S.workTaskId;
 if(!id){$("workConfigMessage").textContent="已准备好，新任务发送时自动保存";return}
 if(!S.workStages.length){$("workConfigMessage").textContent="至少保留一个步骤";return}
 const payload={steps:S.workStages,routes:S.workRoutes,fallback:S.workFallback};
 $("workSaveConfig").disabled=true;
 try{const d=await api("/api/work/tasks/"+id+"/configure",payload);S.workDetail=d;renderWorkDetail();$("workConfigMessage").textContent="已保存到当前任务"}
 catch(e){$("workConfigMessage").textContent=humanError(e)}
 finally{renderWorkEditor()}
}
function initDomesticProviderLinks(){
 const el=$("domesticProviderList");el.replaceChildren();
 for(const id of ["deepseek","zhipu","kimi","qwen","minimax","siliconflow","doubao","qianfan","hunyuan","novai","novai_pro"]){
  const b=node("button","domestic-provider",WORK_PROVIDER_NAMES[id]+(connected(id)?" · 已连接":""));
  b.type="button";b.addEventListener("click",()=>{hide("modelDialog");openKeyPanel(id)});
  el.append(b);
 }
}


const FREE_CREATIVE_MODES=[{"id":"research","name":"研究","icon":"brain-circuit","placeholder":"输入研究主题","action":"chat"},{"id":"imagePrompt","name":"图片提示","icon":"image","placeholder":"描述你想画的内容","action":"chat"},{"id":"group","name":"群聊","icon":"message-circle","placeholder":"输入多角色群聊主题（模拟）","action":"chat"},{"id":"story","name":"故事","icon":"square-pen","placeholder":"输入故事主题","action":"chat"},{"id":"character","name":"角色创作者","icon":"circle-user","placeholder":"描述想创建的角色","action":"chat"},{"id":"code","name":"代码","icon":"code-2","placeholder":"输入编程需求","action":"code"},{"id":"adventure","name":"冒险","icon":"compass","placeholder":"输入冒险设定","action":"chat"},{"id":"mentor","name":"导师","icon":"brain-circuit","placeholder":"输入学习主题","action":"chat"},{"id":"debate","name":"辩论","icon":"message-circle","placeholder":"输入辩论题目","action":"chat"},{"id":"video","name":"视频","icon":"video","placeholder":"","action":"external","url":"https://perchance.org/ai-video-generator"},{"id":"live","name":"直播","icon":"mic","placeholder":"输入直播脚本或流程需求","action":"chat"}];
const EXTERNAL_FREE_TOOLS=[{"provider":"Perchance","name":"AI 文生图","category":"作图","url":"https://perchance.org/ai-text-to-image-generator"},{"provider":"Perchance","name":"写实照片","category":"作图","url":"https://perchance.org/ai-photo-generator"},{"provider":"Perchance","name":"角色形象","category":"角色","url":"https://perchance.org/ai-character-generator"},{"provider":"Perchance","name":"动漫作图","category":"作图","url":"https://perchance.org/ai-anime-generator"},{"provider":"Perchance","name":"人像生成","category":"作图","url":"https://perchance.org/ai-portrait-generator"},{"provider":"Perchance","name":"剧情场景","category":"写作","url":"https://perchance.org/ai-scenario-generator"},{"provider":"Perchance","name":"图片提示词","category":"作图","url":"https://perchance.org/ai-image-prompt"},{"provider":"Perchance","name":"Flux 提示词","category":"作图","url":"https://perchance.org/ai-image-prompt-generator"},{"provider":"Perchance","name":"AI 聊天","category":"聊天","url":"https://perchance.org/ai-chat"},{"provider":"Perchance","name":"故事生成","category":"写作","url":"https://perchance.org/ai-story-generator"},{"provider":"Perchance","name":"文字冒险 RPG","category":"互动","url":"https://perchance.org/ai-rpg"},{"provider":"Perchance","name":"社区视频生成","category":"视频","url":"https://perchance.org/ai-video-generator"},{"provider":"PerchanceAI","name":"文生图","category":"作图","url":"https://perchanceai.com/t/text-to-image"},{"provider":"PerchanceAI","name":"图生图","category":"修图","url":"https://perchanceai.com/t/img2img"},{"provider":"PerchanceAI","name":"照片编辑","category":"修图","url":"https://perchanceai.com/t/photo-editor"},{"provider":"PerchanceAI","name":"照片增强","category":"修图","url":"https://perchanceai.com/t/ai-photo-enhancer"},{"provider":"PerchanceAI","name":"图片转文字","category":"修图","url":"https://perchanceai.com/t/photo-to-text"},{"provider":"PerchanceAI","name":"故事写作","category":"写作","url":"https://perchanceai.com/t/story"},{"provider":"PerchanceAI","name":"AI 助手","category":"聊天","url":"https://perchanceai.com/c/askbuddy"},{"provider":"PerchanceAI","name":"角色扮演聊天","category":"聊天","url":"https://perchanceai.com/c/ai-roleplay-chat"},{"provider":"PerchanceAI","name":"对话训练","category":"聊天","url":"https://perchanceai.com/c/crush-chat"},{"provider":"PerchanceAI","name":"专业图片生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-image-professional"},{"provider":"PerchanceAI","name":"摄影图片生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-photo"},{"provider":"PerchanceAI","name":"像素画生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-pixel-art-generator"},{"provider":"PerchanceAI","name":"无缝纹理生成","category":"作图","url":"https://perchanceai.com/ai/en/generate/texture-generator"},{"provider":"PerchanceAI","name":"角色参考图","category":"角色","url":"https://perchanceai.com/ai/en/generate/character-reference-sheet"},{"provider":"PerchanceAI","name":"产品创意","category":"写作","url":"https://perchanceai.com/t/product-idea-generator"},{"provider":"PerchanceAI","name":"简笔人物画","category":"作图","url":"https://perchanceai.com/t/stick-figure-generator"},{"provider":"PerchanceAI","name":"角色姓名","category":"写作","url":"https://perchanceai.com/t/1920s-name-generator"},{"provider":"PerchanceAI","name":"角色创建","category":"角色","url":"https://perchanceai.com/c/character-creator"},{"provider":"PerchanceAI","name":"故事协作","category":"写作","url":"https://perchanceai.com/c/story-weaver"},{"provider":"PerchanceAI","name":"剧情互动","category":"互动","url":"https://perchanceai.com/c/dating-sim-text-game"},{"provider":"PerchanceAI","name":"图片变换","category":"修图","url":"https://perchanceai.com/t/image-transform-with-seed"},{"provider":"PerchanceAI","name":"艺术图像","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-art-generator"},{"provider":"PerchanceAI","name":"图像变体","category":"作图","url":"https://perchanceai.com/ai/en/generate/image-to-image"},{"provider":"PerchanceAI","name":"AI 绘图","category":"作图","url":"https://perchanceai.com/ai/en/generate/ai-drawing-generator"},{"provider":"PerchanceAI","name":"真假 AI 游戏","category":"互动","url":"https://perchanceai.com/c/bot-or-human"},{"provider":"PerchanceAI","name":"魔法灯互动","category":"互动","url":"https://perchanceai.com/c/ask-a-genie"},{"provider":"PerchanceAI","name":"照片工具库","category":"修图","url":"https://perchanceai.com/ai/en/image"},{"provider":"PerchanceAI","name":"所有免费工具","category":"目录","url":"https://perchanceai.com/explore?focus=1"},{"provider":"PerchanceAI","name":"热门工具","category":"目录","url":"https://perchanceai.com/explore/list/top"},{"provider":"PerchanceAI","name":"图像生成目录","category":"目录","url":"https://perchanceai.com/explore?category=image-generators"},{"provider":"PerchanceAI","name":"照片编辑目录","category":"目录","url":"https://perchanceai.com/explore?category=photo-editing"},{"provider":"PerchanceAI","name":"肖像工具目录","category":"目录","url":"https://perchanceai.com/explore?category=portrait"},{"provider":"PerchanceAI","name":"动漫工具目录","category":"目录","url":"https://perchanceai.com/explore?category=anime"},{"provider":"PerchanceAI","name":"长篇写作目录","category":"目录","url":"https://perchanceai.com/explore?category=prose_writing"},{"provider":"PerchanceAI","name":"写作工具目录","category":"目录","url":"https://perchanceai.com/explore?category=writing"},{"provider":"PerchanceAI","name":"角色互动目录","category":"目录","url":"https://perchanceai.com/explore?category=roleplay"},{"provider":"PerchanceAI","name":"AI 助手目录","category":"目录","url":"https://perchanceai.com/explore?type=assistants"},{"provider":"PerchanceAI","name":"命名工具目录","category":"目录","url":"https://perchanceai.com/explore?category=name_generator"},{"provider":"Perchance","name":"更多社区生成器","category":"目录","url":"https://perchance.org/generators"},{"provider":"FURAI","name":"Velorum 世界观","category":"互动","url":"https://furai.space/"}];
const FREE_TOOL_CATEGORIES=["全部","模式","作图","修图","聊天","写作","角色","互动","视频","目录"];
function freeToolsFilters(){
 const selected=S.freeToolsCategory||"全部",container=$("freeToolFilters");container.replaceChildren();
 for(const label of FREE_TOOL_CATEGORIES){
  const b=node("button","free-filter"+(label===selected?" active":""));b.type="button";
  b.textContent=label;b.setAttribute("aria-pressed",label===selected?"true":"false");
  b.addEventListener("click",()=>{S.freeToolsCategory=label;renderFreeTools()});container.append(b);
 }
}
function openFreeTool(url){
 if(navigator.standalone===true||window.matchMedia("(display-mode: standalone)").matches)
  window.location.assign(url);
 else window.open(url,"_blank","noopener,noreferrer");
}
function startFreeCreativeMode(mode){
 if(S.busy)return;
 if(mode.action==="external"){openFreeTool(mode.url);return}
 if(!S.user){show("authDialog");return}
 if(mode.action==="code"){startCoding();return}
 newChat();S.creativeMode=mode.id;$("prompt").placeholder=mode.placeholder;
 const header=$("welcome")?.querySelector("h1");if(header)header.textContent=mode.name;
 $("prompt").focus();
}
function renderFreeTools(){
 freeToolsFilters();
 const search=$("freeToolsSearch").value.trim().toLocaleLowerCase(),filter=S.freeToolsCategory||"全部";
 const includes=fields=>!search||fields.some(s=>String(s).toLocaleLowerCase().includes(search));
 const modes=FREE_CREATIVE_MODES.filter(x=>(filter==="全部"||filter==="模式")&&includes([x.name,x.placeholder]));
 const modeList=$("freeModesList");modeList.replaceChildren();$("freeModesSection").hidden=modes.length===0;
 for(const item of modes){
  const button=node("button","free-mode-card");button.type="button";
  const marker=node("span","free-mode-icon");marker.append(iconSlot(item.icon));
  button.append(marker,node("strong","",item.name));
  button.addEventListener("click",()=>startFreeCreativeMode(item));modeList.append(button);renderIcons(button);
 }
 const items=EXTERNAL_FREE_TOOLS.filter(x=>(filter==="全部"||filter===x.category)&&includes([x.name,x.provider,x.category]));
 $("freeToolsCount").textContent=items.length+" 个";const list=$("freeToolsList");list.replaceChildren();
 for(const item of items){
  const a=node("a","free-tool-card");a.href=item.url;
  a.target=(navigator.standalone===true||window.matchMedia("(display-mode: standalone)").matches)?"_self":"_blank";
  a.rel="noopener noreferrer";
  a.append(node("strong","free-tool-name",item.name),node("span","free-tool-provider",item.provider));list.append(a);
 }
 if(!modes.length&&!items.length)list.append(node("p","free-tools-empty","没有匹配的工具"));
}
function setFreeToolsMode(enabled){
 S.freeToolsMode=!!enabled;
 $("shell").classList.toggle("free-tools-active",S.freeToolsMode);
 if(enabled){
  S.workMode=false;$("workBoard").hidden=true;$("conversation").hidden=true;
  $("freeToolsBoard").hidden=false;$("composerArea").hidden=true;
  
  
  $("navFreeTools").classList.add("active");renderFreeTools();
 }else{
  $("freeToolsBoard").hidden=true;$("composerArea").hidden=false;$("navFreeTools").classList.remove("active");
  if(!S.workMode)$("conversation").hidden=false;
 }
 closeMenu();
}

const WORK_LABELS=["规划","制作","复核","交付"];
function setWorkMode(on){
 setFreeToolsMode(false);
 S.workMode=on;
 if(on){if(!S.workStages.length)resetWorkPlan();renderWorkAgentCatalog();renderWorkEditor();void loadCatalog();setComposerMode("text");$("conversation").hidden=true;$("workBoard").hidden=false;$("prompt").placeholder="描述要完成的工作任务…";hideAttachMenu();$("toolTray").hidden=true;void fetchWorkTasks()}
 else{$("workBoard").hidden=true;$("conversation").hidden=false;$("prompt").placeholder="向 AI 提问…";}
 closeMenu();
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
 if(!task){$("workStepList").replaceChildren();$("workTitle").textContent="";$("workState").textContent="";return;}
 $("workTitle").textContent=task.title;
 $("workState").textContent=workStatus(task)+(task.error?" · "+task.error:"");
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
  header.append(node("strong","",step.phase),node("small","",step.provider+(step.model&&step.model!==step.provider?" · "+step.model:"")));
  section.append(header,node("div","work-step-body",step.body));
  if(step.attempts?.length){section.append(node("div","work-switch-note","已切换 "+step.attempts.length+" 条不可用线路，继续使用 "+step.provider))}
  list.append(section);
 }
 $("workContinue").hidden=task.status==="completed"||task.status==="cancelled";
 $("workContinue").disabled=S.workBusy;
 $("workStop").hidden=task.status==="completed"||task.status==="cancelled";
 $("workExport").disabled=!(d.steps||[]).length;
 $("workDelete").disabled=S.workBusy;
 if(S.workMode)renderWorkEditor();
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
  loadWorkEditor(d.task);renderWorkDetail();renderWorkTasks();
 }catch(e){$("workState").textContent=humanError(e)}
}
async function startWorkTask(){
 if(S.workBusy)return;
 if(!S.user){show("authDialog");return}
 const prompt=$("prompt").value.trim();if(prompt.length<3){flashError("请描述需要完成的任务");return}
 S.workBusy=true;const epoch=++S.workEpoch;
 $("sendBtn").disabled=true;$("workState").textContent="正在创建工作任务…";
 try{
  const data=await api("/api/work/tasks",{prompt,provider:S.provider,model:S.model,projectId:S.activeProjectId,
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
 const attached=S.attachments.slice();
 const sentBody=prompt+(attached.length?"\n"+attached.map(a=>"[文件："+a.name+"]("+a.url+")").join("\n"):"");
 appendMessage("user",sentBody);$("prompt").value="";settlePromptSize();S.attachments=[];renderAttachments();
 const loading=appendMessage("assistant","");
 const loadingBubble=loading.querySelector(".bubble");const status=node("span","thinking-status");
 const waitLabel=node("span","",S.composerMode==="image"?"作图中 1秒":S.composerMode==="video"?"正在创建视频…":"正在思考");
 if(S.composerMode!=="text"){
  const dots=node("span","thinking-dots");
  for(let i=0;i<3;i++)dots.append(node("i"));
  dots.setAttribute("aria-hidden","true");status.append(dots);
 }
 status.append(waitLabel);loadingBubble.replaceChildren(status);
 const startedAt=Date.now();
 const imageTimer=S.composerMode==="image"?window.setInterval(()=>{
  if(!loading.isConnected){window.clearInterval(imageTimer);return}
  waitLabel.textContent="作图中 "+Math.max(1,Math.floor((Date.now()-startedAt)/1000)+1)+"秒";
 },1000):null;
 try{
  let result;
  if(S.composerMode==="text")result=await api("/api/chat",{chatId:S.chatId,provider:S.provider,model:S.model,message:prompt,attachments:attached.map(x=>x.id),
   mode:S.code?"code":"general",creativeMode:S.creativeMode,projectId:S.activeProjectId,allowPaid:S.allowPaid,apiKey:undefined});
  else{
   if(S.composerMode==="video"&&!connected("grok")){openKeyPanel("grok");throw Error("请先连接 Grok 密钥");}
   const confirmed=S.composerMode==="video"?confirm("视频可能收费。确定使用自己的Grok API额度生成吗？"):false;
   if(S.composerMode==="video"&&!confirmed)throw Error("已取消视频请求");
   result=await api("/api/chat/media",{chatId:S.chatId,projectId:S.activeProjectId,mode:S.composerMode,prompt,apiKey:undefined,confirmed});
   if(result.requestId)S.videoTask=result.requestId;
  }
  S.chatId=result.chatId;loading.remove();appendMessage("assistant",result.reply,result.model);
  if(isNew)await fetchChats();else await fetchChats();
  void fetchMe();
 }catch(e){loading.remove();flashError(humanError(e));appendMessage("assistant","请求未完成："+humanError(e))}
 finally{if(imageTimer!==null)window.clearInterval(imageTimer);S.busy=false;$("sendBtn").disabled=false;$("prompt").focus()}
}
async function loadCatalog(){
 if(S.loadedCatalog)return;
 $("modelCount").textContent="加载中…";
 try{
  const d=await api("/api/models");
  S.freeModels=(d.freeModels||[]).map(m=>({...m,provider:"free"}));
  S.remoteModels=(d.models||[]).map(m=>({...m,provider:"openrouter"}));
  S.loadedCatalog=true;
  if(S.workMode)workModelHints();
  $("modelSummary").textContent=d.catalogError?"模型目录暂不可用，仍可尝试免费线路。":"已读取 "+S.remoteModels.length+" 个模型；实际调用以连接状态为准。";
 }catch(e){
  $("modelSummary").textContent="模型目录连接失败："+humanError(e);
  // Never invent a catalog. The Worker free-model catalog remains available
  // through /api/models once upstream recovers.
  flashError(humanError(e));
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
 const text=(m.name+" "+m.id+" "+m.provider+" "+(m.description||"")).toLowerCase();
 if(query&&!text.includes(query))return false;
 if(S.source.startsWith("family:")){
  const name=S.source.slice(7),id=m.id.toLowerCase();
  const groups={
   gpt:/gpt|openai\/|\bo[1-9]-|^o[1-9]-/,
   grok:/grok|x-ai\/|xai\//,
   gemini:/gemini|google\//,
   qwen:/qwen|alibaba|tongyi/
  };
  if(!groups[name]?.test(id))return false;
 }else if(S.source==="connected"&&!S.savedProviders[m.provider])return false;
 else if(S.source!=="all"&&m.provider!==S.source)return false;
 if(S.filter==="free"&&!m.free)return false;
 if(S.filter==="text"&&m.type!=="text")return false;
 if(S.filter==="image"&&m.type!=="image")return false;
 if(S.filter==="video"&&m.type!=="video")return false;
 if(S.filter==="code"&&!/cod(e|er|ing)|deepseek|qwen|gpt|claude|gemini|glm|devstral|starcoder/i.test(text))return false;
 return true;
}
function renderModels(){
 const visible=allModels().filter(modelMatches);
 const count=visible.length,shown=visible.slice(0,(S.modelPage+1)*30);
 $("modelCount").textContent=count+" 项"+(S.source==="free"?" · 当前默认：免费自动":"");
 $("moreModels").hidden=count<=shown.length;
 const list=$("modelList");list.replaceChildren();
 if(!shown.length){list.append(node("p","hint",S.loadedCatalog?"暂无符合条件的真实模型，请切换筛选。":"模型目录尚未连接成功。"));return}
 for(const item of shown){
  const row=node("div","model-row"),info=node("div","model-info"),title=node("strong","",item.name||item.id);
  const saved=Boolean(S.savedProviders[item.provider]);
  const tag=node("span","price-tag"+(item.free?" free":""),item.provider==="free"?"免费线路":saved?"已连接":item.free?"免费 · 需连接":"需连接");
  title.append(tag);info.append(title,node("small","",item.provider==="free"?"平台路由 · 真实模型由上游决定":"接入平台："+item.provider+" · 模型 ID："+item.id));
  const actionable=["text","image","video"].includes(item.type);
  const button=node("button","model-action",actionable?(item.type!=="text"?"使用":S.model===item.id?"已选":item.provider==="free"||saved?"使用":"连接"):"暂不支持");
  button.disabled=!actionable||S.model===item.id;
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
 S.modelPage=0;S.filter="all";S.source="free";S.query="";$("modelSearch").value="";
 $("modelFilter").value="all";
 for(const el of els("#sourceChips .chip"))el.classList.toggle("active",el.dataset.source==="free");
 show("modelDialog");void loadCatalog();
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
 $("menuBtn").addEventListener("click",openMenu);
 $("closeSide").addEventListener("click",closeMenu);$("sideShade").addEventListener("click",closeMenu);
 $("navChat").addEventListener("click",()=>{S.activeProjectId=null;S.archivedView=false;newChat();void fetchChats();renderProjects()});
 $("navModels").addEventListener("click",()=>{closeMenu();openModels()});
 $("navFreeTools").addEventListener("click",()=>setFreeToolsMode(true));
 $("navDraw").addEventListener("click",openCreate);
 $("freeToolsClose").addEventListener("click",()=>setWorkMode(false));
 $("freeToolsSearch").addEventListener("input",renderFreeTools);
 $("navWork").addEventListener("click",()=>setWorkMode(true));
 $("navCode").addEventListener("click",startCoding);
 
 $("domesticProviderList");initDomesticProviderLinks();
 $("workClose").addEventListener("click",()=>setWorkMode(false));
 $("workNewTask").addEventListener("click",newWorkDraft);
 $("workAddStage").addEventListener("click",()=>{if(S.workStages.length<12){S.workStages.push({name:"新步骤",instruction:"",provider:"auto",model:""});renderWorkEditor()}});
 $("workAddRoute").addEventListener("click",()=>{if(S.workRoutes.length<20){S.workRoutes.push({provider:"free",model:"free:vexa"});renderWorkEditor()}});
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
 $("settingsBtn").addEventListener("click",()=>void openSettings());
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
 $("prompt").addEventListener("change",settlePromptSize);
 $("prompt").addEventListener("paste",()=>requestAnimationFrame(settlePromptSize));
 $("prompt").addEventListener("blur",()=>{document.documentElement.style.removeProperty("--aigzt-visible-height");settlePromptSize()});
 window.addEventListener("resize",syncMobileHeight);
 if(window.visualViewport){window.visualViewport.addEventListener("resize",syncMobileHeight);window.visualViewport.addEventListener("scroll",syncMobileHeight)}

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
 applyTheme(enabled?"rainbow":"plain");setFreeDefault();resizePrompt();await fetchMe();await Promise.all([fetchProjects(),fetchChats(),fetchConnections(),fetchWorkTasks()]);await finishOpenRouterOAuth();
 updateModelTitle();
});