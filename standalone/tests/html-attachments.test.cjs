const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"../worker.js"),"utf8");
const html=fs.readFileSync(path.join(__dirname,"../index.html"),"utf8");
const api=new Function(source.replace("__HTML__",JSON.stringify("")).replace("__CSS__",JSON.stringify("")).replace("__CLIENT__",JSON.stringify("")).replace("export default {","const worker={")+"\nreturn {attachmentType,attachmentText,worker};")();
test("HTML and text MIME normalization including generic iOS MIME",()=>{
 for(const [name,mime,expected] of [["audit.html","text/html","text/html"],["audit.HTM","","text/html"],["audit.html","application/octet-stream","text/html"],["data.json","text/plain","application/json"],["app.ts","video/mp2t","text/plain"],["photo.heic","","image/heic"],["photo.png","image/png","image/png"],["file.pdf","application/pdf","application/pdf"],["fake.html","image/png",null],["binary.exe","application/octet-stream",null]])assert.equal(api.attachmentType(name,mime),expected);
 assert.match(html,/id="attachmentInput"[^>]*accept="[^"]*\.html/);
});
test("HTML is returned as text, never evaluated, with bounds",async()=>{
 const contents="<html><script>throw Error('must not execute')</script>报告</html>";
 assert.equal(await api.attachmentText({size:100,text:async()=>contents}),contents);
 await assert.rejects(api.attachmentText({size:100000,text:async()=>contents}),e=>e.status===413);
 await assert.rejects(api.attachmentText({size:3,text:async()=>"a\0b"}),e=>e.status===415);
});
test("HTTPS redirects and HEAD health matches GET",async()=>{
 const redirect=await api.worker.fetch(new Request("http://example.test/health?a=1"),{});
 assert.equal(redirect.status,308);
 assert.equal(redirect.headers.get("location"),"https://example.test/health?a=1");
 const get=await api.worker.fetch(new Request("https://example.test/health"),{});
 const head=await api.worker.fetch(new Request("https://example.test/health",{method:"HEAD"}),{});
 assert.equal(get.status,200);assert.equal(head.status,200);assert.equal(await head.text(),"");
 assert.equal(head.headers.get("strict-transport-security"),"max-age=15552000");
});
