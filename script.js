const slides=[...document.querySelectorAll('.hero-slide')];
const current=document.querySelector('.hero-current');
const hero=document.querySelector('.hero');
const heroProgress=document.querySelector('.hero-control span');
const heroPause=document.querySelector('.hero-pause');
let index=0,timer,isHeroPaused=false,heroStartedAt=0,heroRemaining=6000;
function scheduleHero(delay=6000){clearTimeout(timer);heroRemaining=delay;heroStartedAt=Date.now();if(!isHeroPaused)timer=setTimeout(()=>show(index+1),delay)}
function show(next){index=(next+slides.length)%slides.length;slides.forEach((slide,i)=>slide.classList.toggle('active',i===index));current.textContent=String(index+1).padStart(2,'0');if(heroProgress){heroProgress.classList.remove('is-running');void heroProgress.offsetWidth;heroProgress.classList.add('is-running')}scheduleHero(6000)}
document.querySelector('.hero-prev').addEventListener('click',()=>show(index-1));
document.querySelector('.hero-next').addEventListener('click',()=>show(index+1));
heroPause?.addEventListener('click',()=>{
  isHeroPaused=!isHeroPaused;
  heroPause.setAttribute('aria-pressed',String(isHeroPaused));
  heroPause.setAttribute('aria-label',isHeroPaused?'슬라이드 재생':'슬라이드 일시정지');
  heroPause.textContent=isHeroPaused?'▶':'Ⅱ';
  hero.classList.toggle('is-paused',isHeroPaused);
  if(isHeroPaused){heroRemaining=Math.max(0,heroRemaining-(Date.now()-heroStartedAt));clearTimeout(timer)}
  else scheduleHero(heroRemaining||6000);
});
show(0);

let dragStartX=0;
let dragX=0;
let dragging=false;

hero.addEventListener('pointerdown',(event)=>{
  if(event.target.closest('button,a'))return;
  dragging=true;
  dragStartX=event.clientX;
  dragX=event.clientX;
  clearTimeout(timer);
  hero.classList.add('is-dragging');
  hero.setPointerCapture(event.pointerId);
});

hero.addEventListener('pointermove',(event)=>{
  if(!dragging)return;
  dragX=event.clientX;
  const distance=Math.max(-90,Math.min(90,dragX-dragStartX));
  slides[index].style.transform=`translateX(${distance*.16}px)`;
});

function endHeroDrag(event){
  if(!dragging)return;
  dragging=false;
  hero.classList.remove('is-dragging');
  slides[index].style.transform='';
  const distance=dragX-dragStartX;
  if(Math.abs(distance)>=55)show(index+(distance<0?1:-1));
  else show(index);
  if(hero.hasPointerCapture?.(event.pointerId))hero.releasePointerCapture(event.pointerId);
}

hero.addEventListener('pointerup',endHeroDrag);
hero.addEventListener('pointercancel',endHeroDrag);
hero.addEventListener('dragstart',(event)=>event.preventDefault());

const historyMore=document.querySelector('.doctorview_sect .history .more button');
if(historyMore){historyMore.addEventListener('click',()=>historyMore.closest('.history').classList.add('active'))}

const publicationToggle=document.querySelector('.publication-toggle');
if(publicationToggle){publicationToggle.addEventListener('click',()=>{const section=publicationToggle.closest('.publications-sec');const isOpen=section.classList.toggle('is-open');publicationToggle.setAttribute('aria-expanded',String(isOpen));publicationToggle.childNodes[0].nodeValue=isOpen?'논문 접기 ':'논문 전체보기 '})}

