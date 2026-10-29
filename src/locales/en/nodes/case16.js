/**
 * 사건 16 (src/nodes/case16.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c16_start": {
      "title": "4:12 a.m.",
      "text": "The morning of the first snow, Kang Taemin comes up to the Trigger Lab 4th floor in daylight for the first time. Snow on the shoulders of his hi-vis vest melts and spreads. Instead of a greeting, he holds out his phone. '[FlowOn] This is to inform you that your contract ends as of December 31. Thank you for all your hard work.' Sent at 4:12 a.m., when the 80 people on the night shift were carrying boxes. The FlowOn fulfillment center is bringing in 120 logistics robots, on a KD Capital lease. Kang Taemin pulls off his gloves and tucks them into his vest pocket. 'I’m fine. 30 of the 80 aren’t.'",
      "memo": [
        "Termination notice: 1 text message, 4:12 a.m.",
        "Night shift of 80 -- contracts end December 31",
        "120 logistics robots on a KD Capital lease, 340 million won a month",
        "6 days to the lease approval committee"
      ],
      "choices": {
        "c16_start_severance": {
          "label": "If it can’t be stopped, push the severance up fast"
        },
        "c16_start_lease": {
          "label": "Read the lease application and terms line by line"
        },
        "c16_start_night": {
          "label": "Go to the night-shift break room tonight and meet the 80"
        },
        "reframe": {
          "label": "Add the let-go, 1 year later"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Late November · First snow · Lease approval committee D-6",
      "question": "The night shift of 80 got termination texts while they were working. What do you do first?",
      "lead": "The morning of the first snow, the night-shift foreman comes up in daylight for the first time, and the analyst room goes quiet for a moment."
    },
    "c16_duel": {
      "title": "Kang Taemin vs. Darami",
      "text": "Four robots on trial run move between the shelves of Building B. The night shift has named one of them 'Darami'. The two orange lights on its front look like a squirrel’s cheeks stuffed with acorns, they say. Choi Seojin from KD Capital, out for the on-site lease review, stands with her tablet when Yoo Haon, the youngest, sets up a match. 'Foreman vs. Darami, 30-minute picking contest!' Result: Kang Taemin 212 orders, Darami 198. The break room erupts. Then, as Kang Taemin grabs his back and sinks down, Darami beeps and picks order 199. Choi Seojin says quietly, 'That robot has no back. That’s why they want it.'",
      "memo": [
        "4 robots on trial run -- 120 planned",
        "30-minute contest: Kang Taemin 212 · Darami 198",
        "Darami uptime: 22 hours a day, 2 hours charging",
        "Choi Seojin: KD Capital lease reviewer, on-site review"
      ],
      "choices": {
        "c16_duel_data": {
          "label": "Ask for the contest and accident records as review data"
        },
        "c16_duel_faces": {
          "label": "Introduce the 80 to Choi Seojin one by one"
        },
        "c16_duel_ask": {
          "label": "Ask Choi Seojin whose day changes when the robots come"
        },
        "reframe": {
          "label": "Add the let-go, 1 year later"
        },
        "c16_duel_evidence_turn": {
          "label": "Find who asked for the 80 cuts"
        }
      },
      "place": "FlowOn fulfillment center · Floor, Building B",
      "clock": "First snow · 02:10 · Approval committee D-5",
      "question": "A man beat the robot but sank down clutching his back. What do you show the lease reviewer?",
      "lead": "You hang a borrowed night-shift badge around your neck, and two orange lights come toward you between the shelves."
    },
    "c16_review": {
      "title": "The Erased Opinion Field",
      "text": "Choi Seojin lets you in after everyone has gone home. On the screen is the FlowOn lease review report, and the 'reviewer opinion' field at the bottom says only 'Nothing of note.' Choi Seojin opens, on her own laptop, the original she submitted three days ago. 'Recommend phased transition of night staff, conditional on retraining.' There were six lines. 'My team head says he tidied it up before it went to the committee. Because the members are busy.' She tries to smile and stops. 'My mom sorted parcels for 12 years and had wrist surgery twice. That’s why I studied robotics, and that’s why I do this job. But is it normal for my opinion to just vanish like this?' You have known the answer to that question for 3 years.",
      "memo": [
        "Original report: 6 lines of opinion · submitted version: 'Nothing of note'",
        "Edited by: Lease Review Team 2 head, the day after Choi Seojin submitted",
        "Choi Seojin: robotics major, 3rd year at the company",
        "3 years ago your dissent vanished from the same field"
      ],
      "choices": {
        "c16_review_sign": {
          "label": "Tell her to resubmit the original and sign it herself"
        },
        "c16_review_quiet": {
          "label": "Use the opinion only in talks; keep Choi Seojin hidden"
        },
        "c16_review_trace": {
          "label": "Tell the committee about the edit history"
        },
        "reframe": {
          "label": "Add the let-go, 1 year later"
        },
        "c16_review_evidence_turn": {
          "label": "Find who asked for the 80 cuts"
        }
      },
      "place": "KD Capital, Euljiro, 11th floor · Lease Review Team meeting room",
      "clock": "Approval committee D-4 · 21:30",
      "question": "A young reviewer’s six lines vanished exactly the way your opinion did 3 years ago. What do you tell her?",
      "lead": "You get a visitor pass at the security desk and go up; on the 12th floor only one meeting room has its lights on."
    },
    "c16_roof": {
      "title": "The Second Cup of Noodles",
      "text": "Snow piles up again on the center’s roof railing. Kang Taemin pours water from a thermos into two cups of instant noodles. 'Remember that night? The 72 hours when FlowOn was supposed to go under.' You remember. Back then, when no one from the bank ever came at night, he tore open a second cup and handed it to you. 'That was Jungwoo’s, actually. We started together the first year. He always forgot to bring his, so I bought two. He collapsed on the night shift 4 years ago. Never got it recognized as a workplace injury.' He holds out the steaming cup. 'The company wants me to stay. I’m the foreman, so I’m first of the six who’ll watch the robots. But if 74 go and six stay, who do I give the second one to?'",
      "memo": [
        "Offer to stay: 6 robot-control staff, Kang Taemin on the first line",
        "Jungwoo: started the same first year, collapsed on night duty 4 years ago",
        "Workplace injury denied -- reason: insufficient link to work",
        "Snow on the roof: 2cm"
      ],
      "choices": {
        "c16_roof_criteria": {
          "label": "Check first how the six who stay were chosen"
        },
        "c16_roof_inside": {
          "label": "Ask him to stay and open a way back for the 74"
        },
        "c16_roof_beside": {
          "label": "Say you’ll stand by him whatever he decides"
        },
        "reframe": {
          "label": "Add the let-go, 1 year later"
        },
        "c16_roof_evidence_turn": {
          "label": "Find who asked for the 80 cuts"
        }
      },
      "place": "FlowOn fulfillment center · Roof",
      "clock": "First snow · 04:30 · Approval committee D-2",
      "question": "Kang Taemin has been offered to stay alone, and the person to give the second cup to is disappearing. What do you ask of him?",
      "lead": "The break room is too quiet, so Kang Taemin takes his thermos and climbs the roof stairs first."
    },
    "c16_final": {
      "title": "120 Robots and 80 People",
      "text": "The KD Capital lease approval committee. Five members sit at a long table, and the wall screen shows the rollout schedule for 120 robots. In the reviewer’s seat, Choi Seojin grips a tablet with her original opinion on it in both hands. Snow has been falling outside for two days, and on the lobby sofa sits Kang Taemin in his hi-vis vest, straight off the night shift. The chair reads the agenda. 'As proposed, approval today and operation from January 2.' What Kang Taemin said in the corridor just before the meeting is still in your ears. 'Let the robots come. Better they do the lifting than Jungwoo’s back. But the door we leave by can’t be one text message.' The chair looks at you. You have 5 minutes.",
      "memo": [
        "Proposal: lease of 120 robots · condition 'night staff of 80 let go within the year'",
        "Changing the condition raises the lease fee 4% -- FlowOn may go to another lessor",
        "If approved, operation from January 2",
        "Choi Seojin has her 6-line original opinion"
      ],
      "choices": {
        "c16_final_severance": {
          "label": "Accept approval and double the severance terms"
        },
        "c16_final_block": {
          "label": "Block approval over the erased opinion and staff-cut condition"
        },
        "c16_final_phase": {
          "label": "Approve with phased transition and retraining in the lease"
        },
        "reframe": {
          "label": "Reframe the table and propose, one last time"
        }
      },
      "place": "KD Capital · Lease approval committee room",
      "clock": "Snow, day two · 10:00 today",
      "question": "On the day 120 robots come in, you must decide the shape of the door 80 people leave by. What do you do?",
      "lead": "Crossing the lobby, you meet Kang Taemin’s eyes, in his hi-vis vest. He gives you one thumbs-up."
    },
    "c16_aftershock": {
      "title": "80 Cups of Noodles",
      "text": "The night the approval committee ends, whatever the result, four electric kettles boil at once in the night-shift break room. Kang Taemin lines up 80 cups of noodles on the table, and Kwon Dohyun, saying they are 1,150 won each, pockets the receipt first. Yoo Haon, the youngest on the night shift, loads a box of noodles onto the back of 'Darami', the trial logistics robot, and sends it around the room. When Darami stops in front of Bae Sookyung, 9 years on the packing line, she strokes its orange lights and says, 'You like me, don’t you.' Choi Seojin, the KD Capital lease reviewer, still in a borrowed hi-vis vest, drinks the broth to the last drop for the first time. Kang Taemin sets an 81st cup in front of you. 'It’s the second one.' Then a text comes from Ban Jaewook. 'Group legal wants my notebook. They say your name is in it.'",
      "memo": [
        "80 cups of noodles + 1",
        "Darami load test: 12 boxes of noodles, success",
        "Choi Seojin invited to the night-shift group chat",
        "Ban Jaewook: group legal demands his notebook"
      ],
      "choices": {
        "c16_after_rush": {
          "label": "Put down the noodles and head to legal’s next fight"
        },
        "c16_after_warm": {
          "label": "Stay in the break room until the last cup is eaten"
        },
        "c16_after_record": {
          "label": "Write transition and retraining into the standard lease terms"
        }
      },
      "place": "FlowOn fulfillment center · Night-shift break room",
      "clock": "Approval committee day · 23:00 · First snow",
      "question": "While 81 cups of noodles steep, Ban Jaewook’s notebook is being called in. How do you close this night?"
    },
    "c16_ledger": {
      "title": "Not Enough Columns",
      "text": "Four in the morning, the break-room whiteboard. Kwon Dohyun, called in by Kang Taemin, draws a vertical line. Left, 1 robot. Right, 1 night-shift worker. The 120 robots also run by day, so the night share is eighty units. A monthly lease fee of 2.83 million won against a monthly wage of 3.12 million won: the robot wins. He adds columns. Maintenance, electricity, orders that back up every time a robot stops, the staff who watch them. On the people side, night pay and back treatment. The more columns, the closer the two numbers get. At the edge of the board, Kwon Dohyun stops with the marker raised. 'Not enough columns.' He starts taping sheets of A4 paper together along the wall. Kang Taemin hands him a cup of noodles. 'Tape all that up and it’ll be dawn.' 'It already is.'",
      "memo": [
        "1 robot: 2.83 million won a month · 1 night-shift worker: 3.12 million won a month",
        "14 hidden-cost columns -- past the whiteboard",
        "With every column filled, the gap is 90,000 won a month, 1 worker against 1 robot"
      ],
      "choices": {
        "c16_ledger_choice_3": {
          "label": "The math is done; take only the final number"
        },
        "c16_ledger_choice_2": {
          "label": "Formally submit the finished sheet as lease review data"
        },
        "c16_ledger_choice_1": {
          "label": "Add more columns and list every cost on the people side"
        }
      },
      "place": "FlowOn fulfillment center · Night-shift break room",
      "clock": "First snow · 04:00",
      "question": "With every column filled, the gap between robot and person is 90,000 won a month. What do you do with this sheet?"
    },
    "c16_log": {
      "title": "The Night Error Log",
      "text": "After midnight that day, Choi Seojin comes to the center in a borrowed hi-vis vest instead of carrying her tablet. She pulls the trial robots’ stop logs herself: just as Yoo Haon’s notes say, they stopped 47 times in a month, and all 47 times someone on the night shift restarted them. Each entry has a short note. '03:12 cleared plastic wrap from wheel -- Haon.' '04:40 just sulking. Gave it a pat -- Haon.' Choi Seojin laughs for a long time, then goes quiet. 'They’ve already been doing the maintenance.' She opens her notebook. 'The manufacturer’s maintenance course is 12 weeks. What if we ask to open it to the night shift first?'",
      "memo": [
        "47 night stops -- every restart by the night shift",
        "Manufacturer maintenance training: 12 weeks, 20 seats",
        "Graduates can move into robot maintenance jobs"
      ],
      "choices": {
        "c16_log_choice_3": {
          "label": "Call training a later problem; keep to the approval schedule"
        },
        "c16_log_choice_2": {
          "label": "Write down who qualifies and how they’re chosen first"
        },
        "c16_log_choice_1": {
          "label": "Propose together that the course open to the night shift first"
        }
      },
      "place": "FlowOn fulfillment center · Floor",
      "clock": "Approval committee D-3 · 01:20 · First snow",
      "question": "For a month the night shift has revived the robots 47 times. What do you propose with that log?"
    },
    "c16_list": {
      "title": "The Stay List",
      "text": "At the morning shift change, one A4 sheet goes up on the break-room board. 'Robot-control staff retained, 6.' The first line is Kang Taemin. Applause starts without anyone starting it. No one knows whether it is congratulation or farewell. Kang Taemin stops in front of the board, halfway out of his gloves. Bae Sookyung from the packing line pats his back. 'Take it, Foreman. One foreman has to stay so we can come visit.' Then she lowers her voice. 'But apart from you, all five are men under thirty-five. Isn’t that a bit odd?'",
      "memo": [
        "6 retained: Kang Taemin + 5 men aged 35 or under",
        "No selection criteria disclosed",
        "How it was announced: 1 A4 sheet on the board"
      ],
      "choices": {
        "c16_list_choice_2": {
          "label": "Demand the selection criteria for the stay list be disclosed"
        },
        "c16_list_choice_3": {
          "label": "The list is out; move on to committee prep"
        },
        "c16_list_choice_1": {
          "label": "Leave it to Kang Taemin and see to the farewells first"
        }
      },
      "place": "FlowOn fulfillment center · Night-shift break-room board",
      "clock": "Approval committee D-1 · Morning shift change 07:00",
      "question": "The stay list drew applause, but its criteria look odd. How do you get through this morning?"
    },
    "c16_ledger_reaction": {
      "title": "The Ones Who Have to Leave First",
      "text": "ECHO brings up the draft lease contract beside Kwon Dohyun’s A4 sheets. Nowhere is there a calculation saying to let 80 people go over a 90,000 won gap. Instead, on page 3 of the annex, there is one line. 'Condition precedent to the lease: commitment to let go the night staff of 80 within the year.' ECHO underlines it. 'This is not robots replacing people. It is written so the robots can come in only after the people leave. Who set this order is not in the contract.'",
      "memo": [
        "A contract that takes effect only once people leave",
        "Whoever set the order is not in the contract"
      ],
      "choices": {
        "c16_ledger_reaction_choice_1": {
          "label": "Show the clause to Kang Taemin and the night shift as is"
        },
        "c16_ledger_reaction_choice_3": {
          "label": "Hold the clause as a bargaining card; say nothing yet"
        },
        "c16_ledger_reaction_choice_2": {
          "label": "Request the drafting history to see who added it"
        }
      },
      "place": "FlowOn fulfillment center · Night-shift break-room whiteboard",
      "clock": "First snow · 04:40",
      "question": "There is a clause that lets the robots in only after people leave. How do you use this one line?"
    },
    "c16_log_reaction": {
      "title": "I Only Finished High School",
      "text": "When word of the training goes around the break room, Yoo Haon is first to raise her hand. And lowers it right away. 'I only finished high school. Isn’t that stuff for people who went to college?' Choi Seojin turns her tablet to show the first page of the manufacturer’s maintenance manual. 'Qualifications: none.' Yoo Haon reads it twice. Behind her, Kang Taemin says, 'Her hands are the fastest in the center.' Bae Sookyung cuts in. 'I’m in too. It doesn’t use your wrists, right?' As the break room bursts out laughing, word that there are only 20 seats goes around late. Twenty out of 80.",
      "memo": [
        "Qualifications: none",
        "20 out of 80"
      ],
      "choices": {
        "c16_log_reaction_choice_2": {
          "label": "Set the selection criteria together with the night shift"
        },
        "c16_log_reaction_choice_3": {
          "label": "Send the first 20 who raise their hands"
        },
        "c16_log_reaction_choice_1": {
          "label": "Demand more seats so all 80 get a chance"
        }
      },
      "place": "FlowOn fulfillment center · Night-shift break room",
      "clock": "Approval committee D-3 · 02:00",
      "question": "The training has 20 seats, and more hands than that went up. Who do you send first?"
    },
    "c16_list_reaction": {
      "title": "4 Percent",
      "text": "The night before the approval committee, as snow blows across the center’s parking lot, Choi Seojin calls. Her voice shakes. 'My team head says if we attach phased transition or retraining as conditions, the lease fee goes up 4%. Then FlowOn goes to another lessor. One that attaches no conditions at all.' On the line, the sound of a keyboard stops. 'So even if we attach conditions, the 80 still go, and we just lose the deal. I thought robots would save people, but robots don’t think anything. Only people think too much.'",
      "memo": [
        "Conditions raise the lease fee 4%",
        "Another lessor with no conditions at all"
      ],
      "choices": {
        "c16_list_reaction_choice_1": {
          "label": "Tell her she isn’t wrong and walk in with her tomorrow"
        },
        "c16_list_reaction_choice_2": {
          "label": "Check the other lessor’s terms and test the 4% first"
        },
        "c16_list_reaction_choice_3": {
          "label": "Use the 4% as a card to make FlowOn absorb it"
        }
      },
      "place": "FlowOn fulfillment center · Parking lot",
      "clock": "Night before the approval committee · 23:40 · Blowing snow",
      "question": "Conditions raise the lease fee 4%, and the client may leave. How do you answer a wavering reviewer?"
    },
    "c16_branch_locker": {
      "title": "80 Lockers",
      "text": "On the 80 lockers at the back of the break room, names are stuck on with masking tape. Bae Sookyung, 9 years on the packing line, is already emptying hers. Three wrist braces, her daughter’s graduation photo, a half-used box of pain patches. 'I started packing as soon as I got the text. I thought it might sting less if I packed early.' She holds up a brace. 'My right hand’s had surgery twice. I almost filed it as a workplace injury, then didn’t. I was afraid they wouldn’t renew my contract.' Then she laughs. 'Honestly, I’m glad the robots are coming. Better that thing than my wrists. But where do I go?'",
      "memo": [
        "11 of the 80 lockers already emptied",
        "Bae Sookyung: 9 years on the packing line, 2 right-wrist surgeries",
        "0 workplace injury claims -- 'afraid the contract wouldn’t be renewed'",
        "Night-shift average age 47"
      ],
      "choices": {
        "c16_branch_locker_c": {
          "label": "Gather records of the 80’s injuries that were never filed"
        },
        "c16_branch_locker_a": {
          "label": "Help Bae Sookyung refile her wrist surgery as an injury"
        },
        "c16_branch_locker_b": {
          "label": "Keep the bags packed; look into the severance terms"
        }
      },
      "place": "FlowOn fulfillment center · Night-shift break-room lockers",
      "clock": "First snow · 02:50",
      "question": "The person packing the moment she got the notice has surgical scars on her wrist. What do you help with?"
    },
    "c16_branch_locker_follow": {
      "title": "The Hairpin Mechanic",
      "text": "At three in the morning, Darami stops in the middle of Row C. Plastic wrap is wound around a wheel. The manufacturer’s technician only comes by day. Yoo Haon, the youngest, takes a hairpin from her pocket, digs out the wheel gap, opens the back panel and holds the reset button for 3 seconds. The orange lights come back on. Yoo Haon shows you a memo on her phone. 47 lines of error log written over a month. 'Plastic wrap 19 times, couldn’t read barcode 11 times, just sulking 3 times. The other 14, I don’t know either.' The break room bursts out laughing. Yoo Haon adds, a little sheepish, 'I’ve fixed it more than the daytime technician. But I’m out on December 31.'",
      "memo": [
        "47 night stops of the 4 trial robots -- all fixed by the night shift",
        "Manufacturer maintenance contract: weekdays 09~18 only",
        "Yoo Haon: youngest on the night shift, 24, 47-line error log",
        "'Just sulking' 3 times -- cause unknown"
      ],
      "choices": {
        "c16_branch_locker_follow_a": {
          "label": "Take Yoo Haon’s error log and demand night maintenance staff"
        },
        "c16_branch_locker_follow_b": {
          "label": "List the 47 night stops as an official lease review risk"
        },
        "c16_branch_locker_follow_c": {
          "label": "Call maintenance the maker’s job; give Yoo Haon her log back"
        }
      },
      "place": "FlowOn fulfillment center · Floor, Row C",
      "clock": "First snow · 03:05",
      "question": "The person who fixed the robot most is out on December 31. What do you do with those 47 lines?"
    },
    "c16_route_system": {
      "title": "Risk That Moved",
      "text": "You add a column to the table: the let-go, 1 year later. ECHO pulls up KD Capital’s approvals from the past 5 years. 37 automation equipment leases open up. At the sites that adopted them, accidents fell 41% on average. It is the number Choi Seojin, reviewing this lease for KD Capital, believes in. ECHO opens one more column. The 1,906 people whose contracts ended at those sites, a year later. 62% moved to construction day labor and dawn delivery, where the accident rate is twice what it was. 'The risk did not shrink. It moved off the books. Of the 37 leases, 0 carried a retraining condition.'",
      "memo": [
        "37 automation leases -- accidents down 41% at adopting sites",
        "62% of the 1,906 let go moved to riskier work",
        "0 leases with a retraining condition"
      ],
      "choices": {
        "c16_route_system_show": {
          "label": "Show these figures to Choi Seojin and the committee at once"
        },
        "c16_route_system_track": {
          "label": "Demand a clause tracking the let-go 1 year later"
        },
        "c16_route_system_drop": {
          "label": "Bury the figures and keep to the approval schedule"
        },
        "c16_route_system_evidence_turn": {
          "label": "Find who asked for the 80 cuts"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Lab terminal",
      "clock": "Approval committee D-3",
      "question": "37 automation leases cut accidents, but the risk moved off the books. What do you do with these figures?"
    },
    "c16_final_system_route": {
      "title": "1 Year Off the Books",
      "text": "The last night before the committee meets, ECHO has set two tables side by side. On the left, accident records at the sites that brought in robots. On the right, the 1,906 who left those sites, 1 year later. The left table carries KD Capital’s approval records; the right has no field to approve at all. At the very bottom of the right, ECHO draws 80 empty rows. 'Kang Taemin’s night shift. Where these rows get filled is not any company’s books.'",
      "memo": [
        "37 automation leases -- 0 retraining conditions",
        "The 1,906 let go, 1 year later: on no one’s books",
        "Lease approval committee: today"
      ],
      "choices": {
        "c16_final_system_route_c": {
          "label": "Bind other centers to hire the retrained first"
        },
        "c16_final_system_route_a": {
          "label": "Add 1 year of support per let-go worker to the lease fee"
        },
        "c16_final_system_route_b": {
          "label": "Set no conditions; just raise the severance"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Lab terminal",
      "clock": "Approval committee day · Before dawn",
      "question": "If a lease contract could record where people are 1 year later, what would you write?"
    },
    "c16_evidence_turn": {
      "title": "The Blank Owner Field",
      "text": "You set the clue beside the clause number, and the drafting history of the condition precedent opens. 'Commitment to let go the night staff of 80 within the year' is not a sentence KD Capital wrote. The requesting department is the KD Financial Group Group Strategy Office, and the request date is the week after the Innovation Committee launched. The attached English memo is one line. 'Labor cost improvement needed before Q1 sale of FlowOn stake.' The owner field is blank. Ban Jaewook closes the notebook he was writing in. 'So it wasn’t about bringing in robots. They cut the people first to sell the company high. And once again, no one signed.'",
      "memo": [
        "Requesting department: KD Financial Group, Group Strategy Office",
        "Memo: 'Labor cost improvement needed before Q1 stake sale'",
        "Owner field: blank"
      ],
      "choices": {
        "c16_evidence_turn_hold": {
          "label": "Hold the memo and bring it out at the stake sale"
        },
        "c16_evidence_turn_share": {
          "label": "Show this memo to the night shift of 80 first"
        },
        "c16_evidence_turn_expose": {
          "label": "Submit the memo to the committee and demand the clause go"
        }
      },
      "place": "Trigger Lab archive B2 · Contract document folder",
      "clock": "Approval committee day · 07:00",
      "question": "The Group Strategy Office wanted the clause letting the 80 go, and the owner field is blank. How do you use this memo?"
    },
    "c16_start_warm": {
      "title": "An Empty Seat on Thursday Evening",
      "text": "On the evening of the college entrance exam, as you shared cold radish soup on the school-gate steps, the post in the night-shift group chat on Kang Taemin’s phone was one line of rumor. 'Robots are coming to Building B.' The people who sat on those steps have had dinner every Thursday since, and 2 weeks later, on the Thursday of the first snow, Kang Taemin is late for the first time. Instead of a greeting, he holds out his phone. A termination text that came at 4:12 a.m. The FlowOn fulfillment center is bringing in 120 robots, on a KD Capital lease, and the night shift of 80 goes at year end. Lee Chanbin puts down his chopsticks. 'You too, mister?'",
      "memo": [
        "Thursday dinner -- the second since the exam",
        "One line of rumor on exam day became a termination text in 2 weeks",
        "120 robots on a KD Capital lease, night shift of 80",
        "6 days to the lease approval committee"
      ],
      "choices": {
        "c16_start_warm_lease": {
          "label": "Read the lease application and terms line by line"
        },
        "c16_start_warm_severance": {
          "label": "If it can’t be stopped, push the severance up fast"
        },
        "c16_start_warm_night": {
          "label": "Go to the night-shift break room tonight and meet the 80"
        },
        "c16_start_warm_signature": {
          "label": "Move the Thursday dinner table to the night-shift break room"
        },
        "c16_start_warm_reframe": {
          "label": "Add the let-go, 1 year later"
        }
      },
      "place": "Lee Minseo’s rooftop room, Mangwon-dong · Rooftop",
      "clock": "Late November · First snow · Thursday 19:00",
      "question": "A termination text has landed on the Thursday dinner table. Where do you move this table?",
      "lead": "Since the school-gate steps on exam day, Thursday evenings have meant dinner at Lee Minseo’s rooftop room."
    },
    "c16_start_record": {
      "title": "A Paper with No Requester",
      "text": "Filing the proposal to end the contract-worker confirmation practice with Human Resources, you wrote one principle at the very top. 'Any paper sent down from above must carry the name of the person who asked for it and a box to refuse it.' 2 weeks later, ECHO finds a paper that runs into that principle. A KD Capital lease application. It brings 120 robots into the FlowOn fulfillment center, and it is the truth behind the rumor that passed through Kang Taemin’s group chat on exam-day evening. The attached staffing plan lists the termination of the night shift of 80, and there is no requester’s name. The 80 already got the text at 4:12 a.m.",
      "memo": [
        "Attached to the lease application: termination of the night shift of 80",
        "Requester field: blank · refusal box: none",
        "Notice: 1 text message, 4:12 a.m.",
        "6 days to the lease approval committee"
      ],
      "choices": {
        "c16_start_record_signature": {
          "label": "Formally demand the requester’s name on the application"
        },
        "c16_start_record_severance": {
          "label": "If it can’t be stopped, push the severance up fast"
        },
        "c16_start_record_night": {
          "label": "Go to the night-shift break room tonight and meet the 80"
        },
        "c16_start_record_lease": {
          "label": "Read the lease application and terms line by line"
        },
        "c16_start_record_reframe": {
          "label": "Add the let-go, 1 year later"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Late November · First snow · Lease approval committee D-6",
      "question": "Another paper has come up with no requester’s name. How do you use the rule you left?",
      "lead": "2 weeks after the confirmation proposal was filed, ECHO brings a paper that runs into its first line."
    },
    "c16_start_rush": {
      "title": "A Knock at Five a.m.",
      "text": "In the 2 weeks since you followed Kang Taemin’s group-chat post straight to the center on exam-day evening, you have barely been home, chasing the source of the rumor 'Robots are coming to Building B'. No one would confirm it. At five in the morning of the first snow, someone knocks on the Trigger Lab 4th-floor door. Kang Taemin, slipped out mid-shift still in his vest, stands there with snow on his hi-vis. 'It’s confirmed.' He holds out the termination text that came at 4:12 a.m. The FlowOn fulfillment center is bringing in 120 robots, he says, on a KD Capital lease. 'It’s 80 people. We need someone who runs as fast as you, Analyst.'",
      "memo": [
        "Termination text: night shift of 80, 48 minutes ago",
        "The rumor chased for 2 weeks, confirmed by one text",
        "120 robots on a KD Capital lease",
        "6 days to the lease approval committee"
      ],
      "choices": {
        "c16_start_rush_night": {
          "label": "Go to the night-shift break room tonight and meet the 80"
        },
        "c16_start_rush_lease": {
          "label": "Read the lease application and terms line by line"
        },
        "c16_start_rush_severance": {
          "label": "If it can’t be stopped, push the severance up fast"
        },
        "c16_start_rush_signature": {
          "label": "Go with Kang Taemin now, in time for the shift change"
        },
        "c16_start_rush_reframe": {
          "label": "Add the let-go, 1 year later"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Before dawn",
      "clock": "First snow · 05:00 · Lease approval committee D-6",
      "question": "At five in the morning, the night-shift foreman knocked on your door. Where do you go with him?",
      "lead": "A knock before dawn at the analyst room, its lights on for 2 weeks straight while you chased the rumor."
    }
  },
  "echoReplies": {
    "c16_start_night": "In the break room, none of the 80 welcome you. Only when Kang Taemin hands you a cup of noodles does a seat open up.",
    "c16_start_lease": "Reading the terms, your finger stops on page 3 of the annex. Explaining that one line takes a day.",
    "c16_start_severance": "The severance can go up. The moment the 80 take the higher severance, the papers fix them on the side that leaves.",
    "c16_duel_faces": "With each name, Choi Seojin takes notes on her tablet. Around the 30th, her pen slows.",
    "c16_duel_data": "The records are accurate. The figures 212 to 198 do not record Kang Taemin’s back pain.",
    "c16_duel_ask": "Asked, Choi Seojin thinks for a long time. 'The managers’ day gets easier. The day of the people here… disappears.'",
    "c16_review_sign": "With her name on it, Choi Seojin’s opinion will never be 'tidied up' again. Her next performance review changes instead.",
    "c16_review_trace": "When the edit history reaches the committee, the team head writes an explanation. Its first words are 'As is customary'.",
    "c16_review_quiet": "Choi Seojin is protected. Like your opinion 3 years ago, her six lines stay sentences no one knows about.",
    "c16_roof_beside": "After your promise, Kang Taemin says nothing until he finishes his noodles. When he is done, he does not say 'Thanks.' He says 'It’s gone cold.'",
    "c16_roof_criteria": "While you check the criteria, Kang Taemin holds off on his answer. The company wants it by the day after tomorrow.",
    "c16_roof_inside": "Asking him to stay is a heavy ask. Kang Taemin leaves the second cup on the snowy railing for a long while.",
    "c16_final_phase": "With the condition in, the robots arrive over 1 year, and every three months 20 people go through training. The lease fee goes up 4%.",
    "c16_final_block": "With approval blocked, the committee sends the agenda back to have the conditions rewritten. The 80 termination texts have not been withdrawn yet.",
    "c16_final_severance": "The severance terms double. Unless conditions are attached, on January 2, 120 Daramis switch on their lights and this break room empties.",
    "c16_after_warm": "While you eat the last cup, Darami rolls back to its charger. Ban Jaewook’s text waits until tomorrow morning.",
    "c16_after_record": "The standard clause goes onto the next center, and the one after that. At the very end of the document, Kang Taemin pencils in 'the Jungwoo clause', after the friend who collapsed on the night shift 4 years ago.",
    "c16_after_rush": "While the noodles cool, you take a taxi. Ban Jaewook, who sent the text, comes to the break room in your place and helps the 80 whose contracts are ending with their remaining papers, one sheet at a time.",
    "c16_ledger_choice_1": "The A4 sheets cover a whole wall. In the last column, Kwon Dohyun writes 'Jungwoo', and much later changes it to 'injury risk'.",
    "c16_ledger_choice_2": "The submitted sheet goes onto page 41 of the committee’s briefing book. No one knows if the members will turn to page 41.",
    "c16_ledger_choice_3": "One number is left: 90,000 won a month. The 14 columns that made it are wiped off the whiteboard.",
    "c16_log_choice_1": "Choi Seojin writes to the manufacturer on the spot. She puts 'URGENT' in the subject line three times, then deletes two.",
    "c16_log_choice_2": "Once the criteria are on paper, it is fair. While they go on paper, the deadline for training cohort 1 may pass.",
    "c16_log_choice_3": "The schedule holds. Yoo Haon’s 47 lines of notes stay buried in the log file.",
    "c16_list_choice_1": "As you see to the farewells, a rolling paper goes around the break room. In Kang Taemin’s box alone, 'Buy us noodles' is written 23 times.",
    "c16_list_choice_2": "Asked about the criteria, the HR officer answers 'a fitness assessment'. No one ever took a fitness assessment.",
    "c16_list_choice_3": "Prep moves faster. The A4 sheet stays on the board for a month, and Bae Sookyung’s question stays beside it.",
    "c16_ledger_reaction_choice_1": "After seeing the clause, the break room goes quiet. For the first time, Kang Taemin leaves his noodles uncovered for a long time.",
    "c16_ledger_reaction_choice_2": "The answer comes back that the history request takes three days. The approval committee is in five.",
    "c16_ledger_reaction_choice_3": "The card stays in your hand. The 80 go into their shift without knowing that line exists.",
    "c16_log_reaction_choice_1": "To the demand for more seats, the manufacturer replies it would need two more instructors. One more cost column appears.",
    "c16_log_reaction_choice_2": "As you set the criteria together, Bae Sookyung proposes 'people with bad wrists first'. No one objects.",
    "c16_log_reaction_choice_3": "The 20 are chosen fast. Of the 60 who raised their hands late, eleven had that day off.",
    "c16_list_reaction_choice_1": "Choi Seojin is silent for a long time, then says, 'See you in the lobby at eight-thirty tomorrow.' Her voice shakes a little less.",
    "c16_list_reaction_choice_2": "You check, and the other lessor’s terms exclude maintenance. Proving it takes the night.",
    "c16_list_reaction_choice_3": "With FlowOn absorbing the 4%, the conditions survive. Whose year-end bonus that cost finally comes out of, no one knows yet.",
    "c16_branch_locker_a": "Refiled, Bae Sookyung’s wrist becomes paperwork. That paperwork follows her even after her contract ends.",
    "c16_branch_locker_b": "Severance is the realistic answer. Bae Sookyung puts her last brace in her bag and peels the tape off her locker.",
    "c16_branch_locker_c": "Gathering the records shows that 31 of the 80 were injured and said nothing. The reason is the same for all of them.",
    "c16_branch_locker_follow_a": "Once the 47 lines become evidence, Yoo Haon is no longer embarrassed by her notes for the first time.",
    "c16_branch_locker_follow_b": "Listed as a risk item, the 47 stops raise the lease fee. When the lease fee rises, someone tries to make up the number with people.",
    "c16_branch_locker_follow_c": "Yoo Haon keeps the returned notes without deleting them. After December 31, no one will read them.",
    "c16_route_system_show": "Choi Seojin looks at the figures and says nothing for a long time. 'I was only seeing half.'",
    "c16_route_system_track": "A tracking clause has no precedent. Because it has no precedent, the legal review takes two days longer.",
    "c16_route_system_drop": "The schedule holds. Beside the 1,906, 80 more are quietly added.",
    "c16_final_system_route_a": "With the support attached, a path stays open for 1 year after the contract ends. For the first time, the lease fee sheet has a column with people’s names.",
    "c16_final_system_route_b": "The severance goes up. Where the leavers are 1 year later, still no one counts.",
    "c16_final_system_route_c": "Binding other centers gives the retrained somewhere to go. Finding someone to keep that promise takes a month.",
    "c16_evidence_turn_expose": "When you submit the memo, the committee recesses. The Group Strategy Office replies within 30 minutes: 'a clerical error'.",
    "c16_evidence_turn_hold": "The memo becomes a weapon for a bigger fight. Before that fight comes, the 80 pack their bags.",
    "c16_evidence_turn_share": "In the break room, after reading the memo, someone says, 'So it’s not that we cost too much. They want to sell.' The line runs through the group chat all night.",
    "c16_duel_evidence_turn": "Dig through the history and the person who wanted the sentence turns up before the person who wrote it. That person’s name field is blank.",
    "c16_review_evidence_turn": "Dig through the history and the person who wanted the sentence turns up before the person who wrote it. That person’s name field is blank.",
    "c16_roof_evidence_turn": "Dig through the history and the person who wanted the sentence turns up before the person who wrote it. That person’s name field is blank.",
    "c16_route_system_evidence_turn": "Dig through the history and the person who wanted the sentence turns up before the person who wrote it. That person’s name field is blank.",
    "case16_memory_system": "Look for it and it is in no field of the report. The opinion field has shrunk to three words, and from that empty space ECHO pulls out 37 automation leases.",
    "case16_memory_evidence": "Hold the name of the department that made the confirmation form against the lease contract’s drafting history, and the same department name is stamped there once more. Only the owner field is blank.",
    "c16_start_warm_night": "In the break room, none of the 80 welcome you. Only when Kang Taemin hands you a cup of noodles does a seat open up.",
    "c16_start_warm_lease": "Reading the terms, your finger stops on page 3 of the annex. Explaining that one line takes a day.",
    "c16_start_warm_severance": "The severance can go up. The moment the 80 take the higher severance, the papers fix them on the side that leaves.",
    "c16_start_warm_signature": "As the pot of tteokbokki enters the break room, the night shift lines up. It is not enough for 80, so Lee Chanbin makes three runs to the convenience store.",
    "c16_start_record_night": "In the break room, none of the 80 welcome you. Only when Kang Taemin hands you a cup of noodles does a seat open up.",
    "c16_start_record_lease": "Reading the terms, your finger stops on page 3 of the annex. Explaining that one line takes a day.",
    "c16_start_record_severance": "The severance can go up. The moment the 80 take the higher severance, the papers fix them on the side that leaves.",
    "c16_start_record_signature": "The demand is logged. The reply deadline is set for the day after the approval committee.",
    "c16_start_rush_night": "In the break room, none of the 80 welcome you. Only when Kang Taemin hands you a cup of noodles does a seat open up.",
    "c16_start_rush_lease": "Reading the terms, your finger stops on page 3 of the annex. Explaining that one line takes a day.",
    "c16_start_rush_severance": "The severance can go up. The moment the 80 take the higher severance, the papers fix them on the side that leaves.",
    "c16_start_rush_signature": "Arriving at the shift change, you run into the 80 heading home. Faces that got the text ask who you are."
  },
  "choiceVoiceLines": {
    "c16_start_night": "Saying you need to see the faces of people ended by one text, you go to the night-shift break room tonight and meet the 80 yourself.",
    "c16_start_lease": "Saying why the 80 are leaving must be written there, you read the lease application and terms line by line.",
    "c16_start_severance": "Saying that if it can’t be stopped they should at least get something in hand, you propose pushing the severance up fast.",
    "c16_duel_faces": "Saying people come before robots, you introduce the 80 to Choi Seojin one by one, names and faces first.",
    "c16_duel_data": "To get it on paper before the cheering cools, you ask for the contest records and site accident records as review data.",
    "c16_duel_ask": "Saying 212 and 198 give no answer, you ask Choi Seojin whose day changes when the robots come in.",
    "c16_review_sign": "Saying the six erased lines must be revived by the one who wrote them, you urge her to resubmit the original opinion and sign it in her own name.",
    "c16_review_trace": "Because the members must know what was left out before they decide, you formally tell the approval committee about the edit history between original and submitted versions.",
    "c16_review_quiet": "So Choi Seojin doesn’t fall out of her team head’s favor, you use the opinion quietly in talks only and keep her out of sight.",
    "c16_roof_beside": "Because he stayed by you that night, you promise to stay by Kang Taemin to the end, whatever he decides.",
    "c16_roof_criteria": "Saying he can decide only once he knows why he is the one staying, you suggest checking first how the six were chosen.",
    "c16_roof_inside": "Saying a path opens only with one person inside, you ask him to stay and be the one who opens a way back for the 74.",
    "c16_final_phase": "To open a way to bring in the robots and keep the people too, you approve with phased transition and retraining written into the lease.",
    "c16_final_block": "Saying a contract that needs people out first cannot pass, you block approval over the erased opinion and the staff-cut condition.",
    "c16_final_severance": "Judging that the January 2 start can’t be moved, you accept approval and double the severance terms.",
    "c16_after_warm": "Not wanting to be the first to get up tonight of all nights, you stay in the break room until the last cup of noodles is eaten.",
    "c16_after_record": "So the next center won’t have to fight again, you write transition and retraining into the group’s standard lease terms.",
    "c16_after_rush": "Unable to let a text saying your name is in the notebook slide, you put down the noodles and go straight to the next fight, where legal is waiting.",
    "c16_ledger_choice_1": "Having seen the two numbers close in as the columns grew, you add more columns and list every cost on the people side.",
    "c16_ledger_choice_2": "Because the whiteboard gets wiped by morning, you formally submit the finished sheet as lease review data.",
    "c16_ledger_choice_3": "Since the math is done without covering the wall, you take only the final number.",
    "c16_log_choice_1": "Saying the people already doing the maintenance come first, you propose together that the maintenance course open to the night shift first.",
    "c16_log_choice_2": "With only 20 seats, who goes must be clear first, so you write down who qualifies and how they are chosen.",
    "c16_log_choice_3": "Saying none of it matters if the schedule slips and training is a later problem, you keep to the approval schedule first.",
    "c16_list_choice_1": "Saying whether to accept is his own call, you leave it to Kang Taemin and see to the break-room farewells first.",
    "c16_list_choice_2": "So those who stay and those who go don’t resent each other, you demand the selection criteria for the stay list be disclosed.",
    "c16_list_choice_3": "Since the list is out no matter how long you hold on, you move on to committee prep.",
    "c16_ledger_reaction_choice_1": "Saying the people a sentence is about should see it first, you show the condition precedent to Kang Taemin and the night shift as is.",
    "c16_ledger_reaction_choice_2": "Saying you must first find who set the order, you request the drafting history to see who added this clause.",
    "c16_ledger_reaction_choice_3": "Because raising it now would let the other side prepare, you hold the clause as a bargaining card and say nothing yet.",
    "c16_log_reaction_choice_1": "Saying that picking only 20 pushes the rest out again, you demand more seats so all 80 get a chance.",
    "c16_log_reaction_choice_2": "So no one fights over twenty seats, you set the criteria for who goes first together with the night shift.",
    "c16_log_reaction_choice_3": "Afraid that arguing criteria will delay the start, you send the first 20 who raise their hands.",
    "c16_list_reaction_choice_1": "Not wanting to leave a shaking voice alone, you tell her she isn’t wrong and walk in with Choi Seojin tomorrow.",
    "c16_list_reaction_choice_2": "Saying you can’t take one word from her team head on faith, you check the other lessor’s terms and test the basis for the 4% first.",
    "c16_list_reaction_choice_3": "Saying the side bringing in the robots should pay the higher price, you use the 4% as a card to make FlowOn absorb it.",
    "c16_branch_locker_a": "So she can now file the claim she dropped out of fear for her contract, you help Bae Sookyung refile her wrist surgery as a workplace injury.",
    "c16_branch_locker_b": "Saying money in hand is more urgent than hurt feelings, you suggest keeping the bags packed and looking into the severance terms first.",
    "c16_branch_locker_c": "Saying this can’t be Bae Sookyung’s alone, you start by gathering records of the 80 who were injured and never filed.",
    "c16_branch_locker_follow_a": "To show that someone restarted the robots every night, you take Yoo Haon’s error log and argue that night maintenance staff are needed.",
    "c16_branch_locker_follow_b": "So the nights held together with a hairpin don’t drop out of the review, you list the 47 night stops as an official lease review risk.",
    "c16_branch_locker_follow_c": "Saying you can’t load more onto the youngest and maintenance is the maker’s job, you give Yoo Haon her error log back.",
    "c16_route_system_show": "Saying the other half of the falling-accidents number must be seen too, you show these figures to Choi Seojin and the approval committee at once.",
    "c16_route_system_track": "To get the risk that left the books written down again, you demand a clause tracking the let-go 1 year later.",
    "c16_route_system_drop": "Saying you can’t overturn all 37, you bury the figures and keep to the approval schedule.",
    "c16_final_system_route_a": "So the 80 empty rows land on someone’s books, you add 1 year of transition support per let-go worker to the lease fee.",
    "c16_final_system_route_b": "Saying money in hand now is the surest thing, you set no conditions and just raise the severance.",
    "c16_final_system_route_c": "Saying what they learn must lead to jobs, you bind other centers to hire the retrained first.",
    "c16_evidence_turn_expose": "Saying the clause went in for the sale, not the robots, you submit the request memo to the approval committee and demand the clause be deleted.",
    "c16_evidence_turn_hold": "Saying it is used up once if played now, you hold the memo and bring it out at the stake sale.",
    "c16_evidence_turn_share": "Because the people involved must know first why they have to leave, you show this memo to the night shift of 80 first.",
    "c16_duel_evidence_turn": "Because the text carries no requester’s name, you dig through the lease paper history to see who asked for the 80 terminations.",
    "c16_review_evidence_turn": "Because the text carries no requester’s name, you dig through the lease paper history to see who asked for the 80 terminations.",
    "c16_roof_evidence_turn": "Because the text carries no requester’s name, you dig through the lease paper history to see who asked for the 80 terminations.",
    "c16_route_system_evidence_turn": "Because the text carries no requester’s name, you dig through the lease paper history to see who asked for the 80 terminations.",
    "c16_start_warm_night": "Saying you need to see the faces of people ended by one text, you go to the night-shift break room tonight and meet the 80 yourself.",
    "c16_start_warm_lease": "Saying why the 80 are leaving must be written there, you read the lease application and terms line by line.",
    "c16_start_warm_severance": "Saying that if it can’t be stopped they should at least get something in hand, you propose pushing the severance up fast.",
    "c16_start_warm_signature": "To share the meals you ate together with the 80 as well, you move the Thursday dinner table as it is to the night-shift break room.",
    "c16_start_record_night": "Saying you need to see the faces of people ended by one text, you go to the night-shift break room tonight and meet the 80 yourself.",
    "c16_start_record_lease": "Saying why the 80 are leaving must be written there, you read the lease application and terms line by line.",
    "c16_start_record_severance": "Saying that if it can’t be stopped they should at least get something in hand, you propose pushing the severance up fast.",
    "c16_start_record_signature": "Because a paper without a name has no one to refuse to, you formally demand the requester’s name on the lease application.",
    "c16_start_rush_night": "Saying you need to see the faces of people ended by one text, you go to the night-shift break room tonight and meet the 80 yourself.",
    "c16_start_rush_lease": "Saying why the 80 are leaving must be written there, you read the lease application and terms line by line.",
    "c16_start_rush_severance": "Saying that if it can’t be stopped they should at least get something in hand, you propose pushing the severance up fast.",
    "c16_start_rush_signature": "Unable to sit still now that the rumor you chased for 2 weeks is confirmed, you go with Kang Taemin straight to the center in time for the shift change."
  },
  "pack": {
    "clue": {
      "title": "A Commitment with No Requester",
      "text": "The lease condition to let the night shift of 80 go within the year was a sentence requested by the KD Financial Group Group Strategy Office. The reason: labor cost improvement before the Q1 sale of the FlowOn stake. The owner field was blank."
    },
    "outcomes": {
      "c16_after_warm": {
        "tag": "Stayed to the End",
        "title": "You finished the 81st cup of noodles in the break room",
        "text": "The night the approval committee ended, the night shift, Choi Seojin and Darami were in one room. The second cup was yours again."
      },
      "c16_after_record": {
        "tag": "Left a Clause",
        "title": "Transition and retraining became standard lease terms",
        "text": "The same clause goes onto the next center’s lease contract too. At the end of the document, 'the Jungwoo clause' Kang Taemin penciled in stayed unerased."
      },
      "c16_after_rush": {
        "tag": "Left First",
        "title": "You left the cooling noodles for the next fight",
        "text": "You were the first to leave the break room. Kang Taemin put a lid on the 81st cup, and in your place Ban Jaewook stayed and saw to the 80’s papers."
      }
    },
    "continuityChallenges": {
      "c15_after_warm": {
        "title": "Take the School-Gate Crowd to the Break Room",
        "text": "The people who shared the cold radish soup to the end now stand beside the night shift. Stand together before the 80, and trust does not scatter."
      },
      "c15_after_record": {
        "title": "Hold the Proposal’s First Line to Another Paper",
        "text": "Whether your principle, a requester’s name and a box to refuse, holds for a lease application too, you’ll only know by reframing the table."
      },
      "c15_after_rush": {
        "title": "Fill the 2 Weeks That Passed Unrecorded",
        "text": "The 2 weeks you ran, leaving the lunch box behind, were fast but left no record. A card that puts the 80 terminations back through procedure restores Fairness."
      }
    }
  }
};
