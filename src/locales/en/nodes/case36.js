/**
 * 사건 36 (src/nodes/case36.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c36_start": {
      "title": "The Card from Hannam-dong",
      "text": "You open the card. It is an invitation the chairman’s office already sent by text yesterday. 'Sunday, 19:00, Hannam-dong. Let’s have a meal. Seo Dokyung.' It is the name of the chairman of KD Financial Group. The same morning, Yoon Sanghyuk gets his second prosecutors’ summons on charges of breach of trust (betraying a duty and causing the company a loss). It is the case of the Haeon Partners advisory fees (money paid out as the price of advice). When you take the card down to the 1st floor, Han Seoyun, on standby assignment (an HR measure that leaves someone without duties while waiting for a next post), is waiting with two iced coffees. She turns the card over and doesn’t even smile. 'This isn’t the chairman’s handwriting. It’s his chief of staff’s. He has other people write even his own name.' She gives her straw one turn. 'Two kinds of people get called to that table. The ones who get a seat, and the ones who give a seat up.'",
      "memo": [
        "Invitation: Sunday, July 26, 19:00, the chairman’s home in Hannam-dong",
        "Yoon Sanghyuk -- breach of trust over the Haeon Partners advisory fees, second summons",
        "Handwriting on the card: chief of staff Yeo Minkyu",
        "KD Financial Group’s largest shareholder: Kingsdale Partners, New York, about 30% stake",
        "Your status: unsworn witness in the same case"
      ],
      "choices": {
        "c36_start_alone": {
          "label": "Tell no one and go alone on Sunday"
        },
        "c36_start_log": {
          "label": "First put the invitation on record in your witness statement"
        },
        "c36_start_share": {
          "label": "Post the invitation in the six’s group chat and decide together"
        },
        "reframe": {
          "label": "Build a timeline of how the group has closed its incidents"
        }
      },
      "place": "KD Capital Risk Management · Your Desk",
      "clock": "D-6 to the Hannam-dong dinner · Monday, July 20",
      "question": "The chairman has sent a dinner invitation in someone else’s handwriting. With whom, and how, will you take it?",
      "lead": "You pass Yoon Sanghyuk’s office, dark since the search and seizure (an investigation that takes documents and items by force with a court’s permission), and at your desk a cream-colored card is already waiting on your keyboard."
    },
    "c36_garden": {
      "title": "Hold the Ladder",
      "text": "Kang Taemin’s old 1-ton truck climbs the hill in Hannam-dong. He swapped tonight’s night shift with a coworker to drive you, and he cuts the engine at the gate. 'This is as far as I go. I’ve got two cup noodles.' Inside the gate, the heat wave turns cool, as if it were a lie. Under a persimmon tree at the end of the stone path, an old man in a straw hat stands on a ladder, pruning branches. You took him for the gardener; he looks down at you. 'Hold the ladder for me. My father planted this tree, so I can’t leave it to anyone else.' It is Chairman Seo Dokyung. Between snips of the shears, he asks. 'I hear Mangwon Market flooded in the rain ten days ago. Is the rice cake shop all right?' He already knows about Moon Gaeul’s shop, and how many emergency loans NOAH declined. 'A company runs on memory, not on people. And I happen to remember quite a lot.'",
      "memo": [
        "Persimmon tree, 61 years old -- planted by the chairman’s father",
        "First topic the chairman raised: the Mangwon Market flood",
        "Waiting outside the gate: Kang Taemin’s 1-ton truck",
        "30 minutes until you sit at the table"
      ],
      "choices": {
        "c36_garden_ladder": {
          "label": "Hold the ladder in silence and hear the chairman out"
        },
        "c36_garden_record": {
          "label": "Say first that, as a witness, you will record today’s talk"
        },
        "c36_garden_flood": {
          "label": "Still holding the ladder, press him on the flood loan declines"
        },
        "reframe": {
          "label": "Build a timeline of how the group has closed its incidents"
        },
        "c36_garden_evidence_turn": {
          "label": "Connect the appointment records of the last three compliance officers"
        }
      },
      "place": "Chairman Seo Dokyung’s Home, Hannam-dong · Under the Persimmon Tree",
      "clock": "Sunday 18:30 · Heat Wave",
      "question": "The chairman asks you to hold his ladder and brings up the Mangwon Market flood first. What will your first words be?",
      "lead": "Kang Taemin’s truck stops at the gate, and the snip of shears carries from the end of the stone path."
    },
    "c36_table": {
      "title": "A Dish with Too Long a Name",
      "text": "The young chef Eun Jaeha sets down the first plate and recites. '72-hour aged Hanwoo striploin on a purée of new Jeju potatoes, with Sancheong green plum syrup and charred scallion ash.' Chairman Seo Dokyung nods. 'The first one, then.' Through the fifth plate, he calls them only by number. Behind him, chief of staff Yeo Minkyu, whispering from the menu card, reads 'scallion ash' as 'scallion rash,' and the chef’s eyebrows go up. At the sixth plate, the chairman sets down his fork. 'Yoon Sanghyuk alone will do. The prosecutors and the papers both want one name. We give them that name, and the group declares its reform complete. You sit in the seat that confirms that declaration.' That seat is compliance officer (the person inside a company who watches whether it follows the law and its rules). It is the price of cutting off the tail (putting all the blame on one person below so those above walk away).",
      "memo": [
        "Table for 12 -- 2 places set",
        "Nine dishes; the chairman calls them by number",
        "Offer: sole blame on Yoon Sanghyuk + reform declared complete",
        "Price: the group compliance officer’s seat"
      ],
      "choices": {
        "c36_table_terms": {
          "label": "Ask to see the officer’s powers and term in writing first"
        },
        "c36_table_listen": {
          "label": "Repeat the sixth dish’s name and hear the offer to the end"
        },
        "c36_table_victims": {
          "label": "Talk about the 1,740 victims, not one Yoon Sanghyuk"
        },
        "reframe": {
          "label": "Build a timeline of how the group has closed its incidents"
        },
        "c36_table_evidence_turn": {
          "label": "Connect the appointment records of the last three compliance officers"
        }
      },
      "place": "Chairman’s Home, Hannam-dong · Twelve-Seat Table",
      "clock": "Sunday 19:40",
      "question": "He offers to put all the blame on Yoon Sanghyuk and give you the seat that confirms it. How do you answer?",
      "lead": "At a table with no phones, only two places are set, and the chef recites the first plate’s name without stopping for breath."
    },
    "c36_father": {
      "title": "His Father’s Savings House",
      "text": "Dessert is a peach the chairman peeled himself. He leads you out to a bench under the persimmon tree and holds out an old bankbook. Stamped on the cover: 'Seomun Mutual Savings & Finance.' A mutual savings and finance company (a neighborhood lender, like today’s savings banks). 'It was my father’s shop. He took the deposits of a Daegu market’s merchants and lent them to the merchants. It started with one line of his name on a guarantee for a friend’s company.' When that company collapsed, a line formed in front of the savings house, and his father went from depositor to depositor, house by house, bowing to each, he says. 'He died two years later. I was nineteen.' Peach juice runs down his wrist and he doesn’t wipe it. 'Since then I don’t write my name on paper. The one who signs ends up paying for everything.' His voice wavers for a moment, then comes right back. 'So this time, too, one name will do.'",
      "memo": [
        "Seomun Mutual Savings & Finance -- closed in 1980",
        "The chairman’s father: one signed line on a guarantee; died 2 years later",
        "Decision documents bearing the chairman’s name: 0 in the past 20 years",
        "Planned reform announcement: Monday, August 3"
      ],
      "choices": {
        "c36_father_sign": {
          "label": "Demand he sign: decide in the chairman’s own name this time"
        },
        "c36_father_raise": {
          "label": "Use the crack to add your colleagues’ reinstatement to the terms"
        },
        "c36_father_stay": {
          "label": "Hear out his father’s story and ask about the people in that line"
        },
        "reframe": {
          "label": "Build a timeline of how the group has closed its incidents"
        },
        "c36_father_evidence_turn": {
          "label": "Connect the appointment records of the last three compliance officers"
        }
      },
      "place": "Chairman’s Home, Hannam-dong · Garden Bench",
      "clock": "Sunday 21:20",
      "question": "After the story of a father who signed one line on a guarantee, the chairman again asks for one name. What will you do?",
      "lead": "Holding a plate of peaches, Chairman Seo Dokyung leaves the table and heads first to the bench under the persimmon tree."
    },
    "c36_final": {
      "title": "The Space Kept for a Frame",
      "text": "When you return to the table, the plates are cleared and two sheets of paper lie there. A proposal appointing a compliance officer (the person inside a company who watches whether it follows the law and its rules), and a reform announcement dated next Monday. The signature line at the bottom of the appointment does not carry Chairman Seo Dokyung’s name. The acting board chair’s name is printed there. The chairman sets a peach pit on his plate. 'It goes to the board next Monday. Yoon Sanghyuk steps down on Monday, and the group hands its materials to the prosecutors first. Your first task can be the round 2 compensation criteria and the 212. Isn’t that what you wanted?' For the first time he looks you straight in the eye. 'One name makes things easier for thousands. I wish it had been that way in my father’s day.' Yeo Minkyu lays a pen across the table.",
      "memo": [
        "Compliance officer appointment -- signature line: acting board chair",
        "Reform announcement: Monday, August 3, sole blame on Yoon Sanghyuk",
        "English copy sent to: Kingsdale Partners Asia Portfolio Review, early Monday New York time",
        "First task offered: round 2 compensation criteria and the 212",
        "Board meeting: Monday, August 3"
      ],
      "choices": {
        "c36_final_audit": {
          "label": "Take the seat, but make this table the first audit target"
        },
        "c36_final_refuse": {
          "label": "Refuse; see the inquiry through with colleagues and victims"
        },
        "c36_final_take": {
          "label": "Take the seat and get round 2 compensation into Monday’s announcement"
        },
        "reframe": {
          "label": "Change the game one last time with a proposal"
        }
      },
      "place": "Chairman’s Home, Hannam-dong · Twelve-Seat Table",
      "clock": "Sunday 22:00 · Eight Days to the Board",
      "question": "An appointment without the chairman’s name and an announcement blaming Yoon Sanghyuk alone lie before you. What will you do?",
      "lead": "When you come back in through the gate, every plate is cleared, and only two sheets of paper and one pen remain on the table."
    },
    "c36_aftershock": {
      "title": "The Truck Outside the Gate",
      "text": "The gate closes behind the table that wanted to trade Yoon Sanghyuk’s one name for the compliance officer’s seat. Kang Taemin’s truck goes down the hill in Hannam-dong. It is past eleven at night, and even with the windows open the wind is hot. Rice cakes wrapped in plastic come out of the glove box. Moon Gaeul sent them with Kang Taemin in the afternoon, saying, 'Dinner at the chairman’s won’t fill you up.' As you take a bite, Kang Taemin speaks with his eyes on the road. 'Whatever you picked in there today, I’m going to work again tomorrow. So it’s okay.' While you wait at a light, your phone rings. It is Lee Minseo. 'On the KD Data Lab server, the Trigger Lab response records folder was opened three times tonight alone. The account that opened it has no name. An account without a name isn’t supposed to be able to exist.'",
      "memo": [
        "Left Hannam-dong 23:12",
        "Moon Gaeul’s rice cakes -- sent with Kang Taemin",
        "Lee Minseo: Trigger Lab records folder accessed 3 times, account has no name",
        "Eight days to the August 3 board meeting"
      ],
      "choices": {
        "c36_after_warm": {
          "label": "Turn the truck toward your colleagues at the bookshop’s 1st floor"
        },
        "c36_after_rush": {
          "label": "Go straight to copying the papers meant for cutting off the tail"
        },
        "c36_after_record": {
          "label": "Write down the table’s offer as said; send it to Han Jiwoo and Na Eunho"
        }
      },
      "place": "Hannam-dong Alley · Inside Kang Taemin’s Truck",
      "clock": "Sunday 23:12",
      "question": "On the truck ride back, word comes that a nameless account opened the Trigger Lab records. Where will you close this night?"
    },
    "c36_phone": {
      "title": "The Lacquered Basket",
      "text": "Chief of staff Yeo Minkyu waits in the entrance hall. He has been at Chairman Seo Dokyung’s side for 20 years, and he is known to write every sentence that goes out in the chairman’s name. He holds out a lacquered basket and a sheet of paper. 'Phones do not come to the table. And this is a formality.' It is a confidentiality pledge (a promise not to carry what you learn outside). Article 3 catches your eye. 'What is heard will not be disclosed to third parties, including investigative agencies.' Yeo Minkyu uncaps a pen and hands it to you. 'Everyone has signed. CEO Yoon too.'",
      "memo": [
        "Phone basket -- lacquered, two compartments",
        "Pledge Article 3: no disclosure to third parties, investigators included",
        "Yeo Minkyu: chief of staff for 20 years, writes the sentences in the chairman’s name"
      ],
      "choices": {
        "c36_phone_choice_1": {
          "label": "Instead of signing, say up front you’ll share what you hear with colleagues"
        },
        "c36_phone_choice_3": {
          "label": "If it’s a formality, sign the pledge and hand over your phone"
        },
        "c36_phone_choice_2": {
          "label": "Strike the investigator clause and write in an exception for crimes"
        }
      },
      "place": "Chairman’s Home, Hannam-dong · Entrance Hall",
      "clock": "Sunday 19:00",
      "question": "You are handed a pen and a pledge not to tell even investigators. What will you do?"
    },
    "c36_draft": {
      "title": "The Third Paragraph",
      "text": "Before dessert, Chairman Seo Dokyung goes to his study to take a call, and Yeo Minkyu shows you to a waiting room. Two A4 sheets lie face down on the table. You can’t tell whether he is pretending he forgot to clear them or really forgot. The title is 'KD Financial Group Reform Completion Announcement,' and the date is Monday, August 3. The third paragraph has this sentence. 'The new compliance officer confirmed that these measures are sufficient to prevent a recurrence.' The name field is empty. Yeo Minkyu sets down a glass of water. 'Every sentence that goes out in the chairman’s name, I write. Just this once, I wish this one weren’t mine.'",
      "memo": [
        "Reform completion announcement -- dated Monday, August 3",
        "Third paragraph: the new compliance officer’s 'confirmation'",
        "Name field empty; written by Yeo Minkyu"
      ],
      "choices": {
        "c36_draft_choice_1": {
          "label": "Ask that your name field be struck from the third paragraph"
        },
        "c36_draft_choice_2": {
          "label": "Copy the announcement’s date and sentence by hand"
        },
        "c36_draft_choice_3": {
          "label": "Pretend you saw nothing; turn it face down and go back"
        }
      },
      "place": "Chairman’s Home, Hannam-dong · Chief of Staff’s Waiting Room",
      "clock": "Sunday 20:50",
      "question": "In the third paragraph of the reform announcement, the field for your name is blank. What will you do?"
    },
    "c36_gate": {
      "title": "10 Minutes Outside the Gate",
      "text": "Chairman Seo Dokyung says, 'Go think for 10 minutes outside the gate. I’ll hear your answer at the table.' Yeo Minkyu gives back your phone. In the alley outside the gate, Kang Taemin sits on the truck bed sharing cup noodles with a security guard. The guard greets you first. 'The foreman pours the water right to the line.' Your phone holds 186 messages in the group chat. Kang Taemin has been sending updates from outside the gate for three hours. When you post the table’s offer in one line, Kwon Dohyun makes a two-column table of the compliance officer’s salary and Yoon Sanghyuk’s charges and writes, 'Neither column is in the black.' Oh Jinwoo writes, 'Take it and you’re No. 1. Refuse and you’re a legend.' Do Yoonha leaves just one line. 'Watch whose name gets left out.'",
      "memo": [
        "186 messages in the group chat",
        "Kang Taemin and the guard -- on their second cup noodles",
        "Time the chairman gave: 10 minutes"
      ],
      "choices": {
        "c36_gate_choice_2": {
          "label": "Save the whole group chat as a record of the offer"
        },
        "c36_gate_choice_1": {
          "label": "No vote: ask each colleague for just one line"
        },
        "c36_gate_choice_3": {
          "label": "Put the phone face down and take a bite of Kang Taemin’s noodles first"
        }
      },
      "place": "Outside the Chairman’s Gate, Hannam-dong · Alley",
      "clock": "Sunday 21:50",
      "question": "10 minutes outside the gate, and 186 messages waiting in the group chat. How will you hear your colleagues?"
    },
    "c36_phone_reaction": {
      "title": "Before the Basket",
      "text": "Just as you are about to put your phone in the basket, a message appears on the screen. It is Yoon Seojin. 'You’re going to Hannam-dong today, right? Dad knows. He’s been staring at the clock in the living room all evening.' One more line comes. 'Dad sat at that table for 12 years. He says who sits in that chair today feels like a verdict to him. I want Dad to be punished. But I don’t want him punished alone. Is that strange?' Yeo Minkyu waits, holding the basket. In the air conditioning, the corner of the pledge lifts.",
      "memo": [
        "Yoon Seojin: 'I don’t want him punished alone'",
        "Yoon Sanghyuk sat at that table for 12 years"
      ],
      "choices": {
        "c36_phone_reaction_choice_1": {
          "label": "Reply 'It isn’t strange' and hand over your phone"
        },
        "c36_phone_reaction_choice_3": {
          "label": "Put the phone in the basket without replying"
        },
        "c36_phone_reaction_choice_2": {
          "label": "Ask Yoon Seojin if her message may go in your witness file"
        }
      },
      "place": "Chairman’s Home, Hannam-dong · Entrance Hall",
      "clock": "Sunday 19:02",
      "question": "Yoon Seojin says she doesn’t want her father punished alone, and asks if that is strange. What do you answer?"
    },
    "c36_draft_reaction": {
      "title": "The Seventh Plate",
      "text": "On your way out of the waiting room, the kitchen door is open. Eun Jaeha is mixing bibimbap for the staff from leftover ingredients; he sees you and takes out one more spoon. 'The long dish names are my revenge. The chairman has never once memorized one. I’ve been adding one word at a time for 3 years now.' The kitchen staff laugh. Then his spoon stops. 'My mom runs a side-dish shop in Mangwon Market. The rain ten days ago flooded all three of her fridges, and her emergency loan was declined in 0.6 seconds. A mom whose son works in the chairman’s kitchen.'",
      "memo": [
        "Why the dish names are long: the chef’s revenge",
        "Emergency loan for the chef’s mother’s shop -- declined in 0.6 seconds"
      ],
      "choices": {
        "c36_draft_reaction_choice_2": {
          "label": "Ask Eun Jaeha if you may record it as a flood decline case"
        },
        "c36_draft_reaction_choice_3": {
          "label": "Have one spoonful of bibimbap and return to the table"
        },
        "c36_draft_reaction_choice_1": {
          "label": "Send his mother’s emergency loan back up for human review"
        }
      },
      "place": "Chairman’s Home, Hannam-dong · Kitchen",
      "clock": "Sunday 21:00",
      "question": "The emergency loan for the chef’s mother’s side-dish shop was declined in 0.6 seconds. What will you do?"
    },
    "c36_gate_reaction": {
      "title": "The Ladder 12 Years Ago",
      "text": "With 4 of the 10 minutes left, a call comes from an unknown number. It is Yoon Sanghyuk. His voice is lighter than you expected. 'The persimmon ladder. Did you hold it for him? I held it too, 12 years ago.' He laughs briefly. 'Take it. Refuse, and someone else sits in that chair, and that someone will be less trouble than you. I’m a man who ends with one name anyway.' For a moment there is only his breathing. 'Don’t tell Seojin. She still believes I’m not alone.' He waits for your answer. Kang Taemin, drinking the broth from his cup noodles, looks at your face.",
      "memo": [
        "Yoon Sanghyuk held the same ladder 12 years ago",
        "'Don’t tell Seojin'"
      ],
      "choices": {
        "c36_gate_reaction_choice_3": {
          "label": "Hang up without answering and walk back through the gate"
        },
        "c36_gate_reaction_choice_2": {
          "label": "Say you’ll attach the call to your witness statement"
        },
        "c36_gate_reaction_choice_1": {
          "label": "Tell Yoon Sanghyuk the table’s offer exactly as it was made"
        }
      },
      "place": "Hannam-dong Alley · Beside Kang Taemin’s Truck",
      "clock": "Sunday 21:56",
      "question": "Yoon Sanghyuk tells you over the phone to take it, and not to tell his daughter. How do you answer?"
    },
    "c36_branch_annex": {
      "title": "Nail Holes in the Annex Hallway",
      "text": "While Chairman Seo Dokyung goes in to take a call, the real gardener, Seok Munho, coils a water hose and points with his chin. 'If you’re hot, go wait in the annex hallway. The air conditioning’s strongest there.' About forty frames hang on both walls of the annex hallway. Every one is a photo of the chairman and a single executive under this persimmon tree. Seok Munho puts down the hose. 'Forty years I’ve kept this garden, and more pictures come down than go up. Where one comes down, a nail hole stays.' He runs a finger along the wall. There are eleven nail holes.",
      "memo": [
        "Annex hallway: about 40 frames -- all under the persimmon tree",
        "11 nail holes where frames were taken down",
        "Gardener Seok Munho: 40 years in this garden",
        "Chairman on a call -- 20 minutes to the table"
      ],
      "choices": {
        "c36_branch_annex_b": {
          "label": "Match each frame’s date against the group’s incident timeline"
        },
        "c36_branch_annex_a": {
          "label": "Ask Seok Munho whom the 11 nail holes belonged to"
        },
        "c36_branch_annex_c": {
          "label": "It’s someone else’s wall: leave the photos, rest in the cool"
        }
      },
      "place": "Chairman’s Home, Hannam-dong · Annex Hallway",
      "clock": "Sunday 18:45 · Heat Wave",
      "question": "Among the frames shot under the persimmon tree are 11 nail holes. How will you read this wall?"
    },
    "c36_branch_annex_follow": {
      "title": "The Frame from 12 Years Ago",
      "text": "One frame at the end of the hallway is unusually new. A date 12 years ago, Chairman Seo Dokyung on a ladder, and a man in his 30s gripping the ladder and looking up. Yoon Sanghyuk. Exactly the spot where you stood today. Seok Munho wipes the dust off a corner of the frame. 'That gentleman made team head three months after this was taken. But lately the chief of staff’s office has been asking for a nail puller to take this one down.' He looks at your hands. The hands that held the ladder earlier. 'The next frame’s spot is already cleared. There, where the light is on.'",
      "memo": [
        "Yoon Sanghyuk’s frame -- 12 years ago, holding the ladder",
        "Promoted to team head three months after the photo",
        "Chief of staff’s office looking for a nail puller",
        "One new frame spot -- lighting already installed"
      ],
      "choices": {
        "c36_branch_annex_follow_b": {
          "label": "Put the frame’s date and Yoon Sanghyuk’s promotion on the evidence list"
        },
        "c36_branch_annex_follow_a": {
          "label": "To keep Seok Munho safe, bury what you heard today"
        },
        "c36_branch_annex_follow_c": {
          "label": "See the empty spot, pretend you didn’t, and head to the table"
        }
      },
      "place": "Chairman’s Home, Hannam-dong · End of the Annex Hallway",
      "clock": "Sunday 18:50",
      "question": "Here is Yoon Sanghyuk’s frame from 12 years ago, holding the same ladder, and a new spot left empty. What will you do?"
    },
    "c36_route_system": {
      "title": "The Statistics of One Name",
      "text": "What is Chairman Seo Dokyung’s table meant to close? You build a timeline of how the group has closed its major incidents. On the KD Capital terminal, NOAH opens KD Financial Group’s 34 major incidents of the past 20 years. 29 of them ended with one executive’s resignation and a 'reform complete' announcement. In 21 cases, the same kind of incident happened again within 3 years of the announcement. Among the decision documents of the 29 who resigned, not one bore the chairman’s name. NOAH adds a line. 'One name has been learned as the cheapest form for closing an incident. I was taught to decline loans with the same form.'",
      "memo": [
        "Of 34 major incidents, 29 ended with 1 executive resigning",
        "21 recurred in the same shape within 3 years",
        "Decision documents bearing the chairman’s name: 0"
      ],
      "choices": {
        "c36_route_system_publish": {
          "label": "Release the numbers to all staff and the FSS before the board"
        },
        "c36_route_system_drop": {
          "label": "Bury the numbers; just secure your terms at the table"
        },
        "c36_route_system_names": {
          "label": "Find the 29 who resigned and ask whose place they left in"
        },
        "c36_route_system_evidence_turn": {
          "label": "Connect the appointment records of the last three compliance officers"
        }
      },
      "place": "KD Capital Risk Management · NOAH Terminal",
      "clock": "D-5 to the Hannam-dong dinner",
      "question": "29 group incidents were closed by one executive’s resignation, and 21 happened again. What will you do with these numbers?"
    },
    "c36_final_system_route": {
      "title": "The 30th Reform Complete",
      "text": "Before dawn on the day you go to Hannam-dong, the first sentences of 29 announcements sit side by side on the NOAH terminal. Only the departing executive’s name differs; the rest is the same. The 30th announcement is still a draft, and Yoon Sanghyuk is in its name field. Chairman Seo Dokyung’s name appears nowhere in the 29. NOAH notes beneath the draft. 'Of the incidents closed with this form, 21 reopened. The form was not wrong. Closing is what the form does.'",
      "memo": [
        "29 incidents closed by 1 executive resigning -- 21 recurred",
        "Decision documents bearing the chairman’s name: 0",
        "Hannam-dong dinner: today, 19:00"
      ],
      "choices": {
        "c36_final_system_route_c": {
          "label": "Gather resigned executives’ testimony and expose how decisions are made"
        },
        "c36_final_system_route_a": {
          "label": "Require the real decision-maker’s name on every decision document"
        },
        "c36_final_system_route_b": {
          "label": "Leave the rules; close this one with Yoon Sanghyuk alone"
        }
      },
      "place": "KD Capital Risk Management · NOAH Terminal",
      "clock": "Day of the Dinner · Before Dawn",
      "question": "The name field of the 30th announcement is already filled. Before you sit at the table, what will you write beside it?"
    },
    "c36_evidence_turn": {
      "title": "The Fourth Chair",
      "text": "When you hold the clue against the appointment dates in the HR records, one line of the group’s HR records connects. In the past 12 years, KD Financial Group has had three compliance officers (the person inside a company who watches whether it follows the law and its rules). All three were appointed within 2 weeks of a major incident, and each was invited to the Hannam-dong table just before the appointment. The conclusions of the three people’s first reports do not differ by a single letter. 'No further investigation needed.' And all three moved to advisory posts at affiliates (other companies in the same group) within 18 months. Ban Jaewook closes the notebook he was writing in. 'It isn’t a seat for watching. It’s a seat for stamping confirmation that the cut-off tail isn’t growing back. The chair that table is offering you is the fourth.'",
      "memo": [
        "3 compliance officers -- all appointed within 2 weeks of an incident",
        "First report conclusion: 'No further investigation needed'",
        "All three to affiliate advisory posts within 18 months"
      ],
      "choices": {
        "c36_evidence_turn_hold": {
          "label": "Keep the records and bring them out just before next week’s board"
        },
        "c36_evidence_turn_visit": {
          "label": "Visit the three former officers and ask what they confirmed"
        },
        "c36_evidence_turn_file": {
          "label": "Formally submit the three appointment records to Han Jiwoo at the FSS"
        }
      },
      "place": "KD Financial Group HQ · HR Records Room",
      "clock": "Sunday 22:30",
      "question": "The three previous compliance officers all wrote the same conclusion and left. How will you use these records?"
    },
    "c36_start_warm": {
      "title": "An Invitation the Day After the Tray Emptied",
      "text": "In Mangwon Market after the rain, you stayed with the market people until a whole tray of rice cakes was gone. That night, when the dishes were done too, a text from Chairman Seo Dokyung’s office was waiting on your phone. The next day, Monday, July 20, Moon Gaeul brings the leftover rice cakes all the way to the KD Capital lobby. 'This is for bailing out the water. Don’t you dare pay.' On top of the cloth bundle sits a cream-colored card sent up from the security desk. 'Sunday, 19:00, Hannam-dong. Let’s have a meal. Seo Dokyung.' The chairman of KD Financial Group. The same day, Yoon Sanghyuk gets his second summons on charges of breach of trust (betraying a duty and causing the company a loss). It is the case of the Haeon Partners advisory fees (money paid out as the price of advice). Moon Gaeul glances at the card. 'Dinner at the chairman’s won’t fill you up. Want to take some rice cakes?'",
      "memo": [
        "Hannam-dong invitation: Sunday, July 26, 19:00",
        "Moon Gaeul’s bundle of rice cakes -- thanks for the cleanup",
        "Yoon Sanghyuk’s second prosecutors’ summons"
      ],
      "choices": {
        "c36_start_warm_alone": {
          "label": "Tell no one and go alone on Sunday"
        },
        "c36_start_warm_signature": {
          "label": "Tell the group chat you’ll take Moon Gaeul’s rice cakes to Hannam-dong"
        },
        "c36_start_warm_log": {
          "label": "First put the invitation on record in your witness statement"
        },
        "c36_start_warm_share": {
          "label": "Post the invitation in the six’s group chat and decide together"
        },
        "c36_start_warm_reframe": {
          "label": "Build a timeline of how the group has closed its incidents"
        }
      },
      "place": "KD Capital 1st Floor Lobby",
      "clock": "D-6 to the Hannam-dong dinner · Monday, July 20",
      "question": "The chairman’s invitation sits on a bundle of rice cakes sent as thanks for the cleanup. With whom will you answer it?",
      "lead": "The morning after the tray emptied, the smell of Mangwon Market’s rice cakes reaches the lobby security desk ahead of you."
    },
    "c36_start_record": {
      "title": "Who Read the Amendment First",
      "text": "The night the rain stopped, you compiled the 312 flood emergency loans NOAH declined into one volume, attached an amendment to the disaster loan standards, and filed it with the group compliance team. No answer came. Instead, on the morning of the next day, Monday, July 20, a cream-colored card arrives. 'Sunday, 19:00, Hannam-dong. I read your amendment with interest. Let’s have a meal. Seo Dokyung.' The chairman of KD Financial Group. The same day, Yoon Sanghyuk gets his second summons on charges of breach of trust (betraying a duty and causing the company a loss). It is the case of the Haeon Partners advisory fees (money paid out as the price of advice). Lee Minseo calls from KD Data Lab. 'I saw the amendment’s access log. The compliance team never opened it once, and the chairman’s office opened it four times overnight.'",
      "memo": [
        "Disaster loan standards amendment -- 312 declines",
        "Opened: compliance team 0 times, chairman’s office 4 times",
        "Hannam-dong invitation: Sunday, July 26, 19:00"
      ],
      "choices": {
        "c36_start_record_alone": {
          "label": "Tell no one and go alone on Sunday"
        },
        "c36_start_record_share": {
          "label": "Post the invitation in the six’s group chat and decide together"
        },
        "c36_start_record_log": {
          "label": "First put the invitation on record in your witness statement"
        },
        "c36_start_record_signature": {
          "label": "Ask compliance about the amendment the chairman’s office opened four times"
        },
        "c36_start_record_reframe": {
          "label": "Build a timeline of how the group has closed its incidents"
        }
      },
      "place": "KD Capital Risk Management · Your Desk",
      "clock": "D-6 to the Hannam-dong dinner · Monday, July 20",
      "question": "The chairman’s office read your amendment before the compliance team did. How will you challenge that order?",
      "lead": "The morning after you filed the disaster loan amendment, a thick card came to your desk instead of a reply."
    },
    "c36_start_rush": {
      "title": "Who Went to the Closed Gate First",
      "text": "On the night you left the decline records at the prosecutors’ office duty room, where the rice cake tray had been left too, a text came from Chairman Seo Dokyung’s office. You answered at once and went straight to Hannam-dong. The gate didn’t open. Over the intercom, chief of staff Yeo Minkyu said politely, 'The chairman meets people only on the days he has set.' The next morning, Monday, July 20, a cream-colored card is on your desk. 'Sunday, 19:00, Hannam-dong. Someone who comes early is always welcome. Still, we eat on the day we set. Seo Dokyung.' The same day, Yoon Sanghyuk gets his second summons on charges of breach of trust (betraying a duty and causing the company a loss). It is the case of the Haeon Partners advisory fees (money paid out as the price of advice). Ban Jaewook taps the back of the card. 'This card was written the night you turned away at the gate. Even making you wait was planned.'",
      "memo": [
        "At the Hannam-dong gate -- 1 minute on the intercom; the gate stayed shut",
        "Card written: the night you turned back",
        "Hannam-dong invitation: Sunday, July 26, 19:00"
      ],
      "choices": {
        "c36_start_rush_signature": {
          "label": "Tell your colleagues first that you went to Hannam-dong alone"
        },
        "c36_start_rush_alone": {
          "label": "Tell no one and go alone on Sunday"
        },
        "c36_start_rush_share": {
          "label": "Post the invitation in the six’s group chat and decide together"
        },
        "c36_start_rush_log": {
          "label": "First put the invitation on record in your witness statement"
        },
        "c36_start_rush_reframe": {
          "label": "Build a timeline of how the group has closed its incidents"
        }
      },
      "place": "KD Capital Risk Management · Your Desk",
      "clock": "D-6 to the Hannam-dong dinner · Monday, July 20",
      "question": "The gate you went to first didn’t open, and an invitation written that night arrived. Whom will you tell about that trip first?",
      "lead": "The morning after you turned back at the Hannam-dong gate, the card on your desk knows where you went."
    }
  },
  "echoReplies": {
    "c36_start_share": "When you post it, all six answer at once. Three say don’t go; three say go and see. The decision is still yours.",
    "c36_start_log": "Once it is on record, the invitation becomes one line in the investigation file. Prosecutor Na Eunho replies, 'Do eat something while you’re there.'",
    "c36_start_alone": "Saying nothing, you get six quiet days until Sunday. On Sunday afternoon, Kang Taemin comes by on a rice cake errand, hears where you’re headed, and opens the truck’s passenger door without a word.",
    "c36_garden_flood": "When you press him, the chairman’s shears stop for a moment. Then he states the number of declines more precisely than you do. It is a number he already knew.",
    "c36_garden_record": "When you say so, the chairman laughs. 'Record away. I’ve never said a word that stays on record.' That line is the first thing recorded.",
    "c36_garden_ladder": "When you hold the ladder, the chairman prunes one more branch. 12 years ago, someone else held this same ladder on this same spot.",
    "c36_table_victims": "When you bring up the 1,740, the chairman repeats the number exactly. '1,740 people. That is why one name is needed.'",
    "c36_table_terms": "When you ask for documents, Yeo Minkyu holds out a file already prepared. The powers are broad, the term is 2 years, and the field for dismissal conditions is empty.",
    "c36_table_listen": "When you repeat it, the chef smiles for the first time. You hear the offer to the end, and someone who hears it to the end has half answered.",
    "c36_father_stay": "When you ask, the chairman names three people who stood in that line. 46 years have passed, and not one of those names has faded.",
    "c36_father_sign": "When you demand it, the chairman puts down his peach. 'That is what my father did.' The answer is no, but for the first time the words come out of his own mouth.",
    "c36_father_raise": "When you add the condition, the chairman says at once, 'Very well.' The shaken voice comes back too fast, and that answer is written on no paper.",
    "c36_final_refuse": "When you refuse, the chairman doesn’t get angry. 'The next one will sit down faster than you.' The board meets as planned, and the chair still has no owner.",
    "c36_final_audit": "When you set the condition, the chairman looks at you for a long while. Then he tells Yeo Minkyu to rewrite the appointment. The new appointment doesn’t bear the chairman’s name either.",
    "c36_final_take": "When you accept, round 2 compensation goes into Monday’s announcement as one line. Into the blank in the third paragraph of the same announcement goes your name.",
    "c36_after_warm": "The lights are on at the bookshop’s 1st floor. When you open the door, all six ask at once, 'What happened?' and Kang Taemin unloads the rice cake box from the truck.",
    "c36_after_record": "When you write it up and send it, the same sentences reach the FSS and the prosecutors at the same moment. You couldn’t write down a single dish name, but not one sentence the chairman said is missing.",
    "c36_after_rush": "When you go straight there, yours is the only lit desk in the Yeouido office. While the copier runs, the nameless account opens the folder once more.",
    "c36_phone_choice_1": "When you say it up front, Yeo Minkyu takes back his pen for the first time. A guest without a pledge, the first in 20 years, he writes in his notebook.",
    "c36_phone_choice_2": "The amended pledge is accepted. Yeo Minkyu stamps his own seal over the corrected line, and that seal is not the chairman’s.",
    "c36_phone_choice_3": "Once you sign, the table turns gentle. From that moment, whatever you hear tonight is something you can’t take to investigators.",
    "c36_draft_choice_1": "When you ask, Yeo Minkyu draws a pencil line through the field. Whether that line survives in Monday’s printed copy is for the chairman to decide.",
    "c36_draft_choice_2": "The copied sheet becomes the only record in a room without phones. Handwriting is weak evidence, but the date is exact.",
    "c36_draft_choice_3": "Turned face down, the announcement stays where it was. On Monday morning, that blank is filled with someone’s name.",
    "c36_gate_choice_1": "When you ask for one line each, six lines come. Han Seoyun’s comes last, and it is the shortest. 'I took it. 12 years ago.'",
    "c36_gate_choice_2": "The saved conversation becomes a dated record. Kwon Dohyun’s table goes onto the evidence list too.",
    "c36_gate_choice_3": "The cup noodles have gone cold. Kang Taemin hands you the broth too, saying, 'Of the 10 minutes, these 3 are the best spent.'",
    "c36_phone_reaction_choice_1": "Yoon Seojin gets your reply and sends one line: 'Thank you.' That line stays unread in the basket until dinner ends.",
    "c36_phone_reaction_choice_2": "When you ask, Yoon Seojin answers 'Yes' after a long while. A daughter’s words become part of the record of her father’s case.",
    "c36_phone_reaction_choice_3": "The basket lid closes. Yoon Seojin’s question spends the Hannam-dong night with nothing but a read receipt.",
    "c36_draft_reaction_choice_1": "When you promise, Eun Jaeha drops one word from the eighth plate’s name. The chairman still calls it 'the eighth one.'",
    "c36_draft_reaction_choice_2": "Saying you may record it, Eun Jaeha adds a condition. 'Leave my mom’s name out. She’s embarrassed in front of the neighborhood.'",
    "c36_draft_reaction_choice_3": "The bibimbap is the best thing you eat in this house. The fridges in Eun Jaeha’s mother’s shop are still off next week.",
    "c36_gate_reaction_choice_1": "Hearing it as it was, Yoon Sanghyuk is silent a long while, then says, 'That sentence again, then.' They are the same words he heard 12 years ago.",
    "c36_gate_reaction_choice_2": "When you say you’ll attach it to your statement, Yoon Sanghyuk laughs. 'Right, that’s what you should do.' Then he hangs up first.",
    "c36_gate_reaction_choice_3": "Yoon Sanghyuk stays on the far side of the cut call. Kang Taemin stacks two empty cup noodle containers and puts them in the truck bed.",
    "c36_branch_annex_a": "When you ask, Seok Munho pulls 11 names from memory. Six of them are people the papers said 'stepped down to take responsibility.'",
    "c36_branch_annex_b": "As you match them, every day a frame came down lines up with one of the group’s major incidents. Dates don’t lie.",
    "c36_branch_annex_c": "While you rest, the air conditioning cools your sweat. The 11 nail holes stay on the wall whether you look or not.",
    "c36_branch_annex_follow_a": "When you promise, Seok Munho nods and coils the hose again. The frame you saw today stays only in your memory.",
    "c36_branch_annex_follow_b": "Once it is on the list, one photo proves the date of a promotion. Seok Munho’s name could go into the source field too.",
    "c36_branch_annex_follow_c": "As you walk past pretending not to see, the lit empty spot stays behind you. That light stays on after you leave.",
    "c36_route_system_publish": "Once you release it, comments pile up on the staff board the night before the board meeting. 'Our department’s managing director left the same way.'",
    "c36_route_system_names": "When you go looking, 11 of the 29 answer the phone. Three say, 'I guess I can finally say whose place I left in.'",
    "c36_route_system_drop": "Once you bury it, the terms at the table come out clean. A 30th 'reform complete' is quietly prepared.",
    "c36_final_system_route_a": "With the rule in place, the next decision document carries a name. This announcement, in the end, still doesn’t bear the chairman’s.",
    "c36_final_system_route_b": "This one is closed with one person. A 30th line is added to NOAH’s statistics.",
    "c36_final_system_route_c": "As the testimony gathers, the resigned executives see one another’s names for the first time. Where that testimony will be heard is not yet decided.",
    "c36_evidence_turn_visit": "When you visit, only one of the three opens the door. He says, 'I stamped the confirmation. I never confirmed anything.'",
    "c36_evidence_turn_file": "When you submit them, Han Jiwoo checks the numbers first. 2 weeks, 18 months, three people. She replies, 'It isn’t a rule violation. That makes it a bigger problem.'",
    "c36_evidence_turn_hold": "Held back, the records make a strong hand on the morning of the board meeting. Meanwhile, Monday’s announcement goes off to the printer.",
    "c36_garden_evidence_turn": "Tied together by year, one chair empties three times and is filled three times in the same shape.",
    "c36_table_evidence_turn": "Tied together by year, one chair empties three times and is filled three times in the same shape.",
    "c36_father_evidence_turn": "Tied together by year, one chair empties three times and is filled three times in the same shape.",
    "c36_route_system_evidence_turn": "Tied together by year, one chair empties three times and is filled three times in the same shape.",
    "case36_memory_system": "The draft announcement holds only one name, and none of your moves. NOAH lays out 20 years of incidents closed with one name.",
    "case36_memory_evidence": "Hold the blank approval field against the appointment records, and the same chair emptied three times and was filled three times. On the eve of each filling, there was the same table.",
    "c36_start_warm_share": "When you post it, all six answer at once. Three say don’t go; three say go and see. The decision is still yours.",
    "c36_start_warm_log": "Once it is on record, the invitation becomes one line in the investigation file. Prosecutor Na Eunho replies, 'Do eat something while you’re there.'",
    "c36_start_warm_alone": "Saying nothing, you get six quiet days until Sunday. On Sunday afternoon, Kang Taemin comes by on a rice cake errand, hears where you’re headed, and opens the truck’s passenger door without a word.",
    "c36_start_warm_signature": "Once you tell them, the group chat fills up with talk of rice cakes. Kwon Dohyun asks, 'Is bringing rice cakes to the chairman’s house a gift or a protest?'",
    "c36_start_record_share": "When you post it, all six answer at once. Three say don’t go; three say go and see. The decision is still yours.",
    "c36_start_record_log": "Once it is on record, the invitation becomes one line in the investigation file. Prosecutor Na Eunho replies, 'Do eat something while you’re there.'",
    "c36_start_record_alone": "Saying nothing, you get six quiet days until Sunday. On Sunday afternoon, Kang Taemin comes by on a rice cake errand, hears where you’re headed, and opens the truck’s passenger door without a word.",
    "c36_start_record_signature": "When you ask, the compliance team replies two days later: 'The amendment is scheduled for review.' The chairman’s office is on the cc line of the reply.",
    "c36_start_rush_share": "When you post it, all six answer at once. Three say don’t go; three say go and see. The decision is still yours.",
    "c36_start_rush_log": "Once it is on record, the invitation becomes one line in the investigation file. Prosecutor Na Eunho replies, 'Do eat something while you’re there.'",
    "c36_start_rush_alone": "Saying nothing, you get six quiet days until Sunday. On Sunday afternoon, Kang Taemin comes by on a rice cake errand, hears where you’re headed, and opens the truck’s passenger door without a word.",
    "c36_start_rush_signature": "Once you tell them, Oh Jinwoo asks, 'They didn’t even open the gate, so why did you go first?' Only after hearing your answer does he start looking for someone to drive you on Sunday."
  },
  "choiceVoiceLines": {
    "c36_start_share": "Saying you won’t decide alone, you post the invitation in the six’s group chat and decide together.",
    "c36_start_log": "Because the invitation came on the day Yoon Sanghyuk was summoned again, you first put it on record in your witness statement.",
    "c36_start_alone": "So your colleagues don’t get tangled up at that table too, you tell no one and go alone on Sunday.",
    "c36_garden_flood": "Saying this can’t pass as small talk about a rice cake shop, you hold the ladder and press him first on the flood emergency loan declines.",
    "c36_garden_record": "Even over one meal, what you hear, you hear as a witness, so you say first that you will record today’s talk.",
    "c36_garden_ladder": "Because you need to know first what this man remembers, you hold the ladder in silence and hear the chairman out.",
    "c36_table_victims": "Saying this won’t end with one name, you bring up the 1,740 victims first, not one Yoon Sanghyuk.",
    "c36_table_terms": "Saying you need to know whether the seat only confirms a declaration, you ask to see the compliance officer’s powers and term in writing first.",
    "c36_table_listen": "Deciding not to answer before you’ve heard it all, you repeat the sixth plate’s name and hear the offer to the end.",
    "c36_father_stay": "Wondering what became of the people he bowed to, you hear out his father’s story and ask about the people who stood in that line.",
    "c36_father_sign": "To break the pattern where only the one who signs pays, you demand his signature: this time, decide in the chairman’s own name.",
    "c36_father_raise": "To get the price of one name paid out to your colleagues too, you use the crack in his voice to add their reinstatement to the terms.",
    "c36_final_refuse": "Saying you can’t add your name to closing this with one name, you refuse the seat and see the inquiry through with colleagues and victims.",
    "c36_final_audit": "Saying you won’t leave it a seat that only confirms, you take the seat but make this table your first audit target.",
    "c36_final_take": "Saying you can’t make the 212 wait any longer, you take the seat and get round 2 compensation into Monday’s announcement.",
    "c36_after_warm": "Saying the outcome has to be told face to face, you turn the truck and go first to your colleagues at the bookshop’s 1st floor.",
    "c36_after_record": "Before memory smooths it over, you write down the table’s offer word for word and send it to Han Jiwoo and Na Eunho.",
    "c36_after_rush": "Saying you have to get hold of it before the folder opens again, you head straight to the office and copy the papers meant for cutting off the tail.",
    "c36_phone_choice_1": "Saying you won’t hear it alone and be bound alone, you say up front, instead of signing, that you’ll share what you hear with colleagues.",
    "c36_phone_choice_2": "Because a witness can’t sign a paper that gags her, you strike the investigator clause and write in an exception for crimes.",
    "c36_phone_choice_3": "If it’s a formality everyone has signed, you sign the pledge and hand over your phone.",
    "c36_draft_choice_1": "Saying you can’t confirm what you haven’t even seen, you ask that your name field be struck from the third paragraph.",
    "c36_draft_choice_2": "Before the papers are cleared away, you copy the announcement’s date and sentence by hand.",
    "c36_draft_choice_3": "Saying your hand gets weaker if they know you saw it, you pretend you saw nothing, turn the announcement face down, and go back to your seat.",
    "c36_gate_choice_1": "Saying this isn’t a matter for a head count, you skip the vote and ask each colleague for just one line.",
    "c36_gate_choice_2": "So you can sort out later who said what, you save the whole group chat as a record of the offer.",
    "c36_gate_choice_3": "Deciding not to spend the 10 minutes on 186 messages, you put the phone face down and take a bite of Kang Taemin’s cup noodles first.",
    "c36_phone_reaction_choice_1": "So she isn’t left holding that question alone, you reply 'It isn’t strange' and hand over your phone.",
    "c36_phone_reaction_choice_2": "So you don’t use a daughter’s words without permission, you ask Yoon Seojin if her message may go in your witness file.",
    "c36_phone_reaction_choice_3": "Saying you have nothing to tell her before you sit at that table, you put the phone in the basket without replying.",
    "c36_draft_reaction_choice_1": "Saying this shouldn’t end in 0.6 seconds, you promise to send his mother’s emergency loan back up for human review.",
    "c36_draft_reaction_choice_2": "Because you can’t write down someone’s circumstances without permission, you ask Eun Jaeha if you may record it as a flood decline case.",
    "c36_draft_reaction_choice_3": "Because you need to be in your seat before the chairman comes back, you have one spoonful of bibimbap and return to the table.",
    "c36_gate_reaction_choice_1": "Saying he should at least know how his own name is being used, you tell Yoon Sanghyuk the table’s offer exactly as it was made.",
    "c36_gate_reaction_choice_2": "Saying even being told to take it is a statement you can’t hide, you say you’ll attach the call to your witness statement.",
    "c36_gate_reaction_choice_3": "So you don’t give the last 4 minutes over to his words, you hang up without answering and walk back through the gate.",
    "c36_branch_annex_a": "Saying the people who came down had names too, you ask Seok Munho whom the 11 nail holes belonged to.",
    "c36_branch_annex_b": "To keep a record of who went up and who came down, and when, you match each frame’s date against the group’s incident timeline.",
    "c36_branch_annex_c": "Saying it isn’t your place to study someone else’s walls, you leave the photos and rest in the cool.",
    "c36_branch_annex_follow_a": "So Seok Munho, who has kept the garden forty years, doesn’t get hurt, you promise to bury what you heard today.",
    "c36_branch_annex_follow_b": "Saying it has to be kept before the frame comes down, you put the frame’s date and Yoon Sanghyuk’s promotion record on the evidence list.",
    "c36_branch_annex_follow_c": "Saying you’ll be pushed back at the table if you waver now, you see the empty spot, pretend you didn’t, and head to the table.",
    "c36_route_system_publish": "Saying the numbers get buried if the announcement goes out first, you release them to all staff and the FSS before the board meets.",
    "c36_route_system_names": "Saying you need to hear from the people who left, not just the numbers, you find the 29 who resigned and ask whose place they left in.",
    "c36_route_system_drop": "Deciding to grab what you can get now, you bury the numbers and secure only your terms for leaving the table.",
    "c36_final_system_route_a": "So the 30th isn’t closed with the same form, you require the name of whoever actually decided on every decision document.",
    "c36_final_system_route_b": "Saying you lack the strength to tear up the form itself, you leave the rules and close this one with Yoon Sanghyuk alone.",
    "c36_final_system_route_c": "To show who decided behind the name, you gather the resigned executives’ testimony and expose how decisions are made.",
    "c36_evidence_turn_visit": "Because you first need to hear why they wrote the same conclusion, you visit the three former compliance officers and ask what they confirmed.",
    "c36_evidence_turn_file": "Before the fourth appointment goes up, you formally submit the three appointment records to FSS examiner Han Jiwoo.",
    "c36_evidence_turn_hold": "Saying that bringing them out early gives them time to act, you keep the records and bring them out just before next week’s board.",
    "c36_garden_evidence_turn": "Tying the compliance officer appointment records to the clue by year, you trace what the people who sat in that seat before actually confirmed.",
    "c36_table_evidence_turn": "Tying the compliance officer appointment records to the clue by year, you trace what the people who sat in that seat before actually confirmed.",
    "c36_father_evidence_turn": "Tying the compliance officer appointment records to the clue by year, you trace what the people who sat in that seat before actually confirmed.",
    "c36_route_system_evidence_turn": "Tying the compliance officer appointment records to the clue by year, you trace what the people who sat in that seat before actually confirmed.",
    "c36_start_warm_share": "Saying you won’t decide alone, you post the invitation in the six’s group chat and decide together.",
    "c36_start_warm_log": "Because the invitation came on the day Yoon Sanghyuk was summoned again, you first put it on record in your witness statement.",
    "c36_start_warm_alone": "So your colleagues don’t get tangled up at that table too, you tell no one and go alone on Sunday.",
    "c36_start_warm_signature": "Saying you won’t go empty-handed to a meal that won’t fill you up, you tell the group chat you’ll take Moon Gaeul’s rice cakes to Hannam-dong.",
    "c36_start_record_share": "Saying you won’t decide alone, you post the invitation in the six’s group chat and decide together.",
    "c36_start_record_log": "Because the invitation came on the day Yoon Sanghyuk was summoned again, you first put it on record in your witness statement.",
    "c36_start_record_alone": "So your colleagues don’t get tangled up at that table too, you tell no one and go alone on Sunday.",
    "c36_start_record_signature": "Bothered that the compliance team never opened it once, you ask them about the amendment the chairman’s office opened four times.",
    "c36_start_rush_share": "Saying you won’t decide alone, you post the invitation in the six’s group chat and decide together.",
    "c36_start_rush_log": "Because the invitation came on the day Yoon Sanghyuk was summoned again, you first put it on record in your witness statement.",
    "c36_start_rush_alone": "So your colleagues don’t get tangled up at that table too, you tell no one and go alone on Sunday.",
    "c36_start_rush_signature": "Saying you can’t go again while hiding that you moved alone, you first tell your colleagues you went to the Hannam-dong gate by yourself."
  },
  "pack": {
    "clue": {
      "title": "The Fourth Chair",
      "text": "In the past 12 years, all three compliance officers were appointed within 2 weeks of a major incident after passing through the Hannam-dong table, wrote 'No further investigation needed' in their first reports, and moved to advisory posts at affiliates within 18 months."
    },
    "outcomes": {
      "c36_after_warm": {
        "tag": "Back to Your Colleagues",
        "title": "You turned the truck around and went to the bookshop’s 1st floor",
        "text": "On the way back from Hannam-dong, you told your colleagues about the table before you told the board. Moon Gaeul’s rice cakes were split into six pieces."
      },
      "c36_after_record": {
        "tag": "Kept in Sentences",
        "title": "You wrote down the chairman’s offer without dropping a line and sent it",
        "text": "For the first time, the words of someone who doesn’t sign went on the record at the FSS and the prosecutors’ office. Only the dish names, not one of them, got written down."
      },
      "c36_after_rush": {
        "tag": "Moved at Once",
        "title": "You got out of the truck and went straight to the office copier",
        "text": "With no time to sort out your answer to the table, you gathered first the papers meant for cutting off the tail. Kang Taemin turned the truck around with the rice cake box left on the passenger seat."
      }
    },
    "continuityChallenges": {
      "c35_after_warm": {
        "title": "Taking the people who emptied the tray with you to the table",
        "text": "The market people who stayed until the tray was empty came with the leftover rice cakes. A card that shows you are on the market’s side even at the chairman’s table holds up their trust."
      },
      "c35_after_record": {
        "title": "Getting back the amendment the chairman read first",
        "text": "The chairman’s office read the disaster loan amendment before the compliance team did. First you fix the game around whose hands that amendment belongs in."
      },
      "c35_after_rush": {
        "title": "Owning up to the trip to the gate that didn’t open",
        "text": "The Hannam-dong gate you rushed to straight from the prosecutors’ office didn’t open. A card that tells your colleagues about that trip before you go to the table puts fairness first."
      }
    }
  }
};
