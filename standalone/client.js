"use strict";
const S={
 user:null,quota:null,chats:[],chatId:null,model:"free:auto",
 modelTitle:"免费模型",provider:"free",keys:{},connected:{},
 allowPaid:false,savedProviders:{},freeModels:[],remoteModels:[],loadedCatalog:false,
 modelPage:0,source:"all",filter:"all",query:"",busy:false,code:false,
 authRegister:false,createMode:"image",videoTask:null,composerMode:"text",attachments:[],projects:[],activeProjectId:null,actionChatId:null,editProjectId:null,archivedView:false,memoryEnabled:true,notes:[],currentTheme:"rainbow"
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
function closeMenu(){$("shell").classList.remove("menu-open");$("sideShade").hidden=true}
function openMenu(){$("shell").classList.add("menu-open");$("sideShade").hidden=false}
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
 grok:{url:"https://console.x.ai/",name:"打开 xAI 控制台"},
 gemini:{url:"https://aistudio.google.com/apikey",name:"获取 Gemini 密钥"},
 qwen:{url:"https://modelstudio.console.alibabacloud.com/",name:"打开千问密钥控制台"}
};
function connected(p){return !!(S.savedProviders[p]||S.keys[p])}
function refreshKeyPanel(){
 const provider=$("keyProvider").value,rec=S.savedProviders[provider],site=KEY_SITES[provider];
 const a=$("providerKeyLink");a.href=site.url;a.textContent=site.name;
 $("providerHelp").textContent=provider==="qwen"?"请选择新加坡地区的密钥。":provider==="openrouter"?"可用官方账号授权，或创建 API Key。":"登录服务商账号创建 API Key，再返回粘贴。";
 $("personalKey").value="";
 $("personalKey").placeholder=rec?"已加密保存，留空即可":"粘贴 API Key";
 $("keySaveLabel").textContent=rec?"更换密钥":"验证并保存";
 $("disconnectProvider").hidden=!rec;
 $("allowPaid").checked=Boolean(rec?.consent);
 $("keyStatus").textContent=rec?"已连接 · 密钥已保存":"";
 $("openrouterLogin").hidden=provider!=="openrouter";
}
async function fetchConnections(){
 if(!S.user){S.savedProviders={};S.connected={};return}
 const d=await api("/api/connections"),saved={};
 for(const item of d.connections||[]){
  saved[item.provider]={model:item.model,consent:!!item.consent,updatedAt:item.updatedAt};
  if(!S.connected[item.provider])S.connected[item.provider]=[{id:item.model,name:item.model}];
 }
 S.savedProviders=saved;refreshSourceChips();
 if(S.provider!=="free"&&!connected(S.provider)){S.provider="free";S.model="free:auto";S.modelTitle="免费模型"}
 S.allowPaid=Boolean(S.savedProviders[S.provider]?.consent);
 updateModelTitle();refreshKeyPanel();
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
 $("themeToggle").setAttribute("aria-pressed",String(enabled));
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
   const link=node("a","chat-download","打开图片");link.href=r.image;link.target="_blank";link.rel="noopener";
   bubble.replaceChildren(img,link);return;
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
  if(picture){bubble.replaceChildren();const im=node("img","chat-generated-image");im.src=picture[1];im.alt="AI生成的图片";im.loading="lazy";const a=node("a","chat-download","打开图片");a.href=picture[1];a.target="_blank";a.rel="noopener";bubble.append(im,a)}

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
 S.chatId=null;S.attachments=[];renderAttachments();setComposerMode("text");$("messageList").replaceChildren();showWelcome();
 $("prompt").value="";flashError("");renderHistory();closeMenu();
 $("prompt").focus();
}
async function loadChat(id){
 if(S.busy)return;
 try{
  const v=await api("/api/chats/"+id);
  S.chatId=id;$("messageList").replaceChildren();hideWelcome();
  for(const m of v.messages)appendMessage(m.role,m.body,m.model);
  const c=S.chats.find(c=>c.id===id);
  if(c&&c.project_id!==undefined){S.activeProjectId=c.project_id||null;renderProjects()}
  if(c&&c.model&&c.provider){S.model=c.provider==="cloudflare"?"free:auto":c.model;S.provider=c.provider==="cloudflare"?"free":c.provider;S.modelTitle=c.provider==="cloudflare"?"免费自动":c.model;S.allowPaid=Boolean(S.savedProviders[S.provider]?.consent);updateModelTitle()}
  renderHistory();closeMenu();
 }catch(e){flashError("会话读取失败："+humanError(e))}
}
function updateModelTitle(){
 let label=S.modelTitle;
 if(S.provider==="free"&&!label.includes("免费"))label="免费 · "+label;
 $("modelTitle").textContent=label;
}
function setModel(row){
 if(row.type!=="text"){setComposerMode(row.type==="video"?"video":"image");hide("modelDialog");return}
 if(row.provider!=="free"&&!connected(row.provider)){
  const provider=row.provider==="openrouter"?"openrouter":row.provider;
  hide("modelDialog");openKeyPanel(provider);$("keyStatus").textContent="请连接个人 API Key 后使用该模型。";
  return;
 }
 S.provider=row.provider;S.model=row.id;S.modelTitle=row.name||row.id;
 S.allowPaid=Boolean(S.savedProviders[row.provider]?.consent);
 if(S.savedProviders[row.provider])void api("/api/connections/"+row.provider+"/selected",{model:row.id}).catch(e=>flashError(humanError(e)));
 updateModelTitle();hide("modelDialog");
 flashError("");
}

