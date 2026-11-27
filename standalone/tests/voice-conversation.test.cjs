const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),h=fs.readFileSync("standalone/index.html","utf8"),w=fs.readFileSync("standalone/worker.js","utf8");
test("voice entry exists and both features are enabled",()=>{
 assert.match(c,/const VOICE_CHAT_ENABLED=true/);assert.match(c,/const MESSAGE_READ_ALOUD_ENABLED=true/);
 assert.equal((h.match(/id="voiceChatOpen"/g)||[]).length,1);
 assert.doesNotMatch(h,/id="voiceDialog"[^>]*\bhidden\b/);
 assert.match(c,/voiceReplay"\),true\)/);
});
test("recorder uses actual audio bytes and cancels stale turns",()=>{
 assert.match(c,/navigator\.mediaDevices\.getUserMedia/);assert.match(c,/new window\.MediaRecorder/);
 assert.match(c,/fetch\("\/api\/voice\/transcribe"/);assert.match(c,/voiceSession\.turn\+\+/);assert.match(c,/track\.stop\(\)/);
 assert.match(c,/voiceSession\.utterance=u/);assert.match(c,/u\.onstart=/);assert.match(c,/setTimeout\(fail,6000\)/);
});
test("voice text is split without losing Chinese characters",()=>{
 const chunks=new Function(c.slice(c.indexOf("function voiceChunks("),c.indexOf("function voiceLanguage("))+";return voiceChunks")();
 const text="这是一段中文语音。".repeat(100);assert.equal(chunks(text).join(""),text);assert.ok(chunks(text).every(x=>x.length<=131));
});
test("voice API requires authentication and uses only the existing rate-limited provider",()=>{
 assert.match(w,/async function transcribeVoice\(req,env,user\)\{\s*requireUser\(user\)/);
 assert.match(w,/whisper-large-v3-turbo/);assert.match(w,/max=1500000/);assert.match(w,/env\.GROQ_FREE_KEY/);
 assert.match(w,/path==="\/api\/voice\/transcribe"/);
 assert.doesNotThrow(()=>new Function(c));assert.doesNotThrow(()=>new Function(w.replace("export default {","return {")));
});

test("voice silence detector sends only after actual speech and avoids silent requests",()=>{
 const f=new Function(c.slice(c.indexOf("function voiceSilenceStep("),c.indexOf("function voiceAutoNext("))+";return voiceSilenceStep")();
 const a={started:1,speechSince:0,lastLoud:0,heard:false};assert.equal(f(a,0,1000),"");assert.equal(f(a,0,15002),"idle");
 const b={started:1,speechSince:0,lastLoud:0,heard:false};assert.equal(f(b,.04,100),"");assert.equal(f(b,.04,300),"");assert.equal(f(b,0,1000),"");assert.equal(f(b,0,1400),"send");
});
test("voice session reuses chat persistence and resumes without a click",()=>{
 assert.match(c,/sendMessage\(null,false,turn\)/);assert.match(c,/voiceTurn===voiceSession.turn/);assert.match(c,/voiceAutoNext\(\)/);assert.match(c,/voiceTranscript\("assistant",result.reply\)/);assert.match(h,/id="voiceTranscript"/);assert.match(w,/INSERT INTO messages/);
});
