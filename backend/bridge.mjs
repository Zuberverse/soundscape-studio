import {Client,StreamableHTTPClientTransport,UnauthorizedError} from '@modelcontextprotocol/client';
import {randomUUID} from 'node:crypto';

const endpoint=new URL('https://cloud.comfy.org/mcp');
export class ComfyBridge {
  constructor(origin){
    this.origin=origin;this.connected=false;this.authorizationUrl=null;
    const bridge=this;
    this.provider={
      redirectUrl:origin+'/oauth/callback',
      clientMetadata:{client_name:'Soundscape Studio',redirect_uris:[origin+'/oauth/callback'],application_type:'native',grant_types:['authorization_code','refresh_token'],response_types:['code'],token_endpoint_auth_method:'none',scope:'comfy-cloud:workflows:read comfy-cloud:workflows:write comfy-cloud:jobs:read comfy-cloud:jobs:write comfy-cloud:files:read comfy-cloud:files:write comfy-cloud:assets:read comfy-cloud:assets:write comfy-cloud:user:read comfy-cloud:billing:read comfy-mcp:tools:read comfy-mcp:tools:call'},
      creds:new Map(),storedTokens:null,verifier:null,discovery:null,lastState:null,
      clientInformation(ctx){return this.creds.get(ctx?.issuer||'default')},
      saveClientInformation(info,ctx){this.creds.set(ctx?.issuer||'default',info)},
      tokens(){return this.storedTokens},saveTokens(tokens){this.storedTokens=tokens},
      state(){this.lastState=randomUUID();return this.lastState},
      saveDiscoveryState(state){this.discovery=state},discoveryState(){return this.discovery},
      saveCodeVerifier(v){this.verifier=v},codeVerifier(){if(!this.verifier)throw Error('Authorization expired; reconnect.');return this.verifier},
      redirectToAuthorization(url){if(url.origin!==endpoint.origin)throw Error('Unexpected Comfy authorization origin.');bridge.authorizationUrl=url.href},
      invalidateCredentials(scope){if(scope==='all'||scope==='tokens')this.storedTokens=null;if(scope==='all'||scope==='client')this.creds.clear();if(scope==='all'||scope==='verifier')this.verifier=null;if(scope==='all'||scope==='discovery')this.discovery=null}
    };
  }
  async connect(){
    if(this.connected)return {connected:true};
    this.authorizationUrl=null;
    this.client=new Client({name:'Soundscape Studio',version:'0.1.0'});
    this.transport=new StreamableHTTPClientTransport(endpoint,{authProvider:this.provider});
    try{await this.client.connect(this.transport);this.connected=true;return {connected:true}}
    catch(e){this.connected=false;if(e instanceof UnauthorizedError&&this.authorizationUrl)return {connected:false,url:this.authorizationUrl};throw Error('Comfy connection could not be established. Please retry sign-in.')}
  }
  async callback(params){
    if(!params.get('state')||params.get('state')!==this.provider.lastState)throw Error('Authorization state did not match. Reconnect from the studio.');
    await this.transport.finishAuth(params);this.provider.lastState=null;
    return this.connect();
  }
  async disconnect(){await this.client?.close().catch(()=>{});this.provider.invalidateCredentials('all');this.connected=false}
  async call(name,args){
    if(!this.connected)throw Error('Connect your Comfy account first.');
    let raw;try{raw=await this.client.callTool({name,arguments:args})}catch(e){if(e instanceof UnauthorizedError){this.connected=false;throw Error('Comfy sign-in expired. Reconnect to recover this run.')}throw Error('Comfy did not return a confirmed response. Check the existing job before retrying.');}
    let data=raw.structuredContent;
    if(!data)for(const item of raw.content||[]){if(item.type==='text'){try{data=JSON.parse(item.text);if(data)break}catch{}}}
    const result=data?.result||data;
    if(raw.isError||result?.status==='tool_error'){
      const type=result?.error_type||'';
      if(type==='api.subscription_required')throw Error('This Comfy workspace needs Cloud execution access as well as credits. Choose an eligible workspace or contact Comfy.');
      throw Error(result?.message?.split('\n')[0]||'Comfy could not complete this action.');
    }
    return {data:data||{},text:(raw.content||[]).filter(x=>x.type==='text').map(x=>x.text).join('\n')};
  }
}

export function resultField(result,name){return result.data?.[name]??result.data?.result?.[name]}
export function uploadUrl(result){
  const match=result.text.match(/https:\/\/cloud\.comfy\.org\/api\/uploads\/[A-Za-z0-9_-]+/);
  if(!match)throw Error('Comfy did not provide a supported upload URL.');return match[0];
}
