(()=>{'use strict';
const header=document.querySelector('.site-header');const bar=document.querySelector('#progress span');const back=document.querySelector('#back-top');
const menuToggle=document.getElementById('menu-toggle');const menu=document.getElementById('mobile-menu');
let raf=0;
function onScroll(){if(raf)return;raf=requestAnimationFrame(()=>{const d=document.documentElement;bar.style.width=(100*Math.max(0,d.scrollTop)/(d.scrollHeight-d.clientHeight||1))+'%';header.classList.toggle('scrolled',window.scrollY>20);back.classList.toggle('show',window.scrollY>850);raf=0;});}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
back.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
function setMenu(open){menu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);}
menuToggle.addEventListener('click',()=>setMenu(menu.hidden));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
window.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false);if(e.key.toLowerCase()==='f'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!(document.activeElement&&/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName))){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>{});}});
let activeNav=null;const navs=[...document.querySelectorAll('.chapter-link')];
const chapterObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){const n=e.target.id.split('-')[1];if(activeNav)activeNav.classList.remove('active');activeNav=navs.find(a=>a.dataset.nav===n);activeNav?.classList.add('active');}});},{rootMargin:'-15% 0px -65% 0px',threshold:0});document.querySelectorAll('.chapter').forEach(el=>chapterObserver.observe(el));
function animateNumber(el){if(el.dataset.done)return;el.dataset.done='1';const target=Number(el.dataset.count),dec=Number(el.dataset.decimals||0),duration=1200;let start=0;const easing=t=>1-Math.pow(1-t,3);function tick(now){if(!start)start=now;let pct=Math.min(1,(now-start)/duration);let num=target*easing(pct);el.textContent=num.toLocaleString('vi-VN',{minimumFractionDigits:dec,maximumFractionDigits:dec});if(pct<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:0.07,rootMargin:'0px 0px 65px 0px'});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));const counters=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){animateNumber(e.target);counters.unobserve(e.target);}}),{threshold:.45});document.querySelectorAll('.counter').forEach(el=>counters.observe(el));}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));document.querySelectorAll('.counter').forEach(animateNumber);}
document.querySelector('#print-button').addEventListener('click',()=>window.print());
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const hint=document.querySelector('#key-hint');requestAnimationFrame(()=>{hint.classList.add('show')});setTimeout(()=>hint.classList.remove('show'),4700);}

// Progressive section reveals: cover title, cards, copy and hero video enter as reader scrolls.
const prefersStill = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!prefersStill && 'IntersectionObserver' in window){
 document.documentElement.classList.add('motion-ready');
 const cinematicObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-entered');cinematicObserver.unobserve(entry.target);}}},{threshold:0.12,rootMargin:'0px 0px -30px 0px'});
 document.querySelectorAll('.scroll-enter').forEach(e=>cinematicObserver.observe(e));
 const chapterCoverObserver=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('cover-seen');chapterCoverObserver.unobserve(e.target);}}},{threshold:0.16,rootMargin:'0px 0px -65px 0px'});
 document.querySelectorAll('.chapter-cover').forEach(el=>chapterCoverObserver.observe(el));
 // The overview and chapter list builds in deliberate, readable succession.
 document.querySelectorAll('.overview-top > *, .overview > .eyebrow').forEach((el,i)=>{el.classList.add('scroll-enter');el.style.setProperty('--enter-delay',(i%3*100)+'ms');cinematicObserver.observe(el);});
 // Lighter parallax only for images that are near viewport; animation is scroll-position based.
 const driftEls=[...document.querySelectorAll('.topic .visual img, .overview-card-img img')];
 const nearby=new Set();
 const imageObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting) nearby.add(e.target);else nearby.delete(e.target);});},{rootMargin:'180px 0px 180px 0px'});
 driftEls.forEach(e=>imageObserver.observe(e));
 let driftScheduled=false;
 function drift(){driftScheduled=false;const height=window.innerHeight;nearby.forEach(el=>{const r=el.getBoundingClientRect();const position=(r.top+r.height/2-height/2)/(height+r.height);const px=Math.max(-11,Math.min(11,-position*20));el.style.setProperty('--image-drift',px.toFixed(1)+'px');});}
 window.addEventListener('scroll',()=>{if(!driftScheduled){driftScheduled=true;requestAnimationFrame(drift);}},{passive:true});
 window.addEventListener('resize',drift,{passive:true});drift();
}

// Chapter 5 headings include sentence endings that were split into standalone paragraphs.
['topic-5-1','topic-5-2','topic-5-3','topic-5-4'].forEach(id=>{
 const topic=document.getElementById(id);const heading=topic?.querySelector('h3');const fragment=topic?.querySelector('.topic-prose>p:first-child');
 if(!heading||!fragment)return;
 heading.append(` ${fragment.textContent.trim()}`);fragment.remove();
});

})();
