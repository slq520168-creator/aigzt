export type WorkspaceProject = {name:string;context:string;updatedAt:string}
export type ChatAttachment = {id:string;name:string;size:number;type:string}
export type WorkspaceMessage = {role:"user"|"assistant";content:string;model?:string;attachments?:ChatAttachment[]}
export type WorkspaceChat = {
 title:string; messages:WorkspaceMessage[]; updatedAt:string; projectId?:string;
 mode?:"general"|"creative"|"code"|"analysis"|"translate";
 engine?:"free"|"native"|"gateway"|"openai"|"grok"|"gemini"|"qwen"|"openrouter"|"groq"|"cerebras"; modelChoice?:string
}
export function issueText(e:unknown):string {return e instanceof Error?e.message:String(e)}
