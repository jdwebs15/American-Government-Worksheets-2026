// Phase II engine shared by vocabulary and review worksheets.
const GOV_SCRIPT_URL='https://script.google.com/macros/s/AKfycbxENUBm5pd966tRn1g9R7HH0zSXcEI10LGLivzQzN0pn6b0ytZHJdV8HU9i0ihYtHJW/exec';
function launchMasteryGame(config){
 const app=document.getElementById('app'),key=config.assignmentKey+'::v2',review=/review/.test(config.assignmentKey);
 const S={started:false,index:0,attempts:0,items:[],start:null,end:null,timer:null,name:'',period:'',email:'',events:[],completed:false,pending:null};
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const elapsed=()=>{if(!S.start)return'00:00';let sec=Math.max(0,Math.floor(((S.end||new Date())-S.start)/1000));return`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`};
 function fresh(){S.items=shuffle(config.questions).map(q=>({...q,choices:shuffle(q.choices),missed:false,mastered:false}));S.index=0;S.attempts=0;S.start=new Date();S.end=null;S.completed=false;S.events=[];clearTimeout(S.pending);S.pending=null}
 function identity(){return{name:S.name,period:S.period,email:S.email}}
 function save(){if(!S.email)return;localStorage.setItem(key+'|'+S.email,JSON.stringify({...identity(),started:S.started,index:S.index,attempts:S.attempts,items:S.items,start:S.start?.toISOString(),end:S.end?.toISOString(),events:S.events,completed:S.completed}))}
 function restore(mail){try{let d=JSON.parse(localStorage.getItem(key+'|'+mail)||localStorage.getItem(key));if(!d||d.email!==mail||!Array.isArray(d.items)||d.items.length!==config.questions.length)return false;Object.assign(S,d,{start:d.start?new Date(d.start):null,end:d.end?new Date(d.end):null});return true}catch{return false}}
 function log(type,extra={}){S.events.push({type,at:new Date().toISOString(),index:S.index,...extra});S.events=S.events.slice(-500);save()}
 function post(status){if(!GOV_SCRIPT_URL)return;let first=S.items.filter(q=>q.mastered&&!q.missed).length,score=S.items.filter(q=>q.mastered).length,gameState={started:true,index:S.index,attempts:S.attempts,items:S.items,start:S.start?.toISOString(),end:S.end?.toISOString(),events:S.events,completed:S.completed};fetch(GOV_SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'save',status,assignmentKey:config.assignmentKey,assignmentTitle:config.title,course:'Government',...identity(),score,total:S.items.length,percent:Math.round(first/S.items.length*100),firstAttemptScore:first,attempts:S.attempts,startedAt:S.start?.toISOString(),completedAt:S.end?.toISOString()||'',elapsed:elapsed(),events:S.events,gameState})}).catch(()=>{})}
 function timer(){clearInterval(S.timer);S.timer=setInterval(()=>{let e=document.getElementById('clock');if(e)e.textContent=elapsed()},1000)}
 function launch(){let n=document.getElementById('name').value.trim(),p=document.getElementById('period').value,e=document.getElementById('email').value.trim().toLowerCase();if(!n||!p||!/^\S+@\S+\.\S+$/.test(e)){document.getElementById('status').textContent='Enter your name, period, and a valid school email.';return}S.name=n;S.period=p;S.email=e;S.started=true;if(!restore(e))fresh();log('start');post('in_progress');render();timer()}
 function resume(){let mail=document.getElementById('email').value.trim().toLowerCase();if(!mail){document.getElementById('status').textContent='Enter the same school email used when saving.';return}if(restore(mail)){render();timer();return}let status=document.getElementById('status');status.textContent='Looking for saved work…';let cb='loadGame_'+Date.now(),s=document.createElement('script');window[cb]=r=>{try{let p=r&&r.found&&r.payload;if(!p||!p.gameState){status.textContent='No saved run was found for that email.';return}let d=p.gameState;if(!Array.isArray(d.items)||d.items.length!==config.questions.length){status.textContent='Saved run uses a different question set. Start a new run.';return}Object.assign(S,d,{name:p.name||p.student?.name||'',period:p.period||p.student?.period||'',email:mail,start:new Date(d.start),end:d.end?new Date(d.end):null,started:true});save();render();timer()}finally{delete window[cb];s.remove()}};s.src=GOV_SCRIPT_URL+'?action=load&assignmentKey='+encodeURIComponent(config.assignmentKey)+'&email='+encodeURIComponent(mail)+'&callback='+encodeURIComponent(cb)+'&_='+Date.now();s.onerror=()=>{status.textContent='Could not retrieve teacher draft.';delete window[cb];s.remove()};document.body.appendChild(s)}
 function choose(btn,value){let q=S.items[S.index];if(q.mastered||btn.disabled)return;S.attempts++;if(value!==q.answer){q.missed=true;btn.classList.add('wrong');btn.disabled=true;document.getElementById('feedback').className='feedback show hint';document.getElementById('feedback').innerHTML=`<b>Hint</b>${esc(q.hint)}`;log('incorrect',{area:q.area});post('in_progress');return}q.mastered=true;btn.classList.add('correct');document.querySelectorAll('.choice').forEach(b=>b.disabled=true);document.getElementById('feedback').className='feedback show good';document.getElementById('feedback').innerHTML=`<b>Correct</b>${esc(q.explain)}`;log('correct',{area:q.area,firstTry:!q.missed});post('in_progress');S.pending=setTimeout(()=>{S.pending=null;S.index++;save();render()},4000)}
 function restart(){clearInterval(S.timer);clearTimeout(S.pending);S.pending=null;fresh();S.started=true;log('restart');post('in_progress');render();timer()}
 function finish(){clearTimeout(S.pending);S.pending=null;if(!S.completed){S.end=new Date();S.completed=true;log('finish');post('submitted')}clearInterval(S.timer);let first=S.items.filter(q=>!q.missed).length,pct=Math.round(first/S.items.length*100);app.innerHTML=`<a class="back" href="../../">← Back to Government Hub</a><section class="result"><div class="kicker">Mastery Ticket Earned</div><h1>${esc(config.title)}</h1><p class="sub">All questions corrected. Screenshot the complete ticket for Google Classroom.</p><div class="ticket"><h2>Completion Ticket • MASTERED</h2><div class="ticket-name">${esc(S.name)}</div><p>${esc(config.title)}</p><div class="ticket-grid"><div class="ticket-cell">Period<strong>${esc(S.period)}</strong></div><div class="ticket-cell">Mastery<strong>${S.items.length}/${S.items.length} (100%)</strong></div><div class="ticket-cell">Total Attempts<strong>${S.attempts}</strong></div><div class="ticket-cell">First-Try Accuracy<strong>${first}/${S.items.length} (${pct}%)</strong></div><div class="ticket-cell">Time<strong>${elapsed()}</strong></div><div class="ticket-cell">Completed<strong>${esc(S.end.toLocaleString())}</strong></div></div><p>School email: ${esc(S.email)}</p><p>Status: MASTERED • Submitted to teacher endpoint (delivery not independently verified)</p></div><button class="btn" id="restart">Restart Assignment</button></section>`;document.getElementById('restart').onclick=()=>{if(confirm('Restart this assignment? Your previous teacher record remains in the spreadsheet.'))restart()}}
