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

// Sources selected by the concept being assessed, with specific reading guidance.
function sourceGuide(q){
 const t=(q.stem+' '+q.answer+' '+q.area).toLowerCase();
 if(/naturaliz|citizenship|citizen|14th amendment|birthright|immigra|oath/.test(t))return {url:'https://www.uscis.gov/citizenship/learn-about-citizenship',where:'Citizenship Resource Center: eligibility, citizenship by birth, naturalization, and civic responsibilities.'};
 if(/federal judge|congress|u\.s\. constitution|federalism|supremacy|national government|federal government/.test(t))return {url:'https://constitution.congress.gov/browse/',where:'U.S. Constitution: Articles I–III, Article VI, and the Fourteenth Amendment; compare federal and state powers.'};
 if(/court|judg|appeal|judicial|trial/.test(t))return {url:'https://www.supremecourt.ohio.gov/courts/judicial-system/',where:'Ohio Judicial System: trial courts, district courts of appeals, and the Supreme Court of Ohio.'};
 if(/1803|1851|debt|constitution|governor|legislat|amend|initiative|referendum|veto|election|term limit|state government|branch|separation|check|popular sovereignty/.test(t))return {url:'https://codes.ohio.gov/ohio-constitution',where:'Ohio Constitution: Articles II–IV (branches), Article XVI (amendments), and relevant limits on state government; compare 1803 and 1851 changes.'};
 return {url:'https://codes.ohio.gov/ohio-constitution',where:'Ohio Constitution: use the relevant article to connect the civic principle to its application.'};
}
 function log(type,extra={}){S.events.push({type,at:new Date().toISOString(),index:S.index,...extra});S.events=S.events.slice(-500);save()}
 function post(status){if(!GOV_SCRIPT_URL)return;let first=S.items.filter(q=>q.mastered&&!q.missed).length,score=S.items.filter(q=>q.mastered).length,gameState={started:true,index:S.index,attempts:S.attempts,items:S.items,start:S.start?.toISOString(),end:S.end?.toISOString(),events:S.events,completed:S.completed};fetch(GOV_SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'save',status,assignmentKey:config.assignmentKey,assignmentTitle:config.title,course:'Government',...identity(),score,total:S.items.length,percent:Math.round(first/S.items.length*100),firstAttemptScore:first,attempts:S.attempts,startedAt:S.start?.toISOString(),completedAt:S.end?.toISOString()||'',elapsed:elapsed(),events:S.events,gameState})}).catch(()=>{})}
 function timer(){clearInterval(S.timer);S.timer=setInterval(()=>{let e=document.getElementById('clock');if(e)e.textContent=elapsed()},1000)}
 function launch(){let n=document.getElementById('name').value.trim(),p=document.getElementById('period').value,e=document.getElementById('email').value.trim().toLowerCase();if(!n||!p||!/^\S+@\S+\.\S+$/.test(e)){document.getElementById('status').textContent='Enter your name, period, and a valid school email.';return}S.name=n;S.period=p;S.email=e;S.started=true;if(!restore(e))fresh();log('start');post('in_progress');render();timer()}
 function resume(){let mail=document.getElementById('email').value.trim().toLowerCase();if(!mail){document.getElementById('status').textContent='Enter the same school email used when saving.';return}if(restore(mail)){render();timer();return}let status=document.getElementById('status');status.textContent='Looking for saved work…';let cb='loadGame_'+Date.now(),s=document.createElement('script');window[cb]=r=>{try{let p=r&&r.found&&r.payload;if(!p||!p.gameState){status.textContent='No saved run was found for that email.';return}let d=p.gameState;if(!Array.isArray(d.items)||d.items.length!==config.questions.length){status.textContent='Saved run uses a different question set. Start a new run.';return}Object.assign(S,d,{name:p.name||p.student?.name||'',period:p.period||p.student?.period||'',email:mail,start:new Date(d.start),end:d.end?new Date(d.end):null,started:true});save();render();timer()}finally{delete window[cb];s.remove()}};s.src=GOV_SCRIPT_URL+'?action=load&assignmentKey='+encodeURIComponent(config.assignmentKey)+'&email='+encodeURIComponent(mail)+'&callback='+encodeURIComponent(cb)+'&_='+Date.now();s.onerror=()=>{status.textContent='Could not retrieve teacher draft.';delete window[cb];s.remove()};document.body.appendChild(s)}
 function choose(btn,value){let q=S.items[S.index];if(q.mastered||btn.disabled)return;S.attempts++;if(value!==q.answer){q.missed=true;btn.classList.add('wrong');btn.disabled=true;document.getElementById('feedback').className='feedback bad';document.getElementById('feedback').innerHTML=`<strong>Not yet — try again.</strong>${esc(q.hint)}`;log('incorrect',{area:q.area});post('in_progress');return}q.mastered=true;btn.classList.add('correct');document.querySelectorAll('.choice').forEach(b=>b.disabled=true);document.getElementById('feedback').className='feedback good';document.getElementById('feedback').innerHTML=`<strong>✓ Correct!</strong>${esc(q.explain)}`;log('correct',{area:q.area,firstTry:!q.missed});post('in_progress');S.pending=setTimeout(()=>{S.pending=null;S.index++;save();render()},4000)}
 function restart(){clearInterval(S.timer);clearTimeout(S.pending);S.pending=null;fresh();S.started=true;log('restart');post('in_progress');render();timer()}
 function finish(){clearInterval(S.timer);if(!S.completed){S.end=new Date();S.completed=true;log('finish');post('submitted')}let first=S.items.filter(q=>q.mastered&&!q.missed).length,pct=Math.round(first/S.items.length*100);app.innerHTML=`<a class="back" href="../../">← Back to Government Hub</a><section class="completion"><div class="section-label">COMPLETION TICKET</div><h2>100% MASTERY COMPLETE</h2><div class="ticket-name">${esc(S.name)} • Period ${esc(S.period)}</div><p class="ticket-title">${esc(config.title)}</p><div class="ticket-grid"><div class="ticket-cell"><strong>${S.items.length}/${S.items.length}</strong><span>Questions Mastered</span></div><div class="ticket-cell"><strong>100%</strong><span>Mastery</span></div><div class="ticket-cell important"><strong>${S.attempts}</strong><span>TOTAL ATTEMPTS</span></div><div class="ticket-cell"><strong>${S.attempts-S.items.length}</strong><span>Extra Attempts</span></div><div class="ticket-cell"><strong>${pct}%</strong><span>First-Try Accuracy (${first}/${S.items.length})</span></div><div class="ticket-cell"><strong>${elapsed()}</strong><span>Elapsed Time</span></div></div><p>School email: ${esc(S.email)}</p><p>Completed: ${esc(S.end.toLocaleString())}</p><p>Submitted to teacher endpoint (receipt unverified).</p><p class="small">Screenshot this ticket for Google Classroom.</p><div class="actions center"><button id="restart" class="secondary">Restart assignment</button></div></section>`;document.getElementById('restart').onclick=()=>{if(confirm('Restart this assignment? Previous teacher records remain.'))restart()}}
 function render(){if(S.completed){finish();return}if(!S.started){app.innerHTML=`<a class="back" href="../../">← Back to Government Hub</a><header class="hero"><div><div class="eyebrow">LEGEND MASTERY SERIES • AMERICAN GOVERNMENT</div><h1>${esc(config.title)}</h1><p>${esc(config.subtitle)}</p><p>Use the linked sources to master all 40 questions. Every incorrect attempt remains in your total.</p></div><div class="feature-pills"><span>40 Questions</span><span>100% Mastery</span><span>Hints</span><span>Saved Progress</span></div></header><section class="student-panel"><div class="section-label">STUDENT INFORMATION</div><h2>Enter your information to begin</h2><div class="fields"><label>Full name<input id="name" autocomplete="name"></label><label>Class period<select id="period"><option value="">Choose</option>${[1,2,3,4,5,6,7,8].map(x=>`<option>${x}</option>`).join('')}</select></label><label>School email<input id="email" type="email" autocomplete="email"></label></div><div class="actions"><button id="start">Start / Continue</button><button id="resume" class="secondary">Load previous work</button></div><p id="status" role="status"></p></section>`;document.getElementById('start').onclick=launch;document.getElementById('resume').onclick=resume;return}if(S.index>=S.items.length){finish();return}let q=S.items[S.index],first=S.items.slice(0,S.index).filter(x=>!x.missed).length,acc=S.index?Math.round(first/S.index*100):100;app.innerHTML=`<a class="back" href="../../">← Back to Government Hub</a><header class="hero"><div><div class="eyebrow">LEGEND MASTERY SERIES • AMERICAN GOVERNMENT</div><h1>${esc(config.title)}</h1><p>${esc(config.subtitle)}</p></div><div class="feature-pills"><span>40 Questions</span><span>100% Mastery</span><span>Hints</span><span>Saved Progress</span></div></header><div class="workspace"><section class="question-panel"><div class="section-label">QUESTION</div><div class="stats"><div><strong>${S.index} / ${S.items.length}</strong><span>Mastered</span></div><div><strong>${S.attempts}</strong><span>Total Attempts</span></div><div><strong>${acc}%</strong><span>First-Try Accuracy</span></div><div><strong id="clock">${elapsed()}</strong><span>Elapsed Time</span></div></div><div id="questionCard"><h2>${esc(q.area)} • Question ${S.index+1} of ${S.items.length}</h2><p class="prompt">${esc(q.stem)}</p><div class="choices">${q.choices.map((c,i)=>`<button class="choice" data-value="${esc(c)}"><span class="choice-letter">${'ABCD'[i]}.</span><span>${esc(c)}</span></button>`).join('')}</div><div id="feedback" class="feedback"></div><div class="source-box"><a href="${esc(sourceGuide(q).url)}" target="_blank" rel="noopener noreferrer">Open supporting source ↗</a><p><strong>Where to look:</strong> ${esc(sourceGuide(q).where)}</p></div></div><div class="actions"><button class="secondary" id="reset">Restart assignment</button></div></section><aside class="side-panel"><div class="section-label">RULES</div><p>Master every question to finish. Wrong answers count toward total attempts. Use the source link and hint to retry.</p><div class="section-label">WHAT THIS PRACTICES</div><p>${esc(config.subtitle)}</p></aside></div>`;document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>choose(b,b.dataset.value));document.getElementById('reset').onclick=()=>{if(confirm('Restart this assignment? Previous teacher records remain.'))restart()}}
 render();window.addEventListener('beforeunload',save);document.addEventListener('visibilitychange',()=>{if(S.started&&!S.completed)log(document.hidden?'tab_leave':'tab_return')});document.addEventListener('copy',()=>S.started&&!S.completed&&log('copy'));document.addEventListener('paste',()=>S.started&&!S.completed&&log('paste'));
}


