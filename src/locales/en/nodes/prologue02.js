/**
 * 프롤로그 02 (src/nodes/prologue02.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "p2_start": {
      "title": "The Morning 31 Billion Won Arrived",
      "text": "The Corporate Finance Strategy Team’s review room, 6th floor, KD Bank head office. Five months after you came off probation, a thick review file lands on your desk. Loan number 2023-0412. The borrower is FlowOn, a dawn-delivery logistics platform. The amount is 31 billion won (about US$22 million). The first page puts the debt-to-equity ratio at 179.6%, and your name is in the reviewer box on the last page. Team Head Yoon Sanghyuk rests his palm on top of your monitor. 'This is a group strategy project. You’ll handle the due diligence, and the written opinion is due next Tuesday.' He smiles. It looks less like a reprimand than congratulations. 'Your first solo file. A company like this comes along once in 10 years. Take a good look.'",
      "memo": [
        "Loan 2023-0412 · FlowOn working-capital loan, 31 billion won",
        "Reported debt-to-equity ratio 179.6%",
        "Yoon Sanghyuk: 'group strategy project' -- Credit Committee April 27",
        "Opinion due: Tuesday, April 18, 18:00"
      ],
      "choices": {
        "p2_start_team": {
          "label": "Gather the team and talk through how to read this file"
        },
        "p2_start_scope": {
          "label": "Get it in writing that the review criteria are standard"
        },
        "p2_start_accept": {
          "label": "Take the file as is; book due diligence this evening"
        },
        "reframe": {
          "label": "Ask how many other contracts carry Article 7"
        }
      },
      "place": "KD Bank head office, 6th floor · Corporate Finance Strategy Team review room",
      "clock": "Wednesday, April 12, 2023 · 09:00",
      "question": "Your first solo review is a 31-billion-won loan file, and approval already feels settled. What do you do first?",
      "lead": "Five months after you came off probation, review file 2023-0412 is assigned to you."
    },
    "p2_site": {
      "title": "The Founder’s Route",
      "text": "Thursday, April 13. You head out for due diligence at FlowOn’s headquarters and Gimpo Fulfillment Center 2. The founder, Kwon Taeho, gives you the tour himself. He doesn’t sit down in a meeting room. He walks along the conveyors, greeting each passing shift lead by name. The company he started eight years ago with two trucks now has 1,140 employees and handles 210,000 boxes a day. 'Bank people always look at the numbers first.' He points to the far end of the warehouse. 'I tell them to start with Line 3. Those people are our company.' His finger doesn’t hesitate as he spreads out the papers showing a reported debt-to-equity ratio of 179.6%. At six in the evening, the night shift comes in for the changeover, and the conveyors get a notch louder.",
      "memo": [
        "FlowOn: 1,140 employees · 210,000 boxes a day",
        "Gimpo Center 2 -- lease runs to 2026",
        "Kwon Taeho, 8 years since founding; family-centered ownership",
        "Night shift starts 18:00 -- 380 people after that"
      ],
      "choices": {
        "p2_site_floor": {
          "label": "Leave the guided route and ask Line 3 workers directly"
        },
        "p2_site_papers": {
          "label": "Check the warehouse lease against the books, page by page"
        },
        "p2_site_tour": {
          "label": "Stick to the prepared route and end the visit early"
        },
        "reframe": {
          "label": "Ask how many other contracts carry Article 7"
        },
        "p2_site_evidence_turn": {
          "label": "Open the draft contract’s circulation record"
        }
      },
      "place": "FlowOn headquarters · Gimpo Fulfillment Center 2",
      "clock": "Thursday, April 13, 2023 · 14:00",
      "question": "The founder himself is guiding your due diligence. What do you look at first?",
      "lead": "Walking beside the conveyors as he talks, the founder calls each passing shift lead by name."
    },
    "p2_model": {
      "title": "0.4 Percentage Points",
      "text": "Friday, April 14, eleven at night. Only you and Manager Han Seoyun are left in the review room. When you break FlowOn’s books out by month, one chunk doesn’t fit. Of the sales bunched into the last week of December, 26.8 billion won actually shipped in January. The numbers aren’t made up; only the booking date was pulled forward. Put those sales back in the month they belong to and rebuild, and the debt-to-equity ratio comes to 184.2%. The line Article 7 of the contract draws is 180%. Han Seoyun turns her calculator face down and stares at the screen for a long time. 'To write that this is wrong, we’d need the accounting firm’s opinion on our side. And the company paid for that opinion.' She pauses. 'And a sentence like that stays under the name of whoever wrote it.'",
      "memo": [
        "December sales 41.2 billion won, of which 26.8 billion -- actually shipped in January",
        "Rebuilt ratio 184.2% / reported 179.6%",
        "0.4 percentage points to the Article 7 line of 180%",
        "Accounting firm’s clean opinion -- a service the company paid for"
      ],
      "choices": {
        "p2_model_rebuild": {
          "label": "Rebuild the math from monthly raw data and document it"
        },
        "p2_model_report": {
          "label": "Use the reported 179.6% and footnote the gap"
        },
        "p2_model_ask": {
          "label": "Ask the company’s finance team why they moved the timing"
        },
        "reframe": {
          "label": "Ask how many other contracts carry Article 7"
        },
        "p2_model_evidence_turn": {
          "label": "Open the draft contract’s circulation record"
        }
      },
      "place": "Head office 6th-floor review room · Darkened office",
      "clock": "Friday, April 14, 2023 · 23:00",
      "question": "The rebuilt ratio is 184.2%, and the margin to the line is 0.4 percentage points. How do you write this number?",
      "lead": "Split by month, the 26.8 billion won bunched into December goes back where it belongs."
    },
    "p2_draft": {
      "title": "Who Wrote Article 7",
      "text": "Monday, April 17. You trace the draft contract back to its source and end up in your own team’s shared folder. Article 7 isn’t a term FlowOn’s side agreed to. It’s a sentence the Corporate Finance Strategy Team wrote and inserted last year. If the debt-to-equity ratio exceeds 180%, the bank may call the loan immediately, even before maturity. That folder alone holds 11 contracts with the same sentence. So this loan has sat on a 0.4-percentage-point margin since the day it was designed, and the place that set the bar is the room you’re sitting in. Assistant Manager Oh Jinwoo starts to turn the monitor toward himself, then stops. 'If you put this in the opinion, it won’t say the company touched its books. It’ll say our team wrote the clause that way.' He lowers his voice. 'My father held an approval back one day and got pushed out of his branch. One day. I’m still counting that day.'",
      "memo": [
        "Article 7 written by: Corporate Finance Strategy Team (November 2022)",
        "Contracts with the same sentence -- 11 in the team folder",
        "Clause line 180% · reported 179.6%",
        "Oh Jinwoo: father Oh Sangchul, pushed out of his branch"
      ],
      "choices": {
        "p2_draft_split": {
          "label": "Leave the clause alone and narrow the opinion to numbers"
        },
        "p2_draft_trace": {
          "label": "Pull the record of who requested the clause first"
        },
        "p2_draft_open": {
          "label": "Propose putting the clause on the team meeting agenda"
        },
        "reframe": {
          "label": "Ask how many other contracts carry Article 7"
        },
        "p2_draft_evidence_turn": {
          "label": "Open the draft contract’s circulation record"
        }
      },
      "place": "Head office 6th-floor review room · Team shared folder",
      "clock": "Monday, April 17, 2023 · 11:00",
      "question": "You now know your own team wrote Article 7. What do you do with that?",
      "lead": "As you trace the draft contract to its source, the screen stops on your own team’s shared folder."
    },
    "p2_final": {
      "title": "What to Write",
      "text": "Tuesday, April 18, five in the evening. One hour until submission. Three bundles sit on your desk: what the night shift and supplier people told you on site, the calculation that gets you to 184.2%, and a half-page memo on where the Article 7 draft came from. Put it all in and the opinion runs 11 pages; one hour is only enough to pick one bundle. Manager Han Seoyun comes in and sits across from you. 'If you want to file a dissent, you can. It’s in the rules.' She sets down two paper cups. 'But what you write decides how long the document lives. Write it as a conditional approval, and it won’t be returned. Put the people first, and it gets cut as emotional. Write about the clause, and this whole room becomes the target.' She looks at you. 'I wrote one too, 12 years ago.'",
      "memo": [
        "1 hour to deadline -- opinion up to 11 pages",
        "Site statements from 14 people · 6 pages of calculations · 1-page clause memo",
        "Han Seoyun: wrote the same kind of document 12 years ago",
        "9 days to the April 27 Credit Committee"
      ],
      "choices": {
        "p2_final_people": {
          "label": "Put the words of the people you met on site up front"
        },
        "p2_final_margin": {
          "label": "Keep only the 0.4 points in the body; attach the rest"
        },
        "p2_final_clause": {
          "label": "State plainly that our team wrote Article 7"
        },
        "reframe": {
          "label": "Reframe the table with one last proposal"
        }
      },
      "place": "Head office 6th-floor review room · Behind a closed door",
      "clock": "Tuesday, April 18, 2023 · 17:00",
      "question": "One hour left, and only one of the three bundles fits in the opinion. What do you write?",
      "lead": "On the desk, the people’s words, the calculation and the clause memo lie side by side."
    },
    "p2_aftershock": {
      "title": "Whose Name Goes On It",
      "text": "Wednesday, April 19, eight in the morning. The opinion is written. Only one box is left: the author box at the very bottom. Assistant Manager Oh Jinwoo comes in with two paper cups and sets one down. 'I asked three people yesterday. All three say they’ll put their names on it. For now.' He looks down at his cup. 'You could file it under your name today and attach the signatures on Friday, on a joint signature sheet. And by Friday, people change their minds.' The printer spits out 11 pages, and only the author box on the last page is empty. Oh Jinwoo speaks once more. 'If you write it as a conditional approval, nobody gets hurt. It won’t be returned, either. But if someone finds this document 3 years from now, they won’t see that it was a dissent.'",
      "memo": [
        "11-page opinion -- only the author box blank",
        "3 willing co-signers -- joint sheet on Friday",
        "Conditional approval form: no risk of return",
        "8 days to the April 27 Credit Committee"
      ],
      "choices": {
        "p2_after_shared": {
          "label": "Spend three days collecting co-signers for a joint sheet"
        },
        "p2_after_alone": {
          "label": "Sign as the only author and file it this morning"
        },
        "p2_after_soften": {
          "label": "Soften the wording and file it as conditional approval"
        }
      },
      "place": "Head office 6th-floor review room · At the printer",
      "clock": "Wednesday, April 19, 2023 · 08:00",
      "question": "All 11 pages are written, and only the author box is left. In what form do you file it?"
    },
    "p2_nightshift": {
      "title": "Line 3 at Four in the Morning",
      "text": "On the first night of due diligence, Kwon Taeho orders pork-and-rice soup for the night shift and heads home first. That leaves you and Kang Taemin, twenty-eight, in a fluorescent vest. He joined in the company’s first year and now runs picking on Line 3. At four in the morning the conveyors run their fastest, and each person moves 320 boxes an hour. Kang Taemin wraps both hands around his bowl. 'You’re from the bank, right? You’re the ones lending the money?' He nods toward the conveyors. 'Half of them are on contracts. The company said it’d make them permanent once it grew. Lots of people besides me believed that and waited 2 years.' Then he asks, 'If that money comes through, does that promise come through with it?'",
      "memo": [
        "181 of 380 night-shift workers on contracts",
        "Line 3 at 4 a.m. -- 320 boxes an hour",
        "Promise of permanent jobs: verbal, nothing in writing"
      ],
      "choices": {
        "p2_nightshift_choice_1": {
          "label": "Tell the night shift plainly the promise isn’t in writing"
        },
        "p2_nightshift_choice_3": {
          "label": "Say it’s not the bank’s business; keep quiet"
        },
        "p2_nightshift_choice_2": {
          "label": "Demand a written plan for permanent jobs; add it to the file"
        }
      },
      "place": "Gimpo Center 2 · Line 3 break room",
      "clock": "Friday, April 14, 2023 · 04:00",
      "question": "Half the night shift has waited 2 years on a promise that isn’t in writing. What do you say?"
    },
    "p2_ledger": {
      "title": "The Man Who Pulled Four Weeks",
      "text": "Saturday morning, FlowOn’s CFO, Bae Sungjun, calls before you can call him. He doesn’t sound like a man hiding anything. 'Ah, the December items. I pulled those forward.' He explains that, the way the company runs, its liquidity looks worst at the end of December. Warehouse rent and delivery fees all go out at year-end, and payments come in during January. 'So we pulled 4 weeks forward. The accounting firm said it was within normal practice.' Then he adds one sentence. 'Honestly, I don’t know where the 180% line came from. It was in the contract the bank gave us, so we matched it.' A child’s voice comes over the line, and he covers the mouthpiece for a moment.",
      "memo": [
        "Bae Sungjun -- moved revenue booking by 4 weeks, admits it himself",
        "Accounting firm’s answer: 'within normal practice'",
        "The company doesn’t know where the 180% line came from"
      ],
      "choices": {
        "p2_ledger_choice_3": {
          "label": "Call it confirmed, hang up, and get back to the math"
        },
        "p2_ledger_choice_2": {
          "label": "Log the call, with the time, as an official record"
        },
        "p2_ledger_choice_1": {
          "label": "Take down his words; agree with him how much to use"
        }
      },
      "place": "Head office 6th-floor review room · By the phone",
      "clock": "Saturday, April 15, 2023 · 10:00",
      "question": "The CFO admits up front that he moved the timing. How do you handle the admission?"
    },
    "p2_corridor": {
      "title": "The Empty Signature Boxes",
      "text": "Monday evening, you run into Team Head Yoon Sanghyuk on the emergency stair landing. He’s holding a draft of the approval document, and all five signature boxes at the bottom are empty. 'Names go in last.' He shows you the page without folding it. 'Put them in first, and people decide their view by the names. Leave them blank, and they read the content.' His face says he already knows what you found. Yet he isn’t angry. 'I never said your math was wrong. I’m talking about where that math sits. This file is a growth project the group has spent 3 years preparing. It’s a number our largest shareholder, Kingsdale in New York, watches every quarter. Your opinion is one page laid on top of all that.' Halfway down the stairs, he turns back. 'You decide where to put that one page. I decide where it sits.'",
      "memo": [
        "Draft approval document -- all five signature boxes blank",
        "Yoon Sanghyuk: 'names go in last'",
        "Group growth project, year 3 -- this is the biggest file"
      ],
      "choices": {
        "p2_corridor_choice_3": {
          "label": "Listen, say nothing, and go back upstairs"
        },
        "p2_corridor_choice_1": {
          "label": "Tell the team head everything you found, right there"
        },
        "p2_corridor_choice_2": {
          "label": "That night, write down when you met and what was said"
        }
      },
      "place": "Head office · Stair landing between the 6th and 7th floors",
      "clock": "Monday, April 17, 2023 · 19:00",
      "question": "Your team head shows you an approval document with every signature box empty. What do you do here?"
    },
    "p2_nightshift_reaction": {
      "title": "The Training Packet at Window 4",
      "text": "On your way out of the center, your phone rings with an unknown number. It’s Do Yoonha, twenty-four, a teller at Window 4 of Gangseo Branch. The branch has received training material for next month’s campaign, and the product is called 'FlowOn Supplier Partnership Loan.' 'I heard you’re the one reviewing this at head office.' He asks carefully. 'The packet says to recommend it to supplier owners, but it only explains half the product. This clause here, what does it mean?' The sentence he reads out is the same one you saw in the contract in your review file. Behind him, someone is writing numbers on the branch sales board.",
      "memo": [
        "Do Yoonha, Window 4, Gangseo Branch -- next month’s campaign",
        "Training packet’s clause explanation: only half"
      ],
      "choices": {
        "p2_nightshift_reaction_choice_3": {
          "label": "Say you can’t discuss a file under review; hang up"
        },
        "p2_nightshift_reaction_choice_1": {
          "label": "Explain the clause over the phone, start to finish"
        },
        "p2_nightshift_reaction_choice_2": {
          "label": "Flag in writing what the training packet leaves out"
        }
      },
      "place": "In the car from Gimpo to head office",
      "clock": "Friday, April 14, 2023 · 07:00",
      "question": "A Gangseo Branch teller asks about a clause in a product he’ll be selling next month. How much do you explain?"
    },
    "p2_ledger_reaction": {
      "title": "A New Page in the Notebook",
      "text": "When the call ends, Ban Jaewook, a 17-year Internal Audit investigator, comes up to the review room, a black notebook with a worn cover in his hand. 'This isn’t a routine check. I came because I was curious.' He opens the notebook to the page he started for this file. Only one line is written there. '2023-0412 -- 179.6.' Pen in hand, he asks, 'Why does this number sit just below 180? I don’t put much stock in coincidence.' Then he adds, 'If I open this formally now, the review stops. If I don’t, nothing happens. I came to ask you first which you’d prefer.'",
      "memo": [
        "First line on the new page of Ban Jaewook’s notebook: '2023-0412 -- 179.6'",
        "Asks you first whether to open a formal investigation"
      ],
      "choices": {
        "p2_ledger_reaction_choice_1": {
          "label": "Ask him to open it formally and hand over everything"
        },
        "p2_ledger_reaction_choice_3": {
          "label": "Ask him not to open it yet and see it through alone"
        },
        "p2_ledger_reaction_choice_2": {
          "label": "Settle for an informal check you can use by the deadline"
        }
      },
      "place": "Head office 6th-floor review room · Window seat",
      "clock": "Saturday, April 15, 2023 · 15:00",
      "question": "Internal Audit asks you first whether to open this formally. How do you answer?"
    },
    "p2_corridor_reaction": {
      "title": "The Printout Under Seal Tape",
      "text": "When you come up from the landing, Lim Kyungsoo, head of the Corporate Credit Review Team on the 8th floor, is waiting in the hallway. He is 1 year from retirement. He holds out a clipped bundle sealed with tape: a watermarked printout he made in November 2022, on the day the Article 7 draft went around. 'Records in the system can just be edited, but a printout has to be burned. And a burn leaves a mark.' He takes off his glasses and wipes them slowly. 'That document you’re going to write. Make a separate back page. You can’t know where the front page will end up, but the back page you can keep.' He pulls the bundle back toward himself. 'I’ll hold on to this. I have nothing left to burn.'",
      "memo": [
        "Printout from the Article 7 draft circulation day -- seal tape",
        "Lim Kyungsoo’s advice: make a separate back page"
      ],
      "choices": {
        "p2_corridor_reaction_choice_2": {
          "label": "Attach the printout to the review file as formal evidence"
        },
        "p2_corridor_reaction_choice_3": {
          "label": "Leave the printout alone; focus on the opinion"
        },
        "p2_corridor_reaction_choice_1": {
          "label": "Make a separate back page and leave it with Lim Kyungsoo"
        }
      },
      "place": "Head office 8th-floor hallway · Outside the Corporate Credit Review Team",
      "clock": "Monday, April 17, 2023 · 20:00",
      "question": "A review team head, 1 year from retirement, shows you a printout from the day the clause draft went around. What do you do?"
    },
    "p2_branch_supplier": {
      "title": "A 3-Year Supply Contract",
      "text": "A shift lead you met on Line 3 writes down an address for you: a small precision machining shop in Mullae-dong. Seven employees, six lathes, and a 3-year supply contract to be signed tomorrow morning. The owner, Moon Sungho, still in his work clothes, opens the contract for you. 'If FlowOn gets 31 billion won from the bank, they’re putting in an automated line. We make the parts for that line.' He smiles. 'My equipment loan’s already approved. I showed them the contract and it went right through.' In a corner of the shop stands a new machine, still in its packaging. He runs his palm over it once and says, 'This is the biggest decision of our lives. You’re from the bank, so let me ask just one thing. That 31 billion won, it’s coming, right?'",
      "memo": [
        "Gaon Precision, Mullae-dong -- 7 employees, 6 lathes",
        "3-year supply contract to be signed: next morning",
        "Equipment loan already disbursed -- the shop is collateral",
        "1 new machine -- still in its packaging"
      ],
      "choices": {
        "p2_branch_supplier_c": {
          "label": "Say you can’t comment on a file under review; leave"
        },
        "p2_branch_supplier_a": {
          "label": "Tell him nothing’s decided yet; ask him to hold off signing"
        },
        "p2_branch_supplier_b": {
          "label": "Add the supply contract and equipment loan to the file"
        }
      },
      "place": "Gaon Precision, Mullae-dong · Shop floor",
      "clock": "Thursday, April 13, 2023 · 17:00",
      "question": "A supplier’s owner signs a 3-year contract tomorrow morning. What do you tell him here?"
    },
    "p2_branch_supplier_follow": {
      "title": "Two Boxes of Rice Cakes",
      "text": "As you leave the shop, Moon Gaeul, Moon Sungho’s wife, steps out of the rice cake shop at the end of the alley. The shop has no name yet, just a sheet of paper where the sign should go. She holds out two plastic bags. 'One box is for the bank, and one is for you to eat today. My husband’s been saying since yesterday that people from the bank were coming.' Her hands are still dusted with rice flour. She looks back toward the machine shop. 'He’s done nothing but that work since he was eighteen. With a 3-year contract, he figured we could get our son through college. He was so happy yesterday, tapping away at the calculator.' Then she looks at you, her face without a trace of doubt. 'Please look after it for us. We don’t know much, so if the bank says it’ll work, we believe it will.'",
      "memo": [
        "Moon Gaeul -- rice cake shop in Mullae-dong, no sign",
        "Son Moon Hajun -- middle school student",
        "Moon Sungho of Gaon Precision: same work since age 18",
        "Two boxes of rice cakes -- one for the bank"
      ],
      "choices": {
        "p2_branch_supplier_follow_b": {
          "label": "Take both their statements; put them at the front of the file"
        },
        "p2_branch_supplier_follow_c": {
          "label": "Accept the rice cakes, promise to look closely, and go"
        },
        "p2_branch_supplier_follow_a": {
          "label": "Decline the rice cakes and tell them what the deal rides on"
        }
      },
      "place": "Mullae-dong alley · Outside the rice cake shop with no sign",
      "clock": "Thursday, April 13, 2023 · 18:00",
      "question": "Someone who doubts nothing is holding out two boxes of rice cakes. What do you do?"
    },
    "p2_route_system": {
      "title": "The Same Sentence, 47 Times",
      "text": "Instead of choosing what goes into the opinion, you ask how many other contracts carry Article 7. Team Head Lim Kyungsoo opens the terminal in the 8th-floor review records room. The fluorescent light flickers twice, and the contract folders run to page 22 on the screen. He prints 3 years’ worth as watermarked copies and lays them out on the floor. Of those, 47 contracts carry a sentence identical to Article 7, word for word. In 9 of them, the margin on signing day was under 1 percentage point, and all nine carry a red 'Growth Strategy Project' mark in the document category box. Lim Kyungsoo pushes himself up off his knees. 'You thought this clause was there to call loans. It isn’t. It’s there to approve them. Lend to a risky company, write in that you can pull out when it gets risky, and the approval goes through.'",
      "memo": [
        "Contracts with the same sentence: 47 (3 years)",
        "Margin under 1 percentage point at signing -- 9",
        "All 9 categorized as 'Growth Strategy Project'"
      ],
      "choices": {
        "p2_route_system_keep": {
          "label": "Set the list aside; write only about your own file"
        },
        "p2_route_system_nine": {
          "label": "Visit the officers on the 9 files under 1 point first"
        },
        "p2_route_system_annex": {
          "label": "Attach the list of 47 to the opinion as an annex"
        },
        "p2_route_system_evidence_turn": {
          "label": "Open the draft contract’s circulation record"
        }
      },
      "place": "Head office 8th-floor review records room",
      "clock": "Monday, April 17, 2023",
      "question": "Of 47 contracts with the same sentence, 9 sat under 1 percentage point. What do you do with this list?"
    },
    "p2_final_system_route": {
      "title": "A Clause Written to Approve",
      "text": "Ten at night. Forty-seven contract printouts lie in rows on the floor of the 8th-floor records room. Team Head Lim Kyungsoo has pulled out the nine with red marks. The deadline is six tomorrow evening, and your opinion still tells the story of one file. Lim Kyungsoo turns back, his hand on the light switch. 'Call it one file, and it’s that company’s problem. Call it forty-seven, and it’s our bank’s problem. Which do you think the reader will send back faster?'",
      "memo": [
        "47 contracts with the same clause -- spread on the floor",
        "9 marked 'Growth Strategy Project': set aside",
        "Opinion due: Tuesday, April 18, 18:00"
      ],
      "choices": {
        "p2_final_system_route_c": {
          "label": "Put the 9 officers’ names on the same opinion"
        },
        "p2_final_system_route_b": {
          "label": "Leave the list; block only 2023-0412"
        },
        "p2_final_system_route_a": {
          "label": "Propose banning the clause when the margin is under 1 point"
        }
      },
      "place": "Head office 8th-floor review records room · At the terminal",
      "clock": "Monday, April 17, 2023 · 22:00",
      "question": "The same clause was used 47 times. Do you file the story of one file, or of 47?"
    },
    "p2_evidence_turn": {
      "title": "Six Lines of Sign-Off",
      "text": "Following the date on the clue, you open the circulation record of the Article 7 draft from November 2022. The request for the clause didn’t come from inside the team. It’s a one-page request sent down from the Group Strategy Office, and the reason box reads: 'Lower the review burden for growth-project loans. A call condition creates grounds for approval.' Below it, the circulation sign-off box holds six employee numbers. Yoon Sanghyuk, Han Seoyun, Oh Jinwoo, and from the fourth line on, three trainees. The last line is your employee number, signed off at 18:02 on November 14, 2022. Investigator Ban Jaewook closes his notebook. 'The name of the person about to write a dissent is already on that clause’s circulation list. Whether you read it before clicking or not, the record is the same.'",
      "memo": [
        "Clause request: a one-page request from the Group Strategy Office",
        "Reason: 'a call condition creates grounds for approval'",
        "Six lines of circulation sign-off -- your employee number on the last"
      ],
      "choices": {
        "p2_evidence_turn_own": {
          "label": "Open the opinion by stating your number is on that list"
        },
        "p2_evidence_turn_attach": {
          "label": "Attach the request and the circulation record as an annex"
        },
        "p2_evidence_turn_hold": {
          "label": "Hold the record; reveal it first at the Credit Committee"
        }
      },
      "place": "Head office 6th-floor review room · Document history screen",
      "clock": "Tuesday, April 18, 2023 · 09:00",
      "question": "Your employee number is on the last line of the clause draft’s sign-off box. How do you use this record?"
    },
    "p2_start_credit": {
      "title": "The Mentor Who Came to Repay",
      "text": "Last fall, as you came off probation, you gave the credit to your mentor. The name on the report cover was Assistant Manager Oh Jinwoo’s, and the team head read it out as it was. Five months later, on the morning of April 12, review file 2023-0412 is assigned to you, and Oh Jinwoo is the first to get up from his seat. FlowOn, the dawn-delivery logistics platform, 31 billion won (about US$22 million), a reported debt-to-equity ratio of 179.6%. He flips through the first page on your screen and says, 'This was originally my file. I asked the team head to put your name on it.' Then he lowers his voice. 'I’m paying you back. But this was the only way I had, so I’m a little sorry.'",
      "memo": [
        "2023-0412 reviewer: you -- on Oh Jinwoo’s recommendation",
        "FlowOn working-capital loan, 31 billion won · reported ratio 179.6%",
        "Yoon Sanghyuk: 'group strategy project' -- Credit Committee April 27"
      ],
      "choices": {
        "p2_start_credit_accept": {
          "label": "Take the file as is; book due diligence this evening"
        },
        "p2_start_credit_team": {
          "label": "Gather the team and talk through how to read this file"
        },
        "p2_start_credit_signature": {
          "label": "Hear Oh Jinwoo out on why he handed this file to you"
        },
        "p2_start_credit_scope": {
          "label": "Get it in writing that the review criteria are standard"
        },
        "p2_start_credit_reframe": {
          "label": "Ask how many other contracts carry Article 7"
        }
      },
      "place": "KD Bank head office, 6th floor · Corporate Finance Strategy Team review room",
      "clock": "Wednesday, April 12, 2023 · 09:00",
      "question": "Your mentor has passed his own file to you under your name. How do you take it?",
      "lead": "The man you gave the credit to last fall has now pushed his own file toward you."
    },
    "p2_start_record": {
      "title": "Known as That Kind",
      "text": "Last fall, you put what you saw on record under your own name. Because of that one page, the team filed you as 'that kind of person,' and the label was convenient, so no one ever checked it again. On the morning of April 12, review file 2023-0412 is assigned to you. FlowOn, 31 billion won (about US$22 million), a reported debt-to-equity ratio of 179.6%, and your name in the reviewer box. Passing by, Manager Han Seoyun taps the corner of your monitor twice with a fingertip. 'The team head said this file needs someone thorough.' She pauses. 'Handing a file to someone thorough means one of two things. Either they want it looked at closely, or they want to show that looking closely changes nothing.'",
      "memo": [
        "2023-0412 reviewer: you -- named by the team head",
        "Team label since last fall’s record: 'the thorough one'",
        "FlowOn 31 billion won · reported ratio 179.6%"
      ],
      "choices": {
        "p2_start_record_scope": {
          "label": "Get it in writing that the review criteria are standard"
        },
        "p2_start_record_signature": {
          "label": "Say the label 'that kind of person' out loud first, this time"
        },
        "p2_start_record_team": {
          "label": "Gather the team and talk through how to read this file"
        },
        "p2_start_record_accept": {
          "label": "Take the file as is; book due diligence this evening"
        },
        "p2_start_record_reframe": {
          "label": "Ask how many other contracts carry Article 7"
        }
      },
      "place": "KD Bank head office, 6th floor · Corporate Finance Strategy Team review room",
      "clock": "Wednesday, April 12, 2023 · 09:00",
      "question": "The team has filed you as 'the thorough one' and handed you this file. What do you do first?",
      "lead": "Since the one page you signed last fall, the team’s view of you has gotten here ahead of you."
    },
    "p2_start_speed": {
      "title": "What Speed Left Behind",
      "text": "Last fall, you chose speed. You saved a day, and that day became your reputation. On the morning of April 12, you’re in the review room before anyone else, and a review file is already assigned on your screen. Loan number 2023-0412, FlowOn, a reported debt-to-equity ratio of 179.6%. Team Head Yoon Sanghyuk walks in behind you. 'I knew you’d be first in.' He sticks a printed schedule beside your monitor. What was a 2-week schedule has been cut to ten days. 'A fast person should get a fast schedule. That’s how we show respect.'",
      "memo": [
        "2023-0412 reviewer: you -- schedule cut to ten days",
        "Opinion due April 18 · Credit Committee April 27",
        "FlowOn 31 billion won (about US$22 million) · reported ratio 179.6%"
      ],
      "choices": {
        "p2_start_speed_team": {
          "label": "Gather the team and talk through how to read this file"
        },
        "p2_start_speed_signature": {
          "label": "Show the team head what the ten-day schedule hides"
        },
        "p2_start_speed_scope": {
          "label": "Get it in writing that the review criteria are standard"
        },
        "p2_start_speed_accept": {
          "label": "Take the file as is; book due diligence this evening"
        },
        "p2_start_speed_reframe": {
          "label": "Ask how many other contracts carry Article 7"
        }
      },
      "place": "KD Bank head office, 6th floor · Corporate Finance Strategy Team review room",
      "clock": "Wednesday, April 12, 2023 · 08:40",
      "question": "Your reputation for speed has shrunk a 2-week schedule to ten days. What do you do with it?",
      "lead": "You reached the review room 20 minutes ahead of everyone else, and the file is already assigned."
    }
  },
  "echoReplies": {
    "p2_start_team": "You gather them, and six people give you 30 minutes. Five call it 'a good company'; only Oh Jinwoo says 'the deadline is strange.'",
    "p2_start_scope": "You ask, and the answer comes the next day. One line. 'Group growth strategy project -- review criteria same as standard.' What’s actually different is never written down.",
    "p2_start_accept": "You book it at once, and due diligence moves up a day. That day lets you see the night-shift changeover, time that wasn’t on the schedule.",
    "p2_site_floor": "You leave the route, and Kwon Taeho doesn’t stop you. He even follows you and calls out the Line 3 shift lead’s name for you. He doesn’t act like a man with something to hide.",
    "p2_site_papers": "You check, and warehouse rent is running 120 million won a month above the books. The gap started in December.",
    "p2_site_tour": "You follow the route, and it’s over in three hours. Packing your bag, you realize the night shift never once appeared on that route.",
    "p2_model_ask": "You ask directly, and the CFO answers without hiding anything. The not hiding is the strangest part.",
    "p2_model_rebuild": "You rebuild it, and the calculation runs to six pages. Nowhere in those six pages are there grounds to write the word 'manipulation.'",
    "p2_model_report": "You footnote it, and the opinion gets two pages shorter. People read the body; only someone digging later reads the footnotes.",
    "p2_draft_open": "You put it on the agenda, and the meeting ends in 40 minutes. The conclusion: 'The clause is standard and is not addressed in individual files.'",
    "p2_draft_trace": "You pull the record, and the draft file turns up. This team wrote it, but the document that ordered it came from outside.",
    "p2_draft_split": "You narrow it, and the opinion gets neat. So does the rebuttal. 'The accounting firm issued a clean opinion on the numbers.' One line, and it’s over.",
    "p2_final_people": "You put the people first, and the document gets read. A document that gets read is sometimes quoted, and sometimes called emotional.",
    "p2_final_clause": "You write about the clause, and this whole room becomes the target. Three of the people on the Credit Committee are in that circulation sign-off box.",
    "p2_final_margin": "Keep only the 0.4 points, and the body is two pages. The other nine pages get pushed into attachments. No one is surprised when a two-page body is returned.",
    "p2_after_alone": "You file it alone, and it is stamped received at 10:12 a.m. on April 19. A document with one name in the author box takes only one stroke to erase.",
    "p2_after_shared": "It is received at 10:12 a.m. on April 19. The joint sheet stays open until Friday. On Thursday night, two of the three call to take their names off. One has a sick child; the other gives no reason. On Friday morning, all four names are still on the signature line.",
    "p2_after_soften": "You soften it, and the document survives. Under the title 'Approvable if conditions are met,' the fact that it was a dissent is left as one line in the third paragraph.",
    "p2_nightshift_choice_1": "You tell him plainly, and Kang Taemin stirs his soup for a long time. Then he says, 'Thanks for telling me.' The thank-you hurts most.",
    "p2_nightshift_choice_2": "You demand it, and three days later the company sends one page. The phrase 'phased review' appears three times, and a date appears not once.",
    "p2_nightshift_choice_3": "You hold back, and the dawn changeover ends quietly. Kang Taemin doesn’t ask anything else. He already knows how not to ask.",
    "p2_ledger_choice_1": "You decide together, and Bae Sungjun asks you to drop two sentences. Both are sentences he worries his family might read.",
    "p2_ledger_choice_2": "You put it on record, and his admission gets a date. 3 years later, that date is aimed at him. By then he will regret this call.",
    "p2_ledger_choice_3": "You hang up with 12 minutes to spare. What’s left is time; what’s gone is the sentence he said in his own words.",
    "p2_corridor_choice_1": "You tell him everything, and for the first time Yoon Sanghyuk pauses for 2 seconds. Then he says, 'You can’t hide anything, can you.' It sounds like praise, and it isn’t.",
    "p2_corridor_choice_2": "You put it on record, and that night on the landing becomes a document. The document stays, and who will keep it is not yet decided.",
    "p2_corridor_choice_3": "You go back up, and it’s as if nothing happened. Only two people know what was said on the landing, and one of them decides where things sit.",
    "p2_nightshift_reaction_choice_1": "You explain it all, and Do Yoonha is silent for a while before he asks, 'Then I shouldn’t sell this?' You have no authority to answer that question.",
    "p2_nightshift_reaction_choice_2": "You flag it, and the training packet comes back down a week late. The explanation grows by two lines, and the sales target stays the same.",
    "p2_nightshift_reaction_choice_3": "You end it, and the line goes quiet. Next month, Do Yoonha will sell that product at Window 4.",
    "p2_ledger_reaction_choice_1": "The case is opened formally, and the review stops. A stopped review is remembered for who stopped it. Ban Jaewook writes your name in his notebook.",
    "p2_ledger_reaction_choice_2": "The informal check is fast. But it can’t be cited as grounds in any document. Ban Jaewook says twice, 'This never happened.'",
    "p2_ledger_reaction_choice_3": "You ask him not to open it, and Ban Jaewook closes his notebook. 'Understood. But I’m not erasing this line.' The number 179.6 stays on the first line of that page.",
    "p2_corridor_reaction_choice_1": "You leave it with him, and Lim Kyungsoo adds one more strip of seal tape. 'Your handwriting’s big. It’ll be readable even when you’re old.' For 3 years, no one comes looking for that back page.",
    "p2_corridor_reaction_choice_2": "You attach it, and the printout is scanned into the process. A document inside the process can also vanish in whatever way the process allows.",
    "p2_corridor_reaction_choice_3": "You focus, and the opinion is done an hour early. Lim Kyungsoo takes the bundle back to the 8th floor, and the seal tape is never put back.",
    "p2_branch_supplier_a": "You tell him, and Moon Sungho’s smile fades. 'Then what do we do? The machine’s already here.' Telling him to wait offers nothing after that.",
    "p2_branch_supplier_b": "You bring them back, and the due diligence file doubles. It is the first time on this team that a supplier’s papers have entered a bank review.",
    "p2_branch_supplier_c": "You leave, and Moon Sungho follows you out the door to see you off. At ten the next morning, he signs the contract.",
    "p2_branch_supplier_follow_a": "You tell them everything, and Moon Gaeul takes the bags back. Then, a long while later, she holds one out again. 'Take this one anyway. I made it today, so it’ll be hard by tomorrow.'",
    "p2_branch_supplier_follow_b": "You take their statements, and Moon Sungho writes his name twice. Once wrong, once right. 3 years later, that paper becomes the only record.",
    "p2_branch_supplier_follow_c": "You turn away, and the smell of rice cakes follows you to the end of the alley. The next day, Moon Gaeul puts up her sign. The shop is called 'Gaeul Rice Cake Shop.'",
    "p2_route_system_annex": "You attach it, and the opinion runs 30 pages. The Credit Committee handout is summarized to ten pages, and the person summarizing isn’t you.",
    "p2_route_system_nine": "You visit them, and four of the nine agree to meet. Two of them learn for the first time that their files were the same. The other five don’t answer the phone.",
    "p2_route_system_keep": "You fold it away, and the 47 stay in the folder. Sealing the printout bundle with tape, Lim Kyungsoo says, 'Someone will come someday.'",
    "p2_final_system_route_a": "The rule is set, and the clause is blocked from the next contract on. This one still predates the rule.",
    "p2_final_system_route_b": "You block just one file, and the other 46 still stand on the same sentence today.",
    "p2_final_system_route_c": "You gather the names, and nine people see each other for the first time. The department that will receive the opinion is the one that wrote the clause.",
    "p2_evidence_turn_attach": "You attach it, and the request becomes an official paper. From that day on, the Group Strategy Office treats this review as its own business.",
    "p2_evidence_turn_hold": "Held back, it becomes your strongest card on the morning of the 27th. Meanwhile, even you don’t know where the original request file is.",
    "p2_evidence_turn_own": "You write it on the first line, and the reader relaxes first. Then they read from the second line on without suspicion. Your name pays the price.",
    "p2_site_evidence_turn": "Trace the draft back, and the circulation record opens. The hand that wrote the clause and the hand that ordered it may not be the same.",
    "p2_model_evidence_turn": "Trace the draft back, and the circulation record opens. The hand that wrote the clause and the hand that ordered it may not be the same.",
    "p2_draft_evidence_turn": "Trace the draft back, and the circulation record opens. The hand that wrote the clause and the hand that ordered it may not be the same.",
    "p2_route_system_evidence_turn": "Trace the draft back, and the circulation record opens. The hand that wrote the clause and the hand that ordered it may not be the same.",
    "prologue02_memory_system": "Open them side by side, and the two pages look alike. In the fall, the pile was errors reported only by word of mouth. This folder piles up clauses that match word for word.",
    "prologue02_memory_evidence": "Lay the empty approver box against the Article 7 draft, and the circulation sign-off box appears. This time the box isn’t empty, and the very last line looks familiar.",
    "p2_start_credit_team": "You gather them, and six people give you 30 minutes. Five call it 'a good company'; only Oh Jinwoo says 'the deadline is strange.'",
    "p2_start_credit_scope": "You ask, and the answer comes the next day. One line. 'Group growth strategy project -- review criteria same as standard.' What’s actually different is never written down.",
    "p2_start_credit_accept": "You book it at once, and due diligence moves up a day. That day lets you see the night-shift changeover, time that wasn’t on the schedule.",
    "p2_start_credit_signature": "You hear him out, and at the end Oh Jinwoo adds one line. 'The team head said he liked a young person’s name on it.' That was the whole recommendation.",
    "p2_start_record_team": "You gather them, and six people give you 30 minutes. Five call it 'a good company'; only Oh Jinwoo says 'the deadline is strange.'",
    "p2_start_record_scope": "You ask, and the answer comes the next day. One line. 'Group growth strategy project -- review criteria same as standard.' What’s actually different is never written down.",
    "p2_start_record_accept": "You book it at once, and due diligence moves up a day. That day lets you see the night-shift changeover, time that wasn’t on the schedule.",
    "p2_start_record_signature": "You say it first, and Han Seoyun answers without a smile. 'I was called that once too. 12 years ago.' She explains no further.",
    "p2_start_speed_team": "You gather them, and six people give you 30 minutes. Five call it 'a good company'; only Oh Jinwoo says 'the deadline is strange.'",
    "p2_start_speed_scope": "You ask, and the answer comes the next day. One line. 'Group growth strategy project -- review criteria same as standard.' What’s actually different is never written down.",
    "p2_start_speed_accept": "You book it at once, and due diligence moves up a day. That day lets you see the night-shift changeover, time that wasn’t on the schedule.",
    "p2_start_speed_signature": "You point it out, and Yoon Sanghyuk looks at the schedule again. Then he gives back one day. 'You’re right. One day should do it?' Two days never come back."
  },
  "choiceVoiceLines": {
    "p2_start_team": "Since 31 billion won is too big to judge alone, you gather the team and talk through how to read this file.",
    "p2_start_scope": "So the story can’t change later, you ask for written confirmation that this file’s review criteria are standard.",
    "p2_start_accept": "Deciding this is no time to argue, you take the file as is and book due diligence for this evening.",
    "p2_site_floor": "Since the prepared path can’t show you everything, you leave the guided route and ask the Line 3 workers directly.",
    "p2_site_papers": "Trusting paper over an unhesitating finger, you check the warehouse lease against the books on site, page by page.",
    "p2_site_tour": "To buy time for writing the opinion, you stick to the prepared route and end the day visit ahead of schedule.",
    "p2_model_ask": "Wanting to hear the reason before writing that it’s wrong, you decide to ask the company’s finance team directly why they moved the timing.",
    "p2_model_rebuild": "So anyone who rebuilds it gets 184.2%, you rebuild the calculation from the monthly raw data and document it.",
    "p2_model_report": "With no grounds yet to stand against the accounting firm’s opinion, you use the reported 179.6% and put only the gap in a footnote.",
    "p2_draft_open": "Since a sentence written in this room should be raised in this room first, you propose putting the clause on the team meeting agenda.",
    "p2_draft_trace": "So you don’t point at this room on a guess, you first pull the record of who asked for the clause draft.",
    "p2_draft_split": "Knowing the opinion won’t hold if it takes aim at the team too, you leave the clause alone and narrow the opinion to the numbers.",
    "p2_final_people": "Knowing it must be read first even if it gets cut as emotional, you put the words of the people you met on site at the very front.",
    "p2_final_clause": "Deciding not to leave it out even if this whole room becomes the target, you state plainly that your team wrote Article 7.",
    "p2_final_margin": "Since one number is all you can defend to the end in one hour, you keep only the 0.4 points in the body and move the rest to attachments.",
    "p2_after_alone": "Unable to wait for minds that will change by Friday, you write only your own name in the author box and file it this morning.",
    "p2_after_shared": "Since a single name is easy to send back, you file today and spend three days gathering colleagues’ signatures for a joint sheet.",
    "p2_after_soften": "Since that beats being returned and lost, you soften the wording and file it as a conditional approval.",
    "p2_nightshift_choice_1": "Unable to give empty words to someone who waited 2 years, you tell the night shift plainly that the promise isn’t in writing.",
    "p2_nightshift_choice_2": "Deciding to get a spoken promise on paper, you demand a written plan for permanent jobs and add it to the file.",
    "p2_nightshift_choice_3": "Afraid a hasty answer would become one more promise, you say it’s not the bank’s business and keep quiet.",
    "p2_ledger_choice_1": "So the man who called first doesn’t get into trouble, you take down his words as said and agree with him how much to use.",
    "p2_ledger_choice_2": "Knowing words said without hiding are the ones to keep, you log the call, with the time, as an official record.",
    "p2_ledger_choice_3": "You’ve heard what you needed and it’s confirmed, so you cut the call short and go back to the math.",
    "p2_corridor_choice_1": "With nothing to hide from a face that already knows, you tell the team head everything you found, right there.",
    "p2_corridor_choice_2": "Since words on a stair landing leave no trace, you write down that night when you met and what was said.",
    "p2_corridor_choice_3": "Deciding not to show your hand to the man who decides where things sit, you listen, say nothing, and go back upstairs.",
    "p2_nightshift_reaction_choice_1": "Unwilling to let him recommend it blind, you explain the clause over the phone from start to finish.",
    "p2_nightshift_reaction_choice_2": "So it doesn’t end with Do Yoonha alone knowing, you flag in writing that the branch training packet leaves out the explanation.",
    "p2_nightshift_reaction_choice_3": "Since this mustn’t reach the counter first, you say you can’t discuss a file under review and end the call.",
    "p2_ledger_reaction_choice_1": "Knowing it must be looked at properly even if the review stops, you ask him to open it formally and hand over everything.",
    "p2_ledger_reaction_choice_2": "Looking for a path that neither stops nor buries it, you get only an informal check you can use before the review deadline.",
    "p2_ledger_reaction_choice_3": "Since the opinion stops if the review stops, you ask him not to open it yet and see it through alone.",
    "p2_corridor_reaction_choice_1": "So one page survives wherever the front page goes, you make a separate back page and leave it with Lim Kyungsoo.",
    "p2_corridor_reaction_choice_2": "Knowing it must sit where no one can burn it, you attach the printout to the review file as formal evidence.",
    "p2_corridor_reaction_choice_3": "Deciding not to drag in the burden of a man near retirement, you leave the printout alone and focus on the opinion.",
    "p2_branch_supplier_a": "Before he signs tomorrow morning, you tell him truthfully that nothing is decided yet and ask him to delay signing.",
    "p2_branch_supplier_b": "So the record shows this shop also hangs on the 31 billion won, you take the supply contract and equipment loan papers and add them to the file.",
    "p2_branch_supplier_c": "Knowing a reviewer mustn’t be the first to let things slip, you say you can’t comment on a file under review and leave the shop.",
    "p2_branch_supplier_follow_a": "Since these are people who believe whatever the bank says will work, you decline the rice cakes and tell the couple everything this contract rides on.",
    "p2_branch_supplier_follow_b": "So their words about not knowing much don’t get buried, you take down both their statements and put them at the front of the file.",
    "p2_branch_supplier_follow_c": "With no promise you can make right now, you accept the rice cakes, say only that you’ll look closely, and turn away.",
    "p2_route_system_annex": "Deciding to show on paper that this is no single file’s problem, you attach the list of 47 to the opinion as an annex.",
    "p2_route_system_nine": "Since you need to know the people behind the red marks first, you visit the officers on the 9 files under 1 percentage point.",
    "p2_route_system_keep": "Deciding the 47 aren’t yours to carry, you set the list aside and write only about your own file.",
    "p2_final_system_route_a": "Calling it the bank’s problem, not the company’s, you propose banning the clause outright when the margin is under 1 percentage point.",
    "p2_final_system_route_b": "Since one thing is all you can write by six tomorrow, you leave the list and block only 2023-0412.",
    "p2_final_system_route_c": "So it can’t be sent back as one person’s one file, you put the 9 officers’ names on the same opinion.",
    "p2_evidence_turn_attach": "Letting the documents say who asked for it, you attach the request and the circulation record to the opinion as an annex.",
    "p2_evidence_turn_hold": "Knowing what comes out early gets buried early, you hold the circulation record and reveal it first at the Credit Committee.",
    "p2_evidence_turn_own": "Before someone else brings it up, you open the opinion by stating that your employee number is on that list.",
    "p2_site_evidence_turn": "With the draft contract in the middle and the clues laid around it, you work out who asked for those clauses.",
    "p2_model_evidence_turn": "With the draft contract in the middle and the clues laid around it, you work out who asked for those clauses.",
    "p2_draft_evidence_turn": "With the draft contract in the middle and the clues laid around it, you work out who asked for those clauses.",
    "p2_route_system_evidence_turn": "With the draft contract in the middle and the clues laid around it, you work out who asked for those clauses.",
    "p2_start_credit_team": "Since 31 billion won is too big to judge alone, you gather the team and talk through how to read this file.",
    "p2_start_credit_scope": "So the story can’t change later, you ask for written confirmation that this file’s review criteria are standard.",
    "p2_start_credit_accept": "Deciding this is no time to argue, you take the file as is and book due diligence for this evening.",
    "p2_start_credit_signature": "Needing to know what lies under his talk of repaying, you hear Oh Jinwoo out on why he handed this file to you.",
    "p2_start_record_team": "Since 31 billion won is too big to judge alone, you gather the team and talk through how to read this file.",
    "p2_start_record_scope": "So the story can’t change later, you ask for written confirmation that this file’s review criteria are standard.",
    "p2_start_record_accept": "Deciding this is no time to argue, you take the file as is and book due diligence for this evening.",
    "p2_start_record_signature": "Before a label someone else gave you drags you along, this time you say 'that kind of person' out loud first.",
    "p2_start_speed_team": "Since 31 billion won is too big to judge alone, you gather the team and talk through how to read this file.",
    "p2_start_speed_scope": "So the story can’t change later, you ask for written confirmation that this file’s review criteria are standard.",
    "p2_start_speed_accept": "Deciding this is no time to argue, you take the file as is and book due diligence for this evening.",
    "p2_start_speed_signature": "Before it gets buried under the word respect, you show the team head what the schedule cut to ten days keeps you from seeing."
  },
  "pack": {
    "clue": {
      "title": "The Article 7 Circulation List",
      "text": "Article 7, which set the 180% debt-to-equity line, began with a one-page request from the Group Strategy Office, and the reason box read 'a call condition creates grounds for approval.' The last of the six lines in the draft’s circulation sign-off box is the employee number you had as a trainee."
    },
    "outcomes": {
      "p2_after_alone": {
        "tag": "Filed Alone",
        "title": "You wrote one name in the author box and filed it",
        "text": "At 10:12 a.m. on April 19, 2023, an 11-page dissent is received. It has one author, so how long the document lives depends on one person."
      },
      "p2_after_shared": {
        "tag": "Filed Together",
        "title": "You spent three days gathering signatures",
        "text": "The opinion was received on April 19. Two of the three who said they would sign wavered on Thursday night, and the joint sheet attached on Friday kept four names, yours included."
      },
      "p2_after_soften": {
        "tag": "Softened",
        "title": "You refiled it as a conditional approval",
        "text": "The document isn’t returned. Its title is 'Approvable if conditions are met,' and the fact that it was a dissent remains as one line in the third paragraph."
      }
    },
    "continuityChallenges": {
      "p1_after_credit": {
        "title": "Protect the Debt Your Mentor Repays",
        "text": "Oh Jinwoo, who got the credit from you last fall, has put this file under your name. Before that kindness hardens into a debt, the card that hears him out on why protects trust."
      },
      "p1_after_record": {
        "title": "Flip the Hand with the 'That Kind' Label",
        "text": "After you left a record under your own name, the team filed you as the thorough one. Instead of hiding that label, you bring it out first and reframe this review’s hand from the start."
      },
      "p1_after_speed": {
        "title": "Name What the Ten Days Hide",
        "text": "Your reputation for speed shrank a 2-week schedule to ten days. Fairness rides on showing the team head what those four days keep you from seeing."
      }
    }
  }
};
