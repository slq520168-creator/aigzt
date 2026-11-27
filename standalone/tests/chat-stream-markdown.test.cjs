const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8");
const prefix=new Function(c.slice(c.indexOf("function streamingMarkdownPrefix("),c.indexOf("function syncAssistantChildren("))+";return streamingMarkdownPrefix")();
test("partial Markdown syntax does not flash as raw formatting",()=>{
 assert.equal(prefix("#"),"");
 assert.equal(prefix("# 标题"),"# 标题");
 assert.equal(prefix("正文 **重"),"正文 ");
 assert.equal(prefix("正文 **重点**"),"正文 **重点**");
 assert.equal(prefix("正文 \x60foo"),"正文 ");
 assert.equal(prefix("正文 \x60foo\x60"),"正文 \x60foo\x60");
});
test("table waits for separator and incomplete rows are held",()=>{
 assert.equal(prefix("| A | B |\n| --- | ---"),"");
 assert.equal(prefix("| A | B |\n| --- | --- |\n| x |"),"| A | B |\n| --- | --- |");
 assert.equal(prefix("| A | B |\n| --- | --- |\n| x | y |\n"),"| A | B |\n| --- | --- |\n| x | y |\n");
});
test("all text paths share the Markdown renderer and preserve existing nodes",()=>{
 assert.match(c,/updateAssistantText\(bubble,streamedContent\);/);
 assert.match(c,/updateAssistantText\(bubble,content,true\);/);
 assert.match(c,/updateAssistantText\(loadingBubble,result.reply,true\)/);
 assert.match(c,/syncAssistantChildren\(bubble,staged\)/);
 assert.doesNotMatch(c,/bubble\.textContent\+=pending/);
 assert.doesNotThrow(()=>new Function(c));
});