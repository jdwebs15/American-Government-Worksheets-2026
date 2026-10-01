(function(){
// Aligned to ODE Updated Review (2).pdf, CS 8, page 5.
// Listed elements of Amendments 1, 2, 4, 5, 6, 8, and 10, plus teacher-requested incorporation/Gideon application.
window.BLOCK_CONFIG={assignmentKey:"gov-cs8-review-mc-2026-v3",title:"CS 8 Comprehensive Review — Bill of Rights",description:"Content Statement 8 • Apply the listed Bill of Rights protections, including incorporation and Gideon.",practice:"Apply religion, assembly, press, petition, speech, arms, search and seizure, probable cause, self-incrimination, double jeopardy, criminal-trial rights, punishment limits, reserved powers, and incorporation into state and local government."};
const raw=[
  [
    "r01",
    "First Amendment",
    "Congress makes it a crime to criticize a federal policy peacefully. Which protection is most directly threatened?",
    [
      "Freedom of speech",
      "Freedom of assembly",
      "Freedom of religion",
      "The right to petition"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read Amendment I’s protection for speech.",
    "Peaceful criticism of government is protected speech."
  ],
  [
    "r02",
    "First Amendment",
    "Congress declares one religion the official national religion. Which First Amendment protection is most directly violated?",
    [
      "Protection against establishing a religion",
      "Protection for peaceful political assembly",
      "Protection for publishing news reports",
      "Protection for petitions to government"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read Amendment I’s opening religion clause.",
    "The First Amendment prevents Congress from establishing an official religion."
  ],
  [
    "r03",
    "First Amendment",
    "A federal law punishes people solely for attending a peaceful worship service. Which liberty provides the most direct challenge?",
    [
      "Free exercise of religion",
      "Freedom of political speech",
      "Freedom of the press",
      "The right to petition"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Find the free-exercise clause in Amendment I.",
    "Peaceful worship is protected by the free exercise of religion."
  ],
  [
    "r04",
    "First Amendment",
    "Federal officials order a newspaper to stop publishing accurate reports about government waste simply because the reports are embarrassing. Which freedom is most directly threatened?",
    [
      "Freedom of the press",
      "Freedom of assembly",
      "Freedom of religion",
      "The right to bear arms"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Locate the press protection in Amendment I.",
    "Freedom of the press protects reporting and criticism of government."
  ],
  [
    "r05",
    "First Amendment",
    "A federal agency bans a peaceful group meeting solely because the group opposes its policy. Which liberty is most directly threatened?",
    [
      "Freedom of peaceful assembly",
      "The right to petition for policy changes",
      "The right to keep and bear arms",
      "The right to a public criminal trial"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Locate the right to assemble peaceably in Amendment I.",
    "People may gather peacefully to express views about government."
  ],
  [
    "r06",
    "First Amendment",
    "Residents send Congress a signed request to repeal a law. Which First Amendment right are they exercising?",
    [
      "The right to petition",
      "Freedom of the press",
      "Free exercise of religion",
      "The right to a jury trial"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read the final protected activity in Amendment I.",
    "A request that government address a complaint or change policy is a petition."
  ],
  [
    "r07",
    "First Amendment",
    "A group meets peacefully outside a federal office and delivers a written request to change a rule. Which pair of rights best matches these actions?",
    [
      "Assembly and petition",
      "Religion and press",
      "Counsel and confrontation",
      "Speech and bearing arms"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Compare peaceful assembly and petition in Amendment I.",
    "The gathering exercises assembly; the request exercises petition."
  ],
  [
    "r08",
    "First Amendment",
    "Which federal government action most clearly violates freedom of speech?",
    [
      "Arresting a peaceful speaker for criticizing Congress",
      "Applying a neutral traffic rule near a public gathering",
      "Providing a lawyer for an accused criminal defendant",
      "Obtaining a warrant based on evidence of a crime"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Use Amendment I to identify punishment for peaceful expression.",
    "Government cannot punish a person merely for peaceful criticism of Congress."
  ],
  [
    "r09",
    "First Amendment",
    "A federal official says citizens may practice only the religion the official approves. Which response best applies the First Amendment?",
    [
      "People have freedom to practice their religion",
      "Officials may control religious practice by personal preference",
      "Religious freedom protects only newspaper publishers",
      "Religious freedom depends on approval from Congress"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read the religion protections in Amendment I.",
    "Government cannot decide which peaceful religious beliefs people are allowed to practice."
  ],
  [
    "r10",
    "First Amendment — incorporation",
    "A city jails a resident solely for peaceful criticism of the mayor. Which statement best explains the constitutional protection?",
    [
      "The First Amendment protects speech, and incorporation applies it to local government",
      "The First Amendment protects speech, but only federal officials must respect it",
      "The First Amendment protects assembly, so a person speaking alone has no protection",
      "The First Amendment protects the press, so only newspapers may criticize officials"
    ],
    "https://www.archives.gov/milestone-documents/14th-amendment",
    "Use the reference passage and Section 1 of the Fourteenth Amendment.",
    "Through incorporation under the Fourteenth Amendment, the First Amendment’s speech protection applies to state and local governments."
  ],
  [
    "r11",
    "Second Amendment",
    "A federal law broadly restricts an individual’s ability to keep and bear arms. Which amendment is most directly involved?",
    [
      "Second Amendment",
      "First Amendment",
      "Fourth Amendment",
      "Sixth Amendment"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read the right named in Amendment II.",
    "Restrictions on keeping and bearing arms raise Second Amendment questions."
  ],
  [
    "r12",
    "Second Amendment",
    "Which right is expressly protected by the Second Amendment?",
    [
      "Keeping and bearing arms",
      "Receiving a speedy public trial",
      "Refusing compelled self-incrimination",
      "Petitioning the government"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read the final clause of Amendment II.",
    "The Second Amendment protects the right to keep and bear arms."
  ],
  [
    "r13",
    "Second Amendment — incorporation",
    "A state argues that the right to keep and bear arms can never restrict its laws because the Bill of Rights originally limited only federal government. Which response best applies incorporation?",
    [
      "The Second Amendment’s arms protection also applies to states",
      "The Second Amendment applies only to federal government",
      "The Second Amendment protects only public criminal trials",
      "The Second Amendment guarantees every state law is valid"
    ],
    "https://www.archives.gov/milestone-documents/14th-amendment",
    "Use the reference passage about incorporation and identify the right in Amendment II.",
    "Incorporation applies the Second Amendment’s right to keep and bear arms to state governments; particular regulations still require constitutional analysis."
  ],
  [
    "r14",
    "Fourth Amendment",
    "Without a warrant or emergency, federal officers force entry into a home merely to see whether they can find evidence. Which protection is most directly involved?",
    [
      "Protection against unreasonable searches and seizures",
      "Protection against compelled self-incrimination",
      "The right to confront an accuser in a criminal trial",
      "The right to receive a speedy and public trial"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read Amendment IV’s protection for houses.",
    "An unsupported exploratory home search raises the Fourth Amendment protection against unreasonable searches."
  ],
  [
    "r15",
    "Fourth Amendment",
    "Federal officers want a judge to issue a search warrant. Which condition must they establish?",
    [
      "Probable cause",
      "A criminal conviction",
      "A jury’s unanimous verdict",
      "The suspect’s confession"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Find the warrant requirement in Amendment IV.",
    "The Fourth Amendment requires probable cause before a warrant may issue."
  ],
  [
    "r16",
    "Fourth Amendment",
    "Which evidence best supports probable cause for a search warrant?",
    [
      "Reliable facts connect evidence of a crime to the home",
      "An officer dislikes the homeowner’s political opinions",
      "The homeowner has never attended a public meeting",
      "A neighbor objects to the homeowner’s religion"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Connect the warrant requirement in Amendment IV to evidence of a crime.",
    "Probable cause rests on facts supporting a reasonable basis to believe evidence of a crime will be found."
  ],
  [
    "r17",
    "Fourth Amendment",
    "A federal officer asks for a warrant based only on an unsupported guess that a person might have committed a crime. What is the strongest objection?",
    [
      "The request does not establish probable cause",
      "The request prevents a speedy criminal trial",
      "The request violates the right to bear arms",
      "The request prevents peaceful assembly"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Look for probable cause in Amendment IV.",
    "An unsupported guess alone does not establish probable cause for a warrant."
  ],
  [
    "r18",
    "Fourth Amendment",
    "Federal officers take a person’s belongings during an unjustified search. Which amendment protects against this unreasonable seizure?",
    [
      "Fourth Amendment",
      "Second Amendment",
      "Sixth Amendment",
      "Tenth Amendment"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read Amendment IV’s protection against searches and seizures.",
    "The Fourth Amendment protects against unreasonable searches and seizures of belongings."
  ],
  [
    "r19",
    "Fourth Amendment — incorporation",
    "State officers search a home without a warrant, probable cause, or any valid exception. Officials claim the Fourth Amendment limits only federal officers. Which response is most accurate?",
    [
      "Its search protection applies to state officers through incorporation",
      "Its search protection applies only to federal officers",
      "Its trial protection allows state officers to search any home",
      "Its speech protection requires a confession before any search"
    ],
    "https://www.archives.gov/milestone-documents/14th-amendment",
    "Use the reference passage and the Fourth Amendment’s search-and-seizure protection.",
    "The Fourth Amendment’s protection against unreasonable searches applies to state and local government through incorporation."
  ],
  [
    "r20",
    "Fourth Amendment",
    "Which statement correctly explains the Fourth Amendment?",
    [
      "It bars unreasonable searches and requires probable cause for warrants",
      "It bars every search, even a reasonable search under a valid warrant",
      "It allows warrants whenever an official dislikes a person’s opinions",
      "It permits warrants based entirely on an officer’s unsupported guess"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read both the search-and-seizure protection and warrant clause in Amendment IV.",
    "The Fourth Amendment bars unreasonable searches; warrants require probable cause."
  ],
  [
    "r21",
    "Fifth Amendment",
    "A jury acquits a defendant. The same government immediately prosecutes that person again for the same offense because it dislikes the verdict. Which protection applies?",
    [
      "Protection against double jeopardy",
      "The right to a speedy trial",
      "The right to confront accusers",
      "Freedom of peaceful assembly"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Find the same-offense protection in Amendment V.",
    "Double jeopardy generally bars a second prosecution by the same government for the same offense after acquittal."
  ],
  [
    "r22",
    "Fifth Amendment",
    "Investigators threaten a suspect with punishment unless the suspect gives testimony admitting personal guilt. Which protection is most directly involved?",
    [
      "Protection against compelled self-incrimination",
      "Protection against an unreasonable search",
      "The right to be informed of criminal charges",
      "The right to keep and bear arms"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read Amendment V’s clause about being a witness against oneself.",
    "The Fifth Amendment protects against being compelled to provide self-incriminating testimony."
  ],
  [
    "r23",
    "Fifth Amendment",
    "During a criminal proceeding, an accused person refuses to answer a question that would admit personal guilt. Which protection is being exercised?",
    [
      "The privilege against self-incrimination",
      "The guarantee of a public criminal trial",
      "The freedom to petition elected officials",
      "The guarantee of an impartial trial jury"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Locate the self-incrimination protection in Amendment V.",
    "A person may invoke the privilege against compelled self-incrimination."
  ],
  [
    "r24",
    "Fifth Amendment — incorporation",
    "After an acquittal, the same state prosecutes a defendant again for the same offense simply to seek a different verdict. Which statement correctly applies the Bill of Rights?",
    [
      "The Fifth Amendment’s double-jeopardy protection applies to states through incorporation",
      "The Fifth Amendment’s double-jeopardy protection limits federal prosecutions alone",
      "The Sixth Amendment’s counsel protection allows unlimited repeated prosecutions",
      "The Tenth Amendment allows states to ignore incorporated criminal protections"
    ],
    "https://www.archives.gov/milestone-documents/14th-amendment",
    "Use the reference passage and the same-offense clause of Amendment V.",
    "The Fifth Amendment’s protection against double jeopardy applies to state prosecutions through incorporation. Its self-incrimination protection also applies to states."
  ],
  [
    "r25",
    "Fifth Amendment",
    "Which action most directly violates the protection against self-incrimination?",
    [
      "Forcing the accused to testify to personal guilt",
      "Requiring officers to show probable cause for a warrant",
      "Informing the accused of the criminal charge before trial",
      "Allowing the accused to question a prosecution witness"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read the compelled-witness clause in Amendment V.",
    "Government may not compel the accused to give self-incriminating testimony."
  ],
  [
    "r26",
    "Fifth Amendment",
    "How do self-incrimination and double-jeopardy protections differ?",
    [
      "One limits compelled testimony; the other limits repeated prosecution",
      "One guarantees a public trial; the other guarantees legal counsel",
      "One protects peaceful worship; the other protects newspaper reports",
      "One requires probable cause; the other reserves powers to states"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Compare the compelled-testimony and same-offense clauses in Amendment V.",
    "Self-incrimination concerns compelled testimony against oneself; double jeopardy concerns repeated prosecution for the same offense."
  ],
  [
    "r27",
    "Sixth Amendment",
    "A defendant learns the criminal charge only after the trial ends. Which Sixth Amendment guarantee was denied?",
    [
      "The right to be informed of the accusation",
      "The right to confront prosecution witnesses",
      "The right to receive assistance of counsel",
      "The right to have an impartial jury"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Find the notice-of-accusation clause in Amendment VI.",
    "An accused person must be informed of the nature and cause of the accusation."
  ],
  [
    "r28",
    "Sixth Amendment",
    "A criminal case is delayed for years solely because the government refuses to schedule it. Which guarantee is most directly threatened?",
    [
      "The right to a speedy trial",
      "The right to a public trial",
      "The right to legal counsel",
      "The right to confront accusers"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read the first trial guarantee in Amendment VI.",
    "The speedy-trial guarantee protects against unjustified government delay."
  ],
  [
    "r29",
    "Sixth Amendment",
    "The prosecution presents a witness, but the court forbids the defendant from questioning that witness. Which right is most directly denied?",
    [
      "The right to confront accusers",
      "The right to be informed of charges",
      "The right to a speedy trial",
      "The right to an impartial jury"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Find the witness-confrontation clause in Amendment VI.",
    "Confrontation allows the accused to challenge testimony offered against them."
  ],
  [
    "r30",
    "Sixth Amendment — Gideon",
    "In Gideon v. Wainwright, the Supreme Court ruled that a defendant who could not afford a lawyer in a state felony trial had to be provided one. Which explanation best connects the amendments?",
    [
      "The Sixth protects counsel; the Fourteenth applies that protection to states",
      "The Sixth protects public trials; the Fourteenth permits denial of counsel",
      "The Fifth protects speech; the Tenth applies that protection to states",
      "The Eighth protects counsel; the Second applies that protection to states"
    ],
    "https://www.uscourts.gov/about-federal-courts/educational-resources/educational-activities/sixth-amendment-activities/gideon-v-wainwright/facts-and-case-summary-gideon-v-wainwright",
    "Read the Reasoning section about the Sixth and Fourteenth Amendments.",
    "Gideon applied the Sixth Amendment right to counsel to states through the Fourteenth Amendment’s Due Process Clause."
  ],
  [
    "r31",
    "Sixth Amendment",
    "Jurors announce before hearing evidence that the accused is guilty and nothing will change their minds. Which right is most directly threatened?",
    [
      "The right to an impartial jury",
      "The right to confront an accuser",
      "The right to know the charge",
      "The right to a public trial"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Locate the impartial-jury requirement in Amendment VI.",
    "An impartial jury must judge the case without improper bias or a predetermined verdict."
  ],
  [
    "r32",
    "Sixth Amendment",
    "A criminal court closes the entire trial to the public without a valid justification. Which guarantee is most directly threatened?",
    [
      "The right to a public trial",
      "The right to a speedy trial",
      "The right to legal counsel",
      "The right to know the charges"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Find public trial near the beginning of Amendment VI.",
    "The Sixth Amendment protects a public criminal trial."
  ],
  [
    "r33",
    "Sixth Amendment",
    "Which pair of protections most directly helps an accused person understand the accusation and receive legal help?",
    [
      "Notice of charges and assistance of counsel",
      "A speedy trial and freedom of peaceful assembly",
      "An impartial jury and the right to keep and bear arms",
      "A public trial and the freedom to publish news reports"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Compare notice of the accusation and assistance of counsel in Amendment VI.",
    "Notice explains the accusation; counsel provides legal help in preparing a defense."
  ],
  [
    "r34",
    "Incorporation — required rights",
    "Which statement best explains the doctrine of incorporation?",
    [
      "It applies most Bill of Rights protections to states through the Fourteenth Amendment",
      "It applies every Bill of Rights provision to states without exceptions",
      "It lets states disregard constitutional rights whenever officials approve",
      "It transfers all reserved powers from states to the federal government"
    ],
    "https://www.archives.gov/milestone-documents/14th-amendment",
    "Use the reference passage and Section 1 of the Fourteenth Amendment.",
    "The Supreme Court has used the Fourteenth Amendment’s Due Process Clause to apply most Bill of Rights guarantees to state and local governments."
  ],
  [
    "r35",
    "Sixth Amendment",
    "A federal criminal trial is prompt and open to the public, but jurors are openly biased against the accused. Which guarantee remains unfulfilled?",
    [
      "An impartial jury",
      "A speedy trial",
      "A public trial",
      "Notice of the charges"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Distinguish impartiality from speed and public access in Amendment VI.",
    "A trial can be speedy and public while still failing to provide an impartial jury."
  ],
  [
    "r36",
    "Eighth Amendment",
    "Officials deliberately impose a barbaric punishment after a criminal conviction. Which protection is most directly involved?",
    [
      "The ban on cruel and unusual punishment",
      "The right to confront a prosecution witness",
      "The right to be informed of an accusation",
      "The protection against compelled testimony"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read Amendment VIII’s final prohibition.",
    "The Eighth Amendment prohibits cruel and unusual punishment."
  ],
  [
    "r37",
    "Eighth Amendment",
    "A prisoner challenges a deliberately torturous punishment. Which amendment provides the most direct basis for the challenge?",
    [
      "Eighth Amendment",
      "Fourth Amendment",
      "Second Amendment",
      "Tenth Amendment"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Locate cruel and unusual punishment in Amendment VIII.",
    "A deliberately torturous punishment raises the Eighth Amendment’s ban on cruel and unusual punishment."
  ],
  [
    "r38",
    "Eighth Amendment — incorporation",
    "A state prison deliberately imposes a torturous punishment. Officials say the Eighth Amendment restricts only federal prisons. Which response correctly applies incorporation?",
    [
      "The ban on cruel and unusual punishment applies to states too",
      "The ban on cruel and unusual punishment applies only federally",
      "The right to a speedy trial allows any punishment after conviction",
      "The right to bear arms replaces punishment protections in state prisons"
    ],
    "https://www.archives.gov/milestone-documents/14th-amendment",
    "Use the reference passage and Amendment VIII’s punishment protection.",
    "Incorporation makes the Eighth Amendment’s ban on cruel and unusual punishment enforceable against state government."
  ],
  [
    "r39",
    "Tenth Amendment",
    "A power is neither delegated to the United States nor prohibited to the states by the Constitution. Where does the Tenth Amendment reserve it?",
    [
      "To the states or the people",
      "To the president alone",
      "To Congress alone",
      "To federal courts alone"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read Amendment X’s reserved-powers rule.",
    "The Tenth Amendment reserves undelegated powers to states or the people. It puts federalism on paper: authority is divided between national and state governments."
  ],
  [
    "r40",
    "Tenth Amendment — federalism",
    "A student calls the Tenth Amendment the Constitution’s \"on paper\" statement of federalism. Which explanation best supports that description?",
    [
      "It reserves undelegated powers to states or the people, reinforcing divided authority",
      "It gives Congress every power not expressly listed in the Constitution",
      "It requires states to receive permission from the president before exercising any power",
      "It assigns all national and state governing powers to one central government"
    ],
    "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
    "Read Amendment X and connect reserved powers to authority divided between national and state governments.",
    "The Tenth Amendment puts federalism on paper by reserving powers not delegated to the United States, nor prohibited to states, to states or the people. Federalism divides authority between national and state governments."
  ]
];
// Keep the existing deterministic shuffle so saved letter positions never drift on reload.
let seed=80402026;
function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function positions(){let p=Array.from({length:raw.length},(_,i)=>i%4);do{p=shuffle(p)}while(p.some((v,i)=>i>1&&p[i-1]===v&&p[i-2]===v));return p}
const ordered=shuffle(raw),pos=positions();
window.BLOCK_QUESTIONS=ordered.map((r,n)=>{
const correct=r[3][0],wrong=shuffle(r[3].slice(1)),answer=pos[n],choices=wrong.slice();choices.splice(answer,0,correct);
const passage=['r10','r13','r19','r24','r34','r38'].includes(r[0])?'The Bill of Rights originally restricted federal government. Through selective incorporation, the Supreme Court has used the Fourteenth Amendment’s Due Process Clause to apply most Bill of Rights protections to state and local government. The rights assessed here under the First, Second, Fourth, Fifth, Sixth, and Eighth Amendments apply to states. The Tenth Amendment concerns reserved powers, rather than an incorporated individual right.':'';
return{passage,id:r[0],cs:"CS 8",topic:r[1],prompt:r[2],choices,answer,source:r[4],where:r[5],explanation:r[6],hint:`Use the supporting source. ${r[5]}`};
});
})();