const doctorSlider=document.querySelector('.doctor-photo-slider');
if(doctorSlider){
  const doctorSlides=[...doctorSlider.querySelectorAll('.doctor-photo-slide')];
  const doctorCount=document.querySelector('.photo-count b');
  const doctorProgress=document.querySelector('.doctor-photo-progress');
  let doctorIndex=0;
  let doctorStartX=0;
  let doctorMoveX=0;
  let doctorDragging=false;

  const showDoctorPhoto=(next)=>{
    doctorIndex=(next+doctorSlides.length)%doctorSlides.length;
    doctorSlides.forEach((slide,i)=>{
      slide.classList.toggle('active',i===doctorIndex);
      slide.style.transform='';
    });
    doctorCount.textContent=String(doctorIndex+1).padStart(2,'0');
    doctorProgress.style.transform=`translateX(${doctorIndex*100}%)`;
  };

  doctorSlider.addEventListener('pointerdown',(event)=>{
    doctorDragging=true;
    doctorStartX=event.clientX;
    doctorMoveX=event.clientX;
    doctorSlider.classList.add('is-dragging');
    doctorSlider.setPointerCapture(event.pointerId);
  });

  doctorSlider.addEventListener('pointermove',(event)=>{
    if(!doctorDragging)return;
    doctorMoveX=event.clientX;
    const distance=Math.max(-100,Math.min(100,doctorMoveX-doctorStartX));
    doctorSlides[doctorIndex].style.transform=`translateX(${distance*.22}px)`;
  });

  const endDoctorDrag=(event)=>{
    if(!doctorDragging)return;
    doctorDragging=false;
    doctorSlider.classList.remove('is-dragging');
    const distance=doctorMoveX-doctorStartX;
    doctorSlides[doctorIndex].style.transform='';
    if(Math.abs(distance)>=45)showDoctorPhoto(doctorIndex+(distance<0?1:-1));
    if(doctorSlider.hasPointerCapture?.(event.pointerId))doctorSlider.releasePointerCapture(event.pointerId);
  };

  doctorSlider.addEventListener('pointerup',endDoctorDrag);
  doctorSlider.addEventListener('pointercancel',endDoctorDrag);
  doctorSlider.addEventListener('dragstart',(event)=>event.preventDefault());
  showDoctorPhoto(0);
}

