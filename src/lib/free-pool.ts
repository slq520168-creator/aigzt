import type {WorkspaceMessage} from "@/lib/workspace"
export type PoolStatus={kind:"free-pool";checkedAt:string;verified:number;user:{day:string;used:number;remaining:number;dailyLimit:number;minuteLimit:number};sources:{id:string;name:string;enabled:boolean;status:string;verifiedAt:string|null;modelCount:number|null;remainingRequests:string|null;note:string|null}[]}
export type PoolReply={content:string;provider:"native"|"openrouter";model:string;paid:false;upstreamRemaining:string|null;attempted:{provider:string;status:number|string;success:boolean}[]}
export function freePoolStatus(verify=false){return tiny.call<PoolStatus>("freerouter",{action:"status",verify})}
function functionNotRegistered(error:unknown):boolean{
 const msg=error instanceof Error?error.message:String(error)
 return /has no function named|no function named|unknown function|function.*(?:not found|not deployed|not available|not live yet)|503.*(?:backend function|server function)/i.test(msg)
}
function errorText(error:unknown):string{return error instanceof Error?error.message:String(error)}

export async function freePoolChat(messages:WorkspaceMessage[],system:string):Promise<PoolReply>{
 const recent=messages.slice(-10).map(m=>({
  role:m.role==="assistant"?"assistant" as const:"user" as const,
  content:m.content.slice(0,4200)
 })).filter(m=>m.content.trim())
 if(!recent.length||recent[recent.length-1].role!=="user")
  throw Error("请先输入消息")
 try{
  return await tiny.call<PoolReply>("freerouter",{
   action:"chat",system:system.slice(0,8500),messages:recent
  })
 }catch(e){
  if(!functionNotRegistered(e))throw e

  // Backend registration failure is the only bypass condition. Do not
  // override valid server-side quotas, provider 429s, or user permission rules.
  // Platform AI still enforces its own user/app/monthly allowance.
  let limits:Awaited<ReturnType<typeof tiny.ai.limits>>
  try{limits=await tiny.ai.limits()}
  catch(err){throw Error("免费路由函数尚未注册，平台备用额度也无法查询："+errorText(err))}
  if(limits.remaining.user_hour<=0)
   throw Error("免费路由函数尚未注册，平台 AI 本小时免费调用次数已用完")
  if(limits.remaining.app_day<=0)
   throw Error("免费路由函数尚未注册，平台 AI 今日应用调用次数已用完")

  const prompt=recent.map(m=>(m.role==="user"?"用户":"助手")+": "+m.content).join("\n\n").slice(-14500)
  let answer:string
  try{answer=await tiny.ai.generate(prompt,{system:system.slice(0,8500)})}
  catch(err){throw Error("平台备用 AI 调用失败："+errorText(err))}
  if(!answer.trim())throw Error("平台备用 AI 没有返回有效内容")

  return {
   content:answer,provider:"native",model:"平台内置 AI · 限额备用",
   paid:false,upstreamRemaining:null,
   attempted:[
    {provider:"freerouter",status:"not_registered",success:false},
    {provider:"native",status:200,success:true}
   ]
  }
 }
}
