import ModelCatalog from "@/components/model-catalog"
import type {ModelEngine} from "@/lib/providers"
export default function ModelPicker({currentSource,currentModel,onChoose,onClose,initialTab="favorites"}:{
 currentSource:ModelEngine;currentModel:string;initialTab?:"favorites"|"browse"
 onChoose:(source:ModelEngine,model:string)=>void;onClose:()=>void
}){return <ModelCatalog view="sheet" initialTab={initialTab} currentSource={currentSource} currentModel={currentModel} onChoose={onChoose} onClose={onClose}/>}
