import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', '..');
const baseUrl = 'http://127.0.0.1:8765';
const endpoint = 'http://127.0.0.1:9337';
const clips = [
  ['01','scene-01-internal-motion-minimax-h3-2k-original.mp4'],
  ['02','scene-02-internal-motion-minimax-h3-2k-original.mp4'],
  ['03','scene-03-internal-motion-corrected-minimax-h3-2k-original.mp4'],
  ['04','scene-04-internal-motion-minimax-h3-2k-original.mp4'],
  ['05','scene-05-installation-motion-minimax-h3-2k-original.mp4'],
  ['06','scene-06-internal-motion-minimax-h3-2k-original.mp4'],
];
const times = [0.05,0.60,1.20,1.80,2.50,3.10,3.70,4.30,4.90];

const target = await fetch(`${endpoint}/json/new?about:blank`, { method: 'PUT' }).then(response => response.json());
const ws = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 1;
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true})});
ws.addEventListener('message',event=>{
  const message=JSON.parse(event.data);
  if(!message.id||!pending.has(message.id))return;
  const handlers=pending.get(message.id);pending.delete(message.id);
  if(message.error)handlers.reject(new Error(message.error.message));else handlers.resolve(message.result);
});
function send(method,params={}){
  return new Promise((resolve,reject)=>{const id=nextId++;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
}
async function waitForTitle(expected='frame-ready'){
  for(let attempt=0;attempt<80;attempt+=1){
    const result=await send('Runtime.evaluate',{expression:'document.title',returnByValue:true});
    if(result.result?.value===expected)return;
    if(result.result?.value==='error')throw new Error('La página de captura informó un error');
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  throw new Error(`Timeout esperando ${expected}`);
}
async function capture(url,output,width=2560,height=1440){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url});
  await waitForTitle();
  const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,Buffer.from(screenshot.data,'base64'));
}

await send('Page.enable');
await send('Runtime.enable');
for(const [scene,clip] of clips){
  for(const time of times){
    const label=time.toFixed(2).replace('.', '-');
    const url=`${baseUrl}/media/reports/frame-capture.html?src=${encodeURIComponent(clip)}&t=${time}`;
    const output=path.join(root,'media','keyframes','audit',`scene-${scene}`,`frame-${label}.png`);
    await capture(url,output);
    process.stdout.write(`scene ${scene} ${time.toFixed(2)}s\n`);
  }
  await capture(`${baseUrl}/media/reports/contact-sheet.html?scene=${scene}`,path.join(root,'media','keyframes','contact-sheets',`scene-${scene}-contact-sheet.png`));
}
await capture(`${baseUrl}/media/reports/contact-sheet.html?scene=global`,path.join(root,'media','keyframes','contact-sheets','global-comparison.png'));
ws.close();
await fetch(`${endpoint}/json/close/${target.id}`);
