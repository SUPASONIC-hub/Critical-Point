/**
 * 번외 10 (src/nodes/side10.js) in English, for the English preview.
 *
 * A draft: translated with the glossary (앱출시-G), not yet edited by a
 * person. Words only, under the ids of the pack as the app is shipped it
 * (scripts/locale-words.mjs); the pack's label and title live in the
 * dictionary's `copy.sidePacks`, a scene or card left out here keeps its
 * Korean, and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "s10_start": {
      "title": "The Nameplate",
      "place": "Trigger Lab · Analysts’ Room",
      "clock": "September 13 (Sat) 21:00, two days after the cause meeting",
      "lead": "The analysts’ room on a Saturday night. On the desk by the window there are no things left, only a nameplate.",
      "text": "Do Yoonha taps the nameplate with a finger. Reviewer Oh Jinwoo. Since the cause meeting his phone has been off for two days. 'For someone who left without a word, his car gets around.' He shows you the parking log on the company card. Last night and the night before, the Onsae Care Gangseo hub car park, from 9 at night to 7 in the morning. The same company whose 312 red dots were on the wall. 'Why spend the night in the car park of the company that had the accident? I don’t think he went to write an apology.'",
      "question": "Oh Jinwoo has spent two nights at Onsae’s hub. What do you do?",
      "memo": [
        "Oh Jinwoo: no word for two days since the cause meeting",
        "Parking log: Onsae Care Gangseo hub, 9 p.m. to 7 a.m.",
        "312: the homes that got no care visit the day before the accident"
      ],
      "choices": {
        "s10_start_go": {
          "label": "Go to the Gangseo hub now"
        },
        "s10_start_log": {
          "label": "Print the parking log and take it"
        },
        "s10_start_note": {
          "label": "Leave a note on his desk and wait"
        }
      }
    },
    "s10_depot": {
      "title": "Dispatch by Hand",
      "place": "Onsae Care Gangseo Hub · Dispatch Room",
      "text": "The whiteboard in the Gangseo hub’s dispatch room is packed with a handwritten list. Since the accident, people have been dispatching by hand. Of 312, 271 lines are crossed out and 41 are left. Care worker Byeon Jeongsun holds a marker cap in her teeth as she talks. She has gone from house to house for Onsae for 11 years. 'That young one? Two nights now he’s been in my passenger seat. Won’t drink coffee, just looks at the table.' She taps the notebook beside the list. At the head of its last column, in ballpoint: “Houses that don’t speak up.” 'Forty-one houses tonight. If you’re coming, it’s the back seat.'",
      "question": "There is one seat in the car going round the last 41 houses. What do you do?",
      "memo": [
        "Dispatch by hand: 271 of 312 done, 41 houses left",
        "Byeon Jeongsun (58): home care worker, 11 years with Onsae",
        "The notebook’s last column: “Houses that don’t speak up”"
      ],
      "choices": {
        "s10_depot_ride": {
          "label": "Get in the back and go round"
        },
        "s10_depot_copy": {
          "label": "Photograph the notebook’s last column first"
        },
        "s10_depot_ask": {
          "label": "Ask what Oh Jinwoo has been asking"
        }
      }
    },
    "s10_car": {
      "title": "The Passenger Seat",
      "place": "Gangseo · Byeon Jeongsun’s Small Car",
      "text": "On Oh Jinwoo’s knees is a printout of the weighting table: how heavily each condition counts when the dispatch order is set. The margins are full of pencilled numbers. He isn’t surprised to see you. 'I knew Do Yoonha would look at the parking log.' He points to two lines of the table. No complaint history: down two places. Can’t be reached: down three. 'I looked at this table for 6 minutes and passed it. So I thought seeing each house it pushed back should take longer than 6 minutes.'",
      "question": "Oh Jinwoo is seeing for himself the houses the table he passed pushed back. What do you do?",
      "memo": [
        "No complaint history: down two places",
        "Can’t be reached: down three places",
        "Oh Jinwoo: 'It should take longer than 6 minutes'"
      ],
      "choices": {
        "s10_car_why": {
          "label": "Ask why he left without a word"
        },
        "s10_car_table": {
          "label": "Check the numbers in the margins with him"
        },
        "s10_car_quiet": {
          "label": "Ask nothing and ride along"
        }
      }
    },
    "s10_house": {
      "title": "I’m Fine",
      "place": "Gangseo · A Semi-Basement Flat",
      "text": "The first house is a semi-basement flat. The 82-year-old woman apologizes the moment she opens the door. Sorry they came so late at night, she says; she’s fine. In the sink, a bag of medicine from two days ago, unopened. Byeon Jeongsun says as she takes off her shoes, 'This house has never made a single complaint. No phone, either. So the table says this house isn’t urgent.' She opens the bag and sets aside the morning’s share. 'The ones who say they’re fine are the least fine. Do this 11 years and you know.'",
      "question": "A house that says it’s fine becomes a house the table calls not urgent. What do you do?",
      "memo": [
        "The woman (82): 0 complaints, no phone",
        "Medicine from two days ago, unopened",
        "Byeon Jeongsun: 'The ones who say they’re fine are the least fine'"
      ],
      "choices": {
        "s10_house_help": {
          "label": "Help sort the medicine, note the time"
        },
        "s10_house_record": {
          "label": "Find where the table pushed this house"
        },
        "s10_house_wait": {
          "label": "Wait in the car, check the next house"
        }
      }
    },
    "s10_weights": {
      "title": "Fourteen Pages",
      "place": "Gangseo · Byeon Jeongsun’s Small Car",
      "clock": "September 14 (Sun) 00:30",
      "text": "Parked outside a convenience store, Oh Jinwoo opens a file. Fourteen approval papers made the weighting table what it is. Confirmation calls cut from two to one, houses that can’t be reached moved to the back, review time set at 6 minutes. Each page a small concession, and a different approver’s name on each. The last box on the last page is his name. 'Mine was the last box, so mine is the only name the papers kept. I’m not saying it’s unfair.' He stops halfway through opening a rice ball. 'The other thirteen probably looked for about 6 minutes too.'",
      "question": "Of fourteen approvals, only the last name was kept. What do you do?",
      "memo": [
        "14 approval papers, a different approver on each",
        "The 6-minute review limit is one of those pages",
        "The name in the papers: Oh Jinwoo, the last box"
      ],
      "choices": {
        "s10_weights_list": {
          "label": "Copy out the fourteen names in order"
        },
        "s10_weights_six": {
          "label": "Find the page that set 6 minutes, ask"
        },
        "s10_weights_eat": {
          "label": "Tell him to eat the rice ball first"
        }
      }
    },
    "s10_former": {
      "title": "Night Shift",
      "place": "Gangseo · A 4th-Floor Studio",
      "text": "A 4th-floor studio with no lift. A man of 53 opens the door and stands without straightening his back. Until last year he was on the night shift at the FlowOn logistics centre; after he was let go, this year he became a care client. These two days he called no one. 'Lots of places must be busy. Why add me.' While Byeon Jeongsun changes his pain patches, he looks at Oh Jinwoo. 'You from the bank? Bank people came when they cut our centre too.' Oh Jinwoo can’t answer. The man laughs. 'No, I mean thanks. Been a while since anyone came at night.'",
      "question": "A man who calls no one is, on the table, a man who can’t be reached. What do you do?",
      "memo": [
        "The man (53): FlowOn night shift until last year",
        "Called no one these two days",
        "'Lots of places must be busy. Why add me'"
      ],
      "choices": {
        "s10_former_stay": {
          "label": "Stay until the patches are all on"
        },
        "s10_former_answer": {
          "label": "Answer straight that you’re from a bank"
        },
        "s10_former_number": {
          "label": "Stick the hub’s number on his fridge"
        }
      }
    },
    "s10_column": {
      "title": "Houses That Don’t Speak Up",
      "place": "Onsae Care Gangseo Hub · Dispatch Room",
      "text": "Back at the hub, twelve lines are left on the whiteboard. A notice has gone up. “Automatic dispatch resumes: September 15 (Mon) 06:00. No change to the weights.” Byeon Jeongsun opens the notebook’s last column. A small star by each house that doesn’t speak up, 11 years of them. 'Before the system came, we set the order with this. Since the system came, nobody’s asked.' Oh Jinwoo lays the notebook beside the weighting table. The starred houses are nearly all near the bottom of the table. Byeon Jeongsun adds, 'The notebook’s not the company’s. It’s mine.'",
      "question": "The notebook’s stars and the table’s order run backwards. What do you do?",
      "memo": [
        "Automatic dispatch resumes: September 15 (Mon) 06:00, weights as they are",
        "The notebook’s last column: a star by each quiet house, 11 years",
        "Byeon Jeongsun: 'The notebook’s mine'"
      ],
      "choices": {
        "s10_column_ask": {
          "label": "Ask first if the stars can go in the table"
        },
        "s10_column_count": {
          "label": "Count how far the table pushed starred houses"
        },
        "s10_column_leave": {
          "label": "Close the notebook, do the last twelve"
        }
      }
    },
    "s10_dawn": {
      "title": "Before 6",
      "place": "Onsae Care Gangseo Hub · Car Park",
      "text": "When the lines left reach 0, the sky starts to lighten. In the car park Oh Jinwoo turns his car key and stops. 'I didn’t say goodbye because I had nothing to say. Say sorry and it sounds like I did all of it; say it wasn’t me and it sounds like an excuse.' He folds the weighting table into his pocket. 'Monday morning I can hand in one page of opinion. One page. Write more than that and nobody reads it.' Byeon Jeongsun calls out as she locks the hub door. 'If you’re riding next week too, drink the coffee. First person in my car who only looks at a table.'",
      "question": "Oh Jinwoo is weighing the one page he’ll hand in Monday. What do you help with?",
      "memo": [
        "Oh Jinwoo: 'I had nothing to say'",
        "One page of opinion for Monday morning",
        "A day until automatic dispatch resumes"
      ],
      "choices": {
        "s10_dawn_draft": {
          "label": "Sketch the page’s outline together"
        },
        "s10_dawn_coffee": {
          "label": "Go and buy two coffees"
        },
        "s10_dawn_home": {
          "label": "Say sleep today, write tomorrow"
        }
      }
    },
    "s10_aftershock": {
      "title": "One Page",
      "place": "Trigger Lab · Analysts’ Room",
      "clock": "September 14 (Sun) 07:30",
      "text": "Sunday morning, Do Yoonha puts a coffee down on the desk by the window. Beside the nameplate lie three things: the folded weighting table, the list of names from the fourteen approval papers, and a photo of the last column of Byeon Jeongsun’s notebook. Oh Jinwoo has fallen asleep on the sofa. Do Yoonha says quietly, 'The man who left without a word came back without a word.' At 06:00 tomorrow automatic dispatch resumes. Before then there is only one page to hand in, and one thing can go on its first line.",
      "question": "What do you write on the first line of Oh Jinwoo’s page?",
      "memo": [
        "Automatic dispatch resumes: tomorrow 06:00",
        "One page: one thing on its first line",
        "The ending you choose stays on this device only"
      ],
      "choices": {
        "s10_after_column": {
          "label": "Ask for quiet houses as a field in the table"
        },
        "s10_after_names": {
          "label": "Write the fourteen approvers and the 6 minutes"
        },
        "s10_after_none": {
          "label": "Write nothing, send him home"
        }
      }
    }
  },
  "outcomes": {
    "s10_after_column": {
      "title": "One Star",
      "text": "The first line reads: 'A house that doesn’t speak up is not a house that isn’t urgent. Please give the care workers’ own records one field in the weights.' At 06:00 on Monday automatic dispatch resumes with the weights as they were. The page goes into Onsae’s operations team’s tray. That Friday a trial input field appears at Byeon Jeongsun’s hub, called “Notes from the field.” The first thing she writes in it is the semi-basement woman’s address and one star. How much the field changes the order is not yet in any table."
    },
    "s10_after_names": {
      "title": "Fourteen Boxes",
      "text": "The first line reads: 'This weighting table has fourteen approvers, and the 6-minute review limit was set by one of those pages too.' Below it run the fourteen names in date order, and at the very end, Oh Jinwoo’s own. At 06:00 on Monday automatic dispatch resumes with the weights as they were. The page goes to both Onsae and Trigger Lab. The papers still carry one name. But beside the seven blank signatures in the cause meeting’s minutes, someone pencils '14.'"
    },
    "s10_after_none": {
      "title": "Goodbye",
      "text": "You don’t write the page. You wake Oh Jinwoo and drive him to his door. Getting out, he bows his head for the first time. 'Thank you. This is my goodbye.' At 06:00 on Monday automatic dispatch resumes with the weights as they were. The handwritten list on the whiteboard is wiped. Byeon Jeongsun’s notebook stays in her bag, and that week three more stars go into its last column. On Friday night of that week, Oh Jinwoo’s car is in the Gangseo hub car park again."
    }
  }
};
