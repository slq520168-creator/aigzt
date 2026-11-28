import {readFile,writeFile,mkdir} from "node:fs/promises";
import {createHash} from "node:crypto";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
const here=dirname(fileURLToPath(import.meta.url));
const output=resolve(process.argv[2]||resolve(here,"dist/worker.mjs"));
let source=await readFile(resolve(here,"worker.js"),"utf8");
const values=Object.fromEntries(await Promise.all(["index.html","style.css","client.js"].map(async file=>[file,await readFile(resolve(here,file),"utf8")])));
for(const [marker,file] of [["__HTML__","index.html"],["__CSS__","style.css"],["__CLIENT__","client.js"]]){
 if(source.split(marker).length!==2)throw new Error("Unexpected build placeholder: "+marker);
 source=source.replace(marker,()=>JSON.stringify(values[file]));
}
await mkdir(dirname(output),{recursive:true});
await writeFile(output,source,"utf8");
console.log(createHash("sha256").update(source).digest("hex")+"  "+output);
