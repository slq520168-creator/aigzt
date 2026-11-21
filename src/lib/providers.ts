import type {WorkspaceMessage} from "@/lib/workspace"
export type ExternalProvider = "openai"|"grok"|"gemini"|"qwen"|"openrouter"|"groq"|"cerebras"
export type ModelEngine = "native"|"gateway"|ExternalProvider
export type ModelRecord={id:string;name?:string;description?:string}
export const KEY_PANEL="https://app.tiniest.cloud/?app=ai-unified-workspace--lq&panel=connections"
export const PROVIDERS:{id:ExternalProvider;name:string;detail:string;signup:string;freeNote:string;modelsPath:string;chatPath:string}[]=[
 {id:"openai",name:"GPT · OpenAI",detail:"GPT 对话、写代码；图片生成需单独授权",signup:"https://platform.openai.com/api-keys",freeNote:"API 按账户实际计费；ChatGPT 订阅不等于 API 免费额度",modelsPath:"/v1/models",chatPath:"/v1/responses"},
 {id:"grok",name:"Grok · xAI",detail:"Grok 对话、图像与视频创作",signup:"https://console.x.ai/",freeNote:"图像/视频通常计费，生成前要求明确确认",modelsPath:"/v1/models",chatPath:"/v1/chat/completions"},
 {id:"gemini",name:"Gemini · 谷歌",detail:"Google Gemini 对话和编程",signup:"https://aistudio.google.com/apikey",freeNote:"Google API 有单独配额；图片/视频与对话权限不一定相同",modelsPath:"/v1beta/models",chatPath:"/v1beta/models/"},
 {id:"qwen",name:"千问 · Qwen",detail:"千问、Qwen-Coder 编程模型",signup:"https://modelstudio.console.alibabacloud.com/",freeNote:"国际区域 API Key 与地址必须匹配，可能按量计费",modelsPath:"/compatible-mode/v1/models",chatPath:"/compatible-mode/v1/chat/completions"},
 {id:"openrouter",name:"OpenRouter",detail:"免费模型路由与集合",signup:"https://openrouter.ai/keys",freeNote:"只允许 openrouter/free 和 :free 模型",modelsPath:"/api/v1/models?limit=160&max_price=0&max_output_price=0&sort=pricing-low-to-high",chatPath:"/api/v1/chat/completions"},
 {id:"groq",name:"Groq",detail:"快速推理 · 开发者额度",signup:"https://console.groq.com/keys",freeNote:"免费额度以个人服务商账户为准",modelsPath:"/openai/v1/models",chatPath:"/openai/v1/chat/completions"},
 {id:"cerebras",name:"Cerebras",detail:"高速模型推理",signup:"https://cloud.cerebras.ai/",freeNote:"实际额度以个人服务商账户为准",modelsPath:"/v1/models",chatPath:"/v1/chat/completions"}
]
const getDef=(id:ExternalProvider)=>PROVIDERS.find(p=>p.id===id)!
function errStatus(status:number,id:ExternalProvider):string{
 const name=getDef(id).name
 if(status===401||status===403)return name+" 授权失败，请配置正确 API Key、访问区域及模型权限"
 if(status===402)return name+" 需要付费额度，已停止请求"
 if(status===429)return name+" 已触及配额或速率限制，请查看账户额度"
 if(status===408||status===504)return name+" 响应超时，请稍后手动重试"
 if(status>=500)return name+" 上游出现 HTTP "+status
 return name+" 返回 HTTP "+status+"；请检查模型与账户"
}
export async function providerRequest(id:ExternalProvider,path:string,method:"GET"|"POST"="GET",json?:unknown){
 let result:Awaited<ReturnType<typeof tiny.fetch>>
 try{result=await tiny.fetch(id,{path,method,...(json===undefined?{}:{json})})}
 catch(e){throw Error(id+" 安全连接未就绪或请求超时："+(e instanceof Error?e.message:String(e)))}
 if(!result.ok)throw Error(errStatus(result.status,id))
 return result.json
}
export async function listNativeModels(){
 const limits=await tiny.ai.limits()
 return {models:limits.models,remaining:limits.remaining,maxEffort:limits.max_effort}
}
function parseEntries(body:unknown):ModelRecord[]{
 if(!body||typeof body!=="object")throw Error("模型目录格式不正确")
 const x=body as {data?:unknown;models?:unknown}
 const data=Array.isArray(x.data)?x.data:Array.isArray(x.models)?x.models:null
 if(!data)throw Error("连接已响应但未返回模型目录")
 return data.filter(v=>v&&typeof v==="object"&&(typeof v.id==="string"||typeof v.name==="string"))
  .map(v=>({id:String(v.id||v.name),name:typeof v.name==="string"?v.name:undefined}))
}
export async function discoverProviderModels(id:ExternalProvider):Promise<ModelRecord[]>{
 const data=await providerRequest(id,getDef(id).modelsPath)
 let models:ModelRecord[]
 if(id==="gemini"){
  const list=(data as {models?:{name?:string;displayName?:string;supportedGenerationMethods?:string[]}[]})?.models
  if(!Array.isArray(list))throw Error("Google 未返回有效的 Gemini 模型目录")
  models=list.filter(x=>x.name?.startsWith("models/gemini-")&&x.supportedGenerationMethods?.includes("generateContent")&&!/(image|video|veo|imagen)/i.test(x.name))
   .map(x=>({id:x.name!.replace(/^models\//,""),name:x.displayName||x.name!.replace(/^models\//,"")}))
 }else{
  models=parseEntries(data)
  if(id==="openai")models=models.filter(m=>/^(gpt-|o[1-9])/.test(m.id)&&!/(image|audio|realtime|transcribe|tts|embed|moderation|search|video)/i.test(m.id))
  if(id==="grok")models=models.filter(m=>m.id.startsWith("grok")&&!/(image|video|imagine)/i.test(m.id))
  if(id==="qwen")models=models.filter(m=>/^qwen/i.test(m.id)&&!/(image|video|wan-|tts|asr|audio|embed)/i.test(m.id))
  if(id==="openrouter")models=[{id:"openrouter/free",name:"免费智能路由"},...models.filter(m=>m.id.endsWith(":free"))]
 }
 models=Array.from(new Map(models.map(m=>[m.id,m])).values())
 if(!models.length)throw Error(getDef(id).name+" 已连接，但没有返回兼容文本聊天的模型；请核对权限和模型目录")
 return models.slice(0,250)
}
function extractResponseText(data:unknown):string{
 const body=data as {output_text?:string;output?:{content?:{type?:string;text?:string}[]}[];choices?:{message?:{content?:unknown}}[];candidates?:{content?:{parts?:{text?:string}[]}}[]}|null
 if(typeof body?.output_text==="string"&&body.output_text.trim())return body.output_text
 const openai=body?.output?.flatMap(v=>v.content??[]).map(v=>v.text??"").join("\n").trim()
 if(openai)return openai
 const choice=body?.choices?.[0]?.message?.content
 if(typeof choice==="string"&&choice.trim())return choice
 const gemini=body?.candidates?.[0]?.content?.parts?.map(v=>v.text??"").join("\n").trim()
 if(gemini)return gemini
 throw Error("该模型未返回可读取的文本；请确认该模型支持文本输出")
}
export async function completeProvider(
 id:ExternalProvider,model:string,messages:WorkspaceMessage[],system:string
):Promise<{content:string;route:string}>{
 if(!model||model==="auto")throw Error("先选择一个真实模型")
 if(id==="openrouter"&&model!=="openrouter/free"&&!model.endsWith(":free"))throw Error("OpenRouter 禁止自动转入付费模型")
 const subset=messages.slice(-12).map(m=>({role:m.role,content:m.content.slice(0,8500)}))
 let response:unknown
 if(id==="gemini"){
  if(!/^[\w.-]+$/.test(model))throw Error("无效的 Gemini 模型 ID")
  response=await providerRequest(id,"/v1beta/models/"+model+":generateContent","POST",{
   systemInstruction:{parts:[{text:system.slice(0,10000)}]},
   contents:subset.map(m=>({role:m.role==="assistant"?"model":"user",parts:[{text:m.content}]}))
  })
 }else if(id==="openai"){
  response=await providerRequest(id,"/v1/responses","POST",{
   model,instructions:system.slice(0,10000),input:subset.map(m=>({role:m.role,content:m.content}))
  })
 }else{
  response=await providerRequest(id,getDef(id).chatPath,"POST",{
   model,stream:false,
   messages:[{role:"system",content:system.slice(0,10000)},...subset]
  })
 }
 return {content:extractResponseText(response),route:model}
}
export function engineName(e:ModelEngine){
 if(e==="native")return "平台内置 AI"
 if(e==="gateway")return "FreeLLMAPI"
 return getDef(e).name
}
export function modelName(e:ModelEngine,m:string){
 if(e==="native")return m==="auto"?"平台自动选择":m
 if(e==="openrouter"&&m==="openrouter/free")return "免费智能路由"
 if(e==="gateway"&&m==="auto")return "免费网关自动路由"
 return m==="auto"?"请选择模型":m
}
