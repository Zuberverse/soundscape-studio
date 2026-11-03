export function validateScore(score, audioDuration = Infinity) {
  if (!Number.isFinite(score.start) || score.start < 0) throw new Error('Choose a valid excerpt start.');
  if (!Number.isFinite(score.duration) || score.duration < 2 || score.duration > 16) throw new Error('Choose a passage from 2 to 16 seconds.');
  if (score.start + score.duration > audioDuration + 0.03) throw new Error('The passage extends beyond your audio.');
  if (!Number.isSafeInteger(score.seed) || score.seed < 0) throw new Error('Seed must be a nonnegative whole number.');
  if (typeof score.prompt !== 'string' || !score.prompt.trim() || score.prompt.length > 10000) throw new Error('Add a scene direction, up to 10,000 characters.');
  return score;
}
export function prepareWorkflow(template, score) {
  validateScore(score);
  const graph = structuredClone(template);
  const c=graph.extra?.soundscapeStudio?.controls;
  if(!c) throw new Error('Unsupported workflow version.');
  for(const [key,value] of Object.entries({prompt:score.prompt,start:score.start,duration:score.duration,seed:score.seed})){
    const node=graph.nodes.find(n=>n.id===c[key]);
    if(!Array.isArray(node?.widgets_values))throw new Error('Workflow control missing: '+key);
    node.widgets_values[0]=value;
  }
  graph.extra.soundscapeStudio={...graph.extra.soundscapeStudio,world:score.world,loopVerified:false};
  return graph;
}
export function portableScore(score, sources) {
  validateScore(score);
  return {schema:'soundscape-studio/1',...score,sources:sources.map(({name,type,size,sha256})=>({name,type,size,sha256})),creationBackend:'Comfy',billing:'user-workspace',loopVerified:false};
}
export function encodeWav(channels, sampleRate) {
  const count=channels.length,frames=channels[0]?.length;
  if(!count||!frames||!Number.isFinite(sampleRate)||sampleRate<8000||channels.some(c=>c.length!==frames)) throw new Error('Invalid audio samples.');
  const buffer=new ArrayBuffer(44+frames*count*2),view=new DataView(buffer);
  const text=(offset,s)=>[...s].forEach((c,i)=>view.setUint8(offset+i,c.charCodeAt(0)));
  text(0,'RIFF');view.setUint32(4,buffer.byteLength-8,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,count,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*count*2,true);view.setUint16(32,count*2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,frames*count*2,true);
  let at=44;for(let i=0;i<frames;i++)for(const channel of channels){const v=Math.max(-1,Math.min(1,channel[i]));view.setInt16(at,v<0?v*32768:v*32767,true);at+=2}return buffer;
}
export function prepareSongWorkflow(source, {prompt,lyrics='',duration=30,seed=2048}) {
  if(typeof prompt!=='string'||!prompt.trim()||prompt.length>10000)throw new Error('Describe your song in up to 10,000 characters.');
  if(typeof lyrics!=='string'||lyrics.length>10000)throw new Error('Lyrics must be fewer than 10,000 characters.');
  if(!Number.isFinite(duration)||duration<8||duration>300)throw new Error('Choose a song length from 8 to 300 seconds.');
  if(!Number.isSafeInteger(seed)||seed<0)throw new Error('Choose a nonnegative whole seed.');
  const graph=structuredClone(source),node=graph.nodes.find(n=>n.type==='MiniMaxMusic3TextEncode')||graph.nodes.find(n=>n.id===37);
  if(!node||!Array.isArray(node.widgets_values)||node.widgets_values.length<4)throw new Error('Unsupported song workflow.');
  node.widgets_values[0]=prompt;node.widgets_values[1]=lyrics.trim()||'[Instrumental]';if(node.type==='MiniMaxMusic3TextEncode'){node.widgets_values[4]=duration;const seedNode=graph.nodes.find(n=>n.type==='SeedNode');if(!seedNode)throw new Error('Song seed node missing.');seedNode.widgets_values[0]=seed;}else{node.widgets_values[2]=duration;node.widgets_values[3]=seed;}
  if(node.widgets_values_named)Object.assign(node.widgets_values_named,{caption:prompt,lyrics:lyrics.trim()||'[Instrumental]',max_duration:duration,seed});
  return graph;
}

export function prepareSceneImageWorkflow(source,{prompt,seed=2048}){
  if(typeof prompt!=='string'||!prompt.trim()||prompt.length>10000)throw new Error('Describe your scene before creating an opening image.');
  if(!Number.isSafeInteger(seed)||seed<0)throw new Error('Choose a valid variation number.');
  const graph=structuredClone(source),c=graph.extra?.soundscapeStudio?.controls;
  if(!c)throw new Error('Unsupported opening-image workflow.');
  graph.nodes.find(n=>n.id===c.prompt).widgets_values[0]=prompt+'\nA cinematic opening image with coherent spatial depth. Avoid baked-in text or logos unless explicitly requested.';
  graph.nodes.find(n=>n.id===c.seed).widgets_values[0]=seed;
  return graph;
}
