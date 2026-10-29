/**
 * 사건 10 (src/nodes/case10.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c10_start": {
      "title": "Ten Days",
      "text": "Ten days have passed since the FlowOn resolution. Yesterday morning, Do Yoonha was rushed to the emergency room at Gangseo Ieum Hospital. The diagnosis is overwork and exhaustion, plus the sleeping pills he has been prescribed for 3 years. The group has filed it as a personal matter. At the ward door, Han Seoyun cannot bring herself to hand over the papers; she keeps them in her hand as she speaks. 'There’s a file from his locker. It was never registered as an official document, so its retention period is 0. It will be purged automatically in four days.'",
      "memo": [
        "Do Yoonha: overwork, exhaustion, 3 years of sleeping-pill prescriptions",
        "Group classification: personal matter, not work-related",
        "Locker file is an unofficial record -- retention period 0 days",
        "96 hours to automatic purge"
      ],
      "choices": {
        "c10_start_cover": {
          "label": "Let Do Yoonha sleep and take over his work first"
        },
        "c10_start_file": {
          "label": "Register the locker file as official, outside the ward"
        },
        "c10_start_claim": {
          "label": "Fill out Do Yoonha’s workers’ comp claim at Ieum billing"
        },
        "reframe": {
          "label": "Ask how long others in the same job lasted"
        }
      },
      "place": "Gangseo Ieum Hospital · Ward",
      "clock": "Records purge in 96h",
      "question": "The week after the win, one person collapsed, and his list is erased in four days. What do you grab first?",
      "lead": "Ten days have passed since the FlowOn resolution. Han Seoyun stands at the ward door, the papers she brought still in her hand."
    },
    "c10_locker": {
      "title": "1,740 Names",
      "text": "The locker file covers 3 years. 1,740 people ruined by loans sold at the Gangseo Branch windows. Names, contact numbers, date of last call, and 'resolved' or 'unresolved'. Lee Minseo stops at the last page. Below the unresolved column is one more line, in Do Yoonha’s own hand. '2023-0412 dissent author -- sent down to the basement. Unresolved.' For 3 years, you were one of the victims he was counting.",
      "memo": [
        "1,740 people over 3 years -- 612 resolved, 1,128 unresolved",
        "47 small transfers in his monthly salary account records",
        "His own name appears nowhere on the list",
        "The unresolved item on the last line is you"
      ],
      "choices": {
        "c10_locker_open": {
          "label": "Enter all 1,740 into the victim register with Lee Minseo"
        },
        "c10_locker_money": {
          "label": "Trace the 47 transfers from his salary account one by one"
        },
        "c10_locker_close": {
          "label": "Leave the 1,128 unresolved in the locker; hand over the rest"
        },
        "reframe": {
          "label": "Ask how long others in the same job lasted"
        },
        "c10_locker_evidence_turn": {
          "label": "Find the day an option vanished from the sick-leave form"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · personnel register terminal",
      "clock": "Records purge in 88h",
      "question": "The unresolved item on the last line is you. How do you handle these 1,740 people?",
      "lead": "You load the locker file onto the terminal. All 3 years of it will not fit on one screen."
    },
    "c10_claim": {
      "title": "Is Burnout an Injury?",
      "text": "A meeting is called to decide whether this counts as an industrial accident. The locker file is bound to it as evidence, and the purge stops. There is one issue. To prove the exhaustion came from work, you must put on record how far Do Yoonha pushed himself outside the rules. That same record proves he broke company rules for 3 years. Ban Jaewook closes his notebook and, for the first time, looks at his own hands. 'For 20 years I’ve cut people from this seat. Today I don’t know whether this paper saves that man or cuts him.'",
      "memo": [
        "Proof of causation = proof of rule violations",
        "If approved: treatment costs and leave pay; if denied: advice to resign voluntarily",
        "Group legal fears a 1,740-person lawsuit if approved",
        "40 hours to the review vote"
      ],
      "choices": {
        "c10_claim_prove": {
          "label": "Put all 3 years of violations in front of Ban Jaewook"
        },
        "c10_claim_system": {
          "label": "Put the system’s flaw on the agenda instead of Do Yoonha"
        },
        "c10_claim_narrow": {
          "label": "Drop the violations; submit only the clock-in times"
        },
        "reframe": {
          "label": "Ask how long others in the same job lasted"
        },
        "c10_claim_evidence_turn": {
          "label": "Find the day an option vanished from the sick-leave form"
        }
      },
      "place": "Trigger Lab, 2nd-floor HR committee room",
      "clock": "Injury review in 40h",
      "question": "Proof that he pushed too hard is also proof that he broke the rules. What do you submit?",
      "lead": "Ban Jaewook sits across the meeting room. His open notebook has not a single line written in it today."
    },
    "c10_relay": {
      "title": "How to Share the Load",
      "text": "The 2nd floor of the secondhand bookshop in Hoegi-dong. Lim Kyungsoo clears away ledgers to make room, and Na Junhyuk, up from Gangwon on a dawn bus, makes six cups of instant coffee. Lee Minseo, Kang Taemin and even Oh Jinwoo have come. You draw up a sheet that splits the 1,128 among six people instead of one. Passing around paper cups, Na Junhyuk says, 'I’ve learned one thing in 30 years. Good work done alone always ends. Because the person ends.' Oh Jinwoo quietly raises his hand last. 'Give me a column too. The hardest one.'",
      "memo": [
        "A sheet splitting 1,128 people among six",
        "Na Junhyuk 200 · Lim Kyungsoo 180 · Lee Minseo 240 · Kang Taemin 120 · Oh Jinwoo 288 · you 100",
        "The sheet lasts only if it becomes assigned duty, not goodwill",
        "Four of the six get nothing for this work"
      ],
      "choices": {
        "c10_relay_pay": {
          "label": "Win pay for the four unpaid names on the bookshop sheet"
        },
        "c10_relay_assign": {
          "label": "Write the six names into the rules as official staff"
        },
        "c10_relay_keep": {
          "label": "Keep the sheet as it is, on Na Junhyuk’s coffee promise"
        },
        "reframe": {
          "label": "Ask how long others in the same job lasted"
        },
        "c10_relay_evidence_turn": {
          "label": "Find the day an option vanished from the sick-leave form"
        }
      },
      "place": "Hoegi-dong bookshop, 2nd floor · stacks of ledgers",
      "clock": "Duty roster locks in 20h",
      "question": "You have a sheet that splits 1,128 people among six. What do you make it into?",
      "lead": "Lim Kyungsoo has cleared away the ledgers to make room, and Na Junhyuk has come up from Gangwon on a dawn bus."
    },
    "c10_final": {
      "title": "How to Stop",
      "text": "The doctor ordered 4 weeks of rest; Do Yoonha comes back after 2. Meanwhile the list has become an official group agenda item, and 212 people dropped out while it was fitted to the agenda form. People with no paperwork left, people whose loans were in a family member’s name, people past the statute of limitations. The rules have no box for them. Do Yoonha sits at his desk, takes out a new notebook and writes 212 on the first page. Then he looks at you. 'I know. I’ll collapse again at this rate. But if I don’t write these 212 down, they exist nowhere. Will you stop me, or write with me?'",
      "memo": [
        "916 on the agenda, 212 pushed outside the rules",
        "The 212 exist in no official register",
        "Do Yoonha’s doctor: high chance of relapse within 3 months",
        "Number on the new notebook’s first page: 212"
      ],
      "choices": {
        "c10_final_rule": {
          "label": "Demand a new box in the agenda form for the 212"
        },
        "c10_final_stop": {
          "label": "Make him close the notebook; leave the 212 to rule reform"
        },
        "c10_final_join": {
          "label": "Take half of Do Yoonha’s notebook under your own name"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Do Yoonha’s first day back",
      "question": "212 people dropped out on the way to the agenda, and he has written 212 in a new notebook. Do you stop him?",
      "lead": "Do Yoonha is back after 2 weeks. His desk is still bare except for one new notebook."
    },
    "c10_aftershock": {
      "title": "Six Columns",
      "text": "On the first weekend after the roster goes up, splitting the unresolved list among six people, the Trigger Lab 4th floor is quiet. The 212 with no paperwork made it into none of its columns. Back from the hospital, Do Yoonha writes 'resolved' next to a name for the first time today, puts down his pen and looks at that line for a long while. 'I wrote these alone for 3 years. This week, six of us wrote them.' It is still light outside. Neither of you can remember the last time you left on time.",
      "memo": [
        "34 cases closed in week 1 -- six times his 3-year solo average",
        "The list of 212 is still in no system",
        "Group Strategy Office requests a copy of the roster",
        "The 33rd floor of group headquarters summons you"
      ],
      "choices": {
        "c10_after_keep": {
          "label": "Keep only the list of 212 back, in your own drawer"
        },
        "c10_after_rest": {
          "label": "Turn off the lights on time and send everyone home"
        },
        "c10_after_record": {
          "label": "Submit the roster as an official group policy proposal"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Roster week 1 · Friday 18:00",
      "question": "This week, for the first time, six people shared the list. How do you close out this weekend?"
    },
    "c10_ward": {
      "title": "10 Minutes Awake",
      "text": "Do Yoonha wakes for about 10 minutes. He does not ask about his own condition. 'The file on the 1,128. Is it getting purged?' Then, for the first time, he gives his reason. 'I was No. 1 in sales at Gangseo Branch twice. Got the award, had my picture taken. Every bit of those numbers is that list. I sold them. I should be the one counting.' He finishes and falls asleep again.",
      "memo": [
        "4,180 hours of overtime over 3 years",
        "2,940 of them on the list",
        "No. 1 sales award, 2 times -- 2023 and 2024",
        "Medical opinion: at least 4 weeks of complete rest"
      ],
      "choices": {
        "c10_ward_choice_3": {
          "label": "Tell him the list’s real state as it is"
        },
        "c10_ward_choice_2": {
          "label": "Tell him not to say anything right now"
        },
        "c10_ward_choice_1": {
          "label": "Reassure him first that you will stop the purge"
        }
      },
      "place": "Gangseo Ieum Hospital · Ward",
      "clock": "Records purge in 76h",
      "question": "In his 10 waking minutes, he asks about the list, not his body. What do you tell him?"
    },
    "c10_pills": {
      "title": "19 People",
      "text": "Han Seoyun opens the personnel records. In the last 3 years, nineteen people at Trigger Lab and Gangseo Branch took sick leave for the same reason. Every reason field says 'personal matter'. She scrolls one more line and stops. 1 of the 19 is Han Seoyun herself. 3 years ago, 2 weeks.",
      "memo": [
        "19 sick leaves for the same reason -- all recorded as personal matters",
        "11 of the 19 still work here",
        "Han Seoyun is one of them",
        "A group review makes the system’s flaw the issue"
      ],
      "choices": {
        "c10_pills_choice_2": {
          "label": "Leave out Han Seoyun’s record and go with eighteen"
        },
        "c10_pills_choice_1": {
          "label": "Bundle the 19 into one case and demand a group review"
        },
        "c10_pills_choice_3": {
          "label": "Say a single review is faster; finish Do Yoonha’s first"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · personnel register terminal",
      "clock": "Injury review in 34h",
      "question": "One of the 19 who took sick leave for the same reason is Han Seoyun. How do you build this case?"
    },
    "c10_ledger": {
      "title": "Six Profit-and-Loss Sheets",
      "text": "Oh Jinwoo has called in Kwon Dohyun. He looks at the roster and draws columns on a blank sheet. 'Fill in all six boxes. If the what-you-lose box is empty, this sheet falls apart within six months. I’ve watched a sheet built on goodwill fall apart in my own family.' Five boxes get filled. Kang Taemin, night-shift pay. Lee Minseo, the contract renewal review. Na Junhyuk, 2 years to retirement. Lim Kyungsoo, his quiet. Oh Jinwoo, his place in the promotion line. The sixth box is empty.",
      "memo": [
        "Four of the six gain nothing from this work",
        "Kwon Dohyun: only a sheet that lists losses lasts",
        "Your box is still blank",
        "If the sheet collapses, the 1,128 go back to one person"
      ],
      "choices": {
        "c10_ledger_choice_2": {
          "label": "Write that you have nothing to lose and pass it on"
        },
        "c10_ledger_choice_1": {
          "label": "Write promotion and reinstatement in your box as losses"
        },
        "c10_ledger_choice_3": {
          "label": "Open all six boxes and have everyone review each other"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 2nd Floor · Stair Landing",
      "clock": "Duty roster locks in 16h",
      "question": "Five boxes are filled; only yours is empty. What do you write there?"
    },
    "c10_ward_reaction": {
      "title": "What the Books Don’t Count",
      "text": "In the corridor outside the ward, ECHO brings up a calculation. Of Do Yoonha’s 4,180 overtime hours over 3 years, 2,940 went to the list. At his hourly rate, that is 43 million won. None of it was ever claimed. 'Goodwill does not show up in the accounts. A cost that does not show up does not shrink either. These 2,940 hours have never been recorded as an expense anywhere in this organization’s books.'",
      "memo": [
        "2,940 hours not in the books",
        "43 million won never claimed"
      ],
      "choices": {
        "c10_ward_reaction_choice_1": {
          "label": "File a formal claim for 43 million won in unpaid wages"
        },
        "c10_ward_reaction_choice_3": {
          "label": "Use the figure only as evidence for system reform"
        },
        "c10_ward_reaction_choice_2": {
          "label": "Leave it be; a number would spoil the goodwill"
        }
      },
      "place": "Gangseo Ieum Hospital, 3rd floor · Corridor",
      "clock": "Records purge in 74h",
      "question": "The 2,940 hours missing from the books come to 43 million won. Where do you use this number?"
    },
    "c10_pills_reaction": {
      "title": "2 Weeks, 3 Years Ago",
      "text": "Han Seoyun opens her own sick-leave record. Reason: personal matter. The actual date is two months after she pressed the return button on the FlowOn dissent, 3 years ago. 'I didn’t tell anyone back then. Saying it would mean I regret that return.' She goes to close the screen, then stops. 'But I bet 18 of the 19 kept quiet for the same reason.'",
      "memo": [
        "A reason never written in the reason field",
        "The 19th box, still empty"
      ],
      "choices": {
        "c10_pills_reaction_choice_3": {
          "label": "Get her consent and add hers as the 19th case"
        },
        "c10_pills_reaction_choice_1": {
          "label": "Have her rewrite those 2 weeks truthfully in the record"
        },
        "c10_pills_reaction_choice_2": {
          "label": "Leave the record alone unless she wants it changed"
        }
      },
      "place": "Trigger Lab, 4th floor · by the window",
      "clock": "Injury review in 32h",
      "question": "She says speaking up would mean regretting her signature. What do you do about those 2 weeks?"
    },
    "c10_ledger_reaction": {
      "title": "Oh Jinwoo’s Box",
      "text": "Oh Jinwoo’s box says 'place in the promotion line'. But tilt the paper and the original words show through under the erasure. 'Something to tell my father.' That is why he took 288 people. His father delayed an approval by one day and was pushed out of his branch; the son wants to prove 288 times that the day was right.",
      "memo": [
        "One line, erased and rewritten",
        "Where the number 288 comes from"
      ],
      "choices": {
        "c10_ledger_reaction_choice_3": {
          "label": "Suggest you go see his father together, just once"
        },
        "c10_ledger_reaction_choice_1": {
          "label": "Pretend not to see the rewritten line; pass the sheet on"
        },
        "c10_ledger_reaction_choice_2": {
          "label": "Say 288 is too many and re-split the columns"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 2nd Floor · Stair Landing",
      "clock": "Duty roster locks in 14h",
      "question": "The line Oh Jinwoo erased and rewrote said 'Something to tell my father.' What do you do?"
    },
    "c10_branch_home": {
      "title": "Window 4",
      "text": "Almost every receiving account of the 47 transfers was opened at Gangseo Branch. While pulling those records, Lee Minseo collects Do Yoonha’s things from his old locker. Inside are two No. 1 sales award certificates and one unopened envelope. On the front: the word 'Resignation' and a date from the summer 3 years ago. He wrote it and never handed it in. Across the counter, at Window 4, someone else now sits, selling a renamed product the same way.",
      "memo": [
        "Resignation letter written 3 years ago, never submitted",
        "Award certificates, 2 times -- sales figures for that product",
        "Window 4’s current teller is in year 1 on the job",
        "A renamed product is still sold the same way"
      ],
      "choices": {
        "c10_branch_home_a": {
          "label": "Return the letter; look into Window 4’s sales method"
        },
        "c10_branch_home_c": {
          "label": "Show the year-1 teller the product’s back page first"
        },
        "c10_branch_home_b": {
          "label": "Leave the envelope and quietly take only his things"
        }
      },
      "place": "KD Bank Gangseo Branch · Window 4",
      "clock": "Records purge in 84h",
      "question": "A resignation letter he wrote 3 years ago and never submitted has surfaced, and the renamed product still sells. What do you look at?"
    },
    "c10_branch_home_follow": {
      "title": "Other Handwriting",
      "text": "Checking the original list in the branch records room, Lee Minseo stops. Of the 1,740 lines, some 200 are not in Do Yoonha’s hand. There are three other scripts. Three Gangseo Branch employees have each added a few lines over 3 years. They never coordinated, and never told Do Yoonha. Lee Minseo smiles quietly. 'He wasn’t doing it alone. He just didn’t know.'",
      "memo": [
        "3 handwritings besides Do Yoonha’s -- about 200 lines",
        "All three still work at Gangseo Branch",
        "None of them ever told the others",
        "Do Yoonha himself does not know"
      ],
      "choices": {
        "c10_branch_home_follow_c": {
          "label": "Decide to tell Do Yoonha this first when he wakes"
        },
        "c10_branch_home_follow_b": {
          "label": "Merge their lines into the register without their names"
        },
        "c10_branch_home_follow_a": {
          "label": "Find the three and ask them to share the list"
        }
      },
      "place": "KD Bank Gangseo Branch · records room",
      "clock": "Records purge in 80h",
      "question": "200 lines of the list were not in his hand. What do you do about these three people?"
    },
    "c10_route_system": {
      "title": "Burnout Rate",
      "text": "You ask how long others in the same job lasted. ECHO starts calculating. A metric no one has ever tallied takes shape. Over the past 6 years, 34 employees tracked customer harm on their own. 29 of them quit or went on long-term sick leave within 3 years. The average run was 2 years and 7 months. 'In this organization, goodwill is used up in 31 months on average. No one has measured this number. Measure it and it becomes something to manage.'",
      "memo": [
        "29 of 34 voluntary harm trackers gone within 3 years",
        "Average run 31 months -- Do Yoonha is at month 36",
        "This metric has never appeared in any report"
      ],
      "choices": {
        "c10_route_system_publish": {
          "label": "Get the burnout rate registered as a group metric"
        },
        "c10_route_system_reach": {
          "label": "Call the 29 who left and hear them out first"
        },
        "c10_route_system_hide": {
          "label": "Shelve the metric; treat it as Do Yoonha’s case only"
        },
        "c10_route_system_evidence_turn": {
          "label": "Find the day an option vanished from the sick-leave form"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "Duty roster locks in 12h",
      "question": "In this organization, goodwill is used up in 31 months on average. What do you do with this metric?"
    },
    "c10_final_system_route": {
      "title": "Thirty-One Months",
      "text": "Eight hours before the roster that splits the 1,128 unresolved among six people is locked, the burnout table is up on the lab terminal. Of 34, 29 left within 3 years, and Do Yoonha is at month thirty-six. ECHO leaves one line. 'Put this number into the system and it becomes something to manage. Leave it out and the next person counts alone too.'",
      "memo": [
        "34 voluntary harm trackers -- 29 gone within 3 years",
        "Do Yoonha: month 36",
        "8 hours to roster lock"
      ],
      "choices": {
        "c10_final_system_route_b": {
          "label": "Bury the metric and push through only the roster"
        },
        "c10_final_system_route_c": {
          "label": "Write your name on line 35 of the burnout table now"
        },
        "c10_final_system_route_a": {
          "label": "Submit the burnout rate bundled with the list system"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "Duty roster locks in 8h",
      "question": "There is one more number no one ever measured. How do you put it into the proposal?"
    },
    "c10_evidence_turn": {
      "title": "The Default in the Reason Field",
      "text": "The clues line up, and the revision history of the HR forms opens. 4 years ago, the option 'work-related' was deleted from the reason field of the sick-leave form, and 'personal matter' became the default. The department that drafted the revision was the Corporate Finance Strategy Team. The 19 on sick leave wrote the same words not because of 19 choices, but because there was only one option.",
      "memo": [
        "Sick-leave form revised 4 years ago -- 'work-related' option deleted",
        "Revising department: KD Bank Corporate Finance Strategy Team",
        "Work-related illness approvals since the revision: 0"
      ],
      "choices": {
        "c10_evidence_turn_restore": {
          "label": "Demand the deleted 'work-related' option be restored"
        },
        "c10_evidence_turn_hold": {
          "label": "Keep the history to yourself; reveal it only at review"
        },
        "c10_evidence_turn_share": {
          "label": "Show the revision history to all 19 first"
        }
      },
      "place": "Trigger Lab, 2nd-floor HR committee room",
      "clock": "Injury review in 6h",
      "question": "The Corporate Finance Strategy Team removed the 'work-related' option from the sick-leave form. How do you use this history?"
    },
    "c10_start_stay": {
      "title": "Ten Days of the One Who Stayed",
      "text": "The job-retention deal took ten days. All that time, you never left the fulfillment center. The 1,140 kept their jobs, and in those ten days no one in Seoul looked at Do Yoonha’s work hours. Yesterday morning he was rushed to the emergency room. The winning side’s list was settled, and the condition of one of the winners went on no paper at all. Outside the ward, Han Seoyun says, 'There’s a file from his locker. It isn’t an official record, so it will be purged automatically in four days.'",
      "memo": [
        "Job-retention deal done, 1,140 kept",
        "Do Yoonha’s overtime in the same period: unrecorded",
        "96 hours until the locker file is purged automatically"
      ],
      "choices": {
        "c10_start_stay_cover": {
          "label": "Let Do Yoonha sleep and take over his work first"
        },
        "c10_start_stay_signature": {
          "label": "Apply the floor’s handover form to the list as it is"
        },
        "c10_start_stay_claim": {
          "label": "Fill out Do Yoonha’s workers’ comp claim at Ieum billing"
        },
        "c10_start_stay_file": {
          "label": "Register the locker file as official, outside the ward"
        },
        "c10_start_stay_reframe": {
          "label": "Ask how long others in the same job lasted"
        }
      },
      "place": "Gangseo Ieum Hospital · Ward",
      "clock": "Records purge in 96h",
      "question": "While you kept 1,140 people, no one looked at one person’s work hours. What do you grab first?",
      "lead": "You have come straight from getting the last signature on the job-retention deal. After ten days, you find Do Yoonha in a hospital bed."
    },
    "c10_start_court": {
      "title": "Ten Days of the One Who Testified",
      "text": "You spent ten days between the courtroom and the prosecutors’ team. Your statements were exact and the procedure was clean. You come back to find Do Yoonha was rushed to the emergency room yesterday morning, and his records were never submitted as evidence. Harm you can testify to sits beside harm that has no form to testify on. Outside the ward, Ban Jaewook says, 'A file turned up in his locker. It isn’t an official record, so it will be purged automatically in four days.'",
      "memo": [
        "3 witness examinations, statements on record",
        "Do Yoonha’s case classified as a personal matter, not work-related",
        "96 hours until the locker file is purged automatically"
      ],
      "choices": {
        "c10_start_court_claim": {
          "label": "Fill out Do Yoonha’s workers’ comp claim at Ieum billing"
        },
        "c10_start_court_file": {
          "label": "Register the locker file as official, outside the ward"
        },
        "c10_start_court_cover": {
          "label": "Let Do Yoonha sleep and take over his work first"
        },
        "c10_start_court_signature": {
          "label": "Sort Do Yoonha’s records the way you gave testimony"
        },
        "c10_start_court_reframe": {
          "label": "Ask how long others in the same job lasted"
        }
      },
      "place": "Gangseo Ieum Hospital · Ward",
      "clock": "Records purge in 96h",
      "question": "Harm you can testify to sits beside harm with no form to testify on. What do you grab first?",
      "lead": "It is the day you return from your third witness examination. In court, every harm had a form."
    },
    "c10_start_return": {
      "title": "Ten Days of the One Who Went Back Quietly",
      "text": "You finished your cup noodles and went back to Yeongdong Branch. You heard about the job-retention deal on the news, and on the morning of the tenth day the phone rings. Do Yoonha was rushed to the emergency room yesterday morning. News that travels 240km always arrives a beat late. This time the beat was the distance to the emergency room. Outside the ward, ECHO reports. 'The list file from his locker is not an official record. It will be purged automatically in four days.'",
      "memo": [
        "Day 9 back at Yeongdong Branch",
        "News of Do Yoonha’s emergency transfer reached you a day late",
        "96 hours until the locker file is purged automatically"
      ],
      "choices": {
        "c10_start_return_claim": {
          "label": "Fill out Do Yoonha’s workers’ comp claim at Ieum billing"
        },
        "c10_start_return_cover": {
          "label": "Let Do Yoonha sleep and take over his work first"
        },
        "c10_start_return_signature": {
          "label": "Go to the people first, as in the Yeongdong night room"
        },
        "c10_start_return_file": {
          "label": "Register the locker file as official, outside the ward"
        },
        "c10_start_return_reframe": {
          "label": "Ask how long others in the same job lasted"
        }
      },
      "place": "Gangseo Ieum Hospital · Ward",
      "clock": "Records purge in 96h",
      "question": "News from 240km away came a day late. What do you grab first now?",
      "lead": "On your 9th morning back at Yeongdong Branch, you got the call and took the first train up."
    }
  },
  "echoReplies": {
    "c10_start_file": "When the registration number prints, Han Seoyun puts down the papers in her hand for the first time. The file will outlast the four days, but now the organization knows what is in it and sets its policy accordingly.",
    "c10_start_claim": "When the filing number appears, the treatment-cost clock starts running. The review asks how hard he pushed himself, and the answer also makes him a rule-breaker.",
    "c10_start_cover": "With his work handed over, nothing falls apart today. The first thing he will look for when he wakes is the list, and then what you did will come out too.",
    "c10_locker_open": "As the last name goes in, Lee Minseo writes 'official' on the file cover. The 1,740 are now a number the organization counts, and people who are a number can also become plaintiffs.",
    "c10_locker_money": "As you trace the transfers, names from the list turn up one by one as recipients. It proves how he did this work, but the same records could paint him as an employee who cannot manage his own money.",
    "c10_locker_close": "With only the resolved cases handed over, the handover ends today. The 1,128 left in the locker are nowhere until someone takes them out again.",
    "c10_claim_prove": "As you push the stack across, Ban Jaewook opens the notebook he had closed. The papers prove he got sick from work, and on the same day they prove 3 years of rule violations.",
    "c10_claim_narrow": "With only the timesheets submitted, the meeting does not call him a violator. But timesheets alone do not show the illness came from work either.",
    "c10_claim_system": "When the agenda title changes, Ban Jaewook says 'Never seen this form before,' and picks up his pen. The next person will not face this review, but while it changes, Do Yoonha’s treatment costs come from nowhere.",
    "c10_relay_assign": "When you come back with a rule number, Na Junhyuk sets down his paper cup and claps once. The role survives when people change, but the moment it becomes a rule, it becomes work nobody volunteers for.",
    "c10_relay_pay": "When the budget passes, Lim Kyungsoo copies the figure onto the last page of his ledger. The six will not be used up for nothing, but while you fought for the budget, the roster handled nothing.",
    "c10_relay_keep": "As you fold the sheet and hand it over, Oh Jinwoo draws one more line through his column. The warmth of the moment stays, but when one of the six wears out, that column empties first.",
    "c10_final_stop": "As the notebook closes, Do Yoonha rests his palm on it for a long while. He will still be at his desk in three months, but until then the 212 are in no register.",
    "c10_final_join": "As you take out a second pen, Do Yoonha slides the notebook to the middle of the desk. He will not collapse alone now, but it may just mean two people wearing out at the same pace.",
    "c10_final_rule": "When the demand goes in, Do Yoonha writes 'under revision' beside the 212 on the first page. There is now a way into the system for the 212, but they stay outside until the revision passes.",
    "c10_after_rest": "When the lights go off, the 4th floor empties on time for the first time. What goes unhandled that evening rolls over to Monday.",
    "c10_after_record": "As a policy proposal, the roster survives a change of staff. The Group Strategy Office can cite it as its own achievement.",
    "c10_after_keep": "In your drawer, the 212 are not erased. A record with only one keeper disappears when that one keeper does.",
    "c10_ward_choice_1": "Reassured, he falls back asleep. You have not yet said how you will stop it.",
    "c10_ward_choice_2": "Cut short, the 10 minutes become real rest. No one knows when his next 10 waking minutes will come.",
    "c10_ward_choice_3": "Told the truth, he starts calculating. The first 10 minutes of 4 weeks of complete rest go into that calculation.",
    "c10_pills_choice_1": "When 19 cases become one, the issue is the system, not a person. That review will end later than Do Yoonha’s treatment costs are due.",
    "c10_pills_choice_2": "With one person out, the table looks clean. The one left out once again leaves her 2 weeks as a personal matter.",
    "c10_pills_choice_3": "With a single case, it ends this week. The reason fields of the other 18 still say personal matter.",
    "c10_ledger_choice_1": "With your box filled, the sheet becomes a contract among six. What you wrote, you will actually lose.",
    "c10_ledger_choice_2": "Writing that you have nothing to lose makes you the only one helping for free. Kwon Dohyun does not believe that box.",
    "c10_ledger_choice_3": "With all six boxes open, everyone knows who gives the most. Whether they stay once they know is another matter.",
    "c10_ward_reaction_choice_1": "With the claim filed, those hours show up in the accounts for the first time. The side that gets the bill classifies him as a problem employee.",
    "c10_ward_reaction_choice_2": "Left alone, goodwill stays goodwill. A cost the accounts do not record will not be billed for the next person either.",
    "c10_ward_reaction_choice_3": "Used only as evidence, the figure changes the system. No money comes back to Do Yoonha himself.",
    "c10_pills_reaction_choice_1": "Rewritten, all 19 cases share the same named reason. Han Seoyun has to write that she regrets her signature.",
    "c10_pills_reaction_choice_2": "Left alone, she can keep standing on the side that applies pressure. The 19th box stays empty for good.",
    "c10_pills_reaction_choice_3": "With her consent, the case set is complete. The conversation asking for it changes things between you two.",
    "c10_ledger_reaction_choice_1": "With you looking away, he counts all 288 to the end. No one asks what he is trying to prove.",
    "c10_ledger_reaction_choice_2": "Re-split, his share shrinks. He may read it as being pushed out once again.",
    "c10_ledger_reaction_choice_3": "If you go see him, that one day drops off the sheet. No one knows how the father will look at his son.",
    "c10_branch_home_a": "Seeing how it sells now shows this is not a story from 3 years ago. The more that shows, the more the case grows from Do Yoonha alone to the whole branch.",
    "c10_branch_home_b": "With the envelope left alone, his 3 years stay his own. You will never know why he did not hand it in.",
    "c10_branch_home_c": "Once told, the year-1 teller can choose. This time, that person pays the price of the choice.",
    "c10_branch_home_follow_a": "Sharing the list, the three now do openly what they did in secret. Names out in the open show up in personnel records too.",
    "c10_branch_home_follow_b": "With their names hidden, the three are safe. The register cannot say who held out with him for 3 years.",
    "c10_branch_home_follow_c": "Hearing it first, he learns he was never alone. But his waking time is short, and what to say first in those few minutes has to be decided then.",
    "c10_route_system_publish": "Once registered, the burnout rate is tallied every quarter. The group decides which department does the tallying.",
    "c10_route_system_hide": "As an individual case, the review looks at one person’s medical history. The 29 who left before remain, once again, their own personal matters.",
    "c10_route_system_reach": "When you call, the people who left say much the same thing. They didn’t quit; they just couldn’t go on. Writing it all down takes several nights.",
    "c10_final_system_route_a": "Bundled together, the system that guards the list gains a number that guards people. Whoever approves it will want that number cut first.",
    "c10_final_system_route_b": "The roster passes. No one measures how long the weight the six share takes to wear them down.",
    "c10_final_system_route_c": "With your name written in early, you are no longer the one counting but one of the counted. Do Yoonha looks at that line and says nothing for a long time.",
    "c10_evidence_turn_restore": "Once the demand is filed, Human Resources has to answer first why the option was removed. That question passes to the department that drafted the revision.",
    "c10_evidence_turn_hold": "Revealed at the review, it lands hardest. Until then, Do Yoonha’s claim sits in the 'personal matter' box.",
    "c10_evidence_turn_share": "Once told, the 19 take out their forms again. For the first time they see that the words they thought they chose were the only option.",
    "c10_locker_evidence_turn": "Stack the forms, and 'personal matter' is no longer each person’s choice but a default someone set in the form.",
    "c10_claim_evidence_turn": "Stack the forms, and 'personal matter' is no longer each person’s choice but a default someone set in the form.",
    "c10_relay_evidence_turn": "Stack the forms, and 'personal matter' is no longer each person’s choice but a default someone set in the form.",
    "c10_route_system_evidence_turn": "Stack the forms, and 'personal matter' is no longer each person’s choice but a default someone set in the form.",
    "case10_memory_system": "Sift through it and nothing has been copied into the personnel records. You learn only that one more thing goes unrecorded: the speed at which goodwill wears out.",
    "case10_memory_evidence": "Follow the revision history and you reach the date one option vanished from the reason field of the sick-leave form.",
    "c10_start_stay_file": "When the registration number prints, Han Seoyun puts down the papers in her hand for the first time. The file will outlast the four days, but now the organization knows what is in it and sets its policy accordingly.",
    "c10_start_stay_claim": "When the filing number appears, the treatment-cost clock starts running. The review asks how hard he pushed himself, and the answer also makes him a rule-breaker.",
    "c10_start_stay_cover": "With his work handed over, nothing falls apart today. The first thing he will look for when he wakes is the list, and then what you did will come out too.",
    "c10_start_stay_signature": "It is a form you already use, so it runs today. No one checked whether a factory-floor form fits a list of people.",
    "c10_start_court_file": "When the registration number prints, Han Seoyun puts down the papers in her hand for the first time. The file will outlast the four days, but now the organization knows what is in it and sets its policy accordingly.",
    "c10_start_court_claim": "When the filing number appears, the treatment-cost clock starts running. The review asks how hard he pushed himself, and the answer also makes him a rule-breaker.",
    "c10_start_court_cover": "With his work handed over, nothing falls apart today. The first thing he will look for when he wakes is the list, and then what you did will come out too.",
    "c10_start_court_signature": "The court’s form has no gaps. It turns a person into a witness, and a witness is tested instead of protected.",
    "c10_start_return_file": "When the registration number prints, Han Seoyun puts down the papers in her hand for the first time. The file will outlast the four days, but now the organization knows what is in it and sets its policy accordingly.",
    "c10_start_return_claim": "When the filing number appears, the treatment-cost clock starts running. The review asks how hard he pushed himself, and the answer also makes him a rule-breaker.",
    "c10_start_return_cover": "With his work handed over, nothing falls apart today. The first thing he will look for when he wakes is the list, and then what you did will come out too.",
    "c10_start_return_signature": "Because you go to him first, he is no longer alone. The purge clock keeps running for exactly as long as the visit."
  },
  "choiceVoiceLines": {
    "c10_start_file": "Saying the file will be gone in four days, you register the locker file as an official document outside the ward.",
    "c10_start_claim": "Saying the treatment costs have to come first, you fill out Do Yoonha’s workers’ comp claim at the Ieum Hospital billing office.",
    "c10_start_cover": "Saying it is better not to wake him, you let Do Yoonha sleep and take over his work first.",
    "c10_locker_open": "Saying the 1,740 are not a personal memo, you enter all 1,740 into the victim register with Lee Minseo.",
    "c10_locker_money": "Saying the 47 payments out of his salary come first, you trace the 47 transfers from his salary account one by one.",
    "c10_locker_close": "Saying the 1,128 unresolved are more than you can handle now, you leave them in the locker and hand over only the resolved cases.",
    "c10_claim_prove": "Saying causation needs everything on the table, you put all 3 years of violations in front of Ban Jaewook.",
    "c10_claim_narrow": "So that proof of illness does not become proof of violations, you drop the violation records and submit only the clock-in times.",
    "c10_claim_system": "Saying that if the papers that save him and cut him are the same, the system is wrong, you put the system’s flaw on the agenda instead of Do Yoonha.",
    "c10_relay_assign": "Saying promises scatter, you write the six names on the roster into the rules as official staff.",
    "c10_relay_pay": "Saying four of the six get nothing for this work, you start by winning pay for the four unpaid names on the bookshop sheet.",
    "c10_relay_keep": "Saying no rule can create the will that rode a dawn bus and raised its own hand, you keep the sheet as it is, on Na Junhyuk’s coffee promise.",
    "c10_final_stop": "Because the doctor says he could collapse again within three months, you make him close the new notebook and leave the 212 to rule reform.",
    "c10_final_join": "Saying you will not leave him to write alone, you take half of Do Yoonha’s notebook and write it under your own name.",
    "c10_final_rule": "Since they dropped out because the rules had no box for them, you demand a new box in the agenda form for the 212.",
    "c10_after_rest": "Saying that is enough for today, you turn off the lights and send everyone still there home on time.",
    "c10_after_record": "Saying the roster lasts only if it becomes policy, you submit it as an official group policy proposal.",
    "c10_after_keep": "Since these names are in no system yet, you keep only the list of 212 back, in your own drawer.",
    "c10_ward_choice_1": "Since he asks about the file before his own condition, you reassure him first that you will stop the purge.",
    "c10_ward_choice_2": "Following the order of at least 4 weeks of complete rest, you tell him not to say anything right now.",
    "c10_ward_choice_3": "Saying you cannot dress things up for someone who counted for 3 years, you tell him the list’s real state as it is.",
    "c10_pills_choice_1": "Saying the same reason 19 times is a system problem, you bundle the 19 into one case and demand a group review.",
    "c10_pills_choice_2": "Saying you cannot expose the person who opened the screen, you leave out Han Seoyun’s record and go with eighteen.",
    "c10_pills_choice_3": "Because someone needs treatment money now, you say a single review is faster and finish Do Yoonha’s case first.",
    "c10_ledger_choice_1": "Accepting that an empty box brings the sheet down, you write promotion and reinstatement in your box as losses.",
    "c10_ledger_choice_2": "Saying this is no time to weigh your own share, you write that you have nothing to lose and pass the sheet on.",
    "c10_ledger_choice_3": "Saying it lasts only if everyone knows what the others stake, you open all six boxes and have them review each other.",
    "c10_ward_reaction_choice_1": "Saying the 2,940 hours missing from the books will go on record as an expense, you file a formal claim for 43 million won in unpaid wages.",
    "c10_ward_reaction_choice_2": "Saying a price turns goodwill into a deal, you leave it be without turning it into a number.",
    "c10_ward_reaction_choice_3": "Since you cannot file a claim without asking him first, you use the figure only as evidence for system reform.",
    "c10_pills_reaction_choice_1": "So it does not stay buried under 'personal matter', you have her rewrite those 2 weeks truthfully in the record.",
    "c10_pills_reaction_choice_2": "Saying there is a reason she kept it shut for 3 years, you leave the record alone unless she wants it changed.",
    "c10_pills_reaction_choice_3": "Saying it is hers to decide whether to speak, you get her consent and add hers as the 19th case.",
    "c10_ledger_reaction_choice_1": "Deciding to wait until he brings it up himself, you pretend not to see the rewritten line and pass the sheet on.",
    "c10_ledger_reaction_choice_2": "Saying no sheet should make another person collapse, you call 288 too many and re-split the columns.",
    "c10_ledger_reaction_choice_3": "Saying one conversation is faster than proving it 288 times, you suggest going to see his father together, just once.",
    "c10_branch_home_a": "Saying the letter is his, you give it back and look first at how Window 4 sells today.",
    "c10_branch_home_b": "Leaving the envelope unopened, you quietly pack up only his things and walk out.",
    "c10_branch_home_c": "To the year-1 teller in the same seat, you show the back page of this product first.",
    "c10_branch_home_follow_a": "Since they have quietly added lines for 3 years, you find the three and ask them to share the list.",
    "c10_branch_home_follow_b": "Since they added those lines without telling even each other, you merge the lines into the register without their names.",
    "c10_branch_home_follow_c": "Saying he should hear this first, you decide to tell him when he wakes.",
    "c10_route_system_publish": "Saying a number no one measures never shrinks, you get the burnout rate registered as an official group metric.",
    "c10_route_system_hide": "Saying Do Yoonha’s case gets pushed back if this grows, you shelve the metric and treat it as his case only.",
    "c10_route_system_reach": "Wanting to hear the people themselves before making them a number, you call the 29 who left and hear them out first.",
    "c10_final_system_route_a": "So the next person does not count alone, you submit the burnout rate bundled with the list system.",
    "c10_final_system_route_b": "Saying the roster has to be saved within eight hours, you bury the metric and push through only the roster.",
    "c10_final_system_route_c": "Saying you will not leave it as other people’s number, you write your name on line 35 of the burnout table ahead of time.",
    "c10_evidence_turn_restore": "Saying the next person must have two options, you demand the deleted 'work-related' option be restored to the form.",
    "c10_evidence_turn_hold": "To use it before the other side can prepare, you keep the revision history to yourself and reveal it only at the review.",
    "c10_evidence_turn_share": "Saying they must think it was their own choice, you show the revision history to all 19 first.",
    "c10_locker_evidence_turn": "You stack the forms of the 19 who took sick leave for the same reason in the last 3 years beside the clue and count back to when the reason field began to read the same.",
    "c10_claim_evidence_turn": "You stack the forms of the 19 who took sick leave for the same reason in the last 3 years beside the clue and count back to when the reason field began to read the same.",
    "c10_relay_evidence_turn": "You stack the forms of the 19 who took sick leave for the same reason in the last 3 years beside the clue and count back to when the reason field began to read the same.",
    "c10_route_system_evidence_turn": "You stack the forms of the 19 who took sick leave for the same reason in the last 3 years beside the clue and count back to when the reason field began to read the same.",
    "c10_start_stay_file": "Saying the file will be gone in four days, you register the locker file as an official document outside the ward.",
    "c10_start_stay_claim": "Saying the treatment costs have to come first, you fill out Do Yoonha’s workers’ comp claim at the Ieum Hospital billing office.",
    "c10_start_stay_cover": "Saying it is better not to wake him, you let Do Yoonha sleep and take over his work first.",
    "c10_start_stay_signature": "With 96 hours to the purge and no time for a new form, you apply the handover form from the floor to the list as it is.",
    "c10_start_court_file": "Saying the file will be gone in four days, you register the locker file as an official document outside the ward.",
    "c10_start_court_claim": "Saying the treatment costs have to come first, you fill out Do Yoonha’s workers’ comp claim at the Ieum Hospital billing office.",
    "c10_start_court_cover": "Saying it is better not to wake him, you let Do Yoonha sleep and take over his work first.",
    "c10_start_court_signature": "To give a form to harm that had none to testify on, you sort Do Yoonha’s records the way you gave statements in the witness examinations.",
    "c10_start_return_file": "Saying the file will be gone in four days, you register the locker file as an official document outside the ward.",
    "c10_start_return_claim": "Saying the treatment costs have to come first, you fill out Do Yoonha’s workers’ comp claim at the Ieum Hospital billing office.",
    "c10_start_return_cover": "Saying it is better not to wake him, you let Do Yoonha sleep and take over his work first.",
    "c10_start_return_signature": "As you did at the branch, you say you will go to the person before the paperwork."
  },
  "pack": {
    "clue": {
      "title": "The Default in the Reason Field",
      "text": "4 years ago, the 'work-related' option was deleted from the sick-leave form. The 19 wrote the same words not because of 19 choices, but because there was only one option."
    },
    "outcomes": {
      "c10_after_rest": {
        "tag": "Lights Out",
        "title": "The 4th-floor lights went off on time for the first time",
        "text": "The remaining cases rolled over to Monday, and the six got their Friday evening back. Long work lasts only at a pace that can last."
      },
      "c10_after_record": {
        "tag": "Made Policy",
        "title": "The roster became a document that runs without anyone’s name on it",
        "text": "The sheet was filed as a group policy proposal and will outlast any change of staff. Who will cite it as their own achievement is not yet decided."
      },
      "c10_after_keep": {
        "tag": "Kept in a Drawer",
        "title": "212 names are still in one person’s hands",
        "text": "The roster started running, and the names outside it stayed in your drawer. A record with only one keeper disappears with that one keeper."
      }
    },
    "continuityChallenges": {
      "c9_after_stay": {
        "title": "Find the Bill for the Win",
        "text": "You kept the 1,140. Find first where the costs nobody claimed in those ten days piled up, and a hidden clue may open."
      },
      "c9_after_court": {
        "title": "Give Formless Harm a Form",
        "text": "In court, every harm had a form. You have to reframe the table toward the harm that stopped counting as harm because it had no form."
      },
      "c9_after_return": {
        "title": "Make Late News Arrive on Time",
        "text": "240km always runs a beat late. You have to find the choice that reaches the person first."
      }
    }
  }
};
