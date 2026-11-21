// AIGZT standalone Cloudflare Worker. Own hosting + D1 + Workers AI.
// Does not depend on Tiniest Cloud SDK or embed its branding.
// All passwords are PBKDF2-hashed; sessions stored as SHA-256 hashes.
// API keys are request-scoped, never saved in logs, cookies or the database.
const HTML=__HTML__;
const CSS=__CSS__;
const CLIENT=__CLIENT__;
const VERSION="aigzt-cf-1";
const USER_DAILY=8;
const SITE_DAILY=45;
const FREE_MODELS=[
 {id:"@cf/meta/llama-3.1-8b-instruct-fast",name:"Llama 3.1 · 免费",provider:"Cloudflare",type:"text",free:true},
 {id:"@cf/zai-org/glm-4.7-flash",name:"GLM 4.7 Flash · 免费",provider:"Cloudflare",type:"text",free:true},
 {id:"@cf/google/gemma-4-26b-a4b-it",name:"Gemma 4 · 免费",provider:"Cloudflare",type:"text",free:true}
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
 return new Response(text,{headers:secureHeaders({"content-type":type,"cache-control":"public, max-age=300"})});
}
async function passwordHash(pass,salt){
 const material=await crypto.subtle.importKey("raw",utf(pass),"PBKDF2",false,["deriveBits"]);
 const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:Uint8Array.from(salt.match(/../g),h=>parseInt(h,16)),iterations:120000},material,256);
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
 const value=await parseJSON(req);
 const email=String(value.email||"").trim().toLowerCase();
 const pass=String(value.password||"");
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>150)return fail("邮箱格式不正确");
 if(pass.length<12||pass.length>160)return fail("密码至少12位，最多160位");
 if(action==="register"){
  const salt=random(16),hash=await passwordHash(pass,salt),id=crypto.randomUUID(),now=Date.now();
  try{await dbRun(env.DB,"INSERT INTO users(id,email,passhash,salt,created_at) VALUES(?,?,?,?,?)",id,email,hash,salt,now)}
  catch{return fail("该邮箱已注册，请登录",409)}
  const cookie=await createSession(env,id);
  return response({ok:true,user:{id,email}},201,{"set-cookie":cookie});
 }
 const row=await dbGet(env.DB,"SELECT id,email,passhash,salt FROM users WHERE email=?",email);
 // Keep computation even when the email does not exist to reduce enumeration.
 const attempt=await passwordHash(pass,row?.salt||"e0".repeat(16));
 if(!row||!equal(attempt,row.passhash))return fail("邮箱或密码不正确",401);
 const cookie=await createSession(env,row.id);
 return response({ok:true,user:{id:row.id,email:row.email}},200,{"set-cookie":cookie});
}
function requireModelId(model){if(typeof model!=="string"||model.length>160||!/^[\w.:/-]+$/.test(model))throw Error("模型编号不合法")}
function truncate(s,max){return typeof s==="string"?s.slice(0,max):""}
async function listModels(){
 const url="https://openrouter.ai/api/v1/models";
 const req=new Request(url,{headers:{"Accept":"application/json"}});
 const cache=caches.default;
 const hit=await cache.match(req);
 let data;
 if(hit){data=await hit.json().catch(()=>null)}
 if(!data){
  const upstream=await fetch(url,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(12000)});
  if(!upstream.ok)throw Error("OpenRouter 模型目录暂时不可用："+upstream.status);
  data=await upstream.json();
  const rsp=new Response(JSON.stringify(data),{headers:{"content-type":"application/json","cache-control":"public,max-age=3600"}});
  await cache.put(req,rsp);
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
 return {ok:true,at:new Date().toISOString(),freeModels:FREE_MODELS,models,count:models.length};
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
async function quota(env,userId){
 const day=new Date().toISOString().slice(0,10);
 const a=await dbRun(env.DB,"INSERT INTO usage_user(day,user_id,used) VALUES(?,?,1) ON CONFLICT(day,user_id) DO UPDATE SET used=used+1 WHERE used<?",day,userId,USER_DAILY);
 if(!a.meta?.changes)throw Object.assign(new Error("今日免费对话次数已用完"),{status:429});
 const b=await dbRun(env.DB,"INSERT INTO usage_site(day,used) VALUES(?,1) ON CONFLICT(day) DO UPDATE SET used=used+1 WHERE used<?",day,SITE_DAILY);
 if(!b.meta?.changes){
  await dbRun(env.DB,"UPDATE usage_user SET used=MAX(0,used-1) WHERE day=? AND user_id=?",day,userId);
  throw Object.assign(new Error("网站今日免费总额度已用完，明天恢复"),{status:429});
 }
 return async()=>{await Promise.all([dbRun(env.DB,"UPDATE usage_user SET used=MAX(0,used-1) WHERE day=? AND user_id=?",day,userId),dbRun(env.DB,"UPDATE usage_site SET used=MAX(0,used-1) WHERE day=?",day)])};
}
async function chat(req,env,user){
 requireUser(user);
 const body=await parseJSON(req),provider=body.provider==="cloudflare"?"cloudflare":String(body.provider||"cloudflare");
 const message=truncate(body.message,8000).trim();
 if(!message)throw Error("请填写消息");
 const model=String(body.model||FREE_MODELS[0].id);
 requireModelId(model);
 if(provider==="cloudflare"&&!FREE_MODELS.some(m=>m.id===model))throw Error("此模型不是已经核准的免费模型");
 if(provider!=="cloudflare"&&!HOSTS[provider])throw Error("服务商不支持");
 let chatId=typeof body.chatId==="string"?body.chatId:null;
 if(chatId){
  const found=await dbGet(env.DB,"SELECT id FROM chats WHERE id=? AND user_id=?",chatId,user.id);
  if(!found)throw Error("找不到该聊天，或没有访问权限");
 }else{
  chatId=crypto.randomUUID();
  await dbRun(env.DB,"INSERT INTO chats(id,user_id,title,provider,model,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",chatId,user.id,message.slice(0,36),provider,model,Date.now(),Date.now());
 }
 const messageId=crypto.randomUUID();
 await dbRun(env.DB,"INSERT INTO messages(id,chat_id,user_id,role,body,model,created_at) VALUES(?,?,?,?,?,?,?)",messageId,chatId,user.id,"user",message,model,Date.now());
 const previous=await env.DB.prepare("SELECT role,body FROM messages WHERE chat_id=? AND user_id=? ORDER BY created_at DESC LIMIT 12").bind(chatId,user.id).all();
 const messages=(previous.results||[]).reverse();
 const mode=body.mode==="code"?"code":"general";
 let giveBack=null,result;
 try{
  if(provider==="cloudflare"){
   giveBack=await quota(env,user.id);
   const system=mode==="code"?"你是 AIGZT 编程助手，请提供完整可用的代码、错误处理及测试步骤，不要声称你已运行代码。":"你是 AIGZT AI 中文助手，请准确回应，不编造事实。";
   const out=await env.AI.run(model,{messages:[{role:"system",content:system},...messages.map(m=>({role:m.role,content:truncate(m.body,3000)}))],max_tokens:900});
   const text=typeof out?.response==="string"?out.response:typeof out?.result?.response==="string"?out.result.response:null;
   if(!text||!text.trim())throw Error("免费模型没有返回有效内容");
   result={content:truncate(text,40000),actualModel:model};
  }else result=await callExternal(provider,model,body.apiKey,messages,body.allowPaid);
 }catch(e){
  if(giveBack)await giveBack().catch(()=>{});
  throw e;
 }
 const stamp=Date.now();
 await dbRun(env.DB,"INSERT INTO messages(id,chat_id,user_id,role,body,model,created_at) VALUES(?,?,?,?,?,?,?)",crypto.randomUUID(),chatId,user.id,"assistant",result.content,result.actualModel,stamp);
 await dbRun(env.DB,"UPDATE chats SET provider=?,model=?,updated_at=? WHERE id=? AND user_id=?",provider,model,stamp,chatId,user.id);
 return {ok:true,chatId,reply:result.content,model:result.actualModel,provider};
}
async function main(req,env){
 const url=new URL(req.url),path=url.pathname;
 if(req.method==="GET"&&(path==="/"||path==="/index.html"))return staticResponse(HTML,"text/html; charset=utf-8");
 if(req.method==="GET"&&path==="/style.css")return staticResponse(CSS,"text/css; charset=utf-8");
 if(req.method==="GET"&&path==="/app.js")return staticResponse(CLIENT,"application/javascript; charset=utf-8");
 if(req.method==="GET"&&path==="/health")return response({ok:true,app:"AIGZT 独立工作台",version:VERSION,ownHosting:true,database:Boolean(env.DB),freeAI:Boolean(env.AI),limits:{perUserDaily:USER_DAILY,siteDaily:SITE_DAILY}});
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
 if(path==="/api/models"&&req.method==="GET")return response(await listModels());
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
 if(path==="/api/chat"&&req.method==="POST")return response(await chat(req,env,user));
 if(path==="/api/chats"&&req.method==="GET"){
  const r=await env.DB.prepare("SELECT id,title,provider,model,updated_at FROM chats WHERE user_id=? ORDER BY updated_at DESC LIMIT 80").bind(user.id).all();
  return response({ok:true,chats:r.results||[]});
 }
 const hit=path.match(/^\/api\/chats\/([0-9a-f-]{36})(?:\/(delete|rename))?$/);
 if(hit){
  const chatId=hit[1],cmd=hit[2];
  const c=await dbGet(env.DB,"SELECT id,title FROM chats WHERE id=? AND user_id=?",chatId,user.id);
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