/**
 * 사건 38 (src/nodes/case38.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c38_start": {
      "title": "1,740 Plaintiffs",
      "text": "All four steamers at Gaeul Rice Cakes puff out steam at once. Today is the first day of the class action (a lawsuit filed jointly by many victims). At 2 p.m., in Courtroom 457 of the Seoul Central District Court, the first hearing (the court session where both sides present their arguments and evidence) opens. The list of plaintiffs runs to 1,740 people, and the lead plaintiff is Moon Gaeul. Public-interest lawyer Seon Jaeyoon spreads her papers out between the rice cake boxes. 'The group’s brief (a written summary of a side’s arguments filed with the court before trial) came in at 11 last night. They say the 212 without papers have no standing (the right to bring the suit).' She turns to the last page. Attachment 17 is the Trigger Lab response record leaked online last week, a table of your hesitations down to the second. Moon Gaeul puts down her rice cake knife. 'Why are they talking about you? This is our trial.'",
      "memo": [
        "First hearing: today 14:00, Courtroom 457, Seoul Central District Court",
        "1,740 plaintiffs -- 212 of them without loan papers",
        "Group’s brief, Attachment 17: your leaked response record",
        "72 seats in the gallery, 87 market people say they’re coming"
      ],
      "choices": {
        "c38_start_object": {
          "label": "First write a motion to strike the leaked record"
        },
        "c38_start_beside": {
          "label": "Sit with Moon Gaeul and pick what she’ll say in court"
        },
        "c38_start_skip": {
          "label": "Skip Attachment 17 and move fast on the court schedule"
        },
        "reframe": {
          "label": "Ask how the split trials ended"
        }
      },
      "place": "Gaeul Rice Cakes, Mangwon Market · By the steamers",
      "clock": "August 6 · Day of the first hearing · 05:40",
      "question": "At dawn on the first day of trial, the group cut 212 people from the plaintiffs and filed your hesitation record as evidence. What do you do first?",
      "lead": "At dawn on trial day, Moon Gaeul called you over to help steam rice cakes for the market people coming to watch from the gallery."
    },
    "c38_gallery": {
      "title": "Eight and Two",
      "text": "By 1:50 p.m. the 72 seats in the gallery of Courtroom 457 are already full of market people. The forty boxes of rice cakes stopped at the security check on the 1st floor. When the court officer says no food is allowed in the courtroom, Kang Taemin stacks every box in front of the officers’ room and says 'I’ll guard them,' and the officer says 'That’s my job, actually.' At 2:00 sharp, eight lawyers from Doyul Law file in and sit at the defense table. Kwon Dohyun whispers from the gallery. 'Even at 800,000 won an hour, that’s over 100,000 won a minute. Two hours of it comes to more than the claim of the grandmother who held ticket No. 38 at last year’s briefing.' At the plaintiffs’ table there are only two: Seon Jaeyoon and Moon Gaeul. Lawyer Yeon Seojun rises and speaks gently. 'Your Honor, we do not dispute anyone’s grief. It is only that the 212 have not one sheet of paper tied to a loan.'",
      "memo": [
        "Defense counsel: 8 -- Doyul Law, led by Yeon Seojun",
        "Plaintiffs’ counsel: 1 -- Seon Jaeyoon, no intern",
        "40 boxes of rice cakes held at security, Kang Taemin guarding them",
        "No. 38 grandmother’s claim: 12 million won"
      ],
      "choices": {
        "c38_gallery_statements": {
          "label": "File the 212 handwritten statements today"
        },
        "c38_gallery_first": {
          "label": "Push the 1,528 with papers first today"
        },
        "c38_gallery_records": {
          "label": "Offer to prove the 212 with the bank’s transaction records"
        },
        "reframe": {
          "label": "Ask how the split trials ended"
        },
        "c38_gallery_evidence_turn": {
          "label": "Find the boxes of papers the defense says the 212 lack"
        }
      },
      "place": "Seoul Central District Court · Courtroom 457",
      "clock": "First hearing · 14:00",
      "question": "The eight at the defense table say the 212 without papers are not plaintiffs. How do you stand the 212 up in this courtroom?",
      "lead": "You left the rice cake boxes at security and came up to Courtroom 457. The gallery is already full of market people."
    },
    "c38_witness": {
      "title": "38 Percent",
      "text": "You take the witness stand for the plaintiffs. Seon Jaeyoon’s questions are over in 12 minutes. Whether you wrote a dissent, and how that dissent was returned. Yeon Seojun stands for cross-examination (questioning the other side’s witness). He never once raises his voice. 'Witness, you have seen the Trigger Lab records made public last week. They show that under pressure you change your judgment 38 percent of the time. Wasn’t your dissent 3 years ago also a reaction produced by that day’s pressure?' On the courtroom screen, 41 lines of your record come up, each with the seconds you hesitated. Somewhere in the gallery a voice says 'Why is that up there.' Yeon Seojun turns one more page. 'And after writing that opinion, Witness, what did you do to stop the loan?'",
      "memo": [
        "On screen: 41 lines of your response record -- judgment reversals 38%",
        "Record made by: KD Financial Group’s Trigger Lab, without your consent",
        "Last question: 'What did you do to stop it'",
        "Han Seoyun in the back row of the gallery"
      ],
      "choices": {
        "c38_witness_consent": {
          "label": "Object to admitting a record made without consent"
        },
        "c38_witness_admit": {
          "label": "Skip the number; face the gallery, admit what you didn’t stop"
        },
        "c38_witness_maker": {
          "label": "Fire back that the defendant made that record"
        },
        "reframe": {
          "label": "Ask how the split trials ended"
        },
        "c38_witness_evidence_turn": {
          "label": "Find the boxes of papers the defense says the 212 lack"
        }
      },
      "place": "Seoul Central District Court · Courtroom 457",
      "clock": "First hearing · 15:10",
      "question": "Your response record, made without your consent, is being used to chip away at your credibility. How do you answer from the witness stand?",
      "lead": "Your name is called as a witness for the plaintiffs. As you walk to the stand, Attachment 17 lights up on the screen."
    },
    "c38_plaintiff": {
      "title": "Six Lathes",
      "text": "Moon Gaeul takes the witness stand as lead plaintiff. She unfolds the three A4 pages Seon Jaeyoon wrote for her, reads the first line, then folds the paper and puts it in her pocket. 'My husband ran six lathes. When FlowOn went under (a company collapsing because it can’t pay its debts), 400 million won in delivery payments vanished at once. The bank says you have to have papers to be a victim. My husband’s papers, you know where they are? In the columbarium, with my husband.' Yeon Seojun rises quietly. 'Your Honor, the lead plaintiff’s statement is an expression of emotion unrelated to the issues.' When the judge asks her to answer in the form of responses to questions, Moon Gaeul lifts her head. 'Then ask me. Why doesn’t my husband have papers?' When she reaches the 1st memorial anniversary, her voice breaks off. In the gallery, Moon Hajun stands up, gripping his notebook.",
      "memo": [
        "Gaon Precision: 6 lathes, 400 million won in delivery payments never recovered",
        "Moon Sungho, head of the company, died the year after it went under",
        "Prepared statement, 3 pages of A4 -- only the first line read",
        "Defense objection: 'an expression of emotion'"
      ],
      "choices": {
        "c38_plaintiff_pause": {
          "label": "Ask the judge for a 5-minute recess so she can breathe"
        },
        "c38_plaintiff_letter": {
          "label": "Have her husband’s letter formally filed as evidence"
        },
        "c38_plaintiff_move": {
          "label": "Propose ending her statement here and moving to the law"
        },
        "reframe": {
          "label": "Ask how the split trials ended"
        },
        "c38_plaintiff_evidence_turn": {
          "label": "Find the boxes of papers the defense says the 212 lack"
        }
      },
      "place": "Seoul Central District Court · Courtroom 457",
      "clock": "First hearing · 16:20",
      "question": "The lead plaintiff folded up her prepared statement, spoke about her husband, and her voice broke. What do you do?",
      "lead": "Lead plaintiff Moon Gaeul’s name is called. She takes off her apron, folds it, and walks to the stand."
    },
    "c38_final": {
      "title": "1,528 and 212",
      "text": "Just before the hearing (the court session where both sides present their arguments and evidence) closes, the judge’s glasses come off. 'The evidence for the 212 among the plaintiffs stands differently. If we split the case (dividing one suit in two and trying each separately), a ruling for the 1,528 is possible within the year. Together, it goes past next year. Please submit the plaintiffs’ position by the next court date.' Yeon Seojun adds, as if he had been waiting. 'If the case is split, the defendant is willing to settle with the 1,528.' Seon Jaeyoon slides you a note. 83 plaintiffs aged 70 or older, 4 plaintiffs who have died since the suit was filed. On the way out of the courtroom, Moon Gaeul catches your sleeve. 'Split or not? I’m asking you because you’re the one who wrote the dissent. This time don’t just write it and stop.'",
      "memo": [
        "If split: ruling for the 1,528 this year -- no date at all for the 212",
        "Defendant: willing to settle with the 1,528 if split",
        "83 plaintiffs aged 70+, 4 died during the suit",
        "Plaintiffs’ position due by the next court date"
      ],
      "choices": {
        "c38_final_order": {
          "label": "Refuse the split; move to order the 212’s transaction records"
        },
        "c38_final_split": {
          "label": "Split so older plaintiffs get paid; fight on for the 212"
        },
        "c38_final_together": {
          "label": "Persuade all 1,740 to go to the end as one suit"
        },
        "reframe": {
          "label": "Reframe it with one last proposal"
        }
      },
      "place": "Seoul Central District Court · Courtroom 457",
      "clock": "Just before the hearing closes · 17:40",
      "question": "Split the trial in two, and the 1,528 get a judgment this year. Do you split the 1,740?",
      "lead": "The last statements are over and the judge’s glasses come off. The courtroom clock reads 5:40."
    },
    "c38_aftershock": {
      "title": "The 41st Box",
      "text": "6:30 p.m. On the courthouse front steps, with the heat wave warning still not lifted, the court officer hands back the rice cake boxes. You left forty boxes and there are forty-one. Kang Taemin got bored on guard and folded an empty box together, and he says he argued with the officer about it for 20 minutes. Moon Gaeul tears open the first box and holds it out to the officer. 'I know the rules say no. Have them after work.' Moon Hajun passes his courtroom notes around, and the last page says 'Mom said Dad’s name four times in court today.' At the foot of the steps, Seo Harin lowers her camera. 'The documentary airs tomorrow night. Three of today’s plaintiffs are in it.' She nods toward the courthouse hallway. 'Just now one of the group’s lawyers smiled at our cinematographer and said, get the broadcast ready, then walked off.'",
      "memo": [
        "40 boxes of rice cakes returned -- counted, 41 boxes",
        "Moon Hajun’s courtroom notes: 23 pages",
        "Seo Harin’s documentary “The Unsigned” airs tomorrow 22:00",
        "Group’s lawyer: 'Get the broadcast ready'"
      ],
      "choices": {
        "c38_after_record": {
          "label": "Send the testimony gist and notes to the lawyers and Leadline"
        },
        "c38_after_warm": {
          "label": "Stay by Moon Gaeul outside the court till the plaintiffs leave"
        },
        "c38_after_rush": {
          "label": "Leave the plaintiffs and run down the hall after the lawyer"
        }
      },
      "place": "Seoul Central District Court · Road outside the front gate",
      "clock": "Heat wave warning · 18:30",
      "question": "The evening you get the rice cake boxes back, you hear the group’s lawyer smiled about tomorrow night’s documentary on his way out. How do you close this evening?"
    },
    "c38_notes": {
      "title": "Courtroom Notes",
      "text": "A 10-minute recess. In the gallery, Moon Hajun holds out a sketchbook. He told his summer supplementary classes it was a 'social studies field trip' and skipped. On the first page, the eight at the defense table are drawn as an octagon, with an analysis that their ties come in three colors and a tally that reads 'Yeon Seojun: “It is only that” x11.' Seon Jaeyoon holds back a laugh and coughs. On the next page, Moon Hajun’s handwriting slows. Foreman Kim, Technician Park and Technician Yoon of To-the-End Precision. Technicians who went three months unpaid when Gaon Precision collapsed. 'The foremen are part of the 212 too. Their names aren’t on the loan papers.'",
      "memo": [
        "Moon Hajun’s sketchbook -- 7th page of courtroom notes",
        "Among the 212: 3 Gaon Precision technicians",
        "Technicians’ unpaid wages: three months"
      ],
      "choices": {
        "c38_notes_choice_3": {
          "label": "He has exams; let him watch this far and send him to school"
        },
        "c38_notes_choice_1": {
          "label": "Turn the three technicians’ names into statements first"
        },
        "c38_notes_choice_2": {
          "label": "Explain to Moon Hajun how notes become evidence, and limits"
        }
      },
      "place": "Seoul Central District Court · Courtroom 457 gallery",
      "clock": "Recess · 14:50",
      "question": "A 3rd-year high schooler’s courtroom notes list three technicians whose names aren’t on the loan papers. What do you do with these notes?"
    },
    "c38_column": {
      "title": "The Missing Line",
      "text": "Just before the court resumes, a message from Lee Minseo arrives. For eleven nights since the leak, she has been sending deletion requests, and early this morning her request numbers passed 5,000. 'What’s on the screen is 41 lines out of 380,000. They picked only the lines where you reversed. The 2023-0412 line isn’t there.' There is no one now who doesn’t know that line. Hesitation before writing the dissent: 0.0 seconds, and in the verdict field, 'hard to control.' That one line made your next 3 years harder. A moment later one more line comes. 'I wonder how many hours it took to pick those 41 lines. I’m on day eleven of deleting mine.'",
      "memo": [
        "Shown on screen: 41 of 380,000 lines -- reversals only",
        "Missing line: 2023-0412 dissent, 0.0 seconds of hesitation",
        "Lee Minseo’s deletion requests pass 5,000"
      ],
      "choices": {
        "c38_column_choice_1": {
          "label": "Call Lee Minseo first and ask if she’s okay"
        },
        "c38_column_choice_3": {
          "label": "Hand just the 0-second line to reporters today"
        },
        "c38_column_choice_2": {
          "label": "Ask the court to read the missing 0-second line too"
        }
      },
      "place": "Seoul Central District Court · Courtroom 457, plaintiffs’ table",
      "clock": "Just before resuming · 15:58",
      "question": "The defense picked out only the 41 lines out of 380,000 where you reversed, and left out the 0-second line. How do you use this?"
    },
    "c38_door": {
      "title": "The 15 Outside the Door",
      "text": "The gallery ran out of seats, and 15 people were left outside the courtroom. One of them is Na Junhyuk, who got in at 2:20 because his KTX was late. He sits on a chair by the door, takes down Moon Gaeul’s voice as it leaks through the gap at 30 years of teller-window speed, and reads it line by line to the grandmothers in the hallway. 'Just now she said, why doesn’t my husband have papers.' One grandmother takes out a handkerchief, and another says 'Good for her.' Na Junhyuk closes the notebook he’s been writing in. 'I tried counting how many people I sent away from the window in 30 years for not having papers. I stopped partway.'",
      "memo": [
        "15 waiting outside the courtroom",
        "Na Junhyuk’s dictation notebook: 6 pages",
        "Number of people turned away: stopped counting"
      ],
      "choices": {
        "c38_door_choice_3": {
          "label": "Leave the hallway to the officers; focus on the last arguments"
        },
        "c38_door_choice_2": {
          "label": "Request a bigger courtroom for the next court date"
        },
        "c38_door_choice_1": {
          "label": "Tell the 15 outside yourself what happened inside"
        }
      },
      "place": "Seoul Central District Court · 4th-floor hallway, by the door",
      "clock": "First hearing · 16:45",
      "question": "With no seats left, 15 people outside the courtroom are hearing the trial only through the gap in the door. What do you do?"
    },
    "c38_notes_reaction": {
      "title": "Do Yoonha’s Notebook",
      "text": "Just before the recess ends, Do Yoonha, who took a half day off from Gangseo Branch to come, calls you out to the hallway. The number 212 came from the notebook he kept by hand for 3 years behind the teller window. The group’s brief (a written summary of a side’s arguments filed with the court before trial) calls that notebook 'the private memo of a former teller.' Do Yoonha starts to laugh and stops. 'It is a private memo. I wrote it down because the company didn’t. But next to every one of those names is the product I sold them. That’s not my memory. That’s the bank’s product.'",
      "memo": [
        "3 years of notebooks called a 'private memo'",
        "Bank product names written next to the names"
      ],
      "choices": {
        "c38_notes_reaction_choice_1": {
          "label": "Propose filing Do Yoonha’s notebook as evidence"
        },
        "c38_notes_reaction_choice_2": {
          "label": "Back the notebook’s products with Gangseo window records"
        },
        "c38_notes_reaction_choice_3": {
          "label": "Have Do Yoonha just watch today and keep the notebook"
        }
      },
      "place": "Seoul Central District Court · 4th-floor hallway",
      "clock": "Recess · 14:57",
      "question": "Do Yoonha’s notebook, which counted the 212, is being called a 'private memo.' How do you use this notebook?"
    },
    "c38_column_reaction": {
      "title": "Top 1% Reversal Rate",
      "text": "Oh Jinwoo calls. Someone must have posted a photo of the courtroom screen to the group chat. 'Don’t call me, it’ll be a disaster. My reversal rate is top 1% too. If they pick only the lines where I flipped, I won’t get 41 lines on the stand, I’ll get 410.' He can’t tell whether he sounds wronged or amused. Then he goes quiet. 'But I counted the days I flipped in my record. Half of them were days I flipped to take somebody’s side. There’s the day last year I covered a night shift for Director Han Seoyun, too. It’s a table that writes down changing your mind for a person as being shaky. And they brought that in as your flaw.'",
      "memo": [
        "A top-1% reversal rate, worried",
        "A table that wrote down days of taking someone’s side as 'shakiness'"
      ],
      "choices": {
        "c38_column_reaction_choice_3": {
          "label": "Propose keeping Oh Jinwoo off the witness list"
        },
        "c38_column_reaction_choice_1": {
          "label": "Write down with Oh Jinwoo what happened each day he flipped"
        },
        "c38_column_reaction_choice_2": {
          "label": "Write a separate brief on what a reversal really means"
        }
      },
      "place": "Seoul Central District Court · 4th-floor hallway, by the window",
      "clock": "Just before resuming · 16:03",
      "question": "The days he changed his mind to take someone’s side are written down as 'shakiness.' What do you do with that table?"
    },
    "c38_door_reaction": {
      "title": "The Officer and the Night-Shift Lead",
      "text": "Beside the security check on the 1st floor, Kang Taemin has been sitting in front of the forty boxes of rice cakes for three hours. At some point he and the officer at the next seat started talking like old friends. After they found out they had both worked night shifts for 11 years, the officer brought over two cups of instant noodles, and Kang Taemin got three warnings not to use a box as a chair. When you come down, Kang Taemin keeps it short. 'We could hear Gaeul’s voice all the way down here. The officer went to shut the door and didn’t.' The officer pretends not to know and keeps his eyes on his screen. 'My mother ran a stall in a market too.'",
      "memo": [
        "Two people, 11 years each on night shift",
        "An officer who went to shut the door and didn’t"
      ],
      "choices": {
        "c38_door_reaction_choice_2": {
          "label": "Get a storage receipt and take the boxes back by the rules"
        },
        "c38_door_reaction_choice_1": {
          "label": "Insist the officer gets one box, outside the rules"
        },
        "c38_door_reaction_choice_3": {
          "label": "Leave the boxes; send Kang Taemin up to manage the line"
        }
      },
      "place": "Seoul Central District Court · 1st-floor lobby security check",
      "clock": "First hearing · 17:05",
      "question": "Kang Taemin, who guarded the rice cake boxes for three hours, and the officer have become friends. What do you do with these boxes?"
    },
    "c38_branch_hallway": {
      "title": "One Blank Line",
      "text": "A 20-minute recess. Han Seoyun is standing at the vending machine at the end of the 4th-floor hallway. Five months into a standby assignment (an HR measure that leaves you with no duties, waiting for your next post), she had been sitting in the back row of the gallery. She buys two cans of coffee and holds one out. 'That lawyer’s question was wrong. It shouldn’t be what you did to stop it, it should be who kept you from stopping it.' She takes out a folded sheet. It is a draft statement in which she has written out again, in her own hand, the reason your dissent was returned 3 years ago. The last line is blank. 'Who I received the order to return it from.' If she fills in that line, the group’s legal team will call her in again.",
      "memo": [
        "Han Seoyun’s draft statement: 2 pages of A4",
        "Blank line: the person who ordered the return",
        "Standby assignment: fifth month",
        "If filled in: the group legal team is expected to respond"
      ],
      "choices": {
        "c38_branch_hallway_wait": {
          "label": "Say the blank line is hers to decide; sit by her and wait"
        },
        "c38_branch_hallway_file": {
          "label": "Have Seon Jaeyoon call Han Seoyun as a witness next date"
        },
        "c38_branch_hallway_push": {
          "label": "Press her to fill the line today and file it with the court"
        }
      },
      "place": "Seoul Central District Court · 4th-floor hallway, at the vending machine",
      "clock": "Recess · 15:40",
      "question": "The line for who gave the order to return it is blank. What do you do, there beside Han Seoyun?"
    },
    "c38_branch_hallway_follow": {
      "title": "In the Hallway, You Can",
      "text": "Moon Gaeul comes out into the hallway. She sees Han Seoyun and stops. It is a name she read in the reference materials at the very end of the complaint. The person who pressed the return button. Han Seoyun bows her head first. 'I’m Han Seoyun. It’s the name I tried to tell you last year at the mediation committee and couldn’t.' Moon Gaeul says nothing for a long while, then takes two pieces of jeolpyeon rice cake wrapped in plastic out of her apron pocket. The only rice cakes security missed. 'You can’t eat in the courtroom. In the hallway, you can.' Han Seoyun takes the rice cakes and, for the first time, does not hide that she has been crying.",
      "memo": [
        "2 pieces of jeolpyeon that got past security",
        "Han Seoyun and Moon Gaeul meet face to face for the first time",
        "8 minutes until the court resumes",
        "The blank line in the statement is still blank"
      ],
      "choices": {
        "c38_branch_hallway_follow_side": {
          "label": "Have the two walk back into the courtroom side by side"
        },
        "c38_branch_hallway_follow_scope": {
          "label": "Have Han Seoyun set her testimony’s scope with Seon first"
        },
        "c38_branch_hallway_follow_back": {
          "label": "Say there’s no time; send Moon Gaeul back to her table first"
        }
      },
      "place": "Seoul Central District Court · 4th-floor hallway",
      "clock": "Recess · 15:52",
      "question": "The bereaved and the person who pressed the return button have met for the first time in the hallway. How do you send the two of them back into the courtroom?"
    },
    "c38_route_system": {
      "title": "The Split Cases",
      "text": "You close the brief that wants to cut off the 212 and ask how past trials ended after they were split. Lee Minseo sends an answer. It is a table she has been putting together night after night since the leak. 38 class actions (lawsuits filed jointly by many victims) from the past 10 years, downloaded from the court’s public judgment database. In 14 of them, plaintiffs without papers were split off (dividing one suit in two and trying each separately), and in 0 of those did the side without papers win. In the 9 that went to the end as one suit, more than half of the plaintiffs without papers were recognized through records the defendant held. 'Splitting doesn’t make it faster. It erases the people standing at the back. And the rulings don’t say that in a single line.'",
      "memo": [
        "Analysis of 38 class actions over the past 10 years",
        "14 split -- plaintiffs without papers won 0",
        "9 that stayed together -- over half recognized through defendant’s records"
      ],
      "choices": {
        "c38_route_system_drop": {
          "label": "Keep the stats as reference; stick to the court schedule"
        },
        "c38_route_system_publish": {
          "label": "Give the ruling stats to every plaintiff and to the court"
        },
        "c38_route_system_shift": {
          "label": "Move the fight to getting the records the defendant holds"
        },
        "c38_route_system_evidence_turn": {
          "label": "Find the boxes of papers the defense says the 212 lack"
        }
      },
      "place": "Seoul Central District Court · 4th-floor hallway bench",
      "clock": "First hearing · During recess",
      "question": "In the split cases, plaintiffs without papers have never once won. What do you do with this table?"
    },
    "c38_final_system_route": {
      "title": "Why Split, and After",
      "text": "Just before the judge closes the record, Lee Minseo, in the front row of the gallery, sets her laptop on her knees. At the bottom of the table of 38 cases, one more row has appeared with today’s date. Split: 14 cases; stayed together: nine. The 39th row has only its fields drawn in. She tilts the screen a little toward you. 'The rulings keep only the reason for splitting, never what came after. Whether the people in the back rows and the hallway today will still be in those seats at the next court date, that’s as far as this table knows.'",
      "memo": [
        "14 split -- plaintiffs without papers won 0",
        "9 stayed together -- over half recognized through defendant’s records",
        "212 without papers among 1,740 plaintiffs"
      ],
      "choices": {
        "c38_final_system_route_c": {
          "label": "Build a legal-costs fund for the 212 with the 1,528"
        },
        "c38_final_system_route_a": {
          "label": "If split, set the condition that the 212 are ruled on first"
        },
        "c38_final_system_route_b": {
          "label": "Agree to the split and just raise the settlement amount"
        }
      },
      "place": "Seoul Central District Court · Courtroom 457, plaintiffs’ table",
      "clock": "Just before the hearing closes",
      "question": "Only the reason for splitting stays in the ruling. What condition do you attach to keep the 212 on the record after the split?"
    },
    "c38_evidence_turn": {
      "title": "The 212 Pages That Weren’t There",
      "text": "When you lay the clue over the list of 212, the box list Ban Jaewook wrote down beside the investigators during the June search and seizure (an investigation that forcibly takes documents and items with a court’s permission) opens up. Box No. 18, document title '2023-0412 Linked Statement.' It records money and guarantees given to subcontracting firms (smaller companies a big company passes its work down to), and it has 212 entries. The very people said in court today to have 'not one sheet of paper tied to a loan' have a statement, and the group made it 3 years ago. Drawn up by KD Bank’s Corporate Finance Strategy Team. Ban Jaewook closes his notebook. 'It wasn’t that there were no papers. The side that had the papers was sitting at the defense table.'",
      "memo": [
        "Box No. 18, held by the prosecution",
        "'2023-0412 Linked Subcontracting & Guarantee Statement': 212 entries",
        "Drawn up by: KD Bank Corporate Finance Strategy Team, 3 years ago"
      ],
      "choices": {
        "c38_evidence_turn_wait": {
          "label": "Save it for the next date; let the defense say 'none' again"
        },
        "c38_evidence_turn_tell": {
          "label": "Tell the 212 plaintiffs about Box No. 18 first"
        },
        "c38_evidence_turn_request": {
          "label": "File today to have the prosecution’s records sent to court"
        }
      },
      "place": "Seoul Central District Court · 4th-floor hallway, by the window",
      "clock": "First hearing · 17:20",
      "question": "The statement for the 212 the defense said had no papers is in the prosecution’s Box No. 18. When, and to whom, do you bring this out?"
    },
    "c38_start_warm": {
      "title": "The Trial of the Ones Who Raised the Shutter",
      "text": "For three nights you kept watch over the 13-person group chat together on the 1st floor of the secondhand bookstore. When the shutter went up, nine were still there, and no one had left first. Seven days later, at dawn on August 6, the class action (a lawsuit filed jointly by many victims) goes before the court. Today is the first hearing (the court session where both sides present their arguments and evidence). Attachment 17 of the group’s brief (a written summary of a side’s arguments filed with the court before trial) is the very file you read together those three nights. Do Yoonha posts the rice cake shop’s address to the group chat. 'They say the gallery has 72 seats. How many of us are going?' Within a minute, nine replies come in.",
      "memo": [
        "Attachment 17: the leaked file you read together for three nights",
        "First hearing today 14:00, Courtroom 457",
        "Nine from the group chat signed up to watch"
      ],
      "choices": {
        "c38_start_warm_skip": {
          "label": "Skip Attachment 17 and move fast on the court schedule"
        },
        "c38_start_warm_signature": {
          "label": "Have the nine from the chat sit together in the front row"
        },
        "c38_start_warm_object": {
          "label": "First write a motion to strike the leaked record"
        },
        "c38_start_warm_beside": {
          "label": "Sit with Moon Gaeul and pick what she’ll say in court"
        },
        "c38_start_warm_reframe": {
          "label": "Ask how the split trials ended"
        }
      },
      "place": "Gaeul Rice Cakes, Mangwon Market · By the steamers",
      "clock": "August 6 · Day of the first hearing · 05:50",
      "question": "The file you read together for three nights has become the defendant’s attachment as is. Where will those nine stand today?",
      "lead": "The group chat that got through three nights together is buzzing again from dawn. Everyone says they’re coming to court."
    },
    "c38_start_record": {
      "title": "The Trial of the One Who Left an Official Letter",
      "text": "In the names of the 13 people you could reach, you filed a deletion request and a request to investigate how the leak happened as official letters, and to the leak request you attached a comparison table showing the leaked copy and the original don’t differ by a single character. Today the class action (a lawsuit filed jointly by many victims) goes before the court. It is the first hearing (the court session where both sides present their arguments and evidence). The group’s brief (a written summary of a side’s arguments filed with the court before trial), which came in last night, cites that letter’s reference number. 'According to material the plaintiffs’ own witness confirmed as genuine, the witness is a person who changes judgment under pressure.' The document you filed to protect the record has become the grounds for aiming that record at you.",
      "memo": [
        "The brief cites the reference number of the letter you filed",
        "Attachment 17: the leaked response record",
        "First hearing today 14:00, Courtroom 457"
      ],
      "choices": {
        "c38_start_record_beside": {
          "label": "Sit with Moon Gaeul and pick what she’ll say in court"
        },
        "c38_start_record_skip": {
          "label": "Skip Attachment 17 and move fast on the court schedule"
        },
        "c38_start_record_signature": {
          "label": "Write a brief: genuine is not the same as reliable"
        },
        "c38_start_record_object": {
          "label": "First write a motion to strike the leaked record"
        },
        "c38_start_record_reframe": {
          "label": "Ask how the split trials ended"
        }
      },
      "place": "Gaeul Rice Cakes, Mangwon Market · By the steamers",
      "clock": "August 6 · Day of the first hearing · 05:45",
      "question": "The comparison table you attached to your letter is cited as grounds for aiming at you. How do you take that document back?",
      "lead": "While the rice cakes steam, Seon Jaeyoon shows you a paragraph of the group’s brief on her phone. The reference number of your letter is in it."
    },
    "c38_start_rush": {
      "title": "The Trial of the One Who Ran Ahead",
      "text": "The moment Moon Gaeul’s text came, you left your sleeping colleagues and chased the place the leaked file first went around. The trail went cold on the third day, and you spent the remaining four in public-interest lawyer Seon Jaeyoon’s office in Mangwon-dong, writing 90 questions and answers for witness examination. And now it is the night before the class action (a lawsuit filed jointly by many victims) goes before the court. Tomorrow is the first hearing (the court session where both sides present their arguments and evidence). At 11 p.m., the group’s brief (a written summary of a side’s arguments filed with the court before trial) came in. Attachment 17 is the very file you were chasing. You know where the trail went cold, but none of the 90 has an answer for when it shows up in court. In the group chat, 312 messages have piled up unread for seven days.",
      "memo": [
        "90 witness examination Q&As -- 0 on the leaked record",
        "Attachment 17: the leaked response record",
        "312 unread messages in the group chat"
      ],
      "choices": {
        "c38_start_rush_beside": {
          "label": "Sit with Moon Gaeul and pick what she’ll say in court"
        },
        "c38_start_rush_object": {
          "label": "First write a motion to strike the leaked record"
        },
        "c38_start_rush_signature": {
          "label": "Demand before trial that they reveal Attachment 17’s source"
        },
        "c38_start_rush_skip": {
          "label": "Skip Attachment 17 and move fast on the court schedule"
        },
        "c38_start_rush_reframe": {
          "label": "Ask how the split trials ended"
        }
      },
      "place": "Gaeul Rice Cakes, Mangwon Market · By the steamers",
      "clock": "August 6 · Day of the first hearing · 05:35",
      "question": "The 90 Q&As you prepared alone have no answer on the leaked record. What do you demand before the trial?",
      "lead": "You reach the rice cake shop for the first time in seven days, and the group chat alerts go off all at once."
    }
  },
  "echoReplies": {
    "c38_start_beside": "Choosing together, Moon Gaeul takes the three A4 pages. Whether she reads them to the end, she won’t know until she stands at the witness stand.",
    "c38_start_object": "The motion is filed before noon. The court says it 'will decide after hearing the arguments.' Attachment 17 goes up on the screen today.",
    "c38_start_skip": "The schedule holds. Attachment 17 goes up on the courtroom screen without anyone challenging it.",
    "c38_gallery_statements": "212 statements pile up on the plaintiffs’ table. For every crooked handwritten one, Yeon Seojun asks 'how it came to be written.'",
    "c38_gallery_records": "The request goes into the court record. The defendant holds the bank’s systems, and the defendant only answers that it 'will look into it.'",
    "c38_gallery_first": "The case for the 1,528 goes in strong. The people without papers in the gallery don’t ask when their turn will come.",
    "c38_witness_admit": "When you admit it, the gallery goes quiet. Yeon Seojun asks that the answer be entered in the record exactly.",
    "c38_witness_consent": "The objection is right in law. While the court puts off its decision, the number 38 stays up on the screen.",
    "c38_witness_maker": "When you fire back, someone in the gallery starts clapping and is stopped by an officer. For the first time, Yeon Seojun stops mid-page.",
    "c38_plaintiff_pause": "She gets the 5 minutes. Moon Gaeul drinks a sip of water in the hallway, comes back, and tells the 1st anniversary story to the end.",
    "c38_plaintiff_letter": "Once the letter is evidence, Yeon Seojun reads it too. The sentence 'Next time, to the end' stays in the record with a number on it.",
    "c38_plaintiff_move": "The statement ends. Walking back to her seat, Moon Gaeul crumples the A4 in her pocket once more.",
    "c38_final_together": "When you make the case, some of the 1,528 shake their heads. Money they could have had this year, 83 elderly plaintiffs wait another year for.",
    "c38_final_order": "When you file, the defendant answers that finding the transaction records will take three months. Those three months are the 212’s time too.",
    "c38_final_split": "With the split, the 1,528 get a ruling within the year. The 212’s case gets a new case number, and no first court date yet.",
    "c38_after_warm": "You stay on the steps until the last plaintiff gets on the bus. Moon Gaeul pushes a bag of rice cakes into your bag and says, 'Watch the show with us tomorrow night too.'",
    "c38_after_record": "The document reaches the legal team and Leadline at 11 p.m. Seo Harin underlines two of its sentences. She spends a long time deciding whether to leave out Moon Hajun’s octagon drawing.",
    "c38_after_rush": "At the end of the hallway you catch up with the group’s lawyer. When you bring up the documentary, he smiles instead of answering. On the steps, the plaintiffs scatter, leaving your box of rice cakes behind.",
    "c38_notes_choice_1": "Once the names become statements, Foreman Kim has a case number for the first time. Yeon Seojun is the first to read that number.",
    "c38_notes_choice_2": "Moon Hajun takes down the explanation. The notes can’t be evidence, but from the next page on, his handwriting turns as neat as a court record.",
    "c38_notes_choice_3": "Moon Hajun starts to shoulder his bag, then sits back down. 'Just until Mom’s turn.' He writes the number 212 on the sketchbook cover.",
    "c38_column_choice_1": "Lee Minseo picks up, says nothing for a while, then laughs. 'I’m writing number 5,013 right now.' 4 minutes until the court resumes.",
    "c38_column_choice_2": "When you ask, the court orders Yeon Seojun to submit the entire original. That original holds the 0-second line along with all of 63 people’s hesitations.",
    "c38_column_choice_3": "The 0 seconds becomes an evening headline. In the comments under the story, the other 380,000 lines spread again.",
    "c38_door_choice_1": "When you tell them yourself, the grandmothers take your hands in turn. Meanwhile, inside the courtroom, Yeon Seojun wraps up his final argument.",
    "c38_door_choice_2": "The request may be granted. The 150-seat courtroom is free only twice a month, and the next court date slips by that much.",
    "c38_door_choice_3": "The hallway goes quiet. Na Junhyuk stays on alone and reads the last line of his notebook to the grandmothers.",
    "c38_notes_reaction_choice_1": "Once the notebook is evidence, Yeon Seojun will call Do Yoonha to the stand. To make him read out, line by line, the names of the products he sold.",
    "c38_notes_reaction_choice_2": "When you match them, 190 of the notebook’s 212 lines overlap with the window records. The other 22 lines are still only Do Yoonha’s memory.",
    "c38_notes_reaction_choice_3": "Do Yoonha goes back to the gallery. In his bag, the notebook still carries the name “private memo.”",
    "c38_column_reaction_choice_1": "When you write it out, 11 of the 23 days he flipped have someone else’s name on them. Oh Jinwoo says 'I’m nicer than I thought,' and everyone laughs.",
    "c38_column_reaction_choice_2": "The brief is sharp. For the first time, the court starts to doubt a table that calls someone who changed their mind someone who wavered.",
    "c38_column_reaction_choice_3": "Off the list, Oh Jinwoo is relieved. The stories behind the days he flipped come off with him.",
    "c38_door_reaction_choice_1": "The officer waves it away, then says 'After work, then.' Kang Taemin nods like he heard it as a witness.",
    "c38_door_reaction_choice_2": "The receipt says '40 boxes of rice cakes.' Kang Taemin asks them to change it, 'It’s 41,' so it gets written again.",
    "c38_door_reaction_choice_3": "Once Kang Taemin goes up, the hallway line is sorted out in 30 seconds. Left alone, the officer starts counting the boxes.",
    "c38_branch_hallway_wait": "While you wait, Han Seoyun writes nothing until she finishes her canned coffee. Then she uncaps her pen.",
    "c38_branch_hallway_file": "Once the request is filed, Han Seoyun becomes a witness. A witness has to report court appearances to the company, even on standby assignment.",
    "c38_branch_hallway_push": "When you press her, Han Seoyun writes only the first letter of a name on the blank line. She can’t write the rest.",
    "c38_branch_hallway_follow_side": "When they walk in side by side, a murmur runs through the gallery. The one who dissented, the one who returned it and the bereaved sit in the same row.",
    "c38_branch_hallway_follow_scope": "Once the scope is set, what Han Seoyun will and won’t say is divided on a single sheet. The blank line is marked 'next court date.'",
    "c38_branch_hallway_follow_back": "Moon Gaeul goes back to the plaintiffs’ table. Han Seoyun is left alone in the hallway, holding two pieces of jeolpyeon.",
    "c38_route_system_publish": "Once the stats are out, several of the 1,528 call first. 'So we shouldn’t split either, right?'",
    "c38_route_system_shift": "When you move the fight, the burden of proof tilts a little toward the defendant. The trial gets that much longer.",
    "c38_route_system_drop": "The schedule holds. The table of 38 cases stays only on Lee Minseo’s laptop.",
    "c38_final_system_route_a": "When you set the condition, the court for the first time sets a separate date for the 212. The defendant objects that the condition has no precedent.",
    "c38_final_system_route_b": "As the amount rises, the faces of the 1,528 brighten. The 212’s case appears nowhere in the settlement record.",
    "c38_final_system_route_c": "Once the fund exists, the 1,528 each set aside a little of their share to pay for the 212’s trial. No one forced that field on anyone.",
    "c38_evidence_turn_request": "The request is filed today. It takes a month for the prosecution to send the records, and all that time the defendant does not take back the word 'none.'",
    "c38_evidence_turn_tell": "Of the 212 who hear it, one grandmother says 'Then I’m a victim too.' It is the voice of ticket No. 38 from last year.",
    "c38_evidence_turn_wait": "If you save it, at the next court date defense lawyer Yeon Seojun will repeat the same sentence. Until then, the 212 remain people without papers.",
    "c38_gallery_evidence_turn": "Trace the box numbers backward, and having no papers splits apart from the side that has them not handing them over.",
    "c38_witness_evidence_turn": "Trace the box numbers backward, and having no papers splits apart from the side that has them not handing them over.",
    "c38_plaintiff_evidence_turn": "Trace the box numbers backward, and having no papers splits apart from the side that has them not handing them over.",
    "c38_route_system_evidence_turn": "Trace the box numbers backward, and having no papers splits apart from the side that has them not handing them over.",
    "case38_memory_system": "Even handing over Attachment 17, there is no judgment of yours in it, only your hesitation. Lee Minseo turns the table toward the 212 the brief is trying to cut off.",
    "case38_memory_evidence": "Lay the witness order alongside, and the other side already knew who had what. The list of papers they said didn’t exist has box numbers on it too.",
    "c38_start_warm_beside": "Choosing together, Moon Gaeul takes the three A4 pages. Whether she reads them to the end, she won’t know until she stands at the witness stand.",
    "c38_start_warm_object": "The motion is filed before noon. The court says it 'will decide after hearing the arguments.' Attachment 17 goes up on the screen today.",
    "c38_start_warm_skip": "The schedule holds. Attachment 17 goes up on the courtroom screen without anyone challenging it.",
    "c38_start_warm_signature": "With the nine in the front row, Yeon Seojun has to look at those faces every time he reads from Attachment 17. In exchange, nine of the 72 seats come out of the market people’s share.",
    "c38_start_record_beside": "Choosing together, Moon Gaeul takes the three A4 pages. Whether she reads them to the end, she won’t know until she stands at the witness stand.",
    "c38_start_record_object": "The motion is filed before noon. The court says it 'will decide after hearing the arguments.' Attachment 17 goes up on the screen today.",
    "c38_start_record_skip": "The schedule holds. Attachment 17 goes up on the courtroom screen without anyone challenging it.",
    "c38_start_record_signature": "The brief wins on logic. A record being genuine and the reading of the side that made it being right are different matters. But the court will read it not today, but at the next court date.",
    "c38_start_rush_beside": "Choosing together, Moon Gaeul takes the three A4 pages. Whether she reads them to the end, she won’t know until she stands at the witness stand.",
    "c38_start_rush_object": "The motion is filed before noon. The court says it 'will decide after hearing the arguments.' Attachment 17 goes up on the screen today.",
    "c38_start_rush_skip": "The schedule holds. Attachment 17 goes up on the courtroom screen without anyone challenging it.",
    "c38_start_rush_signature": "When you demand it, Yeon Seojun smiles and says it was 'lawfully obtained.' Getting that one sentence out of him pushes Moon Gaeul’s first statement back 20 minutes, and the 312 in the group chat are still unread."
  },
  "choiceVoiceLines": {
    "c38_start_beside": "Saying the trial belongs to Moon Gaeul, you sit beside her and pick what she’ll say in court today.",
    "c38_start_object": "So the plaintiffs’ trial doesn’t turn into picking at the witness, you first write a motion to strike the leaked record from evidence.",
    "c38_start_skip": "So the first hearing doesn’t drift into a fight over the leaked record, you skip Attachment 17 and move fast on the court schedule.",
    "c38_gallery_statements": "To pile up, right there, the papers they say don’t exist, you file the 212 handwritten statements today, one by one.",
    "c38_gallery_records": "Saying that if there are no papers you’ll show what remains on the bank’s side, you offer to prove the 212 with the bank’s transaction records.",
    "c38_gallery_first": "It’s two against eight lawyers today, so you push the case of the 1,528 with papers first.",
    "c38_witness_admit": "Saying a fight over 38 percent would make the trial about you, you skip the number, face the gallery and admit what you didn’t stop that day.",
    "c38_witness_consent": "Saying it is a record made without consent and then leaked, you object to admitting it as evidence.",
    "c38_witness_maker": "Saying the side that did the measuring is using its own measurements to find fault, you fire back that the defendant made that record.",
    "c38_plaintiff_pause": "Unable to leave her standing there with her voice broken, you ask the judge for a 5-minute rest so Moon Gaeul can catch her breath.",
    "c38_plaintiff_letter": "To answer “an expression of emotion” with paper, you have the letter her husband left formally filed as the plaintiffs’ evidence.",
    "c38_plaintiff_move": "Saying more time up there would only hurt Moon Gaeul, you propose ending her statement here and moving on to the legal arguments.",
    "c38_final_together": "Saying you can’t leave behind the people standing at the back, you persuade the plaintiffs that all 1,740 should go to the end as one suit.",
    "c38_final_order": "Saying the reason to split has to go first, you refuse the split and move for an order to produce the 212’s transaction records.",
    "c38_final_split": "So the 83 older plaintiffs get a ruling first, within the year, you agree to the split and fight for the 212 separately.",
    "c38_after_warm": "Saying today belongs to these people, you stay beside Moon Gaeul outside the court until all the plaintiffs have gone.",
    "c38_after_record": "Saying today’s courtroom must stand in writing before the broadcast, you write up the testimony gist and the courtroom notes as a document and send it to the legal team and Leadline.",
    "c38_after_rush": "Saying you need to know today what that smile meant, you leave the plaintiffs, run down the hallway and catch up with the group’s lawyer.",
    "c38_notes_choice_1": "Because these are people whose names aren’t on the loan papers, you first turn the three technicians’ names in the notes into statements.",
    "c38_notes_choice_2": "So his hopes don’t climb only to be crushed, you explain to Moon Hajun the procedure and the limits of using the notes as evidence.",
    "c38_notes_choice_3": "He’s an exam student who even skipped supplementary classes, so you let him watch this far today and send him back to school.",
    "c38_column_choice_1": "Worried first about the one deleting alone for eleven days, you call Lee Minseo and ask if she’s okay.",
    "c38_column_choice_2": "Saying 41 picked-out lines are not a record, you ask the court to read the missing 0-second line too.",
    "c38_column_choice_3": "Saying you have to turn this around before the 41 lines set, you hand just the 0-second line to reporters today.",
    "c38_door_choice_1": "Feeling the lines he took down won’t be enough, you tell the 15 outside the courtroom yourself what happened inside.",
    "c38_door_choice_2": "Saying a trial heard through the gap in a door ends today, you request a bigger courtroom for the next court date.",
    "c38_door_choice_3": "Saying the time left belongs inside the courtroom, you leave the hallway to the officers and focus on the last arguments.",
    "c38_notes_reaction_choice_1": "Saying it is a record of what the company didn’t write down, you propose filing Do Yoonha’s notebook as the plaintiffs’ evidence.",
    "c38_notes_reaction_choice_2": "So “private memo” won’t stick, you back the notebook’s product names by matching them with Gangseo Branch window records.",
    "c38_notes_reaction_choice_3": "Saying you can’t put out front someone who still sits at the window, you propose Do Yoonha just watch today and the notebook stay put.",
    "c38_column_reaction_choice_1": "To bring back what the table erased, you write down with Oh Jinwoo what happened on each day he flipped.",
    "c38_column_reaction_choice_2": "So that changing your mind to take a side isn’t read as wavering too, you write a separate brief on what a reversal really means.",
    "c38_column_reaction_choice_3": "Saying you can’t let 410 lines go up on the screen, you propose keeping Oh Jinwoo off the witness list.",
    "c38_door_reaction_choice_1": "Saying the heart that went to shut the door and didn’t has to be repaid, you insist the officer gets one box of rice cakes, outside the rules.",
    "c38_door_reaction_choice_2": "So the officer doesn’t end up in trouble, you get a storage receipt and take the boxes back by the rules.",
    "c38_door_reaction_choice_3": "Saying those hands are wasted sitting for three hours, you leave the boxes and send Kang Taemin up to manage the line outside the courtroom.",
    "c38_branch_hallway_wait": "Since Han Seoyun is the one who will be called back to the legal team, you leave the blank line hers to decide and sit beside her, waiting.",
    "c38_branch_hallway_file": "Saying words spoken in a hallway don’t make a record, you have Seon Jaeyoon formally call Han Seoyun as a witness for the next court date.",
    "c38_branch_hallway_push": "Saying you have to get it before she changes her mind, you press her to fill in the blank line today and file it with the court.",
    "c38_branch_hallway_follow_side": "Wanting the words that opened up in the hallway to carry into the courtroom, you have the two walk back in side by side.",
    "c38_branch_hallway_follow_scope": "So nothing slips in that the legal team can seize on, you have Han Seoyun set the scope of her testimony with Seon Jaeyoon first.",
    "c38_branch_hallway_follow_back": "Saying there’s little recess left, you send Moon Gaeul back to the plaintiffs’ table first.",
    "c38_route_system_publish": "Saying whether to split should be decided knowing this, you give the ruling stats to every plaintiff and to the court together.",
    "c38_route_system_shift": "Because that is the road the nine cases that stayed together won on, you move the fight to getting the records the defendant holds.",
    "c38_route_system_drop": "Saying other people’s trial numbers can’t be allowed to shake today, you keep the stats as reference and stick to the court schedule.",
    "c38_final_system_route_a": "Saying what comes after the split must stay in the ruling, you set the condition that, even if split, the 212 are ruled on first.",
    "c38_final_system_route_b": "Saying at least the side that can be paid should be paid for sure, you agree to the split and just raise the settlement amount.",
    "c38_final_system_route_c": "So the people in the back rows are still in those seats at the next court date, you build a fund with the 1,528 to pay the 212’s legal costs.",
    "c38_evidence_turn_request": "To break the word 'none' even one day sooner, you file today to have the prosecution’s records sent to the court.",
    "c38_evidence_turn_tell": "Because they are the ones who have heard “no papers” the longest, you tell the 212 plaintiffs about Box No. 18 first.",
    "c38_evidence_turn_wait": "Saying one more time in court leaves them no way out, you save it for the next court date and let the defense say 'none' again.",
    "c38_gallery_evidence_turn": "You trace the 212’s papers the defense called 'nonexistent' backward from the clue’s box numbers, and test whether they truly don’t exist.",
    "c38_witness_evidence_turn": "You trace the 212’s papers the defense called 'nonexistent' backward from the clue’s box numbers, and test whether they truly don’t exist.",
    "c38_plaintiff_evidence_turn": "You trace the 212’s papers the defense called 'nonexistent' backward from the clue’s box numbers, and test whether they truly don’t exist.",
    "c38_route_system_evidence_turn": "You trace the 212’s papers the defense called 'nonexistent' backward from the clue’s box numbers, and test whether they truly don’t exist.",
    "c38_start_warm_beside": "Saying the trial belongs to Moon Gaeul, you sit beside her and pick what she’ll say in court today.",
    "c38_start_warm_object": "So the plaintiffs’ trial doesn’t turn into picking at the witness, you first write a motion to strike the leaked record from evidence.",
    "c38_start_warm_skip": "So the first hearing doesn’t drift into a fight over the leaked record, you skip Attachment 17 and move fast on the court schedule.",
    "c38_start_warm_signature": "Since the records went in together, you agree that the nine from the group chat will all sit together in the very front row of the gallery.",
    "c38_start_record_beside": "Saying the trial belongs to Moon Gaeul, you sit beside her and pick what she’ll say in court today.",
    "c38_start_record_object": "So the plaintiffs’ trial doesn’t turn into picking at the witness, you first write a motion to strike the leaked record from evidence.",
    "c38_start_record_skip": "So the first hearing doesn’t drift into a fight over the leaked record, you skip Attachment 17 and move fast on the court schedule.",
    "c38_start_record_signature": "So the comparison table isn’t used as grounds for aiming at you, you write a brief arguing that genuine and reliable are not the same thing.",
    "c38_start_rush_beside": "Saying the trial belongs to Moon Gaeul, you sit beside her and pick what she’ll say in court today.",
    "c38_start_rush_object": "So the plaintiffs’ trial doesn’t turn into picking at the witness, you first write a motion to strike the leaked record from evidence.",
    "c38_start_rush_skip": "So the first hearing doesn’t drift into a fight over the leaked record, you skip Attachment 17 and move fast on the court schedule.",
    "c38_start_rush_signature": "Needing to know where a record missing from the 90 Q&As came from, you demand before the trial starts that they reveal Attachment 17’s source."
  },
  "pack": {
    "clue": {
      "title": "Box No. 18",
      "text": "The subcontracting and guarantee statement for the 212 the defense said had 'not one sheet of paper' was already drawn up 3 years ago by KD Bank’s Corporate Finance Strategy Team, and it now sits in Box No. 18, held by the prosecution."
    },
    "outcomes": {
      "c38_after_warm": {
        "tag": "Stayed Beside Them",
        "title": "You stayed on the courthouse steps until the plaintiffs had gone",
        "text": "The evening the first hearing ended, you stayed beside Moon Gaeul until the last plaintiff got on the bus. As you parted, Moon Gaeul put a bag of rice cakes in your bag."
      },
      "c38_after_record": {
        "tag": "Handed Over the Record",
        "title": "The testimony gist and 23 pages of courtroom notes became a document",
        "text": "You wrote up what was said in court today as a document and sent it to the plaintiffs’ legal team and Leadline. Plaintiffs who couldn’t come to court read their own trial for the first time."
      },
      "c38_after_rush": {
        "tag": "Ran Ahead",
        "title": "You left the plaintiffs and caught up with the group’s lawyer",
        "text": "When you asked what he was preparing for the documentary, he only smiled instead of answering. On the courthouse steps, your box of rice cakes was left behind."
      }
    },
    "continuityChallenges": {
      "c37_after_warm": {
        "title": "Stand with the ones who kept watch for three nights",
        "text": "The file you read together on the 1st floor of the secondhand bookstore has become the defendant’s evidence. Trust carries all the way to the courtroom only if those nine are not left alone on the witness stand."
      },
      "c37_after_record": {
        "title": "Take back the comparison table aimed at you",
        "text": "The comparison table you attached to your official letter has been cited as grounds proving your flaw. A record being genuine and its reading being right are different things. Reframe the table and the two come apart."
      },
      "c37_after_rush": {
        "title": "Fill the blank left by seven days of preparing alone",
        "text": "The seven days you spent chasing the trail without your colleagues left no answer for when that record takes the stand. That blank counts as fairness only when it is filled by following the court’s procedures."
      }
    }
  }
}
