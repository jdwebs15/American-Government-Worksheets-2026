const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbyAkahbkT3Tn7wVxAap3EqF1uhnB2iJF9hm6pnuUueHkBibHUgZg2R8ZVEHE-Gky6y7/exec";
const questions=window.BLOCK_QUESTIONS.slice();
const C=window.BLOCK_CONFIG;
const $=id=>document.getElementById(id);
const QUESTION_VERSION="20261002-CS911-24";
const state={questionVersion:QUESTION_VERSION,questionOrder:[],choiceOrders:{},answers:{},mastered:{},attempts:{},firstAttempts:{},sourceClicks:{},runId:null,wrongTotal:0,correctChecks:0,currentIndex:0,firstStart:null,sessions:0,activeSeconds:0,awaySeconds:0,tabLeaves:0,events:[],questionSeconds:{},lastTick:Date.now(),status:"in progress"};
let saveTimer=null,advanceTimer=null,started=false;
function setSaveStatus(message){$("saveStatus").textContent=message;$("workSaveStatus").textContent=message;}
function resetAssignment(){if(!confirm("Start this assignment over? This begins a new attempt and clears this device’s answers."))return;clearTimeout(saveTimer);clearTimeout(advanceTimer);const info=student();localStorage.setItem(C.assignmentKey+"|student",JSON.stringify(info));localStorage.removeItem(storageKey());localStorage.setItem(storageKey()+"|resetAt",new Date().toISOString());location.reload();}

