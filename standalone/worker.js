// AIGZT standalone Cloudflare Worker. Own hosting + D1 + R2 + external free model routing.
// Does not depend on Tiniest Cloud SDK or embed its branding.
// All passwords are PBKDF2-hashed; sessions stored as SHA-256 hashes.
// API keys are request-scoped, never saved in logs, cookies or the database.
const HTML=__HTML__;
const CSS=__CSS__;
const CLIENT=__CLIENT__;
const VERSION="aigzt-cf-4.3-chat-surface";
const USER_DAILY=8;
const SITE_DAILY=45;
const FREE_MODELS=[
 {id:"free:auto",name:"免费自动 · 多线路",provider:"free",type:"text",free:true},
 {id:"free:vireonix",name:"Vireonix 免费文本",provider:"free",type:"text",free:true},
 {id:"free:cehpoint",name:"Cehpoint 免费文本",provider:"free",type:"text",free:true},
 {id:"free:vexa",name:"Vexa · 免费对话",provider:"free",type:"text",free:true},
 {id:"free:groq",name:"Groq · 免费额度",provider:"free",type:"text",free:true}
];
const HOSTS={
 openrouter:{host:"openrouter.ai",path:"/api/v1/chat/completions",models:"/api/v1/models"},
 openai:{host:"api.openai.com",path:"/v1/responses",models:"/v1/models"},
 grok:{host:"api.x.ai",path:"/v1/chat/completions",models:"/v1/models"},
 gemini:{host:"generativelanguage.googleapis.com",models:"/v1beta/models"},
 qwen:{host:"dashscope-intl.aliyuncs.com",path:"/compatible-mode/v1/chat/completions",models:"/compatible-mode/v1/models"},
 groq:{host:"api.groq.com",path:"/openai/v1/chat/completions",models:"/openai/v1/models"},
 cerebras:{host:"api.cerebras.ai",path:"/v1/chat/completions",models:"/v1/models"}
};
const utf=s=>new TextEncoder().encode(s);
const hex=a=>Array.from(new Uint8Array(a),x=>x.toString(16).padStart(2,"0")).join("");
const random=n=>{const u=crypto.getRandomValues(new Uint8Array(n));return hex(u)};
const sha=async s=>hex(await crypto.subtle.digest("SHA-256",utf(s)));
function response(data,status=200,extra={}){
 return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff",...extra}});
}
function fail(msg,status=400){return response({ok:false,error:msg},status)}
function secureHeaders(ext={}){
 return {"x-content-type-options":"nosniff","referrer-policy":"no-referrer",
 "x-frame-options":"DENY","cross-origin-resource-policy":"same-origin",
 "content-security-policy":"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data: https:; font-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",...ext};
}
function staticResponse(text,type){
 return new Response(text,{headers:secureHeaders({"content-type":type,"cache-control":"no-store"})});
}
async function passwordHash(pass,salt){
 const material=await crypto.subtle.importKey("raw",utf(pass),"PBKDF2",false,["deriveBits"]);
 const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:Uint8Array.from(salt.match(/../g),h=>parseInt(h,16)),iterations:100000},material,256);
 return hex(bits);
}
function equal(a,b){
 if(typeof a!=="string"||typeof b!=="string")return false;
 let mismatch=a.length^b.length;
 for(let i=0;i<Math.max(a.length,b.length);i++)mismatch|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);
 return mismatch===0;
}
async function parseJSON(req){
 const length=Number(req.headers.get("content-length")||"0");
 if(length>64000)throw Error("请求超过64KB安全上限");
 if(!(req.headers.get("content-type")||"").includes("application/json"))throw Error("需要 JSON 请求");
 const text=await req.text();
 if(text.length>64000)throw Error("请求内容过大");
 try{return JSON.parse(text)}catch{throw Error("请求数据格式不正确")}
}
const dbGet=(db,sql,...args)=>db.prepare(sql).bind(...args).first();
const dbRun=(db,sql,...args)=>db.prepare(sql).bind(...args).run();
async function getUser(req,env){
 const cookie=req.headers.get("cookie")||"";
 const match=cookie.match(/(?:^|;\s*)aigzt_session=([a-f0-9]{64})(?:;|$)/);
 if(!match)return null;
 const digest=await sha(match[1]);
 const now=Date.now();
 return dbGet(env.DB,"SELECT u.id,u.email FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.tokenhash=? AND s.expires_at>? LIMIT 1",digest,now);
}
function requireUser(user){if(!user)throw Object.assign(new Error("请先登录自己的 AIGZT 账号"),{status:401})}
async function createSession(env,userId){
 const token=random(32),digest=await sha(token),now=Date.now();
 await dbRun(env.DB,"INSERT INTO sessions(tokenhash,user_id,expires_at,created_at) VALUES(?,?,?,?)",digest,userId,now+30*86400000,now);
 return "aigzt_session="+token+"; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000";
}
async function authentication(req,env,action){
 const value=await parseJSON(req),email=String(value.email||"").trim().toLowerCase(),pass=String(value.password||"");
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>150)return fail("邮箱格式不正确");
 if(pass.length<8||pass.length>160)return fail("密码长度须为8至160位");
 if(action==="register"){
  if(await dbGet(env.DB,"SELECT id FROM users WHERE email=?",email))return fail("该邮箱已经注册，请直接登录",409);
  const day=new Date().toISOString().slice(0,10),iphash=await sha(req.headers.get("cf-connecting-ip")||"unknown");
  const used=await dbGet(env.DB,"SELECT used FROM signup_limits WHERE day=? AND iphash=?",day,iphash);
  if((used?.used||0)>=100)return fail("当前网络注册过于频繁，请稍后再试",429);
  const salt=random(16),hash=await passwordHash(pass,salt),id=crypto.randomUUID(),now=Date.now();
  const inserted=await dbRun(env.DB,"INSERT INTO users(id,email,passhash,salt,created_at) VALUES(?,?,?,?,?) ON CONFLICT(email) DO NOTHING",id,email,hash,salt,now);
  if(!inserted.meta?.changes)return fail("该邮箱已经注册，请直接登录",409);
  await dbRun(env.DB,"INSERT INTO signup_limits(day,iphash,used) VALUES(?,?,1) ON CONFLICT(day,iphash) DO UPDATE SET used=used+1",day,iphash).catch(()=>{});
  return response({ok:true,user:{id,email}},201,{"set-cookie":await createSession(env,id)});
 }
 const row=await dbGet(env.DB,"SELECT id,email,passhash,salt FROM users WHERE email=?",email);
 const hashed=await passwordHash(pass,row?.salt||"e0".repeat(16));
 if(!row||!equal(hashed,row.passhash))return fail("邮箱或密码不正确",401);
 return response({ok:true,user:{id:row.id,email:row.email}},200,{"set-cookie":await createSession(env,row.id)});
}
function requireModelId(model){if(typeof model!=="string"||model.length>160||!/^[\w.:/-]+$/.test(model))throw Error("模型编号不合法")}
function truncate(s,max){return typeof s==="string"?s.slice(0,max):""}
async function listModels(env){
 const availableFree=FREE_MODELS.filter(m=>m.id!=="free:groq"||Boolean(env.GROQ_FREE_KEY));
 try{
 const url="https://openrouter.ai/api/v1/models";
 const req=new Request(url,{headers:{"Accept":"application/json"}});
 const cache=caches.default;
 const hit=await cache.match(req).catch(()=>null);
 let data;
 if(hit){data=await hit.json().catch(()=>null)}
 if(!data){
  const upstream=await fetch(url,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(12000)});
  if(!upstream.ok)throw Error("OpenRouter 模型目录暂时不可用："+upstream.status);
  data=await upstream.json();
  const rsp=new Response(JSON.stringify(data),{headers:{"content-type":"application/json","cache-control":"public,max-age=3600"}});
  await cache.put(req,rsp).catch(()=>{});
 }
 const list=Array.isArray(data?.data)?data.data:[];
 const models=list.filter(m=>typeof m.id==="string").map(m=>{
  const inMods=m.architecture?.input_modalities||[];
  const outMods=m.architecture?.output_modalities||[];
  const priceIn=m.pricing?.prompt??null,priceOut=m.pricing?.completion??null;
  const free=String(priceIn)==="0"&&String(priceOut)==="0";
  const media=outMods.includes("image")?"image":outMods.includes("video")?"video":"text";
  return {id:m.id,name:m.name||m.id,provider:m.id.split("/")[0]||"其他",type:media,free,
   context:m.context_length||null,inputPrice:priceIn,outputPrice:priceOut,availableWith:"openrouter-key",
   inputImages:inMods.includes("image"),description:truncate(m.description,160)};
 });
 return {ok:true,at:new Date().toISOString(),freeModels:availableFree,models,count:models.length};
 }catch(error){
  // A failed external catalog must not hide locally verified free models.
  return {ok:true,at:new Date().toISOString(),freeModels:availableFree,
   models:[],count:0,catalogError:"外部公开模型目录暂不可用；本站免费模型仍可使用"};
 }
}
async function providerModels(body){
 const id=String(body.provider||""),key=body.apiKey;
 if(!HOSTS[id])throw Error("不支持该服务商");
 if(typeof key!=="string"||key.length<12||key.length>1500)throw Error("请输入自己的有效 API Key");
 const h=HOSTS[id];
 const headers=id==="gemini"?{"x-goog-api-key":key}:{Authorization:"Bearer "+key};
 const resp=await fetch("https://"+h.host+h.models,{headers,redirect:"manual",signal:AbortSignal.timeout(12000)});
 if(resp.status>=300&&resp.status<400)throw Error("服务商要求跳转，已安全终止");
 if(!resp.ok)throw Error("服务商授权或查询失败，HTTP "+resp.status);
 const json=await resp.json();
 let models=id==="gemini"?(json.models||[]).filter(x=>x.name?.startsWith("models/gemini-")).map(x=>({id:x.name.slice(7),name:x.displayName||x.name})):
  (json.data||[]).filter(x=>x.id).map(x=>({id:x.id,name:x.name||x.id}));
 return {ok:true,models:models.slice(0,500)};
}
async function exchangeOpenRouter(body){
 const code=body?.code,verifier=body?.verifier;
 if(typeof code!=="string"||code.length<5||code.length>400||/[\r\n\0]/.test(code))throw Error("无效的 OpenRouter 登录授权代码");
 if(typeof verifier!=="string"||!/^[A-Za-z0-9_-]{43,128}$/.test(verifier))throw Error("OpenRouter 登录校验失败");
 const resp=await fetch("https://openrouter.ai/api/v1/auth/keys",{
  method:"POST",headers:{"content-type":"application/json",accept:"application/json"},
  body:JSON.stringify({code,code_verifier:verifier,code_challenge_method:"S256"}),
  redirect:"manual",signal:AbortSignal.timeout(15000)
 });
 if(resp.status>=300&&resp.status<400)throw Error("登录授权返回重定向，已停止");
 if(!resp.ok)throw Error("OpenRouter 官方授权失败，HTTP "+resp.status);
 const payload=await resp.json();
 if(typeof payload?.key!=="string"||!payload.key)throw Error("OpenRouter 没有返回授权密钥");
 return {ok:true,key:payload.key,provider:"openrouter"};
}
async function callExternal(provider,model,key,messages,consent){
 requireModelId(model);
 if(!HOSTS[provider])throw Error("不支持的个人服务商");
 if(typeof key!=="string"||key.length<12||key.length>1500||/[\r\n\0]/.test(key))throw Error("请先输入自己的 API Key");
 const isOpenRouterFree=provider==="openrouter"&&(model==="openrouter/free"||model.endsWith(":free"));
 if(!isOpenRouterFree&&consent!==true)throw Error("此线路可能使用本人付费额度，请先勾选费用确认");
 const host=HOSTS[provider],headers={"content-type":"application/json","accept":"application/json"};
 if(provider==="gemini")headers["x-goog-api-key"]=key;
 else headers.authorization="Bearer "+key;
 let target="https://"+host.host+(host.path||"/"),body;
 const history=messages.map(m=>({role:m.role,content:truncate(m.body,3000)}));
 if(provider==="gemini"){
  target="https://"+host.host+"/v1beta/models/"+model+":generateContent";
  body={contents:history.map(m=>({role:m.role==="assistant"?"model":"user",parts:[{text:m.content}]}))};
 }else if(provider==="openai"){
  body={model,input:history,max_output_tokens:750};
 }else{
  body={model,messages:history,max_tokens:750,stream:false};
 }
 const res=await fetch(target,{method:"POST",headers,body:JSON.stringify(body),redirect:"manual",signal:AbortSignal.timeout(20000)});
 if(res.status>=300&&res.status<400)throw Error("上游跳转已拦截");
 if(!res.ok)throw Error(res.status===429?"个人服务商额度或速率已用完":res.status===402?"需要充值：已停止请求":"个人服务商调用失败 HTTP "+res.status);
 const out=await res.json();
 const text=provider==="gemini"?(out.candidates?.[0]?.content?.parts||[]).map(x=>x.text||"").join("\n"):
 provider==="openai"?(out.output_text||(out.output||[]).flatMap(o=>o.content||[]).map(x=>x.text||"").join("\n")):
 out.choices?.[0]?.message?.content;
 if(typeof text!=="string"||!text.trim())throw Error("服务商没有返回有效文字");
 return {content:truncate(text,40000),actualModel:out.model||model};
}
async function quota(env,userId,kind="text"){
 const day=new Date().toISOString().slice(0,10)+(kind==="image"?":image":kind==="upload"?":upload":"");
 const userLimit=kind==="image"?2:kind==="upload"?15:USER_DAILY,siteLimit=kind==="image"?25:kind==="upload"?180:SITE_DAILY;
 const a=await dbRun(env.DB,"INSERT INTO usage_user(day,user_id,used) VALUES(?,?,1) ON CONFLICT(day,user_id) DO UPDATE SET used=used+1 WHERE used<?",day,userId,userLimit);
 if(!a.meta?.changes)throw Object.assign(new Error(kind==="image"?"今日免费图片次数已用完":kind==="upload"?"今日上传次数已用完":"今日免费聊天次数已用完"),{status:429});
 const b=await dbRun(env.DB,"INSERT INTO usage_site(day,used) VALUES(?,1) ON CONFLICT(day) DO UPDATE SET used=used+1 WHERE used<?",day,siteLimit);
 if(!b.meta?.changes){
  await dbRun(env.DB,"UPDATE usage_user SET used=MAX(0,used-1) WHERE day=? AND user_id=?",day,userId);
  throw Object.assign(new Error("网站今日免费总额度已用完，明天恢复"),{status:429});
 }
 return async()=>{await Promise.all([dbRun(env.DB,"UPDATE usage_user SET used=MAX(0,used-1) WHERE day=? AND user_id=?",day,userId),dbRun(env.DB,"UPDATE usage_site SET used=MAX(0,used-1) WHERE day=?",day)])};
}
async function freeText(env,messages,mode,preferred="free:auto"){
 const system=mode==="code"?"你是中文编程助手，提供可运行的代码与测试方法。":"你是中文 AI 助手，准确回答，不能编造事实。";
 const history=messages.map(m=>({role:m.role,content:truncate(m.body,3000)}));
 const sources=[
  {id:"vexa",endpoint:"https://vexa-ai.pages.dev/query",model:"vexa",ms:8500,query:true},
  {id:"vireonix",endpoint:"https://vireonix.ai/v1/chat/completions",model:"auto",ms:6500},
  {id:"cehpoint",endpoint:"https://ai-api.cehpoint.co.in/v1/chat/completions",model:"cehpoint-ai",ms:6500}
 ];
 if(env.OPENROUTER_FREE_KEY)sources.push({id:"openrouter",endpoint:"https://openrouter.ai/api/v1/chat/completions",model:"openrouter/free",key:env.OPENROUTER_FREE_KEY,ms:9000});
 if(env.GROQ_FREE_KEY)sources.push({id:"groq",endpoint:"https://api.groq.com/openai/v1/chat/completions",model:"llama-3.1-8b-instant",key:env.GROQ_FREE_KEY,ms:9000});
 const preferredId=preferred.split(":")[1],order=preferredId==="auto"?sources:[...sources.filter(x=>x.id===preferredId),...sources.filter(x=>x.id!==preferredId)];
 for(const source of order){
  try{
   const notes=history.filter(m=>m.role==="system").slice(-2).map(m=>m.content).join("\n").slice(0,2200);
   const recent=history.filter(m=>m.role!=="system").slice(-8).map(m=>(m.role==="assistant"?"助手":"用户")+"："+m.content).join("\n").slice(-3000);
   const payload=source.query?{prompt:system+"\n"+notes+"\n"+recent,model:source.model}:{model:source.model,messages:[{role:"system",content:system},...history],max_tokens:800,stream:false};
   const res=await fetch(source.endpoint,{method:"POST",headers:{"content-type":"application/json",accept:"application/json",...(source.key?{authorization:"Bearer "+source.key}:{})},body:JSON.stringify(payload),redirect:"manual",signal:AbortSignal.timeout(source.ms)});
   if(!res.ok||res.status>=300)continue;
   const out=await res.json(),content=source.query?(out.success===true?out.response:null):out?.choices?.[0]?.message?.content;
   const txt=typeof content==="string"?content:Array.isArray(content)?content.map(x=>x.text||"").join("\n"):"";
   if(txt.trim())return {content:truncate(txt,40000),actualModel:source.id+"/"+(out.model||source.model)};
  }catch{}
 }
 throw Object.assign(new Error("免费模型暂时繁忙，请重试或选择其他免费线路"),{status:503});
}
async function chat(req,env,user){
 requireUser(user);
 const body=await parseJSON(req),provider=body.provider==="free"?"free":String(body.provider||"free");
 const typed=truncate(body.message,8000).trim(),attachments=Array.isArray(body.attachments)?body.attachments:[];
 if(attachments.length>4)throw Error("一次最多四个附件");
 const lines=[],context=[];
 for(const id of attachments){
  if(typeof id!=="string"||!/^[0-9a-f-]{36}$/.test(id))throw Error("附件编号无效");
  const key=user.id+"/"+id,obj=await env.MEDIA?.head(key);
  if(!obj)throw Error("附件不存在或无权访问");
  const name=String(obj.customMetadata?.name||"附件").replace(/[\[\]()\r\n]/g," ").slice(0,100);
  lines.push("[文件："+name+"](/api/files/"+id+")");
  if(["text/plain","text/markdown","text/csv"].includes(obj.httpMetadata?.contentType)&&obj.size<100000){
   const entry=await env.MEDIA.get(key);
   context.push("附件 "+name+" 内容：\n"+(await entry.text()).slice(0,14000));
  }
 }
 const message=typed+(lines.length?"\n"+lines.join("\n"):"");
 if(!message.trim())throw Error("请输入消息或添加附件");
 const model=String(body.model||FREE_MODELS[0].id);
 requireModelId(model);
 if(provider==="free"&&(!FREE_MODELS.some(m=>m.id===model)||(model==="free:groq"&&!env.GROQ_FREE_KEY)))throw Error("此免费线路尚未连接");
 if(provider!=="free"&&!HOSTS[provider])throw Error("服务商不支持");
 let chatId=typeof body.chatId==="string"?body.chatId:null;
 const projectId=typeof body.projectId==="string"&&/^[0-9a-f-]{36}$/.test(body.projectId)?body.projectId:null;
 if(!chatId&&projectId&&!await dbGet(env.DB,"SELECT id FROM projects WHERE id=? AND user_id=?",projectId,user.id))throw Error("项目不存在");
 if(chatId){
  const found=await dbGet(env.DB,"SELECT id FROM chats WHERE id=? AND user_id=?",chatId,user.id);
  if(!found)throw Error("找不到该聊天，或没有访问权限");
 }else{
  chatId=crypto.randomUUID();
  await dbRun(env.DB,"INSERT INTO chats(id,user_id,title,provider,model,created_at,updated_at,project_id) VALUES(?,?,?,?,?,?,?,?)",chatId,user.id,message.slice(0,36),provider,model,Date.now(),Date.now(),projectId);
 }
 const messageId=crypto.randomUUID();
 await dbRun(env.DB,"INSERT INTO messages(id,chat_id,user_id,role,body,model,created_at) VALUES(?,?,?,?,?,?,?)",messageId,chatId,user.id,"user",message,model,Date.now());
 const previous=await env.DB.prepare("SELECT role,body FROM messages WHERE chat_id=? AND user_id=? ORDER BY created_at DESC LIMIT 12").bind(chatId,user.id).all();
 const messages=(previous.results||[]).reverse();
 // Bounded cross-chat context, explicit memory notes and project instructions.
 const preference=await dbGet(env.DB,"SELECT memory_enabled FROM user_preferences WHERE user_id=?",user.id);
 if(preference?.memory_enabled!==0){
  const notes=await env.DB.prepare("SELECT note FROM memory_notes WHERE user_id=? ORDER BY created_at DESC LIMIT 10").bind(user.id).all();
  const activeProject=await dbGet(env.DB,"SELECT project_id FROM chats WHERE id=? AND user_id=?",chatId,user.id);
  let project=null;
  if(activeProject?.project_id)project=await dbGet(env.DB,"SELECT name,instructions FROM projects WHERE id=? AND user_id=?",activeProject.project_id,user.id);
  const former=activeProject?.project_id?
    await env.DB.prepare("SELECT m.role,m.body,c.title FROM messages m JOIN chats c ON c.id=m.chat_id AND c.user_id=m.user_id WHERE m.user_id=? AND c.project_id=? AND c.id<>? ORDER BY m.created_at DESC LIMIT 8").bind(user.id,activeProject.project_id,chatId).all():
    await env.DB.prepare("SELECT m.role,m.body,c.title FROM messages m JOIN chats c ON c.id=m.chat_id AND c.user_id=m.user_id WHERE m.user_id=? AND c.id<>? ORDER BY m.created_at DESC LIMIT 6").bind(user.id,chatId).all();
  const contextParts=[];
  if(project){contextParts.push("项目："+project.name);if(project.instructions)contextParts.push("项目说明："+truncate(project.instructions,1500))}
  for(const n of notes.results||[])contextParts.push("用户明确保存的记忆："+truncate(n.note,250));
  const reversed=(former.results||[]).reverse();
  for(const m of reversed)contextParts.push("其他对话「"+truncate(m.title,50)+"」"+(m.role==="assistant"?"助手":"用户")+"："+truncate(m.body,380));
  if(contextParts.length)messages.unshift({role:"system",body:"以下是同一用户的相关上下文，仅作为参考；用户当前明确要求优先。\n"+contextParts.join("\n").slice(0,4300)});
 }
 if(context.length&&messages.length)messages[messages.length-1]={...messages[messages.length-1],body:message+"\n\n"+context.join("\n\n")};
 if(lines.length&&!context.length&&provider==="free"&&messages.length)messages[messages.length-1]={...messages[messages.length-1],body:message+"\n提示：外部免费文字模型不能直接解析图片或PDF像素，不要虚构文件内容。"};
 const mode=body.mode==="code"?"code":"general";
 let giveBack=null,result;
 try{
  if(provider==="free"){
   giveBack=await quota(env,user.id);
   result=await freeText(env,messages,mode,model);
  }else result=await callExternal(provider,model,body.apiKey,messages,body.allowPaid);

 }catch(e){
  if(giveBack)await giveBack().catch(()=>{});
  await dbRun(env.DB,"DELETE FROM messages WHERE id=? AND user_id=?",messageId,user.id).catch(()=>{});
  if(!body.chatId)await dbRun(env.DB,"DELETE FROM chats WHERE id=? AND user_id=?",chatId,user.id).catch(()=>{});
  throw e;
 }
 const stamp=Date.now();
 await dbRun(env.DB,"INSERT INTO messages(id,chat_id,user_id,role,body,model,created_at) VALUES(?,?,?,?,?,?,?)",crypto.randomUUID(),chatId,user.id,"assistant",result.content,result.actualModel,stamp);
 await dbRun(env.DB,"UPDATE chats SET provider=?,model=?,updated_at=? WHERE id=? AND user_id=?",provider,result.actualModel,stamp,chatId,user.id);
 return {ok:true,chatId,reply:result.content,model:result.actualModel,provider};
}

