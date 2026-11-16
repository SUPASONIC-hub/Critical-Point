/**
 * 번외 4 (src/nodes/side04.js) in English, for the English preview.
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the pack as the app is shipped it
 * (scripts/locale-words.mjs); the pack's label and title live in the
 * dictionary's `copy.sidePacks`, a scene or card left out here keeps its
 * Korean, and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "s4_start": {
      "title": "312 Calls",
      "place": "KD Bank Customer Center · Night counselling desks",
      "clock": "December 11 (Thu) 22:10, 11 hours to the head-office report",
      "lead": "A Thursday night in December, 3 weeks before the year ends. Han Giho, night-shift team leader at KD Bank’s customer center, has asked Trigger Lab for someone who reads numbers. You.",
      "text": "Team leader Han Giho folds his shirt sleeves up twice and holds out a stack of printouts. 312 small-business loans ending on December 31, each refused a maturity extension (moving back the date the loan must be repaid). By 9 tomorrow morning, every one of them has to be told by phone. On the sticky note beside his monitor: 'Notification completion rate 100%.' 'Customers keep asking why. And the screen only gives one line: below internal overall assessment.' He taps that line with the tip of his pen. 'All you have to do, Analyst, is turn this into words a person can hear. We’ll do the talking.' Then he gives an awkward laugh. 'I get an overall assessment at year-end too.'",
      "question": "Team leader Han Giho asks you to turn the one-line reason for refusal into human words. What do you do?",
      "memo": [
        "Maturity extension refusals to notify: 312",
        "Deadline: report to head office at 09:00 tomorrow",
        "The reason on screen: one line, 'below internal overall assessment'",
        "Team leader’s sticky note: 'Notification completion rate 100%'"
      ],
      "choices": {
        "s4_start_seat": {
          "label": "Pull a chair up to the desk and listen from the first call"
        },
        "s4_start_code": {
          "label": "Ask first how the reasons for refusal are decided"
        },
        "s4_start_order": {
          "label": "Skim the 312 and work out the fastest order"
        }
      }
    },
    "s4_script": {
      "title": "We’re Rooting for You",
      "place": "KD Bank Customer Center · Night desk 7",
      "text": "The call script is up on desk 7’s monitor. Greeting, identity check, notice of refusal, apology. The last line reads: 'KD Bank is always rooting for your valued business.' Oh Minjeong, a counsellor 7 years in, settles her headset and unscrews her thermos of barley tea. 'We refuse them, then we root for them. Both are in the script.' In a corner of the screen sit two small numbers. Average call time, and count of empathy expressions. Every time she says 'I’m sorry,' the system recognises it and adds one. A call that goes past 2 minutes 40 seconds turns red. Oh Minjeong smiles. 'Tonight I’m going to be the most empathetic person in this whole center. 312 times over.'",
      "question": "She has to make 312 calls from a script that roots for people after refusing them. What do you look at first?",
      "memo": [
        "Last line of the script: 'always rooting for you'",
        "Scored numbers: average call time, count of empathy expressions",
        "One 'I’m sorry' = one empathy expression",
        "Past 2 minutes 40 seconds turns red"
      ],
      "choices": {
        "s4_script_read": {
          "label": "Read the script aloud once with Oh Minjeong"
        },
        "s4_script_limit": {
          "label": "Ask where 2 minutes 40 seconds was decided"
        },
        "s4_script_skip": {
          "label": "Leave the script and have her place the first call now"
        }
      }
    },
    "s4_first": {
      "title": "The First Hundred",
      "place": "KD Bank Customer Center · Night desk 7",
      "text": "The hundredth call ends. The florist said, 'Year-end is when flowers sell best.' The dry cleaner only breathed and then hung up. The hairdresser asked why three times. Oh Minjeong answered all three with the same sentence. You are below internal overall assessment, I’m sorry. The empathy count passes 100 and turns green. Oh Minjeong lowers the headset to her neck and drinks her barley tea. 'When they ask why, I don’t know either. And saying I don’t know loses points.' The call list shows seven lines of 'customer hung up.' One of them is a snack bar in Gimpo. 22:50, call length 41 seconds.",
      "question": "The same sentence went out a hundred times, and seven people hung up first. What do you do?",
      "memo": [
        "100 calls done, empathy expressions past 100",
        "'Customer hung up': 7",
        "Gimpo snack bar: 22:50, cut off at 41 seconds",
        "Oh Minjeong: 'saying I don’t know loses points'"
      ],
      "choices": {
        "s4_first_words": {
          "label": "From the next call, write her the reason in plain words"
        },
        "s4_first_pace": {
          "label": "Help her keep to the script and under 2:40"
        },
        "s4_first_mark": {
          "label": "Flag the seven who hung up first"
        }
      }
    },
    "s4_callback": {
      "title": "The One Who Called Back",
      "place": "KD Bank Customer Center · Night desk 7",
      "clock": "December 12 (Fri) 00:40",
      "text": "A call comes in to desk 7. It’s the Gimpo snack bar that hung up after 41 seconds: Moon Jeongtaek. Oil is bubbling behind him. 'Sorry about earlier. I picked up while turning off the tteokbokki.' He is fifty-six, and for 12 years he has got by on the tteokbokki the night shift from the logistics center across the road eats before heading home at dawn. 'The text I got earlier said if I hand in more papers, you might look again. What do I hand in?' Oh Minjeong looks down at the script. All it has is 'A re-review is difficult.' On the last page of the printouts Han Giho gave you, you find the small print. If the last three months’ sales are above 80% of the standard, a re-review can be requested under the team leader’s name.",
      "question": "Moon Jeongtaek asks what to hand in, and the script has no answer. What do you do?",
      "memo": [
        "Moon Jeongtaek (56): snack bar in Gimpo, 12 years",
        "Regulars: the night shift of the logistics center across the road",
        "Last page of the printouts: if 3 months’ sales are above 80% of the standard, a re-review may be requested",
        "Requests only under the team leader’s name"
      ],
      "choices": {
        "s4_callback_slip": {
          "label": "Work out with him how to print his card sales"
        },
        "s4_callback_rule": {
          "label": "Read him the re-review rule from the last page"
        },
        "s4_callback_script": {
          "label": "Let Oh Minjeong say 'it’s difficult' as scripted"
        }
      }
    },
    "s4_receipt": {
      "title": "The Card Terminal",
      "place": "KD Bank Customer Center · Night desk 7",
      "text": "Moon Jeongtaek calls once more. Three photos have come by text in the meantime: monthly sales printed from his card terminal. September 11.4 million won, October 9.8 million won, November 6.1 million won. One corner of the receipt paper is wet with tteokbokki sauce. 'From November my dawn customers dropped right off. They still come, but they don’t eat. Word is something’s happening to the center at year-end.' You work out the three-month average. 9.1 million won a month. The standard is 10 million won a month, and 80% of that is 8 million. It clears. Moon Jeongtaek laughs. 'So that’s it, then? My tteokbokki tastes good in numbers too.' Oh Minjeong covers the headset mic with her hand and looks at you. You still haven’t opened the detailed-reason screen for this line.",
      "question": "Moon Jeongtaek’s three months of sales clear the re-review bar. What do you do?",
      "memo": [
        "Card sales: Sep 11.4 million / Oct 9.8 million / Nov 6.1 million won",
        "3-month average 9.1 million won; 80% of the 10 million won standard = 8 million won",
        "Dawn customers dropped from November"
      ],
      "choices": {
        "s4_receipt_sum": {
          "label": "Read the sum to Moon Jeongtaek line by line"
        },
        "s4_receipt_file": {
          "label": "Sort the three photos so they can go on a request"
        },
        "s4_receipt_listen": {
          "label": "Hear out his story about the dawn customers"
        }
      }
    },
    "s4_memo": {
      "title": "No Exceptions",
      "place": "KD Bank Customer Center · Team leader’s desk",
      "text": "There is one more sticky note on the frame of the team leader’s monitor. 'No exceptions. 12/12 09:00 report to head office.' Team leader Han Giho is folding the foil from a convenience-store gimbap when he looks up at you. File a re-review request and today’s report becomes 311 done out of 312, 1 not done. Completion 99.7%. 'That 0.3% goes straight into my year-end assessment. They don’t even round it.' He laughs, then stops. 'I filed one once. 4 years ago. The answer came three months later. The shop had closed in between.' He scratches at 'No exceptions' with a fingernail. 'I didn’t write this. I was handed it. I don’t know who wrote it first either.'",
      "question": "One re-review request knocks 0.3% off the team leader’s completion rate. What do you do?",
      "memo": [
        "Sticky note: 'No exceptions. 12/12 09:00 report to head office'",
        "1 request = completion 99.7%",
        "Han Giho’s request 4 years ago: answer three months later, the shop closed in between"
      ],
      "choices": {
        "s4_memo_write": {
          "label": "Offer to write the request together, name left blank"
        },
        "s4_memo_count": {
          "label": "Look for a 'request pending' box on the report form"
        },
        "s4_memo_later": {
          "label": "Finish the remaining calls first, talk in the morning"
        }
      }
    },
    "s4_queue": {
      "title": "Seventeen Waiting",
      "place": "KD Bank Customer Center · Night desk 7",
      "text": "Half past 3 in the morning, and the queue of incoming calls is seventeen long. People who got the news in the evening and couldn’t sleep. Oh Minjeong finishes her barley tea and stands the thermos upside down. 'I get an extension review in January too. Every year.' She isn’t a bank employee but works for an outsourcing company, on contracts renewed 1 year at a time. The standards are average call time and count of empathy expressions. 'My numbers are good today. I said sorry 312 times.' The queue goes to eighteen. Pulling the headset back on, Oh Minjeong slides a memo slip over to you. 'Write down what I should say when they ask why. Not the script.'",
      "question": "The queue grows, and Oh Minjeong asks you to write words that aren’t the script. What do you do?",
      "memo": [
        "Dawn queue: 17 -> 18",
        "Oh Minjeong: outsourcing company, 1-year contracts, reviewed in January",
        "Review standards: average call time, count of empathy expressions"
      ],
      "choices": {
        "s4_queue_note": {
          "label": "Write the reason on the slip in three plain lines"
        },
        "s4_queue_log": {
          "label": "Note down, one line each, what the queue is asking"
        },
        "s4_queue_rest": {
          "label": "Ask Oh Minjeong to put the headset down for 5 minutes"
        }
      }
    },
    "s4_bottom": {
      "title": "The Name at the Bottom",
      "place": "KD Bank Customer Center · Night desk 7",
      "text": "The calls are done down to the 311th line. On the 312th, the very bottom line, Moon Jeongtaek’s name is left. Oh Minjeong held it back on purpose. 'My voice is a bit better in the morning. I wanted to call him with a better voice.' Only now do you open the detailed-reason screen for that line. Below internal overall assessment. Under it, in small print, one more line. 'Commercial-area risk weighting: nearby major business FlowOn Gimpo center, related loan 2023-0412 under watch.' The loan you wrote an eleven-page dissent against 3 years ago. To protect that loan, the bank wrote a whole street down as risky. The snack bar is on that street.",
      "question": "Moon Jeongtaek’s reason for refusal was not his shop but that loan from 3 years ago. What do you do?",
      "memo": [
        "312th line: Moon Jeongtaek (held back for the morning by Oh Minjeong)",
        "Detailed reason: 'commercial-area risk weighting'",
        "'Nearby major business FlowOn Gimpo center, related loan 2023-0412'"
      ],
      "choices": {
        "s4_bottom_read": {
          "label": "Read that one line out to Oh Minjeong as it is"
        },
        "s4_bottom_shot": {
          "label": "Photograph the reason screen with the time showing"
        },
        "s4_bottom_lead": {
          "label": "Call team leader Han Giho over before ringing Moon"
        }
      }
    },
    "s4_morning": {
      "place": "KD Bank Customer Center · Team leader’s desk",
      "clock": "08:40, 20 minutes to the head-office report",
      "text": "It is light outside, and the day shift is swiping in one by one. The head-office report form is up on the team leader’s monitor. It has three boxes. Notified, not notified, notes. Team leader Han Giho looks at the detailed-reason screen for a long time. 'Commercial-area risk weighting, huh.' He rubs his eyes with both hands. 'Stuff like this never shows on our screens. Just the top line.' He moves the cursor onto the completed box and back off it. 'If that box says 312 at 9, tonight never happened. If it says 311, I get a red dot next to my name.' He looks at you. 'In numbers, Analyst, what do you think is right to leave?'",
      "question": "The report form has only three boxes: notified, not notified, notes. What do you do?",
      "memo": [
        "Head-office report form: notified / not notified / notes",
        "312 means 'completion 100%'; 311 means a red dot by the team leader’s name",
        "The detailed reason doesn’t show on the team leader’s screen"
      ],
      "choices": {
        "s4_morning_honest": {
          "label": "Say to put down 311 and 1, the numbers as they are"
        },
        "s4_morning_note": {
          "label": "First decide together what goes in the notes box"
        },
        "s4_morning_call": {
          "label": "Ring Moon Jeongtaek together, the three of you, before 9"
        }
      }
    },
    "s4_aftershock": {
      "title": "9 A.M.",
      "place": "KD Bank Customer Center · Night desk 7",
      "clock": "08:55, 5 minutes to the head-office report",
      "text": "A day-shift counsellor stands behind desk 7, waiting. Oh Minjeong takes off her headset and wipes it with a disinfectant pad. The empathy count in the corner of the screen is past 312. She sticks a memo slip on the monitor, then peels it off again. 'In the morning this desk is someone else’s. Stick it up and it’s gone by 9.' At the team leader’s desk, Han Giho sits in front of the report form, and Moon Jeongtaek’s three photos and the detailed-reason screen are on your phone. Shouldering her bag, Oh Minjeong says, 'What I can leave under my name is one line of call notes. The team leader has the report. What will you leave, Analyst?'",
      "question": "5 minutes to the head-office report. What will you leave behind?",
      "memo": [
        "Oh Minjeong: one line of call notes",
        "Han Giho: the head-office report",
        "Your phone: three sales photos, the detailed-reason screen",
        "The ending you choose stays on this device only"
      ],
      "choices": {
        "s4_after_request": {
          "label": "Have the re-review request filed with the sales photos"
        },
        "s4_after_code": {
          "label": "Copy the detailed reason into the report’s notes box"
        },
        "s4_after_script": {
          "label": "Leave three plain lines in Oh Minjeong’s call notes"
        }
      }
    }
  },
  "outcomes": {
    "s4_after_request": {
      "title": "Request Pending",
      "text": "Team leader Han Giho attaches the three photos and types his own staff number into the requester box. At 9, the report goes up. Notified 311, not notified 1, notes 're-review request pending.' A receipt number comes up. He writes it on a sticky note and sticks it over 'No exceptions.' 'If it takes three months, I’ll look at it every day for three months.' In the afternoon a photo comes from Moon Jeongtaek. A tteokbokki pan with the burner lit. 'Open again today.' Nobody says what will become of the request."
    },
    "s4_after_code": {
      "title": "Notes",
      "text": "You read it out and team leader Han Giho types. One line in the notes box. 'Reason for refusal no. 312: commercial-area risk weighting, related loan 2023-0412. The customer’s sales clear the re-review standard.' At 9, the report goes up. No reply comes. The team leader prints that screen and sticks it beside his monitor. 'They say nobody reads the notes.' Then he adds, to himself, 'Still, it’s written under my name.' The next night, three night-shift counsellors stop in front of that printout."
    },
    "s4_after_script": {
      "title": "Three Lines",
      "text": "You write three lines in Oh Minjeong’s call-notes box. The reason may not be the customer’s shop. A re-review can be requested with three months of sales. The team leader files the request. Oh Minjeong reads it aloud once and presses save. 'Off script. Minus 0.5.' She smiles. The next night a photo goes up in the night shift’s group chat. On desk 7’s monitor, those three lines are stuck up in handwriting. Under them someone has written: 'Can we drop the rooting-for-you line?'"
    }
  }
};
