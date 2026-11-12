/**
 * 번외 1 (src/nodes/side01.js) in English, for the English preview.
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the pack as the app is shipped it
 * (scripts/locale-words.mjs); the pack's label and title live in the
 * dictionary's `copy.sidePacks`, a scene or card left out here keeps its
 * Korean, and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "s1_start": {
      "title": "Seven Boxes",
      "place": "Parking lot outside Trigger Lab, Hapjeong-dong",
      "clock": "December 20 (Sat) 09:10, the day after the HR committee",
      "lead": "The Saturday between the HR committee and the year-end party. Ban Jaewook sets out to find the seven of the 47 people in his notebook he has not yet visited.",
      "text": "On the passenger seat of Ban Jaewook’s old silver car lies a new notebook. There is one star sticker on the cover, and inside it is blank from the first page. From the back seat, Seoa says, 'I picked it for you.' Ban Jaewook holds out his phone. It is a photo of the table Kwon Dohyun drew on the break room whiteboard. In the box '7 people not yet visited', seven names are written. 'The HR committee ended yesterday. There’s no reason to visit these people now.' He starts the engine. 'That’s why I mean to go today. It’s the first time I’ve gone without a reason.'",
      "question": "On the day the reason to visit is gone, Ban Jaewook says he will visit the seven. What do you do?",
      "memo": [
        "7 not yet visited -- photo of Kwon Dohyun’s whiteboard",
        "New notebook: picked by Seoa, blank from the first page",
        "Year-end party tomorrow"
      ],
      "choices": {
        "s1_start_ride": {
          "label": "Go with him to the end, even on a day without a reason"
        },
        "s1_start_files": {
          "label": "First ask about the seven’s old investigations and sort them"
        },
        "s1_start_one": {
          "label": "Suggest meeting just one and heading back before lunch"
        }
      }
    },
    "s1_stickers": {
      "title": "Names Without Stars",
      "place": "In Ban Jaewook’s car, Inner Ring Road",
      "text": "At every red light, Seoa copies one name from the photo onto a sticky note and sticks it on the dashboard. Seven notes line up side by side. 'Dad, how do I give stars here? We haven’t met them yet.' While Ban Jaewook looks for an answer, Seoa peels one off. 'Yoo Jeongrye. It says this lady has a dry cleaner’s. Dry cleaners are open on Saturdays.' Ban Jaewook’s hands stop on the wheel for a moment. The oldest name of the seven: 2012. 'I gave her only five days.' Seoa sticks the note in front of him. 'Then give her the whole day today.'",
      "question": "Of the seven notes, Seoa has peeled one off. Whose name do you visit first?",
      "memo": [
        "Seven sticky notes, no stars yet",
        "Yoo Jeongrye: 2012, the oldest name of the seven",
        "Dry cleaner’s in Suyu-dong, open on Saturdays"
      ],
      "choices": {
        "s1_stickers_seoa": {
          "label": "Start with the name Seoa peeled off"
        },
        "s1_stickers_oldest": {
          "label": "Go there first: it’s the oldest name, from 2012"
        },
        "s1_stickers_near": {
          "label": "Traffic’s bad, so stop at nearby Suyu-dong first"
        }
      }
    },
    "s1_shop": {
      "title": "Jeongrye Cleaners",
      "place": "'Jeongrye Cleaners', a market alley in Suyu-dong",
      "text": "At the end of the market alley, lettering on a steamed-up glass door reads 'Jeongrye Cleaners -- Alterations · Dry Cleaning'. When the door opens, a woman holding an iron looks up. Ms. Yoo Jeongrye recognizes Ban Jaewook at once. 'It’s been 13 years, Investigator.' The iron does not go down. As Ban Jaewook starts to bow his head, she points her chin at the worktable. 'There’s nowhere to sit. Saturdays I’m short of hands. Fold those dress shirts.' Seoa rolls up her sleeves first. Ban Jaewook takes off his coat and hangs it on an empty hanger, then sees that the hanger has a number tag too, takes the coat back off and drapes it over his arm.",
      "question": "Ms. Yoo recognizes Ban Jaewook and puts him to work first. What do you do?",
      "memo": [
        "Yoo Jeongrye (61): former teller, KD Bank Suyu Branch",
        "Fired in 2012; opened the cleaner’s 4 years later",
        "Saturday morning: the most customers picking up clothes"
      ],
      "choices": {
        "s1_shop_fold": {
          "label": "Roll up my sleeves without a word and fold shirts first"
        },
        "s1_shop_ask": {
          "label": "Say why we came first, then ask about 13 years ago"
        },
        "s1_shop_wait": {
          "label": "Wait in the car until the customers clear out"
        }
      }
    },
    "s1_fold": {
      "title": "One Is Missing",
      "place": "Worktable, Jeongrye Cleaners",
      "text": "Ban Jaewook folds dress shirts. He lines up the collars, folds the sleeves to the same width, and when each one is done he checks its number tag against the ledger. Three customers take the shirts he folded and ask, 'Hired someone new, ma’am?' When Ms. Yoo answers, 'He’s here to audit me,' the customers laugh. They think it’s a joke. At the twelfth shirt, Ban Jaewook’s hands stop. 'Ma’am, one tag is missing. There’s no number 38.' Ms. Yoo puts down the iron. 'Same old habit. You said it just like that back then too. That one was missing.' She wipes her hands on her apron. '3 million won was missing, that day.'",
      "question": "Ban Jaewook’s habit has called up that day 13 years ago. What do you do?",
      "memo": [
        "12 shirts folded by Ban Jaewook, one tag missing",
        "Customers: 'Hired someone new?'",
        "2012: teller window cash 3 million won short"
      ],
      "choices": {
        "s1_fold_finish": {
          "label": "Fold the rest of the shirts, then hear her out"
        },
        "s1_fold_ticket": {
          "label": "First find the missing tag in the ledger and match it"
        },
        "s1_fold_stop": {
          "label": "Put the shirts down and ask about that day right away"
        }
      }
    },
    "s1_slip": {
      "title": "One Employee ID",
      "place": "Worktable, Jeongrye Cleaners",
      "text": "Ms. Yoo speaks with her hand still on the iron’s handle. March 2012, Window 3, KD Bank Suyu Branch. 30 minutes before closing, the branch manager told her to hand 3 million won in cash to a regular client’s driver first. The slip could be written tomorrow, he said. When the cash on hand did not balance on the closing screen, the branch manager said, 'Just make it match for now,' and she pressed 'Cash balanced' under her own employee ID. The slip never came; the audit did. Ban Jaewook looks down at the worktable. 'That year, the New York head office of Kingsdale Partners, the major shareholder, wanted cash incidents closed within five days. In five days, one employee ID was enough. The branch manager’s words were nowhere on record.'",
      "question": "The spoken order left no trace; one employee ID did. What do you do?",
      "memo": [
        "March 2012, Window 3, Suyu Branch: cash 3 million won short",
        "Branch manager: 'the slip tomorrow', 'just make it match' -- spoken only",
        "'Cash balanced' on the closing screen: Yoo Jeongrye’s employee ID",
        "Audit closed in five days -- the target of the New York head office’s quarterly review"
      ],
      "choices": {
        "s1_slip_now": {
          "label": "Ask where that branch manager is now and what he does"
        },
        "s1_slip_lunch": {
          "label": "Pause the story and suggest having lunch together first"
        },
        "s1_slip_target": {
          "label": "Tell Ban Jaewook not to blame it on the head office’s target"
        }
      }
    },
    "s1_lunch": {
      "title": "Half a Star",
      "place": "Worktable, Jeongrye Cleaners",
      "text": "Three jajangmyeon and one jjamppong ordered through a delivery app sit beside the ironing board. Seoa is sharing out the pickled radish when she looks up at Ms. Yoo. 'How many stars will you give my dad?' Ban Jaewook’s chopsticks stop. Ms. Yoo thinks for a long time. 'Half.' 'Why half?' 'Well, he came.' Seoa cuts a star sticker in half and sticks it on the cover of the new notebook. Ms. Yoo sends the money for the food from her phone. 'I don’t go to bank windows. Not once since that day. When I stand at a window my hands shake, so I do it all by app.'",
      "question": "Ms. Yoo gives half a star and says she never goes to bank windows. What do you do?",
      "memo": [
        "Ban Jaewook’s rating: half a star -- 'well, he came'",
        "Yoo Jeongrye: has not been to a bank window since 2012",
        "Yoo Jeongrye paid for lunch by app"
      ],
      "choices": {
        "s1_lunch_listen": {
          "label": "Ask nothing more about windows; listen to the end"
        },
        "s1_lunch_star": {
          "label": "Ask with Seoa when the other half comes"
        },
        "s1_lunch_app": {
          "label": "Ask if anything trips her up when banking by app"
        }
      }
    },
    "s1_tuesday": {
      "title": "Five on Tuesday",
      "place": "Clothes rail, Jeongrye Cleaners",
      "text": "Hanging up folded shirts, Ban Jaewook stops in front of one bundle. The tag on the plastic reads 'Gong Taesik · dress shirts 5 · heavy starch on collars · Tue'. The name of the Suyu branch manager back then. Ms. Yoo speaks without stopping her ironing. 'He retired and lives around here. For 4 years he’s brought in five every Tuesday. He doesn’t recognize me.' She sprinkles water on the iron. 'So I starch the collars hard. Very hard. So his neck is a little uncomfortable.' Seoa bursts out laughing, then sees her father’s face and covers her mouth. Ban Jaewook looks at the writing on the tag for a long time. 13 years ago, he never once wrote this name down.",
      "question": "The man who gave the order 13 years ago comes to this cleaner’s every Tuesday. What do you do?",
      "memo": [
        "Tag: Gong Taesik, dress shirts 5, heavy starch on collars, Tuesday",
        "Gong Taesik: Suyu branch manager in 2012, retired with no discipline",
        "A regular for 4 years -- does not recognize Yoo Jeongrye"
      ],
      "choices": {
        "s1_tuesday_meet": {
          "label": "Come back Tuesday and meet Gong Taesik in person"
        },
        "s1_tuesday_proof": {
          "label": "Look for any record of that order still left"
        },
        "s1_tuesday_leave": {
          "label": "Act as if I never saw the tag; help with the ironing"
        }
      }
    },
    "s1_call": {
      "title": "One Truck",
      "place": "Alley outside Jeongrye Cleaners",
      "text": "Out in the alley, Ban Jaewook’s phone rings. It is Jung Taeo. When he hears about Tuesday, the sound of skewers being turned stops on the other end. 'He comes on Tuesdays? Then I’ll park my truck outside the cleaner’s that day. Hand out tteok skewers for free and there’ll be a line down the alley. He’ll have to queue to get in too.' When Ban Jaewook answers, 'That’s obstructing a business,' Jung Taeo laughs. 'Investigator, my branch manager got two bouquets at his retirement ceremony. What’s one wait in line?' He lowers his voice. 'But ask her first. Whether she wants to meet him. I didn’t want to see that man’s face.'",
      "question": "Jung Taeo offers to park his truck, but says to ask her first whether she wants to meet. What do you do?",
      "memo": [
        "Jung Taeo: offers to park the truck outside the cleaner’s on Tuesday",
        "Guro branch manager: retired with no discipline, 2 bouquets",
        "'Ask her first whether she wants to meet him'"
      ],
      "choices": {
        "s1_call_ask": {
          "label": "Ask Ms. Yoo first whether to meet Gong Taesik"
        },
        "s1_call_truck": {
          "label": "Say I’m in on the Tuesday truck plan"
        },
        "s1_call_letter": {
          "label": "Decide to send Gong Taesik a letter asking for the facts"
        }
      }
    },
    "s1_record": {
      "title": "The Charger Box",
      "place": "Counter, Jeongrye Cleaners",
      "text": "From the counter drawer, Ms. Yoo takes out the phone she used in 2012. A corner of the screen is cracked, and the battery died long ago. On the bank’s side, the records are likely gone, past their retention period. There is no charger that fits. Seoa digs through the box of things customers left behind and holds up an old charger. 'Does this fit? The end is flat.' The screen comes on and the message inbox opens. March 2012, the branch manager’s number. 'Jeongrye, once the driver leaves, balance the closing first. I’ll do the slip tomorrow.' Ban Jaewook looks at the message for a long time. Ms. Yoo says, 'I didn’t show you back then. You didn’t ask, Investigator.'",
      "question": "A message no one asked about 13 years ago is on the screen. What do you do?",
      "memo": [
        "2012 phone: turned on with a charger a customer left",
        "Branch manager’s text: 'Balance the closing first. The slip tomorrow, I’ll'",
        "The bank’s records: likely gone, past the retention period",
        "'You didn’t ask, Investigator'"
      ],
      "choices": {
        "s1_record_photo": {
          "label": "Photograph the message screen with the date showing"
        },
        "s1_record_hers": {
          "label": "Leave it to Ms. Yoo what to do with the message"
        },
        "s1_record_step": {
          "label": "Step back so Ban Jaewook speaks first"
        }
      }
    },
    "s1_letter": {
      "title": "The Paper Her Sister Believed",
      "place": "Worktable, Jeongrye Cleaners",
      "text": "As the sun goes down, the customers stop coming. Ms. Yoo takes a folded sheet of paper from her apron pocket. It is the dismissal notice that came by registered mail in 2012. The folds are so worn that the letters break off along them. 'My older sister got this first. Even when I told her it wasn’t me, she believed this paper. If the bank says so, well, she said.' She folds the paper again. 'One sheet of company paper was stronger than my word.' Seoa takes hold of Ban Jaewook’s sleeve. Ms. Yoo looks at Ban Jaewook. 'What did you write about me back then, Investigator?' Ban Jaewook answers. '3 million won short, closing confirmed by Yoo Jeongrye. That’s what I wrote. I didn’t write the branch manager’s name.'",
      "question": "For 13 years, one sheet of company paper was stronger than her word. What do you do?",
      "memo": [
        "2012 dismissal notice: registered mail, her sister got it first",
        "'One sheet of company paper was stronger than my word'",
        "The line Ban Jaewook wrote: 3 million won short, closing confirmed by"
      ],
      "choices": {
        "s1_letter_sister": {
          "label": "Offer to help tell her sister the facts"
        },
        "s1_letter_line": {
          "label": "Go through the manager’s words missing from that line"
        },
        "s1_letter_quiet": {
          "label": "Without a word, fold the notice and hand it back"
        }
      }
    },
    "s1_aftershock": {
      "title": "The First Page",
      "place": "Outside Jeongrye Cleaners",
      "clock": "16:30, toward sunset",
      "text": "In front of the cleaner’s, its shutter half down, Ban Jaewook takes out the new notebook. The star sticker is on the cover, and inside it is still blank from the first page. For 20 years he wrote down names on the days he let people go. Today he let no one go. He uncaps his pen, then caps it again. 'I don’t know what to make the first line of this notebook.' Ms. Yoo stands with her hand on the shutter handle. Seoa waits, holding one sticky note. The other six are still stuck on the car’s dashboard. Ban Jaewook holds the notebook out toward you. 'Help me decide.'",
      "question": "The new notebook’s first page is blank. What goes on the first line?",
      "memo": [
        "New notebook: blank from the first page",
        "Six of the seven sticky notes left",
        "The ending you pick stays only on this device"
      ],
      "choices": {
        "s1_after_hers": {
          "label": "Hand the first page to Ms. Yoo to write herself"
        },
        "s1_after_order": {
          "label": "Write the manager’s words and the date above her name"
        },
        "s1_after_blank": {
          "label": "Leave the first page blank; move on to the next note"
        }
      }
    }
  },
  "outcomes": {
    "s1_after_hers": {
      "title": "Her Handwriting",
      "text": "Ms. Yoo takes the pen and writes on the first page. 'Yoo Jeongrye. March 2012, did as told. I wrote this line.' Her writing shakes a little. Not as much as at a bank window. Ban Jaewook adds nothing beneath that line. For the first time in 20 years, the first line in his notebook is in someone else’s hand. Seoa puts a star sticker beside it. A whole one, not cut in half."
    },
    "s1_after_order": {
      "title": "The Name Written Above",
      "text": "Ban Jaewook writes the branch manager’s name on the first line. 'Gong Taesik. March 2012, 30 minutes before closing, gave the order by word of mouth.' On the second line he writes Ms. Yoo’s name. 'Pressed her employee ID as told.' For the first time in 20 years, the one who gave the order is on top. Ms. Yoo reads the two lines for a long time, then pulls the shutter all the way down. 'On Tuesday I’ll go easy on the starch in his collars. Now that it’s written down.'"
    },
    "s1_after_blank": {
      "title": "The Blank First Page",
      "text": "You close the notebook and hand it back to Ban Jaewook. Ms. Yoo nods. 'I don’t need to be written down anywhere. You came today.' Ban Jaewook puts the empty notebook in the inside pocket of his coat. Seoa sticks the note she was holding on the inside of the cleaner’s glass door and draws a star on it. When they get in the car, six notes are left on the dashboard. Ban Jaewook starts the engine. 'Next Saturday there’s no reason either.'"
    }
  }
};