const galleryMain=document.querySelector('.gallery-main img');
const section4Stage=document.querySelector('.section4-stage');
const section4Switch=document.querySelector('.section4-switch');
if(section4Stage&&section4Switch){
  let section4Transitioning=false;
  const reduceSection4Motion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setSection4Mode=()=>{
    const jelly=section4Stage.dataset.mode==='jelly';
    section4Stage.dataset.mode=jelly?'blood':'jelly';
    section4Switch.querySelector('strong').textContent=jelly?"와튼젤리 (Wharton's Jelly)":'자가 혈액 세포 치료';
  };
  const toggleSection4=async(direction=1)=>{
    if(section4Transitioning)return;
    if(reduceSection4Motion){setSection4Mode();return;}
    section4Transitioning=true;
    section4Stage.classList.remove('is-settling');
    section4Stage.classList.add('is-switching');
    const frontImage=section4Stage.querySelector('.section4-image');
    const frontDetails=[...section4Stage.querySelectorAll('.section4-copy,.section4-panel')].filter(element=>getComputedStyle(element).display!=='none');
    const distance=direction*150;
    const timing={duration:680,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'};
    const frontAnimation=frontImage.animate([
      {transform:'translate3d(0,0,0) scale(1)',opacity:1},
      {transform:`translate3d(${-distance}px,28px,0) scale(.965)`,opacity:.08}
    ],timing);
    const detailAnimations=frontDetails.map(element=>element.animate([
      {transform:'translateX(0)',opacity:1},
      {transform:`translateX(${-distance*.72}px)`,opacity:0}
    ],{...timing,duration:500}));
    const rearAnimation=section4Switch.animate([
      {transform:`translate3d(${distance*.16}px,0,0) scale(.965)`,filter:'blur(1.5px)',opacity:.82},
      {transform:'translate3d(0,-41.5px,0) scale(1)',filter:'blur(0)',opacity:1}
    ],timing);
    await Promise.all([frontAnimation,rearAnimation,...detailAnimations].map(animation=>animation.finished));
    setSection4Mode();
    [frontAnimation,rearAnimation,...detailAnimations].forEach(animation=>animation.cancel());
    const incomingDetails=[...section4Stage.querySelectorAll('.section4-copy,.section4-panel')].filter(element=>getComputedStyle(element).display!=='none');
    const revealAnimations=incomingDetails.map(element=>element.animate([
      {opacity:0,transform:`translateX(${direction*24}px)`},
      {opacity:1,transform:'translateX(0)'}
    ],{duration:260,easing:'ease-out'}));
    await Promise.all(revealAnimations.map(animation=>animation.finished));
    section4Stage.classList.remove('is-switching');
    section4Transitioning=false;
  };
  section4Switch.addEventListener('click',()=>toggleSection4(1));
  section4Stage.querySelectorAll('.section4-nav').forEach(button=>button.addEventListener('click',()=>toggleSection4(button.classList.contains('section4-prev')?-1:1)));
  let dragStartX=0;
  let dragX=0;
  let dragging=false;
  let didDrag=false;
  const finishSection4Drag=event=>{
    if(!dragging)return;
    dragging=false;
    section4Stage.classList.remove('is-dragging');
    section4Stage.classList.add('is-settling');
    section4Stage.style.setProperty('--section4-drag-x','0px');
    if(Math.abs(dragX)>=70)toggleSection4(dragX<0?1:-1);
    window.setTimeout(()=>section4Stage.classList.remove('is-settling'),360);
    if(section4Stage.hasPointerCapture?.(event.pointerId))section4Stage.releasePointerCapture(event.pointerId);
  };
  section4Stage.addEventListener('pointerdown',event=>{
    if(event.target.closest('.section4-nav'))return;
    dragStartX=event.clientX;
    dragX=0;
    dragging=true;
    didDrag=false;
    section4Stage.classList.remove('is-settling');
    section4Stage.classList.add('is-dragging');
    section4Stage.setPointerCapture?.(event.pointerId);
  });
  section4Stage.addEventListener('pointermove',event=>{
    if(!dragging)return;
    dragX=event.clientX-dragStartX;
    if(Math.abs(dragX)>8)didDrag=true;
    const resisted=Math.max(-150,Math.min(150,dragX*.55));
    section4Stage.style.setProperty('--section4-drag-x',`${resisted}px`);
  });
  section4Stage.addEventListener('pointerup',finishSection4Drag);
  section4Stage.addEventListener('pointercancel',finishSection4Drag);
  section4Stage.addEventListener('click',event=>{
    if(!didDrag)return;
    event.preventDefault();
    event.stopPropagation();
    didDrag=false;
  },true);
}
const sectionAnchors={brain:'.design-brain',autonomic:'.design-autonomic',antiaging:'.design-antiaging'};
Object.entries(sectionAnchors).forEach(([id,selector])=>{const section=document.querySelector(selector);if(section&&!section.id)section.id=id});

const mechanismSection=document.querySelector('.s3-mechanism');
if(mechanismSection){
  const mechanismDots=[...mechanismSection.querySelectorAll('.s3-rail i')];
  const mechanismSteps=[...mechanismSection.querySelectorAll('.s3-step-list li')];
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mechanismIndex=0;
  let mechanismTimer=null;
  const activateMechanismStep=index=>{
    mechanismIndex=index;
    mechanismDots.forEach((dot,i)=>dot.classList.toggle('is-active',i===index));
    mechanismSteps.forEach((step,i)=>step.classList.toggle('is-active',i===index));
  };
  const startMechanismMotion=()=>{
    activateMechanismStep(mechanismIndex);
    if(reduceMotion||mechanismTimer)return;
    mechanismTimer=window.setInterval(()=>activateMechanismStep((mechanismIndex+1)%mechanismSteps.length),1100);
  };
  const stopMechanismMotion=()=>{
    if(mechanismTimer){window.clearInterval(mechanismTimer);mechanismTimer=null;}
  };
  activateMechanismStep(0);
  const mechanismObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.isIntersecting?startMechanismMotion():stopMechanismMotion());
  },{threshold:.3});
  mechanismObserver.observe(mechanismSection);
}