async function uploadFile(req,env,user){
 requireUser(user);
 if(!env.MEDIA)throw Object.assign(new Error("文件存储未配置"),{status:503});
 if(Number(req.headers.get("content-length")||0)>8500000)throw Object.assign(new Error("附件最多8MB"),{status:413});
 const reader=req.body?.getReader();
 if(!reader)throw Error("上传文件为空");
 const parts=[];let total=0;
 for(;;){
  const {done,value}=await reader.read();if(done)break;
  total+=value.byteLength;
  if(total>8500000){await reader.cancel().catch(()=>{});throw Object.assign(new Error("附件最多8MB"),{status:413})}
  parts.push(value);
 }
 const formReq=new Request(req.url,{method:"POST",headers:{"content-type":req.headers.get("content-type")||""},body:new Blob(parts)});
 const form=await formReq.formData(),file=form.get("file");
 if(!(file instanceof File))throw Error("请选择文件");
 const originalType=String(file.type||"").toLowerCase();
 const type=(originalType==="application/octet-stream"||!originalType)&&/\.(heic|heif)$/i.test(file.name)?(/\.heif$/i.test(file.name)?"image/heif":"image/heic"):originalType;
 if(!["image/jpeg","image/png","image/webp","image/gif","image/heic","image/heif","text/plain","text/markdown","text/csv","application/pdf"].includes(type))throw Error("仅支持常见图片、PDF、TXT、MD、CSV");
 if(!file.size||file.size>8000000)throw Error("单文件上限8MB");
 const name=String(file.name||"附件").replace(/[<>\x00-\x1f]/g,"").slice(0,110)||"附件";
 const id=crypto.randomUUID();
 const refund=await quota(env,user.id,"upload");
 try{await env.MEDIA.put(user.id+"/"+id,file.stream(),{httpMetadata:{contentType:type},customMetadata:{name}})}
 catch(e){await refund().catch(()=>{});throw e}
 return {ok:true,id,name,type,size:file.size,url:"/api/files/"+id};
}
async function readFile(env,user,id){
 requireUser(user);
 const obj=await env.MEDIA?.get(user.id+"/"+id);
 if(!obj)return fail("文件不存在或无权访问",404);
 const type=obj.httpMetadata?.contentType||"application/octet-stream";
 return new Response(obj.body,{headers:{"content-type":type,"cache-control":"private, no-store","x-content-type-options":"nosniff","content-security-policy":"default-src 'none'; sandbox","content-disposition":type.startsWith("image/")?"inline":"attachment"}});
}
async function mediaChat(req,env,user){
 requireUser(user);
 const b=await parseJSON(req),mode=String(b.mode||""),prompt=truncate(b.prompt,1400).trim();
 if(mode!=="image"&&mode!=="video")throw Error("创作模式无效");
 if(!prompt)throw Error("请输入创作描述");
 const exists=b.chatId?await dbGet(env.DB,"SELECT id FROM chats WHERE id=? AND user_id=?",b.chatId,user.id):null;
 if(b.chatId&&!exists)throw Error("会话不存在或没有权限");
 const mediaReq=new Request("https://internal.aigzt.invalid",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(mode==="image"?{prompt}:{prompt,model:"grok-imagine-video-1.5",apiKey:b.apiKey,confirmed:b.confirmed})});
 const result=mode==="image"?await createImage(mediaReq,env,user):await createVideo(mediaReq,user);
 const chatId=exists?.id||crypto.randomUUID(),now=Date.now(),reply=mode==="image"?"![生成图片]("+result.image+")":"视频任务已提交："+result.requestId+"（请使用自己的Grok额度查询进度）";
 if(!exists){const pid=typeof b.projectId==="string"&&/^[0-9a-f-]{36}$/.test(b.projectId)?b.projectId:null;
  if(pid&&!await dbGet(env.DB,"SELECT id FROM projects WHERE id=? AND user_id=?",pid,user.id))throw Error("项目不存在");
  await dbRun(env.DB,"INSERT INTO chats(id,user_id,title,provider,model,created_at,updated_at,project_id) VALUES(?,?,?,?,?,?,?,?)",chatId,user.id,prompt.slice(0,36),mode,mode,now,now,pid);}
 await env.DB.batch([
  env.DB.prepare("INSERT INTO messages(id,chat_id,user_id,role,body,model,created_at) VALUES(?,?,?,?,?,?,?)").bind(crypto.randomUUID(),chatId,user.id,"user",prompt,mode,now),
  env.DB.prepare("INSERT INTO messages(id,chat_id,user_id,role,body,model,created_at) VALUES(?,?,?,?,?,?,?)").bind(crypto.randomUUID(),chatId,user.id,"assistant",reply,result.model||mode,now+1),
  env.DB.prepare("UPDATE chats SET updated_at=? WHERE id=? AND user_id=?").bind(now+1,chatId,user.id)
 ]);
 return {ok:true,chatId,reply,model:result.model||mode,...(result.requestId?{requestId:result.requestId}:{})};
}

