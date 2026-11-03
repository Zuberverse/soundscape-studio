import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateScore,prepareWorkflow,portableScore,encodeWav,prepareSongWorkflow,prepareSceneImageWorkflow} from '../studio/core.mjs';
import {safePath} from '../server.mjs';
const score={world:'aurora-portal',start:1,duration:8,seed:2048,prompt:'A portal responds to the musical phrases.'};
test('excerpt boundaries reject overruns and nonfinite inputs',()=>{
  assert.equal(validateScore(score,9),score);
  for(const s of [{...score,start:-1},{...score,duration:17},{...score,start:NaN},{...score,seed:2.5},{...score,prompt:''}])assert.throws(()=>validateScore(s,9));
  assert.throws(()=>validateScore(score,8));
});
test('export updates native and named values, retains the original graph',async()=>{
  const source=JSON.parse(await readFile(new URL('../workflows/aurora-portal.json',import.meta.url)));
  const before=JSON.stringify(source),out=prepareWorkflow(source,score),c=out.extra.soundscapeStudio.controls;
  assert.equal(JSON.stringify(source),before);assert.equal(out.nodes.find(n=>n.id===c.prompt).widgets_values[0],score.prompt);assert.equal(out.nodes.find(n=>n.id===c.start).widgets_values[0],1);assert.equal(out.nodes.find(n=>n.id===c.duration).widgets_values[0],8);assert.deepEqual(out.links,source.links);

});
test('microphone variant uses actual RecordAudio output and App Mode input',async()=>{
  const d=JSON.parse(await readFile(new URL('../workflows/aurora-portal-microphone.json',import.meta.url)));
  const c=d.extra.soundscapeStudio.controls;assert.equal(d.links.find(l=>l[4]===0&&l[3]===c.start)[1],c.audio);assert.equal(d.nodes.find(n=>n.id===c.audio).mode,0);
  assert.deepEqual(d.extra.linearData.inputs[1],[d.extra.soundscapeStudio.controls.audio,'audio']);
});
test('portable recipes exclude local paths, arbitrary file data and credentials',()=>{
  const out=portableScore(score,[{name:'audio.wav',size:4,type:'audio/wav',sha256:'abc',path:'/private/file',apiKey:'secret',bytes:'private'}]);
  assert.equal(out.sources[0].path,undefined);assert.equal(out.sources[0].apiKey,undefined);assert.equal(out.sources[0].bytes,undefined);assert.equal(out.loopVerified,false);
});
test('recordings become interoperable PCM WAV with correct size and clipping',()=>{
  const v=new DataView(encodeWav([new Float32Array([-2,0,2])],48000));
  assert.equal(v.byteLength,50);assert.equal(v.getUint32(24,true),48000);assert.equal(v.getUint32(40,true),6);assert.equal(v.getInt16(44,true),-32768);assert.equal(v.getInt16(48,true),32767);
  assert.throws(()=>encodeWav([],48000));
});
test('static server refuses private repository, traversal and credentials paths',()=>{
  assert.equal(safePath('/.git/config'),null);assert.equal(safePath('/docs/../LICENSE'),null);assert.equal(safePath('/studio/../../.env'),null);assert.equal(safePath('/studio/%2e%2e/%2e%2e/.env'),null);assert.equal(safePath('/studio/..%2f.git/config'),null);assert.ok(safePath('/studio/app.mjs'));
});
test('MiniMax song export keeps the prompt, optional lyrics and duration in the native graph',async()=>{
  const source=JSON.parse(await readFile(new URL('../workflows/minimax-song.json',import.meta.url)));
  const out=prepareSongWorkflow(source,{prompt:'Warm ambient instrumental',duration:24});
  const n=out.nodes.find(n=>n.type==='MiniMaxMusic3TextEncode');assert.equal(n.widgets_values[0],'Warm ambient instrumental');assert.equal(n.widgets_values[1],'[Instrumental]');assert.equal(n.widgets_values[4],24);assert.equal(out.nodes.find(n=>n.type==='SeedNode').widgets_values[0],2048);
  assert.deepEqual(out.definitions,source.definitions);
  assert.throws(()=>prepareSongWorkflow(source,{prompt:'',duration:24}));assert.throws(()=>prepareSongWorkflow(source,{prompt:'test',duration:900}));
});

test('scene direction reaches the opening-image encoder and preserves native links',async()=>{const source=JSON.parse(await readFile(new URL('../workflows/scene-image.json',import.meta.url)));const out=prepareSceneImageWorkflow(source,{prompt:'A tidal wave beneath blue light',seed:17});const c=out.extra.soundscapeStudio.controls;assert.match(out.nodes.find(n=>n.id===c.prompt).widgets_values[0],/^A tidal wave beneath blue light/);assert.equal(out.nodes.find(n=>n.id===c.seed).widgets_values[0],17);assert.deepEqual(out.links,source.links);assert.throws(()=>prepareSceneImageWorkflow(source,{prompt:'',seed:17}));});
