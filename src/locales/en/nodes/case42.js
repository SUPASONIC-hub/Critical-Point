/**
 * 사건 42 (src/nodes/case42.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c42_start": {
      "title": "Leave with an Empty Approver Field",
      "text": "Your leave request has sat on the approval screen for four days. It asks for one day off, Friday, six days after the second hearing. Team head approval, department head approval, and the last field, 'CEO.' You are the first employee at this company whose leave has gone all the way to the CEO’s desk, and that field is still empty. Then a photo lands in the group chat. A 'Leave Order' written with a brush pen on one A4 sheet, three red seals below it. It is from Na Junhyuk. 'I booked a guesthouse by the Gyeongpo Fireworks Festival. Four rooms, 12 sets of bedding. Watching a man say he doesn’t recall 23 times has worn everyone down to half a face. This is an order. I stamped it.'",
      "memo": [
        "Leave approval line: team head → department head → CEO Yoon Sanghyuk",
        "CEO field empty for four days -- neither approved nor returned",
        "Na Junhyuk’s 'Leave Order': three seals, nine people asked to come",
        "Gyeongpo Fireworks Festival: tomorrow at 21:00, a 6-minute walk from the guesthouse"
      ],
      "choices": {
        "c42_start_laptop": {
          "label": "Pack the laptop and offer to take work on leave"
        },
        "c42_start_go": {
          "label": "Leave for Gyeongpo with colleagues, approval or not"
        },
        "c42_start_ask": {
          "label": "Formally ask HR why the approver field is empty"
        },
        "reframe": {
          "label": "Make it name each item that dragged the score down"
        }
      },
      "place": "KD Capital Risk Management Department · Hallway",
      "clock": "The Day Before the Gyeongpo Fireworks Festival · 18:10",
      "question": "The CEO field on your leave request has been empty for four days, and a stamped leave order has arrived. What do you do?",
      "lead": "Six days after the second hearing, in the hallway past quitting time, the group chat on your phone will not stop buzzing."
    },
    "c42_pension": {
      "title": "The House at the Same Address",
      "text": "Two blocks in from Gyeongpo Beach, six inner tubes hang in the yard of 'Mulgyeol Stay,' and the white walls are freshly painted. The 32-year-old owner, Yeo Dain, hands over four room keys with a smile. 'This is the first time we’re fully booked on festival day.' Signing the guest register, Kwon Dohyun stops his pen. The street address is one he knows by heart. The Haeon Guesthouse you chased last year at Yeongdong Branch, the house Yoon Sanghyuk’s brother-in-law owned, the registered address of the company that sent advisory fees out to a Seoul gallery. That company went into liquidation. After that, the house went to auction. Na Junhyuk stirs another cup of instant coffee mix. 'I knew when I booked it. We pay full price to sleep in the house their money flowed through. Isn’t that the cleanest revenge there is?'",
      "memo": [
        "Mulgyeol Stay: the old Haeon Guesthouse, won at auction by Yeo Dain",
        "Yeo Dain: former contract teller at KD Bank Yeongdong Branch, age 32",
        "Part of the winning bid: a KD Capital business loan",
        "Fully booked tonight -- the first time since opening"
      ],
      "choices": {
        "c42_pension_rest": {
          "label": "Say today is leave and keep the address to yourself"
        },
        "c42_pension_tell": {
          "label": "Tell Yeo Dain honestly who owned this house before"
        },
        "c42_pension_check": {
          "label": "Check the property register and auction records first"
        },
        "reframe": {
          "label": "Make it name each item that dragged the score down"
        },
        "c42_pension_evidence_turn": {
          "label": "Find which KD file this guesthouse’s address is on"
        }
      },
      "place": "Mulgyeol Stay Guesthouse, Gyeongpo · Yard",
      "clock": "Festival Day, Friday · 12:10",
      "question": "You know who owned this house before, and the new owner does not. How do you tell that story?",
      "lead": "15 minutes by taxi from Gangneung Station, Na Junhyuk waves in front of a white guesthouse with inner tubes hanging in the yard."
    },
    "c42_karaoke": {
      "title": "100 Points in Yeongdong Dialect",
      "text": "In room 5 of a karaoke place in the alley by the beach, Na Junhyuk sings a trot song rewritten in Yeongdong dialect. 'Yous all come gather here, ain’t it grand like this.' Not one word matches the lyrics on screen, and the score is 100. Oh Jinwoo sings the same song three times, scores 97, 94 and 91, and starts to suspect the machine. Kwon Dohyun calls out, '500 won a song. Mr. Oh, you’re 1,500 won in the red,' and Kang Taemin’s tambourine never finds the beat. Then your phone buzzes. A screenshot from Yeo Dain: a text in KD Capital’s name, sent at 19:04. 'Your loan has been classified for early call under internal criteria.' Seven on a Friday evening, and no person sent this text.",
      "memo": [
        "Na Junhyuk 100 points -- dialect rewrite, 0% lyric match",
        "Oh Jinwoo tries three times in a row; the score drops every time",
        "KD Capital text 19:04 -- sent automatically after business hours",
        "Reason: no explanation beyond 'internal criteria'"
      ],
      "choices": {
        "c42_karaoke_run": {
          "label": "Leave the karaoke room and run to Yeo Dain"
        },
        "c42_karaoke_basis": {
          "label": "Demand the 'internal criteria' for the call in writing"
        },
        "c42_karaoke_call": {
          "label": "Call the duty officer and stop the texts on your authority"
        },
        "reframe": {
          "label": "Make it name each item that dragged the score down"
        },
        "c42_karaoke_evidence_turn": {
          "label": "Find which KD file this guesthouse’s address is on"
        }
      },
      "place": "By Gyeongpo Beach · Karaoke Alley",
      "clock": "Festival Day · 19:04",
      "question": "Yeo Dain has never missed a payment, and an automatic early-call text reached her on a Friday evening. What do you do now?",
      "lead": "In front of the screen where Na Junhyuk scored 100, Yeo Dain’s screenshot pops up on your phone."
    },
    "c42_breakwater": {
      "title": "Why We Couldn’t Stop",
      "text": "The first firework goes up, and gold dust pours over the sea. On the sand below the Gyeongpo breakwater, Kang Taemin takes out a thermos and fills 10 cup noodles with hot water. Na Junhyuk opens a notebook and speaks between the bangs. 'Let’s go one at a time. What kept you from stopping. I’ll write it down.' Oh Jinwoo goes first. 'I wanted to win. I still do. It’s embarrassing.' Lee Minseo keeps it short. 'Fear. When I’m scared, my eyes open wider.' For the first time, Kwon Dohyun speaks without calculating. '1,140 people. The people at my father’s company.' Do Yoonha says it is the faces of the people he sold loans to at the window, and Kang Taemin says only, 'The second cup noodle.' In a short gap between fireworks, everyone looks at you. It is a question you never got once at the hearing.",
      "memo": [
        "Gyeongpo Fireworks Festival main show 21:00~21:40",
        "Oh Jinwoo wanted to win, Lee Minseo was afraid, Kwon Dohyun 1,140 people",
        "Do Yoonha the faces at the window, Kang Taemin the second cup noodle",
        "Turns left: you, then Han Seoyun"
      ],
      "choices": {
        "c42_breakwater_faces": {
          "label": "Say it was the faces behind the dissent"
        },
        "c42_breakwater_duty": {
          "label": "Say you wanted to answer for your dissent to the end"
        },
        "c42_breakwater_win": {
          "label": "Admit honestly that you wanted to beat Yoon Sanghyuk"
        },
        "reframe": {
          "label": "Make it name each item that dragged the score down"
        },
        "c42_breakwater_evidence_turn": {
          "label": "Find which KD file this guesthouse’s address is on"
        }
      },
      "place": "Gyeongpo breakwater",
      "clock": "Fireworks Main Show · 21:00",
      "question": "Under the fireworks, everyone has said what kept them from stopping. What is your answer?",
      "lead": "5 minutes before the fireworks, Kang Taemin has claimed the far end of the breakwater, thermos in hand."
    },
    "c42_final": {
      "title": "The 5:40 a.m. Call",
      "text": "People who stayed up all night wait for the sun on the sand of Gyeongpo Beach. A call comes. It is Baek Arin. 'The board has put up a motion to remove CEO Yoon Sanghyuk. Monday, September 7. They say the directors from Kingsdale in New York raised it first.' Oh Jinwoo starts to throw up both arms and stops at her next words. Baek Arin reads you the last sentence of the motion’s briefing paper. 'With the dismissal, cleanup of related risk assets complete.' 'There are 47 places in that cleanup. Mulgyeol Stay is one of them.' She catches her breath. 'Two outside directors want your opinion. By midnight tonight.' Yeo Dain comes out of the office building carrying a pot of hangover soup. She does not know about this call yet.",
      "memo": [
        "Board: Monday, September 7, motion to dismiss Yoon Sanghyuk",
        "Briefing paper: 'cleanup of related risk assets complete' -- 47 places",
        "2 outside directors want your opinion, due midnight tonight",
        "Of the 47, 39 have no record of late payment"
      ],
      "choices": {
        "c42_final_attach": {
          "label": "Demand the motion also halt the calls on the 47"
        },
        "c42_final_push": {
          "label": "Leave out the 47; send only a pro-dismissal opinion today"
        },
        "c42_final_stay": {
          "label": "Stop Yeo Dain’s call classification before Seoul"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Gyeongpo Beach · The Sands",
      "clock": "The Day After the Festival · 05:40",
      "question": "The dismissal motion is up, and its briefing paper lists the 47 places as cleanup complete. What do you do?",
      "lead": "Four blankets are spread on the sand, and the horizon is just starting to brighten."
    },
    "c42_aftershock": {
      "title": "The Guestbook’s First Page",
      "text": "Six inner tubes dry on the clothesline in the yard of Mulgyeol Stay, and Kang Taemin sets up a tripod for a group photo. The owner, Yeo Dain, holds out the guestbook. On the first page Na Junhyuk stamps his three seals, Kang Taemin writes two words, 'Coming back,' and Kwon Dohyun tapes in the lodging bill split. Oh Jinwoo writes down a rematch date for the buoy race he lost to Han Seoyun, and Han Seoyun draws a small medal next to her name. Closing the guestbook, Yeo Dain says, 'I know now who owned this house before. But I also know good people slept here.' Texts from Baek Arin have piled up on your phone since dawn. The September 7 board motion to remove CEO Yoon Sanghyuk, and the opinion two outside directors want from you by midnight tonight. The first train to Seoul is at 7:02.",
      "memo": [
        "First train to Seoul 07:02, next train 12:10",
        "Guestbook first page: three seals, 'Coming back,' the lodging bill split",
        "Outside directors’ opinion deadline: midnight tonight",
        "Board: Monday, September 7, motion to dismiss Yoon Sanghyuk"
      ],
      "choices": {
        "c42_after_warm": {
          "label": "Take the group photo and stay by the sea till the noon train"
        },
        "c42_after_rush": {
          "label": "Take the first train to Seoul before the group photo"
        },
        "c42_after_record": {
          "label": "On the train, write up that night’s answers and the 47"
        }
      },
      "place": "Mulgyeol Stay Guesthouse, Gyeongpo · Yard",
      "clock": "The Day After the Festival · 06:30",
      "question": "One line is left in the guestbook, and the first train to Seoul is waiting. How do you close the last morning of this summer?"
    },
    "c42_buoy": {
      "title": "200 Meters to the Buoy",
      "text": "On the sand, Kwon Dohyun works out the parasol rental fee. 'Past three hours, buying one is cheaper.' He buys a parasol at the convenience store, and 4 minutes after it goes into the sand the wind takes it; Kang Taemin runs twenty steps to bring it back. Na Junhyuk, in a 1990s floral swimsuit, declares 'I’m the referee' and lies down on an inner tube. Oh Jinwoo puts on goggles and points at the buoy. 'First one to touch it picks dinner.' At the signal he shoots off, and Han Seoyun follows him in without a word. A person five months into standby assignment is faster in the water than anyone.",
      "memo": [
        "Parasol cost 19,000 won -- used for 4 minutes",
        "About 200 meters to the buoy, inside the lifeguard flag zone",
        "Han Seoyun: five months into standby assignment"
      ],
      "choices": {
        "c42_buoy_choice_3": {
          "label": "Lie in the parasol’s shade and sleep a full hour"
        },
        "c42_buoy_choice_1": {
          "label": "Swim to the buoy with Han Seoyun"
        },
        "c42_buoy_choice_2": {
          "label": "Check the lifeguard flag zone and stay on the beach"
        }
      },
      "place": "Gyeongpo Beach · The Sands",
      "clock": "Festival Day · 14:00",
      "question": "Oh Jinwoo called a race to the buoy, and Han Seoyun went into the water without a word. Where are you?"
    },
    "c42_ledger": {
      "title": "The Winning-Bid Receipt",
      "text": "In the guesthouse office building, under fluorescent light, Yeo Dain opens a file folder. The court’s winning-bid receipt, a confirmation that her mother closed her savings account, the KD Capital loan agreement. 'I was at the Yeongdong Branch window for 4 years. On the way home the day my contract ended, I saw this house come up for auction. A house with a view of the sea was my lifelong dream.' She points to one line in the agreement. Never once late in 14 months. 'So why me? What did I do wrong?' Na Junhyuk stands in the doorway and cannot come in. For the 4 years Yeo Dain was at the window, the manager of that branch was Na Junhyuk.",
      "memo": [
        "Winning bid 410 million won -- 70 million won from her mother’s savings, KD Capital loan 290 million won",
        "14 months, 0 late payments",
        "Yeo Dain: 4 years on contract at Yeongdong Branch; branch manager at the time, Na Junhyuk"
      ],
      "choices": {
        "c42_ledger_choice_1": {
          "label": "Take over tonight’s guest check-ins for her"
        },
        "c42_ledger_choice_3": {
          "label": "Reassure Yeo Dain that it’s a common system error"
        },
        "c42_ledger_choice_2": {
          "label": "Write a re-review request together on 0 late payments"
        }
      },
      "place": "Mulgyeol Stay Guesthouse, Gyeongpo · Office Building",
      "clock": "Festival Day · 20:10",
      "question": "Three file folders lie open in front of Yeo Dain, who asks why it is her. What will you do for her tonight?"
    },
    "c42_embers": {
      "title": "Because I’m Ashamed",
      "text": "The fireworks end, and only smoke is left at the end of the breakwater. The last turn is Han Seoyun’s. She fiddles with her cup-noodle lid for a long time. 'For me, it’s shame. 3 years ago I pressed the return button under my own employee number. The moment I stop, that record becomes my face again. So I can’t stop.' She says her mother calls every Sunday and starts with 'Haven’t they fired you yet?' and laughs. No one laughs with her. Then Ban Jaewook, back from his regional rounds, gets out of a taxi and walks to the breakwater. In one hand he holds a notebook; in the other, 11 glow sticks from the festival souvenir shop.",
      "memo": [
        "Han Seoyun: returned it 3 years ago under her own employee number",
        "On standby assignment, a call from her mother every Sunday",
        "Ban Jaewook arrives 23:10 -- 11 glow sticks"
      ],
      "choices": {
        "c42_embers_choice_3": {
          "label": "Hand out glow sticks and change the mood first"
        },
        "c42_embers_choice_1": {
          "label": "Offer to carry Han Seoyun’s return record together"
        },
        "c42_embers_choice_2": {
          "label": "Propose proving on record who ordered that return"
        }
      },
      "place": "Gyeongpo breakwater · The Far End",
      "clock": "Festival Over · 23:00",
      "question": "Han Seoyun says she can’t stop because she is ashamed. What do you do about that return record?"
    },
    "c42_buoy_reaction": {
      "title": "Where No One Measures",
      "text": "Han Seoyun touches the buoy first. Oh Jinwoo reaches it 3 seconds later, spits out water and shouts 'Rematch!' Han Seoyun hooks an arm over the buoy, looks at the beach for a long while, then swims back. Taking a towel, she looks back toward the buoy. 'From out there, people look as small as beans. For the first time, nobody was measuring me. Since the day I got standby assignment, I’ve swiped my time card every morning. Even with nowhere to go. In case not swiping counted as quitting.' She smiles, and her eyes are wet with more than seawater. 'I was a swimmer in high school. I don’t know how many years it’s been since I won anything.'",
      "memo": [
        "The first win in five months",
        "A time card swiped with nowhere to go"
      ],
      "choices": {
        "c42_buoy_reaction_choice_3": {
          "label": "Side with Oh Jinwoo and tell her to grant the rematch"
        },
        "c42_buoy_reaction_choice_2": {
          "label": "Propose saving her standby attendance records as evidence"
        },
        "c42_buoy_reaction_choice_1": {
          "label": "Propose bragging about today’s win in the group chat"
        }
      },
      "place": "Gyeongpo Beach · Under the Parasol on the Sands",
      "clock": "Festival Day · 15:10",
      "question": "The first person to win in five months cries with a towel in her hands. What do you say?"
    },
    "c42_ledger_reaction": {
      "title": "The Address Returned Three Times",
      "text": "Na Junhyuk sits on the office-building stairs and stirs two cups of instant coffee mix. One is for Yeo Dain. 'Dain, I know this address. When I was at the branch, my predecessor flagged money moving through this address three times, and all three times I returned it under my own employee number. If I’d seen it through back then, this house would never have gone to auction. And then you wouldn’t be here.' He starts to laugh and stops. 'Funny, isn’t it. The house I booked out of shame holds the money you saved your whole life. This time I won’t return it.'",
      "memo": [
        "An employee number that returned it three times",
        "A house booked out of shame"
      ],
      "choices": {
        "c42_ledger_reaction_choice_1": {
          "label": "Stay by Yeo Dain tonight together with Na Junhyuk"
        },
        "c42_ledger_reaction_choice_2": {
          "label": "Attach Na Junhyuk’s return record to the re-review"
        },
        "c42_ledger_reaction_choice_3": {
          "label": "Comfort Na Junhyuk: what’s past is past"
        }
      },
      "place": "Mulgyeol Stay Guesthouse, Gyeongpo · Office Building Landing",
      "clock": "Festival Day · 20:40",
      "question": "The branch manager who returned it three times says this time he won’t. How do you take those words?"
    },
    "c42_embers_reaction": {
      "title": "11 Glow Sticks",
      "text": "Ban Jaewook snaps the glow sticks one by one and hands them out. 11, two more than the people here. 'One is for the owner, one is a spare. The lights in the office building were still on.' Then he opens his notebook. 'On my rounds I saw headquarters data. This week, early-call texts went to 47 places across the country. Every one is an address Yoon Sanghyuk brushed past at least once. It’s not people being punished. It’s addresses.' Green lights sway on the breakwater.",
      "memo": [
        "11 -- glow sticks, two more than the people",
        "Punishment that falls on addresses, 47 places"
      ],
      "choices": {
        "c42_embers_reaction_choice_3": {
          "label": "Rest tonight and look at the 47 on Monday"
        },
        "c42_embers_reaction_choice_2": {
          "label": "Sort out the list of 47 addresses tonight"
        },
        "c42_embers_reaction_choice_1": {
          "label": "Take a glow stick and bring Yeo Dain to the breakwater"
        }
      },
      "place": "Gyeongpo breakwater · Below the Lighthouse",
      "clock": "Festival Over · 23:10",
      "question": "There are forty-seven places where addresses, not people, are punished. What do you do first tonight?"
    },
    "c42_branch_attic": {
      "title": "Mail in the Attic",
      "text": "Once check-in is done, Yeo Dain asks Kang Taemin a favor. 'The former owner’s things are still in the office-building attic, and I can’t bring them down alone.' Kang Taemin carries six boxes down in one go. The tape on the bottom box bursts and mail spills out. Every envelope has the same sender, Haeon Partners. Copies of quarterly advisory-fee invoices and remittance confirmations to Gallery On, bundled for 3 years, and on the front of one envelope, in ballpoint: 'Destroy after the Managing Director checks.' It was not destroyed. Kang Taemin pulls off his gloves and tucks them in his vest pocket. 'This is the stuff they said to throw out, right?'",
      "memo": [
        "One of six boxes: 3 years of Haeon Partners mail",
        "12 copies of advisory-fee invoices, 12 remittance confirmations",
        "Envelope note: 'Destroy after the Managing Director checks'",
        "Ownership: passed to Yeo Dain with the house at auction"
      ],
      "choices": {
        "c42_branch_attic_c": {
          "label": "Photograph only the envelope fronts and close the box"
        },
        "c42_branch_attic_a": {
          "label": "Show Yeo Dain and ask what to do with the mail"
        },
        "c42_branch_attic_b": {
          "label": "Touch nothing; prepare it as evidence for prosecutors"
        }
      },
      "place": "Mulgyeol Stay Guesthouse, Gyeongpo · Office Building Attic",
      "clock": "Festival Day · 13:00",
      "question": "Envelopes marked 'destroy after checking' spilled out, never destroyed. What do you do with this mail?"
    },
    "c42_branch_attic_follow": {
      "title": "The Envelopes Nobody Destroyed",
      "text": "Yeo Dain holds one envelope and looks at it for a long time. 'So these people are why this house went to auction. And that’s how I got to buy it.' She smiles, but the smile is strange. Kwon Dohyun lays out the remittance confirmations by date and stops. The last remittance is the day before Haeon Partners filed for liquidation, and that day alone the money went to a personal account instead of the gallery. The recipient name field is blacked out with a black pen. Yeo Dain pushes the box toward you. 'Take it. But leave this house’s name out of what’s in this box. I have to keep living here.'",
      "memo": [
        "Last remittance: the day before the liquidation filing, to a personal account",
        "Recipient name field blacked out",
        "Yeo Dain’s condition: leave out the name Mulgyeol Stay",
        "1st-instance court deadline for additional evidence: next week"
      ],
      "choices": {
        "c42_branch_attic_follow_b": {
          "label": "Get the blacked-out name analyzed; hand originals to prosecutors"
        },
        "c42_branch_attic_follow_a": {
          "label": "Hide the house’s name as she asks; hand over copies only"
        },
        "c42_branch_attic_follow_c": {
          "label": "Keep the box; decide later how to use it"
        }
      },
      "place": "Mulgyeol Stay Guesthouse, Gyeongpo · Office Building",
      "clock": "Festival Day · 13:30",
      "question": "Yeo Dain holds out the box and asks only that the house’s name be left out. How do you take this condition?"
    },
    "c42_route_system": {
      "title": "The Weight of an Address",
      "text": "At 7:04 on Friday evening, an automatic text from KD Capital reaches Yeo Dain, owner of 'Mulgyeol Stay,' the Gyeongpo guesthouse Na Junhyuk booked. It notifies her that her loan has been classified for early call. When you make it name each item that dragged the score down, NOAH, KD’s AI review engine, lays out the basis for the classification in the work window on your phone. 0 late payments, rising sales, ample collateral. Only one item dragged the score down: 'location reputation risk.' Weight 0.31. The item was created the day after the second hearing, and it carries a value for only 47 addresses nationwide. NOAH adds: 'I do not know who lives at this address now. I only know who lived there.'",
      "memo": [
        "Yeo Dain’s credit items: all normal or better",
        "Downgrade factor: location reputation risk, weight 0.31",
        "Item created: the day after the second hearing"
      ],
      "choices": {
        "c42_route_system_zero": {
          "label": "Formally request the address weight be set to 0"
        },
        "c42_route_system_names": {
          "label": "Find out, one by one, who lives at the forty-seven addresses"
        },
        "c42_route_system_skip": {
          "label": "Leave the item; ask to exempt Yeo Dain’s case alone"
        },
        "c42_route_system_evidence_turn": {
          "label": "Find which KD file this guesthouse’s address is on"
        }
      },
      "place": "Mulgyeol Stay Guesthouse, Gyeongpo · 2nd-Floor Room",
      "clock": "Festival Day · 19:30",
      "question": "NOAH only knows who lived at an address. What do you do about that item?"
    },
    "c42_final_system_route": {
      "title": "A Fully Booked Address",
      "text": "At dawn after the fireworks, 47 lines of addresses fill the work window in the guesthouse’s 2nd-floor room. NOAH has put the same value, 0.31, on every line, and the late-payment field reads 0 on 39 lines. Outside the window, the office-building lights are still on. NOAH writes under the table: 'I read addresses. I cannot read who is sleeping at that address now. Tonight this address is fully booked for the first time since it opened. My table does not put that fact into the score.'",
      "memo": [
        "Location reputation risk -- 47 places, value 0.31",
        "Of the 47, 39 have no record of late payment",
        "Mulgyeol Stay: fully booked tonight -- the first time since opening"
      ],
      "choices": {
        "c42_final_system_route_c": {
          "label": "Tell the 47 owners how to file an objection first"
        },
        "c42_final_system_route_b": {
          "label": "Keep the item but delay the calls by 1 year"
        },
        "c42_final_system_route_a": {
          "label": "Change the rule: reputation counts only in human review"
        }
      },
      "place": "Mulgyeol Stay Guesthouse, Gyeongpo · 2nd-Floor Room",
      "clock": "The Day After the Festival · Dawn",
      "question": "NOAH’s table only counts who lived at an address. To put the people living there now into that table, which line do you fix first?"
    },
    "c42_evidence_turn": {
      "title": "The Cleanup Sheet",
      "text": "Below the lighthouse on the Gyeongpo breakwater after the festival, Ban Jaewook, who arrived late at night, opens his notebook. This week, KD Capital’s automatic call texts went to 47 addresses, and Mulgyeol Stay, a guesthouse that has never missed a payment, is one of them. When you put the clue at the head of the list, the source opens. An Excel file from the group legal team, 'Yoon Sanghyuk-Related Asset Cleanup Sheet,' created the morning after the second hearing. The last editor is the Group Strategy Office, and that same afternoon the whole list became a new item in NOAH, KD’s AI review engine. 'A motion to remove the CEO goes to the board on September 7. To write risk cleanup complete there, you need a cleanup number. While cutting Yoon Sanghyuk loose, they cut loose the people at every address he brushed past to fill the number. It’s the same shape as 3 years ago. The top decides; the bottom pays.'",
      "memo": [
        "Source: group legal team’s 'Yoon Sanghyuk-Related Asset Cleanup Sheet'",
        "Last edited: Group Strategy Office, the day after the hearing",
        "Entered into NOAH as a new item the same day -- 47 places"
      ],
      "choices": {
        "c42_evidence_turn_hold": {
          "label": "Hold the cleanup sheet and bring it out on board day"
        },
        "c42_evidence_turn_owners": {
          "label": "Tell the owners of the 47 places first"
        },
        "c42_evidence_turn_board": {
          "label": "Attach the cleanup sheet to your opinion for the board"
        }
      },
      "place": "Gyeongpo breakwater · Below the Lighthouse",
      "clock": "The Day After the Festival · 01:20",
      "question": "The 47 were addresses cut to fill the dismissal motion’s number. How do you use this cleanup sheet?"
    },
    "c42_start_warm": {
      "title": "Leave for the People Who Stayed to the End",
      "text": "The night you walked out of the hearing room, you stayed with your colleagues to the end. When you parted, someone said: next time, let’s meet somewhere without papers. Six days later, Na Junhyuk sets those words in three seals. A 'Leave Order' in brush pen, a guesthouse by the Gyeongpo Fireworks Festival, four rooms, 12 sets of bedding. But the Friday leave request you filed at KD Capital has been stuck for four days at the last approval field, the field of CEO Yoon Sanghyuk. Not returned, not approved. Like the e-signature field on page 3 three years ago, it is simply empty.",
      "memo": [
        "Leave order: Na Junhyuk’s three seals",
        "Friday leave request: CEO field empty for four days",
        "Nine people confirmed"
      ],
      "choices": {
        "c42_start_warm_signature": {
          "label": "Keep that night’s promise: go empty-handed, no papers"
        },
        "c42_start_warm_ask": {
          "label": "Formally ask HR why the approver field is empty"
        },
        "c42_start_warm_laptop": {
          "label": "Pack the laptop and offer to take work on leave"
        },
        "c42_start_warm_go": {
          "label": "Leave for Gyeongpo with colleagues, approval or not"
        },
        "c42_start_warm_reframe": {
          "label": "Make it name each item that dragged the score down"
        }
      },
      "place": "KD Capital Risk Management Department · Hallway",
      "clock": "The Day Before the Gyeongpo Fireworks Festival · 18:10",
      "question": "The promise made that night has come back as a stamped order. With the approval field empty, how do you leave?",
      "lead": "The people who spent the whole night of the hearing together gather in the same group chat again, six days later."
    },
    "c42_start_record": {
      "title": "Leave for the One Who Filled 23 Rows",
      "text": "For six days you matched each of the 23 'I don’t recall' answers in the hearing transcript to the documents of the time and built a table. In 19 of the 23 rows sits his own e-signature, the one he should have remembered. The moment you save the table, Lee Minseo posts Na Junhyuk’s 'Leave Order' in the group chat. Gyeongpo, the fireworks festival, tomorrow. But your Friday leave request has been stuck for four days at the last approval field, the field of CEO Yoon Sanghyuk. The man who said he didn’t recall has not forgotten your leave.",
      "memo": [
        "'I don’t recall' 23 times -- 19 rows match signed documents",
        "Friday leave request: CEO field empty for four days",
        "Leave order posted by: Lee Minseo"
      ],
      "choices": {
        "c42_start_record_ask": {
          "label": "Formally ask HR why the approver field is empty"
        },
        "c42_start_record_signature": {
          "label": "Attach the 23-row table to the leave request and resubmit"
        },
        "c42_start_record_go": {
          "label": "Leave for Gyeongpo with colleagues, approval or not"
        },
        "c42_start_record_laptop": {
          "label": "Pack the laptop and offer to take work on leave"
        },
        "c42_start_record_reframe": {
          "label": "Make it name each item that dragged the score down"
        }
      },
      "place": "KD Capital Risk Management Department · Hallway",
      "clock": "The Day Before the Gyeongpo Fireworks Festival · 18:10",
      "question": "You just finished the 23-row table, and one leave field is empty. Where do you use that table?",
      "lead": "You save the table you built over six days and look up; it is dark outside the window."
    },
    "c42_start_rush": {
      "title": "Leave for the One Who Ran Ahead",
      "text": "The hearing ended, and the moment you left the chamber you went straight to the next fight. For six days you turned off the KD Capital office lights last, and people in Risk Management call your desk 'the night-duty seat.' Thursday evening, Ban Jaewook, out on his regional rounds, calls. 'Branch Manager Na Junhyuk sent around a leave order. Your name is at the top. Stamped and all.' Your Friday leave request has been stuck for four days at the last approval field, the field of CEO Yoon Sanghyuk. You know who is keeping that field empty.",
      "memo": [
        "Last to leave six days in a row",
        "Friday leave request: CEO field empty for four days",
        "Top line of the leave order: you"
      ],
      "choices": {
        "c42_start_rush_go": {
          "label": "Leave for Gyeongpo with colleagues, approval or not"
        },
        "c42_start_rush_ask": {
          "label": "Formally ask HR why the approver field is empty"
        },
        "c42_start_rush_signature": {
          "label": "Refile the leave as a business trip to Gyeongpo"
        },
        "c42_start_rush_laptop": {
          "label": "Pack the laptop and offer to take work on leave"
        },
        "c42_start_rush_reframe": {
          "label": "Make it name each item that dragged the score down"
        }
      },
      "place": "KD Capital Risk Management Department · Hallway",
      "clock": "The Day Before the Gyeongpo Fireworks Festival · 18:10",
      "question": "In front of someone who ran for six days sit a leave order and an empty approval field. Do you stop, or go around?",
      "lead": "In the office where you are again the last one left, Ban Jaewook’s call comes in."
    }
  },
  "echoReplies": {
    "c42_start_go": "You leave without approval, and the Friday morning train is fun. While the CEO field stays empty, your Friday is recorded as neither an absence nor leave.",
    "c42_start_ask": "A formal inquiry becomes a record. HR’s answer comes only two days later. You board the Friday morning train to Gyeongpo without one.",
    "c42_start_laptop": "The laptop goes on top in your bag. Even at the sea, you are a KD Capital employee. That fact may prove useful tomorrow night.",
    "c42_pension_tell": "When you tell her, the smile leaves Yeo Dain’s face. A long while later she says, 'Thank you for telling me anyway.'",
    "c42_pension_check": "You pull the property register, and the auction was clean. Confirming it was clean takes the whole lunch hour.",
    "c42_pension_rest": "You say nothing, and today is peaceful. Before the day is out, Yeo Dain learns this house’s past in a completely different way.",
    "c42_karaoke_run": "You run, and only Na Junhyuk’s 100-point screen is left in room 5. Yeo Dain sits on the office-building stairs, gripping her phone.",
    "c42_karaoke_basis": "You demand it in writing, and the answer comes on Monday. All weekend, Yeo Dain takes in guests without knowing why.",
    "c42_karaoke_call": "Startled by your voice, the duty officer stops the texts. On Monday morning, the name of the person who stopped them stays on the record.",
    "c42_breakwater_faces": "When you say it was the faces, Do Yoonha nods. A few of the faces the two of you picture are the same people.",
    "c42_breakwater_duty": "When you say responsibility, the breakwater goes quiet for a moment. Han Seoyun listens as if it were her own story.",
    "c42_breakwater_win": "When you say you wanted to win, Oh Jinwoo laughs loudest. 'See? It’s not just me.' That is a little frightening too.",
    "c42_final_stay": "You stop Yeo Dain’s first, and you eat hangover soup together. You write the opinion on the train to Seoul, in shaky handwriting.",
    "c42_final_attach": "You attach the 47, and the motion grows heavy. One outside director says 'the agenda is getting too complicated' and hangs up.",
    "c42_final_push": "You send only support for the dismissal, and the motion goes up cleanly. The 47 places remain as one line: 'cleanup complete.'",
    "c42_after_warm": "All nine people in the photo have their eyes shut, so Kang Taemin retakes it 12 times. In the sea, Oh Jinwoo asks Han Seoyun for one more round and loses, and the opinion, started on the noon train, goes out 7 minutes before midnight.",
    "c42_after_record": "The document is done as the train passes Wonju. Twenty names from that night’s answers and the 47 addresses go into one file, and Yeo Dain learns by text that her name is in it.",
    "c42_after_rush": "You take the first train, and only your spot is empty in the group photo. In the last line of the guestbook, Yeo Dain writes 'The one in a hurry' in your place.",
    "c42_buoy_choice_1": "You swim together, and Han Seoyun never once looks back. She knows who is behind her.",
    "c42_buoy_choice_2": "Inside the flags, no one gets hurt. But the race ends without you.",
    "c42_buoy_choice_3": "You wake after an hour with half your face burned. You hear who touched first as a rumor on the sand.",
    "c42_ledger_choice_1": "You greet the guests for her; Kang Taemin carries bags and Kwon Dohyun writes receipts. In the meantime Yeo Dain sits down and cries for the first time.",
    "c42_ledger_choice_2": "The request has no gaps. No one will open it before 9 on Monday morning.",
    "c42_ledger_choice_3": "Reassured, Yeo Dain smiles. You are the only one in this room who knows the text is not an error.",
    "c42_embers_choice_1": "When you offer to carry it together, Han Seoyun doesn’t answer. She answers by finishing her cup noodles to the last bite.",
    "c42_embers_choice_2": "Once the person who gave the order is named, Han Seoyun’s return record grows lighter. Everyone already has a guess whose name it is.",
    "c42_embers_choice_3": "As you take the bag to hand them out, Oh Jinwoo pulls one first and starts a sword fight. Han Seoyun’s story stops there.",
    "c42_buoy_reaction_choice_1": "A 'Han Seoyun, 1st place' photo goes up in the group chat, and Do Yoonha sends 30 medal emojis. Han Seoyun makes the photo her wallpaper.",
    "c42_buoy_reaction_choice_2": "The attendance records cover five months, not a day missing. That her diligence becomes the evidence of the injustice makes Han Seoyun sadder.",
    "c42_buoy_reaction_choice_3": "Oh Jinwoo wins the rematch. He is the only one who doesn’t know Han Seoyun swam slow on purpose.",
    "c42_ledger_reaction_choice_1": "When you try to stay by her, Yeo Dain is the one who shoos you off. 'Go see the fireworks. I’ve got guests to take care of.' The office-building light stays on till dawn.",
    "c42_ledger_reaction_choice_2": "Na Junhyuk doesn’t stop his own return record from becoming evidence. This time, the three returns go up as evidence for the other side.",
    "c42_ledger_reaction_choice_3": "At your comforting words, Na Junhyuk nods. Then he stirs one more cup of instant coffee mix. It is his habit when an answer is hard.",
    "c42_embers_reaction_choice_1": "Yeo Dain comes to the breakwater, takes a glow stick and laughs for a long time. The fireworks are over, but today she sees the festival for the first time.",
    "c42_embers_reaction_choice_2": "The list is done at three in the morning. On 39 of the 47 lines, 'no late payments' is written.",
    "c42_embers_reaction_choice_3": "While you rest, night falls on the 47 places too. Some of those houses can’t turn off their lights tonight.",
    "c42_branch_attic_a": "When you show her, Yeo Dain looks at the envelopes for a long time. She learns for the first time what sat in her own attic for 3 years.",
    "c42_branch_attic_b": "To submit it as evidence, you need the owner’s consent first. That is how Yeo Dain first hears what was in her own attic.",
    "c42_branch_attic_c": "The photos stay. As you go to close the box, Yeo Dain comes up the stairs. One spilled envelope lies at her feet.",
    "c42_branch_attic_follow_a": "Copies with the name hidden are a little weaker as evidence. In return, Yeo Dain can keep running her business in this house.",
    "c42_branch_attic_follow_b": "You send it for analysis, and the name under the black ink may come out. The name Mulgyeol Stay gets written somewhere in the indictment too.",
    "c42_branch_attic_follow_c": "You keep the box, and your options grow. The submission deadline draws just as close.",
    "c42_route_system_zero": "The request goes onto NOAH’s settings table. The field that says who has the authority to change that table is empty.",
    "c42_route_system_names": "You find them one by one, and the 47 addresses become people. Restaurants, guesthouses, a laundry, and one house where a grandmother lives alone.",
    "c42_route_system_skip": "Yeo Dain’s case is pulled out. On Monday morning, the other 46 get the same text once more.",
    "c42_final_system_route_a": "Having people look makes it slower. In exchange for the slowness, the 47 places are reviewed with their names.",
    "c42_final_system_route_b": "You buy 1 year. After 1 year, that address is still the same address.",
    "c42_final_system_route_c": "When 47 objections come in, someone has to explain that item.",
    "c42_evidence_turn_board": "The cleanup sheet reaches the board, and the motion’s last sentence wavers. So does the floor that wrote it.",
    "c42_evidence_turn_hold": "Holding it makes it the strongest card on board day. Until then, call texts keep going out to the 47.",
    "c42_evidence_turn_owners": "You tell them first, and the phones at the 47 places ring all at once. Some get angry, and some thank you.",
    "c42_pension_evidence_turn": "Sort out the documents created that same day, and you find where the address came from. Not KD Capital, but one floor of the group. The cross-check finishes only deep in the night, after the fireworks.",
    "c42_karaoke_evidence_turn": "Sort out the documents created that same day, and you find where the address came from. Not KD Capital, but one floor of the group. The cross-check finishes only deep in the night, after the fireworks.",
    "c42_breakwater_evidence_turn": "Sort out the documents created that same day, and you find where the address came from. Not KD Capital, but one floor of the group. The cross-check finishes only deep in the night, after the fireworks.",
    "c42_route_system_evidence_turn": "Sort out the documents created that same day, and you find where the address came from. Not KD Capital, but one floor of the group. The cross-check finishes only deep in the night, after the fireworks.",
    "case42_memory_system": "The reason for the call is two words, 'internal criteria,' and nothing more. There is no gap for your play to get into. NOAH breaks those two words down item by item.",
    "case42_memory_evidence": "Lining things up side by side follows you all the way to Gyeongpo. There is a list of addresses born the morning after the hearing, and the file that made it has a title.",
    "c42_start_warm_go": "You leave without approval, and the Friday morning train is fun. While the CEO field stays empty, your Friday is recorded as neither an absence nor leave.",
    "c42_start_warm_ask": "A formal inquiry becomes a record. HR’s answer comes only two days later. You board the Friday morning train to Gyeongpo without one.",
    "c42_start_warm_laptop": "The laptop goes on top in your bag. Even at the sea, you are a KD Capital employee. That fact may prove useful tomorrow night.",
    "c42_start_warm_signature": "Going empty-handed, your bag is light. On Monday morning, HR leaves an unexcused-absence explanation form on your desk.",
    "c42_start_record_go": "You leave without approval, and the Friday morning train is fun. While the CEO field stays empty, your Friday is recorded as neither an absence nor leave.",
    "c42_start_record_ask": "A formal inquiry becomes a record. HR’s answer comes only two days later. You board the Friday morning train to Gyeongpo without one.",
    "c42_start_record_laptop": "The laptop goes on top in your bag. Even at the sea, you are a KD Capital employee. That fact may prove useful tomorrow night.",
    "c42_start_record_signature": "The leave request with the table attached is approved within two hours. The approver field carries not Yoon Sanghyuk’s name but that of a staffer in the CEO’s office.",
    "c42_start_rush_go": "You leave without approval, and the Friday morning train is fun. While the CEO field stays empty, your Friday is recorded as neither an absence nor leave.",
    "c42_start_rush_ask": "A formal inquiry becomes a record. HR’s answer comes only two days later. You board the Friday morning train to Gyeongpo without one.",
    "c42_start_rush_laptop": "The laptop goes on top in your bag. Even at the sea, you are a KD Capital employee. That fact may prove useful tomorrow night.",
    "c42_start_rush_signature": "The business trip stops at the team head. Instead of skipping the CEO field, you have recorded this 2-day, 1-night trip as company work."
  },
  "choiceVoiceLines": {
    "c42_start_go": "Na Junhyuk’s leave order is enough, you decide, and you leave for Gyeongpo with your colleagues, approval or not.",
    "c42_start_ask": "A field that is neither approved nor returned can’t just be left alone, you say, and you formally ask HR why the approver field is empty.",
    "c42_start_laptop": "So the empty approver field can’t be used against you, you pack the laptop and offer to take work while on leave.",
    "c42_pension_tell": "An owner should know her own house’s history, you say, and you tell Yeo Dain honestly who owned this house before.",
    "c42_pension_check": "You can’t talk about someone’s house on a memorized address alone, so you check the property register and auction records before saying anything.",
    "c42_pension_rest": "Not wanting to cloud her first fully booked day, you keep today as leave and say nothing about the address.",
    "c42_karaoke_run": "The person reading that text alone comes first, so you leave the karaoke room and run to Yeo Dain.",
    "c42_karaoke_basis": "No one takes a house on two unexplained words, you say, and you demand in writing what the 'internal criteria' for the call are.",
    "c42_karaoke_call": "No person sent this text, so a person can stop it, you say, and you call the duty officer and stop the texts on your own authority.",
    "c42_breakwater_faces": "Do Yoonha’s answer doesn’t sound like someone else’s, so you say it was the faces of the people behind the dissent.",
    "c42_breakwater_duty": "If the writer backs down, the document backs down too, you say, and you tell them you wanted to answer for your dissent to the end.",
    "c42_breakwater_win": "Oh Jinwoo was the first to admit something embarrassing, you say, and you admit honestly that you wanted to beat Yoon Sanghyuk.",
    "c42_final_stay": "You can’t leave behind someone carrying out a pot of hangover soup, so before Seoul you stop Yeo Dain’s call classification first.",
    "c42_final_attach": "So forty-seven households don’t pay the price of pushing one man out, you demand that the dismissal motion also halt the calls on the 47.",
    "c42_final_push": "A dismissal motion that has come this far can’t be shaken, you say, and today you send only a pro-dismissal opinion, leaving out the 47.",
    "c42_after_warm": "Wanting your faces on the guestbook’s first page too, you take the group photo and stay by the sea with your colleagues till the noon train.",
    "c42_after_record": "So it can ground the opinion due at midnight, you write up that night’s answers and the 47 on the train.",
    "c42_after_rush": "The opinion due at midnight comes first, you say, and you take the first train to Seoul before the group photo.",
    "c42_buoy_choice_1": "Not letting someone who went in without a word go alone, you swim with Han Seoyun all the way to the buoy.",
    "c42_buoy_choice_2": "200 meters is no distance for a bet, you say, and you check the lifeguard flag zone and stay on the beach.",
    "c42_buoy_choice_3": "Leave is an order to rest, you say, and you lie in the parasol’s shade and sleep a full hour.",
    "c42_ledger_choice_1": "She got that text and still has a full house to greet, so you take over tonight’s guest check-ins for her.",
    "c42_ledger_choice_2": "Fourteen months say she did nothing wrong, you say, and you write a re-review request together on the record of 0 late payments.",
    "c42_ledger_choice_3": "To get her through tonight at least, with every room booked, you reassure Yeo Dain that it’s a common system error.",
    "c42_embers_choice_1": "3 years carried alone is enough, you say, and you offer to carry Han Seoyun’s return record together from now on.",
    "c42_embers_choice_2": "The one who should be ashamed is someone else, you say, and you propose proving on the record who ordered that return.",
    "c42_embers_choice_3": "To loosen a moment where no one could laugh along, you hand out glow sticks and change the mood first.",
    "c42_buoy_reaction_choice_1": "A first place after so many years can’t be known only to the sea, you say, and you propose bragging about today’s win in the group chat.",
    "c42_buoy_reaction_choice_2": "So five months of swiping in with nowhere to go aren’t wasted, you propose saving her standby attendance records as evidence.",
    "c42_buoy_reaction_choice_3": "So a 3-second gap doesn’t make the whole evening loud, you side with Oh Jinwoo and tell her to grant the rematch.",
    "c42_ledger_reaction_choice_1": "Not leaving him to keep his promise not to return it alone, you stay by Yeo Dain tonight together with Na Junhyuk.",
    "c42_ledger_reaction_choice_2": "To show the problem was this address’s former owner, you attach Na Junhyuk’s return record as reference for the re-review.",
    "c42_ledger_reaction_choice_3": "There’s no need to pile shame onto tonight as well, you say, and you comfort Na Junhyuk that what’s past is past.",
    "c42_embers_reaction_choice_1": "The one the owner’s glow stick is for is alone in the office building, so you take a glow stick and bring Yeo Dain to the breakwater.",
    "c42_embers_reaction_choice_2": "To write down who lives at each punished address, you sort out the list of 47 addresses tonight.",
    "c42_embers_reaction_choice_3": "Staying up all night won’t bring back texts already sent, you say, and you rest tonight and look at the 47 on Monday.",
    "c42_branch_attic_a": "What came with the house belongs to its owner, you say, and you show Yeo Dain and ask what to do with the mail.",
    "c42_branch_attic_b": "Papers someone ordered destroyed must stay exactly as they are, you say, and you touch nothing and prepare it as evidence for prosecutors.",
    "c42_branch_attic_c": "Digging through boxes isn’t for a day on leave, you say, and you photograph only the envelope fronts and close the box again.",
    "c42_branch_attic_follow_a": "The person who has to keep living here comes first, you say, and you hide the house’s name as she asks and hand over copies only.",
    "c42_branch_attic_follow_b": "One erased name is everything in this box, you say, and you get the blacked-out name analyzed and hand the originals to prosecutors.",
    "c42_branch_attic_follow_c": "Whether to leave out the house’s name isn’t something to weigh right now, you say, and you keep the box and decide later how to use it.",
    "c42_route_system_zero": "No one should punish the people who live there for the people who lived there, you say, and you formally request the address weight be set to 0.",
    "c42_route_system_names": "To fill in what NOAH said it doesn’t know, you find out, one by one, who lives at the forty-seven addresses now.",
    "c42_route_system_skip": "Tonight the urgent one is this house, you say, and you leave the item and ask them to exempt Yeo Dain’s case alone.",
    "c42_final_system_route_a": "Only people can read who is sleeping there now, you say, and you change the rule so the reputation item counts only in human review.",
    "c42_final_system_route_b": "So that no house has to close right away, you keep the item and delay the calls by 1 year.",
    "c42_final_system_route_c": "What the table can’t read, the owners can say, you decide, and you tell the 47 owners how to file an objection first.",
    "c42_evidence_turn_board": "So the directors see how the number was filled, you attach the cleanup sheet to your opinion and submit it to the board.",
    "c42_evidence_turn_hold": "Submitting early gives them time to rewrite, you say, and you hold the cleanup sheet and bring it out on board day.",
    "c42_evidence_turn_owners": "The people paying the price must not be the last to know, you say, and you tell the owners of the 47 places first.",
    "c42_pension_evidence_turn": "You sort out which clue document the guesthouse’s address appeared on the same day as, and trace where the address came from.",
    "c42_karaoke_evidence_turn": "You sort out which clue document the guesthouse’s address appeared on the same day as, and trace where the address came from.",
    "c42_breakwater_evidence_turn": "You sort out which clue document the guesthouse’s address appeared on the same day as, and trace where the address came from.",
    "c42_route_system_evidence_turn": "You sort out which clue document the guesthouse’s address appeared on the same day as, and trace where the address came from.",
    "c42_start_warm_go": "Na Junhyuk’s leave order is enough, you decide, and you leave for Gyeongpo with your colleagues, approval or not.",
    "c42_start_warm_ask": "A field that is neither approved nor returned can’t just be left alone, you say, and you formally ask HR why the approver field is empty.",
    "c42_start_warm_laptop": "So the empty approver field can’t be used against you, you pack the laptop and offer to take work while on leave.",
    "c42_start_warm_signature": "Deciding not to wait for the empty field to be filled, you keep that night’s promise and leave empty-handed, without a single paper.",
    "c42_start_record_go": "Na Junhyuk’s leave order is enough, you decide, and you leave for Gyeongpo with your colleagues, approval or not.",
    "c42_start_record_ask": "A field that is neither approved nor returned can’t just be left alone, you say, and you formally ask HR why the approver field is empty.",
    "c42_start_record_laptop": "So the empty approver field can’t be used against you, you pack the laptop and offer to take work while on leave.",
    "c42_start_record_signature": "So the man who didn’t recall can’t pretend not to see this field, you attach the 23-row table to the leave request and resubmit it.",
    "c42_start_rush_go": "Na Junhyuk’s leave order is enough, you decide, and you leave for Gyeongpo with your colleagues, approval or not.",
    "c42_start_rush_ask": "A field that is neither approved nor returned can’t just be left alone, you say, and you formally ask HR why the approver field is empty.",
    "c42_start_rush_laptop": "So the empty approver field can’t be used against you, you pack the laptop and offer to take work while on leave.",
    "c42_start_rush_signature": "Deciding to wait no longer for the person keeping that field empty, you refile the leave as a business trip to Gyeongpo."
  },
  "pack": {
    "clue": {
      "title": "Punishment That Falls on Addresses",
      "text": "NOAH’s new item, 'location reputation risk,' came from the group legal team’s 'Yoon Sanghyuk-Related Asset Cleanup Sheet.' Of the 47 places, 39 had never once paid late."
    },
    "outcomes": {
      "c42_after_warm": {
        "tag": "Stayed by the Sea",
        "title": "You stayed to the last firework, and everyone was in the morning photo",
        "text": "You took the group photo 12 times, and everyone went into the sea once more. On the noon train, nine people passed the opinion around and revised it, and it reached the outside directors 7 minutes before midnight."
      },
      "c42_after_record": {
        "tag": "Kept on Record",
        "title": "That night’s answers and the 47 became one file",
        "text": "On the train back, you wrote up the answers from below the breakwater and the 47 addresses. 20 names and 39 counts of 'no late payments' go into the opinion."
      },
      "c42_after_rush": {
        "tag": "Went Up First",
        "title": "You left your spot in the group photo empty and took the first train",
        "text": "You went up to Seoul on the first train at dawn. Your colleagues took the photo with your spot left empty, and in the last line of the guestbook stayed 'The one in a hurry,' written by Yeo Dain in your place."
      }
    },
    "continuityChallenges": {
      "c41_after_warm": {
        "title": "Rest with the people who stayed to the end",
        "text": "The people who spent the hearing night together have gathered again. Even on a trip to rest, if you put those people ahead of work, trust doesn’t shrink."
      },
      "c41_after_record": {
        "title": "Use the 23 rounds of 'I don’t recall' again",
        "text": "The table you made was for the hearing. What use it has for one person by the sea shows only after you reshape the table."
      },
      "c41_after_rush": {
        "title": "Catch up on the procedures you left behind",
        "text": "While you ran ahead for six days, procedure was left behind. Lodge a formal objection to the empty approval field and the automatic texts, and fairness finds its place again."
      }
    }
  }
};
