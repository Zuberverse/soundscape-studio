import {storeRequest,listFrames,saveFrame,removeFrame,listScenes,saveScene,imageRecord,assetTitle,filename} from './library.mjs';
const $=s=>document.querySelector(s);
function button(text,action,primary=false){const b=document.createElement('button');b.className=primary?'button primary':'quiet';b.textContent=text;b.onclick=action;return b}
export class StudioCollections{
  constructor(actions){this.actions=actions;this.frames=new Map();this.scenes=new Map();this.urls=new Map();this.pendingTitles=new Map();this.hiddenFrames=new Set();this.syncing=false;this.renameTarget=null}
  async persist(action){try{await action()}catch{this.actions.message('The library is available for this session, but browser storage could not save it. Download important media.')}}
  frameDefault(){return 'Frame '+([...this.frames.values()].filter(f=>f.source!=='included').length+1)}
  sceneDefault(){return 'Scene '+(this.scenes.size+1)}
  frameUrl(frame){if(!this.urls.has(frame.id))this.urls.set(frame.id,URL.createObjectURL(frame.file));return this.urls.get(frame.id)}
  async init(){
    try{this.hiddenFrames=new Set(await storeRequest('draft',s=>s.get('hidden-frames'),'readonly')||[]);for(const [id,title] of await storeRequest('draft',s=>s.get('frame-requests'),'readonly')||[])this.pendingTitles.set(id,title);for(const f of await listFrames())this.frames.set(f.id,f);for(const s of await listScenes())this.scenes.set(s.id,s)}catch{this.actions.message('Browser library storage is unavailable; media can still be used for this session.')}
    if(!this.frames.has('first-light')){const response=await fetch('/demo/opening-frame.png');const file=new File([await response.blob()],'First-Light-Opening-Frame.png',{type:'image/png'});const frame=await imageRecord(file,{id:'first-light',title:'First Light',source:'included',description:'The original included example frame.'});this.frames.set(frame.id,frame);await this.persist(()=>saveFrame(frame))}
    this.render();
    $('#close-rename').onclick=()=>$('#rename-dialog').close();
    $('#save-rename').onclick=async()=>{try{await this.rename(this.renameTarget.kind,this.renameTarget.id,$('#rename-name').value);$('#rename-dialog').close();this.actions.message('Name saved. No generation was run.')}catch(e){$('#rename-status').textContent=e.message}};
  }
  async addFrame(file,options={}){
    const record=await imageRecord(file,{title:options.title||this.frameDefault(),...options});
    if(!options.id&&options.source==='uploaded'){const prior=[...this.frames.values()].find(f=>f.sha256===record.sha256);if(prior)return prior}
    this.frames.set(record.id,record);await this.persist(()=>saveFrame(record));this.renderFrames();return record;
  }
  async chooseFrame(id){const frame=this.frames.get(id);if(!frame)throw Error('Choose a saved frame.');await this.actions.selectFrame(frame);return frame}
  async rememberFrameTitle(id,title){this.pendingTitles.set(id,title);await this.persist(()=>storeRequest('draft',s=>s.put([...this.pendingTitles],'frame-requests')))}
  async generatedFrame(job){
    const id='job-'+job.id;if(this.hiddenFrames.has(id))return null;if(this.frames.has(id))return this.frames.get(id);
    const response=await fetch(job.output);if(!response.ok)throw Error('The frame could not be loaded.');
    return this.addFrame(new File([await response.blob()],'Generated-frame.png',{type:'image/png'}),{id,title:this.pendingTitles.get(job.id)||this.frameDefault(),source:'generated'});
  }
  async reserveScene(job,title,recipe){const record={id:job.id,title:assetTitle(title,this.sceneDefault()),recipe,frameId:recipe.frameId,created:job.created||new Date().toISOString(),state:job.state,source:'generated'};this.scenes.set(record.id,record);await this.persist(()=>saveScene(record));this.renderScenes();return record}
  async syncJobs(jobs){
    if(this.syncing)return;this.syncing=true;
    try{for(const job of [...jobs].sort((a,b)=>new Date(a.created)-new Date(b.created))){
      if(job.kind==='image'&&job.state==='completed'&&job.output){try{await this.generatedFrame(job)}catch{}}
      if(job.kind==='world'){
        let record=this.scenes.get(job.id);if(!record){record={id:job.id,title:this.sceneDefault(),created:job.created,source:'generated'};this.scenes.set(job.id,record)}
        if(record.output!==job.output||record.state!==job.state){Object.assign(record,{output:job.output,state:job.state});await this.persist(()=>saveScene(record))}
      }
    }this.render()}finally{this.syncing=false}
  }
  async acceptScene(job){let record=this.scenes.get(job.id);if(!record)record=await this.reserveScene(job,'',{});Object.assign(record,{output:job.output,state:'completed'});if(record.source!=='imported')await this.persist(()=>saveScene(record));this.renderScenes();return record}
  openRename(kind,id){const record=(kind==='frame'?this.frames:this.scenes).get(id);if(!record)return;this.renameTarget={kind,id};$('#rename-heading').textContent='Rename '+kind;$('#rename-name').value=record.title;$('#rename-status').textContent='';$('#rename-dialog').showModal()}
  async rename(kind,id,title){const collection=kind==='frame'?this.frames:this.scenes,record=collection.get(id);if(!record)throw Error('That '+kind+' was not found.');record.title=assetTitle(title,kind==='frame'?'Untitled frame':'Untitled scene');if(record.source!=='imported')await this.persist(()=>kind==='frame'?saveFrame(record):saveScene(record));this.render();this.actions.renamed?.(kind,id,record.title);return {id,title:record.title}}
  async deleteFrame(id){const frame=this.frames.get(id);if(!frame||frame.source==='included')return;if(!confirm('Remove “'+frame.title+'” from this browser’s Frames library? Original files, Comfy assets and existing scenes will be kept.'))return;this.hiddenFrames.add(id);await this.persist(()=>storeRequest('draft',s=>s.put([...this.hiddenFrames],'hidden-frames')));await this.persist(()=>removeFrame(id));this.frames.delete(id);if(this.urls.has(id)){URL.revokeObjectURL(this.urls.get(id));this.urls.delete(id)}this.actions.removedFrame?.(id);this.renderFrames()}
  render(){this.renderFrames();this.renderScenes()}
  renderFrames(){
    const list=$('#frame-list');list.replaceChildren();
    for(const frame of this.frames.values()){
      const card=document.createElement('article');card.className='asset-card frame-card';card.dataset.frameId=frame.id;card.classList.toggle('selected',this.actions.selectedFrame?.()===frame.id);const img=document.createElement('img');img.src=this.frameUrl(frame);img.alt=frame.title;img.loading='lazy';
      const info=document.createElement('div');info.className='asset-info';const title=document.createElement('h3');title.textContent=frame.title;const note=document.createElement('p');note.className='hint';note.textContent=`${frame.width} × ${frame.height} · ${frame.source==='included'?'Included example':frame.source==='generated'?'Created with Comfy':'Uploaded image'}`;
      const actions=document.createElement('div');actions.className='asset-actions';actions.append(button('Use in a scene',()=>this.chooseFrame(frame.id).catch(e=>this.actions.message(e.message)),true),button('Rename',()=>this.openRename('frame',frame.id)),button('Download image',()=>this.actions.download(frame.file,'Soundscape-frame-'+filename(frame.title)+(frame.file.type==='image/jpeg'?'.jpg':frame.file.type==='image/webp'?'.webp':'.png'))));if(frame.source!=='included')actions.append(button('Remove',()=>this.deleteFrame(frame.id)));
      info.append(title,note,actions);card.append(img,info);list.append(card);
    }
    $('#frame-count').textContent=this.frames.size;
  }
  renderScenes(){
    const list=$('#take-list');list.replaceChildren();
    for(const scene of [...this.scenes.values()].reverse()){
      const card=document.createElement('article');card.className='asset-card take';card.dataset.sceneId=scene.id;
      if(scene.output){const video=document.createElement('video');video.src=scene.output;video.muted=true;video.preload='metadata';card.append(video)}
      const info=document.createElement('div');info.className='asset-info';const title=document.createElement('h3');title.textContent=scene.title;const note=document.createElement('p');note.className='hint';note.textContent=scene.source==='imported'?'Session import':scene.state==='completed'?'Created with Comfy':scene.state==='running'?'Generating':scene.state||'Preparing';const actions=document.createElement('div');actions.className='asset-actions';actions.append(button('Rename',()=>this.openRename('scene',scene.id)));
      if(scene.output){actions.prepend(button('Open scene',()=>this.actions.showScene(scene),true));const a=document.createElement('a');a.className='button soft';a.textContent='Download video';a.href=scene.output;a.download='Soundscape-scene-'+filename(scene.title)+'.mp4';actions.append(a)}
      info.append(title,note,actions);card.append(info);list.append(card);
    }
    if(!this.scenes.size){const empty=document.createElement('p');empty.className='hint';empty.textContent='Create your first scene, or import a video above.';list.append(empty)}$('#take-count').textContent=this.scenes.size;
  }
  importVideo(file){const output=URL.createObjectURL(file),record={id:crypto.randomUUID(),title:file.name.replace(/\.[^.]+$/,''),output,created:new Date().toISOString(),source:'imported',state:'completed'};this.scenes.set(record.id,record);this.renderScenes()}
  describeFrames(){return [...this.frames.values()].map(({id,title,source,width,height})=>({id,title,source,width,height}))}
  describeScenes(){return [...this.scenes.values()].map(({id,title,state,frameId})=>({id,title,state,frameId}))}
}
