const Q=(term,definition,wrong,hint,explain,area='CS 8 • Bill of Rights')=>({area,stem:`Which definition best matches ${term}?`,answer:definition,choices:[definition,...wrong],hint,explain});
const W=['a power held only by Congress','a procedure for amending the Constitution','a rule for electing the president'];
const questions=[
Q('Bill of Rights','the first ten amendments protecting liberties and limiting federal power',W,'Think Amendments 1–10.','The Bill of Rights lists important protections against government action.'),
Q('civil liberties','fundamental freedoms protected from government interference',W,'Think protected freedom.','Civil liberties limit government interference with individual freedom.'),
Q('freedom of speech','the right to express ideas and opinions',['the right to own any property','the right to avoid every law','the right to vote in every election'],'Think expression.','The First Amendment protects speech from improper government restriction.'),
Q('freedom of religion','protection for religious belief and practice and against government establishment',['a guarantee that government funds every religion','a ban on private religious practice','a right to ignore neutral laws'],'Think establishment and free exercise.','The First Amendment contains both religion clauses.'),
Q('establishment clause','the First Amendment rule against government establishment of religion',W,'Government may not establish an official religion.','The Establishment Clause limits government sponsorship of religion.'),
Q('free exercise clause','the First Amendment protection for practicing religion',W,'Think freedom to exercise belief.','The Free Exercise Clause protects religious practice, subject to lawful limits.'),
Q('freedom of the press','the right to publish news and opinions without improper government censorship',W,'Think newspapers and journalists.','The First Amendment protects press freedom.'),
Q('freedom of assembly','the right to gather peacefully for a common purpose',W,'Think peaceful gathering.','The First Amendment protects peaceful assembly.'),
Q('right to petition','the right to ask government to correct a problem or change policy',W,'Think requests to government.','Petition allows people to seek a redress of grievances.'),
Q('right to bear arms','the Second Amendment protection involving keeping and carrying arms',W,'Think Amendment 2.','The Second Amendment protects the right to keep and bear arms.'),
Q('unreasonable search and seizure','a government search or taking that lacks adequate legal justification',W,'Think privacy and police searches.','The Fourth Amendment bars unreasonable searches and seizures.'),
Q('search warrant','a court order authorizing a particular search',W,'A judge issues it.','A warrant must rest on probable cause and describe the search.'),
Q('probable cause','reasonable grounds supporting a search, arrest, or warrant',W,'More than a mere guess.','The Fourth Amendment requires probable cause for warrants.'),
Q('self-incrimination','giving testimony or evidence that could expose oneself to criminal guilt',W,'Think being a witness against yourself.','The Fifth Amendment protects against compelled self-incrimination.'),
Q('double jeopardy','being tried twice for the same offense after jeopardy has ended',W,'Same offense, second prosecution.','The Fifth Amendment protects against double jeopardy.'),
Q('due process','fair legal procedures before government deprives life liberty or property',W,'Think fair process.','The Fifth Amendment guarantees due process by the federal government.'),
Q('speedy trial','a criminal trial without unreasonable government delay',W,'Delay is the clue.','The Sixth Amendment protects a speedy trial.'),
Q('public trial','a criminal trial generally open to public observation',W,'Think openness.','The Sixth Amendment protects a public trial.'),
Q('impartial jury','jurors who are fair and unbiased',W,'Impartial means unbiased.','The Sixth Amendment requires an impartial jury.'),
Q('notice of charges','the right of an accused person to know the accusation',W,'A defendant must know what to defend against.','The Sixth Amendment requires information about the charges.'),
Q('confrontation right','the right to face and challenge opposing witnesses',W,'Think cross-examining an accuser.','The Sixth Amendment protects confrontation of witnesses.'),
Q('right to counsel','the right to assistance from a lawyer in a criminal defense',W,'Counsel means attorney.','The Sixth Amendment protects legal assistance for the accused.'),
Q('cruel and unusual punishment','punishment forbidden by the Eighth Amendment because of its unconstitutional severity or character',W,'Think Amendment 8.','The Eighth Amendment prohibits cruel and unusual punishment.'),
Q('delegated powers','powers granted to the federal government by the Constitution',W,'Delegated means given.','The Constitution delegates specified powers to the federal government.'),
Q('reserved powers','undelegated powers kept by the states or the people',['powers held only by federal courts','powers created by executive order','powers denied to every government'],'Think Tenth Amendment.','The Tenth Amendment reserves undelegated powers to states or the people.'),
Q('Tenth Amendment','the amendment reserving undelegated powers to states or the people',W,'Think federalism.','The Tenth Amendment reinforces the constitutional division of power.')
];
launchMasteryGame({title:'CS 8 Bill of Rights Vocabulary',subtitle:'Master the essential language of civil liberties and the First, Second, Fourth, Fifth, Sixth, Eighth, and Tenth Amendments.',assignmentKey:'gov-cs8-vocabulary-2026-v1',questions,linger:3200});
