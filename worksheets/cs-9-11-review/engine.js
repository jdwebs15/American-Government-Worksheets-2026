const GOV_SCRIPT_URL='https://script.google.com/macros/s/AKfycbxENUBm5pd966tRn1g9R7HH0zSXcEI10LGLivzQzN0pn6b0ytZHJdV8HU9i0ihYtHJW/exec';
function launchMasteryGame(config){
 const app=document.getElementById('app'),key=config.assignmentKey+'::v1';
 const S={started:false,index:0,attempts:0,items:[],start:null,end:null,name:'',period:'',email:'',events:[],completed:false,submitting:false,submissionMessage:'',tabLeaves:0,copies:0,pastes:0,awayMs:0,awayStart:null};
 let interval=null,advance=null;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
 const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const elapsed=()=>{let s=Math.max(0,Math.floor(((S.end||new Date())-(S.start||new Date()))/1000));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`};
 const firstScore=()=>S.items.filter(q=>q.mastered&&!q.missed).length;
 const whereToLook=q=>{
  const a=q.area||'';
  if(/Thirteenth/.test(a))return 'Read Amendment XIII: abolition of slavery and involuntary servitude.';
  if(/Fourteenth|Incorporation/.test(a))return 'Read Amendment XIV, Section 1: citizenship, due process, and equal protection.';
  if(/Fifteenth/.test(a))return 'Read Amendment XV, Section 1: voting rights regardless of race.';
  if(/Nineteenth/.test(a))return 'Find Amendment XIX: voting rights regardless of sex.';
  if(/Twenty-fourth|Poll taxes/.test(a))return 'Find Amendment XXIV: poll taxes in federal elections.';
  if(/Twenty-sixth/.test(a))return 'Find Amendment XXVI: voting rights at age 18.';
  if(/Twelfth/.test(a))return 'Find Amendment XII: separate electoral votes for president and vice president.';
  if(/Twenty-second/.test(a))return 'Find Amendment XXII: presidential term limits.';
  if(/Twenty-third/.test(a))return 'Find Amendment XXIII: electoral votes for Washington, D.C.';
  if(/Twenty-fifth/.test(a))return 'Find Amendment XXV: presidential succession, disability, and vice-presidential vacancies.';
  if(/Electoral College|Federalism/.test(a))return 'Read the National Archives Electoral College overview: electoral votes, state allocation, and selection of the president.';
  if(/Jim Crow|Continued struggle|Reconstruction|CS 9 • Analysis/.test(a))return 'Compare Amendments XIII–XV and their protections with the question’s description of post-Reconstruction restrictions.';
  if(/Suffrage|Cause and effect|Comparison|Application/.test(a))return 'Compare Amendments XV, XIX, XXIV, and XXVI; identify the specific voting barrier each addresses.';
  return 'Use the relevant amendment text, then compare the constitutional change with the scenario. '+(q.hint||'');
 };
 const done=()=>S.items.length===config.questions.length&&S.items.every(q=>q.mastered);
 const saved=()=>({...S,start:S.start?.toISOString()||null,end:S.end?.toISOString()||null,awayStart:S.awayStart?.toISOString()||null,submitting:false});
 function persist(){if(S.email)try{localStorage.setItem(key+'|'+S.email,JSON.stringify(saved()))}catch(e){console.warn('Local save unavailable',e)}}
 function restore(email){try{const d=JSON.parse(localStorage.getItem(key+'|'+email)||'null');if(!d||d.email!==email||!Array.isArray(d.items)||d.items.length!==config.questions.length)return false;Object.assign(S,d,{start:d.start?new Date(d.start):null,end:d.end?new Date(d.end):null,awayStart:d.awayStart?new Date(d.awayStart):null,submitting:false});return true}catch{return false}}
 function log(type,extra={}){S.events.push({type,at:new Date().toISOString(),index:S.index,...extra});S.events=S.events.slice(-500);persist()}
 function fresh(){Object.assign(S,{index:0,attempts:0,items:shuffle(config.questions).map(q=>({...q,choices:shuffle(q.choices),missed:false,mastered:false})),start:new Date(),end:null,events:[],completed:false,submitting:false,submissionMessage:'',tabLeaves:0,copies:0,pastes:0,awayMs:0,awayStart:null})}
 function payload(status){return {action:'save',status,assignmentKey:config.assignmentKey,assignmentTitle:config.title,course:'Government',name:S.name,period:S.period,email:S.email,score:S.items.filter(q=>q.mastered).length,total:S.items.length,percent:Math.round(firstScore()/S.items.length*100),firstAttemptScore:firstScore(),attempts:S.attempts,startedAt:S.start?.toISOString()||'',completedAt:S.end?.toISOString()||'',elapsed:elapsed(),tabLeaves:S.tabLeaves,copies:S.copies,pastes:S.pastes,awaySeconds:Math.floor((S.awayMs+(S.awayStart?Date.now()-S.awayStart:0))/1000),events:S.events,gameState:saved()}}
 async function post(status){if(!GOV_SCRIPT_URL||!S.email)return false;try{await fetch(GOV_SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload(status))});return true}catch(e){console.warn('Backend request failed',e);return false}}
 function tick(){clearInterval(interval);interval=setInterval(()=>{const x=document.getElementById('runtimeStat');if(x)x.textContent=elapsed()},1000)}
 function stop(){clearInterval(interval);clearTimeout(advance);interval=null;advance=null}
 function header(){return `<header class="hero"><div><div class="eyebrow">LEGEND MASTERY SERIES • AMERICAN GOVERNMENT</div><h1>${esc(config.title)}</h1><p>${esc(config.subtitle)}</p><p>Your <strong>first response is recorded for this run’s score</strong>. Then use hints and corrections until every question is mastered.</p></div><div class="feature-pills"><span>First Attempt Preserved ✓</span><span>Corrections to Mastery ✓</span><span>Hints After Misses ✓</span><span>Saved Progress ✓</span></div></header>`}
 function shell(inner){return `<p><a class="back" href="../../">← Back to Government Hub</a></p>${inner}`}
 function finish(){
  if(!done())return;
  if(!S.completed){S.end=new Date();S.completed=true;log('finish');S.submissionMessage='Submission request sent. Ask your teacher to verify spreadsheet receipt.';post('submitted').then(ok=>{S.submissionMessage=ok?'Submission request sent. Spreadsheet receipt cannot be confirmed from this page.':'Could not send submission. Your completion is saved on this device.';persist();const el=document.getElementById('ticketStatus');if(el)el.textContent=S.submissionMessage})}
  stop();persist();
  const date=S.end?S.end.toLocaleString():'Not recorded';
  app.innerHTML=shell(header()+`<section class="completion"><div class="section-label">COMPLETION TICKET</div><h2>Assignment mastery complete</h2><h3>Completed by: ${esc(S.name)} • Period ${esc(S.period)}</h3><p><strong>${esc(config.title)}</strong></p><p>Mastery: ${S.items.length}/${S.items.length} • First-attempt score: ${firstScore()}/${S.items.length} • ${S.attempts} total attempts • ${elapsed()} elapsed.</p><p><strong>Completed:</strong> ${esc(date)}</p><p id="ticketStatus" role="status">${esc(S.submissionMessage||'Completion saved on this device.')}</p><div class="actions" style="justify-content:center"><button id="retrySubmit" class="secondary">Resend submission</button><button id="restart" class="secondary">Restart from Question 1</button></div></section>`);
  document.getElementById('retrySubmit').onclick=async()=>{const el=document.getElementById('ticketStatus');el.textContent='Sending submission request…';const ok=await post('submitted');el.textContent=ok?'Submission request sent; teacher spreadsheet receipt not confirmed.':'Could not send. Completion remains saved on this device.';S.submissionMessage=el.textContent;persist()};
  document.getElementById('restart').onclick=()=>{if(confirm('Start a new run? This clears your current run on this device.'))restart()};
 }
 function render(){
  if(!S.started){stop();app.innerHTML=shell(header()+`<section class="student-panel"><div class="section-label">STUDENT INFORMATION</div><h2>Your information and save controls</h2><p>Use the same school email to resume saved progress on this Chromebook.</p><div class="fields"><label>Full name<input id="studentName" autocomplete="name"></label><label>Class period<select id="period"><option value="">Choose</option>${[1,2,3,4,5,6,7,8].map(x=>`<option value="${x}">${x}</option>`).join('')}</select></label><label>School email<input id="email" type="email" autocomplete="email"></label></div><div class="actions"><button id="startBtn">Start / Continue</button><button id="loadBtn" class="secondary">Load saved work</button><button id="resetBtn" class="secondary">Reset saved run</button></div><p id="saveStatus" class="status"></p></section>`);
   const values=()=>({name:document.getElementById('studentName').value.trim(),period:document.getElementById('period').value,email:document.getElementById('email').value.trim().toLowerCase()});
   function enter(loadOnly){const v=values();if(!v.email||!/^\S+@\S+\.\S+$/.test(v.email)||(!loadOnly&&(!v.name||!v.period))){document.getElementById('saveStatus').textContent='Enter your full name, period, and valid school email.';return}const found=restore(v.email);if(loadOnly&&!found){document.getElementById('saveStatus').textContent='No saved run found on this device. Enter your name and period, then Start.';return}if(!found){fresh();S.name=v.name;S.period=v.period;S.email=v.email}else{S.name=S.name||v.name;S.period=S.period||v.period}S.started=true;log(found?'resume':'start');if(!found)post('in_progress');render();tick()}
   document.getElementById('startBtn').onclick=()=>enter(false);document.getElementById('loadBtn').onclick=()=>enter(true);
   document.getElementById('resetBtn').onclick=()=>{const e=values().email;if(e&&confirm('Delete the saved run on this Chromebook?')){localStorage.removeItem(key+'|'+e);document.getElementById('saveStatus').textContent='Local run cleared. Earlier teacher spreadsheet records are not deleted.'}};
   return
  }
  if(done()){finish();return}
  while(S.index<S.items.length&&S.items[S.index].mastered)S.index++;
  if(S.index>=S.items.length){finish();return}
  const q=S.items[S.index],first=S.items.slice(0,S.index).filter(x=>!x.missed).length;
  const link=/^https:\/\/(www\.)?(archives\.gov|constitution\.congress\.gov)\//i.test(q.source||'')?q.source:null;
  app.innerHTML=shell(header()+`<section class="student-panel compact"><div><div class="section-label">STUDENT INFORMATION</div><p>${esc(S.name)} • Period ${esc(S.period)} • ${esc(S.email)}</p></div><div class="actions"><button class="secondary" id="resetBtn">Reset Assignment</button></div></section><div class="workspace"><section class="question-panel"><div class="section-label">QUESTION</div><div class="stats"><div><strong>${S.index+1} / ${S.items.length}</strong><span>Progress</span></div><div><strong>${first} / ${S.index}</strong><span>First-Attempt Score</span></div><div><strong id="runtimeStat">${elapsed()}</strong><span>Runtime</span></div></div><div class="question-card"><h2>${esc(q.area)} • Question ${S.index+1}</h2><p class="prompt">${esc(q.stem)}</p><div class="choices">${q.choices.map((c,i)=>`<button type="button" class="choice" data-i="${i}"><span class="choice-letter">${'ABCD'[i]}.</span><span>${esc(c)}</span></button>`).join('')}</div><div id="feedback" class="feedback"></div><div class="source-box"><strong>SUPPORTING SOURCE</strong><p>${link?`<a class="source-link" href="${esc(link)}" target="_blank" rel="noopener noreferrer">Open source in a new tab ↗</a>`:'Source unavailable'}</p><p><strong>Where to look:</strong> ${esc(whereToLook(q))}</p><p class="source-note">Your worksheet stays open in this tab. Return here after reading.</p></div></div></section><aside class="side-panel"><div class="section-label">RULES</div><ul><li><strong>First attempt:</strong> Your first answer becomes your score.</li><li><strong>Mastery:</strong> If incorrect, use the hint and source to correct it.</li><li>Correct answers display an explanation for four seconds.</li></ul><div class="side-section"><div class="section-label">SAVED PROGRESS</div><p>Progress is saved on this Chromebook and a save request is sent to your teacher spreadsheet. Teacher receipt must be verified separately.</p></div></aside></div>`);
  document.querySelectorAll('.source-link').forEach(a=>a.addEventListener('click',()=>{persist();log('source_open',{url:a.href})}));
  document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>choose(b,Number(b.dataset.i)));
  document.getElementById('resetBtn').onclick=()=>{if(confirm('Restart at Question 1? This clears the current local run.'))restart()};
 }
 function choose(btn,i){if(advance)return;const q=S.items[S.index];if(q.mastered)return;S.attempts++;if(q.choices[i]!==q.answer){q.missed=true;btn.classList.add('wrong');const f=document.getElementById('feedback');f.className='feedback bad';f.innerHTML=`<strong>Not yet.</strong> ${esc(q.hint)}`;log('incorrect',{area:q.area});post('in_progress');return}
  q.mastered=true;btn.classList.add('correct');document.querySelectorAll('.choice').forEach(b=>b.disabled=true);const f=document.getElementById('feedback');f.className='feedback good';f.innerHTML=`<strong>Correct.</strong> ${esc(q.explain)}<span class="advance-note">Advancing to the next question…</span>`;log('correct',{area:q.area,firstTry:!q.missed});post('in_progress');advance=setTimeout(()=>{advance=null;S.index++;persist();render()},4000)}
 function restart(){stop();fresh();S.started=true;log('restart');post('in_progress');render();tick()}
 document.addEventListener('visibilitychange',()=>{if(!S.started||S.completed)return;if(document.hidden){S.tabLeaves++;S.awayStart=new Date();log('tab_leave')}else{if(S.awayStart)S.awayMs+=Date.now()-S.awayStart;S.awayStart=null;log('tab_return')}});
 document.addEventListener('copy',()=>{if(S.started&&!S.completed){S.copies++;log('copy')}});
 document.addEventListener('paste',()=>{if(S.started&&!S.completed){S.pastes++;log('paste')}});
 window.addEventListener('pagehide',persist);
 render();
}
