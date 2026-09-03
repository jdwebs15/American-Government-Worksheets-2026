/* =========================================================
   Declaration of Independence Research
   GitHub worksheet + Apps Script save/retrieve backend
   ========================================================= */

/* Paste the deployed Apps Script /exec URL between the quotes later. */
const SCRIPT_URL = "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE";

const META = {
  "title": "Declaration of Independence Research",
  "subtitle": "Research the document, use the provided sources, answer in your own words, and save your progress with your school email.",
  "assignmentKey": "declaration-research-2026-v1"
};
const SECTIONS = [
  {
    "title": "Section 1 — Background and Context",
    "questions": [
      {
        "id": "d01",
        "display": "1",
        "prompt": "Who primarily authored the Declaration of Independence?",
        "hint": "Look for the main drafter.",
        "sources": [
          {
            "label": "National Archives — History",
            "url": "https://www.archives.gov/founding-docs/declaration-history"
          }
        ]
      },
      {
        "id": "d02",
        "display": "2",
        "prompt": "What committee helped draft the document alongside him?",
        "hint": "It was a five-person committee.",
        "sources": [
          {
            "label": "National Archives — History",
            "url": "https://www.archives.gov/founding-docs/declaration-history"
          }
        ]
      },
      {
        "id": "d03",
        "display": "3",
        "prompt": "Why did the Continental Congress feel it was necessary to write a formal declaration in 1776?",
        "hint": "Explain why the colonies wanted to formally separate and justify that decision.",
        "sources": [
          {
            "label": "National Archives — Declaration",
            "url": "https://www.archives.gov/milestone-documents/declaration-of-independence"
          }
        ]
      },
      {
        "id": "d04",
        "display": "4",
        "prompt": "How did the Enlightenment influence the writing of the Declaration?",
        "hint": "Think natural rights, government by consent, and John Locke.",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d05",
        "display": "5",
        "prompt": "What earlier colonial experiences or events (for example taxes or protests) influenced the decision to separate?",
        "hint": "Name and explain at least one relevant colonial grievance/event.",
        "sources": [
          {
            "label": "National Archives — Declaration",
            "url": "https://www.archives.gov/milestone-documents/declaration-of-independence"
          }
        ]
      }
    ]
  },
  {
    "title": "Section 2 — Purpose of the Document",
    "questions": [
      {
        "id": "d06",
        "display": "6",
        "prompt": "According to the Preamble, what is the purpose of government?",
        "hint": "What are governments supposed to protect or secure?",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d07",
        "display": "7",
        "prompt": "What does the Declaration say people can do if their government becomes destructive of their rights?",
        "hint": "Look for the verbs describing what people may do to government.",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d08",
        "display": "8",
        "prompt": "What does “all men are created equal” mean in the context of 1776?",
        "hint": "Explain the political ideal, while recognizing the limits of how it was applied at the time.",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d09",
        "display": "9",
        "prompt": "How does Jefferson describe the “unalienable rights”? List them.",
        "hint": "There are three listed together.",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d10",
        "display": "10",
        "prompt": "How does the Declaration connect consent of the governed to legitimate government power?",
        "hint": "Where does government get its just power?",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      }
    ]
  },
  {
    "title": "Section 3 — Grievances Against the King",
    "questions": [
      {
        "id": "d11",
        "display": "11",
        "prompt": "Who is the primary target of the grievances listed in the Declaration?",
        "hint": "Name the British ruler.",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d12",
        "display": "12",
        "prompt": "Name three taxes or laws that colonists were protesting.",
        "hint": "Examples include major taxes and Parliamentary acts from the pre-Revolutionary period.",
        "sources": [
          {
            "label": "National Archives — Declaration",
            "url": "https://www.archives.gov/milestone-documents/declaration-of-independence"
          }
        ]
      },
      {
        "id": "d13",
        "display": "13",
        "prompt": "How does Jefferson describe King George III’s treatment of colonial legislatures?",
        "hint": "Look for dissolved legislatures, refused laws, or interference with representation.",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d14",
        "display": "14",
        "prompt": "What does the Declaration say about the King and the administration of justice?",
        "hint": "Look for the grievance beginning with “He has obstructed…”",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d15",
        "display": "15",
        "prompt": "Which grievance deals with the presence of British troops in the colonies?",
        "hint": "Look for standing armies and/or quartering troops.",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d16",
        "display": "16",
        "prompt": "How does the Declaration describe the King’s role in waging war against the colonies?",
        "hint": "Summarize one or more of the wartime grievances.",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      }
    ]
  },
  {
    "title": "Section 4 — The Formal Declaration",
    "questions": [
      {
        "id": "d17",
        "display": "17",
        "prompt": "On what date was the Declaration officially adopted?",
        "hint": "Month, day, and year.",
        "sources": [
          {
            "label": "National Archives — Declaration",
            "url": "https://www.archives.gov/milestone-documents/declaration-of-independence"
          }
        ]
      },
      {
        "id": "d18",
        "display": "18",
        "prompt": "What colonies were represented in signing the Declaration?",
        "hint": "How many colonies/states were represented?",
        "sources": [
          {
            "label": "House — Signers List",
            "url": "https://history.house.gov/People/Continental-Congress/Signers_Declaration_Independence/"
          }
        ]
      },
      {
        "id": "d19",
        "display": "19",
        "prompt": "How many delegates signed the document?",
        "hint": "Use the signers list.",
        "sources": [
          {
            "label": "House — Signers List",
            "url": "https://history.house.gov/People/Continental-Congress/Signers_Declaration_Independence/"
          }
        ]
      },
      {
        "id": "d20",
        "display": "20",
        "prompt": "What risks did the signers face by endorsing the Declaration?",
        "hint": "Think about what Britain could consider their action to be.",
        "sources": [
          {
            "label": "National Archives — History",
            "url": "https://www.archives.gov/founding-docs/declaration-history"
          }
        ]
      },
      {
        "id": "d21",
        "display": "21",
        "prompt": "Who was the first to sign, and why is his signature the most famous?",
        "hint": "Identify the signer and explain what makes the signature stand out.",
        "sources": [
          {
            "label": "National Archives — History",
            "url": "https://www.archives.gov/founding-docs/declaration-history"
          }
        ]
      }
    ]
  },
  {
    "title": "Section 5 — Impact and Legacy",
    "questions": [
      {
        "id": "d22",
        "display": "22",
        "prompt": "How did the Declaration influence other nations or independence movements?",
        "hint": "Give a reasonable example or explain the broader influence of its ideals.",
        "sources": [
          {
            "label": "National Archives — Declaration",
            "url": "https://www.archives.gov/milestone-documents/declaration-of-independence"
          }
        ]
      },
      {
        "id": "d23",
        "display": "23",
        "prompt": "What role did the Declaration play in shaping the new U.S. Constitution?",
        "hint": "Connect popular government/rights ideals to the later constitutional system.",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d24",
        "display": "24",
        "prompt": "How does the Declaration reflect Enlightenment ideas from thinkers like John Locke?",
        "hint": "Natural rights, consent, social contract, right to alter government.",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d25",
        "display": "25",
        "prompt": "In what ways did the Declaration fall short of its ideals in 1776 (for example slavery, women, or Native Americans)?",
        "hint": "Explain at least one group excluded from the equality it proclaimed.",
        "sources": [
          {
            "label": "National Archives — Declaration",
            "url": "https://www.archives.gov/milestone-documents/declaration-of-independence"
          }
        ]
      },
      {
        "id": "d26",
        "display": "26",
        "prompt": "How did abolitionists later use the Declaration in their arguments?",
        "hint": "How could “all men are created equal” be used against slavery?",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d27",
        "display": "27",
        "prompt": "How has the phrase “all men are created equal” been reinterpreted over time?",
        "hint": "Connect the ideal to later expansions of civil/equal rights.",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d28",
        "display": "28",
        "prompt": "Which civil rights leader famously referenced the Declaration in a major speech?",
        "hint": "Think “I Have a Dream.”",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      },
      {
        "id": "d29",
        "display": "29",
        "prompt": "Where is the original Declaration kept today?",
        "hint": "Name the institution/building in Washington, D.C.",
        "sources": [
          {
            "label": "National Archives — Declaration",
            "url": "https://www.archives.gov/milestone-documents/declaration-of-independence"
          }
        ]
      },
      {
        "id": "d30",
        "display": "30",
        "prompt": "Why do you think the Declaration remains a powerful symbol of democracy and freedom?",
        "hint": "This is your judgment. Support it with a clear reason.",
        "sources": [
          {
            "label": "Declaration Transcript",
            "url": "https://www.archives.gov/founding-docs/declaration-transcript"
          }
        ]
      }
    ]
  }
];
const RULES = {
  "d01": {
    "any": [
      "Thomas Jefferson",
      "Jefferson"
    ]
  },
  "d02": {
    "any": [
      "Committee of Five",
      "five person committee",
      "committee of five"
    ]
  },
  "d03": {
    "open": true,
    "minChars": 25
  },
  "d04": {
    "concepts": [
      [
        "natural rights",
        "unalienable rights",
        "rights"
      ],
      [
        "consent",
        "people",
        "social contract",
        "government gets power from people"
      ]
    ],
    "minConcepts": 2
  },
  "d05": {
    "open": true,
    "minChars": 20
  },
  "d06": {
    "concepts": [
      [
        "protect rights",
        "secure rights",
        "rights"
      ],
      [
        "life liberty pursuit happiness",
        "unalienable"
      ]
    ],
    "minConcepts": 1
  },
  "d07": {
    "any": [
      "alter or abolish",
      "alter",
      "abolish",
      "change the government",
      "replace the government",
      "overthrow the government"
    ]
  },
  "d08": {
    "open": true,
    "minChars": 25
  },
  "d09": {
    "concepts": [
      [
        "life"
      ],
      [
        "liberty",
        "freedom"
      ],
      [
        "pursuit of happiness",
        "happiness"
      ]
    ],
    "minConcepts": 3
  },
  "d10": {
    "concepts": [
      [
        "consent",
        "permission",
        "approval"
      ],
      [
        "governed",
        "people",
        "citizens"
      ]
    ],
    "minConcepts": 2
  },
  "d11": {
    "any": [
      "King George III",
      "George III",
      "King George",
      "the king"
    ]
  },
  "d12": {
    "concepts": [
      [
        "stamp act",
        "stamp tax",
        "sugar act",
        "sugar tax",
        "townshend",
        "tea act",
        "tea tax",
        "intolerable acts",
        "coercive acts",
        "quartering act"
      ],
      [
        "stamp act",
        "stamp tax",
        "sugar act",
        "sugar tax",
        "townshend",
        "tea act",
        "tea tax",
        "intolerable acts",
        "coercive acts",
        "quartering act"
      ],
      [
        "stamp act",
        "stamp tax",
        "sugar act",
        "sugar tax",
        "townshend",
        "tea act",
        "tea tax",
        "intolerable acts",
        "coercive acts",
        "quartering act"
      ]
    ],
    "minConcepts": 3
  },
  "d13": {
    "any": [
      "dissolved legislatures",
      "dissolved representative houses",
      "refused laws",
      "suspended legislatures",
      "interfered with legislatures",
      "dissolved houses",
      "blocked representation"
    ]
  },
  "d14": {
    "any": [
      "obstructed administration of justice",
      "obstructed justice",
      "refused judiciary laws",
      "judges dependent on king",
      "controlled judges",
      "blocked justice"
    ]
  },
  "d15": {
    "any": [
      "standing armies",
      "kept standing armies",
      "quartering troops",
      "quartered troops",
      "soldiers in colonies",
      "military independent of civil power"
    ]
  },
  "d16": {
    "open": true,
    "minChars": 20
  },
  "d17": {
    "any": [
      "July 4 1776",
      "July 4, 1776",
      "7/4/1776",
      "fourth of july 1776"
    ]
  },
  "d18": {
    "any": [
      "13 colonies",
      "thirteen colonies",
      "all 13 colonies",
      "all thirteen colonies"
    ]
  },
  "d19": {
    "any": [
      "56",
      "fifty six",
      "fifty-six"
    ]
  },
  "d20": {
    "open": true,
    "minChars": 18
  },
  "d21": {
    "concepts": [
      [
        "John Hancock",
        "Hancock"
      ],
      [
        "large signature",
        "big signature",
        "bold signature",
        "largest signature",
        "prominent signature"
      ]
    ],
    "minConcepts": 2
  },
  "d22": {
    "open": true,
    "minChars": 25
  },
  "d23": {
    "open": true,
    "minChars": 25
  },
  "d24": {
    "concepts": [
      [
        "natural rights",
        "unalienable rights"
      ],
      [
        "consent",
        "social contract",
        "people"
      ],
      [
        "alter",
        "abolish",
        "change government"
      ]
    ],
    "minConcepts": 2
  },
  "d25": {
    "open": true,
    "minChars": 25
  },
  "d26": {
    "open": true,
    "minChars": 20
  },
  "d27": {
    "open": true,
    "minChars": 20
  },
  "d28": {
    "any": [
      "Martin Luther King Jr",
      "Martin Luther King",
      "MLK",
      "Dr King"
    ]
  },
  "d29": {
    "any": [
      "National Archives",
      "National Archives Building",
      "National Archives Museum",
      "archives rotunda"
    ]
  },
  "d30": {
    "open": true,
    "minChars": 25
  }
};