function setComposerMode(mode){
 S.composerMode=mode;
 $("imageMode").classList.toggle("active",mode==="image");
 $("videoMode").classList.toggle("active",mode==="video");
 $("imageMode").setAttribute("aria-pressed",String(mode==="image"));
 $("videoMode").setAttribute("aria-pressed",String(mode==="video"));
 $("prompt").placeholder=mode==="image"?"描述想画的内容…":mode==="video"?"描述想生成的视频…":"向 AI 提问…";
 $("prompt").focus();
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

async function sendMessage(){
 if(S.busy)return;
 const prompt=$("prompt").value.trim();if(!prompt&&S.attachments.length===0)return;
 if(!S.user){show("authDialog");return}
 if(S.composerMode==="text"&&S.provider!=="free"&&!connected(S.provider)){
  openKeyPanel(S.provider);return;
 }
 const freeRoute=S.provider==="free"||(S.provider==="openrouter"&&(S.model==="openrouter/free"||S.model.endsWith(":free")));
 if(S.composerMode==="text"&&!freeRoute&&!S.allowPaid){
  flashError("已选择的模型可能产生费用，请在「我的 AI 连接」中明确确认。");
  openKeyPanel(S.provider);return;
 }
 S.busy=true;$("sendBtn").disabled=true;hideWelcome();flashError("");
 const isNew=!S.chatId;
 const attached=S.attachments.slice();
 const sentBody=prompt+(attached.length?"\n"+attached.map(a=>"[文件："+a.name+"]("+a.url+")").join("\n"):"");
 appendMessage("user",sentBody);$("prompt").value="";S.attachments=[];renderAttachments();
 const loading=appendMessage("assistant","");
 const loadingBubble=loading.querySelector(".bubble");const status=node("span","thinking-status"),dots=node("span","thinking-dots");
 for(let i=0;i<3;i++)dots.append(node("i"));dots.setAttribute("aria-hidden","true");
 const waitLabel=node("span","",S.composerMode==="image"?"作图中 1秒":S.composerMode==="video"?"正在创建视频…":"正在思考…");
 status.append(dots,waitLabel);loadingBubble.replaceChildren(status);
 const startedAt=Date.now();
 const imageTimer=S.composerMode==="image"?window.setInterval(()=>{
  if(!loading.isConnected){window.clearInterval(imageTimer);return}
  waitLabel.textContent="作图中 "+Math.max(1,Math.floor((Date.now()-startedAt)/1000)+1)+"秒";
 },1000):null;
 try{
  let result;
  if(S.composerMode==="text")result=await api("/api/chat",{chatId:S.chatId,provider:S.provider,model:S.model,message:prompt,attachments:attached.map(x=>x.id),
   mode:S.code?"code":"general",projectId:S.activeProjectId,allowPaid:S.allowPaid,apiKey:undefined});
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
 const result=[...S.freeModels,...S.remoteModels];
 for(const [provider,items] of Object.entries(S.connected)){
  for(const x of items)result.push({id:x.id,name:x.name||x.id,provider,type:"text",free:false,ownKey:true})
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
 }else if(S.source!=="all"&&m.provider!==S.source)return false;
 if(S.filter==="free"&&!m.free)return false;
 if(S.filter==="text"&&m.type!=="text")return false;
 if(S.filter==="image"&&m.type!=="image")return false;
 if(S.filter==="video"&&m.type!=="video")return false;
 if(S.filter==="code"&&!/cod(e|er|ing)|deepseek|qwen|gpt|claude|gemini|glm|devstral|starcoder/i.test(text))return false;
 return true;
}
function renderModels(){
 const visible=allModels().filter(modelMatches);
 const count=visible.length,shown=visible.slice(0,(S.modelPage+1)*45);
 $("modelCount").textContent="符合条件的真实模型 "+count+" 个 · 已显示 "+shown.length+" 个";
 $("moreModels").hidden=count<=shown.length;
 const list=$("modelList");list.replaceChildren();
 if(!shown.length){list.append(node("p","hint",S.loadedCatalog?"暂无符合条件的真实模型，请切换筛选。":"模型目录尚未连接成功。"));return}
 for(const item of shown){
  const row=node("div","model-row"),info=node("div","model-info"),title=node("strong","",item.name||item.id);
  const tag=node("span","price-tag"+(item.free?" free":""),item.provider==="free"?"免费·额度有限":item.free?"免费·需个人Key":"需授权·可能收费");
  title.append(tag);info.append(title,node("small","",item.provider+" · "+item.id));
  const actionable=["text","image","video"].includes(item.type);
  const button=node("button","model-action",actionable?(item.type!=="text"?"选择聊天创作":S.model===item.id?"当前模型":"选择模型"):"暂不支持");
  button.disabled=!actionable||S.model===item.id;
  if(actionable)button.addEventListener("click",()=>setModel(item));
  row.append(info,button);list.append(row);
 }
}
function activateSource(name){
 S.source=name;S.modelPage=0;
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
 for(const [p,items] of Object.entries(S.connected)){
  if(container.querySelector('[data-source="'+p+'"]'))continue;
  const btn=node("button","chip",p+" · "+items.length);
  btn.dataset.source=p;btn.addEventListener("click",()=>activateSource(p));
  container.append(btn);
 }
}
function openModels(){
 S.modelPage=0;S.filter="free";S.source="all";
 $("modelFilter").value="free";
 for(const el of els("#sourceChips .chip"))el.classList.toggle("active",el.dataset.source==="all");
 show("modelDialog");void loadCatalog();
}
function openKeyPanel(provider){
 if(typeof provider==="string"&&$("keyProvider").querySelector('option[value="'+provider+'"]'))$("keyProvider").value=provider;
 refreshKeyPanel();show("keyDialog");
}
function setCreationMode(mode){
 S.createMode=mode;
 $("imageTab").classList.toggle("active",mode==="image");
 $("videoTab").classList.toggle("active",mode==="video");
 $("videoSettings").hidden=mode!=="video";
 $("createButton").textContent=mode==="image"?"生成免费图片":"使用我的 Grok 生成视频";
 $("createStatus").textContent="";$("mediaPreview").replaceChildren();$("refreshVideo").hidden=true;
}
function openCreate(){
 if(!S.user){show("authDialog");return}
 setCreationMode("image");show("createDialog");closeMenu();
}
async function generateMedia(){
 if(!S.user){show("authDialog");return}
 const prompt=$("createPrompt").value.trim();if(!prompt){$("createStatus").textContent="请填写画面描述";return}
 const btn=$("createButton");btn.disabled=true;$("createStatus").textContent="正在发送真实生成请求…";$("mediaPreview").replaceChildren();$("refreshVideo").hidden=true;
 try{
  if(S.createMode==="image"){
   const d=await api("/api/image",{prompt});
   const img=node("img");img.src=d.image;img.alt="AI 根据描述生成的图片";
   const link=node("a","","保存图片");link.href=d.image;link.download="aigzt-image.jpg";
   $("mediaPreview").append(img,link);
   $("createStatus").textContent="生成成功 · "+d.model;void fetchMe();
  }else{
   if(!connected("grok"))throw Error("请先连接 Grok 密钥");
   if(!$("confirmVideo").checked)throw Error("视频可能收费，请先勾选费用确认");
   const d=await api("/api/video",{prompt,model:$("videoModel").value,confirmed:true});
   S.videoTask=d.requestId;
   $("createStatus").textContent="视频请求已提交，任务编号 "+d.requestId+"。点击「查询视频任务」获取结果。";
   $("refreshVideo").hidden=false;
  }
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
  S.savedProviders.openrouter={model:d.connection.model,consent:false,updatedAt:d.connection.updatedAt};
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
  await Promise.all([fetchMe(),fetchProjects(),fetchChats(),fetchConnections()]);
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
 try{await api("/api/logout",{});S.user=null;S.quota=null;S.chats=[];S.chatId=null;S.keys={};S.connected={};S.savedProviders={};S.projects=[];S.activeProjectId=null;S.notes=[];newChat();setAuthUI();renderHistory();renderProjects()}
 catch(e){flashError("退出失败："+humanError(e))}
}
async function verifyKey(event){
 event.preventDefault();
 if(!S.user){show("authDialog");return}
 const p=$("keyProvider").value,key=$("personalKey").value.trim();
 if(!key){$("keyStatus").textContent=S.savedProviders[p]?"已经保存；更换密钥才需要填写":"请先从官方页面获取 API Key";return}
 const submit=event.submitter||$("keyForm").querySelector('[type="submit"]');
 if(submit)submit.disabled=true;
 $("keyStatus").textContent="验证连接中…";
 try{
  const data=await api("/api/connections",{provider:p,apiKey:key,consent:$("allowPaid").checked});
  const rec=data.connection;
  if(!rec||!Array.isArray(data.models)||!data.models.length)throw Error("服务商未返回可用模型");
  S.savedProviders[p]={model:rec.model,consent:!!rec.consent,updatedAt:rec.updatedAt};
  S.connected[p]=data.models;delete S.keys[p];
  S.provider=p;S.model=rec.model;S.modelTitle=p+" · "+(data.models.find(m=>m.id===rec.model)?.name||rec.model);
  S.allowPaid=!!rec.consent;updateModelTitle();refreshSourceChips();
  refreshKeyPanel();$("keyStatus").textContent="已加密保存，下次登录自动恢复";
  if(rec.consent){hide("keyDialog");$("prompt").focus()}
 }catch(e){$("keyStatus").textContent="连接失败："+humanError(e)}
 finally{if(submit)submit.disabled=false}
}
function wire(){
 $("menuBtn").addEventListener("click",openMenu);
 $("closeSide").addEventListener("click",closeMenu);$("sideShade").addEventListener("click",closeMenu);
 $("navChat").addEventListener("click",()=>{S.activeProjectId=null;S.archivedView=false;newChat();void fetchChats();renderProjects()});
 $("navModels").addEventListener("click",()=>{closeMenu();openModels()});
 $("groqQuick").addEventListener("click",()=>{hide("modelDialog");openKeyPanel("groq")});
 $("imageQuick").addEventListener("click",()=>{hide("modelDialog");setComposerMode("image");$("toolTray").hidden=true});
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
 $("pickModel").addEventListener("click",openModels);
 $("composeModels").addEventListener("click",()=>{hideAttachMenu();openModels()});
 $("attachButton").addEventListener("click",()=>{$("attachMenu").hidden=!$("attachMenu").hidden;$("toolTray").hidden=true});
 $("cameraAction").addEventListener("click",()=>{hideAttachMenu();$("cameraInput").click()});
 $("photosAction").addEventListener("click",()=>{hideAttachMenu();$("photosInput").click()});
 $("filesAction").addEventListener("click",()=>{hideAttachMenu();$("attachmentInput").click()});
 $("toolsAction").addEventListener("click",()=>{hideAttachMenu();$("toolTray").hidden=!$("toolTray").hidden});
 for(const id of ["attachmentInput","cameraInput","photosInput"]){$(id).addEventListener("change",e=>{void uploadSelected(Array.from(e.target.files||[]));e.target.value=""})}
 $("imageMode").addEventListener("click",()=>{setComposerMode(S.composerMode==="image"?"text":"image");$("toolTray").hidden=true});
 $("videoMode").addEventListener("click",()=>{setComposerMode(S.composerMode==="video"?"text":"video");$("toolTray").hidden=true});
 $("themeToggle").addEventListener("click",()=>{applyTheme(S.currentTheme==="rainbow"?"plain":"rainbow");void persistPrefs().catch(()=>{})});
 $("codeToggle").addEventListener("click",()=>{S.code=!S.code;$("codeToggle").classList.toggle("active",S.code);$("codeToggle").setAttribute("aria-pressed",String(S.code))});
 $("chatForm").addEventListener("submit",e=>{e.preventDefault();hideAttachMenu();void sendMessage()});
 $("prompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();void sendMessage()}});
 $("prompt").addEventListener("input",e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,136)+"px"});
 document.addEventListener("click",e=>{if(!$("attachMenu").hidden&&!$("attachMenu").contains(e.target)&&!$("attachButton").contains(e.target))hideAttachMenu()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")hideAttachMenu()});
 for(const btn of els("[data-close]"))btn.addEventListener("click",()=>hide(btn.dataset.close));
 $("authForm").addEventListener("submit",e=>void login(e));
 $("switchAuth").addEventListener("click",toggleAuth);
 $("keyForm").addEventListener("submit",e=>void verifyKey(e));
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
 $("imageTab").addEventListener("click",()=>setCreationMode("image"));
 $("videoTab").addEventListener("click",()=>setCreationMode("video"));
 $("createButton").addEventListener("click",()=>void generateMedia());
 $("refreshVideo").addEventListener("click",()=>void queryVideo());
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(Speech){$("voiceInput").hidden=false;$("voiceInput").addEventListener("click",()=>{const sr=new Speech();sr.lang="zh-CN";sr.interimResults=false;sr.onresult=e=>{$("prompt").value+=(e.results[0]?.[0]?.transcript||"");$("prompt").focus()};sr.onerror=e=>flashError("语音识别不可用："+e.error);sr.start()})}
}
function hideAttachMenu(){$("attachMenu").hidden=true}

document.addEventListener("DOMContentLoaded",async()=>{
 wire();renderIcons();let enabled=true;try{enabled=localStorage.getItem("aigzt:rainbow")!=="0"}catch{}
 applyTheme(enabled?"rainbow":"plain");await fetchMe();await Promise.all([fetchProjects(),fetchChats(),fetchConnections()]);await finishOpenRouterOAuth();
 updateModelTitle();
});