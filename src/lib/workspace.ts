export type WorkspaceProject = { name: string; context: string; updatedAt: string }
export type WorkspaceMessage = { role: "user" | "assistant"; content: string; model?: string }
export type WorkspaceChat = { title: string; messages: WorkspaceMessage[]; updatedAt: string; projectId?: string }
export function issueText(e: unknown): string { return e instanceof Error ? e.message : String(e) }
