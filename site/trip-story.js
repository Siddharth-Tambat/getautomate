/* Scroll updates draw only the current frame; no external dependencies. */
(()=>{
if(!document.getElementById('trip-story'))return;

const route=document.getElementById('routeDraw'),carNode=document.getElementById('car'),routeLength=route.getTotalLength();let fuelConfirmed=false,lastChapter=-1,pendingFrame=false;route.style.strokeDasharray=routeLength;
const stories=[['A drive, remembered','Just drive.<br><span>We’ll remember.</span>','The route. The toll. The fuel stop.<br>One drive, brought together.','YOUR NEXT DRIVE','Ready when you are.','0.0 km','Scroll to follow the drive. No buttons needed.'],['TRIP RECORDING','The road unfolds.<br><span>So does your story.</span>','As you drive, AutoMate records your route, distance and driving time.','TRIP IN PROGRESS','Every kilometre, kept.','Recording','A route takes shape as you travel.'],['FASTAG PAYMENT','Through the toll.<br><span>Into the trip.</span>','A supported bank or payment notification links the toll to your trip.','FASTAG · PAYMENT NOTIFICATION','Toll added to this drive.','₹85','A toll payment, linked to the trip running at that time.'],['FUEL STOP','A little pause.<br><span>A fuller tank.</span>','A payment alert helps fill the fuel form. You confirm the amount and litres.','FUEL · TO CONFIRM','Stopped for fuel.','₹2,000','20 litres at ₹100/litre. This purchase is an expense, not the fuel used by this trip.'],['TRIP SAVED','One drive.<br><span>The whole picture.</span>','Route, driving time and costs—together when you finish the trip.','TRIP SUMMARY','Home to Lakeside','42.0 km','48 minutes driving · 3.36 litres estimated fuel used. Scroll when you’re ready.']];
function geometry(){
  const track=document.getElementById('journey');
  const stage=document.querySelector('#trip-story .stage');
  const inset=parseFloat(getComputedStyle(stage).top)||0;
  return {start:track.getBoundingClientRect().top+scrollY-inset,travel:Math.max(1,track.offsetHeight-stage.offsetHeight)};
}
function progress(){const {start,travel}=geometry();return Math.max(0,Math.min(1,(scrollY-start)/travel));}
function jump(value){const {start,travel}=geometry();window.scrollTo({top:start+value*.78*travel,behavior:'instant'});paint();}
// Brief, honest map receipts: fuel is saved only after the confirmation action.
let previousProgress=0,noticeAt=0,noticeTimer,arrivalTimer;
const notice=document.getElementById('mapNotice');
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
  clearTimeout(noticeTimer);clearTimeout(arrivalTimer);noticeAt=at;
  document.getElementById('noticeIcon').innerHTML='<svg class="story-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#story-'+icon+'"></use></svg>';
  document.getElementById('noticeTitle').textContent=title;
  document.getElementById('noticeDetail').textContent=detail;
  notice.dataset.tone=tone;notice.classList.add('visible');placeDecorations();
  noticeTimer=setTimeout(()=>notice.classList.remove('visible'),3200);
}
function mapEvents(p){
  p=Math.round(p*1000)/1000;
  if(p<previousProgress-.01){notice.classList.remove('visible');clearTimeout(arrivalTimer);clearTimeout(noticeTimer);}
  else if(p>=1&&previousProgress<1){
    showNotice(1,'place','Destination reached','Home to Lakeside','saved');
    arrivalTimer=setTimeout(()=>showNotice(1,'receipt-long','Trip logged','42 km · 48 min · ₹421 estimated','saved'),1200);
  }else if(p>=.7&&previousProgress<.7){showNotice(.7,'local-gas-station','₹2,000 · Fuel payment',fuelConfirmed?'Expense added':'Confirm to add expense','fuel');}
  else if(p>=.45&&previousProgress<.45){showNotice(.45,'toll','−₹85 · FASTag toll','Added to this trip','toll');}
  previousProgress=p;placeDecorations();
  if(progress()>=1){notice.classList.remove('visible');clearTimeout(arrivalTimer);}
}
let fittedLayout='';
function fitSummary(chapter){
  const key=chapter+':'+innerWidth+':'+innerHeight;
  if(key===fittedLayout)return;
  fittedLayout=key;
  const root=document.getElementById('trip-story');
  root.classList.remove('summary-below');
  if(chapter!==4||innerWidth<=700)return;
  const stage=root.querySelector('.stage'),panel=root.querySelector('.story-panel'),bottom=root.querySelector('.bottom');
  const style=getComputedStyle(stage);
  const available=stage.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-bottom.offsetHeight-parseFloat(style.rowGap);
  root.classList.toggle('summary-below',panel.scrollHeight>available);
}
function paint(){pendingFrame=false;const raw=progress()/.78;const p=raw>=.9995?1:Math.min(1,raw);const pos=route.getPointAtLength(p*routeLength),ahead=route.getPointAtLength(Math.min(routeLength,p*routeLength+2)),behind=route.getPointAtLength(Math.max(0,p*routeLength-2));const angle=Math.atan2(ahead.y-behind.y,ahead.x-behind.x)*180/Math.PI+90;carNode.setAttribute('transform',`translate(${pos.x} ${pos.y}) rotate(${angle})`);route.style.strokeDashoffset=routeLength*(1-p);const chapter=p<.08?0:p<.36?1:p<.6?2:p<1?3:4;document.querySelector('#trip-story .stage').dataset.chapter=chapter;const ids=['chapter','headline','description','eventLabel','eventTitle','eventAmount','eventDescription'];if(chapter!==lastChapter){ids.forEach((id,i)=>document.getElementById(id).innerHTML=stories[chapter][i]);document.getElementById('announcement').textContent=stories[chapter][4];const eventIcons=['route','route','toll','local-gas-station','receipt-long'];document.querySelector('#eventIcon use').setAttribute('href','#story-'+eventIcons[chapter]);lastChapter=chapter}document.getElementById('distance').textContent=(p*42).toFixed(1);document.getElementById('duration').textContent=Math.round(p*48);document.getElementById('cost').textContent='₹'+(Math.round(p*336)+(p>=.36?85:0));document.getElementById('eventAmount').style.color=chapter===2?'var(--violet-text)':chapter===3?'var(--amber)':'var(--blue-text)';document.getElementById('confirm').style.display=chapter===3&&!fuelConfirmed?'block':'none';document.getElementById('summary').style.display=chapter===4?'grid':'none';if(chapter===3&&fuelConfirmed){document.getElementById('eventTitle').textContent='Fuel entry confirmed.';document.getElementById('eventDescription').textContent='₹2,000 fuel purchase saved to Expenses. Scroll to finish the trip.'}document.querySelectorAll('.steps button').forEach((b,i)=>b.classList.toggle('active',i===chapter));fitSummary(chapter);mapEvents(p);}
document.querySelectorAll('#trip-story [data-progress]').forEach(button=>button.addEventListener('click',()=>jump(Number(button.dataset.progress))));
document.getElementById('confirm').onclick=()=>{fuelConfirmed=true;showNotice(.7,'local-gas-station','Fuel expense added','₹2,000 saved to Expenses','fuel');paint()};addEventListener('scroll',()=>{if(!pendingFrame){pendingFrame=true;requestAnimationFrame(paint)}});addEventListener('resize',paint);document.getElementById('trip-story').classList.add('is-ready');paint();

})();
