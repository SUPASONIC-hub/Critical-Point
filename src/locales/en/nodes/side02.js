/**
 * 번외 2 (src/nodes/side02.js) in English, for the English preview.
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the pack as the app is shipped it
 * (scripts/locale-words.mjs); the pack's label and title live in the
 * dictionary's `copy.sidePacks`, a scene or card left out here keeps its
 * Korean, and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "s2_start": {
      "title": "Red Tape",
      "place": "Outside the secondhand bookshop in Hoegi-dong",
      "clock": "January 9 (Fri) 19:00, demolition still set for April 14",
      "lead": "A Friday night in January, when the demolition date is still April 14. Lim Kyungsoo’s granddaughter, Lim Soyul, gets in touch to ask you to help her find one box.",
      "text": "The demolition notice posted on New Year’s Eve is still on the bookshop’s shutter. The date: April 14. Lim Soyul, the hood of her padded coat pulled low, jingles a ring of keys. 'Grandpa gave me homework from the hospital. A 1998 box, red tape. He says to give what’s inside back to its owner. Before tonight is over.' She looks up at the 2nd-floor window. 'He wants me to find one box in all that junk. Grandpa doesn’t know my birthday, but he knows where every box is.' The shutter goes halfway up and sticks. Lim Soyul kicks it once. 'You were the only one I could ask to come.'",
      "question": "Lim Kyungsoo has given his granddaughter homework: give one box back. What do you do?",
      "memo": [
        "Demolition notice: April 14 -- three months yet",
        "Lim Kyungsoo: in Ieum Hospital, his pneumonia mending",
        "1998 box, red tape -- 'to be given back to its owner'"
      ],
      "choices": {
        "s2_start_go": {
          "label": "Lift the shutter with her and follow her up to the 2nd floor"
        },
        "s2_start_call": {
          "label": "Video-call Lim Kyungsoo before going up"
        },
        "s2_start_quick": {
          "label": "Suggest finding just the box and coming straight back down"
        }
      }
    },
    "s2_shelf": {
      "title": "Left, Third Bay",
      "place": "The secondhand bookshop in Hoegi-dong, 2nd floor",
      "text": "There is no heater on the 2nd floor, and your breath shows first. Apple boxes with years written in marker are stacked to the ceiling. On the phone screen, Lim Kyungsoo sits propped up in his hospital bed. No oxygen line; his glasses on. 'Left from the stairs, third bay. Fourth from the top. Under 1997.' Each time Lim Soyul takes a box down, he calls out its year before she reads it. The red tape appears. Lim Soyul speaks into the screen. 'Then which bay is my birthday in?' Lim Kyungsoo coughs. '...That isn’t in a box.' Lim Soyul snorts. 'I knew it.'",
      "question": "The man who knows exactly where each box is cannot answer his granddaughter’s question. What do you do?",
      "memo": [
        "Lim Kyungsoo: names each box’s place over a video call",
        "1998 box, red tape -- under the 1997 box",
        "'My birthday?' -- 'That isn’t in a box'"
      ],
      "choices": {
        "s2_shelf_both": {
          "label": "Hold the box up until the two of them finish talking"
        },
        "s2_shelf_open": {
          "label": "Photograph the writing on the box before the tape comes off"
        },
        "s2_shelf_cut": {
          "label": "Suggest ending the call and opening the box first"
        }
      }
    },
    "s2_ledger": {
      "title": "Six Notebooks",
      "place": "The secondhand bookshop in Hoegi-dong, 2nd floor",
      "text": "Inside the box are one loan file and six composition notebooks. On the file’s cover, 'Sunja Sewing · Changsin-dong · 1998.4', and on top of it one yellow sticky note. 'To be given back. By me, in person.' The notebooks run from 1992 to 1998: a ledger written by hand, day after day. Fabric, sewing-machine oil, the wages of eleven workers. On the 25th of every month there is the same line. 'Bank interest -- paid.' Not once missed. On the last page of the last notebook there is a crayon drawing. A tiny woman in front of twelve sewing machines. In the corner, 'Mijin, age 9'. Lim Soyul studies the drawing out of professional habit. 'The needles are counted right, but Mom’s face is smaller than the machines.'",
      "question": "A ledger that never missed its interest in 6 years was sitting in a bank’s box. What do you do first?",
      "memo": [
        "Sunja Sewing: Changsin-dong, 12 sewing machines, 11 workers, owner Yang Sunja",
        "6 ledgers (1992-1998): the interest never once missed",
        "Lim Kyungsoo’s note: 'To be given back. By me, in person.'",
        "Last page: a crayon drawing, 'Mijin, age 9'"
      ],
      "choices": {
        "s2_ledger_ask": {
          "label": "Ask Lim Kyungsoo why these ledgers stayed with the bank"
        },
        "s2_ledger_draw": {
          "label": "Let Lim Soyul finish talking about the drawing"
        },
        "s2_ledger_go": {
          "label": "Take the address on the file and head straight to Changsin-dong"
        }
      }
    },
    "s2_why": {
      "title": "A Clean Book",
      "place": "The secondhand bookshop in Hoegi-dong, 2nd floor · video call",
      "text": "Lim Kyungsoo takes off his glasses and wipes them. 'In the spring of 1998, Kyungdong Bank was being sold. The buyer was Kingsdale Partners of New York. Their due diligence team (the people who take a company’s books apart before buying) sent down a list. Every loan to a small company without an outside audit was to be cleared before the purchase. Hand the book over clean, they meant.' He catches his breath. 'Ms. Yang hadn’t been a single day late on her interest in 6 years. I borrowed those notebooks as the proof. I wrote two pages saying the loan must not be called, and they were returned.' From between the papers come two yellowed sheets. A dissenting opinion. In the author’s box is the name of Lim Kyungsoo, aged thirty-four. 'The factory closed in 6 weeks.'",
      "question": "A loan that was being paid was cleared to make a book for sale look clean. What do you do?",
      "memo": [
        "Spring 1998: Kyungdong Bank sold -- buyer Kingsdale Partners (New York)",
        "Due diligence list: small-company loans without an outside audit cleared before the purchase",
        "Lim Kyungsoo (34): two pages of dissent -- returned",
        "Sunja Sewing: closed 6 weeks after the call"
      ],
      "choices": {
        "s2_why_find": {
          "label": "First find out where Ms. Yang Sunja is now"
        },
        "s2_why_paper": {
          "label": "Photograph the two pages with their dates showing"
        },
        "s2_why_market": {
          "label": "Look up the ledgers’ trading partners and go straight to Dongdaemun Market"
        }
      }
    },
    "s2_address": {
      "title": "The Stair Alleys of Changsin-dong",
      "place": "The sewing alleys of Changsin-dong",
      "text": "On the slopes of Changsin-dong, sewing machines whir even at night. Do Yoonha gets off the neighborhood bus and runs over, zipping up his padded coat. For some reason market people always talk to Do Yoonha. At the address on the file, another workshop’s sign hangs where 'Sunja Sewing' was. You knock, and a machinist with reading glasses pushed up on her head comes out. She looks at the ledger’s cover and smiles. 'Sunja? She closed the factory and went out to Dongdaemun. Her daughter runs a shop now. One that opens at ten at night.' Do Yoonha flips through the ledger and points to the list of trading partners. 'There’s a name here every month. Dongdaemun wholesale mall, 2nd floor, No. 87.'",
      "question": "Other sewing machines run where the factory was, and its owner has gone to a market that opens at night. What do you do?",
      "memo": [
        "The Changsin-dong address: another sewing workshop now",
        "The machinist: 'She closed the factory and went out to Dongdaemun; her daughter runs a shop now'",
        "The ledgers’ trading partner: Dongdaemun wholesale mall, 2nd floor, No. 87",
        "The wholesale mall: opens at 10 p.m."
      ],
      "choices": {
        "s2_address_thanks": {
          "label": "Hear more from the machinist about the Sunja Sewing days"
        },
        "s2_address_list": {
          "label": "Count every month No. 87 appears in the list of trading partners"
        },
        "s2_address_taxi": {
          "label": "Hail a taxi and get there as it opens"
        }
      }
    },
    "s2_market": {
      "title": "The Wholesale Mall at Ten",
      "place": "Dongdaemun wholesale mall, 1st-floor aisle",
      "text": "At ten at night, the wholesale mall’s shutters go up all at once. Handcarts piled with black plastic bundles fill the aisles. These are the sourcing runners, the uncles who buy clothes on behalf of shops out in the provinces. One trader takes a single look at Do Yoonha and loads three bundles into his arms. 'Uncle, these are for Daegu. You’re late!' Do Yoonha takes them without thinking and, out of habit, asks the price. 'How much for a bundle of ten? Oh, I’m not an uncle, though.' The trader laughs and takes the bundles back. Lim Soyul, the ledgers held to her chest, looks up the stairs to the 2nd floor. 'A lot of people for one of Grandpa’s homework assignments.' Her phone buzzes. A text from Lim Kyungsoo. 'Found it?'",
      "question": "You are in the middle of a market that opens at night. How do you get to No. 87 on the 2nd floor?",
      "memo": [
        "Wholesale mall: opens at 10 p.m., the sourcing runners’ handcarts",
        "Do Yoonha: mistaken for a sourcing runner, handed three bundles",
        "Lim Kyungsoo’s text: 'Found it?'"
      ],
      "choices": {
        "s2_market_carry": {
          "label": "Carry one bundle for a trader and ask the way"
        },
        "s2_market_map": {
          "label": "Find No. 87 on the floor directory first"
        },
        "s2_market_reply": {
          "label": "Text Lim Kyungsoo back first that it’s found"
        }
      }
    },
    "s2_stall": {
      "title": "No. 87, Mijin",
      "place": "Dongdaemun wholesale mall, 2nd floor, No. 87",
      "text": "The sign on No. 87 says only 'Mijin'. A woman in her late thirties is folding knitwear while taking orders on two phones. This is Ms. Han Mijin. Lim Soyul opens the last notebook and shows her. The knit in her hands stops. 'That’s my drawing.' She scratches the crayon once with her fingernail. 'Mom said she lent these notebooks to the bank and never got them back. Without them she could never get a loan again. Nothing to prove it with, she said.' Order alerts chime one after another. Ms. Han turns the phones face down. 'For 28 years, where did those people keep this?'",
      "question": "After losing the ledgers, Ms. Yang Sunja could never borrow again. How do you answer?",
      "memo": [
        "No. 87 'Mijin': Han Mijin (37), Yang Sunja’s daughter",
        "No ledgers, never a loan again -- 'nothing to prove it with'",
        "'For 28 years, where did they keep this?'"
      ],
      "choices": {
        "s2_stall_true": {
          "label": "Tell her plainly it was in a box on the bookshop’s 2nd floor"
        },
        "s2_stall_mother": {
          "label": "Ask whether you could tell her mother yourself"
        },
        "s2_stall_note": {
          "label": "First show her the note: 'By me, in person'"
        }
      }
    },
    "s2_drawing": {
      "title": "Sewing Machines on the Weekend",
      "place": "Dongdaemun wholesale mall, 2nd floor, No. 87",
      "text": "When customers thin out, Ms. Han pours hot water into two cups of noodles. She holds one out to Lim Soyul. 'I remember the day I drew this. It was a Saturday. Mom was at the factory on weekends too. I thought the sewing machines mattered more than me.' Lim Soyul sits still, chopsticks in hand. On the back of her hand she draws a small sewing machine in pen. She has a habit of not speaking until a drawing is finished. Ms. Han smiles. 'But the day the factory closed, Mom looked for these notebooks first, I heard. Before the machines.' After a long while Lim Soyul opens her mouth. 'My grandpa was on the 2nd floor every weekend too.' She says no more.",
      "question": "What Ms. Han says is what Lim Soyul used to say to her grandfather. What do you do?",
      "memo": [
        "Han Mijin: 'I thought the sewing machines mattered more than me'",
        "The day the factory closed, the first thing Yang Sunja looked for: the ledgers",
        "Lim Soyul: 'My grandpa was on the 2nd floor every weekend too'"
      ],
      "choices": {
        "s2_drawing_quiet": {
          "label": "Say little until the two of them finish their noodles"
        },
        "s2_drawing_page": {
          "label": "Look through the ledgers together for the day the factory closed"
        },
        "s2_drawing_joke": {
          "label": "Praise the sewing machine on Lim Soyul’s hand to lighten the mood"
        }
      }
    },
    "s2_mother": {
      "title": "The Tall Credit Officer",
      "place": "Dongdaemun wholesale mall, 2nd floor, No. 87",
      "text": "Ms. Han calls home on speakerphone. Ms. Yang Sunja, seventy-four, is still awake. The habit of doing alterations at night has stayed with her, they say. When she hears about the ledgers, for a while there is only the sound of a sewing machine. 'That credit officer. Tall, glasses. The day the factory closed he came and helped carry the machines down. His tie in his pocket.' Do Yoonha leans toward the phone. 'He’s in the hospital now. He wrote that he would give the notebooks back to you himself.' Ms. Yang laughs. 'Took him 28 years. He’s sick, you say. So do I go to the hospital, or do I wait?' At the end of the laugh her voice is a little wet.",
      "question": "Ms. Yang Sunja remembers the credit officer from that day. What do you do?",
      "memo": [
        "Yang Sunja (74): still does alterations every night",
        "The day the factory closed: credit officer Lim Kyungsoo helped carry the machines",
        "'Took him 28 years. Do I go to the hospital, or do I wait?'"
      ],
      "choices": {
        "s2_mother_listen": {
          "label": "Listen until Ms. Yang finishes telling that day"
        },
        "s2_mother_record": {
          "label": "Check the dates and sums of April 1998 one by one"
        },
        "s2_mother_decide": {
          "label": "Suggest deciding right here how to give them back"
        }
      }
    },
    "s2_notebook": {
      "title": "Tonight’s Ledger",
      "place": "Dongdaemun wholesale mall, 2nd floor, No. 87",
      "text": "Ms. Han takes a notebook out from under the counter. The shop takes every order through an app, but this notebook is in her mother’s hand. 'Mom writes in this every night. How many alterations, how much for thread. I tell her it’s all in the app; she won’t listen.' It is filled in up to today’s date. Lim Soyul opens it beside the 1998 notebook. The tail of the 7, the small dot at the end of each line: the same. In 28 years the factory is gone, and the handwriting is unchanged. Lim Soyul, taking a photo of the two notebooks, says, 'These aren’t junk. One of them, anyway.' Then she adds quickly, 'Grandpa’s 2nd floor is still junk.'",
      "question": "The factory is gone, but the hand that keeps the ledger remains. What do you do?",
      "memo": [
        "Yang Sunja’s notebook today: written by hand every night, app or no app",
        "The same writing as the 1998 notebooks -- down to the tail of the 7",
        "Lim Soyul: 'These aren’t junk. One of them, anyway.'"
      ],
      "choices": {
        "s2_notebook_side": {
          "label": "Leave the two notebooks side by side and hear more from Ms. Han"
        },
        "s2_notebook_years": {
          "label": "Note down that tonight’s notebook bridges the 28 empty years"
        },
        "s2_notebook_photo": {
          "label": "Send Lim Soyul’s photo to Lim Kyungsoo"
        }
      }
    },
    "s2_aftershock": {
      "title": "How to Give It Back",
      "place": "Dongdaemun wholesale mall, 2nd floor, No. 87",
      "clock": "03:00, before the shutter comes down",
      "text": "Three in the morning, and the handcarts in the aisles thin out. On the counter lie six composition notebooks, the two pages of returned dissent and the yellow sticky note. 'To be given back. By me, in person.' A text comes from the hospital: Lim Kyungsoo, who no longer sleeps through the small hours. 'Did you find the owner? You decide.' Ms. Han strokes a notebook’s cover, then takes her hand away. Lim Soyul picks up the sticky note. 'Grandpa wrote he’d do it himself, and couldn’t for 28 years. This time, who does it?' She looks at you.",
      "question": "Ledgers 28 years late lie in front of their owner’s daughter. How do you give them back?",
      "memo": [
        "6 ledgers, two pages of dissent, the note 'By me, in person'",
        "Lim Kyungsoo’s text: 'You decide.'",
        "The ending you pick stays only on this device"
      ],
      "choices": {
        "s2_after_hand": {
          "label": "Put the six ledgers in Ms. Han’s hands now"
        },
        "s2_after_opinion": {
          "label": "Hand her the two returned pages of dissent with the ledgers"
        },
        "s2_after_himself": {
          "label": "Put them back in the box so Lim Kyungsoo can return them himself"
        }
      }
    }
  },
  "outcomes": {
    "s2_after_hand": {
      "title": "Six Notebooks",
      "text": "You place the six notebooks in Ms. Han’s arms. She pulls down the shutter and hails a taxi. She will take them to her mother while she is still awake, she says. At seven in the morning a photo comes to Lim Soyul. Ms. Yang Sunja, reading glasses on, holds the notebook open at April 1998. Beneath it a short line. 'Every interest box filled. I was right.' Lim Soyul sends the photo on to the hospital. A reply comes. 'Yes. She was right.'"
    },
    "s2_after_opinion": {
      "title": "Two Pages",
      "text": "You lay the two pages of dissent on top of the ledgers. The paper where Lim Kyungsoo, aged thirty-four, wrote 'the loan must not be called'. Beside the RETURNED stamp, his handwriting is just as it was. Ms. Han reads the two pages for a long time. 'So someone took Mom’s side back then. Mom never knew.' You know a returned dissent too. Ms. Han slips the pages in at the very front of the ledgers. 'I’ll tell Mom to read these first.'"
    },
    "s2_after_himself": {
      "title": "By Me, in Person",
      "text": "You put the ledgers back in the red-taped box. Under the sticky note, Lim Soyul writes one more line. 'Grandpa in person, once he’s discharged. Checked by his granddaughter.' Ms. Han passes it on to her mother. Over the speakerphone Ms. Yang Sunja laughs. 'Then I’ll wait. I waited 28 years already.' The box goes back to the 2nd floor in Hoegi-dong, left, third bay. Lim Soyul grumbles. 'One more piece of junk.' Still, she carries the box up the stairs on her own."
    }
  }
};
