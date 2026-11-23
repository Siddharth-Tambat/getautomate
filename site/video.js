// YouTube is contacted only after a visitor chooses to open the video.
(()=>{
  const dialog=document.getElementById('overviewDialog');
  if(!dialog)return;
  const mount=document.getElementById('overviewPlayer');
  let opener;
  document.querySelectorAll('[data-open-video]').forEach(button=>button.addEventListener('click',()=>{
    opener=button;
    const frame=document.createElement('iframe');
    frame.title='AutoMate — 30-second app overview';
    frame.src='https://www.youtube-nocookie.com/embed/iyXuofIsjlo?playsinline=1';
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
