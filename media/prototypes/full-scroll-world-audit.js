import { createSpatialTransition, spatialBridges } from '../bridges/spatial-transition-2_5d-audited.js';

const scenes = [
  ['01','Almacén','../generated-clips/scene-01-internal-motion-minimax-h3-2k-original.mp4','../source-images/scene-01-warehouse.webp'],
  ['02','Showroom','../generated-clips/scene-02-internal-motion-minimax-h3-2k-original.mp4','../source-images/scene-02-showroom.webp'],
  ['03','Expedición','../generated-clips/scene-03-internal-motion-corrected-minimax-h3-2k-original.mp4','../source-images/scene-03-expedition.webp'],
  ['04','Cocina vacía','../generated-clips/scene-04-internal-motion-minimax-h3-2k-original.mp4','../source-images/scene-04-empty-kitchen.webp'],
  ['05','Instalación','../generated-clips/scene-05-installation-motion-minimax-h3-2k-original.mp4','../source-images/scene-05-installation.webp'],
  ['06','Cocina operativa','../generated-clips/scene-06-internal-motion-minimax-h3-2k-original.mp4','../source-images/scene-06-operational-kitchen.webp'],
].map(([id,title,clip,poster])=>({id,title,clip,poster,video:null,image:null,ready:false,failed:false,objectUrl:null,target:0}));

const stage=document.querySelector('.stage');
const bridgeCanvas=document.querySelector('.bridge');
const nav=document.querySelector('.nav');
const status=document.querySelector('.status');
const captionSmall=document.querySelector('.caption small');
const captionTitle=document.querySelector('.caption strong');
const progressBar=document.querySelector('.progress i');
const fallback=document.querySelector('.fallback');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).get('reduced')==='1';
const aborter=new AbortController();
const transitions=new Map();
let activeSegment=-1;
let destroyed=false;
let ticking=false;
let lastWidth=innerWidth;
let renderGeneration=0;

for(const [index,scene] of scenes.entries()){
  const image=new Image();
  image.className='poster';image.src=scene.poster;image.alt=`Escena ${scene.id}: ${scene.title}`;stage.append(image);scene.image=image;
  const video=document.createElement('video');
  video.className='media';video.muted=true;video.playsInline=true;video.preload='auto';video.setAttribute('muted','');video.setAttribute('playsinline','');stage.append(video);scene.video=video;
  const button=document.createElement('button');
  button.type='button';button.textContent=`${scene.id} ${scene.title}`;button.dataset.scene=scene.id;button.addEventListener('click',()=>jumpToScene(index));nav.append(button);
}

async function loadVideo(scene){
  if(reduced)return;
  try{
    const response=await fetch(scene.clip,{signal:aborter.signal});
    if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);
    scene.objectUrl=URL.createObjectURL(await response.blob());
    scene.video.src=scene.objectUrl;
    await new Promise((resolve,reject)=>{
      scene.video.addEventListener('loadedmetadata',resolve,{once:true});
      scene.video.addEventListener('error',reject,{once:true});
    });
    scene.ready=true;
  }catch(error){
    if(error.name!=='AbortError'){scene.failed=true;console.error(`Clip ${scene.id}`,error)}
  }
}

async function getTransition(index){
  if(transitions.has(index))return transitions.get(index);
  const promise=createSpatialTransition(bridgeCanvas,spatialBridges[index]);
  transitions.set(index,promise);
  return promise;
}

function hideAll(){
  for(const scene of scenes){scene.video.classList.remove('is-visible');scene.image.classList.remove('is-visible')}
  bridgeCanvas.classList.remove('is-visible');
  document.querySelector('.bridge-poster')?.remove();
}

function showBridgeFallback(index){
  let image=document.querySelector('.bridge-poster');
  if(!image){image=new Image();image.className='bridge-poster';image.alt=`Puente ${spatialBridges[index].id}`;stage.append(image)}
  image.src=spatialBridges[index].preview;image.classList.add('is-visible');
}

