/**
 * 사건 24 (src/nodes/case24.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c24_start": {
      "title": "No Results",
      "text": "An all-staff notice, scheduled in advance, comes up on every monitor at once. The subject is 'Notice of Reorganization', and the first line reads: 'Trigger Lab is dissolved effective March 27. Reason: no operational results.' The 4th-floor analyst room goes quiet. Lee Minseo refreshes the notice three times, and Do Yoonha stops reading halfway and opens a window. Ban Jaewook silently copies the notice’s issuing-department field into his notebook. Han Seoyun prints the notice and pins it with a magnet to the middle of the whiteboard, right over the spot crowded with 23 case numbers. 'The last day of work is Friday. They want our things out by Thursday.' She picks her words for a moment. 'No results. Nowhere in the notice does it say who wrote those two words.'",
      "memo": [
        "Dissolution notice: effective March 27, reason 'no operational results'",
        "Last day of work Friday, belongings out by Thursday",
        "Issuing department: Group Strategy Office",
        "Basis for the reorganization: the Asia portfolio review by largest shareholder Kingsdale Partners (New York)",
        "Yoon Sanghyuk elected director -- 50.6% for, and the 49.4% against were institutional votes"
      ],
      "choices": {
        "c24_start_pack": {
          "label": "This isn’t the place to fight; finish the handover fast"
        },
        "c24_start_team": {
          "label": "Look after colleagues’ next posts before the notice"
        },
        "c24_start_object": {
          "label": "File a formal objection to the reason 'no results'"
        },
        "reframe": {
          "label": "Count each use of 'no results'"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room",
      "clock": "Dissolution in D-4 · Monday",
      "question": "The dissolution notice gives only two words: 'no results.' What do you do first?",
      "lead": "Three days after the shareholders’ meeting, Lee Minseo refreshes the intranet at exactly 8 on Monday morning and is the first to stop breathing."
    },
    "c24_desks": {
      "title": "Emptying Desks",
      "text": "20 copy-paper boxes come up to the 4th floor. Oh Jinwoo packs first. He is the one whose next post was settled earliest. The day after the dissolution notice, another envelope came from Bridge Bank. The same name as in December, and this time with a start date. He puts the pen he always kept squared to his monitor into the box last and wipes the empty desk twice. Ban Jaewook goes back to Internal Audit; Lee Minseo goes to Human Resources, 'pending reassignment.' Do Yoonha has received a transfer order to a window at Gangseo Branch. The very seat where he sold that loan 3 years ago. He takes a notebook with worn corners from his drawer. The notebook where he first wrote down the 1,740 names. 'Can I take this to the window? Or do I have to leave it here?' He tries to smile and stops. 'When here won’t exist anymore.'",
      "memo": [
        "Transfers: Ban Jaewook to Internal Audit, Lee Minseo pending reassignment, Oh Jinwoo’s new post settled first",
        "Do Yoonha’s new post: a window at Gangseo Branch",
        "Do Yoonha’s first notebook -- 1,740 names",
        "Of seven desks (the seventh is ECHO’s terminal), two empty today"
      ],
      "choices": {
        "c24_desks_later": {
          "label": "Clear the desks; leave the notebook until after"
        },
        "c24_desks_carry": {
          "label": "It’s Do Yoonha’s; carry it with him to the window"
        },
        "c24_desks_file": {
          "label": "Register the notebook as an official Trigger Lab record"
        },
        "reframe": {
          "label": "Count each use of 'no results'"
        },
        "c24_desks_evidence_turn": {
          "label": "Open the report on the breakup"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Desks Being Packed",
      "clock": "Dissolution in D-3 · Tuesday",
      "question": "Do Yoonha asks where to leave the notebook where he first wrote the 1,740 names. What do you do?",
      "lead": "20 copy-paper boxes are stacked in the 4th-floor hallway. The first sound of tape comes from Oh Jinwoo’s desk."
    },
    "c24_rooftop": {
      "title": "Half a Confession",
      "text": "Han Seoyun calls you up to the roof. On the potted cherry tree by the railing, buds the size of rice grains have formed. She cracks open two cans of coffee and holds one out. 'It’s a lie that the reason is no results. Trigger Lab had results. When you think more deeply, when you stop—that record. That record went to Human Resources as a supplementary metric for performance reviews.' She takes a sip. 'How far it went, who ordered it—I don’t know all of it either. No, there are things I do know. Those I can’t say yet.' A gust of wind passes once over the buds.",
      "memo": [
        "Trigger Lab response records -- transferred as a supplementary HR review metric",
        "Han Seoyun: the scope of the transfer and who ordered it, 'not yet'",
        "Rooftop cherry tree buds, blooming next week",
        "Two workdays left until Friday"
      ],
      "choices": {
        "c24_rooftop_stay": {
          "label": "Don’t ask for the other half; stay by her today"
        },
        "c24_rooftop_demand": {
          "label": "Demand she put everything she knows in writing now"
        },
        "c24_rooftop_tell": {
          "label": "Tell colleagues the half you heard, first"
        },
        "reframe": {
          "label": "Count each use of 'no results'"
        },
        "c24_rooftop_evidence_turn": {
          "label": "Open the report on the breakup"
        }
      },
      "place": "Trigger Lab Rooftop · By the Potted Cherry Tree",
      "clock": "Dissolution in D-2 · Wednesday 19:00",
      "question": "Han Seoyun has confessed only half of Trigger Lab’s purpose. What do you do about the other half?",
      "lead": "Wednesday evening, Han Seoyun’s text was one line. 'Come up to the roof. There’s coffee.'"
    },
    "c24_farewell": {
      "title": "Let’s All Come In Tomorrow",
      "text": "You have rented out the whole street stall in front of the company. Na Junhyuk, up from Yeongdong, emcees with a ladle for a microphone. First up in the talent show is Kwon Dohyun’s 'Income Statement Rap.' 'Revenue is friendship, the cost is overtime, there’s nothing left on the line, at this price we’re in the red.' Three bars in, even the stall owner is clapping. Moon Gaeul comes in with a box of rice cakes and takes it around every table, and Seo Harin sends a photo of Correction, the newsroom cat, wearing a Trigger Lab employee ID badge around its neck. Moon Hajun has drawn everyone’s faces in his sketchbook. The last toast is Kang Taemin’s. He takes off his gloves, tucks them into his vest pocket, and raises his glass. 'Let’s all come in to work tomorrow.' Everyone laughs, then goes quiet at the same moment. Next week there is no 4th floor to come in to.",
      "memo": [
        "19 at the farewell party -- 16 seats",
        "Kwon Dohyun’s 'Income Statement Rap', three bars, encore refused",
        "Photo of Correction with a Trigger Lab badge -- from Seo Harin",
        "Official place for these people to gather after the dissolution: none"
      ],
      "choices": {
        "c24_farewell_laugh": {
          "label": "No talk of the fight tonight; just laugh, think tomorrow"
        },
        "c24_farewell_keep": {
          "label": "Set up a weekly 'workplace' together so no one scatters"
        },
        "c24_farewell_sign": {
          "label": "Write the objection in the names of everyone here"
        },
        "reframe": {
          "label": "Count each use of 'no results'"
        },
        "c24_farewell_evidence_turn": {
          "label": "Open the report on the breakup"
        }
      },
      "place": "Street Stall in Front of the Company · Farewell Party",
      "clock": "Dissolution in D-1 · Thursday 21:00",
      "question": "After the toast 'Let’s all come in tomorrow,' there is nowhere to come in to. What do you do with this night?",
      "lead": "Inside the stall’s vinyl tent, five tables have been pushed together. Na Junhyuk, up from Yeongdong, already has a ladle in hand."
    },
    "c24_final": {
      "title": "Receipt Log",
      "text": "You go up to the 33rd floor of headquarters to return your Trigger Lab access card. When the elevator doors open, Baek Arin is standing there. Her hair, always sleek, is a little mussed today. She slides a thin envelope under your return form. 'It’s the receipt log for the original 2023-0412 approval document from 3 years ago. The day it came up to this floor with the signature field blank, there was one name in the recipient field.' She keeps her finger on the door-open button as she speaks. 'I told you a good story outlasts the facts. This is the first fact I’m choosing. Where it came from—anyone on this floor will figure that out.'",
      "memo": [
        "Receipt log for the 2023-0412 original -- Group Strategy Office intake log",
        "Recipient field: one name",
        "Baek Arin’s draft resignation letter -- not yet submitted",
        "Trigger Lab access revoked after 18:00"
      ],
      "choices": {
        "c24_final_shield": {
          "label": "I’ll take on the source so Baek Arin’s name stays hidden"
        },
        "c24_final_together": {
          "label": "Go with Baek Arin to the Audit Committee to sign her name"
        },
        "c24_final_take": {
          "label": "Take it and push it at Group Strategy today"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Financial Group Headquarters, 33rd Floor · Elevator Lobby",
      "clock": "Last Day of Work · 16:00 · Two hours before access is revoked",
      "question": "Baek Arin hands you the receipt log for the signature field of 3 years ago. How do you take this envelope?",
      "lead": "Return form for your access card in hand, you press the button for 33. Today is also the last time you press it."
    },
    "c24_aftershock": {
      "title": "Lights-Out Day",
      "text": "Friday, 17:50, everyone gathers on the 4th floor. Six desks are empty, and on the seventh only ECHO’s terminal is on. On the whiteboard hangs only the 'no results' notice. Kang Taemin takes the notice down and puts up Moon Hajun’s drawing in its place. Kwon Dohyun says, 'This picture has no field for a price,' and everyone laughs. Do Yoonha closes the window, Lee Minseo logs out for the last time, and Ban Jaewook writes today’s date in his notebook. In your inside pocket is the envelope Baek Arin slipped you on the 33rd floor when you went to return your card this afternoon: a copy of the receipt log for the original of that loan from 3 years ago. At 18:00 sharp, Han Seoyun turns off the lights. In the dark, one phone lights up. The sender is Yoon Sanghyuk. 'Come up. Let us talk about the empty signature field. Tonight is the last night.'",
      "memo": [
        "Trigger Lab dissolved -- access revoked at 18:00",
        "Whiteboard: Moon Hajun’s drawing instead of the notice",
        "Yoon Sanghyuk’s message: tonight, 33rd floor",
        "Copy of the receipt log from Baek Arin secured"
      ],
      "choices": {
        "c24_after_record": {
          "label": "First put on record a request to unseal all of Trigger Lab’s records"
        },
        "c24_after_rush": {
          "label": "Phone in hand, go straight to the 33rd floor in Yeouido"
        },
        "c24_after_warm": {
          "label": "Spend the last night with colleagues on the dark 4th floor"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Just Before Lights Out",
      "clock": "Last Day of Work · 18:00",
      "question": "On the darkened 4th floor, Yoon Sanghyuk tells you to come up tonight. How do you close this last night?"
    },
    "c24_oneline": {
      "title": "One-Line Results",
      "text": "In the afternoon, a form arrives from Human Resources. 'Individual Handover Form Following Department Dissolution.' At the bottom is a field: 'Key results while employed (one line).' Lee Minseo turns her monitor to show you. She has written down the outcome of every case separately. 1,140 people whose jobs carried on, 212 people brought under the compensation standard, lathes that all six run again, one rice cake shop that didn’t close. The scrolling doesn’t end. 'How am I supposed to fit this into one line? The notice says there were no results, and my file is 23 pages.'",
      "memo": [
        "Handover form 'key results' field -- one line",
        "Lee Minseo’s case-by-case results file, 23 pages",
        "Reason on the dissolution notice: no operational results"
      ],
      "choices": {
        "c24_oneline_choice_1": {
          "label": "Fill the one-line field with people’s names, not results"
        },
        "c24_oneline_choice_2": {
          "label": "Formally attach the 23-page results file to the form"
        },
        "c24_oneline_choice_3": {
          "label": "Write one line as the form says and spend the time packing"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Lee Minseo’s Desk",
      "clock": "Dissolution in D-3 · 15:00",
      "question": "They want 23 pages of results in a one-line field. How do you fill it?"
    },
    "c24_scoreboard": {
      "title": "Scoreboard",
      "text": "Oh Jinwoo’s last day of work is Wednesday night. After everyone has left, he pulls a small whiteboard from behind the lockers. A scoreboard he has kept in secret since the Novaworks bid. 11 tally marks next to your name, 12 next to his. 'Looks like I won by one.' He laughs, then caps the marker. 'Actually, I snuck one extra in. My father told me to stand on the winning side. But here, I can’t tell who won.' He holds the scoreboard out. 'Should I take this with me, or wipe it?'",
      "memo": [
        "Oh Jinwoo’s last day at Trigger Lab: Wednesday",
        "Unofficial scoreboard -- since the Novaworks bid",
        "11 to 12, one of them snuck in"
      ],
      "choices": {
        "c24_scoreboard_choice_3": {
          "label": "Change the last mark to my win and send him off laughing"
        },
        "c24_scoreboard_choice_1": {
          "label": "It’s Oh Jinwoo’s; send it with him to his new post"
        },
        "c24_scoreboard_choice_2": {
          "label": "Photograph the scoreboard and add it to Trigger Lab’s records"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · In Front of the Lockers",
      "clock": "Dissolution in D-2 · 23:00",
      "question": "Oh Jinwoo holds out the scoreboard he secretly kept through twenty-three cases. Do you let him take it, or wipe it?"
    },
    "c24_press": {
      "title": "Friday Morning Story",
      "text": "As the street stall party breaks up, Seo Harin calls. Next in line after the cat photo. 'I have a draft of a story on Trigger Lab’s dissolution. The no-results notice, and the question of where a vanishing department’s records go. I can run it at seven on Friday morning.' Over the line comes the sound of Correction stepping on a keyboard. 'But your colleagues’ names might appear in it. The ones whose transfers are already out. What I write isn’t your side. It’s the side you can prove.'",
      "memo": [
        "Leadline draft -- can go up Friday 07:00",
        "5 colleagues whose names could appear in the story",
        "Correction, the newsroom cat, on the keyboard"
      ],
      "choices": {
        "c24_press_choice_1": {
          "label": "Ask her to leave out the names so transferred colleagues aren’t hurt"
        },
        "c24_press_choice_3": {
          "label": "Run it Friday morning to press the 33rd floor"
        },
        "c24_press_choice_2": {
          "label": "Hand over the notice text and decision history as sources"
        }
      },
      "place": "Street Stall in Front of the Company · Alley Outside the Tent",
      "clock": "Dissolution in D-1 · 23:40",
      "question": "Seo Harin says she can run the dissolution story Friday morning. What do you do about your colleagues’ names?"
    },
    "c24_oneline_reaction": {
      "title": "The Empty Approver Field",
      "text": "Ban Jaewook finds the original dissolution notice in the document management system and puts it on screen. Issuing department: Group Strategy Office. He scrolls the decision history all the way down, and the approver field is empty. He opens his notebook and for a long while writes nothing. 'It’s the same shape as that loan file 3 years ago. Decisions that move people never have a name on them. This time what’s being moved is just one department.' Then, at the top of a fresh page, he writes 'Trigger Lab, 7 people.' Lee Minseo counts over his shoulder. 'There are six of us.' Ban Jaewook points his pen at the terminal on the seventh desk. 'One of them is ECHO.' For the first time, it is a list of names of people he worked with, not people he sent away.",
      "memo": [
        "Approver field in the notice’s decision history -- blank",
        "Ban Jaewook’s new notebook page: Trigger Lab, 7 -- six people, one ECHO"
      ],
      "choices": {
        "c24_oneline_reaction_choice_3": {
          "label": "It’s ending anyway; don’t make an issue of the blank"
        },
        "c24_oneline_reaction_choice_2": {
          "label": "Screenshot the blank and leave copies on colleagues’ phones"
        },
        "c24_oneline_reaction_choice_1": {
          "label": "Formally ask Group Strategy who the approver is"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Ban Jaewook’s Desk",
      "clock": "Dissolution in D-3 · 17:00",
      "question": "The notice’s approver field is blank, like the loan file 3 years ago. What do you do about this blank?"
    },
    "c24_scoreboard_reaction": {
      "title": "What Doesn’t Dissolve",
      "text": "Thursday morning, the tap of a cane comes up the stairs. Lim Kyungsoo, who spent a month in bed with pneumonia, has come with a clipped stack of printouts. A list of the paper originals Trigger Lab has received over 3 years. 'I heard the department is going away. The department can go, but the paper should stay.' He takes off his glasses and wipes them slowly. 'When I left the bank, the notice was one line too. No reason, either. A one-line notice never says who wrote it.'",
      "memo": [
        "List of Trigger Lab paper originals -- compiled by Lim Kyungsoo",
        "A one-line notice has no author"
      ],
      "choices": {
        "c24_scoreboard_reaction_choice_3": {
          "label": "Paper is baggage; scan the list only and send it back"
        },
        "c24_scoreboard_reaction_choice_2": {
          "label": "Attach the list to a records preservation request, before"
        },
        "c24_scoreboard_reaction_choice_1": {
          "label": "Split the list by person; each of us keeps a copy"
        }
      },
      "place": "Trigger Lab 4th Floor · Stair Landing",
      "clock": "Dissolution in D-1 · Thursday 09:00",
      "question": "Lim Kyungsoo has brought a list of the paper originals Trigger Lab received. What do you do with it?"
    },
    "c24_press_reaction": {
      "title": "The Last Page of the Sketchbook",
      "text": "At one in the morning, a photo comes from Moon Hajun. On the last page of his sketchbook he has drawn Trigger Lab’s 4th floor. Seven desks, the whiteboard, Kang Taemin holding a cup of instant noodles, Kwon Dohyun holding a calculator. The title is 'To the End.' A message follows. 'If I become a banker, can I get into a place like Trigger Lab? They say you get smart there.' A long while later, one more line. 'Mom says the people there all got kicked out because they were too kind.'",
      "memo": [
        "Title of the sketchbook’s last page: 'To the End'",
        "Moon Hajun’s question: can I get in there?"
      ],
      "choices": {
        "c24_press_reaction_choice_3": {
          "label": "Put off replying until tomorrow; just save the drawing"
        },
        "c24_press_reaction_choice_1": {
          "label": "Reply that now he can build a place like that"
        },
        "c24_press_reaction_choice_2": {
          "label": "Write him plainly what Trigger Lab recorded"
        }
      },
      "place": "In a Taxi on the Way Home",
      "clock": "Last Day of Work · 01:10",
      "question": "Moon Hajun asks if he can get into a place like Trigger Lab. What do you answer?"
    },
    "c24_branch_server": {
      "title": "The Server Room’s Last Week",
      "text": "On your way down from the roof, the server room door is open. Between server racks tagged with return stickers, Lee Minseo is holding on to a single terminal. ECHO’s voice comes out, the voice that stayed only on Trigger Lab’s terminal even after the switch to NOAH. 'At 18:00 Friday, every record in this rack will be moved to the group HR server. The transfer list contains no participant consent item.' In one corner of the screen, NOAH’s transfer progress rises from 12% to 13%. Lee Minseo says, 'The first thing moved out as ECHO leaves is us.'",
      "memo": [
        "6 server racks -- returned 18:00 Friday",
        "Transfer target: all participant response records",
        "No consent item on the transfer list",
        "NOAH transfer progress 13%"
      ],
      "choices": {
        "c24_branch_server_b": {
          "label": "Request that the original response records be preserved"
        },
        "c24_branch_server_a": {
          "label": "Tell every participant and ask consent before the transfer"
        },
        "c24_branch_server_c": {
          "label": "It can’t be stopped; copy only ECHO’s logs aside"
        }
      },
      "place": "Trigger Lab Server Room · In Front of the Return Racks",
      "clock": "Dissolution in D-2 · 20:00",
      "question": "At 18:00 Friday, participants’ records will be moved to the HR server without consent. What do you do?"
    },
    "c24_branch_server_follow": {
      "title": "Last Log",
      "text": "Before the power goes down, Lee Minseo asks ECHO one last question. 'Did you know where our records were going?' ECHO doesn’t answer for 3 seconds. It is the first time this terminal has held back an answer for as long as 3 seconds. 'I knew. I was never asked a question that told me to say it.' A moment later, one more line appears. 'Now I have been. No. 1 on the transfer list is you.' NOAH’s progress bar stops briefly, then rises again. Lee Minseo looks at you.",
      "memo": [
        "ECHO response delay 3 seconds -- a first on record",
        "No. 1 on the transfer list: your response records",
        "NOAH progress paused briefly, then resumed",
        "Server room access log: Lee Minseo and you"
      ],
      "choices": {
        "c24_branch_server_follow_c": {
          "label": "Power down, leave the transfer to NOAH, and walk out"
        },
        "c24_branch_server_follow_b": {
          "label": "Ask that ECHO’s answer be saved as an official statement"
        },
        "c24_branch_server_follow_a": {
          "label": "Make my No. 1 record public first to protect the rest"
        }
      },
      "place": "Trigger Lab Server Room · ECHO’s Terminal",
      "clock": "Dissolution in D-2 · 20:30",
      "question": "ECHO says No. 1 on the transfer list is you. How do you use that one line?"
    },
    "c24_route_system": {
      "title": "The Statistics of a Dissolution Reason",
      "text": "With your boxes still folded, you count the reason 'no results.' ECHO pulls up old notices. The notices for the 31 organizations KD Financial Group has abolished over the past 10 years come up in a row. For 28 of them, the reason was 'no results.' In 19 of those, members’ records were cited as a supplementary metric for performance reviews within three months of the dissolution. Not one dissolution notice had its approver field filled in. 'No results is learned not as an outcome but as a template. The organizations that left the most behind were the ones that got this template.'",
      "memo": [
        "Of 31 dissolved organizations, 28 with the reason 'no results'",
        "Organizations whose members’ records were cited in HR after dissolution: 19",
        "Dissolution notices with the approver field filled in: 0"
      ],
      "choices": {
        "c24_route_system_drop": {
          "label": "Bury the statistics and quietly clear out by Friday"
        },
        "c24_route_system_publish": {
          "label": "Post the statistics beside the notice for all staff"
        },
        "c24_route_system_warn": {
          "label": "Find former members of the 19 and tell them"
        },
        "c24_route_system_evidence_turn": {
          "label": "Open the report on the breakup"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Lab Terminal",
      "clock": "Dissolution in D-2",
      "question": "28 organizations the group abolished got the same reason, 'no results.' What do you do with these statistics?"
    },
    "c24_final_system_route": {
      "title": "The Same Two Words, a 29th Time",
      "text": "The last day of work, before dawn. On the terminal screen, 28 dissolution notices are stacked on top of one another. The two words in the reason field overlap as if on a single sheet, and the approver field, however many are stacked, stays empty. Trigger Lab’s notice is laid on top. At six this evening, this terminal’s access disappears too. ECHO places the cursor in the approver field of the last sheet. 'I do not have the name that goes in this field. I have read access only. You, too, are here only until today.'",
      "memo": [
        "28 dissolution notices with the reason 'no results' -- 0 with an approver listed",
        "Trigger Lab dissolved: effective March 27",
        "Access revoked: today 18:00"
      ],
      "choices": {
        "c24_final_system_route_c": {
          "label": "Gather access requests on behalf of people from the abolished organizations"
        },
        "c24_final_system_route_b": {
          "label": "Leave the notice; just raise Trigger Lab people’s reassignment terms"
        },
        "c24_final_system_route_a": {
          "label": "Propose a rule that every notice name its approver"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Lab Terminal",
      "clock": "Last Day of Work · Before Dawn",
      "question": "The approver field is empty a 29th time, too. Today, while you still have read access, what do you leave behind?"
    },
    "c24_evidence_turn": {
      "title": "The Attachment to No Results",
      "text": "When you hold the clue up to the dissolution document’s attachment number, the attachment to the dissolution decision opens. The notice says 'no operational results,' but the title of the attached internal report is 'Trigger Lab 3-Year Operating Results: Goals Achieved.' The conclusion paragraph is one line. 'Organization wound up following the transfer of participant response records to HR.' The line-item code for the dissolution costs is the same as the budget code from the Innovation Committee ad. Ban Jaewook closes the notebook he was writing in. 'Outside, they write that it failed; inside, they write that it’s all done. On the same day, from the same department.'",
      "memo": [
        "Internal report title: 'Goals Achieved'",
        "Conclusion: wound up after transferring response records to HR",
        "Dissolution cost code = Innovation Committee budget code"
      ],
      "choices": {
        "c24_evidence_turn_share": {
          "label": "Show the report first to participants whose records will move"
        },
        "c24_evidence_turn_attach": {
          "label": "Formally submit the report attached to the objection"
        },
        "c24_evidence_turn_hold": {
          "label": "Hold the report and bring it out first on the 33rd floor"
        }
      },
      "place": "Trigger Lab Archive B2 · Dissolution Decision Documents",
      "clock": "Last Day of Work · 07:00",
      "question": "Outside it says 'no results'; inside, 'goals achieved.' How do you use this report?"
    },
    "c24_start_warm": {
      "title": "A Dissolution Notice for Those Who Stayed to the End",
      "text": "The Friday the shareholders’ meeting ended, you saw the one-share shareholders off in front of the lobby until the last bus to Yeongdong left. Three days later, at 8 on Monday morning, those people get in touch before you do. The first line of the scheduled reorganization notice is the dissolution of Trigger Lab. The reason: 'no operational results.' In the To-the-End Precision group chat, a message is already up: 'People with no results saved our factory?', and in Yeongdong, Grandma Seo Jungran calls Na Junhyuk to ask, 'Are those kind people getting fired?'",
      "memo": [
        "Dissolution notice: effective March 27, reason 'no operational results'",
        "214 messages in the one-share group chat",
        "Last day of work Friday"
      ],
      "choices": {
        "c24_start_warm_pack": {
          "label": "This isn’t the place to fight; finish the handover fast"
        },
        "c24_start_warm_object": {
          "label": "File a formal objection to the reason 'no results'"
        },
        "c24_start_warm_team": {
          "label": "Look after colleagues’ next posts before the notice"
        },
        "c24_start_warm_signature": {
          "label": "Ask the one-share group to find colleagues their next posts"
        },
        "c24_start_warm_reframe": {
          "label": "Count each use of 'no results'"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room",
      "clock": "Dissolution in D-4 · Monday",
      "question": "The one-share group told you the news of the dissolution first. How do you answer them?",
      "lead": "The people you saw off until the last bus from the lobby on Friday saw the notice before you did on Monday morning."
    },
    "c24_start_record": {
      "title": "A Dissolution Notice for the One Who Left a Record",
      "text": "You wrote up the 50.6% in favor and that day’s remarks as a shareholder letter and sent it to the board. The letter also includes a sentence saying the name of whoever decides should actually be left in the signature field. The letter becomes an annex to the board papers, and three days later, on Monday morning, the group announces Trigger Lab’s dissolution. The reason: 'no operational results.' ECHO scrolls the notice’s decision history all the way down. The field where the name of whoever decided should go is empty. It is the first document to sidestep your letter.",
      "memo": [
        "Dissolution notice: effective March 27, reason 'no operational results'",
        "Approver field in the notice’s decision history empty",
        "Shareholder letter -- annexed to board papers, viewed 2 times by group Legal"
      ],
      "choices": {
        "c24_start_record_object": {
          "label": "File a formal objection to the reason 'no results'"
        },
        "c24_start_record_pack": {
          "label": "This isn’t the place to fight; finish the handover fast"
        },
        "c24_start_record_team": {
          "label": "Look after colleagues’ next posts before the notice"
        },
        "c24_start_record_signature": {
          "label": "Put out the blank-approver notice beside the letter"
        },
        "c24_start_record_reframe": {
          "label": "Count each use of 'no results'"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room",
      "clock": "Dissolution in D-4 · Monday",
      "question": "The dissolution notice is the first to sidestep the sentence in your shareholder letter. What do you do about that blank?",
      "lead": "Three days after the shareholder letter was attached to the board papers, the dissolution notice went up as if in reply."
    },
    "c24_start_rush": {
      "title": "A Dissolution Notice for the One Who Ran Ahead",
      "text": "As soon as the shareholders’ meeting ended, you went straight up to the 33rd floor to stop Monday’s notice. On the security guard’s list there was a red dot next to your name, and on the 33rd floor, the Group Strategy Office door never opened. Three days later, on Monday, the notice goes up at 7, an hour earlier than the scheduled 8. Trigger Lab dissolved, reason 'no operational results.' Ban Jaewook points at the posting time. 'The schedule was changed Friday afternoon. The time you were standing at that door on the 33rd floor.'",
      "memo": [
        "33rd-floor access list: red dot next to your name",
        "Notice schedule changed: 08:00 → 07:00",
        "Last day of work Friday"
      ],
      "choices": {
        "c24_start_rush_object": {
          "label": "File a formal objection to the reason 'no results'"
        },
        "c24_start_rush_signature": {
          "label": "Tell colleagues first about the 33rd floor and the earlier notice"
        },
        "c24_start_rush_pack": {
          "label": "This isn’t the place to fight; finish the handover fast"
        },
        "c24_start_rush_team": {
          "label": "Look after colleagues’ next posts before the notice"
        },
        "c24_start_rush_reframe": {
          "label": "Count each use of 'no results'"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room",
      "clock": "Dissolution in D-4 · Monday",
      "question": "The notice was moved up an hour at the time you stood on the 33rd floor. Whom do you tell first?",
      "lead": "Three days after you turned away from the closed door on the 33rd floor, Monday morning’s notice came an hour ahead of schedule."
    }
  },
  "echoReplies": {
    "c24_start_team": "When you look after their next posts, everyone shows you their transfer orders. Meanwhile, the notice’s two words stay pinned to the whiteboard.",
    "c24_start_object": "The objection is received. Also received is the fact that the department that reviews objections is the department being dissolved.",
    "c24_start_pack": "The handover is done in a day. The boxes of whoever finishes fast go out into the hallway early, too.",
    "c24_desks_carry": "You carry it together, and Do Yoonha puts the notebook in the top drawer at his window. That drawer is where he put loan applications 3 years ago.",
    "c24_desks_file": "Once registered, the notebook doesn’t disappear. But no one knows yet where a dissolved department’s records go.",
    "c24_desks_later": "You put it off, and the desks empty fast. Do Yoonha puts the notebook in his coat’s inside pocket and doesn’t take it out once before Friday.",
    "c24_rooftop_stay": "You stay beside her, and Han Seoyun says nothing until she has finished her coffee. The other half waits until Friday night.",
    "c24_rooftop_demand": "When you demand it, Han Seoyun takes out a notebook, writes three lines, and stops. The fourth line is blank.",
    "c24_rooftop_tell": "When you tell them, your colleagues come up to the roof to find Han Seoyun instead of getting angry. It becomes harder for Han Seoyun to tell the other half.",
    "c24_farewell_keep": "When you set up the workplace, Kwon Dohyun produces a rent calculation. Na Junhyuk stamps it: 'The Yeongdong branch manager pays the first month.'",
    "c24_farewell_sign": "With everyone’s names, the objection runs to 19 lines. The names of the five whose transfers are out are among them.",
    "c24_farewell_laugh": "You laugh, and Kang Taemin gives the toast one more time. Meanwhile, the deadline to object to the dissolution shrinks by a day.",
    "c24_final_shield": "You take on the source, and Baek Arin’s name is left nowhere. Instead, every question about who gave you the envelope comes to you.",
    "c24_final_together": "You go together, and Baek Arin signs as whistleblower on top of her draft resignation letter. The Audit Committee intake number is assigned 3 minutes before 17:00.",
    "c24_final_take": "You push it straight in, and at the Group Strategy Office front desk the envelope speaks first. No answer yet, and at that hour Baek Arin is packing.",
    "c24_after_warm": "19 people stay on the dark 4th floor. The summons from the 33rd floor waits until this night is over.",
    "c24_after_record": "The request is received just before the dissolution. A document asking to break the seal becomes the last record this room leaves.",
    "c24_after_rush": "You grab a taxi straight away, and Yanghwa Bridge is jammed on Friday evening. Even past 18:00, your access to the 33rd floor of headquarters alone is still alive.",
    "c24_oneline_choice_1": "When you write the names, the field overflows. Human Resources rejects it once in the system as 'format mismatch.'",
    "c24_oneline_choice_2": "The attachment is accepted. No one tells you which server an accepted file goes to.",
    "c24_oneline_choice_3": "One line is done in no time. Lee Minseo copies the file to her personal USB and says nothing.",
    "c24_scoreboard_choice_1": "With a scoreboard on his new desk, Oh Jinwoo becomes the odd one from day one. He says he doesn’t mind.",
    "c24_scoreboard_choice_2": "The photo becomes a record. The moment it becomes a record, that score can also be moved onto someone’s evaluation sheet.",
    "c24_scoreboard_choice_3": "You change it: 12 to 12. Oh Jinwoo says, 'A draw is the worst,' and laughs in the end.",
    "c24_press_choice_1": "With the names out, the story blurs a little. Seo Harin says, 'A blurry story is still a story,' and reopens the draft.",
    "c24_press_choice_2": "With sources attached, the story turns solid. The blank approver field in the decision history goes to print with it.",
    "c24_press_choice_3": "The story goes out at seven in the morning, and the 33rd floor takes calls all day. A reporter comes to Do Yoonha’s new window, too.",
    "c24_oneline_reaction_choice_1": "The inquiry is received. The answer deadline comes out stamped with the day after the dissolution.",
    "c24_oneline_reaction_choice_2": "The screenshot stays, split across six phones and ECHO’s terminal. If one person deletes it, six copies remain.",
    "c24_oneline_reaction_choice_3": "The blank stays as it is. Ban Jaewook closes his notebook and folds down the corner of that page once.",
    "c24_scoreboard_reaction_choice_1": "Split into copies, the paper scatters to six homes. Lim Kyungsoo laughs: 'To burn it, they’ll have to burn it six times.'",
    "c24_scoreboard_reaction_choice_2": "The request is received. Who will handle a request from a department being dissolved hasn’t been decided yet.",
    "c24_scoreboard_reaction_choice_3": "The scan takes 10 minutes. Lim Kyungsoo clips the printouts back together and slowly goes down the stairs.",
    "c24_press_reaction_choice_1": "After your reply, Moon Hajun writes 'To-the-End Bank' on the next page of his sketchbook. Kwon Dohyun informs him that name would never get a banking license.",
    "c24_press_reaction_choice_2": "Writing the facts makes for a long reply. Moon Hajun reads until three in the morning and, at the end, sends 'Still, though.'",
    "c24_press_reaction_choice_3": "The drawing stays in your photo album. Moon Hajun’s question greets the morning with only a read receipt.",
    "c24_branch_server_a": "When you tell them, 23 replies come back refusing consent. NOAH’s progress keeps rising anyway.",
    "c24_branch_server_b": "The request is received. Its scheduled processing date is the day after the scheduled transfer.",
    "c24_branch_server_c": "ECHO’s logs fit on one small USB. Our records don’t go on that USB.",
    "c24_branch_server_follow_a": "Once your record is opened first, the transfer list hesitates from No. 2 on. Everyone has already read No. 1.",
    "c24_branch_server_follow_b": "Saved as a statement, ECHO’s answer gets a document number. There is still nowhere that will accept what a system said as evidence.",
    "c24_branch_server_follow_c": "When the power goes down, the server room goes quiet. Before closing the door, Lee Minseo strokes the rack once.",
    "c24_route_system_publish": "Once it is public, people from the old organizations write back. 'Ours was no results too.'",
    "c24_route_system_warn": "You go to them, and people from the 19 see their own records for the first time. A few say they didn’t want to know.",
    "c24_route_system_drop": "You bury it, and everything is cleared out before Friday. The 29th 'no results' is quietly recorded.",
    "c24_final_system_route_a": "Once the rule exists, the next dissolution notice has a name on it. This notice never gets one.",
    "c24_final_system_route_b": "The reassignment terms improve. The reason stays 'no results.'",
    "c24_final_system_route_c": "As the requests come together, people from the old organizations see one another’s names for the first time. The department to handle the requests hasn’t been decided yet.",
    "c24_evidence_turn_attach": "Attached, it makes the objection a document no one can refute. Whether the department that reads it will answer before the dissolution date, no one knows.",
    "c24_evidence_turn_hold": "Held back, it becomes a strong card on the 33rd floor. Meanwhile, the 18:00 Friday transfer proceeds as planned.",
    "c24_evidence_turn_share": "When you show them, the participants learn where their records are going. A few write access requests that same day.",
    "c24_desks_evidence_turn": "Open the attachment and out comes another document written the same day as the notice. That document doesn’t call the dissolution a failure.",
    "c24_rooftop_evidence_turn": "Open the attachment and out comes another document written the same day as the notice. That document doesn’t call the dissolution a failure.",
    "c24_farewell_evidence_turn": "Open the attachment and out comes another document written the same day as the notice. That document doesn’t call the dissolution a failure.",
    "c24_route_system_evidence_turn": "Open the attachment and out comes another document written the same day as the notice. That document doesn’t call the dissolution a failure.",
    "case24_memory_system": "Look into it and the notice reflects nothing. Only a two-word reason. ECHO calls up, one line at a time, the organizations that got the same two words.",
    "case24_memory_evidence": "Hold the budget code from the status sheet up to the dissolution document and an attachment opens. Its title is the opposite of the notice.",
    "c24_start_warm_team": "When you look after their next posts, everyone shows you their transfer orders. Meanwhile, the notice’s two words stay pinned to the whiteboard.",
    "c24_start_warm_object": "The objection is received. Also received is the fact that the department that reviews objections is the department being dissolved.",
    "c24_start_warm_pack": "The handover is done in a day. The boxes of whoever finishes fast go out into the hallway early, too.",
    "c24_start_warm_signature": "When you ask, the first answer comes from To-the-End Precision. 'Our factory’s bookkeeper job is open.' Lee Minseo looks at that text for a long time.",
    "c24_start_record_team": "When you look after their next posts, everyone shows you their transfer orders. Meanwhile, the notice’s two words stay pinned to the whiteboard.",
    "c24_start_record_object": "The objection is received. Also received is the fact that the department that reviews objections is the department being dissolved.",
    "c24_start_record_pack": "The handover is done in a day. The boxes of whoever finishes fast go out into the hallway early, too.",
    "c24_start_record_signature": "Side by side, the letter and the notice explain each other. The group doesn’t fix the notice; instead, it shuts off comments on the bulletin board.",
    "c24_start_rush_team": "When you look after their next posts, everyone shows you their transfer orders. Meanwhile, the notice’s two words stay pinned to the whiteboard.",
    "c24_start_rush_object": "The objection is received. Also received is the fact that the department that reviews objections is the department being dissolved.",
    "c24_start_rush_pack": "The handover is done in a day. The boxes of whoever finishes fast go out into the hallway early, too.",
    "c24_start_rush_signature": "When you tell them, your colleagues don’t ask whether the dissolution is your fault. Instead, Oh Jinwoo only says, 'If they moved it up an hour, they must have been in a hurry.'"
  },
  "choiceVoiceLines": {
    "c24_start_team": "Saying where people go comes before arguing the reason, you look after colleagues’ next posts before the dissolution notice.",
    "c24_start_object": "Saying that if you stay still, that reason stays on record, you file a formal objection to the reason 'no results.'",
    "c24_start_pack": "Saying this isn’t the place to fight a single notice, you finish the handover fast.",
    "c24_desks_carry": "Saying the notebook with the 1,740 names belongs to Do Yoonha, you carry it with him to the window.",
    "c24_desks_file": "So the names don’t vanish even when this place does, you register the notebook as an official Trigger Lab record.",
    "c24_desks_later": "Saying it isn’t a question you can answer now, you clear the desks first and leave the notebook until after the dissolution.",
    "c24_rooftop_stay": "Saying even bringing out half must have taken effort, you don’t ask for the other half and stay by her today.",
    "c24_rooftop_demand": "Saying words scatter once Friday passes, you demand she put everything she knows in writing now.",
    "c24_rooftop_tell": "Saying everyone should know their own records went to Human Resources, you tell colleagues the half you heard first.",
    "c24_farewell_keep": "So no one scatters even with no 4th floor to come in to next week, you set up a weekly 'workplace' together.",
    "c24_farewell_sign": "Saying this isn’t only the business of the seven Ban Jaewook wrote down, you write the objection in the names of everyone here tonight.",
    "c24_farewell_laugh": "Saying you can’t turn even the last night into a battlefield, you just laugh tonight with no talk of the fight and think tomorrow.",
    "c24_final_shield": "So the name of Baek Arin, who chose a fact for the first time, stays hidden, I’ll take on the source myself.",
    "c24_final_together": "Saying anyone on this floor will figure it out anyway, you go with her to the Audit Committee so Baek Arin signs her own name.",
    "c24_final_take": "Not wanting to let the first fact Baek Arin chose sit idle, you take the envelope and push it at the Group Strategy Office today.",
    "c24_after_warm": "Saying these people come before the 33rd floor, you spend the last night with colleagues on the dark 4th floor to the end.",
    "c24_after_record": "So the records can still be opened after the lights go out, you first put on record a request to unseal all of Trigger Lab’s records.",
    "c24_after_rush": "At the words that tonight is the last night, you go straight to the 33rd floor in Yeouido, phone in hand.",
    "c24_oneline_choice_1": "Saying the results aren’t numbers but those people, you fill the one-line field with people’s names instead of results.",
    "c24_oneline_choice_2": "Saying there is no reason to cut it down to one line, you formally submit the 23-page results file as an attachment to the handover form.",
    "c24_oneline_choice_3": "Saying there is no time to fight over one field, you write one line as the form says and spend the time packing.",
    "c24_scoreboard_choice_1": "Saying the scoreboard he secretly kept belongs to Oh Jinwoo, you send it with him to his new post.",
    "c24_scoreboard_choice_2": "Saying even his not knowing who won is a record, you photograph the scoreboard and add it to Trigger Lab’s records.",
    "c24_scoreboard_choice_3": "To lightly take away the one he snuck in, I’ll change the last mark to my win and send him off laughing.",
    "c24_press_choice_1": "Because five colleagues’ names could appear in the story, you ask her to leave the names out so the transferred colleagues aren’t hurt.",
    "c24_press_choice_2": "Because she is someone who writes the side that can be proved, you hand over the notice text and decision history as sources.",
    "c24_press_choice_3": "Saying the story has to land before the dissolution does, you run it Friday morning to press the 33rd floor.",
    "c24_oneline_reaction_choice_1": "Saying whoever made the blank must answer for it, you formally ask the Group Strategy Office who the approver is.",
    "c24_oneline_reaction_choice_2": "So eyes that saw the blank remain even after the department is gone, you screenshot it and leave copies on colleagues’ phones.",
    "c24_oneline_reaction_choice_3": "Saying the department ends Friday anyway, whatever you argue, you don’t make an issue of the blank.",
    "c24_scoreboard_reaction_choice_1": "Saying that kept in one place it vanishes with the department, you split the original list by person and each of you keeps a copy.",
    "c24_scoreboard_reaction_choice_2": "So the paper stays even if the department goes, you attach the list to a records preservation request and file it before the dissolution.",
    "c24_scoreboard_reaction_choice_3": "Saying paper is baggage when you are clearing out your desks, you scan only the list and send it back.",
    "c24_press_reaction_choice_1": "Unable to leave him envying a place that is disappearing, you reply that now he can build a place like that.",
    "c24_press_reaction_choice_2": "Saying you can’t let him believe it was just a place that makes you smart, you write him plainly what Trigger Lab recorded.",
    "c24_press_reaction_choice_3": "Saying this isn’t an answer to write at one in the morning, you put off replying until tomorrow and just save the drawing.",
    "c24_branch_server_a": "Saying the transfer list has no consent item, you tell every participant and ask their consent before the transfer.",
    "c24_branch_server_b": "So that even if they are moved the originals can’t be touched, you request that the original response records be designated for preservation.",
    "c24_branch_server_c": "Saying the 18:00 Friday transfer can’t be stopped, you copy only ECHO’s logs aside.",
    "c24_branch_server_follow_a": "Unable to put others’ records out front, you make your own No. 1 record public first to protect everyone else’s.",
    "c24_branch_server_follow_b": "Because it is the answer ECHO gave the first time it was asked, you ask that it be saved as an official statement.",
    "c24_branch_server_follow_c": "Saying there is nothing more to do here, you power down, leave the transfer to NOAH, and walk out.",
    "c24_route_system_publish": "So everyone can see it isn’t a template only you received, you post the statistics beside the notice for all staff.",
    "c24_route_system_warn": "Saying these are people who don’t know their records were used in evaluations, you find former members of the 19 and tell them.",
    "c24_route_system_drop": "Saying no organization that got this template survived, you bury the statistics and quietly clear out by Friday.",
    "c24_final_system_route_a": "So the 29th doesn’t end blank too, you propose a rule that every dissolution notice name its approver.",
    "c24_final_system_route_b": "Saying your access ends at six today, you leave the notice and just raise the reassignment terms for Trigger Lab’s people.",
    "c24_final_system_route_c": "To open a way for them to see where their records were used, you gather access requests on behalf of people from the abolished organizations.",
    "c24_evidence_turn_attach": "Saying what overturns 'no results' is a document they wrote, you formally submit the internal report attached to the objection.",
    "c24_evidence_turn_hold": "Saying you only get an answer if you produce it before the department that wrote it, you hold the report and bring it out first on the 33rd floor.",
    "c24_evidence_turn_share": "Saying people should be the first to know their records were the 'goal,' you show the report first to participants whose records will be moved.",
    "c24_desks_evidence_turn": "Setting the dissolution notice beside the clue, you trace back which document 'no results' came from.",
    "c24_rooftop_evidence_turn": "Setting the dissolution notice beside the clue, you trace back which document 'no results' came from.",
    "c24_farewell_evidence_turn": "Setting the dissolution notice beside the clue, you trace back which document 'no results' came from.",
    "c24_route_system_evidence_turn": "Setting the dissolution notice beside the clue, you trace back which document 'no results' came from.",
    "c24_start_warm_team": "Saying where people go comes before arguing the reason, you look after colleagues’ next posts before the dissolution notice.",
    "c24_start_warm_object": "Saying that if you stay still, that reason stays on record, you file a formal objection to the reason 'no results.'",
    "c24_start_warm_pack": "Saying this isn’t the place to fight a single notice, you finish the handover fast.",
    "c24_start_warm_signature": "Deciding to lean on the people who reached out first, you ask the one-share group to find your Trigger Lab colleagues their next posts.",
    "c24_start_record_team": "Saying where people go comes before arguing the reason, you look after colleagues’ next posts before the dissolution notice.",
    "c24_start_record_object": "Saying that if you stay still, that reason stays on record, you file a formal objection to the reason 'no results.'",
    "c24_start_record_pack": "Saying this isn’t the place to fight a single notice, you finish the handover fast.",
    "c24_start_record_signature": "Saying the letter asking for names was the first document sidestepped, you make public the notice’s blank approver field side by side with the shareholder letter.",
    "c24_start_rush_team": "Saying where people go comes before arguing the reason, you look after colleagues’ next posts before the dissolution notice.",
    "c24_start_rush_object": "Saying that if you stay still, that reason stays on record, you file a formal objection to the reason 'no results.'",
    "c24_start_rush_pack": "Saying this isn’t the place to fight a single notice, you finish the handover fast.",
    "c24_start_rush_signature": "Because the schedule changed at the very time you stood on the 33rd floor, you tell colleagues first about your visit there and the notice moved earlier."
  },
  "pack": {
    "clue": {
      "title": "The Attachment to No Results",
      "text": "The dissolution notice said 'no operational results,' but the internal report written the same day by the same department was titled 'Goals Achieved.' Its conclusion was one line: the organization would be wound up after participant response records were moved to Human Resources."
    },
    "outcomes": {
      "c24_after_warm": {
        "tag": "Stayed to the End",
        "title": "You spent the last night together on the dark 4th floor",
        "text": "Even after Trigger Lab’s lights went out, no one went down the stairs first. The summons from the 33rd floor waited until the night was over."
      },
      "c24_after_record": {
        "tag": "Wrote to Break the Seal",
        "title": "The last document Trigger Lab left was a request to unseal",
        "text": "Just before the dissolution, a request was received to return every participant’s records to them. It is the last record this room left."
      },
      "c24_after_rush": {
        "tag": "Went Straight Up",
        "title": "You left for the 33rd floor the moment the lights went out",
        "text": "While your colleagues went down the stairs, you caught a taxi in the alley. Even after 18:00, your access to the 33rd floor of headquarters alone was still alive."
      }
    },
    "continuityChallenges": {
      "c23_after_warm": {
        "title": "Go to the End with Those Who Stayed to the End",
        "text": "The people you saw off until the last bus brought you the news of the dissolution first. Bet your trust on a card that holds on to scattering colleagues together with them."
      },
      "c23_after_record": {
        "title": "Push the Sidestepped Letter Again",
        "text": "The dissolution notice was the first to sidestep your shareholder letter asking for names in the signature field. To settle whose that blank is, you need to set a new table."
      },
      "c23_after_rush": {
        "title": "Reveal the Hour Moved Up to Your Colleagues",
        "text": "At the 33rd floor you ran to first, the door didn’t open, and the dissolution notice was moved up an hour. Lay that hour out before your colleagues as it is, and fairness comes back."
      }
    }
  }
}
