'use strict';
(async()=>{
  try{
    if(!('DecompressionStream' in window)) throw new Error('This browser does not support the required decompression API.');
    const urls=['data/data_00.b64','data/data_01.b64'];
    const parts=await Promise.all(urls.map(async u=>{
      const r=await fetch(u,{cache:'no-store'});
      if(!r.ok) throw new Error('Unable to load '+u+' ('+r.status+')');
      return (await r.text()).replace(/\s+/g,'');
    }));
    const binary=atob(parts.join(''));
    const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const code=await new Response(stream).text();
    const json=code.replace(/^\s*const\s+DATA\s*=\s*/,'').replace(/;\s*$/,'');
    window.DATA=JSON.parse(json);
    const script=document.createElement('script');
    script.src='app.js';
    script.defer=true;
    document.body.appendChild(script);
  }catch(err){
    console.error(err);
    const target=document.getElementById('results');
    if(target) target.innerHTML='<div class="empty"><h3>تعذر تحميل بيانات الدليل</h3><p>يرجى فتح النسخة المنشورة عبر متصفح حديث.</p></div>';
  }
})();
