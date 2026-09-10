/* Paste the Government Hub's existing Apps Script /exec URL here. */
const SCRIPT_URL="https://script.google.com/macros/s/AKfycbz_N40FGUxCgJBfpIUtR3CgC0nRfKFI1KdqalcKRtj_zK2rZcIIGReS9MEwDSODnsAn_Q/exec";
const META={title:"Basic Principles of the Constitution",subtitle:"Introductory Short-Answer Worksheet",assignmentKey:"basic-principles-constitution-2026-v1"};

const URL={
 principles:"https://constitution.congress.gov/browse/essay/intro.7-1/ALDE_00000028/",
 constitution:"https://www.archives.gov/founding-docs/constitution-transcript",
 federalism:"https://constitution.congress.gov/browse/essay/intro.7-3/ALDE_00000032/",
 tenth:"https://constitution.congress.gov/constitution/amendment-10/",
 separation:"https://constitution.congress.gov/browse/essay/intro.7-2/ALDE_00000031/",
 branches:"https://constitution.congress.gov/constitution/",
 ratification:"https://constitutioncenter.org/education/constitution-101-curriculum/middle-school-curriculum/module-4",
 antifederalists:"https://constitutioncenter.org/education/classroom-resource-library/classroom/5.3-info-brief-the-anti-federalists",
 federalistPapers:"https://guides.loc.gov/federalist-papers/full-text",
 constitutionHistory:"https://www.archives.gov/founding-docs/more-perfect-union",
 billOfRights:"https://constitutioncenter.org/education/constitution-101-curriculum/5-the-bill-of-rights",
 articles:"https://www.archives.gov/milestone-documents/articles-of-confederation",
 necessary:"https://constitution.congress.gov/browse/essay/artI-S8-C18-1/ALDE_00001242/",
 supremacy:"https://constitution.congress.gov/browse/essay/artVI-C2-1/ALDE_00013395/",
 amendments:"https://www.archives.gov/founding-docs/amendments-11-27",
 marbury:"https://www.oyez.org/cases/1789-1850/5us137",
 brown:"https://www.oyez.org/cases/1940-1955/347us483",
 civilRights:"https://www.archives.gov/milestone-documents/civil-rights-act",
 votingRights:"https://www.archives.gov/milestone-documents/voting-rights-act",
 oversight:"https://history.house.gov/Institution/Origins-Development/Investigations-Oversight/",
 legislation:"https://www.house.gov/the-house-explained/the-legislative-process",
 living:"https://www.archives.gov/publications/prologue/2015/winter/amending-america"
};
const src=(label,url)=>[{label,url}];
const SECTIONS=[
 {title:"Content Statement 5 - Basic Principles of the U.S. Constitution",questions:[
  {id:"p01",display:"1",prompt:"What does the principle of popular sovereignty mean in your own words?",hint:"Look for the idea that political authority begins with the people.",sources:src("Constitution Annotated - Basic Principles",URL.principles)},
  {id:"p02",display:"2",prompt:"Give one historical example that illustrates popular sovereignty in action.",hint:"Choose an example in which citizens approved, rejected, elected, or changed government.",sources:src("Constitution Annotated - Basic Principles",URL.principles)},
  {id:"p03",display:"3",prompt:"What does the phrase “consent of the governed” mean?",hint:"Look for who gives government permission to rule. A short answer such as “the people give permission” is enough.",sources:src("Constitution Annotated - Basic Principles",URL.principles)},
  {id:"p04",display:"4",prompt:"Define limited government in one sentence.",hint:"Focus on constitutional restrictions placed on public officials and institutions.",sources:src("Constitution Annotated - Basic Principles",URL.principles)},
  {id:"p05",display:"5",prompt:"What parts or features of the Constitution help limit government power?",hint:"Identify at least one structural limit, written power, prohibition, or protected right.",sources:src("National Archives - Constitution",URL.constitution)},
  {id:"p06",display:"6",prompt:"Explain the difference between rule of law and limited government.",hint:"One requires everyone to follow established law; the other restricts what government may do.",sources:src("Constitution Annotated - Basic Principles",URL.principles)},
  {id:"p07",display:"7",prompt:"What is federalism?",hint:"Look for the division and sharing of authority between two levels of government.",sources:src("Constitution Annotated - Federalism",URL.federalism)},
  {id:"p08",display:"8",prompt:"Give one example of a power generally reserved to the states under federalism.",hint:"Only one example is needed: schools and education, licenses, state elections, police powers, marriage rules, or local government.",sources:src("Constitution Annotated - Tenth Amendment",URL.tenth)},
  {id:"p09",display:"9",prompt:"Which amendment emphasizes powers reserved to the states or the people?",hint:"Read the amendment’s one-sentence text.",sources:src("Constitution Annotated - Tenth Amendment",URL.tenth)},
  {id:"p10",display:"10",prompt:"Define separation of powers.",hint:"Explain why legislative, executive, and judicial authority are assigned to different branches.",sources:src("Constitution Annotated - Separation of Powers",URL.separation)},
  {id:"p11",display:"11",prompt:"What is the main role of each of the three branches of government?",hint:"Match each branch to its job: legislative makes laws, executive carries out laws, and judicial interprets laws.",sources:src("Constitution Annotated - Articles I-III",URL.branches)},
  {id:"p12",display:"12",prompt:"How do checks and balances prevent one branch from becoming too powerful?",hint:"Explain the system and include one example of a branch checking another.",sources:src("Constitution Annotated - Checks and Balances",URL.separation)}
 ]},
 {title:"Content Statement 6 - Federalists vs. Anti-Federalists",questions:[
  {id:"p13",display:"13",prompt:"Who were the Federalists?",hint:"Identify their position during the ratification debate.",sources:src("Constitution Center - Ratification",URL.ratification)},
  {id:"p14",display:"14",prompt:"Who were the Anti-Federalists?",hint:"Identify their position and their central concerns.",sources:src("Constitution Center - Anti-Federalists",URL.antifederalists)},
  {id:"p15",display:"15",prompt:"What did the Federalists argue in favor of ratifying the Constitution?",hint:"Focus on the need for a more effective national government and the Constitution’s safeguards.",sources:src("Constitution Center - Ratification",URL.ratification)},
  {id:"p16",display:"16",prompt:"What weaknesses of the Articles of Confederation concerned the Federalists most?",hint:"Give one weakness. Search for Congress being unable to tax, regulate trade, or enforce its decisions—or the lack of national courts or an executive.",sources:src("National Archives - Constitution History",URL.constitutionHistory)},
  {id:"p17",display:"17",prompt:"Which constitutional clauses or powers did Federalists support as necessary for an effective national government?",hint:"Identify at least one, such as taxation, commerce, supremacy, or necessary and proper authority.",sources:[{label:"Necessary and Proper Clause",url:URL.necessary},{label:"Supremacy Clause",url:URL.supremacy}]},
  {id:"p18",display:"18",prompt:"What arguments did the Anti-Federalists make against ratification?",hint:"Look for concerns about centralized power, the presidency, the courts, the states, and individual rights.",sources:src("Constitution Center - Anti-Federalists",URL.antifederalists)},
  {id:"p19",display:"19",prompt:"Why did Anti-Federalists want a Bill of Rights?",hint:"Explain why they believed written protections were necessary.",sources:src("Constitution Center - Bill of Rights",URL.billOfRights)},
  {id:"p20",display:"20",prompt:"Which constitutional clauses or powers did Anti-Federalists oppose, and why?",hint:"Choose at least one broad national power and connect it to their fear of consolidated government.",sources:src("Constitution Center - Anti-Federalists",URL.antifederalists)},
  {id:"p21",display:"21",prompt:"What was the outcome of the debate between Federalists and Anti-Federalists?",hint:"Explain what happened to the Constitution and what protection was promised afterward.",sources:src("National Archives - Constitution History",URL.constitutionHistory)},
  {id:"p22",display:"22",prompt:"Who wrote many of the Federalist Papers?",hint:"At the top of the guide, find the three authors who used the name Publius: Hamilton, Madison, and Jay.",sources:src("Library of Congress - Federalist Papers",URL.federalistPapers)},
  {id:"p23",display:"23",prompt:"What was the purpose of the Anti-Federalist essays and arguments?",hint:"Explain what their authors wanted readers and state ratifying conventions to do.",sources:src("Constitution Center - Anti-Federalists",URL.antifederalists)},
  {id:"p24",display:"24",prompt:"Which compromise helped secure ratification of the Constitution?",hint:"Look for the promise made to states concerned about individual liberties.",sources:src("Constitution Center - Bill of Rights",URL.billOfRights)}
 ]},
 {title:"Content Statement 7 - Constitutional Change",questions:[
  {id:"p25",display:"25",prompt:"What is one formal way the U.S. Constitution can be changed?",hint:"Use Ctrl+F for “Article V.” One part is enough: an amendment may be proposed by two-thirds of Congress or ratified by three-fourths of the states.",sources:src("National Archives - Constitution, Article V",URL.constitution)},
  {id:"p26",display:"26",prompt:"Give one example of an amendment that expanded rights and explain what it changed.",hint:"Possible choices include the 13th, 14th, 15th, 19th, 24th, or 26th Amendments.",sources:src("National Archives - Amendments 11-27",URL.amendments)},
  {id:"p27",display:"27",prompt:"Which amendment lowered the voting age to 18?",hint:"Use Ctrl+F and search for “eighteen years of age.” The amendment number beside that phrase is the answer.",sources:src("National Archives - Amendments 11-27",URL.amendments)},
  {id:"p28",display:"28",prompt:"What role does the Supreme Court play in interpreting the Constitution?",hint:"Explain what happens when the Court decides whether a law or government action conflicts with the Constitution.",sources:src("Oyez - Marbury v. Madison",URL.marbury)},
  {id:"p29",display:"29",prompt:"Which Supreme Court case established judicial review?",hint:"The case name is at the top of the linked page; its conclusion explains judicial review.",sources:src("Oyez - Marbury v. Madison",URL.marbury)},
  {id:"p30",display:"30",prompt:"Give one example of a Supreme Court case that expanded or protected individual rights. Explain the right involved.",hint:"The linked example concerns equal protection and segregated public schools.",sources:src("Oyez - Brown v. Board of Education",URL.brown)},
  {id:"p31",display:"31",prompt:"What is the purpose of the Civil Rights Act of 1964?",hint:"Identify the kinds of discrimination the law prohibited and the settings it addressed.",sources:src("National Archives - Civil Rights Act",URL.civilRights)},
  {id:"p32",display:"32",prompt:"What is the purpose of the Voting Rights Act of 1965?",hint:"Look for the discriminatory voting practices the law prohibited or restricted.",sources:src("National Archives - Voting Rights Act",URL.votingRights)},
  {id:"p33",display:"33",prompt:"What is legislative oversight, and why is it important?",hint:"Explain how Congress monitors the executive branch and the implementation of laws.",sources:src("U.S. House History - Oversight",URL.oversight)},
  {id:"p34",display:"34",prompt:"How does Congress add details to the constitutional framework through legislation?",hint:"Explain how broad constitutional powers become specific bills and laws.",sources:src("U.S. House - Legislative Process",URL.legislation)},
  {id:"p35",display:"35",prompt:"Why is the Constitution sometimes called a “living document”?",hint:"Explain that it can adjust over time through amendments, laws, court interpretations, or application to new circumstances. One clear method is enough.",sources:src("National Archives - Amending America",URL.living)}
 ]}
];

