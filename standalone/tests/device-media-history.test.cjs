const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const c=fs.readFileSync(path.join(__dirname,"../client.js"),"utf8"),w=fs.readFileSync(path.join(__dirname,"../worker.js"),"utf8");
test("historical jobs only read device storage",()=>{assert.match(c,/if\(existingRow\)renderImageJob/);assert.match(c,/if\(existingRow\)inlineVideoJob/);assert.match(c,/indexedDB\.open\("aigzt-device-media-v1"/)});
test("generated output never writes R2",()=>{assert.doesNotMatch(w,/customMetadata:\{name:"(?:免费生成视频|生成图片)"\}/);assert.match(w,/async function fvTransientMedia/);assert.match(w,/cache-control":"private, no-store"/)});
