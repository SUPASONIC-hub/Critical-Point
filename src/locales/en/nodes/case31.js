/**
 * 사건 31 (src/nodes/case31.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c31_start": {
      "title": "The Examiner",
      "text": "Seven black suitcases roll into the lobby of KD Capital’s head office in a line. The Financial Supervisory Service’s periodic examination (the FSS’s review, every few years, of a financial company’s entire books and operations) has begun. The examiner at the front (the person the FSS sends to inspect a company in person), Han Jiwoo, hands over a list of requested documents the moment she gets her visitor pass. 148 items, and the first line is the Pyeongtaek officetel PF (a loan made against future sale proceeds before a building goes up). She looks at the 'Examination Response Lead' tag hanging from your neck. Risk Management Department, a post CEO Yoon Sanghyuk assigned in person. 'Anything from a response lead the CEO picked, I check twice. You’re free to be offended. It’s the rules.' Beside her, Seok Jaewoo, chief of staff in the CEO’s office, smiles and presses a USB stick into your hand. 'The cleaned-up set. To make things easy for the examiner.'",
      "memo": [
        "5 days on site -- 7 examiners, team lead Han Jiwoo",
        "Requested documents, Round 1: 148 items; first line is the Pyeongtaek officetel PF",
        "'Cleaned-up set' USB from Seok Jaewoo, chief of staff in the CEO’s office",
        "You: Risk Management’s examination response lead, assigned by Yoon Sanghyuk"
      ],
      "choices": {
        "c31_start_raw": {
          "label": "Submit the 148 items as originals, not the cleaned-up set"
        },
        "c31_start_face": {
          "label": "Go to Han Jiwoo first and be honest about my post"
        },
        "c31_start_clean": {
          "label": "Hand over the chief of staff’s cleaned-up set on time, as is"
        },
        "reframe": {
          "label": "Call up each approver account"
        }
      },
      "place": "KD Capital Head Office · Lobby",
      "clock": "Monday, June 8 · 09:00 · On-site exam day 1",
      "question": "The examiner will check your department’s materials twice, and in your hand is the chief of staff’s cleaned-up set: what do you do first?",
      "lead": "Two months after everyone scattered, your post is KD Capital’s Risk Management Department. Yoon Sanghyuk named you response lead for this examination himself."
    },
    "c31_archive": {
      "title": "Question 42",
      "text": "On a desk in the B1 records room, Han Jiwoo spreads out six bound printouts on the Pyeongtaek officetel PF (a loan made against future sale proceeds before a building goes up) and fires questions by number. 'Question 1. Whose employee ID is this?' When KD Capital credit reviewer Choi Seojin comes down with two coffees, Han Jiwoo speaks without looking up. 'From a company under examination, I don’t take anything. Not even coffee.' Choi Seojin drinks both. At Question 42, Han Jiwoo’s highlighter stops. 'The maturity was extended (the repayment date pushed back) four times. Each time, the loan-loss reserve (money set aside against loans going bad) went down. Every approving employee ID belongs to Risk Management.' She looks at you for the first time. 'I know three of the four came before you arrived. Even so, right now you have to answer in this department’s name.'",
      "memo": [
        "Pyeongtaek PF maturity extended 4 times -- reserves cut with each one",
        "Electronic approval IDs for the extensions: all Risk Management",
        "Questions 1 through 42 in 2 hours -- Han Jiwoo logs them to the minute",
        "Preparer field on the extension papers: Choi Seojin"
      ],
      "choices": {
        "c31_archive_brief": {
          "label": "Read out the chief of staff’s prepared answers word for word"
        },
        "c31_archive_trace": {
          "label": "Answer each question only with page numbers and approval times"
        },
        "c31_archive_answer": {
          "label": "Ask her to keep the preparer’s name out, and answer myself"
        },
        "reframe": {
          "label": "Call up each approver account"
        },
        "c31_archive_evidence_turn": {
          "label": "Match 4 extensions to Roundhill"
        }
      },
      "place": "KD Capital B1 · Records Room",
      "clock": "On-site exam day 1 · 23:40",
      "question": "Every extension approval ID belongs to your department, so in whose name do you answer Question 42?",
      "lead": "On the first night, the examination team took over the whole records room, and you were called down to speak for the department."
    },
    "c31_hallway": {
      "title": "The File Dropped Three Times",
      "text": "Ban Jaewook, out on Internal Audit’s regional rounds, has come up to the corridor outside the examination team’s room on the 12th floor. In the group chat he still only reads. There is one plan: drop a file in front of Han Jiwoo, by accident. Through his earphone, Yeongdong Branch Manager Na Junhyuk coaches him. 'Loosen your shoulders. Like a person, not like Internal Audit.' The first time, Han Jiwoo is on the phone. The second time, his 'Whoops' sounds like a kid reading from a schoolbook. The third time, Han Jiwoo picks up the file and says, 'That’s three. Practice on the stairs. There are fewer CCTV cameras there.' Inside the file is a memo Internal Audit wrote this spring and buried. Notes from the meeting on the Pyeongtaek maturity extension (pushing back the repayment date), and in the margin, in Yoon Sanghyuk’s handwriting: 'Extend. Losses after the sale.' Han Jiwoo asks, 'A document with no source is lost property. Who is going to make this evidence?'",
      "memo": [
        "Internal Audit memo -- stopped in the reporting line after it was written",
        "Margin note: 'Extend. Losses after the sale.'",
        "Ban Jaewook’s 3 performances, coached remotely by Na Junhyuk",
        "Without a source, it is lost property, not examination material"
      ],
      "choices": {
        "c31_hallway_vouch": {
          "label": "Say I’ll be this document’s source instead of Ban Jaewook"
        },
        "c31_hallway_channel": {
          "label": "Have Ban Jaewook submit it formally in Internal Audit’s name"
        },
        "c31_hallway_drop": {
          "label": "Leave it as lost property for Han Jiwoo to use as she sees fit"
        },
        "reframe": {
          "label": "Call up each approver account"
        },
        "c31_hallway_evidence_turn": {
          "label": "Match 4 extensions to Roundhill"
        }
      },
      "place": "KD Capital 12th Floor · Corridor Outside the Exam Team’s Meeting Room",
      "clock": "On-site exam day 3 · 14:00",
      "question": "The file dropped three times is about to become sourceless lost property, so who puts a name to this document?",
      "lead": "A text says Ban Jaewook has come up on a 'Seoul business trip,' so you step out into the corridor. He has already dropped the file once."
    },
    "c31_rooftop": {
      "title": "The Missing Eleven Pages",
      "text": "Han Jiwoo leans on the KD Capital rooftop railing with a convenience-store banana milk. She kept the receipt, too. After a long silence, she starts with numbers. 'Back then I was the junior on the KD Bank periodic examination (the FSS’s review, every few years, of a financial company’s entire books and operations). I’m the one who passed on the 2023-0412 scan file. After page 14 came page 26.' The wind spins her pass around once. 'I sent one written query, got the answer that it was a simple omission, and moved on. I asked that question only once.' She says she learned the eleven missing pages were your dissent only when she watched the parliamentary audit (where the National Assembly questions people in public) on TV. 'That’s why I didn’t trust you. If I trusted you, the fact that I asked only once would weigh more.'",
      "memo": [
        "Han Jiwoo: then the junior on the KD Bank examination team",
        "2023-0412 scan file: page 26 right after page 14 -- 1 written query",
        "Company answer: 'simple omission'",
        "The missing eleven pages = your dissent"
      ],
      "choices": {
        "c31_rooftop_lever": {
          "label": "Use that guilt as leverage to get the results sooner"
        },
        "c31_rooftop_reopen": {
          "label": "Propose attaching that old query to this exam’s file"
        },
        "c31_rooftop_share": {
          "label": "Tell her about that day as the one who wrote the eleven pages"
        },
        "reframe": {
          "label": "Call up each approver account"
        },
        "c31_rooftop_evidence_turn": {
          "label": "Match 4 extensions to Roundhill"
        }
      },
      "place": "KD Capital Headquarters · Rooftop",
      "clock": "On-site exam day 4 · 22:10",
      "question": "In front of you is the person who asked only once about the missing eleven pages; how do you answer her confession?",
      "lead": "Han Jiwoo asked to see you on the rooftop for a minute. Four days into the examination, it is the first thing she has said without a number."
    },
    "c31_final": {
      "title": "The Confirmer’s Signature Line",
      "text": "Han Jiwoo sets down three pages of draft findings (items written up as wrongdoing in an examination). The Pyeongtaek PF (a loan made against future sale proceeds before a building goes up) put off a loss of 38 billion won. The means: four maturity extensions (pushing back the repayment date). The completion rate written in the books as 62% came out at 45% when the examination team measured it. The loan-loss reserve (money set aside against loans going bad) was short too. At the bottom is the examination confirmation (a document in which a company employee confirms the facts found are correct). Seok Jaewoo, the confirmer the company named, has refused to sign. 'If you sign, this goes as far as a referral to the prosecutors. With no signature, it sits for three months as “company explanation pending.”' In the confirmation’s preparer field, Choi Seojin’s name is already written. Han Jiwoo holds out a pen. 'This time, I’d like the signature line not to be empty.'",
      "memo": [
        "3 findings -- 38 billion won in deferred losses",
        "Confirmer field on the confirmation: Seok Jaewoo refused, blank",
        "If signed: referral to prosecutors; if not: 3-month explanation period",
        "Preparer field: Choi Seojin -- the one who only filled in the papers",
        "Roundhill sale contract annex: an advisory post for Yoon Sanghyuk"
      ],
      "choices": {
        "c31_final_wait": {
          "label": "Hold off signing; gather more from inside in the meantime"
        },
        "c31_final_shield": {
          "label": "Sign if Choi Seojin’s name comes off the preparer field"
        },
        "c31_final_sign": {
          "label": "Sign the confirmer’s line myself and confirm the facts as they are"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Capital 12th Floor · Exam Team Meeting Room",
      "clock": "On-site exam, last day · 16:00",
      "question": "The confirmer’s signature line is empty and Choi Seojin’s name is in the preparer field; how do you sign?",
      "lead": "Two hours before the examination team packs its suitcases, Han Jiwoo calls you in alone."
    },
    "c31_aftershock": {
      "title": "Seven Suitcases",
      "text": "At 6 p.m. on the day the examination team pulls out, seven suitcases line up in the lobby again. They are heavier than when they came in. KD Capital credit reviewer Choi Seojin follows them to the elevators and bows, and Han Jiwoo, who never took the coffee, does take the bow. She opens the last page of her examination notebook for a moment. Taped there is a receipt from the Pyeongtaek site office. A cup-noodle lid with '1,500 won. Kang Taemin.' written in marker. 'I’ll take the numbers. The 62 in the books, the 45 we measured, and the 58 you wrote in April. You look after the people.' The revolving door turns once and she is gone. At 11 that night, a text comes from Han Jiwoo. 'Separately from the confirmation, I referred the one item that looks criminal to the prosecutors, per the rules. You’ll need a lot of boxes next week.'",
      "memo": [
        "5-day on-site exam over -- 7 suitcases",
        "Last page of Han Jiwoo’s exam notebook: the cup-noodle-lid receipt",
        "1 suspected offense referred to prosecutors -- separate from the confirmation",
        "'You’ll need a lot of boxes next week'"
      ],
      "choices": {
        "c31_after_rush": {
          "label": "Go to the records room for the Pyeongtaek originals first"
        },
        "c31_after_warm": {
          "label": "Spend tonight at the bookshop, marking the end with colleagues"
        },
        "c31_after_record": {
          "label": "Log every question and answer of the five days by date"
        }
      },
      "place": "KD Capital Head Office · Lobby",
      "clock": "Friday, June 12 · On-site exam over · 18:00",
      "question": "The examination team is gone, and a text says you’ll need a lot of boxes next week; how do you spend tonight?"
    },
    "c31_boxes": {
      "title": "Scheduled for Disposal",
      "text": "3:10 a.m. on the third day, at the very back of the B1 records room. Choi Seojin, who went to fetch copy paper, comes back pale. Under a shelf sit seven boxes sealed with tape, labeled on the side 'Retention period expired · Dispose June 12.' One opened box holds the original photos of the Pyeongtaek construction site and a draft extension review covered in red pen. In the draft, the completion rate (how far along the construction is) field has 72 struck out and changed to 62. The disposal was approved the day before the examination notice arrived. Choi Seojin holds up one photo, her voice shaking. 'I took this. I wrote in my report that out of 22 floors, the slabs were poured only up to the 9th, and that measured, it’s 45%.' The site figure in the opinion you filed under your own name in April was 58%.",
      "memo": [
        "7 boxes slated for disposal -- disposal date June 12, the exam’s last day",
        "Disposal approved: the day before the exam notice",
        "Original site photos -- taken by Choi Seojin",
        "Draft completion rate 72 → 62 -- Choi Seojin’s report says 45%, your April opinion 58%"
      ],
      "choices": {
        "c31_boxes_choice_3": {
          "label": "Just photograph them and leave the boxes where they are"
        },
        "c31_boxes_choice_2": {
          "label": "Request a halt to the disposal in an official department memo"
        },
        "c31_boxes_choice_1": {
          "label": "Carry the boxes to Han Jiwoo right now"
        }
      },
      "place": "KD Capital B1 · Retained-Documents Storeroom Behind the Records Room",
      "clock": "On-site exam day 3 · 03:10",
      "question": "Seven boxes, cleared for disposal the day before the exam notice, get shredded the day after tomorrow; what do you do with them?"
    },
    "c31_buyer": {
      "title": "Move-In Date",
      "text": "Half past 6 that same evening, in front of the 12th-floor elevators. Yeon Jian, a cardigan over her nurse’s scrubs, stands hugging a bundle of sale contracts. She bought one of the 212 units in the Pyeongtaek officetel and took out an interim-payment loan (a separate loan buyers take to pay the middle installment of the price). She says she stopped by before her night shift. 'I heard the examiners are here. Move-in was supposed to be this March. I’ve already been paying interest on the interim-payment loan for fourteen months.' She holds out her phone. A photo of the site with nothing but cranes. 'That building, how many floors is it now?' The only one there who can answer is you.",
      "memo": [
        "Pyeongtaek officetel buyers: 212 units",
        "Yeon Jian: nurse, 14th month of interim-loan interest",
        "Move-in date March -- slabs stopped at floor 9 of 22"
      ],
      "choices": {
        "c31_buyer_choice_3": {
          "label": "Say an exam is under way and politely see her to the lobby"
        },
        "c31_buyer_choice_1": {
          "label": "Let the exam team hear Yeon Jian’s story directly"
        },
        "c31_buyer_choice_2": {
          "label": "Help the buyers file a complaint through the official process"
        }
      },
      "place": "KD Capital 12th Floor · Corridor by the Elevators",
      "clock": "On-site exam day 3 · 18:30",
      "question": "A buyer whose move-in date has passed asks how many floors that building has now; what do you do?"
    },
    "c31_chat": {
      "title": "The Group Chat at 3 a.m.",
      "text": "At 3 a.m. on the fifth day of the examination, you post four extension dates in the 'Work Again Tomorrow' group chat. Within 10 minutes the room lights up like fire. Lee Minseo finds and posts the review-record timestamps for the same dates at KD Data Lab, and Do Yoonha counts the people at the Gangseo Branch who took out Pyeongtaek interim-payment loans. Oh Jinwoo sends the sale schedule as seen from Bridge Bank, and Ban Jaewook posts a photo of a page of his notebook. Han Seoyun, on standby assignment (a personnel measure that leaves you with no duties while you wait for your next post), sends one photo at 6 a.m. Seven lunchboxes, each lid marked in marker: 'Analyst’s personal lunch.' A name written knowing the examination team can’t accept anything.",
      "memo": [
        "Group chat at 3 a.m. -- 5 pieces of material in 10 minutes",
        "Lee Minseo, Do Yoonha, Oh Jinwoo, Ban Jaewook: material from where each one sits",
        "Han Seoyun’s 7 lunchboxes -- 'Analyst’s personal lunch'"
      ],
      "choices": {
        "c31_chat_choice_1": {
          "label": "Keep my colleagues’ names out; submit it all under mine"
        },
        "c31_chat_choice_2": {
          "label": "Note each item’s source and time and submit it formally"
        },
        "c31_chat_choice_3": {
          "label": "Pick the single strongest item and use it this morning"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Between the Shelves",
      "clock": "On-site exam day 5 · 03:00",
      "question": "Five people’s material has poured into the group chat overnight; whose name do you submit it under?"
    },
    "c31_boxes_reaction": {
      "title": "By the Rules",
      "text": "7:20 a.m., the 12th-floor corridor. Seok Jaewoo, on his way in, falls into step beside you. The sleeves of his white shirt are rolled twice. He brushes the dust off your shoulder. 'I heard about the boxes in the records room. Disposal is by the rules. The retention period is over.' His voice stays soft to the end. 'You’ve been here two months, haven’t you? CEO Yoon remembers your name. In a good way.' He presses the elevator button and steps in first. Just before the doors close, he adds one more thing. 'Reviewer Choi is such a diligent one. It would be a shame if someone like that got hurt.'",
      "memo": [
        "A warning delivered by brushing dust off your shoulder",
        "A diligent person who mustn’t get hurt"
      ],
      "choices": {
        "c31_boxes_reaction_choice_1": {
          "label": "Answer that the rules can be discussed in front of Han Jiwoo"
        },
        "c31_boxes_reaction_choice_3": {
          "label": "Pretend not to hear; just nod and walk past"
        },
        "c31_boxes_reaction_choice_2": {
          "label": "Formally request a copy of the disposal decision"
        }
      },
      "place": "KD Capital 12th Floor · Corridor",
      "clock": "On-site exam day 3 · 07:20",
      "question": "The chief of staff cited the rules and brought up Choi Seojin’s name; how do you answer this soft warning?"
    },
    "c31_buyer_reaction": {
      "title": "The Most Accurate Words",
      "text": "After Yeon Jian leaves, Han Jiwoo stands at the corridor window for a long time. Her face says she heard everything by the elevators. 'All I can give someone like her is a complaint number. That is the most accurate thing I can say.' She caps her highlighter. 'Sometimes the accurate thing is the most useless one. An examination doesn’t pay anyone. It doesn’t cover anyone’s interest either.' Then she opens her notebook and starts a new question number. 'Question 97. Is there a list of the buyers of the 212 units? I want to work out what these people would have known, and when, if there had been no extensions.'",
      "memo": [
        "The most accurate, most useless words",
        "Question 97: the list of 212 units"
      ],
      "choices": {
        "c31_buyer_reaction_choice_3": {
          "label": "Withhold the list as outside the exam’s scope"
        },
        "c31_buyer_reaction_choice_1": {
          "label": "Get the buyers’ consent before handing over the list"
        },
        "c31_buyer_reaction_choice_2": {
          "label": "Give Han Jiwoo the list of 212 units as exam material"
        }
      },
      "place": "KD Capital 12th Floor · Corridor Window",
      "clock": "On-site exam day 3 · 19:00",
      "question": "The examiner wants the list of buyers of the 212 units; how do you hand over those names?"
    },
    "c31_chat_reaction": {
      "title": "The Same Elevator",
      "text": "7:40 a.m. The person already in the lobby elevator is Yoon Sanghyuk. It is the first time you have run into him since the examination began. He presses your floor button for you. 'Is the examination going well? Examiner Han likes numbers. You liked numbers too.' The floor display climbs: 3, 4, 5. 'There’s been no talk of the signature line yet. No rush, is there?' The doors open on 12. He doesn’t get off; he waits for you to. On the document envelope in his hand is written 'Answer to Question 42.' The answer you gave in the records room on the first night.",
      "memo": [
        "The floor button the CEO pressed for you",
        "'Answer to Question 42' on the envelope"
      ],
      "choices": {
        "c31_chat_reaction_choice_1": {
          "label": "Ask back if he remembers that loan’s eleven missing pages"
        },
        "c31_chat_reaction_choice_2": {
          "label": "Propose an official meeting with the CEO, on the record"
        },
        "c31_chat_reaction_choice_3": {
          "label": "Step out of the elevator first without a word"
        }
      },
      "place": "KD Capital Headquarters · Elevator",
      "clock": "On-site exam day 5 · 07:40",
      "question": "The CEO presses your floor button for you and says the signature line hasn’t come up yet; what do you do before the doors open?"
    },
    "c31_branch_site": {
      "title": "The One Counting Floors",
      "text": "Han Jiwoo closes the file. 'I’ll look at the building.' At the Pyeongtaek construction site two tower cranes stand idle, and Kang Taemin waits at the entrance holding hard hats. Han Jiwoo counts the floors with her finger and stops at nine. 'The columns go up to the 15th floor, but the slabs end at the 9th.' The 9th floor is where a worker fell last summer. 'A completion rate (how far along the construction is) that was 72% through April has been changed to 62% in the books now. Measure a 22-story building and it comes to 45%.' The opinion you filed in April says 58% on site. By that gap, too little was set aside in loan-loss reserves (money set aside against loans going bad). In front of the site office stand 11 subcontractor workers (from the small firms a big contractor hands its work down to), holding pay slips three months in arrears.",
      "memo": [
        "Completion rate: April papers 72% → books now 62% -- exam team’s measurement 45%, slabs 9/22 floors",
        "The 58% on site in the April opinion is also 13 percentage points above the measurement -- reserves short by that much",
        "11 subcontractor workers, wages unpaid for three months",
        "Kang Taemin: supporting the site since April"
      ],
      "choices": {
        "c31_branch_site_b": {
          "label": "Count the floors and build a table against the books’ rate"
        },
        "c31_branch_site_c": {
          "label": "Just take photos and hurry back to the exam room in Seoul"
        },
        "c31_branch_site_a": {
          "label": "Show Han Jiwoo the workers’ unpaid pay slips first"
        }
      },
      "place": "Pyeongtaek Officetel Construction Site · Under the Tower Cranes",
      "clock": "On-site exam day 2 · 10:30",
      "question": "The books’ 62% and the 58% you wrote in April both sit above the 9 floors in front of you; what do you show first at this site?"
    },
    "c31_branch_site_follow": {
      "title": "A Receipt Written on a Lid",
      "text": "When the electric kettle in the site office boils, Kang Taemin pours water into three cup noodles. Han Jiwoo takes out her wallet and puts a thousand-won bill and a five-hundred-won coin on the table. 'A receipt, please.' Kang Taemin stares for a while, then tears off a cup-noodle lid and writes on it in marker. '1,500 won. Kang Taemin.' Han Jiwoo tucks the lid into her examination notebook, and for the first time in this examination the corners of her mouth go up. Just then the workers’ foreman stands in the doorway and asks, 'If you examine them, do we get our money?' Han Jiwoo puts down her chopsticks. 'An examination doesn’t pay anyone.' The office goes quiet. Only the noodle broth goes cold.",
      "memo": [
        "Cup noodles, 1,500 won -- a receipt on the lid",
        "Han Jiwoo’s first smile",
        "The foreman’s question: 'Do we get our money?'",
        "Examination results and wage payment are separate procedures"
      ],
      "choices": {
        "c31_branch_site_follow_a": {
          "label": "Demand a back-pay plan from the company, apart from the exam"
        },
        "c31_branch_site_follow_c": {
          "label": "Ask the foreman to wait; the examination comes first"
        },
        "c31_branch_site_follow_b": {
          "label": "Ask for the unpaid wages to go into the exam findings"
        }
      },
      "place": "Pyeongtaek Construction Site · Site Office",
      "clock": "On-site exam day 2 · 13:00",
      "question": "The foreman went quiet at the words that an examination doesn’t pay anyone; how do you leave this office?"
    },
    "c31_route_system": {
      "title": "The Account That Arrived First",
      "text": "You set the confirmation aside and call up the accounts that approved the extensions, one by one. The Risk Management terminal responds. The record screen of NOAH, the group’s review engine (an AI program that judges loan applications automatically), opens. The Pyeongtaek PF (a loan made against future sale proceeds before a building goes up) was extended four times. For all four maturity extensions (pushing back the repayment date), NOAH recommended 'Decline.' All four times, an exception approval (approval outside the criteria, with a responsible person putting their name to it) overturned it. Of the four approving accounts, one is your employee ID. The fourth extension. The date is March 30, three days before you came to this department and 25 days before the committee met. The day your account was created in advance. 'The account arrived before the person. I learned the account as the person.'",
      "memo": [
        "NOAH recommended 'Decline' 4 times -- 4 exception approvals",
        "1 approving account: your employee ID",
        "Approval date: three days before you joined the department"
      ],
      "choices": {
        "c31_route_system_trace": {
          "label": "Trace back through access logs who created the account early"
        },
        "c31_route_system_bury": {
          "label": "Close the record screen before my name gets tangled in it"
        },
        "c31_route_system_report": {
          "label": "Report the record with my employee ID to Han Jiwoo first"
        },
        "c31_route_system_evidence_turn": {
          "label": "Match 4 extensions to Roundhill"
        }
      },
      "place": "KD Capital 12th Floor, Risk Management · Review Terminal",
      "clock": "On-site exam day 2 · Before dawn",
      "question": "Three days before you arrived, an exception approval went through under your employee ID; what do you do with this record?"
    },
    "c31_final_system_route": {
      "title": "The Employee ID That Came Before the Person",
      "text": "Before dawn on the last day of the examination, the review terminal shows the records of four approvals in which people overturned NOAH’s declines. All four times NOAH recommended declining, and all four times a person’s account overturned it. One of them is your employee ID; on the approval date you were not yet on this floor, and the committee had not yet met. At four in the afternoon, Han Jiwoo will hold out the confirmation. NOAH’s words appear under the records. 'I learned accounts as people. Going by my records alone, the person who approved it that day is you. I have no authority to correct it.'",
      "memo": [
        "NOAH recommended 'Decline' 4 times -- all overturned by people’s accounts",
        "1 approving account: your employee ID, three days before you started",
        "Examination confirmation: today at 16:00"
      ],
      "choices": {
        "c31_final_system_route_a": {
          "label": "Propose a rule: exception approvals carry the approver’s real name"
        },
        "c31_final_system_route_c": {
          "label": "Gather the owners of the misused accounts to write it together"
        },
        "c31_final_system_route_b": {
          "label": "Bury the account misuse; leave only the losses as findings"
        }
      },
      "place": "KD Capital 12th Floor, Risk Management · Review Terminal",
      "clock": "On-site exam, last day · Before dawn",
      "question": "Going by the records alone, the person who approved it that day is you; before the confirmation arrives, what do you write beside this record?"
    },
    "c31_evidence_turn": {
      "title": "The Dates of the Extensions",
      "text": "You set one clue against each extension of the Pyeongtaek PF (a loan made against future sale proceeds before a building goes up). The four maturity extensions (pushing back the repayment date) line up beside the schedule of sale talks with Roundhill Capital. With each extension the loss slid one quarter later in the books, the asset value in the sale proposal rose three times, and the 212 households kept paying interest. What revealed the order first was Seok Jaewoo’s cleaned-up set. Renumbering the pages, it dropped two pages at each extension, and the dropped pages, gathered together, make the negotiation schedule. The last two pages are a draft annex (an extra-terms document attached to the back of a contract) containing an advisory-post clause (a seat that only gives advice, with no operational responsibility) for Yoon Sanghyuk, dated the day before the fourth extension. Ban Jaewook closes his notebook. 'Picking the pages to hide, they made a list. The dropped pages are the comparison table.'",
      "memo": [
        "4 extensions = dates match the 4 stages of the sale talks",
        "Asset value in the sale proposal raised 3 times",
        "Pages dropped from the cleaned-up set = two at each extension",
        "4th extension: the day after the advisory-post annex draft"
      ],
      "choices": {
        "c31_evidence_turn_link": {
          "label": "Attach the extension-vs-sale-schedule table to the exam file"
        },
        "c31_evidence_turn_hold": {
          "label": "Hold the table until the day before the sale money moves"
        },
        "c31_evidence_turn_buyers": {
          "label": "Tell the buyers of the 212 units why it was extended first"
        }
      },
      "place": "KD Capital B1 · Records Room",
      "clock": "On-site exam, last day · 07:00",
      "question": "The pages missing from the cleaned-up set join the dates the losses were put off to the dates the sale price went up; how do you use this table?"
    },
    "c31_start_warm": {
      "title": "Monday for the Ones Who Stayed Till Dawn",
      "text": "At two in the morning, on the bookshop’s 1st floor, you closed the last page of the contract with five others and parted. That night the group chat got its name: 'Work Again Tomorrow.' Monday, June 8, 9 a.m.: seven black suitcases come into the KD Capital lobby. The Financial Supervisory Service’s periodic examination (the FSS’s review, every few years, of a financial company’s entire books and operations). When you post 'Examiners are in' to the chat, four replies come within 5 seconds, and the unread count drops by one more. Ban Jaewook. The examiner at the front (the person the FSS sends to inspect a company in person), Han Jiwoo, speaks as soon as she sees the 'Examination Response Lead' tag around your neck. 'A lead the CEO picked. Risk Management’s materials, I check twice.' 148 requested items. Seok Jaewoo, chief of staff in the CEO’s office, presses a USB stick into your hand, calling it the 'cleaned-up set.'",
      "memo": [
        "Group chat 'Work Again Tomorrow' -- 4 replies, 1 read",
        "FSS on-site exam, 5 days, team lead Han Jiwoo",
        "Examination response lead: you, assigned by Yoon Sanghyuk"
      ],
      "choices": {
        "c31_start_warm_raw": {
          "label": "Submit the 148 items as originals, not the cleaned-up set"
        },
        "c31_start_warm_clean": {
          "label": "Hand over the chief of staff’s cleaned-up set on time, as is"
        },
        "c31_start_warm_signature": {
          "label": "Split the requested items among the five in the group chat"
        },
        "c31_start_warm_face": {
          "label": "Go to Han Jiwoo first and be honest about my post"
        },
        "c31_start_warm_reframe": {
          "label": "Call up each approver account"
        }
      },
      "place": "KD Capital Head Office · Lobby",
      "clock": "Monday, June 8 · 09:00 · On-site exam day 1",
      "question": "The five in the 'Work Again Tomorrow' chat are waiting; with whom, and how, do you split the first day of the exam?",
      "lead": "Seven hours after parting at two in the morning, the group chat is already awake."
    },
    "c31_start_record": {
      "title": "Monday for the One Who Left a Blank",
      "text": "After midnight last night, you bundled the material six people had gathered into a tip-off document and sent it to the Financial Supervisory Service. The informant list had six fields, and Ban Jaewook’s was left blank rather than deleted. Monday, June 8, the FSS periodic examination (the FSS’s review, every few years, of a financial company’s entire books and operations) begins. The examiner (the person the FSS sends to inspect a company in person), Han Jiwoo, arrives with that tip-off printed out, and her highlighter stops on one field. 'A tip-off sent the night before the examination by an employee of the company being examined. What is this blank? A list with a blank, I check twice. A blank usually has a reason.' In the list’s margin, questions are already numbered up to 11. 148 requested items. Seok Jaewoo, chief of staff in the CEO’s office, has pressed a USB stick into your hand, calling it the 'cleaned-up set.'",
      "memo": [
        "Last night’s tip-off -- six informant fields, one blank",
        "Han Jiwoo: 'A blank usually has a reason'",
        "11 questions in the list’s margin"
      ],
      "choices": {
        "c31_start_record_clean": {
          "label": "Hand over the chief of staff’s cleaned-up set on time, as is"
        },
        "c31_start_record_signature": {
          "label": "Check the tip-off list against the originals, blank’s reason included"
        },
        "c31_start_record_face": {
          "label": "Go to Han Jiwoo first and be honest about my post"
        },
        "c31_start_record_raw": {
          "label": "Submit the 148 items as originals, not the cleaned-up set"
        },
        "c31_start_record_reframe": {
          "label": "Call up each approver account"
        }
      },
      "place": "KD Capital Head Office · Lobby",
      "clock": "Monday, June 8 · 09:00 · On-site exam day 1",
      "question": "The examiner’s highlighter stopped on the one blank in the tip-off; how do you explain that blank?",
      "lead": "Nine hours after you sent the tip-off, it has come back to the lobby as a printout."
    },
    "c31_start_rush": {
      "title": "The Access Log of the One Who Went Back First",
      "text": "Last night you got an email naming you examination response lead, and as soon as the bookshop gathering ended you went back to the dark 12th floor. Until four in the morning you were alone, opening the department’s shared folders. Monday, June 8, the FSS periodic examination (the FSS’s review, every few years, of a financial company’s entire books and operations) comes in. The first thing the examiner (the person the FSS sends to inspect a company in person), Han Jiwoo, asks for is the department’s access log from last night. At the top of the printout are your name and '04:02.' Han Jiwoo underlines that line. Then she hands over the requested documents: 148 items. Seok Jaewoo, chief of staff in the CEO’s office, presses a USB stick into your hand, calling it the 'cleaned-up set.'",
      "memo": [
        "Last night’s access log -- you at the top",
        "Last access 04:02",
        "Han Jiwoo’s first underline"
      ],
      "choices": {
        "c31_start_rush_clean": {
          "label": "Hand over the chief of staff’s cleaned-up set on time, as is"
        },
        "c31_start_rush_signature": {
          "label": "Explain the access log first: what I opened overnight"
        },
        "c31_start_rush_raw": {
          "label": "Submit the 148 items as originals, not the cleaned-up set"
        },
        "c31_start_rush_face": {
          "label": "Go to Han Jiwoo first and be honest about my post"
        },
        "c31_start_rush_reframe": {
          "label": "Call up each approver account"
        }
      },
      "place": "KD Capital Head Office · Lobby",
      "clock": "Monday, June 8 · 09:00 · On-site exam day 1",
      "question": "Your name is at the top of last night’s access log; how do you answer this underline?",
      "lead": "Nine hours since you were named response lead, and four of them spent on the 12th floor."
    }
  },
  "echoReplies": {
    "c31_start_face": "When you speak honestly, Han Jiwoo writes it down. Not because she believes you, but because she means to ask the same question again in five days.",
    "c31_start_raw": "You submit the originals, and Seok Jaewoo’s USB stays in your drawer. The chief of staff walks past your desk twice that afternoon.",
    "c31_start_clean": "The cleaned-up set is neat. Han Jiwoo turns the first page and sees at once that the pages have been renumbered.",
    "c31_archive_answer": "Han Jiwoo doesn’t answer the request to leave the name out. Instead, from Question 43 on, she asks only you.",
    "c31_archive_trace": "Page numbers and dates don’t waver. At 4 a.m., Han Jiwoo says 'Confirmed' for the first time.",
    "c31_archive_brief": "The prepared answers flow smoothly. Han Jiwoo knows the sentence in the third line is identical to another company’s answer from last year.",
    "c31_hallway_vouch": "Your name goes into the source field. Ban Jaewook is safe, and Seok Jaewoo’s next one-on-one is with you.",
    "c31_hallway_channel": "A formal submission needs the Internal Audit head’s approval. Ban Jaewook waits three days, the reason given being that he is 'out on regional rounds.'",
    "c31_hallway_drop": "The lost property goes into Han Jiwoo’s drawer. Only Han Jiwoo knows whether it can be used. Ban Jaewook practices on the stairs once more.",
    "c31_rooftop_share": "Having heard you out, Han Jiwoo finishes the banana milk. 'So we each did it only once.'",
    "c31_rooftop_reopen": "With the old query attached again, Han Jiwoo’s name goes back on that paper too. She hesitates a moment, then nods.",
    "c31_rooftop_lever": "Han Jiwoo looks at you for a long time. 'Guilt can’t move any date forward.' Even so, the next day’s schedule has moved up by a day.",
    "c31_final_shield": "Choi Seojin’s name is erased and yours remains. At the end of the corridor, Choi Seojin cries for a long time, then laughs.",
    "c31_final_sign": "The signature line is filled. That evening, Seok Jaewoo silently straightens the nameplate on your desk.",
    "c31_final_wait": "The signature goes three months out. In that time, what you can gather grows, and so does what can be shredded.",
    "c31_after_warm": "The lights on the bookshop’s 1st floor stay on late. Choi Seojin opens that door and comes in for the first time.",
    "c31_after_record": "A record in date order reads in the same order no matter who comes. That goes for the people coming next week too.",
    "c31_after_rush": "The records room door still opens. The moment you lift the box of originals whose disposal was put off, your name is stamped at the top of the entry log again.",
    "c31_boxes_choice_1": "When you bring the boxes, Han Jiwoo first writes down the date on the sealing tape. Choi Seojin’s name is written beside it, and the boxes go back to the records room with one more seal, the examination team’s.",
    "c31_boxes_choice_2": "An official request leaves a record. It takes a day for the request to reach the chief of staff’s desk, and the disposal date is the day after tomorrow.",
    "c31_boxes_choice_3": "The photos remain. The seven boxes stay under the shelf, waiting for the disposal date.",
    "c31_buyer_choice_1": "The door of the examination room opens and Yeon Jian sits down across from Han Jiwoo. Han Jiwoo writes down the interest statements, and writes down, too, that there is nothing she can do.",
    "c31_buyer_choice_2": "A filing number is created. Yeon Jian saves it in her phone and is 20 minutes late for her night shift.",
    "c31_buyer_choice_3": "Yeon Jian says thank you and turns away. Until the elevator doors close, she never once puts down the bundle of contracts.",
    "c31_chat_choice_1": "The material becomes yours alone. Your colleagues are safe, and Han Jiwoo knows no one person could have gathered all this.",
    "c31_chat_choice_2": "Material with sources attached doesn’t waver. In exchange, six names sit side by side in the examination record.",
    "c31_chat_choice_3": "One sheet is fast. What the other four found overnight greets the morning still sitting in the group chat.",
    "c31_boxes_reaction_choice_1": "For the first time, Seok Jaewoo stops smiling. He knows too that rules weaken only in front of someone who knows the rules.",
    "c31_boxes_reaction_choice_2": "The request for a copy is accepted. In the approval history of the copy that arrives the next day, one electronic signature that should be there is missing.",
    "c31_boxes_reaction_choice_3": "You nod, and the corridor is quiet. Seok Jaewoo no longer needs to say Choi Seojin’s name again.",
    "c31_buyer_reaction_choice_1": "212 texts asking for consent go out. Over three days, 131 people reply, Yeon Jian first.",
    "c31_buyer_reaction_choice_2": "The list becomes numbers in Han Jiwoo’s spreadsheet. The 212 people don’t know where their names were used.",
    "c31_buyer_reaction_choice_3": "The list stays in the drawer. Han Jiwoo writes 'Not submitted' beside Question 97 and moves on to the next number.",
    "c31_chat_reaction_choice_1": "Yoon Sanghyuk glances at the floor display. 'I remember. Better than you do.' The doors close.",
    "c31_chat_reaction_choice_2": "The meeting goes on the calendar. The date the CEO’s office gives is the week after the examination ends.",
    "c31_chat_reaction_choice_3": "You step out, the doors close, and the elevator rises to the top floor. How he knows about Question 42 stays unasked.",
    "c31_branch_site_a": "Taking the pay slips, Han Jiwoo reads out the 11 workers’ names one by one. For the first time, something other than a number goes into her examination notebook.",
    "c31_branch_site_b": "The table is solid. The 17-percentage-point gap from the books stays as a red cell in the middle, and the line below holds the 13-percentage-point gap from your April opinion. The workers are in none of the cells.",
    "c31_branch_site_c": "The photos are sharp. The faces of the people standing under the cranes are cut off at the edges.",
    "c31_branch_site_follow_a": "The demand goes up to the company. Three days later Seok Jaewoo sends the answer that 'no payments of any kind can be made during the examination period.'",
    "c31_branch_site_follow_b": "Made a finding, the unpaid wages stay on the record. The day the record turns into money comes long after the examination ends.",
    "c31_branch_site_follow_c": "The foreman nods. 'Waiting, we’re good at.' He finishes the cold noodles and leaves.",
    "c31_route_system_report": "When you report it, Han Jiwoo puts your employee ID at the top of her question list. Not to believe you, but so it doesn’t get erased.",
    "c31_route_system_trace": "Tracing back turns up an account creation request. The requester field is blank; only the approver field has an electronic signature.",
    "c31_route_system_bury": "Closing the screen doesn’t remove the record. The next person to open it may not be you.",
    "c31_final_system_route_a": "With the real-name rule in place, exception approvals drop. By as much as they drop, NOAH’s declines reach people as they are.",
    "c31_final_system_route_b": "The losses become findings and the accounts go quiet. The next exception approval can come in through a nameless account, too.",
    "c31_final_system_route_c": "Three of the four account owners gather. The remaining one has already left the company.",
    "c31_evidence_turn_link": "With the table attached, Han Jiwoo’s findings get dates. Prosecutors, it seems, like suspicions that come with dates.",
    "c31_evidence_turn_hold": "While you hold it, the table is a weapon. Meanwhile, the 212 households pay another month of interest.",
    "c31_evidence_turn_buyers": "For the first time, the buyers hear the reason. The people who hear it begin to gather, and the gathering moves faster than the examination schedule.",
    "c31_archive_evidence_turn": "Match the dates and you see why the losses were put off. The hand that tried to hide those dates drew the path first.",
    "c31_hallway_evidence_turn": "Match the dates and you see why the losses were put off. The hand that tried to hide those dates drew the path first.",
    "c31_rooftop_evidence_turn": "Match the dates and you see why the losses were put off. The hand that tried to hide those dates drew the path first.",
    "c31_route_system_evidence_turn": "Match the dates and you see why the losses were put off. The hand that tried to hide those dates drew the path first.",
    "case31_memory_system": "The request list holds no trace. What remains is the approval records. NOAH brings up the four times its recommendation was overturned, together with the accounts that approved them.",
    "case31_memory_evidence": "Set the dates of the review opinions against the maturity-extension schedule, and the four extensions keep step with the sale talks.",
    "c31_start_warm_face": "When you speak honestly, Han Jiwoo writes it down. Not because she believes you, but because she means to ask the same question again in five days.",
    "c31_start_warm_raw": "You submit the originals, and Seok Jaewoo’s USB stays in your drawer. The chief of staff walks past your desk twice that afternoon.",
    "c31_start_warm_clean": "The cleaned-up set is neat. Han Jiwoo turns the first page and sees at once that the pages have been renumbered.",
    "c31_start_warm_signature": "The five start looking for material from where each one sits. Even Ban Jaewook, who only ever read, takes one item. All five seats being inside KD Financial Group means all five could get caught.",
    "c31_start_record_face": "When you speak honestly, Han Jiwoo writes it down. Not because she believes you, but because she means to ask the same question again in five days.",
    "c31_start_record_raw": "You submit the originals, and Seok Jaewoo’s USB stays in your drawer. The chief of staff walks past your desk twice that afternoon.",
    "c31_start_record_clean": "The cleaned-up set is neat. Han Jiwoo turns the first page and sees at once that the pages have been renumbered.",
    "c31_start_record_signature": "The check takes two hours. In the field for the blank’s reason, you don’t write Ban Jaewook’s name. Han Jiwoo doesn’t say she believes you; she just adds 11 check marks.",
    "c31_start_rush_face": "When you speak honestly, Han Jiwoo writes it down. Not because she believes you, but because she means to ask the same question again in five days.",
    "c31_start_rush_raw": "You submit the originals, and Seok Jaewoo’s USB stays in your drawer. The chief of staff walks past your desk twice that afternoon.",
    "c31_start_rush_clean": "The cleaned-up set is neat. Han Jiwoo turns the first page and sees at once that the pages have been renumbered.",
    "c31_start_rush_signature": "As you explain, Han Jiwoo writes down the names of the files you opened, one by one. That list becomes the examination team’s second document request, as is."
  },
  "choiceVoiceLines": {
    "c31_start_face": "Saying that if your post is under suspicion it’s better to come clean first, you go to Han Jiwoo first and tell her honestly about your post and your situation.",
    "c31_start_raw": "Saying an examination should get unpolished papers, you submit the 148 requested items as originals instead of the cleaned-up set.",
    "c31_start_clean": "Saying the deadline comes first, you hand over the chief of staff’s cleaned-up set as is.",
    "c31_archive_answer": "Saying it was the department that pressed the approve button, you ask her to keep the preparer’s name out and answer the questions yourself.",
    "c31_archive_trace": "So that nothing said in the department’s name is mixed with guesswork, you answer each question only with page numbers and approval times.",
    "c31_archive_brief": "Saying you can’t answer in your own words for what happened before you came, you read out the chief of staff’s prepared answers word for word.",
    "c31_hallway_vouch": "So that a man already sent around the regions isn’t pushed out further, you say you’ll be this document’s source instead of Ban Jaewook.",
    "c31_hallway_channel": "Saying it takes a source to make evidence, you have Ban Jaewook submit it formally in Internal Audit’s name.",
    "c31_hallway_drop": "Deciding to put no one’s name on it, you leave it as lost property for Han Jiwoo to use as she sees fit.",
    "c31_rooftop_share": "Saying it isn’t hers to carry alone, you tell her the story of that day as the one who wrote those eleven pages.",
    "c31_rooftop_reopen": "So that a question asked only once gets asked a second time, you propose attaching that old query to this examination’s file.",
    "c31_rooftop_lever": "Saying fast results matter more than an apology, you use that guilt as leverage and ask her to bring the results forward.",
    "c31_final_shield": "Saying the one who wrote the report straight mustn’t get hurt, you sign on condition that Choi Seojin’s name comes off the preparer field.",
    "c31_final_sign": "Saying that this time you won’t leave the signature line empty, you write your name on the confirmer’s line and confirm the facts as they are.",
    "c31_final_wait": "Saying three pages still aren’t enough, you hold off signing and gather more from inside during the explanation period.",
    "c31_after_warm": "Taking her words that the people are yours to look after, you gather at the bookshop tonight and mark the end of the examination with your colleagues.",
    "c31_after_record": "So you won’t have to lean on memory when the prosecutors ask, you log every question and answer of the five days in date order.",
    "c31_after_rush": "Before the prosecutors’ boxes arrive next week, you head straight to the records room for the Pyeongtaek originals.",
    "c31_boxes_choice_1": "Saying no one knows who might clear them away by morning, you carry the boxes to Han Jiwoo right now.",
    "c31_boxes_choice_2": "Saying it has to be stopped before June 12, you request a halt to the disposal in an official department memo.",
    "c31_boxes_choice_3": "To leave at least proof that the boxes were here, you just photograph them and leave them where they are.",
    "c31_buyer_choice_1": "Saying the words of someone who has paid interest for fourteen months can’t be turned into numbers, you let the examination team hear Yeon Jian’s story directly.",
    "c31_buyer_choice_2": "So that it doesn’t end as a complaint into the air but leaves a number behind, you help the buyers file through the official process.",
    "c31_buyer_choice_3": "With nothing you can tell her before the examination ends, you say an exam is under way and politely see Yeon Jian to the lobby.",
    "c31_chat_choice_1": "So that even someone on standby assignment isn’t dragged in, you keep your colleagues’ names out and submit the material under your name alone.",
    "c31_chat_choice_2": "Saying who found it and when is what gives material its force, you note each item’s source and time and submit it formally.",
    "c31_chat_choice_3": "Saying it’s the fifth day of the examination and there’s no time left, you pick the single strongest item and use it this morning.",
    "c31_boxes_reaction_choice_1": "Saying this isn’t something to settle in a corridor, you answer that the rules can be discussed in front of Han Jiwoo.",
    "c31_boxes_reaction_choice_2": "Saying that if it was by the rules there must be a decision document, you formally request a copy of the disposal decision.",
    "c31_boxes_reaction_choice_3": "Bothered by the words that Choi Seojin could get hurt, you pretend not to hear, just nod, and walk past.",
    "c31_buyer_reaction_choice_1": "Saying the 212 households don’t even know their names are being handed over, you get the buyers’ consent before submitting the list.",
    "c31_buyer_reaction_choice_2": "So the calculation of what could have been known, and when, can be made, you give Han Jiwoo the list of 212 units as examination material.",
    "c31_buyer_reaction_choice_3": "Saying the list of the 212 buyers is outside the examination’s scope, you don’t hand it to Han Jiwoo.",
    "c31_chat_reaction_choice_1": "At the remark that you liked numbers, you ask Yoon Sanghyuk back whether he remembers that loan’s eleven missing pages.",
    "c31_chat_reaction_choice_2": "Saying what is said in an elevator leaves no trace, you propose putting a meeting with the CEO on the official calendar, on the record.",
    "c31_chat_reaction_choice_3": "Feeling that any answer here would end up in an envelope too, you step out of the elevator first without a word.",
    "c31_branch_site_a": "Saying the people unpaid for three months come before any gap in numbers, you show Han Jiwoo the workers’ unpaid pay slips first.",
    "c31_branch_site_b": "Saying the gap between 62% and 45% has to be left where eyes can see it, you count the floors and build a table against the completion rate in the books.",
    "c31_branch_site_c": "Saying seeing the site is enough, you just take photos and hurry back to the examination room in Seoul.",
    "c31_branch_site_follow_a": "Saying the company must answer for money an examination can’t give, you demand a back-pay plan from the company, separate from the examination.",
    "c31_branch_site_follow_b": "So it stays on paper rather than ending in words, you ask for the unpaid wages to be put into the examination findings.",
    "c31_branch_site_follow_c": "Saying the examination comes before money for now, you ask the foreman in the doorway to wait.",
    "c31_route_system_report": "Saying that if someone else finds it, it becomes an excuse, you report the record with your employee ID to Han Jiwoo first.",
    "c31_route_system_trace": "Saying you need to know who used it three days before you came, you trace back through access logs who created the account early.",
    "c31_route_system_bury": "Before your name gets tangled up in an approval from before you even arrived, you close NOAH’s record screen.",
    "c31_final_system_route_a": "So that an account can’t pass for a person, you propose changing the rules so every exception approval carries the real name of the person who approved it.",
    "c31_final_system_route_b": "Saying handing over the four o’clock confirmation comes first, you bury the account misuse and leave only the extension losses as findings.",
    "c31_final_system_route_c": "Saying you aren’t the only one whose employee ID was taken, you gather the owners of the misused accounts and write the confirmation together.",
    "c31_evidence_turn_link": "Saying the examination has to see that the dates overlap, you formally attach the table of extension dates against the sale schedule to the examination file.",
    "c31_evidence_turn_hold": "Saying it has to come out when it hurts most, you hold the table and bring it out the day before the sale money moves.",
    "c31_evidence_turn_buyers": "Saying they’re the ones who will find out last, you tell the buyers of the 212 units the reason for the extensions first.",
    "c31_archive_evidence_turn": "Pinning a clue to each maturity-extension date, you compare them day by day with the Roundhill sale-talks schedule.",
    "c31_hallway_evidence_turn": "Pinning a clue to each maturity-extension date, you compare them day by day with the Roundhill sale-talks schedule.",
    "c31_rooftop_evidence_turn": "Pinning a clue to each maturity-extension date, you compare them day by day with the Roundhill sale-talks schedule.",
    "c31_route_system_evidence_turn": "Pinning a clue to each maturity-extension date, you compare them day by day with the Roundhill sale-talks schedule.",
    "c31_start_warm_face": "Saying that if your post is under suspicion it’s better to come clean first, you go to Han Jiwoo first and tell her honestly about your post and your situation.",
    "c31_start_warm_raw": "Saying an examination should get unpolished papers, you submit the 148 requested items as originals instead of the cleaned-up set.",
    "c31_start_warm_clean": "Saying the deadline comes first, you hand over the chief of staff’s cleaned-up set as is.",
    "c31_start_warm_signature": "Deciding to trust the people who read with you till dawn, you split the requested items among the five in the group chat.",
    "c31_start_record_face": "Saying that if your post is under suspicion it’s better to come clean first, you go to Han Jiwoo first and tell her honestly about your post and your situation.",
    "c31_start_record_raw": "Saying an examination should get unpolished papers, you submit the 148 requested items as originals instead of the cleaned-up set.",
    "c31_start_record_clean": "Saying the deadline comes first, you hand over the chief of staff’s cleaned-up set as is.",
    "c31_start_record_signature": "At her words that a blank usually has a reason, you check the tip-off list against the originals, writing down that reason too.",
    "c31_start_rush_face": "Saying that if your post is under suspicion it’s better to come clean first, you go to Han Jiwoo first and tell her honestly about your post and your situation.",
    "c31_start_rush_raw": "Saying an examination should get unpolished papers, you submit the 148 requested items as originals instead of the cleaned-up set.",
    "c31_start_rush_clean": "Saying the deadline comes first, you hand over the chief of staff’s cleaned-up set as is.",
    "c31_start_rush_signature": "Seeing the 04:02 line underlined, you first explain the access log: what you opened overnight."
  },
  "pack": {
    "clue": {
      "title": "The Dates of the Extensions",
      "text": "The four maturity extensions of the Pyeongtaek PF matched the dates of the four stages of the Roundhill sale talks. The fourth extension came the day after the draft annex giving Yoon Sanghyuk an advisory post changed hands."
    },
    "outcomes": {
      "c31_after_warm": {
        "tag": "Stayed Beside Them",
        "title": "The night the examination ended, Choi Seojin came to the bookshop’s 1st floor for the first time",
        "text": "On the night the five-day examination ended, the six of you and Choi Seojin gathered on the bookshop’s 1st floor. This time, Han Seoyun’s seven lunchboxes were emptied to the last bite."
      },
      "c31_after_record": {
        "tag": "Left on Record",
        "title": "Five days of questions and answers became one volume in date order",
        "text": "From Question 1 to the last number, who answered what, and when, was bound into one volume of record. The people coming next week will read it in the same order."
      },
      "c31_after_rush": {
        "tag": "Went Down First",
        "title": "You secured the Pyeongtaek originals before the boxes came",
        "text": "Leaving your colleagues’ messages behind, you went down to the records room and secured the box of originals. At the top of the entry log, your name was stamped again."
      }
    },
    "continuityChallenges": {
      "c30_after_warm": {
        "title": "Face the examination with the six who stayed till dawn",
        "text": "The six of you read the contract together until two in the morning. If the six stand together before the examiner too and find a way where no one gets hurt, trust remains."
      },
      "c30_after_record": {
        "title": "Turn a list with a blank into evidence",
        "text": "The blank in the list you made became, for the examiner, a reason for suspicion. What that blank protects, you show by reframing the table."
      },
      "c30_after_rush": {
        "title": "Bring that night in the folders to light",
        "text": "From the post Yoon Sanghyuk assigned, a record remains of you opening the department’s folders until four in the morning on the night before the examination. The card that lays that night before the examiner first builds fairness."
      }
    }
  }
};
