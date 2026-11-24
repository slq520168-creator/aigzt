const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const s=fs.readFileSync("standalone/style.css","utf8");
test("assistant uses one full-width column with the avatar above the reply",()=>{
 assert.match(s,/\.message\.assistant\{display:grid;grid-template-columns:minmax\(0,1fr\);align-content:start;row-gap:4px\}/);
 assert.match(s,/\.message\.assistant>\.avatar-ai\{grid-column:1;grid-row:1;justify-self:start\}/);
 assert.match(s,/\.message\.assistant>\.bubble\{grid-column:1;grid-row:2;width:100%;min-width:0;max-width:100%\}/);
 assert.doesNotMatch(s,/\.message\.assistant[^{]*\{[^}]*grid-column:2/);
});
test("actions and translation remain below the full-width reply",()=>{
 assert.match(s,/\.message\.assistant>\.message-copy-bar\{grid-column:1;grid-row:3;/);
 assert.match(s,/\.message\.assistant>\.message-translation\{grid-column:1;grid-row:4;/);
 assert.equal((s.match(/\.message\.assistant>\.message-copy-bar\{/g)||[]).length,1);
 assert.match(s,/\.messages\{padding:10px 7px 18px\}/);
});