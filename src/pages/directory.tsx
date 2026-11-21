import {useNavigate} from "react-router"
import ModelCatalog from "@/components/model-catalog"
import type {ModelEngine} from "@/lib/providers"
export default function Directory(){
 const navigate=useNavigate()
 return <ModelCatalog view="page" initialTab="browse" onChoose={(source:ModelEngine,model:string)=>navigate("/?source="+encodeURIComponent(source)+"&model="+encodeURIComponent(model))}/>
}
