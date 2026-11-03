import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,resolve,extname,sep,relative} from 'node:path';
import {randomUUID} from 'node:crypto';
import {ComfyBridge} from './backend/bridge.mjs';
import {StudioJobs} from './backend/jobs.mjs';

const root=dirname(fileURLToPath(import.meta.url)),port=Number(process.env.PORT||4317),origin='http://127.0.0.1:'+port;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.mjs':'text/javascript','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.woff2':'font/woff2','.mp3':'audio/mpeg','.wav':'audio/wav','.mp4':'video/mp4','.png':'image/png','.jpg':'image/jpeg'};
const allowed=['studio','workflows','worlds.json','demo'];
export function safePath(url){const name=decodeURIComponent(new URL(url,origin).pathname).replace(/^\/+/, '')||'studio/index.html',path=resolve(root,name),within=relative(root,path);return path.startsWith(root+sep)&&allowed.some(x=>within===x||within.startsWith(x+'/'))?path:null}
async function body(req){let size=0,chunks=[];for await(const chunk of req){size+=chunk.length;if(size>100*1024*1024)throw Error('Selected media is too large.');chunks.push(chunk)}return JSON.parse(Buffer.concat(chunks).toString()||'{}')}
function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value))}
export function createServer(bridge=new ComfyBridge(origin),{storageRoot=root}={}){
  const jobs=new StudioJobs(root,bridge,storageRoot),ready=jobs.init(),sessions=new Set();
  const server=http.createServer(async(req,res)=>{
    try{
      if(!['127.0.0.1:'+server.address().port,'localhost:'+server.address().port].includes(req.headers.host)){res.writeHead(403);return res.end('Local studio only')}
      const url=new URL(req.url,origin);let session=req.headers.cookie?.match(/(?:^|;\s*)studio_session=([a-f0-9-]+)/)?.[1];
      if(url.pathname==='/oauth/callback'){
        try{await bridge.callback(url.searchParams);res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer'});return res.end('<!doctype html><title>Comfy connected</title><p>Comfy is connected. Return to Soundscape Studio.</p><script>if(window.opener){window.opener.postMessage({type:"comfy-connected"},'+JSON.stringify(origin)+');window.close()}else{location.replace("/")}</script>')}
        catch{res.writeHead(400,{'Content-Type':'text/plain'});return res.end('Comfy sign-in could not be completed. Return to the studio and reconnect.')}
      }
      if(!session||!sessions.has(session)){
        if(req.method!=='GET'||url.pathname.startsWith('/api/'))return json(res,403,{error:'Open the studio page before using its API.'});
        session=randomUUID();sessions.add(session);res.setHeader('Set-Cookie',`studio_session=${session}; HttpOnly; SameSite=Strict; Path=/`);
      }
      if(req.method==='POST'&&req.headers.origin!=='http://127.0.0.1:'+server.address().port)return json(res,403,{error:'Actions must start in this local studio.'});
      await ready;
      if(url.pathname==='/api/state'&&req.method==='GET')return json(res,200,{connected:bridge.connected,jobs:[...jobs.jobs.values()].map(j=>jobs.public(j))});
      if(url.pathname==='/api/connect'&&req.method==='POST')return json(res,200,await bridge.connect());
      if(url.pathname==='/api/disconnect'&&req.method==='POST'){await bridge.disconnect();return json(res,200,{connected:false})}
      if(['/api/world','/api/song','/api/image'].includes(url.pathname)&&req.method==='POST')return json(res,202,await jobs.submit(url.pathname.split('/').pop(),await body(req)));
      const job=url.pathname.match(/^\/api\/jobs\/([a-f0-9-]{36})(\/cancel)?$/);
      if(job&&req.method===(job[2]?'POST':'GET'))return json(res,200,await (job[2]?jobs.cancel(job[1]):jobs.status(job[1])));
      const media=url.pathname.match(/^\/api\/media\/([a-f0-9-]{36}\.(?:mp3|mp4|png))$/);
      const path=media?resolve(storageRoot,'local/results',media[1]):safePath(req.url);
      if(!path||!['GET','HEAD'].includes(req.method)){res.writeHead(404);return res.end('Not found')}
      if(!(await stat(path)).isFile())throw Error('Not found');
      res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':media?'no-store':'no-cache','Referrer-Policy':'no-referrer','Permissions-Policy':'microphone=(self), camera=(), tools=(self)'});
      res.end(req.method==='HEAD'?undefined:await readFile(path));
    }catch(e){json(res,400,{error:e.message||'This action could not be completed.'})}
  });
  return server;
}
if(process.argv[1]===fileURLToPath(import.meta.url))createServer().listen(port,'127.0.0.1',()=>console.log('Soundscape Studio · '+origin));
