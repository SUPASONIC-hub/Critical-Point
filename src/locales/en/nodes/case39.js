/**
 * 사건 39 (src/nodes/case39.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c39_start": {
      "title": "Exactly 20 Minutes",
      "text": "The night the first hearing ends, the 3rd-floor editing room at Raon Broadcasting. The 90-minute final cut of “The Unsigned,” the investigative documentary Seo Harin has filmed for eleven months, is up on four monitors. The door opens and Gong Byungman, executive producer of the Current Affairs Bureau, comes in holding a sheet of A4. Three KD Financial Group affiliates will pull all 14 of their ads tomorrow night. But the 'reference opinion' that came with the notice has two lines of timecode. All of Part 4 and some of Part 5: exactly 20 minutes. 'Nobody said to cut anything. They just wrote down exactly 20 minutes.' Seo Harin checks her record button first. 'They want 70 minutes by 10 tomorrow morning. Or the show gets pulled.'",
      "memo": [
        "Ad withdrawal notice: KD Card · KD Life · KD Capital, 14 ads",
        "Timecode in the 'reference opinion': all of Part 4 + 6 minutes of Part 5 = 20 minutes",
        "Final cut delivery deadline: tomorrow 10:00",
        "Broadcast: tomorrow (Friday) 22:00, 90 minutes"
      ],
      "choices": {
        "c39_start_trim": {
          "label": "Save the night: mark what to cut right away"
        },
        "c39_start_call": {
          "label": "Call the people in the documentary first and explain"
        },
        "c39_start_paper": {
          "label": "Get in writing who wrote the 'reference opinion'"
        },
        "reframe": {
          "label": "Ask the history of the scenes that got cut"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · 3rd Floor Editing Room",
      "clock": "Day before broadcast · 21:00 · Tropical night",
      "question": "As 14 ads pull out, the 'reference opinion' names exactly 20 minutes. What do you do first?",
      "lead": "One text from Seo Harin brought you to Sangam-dong. 'Looks like we’re pulling an all-nighter. Bring a toothbrush.'"
    },
    "c39_cut": {
      "title": "190,000 Won a Second",
      "text": "Editor Eom Donggyun paints 20 minutes of the timeline red. The project file is named 'TheUnsigned_final_REALfinal_broadcast4.' 14 of the red minutes are Part 4, “The Table.” A proposal made at Chairman Seo Dokyung’s table in Hannam-dong: put all the blame on Yoon Sanghyuk alone and have the group declare 'reform complete': cutting off the tail, rebuilt from three testimonies and two documents. The other 6 minutes are the contract under which Trigger Lab’s response records were sold to FitScore, a hiring assessment company. Kwon Dohyun sets a calculator on the ad rate card. '230 million won for 14 ads. Divided by 20 minutes, that’s 190,000 won a second. The most expensive 20 minutes in this documentary.' Eom Donggyun doesn’t laugh. 'Take this out and one story is left. There was one bad man. The end.'",
      "memo": [
        "Section to be cut: Part 4 “The Table” 14 minutes + Part 5 'The Sold Records' 6 minutes",
        "14 ads = 230 million won -- 190,000 won a second",
        "Without the 20 minutes, the chairman’s name never comes up once",
        "Length of the analyst’s interview: 22 minutes"
      ],
      "choices": {
        "c39_cut_mine": {
          "label": "Cut my 22-minute interview instead of Part 4"
        },
        "c39_cut_lift": {
          "label": "Lift out the whole red 20 minutes and save the broadcast"
        },
        "c39_cut_contract": {
          "label": "Check if the ad contract lets them touch the content"
        },
        "reframe": {
          "label": "Ask the history of the scenes that got cut"
        },
        "c39_cut_evidence_turn": {
          "label": "Trace back the copy the two timecode lines came from"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · 3rd Floor Editing Room",
      "clock": "Day before broadcast · 22:30 · Tropical night",
      "question": "Without the red 20 minutes, the chairman’s name never comes up once. What do you cut?",
      "lead": "The editing room air conditioner whines, losing to the heat of the monitors, and the middle of the timeline is painted red."
    },
    "c39_mosaic": {
      "title": "Whose Face It Is",
      "text": "The editing room is too small, so the monitors have been dragged into Studio B. At midnight the station’s legal team sent its standard. Blur the faces of anyone being sued, any minor, and any employee without company approval. Three interviewees run into it. Baek Arin filed a whistleblower report. Afterward the group sued her for leaking trade secrets. 'If you blur me, I become a thief. My mom says she’ll watch at her alterations shop in Anyang.' Do Yoonha got a text from the Gangseo branch manager saying 'an employee appearing on air requires prior approval,' and still says, 'The face that sold that loan is my face.' Moon Hajun, in his 3rd year of high school, says he’ll appear with his sketchbook, and Moon Gaeul answers briefly on the phone. 'Not my kid. His dad’s face is going out as it is.' Eom Donggyun raises the blur and lowers it, again and again.",
      "memo": [
        "Legal team standard: blur anyone sued · minors · employees without approval",
        "Baek Arin: wants to show her face -- sued for leaking trade secrets",
        "Do Yoonha: wants to show his face -- the branch’s 'prior approval' text",
        "Moon Hajun (3rd year of high school): wants to show his face / guardian Moon Gaeul: against"
      ],
      "choices": {
        "c39_mosaic_open": {
          "label": "Faces give it power: persuade everyone to show theirs"
        },
        "c39_mosaic_choose": {
          "label": "Let each face’s owner decide the blur; wait till dawn"
        },
        "c39_mosaic_rule": {
          "label": "Blur all three who fall under the legal team’s standard"
        },
        "reframe": {
          "label": "Ask the history of the scenes that got cut"
        },
        "c39_mosaic_evidence_turn": {
          "label": "Trace back the copy the two timecode lines came from"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · Studio B",
      "clock": "Broadcast day · 01:30 before dawn",
      "question": "Three people who want to show their faces clash with a standard that says blur them. Who decides the blur?",
      "lead": "In the middle of the dark studio, under a single light, squares rise and fall over three faces on the monitor."
    },
    "c39_caption": {
      "title": "Approved By: Jeongjeong",
      "text": "The Leadline newsroom air conditioner gave up in the tropical night, so Seo Harin brought her cat Jeongjeong, wearing an honorary press badge, in a carrier. In the 10 minutes everyone dozes off, Jeongjeong slowly crosses the editing keyboard. When they wake, at the last scene of Part 3, the caption over the approval for loan 2023-0412 has changed from 'Approved by: (blank)' to 'Approved by: Jeongjeongggggg.' Eom Donggyun reaches to undo it, then stops. 'In 3 years, this is the first time anything has gone in this box.' No one laughs. Kang Taemin silently lifts Jeongjeong onto his lap. At the end of that silence, Seo Harin holds out her phone. An email from the station’s standards reviewer. 'Marking it blank implies a cover-up. Please revise to: the approval process is under investigation.'",
      "memo": [
        "Jeongjeong’s edit: 'Approved by: (blank)' → 'Approved by: Jeongjeongggggg'",
        "Standards reviewer’s request: revise to 'the approval process is under investigation'",
        "Approver box on the original approval: actually empty",
        "5 hours 20 minutes until delivery"
      ],
      "choices": {
        "c39_caption_soft": {
          "label": "Revise it as asked: 'the approval process is under investigation'"
        },
        "c39_caption_blank": {
          "label": "Show the original’s blank box for 5 seconds, no caption"
        },
        "c39_caption_names": {
          "label": "Roll the victims’ group names under the blank approver box"
        },
        "reframe": {
          "label": "Ask the history of the scenes that got cut"
        },
        "c39_caption_evidence_turn": {
          "label": "Trace back the copy the two timecode lines came from"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · 3rd Floor Editing Room",
      "clock": "Broadcast day · 04:40 before dawn",
      "question": "You empty the approver box the cat filled, and the standards reviewer says to fix that blank. What do you do?",
      "lead": "The tower of energy drink cans has grown one level taller, and the carrier door is half open."
    },
    "c39_final": {
      "title": "Two External Drives",
      "text": "At 9:20 the court dismissed the broadcast injunction filed before dawn. Legally, the 90 minutes can air. Instead, a line came down from the president’s office to the master control room. If it goes out at 90 minutes, the 14 ads are gone for good, and in the autumn reshuffle this current-affairs documentary slot disappears. Gong Byungman sets down two external drives. 70 minutes and 90 minutes. 'My name goes in the responsible-person box on the decision document. Our bureau has never left that box empty.' Seo Harin names a third way. Air the 70 minutes, and post the cut 20 minutes with its source material on Leadline at the same hour. Then Gong Byungman would pay the price for breaking the co-production contract. A text comes from Moon Gaeul. 'I’ve steamed rice cakes. However many minutes it is, let’s all watch together.'",
      "memo": [
        "Injunction: dismissed at 09:20",
        "President’s office: at 90 minutes, the slot is cut in the autumn reshuffle",
        "Two external drives -- 70 minutes / 90 minutes",
        "This choice asks about the same box as the 'blank signature line' 3 years ago"
      ],
      "choices": {
        "c39_final_short": {
          "label": "Deliver the 70-minute cut and make sure tonight’s show airs"
        },
        "c39_final_split": {
          "label": "Release the cut 20 minutes separately, with sources"
        },
        "c39_final_full": {
          "label": "Deliver the 90-minute original the interviewees bet their faces on"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · Master Control Room",
      "clock": "Delivery deadline · Broadcast day 09:40",
      "question": "70 minutes and 90 minutes: two external drives sit on the desk. Which one do you hand over?",
      "lead": "The people who stayed up all night stand in a line at the glass door, and Seo Harin’s record button is still on."
    },
    "c39_aftershock": {
      "title": "The Monitor Wall at 10 p.m.",
      "text": "Friday at 10 p.m., the broadcast comes up on the monitor wall of the 3rd-floor editing room. Moon Gaeul has brought three boxes of rice cakes, and Baek Arin and Do Yoonha sit at either end of the sofa. Editor Eom Donggyun pulls a blanket over himself and starts snoring as soon as the first scene airs. Jeongjeong, the cat Seo Harin brought, circles the room once and settles on your lap. Gong Byungman stands at the very back and silently watches the per-minute rating climb from 3.8% to 6.1%. A text from her mother arrives on Baek Arin’s phone. 'Heard my daughter’s voice loud and clear.' 30 minutes into the broadcast, one email lands in Seo Harin’s tip inbox. 'I was on the chairman’s office secretarial team. I know who ordered the reference opinion. Tonight at 12, Hapjeong Station Exit 7.' Seo Harin turns the screen toward you. The broadcast is not even halfway through.",
      "memo": [
        "On air -- per-minute rating peaks at 6.1%",
        "5 interviewees in the editing room, 3 boxes of rice cakes",
        "Tip: 'formerly of the chairman’s office secretarial team,' tonight 00:00, Hapjeong Station",
        "Jeongjeong: on your lap"
      ],
      "choices": {
        "c39_after_record": {
          "label": "Preserve the 20 minutes the reference opinion flagged, as is"
        },
        "c39_after_rush": {
          "label": "Leave before the broadcast ends to meet the informant"
        },
        "c39_after_warm": {
          "label": "Stay beside the editing room people until the last caption"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · 3rd Floor Editing Room",
      "clock": "Broadcast day · 22:00 · Tropical night",
      "question": "30 minutes into the broadcast, a tip from a former chairman’s office secretary asks to meet at midnight. How do you close this night?"
    },
    "c39_door": {
      "title": "Editing in Progress",
      "text": "11:50 p.m., people from the Ad Sales Bureau come to the editing room a second time, saying they 'just want to see how it’s going.' Kang Taemin sits on a folding chair in front of the door. He says only one sentence. 'Editing in progress.' The third to come is Gong Byungman. Kang Taemin steps aside, but he does not come in; he stands in the hallway and speaks. '11 years ago I cut 12 minutes too. An interview with a subcontracted shipyard worker. His face aired, and why he spoke was cut. Three months later his contract ended.' He looks at the vending machine light at the end of the hallway. 'Decide first what you’re going to protect. The 20 minutes, or the people.'",
      "memo": [
        "Ad Sales Bureau visits: 2 -- 'checking progress'",
        "Gong Byungman: cut 12 minutes 11 years ago",
        "That interviewee: contract ended three months after the broadcast"
      ],
      "choices": {
        "c39_door_choice_1": {
          "label": "Tell Gong Byungman: this time, people before running time"
        },
        "c39_door_choice_3": {
          "label": "Open the door and negotiate the length with Ad Sales"
        },
        "c39_door_choice_2": {
          "label": "Log each time Ad Sales came and what they said"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · Door at the End of the 3rd Floor Hall",
      "clock": "Day before broadcast · 23:50",
      "question": "The man who cut 12 minutes 11 years ago asks: the 20 minutes, or the people? What do you answer?"
    },
    "c39_cakes": {
      "title": "Rice Cakes at 3 a.m.",
      "text": "3 a.m., eight hours after coming back from court, Moon Gaeul arrives by taxi with boxes of rice cakes. 'I thought the people staying up all night might be hungry.' Kwon Dohyun takes his third injeolmi and mutters, 'This is support that doesn’t show up in the production budget.' Handing out rice cakes, Moon Gaeul stops in front of a monitor. A 2019 Gaon Precision promotional video used in Part 2. Her husband Moon Sungho smiles at his lathe and says, 'At our factory we check down to 0.01 millimeters.' It is the first time since the funeral she has seen her husband move. Moon Gaeul sets down the box of rice cakes, stands for a long while, and asks. 'How many seconds of this go out?'",
      "memo": [
        "2019 Gaon Precision promotional video -- 12 seconds now",
        "Moon Sungho: 'We check down to 0.01 millimeters'",
        "Video rights: belong to a company that has closed -- needs checking"
      ],
      "choices": {
        "c39_cakes_choice_3": {
          "label": "Time is tight: cut her husband’s video to 5 seconds"
        },
        "c39_cakes_choice_1": {
          "label": "If Moon Gaeul wants, run her husband’s video longer"
        },
        "c39_cakes_choice_2": {
          "label": "First check who holds the rights to the promo video"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · 3rd Floor Editing Room",
      "clock": "Broadcast day · 03:00 before dawn",
      "question": "Seeing her husband move for the first time since the funeral, Moon Gaeul asks how many seconds will air. What do you answer?"
    },
    "c39_court": {
      "title": "The Six O’Clock Filing",
      "text": "6:10 a.m., the sun comes up over the rooftop. A court alert pops up on Seo Harin’s phone. The group’s law firm has filed for a broadcast injunction targeting Part 4 alone, and the hearing is at 9 a.m. The filing’s first sentence: 'The parts concerning the chairman are unconfirmed speculation.' Seo Harin leans on the railing. 'It’s not speculation. Three testimonies and two documents. But two of the three who testified chose not to give their names.' She lowers her voice. 'If we call those two in court, we win, and those two are finished.'",
      "memo": [
        "Injunction filing: Part 4 only, hearing 09:00",
        "Basis for Part 4: 3 testimonies (2 anonymous) + 2 documents",
        "Delivery deadline: 10:00"
      ],
      "choices": {
        "c39_court_choice_3": {
          "label": "Pull Part 4 ourselves before the hearing to void the motion"
        },
        "c39_court_choice_1": {
          "label": "We take the stand instead of the two anonymous witnesses"
        },
        "c39_court_choice_2": {
          "label": "Number a source for every sentence of Part 4 for the court"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · Rooftop",
      "clock": "Broadcast day · 06:10 before dawn",
      "question": "Call the anonymous witnesses in court and you win, and they are finished. How do you fight?"
    },
    "c39_door_reaction": {
      "title": "A 12-Minute Tape",
      "text": "Gong Byungman pulls a dusty tape from the bottom shelf of the video archive. The label says only '12 minutes' in marker. 'Nobody said to throw it out. So I didn’t. And in 11 years I never once played it.' He presses the tape into your hand. 'The 20 minutes cut today will end up like this. Filed on some shelf, played by no one.' Then, for the first time, he asks. 'Do you people have a way to stop that?'",
      "memo": [
        "A tape labeled only '12 minutes'",
        "Never played once in 11 years"
      ],
      "choices": {
        "c39_door_reaction_choice_2": {
          "label": "Propose keeping whatever is cut, original and all, apart"
        },
        "c39_door_reaction_choice_1": {
          "label": "Ask that Gong Byungman put his name on today’s decision too"
        },
        "c39_door_reaction_choice_3": {
          "label": "Say tonight’s 70 minutes matter more than an old tape"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · Video Archive",
      "clock": "Broadcast day · 00:20",
      "question": "He asks if there’s a way to keep the cut footage from becoming a tape no one plays. What do you do?"
    },
    "c39_cakes_reaction": {
      "title": "Smiles Inside the Squares",
      "text": "Moon Hajun, who came along with his mom, opens his sketchbook on the lobby sofa. He has drawn the documentary’s last scene. The interviewees stand in a row in front of the rice cake shop, and some faces are colored in as squares like a blur, but in every square he has drawn a small smiling mouth. 'So you can see they’re smiling even when they’re hidden.' One square at the very end is empty. 'This one’s me. I’ll color it in if Mom decides.' Moon Gaeul looks at the drawing for a long time. Eom Donggyun, who has come down, looks over her shoulder and says, 'Put this in the ending as is, 3 seconds. I’ll name the file REALfinal.'",
      "memo": [
        "A smiling mouth drawn in every square",
        "The last square, not yet colored in"
      ],
      "choices": {
        "c39_cakes_reaction_choice_2": {
          "label": "Get guardian consent first, then set how much Hajun appears"
        },
        "c39_cakes_reaction_choice_1": {
          "label": "Propose Hajun’s drawing as the documentary’s last scene"
        },
        "c39_cakes_reaction_choice_3": {
          "label": "Put off Hajun’s appearance for now and hurry the edit"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · 1st Floor Lobby",
      "clock": "Broadcast day · 03:40 before dawn",
      "question": "The last square in Hajun’s drawing is still empty. What do you do with it?"
    },
    "c39_court_reaction": {
      "title": "The Responsible-Person Box",
      "text": "7:30 a.m., Gong Byungman brings a printout of the broadcast decision document. He has already written his own name in the responsible-person box at the bottom. 'Whichever way we go, it’s my name. Not one broadcast in our bureau ever went out with this box empty.' He rolls his ballpoint pen. His name was on the decision document for the '12 minutes' broadcast 11 years ago too, he says. He filled the box then as well, and the reason for the cut was written down nowhere. 'This time, what do you want to write in with it?'",
      "memo": [
        "The responsible-person box, already filled",
        "The reason for the cut has never been written down"
      ],
      "choices": {
        "c39_court_reaction_choice_3": {
          "label": "His signature is enough: leave the decision to Gong Byungman"
        },
        "c39_court_reaction_choice_1": {
          "label": "Not Gong Byungman alone: have the whole crew sign together"
        },
        "c39_court_reaction_choice_2": {
          "label": "Attach the edit history of who said to cut what"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · Current Affairs Bureau Meeting Room",
      "clock": "Broadcast day · 07:30",
      "question": "Gong Byungman, who already filled the responsible-person box, asks what to write in with it this time. What do you write?"
    },
    "c39_branch_sales": {
      "title": "The Price of 30 Seconds",
      "text": "When you make a cut with the red 20 minutes lifted out, Gong Byungman tells you to get it cleared by the Ad Sales Bureau. 11 p.m., in a lit meeting room, Ad Sales deputy manager Eun Sion turns her tablet toward you. On the Friday night ad sales sheet, KD’s 14 slots are shaded gray. 'KD is 31% of our team’s target this year.' She taps one slot. 'And I just got word. If the 20 minutes come out, they’ll buy 6 more slots in the Chuseok special.' The notice email came not from KD Card’s marketing team but from the group’s Brand Strategy Team, and Eun Sion is covering one line of the cc field with her finger.",
      "memo": [
        "14 ad slots in the Friday 22:00 hour -- gray",
        "KD’s share of Ad Sales’ target this year: 31%",
        "Extra offer: 6 slots in the Chuseok special if the 20 minutes are cut",
        "Notice email sent by: group Brand Strategy Team, 1 cc line covered"
      ],
      "choices": {
        "c39_branch_sales_a": {
          "label": "Propose Production share Ad Sales’ lost target"
        },
        "c39_branch_sales_b": {
          "label": "Get the notice email in full, cc field included"
        },
        "c39_branch_sales_c": {
          "label": "Give up the 20 minutes in exchange for 6 Chuseok slots"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · Ad Sales Meeting Room",
      "clock": "Day before broadcast · 23:10",
      "question": "If the 20 minutes come out, 6 more Chuseok ad slots come in. What do you do with this deal?"
    },
    "c39_branch_sales_follow": {
      "title": "Fit Score 88",
      "text": "Eun Sion lifts the finger covering the cc field. 'KD Financial Group Chairman’s Office.' She turns off her tablet and after a long while says, 'The hiring assessment company in Part 5. I got in here last year on that company’s score too. Organizational fit score 88. The score came with the acceptance text. Back then I bragged about it.' She fiddles with the small calculator hanging from her ID lanyard. 'Whose hesitation that score was built from, I only learned watching the editing room monitors. What I sell is 30 seconds. I didn’t know those 30 seconds were buying the 20 minutes.'",
      "memo": [
        "cc: KD Financial Group Chairman’s Office",
        "Eun Sion: hired last year, FitScore score 88",
        "The score came with the acceptance text",
        "The very company the 6 minutes of Part 5 cover"
      ],
      "choices": {
        "c39_branch_sales_follow_b": {
          "label": "Draw a line: the ad notice and hiring scores are separate"
        },
        "c39_branch_sales_follow_c": {
          "label": "Bury what you heard; bring back only the Chuseok terms"
        },
        "c39_branch_sales_follow_a": {
          "label": "Ask Eun Sion to add her acceptance text to Part 5"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · Ad Sales Meeting Room",
      "clock": "Day before broadcast · 23:40",
      "question": "Even the person who sells the ads was hired on a FitScore score. How do you handle her 88?"
    },
    "c39_route_system": {
      "title": "What the Cut 20 Minutes Share",
      "text": "You set aside 70 versus 90 minutes and ask for the history of scenes cut after ads pulled out. NOAH from KD Data Lab, up on a laptop, digs through it. Twenty-three Korean investigative documentaries from the past 10 years that got ad withdrawal notices just before broadcast come up. Nineteen were shortened before airing, and in seventeen of those, what was cut was not one person’s wrongdoing but the part showing how the organization made its decisions. In two cases, the cut footage was released later. 'What gets cut is learned as an explanation of structure, not a person’s face. Faces can air alongside the ads. Structure cannot.'",
      "memo": [
        "Of 23 with ad withdrawal notices, 19 shortened",
        "Cases where the cut part explained structure: 17",
        "Cases where the cut footage was released later: 2"
      ],
      "choices": {
        "c39_route_system_drop": {
          "label": "Bury the statistic and focus only on tonight’s edit"
        },
        "c39_route_system_publish": {
          "label": "Post the statistic as is on the station’s production board"
        },
        "c39_route_system_insert": {
          "label": "Put one page of the statistic in the final captions"
        },
        "c39_route_system_evidence_turn": {
          "label": "Trace back the copy the two timecode lines came from"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · 3rd Floor Editing Room · NOAH Screen",
      "clock": "Day before broadcast · 22:10",
      "question": "What was cut after ad withdrawals was mostly the part explaining structure. What do you do with this statistic?"
    },
    "c39_final_system_route": {
      "title": "The Seventeen That Never Came Back",
      "text": "5 a.m., where the four editing room monitors have gone dark, only the NOAH screen on your laptop glows. On it are twenty-three titles, and below them, in the 24th row, “The Unsigned.” The length field blinks between 90 and 70. Five hours to delivery. NOAH adds beside the list, 'The cut footage came back in two cases. I could not find where the cut parts of the other seventeen are now. Cutting had a deadline. Keeping did not.'",
      "memo": [
        "23 with ad withdrawal notices -- this documentary is the 24th",
        "Cases where the cut footage was released later: 2",
        "Final cut delivery deadline: today 10:00"
      ],
      "choices": {
        "c39_final_system_route_c": {
          "label": "Write release standards with crews who got ad withdrawals"
        },
        "c39_final_system_route_a": {
          "label": "Seal the cut footage for automatic release in 3 years"
        },
        "c39_final_system_route_b": {
          "label": "Take the cut footage off the server; keep only the broadcast"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · 3rd Floor Editing Room · NOAH Screen",
      "clock": "Broadcast day · 05:00 before dawn",
      "question": "Only two cut sections ever came back. For these 20 minutes to be the third, what do you set up before cutting?"
    },
    "c39_evidence_turn": {
      "title": "Who Wrote the Reference Opinion",
      "text": "When you hook the clue onto Monday afternoon’s sending log, Lee Minseo opens the document properties window of the 'reference opinion' file. The author field: 'KD Financial Group Chairman’s Office.' Created Monday at 14:22. 22 minutes after Raon Broadcasting sent the group a copy of the documentary so it could prepare its right of reply. The timecode matches, to the last digit, the temporary numbers that existed only on that copy. Lee Minseo turns her laptop around. 'They marked where to cut on the copy we showed them first, to be fair. And the marks came in the advertisers’ name. The chairman decided in someone else’s name again.'",
      "memo": [
        "Document author: KD Financial Group Chairman’s Office",
        "Time created: 22 minutes after the right-of-reply copy was sent",
        "Timecode: matches the temporary numbers on the right-of-reply copy"
      ],
      "choices": {
        "c39_evidence_turn_share": {
          "label": "First tell the whole crew how the reply copy was used"
        },
        "c39_evidence_turn_hold": {
          "label": "Hold the author info as a card against Ad Sales"
        },
        "c39_evidence_turn_air": {
          "label": "Put the author info as is in the documentary’s last scene"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · Video Archive",
      "clock": "Broadcast day · 08:10",
      "question": "The document marking the 20 minutes was made in the chairman’s office from the right-of-reply copy. How do you use this record?"
    },
    "c39_start_warm": {
      "title": "The Editing Room of the One Who Came From the Steps",
      "text": "Thursday evening, after the first hearing, you stayed beside Moon Gaeul on the courthouse steps until the last plaintiff got on the bus. It was the first day of the class action filed together by 1,740 people. At 9 p.m., holding the bag of rice cakes Moon Gaeul pushed into your bag, you walk into the editing room at Raon Broadcasting in Sangam-dong. Seo Harin is waiting. Three plaintiffs appear in the documentary “The Unsigned,” airing tomorrow night. Three KD Financial Group affiliates said they would pull 14 ads, and the 'reference opinion' that came with it marks a 20-minute section. Executive producer Gong Byungman said to cut it to 70 minutes by 10 tomorrow morning. A text comes from Moon Gaeul. 'Is our story getting cut? In court they heard us out to the end.'",
      "memo": [
        "Ad withdrawal notice: three KD companies, 14 ads",
        "Section the 'reference opinion' points to: 20 minutes",
        "3 plaintiffs appear in the documentary"
      ],
      "choices": {
        "c39_start_warm_paper": {
          "label": "Get in writing who wrote the 'reference opinion'"
        },
        "c39_start_warm_signature": {
          "label": "Watch the plaintiffs’ scenes first with Moon Gaeul on video call"
        },
        "c39_start_warm_trim": {
          "label": "Save the night: mark what to cut right away"
        },
        "c39_start_warm_call": {
          "label": "Call the people in the documentary first and explain"
        },
        "c39_start_warm_reframe": {
          "label": "Ask the history of the scenes that got cut"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · 3rd Floor Editing Room",
      "clock": "Day before broadcast · 21:00 · Tropical night",
      "question": "The plaintiffs you saw off to the end on the courthouse steps ask if their story will be cut. What do you do first?",
      "lead": "The bag of rice cakes Moon Gaeul tucked into your bag is still soft, and the plaintiffs’ group chat won’t stop buzzing."
    },
    "c39_start_record": {
      "title": "The Editing Room of the One Who Shared the Record",
      "text": "All evening you organized today’s gist of the testimony and 23 pages of courtroom notes into a document. Seo Harin got the draft first, the one for the legal team and Leadline, and she put two of its sentences straight into the closing captions of Part 5 of the documentary “The Unsigned.” 9 p.m., the editing room at Raon Broadcasting in Sangam-dong. The broadcast is tomorrow night. Three KD Financial Group affiliates have announced they will pull 14 ads. The 'reference opinion' that came with it has two lines of timecode. Executive producer Gong Byungman said to cut it to 70 minutes by 10 tomorrow morning. Seo Harin colors the section with a highlighter. 'The two sentences we put in today are right inside these 20 minutes.'",
      "memo": [
        "Ad withdrawal notice: three KD companies, 14 ads",
        "Two sentences from the courtroom notes -- Part 5 closing captions",
        "Those two sentences fall inside the 20 minutes to be cut"
      ],
      "choices": {
        "c39_start_record_trim": {
          "label": "Save the night: mark what to cut right away"
        },
        "c39_start_record_signature": {
          "label": "Credit the courtroom notes as the source in the captions"
        },
        "c39_start_record_paper": {
          "label": "Get in writing who wrote the 'reference opinion'"
        },
        "c39_start_record_call": {
          "label": "Call the people in the documentary first and explain"
        },
        "c39_start_record_reframe": {
          "label": "Ask the history of the scenes that got cut"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · 3rd Floor Editing Room",
      "clock": "Day before broadcast · 21:00 · Tropical night",
      "question": "Two sentences from the courtroom notes you organized fall inside the 20 minutes to be cut. How do you protect them?",
      "lead": "On the editing room whiteboard, the two sentences from the record you sent are posted, colored in highlighter."
    },
    "c39_start_rush": {
      "title": "The Editing Room of the One Who Came First",
      "text": "You turned away in the courthouse hallway with only the group’s lawyers’ smiles in view, and the moment Seo Harin called, you took a taxi to Sangam-dong with the box of rice cakes left on the steps for you on your knees. The editing room at Raon Broadcasting. Over the documentary “The Unsigned,” airing tomorrow night, three KD Financial Group affiliates announced they would pull 14 ads all at once, and the 'reference opinion' that came with it names all of Part 4 and some of Part 5: exactly 20 minutes. Executive producer Gong Byungman said to cut it to 70 minutes by 10 tomorrow morning. In the whiteboard’s field for where the right-of-reply request was sent is Doyul Law, the firm that sat on the group’s side in court this afternoon. Seo Harin says, 'The lawyers in court today were the first people to see our copy.'",
      "memo": [
        "Ad withdrawal notice: three KD companies, 14 ads",
        "Right-of-reply request sent to: Doyul Law",
        "Section in the 'reference opinion': all of Part 4 + some of Part 5"
      ],
      "choices": {
        "c39_start_rush_paper": {
          "label": "Get in writing who wrote the 'reference opinion'"
        },
        "c39_start_rush_trim": {
          "label": "Save the night: mark what to cut right away"
        },
        "c39_start_rush_call": {
          "label": "Call the people in the documentary first and explain"
        },
        "c39_start_rush_signature": {
          "label": "Ask the station’s legal team when Doyul got the copy"
        },
        "c39_start_rush_reframe": {
          "label": "Ask the history of the scenes that got cut"
        }
      },
      "place": "Sangam-dong · Raon Broadcasting · 3rd Floor Editing Room",
      "clock": "Day before broadcast · 21:00 · Tropical night",
      "question": "The lawyers from this afternoon’s court saw the documentary copy first. Where do you start digging?",
      "lead": "The moment you set the box of rice cakes from your knees down in a corner of the editing room, Seo Harin points at the whiteboard."
    }
  },
  "echoReplies": {
    "c39_start_call": "Of the five who pick up, four ask the same thing. 'Is my face going out?' To answer that, you have to decide the 20 minutes first.",
    "c39_start_paper": "Gong Byungman laughs. 'Ask for it in writing and no writing comes. A phone call comes instead.' At 10 p.m. his phone really does ring, and he steps into the hallway to take it.",
    "c39_start_trim": "Eom Donggyun’s hands are fast. The two lines of the 'reference opinion' get marked first, and no one has yet checked whose scenes are inside those 20 minutes.",
    "c39_cut_mine": "With your 22 minutes out, Part 4 stays. Instead, why 'the person who wrote the dissent' wrote it appears nowhere in this documentary.",
    "c39_cut_contract": "On page 17 of the contract there is no clause letting them touch the content. There is a right to pull the ads. Both are true, so the night is long.",
    "c39_cut_lift": "Eom Donggyun makes a separate cut with the 20 minutes lifted out and plays it from the start. 'A well-made 70 minutes. Because it’s a different story.' The 90-minute cut stays up on the next monitor.",
    "c39_mosaic_choose": "As you wait, Baek Arin chooses her face, and Do Yoonha his voice. Moon Hajun’s answer waits for Moon Gaeul’s. Getting this far takes two hours.",
    "c39_mosaic_rule": "Blurred by the standard, Baek Arin’s face becomes a square. She looks at the screen and says, 'Like this, I really do look like someone who stole something.'",
    "c39_mosaic_open": "When you propose showing everyone, the screen gains power. Only Moon Gaeul has not nodded yet. Do Yoonha’s branch manager sets a meeting for 9 a.m. the day after the broadcast.",
    "c39_caption_names": "As the names roll, the blank looks even bigger. It takes 4 minutes for 1,021 names to pass, and those 4 minutes have to come out from somewhere.",
    "c39_caption_blank": "The 5-second blank becomes the longest 5 seconds in the editing room. Eom Donggyun turns the sound off, then on, and finally off.",
    "c39_caption_soft": "'Under investigation' is not wrong. But under that caption the blank can’t be seen. Jeongjeong yawns on the keyboard.",
    "c39_final_full": "With the 90 minutes on air, viewers see as far as the chairman’s table. In the autumn schedule, this slot’s box goes blank, and that box has no decision-maker’s name either.",
    "c39_final_split": "Split in two, the broadcast airs tonight, and the cut 20 minutes get played even more online at the same hour. Gong Byungman is called to a disciplinary meeting the next day.",
    "c39_final_short": "The 70 minutes air for certain. The interviewees eat rice cakes and watch to the end. The word chairman never comes up once in 70 minutes.",
    "c39_after_warm": "As you stay, you hear Baek Arin on the phone with her mother. 'Yeah, that’s me. Came out well, right?' Jeongjeong doesn’t leave your lap until the credits end, and the tip email is left with only a read receipt.",
    "c39_after_record": "Into one preservation folder go the original 20 minutes, the 'reference opinion,' and the edit history. Gong Byungman sets the '12 minutes' tape he cut 11 years ago beside that folder.",
    "c39_after_rush": "When you leave, the rice cakes in the editing room go cold. The person who appears at Hapjeong Station Exit 7 at midnight gives no name and leaves only the date of the next meeting.",
    "c39_door_choice_1": "When you say people first, Gong Byungman laughs for a long time. He says it’s what he couldn’t say 11 years ago. The 20 minutes are still red.",
    "c39_door_choice_2": "The log keeps only times and words. The Ad Sales people don’t come a fourth time; they send the same words by email.",
    "c39_door_choice_3": "With the door open, the negotiation speeds up. Ad Sales says it can shave the 20 minutes down to 16, and that it will choose what stays.",
    "c39_cakes_choice_1": "With the video longer, Moon Sungho’s voice explaining his lathe goes out to the end. Someone else’s scene comes out for those 40 seconds.",
    "c39_cakes_choice_2": "Checking the rights turns up that the video’s owner is a bankruptcy trustee. Not someone who will take a call at 3 a.m.",
    "c39_cakes_choice_3": "At 5 seconds, only the smiling face goes out. The words '0.01 millimeters' stay on the editing room floor.",
    "c39_court_choice_1": "With you on the stand instead, the two anonymous people are protected. The judge puts less weight on nameless testimony.",
    "c39_court_choice_2": "Numbered, all 212 sentences of Part 4 have a source. Numbering them all takes three hours.",
    "c39_court_choice_3": "When you file the cut without Part 4, the motion loses what it was fighting. The 90-minute original stays on Eom Donggyun’s drive, and the group, without stopping anything, comes a step closer to what it wanted.",
    "c39_door_reaction_choice_1": "Gong Byungman doesn’t take the tape back. 'Then you hold on to this. As a sign we both put our names on it.'",
    "c39_door_reaction_choice_2": "When you propose keeping it, Eom Donggyun makes a folder. Its name is '12min_and_20min.' No one has yet promised to open it.",
    "c39_door_reaction_choice_3": "Gong Byungman nods and slides the tape back into its slot. A spot with a little less dust.",
    "c39_cakes_reaction_choice_1": "With the drawing as the ending, the empty square goes out too. Moon Gaeul can’t decide until just before the broadcast whether to color it in.",
    "c39_cakes_reaction_choice_2": "The consent form has six boxes. Moon Gaeul fills five and hands the last one to Hajun.",
    "c39_cakes_reaction_choice_3": "Hajun closes his sketchbook. 'I’ll draw a better one next time.' He said it a little too fast.",
    "c39_court_reaction_choice_1": "The responsible-person box is narrow, so seven names take two lines. Eom Donggyun almost writes 'REALfinal' beside his name, then holds back.",
    "c39_court_reaction_choice_2": "With the edit history attached, the decision document runs to 11 pages. The 'reference opinion' goes in too.",
    "c39_court_reaction_choice_3": "Gong Byungman signs alone. The weight of this decision, like 11 years ago, goes into one person’s box.",
    "c39_branch_sales_a": "For the first time Eun Sion looks up from her tablet. 'It’s the first time I’ve heard Production offer to share a sales loss.' Neither of them knows yet how to share it.",
    "c39_branch_sales_b": "With the original, the one cc line comes too. Eun Sion presses forward and remains the person who pressed it.",
    "c39_branch_sales_c": "When you say you’ll take the deal, Eun Sion writes a provisional contract email. The stamp comes after delivery. The 6 Chuseok special slots are set to carry KD’s new campaign line: 'Finance that remembers.'",
    "c39_branch_sales_follow_a": "Eun Sion sends a screenshot of her acceptance text. The moment it becomes testimony, that 88 is evidence, not a boast. HR will watch this broadcast.",
    "c39_branch_sales_follow_b": "With the line drawn, tonight’s edit settles into one track. Eun Sion’s 88 stays only on her phone until the next case.",
    "c39_branch_sales_follow_c": "You bring back the terms. What Eun Sion said you leave in the meeting room. As the door closes, she turns her tablet back on.",
    "c39_route_system_publish": "Posted on the board, it gets 30 comments. 29 begin with 'Our team too.'",
    "c39_route_system_insert": "With the statistic as the last caption, the documentary ends as a story about itself. The standards reviewer underlines that page too.",
    "c39_route_system_drop": "The edit speeds up. One more is quietly added beside the twenty-three, and only NOAH counts it.",
    "c39_final_system_route_a": "Sealed, someone sees these 20 minutes in 3 years. No one knows where the people at the chairman’s table will be by then.",
    "c39_final_system_route_b": "Off the server, the station keeps only the broadcast cut. The cut 20 minutes survive only on one set of editor Eom Donggyun’s external drives, and those drives have no deadline.",
    "c39_final_system_route_c": "With a standard, the next editing room won’t have to live through this night from the start. So far only one station will sign it.",
    "c39_evidence_turn_air": "The document properties window airs for 3 seconds in the last scene. 'Author: KD Financial Group Chairman’s Office.' The group PR office issues a statement mid-broadcast.",
    "c39_evidence_turn_hold": "The card is strong. Ad Sales offers to save 12 of the 20 minutes. The words chairman’s office never leave the negotiating table.",
    "c39_evidence_turn_share": "With the whole crew told, the next right-of-reply copy gets a watermark. Tonight’s 20 minutes are cut before that watermark arrives.",
    "c39_cut_evidence_turn": "Inside the properties window is the person standing behind the advertisers’ name. What good faith those marks stepped on to get here is written there too.",
    "c39_mosaic_evidence_turn": "Inside the properties window is the person standing behind the advertisers’ name. What good faith those marks stepped on to get here is written there too.",
    "c39_caption_evidence_turn": "Inside the properties window is the person standing behind the advertisers’ name. What good faith those marks stepped on to get here is written there too.",
    "c39_route_system_evidence_turn": "Inside the properties window is the person standing behind the advertisers’ name. What good faith those marks stepped on to get here is written there too.",
    "case39_memory_system": "Rewinding the captions doesn’t bring up your table. The marks for sections to be cut come up instead. NOAH gathers 10 years of passages marked that way.",
    "case39_memory_evidence": "Hold the authoring departments side by side and the 'reference opinion' has an author field too. It is not the name of any of the three companies that pulled their ads.",
    "c39_start_warm_call": "Of the five who pick up, four ask the same thing. 'Is my face going out?' To answer that, you have to decide the 20 minutes first.",
    "c39_start_warm_paper": "Gong Byungman laughs. 'Ask for it in writing and no writing comes. A phone call comes instead.' At 10 p.m. his phone really does ring, and he steps into the hallway to take it.",
    "c39_start_warm_trim": "Eom Donggyun’s hands are fast. The two lines of the 'reference opinion' get marked first, and no one has yet checked whose scenes are inside those 20 minutes.",
    "c39_start_warm_signature": "On the other side of the screen, plaintiffs who live near the rice cake shop gather one by one. Everyone cries longer at the person next to them than at their own scene. No one asks whether those scenes are inside the 20 minutes.",
    "c39_start_record_call": "Of the five who pick up, four ask the same thing. 'Is my face going out?' To answer that, you have to decide the 20 minutes first.",
    "c39_start_record_paper": "Gong Byungman laughs. 'Ask for it in writing and no writing comes. A phone call comes instead.' At 10 p.m. his phone really does ring, and he steps into the hallway to take it.",
    "c39_start_record_trim": "Eom Donggyun’s hands are fast. The two lines of the 'reference opinion' get marked first, and no one has yet checked whose scenes are inside those 20 minutes.",
    "c39_start_record_signature": "With the source credited, the two sentences become court record. Cutting court record is a little harder to do in the advertisers’ name.",
    "c39_start_rush_call": "Of the five who pick up, four ask the same thing. 'Is my face going out?' To answer that, you have to decide the 20 minutes first.",
    "c39_start_rush_paper": "Gong Byungman laughs. 'Ask for it in writing and no writing comes. A phone call comes instead.' At 10 p.m. his phone really does ring, and he steps into the hallway to take it.",
    "c39_start_rush_trim": "Eom Donggyun’s hands are fast. The two lines of the 'reference opinion' get marked first, and no one has yet checked whose scenes are inside those 20 minutes.",
    "c39_start_rush_signature": "The legal team tells you the date the copy was sent to the group. That date is three days before the ad withdrawal notice."
  },
  "choiceVoiceLines": {
    "c39_start_call": "Saying they can’t learn from the screen that they may be cut, you call the people in the documentary first and explain.",
    "c39_start_paper": "Saying you won’t give the night to a nameless sheet of paper, you propose getting in writing who wrote the 'reference opinion.'",
    "c39_start_trim": "Saying to save the night left before the broadcast, you mark what to cut right away.",
    "c39_cut_mine": "Saying the 14 minutes that show the structure must stay, you propose cutting your own 22-minute interview instead of Part 4.",
    "c39_cut_contract": "Saying you need to see whether the ads buy the edit too, you check whether the ad contract has any clause letting them touch the content.",
    "c39_cut_lift": "Saying 230 million won in ads hangs on tonight, you lift out the whole red 20 minutes and save the broadcast first.",
    "c39_mosaic_choose": "Saying what gets blurred is that person’s life, you let each face’s owner decide the blur and wait until dawn.",
    "c39_mosaic_rule": "Saying the standard collapses if one person is an exception, you blur all three who fall under the legal team’s standard.",
    "c39_mosaic_open": "Saying faces give it power, you persuade everyone to show theirs.",
    "c39_caption_names": "To set the people who paid in the place no one signed, you roll the victims’ group names, one line at a time, under the blank approver box.",
    "c39_caption_blank": "Saying to let the blank speak as a blank, you show the original approval’s blank box for 5 seconds with no caption.",
    "c39_caption_soft": "Saying you lose everything if the broadcast is stopped in review, you revise it as asked: 'the approval process is under investigation.'",
    "c39_final_full": "Saying even the court didn’t stop this broadcast, you deliver the 90-minute original the interviewees bet their faces on, as is.",
    "c39_final_split": "To give up neither the slot nor the 20 minutes, you air the 70 minutes and release the cut 20 minutes with their source material.",
    "c39_final_short": "Saying you can’t lose the slot too in the autumn reshuffle, you deliver the 70-minute cut and make sure tonight’s broadcast airs.",
    "c39_after_warm": "Saying you should see the end with the people you stayed up with, you stay beside the editing room people until the last caption rolls.",
    "c39_after_record": "So it doesn’t become a tape no one plays, you bind the 20 minutes the reference opinion flagged, original and all, into a preservation record.",
    "c39_after_rush": "Because a midnight meeting may come only once, you leave the editing room before the broadcast even ends to meet the informant.",
    "c39_door_choice_1": "So it never again happens that the face airs and the person is cut, you tell Gong Byungman: this time, people before running time.",
    "c39_door_choice_2": "Saying even “just came to look” is evidence later, you log each time Ad Sales came and what they said, line by line.",
    "c39_door_choice_3": "Saying morning will come if you just hold the door, you open it and negotiate the length with Ad Sales directly.",
    "c39_cakes_choice_1": "Because it is the first time she has seen his face since the funeral, you propose running her husband’s video longer if Moon Gaeul wants.",
    "c39_cakes_choice_2": "So it isn’t taken down after airing, you first check who holds the rights to the promotional video.",
    "c39_cakes_choice_3": "Since time is tight even for 70 minutes, you cut her husband’s video to 5 seconds.",
    "c39_court_choice_1": "Saying you can’t finish two people just to win, you don’t call the two anonymous witnesses and take the stand yourselves instead.",
    "c39_court_choice_2": "To break the opening word speculation with paper, you number a source for every sentence of Part 4 and file it with the court.",
    "c39_court_choice_3": "Saying that with nothing to fight over the two won’t be called either, you pull Part 4 yourselves before the hearing so the motion spins in the air.",
    "c39_door_reaction_choice_1": "Saying someone who knows 11 years ago has to stand with you, you ask that Gong Byungman put his name on today’s decision too.",
    "c39_door_reaction_choice_2": "So it doesn’t end as a tape no one plays, you propose keeping whatever is cut separately, original and all.",
    "c39_door_reaction_choice_3": "Saying 10 tomorrow morning comes first, you tell him tonight’s 70 minutes are more urgent than an old tape.",
    "c39_cakes_reaction_choice_1": "Saying smiling even when hidden is how this documentary should end, you propose Hajun’s drawing as its last scene.",
    "c39_cakes_reaction_choice_2": "Because the empty square is Moon Gaeul’s to decide, you get guardian consent first and then set how much Hajun appears.",
    "c39_cakes_reaction_choice_3": "Saying a 3rd-year high schooler shouldn’t be made to bet his face now, you put off Hajun’s appearance and hurry the edit.",
    "c39_court_reaction_choice_1": "Not wanting one person to pay the price, you propose the whole crew sign together, not Gong Byungman alone.",
    "c39_court_reaction_choice_2": "So this time the reason for the cut is written somewhere, you attach the edit history of who said to cut what to the document.",
    "c39_court_reaction_choice_3": "Saying the signature of a man who has never left the box empty is enough, you leave the decision to Gong Byungman.",
    "c39_branch_sales_a": "Saying Ad Sales can’t be left to make up the 31% alone, you propose that Production share Ad Sales’ lost target.",
    "c39_branch_sales_b": "Saying it is only a record with the covered line included, you get the notice email in full, cc field and all.",
    "c39_branch_sales_c": "Saying a cut with it lifted out already exists, you take the deal: the 20 minutes for 6 Chuseok ad slots.",
    "c39_branch_sales_follow_a": "Because these are the words of someone hired on that score, you ask Eun Sion to add her acceptance text as testimony in Part 5.",
    "c39_branch_sales_follow_b": "Saying both blur if the ad notice and hiring scores get mixed, you draw a line that they must be handled separately.",
    "c39_branch_sales_follow_c": "Unable to shake Eun Sion’s job as well, you bury what you heard and bring back only the Chuseok ad terms.",
    "c39_route_system_publish": "Saying the people who get the next notice should know, you post the statistic as is on the station’s production board.",
    "c39_route_system_insert": "So viewers can see what gets cut, you propose putting one page of the statistic in the documentary’s final captions.",
    "c39_route_system_drop": "Saying the delivery time won’t wait for statistics, you bury the statistic and focus only on tonight’s edit.",
    "c39_final_system_route_a": "Saying keeping should have a deadline too, you seal the cut footage and hand it over for automatic release in 3 years.",
    "c39_final_system_route_b": "Saying it won’t come back even if kept, like the seventeen, you take the cut footage off the server and keep only the broadcast cut.",
    "c39_final_system_route_c": "So the 24th crew doesn’t choose alone, you write release standards together with crews who got ad withdrawal notices.",
    "c39_evidence_turn_air": "To return a name to a decision made in someone else’s name, you put the author information as is in the documentary’s last scene.",
    "c39_evidence_turn_hold": "Saying it’s used once and gone if you set it off now, you hold the author information as a card for the negotiation with Ad Sales.",
    "c39_evidence_turn_share": "Saying they should know the copy sent in fairness became a target, you first tell the whole crew how the right-of-reply copy was used.",
    "c39_cut_evidence_turn": "Holding the clue, you go into the properties window of the 'reference opinion' file and pin down who first drew a line around those 20 minutes.",
    "c39_mosaic_evidence_turn": "Holding the clue, you go into the properties window of the 'reference opinion' file and pin down who first drew a line around those 20 minutes.",
    "c39_caption_evidence_turn": "Holding the clue, you go into the properties window of the 'reference opinion' file and pin down who first drew a line around those 20 minutes.",
    "c39_route_system_evidence_turn": "Holding the clue, you go into the properties window of the 'reference opinion' file and pin down who first drew a line around those 20 minutes.",
    "c39_start_warm_call": "Saying they can’t learn from the screen that they may be cut, you call the people in the documentary first and explain.",
    "c39_start_warm_paper": "Saying you won’t give the night to a nameless sheet of paper, you propose getting in writing who wrote the 'reference opinion.'",
    "c39_start_warm_trim": "Saying to save the night left before the broadcast, you mark what to cut right away.",
    "c39_start_warm_signature": "So the one who asked if they’d be cut can see for herself and speak, you watch the plaintiffs’ scenes first with Moon Gaeul on a video call.",
    "c39_start_record_call": "Saying they can’t learn from the screen that they may be cut, you call the people in the documentary first and explain.",
    "c39_start_record_paper": "Saying you won’t give the night to a nameless sheet of paper, you propose getting in writing who wrote the 'reference opinion.'",
    "c39_start_record_trim": "Saying to save the night left before the broadcast, you mark what to cut right away.",
    "c39_start_record_signature": "Saying there is no reason to hide where the words came from, you propose crediting the courtroom notes as the source of the two sentences in the captions.",
    "c39_start_rush_call": "Saying they can’t learn from the screen that they may be cut, you call the people in the documentary first and explain.",
    "c39_start_rush_paper": "Saying you won’t give the night to a nameless sheet of paper, you propose getting in writing who wrote the 'reference opinion.'",
    "c39_start_rush_trim": "Saying to save the night left before the broadcast, you mark what to cut right away.",
    "c39_start_rush_signature": "To catch first where the hand that marked the 20 minutes came from, you go to the station’s legal team and ask when Doyul got the copy."
  },
  "pack": {
    "clue": {
      "title": "The Right-of-Reply Copy",
      "text": "The 'reference opinion' that came with the ad withdrawal was made from the documentary copy the group received to prepare its right of reply. The document’s author field read KD Financial Group Chairman’s Office."
    },
    "outcomes": {
      "c39_after_warm": {
        "tag": "Stayed to the End",
        "title": "You kept watch in the editing room until the last caption rolled",
        "text": "The night the broadcast ended, the interviewees shared rice cakes and passed around the scenes their faces were in. Jeongjeong slept on your lap all night."
      },
      "c39_after_record": {
        "tag": "Kept the Original",
        "title": "The 20 minutes the reference opinion flagged were bound into a record, original and all",
        "text": "The original 20 minutes, the 'reference opinion,' and the edit history were bound into one folder. Gong Byungman’s '12 minutes' tape was filed right beside it."
      },
      "c39_after_rush": {
        "tag": "Left First",
        "title": "You went to meet the informant before the credits rolled",
        "text": "You left the editing room before the broadcast even ended. The informant at Hapjeong Station Exit 7 left only the next meeting instead of a name."
      }
    },
    "continuityChallenges": {
      "c38_after_warm": {
        "title": "Watch with the plaintiffs you saw off",
        "text": "The plaintiffs you saw off to the very end the day of the first hearing are on screen this time. Trust carries on only with a card that asks them to decide their own running time and faces."
      },
      "c38_after_record": {
        "title": "Revive the two sentences from the courtroom notes",
        "text": "Two sentences from the courtroom notes you organized fall inside the 20 minutes to be cut. A card that reframes the table turns the footage being cut back into a record that won’t vanish."
      },
      "c38_after_rush": {
        "title": "Leave a process behind in the editing room you reached first",
        "text": "You left the people outside the court and came to the editing room first. Fairness builds up on the side that gets in writing who said to cut what."
      }
    }
  }
};
