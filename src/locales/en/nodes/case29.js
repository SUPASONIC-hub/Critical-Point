/**
 * 사건 29 (src/nodes/case29.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c29_start": {
      "title": "The Same Plane",
      "text": "The board in Incheon Airport’s departures hall shows check-in open for Singapore. The business at hand: handing over 427 billion won of non-performing loans (bad loans). The buyer is Roundhill Capital, a Singapore private equity fund (a firm pooling a few big investors’ money). The method is a bulk sale (all the bad assets sold as one bundle). At the end of the check-in line, someone clips your foot with a suitcase. It’s Seo Harin, who asked over the phone six days ago, 'You have a passport, right?' 'You remember Haeon Partners. The company that took an advisory fee (money paid out in the name of advice) every quarter. Three days before its liquidation, the last 1.14 billion won went out to Singapore.' She fans herself with her boarding pass. 'The company that got it is a 7-minute walk from this deal’s buyer’s office. If that’s a coincidence, I don’t write the story.'",
      "memo": [
        "Sale: 427 billion won in non-performing loans -- 3,860 debtors",
        "Buyer: Roundhill Capital (Singapore), signing ceremony Thursday 10:00",
        "Travel order: write the risk review opinion, approver Yoon Sanghyuk",
        "Haeon Partners: 1.14 billion won wired abroad three days before liquidation",
        "The deadline: books cleaned up before New York major shareholder Kingsdale’s quarterly review"
      ],
      "choices": {
        "c29_start_board": {
          "label": "Get Seo Harin’s files before boarding; read them in flight"
        },
        "c29_start_debtors": {
          "label": "Pack each bundled debtor’s situation, line by line"
        },
        "c29_start_mandate": {
          "label": "Confirm the travel order’s review scope in writing first"
        },
        "reframe": {
          "label": "Lay out every deal the Group has sold in bundles"
        }
      },
      "place": "Incheon Airport Terminal 2 · Departures",
      "clock": "Tuesday, Fourth Week of May · 07:40",
      "question": "On a trip to hand over a 427-billion-won bundle of loans, Seo Harin boards the same plane. What do you take care of first?",
      "lead": "Two months since you moved to KD Capital’s Risk Management Department, and the bag for your first overseas trip is still light."
    },
    "c29_marina": {
      "title": "More Haste, Less Speed",
      "text": "Roundhill Capital partner Cho Hyunseok has come out himself to meet you at a 57th-floor rooftop bar overlooking Marina Bay. His English name is Ethan; born in New Jersey, he has worked 12 years in Singapore alone. Handing you a lemongrass cocktail, he speaks in careful Korean. 'There’s a Korean proverb: the more you hurry, the more you should take the long way round. So let’s sign fast.' When nobody laughs, he laughs first. Then he turns on a tablet. Sale price 131 billion won, recovery rate (the share actually paid back) 30.7%. 'We’re the people who clean up bad debt. We collect what the bank can’t, and we do it humanely.' The next screen is a collection plan. Beside the first month’s target, in small print: 'Contact intensity: 5 times a week.'",
      "memo": [
        "Sale price 131 billion won -- 30.7% of the 427 billion on the books",
        "Collection plan: first-month contact intensity 5 times a week",
        "Cho Hyunseok (Ethan Cho): Roundhill partner, 12 years in Singapore",
        "36 hours to the signing ceremony"
      ],
      "choices": {
        "c29_marina_play": {
          "label": "Play along with the welcome and read their hand first"
        },
        "c29_marina_basis": {
          "label": "Put the pricing basis on the due diligence list, officially"
        },
        "c29_marina_ask": {
          "label": "Before recovery rates, press on how debtors get contacted"
        },
        "reframe": {
          "label": "Lay out every deal the Group has sold in bundles"
        },
        "c29_marina_evidence_turn": {
          "label": "Read back through the price talks, round by round"
        }
      },
      "place": "Marina Bay, Singapore · 57th-Floor Rooftop",
      "clock": "Tuesday · 22:00",
      "question": "Next to the welcome cocktail, the plan reads 'Contact intensity: 5 times a week.' What do you ask Cho Hyunseok first?",
      "lead": "Four hours after you landed at Changi Airport, a Roundhill car brought you straight to the rooftop."
    },
    "c29_hawker": {
      "title": "Spice Level 5",
      "text": "At a Chinatown hawker center (an open-air court of cheap food stalls), Oh Jinwoo, Bridge Bank’s man on this deal, has arrived first and saved three plastic chairs. He points to the chili crab stall’s 'Spice Level 5.' 'They say no Korean has ever finished that. Tonight, one will.' Seo Harin turns on her camera. At the first claw Oh Jinwoo’s ears go red; at the second he stops talking; at the third, a grandmother at the next table slides him a condensed-milk drink. Wiping his tears, he lowers his voice. 'Bridge is lending Roundhill 90 billion won for the purchase. In the payee field: Northgate Advisory, 1.2 billion won a year. What the money is for is only in Annex C (an add-on to the contract), they say.' Seo Harin’s chopsticks stop. It’s the company that received Haeon’s last money. 'I can photograph it tonight. If I get caught, I’m finished.'",
      "memo": [
        "Bridge Bank → Roundhill: 90 billion won in purchase financing",
        "Payee: Northgate Advisory, 1.2 billion won a year",
        "Northgate = recipient of Haeon’s 1.14 billion won",
        "Oh Jinwoo vs. Level 5 chili crab: quit after three claws"
      ],
      "choices": {
        "c29_hawker_photo": {
          "label": "Ask Oh Jinwoo to photograph the annex tonight"
        },
        "c29_hawker_address": {
          "label": "Go find Northgate’s registered address yourself"
        },
        "c29_hawker_spare": {
          "label": "Spare Oh Jinwoo; get the annex another way"
        },
        "reframe": {
          "label": "Lay out every deal the Group has sold in bundles"
        },
        "c29_hawker_evidence_turn": {
          "label": "Read back through the price talks, round by round"
        }
      },
      "place": "Chinatown Hawker Center, Singapore · Outdoor Alley Table",
      "clock": "Wednesday · 20:00",
      "question": "Teary-eyed, Oh Jinwoo says he can photograph Annex C tonight. What do you do?",
      "lead": "Oh Jinwoo, already there for Bridge Bank, called you to Chinatown, saying dinner was on him."
    },
    "c29_hotel": {
      "title": "New Year’s Greetings",
      "text": "3 a.m. Outside the hotel window, the lights of Marina go out one by one. Seo Harin holds a minibar bag of peanuts she hasn’t opened as she talks. 7 years ago, she wrote a story from documents handed to her by Ha Yoonho, an assistant manager at a savings bank. The story won an award, and Ha Yoonho was fired two months later. One line of print number stamped in a corner of the documents pointed to Ha Yoonho. Now Ha Yoonho drives a delivery truck in Daejeon. Every January 1, a text comes: 'How are you doing, reporter?' Seo Harin has never once replied. 'I didn’t see that number. My story changed one person’s life, and that person sends me New Year’s greetings.' She puts the peanuts down. 'There’ll be something in Baek Daon’s photo too. There always is.'",
      "memo": [
        "Ha Yoonho: source 7 years ago, fired two months after the story",
        "What got Ha Yoonho fired: a print number in the document’s corner",
        "Roundhill staff who can open Annex C: 4",
        "7 hours to the signing ceremony"
      ],
      "choices": {
        "c29_hotel_protect": {
          "label": "Don’t use any photo that could expose Baek Daon"
        },
        "c29_hotel_official": {
          "label": "Officially request the original annex from Roundhill"
        },
        "c29_hotel_publish": {
          "label": "Have Seo Harin publish before the signing"
        },
        "reframe": {
          "label": "Lay out every deal the Group has sold in bundles"
        },
        "c29_hotel_evidence_turn": {
          "label": "Read back through the price talks, round by round"
        }
      },
      "place": "Marina Hotel, Singapore · Guest Room",
      "clock": "Thursday · 03:00",
      "question": "A single story once changed one source’s life. What do you do with Baek Daon’s photo?",
      "lead": "Back in the hotel room, neither of you can sleep. Only the lights of Marina outside thin out."
    },
    "c29_final": {
      "title": "The Name on the Signature Line",
      "text": "From Roundhill Capital’s negotiating room on the 42nd floor of Marina One Tower, you can see the rooftop from the night before last. On the long table lie three contract volumes and two fountain pens; on the wall screen is Yoon Sanghyuk, in Seoul. Cho Hyunseok slides the last document toward you. A KD Capital Risk Management Department opinion, one signature field. Under the line, your name is already printed. 'This is the condition precedent (what must happen before the contract takes effect). With this, we finish today.' Annex C is attached at the very back of the contract. For 3 years after closing, Yoon Sanghyuk to be appointed Asia adviser (a post that only advises, with no duties), 1.2 billion won a year, payee Northgate Advisory. Yoon Sanghyuk speaks from the screen. 'An empty signature field would be a problem. You of all people know that.'",
      "memo": [
        "Risk review opinion -- the deal’s last condition precedent",
        "Annex C: Yoon Sanghyuk as Asia adviser for 3 years, 1.2 billion won a year",
        "Payee: Northgate Advisory -- where Haeon’s money went",
        "46 people in debt restructuring -- no protection clause in the contract"
      ],
      "choices": {
        "c29_final_protect": {
          "label": "Sign only with collection limits and restructuring carried over"
        },
        "c29_final_sign": {
          "label": "Sign, take the annex home, and fight from behind"
        },
        "c29_final_report": {
          "label": "Say no opinion until Annex C goes to the board"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Marina One Tower, 42nd Floor · Roundhill Capital Negotiating Room",
      "clock": "Thursday · 10:00",
      "question": "One signature field with your name printed on it is the deal’s last condition. What do you do?",
      "lead": "Outside the negotiating room you can see the rooftop from the first night. Yoon Sanghyuk is already on the wall screen, from Seoul."
    },
    "c29_aftershock": {
      "title": "Revenge at Level 4",
      "text": "Thursday, 9 p.m., the Chinatown hawker center (an open-air court of cheap food stalls) again. Oh Jinwoo, whose ears went red to the tips on Level 5 chili crab last time, stands before the same stall. This time it’s Level 4. 'Level 5 isn’t for human consumption. This is a strategic retreat.' The grandmother who slid him the condensed-milk drink has ordered two glasses in advance this time. With the crab half gone, Seo Harin looks at her phone and bows her head. Ha Yoonho, the source fired 7 years ago after handing over documents for her story, has answered the text she sent that afternoon, her first in 7 years. 'Reporter, you finally replied. I’ve got two trucks these days.' Seo Harin laughs, then wipes her eyes, and Oh Jinwoo pretends he’s crying from the spice and cries along. Around midnight, in the six-person group chat that has been quiet for nearly a month, 'Lee Minseo is typing' appears and disappears. It’s the third time already.",
      "memo": [
        "Oh Jinwoo’s chili crab rematch: Level 4, finished",
        "Ha Yoonho’s first reply in 7 years: 'I’ve got two trucks these days'",
        "Yoon Sanghyuk’s next post -- what to ask back in Seoul",
        "Group chat 'Lee Minseo is typing' -- third time"
      ],
      "choices": {
        "c29_after_record": {
          "label": "On the flight back, write Annex C up as a clean summary"
        },
        "c29_after_warm": {
          "label": "Stay out Singapore’s last night with Seo Harin and Oh Jinwoo"
        },
        "c29_after_rush": {
          "label": "Take the first flight; roll your suitcase into Yoon’s office"
        }
      },
      "place": "Chinatown Hawker Center, Singapore · Outdoor Alley Table",
      "clock": "Thursday · 21:00",
      "question": "'Typing' appears in the group chat three times and disappears. How do you close Singapore’s last night?"
    },
    "c29_ledger": {
      "title": "46 Yellow Marks",
      "text": "11:40 at night, back at the hotel, KD Capital reviewer Choi Seojin in Seoul sends a file. It’s the list of the 3,860 debtors in the sale bundle. Beside 46 of them are yellow marks. These are people already under debt restructuring (a deal that cuts debt or extends terms for those struggling to pay), paying a little each month. 'Sold as a bundle, these agreements don’t go with them. If the new owner says it’ll collect everything from scratch, there’s no clause to stop it.' Of the 46, 31 have never once been late. Choi Seojin sends one more line. 'The most faithful payers are going to be the first to get the calls.'",
      "memo": [
        "Of 3,860 debtors in the sale, 46 under debt restructuring",
        "Of the 46, 31 with no history of late payment",
        "Sale contract: no clause carrying restructuring agreements over"
      ],
      "choices": {
        "c29_ledger_choice_1": {
          "label": "Demand the 46 in restructuring be taken out of the bundle"
        },
        "c29_ledger_choice_3": {
          "label": "Leave the bundle; look after the 46 after the sale"
        },
        "c29_ledger_choice_2": {
          "label": "Find a clause that keeps the agreements after the sale"
        }
      },
      "place": "Marina Hotel, Singapore · Guest Room",
      "clock": "Tuesday · 23:40",
      "question": "46 people faithfully paying under debt restructuring are being sold with the bundle. What do you do?"
    },
    "c29_annex": {
      "title": "One of Four",
      "text": "You come out to the main road to catch a taxi, and at the stand a young man falls in beside you. Roundhill Capital analyst Baek Daon, 29, went to university in Seoul. He’s the one who flipped through Cho Hyunseok’s tablet on the rooftop. He holds his phone only halfway out. On the screen is the first page of Annex C. 'That collection plan, I made it. Contact intensity 5 times a week, that’s my Excel sheet.' He sends that one page to Seo Harin’s phone and pulls his hand back. 'I can show you the other pages too. But only four people at the company can open this file. And I’m the least powerful of them.'",
      "memo": [
        "Baek Daon: Roundhill analyst, author of the collection plan",
        "People with access to Annex C: 4",
        "What Seo Harin got: one photo of the first page"
      ],
      "choices": {
        "c29_annex_choice_3": {
          "label": "Take it tonight and keep it as photos"
        },
        "c29_annex_choice_2": {
          "label": "Decline; you’ll demand disclosure through formal channels"
        },
        "c29_annex_choice_1": {
          "label": "First find a way to keep Baek Daon’s identity hidden"
        }
      },
      "place": "Singapore · Main-Road Taxi Stand",
      "clock": "Wednesday · 23:00",
      "question": "The analyst who made the collection plan shows you half the annex. How do you get the rest?"
    },
    "c29_call": {
      "title": "Talk of the Weather",
      "text": "6:10 in the morning; in Seoul it’s 7:10. The phone rings. Instead of a greeting, Yoon Sanghyuk talks about the weather. 'Singapore’s hot even in May. I hear your opinion is this deal’s condition precedent (what must come first for the contract to take effect). A good seat. Back then, your signature wasn’t needed anywhere.' Over the line comes the sound of a teacup set down. 'I hear you had dinner with your Bridge friend at a hawker center last night. Not a man who handles spice well, that one.' Before hanging up, he adds, 'I’ll join the 10 o’clock signing by screen too.'",
      "memo": [
        "Yoon Sanghyuk’s call: 06:10 Singapore time",
        "Knows about last night’s hawker center dinner",
        "Signing at 10, Yoon Sanghyuk joining by video"
      ],
      "choices": {
        "c29_call_choice_1": {
          "label": "Raise the 46’s restructuring before the opinion"
        },
        "c29_call_choice_2": {
          "label": "Tell him plainly you are recording this call"
        },
        "c29_call_choice_3": {
          "label": "Hang up without answering; prepare for the signing"
        }
      },
      "place": "Marina Hotel, Singapore · Guest Room",
      "clock": "Thursday · 06:10",
      "question": "Yoon Sanghyuk opens with the weather and closes the call with the signing time. What do you say?"
    },
    "c29_ledger_reaction": {
      "title": "Free Mango",
      "text": "The next morning in the hotel breakfast room, Cho Hyunseok sits down with a plate of mango. When you bring up the 46, he puts his fork down. 'Take them out and the price drops 3.8 billion won. Because they’re the ones who pay best.' He looks genuinely troubled. 'I’m not a bad guy. My mom ran a dry cleaner in Queens and went into debt too. But I can’t sell my mom’s story to the fund’s investors, right?' He moves a slice of mango onto your plate. 'This is good. This one’s free.'",
      "memo": [
        "Take out the 46 and the price drops 3.8 billion won",
        "Cho Hyunseok’s mother: a dry cleaner in Queens"
      ],
      "choices": {
        "c29_ledger_reaction_choice_1": {
          "label": "Hold firm: the 46 come out, even at a lower price"
        },
        "c29_ledger_reaction_choice_3": {
          "label": "Take the mango; just hear the price talk today"
        },
        "c29_ledger_reaction_choice_2": {
          "label": "Get the formula behind the 3.8 billion, officially"
        }
      },
      "place": "Marina Hotel, Singapore · Breakfast Room",
      "clock": "Wednesday · 07:30",
      "question": "Cho Hyunseok says taking out the 46 lowers the price by 3.8 billion won. Over that plate of mango, how do you answer?"
    },
    "c29_annex_reaction": {
      "title": "Taxi Back Seat",
      "text": "In the back seat of the taxi to the hotel, Seo Harin only looks out the window. The lights of Marina slide across the glass. 'If only four people at the company can open it, he’s one of four. One of four is the same as having a name.' She opens the photo album on her phone, then closes it. 'Sources always say they’re the least powerful. It’s scary because they’re right.' The driver turns the radio down. Seo Harin adds, 'I’ll tell you a story of mine tonight. Will you listen?'",
      "memo": [
        "One of four is the same as having a name",
        "A story Seo Harin will tell"
      ],
      "choices": {
        "c29_annex_reaction_choice_2": {
          "label": "First check how to scrub traces left in source files"
        },
        "c29_annex_reaction_choice_1": {
          "label": "Suggest hearing Seo Harin’s story before deciding"
        },
        "c29_annex_reaction_choice_3": {
          "label": "Say one of four or not, evidence comes first now"
        }
      },
      "place": "Singapore · Back Seat of a Taxi to the Hotel",
      "clock": "Wednesday · 23:30",
      "question": "Seo Harin says one of four is the same as having a name. Facing those words, what do you do first?"
    },
    "c29_call_reaction": {
      "title": "Six Pieces of Rolled Omelet",
      "text": "As soon as you hang up, a private message arrives. It’s Han Seoyun, on standby assignment (waiting for a next post with no duties). A photo of a lunch box, six neat pieces of rolled omelet inside. 'With nothing to do, my cooking’s improved. I packed six pieces and found there’s only me to eat them.' The group chat has been quiet for nearly a month. Everyone is holding out at their own post, so no one speaks first. Han Seoyun sends one more line. 'You got a call from CEO Yoon, didn’t you. When that man talks about time before he hangs up, he’s already decided. When you fight, eat first, then fight.'",
      "memo": [
        "Han Seoyun’s lunch box -- six pieces of rolled omelet, one person to eat them",
        "When he talks about time, he’s already decided"
      ],
      "choices": {
        "c29_call_reaction_choice_3": {
          "label": "Just say not to worry and turn your phone face down"
        },
        "c29_call_reaction_choice_2": {
          "label": "Ask Han Seoyun to keep the notes you wrote overnight"
        },
        "c29_call_reaction_choice_1": {
          "label": "Tell Han Seoyun everything just as it is"
        }
      },
      "place": "Marina Hotel, Singapore · Elevator",
      "clock": "Thursday · 06:30",
      "question": "Han Seoyun, on standby assignment, sends a lunch box photo and one line of warning. What do you reply?"
    },
    "c29_branch_mailbox": {
      "title": "Mailbox No. 214",
      "text": "9 p.m., a shared office building in Raffles Place. The registered address is the 21st floor, but on the wall behind the lobby, 318 mailboxes are packed tight. Northgate Advisory is No. 214: no office, just a mailbox. A shell company (one that exists only on paper, with no real office or staff). The night manager, Wei Lin, talks in a mix of English and Cantonese. Mail for No. 214 is forwarded to Seoul once a month, envelopes and all, to a gallery in Cheongdam-dong. Seo Harin writes 'Gallery On' in her notebook and underlines it twice. Wei Lin adds, 'This afternoon a call came from Seoul. They asked to be told if anyone came looking for No. 214.'",
      "memo": [
        "Northgate Advisory: Mailbox No. 214, no office",
        "Mail forwarded to: Gallery On, Cheongdam-dong, Seoul",
        "318 mailboxes on the same wall",
        "An inquiry call from Seoul this afternoon"
      ],
      "choices": {
        "c29_branch_mailbox_a": {
          "label": "Tell Wei Lin the situation and ask for the mailing log"
        },
        "c29_branch_mailbox_c": {
          "label": "Photograph the box number and forwarding address; leave"
        },
        "c29_branch_mailbox_b": {
          "label": "Get a Singapore company registry extract and cross-check"
        }
      },
      "place": "Raffles Place, Singapore · Shared Office Lobby",
      "clock": "Wednesday · 21:00",
      "question": "Northgate wasn’t an office but a single mailbox. What do you do in front of this wall?"
    },
    "c29_branch_mailbox_follow": {
      "title": "20 Centimeters Wide",
      "text": "10:30 at night. Sitting on the steps in front of the building, you open the Singapore company registry extract on your phone. The 'name on the KD Capital side' Seo Harin mentioned on the phone is here. Northgate’s sole director is Yoon Sanghyuk’s brother-in-law, and his career field reads 'Non-executive adviser, KD Capital.' It was incorporated eleven days before Haeon Partners filed for liquidation. They built the house to move into before closing the door. Seo Harin stares at the screen a long while, then laughs. 'All that chasing, and in the end it’s one mailbox. 20 centimeters wide, 12 centimeters high.' Just then a text comes from Wei Lin. 'Seoul called again. What should I tell them?'",
      "memo": [
        "Northgate’s sole director: Yoon Sanghyuk’s brother-in-law",
        "Incorporated: 11 days before Haeon filed for liquidation",
        "Registry extract fee: 5.5 Singapore dollars",
        "Second inquiry call from Seoul"
      ],
      "choices": {
        "c29_branch_mailbox_follow_c": {
          "label": "Leave a trail on purpose to see who’s calling from Seoul"
        },
        "c29_branch_mailbox_follow_a": {
          "label": "Spare Wei Lin: say plainly that we were here"
        },
        "c29_branch_mailbox_follow_b": {
          "label": "Bundle the registry and Haeon’s wires for Internal Audit"
        }
      },
      "place": "Raffles Place, Singapore · Steps Outside the Shared Office",
      "clock": "Wednesday · 22:30",
      "question": "Seoul has called a second time, and Wei Lin asks what to say. What do you have Wei Lin tell them?"
    },
    "c29_route_system": {
      "title": "Discount Rates and Next Posts",
      "text": "Leaving the signature field blank, you ask for every deal the Group has ever sold in bundles to be laid out. At the laptop by the gate, NOAH answers: KD Capital’s review engine (an AI that judges loan applications automatically), which calculated this sale price. The 23 bulk sales (bad assets sold as one bundle) KD Financial Group made over the past 10 years open up. In 19, collection contacts to debtors quadrupled within 1 year of the sale. In 14, an executive from the selling side took an advisory seat with the buyer within 1 year. 'The discount rate and the executive’s next post have been trained to move in the same direction. No one has ever written the two numbers in one document.'",
      "memo": [
        "Of 23 Group bulk sales, 19 with collection contacts up 4x after the sale",
        "Seller-side executive moved to a buyer-side advisory seat: 14",
        "Internal documents listing both numbers together: 0"
      ],
      "choices": {
        "c29_route_system_drop": {
          "label": "Bury the stats and board the plane on schedule"
        },
        "c29_route_system_watch": {
          "label": "Require public reports on contact methods for 1 year after"
        },
        "c29_route_system_publish": {
          "label": "Put both numbers on one page for the board and debtors"
        },
        "c29_route_system_evidence_turn": {
          "label": "Read back through the price talks, round by round"
        }
      },
      "place": "Incheon Airport Terminal 2 · Boarding Gate",
      "clock": "Tuesday · 09:50",
      "question": "The stats show discount rates and executives’ next posts moving together. What do you do with these numbers?"
    },
    "c29_final_system_route": {
      "title": "Two Numbers in One Document",
      "text": "Thursday, 9:40 a.m. On the negotiating room table lie three contract volumes and two fountain pens. 20 minutes to the signing. On the laptop screen is a table NOAH made. Left column: the price cut. Right column: the post the selling-side executive moved to. NOAH writes beneath it. 'No one has written the two numbers in one document until now. This table is the first. I have filled in the author field with your name.'",
      "memo": [
        "Deals where collection contacts rose 4x after the sale: 19",
        "Deals where a seller-side executive took a buyer-side advisory seat: 14",
        "Signing: today at 10:00"
      ],
      "choices": {
        "c29_final_system_route_c": {
          "label": "Open a help desk for the sold debtors with sale proceeds"
        },
        "c29_final_system_route_b": {
          "label": "Leave the clauses; just get a higher sale price"
        },
        "c29_final_system_route_a": {
          "label": "Add a clause barring seller executives from joining the buyer"
        }
      },
      "place": "Marina One Tower, 42nd Floor · Roundhill Capital Negotiating Room",
      "clock": "Thursday · 09:40",
      "question": "Your name is on the table that puts both numbers on one page, as author. Before the signing, where do you put this table?"
    },
    "c29_evidence_turn": {
      "title": "Where the 3.6 Billion Went",
      "text": "Lay the clues out in negotiating-round order and one number falls into place. In the final round, the sale price was cut from 134.6 billion won to 131 billion won: 3.6 billion won. Annex C (an add-on to the contract) pays Yoon Sanghyuk 1.2 billion won a year for 3 years, 3.6 billion won in all, the price of seating him as the buyer’s adviser (a post that only advises, with no duties). The payee is the mailbox company that took Haeon’s 1.14 billion won. Ban Jaewook, joining by video from a business trip in Mokpo, puts that company’s account history on screen. In April, 260 million won went out of it to the Mangwon Market victims’ group account. Account holder: Moon Gaeul. Memo: the two words 'Haeon refund.' Ban Jaewook closes his notebook. 'For three months I sent the Singapore bank refund requests, eleven of them. I put the victims’ group down as the recipient. I didn’t think it would work, so I told no one.'",
      "memo": [
        "Price cut in the final round: 3.6 billion won",
        "Annex C advisory fees in total: 3.6 billion won",
        "Payee = recipient of Haeon’s 1.14 billion won",
        "April, mailbox company → Mangwon Market victims’ group: 260 million won"
      ],
      "choices": {
        "c29_evidence_turn_hold": {
          "label": "Hold the numbers; reveal them first at the signing table"
        },
        "c29_evidence_turn_file": {
          "label": "File the 3.6 billion math and wire trail with board and regulators"
        },
        "c29_evidence_turn_share": {
          "label": "Tell the bundled debtors this math first"
        }
      },
      "place": "Marina Hotel, Singapore · Desk in the Guest Room",
      "clock": "Thursday · 08:00",
      "question": "The 3.6 billion won cut from the price and the annex’s 3 years of fees are the same number. How do you use this math?"
    },
    "c29_start_warm": {
      "title": "Departures for One Who Listened to the End",
      "text": "Until the lights went out on the 7th floor of KD Life’s call center in Guro, you shared rice cakes with Do Yoonha and the counselors. The 12 on Yeon Hajin’s team took off their headsets at the same time for the first time. Six days later, in the morning, at Incheon Airport departures, you get a text from that same Do Yoonha. 'I hear you’re going to Singapore. Our branch’s customers are in that bundle of loans being sold. I still remember their voices.' The travel order in CEO Yoon Sanghyuk’s name says 'write the risk review opinion' for a deal handing KD Capital’s 427 billion won of bad loans to Singapore’s Roundhill Capital as a single bundle. The signing is Thursday. Behind you in the check-in line, Seo Harin fans herself with her boarding pass. 'Haeon Partners’ last 1.14 billion won went out to Singapore. The company that got it is a 7-minute walk from this deal’s buyer’s office.'",
      "memo": [
        "3,860 debtors in the bundle -- Gangseo Branch customers included",
        "Travel order: write the risk review opinion, signing Thursday",
        "Seo Harin: on the same plane, chasing Haeon’s last 1.14 billion won"
      ],
      "choices": {
        "c29_start_warm_signature": {
          "label": "Find the customers Do Yoonha remembers in the sale list"
        },
        "c29_start_warm_debtors": {
          "label": "Pack each bundled debtor’s situation, line by line"
        },
        "c29_start_warm_mandate": {
          "label": "Confirm the travel order’s review scope in writing first"
        },
        "c29_start_warm_board": {
          "label": "Get Seo Harin’s files before boarding; read them in flight"
        },
        "c29_start_warm_reframe": {
          "label": "Lay out every deal the Group has sold in bundles"
        }
      },
      "place": "Incheon Airport Terminal 2 · Departures",
      "clock": "Tuesday, Fourth Week of May · 07:40",
      "question": "The customers Do Yoonha remembers are in the bundle being sold. Carrying those names, where do you go first?",
      "lead": "After the call center lights went out, Do Yoonha went back to his window at the Gangseo Branch, and you came to departures."
    },
    "c29_start_record": {
      "title": "Departures on the Day the Answer Was Put Off",
      "text": "You submitted a revision request to KD Life, attaching the list of 1,318 people denied insurance payouts under Article 19. The request was received, and the reply deadline came back stamped 'after closing of the related sale.' You look up which sale: this Thursday, the signing day for handing KD Capital’s 427 billion won of bad loans to Singapore’s Roundhill Capital. A travel order has come to you to write that deal’s risk review opinion. The bundle includes the loans of 42 of those 1,318 people. From a business trip in Mokpo, Ban Jaewook says over the phone, 'The day they put the answer off to is the signing day. It means no one answers before then.' Seo Harin is already at departures. She is boarding the same plane, chasing the path Haeon Partners’ last 1.14 billion won took to Singapore.",
      "memo": [
        "Revision request reply deadline: 'after closing of the related sale'",
        "Sale signing: this Thursday, Singapore",
        "Bundle includes the loans of 42 people denied insurance payouts"
      ],
      "choices": {
        "c29_start_record_debtors": {
          "label": "Pack each bundled debtor’s situation, line by line"
        },
        "c29_start_record_mandate": {
          "label": "Confirm the travel order’s review scope in writing first"
        },
        "c29_start_record_signature": {
          "label": "Put on record that the reply deadline is signing day"
        },
        "c29_start_record_board": {
          "label": "Get Seo Harin’s files before boarding; read them in flight"
        },
        "c29_start_record_reframe": {
          "label": "Lay out every deal the Group has sold in bundles"
        }
      },
      "place": "Incheon Airport Terminal 2 · Departures",
      "clock": "Tuesday, Fourth Week of May · 07:40",
      "question": "The date the revision request’s answer was put off to is the sale’s signing date. How do you handle this coincidence?",
      "lead": "You came to departures with the revision request’s receipt tucked inside your passport."
    },
    "c29_start_rush": {
      "title": "Departures for One Who Left First",
      "text": "The evening you returned your headset, the moment Seo Harin called, you booked the Singapore trip first. 'Haeon Partners’ last 1.14 billion won went out to Singapore. You have a passport, right?' Six days later, in the morning, a pack of call center rice cakes you’d frozen is back in your bag, and the travel order reached you on the airport limousine bus. As it happens, the destination is the same. A deal handing KD Capital’s 427 billion won of bad loans to Singapore’s Roundhill Capital: writing the risk review opinion before Thursday’s signing is your job. Seo Harin sits on a departures bench, perched on her suitcase. 'We came too early. The plane isn’t even here yet.'",
      "memo": [
        "Travel order received: on the airport limousine -- a pack of rice cakes along",
        "Seo Harin: has traced where Haeon’s last money went",
        "2 hours 40 minutes to boarding"
      ],
      "choices": {
        "c29_start_rush_mandate": {
          "label": "Confirm the travel order’s review scope in writing first"
        },
        "c29_start_rush_debtors": {
          "label": "Pack each bundled debtor’s situation, line by line"
        },
        "c29_start_rush_signature": {
          "label": "Tell colleagues why you rushed off, and that Seo Harin is along"
        },
        "c29_start_rush_board": {
          "label": "Get Seo Harin’s files before boarding; read them in flight"
        },
        "c29_start_rush_reframe": {
          "label": "Lay out every deal the Group has sold in bundles"
        }
      },
      "place": "Incheon Airport Terminal 2 · Departures",
      "clock": "Tuesday, Fourth Week of May · 07:40",
      "question": "One call from Seo Harin and you packed and came to the airport early. How do you use the two hours left?",
      "lead": "Six days since you left the call center; the travel order reached you on the airport limousine."
    }
  },
  "echoReplies": {
    "c29_start_debtors": "Packing it makes your bag heavier. Getting approval to carry the 3,860-line list out on a company laptop keeps you on the phone with Security until just before boarding.",
    "c29_start_mandate": "You check the scope: 'price adequacy' is there, 'debtor protection' is not. Whether the missing field means you should fill it or you shouldn’t, you can’t tell.",
    "c29_start_board": "Reading in flight, you see how it all runs before landing. The passenger in the next seat steals a look at the word 'Haeon' three times.",
    "c29_marina_ask": "When you ask, Cho Hyunseok stops laughing. '5 a week is the industry average.' He knows too that the word average is not an answer.",
    "c29_marina_basis": "The supporting materials go on the list. With them comes word that the data room opens one hour before the signing.",
    "c29_marina_play": "As you play along, Cho Hyunseok orders a third round. Then he lets slip that there is one more annex. Words let slip are not recorded.",
    "c29_hawker_spare": "The other way is long and slow. Oh Jinwoo says, 'One more fight I’ve never won,' and clears away the crab shells.",
    "c29_hawker_address": "You find the address: a 14-minute walk from the hawker center. Counting steps, Seo Harin grumbles, 'It’s 7 minutes from Roundhill, but twice that from here.'",
    "c29_hawker_photo": "When you ask, Oh Jinwoo nods. The sound of his phone unlocking is the loudest sound tonight.",
    "c29_hotel_protect": "Once you decide not to use it, Seo Harin deletes the photo. Then she starts writing a text to Ha Yoonho, her first in 7 years.",
    "c29_hotel_official": "The official request goes to Cho Hyunseok’s inbox. The reply is one line: 'We’ll show you at the signing ceremony.'",
    "c29_hotel_publish": "The story runs two hours before the signing. Roundhill’s in-house security first pulls the records of the four people who opened the file.",
    "c29_final_protect": "When you demand the clauses, Cho Hyunseok takes out a calculator. The price drops 3.8 billion won again, and Yoon Sanghyuk’s screen goes dark for a moment, then comes back.",
    "c29_final_report": "When you say no opinion before the report, the signing stops. Cho Hyunseok swears in English for the first time, then apologizes in Korean.",
    "c29_final_sign": "You sign, and the deal closes. The contract in your bag is heavy, and the 46’s first collection calls go out in the first week of next month.",
    "c29_after_warm": "The three plastic chairs stay full until the hawker center lights go out one by one. Oh Jinwoo declares, 'I am retiring from spice,' and the grandmother applauds.",
    "c29_after_record": "Even after the cabin lights go off, your laptop glows. The summary runs 18 pages, and the one line naming Yoon Sanghyuk’s new post is highlighted three times.",
    "c29_after_rush": "The rattle of suitcase wheels carries all the way to the corridor outside KD Capital’s CEO office. The secretary says 'external schedule,' and from behind the closed door comes laughter.",
    "c29_ledger_choice_1": "The demand to take them out shakes the price tag at once. At breakfast, Cho Hyunseok will tell you that price exactly.",
    "c29_ledger_choice_2": "Hunting for the clause, you turn through 212 pages of the contract body until dawn. All you find are four words: 'at the assignee’s discretion.'",
    "c29_ledger_choice_3": "A promise to look after them separately is for after the sale. And the first call after the sale is made by the new owner.",
    "c29_annex_choice_1": "While you look for a way, three taxis go by. For the first time, Baek Daon sees someone worried about his name.",
    "c29_annex_choice_2": "When you decline, Baek Daon nods and turns away. What’s left is one photo of the first page, and the answer through formal channels will come only after the signing.",
    "c29_annex_choice_3": "The photos remain. So does the fact that only four people can open the file.",
    "c29_call_choice_1": "When you bring up the 46, Yoon Sanghyuk is quiet a moment. 'You always count heads instead of numbers.'",
    "c29_call_choice_2": "At the word recording, Yoon Sanghyuk laughs. 'A good habit. I never had it, and that’s how I got this far.' That sentence goes on the record too.",
    "c29_call_choice_3": "You hang up and the room goes quiet. What Yoon Sanghyuk has already decided only shows at 10.",
    "c29_ledger_reaction_choice_1": "When you hold firm, Cho Hyunseok takes away the mango plate. 'Then who pays the 3.8 billion?' The answer is put off until the signing.",
    "c29_ledger_reaction_choice_2": "The formula arrives by email. At the bottom of the table, the line 'Excluded from discount: debtors in restructuring' is the line you were looking for.",
    "c29_ledger_reaction_choice_3": "The mango really is delicious. The 46 yellow marks stay in the file as they are.",
    "c29_annex_reaction_choice_1": "When you say you’ll listen, Seo Harin lowers the taxi window a little. Hot night air comes in. She says nothing until you reach the hotel.",
    "c29_annex_reaction_choice_2": "Checking the procedure, you find 11 lines of hidden data in one photo. One of them is the model of Baek Daon’s phone.",
    "c29_annex_reaction_choice_3": "At the words evidence first, Seo Harin turns her head away. 'I said that too, 7 years ago.'",
    "c29_call_reaction_choice_1": "After you tell her, there’s no reply for a long while, then one line. 'I was under that man a long time. Before 10, read one more clause.'",
    "c29_call_reaction_choice_2": "The notes stay on the phone of someone on standby assignment. The phone the company looks at least.",
    "c29_call_reaction_choice_3": "The face-down phone buzzes three more times before the signing. Han Seoyun’s last message stays unread.",
    "c29_branch_mailbox_a": "When you tell Wei Lin everything, the mailing log is handed over. Wei Lin’s signature is in that log too.",
    "c29_branch_mailbox_b": "Anyone can get a registry extract. Documents anyone can get last the longest.",
    "c29_branch_mailbox_c": "Two photos: Mailbox No. 214 and the mailing label. Watching you leave, Wei Lin wonders whether to call Seoul.",
    "c29_branch_mailbox_follow_a": "When you say to tell it as it is, Wei Lin’s burden lightens. Seoul now knows who came.",
    "c29_branch_mailbox_follow_b": "The material sent to Internal Audit reaches Ban Jaewook first, on a business trip in Mokpo. He replies at two in the morning from a motel desk.",
    "c29_branch_mailbox_follow_c": "Leave a trail and Seoul moves first. The side that moves lets a name slip. Wei Lin stands in between.",
    "c29_route_system_publish": "Two numbers on one page need no explanation. The board secretariat receives the page and reorders the meeting agenda.",
    "c29_route_system_watch": "With the condition, Roundhill must file reports for 1 year. Cho Hyunseok accepts it, saying, 'More paperwork, more people.'",
    "c29_route_system_drop": "Bury them, and the plane leaves on time. NOAH’s stats vanish behind the screensaver on the gate laptop.",
    "c29_final_system_route_a": "With the clause in, Yoon Sanghyuk’s new post is erased from the contract. Not the person but the field disappears first.",
    "c29_final_system_route_b": "The price goes up and the annex stays. Whose share the increase is, next quarter’s books will tell.",
    "c29_final_system_route_c": "The help desk opens with 300 million won set aside from the sale proceeds. Of 312 calls in the first month, seven in ten ask, 'Who am I supposed to pay?'",
    "c29_evidence_turn_file": "Filed together, the 3.6 billion won is stamped on two institutions’ documents at once. The signing is pushed back two days for 'further review.'",
    "c29_evidence_turn_hold": "Brought out for the first time at the table, it freezes the negotiating room. In a frozen room, no one listens to talk of debtors.",
    "c29_evidence_turn_share": "Once you tell them, the first question goes up in the debtors’ group chat. 'So our debt becomes that man’s paycheck?'",
    "c29_marina_evidence_turn": "Following the amount that was cut, you spot money that came back out of the same mailbox the other way.",
    "c29_hawker_evidence_turn": "Following the amount that was cut, you spot money that came back out of the same mailbox the other way.",
    "c29_hotel_evidence_turn": "Following the amount that was cut, you spot money that came back out of the same mailbox the other way.",
    "c29_route_system_evidence_turn": "Following the amount that was cut, you spot money that came back out of the same mailbox the other way.",
    "case29_memory_system": "It isn’t in the contract body. Instead of the body, NOAH opens past deals: how many contacts went to debtors after bundled sales, and the posts the selling-side executives moved to.",
    "case29_memory_evidence": "Set what the saved insurance payouts were used for against the sale’s negotiating history, and one number cut at the end remains. It is the same number someone is set to receive.",
    "c29_start_warm_debtors": "Packing it makes your bag heavier. Getting approval to carry the 3,860-line list out on a company laptop keeps you on the phone with Security until just before boarding.",
    "c29_start_warm_mandate": "You check the scope: 'price adequacy' is there, 'debtor protection' is not. Whether the missing field means you should fill it or you shouldn’t, you can’t tell.",
    "c29_start_warm_board": "Reading in flight, you see how it all runs before landing. The passenger in the next seat steals a look at the word 'Haeon' three times.",
    "c29_start_warm_signature": "You search, and 17 names come up. Do Yoonha replies that he remembers even the voices of four of them.",
    "c29_start_record_debtors": "Packing it makes your bag heavier. Getting approval to carry the 3,860-line list out on a company laptop keeps you on the phone with Security until just before boarding.",
    "c29_start_record_mandate": "You check the scope: 'price adequacy' is there, 'debtor protection' is not. Whether the missing field means you should fill it or you shouldn’t, you can’t tell.",
    "c29_start_record_board": "Reading in flight, you see how it all runs before landing. The passenger in the next seat steals a look at the word 'Haeon' three times.",
    "c29_start_record_signature": "The record stands. KD Life doesn’t fix the deadline; instead it adds the three words 'for internal reasons' and sends it again in the names of the 1,318.",
    "c29_start_rush_debtors": "Packing it makes your bag heavier. Getting approval to carry the 3,860-line list out on a company laptop keeps you on the phone with Security until just before boarding.",
    "c29_start_rush_mandate": "You check the scope: 'price adequacy' is there, 'debtor protection' is not. Whether the missing field means you should fill it or you shouldn’t, you can’t tell.",
    "c29_start_rush_board": "Reading in flight, you see how it all runs before landing. The passenger in the next seat steals a look at the word 'Haeon' three times.",
    "c29_start_rush_signature": "Of the colleagues quiet for nearly a month, only Ban Jaewook replies. 'If you’re on the same plane as a reporter, write down the seat numbers too.'"
  },
  "choiceVoiceLines": {
    "c29_start_debtors": "Saying you have to see the people behind the 427 billion won first, you pack each bundled debtor’s situation separately, line by line.",
    "c29_start_mandate": "Saying you need to know how far this trip lets you look, you confirm the travel order’s review scope in writing first.",
    "c29_start_board": "Saying there’ll be no time to read once you land, you get Seo Harin’s files before boarding and read them in flight.",
    "c29_marina_ask": "Saying it’s people on the receiving end of '5 times a week,' you press on how debtors get contacted before the recovery rate.",
    "c29_marina_basis": "Saying where 30.7% came from has to stay on record, you officially put the pricing basis on the due diligence list.",
    "c29_marina_play": "Not yet knowing what the side in a hurry is hiding, you play along with the welcome and read their hand first.",
    "c29_hawker_spare": "So that Oh Jinwoo, who says getting caught would finish him, doesn’t get hurt, you suggest getting the annex another way.",
    "c29_hawker_address": "Saying there’s somewhere you can go on your own feet before borrowing anyone’s hands, you go find Northgate’s registered address yourself.",
    "c29_hawker_photo": "Saying it’s the only way to see Annex C for now, you ask Oh Jinwoo to photograph the annex tonight.",
    "c29_hotel_protect": "Saying you can’t make another Ha Yoonho, you decide not to use any photo that could expose Baek Daon.",
    "c29_hotel_official": "Saying you need evidence that stands without a source, you officially request the original annex from Roundhill to confirm it.",
    "c29_hotel_publish": "Saying nothing can be undone once the signing is over, you have Seo Harin publish her story before the signing.",
    "c29_final_protect": "Saying that even if they’re sold, the repayment agreements must go with them, you say you’ll sign only with collection limits and restructuring carry-over clauses.",
    "c29_final_report": "Saying your signature can’t be the condition for a 1.2-billion-won-a-year post, you say you can’t submit the opinion until Annex C is reported to the board.",
    "c29_final_sign": "Saying an empty signature field only gets you pushed out of here, you sign the opinion, carry the contract with its annex home, and fight from behind.",
    "c29_after_warm": "Unable to let her read her first reply in 7 years alone, you spend Singapore’s last night to the end with Seo Harin and Oh Jinwoo.",
    "c29_after_record": "Before what you saw blurs, you write Annex C up as a clean summary on the flight back.",
    "c29_after_rush": "Saying you have to ask the man named in the annex directly, you take the first flight back and roll your suitcase straight into Yoon Sanghyuk’s CEO office.",
    "c29_ledger_choice_1": "Unable to let the most faithful payers be the first to get the calls, you demand that the 46 in restructuring be taken out of the sale bundle.",
    "c29_ledger_choice_2": "Saying you have to see for yourself whether there’s really no clause to stop it, you search the contract for a clause that keeps the agreements alive after the sale.",
    "c29_ledger_choice_3": "Since it’s hard to shake the bundle with the signing ahead, you leave the bundle as it is and look after the 46 separately after the sale.",
    "c29_annex_choice_1": "Because he’s the least powerful of only four with access, you first look together for a way to keep Baek Daon’s identity hidden.",
    "c29_annex_choice_2": "Saying that taking a file only four can open would expose him, you decline, saying you’ll demand disclosure of the annex through formal channels.",
    "c29_annex_choice_3": "Saying minds can change by tomorrow, you take it tonight and keep it as photos.",
    "c29_call_choice_1": "Saying you should start with what the CEO least wants to hear, you raise the 46’s restructuring agreements before the opinion.",
    "c29_call_choice_2": "Saying you’ll answer being watched with a record, you tell him plainly that you’re recording this call.",
    "c29_call_choice_3": "Saying there’s no reason to show your hand here, you hang up without answering and start preparing for the signing.",
    "c29_ledger_reaction_choice_1": "Saying the best payers can’t become the price, you hold firm that the 46 must come out even if the price drops.",
    "c29_ledger_reaction_choice_2": "Saying you can’t argue with a number heard over breakfast, you officially get the formula for how the 3.8 billion was reached.",
    "c29_ledger_reaction_choice_3": "Deciding to watch that troubled face a little longer, you take the mango and just hear the price talk today.",
    "c29_annex_reaction_choice_1": "Feeling you can’t decide without hearing her story, you suggest listening to Seo Harin first and deciding after.",
    "c29_annex_reaction_choice_2": "So that one of four doesn’t become a name, you first check the procedure for scrubbing traces left in source files.",
    "c29_annex_reaction_choice_3": "Saying far more people are in the bundle, you say that one of four or not, evidence comes first now.",
    "c29_call_reaction_choice_1": "Saying it’s time you both stopped holding out alone, you tell Han Seoyun everything just as it is.",
    "c29_call_reaction_choice_2": "Saying that in your hands alone it could vanish all at once, you send Han Seoyun the notes you wrote overnight and ask her to keep them separately.",
    "c29_call_reaction_choice_3": "Unable to drag in someone on standby assignment, you just say not to worry and turn your phone face down.",
    "c29_branch_mailbox_a": "Saying there’s no fooling someone who already took Seoul’s call, you tell Wei Lin the situation and ask for the mailing log.",
    "c29_branch_mailbox_b": "Saying a night manager’s word alone isn’t evidence, you officially obtain a Singapore company registry extract and cross-check it.",
    "c29_branch_mailbox_c": "Since someone has already called looking for No. 214, you photograph only the box number and the forwarding address and get out.",
    "c29_branch_mailbox_follow_a": "So that Wei Lin, asking what to say, isn’t put in a bind, you say to tell them plainly that we were here.",
    "c29_branch_mailbox_follow_b": "Before Seoul makes a move, you bundle the registry extract with Haeon’s wire records and send them to Internal Audit.",
    "c29_branch_mailbox_follow_c": "To see who in Seoul has called twice now, you leave a trail on purpose.",
    "c29_route_system_publish": "Saying that if no one has written them down, they must be written now, you put both numbers on one page and send it to the board and the debtors’ group together.",
    "c29_route_system_watch": "So that this time the quadrupling of collection contacts is visible, you set a condition requiring public reports on contact methods for 1 year after the sale.",
    "c29_route_system_drop": "Saying 23 past deals can’t stop this one, you bury the stats and board the plane on the signing schedule.",
    "c29_final_system_route_a": "Saying the hand that cuts the price and the hand that takes the seat mustn’t be the same, you add a clause barring seller-side executives from taking posts on the buyer’s side.",
    "c29_final_system_route_b": "Saying there are only 20 minutes to the signing, you leave the clauses as they are and just get a higher sale price.",
    "c29_final_system_route_c": "Saying these are the people who’ll be hounded as much as the price was cut, you open a help desk for the sold debtors with the sale proceeds.",
    "c29_evidence_turn_file": "Since it could be buried if handled only inside the company, you bundle the 3.6 billion math with the wire trail and file them with the board and the regulators together.",
    "c29_evidence_turn_hold": "Saying that two numbers being the same must be asked with both sides seated, you hold the numbers and bring them out first at the signing table.",
    "c29_evidence_turn_share": "Saying they deserve to know whose fee their discounted debt became, you tell the bundled debtors this math first.",
    "c29_marina_evidence_turn": "Turning back through the sale price negotiating history in clue order, you follow where the money goes at each point the price was cut.",
    "c29_hawker_evidence_turn": "Turning back through the sale price negotiating history in clue order, you follow where the money goes at each point the price was cut.",
    "c29_hotel_evidence_turn": "Turning back through the sale price negotiating history in clue order, you follow where the money goes at each point the price was cut.",
    "c29_route_system_evidence_turn": "Turning back through the sale price negotiating history in clue order, you follow where the money goes at each point the price was cut.",
    "c29_start_warm_debtors": "Saying you have to see the people behind the 427 billion won first, you pack each bundled debtor’s situation separately, line by line.",
    "c29_start_warm_mandate": "Saying you need to know how far this trip lets you look, you confirm the travel order’s review scope in writing first.",
    "c29_start_warm_board": "Saying there’ll be no time to read once you land, you get Seo Harin’s files before boarding and read them in flight.",
    "c29_start_warm_signature": "So you don’t forget there are familiar faces in the bundle, you first look for the customers Do Yoonha remembers in the sale list.",
    "c29_start_record_debtors": "Saying you have to see the people behind the 427 billion won first, you pack each bundled debtor’s situation separately, line by line.",
    "c29_start_record_mandate": "Saying you need to know how far this trip lets you look, you confirm the travel order’s review scope in writing first.",
    "c29_start_record_board": "Saying there’ll be no time to read once you land, you get Seo Harin’s files before boarding and read them in flight.",
    "c29_start_record_signature": "Before anyone can call it a coincidence, you put on official record that the reply deadline and the signing date are the same.",
    "c29_start_rush_debtors": "Saying you have to see the people behind the 427 billion won first, you pack each bundled debtor’s situation separately, line by line.",
    "c29_start_rush_mandate": "Saying you need to know how far this trip lets you look, you confirm the travel order’s review scope in writing first.",
    "c29_start_rush_board": "Saying there’ll be no time to read once you land, you get Seo Harin’s files before boarding and read them in flight.",
    "c29_start_rush_signature": "So you don’t run off alone and get stuck alone, you first tell your colleagues why you left in a hurry and that Seo Harin is with you."
  },
  "pack": {
    "clue": {
      "title": "Mailbox No. 214",
      "text": "Haeon Partners’ last 1.14 billion won and Yoon Sanghyuk’s 3 years of advisory fees go to the same place: Mailbox No. 214 in Raffles Place, Singapore, whose director is Yoon Sanghyuk’s brother-in-law."
    },
    "outcomes": {
      "c29_after_warm": {
        "tag": "Stayed to the End",
        "title": "The three of you sat until the hawker center’s last light went out",
        "text": "On Singapore’s last night, you held out on plastic chairs with Seo Harin and Oh Jinwoo until it was time for the dawn flight. Level 4 chili crab: finished."
      },
      "c29_after_record": {
        "tag": "Left a Summary",
        "title": "Annex C became an 18-page summary",
        "text": "On the flight back, you put the annex, the payee Northgate, and Haeon’s wire records into one document. The money that had already flowed and the money set to flow sat side by side in the same document for the first time."
      },
      "c29_after_rush": {
        "tag": "Ran Ahead",
        "title": "You stood at the CEO office door, suitcase in tow",
        "text": "You took the first flight back and went straight to KD Capital’s CEO office. The door didn’t open, and behind it, Yoon Sanghyuk was laughing."
      }
    },
    "continuityChallenges": {
      "c28_after_warm": {
        "title": "Protect the Voices You Heard Out",
        "text": "The voices you listened to the end at the call center are in the bundle being sold. A card that looks after those people by name, not number, keeps trust intact."
      },
      "c28_after_record": {
        "title": "Overturn the Delayed Reply Deadline",
        "text": "The policy reply deadline has been pushed to the signing date. Whose shield that date is only shows when you reframe the table."
      },
      "c28_after_rush": {
        "title": "Log the Reporter’s Flight in the Trip Record",
        "text": "You boarded the same plane as a reporter, ahead of everyone. A card that puts on record what this trip came to see carries fairness."
      }
    }
  }
}
