(function(){'use strict';const cfg=window.RAJA_CONFIG||{};
const API={configured:()=>!!(cfg.API_URL&&cfg.API_URL.trim()),
async request(action,options={}){if(!this.configured())throw new Error('آدرس سرویس تنظیم نشده است.');const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),cfg.REQUEST_TIMEOUT||15000);try{const url=new URL(cfg.API_URL);url.searchParams.set('action',action);if(options.token)url.searchParams.set('token',options.token);let init={method:options.method||'GET',signal:ctl.signal};if(options.body){init.method='POST';init.headers={'Content-Type':'text/plain;charset=utf-8'};init.body=JSON.stringify(options.body)}const r=await fetch(url,init);if(!r.ok)throw Error('خطای ارتباط با سرویس ('+r.status+')');const j=await r.json();if(!j.ok)throw Error(j.error||'درخواست انجام نشد');return j.data}catch(e){if(e.name==='AbortError')throw Error('مهلت ارتباط پایان یافت.');throw e}finally{clearTimeout(timer)}},
list:async(type)=>{const d=await API.request('list');return d[type]||[]},
submit:(record)=>API.request('register',{method:'POST',body:{action:'register',record}}),
login:(password)=>API.request('login',{method:'POST',body:{action:'login',password}}),
admin:(action,token,payload={})=>API.request(action,{method:'POST',token,body:{action,token,...payload}})};
window.RajaAPI=API})();