function init(){
  $("pageTitle").textContent=C.title;$("pageDescription").textContent=C.description;$("practiceText").textContent=C.practice;
  const info=JSON.parse(localStorage.getItem(C.assignmentKey+"|student")||"null");if(info){$("studentName").value=info.name||"";$("email").value=info.email||"";$("period").value=info.period||"";}
  $("resetBtn").onclick=resetAssignment;$("completionResetBtn").onclick=resetAssignment;
  $("workLoadBtn").onclick=loadCloud;$("workResetBtn").onclick=resetAssignment;$("workSaveBtn").onclick=()=>cloudSave(true);
  setInterval(()=>{if(started)queueCloudSave()},30000);
  $("startBtn").onclick=start;$("loadBtn").onclick=loadCloud;$("saveBtn").onclick=()=>cloudSave(true);$("submitBtn").onclick=submit;
  ["studentName","email"].forEach(id=>$(id).addEventListener("change",restoreLocal));$("period").addEventListener("change",saveLocal);
  document.addEventListener("visibilitychange",()=>{tick();if(!started)return;if(document.hidden)state.tabLeaves++;state.events.push({type:document.hidden?"leave":"return",at:new Date().toISOString()})});
  document.addEventListener("copy",()=>started&&state.events.push({type:"copy",question:currentQuestion()?.id||"",at:new Date().toISOString()}));
  document.addEventListener("paste",()=>started&&state.events.push({type:"paste",question:currentQuestion()?.id||"",at:new Date().toISOString()}));
  setInterval(()=>{tick();updateStats();if(started)saveLocal()},1000);
}
function student(){return{name:$("studentName").value.trim(),period:$("period").value,email:$("email").value.trim().toLowerCase()}}
function valid(show=true){const s=student(),ok=s.name&&s.period&&/^\S+@\S+\.\S+$/.test(s.email);if(!ok&&show)$("saveStatus").textContent="Enter full name, period, and a valid school email first.";return ok}
function storageKey(){return `${C.assignmentKey}|${student().email}`}
function start(){if(!valid(true))return;restoreLocal();ensureShuffle();state.firstStart=state.firstStart||new Date().toISOString();state.runId=state.runId||crypto.randomUUID();state.sessions=(state.sessions||0)+1;state.lastTick=Date.now();started=true;localStorage.setItem(C.assignmentKey+"|student",JSON.stringify(student()));$("workControls").classList.remove("hidden");state.sessions=Math.max(1,state.sessions||1);$("studentPanel").classList.add("hidden");$("workspace").classList.remove("hidden");goToFirstUnmastered();renderQuestion();updateStats();queueCloudSave()}
function currentQuestion(){return questions[state.currentIndex]}
function goToFirstUnmastered(){const i=questions.findIndex(q=>!state.mastered[q.id]);state.currentIndex=i<0?questions.length:i}
function renderQuestion(){
  if(state.currentIndex<questions.length){$("completion").classList.add("hidden");if(started)$("workspace").classList.remove("hidden");}
  if(state.currentIndex>=questions.length){showCompletion();return}
  ensureShuffle();const q=currentQuestion(),n=state.currentIndex+1,letters=["A","B","C","D"];
  $("questionCard").innerHTML=`<h2>${escapeHtml(`Question ${n} • ${q.topic||q.cs}`)}</h2>${q.reading?`<details class="source-box" open><summary><strong>Reading: ${escapeHtml(q.readingTitle)}</strong></summary><p>${escapeHtml(q.reading)}</p></details>`:""}<p class="prompt">${escapeHtml(q.prompt)}</p><div class="choices">${state.choiceOrders[q.id].map((originalIndex,displayIndex)=>`<button class="choice" data-choice="${originalIndex}"><span class="choice-letter">${letters[displayIndex]}.</span><span>${escapeHtml(q.choices[originalIndex])}</span></button>`).join("")}</div><div id="feedback" class="feedback" role="status"></div>${q.source?`<div class="source-box"><a href="${q.source}" target="_blank" rel="noopener">Open supporting source ↗</a><p><strong>Where to look:</strong> ${escapeHtml(q.where)}</p></div>`:""}`;
  document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>answer(Number(b.dataset.choice),b));
  const sourceLink=$("questionCard").querySelector(".source-box a");if(sourceLink)sourceLink.onclick=()=>{state.sourceClicks[q.id]=(state.sourceClicks[q.id]||0)+1;state.events.push({type:"source",question:q.id,at:new Date().toISOString()});saveLocal();queueCloudSave();};
  updateStats();window.scrollTo({top:Math.max(0,$("workspace").offsetTop-12),behavior:"smooth"});
}
function answer(choice,button){
  if(advanceTimer)return;const q=currentQuestion(),f=$("feedback");state.answers[q.id]=choice;state.attempts[q.id]=(state.attempts[q.id]||0)+1;if(state.firstAttempts[q.id]===undefined)state.firstAttempts[q.id]=choice===q.answer;
  if(choice===q.answer){
    state.correctChecks++;state.mastered[q.id]=true;if(questions.every(item=>state.mastered[item.id]))state.completedAt=state.completedAt||new Date().toISOString();button.classList.add("correct");document.querySelectorAll("[data-choice]").forEach(b=>b.disabled=true);
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
function tick(){const now=Date.now(),sec=Math.max(0,(now-state.lastTick)/1000);if(started){if(document.hidden)state.awaySeconds+=sec;else state.activeSeconds+=sec;const q=currentQuestion();if(q&&!document.hidden)state.questionSeconds[q.id]=(state.questionSeconds[q.id]||0)+sec}state.lastTick=now}
function showCompletion(){tick();started=false;state.status="completed";state.completedAt=state.completedAt||new Date().toISOString();$("workspace").classList.add("hidden");$("completion").classList.remove("hidden");const attempts=Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0),accuracy=attempts?Math.round(questions.length/attempts*100):100;$("completionSummary").textContent=`${questions.length} of ${questions.length} mastered • ${attempts} attempts • ${accuracy}% accuracy • ${formatTime(state.activeSeconds)} active time.`;renderTicketDetails();saveLocal();queueCloudSave()}
function payload(){tick();const mastered=questions.filter(q=>state.mastered[q.id]).length;return{assignmentKey:C.assignmentKey,assignmentTitle:C.title,course:"Government",student:student(),state:{...state},runId:state.runId,status:state.status,startedAt:state.firstStart,completedAt:state.completedAt,submittedAt:state.submittedAt,attempts:{...state.attempts},firstAttempts:{...state.firstAttempts},sourceClicks:{...state.sourceClicks},accuracyPercent:attemptAccuracy(),telemetry:telemetry(),answers:{...state.answers},mastered:{...state.mastered},score:mastered,total:questions.length,percent:Math.round(mastered/questions.length*100),answerCount:Object.keys(state.answers).length,totalAttempts:Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0),wrongAttempts:state.wrongTotal,firstAttemptCorrect:Object.values(state.firstAttempts).filter(Boolean).length,updatedAt:new Date().toISOString()}}
function saveLocal(){if(!student().email)return;localStorage.setItem(storageKey(),JSON.stringify(payload()))}
function restoreLocal(){if(!student().email)return;const raw=localStorage.getItem(storageKey());if(!raw)return;try{mergeDraft(JSON.parse(raw));$("saveStatus").textContent="Saved work restored on this device."}catch{}}
function mergeDraft(d){if(!d)return;const resetAt=localStorage.getItem(storageKey()+"|resetAt");if(resetAt&&Date.parse(d.updatedAt||0)<Date.parse(resetAt))return;const s=d.state||d;ensureShuffle(s);let restoredAnswers={...(d.answers||s.answers||{})};if(s.questionVersion!==QUESTION_VERSION){for(const q of questions){if(restoredAnswers[q.id]!==undefined)restoredAnswers[q.id]=q.legacyChoiceMap?.[restoredAnswers[q.id]]??restoredAnswers[q.id];}}for(const[k,v]of Object.entries(restoredAnswers))if(!state.mastered[k])state.answers[k]=v;for(const[k,v]of Object.entries(d.mastered||s.mastered||{}))if(v)state.mastered[k]=true;for(const[k,v]of Object.entries(s.attempts||{}))state.attempts[k]=Math.max(state.attempts[k]||0,Number(v)||0);state.wrongTotal=Math.max(state.wrongTotal||0,s.wrongTotal||d.wrongAttempts||0);state.correctChecks=Math.max(state.correctChecks||0,s.correctChecks||0);for(const[k,v]of Object.entries(s.firstAttempts||{}))if(state.firstAttempts[k]===undefined)state.firstAttempts[k]=v;for(const[k,v]of Object.entries(s.sourceClicks||d.sourceClicks||{}))state.sourceClicks[k]=Math.max(state.sourceClicks[k]||0,Number(v)||0);state.runId=s.runId||d.runId||state.runId;state.sessions=Math.max(state.sessions||0,s.sessions||0);state.activeSeconds=Math.max(state.activeSeconds||0,s.activeSeconds||0);state.awaySeconds=Math.max(state.awaySeconds||0,s.awaySeconds||0);state.tabLeaves=Math.max(state.tabLeaves||0,s.tabLeaves||0);const starts=[state.firstStart,s.firstStart].filter(v=>v&&Number.isFinite(Date.parse(v)));state.firstStart=starts.length?starts.reduce((a,b)=>Date.parse(a)<Date.parse(b)?a:b):null;state.completedAt=state.completedAt||s.completedAt||null;state.submittedAt=state.submittedAt||s.submittedAt||null;state.events=[...new Map([...(state.events||[]),...(s.events||[])].map(e=>[JSON.stringify(e),e])).values()].slice(-500);for(const[k,v]of Object.entries(s.questionSeconds||{}))state.questionSeconds[k]=Math.max(state.questionSeconds[k]||0,Number(v)||0);goToFirstUnmastered()}
function queueCloudSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>cloudSave(false),750)}
async function cloudSave(manual){
  if(!valid(false)||APPS_SCRIPT_URL.startsWith("PASTE_")){if(manual)setSaveStatus("Enter complete student information first. Teacher saving requires the configured web-app URL.");return false;}
  saveLocal();
  try{
    await fetch(APPS_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:state.status==="submitted"?"submit":"save",payload:JSON.stringify(payload())})});
    setSaveStatus("Saved on this device. Sent to your teacher; spreadsheet receipt is not confirmed.");return true;
  }catch{setSaveStatus("Saved on this device. Teacher save failed—use Save progress to retry.");return false;}
}
function loadCloud(){
  if(!valid(true)||APPS_SCRIPT_URL.startsWith("PASTE_"))return;
  const cb=`load_${Date.now()}`,script=document.createElement("script");
  setSaveStatus("Loading previous work…");
  let timer;
  const cleanup=()=>{clearTimeout(timer);delete window[cb];script.remove();};
  window[cb]=r=>{try{if(r?.ok===false){setSaveStatus(r.message||"Teacher draft could not be loaded.");return;}if(r&&r.found)mergeDraft(r.payload);if(started){clearTimeout(advanceTimer);advanceTimer=null;goToFirstUnmastered();renderQuestion();}saveLocal();setSaveStatus(r&&r.found?"Previous work merged safely.":"No teacher draft was found.");}finally{cleanup();}};
  script.src=`${APPS_SCRIPT_URL}?action=load&course=Government&assignmentKey=${encodeURIComponent(C.assignmentKey)}&email=${encodeURIComponent(student().email)}&callback=${cb}`;
  script.onerror=()=>{setSaveStatus("Could not load the teacher draft. Work on this device is still available.");cleanup();};
  timer=setTimeout(()=>{setSaveStatus("Teacher draft request timed out. Retry Load previous work.");cleanup();},15000);
  document.body.appendChild(script);
}
async function submit(){
  if(!valid(true))return;
  if(questions.some(q=>!state.mastered[q.id])){$("submitStatus").textContent="Correct every question before submitting.";return;}
  $("submitBtn").disabled=true;$("submitStatus").textContent="Sending completed assignment…";
  const oldStatus=state.status;const oldSubmittedAt=state.submittedAt;
  state.status="submitted";state.submittedAt=new Date().toISOString();
  const sent=await cloudSave(true);
  if(sent){$("submitStatus").textContent=`${student().name} • Period ${student().period} • ${questions.length}/${questions.length} mastered. Submission sent; your teacher must verify spreadsheet receipt.`;$("submitBtn").textContent="Send submission again";}
  else{state.status=oldStatus;state.submittedAt=oldSubmittedAt;saveLocal();$("submitStatus").textContent="Completed on this device. Submission could not be sent. Please retry.";}
  $("submitBtn").disabled=false;
}

