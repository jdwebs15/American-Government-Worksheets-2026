// ================================================================
// PASTE THIS WORKSHEET'S GOOGLE APPS SCRIPT /exec WEB ADDRESS BELOW
// ================================================================
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbxENUBm5pd966tRn1g9R7HH0zSXcEI10LGLivzQzN0pn6b0ytZHJdV8HU9i0ihYtHJW/exec";
const questions=window.BLOCK_QUESTIONS;
const ORDER_KEY="gov-cs20-21-intro-order-v2";
function shuffleQuestionBank(){
  const key=ORDER_KEY+"|"+($('email')?.value.trim().toLowerCase()||'');
  let ids;try{ids=JSON.parse(localStorage.getItem(key)||'null')}catch{}
  if(!Array.isArray(ids)||ids.length!==questions.length||new Set(ids).size!==questions.length||ids.some(id=>!questions.some(q=>q.id===id))){
    ids=questions.map(q=>q.id);
    for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]]}
    localStorage.setItem(key,JSON.stringify(ids));
  }
  const byId=new Map(questions.map(q=>[q.id,q]));questions.splice(0,questions.length,...ids.map(id=>byId.get(id)));
}
const C=window.BLOCK_CONFIG;
const $=id=>document.getElementById(id);
const state={firstAttempt:{},answers:{},mastered:{},attempts:{},wrongTotal:0,correctChecks:0,currentIndex:0,firstStart:new Date().toISOString(),sessions:1,activeSeconds:0,awaySeconds:0,tabLeaves:0,events:[],questionSeconds:{},lastTick:Date.now(),status:"in progress"};
let saveTimer=null,advanceTimer=null,started=false;

