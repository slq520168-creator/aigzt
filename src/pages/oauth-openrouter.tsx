import {useEffect,useState} from "react"
import {Link,useNavigate} from "react-router"
import {CheckCircle2,LoaderCircle} from "lucide-react"
import {finishOpenRouterOAuth} from "@/lib/user-keys"
export default function OAuthOpenRouter(){
 const navigate=useNavigate()
 const [error,setError]=useState("")
 useEffect(()=>{
  let active=true
  const params=new URLSearchParams(window.location.search)
  const code=params.get("code"),state=params.get("state")
  window.history.replaceState(null,"",window.location.pathname)
  if(!code){setError("缺少 OpenRouter 授权码，请重新授权");return}
  void finishOpenRouterOAuth(code,state).then(()=>{if(active)navigate("/directory",{replace:true})})
   .catch(e=>{if(active)setError(e instanceof Error?e.message:String(e))})
  return ()=>{active=false}
 },[navigate])
 return <main className="mx-auto flex min-h-[60dvh] max-w-xl flex-col items-center justify-center p-6 text-center">
  {error?<><p className="text-sm text-destructive">{error}</p><Link to="/settings" className="mt-3 rounded-xl border px-4 py-2 text-sm">返回个人连接设置</Link></>:<><LoaderCircle className="size-7 animate-spin text-primary"/><p className="mt-3 text-sm">正在验证 OpenRouter 授权…</p></>}
 </main>
}