const RULES={
 p01:[["people","citizens"],["power","authority","sovereignty","rule"]],p02:[["vote","election","elect","ratif","referendum","amendment","constitutional convention"]],p03:[["people","governed","citizens"],["consent","permission","approval","agree"]],p04:[["limit","restrict","constraint","not unlimited"],["government","official","power"]],p05:[["constitution","separation","checks","bill of rights","amendment","enumerated","branch","veto"]],p06:[["law","everyone","official","same rules"],["limit","restrict","government","power"]],p07:[["national","federal"],["state"],["share","divide","split"]],p08:[["school","education","license","election","local government","police","marriage","driving","public safety"]],p09:[["tenth","10th","10 amendment","amendment 10","amendment x"]],p10:[["branch","branches"],["legislative","executive","judicial","power","divided","separate"]],p11:[["legislative","congress","make laws","makes laws"],["executive","president","enforce","carry out"],["judicial","court","interpret","decide law"]],p12:[["check","limit","stop","balance","control","prevent"],["branch","branches","each other","another"]],
 p13:[["support","favor","ratif","wanted","backed"],["constitution"]],p14:[["oppose","against","fear","did not support"],["constitution","national","central"]],p15:[["strong","stronger","effective","union","national"],["government","constitution"]],p16:[["tax","revenue","money","commerce","trade","enforce","executive","court","amend","weak national government"]],p17:[["tax","commerce","necessary","proper","supremacy","implied"]],p18:[["power","central","national","president","court","too strong"],["rights","state","tyranny","liberty","bill of rights"]],p19:[["protect","guarantee","secure","keep"],["right","liberty","freedom"]],p20:[["necessary","proper","supremacy","tax","commerce","executive","court"],["power","state","tyranny","rights","too broad","too strong"]],p21:[["ratif","approved","passed","constitution"],["bill of rights","amendment","rights","promise"]],p22:[["hamilton"],["madison"],["jay"]],p23:[["oppose","defeat","reject","warn","stop"],["constitution","ratification","power","rights"]],p24:[["bill of rights","amendment","rights","promise"]],
 p25:[["two thirds","2 3","congress","convention","three fourths","3 4","states","ratif","propose"]],p26:[["amendment","13th","14th","15th","19th","24th","26th","thirteenth","fourteenth","fifteenth","nineteenth","twenty fourth","twenty sixth"],["right","vote","slavery","citizen","equal","women"]],p27:[["26th","twenty sixth","26 amendment","amendment 26"]],p28:[["interpret","meaning","constitutional","constitution","decide"],["court","law","action","government"]],p29:[["marbury"],["madison"]],p30:[["brown","tinker","gideon","miranda","loving","obergefell"],["right","equal","speech","counsel","protection","liberty","segregation","school"]],p31:[["discrimination","segregation","unequal treatment"],["race","racial","color","religion","sex","national origin","employment","public accommodation","public places"]],p32:[["vote","voting"],["discrimination","literacy test","race","racial","federal","protect","barrier","rights"]],p33:[["congress","legislative"],["monitor","investigate","review","supervise","accountable","executive","check"]],p34:[["bill","law","legislation","statute"],["congress","constitutional","power","details","pass","specific"]],p35:[["amend","change","interpret","court","legislation","adapt","new circumstances","over time"]]
};
/* Short, correct introductory answers should pass. Multi-part questions are
   protected by concept groups instead of artificial sentence-length rules. */
