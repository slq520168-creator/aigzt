"use strict";
const S={
 user:null,quota:null,chats:[],chatId:null,model:"@cf/meta/llama-3.1-8b-instruct-fast",
 modelTitle:"免费自动选择",provider:"cloudflare",keys:{},connected:{},
 allowPaid:false,freeModels:[],remoteModels:[],loadedCatalog:false,
 modelPage:0,source:"all",filter:"all",query:"",busy:false,code:false,
 authRegister:false,createMode:"image",videoTask:null
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
function show(id){$(id).showModal()}
function hide(id){$(id).close()}
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
 $("accountBtn").textContent=logged?S.user.email+" · 退出":"◯ 登录 / 注册";
 const q=S.quota;
 $("quotaLabel").textContent=q&&logged?"我的免费次数："+q.remaining+"/"+q.limit+" · 全站剩余 "+q.siteRemaining:"免费额度：登录后查看";
}
async function fetchMe(){
 try{const v=await api("/api/me");S.user=v.user;S.quota=v.quota;setAuthUI()}
 catch(e){flashError("账号状态读取失败："+humanError(e))}
}
function renderHistory(){
 const target=$("history");target.replaceChildren();
 $("chatCount").textContent=S.chats.length?String(S.chats.length):"";
 if(!S.user){target.append(node("div","hint","登录后可在不同设备同步自己的聊天记录。"));return}
 if(!S.chats.length){target.append(node("div","hint","暂时没有历史会话，开始一个新聊天吧。"));return}
 for(const row of S.chats){
  const wrap=node("div","history-row"+(S.chatId===row.id?" active":""));
  const btn=node("button","history-select",row.title||"新对话");
  btn.title=row.title;btn.addEventListener("click",()=>void loadChat(row.id));
  const del=node("button","history-del","×");del.title="删除这个聊天";
  del.addEventListener("click",async()=>{
   if(!confirm("确定删除这段聊天及所有消息？此操作不可撤销。"))return;
   try{await api("/api/chats/"+row.id+"/delete",{});if(S.chatId===row.id)newChat();await fetchChats()}
   catch(e){flashError(humanError(e))}
  });
  wrap.append(btn,del);target.append(wrap);
 }
}
async function fetchChats(){
 if(!S.user){S.chats=[];renderHistory();return}
 try{const d=await api("/api/chats");S.chats=d.chats||[];renderHistory()}
 catch(e){flashError("聊天记录加载失败："+humanError(e))}
}
function hideWelcome(){$("welcome").hidden=true}
function showWelcome(){$("welcome").hidden=false}
function appendMessage(role,content,model){
 const row=node("div","message "+role),bubble=node("div","bubble",content);
 if(role==="assistant"){
  const icon=node("span","avatar-ai","✧");row.append(icon,bubble);
  if(model)bubble.append(node("div","message-model",model));
 }else row.append(bubble);
 $("messageList").append(row);
 $("conversation").scrollTop=$("conversation").scrollHeight;
 return row;
}
function newChat(){
 S.chatId=null;$("messageList").replaceChildren();showWelcome();
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
  if(c&&c.model&&c.provider){S.model=c.model;S.provider=c.provider;S.modelTitle=c.model;updateModelTitle()}
  renderHistory();closeMenu();
 }catch(e){flashError("会话读取失败："+humanError(e))}
}
function updateModelTitle(){
 let label=S.modelTitle;
 if(S.provider==="cloudflare"&&!label.includes("免费"))label="免费 · "+label;
 $("modelTitle").textContent=label;
}
function setModel(row){
 if(row.type!=="text"){flashError("该条是媒体模型目录，请到图片与视频创作入口；不把媒体模型当作聊天模型调用。");return}
 if(row.provider!=="cloudflare"&&!S.keys[row.provider]){
  $("keyProvider").value=row.provider==="openrouter"?"openrouter":row.provider;
  show("keyDialog");$("keyStatus").textContent="此模型需要先验证你自己的 API Key。";
  return;
 }
 S.provider=row.provider;S.model=row.id;S.modelTitle=row.name||row.id;
 updateModelTitle();hide("modelDialog");
 flashError("");
}
async function sendMessage(){
 if(S.busy)return;
 const prompt=$("prompt").value.trim();if(!prompt)return;
 if(!S.user){show("authDialog");return}
 if(S.provider!=="cloudflare"&&!S.keys[S.provider]){
  $("keyProvider").value=S.provider;show("keyDialog");return;
 }
 const freeRoute=S.provider==="cloudflare"||(S.provider==="openrouter"&&(S.model==="openrouter/free"||S.model.endsWith(":free")));
 if(!freeRoute&&!S.allowPaid){
  flashError("已选择的模型可能产生费用，请在「我的 AI 连接」中明确确认。");
  show("keyDialog");$("keyProvider").value=S.provider;return;
 }
 S.busy=true;$("sendBtn").disabled=true;hideWelcome();flashError("");
 const isNew=!S.chatId;
 appendMessage("user",prompt);$("prompt").value="";
 const loading=appendMessage("assistant","正在获取真实回复…");
 try{
  const result=await api("/api/chat",{chatId:S.chatId,provider:S.provider,model:S.model,message:prompt,
   mode:S.code?"code":"general",allowPaid:S.allowPaid,apiKey:S.provider==="cloudflare"?undefined:S.keys[S.provider]});
  S.chatId=result.chatId;loading.remove();appendMessage("assistant",result.reply,result.model);
  if(isNew)await fetchChats();else await fetchChats();
  void fetchMe();
 }catch(e){loading.remove();flashError(humanError(e));appendMessage("assistant","请求未完成："+humanError(e))}
 finally{S.busy=false;$("sendBtn").disabled=false;$("prompt").focus()}
}
async function loadCatalog(){
 if(S.loadedCatalog)return;
 $("modelCount").textContent="正在获取真实模型列表…";
 try{
  const d=await api("/api/models");
  S.freeModels=(d.freeModels||[]).map(m=>({...m,provider:"cloudflare"}));
  S.remoteModels=(d.models||[]).map(m=>({...m,provider:"openrouter"}));
  S.loadedCatalog=true;
  $("modelSummary").textContent=d.catalogError?"外部目录暂不可用，本站免费模型正常保留。":"从真实接口获取 "+S.remoteModels.length+" 个 OpenRouter 模型；其中免费与付费按实际价格标记。";
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
  const tag=node("span","price-tag"+(item.free?" free":""),item.free?"免费":"按账户计费");
  title.append(tag);info.append(title,node("small","",item.provider+" · "+item.id));
  const actionable=item.type==="text";
  const button=node("button","model-action",actionable?(S.model===item.id?"当前模型":"选择模型"):"媒体目录");
  button.disabled=!actionable||S.model===item.id;
  if(actionable)button.addEventListener("click",()=>setModel(item));
  row.append(info,button);list.append(row);
 }
}
function activateSource(name){
 S.source=name;S.modelPage=0;
 for(const el of els("#sourceChips .chip"))el.classList.toggle("active",el.dataset.source===name);
 renderModels();
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
 show("modelDialog");S.modelPage=0;void loadCatalog();
}
function openKeyPanel(){
 show("keyDialog");$("keyStatus").textContent="";
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
   const key=S.keys.grok;
   if(!key)throw Error("请先在「我的 AI 连接」填写并验证 Grok API Key");
   if(!$("confirmVideo").checked)throw Error("视频可能收费，请先勾选费用确认");
   const d=await api("/api/video",{prompt,model:$("videoModel").value,apiKey:key,confirmed:true});
   S.videoTask=d.requestId;
   $("createStatus").textContent="视频请求已提交，任务编号 "+d.requestId+"。点击「查询视频任务」获取结果。";
   $("refreshVideo").hidden=false;
  }
 }catch(e){$("createStatus").textContent="未完成："+humanError(e)}
 finally{btn.disabled=false}
}
async function queryVideo(){
 if(!S.videoTask||!S.keys.grok)return;
 $("refreshVideo").disabled=true;$("createStatus").textContent="正在查询真实视频任务…";
 try{
  const d=await api("/api/video/status",{requestId:S.videoTask,apiKey:S.keys.grok});
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
  S.keys.openrouter=result.key;
  const d=await api("/api/provider-models",{provider:"openrouter",apiKey:result.key});
  S.connected.openrouter=d.models||[];
  refreshSourceChips();
  $("keyProvider").value="openrouter";show("keyDialog");
  $("keyStatus").textContent="OpenRouter 官方账号授权成功，已发现 "+S.connected.openrouter.length+" 个模型。个人密钥只保存在当前页面内存中。";
 }catch(e){flashError("OpenRouter 授权失败："+humanError(e))}
}
async function login(event){
 event.preventDefault();
 const form=$("authForm"),email=form.elements.email.value.trim(),password=form.elements.password.value;
 $("authSubmit").disabled=true;$("authError").textContent="";
 try{
  const d=await api(S.authRegister?"/api/register":"/api/login",{email,password});
  S.user=d.user;hide("authDialog");form.reset();newChat();
  await Promise.all([fetchMe(),fetchChats()]);
 }catch(e){$("authError").textContent=humanError(e)}
 finally{$("authSubmit").disabled=false}
}
function toggleAuth(){
 S.authRegister=!S.authRegister;
 $("authTitle").textContent=S.authRegister?"注册 AIGZT 独立账号":"登录 AIGZT";
 $("authSubmit").textContent=S.authRegister?"免费注册":"登录";
 $("switchAuth").textContent=S.authRegister?"已有账号？立即登录":"还没有账号？免费注册";
 $("authError").textContent="";
}
async function account(){
 if(!S.user){show("authDialog");return}
 if(!confirm("确定退出当前 AIGZT 账号？聊天记录会保存在你的云端。"))return;
 try{await api("/api/logout",{});S.user=null;S.quota=null;S.chats=[];S.chatId=null;S.keys={};S.connected={};newChat();setAuthUI();renderHistory()}
 catch(e){flashError("退出失败："+humanError(e))}
}
async function verifyKey(event){
 event.preventDefault();
 if(!S.user){show("authDialog");return}
 const provider=$("keyProvider").value,key=$("personalKey").value.trim();
 if(!key){$("keyStatus").textContent="请输入自己的 API Key";return}
 $("keyStatus").textContent="正在向服务商读取真实模型…";
 try{
  const data=await api("/api/provider-models",{provider,apiKey:key});
  S.keys[provider]=key;S.connected[provider]=data.models||[];S.allowPaid=$("allowPaid").checked;
  refreshSourceChips();
  $("keyStatus").textContent="已连接 "+provider+" · 发现 "+S.connected[provider].length+" 个模型。密钥仅在当前页面内存中使用。";
  $("personalKey").value="";
 }catch(e){$("keyStatus").textContent="连接失败："+humanError(e)}
}
function wire(){
 $("menuBtn").addEventListener("click",openMenu);
 $("closeSide").addEventListener("click",closeMenu);$("sideShade").addEventListener("click",closeMenu);
 $("navChat").addEventListener("click",closeMenu);
 $("navModels").addEventListener("click",()=>{closeMenu();openModels()});
 $("navCreate").addEventListener("click",openCreate);
 $("navKeys").addEventListener("click",()=>{closeMenu();openKeyPanel()});
 $("newChat").addEventListener("click",newChat);$("headerNew").addEventListener("click",newChat);
 $("accountBtn").addEventListener("click",()=>void account());
 $("pickModel").addEventListener("click",openModels);
 $("composeModels").addEventListener("click",openModels);
 $("codeToggle").addEventListener("click",()=>{
  S.code=!S.code;$("codeToggle").classList.toggle("active",S.code);
  $("codeToggle").setAttribute("aria-pressed",String(S.code));
 });
 $("chatForm").addEventListener("submit",e=>{e.preventDefault();void sendMessage()});
 $("prompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();void sendMessage()}});
 for(const btn of els("[data-suggestion]"))btn.addEventListener("click",()=>{$("prompt").value=btn.dataset.suggestion;$("prompt").focus()});
 for(const btn of els("[data-close]"))btn.addEventListener("click",()=>hide(btn.dataset.close));
 $("authForm").addEventListener("submit",e=>void login(e));
 $("switchAuth").addEventListener("click",toggleAuth);
 $("keyForm").addEventListener("submit",e=>void verifyKey(e));
 $("openrouterLogin").addEventListener("click",()=>void beginOpenRouterOAuth().catch(e=>{$("keyStatus").textContent=humanError(e)}));
 $("keyProvider").addEventListener("change",e=>{$("openrouterLogin").hidden=e.target.value!=="openrouter"});
 $("modelSearch").addEventListener("input",e=>{S.query=e.target.value;S.modelPage=0;renderModels()});
 $("modelFilter").addEventListener("change",e=>{S.filter=e.target.value;S.modelPage=0;renderModels()});
 for(const btn of els("#sourceChips .chip"))btn.addEventListener("click",()=>activateSource(btn.dataset.source));
 $("moreModels").addEventListener("click",()=>{S.modelPage++;renderModels()});
 $("imageTab").addEventListener("click",()=>setCreationMode("image"));
 $("videoTab").addEventListener("click",()=>setCreationMode("video"));
 $("createButton").addEventListener("click",()=>void generateMedia());
 $("refreshVideo").addEventListener("click",()=>void queryVideo());
}
document.addEventListener("DOMContentLoaded",async()=>{
 wire();await fetchMe();await fetchChats();await finishOpenRouterOAuth();
 updateModelTitle();
});