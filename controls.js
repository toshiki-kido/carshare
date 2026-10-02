(() => {
 const controls=[],today=japanClock().date,dayMinute=1440,base=Date.parse(today+'T00:00:00Z')/86400000;
 const numeric={hours:{max:24,step:.5,unit:'時間'},minutes:{max:59,step:1,unit:'分'},distance:{max:500,step:.1,unit:'km'},mapStay:{max:24,step:.5,unit:'時間'},mapBuffer:{max:180,step:5,unit:'分'}};
 for(const input of document.querySelectorAll('input[type=number],input[type=time],input[type=date]')){
  if(!input.id)continue;const type=input.type,spec=numeric[input.id];if(type==='number'&&!spec)continue;
  const wrap=document.createElement('div');wrap.className='slide-control';const range=document.createElement('input');range.type='range';range.id=input.id+'Slider';const label=document.querySelector('label[for="'+input.id+'"]');range.setAttribute('aria-label',(label?label.textContent:'時刻')+'をスライドで調整');const caption=document.createElement('div');caption.className='slide-caption';const left=document.createElement('span'),right=document.createElement('output');right.htmlFor=range.id;caption.append(left,right);wrap.append(range,caption);const anchor=input.parentElement.classList.contains('unit')?input.parentElement:input;anchor.insertAdjacentElement('afterend',wrap);
  function sync(){const v=input.value;if(type==='number'){const n=Number(v),hard=input.max?Number(input.max):Math.max(1000,n);range.min=input.min||0;range.max=Math.min(hard,Math.max(spec.max,Math.ceil((Number.isFinite(n)?n:0)/spec.max)*spec.max));range.step=spec.step;range.value=Number.isFinite(n)?n:0;right.textContent=v===''?'未入力':v+' '+spec.unit;left.textContent='スライドで増減';}
   else if(type==='time'){range.min=0;range.max=1439;range.step=1;range.value=/^\d{2}:\d{2}$/.test(v)?clockMinute(v):0;right.textContent=v||'未入力';left.textContent='0:00〜23:59';}
   else{const day=Date.parse(v+'T00:00:00Z')/86400000-base;range.min=Math.min(0,Number.isFinite(day)?day:0);range.max=Math.max(30,Number.isFinite(day)?day:30);range.step=1;range.value=Number.isFinite(day)?day:0;right.textContent=v||'未入力';left.textContent='日付をスライドで調整';}}
  range.addEventListener('input',()=>{const n=Number(range.value);input.value=type==='number'?String(n):type==='time'?hhmm(n):new Date((base+n)*86400000).toISOString().slice(0,10);input.dispatchEvent(new Event('input',{bubbles:true}));sync();});input.addEventListener('input',sync);input.addEventListener('change',sync);controls.push(sync);sync();
 }
 window.syncConditionControls=()=>{for(const sync of controls)sync();};
 window.syncConditionControls();
})();