const MIN={p09:2,p27:2,p29:6};
const DIRECT={
 p01:/people.{0,20}(power|rule|authority)|power.{0,20}(people|citizens)/,
 p02:/vote|election|elect|ratif|referendum|constitutional convention/,
 p03:/(people|governed|citizens).{0,25}(permission|consent|approval|agree)|permission.{0,20}(rule|government)/,
 p05:/checks? and balances?|separation of powers?|bill of rights|amendments?|constitution/,
 p08:/school|education|license|election|local government|police|marriage|driving|public safety/,
 p12:/(each|one).{0,15}branch.{0,25}(limit|check|stop|control|prevent)/,
 p16:/(could not|couldnt|unable to|no power to).{0,20}(tax|raise money|regulate trade|enforce)|tax|revenue/,
 p19:/protect.{0,20}(rights?|libert|freedom)/,
 p21:/ratif.{0,30}bill of rights|constitution.{0,25}(approved|ratif)|bill of rights.{0,25}(promise|add)/,
 p24:/bill of rights/,
 p25:/(two thirds|2 3).{0,20}(congress|propos)|three fourths|3 4|states.{0,20}ratif/,
 p27:/26|twenty sixth/,
 p28:/(decide|determine).{0,25}(law|action).{0,20}constitutional|interpret.{0,20}constitution/,
 p29:/marbury.{0,10}madison/,
 p30:/brown.{0,30}(segregat|school|equal)|tinker|gideon|miranda|loving|obergefell/,
 p31:/(ban|stop|prohibit).{0,30}(discrimin|segregat)|civil rights|equal treatment/,
 p32:/protect.{0,25}(vot|voting rights)|stop.{0,25}(voting discrimin|literacy test)|voting rights/,
 p34:/(pass|make|write).{0,15}(bills?|laws?|legislation)/,
 p35:/(change|adapt|amend|interpret).{0,25}(time|society|circumstance)|living|can change|changes over time/
};
const LOCAL_KEY=META.assignmentKey+"::local-v1",state={accepted:{},dirty:false,lastCloudSave:null};
function normalize(s){return String(s||"").toLowerCase().replace(/[’']/g,"").replace(/&/g," and ").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim()}
function checkRule(id,value){const raw=String(value||"").trim(),text=normalize(raw),groups=RULES[id]||[],hits=groups.filter(g=>g.some(x=>text.includes(normalize(x)))).length,needed=Math.min(groups.length,groups.length>2?2:groups.length),enough=raw.replace(/\s+/g," ").length>=(MIN[id]||3),direct=DIRECT[id]&&DIRECT[id].test(text),ok=enough&&(direct||hits>=needed);return{ok,msg:ok?"Accepted ✓":"You are close. Use the hint to add the main idea, then try again."}}
function render(){const host=document.getElementById("assignment");host.innerHTML="";SECTIONS.forEach(sec=>{const h=document.createElement("h2");h.className="section-title";h.textContent=sec.title;host.appendChild(h);sec.questions.forEach(q=>{const c=document.createElement("article");c.className="q";c.id="card-"+q.id;c.innerHTML=`<div class="qtop"><div class="num">${q.display}</div><div class="prompt">${escapeHtml(q.prompt)}</div></div><div class="hint"><b>Where to look:</b> ${escapeHtml(q.hint)}</div><div class="source-row">${q.sources.map(s=>`<a class="source-link" target="_blank" rel="noopener" href="${s.url}">Find it here: ${escapeHtml(s.label)} ↗</a>`).join("")}</div><div class="response-row"><textarea id="answer-${q.id}" placeholder="Type your answer here…"></textarea><button type="button" onclick="checkOne('${q.id}')">Check Answer</button></div><div class="feedback" id="feedback-${q.id}"></div>`;host.appendChild(c);c.querySelector("textarea").addEventListener("input",()=>{state.accepted[q.id]=false;c.classList.remove("accepted","retry");document.getElementById("feedback-"+q.id).textContent="";state.dirty=true;saveLocal();updateProgress()})})});restoreLocal();updateProgress();updateCloudText()}
function allQuestions(){return SECTIONS.flatMap(s=>s.questions)}
function checkOne(id){const r=checkRule(id,document.getElementById("answer-"+id).value);state.accepted[id]=r.ok;const c=document.getElementById("card-"+id);c.classList.toggle("accepted",r.ok);c.classList.toggle("retry",!r.ok);document.getElementById("feedback-"+id).textContent=r.msg;state.dirty=true;saveLocal();updateProgress()}
function collect(){const answers={},accepted={};allQuestions().forEach(q=>{answers[q.id]=document.getElementById("answer-"+q.id).value;if(state.accepted[q.id])accepted[q.id]=true});return{assignmentKey:META.assignmentKey,assignmentTitle:META.title,name:studentName.value.trim(),period:period.value.trim(),email:email.value.trim().toLowerCase(),answers,accepted}}
function applyPayload(d){if(!d)return;studentName.value=d.name||"";period.value=d.period||"";email.value=d.email||"";allQuestions().forEach(q=>{document.getElementById("answer-"+q.id).value=d.answers&&d.answers[q.id]!==undefined?d.answers[q.id]:"";const ok=!!(d.accepted&&d.accepted[q.id]);state.accepted[q.id]=ok;const c=document.getElementById("card-"+q.id);c.classList.toggle("accepted",ok);c.classList.remove("retry");document.getElementById("feedback-"+q.id).textContent=ok?"Accepted ✓":""});updateProgress()}
function saveLocal(){try{localStorage.setItem(LOCAL_KEY,JSON.stringify(collect()))}catch(e){}}
function restoreLocal(){try{const r=localStorage.getItem(LOCAL_KEY);if(r)applyPayload(JSON.parse(r))}catch(e){}}
function updateProgress(){const qs=allQuestions(),done=qs.filter(q=>state.accepted[q.id]).length;progressText.textContent=`${done} of ${qs.length} responses accepted`}
function updateCloudText(){const configured=SCRIPT_URL&&!SCRIPT_URL.includes("PASTE_");cloudText.textContent=configured?(state.lastCloudSave?`Last cloud save: ${state.lastCloudSave}`:"Cloud save ready"):"Cloud save URL not added yet"}
function setStatus(msg,good){saveStatus.textContent=msg;saveStatus.style.color=good===true?"#9ef0b5":good===false?"#ffd29a":"#fff"}
function requireIdentity(){const d=collect();if(!d.name||!d.period||!d.email){setStatus("Enter name, period, and school email first.",false);return null}return d}
async function saveCloud(status="in_progress"){const data=requireIdentity();if(!data)return false;saveLocal();if(!SCRIPT_URL||SCRIPT_URL.includes("PASTE_")){setStatus("Local backup saved. Add the Apps Script URL for cloud saving.",true);return true}try{await fetch(SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"save",status,...data})});state.lastCloudSave=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});state.dirty=false;updateCloudText();setStatus(status==="submitted"?"Final submission sent to your class sheet.":"Progress save sent to your class sheet.",true);return true}catch(err){setStatus("Cloud save failed. Your local browser backup is still intact.",false);return false}}
function retrieveCloud(){const mail=email.value.trim().toLowerCase();if(!mail){setStatus("Enter the same school email you used when saving.",false);return}if(!SCRIPT_URL||SCRIPT_URL.includes("PASTE_")){setStatus("Apps Script URL has not been added yet.",false);return}const cb="load_"+Date.now();window[cb]=function(r){try{if(!r||!r.ok){setStatus(r&&r.message||"Retrieve failed.",false);return}if(!r.found){setStatus("No saved work was found for that email.",false);return}applyPayload(r.payload);saveLocal();setStatus("Previous work retrieved successfully.",true)}finally{try{delete window[cb]}catch(e){}const n=document.getElementById(cb);if(n)n.remove()}};const s=document.createElement("script");s.id=cb;s.src=SCRIPT_URL+"?action=load&assignmentKey="+encodeURIComponent(META.assignmentKey)+"&email="+encodeURIComponent(mail)+"&callback="+encodeURIComponent(cb)+"&_="+Date.now();s.onerror=()=>setStatus("Retrieve request was blocked or failed.",false);document.body.appendChild(s);setStatus("Looking for saved work…",null)}
async function finish(){const data=requireIdentity();if(!data)return;const qs=allQuestions(),score=qs.filter(q=>state.accepted[q.id]).length,total=qs.length,percent=Math.round(score/total*100);await saveCloud("submitted");finalResult.innerHTML=`<div class="receipt"><h2>Submission Complete</h2><p><b>${escapeHtml(data.name)}</b> - Period ${escapeHtml(data.period)}</p><p style="font-size:30px;margin:10px 0"><b>${score} / ${total} (${percent}%)</b></p><p>Keep this screen visible until your teacher confirms completion.</p></div>`;window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
saveBtn.addEventListener("click",()=>saveCloud("in_progress"));retrieveBtn.addEventListener("click",retrieveCloud);finishBtn.addEventListener("click",finish);["studentName","period","email"].forEach(id=>document.getElementById(id).addEventListener("input",()=>{state.dirty=true;saveLocal()}));setInterval(()=>{if(state.dirty&&email.value.trim()&&SCRIPT_URL&&!SCRIPT_URL.includes("PASTE_"))saveCloud("in_progress")},30000);render();
