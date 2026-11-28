const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8");
test("Perchance image and chat additions use unique original destinations",()=>{
const {additions,catalog}=new Function(c.slice(c.indexOf("const CURATED_FREE_TOOLS="),c.indexOf("const FREE_TOOL_CATEGORIES="))+";return {additions:PERCHANCE_IMAGE_CHAT_TOOLS,catalog:EXTERNAL_FREE_TOOLS}")();
assert.equal(additions.length,19);
assert.equal(additions.filter(x=>x.category==="作图").length,15);
assert.equal(additions.filter(x=>x.categories.includes("聊天")).length,4);
for(const x of additions){assert.equal(new URL(x.url).hostname,"perchance.org");assert.equal(catalog.filter(y=>y.url.replace(/\/$/,"")===x.url).length,1);}
assert.match(c,/categories\.includes\("作图"\)\)categories\.push\("P作图"\)/);
assert.match(c,/categories\.includes\("聊天"\)\)categories\.push\("P聊天"\)/);
assert.doesNotThrow(()=>new Function(c));
});