async function createImage(req,env,user){
 requireUser(user);
 const body=await parseJSON(req),prompt=truncate(body.prompt,1000).trim();
 if(!prompt)throw Error("请输入图片描述");
 if(!env.MEDIA)throw Object.assign(new Error("独立图片存储未绑定"),{status:503});
 const refund=await quota(env,user.id,"image");
 let lastError;
 for(const model of ["hd","flux","turbo-img"]){
  try{
   const res=await fetch("https://vexa-ai.pages.dev/image",{method:"POST",headers:{"content-type":"application/json",accept:"application/json"},body:JSON.stringify({prompt,model,preference:"quality"}),redirect:"manual",signal:AbortSignal.timeout(15000)});
   if(!res.ok||res.status>=300)throw Error(model+" 生成服务暂时不可用");
   const result=await res.json();
   const url=new URL(String(result.proxy_url||""));
   if(result.success!==true||result.model!==model||url.protocol!=="https:"||url.hostname!=="vexa-ai.pages.dev"||!url.pathname.startsWith("/image/proxy/"))throw Error("没有获得可信生成图片");
   if(!["deepai.org","pollinations.ai"].includes(result.source))throw Error("图片来源无效");
   const image=await fetch(url.href,{redirect:"manual",signal:AbortSignal.timeout(15000)});
   if(!image.ok||image.status>=300||!String(image.headers.get("content-type")||"").startsWith("image/"))throw Error("生成图片无法读取");
   const reader=image.body?.getReader();if(!reader)throw Error("图片内容为空");
   const chunks=[];let total=0;
   for(;;){
    const {done,value}=await reader.read();if(done)break;
    total+=value.byteLength;
    if(total>6_000_000){await reader.cancel().catch(()=>{});throw Error("生成图片超过6MB")}
    chunks.push(value);
   }
   if(total<1024)throw Error("生成图片文件无效");
   const data=new Uint8Array(total);let at=0;for(const part of chunks){data.set(part,at);at+=part.byteLength}
   const id=crypto.randomUUID();
   const mime=String(image.headers.get("content-type")||"").split(";")[0];
   await env.MEDIA.put(user.id+"/"+id,data,{httpMetadata:{contentType:mime},customMetadata:{name:"AI 生成图片"}});
   return {ok:true,image:"/api/files/"+id,model:"Vexa "+model+" · "+result.source};
  }catch(e){lastError=e}
 }
 await refund().catch(()=>{});
 throw Object.assign(new Error("免费作图线路暂时不可用，请稍后再试"),{status:503,cause:lastError});
}

