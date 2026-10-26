/**
 * 사건 27 (src/nodes/case27.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c27_start": {
      "title": "Friday Night’s Screenshot",
      "text": "Before you’ve even sat down at your Risk Management Department desk, your phone rings. 6:50 in the morning: Na Junhyuk. 'There’s a line in Gunsan. Since four this morning. About 180 people now.' Since Friday night, he says, a single screenshot has been going around every local group chat. One line: Gunsan’s Saebom Credit Union (a small neighborhood co-op owned by its members) is caught in real-estate project financing (PF) and won’t make it through the month. The screenshot doesn’t say which construction site, but you know. The Pyeongtaek officetel KD Capital led; Saebom Credit Union put 6 billion won into it. A bank run moves faster than the facts. Na Junhyuk catches his breath. 'The first desk I ever sat at after I joined the bank was in Gunsan. I’m going down today. I’m bringing my seals.'",
      "memo": [
        "About 180 waiting outside Saebom Credit Union -- since 04:00",
        "Subordinated stake in the Pyeongtaek officetel PF: 6 billion won",
        "Where the rumor began: one screenshot in a local group chat, Friday night",
        "4,812 members, about 130 billion won in deposits"
      ],
      "choices": {
        "c27_start_visit": {
          "label": "Take the first bus to Gunsan; meet the people in line first"
        },
        "c27_start_numbers": {
          "label": "First check what Saebom put into Pyeongtaek, and its rank"
        },
        "c27_start_report": {
          "label": "Report it up to Risk Management; leave it to the Group"
        },
        "reframe": {
          "label": "Ask how it ended for co-ops that saw lines like this"
        }
      },
      "place": "KD Capital Headquarters, 12th Floor · Risk Management Department",
      "clock": "May 4 · Monday · Before Dawn 06:50",
      "question": "One screenshot has put a line outside a small financial co-op in Gunsan. What do you do first?",
      "lead": "A month since you moved to KD Capital’s Risk Management Department, and the photo on your ID badge is still your Trigger Lab face."
    },
    "c27_queue": {
      "title": "Stamped Number Tickets",
      "text": "The moment the banking hall doors open at 9 a.m., the number-ticket machine spits out paper up to No. 187 and jams. When you arrive at 11 a.m., Executive Director Namgoong Sol is calling the people in line one by one, by name. 'Auntie Hyesook, how are your knees? Uncle Jungho, your boat didn’t go out today, I see.' The talk that she knows all 4,812 members by name is no exaggeration. Na Junhyuk writes numbers on the backs of deposit slips and stamps three seals on each in turn, handing them out in place of tickets. With 30 years of practice, not one seal is crooked, and from the back of the line one more rumor starts: 'Tickets with the branch manager’s stamp get served first.' One old man takes just the stamp and heads home, saying 'That’ll do, this’ll do.' Namgoong Sol laughs, then looks toward the vault behind the counter. Today’s cash on hand is 1.4 billion won, and the line has passed 300.",
      "memo": [
        "Number-ticket machine jammed at No. 187 -- handwritten tickets after that",
        "312 waiting by morning, average withdrawal request 19 million won",
        "Vault cash on hand 1.4 billion won -- gone by 2 p.m.",
        "Na Junhyuk’s three seals: Branch Manager · Inspected · Verified"
      ],
      "choices": {
        "c27_queue_post": {
          "label": "Post Saebom’s Pyeongtaek stake and cash on the hall wall"
        },
        "c27_queue_explain": {
          "label": "Explain the deposit insurance limit to each person in line"
        },
        "c27_queue_open": {
          "label": "Open every window and pay out fast, as asked"
        },
        "reframe": {
          "label": "Ask how it ended for co-ops that saw lines like this"
        },
        "c27_queue_evidence_turn": {
          "label": "Open the full log of the chat where the screenshot began"
        }
      },
      "place": "Saebom Credit Union, Gunsan · Banking Hall",
      "clock": "May 4 · Monday 11:00",
      "question": "The vault’s cash runs out by two in the afternoon, and the line has passed 300. How do you meet this line?",
      "lead": "Three hours on the road bring you to an alley in downtown Gunsan, where people stand wrapped all the way around Saebom Credit Union’s 3-story building."
    },
    "c27_rumor": {
      "title": "Gray Speech Bubbles",
      "text": "Saebom Credit Union is closed; only the light in the executive director’s office is on. Lee Minseo, now at KD Data Lab in Pangyo, has traced the screenshot backward and joins by video call. It was first posted at 11:14 on Friday night in a Gunsan parents’ group chat and spread to 31 rooms within two hours. 'But the original of this screenshot isn’t a group chat.' She enlarges the screen. Gray speech bubbles, a small shield icon in the top right, a read count of 14. You take out your phone and open KD Capital’s in-house messenger. The bubble color, the shield icon: the same. Beside the blurred-out name, a team name is half visible. 'Real Estate Fin…'. Na Junhyuk, wearing a balloon hat the kids from the church next door put on him, silently makes one more cup of instant coffee.",
      "memo": [
        "First post: Friday 23:14, a Gunsan parents’ group chat",
        "Spread to 31 rooms within two hours",
        "Screenshot screen = KD Capital in-house messenger screen",
        "Team name beside the blurred sender: 'Real Estate Fin…'"
      ],
      "choices": {
        "c27_rumor_hold": {
          "label": "Keep the screenshot and use it as a bargaining chip"
        },
        "c27_rumor_trace": {
          "label": "Verify the source chat and sender through audit procedure"
        },
        "c27_rumor_tell": {
          "label": "Tell those who pulled money out where the rumor came from"
        },
        "reframe": {
          "label": "Ask how it ended for co-ops that saw lines like this"
        },
        "c27_rumor_evidence_turn": {
          "label": "Open the full log of the chat where the screenshot began"
        }
      },
      "place": "Saebom Credit Union, Gunsan · Executive Director’s Office",
      "clock": "May 5 · Children’s Day · Closed",
      "question": "The rumor’s screenshot looks exactly like your own company’s in-house messenger. How do you use this fact?",
      "lead": "It’s Children’s Day, so the banking hall is closed, and through the office window you can see balloons in the yard of the church next door."
    },
    "c27_offer": {
      "title": "38 Percent",
      "text": "An 'emergency support plan' in the name of KD Capital’s Real Estate Finance Team lands in Namgoong Sol’s inbox. It offers to buy the 6 billion won Saebom put into Pyeongtaek, a subordinated stake (last in line for repayment), at 38%. 2.28 billion won in cash today, signature by 18:00. The loss comes out of member capital first, and unlike deposits, member capital isn’t protected. Just then the banking hall door opens and Kwon Dohyun walks in. He’s from Bridge Bank, next after KD Capital in line to be repaid on the Pyeongtaek project, and he says he took leave to come. He draws a vertical line down the back of a number ticket and writes out the recovery rates. If construction restarts, 71%; sell today, 38%. 'At this price, it isn’t a loss. It’s plunder.' Namgoong Sol scrolls the email to the end. The signature field for the officer in charge is blank.",
      "memo": [
        "KD Capital offer: buy the 6 billion won subordinated stake at 38% (2.28 billion won)",
        "Signature deadline: Thursday 18:00",
        "Kwon Dohyun’s math: 71% recovery rate if construction restarts",
        "Loss of 3.72 billion won -- cut from member capital first"
      ],
      "choices": {
        "c27_offer_stand": {
          "label": "Stand by Namgoong Sol: don’t sell the stake, hold out"
        },
        "c27_offer_table": {
          "label": "Put Kwon Dohyun’s recovery math to the board officially"
        },
        "c27_offer_sell": {
          "label": "Urge selling today, even at 38%, to raise cash first"
        },
        "reframe": {
          "label": "Ask how it ended for co-ops that saw lines like this"
        },
        "c27_offer_evidence_turn": {
          "label": "Open the full log of the chat where the screenshot began"
        }
      },
      "place": "Saebom Credit Union, Gunsan · 2nd-Floor Meeting Room",
      "clock": "May 7 · Thursday 07:10",
      "question": "Six days after the rumor spread, an offer has come to buy the Pyeongtaek stake at 38%. What do you say?",
      "lead": "Namgoong Sol, who has slept in the banking hall two nights running, jolts upright at the sound of an email alert."
    },
    "c27_final": {
      "title": "Parents’ Day Morning",
      "text": "Seven board members gather in the 3rd-floor meeting room of Saebom Credit Union. The line outside the window is already 140 people long, and those near the front wear paper carnations, folded last night, pinned to their chests. Three sheets of paper lie on the table. A proposal from KD Financial Group to deposit 10 billion won, with, in small print at the very bottom of its conditions field, 'consultation on selling the Pyeongtaek subordinated stake.' Namgoong Sol’s draft notice, putting Saebom’s Pyeongtaek stake and the original messenger screenshot out in full in the credit union’s name. And an application asking the financial authorities to allow a daily withdrawal limit. One must be chosen before the banking hall doors open at 9. Namgoong Sol looks at you. 'My father held out for three days, they say. I have to decide how to hold out today. In the names of the people in that line.'",
      "memo": [
        "Group deposit offer 10 billion won -- condition: consultation on selling the Pyeongtaek stake",
        "Full-disclosure draft notice -- original screenshot included",
        "Withdrawal limit application -- 5 million won per person per day",
        "Banking hall opens 09:00, 140 waiting"
      ],
      "choices": {
        "c27_final_open": {
          "label": "Before opening, post the Pyeongtaek stake and the original screenshot"
        },
        "c27_final_limit": {
          "label": "Ask the authorities to cap withdrawals at 5 million won a day"
        },
        "c27_final_fund": {
          "label": "Stop today’s line with the Group’s 10 billion; fight terms later"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Saebom Credit Union, Gunsan · 3rd-Floor Boardroom",
      "clock": "May 8 · Parents’ Day · 07:30",
      "question": "Group money, full disclosure, or a withdrawal limit: with one of them you must get through today. What do you do?",
      "lead": "The elders at the front of the line outside wear paper carnations on their chests, and a few of those flowers have perfectly square corners."
    },
    "c27_aftershock": {
      "title": "Twelve Bowls of Jjamppong",
      "text": "Friday, 4 p.m.: the shutter comes down. The last number ticket was No. 412, and after it, thirty-eight people came to put their money back. Saebom Credit Union’s executive director, Namgoong Sol, orders twelve bowls of jjamppong from the Chinese restaurant by the station. Kwon Dohyun of Bridge Bank, who took leave to come down, writes the price of one bowl beside today’s returned deposits, then says, 'This isn’t a field for me to calculate,' and picks up his chopsticks. Na Junhyuk tucks one stamped number ticket into his wallet next to a coupon from the stuffed-squid restaurant. 'Best stamping I’ve done in 30 years.' Grandma Ha Junghee, a member, walks past with her carnation still on, waving a new passbook. Just then a message comes from Do Yoonha. 'Starting next week they’re sending me to the KD Life call center. The script they gave me in advance has the word refusal in it 14 times.'",
      "memo": [
        "Last number ticket: No. 412",
        "38 members put their money back",
        "12 bowls of jjamppong -- Namgoong Sol paying",
        "Do Yoonha: sent to the KD Life call center next week, 'refusal' 14 times in the script"
      ],
      "choices": {
        "c27_after_warm": {
          "label": "Stay in Gunsan a day longer; greet all who come back"
        },
        "c27_after_rush": {
          "label": "Take the screenshot straight up to KD Capital’s Real Estate Finance"
        },
        "c27_after_record": {
          "label": "File the screenshot and 38% offer as a rumor damage report"
        }
      },
      "place": "Saebom Credit Union, Gunsan · Alley Behind the Lowered Shutter",
      "clock": "May 8 · Parents’ Day · 16:00",
      "question": "The line is over and the jjamppong is going cold, and news has come from the next post. How do you close this evening?"
    },
    "c27_savings": {
      "title": "Two Months to Maturity",
      "text": "2 p.m., and it’s 74-year-old Grandma Ha Junghee’s turn. An installment savings account she has paid into for nearly 3 years for her grandchild’s college tuition: 24 million won, two months from maturity. Break it now and more than half the interest is gone. Namgoong Sol takes her hand and explains slowly. These savings fall under deposit insurance (repayment guaranteed up to 100 million won even if the institution closes), so not a single won will vanish. Grandma Ha nods, then starts to cry. 'Sol, I trust you. But my son in Seoul saw the news and says take it out right now. I have to listen to my child too.' The hand gripping her passbook trembles.",
      "memo": [
        "Ha Junghee (74), savings 24 million won -- two months before maturity",
        "Early termination: more than half the interest lost",
        "Deposit insurance limit 100 million won -- fully covered"
      ],
      "choices": {
        "c27_savings_choice_1": {
          "label": "Call her son and explain why the savings are safe"
        },
        "c27_savings_choice_2": {
          "label": "Show her how to borrow just what she needs, savings intact"
        },
        "c27_savings_choice_3": {
          "label": "Close the account quickly, as she wishes"
        }
      },
      "place": "Saebom Credit Union, Gunsan · Window 3",
      "clock": "May 4 · Monday 14:10",
      "question": "A grandmother is in tears as she moves to break protected savings two months early. What do you do?"
    },
    "c27_returns": {
      "title": "A Black Plastic Bag",
      "text": "Around Wednesday lunchtime, Boss Kwak from the fish market, in rubber boots, pushes in against the line carrying a black plastic bag. Tipped out on the counter, the bag spills bundles of 50,000-won notes: the 30 million won taken out on Monday. 'Seein’ Sol’s face, I reckon it’s gotta go back in. Can’t sleep with it at home.' Laughter bursts out at the back of the line. By afternoon, seventeen people have come to put money back. Stamping deposit slips, Na Junhyuk tells each one 'Welcome back,' until his voice catches. Still, the line is 200 long, and three times as much money is going out as coming in.",
      "memo": [
        "17 redeposits -- Boss Kwak’s 30 million won the first",
        "About 200 waiting on Wednesday",
        "Withdrawals three times redeposits"
      ],
      "choices": {
        "c27_returns_choice_1": {
          "label": "Give returning depositors their own line, put up front"
        },
        "c27_returns_choice_3": {
          "label": "Quietly take what comes in; wait for the rumor to fade"
        },
        "c27_returns_choice_2": {
          "label": "Post official preferential terms for members who return"
        }
      },
      "place": "Saebom Credit Union, Gunsan · Banking Hall",
      "clock": "May 6 · Wednesday 12:30",
      "question": "Some have brought their money back, but three times as much is still going out. How do you greet those who returned?"
    },
    "c27_carnation": {
      "title": "Carnations Like Blueprints",
      "text": "Thursday, 10 p.m.: colored paper piles up on the banking hall table. Tomorrow is Parents’ Day, and Namgoong Sol has said she wants to pin carnations on the elders waiting in line. With the hands that stamped all day, Na Junhyuk folds petal tips without a hair’s error. The carnations Kwon Dohyun folds have exactly six petals and every corner square, so Namgoong Sol laughs: 'These aren’t flowers, they’re blueprints.' A box of cup noodles from Kang Taemin arrives by courier. As the laughter fades, Namgoong Sol puts down her paper. 'Tomorrow, while I pin these on, I may have to tell them there’s a limit.'",
      "memo": [
        "Target: 150 paper carnations",
        "Kwon Dohyun’s carnations: 6 petals, all corners square",
        "Kang Taemin’s delivery: a box of cup noodles"
      ],
      "choices": {
        "c27_carnation_choice_3": {
          "label": "Set the carnations aside; draft the limit notice first"
        },
        "c27_carnation_choice_1": {
          "label": "Suggest pinning carnations on the elders in line tomorrow"
        },
        "c27_carnation_choice_2": {
          "label": "Stay up together on tomorrow morning’s board materials"
        }
      },
      "place": "Saebom Credit Union, Gunsan · Banking Hall Table",
      "clock": "May 7 · Thursday 22:00",
      "question": "Tomorrow you may have to pin a carnation and a limit notice on the elders together. How do you spend tonight?"
    },
    "c27_savings_reaction": {
      "title": "A Blanket from 1998",
      "text": "9 p.m.: scraps of number tickets lie scattered across the shuttered banking hall. Money out on the first day: 3.8 billion won. Sitting on a waiting-area chair, Namgoong Sol points to a black-and-white photo on the wall. A man sitting on a blanket spread on the floor of this same banking hall. 'That’s my father. He was executive director here in 1998. A rumor went around back then too, and he slept here three nights, they say. Boiling barley tea for the people in line.' She smiles. 'The people who stood in line then are our aunties and uncles now. They stood in line again today. I’m glad my father didn’t live to see this.'",
      "memo": [
        "1998 banking hall photo -- the former executive director on a blanket",
        "Those who stood in line then stood again today"
      ],
      "choices": {
        "c27_savings_reaction_choice_3": {
          "label": "Go back to your lodging, rest, and return early tomorrow"
        },
        "c27_savings_reaction_choice_2": {
          "label": "Polish the explanation for Wednesday’s windows together"
        },
        "c27_savings_reaction_choice_1": {
          "label": "Keep watch over the banking hall with Namgoong Sol tonight"
        }
      },
      "place": "Saebom Credit Union, Gunsan · Shuttered Banking Hall",
      "clock": "May 4 · Monday 21:00",
      "question": "The daughter of the man who guarded this hall on a blanket in 1998 means to stay alone tonight. What do you do?"
    },
    "c27_returns_reaction": {
      "title": "Friday Night, Monday Morning",
      "text": "In the evening, Ban Jaewook, who was in Jeonju on his regional rotation for Internal Audit, drives over. In the parking lot he opens his notebook. In just 1 year, the same rumor went around three small financial co-ops in North Jeolla. One line: caught in a half-built construction site, they won’t make it through the month. All three, within a month, sold their stakes in that site to KD Capital for a pittance, and one of them was merged into another co-op the next year, its name gone. Ban Jaewook stops his pen. 'Every time, the rumor went around on a Friday night. And every time, on Monday morning, the same company called.'",
      "memo": [
        "Three small co-ops in North Jeolla -- same rumor, same buyer",
        "Rumor Friday night, call Monday morning"
      ],
      "choices": {
        "c27_returns_reaction_choice_2": {
          "label": "Request the three sale records as official audit material"
        },
        "c27_returns_reaction_choice_1": {
          "label": "Ask people at the three co-ops if the same thing happened"
        },
        "c27_returns_reaction_choice_3": {
          "label": "Leave the past alone; focus on protecting Saebom"
        }
      },
      "place": "Saebom Credit Union, Gunsan · Parking Lot",
      "clock": "May 6 · Wednesday 19:00",
      "question": "In 1 year the same rumor passed through three co-ops and led to the same company. What do you do with this pattern?"
    },
    "c27_carnation_reaction": {
      "title": "One Word: Closed",
      "text": "11 p.m., and someone knocks on the shutter. Grandma Ha Junghee stands there holding a bundle of dried bakdae (a Gunsan flatfish) and her closed savings passbook. 'Yesterday I heard Boss Kwak put the money back, and I couldn’t sleep.' She sets the passbook on the table. 'I called my son and gave him a scolding. Told him Mom’s money is Mom’s business. Can this be brought back? I meant to take it out right when my grandchild starts school.' On the passbook’s last line are printed Monday’s date and one word: 'Closed.' Instead of answering, Namgoong Sol takes the grandmother’s hand first.",
      "memo": [
        "A closed savings passbook and a bundle of dried bakdae",
        "Maturity timed to her grandchild’s school entrance"
      ],
      "choices": {
        "c27_carnation_reaction_choice_2": {
          "label": "If it can’t be revived, explain why simply, in writing"
        },
        "c27_carnation_reaction_choice_1": {
          "label": "Find a way to revive the closed savings on the original terms"
        },
        "c27_carnation_reaction_choice_3": {
          "label": "Just take the bakdae tonight; new savings another day"
        }
      },
      "place": "Saebom Credit Union, Gunsan · In Front of the Shutter",
      "clock": "May 7 · Thursday 23:00",
      "question": "Holding her closed savings passbook, the grandmother asks if it can be brought back. How do you answer?"
    },
    "c27_branch_vault": {
      "title": "The Sound of Counting Bills",
      "text": "Tucking the screenshot deep into your phone, you step out of the executive director’s office to find the vault door half open. Namgoong Sol and Na Junhyuk are running two bill counters, counting the cash on hand for Wednesday morning. The calculator’s numbers shrink faster than the banded 50,000-won bundles pile up. Cash left: 920 million won. To draw the money held at the Central Federation in cash, they must wait for the armored truck at 10 a.m. Wednesday. Na Junhyuk stops in the middle of banding a stack. 'In 30 years, this is the first time the sound of counting money has scared me.' Namgoong Sol stops the counter. 'Within an hour of opening, all of this goes out.'",
      "memo": [
        "Vault balance 920 million won",
        "Central Federation cash transport: Wednesday 10:00",
        "Monday withdrawals 3.8 billion won, Tuesday closed",
        "One-hour gap from opening at 09:00 to the truck’s arrival"
      ],
      "choices": {
        "c27_branch_vault_a": {
          "label": "Explain the situation at the windows until the truck comes"
        },
        "c27_branch_vault_b": {
          "label": "Post remaining cash and the Federation’s schedule for members"
        },
        "c27_branch_vault_c": {
          "label": "Open an hour late, timed to the truck’s arrival"
        }
      },
      "place": "Saebom Credit Union, Gunsan · Basement Vault",
      "clock": "May 5 · Children’s Day · 23:40",
      "question": "You’re counting cash that will run out an hour after opening. How do you hold out until the truck comes?"
    },
    "c27_branch_vault_follow": {
      "title": "Boxes Through the Front Door",
      "text": "Wednesday, 10:02 a.m.: the armored cash truck pulls up in the alley in front of the banking hall. Na Junhyuk asks the guards a favor: bring the money boxes in not through the back door but through the front, right before the eyes of the people in line. As six gray boxes pass between them, the line stirs. 'Money’s comin’ in.' 'That all real?' A few people fold their number tickets into their pockets and turn away. Beside you, Namgoong Sol speaks quietly. 'Those boxes are borrowed from the Central Federation. Money with interest on it. It’s good to show them, but people can’t go thinking that was our own money.'",
      "memo": [
        "6 cash boxes -- emergency borrowing from the Central Federation",
        "23 left the line after the front-door delivery",
        "Borrowing interest 4.1% a year",
        "Na Junhyuk: 'Showing is explaining too'"
      ],
      "choices": {
        "c27_branch_vault_follow_a": {
          "label": "Tell the line honestly the boxes are borrowed money too"
        },
        "c27_branch_vault_follow_c": {
          "label": "Showing worked; save the explanation until the line clears"
        },
        "c27_branch_vault_follow_b": {
          "label": "Report the Federation borrowing terms to the board first"
        }
      },
      "place": "Saebom Credit Union, Gunsan · Alley in Front of the Banking Hall",
      "clock": "May 6 · Wednesday 10:02",
      "question": "The money boxes carried past the line are actually borrowed money. When do you say so?"
    },
    "c27_route_system": {
      "title": "The Rumor’s Discount Rate",
      "text": "Turning your back on the line in the banking hall, you ask what became of co-ops that saw lines like this. On a KD Capital terminal, the Group’s AI review engine, NOAH, answers. Of 34 bank runs at small financial co-ops nationwide over the past 10 years, 29 began with rumors whose source was never found. In 21 of those, the PF stake the co-op held passed to a large financial company for a pittance within three months. All of them were subordinated stakes. Only six records have the buyer’s name filled in. 'Rumors are learned not as causes but as discount rates. The faster the rumor, the lower the price.'",
      "memo": [
        "Of 34 small co-op bank runs, 29 from rumors of unknown source",
        "21 fire sales within three months",
        "6 with the buyer on record"
      ],
      "choices": {
        "c27_route_system_publish": {
          "label": "Release the stats to Saebom’s hall and local press at once"
        },
        "c27_route_system_warn": {
          "label": "Find former members of the 21 sold-off co-ops and tell them"
        },
        "c27_route_system_drop": {
          "label": "Bury the stats; use them only to survive this week’s line"
        },
        "c27_route_system_evidence_turn": {
          "label": "Open the full log of the chat where the screenshot began"
        }
      },
      "place": "KD Capital Headquarters, 12th Floor · Risk Management Terminal",
      "clock": "May 5 · Children’s Day · Before Dawn 01:20",
      "question": "Bank runs at small co-ops usually ended with a price tag. What do you do with these stats?"
    },
    "c27_final_system_route": {
      "title": "Six Records with Names",
      "text": "Parents’ Day, five in the morning: NOAH’s table remains on the remote terminal in the executive director’s office. Of the 21 fire sales, six have the buyer’s name written down; for the other 15, there is no knowing who bought. Outside the window, folding chairs are already starting to appear. On the desk lies the 'emergency support plan' KD Capital sent yesterday, an offer to buy Saebom’s 6 billion won Pyeongtaek stake at 38%. Saebom Credit Union’s executive director, Namgoong Sol, brings the member register and sets it beside the terminal. A book with all 4,812 names written in, not one missing. NOAH compares the two lists. 'The names of those who deposited are all on record. The names of the companies that bought are blank in 15 of 21 cases. The blank side set the price.'",
      "memo": [
        "21 fire sales -- 6 with the buyer on record",
        "Saebom Credit Union, 4,812 members",
        "Banking hall opens: today 09:00"
      ],
      "choices": {
        "c27_final_system_route_c": {
          "label": "Collect damage claims for members hurt by the rumor"
        },
        "c27_final_system_route_a": {
          "label": "Propose a 3-month ban on buying rumor-hit co-op assets"
        },
        "c27_final_system_route_b": {
          "label": "Skip the rule; just get Saebom a higher sale price"
        }
      },
      "place": "Saebom Credit Union, Gunsan · Remote Terminal, Executive Director’s Office",
      "clock": "May 8 · Parents’ Day · Before Dawn 05:10",
      "question": "The names of those who deposited are all there, but the buyers’ names are missing. Who do you make write those names?"
    },
    "c27_evidence_turn": {
      "title": "The Price Written Before the Rumor",
      "text": "When you set the clue against the screenshot’s timestamp, the chat’s full log opens. An in-house chat of KD Capital’s Real Estate Finance Team, Friday, 10:52 p.m. Team Head Koo Seungmin posts a table. Of the seven backers of the Pyeongtaek project, only Saebom Credit Union’s row is shaded red. 'One line out front and this lot dumps it on their own.' 22 minutes later, that screen appears as a single screenshot in a Gunsan parents’ group chat. Pinned at the top of the chat is a document created on April 28. 'Saebom subordinated stake disposal plan: buy at 38%, then fold into the Roundhill bundle.' The idea: buy Saebom’s stake cheap and slip it into the Roundhill bulk sale (bad assets sold off all at once as one bundle). The approver field is blank. Ban Jaewook closes his notebook. 'The price tag came first, and the rumor was the glue to stick it on.'",
      "memo": [
        "Chat post 22:52 → parents’ group chat 23:14",
        "Disposal plan written April 28 -- three days ahead of the rumor",
        "'Fold into the Roundhill bulk-sale bundle', approver field blank"
      ],
      "choices": {
        "c27_evidence_turn_hold": {
          "label": "Hold the plan and wait until the Roundhill deal surfaces"
        },
        "c27_evidence_turn_assembly": {
          "label": "Release the plan verbatim at Saebom’s general meeting"
        },
        "c27_evidence_turn_share": {
          "label": "Show the plan first to members who fled over the rumor"
        }
      },
      "place": "Saebom Credit Union, Gunsan · Records Room, Executive Director’s Office",
      "clock": "May 8 · Parents’ Day · 06:00",
      "question": "Saebom’s price was set three days before the rumor. How do you use this record?"
    },
    "c27_start_warm": {
      "title": "A Bank Run for the One Who Stayed",
      "text": "Ten days after you stayed through the night beside the people at the Pyeongtaek site, your jacket still has cement dust on it. Before dawn on May 4, the phone in that jacket pocket rings. It’s Na Junhyuk. 'There’s been a line in Gunsan since four this morning. I’m heading down with my seals.' The rumor that started Friday night is one line: Gunsan’s Saebom Credit Union (a small neighborhood co-op owned by its members) is caught in real-estate project financing (PF) and won’t make it through the month. It doesn’t say which construction site. You’re the one who saw the stalled tower crane with your own eyes. On that crane hangs 6 billion won of Saebom members’ money. The bank run is about to bring people down before the crane does.",
      "memo": [
        "About 180 waiting outside Saebom Credit Union -- since 04:00",
        "Subordinated stake in the Pyeongtaek officetel PF: 6 billion won",
        "Na Junhyuk: his first post as a banker was Gunsan"
      ],
      "choices": {
        "c27_start_warm_visit": {
          "label": "Take the first bus to Gunsan; meet the people in line first"
        },
        "c27_start_warm_numbers": {
          "label": "First check what Saebom put into Pyeongtaek, and its rank"
        },
        "c27_start_warm_report": {
          "label": "Report it up to Risk Management; leave it to the Group"
        },
        "c27_start_warm_signature": {
          "label": "Gather your Pyeongtaek comrades at the Gunsan line"
        },
        "c27_start_warm_reframe": {
          "label": "Ask how it ended for co-ops that saw lines like this"
        }
      },
      "place": "KD Capital Headquarters, 12th Floor · Risk Management Department",
      "clock": "May 4 · Monday · Before Dawn 06:50",
      "question": "The stalled crane you saw in Pyeongtaek has become a line in Gunsan. Who do you stand with in front of that line?",
      "lead": "Since you came back from the Pyeongtaek site, you haven’t washed that jacket once."
    },
    "c27_start_record": {
      "title": "A Bank Run for the One Who Kept the Record",
      "text": "What you saw at the Pyeongtaek site, you put in writing, down to a table of the project’s seven backers and how much each put in. Before dawn on May 4, Ban Jaewook, in Jeonju on his regional rotation for Internal Audit, sends you a screenshot. One line: Gunsan’s Saebom Credit Union (a small neighborhood co-op owned by its members) is caught in real-estate project financing (PF) and won’t make it through the month. The table beneath it, with only the site name erased, matches page 3 of your document down to the last cell. A line has stood outside Saebom since four this morning. A bank run. Na Junhyuk, whose first post was Gunsan, has packed his seals and is already on his way down. Ban Jaewook adds: 'First we need to see whose hands your table passed through to reach a group chat in Gunsan.'",
      "memo": [
        "Table in the screenshot = page 3 of your document",
        "About 180 waiting outside Saebom Credit Union",
        "Ban Jaewook: in Jeonju on his regional rotation for Internal Audit"
      ],
      "choices": {
        "c27_start_record_signature": {
          "label": "Tell Saebom first that my document’s table fed the rumor"
        },
        "c27_start_record_visit": {
          "label": "Take the first bus to Gunsan; meet the people in line first"
        },
        "c27_start_record_report": {
          "label": "Report it up to Risk Management; leave it to the Group"
        },
        "c27_start_record_numbers": {
          "label": "First check what Saebom put into Pyeongtaek, and its rank"
        },
        "c27_start_record_reframe": {
          "label": "Ask how it ended for co-ops that saw lines like this"
        }
      },
      "place": "KD Capital Headquarters, 12th Floor · Risk Management Department",
      "clock": "May 4 · Monday · Before Dawn 06:50",
      "question": "The table you compiled was used to back the rumor. What do you do about it?",
      "lead": "When you enlarge the screenshot Ban Jaewook sent, you can see the cell spacing of the table you laid out yourself."
    },
    "c27_start_rush": {
      "title": "A Bank Run for the One Who Came Back First",
      "text": "On the Friday night you left Pyeongtaek behind and came straight back to headquarters, messenger alerts kept chiming from the Real Estate Finance Team’s side of the partition. A week later, at 11 on Friday night, as you stayed late on the 12th floor working through agenda items, an alert chimed again beyond you, and someone laughed low. Monday, 6:50 in the morning, Na Junhyuk calls. 'There’s a line in Gunsan. Already 180 people. I’m heading down with my seals.' The screenshot going around since Friday night is one line: Gunsan’s Saebom Credit Union (a small neighborhood co-op owned by its members) is caught in real-estate project financing (PF) and won’t make it through the month. There’s no site name, but you know it’s Pyeongtaek. The bank run has begun. You hear that Friday-night laugh again.",
      "memo": [
        "Friday 23:00, messenger alerts at the Real Estate Finance Team’s desks",
        "About 180 waiting outside Saebom Credit Union",
        "Screenshot first posted: Friday 23:14"
      ],
      "choices": {
        "c27_start_rush_numbers": {
          "label": "First check what Saebom put into Pyeongtaek, and its rank"
        },
        "c27_start_rush_report": {
          "label": "Report it up to Risk Management; leave it to the Group"
        },
        "c27_start_rush_visit": {
          "label": "Take the first bus to Gunsan; meet the people in line first"
        },
        "c27_start_rush_signature": {
          "label": "Recall Friday’s messenger alerts and find that chat"
        },
        "c27_start_rush_reframe": {
          "label": "Ask how it ended for co-ops that saw lines like this"
        }
      },
      "place": "KD Capital Headquarters, 12th Floor · Risk Management Department",
      "clock": "May 4 · Monday · Before Dawn 06:50",
      "question": "The alerts from beyond the partition on Friday night come back to you. Where do you use that memory?",
      "lead": "In the seat where you stayed late on Friday night, you were the first to sit down early Monday morning."
    }
  },
  "echoReplies": {
    "c27_start_visit": "The first bus takes three hours. As it nears Gunsan, Na Junhyuk sends a photo of the line. It wraps once all the way around the block.",
    "c27_start_numbers": "The numbers show that Saebom is last in line in Pyeongtaek. Confirming it, you spend the whole bus ride to Gunsan flipping through documents.",
    "c27_start_report": "The report goes up in 10 minutes. The Group response team’s first reply is 'Monitoring the situation,' and meanwhile the line in Gunsan doubles.",
    "c27_queue_explain": "Explaining one by one slows the line. Of those who hear it, one in three folds the ticket and turns away.",
    "c27_queue_post": "The numbers on the wall are accurate. Some of the elders take out magnifying glasses; some say all those numbers make it scarier.",
    "c27_queue_open": "With every window open, the line shrinks fast. So does the vault. By 1 p.m. the vault floor is already showing.",
    "c27_rumor_tell": "You tell them, and the group chats erupt. 'A bank sank a bank?' Word that it isn’t confirmed yet spreads along with it.",
    "c27_rumor_trace": "The audit procedure is precise and slow. By the time the request is logged, the screenshot has moved on to its 32nd room.",
    "c27_rumor_hold": "Held back, it becomes a strong card. Until it’s played, the people who believed the rumor keep lining up.",
    "c27_offer_stand": "You hold out, and 18:00 passes. The 2.28 billion won never comes, and Friday morning’s line is still there.",
    "c27_offer_table": "Put on the record, it shows the board members the 71% recovery rate for the first time. Kwon Dohyun asks for a copy of the back of the number ticket. The original, he says, he’s keeping as a memento.",
    "c27_offer_sell": "You urge the sale, and Namgoong Sol sits before the signature field, pen in hand, until 18:00 passes. Selling would take 3.7 billion won out of member capital. That number, she says, she can’t decide alone without the board.",
    "c27_final_fund": "The 10 billion won comes in, and today’s line is gone by noon. The small print in the conditions field comes up as an agenda item at next Monday’s board meeting.",
    "c27_final_open": "The notice goes up, and people gather at the banking hall wall. Before the original screen of the screenshot that had only gone around group chats, Uncle Jungho crumples his number ticket: 'It was these guys?' Whether the line will shrink, no one knows yet.",
    "c27_final_limit": "The limit goes on, and the line stops. The elders wearing carnations receive 5-million-won envelopes and are told to come back the next day for the rest.",
    "c27_after_warm": "You stay, and on Saturday morning Boss Kwak from the fish market brings a box of dried bakdae. The bus to Seoul is Sunday’s last one.",
    "c27_after_record": "The report runs seven pages. The first page carries the date Grandma Ha Junghee broke her savings on Monday; the last page, the blank signature field.",
    "c27_after_rush": "You go straight up, and the Real Estate Finance Team’s desks on the 12th floor are dark. In the in-house messenger list, that chat has already vanished.",
    "c27_savings_choice_1": "Her son is silent on the phone a long while, then says, 'Put my mom on.' While that call takes 20 minutes, the line behind grows by 12.",
    "c27_savings_choice_2": "Borrowing against the savings protects the interest. Grandma Ha leafs through four pages of forms, puts down the pen saying 'This is scarier,' and says she’ll decide after talking to her son.",
    "c27_savings_choice_3": "Closing the account takes 3 minutes. Grandma Ha leaves hugging an envelope of cash to her chest, and on the passbook’s last line one word remains: 'Closed.'",
    "c27_returns_choice_1": "Once a separate deposit line forms, people watch it. Two of the onlookers quietly move over into that line.",
    "c27_returns_choice_2": "The notice is accurate. And the moment the words preferential terms appear, a few ask, 'So you’re that desperate?'",
    "c27_returns_choice_3": "Money taken in quietly piles up quietly. Boss Kwak is a little hurt that nobody knows about the comeback.",
    "c27_carnation_choice_1": "To pin them on in person, you’ll have to be there at six in the morning. Kwon Dohyun says, 'Then I’ll pin on the square carnations too.'",
    "c27_carnation_choice_2": "The materials are done at two in the morning. Half the carnations are left on the table, half folded.",
    "c27_carnation_choice_3": "The notice needs only half a page. Namgoong Sol rewrites that half page three times and deletes it all three times.",
    "c27_savings_reaction_choice_1": "As you keep watch together, Namgoong Sol boils barley tea. It was her father’s kettle, she says. Around three in the morning, you both fall asleep on the waiting-area chairs.",
    "c27_savings_reaction_choice_2": "The wording shrinks to three lines. 'It’s protected. Up to 100 million won. Auntie, your money won’t disappear.' Namgoong Sol writes in the last line herself.",
    "c27_savings_reaction_choice_3": "After resting, your head is clear. Namgoong Sol spends that night alone in the banking hall and greets you in the morning in the same clothes.",
    "c27_returns_reaction_choice_1": "A former executive director picks up and laughs for a long time. 'Somebody’s finally asking.' The voice belongs to the co-op whose name vanished.",
    "c27_returns_reaction_choice_2": "The request goes up under Ban Jaewook’s name. Who will read first a request from an auditor out on regional rotation, no one knows yet.",
    "c27_returns_reaction_choice_3": "As you focus on Saebom alone, today’s line shrinks a little. The story of the three co-ops stays only in Ban Jaewook’s notebook.",
    "c27_carnation_reaction_choice_1": "There is one way: Saebom absorbs the interest difference. Namgoong Sol writes her own name in that field.",
    "c27_carnation_reaction_choice_2": "The papers are accurate and kind. Grandma Ha reads to the end and laughs: 'So what you mean is, it can’t be done.'",
    "c27_carnation_reaction_choice_3": "The bakdae is delicious. Kwon Dohyun grills one, saying, 'This is a gift that needs no field.' The passbook goes back into Grandma Ha’s bag.",
    "c27_branch_vault_a": "You stand at the windows, and the first question comes right away. 'So is my money there or not?' Each answer takes 4 minutes a person.",
    "c27_branch_vault_b": "When 920 million won appears in the notice, the group chats go quiet, then loud again. Half say the number looks small; half say they’ll trust it because it’s honest.",
    "c27_branch_vault_c": "You open an hour late, and the line at the door grows an hour longer. A photo captioned 'Did they shut down?' goes up in the group chats.",
    "c27_branch_vault_follow_a": "You speak honestly, and a few people come back to the line. And Uncle Jungho tears up his ticket: 'Where else would borrow just to pay you?'",
    "c27_branch_vault_follow_b": "The report stays on record. The only ones who know it’s money with interest are the seven board members.",
    "c27_branch_vault_follow_c": "You hold off, and today’s line shrinks. People remember the six boxes as Saebom’s own money.",
    "c27_route_system_publish": "You publish, and the local paper picks it up first. The headline is 'Who Spread the Rumor?', and the article doesn’t yet name KD Capital.",
    "c27_route_system_warn": "You track them down, and former members of co-ops whose names vanished pick up. A few hang up, asking what good it does now.",
    "c27_route_system_drop": "You bury it, and this week holds. Where the next bank run will start, only NOAH knows.",
    "c27_final_system_route_a": "With the rule in place, the next rumor loses its value. This rumor has already fetched its full price.",
    "c27_final_system_route_b": "The price goes up a little. Those who spread the rumor earn a little less, and still earn.",
    "c27_final_system_route_c": "As the claims come in, the first line records the interest Grandma Ha Junghee lost breaking her savings two months early. Who will take the claims has not yet been decided.",
    "c27_evidence_turn_assembly": "When the original is read out at the meeting, the auditorium goes quiet. Someone repeats '38%,' and the number travels once around the room.",
    "c27_evidence_turn_hold": "Held back, the name Roundhill is useful on a bigger table. Meanwhile Saebom gets through Friday alone.",
    "c27_evidence_turn_share": "You show them, and those who pulled their money learn whose calculation they were used in. A few open new passbooks that afternoon.",
    "c27_queue_evidence_turn": "Scroll the chat all the way up, and a document written before the rumor is pinned there. Saebom’s price is already written in it.",
    "c27_rumor_evidence_turn": "Scroll the chat all the way up, and a document written before the rumor is pinned there. Saebom’s price is already written in it.",
    "c27_offer_evidence_turn": "Scroll the chat all the way up, and a document written before the rumor is pinned there. Saebom’s price is already written in it.",
    "c27_route_system_evidence_turn": "Scroll the chat all the way up, and a document written before the rumor is pinned there. Saebom’s price is already written in it.",
    "case27_memory_system": "The screenshot’s words bear no resemblance to your hand. What the tone resembles is the in-house messenger. NOAH pulls up the withdrawal crises that began with rumors of unknown source.",
    "case27_memory_evidence": "Set the date the advisory fee went out against the chat log, and a document three days older than the rumor is pinned there. It has the price put on Saebom.",
    "c27_start_warm_visit": "The first bus takes three hours. As it nears Gunsan, Na Junhyuk sends a photo of the line. It wraps once all the way around the block.",
    "c27_start_warm_numbers": "The numbers show that Saebom is last in line in Pyeongtaek. Confirming it, you spend the whole bus ride to Gunsan flipping through documents.",
    "c27_start_warm_report": "The report goes up in 10 minutes. The Group response team’s first reply is 'Monitoring the situation,' and meanwhile the line in Gunsan doubles.",
    "c27_start_warm_signature": "You call, and Kang Taemin answers first. 'How many cup noodles?' The others take half a day to get leave.",
    "c27_start_record_visit": "The first bus takes three hours. As it nears Gunsan, Na Junhyuk sends a photo of the line. It wraps once all the way around the block.",
    "c27_start_record_numbers": "The numbers show that Saebom is last in line in Pyeongtaek. Confirming it, you spend the whole bus ride to Gunsan flipping through documents.",
    "c27_start_record_report": "The report goes up in 10 minutes. The Group response team’s first reply is 'Monitoring the situation,' and meanwhile the line in Gunsan doubles.",
    "c27_start_record_signature": "You tell her, and Namgoong Sol looks at you a long while. Then she says, 'Then help me find who used that table, too.'",
    "c27_start_rush_visit": "The first bus takes three hours. As it nears Gunsan, Na Junhyuk sends a photo of the line. It wraps once all the way around the block.",
    "c27_start_rush_numbers": "The numbers show that Saebom is last in line in Pyeongtaek. Confirming it, you spend the whole bus ride to Gunsan flipping through documents.",
    "c27_start_rush_report": "The report goes up in 10 minutes. The Group response team’s first reply is 'Monitoring the situation,' and meanwhile the line in Gunsan doubles.",
    "c27_start_rush_signature": "You start looking, and you’re the only one left on the 12th floor. Meanwhile the line in Gunsan grows by 20 more."
  },
  "choiceVoiceLines": {
    "c27_start_visit": "Saying you’ll look at the numbers on the way, you take the first bus to Gunsan and meet the people in line first.",
    "c27_start_numbers": "Saying you have to sort out how much of the rumor is true, you first check how much Saebom put into Pyeongtaek and in what order.",
    "c27_start_report": "Saying this isn’t a line one person can stop, you report it up to Risk Management and leave the response to the Group.",
    "c27_queue_explain": "Saying the line will shrink once people know they have no money to lose, you explain the deposit insurance limit to each person in line.",
    "c27_queue_post": "So the facts catch the eye before the rumor does, you post Saebom’s Pyeongtaek stake and cash position on the banking hall wall in numbers.",
    "c27_queue_open": "Saying that refusing to pay is what feeds the rumor, you open every window and pay out quickly, as asked.",
    "c27_rumor_tell": "Saying they need to know the money was pulled on a lie, you tell those who withdrew directly where the rumor came from.",
    "c27_rumor_trace": "Since a half-visible team name isn’t enough to point a finger, you verify the screenshot’s source chat and sender through internal audit procedure.",
    "c27_rumor_hold": "Saying that if you set it off now it’s used once and done, you keep the screenshot to use as a bargaining chip.",
    "c27_offer_stand": "Saying you can’t hand over at 38% what could be 71%, you urge holding on to the Pyeongtaek stake and stand by Namgoong Sol.",
    "c27_offer_table": "Since the board can’t choose from numbers on the back of a number ticket, you put Kwon Dohyun’s recovery math before the board as official material.",
    "c27_offer_sell": "Saying 71% is no use if the line can’t be held, you urge selling today, even at 38%, to raise cash first.",
    "c27_final_fund": "Saying you can’t send 140 people home empty-handed, you take the Group’s 10 billion won to stop today’s line first and fight over the terms later.",
    "c27_final_open": "Saying the line will believe only if nothing is hidden, you put the Pyeongtaek stake and the original screenshot out in full in a credit union notice before the doors open.",
    "c27_final_limit": "Saying trust is no use once the vault is empty, you ask the financial authorities for a withdrawal limit and cap it at 5 million won a day.",
    "c27_after_warm": "Saying more will come even after the 38, you stay in Gunsan one more day and greet everyone who comes back, to the very last.",
    "c27_after_record": "So the next co-op doesn’t go through the same thing, you file the screenshot and the 38% purchase offer as a rumor damage report.",
    "c27_after_rush": "Saying it isn’t over just because the line is, you take the screenshot straight up to KD Capital’s Real Estate Finance Team.",
    "c27_savings_choice_1": "So she isn’t caught between her son and the credit union, you call her son yourself and explain why the savings are safe.",
    "c27_savings_choice_2": "Saying she can’t lose the interest with two months to go, you show her how to keep the savings and borrow only what she urgently needs.",
    "c27_savings_choice_3": "Unable to keep holding a trembling hand any longer, you close the account quickly, as she wishes.",
    "c27_returns_choice_1": "Saying the line needs to see people coming back, you give those returning their own deposit line and put it up front.",
    "c27_returns_choice_2": "So the story doesn’t change from window to window, you post official preferential terms for members who put their money back.",
    "c27_returns_choice_3": "Worried that making noise will stir the line again, you quietly take what comes in and just wait for the rumor to die down.",
    "c27_carnation_choice_1": "Wanting the greeting to come first even if you must mention a limit, you suggest pinning carnations on the elders in line tomorrow yourselves.",
    "c27_carnation_choice_2": "Saying tomorrow’s decision is more urgent than paper flowers, you stay up together preparing tomorrow morning’s board materials.",
    "c27_carnation_choice_3": "Saying word of the limit can’t come later than the flowers, you set the carnations aside and draft the withdrawal limit notice first.",
    "c27_savings_reaction_choice_1": "Unable to let her carry on her father’s three nights alone, you keep watch over the banking hall with Namgoong Sol tonight.",
    "c27_savings_reaction_choice_2": "Saying today’s words weren’t enough with 3.8 billion won gone out, you polish the explanation for Wednesday’s windows together.",
    "c27_savings_reaction_choice_3": "Saying this will be a long fight and you need to save your strength, you go back to your lodging, rest, and return early tomorrow.",
    "c27_returns_reaction_choice_1": "Needing to hear from those who got the Monday-morning calls, you contact people at the three co-ops and ask if the same thing happened to them.",
    "c27_returns_reaction_choice_2": "Saying you can’t question anyone with notes from a notebook, you request the records of the three sales as official audit material.",
    "c27_returns_reaction_choice_3": "Saying the line is still 200 long, you leave the past alone and focus on protecting Saebom alone.",
    "c27_carnation_reaction_choice_1": "So she can take it out right when her grandchild starts school, you look for a way to revive the closed savings on the original terms.",
    "c27_carnation_reaction_choice_2": "So she doesn’t go home with nothing but a no, you explain simply, in writing, why it can’t be revived if it can’t.",
    "c27_carnation_reaction_choice_3": "Saying this isn’t something to solve at 11 at night, you take only the bakdae tonight and suggest opening new savings another time.",
    "c27_branch_vault_a": "Saying faces hold a line better than notices, you say you’ll explain the situation in person at the windows until the truck arrives.",
    "c27_branch_vault_b": "So a hidden number doesn’t become the next rumor, you openly post the remaining cash and the Central Federation’s funding schedule in a notice to members.",
    "c27_branch_vault_c": "Saying 920 million won won’t last an hour, you open an hour late to match the truck’s arrival.",
    "c27_branch_vault_follow_a": "Saying half-told reassurance turns into another rumor, you tell the line honestly that even the boxes are borrowed money.",
    "c27_branch_vault_follow_b": "Saying the board needs to know about money that carries interest, you report the Central Federation’s borrowing terms to the board first.",
    "c27_branch_vault_follow_c": "Saying the showing worked and there’s no reason to shake the line again now, you hold off the explanation until the line clears.",
    "c27_route_system_publish": "Saying the people in line need to see these numbers too, you release the stats to Saebom’s banking hall and the local press at the same time.",
    "c27_route_system_warn": "Saying these are people who were never told why they sold so cheap, you track down former members of the 21 co-ops sold off for a pittance and tell them the facts.",
    "c27_route_system_drop": "Saying the line at the door is what’s urgent, you bury the stats and use them only to get through this week’s line.",
    "c27_final_system_route_a": "Saying you’ll close the road to cutting prices with rumors, you propose a rule barring purchases of a rumor-hit co-op’s assets for three months.",
    "c27_final_system_route_b": "Since chairs are already going out beyond the window, you leave the rule and just get a higher sale price for Saebom.",
    "c27_final_system_route_c": "Saying only the side whose names were all written down paid the price, you collect damage claims on behalf of members hurt by the rumor.",
    "c27_evidence_turn_assembly": "Saying the people who were priced should read it themselves, you release the disposal plan verbatim at Saebom’s general meeting of members.",
    "c27_evidence_turn_hold": "Saying it’s too early to reach the owner of the blank approver field, you hold the disposal plan and wait until the Roundhill deal surfaces.",
    "c27_evidence_turn_share": "Saying these are people who must think it was their own fault, you show the disposal plan first to members who pulled their money over the rumor.",
    "c27_queue_evidence_turn": "Enlarging the screenshot to the same size as the clue, you go looking for the chat where that one line was first written.",
    "c27_rumor_evidence_turn": "Enlarging the screenshot to the same size as the clue, you go looking for the chat where that one line was first written.",
    "c27_offer_evidence_turn": "Enlarging the screenshot to the same size as the clue, you go looking for the chat where that one line was first written.",
    "c27_route_system_evidence_turn": "Enlarging the screenshot to the same size as the clue, you go looking for the chat where that one line was first written.",
    "c27_start_warm_visit": "Saying you’ll look at the numbers on the way, you take the first bus to Gunsan and meet the people in line first.",
    "c27_start_warm_numbers": "Saying you have to sort out how much of the rumor is true, you first check how much Saebom put into Pyeongtaek and in what order.",
    "c27_start_warm_report": "Saying this isn’t a line one person can stop, you report it up to Risk Management and leave the response to the Group.",
    "c27_start_warm_signature": "Saying you need people to stand beside you as you did under the crane, you call the colleagues who held out with you in Pyeongtaek to the front of the Gunsan line.",
    "c27_start_record_visit": "Saying you’ll look at the numbers on the way, you take the first bus to Gunsan and meet the people in line first.",
    "c27_start_record_numbers": "Saying you have to sort out how much of the rumor is true, you first check how much Saebom put into Pyeongtaek and in what order.",
    "c27_start_record_report": "Saying this isn’t a line one person can stop, you report it up to Risk Management and leave the response to the Group.",
    "c27_start_record_signature": "Saying you can’t let them hear it from someone else, you first tell Saebom that the table in your document was used in the rumor.",
    "c27_start_rush_visit": "Saying you’ll look at the numbers on the way, you take the first bus to Gunsan and meet the people in line first.",
    "c27_start_rush_numbers": "Saying you have to sort out how much of the rumor is true, you first check how much Saebom put into Pyeongtaek and in what order.",
    "c27_start_rush_report": "Saying this isn’t a line one person can stop, you report it up to Risk Management and leave the response to the Group.",
    "c27_start_rush_signature": "Saying that laughter can’t have been a coincidence, you recall the Real Estate Finance Team’s messenger alerts on Friday night and go looking for the chat first."
  },
  "pack": {
    "clue": {
      "title": "The Price Written Before the Rumor",
      "text": "The screenshot that brought down Saebom Credit Union came from an in-house chat whose members were on KD Capital’s Real Estate Finance Team, and three days before it, a disposal plan to buy Saebom’s Pyeongtaek stake at 38% had already been written. The approver field was blank."
    },
    "outcomes": {
      "c27_after_warm": {
        "tag": "Welcomed to the End",
        "title": "You greeted the returning to the very last one",
        "text": "You stayed in Gunsan a day longer and greeted the people opening new passbooks. On Saturday morning, Boss Kwak came with a box of dried bakdae."
      },
      "c27_after_record": {
        "tag": "Left on Record",
        "title": "A document now shows how a rumor became a price",
        "text": "A rumor damage report binding the screenshot and the 38% purchase offer remained. On its first page was the date Grandma Ha Junghee closed her savings."
      },
      "c27_after_rush": {
        "tag": "Went Up First",
        "title": "You took the screenshot to Real Estate Finance first",
        "text": "You caught the bus to Seoul before the jjamppong went cold. When you reached the dark 12th floor, that chat had already been deleted."
      }
    },
    "continuityChallenges": {
      "c26_after_warm": {
        "title": "Stay Beside Them in Gunsan, as in Pyeongtaek",
        "text": "In Pyeongtaek you stayed beside the people. Stand by them in front of the Gunsan line too, and trust spreads down the line."
      },
      "c26_after_record": {
        "title": "Reclaim the Numbers That Fed the Rumor",
        "text": "The numbers you put in writing in Pyeongtaek became the rumor’s raw material in Gunsan. Reshape the table so the same numbers read as protecting people."
      },
      "c26_after_rush": {
        "title": "Come Clean About Friday Night Beyond the Partition",
        "text": "Even on the night you came back to headquarters first, alerts chimed beyond the partition, and a week later on a Friday night, the rumor went out from there. A card that separates what you saw on those two nights from what you didn’t keeps fairness intact."
      }
    }
  }
}
