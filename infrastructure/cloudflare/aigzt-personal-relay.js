// AIGZT per-user key relay. No owner AI keys, persistence, cookies, logs, redirects or arbitrary URL forwarding.
// All model requests use the key supplied by the caller and are charged, if any, to that caller's provider account.
const ORIGINS=new Set([
 "https://ai-unified-workspace--lq.tiniestcloud.app",
 "https://ai-unified-workspace--lq--preview.tiniestcloud.app"
]);
const SERVICES={
 openrouter:{base:"https://openrouter.ai",models:"/api/v1/models",chat:"/api/v1/chat/completions"},
 openai:{base:"https://api.openai.com",models:"/v1/models",chat:"/v1/responses"},
 grok:{base:"https://api.x.ai",models:"/v1/models",chat:"/v1/chat/completions"},
 gemini:{base:"https://generativelanguage.googleapis.com",models:"/v1beta/models"},
 qwen:{base:"https://dashscope-intl.aliyuncs.com",models:"/compatible-mode/v1/models",chat:"/compatible-mode/v1/chat/completions"},
 groq:{base:"https://api.groq.com",models:"/openai/v1/models",chat:"/openai/v1/chat/completions"},
 cerebras:{base:"https://api.cerebras.ai",models:"/v1/models",chat:"/v1/chat/completions"}
};
function reply(data,status=200,headers={}){
 return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff",...headers}});
}
function deny(message,status=400,headers={}){return reply({ok:false,error:message},status,headers)}
function getHeaders(origin){
 return origin&&ORIGINS.has(origin)?{
  "Access-Control-Allow-Origin":origin,
  "Access-Control-Allow-Methods":"POST,OPTIONS",
  "Access-Control-Allow-Headers":"Content-Type",
  "Vary":"Origin"
 }:{};
}
function niceError(status){
 if(status===401||status===403)return "服务商不接受该密钥或该模型权限不足";
 if(status===402)return "服务商账户余额不足或需要付费";
 if(status===429)return "服务商免费次数或速率额度已用尽";
 if(status===404)return "服务商模型不存在或已下架";
 if(status>=500)return "服务商暂时异常";
 return "服务商返回 HTTP "+status;
}
function safeModel(id){return typeof id==="string"&&id.length<180&&/^[a-zA-Z0-9._\/:-]+$/.test(id)}
async function readSmall(resp,max=1000000){
 const reader=resp.body?.getReader();
 if(!reader)return "";
 let size=0;const chunks=[];
 try{
  for(;;){
   const {done,value}=await reader.read();if(done)break;
   size+=value.byteLength;
   if(size>max){await reader.cancel();throw Error("响应体超过 1MB 安全上限")}
   chunks.push(value)
  }
 }finally{reader.releaseLock()}
 let all=new Uint8Array(size),offset=0;for(const v of chunks){all.set(v,offset);offset+=v.length}
 return new TextDecoder().decode(all)
}
async function relay(x,service,action){
 const outgoing={"Content-Type":"application/json","Accept":"application/json"};
 if(x.provider==="gemini")outgoing["x-goog-api-key"]=x.key;
 else outgoing.Authorization="Bearer "+x.key;
 if(x.provider==="openrouter")outgoing["HTTP-Referer"]="https://ai-unified-workspace--lq.tiniestcloud.app";
 let path=service.models,method="GET",body;
 if(action==="chat"){
  if(!safeModel(x.model))throw Error("模型 ID 不合法");
  const list=Array.isArray(x.messages)?x.messages.slice(-12):[];
  const messages=list.map(m=>({role:m.role==="assistant"?"assistant":"user",content:String(m.content||"").slice(0,4500)})).filter(m=>m.content);
  if(!messages.length||messages.at(-1).role!=="user")throw Error("请填写消息后再发送");
  const system=String(x.system||"").slice(0,8000);
  method="POST";
  if(x.provider==="gemini"){
   path="/v1beta/models/"+x.model+":generateContent";
   body={systemInstruction:{parts:[{text:system}]},contents:messages.map(m=>({role:m.role==="assistant"?"model":"user",parts:[{text:m.content}]}))};
  }else if(x.provider==="openai"){
   path=service.chat;body={model:x.model,instructions:system,input:messages};
  }else{
   path=service.chat;body={model:x.model,stream:false,max_tokens:1200,messages:[{role:"system",content:system},...messages]};
  }
 }

 if(action==="media_models"){
  if(x.provider==="grok")path=x.kind==="video"?"/v1/video-generation-models":"/v1/image-generation-models";
  else if(x.provider==="openai"&&x.kind==="image")path="/v1/models";
  else throw Error("当前服务商无受支持的媒体模型");
 }
 if(action==="image"||action==="video"){
  if(!safeModel(x.model))throw Error("媒体模型 ID 不合法");
  if(typeof x.prompt!=="string"||!x.prompt.trim()||x.prompt.length>1800)throw Error("创作内容为空或过长");
  if(x.confirmCharges!==true)throw Error("媒体生成可能收费，需先确认");
  if(action==="image"){
   if(x.provider!=="openai"&&x.provider!=="grok")throw Error("此图片服务暂未接入");
   path="/v1/images/generations";method="POST";
   body=x.provider==="openai"?{model:x.model,prompt:x.prompt,n:1,size:"1024x1024",quality:"low",output_format:"jpeg"}:{model:x.model,prompt:x.prompt,n:1};
  }else{
   if(x.provider!=="grok")throw Error("视频暂只支持 Grok Imagine");
   path="/v1/videos/generations";method="POST";
   body={model:x.model,prompt:x.prompt,duration:6,resolution:"720p",aspect_ratio:"16:9"};
  }
 }
 if(action==="video_status"){
  if(x.provider!=="grok"||typeof x.requestId!=="string"||!/^[A-Za-z0-9_-]{4,160}$/.test(x.requestId))throw Error("视频任务编号无效");
  path="/v1/videos/"+encodeURIComponent(x.requestId);
 }
 const url=new URL(path,service.base);
 if(url.hostname!==new URL(service.base).hostname)throw Error("不允许跨服务商地址");
 const res=await fetch(url.toString(),{method,headers:outgoing,...(body?{body:JSON.stringify(body)}:{}),redirect:"manual",signal:AbortSignal.timeout(19000)});
 if(res.status>=300&&res.status<400)return {ok:false,status:502,error:"服务商返回了重定向请求，已安全拦截；请检查服务商接口地址"};
 const raw=await readSmall(res,action==="image"?6500000:1000000);
 let data;try{data=JSON.parse(raw)}catch{data=null}
 if(!res.ok)return {ok:false,status:res.status,error:niceError(res.status)};
 if(!data||typeof data!=="object")return {ok:false,status:502,error:"服务商返回了非 JSON 内容"};

 if(action==="media_models"){
  if(x.provider==="openai")return {ok:true,status:200,models:(Array.isArray(data.data)?data.data:[]).filter(m=>typeof m.id==="string"&&m.id.startsWith("gpt-image-")).map(m=>({id:m.id,name:m.id}))};
  const items=Array.isArray(data.models)?data.models:Array.isArray(data.data)?data.data:[];
  return {ok:true,status:200,models:items.filter(m=>typeof m.id==="string").map(m=>({id:m.id,name:m.name||m.id}))};
 }
 if(action==="image"){
  const item=data.data?.[0];
  const imageUrl=typeof item?.url==="string"&&item.url.startsWith("https://")?item.url:null;
  const base64=typeof item?.b64_json==="string"?item.b64_json:null;
  if(!imageUrl&&!base64)return {ok:false,status:502,error:"图片 API 未返回有效图片"};
  return {ok:true,status:200,url:imageUrl,base64,model:x.model};
 }
 if(action==="video"){
  const requestId=typeof data.request_id==="string"?data.request_id:null;
  if(!requestId)return {ok:false,status:502,error:"视频 API 未返回任务编号"};
  return {ok:true,status:200,requestId,statusText:data.status||"pending"};
 }
 if(action==="video_status"){
  const videoUrl=typeof data.video?.url==="string"&&data.video.url.startsWith("https://")?data.video.url:null;
  return {ok:true,status:200,statusText:data.status||"pending",url:videoUrl,requestId:x.requestId,error:data.error?.message||null};
 }
 if(action==="models"){
  let models=[];
  if(x.provider==="gemini")models=Array.isArray(data.models)?
   data.models.filter(m=>m.name?.startsWith("models/gemini-")&&m.supportedGenerationMethods?.includes("generateContent")).map(m=>({id:m.name.slice(7),name:m.displayName||m.name})): [];
  else models=Array.isArray(data.data)?data.data.filter(m=>typeof m.id==="string").map(m=>({id:m.id,name:m.name||m.id})):[];
  if(x.provider==="openai")models=models.filter(m=>/^(gpt-|o[1-9])/.test(m.id)&&!/(image|video|audio|tts|transcribe|embedding|realtime)/i.test(m.id));
  if(x.provider==="grok")models=models.filter(m=>/^grok/.test(m.id)&&!/(image|video)/i.test(m.id));
  if(x.provider==="qwen")models=models.filter(m=>/^qwen/.test(m.id)&&!/(image|video|audio|tts|asr)/i.test(m.id));
  models=models.slice(0,250);
  return {ok:true,status:200,models};
 }
 const c=data?.choices?.[0]?.message?.content;
 const t=x.provider==="openai"?(
  data?.output_text||data?.output?.flatMap(v=>v.content||[]).map(v=>v.text||"").join("\n")
 ):x.provider==="gemini"?
  data?.candidates?.[0]?.content?.parts?.map(v=>v.text||"").join("\n"):c;
 if(typeof t!=="string"||!t.trim())return {ok:false,status:502,error:"服务商没有返回可读取的文本"};
 return {ok:true,status:200,content:t,model:data.model||x.model,provider:x.provider,usage:data.usage||null};
}
export default {
 async fetch(request,env){
  const url=new URL(request.url),origin=request.headers.get("Origin");
  const headers=getHeaders(origin);
  if(request.method==="OPTIONS"){
   return origin&&ORIGINS.has(origin)?new Response(null,{status:204,headers:{...headers,"Access-Control-Max-Age":"600"}}):deny("来源不被允许",403);
  }
  if(request.method==="GET"&&url.pathname==="/health")return reply({ok:true,service:"AIGZT 用户自带密钥安全中转",upstreamCredentialsStored:false});
  if(request.method!=="POST"||url.pathname!=="/v1/personal")return deny("未知路径",404,headers);
  if(!origin||!ORIGINS.has(origin))return deny("来源未授权",403,headers);
  if(Number(request.headers.get("Content-Length"))>64000)return deny("请求体太大",413,headers);
  if(env.GUARD){
   const check=await env.GUARD.limit({key:request.headers.get("CF-Connecting-IP")||"unknown"});
   if(!check.success)return deny("操作频繁，请稍后再试",429,headers)
  }
  let x;
  try{x=await request.json()}catch{return deny("请求必须是 JSON",400,headers)}
  const service=SERVICES[x?.provider],action=x?.action;
  if(!service||!["models","chat","media_models","image","video","video_status"].includes(action))return deny("不支持该服务商或操作",400,headers);
  if(typeof x.key!=="string"||x.key.length<12||x.key.length>1500||/[\r\n\0]/.test(x.key))return deny("需要填写本人有效的 API Key",400,headers);
  try{
   const result=await relay(x,service,action);
   return reply(result,result.ok?200:result.status===429?429:result.status>=500?502:400,headers);
  }catch(e){
   const msg=e instanceof Error?e.message:"未知服务异常";
   return deny(msg.includes("响应体")?msg:msg.includes("timeout")?"请求超时，请核对服务商实际请求状态":"服务商请求未完成："+msg,502,headers);
  }
 }
};