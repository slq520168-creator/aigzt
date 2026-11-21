import {providerRequest} from "@/lib/providers"
export type MediaKind="image"|"video"
export type MediaProvider="grok"|"openai"
export type MediaJob={
 id:string;kind:MediaKind;provider:MediaProvider;model:string;prompt:string;
 status:"pending"|"done"|"failed";requestId?:string;url?:string;fileId?:string;
 error?:string;createdAt:string;updatedAt:string
}
export function mediaUrl(value:unknown):string|undefined{
 if(typeof value!=="string")return undefined
 try{const parsed=new URL(value);return parsed.protocol==="https:"?parsed.href:undefined}catch{return undefined}
}
export function parseMediaResponse(
 raw:unknown,kind:MediaKind,provider:MediaProvider,model:string,prompt:string,
 jobId:string,previous?:MediaJob
):MediaJob{
 const v=(raw??{}) as {request_id?:string;id?:string;status?:string;video?:{url?:string};data?:{url?:string;b64_json?:string}[];error?:{message?:string}}
 const url=mediaUrl(kind==="video"?v.video?.url:v.data?.[0]?.url)
 const req=typeof v.request_id==="string"?v.request_id:previous?.requestId
 const status=v.status==="failed"||v.error?"failed":url?"done":"pending"
 const now=new Date().toISOString()
 return {
  id:jobId,kind,provider,model,prompt,status,
  ...(url?{url}:{}),...(req?{requestId:req}:{}),
  ...(v.error?{error:v.error.message||"媒体生成失败"}:{}),
  ...(previous?.fileId?{fileId:previous.fileId}:{}),
  createdAt:previous?.createdAt||now,updatedAt:now
 }
}
export async function availableMediaModels(provider:MediaProvider,kind:MediaKind):Promise<{id:string;name:string}[]>{
 if(provider==="openai"){
  if(kind==="video")throw Error("OpenAI 视频下载超出当前代理文件限制，暂时只开放 Grok 视频")
  const r=await providerRequest("openai","/v1/models") as {data?:{id?:string}[]}
  if(!Array.isArray(r.data))throw Error("OpenAI 没有返回模型目录")
  const ids=r.data.map(x=>x.id).filter((id):id is string=>typeof id==="string"&&(/^(gpt-image-|chatgpt-image-)/.test(id)))
  if(!ids.length)throw Error("你的 OpenAI API Key 暂无图片生成模型权限")
  return ids.map(id=>({id,name:id}))
 }
 const r=await providerRequest("grok",kind==="image"?"/v1/image-generation-models":"/v1/video-generation-models") as {models?:{id?:string}[]}
 if(!Array.isArray(r.models))throw Error("Grok 未返回媒体模型目录")
 const items=r.models.filter(x=>typeof x.id==="string").map(x=>({id:x.id!,name:x.id!}))
 if(!items.length)throw Error("Grok 账户未提供此类型的媒体模型")
 return items
}
function validatePrompt(prompt:string){
 if(!prompt.trim())throw Error("请填写创作内容")
 if(prompt.trim().length>1500)throw Error("创作内容最多 1500 字")
}
export async function generateMedia(job:{kind:MediaKind;provider:MediaProvider;model:string;prompt:string;id:string}):Promise<MediaJob>{
 validatePrompt(job.prompt)
 if(!/^[\w.-]+$/.test(job.model))throw Error("模型 ID 不合法")
 const payload=job.kind==="image"?{model:job.model,prompt:job.prompt.trim(),n:1}:{
  model:job.model,prompt:job.prompt.trim(),duration:6,aspect_ratio:"16:9",resolution:"720p"
 }
 let raw:unknown
 if(job.provider==="openai"){
  if(job.kind!=="image")throw Error("该连接不支持视频生成")
  raw=await providerRequest("openai","/v1/images/generations","POST",{
   model:job.model,prompt:job.prompt.trim(),n:1,quality:"low",output_format:"jpeg",size:"1024x1024"
  })
 }else{
  raw=await providerRequest("grok",job.kind==="image"?"/v1/images/generations":"/v1/videos/generations","POST",payload)
 }
 const parsed=parseMediaResponse(raw,job.kind,job.provider,job.model,job.prompt,job.id)
 const imageData=(raw as {data?:{b64_json?:string}[]})?.data?.[0]?.b64_json
 if(job.kind==="image"&&job.provider==="openai"&&typeof imageData==="string"){
  // Store the actual output image as a private account file, not a huge DB field.
  const bytes=atob(imageData)
  if(bytes.length>24_000_000)throw Error("图片体积超过个人文件上限")
  const arr=new Uint8Array(bytes.length)
  for(let i=0;i<bytes.length;i++)arr[i]=bytes.charCodeAt(i)
  const saved=await tiny.files.put(new File([arr],job.id+".jpg",{type:"image/jpeg"}))
  return {...parsed,status:"done",fileId:saved.id,updatedAt:new Date().toISOString()}
 }
 if(parsed.status==="pending"&&!parsed.requestId)throw Error("服务商未返回图片/视频或可追踪的任务编号；没有计为生成成功")
 return parsed
}
export async function queryMediaStatus(job:MediaJob):Promise<MediaJob>{
 if(job.provider!=="grok"||!job.requestId)throw Error("这个任务没有可查询的异步编号")
 if(!/^[A-Za-z0-9_-]{4,200}$/.test(job.requestId))throw Error("任务编号无效")
 const response=await providerRequest("grok",(job.kind==="image"?"/v1/images/":"/v1/videos/")+job.requestId)
 const parsed=parseMediaResponse(response,job.kind,job.provider,job.model,job.prompt,job.id,job)
 return parsed
}
