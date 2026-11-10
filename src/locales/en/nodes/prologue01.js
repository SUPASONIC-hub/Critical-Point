/**
 * 프롤로그 01 (src/nodes/prologue01.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "p1_start": {
      "title": "Last Trainee Task",
      "text": "That desk with no nameplate is yours; you’re 3 months into your traineeship. Assistant Manager Oh Jinwoo pulls up a review file for you: a facility loan for Onsae Packaging, filed by Gangseo Branch, due for approval this Thursday. 'Last task of your traineeship. Just make sure the numbers add up.' But the total debt on the summary sheet is 40 million won short of the sum of its items. Put the missing line back in, and the debt-to-equity ratio tops 180%. At that point the branch can’t approve the loan on its own. You put a pencil dot beside the line.",
      "memo": [
        "Onsae Packaging facility loan, 380 million won -- filed at Gangseo Branch",
        "Summary total debt 1.142 billion won / sum of items 1.182 billion won",
        "Missing line: July 2022 borrowing, 40 million won",
        "Debt-to-equity 178.4% -> 184.7% -- branch approval only under 180%"
      ],
      "choices": {
        "p1_start_draft": {
          "label": "Finish the draft per the summary; deal with the total later"
        },
        "p1_start_note": {
          "label": "Log the 40 million won gap in the review record first"
        },
        "p1_start_source": {
          "label": "Ask the Gangseo Branch officer first, without blame"
        },
        "reframe": {
          "label": "Ask how past errors like this played out"
        }
      },
      "place": "Head office, 6th floor, Corporate Finance Strategy Team · Trainee desk",
      "clock": "Monday, October 17, 2022 · 09:00",
      "question": "The summary total is off by exactly one line. What do you do first?",
      "lead": "The desk between the copier and the window still has no nameplate, and a new review file is open on the monitor."
    },
    "p1_counter": {
      "title": "Beside Window 4",
      "text": "At Window 4, a young teller is walking a customer through a product. 'The principal isn’t guaranteed.' He pauses, then adds, 'But everyone’s doing it these days.' You pass by without asking his name. At the loan desk sits Jung Haerin, head of Onsae Packaging. When you ask about the missing line, Jung answers at once. 'We borrowed that from Saebom Credit Union in July. To pay our 11 employees.' The summary sheet the tax accountant made has no field for it. The general ledger has it down as is. Even the repayment schedule is there.",
      "memo": [
        "Gangseo Branch sales board -- 3 'Seller of the Month' stickers",
        "Saebom Credit Union loan, 40 million won -- July 2022, for wages",
        "Summary sheet: 5 debt fields -- no field for credit-union borrowing",
        "Onsae Packaging: 11 employees · deliveries start November 1"
      ],
      "choices": {
        "p1_counter_return": {
          "label": "Leave the ledger for later; head back with what you saw"
        },
        "p1_counter_request": {
          "label": "Formally request a ledger copy instead of the summary"
        },
        "p1_counter_explain": {
          "label": "Explain to Jung Haerin why the 40 million won matters"
        },
        "reframe": {
          "label": "Ask how past errors like this played out"
        },
        "p1_counter_evidence_turn": {
          "label": "Find and open the document that approved the summary form"
        }
      },
      "place": "KD Bank Gangseo Branch, banking hall",
      "clock": "Tuesday, October 18, 2022 · 10:00",
      "question": "The person behind the missing line is sitting at the counter. What do you do?",
      "lead": "The ticket machine calls number 84, and this month’s rankings hang on the board by the entrance."
    },
    "p1_mentor": {
      "title": "Late Means Wrong",
      "text": "Assistant Manager Oh turns his monitor toward you. Once a case goes up to the head-office credit review team, it takes 18 business days on average. 'You’re right. It’s 184.7%. But write that number down, and Onsae Packaging misses November 1.' For the first time, he talks about his father. In 2009, Oh Sangchul, manager of the Maetan branch in Suwon, processed one exception approval a day late. In that time, the client went to another bank. Three months later, he was transferred to an oversight desk. 'I was eighteen. Around here, whoever’s late is wrong.'",
      "memo": [
        "Head-office credit review takes 18 business days on average",
        "Oh Sangchul -- 2009, Suwon Maetan branch manager, approval one day late",
        "Transferred to an oversight desk three months later · early retirement 5 years later",
        "Oh Jinwoo: 'Whoever’s late is wrong'"
      ],
      "choices": {
        "p1_mentor_ask": {
          "label": "Offer to go over the steps that could cut the 18 days"
        },
        "p1_mentor_agree": {
          "label": "Concede speed is right; keep the Thursday approval date"
        },
        "p1_mentor_listen": {
          "label": "Hear his father’s story out until the coffee goes cold"
        },
        "reframe": {
          "label": "Ask how past errors like this played out"
        },
        "p1_mentor_evidence_turn": {
          "label": "Find and open the document that approved the summary form"
        }
      },
      "place": "Head office, 6th floor, Corporate Finance Strategy Team · Night",
      "clock": "Wednesday, October 19, 2022 · 21:00",
      "question": "Your mentor brings up his father for the first time. How do you spend this night?",
      "lead": "Only two desks on the whole floor are lit, and two convenience-store coffees are set down on the desk."
    },
    "p1_review": {
      "title": "The empty signature field",
      "text": "The trainee review is booked for 10 minutes. Team Head Yoon Sanghyuk wears a plain navy suit and smiles only when he shakes your hand. Of the five items on the form, he enters a 5 in the speed field and nowhere else. 'I’ll fill in the rest later. Good catch on the 40 million won.' He closes the tablet. The speed of it is his answer. 'But write that number down, and 11 people won’t make it through November. I never said your judgment was wrong. I just decide where it gets to stand.' The evaluator’s signature line is blank.",
      "memo": [
        "Trainee review, 10 minutes -- 1 question",
        "Of 5 evaluation items, one filled: speed 5/5",
        "Evaluator signature line -- blank",
        "Yoon Sanghyuk: 'I’ll fill in the rest later'"
      ],
      "choices": {
        "p1_review_fill": {
          "label": "Ask him to fill the other four fields and sign now"
        },
        "p1_review_people": {
          "label": "Bring up Onsae Packaging’s 11 workers before the form"
        },
        "p1_review_speed": {
          "label": "Take the speed score; be out within 10 minutes"
        },
        "reframe": {
          "label": "Ask how past errors like this played out"
        },
        "p1_review_evidence_turn": {
          "label": "Find and open the document that approved the summary form"
        }
      },
      "place": "Head office, 6th floor, Team Head’s office",
      "clock": "Thursday, October 20, 2022 · 11:00",
      "question": "Only one of five fields is filled, and the signature line is blank. How do you use these 10 minutes?",
      "lead": "The door opens, and the snap of a tablet cover closing reaches you first."
    },
    "p1_final": {
      "title": "Where to Write It",
      "text": "Again, only two desks on the 6th floor are lit. The approval result goes out to Gangseo Branch at nine tomorrow morning. Assistant Manager Oh drags a chair over and sits down. '40 million won, 184.7%. You found all that. Now you just decide where to write it.' He holds up three fingers. 'Write it under your name, and this case doesn’t go out tomorrow. Write it under mine, and I take it on. Just say it out loud, and it lands nowhere, and your trainee tag comes off Friday.'",
      "memo": [
        "Approval papers due out -- Friday 09:00",
        "Review opinion field -- still blank",
        "Trainee evaluation final -- Friday",
        "Evaluator signature line -- blank as of Thursday evening"
      ],
      "choices": {
        "p1_final_call": {
          "label": "Say you’ll call Jung Haerin yourself before writing"
        },
        "p1_final_oral": {
          "label": "Leave the field blank and report only verbally"
        },
        "p1_final_write": {
          "label": "Write 40 million won and 184.7% in the opinion field"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Head office, 6th floor, Corporate Finance Strategy Team · Night",
      "clock": "Thursday, October 20, 2022 · 19:00",
      "question": "Before tonight is out, you have to decide where and how to record the 40 million won you found. What do you do?",
      "lead": "The opinion field sits open with the cursor blinking in the first box, and the Team Head’s light is already off."
    },
    "p1_aftershock": {
      "title": "Friday, Nine A.M.",
      "text": "The approval papers come off the printer; in 20 minutes they go down to Gangseo Branch. The opinion field can still be edited until the final check. The 40 million won came up twice at yesterday’s team meeting: 'the trainee made a good catch,' and 'this one goes through within the branch limit.' Assistant Manager Oh glances at the opinion field. 'This is your last chance.' On the trainee form, the Team Head filled in only one field in the end: speed. The one line you choose this morning will stop you for 3 seconds, 3 years from now, in front of Article 7 of some contract.",
      "memo": [
        "Approval papers printed 08:40 · sent 09:00",
        "Mentions at yesterday’s team meeting: 2 -- praise 1, schedule 1",
        "Final check of the opinion field 08:52",
        "Filled on the trainee form: only 'speed'"
      ],
      "choices": {
        "p1_after_credit": {
          "label": "File it under Oh Jinwoo’s name and let him owe you one"
        },
        "p1_after_record": {
          "label": "Write the 40 million won in the field under your own name"
        },
        "p1_after_speed": {
          "label": "Say it aloud only; send the papers down at nine as is"
        }
      },
      "place": "Head office, 6th floor · By the printer",
      "clock": "Friday, October 21, 2022 · 08:40",
      "question": "The papers go down in 20 minutes. How do you close out this morning?"
    },
    "p1_ledger": {
      "title": "A Form with Five Fields",
      "text": "Before heading back to head office, you look at the summary form. 'Simplified Financial Summary (issued 2021.3)'. It has only five debt fields, and none for money borrowed from a credit union. 'Other' takes only one line. On the subway, you call Assistant Manager Oh, and he goes quiet for about 3 seconds. 'That form came out of our team. Adding fields came up last year too. The conclusion was that it would make branches spend longer on paperwork.'",
      "memo": [
        "'Simplified Financial Summary' -- issued March 2021, 5 debt fields",
        "Issued by: head office Corporate Finance Strategy Team",
        "41 branches use the same form",
        "Adding fields -- discussed once in 2021, shelved"
      ],
      "choices": {
        "p1_ledger_choice_3": {
          "label": "Fix just this case by hand and move on"
        },
        "p1_ledger_choice_1": {
          "label": "Warn the other branches that use the form first"
        },
        "p1_ledger_choice_2": {
          "label": "File a formal proposal about the five debt fields"
        }
      },
      "place": "KD Bank Gangseo Branch · 2nd-floor records room",
      "clock": "Tuesday, October 18, 2022 · 17:00",
      "question": "The summary form has only five debt fields, and your team made it. What do you do?"
    },
    "p1_scoreboard": {
      "title": "The First Scoreboard",
      "text": "Assistant Manager Oh draws a vertical line on the whiteboard and writes his name on the left, yours on the right. 'The trainee review has five items. But only one of them actually decides your score.' He circles speed and nothing else. 'I like to keep a scoreboard. Without one, people argue about it later.' A 1 goes on the left, a 0 on the right. 'When this case is done, you get a point too.'",
      "memo": [
        "Whiteboard scoreboard -- Oh Jinwoo 1 / you 0",
        "Of 5 trainee items, only speed actually counts",
        "Agreed never to erase the scoreboard",
        "35 hours until the approval papers go out"
      ],
      "choices": {
        "p1_scoreboard_choice_3": {
          "label": "Go by the scoreboard and fill the speed field first"
        },
        "p1_scoreboard_choice_1": {
          "label": "Suggest putting the 11 employees up instead of your name"
        },
        "p1_scoreboard_choice_2": {
          "label": "Check first who fills in the 'accuracy' field"
        }
      },
      "place": "Head office, 6th floor · By the whiteboard",
      "clock": "Wednesday, October 19, 2022 · 22:00",
      "question": "Your mentor has drawn a scoreboard for the first time. What do you do with it?"
    },
    "p1_blank": {
      "title": "I’ve Left It Blank Too",
      "text": "The printout of the evaluation form is still sitting on the printer outside the Team Head’s office. Manager Han Seoyun, passing by, looks at the blank signature line. She stays later than anyone on this team, and there’s always an old review report open on her tablet. She turns the printout face down. 'If that field stays blank, later on nobody knows who filled it in.' Then she adds, 'I’ve left it blank too.'",
      "memo": [
        "Evaluation printout -- still on the printer outside the Team Head’s office",
        "Manager Han Seoyun: 'I’ve left it blank too'",
        "An old review report open on her tablet",
        "Review ended 11:10"
      ],
      "choices": {
        "p1_blank_choice_1": {
          "label": "Ask Han Seoyun now what happened back then"
        },
        "p1_blank_choice_3": {
          "label": "Walk on without asking; return to the approval papers"
        },
        "p1_blank_choice_2": {
          "label": "Note down, with today’s date, that the line is blank"
        }
      },
      "place": "Head office, 6th floor, hallway outside the Team Head’s office",
      "clock": "Thursday, October 20, 2022 · 11:20",
      "question": "Han Seoyun looked at that blank, said one thing, and walked on. What do you do?"
    },
    "p1_ledger_reaction": {
      "title": "The Binder with Seal Tape",
      "text": "Back at head office, Lim Kyungsoo, head of the Corporate Credit Review Team, stops you in the hallway. He’s the kind of man who files a printout of every document in a binder. 'That form came across my desk too. I opposed it, and the name of whoever opposed it never made the minutes.' He tucks the tape-sealed binder under his arm. 'Learn one thing. Around here, putting it on record is much harder than finding it.'",
      "memo": [
        "Lim Kyungsoo -- opposed the form in the 2021 talks",
        "A dissent that never made the minutes"
      ],
      "choices": {
        "p1_ledger_reaction_choice_2": {
          "label": "Ask him to put that dissent on record, even now"
        },
        "p1_ledger_reaction_choice_1": {
          "label": "Hear out why Lim Kyungsoo opposed it back then"
        },
        "p1_ledger_reaction_choice_3": {
          "label": "Say this case is urgent, nod, and head upstairs"
        }
      },
      "place": "Head office, 1st floor, hallway by the elevators",
      "clock": "Tuesday, October 18, 2022 · 19:00",
      "question": "Lim Kyungsoo opposed that form, and his name isn’t in the minutes. What do you ask?"
    },
    "p1_scoreboard_reaction": {
      "title": "A Text at One A.M.",
      "text": "A text comes in from Jung Haerin. 'I thought it was shameful that the line wasn’t on the summary. Thinking it over, what’s shameful isn’t me. It’s my numbers.' A photo of the November delivery schedule is attached. On the first line, in red pen: '11/1 08:00'. The last sentence is short. 'It’s fine if it’s late. Just don’t let it go down as wrong.'",
      "memo": [
        "Jung Haerin text 01:04 -- 'Don’t let it go down as wrong'",
        "Photo of the November delivery schedule -- '11/1 08:00'"
      ],
      "choices": {
        "p1_scoreboard_reaction_choice_3": {
          "label": "Put the phone face down; reply after approval"
        },
        "p1_scoreboard_reaction_choice_1": {
          "label": "Reply that you’ll confirm it in person today"
        },
        "p1_scoreboard_reaction_choice_2": {
          "label": "Write back exactly how far the papers have gotten"
        }
      },
      "place": "Head office, 6th floor · Empty desk",
      "clock": "Thursday, October 20, 2022 · 01:00",
      "question": "A text arrives: 'Don’t let it go down as wrong.' How do you reply?"
    },
    "p1_blank_reaction": {
      "title": "Oh Jinwoo at Eighteen",
      "text": "Assistant Manager Oh is waiting by the copier with a sheet of paper: a copy of a 2009 personnel notice, with 'transferred to oversight desk' next to the name Oh Sangchul. 'Why he was a day late isn’t written anywhere. My father was rechecking the papers that day.' He puts the sheet in his pocket. 'That’s why I chose never to be late, and it’s what I taught you too. But you haven’t chosen yet.'",
      "memo": [
        "Copy of 2009 personnel notice -- Oh Sangchul, transferred to oversight desk",
        "No field for why it was a day late"
      ],
      "choices": {
        "p1_blank_reaction_choice_2": {
          "label": "Say the form needs a 'why one day late' field"
        },
        "p1_blank_reaction_choice_1": {
          "label": "Ask Oh Jinwoo for a copy of that sheet too"
        },
        "p1_blank_reaction_choice_3": {
          "label": "Say there’s no time to choose; finish the papers"
        }
      },
      "place": "Head office, 6th floor, by the copier",
      "clock": "Thursday, October 20, 2022 · 17:00",
      "question": "Your mentor waits with a copy of a 13-year-old personnel notice. What do you say?"
    },
    "p1_branch_ledger": {
      "title": "On Paper, We’re Just Numbers",
      "text": "When you finish explaining, Jung Haerin picks up a bag. 'Then come and see. On paper, our company is just numbers.' In the Hwagok-dong workshop, 11 people are at work. Of the two packing machines from 1998, one has stopped three times this morning alone. On the wall, 11 July pay slips are pinned up with thumbtacks. Jung points to July in the ledger. 'Without this 40 million won, we’d have had to let four people go that month. That’s why I was ashamed it wasn’t on the summary.'",
      "memo": [
        "Hwagok-dong workshop -- 11 employees, 2 packing machines (1998 models)",
        "3 breakdowns this morning -- line down 47 minutes",
        "Deliveries start November 1 -- 80 million won a month",
        "11 July pay slips -- paid with the Saebom Credit Union loan"
      ],
      "choices": {
        "p1_branch_ledger_a": {
          "label": "Write down the names on all 11 pay slips, one by one"
        },
        "p1_branch_ledger_b": {
          "label": "Photograph the July page; ask for it formally"
        },
        "p1_branch_ledger_c": {
          "label": "Check only the machines and head straight back"
        }
      },
      "place": "Onsae Packaging workshop, Hwagok-dong",
      "clock": "Tuesday, October 18, 2022 · 15:00",
      "question": "On paper it was a number. Here it’s eleven people. What do you do while you’re here?"
    },
    "p1_branch_ledger_follow": {
      "title": "No Field, So We Left It Out",
      "text": "Jung Haerin calls the tax accountant who prepared the summary, on speaker. 'The form the branch gave us has no field for that. Other is one line, and we put accounts payable there.' The accountant adds, 'Everyone files it that way. It’s never been a problem.' When the call ends, Jung says, 'That’s scarier.' For the first time, Jung says the word default. 'We can live with late. But if we go down as having hidden it, that we can’t live with.'",
      "memo": [
        "Tax accountant’s statement -- 'The form has no field for that'",
        "Other field, 1 line -- taken by accounts payable",
        "'Everyone files it that way' -- no record of anyone objecting",
        "Jung Haerin: 'We can live with late'"
      ],
      "choices": {
        "p1_branch_ledger_follow_a": {
          "label": "Take down Jung Haerin’s word that nothing was hidden"
        },
        "p1_branch_ledger_follow_b": {
          "label": "Log the accountant call, dated, in the review record"
        },
        "p1_branch_ledger_follow_c": {
          "label": "Leave the form issue for head office; stop for today"
        }
      },
      "place": "Onsae Packaging workshop · Back office",
      "clock": "Tuesday, October 18, 2022 · 16:20",
      "question": "That line wasn’t hidden. There was just no field for it. How do you handle that?"
    },
    "p1_route_system": {
      "title": "27 Cases, Reported Verbally",
      "text": "You ask how past errors like this played out, and Lim Kyungsoo, head of the Corporate Credit Review Team, opens the terminal in the 8th-floor review records room for you. Anything past its retention period has already been destroyed. In the 5 years that remain, 31 cases closed within the branch limit later had their numbers recalculated. Most end on the same last line. 'Reported verbally.' The people who first caught the error were mostly trainees or in their first year at the bank. 'It’s always the youngest who finds it. And nobody ever puts it on record.'",
      "memo": [
        "Of 5 years of remaining branch approvals, 31 recalculated",
        "Papers corrected: 4 / 'Reported verbally': 27",
        "Of the 27 who found errors, 21 were trainees or first-years"
      ],
      "choices": {
        "p1_route_system_find": {
          "label": "Find the 27 who only reported verbally and tell them"
        },
        "p1_route_system_file": {
          "label": "File the list of 27 as an official credit review record"
        },
        "p1_route_system_drop": {
          "label": "Shelve the list and get just this one case right"
        },
        "p1_route_system_evidence_turn": {
          "label": "Find and open the document that approved the summary form"
        }
      },
      "place": "Head office, 8th floor, review records room",
      "clock": "Thursday, October 20, 2022",
      "question": "Of 31 cases recalculated in 5 years, 27 ended with 'Reported verbally.' What do you do with this list?"
    },
    "p1_final_system_route": {
      "title": "The 28th Line",
      "text": "By the records-room window, the last pages of the 27 cases lie side by side. Every one ends the same way. 'Reported verbally.' The Onsae Packaging case goes down at nine tomorrow morning. Team Head Lim sets a bundle of printouts on the window ledge. 'Whatever you write tomorrow, there’ll be a 28th. The only question left is whether it joins the four that were fixed or the ones that never got past talk.'",
      "memo": [
        "27 documents ending in 'Reported verbally'",
        "Onsae Packaging approval papers out: Friday 09:00",
        "Review opinion field: still blank"
      ],
      "choices": {
        "p1_final_system_route_b": {
          "label": "Leave the rule; correct only the Onsae Packaging case"
        },
        "p1_final_system_route_a": {
          "label": "Propose barring limit decisions on the summary alone"
        },
        "p1_final_system_route_c": {
          "label": "Propose a form field for whoever finds an error"
        }
      },
      "place": "Head office, 8th floor, review records room · By the window",
      "clock": "Thursday, October 20, 2022 · 22:00",
      "question": "By tomorrow morning there will be a 28th line. Which side do you put it on?"
    },
    "p1_evidence_turn": {
      "title": "Who Made the Form",
      "text": "You hold the clue up against the form number, and the distribution approval for the 'Simplified Financial Summary' opens. March 9, 2021, issued to 41 branches. The author field shows Assistant Manager Oh Jinwoo’s name; the approver’s signature line is blank. Branch requests for more fields got no reply on record. Ban Jaewook, an investigator with Internal Audit, opens his worn black notebook to a fresh page. 'The maker’s name is here, and the approver’s isn’t. I call a document like this a rule nobody took responsibility for.'",
      "memo": [
        "'Simplified Financial Summary' distribution approval -- March 9, 2021",
        "Author: Assistant Manager Oh Jinwoo / approver signature line: blank",
        "2 branches asked for more fields -- no reply on record"
      ],
      "choices": {
        "p1_evidence_turn_hold": {
          "label": "Hold this record until the trainee review is over"
        },
        "p1_evidence_turn_audit": {
          "label": "Formally hand the blank approver line to Internal Audit"
        },
        "p1_evidence_turn_share": {
          "label": "First alert officers at the 41 branches using the form"
        }
      },
      "place": "Head office, 6th floor · Document management terminal",
      "clock": "Thursday, October 20, 2022 · 18:00",
      "question": "The form’s maker is named, but its approver isn’t. How do you use this record?"
    }
  },
  "echoReplies": {
    "p1_start_source": "The officer who picks up says, 'That field always bothered me too.' The raw data will come in the afternoon. But the draft won’t be finished today.",
    "p1_start_note": "Once it is in the record, the number doesn’t go away. Oh Jinwoo can open the same record, and the moment he sees that line, he starts counting days.",
    "p1_start_draft": "The draft is done in an hour. The 40-million-won line stays as it is, with the pencil dot on it.",
    "p1_counter_explain": "When you finish explaining, Jung Haerin touches the papers for the first time. 'So does that mean we hid it?' You can’t answer that question yet.",
    "p1_counter_request": "The formal request is logged. The moment it is logged, this is no longer 'a case that closes quietly at the branch.'",
    "p1_counter_return": "Back at your desk, you can fix the draft today. The ledger doesn’t come tomorrow, or the day after.",
    "p1_mentor_listen": "You hear him out, and Oh Jinwoo tells the part about being eighteen twice. The second time, he leaves out why his father rechecked the papers that day.",
    "p1_mentor_ask": "Going through the procedure gets the 18 business days down to 12. That still doesn’t make November 1.",
    "p1_mentor_agree": "When you agree, Oh Jinwoo smiles for the first time. 'Now you sound like one of the team.' You can’t tell whether that is praise.",
    "p1_review_people": "When you bring up the 11, Yoon Sanghyuk takes his hand off the tablet. Then he asks, 'Do you know all 11 of their names?'",
    "p1_review_fill": "When you ask him to fill them in now, he picks up a pen and puts it down. 'Later.' The review ends 2 minutes early.",
    "p1_review_speed": "It ends within 10 minutes, and the evaluation is safe. The 5 in the speed field is the safest number on this team.",
    "p1_final_call": "You call, and Jung Haerin picks up on the third ring. Whichever you choose, Jung will know the reason by tomorrow morning.",
    "p1_final_write": "You type the figures as they are, and the cursor moves to the next box. The field stays open until the final check at 8:52 tomorrow morning, and if it closes as is, the case won’t go out at nine.",
    "p1_final_oral": "Said out loud and nowhere else, it gets a mention at a meeting, and that’s it. A mention is not a record, and in this organization what isn’t on record never happened. The opinion field stays open and blank until the final check tomorrow morning.",
    "p1_after_credit": "Oh Jinwoo looks at you for a moment. 'I’ll pay this back.' On the whiteboard scoreboard, in the right column under your name, he writes a 1 for the first time.",
    "p1_after_record": "With your name on it, the papers don’t go down at nine. At that afternoon’s team meeting your name is called twice, and neither time is a question.",
    "p1_after_speed": "The papers go down on time. The trainee tag comes off that day, and the 40 million won is never written in any field.",
    "p1_ledger_choice_1": "You alert them, and four branches reply that same day. Two of them were already correcting the same field by hand.",
    "p1_ledger_choice_2": "The proposal is logged. The department handling it is the one that made the form, and there is no deadline for a reply.",
    "p1_ledger_choice_3": "Fixed by hand, this case adds up. The next papers from the 41 branches still come with five fields.",
    "p1_scoreboard_choice_1": "Oh Jinwoo uncaps the marker again. Halfway through drawing 11 columns, he says, 'This isn’t a scoreboard anymore.' He doesn’t erase it, though.",
    "p1_scoreboard_choice_2": "It turns out one person fills the accuracy field: the Team Head. And that field has been blank for 3 years.",
    "p1_scoreboard_choice_3": "The speed field gets filled that night. The other four are still blank when the next trainee’s turn comes.",
    "p1_blank_choice_1": "When you ask, Han Seoyun closes her tablet. 'I won’t tell you now. But if you leave that field blank, I’ll tell you then.'",
    "p1_blank_choice_2": "You write it down, and the date is on record. October 20, 2022, evaluator signature line blank. For 3 years, no one looks for that line.",
    "p1_blank_choice_3": "You walk on, and nothing happens. On this team, nothing happening is the most common result.",
    "p1_ledger_reaction_choice_1": "Hearing him out takes 40 minutes. As he clips and unclips the binder, the story goes back as far as 2011.",
    "p1_ledger_reaction_choice_2": "When you ask, Lim Kyungsoo laughs. 'If I write it now, it isn’t a record. It’s gossip.' Still, he slips a note into the back of the binder.",
    "p1_ledger_reaction_choice_3": "With just a nod, the exchange ends in 20 seconds. The bundle stays under his arm, and you don’t know what you missed.",
    "p1_scoreboard_reaction_choice_1": "You reply, and at two in the morning Jung Haerin sends one line: 'Thank you.' Your promise runs out at the end of today.",
    "p1_scoreboard_reaction_choice_2": "Written out as it stands, the message runs nine lines. The last one reads, 'Nothing has been decided yet.'",
    "p1_scoreboard_reaction_choice_3": "Face down, the screen stays quiet. When you turn it over in the morning, only the read receipt is there, and no reply.",
    "p1_blank_reaction_choice_1": "When you ask, he switches the copier back on. For the first time in 13 years, there are two copies.",
    "p1_blank_reaction_choice_2": "When you say it, Oh Jinwoo is quiet for a while, then asks, 'If that field had existed, what would my father have written?' Neither of you knows.",
    "p1_blank_reaction_choice_3": "Finishing the papers first saves 30 minutes. Oh Jinwoo leaves before you, the sheet still in his pocket.",
    "p1_branch_ledger_a": "As you write, you learn that four of the 11 nearly quit in July but stayed. The sheet with their names fits in no form.",
    "p1_branch_ledger_b": "You have the photo. Once it comes in formally, head office has grounds to look into this case.",
    "p1_branch_ledger_c": "One machine is fine and one isn’t. That alone changes no field on the papers.",
    "p1_branch_ledger_follow_a": "Taken down word for word, it is two sentences. Those two lines become the only paper that can later stop anyone saying 'they hid it.'",
    "p1_branch_ledger_follow_b": "When it goes into the record, the accountant’s name goes in with it. He didn’t know this call would be recorded.",
    "p1_branch_ledger_follow_c": "Stopping here leaves the evening free. At head office, nobody brings up the form first.",
    "p1_route_system_file": "Once on the official record, the 27 cases become a list. The name of whoever made the list stays on the same page.",
    "p1_route_system_find": "You track them down: 19 are still at the bank. Six of them no longer remember what they found.",
    "p1_route_system_drop": "Shelving it keeps this case clean. The 27 are still 27 next year, and the number only moves up.",
    "p1_final_system_route_a": "With the rule in place, the ledger comes with every set of papers from now on. This set goes down a day before the rule takes effect.",
    "p1_final_system_route_b": "One case is corrected. The next summaries from 41 branches come up with the same five fields as today.",
    "p1_final_system_route_c": "With the field in place, the finder’s name stays. From that moment, it is also the name of the one responsible.",
    "p1_evidence_turn_audit": "You hand it over, and a case number goes at the top of that page in Ban Jaewook’s notebook. The name in the author field is Oh Jinwoo, and he doesn’t know it yet.",
    "p1_evidence_turn_hold": "You hold it, and your traineeship ends quietly. Meanwhile the 41 branches send up nine more sets of papers on the same form.",
    "p1_evidence_turn_share": "You alert them, and 11 branches reply within three days. Three of them were already drawing in the field by hand.",
    "p1_counter_evidence_turn": "Follow the form number and the distribution record turns up. The hand that made it and the hand that approved it may not be in the same document.",
    "p1_mentor_evidence_turn": "Follow the form number and the distribution record turns up. The hand that made it and the hand that approved it may not be in the same document.",
    "p1_review_evidence_turn": "Follow the form number and the distribution record turns up. The hand that made it and the hand that approved it may not be in the same document.",
    "p1_route_system_evidence_turn": "Follow the form number and the distribution record turns up. The hand that made it and the hand that approved it may not be in the same document."
  },
  "choiceVoiceLines": {
    "p1_start_source": "The person who made the papers comes before the papers, so you call the Gangseo Branch officer and ask, without blame.",
    "p1_start_note": "It has to be kept before it’s forgotten, so you first log in the review record that the total is off by 40 million won.",
    "p1_start_draft": "Thursday’s approval comes first, so you finish the draft on the summary’s numbers and put off the mismatched total.",
    "p1_counter_explain": "You’re not here to fault the numbers, so you walk Jung Haerin through why this 40 million won matters.",
    "p1_counter_request": "The summary isn’t enough to judge on, so you formally ask the branch loan officer for a copy of the ledger.",
    "p1_counter_return": "What you saw today will do, so you leave the ledger for later and head back.",
    "p1_mentor_listen": "Tonight this comes before the numbers, so you hear out his father’s story until the coffee goes cold.",
    "p1_mentor_ask": "There must be a third way besides late and wrong, you say, and suggest going over the steps together to cut the 18 business days.",
    "p1_mentor_agree": "Miss November 1 and 11 people stop, so you agree speed is right and keep to Thursday’s schedule.",
    "p1_review_people": "Something is more urgent than your score, so you bring up Onsae Packaging’s 11 employees before he closes the form.",
    "p1_review_fill": "You need it before the 10 minutes are up, so you ask him to fill in the other four fields and the signature line now.",
    "p1_review_speed": "The tablet is already closed, so you take the speed score and end the review within 10 minutes.",
    "p1_final_call": "The person should hear before the papers do, so you say you’ll call Jung Haerin yourself before writing, whichever way it goes.",
    "p1_final_write": "A number you found belongs where you found it, so you write 40 million won and 184.7% into the opinion field as they are.",
    "p1_final_oral": "This case has to go out, so you say you’ll leave the opinion field blank and report only verbally.",
    "p1_after_credit": "This case has to go out at nine, so you file the opinion under Assistant Manager Oh Jinwoo’s name and let him owe you one.",
    "p1_after_record": "The finder’s name has to stay, so you write the 40 million won into the opinion field under your own name.",
    "p1_after_speed": "Nine o’clock can’t slip, so you only say it aloud and send the papers down as they are.",
    "p1_ledger_choice_1": "This isn’t just about Onsae Packaging, so you first alert the officers at other branches who use the same form.",
    "p1_ledger_choice_2": "What ended in talk last year goes on paper this time: you file a formal proposal about the form’s five debt fields.",
    "p1_ledger_choice_3": "There’s no time to touch the form, so you fix just this case by hand and move on.",
    "p1_scoreboard_choice_1": "You two aren’t the ones who win or lose, you say, and suggest putting Onsae Packaging’s 11 employees on the board instead of your name.",
    "p1_scoreboard_choice_2": "A chart with only one circle is hard to trust, so you suggest first checking who fills in the 'accuracy' field.",
    "p1_scoreboard_choice_3": "For trainees this game is the rule, so you go by the scoreboard and fill the speed field first.",
    "p1_blank_choice_1": "Feeling you could never ask again if you let it pass, you ask Han Seoyun now what happened back then.",
    "p1_blank_choice_2": "Before no one can tell who filled it in, you note down, with today’s date, that the signature line is blank.",
    "p1_blank_choice_3": "This is no time to look into someone else’s blanks, so you go back to the approval papers without asking.",
    "p1_ledger_reaction_choice_1": "The words that never made the record come first, so you hear out why Lim Kyungsoo opposed it back then.",
    "p1_ledger_reaction_choice_2": "If no name stays, it never happened, so you ask him to put that dissent on record, even now.",
    "p1_ledger_reaction_choice_3": "Thursday is right around the corner, so you just nod and go up to the 6th floor.",
    "p1_scoreboard_reaction_choice_1": "You won’t leave a message sent before dawn hanging, so you reply that you’ll confirm in person, today, that late is fine.",
    "p1_scoreboard_reaction_choice_2": "This is someone who needs facts more than comfort, so you write back exactly how far the papers have gotten.",
    "p1_scoreboard_reaction_choice_3": "There’s nothing you can promise right now, so you put off the reply until after approval and turn the phone face down.",
    "p1_blank_reaction_choice_1": "It isn’t a sheet he should carry alone, so you ask Oh Jinwoo for a copy of that notice for yourself.",
    "p1_blank_reaction_choice_2": "So that no one like Branch Manager Oh Sangchul comes along again, you say the form needs a field that records 'why one day late.'",
    "p1_blank_reaction_choice_3": "The approval deadline comes first, so you finish the approval papers without choosing.",
    "p1_branch_ledger_a": "You need to know who is behind the numbers, so you write down the names on all 11 pay slips, one by one.",
    "p1_branch_ledger_b": "What you saw has to be kept, so you photograph the July page of the ledger and say you’ll take it in formally.",
    "p1_branch_ledger_c": "It’s a facility loan, so the equipment is what matters; you check only the machines and head straight back to head office.",
    "p1_branch_ledger_follow_a": "These words mustn’t be polished, so you take down Jung Haerin’s statement that nothing was hidden, exactly as said.",
    "p1_branch_ledger_follow_b": "So you can answer whoever asks later, you put the call with the tax accountant, dated, into the review record.",
    "p1_branch_ledger_follow_c": "This isn’t the place to solve it, so you leave the form issue for head office and stop here for today.",
    "p1_route_system_file": "What ended in talk should go back on record, so you file the list of 27 as an official credit review record.",
    "p1_route_system_find": "The people should know before the record does, so you first find the 27 who only reported verbally and tell them.",
    "p1_route_system_drop": "It’s too big for a trainee to touch, so you shelve the list and get just this one case right.",
    "p1_final_system_route_a": "So the same error doesn’t end in talk again, you propose that no branch limit decision be made on the summary alone.",
    "p1_final_system_route_b": "The 28th won’t end in talk, you decide, so you leave the rule as it is and correct only the Onsae Packaging case.",
    "p1_final_system_route_c": "People keep finding errors only if the finder’s name stays, so you propose a field on the review form for whoever finds one.",
    "p1_evidence_turn_audit": "A document put into effect unsigned is a matter for audit, so you formally hand the blank approver line to Internal Audit.",
    "p1_evidence_turn_hold": "Bring it out now and the evaluation will be over first, so you hold this record until after the trainee review.",
    "p1_evidence_turn_share": "The people who use it should know first, so you alert the officers at the 41 branches using the same form.",
    "p1_counter_evidence_turn": "Laying the clue beside the summary form, you work out who made this form and who approved it.",
    "p1_mentor_evidence_turn": "Laying the clue beside the summary form, you work out who made this form and who approved it.",
    "p1_review_evidence_turn": "Laying the clue beside the summary form, you work out who made this form and who approved it.",
    "p1_route_system_evidence_turn": "Laying the clue beside the summary form, you work out who made this form and who approved it."
  },
  "pack": {
    "clue": {
      "title": "The Blank Approver Line",
      "text": "The 'Simplified Financial Summary' the branches use was issued to 41 branches by the Corporate Finance Strategy Team in March 2021. The author field of its distribution approval carries Assistant Manager Oh Jinwoo’s name, and the approver’s signature line is blank."
    },
    "outcomes": {
      "p1_after_credit": {
        "tag": "Credit Passed On",
        "title": "The Opinion Went Up Under the Mentor’s Name",
        "text": "The 40 million won is on the record, and the name beside it isn’t yours. On the scoreboard Oh Jinwoo drew on the whiteboard, a 1 has appeared under your name for the first time."
      },
      "p1_after_record": {
        "tag": "Name on Record",
        "title": "You Wrote the 40 Million Won Under Your Own Name",
        "text": "The papers didn’t go down at nine. You passed your traineeship, and from that day on you were someone this floor noticed."
      },
      "p1_after_speed": {
        "tag": "Speed Chosen",
        "title": "Said Out Loud; the Papers Went Down on Time",
        "text": "The trainee tag came off on Friday. One field was filled on the evaluation, and the 40 million won is in no field at all."
      }
    }
  }
};
