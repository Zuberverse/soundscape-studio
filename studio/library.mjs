const database='soundscape-signin-draft',version=2;
export function storeRequest(name,action,mode='readwrite'){
  return new Promise((resolve,reject)=>{
    const opening=indexedDB.open(database,version);
    opening.onupgradeneeded=()=>{for(const store of ['draft','frames','scenes'])if(!opening.result.objectStoreNames.contains(store))opening.result.createObjectStore(store)};
    opening.onerror=()=>reject(opening.error);
    opening.onsuccess=()=>{const db=opening.result,tx=db.transaction(name,mode);let request,result;try{request=action(tx.objectStore(name))}catch(e){db.close();return reject(e)}request.onsuccess=()=>{result=request.result};request.onerror=()=>reject(request.error);tx.oncomplete=()=>{db.close();resolve(result)};tx.onabort=()=>{db.close();reject(tx.error||Error('Local library could not be saved.'))}};
  });
}
export const listFrames=()=>storeRequest('frames',s=>s.getAll(),'readonly');
export const saveFrame=frame=>storeRequest('frames',s=>s.put(frame,frame.id));
export const removeFrame=id=>storeRequest('frames',s=>s.delete(id));
export const listScenes=()=>storeRequest('scenes',s=>s.getAll(),'readonly');
export const saveScene=scene=>storeRequest('scenes',s=>s.put(scene,scene.id));
export function assetTitle(value,fallback){if(typeof value!=='string')return fallback;const title=value.trim();if(title.length>80)throw Error('Use a name with at most 80 characters.');return title||fallback}
export function filename(value){return (value||'untitled').replace(/[<>:"/\\|?*\u0000-\u001f]/g,'-').replace(/[. ]+$/g,'').slice(0,80)||'untitled'}
export async function imageRecord(file,{id=crypto.randomUUID(),title,source='uploaded',description=''}={}){
  if(!(file instanceof Blob)||file.size>20*1024*1024)throw Error('Choose an image smaller than 20 MB.');
  const bitmap=await createImageBitmap(file),width=bitmap.width,height=bitmap.height;bitmap.close();if(width*height>25000000)throw Error('Choose an image smaller than 25 megapixels.');
  const sha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer()))).map(x=>x.toString(16).padStart(2,'0')).join('');
  return {id,title:assetTitle(title,'Untitled frame'),file,source,description,width,height,sha256,created:new Date().toISOString()};
}
