/**
 * 사건 35 (src/nodes/case35.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c35_start": {
      "title": "110mm an Hour",
      "text": "The monsoon rain that began at the weekend thickens to 110mm an hour. On the KD Capital Risk Management situation board, western Seoul and southeastern Incheon bleed red. Your phone rings again and again. Do Yoonha first. 'The alleys in Mangwon Market are ankle-deep in water. Moon Gaeul is pulling the plugs on her rice cake machines.' Then Foreman Kim at To-the-End Precision in Incheon sends a photo. The drain you cleared with Kang Taemin is blocked again, and muddy water is licking in under the shutter like a tongue. The six lathes have been turning again for less than 1 year. Do Yoonha goes on. 'The branch inbox is already filling with questions about tomorrow morning’s emergency flood loans. But those loans are reviewed by NOAH now, the AI review engine (an artificial-intelligence program that judges loan applications automatically).' The rain outside the window drowns out the alarm on the situation board.",
      "memo": [
        "Monsoon rain since the weekend, day four -- 110mm an hour tonight",
        "Low-lying alleys of Mangwon Market flooding, Gaeul Rice Cake Shop included",
        "To-the-End Precision flooding under the shutter -- 6 lathes",
        "Emergency flood loan reviews: AI review engine NOAH"
      ],
      "choices": {
        "c35_start_photo": {
          "label": "Tell the merchants to record the time and photos of damage first"
        },
        "c35_start_go": {
          "label": "Load sandbags and head for Mangwon Market"
        },
        "c35_start_file": {
          "label": "File all the emergency loan applications overnight in one go"
        },
        "reframe": {
          "label": "Ask the reason three times over"
        }
      },
      "place": "KD Capital Risk Management · Situation Board",
      "clock": "July 14 · Downpour · 23:40",
      "question": "Mangwon Market and To-the-End Precision are going under on the same night. What do you do first?",
      "lead": "In Risk Management, where late nights became routine after the search and seizure (an investigation in which, with a court’s permission, records and items are taken by force), the disaster board paints names you know in red for the first time."
    },
    "c35_sandbag": {
      "title": "Pink Flowered Boots",
      "text": "Rain hammering the Mangwon Market arcade roof buries every voice. Ahn Gibeom, secretary of the merchants’ association, shouts with a live stream running on his phone. '300 sandbags are here! Anyone with free hands, to the rice cake alley!' Kang Taemin runs with two on each shoulder, and Kwon Dohyun, who ran over on his way home from work, has put on the last pair of rain boots in the market hardware store. Pink, flowered, size 240mm. He takes out his calculator with his toes curled, then puts it back. 'I’ll do the sums when the water’s gone.' A few people laugh, but only for a moment; Ahn Gibeom unfolds a wet map of the market. 300 sandbags can hold back the water in only one place. The lowest alley, where the elderly merchants’ shops crowd together. The basement power room, where the electricity for every refrigerator in the market comes together. Or the entrance, with 20 shops lined up along the main road. The water rises a hand’s width every 10 minutes.",
      "memo": [
        "300 sandbags -- enough to protect only one section",
        "Lowest alley: 11 shops of elderly owners, Gaeul Rice Cake Shop included",
        "Basement power room: power for all the market’s fridges and freezers",
        "Entrance: 20 shops on the main road"
      ],
      "choices": {
        "c35_sandbag_gate": {
          "label": "Stack them all at the entrance and save the 20 main-road shops"
        },
        "c35_sandbag_power": {
          "label": "Block the basement power room first, per the district manual"
        },
        "c35_sandbag_alley": {
          "label": "Block the lowest alley, where the elderly owners’ shops are"
        },
        "reframe": {
          "label": "Ask the reason three times over"
        },
        "c35_sandbag_evidence_turn": {
          "label": "Open NOAH’s flood-loan rulings"
        }
      },
      "place": "Mangwon Market · Rice Cake Alley",
      "clock": "July 15 · Downpour · 01:30",
      "question": "300 sandbags can hold back the water in only one place. Where do you put them?",
      "lead": "You get out in front of the closed road and run the last 1km; muddy water is lapping at every shutter at the market entrance."
    },
    "c35_lathe": {
      "title": "Don’t Touch It",
      "text": "The water is gone, and a hand’s-width layer of silt covers the floor of To-the-End Precision in Incheon’s Namdong Industrial Complex. The six lathes stand with a band of muddy waterline at waist height. Foreman Kim is wiping the handle of the first lathe with a rag when he stops. 'This is the first machine Mr. Moon ever bought. Even when the factory closed, he held on and didn’t sell it.' The four machinists wet their rags without a word. Then Hwang Hyewon, a loss adjuster (a person who investigates the damage from an insurance claim and sets the amount) from the group insurer KD General Insurance, walks in wearing rain boots. Holding a tablet, she opens with this. 'Please don’t touch the machines until the inspection is done. Damage is hard to prove on a machine that’s been cleaned.' Foreman Kim turns around, rag in hand. Wet steel rusts in 48 hours, and the inspection ends in three days. The Seon Medical delivery is eight days away.",
      "memo": [
        "6 lathes flooded -- muddy waterline at waist height",
        "About 48 hours until rust, 3 days until the damage inspection is done",
        "KD General Insurance: cleaning before inspection makes damage hard to prove",
        "Seon Medical parts delivery: D-8"
      ],
      "choices": {
        "c35_lathe_wipe": {
          "label": "Wipe down the machines now with the machinists to stop rust"
        },
        "c35_lathe_wait": {
          "label": "Keep everyone’s hands off the machines until the inspection ends"
        },
        "c35_lathe_order": {
          "label": "Pass the order to a partner factory to keep the delivery date"
        },
        "reframe": {
          "label": "Ask the reason three times over"
        },
        "c35_lathe_evidence_turn": {
          "label": "Open NOAH’s flood-loan rulings"
        }
      },
      "place": "To-the-End Precision, Namdong Industrial Complex, Incheon · Factory",
      "clock": "July 15 · After the Downpour · 14:00",
      "question": "Wipe now and you stop the rust; wait and you protect the insurance money. What do you do with the six lathes?",
      "lead": "You came the moment the water drained from the industrial complex access road. The factory floor is covered in silt that swallows you to the ankle."
    },
    "c35_noah": {
      "title": "Rejected Because You Flooded",
      "text": "The ticket numbers at the Gangseo Branch windows have passed 140. Mangwon Market merchants in wet sneakers stand in line with applications in hand. Tak Yerin at the corporate loan window turns her monitor toward you. Of the 41 emergency flood loans received since yesterday, NOAH, the AI review engine (an artificial-intelligence program that judges loan applications automatically), has rejected 38. The reason is one line. 'Flood-damaged business; sharp drop in repayment (paying back borrowed money) capacity expected.' To-the-End Precision and Gaeul Rice Cake Shop are both among the 38. Tak Yerin lowers her voice. 'A loan made to help people who flooded is being refused because they flooded.' At the next window, Do Yoonha, reading a rejection notice, stops at the second line. The signature field for an exception approval (approval outside the criteria, given by someone in charge who puts their name on it), where a person can overturn the result, is empty again.",
      "memo": [
        "Gangseo Branch: 38 of 41 emergency flood loans rejected -- 312 nationwide",
        "Reason: 'Flood-damaged business; sharp drop in repayment capacity expected'",
        "To-the-End Precision and Gaeul Rice Cake Shop both on the rejection list",
        "Exception approval signature field: empty"
      ],
      "choices": {
        "c35_noah_object": {
          "label": "File a formal objection to NOAH’s flood rejection criteria"
        },
        "c35_noah_sign": {
          "label": "I’ll put my name beside Tak Yerin’s exception approval"
        },
        "c35_noah_route": {
          "label": "Send the merchants straight to the government disaster fund desk"
        },
        "reframe": {
          "label": "Ask the reason three times over"
        },
        "c35_noah_evidence_turn": {
          "label": "Open NOAH’s flood-loan rulings"
        }
      },
      "place": "KD Bank Gangseo Branch · Windows",
      "clock": "July 16 · Monsoon · 10:00",
      "question": "38 emergency flood loans were rejected because the businesses flooded. What do you do about these rejections?",
      "lead": "On the branch banking hall floor, wet footprints lead all the way to the ticket machine."
    },
    "c35_final": {
      "title": "What Drowned Photos Are For",
      "text": "In the Mangwon Market merchants’ association office, three electric fans dry soaked ledgers. Department Head Tak Jihoon of the KD Bank head office review department sets down three documents. First, a special desk where people re-review the 38 cases NOAH rejected. There aren’t enough reviewers, so it takes 3 weeks. Second, a formal complaint to the Financial Supervisory Service challenging NOAH’s disaster criteria. The nationwide criteria could change, but it takes months. Third, a consent form saying the merchants hand over their damage photos and insurance inspection records as NOAH’s training data (the material an AI uses to learn its judgments). If they sign, NOAH is retrained and the loans go out within three days. Leafing through the consent form, Ahn Gibeom asks, 'So we use photos of ourselves underwater to teach it how to reject the next people who go under?' Moon Gaeul looks out the window instead of answering. The Seon Medical delivery is five days away.",
      "memo": [
        "Special desk: 38 cases re-reviewed by people -- 3 weeks",
        "FSS complaint: nationwide disaster loan criteria -- months",
        "Training data consent form: loans within three days if signed",
        "This choice leads to the table in Hannam-dong"
      ],
      "choices": {
        "c35_final_desk": {
          "label": "Sit at the special review desk and go case by case from today"
        },
        "c35_final_consent": {
          "label": "Collect the photo consent forms and free the loans in three days"
        },
        "c35_final_appeal": {
          "label": "Formally challenge NOAH’s disaster criteria with the FSS"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Mangwon Market Merchants’ Association Office · Meeting Room",
      "clock": "Saturday, July 18 · End of the Monsoon · 10:00",
      "question": "3 weeks of human review, months of complaint, a three-day consent form. Which document do you pick up?",
      "lead": "On a morning when the rain has thinned, every step up to the association office still carries a waterline at waist height."
    },
    "c35_aftershock": {
      "title": "Rice Cakes on a Clear Day",
      "text": "The rain stops, and the sun comes out for the first time in eight days. In front of Gaeul Rice Cake Shop, merchants line up dried steamers and borrowed steam pots. When the rice cake machine that went under and came back gives its first puff of steam, the alley breaks into applause. Grandma Ha from Ha’s Oil Mill drizzles the sesame oil she pressed over the injeolmi, and Ahn Gibeom, secretary of the merchants’ association, renames his live stream 'Mangwon Market Open Again.' The pink flowered boots Kwon Dohyun bought at the hardware store that night now hang on a nail beside the shop sign, and the grandmothers call him 'the young man in the flower boots.' Moon Gaeul sets a steaming tray of rice cakes in front of you. 'This is for the people who bailed out water. Not for the bank people.' Then Tak Yerin from Gangseo Branch texts. 'I heard it at head office. The chairman had Ahn Gibeom’s live video playing in the secretariat. He paused it on the part where your face shows.'",
      "memo": [
        "First day without rain -- rice cake machine running again",
        "Market merchants share rice cakes, every volunteer included",
        "Kwon Dohyun’s flower boots: hung beside the shop sign",
        "Tak Yerin: the chairman watched the market live video in the secretariat"
      ],
      "choices": {
        "c35_after_rush": {
          "label": "The moment the rain stops, take the rejection records to the prosecutors"
        },
        "c35_after_record": {
          "label": "Submit NOAH’s 312 rejections in writing to Compliance"
        },
        "c35_after_warm": {
          "label": "Stay with the market people until the last sandbag"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market · Out front",
      "clock": "July 19 · Clear Afternoon",
      "question": "As rice cakes go round, word comes that Chairman Seo Dokyung paused on your face in the market video. How do you close this afternoon?"
    },
    "c35_elder": {
      "title": "The Machine My Old Man Bought",
      "text": "3 in the morning, the innermost alley, water up to the shins. Grandma Ha of Ha’s Oil Mill, who has pressed sesame oil for 43 years, is holding out inside her shop with the shutter half down. If the press goes under, it’s over, she says, and she has climbed up and sat on top of the machine. Ahn Gibeom switches off his live stream and kneels in the water. 'Grandma, you can buy another machine.' She laughs. 'My old man bought me this. You don’t buy another.' The district office evacuation text arrives for the third time. Kang Taemin pushes himself under the shutter and looks back at you.",
      "memo": [
        "Ha’s Oil Mill, 43 years -- Grandma Ha sitting on her press",
        "District office evacuation texts: 3",
        "Water level in the alley: shins, rising a hand’s width every 10 minutes"
      ],
      "choices": {
        "c35_elder_choice_1": {
          "label": "Talk Grandma Ha round and carry her out on your back"
        },
        "c35_elder_choice_2": {
          "label": "Call 119 and evacuate her by the proper procedure"
        },
        "c35_elder_choice_3": {
          "label": "Sandbag around the press and stay at her side"
        }
      },
      "place": "Mangwon Market · Innermost Alley",
      "clock": "July 15 · Downpour · 03:00",
      "question": "Grandma Ha won’t come down off the press her husband bought her. What do you do?"
    },
    "c35_rust": {
      "title": "Keep Turning to the End",
      "text": "10 at night, and only the generator is making noise in the factory. Moon Hajun, a 3rd-year high school student who has just finished his final exams, rolls up his school uniform trousers and picks up a can of rust-preventive oil (oil applied so steel doesn’t rust). A clump of mud falls away from the side of the third lathe, and marker writing appears. 'Keep turning to the end -- Moon Sungho.' Hajun looks at the writing for a long time. 'Dad said this to the machines too.' Foreman Kim turns his back and blows his nose. Hajun starts to take a photo on his phone, then stops and asks, 'I shouldn’t wipe this off, right? But the inspector said to leave everything exactly as it was.'",
      "memo": [
        "Side of the third lathe: Moon Sungho’s marker writing",
        "Moon Hajun came straight to the factory the day exams ended",
        "Time left for rust prevention: about 20 hours"
      ],
      "choices": {
        "c35_rust_choice_3": {
          "label": "Just photograph the writing and wipe every machine tonight"
        },
        "c35_rust_choice_2": {
          "label": "Leave the writing as it is in the damage inspection record"
        },
        "c35_rust_choice_1": {
          "label": "Remove the side panel with the writing, then clean the machine"
        }
      },
      "place": "To-the-End Precision, Namdong Industrial Complex, Incheon · At the Lathes",
      "clock": "July 15 · Monsoon · 22:00",
      "question": "Moon Sungho’s writing has surfaced under the mud. What do you do with writing on a machine that has to be cleaned?"
    },
    "c35_weight": {
      "text": "3 in the afternoon, a video call connects to KD Data Lab in Pangyo. Ryu Seah, a label printer hanging from her neck, brings up NOAH’s judgment records. The 'disaster exposure' weight (a value that sets how heavily a condition counts) is 0.41. That is bigger than all the other items put together. NOAH learned this value from the records of businesses hit by the floods of summer 2020. That year, 31% of flood-hit businesses closed within 1 year. Ryu Seah sticks a label on one line of the record. 'But the reason they closed was that the banks turned down every extra loan that year. NOAH learned how to reject by watching the records of rejected people falling apart.'",
      "memo": [
        "'Disaster exposure' weight 0.41 -- bigger than all other items combined",
        "Learned from: records of businesses hit by the summer 2020 floods",
        "31% closed that year -- most after extra loans were refused"
      ],
      "choices": {
        "c35_weight_choice_2": {
          "label": "Request a weight change with Ryu Seah through official channels"
        },
        "c35_weight_choice_3": {
          "label": "Ask Ryu Seah to switch that weight off just for this week"
        },
        "c35_weight_choice_1": {
          "label": "Go and explain this in person to the 38 who were rejected"
        }
      },
      "place": "KD Bank Gangseo Branch · Meeting Room",
      "clock": "July 16 · Monsoon · 15:00",
      "question": "NOAH learned to reject from the records of rejected people falling apart. What do you do about this weight?"
    },
    "c35_elder_reaction": {
      "title": "One Night’s Score",
      "text": "When you get out of the alley, there’s a message from Lee Minseo. It’s a photo of KD Data Lab’s night monitor. 'Six hours after the downpour began, NOAH cut the credit scores of business owners all over Mangwon-dong and the Namdong Industrial Complex, one after another. Reason: disaster-exposure area. Nobody has even applied for a loan yet, and it has already finished getting ready to reject them.' Below the photo you can see the business registration number of Gaeul Rice Cake Shop. It dropped 187 points overnight. Lee Minseo sends one more line. 'I’m not supposed to see this screen. I’m sending it anyway.'",
      "memo": [
        "Scores that dropped before anyone applied",
        "A screen she shouldn’t see"
      ],
      "choices": {
        "c35_elder_reaction_choice_3": {
          "label": "Just keep the screen photo for later"
        },
        "c35_elder_reaction_choice_2": {
          "label": "Send Ryu Seah a formal written objection"
        },
        "c35_elder_reaction_choice_1": {
          "label": "Tell the merchants about this right now"
        }
      },
      "place": "Mangwon Market · Arcade Entrance",
      "clock": "July 15 · Downpour · 03:40",
      "question": "NOAH lowered the whole market’s scores before taking a single application. How do you use this screen?"
    },
    "c35_rust_reaction": {
      "title": "Because It’s a Natural Disaster",
      "text": "Around midnight, Hwang Hyewon calls you over from her car in front of the factory. Head office guidance is up on her tablet. 'Among damage from this heavy rain, treat business interruption riders (extra promises bought on top of the basic policy) separately. Review the natural disaster exclusion (cases where the insurer does not have to pay) clause first.' That rider is exactly what To-the-End Precision paid extra for in the spring. Hwang Hyewon rests her forehead on the steering wheel. 'The rider is called “Natural Disaster Business Loss Cover.” And I’m the one who has to read you a notice saying you don’t get paid because it was a natural disaster.'",
      "memo": [
        "A natural disaster exclusion on a rider that covers natural disasters",
        "A notice she has to read out to you"
      ],
      "choices": {
        "c35_rust_reaction_choice_1": {
          "label": "Show the notice as it is to Moon Gaeul and the co-op members"
        },
        "c35_rust_reaction_choice_2": {
          "label": "Go through the notice’s supporting clauses with Hwang Hyewon"
        },
        "c35_rust_reaction_choice_3": {
          "label": "Set the notice aside so at least the machine payout comes first"
        }
      },
      "place": "Namdong Industrial Complex, Incheon · Factory Parking Lot",
      "clock": "July 15 · Monsoon · 23:50",
      "question": "A notice says to check the natural disaster exclusion first on a rider that covers natural disasters. What do you do?"
    },
    "c35_weight_reaction": {
      "title": "The Man Who Ran Off With the Seal",
      "text": "9 at night, under the eaves of the Gangseo Branch rooftop. Na Junhyuk calls from Yeongdong. He saw Mangwon Market on the news. 'When I was a new hire, there was a summer the Han River banks overflowed. The branch manager wrapped his seal and ink pad in plastic and went to the gym they were using as a shelter. He took the applications from the people in line right there. He reviewed them by looking at their faces.' He laughs. 'That man’s nickname was “the guy who ran off with the seal.” Head office went into an uproar.' The laughter fades. 'Of the people who borrowed back then, two didn’t pay it back. Two. The machine doesn’t know that number.'",
      "memo": [
        "A seal in a shelter gym",
        "Two people who didn’t pay back"
      ],
      "choices": {
        "c35_weight_reaction_choice_3": {
          "label": "Put the old stories aside and sort out tomorrow’s desk schedule"
        },
        "c35_weight_reaction_choice_1": {
          "label": "Propose going to the shelters to take applications in person"
        },
        "c35_weight_reaction_choice_2": {
          "label": "Find that summer’s loan records and set them beside NOAH’s criteria"
        }
      },
      "place": "KD Bank Gangseo Branch · Rooftop",
      "clock": "July 16 · Monsoon · 21:00",
      "question": "In the summer the branch manager took his seal to a shelter, two people didn’t pay back. How do you use that story?"
    },
    "c35_branch_cellar": {
      "title": "The Fourth Step of the Cellar",
      "text": "While you are hauling sandbags, Moon Gaeul grabs your arm and pulls. The water on the stairs down to the storeroom behind Gaeul Rice Cake Shop has reached the fourth step. In the storeroom are forty sacks of glutinous rice for the autumn rush, and six boxes of Gaon Precision ledgers her husband left behind. Page by page, the ledgers record payments for deliveries to FlowOn that were never made. They are evidence for the class action (a lawsuit filed jointly by many victims) whose first hearing is next month. Moon Gaeul stops halfway down the stairs. 'We can’t bring up both. Before the water reaches our knees, one trip, two at most.' From above, Moon Hajun shines a flashlight. In its beam, the rice sacks and the ledger boxes soak side by side.",
      "memo": [
        "Storeroom stairs flooded to the 4th step",
        "40 sacks of glutinous rice -- stock for the autumn rush",
        "6 boxes of Gaon Precision ledgers -- class action evidence",
        "Trips possible: one or two"
      ],
      "choices": {
        "c35_branch_cellar_books": {
          "label": "Bring up the ledger boxes first to save the lawsuit evidence"
        },
        "c35_branch_cellar_rice": {
          "label": "Bring up the rice sacks first to save the shop’s autumn"
        },
        "c35_branch_cellar_leave": {
          "label": "Leave the storeroom to insurance and get the people up first"
        }
      },
      "place": "Mangwon Market Gaeul Rice Cake Shop · Basement Storeroom",
      "clock": "July 15 · Downpour · 02:10",
      "question": "Forty sacks of glutinous rice or six boxes of lawsuit ledgers, one load at a time. What do you bring up?"
    },
    "c35_branch_cellar_follow": {
      "title": "22 Hair Dryers",
      "text": "2:40 in the morning, the 2nd floor of the merchants’ association office. Ahn Gibeom posted one line on his live stream, 'Need hair dryers to dry wet paper,' and within 20 minutes three market hair salons and people from the neighborhood came up carrying 22 hair dryers. Wet ledgers are spread across every desk, and Moon Hajun turns them a page at a time, blowing air on each. Then he stops at one page. In the margin is her husband’s handwriting. 'Money owed -- collect it to the end.' Moon Gaeul looks at that page for a long time. 'He only went to the end when it came to writing down what he was owed. He never once managed to ask for it.' Over the noise of the dryers, Ahn Gibeom asks, 'Is it the original that matters, or what’s written on it?'",
      "memo": [
        "22 hair dryers -- 3 salons and local residents",
        "Ledger margin: 'Money owed -- collect it to the end'",
        "Time to save the wet paper originals: about 12 hours",
        "First class action hearing next month"
      ],
      "choices": {
        "c35_branch_cellar_follow_scan": {
          "label": "Photograph every page and make copies for the court first"
        },
        "c35_branch_cellar_follow_dry": {
          "label": "Dry the originals page by page all night with Moon Gaeul’s family"
        },
        "c35_branch_cellar_follow_hand": {
          "label": "Leave the ledgers with a restoration firm and go back to the alley"
        }
      },
      "place": "Mangwon Market Merchants’ Association Office · 2nd Floor",
      "clock": "July 15 · Downpour · 02:40",
      "question": "'Collect it to the end' survives in a wet ledger’s margin. How do you save this paper?"
    },
    "c35_route_system": {
      "title": "Why It Goes Round in a Circle",
      "text": "After the water drains, the emergency flood loans are rejected one after another. You don’t pick a desk. You decide to ask NOAH the reason behind the reason, three times over. NOAH’s test screen, which Ryu Seah left open, answers. 'Why are emergency flood loans rejected?' NOAH writes in 0.2 seconds. 'Because the 1-year delinquency (passing the date when payment is due) rate of borrowers (people who borrowed money) in disaster areas is 4.2 times the average.' You ask again. 'Why did those borrowers fall delinquent?' 'Because they lacked operating funds.' 'Why did they lack operating funds?' For the first time NOAH takes 1.4 seconds. 'Because extra loans were rejected.' Ryu Seah captures the screen. 'NOAH learned the very reason emergency loans have to exist as a reason to reject them. Cause and effect go round in a circle and prove each other.'",
      "memo": [
        "NOAH’s answer: disaster-area delinquency 4.2 times the average",
        "First delay, 1.4 seconds, at the third question",
        "Last answer: 'Because extra loans were rejected'"
      ],
      "choices": {
        "c35_route_system_drop": {
          "label": "Shelve the capture and untangle the rejections one by one"
        },
        "c35_route_system_rule": {
          "label": "Demand a rule that disaster loans always get human review"
        },
        "c35_route_system_publish": {
          "label": "Publish the circular explanation to the merchants and the press"
        },
        "c35_route_system_evidence_turn": {
          "label": "Open NOAH’s flood-loan rulings"
        }
      },
      "place": "KD Data Lab · Server Room",
      "clock": "July 17 · Monsoon",
      "question": "NOAH’s reason for rejecting goes round and comes back to where it started. What do you do with this explanation?"
    },
    "c35_final_system_route": {
      "title": "The Fourth Question",
      "text": "Dawn, July 18. On the server room test screen, three questions and three answers remain, one above the other. Ryu Seah types a fourth question. 'Why were those extra loans rejected?' The cursor blinks for a long time, then the first answer comes up again, word for word. Ryu Seah, her wet umbrella hung on the chair, says, 'Ask it more and it comes back to the same place. The rejection texts the Mangwon Market people got came out of this answer too. Maybe what we taught the machine wasn’t how to reject, but how to come back round.'",
      "memo": [
        "NOAH’s explanation: ask three times and it returns to the first answer",
        "Emergency flood loans rejected -- 312 nationwide",
        "Five days until the Seon Medical delivery"
      ],
      "choices": {
        "c35_final_system_route_c": {
          "label": "Take flood loans out of NOAH’s review for the monsoon"
        },
        "c35_final_system_route_b": {
          "label": "Leave NOAH’s results and cover the damage with group donations"
        },
        "c35_final_system_route_a": {
          "label": "Add a field to disaster loan rejections that traces the cause back"
        }
      },
      "place": "KD Data Lab · Server Room",
      "clock": "July 18 · Monsoon · Dawn",
      "question": "Even at the fourth question, NOAH comes back to its first answer. Where in that loop do you put a person?"
    },
    "c35_evidence_turn": {
      "title": "4 Minutes of Dissent",
      "text": "When you lay out the clues in order of rejection time, a request opens: a request to add a 'disaster exposure' weight (a value that sets how heavily a condition counts) to NOAH. The requesting department is KD Capital Risk Management, and the request date is one week before you came to this department. The approval field is blank. Lee Minseo opens that field’s edit history. It wasn’t blank from the start. Someone wrote, 'Dissent. The people who report damage get rejected first.' 4 minutes later the line was deleted. The person who wrote it is the assistant manager at the desk next to yours. The person who, for nearly four months, has greeted you first every morning. Lee Minseo points at an attachment. It is an agreement to pass KD General Insurance’s list of heavy-rain damage claims to NOAH every 6 minutes. 'The assistant manager attached this too. After the line was deleted. So that someone would find it.'",
      "memo": [
        "Requesting department: KD Capital Risk Management -- approval field blank",
        "Request date: one week before you joined the department",
        "Approval field edit history: 'Dissent' from the desk next to yours, deleted 4 minutes later",
        "Insurance damage claim list → NOAH, sent every 6 minutes"
      ],
      "choices": {
        "c35_evidence_turn_reveal": {
          "label": "Make the request public as it is, deleted dissent included"
        },
        "c35_evidence_turn_share": {
          "label": "Tell the merchants who filed insurance claims about this link first"
        },
        "c35_evidence_turn_quiet": {
          "label": "Quietly get the request withdrawn and hold off on going public"
        }
      },
      "place": "KD Capital Risk Management · Records Room",
      "clock": "July 18 · Monsoon · 07:00",
      "question": "The person who wrote dissent in the blank approval field and left the clue was at the next desk. How do you use this request?"
    },
    "c35_start_warm": {
      "title": "The Group Chat After the Peaches",
      "text": "Since the evening you read Yoon Seojin’s notebook copy to the end together in the Sinchon lab and emptied a box of peaches, your colleagues have posted one line in the group chat every night: 'Safe today.' The rain began at the weekend, and tonight, the fourth day, that group chat won’t stop buzzing. A downpour of 110mm an hour. The alleys of Mangwon Market are ankle-deep, and muddy water is seeping under the shutter at To-the-End Precision in Incheon. Do Yoonha calls. 'Questions about emergency flood loans will pour in tomorrow morning. But those loans are reviewed by NOAH now, the AI review engine (an artificial-intelligence program that judges loan applications automatically).' A line from Kang Taemin comes up in the group chat. 'Got a truck of sandbags.' Yoon Seojin adds one too. 'Use the empty peach box for the sand.'",
      "memo": [
        "Group chat 'Safe today', day eight -- broken tonight",
        "Mangwon Market and To-the-End Precision flooding at once",
        "Kang Taemin: has a truck loaded with sandbags; Yoon Seojin is in the group chat too"
      ],
      "choices": {
        "c35_start_warm_photo": {
          "label": "Tell the merchants to record the time and photos of damage first"
        },
        "c35_start_warm_file": {
          "label": "File all the emergency loan applications overnight in one go"
        },
        "c35_start_warm_signature": {
          "label": "Gather the group chat into Kang Taemin’s truck and rush there together"
        },
        "c35_start_warm_go": {
          "label": "Load sandbags and head for Mangwon Market"
        },
        "c35_start_warm_reframe": {
          "label": "Ask the reason three times over"
        }
      },
      "place": "KD Capital Risk Management · Situation Board",
      "clock": "July 14 · Downpour · 23:40",
      "question": "The group chat where 'Safe today' has stopped won’t stop buzzing. Who do you go with, and where?",
      "lead": "Eight days since you shared a box of peaches in the Sinchon lab, and 'Safe today' has not missed a single day in the group chat."
    },
    "c35_start_record": {
      "title": "After the Two-Page Account",
      "text": "Eight days since you left the two-page account of where and how the notebook came out, you have stayed late in Risk Management every night, cross-checking the retention records of group documents. That document, where you signed your name too so the field beside Yoon Seojin’s signature wouldn’t be blank, is in your drawer. Tonight the situation board beside your monitor bleeds red. A downpour of 110mm an hour; Mangwon Market and the Namdong Industrial Complex in Incheon are going under. Lee Minseo messages you. 'Emergency flood loans are reviewed by NOAH, the AI review engine (an artificial-intelligence program that judges loan applications automatically), too. But NOAH’s judgment records are only kept for 72 hours. The rejection reasons disappear after three days.'",
      "memo": [
        "Eight days since you left the account of the notebook",
        "NOAH judgment record retention: 72 hours",
        "Situation board: heavy rain in western Seoul and southeastern Incheon"
      ],
      "choices": {
        "c35_start_record_file": {
          "label": "File all the emergency loan applications overnight in one go"
        },
        "c35_start_record_photo": {
          "label": "Tell the merchants to record the time and photos of damage first"
        },
        "c35_start_record_go": {
          "label": "Load sandbags and head for Mangwon Market"
        },
        "c35_start_record_signature": {
          "label": "Request a longer retention period for NOAH’s judgment records first"
        },
        "c35_start_record_reframe": {
          "label": "Ask the reason three times over"
        }
      },
      "place": "KD Capital Risk Management · Situation Board",
      "clock": "July 14 · Downpour · 23:40",
      "question": "NOAH’s rejection reasons will vanish in three days. Water or records: which do you grab first?",
      "lead": "Your hand, putting the copy of the account in the drawer and turning the pages of the retention cross-check, stops at the alarm from the situation board."
    },
    "c35_start_rush": {
      "title": "The Shutter of the One Who Came First",
      "text": "Eight days since the night you held the copy, chased the trace that line left in the system, and reread Kang Taemin’s text, you have loaded sandbags after work every day, stopped at To-the-End Precision in Incheon, and cleared the blocked drain with Kang Taemin. The half-peeled peach you left in the lab hasn’t crossed your mind since. Tonight a downpour of 110mm an hour is falling, and beyond the sandbags, muddy water is spilling under the shutter. Seven missed calls, all Moon Gaeul. When you call back, you hear the rain first. 'They said you were looking after the factory. The water’s over my shop doorstep.' A pause. 'Of all the bank people, you’re the only one I can call.' There are 20 sandbags left over in your car trunk. From tomorrow, NOAH, the AI review engine (an artificial-intelligence program that judges loan applications automatically), reviews flood loans at the windows.",
      "memo": [
        "Moon Gaeul: 7 missed calls",
        "Flooding under the To-the-End Precision shutter -- sandbags at their limit",
        "Water over the Gaeul Rice Cake Shop doorstep; flood loan reviews: NOAH"
      ],
      "choices": {
        "c35_start_rush_signature": {
          "label": "Leave the factory to Foreman Kim and run to Moon Gaeul’s shop"
        },
        "c35_start_rush_file": {
          "label": "File all the emergency loan applications overnight in one go"
        },
        "c35_start_rush_photo": {
          "label": "Tell the merchants to record the time and photos of damage first"
        },
        "c35_start_rush_go": {
          "label": "Load sandbags and head for Mangwon Market"
        },
        "c35_start_rush_reframe": {
          "label": "Ask the reason three times over"
        }
      },
      "place": "To-the-End Precision, Namdong Industrial Complex, Incheon · Factory",
      "clock": "July 14 · Downpour · 23:40",
      "question": "After seven missed calls, Moon Gaeul says you’re the only one she has. What do you put down?",
      "lead": "You straighten up in front of the drain you’ve been clearing for eight days, and the same name is on your phone screen seven times."
    }
  },
  "echoReplies": {
    "c35_start_go": "You set off with 20 sandbags in the trunk, and Olympic-daero is already closed. You walk the last 1km.",
    "c35_start_photo": "The photos the merchants take become evidence later. While they take them, the water rises another hand’s width.",
    "c35_start_file": "The applications pile up in the intake queue. At 9 in the morning, when the windows open, they are all received at once, and NOAH reads them all at once too.",
    "c35_sandbag_alley": "A sandbag dike rises in front of the eleven shops in the alley. As the basement power room floods, 30 freezers in the market stop at 4 in the morning.",
    "c35_sandbag_power": "The power survives. The grandmothers of the lowest alley watch their shops go under with the lights still on.",
    "c35_sandbag_gate": "The 20 shops on the main road open their doors. The rice cake alley floods to the knee, and Ahn Gibeom’s live stream points its camera at that alley.",
    "c35_lathe_wipe": "You start wiping, beginning with the first lathe. Hwang Hyewon types 'unauthorized cleaning before inspection' on her tablet, and no one knows yet how many tenths that one line will cut from the payout.",
    "c35_lathe_wait": "The inspection gets more accurate. Foreman Kim can’t put down his rag, and keeps scratching the wet lathe spindle with his fingernail.",
    "c35_lathe_order": "The delivery date is kept. The partner factory swaps business cards with the Seon Medical contact, and Foreman Kim turns his head so he doesn’t have to watch.",
    "c35_noah_sign": "Two names appear in the signature field. That afternoon the head office review department asks each of you for a separate 'statement of reasons for exception approval.'",
    "c35_noah_object": "The objection is received. The deadline for handling it is 30 days, and the merchants’ freezers can’t wait 30 days.",
    "c35_noah_route": "Government funds have low interest and a lot of paperwork. Grandma Ha wipes her reading glasses twice in front of the application.",
    "c35_final_desk": "On the first day of the special desk you look at 11 cases. On each one you measure the water level in the photos with your finger, and at 9 at night you switch off the light.",
    "c35_final_appeal": "The complaint is received. The criteria may change nationwide by the next monsoon, but the 38 from this monsoon are still waiting.",
    "c35_final_consent": "The loans go out in three days. NOAH has learned Mangwon Market’s water level, and it will remember that level in the next monsoon.",
    "c35_after_warm": "As the last sandbag is loaded onto the truck, Kwon Dohyun puts the flower boots back on and picks up a shovel. No one brings up the chairman’s office that night.",
    "c35_after_record": "The names of 38 Mangwon Market shops go on the first page of the 312 cases. Moon Gaeul presses her rice cake stamp beside the name Gaeul Rice Cake Shop. Who will read that report first is still unknown.",
    "c35_after_rush": "As you get up and leave the rice cake tray, Moon Gaeul hands your share to Ahn Gibeom behind your back. On a Sunday the prosecutors’ office civil petition room is shut, and only one window at the duty office has its light on.",
    "c35_elder_choice_1": "Carried out on your back, Grandma Ha looks back from the end of the alley. From behind the shutter comes the sound of the press going under.",
    "c35_elder_choice_2": "The rescue team arrives 40 minutes later. Meanwhile the water rises four hand’s widths, and Grandma Ha is carried out on a stretcher by the procedure.",
    "c35_elder_choice_3": "The press survives. Kang Taemin, staying by Grandma Ha, stands in waist-deep water until 5 in the morning.",
    "c35_rust_choice_1": "The removed side panel goes onto Hajun’s desk. The inspection record gains one line: 'some parts detached.'",
    "c35_rust_choice_2": "The writing in the record photo goes onto page 17 of the inspection report. Meanwhile the first rust blooms on the third lathe’s spindle.",
    "c35_rust_choice_3": "The machines escape the rust. The writing, wiped away with the mud, now exists only in the photo album on Hajun’s phone.",
    "c35_weight_choice_1": "The merchants are angry when they hear it. Not at the machine, but at the bank that trusted it.",
    "c35_weight_choice_2": "The request goes up to KD Data Lab’s change review. The next review is the first week of August.",
    "c35_weight_choice_3": "Ryu Seah is quiet for a long time, then answers, 'Then I’d be making a judgment I can’t explain, just like NOAH.'",
    "c35_elder_reaction_choice_1": "Ahn Gibeom reads that screen out on his live stream. 4,000 viewers open their bank apps at the same moment. Lee Minseo’s access log is left behind as well.",
    "c35_elder_reaction_choice_2": "The written objection is only received at 9 in the morning. At the same hour, the people standing at the windows are already being reviewed on lowered scores.",
    "c35_elder_reaction_choice_3": "The photo stays on your phone. When day breaks, the merchants line up at the windows knowing nothing.",
    "c35_rust_reaction_choice_1": "Moon Gaeul laughs when she sees the notice. When something is absurd enough, she says, you laugh. Hwang Hyewon remembers that laugh for a long time.",
    "c35_rust_reaction_choice_2": "Set article 12 of the policy terms beside the notice, and the exclusion clause never once mentions heavy rain. Arguing it out takes three days.",
    "c35_rust_reaction_choice_3": "The machine payout comes quickly. The losses from the days the factory stood still are claimed on no form at all.",
    "c35_weight_reaction_choice_1": "Na Junhyuk laughs. 'I’ll bring the application tablet. This time let’s walk, not run off.'",
    "c35_weight_reaction_choice_2": "That summer’s ledger turns up in a pile of paper at the secondhand bookshop. Beside the names of the two who couldn’t repay is a stamp: 'disaster deferral.'",
    "c35_weight_reaction_choice_3": "The schedule gets tidy. Before hanging up, Na Junhyuk says, a little late, 'Right, these days have their own way of doing things.'",
    "c35_branch_cellar_rice": "Forty sacks of glutinous rice come up the stairs. The six ledger boxes rescued on the second trip down have soaked up water and weigh twice as much.",
    "c35_branch_cellar_books": "The ledger boxes come up. The rice sacks soak through, and Moon Gaeul quietly tears up one autumn-rush order form.",
    "c35_branch_cellar_leave": "Everyone gets up safely. In the arms of Moon Hajun, the last to come up, is one waterlogged ledger box. What stays in the storeroom becomes one line on an insurance form.",
    "c35_branch_cellar_follow_dry": "The hair dryers run until sunrise. Even after you go back down at the alley’s call, Moon Hajun keeps turning pages one by one until he falls asleep face-down on the desk.",
    "c35_branch_cellar_follow_scan": "1,140 copies are made. The court accepts copies, but the writing in the margin grows a little blurred in the photos.",
    "c35_branch_cellar_follow_hand": "The firm says it will return the ledgers in 3 weeks. The day right before the first hearing.",
    "c35_route_system_publish": "The capture airs on the afternoon news. That night KD Data Lab blocks all access to NOAH’s test screen.",
    "c35_route_system_rule": "The rule is accepted. There are only two human reviewers, so a single disaster loan takes two days.",
    "c35_route_system_drop": "The rejections are untangled one by one. The circular explanation goes on circling into the next monsoon.",
    "c35_final_system_route_a": "Once the field exists, NOAH stops at the fourth question. Where it stops, a person has to write the answer.",
    "c35_final_system_route_b": "The donation press release goes out, and the chairman in the photo lifts a sandbag. Not one line of NOAH’s criteria changes.",
    "c35_final_system_route_c": "During the monsoon NOAH does not review flood loans. Not even the weather service knows yet when the monsoon will end.",
    "c35_evidence_turn_reveal": "The request and the deleted line appear together in an article. The next morning, your colleagues in Risk Management pass your desk without greeting you. Only the assistant manager at the next desk greets you first, as always.",
    "c35_evidence_turn_quiet": "The request is withdrawn without a sound. The weight comes down. Who put it in, and who tried to stop it, are buried together.",
    "c35_evidence_turn_share": "The merchants learn that their insurance claims led to their loan rejections. A few say they will cancel their claims, and you talk them out of it.",
    "c35_sandbag_evidence_turn": "When you line up the times, it comes out who put those criteria in. Who tried to stop it comes out too.",
    "c35_lathe_evidence_turn": "When you line up the times, it comes out who put those criteria in. Who tried to stop it comes out too.",
    "c35_noah_evidence_turn": "When you line up the times, it comes out who put those criteria in. Who tried to stop it comes out too.",
    "c35_route_system_evidence_turn": "When you line up the times, it comes out who put those criteria in. Who tried to stop it comes out too.",
    "case35_memory_system": "Ask all the way down and NOAH’s answer goes round in a circle. At the third question it takes over 1 second for the first time.",
    "case35_memory_evidence": "Lay the output records over the review records and you can read the department that asked for the criteria. You can also read the line deleted from the same request’s approval field.",
    "c35_start_warm_go": "You set off with 20 sandbags in the trunk, and Olympic-daero is already closed. You walk the last 1km.",
    "c35_start_warm_photo": "The photos the merchants take become evidence later. While they take them, the water rises another hand’s width.",
    "c35_start_warm_file": "The applications pile up in the intake queue. At 9 in the morning, when the windows open, they are all received at once, and NOAH reads them all at once too.",
    "c35_start_warm_signature": "Six people climb into the truck bed with the sandbags. Kwon Dohyun suggests splitting the cost of the raincoats, and gets handed one more raincoat by Kang Taemin.",
    "c35_start_record_go": "You set off with 20 sandbags in the trunk, and Olympic-daero is already closed. You walk the last 1km.",
    "c35_start_record_photo": "The photos the merchants take become evidence later. While they take them, the water rises another hand’s width.",
    "c35_start_record_file": "The applications pile up in the intake queue. At 9 in the morning, when the windows open, they are all received at once, and NOAH reads them all at once too.",
    "c35_start_record_signature": "The request is received after midnight. The rejection reasons won’t vanish, but in exchange you reach the market later than the sandbag truck.",
    "c35_start_rush_go": "You set off with 20 sandbags in the trunk, and Olympic-daero is already closed. You walk the last 1km.",
    "c35_start_rush_photo": "The photos the merchants take become evidence later. While they take them, the water rises another hand’s width.",
    "c35_start_rush_file": "The applications pile up in the intake queue. At 9 in the morning, when the windows open, they are all received at once, and NOAH reads them all at once too.",
    "c35_start_rush_signature": "Foreman Kim says, 'We’ll watch the factory,' and pushes you out the door. Kang Taemin shoulders the leftover sandbags and follows, and when you step into the shop, Moon Gaeul tosses you an apron instead of saying thank you."
  },
  "choiceVoiceLines": {
    "c35_start_go": "Saying paperwork won’t stop water, you load sandbags and head for Mangwon Market.",
    "c35_start_photo": "Saying the evidence drains away with the water, you tell the merchants to record the time and photos of damage first.",
    "c35_start_file": "Saying you have to be ahead of the morning line at the windows, you file all the emergency loan applications overnight in one go.",
    "c35_sandbag_alley": "Because the slowest people are where the water reaches first, you block the lowest alley, where the elderly owners’ shops crowd together.",
    "c35_sandbag_power": "Saying every fridge in the market dies if the power goes, you block the basement power room first, as the district disaster manual says.",
    "c35_sandbag_gate": "Saying that if you can protect only one place you pick the most shops, you stack them all at the entrance and save the 20 shops on the main road.",
    "c35_lathe_wipe": "Saying rust in 48 hours is scarier than the insurance money, you wipe down the machines now with the machinists to stop the rust.",
    "c35_lathe_wait": "Told that damage is hard to prove on a cleaned machine, you keep everyone’s hands off the machines until the inspection ends.",
    "c35_lathe_order": "Saying Seon Medical’s eight days run on even if the machines stand still, you pass the order to a partner factory to keep the delivery date.",
    "c35_noah_sign": "So the window clerk isn’t left to fill the empty signature field alone, I put my name beside Tak Yerin’s exception approval.",
    "c35_noah_object": "Saying 38 rejections with a one-line reason is a problem with the criteria, you file a formal objection to NOAH’s flood rejection criteria.",
    "c35_noah_route": "Saying you can’t keep a line of 140 standing any longer, you send the merchants straight to the government disaster fund desk.",
    "c35_final_desk": "Saying that if a shortage of reviewers means 3 weeks, even one more person helps, you sit at the special human review desk yourself and go case by case from today.",
    "c35_final_appeal": "Saying the criteria must change if you think of the next people to go under, you formally challenge NOAH’s disaster criteria with the FSS.",
    "c35_final_consent": "Saying there are only five days until the Seon Medical delivery, you collect the photo consent forms and get the loans freed in three days.",
    "c35_after_warm": "Having accepted the rice cakes meant for the people who bailed out water, you stay with the market people until the last sandbag is cleared.",
    "c35_after_record": "To keep a record inside the company of rejections that ended with a one-line reason, you compile NOAH’s 312 flood loan rejections in writing and submit them to Compliance.",
    "c35_after_rush": "Saying someone has to answer even for a rejection a machine made, you take the rejection records straight to the prosecutors’ office the moment the rain stops.",
    "c35_elder_choice_1": "Because the water is rising a hand’s width every 10 minutes, you talk Grandma Ha round and carry her out of the alley on your back.",
    "c35_elder_choice_2": "Saying it is already the third district evacuation text, you call 119 and evacuate Grandma Ha by the proper procedure.",
    "c35_elder_choice_3": "Unable to argue with a machine that can’t be bought again, you sandbag around the press and stay at Grandma Ha’s side.",
    "c35_rust_choice_1": "To save the writing and stop the rust both, you remove the side panel with the writing, set it aside, and clean the machine.",
    "c35_rust_choice_2": "Following the inspector’s word to leave everything as it was, you leave the writing as it is in the damage inspection record.",
    "c35_rust_choice_3": "Saying the first thing is to make the machines turn again, as the writing says, you just photograph the writing and wipe every machine tonight.",
    "c35_weight_choice_1": "Saying the people concerned should be the first to hear why they were rejected, you go to explain this in person to the 38 who were rejected.",
    "c35_weight_choice_2": "Saying a value bigger than all the rest combined must be changed with a record left behind, you request a weight change with Ryu Seah through official channels.",
    "c35_weight_choice_3": "Saying shops will close while the procedure runs, you ask Ryu Seah to switch that weight off just for this week.",
    "c35_elder_reaction_choice_1": "Saying they can’t be left to find out only when the rejection text arrives, you tell the merchants about this right now.",
    "c35_elder_reaction_choice_2": "Saying that lowering scores before taking applications has to be challenged through procedure, you send Ryu Seah a formal written objection.",
    "c35_elder_reaction_choice_3": "So that Lee Minseo, who sent it, doesn’t get hurt, you just keep the screen photo for later.",
    "c35_rust_reaction_choice_1": "Saying the people who paid can’t be the last to know, you show the notice as it is to Moon Gaeul and the co-op members.",
    "c35_rust_reaction_choice_2": "Saying the rider’s name and the exclusion clause contradict each other, you go through the notice’s supporting clauses with Hwang Hyewon.",
    "c35_rust_reaction_choice_3": "So that at least the machine payout for the six lathes comes first, you set the rider notice aside.",
    "c35_weight_reaction_choice_1": "Saying the bank has to go to the people standing in line, you propose going to the shelters to take applications in person.",
    "c35_weight_reaction_choice_2": "To show the number two that the machine doesn’t know, you find that summer’s loan records and set them beside NOAH’s criteria.",
    "c35_weight_reaction_choice_3": "Saying times are different from when people ran with a seal, you put the old stories aside and sort out tomorrow’s desk schedule.",
    "c35_branch_cellar_rice": "Saying the hearing may be next month but making a living is right now, you bring up the rice sacks first to save the shop’s autumn.",
    "c35_branch_cellar_books": "Saying rice can be bought again but the record of unpaid money can’t be made again, you bring up the ledger boxes first to save the lawsuit evidence.",
    "c35_branch_cellar_leave": "Saying the stairs are dangerous once the water reaches the knee, you leave the storeroom to insurance and get the people up first.",
    "c35_branch_cellar_follow_dry": "Saying paper with her husband’s writing should be saved by the family’s own hands, you dry the originals page by page all night with Moon Gaeul’s family.",
    "c35_branch_cellar_follow_scan": "Before the wet paper gets any worse, you photograph every page and make copies for the court first.",
    "c35_branch_cellar_follow_hand": "Saying paper is better in expert hands and the alley is short of hands, you leave the ledgers with a restoration firm and go back to the alley.",
    "c35_route_system_publish": "Saying the rejected people have to know the reason, you publish the circular explanation as it is to the merchants and the press.",
    "c35_route_system_rule": "Saying an answer that proves itself has to be cut by a person, you demand a rule that disaster loans must always go through human review.",
    "c35_route_system_drop": "Saying people wait while you argue with a machine, you shelve the capture and untangle the rejections one by one.",
    "c35_final_system_route_a": "So it can’t come back to the same answer, you require a field in every disaster loan rejection that traces the cause back.",
    "c35_final_system_route_b": "Saying the shops stay underwater even while the machine is being fixed, you leave NOAH’s results and cover the damage with group donations.",
    "c35_final_system_route_c": "Saying people can’t be entrusted to an answer that only comes back round, you take flood loans out of NOAH’s review until the monsoon ends.",
    "c35_evidence_turn_reveal": "Saying that even if it happened before I came, hiding it makes it mine, I make the request public as it is, deleted dissent included.",
    "c35_evidence_turn_quiet": "Saying the first thing is to stop the list being passed on, you quietly get the request withdrawn and hold off on going public.",
    "c35_evidence_turn_share": "Saying these are people who don’t know their scores fell in the order they reported damage, you tell the merchants who filed insurance claims about this link first.",
    "c35_sandbag_evidence_turn": "Lining up NOAH’s judgment records with the clues in order of time, you dig out whose request brought in the flood review criteria.",
    "c35_lathe_evidence_turn": "Lining up NOAH’s judgment records with the clues in order of time, you dig out whose request brought in the flood review criteria.",
    "c35_noah_evidence_turn": "Lining up NOAH’s judgment records with the clues in order of time, you dig out whose request brought in the flood review criteria.",
    "c35_route_system_evidence_turn": "Lining up NOAH’s judgment records with the clues in order of time, you dig out whose request brought in the flood review criteria.",
    "c35_start_warm_go": "Saying paperwork won’t stop water, you load sandbags and head for Mangwon Market.",
    "c35_start_warm_photo": "Saying the evidence drains away with the water, you tell the merchants to record the time and photos of damage first.",
    "c35_start_warm_file": "Saying you have to be ahead of the morning line at the windows, you file all the emergency loan applications overnight in one go.",
    "c35_start_warm_signature": "Trusting the people who wrote every night that they were safe, you gather the group chat into Kang Taemin’s truck and rush there together.",
    "c35_start_record_go": "Saying paperwork won’t stop water, you load sandbags and head for Mangwon Market.",
    "c35_start_record_photo": "Saying the evidence drains away with the water, you tell the merchants to record the time and photos of damage first.",
    "c35_start_record_file": "Saying you have to be ahead of the morning line at the windows, you file all the emergency loan applications overnight in one go.",
    "c35_start_record_signature": "So the rejection reasons don’t vanish in three days, you first request a longer retention period for NOAH’s judgment records.",
    "c35_start_rush_go": "Saying paperwork won’t stop water, you load sandbags and head for Mangwon Market.",
    "c35_start_rush_photo": "Saying the evidence drains away with the water, you tell the merchants to record the time and photos of damage first.",
    "c35_start_rush_file": "Saying you have to be ahead of the morning line at the windows, you file all the emergency loan applications overnight in one go.",
    "c35_start_rush_signature": "Hearing that you’re the only one she can call, you leave the factory to Foreman Kim and run to Moon Gaeul’s shop."
  },
  "pack": {
    "clue": {
      "title": "A Disaster Weight With a Blank Approval Field",
      "text": "NOAH’s 'disaster exposure' weight went in at the request of KD Capital Risk Management, and the approval field was blank. The list of insurance damage claims was passed to NOAH’s rejection list every 6 minutes."
    },
    "outcomes": {
      "c35_after_warm": {
        "tag": "Stayed Beside Them",
        "title": "You stayed in Mangwon Market until the last sandbag was cleared",
        "text": "On the first clear day, everyone who bailed out water got a piece of rice cake, and by sunset the mountain of sandbags at the end of the alley was gone. The last shovelful was Kwon Dohyun’s, back in his flower boots."
      },
      "c35_after_record": {
        "tag": "Put It in Writing",
        "title": "312 rejections became one bound report",
        "text": "The 312 emergency flood loans NOAH rejected during the monsoon were written up one by one and filed with group Compliance. Every Mangwon Market shop name on the first page carries Moon Gaeul’s rice cake stamp."
      },
      "c35_after_rush": {
        "tag": "Ran Ahead",
        "title": "The moment the rain stopped, you took the rejection records to the prosecutors",
        "text": "Before the rice cakes had gone all the way round, you headed for the prosecutors’ office with NOAH’s rejection records. Your share on the tray became a prize in a subscriber draw on Ahn Gibeom’s live stream."
      }
    },
    "continuityChallenges": {
      "c34_after_warm": {
        "title": "Going with the people you shared peaches with",
        "text": "The people who emptied a box of peaches with you in the lab are not safe tonight. Standing together in front of people underwater, you pull trust out of the flood."
      },
      "c34_after_record": {
        "title": "Holding on to rejection reasons about to vanish",
        "text": "You put on record the road the notebook took, and now before you are NOAH’s rejection reasons, gone in 72 hours. On a newly dealt hand, you ask again whom records protect."
      },
      "c34_after_rush": {
        "title": "Answering seven missed calls",
        "text": "While you chased the 33rd floor and hung on at the factory drain, you missed Moon Gaeul’s calls seven times. This time fairness means making the people underwater understand why they were rejected."
      }
    }
  }
};
