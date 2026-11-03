"""Rebuild portable native Comfy apps; never executes inference."""
import copy
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
base=json.loads((ROOT/'vendor/comfy/world-base.json').read_text())
worlds=json.loads((ROOT/'worlds.json').read_text())
for world in worlds:
 d=copy.deepcopy(base); c=d['extra']['soundscapeStudio']['controls']
 d['extra']['soundscapeStudio']['world']=world['id']
 next(n for n in d['nodes'] if n['id']==c['prompt'])['widgets_values'][0]=world['prompt']
 next(n for n in d['nodes'] if n['id']==c['output'])['widgets_values'][0]='SoundscapeStudio/'+world['id']
 (ROOT/'workflows'/(world['id']+'.json')).write_text(json.dumps(d,indent=2)+'\n')
 mic=copy.deepcopy(d);rec=json.loads((ROOT/'vendor/comfy/record-audio-node.json').read_text());rec['id']=max(n['id'] for n in d['nodes'])+1;rec['mode']=0;rec['title']='Record your sound';rec['widgets_values']=['',''];rec['widgets_values_named']={'audio':''}
 trim=next(n for n in mic['nodes'] if n['id']==c['start']);link_id=next(x['link'] for x in trim['inputs'] if x['name']=='audio');link=next(l for l in mic['links'] if l[0]==link_id);link[1]=rec['id']
 next(n for n in mic['nodes'] if n['id']==c['audio'])['outputs'][0]['links']=[];rec['outputs'][0]['links']=[link_id];mic['nodes'].append(rec);mic['last_node_id']=rec['id']
 mic['extra']['linearData']['inputs']=[[rec['id'],'audio'] if str(x[0])==str(c['audio']) else x for x in mic['extra']['linearData']['inputs']]
 mic['extra']['soundscapeStudio']['controls']['audio']=rec['id']
 (ROOT/'workflows'/(world['id']+'-microphone.json')).write_text(json.dumps(mic,indent=2)+'\n')
(ROOT/'studio/frame-presets.json').write_text((ROOT/'frame-presets.json').read_text())
print(f'Built {len(worlds)*2} native scene apps.')
