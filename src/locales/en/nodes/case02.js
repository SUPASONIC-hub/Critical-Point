/**
 * 사건 02 (src/nodes/case02.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c2_start": {
      "text": "The morning after you return from FlowOn, Trigger Lab’s security audit room. Access, transfer and security-alert records sit on the wall screen. All three are from 23:41 last night, all on the account of Lee Minseo, a contract worker 2 weeks from her renewal review. Ban Jaewook copies the time into his notebook, then stops. 'The problem is the file that went out.' It is the scan of page 3, with the blank signature line, of the 2023-0412 review report you asked to see at FlowOn. The person who filed that page was Lee Minseo. 'The Phase 1 report goes up in 2 hours. I’ve rarely seen records speak with one voice like this.'",
      "memo": [
        "Leak time: last night, 23:41",
        "Account used: Lee Minseo (contract, renewal review in 2 weeks)",
        "File sent: 2023-0412 review report scan, p. 3",
        "Internal Audit wants a Phase 1 report within 2 hours"
      ],
      "choices": {
        "c2_start_meet": {
          "label": "Meet Lee Minseo alone first, in the hall outside"
        },
        "c2_start_verify": {
          "label": "Reopen the original 23:41 record on the log terminal"
        },
        "c2_start_report": {
          "label": "File the Phase 1 report on the three 23:41 log lines"
        },
        "reframe": {
          "label": "Propose another possibility"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Phase 1 report in 2h",
      "question": "A contract colleague 2 weeks from renewal is named as the leaker, and every record points to her. What will you write in the report due in 2 hours?",
      "lead": "The morning after you return from the FlowOn site, you are called to Trigger Lab’s security audit room. The leaked file is the original review report you asked to see at FlowOn, and the person who filed that scan is the contract worker Lee Minseo."
    },
    "c2_logs": {
      "title": "Too Perfect a Record",
      "text": "Last night’s record is up on the log terminal. Access, download, transfer, attempted deletion. The four steps follow one another within 11 minutes, without hesitation. ECHO speaks. 'This matches the example in the internal security training material, down to the order. The team that wrote that material is the Corporate Finance Strategy Team. This is a skilled leaker, or someone who has taught leaking.' The draft Oh Jinwoo is revising at the next terminal was first saved at one in the morning.",
      "memo": [
        "Deletion attempt failed; only the failure record remains",
        "Differs from Lee Minseo’s usual access pattern",
        "Destination address already shut down",
        "Oh Jinwoo is drafting a report from the same record"
      ],
      "choices": {
        "isolate": {
          "label": "Call Security and lock Lee Minseo’s account now"
        },
        "escalate": {
          "label": "Take the log screen straight up to Han Seoyun’s office"
        },
        "c2_logs_verify": {
          "label": "Match original and backup logs line by line"
        },
        "reframe": {
          "label": "Set aside every prepared option"
        }
      },
      "place": "Trigger Lab, security audit room · Log terminal",
      "clock": "Phase 1 report in 1h 40m",
      "question": "The record is too clean. Will you trust it as evidence, or suspect it was made?",
      "lead": "The audit room terminal shows last night’s 23:41 access record as it is. There is not a single failed step in it."
    },
    "c2_meeting": {
      "title": "Lee Minseo’s Account",
      "text": "Lee Minseo tells last night again. At 23:41 she was in an emergency room waiting chair, and the intake number slip is in her wallet. The hospital record has not come yet. She holds her staff ID face down and asks, 'My renewal review is in 2 weeks. If my name goes up before that, the contract ends even if I’m cleared later. If the record points at me, am I already finished?' Your phone shows a text from Ban Jaewook: don’t judge on feeling. Do Yoonha keeps watch on the hall by the door.",
      "memo": [
        "ER visit claim not yet verified",
        "Lee Minseo was told to file the FlowOn review report scan",
        "Work email does not name who gave the order",
        "Ban Jaewook warns against judging on emotion"
      ],
      "choices": {
        "c2_meeting_report": {
          "label": "Write down her statement and hand it to Audit"
        },
        "c2_meeting_shadow": {
          "label": "Trace other terminals’ access with Do Yoonha first"
        },
        "c2_meeting_meet": {
          "label": "Take the ER number slip and match it to 23:41"
        },
        "reframe": {
          "label": "Set aside every prepared option"
        }
      },
      "place": "Trigger Lab, 3rd-floor informal interview room",
      "clock": "Phase 1 report in 1h 10m",
      "question": "Lee Minseo says she was in the emergency room at that hour. Will you check the alibi first, or pass it to procedure?",
      "lead": "The 3rd-floor interview room. You have sat across from Lee Minseo behind a closed door for over 30 minutes. This is contact before the formal interview, so the meeting itself may end up on record."
    },
    "c2_pressure": {
      "title": "Oh Jinwoo’s Report",
      "text": "Oh Jinwoo’s report is up on the shared screen. Three pages, with the conclusion in the first line. Lee Minseo likely acted alone. 'The evidence is enough. If you spend time trusting people, the next leak is on you, Analyst.' He lowers his voice. 'I know. I also know this organization figures nobody gets hurt if it closes on one contract worker.' Han Seoyun wants your call within 30 minutes. A marker in the corner of ECHO’s screen says you are lingering longer than you did at FlowOn.",
      "memo": [
        "Oh Jinwoo’s report: Lee Minseo likely acted alone",
        "Han Seoyun wants your call within 30 minutes",
        "ECHO marks you lingering longer than at FlowOn",
        "Alternate access not yet proven"
      ],
      "choices": {
        "c2_pressure_verify": {
          "label": "Find one more counter-clue within Han Seoyun’s 30 min"
        },
        "c2_pressure_shadow": {
          "label": "Challenge the premise of Oh Jinwoo’s report on screen"
        },
        "c2_pressure_report": {
          "label": "Sign your agreement under his report’s first line"
        },
        "reframe": {
          "label": "Reframe the table and propose"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Phase 1 report in 30m",
      "question": "Oh Jinwoo reached a conclusion first. Will you agree with his report, or find a counter-proof in 30 minutes?",
      "lead": "A little over an hour since the disciplinary notice appeared, and Oh Jinwoo’s draft report is already circulating in the audit room."
    },
    "c2_aftershock": {
      "title": "Who Changed the Record",
      "text": "Four in the morning, the day after the report. One log terminal is on in the audit room. After the report, a line vanished from the original record; the copy still has it. Lee Minseo’s account was locked, so it was not her hand. 'It is possible that the record naming Lee Minseo and the record you used in your report came from the same hand. Three accounts can delete this line, one of them in the Group Strategy Office. Yesterday that account opened Assistant Manager Oh Jinwoo’s report 4 seconds after it appeared on the shared screen.'",
      "memo": [
        "Original and copy show different times",
        "Lee Minseo’s account already locked",
        "1 of 3 accounts with delete rights is in Group Strategy",
        "That account opened Oh Jinwoo’s report within 4 seconds"
      ],
      "choices": {
        "c2_after_audit": {
          "label": "Investigate the original’s keeper and rebuild the trail"
        },
        "c2_after_person": {
          "label": "Ask Lee Minseo directly about the missing record"
        },
        "c2_after_public": {
          "label": "Report possible record tampering outside now"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Before dawn, the day after the report",
      "question": "After the report, one line of the original log vanished. Whom will you ask about this deletion?",
      "lead": "The case is closed, but the record moved. The record naming Lee Minseo and the record in your report may have come from the same hand."
    },
    "c2_trace": {
      "title": "The Missing 11 Seconds",
      "text": "From the emergency stairs, you make a video call. Floor 2 of the secondhand bookshop in Hoegi-dong: Lim Kyungsoo, the retired former credit review head, tears the seal tape and takes out a watermarked printout of the 2023-0412 review report. In the system, the bottom line of page 3 changed inside the log’s 11-second gap. His copy still has the line as it was before. 'A document management system, you just edit. A printout, you have to burn. And burning leaves a mark. I’ve kept it 3 years. I knew someone would ask one day.'",
      "memo": [
        "Bottom of page 3 survives only on the watermarked printout",
        "Lee Minseo’s account used right after the gap",
        "Security calls the gap a simple error",
        "Lim Kyungsoo has kept this copy for 3 years"
      ],
      "choices": {
        "c2_trace_choice_3": {
          "label": "Call it an error and keep the report deadline"
        },
        "c2_trace_choice_1": {
          "label": "Reproduce the 11 seconds technically"
        },
        "c2_trace_choice_2": {
          "label": "Ask Lee Minseo what she did in that time"
        }
      },
      "place": "Trigger Lab, emergency stairs · Video call with the Hoegi-dong bookshop",
      "clock": "Phase 1 report in 1h 30m",
      "question": "The page that changed in the log’s 11-second gap survives intact on the retired review head’s watermarked printout. Will you close that time as a technical error, or open it as time when someone made a judgment?",
      "lead": "You slip out of the audit room and make a call from the emergency stairs. Lim Kyungsoo retired at the age limit, and he still keeps the watermarked printout he took with him, sealed in a binder."
    },
    "c2_witness": {
      "title": "Lee Minseo’s Silence",
      "text": "Not once does Lee Minseo say she didn’t do it. Instead, she asks why filing page 3, the one with the blank signature line, came to her of all people. The order came only by word of mouth. Put one scan in a folder, it said, and she did it without reading it. Her work email does not name who told her. 'I didn’t even know what that paper was. But now I’m here because of that paper.'",
      "memo": [
        "Filing order given only verbally",
        "Order covered one sheet: page 3",
        "Lee Minseo filed the page without reading it",
        "2 weeks to renewal review"
      ],
      "choices": {
        "c2_witness_choice_1": {
          "label": "Secure Lee Minseo’s safety first"
        },
        "c2_witness_choice_4": {
          "label": "Strike a deal with Lee Minseo on terms"
        },
        "c2_witness_choice_2": {
          "label": "Trace only the file’s path"
        },
        "c2_witness_choice_3": {
          "label": "Record her silence as a red flag"
        }
      },
      "place": "Trigger Lab, 3rd-floor informal interview room",
      "clock": "Phase 1 report in 55m",
      "question": "Lee Minseo does not defend herself; she asks what the file was for. Which comes first: her safety, or moving the case?"
    },
    "c2_judgment": {
      "title": "The People Outside the Report",
      "text": "18 minutes before the deadline, two envelopes slide in under the audit room door. They are unsigned statements from two group IT contractors on the 3rd floor who look after the same servers as Lee Minseo. Who was in the office at that hour. How the order about page 3 came down. The outside company stamped as the recipient has replied that it never received any such material. Han Seoyun sets the envelopes on the table. 'This isn’t a conclusion. It’s memory. We can’t use only the record, or only memory. What’s left is the order we put them in.'",
      "memo": [
        "Two colleagues submitted anonymous statements",
        "18 minutes to the Phase 1 report deadline",
        "Outside company denies the leak"
      ],
      "choices": {
        "c2_judgment_choice_3": {
          "label": "Call the outside company to check first"
        },
        "c2_judgment_choice_1": {
          "label": "Attach the anonymous statements as an annex"
        },
        "c2_judgment_choice_2": {
          "label": "Hold back anything not in the record"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Phase 1 report in 18m",
      "question": "Two colleagues gave anonymous statements. Will you put words that are not in the record into the report?"
    },
    "c2_trace_reaction": {
      "title": "The Login 11 Seconds Later",
      "text": "Back in the audit room, ECHO has fed in Lim Kyungsoo’s printout and replayed those 11 seconds. In the blank stretch, one nameless admin account moves. It is not Lee Minseo’s account. For 11 seconds it opened page 3, then closed it. ECHO puts up a line. 'If you fix this stretch as an error, the log comes out clean, and this account’s trace disappears too. Here, fixing and erasing are the same button.' 1 hour 20 minutes to the Phase 1 report.",
      "memo": [
        "Records before and after the restored 11 seconds",
        "Conditions for reopening access rights"
      ],
      "choices": {
        "c2_trace_reaction_choice_3": {
          "label": "Reset the whole system"
        },
        "c2_trace_reaction_choice_2": {
          "label": "Follow the account to the cause"
        },
        "c2_trace_reaction_choice_1": {
          "label": "Block access and keep the record"
        }
      },
      "place": "Trigger Lab, security audit room · Log terminal",
      "clock": "Phase 1 report in 1h 20m",
      "question": "When ECHO replayed the 11 seconds, another account woke up. Will you fix the error, or leave the evidence as it is?"
    },
    "c2_witness_reaction": {
      "title": "The Word Protection",
      "text": "As you are about to leave the interview room, Lee Minseo stops with her hand on the doorknob. 'I know there’s talk of protection measures. But that scares me. If I’m hidden away, the place where I can say with my own mouth that it wasn’t me disappears too.' Ban Jaewook is listening from the hall. 'Once protection is in place, the person’s statements go through a representative. That’s the rule.' He looks at you. 'On paper, protecting someone and silencing them go in the same box.'",
      "memo": [
        "Procedure separating protection from silence",
        "Disclosure scope the person can choose"
      ],
      "choices": {
        "c2_witness_reaction_choice_2": {
          "label": "Testify in her place to cut the risk"
        },
        "c2_witness_reaction_choice_1": {
          "label": "Set up a way for Lee Minseo to speak for herself"
        },
        "c2_witness_reaction_choice_3": {
          "label": "Skip protection and leave it to the probe"
        }
      },
      "place": "Trigger Lab, 3rd-floor hallway",
      "clock": "Phase 1 report in 45m",
      "question": "Lee Minseo says she is afraid of being protected. Will you set up a way for her to speak for herself?"
    },
    "c2_judgment_reaction": {
      "title": "The Price of Anonymity",
      "text": "10 minutes to the deadline. Do Yoonha stands holding the two envelopes. He knows the two people who wrote them. 'If we protect their names, these words go in and no one answers for them. If we confirm the names, someone answers for them, but those people become next after Lee Minseo. Depending on how we write one line, who gets called what on the 3rd floor tomorrow changes. That’s the price of anonymity.'",
      "memo": [
        "How to verify the anonymous statements",
        "Where to keep the voices outside the report"
      ],
      "choices": {
        "c2_judgment_reaction_choice_2": {
          "label": "Confirm their real names, then report"
        },
        "c2_judgment_reaction_choice_1": {
          "label": "Keep them anonymous and state the limits"
        },
        "c2_judgment_reaction_choice_3": {
          "label": "Drop the statements and file the record only"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Phase 1 report in 10m",
      "question": "Anonymous statements widen the truth, but no one answers for them. Will you keep them anonymous, or confirm the names?"
    },
    "c2_branch_records": {
      "title": "Whose Time Were the 11 Seconds",
      "text": "In the backup server room, the original and backup logs split just before 23:41. The original has 11 seconds with nothing stamped; the backup is missing that stretch entirely. Lee Minseo’s account was used right after the gap. The box for who approved the deletion request is empty. Ban Jaewook says, 'Write these 11 seconds down as a machine error, and it closes here. Write them down as time someone tampered with, and it stays open until we find the hand. Either way, the name of the person who wrote it stays beside it.'",
      "memo": [
        "Gap in the original log",
        "Order of the accounts that logged in",
        "Who approved the deletion request"
      ],
      "choices": {
        "c2_branch_records_a": {
          "label": "Preserve the original and the backup together"
        },
        "c2_branch_records_c": {
          "label": "Mark it an error and go ahead with the report"
        },
        "c2_branch_records_b": {
          "label": "Get the user’s statement first"
        }
      },
      "place": "Trigger Lab, security audit room · Backup server room",
      "clock": "Phase 1 report in 1h",
      "question": "The original and the backup differ. Whose time will you record the 11 seconds as?"
    },
    "c2_branch_records_follow": {
      "title": "Who Owns the Restored Record",
      "text": "10 minutes later, Han Seoyun comes down with the record Security restored for the blank stretch. Inside the 11 seconds: one login, one viewing, and three requests to classify both as an 'error'. Each time, the request was passed to the next desk. 'You see the order before the names. Not who did it, but who passed it to whom. Who we let read this record and confirm it also goes on the record.'",
      "memo": [
        "Time of restoration",
        "Order of the statements",
        "Original text to keep in the report"
      ],
      "choices": {
        "c2_branch_records_follow_a": {
          "label": "Let the witness check the original text"
        },
        "c2_branch_records_follow_b": {
          "label": "Attach the original and open outside review"
        },
        "c2_branch_records_follow_c": {
          "label": "Keep only the report’s conclusion"
        }
      },
      "place": "Trigger Lab, security audit room · Backup server room",
      "clock": "Phase 1 report in 50m",
      "question": "The record is restored. Whom will you write down as its owner?"
    },
    "c2_route_report": {
      "title": "The Report Moves First",
      "text": "Once you move the report first, procedure runs ahead in under 10 minutes. Lee Minseo’s account is locked, and a disciplinary notice appears in the HR system, document number and all. The official draft already carries the report Oh Jinwoo wrote before dawn. Lee Minseo’s rebuttal material has gone to a folder called 'Off-procedure documents'. 'Once a report starts, the documents do the work, not the people. The question now is where we stop a procedure that’s rolling the wrong way.'",
      "memo": [
        "Disciplinary notice generated first",
        "Oh Jinwoo’s report attached to the official draft",
        "Rebuttal material filed as off-procedure"
      ],
      "choices": {
        "c2_route_report_sign": {
          "label": "Sign by procedure, footnote the chance of rebuttal"
        },
        "c2_route_report_reopen": {
          "label": "Use the report as evidence of who rushed it"
        },
        "c2_route_report_hold": {
          "label": "Insert a temporary hold into the disciplinary notice"
        },
        "c2_route_report_evidence_turn": {
          "label": "Match the leak log’s timestamps against the testimony"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Phase 1 report in 1h 50m",
      "question": "You chose to file the report first. How far will you push a procedure that moves faster than people?",
      "lead": "Right after you decide to move the report first. Procedure starts moving ahead of the people."
    },
    "c2_route_person": {
      "title": "The Person Who Arrived Before the Record",
      "text": "In a small interview room at the end of the 3rd-floor hallway, Lee Minseo is seated. The phone she holds out shows last night’s intake text from the emergency room. No one has checked yet whether it is genuine. You read her the leaked file, and she looks up. 'That sentence was in the scan I was filing.' Do Yoonha shuts the door and speaks low. 'Meeting before the formal interview can end up on record by itself. We have to set the terms under which she can speak.'",
      "memo": [
        "ER intake text not yet verified as genuine",
        "Informal contact itself may be logged as a breach",
        "Lee Minseo recognizes some lines of the leaked file"
      ],
      "choices": {
        "c2_route_person_record": {
          "label": "Make an official record where she can speak herself"
        },
        "c2_route_person_shield": {
          "label": "Testify in her place to cut her exposure for now"
        },
        "c2_route_person_trade": {
          "label": "Offer protection, then ask the file’s source first"
        },
        "c2_route_person_evidence_turn": {
          "label": "Match the leak log’s timestamps against the testimony"
        }
      },
      "place": "Trigger Lab, 3rd-floor informal interview room",
      "clock": "Phase 1 report in 1h 50m",
      "question": "You chose to meet the person before the record. How will you put this meeting on record?",
      "lead": "Right after you say you will meet Lee Minseo informally first. Security may take issue with contact before the formal interview."
    },
    "c2_route_origin": {
      "title": "The Original Refuses to Answer",
      "text": "The backup server room behind the audit room. Ban Jaewook puts the original log and the backup log side by side. The original has 11 seconds the copy lacks. Just before 23:41, a stretch where nothing was stamped. The checksums, which should match for the same record, differ too. Right after the gap, admin rights were used once. 'Lee Minseo’s name comes after that. Before it, someone deleted these 11 seconds from the copy meant for the report. I want to know about that person first.'",
      "memo": [
        "Original and backup hashes differ",
        "Admin token used once right after the gap",
        "FlowOn review report scan reclassified as evidence"
      ],
      "choices": {
        "c2_route_origin_patch": {
          "label": "Patch the gap as an error and meet the deadline"
        },
        "c2_route_origin_freeze": {
          "label": "Freeze both logs and disclose the difference"
        },
        "c2_route_origin_token": {
          "label": "Trace who used the admin rights"
        },
        "c2_route_origin_evidence_turn": {
          "label": "Match the leak log’s timestamps against the testimony"
        }
      },
      "place": "Trigger Lab, security audit room · Backup server room",
      "clock": "Phase 1 report in 1h 50m",
      "question": "The original log refuses re-verification. Will you use the refusal itself as evidence?",
      "lead": "Right after you say you will re-verify the original system log. The original opens, but it never gives the same answer twice."
    },
    "c2_route_system": {
      "title": "Your Question Wakes the Log",
      "text": "As you set aside every prepared option, a new line opens on the log terminal. It checks what you just did against a table called 'Analyst Response Match'. The table lists, word for word, the choices you made in the last case, and some of that wording is also in the margin of last night’s leaked file. ECHO puts up a line. 'This case may not be about settling the charge against Lee Minseo. It may be an experiment that copies down the analyst’s judgment. This line does not go into the official procedure.'",
      "memo": [
        "The reframed table was matched against test data",
        "Some Case 01 choice wording matches the leaked file",
        "ECHO keeps this route out of official procedure"
      ],
      "choices": {
        "c2_route_system_copy": {
          "label": "Preserve the copied choice wording as evidence"
        },
        "c2_route_system_hide": {
          "label": "Hide the experiment’s trace, solve only her case"
        },
        "c2_route_system_warn": {
          "label": "Warn the next participant of a possible experiment"
        },
        "c2_route_system_evidence_turn": {
          "label": "Match the leak log’s timestamps against the testimony"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Phase 1 report in 1h 50m",
      "question": "Reframing the table woke the log. Whom will you report this response to?",
      "lead": "You reframed the table without choosing any of the three reports, and the log system responded first."
    },
    "c2_final_evidence": {
      "title": "The Culprit Procedure Made",
      "text": "Just before the Phase 1 deadline, Security’s draft is up on the screen. Oh Jinwoo’s report is its skeleton, and its conclusion is that Lee Minseo alone is responsible. The disciplinary process has already moved to the next stage, and the chance to rebut is 'appeal after discipline'. Han Seoyun says, 'If we add a hold, we miss the deadline. If we send it as is, she can only speak after she’s been punished.' She sets a pen beside the signature field. 'Same question as at the start. Where you’ll stop this procedure, and in whose name.'",
      "memo": [
        "Security’s draft closes on Lee Minseo alone",
        "A hold breaks the report deadline",
        "Left as is, the right to rebut comes after the fact"
      ],
      "choices": {
        "c2_final_evidence_stop": {
          "label": "Require rebuttal and source checks before discipline"
        },
        "c2_final_evidence_file": {
          "label": "File the Phase 1 report, log the flaw as a new case"
        },
        "c2_final_evidence_close": {
          "label": "Close per Oh Jinwoo’s draft, leave blame to later audit"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Just before the Phase 1 report",
      "question": "Procedure made a culprit. Will you send this report up as it is?"
    },
    "c2_final_person": {
      "title": "Whose Voice Is Protection",
      "text": "Just before the Phase 1 deadline, a statement form lies on the table. So far, what Lee Minseo said exists only in your notes and Do Yoonha’s. 'If I clean this up, it gets neater. But the neater it gets, the less it sounds like her.' Beyond the glass wall, Lee Minseo waits, gripping her staff ID. She said she wants to read her own statement. If her real name goes up, it circulates before her renewal review; writing it for her is safe, but her voice disappears.",
      "memo": [
        "Lee Minseo wants to check her own statement",
        "Real name raises the immediate risk",
        "Proxy statement is safe but erases her as a party"
      ],
      "choices": {
        "c2_final_person_voice": {
          "label": "Let her testify and choose how much is disclosed"
        },
        "c2_final_person_release": {
          "label": "Lift protection; let her prove it in the probe"
        },
        "c2_final_person_proxy": {
          "label": "Testify for her and keep her name hidden a while"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Just before the Phase 1 report",
      "question": "Whose voice did protection erase? In what form will you keep Lee Minseo’s words?"
    },
    "c2_final_system": {
      "title": "Not the Culprit but the Designer",
      "text": "Just before the Phase 1 report, ECHO puts three things on one screen. The log’s 11-second gap, the admin account that woke in it, and a draft report written down to its conclusion before dawn, before the leak was even known. The fourth line is the wording of your choices from the last case, written in the margin of the leaked file. 'This looks less like the trace of smuggling out material and more like the trace of setting up this situation. Close it on one person’s guilt, and the report goes up on time. Write down the hand that set it up, and this case no longer belongs to Lee Minseo.'",
      "memo": [
        "Case 01 choice wording reused as test data",
        "Admin token’s real name not yet confirmed",
        "Going public weakens the charge but shakes the whole experiment"
      ],
      "choices": {
        "c2_final_system_expose": {
          "label": "Make the experiment design official over her guilt"
        },
        "c2_final_system_contain": {
          "label": "Seal the experiment’s trace, report her charge lower"
        },
        "c2_final_system_trace": {
          "label": "Hold every conclusion until the token has a name"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Just before the Phase 1 report",
      "question": "You see not a culprit but a designer. Which will you make official: one person’s guilt, or system tampering?"
    },
    "c2_evidence_turn": {
      "title": "Protected Testimony Turns the Record",
      "text": "You lay the clue you hold against the times in the leak log, and the numbers don’t line up. The leaked file was created 4 minutes after the transfer time. In the 3rd-floor interview room, Lee Minseo looks at the screen. 'My account was locked this morning. It’s my record, and I’m the only one who can’t see it.' She winds her ID lanyard around her finger. 'Everyone asks who talked. Nobody asks who made sure I couldn’t.'",
      "memo": [
        "File created 4 minutes after the transfer time",
        "Signs protection measures isolated the witness",
        "Same time gap in other records not yet checked"
      ],
      "choices": {
        "c2_evidence_turn_delay": {
          "label": "Delay the testimony; finish restoring the log first"
        },
        "c2_evidence_turn_stamp": {
          "label": "Send the time-tampering proof to an outside audit"
        },
        "c2_evidence_turn_guard": {
          "label": "Restore the witness’s access to records first"
        }
      },
      "place": "Trigger Lab, 3rd-floor informal interview room",
      "clock": "Phase 1 report in 35m",
      "question": "Protected testimony turns the record over. Will you put Lee Minseo’s words in as evidence?"
    },
    "c2_start_people": {
      "title": "The Next Case for the Protected",
      "text": "The morning after you return from FlowOn, Do Yoonha is waiting outside Trigger Lab’s security audit room. 'Lee Minseo’s been flagged as the leaker. Last night’s 23:41 records are all her account.' The file that went out is the 2023-0412 review report scan, page 3, where the signature line is blank. Lee Minseo, the contract worker who was filing that scan, has her renewal review in 2 weeks. As in the last case, a person has come first. A text from Lee Minseo: 'Just 5 minutes before the report goes up.' 2 hours to the Phase 1 report.",
      "memo": [
        "A request for anonymous testimony already came in",
        "Lee Minseo contacted you directly",
        "Security takes issue with protection measures"
      ],
      "choices": {
        "c2_start_people_report": {
          "label": "File the Phase 1 report on the three 23:41 log lines"
        },
        "c2_start_people_meet": {
          "label": "Meet Lee Minseo alone first, in the hall outside"
        },
        "c2_start_people_verify": {
          "label": "Reopen the original 23:41 record on the log terminal"
        },
        "c2_start_people_signature": {
          "label": "Answer Lee Minseo’s text asking for 5 minutes first"
        },
        "c2_start_people_reframe": {
          "label": "Propose another possibility"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Phase 1 report in 2h",
      "question": "Last case you protected the person first, and this time that person has come to you before the record. Whose words will you hear first?",
      "lead": "The morning you leave the FlowOn site and return to Trigger Lab’s security audit room. Lee Minseo, named as the leaker, is the contract colleague who was told to file the FlowOn review report scan."
    },
    "c2_start_records": {
      "title": "The Next Case for the Published Numbers",
      "text": "The morning after you return from FlowOn, one file is up on the screen in Trigger Lab’s security audit room. It went out at 23:41 last night under the account of Lee Minseo, a contract worker: the 2023-0412 review report scan, page 3, with the blank signature line. In its margin are figures from the cash-flow statement you made public in the last case. 'I know the numbers you published are correct. The problem is where those numbers are attached now.' Lee Minseo’s renewal review is in 2 weeks; the Phase 1 report is due in 2 hours.",
      "memo": [
        "Three copies of the published material exist",
        "Leaked file includes the published figures",
        "Records custodian denies responsibility"
      ],
      "choices": {
        "c2_start_records_report": {
          "label": "File the Phase 1 report on the three 23:41 log lines"
        },
        "c2_start_records_verify": {
          "label": "Reopen the original 23:41 record on the log terminal"
        },
        "c2_start_records_signature": {
          "label": "Trace the tampering back from your published figures"
        },
        "c2_start_records_meet": {
          "label": "Meet Lee Minseo alone first, in the hall outside"
        },
        "c2_start_records_reframe": {
          "label": "Propose another possibility"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Phase 1 report in 2h",
      "question": "Someone used the material you published to touch an internal record. How will you check the very way you trust numbers this time?",
      "lead": "The morning you leave the FlowOn site and return to Trigger Lab’s security audit room. The leaked file started from the very material you published."
    },
    "c2_start_silence": {
      "title": "The Bill for Silence",
      "text": "The morning after you return from FlowOn, Han Seoyun closes the door of Trigger Lab’s security audit room and holds out her tablet. It is the 2023-0412 review report scan that went out at 23:41 last night, page 3, with the blank signature line. The access log points to Lee Minseo, a contract worker 2 weeks from her renewal review. Attached at the end of the file are the terms you chose not to disclose in the last case, word for word as they were spoken in the meeting room. Han Seoyun says, 'Putting it off doesn’t make it go away. It just comes out of someone else’s hands first.' 2 hours to the Phase 1 report.",
      "memo": [
        "Leaked file includes words from a closed meeting",
        "Lee Minseo is the first suspect",
        "Outside company already preparing its next move"
      ],
      "choices": {
        "c2_start_silence_report": {
          "label": "File the Phase 1 report on the three 23:41 log lines"
        },
        "c2_start_silence_meet": {
          "label": "Meet Lee Minseo alone first, in the hall outside"
        },
        "c2_start_silence_verify": {
          "label": "Reopen the original 23:41 record on the log terminal"
        },
        "c2_start_silence_signature": {
          "label": "Disclose the terms you kept quiet before anyone else"
        },
        "c2_start_silence_reframe": {
          "label": "Propose another possibility"
        }
      },
      "place": "Trigger Lab, security audit room",
      "clock": "Phase 1 report in 2h",
      "question": "The bill for the disclosure you put off has arrived. How will you handle your silence, now in this leaked file?",
      "lead": "The morning you leave the FlowOn site and return to Trigger Lab’s security audit room. The leaked file even holds the terms you never disclosed."
    }
  },
  "echoReplies": {
    "c2_start_report": "As the report goes up, Ban Jaewook writes down the time and sets his pen down. A report written from the record alone was fast, but the name Lee Minseo, now in its first line, won’t come off easily.",
    "c2_start_meet": "When you meet at the end of the hall, Lee Minseo turns her staff ID face down. A door to the hidden story has opened, but the blame for delaying evidence and the report stays under your name.",
    "c2_start_verify": "You reopen the original, and the three lines match the same time without a gap. What the system recorded is clear, but what Lee Minseo actually did at that hour is still off the screen.",
    "c2_logs_verify": "With the two sets side by side, one deletion-attempt line is stamped differently in each. The place where they split has narrowed, but who made it is still outside the record.",
    "isolate": "The account locks, and Lee Minseo’s staff ID flashes red at the entrance gate. The path for the damage to spread is blocked, but if she is innocent, you are the one who started the punishment.",
    "escalate": "You show her the screen, and Han Seoyun takes the printout and puts it in her drawer. Passing the judgment up is safe, but how to read this case is now in that drawer too.",
    "c2_meeting_meet": "As you take the number slip, Lee Minseo lets go of her staff ID for the first time. Putting a person’s time ahead of the record is an order that is hard to undo if it flips. You head down to the backup server room to match the ER intake time against the record.",
    "c2_meeting_report": "You hand over the statement, and Do Yoonha opens the door to let Lee Minseo out into the hall. The procedure looks fair, but inside it, Lee Minseo has to make room to explain herself alone.",
    "c2_meeting_shadow": "Do Yoonha shuts the hall door, and the two of you spread out the terminal lists floor by floor. The field has widened, but from the moment you move outside procedure, your judgment is under investigation too.",
    "c2_pressure_report": "Once you sign, Oh Jinwoo swivels his chair and uploads the report to the system. The case is closed and the organization goes quiet, but nowhere in the three pages does it say that Lee Minseo paid for that quiet.",
    "c2_pressure_verify": "You set the clock, and the marker in the corner of ECHO’s screen grows one notch longer. 30 minutes is short for a counter-proof and plenty for an excuse; if you find nothing, you go on record as someone who agreed.",
    "c2_pressure_shadow": "You underline one line of the premise, and Oh Jinwoo lifts his hands from the keyboard. The whole report shook, and the person writing the next one is now you.",
    "c2_after_audit": "Investigating the keeper rebuilds the trail. Your own access record is on that list of subjects too.",
    "c2_after_person": "Asking directly is fast. But this conversation itself may later read as pressure on a witness.",
    "c2_after_public": "Going public at once stops a cover-up. Suspicion thrown out without proof may burn an innocent person first.",
    "c2_trace_choice_1": "A reproduction shows what was possible, but possible and done are not the same.",
    "c2_trace_choice_2": "Asking directly brings a faster answer, and the moment you ask, she is already a suspect.",
    "c2_trace_choice_3": "The deadline you kept is quiet today, and the 11 seconds you closed as an error reopen in the next case.",
    "c2_witness_choice_1": "Putting safety first slows the probe, and the conditions under which she can speak remain.",
    "c2_witness_choice_2": "Looking only at the path seems fair, but at the end of that path a person still stands.",
    "c2_witness_choice_3": "The moment you write silence down as a signal, the next person gains one more reason not to speak.",
    "c2_witness_choice_4": "A deal brings answers fast, but the bill for those answers comes later.",
    "c2_judgment_choice_1": "As an annex, the testimony becomes record, and the anonymity grows that much thinner.",
    "c2_judgment_choice_2": "The sentences you held back are not erased; they keep circulating outside the report.",
    "c2_judgment_choice_3": "Checking with them first narrows the facts quickly, and pushes the deadline back just as much.",
    "c2_trace_reaction_choice_1": "Locking is not fixing, but it makes erasing impossible too.",
    "c2_trace_reaction_choice_2": "Following the account reaches the cause, and reaches a person too.",
    "c2_trace_reaction_choice_3": "A reset wipes out the evidence along with the error.",
    "c2_witness_reaction_choice_1": "A way to speak for herself is slow, but that statement won’t collapse in someone else’s hands.",
    "c2_witness_reaction_choice_2": "Speaking for her makes her safe, but her own words vanish from the record.",
    "c2_witness_reaction_choice_3": "Without protection, suspicion and opportunity both stay with her.",
    "c2_judgment_reaction_choice_1": "Testimony with its limits stated looks weak, but it holds up under rebuttal.",
    "c2_judgment_reaction_choice_2": "Real names make the report solid and the witnesses thin.",
    "c2_judgment_reaction_choice_3": "The sentences you chose to drop keep circulating outside the report.",
    "c2_branch_records_a": "Keeping both lets you compare them later. In exchange, the time you have to reach a conclusion now shrinks.",
    "c2_branch_records_b": "A statement gives context. But as time passes, a statement turns from memory into interpretation.",
    "c2_branch_records_c": "Closing it as an error makes the report clean. Who did what in those 11 seconds will never be asked.",
    "c2_branch_records_follow_a": "The right to check is a right of defense. It is also a chance to polish the statement.",
    "c2_branch_records_follow_b": "Outside review makes your judgment solid. That review looks at your procedure too.",
    "c2_branch_records_follow_c": "Leaving only the conclusion makes it easy to read. In exchange, the tools to doubt that conclusion disappear too.",
    "c2_route_report_hold": "A hold slows the procedure, but it also pins a procedure that moved wrong to the record.",
    "c2_route_report_sign": "A footnote is too small to save a person, and may be enough to prove responsibility later.",
    "c2_route_report_reopen": "Look into the report’s speed, and the designer may come into view before the culprit.",
    "c2_route_person_record": "Protection that makes a place to speak also leaves the right to be doubted.",
    "c2_route_person_shield": "Speaking for her makes her safe, but her voice becomes your sentences again.",
    "c2_route_person_trade": "The moment protection becomes a bargain, the relationship moves fast and spoils for a long time.",
    "c2_route_origin_freeze": "With the original frozen, no one can easily rewrite the conclusion.",
    "c2_route_origin_token": "Chasing the rights makes you watch how access moved, not whose name it was.",
    "c2_route_origin_patch": "The patch saves the deadline but erases what the gap meant.",
    "c2_route_system_copy": "Once the choice wording is evidence, you are inside the case too.",
    "c2_route_system_warn": "The warning protects the next person, but it also tells the experimenter where you stand.",
    "c2_route_system_hide": "Hiding the trace makes the case smaller, and the same experiment may go on.",
    "c2_final_evidence_stop": "A sentence that stops the procedure comes late, but it becomes the standard for the next discipline case.",
    "c2_final_evidence_file": "A separate case barely meets today’s deadline and creates tomorrow’s responsibility.",
    "c2_final_evidence_close": "A quick close protects operations but pushes the right to rebut to after the fact.",
    "c2_final_person_voice": "Giving her voice back turns protection from control into a right.",
    "c2_final_person_proxy": "A proxy statement buys safety but takes the person’s choice away again.",
    "c2_final_person_release": "The moment protection lifts, the official weight goes up, and so does the human cost.",
    "c2_final_system_expose": "Exposing the structure blurs Lee Minseo’s name and shakes the whole experiment.",
    "c2_final_system_trace": "While the conclusion waits, the risk remains, but the direction of the evidence grows clear.",
    "c2_final_system_contain": "Sealing it may limit the damage, but the experiment’s authority stays intact.",
    "c2_evidence_turn_guard": "With her access back, the statement becomes verification, not defense.",
    "c2_evidence_turn_stamp": "Evidence sent outside can’t be taken back, and neither can the organization’s response.",
    "c2_evidence_turn_delay": "The restored log protects the statement. Meanwhile, the witness waits alone.",
    "c2_route_report_evidence_turn": "Set the two times against each other, and the subject of the charge shifts from a person to the record.",
    "c2_route_person_evidence_turn": "Set the two times against each other, and the subject of the charge shifts from a person to the record.",
    "c2_route_origin_evidence_turn": "Set the two times against each other, and the subject of the charge shifts from a person to the record.",
    "c2_route_system_evidence_turn": "Set the two times against each other, and the subject of the charge shifts from a person to the record.",
    "case02_memory_route": "Check the promise first, and Lee Minseo is called a person before she is a record. The report’s first line fills in that much later.",
    "case02_memory_system": "Take it apart, and one line of the leaked file is written in the same order as the table you reframed at FlowOn. The subject of the charge shifts from Lee Minseo to whoever made the record.",
    "case02_memory_evidence": "Stand the payroll sheet beside it, and the leaked file’s creation time and the testimony time don’t line up. What remains first is not who talked, but who kept someone from talking.",
    "c2_start_people_report": "The one who put people first last case now leads with the record. The team sees that shift too.",
    "c2_start_people_meet": "Use the same approach twice and it becomes a principle. A principle becomes predictable, and what is predictable gets used.",
    "c2_start_people_verify": "To justify last time’s protection, this verification has to be stricter. That burden is yours.",
    "c2_start_records_report": "The numbers you published became the way into the case. Close it the same way, and the line of responsibility is clear.",
    "c2_start_records_meet": "When the one who published the numbers goes to meet a person, the organization asks why the shift.",
    "c2_start_records_verify": "Doubting material you published yourself is slow. But skip that step, and every other judgment wobbles.",
    "c2_start_silence_report": "Last time’s silence sets this time’s speed. Don’t let a rushed report cover up another silence.",
    "c2_start_silence_meet": "Words put off don’t vanish; they reach the other person. Meeting now is not an apology but a correction of order.",
    "c2_start_silence_verify": "What you didn’t say is in someone else’s hands first. The result of the check may point back at you.",
    "c2_start_people_signature": "Hearing the person first, as in the last case, opens a channel again. The moment you use it, protection can also look like a deal.",
    "c2_start_records_signature": "The numbers you published are now the baseline. If that baseline is wrong, this probe falls with it.",
    "c2_start_silence_signature": "Bringing out what you held back yourself wins back control. It also raises the question of why you didn’t say it then."
  },
  "choiceVoiceLines": {
    "c2_start_report": "Noting that the logs are all you have, you file the Phase 1 report on the three 23:41 log lines.",
    "c2_start_meet": "Knowing the risk, you put her face ahead of procedure and meet Lee Minseo alone first, in the hall outside the audit room.",
    "c2_start_verify": "Saying you can’t trust evidence this clean, you reopen the original 23:41 record on the log terminal.",
    "c2_logs_verify": "The more perfect the record, the more the copy matters, so you match the original and backup logs line by line in the backup server room.",
    "isolate": "Leaving room for her innocence, you call Security and lock Lee Minseo’s account at once.",
    "escalate": "Knowing the right to read this case leaves your hands, you take the log screen straight up to Han Seoyun’s office.",
    "c2_meeting_meet": "Where she was at that hour comes before the charge, so you take the ER intake number slip and match it to 23:41.",
    "c2_meeting_report": "If you waver now, an impression stays instead of a judgment, so you write down her statement and hand it to Internal Audit’s formal procedure.",
    "c2_meeting_shadow": "Stepping back outside the official record, you quietly trace other terminals’ access with Do Yoonha before the report.",
    "c2_pressure_report": "Dragging it out would reach the same conclusion, you say, and you sign your agreement under the first line of Oh Jinwoo’s report.",
    "c2_pressure_verify": "One thing that overturns the conclusion is enough, so you look for one more counter-clue within Han Seoyun’s 30 minutes.",
    "c2_pressure_shadow": "Aiming not at the conclusion but at the ground it stands on, you challenge the premise of Oh Jinwoo’s report in front of the shared screen.",
    "c2_after_audit": "To find out first who touched the record, you investigate the original’s keeper.",
    "c2_after_person": "Knowing the risk of skipping procedure, you ask Lee Minseo directly.",
    "c2_after_public": "To leave no time for a cover-up, you report the possible tampering outside at once.",
    "c2_trace_choice_1": "You say you will reproduce exactly what was possible in those 11 seconds.",
    "c2_trace_choice_2": "You say you will ask Lee Minseo directly what she did in that time.",
    "c2_trace_choice_3": "You say you will file it as a simple error and keep the report deadline.",
    "c2_witness_choice_1": "You say you will secure Lee Minseo’s safety before any conclusion.",
    "c2_witness_choice_2": "You say you will leave the person aside and follow only the path the file took.",
    "c2_witness_choice_3": "You say you will record her silence as a red flag.",
    "c2_witness_choice_4": "You say you will strike a deal on terms with the person named.",
    "c2_judgment_choice_1": "You say you will attach the anonymous statements to the report as an official annex.",
    "c2_judgment_choice_2": "You say you will hold back anything not in the record from this report.",
    "c2_judgment_choice_3": "You say you will call the outside company to check before reaching a conclusion.",
    "c2_trace_reaction_choice_1": "You say you will leave the record as it is and lock only the access.",
    "c2_trace_reaction_choice_2": "You say you will follow what that account did all the way to the end.",
    "c2_trace_reaction_choice_3": "You say you will reset the system and rebuild it from the start.",
    "c2_witness_reaction_choice_1": "You say you will set up a way for her to speak for herself.",
    "c2_witness_reaction_choice_2": "You say you will testify in her place and share the risk.",
    "c2_witness_reaction_choice_3": "You say you will skip protection measures and leave it to the official probe.",
    "c2_judgment_reaction_choice_1": "You say you will keep them anonymous and write down the limits too.",
    "c2_judgment_reaction_choice_2": "You say you will report only after confirming their real names.",
    "c2_judgment_reaction_choice_3": "You say you will drop the statements and file the record only.",
    "c2_branch_records_a": "As if refusing to erase either side, you propose preserving the original and the backup together.",
    "c2_branch_records_b": "Knowing people’s words vanish before records do, you secure the statements first.",
    "c2_branch_records_c": "Folding away your doubt, you mark it a technical error and go ahead with the report.",
    "c2_branch_records_follow_a": "So the person who gave a statement owns their own words, you grant the right to check the original text.",
    "c2_branch_records_follow_b": "So no one has to trust the conclusion alone, you attach the original and open outside review.",
    "c2_branch_records_follow_c": "Stripping away everything complicated, you leave only the conclusion in the report.",
    "c2_route_report_hold": "You slip a hold into the disciplinary notice so the procedure can’t run ahead of the person.",
    "c2_route_report_sign": "You send the report up, but leave the chance of rebuttal in a small footnote.",
    "c2_route_report_reopen": "You start over by tracing why the report was finished so fast.",
    "c2_route_person_record": "Since informal contact can be a breach in itself, you make an official record where Lee Minseo can speak for herself.",
    "c2_route_person_shield": "To cut the risk, you submit Lee Minseo’s words under your own name.",
    "c2_route_person_trade": "Since Lee Minseo recognized some lines of the leaked file, you offer protection and ask for the file’s source first.",
    "c2_route_origin_freeze": "With the checksums differing, neither side can be touched, so you freeze both the original and the backup and disclose the difference.",
    "c2_route_origin_token": "You chase the owner of the admin rights used right after the gap.",
    "c2_route_origin_patch": "Saying one 11-second gap can’t delay the report, you patch the gap as an error and meet the deadline.",
    "c2_route_system_copy": "You keep the copied choice wording as evidence and change the subject of the case.",
    "c2_route_system_warn": "Since the last case’s choice wording matched the leaked file, you warn the next participant of a possible experiment first.",
    "c2_route_system_hide": "Since an experiment is still only a possibility, you hide its trace and solve only Lee Minseo’s case.",
    "c2_final_evidence_stop": "So a procedure that started wrong doesn’t punish the person first, you make rebuttal rights and source verification public conditions before discipline.",
    "c2_final_evidence_file": "Since a hold would break the deadline, you file the Phase 1 report but register the procedure flaw as a separate case.",
    "c2_final_evidence_close": "Saying the disciplinary process is already moving and too late to stop, you close it per Oh Jinwoo’s draft and leave blame to a later audit.",
    "c2_final_person_voice": "You let Lee Minseo choose for herself how much of her statement is disclosed.",
    "c2_final_person_proxy": "To keep her name hidden, you give the statement in her place.",
    "c2_final_person_release": "Saying her words carry no weight while she is hidden, you lift protection and let her prove herself in the official probe.",
    "c2_final_system_expose": "Instead of one person’s guilt, you put the possibility of an experiment design on the record as an official finding.",
    "c2_final_system_trace": "Unable to close while no one knows whose admin token it is, you hold every conclusion until the real name is confirmed.",
    "c2_final_system_contain": "Knowing disclosure would shake the whole experiment, you seal its trace and report only a lowered charge against Lee Minseo.",
    "c2_evidence_turn_guard": "Saying the person who will speak must be able to see her own record first, you restore her access.",
    "c2_evidence_turn_stamp": "You bundle the proof that the file was made after it was sent and send it outside as it is.",
    "c2_evidence_turn_delay": "So the words don’t go out ahead of the record, you finish the restoration first.",
    "c2_route_report_evidence_turn": "Setting the leaked file’s creation time against the transfer time, you ask again whether this was really one person’s doing.",
    "c2_route_person_evidence_turn": "Setting the leaked file’s creation time against the transfer time, you ask again whether this was really one person’s doing.",
    "c2_route_origin_evidence_turn": "Setting the leaked file’s creation time against the transfer time, you ask again whether this was really one person’s doing.",
    "c2_route_system_evidence_turn": "Setting the leaked file’s creation time against the transfer time, you ask again whether this was really one person’s doing.",
    "c2_start_people_report": "You put people first last time, so this time, you say, you will lead with the record.",
    "c2_start_people_meet": "Saying you will be the one who meets people first again, you contact Lee Minseo first.",
    "c2_start_people_verify": "To prove the protection wasn’t feeling, you reopen the original log first.",
    "c2_start_records_report": "The case began with numbers you published, so, you say, you will end it with the record.",
    "c2_start_records_meet": "Saying some things numbers alone can’t tell you, you meet Lee Minseo first.",
    "c2_start_records_verify": "You first check whether the material you released became raw material for tampering.",
    "c2_start_silence_report": "Saying you won’t be late this time, you file the report first with what you have.",
    "c2_start_silence_meet": "Saying this happened because you kept quiet, you go to the person involved first this time.",
    "c2_start_silence_verify": "You check the original first for whether the terms you hid are in the leaked file.",
    "c2_start_people_signature": "Before procedure, you call the person who asked for just 5 minutes.",
    "c2_start_records_signature": "You trace backward from where your published numbers went wrong.",
    "c2_start_silence_signature": "Before the leaked document can speak, you bring out the terms you swallowed last time in your own words."
  },
  "pack": {
    "clue": {
      "title": "Times That Don’t Match",
      "text": "The times in the leak record don’t agree. The person who made the record may matter more than the culprit."
    },
    "outcomes": {
      "c2_after_audit": {
        "tag": "Record restored",
        "title": "The Missing 11 Seconds Became Evidence",
        "text": "You didn’t name a culprit right away; you rebuilt the trail of the record. The truth came slower, but you didn’t fix anyone’s name in place too soon."
      },
      "c2_after_person": {
        "tag": "Met the person",
        "title": "Protection Left the Right to Be Doubted",
        "text": "Lee Minseo got to speak for herself, and the case grew more complicated. In return, the next judgment will find it harder to erase a person’s context."
      },
      "c2_after_public": {
        "tag": "Went public at once",
        "title": "The Alarm Spread Faster Than the Case",
        "text": "Outside eyes began to watch the case. Responsibility became clear, but unconfirmed facts spread along with it."
      }
    },
    "continuityChallenges": {
      "c1_after_people": {
        "title": "Put Protection on Record",
        "text": "Look at the person first, as in the last case, but this time record the grounds for protection too, and a hidden clue may open."
      },
      "c1_after_numbers": {
        "title": "Find the People Behind the Numbers",
        "text": "Find whom the numbers you published shifted a burden onto, and what burden, and a hidden clue may open."
      },
      "c1_after_silence": {
        "title": "Recover the Late Explanation",
        "text": "A choice that restores the fairness shaken by your silence in the last case lowers the next pressure."
      }
    }
  }
};
