// Paste the deployed Apps Script /exec URL between the quotation marks.
const SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
const ASSIGNMENT_ID = "gov-basic-principles-2026";
const ASSIGNMENT_TITLE = "Basic Principles: Building Depth of Understanding";

const principles = ["Popular sovereignty","Limited government","Federalism","Separation of powers","Checks and balances"];
const debatePrompts = [
  "What argument is Madison making in favor of the Constitution?",
  "What fear does Brutus express about the Constitution?",
  "How do these excerpts show the difference between Federalist and Anti-Federalist viewpoints?",
  "Which concern—Madison’s or Brutus’s—do you think influenced the Bill of Rights more strongly? Explain with evidence."
];
const principlePrompts = ["Define the principle in your own words.","Explain how it was intended to shape the U.S. government.","Give one example from the Founding Era.","Give one example of that principle in action today."];
const changePrompts = ["Identify the change and classify it as an amendment, Supreme Court case, law, or informal practice.","What problem did this change address?","How did it alter the meaning or application of one basic principle from Part I?","Did it expand rights, limit rights, or do both? Defend your evaluation."];
const state = {startedAt:new Date().toISOString(),lastActive:Date.now(),activeMs:0,awayMs:0,tabLeaves:0,pasteCount:0,questionMs:{},activeField:null,fieldStarted:Date.now()};

function field(id,label,prompt){return `<div class="question"><label for="${id}"><span class="question-number">${label}</span> ${prompt}<textarea id="${id}" name="${id}" data-track required aria-required="true"></textarea></label></div>`}
function build(){
  document.querySelector('#principleSlots').innerHTML=[1,2,3].map((n)=>`<div class="response-group"><h3>Principle ${n}</h3><label>Choose a principle<select id="principle${n}" name="principle${n}" required><option value="">Choose…</option>${principles.map(p=>`<option>${p}</option>`).join('')}</select></label>${principlePrompts.map((p,i)=>field(`p${n}q${i+1}`,`${n}.${i+1}`,p)).join('')}</div>`).join('');
  document.querySelector('#debateQuestions').innerHTML=`<div class="response-group">${debatePrompts.map((p,i)=>field(`debate${i+1}`,`${i+1}.`,p)).join('')}</div>`;
  document.querySelector('#changeSlots').innerHTML=[1,2].map(n=>`<div class="response-group"><h3>Constitutional Change ${n}</h3>${changePrompts.map((p,i)=>field(`change${n}q${i+1}`,`${n}.${i+1}`,p)).join('')}</div>`).join('');
}
function allFields(){return [...document.querySelectorAll('input,select,textarea')].filter(e=>e.id!=="honesty")}
function values(){return Object.fromEntries(allFields().map(e=>[e.id,e.value.trim ? e.value.trim():e.value]))}
function storageKey(){const email=document.querySelector('#email').value.trim().toLowerCase();return `${ASSIGNMENT_ID}:${email||'unidentified'}`}
function updateTiming(next){const now=Date.now();if(state.activeField)state.questionMs[state.activeField]=(state.questionMs[state.activeField]||0)+(now-state.fieldStarted);state.activeField=next;state.fieldStarted=now}
function localSave(){localStorage.setItem(storageKey(),JSON.stringify({answers:values(),state,savedAt:new Date().toISOString()}));setStatus('Saved on this device at '+new Date().toLocaleTimeString(),true)}
let saveTimer;
function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(localSave,500)}
function setStatus(msg,good=false,error=false){const el=document.querySelector('#saveStatus');el.textContent=msg;el.className='status'+(good?' good':'')+(error?' error':'')}
function restore(data){if(!data||!data.answers)return;Object.entries(data.answers).forEach(([id,val])=>{const el=document.getElementById(id);if(el)el.value=val});if(data.state)Object.assign(state,data.state);setStatus('Saved work retrieved.',true)}
async function post(action,extra={}){
  if(!SCRIPT_URL.startsWith('https://script.google.com/'))throw new Error('Apps Script URL has not been added yet.');
  const payload={action,assignmentId:ASSIGNMENT_ID,assignmentTitle:ASSIGNMENT_TITLE,name:document.querySelector('#studentName').value.trim(),period:document.querySelector('#period').value,email:document.querySelector('#email').value.trim().toLowerCase(),answers:values(),telemetry:{startedAt:state.startedAt,eventAt:new Date().toISOString(),activeSeconds:Math.round(state.activeMs/1000),awaySeconds:Math.round(state.awayMs/1000),tabLeaves:state.tabLeaves,pasteCount:state.pasteCount,questionSeconds:Object.fromEntries(Object.entries(state.questionMs).map(([k,v])=>[k,Math.round(v/1000)]))},...extra};
  const response=await fetch(SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});if(!response.ok)throw new Error('The save service did not respond.');return response.json();
}
async function retrieve(){
  const email=document.querySelector('#email').value.trim();const period=document.querySelector('#period').value;if(!email||!period){setStatus('Enter school email and period first.',false,true);return}
  try{setStatus('Looking for saved work…');const result=await post('retrieve');if(result.found)restore({answers:result.answers,state:result.telemetry});else{const local=JSON.parse(localStorage.getItem(storageKey())||'null');if(local)restore(local);else setStatus('No saved work was found.',false,true)}}catch(e){const local=JSON.parse(localStorage.getItem(storageKey())||'null');if(local)restore(local);else setStatus(e.message,false,true)}
}
function validate(){
  document.querySelectorAll('.required-missing').forEach(e=>e.classList.remove('required-missing'));const missing=allFields().filter(e=>!e.value.trim());const picks=[1,2,3].map(n=>document.querySelector(`#principle${n}`).value).filter(Boolean);if(new Set(picks).size!==picks.length){[1,2,3].map(n=>document.querySelector(`#principle${n}`)).forEach(e=>e.classList.add('required-missing'));return {ok:false,message:'Choose three different principles.'}}if(missing.length){missing.forEach(e=>e.classList.add('required-missing'));missing[0].scrollIntoView({behavior:'smooth',block:'center'});return {ok:false,message:`Complete all responses. ${missing.length} field${missing.length===1?' is':'s are'} still blank.`}}if(!document.querySelector('#honesty').checked)return {ok:false,message:'Check the review statement before submitting.'};return {ok:true}}
