import http from 'node:http';
import {stat} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve,extname,sep,relative} from 'node:path';
import {randomUUID} from 'node:crypto';
import {ComfyBridge} from './backend/bridge.mjs';
import {StudioJobs} from './backend/jobs.mjs';

const root=dirname(fileURLToPath(import.meta.url)),port=Number(process.env.PORT||4317),origin='http://127.0.0.1:'+port;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.mp3':'audio/mpeg','.wav':'audio/wav','.mp4':'video/mp4','.png':'image/png','.jpg':'image/jpeg'};
const allowed=['studio','workflows','worlds.json','demo'];
// The studio page loads only its own files; blob: carries local media previews. Nothing may frame the credit controls.
const csp="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; media-src 'self' blob:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";
const baseHeaders={'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY'};
class RequestError extends Error{}
export function safePath(url){const name=decodeURIComponent(new URL(url,origin).pathname).replace(/^\/+/, '')||'studio/index.html',path=resolve(root,name),within=relative(root,path);return path.startsWith(root+sep)&&allowed.some(x=>within===x||within.startsWith(x+'/'))?path:null}
async function body(req){let size=0,chunks=[];for await(const chunk of req){size+=chunk.length;if(size>100*1024*1024)throw new RequestError('Selected media is too large.');chunks.push(chunk)}try{return JSON.parse(Buffer.concat(chunks).toString()||'{}')}catch{throw new RequestError('The studio request could not be read. Reload the page and try again.')}}
function json(res,status,value){res.writeHead(status,{...baseHeaders,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value))}
function notFound(res){res.writeHead(404,{...baseHeaders,'Content-Type':'text/plain; charset=utf-8'});res.end('Not found')}
export function byteRange(header,size){
  const match=/^bytes=(\d*)-(\d*)$/.exec(header||'');if(!match||(!match[1]&&!match[2]))return null;
  let start=match[1]?Number(match[1]):size-Number(match[2]),end=match[1]&&match[2]?Number(match[2]):size-1;
  if(start<0)start=0;if(end>=size)end=size-1;return start<=end&&start<size?{start,end}:false;
}
async function sendFile(req,res,path,{media}){
  let info;try{info=await stat(path)}catch{return notFound(res)}
  if(!info.isFile())return notFound(res);
  const tag=`W/"${info.size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}"`,type=mime[extname(path)]||'application/octet-stream';
  const headers={...baseHeaders,'Content-Type':type,'Accept-Ranges':'bytes','Cache-Control':media?'no-store':'no-cache','Permissions-Policy':'microphone=(self), camera=(), tools=(self)'};
  if(!media)headers.ETag=tag;if(type.startsWith('text/html'))headers['Content-Security-Policy']=csp;
  if(!media&&req.headers['if-none-match']===tag){res.writeHead(304,headers);return res.end()}
  // Safari and iOS only play audio/video from servers that honor byte ranges.
  const range=req.headers.range?byteRange(req.headers.range,info.size):null;
  if(range===false){res.writeHead(416,{...headers,'Content-Range':`bytes */${info.size}`});return res.end()}
  const {start,end}=range||{start:0,end:info.size-1};
  res.writeHead(range?206:200,{...headers,'Content-Length':info.size?end-start+1:0,...(range?{'Content-Range':`bytes ${start}-${end}/${info.size}`}:{})});
  if(req.method==='HEAD'||!info.size)return res.end();
  createReadStream(path,{start,end}).on('error',()=>res.destroy()).pipe(res);
}
export function createServer(bridge=new ComfyBridge(origin),{storageRoot=root}={}){
  const jobs=new StudioJobs(root,bridge,storageRoot),ready=jobs.init(),sessions=new Set();
  const server=http.createServer(async(req,res)=>{
    try{
      const local=server.address().port,canonical='127.0.0.1:'+local;
      if(req.headers.host==='localhost:'+local&&req.method==='GET'&&!req.url.startsWith('/api/')){res.writeHead(307,{...baseHeaders,Location:'http://'+canonical+req.url});return res.end()}
      if(req.headers.host!==canonical){res.writeHead(403,{...baseHeaders,'Content-Type':'text/plain; charset=utf-8'});return res.end('Local studio only. Open http://'+canonical)}
      const url=new URL(req.url,origin);let session=req.headers.cookie?.match(/(?:^|;\s*)studio_session=([a-f0-9-]+)/)?.[1];
      if(url.pathname==='/oauth/callback'){
        try{await bridge.callback(url.searchParams);res.writeHead(200,{...baseHeaders,'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end('<!doctype html><title>Comfy connected</title><p>Comfy is connected. Return to Soundscape Studio.</p><script>if(window.opener){window.opener.postMessage({type:"comfy-connected"},'+JSON.stringify(origin)+');window.close()}else{location.replace("/")}</script>')}
        catch{res.writeHead(400,{...baseHeaders,'Content-Type':'text/plain; charset=utf-8'});return res.end('Comfy sign-in could not be completed. Return to the studio and reconnect.')}
      }
      if(!session||!sessions.has(session)){
        if(req.method!=='GET'||url.pathname.startsWith('/api/'))return json(res,403,{error:'Open the studio page before using its API.'});
        session=randomUUID();sessions.add(session);res.setHeader('Set-Cookie',`studio_session=${session}; HttpOnly; SameSite=Strict; Path=/`);
      }
      if(req.method==='POST'&&req.headers.origin!=='http://'+canonical)return json(res,403,{error:'Actions must start in this local studio.'});
      await ready;
      if(url.pathname==='/api/state'&&req.method==='GET')return json(res,200,{connected:bridge.connected,jobs:[...jobs.jobs.values()].map(j=>jobs.public(j))});
      if(url.pathname==='/api/connect'&&req.method==='POST')return json(res,200,await bridge.connect());
      if(url.pathname==='/api/disconnect'&&req.method==='POST'){await bridge.disconnect();return json(res,200,{connected:false})}
      if(['/api/world','/api/song','/api/image'].includes(url.pathname)&&req.method==='POST')return json(res,202,await jobs.submit(url.pathname.split('/').pop(),await body(req)));
      const job=url.pathname.match(/^\/api\/jobs\/([a-f0-9-]{36})(?:\/(cancel|release))?$/);
      if(job&&req.method===(job[2]?'POST':'GET'))return json(res,200,await (job[2]==='cancel'?jobs.cancel(job[1]):job[2]==='release'?jobs.release(job[1]):jobs.status(job[1])));
      const media=url.pathname.match(/^\/api\/media\/([a-f0-9-]{36}\.(?:mp3|mp4|png))$/);
      if(!media&&url.pathname.startsWith('/api/'))return json(res,404,{error:'Unknown studio action.'});
      const path=media?resolve(storageRoot,'local/results',media[1]):safePath(req.url);
      if(!path||!['GET','HEAD'].includes(req.method))return notFound(res);
      return await sendFile(req,res,path,{media:!!media});
    }catch(e){
      if(res.headersSent)return res.destroy();
      // System errors carry local paths; only studio-authored messages reach the page.
      json(res,400,{error:e instanceof URIError?'Not found':e.code?'This action could not be completed.':e.message||'This action could not be completed.'});
    }
  });
  return server;
}
if(process.argv[1]===fileURLToPath(import.meta.url))createServer().listen(port,'127.0.0.1',()=>console.log('Soundscape Studio · '+origin));