function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
init();

function ticketTimestamp(value){
  if(!value||!Number.isFinite(Date.parse(value)))return "Not recorded";
  return new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"2-digit",second:"2-digit",timeZoneName:"short"}).format(new Date(value));
}
function renderTicketDetails(){
  let detail=$("ticketDetails");
  if(!detail){detail=document.createElement("div");detail.id="ticketDetails";$("completionSummary").insertAdjacentElement("beforebegin",detail);}
  detail.replaceChildren();
  const rows=[`Student: ${student().name}`,`Period: ${student().period}`,`Started: ${ticketTimestamp(state.firstStart)}`,`Stopped: ${ticketTimestamp(state.completedAt)}`];
  for(const row of rows){const line=document.createElement("p");line.textContent=row;detail.appendChild(line);}
}

function attemptAccuracy(){const n=Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0);return n?Math.round(questions.filter(q=>state.mastered[q.id]).length/n*1000)/10:0;}
function telemetry(){const by=type=>{const result={};for(const e of state.events)if(e.type===type&&e.question)result[e.question]=(result[e.question]||0)+1;return result;};return {activeSeconds:state.activeSeconds,awaySeconds:state.awaySeconds,elapsedSeconds:state.activeSeconds+state.awaySeconds,tabLeaves:state.tabLeaves,copies:state.events.filter(e=>e.type==='copy').length,pastes:state.events.filter(e=>e.type==='paste').length,copyByQuestion:by('copy'),pasteByQuestion:by('paste'),questionTimes:{...state.questionSeconds},attempts:{...state.attempts},firstAttempts:{...state.firstAttempts},sourceClicks:{...state.sourceClicks},sessionCount:state.sessions,events:state.events};}

