/**
 * 사건 05 (src/nodes/case05.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c5_start": {
      "text": "The recovery control room of the city care-dispatch system. On the wall map, 312 red dots. Each one is a home that missed its scheduled care visit yesterday. It has been 18 hours since the incident, and reporters own the control-room phones. Everyone asks for the name of the person responsible. Yet the first data says everyone followed the rules. Field staff worked by the manual, and the system ran on approved criteria. Ban Jaewook opens his notebook. 'I followed the rules up the chain. At the top there’s no person, only a budget cap, and that cap came straight down from Onsae’s repayment terms sheet.' He draws a line in the notebook. It is where a name should go. It is blank.",
      "memo": [
        "Missed service: 312 people",
        "Field staff worked by the manual",
        "Dispatch system ran on approved criteria",
        "Source of the budget cap: Onsae’s repayment terms sheet"
      ],
      "choices": {
        "c5_start_map": {
          "label": "Trace the decision flow back from the 312 dots"
        },
        "c5_start_blame": {
          "label": "Write the operations head’s name in Ban’s blank line"
        },
        "c5_start_redesign": {
          "label": "Start dispatching by hand with the control-room staff"
        },
        "reframe": {
          "label": "Ask first who was pushed back first"
        }
      },
      "place": "Care Dispatch Recovery Control Room",
      "clock": "Incident +18h",
      "question": "312 people missed service and everyone followed the rules. Will you name someone responsible, or map the flow?",
      "lead": "You leave Onsae for the recovery control room of the city care-dispatch system. The press wants a name, but the first data shows no one broke a rule. Follow the rules up and, at the top, there is a budget cap instead of a person."
    },
    "c5_map": {
      "title": "Reasonable Pieces",
      "text": "On the system map, ECHO lays the decisions of three departments onto one sheet. The budget team kept to the cap. The operations team followed the priority rules. The dispatch system applied the approved weights as written. Each piece is clean. The problem is the shape they make together. Where they overlap, 312 people drop out. They are people pushed back a little by several criteria at once. ECHO opens the approval history of the weighting table. Drafted, reviewed, approved. The final reviewer field holds one name, and next to it, the time the review took. 6 minutes. The name is Oh Jinwoo.",
      "memo": [
        "Budget team: kept to the cost cap",
        "Operations team: followed the priority rules",
        "System: applied the approved weights",
        "Final reviewer of the weighting table: Oh Jinwoo (review time 6 minutes)"
      ],
      "choices": {
        "c5_map_blame": {
          "label": "Call in the ops manager who missed the warning signs"
        },
        "c5_map_redesign": {
          "label": "Raise the table’s protection value for the missed, for now"
        },
        "c5_map_map": {
          "label": "Find what the 312 pushed off ECHO’s map share"
        },
        "reframe": {
          "label": "Reframe the table and propose"
        }
      },
      "place": "Care Dispatch Recovery Control Room · System map",
      "clock": "Incident +22h",
      "question": "Every department was reasonable, and only the sum was wrong. Where will you start?",
      "lead": "When the budget, operations and algorithm decisions are drawn on one sheet, you can see the missed are people pushed back a little by several criteria at once."
    },
    "c5_blame": {
      "title": "Someone Has to Answer",
      "text": "Reporters line the hallway outside the briefing room, and the victims’ group has issued a statement demanding an apology and compensation now. Oh Jinwoo switches off the podium mic and speaks. 'We still need a name. From outside, “it was the structure” sounds like an excuse, and if no one is held responsible, the whole organization shakes.' He isn’t wrong. Discipline one manager and public anger will settle fast. He pauses, then adds. 'The weighting table that sets the dispatch order. I passed it after 6 minutes. My review limit back then was 6 minutes. I don’t know who set it either.' Having said it, he still doesn’t step down from the podium.",
      "memo": [
        "Press demands the real name of the person responsible",
        "Victims’ group demands an immediate apology and compensation",
        "Disciplining one manager would likely settle public anger fast",
        "Oh Jinwoo did not set his own review time limit"
      ],
      "choices": {
        "c5_blame_redesign": {
          "label": "Bind discipline, compensation and reform into one statement with Oh"
        },
        "c5_blame_blame": {
          "label": "Announce discipline and compensation from the podium"
        },
        "c5_blame_map": {
          "label": "Turn on the mic and read out the structural failure report"
        },
        "reframe": {
          "label": "Ask first who was pushed back first"
        }
      },
      "place": "Care Dispatch Recovery Control Room · Briefing room",
      "clock": "Incident +26h",
      "question": "“No villain” sounds like an excuse to the public. Will you name someone responsible, or announce the structure?",
      "lead": "The press wants a real name. The victims’ group wants an apology and compensation now. Oh Jinwoo isn’t wrong."
    },
    "c5_collapse": {
      "title": "Failure with Good Intentions",
      "text": "In the field records room, Do Yoonha spreads the visit records of the 312 missed people across the table. Page after page looks alike. They almost never complained. Their family contacts changed often or went dead. Their past usage records are thin. The system read these 'quiet people' as not urgent and pushed them down the queue. People who don’t ask were counted as people who need less. Do Yoonha points to one line on the list. 'This person was on FlowOn’s night shift. Let go last year, and this year they became a care recipient.' Six more lines share the same history. Do Yoonha straightens the pages. 'It was probably a well-meant order. The urgent first. But people who can’t say they’re urgent weren’t in that order at all.'",
      "memo": [
        "Low complaint frequency",
        "Unstable family contacts",
        "Thin past usage records",
        "7 former FlowOn workers on the missed list"
      ],
      "choices": {
        "c5_collapse_redesign": {
          "label": "Tilt the weights back toward the quiet 312"
        },
        "c5_collapse_map": {
          "label": "Rebuild the indicators with Do around the missed 312"
        },
        "c5_collapse_blame": {
          "label": "Leave the records room and order a new manager and retraining"
        },
        "reframe": {
          "label": "Change the game one last time"
        }
      },
      "place": "Care Dispatch Recovery Control Room · Field records room",
      "clock": "Incident +30h",
      "question": "The system pushed the 'quiet people' down to low priority. How will you change these weights?",
      "lead": "Do Yoonha spreads out the field records. The missed complained little, had unstable contacts and thin usage records."
    },
    "c5_aftershock": {
      "title": "A Failure No One Signed",
      "text": "The day after the announcement, the cause meeting in the room next to the control room ends after three hours. The signature block on the last page of the minutes has seven boxes. All are empty. Each team’s decision was right by the standards of the time, so no one will take the blame alone. The record that first reported the harm was deleted and never came back. Do Yoonha waits for you in the hallway outside. A glance points you to an empty desk by the window. No belongings, only a nameplate. Reviewer Oh Jinwoo. The person who last reviewed and passed the dispatch weighting table. 'It was like this when I came in this morning. He left without a word.' Do Yoonha sets the nameplate upright. 'Of everyone who didn’t sign, he’s the only one who cleared his desk.'",
      "memo": [
        "Each team’s decision was reasonable by the standards of the time",
        "The record that first reported the harm was deleted",
        "Splitting the responsibility may slow the fixes"
      ],
      "choices": {
        "c5_after_system": {
          "label": "Redesign the structure to stop repeats, not blame people"
        },
        "c5_after_owner": {
          "label": "Own your decisions first and take on the fixes"
        },
        "c5_after_name": {
          "label": "Name the one who erred most as officially responsible"
        }
      },
      "place": "Care Dispatch Recovery Control Room",
      "clock": "The day after the announcement",
      "question": "No one took sole responsibility. Will you start by owning your own decisions?",
      "lead": "The cause meeting is over, but no one signed. Outside the room, one desk is left by someone who quietly walked away."
    },
    "c5_pattern": {
      "title": "The Path the Failure Took",
      "text": "Incident hour 24. Ban Jaewook traces the arrows on the glass wall one by one with his finger. None of them meet at one person. The budget team’s line passes through operations, operations’ line passes through the system, and all of them pass through each other’s plausible decisions to land in the same place. 312 red dots. He reads three things from his notebook. No team could see another team’s data. The record that first called it dangerous dropped out somewhere. The responsibility chart holds only the names of the approvers. 'Everyone guarded their own box. No one watched the space between the boxes.'",
      "memo": [
        "No team could see another team’s information",
        "The record that first raised the risk went missing",
        "Only approvers remain on the responsibility chart"
      ],
      "choices": {
        "c5_pattern_choice_1": {
          "label": "Fix the points where information was blocked first"
        },
        "c5_pattern_choice_2": {
          "label": "Concentrate responsibility on the approvers"
        },
        "c5_pattern_choice_3": {
          "label": "Compensate the hardest-hit departments first"
        }
      },
      "place": "Care Dispatch Recovery Control Room · System map",
      "clock": "Incident +24h",
      "question": "The arrows don’t meet at one person. Will you fix the points where information was blocked first?"
    },
    "c5_voice": {
      "title": "Testimony Without a Name",
      "text": "Outside the briefing room door, by the vending machine, a person stands waiting. A clerk from the dispatch intake desk. No decision-making power. Not a seat that presses the approve button. But this is someone who looks at the queue every day, and says they were the first to see the same homes pushed back again and again. They told their superiors, but it never made the record. Do Yoonha stands beside them and picks the words for them. 'If they speak, the whole intake team gets investigated. So they can’t give their name.' The clerk lowers their head. 'The people who were hurt don’t ask who did wrong. They ask if tomorrow’s visit is coming. I’m the one who takes those calls.'",
      "memo": [
        "The witness is missing from the records",
        "Speaking up could get the whole team investigated",
        "Victims want recovery more than a name"
      ],
      "choices": {
        "c5_voice_choice_1": {
          "label": "Protect the witness and restore the records"
        },
        "c5_voice_choice_3": {
          "label": "Draft compensation and delay the investigation"
        },
        "c5_voice_choice_2": {
          "label": "Announce the official responsible party first"
        },
        "c5_voice_choice_4": {
          "label": "Guarantee the witness’s job on your own authority"
        }
      },
      "place": "Care Dispatch Recovery Control Room · Outside the briefing room",
      "clock": "Incident +28h",
      "question": "Someone without decision power says they saw the failure first. Will you protect them?"
    },
    "c5_verdict": {
      "title": "The Shape of Responsibility",
      "text": "Incident hour 32. Three draft statements lie on the center table of the control room. Han Seoyun touches each one. The first names a person. The second promises to fix the structure. The third promises to undo the harm first. 'Those are the three ways to explain a failure. None of them is free.' The budget for fixes is fixed, so you can’t do all three. The reporters in the hallway wait for a statement of responsibility. The field dispatch desk is holding on by hand, and a formal recovery team can be formed the moment you say the word. Han Seoyun fans the three drafts out in her hand. 'A statement is all in its first sentence. What you open with tells everyone what this organization looks at first.'",
      "memo": [
        "Budget for fixes is limited",
        "Press waiting for a statement of responsibility",
        "A recovery team can launch immediately"
      ],
      "choices": {
        "c5_verdict_choice_3": {
          "label": "Start recovery for the harmed before anything else"
        },
        "c5_verdict_choice_2": {
          "label": "Invest in a structure that stops repeats"
        },
        "c5_verdict_choice_1": {
          "label": "Disclose your own decisions first"
        }
      },
      "place": "Care Dispatch Recovery Control Room",
      "clock": "Incident +32h",
      "question": "Naming, reform, recovery: none of them is free. What will be the first sentence of the statement?"
    },
    "c5_pattern_reaction": {
      "title": "Arrows in Reverse",
      "text": "ECHO flips the direction of the map. The arrows that ran from decision to harm now run back from harm to decision. The arrowheads point somewhere unexpected. At the missed people themselves. Unreachable. No complaint history. Thin usage records. The system’s classification table has written down the reason people were pushed back as traits of the people pushed back. ECHO posts a line. 'In this classification, the reason for not receiving help lies with the person who didn’t receive it. Someone built this classification, and it has kept the failure from looking like a failure. Leave it as it is, and the next misses will be filed in the same box.'",
      "memo": [
        "Where the responsibility arrows point",
        "Voices to hear again outside the classification"
      ],
      "choices": {
        "c5_pattern_reaction_choice_2": {
          "label": "Investigate only the biggest approver"
        },
        "c5_pattern_reaction_choice_3": {
          "label": "Keep the current map and patch it"
        },
        "c5_pattern_reaction_choice_1": {
          "label": "Scrap the classification and listen again"
        }
      },
      "place": "Care Dispatch Recovery Control Room · System map",
      "clock": "Incident +25h",
      "question": "Flip the map and the responsibility arrows point at the victims. Will you scrap this classification?"
    },
    "c5_voice_reaction": {
      "title": "Conditions for Speaking",
      "text": "At the end of the hallway, Han Seoyun scrolls through the intake clerk’s HR record on a tablet. Contract type, team, evaluator’s name. She turns off the screen. 'This person is ready to talk. The problem is what comes after. The one who evaluates them is on the side being investigated, so staying on that team isn’t safe.' She leans against the wall. 'Move them and they’re safe. But then everyone watches the person who told the truth leave the team. The next one who sees something will keep quiet. We’d gain one truth and lose an organization.' From the briefing room comes the sound of someone testing the mic.",
      "memo": [
        "Safety conditions that make testimony possible",
        "The right to speak without leaving the organization"
      ],
      "choices": {
        "c5_voice_reaction_choice_1": {
          "label": "Protect them so they can speak without leaving"
        },
        "c5_voice_reaction_choice_3": {
          "label": "Hold the testimony to protect the organization"
        },
        "c5_voice_reaction_choice_2": {
          "label": "Reorganize right after the testimony"
        }
      },
      "place": "Care Dispatch Recovery Control Room · Hallway",
      "clock": "Incident +29h",
      "question": "The witness is safe only if they leave the team. Will you create conditions to speak without leaving?"
    },
    "c5_verdict_reaction": {
      "title": "The Day After Responsibility",
      "text": "The draft statement was rewritten three times overnight. The next morning, red dots remain on the control-room map. Many went out during the night, but new ones lit up for homes that missed last night’s visits. Do Yoonha comes in after a night in the field. The vest smells of rain. 'We spent all night writing whose fault it was, and out in the field nobody asks that.' Do Yoonha holds out a list. Homes that must be reached today. 'What we undo first matters more now than who we name. We need someone to set the order.'",
      "memo": [
        "Harm that remains after the night",
        "Someone to set the recovery order"
      ],
      "choices": {
        "c5_verdict_reaction_choice_1": {
          "label": "Make recovery the statement’s first sentence"
        },
        "c5_verdict_reaction_choice_2": {
          "label": "Get the responsible party’s apology first"
        },
        "c5_verdict_reaction_choice_3": {
          "label": "Stay silent until the fix plan is complete"
        }
      },
      "place": "Care Dispatch Recovery Control Room",
      "clock": "Incident +40h · The next morning",
      "question": "The statement was rewritten all night, and the harm is still there. What will you undo first?"
    },
    "c5_branch_owner": {
      "title": "Choosing the Subject of the Failure",
      "text": "In the approvals records room, Han Seoyun has laid out, in date order, the approval documents that shaped the dispatch criteria into what they are now. Fourteen sheets. Each one is a small concession. Cutting confirmation calls from two to one. Moving unreachable homes to the back. Setting the review time at 6 minutes. Each sheet has an approver’s name, and every name is different. Han Seoyun rests her hand on the last sheet. 'On the day it fails, you see people. Who pressed that button. But lay out all 14 sheets and there’s no subject.' She looks at you. 'A statement needs a subject before it can be written. Who it will be, that’s what you decide now.'",
      "memo": [
        "Approval by decision-makers",
        "Missing safeguards",
        "Order for undoing the harm"
      ],
      "choices": {
        "c5_branch_owner_b": {
          "label": "Restore the missing safeguards"
        },
        "c5_branch_owner_c": {
          "label": "Close the failure as one person’s fault"
        },
        "c5_branch_owner_a": {
          "label": "Disclose what you decided at Onsae first"
        }
      },
      "place": "Care Dispatch Recovery Control Room · Approvals records room",
      "clock": "Incident +27h",
      "question": "The failure shows people, but small concessions built the structure. Who will be the subject of the failure?"
    },
    "c5_branch_owner_follow": {
      "title": "The Name That Outlasts Recovery",
      "text": "Incident hour 31. Recovery has begun and the red dots are shrinking. The 14 documents from the approvals records room are still on the table. ECHO posts to the terminal. 'Once recovery is under way, people try to forget names. But names do not disappear from records.' Three blank fields appear on the screen. Who received recovery. Who owns preventing a repeat. How much responsibility to disclose outside. 'Use a name only as punishment, and one person leaves and it ends. Use a name as a post to hold, and when the next miss happens, it remains clear whom to ask. You can decide now which way to write it.'",
      "memo": [
        "People recovered",
        "Owner of recurrence prevention",
        "Scope of responsibility to disclose"
      ],
      "choices": {
        "c5_branch_owner_follow_b": {
          "label": "Lock a budget into recurrence safeguards"
        },
        "c5_branch_owner_follow_c": {
          "label": "Issue only an apology and close it"
        },
        "c5_branch_owner_follow_a": {
          "label": "Record those recovered and the responsible together"
        }
      },
      "place": "Care Dispatch Recovery Control Room · Approvals records room",
      "clock": "Incident +31h",
      "question": "One name remains even after recovery. How will you handle it?"
    },
    "c5_route_blame": {
      "title": "A Failure Where the Name Came First",
      "text": "The briefing room. Press response copy is up on the screen behind the podium. The moment word went out that the operations head would be identified and investigated, PR started writing, and a candidate’s real name is already penciled in beside the blank. Oh Jinwoo skims the copy beside the podium. 'Faster, right? Once there’s a name, the stories settle, and once the stories settle, the calls drop.' He points to a corner of the screen. The analysis window that was breaking down who the 312 missed people are is closed. 'But that stopped. The moment one name stands up, every empty box in the system gets filed as that person’s fault.'",
      "memo": [
        "Real name of a candidate secured",
        "Press response copy drafted",
        "Analysis of the missed distribution halted"
      ],
      "choices": {
        "c5_route_blame_compensate": {
          "label": "Announce the responsible party and compensation together"
        },
        "c5_route_blame_reopen": {
          "label": "Withhold the name and reopen the approval path"
        },
        "c5_route_blame_single": {
          "label": "Close the case fast as one person’s fault"
        },
        "c5_route_blame_evidence_turn": {
          "label": "Restore the queue places of victims pushed off the map"
        }
      },
      "place": "Care Dispatch Recovery Control Room · Briefing room",
      "clock": "Incident +20h",
      "question": "In this failure the name came first. Will you close the case with that name?",
      "lead": "You have just said the operations head will be identified and investigated. The name goes out before the investigation does."
    },
    "c5_final_blame_route": {
      "title": "A Door Closed by a Name",
      "text": "Just before the official statement. The statement lies on the briefing-room podium. The first line has room for one name. Oh Jinwoo stands beside the podium counting the cameras in the seats. 'Put a name in and tonight’s news is three lines. The explanation goes faster, the phones stop, everyone goes home.' He turns to the second page. The recurrence prevention section has a heading and nothing else. 'There isn’t one line yet about stopping the next miss. Close the door with a name and this blank stays right behind it.' He doesn’t bring up the weighting table again. He turns the statement toward you and waits.",
      "memo": [
        "Public opinion could settle quickly",
        "Victims want compensation now",
        "The system’s structure is still unchanged"
      ],
      "choices": {
        "c5_final_blame_route_b": {
          "label": "End on one person’s fault and drop the structural probe"
        },
        "c5_final_blame_route_a": {
          "label": "Set the name and a prevention budget the same day"
        },
        "c5_final_blame_route_c": {
          "label": "Withhold naming and open the whole approval path to public review"
        }
      },
      "place": "Care Dispatch Recovery Control Room",
      "clock": "Just before the official statement",
      "question": "You can close the door with a name. Will you close it that way?"
    },
    "c5_route_map": {
      "title": "The Structure the Arrows Point To",
      "text": "On a glass wall in the control room, you draw arrows with Ban Jaewook. The budget team sets the cap. The operations team writes priority rules inside it. The dispatch system ranks by those rules. The arrows pass 20, and not one of them is wrong on its own. Budget, operations, calculation rules. Three decisions stacked at once, and the 312 were pushed back a little at each criterion. Ban Jaewook caps his marker. 'I drew this to find a culprit, and no culprit comes out.' He steps back from the glass. 'Then the question changes. Where do we stop responsibility from scattering like this?'",
      "memo": [
        "Budget, operations and algorithm decisions acted at once",
        "Each decision was reasonable on its own",
        "Victims were pushed back a little at each criterion"
      ],
      "choices": {
        "c5_route_map_delay": {
          "label": "Keep the map internal and handle compensation first"
        },
        "c5_route_map_owner": {
          "label": "Attach a decision-maker to every arrow"
        },
        "c5_route_map_publish": {
          "label": "Publish the failure map as it is"
        },
        "c5_route_map_evidence_turn": {
          "label": "Restore the queue places of victims pushed off the map"
        }
      },
      "place": "Care Dispatch Recovery Control Room · System map",
      "clock": "Incident +20h",
      "question": "The arrows point at the structure. How much of it will you disclose?",
      "lead": "You have just said you will map the whole decision flow that produced the misses."
    },
    "c5_final_map_route": {
      "title": "How Responsibility Scatters",
      "text": "Just before the official statement. The arrow map is still on the control room’s glass wall, unerased. Ban Jaewook stands in front of it holding the draft statement. The responsibility field in the draft is empty. 'By this picture, no one is guilty alone. That’s true.' He folds the draft. 'But announce it like that and it means no one is responsible. For the 312, that’s the worst conclusion.' Release the whole map and the entire organization shakes. Attach a decision-maker to each arrow and the pushback comes. Put compensation first and fixing the structure slips. In the hallway, reporters are setting up their mics.",
      "memo": [
        "A public map shakes the whole organization",
        "Mapping decision-makers invites pushback",
        "Compensation first delays structural fixes"
      ],
      "choices": {
        "c5_final_map_route_c": {
          "label": "Hand the structural failure report to outside review as is"
        },
        "c5_final_map_route_b": {
          "label": "Keep the map internal and announce compensation first"
        },
        "c5_final_map_route_a": {
          "label": "Publish each arrow with its decision-maker and compensation duty"
        }
      },
      "place": "Care Dispatch Recovery Control Room",
      "clock": "Just before the official statement",
      "question": "Responsibility scatters. How will you record the scattering?"
    },
    "c5_route_redesign": {
      "title": "Fix First, Ask Who Later",
      "text": "The field dispatch desk. Eight phones ring at once. Since the switch to temporary manual dispatch, people read the lists themselves and send out caregivers. The red dots on the wall map go out one by one. About a dozen homes an hour. Do Yoonha, headset over one ear, rewrites the dispatch chart on the whiteboard by hand. 'We’re reaching them. But look at this.' Do Yoonha points to the system screen. The new hand-entered dispatches are being written straight over yesterday’s records. 'The system is changing before we’ve even written down what went wrong. The more we fix, the less we can see where it broke.' The dispatch staff are already hoarse.",
      "memo": [
        "Manual dispatch recovered part of the harm",
        "Risk of cause logs being overwritten by new work",
        "Field fatigue rising sharply"
      ],
      "choices": {
        "c5_route_redesign_rule": {
          "label": "Turn the manual dispatch conditions into a new protection rule"
        },
        "c5_route_redesign_continue": {
          "label": "Put recovery speed ahead of cause records"
        },
        "c5_route_redesign_snapshot": {
          "label": "Snapshot the pre-fix state as evidence"
        },
        "c5_route_redesign_evidence_turn": {
          "label": "Restore the queue places of victims pushed off the map"
        }
      },
      "place": "Care Dispatch Recovery Control Room · Field dispatch desk",
      "clock": "Incident +20h",
      "question": "Fixing first erased the evidence. Which comes first, recovery or investigation?",
      "lead": "You have just started dispatching by hand. People were reached first, and the records were overwritten."
    },
    "c5_final_redesign_route": {
      "title": "Evidence Erased by Recovery",
      "text": "Just before the official statement. The red dots on the control-room map are down to 20 or so. Manual dispatch actually worked. Do Yoonha brings up the system screen. Where the dispatch records from the time of the incident used to be, there are now the records entered during recovery. 'The harm went down. But the records that showed why it happened changed too. There’s not much left that shows what it looked like at the time.' The dispatch staff haven’t been home in two days. If people keep going at this pace, the next mistake will come from the people. Do Yoonha takes off the headset. 'Keep fixing, or stop for a moment and preserve. We need to set the order before the statement.'",
      "memo": [
        "Recovery is actually working",
        "Evidence of the cause may disappear",
        "Field fatigue may cause the next failure"
      ],
      "choices": {
        "c5_final_redesign_route_b": {
          "label": "Keep recovering and push cause records to the next task"
        },
        "c5_final_redesign_route_a": {
          "label": "Publish the pre-fix snapshot with a new protection rule"
        },
        "c5_final_redesign_route_c": {
          "label": "Pause recovery and preserve the cause logs first"
        }
      },
      "place": "Care Dispatch Recovery Control Room",
      "clock": "Just before the official statement",
      "question": "Recovery erased the evidence. What will you preserve?"
    },
    "c5_route_system": {
      "title": "The Device That Ranks the Quiet Low",
      "text": "You ask first who was pushed back first. The control-room map pauses. Beside it, a file opens. The design file for the algorithm that sets the dispatch order. Beneath the visible criteria are hidden weights. Homes that complained often move up the queue. Homes that never complained move down. Homes whose family contacts change often get grouped as 'hard to verify' and move down further. ECHO posts a line. 'This system learned that people who cannot loudly ask for help are less urgent. No single person taught it that. Quiet people were underrepresented in its training data from the start, and small approvals were stacked on top, one sheet at a time.'",
      "memo": [
        "Complaint frequency works in reverse on the protection weight",
        "Unstable family contacts treated as low reliability",
        "Quiet victims missing from model training"
      ],
      "choices": {
        "c5_route_system_patch": {
          "label": "Leave the weights and hand-fix only this dispatch"
        },
        "c5_route_system_audit": {
          "label": "Open the data the weights learned from first"
        },
        "c5_route_system_call": {
          "label": "Call the missed people first and ask about the criteria"
        },
        "c5_route_system_evidence_turn": {
          "label": "Restore the queue places of victims pushed off the map"
        }
      },
      "place": "Care Dispatch Recovery Control Room · System map",
      "clock": "Incident +20h",
      "question": "A device that ranks quiet people low has surfaced. How will you deal with it?",
      "lead": "Before choosing a recovery plan, you reframe the table, and the design file for the weights opens with it."
    },
    "c5_final_system_route": {
      "title": "The Values That Push the Quiet Back",
      "text": "The control-room screen before the official statement. The weighting table is still open. Complaint count, reachability, usage records. Three rows of numbers set the queue places of the 312. Of the 312 who missed service, not one was pushed back because someone broke a rule. All of them were pushed back by this table. In the hallway, reporters demand the real name of the person responsible. ECHO’s text appears below the table. 'What the press is waiting for is a name. What pushed the 312 back was not a name. It was numbers.' The bottom row of the table, where it says who can change these numbers next, is blank.",
      "memo": [
        "312 missed -- the fewer complaints, the further back",
        "The dispatch system ran on approved criteria",
        "Just before the official statement, press demands a real name"
      ],
      "choices": {
        "c5_final_system_route_c": {
          "label": "First disclose the missing-victim records in the training data"
        },
        "c5_final_system_route_b": {
          "label": "Hide the weights and keep correcting by hand"
        },
        "c5_final_system_route_a": {
          "label": "Make protection weights for the quiet a public standard"
        }
      },
      "place": "Care Dispatch Recovery Control Room",
      "clock": "Just before the official statement",
      "question": "The weight design was the responsibility. Who will you hand this design to?"
    },
    "c5_evidence_turn": {
      "title": "The Priority of the Vanished",
      "text": "You lay the clue you’ve been holding over the system map, and the queue places of the pushed-back people light up again. They weren’t pushed back once on the day of the incident. The same homes slipped back a little with every dispatch over the past few months. One place for having no complaints, one place for being unreachable. They slid down the queue until one day they fell off it. Han Seoyun steps toward the map. 'We were looking for someone responsible, but seeing this, the question changes. Not who did wrong, but how these people vanished inside the system.' The faster recovery goes, the more these queue records get written over by new dispatches.",
      "memo": [
        "Missing victims began with the complaint-frequency weight",
        "The faster the recovery, the more cause logs may vanish",
        "The same rule may have been used in Trigger Lab’s experiment data"
      ],
      "choices": {
        "c5_evidence_turn_archive": {
          "label": "Preserve the cause logs before recovery"
        },
        "c5_evidence_turn_close": {
          "label": "Finish compensation first and delay disclosing the rule"
        },
        "c5_evidence_turn_weight": {
          "label": "Raise the quiet-victim weight to a public rule"
        }
      },
      "place": "Care Dispatch Recovery Control Room · System map",
      "clock": "Incident +21h",
      "question": "The vanished victims’ priority has been restored. Will you apply this standard across the board?"
    },
    "c5_start_rule": {
      "title": "The Day Everyone Kept the New Standard",
      "text": "The care dispatch recovery control room. On the wall map, 312 red dots. Each one is a home that missed its scheduled care visit yesterday. 18 hours since the incident, and the press wants a name. Do Yoonha opens the operations rulebook. On the first page, the exception conditions you made public at Onsae appear under the name 'new standard'. 'Everyone kept to this. To use an exception, you file the reason, disclose it, get it confirmed. Nobody skipped a step.' Do Yoonha looks at the map. 'And still 312 homes were missed. Nobody broke a rule. Follow the rules up and there’s a budget cap at the top, and they say it came down from Onsae’s loan repayment terms sheet.'",
      "memo": [
        "The new standard was kept without a single lapse",
        "Damage reports came in late",
        "The person in charge blames the rules"
      ],
      "choices": {
        "c5_start_rule_map": {
          "label": "Trace the decision flow back from the 312 dots"
        },
        "c5_start_rule_signature": {
          "label": "First check whether your own standard left those homes out"
        },
        "c5_start_rule_redesign": {
          "label": "Start dispatching by hand with the control-room staff"
        },
        "c5_start_rule_blame": {
          "label": "Write the operations head’s name in Ban’s blank line"
        },
        "c5_start_rule_reframe": {
          "label": "Ask first who was pushed back first"
        }
      },
      "place": "Care Dispatch Recovery Control Room",
      "clock": "Incident +18h",
      "question": "Everyone kept the public standard you set, and the system still broke down. Will you doubt the standard, or its execution?",
      "lead": "You leave Onsae for the recovery control room of the city care-dispatch system. Here, the standard you made is already an operating rule."
    },
    "c5_start_service": {
      "title": "The Shadow of the Service You Saved",
      "text": "The care dispatch recovery control room. On the wall map, 312 red dots. Each one is a home that missed its scheduled care visit yesterday. 18 hours since the incident, and the press wants a name. Ban Jaewook holds an audit request instead of his notebook. 'Through the exception door opened at Onsae, 11 agencies came in. Each read the criteria a little differently, and now nobody knows which criteria are the real ones.' He stands in front of the map. 'The dispatch system ran on approved criteria. The field worked by the manual. Nobody broke a rule. At the top, instead of a person, there’s a budget cap, and it came down from Onsae’s loan repayment terms sheet. The failure reached people before it reached the rules.'",
      "memo": [
        "More agencies demanding exceptions",
        "An audit request has arrived",
        "A field employee kept internal records"
      ],
      "choices": {
        "c5_start_service_signature": {
          "label": "Open the list of who the saved service left out"
        },
        "c5_start_service_redesign": {
          "label": "Start dispatching by hand with the control-room staff"
        },
        "c5_start_service_blame": {
          "label": "Write the operations head’s name in Ban’s blank line"
        },
        "c5_start_service_map": {
          "label": "Trace the decision flow back from the 312 dots"
        },
        "c5_start_service_reframe": {
          "label": "Ask first who was pushed back first"
        }
      },
      "place": "Care Dispatch Recovery Control Room",
      "clock": "Incident +18h",
      "question": "The exceptions that saved the service keep repeating, and no one trusts the criteria. What will you restore first?",
      "lead": "You leave Onsae for the recovery control room of the city care-dispatch system. The repeated exceptions have followed you here."
    },
    "c5_start_stop": {
      "title": "The Gap After the Stop",
      "text": "The care dispatch recovery control room. On the wall map, 312 red dots. Each one is a home that missed its scheduled care visit yesterday. 18 hours since the incident, and the press wants a name. ECHO’s text appears on the control-room terminal. 'At Onsae, you decided to accept no exceptions until the audit was over, Analyst. The standard held. The requests that went unanswered while things were stopped are part of this map.' The dots on the map make no sound. These are homes that almost never called with complaints or posted protests. 'The dispatch system ran on approved criteria, and no one broke a rule. At the top of the rules is a budget cap, and that cap came down from Onsae’s loan repayment terms sheet.'",
      "memo": [
        "Recovery costs are rising",
        "Audit data is incomplete",
        "Someone is looking for whoever approved the stop"
      ],
      "choices": {
        "c5_start_stop_redesign": {
          "label": "Start dispatching by hand with the control-room staff"
        },
        "c5_start_stop_blame": {
          "label": "Write the operations head’s name in Ban’s blank line"
        },
        "c5_start_stop_signature": {
          "label": "Put the stop period’s quiet victims on the compensation list first"
        },
        "c5_start_stop_map": {
          "label": "Trace the decision flow back from the 312 dots"
        },
        "c5_start_stop_reframe": {
          "label": "Ask first who was pushed back first"
        }
      },
      "place": "Care Dispatch Recovery Control Room",
      "clock": "Incident +18h",
      "question": "Stopping kept the standard, but quiet victims appeared in the meantime. What will you look at first this time?",
      "lead": "You leave Onsae for the recovery control room of the city care-dispatch system. The cost of the stop is billed here."
    }
  },
  "echoReplies": {
    "c5_start_blame": "As you write the name in, Ban Jaewook closes his notebook and starts scheduling the investigation. Things move faster, but one wrongly chosen cause can bring the same system failure back.",
    "c5_start_map": "As you trace the flow back, the line passes the budget cap and reaches Onsae’s repayment terms sheet. While you draw it, the 312 people harmed right now wait for an answer.",
    "c5_start_redesign": "As you dispatch by hand, the red dots on the wall map start going out one by one. It works, but the name the reporters ask for over the phone is still blank.",
    "c5_map_map": "As you search for what they share, the same homes, pushed back a little at each criterion, overlap on the map. The flaw in the criteria shows, but while you search, those people stay pushed back.",
    "c5_map_blame": "You call the manager in, and he walks in holding the same priority table. You get an answer faster, but the fact remains that he was looking at the same table.",
    "c5_map_redesign": "As you raise the protection value, a few red dots on the map move up the queue. The temporary weight protects people now, but if “temporary” is still there next quarter, it becomes the rule.",
    "c5_blame_blame": "When the announcement ends, the reporters lining the hallway drift away one by one. The anger settles, but where it settles, the structure gets ready for the next incident.",
    "c5_blame_map": "As you read out the report, the reporters’ pens stop and a few switch off their recorders. Repeats will drop, but those who waited for an apology today hear no name at all.",
    "c5_blame_redesign": "As you bind all three into one statement, Oh Jinwoo steps down from the podium and revises the draft again. Bound together, nothing can be put off, but if one runs late, they all run late.",
    "c5_collapse_redesign": "As you tilt the weights, the line Do Yoonha pointed to rises to the front of the queue. Reverse weighting lowers the cost of silence, but the table must also say who carries that weight instead.",
    "c5_collapse_blame": "As you settle on a new manager and retraining, Do Yoonha puts the visit records back in the box. The familiar answer is easy to carry out, and the next miss will bring the same answer again.",
    "c5_collapse_map": "As you rebuild around the records of the 312, the papers on the table become the boxes of a new table one by one. It is the most honest design, and also the slowest and most expensive.",
    "c5_after_owner": "You take responsibility first, and the discussion begins. It also remains true that if the one who took responsibility also leads the fixes, no one is left to check them.",
    "c5_after_system": "Fixing the structure makes the next time safer. The desk of the person who left today is written nowhere in that design.",
    "c5_after_name": "One name closes the meeting. The next meeting is one where no one speaks first.",
    "c5_pattern_choice_1": "Open the blockages and the same failure becomes rarer, while responsibility for the failure that already happened stays where it is.",
    "c5_pattern_choice_2": "Gather responsibility on one person and the conclusion comes faster, while the structure stays right where it is.",
    "c5_pattern_choice_3": "Pay the biggest losses first and the visible places recover, while small, scattered harm goes uncounted.",
    "c5_voice_choice_1": "Restored records cannot replace testimony, and they don’t leave testimony standing alone either.",
    "c5_voice_choice_2": "The name comes out first, the organization gets its answer, and that name hides the structure.",
    "c5_voice_choice_3": "Compensation that arrives first covers the harm, and a delayed investigation usually never reopens.",
    "c5_voice_choice_4": "A job one person guarantees disappears when that person does.",
    "c5_verdict_choice_1": "The one who opens their own decisions first earns trust, and that document cannot be taken back.",
    "c5_verdict_choice_2": "Money spent on structure doesn’t reach today’s victims. It erases the next ones.",
    "c5_verdict_choice_3": "When recovery moves first, an apology that comes later is not too late.",
    "c5_pattern_reaction_choice_1": "Dropping the classification slows things down, but the voices that were missing come back.",
    "c5_pattern_reaction_choice_2": "Targeting the approver is fast, and the structure stays as it is.",
    "c5_pattern_reaction_choice_3": "Only patching it keeps the map’s wrong premise in place too.",
    "c5_voice_reaction_choice_1": "A guarantee that lets them keep their seat is expensive, and it makes the next witness.",
    "c5_voice_reaction_choice_2": "Reorganizing after the testimony is fast, but that person becomes the reason for the reorganization.",
    "c5_voice_reaction_choice_3": "Delayed testimony doesn’t vanish. It comes out of someone else’s mouth.",
    "c5_verdict_reaction_choice_1": "With recovery as the first sentence, the apology becomes a promise, not an explanation.",
    "c5_verdict_reaction_choice_2": "The apology has the right form, but the harm stays where it is.",
    "c5_verdict_reaction_choice_3": "Silence protects the plan and loses the people waiting.",
    "c5_branch_owner_a": "You write your own name first, and the investigation turns honest. At the same time, you become the easiest target.",
    "c5_branch_owner_b": "Restoring the safeguards prevents the next harm. This time’s victims still have no answer.",
    "c5_branch_owner_c": "Closing it on one person lets the organization recover fast. The same structure puts the next person in the same place.",
    "c5_branch_owner_follow_a": "Recording the name with the measures makes the record complete. That person will be searched alongside that document for life.",
    "c5_branch_owner_follow_b": "Only promises with a budget attached survive into next year. That budget was cut from somewhere else.",
    "c5_branch_owner_follow_c": "The apology closes the chapter. Inside the closed chapter, the cause keeps working.",
    "c5_route_blame_compensate": "Announcing both together settles opinion, and the structural probe may lose its place.",
    "c5_route_blame_single": "A case closed with one name goes quiet. The conditions for the same failure remain.",
    "c5_route_blame_reopen": "Withholding turns the blame on you. In return, the approval path opens again.",
    "c5_final_blame_route_a": "With the budget set the same day, the statement becomes a plan, not an apology.",
    "c5_final_blame_route_b": "The organization holds. The next failure starts in the same place.",
    "c5_final_blame_route_c": "A public review takes a long time, and public opinion reaches its verdict before the review ends.",
    "c5_route_map_publish": "The map shakes the whole organization. In return, it shows that no one is the sole culprit.",
    "c5_route_map_owner": "Names go on and the pushback comes. The pushback confirms where the decisions sit.",
    "c5_route_map_delay": "Compensation comes faster, and the same arrows point the same way next time.",
    "c5_final_map_route_a": "Responsibility is spread out, but because it is written down, it doesn’t scatter.",
    "c5_final_map_route_b": "Compensation covers today’s harm, and the map ages as an internal document.",
    "c5_final_map_route_c": "Outside review shakes the organization, and the conclusion never passes through your editing.",
    "c5_route_redesign_snapshot": "The snapshot slows recovery. In return, recovery doesn’t bury the cause.",
    "c5_route_redesign_continue": "The harm shrinks. What caused it is erased along with it.",
    "c5_route_redesign_rule": "As a rule, the protection stays, and the field’s fatigue becomes a rule too.",
    "c5_final_redesign_route_a": "Releasing both keeps recovery from reading as a cover-up. The cost is the highest.",
    "c5_final_redesign_route_b": "A cause pushed to the next task gets pushed back in the next task too.",
    "c5_final_redesign_route_c": "Stopping recovery makes the shrinking harm grow again. The cause logs remain.",
    "c5_route_system_audit": "Opening the training data tilts the case toward this failure being design, not accident.",
    "c5_route_system_patch": "A dispatch fixed by hand holds only for today, and tomorrow the weights push the same people back.",
    "c5_route_system_call": "Asking directly changes the criteria. Those calls count as time outside the system.",
    "c5_final_system_route_a": "Once it is a public standard, adjustments have to be public too. The budget grows at once.",
    "c5_final_system_route_b": "The correction works only while someone is assigned to it.",
    "c5_final_system_route_c": "Disclosing the gaps costs the model its trust, and sets the conditions for its next training.",
    "c5_evidence_turn_weight": "As a rule, it is hard to reverse. That is the point of this choice.",
    "c5_evidence_turn_archive": "The preserved logs become the first sentence of the next case.",
    "c5_evidence_turn_close": "Compensation covers the harm, and the rule goes on choosing the next person.",
    "c5_route_blame_evidence_turn": "Point to the missing names and the failure’s list of victims is the first thing to change.",
    "c5_route_map_evidence_turn": "Point to the missing names and the failure’s list of victims is the first thing to change.",
    "c5_route_redesign_evidence_turn": "Point to the missing names and the failure’s list of victims is the first thing to change.",
    "c5_route_system_evidence_turn": "Point to the missing names and the failure’s list of victims is the first thing to change.",
    "case05_memory_route": "Laid over each other, Onsae’s exception conditions sit in the same place as one arrow on the failure map. A box that was no one’s sole decision.",
    "case05_memory_system": "Look closely and one line of the recovery priority table follows the same order as the table you reframed. Below it, the weight design file opens too.",
    "case05_memory_evidence": "Search for the names that keep recurring, and you see what the people pushed back every time share. They are the ones who reported least.",
    "c5_start_rule_blame": "The one who made the standard investigates the one who followed it. Everyone knows the order is wrong.",
    "c5_start_rule_map": "Drawing your own rule’s failure is slow and precise. Meanwhile the harm goes on.",
    "c5_start_rule_redesign": "You choose to switch off the rule you made. Write down now the conditions for switching it back on.",
    "c5_start_service_blame": "You approved the exception, and that person carried it out. The investigation starts from one side only.",
    "c5_start_service_map": "A table that counts what was saved and a table that counts who was pushed out are different. Lay the two over each other and the failure shows.",
    "c5_start_service_redesign": "The temporary system keeps the service alive. When temporary runs long, it becomes the standard.",
    "c5_start_stop_blame": "The one who approved the stop asks who is responsible for the stop. Those answering remember that order.",
    "c5_start_stop_map": "The gap of the stop is thinly recorded. While you draw it, quiet harm keeps piling up.",
    "c5_start_stop_redesign": "Recovery goes ahead of the investigation. The cause will have to be found on top of the recovered system.",
    "c5_start_rule_signature": "Doubting your own standard first makes the investigation honest. Meanwhile, other causes keep working.",
    "c5_start_service_signature": "Put what was saved and what was dropped on the same table, and the size of the achievement changes. Once the list is open, those homes need hand dispatch first.",
    "c5_start_stop_signature": "Counting the unspoken harm first creates a standard. The budget gets cut first from the share of those who spoke up."
  },
  "choiceVoiceLines": {
    "c5_start_blame": "Saying the scattered anger has to land on one person, you write the operations head’s name in the blank line of Ban Jaewook’s notebook.",
    "c5_start_map": "Saying you should see the path the failure took before pointing at anyone, you trace the decision flow back from the 312 dots on the map.",
    "c5_start_redesign": "Saying the misses can’t go on whatever it costs, you start dispatching by hand with the control-room staff.",
    "c5_map_map": "Saying you should first see whether the missed resemble each other, you look for what the 312 pushed off ECHO’s map share.",
    "c5_map_blame": "Saying a missed signal has a name too, you call in the operations manager who missed the warning signs.",
    "c5_map_redesign": "Saying it isn’t a finished answer, you raise the weighting table’s protection value for the missed, for now.",
    "c5_blame_blame": "Saying the people waiting need an answer, you announce the manager’s discipline and the compensation plan together from the briefing-room podium.",
    "c5_blame_map": "Saying this won’t end with one person, you turn on the podium mic and read out the structural failure report.",
    "c5_blame_redesign": "Saying that release one and the rest get put off, you bind discipline, compensation and reform into one statement with Oh Jinwoo.",
    "c5_collapse_redesign": "Saying the ones who can’t speak get pushed back first, you tilt the weights back toward the quiet 312.",
    "c5_collapse_blame": "Saying the most familiar answer moves fastest, you leave the records room and order a new manager and retraining.",
    "c5_collapse_map": "Saying the measure is who broke down first, you rebuild the indicators with Do Yoonha around the 312 who were missed.",
    "c5_after_owner": "Looking at the empty desk, you take responsibility for your own decisions first and take on the fixes.",
    "c5_after_system": "Instead of pointing at anyone, you redesign the structure to stop it happening again.",
    "c5_after_name": "To end the meeting, you name the person who made the biggest mistake as officially responsible.",
    "c5_pattern_choice_1": "I’ll fix the points where information was blocked first.",
    "c5_pattern_choice_2": "I’ll gather the responsibility on the people who approved it.",
    "c5_pattern_choice_3": "I’ll compensate the hardest-hit departments first.",
    "c5_voice_choice_1": "I’ll protect the witness and restore the erased records first.",
    "c5_voice_choice_2": "I’ll announce the official responsible party first.",
    "c5_voice_choice_3": "I’ll draft compensation first and put the investigation off.",
    "c5_voice_choice_4": "I’ll guarantee the witness’s job on my own authority.",
    "c5_verdict_choice_1": "I’ll start by disclosing what I decided.",
    "c5_verdict_choice_2": "I’ll decide now on the safeguards that stop the next failure.",
    "c5_verdict_choice_3": "Before any apology, I’ll start the first act of recovery.",
    "c5_pattern_reaction_choice_1": "I’ll scrap the classification and listen again from the start.",
    "c5_pattern_reaction_choice_2": "I’ll investigate the biggest approver first.",
    "c5_pattern_reaction_choice_3": "I’ll keep the map and fill in only the missing parts.",
    "c5_voice_reaction_choice_1": "I’ll make sure they can speak without leaving.",
    "c5_voice_reaction_choice_2": "I’ll reorganize right after the testimony.",
    "c5_voice_reaction_choice_3": "I’ll hold the testimony to protect the organization.",
    "c5_verdict_reaction_choice_1": "I’ll make recovery the first sentence of the statement.",
    "c5_verdict_reaction_choice_2": "I’ll get the responsible party’s apology first.",
    "c5_verdict_reaction_choice_3": "I won’t say anything until the fix plan is done.",
    "c5_branch_owner_a": "Before bringing up any other name, you disclose what you decided at Onsae first.",
    "c5_branch_owner_b": "Setting the blame discussion aside, you restore the missing safeguards first.",
    "c5_branch_owner_c": "Cutting the explanations short, you close the failure as one person’s fault.",
    "c5_branch_owner_follow_a": "Next to the recovery list, you record the name of the person responsible as well.",
    "c5_branch_owner_follow_b": "So it doesn’t end in words, you lock a budget into the recurrence safeguards.",
    "c5_branch_owner_follow_c": "Deciding not to touch it further, you issue only an apology and close it.",
    "c5_route_blame_compensate": "So it doesn’t end with naming someone, you put the compensation plan on the same stage.",
    "c5_route_blame_single": "Judging that closing fast reduces harm, you settle it as one person’s fault.",
    "c5_route_blame_reopen": "Judging that the path must be seen before a name goes on it, you withhold the naming.",
    "c5_final_blame_route_a": "On the day you name someone responsible, you set the prevention budget too.",
    "c5_final_blame_route_b": "Judging the organization can’t take more digging, you end it as one person’s fault.",
    "c5_final_blame_route_c": "Deciding to ask where it split rather than whose fault it was, you open the whole path.",
    "c5_route_map_publish": "To make it understandable, you publish the failure map as it is.",
    "c5_route_map_owner": "Judging that nothing happens if the arrows have no names, you attach the decision-makers.",
    "c5_route_map_delay": "Judging that compensation comes before explanation for now, you keep the map inside.",
    "c5_final_map_route_a": "While you’re drawing the structure, you write responsibility and compensation on every arrow and open it.",
    "c5_final_map_route_b": "Judging the map could become a weapon, you announce only the compensation first.",
    "c5_final_map_route_c": "As if refusing to tidy it with your own hands, you hand the report to outside review as is.",
    "c5_route_redesign_snapshot": "Knowing the pre-fix state is the evidence, you take a snapshot first.",
    "c5_route_redesign_continue": "Judging that the harm you can cut now comes first, you choose recovery speed.",
    "c5_route_redesign_rule": "To turn the temporary fix into a rule, you formalize the manual dispatch conditions.",
    "c5_final_redesign_route_a": "To show what was fixed alongside what came before, you release the snapshot and the new rule together.",
    "c5_final_redesign_route_b": "Judging the cause can be uncovered later, you keep recovering.",
    "c5_final_redesign_route_c": "Judging the evidence will vanish first, you stop recovery and preserve the logs.",
    "c5_route_system_audit": "Judging you must first see what the weights learned, you open the training data.",
    "c5_route_system_patch": "Judging that saving today’s dispatch comes first, you leave the weights and fix it by hand.",
    "c5_route_system_call": "Judging that the ones who made the criteria saw it wrong, you ask the missed people directly.",
    "c5_final_system_route_a": "So no one is pushed back for being quiet, you write protection weights into the public standard.",
    "c5_final_system_route_b": "Unsure you can explain it, you leave the weights and keep correcting by hand.",
    "c5_final_system_route_c": "To reveal first what the model never learned, you open the missing-victim records.",
    "c5_evidence_turn_weight": "You lift the hidden weight into the place of a rule, so anyone can read it.",
    "c5_evidence_turn_archive": "Before recovery buries the evidence, you lock down the cause logs first.",
    "c5_evidence_turn_close": "You finish the urgent compensation first and put off disclosing the rule.",
    "c5_route_blame_evidence_turn": "Using the names missing from the failure map as a clue, you trace back who was erased first.",
    "c5_route_map_evidence_turn": "Using the names missing from the failure map as a clue, you trace back who was erased first.",
    "c5_route_redesign_evidence_turn": "Using the names missing from the failure map as a clue, you trace back who was erased first.",
    "c5_route_system_evidence_turn": "Using the names missing from the failure map as a clue, you trace back who was erased first.",
    "c5_start_rule_blame": "Asking whether you must investigate the people who kept the standard you made, you call out a name.",
    "c5_start_rule_map": "You draw the flow first, to find where the standard lost those homes.",
    "c5_start_rule_redesign": "You decide to set the standard aside for now and dispatch by hand.",
    "c5_start_service_blame": "Knowing the exceptions that saved the service led here, you call in the person responsible.",
    "c5_start_service_map": "You spread out the whole flow of whom the saved service pushed out.",
    "c5_start_service_redesign": "Saying the goal was keeping it running, you propose changing how it is kept running.",
    "c5_start_stop_blame": "Saying the decision to stop was yours, you say you will check responsibility for carrying it out first.",
    "c5_start_stop_map": "You draw the map first, of what broke where during the stop.",
    "c5_start_stop_redesign": "Saying the first thing is to restart what stopped, you switch to a manual system.",
    "c5_start_rule_signature": "Before investigating anyone else, you put the standard you set on trial first.",
    "c5_start_service_signature": "You start counting the names missing from the service you say you saved.",
    "c5_start_stop_signature": "You write the ones who couldn’t say a word during the stop on the first line of the compensation list."
  },
  "pack": {
    "clue": {
      "title": "The Empty Seat",
      "text": "One name is missing from the failure report. The person who couldn’t speak up carried the system’s biggest cost."
    },
    "outcomes": {
      "c5_after_owner": {
        "tag": "Took Ownership",
        "title": "You Put Your Own Name in the Report First",
        "text": "Sole responsibility didn’t solve the problem right away, but it made a space where people could speak about failure without hiding."
      },
      "c5_after_system": {
        "tag": "Fixed the Structure",
        "title": "You Stopped the Repeat Instead of Finding a Culprit",
        "text": "No one became a hero, but the road to the same failure got narrower."
      },
      "c5_after_name": {
        "tag": "Named a Culprit",
        "title": "You Closed the Failure with One Name",
        "text": "The meeting ended fast, but the records of those who couldn’t speak are still there."
      }
    },
    "continuityChallenges": {
      "c4_after_rule": {
        "title": "Close the Gaps in the New Standard",
        "text": "Find the choice that lowers the risk your public standard creates in the field."
      },
      "c4_after_service": {
        "title": "Restore Trust in the Exceptions",
        "text": "A choice that restores trust in rules shaken after saving the service can open a hidden clue."
      },
      "c4_after_stop": {
        "title": "Protect Those Hurt by the Stop",
        "text": "Protect first the people whose service stopped for the audit, and you can hold through the next case."
      }
    }
  }
};