function render(){if(S.completed){finish();return}if(!S.started){app.innerHTML=`<a class="back" href="../../">← Back to Government Hub</a><section class="hero"><div class="kicker">Legend Mastery Series • American Government</div><h1>${esc(config.title)}</h1><p class="sub">${esc(config.subtitle)}</p><div class="pills"><span class="pill">${config.questions.length} questions</span><span class="pill">Hint after a miss</span><span class="pill">Corrections allowed</span><span class="pill">First attempt recorded</span></div></section><section class="panel"><div class="identity"><label>Name<input id="name" autocomplete="name"></label><label>Period<select id="period"><option value="">Choose…</option>${[1,2,3,4,5,6,7,8].map(x=>`<option>${x}</option>`).join('')}</select></label><label>School email<input id="email" type="email" autocomplete="email"></label></div><button class="btn" id="start">Start / Continue</button> <button class="btn secondary" id="resume">Retrieve Saved Run</button><div class="status" id="status"></div></section>`;document.getElementById('start').onclick=launch;document.getElementById('resume').onclick=resume;return}if(S.index>=S.items.length){finish();return}let q=S.items[S.index],first=S.items.slice(0,S.index).filter(x=>!x.missed).length,acc=S.index?Math.round(first/S.index*100):100;app.innerHTML=`<a class="back" href="../../">← Back to Government Hub</a><section class="question"><div class="topline"><div><div class="area">${esc(q.area)}</div><b>Question ${S.index+1} of ${S.items.length}</b></div><div class="stats"><span class="stat">First try ${acc}%</span><span class="stat" id="clock">${elapsed()}</span></div></div><div class="progress"><div style="width:${S.index/S.items.length*100}%"></div></div><div class="stem">${esc(q.stem)}</div><div class="choices">${q.choices.map(c=>`<button class="choice" data-value="${esc(c)}">${esc(c)}</button>`).join('')}</div><div id="feedback" class="feedback"></div><button class="btn secondary" id="reset">Reset Assignment</button></section>`;document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>choose(b,b.dataset.value));document.getElementById('reset').onclick=()=>{if(confirm('Restart this assignment at Question 1? Earlier teacher records remain in the spreadsheet.'))restart()}}
 render();window.addEventListener('beforeunload',save);document.addEventListener('visibilitychange',()=>{if(S.started&&!S.completed)log(document.hidden?'tab_leave':'tab_return')});document.addEventListener('copy',()=>S.started&&!S.completed&&log('copy'));document.addEventListener('paste',()=>S.started&&!S.completed&&log('paste'));
}


