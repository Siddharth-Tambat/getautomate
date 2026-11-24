// YouTube is contacted only after a visitor chooses to open the video.
(()=>{
  // One catalogue supplies contextual cards across the site. Home's overview keeps its poster.
  const videos={
    overview:{id:'iyXuofIsjlo',title:'AutoMate in 30 seconds',cardTitle:'Meet AutoMate in 30 seconds',detail:'App overview · 30 seconds · Plays here',layout:'portrait',url:'https://www.youtube.com/shorts/iyXuofIsjlo',placements:['how-intro']},
    trips:{id:'UurknafBI-U',title:'How automatic trips work',cardTitle:'See how automatic trips work',detail:'Trips guide · 46 seconds · Plays here',layout:'landscape',url:'https://www.youtube.com/watch?v=UurknafBI-U',placements:['home-trips','how-trips','setup-trips']}
  };
  document.querySelectorAll('[data-video-placement]').forEach(slot=>{
    const cards=Object.entries(videos).filter(([,video])=>video.placements.includes(slot.dataset.videoPlacement)).map(([key,video])=>{
      const button=document.createElement('button');
      button.className='trips-guide-watch';
      button.dataset.openVideo=key;
      const play=document.createElement('span');
      play.className='trips-guide-play';play.setAttribute('aria-hidden','true');play.textContent='▶';
      const copy=document.createElement('span');
      const title=document.createElement('b');title.textContent=video.cardTitle;
      const detail=document.createElement('small');detail.textContent=video.detail;
      copy.append(title,detail);button.append(play,copy);
      return button;
    });
    if(cards.length)slot.replaceChildren(...cards);
  });
  let dialog=document.getElementById('overviewDialog');
  if(!dialog){
    dialog=document.createElement('dialog');
    dialog.id='overviewDialog';dialog.className='overview-dialog';dialog.setAttribute('aria-labelledby','overviewTitle');
    dialog.innerHTML='<div class="overview-toolbar"><strong id="overviewTitle">AutoMate video</strong><button class="video-close" aria-label="Close video">✕</button></div><div id="overviewPlayer"></div><a href="https://www.youtube.com/shorts/iyXuofIsjlo" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>';
    document.body.append(dialog);
  }
  const mount=document.getElementById('overviewPlayer');
  let opener;
  document.querySelectorAll('[data-open-video]').forEach(button=>button.addEventListener('click',()=>{
    opener=button;
    const video=videos[button.dataset.openVideo]||videos.overview;
    document.getElementById('overviewTitle').textContent=video.title;
    dialog.dataset.layout=video.layout;
    dialog.querySelector('a').href=video.url;
    const frame=document.createElement('iframe');
    frame.title=video.title;
    frame.src='https://www.youtube-nocookie.com/embed/'+video.id+'?playsinline=1';
    frame.allow='encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen=true;
    frame.referrerPolicy='strict-origin-when-cross-origin';
    mount.replaceChildren(frame);
    dialog.showModal();
  }));
  dialog.querySelector('.video-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{mount.replaceChildren();opener?.focus({preventScroll:true});});
})();
