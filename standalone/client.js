"use strict";
const S={
 user:null,quota:null,chats:[],chatId:null,model:"free:auto",
 modelTitle:"免费模型",provider:"free",keys:{},connected:{},
 allowPaid:false,savedProviders:{},workMode:false,workBusy:false,workEpoch:0,workTasks:[],workDetail:null,workTaskId:null,workStages:[],workRoutes:[],workFallback:true,freeModels:[],remoteModels:[],loadedCatalog:false,
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
 $("personalKey").placeholder=rec?"已加密保存，留空即可":"粘贴 API Key";
 $("keySaveLabel").textContent=rec?"更换密钥":"验证并保存";
 $("disconnectProvider").hidden=!rec;
 $("manualModelWrap").hidden=provider==="openrouter"||provider==="gemini";
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
 if(S.freeToolsMode)setFreeToolsMode(false);
 if(S.workMode)setWorkMode(false);
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
 // Models returned by the OpenRouter catalog must use OpenRouter authentication, not the model author's API.
 const via=row.availableWith==="openrouter-key"?"openrouter":row.provider;
 if(via!=="free"&&!connected(via)){
  hide("modelDialog");openKeyPanel(via);
  $("keyStatus").textContent="获取并保存 "+via+" 的 API Key 后选择模型";
  return;
 }
 S.provider=via;S.model=row.id;S.modelTitle=row.name||row.id;
 S.allowPaid=Boolean(S.savedProviders[via]?.consent);
 if(S.savedProviders[via])void api("/api/connections/"+via+"/selected",{model:row.id}).catch(e=>flashError(humanError(e)));
 updateModelTitle();hide("modelDialog");flashError("");
}

