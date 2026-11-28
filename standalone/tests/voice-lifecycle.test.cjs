const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8");
test("Voice resume cannot toggle off a current capture or start during transcription",()=>{
 const state={active:true,listening:false,opening:false,reading:false,pending:false,request:null,resumePending:false};let calls=0;const S={busy:false};
 const f=new Function("voiceSession","S","$","voiceListen",c.slice(c.indexOf("function voiceAutoNext("),c.indexOf("function voiceAudioContext("))+";return voiceAutoNext")(state,S,()=>({open:true}),()=>calls++);
 for(const flag of ["listening","opening","reading"]){state[flag]=true;f();state[flag]=false}
 assert.equal(calls,0);state.request={};f();assert.equal(state.resumePending,true);assert.equal(calls,0);state.request=null;f();assert.equal(calls,1);
});
test("Message reader resumes at the interrupted segment",()=>{
 const p={text:"a b c",index:0,button:{},retry:{},cloud:{},pause:{}},played=[];class U{constructor(t){this.text=t}}
 const synth={getVoices:()=>[],speak:u=>played.push(u),paused:false};
 const f=new Function("messageReader","window","voiceChunks","voiceLanguage","voiceSession","readerStatus","readerFail","readerDone","voicePlaybackButton","setTimeout","clearTimeout",c.slice(c.indexOf("function readerLocal("),c.indexOf("async function readerCloud("))+";return readerLocal")(p,{speechSynthesis:synth,SpeechSynthesisUtterance:U},()=>["a","b","c"],()=>"zh-CN",{rate:1,voice:""},()=>{},()=>{},()=>{},()=>{},()=>1,()=>{});
 f(p);played[0].onend();assert.equal(p.index,1);assert.equal(played[1].text,"b");played[1].onerror({error:"interrupted"});f(p);assert.equal(played[2].text,"b");
});
test("Recorded dictation and voice session share authenticated STT; microphone is released and obsolete capture ignored",()=>{
 assert.match(c,/async function transcribeRecordedAudio/);assert.match(c,/async function startRecordedDictation/);assert.match(c,/state\.stream\?\.getTracks\(\)\.forEach\(t=>t\.stop\(\)\)/);assert.match(c,/state\.owner===S\.user\?\.id&&state\.chat===S\.chatId/);assert.match(c,/function newChat\(keepDrawer=false\)\{\s*stopDictation\(true\)/);assert.doesNotThrow(()=>new Function(c));
});