const LOCAL_KEY = META.assignmentKey + "::local-v1";
const state = {accepted:{}, dirty:false, lastCloudSave:null};

function normalize(s){
  return String(s||"").toLowerCase()
    .replace(/[’']/g,"")
    .replace(/&/g," and ")
    .replace(/[^a-z0-9\s]/g," ")
    .replace(/\s+/g," ").trim();
}
function lev(a,b){
  const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
  for(let i=0;i<=m;i++)dp[i][0]=i;
  for(let j=0;j<=n;j++)dp[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return dp[m][n];
}
function sim(a,b){if(a===b)return 1;if(!a||!b)return 0;return 1-lev(a,b)/Math.max(a.length,b.length);}
function liberalMatch(student,target){
  if(!student||!target)return false;
  const s=normalize(student),t=normalize(target);
  const sc=s.replace(/\s/g,""),tc=t.replace(/\s/g,"");
  if(/^\d+$/.test(sc)&&/^\d+$/.test(tc))return sc===tc;
  if((s.includes(t)||t.includes(s))&&Math.min(s.length,t.length)>=3)return true;
  if((sc.includes(tc)||tc.includes(sc))&&Math.min(sc.length,tc.length)>=4)return true;
  if(sim(sc,tc)>=(Math.min(sc.length,tc.length)<=4?.80:.68))return true;
  const st=s.split(" ").filter(Boolean),tt=t.split(" ").filter(Boolean);
  if(tt.length===1)return st.some(x=>x.length>2&&sim(x,tt[0])>=.68);
  const sig=tt.filter(x=>x.length>2);
  let hits=0;
  sig.forEach(x=>{if(st.some(y=>y.length>2&&sim(y,x)>=.68))hits++;});
  return sig.length>0 && hits/sig.length>=.66;
}
function checkRule(qid,value){
  const rule=RULES[qid], raw=String(value||"").trim();
  if(!rule)return {ok:raw.length>0,msg:"Response recorded."};
  if(rule.open){
    const ok=raw.replace(/\s+/g," ").length>=(rule.minChars||10);
    return {ok,msg:ok?"Response recorded.":"Add a little more detail before moving on."};
  }
  const answer=normalize(raw);
  if(!answer)return {ok:false,msg:"Enter an answer first."};
  let ok=false;
  if(rule.any)ok=rule.any.some(x=>liberalMatch(answer,x));
  if(rule.concepts){
    let hits=0;
    rule.concepts.forEach(g=>{if(g.some(x=>liberalMatch(answer,x)))hits++;});
    ok=hits>=(rule.minConcepts||rule.concepts.length);
  }
  return {ok,msg:ok?"Accepted ✓":"You are close. Add a little more of the main idea and try again."};
}

function render(){
  const host=document.getElementById("assignment");
  host.innerHTML="";
  SECTIONS.forEach(sec=>{
    const h=document.createElement("h2");h.className="section-title";h.textContent=sec.title;host.appendChild(h);
    sec.questions.forEach(q=>{
      const card=document.createElement("article");card.className="q";card.id="card-"+q.id;
      card.innerHTML=`
        <div class="qtop"><div class="num">${q.display}</div><div class="prompt">${escapeHtml(q.prompt)}</div></div>
        ${q.hint?`<div class="hint"><b>Hint:</b> ${escapeHtml(q.hint)}</div>`:""}
        <div class="source-row">${(q.sources||[]).map(s=>`<a class="source-link" target="_blank" rel="noopener" href="${s.url}">${escapeHtml(s.label)}</a>`).join("")}</div>
        <div class="response-row"><textarea id="answer-${q.id}" placeholder="Type your answer here…"></textarea><button type="button" onclick="checkOne('${q.id}')">Check Answer</button></div>
        <div class="feedback" id="feedback-${q.id}"></div>`;
      host.appendChild(card);
      const ta=card.querySelector("textarea");
      ta.addEventListener("input",()=>{state.accepted[q.id]=false;card.classList.remove("accepted","retry");document.getElementById("feedback-"+q.id).textContent="";state.dirty=true;saveLocal();updateProgress();});
    });
  });
  restoreLocal();
  updateProgress();
  updateCloudText();
}

function allQuestions(){return SECTIONS.flatMap(s=>s.questions);}
function checkOne(id){
  const value=document.getElementById("answer-"+id).value;
  const r=checkRule(id,value);
  state.accepted[id]=r.ok;
  const card=document.getElementById("card-"+id);
  card.classList.toggle("accepted",r.ok);card.classList.toggle("retry",!r.ok);
  document.getElementById("feedback-"+id).textContent=r.msg;
  state.dirty=true;saveLocal();updateProgress();
}
function collect(){
  const answers={};allQuestions().forEach(q=>answers[q.id]=document.getElementById("answer-"+q.id).value);
  const accepted={};allQuestions().forEach(q=>{if(state.accepted[q.id])accepted[q.id]=true;});
  return {
    assignmentKey:META.assignmentKey,
    assignmentTitle:META.title,
    name:document.getElementById("studentName").value.trim(),
    period:document.getElementById("period").value.trim(),
    email:document.getElementById("email").value.trim().toLowerCase(),
    answers,accepted
  };
}
function applyPayload(data){
  if(!data)return;
  document.getElementById("studentName").value=data.name||"";
  document.getElementById("period").value=data.period||"";
  document.getElementById("email").value=data.email||"";
  allQuestions().forEach(q=>{
    const v=data.answers&&data.answers[q.id]!==undefined?data.answers[q.id]:"";
    document.getElementById("answer-"+q.id).value=v;
    const ok=!!(data.accepted&&data.accepted[q.id]);state.accepted[q.id]=ok;
    const card=document.getElementById("card-"+q.id);card.classList.toggle("accepted",ok);card.classList.remove("retry");
    document.getElementById("feedback-"+q.id).textContent=ok?"Accepted ✓":"";
  });
  updateProgress();
}
function saveLocal(){
  try{localStorage.setItem(LOCAL_KEY,JSON.stringify(collect()));}catch(e){}
}
function restoreLocal(){
  try{const raw=localStorage.getItem(LOCAL_KEY);if(raw)applyPayload(JSON.parse(raw));}catch(e){}
}
function updateProgress(){
  const qs=allQuestions();const done=qs.filter(q=>state.accepted[q.id]).length;
  document.getElementById("progressText").textContent=`${done} of ${qs.length} responses accepted`;
}
function updateCloudText(){
  const configured=SCRIPT_URL && !SCRIPT_URL.includes("PASTE_");
  document.getElementById("cloudText").textContent=configured?(state.lastCloudSave?`Last cloud save: ${state.lastCloudSave}`:"Cloud save ready"):"Cloud save URL not added yet";
}
function setStatus(msg,good){
  const el=document.getElementById("saveStatus");el.textContent=msg;el.style.color=good===true?"#236637":good===false?"#9a4f00":"#333";
}
function requireIdentity(){
  const d=collect();
  if(!d.name||!d.period||!d.email){setStatus("Enter name, period, and school email first.",false);return null;}
  return d;
}
async function saveCloud(status="in_progress"){
  const data=requireIdentity();if(!data)return false;
  saveLocal();
  if(!SCRIPT_URL||SCRIPT_URL.includes("PASTE_")){setStatus("Local backup saved. Add the Apps Script URL later for cloud saving.",true);return true;}
  const payload={action:"save",status,...data};
  try{
    await fetch(SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});
    state.lastCloudSave=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});
    state.dirty=false;updateCloudText();setStatus(status==="submitted"?"Final submission sent to your class sheet.":"Progress save sent to your class sheet.",true);return true;
  }catch(err){setStatus("Cloud save failed. Your local browser backup is still intact.",false);return false;}
}
function retrieveCloud(){
  const email=document.getElementById("email").value.trim().toLowerCase();
  if(!email){setStatus("Enter the same school email you used when saving.",false);return;}
  if(!SCRIPT_URL||SCRIPT_URL.includes("PASTE_")){setStatus("Apps Script URL has not been added yet.",false);return;}
  const cb="load_"+Date.now();
  window[cb]=function(r){
    try{
      if(!r||!r.ok){setStatus((r&&r.message)||"Retrieve failed.",false);return;}
      if(!r.found){setStatus("No saved work was found for that email.",false);return;}
      applyPayload(r.payload);saveLocal();setStatus("Previous work retrieved successfully.",true);
    }finally{try{delete window[cb];}catch(e){}const n=document.getElementById(cb);if(n)n.remove();}
  };
  const s=document.createElement("script");s.id=cb;
  s.src=SCRIPT_URL+"?action=load&assignmentKey="+encodeURIComponent(META.assignmentKey)+"&email="+encodeURIComponent(email)+"&callback="+encodeURIComponent(cb)+"&_="+Date.now();
  s.onerror=()=>setStatus("Retrieve request was blocked or failed.",false);
  document.body.appendChild(s);setStatus("Looking for saved work…",null);
}
function finish(){
  const data=requireIdentity();if(!data)return;
  const qs=allQuestions(),score=qs.filter(q=>state.accepted[q.id]).length,total=qs.length,percent=Math.round(score/total*100);
  saveCloud("submitted");
  document.getElementById("finalResult").innerHTML=`<div class="receipt"><h2>Submission Complete</h2><p><b>${escapeHtml(data.name)}</b> — Period ${escapeHtml(data.period)}</p><p style="font-size:30px;margin:10px 0"><b>${score} / ${total} (${percent}%)</b></p><p>Keep this screen visible until your teacher confirms completion.</p></div>`;
  window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}

document.getElementById("saveBtn").addEventListener("click",()=>saveCloud("in_progress"));
document.getElementById("retrieveBtn").addEventListener("click",retrieveCloud);
document.getElementById("finishBtn").addEventListener("click",finish);
["studentName","period","email"].forEach(id=>document.getElementById(id).addEventListener("input",()=>{state.dirty=true;saveLocal();}));
setInterval(()=>{if(state.dirty&&document.getElementById("email").value.trim()&&SCRIPT_URL&&!SCRIPT_URL.includes("PASTE_"))saveCloud("in_progress");},30000);
render();
