// Free-only server coordinator. Does not expose provider keys to site visitors.
// FreeLLMAPI upstream is single-user and is not redistributed to public users.
// Provider permission for public usage must be reviewed before an operator
// enables extra free tiers. There is no paid-model fallback.
const LIMIT_DAY=12, LIMIT_MIN=2;
const SOURCES=[
 {id:"openrouter",name:"OpenRouter 免费模型",enabled:true,path:"/api/v1/models"},
 {id:"groq",name:"Groq 免费额度",enabled:false,path:"/openai/v1/models"},
 {id:"cerebras",name:"Cerebras 免费额度",enabled:false,path:"/v1/models"}
];
const state=new Map();
const timestamp=()=>new Date().toISOString();
const short=(v,n)=>typeof v==="string"?v.slice(0,n):"";
function mustLogin(tiny){if(!tiny.caller?.id)throw Error("请登录 AIGZT 后使用免费模型，以便分配独立请求限额")}
async function call(tiny,id,path,method="GET",json){
 try{return await tiny.fetch(id,{path,method,...(json===undefined?{}:{json})})}
 catch(e){return {ok:false,status:0,json:null,headers:{},text:String(e)}}
}
function saveHealth(id,result){
 const old=state.get(id)||{};
 const code=result.status;
 const cooldown=code===429?90000:(code===0||code===401||code===403)?600000:code>=500?30000:0;
 const hdr=result.headers||{};
 const health={
  status:result.ok?"已连接":code===429?"达到限额":code===401||code===403||code===0?"未授权":"不可用",
  at:timestamp(),pauseUntil:cooldown?Date.now()+cooldown:0,
  remaining:hdr["x-ratelimit-remaining-requests"]??old.remaining??null,
  tokens:hdr["x-ratelimit-remaining-tokens"]??old.tokens??null
 };
 state.set(id,health);return health;
}
async function sourceStatus(tiny,p){
 const res=await call(tiny,p.id,p.path);
 const health=saveHealth(p.id,res);
 const models=Array.isArray(res.json?.data)?res.json.data.length:0;
 return {id:p.id,name:p.name,enabled:p.enabled,status:health.status,verifiedAt:health.at,
  modelCount:res.ok?models:null,remainingRequests:health.remaining,
  note:!p.enabled?"公共免费线路仍需核准服务商使用条款":null};
}
async function usage(tiny){
 const date=timestamp().slice(0,10);
 const used=await tiny.db.count("pool-use:"+date+":");
 return {day:date,used,remaining:Math.max(0,LIMIT_DAY-used),dailyLimit:LIMIT_DAY,minuteLimit:LIMIT_MIN};
}
async function reserve(tiny){
 const t=timestamp(),day=t.slice(0,10),minute=t.slice(11,16).replace(":","");
 const [d,m]=await Promise.all([tiny.db.count("pool-use:"+day+":"),tiny.db.count("pool-use:"+day+":"+minute+":")]);
 if(d>=LIMIT_DAY)throw Error("今日免费调用次数已用完，不会转用收费模型");
 if(m>=LIMIT_MIN)throw Error("操作太快，每分钟最多调用 "+LIMIT_MIN+" 次");
 const key="pool-use:"+day+":"+minute+":"+Date.now()+"-"+Math.random().toString(36).slice(2);
 await tiny.db.create(key,{at:t,status:"reserved"});
 return key;
}
function parseAnswer(r){
 const content=r.json?.choices?.[0]?.message?.content;
 return typeof content==="string"&&content.trim()?content:null;
}
async function chat(tiny,input){
 const items=Array.isArray(input.messages)?input.messages.slice(-10):[];
 const messages=items.map(m=>({role:m?.role==="assistant"?"assistant":"user",content:short(m?.content,4200)})).filter(m=>m.content);
 if(!messages.length||messages[messages.length-1].role!=="user")throw Error("请先输入问题");
 const system=short(input.system,8500);
 const ticket=await reserve(tiny);
 const attempted=[];
 try{
  const health=state.get("openrouter");
  if(!health||!health.pauseUntil||Date.now()>=health.pauseUntil){
   const response=await call(tiny,"openrouter","/api/v1/chat/completions","POST",
    {model:"openrouter/free",stream:false,max_tokens:800,messages:[{role:"system",content:system},...messages]});
   saveHealth("openrouter",response);
   const answer=response.ok?parseAnswer(response):null;
   attempted.push({provider:"openrouter",status:response.status,success:!!answer});
   if(answer){
    const model=short(response.json?.model,180)||"openrouter/free";
    await tiny.db.set(ticket,{at:timestamp(),status:"done",provider:"openrouter",model});
    return {content:answer,provider:"openrouter",model,attempted,
     upstreamRemaining:state.get("openrouter")?.remaining??null,paid:false};
   }
  }else attempted.push({provider:"openrouter",status:"cooldown",success:false});
  const text=messages.map(m=>m.role+": "+m.content).join("\n\n");
  const result=await tiny.ai.generate(text,{system:system||"请用中文回答用户"});
  if(typeof result!=="string"||!result.trim())throw Error("平台备用 AI 没有返回内容");
  attempted.push({provider:"native",status:200,success:true});
  await tiny.db.set(ticket,{at:timestamp(),status:"done",provider:"native",model:"平台内置 AI"});
  return {content:result,provider:"native",model:"平台内置 AI",attempted,upstreamRemaining:null,paid:false};
 }catch(e){
  await tiny.db.set(ticket,{at:timestamp(),status:"failed"});
  throw Error("免费池调用未完成："+(e instanceof Error?e.message:String(e))+"；没有启动付费线路");
 }
}
export default async function freeRouter(input,tiny){
 mustLogin(tiny);
 const req=input&&typeof input==="object"?input:{};
 if(req.action==="role")return {isAdmin:!!tiny.caller?.roles?.some(x=>x==="owner"||x==="admin")};
 if(req.action==="status"){
  const sources=req.verify===true?await Promise.all(SOURCES.map(p=>sourceStatus(tiny,p))):
   SOURCES.map(p=>{
    const s=state.get(p.id);
    return {id:p.id,name:p.name,enabled:p.enabled,status:s?.status||"未验证",
     verifiedAt:s?.at||null,modelCount:null,remainingRequests:s?.remaining??null,
     note:p.enabled?null:"公共免费线路仍需核准使用条款"};
   });
  return {kind:"free-pool",checkedAt:timestamp(),user:await usage(tiny),
   sources:[...sources,{id:"native",name:"平台 AI 备用线路",enabled:true,status:"平台额度",
    verifiedAt:null,modelCount:null,remainingRequests:null,
    note:"受当前用户、应用和平台月度额度限制"}],
   verified:sources.filter(x=>x.enabled&&x.status==="已连接").length};
 }
 if(req.action==="chat")return chat(tiny,req);
 throw Error("免费池操作无效");
}
