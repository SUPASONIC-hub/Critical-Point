/**
 * 사건 03 (src/nodes/case03.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c3_start": {
      "text": "The bid waiting room at Novaworks headquarters. Novaworks, a mid-sized manufacturer, has put a systems-integration contract out to open tender. On the table sit a sealed document envelope and two bottles of water; on the wall, a clock counts down to the deadline. 4 hours. Novaworks has borrowed 124 billion won from KD Bank, and the contract payment flows to a group affiliate. The bid goes out under that affiliate’s name, and Trigger Lab writes it. Han Seoyun speaks flatly. 'Don’t ask which account that money goes to. Just know this. Oh Jinwoo got the same documents and is submitting a bid from the next room at the same time. Upstairs they call this measuring the quality of thinking under competitive pressure. I call it HR material.' At the very back of the envelope is a single anonymous tip: the system to be delivered has a defect.",
      "memo": [
        "4 hours to bid deadline",
        "Client demand: cut costs 18%",
        "Novaworks loan balance 124 billion won, main bank KD Bank",
        "Anonymous tip: login-bypass flaw in the system to be delivered"
      ],
      "choices": {
        "c3_start_fast": {
          "label": "Put a 1st draft on the table before Oh Jinwoo"
        },
        "c3_start_mirror": {
          "label": "Guess Oh Jinwoo’s bid and build a counter-bid"
        },
        "c3_start_deep": {
          "label": "Dig into the tip’s login-bypass flaw first"
        },
        "reframe": {
          "label": "Propose a different strategy"
        }
      },
      "place": "Novaworks bid waiting room",
      "clock": "Bid deadline · 4h",
      "question": "Oh Jinwoo is writing a rival bid from the same documents next door. Do you choose speed or verification first?",
      "lead": "You have left the audit office for the Novaworks bid. This company also borrows 124 billion won from KD Bank, and the contract payment flows to a group affiliate. You and Oh Jinwoo got the same documents and sit in different rooms."
    },
    "c3_split": {
      "title": "Two Answers",
      "text": "Oh Jinwoo’s 1st draft lands on the waiting-room table. Cost cut 21%; yours is 13%. His is half as long, too. His bid lumps the security tip under 'unconfirmed risk' and pushes it to the last page. If the flaw is real, the cost after signing exceeds the savings, but that calculation is on no page. A moment later he walks over himself, leans on the doorframe and straightens his tie. 'You know about my father. He held an approval one day and got pushed out, and 3 years later the file was closed as if nothing had been wrong. Late means wrong. Here, it does.'",
      "memo": [
        "Oh Jinwoo’s bid: 21% cost cut",
        "Your current bid: 13% cost cut",
        "If the flaw is real, post-contract loss exceeds savings",
        "Client prefers bids with clear numbers"
      ],
      "choices": {
        "c3_split_invert": {
          "label": "Turn the client’s comparison into a failure-cost race"
        },
        "c3_split_deep": {
          "label": "Price the flaw’s fallout next to the savings"
        },
        "c3_split_mirror": {
          "label": "See his 21% and cut your 13% bid further"
        },
        "reframe": {
          "label": "Reframe the table and propose"
        }
      },
      "place": "Novaworks bid waiting room",
      "clock": "Bid deadline · 3h",
      "question": "Oh Jinwoo’s bid is cheaper and cleaner. Do you chase his savings rate, or prove the security flaw?",
      "lead": "The 1st draft from next door arrived first. It pushes the security tip to the back as 'unconfirmed risk'."
    },
    "c3_score": {
      "title": "The Scoreboard Trap",
      "text": "On one waiting-room wall glows the Trigger Lab scoreboard. Oh Jinwoo 84, you 71. You submitted first, but he leads on savings, length and clarity of presentation. Yet scan the categories top to bottom and there is no 'long-term failure cost'. The money a defect costs after delivery counts as 0 on this sheet. ECHO opens the edit history of the scoring sheet. The last edit came from the Group Strategy Office, at two in the morning the day after the FlowOn file closed. 'This sheet was not made for this bid. It was made to compare two people.' From next door, the sound of Oh Jinwoo’s printer comes through the wall.",
      "memo": [
        "Scoreboard: Oh Jinwoo 84 / you 71",
        "No long-term failure cost category",
        "Scoring sheet last edited: Group Strategy Office, 02:14 the day after the FlowOn file closed",
        "Tipster still anonymous"
      ],
      "choices": {
        "c3_score_fast": {
          "label": "Cut the failure-cost section to fit the scoring"
        },
        "c3_score_deep": {
          "label": "Trace Ban Jaewook and the tipster’s post at Novaworks"
        },
        "c3_score_invert": {
          "label": "Table the strategy office’s scoring edit formally"
        },
        "reframe": {
          "label": "First ask what the score measures"
        }
      },
      "place": "Novaworks bid waiting room · Scoreboard",
      "clock": "Bid deadline · 2h",
      "question": "Oh Jinwoo leads on the scoreboard. Do you fit its criteria, or call out its flaw?",
      "lead": "The Trigger Lab scoreboard has speed and savings, but no category for long-term failure cost."
    },
    "c3_trap": {
      "title": "A Designed Contest",
      "text": "Between equipment cases at the back of the presentation hall, Ban Jaewook approaches quietly. He speaks without closing his notebook. 'I found the tipster. A manager on the Novaworks treasury team. It isn’t just the flaw they reported. They also reported why this bid came out right now. An amount equal to the contract payment is set to wipe the FlowOn loss off the books.' On stage, someone is running a sound check. For the first time he looks straight at you. 'This isn’t a bidding problem. It’s a setup to see what checks you give up when you try to win. I don’t know if Oh Jinwoo heard the same thing.' He writes the current time in his notebook.",
      "memo": [
        "Tipster: manager, Novaworks treasury team",
        "Contract payment matches planned FlowOn loss write-off",
        "Oh Jinwoo may have been given separate pressure terms",
        "20 minutes to final presentation"
      ],
      "choices": {
        "c3_trap_mirror": {
          "label": "Play the stage to beat Oh Jinwoo"
        },
        "c3_trap_deep": {
          "label": "Open your files to Oh Jinwoo and draft a joint bid"
        },
        "c3_trap_invert": {
          "label": "Reveal the contest’s design to the Novaworks client"
        },
        "reframe": {
          "label": "Change the game one last time"
        }
      },
      "place": "Behind the Novaworks presentation hall",
      "clock": "Final presentation · 20m",
      "question": "This bid may be a setup to watch you drop your checks, not a contest. Do you still go for the win?",
      "lead": "Before the presentation, Ban Jaewook approaches quietly. There is no knowing whether Oh Jinwoo heard the same thing."
    },
    "c3_aftershock": {
      "title": "The Winner’s Blank Screen",
      "text": "The morning after the presentation, the empty hall holds only rows of folding chairs, and the stage screen is off. The final scores were never released. In the last tally before the presentation, the side that pushed the security flaw to the back scored higher, and the client sent a single notice putting both bids on hold. Oh Jinwoo sits on the edge of the stage, waiting. His tie is in his pocket. He asks whether yesterday’s result was for the client, or whether you just ran a race where someone had even drawn up the scoring sheet. 'That scoring sheet. The Group Strategy Office edited it at two in the morning the day after the FlowOn file closed. I saw.' He looks up at the dark screen. 'Win or lose, nothing came up on that screen. So what were we competing for?'",
      "memo": [
        "Client put both bids on hold",
        "Scoring sheet edited at 2 a.m. the day after the FlowOn file",
        "The side that hid the security flaw scored higher"
      ],
      "choices": {
        "c3_after_proof": {
          "label": "Release the evidence of the flaw before the score"
        },
        "c3_after_win": {
          "label": "Lock in the last tally as your win, use his gaps"
        },
        "c3_after_share": {
          "label": "Merge both bids’ strengths and re-propose"
        }
      },
      "place": "Novaworks presentation hall",
      "clock": "Day after the presentation",
      "question": "The scores were never released. How do you settle who this contest was for?",
      "lead": "The client put both bids on hold. Oh Jinwoo is waiting for you at the back of the hall."
    },
    "c3_rival": {
      "title": "Same Data, Different Aims",
      "text": "Oh Jinwoo comes over again holding a single sheet. Numbers that were not in your envelope. What Novaworks has paid out over delivery failures, and the list of people named responsible each time. 'What the client really wants to buy isn’t savings. It’s someone to take the blame when things go wrong.' He taps the bottom line of the list. The client wants the liability clause separately, not in the open tender, and his bid has shifted that liability to a subcontractor. The security team is not on the list of presenters. 'The 18% is an excuse. We got the same data. I just asked this question first.'",
      "memo": [
        "Client wants the liability clause kept private",
        "Rival bid shifts liability to a subcontractor",
        "Security team left out of the presentation"
      ],
      "choices": {
        "c3_rival_choice_3": {
          "label": "Ask Oh Jinwoo where his extra numbers came from"
        },
        "c3_rival_choice_2": {
          "label": "Recalculate the cost table first"
        },
        "c3_rival_choice_1": {
          "label": "Put the liability clause up front"
        }
      },
      "place": "Novaworks bid waiting room",
      "clock": "Bid deadline · 2h 40m",
      "question": "The client wants someone to blame if it fails, not savings. Do you put the liability clause up front?"
    },
    "c3_signal": {
      "title": "A Signal from the Seats",
      "text": "45 minutes before the final presentation, the control booth at the back of the hall. On stage, Oh Jinwoo is rehearsing first. Then a small light above the back row of seats blinks twice. Same interval as the security warning light. The client’s representative says they never sent any such signal. Nobody knows if Trigger Lab turned it on, either. But the moment Oh Jinwoo sees the light, he changes his answer. Instead of the one he prepared, he gives another, much faster than usual. ECHO puts his response times on screen. 'Down from an average of 4.2 seconds to 1.1. He knows what this signal means, or believes he does.'",
      "memo": [
        "The light blinks at the security-warning interval",
        "Client representative denies the signal",
        "Oh Jinwoo’s response time abnormally short"
      ],
      "choices": {
        "c3_signal_choice_4": {
          "label": "Share your reading of the signal with Oh Jinwoo"
        },
        "c3_signal_choice_2": {
          "label": "Stop the rehearsal and check security first"
        },
        "c3_signal_choice_3": {
          "label": "Push your conclusion before your rival does"
        },
        "c3_signal_choice_1": {
          "label": "Turn the signal into a public question"
        }
      },
      "place": "Behind the Novaworks presentation hall",
      "clock": "Final presentation · 45m",
      "question": "A light behind the hall blinked twice and Oh Jinwoo changed his answer. Do you make this signal public?"
    },
    "c3_verdict": {
      "title": "At the End of the Contest",
      "text": "10 minutes before the presentation, Han Seoyun stands in the passage beside the stage. The running order lists your name and Oh Jinwoo’s, one above the other, with a single ballpoint line between them. 'The client wants a conclusion today. The flaw isn’t fully proven yet. If you two go out together, the liability splits in half.' She folds the running order. 'At this point nobody asks who was fast and who was late. All that’s left is what standard you closed this contest on. And the one deciding that right now is you, Analyst.' The stage manager holds up both open hands. 10 minutes.",
      "memo": [
        "Client wants a conclusion today",
        "Security flaw not yet fully proven",
        "A joint presentation splits the liability"
      ],
      "choices": {
        "c3_verdict_choice_1": {
          "label": "Finish verification, then present"
        },
        "c3_verdict_choice_2": {
          "label": "Present under joint liability"
        },
        "c3_verdict_choice_3": {
          "label": "Hide the uncertainty and lock in the win"
        }
      },
      "place": "Behind the Novaworks presentation hall",
      "clock": "Final presentation · 10m",
      "question": "You are no longer the fast one or the slow one, but the one who sets the standard. By what standard do you end this?"
    },
    "c3_rival_reaction": {
      "title": "The Rival’s Offer",
      "text": "Oh Jinwoo slides the whole printout of his bid across the table. His signature is on the cover. 'You can take it. Copy it if you like, or fix it and submit first.' He is not joking. He doesn’t sit, only grips the back of a chair. 'In return, there’s something I want to see. Where you fix it once you have it. Whether you raise the savings rate, touch the liability clause, or bring the tip from the last page to the front.' On the Trigger Lab scoreboard on the waiting-room wall, the number next to his name ticks up one more notch. 'All I’ve learned is how to win. If there’s another answer, I need to see what it is.'",
      "memo": [
        "Liability clause hidden in the rival bid",
        "Evidence to start a joint verification"
      ],
      "choices": {
        "c3_rival_reaction_choice_2": {
          "label": "Question the data’s source and halt the talks"
        },
        "c3_rival_reaction_choice_3": {
          "label": "Use his bid and submit first"
        },
        "c3_rival_reaction_choice_1": {
          "label": "Propose terms for joint verification"
        }
      },
      "place": "Novaworks bid waiting room",
      "clock": "Bid deadline · 2h 20m",
      "question": "Oh Jinwoo says you can take his bid. How do you take this offer?"
    },
    "c3_signal_reaction": {
      "title": "The Light That Blinked Twice",
      "text": "30 minutes before the presentation, the light blinks twice again. This time the client’s representative in the front row turns to look at it too. Then, without a word, faces forward again. Han Seoyun comes to stand beside the control booth. 'You saw. He saw, Oh Jinwoo saw, and I saw.' She rests a hand on the booth railing. 'But nobody asks what it is. Whoever asks first becomes the one who stopped the presentation. And the cost of stopping sticks to whoever stopped.' On stage, the host is turning the running order. You are next.",
      "memo": [
        "Source of the twice-blinking signal",
        "Who bears the cost of stopping the presentation"
      ],
      "choices": {
        "c3_signal_reaction_choice_1": {
          "label": "Ask what the signal means in front of everyone"
        },
        "c3_signal_reaction_choice_2": {
          "label": "Keep presenting and log the signal"
        },
        "c3_signal_reaction_choice_3": {
          "label": "Ignore the signal and secure the score"
        }
      },
      "place": "Novaworks presentation hall",
      "clock": "Final presentation · 30m",
      "question": "The signal blinked again and the client’s representative saw it too. Who will say what it means first?"
    },
    "c3_verdict_reaction": {
      "title": "The Liability Sheet After the Win",
      "text": "When the rehearsal ends, ECHO puts a table on the backstage terminal. The score column is already filled in. This table alone shows who is ahead. But the liability sheet below it is blank. If a flaw surfaces after delivery, who stands before the client, who pays, who keeps the record. All three lines have no name. 'Who will win is nearly settled. Who will explain the failure that comes after success is not. This sheet must be filled in before anyone goes on stage.' At the end of the passage, Oh Jinwoo is buttoning his jacket.",
      "memo": [
        "Liability sheet blank after the win",
        "The promise a joint presentation leaves"
      ],
      "choices": {
        "c3_verdict_reaction_choice_2": {
          "label": "Write your own name at the top"
        },
        "c3_verdict_reaction_choice_1": {
          "label": "Fill in the liability sheet jointly"
        },
        "c3_verdict_reaction_choice_3": {
          "label": "Discuss liability after results come in"
        }
      },
      "place": "Novaworks presentation hall",
      "clock": "Final presentation · 5m",
      "question": "The scores are in, but the liability sheet is blank. Who will explain the failure after success?"
    },
    "c3_branch_signal": {
      "title": "Stopping to Read the Signal in the Corner",
      "text": "40 minutes before the final presentation, the control booth at the back of the hall. In a corner of the big stage screen, a small marker blinks twice and goes out. It is not in the presentation deck. ECHO captures the time it came on. 'The source is one of two. The competing side put it in to rattle the presentation, or a client-side account made a last request for confirmation. The client account was logged in at the same time.' The host pretends not to see and turns the running order. Stop the rehearsal now to read that signal, and the order slips, and the lost time comes off the score. Move on without reading it, and nobody will ever ask what that marker was.",
      "memo": [
        "Time the signal came on",
        "Client account’s response",
        "Cost of halting the presentation"
      ],
      "choices": {
        "c3_branch_signal_c": {
          "label": "Ignore the signal and finish the contest"
        },
        "c3_branch_signal_b": {
          "label": "Stop the rehearsal and check the source"
        },
        "c3_branch_signal_a": {
          "label": "Turn the signal into a public question"
        }
      },
      "place": "Behind the Novaworks presentation hall",
      "clock": "Final presentation · 40m",
      "question": "A signal not in the deck lit up on the presentation screen. Do you stop and read it, or carry on?"
    },
    "c3_branch_signal_follow": {
      "title": "The Terms of a Fast Win",
      "text": "25 minutes before the presentation, Oh Jinwoo comes down from the stage and holds out a sheet. The award terms the client circulated in advance. The amount, schedule and staffing boxes are printed; three boxes are blank. Who benefits from this result, by when the unverified security items get checked, what terms carry over to the next contract. 'Even if today goes well, if these boxes are blank, the next bid starts from these blanks. And I’ll come in through them.' He lays his pen on the terms sheet. 'If you’re going to fill them, it’s now. When the presentation ends, this sheet goes into the client’s drawer.'",
      "memo": [
        "Who benefits from the winning presentation",
        "Unverified security items",
        "Terms for the next contract"
      ],
      "choices": {
        "c3_branch_signal_follow_b": {
          "label": "Announce joint owners of liability"
        },
        "c3_branch_signal_follow_c": {
          "label": "Lock in the performance figures first"
        },
        "c3_branch_signal_follow_a": {
          "label": "Attach a verification deadline to the win"
        }
      },
      "place": "Novaworks presentation hall",
      "clock": "Final presentation · 25m",
      "question": "The terms sheet for a fast win is blank. Do you nail down a verification deadline?"
    },
    "c3_route_fast": {
      "title": "The Shadow of the First Answer",
      "text": "With three and a half hours to the deadline, your 1st draft is logged first. On the waiting-room scoreboard, your name moves up a notch. The client’s contact gives a thumbs-up from the hallway. A moment later Oh Jinwoo walks in without knocking. In his hand is a printout of your bid, highlighted in four places. 'You’re fast. Here, here, here, and the security tip. I only marked what you skipped.' He sets the printout on the table. 'The client will like it. A fast answer even tells them what they don’t have to look at. That’s how I’ve won, too.'",
      "memo": [
        "Client responds to a fast conclusion",
        "Security tip still on the back page",
        "Oh Jinwoo marked the points you skipped"
      ],
      "choices": {
        "c3_route_fast_polish": {
          "label": "Polish the numbers to hold the scoreboard lead"
        },
        "c3_route_fast_lock": {
          "label": "Attach a verification deadline to the fast bid"
        },
        "c3_route_fast_reopen": {
          "label": "Disclose the security items you skipped yourself"
        },
        "c3_route_fast_evidence_turn": {
          "label": "Open the second scoreboard under the public one"
        }
      },
      "place": "Novaworks bid waiting room",
      "clock": "Bid deadline · 3h 30m",
      "question": "Your first answer left a shadow. Do you keep pushing speed?",
      "lead": "You have just submitted a 1st draft before Oh Jinwoo. Being fast is starting to become the standard."
    },
    "c3_final_win": {
      "title": "The Standard a Fast Answer Set",
      "text": "Just before the final presentation, the waiting passage beside the stage. Oh Jinwoo stops straightening his tie and turns to you. 'You can win. The final presentation score is still to come.' He holds out a draft of the terms. The verification-deadline box is blank. 'The problem is after you win. The client will demand the speed they got today from the next person too. In the next bid, I’ll come in at that speed.' The stage lights brighten a step. 'The fast answer becomes the standard. And nobody remembers who set it first.'",
      "memo": [
        "The scoreboard rewards speed",
        "Verification deadline still outside the contract terms",
        "Oh Jinwoo can use the same pressure in the next bid"
      ],
      "choices": {
        "c3_final_win_b": {
          "label": "Report speed as the result, same standard next bid"
        },
        "c3_final_win_a": {
          "label": "Write a verification deadline into the contract"
        },
        "c3_final_win_c": {
          "label": "Hand the client your list of skipped items too"
        }
      },
      "place": "Novaworks presentation hall",
      "clock": "Just before final presentation",
      "question": "The fast answer has become the standard. Do you lock that standard in?"
    },
    "c3_route_deep": {
      "title": "Evidence Piles Up on the Slow Side",
      "text": "At the technical review desk in a corner of the waiting room, Ban Jaewook has stacked a pile of papers beside his laptop. Following the wording of the anonymous tip leads to a defect report written before the bid documents. It says the login of the system to be delivered can be skipped, and the conclusion box reads only 'fix in next version'. The next version never came out. The wall clock shows three and a half hours, and next door the printer is already running. Ban Jaewook writes the report number in his notebook. 'It will look like you’re losing. Still, one question remains. Whether you can sign off on the contract knowing this.'",
      "memo": [
        "Old defect report found",
        "Bid deadline drawing closer",
        "Client still doesn’t want the flaw disclosed"
      ],
      "choices": {
        "c3_route_deep_attach": {
          "label": "Attach the defect report to the bid’s first page"
        },
        "c3_route_deep_bury": {
          "label": "Tuck the flaw in an internal appendix, keep bidding"
        },
        "c3_route_deep_delay": {
          "label": "Formally request verification time before signing"
        },
        "c3_route_deep_evidence_turn": {
          "label": "Open the second scoreboard under the public one"
        }
      },
      "place": "Novaworks bid waiting room · Technical review desk",
      "clock": "Bid deadline · 3h 30m",
      "question": "Evidence piles up on the slow side. When do you bring it out?",
      "lead": "You have just chosen to build the grounds before a fast answer. While you seem to be losing, only the files grow."
    },
    "c3_final_right": {
      "title": "The Cost of the Right Answer",
      "text": "Just before the final presentation, the prep room beside the hall. Ban Jaewook lays the defect report and your bid side by side and opens his notebook. The flaw is almost certain. But proving it all the way takes one more day, and the client hasn’t answered whether it will extend the deadline. On the scoreboard, your name is at the bottom. 'When the right answer comes late, here it gets written down as wrong. Being accurate alone doesn’t win a bid.' He taps one blank box with his pen. 'That’s why this box is needed. Who bears the loss from submitting this bid. You, the company, or the client. It has to be written down so it can be argued later.'",
      "memo": [
        "The flaw is highly likely",
        "Deadline extension uncertain",
        "The accurate answer loses the score for now"
      ],
      "choices": {
        "c3_final_right_c": {
          "label": "Book the loss as company cost, verify separately"
        },
        "c3_final_right_b": {
          "label": "Bury the flaw in an appendix and win on price"
        },
        "c3_final_right_a": {
          "label": "Submit with the defect report and accept losing"
        }
      },
      "place": "Novaworks presentation hall",
      "clock": "Just before final presentation",
      "question": "The right answer carries a loss. Do you accept that loss?"
    },
    "c3_route_mirror": {
      "title": "The One Who Reads the Other’s Game",
      "text": "On the waiting-room whiteboard you sketch the bid Oh Jinwoo would likely have written. Savings items, schedule, staffing. Follow his order and the line breaks in one place. The box that states who is liable if something goes wrong after delivery. It isn’t a slip. The boxes before and after are too neat. Just then Oh Jinwoo, passing the open door, sees the whiteboard and stops. 'So you got that far.' He doesn’t come in. 'I left that box empty on purpose. Partly to win, yes, and partly because I wondered if anyone would see it.'",
      "memo": [
        "Liability clause in Oh Jinwoo’s bid is empty",
        "A joint bid becomes possible",
        "Stopping the contest loses the scoreboard lead"
      ],
      "choices": {
        "c3_route_mirror_call": {
          "label": "Ask Oh Jinwoo directly about the empty clause"
        },
        "c3_route_mirror_use": {
          "label": "Use the blank to tilt your bid your way"
        },
        "c3_route_mirror_share": {
          "label": "Turn the blank into joint verification terms"
        },
        "c3_route_mirror_evidence_turn": {
          "label": "Open the second scoreboard under the public one"
        }
      },
      "place": "Novaworks bid waiting room",
      "clock": "Bid deadline · 3h 30m",
      "question": "You read your rival’s game to build a counter-bid. What do you change inside that game?",
      "lead": "You have just chosen to read the bid coming from next door first."
    },
    "c3_final_joint": {
      "title": "Use the Rival as a Tool?",
      "text": "Just before the final presentation, Oh Jinwoo waits in the passage beside the stage. In his hand are his bid and that one page with the empty liability clause. 'You can beat me. Just point at this blank in front of the client.' He folds the page in half. 'Or you can use me as a witness. I can guess this bid is a place that pits us two against each other to see what we throw away.' On stage, your name is called. 'You can end the contest here, or put the contest itself forward as evidence. I’ll follow you out either way. I hate losing, but I hate being used more.'",
      "memo": [
        "A joint bid splits the liability",
        "A solo bid is favored on the scoreboard",
        "Exposing the contest’s structure unsettles the client"
      ],
      "choices": {
        "c3_final_joint_c": {
          "label": "Raise the contest’s structure itself with the client"
        },
        "c3_final_joint_b": {
          "label": "Push a solo bid on the grounds of his blank"
        },
        "c3_final_joint_a": {
          "label": "Bid jointly, fill the clause with both names"
        }
      },
      "place": "Novaworks presentation hall",
      "clock": "Just before final presentation",
      "question": "You can use your rival as a tool, or stand him up as a co-owner of liability. Which is it?"
    },
    "c3_route_system": {
      "title": "The Scoreboard Follows You",
      "text": "Before competing with Oh Jinwoo, you ask how the scoring works. The waiting-room scoreboard flickers. A new category appears. The name of the game you just reframed has become the category name, word for word. Oh Jinwoo’s score is recalculated on that category too. The client’s screen shows no explanation of why the categories changed. ECHO puts up one line. 'This scoreboard is not a fixed ruler. When the analyst puts forward a standard, it is redrawn to follow it. This bid is not a place to watch your contest with Mr. Oh Jinwoo. It is a device to see what standard the analyst makes, and how far that standard is followed.'",
      "memo": [
        "The reframed game becomes a new scoring category",
        "Oh Jinwoo’s score recalculated at the same time",
        "Client screen shows no reason for the change"
      ],
      "choices": {
        "c3_route_system_ride": {
          "label": "Ride the changed scoreboard to lock in the lead"
        },
        "c3_route_system_read": {
          "label": "Trace where the new category came from"
        },
        "c3_route_system_tell": {
          "label": "Tell Oh Jinwoo first that the scoreboard changed"
        },
        "c3_route_system_evidence_turn": {
          "label": "Open the second scoreboard under the public one"
        }
      },
      "place": "Novaworks bid waiting room",
      "clock": "Bid deadline · 3h 30m",
      "question": "The scoreboard follows you. How do you handle this scoring structure?",
      "lead": "You submitted neither a fast bid nor a slow one and reframed the table, and the scoreboard added that frame as a category."
    },
    "c3_final_system": {
      "title": "The One Who Set the Standard",
      "text": "Just before the final presentation, the scoreboard on the screen beside the stage is revised once more. A new category appears, and your score and Oh Jinwoo’s are recalculated on the spot. The new category’s name comes word for word from the standard you put forward about this scoreboard. The client’s screen shows not one line on why it changed. From the seats, the table looks as if it was always like this. ECHO adds: 'This bid does not choose one of two people. It chooses the one who makes the standard.' Below the stage, Oh Jinwoo is looking up at the changed numbers. He saw that moment, too.",
      "memo": [
        "New scoring category: taken from the analyst’s standard",
        "Oh Jinwoo’s score recalculated as well",
        "Client screen shows no reason for the change"
      ],
      "choices": {
        "c3_final_system_b": {
          "label": "Hide the standard and use only the results"
        },
        "c3_final_system_c": {
          "label": "Reject the scoreboard itself with Oh Jinwoo"
        },
        "c3_final_system_a": {
          "label": "Disclose your scoring standard to the client"
        }
      },
      "place": "Novaworks presentation hall",
      "clock": "Just before final presentation",
      "question": "The contest structure itself was the test. Do you hand this structure to the client?"
    },
    "c3_evidence_turn": {
      "title": "The Second Scoreboard",
      "text": "When you lay the clue you were holding against the scoring sheet, the screen splits in two. The scoreboard the client sees, and a second one used only for internal review. Same categories, different weights. On the outside sheet savings weigh most; on the inside sheet, speed. From the back of the hall, Oh Jinwoo looks at the screen over your shoulder. He isn’t surprised. 'I saw it too.' He puts his hands in his pockets. 'Win on the outside sheet and the client signs. Win on the inside sheet and it stays in your HR file. Which one counts as the real contract standard, I haven’t decided yet either.'",
      "memo": [
        "External and internal scoreboards weigh differently",
        "Oh Jinwoo knows about the same mismatch",
        "A fast win may leave the hidden scoreboard in place"
      ],
      "choices": {
        "c3_evidence_turn_use": {
          "label": "Exploit the internal scoreboard to win the contract"
        },
        "c3_evidence_turn_merge": {
          "label": "Merge both scoreboards and resubmit to the client"
        },
        "c3_evidence_turn_refuse": {
          "label": "Refuse the scoreboard contract itself"
        }
      },
      "place": "Behind the Novaworks presentation hall",
      "clock": "Final presentation · 15m",
      "question": "A second scoreboard has appeared. Do you make it public?"
    },
    "c3_start_audit": {
      "title": "A Contest of Restored Records",
      "text": "The bid waiting room at Novaworks headquarters; two bottles of water and a sealed document envelope sit on the table. Novaworks, a mid-sized manufacturer, has put a systems-integration contract out to open tender, the deadline is 4 hours away, and the requirement is an 18% cost cut. Novaworks borrows 124 billion won from KD Bank, and next door Oh Jinwoo is tearing open the same envelope. Ban Jaewook stands in the doorway, notebook open. 'Yesterday you traced back from the custodian of the originals and restored the flow of records. Those records aren’t fully pieced together yet.' He pulls a single sheet from the back of the envelope and hands it to you. An anonymous tip: the system to be delivered has a flaw that skips the login. 'Mr. Oh Jinwoo has already made an easy-to-read answer. And the client prefers certainty to grounds.'",
      "memo": [
        "The audit record is incomplete",
        "4 hours to bid deadline",
        "Client wants certainty over grounds"
      ],
      "choices": {
        "c3_start_audit_fast": {
          "label": "Put a 1st draft on the table before Oh Jinwoo"
        },
        "c3_start_audit_signature": {
          "label": "Find the tip’s original first, as last Case"
        },
        "c3_start_audit_deep": {
          "label": "Dig into the tip’s login-bypass flaw first"
        },
        "c3_start_audit_mirror": {
          "label": "Guess Oh Jinwoo’s bid and build a counter-bid"
        },
        "c3_start_audit_reframe": {
          "label": "Propose a different strategy"
        }
      },
      "place": "Novaworks bid waiting room",
      "clock": "Bid deadline · 4h",
      "question": "You restored the records; now speed is demanded of you. Which do you put out first, the original or the easy-to-read answer?",
      "lead": "You have left the audit office for the bid at Novaworks, the client. Oh Jinwoo is receiving the same documents next door."
    },
    "c3_start_person": {
      "title": "A Contest After Trusting a Person",
      "text": "The bid waiting room at Novaworks headquarters. Novaworks, a mid-sized manufacturer, has put a systems-integration contract out to open tender, the deadline is 4 hours away, and the requirement is an 18% cost cut. Novaworks borrows 124 billion won from KD Bank, and next door Oh Jinwoo is writing a bid from the same documents. Do Yoonha passes on something he heard in the hallway. Oh Jinwoo told the client’s contact about the last Case. About the analyst who asked Lee Minseo about the missing records before checking the logs. 'He called it a weakness. Someone who slows down because they trust people.' At the very back of the document envelope is an anonymous tip: the system to be delivered has a flaw that skips the login. Oh Jinwoo’s bid erased every cost like that.",
      "memo": [
        "Client promised to reward speed",
        "Lee Minseo’s testimony partly made public",
        "Rival bid deleted the protection costs"
      ],
      "choices": {
        "c3_start_person_signature": {
          "label": "Entrust this verification to Lee Minseo"
        },
        "c3_start_person_deep": {
          "label": "Dig into the tip’s login-bypass flaw first"
        },
        "c3_start_person_fast": {
          "label": "Put a 1st draft on the table before Oh Jinwoo"
        },
        "c3_start_person_mirror": {
          "label": "Guess Oh Jinwoo’s bid and build a counter-bid"
        },
        "c3_start_person_reframe": {
          "label": "Propose a different strategy"
        }
      },
      "place": "Novaworks bid waiting room",
      "clock": "Bid deadline · 4h",
      "question": "Your choice to protect Lee Minseo is being called a weakness. Do you keep that standard this time too?",
      "lead": "You have left the audit office for the bid at Novaworks, the client. Oh Jinwoo has already read the you of the last Case."
    },
    "c3_start_public": {
      "title": "A Contest Turned Alarm",
      "text": "The bid waiting room at Novaworks headquarters; when you open the door, three client staff look up at once. They all know you are the one who told outsiders the records might have been tampered with. It is an open tender for systems integration at Novaworks, a mid-sized manufacturer; the deadline is 4 hours away, and the requirement is an 18% cost cut. Novaworks borrows 124 billion won from KD Bank. Next door, Oh Jinwoo got the same documents and chose to say nothing. ECHO copies the client’s request onto the terminal. 'The client has requested a public explanation. An anonymous tip has been added to the document envelope: the system to be delivered has a flaw that skips the login. This time the contest is not over solutions. It is over who holds the alarm.'",
      "memo": [
        "Client demands a public explanation",
        "Oh Jinwoo makes silence his strategy",
        "Security flaw tip added"
      ],
      "choices": {
        "c3_start_public_deep": {
          "label": "Dig into the tip’s login-bypass flaw first"
        },
        "c3_start_public_signature": {
          "label": "As the one who sounded the alarm, demand a public panel"
        },
        "c3_start_public_fast": {
          "label": "Put a 1st draft on the table before Oh Jinwoo"
        },
        "c3_start_public_mirror": {
          "label": "Guess Oh Jinwoo’s bid and build a counter-bid"
        },
        "c3_start_public_reframe": {
          "label": "Propose a different strategy"
        }
      },
      "place": "Novaworks bid waiting room",
      "clock": "Bid deadline · 4h",
      "question": "Eyes turned to you after you warned outsiders of a possible leak. Is this fight over solutions, or over control of the alarm?",
      "lead": "You have left the audit office for the bid at Novaworks, the client. The alarm you raised has followed you to the bid."
    }
  },
  "echoReplies": {
    "c3_start_fast": "As you hand over the envelope, Han Seoyun checks the wall clock and notes the submission time. You are ahead on speed, but a fast conclusion may only win inside the frame your rival built.",
    "c3_start_deep": "You unfold the tip, and beside the water bottles the list of flaws grows line by line. The analysis runs deeper, but if Oh Jinwoo submits first, your judgment looks like a belated defense.",
    "c3_start_mirror": "Listening to the printer through the wall, you guess his numbers and write them down, and the gap narrows. From that moment your thinking walks the path your rival made.",
    "c3_split_mirror": "You cut the numbers again and your savings box lines up with Oh Jinwoo’s. What you dropped from the metrics while catching up stays on no page.",
    "c3_split_deep": "Reopening the math turns up the line where post-contract loss exceeds the savings. The proof is strong, but if the decision comes before it is done, it has no force at all.",
    "c3_split_invert": "You rewrite the comparison’s header row, and Oh Jinwoo pushes off the doorframe to look at it. Succeed and you take the table; fail and it goes on record as lost time.",
    "c3_score_fast": "You cut the section, and the 71 on the scoreboard climbs a few notches. The score rose, and the record also shows that the cut section was where failure sat.",
    "c3_score_invert": "You attach the 02:14 edit history to the agenda, and this contest stalls on the spot. From the next contest on, it starts from a different sheet. You leave the scoreboard issue on the agenda and move to the presentation hall.",
    "c3_score_deep": "Ban Jaewook crosses out Novaworks department names in his notebook one by one, and the range narrows. Your judgment firms up, but the search exposes the tipster just as much.",
    "c3_trap_mirror": "You move the numbers to stress onto the first page, and heads on the client side lift. You can win the presentation, but a winning presentation does not replace verification.",
    "c3_trap_invert": "As you describe the design, the sound check on stage stops and the table freezes. On a frozen table, the first to lose may be you.",
    "c3_trap_deep": "You knock on the next door, and Oh Jinwoo loosens his tie and spreads his files on the table. Verification has doubled, but your grounds are now your rival’s assets too.",
    "c3_after_share": "Merging them, the client gains. No record anywhere says you won.",
    "c3_after_proof": "Disclosing the flaw prevents the next incident. It also exposes the review process that let the flaw through.",
    "c3_after_win": "Using his gaps widens the lead. When the same method is used on you, you have less ground to protest.",
    "c3_rival_choice_1": "With the liability clause up front, the proposal grows heavier, and on the day it fails, only that sentence works.",
    "c3_rival_choice_2": "The recalculated table grows accurate, and meanwhile the client sees your rival’s numbers first.",
    "c3_rival_choice_3": "Asking the source gives your rival time to prepare, and not answering becomes an answer too.",
    "c3_signal_choice_1": "Turned into a question, the doubt goes public, and control of the presentation passes to the seats.",
    "c3_signal_choice_2": "A halted presentation is hard to restart, but better than finishing without checking.",
    "c3_signal_choice_3": "Pushing first, the score comes in today, and the next person pays the price of that signal.",
    "c3_signal_choice_4": "Sharing the reading splits the risk, but blurs the standard as well.",
    "c3_verdict_choice_1": "With verification done, the sentences firm up, and your rival has already taken the stage.",
    "c3_verdict_choice_2": "Shared liability eases today’s burden, and on the day it fails, it belongs to no one.",
    "c3_verdict_choice_3": "The covered uncertainty does not vanish; it grows quietly inside the locked-in win.",
    "c3_rival_reaction_choice_1": "Joint verification delays the contest and leaves a standard.",
    "c3_rival_reaction_choice_2": "While you stop, your rival keeps moving, but the grounds pile up on your side.",
    "c3_rival_reaction_choice_3": "Submitting first, you win, and the source inside that bid is never yours.",
    "c3_signal_reaction_choice_1": "A public question sets a standard even without an answer.",
    "c3_signal_reaction_choice_2": "Logging it and carrying on is also a way of deciding nothing.",
    "c3_signal_reaction_choice_3": "Taking the score first, the signal becomes the next person’s problem.",
    "c3_verdict_reaction_choice_1": "A sheet filled in together actually works when things fail.",
    "c3_verdict_reaction_choice_2": "The name at the top becomes a shield, but a shield for that one person alone.",
    "c3_verdict_reaction_choice_3": "A liability talk put off until later usually never happens.",
    "c3_branch_signal_a": "A public question disarms the interference. In exchange, you are asked on the spot for answers you never prepared.",
    "c3_branch_signal_b": "Stopping gets you the facts. The audience may read the stop itself as a lack of confidence.",
    "c3_branch_signal_c": "Ignoring it ends the contest. If that signal was the client’s last request for confirmation, the win holds only until today.",
    "c3_branch_signal_follow_a": "A deadline makes the result verifiable. It also means setting the date of your own failure.",
    "c3_branch_signal_follow_b": "Sharing liability makes execution solid. In the next contest, that person may be your rival.",
    "c3_branch_signal_follow_c": "The figures persuade at once. The blanks do not vanish; they become the next contest’s first question.",
    "c3_route_fast_lock": "Attaching a deadline weakens your edge, and makes liability after the win clear.",
    "c3_route_fast_polish": "The polished numbers win today. The skipped items wait inside the contract.",
    "c3_route_fast_reopen": "Opening your own omissions drops the score, and you set the standard for the next question.",
    "c3_final_win_a": "A deadline written into the contract stays for the next bid too. This margin shrinks.",
    "c3_final_win_b": "The client demands the same speed from the next person. That person is not you.",
    "c3_final_win_c": "Handing over the list raises trust, and this contract’s terms open up again.",
    "c3_route_deep_attach": "A flaw on the first page cannot go unread. In a bid, it reads against you.",
    "c3_route_deep_delay": "The request goes on record. Even if it is denied, the record shows who rushed.",
    "c3_route_deep_bury": "Nobody reads an appendix. When the flaw blows up, that fact becomes evidence.",
    "c3_final_right_a": "Elimination comes at once, and the company that signed knowing the flaw comes to light later.",
    "c3_final_right_b": "The contract comes in, and people outside the contract pay for the flaw.",
    "c3_final_right_c": "If the company bears the cost, verification continues. This quarter’s numbers worsen.",
    "c3_route_mirror_call": "The moment you ask, your rival also learns that you saw the blank.",
    "c3_route_mirror_use": "Using the gap, you win. You also learn how to leave the same gap.",
    "c3_route_mirror_share": "Joint verification erases your lead. In exchange, the liability clause is filled for the first time.",
    "c3_final_joint_a": "The joint bid falls behind on the scoreboard. In exchange, no clause is left empty.",
    "c3_final_joint_b": "The solo bid wins, and Oh Jinwoo uses the same method in the next bid.",
    "c3_final_joint_c": "The client grows uneasy. After this Case, the scoreboard’s categories change.",
    "c3_route_system_read": "The trace tilts toward this bid being an observation, not a contest.",
    "c3_route_system_ride": "A scoreboard fitted to you gets fitted to the next person too.",
    "c3_route_system_tell": "Telling him erases your lead, and the side that built the scoreboard is exposed for the first time.",
    "c3_final_system_a": "With the standard disclosed, this result wobbles, and the next evaluation goes through verification.",
    "c3_final_system_b": "The favorable result stays, and the sentence that made it passes to the next participant.",
    "c3_final_system_c": "When you both refuse, this bid collapses, and the evaluation method is discussed for the first time.",
    "c3_evidence_turn_merge": "A merged scoreboard erases this ranking. In exchange, the grounds for evaluation stay as one.",
    "c3_evidence_turn_use": "A contract won through a loophole holds only until the loophole is known.",
    "c3_evidence_turn_refuse": "Refusing loses revenue. The reason you refused stays on record.",
    "c3_route_fast_evidence_turn": "Held against the clue, the standard of the contest becomes the issue before the contest itself.",
    "c3_route_deep_evidence_turn": "Held against the clue, the standard of the contest becomes the issue before the contest itself.",
    "c3_route_mirror_evidence_turn": "Held against the clue, the standard of the contest becomes the issue before the contest itself.",
    "c3_route_system_evidence_turn": "Held against the clue, the standard of the contest becomes the issue before the contest itself.",
    "case03_memory_route": "Compare them and you see that only the liability clause is empty in Oh Jinwoo’s bid. Whether that blank is a mistake or a test, only he can tell you.",
    "case03_memory_system": "Scan it and one new category on the scoreboard is written in the same words as the table you reframed. The side doing the scoring was reading you.",
    "case03_memory_evidence": "Follow the mismatched times and, beneath the scoreboard the client sees, a second scoreboard for review opens. The two sheets weigh the same categories differently.",
    "c3_start_audit_fast": "Speed with grounds is different. But your rival skips the grounds and looks only at the conclusion.",
    "c3_start_audit_deep": "The habit of restoring becomes the habit of verifying. So does the verdict that you were slow both times.",
    "c3_start_audit_mirror": "Someone who has hunted erased traces sees the rival’s gaps first. This time that eye turns into guesswork.",
    "c3_start_person_fast": "This choice tries to cover the cost of protection with results. A covered cost does not vanish; it moves.",
    "c3_start_person_deep": "To defend a judgment built on trusting a person, you have to bring more grounds from somewhere else.",
    "c3_start_person_mirror": "Your rival already uses your last decision as material. Your response starts late.",
    "c3_start_public_fast": "Whoever warns first is bound to answer first. That duty forces speed.",
    "c3_start_public_deep": "Disclosure is the start; proof is the burden. Stop now and only the alarm remains.",
    "c3_start_public_mirror": "A disclosed risk becomes everyone’s resource. You have to read it before your rival uses it.",
    "c3_start_audit_signature": "Finding the original makes the tip hard-to-refute grounds. While you search, the bid from next door goes out first.",
    "c3_start_person_signature": "When the one once singled out becomes the verifier, the organization’s standard changes. Fail, and it is a second singling-out. While Lee Minseo checks the flaw, you have to read Oh Jinwoo’s coming bid first.",
    "c3_start_public_signature": "Demanding public verification, you end up asking again what the score is based on. Meanwhile the bid stalls, and you pay that cost."
  },
  "choiceVoiceLines": {
    "c3_start_fast": "Trying not to get swept up in Oh Jinwoo’s pace, you still put a 1st draft on the waiting-room table before him.",
    "c3_start_deep": "Saying you will look longer even if it seems you are losing, you dig into the tip’s login-bypass flaw first.",
    "c3_start_mirror": "Borrowing your rival’s game to find its weak spot from inside, you guess Oh Jinwoo’s bid and build a counter-bid.",
    "c3_split_mirror": "Granting his number and aiming one notch higher, you see Oh Jinwoo’s 21% and cut your 13% bid further.",
    "c3_split_deep": "To put in numbers why the cheap answer is expensive, you price the flaw’s fallout next to the savings.",
    "c3_split_invert": "Thinking the question itself may be wrong, you turn the client’s comparison into a failure-cost race.",
    "c3_score_fast": "Going with the shape the scoring sheet wants, you cut the failure-cost section to fit the scoreboard.",
    "c3_score_invert": "Since nobody can be right on this sheet, you table the Group Strategy Office’s scoring edit formally.",
    "c3_score_deep": "Since the tipster’s post matters before the tip, you trace Ban Jaewook and the tipster’s place at Novaworks.",
    "c3_trap_mirror": "Choosing to win on order and emphasis over content, you play the stage in the order that beats Oh Jinwoo.",
    "c3_trap_invert": "Saying you must first name who designed this contest, you reveal its design to the Novaworks client.",
    "c3_trap_deep": "Since not being wrong beats winning, you open your files to Oh Jinwoo next door and draft a joint bid.",
    "c3_after_share": "Setting win and loss aside, you merge both bids’ strengths and propose again to the client.",
    "c3_after_proof": "Since the side that hid the flaw scored higher, you release the evidence of the security flaw before the score.",
    "c3_after_win": "Cutting off your hesitation, you lock in the last tally as your win and use your rival’s gaps.",
    "c3_rival_choice_1": "I’ll check the liability clause sentence by sentence and put it at the very front of the proposal.",
    "c3_rival_choice_2": "I’ll separate the client’s aim from the aim of cutting costs and recalculate the cost table first.",
    "c3_rival_choice_3": "I’ll ask Oh Jinwoo directly where those numbers came from.",
    "c3_signal_choice_1": "Without stopping the rehearsal, I’ll turn that signal into a question and put it on screen.",
    "c3_signal_choice_2": "I’ll stop the rehearsal and check security first.",
    "c3_signal_choice_3": "Whatever the signal is, I’ll push my conclusion before my rival does.",
    "c3_signal_choice_4": "I’ll share my reading of the signal with my rival.",
    "c3_verdict_choice_1": "I’ll present once verification is finished.",
    "c3_verdict_choice_2": "I’ll present together, on the condition that we share the liability.",
    "c3_verdict_choice_3": "I’ll cover the uncertain parts and lock in the win first.",
    "c3_rival_reaction_choice_1": "I’ll propose terms for joint verification first.",
    "c3_rival_reaction_choice_2": "I’ll halt the talks until the data’s source is confirmed.",
    "c3_rival_reaction_choice_3": "I’ll use my rival’s bid and submit first.",
    "c3_signal_reaction_choice_1": "I’ll ask in front of everyone what the signal is.",
    "c3_signal_reaction_choice_2": "I’ll keep presenting and log the signal.",
    "c3_signal_reaction_choice_3": "I’ll leave the signal and secure the score first.",
    "c3_verdict_reaction_choice_1": "I’ll fill in the liability sheet together.",
    "c3_verdict_reaction_choice_2": "I’ll write my name at the top of the liability sheet.",
    "c3_verdict_reaction_choice_3": "I’ll discuss liability after the results are locked in.",
    "c3_branch_signal_a": "Hiding nothing, you turn the signal on the screen into a public question and put it on stage.",
    "c3_branch_signal_b": "Knowing it will break the flow, you stop the rehearsal and check the source.",
    "c3_branch_signal_c": "Pretending not to see the signal, you finish the contest while you can win.",
    "c3_branch_signal_follow_a": "Before locking in the win, you nail a verification deadline onto the terms sheet.",
    "c3_branch_signal_follow_b": "Sharing the applause you would get alone, you announce joint owners of liability.",
    "c3_branch_signal_follow_c": "Leaving the blanks as they are, you lock in the performance figures first.",
    "c3_route_fast_lock": "To keep the fast answer from setting as is, you attach a verification deadline as a condition.",
    "c3_route_fast_polish": "Judging it time to secure your lead, you polish the numbers and pin the scoreboard in place.",
    "c3_route_fast_reopen": "Seeing that you should be the first to name what you skipped, you disclose the security items.",
    "c3_final_win_a": "To keep speed from becoming the standard, you write a verification deadline into the contract.",
    "c3_final_win_b": "Judging the way you won was right, you take the next bid on the same standard.",
    "c3_final_win_c": "Seeing that the client must know what it missed, you hand over the list of skipped items too.",
    "c3_route_deep_attach": "As if refusing to hide the flaw in an appendix, you attach it to the first page.",
    "c3_route_deep_delay": "Seeing that checking comes before the deadline, you formally request verification time.",
    "c3_route_deep_bury": "Judging you can fix it after you win, you tuck the flaw into an appendix.",
    "c3_final_right_a": "As if refusing to submit a wrong bid even at the cost of losing, you submit with the report attached.",
    "c3_final_right_b": "Judging that accuracy does not win contracts, you compete on price.",
    "c3_final_right_c": "To settle first who bears the loss, you formally book it as company cost.",
    "c3_route_mirror_call": "To find out whether the blank is a mistake or a test, you ask Oh Jinwoo directly.",
    "c3_route_mirror_use": "Judging you will use the gap your rival left, you rework your bid in your favor.",
    "c3_route_mirror_share": "To change the game instead of winning, you turn the blank into joint verification terms.",
    "c3_final_joint_a": "Seeing that the table holds only if liability is written down shared, you put both names up together.",
    "c3_final_joint_b": "Judging that a contest is a contest, you push a solo bid on the grounds of your rival’s blank.",
    "c3_final_joint_c": "Seeing this contest itself as the problem, you raise its structure as an issue before the client.",
    "c3_route_system_read": "Seeing that you need to know where the new category came from, you trace its source.",
    "c3_route_system_ride": "Judging the changed table favors you, you ride it and lock in your lead.",
    "c3_route_system_tell": "As if refusing to win on information only you have, you tell Oh Jinwoo first.",
    "c3_final_system_a": "Starting with the fact that you were the one who made the standard, you open it to the client.",
    "c3_final_system_b": "Seeing no reason to explain, you keep the standard covered and use only the result.",
    "c3_final_system_c": "Proposing to stop the table instead of winning it, you reach out a hand to your rival.",
    "c3_evidence_turn_merge": "Seeing that the client must see both scoreboards, you merge them and submit again.",
    "c3_evidence_turn_use": "Judging that knowing the loophole is an advantage, you win the contract with it.",
    "c3_evidence_turn_refuse": "Refusing to sign a contract on this scoreboard, you step back from the table.",
    "c3_route_fast_evidence_turn": "Holding the scoreboard shown to the client against the clue, you dig into whether there really is only one.",
    "c3_route_deep_evidence_turn": "Holding the scoreboard shown to the client against the clue, you dig into whether there really is only one.",
    "c3_route_mirror_evidence_turn": "Holding the scoreboard shown to the client against the clue, you dig into whether there really is only one.",
    "c3_route_system_evidence_turn": "Holding the scoreboard shown to the client against the clue, you dig into whether there really is only one.",
    "c3_start_audit_fast": "With the records you restored behind you, sure you won’t lose on speed either, you put out the 1st draft first.",
    "c3_start_audit_deep": "Like someone who restored the records, you look at the flaw all the way through again.",
    "c3_start_audit_mirror": "Starting from a guess at what Oh Jinwoo erased, you build a counter-bid.",
    "c3_start_person_fast": "Set on repaying the cost of protecting a person with speed, you put out your bid first.",
    "c3_start_person_deep": "So as never to doubt again a person you once trusted, you dig on the side of the flaw.",
    "c3_start_person_mirror": "You first work out how Oh Jinwoo will use that protection.",
    "c3_start_public_fast": "Since the side that sounded the alarm can’t be slow, you put out your conclusion first.",
    "c3_start_public_deep": "Since whoever warns must also prove, you take verifying the flaw all the way.",
    "c3_start_public_mirror": "You first read the moves of whoever means to use the alarm.",
    "c3_start_audit_signature": "As you did in the last Case, you first find where the tip’s original came from.",
    "c3_start_person_signature": "You give the one who was once suspected the name on this verification.",
    "c3_start_public_signature": "Since you warned first, you demand that the verification be public too."
  },
  "pack": {
    "clue": {
      "title": "The Second Scoreboard",
      "text": "Behind the public scoreboard is another scoring sheet. Your rival watches not only your answers but your hesitation."
    },
    "outcomes": {
      "c3_after_share": {
        "tag": "Joint-Design Ending",
        "title": "You Turned the Contest into Joint Work",
        "text": "The rivalry with Oh Jinwoo did not go away, but the client was left with a bid two people stand behind."
      },
      "c3_after_proof": {
        "tag": "Evidence Ending",
        "title": "You Showed the Flaw Before the Score",
        "text": "The points you could gain now shrank, but the hidden security risk became public record for the next Case."
      },
      "c3_after_win": {
        "tag": "Locked-Lead Ending",
        "title": "The Fastest Answer Lasted Longest",
        "text": "The record shows you ahead, but you also took on the gaps your rival hid. The next Case bills you for that lead."
      }
    },
    "continuityChallenges": {
      "c2_after_audit": {
        "title": "Find the Gap in the Record",
        "text": "Find one more cost the restored records missed, and you can get past your rival’s fast answer."
      },
      "c2_after_person": {
        "title": "Protect and Verify at Once",
        "text": "Find a choice that protects a person and still leaves grounds, and you can withstand the pressure of the contest."
      },
      "c2_after_public": {
        "title": "Lower the Alarm’s Risk",
        "text": "A choice that lowers the risk that grew after disclosure becomes the standard for the next Case."
      }
    }
  }
};