const spineJointSection=document.querySelector('.s5-spine');
if(spineJointSection){
  const spineCard=spineJointSection.querySelector('.s5-card-spine');
  const jointCard=spineJointSection.querySelector('.s5-card-joint');
  const setSpineJointMode=mode=>{spineJointSection.dataset.active=mode;};
  spineCard?.addEventListener('mouseenter',()=>setSpineJointMode('spine'));
  jointCard?.addEventListener('mouseenter',()=>setSpineJointMode('joint'));
  spineCard?.addEventListener('focusin',()=>setSpineJointMode('spine'));
  jointCard?.addEventListener('focusin',()=>setSpineJointMode('joint'));
  spineCard?.addEventListener('click',()=>setSpineJointMode('spine'));
  jointCard?.addEventListener('click',()=>setSpineJointMode('joint'));
}

const autonomicMotionSection=document.querySelector('.s7-autonomic');
if(autonomicMotionSection){
  autonomicMotionSection.classList.add('motion-ready');
  const autonomicObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      autonomicMotionSection.classList.add('is-visible');
      autonomicObserver.unobserve(autonomicMotionSection);
    });
  },{threshold:.24});
  autonomicObserver.observe(autonomicMotionSection);
}
const wellnessTabs=[...document.querySelectorAll('.s9-treatment-tabs button')];
const wellnessVisual=document.querySelector('.s9-treatment-visual');
const wellnessNextVisual=document.querySelector('.s9-next-visual');
if(wellnessTabs.length&&wellnessVisual&&wellnessNextVisual){
  let current=0;
  let animating=false;
  let dragStartY=0;
  let dragOffset=0;
  let dragging=false;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setVisual=(visual,button,hidden=false)=>{
    const label=button.textContent.trim();
    const image=visual.querySelector('img');
    image.src=button.dataset.image;
    image.alt=hidden?'':label;
    visual.querySelector('figcaption').textContent=label;
  };
  const prepareFollowing=index=>setVisual(wellnessNextVisual,wellnessTabs[(index+1)%wellnessTabs.length],true);
  const activateWellnessTab=index=>wellnessTabs.forEach((tab,i)=>{const selected=i===index;tab.classList.toggle('active',selected);tab.setAttribute('aria-selected',String(selected));});
  const rollWellnessTo=(index,direction=index>current?1:-1,startOffset=0)=>{
    const button=wellnessTabs[index];
    if(index===current||animating)return;
    activateWellnessTab(index);
    setVisual(wellnessNextVisual,button,true);
    if(reduceMotion||getComputedStyle(wellnessNextVisual).display==='none'){
      setVisual(wellnessVisual,button);
      current=index;
      prepareFollowing(current);
      return;
    }
    animating=true;
    const distance=wellnessNextVisual.offsetTop-wellnessVisual.offsetTop;
    const endOffset=direction>0?-distance:distance;
    const incomingStart=direction>0?startOffset:-2*distance+startOffset;
    const incomingEnd=-distance;
    const timing={duration:720,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'};
    const outgoingAnimation=wellnessVisual.animate([{transform:`translateY(${startOffset}px)`},{transform:`translateY(${endOffset}px)`}],timing);
    const incomingAnimation=wellnessNextVisual.animate([{transform:`translateY(${incomingStart}px)`},{transform:`translateY(${incomingEnd}px)`}],timing);
    incomingAnimation.onfinish=()=>{
      setVisual(wellnessVisual,button);
      current=index;
      wellnessVisual.style.transform='';
      wellnessNextVisual.style.transform='';
      outgoingAnimation.cancel();
      incomingAnimation.cancel();
      prepareFollowing(current);
      animating=false;
    };
  };
  wellnessTabs.forEach((button,index)=>button.addEventListener('click',()=>rollWellnessTo(index,index>current?1:-1)));
  wellnessVisual.addEventListener('pointerdown',event=>{
    if(animating)return;
    dragStartY=event.clientY;
    dragOffset=0;
    dragging=true;
    wellnessVisual.classList.add('is-dragging');
    wellnessVisual.setPointerCapture?.(event.pointerId);
  });
  wellnessVisual.addEventListener('pointermove',event=>{
    if(!dragging)return;
    dragOffset=Math.max(-190,Math.min(190,event.clientY-dragStartY));
    const direction=dragOffset<=0?1:-1;
    const target=(current+direction+wellnessTabs.length)%wellnessTabs.length;
    const distance=wellnessNextVisual.offsetTop-wellnessVisual.offsetTop;
    setVisual(wellnessNextVisual,wellnessTabs[target],true);
    wellnessVisual.style.transform=`translateY(${dragOffset}px)`;
    wellnessNextVisual.style.transform=direction>0?`translateY(${dragOffset}px)`:`translateY(${-2*distance+dragOffset}px)`;
  });
  const finishWellnessDrag=event=>{
    if(!dragging)return;
    dragging=false;
    wellnessVisual.classList.remove('is-dragging');
    const offset=dragOffset;
    const direction=offset<=0?1:-1;
    const target=(current+direction+wellnessTabs.length)%wellnessTabs.length;
    if(Math.abs(offset)>=65){
      rollWellnessTo(target,direction,offset);
    }else{
      const distance=wellnessNextVisual.offsetTop-wellnessVisual.offsetTop;
      wellnessVisual.animate([{transform:`translateY(${offset}px)`},{transform:'translateY(0)'}],{duration:240,easing:'ease-out'}).onfinish=()=>wellnessVisual.style.transform='';
      wellnessNextVisual.animate([{transform:direction>0?`translateY(${offset}px)`:`translateY(${-2*distance+offset}px)`},{transform:direction>0?'translateY(0)':`translateY(${-2*distance}px)`}],{duration:240,easing:'ease-out'}).onfinish=()=>{wellnessNextVisual.style.transform='';prepareFollowing(current);};
    }
    if(wellnessVisual.hasPointerCapture?.(event.pointerId))wellnessVisual.releasePointerCapture(event.pointerId);
  };
  wellnessVisual.addEventListener('pointerup',finishWellnessDrag);
  wellnessVisual.addEventListener('pointercancel',finishWellnessDrag);
  wellnessVisual.addEventListener('dragstart',event=>event.preventDefault());
}

const galleryButtons=[...document.querySelectorAll('.gallery-thumbs button')];
galleryButtons.forEach((button)=>button.addEventListener('click',()=>{
  if(!galleryMain)return;
  galleryButtons.forEach((item)=>item.classList.remove('active'));
  button.classList.add('active');
  galleryMain.style.opacity='0';
  window.setTimeout(()=>{
    galleryMain.src=button.dataset.image;
    galleryMain.alt=button.querySelector('img')?.alt||'장상근바이오 진료 환경';
    galleryMain.style.opacity='1';
  },180);
}));

document.querySelectorAll('.design-faq details').forEach((details)=>{
  const summary=details.querySelector('summary');
  const answer=details.querySelector('p');
  if(!summary||!answer)return;
  let sizeAnimation=null;
  let answerAnimation=null;
  summary.addEventListener('click',(event)=>{
    event.preventDefault();
    sizeAnimation?.cancel();
    answerAnimation?.cancel();
    const isClosing=details.open;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){details.open=!isClosing;return;}
    const startHeight=`${details.offsetHeight}px`;
    if(!isClosing)details.open=true;
    const endHeight=isClosing?`${summary.offsetHeight}px`:`${summary.offsetHeight+answer.offsetHeight}px`;
    details.style.height=startHeight;
    details.classList.add('is-animating');
    sizeAnimation=details.animate({height:[startHeight,endHeight]},{duration:420,easing:'cubic-bezier(.22,.61,.36,1)'});
    answerAnimation=answer.animate(isClosing?{opacity:[1,0],transform:['translateY(0)','translateY(-8px)']}:{opacity:[0,1],transform:['translateY(-8px)','translateY(0)']},{duration:isClosing?240:360,easing:'ease',fill:'both'});
    sizeAnimation.onfinish=()=>{
      if(isClosing)details.open=false;
      details.style.height='';
      details.classList.remove('is-animating');
      answerAnimation?.cancel();
      sizeAnimation=null;
      answerAnimation=null;
    };
    sizeAnimation.oncancel=()=>{details.style.height='';details.classList.remove('is-animating');};
  });
});
