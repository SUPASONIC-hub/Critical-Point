/**
 * 사건 01 (src/nodes/case01.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "start": {
      "text": "This is Trigger Lab, on the 4th floor of the old data center in Hapjeong-dong that everyone calls the basement. It is 2025. Lab Director Han Seoyun puts a case file up on the terminal. 'It’s a training case. In the lab’s records, anyway. In reality it’s due diligence that KD Bank requested as the main bank. We submit a recommendation report within 72 hours. The decision belongs to FlowOn’s CEO, the board and the banks that lent the money.' FlowOn is a logistics platform that runs a dawn-delivery network across the Seoul metropolitan area. The cash left in its accounts lasts three days. It has 1,140 employees and fourteen suppliers that haven’t been paid. Loan number 2023-0412 sits at the bottom of the cover. 3 years ago you were the one who wrote the lone dissent on that loan, and the manager who returned it was Han Seoyun. She came to this lab as its director the next spring, and she does not hide the number.",
      "memo": [
        "1,140 employees, 14 unpaid suppliers",
        "Main bank: KD Bank (loan balance 31 billion won)",
        "Review opinion 3 years ago: 1 dissent -- written by you",
        "That opinion no longer shows up in the internal system"
      ],
      "choices": {
        "layoff": {
          "label": "Open the night-shift list of 18 and weigh cuts"
        },
        "start_sale": {
          "label": "Put selling the core division in the report’s first line"
        },
        "start_investigate": {
          "label": "Ask Han Seoyun for more of the raw loan data"
        },
        "funding": {
          "label": "Ask KD Bank’s officer for three days of bridge cash"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Case desk",
      "clock": "Cash runs out · D-72h",
      "question": "FlowOn’s cash runs out in three days. Where will you spend the first 72 hours?",
      "lead": "3 years ago you wrote one dissent at KD Bank’s Corporate Finance Strategy Team and ended up in this basement. On the cover of the case file Han Seoyun opened this morning, the same loan number is still there."
    },
    "accounting": {
      "text": "In the 8th-floor finance meeting room, CFO Bae Sungjun has the ledger on screen and walks the due diligence team through it. Revenue they pulled forward once when they took that loan 3 years ago, they have pulled forward every month for the last 8 months. No one pocketed any money. The reason is in the KD Bank loan agreement on the table. Article 7 lets the bank call the loan at once, even before maturity, if the debt-to-equity ratio goes above 180%. The number they hit every month is the same reported figure as 3 years ago, 179.6%, and the untouched figure was 184%, just like then. Investigator Ban Jaewook of KD Bank Internal Audit slides the agreement toward you. 'The side that wrote this clause made them produce this number. So who’s the one who manipulated it?' 3 years ago your desk was in the department that wrote that clause.",
      "memo": [
        "Loan agreement Article 7: loan can be called at once above 180% debt-to-equity",
        "Reported after adjustment 179.6%, actual before adjustment 184.2%",
        "Method: booking customers’ prepayments early as revenue",
        "Department that designed the clause: KD Bank Corporate Finance Strategy Team"
      ],
      "choices": {
        "accounting_investigate": {
          "label": "Meet Bae Sungjun and accounting apart, ask one by one"
        },
        "accounting_delay": {
          "label": "Push 184% to the back of the report, as Bae wants"
        },
        "accounting_disclosure": {
          "label": "Recommend telling investors about 184% right away"
        },
        "reframe": {
          "label": "Propose putting all three issues on one table"
        }
      },
      "place": "FlowOn HQ, 8th-floor finance meeting room",
      "clock": "Cash runs out · D-68h",
      "question": "The numbers investors saw don’t match the real cash. When, and to whom, will you raise this first?",
      "lead": "When you asked for the funding records, the ledger opened. The KD Bank loan agreement came out with it, and Article 7 is underlined."
    },
    "payday": {
      "title": "Payday Is Tomorrow",
      "text": "Hi-vis vests hang in a row in the night-shift break room, and an electric kettle is boiling. Night-shift lead Kang Taemin peels the lid off a cup of instant noodles and sets it in front of you. 'Come during the day next time. At night this is all I’ve got to offer.' Most people here don’t know the company is in a liquidity crisis. Payroll has to go out at 9 a.m. tomorrow, and for some of the night shift, one late month means their living money stops. Do Yoonha stops at the break room door. 'You know this, Analyst. I’m the one who sold that loan at Window 4, Gangseo Branch, 3 years ago. Forty-seven of them. Back then each one was just a sales number. That stuck with me, so when the lab posted a field officer opening the next year, I was the first to raise my hand. But today is the first time I see that the money was these people’s pay.'",
      "memo": [
        "The 18 on the night shift will likely have contracts ended",
        "3 suppliers shut down if payment is 30 days late",
        "Rumors spreading inside before any staff notice",
        "Do Yoonha sold this loan at the counter"
      ],
      "choices": {
        "payday_negotiate": {
          "label": "Put executive pay and supplier dates in one plan table"
        },
        "payday_delay": {
          "label": "Tell Kang Taemin nothing until a payroll plan is set"
        },
        "payday_disclosure": {
          "label": "Tell Kang Taemin the cash left, in the break room"
        },
        "reframe": {
          "label": "Propose putting all three issues on one table"
        }
      },
      "place": "FlowOn fulfillment center · Night-shift break room",
      "clock": "Payroll in 13h",
      "question": "Payroll has to go out at 9 a.m. tomorrow. Will you tell the staff the facts now, or after the plan is set?",
      "lead": "40 minutes by car from HQ, at a fulfillment center on the edge of Seoul. The people here still don’t know what is happening to the company."
    },
    "competitor": {
      "title": "NextMile’s Offer",
      "text": "A proposal from the competitor NextMile lies on the table in the 8th-floor negotiation room. It offers to buy the core division at 42% of book value, on the condition that it takes over some of the staff. Oh Jinwoo is already sitting across the table. He has submitted an alternative that cuts costs another 8%, and in a corner of the whiteboard he has drawn one vertical line with a name on each side. His column already has a 1. Turning to the last page of the proposal, he adds in passing. 'NextMile’s main bank is KD too. The same bank calls in money on one side and buys on the other. The loss vanishes from the group’s books. Nice picture, isn’t it.'",
      "memo": [
        "Offer price: 42% of book value",
        "Terms include taking over some staff",
        "NextMile’s main bank is also KD Bank",
        "Oh Jinwoo’s plan pushes supplier payments to last",
        "Group Strategy request: two recommendations; Oh Jinwoo’s deadline 12 hours earlier"
      ],
      "choices": {
        "competitor_sale": {
          "label": "Put NextMile’s 42% offer in the report’s comparison"
        },
        "competitor_negotiate": {
          "label": "Call investors, suppliers and NextMile to one table"
        },
        "competitor_report": {
          "label": "Hand Bae Sungjun’s liability to Investigator Ban first"
        },
        "reframe": {
          "label": "Propose putting all three issues on one table"
        }
      },
      "place": "FlowOn HQ, 8th-floor negotiation room",
      "clock": "Cash runs out · D-48h",
      "question": "The competitor offers a fire-sale buyout, and Oh Jinwoo offers a cheaper alternative. What goes into the report’s comparison table?",
      "lead": "When you came out of the asset review room, NextMile’s acquisition proposal had already reached the negotiation room. Trigger Lab analyst Oh Jinwoo is sitting there too. The Group Strategy Office wants two recommendations on the same case and handed him one of his own; only his deadline is 12 hours earlier than yours."
    },
    "board": {
      "title": "No Perfect Option",
      "text": "A five-column table fills the wall screen in the 8th-floor situation room. Protect staff, keep the company alive, assign responsibility, win over investors, limit supplier damage. ECHO runs the combinations one by one, but no row lights all five columns. Turn one on and another goes dark. On the table, cold lunch boxes mix with the term sheet, the payroll ledger and the list of unpaid suppliers. ECHO puts up one more line. 'I found 172 cases of the same shape in 30 years of review records. 169 of them closed here with a sale, and 3 went up to the department that wrote the clause. Every officer on the 169 kept their seat. None of the officers on the 3 kept theirs.'",
      "memo": [
        "Protect all staff: higher risk of late supplier payments",
        "Lead with transparency: investment talks more likely to collapse",
        "Choose a sale: survival easier, but control lost",
        "Of 172 cases of the same shape, 3 challenged the clause"
      ],
      "choices": {
        "protect": {
          "label": "Put the payroll ledger on top and argue to keep jobs"
        },
        "survive": {
          "label": "Recommend signing the term sheet: cash first, firm lives"
        },
        "justice": {
          "label": "Write Article 7 and 179.6% on the opinion’s first page"
        },
        "reframe": {
          "label": "Propose a structure outside the options"
        }
      },
      "place": "FlowOn HQ, 8th-floor situation room",
      "clock": "Cash runs out · D-30h",
      "question": "You can’t protect staff, survival, responsibility, investors and suppliers all at once. What do you put first?",
      "lead": "Two days of material is on one table. ECHO shows that no combination satisfies every item at once."
    },
    "c1_aftershock": {
      "title": "The Next Day’s Payslips",
      "text": "The morning after the decision, a stack of printed payslips sits on the table in the 8th-floor situation room. Trigger Lab field officer Do Yoonha brought them from the night shift. Last night’s board meeting ended with CEO Kwon Seungwoo’s signature. People’s reactions arrived before the numbers. In the staff group chat, the same notice is read three ways over who was protected and who was left out, and one supplier’s owner is in the lobby holding a printout of one promise line from your report. He wants to talk terms again. And to your request to see the original 2023-0412 review report, KD Bank’s Corporate Finance Strategy Team has replied in one line. 'Case closed as processed normally.' The officer’s signature field is blank. Do Yoonha pushes the stack of payslips toward you. 'Everyone’s asking. What yesterday’s decision means for them.'",
      "memo": [
        "Different readings of the staff notice spreading",
        "A supplier’s owner asks to renegotiate terms",
        "Bank reply to records request: closed as processed normally, no officer signature"
      ],
      "choices": {
        "c1_after_silence": {
          "label": "Hold off disclosure until the next funds come in"
        },
        "c1_after_numbers": {
          "label": "Lay out the cash flow and point to the losses to absorb"
        },
        "c1_after_people": {
          "label": "Explain the promises to staff and suppliers first"
        }
      },
      "place": "FlowOn HQ, 8th-floor situation room",
      "clock": "Morning after the decision",
      "question": "The day after the decision, people’s reactions arrived before the numbers. Who will you explain it to first?",
      "lead": "The case is closed, but one more day remains. People are each reading the promises you left in a different way."
    },
    "c1_witness": {
      "title": "Who Made 179.6",
      "text": "When you step into the hallway after the finance meeting, the most junior member of the accounting team is standing by the copier. He holds his ID badge in his hand, and he wasn’t invited to the meeting. He doesn’t say the ledger is wrong. He gives a date instead. On the evening they redid the closing numbers, he says, someone from the bank sat at the far end of the meeting room. He never got a business card, and that name isn’t on the attendee list. 'I saved the original file three times. The third one is the current number. The instructions were only spoken.' Ban Jaewook starts to open his notebook and stops. If he writes it down here, this man becomes a witness from tomorrow. Behind the glass door at the end of the hall, accounting staff are watching.",
      "memo": [
        "Original file saved three times",
        "The junior employee wasn’t invited to the meeting",
        "The CFO’s instructions were only verbal",
        "1 outsider missing from that day’s attendee list"
      ],
      "choices": {
        "c1_witness_choice_2": {
          "label": "Ask to lock the original file and preserve the evidence"
        },
        "c1_witness_choice_3": {
          "label": "Square stories privately with the CFO before word spreads"
        },
        "c1_witness_choice_1": {
          "label": "Protect the employee and make a place for testimony"
        }
      },
      "place": "FlowOn HQ, 8th-floor accounting hallway",
      "clock": "Cash runs out · D-66h",
      "question": "The junior accountant has stopped at the door. Will you first make a place where he can speak safely?",
      "lead": "You are walking out into the hallway after the finance meeting. An employee who wasn’t invited to the meeting is waiting for you."
    },
    "c1_assembly": {
      "title": "A Promise Before Payday",
      "text": "After midnight, at break time, the night shift gathers in the break room. Lead Kang Taemin writes three questions on the whiteboard. Will pay come out tomorrow. Will this shift exist next month. Who puts their name on those answers. Getting through payday morning takes more than money. People care less about what the company is hiding than about whether they will still be here tomorrow. On Do Yoonha’s phone is the same text from three suppliers. They want their payment dates set by the same standard as staff pay. The HQ executives’ group chat is silent. No one is the first to say whose pay should be disclosed first.",
      "memo": [
        "The night shift’s representative demands a joint notice",
        "Three suppliers demand the same payment standard",
        "Executives reluctant to disclose their own pay first"
      ],
      "choices": {
        "c1_assembly_choice_3": {
          "label": "Recommend an interim deal only executives know"
        },
        "c1_assembly_choice_2": {
          "label": "Recommend fixing the payment order in numbers"
        },
        "c1_assembly_choice_1": {
          "label": "Draft a public promise with the staff representative"
        },
        "c1_assembly_choice_4": {
          "label": "Propose cutting executive pay first to fund wages"
        }
      },
      "place": "FlowOn fulfillment center · Night-shift break room",
      "clock": "Payroll in 9h",
      "question": "What the staff want more than money is an answer about whether they’ll still be here tomorrow. In what form will you leave the promise?"
    },
    "c1_bargain": {
      "title": "The Seat No One Bought",
      "text": "Toward evening, NextMile sends a revised offer. On page nine of 12 there is a blank. The heading reads 'Handling of divisions excluded from the acquisition,' and the three lines under it are empty. No one has written who goes in that space: the divisions they won’t buy, the staff left behind, or the unpaid suppliers. Oh Jinwoo highlights a different page. Purchase price, staff transferred, final payment date. 'Blanks get filled at the end. Fill them first and the price drops.' The texts from the suppliers’ owners all say the same thing in one line. Sell or don’t, just tell us the payment date.",
      "memo": [
        "No responsible party in the acquisition terms",
        "Suppliers want guaranteed payment more than a sale",
        "Oh Jinwoo picks only the sentences that raise his odds"
      ],
      "choices": {
        "c1_bargain_choice_3": {
          "label": "Urge a quick signature with the blank left in"
        },
        "c1_bargain_choice_2": {
          "label": "Propose building in the weakest party’s terms first"
        },
        "c1_bargain_choice_1": {
          "label": "Insist on negotiating only after the blank is filled"
        }
      },
      "place": "FlowOn HQ, 8th-floor negotiation room",
      "clock": "Cash runs out · D-38h",
      "question": "No one has written who goes in the blank on the term sheet. Will you insist on filling that space first?"
    },
    "c1_verdict": {
      "title": "A Choice, Not a Verdict",
      "text": "One day until the cash runs out. Three letters of demands have arrived side by side on the situation room table. The staff representative wants pay and jobs promised in writing, the 14 suppliers want the payment order made public, and the investor says it will withdraw the term sheet if there is no answer by midnight tonight. All three are due today. All the material is in, yet the conclusion has moved further away. ECHO overlays the three letters and shows that no sentence overlaps. 'Grant one side’s demand and the other two lose that much trust. What you choose now isn’t the words that explain the company. It’s who pays tomorrow’s cost.'",
      "memo": [
        "Demands from staff, suppliers and investors arrive at once",
        "Saving one side lowers the others’ trust",
        "All three demand letters are due at midnight today"
      ],
      "choices": {
        "c1_verdict_choice_2": {
          "label": "Secure the money to survive first"
        },
        "c1_verdict_choice_3": {
          "label": "Disclose all the responsibility and grounds for the decision"
        },
        "c1_verdict_choice_1": {
          "label": "Cut the weakest people’s losses first"
        }
      },
      "place": "FlowOn HQ, 8th-floor situation room",
      "clock": "Cash runs out · D-24h",
      "question": "All the material is in, yet the conclusion has moved further away. Who will you make pay tomorrow’s cost?"
    },
    "c1_witness_reaction": {
      "title": "Silence After Testimony",
      "text": "Within 10 minutes, word that the junior accountant stood in the hallway with you has spread through the accounting team. When you open the office door, the typing stops all at once. Not one head rises from the twelve desks. Han Seoyun, who came up when she got the call, stands in the doorway and scans the room once. 'Everyone’s doing the math right now. If he gets protected, what does that make them.' She holds out a tablet. It is the draft report going up tomorrow morning, and the witness field and the action field are both empty. 'Whose name you write here, and how, decides what the people in this room say tomorrow. I’ve also seen reports where that field stayed empty to the end.'",
      "memo": [
        "Whether the promise of protection made it into the record",
        "Responsibility that will show in the next payroll"
      ],
      "choices": {
        "c1_witness_reaction_choice_2": {
          "label": "Leave the testimony on paper only and walk away"
        },
        "c1_witness_reaction_choice_1": {
          "label": "Protect the witness and explain the standard to the team"
        },
        "c1_witness_reaction_choice_3": {
          "label": "Give the CFO the first chance to respond"
        }
      },
      "place": "FlowOn HQ, 8th-floor accounting team",
      "clock": "Cash runs out · D-65h",
      "question": "Since the junior accountant spoke up, the whole accounting team has gone quiet. Whom will the record say you protect?"
    },
    "c1_assembly_reaction": {
      "title": "Payday’s First Text",
      "text": "Five in the morning, four hours until pay goes in. Conflicting rumors appear in the staff group chat. A post that only half the pay is coming, a post that the night shift goes first, a post that the company has already been sold. When someone corrects one, three questions pile up under it. ECHO overlays the chat’s posts on one screen. 'Of the 64 posts in the last hour, 9 are true. Not even the 9 true ones give a source.' In a corner of the break room, someone keeps opening and closing a banking app. The conveyor is running, but the hands loading the boxes are slower than usual.",
      "memo": [
        "Of 64 unsourced posts, 9 true",
        "A channel to protect anonymous voices"
      ],
      "choices": {
        "c1_assembly_reaction_choice_1": {
          "label": "Propose announcing the facts and the unknowns together"
        },
        "c1_assembly_reaction_choice_2": {
          "label": "Propose one notice after the deposit is confirmed"
        },
        "c1_assembly_reaction_choice_3": {
          "label": "Find who started the rumors first"
        }
      },
      "place": "FlowOn fulfillment center · Night-shift break room",
      "clock": "Payroll in 4h",
      "question": "Conflicting rumors are up in the staff group chat. Will you announce only what you know right now?"
    },
    "c1_bargain_reaction": {
      "title": "An Empty Chair at the Table",
      "text": "Ten at night, the agreed time, has passed, and NextMile’s side is still empty. Across the table sit only three water bottles and three name plates, and a text says they will be 30 minutes late. Trigger Lab field officer Do Yoonha, waiting with you, stares at the empty chairs for a long time. 'Those seats feel like the seats of the people left out of the acquisition. They go into the agreement as numbers, but there’s no chair for them to sit in.' Two supplier owners stand in the hallway holding document envelopes. No one called them. They say they came to hear for themselves how the talks go. Through the gap in the door, your eyes meet one of them.",
      "memo": [
        "The people who couldn’t enter the talks",
        "The name that will approve the terms"
      ],
      "choices": {
        "c1_bargain_reaction_choice_3": {
          "label": "Stay silent until the other side arrives"
        },
        "c1_bargain_reaction_choice_2": {
          "label": "Finish the terms table first and keep negotiating"
        },
        "c1_bargain_reaction_choice_1": {
          "label": "Propose inviting the empty-chair people into the talks"
        }
      },
      "place": "FlowOn HQ, 8th-floor negotiation room",
      "clock": "Cash runs out · D-34h",
      "question": "The other side hasn’t shown up. Will you propose inviting the people of the empty chairs into the talks?"
    },
    "c1_verdict_reaction": {
      "title": "The Last Question Before the Conclusion",
      "text": "Four hours after the demands arrived, everyone left in the situation room is waiting for your report. The CFO holds the pen he will sign with, and the investor’s officer waits with a phone to his ear. Only Ban Jaewook, at the end of the table, turns the pages of his notebook. He asks without looking up. 'I won’t ask what the conclusion is. I’ll ask about order. Who hears this recommendation first. The investors, the night shift, or the suppliers.' He writes the time on an empty line and stops his pen. 'Only the decision goes in the minutes. Who was told first, I write down separately. Later on, that tells you more.'",
      "memo": [
        "Harm to check before the conclusion",
        "A question to leave in the next minutes"
      ],
      "choices": {
        "c1_verdict_reaction_choice_3": {
          "label": "Leave only the responsible party in the minutes"
        },
        "c1_verdict_reaction_choice_1": {
          "label": "Explain first to those who will be hurt most"
        },
        "c1_verdict_reaction_choice_2": {
          "label": "Submit the grounds to the investors first"
        }
      },
      "place": "FlowOn HQ, 8th-floor situation room",
      "clock": "Cash runs out · D-20h",
      "question": "Ban Jaewook asks one last time. Who will hear this conclusion first?"
    },
    "c1_branch_people": {
      "title": "Who Fills the Blank",
      "text": "The acquisition agreement sent by the competitor NextMile lies open on the table in the 8th-floor negotiation room. It is a document to buy the core division, and on page nine there is a blank. It is the space for who takes responsibility for the divisions left out of the deal, the staff who remain there, and the unpaid suppliers. Trigger Lab field officer Do Yoonha lays the night-shift roster and the list of unpaid suppliers side by side next to it. 'When it was written in numbers, everyone let it pass. So many staff transferred, so many hundred million won unpaid.' Do Yoonha opens the first page of the roster. 'Now that it has to be names, nobody picks up a pen. The moment a name goes in this space, it’s settled who takes care of that person.'",
      "memo": [
        "Guaranteed supplier payments",
        "Employment period for staff left behind",
        "Responsible party after the acquisition"
      ],
      "choices": {
        "c1_branch_people_a": {
          "label": "Propose writing the people left behind in first"
        },
        "c1_branch_people_b": {
          "label": "Propose fixing supplier payment dates first"
        },
        "c1_branch_people_c": {
          "label": "Keep only the acquisition terms and move on"
        }
      },
      "place": "FlowOn HQ, 8th-floor negotiation room",
      "clock": "Cash runs out · D-37h",
      "question": "You mean to fill the blank in NextMile’s agreement with people’s names. Whose name goes in first?"
    },
    "c1_branch_people_follow": {
      "title": "The First Call After the Revision",
      "text": "However the blank was handled, the revised agreement went to NextMile that night. 40 minutes after the revision goes into the system, the negotiation room phone rings. It is someone whose name appears nowhere in the agreement. He runs a small company that supplied FlowOn with packaging, and he is owed three months of payments. He doesn’t get angry. He asks just one thing. Which company should he send his invoice to now. ECHO attaches a line next to the call log. 'This person falls under no space in the agreement. The blank was filled or left. Either way, from now on that space reads not as a cost but as a promise.'",
      "memo": [
        "A stakeholder outside the contract",
        "Responsibility after the first payment",
        "A record to verify the promise"
      ],
      "choices": {
        "c1_branch_people_follow_a": {
          "label": "Put the promise on the public record"
        },
        "c1_branch_people_follow_b": {
          "label": "Add the caller’s terms to the recommendation"
        },
        "c1_branch_people_follow_c": {
          "label": "Answer that the contract is the only standard"
        }
      },
      "place": "FlowOn HQ, 8th-floor negotiation room",
      "clock": "Cash runs out · D-33h",
      "question": "The first call after sending the revision came from someone not in the agreement. What will you guarantee that promise with?"
    },
    "c1_route_layoff": {
      "title": "Faces That Arrived Before the Numbers",
      "text": "This is the 8th-floor HR meeting room at FlowOn HQ. The HR head left a sheet face down, saying it was material for the report, and walked out. Turn it over and there are 18 names, all night-shift contract workers at the logistics center, and at the bottom, in bold, the labor cost this list cuts. Trigger Lab field officer Do Yoonha looks through the glass wall at the hallway. Three people are already sitting there waiting for their interviews. 'They don’t know yet what the interview is about.' Do Yoonha sets another table next to the list. It is a handover sheet for who takes on each departing person’s work, and all 18 rows are blank. And next to the seventh name on the list is a pencil mark. It is the person who reported last month’s accounting to the internal reporting channel.",
      "memo": [
        "Handover sheet for key staff is blank",
        "An internal whistleblower is among those to be cut",
        "Savings come fast, but the loss of trust shows at once"
      ],
      "choices": {
        "c1_route_layoff_protect": {
          "label": "Hand HR a redrawn list without the whistleblower"
        },
        "c1_route_layoff_fast": {
          "label": "Delay notice and write the savings in the report first"
        },
        "c1_route_layoff_notice": {
          "label": "Propose telling those affected first, then recalculate"
        }
      },
      "place": "FlowOn HQ, 8th-floor HR meeting room",
      "clock": "Cash runs out · D-70h",
      "question": "The cut list is open. Will you propose telling those affected first, or write the savings into the report first?",
      "lead": "This is right after you said you would weigh the cuts. The waiting list outside the meeting room moves into the center of the case."
    },
    "c1_final_layoff": {
      "title": "The Names Left Behind the Savings",
      "text": "You are back in the 8th-floor HR meeting room at HQ. Payday has passed, and the list is still on the table. If the cuts go ahead, the savings hit the books today. Do Yoonha pushes the handover sheet forward again. The rows are still blank. 'No one has written who takes over the departing people’s work yet. And the person who reported the accounting, list or no list, nobody talks to them these days.' More people sit on the hallway chairs than yesterday. What you decide now is not whether to cut. It is whose silence goes into the savings along with it.",
      "memo": [
        "All 18 rows of the handover sheet still blank",
        "Savings secured, but the path for internal testimony has narrowed",
        "Whether to disclose who is protected emerges as a new option"
      ],
      "choices": {
        "c1_final_layoff_c": {
          "label": "Shrink the cuts and put executive pay cuts on line one"
        },
        "c1_final_layoff_b": {
          "label": "Propose fixing the list first, notice order later"
        },
        "c1_final_layoff_a": {
          "label": "Recommend sending the list and criteria to those affected"
        },
        "c1_final_layoff_evidence_turn": {
          "label": "Open the criteria table the three issues passed as a clue"
        }
      },
      "place": "FlowOn HQ, 8th-floor HR meeting room",
      "clock": "Cash runs out · D-8h",
      "question": "The savings are secured and the names remain. How will you close out these cuts?"
    },
    "c1_route_funding": {
      "title": "The Question Money Asks First",
      "text": "In the 8th-floor investment room, the investor offering emergency funds has sent a draft term sheet. Sixteen pages. The amount and deposit date are in bold on the first page, and Investigator Ban Jaewook of KD Bank Internal Audit skips the first page and opens to page twelve. He copies the clause word for word into his black notebook. 'After funds are disbursed, the company’s major decisions are subject to prior review by the investor, and the content of that review is not disclosed.' Ban stops his pen. 'Money turns three days into three months. In exchange, during those three months, they decide what this company can explain, and to whom. The record of approval exists, but no one can see it.'",
      "memo": [
        "Term sheet has a confidential review clause",
        "Operating time secured, but the right to explain shrinks",
        "The investor’s review records can’t be seen from outside the company"
      ],
      "choices": {
        "c1_route_funding_accept": {
          "label": "Propose accepting the terms to buy time first"
        },
        "c1_route_funding_clause": {
          "label": "Write in the opinion: make the secret clause public"
        },
        "c1_route_funding_split": {
          "label": "Propose taking half the funds to keep the right to explain"
        }
      },
      "place": "FlowOn HQ, 8th-floor investment room",
      "clock": "Cash runs out · D-70h",
      "question": "The emergency funding term sheet has a confidential review clause. You must recommend whether to buy time or keep the right to explain.",
      "lead": "This is right after you asked KD Bank’s officer about bridge cash. Money buys time, but the term sheet first asks how much of the next decision can be made public."
    },
    "c1_final_funding": {
      "title": "The Terms of Survival Money",
      "text": "The final term sheet lies on the table in the investment room. Sign it and the money arrives today, and the company makes next month’s payday. Ban Jaewook opens his notebook and points to a small box next to the signature line. The 'analyst opinion' box. 'Put your name here and you become the one who approved these terms. Leave it out and you stay the one who solved the problem, but the terms get set without you, Analyst.' He doesn’t say which is better. Instead he folds a copy of the term sheet and tucks it into his notebook. 'I believe in order. Whether the money came in first or the explanation went out first. That gets decided today.'",
      "memo": [
        "The confidential review clause is still in the final term sheet",
        "Time secured, but a cost of outside control appears",
        "Whether to disclose the terms becomes the turning point for trust"
      ],
      "choices": {
        "c1_final_funding_c": {
          "label": "Propose halving the raise to keep the right to explain"
        },
        "c1_final_funding_a": {
          "label": "Write that the full terms go public beyond the board"
        },
        "c1_final_funding_b": {
          "label": "Propose keeping terms secret and fixing the deposit date"
        },
        "c1_final_funding_evidence_turn": {
          "label": "Open the criteria table the three issues passed as a clue"
        }
      },
      "place": "FlowOn HQ, 8th-floor investment room",
      "clock": "Cash runs out · D-8h",
      "question": "The funds need only a signature, and the right to explain shrinks. How far will you tell them to accept these terms?"
    },
    "c1_route_sale": {
      "title": "What Can Be Sold and What Must Stay",
      "text": "Three sheets listing the assets that can be sold are taped to the wall of the 8th-floor asset review room. Delivery vehicle contracts, four hub warehouses around Seoul, and one line at the very bottom of the third sheet: 'other intangible assets.' Han Seoyun taps that line with a pen. 'Unpack this one line and it holds every customer order record since the founding and the internal operations tools. A copy of the operations logs too.' What the bidders want to pay for isn’t the trucks but that one line. But the operations logs also hold the traces of the ledger edits over the last 8 months. Selling brings cash fastest, and the moment it sells, the records change owners. No rule says whether customers must be told their order records are being handed over.",
      "memo": [
        "A copy of the operations logs is on the sale list",
        "No clear standard for handling customer data",
        "Fast cash clashes with long-term trust"
      ],
      "choices": {
        "c1_route_sale_hold": {
          "label": "Propose holding the sale and notifying customers first"
        },
        "c1_route_sale_bundle": {
          "label": "Recommend a bundle sale to raise cash as fast as possible"
        },
        "c1_route_sale_clean": {
          "label": "Propose splitting off data and logs before selling"
        }
      },
      "place": "FlowOn HQ, 8th-floor asset review room",
      "clock": "Cash runs out · D-70h",
      "question": "Customer data and operations logs are mixed into the sale list. What will you tell them to split off before selling?",
      "lead": "This is right after you put selling the core division in the report’s first line. Han Seoyun came up first and taped the list to the wall."
    },
    "c1_final_sale": {
      "title": "The Evidence Not for Sale",
      "text": "More items are crossed out on the three sheets on the asset review room wall. NextMile has sent the final signing copy and is waiting for an answer. Han Seoyun stands in front of the 'other intangible assets' line. 'Put this one line in and the money arrives tonight. Take it out and the price drops and the date slips.' She sets the storage drive holding the copy of the operations logs on the table. 'What’s in here isn’t just order records. It also has who edited the ledger, and when. Sell, and that goes too.' Outside the window, the lights of delivery trucks coming back from the hub warehouses pass in a line. If it sells, the company survives. What not to sell has to be decided now.",
      "memo": [
        "The operations log copy holds the ledger edit records",
        "Cash pressure grows",
        "Not yet decided whether to tell customers"
      ],
      "choices": {
        "c1_final_sale_a": {
          "label": "Recommend pulling logs and customer data, then announcing"
        },
        "c1_final_sale_b": {
          "label": "Propose selling the bundle as is, notice after the deal"
        },
        "c1_final_sale_c": {
          "label": "Propose making record preservation a term for the buyer"
        },
        "c1_final_sale_evidence_turn": {
          "label": "Open the criteria table the three issues passed as a clue"
        }
      },
      "place": "FlowOn HQ, 8th-floor asset review room",
      "clock": "Cash runs out · D-8h",
      "question": "A sale keeps the company alive. What you keep back from the sale must go into the report now."
    },
    "c1_route_investigate": {
      "title": "The Gap Between Stalled Numbers",
      "text": "In the 8th-floor records room at FlowOn HQ, document boxes are stacked along the walls and ECHO’s terminal sits on a folding table. When you check the raw data before picking an issue, the calculations behind the cuts plan, the funding plan and the sale plan all break off at the same place. The last 8 months of revenue records. The dates continue, but the edit history for just that stretch is empty. ECHO calls the stretch the missing log and draws a border around it. 'All three plans trusted this stretch’s numbers as they are. If this stretch is wrong, all three are wrong. Who made this gap comes before which plan you pick.' From the hallway, someone is calling people in to start the finance meeting.",
      "memo": [
        "All three options share the same missing log",
        "Cash pressure grows during the audit time",
        "Account that made the missing stretch: not yet confirmed"
      ],
      "choices": {
        "c1_route_investigate_share": {
          "label": "Disclose the gap and propose a joint investigation"
        },
        "c1_route_investigate_shadow": {
          "label": "Go along on the surface and trace the logs quietly"
        },
        "c1_route_investigate_freeze": {
          "label": "Recommend holding all three plans and restore the logs"
        }
      },
      "place": "FlowOn HQ, 8th-floor records room",
      "clock": "Cash runs out · D-70h",
      "question": "You laid out the raw data, but there is a gap between the numbers. Where will you start digging?",
      "lead": "This is right after you decided to check the data before picking an issue, at the risk of looking like someone who stalls on conclusions."
    },
    "c1_final_investigate": {
      "title": "The Real Starting Point of the First Case",
      "text": "The recovered records are laid out on the records room table by date. Six of the eight missing months have come back. The ledger was edited every time on the evening of the last business day of the month, and each time the reported debt-to-equity ratio stopped just below 180%. ECHO puts up one line on the last page. 'This company’s crisis didn’t start this week. It’s a record of someone making the same gap again and again. The raw data delayed the conclusion, but it changed who has to be asked.' In the hallway, phones keep ringing with calls to pick one of the three plans today.",
      "memo": [
        "The missing log edit times all cluster on month-end evenings",
        "The three plans’ conclusions are late, and cash is down to eight hours",
        "Not yet decided who to review these records with"
      ],
      "choices": {
        "c1_final_investigate_b": {
          "label": "Drop the audit and recommend only the fastest plan"
        },
        "c1_final_investigate_a": {
          "label": "Write the missing log and its author in, urge re-review"
        },
        "c1_final_investigate_c": {
          "label": "Recommend an outside audit to the board and wait"
        },
        "c1_final_investigate_evidence_turn": {
          "label": "Open the criteria table the three issues passed as a clue"
        }
      },
      "place": "FlowOn HQ, 8th-floor records room",
      "clock": "Cash runs out · D-8h",
      "question": "The raw data points back to where the case began. What will you use this finding for?"
    },
    "c1_route_system": {
      "title": "The First Rule Found Outside the Options",
      "text": "You propose putting the three issues on one table. ECHO catches on first. The wall screen in the 8th-floor situation room goes blank white. Cuts, funding, sale. The three plans’ calculation sheets overlap, half transparent, and where they overlap one cell stays dark. All three plans took their numbers from the same criteria table. The table’s header shows no department and no date. ECHO puts up one line. 'There wasn’t one crisis. The same criteria table was called by three different names. Whichever plan you pick, this table sets the answer first.' For the first time, the people in the situation room look at each other instead of the screen.",
      "memo": [
        "The three plans’ calculation sheets overlap in the same cell",
        "Every solution passes through the same criteria table",
        "No author department or date in the criteria table’s header"
      ],
      "choices": {
        "c1_route_system_use": {
          "label": "Leave the table alone and recommend the fastest plan"
        },
        "c1_route_system_trace": {
          "label": "Trace who edited the criteria table, and when"
        },
        "c1_route_system_open": {
          "label": "Show the criteria table to people outside the meeting first"
        }
      },
      "place": "FlowOn HQ, 8th-floor situation room",
      "clock": "Cash runs out · D-70h",
      "question": "When you reframed the table outside the options, the case’s rule responded. How will you use this rule?",
      "lead": "The table you reframed, without betting on any of the three prepared options, went straight into the case file."
    },
    "c1_final_system": {
      "title": "Three Plans Through the Same Table",
      "text": "Eight hours until the cash runs out. On the situation room wall screen, ECHO overlays the cuts plan, the funding plan and the sale plan on one table. Where they overlap, a single criteria table remains. All three plans took their numbers from it, and the purchase price in NextMile’s agreement came from the same table. The header shows no department and no edit date. ECHO writes under the table. 'The three plans passed through the same criteria table. Leave the table as it is and a fourth plan will stall in the same place.' On the table, the CFO’s phone vibrates, stops and vibrates again. He doesn’t answer, only watches the screen.",
      "memo": [
        "The three plans passed through the same criteria table",
        "Who edited the criteria table, and when: not yet opened",
        "8 hours until cash runs out"
      ],
      "choices": {
        "c1_final_system_b": {
          "label": "Hide the criteria table, recommend only the fastest plan"
        },
        "c1_final_system_a": {
          "label": "Attach the shared criteria table and urge re-review"
        },
        "c1_final_system_c": {
          "label": "Hand authority over the criteria table out of your hands"
        },
        "c1_final_system_evidence_turn": {
          "label": "Open the criteria table the three issues passed as a clue"
        }
      },
      "place": "FlowOn HQ, 8th-floor situation room",
      "clock": "Cash runs out · D-8h",
      "question": "It’s out that all three plans passed through the same criteria table. Will you keep that table on record or close it?"
    },
    "c1_evidence_turn": {
      "title": "The First Clue Ties Three Plans in One Line",
      "text": "When you hold the clue up against the three plans’ calculations, the tables on screen line up in one row. The savings in the cuts plan, the amount needed in the funding plan and the purchase price in the sale plan were all calculated from the same criteria table. And the edit records for that table end at the same account as the eight-month stretch with no edit history in the ledger and the edits to the undisclosed payroll sheet. There is no person’s name in the author field. ECHO lays the times of the three records side by side. 'There weren’t three different solutions. A table made by the same hand put out the answer in three shapes. What you decide now isn’t which plan, but who rewrites this table.'",
      "memo": [
        "The hidden payroll sheet and the missing log point to the same author",
        "All three plans’ effects were calculated from one criteria table",
        "Not yet decided how far to disclose this link"
      ],
      "choices": {
        "c1_evidence_turn_private": {
          "label": "Hide the author and fix only the table internally"
        },
        "c1_evidence_turn_transfer": {
          "label": "Pass the right to verify originals to the next case’s lead"
        },
        "c1_evidence_turn_public": {
          "label": "Write the criteria table and its author into the opinion"
        }
      },
      "place": "FlowOn HQ, 8th-floor situation room",
      "clock": "Cash runs out · D-6h",
      "question": "The clues you gathered tie the three plans into one line. Will you put this link on the official record?"
    },
    "c1_start_hold": {
      "title": "Names on the Wall for 3 Years",
      "text": "The sheet with 11 names you taped to the wall by your desk on your first day at Trigger Lab stayed there while the tape was replaced three times. You sat under it for 3 years, and now it is 2025. Han Seoyun, who returned your dissent, came to this lab as its director the next spring. This morning she puts a case file up on the terminal. 'It’s a training case. In the lab’s records, anyway. In reality it’s due diligence that KD Bank requested as the main bank. We submit a recommendation report within 72 hours. The decision belongs to FlowOn’s CEO, the board and the banks that lent the money.' At the bottom edge of the cover is loan number 2023-0412. FlowOn, a logistics platform running a dawn-delivery network, 1,140 employees. The investment deposit was canceled, so the cash runs out in 72 hours. The company you tried to stop 3 years ago is stopping now.",
      "memo": [
        "Wall by the desk -- 11 names, up for 3 years",
        "Bottom edge of the training case cover: 2023-0412",
        "Due diligence team: you, Do Yoonha (Trigger Lab field officer), Ban Jaewook (KD Bank Internal Audit)"
      ],
      "choices": {
        "c1_start_hold_sale": {
          "label": "Put selling the core division in the report’s first line"
        },
        "c1_start_hold_funding": {
          "label": "Ask KD Bank’s officer for three days of bridge cash"
        },
        "c1_start_hold_layoff": {
          "label": "Open the night-shift list of 18 and weigh cuts"
        },
        "c1_start_hold_investigate": {
          "label": "Ask Han Seoyun for more of the raw loan data"
        },
        "c1_start_hold_signature": {
          "label": "First check if the wall names and file are one case"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Case desk",
      "clock": "Cash runs out · D-72h",
      "question": "Under the names you kept on the wall for 3 years, you meet that loan number again. Where will you spend the first 72 hours?",
      "lead": "The sheet on the wall by your desk stayed there while the tape was replaced three times. On the cover of the training case Han Seoyun handed you this morning, 2023-0412 remains at the bottom edge."
    },
    "c1_start_record": {
      "title": "A Box Up from B2 After 3 Years",
      "text": "The box in B2 where you stood the bundle of copies 3 years ago sat in a room that always stays the same temperature. This morning in 2025, Han Seoyun puts a case file up on the terminal. She returned your dissent, and came to this lab as its director the next spring. 'It’s a training case. In the lab’s records, anyway. In reality it’s due diligence that KD Bank requested as the main bank. We submit a recommendation report within 72 hours. The decision belongs to FlowOn’s CEO, the board and the banks that lent the money.' You read 2023-0412 at the bottom edge of the cover and go down to B2. Someone has already opened the box. The seal tape is new, and Lim Kyungsoo’s signature isn’t on it. FlowOn, a dawn-delivery logistics platform, 1,140 employees. The cash runs out in 72 hours. The numbers written 3 years ago and this morning’s numbers meet on the same line.",
      "memo": [
        "B2 box -- seal tape has been replaced",
        "Bottom edge of the training case cover: 2023-0412",
        "Due diligence team: you, Do Yoonha (Trigger Lab field officer), Ban Jaewook (KD Bank Internal Audit)"
      ],
      "choices": {
        "c1_start_record_sale": {
          "label": "Put selling the core division in the report’s first line"
        },
        "c1_start_record_investigate": {
          "label": "Ask Han Seoyun for more of the raw loan data"
        },
        "c1_start_record_layoff": {
          "label": "Open the night-shift list of 18 and weigh cuts"
        },
        "c1_start_record_signature": {
          "label": "First ask when the seal on the B2 box was changed"
        },
        "c1_start_record_funding": {
          "label": "Ask KD Bank’s officer for three days of bridge cash"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Case desk",
      "clock": "Cash runs out · D-72h",
      "question": "The seal tape on that box in B2 isn’t the tape from 3 years ago. Where will you spend the first 72 hours?",
      "lead": "This morning you went down to check the box in B2 where you stood the bundle of copies 3 years ago. Someone had opened it first. You come back up and open the case file that still bears the same number."
    },
    "c1_start_alone": {
      "title": "3 Years With Nothing Brought Along",
      "text": "3 years ago you emptied your bag and started with one empty desk. Now you call this 4th floor the basement too. Han Seoyun, who returned your dissent, came to this lab as its director the next spring. This morning in 2025, she puts a case file up on the terminal. 'It’s a training case. In the lab’s records, anyway. In reality it’s due diligence that KD Bank requested as the main bank. We submit a recommendation report within 72 hours. The decision belongs to FlowOn’s CEO, the board and the banks that lent the money.' 2023-0412 remains at the bottom edge of the cover, but you have not one sheet of paper to check that number against. Only memory. FlowOn, a dawn-delivery logistics platform, 1,140 employees. The cash runs out in 72 hours. The numbers are familiar, but memory is not evidence.",
      "memo": [
        "Records from 3 years ago -- no kept copy",
        "Bottom edge of the training case cover: 2023-0412",
        "Due diligence team: you, Do Yoonha (Trigger Lab field officer), Ban Jaewook (KD Bank Internal Audit)"
      ],
      "choices": {
        "c1_start_alone_investigate": {
          "label": "Ask Han Seoyun for more of the raw loan data"
        },
        "c1_start_alone_layoff": {
          "label": "Open the night-shift list of 18 and weigh cuts"
        },
        "c1_start_alone_funding": {
          "label": "Ask KD Bank’s officer for three days of bridge cash"
        },
        "c1_start_alone_sale": {
          "label": "Put selling the core division in the report’s first line"
        },
        "c1_start_alone_signature": {
          "label": "Tell Han Seoyun first that you have only memory"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Case desk",
      "clock": "Cash runs out · D-72h",
      "question": "You have not one sheet of paper to check against, only memory. Where will you spend the first 72 hours?",
      "lead": "3 years ago you emptied your bag and started with one empty desk. This morning that same loan number came back as the cover of a training case."
    }
  },
  "echoReplies": {
    "layoff": "When you open the list, Han Seoyun silently uncaps a highlighter. If this plan goes into the report, the cash is protected, but the loss lands on 18 floor workers.",
    "funding": "When you call, the officer first asks back for the loan number. On the day the accounting problem comes out, this new money will read as money pulled in to dodge responsibility.",
    "start_sale": "Within an hour of the draft going into the board papers, NextMile calls first. The road to survival is wider, but they set the price, holding all your circumstances.",
    "start_investigate": "When you ask, Han Seoyun puts two more data folders up on the Case desk. Your judgment is firmer, but less time remains, and the delayed decision itself becomes a new loss.",
    "accounting_disclosure": "As the number goes out as recommended, the investor’s meeting slot disappears from the screen. A way to win back trust has opened, but the investment talks stopped right there.",
    "accounting_delay": "When you nod, Bae Sungjun turns off the ledger screen. The company has gained a day, and the people waiting for tomorrow’s pay have taken on the risk without knowing.",
    "accounting_investigate": "Asked separately, the two accounts split over one month when revenue was pulled forward. But the accounting team learned first that it was under investigation.",
    "payday_disclosure": "Hearing the number, Kang Taemin puts the lid back on his noodles. People can now prepare, and one way of preparing is to quit.",
    "payday_delay": "As you leave the break room, Kang Taemin calls after you, 'See you tomorrow.' The confusion is less, but for that one day spent not knowing, people lost the chance to choose.",
    "payday_negotiate": "As the table goes around, one executive sets down his pen and looks out the window. The table is wider, but time slips by while the side that heard no reason to give way holds out.",
    "competitor_sale": "When you open the proposal, Oh Jinwoo writes a 2 in his column on the whiteboard. The terms are clear now, and who is more desperate shows up on the same table.",
    "competitor_report": "When you hand over the papers, Ban Jaewook writes Bae Sungjun’s name in his black notebook. With the bank’s investigation in front, survival talks and staff protection shake all at once.",
    "competitor_negotiate": "The CEO agrees, and when the three sides sit down together, the terms lie side by side on one sheet for the first time. The first thing cut at that table is the weakest supplier’s demand.",
    "protect": "When you put the ledger on top, the 'Protect staff' column lights up in ECHO’s table and the 'Keep the company alive' column goes dark. The jobs you saved may vanish along with the company two months from now.",
    "survive": "When the CEO signs as recommended, the 'Keep the company alive' column lights up in ECHO’s table and the 'Protect staff' column goes dark. What kind of company survives was settled by this signature.",
    "justice": "When you write it on the first page, ECHO puts KD Bank’s Corporate Finance Strategy Team on the 'Department that wrote the clause' line. The floor of trust is laid again, but to someone worried about next month’s pay, that floor is nothing yet.",
    "c1_after_people": "Explaining in person cuts down the misunderstanding. But the gaps in the promise also show right there.",
    "c1_after_numbers": "Laying out the numbers gives the argument a standard. But numbers don’t say who has to hurt first.",
    "c1_after_silence": "Silence protects the cash. Meanwhile people fill the gap with the worst stories they can make up.",
    "c1_witness_choice_1": "Making the place first delays the testimony, and testimony that comes late doesn’t collapse on its own.",
    "c1_witness_choice_2": "The locked original won’t disappear, but the moment it’s locked, the whole team is under investigation.",
    "c1_witness_choice_3": "A quiet deal buys today, and the bill comes in the name of whoever learned last.",
    "c1_assembly_choice_1": "A promise written together is hard to keep, and on the day it’s broken, everyone reads the same sentence.",
    "c1_assembly_choice_2": "A fixed order cuts down the fighting, but the person placed last never hears why.",
    "c1_assembly_choice_3": "An interim deal buys a day, and the day it comes out, that day’s cost is charged all at once.",
    "c1_assembly_choice_4": "Once the cuts start at the top, the payment order needs no explaining.",
    "c1_bargain_choice_1": "Filling the blank slows the talks, and the names of those left behind stay in the document.",
    "c1_bargain_choice_2": "Putting the weak side in first narrows the terms you can get, and those terms hold to the end.",
    "c1_bargain_choice_3": "The blank left empty doesn’t go away, and the next negotiator pays its price.",
    "c1_verdict_choice_1": "Cutting the weak side’s losses leaves the total the same, and that share moves to another column.",
    "c1_verdict_choice_2": "The money left buys time, but no one records who was left out of that time.",
    "c1_verdict_choice_3": "Disclosed grounds invite rebuttal, and that rebuttal is the only check on this decision.",
    "c1_witness_reaction_choice_1": "Once the standard is public, protection becomes procedure, not privilege.",
    "c1_witness_reaction_choice_2": "Walking away is a judgment too, and the questions left behind don’t go away.",
    "c1_witness_reaction_choice_3": "Giving him the first chance to answer speeds up rebuttal and slows down verification.",
    "c1_assembly_reaction_choice_1": "A notice that lists what isn’t known narrows the next questions.",
    "c1_assembly_reaction_choice_2": "Saying it all at once is accurate, but the anxiety until then goes uncounted.",
    "c1_assembly_reaction_choice_3": "While you chase the source, people feel they are the ones under investigation.",
    "c1_bargain_reaction_choice_1": "Filling the empty chairs slows the talks, and the deal lasts longer.",
    "c1_bargain_reaction_choice_2": "A finished terms table protects the talks, but it also fixes in place who was left out.",
    "c1_bargain_reaction_choice_3": "Waiting looks neutral, but someone pays for that time.",
    "c1_verdict_reaction_choice_1": "Who hears it first sets the character of the conclusion.",
    "c1_verdict_reaction_choice_2": "With the grounds going first, the money stays, but the order of explanation is reversed.",
    "c1_verdict_reaction_choice_3": "Minutes with only a name leave no terms for the next person.",
    "c1_branch_people_a": "Writing the names first slows the talks. In return, those people have it on record that they were not numbers.",
    "c1_branch_people_b": "Fixing payment dates grabs the weakest link first. But that cash is moved over from staff pay.",
    "c1_branch_people_c": "With only the terms left, the deal goes through. But the blank doesn’t go away, and later someone else fills it with other names.",
    "c1_branch_people_follow_a": "A public promise is hard to take back. It is a safeguard, and the first evidence aimed at you if you fail to keep it.",
    "c1_branch_people_follow_b": "Accepting terms outside the contract raises trust. But the next call demanding that exception is sure to come.",
    "c1_branch_people_follow_c": "One standard cuts down the fighting. But for those whose names were never in the contract, that standard is a notice of exclusion.",
    "c1_route_layoff_notice": "Telling them first shakes the savings plan, but the notice doesn’t end as just a notice.",
    "c1_route_layoff_fast": "A delayed notice protects the numbers, but people long remember the order in which they found out.",
    "c1_route_layoff_protect": "The moment you take one person off, the list becomes a standard. You have to be able to explain that standard.",
    "c1_final_layoff_a": "Sending the criteria first brings rebuttals. Those rebuttals cut the errors in the list.",
    "c1_final_layoff_b": "Set the order later, and the person who hears last is always decided already.",
    "c1_final_layoff_c": "Cutting from the top first shrinks the savings and makes the list more convincing.",
    "c1_route_funding_clause": "Opening the clause drags out the talks, but the right to explain remains.",
    "c1_route_funding_accept": "The time is secured, but the other side decides what can be said during that time.",
    "c1_route_funding_split": "Half the funds is half the time. In return, the subject of the sentence doesn’t change.",
    "c1_final_funding_a": "Opening the full text makes the investor uneasy and firms up the baseline for the next talks.",
    "c1_final_funding_b": "The deposit comes faster, and people who don’t know the terms pay their cost.",
    "c1_final_funding_c": "Less money runs out sooner. In return, no one edits your sentences.",
    "c1_route_sale_clean": "Splitting takes time. That time later protects who owns the evidence.",
    "c1_route_sale_bundle": "The bundle sells fast, and what was sold with it comes out later.",
    "c1_route_sale_hold": "The notice lowers the sale price, but gives customers back their choice.",
    "c1_final_sale_a": "When the dropped items are announced, the buyer lowers the price. The logs stay with the company.",
    "c1_final_sale_b": "The deal closes, and customers are the last to learn where their records went.",
    "c1_final_sale_c": "The preservation duty stays in the contract, and the next person has to check that it’s kept.",
    "c1_route_investigate_freeze": "Stopping grows the loss, but the same gap doesn’t repeat a fourth time.",
    "c1_route_investigate_shadow": "A quiet trace keeps the pace, but the moment it’s caught, the investigation itself falls under suspicion.",
    "c1_route_investigate_share": "An open investigation draws more participants, and you are no longer the conclusion’s only owner.",
    "c1_final_investigate_a": "When the author goes in, the three plans reopen. Today’s conclusion is delayed.",
    "c1_final_investigate_b": "The fastest plan buys today. The missing log shows up again in the next case.",
    "c1_final_investigate_c": "Handing the audit outside means waiting for results. In return, your own interests don’t mix into the conclusion.",
    "c1_route_system_trace": "Opening the table’s history moves the case from an accounting problem to a design problem.",
    "c1_route_system_use": "Leaving the table untouched makes today faster, and the same table lets the next case through too.",
    "c1_route_system_open": "The moment it’s read from outside, the standard stops being the company’s and becomes a record.",
    "c1_final_system_a": "Re-review takes a lot of time, but the three crises resolve into one cause.",
    "c1_final_system_b": "A buried criteria table makes the same gap again in the next case.",
    "c1_final_system_c": "Handing over the authority weakens your standard, and someone appears to verify it.",
    "c1_evidence_turn_public": "Once the author is exposed, the criteria table becomes a decision, not a mistake.",
    "c1_evidence_turn_private": "A fix with the name hidden is fast. The same person writes the next table too.",
    "c1_evidence_turn_transfer": "Handing over the right to verify takes this conclusion out of your hands, and the next case starts differently.",
    "c1_final_layoff_evidence_turn": "Lay out the calculations and the three solutions tie into one cause.",
    "c1_final_funding_evidence_turn": "Lay out the calculations and the three solutions tie into one cause.",
    "c1_final_sale_evidence_turn": "Lay out the calculations and the three solutions tie into one cause.",
    "c1_final_investigate_evidence_turn": "Lay out the calculations and the three solutions tie into one cause.",
    "c1_final_system_evidence_turn": "Lay out the calculations and the three solutions tie into one cause.",
    "c1_start_hold_layoff": "When you open the list, Han Seoyun silently uncaps a highlighter. If this plan goes into the report, the cash is protected, but the loss lands on 18 floor workers.",
    "c1_start_hold_funding": "When you call, the officer first asks back for the loan number. On the day the accounting problem comes out, this new money will read as money pulled in to dodge responsibility.",
    "c1_start_hold_sale": "Within an hour of the draft going into the board papers, NextMile calls first. The road to survival is wider, but they set the price, holding all your circumstances.",
    "c1_start_hold_investigate": "When you ask, Han Seoyun puts two more data folders up on the Case desk. Your judgment is firmer, but less time remains, and the delayed decision itself becomes a new loss.",
    "c1_start_hold_signature": "You check, and it is the same company from 3 years ago. The 72 hours shrink by the time spent checking.",
    "c1_start_record_layoff": "When you open the list, Han Seoyun silently uncaps a highlighter. If this plan goes into the report, the cash is protected, but the loss lands on 18 floor workers.",
    "c1_start_record_funding": "When you call, the officer first asks back for the loan number. On the day the accounting problem comes out, this new money will read as money pulled in to dodge responsibility.",
    "c1_start_record_sale": "Within an hour of the draft going into the board papers, NextMile calls first. The road to survival is wider, but they set the price, holding all your circumstances.",
    "c1_start_record_investigate": "When you ask, Han Seoyun puts two more data folders up on the Case desk. Your judgment is firmer, but less time remains, and the delayed decision itself becomes a new loss.",
    "c1_start_record_signature": "You ask, and the access log comes up. It has a line with your employee number too. On a date you never went down.",
    "c1_start_alone_layoff": "When you open the list, Han Seoyun silently uncaps a highlighter. If this plan goes into the report, the cash is protected, but the loss lands on 18 floor workers.",
    "c1_start_alone_funding": "When you call, the officer first asks back for the loan number. On the day the accounting problem comes out, this new money will read as money pulled in to dodge responsibility.",
    "c1_start_alone_sale": "Within an hour of the draft going into the board papers, NextMile calls first. The road to survival is wider, but they set the price, holding all your circumstances.",
    "c1_start_alone_investigate": "When you ask, Han Seoyun puts two more data folders up on the Case desk. Your judgment is firmer, but less time remains, and the delayed decision itself becomes a new loss.",
    "c1_start_alone_signature": "When you tell her, Han Seoyun scrolls the screen down one line. Then she says, 'Then write it down this time.' She knows you have nothing to prove it with."
  },
  "choiceVoiceLines": {
    "layoff": "Starting from the coldest number, you open the night-shift list of 18 and weigh the cuts.",
    "funding": "Needing money to last even one more day, you ask KD Bank’s officer for three days of bridge cash.",
    "start_sale": "Knowing the air in the room will sink, you put selling the core division in the report’s first line.",
    "start_investigate": "At the risk of looking like someone who stalls on conclusions, you ask Han Seoyun for more of the raw loan data.",
    "accounting_disclosure": "Saying they must hear it first even if they won’t like it, you recommend telling investors about 184% right away.",
    "accounting_delay": "Thinking of what would collapse if you spoke now, you push 184% to the back of the report, as Bae Sungjun wants.",
    "accounting_investigate": "Saying some things won’t be said in the same room, you meet Bae Sungjun and the accounting team separately and ask one by one.",
    "payday_disclosure": "To give them time to prepare for tomorrow morning, you tell Kang Taemin the cash left, in the night-shift break room.",
    "payday_delay": "Refusing to pass on an anxiety that isn’t settled yet, you tell Kang Taemin nothing until a payroll plan is set.",
    "payday_negotiate": "Rather than drop one side, you seat everyone together and set executive pay and supplier payment dates in one plan table.",
    "competitor_sale": "Knowing the gap the other side has pried at, you put NextMile’s 42% offer in the report’s comparison table.",
    "competitor_report": "Putting the record before the people, you hand Bae Sungjun’s liability to Investigator Ban Jaewook of KD Bank Internal Audit first.",
    "competitor_negotiate": "Saying separate meetings leave each side only what suits it, you propose calling investors, suppliers and NextMile to one table.",
    "protect": "Thinking of the people who will fall first, you put the payroll ledger on top of the report and argue to keep the jobs.",
    "survive": "Knowing it will sound cold, but that the rest depends on the company surviving, you recommend signing the term sheet to get the cash first and keep the company.",
    "justice": "Knowing it would be easier to bury it, you write Article 7 and 179.6% on the opinion’s first page.",
    "c1_after_people": "Putting the numbers aside, you stand in front of the people and explain the promises yourself.",
    "c1_after_numbers": "Instead of leading with feelings, you lay out the cash flow statement and point to the losses to absorb.",
    "c1_after_silence": "Because there is so much you can’t say, you hold off disclosure until the next funds come in.",
    "c1_witness_choice_1": "You first make a place where he can speak safely.",
    "c1_witness_choice_2": "You ask them to lock the original file first and keep it exactly as it is now.",
    "c1_witness_choice_3": "Before word spreads, you quietly square stories with the CFO.",
    "c1_assembly_choice_1": "You draft the promise to be made public together with the staff representative.",
    "c1_assembly_choice_2": "You write in the report that the payment order should be fixed in numbers.",
    "c1_assembly_choice_3": "You recommend getting past payday on an interim deal at the executives’ level.",
    "c1_assembly_choice_4": "You write that the first thing to cut is executive pay.",
    "c1_bargain_choice_1": "You say to write down who is left in the blank first, and then negotiate.",
    "c1_bargain_choice_2": "You say to put the weakest party’s terms into the offer first.",
    "c1_bargain_choice_3": "You tell them to leave the blank as it is and sign today.",
    "c1_verdict_choice_1": "You cut the weakest people’s losses first.",
    "c1_verdict_choice_2": "You secure the money to keep the company alive until tomorrow first.",
    "c1_verdict_choice_3": "You disclose the grounds and those responsible in the same document.",
    "c1_witness_reaction_choice_1": "You write the standard for protection so the whole team can read it.",
    "c1_witness_reaction_choice_2": "You record this much for today and leave the judgment to the document.",
    "c1_witness_reaction_choice_3": "You give the accused side the first chance to answer too.",
    "c1_assembly_reaction_choice_1": "You propose writing what is known and what isn’t in the same notice.",
    "c1_assembly_reaction_choice_2": "You speak only once, after the numbers are final.",
    "c1_assembly_reaction_choice_3": "You check the source of the rumors first.",
    "c1_bargain_reaction_choice_1": "You propose calling the people who aren’t in the room to the negotiating table.",
    "c1_bargain_reaction_choice_2": "You finish the terms table and then sit down across from them again.",
    "c1_bargain_reaction_choice_3": "You settle nothing until the other side arrives.",
    "c1_verdict_reaction_choice_1": "You explain first to the people who lose the most.",
    "c1_verdict_reaction_choice_2": "You submit the grounds to the investors first.",
    "c1_verdict_reaction_choice_3": "You leave only the decision-makers in the minutes.",
    "c1_branch_people_a": "With the roster open, you say to write the names of the people left behind into the agreement first.",
    "c1_branch_people_b": "Picturing the supplier owners’ faces, you propose nailing down the payment dates first.",
    "c1_branch_people_c": "Leaving no room for feelings, you send the revision with only the acquisition terms.",
    "c1_branch_people_follow_a": "Knowing a spoken promise will blur, you propose putting it on the public record.",
    "c1_branch_people_follow_b": "Not erasing a voice the contract never had, you answer that you will add those terms to the recommendation.",
    "c1_branch_people_follow_c": "Swallowing your regret, you answer that the contract is the only standard.",
    "c1_route_layoff_notice": "Before the list is final, you propose telling the people whose names are on it first.",
    "c1_route_layoff_fast": "To keep word from leaking, you delay the notice and write the savings into the report first.",
    "c1_route_layoff_protect": "Knowing the whistleblower is mixed into the list, you hand the HR head a redrawn list.",
    "c1_final_layoff_a": "Judging that the criteria must arrive before the numbers, you recommend sending them to those affected first.",
    "c1_final_layoff_b": "In the name of less confusion, you propose closing the list first and leave the notice order for later.",
    "c1_final_layoff_c": "As if looking for what to cut from the top down, you put executive pay cuts on the first line.",
    "c1_route_funding_clause": "Knowing the secret clause will gag you later, you write in the opinion that it should become a public term.",
    "c1_route_funding_accept": "Judging that time is what you need now, you propose accepting the terms as they are.",
    "c1_route_funding_split": "To keep your place to explain rather than the money, you propose taking only half.",
    "c1_final_funding_a": "Refusing to write sentences that only circle inside the board, you write that the full terms must be opened outside too.",
    "c1_final_funding_b": "Judging that the money has to come in first, you propose keeping the terms covered and fixing the deposit date.",
    "c1_final_funding_c": "To keep the right to explain, you propose cutting the size of the raise itself in half.",
    "c1_route_sale_clean": "Seeing that things that can’t be sold are mixed in, you propose splitting off the data and logs first.",
    "c1_route_sale_bundle": "Judging that cash comes first, you propose handing over the bundle as it is.",
    "c1_route_sale_hold": "So that customers don’t learn it from the news first, you propose stopping the sale and sending notice first.",
    "c1_final_sale_a": "Judging that the records can’t be sold too, you recommend pulling them from the list and announcing it.",
    "c1_final_sale_b": "So as not to shake the talks, you propose handing over the bundle as it is and putting notice after the deal.",
    "c1_final_sale_c": "As if attaching terms instead of selling, you propose binding the buyer to a duty to preserve the records.",
    "c1_route_investigate_freeze": "Knowing all three plans passed through the same gap, you propose stopping them all.",
    "c1_route_investigate_shadow": "Pretending to go along on the surface, you quietly follow the logs in the background.",
    "c1_route_investigate_share": "Seeing this isn’t a problem to hold alone, you disclose the gap.",
    "c1_final_investigate_a": "Seeing that the hand that made the gap must be found, you write the logs and their author into the opinion together.",
    "c1_final_investigate_b": "Judging that survival comes before investigation, you drop the audit and recommend only one plan.",
    "c1_final_investigate_c": "So as not to become the judge yourself, you recommend to the board that an outside accountant run the audit.",
    "c1_route_system_trace": "Seeing that the three solutions passed through the same table, you trace who edited it.",
    "c1_route_system_use": "Judging that now is not the time to dig for causes, you leave the table alone and put up the fastest plan.",
    "c1_route_system_open": "Seeing that a standard circling only inside the meeting room is the problem, you show it to people outside first.",
    "c1_final_system_a": "Seeing the criteria table as the subject of the problem, you attach it to the opinion and propose re-reviewing everything.",
    "c1_final_system_b": "Saying there is no time to explain, you cover the table and leave only the fastest road.",
    "c1_final_system_c": "Judging that you must not keep holding this table, you hand the authority to write it to someone outside.",
    "c1_evidence_turn_public": "Seeing that the table and the person who wrote it must stand together, you write both into the opinion.",
    "c1_evidence_turn_private": "As if protecting the person and fixing only the structure, you propose hiding the author and touching up only the table.",
    "c1_evidence_turn_transfer": "Seeing that if you verify it the same eyes repeat, you hand it to the next lead.",
    "c1_final_layoff_evidence_turn": "Laying the three plans’ calculations over the clue, you gauge whether all three came from the same table.",
    "c1_final_funding_evidence_turn": "Laying the three plans’ calculations over the clue, you gauge whether all three came from the same table.",
    "c1_final_sale_evidence_turn": "Laying the three plans’ calculations over the clue, you gauge whether all three came from the same table.",
    "c1_final_investigate_evidence_turn": "Laying the three plans’ calculations over the clue, you gauge whether all three came from the same table.",
    "c1_final_system_evidence_turn": "Laying the three plans’ calculations over the clue, you gauge whether all three came from the same table.",
    "c1_start_hold_layoff": "Starting from the coldest number, you open the night-shift list of 18 and weigh the cuts.",
    "c1_start_hold_funding": "Needing money to last even one more day, you ask KD Bank’s officer for three days of bridge cash.",
    "c1_start_hold_sale": "Knowing the air in the room will sink, you put selling the core division in the report’s first line.",
    "c1_start_hold_investigate": "At the risk of looking like someone who stalls on conclusions, you ask Han Seoyun for more of the raw loan data.",
    "c1_start_hold_signature": "Before taking the words training case at face value, you first check whether the names on the wall and this case file’s number belong to the same case.",
    "c1_start_record_layoff": "Starting from the coldest number, you open the night-shift list of 18 and weigh the cuts.",
    "c1_start_record_funding": "Needing money to last even one more day, you ask KD Bank’s officer for three days of bridge cash.",
    "c1_start_record_sale": "Knowing the air in the room will sink, you put selling the core division in the report’s first line.",
    "c1_start_record_investigate": "At the risk of looking like someone who stalls on conclusions, you ask Han Seoyun for more of the raw loan data.",
    "c1_start_record_signature": "Because someone opened the box before you, you first ask when the seal tape on the B2 box was changed.",
    "c1_start_alone_layoff": "Starting from the coldest number, you open the night-shift list of 18 and weigh the cuts.",
    "c1_start_alone_funding": "Needing money to last even one more day, you ask KD Bank’s officer for three days of bridge cash.",
    "c1_start_alone_sale": "Knowing the air in the room will sink, you put selling the core division in the report’s first line.",
    "c1_start_alone_investigate": "At the risk of looking like someone who stalls on conclusions, you ask Han Seoyun for more of the raw loan data.",
    "c1_start_alone_signature": "Refusing to pass memory off as evidence, you tell Han Seoyun first that you have only memory."
  },
  "pack": {
    "clue": {
      "title": "The Hidden Payroll Sheet",
      "text": "There are traces of money that moved before the official report. Someone already knew about the next case."
    },
    "outcomes": {
      "c1_after_people": {
        "tag": "People first",
        "title": "You Called Their Names Before the Payslips",
        "text": "Staff and suppliers don’t fully trust your decision, but at least they know who bears the cost. The next case starts more slowly, the price of protecting people."
      },
      "c1_after_numbers": {
        "tag": "Numbers disclosed",
        "title": "The Cash Flow Statement Became a Promise",
        "text": "The company faces more questions, but the hidden losses shrank. The next case asks whether to trust the records or the people."
      },
      "c1_after_silence": {
        "tag": "Silence chosen",
        "title": "You Bought One Quiet Day",
        "text": "The funds bought a day, but the staff’s trust recovers late. The next case comes with costs no one explained."
      }
    },
    "continuityChallenges": {
      "p5_after_hold": {
        "title": "Link the Wall’s Names to Today’s",
        "text": "The 11 names you kept on the wall for 3 years are memory, not record. Find a choice within today’s 72 hours that shows who those names point to, and a hidden clue may open."
      },
      "p5_after_record": {
        "title": "Trace the Changed Seal Tape",
        "text": "The box in B2 doesn’t carry the seal you put on 3 years ago. A choice that first asks whose hands your records passed through restores fairness and lowers the pressure."
      },
      "p5_after_alone": {
        "title": "Don’t Hold Memory Alone",
        "text": "The 3 years that began with an empty bag left nothing to prove. A choice that first tells the person beside you that you have only memory lowers the pressure."
      }
    }
  }
};
