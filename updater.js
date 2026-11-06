/* S2Gold updater v0.4.9. Only reload after user confirmation.
   Network-first HTML and a no-store version manifest avoid stale Safari installs.
*/
(() => {
 const VERSION='0.4.9';
 const element=document.querySelector('#updateStatus');
 const button=document.querySelector('#checkUpdate');
 const label=(message)=>{if(element)element.textContent=message;};
 let registration=null;
 let pending=false;
 const refresh=()=>{const url=new URL(location.href);url.searchParams.set('v',VERSION);url.searchParams.set('reload',String(Date.now()));location.replace(url.href);};
 async function fetchManifest(){
   const response=await fetch('./version.json?check='+Date.now(),{cache:'no-store'});
   if(!response.ok)throw new Error('HTTP '+response.status);
   return await response.json();
 }
 async function check(){
  button.disabled=true;label('Prüfe Online-Version …');
  try {
   const manifest=await fetchManifest();
   if(registration)await registration.update();
   if(manifest.version!==VERSION) {
    pending=true;
    label('Neue Version '+manifest.version+' verfügbar. „Update laden“ startet die aktuelle Version neu. Bitte vorher Spielstand sichern.');
    button.textContent='⬇ Update laden';
   }else {
    label('Webplayer '+VERSION+' – aktuelle Version. Der Cache wird automatisch kontrolliert.');
   }
  }catch(error){label('Updateprüfung fehlgeschlagen (offline?): '+error.message);}
  finally{button.disabled=false;}
 }
 button.addEventListener('click',async()=>{
   if(pending){ if(registration?.waiting)registration.waiting.postMessage({type:'SKIP_WAITING'});refresh();return; }
   await check();
 });
 if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(async r=>{
   registration=r;
   if(r.waiting){label('Ein Update ist vorbereitet. Vor dem Neustart bitte Spielstand sichern.');button.textContent='⬇ Update laden';pending=true;}
   else await check();
  }).catch(error=>label('Service Worker nicht verfügbar: '+error.message));
 } else {
  label('Service Worker wird von diesem Browser nicht unterstützt.');check();
 }
})();
