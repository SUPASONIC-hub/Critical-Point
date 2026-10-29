/**
 * 사건 07 (src/nodes/case07.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c7_start": {
      "title": "Transfer Order",
      "text": "One week after the HR committee, morning, the Trigger Lab 4th-floor analyst room. Han Seoyun comes to your desk with a printed sheet. It is a transfer order. Corporate lending, Gangwon Yeongdong Branch, effective in 48 hours. The place is 240km from Seoul. It is a personnel move, not discipline, so there is no appeal and no stated reason. Once it takes effect, your access to internal records shrinks to that branch. Han Seoyun turns the sheet over to the last page. The final approval box is empty. 'Same shape as that document 3 years ago. This person doesn’t sign a name. They sign with a seat.' The order is dated 12 days before the investigation into Oh Jinwoo began.",
      "memo": [
        "48 hours until effective, no appeal process",
        "Transfer order final approval box: blank",
        "Order dated 12 days before the Oh Jinwoo investigation opened",
        "After transfer, records access shrinks to branch scope"
      ],
      "choices": {
        "c7_start_gather": {
          "label": "Leave the boxes and spend the 48 hours gathering files"
        },
        "c7_start_accept": {
          "label": "Accept the Yeongdong posting and start the handover list"
        },
        "c7_start_appeal": {
          "label": "Point Han Seoyun to the blank box and file an appeal"
        },
        "reframe": {
          "label": "Count same-shaped transfers"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Transfer in 48h",
      "question": "In 48 hours you will be at a branch 240km away, and the file stays here. Where do you spend the last two days?",
      "lead": "One week after the HR committee, morning. Han Seoyun brings a printed transfer order and shows you the empty approval box on the last page first."
    },
    "c7_ledger": {
      "title": "Ban Jaewook’s Notebook",
      "text": "The Internal Audit records room on the Trigger Lab 2nd floor, a room with no windows. Ban Jaewook unlocks the inner cabinet and takes out a black notebook with a worn cover. In it are the names and dates of 47 people who lost their jobs after his investigations, one per line, in order. All in ballpoint. Only one line near the back is in pencil. Your name, and a date 3 weeks ago. 'I write down everyone I’ve cut. If I erased them, it would be as if I hadn’t.' He touches the pencil line with a finger. 'This one is pencil. Because it isn’t over yet. What reached me that day was one line with a name. No reason.' By the rules this notebook should not exist, and the moment it is submitted, his career ends with it.",
      "memo": [
        "47 names in the notebook, last line in pencil",
        "Date by your name: 12 days before the Oh Jinwoo investigation",
        "An investigator keeping private records breaks internal rules",
        "If submitted, Ban Jaewook is investigated too"
      ],
      "choices": {
        "c7_ledger_page": {
          "label": "Take only the page with your name in pencil"
        },
        "c7_ledger_refuse": {
          "label": "Leave the notebook and ask Ban Jaewook only to testify"
        },
        "c7_ledger_take": {
          "label": "Take the whole black notebook, all 47, as evidence"
        },
        "reframe": {
          "label": "Count same-shaped transfers"
        },
        "c7_ledger_evidence_turn": {
          "label": "Date the order against the probe"
        }
      },
      "place": "Trigger Lab, 2nd-floor Internal Audit records room",
      "clock": "Transfer in 46h",
      "question": "Your name is in pencil in a notebook that should not exist. How do you take this record?",
      "lead": "Ban Jaewook unlocks the inner cabinet of the records room. He has never shown this room to anyone."
    },
    "c7_counter": {
      "title": "3 Years at Gangseo",
      "text": "KD Bank Gangseo Branch. Do Yoonha opens that door for the first time in 3 years. The sales board by the entrance is in the same spot, and the Top Seller of the Month sticker is still on it. The branch manager who moved him off the counter still sits in the same office. What you need is the printout of the memo sent down to the branch 3 years ago, 'Smart Logistics No. 3 Sales Cooperation.' It was printed for a branch meeting that year and put in a binder, so the back page with targets per window and the names of the staff is still attached. You saw that sheet once, on the table on inspection day. The manager says he can give it. He doesn’t get angry. Instead he speaks with the binder open. If this page leaves, he says, the names of every window clerk who took those targets and sold go with it. Starting with Do Yoonha. Do Yoonha keeps his eyes on the queue-ticket machine so he won’t look at the sales board.",
      "memo": [
        "Window-by-window sales targets attached to the memo’s back page",
        "Department that sent the targets: Corporate Finance Strategy Team",
        "If it leaves, the 4 window clerks of that time are identified",
        "Do Yoonha is one of them"
      ],
      "choices": {
        "c7_counter_mask": {
          "label": "Take a copy, four names covered"
        },
        "c7_counter_pull": {
          "label": "Take the back page as it is"
        },
        "c7_counter_ask": {
          "label": "Ask the four clerks first, starting with Do Yoonha"
        },
        "reframe": {
          "label": "Count same-shaped transfers"
        },
        "c7_counter_evidence_turn": {
          "label": "Date the order against the probe"
        }
      },
      "place": "KD Bank Gangseo Branch",
      "clock": "Transfer in 43h",
      "question": "If the back page leaves, the names of the four people at the windows then go with it. How do you take it?",
      "lead": "Do Yoonha opens the door of his old branch for the first time in 3 years. Branch Manager Bae Seungho, who moved him out, still sits in the same seat."
    },
    "c7_paper": {
      "title": "The Burned Line",
      "text": "The 2nd floor of the secondhand bookshop in Hoegi-dong. As you climb the stairs, the smell of paper comes first. At the desk by the window, Lim Kyungsoo peels the seal tape off a binder and slides one sheet across. A watermarked printout of page 3 of the 2023-0412 review report. The signature box is empty, and under it, the initials of whoever gave the order remain in pencil. On page 3 in the document management system, exactly that lower part is cut off. He takes off his glasses, wipes them, and for the first time asks for something. 'Don’t tell me you’ll protect me. I’ve carried this for 3 years. At the bank, and in this bookshop. If you submit it, put my name at the top. That’s what I want.' From downstairs comes the sound of the owner cutting the twine on a bundle of books.",
      "memo": [
        "Pencil initials confirmed at the bottom of the page 3 printout",
        "That bottom area is cut off in the system copy",
        "Lim Kyungsoo refuses anonymity",
        "With his name, the document gains weight as evidence"
      ],
      "choices": {
        "c7_paper_name": {
          "label": "Put Lim Kyungsoo’s name at the top, as he asks"
        },
        "c7_paper_shield": {
          "label": "Set his request aside and submit page 3 anonymously"
        },
        "c7_paper_pair": {
          "label": "On the 2nd floor, write your name next to Lim Kyungsoo’s"
        },
        "reframe": {
          "label": "Count same-shaped transfers"
        },
        "c7_paper_evidence_turn": {
          "label": "Date the order against the probe"
        }
      },
      "place": "Hoegi-dong secondhand bookshop, 2nd floor",
      "clock": "Transfer in 21h",
      "question": "Lim Kyungsoo wants his own name at the top, not protection. Do you accept that?",
      "lead": "A man who kept one printout for 3 years names his price for the first time."
    },
    "c7_final": {
      "title": "Whose Name Goes On It",
      "text": "At the end of the Trigger Lab 4th-floor corridor, Oh Jinwoo is clearing his desk. The sticky notes that stood in color-coded rows are in one box. The last piece is his statement. Only the person who lived under that condition can say the decision time limit was a setting. He stops packing and asks. 'How many names go on that document?' Then he adds, 'I never managed to get my father’s name off that file. This time I want to know first whose name stays.' The more names, the heavier the document, and the more people get hurt. It goes not to Internal Audit but to an auditor outside the group.",
      "memo": [
        "Submittable: notebook, window back page, watermarked printout, Oh Jinwoo’s statement",
        "More names: more weight as evidence, wider damage",
        "Once effective, access shrinks to branch scope",
        "Recipient: an external auditor, not Internal Audit"
      ],
      "choices": {
        "c7_final_all": {
          "label": "List all four: Ban, Do, Lim and Oh"
        },
        "c7_final_none": {
          "label": "Give the outside auditor the files with names left blank"
        },
        "c7_final_mine": {
          "label": "In front of Oh Jinwoo, write only your own name"
        },
        "reframe": {
          "label": "Change the table one last time with a proposal"
        }
      },
      "place": "Trigger Lab, 4th floor · Oh Jinwoo’s desk",
      "clock": "Transfer in 16h",
      "question": "What remains is how many names go on this document. Whose name do you take it under?",
      "lead": "Oh Jinwoo stops clearing his desk and turns around. Without his statement, no one can speak to the setting."
    },
    "c7_aftershock": {
      "title": "Effective Time",
      "text": "9:10 on the morning the transfer takes effect, your staff badge still opens the 4th-floor door. The system update is a day late. In the analyst room, two desks wait to be cleared: yours and the one at the end of the corridor. Han Seoyun brings two coffees and sets one on your desk. She doesn’t bring up the order. 'For today you’re still one of us. How will you use it?' It is not how she used to talk. These days she ends her sentences like someone reporting. No reply yet from the outside auditor. The people who helped wait for it, each at their own desk. Outside the window, the morning shops in the Hapjeong-dong alleys open.",
      "memo": [
        "Access reduction delayed by one day",
        "External auditor reply: pending",
        "The helpers’ materials have already left the group"
      ],
      "choices": {
        "c7_after_alone": {
          "label": "Pack quietly without telling anyone"
        },
        "c7_after_open": {
          "label": "Use the day to hand the rest of the originals to the auditor"
        },
        "c7_after_stand": {
          "label": "Go to the people who gave you files first"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Effective day 09:10",
      "question": "The system update is a day late, so your badge still works. Where do you spend the last day?"
    },
    "c7_receipt": {
      "title": "The Receipt",
      "text": "Saying he couldn’t talk more in the records room, Ban Jaewook hailed a taxi, and it circled one block and stopped again on the road outside Trigger Lab. The meter reads 4,300 won. He says to split the fare, tears the receipt, and holds out half. His half even has his signature. A man who cut 47 people is haggling over 4,300 won. 'I don’t accept anything that can’t go on the record. Not what I get, not what I give.' He has never made a joke, and this isn’t one either. The notebook he opened once in the records room is back in his bag, on his knees. The access-card log showing the two of you entering the records room is already there.",
      "memo": [
        "His signature is on the half receipt",
        "Notebook went back into his bag on leaving the records room",
        "Internal Audit records room access log already exists"
      ],
      "choices": {
        "c7_receipt_choice_1": {
          "label": "Split it half and half, his way"
        },
        "c7_receipt_choice_3": {
          "label": "Let it go and save the time"
        },
        "c7_receipt_choice_2": {
          "label": "Take the receipt and claim it as your expense"
        }
      },
      "place": "Road outside Trigger Lab",
      "clock": "Transfer in 45h",
      "question": "A man who cut 47 people wants to split 4,300 won. How do you settle the bill?"
    },
    "c7_teller": {
      "title": "Window 4",
      "text": "On the way out of the branch, Do Yoonha says out of habit to a customer holding the door, 'Take care going home, ma’am,' and someone at Window 4 calls to him. 'Yoonha, you still say that.' A gray-haired teller. Someone who sat in the same row 3 years ago and retires next year. The teller doesn’t ask why he has come. In a gap between customers, the teller opens a drawer and takes out a sheet. A copy of that year’s target sheet, one the branch kept on its own. The teller presses a fingernail down to fold over the part with the clerks’ names. The line with the teller’s own name. Folded, it slides under the counter glass. 'The fold is mine. Unfolding it is up to whoever takes it.' The ticket machine calls the next number.",
      "memo": [
        "Window 4 teller was on the same team then",
        "The copy is the branch’s own file",
        "Retires next year"
      ],
      "choices": {
        "c7_teller_choice_3": {
          "label": "Leave the copy and go through the original’s procedure"
        },
        "c7_teller_choice_1": {
          "label": "Unfold it and include the teller’s name too"
        },
        "c7_teller_choice_2": {
          "label": "Take it folded and keep the name covered"
        }
      },
      "place": "KD Bank Gangseo Branch · Window 4",
      "clock": "Transfer in 42h",
      "question": "A teller one year from retirement folds over their own name and hands you the copy. Do you unfold it?"
    },
    "c7_ticket": {
      "title": "The Train Ticket",
      "text": "On the landing of the bookshop stairs, your phone rings once. ECHO quietly puts up a document. A train ticket the General Affairs Team has already issued. Departs 06:40, to Gangneung, one-way. The date is the day after the transfer takes effect. There is no return ticket. It was issued on the same day the order was written, 3 weeks before you got that sheet. The approver box is empty again. ECHO adds one line. 'The system calculated that you would go. The calculation is usually right.' In the alley below the stairs, someone is loading boxes of used books onto a handcart. The ticket can be canceled. But even if you cancel it, both the record of issuing it and the record of canceling it remain.",
      "memo": [
        "One-way ticket issued on the date the order was written",
        "Approver box blank",
        "Canceling the ticket still leaves a record"
      ],
      "choices": {
        "c7_ticket_choice_1": {
          "label": "Cancel the ticket and keep that record as evidence"
        },
        "c7_ticket_choice_3": {
          "label": "Keep the ticket and say nothing today"
        },
        "c7_ticket_choice_2": {
          "label": "Leave the ticket and send the files first"
        }
      },
      "place": "Hoegi-dong secondhand bookshop, 2nd floor · stair landing",
      "clock": "Transfer in 19h",
      "question": "General Affairs has already issued a one-way ticket to Gangneung at 06:40. What do you do with it?"
    },
    "c7_receipt_reaction": {
      "title": "What Came Out of the Bag",
      "text": "Once the receipt is settled, Ban Jaewook stays in the back seat and opens his bag. The notebook is wrapped in plastic. Yellowed at the corners, the same plastic for 3 years. The driver turns the radio up a little so he won’t look in the mirror. Ban Jaewook sets the notebook on his knees and keeps his hand on it. 'Leave the answer you heard in the records room as it is, and decide how it changes hands now. Filed formally, taken privately, or heard by word of mouth. Whichever it is, I write my resignation today.' It is the face of a man settling a debt, not one being asked a favor. The meter starts climbing again.",
      "memo": [
        "How to ask a favor of a man who owes no one",
        "The resignation goes first"
      ],
      "choices": {
        "c7_receipt_reaction_choice_3": {
          "label": "Take only his testimony, without the notebook"
        },
        "c7_receipt_reaction_choice_1": {
          "label": "File it through formal procedure"
        },
        "c7_receipt_reaction_choice_2": {
          "label": "Take it privately and keep him out of it"
        }
      },
      "place": "Road outside Trigger Lab · taxi back seat",
      "clock": "Transfer in 44h",
      "question": "The notebook is wrapped in plastic, and he writes his resignation today either way. How do you take it?"
    },
    "c7_teller_reaction": {
      "title": "Four Names",
      "text": "At the bus stop outside Gangseo Branch, Do Yoonha stands holding the target sheet. The names of the four window clerks who took those targets run down the page. The teller at Window 4, Do Yoonha, and two more. He scores a line with his fingernail along the row with his own name. 'I’ll put my own name forward. That one I can decide.' A bus stops, and he doesn’t get on. 'The other three I can’t decide. Just because we sat together doesn’t mean I can hand over their names for them.' He folds the sheet in half and gives it to you. The fold runs right through the middle of the four names.",
      "memo": [
        "The right to put forward your own name",
        "A witness one year from retirement"
      ],
      "choices": {
        "c7_teller_reaction_choice_3": {
          "label": "Erase every name and write only the numbers"
        },
        "c7_teller_reaction_choice_1": {
          "label": "Let each of the four decide for themselves"
        },
        "c7_teller_reaction_choice_2": {
          "label": "Keep one name and erase the rest"
        }
      },
      "place": "Outside KD Bank Gangseo Branch",
      "clock": "Transfer in 41h",
      "question": "The target sheet has four names, and Do Yoonha can only decide his own. What about the other three?"
    },
    "c7_ticket_reaction": {
      "text": "When you come down into the alley in front of the bookshop, ECHO attaches a search result beside the ticket record. 'In the last 3 years of tickets on this route, the same pattern appears six times. Issued without an approver, one-way, before the transfer took effect. All six boarded.' Six rows of seat numbers stand in a column on the screen. The days they traveled all differ, but the time is always 06:40. You are the seventh. At the end of the alley, the handcart loaded with used books turns the corner. Whether you will be standing at the station at that hour is not yet written in any record.",
      "memo": [
        "A route all six took",
        "The worth of a scene where you don’t board"
      ],
      "choices": {
        "c7_ticket_reaction_choice_2": {
          "label": "Go down, but send the files first"
        },
        "c7_ticket_reaction_choice_3": {
          "label": "Wait one more day"
        },
        "c7_ticket_reaction_choice_1": {
          "label": "Go to the station and don’t board"
        }
      },
      "place": "Alley outside the Hoegi-dong secondhand bookshop",
      "clock": "Transfer in 18h",
      "question": "The same ticket pattern appears six times in 3 years, and all six boarded. What do you do?"
    },
    "c7_branch_quota": {
      "title": "That Year’s Targets",
      "text": "The branch’s 2nd-floor records room. When you said you would ask the four first, the manager handed over the key and left. At the top of the target-sheet printout taken from the binder is a handwritten line. 'May target 1.2 billion -- regardless of credit review.' The order sent to the branch was not to sell the product. It was to sell it no matter what the review said. The records room index notes the same words on the target sheets of three other branches. Do Yoonha looks at that line for a long time under the fluorescent light. 'If I’d seen that sentence back then, would I have stopped selling?' He puts the sheet down. 'I don’t know. That’s what I hate most.'",
      "memo": [
        "Handwritten at top of target sheet: regardless of credit review",
        "Same department sent the targets and wrote the 2023-0412 clause",
        "Same words on target sheets at 3 other branches"
      ],
      "choices": {
        "c7_branch_quota_c": {
          "label": "Identify only who gave the order, not who sold"
        },
        "c7_branch_quota_b": {
          "label": "Enlarge the one handwritten line as evidence"
        },
        "c7_branch_quota_a": {
          "label": "Gather all three branches’ sheets and show the pattern"
        }
      },
      "place": "KD Bank Gangseo Branch · records room",
      "clock": "Transfer in 42h",
      "question": "At the top of the target sheet is the handwritten line 'regardless of credit review.' How do you use it?"
    },
    "c7_branch_quota_follow": {
      "title": "Who Sold and Who Ordered",
      "text": "Ban Jaewook gets the call and comes to the records room. He takes the target sheet and says nothing for a long time. He reads the handwritten line twice. 'I cut three people who sold with this target sheet. I never once saw the person who gave the order.' He takes the notebook from his bag and opens it near the middle. Three names sit side by side. The deadline for all three to ask for a new review has already passed. 'If these people go in this document, names that were closed open again. I don’t know if they want that.' He lays the notebook open on the table. 'Do we write them as people who were cut, or as people it was done to? That comes first.'",
      "memo": [
        "3 past dismissals handled with the same target sheet",
        "Deadline to request a re-hearing has passed",
        "Including them reopens those 3 names"
      ],
      "choices": {
        "c7_branch_quota_follow_c": {
          "label": "Contact the three first and ask what they want"
        },
        "c7_branch_quota_follow_a": {
          "label": "List the three who were cut as victims too"
        },
        "c7_branch_quota_follow_b": {
          "label": "Keep to this case and set the past aside"
        }
      },
      "place": "KD Bank Gangseo Branch · records room",
      "clock": "Transfer in 41h",
      "question": "Three people were already cut over the same target sheet. How do you write their names into this document?"
    },
    "c7_route_system": {
      "title": "The Transfer Register",
      "text": "Instead of your own transfer, you ask how many transfers share the same shape. The analyst room terminal answers. The personnel register opens. ECHO filters by condition. Transfers carried out with the final approval box left empty. Nineteen in the last 4 years. The dates and destinations all differ, but 17 of the people passed through the same department. The Corporate Finance Strategy Team. The reason column is empty on all 19 rows. ECHO leaves one blank row at the bottom of the table. 'You are not the 20th person. You are one row in the same table. These 19 have never been put in one table before.'",
      "memo": [
        "19 transfers with a blank approval box",
        "17 passed through the Corporate Finance Strategy Team",
        "The table’s last row is still blank"
      ],
      "choices": {
        "c7_route_system_quiet": {
          "label": "Close the table and handle only your own"
        },
        "c7_route_system_trace": {
          "label": "Follow all 19 and complete the table"
        },
        "c7_route_system_call": {
          "label": "Contact the 17 who were transferred before you"
        },
        "c7_route_system_evidence_turn": {
          "label": "Date the order against the probe"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · personnel register terminal",
      "clock": "Transfer in 15h",
      "question": "Nineteen transfers in 4 years went ahead with the approval box empty. How far do you open this table?"
    },
    "c7_final_system_route": {
      "title": "19 Rows and One Blank",
      "text": "12 hours until the transfer. On the personnel register terminal, the 19 transfers with blank approval boxes sit in one table. Names, dates, destinations, and the empty approval box. 17 passed through the Corporate Finance Strategy Team, and the last row is still blank. It is already dark outside the analyst room, and yours is the only light on the floor. ECHO asks. 'Before you opened it, this was not a table. It was 19 sheets filed separately. Do you want to turn it back into loose sheets?' As loose sheets, they were personnel moves. As a table, they become a method.",
      "memo": [
        "19 blank-approval transfers bound into one table",
        "The table’s last row: blank",
        "12 hours until the transfer takes effect"
      ],
      "choices": {
        "c7_final_system_route_a": {
          "label": "Bind all 19 into one document and send it outside"
        },
        "c7_final_system_route_b": {
          "label": "Get only yours canceled and bury the rest"
        },
        "c7_final_system_route_c": {
          "label": "Write your name in the table’s last row"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · personnel register terminal",
      "clock": "Transfer in 12h",
      "question": "The table’s last row is still blank. How do you close this table?"
    },
    "c7_evidence_turn": {
      "title": "The Order Came First",
      "text": "When you hold the clues against the date the order was written, the sequence shows. In the Internal Audit records room, Ban Jaewook opens a calendar and circles three dates. The order was written 12 days before the Oh Jinwoo investigation began. And one day before it was written, Onsae submitted its subsidy review materials. Materials sent out under your name. Ban Jaewook joins the three circles with a line. 'The transfer didn’t come because the investigation started. The transfer was prepared because your name went on a document. The Oh Jinwoo matter wasn’t the reason. It was the pretext.' He copies the same line into his notebook. Before yours, 17 more transfers went through the Corporate Finance Strategy Team with the approval box empty, and the sequence is the same in every one.",
      "memo": [
        "Date written = day after Onsae materials went out under your name",
        "Oh Jinwoo investigation: the pretext, not the reason",
        "Same sequence repeated in the 17 earlier cases"
      ],
      "choices": {
        "c7_evidence_turn_order": {
          "label": "Submit the day you asked and the order date side by side"
        },
        "c7_evidence_turn_hold": {
          "label": "Note the sequence and don’t use it this time"
        },
        "c7_evidence_turn_share": {
          "label": "Tell the 17 before you about this sequence first"
        }
      },
      "place": "Trigger Lab, 2nd-floor Internal Audit records room",
      "clock": "Transfer in 10h",
      "question": "The order was written the day after your question. How do you use this sequence?"
    },
    "c7_start_stand": {
      "title": "Transfer for the One Who Kept the Desk",
      "text": "You didn’t clear the desk Oh Jinwoo would come back to. The next week, in the morning, Do Yoonha stands in front of that desk at the end of the corridor with a sheet of paper. He came to water the plant, he says, and saw it on your desk first. A transfer order. Corporate lending, Gangwon Yeongdong Branch, effective in 48 hours. It is a personnel move, not discipline, so there is no appeal and no duty to give a reason. The final approval box on the last page is empty. Do Yoonha points to the date it was written. It is earlier than the day Oh Jinwoo began missing work. 'His desk is still there. It’s your desk that’s being cleared, Analyst.'",
      "memo": [
        "Oh Jinwoo’s desk is still in place",
        "Your order was written earlier",
        "Two desks on the same floor go empty at once"
      ],
      "choices": {
        "c7_start_stand_appeal": {
          "label": "Point Han Seoyun to the blank box and file an appeal"
        },
        "c7_start_stand_accept": {
          "label": "Accept the Yeongdong posting and start the handover list"
        },
        "c7_start_stand_signature": {
          "label": "Show your transfer order to Oh Jinwoo first"
        },
        "c7_start_stand_gather": {
          "label": "Leave the boxes and spend the 48 hours gathering files"
        },
        "c7_start_stand_reframe": {
          "label": "Count same-shaped transfers"
        }
      },
      "place": "Trigger Lab, 4th floor · in front of Oh Jinwoo’s desk",
      "clock": "Transfer in 48h",
      "question": "The week after you kept his desk, it is your desk that gets cleared. Where do you spend the last two days?",
      "lead": "The price of not clearing a chair for someone to come back to has arrived. The transfer order is dated before the day he stopped coming in."
    },
    "c7_start_open": {
      "title": "Transfer for the One Who Opened the Conditions",
      "text": "One week since you opened the two people’s settings to the public record. On the analyst room’s public-record terminal, that record is still up. The experiment did not stop. Only the person in charge changed. ECHO puts one more document on the same screen. A transfer order. Corporate lending, Gangwon Yeongdong Branch, effective in 48 hours. It is a personnel move, not discipline, so there is no appeal and no stated reason, and the final approval box is empty. The replacement analyst is already assigned. 'The disclosure stays on the record. The one who disclosed goes 240km away. These two lines are written in different documents, so no one reads them side by side.'",
      "memo": [
        "Settings disclosure record still valid",
        "The experiment itself has not stopped",
        "Replacement analyst already assigned"
      ],
      "choices": {
        "c7_start_open_appeal": {
          "label": "Point Han Seoyun to the blank box and file an appeal"
        },
        "c7_start_open_accept": {
          "label": "Accept the Yeongdong posting and start the handover list"
        },
        "c7_start_open_gather": {
          "label": "Leave the boxes and spend the 48 hours gathering files"
        },
        "c7_start_open_signature": {
          "label": "Post the order as-is through the audit channel you used"
        },
        "c7_start_open_reframe": {
          "label": "Count same-shaped transfers"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · public-record terminal",
      "clock": "Transfer in 48h",
      "question": "The record you opened stays, and so does the experiment, but only you, who opened it, get moved. Where do you spend the last two days?",
      "lead": "The disclosure stayed on the record. The experiment didn’t stop, and the replacement analyst was quietly assigned."
    },
    "c7_start_name": {
      "title": "Transfer for the One Who Closed It With a Name",
      "text": "You closed the case under one person’s name. The next week, in the morning, Ban Jaewook comes up to the analyst room and puts a sheet of paper on your desk. A transfer order. Corporate lending, Gangwon Yeongdong Branch, effective in 48 hours. The final approval box is empty. 'It’s a personnel move, not discipline. So there’s no appeal process and no duty to give a reason.' He speaks without opening his notebook. 'The organization learned that method is fast. Closing it with one person. This time they’re using it on you, Analyst. Only this time they don’t even need a name. They just move a seat.' In the grounds column, the number of the last closing document is written as precedent.",
      "memo": [
        "The last closing method is cited as precedent",
        "No reason given in this handling",
        "The same procedure was already prepared"
      ],
      "choices": {
        "c7_start_name_accept": {
          "label": "Accept the Yeongdong posting and start the handover list"
        },
        "c7_start_name_signature": {
          "label": "Reopen last time’s naming procedure, now in your name"
        },
        "c7_start_name_gather": {
          "label": "Leave the boxes and spend the 48 hours gathering files"
        },
        "c7_start_name_appeal": {
          "label": "Point Han Seoyun to the blank box and file an appeal"
        },
        "c7_start_name_reframe": {
          "label": "Count same-shaped transfers"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Transfer in 48h",
      "question": "The procedure that closed the case under one person’s name now comes for you. Where do you spend the last two days?",
      "lead": "This time not even a name was needed. Moving a seat carries no duty to give a reason."
    }
  },
  "echoReplies": {
    "c7_start_gather": "As you push the empty boxes under the desk, Han Seoyun folds the order and puts it in your drawer. The files come together, but the handover left undone stays on the record too.",
    "c7_start_appeal": "When you hand over the appeal, Han Seoyun studies a form that has no box for filing it. An appeal creates a procedure, and a procedure takes time, and time is what you have left.",
    "c7_start_accept": "As you start the list, the analyst room goes quiet. From that desk 240km away, you cannot open the files here.",
    "c7_ledger_take": "As you take the notebook, Ban Jaewook shuts the empty cabinet. The notebook proves the 47, and the last one on it becomes himself.",
    "c7_ledger_page": "He carefully tears out that page and hands it over, and the back of the notebook is one sheet thinner. One page protects you, but the other 47 are still nowhere.",
    "c7_ledger_refuse": "When you give the notebook back, he turns the key and locks the cabinet again. Testimony carries no dates, so he stays and the document grows thinner.",
    "c7_counter_pull": "As you take the back page, Do Yoonha’s name in the staff column catches your eye first. The page proves the order, and the same page proves four people’s work records.",
    "c7_counter_mask": "The copier runs and the name column comes out blank white. Covered names protect them, but a covered document can’t say who sold.",
    "c7_counter_ask": "When you ask, Do Yoonha takes his eyes off the ticket machine and looks at the sales board for the first time. The decision goes to them, and that decision needs time you don’t have.",
    "c7_paper_name": "As you write the name, Lim Kyungsoo puts his glasses back on and reads it letter by letter. The document grows solid, and a man who hid for 3 years goes public in a day.",
    "c7_paper_shield": "When you say it will be anonymous, he silently puts on new seal tape. Anonymity keeps him safe, but it leaves him sitting with the same sheet for a 4th year.",
    "c7_paper_pair": "As you write the two names side by side, the sound of twine being cut downstairs stops. The two names make each other witnesses, and if one falls, the other is read with it.",
    "c7_final_all": "As you write four names, Oh Jinwoo rests a hand on the box and nods once. A document with many names is hard to refute, and just as many people can be attacked.",
    "c7_final_mine": "As you write one name, Oh Jinwoo closes the lid of the box. Lose alone and no one gets hurt; win alone and no one is a witness.",
    "c7_final_none": "As you hand over the files, Oh Jinwoo goes back to putting sticky notes in the box. Anonymous files open an investigation, but opening it takes months, and by then you are at Yeongdong Branch.",
    "c7_after_stand": "The visits are remembered. In that day, the document moves not one line forward.",
    "c7_after_open": "The last day is the last day your access still works. Use it and it is gone; leave it and it is gone anyway.",
    "c7_after_alone": "Leaving quietly makes it as if nothing happened. Only the people who gave you files remain.",
    "c7_receipt_choice_1": "A record split in half leaves no one in debt. Without a debt, there is no favor either.",
    "c7_receipt_choice_2": "The expense you cover makes it easy on him, and that ease makes it harder later to bring out the notebook.",
    "c7_receipt_choice_3": "The 2 minutes saved are useful today, and you never learn why he is someone who counts 4,300 won.",
    "c7_teller_choice_1": "Unfolded and written in, the teller becomes a witness. A witness one year from retirement.",
    "c7_teller_choice_2": "The covered name protects the teller today, and the document loses that much force.",
    "c7_teller_choice_3": "The procedure is clean and slow. It is not a procedure that ends within 48 hours.",
    "c7_ticket_choice_1": "The cancellation record proves this transfer was planned. It is also notice that you are resisting.",
    "c7_ticket_choice_2": "With the ticket left alone, no one is surprised. The files go out through that gap.",
    "c7_ticket_choice_3": "The ticket you kept is quiet today. At 06:40 that quiet ends.",
    "c7_receipt_reaction_choice_1": "Taken formally, the notebook becomes evidence and he becomes a violator. Both go on the record.",
    "c7_receipt_reaction_choice_2": "Taken quietly, he is safe, and in court that notebook never existed.",
    "c7_receipt_reaction_choice_3": "With testimony only, no dates remain. What remains is one man’s memory.",
    "c7_teller_reaction_choice_1": "Letting each decide takes time. Those who decide put their own names forward themselves.",
    "c7_teller_reaction_choice_2": "Keep only one, and that one carries everything. The branch has seen that method before.",
    "c7_teller_reaction_choice_3": "The target sheet reads even with numbers alone. Who took those targets does not.",
    "c7_ticket_reaction_choice_1": "A scene where you don’t go is powerful. After it, you are no longer someone to negotiate with but a case.",
    "c7_ticket_reaction_choice_2": "You go down, and there is no fuss. The files are already outside, and you are not inside.",
    "c7_ticket_reaction_choice_3": "The day of waiting changes nothing, and the access reduction takes effect as scheduled.",
    "c7_branch_quota_a": "Put three sheets together and one line becomes an order. The time it takes to gather them is what you don’t have.",
    "c7_branch_quota_b": "One enlarged line is strong. One-line evidence gets closed with a one-line explanation.",
    "c7_branch_quota_c": "Pointing only at the chain of command protects the windows. A document without the windows can’t prove what happened on the floor.",
    "c7_branch_quota_follow_a": "Listing the three as victims widens the case back 3 years. You widened it without asking them.",
    "c7_branch_quota_follow_b": "Narrowing the scope closes it today. Those three don’t get to see their own names this time either.",
    "c7_branch_quota_follow_c": "You call, and they choose. That one call takes half the time you have left.",
    "c7_route_system_trace": "Following all of them turns 19 sheets into one table. Completing it takes half the time you have left.",
    "c7_route_system_quiet": "Close the table and your transfer goes back to being one personnel move. The transfers of the same shape stay, none aware of the others.",
    "c7_route_system_call": "You call; some hang up, some talk for a long time. They hear for the first time that their transfer was one row in a table.",
    "c7_final_system_route_a": "As one document, the blank approval box reads not as a mistake but as a method. The 19 names go out with it.",
    "c7_final_system_route_b": "Your transfer can be canceled. The other rows of the same table never learn that one row was canceled.",
    "c7_final_system_route_c": "As you write your name, the blank row fills. The next person to open this table meets you first, on the last row.",
    "c7_evidence_turn_order": "With the two dates side by side, it is hard to call it chance. Your question goes on the record too.",
    "c7_evidence_turn_hold": "Knowing it keeps you safe today. The 18th transfer goes ahead as scheduled.",
    "c7_evidence_turn_share": "Once those before you know, the table doesn’t stand alone. You don’t know how many of the 17 will answer.",
    "c7_ledger_evidence_turn": "Put the sequence in order, and this transfer is not a result but a trailer.",
    "c7_counter_evidence_turn": "Put the sequence in order, and this transfer is not a result but a trailer.",
    "c7_paper_evidence_turn": "Put the sequence in order, and this transfer is not a result but a trailer.",
    "c7_route_system_evidence_turn": "Put the sequence in order, and this transfer is not a result but a trailer.",
    "case07_memory_system": "Look closer and the table you reframed back then has been copied into the remarks column of your personnel record. Below it, the register of transfers with the same shape opens.",
    "case07_memory_evidence": "Write the experiment number beside it, and the order date lands before the investigation start date. Change the sequence, and cause and effect trade places.",
    "c7_start_stand_gather": "As you push the empty boxes under the desk, Han Seoyun folds the order and puts it in your drawer. The files come together, but the handover left undone stays on the record too.",
    "c7_start_stand_appeal": "When you hand over the appeal, Han Seoyun studies a form that has no box for filing it. An appeal creates a procedure, and a procedure takes time, and time is what you have left.",
    "c7_start_stand_accept": "As you start the list, the analyst room goes quiet. From that desk 240km away, you cannot open the files here.",
    "c7_start_stand_signature": "When you show him, he looks at the approval box first. He says the approval box on the document opening his own investigation was empty too. Whether he can carry that is another matter.",
    "c7_start_open_gather": "As you push the empty boxes under the desk, Han Seoyun folds the order and puts it in your drawer. The files come together, but the handover left undone stays on the record too.",
    "c7_start_open_appeal": "When you hand over the appeal, Han Seoyun studies a form that has no box for filing it. An appeal creates a procedure, and a procedure takes time, and time is what you have left.",
    "c7_start_open_accept": "As you start the list, the analyst room goes quiet. From that desk 240km away, you cannot open the files here.",
    "c7_start_open_signature": "A door left open gets faster from the second time. So do the people who know about that door.",
    "c7_start_name_gather": "As you push the empty boxes under the desk, Han Seoyun folds the order and puts it in your drawer. The files come together, but the handover left undone stays on the record too.",
    "c7_start_name_appeal": "When you hand over the appeal, Han Seoyun studies a form that has no box for filing it. An appeal creates a procedure, and a procedure takes time, and time is what you have left.",
    "c7_start_name_accept": "As you start the list, the analyst room goes quiet. From that desk 240km away, you cannot open the files here.",
    "c7_start_name_signature": "With your own name in the same procedure, you see for the first time exactly what that procedure was."
  },
  "choiceVoiceLines": {
    "c7_start_gather": "Packing can wait, you decide; you leave the empty boxes and spend the remaining 48 hours gathering files.",
    "c7_start_appeal": "Calling it a transfer decided without a single question, you point to the blank approval box and file an appeal.",
    "c7_start_accept": "Judging this is not the place to fight, you accept the Yeongdong posting and start with the handover list.",
    "c7_ledger_take": "Knowing his career ends with it, you take Ban Jaewook’s black notebook, all 47 names, as evidence.",
    "c7_ledger_page": "Saying one page is all you need, you take only the page with your name in pencil.",
    "c7_ledger_refuse": "Saying the notebook is his, you leave it in the cabinet and ask Ban Jaewook only to testify.",
    "c7_counter_pull": "Knowing four names come with it, you walk out with the memo’s back page from the Gangseo branch manager as it is.",
    "c7_counter_mask": "Laying paper over the name column, you take only a copy of the back page with the four clerks’ names covered.",
    "c7_counter_ask": "Saying it isn’t yours to decide, you ask the four window clerks, starting with Do Yoonha, and decide after.",
    "c7_paper_name": "Swallowing the promise to protect him, you write Lim Kyungsoo’s name at the top of the document, as he wants.",
    "c7_paper_shield": "Saying his name going out ends 3 quiet years, you set Lim Kyungsoo’s request aside and submit page 3 anonymously.",
    "c7_paper_pair": "Refusing to let him stand alone, you write your name beside Lim Kyungsoo’s on the bookshop’s 2nd floor.",
    "c7_final_all": "Saying a document that erases its helpers is no document, you put down the names of Ban Jaewook, Do Yoonha, Lim Kyungsoo and Oh Jinwoo.",
    "c7_final_mine": "Saying you will pay the price, you write only your own name in the name box in front of Oh Jinwoo.",
    "c7_final_none": "Choosing the path where no one gets hurt, you hand the files with the name box blank to the auditor outside the group.",
    "c7_after_stand": "Using today, while you still belong here, you visit the people who gave you files one by one.",
    "c7_after_open": "Knowing you have one more day, you send the rest of the originals outside.",
    "c7_after_alone": "Telling no one, you start by emptying your desk drawer.",
    "c7_receipt_choice_1": "Saying even 4,300 won is a record, you split it half and half, his way.",
    "c7_receipt_choice_2": "Taking the receipt, you say today’s expense is on you.",
    "c7_receipt_choice_3": "Saying there’s no time for this, you let it go.",
    "c7_teller_choice_1": "Unfolding the sheet, you write the teller’s name on the same line.",
    "c7_teller_choice_2": "Since someone retiring next year folded it themselves, you take it folded and keep the name covered.",
    "c7_teller_choice_3": "Declining the copy, you say you will go only through the formal access procedure.",
    "c7_ticket_choice_1": "Because the ticket was issued before the transfer took effect and with no approver, you cancel it and keep that record as evidence.",
    "c7_ticket_choice_2": "While the system calculates that you will go, you leave the ticket as it is and send the files first.",
    "c7_ticket_choice_3": "With the approver box empty and no one to argue with, you keep the ticket and say nothing today.",
    "c7_receipt_reaction_choice_1": "Matching his way of owing no one, you say you will take the notebook through formal procedure too.",
    "c7_receipt_reaction_choice_2": "Saying a private record should be taken privately, you quietly take it.",
    "c7_receipt_reaction_choice_3": "Saying you can do without the notebook, you take only his testimony.",
    "c7_teller_reaction_choice_1": "Saying each of the four should decide, you leave with their contact details.",
    "c7_teller_reaction_choice_2": "You keep only the one person at least risk and erase the rest.",
    "c7_teller_reaction_choice_3": "Since even Do Yoonha can’t decide the other three names, you erase every name and write only the target numbers.",
    "c7_ticket_reaction_choice_1": "At 06:40 you actually go to the station and put the scene of not going on the record.",
    "c7_ticket_reaction_choice_2": "You use the ticket and go down, but with the files already submitted.",
    "c7_ticket_reaction_choice_3": "Touching neither ticket nor files, you wait one more day.",
    "c7_branch_quota_a": "Saying one sheet is chance, you gather the target sheets from all three branches.",
    "c7_branch_quota_b": "Choosing one line over a long explanation, you enlarge just the handwriting and attach it.",
    "c7_branch_quota_c": "Saying it is about who ordered, not who sold, you point only at the chain of command.",
    "c7_branch_quota_follow_a": "Saying the three already cut are parties to the same document, you list them as victims.",
    "c7_branch_quota_follow_b": "Saying this case closes first, you set the three past cases aside.",
    "c7_branch_quota_follow_c": "Saying their names are theirs to decide, you start making calls first.",
    "c7_route_system_trace": "To tell whether the blank approval boxes are chance, you follow all 19 and complete the table.",
    "c7_route_system_quiet": "Saying you are in no position to fight other people’s transfers, you close the table and handle only your own.",
    "c7_route_system_call": "Because the words of those who lived it come before the records, you contact the 17 transferred before you.",
    "c7_final_system_route_a": "So they never scatter into loose sheets again, you bind all 19 into one document and send it outside.",
    "c7_final_system_route_b": "Saying twelve hours can undo only one thing, you get your own canceled and bury the rest.",
    "c7_final_system_route_c": "Deciding not to hide that you are one row of the same table, you write your name in its last row.",
    "c7_evidence_turn_order": "Putting the day you asked and the day it was written on the same line, you submit it as it is.",
    "c7_evidence_turn_hold": "Saying you will keep this sequence to yourself, you leave it out of this document.",
    "c7_evidence_turn_share": "To the people moved before you, you send this sequence first.",
    "c7_ledger_evidence_turn": "Slotting the order date between the dates of your clues, you set out what came first.",
    "c7_counter_evidence_turn": "Slotting the order date between the dates of your clues, you set out what came first.",
    "c7_paper_evidence_turn": "Slotting the order date between the dates of your clues, you set out what came first.",
    "c7_route_system_evidence_turn": "Slotting the order date between the dates of your clues, you set out what came first.",
    "c7_start_stand_gather": "Packing can wait, you decide; you leave the empty boxes and spend the remaining 48 hours gathering files.",
    "c7_start_stand_appeal": "Calling it a transfer decided without a single question, you point to the blank approval box and file an appeal.",
    "c7_start_stand_accept": "Judging this is not the place to fight, you accept the Yeongdong posting and start with the handover list.",
    "c7_start_stand_signature": "To the man whose desk you kept, this time you open your own papers first.",
    "c7_start_open_gather": "Packing can wait, you decide; you leave the empty boxes and spend the remaining 48 hours gathering files.",
    "c7_start_open_appeal": "Calling it a transfer decided without a single question, you point to the blank approval box and file an appeal.",
    "c7_start_open_accept": "Judging this is not the place to fight, you accept the Yeongdong posting and start with the handover list.",
    "c7_start_open_signature": "With a channel you opened once already, you send this document up through the same door.",
    "c7_start_name_gather": "Packing can wait, you decide; you leave the empty boxes and spend the remaining 48 hours gathering files.",
    "c7_start_name_appeal": "Calling it a transfer decided without a single question, you point to the blank approval box and file an appeal.",
    "c7_start_name_accept": "Judging this is not the place to fight, you accept the Yeongdong posting and start with the handover list.",
    "c7_start_name_signature": "The procedure you once opened in someone else’s name, you open again, this time with your own name in it."
  },
  "pack": {
    "clue": {
      "title": "The Order Written First",
      "text": "The transfer order is dated 12 days before the investigation began. This posting is not a result of the case but an answer prepared before it."
    },
    "outcomes": {
      "c7_after_stand": {
        "tag": "People First",
        "title": "You met everyone who gave you files in one day",
        "text": "The document moved not one line. Instead, you now know everything those people gave up."
      },
      "c7_after_open": {
        "tag": "Originals Handed Over",
        "title": "You used up the last day your access worked",
        "text": "The external auditor received the originals. You were not on the 06:40 train the next day, and that went on the record too."
      },
      "c7_after_alone": {
        "tag": "Quiet Exit",
        "title": "You packed without telling anyone",
        "text": "There was no fuss. The other names on the document stayed, and they don’t know where you are."
      }
    },
    "continuityChallenges": {
      "c6_after_stand": {
        "title": "Don’t Turn a Kept Desk Into a Bill",
        "text": "The standard that kept the desk beside you now points at you. Find the choice that applies that standard to yourself too."
      },
      "c6_after_open": {
        "title": "Find Who the Disclosure Missed",
        "text": "You opened the conditions, but the experiment remained. Find who that disclosure passed over, and a hidden clue may open."
      },
      "c6_after_name": {
        "title": "Open the Same Procedure in Your Name",
        "text": "The procedure you closed under someone else’s name is now your turn. A choice that sets it right fairly lowers the pressure."
      }
    }
  }
};
