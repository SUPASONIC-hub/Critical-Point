/**
 * 사건 32 (src/nodes/case32.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c32_start": {
      "title": "07:40",
      "text": "The door of KD Capital’s Risk Management Department on the 12th floor opens, and 11 people in blue vests walk in. They are investigators from the Seoul Central District Prosecutors’ Office. The man in front holds up a sheet of paper. It is a search and seizure warrant (a document from a court allowing them to take records and items by force). At the same moment the same paper goes into the Group Strategy Office on the 33rd floor of headquarters and into Yoon Sanghyuk’s CEO office. The man introduces himself as Prosecutor Na Eunho and stops right at your desk. 'You’re the one who wrote the dissent, right? I read about it. Come in at two this afternoon as a witness (someone with no duty to testify who comes in to explain the facts).' As he puts a seal sticker on your monitor, he adds. 'I said witness. For now.'",
      "memo": [
        "3 search sites: Group Strategy Office (33rd floor), KD Capital CEO office, Risk Management Department",
        "Allegations: delayed losses on the Pyeongtaek officetel loans, the Roundhill sale price, Haeon Partners advisory fees",
        "Called in as a witness: today 14:00, Room 1108, Seoul Central District Prosecutors’ Office",
        "11 investigators, 60 flat-packed empty boxes"
      ],
      "choices": {
        "c32_start_list": {
          "label": "Sign only after checking the seizure list line by line"
        },
        "c32_start_hand": {
          "label": "Hand over your phone and prepare for the afternoon"
        },
        "c32_start_calm": {
          "label": "Tell your scared team first what they can refuse"
        },
        "reframe": {
          "label": "Count who probes like this have put on trial"
        }
      },
      "place": "KD Capital 12th Floor · Risk Management Office",
      "clock": "Tuesday, June 16 · 07:40",
      "question": "Investigators seal the desks, and the prosecutor tells you to come testify this afternoon. What do you do first?",
      "lead": "You swipe your badge and step off on the 12th floor. 60 folded empty boxes are stacked by the elevators."
    },
    "c32_boxes": {
      "title": "The Name on the Boxes",
      "text": "'They say you’re the only one who knows which boxes are Trigger Lab’s.' 40 Trigger Lab record boxes are stacked in the Group Strategy Office hallway, and investigators tag them with numbers one by one. Baek Arin, whose March resignation has gone unaccepted for three months, still has a desk on this floor. She stands and watches it being emptied. A woman who was always smooth is picking at her nails. Every box has a group legal team sticker on its side. 'Retention period expired. To be destroyed June 20.' That is four days away. The same handwriting as the Pyeongtaek boxes in the basement archive last week. Na Eunho opens one box. The label on the top file is your name. 1,106 pages of response records. 'Your name comes up the most. Yoon Sanghyuk’s hasn’t come up once yet.' He snaps the file shut. 'A bit much for someone who came to testify, isn’t it?'",
      "memo": [
        "40 Trigger Lab record boxes (printouts, external disks) -- legal team sticker 'to be destroyed June 20'",
        "Your response records: 1,106 pages",
        "Yoon Sanghyuk’s name in the boxes: 0 times",
        "Baek Arin’s 3 desk drawers, seized by noon"
      ],
      "choices": {
        "c32_boxes_seal": {
          "label": "Ask for your colleagues’ boxes to be sealed separately"
        },
        "c32_boxes_match": {
          "label": "Match the seized boxes to Trigger Lab’s own list, row by row"
        },
        "c32_boxes_mine": {
          "label": "Hand over the boxes with your name first to speed it up"
        },
        "reframe": {
          "label": "Count who probes like this have put on trial"
        },
        "c32_boxes_evidence_turn": {
          "label": "Match the 33rd-floor removal log to the seizure list"
        }
      },
      "place": "KD Financial Group HQ 33rd Floor · Group Strategy Office",
      "clock": "June 16 · 10:30",
      "question": "Your name comes up most in boxes that were due to be destroyed in four days. What do you do with them?",
      "lead": "Na Eunho needs someone who can recognize the Trigger Lab boxes, and he takes you up in the elevator to the 33rd floor."
    },
    "c32_room": {
      "title": "Last Month’s Signature",
      "text": "On the desk in Room 1108 of the Seoul Central District Prosecutors’ Office, Na Eunho sets down a gimbap roll wrapped in foil. 'I missed lunch. Want some? If not, I’ll eat it all.' The first question is not about the dissent from 3 years ago. He slides a sheet of paper across. A KD Capital 'Distressed Asset Sale Price Review' dated May 28. It is the sale at 30.7% of book value, and your electronic signature is in the reviewer field. That night you were in Singapore. At the company only one person can enter someone else’s electronic signature: Seok Jaewoo, the CEO’s chief of staff. 'The dissent is from 3 years ago. This signature is from last month. I investigate last month.' He chews his gimbap. 'So who wrote your name? Until I find that person, I’ll ask my questions as if you were a suspect (someone suspected of a crime and under investigation).'",
      "memo": [
        "Review dated May 28 -- you were in Singapore",
        "Sale price: 30.7% of book value, buyer Roundhill Capital",
        "Reviewer field: your electronic signature",
        "Authority to enter e-signatures for others: Seok Jaewoo, chief of staff, CEO office"
      ],
      "choices": {
        "c32_room_counsel": {
          "label": "Demand a lawyer and written confirmation you are a witness"
        },
        "c32_room_alibi": {
          "label": "Show your Singapore travel record to end the signature doubt"
        },
        "c32_room_plain": {
          "label": "Ask to leave colleagues out; tell your own moves in full"
        },
        "reframe": {
          "label": "Count who probes like this have put on trial"
        },
        "c32_room_evidence_turn": {
          "label": "Match the 33rd-floor removal log to the seizure list"
        }
      },
      "place": "Seoul Central District Prosecutors’ Office 11th Floor · Interview Room 1108",
      "clock": "June 16 · 14:00",
      "question": "A review signed in your name on a day you were away has turned up. How do you answer?",
      "lead": "At the end of the 11th-floor hallway of the Seocho-dong building, the door of a room that smells of gimbap is open."
    },
    "c32_notebook": {
      "title": "The Stickers Are Evidence Too",
      "text": "Ban Jaewook was on a regional audit tour, and he has driven up from Daejeon to the prosecutors’ office parking lot. His black notebook got a demand to submit too. It is the notebook the legal team tried to take six months ago. This time a court document is attached, so there is no way to refuse. Ban Jaewook takes the notebook out of the passenger seat. The 12 star stickers his daughter Seoa put on the cover are still there, and inside, next to Ha Yoonjae’s name, is a single flower sticker. 'The investigator says I can’t even peel off the stickers. Evidence stays exactly as it is.' He takes off his glasses. 'Seoa asked me on the phone earlier. Is Daddy’s notebook going to jail? I said no, but I’m not sure myself.' On the last page of the notebook, your name in pencil is still there.",
      "memo": [
        "Demand to submit Ban Jaewook’s notebook -- court-approved this time",
        "12 star stickers on the cover, 1 flower sticker next to Ha Yoonjae’s name",
        "Last page: your name in pencil, and that date",
        "Ban Seoa, 6th grade -- 'Is Daddy’s notebook going to jail?'"
      ],
      "choices": {
        "c32_notebook_later": {
          "label": "Put off the page with your name; finish the submission"
        },
        "c32_notebook_copy": {
          "label": "Copy every page, then submit the original as required"
        },
        "c32_notebook_seoa": {
          "label": "Go with him to explain things to Seoa before submitting"
        },
        "reframe": {
          "label": "Count who probes like this have put on trial"
        },
        "c32_notebook_evidence_turn": {
          "label": "Match the 33rd-floor removal log to the seizure list"
        }
      },
      "place": "Outside the Seoul Central District Prosecutors’ Office · Parking Lot",
      "clock": "June 16 · 21:10",
      "question": "A notebook with his daughter’s stickers becomes evidence. Your name is on the last page. What do you do?",
      "lead": "Ban Jaewook’s car, two hours up from Daejeon, sits under a parking lot streetlight."
    },
    "c32_final": {
      "title": "Too Many Names",
      "text": "When the last interview ends, Na Eunho follows you out into the hallway. His tie is already in his pocket. 'From tomorrow we have to settle your status. I’ll give you the options, quickly.' He raises one finger at a time. One: tell everything you know about Yoon Sanghyuk, and you stay a witness. But all the response records of your Trigger Lab colleagues must be opened as evidence too. Two: you are investigated as a suspect, starting with the review that bears your name. Finding the person who wrote your name could take months. Three: tonight you hand over only what concerns Yoon Sanghyuk, and decide the rest later. 'I like fast. But this time I’m not sure fast is right either.' He presses the elevator button. '3 years ago the signature line was empty, they tell me. This time there are too many of your names.'",
      "memo": [
        "Deadline to settle your status: tomorrow 09:00",
        "If you stay a witness: all Trigger Lab colleagues’ response records opened",
        "If you become a suspect: months to find who signed for you",
        "Box 27 -- whereabouts still unknown"
      ],
      "choices": {
        "c32_final_shield": {
          "label": "Tell all you know if your colleagues’ records stay closed"
        },
        "c32_final_trade": {
          "label": "Hand over only your statement on Yoon Sanghyuk tonight"
        },
        "c32_final_stand": {
          "label": "Ask to be investigated over the review in your name first"
        },
        "reframe": {
          "label": "One last time, propose changing the game"
        }
      },
      "place": "Seoul Central District Prosecutors’ Office 11th Floor · Hallway",
      "clock": "June 16 · 23:40",
      "question": "By tomorrow morning you must choose: stay a witness, become a suspect, or deal first. What do you do?",
      "lead": "You close the lunchbox lid and go back up to the 11th floor. When the last interview ends, Na Eunho stuffs his tie in his pocket and follows you out."
    },
    "c32_aftershock": {
      "title": "12 Chairs",
      "text": "After midnight you return to KD Capital’s 12th floor. The Risk Management Department is empty, every drawer pulled out, and the chairs pushed into the hallway. Colleagues who got visitor passes from the security desk roll up their sleeves without a word. Kang Taemin pushes desks two at a time, and Kwon Dohyun matches drawer numbers, saying 'I’ll put the restoration cost on the invoice.' Then the elevator opens and Baek Arin walks in. Without saying she came down from the 33rd floor, she lines up 12 chairs in a row, puts a 312-line copy of the seizure list on your desk, and leaves first. At the very end of the list, only the Box 27 row is blank. There is a text from Na Eunho on your phone. 'Your status is fixed in the record at nine in the morning. Until then you may change your statement.'",
      "memo": [
        "23 Risk Management desks -- every drawer seized",
        "12 chairs set up by Baek Arin",
        "Copy of the seizure list, 312 lines; only row 27 blank",
        "Na Eunho: status fixed in the record at 09:00"
      ],
      "choices": {
        "c32_after_rush": {
          "label": "Go straight to Prosecutor Na Eunho at first light"
        },
        "c32_after_record": {
          "label": "Check all 312 lines and keep your own copy of the list"
        },
        "c32_after_warm": {
          "label": "Put every empty desk back in place with your colleagues"
        }
      },
      "place": "KD Capital 12th Floor · The Empty Risk Management Department",
      "clock": "June 17 · 00:50",
      "question": "Baek Arin set up the chairs and left a list with row 27 blank. How do you close out this early morning?"
    },
    "c32_dock": {
      "title": "Two Number 26s",
      "text": "Around noon, two prosecution trucks stand at the loading dock in the headquarters’ underground parking lot. Kang Taemin, who says he came as soon as he saw the news after his night shift, stands there holding a bag of cup noodles. When an investigator staggers while lifting three boxes at once, Kang Taemin reaches out by reflex and steadies them. 'Sir, that’s evidence. Hands off.' Kang Taemin sets the box on the ground and clasps both hands behind his back. Then he looks into the truck for a long time and says, 'There are two number 26s. One of them should be in the 27 spot.' Jin Taeyoon, the investigator who put on the tags, flips through the list and his face stiffens. Box 27 is only on the list, not on the truck.",
      "memo": [
        "2 prosecution trucks -- 58 boxes loaded",
        "Box 26 duplicated, Box 27 missing",
        "Kang Taemin: 14 years of night-shift loading and unloading"
      ],
      "choices": {
        "c32_dock_choice_1": {
          "label": "Ask that Kang Taemin be allowed to help match numbers"
        },
        "c32_dock_choice_3": {
          "label": "Numbers are the investigators’ job; walk Kang Taemin out"
        },
        "c32_dock_choice_2": {
          "label": "Ask them to put on record that Box 27 is missing"
        }
      },
      "place": "KD Financial Group HQ · Underground Loading Dock",
      "clock": "June 16 · 11:50",
      "question": "A night-shift foreman found the missing box before the investigators did. How do you handle the find?"
    },
    "c32_invoice": {
      "title": "22 Questions",
      "text": "During a break in the interviews, Kwon Dohyun is sitting on a hallway chair. Bridge Bank lent Roundhill its acquisition money, so he has been called in to testify too. The paper on his knee already has vertical lines ruled on it. '58 boxes, 11 investigators, and if you add forensics (analysis that recovers even deleted files to look at them), today alone costs the taxpayer roughly 24 million won.' He stops his pen. 'I won’t write an invoice today.' He turns the paper over. The back is the question sheet he was given. Of 22 questions, 18 are about you. 'This question sheet I can’t put a price on.'",
      "memo": [
        "Estimated cost of today’s investigation -- about 24 million won",
        "Kwon Dohyun’s question sheet: 18 of 22 questions are about you",
        "Kwon Dohyun: works at the bank that lent Roundhill its acquisition money"
      ],
      "choices": {
        "c32_invoice_choice_2": {
          "label": "It is his sheet; hand it back without reading it"
        },
        "c32_invoice_choice_1": {
          "label": "Ask Kwon Dohyun to answer about you only as he knows it"
        },
        "c32_invoice_choice_3": {
          "label": "Prepare your answers to the 18 questions in advance"
        }
      },
      "place": "Seoul Central District Prosecutors’ Office 11th Floor · Hallway",
      "clock": "June 16 · 17:30",
      "question": "Of the 22 questions on Kwon Dohyun’s sheet, 18 are about you. What do you do with this paper?"
    },
    "c32_bento": {
      "title": "Four Tries at the Omelet",
      "text": "At 10:40 at night, Han Seoyun stands at the crosswalk across from the prosecutors’ office. Three months into a standby assignment (a personnel order that leaves you with no duties while you wait for your next post), she is holding five lunchboxes wrapped in a cloth bundle. 'On standby you have time to spare. I rolled the egg omelet four times. Three of them failed.' Oh Jinwoo comes over loosening his tie, and Do Yoonha gets out of a taxi after closing up at his branch. Meanwhile 312 messages have piled up in the group chat. Kang Taemin brings hot water for cup noodles from the convenience store, and Kwon Dohyun is figuring the cost of the lunchboxes until Han Seoyun takes his chopsticks away. Lee Minseo cries while eating the egg omelet. She says it is because it tastes good. Opening the lid of your box, Han Seoyun asks, 'The last interview, what time is it?'",
      "memo": [
        "Han Seoyun’s 5 lunchboxes -- the egg omelet worked on the fourth try",
        "312 group chat messages",
        "Last interview at 23:00"
      ],
      "choices": {
        "c32_bento_choice_2": {
          "label": "Write down in order what the six of you went through today"
        },
        "c32_bento_choice_3": {
          "label": "Take the lunchbox in and finish the interview fast"
        },
        "c32_bento_choice_1": {
          "label": "No talk of the interviews until the lunchboxes are empty"
        }
      },
      "place": "Outside the Seoul Central District Prosecutors’ Office · Crosswalk",
      "clock": "June 16 · 22:40",
      "question": "Five lunchboxes in a cloth bundle wait across from the prosecutors’ office. How do you eat this dinner?"
    },
    "c32_dock_reaction": {
      "title": "Fellow Loaders",
      "text": "Jin Taeyoon shuts the truck door and holds out a can of coffee to Kang Taemin. 'I did parcel loading for 3 years in college too. Get a number wrong and the foreman chewed you out at dawn.' Kang Taemin says, 'If I’d been that foreman, I wouldn’t have,' and the two of them laugh for a moment. Jin Taeyoon lowers his voice. 'Box 27 is in the 33rd-floor removal log. It went out two days ago at 6 p.m., under the group legal team’s name. That means someone knew the day we were coming.' He looks at you. 'I’ll report it to the prosecutor. But if the record shows you knew first, I can’t say whether that’ll be good or bad.'",
      "memo": [
        "Box 27: taken out by the legal team two days ago at 18:00",
        "Someone knew the seizure date in advance"
      ],
      "choices": {
        "c32_dock_reaction_choice_1": {
          "label": "Ask to keep Kang Taemin’s name out of the report"
        },
        "c32_dock_reaction_choice_2": {
          "label": "Request a copy of the 33rd-floor removal log as evidence"
        },
        "c32_dock_reaction_choice_3": {
          "label": "Ignore Box 27 and focus only on the afternoon interview"
        }
      },
      "place": "KD Financial Group HQ · Underground Loading Dock",
      "clock": "June 16 · 12:05",
      "question": "Box 27 went out under the legal team’s name two days before the seizure. What do you do with knowing first?"
    },
    "c32_invoice_reaction": {
      "title": "The Foil That Missed",
      "text": "Na Eunho comes out into the hallway and looks at the two of you. In his hand is the gimbap foil, crushed into a ball. 'If two witnesses pass a question sheet around in the hallway, what should I write in the record?' He tosses the foil at the trash can and misses. He doesn’t pick it up. 'I’ll be honest. I don’t much like people who write dissents. They all write one, then go down to the basement and sit still for 3 years. And in those 3 years, people like Yoon Sanghyuk empty the boxes.' He points his chin at Kwon Dohyun’s paper. 'You stopped calculating. Right call. That price depends on who gets indicted (charged and sent to trial).'",
      "memo": [
        "Na Eunho: 'I don’t much like people who write dissents'",
        "Who gets sent to trial is still undecided"
      ],
      "choices": {
        "c32_invoice_reaction_choice_3": {
          "label": "Say nothing, bin the foil, and ask when the next interview is"
        },
        "c32_invoice_reaction_choice_1": {
          "label": "Name your colleagues: you did not sit still for 3 years"
        },
        "c32_invoice_reaction_choice_2": {
          "label": "Ask that the hallway talk go into the record as it was"
        }
      },
      "place": "Seoul Central District Prosecutors’ Office 11th Floor · Hallway",
      "clock": "June 16 · 17:45",
      "question": "The prosecutor says people who write dissents sit still for 3 years. How do you answer back?"
    },
    "c32_bento_reaction": {
      "title": "Still in the Account",
      "text": "While clearing the lunchboxes, Do Yoonha shows you his phone. A text tells him to come in and testify at 10 a.m. tomorrow too. 3 years ago he was the one who sold that loan at the counter. 'Funny, right? The bonus I got for selling that loan is still sitting in my account. I couldn’t bring myself to spend it.' He closes the lid of his empty lunchbox. 'If they ask tomorrow, I’ll tell it as it is. Then one more box will have my name in it. That’s fine. It’d be stranger if my name weren’t there.' The crosswalk light changes, and Han Seoyun pats Do Yoonha once on the back.",
      "memo": [
        "Do Yoonha called in as a witness: tomorrow 10:00",
        "A bonus untouched for 3 years"
      ],
      "choices": {
        "c32_bento_reaction_choice_3": {
          "label": "Leave Do Yoonha’s matter to him; focus on tonight"
        },
        "c32_bento_reaction_choice_1": {
          "label": "Say you will go with Do Yoonha to the office tomorrow"
        },
        "c32_bento_reaction_choice_2": {
          "label": "Help put his bonus statement into his testimony file"
        }
      },
      "place": "Outside the Seoul Central District Prosecutors’ Office · Crosswalk",
      "clock": "June 16 · 23:05",
      "question": "Tomorrow Do Yoonha is called in as the man who sold that loan 3 years ago. What do you do for him?"
    },
    "c32_branch_waiting": {
      "title": "Lee Minseo in the Waiting Room",
      "text": "During a break, Lee Minseo is sitting in the waiting room at the end of the hallway. She has been called in to testify too, because of the Trigger Lab record copies left at KD Data Lab. The summons on her knee is crumpled. 'The investigator asked me earlier. Who was in charge of keeping the records? That was me.' She starts to smile and stops. 'Last year the records pointed at me too. The missing 11 seconds. Back then I was a contract worker, so I was easy to let go.' The wall clock’s minute hand ticks forward one notch. There are 20 minutes until Lee Minseo’s turn.",
      "memo": [
        "Why Lee Minseo is called: Trigger Lab record copies at KD Data Lab",
        "Investigator’s question: 'Who was in charge of keeping the records?'",
        "1 year after the 'missing 11 seconds' of the leak scare",
        "20 minutes until Lee Minseo’s interview"
      ],
      "choices": {
        "c32_branch_waiting_b": {
          "label": "Find the records access chart and prove who was in charge"
        },
        "c32_branch_waiting_a": {
          "label": "Ask the prosecutor if you can sit in on Lee Minseo’s interview"
        },
        "c32_branch_waiting_c": {
          "label": "Everyone faces their own interview; let her rest 20 minutes"
        }
      },
      "place": "Seoul Central District Prosecutors’ Office 11th Floor · Waiting Room",
      "clock": "June 16 · 15:40",
      "question": "Like last year, the records are about to point at Lee Minseo. How do you use the 20 minutes left?"
    },
    "c32_branch_waiting_follow": {
      "title": "One Sentence in the Record",
      "text": "40 minutes later Lee Minseo comes out. In her hand is a copy of her statement record (the document in which investigators write down what was said in an interview). They gave it to her to read before she signs. On page three there is one sentence. 'The witness copied and kept the Trigger Lab response records at will.' Lee Minseo never said that. The copying was ordered by Human Resources, and the email with that order still exists. To fix the sentence she would have to be interviewed again from the start, and that would run past ten at night. Lee Minseo holds the pen and looks at you. 'Should I just sign? Mom says she has dinner ready and is waiting.'",
      "memo": [
        "Record, page 3: 'copied and kept at will'",
        "In fact: copied on an emailed order from Human Resources",
        "If corrected: done after 22:00",
        "Lee Minseo’s mother’s dinner -- 19:00"
      ],
      "choices": {
        "c32_branch_waiting_follow_a": {
          "label": "Stay with her until the sentence is fixed, however late"
        },
        "c32_branch_waiting_follow_b": {
          "label": "Have the HR order email attached to the record"
        },
        "c32_branch_waiting_follow_c": {
          "label": "Sign today; correct the sentence later in a written opinion"
        }
      },
      "place": "Seoul Central District Prosecutors’ Office 11th Floor · Waiting Room",
      "clock": "June 16 · 16:40",
      "question": "The record holds words Lee Minseo never said, and dinner is waiting at home. What do you do?"
    },
    "c32_route_system": {
      "title": "Statistics of Names in Boxes",
      "text": "Before your status, you ask for a count: who did probes like this end up putting on trial? NOAH answers from the shared terminal on the 12th floor, the one without a seal sticker. Rulings from 64 search and seizure cases (an investigation that takes records and items by force with a court’s permission) at financial companies over the last 10 years open up. Of the 208 people sent to trial, 167 are working-level staff, 29 are executives, and 12 are final decision-makers. In all 12 cases where a decision-maker was indicted (charged and sent to trial), that person’s signature had come out of a box. 'My training shows that people whose names appear often in the boxes are the ones sent to trial. People who leave the signature line empty have no names in the boxes.'",
      "memo": [
        "64 search and seizure cases -- 208 people sent to trial",
        "167 working-level staff, 29 executives, 12 decision-makers",
        "All 12 decision-maker cases: the signature came out of a box"
      ],
      "choices": {
        "c32_route_system_warn": {
          "label": "Warn first the staff colleagues whose names fill the boxes"
        },
        "c32_route_system_drop": {
          "label": "Shelve the statistics and keep to today’s interview schedule"
        },
        "c32_route_system_publish": {
          "label": "Submit the ruling statistics to Prosecutor Na as an opinion"
        },
        "c32_route_system_evidence_turn": {
          "label": "Match the 33rd-floor removal log to the seizure list"
        }
      },
      "place": "KD Capital 12th Floor · Shared Terminal",
      "clock": "June 16 · 13:20",
      "question": "People with many names in the boxes go to trial; those who left the signature line empty are not in them. What do you do with these statistics?"
    },
    "c32_final_system_route": {
      "title": "The Box with No Name",
      "text": "Past midnight on the 12th floor, among desks with their drawers pulled out, one unsealed shared terminal is on. NOAH places the list of boxes taken today next to the ruling statistics. Each box lists the name that appears most in it, and your name appears in every box. Yoon Sanghyuk’s name is in none of them. The deadline Na Eunho gave is nine in the morning. 'By this list, the person closest to trial is the one who wrote the most. The one who wrote the least is farthest.'",
      "memo": [
        "Yoon Sanghyuk’s name in the boxes taken today: 0 times",
        "Of the 208 sent to trial, 12 final decision-makers",
        "Deadline to settle your status: today 09:00"
      ],
      "choices": {
        "c32_final_system_route_b": {
          "label": "Promise cooperation that only lowers staff colleagues’ penalties"
        },
        "c32_final_system_route_c": {
          "label": "Raise a defense fund together for the staff with many names"
        },
        "c32_final_system_route_a": {
          "label": "Propose the probe first trace the decision-maker’s signature"
        }
      },
      "place": "KD Capital 12th Floor · Shared Terminal",
      "clock": "June 17 · 00:30",
      "question": "The one who wrote the most is closest to trial. Before nine in the morning, how do you turn this math around?"
    },
    "c32_evidence_turn": {
      "title": "Where Box 27 Went",
      "text": "When you hold the clue against the blank row of the seizure list, the 33rd-floor document removal log and today’s seizure list overlap on one screen. Box 27 went out two days ago at 18:04. The requester was the group legal team, and the approver field is empty. The contents written on the outside of the box: 'Original Trigger Lab design documents and confirmation of delivery of HR evaluation auxiliary indicators (numbers looked at alongside when evaluating people).' 12 minutes before the removal, a single 4-minute call came in to the 33rd floor’s main number. It came from Seocho-dong. Ban Jaewook closes the notebook he was writing in. 'Whoever took the box knew when we were coming. And once again the approver field is empty.'",
      "memo": [
        "Box 27 removed: two days ago 18:04, requested by the group legal team",
        "Approver field: blank",
        "12 minutes before removal, a 4-minute call from Seocho-dong"
      ],
      "choices": {
        "c32_evidence_turn_hold": {
          "label": "Hold the removal log and play it when your status is set"
        },
        "c32_evidence_turn_share": {
          "label": "Tell the colleagues whose records were in Box 27 first"
        },
        "c32_evidence_turn_hand": {
          "label": "Hand the removal log to Prosecutor Na Eunho tonight, as is"
        }
      },
      "place": "KD Capital 12th Floor · The Empty Risk Management Department",
      "clock": "June 17 · 00:20",
      "question": "Box 27 left after someone passed on the seizure date. How do you use this record?"
    },
    "c32_start_warm": {
      "title": "A Search for Those Who Emptied the Lunchboxes",
      "text": "The night the inspection team left, six of you and Choi Seojin emptied Han Seoyun’s seven lunchboxes on the 1st floor of the secondhand bookshop. Four days later, at 7:40 on the morning of June 16, the group chat of those seven goes off first. It is a breaking news link from Oh Jinwoo. 'Seoul Central District Prosecutors raid KD Financial Group’s 33rd floor and KD Capital in a search and seizure (an investigation that takes records and items by force with a court’s permission).' It is the 'boxes next week' Han Jiwoo spoke of. When you reach the 12th floor, blue vests stand at the door of the Risk Management Department, and Prosecutor Na Eunho calls your name. 'Two this afternoon, come in as a witness (someone with no duty to testify who comes in to explain the facts).' Six 'You okay?' messages have piled up in the group chat. Choi Seojin’s is the first.",
      "memo": [
        "3 search sites: 33rd floor, KD Capital CEO office, Risk Management Department",
        "Group chat: 6 'You okay?' -- Choi Seojin is No. 1",
        "Called in as a witness: today 14:00"
      ],
      "choices": {
        "c32_start_warm_signature": {
          "label": "Give each of the six in the chat a job for today"
        },
        "c32_start_warm_hand": {
          "label": "Hand over your phone and prepare for the afternoon"
        },
        "c32_start_warm_calm": {
          "label": "Tell your scared team first what they can refuse"
        },
        "c32_start_warm_list": {
          "label": "Sign only after checking the seizure list line by line"
        },
        "c32_start_warm_reframe": {
          "label": "Count who probes like this have put on trial"
        }
      },
      "place": "KD Capital 12th Floor · Risk Management Office",
      "clock": "Tuesday, June 16 · 07:40",
      "question": "The six who emptied the lunchboxes with you wait in the group chat for your answer. What do you tell them?",
      "lead": "Since the night the seven lunchboxes were emptied on the bookshop’s 1st floor, the group chat has not been quiet for a single day."
    },
    "c32_start_record": {
      "title": "A Search for the One Who Bound the Records",
      "text": "Your single volume of records, the five days of examination questions and answers bound in date order, was attached as it was to the back of the notice Han Jiwoo sent to the prosecutors. Four days later, at 7:40 on the morning of June 16, investigators carrying that volume walk onto KD Capital’s 12th floor. It is a search and seizure by the Seoul Central District Prosecutors’ Office (an investigation that takes records and items by force with a court’s permission). Prosecutor Na Eunho waves your records. 'You organized this well. So well that I’ll have to start by asking how you knew all of it. Two this afternoon, come in as a witness (someone with no duty to testify who comes in to explain the facts).' Your name is printed in the author field on the cover.",
      "memo": [
        "Attached to the notice to prosecutors: your bound record of the five inspection days",
        "Author field on the cover: your name",
        "Called in as a witness: today 14:00"
      ],
      "choices": {
        "c32_start_record_signature": {
          "label": "Submit in writing first how you bound the volume"
        },
        "c32_start_record_hand": {
          "label": "Hand over your phone and prepare for the afternoon"
        },
        "c32_start_record_list": {
          "label": "Sign only after checking the seizure list line by line"
        },
        "c32_start_record_calm": {
          "label": "Tell your scared team first what they can refuse"
        },
        "c32_start_record_reframe": {
          "label": "Count who probes like this have put on trial"
        }
      },
      "place": "KD Capital 12th Floor · Risk Management Office",
      "clock": "Tuesday, June 16 · 07:40",
      "question": "The volume of records you bound has come back in an investigator’s hands. How do you explain it?",
      "lead": "The five inspection days you bound in date order come back to the 12th floor four days later, in the hands of blue vests."
    },
    "c32_start_rush": {
      "title": "A Search for the One Who Went Down First",
      "text": "The night the inspection team left, you went down to the basement archive before the boxes could come and took the original Pyeongtaek site boxes first. Your name was stamped at the top of the access log again. Four days later, at 7:40 on the morning of June 16, the Seoul Central District Prosecutors’ search and seizure (an investigation that takes records and items by force with a court’s permission) begins, and the first thing an investigator pulls out is that access log. Prosecutor Na Eunho puts a finger on your name. 'You’re the one who moved the original boxes, right? Whether you protected evidence or cleared it away, you can explain that, can’t you? Two this afternoon, come in as a witness (someone with no duty to testify who comes in to explain the facts). It’ll probably run long.'",
      "memo": [
        "Top of the basement archive access log: your name",
        "Original Pyeongtaek site box -- now under your desk",
        "Called in as a witness: today 14:00"
      ],
      "choices": {
        "c32_start_rush_hand": {
          "label": "Hand over your phone and prepare for the afternoon"
        },
        "c32_start_rush_list": {
          "label": "Sign only after checking the seizure list line by line"
        },
        "c32_start_rush_calm": {
          "label": "Tell your scared team first what they can refuse"
        },
        "c32_start_rush_signature": {
          "label": "Give the Pyeongtaek box under your desk to them first"
        },
        "c32_start_rush_reframe": {
          "label": "Count who probes like this have put on trial"
        }
      },
      "place": "KD Capital 12th Floor · Risk Management Office",
      "clock": "Tuesday, June 16 · 07:40",
      "question": "The name at the top of the archive access log is yours. How do you explain the box you moved?",
      "lead": "The box you carried up from the basement archive that night is still under your desk."
    }
  },
  "echoReplies": {
    "c32_start_calm": "Once you tell them, your team’s hands shake a little less. Meanwhile the investigators empty the three drawers of your desk first.",
    "c32_start_list": "Checking line by line fixes two typos in the list. It takes an hour, and the whole time your team waits standing in the hallway.",
    "c32_start_hand": "Handing it over makes things go fast. The group chat on your phone goes into the box too.",
    "c32_boxes_seal": "Sealed separately, your colleagues’ boxes get one more band of red tape. Na Eunho only says, 'I’ll end up looking at those people too.'",
    "c32_boxes_match": "Matched up, the original list has forty-one. There are 40 in the hallway.",
    "c32_boxes_mine": "Your boxes go to the truck first. The 1,106 pages get the first evidence number.",
    "c32_room_plain": "When you speak without holding back, Na Eunho puts down his gimbap. To the request to leave out your colleagues’ names, he answers, 'That’s for me to decide.'",
    "c32_room_counsel": "Your demand stops the interview for 40 minutes. The confirmation says 'witness,' but the title of the question sheet does not change.",
    "c32_room_alibi": "The travel record proves you were not in Seoul that day. It does not prove who wrote your name.",
    "c32_notebook_seoa": "When you go and tell her, Seoa thinks for a long time, then asks. 'So do the stickers go to trial too?' Ban Jaewook laughs for the first time.",
    "c32_notebook_copy": "As you copy it, 47 names and 13 stickers pass over the copier glass. The original goes into an evidence bag.",
    "c32_notebook_later": "The submission is over fast. Your name in pencil becomes a page of the investigation file with no explanation.",
    "c32_final_shield": "You tell everything, and your colleagues’ boxes stay closed. In exchange, your statement speaks for all of their stories.",
    "c32_final_stand": "Once you are a suspect, one word follows your name for months. In exchange, finding who made that signature becomes the investigation.",
    "c32_final_trade": "Handing it over first speeds up the probe into Yoon Sanghyuk. The rest of your names stay in a field called later.",
    "c32_after_warm": "The 23 desks are back in place at 3 a.m. Only the 12 chairs Baek Arin set up, no one touches.",
    "c32_after_record": "Checking turns up one more blank among the 312 lines. Not Box 27, but a document whose name is not even on the list.",
    "c32_after_rush": "Tidying the desks is left to your colleagues. At 9 a.m., the moment Na Eunho sees your face, he asks for a name instead of asking questions.",
    "c32_dock_choice_1": "Jin Taeyoon hesitates a moment, then hands over one page of the list. Kang Taemin counts all 58 by eye without touching the evidence, and never gets one wrong.",
    "c32_dock_choice_2": "One line goes into the record: 'Box 27 unconfirmed.' The time that line was written, 11:52, stays on record too.",
    "c32_dock_choice_3": "Leaving the dock, Kang Taemin looks back once. Both number 26 boxes are loaded onto the truck as they are, and no one counts the empty spot.",
    "c32_invoice_choice_1": "Kwon Dohyun writes one line to the right of his ruled column. 'As he knows it: cost 0 won.' He circles that line.",
    "c32_invoice_choice_2": "Kwon Dohyun folds the returned question sheet in half. 'At least no one can say the witnesses got their stories straight. A loss on the invoice, but a gain on the books.'",
    "c32_invoice_choice_3": "Your answers get smooth. Answers that are too smooth are the kind Na Eunho suspects first.",
    "c32_bento_choice_1": "While the lunchboxes empty, no one mentions the prosecutors. Oh Jinwoo volunteers to tell the omelet successes from the failures by taste, and gets all three wrong.",
    "c32_bento_choice_2": "On one sheet, the whole day shows at a glance. From 7:40 to 22:40, each of the six was called in once for someone else.",
    "c32_bento_choice_3": "The lunchbox goes cold on the interview room desk. Na Eunho glances at the egg omelet once, and the interview ends 20 minutes early.",
    "c32_dock_reaction_choice_1": "Jin Taeyoon nods. The report says only 'found during on-site check,' and Kang Taemin insists on paying for the canned coffee.",
    "c32_dock_reaction_choice_2": "The request is kept as an official letter. At 3 p.m. the group legal team replies: 'The removal was routine document housekeeping.'",
    "c32_dock_reaction_choice_3": "The box you pretended not to know rolls around in your head all afternoon. Jin Taeyoon’s report keeps only a line saying you were there.",
    "c32_invoice_reaction_choice_1": "As you name them one by one, Na Eunho writes them down for the first time. Do Yoonha, Lee Minseo, Ban Jaewook, Kang Taemin. 'That’s a lot. I have all their boxes too.'",
    "c32_invoice_reaction_choice_2": "Na Eunho pauses, then smiles. 'Fine, I’ll write it. Shall I also write that I was rude?' He really does write it.",
    "c32_invoice_reaction_choice_3": "When you pick up the foil and put it in the trash can, Na Eunho raises an eyebrow. 'The next interview is in 20 minutes. And thank you.'",
    "c32_bento_reaction_choice_1": "When you say you will go with him, Do Yoonha says, 'Then breakfast is on me.' Not with that bonus, he adds.",
    "c32_bento_reaction_choice_2": "Sorted out, 3 years of figures fit on one sheet. Do Yoonha says he will put that paper on the interview room desk first thing tomorrow.",
    "c32_bento_reaction_choice_3": "Do Yoonha nods. 'Right, it’s my matter.' He hails a taxi first. Tonight his back looks smaller.",
    "c32_branch_waiting_a": "When you ask, Na Eunho says, 'No.' Instead he tells an investigator to leave the waiting room door open.",
    "c32_branch_waiting_b": "When you find the access chart, there is one more name, a decision-maker’s, above Lee Minseo in the records-keeper field. Finding it takes an hour.",
    "c32_branch_waiting_c": "In those 20 minutes Lee Minseo gets two vending machine coffees and drinks neither.",
    "c32_branch_waiting_follow_a": "When you say to fix it, Lee Minseo goes back into the interview room. You wait in the hallway, and the record is rewritten only at 10:20 p.m. Her mother’s dinner goes cold, and the sentence gets fixed.",
    "c32_branch_waiting_follow_b": "Once the email is attached, the words 'at will' come out. The investigator adds one more number to the list of attachments.",
    "c32_branch_waiting_follow_c": "She signs, and Lee Minseo is not late for dinner. She says she will just eat and come back out tonight. The sentence on page three is part of the official record from today.",
    "c32_route_system_publish": "When you submit the opinion, Na Eunho underlines one line. '12 decision-makers.' All he says is, 'That’s few.'",
    "c32_route_system_warn": "Once warned, the staff colleagues start looking for lawyers. A few ask why you didn’t just keep it to yourself.",
    "c32_route_system_drop": "The statistics stay inside the terminal. The names that went into today’s boxes move just as the statistics say.",
    "c32_final_system_route_a": "Your proposal to change the order goes into the record. Whether it is accepted is decided not by Na Eunho but by the person above him.",
    "c32_final_system_route_b": "With lighter penalties, your colleagues are relieved. The box of the person who decided is still empty.",
    "c32_final_system_route_c": "With the fund in place, the staff do not stand in court alone. The first month’s total is about the size of a holiday bonus.",
    "c32_evidence_turn_hand": "Once you hand it over, Na Eunho replies at 1 a.m. 'The Seocho-dong number, we’re looking at it too.' He does not yet say whose number it is.",
    "c32_evidence_turn_hold": "Holding it makes it a card. Who is holding that card will soon come out too.",
    "c32_evidence_turn_share": "Once told, your colleagues learn for the first time where their records are. That night, a few of them go quiet in the group chat for a long time.",
    "c32_boxes_evidence_turn": "Lay the two lists over each other, and the time the box left remains. Right beside it is a phone call that came in just before that time.",
    "c32_room_evidence_turn": "Lay the two lists over each other, and the time the box left remains. Right beside it is a phone call that came in just before that time.",
    "c32_notebook_evidence_turn": "Lay the two lists over each other, and the time the box left remains. Right beside it is a phone call that came in just before that time.",
    "c32_route_system_evidence_turn": "Lay the two lists over each other, and the time the box left remains. Right beside it is a phone call that came in just before that time.",
    "case32_memory_system": "The seizure list sorted the boxes by name. Boxes with your name are the most numerous. NOAH counts the names in each box side by side with the people sent to trial.",
    "case32_memory_evidence": "Hold the extension date chart against the removal log, and one box missing from the list turns up. Right before it left, there is a phone call.",
    "c32_start_warm_calm": "Once you tell them, your team’s hands shake a little less. Meanwhile the investigators empty the three drawers of your desk first.",
    "c32_start_warm_list": "Checking line by line fixes two typos in the list. It takes an hour, and the whole time your team waits standing in the hallway.",
    "c32_start_warm_hand": "Handing it over makes things go fast. The group chat on your phone goes into the box too.",
    "c32_start_warm_signature": "Once you divide it up, six replies come in 30 seconds. Lee Minseo sends a lawyer’s number, and Oh Jinwoo sends 'I’ll handle the Bridge side’s papers.' No one knows yet who will be called in first.",
    "c32_start_record_calm": "Once you tell them, your team’s hands shake a little less. Meanwhile the investigators empty the three drawers of your desk first.",
    "c32_start_record_list": "Checking line by line fixes two typos in the list. It takes an hour, and the whole time your team waits standing in the hallway.",
    "c32_start_record_hand": "Handing it over makes things go fast. The group chat on your phone goes into the box too.",
    "c32_start_record_signature": "Your written account is the first thing on Na Eunho’s desk. After reading it he says, 'Good. Now my questions have doubled.'",
    "c32_start_rush_calm": "Once you tell them, your team’s hands shake a little less. Meanwhile the investigators empty the three drawers of your desk first.",
    "c32_start_rush_list": "Checking line by line fixes two typos in the list. It takes an hour, and the whole time your team waits standing in the hallway.",
    "c32_start_rush_hand": "Handing it over makes things go fast. The group chat on your phone goes into the box too.",
    "c32_start_rush_signature": "When you hand it over first, Na Eunho looks at your face longer than at the box. 'Someone clearing things away doesn’t do this.' Still, the access log gets an evidence number."
  },
  "choiceVoiceLines": {
    "c32_start_calm": "So no one says just anything in front of the investigators, you first tell your scared team what they can refuse.",
    "c32_start_list": "Saying you have to know what they are taking, you sign only after checking the seizure list line by line.",
    "c32_start_hand": "Saying the time until two is too precious to waste, you hand over your phone and start preparing for the afternoon.",
    "c32_boxes_seal": "So the people written next to your name are not opened up too, you ask for your colleagues’ record boxes to be sealed separately.",
    "c32_boxes_match": "Saying you need to know whether 40 is really all of them, you match the seized boxes to Trigger Lab’s original list row by row.",
    "c32_boxes_mine": "Saying it is the name that will come up most anyway, you hand over the boxes with your name first to get the probe moving.",
    "c32_room_plain": "Saying you have nothing to hide but cannot drag others in, you ask to leave out your colleagues’ names and tell your own moves in full.",
    "c32_room_counsel": "Saying you cannot let the line about questioning you like a suspect pass, you demand a lawyer present and written confirmation of your witness status first.",
    "c32_room_alibi": "Saying you must first show you were not in Seoul that night, you put your Singapore departure record forward to cut off the signature doubt fast.",
    "c32_notebook_seoa": "So the child does not worry all night, you go with him to explain things to Seoa before the notebook is submitted.",
    "c32_notebook_copy": "Thinking of the day the original does not come back, you copy every page and submit the original as required.",
    "c32_notebook_later": "Saying there is no stalling before a court document, you put off talk of the back page with your name and finish the submission first.",
    "c32_final_shield": "Saying you cannot give up others as the price of testifying, you state everything you know on condition that your colleagues’ records stay closed.",
    "c32_final_stand": "Saying the person who wrote it must be found however many months it takes, you ask to be investigated as a suspect, starting with the review that bears your name.",
    "c32_final_trade": "Saying you have to reach him before more boxes are emptied, you hand over only your statement on Yoon Sanghyuk tonight.",
    "c32_after_warm": "Saying there is still night left until nine, you and your colleagues put every empty desk back in place to the end.",
    "c32_after_record": "Saying you need to know if there are blanks besides 27, you check the 312 lines of the seizure list one by one and keep a copy of the list.",
    "c32_after_rush": "Saying there is no need to wait until nine, you go straight to Prosecutor Na Eunho at first light.",
    "c32_dock_choice_1": "Saying the person best at reading numbers is right here, you ask that Kang Taemin be allowed to help match the numbers.",
    "c32_dock_choice_2": "Saying it will never have happened once the truck leaves, you ask them to put on record that Box 27 is missing.",
    "c32_dock_choice_3": "Saying evidence numbers are the investigators’ job, you walk Kang Taemin, hands off now, out of the dock.",
    "c32_invoice_choice_1": "Saying there is nothing to go easy on or shave off, you ask Kwon Dohyun to answer questions about you only as he knows it.",
    "c32_invoice_choice_2": "Saying the question sheet is his even if the questions are about you, you hand it back without reading it.",
    "c32_invoice_choice_3": "Saying it is better to go in knowing what they will ask, you prepare your answers to the 18 questions in advance.",
    "c32_bento_choice_1": "Saying food comes first in front of an omelet rolled four times, you keep talk of the interviews out until the lunchboxes are empty.",
    "c32_bento_choice_2": "Saying memories drift apart by tomorrow, you write down on one sheet, in order, what the six of you went through today.",
    "c32_bento_choice_3": "With the last interview still ahead, you take the lunchbox in, finish the interview fast, and come out.",
    "c32_dock_reaction_choice_1": "So the man who came to help is not dragged into interviews, you ask to keep Kang Taemin, who found the number, out of the report.",
    "c32_dock_reaction_choice_2": "Saying what you heard by word of mouth is not evidence, you request a copy of the 33rd-floor removal log as official evidence.",
    "c32_dock_reaction_choice_3": "Afraid a record of knowing first will look bad, you pretend not to know about Box 27 and focus only on the afternoon interview.",
    "c32_invoice_reaction_choice_1": "Saying you were not alone even in the basement, you name your colleagues and say you did not sit still for 3 years.",
    "c32_invoice_reaction_choice_2": "So it does not look like a hidden conversation, you ask that what was said in the hallway go into the record as it was.",
    "c32_invoice_reaction_choice_3": "Saying there is nothing to gain from a fight here, you say nothing, pick up and bin the foil, and ask only when the next interview is.",
    "c32_bento_reaction_choice_1": "Not wanting him to go alone to put his name in a box, you say you will go with Do Yoonha to the prosecutors’ office tomorrow morning.",
    "c32_bento_reaction_choice_2": "So the money he could not spend shows up as numbers, you help put his bonus statement together as material for Do Yoonha’s testimony.",
    "c32_bento_reaction_choice_3": "Saying it is not your place to shake words he has settled on, you leave Do Yoonha’s matter to Do Yoonha and focus on tonight’s interview.",
    "c32_branch_waiting_a": "Saying you will not send her in alone this time, you ask the prosecutor whether you can sit in on Lee Minseo’s interview.",
    "c32_branch_waiting_b": "So the records do not point at Lee Minseo again, you find the records access chart and prove who was in charge.",
    "c32_branch_waiting_c": "Saying each person has no choice but to face their own interview, you let Lee Minseo rest for the 20 minutes left.",
    "c32_branch_waiting_follow_a": "Saying you cannot let her sign words she never said, you stay beside her until the sentence is fixed, however late the night gets.",
    "c32_branch_waiting_follow_b": "So the paper itself says it was not copied at will, you have the HR order email attached to the record.",
    "c32_branch_waiting_follow_c": "Wanting to send her home to the waiting dinner first, you have her sign today and correct the sentence later in a written opinion.",
    "c32_route_system_publish": "So the probe does not stop at the working-level staff again, you submit the ruling statistics to Prosecutor Na Eunho as a written opinion.",
    "c32_route_system_warn": "Saying those who will stand on the side of the 167 should know first, you warn first the staff colleagues whose names fill the boxes.",
    "c32_route_system_drop": "Saying counting other people’s rulings does not change your own interview, you shelve the statistics and keep to today’s schedule.",
    "c32_final_system_route_a": "Saying an order that counts from the one who wrote the most is wrong, you propose changing the order so the probe first looks for the decision-maker’s signature traces.",
    "c32_final_system_route_b": "Saying you will protect people even if you cannot reach Yoon Sanghyuk, you promise cooperation that only lowers your staff colleagues’ penalties.",
    "c32_final_system_route_c": "Hearing that the one who wrote the most is closest to trial, you raise a defense fund together for the staff with many names.",
    "c32_evidence_turn_hand": "Saying the empty approver field is for the prosecutor to fill, you hand the removal log to Prosecutor Na Eunho tonight, as it is.",
    "c32_evidence_turn_hold": "Saying your hand is gone if you show it now, you hold the removal log and play it when your status is decided.",
    "c32_evidence_turn_share": "So they do not hear from others that their records are gone, you tell the colleagues whose records were in Box 27 first.",
    "c32_boxes_evidence_turn": "Laying the 33rd-floor document removal log over the seizure list, you pick out when, and under whose name, the box missing from the list went out.",
    "c32_room_evidence_turn": "Laying the 33rd-floor document removal log over the seizure list, you pick out when, and under whose name, the box missing from the list went out.",
    "c32_notebook_evidence_turn": "Laying the 33rd-floor document removal log over the seizure list, you pick out when, and under whose name, the box missing from the list went out.",
    "c32_route_system_evidence_turn": "Laying the 33rd-floor document removal log over the seizure list, you pick out when, and under whose name, the box missing from the list went out.",
    "c32_start_warm_calm": "So no one says just anything in front of the investigators, you first tell your scared team what they can refuse.",
    "c32_start_warm_list": "Saying you have to know what they are taking, you sign only after checking the seizure list line by line.",
    "c32_start_warm_hand": "Saying the time until two is too precious to waste, you hand over your phone and start preparing for the afternoon.",
    "c32_start_warm_signature": "So the chat is not just a pile of are-you-okays, you give each of the six in the group chat a job for today.",
    "c32_start_record_calm": "So no one says just anything in front of the investigators, you first tell your scared team what they can refuse.",
    "c32_start_record_list": "Saying you have to know what they are taking, you sign only after checking the seizure list line by line.",
    "c32_start_record_hand": "Saying the time until two is too precious to waste, you hand over your phone and start preparing for the afternoon.",
    "c32_start_record_signature": "To answer the question of how you knew it all on paper, you first submit in writing how you bound the volume of records.",
    "c32_start_rush_calm": "So no one says just anything in front of the investigators, you first tell your scared team what they can refuse.",
    "c32_start_rush_list": "Saying you have to know what they are taking, you sign only after checking the seizure list line by line.",
    "c32_start_rush_hand": "Saying the time until two is too precious to waste, you hand over your phone and start preparing for the afternoon.",
    "c32_start_rush_signature": "To show you protected it rather than cleared it away, you hand the original Pyeongtaek box under your desk to the investigators first."
  },
  "pack": {
    "clue": {
      "title": "Where Box 27 Went",
      "text": "At 18:04, two days before the seizure, Box 27, holding the original Trigger Lab design documents, left the 33rd floor under the group legal team’s name. The approver field was empty, and 12 minutes earlier a call had come in from Seocho-dong."
    },
    "outcomes": {
      "c32_after_warm": {
        "tag": "Stayed to the End",
        "title": "You put the desks the boxes left behind back in place, to the end",
        "text": "The night 58 boxes were hauled away, your colleagues put 23 desks back in place by 3 a.m. They left the 12 chairs Baek Arin set up as they were."
      },
      "c32_after_record": {
        "tag": "Matched the List",
        "title": "You checked the 312-line seizure list line by line and kept it",
        "text": "A 312-line copy of the list remained: what was hauled away and what was not. Box 27 was not the only blank."
      },
      "c32_after_rush": {
        "tag": "Went First",
        "title": "At first light you knocked on Na Eunho’s office door",
        "text": "You left the desks to your colleagues and went to Seocho-dong. Instead of questions, Na Eunho asked for one name."
      }
    },
    "continuityChallenges": {
      "c31_after_warm": {
        "title": "Holding out with those who emptied the lunchboxes",
        "text": "The seven who gathered at the bookshop the night the examination ended now stand before investigators. Trust rests on the card that shares the day with them instead of answering alone."
      },
      "c31_after_record": {
        "title": "Turning the records you bound back to your side",
        "text": "The inspection records you bound in date order became the grounds for questions aimed at you. Whose traces those records are, you ask back by redrawing the game."
      },
      "c31_after_rush": {
        "title": "Showing whether the box you moved was protected or cleared away",
        "text": "The original Pyeongtaek box you took first, and your name on the access log, are in investigators’ hands. Say first, yourself, whether you protected it or cleared it away, and fairness remains."
      }
    }
  }
}
