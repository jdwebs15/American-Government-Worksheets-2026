// ================================================================
// PASTE THIS WORKSHEET'S GOOGLE APPS SCRIPT /exec WEB ADDRESS BELOW
// ================================================================
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbyAkahbkT3Tn7wVxAap3EqF1uhnB2iJF9hm6pnuUueHkBibHUgZg2R8ZVEHE-Gky6y7/exec";
const questions=window.BLOCK_QUESTIONS;
const C=window.BLOCK_CONFIG;
const $=id=>document.getElementById(id);
const state={answers:{},mastered:{},attempts:{},wrongTotal:0,correctChecks:0,currentIndex:0,firstStart:new Date().toISOString(),sessions:1,activeSeconds:0,awaySeconds:0,tabLeaves:0,events:[],questionSeconds:{},lastTick:Date.now(),status:"in progress"};
let saveTimer=null,advanceTimer=null,started=false;

function init(){
  $("pageTitle").textContent=C.title;$("pageDescription").textContent=C.description;$("practiceText").textContent=C.practice;
  $("startBtn").onclick=start;$("loadBtn").onclick=loadCloud;$("saveBtn").onclick=()=>cloudSave(true);$("resetBtn").onclick=resetAssignment;$("workspaceResetBtn").onclick=resetAssignment;$("submitBtn").onclick=submit;$("completionResetBtn").onclick=resetAssignment;
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
  localStorage.removeItem(storageKey());
  location.reload();
}
function start(){if(!valid(true))return;restoreLocal();started=true;state.sessions=Math.max(1,state.sessions||1);$("studentPanel").classList.add("hidden");$("workspace").classList.remove("hidden");goToFirstUnmastered();renderQuestion();updateStats();queueCloudSave()}
function currentQuestion(){return questions[state.currentIndex]}
function goToFirstUnmastered(){const i=questions.findIndex(q=>!state.mastered[q.id]);state.currentIndex=i<0?questions.length:i}
function renderQuestion(){
  if(state.currentIndex>=questions.length){showCompletion();return}
  const q=currentQuestion(),n=state.currentIndex+1,letters=["A","B","C","D"];
  $("questionCard").innerHTML=`<h2>${escapeHtml(q.topic||q.cs)}</h2><p class="prompt">${escapeHtml(q.prompt)}</p><div class="choices">${q.choices.map((choice,i)=>`<button class="choice" data-choice="${i}"><span class="choice-letter">${letters[i]}.</span><span>${escapeHtml(choice)}</span></button>`).join("")}</div><div id="feedback" class="feedback" role="status"></div>${q.source?`<div class="source-box"><a href="${q.source}" target="_blank" rel="noopener">Open supporting source ↗</a><p><strong>Where to look:</strong> ${escapeHtml(q.where)}</p></div>`:""}`;
  document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>answer(Number(b.dataset.choice),b));
  updateStats();window.scrollTo({top:Math.max(0,$("workspace").offsetTop-12),behavior:"smooth"});
}
function answer(choice,button){
  if(advanceTimer)return;const q=currentQuestion(),f=$("feedback");state.answers[q.id]=choice;state.attempts[q.id]=(state.attempts[q.id]||0)+1;
  if(choice===q.answer){
    state.correctChecks++;state.mastered[q.id]=true;button.classList.add("correct");document.querySelectorAll("[data-choice]").forEach(b=>b.disabled=true);
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
function showCompletion(){started=false;state.status="completed";state.completedAt=state.completedAt||new Date().toISOString();$("workspace").classList.add("hidden");$("completion").classList.remove("hidden");const attempts=Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0),accuracy=attempts?Math.round(questions.length/attempts*100):100,s=student();let nameLine=$("completionStudent");if(!nameLine){nameLine=document.createElement("h3");nameLine.id="completionStudent";nameLine.style.cssText="margin:.8rem auto;color:#fff;font-size:1.55rem;padding:10px 14px;border:1px solid #4b6fa8;border-radius:12px;background:#172c4d;max-width:620px";$("completion").insertBefore(nameLine,$("completionSummary"))}nameLine.textContent=`Completed by: ${s.name} • Period ${s.period}`;$("completionSummary").textContent=`${questions.length} of ${questions.length} mastered • ${attempts} attempts • ${accuracy}% accuracy • ${formatTime(state.activeSeconds)} active time.`;saveLocal();queueCloudSave()}
function payload(){tick();const mastered=questions.filter(q=>state.mastered[q.id]).length,totalAttempts=Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0),accuracy=totalAttempts?Math.round(mastered/totalAttempts*100):100;return{assignmentKey:C.assignmentKey,assignmentTitle:C.title,course:"Government",assignmentType:"vocabulary",student:student(),state:{...state},answers:{...state.answers},mastered:{...state.mastered},score:mastered,total:questions.length,percent:Math.round(mastered/questions.length*100),masteryScore:mastered,masteryPercent:Math.round(mastered/questions.length*100),totalAttempts,accuracyPercent:accuracy,answerCount:Object.keys(state.answers).length,wrongAttempts:state.wrongTotal,updatedAt:new Date().toISOString()}}
function saveLocal(){if(!student().email)return;localStorage.setItem(storageKey(),JSON.stringify(payload()))}
function restoreLocal(){if(!student().email)return;const raw=localStorage.getItem(storageKey());if(!raw)return;try{mergeDraft(JSON.parse(raw));$("saveStatus").textContent="Saved work restored on this device."}catch{}}
function mergeDraft(d){if(!d)return;const s=d.state||d;Object.assign(state.answers,d.answers||s.answers||{});Object.assign(state.mastered,d.mastered||s.mastered||{});for(const[k,v]of Object.entries(s.attempts||{}))state.attempts[k]=Math.max(state.attempts[k]||0,Number(v)||0);state.wrongTotal=Math.max(state.wrongTotal||0,s.wrongTotal||d.wrongAttempts||0);state.correctChecks=Math.max(state.correctChecks||0,s.correctChecks||0);state.activeSeconds=Math.max(state.activeSeconds||0,s.activeSeconds||0);state.awaySeconds=Math.max(state.awaySeconds||0,s.awaySeconds||0);state.tabLeaves=Math.max(state.tabLeaves||0,s.tabLeaves||0);state.firstStart=s.firstStart||state.firstStart;state.events=[...(state.events||[]),...(s.events||[])].slice(-500);state.questionSeconds=Object.assign({},s.questionSeconds||{},state.questionSeconds||{});goToFirstUnmastered()}
function queueCloudSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>cloudSave(false),750)}
async function cloudSave(manual){if(!valid(false)||APPS_SCRIPT_URL.startsWith("PASTE_")){if(manual)$("saveStatus").textContent=APPS_SCRIPT_URL.startsWith("PASTE_")?"Saved on this device. Add the Apps Script web-app URL for teacher saving.":"Enter complete student information first.";return}saveLocal();try{await fetch(APPS_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"save",payload:JSON.stringify(payload())})});$("saveStatus").textContent="Saved on this device and sent to your teacher draft."}catch{$("saveStatus").textContent="Saved on this device. Teacher save could not be confirmed."}}
function loadCloud(){if(!valid(true)||APPS_SCRIPT_URL.startsWith("PASTE_")){if(APPS_SCRIPT_URL.startsWith("PASTE_"))$("saveStatus").textContent="Add the Apps Script web-app URL before loading teacher drafts.";return}const cb=`load_${Date.now()}`,script=document.createElement("script");window[cb]=r=>{try{if(r&&r.found)mergeDraft(r.payload);saveLocal();$("saveStatus").textContent=r&&r.found?"Previous work merged safely.":"No teacher draft was found."}finally{delete window[cb];script.remove()}};script.src=`${APPS_SCRIPT_URL}?action=load&assignmentKey=${encodeURIComponent(C.assignmentKey)}&email=${encodeURIComponent(student().email)}&callback=${cb}`;script.onerror=()=>{$("saveStatus").textContent="Could not load the teacher draft.";delete window[cb];script.remove()};document.body.appendChild(script)}
async function submit(){if(!valid(true))return;state.status="submitted";state.submittedAt=new Date().toISOString();await cloudSave(true);$("submitStatus").textContent="Submitted successfully at 100% mastery.";$("submitBtn").disabled=true}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
init();
