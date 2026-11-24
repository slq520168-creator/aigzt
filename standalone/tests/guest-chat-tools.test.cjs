const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8");
const catalog=c.slice(c.indexOf("const CURATED_FREE_TOOLS="),c.indexOf("function freeToolsFilters("));
const d=new Function(catalog+";return {EXTERNAL_FREE_TOOLS,ORIGINAL_GENERATION_SITES,GUEST_CHAT_TOOLS,FREE_TOOL_CATEGORIES}")();
test("guest directory includes distinct external URLs and published source information",()=>{
 assert.equal(d.GUEST_CHAT_TOOLS.length,8);
 const guests=d.EXTERNAL_FREE_TOOLS.filter(x=>x.guest===true);
 assert.equal(guests.length,13);
 assert.equal(new Set(guests.map(x=>new URL(x.url).href)).size,guests.length);
 for(const x of guests){assert.equal(new URL(x.url).protocol,"https:");assert.ok(x.login);}
 for(const x of d.GUEST_CHAT_TOOLS)assert.equal(new URL(x.source).protocol,"https:");
 assert.ok(d.FREE_TOOL_CATEGORIES.includes("免注册"));
 assert.match(c,/category==="免注册"\?item.guest!==true/);
 assert.ok(!guests.some(x=>x.provider==="Microsoft"||x.provider==="Perplexity"));
});
test("preserve original source order and direct external links",()=>{
 assert.deepEqual(d.EXTERNAL_FREE_TOOLS.slice(0,d.ORIGINAL_GENERATION_SITES.length),d.ORIGINAL_GENERATION_SITES);
 assert.match(c,/a.href=item.url;a.target="_blank";a.rel="noopener noreferrer"/);
 assert.doesNotThrow(()=>new Function(c));
});
