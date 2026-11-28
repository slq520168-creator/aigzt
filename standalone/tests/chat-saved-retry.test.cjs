const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"../worker.js"),"utf8");
const api=new Function(source.replace("__HTML__",JSON.stringify("")).replace("__CSS__",JSON.stringify("")).replace("__CLIENT__",JSON.stringify("")).replace("export default {","const worker={")+"\nreturn {reservedSubmission};")();
test("retry of persisted turn reclaims the same receipt and reuses the message",async()=>{
 let receipt=null,calls=0;
 const db={
  prepare(sql){
   return {bind(...args){return {
    async first(){return receipt},
    async run(){
     if(sql.includes("INSERT INTO imai_request_receipts")){if(receipt)return {meta:{changes:0}};receipt={fingerprint:args[2],state:"pending",result_json:null,created_at:args[3]};}
     if(sql.includes("SET state='pending'")){if(receipt.state!=="retryable")return {meta:{changes:0}};receipt.state="pending";}
     if(sql.includes("SET state='retryable'")){receipt.state="retryable";receipt.result_json=args[0];}
     if(sql.includes("SET state='complete'")){receipt.state="complete";receipt.result_json=args[0];}
     return {meta:{changes:1}};
    }
   }}};
  },
  async batch(){return []}
 };
 const env={DB:db},user={id:"user-a"},body={requestId:"aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaa1",message:"report"};
 const make=()=>new Request("https://example.test/api/chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
 const turn={chatId:"chat-a",userMessageId:"message-a"};
 await assert.rejects(api.reservedSubmission(make(),env,user,"chat",async mark=>{calls++;mark();throw Object.assign(Error("quota"),{safeRetry:true,savedTurn:turn})}),e=>e.code==="SAVED_RETRYABLE");
 const result=await api.reservedSubmission(make(),env,user,"chat",async(mark,saved)=>{calls++;assert.deepEqual(saved,turn);return {ok:true,chatId:saved.chatId,userMessageId:saved.userMessageId,reply:"done"}});
 assert.equal(result.userMessageId,"message-a");assert.equal(calls,2);
 const replay=await api.reservedSubmission(make(),env,user,"chat",async()=>{throw Error("duplicate generation")});assert.equal(replay.replayed,true);
});
