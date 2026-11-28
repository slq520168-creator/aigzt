const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"../worker.js"),"utf8");
const api=new Function(source.replace("__HTML__",JSON.stringify("")).replace("__CSS__",JSON.stringify("")).replace("__CLIENT__",JSON.stringify("")).replace("export default {","const worker={")+"\nreturn {trustedImageUrl,freeSources,worker,ASSET_VERSION};")();
test("automatic routing excludes unauthorized public chat relays",()=>{
 assert.deepEqual(api.freeSources({}),[]);
 assert.deepEqual(api.freeSources({GROQ_FREE_KEY:"dummy-test-key-only",OPENROUTER_FREE_KEY:"dummy-test-key-only"}).map(x=>x.id),["groq","openrouter"]);
});
test("restrict image download host",()=>{
 for(const host of ["krea-krea-2.hf.space","multimodalart-glm-image.hf.space","rioshiina-imagegen.hf.space","mrfakename-z-image-turbo.hf.space","huggingface.co","hf.co"])assert.equal(api.trustedImageUrl("https://"+host+"/file").hostname,host);
 for(const url of ["https://evil.hf.space/file","https://evil.gradio.live/file","http://krea-krea-2.hf.space/file","https://user@huggingface.co/file","https://huggingface.co:8443/file"])assert.throws(()=>api.trustedImageUrl(url));
});
test("only current versioned static assets are cacheable",async()=>{
 const url="https://example.test/app.js?v="+api.ASSET_VERSION;
 const v=await api.worker.fetch(new Request(url),{});
 assert.match(v.headers.get("cache-control"),/immutable/);
 const plain=await api.worker.fetch(new Request("https://example.test/app.js"),{});
 assert.equal(plain.headers.get("cache-control"),"no-store");
 const next=await api.worker.fetch(new Request(url,{headers:{"if-none-match":v.headers.get("etag")}}),{});
 assert.equal(next.status,304);
});
