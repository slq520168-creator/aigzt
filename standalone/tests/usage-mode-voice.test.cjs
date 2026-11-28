const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"../worker.js"),"utf8");
const api=new Function(source.replace("__HTML__",JSON.stringify("")).replace("__CSS__",JSON.stringify("")).replace("__CLIENT__",JSON.stringify("")).replace("export default {","const worker={")+"\nreturn {modelUsageMode,dailyRequestPool,freeSources};")();
test("free and personal mode are distinct even with the same model",()=>{
 for(const [p,m,mode,e] of [["free","free:auto","auto","auto"],["free","free:or/test","auto","shared"],["openrouter","test:free","free","free"],["openrouter","test:free","personal","personal"],["openrouter","test:paid","free","personal"]])assert.equal(api.modelUsageMode(p,m,mode),e);
});
test("quota totals use observed unexpired data, not advertised limits",()=>{
 const now=Date.now(),q={provider:"groq",kind:"shared",selectedModel:"openai/gpt-oss-20b",snapshots:[{model:"openai/gpt-oss-20b",at:now-1000,fields:[{label:"每日请求",limit:100,remaining:75,resetAt:now+10000}]}]};
 const known=api.dailyRequestPool([q],"shared",now);
 assert.equal(known.total,100);assert.equal(known.used,25);assert.equal(known.remaining,75);
 const expired=api.dailyRequestPool([q],"shared",now+20000);
 assert.equal(expired.total,null);assert.equal(expired.unknown,1);assert.equal(expired.referenceTotal,null);
});
test("generic automatic OpenRouter routes enforce zero prices",()=>{
 const route=api.freeSources({OPENROUTER_FREE_KEY:"dummy-test-key-only"})[0];assert.equal(route.zeroOnly,true);
});
