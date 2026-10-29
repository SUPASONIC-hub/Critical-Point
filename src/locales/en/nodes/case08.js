/**
 * 사건 08 (src/nodes/case08.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c8_start": {
      "title": "A Window 240km Away",
      "text": "Day 9 at KD Bank’s Gangwon Yeongdong Branch. You are clearing out dormant corporate accounts when one line stops your hand. Haeon Partners, a consulting firm registered to a guesthouse address in Gyeongpo. For 3 years, advisory fees have come in every quarter, and on the same day the full amount goes out to a gallery in Cheongdam-dong, Seoul. And this morning, the company’s liquidation application was filed. Branch Manager Na Junhyuk sets down a cup of instant coffee. 'Your predecessor sent that account up three times. All three came back rejected.'",
      "memo": [
        "Haeon Partners: quarterly advisory fees withdrawn in full the day they arrive",
        "Paid in by: Novaworks, an advisory firm in the Bridge Bank group",
        "Paid out to: Gallery On, Cheongdam-dong",
        "72 hours to liquidation registration; after that, the account can’t be looked up"
      ],
      "choices": {
        "c8_start_ask": {
          "label": "Ask Branch Manager Na why it was returned three times"
        },
        "c8_start_report": {
          "label": "Sign and file a suspicious transaction report on Haeon"
        },
        "c8_start_copy": {
          "label": "Copy Haeon’s account history to USB, no lookup log"
        },
        "reframe": {
          "label": "Look for more companies at the same address"
        }
      },
      "place": "KD Bank Gangwon Yeongdong Branch · Corporate loan desk",
      "clock": "72h to liquidation registration",
      "question": "An account returned three times will be liquidated in 72 hours. How do you hold on to this one line?",
      "lead": "Nine in the morning, and no one stands at the windows. One line in the list of long-dormant accounts sends money to Seoul every quarter."
    },
    "c8_trail": {
      "title": "The List of Desires",
      "text": "It has been more than two weeks since Oh Jinwoo handed in his resignation. On a video call, he shows you four A4 sheets taped to his wall. The head of Gallery On is Managing Director Yoon Sanghyuk’s wife; the real owner of the Gyeongpo guesthouse is his brother-in-law. Two summers ago he was a Team Head on the 6th floor; now he is a Managing Director in the Group Strategy Office on the 33rd floor of group headquarters. The order to name Oh Jinwoo as the one responsible, and the folder holding both your profiles, came out of that office. 'In the end, people are slaves to desire. Desire spends money, and money leaves a trace. That’s what my father told me the day he was pushed out of his branch.' He laughs briefly. 'Do you know who he learned it from? Yoon Sanghyuk, he says.'",
      "memo": [
        "Head of Gallery On: in Yoon Sanghyuk’s wife’s name",
        "Real owner of the Haeon guesthouse: Yoon Sanghyuk’s brother-in-law",
        "Oh Jinwoo has resigned and is tracing on his own",
        "Material of unclear origin weakens the evidence"
      ],
      "choices": {
        "c8_trail_family": {
          "label": "List assets in Yoon’s wife’s and brother-in-law’s names"
        },
        "c8_trail_money": {
          "label": "Follow only the money’s path from Haeon to Gallery On"
        },
        "c8_trail_split": {
          "label": "Keep Oh Jinwoo’s files and yours in separate folders"
        },
        "reframe": {
          "label": "Look for more companies at the same address"
        },
        "c8_trail_evidence_turn": {
          "label": "Lay deposit dates and approval dates on one calendar"
        }
      },
      "place": "KD Bank Gangwon Yeongdong Branch · Corporate loan officer’s desk",
      "clock": "70h to liquidation registration",
      "question": "The gallery and the guesthouse lead to the names of Yoon Sanghyuk’s family. How far do you follow?",
      "lead": "Oh Jinwoo, who has resigned, calls you on video. Four A4 sheets are taped to the wall of his room."
    },
    "c8_gallery": {
      "title": "The Price of Paintings",
      "text": "Gallery On, Cheongdam-dong. Ban Jaewook, who has handed in his resignation, stands like a visitor and copies the price tags into his notebook. Twelve small works by an unknown artist, 120 million won each. Every buyer is a partner company of Novaworks or Bridge Bank, and the artist is the nephew of Namgoong Hyun, Deputy President of Bridge Bank. 'Paintings make a good tool. They have no set price. Overpay for one, and that’s the bribe.' He doesn’t close the notebook. 'I’m an investigator who has resigned, so there’s nowhere to hand this in. I write it down anyway.'",
      "memo": [
        "12 small works × 120 million won = 1.44 billion won",
        "Every buyer is a Novaworks or Bridge Bank partner company",
        "Artist: nephew of Bridge Bank Deputy President Namgoong Hyun",
        "Art has no market price, so breach of trust is hard to prove"
      ],
      "choices": {
        "c8_gallery_price": {
          "label": "Get a separate appraisal of the twelve small works"
        },
        "c8_gallery_note": {
          "label": "Take Ban Jaewook’s notebook as testimony at Gallery On"
        },
        "c8_gallery_buyers": {
          "label": "Visit each partner-company buyer at their office"
        },
        "reframe": {
          "label": "Look for more companies at the same address"
        },
        "c8_gallery_evidence_turn": {
          "label": "Lay deposit dates and approval dates on one calendar"
        }
      },
      "place": "Gallery On, Cheongdam-dong · Exhibition hall",
      "clock": "46h to liquidation registration",
      "question": "Twelve small works by an unknown artist sold for 120 million won each. How do you turn these prices into evidence?",
      "lead": "You came up to Seoul on the dawn bus. Ban Jaewook has resigned, but he is already here with his notebook."
    },
    "c8_bait": {
      "title": "Bait",
      "text": "Oh Jinwoo lays out a plan. Leak a rumor to Yoon Sanghyuk’s side that 'Internal Audit is looking at Haeon Partners', and they will rush to move the remaining money before liquidation. Money moved in a hurry leaves the clearest trace. For the first time, his voice shakes. 'I know how fast that man closes a file. This time I want to set the speed.' A transaction drawn out on purpose makes the trace clear, and for the same reason it blurs in court. To stop the money, you have to apply to the court for a freeze order before liquidation.",
      "memo": [
        "Once the rumor spreads, funds will likely move within a day",
        "An induced transaction may be disputed as evidence",
        "Oh Jinwoo doesn’t deny it is personal revenge",
        "2 gallery employees handle the remittances"
      ],
      "choices": {
        "c8_bait_stop": {
          "label": "Stop Oh Jinwoo and seek a freeze order before liquidation"
        },
        "c8_bait_listen": {
          "label": "Pause the plan and hear about Oh Jinwoo’s father"
        },
        "c8_bait_set": {
          "label": "Leak an audit rumor to Yoon’s side to move the money"
        },
        "reframe": {
          "label": "Look for more companies at the same address"
        },
        "c8_bait_evidence_turn": {
          "label": "Lay deposit dates and approval dates on one calendar"
        }
      },
      "place": "Haeon Guesthouse, Gyeongpo · Office building",
      "clock": "22h to liquidation registration",
      "question": "Leak the rumor, and the money moves in a hurry and leaves a clear trace. Do you set the bait?",
      "lead": "The lights in the guesthouse office are off, and a car with Seoul plates sits in the lot. Oh Jinwoo lays out a plan."
    },
    "c8_final": {
      "title": "The Hand on the Knife",
      "text": "Haeon Partners’ advisory fees, the gallery’s painting prices, and the names of Yoon Sanghyuk’s family where that money landed now connect on a single trace sheet. Before he hands over the file, Oh Jinwoo asks. 'This can bring him down. But if bringing him down is the point, how am I any different from him?' What remains is whose hand you put the knife in.",
      "memo": [
        "Trace sheet: Haeon advisory fees -> gallery painting prices -> Yoon family",
        "Referral to prosecutors: months before anything goes public",
        "Usable as leverage in talks with the banks that lent to FlowOn (the creditor group)",
        "Oh Jinwoo is already in touch with an investigative reporter"
      ],
      "choices": {
        "c8_final_press": {
          "label": "Hand it first to the reporter Oh Jinwoo contacted"
        },
        "c8_final_law": {
          "label": "Turn the trace sheet into a referral to prosecutors"
        },
        "c8_final_lever": {
          "label": "Walk into creditor talks with the trace sheet in hand"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Gyeongpo breakwater",
      "clock": "5h to liquidation registration",
      "question": "The trace sheet is done, and Oh Jinwoo asks how he is different. Whose hand do you put this knife in?",
      "lead": "At dawn, Oh Jinwoo stands on the breakwater holding the file. The first boat comes in from the sea."
    },
    "c8_aftershock": {
      "title": "The Day After Liquidation",
      "text": "Haeon Partners’ liquidation is registered after all. The account is closed, and a copy of the trace sheet, the money’s whole path on one page, stays in your hands. Oh Jinwoo went up to Seoul from the breakwater and isn’t answering his phone. On the way home from work, Branch Manager Na Junhyuk orders a plate of stuffed squid and says, 'For 30 years here, all I did was curse the head-office people. I never did a thing. Those three returns? I pressed the approve button on them under my own employee ID.' He sets down his chopsticks. 'This time I’ll send it up myself, under my own ID. The seal stays in the drawer. I haven’t had to take it out since electronic approval came in.'",
      "memo": [
        "Haeon Partners’ liquidation registered",
        "Branch manager admits he approved the past returns himself",
        "Oh Jinwoo out of contact in Seoul",
        "One copy of the trace sheet stays with you"
      ],
      "choices": {
        "c8_after_law": {
          "label": "Put the trace sheet on record with the manager’s approval"
        },
        "c8_after_blade": {
          "label": "Keep the trace sheet to yourself and wait for the moment"
        },
        "c8_after_friend": {
          "label": "Go up to Seoul to find Oh Jinwoo first"
        }
      },
      "place": "Gangneung Central Market · Stuffed squid restaurant",
      "clock": "Day after liquidation registration",
      "question": "After 30 years, the branch manager files an approval under his own ID. What do you do with the copy of the trace sheet in your hands?"
    },
    "c8_sundae": {
      "title": "Stuffed Squid",
      "text": "At lunch, Branch Manager Na Junhyuk takes you to a stuffed squid place in a market alley. He says not one word about the report returned three times; he only explains the order for dipping the squid in egg. 'Seoul people just eat it as is. That’s why they don’t know how it tastes.' When he pays, he writes your predecessor’s cell number on the back of the receipt.",
      "memo": [
        "Predecessor took early retirement 2 years ago",
        "Branch manager never mentions the returns",
        "One number on the back of a receipt"
      ],
      "choices": {
        "c8_sundae_choice_2": {
          "label": "Keep the number and check the return records first"
        },
        "c8_sundae_choice_1": {
          "label": "Call the predecessor now and hear the story"
        },
        "c8_sundae_choice_3": {
          "label": "Ask nothing today; just praise the squid"
        }
      },
      "place": "Gangneung Central Market · Stuffed squid alley",
      "clock": "69h to liquidation registration",
      "question": "The branch manager writes the predecessor’s number on the back of the receipt. When do you use it?"
    },
    "c8_mother": {
      "title": "Side Dishes",
      "text": "Do Yoonha calls. Oh Jinwoo’s mother has come to the Trigger Lab lobby with containers of side dishes. She doesn’t know her son has quit, and she worries that he spends every night digging through old papers. 'His father was just like that before he quit.' Do Yoonha asks quietly. 'What should I tell her?'",
      "memo": [
        "Mother doesn’t know her son resigned",
        "Oh Jinwoo’s father acted the same just before retiring",
        "Do Yoonha refuses to lie"
      ],
      "choices": {
        "c8_mother_choice_3": {
          "label": "Say only that he’s well, and take the containers"
        },
        "c8_mother_choice_1": {
          "label": "Call Oh Jinwoo and have him tell her himself"
        },
        "c8_mother_choice_2": {
          "label": "Confirm only that he resigned, per company rules"
        }
      },
      "place": "Trigger Lab · 1st-floor lobby",
      "clock": "40h to liquidation registration",
      "question": "Oh Jinwoo’s mother doesn’t know her son has quit. What do you have Do Yoonha tell her?"
    },
    "c8_clerks": {
      "title": "The Ones Who Pressed Approve",
      "text": "On their way home, two Gallery On employees stop Ban Jaewook. They are the ones who approved the painting payments with OTPs on the company’s online banking, they say, and if the people above them fall, only their names will be left. Twenty-six and twenty-nine. One of them is still on probation. Ban Jaewook closes his notebook. 'Most of the 47 people I cut were about this age.'",
      "memo": [
        "Payment-approval OTPs are in the 2 employees’ names",
        "One is 3 months into probation",
        "Both say they will cooperate"
      ],
      "choices": {
        "c8_clerks_choice_2": {
          "label": "Take statements and list them as witnesses by the book"
        },
        "c8_clerks_choice_1": {
          "label": "First find a way to protect them as cooperators"
        },
        "c8_clerks_choice_3": {
          "label": "Leave the staff out; use only the traces above them"
        }
      },
      "place": "Gallery On, Cheongdam-dong · Back alley",
      "clock": "14h to liquidation registration",
      "question": "The ones who approved the payments are twenty-six and twenty-nine. How do you handle these two?"
    },
    "c8_sundae_reaction": {
      "title": "The Predecessor’s Voice",
      "text": "Back at the branch, Branch Manager Na Junhyuk dials the number on his own phone and turns on the speaker. The predecessor runs an orchard in Chuncheon. A tiller rattles in the background. 'I sent it up three times. After the third return I had an HR interview, and I never sent a fourth. Those people look at whoever rejects before they look at whoever reports.' Listening beside you, the branch manager quietly sets down his coffee cup.",
      "memo": [
        "The fourth of a report returned three times",
        "The rejecter, seen before the reporter"
      ],
      "choices": {
        "c8_sundae_reaction_choice_2": {
          "label": "Confirm only the rejection approval chain on paper"
        },
        "c8_sundae_reaction_choice_1": {
          "label": "Take his testimony and attach it to a report on the returns"
        },
        "c8_sundae_reaction_choice_3": {
          "label": "End the call without dragging the orchard in"
        }
      },
      "place": "KD Bank Gangwon Yeongdong Branch · Branch manager’s office",
      "clock": "67h to liquidation registration",
      "question": "The predecessor sent it up three times and gave up on the fourth. How do you keep his voice on record?"
    },
    "c8_mother_reaction": {
      "title": "Rolled Omelet",
      "text": "Do Yoonha carries the containers up to the 4th floor and starts a video call. Stir-fried anchovies, perilla leaves, and the rolled omelet Oh Jinwoo apparently loved as a kid. Halfway through opening a container, Do Yoonha laughs. 'I probably shouldn’t eat this, right?' Do Yoonha eats one piece and holds up another to you on the screen. Then Do Yoonha says, 'Revenge or whatever it is, he has to eat first.'",
      "memo": [
        "A meal that comes before revenge",
        "Family who worry without knowing"
      ],
      "choices": {
        "c8_mother_reaction_choice_2": {
          "label": "Ship the containers and keep contact by the book"
        },
        "c8_mother_reaction_choice_3": {
          "label": "Leave the containers in the pantry and step back"
        },
        "c8_mother_reaction_choice_1": {
          "label": "Take the containers to Oh Jinwoo yourself"
        }
      },
      "place": "Trigger Lab, 4th floor · Pantry (video call)",
      "clock": "38h to liquidation registration",
      "question": "A container of rolled omelet sits in the pantry. What do you do with it?"
    },
    "c8_clerks_reaction": {
      "title": "3 Months on Probation",
      "text": "ECHO brings up the two employees’ salary transfers. The probationer’s monthly pay is 0.2% of the painting money that same employee approved. 'The higher a trace goes, the fainter it gets; the lower it comes, the clearer the names. On this sheet, the clearest name belongs to the person paid the least.'",
      "memo": [
        "Paid the least, named the clearest",
        "The order for reading a trace sheet"
      ],
      "choices": {
        "c8_clerks_reaction_choice_2": {
          "label": "Keep the names; add a pay-to-responsibility ratio"
        },
        "c8_clerks_reaction_choice_1": {
          "label": "Reorder so the two names come last"
        },
        "c8_clerks_reaction_choice_3": {
          "label": "Start with the clearest names to open the probe fast"
        }
      },
      "place": "Gallery On, Cheongdam-dong · Back alley",
      "clock": "13h to liquidation registration",
      "question": "The clearest name on the trace sheet belongs to the person paid the least. What do you do with the order?"
    },
    "c8_branch_ledger": {
      "title": "Han Seoyun’s Painting",
      "text": "In one partner company’s expense ledger, a painting purchase is booked as 'client entertainment'. The name in the guest column is Han Seoyun. Han Seoyun takes your call and stays silent a long while before speaking. 'That painting has hung on my office wall for 3 years. I got it as a promotion gift. That same year, I signed the review box next to the approval box on 2023-0412.'",
      "memo": [
        "Partner ledger: painting booked as entertainment",
        "Recipient: Han Seoyun (then Deputy Manager)",
        "Same year, Han Seoyun signed the 2023-0412 review box",
        "Han Seoyun offers to return the painting voluntarily"
      ],
      "choices": {
        "c8_branch_ledger_a": {
          "label": "Put Han Seoyun’s name on the trace sheet as is"
        },
        "c8_branch_ledger_b": {
          "label": "Give Han Seoyun time to self-report"
        },
        "c8_branch_ledger_c": {
          "label": "Use only the giver’s ledger, not the recipient"
        }
      },
      "place": "Outside Gallery On, Cheongdam-dong · Call with Han Seoyun",
      "clock": "44h to liquidation registration",
      "question": "Han Seoyun’s name is in the recipient column. How do you write it on the trace sheet?"
    },
    "c8_branch_ledger_follow": {
      "title": "The Painting Off the Wall",
      "text": "The next morning, Han Seoyun comes to the Yeongdong Branch carrying the wrapped painting, after a four-hour drive. 'Do you know why I couldn’t take this down for 3 years? Because I liked it. I really liked the painting.' Han Seoyun smiles for the first time, and the smile can’t be told apart from crying. What remains is where to put the painting.",
      "memo": [
        "Han Seoyun’s self-report drafted",
        "Painting appraised at 6% of the sale price",
        "Storing it in the branch vault leaves an evidence-custody record"
      ],
      "choices": {
        "c8_branch_ledger_follow_a": {
          "label": "Seal it in the branch vault as evidence"
        },
        "c8_branch_ledger_follow_c": {
          "label": "Send the painting back; take only the report"
        },
        "c8_branch_ledger_follow_b": {
          "label": "Add your confirming signature to the self-report"
        }
      },
      "place": "KD Bank Gangwon Yeongdong Branch · Banking hall",
      "clock": "24h to liquidation registration",
      "question": "Han Seoyun drove four hours to bring the painting. Where do you put it?"
    },
    "c8_route_system": {
      "title": "Seven Companies, One Address",
      "text": "You ask whether any other companies share Haeon Partners’ address. ECHO searches. The corporate registry history opens. Over the past 6 years, seven companies have had the same address as Haeon Partners, the same tax agent, and the same liquidation timing. The trace isn’t a single line. It is a pattern the same hand drew again and again.",
      "memo": [
        "7 companies with the same address and tax agent",
        "All liquidated just before an audit began",
        "The seventh is Haeon Partners"
      ],
      "choices": {
        "c8_route_system_one": {
          "label": "Fold the map and dig into Haeon Partners alone"
        },
        "c8_route_system_agent": {
          "label": "Visit the tax agent behind all seven first"
        },
        "c8_route_system_map": {
          "label": "Connect the seven companies’ flows on one map"
        },
        "c8_route_system_evidence_turn": {
          "label": "Lay deposit dates and approval dates on one calendar"
        }
      },
      "place": "KD Bank Gangwon Yeongdong Branch · Corporate registry terminal",
      "clock": "16h to liquidation registration",
      "question": "Seven companies used the same address and tax agent. How far do you open this pattern?"
    },
    "c8_final_system_route": {
      "title": "The Seventh Box",
      "text": "10 hours to liquidation registration. On the Yeongdong Branch terminal, seven companies with the same address and the same tax agent stand in a row. The first six vanished just before audits began, and the seventh, Haeon Partners, is on the same road. ECHO lines up seven dates in a column. 'Six times, no one connected them. The seventh is on your screen now.'",
      "memo": [
        "7 companies with the same address and tax agent",
        "The first six: wound up just before audits began",
        "10 hours to Haeon Partners’ liquidation registration"
      ],
      "choices": {
        "c8_final_system_route_c": {
          "label": "Leave your lookup record in the pattern’s last box"
        },
        "c8_final_system_route_a": {
          "label": "Bundle the seven as one pattern and take it outside"
        },
        "c8_final_system_route_b": {
          "label": "Keep only the Haeon Partners case; bury the rest"
        }
      },
      "place": "KD Bank Gangwon Yeongdong Branch · Corporate registry terminal",
      "clock": "10h to liquidation registration",
      "question": "The seventh company disappears in a few hours. How do you close this pattern?"
    },
    "c8_evidence_turn": {
      "title": "Deposit Dates and Approval Dates",
      "text": "Lay the clues on a calendar, and the rule shows. All 12 dates when advisory fees reached Haeon Partners fall on the business day after KD Bank gave Novaworks or Bridge Bank a favorable approval. One of them is the day, 3 years ago, when 2023-0412’s collateral priority passed to Bridge Bank.",
      "memo": [
        "12 deposits = 12 business days after approvals",
        "Includes the date 2023-0412’s collateral priority changed",
        "A match hard to explain as chance"
      ],
      "choices": {
        "c8_evidence_turn_calendar": {
          "label": "Make one calendar page and put it first in the referral"
        },
        "c8_evidence_turn_share": {
          "label": "Tell the creditors pushed down in priority first"
        },
        "c8_evidence_turn_hold": {
          "label": "Hold the calendar and pull it out at the negotiation"
        }
      },
      "place": "KD Bank Gangwon Yeongdong Branch · Night-duty room",
      "clock": "8h to liquidation registration",
      "question": "Every advisory-fee deposit lands the business day after an approval. How do you use this calendar?"
    },
    "c8_start_stand": {
      "title": "Branch of the One Who Went to People",
      "text": "Before you left, you met the people who gave you material, one by one. Three of them text the Yeongdong Branch to check on you. Then, on day 9, a strange company catches your eye in the list of dormant accounts. Haeon Partners, a consulting firm registered to a guesthouse address in Gyeongpo. For 3 years, advisory fees have come in every quarter, and on the same day the full amount goes out to Gallery On in Cheongdam-dong, Seoul. This morning the company’s liquidation application was filed; once it is registered in 72 hours, the account can’t be looked up. The account history shows your predecessor sent it up three times, and all three times it came back rejected. Branch Manager Na Junhyuk sets down a cup of instant coffee.",
      "memo": [
        "Still in touch with the people who gave you material",
        "Odd flow found in the Haeon Partners account",
        "72 hours to liquidation registration"
      ],
      "choices": {
        "c8_start_stand_ask": {
          "label": "Ask Branch Manager Na why it was returned three times"
        },
        "c8_start_stand_report": {
          "label": "Sign and file a suspicious transaction report on Haeon"
        },
        "c8_start_stand_copy": {
          "label": "Copy Haeon’s account history to USB, no lookup log"
        },
        "c8_start_stand_signature": {
          "label": "Ask the three who texted to help trace the account"
        },
        "c8_start_stand_reframe": {
          "label": "Look for more companies at the same address"
        }
      },
      "place": "KD Bank Gangwon Yeongdong Branch · Corporate loan desk",
      "clock": "72h to liquidation registration",
      "question": "Some people have checked in, and the account vanishes in 72 hours. How do you hold on to this one line?",
      "lead": "Of the people you met one by one before leaving, three texted the branch. Then a strange company catches your eye in the list of dormant accounts."
    },
    "c8_start_open": {
      "title": "First Day for the One Who Skipped the Train",
      "text": "You weren’t on the 06:40 train; you came down by bus two days late. The branch manager doesn’t ask about the delay and gives you a desk. The originals you handed the external auditor have drawn no answer yet. Instead, a dormant account at this branch answers. Haeon Partners, a consulting firm registered to a guesthouse address in Gyeongpo. For 3 years, advisory fees have come in every quarter, and on the same day the full amount goes out to Gallery On in Cheongdam-dong, Seoul. This morning the company’s liquidation application was filed; once it is registered in 72 hours, the account can’t be looked up. The account history shows your predecessor sent it up three times, and all three times it came back rejected.",
      "memo": [
        "Late arrival noted in your HR file",
        "Waiting on the external auditor’s reply",
        "Odd flow found in the Haeon Partners account"
      ],
      "choices": {
        "c8_start_open_copy": {
          "label": "Copy Haeon’s account history to USB, no lookup log"
        },
        "c8_start_open_ask": {
          "label": "Ask Branch Manager Na why it was returned three times"
        },
        "c8_start_open_signature": {
          "label": "Attach this account to the originals sent to the auditor"
        },
        "c8_start_open_report": {
          "label": "Sign and file a suspicious transaction report on Haeon"
        },
        "c8_start_open_reframe": {
          "label": "Look for more companies at the same address"
        }
      },
      "place": "KD Bank Gangwon Yeongdong Branch · Corporate loan desk",
      "clock": "72h to liquidation registration",
      "question": "The originals went to the auditor, but the money still passes this window. How do you hold on to this one line?",
      "lead": "You came down by bus two days late instead of by train. Branch Manager Na Junhyuk didn’t ask why, and a dormant account speaks to you instead."
    },
    "c8_start_alone": {
      "title": "Window of the One Who Came Quietly",
      "text": "You came down without telling anyone. You contacted no one, so no one knows what you are looking at. This time, that quiet becomes a weapon. One line in the list of dormant accounts points to where to use it. Haeon Partners, a consulting firm registered to a guesthouse address in Gyeongpo. For 3 years, advisory fees have come in every quarter, and on the same day the full amount goes out to Gallery On in Cheongdam-dong, Seoul. This morning the company’s liquidation application was filed; once it is registered in 72 hours, the account can’t be looked up. The account history shows your predecessor sent it up three times, and all three times it came back rejected. Branch Manager Na Junhyuk sets down a cup of instant coffee.",
      "memo": [
        "No one expects you to look",
        "Odd flow found in the Haeon Partners account",
        "Files you hold alone have no evidence-custody record"
      ],
      "choices": {
        "c8_start_alone_signature": {
          "label": "Silently watch the last flows before liquidation"
        },
        "c8_start_alone_copy": {
          "label": "Copy Haeon’s account history to USB, no lookup log"
        },
        "c8_start_alone_report": {
          "label": "Sign and file a suspicious transaction report on Haeon"
        },
        "c8_start_alone_ask": {
          "label": "Ask Branch Manager Na why it was returned three times"
        },
        "c8_start_alone_reframe": {
          "label": "Look for more companies at the same address"
        }
      },
      "place": "KD Bank Gangwon Yeongdong Branch · Corporate loan desk",
      "clock": "72h to liquidation registration",
      "question": "No one knows what you are looking at. How do you use this line you found quietly?",
      "lead": "You came to this branch without telling anyone. With no one calling, you had time to read the list of dormant accounts to the end."
    }
  },
  "echoReplies": {
    "c8_start_report": "You file it, and your name is stamped in the author field. A suspicious transaction report stays on the record, and this time whoever sends it back has to write down why.",
    "c8_start_copy": "You move the history to USB, and nothing shows in the lookup log. For the same reason, in court that copy never existed.",
    "c8_start_ask": "You ask the branch manager, and a few of the 72 hours vanish with a plate of stuffed squid. In return, you learn one thing: he remembers each of those three returns.",
    "c8_trail_money": "Line up only the dates in and out, and the trace connects cleanly. On screen, Oh Jinwoo takes one A4 sheet off his wall and sets it down. That cleanness seems to sound cold to him.",
    "c8_trail_family": "Add the family’s holdings, and another A4 sheet goes up on Oh Jinwoo’s wall. That sheet holds names that have nothing to do with this.",
    "c8_trail_split": "Splitting the folders leaves no gap for sources to mix. It costs time, and on screen Oh Jinwoo looks a little hurt.",
    "c8_gallery_price": "When the appraisal arrives, the unknown artist’s small works become numbers for the first time. You paid the money and time it took to get them.",
    "c8_gallery_buyers": "You visit, and the buyers mostly say the same thing: they bought what they were told to buy from above. Their names are the first to shake.",
    "c8_gallery_note": "As you take the notebook, Ban Jaewook puts down his pen for the first time. It is a careful but private record, and the moment it becomes testimony, Ban Jaewook takes the witness stand too.",
    "c8_bait_set": "You leak the rumor, and in less than a day two gallery employees are at the remittance window. An induced transaction is clear, and the defense will first ask who made it so clear.",
    "c8_bait_stop": "You file, and the court’s intake window hands you a number ticket first. No one can promise the ruling will beat the registration, and Oh Jinwoo thinks you took his knife.",
    "c8_bait_listen": "You hear him out, and the plan slips a day. In return, for the first time, Oh Jinwoo says out loud who the plan is for.",
    "c8_final_law": "You hand over the referral; it gets a case number, and then silence. The law’s knife comes down over months, and meanwhile the trace sheet passes through many hands.",
    "c8_final_lever": "You sit down holding the trace sheet, and the creditors’ voices drop a notch. The trace is used to save people, and punishment is put off and becomes part of the deal.",
    "c8_final_press": "You hand over the file, and the reporter replies within 1 minute. The press is the fastest knife, and on the day the story runs, the first one hurt is usually the person named in small print.",
    "c8_after_law": "With the branch manager’s ID on the approval line, the trace sheet records his 30 years too. He knew that when he pressed the button.",
    "c8_after_friend": "The friend you went looking for opens the door. Meanwhile, the trace sheet waits one more day in your bag.",
    "c8_after_blade": "A knife held alone can be used any time. No one will explain for you why it was used.",
    "c8_sundae_choice_1": "A call made right away opens up the person first. Words from someone unprepared may not be accurate.",
    "c8_sundae_choice_2": "Checking the records first sharpens your questions. Meanwhile, the predecessor may lose any reason to pick up.",
    "c8_sundae_choice_3": "A lunch with no questions is easy. Why the branch manager wrote down the number stays unexplained for another day.",
    "c8_mother_choice_1": "Having him tell her himself means that tonight he does one thing other than revenge. Whether he makes the call, no one knows.",
    "c8_mother_choice_2": "Confirming it by the rules involves no lie. His mother hears it alone in the lobby.",
    "c8_mother_choice_3": "Taking the containers for him keeps today quiet. That quiet piles up without Oh Jinwoo knowing.",
    "c8_clerks_choice_1": "With protection set up first, the two tell you everything. While you build it, the liquidation clock doesn’t stop.",
    "c8_clerks_choice_2": "Listing them as witnesses makes the statements solid. Their names become just as solid in the same document.",
    "c8_clerks_choice_3": "Leaving the staff out is fast. The payment approvals are still on record under their names.",
    "c8_sundae_reaction_choice_1": "With his testimony attached, the report says the returns were no mistake. After 2 years, he is a party to it again.",
    "c8_sundae_reaction_choice_2": "The approval chain shows who blocked it. Why they blocked it isn’t in the documents.",
    "c8_sundae_reaction_choice_3": "Ending the call leaves him at his orchard. The three returns are still returns without a reason.",
    "c8_mother_reaction_choice_1": "When you go in person, he may or may not open the door. Either way, the side dishes get delivered.",
    "c8_mother_reaction_choice_2": "The parcel arrives right on time. Who sent it survives only as one name on the shipping label.",
    "c8_mother_reaction_choice_3": "When you step back, the revenge becomes his alone. The rolled omelet in the pantry will be cold by tomorrow.",
    "c8_clerks_reaction_choice_1": "With the order changed, the trace sheet reads from the top. The top is faint, so readers have to look longer.",
    "c8_clerks_reaction_choice_2": "With the ratio attached, the numbers defend the two. The court looks at approval records before ratios.",
    "c8_clerks_reaction_choice_3": "The clear names open the probe fast. The first one called in is 3 months into probation.",
    "c8_branch_ledger_a": "Putting down the name of someone you like makes the trace sheet fair. That day, for the first time, Han Seoyun doesn’t avoid you.",
    "c8_branch_ledger_b": "Time to speak up makes Han Seoyun a witness. Meanwhile, one box on the trace sheet stays blank.",
    "c8_branch_ledger_c": "Writing only the giver’s side exposes the design. The recipient’s 3 years stay hanging on the wall, like the painting.",
    "c8_branch_ledger_follow_a": "In the vault, the painting gets an evidence number. Han Seoyun will remember that number for a long time.",
    "c8_branch_ledger_follow_b": "With your signature beside it, Han Seoyun isn’t the only one who reported. You become someone who saw that painting too.",
    "c8_branch_ledger_follow_c": "The painting sent back will hang on someone’s wall again. One report weighs less than a painting.",
    "c8_route_system_map": "Joined on one page, the seven companies look like one person’s handwriting. While you draw the map, the liquidation clock keeps running.",
    "c8_route_system_one": "Digging into one company gathers material fast. The six before it stay unrelated companies, once again.",
    "c8_route_system_agent": "You visit, and the tax agent says all seven were done as the client asked. Who the client was is in his books.",
    "c8_final_system_route_a": "Bundled as a pattern, Haeon Partners isn’t a case but the seventh instance. Whoever receives it has to read again from the first.",
    "c8_final_system_route_b": "Keeping one case makes the explanation short. When the same hand makes an eighth company, there will be no record to stand in its way.",
    "c8_final_system_route_c": "Leaving your lookup record leaves the fact that someone saw this pattern. Who that someone was stays on record too.",
    "c8_evidence_turn_calendar": "One calendar page beats a long explanation. No one can call 12 coincidences a coincidence.",
    "c8_evidence_turn_hold": "The folded calendar tilts the negotiation your way. Meanwhile, the people pushed down in collateral priority wait without knowing why.",
    "c8_evidence_turn_share": "Once the creditors see the calendar, the trace sheet isn’t alone anymore. The rumor spreads just as fast.",
    "c8_trail_evidence_turn": "Measure the gap, and the advisory fees stop being fees and become receipts for approvals.",
    "c8_gallery_evidence_turn": "Measure the gap, and the advisory fees stop being fees and become receipts for approvals.",
    "c8_bait_evidence_turn": "Measure the gap, and the advisory fees stop being fees and become receipts for approvals.",
    "c8_route_system_evidence_turn": "Measure the gap, and the advisory fees stop being fees and become receipts for approvals.",
    "case08_memory_system": "You search the registry papers, but your hand isn’t in them. Instead, the histories of companies at the same address open one after another.",
    "case08_memory_evidence": "Write them side by side, and the days the fees came in sit one day apart from the days approvals came through on the calendar.",
    "c8_start_stand_report": "You file it, and your name is stamped in the author field. A suspicious transaction report stays on the record, and this time whoever sends it back has to write down why.",
    "c8_start_stand_copy": "You move the history to USB, and nothing shows in the lookup log. For the same reason, in court that copy never existed.",
    "c8_start_stand_ask": "You ask the branch manager, and a few of the 72 hours vanish with a plate of stuffed squid. In return, you learn one thing: he remembers each of those three returns.",
    "c8_start_stand_signature": "The second favor weighs more than the first. This time, whoever agrees knows what you are chasing.",
    "c8_start_open_report": "You file it, and your name is stamped in the author field. A suspicious transaction report stays on the record, and this time whoever sends it back has to write down why.",
    "c8_start_open_copy": "You move the history to USB, and nothing shows in the lookup log. For the same reason, in court that copy never existed.",
    "c8_start_open_ask": "You ask the branch manager, and a few of the 72 hours vanish with a plate of stuffed squid. In return, you learn one thing: he remembers each of those three returns.",
    "c8_start_open_signature": "When a second batch arrives by the same route, the auditor stops suspecting coincidence. The sender’s name is recorded twice, too.",
    "c8_start_alone_report": "You file it, and your name is stamped in the author field. A suspicious transaction report stays on the record, and this time whoever sends it back has to write down why.",
    "c8_start_alone_copy": "You move the history to USB, and nothing shows in the lookup log. For the same reason, in court that copy never existed.",
    "c8_start_alone_ask": "You ask the branch manager, and a few of the 72 hours vanish with a plate of stuffed squid. In return, you learn one thing: he remembers each of those three returns.",
    "c8_start_alone_signature": "Money that believes no one is watching moves most honestly. You are the only one who sees that moment."
  },
  "choiceVoiceLines": {
    "c8_start_report": "You can’t let an account returned three times slide again, so you file a suspicious transaction report on Haeon Partners under your own name.",
    "c8_start_copy": "A lookup log would give you away, so you quietly copy just Haeon’s account history to USB.",
    "c8_start_ask": "People before reports, you decide, and you ask Branch Manager Na Junhyuk why it was returned three times.",
    "c8_trail_money": "Leaving out whom anyone hates, you follow only the money’s path from Haeon to Gallery On.",
    "c8_trail_family": "Desire hides behind family names, you say, and you add assets in the names of Yoon Sanghyuk’s wife and brother-in-law to the list.",
    "c8_trail_split": "His anger and your evidence must not mix, so you keep Oh Jinwoo’s files and yours in separate folders.",
    "c8_gallery_price": "To see in numbers whether 120 million won each is a fair price, you get a separate appraisal of the twelve small works.",
    "c8_gallery_buyers": "The buyers must have had their reasons too, you say, and you visit each partner-company buyer at their office.",
    "c8_gallery_note": "Saying you’ll take the notebook that has nowhere to go, you accept Ban Jaewook’s notebook as testimony at Gallery On.",
    "c8_bait_set": "This time we set how fast he closes files, you say, and you leak an audit rumor to Yoon Sanghyuk’s side to move the money.",
    "c8_bait_stop": "A trap blurs the evidence, you say, stopping Oh Jinwoo, and you apply to the court for a freeze order first.",
    "c8_bait_listen": "Setting the plan aside for a moment, you hear Oh Jinwoo’s story about his father to the end.",
    "c8_final_law": "The law should hold the knife, you say, and you turn Oh Jinwoo’s trace sheet into a referral to prosecutors.",
    "c8_final_lever": "There are people to save before anyone is punished, you say, and you walk into the creditor talks with the trace sheet under the table.",
    "c8_final_press": "Choosing to trust the person Oh Jinwoo picked, you hand it first to the investigative reporter he contacted.",
    "c8_after_law": "Taking the approval the branch manager files under his own ID for the first time in 30 years, you put the trace sheet on the official record.",
    "c8_after_friend": "People before trace sheets, you say, and you go up to find Oh Jinwoo, who has stopped answering.",
    "c8_after_blade": "It isn’t time to use it yet, you say, and you hold the trace sheet alone and wait.",
    "c8_sundae_choice_1": "With the number on the back of the receipt, you say you’ll call the predecessor right away and hear the story.",
    "c8_sundae_choice_2": "Tucking the number into your wallet, you say you’ll check the return records first.",
    "c8_sundae_choice_3": "Since the branch manager never mentions the returns, you ask nothing today and just praise the squid.",
    "c8_mother_choice_1": "Quitting is news she should hear from her son, so you call Oh Jinwoo and have him tell his mother himself.",
    "c8_mother_choice_2": "Since Do Yoonha won’t lie, you say to confirm only that he resigned, per company rules.",
    "c8_mother_choice_3": "You say to tell her only that he’s doing well, and to take the side dishes for him.",
    "c8_clerks_choice_1": "You say you’ll first find a way to protect the two who approved the payments as cooperators.",
    "c8_clerks_choice_2": "Since both have offered to cooperate, you take their statements and list them as witnesses by the book.",
    "c8_clerks_choice_3": "You say you’ll leave out the staff’s names and write only the traces above them.",
    "c8_sundae_reaction_choice_1": "To keep on record that an HR interview followed the third return, you take the predecessor’s testimony and attach it to a report on the returns.",
    "c8_sundae_reaction_choice_2": "Taking no testimony, you confirm only the rejection approval chain on paper.",
    "c8_sundae_reaction_choice_3": "Not wanting to drag the orchard into this, you thank him and end the call.",
    "c8_mother_reaction_choice_1": "Revenge or not, he has to eat first, so you take the containers and go find Oh Jinwoo yourself.",
    "c8_mother_reaction_choice_2": "To see that he eats but stay out of the quitting talk, you ship the containers and keep contact by the book.",
    "c8_mother_reaction_choice_3": "There’s no place for you between a son and his mother, you say, so you leave the containers in the pantry and step back.",
    "c8_clerks_reaction_choice_1": "So that the two paid the least appear last, you change the order.",
    "c8_clerks_reaction_choice_2": "Since the probationer’s pay is 0.2% of the painting money approved, you keep the names and add a pay-to-responsibility ratio.",
    "c8_clerks_reaction_choice_3": "The higher the trace goes, the fainter it gets, and you can’t wait, so you start with the clearest names and open the probe fast.",
    "c8_branch_ledger_a": "Because you like Han Seoyun, leaving the name out is even less acceptable, you say, and you put it on the trace sheet too.",
    "c8_branch_ledger_b": "Everyone deserves one chance to speak up first, you say, and you give Han Seoyun time to report.",
    "c8_branch_ledger_c": "The giver, not the recipient, is the designer, you say, and you use only the giver’s ledger.",
    "c8_branch_ledger_follow_a": "A good painting deserves exact handling, you say, and you seal it in the branch vault.",
    "c8_branch_ledger_follow_b": "Refusing to leave Han Seoyun alone in this, you add your confirming signature to the self-report.",
    "c8_branch_ledger_follow_c": "Not wanting to tag a painting that stayed up for 3 years with an evidence record, you send it back and take only the report.",
    "c8_route_system_map": "One company at a time hides the pattern, so you connect the seven companies’ flows on one map.",
    "c8_route_system_one": "The six that vanished are already lost, you say, so you fold the map and dig into Haeon Partners alone.",
    "c8_route_system_agent": "To learn whose hand drew the pattern, you go first to the tax agent who set up all seven.",
    "c8_final_system_route_a": "So it doesn’t look broken apart like the six before, you bundle the seven companies as one pattern and take it outside.",
    "c8_final_system_route_b": "Only one can be stopped in 10 hours, you say, so you keep the Haeon Partners case and bury the rest.",
    "c8_final_system_route_c": "To show that this time someone connected them, you leave your lookup record in the pattern’s last box.",
    "c8_evidence_turn_calendar": "You mark the 12 deposit dates on one calendar page and put it first in the referral.",
    "c8_evidence_turn_hold": "This calendar is a card for the negotiating room, you say, and you fold it away for now.",
    "c8_evidence_turn_share": "You show this calendar first to the creditors pushed down in collateral priority.",
    "c8_trail_evidence_turn": "You lay the advisory-fee deposit dates on one calendar with the clues and measure the gap between the day money moved and the day approval came.",
    "c8_gallery_evidence_turn": "You lay the advisory-fee deposit dates on one calendar with the clues and measure the gap between the day money moved and the day approval came.",
    "c8_bait_evidence_turn": "You lay the advisory-fee deposit dates on one calendar with the clues and measure the gap between the day money moved and the day approval came.",
    "c8_route_system_evidence_turn": "You lay the advisory-fee deposit dates on one calendar with the clues and measure the gap between the day money moved and the day approval came.",
    "c8_start_stand_report": "You can’t let an account returned three times slide again, so you file a suspicious transaction report on Haeon Partners under your own name.",
    "c8_start_stand_copy": "A lookup log would give you away, so you quietly copy just Haeon’s account history to USB.",
    "c8_start_stand_ask": "People before reports, you decide, and you ask Branch Manager Na Junhyuk why it was returned three times.",
    "c8_start_stand_signature": "Knowing it is shameless to ask the people who helped you for more, you write back to the three anyway.",
    "c8_start_open_report": "You can’t let an account returned three times slide again, so you file a suspicious transaction report on Haeon Partners under your own name.",
    "c8_start_open_copy": "A lookup log would give you away, so you quietly copy just Haeon’s account history to USB.",
    "c8_start_open_ask": "People before reports, you decide, and you ask Branch Manager Na Junhyuk why it was returned three times.",
    "c8_start_open_signature": "Into the audit channel you already opened, you add the account history as further material.",
    "c8_start_alone_report": "You can’t let an account returned three times slide again, so you file a suspicious transaction report on Haeon Partners under your own name.",
    "c8_start_alone_copy": "A lookup log would give you away, so you quietly copy just Haeon’s account history to USB.",
    "c8_start_alone_ask": "People before reports, you decide, and you ask Branch Manager Na Junhyuk why it was returned three times.",
    "c8_start_alone_signature": "Telling no one, you wait for the last moment the money moves before liquidation."
  },
  "pack": {
    "clue": {
      "title": "The Dates of the Fees",
      "text": "Lay the advisory-fee dates over the approval schedule, and they line up exactly. This company didn’t sell advice. It sold dates."
    },
    "outcomes": {
      "c8_after_law": {
        "tag": "Knife Left to the Law",
        "title": "After 30 years, the branch manager’s ID went on the trace sheet",
        "text": "Revenge slowed, and the evidence hardened. Oh Jinwoo found the slowness hard to bear, but the trace sheet now leaves no gap to argue with."
      },
      "c8_after_friend": {
        "tag": "Found the Friend",
        "title": "You knocked on Oh Jinwoo’s door before using the trace sheet",
        "text": "The door of his tiny rented room opened, and the two of you ate rice soup. No one has used the knife yet, and for the first time Oh Jinwoo talked about a plan other than revenge."
      },
      "c8_after_blade": {
        "tag": "Knife Held Alone",
        "title": "You held the trace sheet alone and waited",
        "text": "No one knows what you have. You hold the strongest card, but no one can testify to why you played it."
      }
    },
    "continuityChallenges": {
      "c7_after_stand": {
        "title": "Don’t Bury Your Helpers in the Trace",
        "text": "You end up asking the people who gave you material for help again. Find choices that don’t turn their names into victims on the trace sheet."
      },
      "c7_after_open": {
        "title": "Find the Money Behind the Originals",
        "text": "The originals went to the auditor, but the money is still moving. Find the flow the originals missed, and a hidden clue may open."
      },
      "c7_after_alone": {
        "title": "Turn What You Saw Alone into Evidence",
        "text": "The quiet of coming down unnoticed is both a weapon and a weakness. Choices that turn the traces you saw alone into a fair record lower the pressure."
      }
    }
  }
};