const questions=[
 {
  "area": "CS 16",
  "stem": "Which definition best matches “separation of powers”?",
  "answer": "Government authority divided among three branches",
  "choices": [
   "Government authority divided among three branches",
   "Checks and balances",
   "Federalism",
   "Popular sovereignty"
  ],
  "hint": "Focus on the role or action described by “separation of powers” in Ohio and U.S. constitutional government.",
  "explain": "separation of powers: Government authority divided among three branches."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “checks and balances”?",
  "answer": "Each branch can limit powers of the other branches",
  "choices": [
   "Separation of powers",
   "Each branch can limit powers of the other branches",
   "Judicial elections",
   "Direct democracy"
  ],
  "hint": "Focus on the role or action described by “checks and balances” in Ohio and U.S. constitutional government.",
  "explain": "checks and balances: Each branch can limit powers of the other branches."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “limited government”?",
  "answer": "Government must obey constitutional and legal limits",
  "choices": [
   "Unlimited authority",
   "Popular election",
   "Government must obey constitutional and legal limits",
   "Majority rule"
  ],
  "hint": "Focus on the role or action described by “limited government” in Ohio and U.S. constitutional government.",
  "explain": "limited government: Government must obey constitutional and legal limits."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “popular sovereignty”?",
  "answer": "Government receives its authority from the people",
  "choices": [
   "Judicial review",
   "Federal appointment",
   "Legislative oversight",
   "Government receives its authority from the people"
  ],
  "hint": "Focus on the role or action described by “popular sovereignty” in Ohio and U.S. constitutional government.",
  "explain": "popular sovereignty: Government receives its authority from the people."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “Bill of Rights”?",
  "answer": "Constitutional protections for individual freedoms",
  "choices": [
   "Constitutional protections for individual freedoms",
   "A state budget",
   "A list of elected officials",
   "A court schedule"
  ],
  "hint": "Focus on the role or action described by “Bill of Rights” in Ohio and U.S. constitutional government.",
  "explain": "Bill of Rights: Constitutional protections for individual freedoms."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “federalism”?",
  "answer": "Power shared between national and state governments",
  "choices": [
   "Power held only by courts",
   "Power shared between national and state governments",
   "Power held only by cities",
   "Power held only by Congress"
  ],
  "hint": "Focus on the role or action described by “federalism” in Ohio and U.S. constitutional government.",
  "explain": "federalism: Power shared between national and state governments."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “U.S. Constitution”?",
  "answer": "The supreme governing document of the United States",
  "choices": [
   "A city ordinance",
   "A state court ruling",
   "The supreme governing document of the United States",
   "An Ohio election law"
  ],
  "hint": "Focus on the role or action described by “U.S. Constitution” in Ohio and U.S. constitutional government.",
  "explain": "U.S. Constitution: The supreme governing document of the United States."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “Ohio Constitution”?",
  "answer": "The fundamental law organizing Ohio government",
  "choices": [
   "A federal executive order",
   "A township policy",
   "A congressional rule",
   "The fundamental law organizing Ohio government"
  ],
  "hint": "Focus on the role or action described by “Ohio Constitution” in Ohio and U.S. constitutional government.",
  "explain": "Ohio Constitution: The fundamental law organizing Ohio government."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “legislative branch”?",
  "answer": "The branch that makes laws",
  "choices": [
   "The branch that makes laws",
   "The branch that hears cases",
   "The branch that enforces laws",
   "The branch that runs elections only"
  ],
  "hint": "Focus on the role or action described by “legislative branch” in Ohio and U.S. constitutional government.",
  "explain": "legislative branch: The branch that makes laws."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “executive branch”?",
  "answer": "The branch that carries out laws",
  "choices": [
   "The branch that writes court opinions",
   "The branch that carries out laws",
   "The branch that approves amendments alone",
   "The branch that sets jury verdicts"
  ],
  "hint": "Focus on the role or action described by “executive branch” in Ohio and U.S. constitutional government.",
  "explain": "executive branch: The branch that carries out laws."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “judicial branch”?",
  "answer": "The branch that interprets laws and resolves legal disputes",
  "choices": [
   "The branch that proposes budgets",
   "The branch that commands the legislature",
   "The branch that interprets laws and resolves legal disputes",
   "The branch that writes statutes"
  ],
  "hint": "Focus on the role or action described by “judicial branch” in Ohio and U.S. constitutional government.",
  "explain": "judicial branch: The branch that interprets laws and resolves legal disputes."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “initiative”?",
  "answer": "Ohio voters propose a law or constitutional amendment",
  "choices": [
   "Judges issue a court order",
   "The governor appoints a judge",
   "Legislators override a veto",
   "Ohio voters propose a law or constitutional amendment"
  ],
  "hint": "Focus on the role or action described by “initiative” in Ohio and U.S. constitutional government.",
  "explain": "initiative: Ohio voters propose a law or constitutional amendment."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “referendum”?",
  "answer": "Voters approve or reject a law through a ballot vote",
  "choices": [
   "Voters approve or reject a law through a ballot vote",
   "The Senate confirms a nominee",
   "A mayor issues an ordinance",
   "A court hears an appeal"
  ],
  "hint": "Focus on the role or action described by “referendum” in Ohio and U.S. constitutional government.",
  "explain": "referendum: Voters approve or reject a law through a ballot vote."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “direct democracy”?",
  "answer": "Voters decide public questions themselves",
  "choices": [
   "Only elected representatives vote",
   "Voters decide public questions themselves",
   "Judges select all public officials",
   "Federal agencies write local laws"
  ],
  "hint": "Focus on the role or action described by “direct democracy” in Ohio and U.S. constitutional government.",
  "explain": "direct democracy: Voters decide public questions themselves."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “elected judges”?",
  "answer": "Judges selected by voters in an election",
  "choices": [
   "Judges selected by the president",
   "Judges selected by juries",
   "Judges selected by voters in an election",
   "Judges selected by Congress alone"
  ],
  "hint": "Focus on the role or action described by “elected judges” in Ohio and U.S. constitutional government.",
  "explain": "elected judges: Judges selected by voters in an election."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “appointed federal judges”?",
  "answer": "Judges nominated by the president and confirmed by the Senate",
  "choices": [
   "Judges elected in Ohio counties",
   "Judges selected by state governors",
   "Judges chosen by popular referendum",
   "Judges nominated by the president and confirmed by the Senate"
  ],
  "hint": "Focus on the role or action described by “appointed federal judges” in Ohio and U.S. constitutional government.",
  "explain": "appointed federal judges: Judges nominated by the president and confirmed by the Senate."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “legislative term limits”?",
  "answer": "Rules restricting consecutive service in a legislative office",
  "choices": [
   "Rules restricting consecutive service in a legislative office",
   "Rules limiting how many bills can pass",
   "Rules limiting the length of court trials",
   "Rules limiting voter registration"
  ],
  "hint": "Focus on the role or action described by “legislative term limits” in Ohio and U.S. constitutional government.",
  "explain": "legislative term limits: Rules restricting consecutive service in a legislative office."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “1851 Ohio Constitution”?",
  "answer": "Ohio governing document that expanded elected offices and restricted state debt",
  "choices": [
   "The first U.S. Constitution",
   "Ohio governing document that expanded elected offices and restricted state debt",
   "A federal amendment on voting",
   "A local charter adopted in 2000"
  ],
  "hint": "Focus on the role or action described by “1851 Ohio Constitution” in Ohio and U.S. constitutional government.",
  "explain": "1851 Ohio Constitution: Ohio governing document that expanded elected offices and restricted state debt."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “state debt limits”?",
  "answer": "Constitutional restrictions on how much debt Ohio may incur",
  "choices": [
   "Limits on the number of state employees",
   "Rules about judicial terms",
   "Constitutional restrictions on how much debt Ohio may incur",
   "Limits on how often citizens vote"
  ],
  "hint": "Focus on the role or action described by “state debt limits” in Ohio and U.S. constitutional government.",
  "explain": "state debt limits: Constitutional restrictions on how much debt Ohio may incur."
 },
 {
  "area": "CS 16",
  "stem": "Which definition best matches “constitutional amendment”?",
  "answer": "A formal change to a constitution",
  "choices": [
   "A temporary executive memo",
   "A court witness statement",
   "An ordinary school policy",
   "A formal change to a constitution"
  ],
  "hint": "Focus on the role or action described by “constitutional amendment” in Ohio and U.S. constitutional government.",
  "explain": "constitutional amendment: A formal change to a constitution."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “state government”?",
  "answer": "Government responsible for statewide Ohio matters",
  "choices": [
   "Government responsible for statewide Ohio matters",
   "Government serving one neighborhood",
   "Government operating only federal agencies",
   "Government limited to one school"
  ],
  "hint": "Focus on the role or action described by “state government” in state and local civic life.",
  "explain": "state government: Government responsible for statewide Ohio matters."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “local government”?",
  "answer": "County, municipal, township, or other community-level government",
  "choices": [
   "The U.S. Supreme Court",
   "County, municipal, township, or other community-level government",
   "The federal cabinet",
   "Congress and the president"
  ],
  "hint": "Focus on the role or action described by “local government” in state and local civic life.",
  "explain": "local government: County, municipal, township, or other community-level government."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “county government”?",
  "answer": "Local government serving residents across a county",
  "choices": [
   "A federal agency covering all states",
   "A branch of the United Nations",
   "Local government serving residents across a county",
   "A national political party"
  ],
  "hint": "Focus on the role or action described by “county government” in state and local civic life.",
  "explain": "county government: Local government serving residents across a county."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “municipal government”?",
  "answer": "Government of a city or village",
  "choices": [
   "Government of the entire nation",
   "Government of every Ohio county",
   "Government of the federal courts",
   "Government of a city or village"
  ],
  "hint": "Focus on the role or action described by “municipal government” in state and local civic life.",
  "explain": "municipal government: Government of a city or village."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “township government”?",
  "answer": "Local government serving an Ohio township",
  "choices": [
   "Local government serving an Ohio township",
   "The U.S. Senate",
   "The Ohio Supreme Court",
   "A national executive department"
  ],
  "hint": "Focus on the role or action described by “township government” in state and local civic life.",
  "explain": "township government: Local government serving an Ohio township."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “school district”?",
  "answer": "Local public organization that operates public schools",
  "choices": [
   "A state criminal court",
   "Local public organization that operates public schools",
   "A federal legislative district",
   "A county military unit"
  ],
  "hint": "Focus on the role or action described by “school district” in state and local civic life.",
  "explain": "school district: Local public organization that operates public schools."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “candidate”?",
  "answer": "A person seeking election to public office",
  "choices": [
   "A person serving on a jury",
   "A person filing a court appeal",
   "A person seeking election to public office",
   "A person signing a contract"
  ],
  "hint": "Focus on the role or action described by “candidate” in state and local civic life.",
  "explain": "candidate: A person seeking election to public office."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “informed voting”?",
  "answer": "Learning about candidates and issues before voting",
  "choices": [
   "Voting without reviewing choices",
   "Allowing a neighbor to vote for you",
   "Voting only on national offices",
   "Learning about candidates and issues before voting"
  ],
  "hint": "Focus on the role or action described by “informed voting” in state and local civic life.",
  "explain": "informed voting: Learning about candidates and issues before voting."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “petition”?",
  "answer": "A formal request supported by citizens or signatures",
  "choices": [
   "A formal request supported by citizens or signatures",
   "A court punishment",
   "A government tax refund",
   "A judicial appointment"
  ],
  "hint": "Focus on the role or action described by “petition” in state and local civic life.",
  "explain": "petition: A formal request supported by citizens or signatures."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “ballot access”?",
  "answer": "Meeting requirements to place a candidate or issue before voters",
  "choices": [
   "Obtaining a government job",
   "Meeting requirements to place a candidate or issue before voters",
   "Getting a court transcript",
   "Receiving a property deed"
  ],
  "hint": "Focus on the role or action described by “ballot access” in state and local civic life.",
  "explain": "ballot access: Meeting requirements to place a candidate or issue before voters."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “public meeting”?",
  "answer": "A government gathering open for citizens to observe or participate as permitted",
  "choices": [
   "A private family event",
   "A closed campaign fundraiser",
   "A government gathering open for citizens to observe or participate as permitted",
   "A federal jury deliberation"
  ],
  "hint": "Focus on the role or action described by “public meeting” in state and local civic life.",
  "explain": "public meeting: A government gathering open for citizens to observe or participate as permitted."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “public comment”?",
  "answer": "Citizens sharing views during an allowed portion of a government meeting",
  "choices": [
   "A judge issuing a sentence",
   "A legislator casting a vote",
   "A candidate filing taxes",
   "Citizens sharing views during an allowed portion of a government meeting"
  ],
  "hint": "Focus on the role or action described by “public comment” in state and local civic life.",
  "explain": "public comment: Citizens sharing views during an allowed portion of a government meeting."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “civic responsibility”?",
  "answer": "An action citizens should take to support their community and government",
  "choices": [
   "An action citizens should take to support their community and government",
   "A power reserved for the president",
   "A right to ignore all laws",
   "A requirement to hold public office"
  ],
  "hint": "Focus on the role or action described by “civic responsibility” in state and local civic life.",
  "explain": "civic responsibility: An action citizens should take to support their community and government."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “civic participation”?",
  "answer": "Taking part in public life to influence or improve the community",
  "choices": [
   "Avoiding all public decisions",
   "Taking part in public life to influence or improve the community",
   "Leaving all choices to courts",
   "Serving only in the military"
  ],
  "hint": "Focus on the role or action described by “civic participation” in state and local civic life.",
  "explain": "civic participation: Taking part in public life to influence or improve the community."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “volunteering”?",
  "answer": "Giving time and effort to help others without required pay",
  "choices": [
   "Paying a fine for an offense",
   "Receiving an elected salary",
   "Giving time and effort to help others without required pay",
   "Collecting state taxes"
  ],
  "hint": "Focus on the role or action described by “volunteering” in state and local civic life.",
  "explain": "volunteering: Giving time and effort to help others without required pay."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “community watch”?",
  "answer": "Neighbors cooperating to observe and report local safety concerns",
  "choices": [
   "A state appeals court",
   "A federal military branch",
   "A city tax committee",
   "Neighbors cooperating to observe and report local safety concerns"
  ],
  "hint": "Focus on the role or action described by “community watch” in state and local civic life.",
  "explain": "community watch: Neighbors cooperating to observe and report local safety concerns."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “volunteer fire department”?",
  "answer": "Emergency fire service staffed partly or fully by trained volunteers",
  "choices": [
   "Emergency fire service staffed partly or fully by trained volunteers",
   "A federal police agency",
   "A state election office",
   "A legislative committee"
  ],
  "hint": "Focus on the role or action described by “volunteer fire department” in state and local civic life.",
  "explain": "volunteer fire department: Emergency fire service staffed partly or fully by trained volunteers."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “Ohio National Guard”?",
  "answer": "Military force with state and federal responsibilities",
  "choices": [
   "An elected city council",
   "Military force with state and federal responsibilities",
   "A federal appeals court",
   "A local voting board"
  ],
  "hint": "Focus on the role or action described by “Ohio National Guard” in state and local civic life.",
  "explain": "Ohio National Guard: Military force with state and federal responsibilities."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “local public office”?",
  "answer": "An official position serving a city, village, township, or county",
  "choices": [
   "A lifetime seat in Congress",
   "A position in a foreign embassy",
   "An official position serving a city, village, township, or county",
   "A federal cabinet position"
  ],
  "hint": "Focus on the role or action described by “local public office” in state and local civic life.",
  "explain": "local public office: An official position serving a city, village, township, or county."
 },
 {
  "area": "CS 17",
  "stem": "Which definition best matches “community service”?",
  "answer": "Work performed to benefit a community or its residents",
  "choices": [
   "A vote in the U.S. Senate",
   "An appeal to a federal court",
   "A constitutional veto",
   "Work performed to benefit a community or its residents"
  ],
  "hint": "Focus on the role or action described by “community service” in state and local civic life.",
  "explain": "community service: Work performed to benefit a community or its residents."
 }
];
launchMasteryGame({title:"CS 16–17 Ohio Government and Citizenship Vocabulary",subtitle:"Compare the Ohio and U.S. Constitutions and examine how citizens assist state and local government.",assignmentKey:"gov-cs16-17-vocabulary-2026-v1",questions,linger:4000});
