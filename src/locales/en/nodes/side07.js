/**
 * 번외 7 (src/nodes/side07.js) in English, for the English preview.
 *
 * A draft: translated with the glossary (앱출시-G), not yet edited by a
 * person. Words only, under the ids of the pack as the app is shipped it
 * (scripts/locale-words.mjs); the pack's label and title live in the
 * dictionary's `copy.sidePacks`, a scene or card left out here keeps its
 * Korean, and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "s7_start": {
      "title": "17:58",
      "place": "KD Capital Head Office · Treasury",
      "clock": "June 12 (Fri) 18:06, 6 minutes after the working day ends",
      "lead": "A Friday evening in June, the last day of the FSS’s regular inspection. On a Treasury monitor sit four lines of approval notices.",
      "text": "The Treasury staff already have their bags on their shoulders. On the screen: four overseas transfers approved at 17:58. Two to Hong Kong, one to London, one to New York. 8.4 billion won in all. The equipment suppliers’ names are the usual ones, but the receiving accounts are numbers nobody has seen before. Lee Minseo, who saw the records alarm at KD Data Lab, calls. 'Analyst, have you seen the approver field? The first line is Manager Mo Jihyun. She left in March.' She catches her breath. 'The second approval is Treasury-Shared02. The account doesn’t know who pressed it.' Outside the window, the commuter bus pulls away.",
      "question": "8.4 billion won has gone out under the names of a leaver and a shared account. What do you do first?",
      "memo": [
        "17:58 approval, 4 overseas transfers, 8.4 billion won in all",
        "Receiving: 2 in Hong Kong, London, New York",
        "Approval 1: Mo Jihyun (left March 31) / Approval 2: Treasury-Shared02"
      ],
      "choices": {
        "s7_start_stay": {
          "label": "Put your bag down and stay in Treasury"
        },
        "s7_start_log": {
          "label": "Ask Lee Minseo to copy the records first"
        },
        "s7_start_call": {
          "label": "Call the head of Treasury, already gone home, first"
        }
      }
    },
    "s7_lines": {
      "title": "Four Lines",
      "place": "Treasury · At the whiteboard",
      "text": "You write four lines on the whiteboard, and Lee Minseo reads out each bank’s closing time over the phone. The two in Hong Kong close at 19:00 Seoul time. 45 minutes left. London at 1 a.m., New York at 6 on Saturday morning. Whatever closes on Friday opens again only on Monday. A stop request (a formal letter asking the receiving bank not to let the money out) goes one at a time, and only with a responsible officer’s signature. Tonight the only person on this floor who can sign is you. Lee Minseo asks, 'The biggest first, or the one that closes soonest?'",
      "question": "One letter has to go out within 45 minutes. In what order will you go?",
      "memo": [
        "Hong Kong 3.1 billion · Hong Kong 900 million: close at 19:00",
        "London 1.8 billion: 01:00 / New York 2.6 billion: Sat 06:00",
        "Stop requests: one at a time, an officer’s signature"
      ],
      "choices": {
        "s7_lines_big": {
          "label": "Write the stop request for the 3.1 billion in Hong Kong first"
        },
        "s7_lines_close": {
          "label": "Send the two Hong Kong ones first, in closing order"
        },
        "s7_lines_up": {
          "label": "Report to the CEO’s office and wait for orders"
        }
      }
    },
    "s7_hongkong": {
      "title": "The Closing Window",
      "place": "Treasury · International call",
      "clock": "18:41 (Hong Kong 17:41)",
      "text": "Grace Wong, payments investigator at the receiving bank in Hong Kong, picks up. The call is in English, and you write down what you hear in your notebook. 'We have your request. I’m glad it came before we close.' The typing stops. 'But our rules say we must make a confirmation call to the sending side’s approver. Of the two listed, one has left the company, and the other isn’t a person but an account.' A short silence. 'Analyst, who am I supposed to call?' The clock says 18:44.",
      "question": "The receiving bank asks who approved. How do you answer?",
      "memo": [
        "Grace Wong: payments investigator, the receiving bank in Hong Kong",
        "Rule: a confirmation call to the sending side’s approver",
        "Two approvers: one leaver, one account"
      ],
      "choices": {
        "s7_hk_self": {
          "label": "Give your own name and number and say you’ll confirm"
        },
        "s7_hk_truth": {
          "label": "Say plainly that no approver can be named"
        },
        "s7_hk_later": {
          "label": "Ask her to log it now and confirm on Monday"
        }
      }
    },
    "s7_inspector": {
      "title": "Last Day of the Inspection",
      "place": "KD Capital Head Office · Lobby",
      "text": "Seven black suitcases stand in a row in the lobby. The five-day regular inspection ended today. Han Jiwoo, her hand on a suitcase handle, looks at your face. 'Just one question. At what time today, and what happened.' When you tell her the four lines, she takes out her notebook again and writes down the time to the minute. 'A financial incident is reported the moment it is known. Those are the rules.' Her pen stops. 'If the approver is a shared account, what will you write in the report’s approver field?' She stands the suitcase back against the wall.",
      "question": "The inspector has stopped on her way out. What do you do?",
      "memo": [
        "Regular inspection, day 5, the last day",
        "Han Jiwoo: 'reported the moment it is known'",
        "The report’s approver field: still blank"
      ],
      "choices": {
        "s7_insp_tell": {
          "label": "Separate what you know from what you don’t, and say it"
        },
        "s7_insp_stay": {
          "label": "Ask her to look over the report’s first page with you"
        },
        "s7_insp_wait": {
          "label": "Hold back until the company’s official report goes out"
        }
      }
    },
    "s7_account": {
      "title": "A Three-Month-Old Account",
      "place": "Treasury · At Lee Minseo’s laptop",
      "text": "Lee Minseo has come to Treasury with her laptop. 'I made the copies. One on the Data Lab server, one here.' Two tables come up side by side. In the HR system, Mo Jihyun left on March 31. In the overseas-payment permission list she is still 'can approve.' The two lists do not know each other. There is also the email Mo Jihyun sent on the day she left. 'Please be sure to delete my payment approval rights.' The reply is one line, 'Confirmed.' Lee Minseo turns her staff ID card over in her hand. 'I don’t know how they got in either. But I know whose name it went out under. That scares me more.'",
      "question": "A permission she asked to have deleted stayed alive for three months. What do you do?",
      "memo": [
        "HR system: Mo Jihyun left March 31",
        "Payment permission list: still 'can approve'",
        "Email on her last day: 'Please delete my rights' → 'Confirmed'"
      ],
      "choices": {
        "s7_acc_mail": {
          "label": "Print both emails with their times showing"
        },
        "s7_acc_list": {
          "label": "Count the other leavers still on the list"
        },
        "s7_acc_call": {
          "label": "Contact Mo Jihyun to meet tomorrow"
        }
      }
    },
    "s7_night": {
      "title": "The Remaining Balance",
      "place": "Treasury · International call",
      "clock": "22:50 (Hong Kong 21:50)",
      "text": "Grace Wong, payments investigator at the bank in Hong Kong, calls without having gone home. The call is in English. 'It tripped our own unusual-transaction check too. We’ve frozen the receiving account. But of the 3.1 billion, only about 1.1 billion is left. The rest was already moved to other accounts in the afternoon.' The second Hong Kong transfer went to a different bank, so she doesn’t know about it. Two hours until London closes. Grace Wong adds, 'Returning the frozen money isn’t my decision. Papers and a court decide, and it takes weeks.' Her voice drops a little. 'The name of someone who has left is in the approver field. Does she know?'",
      "question": "Only part of the money is frozen, and London’s close is coming. What do you do?",
      "memo": [
        "Hong Kong 3.1 billion: receiving account frozen, about 1.1 billion left",
        "Getting it back: papers and a court, weeks",
        "London closes at 01:00"
      ],
      "choices": {
        "s7_night_london": {
          "label": "Sign the London request and send it now"
        },
        "s7_night_paper": {
          "label": "Ask for the freeze to be confirmed in writing"
        },
        "s7_night_answer": {
          "label": "Answer honestly that she doesn’t know yet"
        }
      }
    },
    "s7_former": {
      "title": "The Leaver",
      "place": "Sangam-dong · Café by an apartment complex",
      "clock": "June 13 (Sat) 11:00",
      "text": "Mo Jihyun parks the stroller by the café door and sits down. She left KD Capital in March and now keeps the books at a small company near home. 9 years of approving overseas payments, nothing else. When you hold out the approval record, she looks at it for a long time. 'If it was 17:58, I was outside the daycare then, picking up my kid.' She opens her phone and shows you the email from her last day and the 'Confirmed.' 'I asked you to delete it.' Her voice shakes, then stops. 'That account was my name for 9 years. Now 8.4 billion went out under my name?'",
      "question": "Facing the money that went out under her name, Mo Jihyun asks. What do you do?",
      "memo": [
        "Mo Jihyun: 9 years approving overseas payments, left March 31",
        "17:58: she was outside the daycare",
        "Her phone: the email from her last day and 'Confirmed'"
      ],
      "choices": {
        "s7_former_name": {
          "label": "Say you’ll put on record that it wasn’t her fault"
        },
        "s7_former_time": {
          "label": "Help her keep the daycare’s pick-up record"
        },
        "s7_former_quiet": {
          "label": "Ask her to wait until the company contacts her"
        }
      }
    },
    "s7_statement": {
      "title": "One Line",
      "place": "KD Capital Head Office · Outside the CEO’s office",
      "clock": "June 14 (Sun) 16:00",
      "text": "On Sunday afternoon the corridor outside the CEO’s office is quiet. Seok Jaewoo, in a shirt with the sleeves folded twice, holds out a sheet of paper: the draft of the statement to go out on Monday morning. 'Due to a sophisticated attack by outside forces, some overseas payments were disrupted, and no customer suffered any loss.' He brushes the dust off your shoulder. 'A tidy version. Easier for everyone. Things like a leaver’s name or a shared account are for the investigators to look at.' He smiles. 'You did well on Friday. So now, get some rest.' Below the draft, one signature box is empty.",
      "question": "8.4 billion won is about to become one line, 'a sophisticated attack.' What do you do?",
      "memo": [
        "Draft statement: 'a sophisticated attack by outside forces'",
        "'No customer suffered any loss'",
        "Left out: the leaver’s permission, the shared account"
      ],
      "choices": {
        "s7_stmt_add": {
          "label": "Handwrite the two missing lines under the draft"
        },
        "s7_stmt_ask": {
          "label": "Ask what 'sophisticated' is based on"
        },
        "s7_stmt_take": {
          "label": "Take the draft and walk out without a word"
        }
      }
    },
    "s7_monday": {
      "title": "Monday Morning",
      "place": "Treasury",
      "clock": "June 15 (Mon) 08:40",
      "text": "As Treasury comes in, every monitor shows the same black screen. A notice that the files have been locked and that whoever wants them back should get in touch, and a number counting down. The first folder locked is named 'OverseasPayments_2026_06'. People hesitate in front of their own desks. Lee Minseo comes in and opens her own laptop. 'The copy I made on Friday night is still there. The Data Lab side isn’t locked.' She turns her staff ID card over in her hand. 'If anyone wants Friday wiped, this copy is the only one left now.'",
      "question": "Friday’s records are locked, and one copy is left. What do you do?",
      "memo": [
        "08:40 a ransom notice on every Treasury screen",
        "First folder locked: OverseasPayments_2026_06",
        "Friday night’s copy: still on the Data Lab side"
      ],
      "choices": {
        "s7_mon_copy": {
          "label": "Make one more copy and leave it with the inspector"
        },
        "s7_mon_people": {
          "label": "Stay with everyone until the security team comes"
        },
        "s7_mon_minseo": {
          "label": "Make sure Lee Minseo isn’t guarding the copy alone"
        }
      }
    },
    "s7_aftershock": {
      "title": "The Nine O’Clock Report",
      "place": "Treasury · Meeting room",
      "clock": "08:55, 5 minutes before the report",
      "text": "Han Jiwoo is back, pulling just one black suitcase. Receiving reports of financial incidents is the supervisor’s job too. Three things lie on the meeting-room table: a bundle of stop requests chasing the balance of the frozen Hong Kong account, a note on the cause with Mo Jihyun’s email and the permission list attached, and Seok Jaewoo’s draft statement. London and New York have not answered yet. Han Jiwoo opens her notebook and writes the time. 'The report is one page. What goes on the first line is yours to decide, Analyst. I will write it down as I receive it. Those are the rules.'",
      "question": "The report has one first line. What will you write?",
      "memo": [
        "Hong Kong 3.1 billion: about 1.1 billion frozen, back weeks later",
        "London, New York: no answer",
        "The ending you choose stays on this device only"
      ],
      "choices": {
        "s7_after_money": {
          "label": "Put the stop requests chasing the money first"
        },
        "s7_after_cause": {
          "label": "Write the leaver’s permission and shared account first"
        },
        "s7_after_line": {
          "label": "Copy the statement’s line as it is"
        }
      }
    }
  },
  "outcomes": {
    "s7_after_money": {
      "title": "1.1 Billion",
      "text": "You write numbers on the first line. Hong Kong frozen, about 1.1 billion; the second Hong Kong transfer, 900 million; London, 1.8 billion; New York, 2.6 billion. All that week, stop requests and confirmation papers go back and forth. 3 weeks later a short email comes from Grace Wong. 'The court’s decision is in. We will send the frozen money back.' 1.12 billion won comes back. About the remaining 7.28 billion won, no answer comes from anywhere. At the end of the email she has added a line. 'Please give Manager Mo my regards. I almost made that confirmation call to her.'"
    },
    "s7_after_cause": {
      "title": "The Permission Nobody Deleted",
      "text": "On the first line you write: 'Leaver’s permission not withdrawn; approved from a shared account. Approver cannot be named.' The money does not come back. Even the Hong Kong freeze lapses because the papers are late. Instead, Han Jiwoo attaches that page to the very back of her inspection report. 'I am adding one finding.' The next week a text comes from Mo Jihyun. When she handed a copy of that report to the police, their questions ended at one. 'My name is in the victim box now.' The names of eleven leavers are struck from the permission list. The shared account stays as it is."
    },
    "s7_after_line": {
      "title": "Outside Attack",
      "text": "You copy out the statement’s line. 'A sophisticated attack by outside forces.' At ten in the morning the same sentence becomes a press release. The evening news shows the black notice screen for a moment and moves on. Neither the leaver’s name nor the shared account appears anywhere. Han Jiwoo writes it down as she received it, and notes the time in her notebook once more. Three days later Mo Jihyun calls. The police asked her about the name on the first line of the approval record. 'They said it was an outside attack. So why are they asking me?' You can’t find an answer."
    }
  }
};
