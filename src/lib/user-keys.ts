import type {ExternalProvider} from "@/lib/providers"
export type StoredKey={provider:ExternalProvider;version:1;salt:string;iv:string;cipher:string;iterations:number;createdAt:string}
export const PERSONAL_HOSTS:Record<ExternalProvider,string>={
 openai:"https://api.openai.com",grok:"https://api.x.ai",gemini:"https://generativelanguage.googleapis.com",
 qwen:"https://dashscope-intl.aliyuncs.com",openrouter:"https://openrouter.ai",groq:"https://api.groq.com",cerebras:"https://api.cerebras.ai"
}
const memory=new Map<ExternalProvider,string>()
const watchers=new Set<()=>void>()
function changed(){for(const w of watchers)w()}
export function watchPersonalKeys(f:()=>void):()=>void{watchers.add(f);return ()=>{watchers.delete(f)}}
export const hasPersonalKey=(id:ExternalProvider)=>Boolean(memory.get(id))
export function addPersonalKey(id:ExternalProvider,value:string){
 const key=value.trim()
 if(key.length<12||key.length>1500)throw Error("密钥长度不正确，请检查")
 memory.set(id,key);changed()
}
export function forgetPersonalKey(id:ExternalProvider){memory.delete(id);changed()}
function enc(bytes:Uint8Array){return btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(""))}
function dec(v:string){return Uint8Array.from(atob(v),c=>c.charCodeAt(0))}
async function derive(pass:string,salt:Uint8Array,iters:number){
 if(pass.length<12)throw Error("加密口令需要至少 12 个字符")
 const base=await crypto.subtle.importKey("raw",new TextEncoder().encode(pass),"PBKDF2",false,["deriveKey"])
 return crypto.subtle.deriveKey({name:"PBKDF2",hash:"SHA-256",salt:salt as BufferSource,iterations:iters},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"])
}
export async function encryptPersonalKey(id:ExternalProvider,pass:string){
 const value=memory.get(id)
 if(!value)throw Error("请先连接真实密钥")
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),iterations=240000
 const key=await derive(pass,salt,iterations)
 const ciphertext=await crypto.subtle.encrypt({name:"AES-GCM",iv:iv as BufferSource},key,new TextEncoder().encode(value))
 const doc:StoredKey={provider:id,version:1,salt:enc(salt),iv:enc(iv),cipher:enc(new Uint8Array(ciphertext)),iterations,createdAt:new Date().toISOString()}
 await tiny.db.set("my-secret:"+id,doc)
}
export async function unlockPersonalKey(id:ExternalProvider,pass:string){
 const doc=await tiny.db.get("my-secret:"+id) as StoredKey|null
 if(!doc||doc.provider!==id||doc.version!==1)throw Error("未找到当前账号的加密密钥")
 if(doc.iterations<100000||doc.iterations>700000)throw Error("不支持的加密版本")
 try{
  const key=await derive(pass,dec(doc.salt),doc.iterations)
  const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:dec(doc.iv) as BufferSource},key,dec(doc.cipher) as BufferSource)
  addPersonalKey(id,new TextDecoder().decode(plain))
 }catch{throw Error("解锁失败：密码不正确或加密内容损坏")}
}
export async function deletePersonalKey(id:ExternalProvider){await tiny.db.delete("my-secret:"+id);forgetPersonalKey(id)}
const RELAY="https://aigzt-personal-relay.slq520168.workers.dev/v1/personal"
async function textRelay(id:ExternalProvider,path:string,method:"GET"|"POST",json:unknown,key:string):Promise<unknown>{
 const isModels=method==="GET"
 let model="",system="",messages:{role:"system"|"user"|"assistant";content:string}[]=[]
 if(!isModels){
  const v=(json??{}) as {model?:string;instructions?:string;input?:{role?:string;content?:string}[];messages?:{role?:string;content?:string}[];systemInstruction?:{parts?:{text?:string}[]};contents?:{role?:string;parts?:{text?:string}[]}[]}
  if(id==="openai"){
   model=v.model??"";system=v.instructions??""
   messages=(v.input??[]).map(x=>({role:x.role==="assistant"?"assistant":"user",content:x.content??""}))
  }else if(id==="gemini"){
   model=decodeURIComponent(path.split("/").at(-1)?.split(":generateContent")[0]||"")
   system=(v.systemInstruction?.parts??[]).map(x=>x.text??"").join("\n")
   messages=(v.contents??[]).map(x=>({role:x.role==="model"?"assistant":"user",content:(x.parts??[]).map(y=>y.text??"").join("\n")}))
  }else{
   model=v.model??""
   const raw=v.messages??[]
   system=raw.filter(x=>x.role==="system").map(x=>x.content??"").join("\n")
   messages=raw.filter(x=>x.role!=="system").map(x=>({role:x.role==="assistant"?"assistant":"user",content:x.content??""}))
  }
 }
 const payload={provider:id,action:isModels?"models":"chat",key,...(isModels?{}:{model,system,messages})}
 const body=JSON.stringify(payload)
 if(new TextEncoder().encode(body).length>60000)throw Error("聊天上下文太大，请新开对话")
 let response:Response
 try{response=await fetch(RELAY,{method:"POST",cache:"no-store",credentials:"omit",referrerPolicy:"no-referrer",headers:{"Content-Type":"application/json"},body})}
 catch{throw Error("用户密钥中转服务不可用；不会自动改用站长密钥")}
 const result=await response.json().catch(()=>null) as {ok?:boolean;error?:string;models?:{id:string;name?:string}[];model?:string;content?:string}|null
 if(!response.ok||!result?.ok)throw Error(result?.error||"用户密钥请求失败 HTTP "+response.status)
 if(isModels){
  const list=result.models??[]
  if(id==="gemini")return {models:list.map(x=>({name:"models/"+x.id,displayName:x.name??x.id,supportedGenerationMethods:["generateContent"]}))}
  return {data:list}
 }
 const content=result.content??""
 if(!content)throw Error("模型未返回文本")
 return {model:result.model??model,output_text:content,choices:[{message:{content}}],candidates:[{content:{parts:[{text:content}]}}]}
}
export async function requestPersonal(id:ExternalProvider,path:string,method:"GET"|"POST"="GET",json?:unknown,override?:string):Promise<unknown>{
 const key=override||memory.get(id)
 if(!key)throw Error("当前未连接自己的 "+id+" API Key。可以先使用免费智能调度")
 const base=PERSONAL_HOSTS[id],target=new URL(path,base)
 if(target.origin!==base||target.protocol!=="https:")throw Error("仅允许官方 HTTPS API 地址")
 const isModels=method==="GET"&&(/\/models(?:\?|$)/.test(path)||path.includes("/models?"))
 const isChat=method==="POST"&&(/\/chat\/completions$/.test(path)||/\/responses$/.test(path)||/:generateContent$/.test(path))
 if(isModels||isChat)return textRelay(id,path,method,json,key)
 // Media APIs are routed separately; never inject another person's account key.
 const headers:Record<string,string>={Accept:"application/json"}
 if(id==="gemini")headers["x-goog-api-key"]=key
 else headers.Authorization="Bearer "+key
 if(method==="POST")headers["Content-Type"]="application/json"
 const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),24000)
 try{
  const res=await fetch(target.toString(),{method,headers,mode:"cors",credentials:"omit",cache:"no-store",referrerPolicy:"no-referrer",signal:ctl.signal,...(json===undefined?{}:{body:JSON.stringify(json)})})
  const payload=await res.json().catch(()=>null)
  if(!res.ok){
   const detail=(payload as {error?:{message?:string}}|null)?.error?.message?.slice(0,180)??""
   if(res.status===401||res.status===403)throw Error("个人密钥未授权 HTTP "+res.status+" "+detail)
   if(res.status===429)throw Error("你的免费额度或速率已用尽（429）")
   if(res.status===402)throw Error("服务商要求付费额度，已停止")
   throw Error("媒体接口 HTTP "+res.status+(detail?"："+detail:""))
  }
  return payload
 }catch(e){
  if(ctl.signal.aborted)throw Error("请求超时，已停止自动重试以防重复扣费")
  if(e instanceof TypeError)throw Error("该媒体 API 不支持浏览器直连，尚未开通密钥中转")
  throw e
 }finally{clearTimeout(timer)}
}
type MediaKind="image"|"video"
type MediaProvider="grok"|"openai"
type MediaRelay={ok?:boolean;error?:string;models?:{id:string;name?:string}[];url?:string|null;base64?:string|null;requestId?:string;statusText?:string}
async function mediaRelay(id:MediaProvider,action:"media_models"|"image"|"video"|"video_status",data:Record<string,unknown>={}):Promise<MediaRelay>{
 const key=memory.get(id);if(!key)throw Error("请先在「我的 AI 连接」中添加自己的 "+id+" API Key")
 const body=JSON.stringify({provider:id,key,action,...data})
 if(new TextEncoder().encode(body).length>61000)throw Error("媒体请求过大")
 let response:Response
 try{response=await fetch(RELAY,{method:"POST",headers:{"Content-Type":"application/json"},body,credentials:"omit",cache:"no-store",referrerPolicy:"no-referrer"})}
 catch{throw Error("媒体中转连接失败，请核对网络")}
 const result=await response.json().catch(()=>null) as MediaRelay|null
 if(!response.ok||!result?.ok)throw Error(result?.error||"媒体服务失败 HTTP "+response.status)
 return result
}
export async function personalMediaModels(provider:MediaProvider,kind:MediaKind){
 const result=await mediaRelay(provider,"media_models",{kind})
 if(!result.models?.length)throw Error("该服务商密钥没有 "+(kind==="video"?"视频":"图片")+" 模型权限")
 return result.models.map(x=>({id:x.id,name:x.name||x.id}))
}
export async function personalMediaGenerate(job:{kind:MediaKind;provider:MediaProvider;model:string;prompt:string}):Promise<unknown>{
 const action=job.kind==="image"?"image":"video"
 const result=await mediaRelay(job.provider,action,{model:job.model,prompt:job.prompt,confirmCharges:true})
 if(action==="image")return {data:[{url:result.url||undefined,b64_json:result.base64||undefined}]}
 if(!result.requestId)throw Error("视频任务没有返回有效编号")
 return {request_id:result.requestId,status:result.statusText||"pending"}
}
export async function personalMediaStatus(requestId:string):Promise<unknown>{
 const result=await mediaRelay("grok","video_status",{requestId})
 return {request_id:requestId,status:result.statusText||"pending",video:{url:result.url||undefined},...(result.error?{error:{message:result.error}}:{})}
}
const OAUTH_STATE="aigzt:openrouter:pkce"
const b64url=(v:Uint8Array)=>enc(v).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")
export async function beginOpenRouterOAuth(){
 const verifier=b64url(crypto.getRandomValues(new Uint8Array(32)))
 const state=b64url(crypto.getRandomValues(new Uint8Array(16)))
 const challenge=b64url(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(verifier))))
 // Ephemeral PKCE handshake only. Never persist API keys in web storage.
 sessionStorage.setItem(OAUTH_STATE,JSON.stringify({state,verifier,created:Date.now()}))
 const auth=new URL("https://openrouter.ai/auth")
 auth.searchParams.set("callback_url",window.location.origin+"/oauth/openrouter?state="+encodeURIComponent(state))
 auth.searchParams.set("code_challenge",challenge)
 auth.searchParams.set("code_challenge_method","S256")
 window.location.assign(auth.toString())
}
export async function finishOpenRouterOAuth(code:string,state:string|null){
 const saved=sessionStorage.getItem(OAUTH_STATE)
 sessionStorage.removeItem(OAUTH_STATE)
 if(!saved)throw Error("授权会话已失效，请重新点击 OpenRouter 登录")
 const v=JSON.parse(saved) as {state:string;verifier:string;created:number}
 if(!state||state!==v.state||Date.now()-v.created>600000||!v.verifier)throw Error("OAuth 状态验证失败，请重新授权")
 const r=await fetch("https://openrouter.ai/api/v1/auth/keys",{method:"POST",mode:"cors",credentials:"omit",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({code,code_verifier:v.verifier,code_challenge_method:"S256"})})
 if(!r.ok)throw Error("OpenRouter 授权交换失败（HTTP "+r.status+"）")
 const result=await r.json() as {key?:string}
 if(!result.key)throw Error("OpenRouter 没有返回授权密钥")
 addPersonalKey("openrouter",result.key)
}
