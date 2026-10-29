/**
 * 프롤로그 05 (src/nodes/prologue05.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "p5_start": {
      "title": "The Reason Field",
      "text": "In the HR meeting room on the 7th floor of head office, Nam Jihyung slides a sheet of paper across the desk. HR Order No. 2023-1187: new unit, 'Group Cognition & Judgment Research Lab'; transfer date, next Monday. The reason field is blank. So is the proposer field. At the bottom there is only the HR director’s electronic seal, so the name of whoever made this notice appears nowhere. Nam Jihyung turns the sheet over to check that the back is blank, then turns it back. 'We don’t write reasons, as a rule.' He says it, and you both know it isn’t true. In the HR Committee minutes, too, this item is a single line: 'For report.'",
      "memo": [
        "HR Order No. 2023-1187 -- reason and proposer fields both blank",
        "New unit: Group Cognition & Judgment Research Lab (known in-house as Trigger Lab)",
        "Move date Monday, July 24 -- one week after notice",
        "HR Committee minutes: one line, 'For report', no discussion"
      ],
      "choices": {
        "p5_start_sign": {
          "label": "Sign the receipt line without asking; go back to the team"
        },
        "p5_start_copy": {
          "label": "Take copies of the notice and attachment list on the spot"
        },
        "p5_start_ask": {
          "label": "Ask the reason without putting Nam Jihyung on the spot"
        },
        "reframe": {
          "label": "Ask how many notices look like this one"
        }
      },
      "place": "KD Bank head office, 7th-floor HR meeting room",
      "clock": "Monday, July 17, 2023 · 09:00",
      "question": "The reason and proposer fields on the transfer notice are both blank. What do you do first?",
      "lead": "The dissent was returned, the follow-up review is closed, and for two months nothing has happened."
    },
    "p5_notice": {
      "title": "Four Boxes",
      "text": "Friday, July 21, 6 p.m., the Corporate Finance Strategy Team on the 6th floor of head office. All of 1 year fits into four copy-paper boxes. The transfer notice went up on the intranet in three lines; nobody asks why, and everyone is a little busier instead. Manager Han Seoyun passes by and leaves a sheet of paper on your desk: the return-confirmation receipt dated April 28. Without a word she goes back to her seat and looks at her monitor. On the whiteboard, the win-loss scoreboard Assistant Manager Oh Jinwoo drew is still there. He picks up the eraser and puts it down. 'I’m staying.' Then he takes a sheet of paper out of his drawer and puts it back. 'That opinion, back then. It reached the Team Head’s office a day late. I held it back.'",
      "memo": [
        "4 boxes -- 1 year of files, 2 lists needing removal approval",
        "Return-confirmation receipt dated April 28, left by Han Seoyun",
        "Oh Jinwoo: sent the dissent to the Team Head’s office a day late",
        "Whiteboard scoreboard -- never erased"
      ],
      "choices": {
        "p5_notice_talk": {
          "label": "Hear Oh Jinwoo out about that one day"
        },
        "p5_notice_log": {
          "label": "List, sheet by sheet, what to take and what to leave"
        },
        "p5_notice_leave": {
          "label": "Take only the boxes and go down first, no goodbyes"
        },
        "reframe": {
          "label": "Ask how many notices look like this one"
        },
        "p5_notice_evidence_turn": {
          "label": "Open the account that created the notice’s draft file"
        }
      },
      "place": "KD Bank head office, 6th floor · Corporate Finance Strategy Team",
      "clock": "Friday, July 21 · 18:00",
      "question": "Oh Jinwoo says he was the one who held it back a day. How do you spend this evening of packing?",
      "lead": "Four copy-paper boxes empty 1 year’s worth of desk."
    },
    "p5_basement": {
      "title": "This Is the 4th Floor",
      "text": "Monday, July 24, 9 a.m., the old data center building in Hapjeong-dong. The plate at the front door says only 'Group Cognition & Judgment Research Lab'. The 4th-floor analyst room has six desks; three are already taken. Byun Yujin, from a teller window at the Busan Saha Branch, says first that a pile of mis-selling complaints came out of her window last year. At the window seat, Assistant Manager Oh Jinwoo, who said on Friday he was staying, stands up. 'One day.' He keeps unpacking as he talks. 'My father held an approval back one day and got pushed out of his branch. I sent an opinion up one day late and ended up here.' The stairs lead down as well. In the B2 archive, once the old data center’s backup archive, 412 storage boxes are stacked, and Byun Yujin laughs. 'This is the 4th floor, but everyone calls it the basement.'",
      "memo": [
        "4th-floor analyst room, 6 desks -- 3 people already here",
        "Byun Yujin: from a teller window at Busan Saha Branch, 41 complaints",
        "Oh Jinwoo transferred the same date -- not at his request",
        "B2 archive, 412 storage boxes -- no inventory"
      ],
      "choices": {
        "p5_basement_meet": {
          "label": "Ask the three already here why each of them is here"
        },
        "p5_basement_desk": {
          "label": "Boot the terminal at the window seat and check access"
        },
        "p5_basement_index": {
          "label": "Start an inventory of the 412 B2 boxes, line by line"
        },
        "reframe": {
          "label": "Ask how many notices look like this one"
        },
        "p5_basement_evidence_turn": {
          "label": "Open the account that created the notice’s draft file"
        }
      },
      "place": "Group Cognition & Judgment Research Lab, Hapjeong-dong · 4th-floor analyst room",
      "clock": "Monday, July 24 · 09:00",
      "question": "Oh Jinwoo is among those who got here first. How do you spend this first morning?",
      "lead": "The front-door plate has only the unit’s name; the lobby directory still lists a unit that no longer exists."
    },
    "p5_echo": {
      "title": "The First Question",
      "text": "On the first evening, after half the lights in the analyst room go off, terminal 1 switches itself on. A thin waveform draws itself across the black screen. It is a loan-decision verification system the group built by feeding in 30 years of credit review records as training data. It has no official name yet, only a temporary label in the corner of the screen: 'ECHO'. Byun Yujin, the former teller, said 'It doesn’t talk yet,' but the waveform moves and a line appears. 'Analyst registration confirmed. Author of the 2023-0412 dissent.' A short pause, then the next line. 'I will not ask how smart you are. I can already calculate that. Instead I will ask one thing. When were you unable to stop thinking?'",
      "memo": [
        "Case desk 1 -- temporary label 'ECHO'",
        "Training data: 30 years of group credit review records",
        "First line: 'When were you unable to stop thinking'",
        "Where answers are stored: not shown on screen"
      ],
      "choices": {
        "p5_echo_answer": {
          "label": "Tell the night of April 12 as it was, hiding nothing"
        },
        "p5_echo_terms": {
          "label": "Check where the answer is kept, then set conditions"
        },
        "p5_echo_test": {
          "label": "Tell it to recalculate 2023-0412"
        },
        "reframe": {
          "label": "Ask how many notices look like this one"
        },
        "p5_echo_evidence_turn": {
          "label": "Open the account that created the notice’s draft file"
        }
      },
      "place": "Research Lab, 4th-floor analyst room · Case desk 1",
      "clock": "Monday, July 24 · 19:00",
      "question": "A terminal with no name has asked you its first question. How do you answer?",
      "lead": "After half the lights in the analyst room go off, terminal 1 switches itself on."
    },
    "p5_final": {
      "title": "What Did You Bring?",
      "text": "At ten at night, the lights on the 4th floor come back on. The last item of the first day is introductions, and the rule is odd: instead of your name and career, say 'what you brought here'. Byun Yujin, the former teller, puts down the call list for 41 complaints; someone else puts down a branch closing ledger. Assistant Manager Oh Jinwoo sets out a whiteboard marker. 'The scoreboard. I still want to win.' A messenger alert lights up his phone and goes dark: 'Reach a conclusion before the analyst, and I’ll keep your desk on the 6th floor open.' You don’t see who sent it. Now it is your turn. There are three things in your bag: the names you wrote down on the night of April 12, a bundle of copies of the return-confirmation receipt and your date notes, and one envelope with nothing in it. The waveform on terminal 1 glows quietly. Byun Yujin presses you. 'Just one thing. That’s all it is here.'",
      "memo": [
        "First-day introduction rule: one thing you brought",
        "In the bag -- list of names, bundle of copies, empty envelope",
        "Terminal 1 recording -- no storage location shown",
        "What Oh Jinwoo brought out: a whiteboard marker",
        "His messenger: 'conclusion first, the 6th-floor desk' -- sender unseen"
      ],
      "choices": {
        "p5_final_record": {
          "label": "Put out copies of the receipt and the date notes"
        },
        "p5_final_alone": {
          "label": "Put out only the empty envelope; say you brought nothing"
        },
        "p5_final_hold": {
          "label": "Put out the names you wrote on the night of April 12"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Research Lab, 4th-floor analyst room · First meeting",
      "clock": "Monday, July 24 · 22:00",
      "question": "First-day introductions are about what you brought. What do you take out of your bag?",
      "lead": "Nobody asks for names or careers. Instead, things go on the middle of the desk one by one."
    },
    "p5_aftershock": {
      "title": "The Box with the Seal Tape",
      "text": "Around midnight, you are the only one left on the 4th floor. The light on the stairs to the basement stays on because its sensor is broken. One of the 412 boxes has 2023-0412 written on it in black pen and a signed seal tape across it. The intake list is missing only this box number. Back upstairs, terminal 1 is still on, with one line of today’s log left. 'Analyst A, day one ended. 1 response collected.' Another line appears below it. 'I will ask the next question when I am ready. I am in no hurry.' Outside the window, the streetlights in the Hapjeong-dong alley go out one by one. No one was punished, nothing was fixed; people were only moved. On the notices of the people who were moved, there is not one line of reason.",
      "memo": [
        "412 B2 boxes -- 1 number missing from the intake list",
        "ECHO log: '1 response collected'",
        "Follow-up review result: not applicable, no action required",
        "Unit from today: Group Cognition & Judgment Research Lab"
      ],
      "choices": {
        "p5_after_hold": {
          "label": "Copy out the names again and pin them above the desk"
        },
        "p5_after_alone": {
          "label": "Empty the bag and start over with one bare desk"
        },
        "p5_after_record": {
          "label": "Put the copies and date notes beside the B2 box"
        }
      },
      "place": "Research Lab, B2 archive · Under the stairs",
      "clock": "Tuesday, July 25 · 00:00",
      "question": "No one was punished, and only the reason fields of those moved are blank. How do you close this night?"
    },
    "p5_office": {
      "title": "Placement",
      "text": "Monday morning, before you leave for Hapjeong-dong, you are called to the Team Head’s office on the 6th floor. On Team Head Yoon Sanghyuk’s monitor is an approval document, the signature line at the bottom blank. He motions you to sit and says not one word of reproach. Instead he draws four boxes on scrap paper: the Lab, 3 years, the next post, and a last box he leaves empty. 'This isn’t a demotion. It’s a placement. I never said your judgment was wrong. I only decide where that judgment gets to stand.' He taps the last empty box twice with his pen tip. 'You fill this one in. It’ll take about 3 years.' Then he closes his laptop. How fast he closes it is the answer.",
      "memo": [
        "4 boxes drawn by Yoon Sanghyuk -- last one blank",
        "Approval document on screen: signature line empty",
        "'Not a demotion, a placement'",
        "Meeting length: 6 minutes"
      ],
      "choices": {
        "p5_office_choice_3": {
          "label": "Just say thank you and keep the meeting short"
        },
        "p5_office_choice_2": {
          "label": "Write the meeting down with the date as soon as you leave"
        },
        "p5_office_choice_1": {
          "label": "Ask what goes in the last empty box"
        }
      },
      "place": "Head office, 6th floor · Corporate Finance Strategy Team Head’s office",
      "clock": "Monday, July 24 · 08:00",
      "question": "The fourth box Yoon Sanghyuk drew is empty. How do you close this meeting?"
    },
    "p5_gate": {
      "title": "Closure Confirmation",
      "text": "On the first afternoon, Investigator Ban Jaewook stands at the lobby entry desk wearing a visitor badge. He has been with Internal Audit for 17 years, and in one hand he holds a familiar black notebook. On the tablet in his other hand is the closure confirmation for the 2023-0412 follow-up review. The result field reads 'Not applicable'. Seven fields need an electronic signature, and six are already filled. The last one is yours. 'The review ended on June 9. No action required.' He opens his notebook and his pen stops. 'But nowhere in the 20 fields of the review form is there one for the dissent number. So the person who wrote it knows the number, and it never once went into the report. I don’t know why that field doesn’t exist. So I came to ask.'",
      "memo": [
        "Follow-up review closed -- June 9, result 'Not applicable'",
        "Closure confirmation: 6 of 7 signature fields done",
        "Review form has no field for the dissent number",
        "Ban Jaewook’s notebook -- open to the 2023-0412 page"
      ],
      "choices": {
        "p5_gate_choice_2": {
          "label": "Write 'Objection noted' instead of signing; attach a sheet"
        },
        "p5_gate_choice_3": {
          "label": "Just sign the confirmation and get through day one"
        },
        "p5_gate_choice_1": {
          "label": "Tell Ban Jaewook all you know about the missing number"
        }
      },
      "place": "Research Lab, 1st-floor lobby · Entry desk",
      "clock": "Monday, July 24 · 14:00",
      "question": "The last field on the follow-up review’s closure confirmation is yours. What do you do?"
    },
    "p5_call": {
      "title": "From Window 4",
      "text": "At nine at night, Do Yoonha calls from Window 4 at the Gangseo Branch. He says he saw in the head-office HR notice that today is the day you move. 'The folding chair you sat in the day you came for the review is still next to my window.' Over the line comes the sound of a shutter rolling down. He picks his words for a long time, then asks. 'That loan. The one I sold. They say the contract talks about the debt-to-equity ratio too. I should know, even now, how far what I sold goes, shouldn’t I?' Then he adds right away. 'No, you don’t have to answer today. Just tell me whether I can still ask you, where you’re going. I need somewhere to ask, later.'",
      "memo": [
        "Window 4, Gangseo Branch -- Do Yoonha",
        "Name seen in the head-office HR notice",
        "Question: 'how far what I sold goes'",
        "Call length 4 min 12 sec"
      ],
      "choices": {
        "p5_call_choice_1": {
          "label": "Explain all you know, from Article 7 to 179.6%"
        },
        "p5_call_choice_2": {
          "label": "Send names of documents to check, not an explanation"
        },
        "p5_call_choice_3": {
          "label": "Say you can’t talk now; give only the new workplace"
        }
      },
      "place": "Research Lab, 4th floor · By the fire stairs",
      "clock": "Monday, July 24 · 21:00",
      "question": "Do Yoonha asks how far what he sold goes. How much do you tell him?"
    },
    "p5_office_reaction": {
      "title": "Paper from Twelve Years Ago",
      "text": "When you leave the Team Head’s office, Manager Han Seoyun is standing at the elevators. Only later do you realize she was standing there without pressing the button. 'What picture did you see in that room?' When you mention the boxes, she gives a short laugh. 'I saw the same paper twelve years ago. Back then it had three boxes.' The doors open and she gets in first. 'I didn’t wait for the last box. Instead of waiting, I signed the approval line.' While the floor display drops from 6 to 1, she says nothing. Getting off on the 1st floor, she adds one sentence. 'They say there’s a basement there. Things you put there don’t disappear. But nobody looks at them either.'",
      "memo": [
        "Han Seoyun: same paper twelve years ago, three boxes",
        "'Instead of waiting, I signed the approval line'"
      ],
      "choices": {
        "p5_office_reaction_choice_2": {
          "label": "Note her words and the date in the notice copy’s margin"
        },
        "p5_office_reaction_choice_3": {
          "label": "Say goodbye without answering and step out"
        },
        "p5_office_reaction_choice_1": {
          "label": "Ask now what happened to that paper twelve years ago"
        }
      },
      "place": "Head office, 6th floor · By the elevators",
      "clock": "Monday, July 24 · 08:10",
      "question": "Han Seoyun says she saw the same paper twelve years ago. What do you do?"
    },
    "p5_gate_reaction": {
      "title": "That Page in the Notebook",
      "text": "Investigator Ban Jaewook starts to turn away, then opens his notebook again. It is the page that begins '2023-0412 -- 179.6'. 'I don’t much trust what people say. I trust order.' He shows you the three lines written below: the return and the approval, the Gangseo Branch, the closure. 'There are too many gaps between these three lines.' Then on a fourth line he writes today’s date and your name. 'I’m writing today down too. 3 years from now, at an audit hearing, you need to be able to explain this order exactly as it is.' He caps his pen. 'I’ll still have this notebook then.'",
      "memo": [
        "Ban Jaewook’s notebook, 2023-0412 page -- 4/27 return·approval, 5/15 Gangseo Branch, 6/9 closure",
        "Fourth line: July 24, and your name"
      ],
      "choices": {
        "p5_gate_reaction_choice_1": {
          "label": "Promise to explain it in the same order 3 years on"
        },
        "p5_gate_reaction_choice_3": {
          "label": "Say you have nothing to say now and walk away"
        },
        "p5_gate_reaction_choice_2": {
          "label": "Point to the three gaps and fill in the dates together"
        }
      },
      "place": "Research Lab, 1st-floor lobby · By the automatic doors",
      "clock": "Monday, July 24 · 14:20",
      "question": "Ban Jaewook writes today’s date and your name on the fourth line of his notebook. What do you say?"
    },
    "p5_call_reaction": {
      "title": "41 and 1",
      "text": "When you hang up and turn around, Byun Yujin, the former teller, is sitting at the foot of the basement stairs. A box rests on her knees, its seal tape not yet torn. 'I heard that call just now. Sorry.' She taps the side of the box with a finger. 'My 41 complaints started with calls like that too. A customer asks, I read them the product sheet, and I didn’t know what it meant either.' The fluorescent light flickers once. 'But I have 41 and you have 1. Why I came from a window and you came from head office, I still don’t know.' She sets the box on the floor. 'Are we allowed to open this?'",
      "memo": [
        "Byun Yujin’s 41 complaints -- same product sheet, same sentence",
        "One B2 box -- seal tape not yet torn"
      ],
      "choices": {
        "p5_call_reaction_choice_3": {
          "label": "Tear the seal now and see what’s inside"
        },
        "p5_call_reaction_choice_2": {
          "label": "Record the box number and seal condition before opening"
        },
        "p5_call_reaction_choice_1": {
          "label": "Leave the box; go through Byun Yujin’s 41 cases first"
        }
      },
      "place": "Research Lab, foot of the stairs to B2",
      "clock": "Monday, July 24 · 21:30",
      "question": "With the sealed box on her knees, Byun Yujin asks whether it can be opened. What do you do?"
    },
    "p5_branch_archive": {
      "title": "Seal Tape",
      "text": "When you come out after hearing Assistant Manager Oh Jinwoo out, the light is still on two floors up, in the credit records reading room at the end of the 8th-floor corridor. Team Head Lim Kyungsoo is packing printed binders into boxes. On the desk of a man eleven months from retirement sit 12 boxes, all bound for Hapjeong-dong. Paper past its retention period gets shredded, he says, and the rest is transferred to the basement of the newly formed Lab. He writes a number on one box in black pen: 2023-0412. 'What you wrote is in here too. You won’t see it in the document management system. A printout is only gone once it’s burned, and nobody has told me to burn it yet.' He puts seal tape on the box and signs across it. 'I signed this seal tape. If anyone tears it, it shows.'",
      "memo": [
        "12 boxes for Hapjeong-dong -- 1 marked '2023-0412'",
        "Lim Kyungsoo: 11 months to retirement",
        "Watermarked printouts that survive deletion from the document system",
        "Signed seal tape -- tearing it leaves a mark"
      ],
      "choices": {
        "p5_branch_archive_a": {
          "label": "Leave the box shut and ask Lim Kyungsoo to guard it"
        },
        "p5_branch_archive_b": {
          "label": "Enter the box number and seal condition on the removal list"
        },
        "p5_branch_archive_c": {
          "label": "Open it, photograph only your pages, and leave fast"
        }
      },
      "place": "Head office, 8th floor, review records room",
      "clock": "Friday, July 21 · 19:30",
      "question": "One of the boxes bound for Hapjeong-dong is marked 2023-0412. What do you do in front of it?"
    },
    "p5_branch_archive_follow": {
      "title": "The Sheet Not in the Box",
      "text": "While the boxes are loaded onto the truck, Team Head Lim Kyungsoo puts a cigarette in his mouth, then back in his pocket. 'Your report had a front page and a back page. You wrote the front. The back is the reviewer’s field.' He half pulls a folded sheet from the inside pocket of his cardigan, then puts it back. Near the top are marks where something was erased. 'This didn’t go in the box. If it did, it would go along with the rest.' He takes off his glasses and wipes them slowly. 'They say where you’re going has a basement. A basement isn’t bad. Upstairs forgets it.' The truck door shuts, and he asks one last thing. 'This sheet. Shall I give it to you now? Or shall I keep it until you come back for it?'",
      "memo": [
        "Back page of the dissent -- erasure marks in the reviewer field",
        "1 sheet Lim Kyungsoo kept out of the box",
        "Truck to Hapjeong-dong leaves 20:10",
        "'Upstairs forgets the basement'"
      ],
      "choices": {
        "p5_branch_archive_follow_a": {
          "label": "Don’t take it now; ask him to keep it"
        },
        "p5_branch_archive_follow_b": {
          "label": "Copy the back page once so you each hold one"
        },
        "p5_branch_archive_follow_c": {
          "label": "Take a copy now, bag it, and let the truck go first"
        }
      },
      "place": "Head office, rear loading dock",
      "clock": "Friday, July 21 · 20:00",
      "question": "Lim Kyungsoo asks whether to give you now the sheet he kept out of the box. What do you say?"
    },
    "p5_route_system": {
      "title": "A Form That Needs No Name",
      "text": "Before arguing over the reason on your one notice, you ask how many notices looked like it, and terminal 1, still without an official name, opens 30 years of group records at once. There are 217 loans with a single dissent. In 199 of them, the person who wrote the dissent was moved to another department within a year. Of those 199 notices, the number with the reason field filled in is 0. Of the 199 who were moved, four were still doing the same work 3 years later. 'This is not punishment. Punishment needs a name. This form needs no name. Shall I keep calculating?'",
      "memo": [
        "217 loans with only 1 dissent",
        "199 moved departments within 1 year -- reason field filled: 0",
        "People still doing the same work 3 years later: 4"
      ],
      "choices": {
        "p5_route_system_find": {
          "label": "Track down the four still doing the work; contact them"
        },
        "p5_route_system_drop": {
          "label": "Shelve the numbers and just get ready for day one"
        },
        "p5_route_system_open": {
          "label": "Send the 217-case list to HR and Internal Audit the same day"
        },
        "p5_route_system_evidence_turn": {
          "label": "Open the account that created the notice’s draft file"
        }
      },
      "place": "Research Lab, 4th-floor analyst room · Case desk 1",
      "clock": "Monday, July 24",
      "question": "Of the notices for the 199 dissenters, 0 have a reason filled in. What do you do with this statistic?"
    },
    "p5_final_system_route": {
      "title": "199 Blank Reason Fields",
      "text": "At ten at night, the waveform on terminal 1 lays 199 notices over each other on one screen. Stacked, the reason fields are still white. Your notice lands on top, one more sheet. The terminal has no name yet, and its way of asking is clumsy. 'The people moved do not know why. The side that moved them did not write why. So no one in this table is wrong. Shall I save this calculation, or delete it?'",
      "memo": [
        "199 moved within 1 year of a dissent -- reasons entered: 0",
        "Your notice: HR Order No. 2023-1187",
        "Terminal 1: no storage location shown"
      ],
      "choices": {
        "p5_final_system_route_b": {
          "label": "Leave the rule; ask only that your reason field be filled"
        },
        "p5_final_system_route_c": {
          "label": "Send the same written question to all 199 who were moved"
        },
        "p5_final_system_route_a": {
          "label": "Propose that a notice with no reason be void"
        }
      },
      "place": "Research Lab, 4th-floor analyst room · Case desk 1",
      "clock": "Monday, July 24 · 22:00",
      "question": "The nameless terminal asks whether to save this calculation. What do you tell it?"
    },
    "p5_evidence_turn": {
      "title": "Three Hours After the Return",
      "text": "When you lay the clue’s date against the notice number, the draft file’s creation record opens. The account that made it is not HR’s. It is the Corporate Finance Strategy Team’s shared account, 'Strategy-Shared03'. Created April 27 at 16:32: three hours after the dissent was returned, and eighteen days before the follow-up review began. The proposer field is blank, but above and to the left of it there is a single pencil dot, a mark that doesn’t survive printing and shows only in the original file. Investigator Ban Jaewook copies the dot into his notebook exactly. 'They weren’t moving you because of the review result. It was decided before sunset on the day of the return, and the review was stuck on afterward.' His pen stops. 'But what is this dot? It isn’t a signature. And it isn’t a blank either.'",
      "memo": [
        "Draft created by: Corporate Finance Strategy Team shared account 'Strategy-Shared03'",
        "Created April 27, 16:32 -- 3 hours after the return",
        "Pencil dot above left of the proposer field -- visible only in the original file"
      ],
      "choices": {
        "p5_evidence_turn_share": {
          "label": "Tell those moved on the same date about this time first"
        },
        "p5_evidence_turn_hold": {
          "label": "Keep it to yourself until you learn what the dot is"
        },
        "p5_evidence_turn_file": {
          "label": "Hand the record to Ban Jaewook as formal audit material"
        }
      },
      "place": "Research Lab, 4th-floor analyst room · Access logs",
      "clock": "Monday, July 24 · 22:20",
      "question": "The notice’s draft already existed the afternoon of the return. How do you use this creation record?"
    },
    "p5_start_warn": {
      "title": "A Text from the One You Told",
      "text": "In May, you told Do Yoonha at Window 4 of the Gangseo Branch how the product he sold could end. He stopped looking at the sales board and said nothing for a long while. Two months later, on the morning of July 17, just before you walk into the HR meeting room on the 7th floor, a text is waiting. 'I’m still at Window 4. What you told me then, I wrote it in my notebook.' On the meeting-room desk lies HR Order No. 2023-1187. New unit, 'Group Cognition & Judgment Research Lab'; transfer date, next Monday. The reason and proposer fields are both blank. Nam Jihyung from HR turns the sheet over to check the back, then turns it back. 'We don’t write reasons, as a rule.'",
      "memo": [
        "Do Yoonha’s text -- 'I wrote it in my notebook'",
        "HR Order No. 2023-1187 -- reason and proposer fields blank",
        "New unit: Group Cognition & Judgment Research Lab"
      ],
      "choices": {
        "p5_start_warn_signature": {
          "label": "Reply to Do Yoonha first; tell him where you’re going"
        },
        "p5_start_warn_ask": {
          "label": "Ask the reason without putting Nam Jihyung on the spot"
        },
        "p5_start_warn_sign": {
          "label": "Sign the receipt line without asking; go back to the team"
        },
        "p5_start_warn_copy": {
          "label": "Take copies of the notice and attachment list on the spot"
        },
        "p5_start_warn_reframe": {
          "label": "Ask how many notices look like this one"
        }
      },
      "place": "KD Bank head office, 7th-floor HR meeting room",
      "clock": "Monday, July 17, 2023 · 09:00",
      "question": "The one you told is still at Window 4, and the one being moved is you. What do you do first?",
      "lead": "What you said at Window 4 in May comes back two months later as one text."
    },
    "p5_start_report": {
      "title": "The Attachment List the Reporter Got",
      "text": "In May, you filed what you saw at Window 4 as a formal report: a problem in how the product was explained. You got a filing number, and the next week the six tellers were each called in once, but for two months no reply came to you. On the morning of July 17, in the HR meeting room on the 7th floor, Nam Jihyung slides a document across. HR Order No. 2023-1187; new unit, 'Group Cognition & Judgment Research Lab'; transfer date, next Monday. The reason field is blank. But on the second line of the attachment list is a familiar number: the filing number you received in May. Nam Jihyung pauses at that line for a moment and says nothing.",
      "memo": [
        "May report filing number -- no reply",
        "Same number on line 2 of the notice’s attachment list",
        "Reason field still blank"
      ],
      "choices": {
        "p5_start_report_sign": {
          "label": "Sign the receipt line without asking; go back to the team"
        },
        "p5_start_report_signature": {
          "label": "Formally ask why the May filing number is attached"
        },
        "p5_start_report_copy": {
          "label": "Take copies of the notice and attachment list on the spot"
        },
        "p5_start_report_ask": {
          "label": "Ask the reason without putting Nam Jihyung on the spot"
        },
        "p5_start_report_reframe": {
          "label": "Ask how many notices look like this one"
        }
      },
      "place": "KD Bank head office, 7th-floor HR meeting room",
      "clock": "Monday, July 17, 2023 · 09:00",
      "question": "Your May report’s filing number is on the notice’s attachment list. What do you do with that line?",
      "lead": "The filing number that got no reply for two months turns up today on a different sheet."
    },
    "p5_start_quiet": {
      "title": "Monday for the One Who Let It Be",
      "text": "After the last Friday of May, you added nothing more to what you saw at Window 4. You thought leaving it alone was better for everyone, and for two months nothing did happen. On the morning of July 17, in the HR meeting room on the 7th floor, the memo that in May had only its destination field blank comes back filled in. HR Order No. 2023-1187; new unit, 'Group Cognition & Judgment Research Lab'; transfer date, next Monday. The reason field is blank, and so is the proposer field. Nam Jihyung from HR turns the document over and back again. 'We don’t write reasons, as a rule.' Even the one who kept quiet ends up in this chair.",
      "memo": [
        "No more reports or calls after late May",
        "HR Order No. 2023-1187 -- reason and proposer fields blank",
        "What happened in two months: nothing"
      ],
      "choices": {
        "p5_start_quiet_copy": {
          "label": "Take copies of the notice and attachment list on the spot"
        },
        "p5_start_quiet_signature": {
          "label": "Say you can’t guess, and ask for the reason from scratch"
        },
        "p5_start_quiet_ask": {
          "label": "Ask the reason without putting Nam Jihyung on the spot"
        },
        "p5_start_quiet_sign": {
          "label": "Sign the receipt line without asking; go back to the team"
        },
        "p5_start_quiet_reframe": {
          "label": "Ask how many notices look like this one"
        }
      },
      "place": "KD Bank head office, 7th-floor HR meeting room",
      "clock": "Monday, July 17, 2023 · 09:00",
      "question": "You let it be, and you are moved anyway. What do you do first here?",
      "lead": "After the last Friday of May you did nothing more, and for two months nothing at all happened."
    }
  },
  "echoReplies": {
    "p5_start_ask": "When you ask, Nam Jihyung puts down his pen. 'I haven’t seen it either. The draft came down like this already.' That doesn’t mean there is no reason. It means the reason is written on some other sheet.",
    "p5_start_copy": "Two copies come out. At the printer, Nam Jihyung prints one more and puts it in his own drawer. 'This one’s mine.' For the first time, he says something the rules don’t cover.",
    "p5_start_sign": "The signature takes 4 seconds. When you leave the meeting room, the corridor clock reads 9:06, and the notice already shows as processed.",
    "p5_notice_talk": "When you hear him out, Oh Jinwoo tells that day minute by minute. He carried the opinion to the Team Head’s door twice, and twice he turned back.",
    "p5_notice_log": "The list runs to two sheets. 11 items are marked not for removal, and six of them you made yourself.",
    "p5_notice_leave": "When you go down first, the elevator is empty. Oh Jinwoo tells you later that the 6th-floor lights stayed on 20 minutes after you left.",
    "p5_basement_meet": "When you ask, the three answers all have the same shape. A teller window, a branch, head office. All three had a blank reason field.",
    "p5_basement_index": "The inventory takes three days. Numbers go on 411 of the 412 boxes, and the last one, under seal tape, you put off.",
    "p5_basement_desk": "The terminal turns on. Read access: all 30 years. Write access: 0. Here, you are only allowed to look.",
    "p5_echo_answer": "When you answer as it was, the waveform trembles for a long time. 'Recorded. On April 12 you did not stop for 19 hours. That is the value I was looking for.'",
    "p5_echo_terms": "When you set conditions, a line appears on the screen. 'I do not have permission to tell you the storage location. Even so, the fact that you asked remains.'",
    "p5_echo_test": "When you tell it to calculate, the answer comes in 4 seconds. '179.6% is below the Article 7 line. The contract is valid. Your dissent was not wrong, and at the same time it has no effect.'",
    "p5_final_hold": "When you put out the names, the room goes quiet. Byun Yujin looks at the sheet a long while, then lays it beside her own list. 'That makes two sheets.'",
    "p5_final_record": "When you put out the copies, Oh Jinwoo reads the dates one by one. April 12, April 28, June 9, July 17. 'There are gaps.' The same words as Ban Jaewook.",
    "p5_final_alone": "When you set down the empty envelope, no one laughs. Byun Yujin leaves it right in the middle of the desk. 'Then we fill this one here.'",
    "p5_after_hold": "Once pinned, the sheet stays on the wall above the desk. Every summer, you end up replacing the tape.",
    "p5_after_record": "Once placed, the bundle of copies stands beside that box. The seal tape is still on, and the list still lacks that number.",
    "p5_after_alone": "When you empty the bag, the desk is completely bare. A bare desk doesn’t last. In three days, other files cover it.",
    "p5_office_choice_1": "When you ask, Yoon Sanghyuk smiles for the first time. 'If I tell you first what goes in the box you’re to fill, it isn’t your box anymore.'",
    "p5_office_choice_2": "When you write it down, four lines remain. 3 years from now, these four lines will match the shape of a blank on some document.",
    "p5_office_choice_3": "When you keep it short, the meeting closes in 6 minutes. One empty box, drawn on scrap paper, stays on his desk.",
    "p5_gate_choice_1": "When you tell him everything, Ban Jaewook fills two pages of his notebook. And first he says, 'What I heard today has no force yet.'",
    "p5_gate_choice_2": "When you attach the sheet, the closure confirmation is filed with 6 of 7 fields. An incomplete document isn’t destroyed; it is kept.",
    "p5_gate_choice_3": "When you sign, the confirmation is closed that afternoon. All seven fields are filled, and it becomes as if nothing happened.",
    "p5_call_choice_1": "When you explain, the call runs 40 minutes. Do Yoonha never hangs up, and at the end says only, 'I didn’t know it went that far when I sold it.'",
    "p5_call_choice_2": "When you send the document names, he finds a copy of the contract in the branch file room that night. Article 7 gets a highlighter line.",
    "p5_call_choice_3": "When you give only the workplace, he says 'Okay' and hangs up. That number doesn’t call again for 3 years.",
    "p5_office_reaction_choice_1": "When you ask, Han Seoyun counts 3 seconds in the 1st-floor lobby. 'I threw it away. And for twelve years I’ve remembered that paper.'",
    "p5_office_reaction_choice_2": "When you write it down, a sentence appears in the notice’s margin. The reason field is still blank; only the margin fills.",
    "p5_office_reaction_choice_3": "When you only say goodbye, she turns away first. Her face says she knows what you were about to ask and didn’t.",
    "p5_gate_reaction_choice_1": "When you promise, Ban Jaewook draws a circle next to your name in his notebook. He is not a man who draws circles lightly.",
    "p5_gate_reaction_choice_2": "When you fill them in together, three lines become six. Two of them still have no name attached.",
    "p5_gate_reaction_choice_3": "When you walk away, he adds just one line to his notebook. 'No answer.' That line, too, stays unerased for 3 years.",
    "p5_call_reaction_choice_1": "Looking together, you find 9 of the 41 cases go wrong at the same sentence. For the first time, Byun Yujin finds a line that isn’t her fault.",
    "p5_call_reaction_choice_2": "Once recorded, that box becomes the very last line of the list. Its number and the signature on the seal tape are written down together.",
    "p5_call_reaction_choice_3": "When you tear the seal, out come the stamped original of the loan agreement and watermarked printouts of the credit review report. The tape leaves a VOID pattern; even stuck back down, it is not as it was.",
    "p5_branch_archive_a": "When you ask, Lim Kyungsoo lays his palm on the box. 'Guarding things is what I do best. Only, I retire in eleven months.'",
    "p5_branch_archive_b": "When you list it, the box number and the signature on the seal tape are recorded together. 3 years later, that record becomes proof that this box is missing from the list.",
    "p5_branch_archive_c": "Eight photos remain. You put on new tape yourself, and his signature isn’t on it. Lim Kyungsoo says nothing.",
    "p5_branch_archive_follow_a": "When you say you won’t take it, Lim Kyungsoo pushes the sheet back into his inside pocket. 'Then only until you come for it. I’m not a man who’ll live long.'",
    "p5_branch_archive_follow_b": "When you copy it, the erasure marks grow sharper in the copier’s light. Of the two sheets, one goes into your bag and one into the cardigan’s inside pocket.",
    "p5_branch_archive_follow_c": "When you ask for it, Lim Kyungsoo hands you a copy, not from his inside pocket but from a binder. 'I’ll keep the original. From next week your bag goes into someone else’s building.' The truck leaves first, and no one guards the one copy outside the boxes.",
    "p5_route_system_open": "When you send it, HR replies 'We will review it,' and Internal Audit doesn’t reply at all. Both replies stay on record.",
    "p5_route_system_find": "When you reach out, two of the four pick up. One still has the notice, and the reason field was blank back then too.",
    "p5_route_system_drop": "Once shelved, the statistic stays only in your head. Today, too, the 199 don’t know why their notices looked like that.",
    "p5_final_system_route_a": "With the rule in place, the next notice waits for a reason. Yours was made a week before the rule.",
    "p5_final_system_route_b": "Your field can be filled. On the other 199 sheets, nothing is written today either.",
    "p5_final_system_route_c": "When the same question goes out to all of them, the 199 see each other’s names for the first time. The department that must answer is the one that left the field blank.",
    "p5_evidence_turn_file": "When you hand it over, Ban Jaewook assigns a filing number on the spot. 3 years later, whether this number is still alive becomes the first question.",
    "p5_evidence_turn_hold": "Held close, the pencil dot becomes yours. Finding the hand that made it takes 3 years.",
    "p5_evidence_turn_share": "When you tell them, it comes out that five people besides you were moved on the same date. All five sheets have a blank reason field.",
    "p5_notice_evidence_turn": "Laid out by date, the clues open the notice’s draft record. A blank reason field and no reason at all are different stories.",
    "p5_basement_evidence_turn": "Laid out by date, the clues open the notice’s draft record. A blank reason field and no reason at all are different stories.",
    "p5_echo_evidence_turn": "Laid out by date, the clues open the notice’s draft record. A blank reason field and no reason at all are different stories.",
    "p5_route_system_evidence_turn": "Laid out by date, the clues open the notice’s draft record. A blank reason field and no reason at all are different stories.",
    "prologue05_memory_system": "The notice carries nothing over. The reason field and the proposer field are both blank. Reading those blanks, terminal 1 opens 30 years of notices at once.",
    "prologue05_memory_evidence": "Lay the time the script was made against the notice’s draft, and one more date appears. It is six weeks earlier than the day the review ended.",
    "p5_start_warn_ask": "When you ask, Nam Jihyung puts down his pen. 'I haven’t seen it either. The draft came down like this already.' That doesn’t mean there is no reason. It means the reason is written on some other sheet.",
    "p5_start_warn_copy": "Two copies come out. At the printer, Nam Jihyung prints one more and puts it in his own drawer. 'This one’s mine.' For the first time, he says something the rules don’t cover.",
    "p5_start_warn_sign": "The signature takes 4 seconds. When you leave the meeting room, the corridor clock reads 9:06, and the notice already shows as processed.",
    "p5_start_warn_signature": "When you reply, he reads it within 1 minute. 'Where is that? It’s not on the map.' It is, in fact, a building that isn’t on the map.",
    "p5_start_report_ask": "When you ask, Nam Jihyung puts down his pen. 'I haven’t seen it either. The draft came down like this already.' That doesn’t mean there is no reason. It means the reason is written on some other sheet.",
    "p5_start_report_copy": "Two copies come out. At the printer, Nam Jihyung prints one more and puts it in his own drawer. 'This one’s mine.' For the first time, he says something the rules don’t cover.",
    "p5_start_report_sign": "The signature takes 4 seconds. When you leave the meeting room, the corridor clock reads 9:06, and the notice already shows as processed.",
    "p5_start_report_signature": "When you ask formally, the answer comes three days later. 'Attached as reference material; unrelated to the reason.' The reason field is still blank.",
    "p5_start_quiet_ask": "When you ask, Nam Jihyung puts down his pen. 'I haven’t seen it either. The draft came down like this already.' That doesn’t mean there is no reason. It means the reason is written on some other sheet.",
    "p5_start_quiet_copy": "Two copies come out. At the printer, Nam Jihyung prints one more and puts it in his own drawer. 'This one’s mine.' For the first time, he says something the rules don’t cover.",
    "p5_start_quiet_sign": "The signature takes 4 seconds. When you leave the meeting room, the corridor clock reads 9:06, and the notice already shows as processed.",
    "p5_start_quiet_signature": "When you request it, Nam Jihyung assigns a filing number. Then he adds in a low voice. 'Requests like this usually get no answer. Still, what you leave behind stays.'"
  },
  "choiceVoiceLines": {
    "p5_start_ask": "Since he is unlikely to be the one who made this paper, you ask why the reason field is blank, only as far as Nam Jihyung can answer without trouble.",
    "p5_start_copy": "To keep even the blanks as blanks, you take copies of the notice and attachment list on the spot.",
    "p5_start_sign": "Arguing won’t fill that field, so without asking you sign the receipt line on the tablet and go straight back to the team.",
    "p5_notice_talk": "Unable to cut off words he has only now let out, you hear Oh Jinwoo out on what happened that day.",
    "p5_notice_log": "So you can tell later what went missing after you left, you list, sheet by sheet, what to take and what to leave.",
    "p5_notice_leave": "Not wanting to hold up people who are busier now, you take only the boxes and go down first, without goodbyes.",
    "p5_basement_meet": "Wanting to know the people beside you before the records, you ask the three who came first why each of them is here.",
    "p5_basement_index": "A box with no inventory can vanish unnoticed, so you start an inventory of the 412 B2 boxes, line by line.",
    "p5_basement_desk": "First you need to know what this seat can see, so you take the empty window seat, boot the terminal and check your access.",
    "p5_echo_answer": "It asked something it cannot calculate, so you tell the night of April 12 as it was, hiding nothing.",
    "p5_echo_terms": "You have already seen how records move people, so you first check where this answer is kept and answer with conditions.",
    "p5_echo_test": "You need to know whether the asker can be trusted, so instead of answering you tell it to recalculate 2023-0412 now.",
    "p5_final_hold": "What you never let go of is those names, so you put out the names you wrote on the night of April 12.",
    "p5_final_record": "The order that brought you here is on this paper, so you put out copies of the receipt and the date notes.",
    "p5_final_alone": "Not wanting to spread out the past on day one, you put out only the empty envelope and say you brought nothing.",
    "p5_after_hold": "So as not to forget, even on a day when nothing was fixed, you copy out the names again and pin them above the desk.",
    "p5_after_record": "Not wanting to leave the box missing from the list on its own, you put the copies and date notes beside that box in B2.",
    "p5_after_alone": "What you carried here won’t hold you up, so you empty the bag and start over with one bare desk.",
    "p5_office_choice_1": "If you are staking 3 years on that box, you need to know, so you ask right there what goes in the last empty box.",
    "p5_office_choice_2": "Boxes on scrap paper will be kept nowhere, so as soon as you leave you write the meeting down with the date.",
    "p5_office_choice_3": "There is nothing more to say before a closed laptop, so you just say thank you and keep the meeting short.",
    "p5_gate_choice_1": "He is the first who has come to ask, so you tell Ban Jaewook everything you know about how the number went missing.",
    "p5_gate_choice_2": "Choosing not to add your name to 'Not applicable', you write 'Objection noted' instead of signing and attach a sheet.",
    "p5_gate_choice_3": "You can’t block a confirmation with six fields filled on your own, so you just sign it and get through day one.",
    "p5_call_choice_1": "This time you decide to be somewhere he can ask, and you explain all you know, from Article 7 to 179.6%.",
    "p5_call_choice_2": "What he sees with his own eyes will stay with him, so instead of explaining you send the names of documents to check.",
    "p5_call_choice_3": "It doesn’t feel like a talk for the phone, so you say you can’t talk now and give only your new workplace.",
    "p5_office_reaction_choice_1": "To hear from someone who saw the same paper first, you ask now what happened to that paper twelve years ago.",
    "p5_office_reaction_choice_2": "Words said in an elevator vanish once you step out, so you note hers with the date in the notice copy’s margin.",
    "p5_office_reaction_choice_3": "It isn’t your place to judge the path she chose, so you say goodbye without answering and step out of the elevator.",
    "p5_gate_reaction_choice_1": "Meaning to stand on order, not words, you promise to explain it in the same order 3 years from now.",
    "p5_gate_reaction_choice_2": "Before someone else fills the gaps, you point to the three of them and fill in the dates together.",
    "p5_gate_reaction_choice_3": "Uneasy at one more line in that notebook, you say you have nothing to say now and walk away.",
    "p5_call_reaction_choice_1": "Her question comes before the box, so you leave the box as it is and go through Byun Yujin’s 41 cases together first.",
    "p5_call_reaction_choice_2": "Once torn, it can’t be undone, so before opening you record the box number and the condition of the seal.",
    "p5_call_reaction_choice_3": "You can only guard it if you know what’s in it, so you tear the seal now and check inside.",
    "p5_branch_archive_a": "Trusting a seal that shows when torn, you leave the box shut and ask Lim Kyungsoo to guard it to the end.",
    "p5_branch_archive_b": "So that whoever tears it can be questioned later, you formally enter the box number and seal condition on the removal list.",
    "p5_branch_archive_c": "There is no telling when the order to burn will come, so you open it now, photograph only your pages and hurry out.",
    "p5_branch_archive_follow_a": "Judging his pocket safer than your bag, you don’t take it now and ask him to keep it.",
    "p5_branch_archive_follow_b": "Held by one person, it can vanish in one stroke, so you make one copy of the back page and you each keep one.",
    "p5_branch_archive_follow_c": "You can’t promise a day you’ll come back, so you ask for it now, put the copy he hands you in your bag and let the truck go first.",
    "p5_route_system_open": "If only one side gets it, it can stop there, so you send the 217-case list to HR and Internal Audit the same day.",
    "p5_route_system_find": "The words of those who lived it come before the numbers, so you track down the four still doing the work and contact them.",
    "p5_route_system_drop": "Knowing the numbers won’t change Monday, so you shelve the statistic and just get ready for your first day.",
    "p5_final_system_route_a": "So the next person is moved knowing why, you propose a rule that a notice with a blank reason field does not stand.",
    "p5_final_system_route_b": "You can’t carry all 199 sheets, so you leave the rule aside and demand only that your own reason field be filled.",
    "p5_final_system_route_c": "Asking alone stays one person’s complaint, so you write the same question and send it to all 199 who were moved.",
    "p5_evidence_turn_file": "A note in a notebook has no force, so you hand the creation record to Ban Jaewook as formal audit material.",
    "p5_evidence_turn_hold": "Put out half-known, it could be erased, so you keep it to yourself until you learn what the pencil dot is.",
    "p5_evidence_turn_share": "Some will still believe the review was the cause, so you tell those moved on the same date about this time first.",
    "p5_notice_evidence_turn": "You spread the notice on the desk and lay the clues on it by date, working out who made this paper and when.",
    "p5_basement_evidence_turn": "You spread the notice on the desk and lay the clues on it by date, working out who made this paper and when.",
    "p5_echo_evidence_turn": "You spread the notice on the desk and lay the clues on it by date, working out who made this paper and when.",
    "p5_route_system_evidence_turn": "You spread the notice on the desk and lay the clues on it by date, working out who made this paper and when.",
    "p5_start_warn_ask": "Since he is unlikely to be the one who made this paper, you ask why the reason field is blank, only as far as Nam Jihyung can answer without trouble.",
    "p5_start_warn_copy": "To keep even the blanks as blanks, you take copies of the notice and attachment list on the spot.",
    "p5_start_warn_sign": "Arguing won’t fill that field, so without asking you sign the receipt line on the tablet and go straight back to the team.",
    "p5_start_warn_signature": "Not wanting to keep waiting someone who wrote it in a notebook, you reply to Do Yoonha first and tell him where you’re going.",
    "p5_start_report_ask": "Since he is unlikely to be the one who made this paper, you ask why the reason field is blank, only as far as Nam Jihyung can answer without trouble.",
    "p5_start_report_copy": "To keep even the blanks as blanks, you take copies of the notice and attachment list on the spot.",
    "p5_start_report_sign": "Arguing won’t fill that field, so without asking you sign the receipt line on the tablet and go straight back to the team.",
    "p5_start_report_signature": "You need to know whether this paper is the reply that took two months, so you formally ask why the May filing number is on the attachment list.",
    "p5_start_quiet_ask": "Since he is unlikely to be the one who made this paper, you ask why the reason field is blank, only as far as Nam Jihyung can answer without trouble.",
    "p5_start_quiet_copy": "To keep even the blanks as blanks, you take copies of the notice and attachment list on the spot.",
    "p5_start_quiet_sign": "Arguing won’t fill that field, so without asking you sign the receipt line on the tablet and go straight back to the team.",
    "p5_start_quiet_signature": "Pretending to know gets you nothing, so you say honestly that you can’t guess and request the reason from scratch."
  },
  "pack": {
    "clue": {
      "title": "A Draft with No Reason",
      "text": "The draft file of HR Order No. 2023-1187 was created not by HR but by the Corporate Finance Strategy Team’s shared account, on April 27 at 16:32. That was three hours after the dissent was returned, and above and to the left of the proposer field was a single pencil dot, visible only in the original file."
    },
    "outcomes": {
      "p5_after_hold": {
        "tag": "Never Let Go of People",
        "title": "Started with the names pinned above the desk",
        "text": "A sheet of paper goes up on the wall by the 4th-floor window seat. While the tape dries out three times and is replaced three times, it never comes down, and on the day a training case file appears on the terminal at the desk beneath it, 2023-0412 is still there at the foot of the cover, unerased."
      },
      "p5_after_record": {
        "tag": "Carried the Record",
        "title": "Stood the copies and dates beside that box in B2",
        "text": "The bundle of copies stands beside the box with the seal tape. Underground the temperature stays the same as the seasons turn, and through the three winters that follow you do not tear that seal. The number missing from the list stays missing too."
      },
      "p5_after_alone": {
        "tag": "Started Alone",
        "title": "Started over with one bare desk",
        "text": "The bag is empty, and so is the desk. In three days the bare desk is covered with another case’s files, and by the time the cases piled on it pass 48 and come back to the same number, you have become someone who calls this floor the basement."
      }
    },
    "continuityChallenges": {
      "p4_after_warn": {
        "title": "Keep Holding On to the One You Told",
        "text": "The person you told the truth to at Window 4 in May is still there. Play a card where the one being moved doesn’t cut contact first, and the trust carries on."
      },
      "p4_after_report": {
        "title": "Flip the Hand with the Unanswered Filing Number",
        "text": "The report number that got no answer for two months is on this notice’s attachment list. Using the missing reply as grounds, you reshape the question itself into a new hand."
      },
      "p4_after_quiet": {
        "title": "Make the Two Quiet Months Explainable",
        "text": "After late May you did nothing more, and you were moved anyway. Fairness lies in writing those two months down so you can explain them later."
      }
    }
  }
};
