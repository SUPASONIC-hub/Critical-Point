/**
 * 사건 19 (src/nodes/case19.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c19_start": {
      "title": "Demolition Notice",
      "text": "Hoegi-dong, on the third day of a cold-wave warning. Over the demolition notice on the bookshop’s shutter, a new sheet has been pasted. The notice went up on New Year’s Eve. The demolition date has changed from 'April 14' to 'January 22, 06:00,' and below it is the name KD Realty. KD Realty is the developer of this redevelopment. It is the group’s real-estate affiliate. Behind the frosted 2nd-floor window is the paper Lim Kyungsoo collected over 40 years, and Lim Kyungsoo is still in the hospital. The pneumonia that was clearing up spread again last week. In front of the shutter, his granddaughter Lim Soyul, her parka hood pulled low, holds out a bundle of keys with a seal-shaped key ring. 'Grandpa told me to give these to you.' Through her breath in the cold, she adds, 'Honestly, I wish we’d just throw all this stuff out.'",
      "memo": [
        "Demolition set for January 22, 06:00 -- originally April 14; 72 hours left",
        "About 300 boxes of paper on the 2nd floor, originals collected since 1985",
        "Lim Kyungsoo: 3rd week at Ieum Hospital, pneumonia relapse",
        "Developer KD Realty -- KD Financial Group’s real-estate affiliate"
      ],
      "choices": {
        "c19_start_ward": {
          "label": "Before taking the keys, ask Lim Kyungsoo at the hospital"
        },
        "c19_start_haul": {
          "label": "Take the keys, call a truck, and start clearing"
        },
        "c19_start_notice": {
          "label": "Check the notice’s date and basis in district records"
        },
        "reframe": {
          "label": "Trace why demolition moved up"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop · Alley Out Front",
      "clock": "January · Cold Wave · Demolition in 72h",
      "question": "A demolition notice is on the building holding 40 years of paper, and its owner is in the hospital. What do you do first?",
      "lead": "3 weeks after the New Year’s Eve text, you come back to the Hoegi-dong bookshop and find a new sheet pasted over the notice."
    },
    "c19_shelves": {
      "title": "Handwriting from 1996",
      "text": "On the bookshop’s 2nd floor, the paper starts at the stair landing. 22 shelf sections, clipped bundles of printouts, apple crates with years written in marker. The heater can’t be turned on, so everyone works in their parkas. Kang Taemin carries two boxes at a time up and down the stairs, and Kwon Dohyun has brought a bathroom scale and writes down the weight of each box. Na Junhyuk pulls a review report from the 1996 box, reads it aloud, and laughs. 'This guy’s handwriting is just like mine. Down to the spelling mistakes.' Three lines later he goes quiet. His own name is in the author field. A report from his rookie days. Kwon Dohyun steps off the scale. '312 boxes, 5.7 tons. To move it all in 72 hours, we can’t rest once. You need to decide what goes first.'",
      "memo": [
        "312 boxes -- 5.7 tons in total, about 94,000 sheets",
        "One 1-ton truck -- two round trips a day because of the narrow alley",
        "1996 box: Na Junhyuk’s reports from his rookie days",
        "11 boxes related to 2023-0412"
      ],
      "choices": {
        "c19_shelves_list": {
          "label": "Move them while listing each box’s year and case"
        },
        "c19_shelves_pick": {
          "label": "Get the 11 boxes for 2023-0412 out first; the rest later"
        },
        "c19_shelves_all": {
          "label": "Pick nothing; gather more people to move it all"
        },
        "reframe": {
          "label": "Trace why demolition moved up"
        },
        "c19_shelves_evidence_turn": {
          "label": "Match the date memo to Box 211"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 2nd Floor · Shelves",
      "clock": "January · Cold Wave · Demolition in 66h",
      "question": "Moving 5.7 tons of paper in 72 hours is tight. What goes out first?",
      "lead": "When you unlock the 2nd-floor door, your breath clouds before the smell of old paper reaches you. Your colleagues are zipping up their parkas at the foot of the stairs."
    },
    "c19_ward": {
      "title": "Gone Only When Burned",
      "text": "A 6-bed room in Ieum Hospital’s pulmonology ward, the window bed. Lim Kyungsoo lies with oxygen through a nasal tube. His cardigan, worn at the elbows, hangs on the bed rail, and his glasses are off. When you show him the box list, he studies it for a long time, then waves his hand. 'I said paper is gone only when it’s burned. So this time, you burn it for me.' He catches his breath twice and goes on. '40 years is enough. If I don’t get out of here, it all becomes that girl’s burden.' Beyond the curtain, Lim Soyul looks up from the guardian’s chair. It was only this morning that she called her grandfather’s paper 'stuff.'",
      "memo": [
        "Lim Kyungsoo: pneumonia relapse, doctor expects 2 more weeks in hospital",
        "The request to 'burn it' -- includes the 2023-0412 boxes",
        "Lim Soyul: 2nd night up at the hospital",
        "Burning it destroys the originals of 3 years of evidence too"
      ],
      "choices": {
        "c19_ward_nod": {
          "label": "Reassure him you’ll burn it, and move the boxes anyway"
        },
        "c19_ward_consent": {
          "label": "Let him pick the boxes to burn and sign a consent form"
        },
        "c19_ward_why": {
          "label": "Ask him to tell Lim Soyul why the paper isn’t a burden"
        },
        "reframe": {
          "label": "Trace why demolition moved up"
        },
        "c19_ward_evidence_turn": {
          "label": "Match the date memo to Box 211"
        }
      },
      "place": "Gangseo Ieum Hospital · Pulmonology Ward",
      "clock": "January · Demolition in 58h",
      "question": "The man who guarded this paper for 40 years now asks you to burn it. How do you answer?",
      "lead": "The window bed at the end of the ward hallway; through a gap in the curtain, you see the oxygen tube first. Lim Soyul gets up from the guardian’s chair to make room."
    },
    "c19_labels": {
      "title": "Picture Labels",
      "text": "204 boxes have gone up on the shelves of the old B2 backup archive. Instead of a tablet, Lim Soyul takes a marker pen and draws a label for each box. An abacus for the 1989 box, a factory chimney with no smoke for 1998, an empty signature line for the box of 2023 printouts. Then her pen stops in front of one box. Her grandfather’s handwriting fills the margins of the review reports. 'Owner’s daughter plays piano. Close the factory and the lessons stop.' 'A face that can’t lie.' Lim Soyul laughs softly. 'He wasn’t collecting paper. He was writing down people.' Then the archive terminal beeps. 'Externally brought-in records: if not registered within 30 days, automatically purged with a retention period of 0 years.'",
      "memo": [
        "204 boxes in B2 / 312 boxes total",
        "Lim Soyul’s hand-drawn labels: 204",
        "Margin notes: loan applicants’ families and circumstances",
        "Unregistered external records are automatically purged after 30 days"
      ],
      "choices": {
        "c19_labels_register": {
          "label": "Register first, noting each box’s source and donor"
        },
        "c19_labels_draw": {
          "label": "Draw labels with Lim Soyul all night; list the margin notes"
        },
        "c19_labels_post": {
          "label": "Announce the demolition and labels in Lim Soyul’s webtoon"
        },
        "reframe": {
          "label": "Trace why demolition moved up"
        },
        "c19_labels_evidence_turn": {
          "label": "Match the date memo to Box 211"
        }
      },
      "place": "Trigger Lab Archive B2 · Backup Archive",
      "clock": "Wednesday, January 21 · Demolition in 27h · 03:00",
      "question": "There are people written in every margin, and unless registered, it is all purged in 30 days. How do you keep these boxes?",
      "lead": "The cold wave doesn’t reach the backup archive on basement level 2 of the old data center. Boxes off the truck sit on the shelves, still dusted with snow."
    },
    "c19_final": {
      "title": "The Last Truck",
      "text": "In the falling snow, an excavator stops at the mouth of the alley. 54 boxes on the last truck, 258 boxes on the B2 shelves. Koo Taehyung brushes the snow off his hard hat and checks his watch. '40 minutes left. Where is the truck going?' Donate to a public archive and anyone can read it, but the transfer and sorting take 1.5 years. Apply to the court to preserve evidence and it has the most force, but sealed paper can’t be read by anyone until the trial ends. Keep it in B2 and we guard it, but the group holds the keys to that building. Your phone rings. Lim Kyungsoo. 'You decide. This time I won’t tell you to burn it.'",
      "memo": [
        "Last truck 54 boxes + B2 258 boxes",
        "Archive donation: 18 months until public access",
        "Evidence preservation: sealed by the court, no access until the trial ends",
        "B2 storage: access rights owned by the group"
      ],
      "choices": {
        "c19_final_keep": {
          "label": "Keep it in Trigger Lab’s B2 and guard it ourselves"
        },
        "c19_final_court": {
          "label": "Apply to preserve evidence; leave the originals sealed"
        },
        "c19_final_donate": {
          "label": "Donate the 312 boxes to a public archive in his name"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop · Alley Out Front",
      "clock": "Thursday, January 22 · Snow · 05:20",
      "question": "In front of the excavator, you have to decide where the last truck goes. Where do you send the 312 boxes?",
      "lead": "On the snow that fell overnight there are only six lines of tire tracks. At the mouth of the alley, an excavator engine idles."
    },
    "c19_aftershock": {
      "title": "The Weight of Paper",
      "text": "The evening the demolition ends, eight people squeeze in around the window bed of the 6-bed room. A nurse comes by twice and twice pretends not to see. Lim Kyungsoo now talks without the nasal tube. Na Junhyuk passes around instant coffee from a thermos, and Kwon Dohyun, reporting that the final shipping cost came in 380,000 won under the estimate, laughs for the first time. A text comes from the demolition foreman, Koo Taehyung. '2nd floor checked. Nothing left. Could I have one of the label drawings your granddaughter put on the boxes?' Lim Soyul holds out her tablet. Next week’s installment, “The Weight of Paper”; the first panel is her grandfather sitting on the stair landing. Lim Kyungsoo puts on his glasses and looks for a long time. 'Is my nose really this big?' Then ECHO’s alert comes up on everyone’s phone at once. 'Notice on replacing the loan judgment verification system: to be announced next Monday at 09:00.'",
      "memo": [
        "2nd floor checked -- all 312 boxes of originals out",
        "Lim Kyungsoo: oxygen stopped",
        "Lim Soyul’s installment “The Weight of Paper”",
        "ECHO alert: replacement notice expected next Monday"
      ],
      "choices": {
        "c19_after_rush": {
          "label": "Go straight down to the Lab’s server room on the alert"
        },
        "c19_after_warm": {
          "label": "Stay beside Lim Kyungsoo in the guardian’s chair tonight"
        },
        "c19_after_record": {
          "label": "Get his signature on the 312-box list as a document"
        }
      },
      "place": "Gangseo Ieum Hospital · Pulmonology Ward",
      "clock": "January 22 · Cold Wave · Evening",
      "question": "ECHO’s replacement warning arrives in the hospital room after the demolition. How do you close this evening?"
    },
    "c19_crew": {
      "title": "The Foreman on the Landing",
      "text": "At four in the afternoon, a man in a hard hat stands on the stair landing. Demolition crew foreman Koo Taehyung. His name is written in marker on the front of his hard hat, and he holds a thermos. Instead of a greeting, he holds out the work schedule. '72 hours is the time for residents to clear out their things. I’ll keep to that. Not 1 minute more.' Na Junhyuk makes him an instant coffee, and after a moment’s hesitation he takes it. 'Someone above called to move it up to the day after tomorrow at dawn. I said no. Because the papers say 72 hours. But the papers are as far as I can hold out.'",
      "memo": [
        "Koo Taehyung: 27 years in demolition, leads a crew of 12",
        "Clearing time guaranteed by the work schedule: 72 hours",
        "Phone request from the developer’s side: 'start work at dawn the day after tomorrow'"
      ],
      "choices": {
        "c19_crew_choice_3": {
          "label": "Pay the crew extra to carry the boxes"
        },
        "c19_crew_choice_2": {
          "label": "Ask him to get the developer’s request in writing"
        },
        "c19_crew_choice_1": {
          "label": "Say we’ll stand with him so he isn’t holding out alone"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 2nd Floor · Stair Landing",
      "clock": "January · Cold Wave · Demolition in 62h",
      "question": "The demolition foreman says the papers are as far as he can hold out. What do you do beyond the papers?"
    },
    "c19_freight": {
      "title": "Shipping Costs",
      "text": "Tuesday night, the snow thickens in the alley outside the bookshop. Beside the truck, Kwon Dohyun draws a table on his tablet. He has weighed all 312 boxes. Average 18.4kg; the heaviest is a 31kg box from 1998. '400,000 won per 1-ton truck run, 20% cold-wave surcharge, an extra ladder truck because the alley is narrow, stair surcharge separate.' His fingertips are red as he taps the calculator. 'Total 6.12 million won. At this price, it’s a loss.' Kang Taemin walks past with that 31kg box on his shoulder. 'If it’s a loss, I’ll lift twice.' Kwon Dohyun looks down at his calculator. 'How am I supposed to put that in a field?'",
      "memo": [
        "Box average 18.4kg -- max 31kg (1998)",
        "Shipping estimate 6.12 million won, cold-wave surcharge included",
        "Trigger Lab operating budget balance: 2.3 million won"
      ],
      "choices": {
        "c19_freight_choice_2": {
          "label": "Bill the group for shipping as a record-preservation cost"
        },
        "c19_freight_choice_3": {
          "label": "Hire the cheapest movers and shove it all in at once"
        },
        "c19_freight_choice_1": {
          "label": "Carry it with Kang Taemin’s night crew and buy dinner"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop · Alley Out Front",
      "clock": "January · Snow · Demolition in 36h",
      "question": "Shipping at 6.12 million won is three times the budget balance. How do you load the 312 boxes?"
    },
    "c19_margin": {
      "title": "The Red Pen",
      "text": "Before dawn, Na Junhyuk is crouched in front of the 1996 box. On the last page of the report he wrote, there is writing in red pen. 'Returned. However, this person’s judgment is right. Next time, attach one more page of grounds and write it through to the end. -- Lim.' Na Junhyuk goes to make an instant coffee, finds there is no hot water, and just holds an empty paper cup. 'For 30 years I thought I’d just been returned. I didn’t know I’d been praised.' He holds the sheet for a long time, then asks. 'This one page -- could I take it?'",
      "memo": [
        "Na Junhyuk’s 1996 report -- returned, red-pen note",
        "'This person’s judgment is right'",
        "If one original page comes out, a number on the box list goes blank"
      ],
      "choices": {
        "c19_margin_choice_2": {
          "label": "Keep the original in the box and make him an exact copy"
        },
        "c19_margin_choice_3": {
          "label": "Say there’s no time and put the page back in the box"
        },
        "c19_margin_choice_1": {
          "label": "Hand Na Junhyuk the original page as it is"
        }
      },
      "place": "Trigger Lab Archive B2 · Reading Room",
      "clock": "January · Dawn 05:10",
      "question": "Na Junhyuk wants a page of red pen from 30 years ago. What do you do with the original?"
    },
    "c19_crew_reaction": {
      "title": "The Date Moved Up",
      "text": "ECHO brings up the demolition plan change filed with the district office. The original demolition date was April 14. The change was filed at six in the evening on Friday, January 16, citing 'shortening the schedule before the cold wave.' ECHO puts one date beside it. As a follow-up to the parliamentary audit, the National Assembly requested that materials related to 2023-0412 not be destroyed, for a preservation period starting February 1. 'The demolition is ten days before that period begins. Work that was moved up because of the cold wave is scheduled for the coldest week of the year.'",
      "memo": [
        "Demolition moved up from April to January",
        "Ten days before the preservation period starts"
      ],
      "choices": {
        "c19_crew_reaction_choice_2": {
          "label": "Object to the district that the stated reason is false"
        },
        "c19_crew_reaction_choice_1": {
          "label": "Tell Foreman Koo first what this date means"
        },
        "c19_crew_reaction_choice_3": {
          "label": "Put off the date fight; spend the time moving boxes"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 2nd Floor · Stair Landing",
      "clock": "January · Cold Wave · Demolition in 61h",
      "question": "The demolition, moved up for the cold wave, falls ten days before the Assembly’s preservation period. What do you do with this date?"
    },
    "c19_freight_reaction": {
      "title": "Empty Shelves in B2",
      "text": "At eleven at night, Han Seoyun comes to the alley herself. Snow has piled on the shoulders of her coat. 'The Trigger Lab B2 archive has 60 empty shelf sections. The 312 boxes fit there.' She pauses. 'But B2 is a group building. The moment they go in, this paper becomes records the group manages, and every time you take something out, it needs my e-signature. And I’m the one who got a signature wrong 3 years ago.' She taps the truck bed with a gloved hand. 'Still, we can’t leave paper overnight in a truck at minus 15 degrees.'",
      "memo": [
        "60 empty shelf sections",
        "A signature needed every time something comes out"
      ],
      "choices": {
        "c19_freight_reaction_choice_3": {
          "label": "Park the truck in a warehouse and just get through tonight"
        },
        "c19_freight_reaction_choice_2": {
          "label": "Set the B2 intake terms in writing first, then unload"
        },
        "c19_freight_reaction_choice_1": {
          "label": "Trust Han Seoyun’s signature and unload into B2 tonight"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop · Alley Out Front",
      "clock": "January · Snow · 23:00",
      "question": "In B2 the paper won’t freeze, but it becomes the group’s records. Where do you unload the boxes tonight?"
    },
    "c19_margin_reaction": {
      "title": "Two Scanners",
      "text": "Lee Minseo comes down to B2 with two scanners on a cart. '94,000 sheets. 1,200 sheets an hour per machine; even running both nonstop, that’s 39 hours. We can’t finish before the demolition.' Plugging them in, she adds, 'And once scanned, this paper goes into the system. The very system Mr. Lim avoided for 40 years. He always said anything in the system can just be altered.' Lee Minseo sets the first sheet on the glass and looks at you. 'What goes in first?'",
      "memo": [
        "94,000 sheets, 39 hours",
        "Paper going into the system"
      ],
      "choices": {
        "c19_margin_reaction_choice_3": {
          "label": "Skip scanning; spend all the time on the last haul"
        },
        "c19_margin_reaction_choice_1": {
          "label": "Call Lim Kyungsoo first; scan the pages he picks"
        },
        "c19_margin_reaction_choice_2": {
          "label": "Scan the 2023-0412 boxes first; keep with the originals"
        }
      },
      "place": "Trigger Lab Archive B2 · Records Room",
      "clock": "January · Demolition in 24h",
      "question": "There’s no time to scan all 94,000 sheets, and scanning turns paper into data. What goes in first?"
    },
    "c19_branch_bookshop": {
      "title": "The Economic History Shelf, 1st Floor",
      "text": "As you left the hospital room, Lim Kyungsoo added one thing in a hoarse voice. '1st floor, economic history shelf.' Back in Hoegi-dong, the old woman who runs the 1st-floor bookshop is tying books with string. 12,000 volumes; tomorrow morning a wastepaper dealer hauls them off at 110 won per kg. When Lim Soyul pulls “50 Years of Korean Finance” from the economic history shelf, a yellowed sheet falls out. A page from a 1997 review report. Another comes out of the second book, and the third. The old woman lets go of the string. 'So he wasn’t coming to buy books. For 19 years he came every week and slipped one in.'",
      "memo": [
        "1st-floor stock: 12,000 volumes -- out as wastepaper tomorrow at 07:00",
        "Economic history shelf: about 1,400 volumes",
        "Original pages found in books: 3 so far",
        "Owner’s compensation 19 million won; books valued at 0 won"
      ],
      "choices": {
        "c19_branch_bookshop_c": {
          "label": "Take only the economic history books; leave the rest"
        },
        "c19_branch_bookshop_b": {
          "label": "Leaf through all 1,400 overnight and log each find"
        },
        "c19_branch_bookshop_a": {
          "label": "Buy her 12,000 books for more than wastepaper price"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop · 1st-Floor Shelves",
      "clock": "January · Cold Wave · Demolition in 56h",
      "question": "1,400 books with originals hidden inside go out as wastepaper tomorrow morning. What do you do with them?"
    },
    "c19_branch_bookshop_follow": {
      "title": "41 Pages",
      "text": "By dawn, forty-one sheets have come out of the economic history shelf. Most are review opinions on returned loans, and the most recent is from April 2023 -- that very loan number. On the flyleaf of one book, Lim Soyul finds her grandfather’s handwriting. 'Soyul’s eighth birthday. Couldn’t go again today.' Next to the date, a clumsy cake is drawn. You can’t tell if it’s a cake or a seal. Lim Soyul looks at it for a long time and laughs. 'He copied this from one I drew for him. He’s really bad at it.' The old woman pours barley tea and asks, 'Where does that paper go now?'",
      "memo": [
        "41 original pages from the books -- 38 return opinions",
        "Most recent, 1 page: April 2023, 2023-0412",
        "Flyleaf note: 'Soyul’s eighth birthday'",
        "The owner: wastepaper pickup can be put off one day"
      ],
      "choices": {
        "c19_branch_bookshop_follow_b": {
          "label": "List each book and page the 41 came from as sources"
        },
        "c19_branch_bookshop_follow_a": {
          "label": "41 pages to his boxes; the note book to Lim Soyul"
        },
        "c19_branch_bookshop_follow_c": {
          "label": "Keep only the 2023-0412 page; load the rest mixed in"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop · 1st-Floor Shelves",
      "clock": "January · Cold Wave · Dawn",
      "question": "41 original pages and a granddaughter’s birthday note came out of the books. What goes where?"
    },
    "c19_route_system": {
      "title": "A Schedule Moved Up",
      "text": "You trace back why the demolition was moved up. ECHO calls up the 23 redevelopment zones KD Realty has handled over the past 5 years. Their work schedules are overlaid on one sheet. 7 of them had buildings that housed financial records. All 7 had their demolition moved up at least once, and for 5, it fell within 2 weeks of a records request from an audit or the parliamentary audit. All five times, the reason given was 'schedule shortening.' 'Demolition has been learned as construction. The probability of calling five jobs moved up for the same reason a coincidence is 0.3%.'",
      "memo": [
        "7 records sites among KD Realty’s 23 redevelopment zones",
        "All 7 demolitions moved up -- 5 within 2 weeks of a records request",
        "Reason in all 5 changes: 'schedule shortening'"
      ],
      "choices": {
        "c19_route_system_publish": {
          "label": "Give the overlaid schedules of the five to Leadline first"
        },
        "c19_route_system_request": {
          "label": "Ask that the preservation period start before demolition"
        },
        "c19_route_system_skip": {
          "label": "Save the table and keep to the moving schedule"
        },
        "c19_route_system_evidence_turn": {
          "label": "Match the date memo to Box 211"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "January · Demolition in 60h",
      "question": "All seven buildings that held records had their demolitions moved up. What do you do with these overlaid schedules?"
    },
    "c19_final_system_route": {
      "title": "Schedule Shortening",
      "text": "Dawn, a few hours before the demolition. ECHO has strung the demolition dates of the seven buildings on one line. The five whose dates were moved up before a records request share the same two words as their reason. The bookshop is the sixth line below them, and in the alley the last truck is starting its engine. The sixth line’s reason field reads 'schedule shortening before the cold wave.' ECHO underlines the last two words. 'I can calculate the probability that this line is the same as the five above it. I will not calculate it. I am not the one who judges.'",
      "memo": [
        "5 buildings whose demolitions were moved up within 2 weeks of a records request -- all citing 'schedule shortening'",
        "Bookshop demolition: today at 06:00",
        "Last truck: 54 boxes"
      ],
      "choices": {
        "c19_final_system_route_c": {
          "label": "Find the owners of the five sites’ lost records; go public"
        },
        "c19_final_system_route_b": {
          "label": "Agree to delay the demolition by one hour, just this once"
        },
        "c19_final_system_route_a": {
          "label": "Require a records survey before razing records buildings"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "January · Demolition Day · Dawn",
      "question": "The sixth line carries the same two words. What do you put in before a next line appears?"
    },
    "c19_evidence_turn": {
      "title": "Observational Research Funds",
      "text": "When you fit the clues together, two sheets line up. The first is the letter requesting the demolition plan change. It was sent not by KD Realty but by KD Financial Group’s Group Strategy Office, officer in charge Deputy Manager Baek Arin. The second is a circulated copy of a budget from 4 years ago, found in Lim Kyungsoo’s Box 211. It is dated before Trigger Lab even opened. The line item: 'Trigger Lab participant response observational research funds.' Cohort 1: 4 participants; the first name is Sunwoo Jin. In the margin is Lim Kyungsoo’s handwriting. 'A budget that uses people as material. Opposed.' A document that gave the head of loan review no field to comment in. Ban Jaewook closes the notebook he was writing in. 'What the people who moved up the demolition were looking for may not have been 2023-0412.'",
      "memo": [
        "Demolition schedule change request: Group Strategy Office, officer Baek Arin",
        "Box 211: circulated copy of the Trigger Lab observational research budget",
        "Cohort 1: 4 participants -- first name Sunwoo Jin"
      ],
      "choices": {
        "c19_evidence_turn_file": {
          "label": "Formally submit the letter and budget to the audit committee"
        },
        "c19_evidence_turn_tell": {
          "label": "Tell Lim Kyungsoo first that his dissent survived"
        },
        "c19_evidence_turn_hold": {
          "label": "Note the name Sunwoo Jin and tell no one yet"
        }
      },
      "place": "Trigger Lab Archive B2 · Shelf 211",
      "clock": "January · Demolition in 8h",
      "question": "The one who moved up the date was the Group Strategy Office, and the box held a budget from before Trigger Lab existed. How do you use these two sheets?"
    },
    "c19_start_warm": {
      "title": "The People Whose Year-End Party Never Ended",
      "text": "The people who turned off the pantry lights on New Year’s Eve are still trading photos of calculator-shaped rice cakes in the group chat into the 3rd week of January. Whatever desk he saw in the new year at, Oh Jinwoo always answers first. On Monday morning, the third day of the cold wave, that same Oh Jinwoo posts a photo. The Hoegi-dong bookshop shutter: over the demolition notice you only heard about by text on New Year’s Eve, a new sheet has been pasted. The date has been moved up from April 14 to January 22. The developer is KD Realty. One of the group’s affiliates. 'They say Mr. Lim is still in the hospital. And there are 72 hours left.' In the corner of the photo is his granddaughter, Lim Soyul, holding a bundle of keys. Oh Jinwoo passes on her words as they were. 'Grandpa told me to give you the keys. Though I wish we’d just throw all this stuff out.'",
      "memo": [
        "Demolition set for January 22, 06:00 -- originally April 14",
        "Developer KD Realty, the group’s real-estate affiliate",
        "Everyone in the group chat is clearing their week"
      ],
      "choices": {
        "c19_start_warm_notice": {
          "label": "Check the notice’s date and basis in district records"
        },
        "c19_start_warm_haul": {
          "label": "Take the keys, call a truck, and start clearing"
        },
        "c19_start_warm_ward": {
          "label": "Before taking the keys, ask Lim Kyungsoo at the hospital"
        },
        "c19_start_warm_signature": {
          "label": "Rally the year-end chat and go to Hoegi-dong together"
        },
        "c19_start_warm_reframe": {
          "label": "Trace why demolition moved up"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "January · Cold Wave · Demolition in 72h",
      "question": "The people who got through New Year’s Eve together have seen the demolition notice photo. Where do you go with them first?",
      "lead": "You are about to take down the year-end party photo still on the pantry wall when the group chat pings."
    },
    "c19_start_record": {
      "title": "The New Year of the One Who Left a Standard",
      "text": "The debtor protection standard for the sale bundle that you put in writing on New Year’s Eve was attached word for word to the materials for the first board meeting of the new year. Ban Jaewook counts the six footnotes in the grounds field that read 'Original: Hoegi-dong secondhand bookshop, 2nd floor.' A Monday in the January cold wave: over the demolition notice on that bookshop’s shutter, a new sheet is pasted. The date has been moved up from April 14 to January 22. The developer is KD Realty. One of the group’s affiliates. Lim Kyungsoo’s pneumonia has spread again and he is still in the hospital; his granddaughter Lim Soyul holds the keys. This morning she said on the phone, 'Grandpa told me to give you the keys. Though I wish we’d just throw all this stuff out.' Ban Jaewook opens his notebook. 'The originals behind those six footnotes go under the excavator in 72 hours.'",
      "memo": [
        "Demolition set for January 22, 06:00 -- originally April 14",
        "6 originals underpinning the debtor protection standard are on the bookshop’s 2nd floor",
        "Lim Kyungsoo: 3rd week in hospital, pneumonia relapse"
      ],
      "choices": {
        "c19_start_record_notice": {
          "label": "Check the notice’s date and basis in district records"
        },
        "c19_start_record_ward": {
          "label": "Before taking the keys, ask Lim Kyungsoo at the hospital"
        },
        "c19_start_record_haul": {
          "label": "Take the keys, call a truck, and start clearing"
        },
        "c19_start_record_signature": {
          "label": "Request the district files on why the plan changed"
        },
        "c19_start_record_reframe": {
          "label": "Trace why demolition moved up"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "January · Cold Wave · Demolition in 72h",
      "question": "Six originals behind the standard you left are inside a building about to be razed. How do you turn the document back toward its originals?",
      "lead": "Ban Jaewook, who has been counting footnotes in the board materials, drags his chair over to your desk."
    },
    "c19_start_rush": {
      "title": "Three Months for the One Who Ran Ahead",
      "text": "On New Year’s Eve, before the applause for the farewell speech had even ended, you ran to Hoegi-dong. Back then the date on the shutter’s demolition notice was April 14, and as you and Lim Soyul traded numbers with frozen hands, you said three months would be plenty. A Monday morning in the January cold wave, a call comes from that number. 'A new sheet’s been pasted over the notice. It says January 22, 06:00. Grandpa’s still in the hospital, and he says to give you the keys.' The developer is still KD Realty. One of the group’s affiliates. The voice on the line is cold. 'You said three months would do. Now it’s three days. Honestly, I wish we’d just throw all this stuff out.'",
      "memo": [
        "New Year’s Eve notice: April 14 -- new notice: January 22, 06:00",
        "72 hours left",
        "Lim Kyungsoo: 3rd week in hospital, pneumonia relapse"
      ],
      "choices": {
        "c19_start_rush_haul": {
          "label": "Take the keys, call a truck, and start clearing"
        },
        "c19_start_rush_ward": {
          "label": "Before taking the keys, ask Lim Kyungsoo at the hospital"
        },
        "c19_start_rush_notice": {
          "label": "Check the notice’s date and basis in district records"
        },
        "c19_start_rush_signature": {
          "label": "Take the New Year’s Eve photo and go clear it now"
        },
        "c19_start_rush_reframe": {
          "label": "Trace why demolition moved up"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "January · Cold Wave · Demolition in 72h",
      "question": "Three months has shrunk to three days. How do you keep the promise you made on New Year’s Eve?",
      "lead": "The number you got on New Year’s Eve rings at eight on Monday morning."
    }
  },
  "echoReplies": {
    "c19_start_ward": "When you go to the hospital first, Lim Kyungsoo is down for tests. You wait an hour and leave without seeing him. You get the keys that much later, and Lim Soyul remembers that you went to the hospital first.",
    "c19_start_notice": "The district records show the demolition date was changed on the evening of Friday, January 16. Confirming that takes 5 of the 72 hours.",
    "c19_start_haul": "The truck arrives within an hour. Lim Soyul hands over the keys and turns away without asking whether you will go see her grandfather.",
    "c19_shelves_all": "With more people, the stair landing is crowded. All 312 boxes get a place, and every evening this week for those people belongs to the bookshop.",
    "c19_shelves_list": "The list becomes accurate. At 3 minutes a box, 312 boxes put 15 hours into the list.",
    "c19_shelves_pick": "The 11 boxes are safe by the end of today. The other 301 include Na Junhyuk’s 1996.",
    "c19_ward_why": "Hearing the request, Lim Kyungsoo looks at the ceiling for a long time. Then he calls his granddaughter. The story that comes out past the oxygen tube runs so long the nurse comes by twice.",
    "c19_ward_consent": "The consent form is clean. With a shaking hand, Lim Kyungsoo writes one box number in the 'burn' field, and doesn’t say what that number is.",
    "c19_ward_nod": "He closes his eyes, reassured. Beyond the curtain, Lim Soyul heard your answer, and she knows it is a lie.",
    "c19_labels_draw": "When the labels are all drawn, it is six in the morning. Lim Soyul’s webtoon deadline slips a day, and 1,380 lines of margin notes go into the list.",
    "c19_labels_register": "When registration is done, the 30-day purge warning goes off. The registry’s administrator field is filled in automatically with the group’s General Affairs team.",
    "c19_labels_post": "The installment passes 120,000 views within an hour. Comments start asking for 'the address of the Hoegi-dong bookshop, 2nd floor.'",
    "c19_final_donate": "Donated, the paper belongs to everyone. For 1.5 years no one can read it, and the trial that opens in the meantime has no originals.",
    "c19_final_court": "Sealed, no one can touch it. That no one includes you and Lim Kyungsoo, who guarded the originals for 40 years.",
    "c19_final_keep": "In B2, you can take it out as soon as tomorrow. The card that opens that door is reissued by the group every month.",
    "c19_after_warm": "The guardian’s chair is hard. At three in the morning Lim Kyungsoo wakes, asks 'Where’s the paper?', hears the answer, and falls back asleep. ECHO’s alert waits until morning.",
    "c19_after_record": "Lim Kyungsoo writes his name on the first line of the handover document. When the handwriting shakes, he laughs. 'Shows less than a burn mark, at least.'",
    "c19_after_rush": "As you go down to the server room, Lim Soyul sends photos of the labels. The last photo is a label with your face drawn on it, and you don’t open it until the next day.",
    "c19_crew_choice_1": "When you stand with him, Koo Taehyung takes off his hard hat for the first time. In return, whoever made that call is now up against all of us, not one foreman.",
    "c19_crew_choice_2": "Asked for it in writing, Koo Taehyung stares at his phone for a long time. If it comes in writing, he becomes a witness, and fewer companies will call him to the next site.",
    "c19_crew_choice_3": "With the extra pay, things come out twice as fast. No one knows anymore in what order the boxes were loaded.",
    "c19_freight_choice_1": "Six from the night shift come to the alley on their way home. Dinner is eight bowls of sundae soup, and their backs the next day are not on the bill.",
    "c19_freight_choice_2": "The bill is received. If the group pays, the group also learns where that paper is.",
    "c19_freight_choice_3": "The cheap movers are fast. A corner of the 1998 box tears on the truck door, and a few sheets fall onto the snow.",
    "c19_margin_choice_1": "Na Junhyuk puts the original page in the inside pocket of his vest. No. 1996-14 on the list goes blank, and someday someone will ask about that blank.",
    "c19_margin_choice_2": "Na Junhyuk runs a finger over the red writing on the copy. 'The copy’s red too.' The original keeps its number.",
    "c19_margin_choice_3": "The paper goes back where it was. Na Junhyuk holds the empty paper cup and doesn’t get up for a while.",
    "c19_crew_reaction_choice_1": "Hearing what the date means, Koo Taehyung folds the schedule. 'Then what did I come here to tear down?' Answering that question takes an hour.",
    "c19_crew_reaction_choice_2": "The objection is received. The district has 14 days to answer, and the demolition is in three days.",
    "c19_crew_reaction_choice_3": "The boxes come out fast. Who moved up the date is buried under the noise of the excavator.",
    "c19_freight_reaction_choice_1": "When you say you trust her, Han Seoyun holds out her access card instead of answering. The card’s owner is still the group.",
    "c19_freight_reaction_choice_2": "Writing the terms takes two hours. Meanwhile, the thermometer in the truck bed reads minus 16 degrees.",
    "c19_freight_reaction_choice_3": "When the warehouse shutter comes down, there’s no heat. The thermometer reads minus 12 degrees. Past midnight the truck goes to B2 after all, and the boxes are unloaded with no one having written any intake terms.",
    "c19_margin_reaction_choice_1": "On the phone, Lim Kyungsoo coughs for a long time, then says, 'Scan the margins first. They were never once in the system.'",
    "c19_margin_reaction_choice_2": "With files made, the contents remain even if the originals vanish. So does the fact that altering a file takes nothing but one password.",
    "c19_margin_reaction_choice_3": "The scanners stay on the cart, switched off. The 94,000 sheets still exist in just one copy.",
    "c19_branch_bookshop_a": "The old woman holds the envelope of book money in both hands. 'In 40 years of business, today’s the first time I got a proper price for books.' Trigger Lab’s operating account has 2.3 million won left.",
    "c19_branch_bookshop_b": "Leafing through 1,400 volumes takes the whole night. At four in the morning, Kang Taemin shows up with two cups of noodles and silently starts on the sixth section.",
    "c19_branch_bookshop_c": "The economic history shelf survives. The four pages slipped into “Industrial Map of Korea” on the next shelf go onto the wastepaper truck.",
    "c19_branch_bookshop_follow_a": "Lim Soyul tucks the book with the flyleaf note inside her parka. The 41 pages get mixed into the boxes with no source.",
    "c19_branch_bookshop_follow_b": "With a source list, it is proven down to which page of which book each came from. The book with the flyleaf note goes into a box too, as one line on the list.",
    "c19_branch_bookshop_follow_c": "One page goes into your bag. No one will know which books the other 40 came from.",
    "c19_route_system_publish": "Once the table is a story, KD Realty issues an explanation. The most frequent words in the explanation are also 'schedule shortening.'",
    "c19_route_system_request": "The request reaches the member’s office. For the Assembly to move up the date it needs a meeting, and the meeting is set for the week after the demolition.",
    "c19_route_system_skip": "The table stays in a folder. Someday the next building’s demolition date will quietly be moved up too.",
    "c19_final_system_route_a": "With the requirement, someone has to check the paper inside a building before the next demolition. KD Realty doesn’t answer that requirement for three months.",
    "c19_final_system_route_b": "You gain an hour. The records at the five sites are still gone, and this building goes on record as the lucky one.",
    "c19_final_system_route_c": "Finding the owners takes a month. Two of them have already died, and their families didn’t even know what had been lost.",
    "c19_evidence_turn_file": "At the audit committee, Baek Arin’s name appears in an official document for the first time. Sunwoo Jin’s name goes in too, and Sunwoo Jin doesn’t know it yet.",
    "c19_evidence_turn_hold": "The name is only in your notebook. The group checks the access log of B2, where Box 211 sits, every day.",
    "c19_evidence_turn_tell": "When you tell him, Lim Kyungsoo laughs for a long time, then coughs. 'That was the shortest dissent I ever wrote. The short ones last, it seems.'",
    "c19_shelves_evidence_turn": "Put the letter and the box side by side and the hand that moved up the date shows. What that hand was looking for is in the box too.",
    "c19_ward_evidence_turn": "Put the letter and the box side by side and the hand that moved up the date shows. What that hand was looking for is in the box too.",
    "c19_labels_evidence_turn": "Put the letter and the box side by side and the hand that moved up the date shows. What that hand was looking for is in the box too.",
    "c19_route_system_evidence_turn": "Put the letter and the box side by side and the hand that moved up the date shows. What that hand was looking for is in the box too.",
    "case19_memory_system": "Overlaid, this isn’t the only building whose demolition was moved up. ECHO marks the seven sites that housed records.",
    "case19_memory_evidence": "Hold deal term No. 7 against the demolition letter and the sending department isn’t the developer. And one box turns up a budget from before Trigger Lab existed.",
    "c19_start_warm_ward": "When you go to the hospital first, Lim Kyungsoo is down for tests. You wait an hour and leave without seeing him. You get the keys that much later, and Lim Soyul remembers that you went to the hospital first.",
    "c19_start_warm_notice": "The district records show the demolition date was changed on the evening of Friday, January 16. Confirming that takes 5 of the 72 hours.",
    "c19_start_warm_haul": "The truck arrives within an hour. Lim Soyul hands over the keys and turns away without asking whether you will go see her grandfather.",
    "c19_start_warm_signature": "When you type 'boxes' in the group chat, nine replies come within 1 minute. Kwon Dohyun’s reply is 'Please send the unit cost per box first.'",
    "c19_start_record_ward": "When you go to the hospital first, Lim Kyungsoo is down for tests. You wait an hour and leave without seeing him. You get the keys that much later, and Lim Soyul remembers that you went to the hospital first.",
    "c19_start_record_notice": "The district records show the demolition date was changed on the evening of Friday, January 16. Confirming that takes 5 of the 72 hours.",
    "c19_start_record_haul": "The truck arrives within an hour. Lim Soyul hands over the keys and turns away without asking whether you will go see her grandfather.",
    "c19_start_record_signature": "The request is received. While the clerk says 'the original filing and attachments take up to ten days,' 3 of the 72 hours pass.",
    "c19_start_rush_ward": "When you go to the hospital first, Lim Kyungsoo is down for tests. You wait an hour and leave without seeing him. You get the keys that much later, and Lim Soyul remembers that you went to the hospital first.",
    "c19_start_rush_notice": "The district records show the demolition date was changed on the evening of Friday, January 16. Confirming that takes 5 of the 72 hours.",
    "c19_start_rush_haul": "The truck arrives within an hour. Lim Soyul hands over the keys and turns away without asking whether you will go see her grandfather.",
    "c19_start_rush_signature": "April 14 in the photo and January 22 on the shutter sit side by side. Lim Soyul looks at the photo for a long time, then says, 'I was grateful you came that day. But don’t bring up the three months again.'"
  },
  "choiceVoiceLines": {
    "c19_start_ward": "Since the paper’s owner is still in the hospital, you go there first, before taking the keys, to ask what Lim Kyungsoo wants.",
    "c19_start_notice": "Saying you can’t act on a pasted-over sheet alone, you check the demolition notice’s date and basis in the district office’s records.",
    "c19_start_haul": "Saying there is no time to argue before January 22, you take the keys and call a truck to start clearing right away.",
    "c19_shelves_all": "Not knowing which box holds whose 1996, you gather more people so everything can be moved without picking out a single page.",
    "c19_shelves_list": "Saying that once mixed up you’ll never find what is where again, you move the boxes while making a list of each one’s year and case.",
    "c19_shelves_pick": "Saying you may not get everything out before the demolition, you take out the 11 boxes related to 2023-0412 first and put off the rest.",
    "c19_ward_why": "So his granddaughter doesn’t inherit it only as a burden, you ask him to tell Lim Soyul himself why the paper isn’t a burden.",
    "c19_ward_consent": "To make clear how far his request to burn it goes, you have him pick the boxes to burn and the boxes to keep himself, and get it on a consent form.",
    "c19_ward_nod": "To reassure a man short of breath, you answer that you’ll burn it, and move the boxes as they are.",
    "c19_labels_draw": "Since the handwriting in the margins is part of what these boxes hold, you finish drawing labels with Lim Soyul overnight and put the margin notes on the list too.",
    "c19_labels_register": "Saying pictures alone don’t prove whose these are, you formally register each box first with its source and donor, Lim Kyungsoo.",
    "c19_labels_post": "Saying people should know before it’s torn down, you have Lim Soyul announce the demolition and label photos in her webtoon first.",
    "c19_final_donate": "Saying records are records only if anyone can read them, you donate the 312 boxes to a public archive in Lim Kyungsoo’s name.",
    "c19_final_court": "Saying the first thing is that no one can touch them, you apply to the court to preserve evidence and leave the originals sealed in its care.",
    "c19_final_keep": "Saying you have to be able to take them out and read them as soon as tomorrow, you keep them in Trigger Lab’s B2 and guard them yourselves.",
    "c19_after_warm": "Since he might wake before dawn and look for his paper, you stay beside Lim Kyungsoo in the guardian’s chair tonight.",
    "c19_after_record": "To record what went where, you get Lim Kyungsoo’s signature on the 312-box list and keep it as a handover document.",
    "c19_after_rush": "Saying anything about ECHO can’t wait until morning, you go straight down to Trigger Lab’s server room the moment you see the alert.",
    "c19_crew_choice_1": "So the foreman who kept to the papers isn’t holding out alone, you say we will stand in the way with him.",
    "c19_crew_choice_2": "Since a phone call leaves no trace, you ask the foreman to get the developer’s phoned request in writing.",
    "c19_crew_choice_3": "Saying it takes many hands to finish in 72 hours, you pay the crew extra and have them carry the boxes.",
    "c19_freight_choice_1": "Taking him up on lifting twice if it’s a loss, you carry it with Kang Taemin and his night-shift colleagues and buy them dinner.",
    "c19_freight_choice_2": "Saying this is money spent protecting group records, you bill the group formally for shipping as a record-preservation cost.",
    "c19_freight_choice_3": "Since 6.12 million won is beyond you, you call the cheapest movers and shove all the boxes in at once.",
    "c19_margin_choice_1": "Saying praise that arrived 30 years late belongs to him, you hand Na Junhyuk the original page as it is.",
    "c19_margin_choice_2": "To leave neither the box nor his 30 years empty, you keep the original in the box and make him an exact copy.",
    "c19_margin_choice_3": "Saying there is no time to pull pages out one by one, you put the sheet back in the box.",
    "c19_crew_reaction_choice_1": "Since you can’t leave the man who held to the 72 hours standing there unaware, you tell Foreman Koo Taehyung first what this date means.",
    "c19_crew_reaction_choice_2": "Saying no one can blame a cold wave in the coldest week, you object to the district office that the reason given for the change is false.",
    "c19_crew_reaction_choice_3": "Saying time keeps passing while you argue, you put off the fight over the date and spend the remaining time only on moving boxes.",
    "c19_freight_reaction_choice_1": "Since you can’t leave paper overnight at minus 15 degrees, you trust Han Seoyun’s signature and unload the boxes into B2 tonight.",
    "c19_freight_reaction_choice_2": "To nail down in advance whose signature it takes to get them out, you set the B2 intake terms in writing first and unload after.",
    "c19_freight_reaction_choice_3": "Saying that once inside a group building it’s hard to undo, you park the truck in a warehouse and just get through tonight.",
    "c19_margin_reaction_choice_1": "Since putting it into the system he avoided for 40 years is his call, you phone Lim Kyungsoo first and scan the pages he picks.",
    "c19_margin_reaction_choice_2": "To make two copies of the paper most likely to be targeted first, you scan the 2023-0412 boxes first and keep the files with the originals.",
    "c19_margin_reaction_choice_3": "Saying you don’t have 39 hours anyway, you skip scanning and spend all the remaining time on the last haul.",
    "c19_branch_bookshop_a": "Since you can’t let them go at 110 won per kg, you buy all 12,000 of the old woman’s books for more than the wastepaper price.",
    "c19_branch_bookshop_b": "Saying you have to keep which book each came from too, you leaf through all 1,400 economic history volumes overnight and log every page found.",
    "c19_branch_bookshop_c": "Saying one shelf is all you can take by morning, you take only the economic history books, boxes and all, and leave the rest to the wastepaper dealer.",
    "c19_branch_bookshop_follow_a": "Since the birthday note is not evidence but his granddaughter’s, you put the 41 pages in her grandfather’s boxes and give the book with the flyleaf note to Lim Soyul.",
    "c19_branch_bookshop_follow_b": "Saying it can be trusted only if even the spot it was tucked into is kept, you write down every book title and page the 41 came from as a source list.",
    "c19_branch_bookshop_follow_c": "Saying the one loan number is all you need now, you keep only the 2023-0412 page and load the rest mixed into the boxes.",
    "c19_route_system_publish": "Saying the outside world has to see the same reason repeated five times, you give the overlaid schedules of the five sites to Leadline first.",
    "c19_route_system_request": "To stop it being razed before preservation even begins, you ask that the Assembly’s preservation period be moved up to before the demolition date.",
    "c19_route_system_skip": "Saying a table doesn’t move boxes, you just save it and keep to the moving schedule.",
    "c19_final_system_route_a": "So the same thing doesn’t repeat at the next building, you demand that buildings housing records go through a records survey before demolition.",
    "c19_final_system_route_b": "Saying you only need time for the last truck to leave, you agree to delay the demolition by one hour, just this once.",
    "c19_final_system_route_c": "To show it wasn’t only the bookshop, you find the owners of the records lost at the five sites and go public together.",
    "c19_evidence_turn_file": "Saying that with the two sheets lined up it has to go through procedure, you bundle the change letter and the budget copy and formally submit them to the audit committee.",
    "c19_evidence_turn_hold": "Saying it is too early to act on one name, you note the name Sunwoo Jin and tell no one for now.",
    "c19_evidence_turn_tell": "Since the man who asked you to burn it should know first, you tell Lim Kyungsoo that the dissent he wrote survived.",
    "c19_shelves_evidence_turn": "Setting the clues you gathered beside the demolition plan change letter, you work out who moved up the date.",
    "c19_ward_evidence_turn": "Setting the clues you gathered beside the demolition plan change letter, you work out who moved up the date.",
    "c19_labels_evidence_turn": "Setting the clues you gathered beside the demolition plan change letter, you work out who moved up the date.",
    "c19_route_system_evidence_turn": "Setting the clues you gathered beside the demolition plan change letter, you work out who moved up the date.",
    "c19_start_warm_ward": "Since the paper’s owner is still in the hospital, you go there first, before taking the keys, to ask what Lim Kyungsoo wants.",
    "c19_start_warm_notice": "Saying you can’t act on a pasted-over sheet alone, you check the demolition notice’s date and basis in the district office’s records.",
    "c19_start_warm_haul": "Saying there is no time to argue before January 22, you take the keys and call a truck to start clearing right away.",
    "c19_start_warm_signature": "Since this is not paper one person can carry, you gather movers in the year-end group chat and all go to Hoegi-dong together.",
    "c19_start_record_ward": "Since the paper’s owner is still in the hospital, you go there first, before taking the keys, to ask what Lim Kyungsoo wants.",
    "c19_start_record_notice": "Saying you can’t act on a pasted-over sheet alone, you check the demolition notice’s date and basis in the district office’s records.",
    "c19_start_record_haul": "Saying there is no time to argue before January 22, you take the keys and call a truck to start clearing right away.",
    "c19_start_record_signature": "Before the originals behind the standard are razed, you request access to the district files on when and why the demolition plan changed.",
    "c19_start_rush_ward": "Since the paper’s owner is still in the hospital, you go there first, before taking the keys, to ask what Lim Kyungsoo wants.",
    "c19_start_rush_notice": "Saying you can’t act on a pasted-over sheet alone, you check the demolition notice’s date and basis in the district office’s records.",
    "c19_start_rush_haul": "Saying there is no time to argue before January 22, you take the keys and call a truck to start clearing right away.",
    "c19_start_rush_signature": "To answer for saying three months would be plenty, you take the photo of the first notice from New Year’s Eve and go clear things out today."
  },
  "pack": {
    "clue": {
      "title": "Observational Research Funds",
      "text": "The request to move up the demolition came from the Group Strategy Office. Lim Kyungsoo’s Box 211 held a copy of a 'participant response observational research funds' budget from before Trigger Lab existed, and the first name on the cohort 1 participant list was Sunwoo Jin."
    },
    "outcomes": {
      "c19_after_warm": {
        "tag": "Stayed Beside Him",
        "title": "From the guardian’s chair, you watched him fall asleep again",
        "text": "The night the demolition ended, you stayed beside Lim Kyungsoo in the guardian’s chair. Before dawn he woke, asked where the paper was, heard the answer, and fell back asleep."
      },
      "c19_after_record": {
        "tag": "Left a List",
        "title": "His name went at the top of the 312 boxes",
        "text": "The donor’s name and signature, Lim Kyungsoo, went on the first line of the handover document. Paper hidden for 40 years carried its owner’s name for the first time."
      },
      "c19_after_rush": {
        "tag": "Went Down First",
        "title": "You left the hospital room and went straight to the server room",
        "text": "Seeing the alert, you left only a goodbye at the hospital room and headed for Trigger Lab’s server room. You didn’t open the label photos Lim Soyul sent until the next morning."
      }
    },
    "continuityChallenges": {
      "c18_after_warm": {
        "title": "Lift It with Those Who Stayed Until the Lights Went Off",
        "text": "The people who stayed until the pantry lights went off on New Year’s Eve haven’t scattered yet. This load too, the cards that share the lifting wear down trust less."
      },
      "c18_after_record": {
        "title": "Save the Footnotes’ Originals",
        "text": "The grounds for the debtor protection standard you left were paper on the bookshop’s 2nd floor. To make the document protect its own originals, you have to reframe the table."
      },
      "c18_after_rush": {
        "title": "Explain Why Three Months Became Three Days",
        "text": "Running ahead on New Year’s Eve, you said three months would be plenty. The card that explains to the family why that became three days sets fairness right."
      }
    }
  }
};
