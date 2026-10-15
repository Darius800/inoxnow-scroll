import fs from 'node:fs';
const endpoint='http://127.0.0.1:9337';
const target=await fetch(`${endpoint}/json/new?${encodeURIComponent('http://127.0.0.1:8765/media/reports/playback-audit.html')}`,{method:'PUT'}).then(response=>response.json());
const ws=new WebSocket(target.webSocketDebuggerUrl);const pending=new Map();let nextId=1;
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true})});
ws.addEventListener('message',event=>{const message=JSON.parse(event.data);if(!message.id||!pending.has(message.id))return;const task=pending.get(message.id);pending.delete(message.id);message.error?task.reject(new Error(message.error.message)):task.resolve(message.result)});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=nextId++;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
await send('Runtime.enable');
let ready=false;
for(let attempt=0;attempt<240;attempt+=1){const result=await send('Runtime.evaluate',{expression:'document.title',returnByValue:true});if(result.result?.value==='metadata-ready'){ready=true;break}await new Promise(resolve=>setTimeout(resolve,250))}
if(!ready)throw new Error('Timeout en la auditoría de reproducción');
const result=await send('Runtime.evaluate',{expression:'JSON.stringify(window.auditResults)',returnByValue:true});
fs.writeFileSync(new URL('./playback-audit-results.json',import.meta.url),`${JSON.stringify(JSON.parse(result.result.value),null,2)}\n`);
ws.close();await fetch(`${endpoint}/json/close/${target.id}`);
