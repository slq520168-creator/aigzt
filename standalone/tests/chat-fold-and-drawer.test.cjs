const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs");
const c=fs.readFileSync("standalone/client.js","utf8"),s=fs.readFileSync("standalone/style.css","utf8");
test("long user messages fold five lines without changing source or attachments",()=>{
 assert.match(c,/const USER_MESSAGE_PREVIEW_LINES=5/);
 assert.match(c,/body\.scrollHeight>lineHeight\*USER_MESSAGE_PREVIEW_LINES\+1/);
 assert.match(c,/row\.dataset\.sourceText=String\(content\|\|""\)/);
 assert.match(c,/attachUserMessageText\(row,bubble,textBody\)/);
 assert.match(c,/appendMessageCopy\(row,content\)/);
 assert.match(s,/\.user-message-text\.is-collapsed\{max-height:8\.75em;overflow:hidden\}/);
 assert.match(c,/toggle\.textContent=expanded\?"收起":"展开全文"/);
 assert.match(c,/bubble\.append\(frame\)/);
});
test("seven distinct gradients replace forced gray",()=>{
 const colors=new Function(c.slice(c.indexOf("const MESSAGE_ICON_COLORS="),c.indexOf("let iconGradientSerial="))+";return MESSAGE_ICON_COLORS;")();
 assert.equal(new Set(["copy","languages","share","download","bookmark","refresh-cw","ellipsis"].map(k=>colors[k][0])).size,7);
 assert.doesNotMatch(s,/\.message-copy-btn svg\{stroke:/);
 assert.match(c,/el\.closest\("\.message-copy-btn"\)&&MESSAGE_ICON_COLORS\[name\]/);
});
function run(type,x,dx,dy,mode="chat",selection=""){
 const code=c.slice(c.indexOf("function wireDrawerGestures(){"),c.indexOf("function flashError("));
 const make=new Function("window","document","Element","$","S","drawerPageOrder","openMenu","closeMenu","hide","setFreeToolsMode","setWorkMode",code+";return wireDrawerGestures;");
 const handlers={};let opens=0,back=0;
 class E{constructor(t){this.type=t;this.scrollWidth=100;this.clientWidth=100;this.parentElement=null}closest(sel){return this.type==="message"&&sel.includes(".message")?this:null}}
 const body=new E("body"),target=new E(type);target.parentElement=body;
 const w={matchMedia:()=>({matches:true}),innerWidth:390,getComputedStyle:()=>({overflowX:"visible"}),getSelection:()=>({toString:()=>selection}),addEventListener(){}};
 const d={body,querySelector:()=>null,addEventListener:(n,f)=>handlers[n]=f};
 make(w,d,E,id=>id==="imageViewer"?{hidden:true}:{classList:{contains:()=>false}},{freeToolsMode:mode==="tools",workMode:false},[],()=>opens++,()=>{},()=>back++,()=>back++,()=>back++)();
 const t=(a,b)=>({identifier:1,clientX:a,clientY:b});
 handlers.touchstart({touches:[t(x,120)],target});
 handlers.touchmove({touches:[t(x+dx*.6,120+dy*.6)],target});
 handlers.touchend({touches:[],changedTouches:[t(x+dx,120+dy)],target});
 return {opens,back};
}
test("drawer opens only on deliberate outer edge swipe",()=>{
 assert.equal(run("message",5,140,0).opens,0);
 assert.equal(run("message",150,120,0).opens,0);
 assert.equal(run("gutter",5,130,0).opens,1);
 assert.equal(run("gutter",18,130,0).opens,0);
 assert.equal(run("gutter",5,130,70).opens,0);
 assert.equal(run("gutter",5,130,0,"chat","selected").opens,0);
 assert.equal(run("gutter",5,130,0,"tools").back,1);
});
test("client syntax",()=>assert.doesNotThrow(()=>new Function(c)));