async function render(){
  ticking=false;
  const generation=++renderGeneration;
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  const totalSegments=reduced?6:11;
  const overall=Math.max(0,Math.min(1,scrollY/max));
  const exact=overall*(totalSegments-0.000001);
  const segment=Math.min(totalSegments-1,Math.floor(exact));
  const local=exact-segment;
  progressBar.style.transform=`scaleX(${overall})`;
  if(segment!==activeSegment){activeSegment=segment;hideAll()}

  const sceneIndex=reduced?segment:Math.floor(segment/2);
  const scene=scenes[sceneIndex];
  nav.querySelectorAll('button').forEach((button,index)=>button.setAttribute('aria-current',String(index===sceneIndex)));
  captionSmall.textContent=`Escena ${scene.id} · ${reduced?'movimiento reducido':segment%2?'transición 2.5D':'clip interno'}`;
  captionTitle.textContent=scene.title;

  if(reduced || segment%2===0){
    scene.image.classList.add('is-visible');
    fallback.classList.toggle('is-visible',scene.failed);
    if(!reduced && scene.ready && !scene.failed){
      scene.video.classList.add('is-visible');
      const duration=Math.max(0,scene.video.duration-0.04);
      scene.target=local*duration;
      if(!scene.video.seeking && Math.abs(scene.video.currentTime-scene.target)>.012){
        try{scene.video.currentTime=scene.target}catch{}
      }
    }
  }else{
    fallback.classList.remove('is-visible');
    const bridgeIndex=(segment-1)/2;
    bridgeCanvas.classList.add('is-visible');
    try{
      const transition=await getTransition(bridgeIndex);
      if(generation!==renderGeneration||segment!==activeSegment)return;
      transition.render(local);
    }catch(error){console.error(`Puente ${bridgeIndex}`,error);showBridgeFallback(bridgeIndex)}
  }
  status.textContent=`${Math.round(overall*100)}% · ${reduced?'fallback estático':`segmento ${segment+1}/11`}`;
  document.documentElement.dataset.ready='true';
  document.title='qa-ready';
}

function requestRender(){if(!ticking){ticking=true;requestAnimationFrame(render)}}
function jumpToScene(index){
  const segment=reduced?index:index*2;
  const total=reduced?6:11;
  const max=document.documentElement.scrollHeight-innerHeight;
  scrollTo({top:max*((segment+.05)/total),behavior:reduced?'auto':'smooth'});
}
function onKey(event){
  const map={ArrowDown:.08,PageDown:.45,ArrowUp:-.08,PageUp:-.45,Home:-Infinity,End:Infinity};
  if(!(event.key in map))return;
  event.preventDefault();
  const max=document.documentElement.scrollHeight-innerHeight;
  const amount=map[event.key];
  scrollTo({top:amount===Infinity?max:amount===-Infinity?0:scrollY+amount*innerHeight,behavior:reduced?'auto':'smooth'});
}
function onResize(){if(innerWidth===lastWidth)return;lastWidth=innerWidth;requestRender()}
function destroy(){
  if(destroyed)return;destroyed=true;aborter.abort();
  removeEventListener('scroll',requestRender);removeEventListener('resize',onResize);removeEventListener('keydown',onKey);removeEventListener('pagehide',destroy);
  for(const scene of scenes)if(scene.objectUrl)URL.revokeObjectURL(scene.objectUrl);
  document.documentElement.dataset.destroyed='true';
}

addEventListener('scroll',requestRender,{passive:true});
addEventListener('resize',onResize,{passive:true});
addEventListener('keydown',onKey);
addEventListener('pagehide',destroy,{once:true});
window.__INOXNOW_QA__={scenes,spatialBridges,transitions,reduced,jumpToScene,destroy,getState:()=>({segment:activeSegment,scrollY,ready:scenes.map(s=>s.ready),failed:scenes.map(s=>s.failed),destroyed})};

await Promise.all(scenes.map(loadVideo));
status.textContent=reduced?'Modo de movimiento reducido':'Recursos listos';
requestRender();