function init(){
  $("pageTitle").textContent=C.title;$("pageDescription").textContent=C.description;$("practiceText").textContent=C.practice;
  $("startBtn").onclick=start;$("loadBtn").onclick=loadCloud;$("saveBtn").onclick=()=>cloudSave(true);$("resetBtn").onclick=resetAssignment;$("submitBtn").onclick=submit;$("completionResetBtn").onclick=resetAssignment;
  ["studentName","email"].forEach(id=>$(id).addEventListener("change",restoreLocal));$("period").addEventListener("change",saveLocal);
  document.addEventListener("visibilitychange",()=>{tick();if(document.hidden)state.tabLeaves++;state.events.push({type:document.hidden?"leave":"return",at:new Date().toISOString()})});
  document.addEventListener("copy",()=>state.events.push({type:"copy",question:currentQuestion()?.id||"",at:new Date().toISOString()}));
  document.addEventListener("paste",()=>state.events.push({type:"paste",question:currentQuestion()?.id||"",at:new Date().toISOString()}));
  setInterval(()=>{tick();updateStats();if(started)saveLocal()},1000);
}
function student(){return{name:$("studentName").value.trim(),period:$("period").value,email:$("email").value.trim().toLowerCase()}}
function valid(show=true){const s=student(),ok=s.name&&s.period&&/^\S+@\S+\.\S+$/.test(s.email);if(!ok&&show)$("saveStatus").textContent="Enter full name, period, and a valid school email first.";return ok}
function storageKey(){return `${C.assignmentKey}|${student().email}`}
function resetAssignment(){
  if(!student().email){$("saveStatus").textContent="Enter the same school email used for this assignment, then select Reset Assignment.";return}
  if(!confirm("Restart this assignment at Question 1 on this device? Earlier teacher records will remain in the spreadsheet."))return;
  localStorage.removeItem(storageKey());localStorage.removeItem(ORDER_KEY+"|"+student().email);
  location.reload();
}
function start(){if(!valid(true))return;shuffleQuestionBank();restoreLocal();started=true;state.lastTick=Date.now();state.sessions=Math.max(1,state.sessions||1);$("studentPanel").classList.add("hidden");$("workspace").classList.remove("hidden");goToFirstUnmastered();renderQuestion();updateStats();queueCloudSave()}
function currentQuestion(){return questions[state.currentIndex]}
function goToFirstUnmastered(){const i=questions.findIndex(q=>!state.mastered[q.id]);state.currentIndex=i<0?questions.length:i}
function renderQuestion(){
 if(state.currentIndex>=questions.length){showCompletion();return}
 const q=currentQuestion(),letters=['A','B','C','D'];
 if(q.type==='slider'){
   const labels={spending:['Decrease spending','Increase spending'],taxes:['Lower taxes','Raise taxes'],securities:['Sell securities','Buy securities'],reserves:['Lower reserve requirement','Raise reserve requirement'],discount:['Lower discount rate','Raise discount rate']};
   const [lowerLabel,upperLabel]=labels[q.tool];
   const choices=q.sliderChoices||['Expansionary','Contractionary'];
   $('questionCard').innerHTML=`<h2>${escapeHtml(q.topic)}</h2><p class="prompt">${escapeHtml(q.prompt)}</p><div class="slider-panel"><p class="slider-instructions">Explore the tool, then set it to the action you believe fits the scenario. Moving the slider unlocks the choices, but does NOT tell you whether it is correct. Your answer is checked only when you click Apply.</p><div class="vertical-slider-layout"><div class="vertical-slider-column"><div class="slider-end-label">${escapeHtml(upperLabel)} ↑</div><input id="policySlider" class="vertical-policy-slider" aria-label="${escapeHtml(q.tool)} policy adjustment" type="range" min="-100" max="100" step="1" value="0" orient="vertical"><div class="slider-end-label">${escapeHtml(lowerLabel)} ↓</div><div id="sliderValue" class="slider-value">0</div></div><div class="slider-box-column"><div id="economyBox" class="economy-box">${q.tool==='spending'||q.tool==='taxes'?'ECONOMIC ACTIVITY':'MONEY SUPPLY'}</div></div></div><p id="sliderDirection" aria-live="polite">Move the slider to explore the effect.</p><p class="slider-question">${escapeHtml(q.sliderQuestion||'Which policy is represented?')}</p><div class="policy-choices">${choices.map((c,i)=>`<button type="button" data-policy-choice="${i}" disabled>${escapeHtml(c)}</button>`).join('')}</div><button id="applyPolicy" class="apply-policy" type="button" disabled>Apply Policy</button></div><div id="feedback" class="feedback" role="status"></div><div class="source-box"><a href="${q.source}" target="_blank" rel="noopener">Open supporting source ↗</a><p><strong>Where to look:</strong> ${escapeHtml(q.where)}</p></div>`;
   const slider=$('policySlider'),box=$('economyBox'),policyButtons=[...document.querySelectorAll('[data-policy-choice]')],apply=$('applyPolicy');
   let selected=null;
   slider.oninput=()=>{
     const val=Number(slider.value),effect=val*(q.tool==='taxes'||q.tool==='reserves'||q.tool==='discount'?-1:1);
     const size=Math.max(100,Math.min(240,160+effect*.7));
     box.style.width=size+'px';box.style.height=size+'px';
     $('sliderValue').textContent=val===0?'Neutral':'Adjustment set';
     $('sliderDirection').textContent=val===0?'Move the slider to explore the effect.':'Choose your answer, then click Apply Policy.';
     policyButtons.forEach(button=>button.disabled=val===0);
     apply.disabled=val===0||selected===null;
   };
   policyButtons.forEach(b=>b.onclick=()=>{
     if(advanceTimer||b.disabled)return;
     selected=Number(b.dataset.policyChoice);
     policyButtons.forEach(x=>x.classList.toggle('selected',x===b));
     apply.disabled=Number(slider.value)===0;
   });
   apply.onclick=()=>{
     if(advanceTimer||apply.disabled||selected===null)return;
     const correctDirection=Math.sign(Number(slider.value))===q.direction;
     const correctChoice=selected===(q.sliderAnswer??0);
     answer(correctDirection&&correctChoice?0:1,apply,0);
   };
 }else{
  state.choiceOrders=state.choiceOrders||{};
  let order=state.choiceOrders[q.id];
  if(!order){order=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}state.choiceOrders[q.id]=order;}

  $('questionCard').innerHTML=`<h2>${escapeHtml(q.topic||q.cs)}</h2><p class="prompt">${escapeHtml(q.prompt)}</p><div class="choices">${order.map((original,i)=>`<button class="choice" data-choice="${original}"><span class="choice-letter">${letters[i]}.</span><span>${escapeHtml(q.choices[original])}</span></button>`).join('')}</div><div id="feedback" class="feedback" role="status"></div>${q.source?`<div class="source-box"><a href="${q.source}" target="_blank" rel="noopener">Open supporting source ↗</a><p><strong>Where to look:</strong> ${escapeHtml(q.where)}</p></div>`:''}`;
  document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>answer(Number(b.dataset.choice),b));
 }
 updateStats();window.scrollTo({top:Math.max(0,$('workspace').offsetTop-12),behavior:'smooth'});
}
function answer(choice,button,sliderCorrect=0){
  if(advanceTimer)return;const q=currentQuestion(),f=$("feedback");state.answers[q.id]=choice;state.attempts[q.id]=(state.attempts[q.id]||0)+1;const isCorrect=q.type==='slider'?choice===sliderCorrect:choice===q.answer;if(!(q.id in state.firstAttempt))state.firstAttempt[q.id]=isCorrect;
  if(isCorrect){
    state.correctChecks++;state.mastered[q.id]=true;button.classList.add("correct");document.querySelectorAll("[data-choice], [data-policy-choice], #applyPolicy").forEach(b=>b.disabled=true);const sl=$("policySlider");if(sl)sl.disabled=true;
    f.className="feedback good";f.innerHTML=`<strong>Correct.</strong> ${escapeHtml(q.explanation)}<span class="advance-note">Advancing to the next question…</span>`;
    state.events.push({type:"correct",question:q.id,attempt:state.attempts[q.id],at:new Date().toISOString()});saveLocal();updateStats();queueCloudSave();
    advanceTimer=setTimeout(()=>{advanceTimer=null;state.currentIndex++;while(state.currentIndex<questions.length&&state.mastered[questions[state.currentIndex].id])state.currentIndex++;renderQuestion()},4000);
  }else{
    state.wrongTotal++;button.classList.add("wrong");setTimeout(()=>button.classList.remove("wrong"),550);f.className="feedback bad";f.innerHTML=`<strong>Not yet.</strong> ${escapeHtml(q.hint)}`;
    state.events.push({type:"wrong",question:q.id,choice,at:new Date().toISOString()});saveLocal();updateStats();queueCloudSave();
  }
}
function updateStats(){const mastered=questions.filter(q=>state.mastered[q.id]).length,attempts=Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0),accuracy=attempts?Math.round(mastered/attempts*100):100;$("progressStat").textContent=`${Math.min(mastered+1,questions.length)} / ${questions.length}`;$("accuracyStat").textContent=`${accuracy}%`;$("runtimeStat").textContent=formatTime(state.activeSeconds)}
function formatTime(s){s=Math.max(0,Math.floor(s||0));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;return h?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`}
function tick(){const now=Date.now(),sec=Math.min(15,Math.max(0,(now-state.lastTick)/1000));if(started){if(document.hidden)state.awaySeconds+=sec;else state.activeSeconds+=sec;const q=currentQuestion();if(q)state.questionSeconds[q.id]=(state.questionSeconds[q.id]||0)+sec}state.lastTick=now}
function showCompletion(){
 tick();started=false;state.status="completed";state.completedAt=state.completedAt||new Date().toISOString();
 $("workspace").classList.add("hidden");$("completion").classList.remove("hidden");
 const attempts=Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0),s=student(),first=Object.values(state.firstAttempt).filter(Boolean).length;
 $("ticketTitle").textContent=C.title;$("ticketName").textContent=s.name;$("ticketAttempts").textContent=attempts;
 $("ticketIdentity").textContent=`Period ${s.period} • ${s.email}`;
 $("completionSummary").textContent=`Mastery: ${questions.length}/${questions.length} (100%) • First attempt: ${first}/${questions.length} (${Math.round(first/questions.length*100)}%) • Answer accuracy: ${Math.round(questions.length/attempts*100)}% • Active time: ${formatTime(state.activeSeconds)}`;
 $("ticketDate").textContent='Completed: '+new Date(state.completedAt).toLocaleString();saveLocal();queueCloudSave();
}
function payload(){tick();const mastered=questions.filter(q=>state.mastered[q.id]).length;return{assignmentKey:C.assignmentKey,assignmentTitle:C.title,course:"Government",student:student(),state:{...state},answers:{...state.answers},mastered:{...state.mastered},firstAttemptScore:Object.values(state.firstAttempt).filter(Boolean).length,firstAttemptPercent:Math.round(Object.values(state.firstAttempt).filter(Boolean).length/questions.length*100),score:mastered,total:questions.length,percent:Math.round(mastered/questions.length*100),answerCount:Object.keys(state.answers).length,totalAttempts:Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0),wrongAttempts:state.wrongTotal,updatedAt:new Date().toISOString()}}
function saveLocal(){if(!student().email)return;localStorage.setItem(storageKey(),JSON.stringify(payload()))}
function restoreLocal(){if(!student().email)return;const raw=localStorage.getItem(storageKey());if(!raw)return;try{mergeDraft(JSON.parse(raw));$("saveStatus").textContent="Saved work restored on this device."}catch{}}
function mergeDraft(d){if(!d)return;const s=d.state||d;Object.assign(state.firstAttempt,s.firstAttempt||{});Object.assign(state.answers,d.answers||s.answers||{});Object.assign(state.mastered,d.mastered||s.mastered||{});for(const[k,v]of Object.entries(s.attempts||{}))state.attempts[k]=Math.max(state.attempts[k]||0,Number(v)||0);state.wrongTotal=Math.max(state.wrongTotal||0,s.wrongTotal||d.wrongAttempts||0);state.correctChecks=Math.max(state.correctChecks||0,s.correctChecks||0);state.activeSeconds=Math.max(state.activeSeconds||0,s.activeSeconds||0);state.awaySeconds=Math.max(state.awaySeconds||0,s.awaySeconds||0);state.tabLeaves=Math.max(state.tabLeaves||0,s.tabLeaves||0);state.firstStart=s.firstStart||state.firstStart;state.completedAt=s.completedAt||state.completedAt;state.choiceOrders=Object.assign({},s.choiceOrders||{},state.choiceOrders||{});state.events=[...new Map([...(state.events||[]),...(s.events||[])].map(e=>[JSON.stringify(e),e])).values()].slice(-500);for(const[k,v]of Object.entries(s.questionSeconds||{}))state.questionSeconds[k]=Math.max(state.questionSeconds[k]||0,Number(v)||0);goToFirstUnmastered()}
function queueCloudSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>cloudSave(false),750)}
async function cloudSave(manual){if(!valid(false)||APPS_SCRIPT_URL.startsWith("PASTE_")){if(manual)$("saveStatus").textContent=APPS_SCRIPT_URL.startsWith("PASTE_")?"Saved on this device. Add the Apps Script web-app URL for teacher saving.":"Enter complete student information first.";return}saveLocal();try{await fetch(APPS_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"save",payload:JSON.stringify(payload())})});$("saveStatus").textContent="Saved on this device. Teacher save request sent; receipt cannot be confirmed here."}catch{$("saveStatus").textContent="Saved on this device. Teacher save could not be confirmed."}}
function loadCloud(){if(!valid(true)||APPS_SCRIPT_URL.startsWith("PASTE_")){if(APPS_SCRIPT_URL.startsWith("PASTE_"))$("saveStatus").textContent="Add the Apps Script web-app URL before loading teacher drafts.";return}const cb=`load_${Date.now()}`,script=document.createElement("script");window[cb]=r=>{try{if(r&&r.found)mergeDraft(r.payload);saveLocal();$("saveStatus").textContent=r&&r.found?"Previous work merged safely.":"No teacher draft was found."}finally{delete window[cb];script.remove()}};script.src=`${APPS_SCRIPT_URL}?action=load&assignmentKey=${encodeURIComponent(C.assignmentKey)}&email=${encodeURIComponent(student().email)}&callback=${cb}`;script.onerror=()=>{$("saveStatus").textContent="Could not load the teacher draft.";delete window[cb];script.remove()};document.body.appendChild(script)}
async function submit(){if(!valid(true))return;state.status="submitted";state.submittedAt=new Date().toISOString();await cloudSave(true);$("submitStatus").textContent="100% mastery complete. Save request sent; attach a screenshot of this ticket in Google Classroom.";$("submitBtn").disabled=true}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
init();
