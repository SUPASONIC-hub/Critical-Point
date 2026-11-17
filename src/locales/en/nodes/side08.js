/**
 * 번외 8 (src/nodes/side08.js) in English, for the English preview.
 *
 * A draft: translated with the glossary (앱출시-G), not yet edited by a
 * person. Words only, under the ids of the pack as the app is shipped it
 * (scripts/locale-words.mjs); the pack's label and title live in the
 * dictionary's `copy.sidePacks`, a scene or card left out here keeps its
 * Korean, and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "s8_start": {
      "title": "The Opinion Box",
      "place": "KD Capital Head Office · Risk Management",
      "clock": "July 10 (Fri) 15:20, three days before the collection review",
      "lead": "A Friday afternoon before the monsoon. On a Risk Management desk lies one copy of Monday’s collection-review agenda.",
      "text": "Chae Ian taps the agenda’s first page with his pencil. Dodam Injection, a plastic injection shop in the Banwol Industrial Complex, Ansan, twenty-three people. It runs four injection machines on a lease (equipment rented for a monthly fee) and is late with July’s fee of 21 million won. Monday’s 9 o’clock agenda has two items. Take back the four machines, and, under Article 12 of the contract, take directly the 42 million won delivery payment a customer owes the shop on July 15. 'Only Risk Management’s opinion box is empty.' He points his pencil at one line on the group’s combined screen. 'Affiliate business: KD Bank retirement pension, company payments 7 months behind.' 'People say that line isn’t our business.'",
      "question": "You have to write an opinion on Monday’s collection agenda. What do you look at first?",
      "memo": [
        "Dodam Injection: 4 injection machines on lease, 21 million won a month",
        "Monday 9:00 agenda: take back the machines + the 42 million won delivery payment of July 15",
        "Group screen: KD Bank retirement pension, company payments 7 months behind"
      ],
      "choices": {
        "s8_start_ledger": {
          "label": "Open the lease payment record from January"
        },
        "s8_start_line": {
          "label": "Print that one line on the group screen first"
        },
        "s8_start_brief": {
          "label": "Read only the summary and ask the team in charge"
        }
      }
    },
    "s8_ledger": {
      "title": "Six Months",
      "place": "KD Capital Head Office · Collections Team",
      "text": "Chae Ian goes down to the Collections Team with you. 'The numbers are all on his monitor.' Deputy Manager Seol Gyeongmin turns his monitor to show you. Dodam Injection’s lease payments. From January to June, on the 5th of every month, 21 million won, never a day late. In January’s memo field, a line he wrote: “Call with CEO: promised lease first, collection held. Back on track.” Those six months overlap the seven months behind on the group screen. Seol Gyeongmin says with a smile that everyone does it, and that the pension is the bank’s business. A group message from his team leader pops up on his phone: “Congrats on No. 1 in collection rate for the first half ^^ Keep it on track in the second half!”",
      "question": "Six months 'back on track' overlap seven months unpaid. What do you do?",
      "memo": [
        "January to June: 21 million won lease every month, never late",
        "January memo: 'promised lease first, collection held'",
        "Same months: no company payment into the KD Bank retirement pension"
      ],
      "choices": {
        "s8_ledger_note": {
          "label": "Print the January memo with its timestamp"
        },
        "s8_ledger_ask": {
          "label": "Ask who first brought up that order"
        },
        "s8_ledger_close": {
          "label": "Call it the Collections Team’s job and close the screen"
        }
      }
    },
    "s8_factory": {
      "title": "Machine 3",
      "place": "Banwol Industrial Complex, Ansan · Dodam Injection factory",
      "text": "In the factory, the machines gone quiet, only injection machine 3 has its lights on. Binod Thapa is brushing out the gaps in the mould. He came from Nepal and has worked in this factory alone for 9 years and 8 months; he answers in Korean. 'Today is my last shift. Tomorrow night I fly to Kathmandu.' He peels off a note stuck beside the machine and shows you. A handwritten temperature chart. 'On rainy days this machine needs 3 degrees more. Nobody knows.' Seeing the KD Capital name on your folder, he stops for a moment. 'Are you the one taking the machines on Monday? Then does my severance go with the machines too?'",
      "question": "The night before he leaves, he asks about his severance. How do you answer?",
      "memo": [
        "Binod Thapa: from Nepal, 9 years 8 months at Dodam Injection, machine 3",
        "Departure: July 11 (Sat) 23:50, Incheon",
        "Machine 3 temperature chart: 'rainy days, 3 degrees up'"
      ],
      "choices": {
        "s8_fac_plain": {
          "label": "Tell him plainly severance is apart from the machines"
        },
        "s8_fac_owner": {
          "label": "Suggest going together to ask the CEO"
        },
        "s8_fac_screen": {
          "label": "Look at his retirement pension screen with him first"
        }
      }
    },
    "s8_owner": {
      "title": "Seven Envelopes",
      "place": "Dodam Injection · Office",
      "text": "Binod Thapa takes you to the office. 'Boss, please tell this person.' From a drawer, CEO Sim Jaeman takes out seven envelopes. KD Bank retirement pension, “Notice of late company payment”. December’s to June’s, every one opened and read. He says briefly that he knew all of it. In January the Capital people called: if he paid the lease first, they wouldn’t take the machines; if the machines stop, twenty-three people’s wages stop, so he meant to pay the pension in one go when work came in. The payments behind: 36.4 million won for twenty-three people. He looks out at the light of machine 3. The 42 million won coming on the 15th is the last money, he says, and he meant to pay it in with that.",
      "question": "The last delivery payment will go one way: the lease or the pension. What do you do?",
      "memo": [
        "7 late-payment notices in the drawer, all read",
        "Payments behind: 23 people, 36.4 million won",
        "July 15 delivery payment, 42 million won: the company’s last money"
      ],
      "choices": {
        "s8_owner_copy": {
          "label": "Copy the seven notices in date order"
        },
        "s8_owner_list": {
          "label": "Take down each of the twenty-three people’s missing amounts"
        },
        "s8_owner_blame": {
          "label": "Press him first on not paying while he knew"
        }
      }
    },
    "s8_pension": {
      "title": "The Number That Stopped",
      "place": "Dodam Injection · Container dormitory",
      "text": "In front of the container dormitory stand two bags packed to 23 kilograms. Binod Thapa holds out the KD Bank retirement pension screen on his phone. Saved so far: 23.1 million won. The last company payment was last November. 'Since December the number hasn’t moved. I thought the app was broken.' Of the seven months behind, his share is 1.82 million won. Not one notice text ever came to him. The notices went only to the company. He turns off the screen. 'Nine times I missed Dashain at home. This money is those nine times.'",
      "question": "One day before he leaves, his 1.82 million won share is missing. What do you do?",
      "memo": [
        "Retirement pension saved: 23.1 million won, last company payment last November",
        "His share of the seven months behind: 1.82 million won",
        "Late-payment notices: to the company only, 0 times to him"
      ],
      "choices": {
        "s8_pen_shot": {
          "label": "Take a picture of the screen with the time showing"
        },
        "s8_pen_claim": {
          "label": "Find with him a claim he can file before he leaves"
        },
        "s8_pen_promise": {
          "label": "Promise to tell him Monday’s result"
        }
      }
    },
    "s8_rule": {
      "title": "Other Remarks",
      "place": "KD Capital Head Office · Risk Management",
      "text": "Late at night one light is on in Risk Management. Chae Ian has not gone home yet. When you put down two pages of notes, he takes the pencil from behind his ear. 'The opinion box is 400 characters. It’s a box for whether our company loses money.' He points to small print under the box. Other remarks. 'Nobody reads this part. So you can write anything, and whatever you write, nothing happens.' He adds, without a smile, 'Write that the 42 million won should wait behind the pension, and your name goes on our 42 million won loss. That’s what this department decides.'",
      "question": "It is a box where a loss gets a name. What do you do?",
      "memo": [
        "Opinion box, 400 characters: measured by KD Capital’s loss",
        "Under the box, 'Other remarks': nobody reads it",
        "Hold back the delivery payment, and the 42 million won loss carries the writer’s name"
      ],
      "choices": {
        "s8_rule_name": {
          "label": "Answer that your name can go on it"
        },
        "s8_rule_other": {
          "label": "Write the cause first in the other-remarks box"
        },
        "s8_rule_share": {
          "label": "Suggest his name go up beside yours"
        }
      }
    },
    "s8_saturday": {
      "title": "The Notebook",
      "place": "Dodam Injection · Yard in front of the dormitory",
      "clock": "July 11 (Sat) 13:00",
      "text": "Saturday noon, Binod Thapa weighs his bags again on a bathroom scale. 23.4 kilograms. From his toolbox he takes a notebook worn by his hands and holds it out to you. 9 years of mould temperatures and pressures, by weather. 'Give it to whoever runs machine 3 next. If the machines are taken, give it to whoever uses them where they go.' Two co-workers ask about the airport bus. He looks at his phone. 'The screen we took yesterday, does it count as proof? When I’m gone, who speaks for me?'",
      "question": "The one leaving hands you a notebook and a question. What do you do?",
      "memo": [
        "Bags 23.4 kilograms, airport bus 18:40",
        "9 years of mould notes: 'give it to the next one'",
        "'When I’m gone, who speaks for me?'"
      ],
      "choices": {
        "s8_sat_proxy": {
          "label": "Pick with him a co-worker who stays to speak for him"
        },
        "s8_sat_note": {
          "label": "Take the notebook and add it to the collection list"
        },
        "s8_sat_bus": {
          "label": "Only check the airport bus time for him"
        }
      }
    },
    "s8_airport": {
      "title": "A White Envelope",
      "place": "Incheon Airport · Departures",
      "text": "In front of departures, Dodam Injection’s CEO Sim Jaeman has come with only a suit jacket thrown over his work clothes. He holds out a white envelope. 1.82 million won, money he says he borrowed from his older sister. Binod Thapa presses the envelope back into the CEO’s hand. 'This is only mine. Do the ones who stay first.' He pulls his bags toward the gate. Envelope still in hand, Sim Jaeman turns to you. For one person he can do it like this, he says, but if the 42 million won is taken on Monday, the twenty-two left get nothing. Folding the envelope in half, he asks what you are going to write in that box.",
      "question": "One person’s share is left in an envelope in the CEO’s hand. What do you do?",
      "memo": [
        "Envelope, 1.82 million won: borrowed by the CEO from his sister",
        "Binod Thapa: left without taking it",
        "The twenty-two left: their share as it was"
      ],
      "choices": {
        "s8_air_list": {
          "label": "Attach the list of the twenty-two to Monday’s papers"
        },
        "s8_air_stay": {
          "label": "Stay beside the CEO until the last train"
        },
        "s8_air_honest": {
          "label": "Answer honestly that you don’t know yet"
        }
      }
    },
    "s8_monday": {
      "title": "Nothing to Note",
      "place": "KD Capital Head Office · Risk Management",
      "clock": "July 13 (Mon) 08:10",
      "text": "Monday morning, Chae Ian sets the final collection-review papers on your desk. Deputy Manager Seol Gyeongmin of the Collections Team left them. In Risk Management’s opinion box faint print is already there. Nothing to note. 'They say it comes with the form by default. You can delete it and write.' A note from Seol Gyeongmin is stuck on the papers: “If you hold back the 42 million won, the second half’s collection rate drops under my name. I kept that CEO’s machines for him in January too. For half a year. ^^” The collection truck leaves for Banwol at 10. The monsoon forecast starts tomorrow night.",
      "question": "'Nothing to note' is already printed in the opinion box. What do you do?",
      "memo": [
        "Opinion box default: 'Nothing to note'",
        "Collection truck leaves at 10",
        "Seol Gyeongmin’s note: 'I kept his machines in January'"
      ],
      "choices": {
        "s8_mon_erase": {
          "label": "Delete the default and leave the box empty"
        },
        "s8_mon_attach": {
          "label": "Attach the January memo and the seven notices at the back"
        },
        "s8_mon_coffee": {
          "label": "Go down to Collections and hear Seol Gyeongmin out"
        }
      }
    },
    "s8_aftershock": {
      "title": "Nine O’Clock",
      "place": "KD Capital Head Office · Meeting room",
      "clock": "08:50, 10 minutes before the collection review",
      "text": "Three things lie on the meeting table. The agenda to take the four injection machines and the 42 million won delivery payment, the January memo with the seven late-payment notices, and Binod Thapa’s mould notebook. He landed in Kathmandu two days ago. Chae Ian takes the pencil from behind his ear and lays it in front of you. 'There’s one opinion box. Not a box for reducing risk. A box that decides whose name the risk is written under.' He looks at the clock. 'It’s 9. What to write is yours to decide.'",
      "question": "The opinion box has one first line. What will you write?",
      "memo": [
        "Agenda: 4 injection machines + 42 million won delivery payment",
        "Retirement pension behind: 23 people, 36.4 million won",
        "The ending you pick stays only on this device"
      ],
      "choices": {
        "s8_after_hold": {
          "label": "Write that the payment waits behind the pension"
        },
        "s8_after_cause": {
          "label": "Write that January’s 'back on track' was the unpaid pension"
        },
        "s8_after_none": {
          "label": "Leave 'Nothing to note' as it is"
        }
      }
    }
  },
  "outcomes": {
    "s8_after_hold": {
      "title": "36.4 Million Won",
      "text": "On the first line you write: 'The July 15 delivery payment of 42 million won waits until the 36.4 million won in retirement pension is paid.' The four injection machines are loaded onto the truck at 10. The payment item is voted 'held for 2 weeks', and your name goes on the expected-loss line of the minutes. On July 17, on the KD Bank retirement pension screen, twenty-three people’s seven months turn to 'paid' all at once. That night a picture comes from Kathmandu. A screen with 1.82 million won received, and one line. 'Machine 3’s notebook, who got it?' The notebook is still in your drawer."
    },
    "s8_after_cause": {
      "title": "Back on Track",
      "text": "You write the cause on the first line. 'January to June, lease back on track = no company pension payment in the same months. January memo attached.' The agenda passes as it stands. The machines and the 42 million won come to KD Capital. Instead, Chae Ian sends your opinion to KD Bank’s retirement pension department and the audit team as well. Three months later a line appears in the collection rules. 'Before holding a collection, check affiliates’ unpaid retirement pension.' The twenty-three people’s 36.4 million won remains as unpaid-wage claim papers. At the very front of the file is the one screen Binod Thapa photographed."
    },
    "s8_after_none": {
      "title": "Nothing to Note",
      "text": "You leave the faint print as it is. 9:04, passed as it stands. At 10 the truck leaves Banwol, and on the 15th 42 million won lands in KD Capital’s account. In the afternoon a notice goes up in the Collections Team’s group chat. 'July collection done ^^ Thanks for the hard work, everyone!' Dodam Injection closes at the end of the month. The 36.4 million won behind has no next line in anyone’s papers. A week later a message comes from Kathmandu. 'On rainy days machine 3 needs 3 degrees more. Did you tell the new owner?' You start a reply and delete it."
    }
  }
};
