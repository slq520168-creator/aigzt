import type {WorkspaceMessage} from "@/lib/workspace"
export type PoolStatus={kind:"free-pool";checkedAt:string;verified:number;user:{day:string;used:number;remaining:number;dailyLimit:number;minuteLimit:number};sources:{id:string;name:string;enabled:boolean;status:string;verifiedAt:string|null;modelCount:number|null;remainingRequests:string|null;note:string|null}[]}
export type PoolReply={content:string;provider:"native"|"openrouter";model:string;paid:false;upstreamRemaining:string|null;attempted:{provider:string;status:number|string;success:boolean}[]}
export function freePoolStatus(verify=false){return tiny.call<PoolStatus>("free_router",{action:"status",verify})}
export function freePoolChat(messages:WorkspaceMessage[],system:string){
 return tiny.call<PoolReply>("free_router",{action:"chat",system:system.slice(0,8500),messages:messages.slice(-10).map(m=>({role:m.role,content:m.content.slice(0,4200)}))})
}