const questions=[
  {
    "area": "CS 16",
    "stem": "Which definition best matches “separation of powers”?",
    "answer": "Government authority divided among three branches",
    "choices": [
      "Government authority divided among three branches",
      "Each branch can limit the actions of other branches",
      "National and state governments divide public powers",
      "Voters give government its authority through elections"
    ],
    "hint": "Focus on the role or action described by “separation of powers” in Ohio and U.S. constitutional government.",
    "explain": "separation of powers: Government authority divided among three branches."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “checks and balances”?",
    "answer": "Each branch can limit powers of the other branches",
    "choices": [
      "Each branch can limit powers of the other branches",
      "Each branch has a separate set of assigned duties",
      "National and state governments share governing powers",
      "Voters select officials to represent their interests"
    ],
    "hint": "Focus on the role or action described by “checks and balances” in Ohio and U.S. constitutional government.",
    "explain": "checks and balances: Each branch can limit powers of the other branches."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “limited government”?",
    "answer": "Government must obey constitutional and legal limits",
    "choices": [
      "Government must obey constitutional and legal limits",
      "Government officials may act without legal restrictions",
      "Government powers belong exclusively to local councils",
      "Government decisions require unanimous public approval"
    ],
    "hint": "Focus on the role or action described by “limited government” in Ohio and U.S. constitutional government.",
    "explain": "limited government: Government must obey constitutional and legal limits."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “popular sovereignty”?",
    "answer": "Government receives its authority from the people",
    "choices": [
      "Government receives its authority from the people",
      "Government authority rests with appointed federal judges",
      "Government authority comes from military leadership",
      "Government authority belongs to the legislative branch"
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
      "A collection of rules for conducting state elections",
      "A collection of procedures for amending budgets",
      "A collection of powers assigned to county officials"
    ],
    "hint": "Focus on the role or action described by “Bill of Rights” in Ohio and U.S. constitutional government.",
    "explain": "Bill of Rights: Constitutional protections for individual freedoms."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “federalism”?",
    "answer": "Power shared between national and state governments",
    "choices": [
      "Power shared between national and state governments",
      "Authority is divided between legislative and executive branches",
      "Authority is divided among elected and appointed judges",
      "Authority is divided between counties and townships only"
    ],
    "hint": "Focus on the role or action described by “federalism” in Ohio and U.S. constitutional government.",
    "explain": "federalism: Power shared between national and state governments."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “U.S. Constitution”?",
    "answer": "The supreme governing document of the United States",
    "choices": [
      "The supreme governing document of the United States",
      "The governing charter for Ohio counties and townships",
      "The set of regulations adopted by federal agencies",
      "The collection of rulings issued by federal courts"
    ],
    "hint": "Focus on the role or action described by “U.S. Constitution” in Ohio and U.S. constitutional government.",
    "explain": "U.S. Constitution: The supreme governing document of the United States."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “Ohio Constitution”?",
    "answer": "The fundamental law organizing Ohio government",
    "choices": [
      "The fundamental law organizing Ohio government",
      "The governing charter for the entire United States",
      "The federal law that establishes congressional districts",
      "The collection of decisions issued by Ohio courts"
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
      "The branch that reviews whether laws are constitutional",
      "The branch that administers and enforces enacted laws",
      "The branch that oversees statewide voting procedures"
    ],
    "hint": "Focus on the role or action described by “legislative branch” in Ohio and U.S. constitutional government.",
    "explain": "legislative branch: The branch that makes laws."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “executive branch”?",
    "answer": "The branch that carries out laws",
    "choices": [
      "The branch that carries out laws",
      "The branch that interprets laws in legal disputes",
      "The branch that writes and approves proposed laws",
      "The branch that organizes public election campaigns"
    ],
    "hint": "Focus on the role or action described by “executive branch” in Ohio and U.S. constitutional government.",
    "explain": "executive branch: The branch that carries out laws."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “judicial branch”?",
    "answer": "The branch that interprets laws and resolves legal disputes",
    "choices": [
      "The branch that interprets laws and resolves legal disputes",
      "The branch that administers laws passed by legislators under Ohio law",
      "The branch that drafts bills for legislative consideration",
      "The branch that supervises statewide election procedures"
    ],
    "hint": "Focus on the role or action described by “judicial branch” in Ohio and U.S. constitutional government.",
    "explain": "judicial branch: The branch that interprets laws and resolves legal disputes."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “initiative”?",
    "answer": "Ohio voters propose a law or constitutional amendment",
    "choices": [
      "Ohio voters propose a law or constitutional amendment",
      "Ohio voters approve or reject an existing state law under Ohio law",
      "Ohio judges decide whether a law is constitutional",
      "Ohio lawmakers propose bills for legislative debate"
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
      "Voters propose a new law or constitutional amendment",
      "Legislators approve a governor’s executive appointment",
      "Judges decide whether an election law is valid"
    ],
    "hint": "Focus on the role or action described by “referendum” in Ohio and U.S. constitutional government.",
    "explain": "referendum: Voters approve or reject a law through a ballot vote."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “direct democracy”?",
    "answer": "Voters decide public questions themselves",
    "choices": [
      "Voters decide public questions themselves",
      "Elected officials vote on behalf of their constituents",
      "Judges decide disputes through the state court system",
      "State agencies enforce laws passed by legislators"
    ],
    "hint": "Focus on the role or action described by “direct democracy” in Ohio and U.S. constitutional government.",
    "explain": "direct democracy: Voters decide public questions themselves."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “elected judges”?",
    "answer": "Judges selected by voters in an election",
    "choices": [
      "Judges selected by voters in an election",
      "Judges selected by appointment of the state governor",
      "Judges selected through nomination by the president",
      "Judges selected through confirmation by legislators"
    ],
    "hint": "Focus on the role or action described by “elected judges” in Ohio and U.S. constitutional government.",
    "explain": "elected judges: Judges selected by voters in an election."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “appointed federal judges”?",
    "answer": "Judges nominated by the president and confirmed by the Senate",
    "choices": [
      "Judges nominated by the president and confirmed by the Senate",
      "Judges elected by voters in statewide judicial races under Ohio law",
      "Judges appointed by a governor and approved by courts",
      "Judges nominated by state lawmakers for local courts"
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
      "Rules restricting the number of bills lawmakers introduce under Ohio law",
      "Rules restricting how often statewide elections occur",
      "Rules restricting the total number of legislative seats"
    ],
    "hint": "Focus on the role or action described by “legislative term limits” in Ohio and U.S. constitutional government.",
    "explain": "legislative term limits: Rules restricting consecutive service in a legislative office."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “1851 Ohio Constitution”?",
    "answer": "Ohio governing document that expanded elected offices and restricted state debt",
    "choices": [
      "Ohio governing document that expanded elected offices and restricted state debt",
      "Ohio governing document establishing its first state courts in state and local government",
      "Ohio governing document creating a federal court system",
      "Ohio governing document replacing the U.S. Constitution"
    ],
    "hint": "Focus on the role or action described by “1851 Ohio Constitution” in Ohio and U.S. constitutional government.",
    "explain": "1851 Ohio Constitution: Ohio governing document that expanded elected offices and restricted state debt."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “state debt limits”?",
    "answer": "Constitutional restrictions on how much debt Ohio may incur",
    "choices": [
      "Constitutional restrictions on how much debt Ohio may incur",
      "Constitutional restrictions on the number of state judges under Ohio law",
      "Constitutional restrictions on terms served by lawmakers",
      "Constitutional restrictions on county election schedules"
    ],
    "hint": "Focus on the role or action described by “state debt limits” in Ohio and U.S. constitutional government.",
    "explain": "state debt limits: Constitutional restrictions on how much debt Ohio may incur."
  },
  {
    "area": "CS 16",
    "stem": "Which definition best matches “constitutional amendment”?",
    "answer": "A formal change to a constitution",
    "choices": [
      "A formal change to a constitution",
      "A proposed change to an ordinary state administrative rule",
      "A formal decision issued by an appellate court judge",
      "A new statute approved by a state legislative majority"
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
      "Government responsible for matters affecting one township",
      "Government responsible for matters affecting the nation",
      "Government responsible for matters affecting one city"
    ],
    "hint": "Focus on the role or action described by “state government” in state and local civic life.",
    "explain": "state government: Government responsible for statewide Ohio matters."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “local government”?",
    "answer": "County, municipal, township, or other community-level government",
    "choices": [
      "County, municipal, township, or other community-level government",
      "National government agencies operating across all states under Ohio law",
      "State government branches overseeing the entire state",
      "Federal courts that hear disputes involving local officials"
    ],
    "hint": "Focus on the role or action described by “local government” in state and local civic life.",
    "explain": "local government: County, municipal, township, or other community-level government."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “county government”?",
    "answer": "Local government serving residents across a county",
    "choices": [
      "Local government serving residents across a county",
      "Local government responsible for a city or village",
      "Local government responsible for a township only",
      "State government responsible for all Ohio residents"
    ],
    "hint": "Focus on the role or action described by “county government” in state and local civic life.",
    "explain": "county government: Local government serving residents across a county."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “municipal government”?",
    "answer": "Government of a city or village",
    "choices": [
      "Government of a city or village",
      "Government responsible for an entire Ohio county",
      "Government responsible for the whole state of Ohio",
      "Government responsible for a federal judicial district"
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
      "Local government serving residents of an Ohio county",
      "Local government serving residents of an Ohio city",
      "Local government serving residents of an entire state"
    ],
    "hint": "Focus on the role or action described by “township government” in state and local civic life.",
    "explain": "township government: Local government serving an Ohio township."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “school district”?",
    "answer": "Local public organization that operates public schools",
    "choices": [
      "Local public organization that operates public schools",
      "Local government organization that oversees city police",
      "Local public organization that manages county elections",
      "Local public organization that operates county courts"
    ],
    "hint": "Focus on the role or action described by “school district” in state and local civic life.",
    "explain": "school district: Local public organization that operates public schools."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “candidate”?",
    "answer": "A person seeking election to public office",
    "choices": [
      "A person seeking election to public office",
      "A person appointed to interpret state constitutional law",
      "A person authorized to administer public elections",
      "A person selected to oversee legislative committees"
    ],
    "hint": "Focus on the role or action described by “candidate” in state and local civic life.",
    "explain": "candidate: A person seeking election to public office."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “informed voting”?",
    "answer": "Learning about candidates and issues before voting",
    "choices": [
      "Learning about candidates and issues before voting",
      "Following candidates without examining policy positions",
      "Choosing candidates based only on campaign slogans",
      "Casting a ballot without learning about public issues"
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
      "A formal ruling delivered by a judge after a trial under Ohio law",
      "A formal law passed by a state legislative body",
      "A formal notice issued by a state executive agency"
    ],
    "hint": "Focus on the role or action described by “petition” in state and local civic life.",
    "explain": "petition: A formal request supported by citizens or signatures."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “ballot access”?",
    "answer": "Meeting requirements to place a candidate or issue before voters",
    "choices": [
      "Meeting requirements to place a candidate or issue before voters",
      "Meeting requirements to become a registered voter in state and local government",
      "Meeting requirements to serve as an elected judge",
      "Meeting requirements to introduce legislation in Ohio"
    ],
    "hint": "Focus on the role or action described by “ballot access” in state and local civic life.",
    "explain": "ballot access: Meeting requirements to place a candidate or issue before voters."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “public meeting”?",
    "answer": "A government gathering open for citizens to observe or participate as permitted",
    "choices": [
      "A government gathering open for citizens to observe or participate as permitted",
      "A private meeting of elected officials and party leaders in state and local government",
      "A legislative committee meeting closed to the public",
      "A campaign event organized by a political candidate"
    ],
    "hint": "Focus on the role or action described by “public meeting” in state and local civic life.",
    "explain": "public meeting: A government gathering open for citizens to observe or participate as permitted."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “public comment”?",
    "answer": "Citizens sharing views during an allowed portion of a government meeting",
    "choices": [
      "Citizens sharing views during an allowed portion of a government meeting",
      "Citizens submitting a ballot during a general election in state and local government",
      "Citizens filing legal appeals in a state trial court",
      "Citizens volunteering to administer local elections"
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
      "A legal power reserved exclusively for elected officials in state and local government",
      "A constitutional authority held by the judicial branch",
      "A formal requirement to serve in the state legislature"
    ],
    "hint": "Focus on the role or action described by “civic responsibility” in state and local civic life.",
    "explain": "civic responsibility: An action citizens should take to support their community and government."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “civic participation”?",
    "answer": "Taking part in public life to influence or improve the community",
    "choices": [
      "Taking part in public life to influence or improve the community",
      "Taking part in court proceedings as an appointed judge under Ohio law",
      "Carrying out laws as a full-time state agency employee",
      "Making decisions without considering community concerns"
    ],
    "hint": "Focus on the role or action described by “civic participation” in state and local civic life.",
    "explain": "civic participation: Taking part in public life to influence or improve the community."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “volunteering”?",
    "answer": "Giving time and effort to help others without required pay",
    "choices": [
      "Giving time and effort to help others without required pay",
      "Receiving payment for a government service contract under Ohio law",
      "Completing court-ordered work as a legal punishment",
      "Working in public office for an elected salary"
    ],
    "hint": "Focus on the role or action described by “volunteering” in state and local civic life.",
    "explain": "volunteering: Giving time and effort to help others without required pay."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “community watch”?",
    "answer": "Neighbors cooperating to observe and report local safety concerns",
    "choices": [
      "Neighbors cooperating to observe and report local safety concerns",
      "Neighbors meeting to set statewide education standards under Ohio law",
      "Neighbors gathering to draft new federal legislation",
      "Neighbors serving as judges in municipal court cases"
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
      "Emergency fire service operated only by federal troops under Ohio law",
      "Emergency fire service staffed only by elected officials",
      "Emergency fire service directed by state legislators"
    ],
    "hint": "Focus on the role or action described by “volunteer fire department” in state and local civic life.",
    "explain": "volunteer fire department: Emergency fire service staffed partly or fully by trained volunteers."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “Ohio National Guard”?",
    "answer": "Military force with state and federal responsibilities",
    "choices": [
      "Military force with state and federal responsibilities",
      "Military force serving exclusively under county officials",
      "Military force responsible only for municipal elections",
      "Military force assigned solely to federal court security"
    ],
    "hint": "Focus on the role or action described by “Ohio National Guard” in state and local civic life.",
    "explain": "Ohio National Guard: Military force with state and federal responsibilities."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “local public office”?",
    "answer": "An official position serving a city, village, township, or county",
    "choices": [
      "An official position serving a city, village, township, or county",
      "An official position serving the entire federal government under Ohio law",
      "An official position serving an international organization",
      "An official position serving a national political committee"
    ],
    "hint": "Focus on the role or action described by “local public office” in state and local civic life.",
    "explain": "local public office: An official position serving a city, village, township, or county."
  },
  {
    "area": "CS 17",
    "stem": "Which definition best matches “community service”?",
    "answer": "Work performed to benefit a community or its residents",
    "choices": [
      "Work performed to benefit a community or its residents",
      "Work performed to benefit an elected official personally",
      "Work performed to support only federal military duties",
      "Work performed as a paid state government occupation"
    ],
    "hint": "Focus on the role or action described by “community service” in state and local civic life.",
    "explain": "community service: Work performed to benefit a community or its residents."
  }
];
launchMasteryGame({title:"CS 16–17 Ohio Government and Citizenship Vocabulary",subtitle:"Compare the Ohio and U.S. Constitutions and examine how citizens assist state and local government.",assignmentKey:"gov-cs16-17-vocabulary-2026-v1",questions,linger:4000});
