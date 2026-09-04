/* =========================================================
   Declaration of Independence Research
   GitHub worksheet + Apps Script save/retrieve backend
   ========================================================= */

/* Paste the deployed Apps Script /exec URL between the quotes later. */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyAkahbkT3Tn7wVxAap3EqF1uhnB2iJF9hm6pnuUueHkBibHUgZg2R8ZVEHE-Gky6y7/exec";

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
        "hint": "Use the National Archives history page. Read the first section and identify the delegate chosen to write the first draft.",
        "sources": [
          {
            "label": "Use this source: National Archives — Who wrote the Declaration?",
            "url": "https://www.archives.gov/founding-docs/declaration-history"
          }
        ]
      },
      {
        "id": "d02",
        "display": "2",
        "prompt": "What committee helped draft the document alongside him?",
        "hint": "Use the National Archives history page. Find the five-person drafting committee and give its name.",
        "sources": [
          {
            "label": "Use this source: National Archives — The five-member drafting committee",
            "url": "https://www.archives.gov/founding-docs/declaration-history"
          }
        ]
      },
      {
        "id": "d03",
        "display": "3",
        "prompt": "Why did the Continental Congress feel it was necessary to write a formal declaration in 1776?",
        "hint": "Use the short Office of the Historian overview. Explain both the break from Britain and why announcing it to other nations mattered.",
        "sources": [
          {
            "label": "Use this source: U.S. Office of the Historian — Why declare independence?",
            "url": "https://history.state.gov/milestones/1776-1783/declaration"
          }
        ]
      },
      {
        "id": "d04",
        "display": "4",
        "prompt": "How did the Enlightenment influence the writing of the Declaration?",
        "hint": "Use the Khan Academy background article. Look for natural rights, consent of the governed, and John Locke.",
        "sources": [
          {
            "label": "Use this source: Khan Academy — Ideas behind the Declaration",
            "url": "https://www.khanacademy.org/humanities/us-history/road-to-revolution/x71a94f19%3Agrowing-discontent/a/philosophical-foundations-of-the-american-revolution"
          }
        ]
      },
      {
        "id": "d05",
        "display": "5",
        "prompt": "What earlier colonial experiences or events (for example taxes or protests) influenced the decision to separate?",
        "hint": "Use the Office of the Historian overview. Choose at least one tax, protest, or British response and explain how it increased conflict.",
        "sources": [
          {
            "label": "Use this source: U.S. Office of the Historian — Taxes and colonial protests",
            "url": "https://history.state.gov/milestones/1750-1775/parliamentary-taxation"
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
        "hint": "Use the guided Khan Academy excerpt. In the second paragraph, identify what governments are created to secure.",
        "sources": [
          {
            "label": "Use this source: Khan Academy — Guided opening paragraphs",
            "url": "https://www.khanacademy.org/humanities/constitution-101/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-the-ideas-and-events-that-led-to-change/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-equality-liberty-and-the-pursuit-of-happiness/a/primary-source-the-declaration-of-independence-opening-paragraphs"
          }
        ]
      },
      {
        "id": "d07",
        "display": "7",
        "prompt": "What does the Declaration say people can do if their government becomes destructive of their rights?",
        "hint": "Use the guided Khan Academy excerpt. Find the sentence beginning “whenever any Form of Government” and explain the two actions people may take.",
        "sources": [
          {
            "label": "Use this source: Khan Academy — What people may do to a destructive government",
            "url": "https://www.khanacademy.org/humanities/constitution-101/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-the-ideas-and-events-that-led-to-change/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-equality-liberty-and-the-pursuit-of-happiness/a/primary-source-the-declaration-of-independence-opening-paragraphs"
          }
        ]
      },
      {
        "id": "d08",
        "display": "8",
        "prompt": "What does “all men are created equal” mean in the context of 1776?",
        "hint": "Use the Khan Academy background article. Explain the equality ideal and then identify who did not receive equal rights in 1776.",
        "sources": [
          {
            "label": "Use this source: Khan Academy — Equality and its limits in 1776",
            "url": "https://www.khanacademy.org/humanities/constitution-101/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-the-ideas-and-events-that-led-to-change/x7a03a96a83aa80ff%3Athe-declaration-of-independence/a/background-the-declaration-of-independence"
          }
        ]
      },
      {
        "id": "d09",
        "display": "9",
        "prompt": "How does Jefferson describe the “unalienable rights”? List them.",
        "hint": "Use the guided Khan Academy excerpt. Find “unalienable Rights” and list the three examples that follow.",
        "sources": [
          {
            "label": "Use this source: Khan Academy — Guided natural-rights passage",
            "url": "https://www.khanacademy.org/humanities/constitution-101/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-the-ideas-and-events-that-led-to-change/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-equality-liberty-and-the-pursuit-of-happiness/a/primary-source-the-declaration-of-independence-opening-paragraphs"
          }
        ]
      },
      {
        "id": "d10",
        "display": "10",
        "prompt": "How does the Declaration connect consent of the governed to legitimate government power?",
        "hint": "Use the guided Khan Academy excerpt. Find the phrase explaining where governments get their “just powers.”",
        "sources": [
          {
            "label": "Use this source: Khan Academy — Consent of the governed explained",
            "url": "https://www.khanacademy.org/humanities/constitution-101/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-the-ideas-and-events-that-led-to-change/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-equality-liberty-and-the-pursuit-of-happiness/a/primary-source-the-declaration-of-independence-opening-paragraphs"
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
        "hint": "Use the Constitution Center’s short introduction. It directly names the ruler against whom the grievances were written.",
        "sources": [
          {
            "label": "Use this source: Constitution Center — Who the grievances were against",
            "url": "https://constitutioncenter.org/education/classroom-resource-library/classroom/primary-source-declaration-of-independence"
          }
        ]
      },
      {
        "id": "d12",
        "display": "12",
        "prompt": "Name three taxes or laws that colonists were protesting.",
        "hint": "Use the Office of the Historian explainer. Name three measures discussed there, such as the Sugar, Currency, Stamp, Townshend, Tea, or Intolerable Acts.",
        "sources": [
          {
            "label": "Use this source: U.S. Office of the Historian — Taxes and Parliamentary acts",
            "url": "https://history.state.gov/milestones/1750-1775/parliamentary-taxation"
          }
        ]
      },
      {
        "id": "d13",
        "display": "13",
        "prompt": "How does Jefferson describe King George III’s treatment of colonial legislatures?",
        "hint": "Use the Khan Academy guided grievance page. Look for examples involving refused laws, dissolved representative houses, or blocked representation.",
        "sources": [
          {
            "label": "Use this source: Khan Academy — Guided list of grievances",
            "url": "https://www.khanacademy.org/humanities/constitution-101/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-the-ideas-and-events-that-led-to-change/x7a03a96a83aa80ff%3Athe-reasons-for-the-revolution/a/primary-source-the-declaration-of-independence-list-of-grievances"
          }
        ]
      },
      {
        "id": "d14",
        "display": "14",
        "prompt": "What does the Declaration say about the King and the administration of justice?",
        "hint": "Use the Khan Academy guided grievance page. Find the grievance about obstructing justice and explain how judges were affected.",
        "sources": [
          {
            "label": "Use this source: Khan Academy — Justice and judges grievances explained",
            "url": "https://www.khanacademy.org/humanities/constitution-101/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-the-ideas-and-events-that-led-to-change/x7a03a96a83aa80ff%3Athe-reasons-for-the-revolution/a/primary-source-the-declaration-of-independence-list-of-grievances"
          }
        ]
      },
      {
        "id": "d15",
        "display": "15",
        "prompt": "Which grievance deals with the presence of British troops in the colonies?",
        "hint": "Use the Khan Academy guided grievance page. Find the complaints about standing armies or quartering armed troops.",
        "sources": [
          {
            "label": "Use this source: Khan Academy — Standing armies and quartering grievances",
            "url": "https://www.khanacademy.org/humanities/constitution-101/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-the-ideas-and-events-that-led-to-change/x7a03a96a83aa80ff%3Athe-reasons-for-the-revolution/a/primary-source-the-declaration-of-independence-list-of-grievances"
          }
        ]
      },
      {
        "id": "d16",
        "display": "16",
        "prompt": "How does the Declaration describe the King’s role in waging war against the colonies?",
        "hint": "Use the Khan Academy guided grievance page. Summarize one complaint involving violence, foreign mercenaries, captured colonists, or attacks on towns.",
        "sources": [
          {
            "label": "Use this source: Khan Academy — Wartime grievances in student-friendly sections",
            "url": "https://www.khanacademy.org/humanities/constitution-101/x7a03a96a83aa80ff%3Aprinciples-of-the-american-revolution-the-ideas-and-events-that-led-to-change/x7a03a96a83aa80ff%3Athe-reasons-for-the-revolution/a/primary-source-the-declaration-of-independence-list-of-grievances"
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
        "hint": "Use the National Archives overview. Find the date Congress adopted the Declaration—not the later date when most delegates signed it.",
        "sources": [
          {
            "label": "Use this source: National Archives — Adoption date and background",
            "url": "https://www.archives.gov/milestone-documents/declaration-of-independence"
          }
        ]
      },
      {
        "id": "d18",
        "display": "18",
        "prompt": "What colonies were represented in signing the Declaration?",
        "hint": "Use the Constitution Center list. Count or name the colonies shown as represented by the signers.",
        "sources": [
          {
            "label": "Use this source: Constitution Center — Signers organized by colony",
            "url": "https://constitutioncenter.org/education/classroom-resource-library/classroom/declaration-of-independence"
          }
        ]
      },
      {
        "id": "d19",
        "display": "19",
        "prompt": "How many delegates signed the document?",
        "hint": "Use the Constitution Center overview. It states the total number of delegates who eventually signed.",
        "sources": [
          {
            "label": "Use this source: Constitution Center — How many delegates signed?",
            "url": "https://constitutioncenter.org/declaration/about-the-declaration-of-independence"
          }
        ]
      },
      {
        "id": "d20",
        "display": "20",
        "prompt": "What risks did the signers face by endorsing the Declaration?",
        "hint": "Use the National Archives history page. Explain why publicly supporting independence could be treated as treason and what the signers pledged to risk.",
        "sources": [
          {
            "label": "Use this source: National Archives — The signers’ pledge and risks",
            "url": "https://www.archives.gov/founding-docs/declaration-history"
          }
        ]
      },
      {
        "id": "d21",
        "display": "21",
        "prompt": "Who was the first to sign, and why is his signature the most famous?",
        "hint": "Use the Constitution Center overview. Identify the president of Congress whose large, centered signature became the most recognizable.",
        "sources": [
          {
            "label": "Use this source: Constitution Center — John Hancock’s famous signature",
            "url": "https://constitutioncenter.org/declaration/about-the-declaration-of-independence"
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
        "hint": "Use Monticello’s visual timeline. Choose one country or movement and explain how it repeated or applied the Declaration’s equality and rights language.",
        "sources": [
          {
            "label": "Use this source: Monticello — The Declaration around the world",
            "url": "https://www.monticello.org/declaration/"
          }
        ]
      },
      {
        "id": "d23",
        "display": "23",
        "prompt": "What role did the Declaration play in shaping the new U.S. Constitution?",
        "hint": "Use the Khan Academy comparison. Connect the Declaration’s ideals—equality, rights, and consent—to the government created by the Constitution.",
        "sources": [
          {
            "label": "Use this source: Khan Academy — Declaration ideals and the Constitution",
            "url": "https://www.khanacademy.org/humanities/us-government-and-civics/us-gov-foundations/us-gov-ideals-of-democracy/a/democratic-ideals-in-the-declaration-of-independence-and-the-constitution"
          }
        ]
      },
      {
        "id": "d24",
        "display": "24",
        "prompt": "How does the Declaration reflect Enlightenment ideas from thinkers like John Locke?",
        "hint": "Use the Khan Academy philosophy explainer. Compare Locke’s natural rights and social contract ideas with the Declaration’s language.",
        "sources": [
          {
            "label": "Use this source: Khan Academy — John Locke and revolutionary ideas",
            "url": "https://www.khanacademy.org/humanities/us-history/road-to-revolution/x71a94f19%3Agrowing-discontent/a/philosophical-foundations-of-the-american-revolution"
          }
        ]
      },
      {
        "id": "d25",
        "display": "25",
        "prompt": "In what ways did the Declaration fall short of its ideals in 1776 (for example slavery, women, or Native Americans)?",
        "hint": "Use Monticello’s short article. Identify at least one group denied the liberty proclaimed in the Declaration and explain the contradiction.",
        "sources": [
          {
            "label": "Use this source: Monticello — Liberty, slavery, and excluded groups",
            "url": "https://www.monticello.org/slavery/jefferson-slavery/thomas-jefferson-liberty-slavery"
          }
        ]
      },
      {
        "id": "d26",
        "display": "26",
        "prompt": "How did abolitionists later use the Declaration in their arguments?",
        "hint": "Use the Constitution Center article. Look for how Black Americans and antislavery writers treated equality as a promise the nation had to fulfill.",
        "sources": [
          {
            "label": "Use this source: Constitution Center — Equality and early antislavery arguments",
            "url": "https://constitutioncenter.org/blog/constitutional-voices-african-americans-early-responses-to-the-declaration-of-independence"
          }
        ]
      },
      {
        "id": "d27",
        "display": "27",
        "prompt": "How has the phrase “all men are created equal” been reinterpreted over time?",
        "hint": "Use Monticello’s visual timeline. Compare the 1776 meaning with one later use by abolitionists, women’s-rights advocates, or civil-rights leaders.",
        "sources": [
          {
            "label": "Use this source: Monticello — How equality expanded over time",
            "url": "https://www.monticello.org/declaration/"
          }
        ]
      },
      {
        "id": "d28",
        "display": "28",
        "prompt": "Which civil rights leader famously referenced the Declaration in a major speech?",
        "hint": "Use Stanford’s King Institute page. Find the leader who called the Declaration’s equality statement the nation’s creed in “I Have a Dream.”",
        "sources": [
          {
            "label": "Use this source: Stanford King Institute — “I Have a Dream” and the Declaration",
            "url": "https://kinginstitute.stanford.edu/publications/autobiography-martin-luther-king-jr/chapter-20-march-washington"
          }
        ]
      },
      {
        "id": "d29",
        "display": "29",
        "prompt": "Where is the original Declaration kept today?",
        "hint": "Use the National Archives Museum page. Give the institution and the room/building where the original is displayed.",
        "sources": [
          {
            "label": "Use this source: National Archives Museum — Where the original is displayed",
            "url": "https://visit.archives.gov/"
          }
        ]
      },
      {
        "id": "d30",
        "display": "30",
        "prompt": "Why do you think the Declaration remains a powerful symbol of democracy and freedom?",
        "hint": "Use Monticello’s visual timeline for examples, then give your own judgment. Explain why its ideas still matter and support your answer with one example.",
        "sources": [
          {
            "label": "Use this source: Monticello — The Declaration’s continuing influence",
            "url": "https://www.monticello.org/declaration/"
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
      "President of Congress",
      "President of the Congress",
      "President of Continental Congress",
      "President of the Continental Congress",
      "because he was president",
      "status as president",
      "in the middle",
      "placed in the middle",
      "signature was in the middle"
    ]
  ],
  "minConcepts": 2
},
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
