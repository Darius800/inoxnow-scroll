import fs from 'node:fs';
import path from 'node:path';
const endpoint='http://127.0.0.1:9337';
const root=path.resolve(import.meta.dirname,'..','..');
const target=await fetch(`${endpoint}/json/new?${encodeURIComponent('http://127.0.0.1:8765/media/prototypes/full-scroll-world-audit.html')}`,{method:'PUT'}).then(response=>response.json());
const ws=new WebSocket(target.webSocketDebuggerUrl),pending=new Map(),events=[];let nextId=1;
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true})});
ws.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.id&&pending.has(message.id)){const task=pending.get(message.id);pending.delete(message.id);message.error?task.reject(new Error(message.error.message)):task.resolve(message.result);return}if(['Runtime.exceptionThrown','Log.entryAdded','Runtime.consoleAPICalled'].includes(message.method))events.push(message)});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=nextId++;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function evaluate(expression){const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result?.value}
async function screenshot(name){const result=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(root,'media','prototypes',name),Buffer.from(result.data,'base64'))}
async function gotoProgress(progress){await evaluate(`scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*${progress})`);await wait(650);return JSON.parse(await evaluate('JSON.stringify(window.__INOXNOW_QA__.getState())'))}
await send('Page.enable');await send('Runtime.enable');await send('Log.enable');await send('Emulation.setDeviceMetricsOverride',{width:1600,height:900,deviceScaleFactor:1,mobile:false});
for(let i=0;i<160;i+=1){if(await evaluate('document.title')==='qa-ready')break;await wait(125)}
if(await evaluate('document.title')!=='qa-ready')throw new Error('El prototipo no alcanzó qa-ready');
const report={url:target.url,forward:[],reverse:[],fast_scroll:{},keyboard:{},blob_seekable:[],console_errors:[],reduced_motion:null};
for(let segment=0;segment<11;segment+=1){const state=await gotoProgress((segment+.5)/11);report.forward.push({expected:segment,actual:state.segment});if(segment===0)await screenshot('audit-journey-start.png');if(segment===5)await screenshot('audit-journey-transition-03-04.png');if(segment===10)await screenshot('audit-journey-end.png')}
for(let segment=10;segment>=0;segment-=1){const state=await gotoProgress((segment+.5)/11);report.reverse.push({expected:segment,actual:state.segment})}
await gotoProgress(.97);const fastBack=await gotoProgress(.03);report.fast_scroll={back_segment:fastBack.segment,title:await evaluate('document.title'),responsive:true};
await send('Input.dispatchKeyEvent',{type:'keyDown',key:'End',code:'End'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'End',code:'End'});await wait(900);report.keyboard.end_segment=JSON.parse(await evaluate('JSON.stringify(window.__INOXNOW_QA__.getState())')).segment;
await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Home',code:'Home'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Home',code:'Home'});await wait(900);report.keyboard.home_segment=JSON.parse(await evaluate('JSON.stringify(window.__INOXNOW_QA__.getState())')).segment;
report.blob_seekable=JSON.parse(await evaluate(`JSON.stringify(window.__INOXNOW_QA__.scenes.map(s=>({scene:s.id,src:s.video.currentSrc.startsWith('blob:'),ranges:s.video.seekable.length,end:s.video.seekable.length?s.video.seekable.end(0):0,ready:s.ready,failed:s.failed})))`));
report.console_errors=events.filter(event=>event.method==='Runtime.exceptionThrown'||event.params?.entry?.level==='error'||event.params?.type==='error').map(event=>event.method);
await evaluate('window.__INOXNOW_QA__.destroy()');report.destroyed=await evaluate(`document.documentElement.dataset.destroyed==='true'`);

const reducedTarget=await fetch(`${endpoint}/json/new?${encodeURIComponent('http://127.0.0.1:8765/media/prototypes/full-scroll-world-audit.html?reduced=1')}`,{method:'PUT'}).then(response=>response.json());
const reducedWs=new WebSocket(reducedTarget.webSocketDebuggerUrl),reducedPending=new Map();let reducedId=1;
await new Promise((resolve,reject)=>{reducedWs.addEventListener('open',resolve,{once:true});reducedWs.addEventListener('error',reject,{once:true})});
reducedWs.addEventListener('message',event=>{const message=JSON.parse(event.data);if(!message.id||!reducedPending.has(message.id))return;const task=reducedPending.get(message.id);reducedPending.delete(message.id);message.error?task.reject(new Error(message.error.message)):task.resolve(message.result)});
const reducedSend=(method,params={})=>new Promise((resolve,reject)=>{const id=reducedId++;reducedPending.set(id,{resolve,reject});reducedWs.send(JSON.stringify({id,method,params}))});
await reducedSend('Runtime.enable');
for(let i=0;i<80;i+=1){const result=await reducedSend('Runtime.evaluate',{expression:'document.title',returnByValue:true});if(result.result?.value==='qa-ready')break;await wait(100)}
const reducedResult=await reducedSend('Runtime.evaluate',{expression:`JSON.stringify({reduced:window.__INOXNOW_QA__.reduced,ready:window.__INOXNOW_QA__.scenes.map(s=>s.ready),videos:window.__INOXNOW_QA__.scenes.map(s=>s.video.currentSrc),title:document.title})`,returnByValue:true});report.reduced_motion=JSON.parse(reducedResult.result.value);
reducedWs.close();await fetch(`${endpoint}/json/close/${reducedTarget.id}`);
fs.writeFileSync(path.join(root,'media','reports','scroll-prototype-test-results.json'),`${JSON.stringify(report,null,2)}\n`);
ws.close();await fetch(`${endpoint}/json/close/${target.id}`);
