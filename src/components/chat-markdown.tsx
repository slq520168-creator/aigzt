import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
export function ChatMarkdown({content}:{content:string}){
 return <div className="chat-md min-w-0 text-[15px] leading-[1.8] sm:text-base"><Markdown remarkPlugins={[remarkGfm]} components={{
  p:({children})=><p className="my-3 first:mt-0 last:mb-0">{children}</p>,
  a:({children,href})=><a className="text-primary underline underline-offset-2" href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
  h1:({children})=><h1 className="my-3 text-xl font-semibold">{children}</h1>,
  h2:({children})=><h2 className="my-3 text-lg font-semibold">{children}</h2>,
  h3:({children})=><h3 className="my-2 font-semibold">{children}</h3>,
  ul:({children})=><ul className="my-3 list-disc space-y-1 pl-5">{children}</ul>,
  ol:({children})=><ol className="my-3 list-decimal space-y-1 pl-5">{children}</ol>,
  blockquote:({children})=><blockquote className="my-3 border-l-2 border-primary/50 pl-3 text-muted-foreground">{children}</blockquote>,
  table:({children})=><div className="my-3 max-w-full overflow-x-auto rounded-xl border"><table className="w-full border-collapse text-sm">{children}</table></div>,
  th:({children})=><th className="border-b bg-muted/40 px-3 py-2 text-left font-semibold">{children}</th>,
  td:({children})=><td className="border-b px-3 py-2 align-top">{children}</td>,
  pre:({children})=><pre className="my-3 max-w-full overflow-x-auto rounded-xl border bg-muted/50 p-4 text-[13px] leading-6">{children}</pre>,
  code:({children,className,...props})=><code {...props} className={(className||"")+" rounded bg-muted/60 px-1 py-0.5 font-mono text-[.88em] break-words"}>{children}</code>
 }}>{content}</Markdown></div>
}
