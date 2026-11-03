import {readFile,writeFile,mkdir,rename,rm} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {randomUUID} from 'node:crypto';
import {prepareWorkflow,prepareSongWorkflow,prepareSceneImageWorkflow,validateScore} from '../studio/core.mjs';
import {resultField,uploadUrl} from './bridge.mjs';

export const finished=['completed','failed','cancelled','released'];
// Several approved runs may be in flight at once; each approval carries one request identity so a retry never pays twice.
export const maxActive=4;
const requestPattern=/^[a-f0-9-]{36}$/;

export class StudioJobs {
  constructor(root,bridge,storageRoot=root){this.root=root;this.storageRoot=storageRoot;this.bridge=bridge;this.jobs=new Map();this.collecting=new Set()}
  async init(){await mkdir(resolve(this.storageRoot,'local/results'),{recursive:true,mode:0o700});try{const saved=JSON.parse(await readFile(resolve(this.storageRoot,'local/jobs.json'),'utf8'));let changed=false;for(const job of saved){if(job.state==='preparing'){Object.assign(job,{state:'failed',message:'The studio closed before this run was submitted. Nothing ran in Comfy.'});changed=true}else if(job.state==='submitting'&&!job.promptId){Object.assign(job,{state:'needs_review',message:'The studio closed while submitting. Check your Comfy queue before releasing this run.'});changed=true}this.jobs.set(job.id,job)}if(changed)await this.persist()}catch(e){if(e.code!=='ENOENT')this.storeError='Saved run history could not be read. Restore it before starting another paid run.'}}
  async persist(){const file=resolve(this.storageRoot,'local/jobs.json'),snapshot=JSON.stringify([...this.jobs.values()]);this.writeChain=(this.writeChain||Promise.resolve()).catch(()=>{}).then(async()=>{await writeFile(file+'.tmp',snapshot,{mode:0o600});await rename(file+'.tmp',file)});return this.writeChain}
  public(job){const {id,kind,state,message,output,error,created}=job;return {id,kind,state,message,output,error,created}}
  async upload(file,kind){
    const allowed=kind==='audio'?['.mp3','.wav','.flac','.ogg']:['.png','.jpg','.jpeg','.webp'];
    const extension=extname(file?.name||'').toLowerCase();
    if(!allowed.includes(extension)||typeof file?.data!=='string')throw Error(kind==='audio'?'Use WAV, MP3, FLAC or OGG audio.':'Use PNG, JPEG or WebP artwork.');
    const bytes=Buffer.from(file.data,'base64');if(!bytes.length||bytes.length>(kind==='audio'?50:20)*1024*1024)throw Error('The selected file exceeds the upload limit.');
    const path=resolve(this.storageRoot,'local',randomUUID()+extension);await writeFile(path,bytes,{mode:0o600});
    let response;try{
      const result=await this.bridge.call('upload_file',{file_path:path,client_os:process.platform==='win32'?'windows':process.platform==='darwin'?'darwin':'linux'});
      response=await fetch(uploadUrl(result),{method:'PUT',headers:{'Content-Type':kind==='audio'?({'.wav':'audio/wav','.flac':'audio/flac','.ogg':'audio/ogg'}[extension]||'audio/mpeg'):(extension==='.png'?'image/png':extension==='.webp'?'image/webp':'image/jpeg')},body:bytes,redirect:'error'});
    }finally{await rm(path,{force:true})}
    if(!response.ok)throw Error('Comfy upload failed. Nothing has been generated.');
    const asset=await response.json();if(!asset.name)throw Error('Comfy did not return an input asset.');
    return asset.subfolder?asset.subfolder+'/'+asset.name:asset.name;
  }
  async submit(kind,input){
    if(!this.bridge.connected)throw Error('Connect your Comfy account first.');
    if(input.confirm!==true)throw Error('Review and approve credit use before generating.');
    if(typeof input.requestId!=='string'||!requestPattern.test(input.requestId))throw Error('Reload the studio, then approve this run again.');
    // Submissions are serialized so duplicate approvals and the active-run limit are checked against settled state.
    const task=(this.submissionChain||Promise.resolve()).catch(()=>{}).then(()=>this.startSubmission(kind,input));this.submissionChain=task;return task;
  }
  activeJobs(){return [...this.jobs.values()].filter(j=>!finished.includes(j.state)&&j.state!=='needs_review')}
  async startSubmission(kind,input){
    if(this.storeError)throw Error(this.storeError);
    if(!this.bridge.connected)throw Error('Connect Comfy before creating new media.');
    if(input.confirm!==true)throw Error('Review and approve credit use before generating.');
    const prior=[...this.jobs.values()].find(j=>j.requestId===input.requestId);if(prior){if(prior.kind!==kind)throw Error('This approval was already used for another run.');return this.public(prior)}
    if([...this.jobs.values()].some(j=>j.state==='needs_review'))throw Error('A run needs review first. Check your Comfy queue, then release it from Runs.');
    if(this.activeJobs().length>=maxActive)throw Error(`${maxActive} runs are already in progress. Start another when one finishes.`);
    let graph;
    if(kind==='world'){
      validateScore(input.score,input.audioDuration);
      const worlds=JSON.parse(await readFile(resolve(this.root,'worlds.json'),'utf8'));
      if(!worlds.some(w=>w.id===input.score.world))throw Error('Choose a supported preset or custom scene.');
      graph=prepareWorkflow(JSON.parse(await readFile(resolve(this.root,'workflows',input.score.world+'.json'),'utf8')),input.score);
    }else if(kind==='image')graph=prepareSceneImageWorkflow(JSON.parse(await readFile(resolve(this.root,'workflows/scene-image.json'),'utf8')),input.imageDirection);
    else graph=prepareSongWorkflow(JSON.parse(await readFile(resolve(this.root,'workflows/minimax-song.json'),'utf8')),input.song);
    const job={id:randomUUID(),requestId:input.requestId,kind,state:'preparing',message:'Preparing your Comfy workflow…',created:new Date().toISOString()};this.jobs.set(job.id,job);await this.persist();
    // Return an owned local identity before any upload or submission begins.
    this.execute(job,graph,input).catch(async e=>{job.state=job.promptId?'failed':job.state==='submitting'?'needs_review':'failed';job.error=e.message;job.message='The run needs attention. No automatic resubmission.';await this.persist()});
    return this.public(job);
  }
  async execute(job,graph,input){
    if(job.kind==='world'){
      job.message='Uploading the selected music and image to your Comfy account…';
      const audio=await this.upload(input.audio,'audio'),image=await this.upload(input.image,'image');
      const c=graph.extra.soundscapeStudio.controls;
      graph.nodes.find(n=>n.id===c.audio).widgets_values[0]=audio;
      graph.nodes.find(n=>n.id===c.image).widgets_values[0]=image;
    }
    const saved=await this.bridge.call('save_workflow',{name:'Soundscape Studio '+job.kind+' '+job.id.slice(0,8),overwrite:false,workflow_json:graph});
    job.workflowId=resultField(saved,'workflow_id');if(!job.workflowId)throw Error('Comfy did not return a saved workflow identity.');
    job.state='submitting';job.message='Submitting one generation to your Comfy workspace…';await this.persist();
    const run=await this.bridge.call('run_saved_workflow',{workflow_id:job.workflowId});
    job.promptId=resultField(run,'prompt_id');if(!job.promptId)throw Error('Submission outcome is uncertain. Check your Comfy queue before trying again.');
    job.state='running';job.message='Comfy is creating your '+(job.kind==='song'?'song':job.kind==='image'?'opening image':'scene')+'…';await this.persist();
  }
  async status(id){
    const job=this.jobs.get(id);if(!job)throw Error('That run was not found in this local studio.');
    if(job.promptId&&['queued','running','cancel_requested','downloading'].includes(job.state)&&this.bridge.connected&&!this.collecting.has(id)){
      this.collecting.add(id);
      try{
        const reply=await this.bridge.call('get_job_status',{prompt_id:job.promptId});
        const d=reply.data?.result||reply.data;const status=d.job_status||d.status||d.raw_status;
        if(status==='completed'||reply.data?.completed===true){
          job.state='downloading';job.message='Saving the completed result…';await this.persist();
          const result=await this.bridge.call('get_output',{prompt_id:job.promptId,save_to_disk:false});
          const entries=result.data?.results||result.data?.result?.results||[];
          const expected=job.kind==='song'?'SaveAudioAdvanced':job.kind==='image'?'SaveImage':'SaveVideo';const file=entries.find(f=>f.class_type===expected);
          if(!file?.url)throw Error('The completed output is not available yet; reconnect and check this run again.');
          let url=new URL(file.url),response;
          for(let redirects=0;redirects<4;redirects++){
            if(url.protocol!=='https:'||!['cloud.comfy.org','storage.googleapis.com'].includes(url.hostname))throw Error('Unexpected output download host.');
            response=await fetch(url,{redirect:'manual'});if(response.status>=300&&response.status<400){url=new URL(response.headers.get('location'),url);continue}break;
          }
          if(!response?.ok)throw Error('The output download failed. Check this existing run again; do not regenerate.');
          const extension=job.kind==='song'?'.mp3':job.kind==='image'?'.png':'.mp4',name=job.id+extension;
          const body=Buffer.from(await response.arrayBuffer());if(body.length>128*1024*1024)throw Error('Output exceeds the local download limit.');
          await writeFile(resolve(this.storageRoot,'local/results',name),body,{mode:0o600});
          job.output='/api/media/'+name;job.state='completed';job.message=job.kind==='song'?'Your song is ready. Choose a passage.':job.kind==='image'?'Your opening image is ready.':'Your scene is ready to watch.';job.error=null;
        }else if(['queued','pending'].includes(status)){job.state='queued';job.message='Queued in Comfy, waiting for execution.';}else if(['in_progress','running','executing'].includes(status)){job.state='running';job.message='Comfy is generating your '+(job.kind==='song'?'song':job.kind==='image'?'opening image':'scene')+'…';}else if(['error','failed','cancelled'].includes(status)){job.state=status==='cancelled'?'cancelled':'failed';job.message='Comfy ended this run: '+status;}
        await this.persist();
      }catch(e){job.error=e.message;}finally{this.collecting.delete(id)}
    }
    return this.public(job);
  }
  async cancel(id){const job=this.jobs.get(id);if(!job?.promptId)throw Error('No submitted Comfy job is available to cancel.');if(!['queued','running'].includes(job.state))return this.public(job);await this.bridge.call('cancel_job',{prompt_id:job.promptId});job.state='cancel_requested';job.message='Cancellation requested; confirming the final Comfy state…';await this.persist();return this.public(job)}
  // An uncertain submission blocks new spending until the person confirms they checked their Comfy queue.
  async release(id){const job=this.jobs.get(id);if(!job)throw Error('That run was not found in this local studio.');if(job.state!=='needs_review')throw Error('Only a run marked for review can be released.');Object.assign(job,{state:'released',message:'Released after you checked the Comfy queue. The studio will not resubmit it.',error:null});await this.persist();return this.public(job)}
}