function setComposerMode(mode){
 S.composerMode=mode;
 if(S.workMode&&mode!=="text")setWorkMode(false);
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


const EXTERNAL_FREE_TOOLS=[
 {provider:"Perchance",name:"AI 文生图",category:"作图",desc:"提示词生成图片，可选画风和尺寸",url:"https://perchance.org/ai-text-to-image-generator"},
 {provider:"Perchance",name:"角色形象生成",category:"作图",desc:"生成角色头像和人物形象",url:"https://perchance.org/ai-character-generator"},
 {provider:"Perchance",name:"免费作图（另一版本）",category:"作图",desc:"更多图像生成选项",url:"https://perchance.org/new-image-gen"},
 {provider:"Perchance",name:"AI 聊天",category:"聊天",desc:"网页对话与角色扮演",url:"https://perchance.org/ai-chat"},
 {provider:"Perchance",name:"角色聊天",category:"聊天",desc:"创建角色并进行连续对话",url:"https://perchance.org/ai-character-chat"},
 {provider:"Perchance",name:"故事生成",category:"写作",desc:"输入情节，生成并续写故事",url:"https://perchance.org/ai-story-generator"},
 {provider:"Perchance",name:"文字冒险 RPG",category:"互动",desc:"AI 主持文字冒险游戏",url:"https://perchance.org/ai-rpg"},
 {provider:"Perchance",name:"场景生成",category:"写作",desc:"生成剧情场景和创意背景",url:"https://perchance.org/ai-scenario-generator"},
 {provider:"Perchance",name:"更多免费生成器",category:"全部",desc:"浏览平台上其他公开生成器",url:"https://perchance.org/"},
 {provider:"Nova AI",name:"免费多模型",category:"聊天",desc:"官网免费模型路由；不需要 AIGZT 密钥",url:"https://www.novaai.one/"},
 {provider:"FURAI",name:"Velorum 互动档案",category:"互动",desc:"科幻世界观问答和探索；不是通用模型平台",url:"https://furai.space/"}
];
function freeToolsFilters(){
 const selected=S.freeToolsCategory||"全部",container=$("freeToolFilters");
 container.replaceChildren();
 for(const label of ["全部","作图","聊天","写作","互动"]){
  const b=node("button","free-filter"+(label===selected?" active":""));
  b.type="button";b.textContent=label;b.setAttribute("aria-pressed",label===selected?"true":"false");
  b.addEventListener("click",()=>{S.freeToolsCategory=label;renderFreeTools()});
  container.append(b);
 }
}
function renderFreeTools(){
 freeToolsFilters();
 const search=$("freeToolsSearch").value.trim().toLocaleLowerCase(),filter=S.freeToolsCategory||"全部";
 const matches=EXTERNAL_FREE_TOOLS.filter(x=>(filter==="全部"||x.category===filter||x.category==="全部")&&
  (!search||[x.name,x.provider,x.desc,x.category].some(y=>y.toLocaleLowerCase().includes(search))));
 const container=$("freeToolsList");container.replaceChildren();
 if(!matches.length){container.append(node("p","free-tools-empty","没有找到对应工具"));return}
 for(const item of matches){
  const a=node("a","free-tool-card");
  a.href=item.url;a.target="_blank";a.rel="noopener noreferrer";
  const title=node("strong","free-tool-name",item.name);
  const source=node("span","free-tool-provider",item.provider);
  const head=node("div","free-tool-card-head");head.append(title,source);
  const body=node("span","free-tool-description",item.desc);
  const open=node("span","free-tool-open","打开官网");
  a.append(head,body,open);container.append(a);
 }
}
function setFreeToolsMode(enabled){
 S.freeToolsMode=!!enabled;
 if(enabled){
  S.workMode=false;$("workBoard").hidden=true;$("conversation").hidden=true;
  $("freeToolsBoard").hidden=false;$("composerArea").hidden=true;
  $("workOpen").classList.remove("active");$("chatTop").classList.remove("active");
  $("workOpen").setAttribute("aria-pressed","false");$("chatTop").setAttribute("aria-pressed","false");
  $("navFreeTools").classList.add("active");renderFreeTools();
 }else{
  $("freeToolsBoard").hidden=true;$("composerArea").hidden=false;$("navFreeTools").classList.remove("active");
  if(!S.workMode){
   $("conversation").hidden=false;
   $("chatTop").classList.add("active");
   $("chatTop").setAttribute("aria-pressed","true");
  }
 }
 closeMenu();
}

const WORK_LABELS=["规划","制作","复核","交付"];
function setWorkMode(on){
 setFreeToolsMode(false);
 S.workMode=on;
 if(on){if(!S.workStages.length)resetWorkPlan();renderWorkAgentCatalog();renderWorkEditor();void loadCatalog();setComposerMode("text");$("conversation").hidden=true;$("workBoard").hidden=false;$("prompt").placeholder="描述要完成的工作任务…";$("workOpen").classList.add("active");$("chatTop").classList.remove("active");$("workOpen").setAttribute("aria-pressed","true");$("chatTop").setAttribute("aria-pressed","false");hideAttachMenu();$("toolTray").hidden=true;void fetchWorkTasks()}
 else{$("workBoard").hidden=true;$("conversation").hidden=false;$("workOpen").classList.remove("active");$("chatTop").classList.add("active");$("workOpen").setAttribute("aria-pressed","false");$("chatTop").setAttribute("aria-pressed","true");$("prompt").placeholder="向 AI 提问…";}
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
  $("prompt").value="";S.attachments=[];renderAttachments();
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
 $("modelCount").textContent="符合条件 "+count+" 项 · 已显示 "+shown.length+" 项";
 $("moreModels").hidden=count<=shown.length;
 const list=$("modelList");list.replaceChildren();
 if(!shown.length){list.append(node("p","hint",S.loadedCatalog?"暂无符合条件的真实模型，请切换筛选。":"模型目录尚未连接成功。"));return}
 for(const item of shown){
  const row=node("div","model-row"),info=node("div","model-info"),title=node("strong","",item.name||item.id);
  const tag=node("span","price-tag"+(item.free?" free":""),item.provider==="free"?"免费接口":item.free?"零价模型 · 需密钥":"需授权 · 可能收费");
  title.append(tag);info.append(title,node("small","",item.provider==="free"?"平台路由 · 真实模型由上游决定":"接入平台："+item.provider+" · 模型 ID："+item.id));
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
 initDomesticProviderLinks();
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
 const btn=$("createButton");btn.disabled=true;$("createStatus").textContent="正在创建…";$("mediaPreview").replaceChildren();$("refreshVideo").hidden=true;
 try{
  if(S.createMode==="image"){
   hide("createDialog");setComposerMode("image");$("prompt").value=prompt;void sendMessage();return;
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
 try{await api("/api/logout",{});S.user=null;S.quota=null;S.chats=[];S.chatId=null;++S.workEpoch;S.workBusy=false;S.keys={};S.connected={};S.savedProviders={};S.freeToolsMode=false;S.freeToolsCategory="全部";S.workTasks=[];S.workDetail=null;S.workTaskId=null;setWorkMode(false);renderWorkDetail();renderWorkTasks();S.projects=[];S.activeProjectId=null;S.notes=[];newChat();setAuthUI();renderHistory();renderProjects()}
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
  const manualModel=$("manualModel").value.trim();
  const data=await api("/api/connections",{provider:p,apiKey:key,model:manualModel||undefined,consent:$("allowPaid").checked});
  const rec=data.connection;
  if(!rec||!Array.isArray(data.models)||!data.models.length)throw Error("服务商未返回可用模型");
  S.savedProviders[p]={model:rec.model,consent:!!rec.consent,updatedAt:rec.updatedAt};
  S.connected[p]=data.models;delete S.keys[p];
  S.provider=p;S.model=rec.model;S.modelTitle=p+" · "+(data.models.find(m=>m.id===rec.model)?.name||rec.model);
  S.allowPaid=!!rec.consent;updateModelTitle();refreshSourceChips();
  refreshKeyPanel();$("keyStatus").textContent=rec.verified?"已验证并加密保存":"密钥已保存，但此模型调用尚未验证";
  if(rec.consent){hide("keyDialog");$("prompt").focus()}
 }catch(e){$("keyStatus").textContent="连接失败："+humanError(e)}
 finally{if(submit)submit.disabled=false}
}
function wire(){
 $("menuBtn").addEventListener("click",openMenu);
 $("closeSide").addEventListener("click",closeMenu);$("sideShade").addEventListener("click",closeMenu);
 $("navChat").addEventListener("click",()=>{S.activeProjectId=null;S.archivedView=false;newChat();void fetchChats();renderProjects()});
 $("navModels").addEventListener("click",()=>{closeMenu();openModels()});
 $("navFreeTools").addEventListener("click",()=>setFreeToolsMode(true));
 $("freeToolsClose").addEventListener("click",()=>setWorkMode(false));
 $("freeToolsSearch").addEventListener("input",renderFreeTools);
 $("navWork").addEventListener("click",()=>setWorkMode(true));
 $("workOpen").addEventListener("click",()=>setWorkMode(true));
 $("domesticProviderList");initDomesticProviderLinks();
 $("chatTop").addEventListener("click",()=>setWorkMode(false));
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
 applyTheme(enabled?"rainbow":"plain");await fetchMe();await Promise.all([fetchProjects(),fetchChats(),fetchConnections(),fetchWorkTasks()]);await finishOpenRouterOAuth();
 updateModelTitle();
});