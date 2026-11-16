/**
 * 번외 6 (src/nodes/side06.js) in English, for the English preview.
 *
 * A draft: translated with the glossary (앱출시-G), not yet edited by a
 * person. Words only, under the ids of the pack as the app is shipped it
 * (scripts/locale-words.mjs); the pack's label and title live in the
 * dictionary's `copy.sidePacks`, a scene or card left out here keeps its
 * Korean, and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "s6_start": {
      "title": "Downstairs",
      "place": "KD Capital Headquarters, 12th Floor · Risk Management Department",
      "clock": "May 8 (Fri) 17:50, Parents’ Day",
      "lead": "One business card, handed over at the Pyeongtaek site. Just before you leave work, Song Hayul calls the number on it.",
      "text": "On the line, Song Hayul catches her breath. She is far enough along that the stairs wind her now, she says. 'You read numbers, Analyst, so I’m asking you. Hoa downstairs was meant to move out on April 30, and she still hasn’t got her deposit back (the money a jeonse tenant leaves with the landlord).' The landlord is not a person but a company. Four villa buildings on the same lane, 37 flats, all of them that company’s. 'They say she’ll get it when the next tenant moves in. My lease ends in December.' She starts to laugh and stops. 'The Pyeongtaek flat has no floor, and this one won’t give the money back.' The building is called Ginkgo Villa.",
      "question": "Song Hayul brings up the deposit of the tenant downstairs. What do you do?",
      "memo": [
        "Tenant downstairs: lease ended April 30, deposit not returned",
        "Landlord: one company, 4 villa buildings and 37 flats on one lane",
        "Song Hayul’s lease ends: December",
        "Name of the building: Ginkgo Villa"
      ],
      "choices": {
        "s6_start_visit": {
          "label": "Go to Ginkgo Villa on the way home and hear it there"
        },
        "s6_start_paper": {
          "label": "Ask for photos of the lease and the loan papers"
        },
        "s6_start_short": {
          "label": "Note down the company’s name and keep the call short"
        }
      }
    },
    "s6_tenant": {
      "title": "Twelve Boxes",
      "place": "Ginkgo Villa, Gangseo-gu · 2nd-floor hallway",
      "text": "Twelve moving boxes are stacked by the door on the 2nd floor. A rice cooker sits on top. Le Thi Hoa came from Vietnam and has worked in a university engineering lab in Seoul for 9 years; she answers in clear, careful Korean. 'I already paid the down payment on the new place. If I can’t move in this month, I lose that too.' Her deposit is 190 million won, 9 years of savings. She skipped going home to Hanoi for the New Year to save it. She opens her laptop. She has copied thirty-seven property registers (the public record of who owns a home and what is owed on it) into one table, like lab data. 'The company bought all of these in one year, 2024. Whether that’s strange, I don’t know.'",
      "question": "Hoa holds out a table she made herself. What do you do?",
      "memo": [
        "Le Thi Hoa: 9 years in Seoul, engineering researcher",
        "Deposit 190 million won, lease ended April 30",
        "Down payment on the new place: lost if she can’t move in this month",
        "Hoa’s table: 37 registers, every flat bought in 2024"
      ],
      "choices": {
        "s6_tenant_sheet": {
          "label": "Take Hoa’s table and read it line by line together"
        },
        "s6_tenant_box": {
          "label": "Sit by the boxes and hear about the down payment first"
        },
        "s6_tenant_rush": {
          "label": "Take the table as a file and head for the branch"
        }
      }
    },
    "s6_agent": {
      "title": "Carnations",
      "place": "Ginkgo Villa, Gangseo-gu · 1st-floor parking",
      "text": "A grey van pulls into the parking area. Gi Seongcheol, the managing agent for Moadeun Co., sets a basket of carnations down on the passenger seat and gets out. 'They’re for my mother. It’s Parents’ Day.' He bows to the tenant from the 2nd floor first. 'It’s not that there’s no money. It’s tied up. The boss got a bit stuck on something down in Pyeongtaek. The moment the next tenant moves in, you’ll get it.' He shows you the calendar on his phone. 'Three more flats signed this week. The money comes in Monday morning. KD Bank, Gangseo Branch.' 'I’m on a salary too, you know. 2 years in this job.' When the van has gone, Le Thi Hoa opens her laptop again. 'He’ll pay me back with the next tenant’s money. Then who pays that person back?'",
      "question": "The agent says the deposit will be paid with the next tenants’ money. What do you do?",
      "memo": [
        "Gi Seongcheol: managing agent, Moadeun Co.",
        "'The moment the next tenant moves in, you’ll get it'",
        "3 new leases this week: Monday morning, KD Bank Gangseo Branch",
        "'The boss got a bit stuck down in Pyeongtaek'"
      ],
      "choices": {
        "s6_agent_whose": {
          "label": "Ask whose money Monday’s three flats bring in"
        },
        "s6_agent_date": {
          "label": "Have him write Hoa’s pay date on the back of his card"
        },
        "s6_agent_go": {
          "label": "Don’t press him; send him off to his mother"
        }
      }
    },
    "s6_branch": {
      "title": "Behind the Shutter",
      "place": "KD Bank Gangseo Branch · Windows behind the shutter",
      "text": "Behind the shutter, only window 4 has its light on. Do Yoonha takes out two rolls of gimbap. 'I was clearing my desk. From Monday I’m on loan to KD Life for ten days.' He types the four addresses on Ginkgo Villa’s lane into the lookup screen. Twenty-three jeonse loans come up (loans taken to pay a jeonse deposit). Every one went out from the Gangseo Branch, and twenty-one of them from window 5, next to his. At the bottom are three more rows in grey. Scheduled to go out May 11 (Mon) 09:30. The three flats Gi Seongcheol mentioned. Do Yoonha puts the gimbap down. 'And on Monday morning, I won’t be here.'",
      "question": "On screen: twenty-three loans from the same lane, and three more going out on Monday. What do you look at first?",
      "memo": [
        "Do Yoonha: on loan to KD Life for 10 days from Monday",
        "23 jeonse loans on the same lane, all from Gangseo Branch",
        "21 of them: window 5, next door",
        "3 scheduled to go out: May 11 (Mon) 09:30"
      ],
      "choices": {
        "s6_branch_table": {
          "label": "Lay the twenty-three out in one table by address"
        },
        "s6_branch_monday": {
          "label": "Open the papers for Monday’s three first"
        },
        "s6_branch_eat": {
          "label": "Eat the gimbap together first, then open them slowly"
        }
      }
    },
    "s6_row": {
      "title": "The Same Number Three Times",
      "place": "KD Bank Gangseo Branch · Window 4",
      "text": "The table is done. It has three columns. Appraised value (what the bank says the home is worth), purchase price (what the company paid), jeonse price (what the tenant handed over). The first row reads 210 million won, 210 million won, 210 million won. So does the second, and the tenth. Twenty-three rows stand top to bottom on the same number three times. Do Yoonha looks at the screen for a long time. 'The numbers are too neat.' 3 years ago, in the file you wrote your dissent on, the numbers stood just as neatly, right in front of the line. Only the last column, whether a jeonse guarantee (a guarantee that pays the deposit back if the landlord can’t) was taken, differs row by row.",
      "question": "Twenty-three rows stand on the same three numbers. What do you do?",
      "memo": [
        "Appraised value = purchase price = jeonse price = 210 million won",
        "23 identical rows",
        "Jeonse guarantee taken or not: differs row by row",
        "Do Yoonha: 'The numbers are too neat'"
      ],
      "choices": {
        "s6_row_mark": {
          "label": "Mark every row where the three numbers match"
        },
        "s6_row_guard": {
          "label": "Count the rows with no jeonse guarantee separately"
        },
        "s6_row_call": {
          "label": "Stop the table here and call Song Hayul"
        }
      }
    },
    "s6_window": {
      "title": "The Next Window",
      "place": "KD Bank Gangseo Branch · In front of window 5",
      "text": "On the wall above window 5 hangs the branch’s performance board. 'April top window: 5, No. 1 in jeonse loans.' In the intake notes, the name of the referrer, Gi Seongcheol, appears twenty-one times. Do Yoonha stands in front of the board. 'I’m not trying to blame my senior. 3 years ago, I was the one at window 4 who got handed that sheet.' The window the Mangwon Market shopkeepers took the bus to. 'When the sheet comes down from above, everyone ends up No. 1. I did too.' He pushes the window 5 chair in a little. His senior’s cardigan hangs on its back.",
      "question": "The next window was handed the same sheet as Do Yoonha’s window 3 years ago. What do you do?",
      "memo": [
        "Performance board: 'April top window 5, No. 1 in jeonse loans'",
        "Referrer in intake notes: Gi Seongcheol, 21 times",
        "Do Yoonha: window 4 was handed that sheet 3 years ago"
      ],
      "choices": {
        "s6_window_log": {
          "label": "Skip the board; list the intake records by date"
        },
        "s6_window_listen": {
          "label": "Let Do Yoonha tell the story of back then to the end"
        },
        "s6_window_board": {
          "label": "Photograph the board and attach it to the table"
        }
      }
    },
    "s6_call": {
      "title": "The Word “Lucky”",
      "place": "Video call · Song Hayul’s kitchen",
      "text": "The video call shows Song Hayul’s kitchen table. Le Thi Hoa sits beside her, and there is half a watermelon on the table. In the table of loans, Song Hayul’s row is the seventeenth, and its jeonse-guarantee column says 'taken.' The row for downstairs has no loan, and its guarantee column is empty. Song Hayul starts to speak. 'They say I took out the guarantee. I should call that lucky, but...' She glances at the seat beside her and stops. Le Thi Hoa pushes a slice of watermelon across. 'Call it lucky, Hayul. If even one home is lucky, that’s lucky.' Song Hayul touches the corner of the table with a finger, instead of a floor plan.",
      "question": "In the same building, one of them has a guarantee and one does not. What do you do?",
      "memo": [
        "Song Hayul: 17th row, jeonse guarantee taken",
        "Hoa: no loan, no guarantee",
        "Hoa: 'If even one home is lucky, that’s lucky'"
      ],
      "choices": {
        "s6_call_both": {
          "label": "Write both of them the same steps, in the same order"
        },
        "s6_call_lan": {
          "label": "Look first for a way for Hoa, who has no guarantee"
        },
        "s6_call_group": {
          "label": "Ask how many tenants in the building they can reach"
        }
      }
    },
    "s6_rule": {
      "title": "Monday 09:30",
      "place": "KD Bank Gangseo Branch · Window 4",
      "text": "Do Yoonha pages through the rulebook on screen. Before a loan goes out, any member of staff can file a 'hold request.' Only under their own staff number, with a reason. Whether to accept it is the branch manager’s call. One reply has come to his message to the manager. 'Let’s talk Monday.' By 9:30 on Monday the three will already have gone out. Do Yoonha laughs. 'So I put a hold under my own name on another window’s customers. The night before I’m sent away.' He doesn’t finish the laugh. Outside the window, someone carrying carnations steps off a bus.",
      "question": "Do Yoonha won’t be here on Monday morning, and the manager wants to talk on Monday. What do you do?",
      "memo": [
        "Hold request: any staff member, own staff number, with a reason",
        "The branch manager decides whether to accept it",
        "Branch manager: 'Let’s talk Monday'",
        "Monday 09:30: three loans scheduled to go out"
      ],
      "choices": {
        "s6_rule_reason": {
          "label": "Write the reason for the hold together in three lines"
        },
        "s6_rule_words": {
          "label": "Write a plain notice for the tenants first"
        },
        "s6_rule_sheet": {
          "label": "Cut the table down to one page for the manager"
        }
      }
    },
    "s6_aftershock": {
      "title": "The Back Door",
      "place": "KD Bank Gangseo Branch · Back door",
      "text": "The guard waits, jingling the back-door keys. Do Yoonha empties the drawer at window 4 for the last time. Three things are up on his screen. A half-written hold request, the draft of a notice for Song Hayul to post in the group chat, and a one-page table for the branch manager. The night is too short for all three, and on Monday morning he’ll be in Guro. A message comes in from Le Thi Hoa. A photo of her rice cooker. 'I took it out again. I’m sleeping here tonight.' Do Yoonha shoulders his bag and looks at you. 'I’ll file just one under my name before I go. Which one?'",
      "question": "Do Yoonha files just one thing tonight and goes. What do you leave?",
      "memo": [
        "Hold request: Monday’s three, under Do Yoonha’s staff number",
        "Notice: the Ginkgo Villa tenants’ group chat",
        "One-page table: the branch manager’s inbox",
        "The ending you choose stays on this device only"
      ],
      "choices": {
        "s6_after_hold": {
          "label": "File a hold request on Monday’s three right now"
        },
        "s6_after_notice": {
          "label": "Send the notice to the twenty-three homes first"
        },
        "s6_after_branch": {
          "label": "Send the table to the manager; leave it to the branch"
        }
      }
    }
  },
  "outcomes": {
    "s6_after_hold": {
      "title": "Hold Under Review",
      "text": "Do Yoonha puts three lines in the reason box and files it under his own staff number. Same company’s flats, twenty-three rows of appraised value = purchase price = jeonse price, existing tenant’s deposit not returned. A receipt number comes up. He writes it on a sticky note and puts it by the window 5 monitor, then takes it off again and tucks it into his own notebook. 'My senior shouldn’t see this first thing in the morning.' At 9:30 on Monday, on the subway to Guro, he looks the receipt number up once more. The screen says only 'Under review.'"
    },
    "s6_after_notice": {
      "title": "Group Chat",
      "text": "Song Hayul posts the notice in the Ginkgo Villa tenants’ group chat. Look at your lease and the register again; check whether you have a jeonse guarantee; from three months before your lease ends, write the dates down. Le Thi Hoa’s table is attached as a file. Names taken out, only addresses and numbers. By past midnight the chat has grown from 2 people to 19. Someone asks, 'Ours is 210 million too. What does that mean?' Song Hayul writes an answer, deletes it, and writes again. 'Let’s look at it together tomorrow. 1st-floor parking, 10 o’clock.'"
    },
    "s6_after_branch": {
      "title": "Inbox",
      "text": "Do Yoonha sends the one-page table to the branch manager. The subject: 'Summary of 23 jeonse loans on the Ginkgo Villa lane.' The body is two lines. The three loans scheduled for Monday 09:30 are for the same company’s flats. From Monday I am at KD Life. One line appears in his sent mail. No read mark yet. Stepping out through the back door, Do Yoonha says, 'I’ve left it to the branch, so now it’s the branch’s job.' Then, at the bus stop, he opens his phone once more. There is no read mark then either."
    }
  }
};
