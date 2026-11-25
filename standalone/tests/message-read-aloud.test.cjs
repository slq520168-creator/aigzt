const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('standalone/client.js','utf8'),w=fs.readFileSync('standalone/worker.js','utf8');
test('message speech is independent and its button is not conditional on browser speech availability',()=>{
 assert.match(js,/messageTool\("volume-2","朗读回复",b=>startMessageReader\(row,text,b\)\)/);
 assert.match(js,/function stopMessageReader/);assert.match(js,/function readerLocal/);assert.match(js,/aria-live","polite"/);
 assert.doesNotThrow(()=>new Function(js));
});
test('cloud audio requires explicit user authorization, own key, and returns actual WAV',()=>{
 assert.match(w,/if\(body.confirmed!==true\)return fail/);assert.match(w,/keyForProvider\(env,user,"gemini",body.apiKey\)/);
 assert.match(w,/content-type":"audio\/wav"/);assert.match(js,/confirm\("使用个人 Gemini/);
 const fn=new Function(w.slice(w.indexOf('function speechWav('),w.indexOf('async function readAloudAudio('))+';return speechWav')();
 const bytes=fn(new Uint8Array([0,0,1,0]));assert.equal(Buffer.from(bytes.subarray(0,4)).toString(),'RIFF');assert.equal(new DataView(bytes.buffer).getUint32(40,true),4);
});