async function submit(e){e.preventDefault();updateTiming(null);localSave();const check=validate(),msg=document.querySelector('#submitMessage');if(!check.ok){msg.textContent=check.message;msg.className='status error';return}try{document.querySelector('#submitBtn').disabled=true;msg.textContent='Submitting…';msg.className='status';await post('submit',{submittedAt:new Date().toISOString()});msg.textContent='Assignment submitted successfully. You may take a screenshot of this confirmation.';msg.className='status good'}catch(err){msg.textContent=`Your work is saved on this device, but it was not submitted: ${err.message}`;msg.className='status error'}finally{document.querySelector('#submitBtn').disabled=false}}

build();
document.addEventListener('input',scheduleSave);document.addEventListener('change',scheduleSave);
document.addEventListener('focusin',e=>{if(e.target.matches('[data-track]'))updateTiming(e.target.id)});
document.addEventListener('paste',e=>{if(e.target.matches('textarea,input'))state.pasteCount++});
document.addEventListener('visibilitychange',()=>{const now=Date.now();if(document.hidden){state.activeMs+=now-state.lastActive;state.tabLeaves++;updateTiming(null);state.lastActive=now}else{state.awayMs+=now-state.lastActive;state.lastActive=now}});
window.addEventListener('beforeunload',()=>{state.activeMs+=Date.now()-state.lastActive;localSave()});
document.querySelector('#retrieveBtn').addEventListener('click',retrieve);document.querySelector('#worksheet').addEventListener('submit',submit);
setInterval(()=>{if(!document.hidden){state.activeMs+=Date.now()-state.lastActive;state.lastActive=Date.now()}},15000);
