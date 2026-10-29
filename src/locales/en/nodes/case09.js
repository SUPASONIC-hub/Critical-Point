/**
 * 사건 09 (src/nodes/case09.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c9_start": {
      "title": "72 Hours, Again",
      "text": "3 years ago KD Bank lent FlowOn 31 billion won. Now FlowOn faces another creditors’ committee vote. This time the agenda is not rehabilitation but liquidation. 1,140 employees, 280 suppliers. Pushing for liquidation is Bridge Bank, which holds the senior collateral, and the credit officer it sent as its representative is Kwon Dohyun, the founder’s eldest son. Do Yoonha sets down the list of creditors. 'He turned down the family business and went to a bank. Now he’s come from the bank’s side to close his father’s company.'",
      "memo": [
        "60 hours to the creditors’ vote; agenda: liquidation",
        "1,140 employees · 280 suppliers",
        "Liquidation led by Bridge Bank, senior collateral holder",
        "Bridge Bank’s representative credit officer Kwon Dohyun = founder’s eldest son"
      ],
      "choices": {
        "c9_start_meet": {
          "label": "Meet Kwon Dohyun alone at a Yeouido café first"
        },
        "c9_start_table": {
          "label": "Refile the rehabilitation plan formally with Do Yoonha"
        },
        "c9_start_floor": {
          "label": "Visit the night shift at dawn and gather floor numbers"
        },
        "reframe": {
          "label": "Add the cost nobody counted"
        }
      },
      "place": "FlowOn HQ, 8th-floor situation room",
      "clock": "Creditors’ vote in 60h",
      "question": "The company from the 72 hours is up for liquidation this time. Where do you start?",
      "lead": "The same situation room, 3 years on. On the whiteboard, the '72h' someone wrote back then is still there, half erased."
    },
    "c9_ledger": {
      "title": "Kwon Dohyun’s Ledger",
      "text": "A Yeouido café before dawn. Kwon Dohyun draws columns on a blank sheet and divides it into boxes. Bridge Bank, KD Bank, employees, suppliers, the uncles, and you. 'You said you’d help me. Then fill in your box first. What you lose by this and what you gain. If that box is empty, I’ll read your offer as pity and refuse it.' His own box is already filled in. Lose: family. Gain: nothing.",
      "memo": [
        "Kwon Dohyun’s box: lose 'family', gain 'nothing'",
        "Your box: still blank",
        "Bridge Bank recovery rate: rehabilitation 61%, liquidation 78%",
        "If he backs rehabilitation, Bridge Bank may remove Kwon Dohyun"
      ],
      "choices": {
        "c9_ledger_honest": {
          "label": "Write what you stand to lose in your box, nothing hidden"
        },
        "c9_ledger_blank": {
          "label": "Leave your box blank and tell him only about the 1,140"
        },
        "c9_ledger_price": {
          "label": "Write his testimony into your box as your gain"
        },
        "reframe": {
          "label": "Add the cost nobody counted"
        },
        "c9_ledger_evidence_turn": {
          "label": "Trace the 78% recovery rate"
        }
      },
      "place": "Yeouido café before dawn",
      "clock": "Creditors’ vote in 52h",
      "question": "Kwon Dohyun says he’ll read an empty box as pity. What do you write in your box?",
      "lead": "Kwon Dohyun came 20 minutes early and is squaring the corners of his printouts."
    },
    "c9_family": {
      "text": "Ban Jaewook spreads out a printout of FlowOn’s books from 3 years ago. The number no one could trace during those 72 hours: a debt-to-equity ratio of 179.6%. It was made by CEO Kwon Seungwoo and CFO Bae Sungjun, Kwon Dohyun’s uncle and his aunt’s husband. Accounting fraud that inflated the books, and golf memberships bought with company money. Advisory fees paid out to Haeon Partners. One set of books holds breach of trust. It holds embezzlement too. Kwon Dohyun turns the pages one by one, then stops. 'My uncle paid my college tuition. Now I know where that money came from.'",
      "memo": [
        "Books behind the 179.6% ratio, written by Kwon Seungwoo · Bae Sungjun",
        "3 golf memberships on company money, advisory fees to Haeon Partners",
        "Grounds met for a complaint: breach of trust · embezzlement · accounting fraud",
        "A complaint makes Kwon Dohyun a witness at his family’s trial"
      ],
      "choices": {
        "c9_family_charge": {
          "label": "File charges against Kwon Seungwoo and Bae Sungjun"
        },
        "c9_family_restore": {
          "label": "Skip charges; make them pay it back from their assets"
        },
        "c9_family_choice": {
          "label": "Hand the books to Kwon Dohyun and wait for his call"
        },
        "reframe": {
          "label": "Add the cost nobody counted"
        },
        "c9_family_evidence_turn": {
          "label": "Trace the 78% recovery rate"
        }
      },
      "place": "Hoegi-dong bookshop, 2nd floor · stacks of ledgers",
      "clock": "Creditors’ vote in 40h",
      "question": "The 179.6% was made by Kwon Dohyun’s uncle and his aunt’s husband. What do you do about them?",
      "lead": "Among the binders of watermarked printouts Lim Kyungsoo kept for 3 years, Ban Jaewook has found FlowOn’s books from 3 years ago."
    },
    "c9_timing": {
      "title": "Inspection Day",
      "text": "Oh Jinwoo is back at his desk on the 4th floor. Han Seoyun filed a request to withdraw his resignation, and his seat is still his. Ban Jaewook’s resignation never left the Internal Audit head’s drawer. He hasn’t shaved, but he came in carrying an empty lunch box. He circles a day on the calendar. 'The Financial Supervisory Service goes into Bridge Bank at 9 tomorrow morning. A regular inspection. If we file the trace sheet tonight, the inspection team looks at the deal that bought the collateral ranking from day one.' If Bridge Bank is sanctioned, the liquidation vote loses its force. Its senior collateral gets frozen. But Kwon Dohyun works at that bank.",
      "memo": [
        "FSS regular inspection of Bridge Bank starts: tomorrow 09:00",
        "A tip before it starts makes the improperly gained collateral the first item",
        "If sanctioned, Bridge Bank’s vote for liquidation can be challenged",
        "Kwon Dohyun had no part in the collateral deal but sits in the same department"
      ],
      "choices": {
        "c9_timing_warn": {
          "label": "Call Kwon Dohyun and warn him before you file"
        },
        "c9_timing_strike": {
          "label": "File the trace sheet with Oh Jinwoo the night before"
        },
        "c9_timing_after": {
          "label": "Erase Oh Jinwoo’s circle and file after the vote"
        },
        "reframe": {
          "label": "Add the cost nobody counted"
        },
        "c9_timing_evidence_turn": {
          "label": "Trace the 78% recovery rate"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Creditors’ vote in 26h",
      "question": "Filing the trace sheet the night before the inspection shakes the liquidation vote. When do you file it?",
      "lead": "Oh Jinwoo is back on the 4th floor with an empty lunch box. On the calendar, tomorrow’s 09:00 is circled."
    },
    "c9_final": {
      "title": "Rescue or Punish",
      "text": "Kwon Dohyun lays two sheets side by side. On the left, the sheet that saves FlowOn: a debt-to-equity swap. With it, every job carried over. On the right, the sheet that punishes those who broke it: the complaint, the trace sheet, and the tip to the inspection team. 'Both are correct math. The problem is that when both sheets are on one table, the creditors get scared.' He holds out a pen. 'Which sheet will you sign? Or both?'",
      "memo": [
        "Rescue sheet: debt-to-equity swap + jobs carried over for all 1,140",
        "Punish sheet: complaint against Kwon Seungwoo · Bae Sungjun + tip on Bridge Bank",
        "Filing both together may delay the vote",
        "Kwon Dohyun says he’ll sign his own name either way"
      ],
      "choices": {
        "c9_final_both": {
          "label": "Sign both sheets with the pen Kwon Dohyun offers"
        },
        "c9_final_punish": {
          "label": "File only the complaint and trace sheet; leave the rest to court"
        },
        "c9_final_rescue": {
          "label": "File only the rescue sheet and fold away the complaint"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "FlowOn creditors’ meeting room",
      "clock": "Creditors’ vote in 3h",
      "question": "The rescue sheet and the punish sheet lie side by side. Which one do you sign?",
      "lead": "Kwon Dohyun takes out two pens and sets one in front of you. Both carry his father’s company logo."
    },
    "c9_aftershock": {
      "title": "Morning for the Night Shift",
      "text": "Four a.m. the day after the vote, the FlowOn fulfillment center. Kang Taemin, the night-shift foreman who handed you cup noodles that night during the 72 hours, recognizes you. 'I told you to come in the daytime.' He laughs and pours hot water into two cups. The company’s name may change, but the boxes still move this morning. While the three minutes pass, he asks. 'So where to now?'",
      "memo": [
        "Creditors’ vote result posted on the floor",
        "All 380 night-shift workers clocked in",
        "Kwon Dohyun asked for a copy of the attendance list",
        "Order to return to Yeongdong Branch still stands"
      ],
      "choices": {
        "c9_after_court": {
          "label": "Go testify in court and to the inspectors to the end"
        },
        "c9_after_stay": {
          "label": "Stay at the floor talks until the jobs are carried over"
        },
        "c9_after_return": {
          "label": "Finish the noodles and quietly return to Yeongdong Branch"
        }
      },
      "place": "FlowOn fulfillment center · night-shift break room",
      "clock": "Day after the vote · 4 a.m.",
      "question": "Pouring water into the cup noodles, Kang Taemin asks where you’re going now. Where do you go?"
    },
    "c9_calc": {
      "title": "Two Calculators",
      "text": "As the café is about to close, Kwon Dohyun takes out a second calculator. 'Let’s each run it from our own side. If the numbers match, I’ll start trusting you.' For 20 minutes the two of you tap in silence. The results differ by 300 million won. Kwon Dohyun smiles for the first time. 'Is that gap goodwill, or a mistake?'",
      "memo": [
        "Gap between the two results: 300 million won",
        "Gap comes from how severance pay is calculated",
        "Kwon Dohyun wants the reason for the gap"
      ],
      "choices": {
        "c9_calc_choice_3": {
          "label": "Write the gap off as rounding error and move on"
        },
        "c9_calc_choice_2": {
          "label": "Pull out the rate table and check it line by line"
        },
        "c9_calc_choice_1": {
          "label": "Settle the 300 million won gap in the workers’ favor"
        }
      },
      "place": "Yeouido café before dawn · window seat",
      "clock": "Creditors’ vote in 50h",
      "question": "Two calculations to save the same company differ by 300 million won. How do you close the gap?"
    },
    "c9_wedding": {
      "title": "The Invitation",
      "text": "A wedding invitation fills Kwon Dohyun’s phone lock screen. Next month. Beside the parents’ table, seats for his uncle and aunt are already set. Do Yoonha sees the screen and goes out for coffee, and comes back much later with three cups. 'I got the sweetest ones. Feels like that kind of day.'",
      "memo": [
        "Kwon Dohyun’s wedding in 5 weeks",
        "Family table includes Kwon Seungwoo and his wife",
        "A complaint could hit the news before the wedding"
      ],
      "choices": {
        "c9_wedding_choice_3": {
          "label": "Leave the subject alone and just finish today’s work"
        },
        "c9_wedding_choice_1": {
          "label": "Work out together if the complaint can wait till after"
        },
        "c9_wedding_choice_2": {
          "label": "Keep the complaint timetable as is, whatever the date"
        }
      },
      "place": "Bridge Bank head office, Yeouido · 1st-floor lobby",
      "clock": "Creditors’ vote in 32h",
      "question": "His uncle has a seat at the family table at Kwon Dohyun’s wedding. When do you file the complaint?"
    },
    "c9_night": {
      "title": "The Office at 2 A.M.",
      "text": "Two a.m., Trigger Lab, 4th floor. Han Seoyun is printing her statement and stops in front of the printer. Oh Jinwoo has fallen asleep on the sofa, and Ban Jaewook lays his own jacket over him. Do Yoonha puts water on for cup noodles. Han Seoyun speaks quietly. 'This is the first time I’ve seen five people in this room sitting on the same side.'",
      "memo": [
        "Han Seoyun’s statement printed",
        "7 hours to the tip deadline",
        "Five people looking at the same file"
      ],
      "choices": {
        "c9_night_choice_1": {
          "label": "Let the sleepers sleep and split up the rest of the work"
        },
        "c9_night_choice_3": {
          "label": "Call it a night and send everyone home"
        },
        "c9_night_choice_2": {
          "label": "Check the tip papers against the checklist once more"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "2 a.m. · 7h to the tip deadline",
      "question": "Tonight five people sit on the same side for the first time. How do you finish the rest?"
    },
    "c9_calc_reaction": {
      "title": "The Name of 300 Million",
      "text": "ECHO brings up the breakdown of the 300 million won. The gap is the accrued severance of 11 logistics workers who have worked 22 years. In Kwon Dohyun’s math it vanishes the moment the company changes hands; in yours it is paid in full. 'Two sheets that save the same company split over 11 people’s 22 years.'",
      "memo": [
        "11 people, 22 years",
        "A number to nail into the transfer terms"
      ],
      "choices": {
        "c9_calc_reaction_choice_1": {
          "label": "Nail the 11 workers’ severance into the transfer terms"
        },
        "c9_calc_reaction_choice_2": {
          "label": "Check the legal basis of the forfeiture clause first"
        },
        "c9_calc_reaction_choice_3": {
          "label": "Keep it as a concession for the transfer talks"
        }
      },
      "place": "Yeouido café before dawn · window seat",
      "clock": "Creditors’ vote in 49h",
      "question": "The 300 million won is severance for 11 people who worked 22 years. Where do you put this number?"
    },
    "c9_wedding_reaction": {
      "title": "The Family Table",
      "text": "Kwon Dohyun turns his phone face down. 'If I keep my uncle off the family table, my bride will ask why. I don’t think I can tell her.' He sips the sweet coffee and winces. 'But I can’t weigh 1,140 people against what my tuition cost, either.'",
      "memo": [
        "Who sits at the family table",
        "A reason he can’t bring himself to say"
      ],
      "choices": {
        "c9_wedding_reaction_choice_2": {
          "label": "Follow the legal timetable, wedding or not"
        },
        "c9_wedding_reaction_choice_3": {
          "label": "Draw a line: you stay out of family matters"
        },
        "c9_wedding_reaction_choice_1": {
          "label": "Stand by him so he can tell his bride himself"
        }
      },
      "place": "Bridge Bank head office, Yeouido · 1st-floor lobby",
      "clock": "Creditors’ vote in 31h",
      "question": "Kwon Dohyun says he can’t bring himself to tell his bride why. Where do you stand?"
    },
    "c9_night_reaction": {
      "title": "The Jacket",
      "text": "Ban Jaewook stands at the window without his jacket. 'I spent 20 years cutting people. Tonight, for the first time, I’m writing papers that keep people.' He tears a blank page from his notebook and hands it over. On paper from the notebook that once held 47 names, there is one new line. '1,140 -- kept.'",
      "memo": [
        "Papers that cut, papers that keep",
        "One line at the very front of the vote file"
      ],
      "choices": {
        "c9_night_reaction_choice_2": {
          "label": "Keep the page separately; it isn’t evidence"
        },
        "c9_night_reaction_choice_3": {
          "label": "Save the feelings for later and meet the deadline"
        },
        "c9_night_reaction_choice_1": {
          "label": "Pin that page to the front of the vote file"
        }
      },
      "place": "Trigger Lab, 4th floor · by the window",
      "clock": "3 a.m. · 6h to the tip deadline",
      "question": "Ban Jaewook hands you a notebook page that says '1,140 -- kept'. What do you do with it?"
    },
    "c9_branch_father": {
      "title": "Nursing Home, 3rd Floor",
      "text": "Kwon Dohyun puts off his decision and goes to the nursing home. You go with him. The founder, Kwon Taeho, doesn’t recognize his son and asks you instead. 'Are you the new dispatcher? Did the night-shift kids get fed?' Kwon Dohyun looks out the window. 'The company my father remembers isn’t 1,140 people. It’s when there were thirty. He says he knew every name back then.'",
      "memo": [
        "Founder Kwon Taeho, 2 years since a dementia diagnosis",
        "11 of the first 30 employees still on staff",
        "Those 11 are the people behind the 300 million won gap"
      ],
      "choices": {
        "c9_branch_father_a": {
          "label": "Put the 11 early employees’ names on the plan’s first page"
        },
        "c9_branch_father_c": {
          "label": "Take the talks for a day so he can stay with his father"
        },
        "c9_branch_father_b": {
          "label": "Set feelings aside and push to decide on charges today"
        }
      },
      "place": "Ilsan nursing home, 3rd floor · hallway",
      "clock": "Creditors’ vote in 36h",
      "question": "The founder doesn’t know his son and worries about feeding the night shift. What do you decide here?"
    },
    "c9_branch_father_follow": {
      "title": "Photo of the 30",
      "text": "In the hospital parking lot, night-shift foreman Kang Taemin is waiting. Kwon Dohyun called him. Kang Taemin holds out a worn photo. The company’s first year: 30 people in front of two trucks. At the far end stands a young Kwon Dohyun. 'When the boss’s son said he wouldn’t take over, we were the happiest. We didn’t want him living like us.'",
      "memo": [
        "First-year photo: 30 employees and a young Kwon Dohyun",
        "Kang Taemin is 1 of the 11 early employees",
        "Kwon Dohyun hesitates to put the photo in the creditors’ file"
      ],
      "choices": {
        "c9_branch_father_follow_b": {
          "label": "Give the photo back and fight with numbers only"
        },
        "c9_branch_father_follow_c": {
          "label": "Call the 11 to the vote in person"
        },
        "c9_branch_father_follow_a": {
          "label": "Quietly slip the photo into the back of the file"
        }
      },
      "place": "Ilsan nursing home · parking lot",
      "clock": "Creditors’ vote in 34h",
      "question": "There is a photo of the 30 from the first year. How do you use it?"
    },
    "c9_route_system": {
      "title": "The Third Sheet",
      "text": "Two sheets will go before the creditors’ committee. One saves FlowOn, the other punishes those who broke it. You set the cost nobody counted beside them. ECHO takes it. A third table opens. A sheet no creditor has written: what 1,140 families pay if the company is liquidated. Switching health insurance, overdue student loans, a chain of supplier bankruptcies. The total is 2.3 times what Bridge Bank gains by liquidating.",
      "memo": [
        "Estimated cost to families · suppliers under liquidation: 2.3 times the extra recovery",
        "The creditors’ sheets have no box for this",
        "An estimate, not legally binding"
      ],
      "choices": {
        "c9_route_system_families": {
          "label": "Show this table to the family representatives first"
        },
        "c9_route_system_add": {
          "label": "Submit the third sheet as an official creditors’ document"
        },
        "c9_route_system_quiet": {
          "label": "Close the table and fight with the two sheets only"
        },
        "c9_route_system_evidence_turn": {
          "label": "Trace the 78% recovery rate"
        }
      },
      "place": "FlowOn creditors’ meeting room · document terminal",
      "clock": "Creditors’ vote in 12h",
      "question": "What families pay under liquidation is 2.3 times the recovery gain. What do you do with this third table?"
    },
    "c9_final_system_route": {
      "title": "The Sheet No One Wrote",
      "text": "Six hours to the creditors’ vote. On the document terminal, the third sheet sits open, unsaved. It is what 1,140 families and the suppliers pay if the company closes, and neither of the creditors’ two sheets has a box for it. Beside the table’s title, ECHO writes 'estimate'. 'Estimate doesn’t mean wrong. It’s an estimate, so no one signed it, and with no signature it never reached a meeting.'",
      "memo": [
        "Third sheet: author box blank",
        "A cost missing from the creditors’ file",
        "6 hours to the creditors’ vote"
      ],
      "choices": {
        "c9_final_system_route_a": {
          "label": "Put all three sheets to the vote as one bundle"
        },
        "c9_final_system_route_b": {
          "label": "Cover the third table and bargain on recovery rates only"
        },
        "c9_final_system_route_c": {
          "label": "Sign your name as author at the foot of the third table"
        }
      },
      "place": "FlowOn creditors’ meeting room · document terminal",
      "clock": "Creditors’ vote in 6h",
      "question": "There is now one more sheet no one wrote. How do you bring it to the vote?"
    },
    "c9_evidence_turn": {
      "title": "Where the Recovery Rate Came From",
      "text": "With the clues matched, the source of the 78% liquidation recovery rate Bridge Bank put forward comes to light. The appraisal firm that valued the collateral uses the same tax agent as Haeon Partners. The very number that says liquidation pays came from the same hand as the trace sheet.",
      "memo": [
        "Appraisal firm behind the 78% rate = same tax agent as Haeon",
        "Reappraisal would likely drop the liquidation recovery rate to 64%",
        "Rehabilitation could come out ahead of liquidation"
      ],
      "choices": {
        "c9_evidence_turn_share": {
          "label": "Show Kwon Dohyun first and let him raise it in his name"
        },
        "c9_evidence_turn_hold": {
          "label": "Keep the source in mind and reveal it only at the vote"
        },
        "c9_evidence_turn_reappraise": {
          "label": "Demand a collateral reappraisal to redo the rate"
        }
      },
      "place": "FlowOn creditors’ meeting room · review desk",
      "clock": "Creditors’ vote in 5h",
      "question": "The recovery rate that favors liquidation came from the same hand as the trace sheet. How do you use this source?"
    },
    "c9_start_law": {
      "title": "72 Hours for the One Who Made a Record",
      "text": "You got the trace sheet approved under Branch Manager Na Junhyuk’s employee ID and made it an official record. The investigation started slowly, and in the meantime FlowOn’s creditors’ committee leaned fast toward liquidation. There are 1,140 employees, and the man Bridge Bank sent to push liquidation is Kwon Dohyun, the founder’s eldest son. The record remains, but a record doesn’t save people first.",
      "memo": [
        "Investigation request filed; start date unknown",
        "Creditors’ vote agenda: liquidation",
        "Kwon Dohyun asked to see a copy of the record"
      ],
      "choices": {
        "c9_start_law_table": {
          "label": "Refile the rehabilitation plan formally with Do Yoonha"
        },
        "c9_start_law_floor": {
          "label": "Visit the night shift at dawn and gather floor numbers"
        },
        "c9_start_law_signature": {
          "label": "Submit the filed investigation request to the creditors"
        },
        "c9_start_law_meet": {
          "label": "Meet Kwon Dohyun alone at a Yeouido café first"
        },
        "c9_start_law_reframe": {
          "label": "Add the cost nobody counted"
        }
      },
      "place": "FlowOn HQ, 8th-floor situation room",
      "clock": "Creditors’ vote in 60h",
      "question": "The investigation is slow and the vote is fast. Where do you start looking for the people the record couldn’t save?",
      "lead": "The trace sheet became an official record, but the investigation’s start date is still blank. Meanwhile the liquidation item came up first."
    },
    "c9_start_friend": {
      "title": "72 Hours for the One Who Went After a Friend",
      "text": "You came up to Seoul to find Oh Jinwoo, who had stopped answering. He had the trace sheet pinned to the wall of his tiny rented room. The day after you two shared a bowl of rice soup, an item reaches the creditors’ committee. The liquidation of FlowOn. The man Bridge Bank sent to push it is Kwon Dohyun, the founder’s eldest son; 1,140 employees are at stake. Oh Jinwoo stands first. 'This time let’s go together. Not for revenge. For something else.'",
      "memo": [
        "Oh Jinwoo puts his tracking files in joint custody",
        "Creditors’ vote agenda: liquidation",
        "Oh Jinwoo and Kwon Dohyun were college classmates"
      ],
      "choices": {
        "c9_start_friend_signature": {
          "label": "Ask Oh Jinwoo to meet Kwon Dohyun first"
        },
        "c9_start_friend_table": {
          "label": "Refile the rehabilitation plan formally with Do Yoonha"
        },
        "c9_start_friend_floor": {
          "label": "Visit the night shift at dawn and gather floor numbers"
        },
        "c9_start_friend_meet": {
          "label": "Meet Kwon Dohyun alone at a Yeouido café first"
        },
        "c9_start_friend_reframe": {
          "label": "Add the cost nobody counted"
        }
      },
      "place": "FlowOn HQ, 8th-floor situation room",
      "clock": "Creditors’ vote in 60h",
      "question": "Oh Jinwoo wants to do something other than revenge. Where do you start?",
      "lead": "It’s the day after the rice soup near his rented room. Only now does Oh Jinwoo mention that Kwon Dohyun was his college classmate."
    },
    "c9_start_blade": {
      "title": "72 Hours for the One Who Held the Blade Alone",
      "text": "You held the trace sheet alone and waited, and now the time to use it has come. An item has reached the creditors’ committee. The liquidation of FlowOn. Bridge Bank, which is pushing liquidation, is on one line of the trace sheet. The man it sent is Kwon Dohyun, the founder’s eldest son, and FlowOn has 1,140 employees. A blade held alone is fast, but no one will testify that it was used fairly.",
      "memo": [
        "You alone keep the original trace sheet",
        "Creditors’ vote agenda: liquidation",
        "No one knows what the blade is for"
      ],
      "choices": {
        "c9_start_blade_meet": {
          "label": "Meet Kwon Dohyun alone at a Yeouido café first"
        },
        "c9_start_blade_table": {
          "label": "Refile the rehabilitation plan formally with Do Yoonha"
        },
        "c9_start_blade_floor": {
          "label": "Visit the night shift at dawn and gather floor numbers"
        },
        "c9_start_blade_signature": {
          "label": "Show Kwon Dohyun one line of the sheet and watch him"
        },
        "c9_start_blade_reframe": {
          "label": "Add the cost nobody counted"
        }
      },
      "place": "FlowOn HQ, 8th-floor situation room",
      "clock": "Creditors’ vote in 60h",
      "question": "The bank pushing liquidation is on the trace sheet only you hold. Where do you start?",
      "lead": "The time has come to use the trace sheet you held alone. The trouble is, a blade can punish but cannot save."
    }
  },
  "echoReplies": {
    "c9_start_meet": "Across the café table, Kwon Dohyun turns his Bridge Bank ID card face down. He has set the bank’s name aside for now, but this meeting is in no minutes.",
    "c9_start_table": "When you file the plan, the creditors’ secretariat gives it an intake number. A plan inside formal procedure is as slow as it is steady, and the 60 hours run down fast.",
    "c9_start_floor": "In the night-shift break room, the workers count the day’s volume and the missing hands on their fingers. A box missing from the sheets gets filled, but numbers gathered at dawn are read last at the afternoon meeting.",
    "c9_ledger_honest": "With your box filled, Kwon Dohyun reads the proposal to the end for the first time. The sheet listing what you lose can be seen by anyone later.",
    "c9_ledger_price": "When you write in the reward, Kwon Dohyun nods and picks up a pen. Now it is a deal, and a deal is more reliable than pity, and colder.",
    "c9_ledger_blank": "Seeing the blank, Kwon Dohyun caps his pen. To you it was goodwill; to him it read as a promise from someone who hadn’t done the math.",
    "c9_family_charge": "As you write the two names on the complaint, the 179.6% gets its authors for the first time. The day it is filed, Kwon Dohyun becomes a witness at his family’s trial.",
    "c9_family_restore": "The two men hand over the 3 golf memberships first, and the damage starts to fill in fast. The day the men who inflated the books stand in court moves that much further away.",
    "c9_family_choice": "Once you hand over the books, Kwon Dohyun keeps one page open for a long time and says nothing. The decision is his now, and while you wait for it, the vote draws closer.",
    "c9_timing_strike": "Once the tip is filed, Oh Jinwoo draws another line over the circle on the calendar. Day one of the inspection changes, and Kwon Dohyun, in the same department, sits next to the targets from day one.",
    "c9_timing_warn": "Kwon Dohyun answers and only breathes for a long while, then says just 'Understood.' Now he can prepare, and among those preparing are people who want to erase their tracks.",
    "c9_timing_after": "With the circle erased, Oh Jinwoo just fiddles with the lid of his lunch box. A tip after the vote doesn’t shake the vote, and if liquidation passes that day, the 1,140 are inside that decision.",
    "c9_final_both": "As you sign both sheets, chairs scrape on the creditors’ side. The vote may be delayed, but a delayed vote records both why you saved and why you punished.",
    "c9_final_rescue": "With only the rescue sheet filed, the vote passes smoothly. The folded complaint becomes next month’s job, and next month is always busy.",
    "c9_final_punish": "With the complaint and the trace sheet filed, not one line of the math is wrong. But the court that takes over the rehabilitation won’t read the 1,140 names one by one.",
    "c9_after_stay": "The one who stays becomes the promise’s witness. At Yeongdong Branch, one more delayed-return notice piles up.",
    "c9_after_court": "Testimony turns the sheets into fact. The court doesn’t accept cup noodles at four a.m. as evidence.",
    "c9_after_return": "Going back quietly, you hear on the news how the job transfer ended. Kang Taemin wonders for a moment whether to set out two cups next time too.",
    "c9_calc_choice_1": "Settling toward severance makes the answer goodwill. Kwon Dohyun will ask whose money that goodwill was calculated with.",
    "c9_calc_choice_2": "Checking line by line may give the answer: a mistake. Finding it costs an hour before dawn.",
    "c9_calc_choice_3": "Calling it rounding error is easy for you both. The 300 million won doesn’t vanish; it drops out of someone’s severance.",
    "c9_wedding_choice_1": "Working out the timing together, he isn’t alone. The 5 weeks you move it also give someone time to fix the books.",
    "c9_wedding_choice_2": "Keeping the timetable, the complaint holds steady. The story may run before the wedding.",
    "c9_wedding_choice_3": "Leaving it unsaid, today ends. Tomorrow the invitation is still on the lock screen.",
    "c9_night_choice_1": "A night split up runs long. Whoever wakes in the morning finds their share already done.",
    "c9_night_choice_2": "Papers checked once more don’t come back from the inspectors. Of the 7 hours left, 2 go here.",
    "c9_night_choice_3": "The ones sent home get to sleep. In the morning one person finishes the tip papers alone.",
    "c9_calc_reaction_choice_1": "The 300 million won you nail down becomes a cost of the rehabilitation plan. The creditors subtract it from the recovery rate.",
    "c9_calc_reaction_choice_2": "Checking the legal basis makes the fight precise. Meanwhile the 11 wait for the result.",
    "c9_calc_reaction_choice_3": "A concession smooths the talks. The severance used as a card is someone’s 22 years.",
    "c9_wedding_reaction_choice_1": "With you beside him, he can say it. You become the most awkward guest at someone else’s wedding.",
    "c9_wedding_reaction_choice_2": "The legal timetable doesn’t waver. Kwon Dohyun carries his wavering alone.",
    "c9_wedding_reaction_choice_3": "Drawing the line leaves you outside the sheets. Whether that is what he wanted, you don’t know.",
    "c9_night_reaction_choice_1": "The page pinned at the front is the first thing the creditors read. It’s the first time a line that isn’t a number has entered a vote file.",
    "c9_night_reaction_choice_2": "A page kept apart needs no explaining to anyone. So it lasts.",
    "c9_night_reaction_choice_3": "The deadline is met. Ban Jaewook stands at the window a little longer, then leaves without his jacket.",
    "c9_branch_father_a": "With 11 names on the first page, the plan becomes a document about people. The creditors turn that page and look at the numbers first.",
    "c9_branch_father_b": "Deciding today keeps you on time for the vote. Within an hour of leaving his father’s room, Kwon Dohyun has to decide whether to charge his family.",
    "c9_branch_father_c": "Taking the talks for him costs you a day. Kwon Dohyun hears the names of the 30 his father remembers once more.",
    "c9_branch_father_follow_a": "No one mentions the photo at the back. Only those who read to the end see it.",
    "c9_branch_father_follow_b": "Fighting with numbers only leaves no opening for rebuttal. The 30 in the photo go back into a drawer.",
    "c9_branch_father_follow_c": "The 11 standing at the vote are the strongest evidence. Each of them loses a day’s wages.",
    "c9_route_system_add": "As an official document, the creditors have to rebut the number. To rebut it, they have to read it first.",
    "c9_route_system_quiet": "Fighting with two sheets only, the meeting ends in the language of recovery rates. The cost to the 1,140 stays out of the minutes again.",
    "c9_route_system_families": "Shown it first, the families look for their own household’s numbers in the table. A few correct it, saying the estimate is lower than the truth.",
    "c9_final_system_route_a": "As one bundle, the cost paid stands beside the cost of saving and the cost of punishing. The creditors pause longest on the third sheet.",
    "c9_final_system_route_b": "Talking only recovery rates speeds up the bargaining. The costs that were on the table become bills sent to each home separately.",
    "c9_final_system_route_c": "With your name on it, someone now answers for the estimate. The day the number proves wrong, you are the first one called in.",
    "c9_evidence_turn_reappraise": "The reappraisal corrects the number. The side rushing liquidation hates nothing more than the time it takes.",
    "c9_evidence_turn_hold": "A source revealed at the vote is dramatic. Dramatic evidence halts the meeting, and a halted meeting sets a new date.",
    "c9_evidence_turn_share": "Raising it means he takes aim at his own bank. That math is what he does best.",
    "c9_ledger_evidence_turn": "Pair up the numbers, and the liquidation sheet is no neutral figure but a conclusion someone bought in advance.",
    "c9_family_evidence_turn": "Pair up the numbers, and the liquidation sheet is no neutral figure but a conclusion someone bought in advance.",
    "c9_timing_evidence_turn": "Pair up the numbers, and the liquidation sheet is no neutral figure but a conclusion someone bought in advance.",
    "c9_route_system_evidence_turn": "Pair up the numbers, and the liquidation sheet is no neutral figure but a conclusion someone bought in advance.",
    "case09_memory_system": "However you look, the creditors’ file has no box for the table you reframed. ECHO opens a third table in that empty space.",
    "case09_memory_evidence": "Overlap the dates written, and the name of whoever calculated the liquidation recovery rate appears. They use the same tax agent you saw on the trace sheet.",
    "c9_start_law_meet": "Across the café table, Kwon Dohyun turns his Bridge Bank ID card face down. He has set the bank’s name aside for now, but this meeting is in no minutes.",
    "c9_start_law_table": "When you file the plan, the creditors’ secretariat gives it an intake number. A plan inside formal procedure is as slow as it is steady, and the 60 hours run down fast.",
    "c9_start_law_floor": "In the night-shift break room, the workers count the day’s volume and the missing hands on their fingers. A box missing from the sheets gets filled, but numbers gathered at dawn are read last at the afternoon meeting.",
    "c9_start_law_signature": "With the investigation request attached to the creditors’ file, the side rushing liquidation has to explain itself. While it explains, the 60 hours run down.",
    "c9_start_friend_meet": "Across the café table, Kwon Dohyun turns his Bridge Bank ID card face down. He has set the bank’s name aside for now, but this meeting is in no minutes.",
    "c9_start_friend_table": "When you file the plan, the creditors’ secretariat gives it an intake number. A plan inside formal procedure is as slow as it is steady, and the 60 hours run down fast.",
    "c9_start_friend_floor": "In the night-shift break room, the workers count the day’s volume and the missing hands on their fingers. A box missing from the sheets gets filled, but numbers gathered at dawn are read last at the afternoon meeting.",
    "c9_start_friend_signature": "The first job for a man who set down revenge is persuading a friend. If he fails, both of them get a little lonelier.",
    "c9_start_blade_meet": "Across the café table, Kwon Dohyun turns his Bridge Bank ID card face down. He has set the bank’s name aside for now, but this meeting is in no minutes.",
    "c9_start_blade_table": "When you file the plan, the creditors’ secretariat gives it an intake number. A plan inside formal procedure is as slow as it is steady, and the 60 hours run down fast.",
    "c9_start_blade_floor": "In the night-shift break room, the workers count the day’s volume and the missing hands on their fingers. A box missing from the sheets gets filled, but numbers gathered at dawn are read last at the afternoon meeting.",
    "c9_start_blade_signature": "Show one line, and the other side calculates the rest. Kwon Dohyun calculates fast."
  },
  "choiceVoiceLines": {
    "c9_start_meet": "Saying that in the meeting room each of you will only speak for your bank, you meet Kwon Dohyun alone at a Yeouido café before the meeting.",
    "c9_start_table": "Saying that even a plan to save people has to win inside procedure, you refile the rehabilitation plan formally with Do Yoonha.",
    "c9_start_floor": "Saying the numbers are out there at four a.m., you visit the night shift at the logistics center and gather numbers from the floor.",
    "c9_ledger_honest": "To show it isn’t pity, you write what you stand to lose in your box on Kwon Dohyun’s sheet, hiding nothing.",
    "c9_ledger_price": "Saying free help would make him uneasy too, you write Kwon Dohyun’s testimony into your box as your gain.",
    "c9_ledger_blank": "Saying your box doesn’t matter, you leave it blank and talk to Kwon Dohyun only about the 1,140.",
    "c9_family_charge": "Saying you can’t bury it once you know where the tuition came from, you file charges against Kwon Seungwoo and Bae Sungjun for breach of trust, embezzlement and accounting fraud.",
    "c9_family_restore": "Saying repair comes before prison, you skip the charges and make Kwon Seungwoo and Bae Sungjun cover the damage from their own assets.",
    "c9_family_choice": "Saying it’s his family so it’s his call, you hand the books to Kwon Dohyun and wait to hear whether he’ll press charges.",
    "c9_timing_strike": "Saying you’ll decide which papers the inspectors see on day one, you file the trace sheet with Oh Jinwoo the night before the inspection.",
    "c9_timing_warn": "Saying you can’t strike at someone in the same bank without warning, you tell Kwon Dohyun before you file the trace sheet.",
    "c9_timing_after": "Saying to get through the vote first, you erase Oh Jinwoo’s circle and hold the tip until after the vote.",
    "c9_final_both": "Saying that saving and punishing are the same math, you sign both sheets with the pen Kwon Dohyun offers.",
    "c9_final_rescue": "Saying people have to survive before punishment means anything, you file only the rescue sheet with the creditors and fold away the complaint.",
    "c9_final_punish": "Saying that without punishment there will be another FlowOn, you file only the complaint and the trace sheet and leave the rehabilitation to the court.",
    "c9_after_stay": "To see the posted decision kept on the floor, you stay at the floor talks until the job transfer is done.",
    "c9_after_court": "Saying whoever stepped into this math has to explain it to the end, you go to the court and the inspection team.",
    "c9_after_return": "You drink the noodle broth to the last drop and quietly catch the first train back to Yeongdong.",
    "c9_calc_choice_1": "Saying a gap from how severance is calculated can’t be settled by cutting it, you settle the 300 million won gap in the workers’ favor.",
    "c9_calc_choice_2": "To say whether it’s goodwill or a mistake you have to see where the gap starts, so you pull out the rate table and check it line by line.",
    "c9_calc_choice_3": "Not wanting to widen the gap in front of a man who trusts only matching numbers, you write the 300 million won off as rounding error and move on.",
    "c9_wedding_choice_1": "Since a complaint could hit the news before the wedding, you work out together whether it can be moved until after.",
    "c9_wedding_choice_2": "Saying you can’t set a complaint date around the family table, you keep the complaint timetable as it is, whatever the schedule.",
    "c9_wedding_choice_3": "Leaving the invitation unmentioned, you suggest just finishing today’s work.",
    "c9_night_choice_1": "It’s sleep Ban Jaewook covered with his own jacket, so you let the sleepers sleep and split up the rest of the work.",
    "c9_night_choice_2": "With seven hours left to the inspectors’ deadline, you check the tip papers against the checklist once more.",
    "c9_night_choice_3": "It’s 2 a.m. and the statement is printed, so you call it a night and send everyone home.",
    "c9_calc_reaction_choice_1": "So it won’t be money that vanishes when the company changes hands, you nail the 11 workers’ severance into the transfer terms.",
    "c9_calc_reaction_choice_2": "You suggest checking first whether the forfeiture clause holds up legally.",
    "c9_calc_reaction_choice_3": "You suggest keeping the 300 million won in severance as a concession for the transfer talks.",
    "c9_wedding_reaction_choice_1": "You say you’ll stand by Kwon Dohyun so he can tell his bride himself.",
    "c9_wedding_reaction_choice_2": "Taking him at his word that 1,140 people can’t be weighed against family matters, you follow the legal timetable, wedding or not.",
    "c9_wedding_reaction_choice_3": "Saying who sits at the family table is for him and his bride to decide, you draw a line and stay out of family matters.",
    "c9_night_reaction_choice_1": "You pin the page Ban Jaewook tore out for you to the front of the vote file.",
    "c9_night_reaction_choice_2": "Saying a page with one line can’t go into the tip papers as evidence, you keep the notebook page separately.",
    "c9_night_reaction_choice_3": "With the tip deadline closing in on morning, you save the feelings for later and see to the deadline first.",
    "c9_branch_father_a": "Saying to start with the names his father knew by heart, you write the 11 early employees on the first page of the plan.",
    "c9_branch_father_b": "Saying that wavering here means missing the vote, you push to decide on the charges today.",
    "c9_branch_father_c": "Saying he put off his decision to come to this room, so today he should stay with his father, you take over the talks for a day.",
    "c9_branch_father_follow_a": "Saying it’s a page numbers can’t explain, you put the photo at the back of the creditors’ file.",
    "c9_branch_father_follow_b": "Saying the photo belongs to them, you hand it back and say you’ll fight with numbers only.",
    "c9_branch_father_follow_c": "Saying the people in the photo should speak for themselves, you call the 11 to the vote.",
    "c9_route_system_add": "So the cost nobody counted enters the discussion, you submit the third sheet as an official creditors’ document.",
    "c9_route_system_quiet": "Saying an estimate won’t move the creditors, you close the table and fight with the two sheets only.",
    "c9_route_system_families": "Saying those who will pay the cost should see it first, you show this table to the family representatives first.",
    "c9_final_system_route_a": "So the decision can see even the missing box, you put all three sheets to the vote as one bundle.",
    "c9_final_system_route_b": "Saying an unsigned estimate carries no weight in a meeting, you cover the third table and bargain on recovery rates only.",
    "c9_final_system_route_c": "If the table never reached a meeting for lack of a signature, you decide to sign it and write your name as author at its foot.",
    "c9_evidence_turn_reappraise": "Saying a bought number has to be measured again, you demand a collateral reappraisal.",
    "c9_evidence_turn_hold": "Saying the source should come out all at once at the vote, for now you only keep it in mind.",
    "c9_evidence_turn_share": "Saying his bank bought the number so he should be the one to say it, you show Kwon Dohyun first.",
    "c9_ledger_evidence_turn": "Pairing the numbers on the liquidation sheet with the trace sheet from the clue, you trace each number back to the approval it came from.",
    "c9_family_evidence_turn": "Pairing the numbers on the liquidation sheet with the trace sheet from the clue, you trace each number back to the approval it came from.",
    "c9_timing_evidence_turn": "Pairing the numbers on the liquidation sheet with the trace sheet from the clue, you trace each number back to the approval it came from.",
    "c9_route_system_evidence_turn": "Pairing the numbers on the liquidation sheet with the trace sheet from the clue, you trace each number back to the approval it came from.",
    "c9_start_law_meet": "Saying that in the meeting room each of you will only speak for your bank, you meet Kwon Dohyun alone at a Yeouido café before the meeting.",
    "c9_start_law_table": "Saying that even a plan to save people has to win inside procedure, you refile the rehabilitation plan formally with Do Yoonha.",
    "c9_start_law_floor": "Saying the numbers are out there at four a.m., you visit the night shift at the logistics center and gather numbers from the floor.",
    "c9_start_law_signature": "You bring the trace sheet you made an official record to the creditors’ table through the same door.",
    "c9_start_friend_meet": "Saying that in the meeting room each of you will only speak for your bank, you meet Kwon Dohyun alone at a Yeouido café before the meeting.",
    "c9_start_friend_table": "Saying that even a plan to save people has to win inside procedure, you refile the rehabilitation plan formally with Do Yoonha.",
    "c9_start_friend_floor": "Saying the numbers are out there at four a.m., you visit the night shift at the logistics center and gather numbers from the floor.",
    "c9_start_friend_signature": "Leaning on their being college classmates, you ask Oh Jinwoo to meet Kwon Dohyun first.",
    "c9_start_blade_meet": "Saying that in the meeting room each of you will only speak for your bank, you meet Kwon Dohyun alone at a Yeouido café before the meeting.",
    "c9_start_blade_table": "Saying that even a plan to save people has to win inside procedure, you refile the rehabilitation plan formally with Do Yoonha.",
    "c9_start_blade_floor": "Saying the numbers are out there at four a.m., you visit the night shift at the logistics center and gather numbers from the floor.",
    "c9_start_blade_signature": "Like showing just the tip of a blade, you lay one line of the trace sheet in front of Kwon Dohyun."
  },
  "pack": {
    "clue": {
      "title": "The Bought Recovery Rate",
      "text": "The appraisal firm behind the number that says liquidation pays uses the same tax agent as the trace sheet. Someone can order a calculation, too."
    },
    "outcomes": {
      "c9_after_stay": {
        "tag": "Held the Floor",
        "title": "The deal was signed before the night shift’s noodles went cold",
        "text": "You stayed until the last signature on the job transfer agreement. Delayed-return notices piled up at Yeongdong Branch, and the fulfillment center break room kept one extra cup of noodles for you."
      },
      "c9_after_court": {
        "tag": "Explained to the End",
        "title": "You explained that day’s math to the end, in court and to the inspectors",
        "text": "On the witness stand you explained, line by line, the math you put on the table that day. Whom you tried to save and whom you tried to make pay went on record under the same case number."
      },
      "c9_after_return": {
        "tag": "Went Back Quietly",
        "title": "You heard about the job transfer on the Yeongdong Branch TV",
        "text": "The deal went on without you. The next morning, Kang Taemin ate the cup noodles he had opened for you, alone."
      }
    },
    "continuityChallenges": {
      "c8_after_law": {
        "title": "Find Who the Slow Law Missed",
        "text": "The investigation has begun, but the vote won’t wait. Find the people the record couldn’t save first, and a hidden clue may open."
      },
      "c8_after_friend": {
        "title": "Don’t Spend the Friend You Got Back",
        "text": "Oh Jinwoo and Kwon Dohyun were classmates. Find a choice that doesn’t use that bond only as a bargaining tool."
      },
      "c8_after_blade": {
        "title": "Turn the Lone Blade into a Ledger",
        "text": "A blade can punish but cannot save. Reframe the table so the trace sheet goes into the math that saves people."
      }
    }
  }
};
