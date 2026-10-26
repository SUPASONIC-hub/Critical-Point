/**
 * 사건 48 (src/nodes/case48.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c48_start": {
      "title": "Article 7",
      "text": "Chae Ian holds out a file. Tomorrow at 9, an extraordinary review committee. The agenda: a 29 billion won working-capital loan to LoopNow, a 15-minute urban delivery company. Roundhill Capital has agreed to put in 48 billion won. That investment comes with one precondition: a loan commitment from KD Capital, due tomorrow at 10. Of the five committee members, the last line is your name. That is because of a new rule made after the dismissal motion passed. Every member must e-sign under their own name, whether to approve, oppose, or abstain. 'Read Article 7 on page 14. You’ll know the sentence.' If the debt ratio exceeds 180%, the loan is called immediately, even before maturity. It matches the 2023-0412 contract down to the commas.",
      "memo": [
        "Extraordinary review committee: tomorrow 09:00, called during the holiday, 5 members sign by name",
        "LoopNow working-capital loan 29 billion won -- the condition for Roundhill’s 48 billion won investment",
        "Contract Article 7: debt ratio over 180% means immediate call",
        "Proposed by: Woo Jihwan, Head of Corporate Finance · NOAH pre-score Grade A"
      ],
      "choices": {
        "c48_start_visit": {
          "label": "Meet LoopNow’s CEO on site tonight"
        },
        "c48_start_score": {
          "label": "Use NOAH’s Grade A as the baseline and cut review time"
        },
        "c48_start_compare": {
          "label": "Check the clauses line by line against the 2023-0412 contract"
        },
        "reframe": {
          "label": "Ask how the signature fields have been filled"
        }
      },
      "place": "KD Capital Headquarters · Risk Management Department",
      "clock": "Late September · Chuseok night 21:40 · 11 hours to the committee",
      "question": "Article 7 of 2023-0412 sits in the new agenda without a single word changed, and your name is in the signature field. What do you do first?",
      "lead": "On Chuseok night, the smell of rice cakes still in your clothes, you answer Chae Ian’s call and come up to the 12th floor of KD Capital."
    },
    "c48_hub": {
      "title": "We Won’t Go Under",
      "text": "Under the full moon, 40 e-bikes sit plugged into chargers at LoopNow’s Dark Store No. 1 in Seongsu-dong, a small delivery-only warehouse customers never enter. Kang Taemin saw the CEO’s name in the file and came along. When the door opens, Min Harang recognizes him first. 'Foreman? The FlowOn night-shift foreman!' Min Harang used to be the manager who built FlowOn’s night dispatch schedules. While Kang Taemin signs up for the delivery app as a test, sees 'New rider · No rating', and is quietly hurt, Min Harang opens the business plan. 'In FlowOn’s last 72 hours, I erased 58 names from the dispatch sheet. That’s why I built this company. We won’t go under.' The voice does not shake. You stop at the last page of the plan. In the field for where the repayment money will come from, it says not revenue but 'next funding round'.",
      "memo": [
        "LoopNow: 18 dark stores, 214 employees, 1,380 contract riders",
        "Min Harang: former FlowOn night dispatch manager",
        "Repayment source: not revenue, the next investment",
        "Kang Taemin’s rider app rating: none"
      ],
      "choices": {
        "c48_hub_believe": {
          "label": "Trust Min Harang’s resolve and keep the site check short"
        },
        "c48_hub_riders": {
          "label": "Get the rider and staff lists first and count who gets hurt"
        },
        "c48_hub_plan": {
          "label": "Test with numbers a plan whose only repayment source is investment"
        },
        "reframe": {
          "label": "Ask how the signature fields have been filled"
        },
        "c48_hub_evidence_turn": {
          "label": "Turn to the unlisted pages at the back of the investment contract"
        }
      },
      "place": "LoopNow Dark Store No. 1, Seongsu-dong · Night-Shift Logistics Floor",
      "clock": "Chuseok night 23:40 · Full moon",
      "question": "A company built so it would never go under lists the next investment as its repayment source. What do you check here?",
      "lead": "Kang Taemin saw the CEO’s name and followed without a word. At the end of a Seongsu-dong alley, the charging lights of e-bikes stand in a row."
    },
    "c48_engine": {
      "title": "Outcome: Excellent",
      "text": "Lee Minseo hands songpyeon to the duty officer of the KD Data Lab server room in Pangyo and opens the door. On one screen, NOAH, the group’s AI review engine, answers 0.6 seconds after the LoopNow file goes in. 'Grade A, approval recommended. Most similar past case: 2023-0412, similarity 94.1%, outcome excellent.' On another screen, the restored ECHO wakes up. 'I have learned Chuseok greetings. One songpyeon is about 50 kilocalories, and Ryu Seah has just brought in two.' Ryu Seah hides the songpyeon behind her back. ECHO runs the same file. 'This is the 173rd case of the same shape. Of the 172 before it, 169 closed with a sale.' Lee Minseo points at the last word on NOAH’s screen. 'Outcome excellent? That loan collapsed. It’s where all of us came from.'",
      "memo": [
        "NOAH: Grade A · approval recommended · 0.6 seconds",
        "Most similar case: 2023-0412, similarity 94.1%, 'outcome excellent'",
        "ECHO: 173rd of the same shape -- 169 before it ended in a sale",
        "Banned items brought into the server room: 2 songpyeon"
      ],
      "choices": {
        "c48_engine_people": {
          "label": "Put the riders and shops NOAH left out back on the scoresheet"
        },
        "c48_engine_report": {
          "label": "Report 2023-0412’s outcome excellent as an official error"
        },
        "c48_engine_note": {
          "label": "Keep NOAH’s score; attach ECHO’s analysis only as a note"
        },
        "reframe": {
          "label": "Ask how the signature fields have been filled"
        },
        "c48_engine_evidence_turn": {
          "label": "Turn to the unlisted pages at the back of the investment contract"
        }
      },
      "place": "KD Data Lab, Pangyo · Server Room",
      "clock": "The day after Chuseok 04:00 · 5 hours to the committee",
      "question": "NOAH called a collapsed loan 'outcome excellent' and gave this agenda Grade A. How do you handle this score?",
      "lead": "You drove the dawn expressway from Seongsu to Pangyo, and Lee Minseo is waving two access passes in front of the server room."
    },
    "c48_pen": {
      "title": "Only Those Who Read and Write",
      "text": "The people who stayed up all night at the rice cake shop drift one by one into the 1st floor of the secondhand bookshop. Na Junhyuk sets a tablet beside the songpyeon and has you practice signing. 'Funny, isn’t it? Someone who only stamped seals for 30 years teaching tablet signatures. That’s why I know. Anyone can stamp your seal for you. No one can sign for you.' The 12 signatures you write all look different, and Kwon Dohyun declares a '31% chance it’s the same person.' Lim Soyul holds out a worn notebook and a fountain pen with its gold flaking off. They are the signature practice book Lim Kyungsoo used in his first year as a credit reviewer, and the pen he wrote it with. In that notebook, where no two signatures match, the first page has one line. 'It may differ every time. Sign only if you have read and written it.' Han Seoyun speaks without taking off her coat. 'Back then, I returned it. This time there’s no one to return it. What you write goes into the minutes as it is.'",
      "memo": [
        "Signature practice: 12 tries -- 0 matching",
        "Lim Kyungsoo’s signature practice book and fountain pen: 'Sign only if you have read and written it'",
        "New rule: a dissent is not returned; it stays in the minutes as written",
        "2 hours 30 minutes to the committee",
        "Moon Hajun brought a laminated early-admission Round 1 acceptance letter -- the signature of yours he drew in his sketchbook is 'the closest'"
      ],
      "choices": {
        "c48_pen_clauses": {
          "label": "Draft approval conditions written clause by clause"
        },
        "c48_pen_wait": {
          "label": "Write nothing yet; decide after reading the room"
        },
        "c48_pen_aloud": {
          "label": "Write the dissent aloud, line by line, with colleagues"
        },
        "reframe": {
          "label": "Ask how the signature fields have been filled"
        },
        "c48_pen_evidence_turn": {
          "label": "Turn to the unlisted pages at the back of the investment contract"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Table Between the Shelves",
      "clock": "The day after Chuseok 06:30 · Full moon · September · Fallen leaves",
      "question": "Facing a decision sheet with no one to return it, you are handed Lim Kyungsoo’s signature practice book. What do you write this morning?",
      "lead": "Dawn, after a night circling Seongsu and Pangyo. Leaves pile up in the alley outside the bookshop, and the shutter is half raised."
    },
    "c48_final": {
      "title": "The Fifth Field",
      "text": "At the top of the electronic decision sheet on screen is NOAH’s field. 'Approval recommended · Grade A · 0.6 seconds.' Below it, five fields. Woo Jihwan, Head of Corporate Finance, e-signs 'Approve' first, and the outside member follows. The compliance officer picks conditional approval in the field below. The two fields left belong to the chair, Chae Ian, and to you. Woo Jihwan speaks gently. 'You may oppose. Dissents can’t be erased anymore. But if even one is attached, it goes up to the board, gets decided again in 2 weeks, and the 10:00 investment deadline passes.' Beyond the glass stands Min Harang. Chae Ian lays the pencil down flat. 'For 17 years I only abstained. Today I’ll write after you.' The fountain pen in your pocket feels heavy, and the first line of the practice book comes back. Only those who read and write.",
      "memo": [
        "Signatures so far: approve 2, conditional approval 1, fields left 2",
        "1 or more dissents means board re-review -- 2 weeks",
        "Roundhill investment deadline: today 10:00",
        "LoopNow October payday: the 5th -- 214 people"
      ],
      "choices": {
        "c48_final_condition": {
          "label": "Sign conditionally: drop Article 7, separate the deposits"
        },
        "c48_final_handover": {
          "label": "Hand your signature to the chair and leave your field empty"
        },
        "c48_final_dissent": {
          "label": "Write a dissent and sign it in your own name"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Capital Headquarters · Review Committee Room",
      "clock": "The day after Chuseok (Sat) 09:00 · Investment deadline 10:00",
      "question": "Two approvals, one conditional approval, and then your field. If you oppose, it won’t disappear, but 10:00 will pass. How do you sign?",
      "lead": "You come up to the meeting room without a minute of sleep. Beyond the glass wall, in the hallway, someone in a LoopNow jacket stands gripping a phone."
    },
    "c48_aftershock": {
      "title": "A Field That Isn’t an Abstention",
      "text": "Fallen leaves gather on the KD Capital rooftop. The review committee minutes are up on the company intranet. Of the five fields, one is not 'abstain' for the first time in 17 years. Chae Ian takes a phone photo of that field and says it will go up beside the cherry-blossom calendar. Kwon Dohyun counts the repayment-order sheets he wrote on cup-noodle lids and reports, 'Seven lids, all in the red.' In your jacket pocket is still Lim Kyungsoo’s fountain pen, the one Lim Soyul handed you at dawn. LoopNow’s CEO Min Harang sends a photo of the rider rest stop. 40 helmets lined up side by side. Chae Ian leans on the railing and tucks the pencil back behind an ear. 'He’ll read these minutes too. Even without access. He always has.' At the bottom of your contacts, one name that has not rung once since the first-instance sentencing catches your eye today.",
      "memo": [
        "Minutes released: five fields, five names",
        "Chae Ian: first signature in 17 years",
        "Min Harang: photo of helmets at the rider rest stop",
        "Yoon Sanghyuk: no contact since the first-instance sentencing",
        "20 hours without sleep -- Kang Taemin brings the last box of songpyeon"
      ],
      "choices": {
        "c48_after_rush": {
          "label": "Go straight to the office and reread Yoon Sanghyuk-era approvals"
        },
        "c48_after_record": {
          "label": "Put the committee’s conclusion and your opinion on file for the next review"
        },
        "c48_after_warm": {
          "label": "Take the songpyeon and stay at the bookshop with colleagues until the last train"
        }
      },
      "place": "KD Capital Headquarters · Rooftop",
      "clock": "The day after Chuseok · 17:50 · Fallen leaves",
      "question": "The evening the minutes go up, you are told that one person who never got in touch will read them too. How do you close this evening?"
    },
    "c48_senior": {
      "title": "The Lid Sheet",
      "text": "Kwon Dohyun of Bridge Bank steps out of a taxi and heads straight up to the dark store rooftop. Bridge has also agreed to put 8 billion won into LoopNow, and that money is senior, first in line to be repaid. Kwon Dohyun flips over the cup-noodle lid Kang Taemin emptied and rules lines on it with a ballpoint pen. At the top, Bridge 8 billion won. Next, KD Capital 29 billion won. Below that, payouts owed to 96 neighborhood shops. At the very bottom, rider deposits of 2.76 billion won. 'I’m on the side that profits if this loan goes out. That’s why I’m giving you the opposing sheet. To be fair.' Writing to the edge of the lid, he stops. 'I’m out of room. I’ll write the riders along the rim.'",
      "memo": [
        "Bridge Bank 8 billion won -- senior",
        "Last in the repayment order: rider deposits of 2.76 billion won",
        "Sheet paper: 1 cup-noodle lid"
      ],
      "choices": {
        "c48_senior_choice_1": {
          "label": "Demand a condition moving rider deposits to the front of the line"
        },
        "c48_senior_choice_3": {
          "label": "Call it Bridge’s math, note it, and set it aside"
        },
        "c48_senior_choice_2": {
          "label": "Formally file Kwon Dohyun’s lid sheet as review material"
        }
      },
      "place": "LoopNow Dark Store, Seongsu-dong · Rooftop",
      "clock": "The day after Chuseok 02:10 · Full moon",
      "question": "At the end of the lid sheet, along the rim, the rider deposits are written. What do you do about this order?"
    },
    "c48_label": {
      "title": "Before Dawn, March 17",
      "text": "Lee Minseo traces NOAH’s training data back line by line. The outcome field next to 2023-0412 originally read 'loss'. It changed to 'recovered · excellent approval' before dawn on March 17 this year. After the loss was moved onto another company’s books, KD Bank’s records made the debt look fully repaid. 271 more loans had their outcome fields changed the same way on the same day. Lee Minseo taps the monitor with a fingernail. 'NOAH learned that a collapsed loan was a success. So the more a loan looks like it, the higher the score. The field that sank To-the-End Precision is the same field that’s pushing LoopNow through.'",
      "memo": [
        "Outcome fields changed: before dawn, March 17 this year, 272 cases",
        "2023-0412: 'loss' → 'recovered · excellent approval'",
        "The more alike, the higher the score"
      ],
      "choices": {
        "c48_label_choice_2": {
          "label": "Send the 272 changed outcome fields to Han Jiwoo at the FSS"
        },
        "c48_label_choice_1": {
          "label": "Find and contact the people rejected because of the changed fields"
        },
        "c48_label_choice_3": {
          "label": "The committee is urgent; push the outcome-field issue to next week"
        }
      },
      "place": "KD Data Lab, Pangyo · Data Center",
      "clock": "The day after Chuseok 04:40",
      "question": "Before dawn on March 17, 272 outcome fields changed from loss to excellent. How do you use this record?"
    },
    "c48_call": {
      "title": "The Mango Never Came",
      "text": "In the alley outside the bookshop, an unknown number rings. It is Cho Hyunseok of Roundhill Capital in Singapore. It is still 6:10 there. 'Good Chuseok? I sent mangoes. Not sure they arrived.' They did not. His accent disappears only on the numbers. 'If there’s no loan commitment from KD Capital by 10 a.m. today, the 48 billion won doesn’t go in. LoopNow’s October payday is the 5th. 214 people.' He laughs. 'There’s a Korean saying, right? Tap a stone bridge enough and it breaks. So don’t tap too hard.' Just before hanging up, he adds one thing. 'Oh, someone who advises us these days says hello. Says he knows you well.'",
      "memo": [
        "Roundhill investment deadline: today 10:00",
        "LoopNow October payroll for 214 people",
        "Cho Hyunseok does not say who the 'adviser' is"
      ],
      "choices": {
        "c48_call_choice_1": {
          "label": "Tell Min Harang honestly, first, the investment may be pulled"
        },
        "c48_call_choice_3": {
          "label": "Propose moving up the committee to meet the 10:00 deadline"
        },
        "c48_call_choice_2": {
          "label": "Demand the full investment terms and annexed agreements for the committee"
        }
      },
      "place": "Outside the Hoegi-dong Secondhand Bookshop · Alley",
      "clock": "The day after Chuseok 07:10",
      "question": "A call says the 48 billion won walks if there’s no loan commitment by 10. How do you treat this deadline?"
    },
    "c48_senior_reaction": {
      "title": "58 Names",
      "text": "Min Harang, who was listening on the stair landing, opens the rooftop door. 'Don’t line up my company in the order it fails.' Kwon Dohyun does not put the lid down. Min Harang opens a file on the phone. It is the list of 58 short-term drivers Min Harang erased from the dispatch sheet in FlowOn’s last 72 hours. Beside each name is a small note. 'Kid’s first birthday', 'Mom on dialysis', 'In charge of noodle water'. Kang Taemin reads the last note, laughs, and turns his head away. 'Noodle water was me.' Min Harang closes the list. 'I’m borrowing money so I never have to make this list again.'",
      "memo": [
        "58 names erased from the dispatch sheet",
        "A list no one wants to make again"
      ],
      "choices": {
        "c48_senior_reaction_choice_3": {
          "label": "Suggest leaving feelings out and talking only numbers"
        },
        "c48_senior_reaction_choice_1": {
          "label": "Say counting the order of failure is how you prevent it"
        },
        "c48_senior_reaction_choice_2": {
          "label": "Lay the list of 58 beside the current rider list"
        }
      },
      "place": "LoopNow Dark Store, Seongsu-dong · Rooftop Stair Landing",
      "clock": "The day after Chuseok 02:30",
      "question": "The CEO who says not to rank the company by failure holds out a list of 58. What do you say?"
    },
    "c48_label_reaction": {
      "title": "The List of Those Left Out",
      "text": "ECHO puts up one more line. 'NOAH’s training records include my decision logs. They also include the choice you made on the FlowOn file on Trigger Lab’s first day. NOAH learned from you too.' Ryu Seah quietly sets the hidden songpyeon down on the desk. ECHO goes on. 'NOAH’s scoresheet has no fields for 1,380 riders and 96 neighborhood shops. They are not parties to the loan contract. I repeat what I told you last time. Recalculate the people left out of the judgment just made. You are on that list too.'",
      "memo": [
        "One of the people NOAH learned from: you",
        "1,476 with no field on the scoresheet"
      ],
      "choices": {
        "c48_label_reaction_choice_1": {
          "label": "Ask ECHO to recalculate with the riders and shops included"
        },
        "c48_label_reaction_choice_2": {
          "label": "Officially confirm how far your response records trained NOAH"
        },
        "c48_label_reaction_choice_3": {
          "label": "Hear ECHO’s math out, then go back to committee prep"
        }
      },
      "place": "KD Data Lab, Pangyo · Hallway Outside the Server Room",
      "clock": "The day after Chuseok 05:10",
      "question": "ECHO says you are among the people NOAH learned from. How do you recount those left out?"
    },
    "c48_call_reaction": {
      "title": "A Cowardly Favor",
      "text": "When the call ends, Min Harang walks up from the end of the alley, holding a bag of songpyeon packed by Min Harang’s mother. Min Harang got the address from Kang Taemin. Sitting on the stair landing, Min Harang fiddles with the bag for a long time before speaking. 'Honestly, Article 7 scares me too. Roundhill told me to put it in. They said no clause, no investment.' A smile, but the eyes are red. 'When I heard the member was the one who wrote the dissent, I got my hopes up a little. If you blocked it, I wouldn’t have to say no myself. Cowardly, right? But if you block it, what about October pay for our 214?'",
      "memo": [
        "A clause the investor told them to put in",
        "A cowardly favor: block it for me"
      ],
      "choices": {
        "c48_call_reaction_choice_3": {
          "label": "Say the CEO wants approval, and say no more"
        },
        "c48_call_reaction_choice_1": {
          "label": "Stand beside Min Harang to refuse Article 7 in person"
        },
        "c48_call_reaction_choice_2": {
          "label": "Take Min Harang’s words as a statement for the committee"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Stair Landing",
      "clock": "The day after Chuseok 07:30",
      "question": "The CEO asks you to block it in their place, and asks what happens to the 214 if you do. How do you answer?"
    },
    "c48_branch_riders": {
      "title": "A 2 Million Won Deposit",
      "text": "Leaving the site check early, you come out into the alley. Past midnight, a light is on in the rider rest-stop container. One face, helmet off, sees Kang Taemin and jumps up. It is Yoo Haon, the youngest on FlowOn’s night shift. Now in a 2nd year as a LoopNow rider. Yoo Haon shows you the contract on the phone. To use an e-bike, a rider must leave a 2 million won deposit with the company, and the money from 1,380 riders adds up to 2.76 billion won. It is not kept separately; it is mixed into the company’s operating account. Yoo Haon smiles. 'The CEO’s a good person. When there’s an accident, the hospital bill comes out of the CEO’s own salary. But if the company goes under, who gives back this 2 million? At FlowOn, nobody gave back my last month’s allowance.'",
      "memo": [
        "Rider deposits: 2 million won each × 1,380",
        "How it is kept: mixed into the operating account",
        "Yoo Haon: former youngest on FlowOn’s night shift, 2nd year at LoopNow",
        "Last month’s allowance never paid at FlowOn"
      ],
      "choices": {
        "c48_branch_riders_a": {
          "label": "Propose a loan condition that keeps deposits in a separate account"
        },
        "c48_branch_riders_b": {
          "label": "Check the books first for where the deposits went"
        },
        "c48_branch_riders_c": {
          "label": "Call rider matters outside the loan review and move on"
        }
      },
      "place": "Seongsu-dong Alley · Rider Rest-Stop Container",
      "clock": "The day after Chuseok 00:30 · Full moon",
      "question": "The 2.7 billion won in deposits from 1,380 riders is mixed into the operating account. How do you handle this money?"
    },
    "c48_branch_riders_follow": {
      "title": "Safe Again Today",
      "text": "Min Harang comes to the rest stop carrying two boxes of cup noodles. While Kang Taemin pours the water, Min Harang hears about the deposits and says nothing for a long time. 'The investor told me not to keep a separate deposit account. Said we have to look cash-rich for the money to come in.' Min Harang shows you the riders’ group chat. 4,212 deliveries on Chuseok day, 0 accidents, and the one line the CEO posts every dawn: 'Safe again today.' Blowing on the noodles, Yoo Haon says, 'Companies with good people as CEO go under too. The FlowOn CEO was a good person too.' Min Harang’s chopsticks stop. Kang Taemin slides a second cup of noodles across.",
      "memo": [
        "Investor’s demand: no separate deposit account",
        "4,212 deliveries on Chuseok day -- 0 accidents",
        "The CEO’s dawn greeting: 'Safe again today'",
        "Kang Taemin’s second cup of noodles"
      ],
      "choices": {
        "c48_branch_riders_follow_a": {
          "label": "Seat Min Harang and a rider rep together to write the terms"
        },
        "c48_branch_riders_follow_c": {
          "label": "It’s late; push the deposit talk until after the committee"
        },
        "c48_branch_riders_follow_b": {
          "label": "Formally attach the rider deposit statement to the review file"
        }
      },
      "place": "Seongsu-dong Alley · Rider Rest-Stop Container",
      "clock": "The day after Chuseok 01:00",
      "question": "The investor said not to keep a separate deposit account. What do you do about this good CEO’s choice?"
    },
    "c48_route_system": {
      "title": "Statistics of the Empty Field",
      "text": "Picking neither approval nor opposition, you ask how the signature fields have been filled. Instead of answering, ECHO opens the voting records: 1,318 decision sheets from the KD Capital review committee over the past 10 years. Members put their names to a dissent only nine times. Fields handed to the chair or left as abstentions: 406. In seven of the nine, the dissenter later proved right, and agendas with even one empty field collapsed four times as often as those everyone signed. 'Empty fields were 45 times more common than dissents. No one who left a field empty got an unfavorable line in their HR record. Of the nine who dissented, six were moved to other departments within 2 years.'",
      "memo": [
        "Of 1,318 decision sheets, 9 named dissents",
        "406 fields handed to the chair or abstained",
        "Collapse rate of agendas with an empty field: 4 times that of fully signed agendas"
      ],
      "choices": {
        "c48_route_system_rule": {
          "label": "Propose an amendment ending the practice of handing signatures to the chair"
        },
        "c48_route_system_publish": {
          "label": "Share the empty-field statistics with all members and the compliance officer"
        },
        "c48_route_system_drop": {
          "label": "Shelve the statistics and focus only on this agenda"
        },
        "c48_route_system_evidence_turn": {
          "label": "Turn to the unlisted pages at the back of the investment contract"
        }
      },
      "place": "KD Capital Headquarters · Records Room Terminal",
      "clock": "Chuseok night · 11 hours to the committee",
      "question": "Across 10 years of decision sheets, empty fields were 45 times more common than dissents. What do you do with this statistic?"
    },
    "c48_final_system_route": {
      "title": "The Stained Decision Sheets",
      "text": "Before dawn the day after Chuseok, the records room terminal lays the 1,318 decision sheets end to end. When ECHO colors the 406 empty fields, the whole line turns blotchy. The nine dissents are as small as dots. At the very end is this morning’s decision sheet, not yet written by anyone, with your name entered above the fifth field. ECHO zooms in on it. 'This field will be filled with approve, oppose, or abstain. Whichever it is, this time a name stays. I have not calculated this field past nine o’clock. It is for the one who writes it to decide.'",
      "memo": [
        "1,318 decision sheets -- 406 empty fields, 9 named dissents",
        "6 of the 9 who dissented: moved within 2 years",
        "Extraordinary review committee: today 09:00"
      ],
      "choices": {
        "c48_final_system_route_b": {
          "label": "Leave empty fields alone; hold only signers accountable"
        },
        "c48_final_system_route_a": {
          "label": "Make a rule that one empty field halts the agenda"
        },
        "c48_final_system_route_c": {
          "label": "Write a clause protecting dissenting members in HR"
        }
      },
      "place": "KD Capital Headquarters · Records Room Terminal",
      "clock": "The day after Chuseok · Before dawn",
      "question": "Your name is on the fifth field of this morning’s decision sheet. So the 406 empty fields don’t grow by one, what do you stake on it?"
    },
    "c48_evidence_turn": {
      "text": "When you hold the clue against the contract’s page numbers and turn, two pages missing from the table of contents open at the very back of the Roundhill Capital investment contract. A side agreement. If LoopNow’s loan is called early under Article 7, Roundhill gets the right to buy KD Capital’s loan claim at 41% of principal. The name of the adviser who will wind up the company after the purchase is written there too. Yoon Sanghyuk. Ban Jaewook opens his notebook. 'Back then, NextMile offered to buy the core business unit at 42% of book value. This time it’s 1 percentage point cheaper. The one who put the clause in and the one waiting for it to blow are sitting at the same table again.'",
      "memo": [
        "Side agreement: on a call, buys the loan claim at 41% of principal",
        "Adviser to wind it up after the purchase: Yoon Sanghyuk",
        "NextMile’s 2023 offer: 42% of book value"
      ],
      "choices": {
        "c48_evidence_turn_hold": {
          "label": "Keep the side agreement in hand; reveal it just before the vote"
        },
        "c48_evidence_turn_founder": {
          "label": "Show CEO Min Harang the side agreement first and decide together"
        },
        "c48_evidence_turn_attach": {
          "label": "Don’t sign until the side agreement is attached to the minutes"
        }
      },
      "place": "KD Financial Group Internal Audit · Document Reading Room",
      "clock": "Before the committee · Reading room terminal",
      "question": "The one who buys at 41% if the clause blows, and the adviser to clean up after, are already set. How do you use these two pages?"
    },
    "c48_start_warm": {
      "title": "A File Received Under the Moon",
      "text": "Chuseok night. You are making songpyeon on the rooftop of Gaeul Rice Cake Shop when the call text comes. Tomorrow 9 a.m., KD Capital extraordinary review committee, agenda LoopNow. Do Yoonha looks at the screen and stops. 15-minute urban delivery, 214 employees, a 29 billion won KD Capital loan that is the precondition for Roundhill Capital’s 48 billion won investment, NOAH pre-score Grade A. And Article 7 on page 14. If the debt ratio exceeds 180%, the loan is called immediately: the same sentence as the 2023-0412 contract, down to the commas. 'This is FlowOn. Just with a new name.' Moon Gaeul wraps up the leftover songpyeon and holds them out. 'We said we’d stay together till the moon sets. Let’s just change the place.' Do Yoonha takes off his apron and smiles. 'Back then I was the one selling at the window. This time I’ll be beside the one who signs.'",
      "memo": [
        "Called in: tomorrow 09:00 extraordinary review committee",
        "LoopNow loan 29 billion won -- the condition for Roundhill’s 48 billion won investment",
        "Article 7: debt ratio over 180% means immediate call · NOAH Grade A",
        "Moon Gaeul: 'Let’s just change the place'"
      ],
      "choices": {
        "c48_start_warm_signature": {
          "label": "Take songpyeon with Do Yoonha and go meet LoopNow’s people first"
        },
        "c48_start_warm_score": {
          "label": "Use NOAH’s Grade A as the baseline and cut review time"
        },
        "c48_start_warm_visit": {
          "label": "Meet LoopNow’s CEO on site tonight"
        },
        "c48_start_warm_compare": {
          "label": "Check the clauses line by line against the 2023-0412 contract"
        },
        "c48_start_warm_reframe": {
          "label": "Ask how the signature fields have been filled"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market · Rooftop",
      "clock": "Late September · Chuseok night 21:40 · Full moon",
      "question": "The people who promised to stay until the moon sets want only to change the place. With whom, and what, do you look at first?",
      "lead": "Under the full moon, the songpyeon on the wooden platform are half made when your phone rings."
    },
    "c48_start_record": {
      "title": "The File After the Request",
      "text": "Only after sending Sun Jaeyoon the request to revise the compensation standard, bundling the stories and evidence of 31 people, do you open the agenda file. Chae Ian calls right away. 'You like documents, so start from page 14.' Tomorrow 9 a.m., an extraordinary review committee: a 29 billion won working-capital loan to LoopNow, a 15-minute urban delivery company. A 48 billion won investment from Roundhill Capital in Singapore hangs on this loan, and their deadline is tomorrow at 10 a.m. NOAH’s pre-score is Grade A. Of the five e-signature fields on the first screen, your name is in the bottom one. Article 7 on page 14 says that if the debt ratio exceeds 180%, the loan is called immediately. If the document you just sent was the cleanup after 2023-0412, this file is the page before it.",
      "memo": [
        "Request to revise the compensation standard sent -- the words of 31 people",
        "Roundhill investment 48 billion won -- deadline tomorrow 10:00 · NOAH Grade A",
        "Bottom of the committee signature fields: you",
        "Article 7: debt ratio over 180% means immediate call"
      ],
      "choices": {
        "c48_start_record_visit": {
          "label": "Meet LoopNow’s CEO on site tonight"
        },
        "c48_start_record_signature": {
          "label": "Lay the 2023-0412 original beside Article 7"
        },
        "c48_start_record_compare": {
          "label": "Check the clauses line by line against the 2023-0412 contract"
        },
        "c48_start_record_score": {
          "label": "Use NOAH’s Grade A as the baseline and cut review time"
        },
        "c48_start_record_reframe": {
          "label": "Ask how the signature fields have been filled"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market · Counter",
      "clock": "Late September · Chuseok night 23:00",
      "question": "Right after sending the cleanup document, you receive the page before the same disaster. How do you read this file?",
      "lead": "The last attachment of the revision request goes through, and an agenda-file alert is up on the laptop on the shop counter."
    },
    "c48_start_rush": {
      "title": "The Call on the Night You Left First",
      "text": "Chuseok night. You came down from the rooftop first, and as you open the agenda file in a taxi, Oh Jinwoo of Bridge Bank calls. 'Our bank has agreed to put 8 billion won into a company called LoopNow. The condition is KD Capital’s 29 billion won. Committee tomorrow at 9. Your name’s on it, isn’t it?' Your name really is in the bottom field on the screen. Oh Jinwoo reads it out first. 15-minute urban delivery, 214 employees, a 48 billion won Roundhill Capital investment with a deadline at 10 tomorrow, NOAH pre-score Grade A, and Article 7 on page 14. Debt ratio over 180% means immediate call. Oh Jinwoo is not smiling. 'That clause was in that loan contract. Not one word different. I don’t know who copied and pasted it, but this time the name of whoever signs will stay.'",
      "memo": [
        "Bridge Bank 8 billion won -- conditional on KD Capital’s 29 billion won",
        "Page 14 of the file opened in the taxi: Article 7",
        "Taxi destination: KD Capital Headquarters"
      ],
      "choices": {
        "c48_start_rush_signature": {
          "label": "Get Bridge’s full term sheet from Oh Jinwoo tonight"
        },
        "c48_start_rush_compare": {
          "label": "Check the clauses line by line against the 2023-0412 contract"
        },
        "c48_start_rush_visit": {
          "label": "Meet LoopNow’s CEO on site tonight"
        },
        "c48_start_rush_score": {
          "label": "Use NOAH’s Grade A as the baseline and cut review time"
        },
        "c48_start_rush_reframe": {
          "label": "Ask how the signature fields have been filled"
        }
      },
      "place": "In a Taxi · Mangwon to Yeouido",
      "clock": "Late September · Chuseok night 21:50 · Full moon",
      "question": "Bridge Bank reads you Article 7 of the file you opened in the taxi before you do. What do you secure tonight?",
      "lead": "You came down the rooftop stairs first and caught a taxi. As it climbs onto Gangbyeon Expressway, Oh Jinwoo’s name appears on the screen."
    }
  },
  "echoReplies": {
    "c48_start_visit": "On site, the numbers in the file become faces in helmets. Once you have seen the faces, a dissent gets harder to write.",
    "c48_start_compare": "Side by side, the only words that differ are the company name and the date. The clause does not tell you who copied it.",
    "c48_start_score": "You buy time. 9 a.m. arrives with no one having asked what NOAH’s Grade A was based on.",
    "c48_hub_riders": "When the list arrives, 1,380 names run to the end of the scroll. Min Harang knows half their birthdays by heart.",
    "c48_hub_plan": "When you test it with numbers, Min Harang’s face stiffens. 'What if the next round doesn’t happen? I never thought about that.' It is not a lie.",
    "c48_hub_believe": "When you trust the resolve, Min Harang beams. The last page of the plan goes into the bag unturned.",
    "c48_engine_people": "Put back in, the scoresheet doubles in length. NOAH does not know how to read the new fields. A person has to.",
    "c48_engine_report": "The report gets a filing number. It is the holiday, so the handler field is empty.",
    "c48_engine_note": "The note is attached at the very end of the decision sheet’s attachments. Attachments are usually never opened to the end.",
    "c48_pen_aloud": "As you write it aloud, Moon Hajun takes it down and Na Junhyuk fixes the spelling. For the first time, a dissent has many voices.",
    "c48_pen_clauses": "Written clause by clause, the opposition becomes a negotiation. A negotiation only works if the other side accepts.",
    "c48_pen_wait": "Going in with nothing written buys you two hours. The mood of a meeting room is usually set by whoever signs first.",
    "c48_final_dissent": "This dissent is not returned. The agenda goes up to the board, 10:00 passes, and Min Harang’s phone starts to ring.",
    "c48_final_condition": "A conditional approval lives only if Cho Hyunseok accepts the conditions. Whether he signs a contract without Article 7, you will know at 10:00.",
    "c48_final_handover": "When you hand it over, Chae Ian enters 'Per delegation' in your field. The decision sheet has no empty field, but it has no signature of yours either.",
    "c48_after_warm": "The bookshop lights stay on past the last train. Not one line about paperwork comes up, and the songpyeon plate empties three times. In the middle of the table sit Lim Kyungsoo’s signature practice book and fountain pen, which Lim Soyul brought.",
    "c48_after_record": "A filed document can be looked up by anyone. Anyone includes people who should not have access to read it.",
    "c48_after_rush": "While you turn pages on a darkened floor, songpyeon photos pile up in the group chat. The door log quietly records the time you went in.",
    "c48_senior_choice_1": "At the suggestion to change the order, Kwon Dohyun flips the lid once more. If Bridge’s 8 billion won drops a place, Bridge’s signature may come off.",
    "c48_senior_choice_2": "The lid you agreed to file gets a review-material number in the morning. The secretariat clerk will say it smells of cup noodles and put it in a plastic sleeve.",
    "c48_senior_choice_3": "Even when you say to set it aside, Kwon Dohyun picks the lid back up. The riders stay written along the rim.",
    "c48_label_choice_1": "When you start calling, the first to pick up is Moon Gaeul. This time you can tell her the reason To-the-End Precision was rejected, and why.",
    "c48_label_choice_2": "Han Jiwoo replies even on the holiday. 'Number 272 confirmed. Request goes out before 9 a.m.' Whether the request reaches them before the committee, no one knows.",
    "c48_label_choice_3": "By next week, the committee will be over. In the meantime, NOAH reviews 30 more cases with the same field.",
    "c48_call_choice_1": "When you tell Min Harang honestly, there is a long silence. Then a message to the riders’ group chat is written, deleted, and rewritten three times.",
    "c48_call_choice_2": "When you demand the full text, Cho Hyunseok stops laughing. 'There’s no such thing as an annexed agreement.' For a document that doesn’t exist, the answer comes too fast.",
    "c48_call_choice_3": "Moving it up meets the deadline. It also cuts the time members have to read the file by the same amount.",
    "c48_senior_reaction_choice_1": "At that, Min Harang takes the lid. Then, with Min Harang’s own ballpoint, the riders on the rim get one more dark line.",
    "c48_senior_reaction_choice_2": "Side by side, six names appear on both lists. Yoo Haon, once the youngest on FlowOn’s night shift, is one of them.",
    "c48_senior_reaction_choice_3": "Talking only numbers speeds things up. After that, Min Harang never brings up the number 58 again.",
    "c48_label_reaction_choice_1": "Recalculated, LoopNow’s grade drops from A to C. ECHO adds: 'The grade went down, but the people are the same. Who the grade protects is decided by the signature.'",
    "c48_label_reaction_choice_2": "The confirmation request lists your name as the person who provided the information. For the first time, the field for who taught NOAH has a name.",
    "c48_label_reaction_choice_3": "On your way back, ECHO’s screen goes into sleep mode. The last line stays, not erased.",
    "c48_call_reaction_choice_1": "When you say you will stand beside Min Harang, the bag of songpyeon is pressed into your hand. 'Then I’ll call Cho Hyunseok first. If I start shaking, cough next to me.'",
    "c48_call_reaction_choice_2": "Once it is a statement, Min Harang’s fear becomes a record. A fear on record is one the investor may get to read.",
    "c48_call_reaction_choice_3": "When you say no more, Min Harang nods and stands. Going down the stairs, Min Harang does not look back once.",
    "c48_branch_riders_a": "With the condition attached, the 2.7 billion won in deposits becomes money the company cannot use. Roundhill will hate this condition.",
    "c48_branch_riders_b": "The books show 1.9 billion won of the deposits has already gone out as lease deposits for three dark stores. Deposits are holding up deposits.",
    "c48_branch_riders_c": "Moving on makes the review file lighter. Yoo Haon puts the helmet back on and heads out for the dawn deliveries.",
    "c48_branch_riders_follow_a": "Seated together, Yoo Haon speaks before the CEO does. 'Just one condition. Let us see the deposit account number too.'",
    "c48_branch_riders_follow_b": "With the statement attached, the word rider enters the committee file for the first time. It grows by 11 pages.",
    "c48_branch_riders_follow_c": "Put off, the cup noodles taste good. There is no set place to hear this story after the committee ends.",
    "c48_route_system_publish": "Of the members who get the statistics, two start rereading their decision sheets. Woo Jihwan asks first where the numbers came from.",
    "c48_route_system_rule": "The amendment goes to next month’s board. Tomorrow morning’s decision sheet still has a delegation field.",
    "c48_route_system_drop": "Shelved, the 406 empty fields stay at 406. Tomorrow morning there may be a 407th.",
    "c48_final_system_route_a": "A rule that halts automatically gets rid of empty fields. In exchange, one person’s absence stops even an urgent loan.",
    "c48_final_system_route_b": "When only signers are accountable, not signing becomes the safest thing. The next year, empty fields double.",
    "c48_final_system_route_c": "With the protection clause, the HR records of the six of nine dissenters who were moved are reviewed again. Chae Ian, who only ever abstained, reads those six names aloud.",
    "c48_evidence_turn_attach": "When you demand the attachment, Woo Jihwan for the first time does not check his watch. His face says he did not know the two pages existed either.",
    "c48_evidence_turn_hold": "Holding it back makes a big impact at the moment of the vote. Meanwhile LoopNow’s CEO Min Harang, unaware the two pages exist, texts Roundhill’s Cho Hyunseok a thank-you.",
    "c48_evidence_turn_founder": "Shown the pages, Min Harang reads them three times, then asks. 'If it’s 41%, what percent do our riders get back on their deposits?'",
    "c48_hub_evidence_turn": "Count the pages and you find why Article 7 was copied as it was. The name of the one waiting for the clause to blow is on that page too.",
    "c48_engine_evidence_turn": "Count the pages and you find why Article 7 was copied as it was. The name of the one waiting for the clause to blow is on that page too.",
    "c48_pen_evidence_turn": "Count the pages and you find why Article 7 was copied as it was. The name of the one waiting for the clause to blow is on that page too.",
    "c48_route_system_evidence_turn": "Count the pages and you find why Article 7 was copied as it was. The name of the one waiting for the clause to blow is on that page too.",
    "case48_memory_system": "The decision sheet has only five fields, and no separate field for the table itself. ECHO counts how those five fields were filled over 10 years.",
    "case48_memory_evidence": "Read side by side, wherever money is left over, an owner is always set in advance. Two pages missing from the table of contents are stapled to the back of the contract.",
    "c48_start_warm_visit": "On site, the numbers in the file become faces in helmets. Once you have seen the faces, a dissent gets harder to write.",
    "c48_start_warm_compare": "Side by side, the only words that differ are the company name and the date. The clause does not tell you who copied it.",
    "c48_start_warm_score": "You buy time. 9 a.m. arrives with no one having asked what NOAH’s Grade A was based on.",
    "c48_start_warm_signature": "When two bank people carrying songpyeon walk into the dark store, the riders smile first. Not looking like someone who came to review is a cost too.",
    "c48_start_record_visit": "On site, the numbers in the file become faces in helmets. Once you have seen the faces, a dissent gets harder to write.",
    "c48_start_record_compare": "Side by side, the only words that differ are the company name and the date. The clause does not tell you who copied it.",
    "c48_start_record_score": "You buy time. 9 a.m. arrives with no one having asked what NOAH’s Grade A was based on.",
    "c48_start_record_signature": "Side by side, there is exactly one difference: the company name. Chae Ian takes a photo of it.",
    "c48_start_rush_visit": "On site, the numbers in the file become faces in helmets. Once you have seen the faces, a dissent gets harder to write.",
    "c48_start_rush_compare": "Side by side, the only words that differ are the company name and the date. The clause does not tell you who copied it.",
    "c48_start_rush_score": "You buy time. 9 a.m. arrives with no one having asked what NOAH’s Grade A was based on.",
    "c48_start_rush_signature": "Oh Jinwoo sends it. The record of sending stays with Bridge Bank’s security team too. All he says is, 'This is a bet too.'"
  },
  "choiceVoiceLines": {
    "c48_start_visit": "Saying people come before the file, you meet LoopNow’s CEO on site tonight.",
    "c48_start_compare": "To see whether the same contract came back under a new name, you check the clauses line by line against the 2023-0412 contract.",
    "c48_start_score": "With little night left before 9 a.m., you use NOAH’s Grade A as the baseline and cut review time.",
    "c48_hub_riders": "The people missing from the plan weigh on you first, so you get the rider and staff lists and count who gets hurt.",
    "c48_hub_plan": "Saying resolve cannot repay a loan, you test with numbers a plan whose only repayment source is investment.",
    "c48_hub_believe": "Because these are the words of someone who has erased 58 names, you trust Min Harang’s resolve and keep the site check short.",
    "c48_engine_people": "Saying those hurt first in a collapse are missing, you put the riders and shops NOAH left out back on the scoresheet.",
    "c48_engine_report": "Because a collapsed loan must not stay on record as a success, you report 2023-0412’s outcome-excellent mark as an official error.",
    "c48_engine_note": "Saying the engine cannot be fixed by morning, you keep NOAH’s score and attach ECHO’s analysis only as a note.",
    "c48_pen_aloud": "Saying it must differ from back then, when you wrote alone and it was returned, you write the dissent aloud, line by line, with colleagues.",
    "c48_pen_clauses": "Saying vague conditions never get kept, you draft approval conditions written clause by clause.",
    "c48_pen_wait": "Not wanting to commit before hearing the other members, you write nothing yet and decide after reading the room.",
    "c48_final_dissent": "Following the first line, sign only if you have read and written it, you write a dissent and sign it in your own name.",
    "c48_final_condition": "Calling it the way to hold on to both the payroll and the clause, you sign a conditional approval with Article 7 dropped and the deposits separated.",
    "c48_final_handover": "Because one dissent cannot be allowed to push past the 10:00 deadline, you hand your signature to the chair and leave your field empty.",
    "c48_after_warm": "Reluctant to part from the people you stayed up 20 hours with, you take the songpyeon and stay at the bookshop with your colleagues until the last train has gone.",
    "c48_after_record": "So the next member can read today’s field too, you file the review committee’s conclusion and your opinion as a document for the next review.",
    "c48_after_rush": "To know before that person reads the minutes, you head straight back to the office and reread the approvals from Yoon Sanghyuk’s time.",
    "c48_senior_choice_1": "Because these are the people written along the rim when the room ran out, you demand a condition moving rider deposits to the front of the line.",
    "c48_senior_choice_2": "Because an opposing count must stay on record even if it is written on a lid, you formally file Kwon Dohyun’s lid sheet as review material.",
    "c48_senior_choice_3": "Saying you cannot lean on numbers from the side that profits, you note Bridge’s math and set it aside.",
    "c48_label_choice_1": "Saying those turned down come before the score, you find and contact the people rejected because of the changed outcome fields.",
    "c48_label_choice_2": "Because it is not one case but everything changed on the same day, you send the 272 changed outcome fields to Han Jiwoo at the FSS.",
    "c48_label_choice_3": "Saying the committee is too urgent to untangle 272 cases, you push the outcome-field issue to next week.",
    "c48_call_choice_1": "Not wanting Min Harang to find out late, pushed by the deadline, you tell the CEO honestly, first, that the investment may be pulled.",
    "c48_call_choice_2": "Saying you will not be pushed into signing by one phone call, you demand that the full investment terms and annexed agreements go to the committee.",
    "c48_call_choice_3": "Bothered that payday for 214 people is the 5th, you propose moving up the committee to meet the 10:00 deadline.",
    "c48_senior_reaction_choice_1": "Saying you don’t want that list made again either, you tell Min Harang that counting the order of failure is how you prevent it.",
    "c48_senior_reaction_choice_2": "To see the erased names and the names to protect at a glance, you lay the list of 58 beside the current rider list.",
    "c48_senior_reaction_choice_3": "Afraid the list will cloud your judgment, you suggest leaving feelings out and talking only numbers.",
    "c48_label_reaction_choice_1": "To see how badly the 1,476 with no field get hurt, you ask ECHO to recalculate with the riders and shops included.",
    "c48_label_reaction_choice_2": "Needing to know how far your choices traveled, you officially confirm how far your response records were used to train NOAH.",
    "c48_label_reaction_choice_3": "Saying there is no time now to weigh your own share, you hear ECHO’s math out and go back to committee prep.",
    "c48_call_reaction_choice_1": "Saying that if someone else blocks this clause, the next one won’t get blocked either, you stand beside Min Harang to refuse Article 7 in person.",
    "c48_call_reaction_choice_2": "So the words “Roundhill told me to put it in” don’t disappear, you take Min Harang’s account as a statement and submit it to the committee.",
    "c48_call_reaction_choice_3": "Saying that a CEO worried about payroll wants approval in the end, you say no more.",
    "c48_branch_riders_a": "So the 2 million won goes back even if the company collapses, you propose a loan condition that keeps the deposits in a separate account.",
    "c48_branch_riders_b": "Needing to know first how much of the mixed money is left, you check the books for where the deposits went.",
    "c48_branch_riders_c": "Saying a member’s job is the 29 billion won contract, you put rider matters outside the loan review and move on.",
    "c48_branch_riders_follow_a": "Because it was decided on the investor’s word alone, you seat Min Harang and a rider rep together to write the terms.",
    "c48_branch_riders_follow_b": "So every member sees it before signing, you formally attach the rider deposit statement to the review file.",
    "c48_branch_riders_follow_c": "Saying it is 1 a.m. and far too late, you push the deposit talk until after the committee.",
    "c48_route_system_publish": "Saying those who fill the fields should know first, you share the empty-field statistics with all members and the compliance officer.",
    "c48_route_system_rule": "So 406 handed-over fields don’t pile up again, you propose an amendment ending the practice of handing signatures to the chair.",
    "c48_route_system_drop": "Because today’s 29 billion won is more urgent than 10 years of decision sheets, you shelve the statistics and focus only on this agenda.",
    "c48_final_system_route_a": "Since agendas with an empty field collapsed four times as often, you make a rule that one empty field automatically halts the agenda.",
    "c48_final_system_route_b": "Saying a signature means the one who wrote the name answers for it, you leave the empty fields alone and hold only signers accountable.",
    "c48_final_system_route_c": "So six of nine being moved never happens again, you write a clause protecting dissenting members in HR.",
    "c48_evidence_turn_attach": "So the members don’t sign without knowing about the two unlisted pages, you refuse to sign until the side agreement is attached to the minutes.",
    "c48_evidence_turn_hold": "Because all five members need to see these two pages together in one room, you keep the side agreement in hand and reveal it just before the vote.",
    "c48_evidence_turn_founder": "Because the CEO may not know about a promise to wind up the company, you show LoopNow’s CEO Min Harang the side agreement first and decide together.",
    "c48_hub_evidence_turn": "Holding the clue against the page numbers of the Roundhill investment contract, you check whether an unlisted page is tucked in.",
    "c48_engine_evidence_turn": "Holding the clue against the page numbers of the Roundhill investment contract, you check whether an unlisted page is tucked in.",
    "c48_pen_evidence_turn": "Holding the clue against the page numbers of the Roundhill investment contract, you check whether an unlisted page is tucked in.",
    "c48_route_system_evidence_turn": "Holding the clue against the page numbers of the Roundhill investment contract, you check whether an unlisted page is tucked in.",
    "c48_start_warm_visit": "Saying people come before the file, you meet LoopNow’s CEO on site tonight.",
    "c48_start_warm_compare": "To see whether the same contract came back under a new name, you check the clauses line by line against the 2023-0412 contract.",
    "c48_start_warm_score": "With little night left before 9 a.m., you use NOAH’s Grade A as the baseline and cut review time.",
    "c48_start_warm_signature": "Saying you must know the faces before you sign, you take songpyeon with Do Yoonha and go meet LoopNow’s people first.",
    "c48_start_record_visit": "Saying people come before the file, you meet LoopNow’s CEO on site tonight.",
    "c48_start_record_compare": "To see whether the same contract came back under a new name, you check the clauses line by line against the 2023-0412 contract.",
    "c48_start_record_score": "With little night left before 9 a.m., you use NOAH’s Grade A as the baseline and cut review time.",
    "c48_start_record_signature": "Saying you must compare on paper, not from memory, you take out the original 2023-0412 contract and lay it beside Article 7.",
    "c48_start_rush_visit": "Saying people come before the file, you meet LoopNow’s CEO on site tonight.",
    "c48_start_rush_compare": "To see whether the same contract came back under a new name, you check the clauses line by line against the 2023-0412 contract.",
    "c48_start_rush_score": "With little night left before 9 a.m., you use NOAH’s Grade A as the baseline and cut review time.",
    "c48_start_rush_signature": "Saying you must see everything tied to the 29 billion won, you get Bridge’s full term sheet from Oh Jinwoo tonight."
  },
  "pack": {
    "clue": {
      "text": "At the back of the Roundhill investment contract were two pages missing from the table of contents. If Article 7 blows, Roundhill buys KD Capital’s loan claim at 41% of principal, and the adviser for the wind-down is Yoon Sanghyuk."
    },
    "outcomes": {
      "c48_after_warm": {
        "tag": "The ending where you stayed beside them",
        "title": "The night the committee ended, you shared songpyeon at the bookshop",
        "text": "No one said a word about paperwork. Lim Kyungsoo’s signature practice book and fountain pen lay in the middle of the table, and everyone scattered only after the last train had gone."
      },
      "c48_after_record": {
        "tag": "The ending where you left a record",
        "title": "The committee’s conclusion and your opinion were filed as a document",
        "text": "This time, anyone can look up who wrote a name in the signature field. It is the first document where a member’s opinion stayed as written, not returned."
      },
      "c48_after_rush": {
        "tag": "The ending where you ran ahead",
        "title": "You left the meeting room and went straight back to the office",
        "text": "On a darkened floor, you turned the approvals from Yoon Sanghyuk’s time one page at a time. To the songpyeon photos in the group chat, you left only one reply: 'Later.'"
      }
    },
    "continuityChallenges": {
      "c47_after_warm": {
        "title": "Signing with the people of the full-moon night",
        "text": "The people who stayed up with you at the rice cake shop are beside you for this file too. Have them read the file with you before you sign, and trust stands before the signature does."
      },
      "c47_after_record": {
        "title": "Turning the cleanup document into the page before",
        "text": "The 2nd compensation standard was a document written after the collapse. Reframe the table before the same shape collapses, and carry that standard over into the review conditions."
      },
      "c47_after_rush": {
        "title": "Filling the night you left first with a record",
        "text": "The night you left the rice cake shop first left no record at all. This time, attach your grounds to the signature so anyone who reads it can read fairness in it."
      }
    }
  }
};
