import type {WorkspaceMessage} from "@/lib/workspace"

export type ExternalProvider = "openrouter"|"groq"|"cerebras"
export type ModelEngine = "native"|"gateway"|ExternalProvider
export type ModelRecord = {id:string;name?:string;description?:string}

export const KEY_PANEL = "https://app.tiniest.cloud/?app=ai-unified-workspace--lq&panel=connections"

export const PROVIDERS: {id:ExternalProvider;name:string;detail:string;signup:string;freeNote:string;modelsPath:string;chatPath:string}[] = [
 {id:"openrouter",name:"OpenRouter",detail:"免费模型集合与免费自动路由",signup:"https://openrouter.ai/keys",freeNote:"只允许 openrouter/free 与 :free 型号，禁止付费路由",modelsPath:"/api/v1/models?limit=160&max_price=0&max_output_price=0&sort=pricing-low-to-high",chatPath:"/api/v1/chat/completions"},
 {id:"groq",name:"Groq",detail:"快速推理 · 开发者免费额度",signup:"https://console.groq.com/keys",freeNote:"具体可用额度由 Groq 账户决定；不保证永久免费",modelsPath:"/openai/v1/models",chatPath:"/openai/v1/chat/completions"},
 {id:"cerebras",name:"Cerebras",detail:"高速模型推理 · 开发者额度",signup:"https://cloud.cerebras.ai/",freeNote:"具体免费配额及费用以 Cerebras 账户为准",modelsPath:"/v1/models",chatPath:"/v1/chat/completions"},
]

const PATHS:Record<ExternalProvider,{models:string;chat:string}>=Object.fromEntries(PROVIDERS.map(p=>[p.id,{models:p.modelsPath,chat:p.chatPath}])) as Record<ExternalProvider,{models:string;chat:string}>

function statusMessage(status:number,provider:ExternalProvider){
 const name=PROVIDERS.find(p=>p.id===provider)?.name??provider
 if(status===401||status===403)return name+" 未授权：请在安全连接面板设置有效 API Key"
 if(status===429)return name+" 免费配额或速率限制已达到，请稍后重试"
 if(status===402)return name+" 要求付费，本次未继续请求"
 if(status===408||status===504)return name+" 响应超时，请稍后重试"
 if(status>=500)return name+" 上游服务异常（HTTP "+status+"）"
 return name+" 返回 HTTP "+status+"，请确认模型仍可用"
}
function parseCatalog(value:unknown):ModelRecord[]{
 if(!value||typeof value!=="object"||!("data" in value))throw Error("服务商返回了不符合预期的模型目录")
 const data=(value as {data:unknown}).data
 if(!Array.isArray(data))throw Error("服务商返回了不符合预期的模型目录")
 return data.filter((x):x is ModelRecord=>Boolean(x)&&typeof x==="object"&&typeof (x as {id?:unknown}).id==="string")
 .map(x=>({id:x.id,name:typeof x.name==="string"?x.name:undefined}))
}
export async function listNativeModels(){
 const limits=await tiny.ai.limits()
 return {models:limits.models,remaining:limits.remaining,maxEffort:limits.max_effort}
}
export async function discoverProviderModels(provider:ExternalProvider):Promise<ModelRecord[]>{
 let response:Awaited<ReturnType<typeof tiny.fetch>>
 try{response=await tiny.fetch(provider,{path:PATHS[provider].models,method:"GET"})}
 catch(e){throw Error("连接不可用：请到安全连接面板设置 "+provider+" 的 API Key。"+(e instanceof Error?" "+e.message:""))}
 if(!response.ok)throw Error(statusMessage(response.status,provider))
 let models=parseCatalog(response.json)
 if(provider==="openrouter"){
  // A free-only guard is enforced again at completion time. Price-zero paid
  // variants are deliberately excluded since zero price may be temporary.
  models=models.filter(m=>m.id.endsWith(":free"))
  models.unshift({id:"openrouter/free",name:"免费模型自动选择"})
 }
 if(models.length===0)throw Error("连接已响应，但没有返回允许使用的聊天模型")
 return Array.from(new Map(models.map(m=>[m.id,m])).values())
}
export async function completeProvider(
 provider:ExternalProvider,
 model:string,
 messages:WorkspaceMessage[],
 system:string
):Promise<{content:string;route:string}>{
 if(!model||model==="auto")throw Error("请先选择一个真实模型")
 if(provider==="openrouter"&&model!=="openrouter/free"&&!model.endsWith(":free")){
  throw Error("为了避免产生费用，OpenRouter 只能使用 openrouter/free 或 :free 模型")
 }
 const path=PATHS[provider].chat
 let response:Awaited<ReturnType<typeof tiny.fetch>>
 try{
  response=await tiny.fetch(provider,{path,method:"POST",json:{
   model,stream:false,
   messages:[{role:"system",content:system.slice(0,18000)},...messages.slice(-16).map(m=>({role:m.role,content:m.content.slice(0,12000)}))]
  }})
 }catch(e){throw Error("请求连接失败（可能超时或未配置密钥）："+(e instanceof Error?e.message:String(e)))}
 if(!response.ok)throw Error(statusMessage(response.status,provider))
 const json=response.json as {choices?:{message?:{content?:unknown}}[];model?:string}|null
 const content=json?.choices?.[0]?.message?.content
 if(typeof content!=="string"||!content.trim())throw Error("模型没有返回有效文本")
 return {content,route:json?.model||model}
}
export function engineName(engine:ModelEngine){
 if(engine==="native")return "平台内置 AI"
 if(engine==="gateway")return "FreeLLMAPI"
 return PROVIDERS.find(p=>p.id===engine)?.name??engine
}
export function modelName(engine:ModelEngine,model:string){
 if(engine==="native")return model==="auto"?"平台自动选择":model
 if(engine==="openrouter"&&model==="openrouter/free")return "免费智能路由"
 if(engine==="gateway"&&model==="auto")return "免费网关自动路由"
 return model==="auto"?"请选择模型":model
}
