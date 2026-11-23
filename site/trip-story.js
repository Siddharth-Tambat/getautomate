(()=>{if(!document.getElementById("trip-story"))return;let arrivalTimer;const routeLength=document.getElementById("routeDraw").getTotalLength();const track=document.querySelector('.drive-track'),stage=document.querySelector('#trip-story .drive-stage'),route=document.getElementById('routeDraw'),car=document.getElementById('car');const length=route.getTotalLength();route.style.strokeDasharray=length;let pending=false;
let mapPreviousProgress=0,mapNoticeTimer;const notice=document.getElementById('mapNotice');
const noticePositions=new Map();
function placeDecorations(){
  const stage=document.querySelector('#trip-story .stage').getBoundingClientRect();
  const map=document.querySelector('#trip-story .map').getBoundingClientRect();
  const brand=document.getElementById('mapBrand');
  brand.style.left=(map.right-stage.left-116)+'px';
  brand.style.top=(map.bottom-stage.top-40)+'px';
  if(!notice.classList.contains('visible'))return;
  const positionKey=notice.dataset.tone+':'+Math.round(map.width)+':'+Math.round(map.height)+':'+Math.round(map.left-stage.left)+':'+Math.round(map.top-stage.top);
  const cached=noticePositions.get(positionKey);
  if(cached){notice.style.left=cached.x+'px';notice.style.top=cached.y+'px';notice.style.visibility=cached.visible?'visible':'hidden';notice.dataset.side=cached.side;return;}
  // Anchor to the actual landmark, not the moving vehicle or an approximate route fraction.
  const tone=notice.dataset.tone;
  const target=document.getElementById(tone==='toll'?'tollMarker':tone==='fuel'?'fuelMarker':'destinationMarker').getBoundingClientRect();
  const width=notice.offsetWidth,height=notice.offsetHeight;
  const cx=(target.left+target.right)/2,cy=(target.top+target.bottom)/2;
  const obstacles=['tollMarker','fuelMarker','destinationMarker','mapBrand'].map(id=>document.getElementById(id).getBoundingClientRect());
  const matrix=route.getScreenCTM();
  const points=Array.from({length:241},(_,i)=>{const p=route.getPointAtLength(i*routeLength/240);return new DOMPoint(p.x,p.y).matrixTransform(matrix);});
  const sides=tone==='toll'?['right','top','bottom','left']:tone==='fuel'?['left','top','bottom','right']:['top','left','right','bottom'];
  let chosen;
  for(const side of sides){
    for(const gap of [24,40,64,96]){
      for(const shift of [0,-32,32,-64,64,-96,96]){
        let x,y;
        if(side==='right'){x=target.right+gap;y=cy-height/2+shift;}
        if(side==='left'){x=target.left-gap-width;y=cy-height/2+shift;}
        if(side==='top'){x=cx-width/2+shift;y=target.top-gap-height;}
        if(side==='bottom'){x=cx-width/2+shift;y=target.bottom+gap;}
        if(x<map.left+8||x+width>map.right-8||y<map.top+8||y+height>map.bottom-8)continue;
        const box={left:x-30,right:x+width+30,top:y-30,bottom:y+height+30};
        if(obstacles.some(r=>box.left<r.right&&box.right>r.left&&box.top<r.bottom&&box.bottom>r.top))continue;
        if(points.some(p=>p.x>=box.left&&p.x<=box.right&&p.y>=box.top&&p.y<=box.bottom))continue;
        chosen={x,y,side};break;
      }
      if(chosen)break;
    }
    if(chosen)break;
  }
  // Fail closed on very constrained windows rather than obscure any part of the drive.
  notice.style.visibility=chosen?'visible':'hidden';
  notice.dataset.side=chosen?.side||'';
  if(chosen){notice.style.left=(chosen.x-stage.left)+'px';notice.style.top=(chosen.y-stage.top)+'px';}
  noticePositions.set(positionKey,{x:chosen?chosen.x-stage.left:0,y:chosen?chosen.y-stage.top:0,visible:!!chosen,side:chosen?.side||''});

}
function showNotice(at,icon,title,detail,tone){
  clearTimeout(mapNoticeTimer);clearTimeout(arrivalTimer);
  document.getElementById('noticeIcon').innerHTML='<svg class="story-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#story-'+icon+'"></use></svg>';
  document.getElementById('noticeTitle').textContent=title;
  document.getElementById('noticeDetail').textContent=detail;
  notice.dataset.tone=tone;notice.classList.add('visible');placeDecorations();
  mapNoticeTimer=setTimeout(()=>notice.classList.remove('visible'),3200);
}
function mapEvents(p){
  p=Math.round(p*1000)/1000;
  if(p<mapPreviousProgress-.01){notice.classList.remove('visible');clearTimeout(arrivalTimer);clearTimeout(mapNoticeTimer);}
  else if(p>=1&&mapPreviousProgress<1){
    showNotice(1,'place','Destination reached','Home to Lakeside','saved');
    arrivalTimer=setTimeout(()=>showNotice(1,'receipt-long','Trip logged','42 km · 48 min · ₹421 estimated','saved'),1200);
  }else if(p>=.7&&mapPreviousProgress<.7){showNotice(.7,'local-gas-station','₹2,000 · Fuel detected','AutoMate found a fuel payment · To review','fuel');}
  else if(p>=.45&&mapPreviousProgress<.45){showNotice(.45,'toll','−₹85 · Toll detected','AutoMate linked this toll to your trip','toll');}
  mapPreviousProgress=p;placeDecorations();
}
function text(id,value){document.getElementById(id).textContent=value}
function update(){pending=false;if(matchMedia('(max-width:700px)').matches)return;const rect=track.getBoundingClientRect();const range=track.offsetHeight-stage.offsetHeight;const raw=Math.max(0,Math.min(1,(parseFloat(getComputedStyle(stage).top)-rect.top)/Math.max(1,range)));const p=Math.min(1,raw/.8);const done=p>=.999;const paid=p>=.44;const refuel=p>=.7;document.getElementById('fuelReview').classList.toggle('received',refuel);document.getElementById('historyFuel').classList.toggle('logged',refuel);const km=(p*42).toFixed(1),mins=Math.round(p*48),fuel=Math.round(p*336),cost=fuel+(paid?85:0);text('demo-km',km);text('demo-time',mins);text('demo-cost','₹'+cost);text('demo-fuel','₹'+fuel);text('demo-toll',paid?'₹85':'₹0');text('sideKm',km+' km');text('sideTime',mins+' min');text('sideCost','₹'+cost);mapEvents(p);text('appstatus',done?'Trip saved':'Recording trip');text('sideTitle',done?'Your drive, all together.':refuel?'A fuel stop, remembered.':paid?'A toll, taken care of.':'Your trip is recording.');text('phase',done?'04 / 04 · Trip saved':refuel?'03 / 04 · Fuel payment':paid?'02 / 04 · FASTag toll':'01 / 04 · Recording');document.getElementById('log').firstElementChild.textContent=done?'Trip saved · 42 km':refuel?'Fuel entry ready to review':paid?'FASTag payment added':'Recording your drive';document.getElementById('historyToll').classList.toggle('logged',paid);document.getElementById('historySaved').classList.toggle('logged',done);document.getElementById('progressFill').style.width=(p*100)+'%';route.style.strokeDashoffset=length*(1-p);const point=route.getPointAtLength(length*p),next=route.getPointAtLength(Math.min(length,length*p+1)),prev=route.getPointAtLength(Math.max(0,length*p-1));const angle=Math.atan2(next.y-prev.y,next.x-prev.x)*180/Math.PI+90;car.setAttribute('transform',`translate(${point.x} ${point.y}) rotate(${angle})`)}
document.getElementById('trip-story').classList.add('is-ready');window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update)}},{passive:true});window.addEventListener('resize',update);update();
})();