// Save original question IDs and original choice indexes, regardless of display order.
function shuffled(values){const a=values.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function validPermutation(order,expected){return Array.isArray(order)&&order.length===expected.length&&new Set(order).size===expected.length&&order.every(v=>expected.includes(v));}
function ensureShuffle(saved){
  const ids=window.BLOCK_QUESTIONS.map(q=>q.id);
  if(saved&&validPermutation(saved.questionOrder,ids))state.questionOrder=saved.questionOrder.slice();
  if(!validPermutation(state.questionOrder,ids))state.questionOrder=shuffled(ids);
  const bank=new Map(window.BLOCK_QUESTIONS.map(q=>[q.id,q]));
  questions.splice(0,questions.length,...state.questionOrder.map(id=>bank.get(id)));
  const positions=shuffled(questions.map((_,i)=>i%4));
  for(let i=0;i<questions.length;i++){
    const q=questions[i],indexes=q.choices.map((_,j)=>j);
    if(saved&&validPermutation(saved.choiceOrders?.[q.id],indexes))state.choiceOrders[q.id]=saved.choiceOrders[q.id].slice();
    if(!validPermutation(state.choiceOrders[q.id],indexes)){
      const order=shuffled(indexes.filter(j=>j!==q.answer));order.splice(positions[i],0,q.answer);state.choiceOrders[q.id]=order;
    }
  }
}
