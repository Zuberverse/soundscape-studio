function el(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text)n.textContent=text;return n}
function action(text,handler,id){const b=el('button','studio-tool',text);if(id)b.id=id;b.onclick=handler;return b}
export function mountStudioLayout(actions){
  const $=s=>document.querySelector(s),main=$('#main');let mode='frame',hasResult=false,pane='stage';
  const shell=el('div','studio-grid'),assets=el('aside','studio-assets'),stage=el('section','studio-stage'),inspector=el('aside','studio-inspector'),sound=el('section','studio-sound');
  const libraryBar=el('div','pane-toolbar');libraryBar.append(el('h2','pane-title','Library'));
  const assetTabs=el('nav','asset-tabs');assetTabs.setAttribute('aria-label','Asset library');assetTabs.append($('#frames-nav'),$('#takes'));assets.append(libraryBar,assetTabs,$('#frames-panel'),$('#takes-panel'));
  const stageBar=el('div','pane-toolbar stage-toolbar'),stageTitle=el('h2','stage-title','Stage'),stageModes=el('div','stage-modes');
  const frameButton=action('Frame',()=>showFrame(),'show-frame'),resultButton=action('Result',()=>showResult(),'show-result');resultButton.disabled=true;stageModes.append(frameButton,resultButton);stageBar.append(stageTitle,stageModes);
  const guide=el('div','studio-guide');guide.append(action('1  Frame',()=>focusLibrary()),action('2  Sound',()=>focusSound()),action('3  Create',()=>focusInspector()));
  const view=el('div','stage-viewport'),canvas=$('.frame-step .canvas'),activity=$('#job-panel');view.append(canvas,activity);stage.append(stageBar,guide,view);
  const media=el('div','stage-media');for(const id of ['generated-video','generated-audio','generated-image'])media.append($('#'+id));activity.insertBefore(media,$('#use-result'));
  const resultActions=el('div','stage-result-actions');for(const id of ['use-result','rename-current-scene','download-result'])resultActions.append($('#'+id));activity.append(resultActions);
  const inspectorBar=el('div','pane-toolbar');inspectorBar.append(el('h2','pane-title','Scene setup'));const fields=el('div','inspector-fields');fields.append($('.scene-name-field'),$('.motion-controls'));const inspectorFooter=el('div','inspector-footer');inspectorFooter.append($('.run-bar'),$('.other-routes'));inspector.append(inspectorBar,fields,inspectorFooter);
  const soundBar=el('div','pane-toolbar');soundBar.append(el('h2','pane-title','Sound'));sound.append(soundBar,$('.sound'));
  sound.querySelector('.pane-toolbar').append(el('span','sound-panel-note','Choose a source · shape a passage'));shell.append(assets,stage,inspector,sound);main.append(shell);
  const mobile=el('nav','studio-mobile-tabs');mobile.setAttribute('aria-label','Studio panels');for(const [key,label] of [['library','Library'],['stage','Stage'],['sound','Sound'],['controls','Controls']])mobile.append(action(label,()=>showPane(key),'panel-'+key));main.prepend(mobile);
  const status=el('div','studio-status');status.append($('#message'),$('#webmcp-state'));main.append(status);
  // Keep connection and agent routes visible, outside the scrolling panel bodies.
  $('#about-dialog').append($('#clear-draft'));const connection=$('.connection');document.querySelector('header').insertBefore(connection,$('.header-actions'));$('#compose').textContent='Studio';document.querySelector('header').insertBefore($('#compose'),connection);
  const watch=$('#hero-demo');watch.className='studio-tool';watch.textContent='Example';stageBar.append(watch);
  const choose=$('#browse-frames');choose.className='studio-tool';choose.textContent='Choose frame';stageBar.append(choose);
  const fresh=action('New scene',()=>{actions.newScene();showFrame();focusInspector()});stageBar.append(fresh);
  const selected=$('#selected-frame-title');selected.classList.add('studio-reference-name');fields.prepend(selected);
  document.body.classList.add('studio-mode');main.classList.add('studio-main');
  function showPane(next){pane=next;main.dataset.pane=next;mobile.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.id==='panel-'+next)))}
  function title(){stageTitle.textContent=mode==='frame'?actions.frameTitle()||'Choose a frame':actions.resultTitle()||'Result'}
  function showFrame(){for(const id of ['generated-video','generated-audio'])$('#'+id).pause();mode='frame';canvas.hidden=false;activity.hidden=true;frameButton.classList.add('active');resultButton.classList.remove('active');showPane('stage');title()}
  function showResult(){if(!hasResult)return;actions.beforeResult?.();mode='result';canvas.hidden=true;activity.hidden=false;resultButton.classList.add('active');frameButton.classList.remove('active');showPane('stage');title()}
  function focusLibrary(){actions.showLibrary();showPane('library');$('#library-create-frame').focus({preventScroll:true})}
  function focusSound(){showPane('sound');$('#demo-song').focus({preventScroll:true})}
  function focusInspector(){showPane('controls');$('#scene-name').focus({preventScroll:true})}
  function updateJob(job,isNew){hasResult=true;resultButton.disabled=false;resultButton.textContent=['completed','failed','cancelled','needs_review'].includes(job.state)?'Result':'Result · working';if(isNew)showResult();else{canvas.hidden=mode!=='frame';activity.hidden=mode!=='result';title()}}
  showFrame();return {showFrame,showResult,showPane,focusLibrary,focusSound,focusInspector,updateJob,refresh:title,get mode(){return mode}};
}