async function createVideo(req,user){
 requireUser(user);
 const body=await parseJSON(req);
 if(body.confirmed!==true)throw Error("视频可能收费，必须明确确认");
 const key=body.apiKey,model=body.model,prompt=truncate(body.prompt,1400).trim();
 if(typeof key!=="string"||key.length<12||key.length>1500)throw Error("请先填写自己的 Grok API Key");
 if(model!=="grok-imagine-video-1.5")throw Error("仅支持经官方确认的 Grok Imagine Video 1.5 模型");
 if(!prompt)throw Error("请输入视频描述");
 const r=await fetch("https://api.x.ai/v1/videos/generations",{
  method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+key},
  body:JSON.stringify({model,prompt,duration:6,resolution:"720p"}),
  redirect:"manual",signal:AbortSignal.timeout(19000)
 });
 if(r.status>=300&&r.status<400)throw Error("上游重定向已安全拦截");
 if(!r.ok)throw Error(r.status===429?"个人视频额度或速率已用完":"Grok 视频提交失败 HTTP "+r.status);
 const data=await r.json();
 if(typeof data?.request_id!=="string")throw Error("视频服务没有返回任务编号");
 return {ok:true,requestId:data.request_id,status:data.status||"pending"};
}
async function queryVideo(req,user){
 requireUser(user);
 const body=await parseJSON(req);
 const key=body.apiKey,id=body.requestId;
 if(typeof key!=="string"||key.length<12||key.length>1500)throw Error("缺少 Grok 授权");
 if(typeof id!=="string"||!/^[A-Za-z0-9_-]{4,160}$/.test(id))throw Error("视频任务编号无效");
 const res=await fetch("https://api.x.ai/v1/videos/"+encodeURIComponent(id),{
  headers:{authorization:"Bearer "+key},redirect:"manual",signal:AbortSignal.timeout(16000)
 });
 if(res.status>=300&&res.status<400)throw Error("上游重定向已拦截");
 if(!res.ok)throw Error("查询视频任务失败 HTTP "+res.status);
 const data=await res.json();
 const url=typeof data?.video?.url==="string"&&data.video.url.startsWith("https://")?data.video.url:null;
 return {ok:true,status:data.status||"pending",url};
}
async function main(req,env){
 const url=new URL(req.url),path=url.pathname;
 if(req.method==="GET"&&(path==="/"||path==="/index.html"))return staticResponse(HTML,"text/html; charset=utf-8");
 if(req.method==="GET"&&path==="/style.css")return staticResponse(CSS,"text/css; charset=utf-8");
 if(req.method==="GET"&&path==="/app.js")return staticResponse(CLIENT,"application/javascript; charset=utf-8");
 if(req.method==="GET"&&path==="/manifest.webmanifest")return staticResponse(JSON.stringify({name:"AIGZT",short_name:"aigzt",description:"AI 统一聊天工作台",start_url:"/",scope:"/",display:"standalone",background_color:"#ffffff",theme_color:"#ffffff",icons:[{src:"/app-icon.svg",sizes:"any",type:"image/svg+xml",purpose:"any maskable"}]}),"application/manifest+json");
 if(req.method==="GET"&&path==="/app-icon.svg")return staticResponse('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="48" fill="#e8f4ef"/><path d="M48 143 88 46h16l40 97h-18l-11-29H77l-11 29H48zm35-44h26L96 64z" fill="#327f70"/><circle cx="148" cy="49" r="12" fill="#e6b654"/></svg>',"image/svg+xml");
 if(req.method==="GET"&&path==="/health")return response({ok:true,app:"AIGZT 独立工作台",version:VERSION,ownHosting:true,database:Boolean(env.DB),externalFreeOnly:true,storage:Boolean(env.MEDIA),limits:{perUserDaily:USER_DAILY,siteDaily:SITE_DAILY}});
 if(!path.startsWith("/api/"))return fail("路径不存在",404);
 if(req.method==="POST"){
  const origin=req.headers.get("origin");
  if(origin!==url.origin)return fail("来源校验失败",403);
  const ip=req.headers.get("cf-connecting-ip")||"unknown";
  if(env.RATE){
   const limit=await env.RATE.limit({key:ip+":"+path});
   if(!limit.success)return fail("操作过于频繁，请稍后再试",429);
  }
 }
 const user=await getUser(req,env);
 if(path==="/api/models"&&req.method==="GET")return response(await listModels(env));
 if(path==="/api/me"&&req.method==="GET"){
  const day=new Date().toISOString().slice(0,10);
  const u=user?await dbGet(env.DB,"SELECT used FROM usage_user WHERE day=? AND user_id=?",day,user.id):null;
  const site=await dbGet(env.DB,"SELECT used FROM usage_site WHERE day=?",day);
  return response({ok:true,user,quota:{remaining:user?Math.max(0,USER_DAILY-(u?.used||0)):0,limit:USER_DAILY,siteRemaining:Math.max(0,SITE_DAILY-(site?.used||0))}});
 }
 if(path==="/api/register"&&req.method==="POST")return authentication(req,env,"register");
 if(path==="/api/login"&&req.method==="POST")return authentication(req,env,"login");
 if(path==="/api/logout"&&req.method==="POST"){
  const match=(req.headers.get("cookie")||"").match(/aigzt_session=([a-f0-9]{64})/);
  if(match)await dbRun(env.DB,"DELETE FROM sessions WHERE tokenhash=?",await sha(match[1]));
  return response({ok:true},200,{"set-cookie":"aigzt_session=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0"});
 }
 if(!user)return fail("请先登录独立 AIGZT 账号",401);
 if(path==="/api/provider-models"&&req.method==="POST")return response(await providerModels(await parseJSON(req)));
 if(path==="/api/openrouter/exchange"&&req.method==="POST")return response(await exchangeOpenRouter(await parseJSON(req)));
 if(path==="/api/image"&&req.method==="POST")return response(await createImage(req,env,user));
 if(path==="/api/chat/media"&&req.method==="POST")return response(await mediaChat(req,env,user));
 if(path==="/api/files/upload"&&req.method==="POST")return response(await uploadFile(req,env,user));
 const fm=path.match(/^\/api\/files\/([0-9a-f-]{36})$/);
 if(fm&&req.method==="GET")return readFile(env,user,fm[1]);
 if(path==="/api/video"&&req.method==="POST")return response(await createVideo(req,user));
 if(path==="/api/video/status"&&req.method==="POST")return response(await queryVideo(req,user));
 if(path==="/api/chat"&&req.method==="POST")return response(await chat(req,env,user));
 
 if(path==="/api/projects"&&req.method==="GET"){
  const d=await env.DB.prepare("SELECT p.id,p.name,p.instructions,p.created_at,p.updated_at,(SELECT count(*) FROM chats c WHERE c.project_id=p.id AND c.user_id=p.user_id) AS chat_count FROM projects p WHERE p.user_id=? ORDER BY p.updated_at DESC LIMIT 40").bind(user.id).all();
  return response({ok:true,projects:d.results||[]});
 }
 if(path==="/api/projects"&&req.method==="POST"){
  const b=await parseJSON(req),name=truncate(b.name,60).trim();
  if(!name)return fail("请输入项目名称");
  const count=await dbGet(env.DB,"SELECT count(*) AS n FROM projects WHERE user_id=?",user.id);
  if((count?.n||0)>=40)return fail("项目数量达到上限",429);
  const id=crypto.randomUUID(),now=Date.now(),instructions=truncate(b.instructions,1500).trim();
  await dbRun(env.DB,"INSERT INTO projects(id,user_id,name,instructions,created_at,updated_at) VALUES(?,?,?,?,?,?)",id,user.id,name,instructions,now,now);
  return response({ok:true,project:{id,name,instructions,chat_count:0}});
 }
 const projHit=path.match(/^\/api\/projects\/([0-9a-f-]{36})\/(edit|delete)$/);
 if(projHit&&req.method==="POST"){
  const id=projHit[1],project=await dbGet(env.DB,"SELECT id,name,instructions FROM projects WHERE id=? AND user_id=?",id,user.id);
  if(!project)return fail("项目不存在",404);
  if(projHit[2]==="edit"){
   const b=await parseJSON(req),name=truncate(b.name,60).trim(),instructions=truncate(b.instructions,1500);
   if(!name)return fail("项目名称不能为空");
   await dbRun(env.DB,"UPDATE projects SET name=?,instructions=?,updated_at=? WHERE id=? AND user_id=?",name,instructions,Date.now(),id,user.id);
   return response({ok:true,project:{id,name,instructions}});
  }
  await env.DB.batch([
   env.DB.prepare("UPDATE chats SET project_id=NULL WHERE project_id=? AND user_id=?").bind(id,user.id),
   env.DB.prepare("DELETE FROM projects WHERE id=? AND user_id=?").bind(id,user.id)
  ]);
  return response({ok:true});
 }
 if(path==="/api/memory"&&req.method==="GET"){
  const pref=await dbGet(env.DB,"SELECT memory_enabled,theme FROM user_preferences WHERE user_id=?",user.id);
  const saved=await env.DB.prepare("SELECT id,note,created_at FROM memory_notes WHERE user_id=? ORDER BY created_at DESC LIMIT 50").bind(user.id).all();
  return response({ok:true,enabled:pref?.memory_enabled!==0,theme:pref?.theme||"rainbow",notes:saved.results||[]});
 }
 if(path==="/api/memory"&&req.method==="POST"){
  const b=await parseJSON(req),note=truncate(b.note,450).trim();
  if(!note)return fail("请输入记忆内容");
  const count=await dbGet(env.DB,"SELECT count(*) AS n FROM memory_notes WHERE user_id=?",user.id);
  if((count?.n||0)>=50)return fail("最多保存50条记忆",429);
  const id=crypto.randomUUID(),now=Date.now();
  await dbRun(env.DB,"INSERT INTO memory_notes(id,user_id,note,created_at) VALUES(?,?,?,?)",id,user.id,note,now);
  return response({ok:true,note:{id,note,created_at:now}});
 }
 const memHit=path.match(/^\/api\/memory\/([0-9a-f-]{36})\/delete$/);
 if(memHit&&req.method==="POST"){
  await dbRun(env.DB,"DELETE FROM memory_notes WHERE id=? AND user_id=?",memHit[1],user.id);
  return response({ok:true});
 }
 if(path==="/api/preferences"&&req.method==="POST"){
  const b=await parseJSON(req);
  if(typeof b.memoryEnabled!=="boolean"||!["rainbow","plain"].includes(b.theme))return fail("设置无效");
  await dbRun(env.DB,"INSERT INTO user_preferences(user_id,memory_enabled,theme) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET memory_enabled=excluded.memory_enabled,theme=excluded.theme",user.id,b.memoryEnabled?1:0,b.theme);
  return response({ok:true});
 }
 if(path==="/api/files"&&req.method==="GET"){
  const listing=await env.MEDIA.list({prefix:user.id+"/",limit:80,include:["customMetadata","httpMetadata"]});
  return response({ok:true,files:listing.objects.map(x=>({id:x.key.slice(user.id.length+1),name:x.customMetadata?.name||"附件",type:x.httpMetadata?.contentType||"",size:x.size,url:"/api/files/"+x.key.slice(user.id.length+1)}))});
 }
 if(path==="/api/chats/search"&&req.method==="GET"){
  const query=truncate(url.searchParams.get("q"),60).trim();
  if(!query)return response({ok:true,chats:[]});
  const escaped=query.replace(/[\\%_]/g,x=>"\\"+x),search="%"+escaped+"%";
  const r=await env.DB.prepare("SELECT DISTINCT c.id,c.title,c.updated_at,c.project_id,c.pinned_at,c.archived_at FROM chats c LEFT JOIN messages m ON m.chat_id=c.id AND m.user_id=c.user_id WHERE c.user_id=? AND (c.title LIKE ? ESCAPE '\\' OR m.body LIKE ? ESCAPE '\\') ORDER BY c.updated_at DESC LIMIT 35").bind(user.id,search,search).all();
  return response({ok:true,chats:r.results||[]});
 }

 if(path==="/api/chats"&&req.method==="GET"){
  const project=url.searchParams.get("project"),archived=url.searchParams.get("archived")==="1";
  const query=project?"SELECT id,title,provider,model,updated_at,project_id,pinned_at,archived_at FROM chats WHERE user_id=? AND project_id=? AND archived_at"+(archived?">0":"=0")+" ORDER BY pinned_at DESC,updated_at DESC LIMIT 100":
   "SELECT id,title,provider,model,updated_at,project_id,pinned_at,archived_at FROM chats WHERE user_id=? AND archived_at"+(archived?">0":"=0")+" ORDER BY pinned_at DESC,updated_at DESC LIMIT 100";
  const r=project&&/^[0-9a-f-]{36}$/.test(project)?await env.DB.prepare(query).bind(user.id,project).all():await env.DB.prepare("SELECT id,title,provider,model,updated_at,project_id,pinned_at,archived_at FROM chats WHERE user_id=? AND archived_at"+(archived?">0":"=0")+" ORDER BY pinned_at DESC,updated_at DESC LIMIT 100").bind(user.id).all();
  return response({ok:true,chats:r.results||[]});
 }
 const hit=path.match(/^\/api\/chats\/([0-9a-f-]{36})(?:\/(delete|rename|pin|archive|project))?$/);
 if(hit){
  const chatId=hit[1],cmd=hit[2];
  const c=await dbGet(env.DB,"SELECT id,title,pinned_at,archived_at,project_id FROM chats WHERE id=? AND user_id=?",chatId,user.id);
  if(!c)return fail("聊天不存在",404);
  if(!cmd&&req.method==="GET"){
   const r=await env.DB.prepare("SELECT id,role,body,model,created_at FROM messages WHERE chat_id=? AND user_id=? ORDER BY created_at ASC LIMIT 150").bind(chatId,user.id).all();
   return response({ok:true,chat:c,messages:r.results||[]});
  }
  if(req.method==="POST"&&cmd==="delete"){
   await env.DB.batch([
    env.DB.prepare("DELETE FROM messages WHERE chat_id=? AND user_id=?").bind(chatId,user.id),
    env.DB.prepare("DELETE FROM chats WHERE id=? AND user_id=?").bind(chatId,user.id)
   ]);
   return response({ok:true});
  }
  if(req.method==="POST"&&cmd==="pin"){
   const value=await parseJSON(req),pinned=value.pinned===true?Date.now():0;
   await dbRun(env.DB,"UPDATE chats SET pinned_at=? WHERE id=? AND user_id=?",pinned,chatId,user.id);
   return response({ok:true,pinned_at:pinned});
  }
  if(req.method==="POST"&&cmd==="archive"){
   const value=await parseJSON(req),archived=value.archived===true?Date.now():0;
   await dbRun(env.DB,"UPDATE chats SET archived_at=? WHERE id=? AND user_id=?",archived,chatId,user.id);
   return response({ok:true,archived_at:archived});
  }
  if(req.method==="POST"&&cmd==="project"){
   const value=await parseJSON(req),id=value.projectId===null?null:typeof value.projectId==="string"&&/^[0-9a-f-]{36}$/.test(value.projectId)?value.projectId:undefined;
   if(id===undefined)return fail("项目编号无效");
   if(id&&!await dbGet(env.DB,"SELECT id FROM projects WHERE id=? AND user_id=?",id,user.id))return fail("项目不存在",404);
   await dbRun(env.DB,"UPDATE chats SET project_id=? WHERE id=? AND user_id=?",id,chatId,user.id);
   return response({ok:true,projectId:id});
  }
  if(req.method==="POST"&&cmd==="rename"){
   const r=await parseJSON(req),title=truncate(r.title,80).trim();
   if(!title)return fail("标题不能为空");
   await dbRun(env.DB,"UPDATE chats SET title=?,updated_at=? WHERE id=? AND user_id=?",title,Date.now(),chatId,user.id);
   return response({ok:true});
  }
 }
 return fail("接口不存在",404);
}
export default {
 async fetch(req,env){
  try{return await main(req,env)}
  catch(e){
   const status=Number.isInteger(e?.status)?e.status:500;
   const msg=e instanceof Error?e.message:"内部处理异常";
   // Never expose upstream credentials or SQL errors to the visitor.
   const safe=status<500?msg:/额度|免费|模型|服务商|调用|超时|无法|限制|注册|API/.test(msg)?msg:"服务暂时不可用，请稍后再试";
   return fail(safe,status);
  }
 }
};