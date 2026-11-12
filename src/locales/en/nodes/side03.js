/**
 * 번외 3 (src/nodes/side03.js) in English, for the English preview.
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the pack as the app is shipped it
 * (scripts/locale-words.mjs); the pack's label and title live in the
 * dictionary's `copy.sidePacks`, a scene or card left out here keeps its
 * Korean, and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "s3_start": {
      "title": "Two at a Time",
      "place": "FlowOn fulfillment center · Night-shift break room",
      "clock": "November 8 (Sat) 21:30, 30 minutes before the night shift clocks in",
      "lead": "A Saturday night in November, 3 weeks before the first snow. Night-shift foreman Kang Taemin calls you in, saying he needs someone who is good with numbers.",
      "text": "Kang Taemin holds out a visitor’s hi-vis vest. As always, two cup noodles are tucked into the pocket of his own vest. 'Sorry to call you out on a Saturday night. You never came when I asked you over in the daytime.' He nods at the break room’s notice board. A single sheet of A4 is pinned there. 'Tonight, night shift: individual throughput will be measured. The results will be taken into account at the year-end contract renewal.' Under it someone has written in ballpoint, 'Why a Saturday, of all nights.' Kang Taemin pulls off his gloves and tucks them into his vest pocket. 'They’re measuring us in numbers. But you read numbers better than anyone, Analyst. Just stand beside me and watch, tonight.'",
      "question": "Kang Taemin asks you to stand beside him and watch tonight’s measurement. What do you do?",
      "memo": [
        "Measurement notice: tonight, night shift, individual throughput",
        "'The results will be taken into account at the year-end contract renewal'",
        "Night shift of 80, 22:00 ~ 06:00",
        "Kang Taemin’s vest pocket: two cup noodles"
      ],
      "choices": {
        "s3_start_vest": {
          "label": "Put on the vest and say you’ll stay beside him to the end of the night"
        },
        "s3_start_notice": {
          "label": "Photograph the notice and ask first how the measuring works"
        },
        "s3_start_light": {
          "label": "Say that since it’s Saturday night, you’ll just look around"
        }
      }
    },
    "s3_board": {
      "title": "The Smiling Face",
      "place": "Night-shift break room · In front of the ranking screen",
      "text": "On the big screen on the break-room wall, a table nobody has seen before comes up. Live throughput rankings. How many items each person picked, loaded and packed in an hour: a bar grows beside each name. The bottom row is red, and beside it sit a smiling-face picture and 'Keep it up!' Bae Sookyung, 9 years on the packing line, tightens her wrist brace and looks up at the screen. 'What do I get for 1st place? And 2nd place gets one more wrist surgery?' The break room bursts out laughing. She pats your back twice. 'But that bar doesn’t count me re-taping things. A split box has to be packed again before it can go out.' At the very top of the screen, Kang Taemin’s name is already up.",
      "question": "A smiling-face picture is cheering on the name at the bottom. What do you look at first?",
      "memo": [
        "Ranking screen: items handled per hour, a bar for every name",
        "Bottom row: red, a smiling face, 'Keep it up!'",
        "Bae Sookyung: a box packed again is not counted"
      ],
      "choices": {
        "s3_board_laugh": {
          "label": "Hear Bae Sookyung’s joke out and laugh along"
        },
        "s3_board_rule": {
          "label": "Note down what the ranking counts and what it leaves out"
        },
        "s3_board_floor": {
          "label": "Leave the screen and head straight down to the floor"
        }
      }
    },
    "s3_line": {
      "title": "The Shelves of Building B",
      "place": "Between the shelves of Building B, fulfillment center",
      "text": "Between the shelves of Building B, Kang Taemin all but runs, the scanner on his wrist beeping. Beep, load, beep, load. No wonder he is at the top of the screen. Then, at the end of the aisle, he stops. A coworker past fifty is straightening his back in front of six bundles of 2-liter bottled water. Without a word, Kang Taemin hoists three bundles onto his shoulder and carries them to the cart. All the while the scanner on his wrist is silent, and his bar on the break-room screen stops too. Kang Taemin comes back and catches his breath. 'That doesn’t count. But if I don’t do that, he doesn’t come in tomorrow.' From the far end of the aisle, over by the conveyor, comes a scrape of metal.",
      "question": "The No. 1 on the ranking is doing work the ranking does not catch. What do you do?",
      "memo": [
        "Kang Taemin: 1st in throughput per hour",
        "Carrying water bundles -- not picked up by the scanner",
        "A scrape of metal from over by Conveyor 3"
      ],
      "choices": {
        "s3_line_carry": {
          "label": "Help carry the rest of the water bundles to the cart"
        },
        "s3_line_time": {
          "label": "Time how long the scanner stays silent on your watch"
        },
        "s3_line_pack": {
          "label": "Leave the noise and go to the packing line first"
        }
      }
    },
    "s3_jam": {
      "title": "Conveyor 3",
      "place": "Under Conveyor 3, Building B",
      "text": "Conveyor 3 has stopped, and two work boots stick out from under the belt. Both sets of laces are undone. Yoo Haon, the youngest on the night shift, is scraping between the rollers with the hairpin she had tucked behind her ear. 'Tape got wound round the roller? And the engineer comes in Monday?' The belt jolts and starts to turn. Yoo Haon crawls out and checks her phone with oily hands. In the red row at the bottom of the break-room screen is her name. Idle 52 minutes. It means time spent not working. The smiling face cheers her on. 'I’m at the bottom tonight? I guess fixing things isn’t work?' She tucks the hairpin back behind her ear.",
      "question": "The person who fixed the stopped belt is at the bottom of the ranking. What do you do?",
      "memo": [
        "Conveyor 3: stopped, tape wound round a roller",
        "Maintenance engineer: comes in Monday",
        "Yoo Haon: idle 52 minutes, bottom of the ranking"
      ],
      "choices": {
        "s3_jam_praise": {
          "label": "Tell her straight out that you saw her fix it, and that she did well"
        },
        "s3_jam_log": {
          "label": "Write down when the belt stopped and when it turned again"
        },
        "s3_jam_later": {
          "label": "Put off talking about the 52 minutes until the break"
        }
      }
    },
    "s3_tape": {
      "title": "Three Turns of Tape",
      "place": "The end of the packing line",
      "text": "Boxes with split corners are piled at the end of the packing line. Bae Sookyung opens them one by one, takes out what’s inside, packs it into a new box and runs the tape round three times. She runs it with her left hand, not her right. 'My right hand’s on a break. My left’s got 9 years in.' A box packed again does not show up on the ranking screen. It was already counted to whoever packed it first. Bae Sookyung laughs as she cuts the tape. 'If I don’t do this, someone gets a split box in the morning. And whoever gets it thinks I’m the one who packed it.' She fiddles with the pain patches in her apron pocket. 'My daughter’s tuition isn’t paid off yet. So I have to keep this job a long time.'",
      "question": "Bae Sookyung repacks, left-handed, the boxes nobody counts. What do you do?",
      "memo": [
        "Packing line: repacking boxes with split corners",
        "A box packed again: not on the ranking (counted to whoever packed it first)",
        "Bae Sookyung: tape with her left hand, 'My right hand’s on a break'"
      ],
      "choices": {
        "s3_tape_hold": {
          "label": "Hold the box for her and help press down the end of the tape"
        },
        "s3_tape_count": {
          "label": "Count, one by one, the boxes packed again tonight"
        },
        "s3_tape_rest": {
          "label": "Hear about her right hand and suggest moving the break earlier"
        }
      }
    },
    "s3_break": {
      "title": "A 30-Minute Break",
      "place": "Night-shift break room",
      "text": "Four electric kettles in the break room boil all at once. All 80 of them scatter onto chairs, the floor, the spaces in front of the lockers. Each of the 80 lockers has a name on it in masking tape. Kang Taemin takes two cup noodles from his vest pocket and sets one in front of you. Bae Sookyung blows on her soup and laughs. 'The foreman always buys them two at a time. Ask him why and he won’t tell you.' Instead of answering, Kang Taemin snaps his chopsticks apart. Yoo Haon shows the ranking screen on her phone. For the 30-minute break, all 80 bars have stopped together. 'Look at this? Right now we’re all at the bottom together?' This time even Kang Taemin laughs.",
      "question": "All 80 take the same 30 minutes off, and the screen counts those 30 minutes as everyone’s blank. What do you do?",
      "memo": [
        "30-minute break: four electric kettles",
        "80 lockers, names in masking tape",
        "Kang Taemin’s cup noodles: always two -- he won’t say why",
        "During the break, all 80 bars stop together"
      ],
      "choices": {
        "s3_break_eat": {
          "label": "Don’t bring up the numbers until the cup noodles are finished"
        },
        "s3_break_list": {
          "label": "Suggest counting together the work the screen didn’t catch"
        },
        "s3_break_sheet": {
          "label": "Use the break to go and look at the manager’s screen first"
        }
      }
    },
    "s3_count": {
      "title": "Counting by Hand",
      "place": "Night-shift break room · In front of the whiteboard",
      "text": "Before the break ends, Yoo Haon wheels over the whiteboard. You rule it into columns, and the 80 call things out one at a time. Fixed the conveyor: three times. Split boxes packed again: thirty-eight. Water bundles carried for someone else: twenty-something times, nobody knows exactly. Took two new hires round with them. Yoo Haon holds the marker and starts talking faster. 'The tape wound round the roller? That fell off the split boxes? So Auntie Sookyung’s work and mine are one line?' Bae Sookyung pats her back twice. 'You only just worked that out?' The board fills up fast. On the ranking screen, not one of these lines has a single box.",
      "question": "The work the 80 called out has filled the board, and none of it is on the screen. What do you do?",
      "memo": [
        "Work counted by hand: conveyor fixed 3 times, 38 boxes packed again",
        "Water bundles carried for someone else: twenty-something times, nobody knows exactly",
        "Ranking screen: not one box for these lines"
      ],
      "choices": {
        "s3_count_names": {
          "label": "Write one person’s name beside every line, together"
        },
        "s3_count_photo": {
          "label": "Photograph the board, with the time showing, before it is wiped"
        },
        "s3_count_line": {
          "label": "Write the 'one line' Yoo Haon found separately, in big letters"
        }
      }
    },
    "s3_sheet": {
      "title": "The Reason Field",
      "place": "The center’s manager desk",
      "text": "Tonight’s measurement sheet is up on the manager desk’s monitor. At six it goes to head office by itself. For every stretch a bar stopped, an 'idle reason' has to be picked. There are four to pick from. Break, training, waiting on equipment, other. There is no 'fixing', no 'carrying', no 'repacking'. The night manager yawns as he speaks. 'Just put other. Nobody reads the notes anyway.' Kang Taemin pulls off his gloves and tucks them into his vest pocket. He points with a finger at his own name on the screen, then at Yoo Haon’s. 'The top and the bottom did about the same work tonight. That field just doesn’t know it.'",
      "question": "There is no field to pick for the fixing and the carrying. What do you do?",
      "memo": [
        "Measurement sheet: sent to head office automatically at 06:00",
        "Idle reasons: break / training / waiting on equipment / other",
        "Night manager: 'Nobody reads the notes anyway'"
      ],
      "choices": {
        "s3_sheet_try": {
          "label": "Pick one reason and try writing a line in the notes"
        },
        "s3_sheet_ask": {
          "label": "Ask the manager whether a reason can be added"
        },
        "s3_sheet_close": {
          "label": "Leave it untouched until six and move on to wrapping up"
        }
      }
    },
    "s3_dawn": {
      "title": "The Five O’Clock Trucks",
      "place": "The loading dock",
      "text": "The loading dock’s shutter goes up, and the early-morning delivery trucks pull out one by one. Tonight’s repacked boxes are in there too. Bae Sookyung sits on the edge of the dock and unwraps her wrist brace. The sky is still pitch dark. 'The people who get them don’t know. Whether a box was packed twice, or who packed it.' She laughs and pats your back twice. 'And that’s right, them not knowing. Making it so they don’t need to know is our job.' Yoo Haon waves at a departing truck. Kang Taemin, counting the trucks out beside the shutter, speaks up. 'I hope next year goes just like this.' Nobody answers. One more truck pulls out.",
      "question": "Work the people receiving it will never know about rolls out on the trucks. What do you do?",
      "memo": [
        "Early-morning delivery trucks leave, the repacked boxes with them",
        "Bae Sookyung: 'Making it so they don’t need to know is our job'",
        "Kang Taemin: 'I hope next year goes just like this'"
      ],
      "choices": {
        "s3_dawn_sit": {
          "label": "Sit on the edge with them and watch until the last truck leaves"
        },
        "s3_dawn_count": {
          "label": "Check tonight’s truck count against Kang Taemin’s"
        },
        "s3_dawn_wave": {
          "label": "Stand by Yoo Haon and wave at the trucks with her"
        }
      }
    },
    "s3_aftershock": {
      "title": "The Six O’Clock Send",
      "place": "Night-shift break room",
      "clock": "05:50, 10 minutes before the send",
      "text": "The line to swipe out stretches to the door. The whiteboard still holds the work counted by hand tonight, and the manager desk’s monitor shows the measurement sheet waiting for the six o’clock send. At the top of the ranking screen, Kang Taemin; at the bottom, Yoo Haon. The smiling face is still saying 'Keep it up!' Kang Taemin stacks two empty cup-noodle cups and drops them in the bin. 'It was an ordinary night. It’s always like this.' He looks from the whiteboard to the monitor and back. 'That gets wiped by the day shift in the morning, and that goes to head office. You decide, Analyst. What to leave.'",
      "question": "The ordinary night is drawing to an end. What will you leave behind?",
      "memo": [
        "Whiteboard: wiped when the day shift comes in",
        "Measurement sheet: to head office at 06:00",
        "The ending you choose stays on this device only"
      ],
      "choices": {
        "s3_after_board": {
          "label": "Stick a 'Please don’t erase' note on the board"
        },
        "s3_after_memo": {
          "label": "Tell Yoo Haon to write down her own fixes herself"
        },
        "s3_after_note": {
          "label": "Write everything done tonight in the measurement sheet’s notes"
        }
      }
    }
  },
  "outcomes": {
    "s3_after_board": {
      "title": "Please Don’t Erase",
      "text": "You stick a note on a corner of the whiteboard. 'Please don’t erase. What the night shift did tonight.' At half past six, the day-shift foreman comes over with the eraser and reads the note. He stands there a long while, then puts the eraser down and adds one more line at the bottom. 'Day shift: swapped in forklift batteries for someone else, seven times.' In the afternoon a photo comes from Kang Taemin. The board has five more lines. Since nobody ever decided who would wipe it, the board stays as it is all that week."
    },
    "s3_after_memo": {
      "title": "One Line at a Time",
      "text": "You tell Yoo Haon: a fix becomes work once the person who made it writes it down. Yoo Haon takes out her hairpin and tucks it back in. Then she writes the first line on her phone, its screen cracked. 'Conveyor 3, tape on the roller, 52 minutes.' Kang Taemin, reading over her shoulder, says, 'If you write it down, that’s work.' The next night a photo goes up in the night shift’s group chat. The memo has grown to two lines. Under it, Yoo Haon asks, 'Is it okay if I keep writing these?'"
    },
    "s3_after_note": {
      "title": "Other",
      "text": "Kang Taemin types, and you read it out to him. In every idle field you pick 'other', and in the notes you write what was done, one line at a time. Repaired Conveyor 3. Carried water bundles. Repacked thirty-eight split boxes. At six, the send goes through. No reply comes. Kang Taemin swipes out and says, 'They said nobody reads it.' Then he adds, to himself, 'Still, it’s written down.' He tucks a fresh cup noodle into your vest pocket. 'Come in the daytime next time.'"
    }
  }
};
