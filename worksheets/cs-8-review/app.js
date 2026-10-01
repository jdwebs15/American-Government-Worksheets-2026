// ================================================================
// PASTE THIS WORKSHEET'S GOOGLE APPS SCRIPT /exec WEB ADDRESS BELOW
// ================================================================
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbyAkahbkT3Tn7wVxAap3EqF1uhnB2iJF9hm6pnuUueHkBibHUgZg2R8ZVEHE-Gky6y7/exec";
const questions=window.BLOCK_QUESTIONS;
const C=window.BLOCK_CONFIG;
const $=id=>document.getElementById(id);
const state={answers:{},mastered:{},attempts:{},firstResponses:{},firstResponseAt:{},wrongTotal:0,correctChecks:0,currentIndex:0,firstStart:new Date().toISOString(),sessions:1,activeSeconds:0,awaySeconds:0,tabLeaves:0,events:[],questionSeconds:{},lastTick:Date.now(),status:"in progress"};
let saveTimer=null,advanceTimer=null,started=false,saveChain=Promise.resolve(),identityLocked=false;
state.runId=makeRunId();state.schemaVersion=3;
function makeRunId(){return typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`}
function lockIdentity(){identityLocked=true;$("studentHeading").textContent="Your information and save controls";$("studentName").readOnly=true;$("email").readOnly=true;$("period").disabled=true;$("startBtn").classList.add("hidden")}
function clearRun(){clearTimeout(saveTimer);clearTimeout(advanceTimer);advanceTimer=null;Object.assign(state,{answers:{},mastered:{},attempts:{},firstResponses:{},firstResponseAt:{},wrongTotal:0,correctChecks:0,currentIndex:0,firstStart:new Date().toISOString(),sessions:1,activeSeconds:0,awaySeconds:0,tabLeaves:0,events:[],questionSeconds:{},lastTick:Date.now(),status:"in progress",runId:makeRunId(),schemaVersion:3});delete state.completedAt;delete state.submittedAt;delete state.lastSaveToken;}


function init(){
  $("pageTitle").textContent=C.title;$("pageDescription").textContent=C.description;$("practiceText").textContent=C.practice;
  $("startBtn").onclick=start;$("loadBtn").onclick=loadCloud;$("saveBtn").onclick=()=>cloudSave(true);$("resetBtn").onclick=resetAssignment;$("submitBtn").onclick=submit;$("completionResetBtn").onclick=resetAssignment;
  ["studentName","email"].forEach(id=>$(id).addEventListener("change",restoreLocal));$("period").addEventListener("change",restoreLocal);
  document.addEventListener("visibilitychange",()=>{tick();if(document.hidden)state.tabLeaves++;state.events.push({type:document.hidden?"leave":"return",at:new Date().toISOString()})});
  document.addEventListener("copy",()=>state.events.push({type:"copy",question:currentQuestion()?.id||"",at:new Date().toISOString()}));
  document.addEventListener("paste",()=>state.events.push({type:"paste",question:currentQuestion()?.id||"",at:new Date().toISOString()}));
  setInterval(()=>{tick();updateStats();if(started)saveLocal()},1000);
}
function student(){return{name:$("studentName").value.trim(),period:$("period").value,email:$("email").value.trim().toLowerCase()}}
function valid(show=true){const s=student(),ok=s.name&&s.period&&/^\S+@\S+\.\S+$/.test(s.email);if(!ok&&show)$("saveStatus").textContent="Enter full name, period, and a valid school email first.";return ok}
function storageKey(){return `${C.assignmentKey}|${student().email}|${student().period}`}
function resetAssignment(){
  if(!student().email){$("saveStatus").textContent="Enter the same school email used for this assignment, then select Reset Assignment.";return}
  if(!confirm("Start a new run at Question 1? This clears this device’s current answers and first-attempt score. The teacher draft may be replaced by the new run."))return;
  localStorage.removeItem(storageKey());clearRun();$("completion").classList.add("hidden");$("submitBtn").disabled=false;$("submitStatus").textContent="";started=true;lockIdentity();$("workspace").classList.remove("hidden");renderQuestion();saveLocal();$("saveStatus").textContent="New run started and saved on this device.";queueCloudSave();
}
function start(){if(!valid(true))return;restoreLocal();started=true;state.sessions=Math.max(1,state.sessions||1)+1;state.lastTick=Date.now();lockIdentity();$("workspace").classList.remove("hidden");goToFirstUnmastered();renderQuestion();updateStats();queueCloudSave()}
function currentQuestion(){return questions[state.currentIndex]}
function goToFirstUnmastered(){const i=questions.findIndex(q=>!state.mastered[q.id]);state.currentIndex=i<0?questions.length:i}
function renderQuestion(){
  if(state.currentIndex>=questions.length){showCompletion();return}
  const q=currentQuestion(),n=state.currentIndex+1,letters=["A","B","C","D"];
  $("questionCard").innerHTML=`<h2>${escapeHtml(q.cs)} • Question ${n}</h2>${q.passage?`<div class="source-box"><strong>Reference passage</strong><p>${escapeHtml(q.passage)}</p></div>`:""}<p class="prompt">${escapeHtml(q.prompt)}</p><div class="choices">${q.choices.map((choice,i)=>`<button class="choice" data-choice="${i}"><span class="choice-letter">${letters[i]}.</span><span>${escapeHtml(choice)}</span></button>`).join("")}</div><div id="feedback" class="feedback" role="status"></div>${q.source?`<div class="source-box"><a href="${q.source}" target="_blank" rel="noopener">Open supporting source ↗</a><p><strong>Where to look:</strong> ${escapeHtml(q.where)}</p></div>`:""}`;
  document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>answer(Number(b.dataset.choice),b));
  updateStats();window.scrollTo({top:Math.max(0,$("workspace").offsetTop-12),behavior:"smooth"});
}
function answer(choice,button){
  if(advanceTimer)return;const q=currentQuestion(),f=$("feedback");if(state.firstResponses[q.id]===undefined){state.firstResponses[q.id]=choice;state.firstResponseAt[q.id]=new Date().toISOString()}state.answers[q.id]=choice;state.attempts[q.id]=(state.attempts[q.id]||0)+1;
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
function firstCorrect(){return questions.filter(q=>Number(state.firstResponses[q.id])===Number(q.answer)).length}
function updateStats(){const mastered=questions.filter(q=>state.mastered[q.id]).length,firstAnswered=Object.keys(state.firstResponses).length;$("progressStat").textContent=`${Math.min(mastered+1,questions.length)} / ${questions.length}`;$("accuracyStat").textContent=`${firstCorrect()} / ${firstAnswered}`;$("runtimeStat").textContent=formatTime(state.activeSeconds)}
function formatTime(s){s=Math.max(0,Math.floor(s||0));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;return h?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`}
function tick(){const now=Date.now(),sec=Math.min(15,Math.max(0,(now-state.lastTick)/1000));if(started){if(document.hidden)state.awaySeconds+=sec;else state.activeSeconds+=sec;const q=currentQuestion();if(q&&!document.hidden)state.questionSeconds[q.id]=(state.questionSeconds[q.id]||0)+sec}state.lastTick=now}
function showCompletion(){started=false;state.status="completed";state.completedAt=state.completedAt||new Date().toISOString();$("workspace").classList.add("hidden");$("completion").classList.remove("hidden");const attempts=Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0),s=student();let nameLine=$("completionStudent");if(!nameLine){nameLine=document.createElement("h3");nameLine.id="completionStudent";nameLine.style.cssText="margin:.8rem auto;color:#fff;font-size:1.55rem;padding:10px 14px;border:1px solid #4b6fa8;border-radius:12px;background:#172c4d;max-width:620px";$("completion").insertBefore(nameLine,$("completionSummary"))}nameLine.textContent=`Completed by: ${s.name} • Period ${s.period}`;$("completionSummary").textContent=`Mastery complete: ${questions.length} of ${questions.length} corrected • First-attempt score: ${firstCorrect()} of ${questions.length} • ${attempts} total attempts • ${formatTime(state.activeSeconds)} active time.`;saveLocal();queueCloudSave()}
function payload(){tick();const mastered=questions.filter(q=>state.mastered[q.id]).length,firstScore=firstCorrect();return{assignmentKey:C.assignmentKey,assignmentTitle:C.title,course:"American Government",assignmentType:"review",student:student(),state:{...state},answers:{...state.answers},mastered:{...state.mastered},firstResponses:{...state.firstResponses},score:firstScore,total:questions.length,percent:Math.round(firstScore/questions.length*100),firstAttemptScore:firstScore,firstAttemptPercent:Math.round(firstScore/questions.length*100),masteryScore:mastered,masteryPercent:Math.round(mastered/questions.length*100),answerCount:Object.keys(state.answers).length,wrongAttempts:state.wrongTotal,updatedAt:new Date().toISOString()}}
function saveLocal(){if(!valid(false))return;try{localStorage.setItem(storageKey(),JSON.stringify(payload()));return true}catch{$("saveStatus").textContent="This browser could not save progress. Keep this page open and use Save progress.";return false}}
function restoreLocal(){if(identityLocked||!valid(false))return;clearRun();try{const raw=localStorage.getItem(storageKey());if(!raw)return;mergeDraft(JSON.parse(raw));$("saveStatus").textContent="Saved work restored on this device."}catch{$("saveStatus").textContent="This browser could not restore local progress."}}
function mergeDraft(d){if(!d)return;const s=d.state||d;if(d.assignmentKey&&d.assignmentKey!==C.assignmentKey)return;if(d.student&&(d.student.email.toLowerCase()!==student().email||String(d.student.period)!==student().period))return;
if(s.schemaVersion!==3)return;
if(identityLocked&&s.runId!==state.runId){$("saveStatus").textContent="A different saved run was found. Reset before starting if you need to switch runs.";return}
state.runId=s.runId||state.runId;state.sessions=Math.max(state.sessions||1,s.sessions||1);state.status=s.status||state.status;state.submittedAt=s.submittedAt;state.completedAt=s.completedAt;for(const[k,v]of Object.entries(d.answers||s.answers||{}))if(state.answers[k]===undefined)state.answers[k]=v;for(const[k,v]of Object.entries(d.mastered||s.mastered||{}))if(v)state.mastered[k]=true;for(const[k,v]of Object.entries(s.attempts||{}))state.attempts[k]=Math.max(state.attempts[k]||0,Number(v)||0);const remoteFirst=s.firstResponses||d.firstResponses||{},remoteAt=s.firstResponseAt||{};for(const[k,v]of Object.entries(remoteFirst)){const localAt=state.firstResponseAt[k],cloudAt=remoteAt[k];if(state.firstResponses[k]===undefined||(cloudAt&&(!localAt||cloudAt<localAt))){state.firstResponses[k]=v;state.firstResponseAt[k]=cloudAt||localAt||""}}state.wrongTotal=Math.max(state.wrongTotal||0,s.wrongTotal||d.wrongAttempts||0);state.correctChecks=Math.max(state.correctChecks||0,s.correctChecks||0);state.activeSeconds=Math.max(state.activeSeconds||0,s.activeSeconds||0);state.awaySeconds=Math.max(state.awaySeconds||0,s.awaySeconds||0);state.tabLeaves=Math.max(state.tabLeaves||0,s.tabLeaves||0);state.firstStart=s.firstStart||state.firstStart;state.events=Array.from(new Map([...(state.events||[]),...(s.events||[])].map(e=>[JSON.stringify(e),e])).values()).slice(-500);for(const[k,v]of Object.entries(s.questionSeconds||{}))state.questionSeconds[k]=Math.max(state.questionSeconds[k]||0,Number(v)||0);goToFirstUnmastered()}
function queueCloudSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>cloudSave(false),750)}
function readCloud(){
  return new Promise((resolve,reject)=>{const cb=`load_${Date.now()}_${Math.random().toString(36).slice(2)}`,script=document.createElement("script");let timer;const cleanup=()=>{clearTimeout(timer);delete window[cb];script.remove()};window[cb]=r=>{cleanup();if(r&&r.ok===false)reject(new Error("Backend rejected retrieval"));else resolve(r)};script.onerror=()=>{cleanup();reject(new Error("Could not load teacher draft"))};timer=setTimeout(()=>{cleanup();reject(new Error("Teacher draft request timed out"))},10000);script.src=`${APPS_SCRIPT_URL}?action=load&assignmentKey=${encodeURIComponent(C.assignmentKey)}&email=${encodeURIComponent(student().email)}&period=${encodeURIComponent(student().period)}&callback=${cb}&_=${Date.now()}`;document.body.appendChild(script)});
}
function cloudSave(manual){
  if(!valid(false)||APPS_SCRIPT_URL.startsWith("PASTE_")){if(manual)$("saveStatus").textContent="Enter complete student information and configure the teacher save address.";return Promise.resolve("failed")}
  state.lastSaveToken=makeRunId();saveLocal();const data=JSON.parse(JSON.stringify(payload())),run=data.state.runId;
  const work=async()=>{if(run!==state.runId)return "stale";try{await fetch(APPS_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"save",payload:JSON.stringify(data)})});if(run!==state.runId)return "stale";$("saveStatus").textContent="Saved on this device; sent to teacher spreadsheet (receipt unconfirmed).";
    if(manual){try{const response=await readCloud(),remote=response&&response.found&&response.payload,rs=remote&&remote.state;if(rs&&rs.runId===run&&rs.lastSaveToken===data.state.lastSaveToken){$("saveStatus").textContent="Teacher spreadsheet save confirmed.";return "confirmed"}}catch{}}
    return "unconfirmed";
  }catch{if(run===state.runId)$("saveStatus").textContent="Teacher save failed. Keep this page open and retry Save progress.";return "failed"}};
  const result=saveChain.then(work,work);saveChain=result.catch(()=>{});return result;
}
async function loadCloud(){
  if(!valid(true))return;const identity=storageKey(),run=state.runId;$("saveStatus").textContent="Checking teacher draft…";
  try{const r=await readCloud();if(identity!==storageKey()||run!==state.runId)return;
    if(r&&r.found){const draft=r.payload,remote=draft&&draft.state;if(!remote||remote.schemaVersion!==3){$("saveStatus").textContent="This draft uses an older version. Current work was kept.";return}if((identityLocked||Object.keys(state.answers).length>0)&&remote.runId!==state.runId){$("saveStatus").textContent="A different run was found; current work was kept.";return}mergeDraft(draft);saveLocal();if(started&&!advanceTimer)renderQuestion();$("saveStatus").textContent="Previous work restored."}else $("saveStatus").textContent="No teacher draft was found.";
  }catch{$("saveStatus").textContent="Could not retrieve teacher draft. Local progress was kept."}
}
async function submit(){
  if(!valid(true)||questions.some(q=>!state.mastered[q.id]))return;const run=state.runId;clearTimeout(saveTimer);$("submitBtn").disabled=true;state.status="submitted";state.submittedAt=new Date().toISOString();$("submitStatus").textContent="Sending completed work and checking receipt…";
  const result=await cloudSave(true);if(run!==state.runId)return;
  if(result==="confirmed")$("submitStatus").textContent=`Teacher receipt confirmed: ${questions.length}/${questions.length} mastered; first-attempt score ${firstCorrect()}/${questions.length}.`;
  else{$("submitStatus").textContent=result==="failed"?"Teacher submission failed. Your completion remains on this device; select Submit to retry.":"Completed work sent, but teacher receipt is unconfirmed. Keep your completion ticket visible and ask your teacher to check the spreadsheet. You may retry Submit.";$("submitBtn").disabled=false;}
}

function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
init();
