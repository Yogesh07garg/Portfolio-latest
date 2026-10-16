const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
 document.documentElement.classList.add('js-motion');
 const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}), {threshold:0.08});
 document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
}
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu')}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus()}});
document.querySelectorAll('.detail-toggle').forEach(button=>button.addEventListener('click',()=>{const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));document.getElementById(button.getAttribute('aria-controls')).hidden=expanded}));
document.querySelector('#copy-email').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText('yogeshgarg00000@gmail.com');status.textContent='Email copied.'}catch{status.textContent='Select the email address to copy it, or click it to send a message.'}});
document.querySelector('#year').textContent=new Date().getFullYear();
const progress=document.querySelector('.scroll-progress');
let scheduled=false;
function updateScroll(){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?window.scrollY/max*100:0)+'%';scheduled=false}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}},{passive:true});
window.addEventListener('resize',()=>{updateScroll();if(window.innerWidth>760)closeMenu()});updateScroll();
if('IntersectionObserver' in window){const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('nav a').forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}}),{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('main section[id]').forEach(el=>sectionObserver.observe(el))}

document.querySelectorAll('.stack-group').forEach((el,index)=>el.style.setProperty('--reveal-delay',((index%3)*90)+'ms'));
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
const systemArt=document.querySelector('.system-art');
let pointerFrame=0;
function resetDiagram(){cancelAnimationFrame(pointerFrame);['--shift-x','--shift-y','--grid-x','--grid-y'].forEach(key=>systemArt.style.removeProperty(key))}
systemArt.addEventListener('pointermove',event=>{
 if(motionPreference.matches||!finePointer.matches)return;
 cancelAnimationFrame(pointerFrame);
 pointerFrame=requestAnimationFrame(()=>{
  const bounds=systemArt.getBoundingClientRect();
  const x=(event.clientX-bounds.left)/bounds.width-.5;
  const y=(event.clientY-bounds.top)/bounds.height-.5;
  systemArt.style.setProperty('--shift-x',x*18+'px');
  systemArt.style.setProperty('--shift-y',y*18+'px');
  systemArt.style.setProperty('--grid-x',x*-8+'px');
  systemArt.style.setProperty('--grid-y',y*-8+'px');
 });
});
systemArt.addEventListener('pointerleave',resetDiagram);
motionPreference.addEventListener('change',resetDiagram);

const topicStrip=document.querySelector('.focus-strip');
const topicToggle=document.querySelector('.marquee-toggle');
topicToggle.hidden=false;
topicToggle.addEventListener('click',()=>{
 const paused=topicStrip.classList.toggle('is-paused');
 topicToggle.setAttribute('aria-pressed',String(paused));
 topicToggle.setAttribute('aria-label',paused?'Resume scrolling topics':'Pause scrolling topics');
 topicToggle.firstElementChild.textContent=paused?'\u25b6':'\u23f8';
});
document.querySelectorAll('[data-count-to]').forEach(counter=>{
 const target=Number(counter.dataset.countTo);
 const decimals=Number(counter.dataset.countDecimals||0);
 const scale=10**decimals;
 const formatter=new Intl.NumberFormat('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
 let frame=0;
 let observer;
 function finishCount(){
  cancelAnimationFrame(frame);
  counter.textContent=formatter.format(target);
  if(observer)observer.disconnect();
 }
 if(!motionPreference.matches && 'IntersectionObserver' in window){
  observer=new IntersectionObserver(entries=>{
   if(!entries.some(entry=>entry.isIntersecting))return;
   observer.disconnect();
   if(motionPreference.matches){finishCount();return}
   const start=performance.now();
   counter.textContent=formatter.format(0);
   function tick(now){
    const progress=Math.min((now-start)/1800,1);
    const eased=1-Math.pow(1-progress,3);
    counter.textContent=formatter.format(Math.floor(target*scale*eased)/scale);
    if(progress<1){frame=requestAnimationFrame(tick)}else{finishCount()}
   }
   frame=requestAnimationFrame(tick);
  },{threshold:0.6});
  observer.observe(counter);
 }
 motionPreference.addEventListener('change',event=>{if(event.matches)finishCount()});
});
