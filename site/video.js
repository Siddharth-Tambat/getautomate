// YouTube is contacted only after a visitor chooses to open the video.
(()=>{
  const dialog=document.getElementById('overviewDialog');
  if(!dialog)return;
  const mount=document.getElementById('overviewPlayer');
  const videos={
    overview:{id:'iyXuofIsjlo',title:'AutoMate in 30 seconds',layout:'portrait',url:'https://www.youtube.com/shorts/iyXuofIsjlo'},
    trips:{id:'UurknafBI-U',title:'How automatic trips work',layout:'landscape',url:'https://www.youtube.com/watch?v=UurknafBI-U'}
  };
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
