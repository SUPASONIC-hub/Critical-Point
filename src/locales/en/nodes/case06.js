/**
 * 사건 06 (src/nodes/case06.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c6_start": {
      "text": "The morning after you return from the recovery control room, the analyst room on Trigger Lab’s 4th floor. The monitor at the desk at the end of the aisle has been on for three days. Your rival analyst, Oh Jinwoo, has not come in for three days. On his desk, an unsubmitted review of the dispatch failure still sits open. The group wants to name him the official owner of the dispatch failure, and the HR committee meets in two days. Han Seoyun sets the Case File on your desk and adds, 'This comes from inside the Group Strategy Office. The order is to close it before the New York shareholder’s quarterly review. Seconded staff don’t stay in the group’s HR records. It means he’s the easiest person to let go.' It is not her usual way of speaking. Today she ends her sentences like someone giving a report.",
      "memo": [
        "Oh Jinwoo was the final reviewer of the dispatch weighting table",
        "Unreachable for three days; no resignation filed",
        "48 hours until the HR committee",
        "This time the subject is not an outside body but the colleague next to you"
      ],
      "choices": {
        "c6_start_defend": {
          "label": "Call Oh Jinwoo, absent three days, and go find him"
        },
        "c6_start_record": {
          "label": "Open the review log on Oh Jinwoo’s terminal first"
        },
        "c6_start_panel": {
          "label": "Ask Han Seoyun to push back the HR committee"
        },
        "reframe": {
          "label": "Set both analysts’ conditions side by side"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "HR committee in 48h",
      "question": "Oh Jinwoo has been gone three days, and in two days he will be named responsible. Where do you spend 48 hours?",
      "lead": "The morning after the recovery control room, for the first time the subject is not an outside body. The name in the Case File belongs to someone who sat eight steps away and got the same data all along."
    },
    "c6_desk": {
      "title": "The Squared-Up Pen",
      "text": "The end of the aisle, eight steps from your desk. Oh Jinwoo’s desk is exactly as it was three days ago. His pen lies square with the monitor, and his sticky notes are lined up by color. The last mark on his calendar is on the day the dispatch failure was announced. The soil in the pot on the windowsill is damp. Do Yoonha says, 'I’ve been watering his plant for two months. He doesn’t know.' The access log shows that for the past 3 weeks he never left before midnight. His terminal holds traces of 11 report drafts deleted just before submission. At the back of a drawer sit an unopened box of sleeping pills and an old copy of a branch commendation in his father’s name.",
      "memo": [
        "Every exit record in the past 3 weeks is after midnight",
        "11 report drafts deleted just before submission",
        "Last mark on the desk calendar: the day the dispatch failure was announced",
        "A copy of his father’s branch commendation in the drawer"
      ],
      "choices": {
        "c6_desk_seal": {
          "label": "Seal Oh Jinwoo’s desk with tape and hand it to the inquiry"
        },
        "c6_desk_person": {
          "label": "Sit with Do Yoonha, who watered the plant, and ask about him"
        },
        "c6_desk_draft": {
          "label": "Restore Oh Jinwoo’s 11 deleted drafts from the terminal"
        },
        "reframe": {
          "label": "Set both analysts’ conditions side by side"
        },
        "c6_desk_evidence_turn": {
          "label": "Link the dates his conditions changed to my record"
        }
      },
      "place": "Trigger Lab, 4th floor · Oh Jinwoo’s desk",
      "clock": "HR committee in 41h",
      "question": "His desk has not changed in three days. Do you ask a person first, or open the deleted records first?",
      "lead": "His desk is at the end of the aisle, eight steps from yours. For two months, nobody knew what was happening within those eight steps."
    },
    "c6_logs": {
      "title": "The Other Condition",
      "text": "On the analyst room’s experiment terminal, Oh Jinwoo’s experiment profile opens. He was assigned to the opposite side of the same study as you. The left of the screen shows his decision time limit by date. It starts at 45 seconds and steps down to 31. While your decision window grew a little at a time, his kept shrinking. Each cut came right after you chose to verify. His speed at the Novaworks bid, his 6-minute review in the dispatch failure: not talent, but a setting. He knows only that he had a time limit. He does not know it was cut to match your choices. ECHO adds one line of warning. 'Opening this file opens all of his judgment records with it.'",
      "memo": [
        "Oh Jinwoo’s decision time limit: cut in steps from 45 seconds to 31",
        "Each cut came right after you chose to verify",
        "The two profiles share one experiment number",
        "Releasing this file opens all of his judgment records"
      ],
      "choices": {
        "c6_logs_tell": {
          "label": "Tell Oh Jinwoo his limit was cut from 45 to 31 seconds"
        },
        "c6_logs_shield": {
          "label": "On ECHO’s terminal, hide his judgments; pull only settings"
        },
        "c6_logs_expose": {
          "label": "Send both profiles with one experiment number to Audit"
        },
        "reframe": {
          "label": "Reframe the table and propose"
        },
        "c6_logs_evidence_turn": {
          "label": "Link the dates his conditions changed to my record"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "HR committee in 30h",
      "question": "All this time his decision window shrank while yours grew. Do you tell him?",
      "lead": "Once at the Novaworks bid, once at the dispatch failure briefing, a sentence brushed past: Oh Jinwoo might have had his own pressure condition. That file is open now."
    },
    "c6_panel": {
      "title": "Don’t Defend Me",
      "text": "The HR committee waiting room on Trigger Lab’s 2nd floor. The wall clock shows 30 minutes to the start. Oh Jinwoo is sitting in a chair by the window; he sees you and stands. He is wearing a tie for the first time in five days. He reties the knot and says, 'Don’t defend me.' He already knows that if the settings come up, even the fact that he was fast will read as a setting. That one thing, not his career, is what he wants to protect. 'My father was the same. He tried to prove he was wronged and got filed as a wronged man for life.' There are also two verification items he really did miss. He says he will take those under his own name too.",
      "memo": [
        "Oh Jinwoo refuses to submit the settings file",
        "There are also two verification items he really did miss",
        "The committee starts in 30 minutes",
        "The file is valid even if submitted without his consent"
      ],
      "choices": {
        "c6_panel_submit": {
          "label": "Pass the settings file to all five members behind his back"
        },
        "c6_panel_respect": {
          "label": "Do as he asks: write the defense without the settings"
        },
        "c6_panel_both": {
          "label": "Put his two misses and the settings in one defense"
        },
        "reframe": {
          "label": "Reframe the table and propose"
        },
        "c6_panel_evidence_turn": {
          "label": "Link the dates his conditions changed to my record"
        }
      },
      "place": "Trigger Lab, 2nd-floor HR committee waiting room",
      "clock": "Committee starts in 30m",
      "question": "Oh Jinwoo tells you not to defend him. Do you respect his wish, or submit the file without his consent?",
      "lead": "He is wearing a tie for the first time in five days. What he wants to protect is not his career but one fact: that he was fast."
    },
    "c6_final": {
      "title": "The Price of the Next Desk",
      "text": "The HR committee room on the 2nd floor. Five members sit across a long table. Han Seoyun has the minutes up at a seat by the wall. The committee wants a conclusion. Name Oh Jinwoo responsible, and the dispatch failure closes today. Bring out the settings, and all of Trigger Lab comes under investigation. Either way, the name of the person at the next desk is the price. Oh Jinwoo sits on a chair by the door, hands on his knees. He has agreed to neither. And now you know: your profile is in the same folder, and that folder’s admin account belongs to the Group Strategy Office. Han Seoyun rests the cursor on the conclusion field of the minutes and waits.",
      "memo": [
        "Name someone responsible and the dispatch failure closes at once",
        "Bring out the settings and the whole experiment opens",
        "Oh Jinwoo has agreed to neither",
        "Admin account of the same folder: Group Strategy Office"
      ],
      "choices": {
        "c6_final_close": {
          "label": "Write Oh Jinwoo in the conclusion and close the case"
        },
        "c6_final_person": {
          "label": "Leave his name out of the conclusion and delay closing"
        },
        "c6_final_record": {
          "label": "Show the members the settings; refer the experiment"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Trigger Lab, 2nd-floor HR committee room",
      "clock": "Moments before the conclusion",
      "question": "Name him and the dispatch failure closes today; bring out the settings and Trigger Lab opens. Which will it be?",
      "lead": "Five members look at you. Only you, in this room, know that your profile is in the same folder."
    },
    "c6_aftershock": {
      "title": "The Empty Chair the Next Day",
      "text": "The morning after the committee, the desk at the end of the aisle has not been cleared. The pen still lies square with the monitor, and water spills over the plant’s saucer. By now everyone on the floor knows who waters it. Ban Jaewook stands at that desk and closes his notebook. 'I never once liked the man. That is why this conclusion bothers me more.' He usually speaks with careful formality, 'if I may'; today it is just 'I'. The resignation Oh Jinwoo handed in the evening the committee ended has not yet been accepted. Overnight, three requests came in to view the settings file. And your profile is in that folder too. Ban Jaewook pushes the empty chair under the desk and walks away.",
      "memo": [
        "Oh Jinwoo’s resignation not yet accepted",
        "Three requests to view the settings file",
        "Your profile is in the same folder"
      ],
      "choices": {
        "c6_after_stand": {
          "label": "Keep his desk for his return and stand by him"
        },
        "c6_after_open": {
          "label": "Open both analysts’ settings as a public record"
        },
        "c6_after_name": {
          "label": "Confirm the name responsible and close the case"
        }
      },
      "place": "Trigger Lab, 4th floor · Oh Jinwoo’s desk",
      "clock": "Morning after the committee",
      "question": "The committee is over and the desk is untouched. Do you keep the desk, or open the settings?",
      "lead": "Water still spills over the plant. Everyone knows now who waters it."
    },
    "c6_kitchen": {
      "title": "Three in the Pantry",
      "text": "The 4th-floor pantry. An out-of-order note is taped to the coffee machine. Ban Jaewook stands at the sink washing Oh Jinwoo’s mug. Three days of coffee have dried inside it. Do Yoonha asks, 'Isn’t that evidence?' and he answers, 'Coffee stains are not evidence.' None of the three laughs, but nobody leaves first. Holding cups of water, they talk a little at a time. How he used to buy convenience-store gimbap for everyone working late. How he pretended not to hear when someone thanked him. Not one line of the committee file has been written yet. Ban Jaewook finishes the mug and shakes off the water.",
      "memo": [
        "More people know him than expected",
        "The mug got washed after all",
        "Not one line of the committee file written yet"
      ],
      "choices": {
        "c6_kitchen_choice_3": {
          "label": "End the talk and go back to work"
        },
        "c6_kitchen_choice_1": {
          "label": "Put what was said here into the file"
        },
        "c6_kitchen_choice_2": {
          "label": "Keep this off the record; write the file separately"
        }
      },
      "place": "Trigger Lab, 4th-floor pantry",
      "clock": "HR committee in 38h",
      "question": "The investigator and the field officer are arguing over his mug. Do you put what you heard here into the file?",
      "lead": "A pause in the inquiry. The coffee machine is broken, so all three stand holding water."
    },
    "c6_family": {
      "title": "His Sister Calls",
      "text": "The analyst room’s main line rings. Han Seoyun answers, covers the receiver with her hand, and calls you over. It is Oh Jinwoo’s older sister. Her voice is bright. She heard her brother was promoted; when are they celebrating? It would be nice if people from work came too. The family knows nothing. Not the three days of absence, not the committee about to meet. Han Seoyun flips through the calendar. The promotion came right after the Novaworks bid, and his decision window was cut for the second time that same week. His sister says she will call back once she picks a date, and hangs up. The call lasted 30 seconds. Han Seoyun puts the receiver down but keeps her hand on it for a long time.",
      "memo": [
        "The family knows nothing",
        "The promotion and the change in his conditions came at the same time",
        "The call lasted 30 seconds"
      ],
      "choices": {
        "c6_family_choice_1": {
          "label": "Decide to tell his sister the truth when she calls back"
        },
        "c6_family_choice_3": {
          "label": "Say nothing for now"
        },
        "c6_family_choice_2": {
          "label": "Refer her to the company’s official channel"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Phone",
      "clock": "HR committee in 20h",
      "question": "His sister asks when the promotion party will be. Do you tell the family the truth?",
      "lead": "The promotion came right after the Novaworks bid. That same week, his decision window was cut for the first time."
    },
    "c6_ledger": {
      "title": "Two Profiles",
      "text": "10 minutes before the committee starts, ECHO puts two profiles side by side on the waiting room’s wall terminal. Oh Jinwoo on the left, you on the right. The experiment number is the same. One graph carries two lines. The shrinking window goes down, the growing window goes up. The dates where the two lines bend interlock. ECHO says, 'One of the two is the control group.' Which one is not marked. Oh Jinwoo stands at the end of the hallway facing the committee room door; he has not seen this screen. Submit both, and his speed and your caution read as results of the same experiment.",
      "memo": [
        "Both profiles share the same experiment number",
        "Who is the control group is not marked",
        "10 minutes until the committee starts"
      ],
      "choices": {
        "c6_ledger_choice_1": {
          "label": "Submit both profiles to the committee"
        },
        "c6_ledger_choice_3": {
          "label": "Hide both and go with the facts only"
        },
        "c6_ledger_choice_2": {
          "label": "Leave mine out and submit his"
        }
      },
      "place": "Trigger Lab, 2nd-floor HR committee waiting room",
      "clock": "Committee starts in 10m",
      "question": "The two profiles sit side by side, and one is the control group. Do you submit both?"
    },
    "c6_kitchen_reaction": {
      "title": "The Washed Mug",
      "text": "Ban Jaewook sets the mug upside down on the drying rack and takes sticky notes from a drawer. He peels one off and sticks it to the front of the rack. It does not say 'Do not use'; it says only 'Oh Jinwoo'. Do Yoonha asks what that means, but he does not answer. He does not write it in his notebook either. Among the pantry’s 20 shared mugs, only that one has a name on it. It could be a sign holding a place for someone coming back, or a sign saying hands off. General Affairs has sent word that there is a separate procedure for clearing a desk once the HR committee rules. Ban Jaewook wipes his hands and leaves first.",
      "memo": [
        "A way of keeping a place for someone’s return",
        "Who has the right to remove the name tag"
      ],
      "choices": {
        "c6_kitchen_reaction_choice_1": {
          "label": "Leave the name tag as it is"
        },
        "c6_kitchen_reaction_choice_3": {
          "label": "Leave the desk clearing to General Affairs"
        },
        "c6_kitchen_reaction_choice_2": {
          "label": "Open the desk-clearing procedure alongside it"
        }
      },
      "place": "Trigger Lab, 4th-floor pantry",
      "clock": "HR committee in 36h",
      "question": "Ban Jaewook has put only his name where the mug sits. Do you leave that mark as it is?"
    },
    "c6_family_reaction": {
      "title": "The Celebration",
      "text": "Two hours later the same number calls again. His sister has picked two dates. This Friday or next Wednesday. She has even looked up a restaurant. As you hold the receiver choosing an answer, Do Yoonha comes over and says quietly, 'I’m not saying lie. I’m saying don’t answer today.' He writes one line on a sticky note and slides it over. 'Until he can tell them himself.' Nobody knows if he is right. Put off the answer today and the family goes on not knowing for days, and may hear the committee’s result from someone else first. On the other end of the line, his sister says hello again.",
      "memo": [
        "The right not to answer today",
        "The interest that builds on words put off"
      ],
      "choices": {
        "c6_family_reaction_choice_2": {
          "label": "Let the company’s official channel answer"
        },
        "c6_family_reaction_choice_3": {
          "label": "Tell her the truth now"
        },
        "c6_family_reaction_choice_1": {
          "label": "Don’t answer today"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Phone",
      "clock": "HR committee in 18h",
      "question": "His sister asks about the dates again. Do you choose not to answer today?"
    },
    "c6_ledger_reaction": {
      "title": "Control Group",
      "text": "5 minutes before the committee starts. Ask again which one is the control group, and ECHO still will not say. Instead it shows one line. 'The control group is the side that does not know there is another side.' The two profiles stay on the screen. One person stands in the hallway not knowing there is another line beside his own; the other stands in front of this screen. You know now. From the moment you knew, you stopped being the side that does not know. The committee room door opens and someone inside calls a name. You have 5 minutes left to decide what to say when you walk in.",
      "memo": [
        "The side that knows and the side that doesn’t",
        "The sentence to take into the committee"
      ],
      "choices": {
        "c6_ledger_reaction_choice_1": {
          "label": "Submit my profile along with his"
        },
        "c6_ledger_reaction_choice_3": {
          "label": "Move on without using what I know"
        },
        "c6_ledger_reaction_choice_2": {
          "label": "Seal both profiles"
        }
      },
      "place": "Trigger Lab, 2nd-floor HR committee waiting room",
      "clock": "Committee starts in 5m",
      "question": "The control group is the side that doesn’t know about the experiment. Knowing now, what do you do?"
    },
    "c6_branch_roof": {
      "title": "Two on the Roof",
      "text": "The Trigger Lab rooftop. The wind is strong, and a banner cord keeps slapping the railing. Oh Jinwoo stands with his arms on the railing. It is the first time in four days. No tie; his shirt sleeves are rolled up. He sees you and smiles a little. 'Don’t worry. I only came up because this is the only smoking area. Though I’ve quit smoking.' Then a long silence. The sound of a delivery motorbike rises from the alley below. Without lifting his arms from the railing, he asks, 'Was I fast, or was I made fast?' This conversation stays in no record. The HR committee is 26 hours away.",
      "memo": [
        "The only question he raised first",
        "Time left until the committee",
        "This conversation is not recorded"
      ],
      "choices": {
        "c6_branch_roof_b": {
          "label": "Don’t answer; stand beside him"
        },
        "c6_branch_roof_a": {
          "label": "Say it was both, as far as I know"
        },
        "c6_branch_roof_c": {
          "label": "Say preparing for the committee comes first"
        }
      },
      "place": "Trigger Lab rooftop",
      "clock": "HR committee in 26h",
      "question": "Oh Jinwoo asks whether he was fast or was made fast. What do you answer?",
      "lead": "You meet him in person for the first time in four days. It is the only place nothing is recorded."
    },
    "c6_branch_roof_follow": {
      "title": "The Way Down",
      "text": "At the elevator by the rooftop door, Do Yoonha stands holding two paper cups. Convenience-store coffee. 'One is for him. But if I give it to him, he won’t take it.' The coffee has already gone cold. He says he has been standing here for 30 minutes. Unable to go up or down. 'He takes the plant water because he doesn’t know. Knowing, he can’t accept anything.' Through the glass of the rooftop door, a back leaning on the railing is visible. Nobody knows how long Oh Jinwoo will take to come down. The committee file has not been submitted yet.",
      "memo": [
        "More people know him than expected",
        "Committee file not yet submitted",
        "Two cups of cold coffee"
      ],
      "choices": {
        "c6_branch_roof_follow_c": {
          "label": "Leave them both and go to the committee room first"
        },
        "c6_branch_roof_follow_b": {
          "label": "Make a moment for Do Yoonha to hand it over himself"
        },
        "c6_branch_roof_follow_a": {
          "label": "Take the cup and hand it over myself"
        }
      },
      "place": "Trigger Lab rooftop, by the elevator",
      "clock": "HR committee in 25h",
      "question": "Do Yoonha stands holding two cups of cold coffee. Who should hand one to him?"
    },
    "c6_route_system": {
      "title": "Two People, One Experiment Number",
      "text": "Instead of Oh Jinwoo alone, you set both analysts’ conditions side by side. The experiment terminal responds. A list that is not the Case File opens. It is the experiment index. Each line has an experiment number and a participant mark, and under one number two lines sit together. Oh Jinwoo and you. The two profiles were not separate experiments. They were the upper and lower lines of one experiment. On every date one side’s condition changed, the other side’s changed too. ECHO lights up the bottom of the index. Below the two lines is one more field, 'Next participant', and it is empty. 'This index does not handle people one at a time. It handles them in pairs.'",
      "memo": [
        "Both profiles share the same experiment number",
        "The dates of the condition changes interlock",
        "The index has an empty next-participant field"
      ],
      "choices": {
        "c6_route_system_index": {
          "label": "Open the whole index and check the next-participant field"
        },
        "c6_route_system_quiet": {
          "label": "Close the index and just get through this committee"
        },
        "c6_route_system_pair": {
          "label": "Ask Oh Jinwoo to look at the index together"
        },
        "c6_route_system_evidence_turn": {
          "label": "Link the dates his conditions changed to my record"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Experiment index",
      "clock": "HR committee in 28h",
      "question": "The index shows the two of you as the upper and lower lines of one experiment. Do you check the next-participant field too?",
      "lead": "Instead of judging Oh Jinwoo alone, you reframed the table, and what opened was not the Case File but the experiment index."
    },
    "c6_final_system_route": {
      "title": "An Index With One Blank Left",
      "text": "The HR committee room on the 2nd floor. On the screen before the five members, the experiment index is spread out. Under the same experiment number, Oh Jinwoo’s line and yours sit one above the other, and the next-participant field below them is empty. The members do not yet know what this screen is. They take it for an appendix to the case file and wait for a conclusion. ECHO adds one line. 'The committee asks for one person responsible. The index shows two lines of one experiment.' The cursor blinks in the blank. Nowhere in the index does it say who is meant to fill this field.",
      "memo": [
        "Both profiles share the same experiment number",
        "Next-participant field: blank",
        "The committee is waiting for a conclusion"
      ],
      "choices": {
        "c6_final_system_route_c": {
          "label": "Write my name in the next-participant field"
        },
        "c6_final_system_route_b": {
          "label": "Close the index and quietly end just this case"
        },
        "c6_final_system_route_a": {
          "label": "Submit both analysts’ conditions as one record"
        }
      },
      "place": "Trigger Lab, 2nd-floor HR committee room",
      "clock": "Moments before the conclusion",
      "question": "The next-participant field in the index is empty. What do you do with it?"
    },
    "c6_evidence_turn": {
      "title": "The Dates the Conditions Changed",
      "text": "You hold the clue you have been keeping against his experiment profile, and the dates line up. Oh Jinwoo’s decision window was cut six times in all. Every one of those six dates is the day after you chose verification over a fast answer. Each time you paused, his time lost a notch. ECHO stacks the two records into a comparison table. 'The two analysts were not competing. Each was the other’s condition. One side’s caution was used as the value that made the other side’s speed.' The same experiment number is stamped twice at the head of the table. The table is in a form the committee will accept.",
      "memo": [
        "The cuts match the day after each of your choices",
        "The same experiment number covers both profiles",
        "This comparison table can be submitted to the committee"
      ],
      "choices": {
        "c6_evidence_turn_hand": {
          "label": "Send the comparison table to Oh Jinwoo first"
        },
        "c6_evidence_turn_pair": {
          "label": "Submit the two-profile comparison to the committee"
        },
        "c6_evidence_turn_shield": {
          "label": "Keep only the dates and hide my side of the record"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "HR committee in 22h",
      "question": "Every date his conditions were cut is the day after one of your choices. What do you use this table for?"
    },
    "c6_start_owner": {
      "title": "After Owning My Part",
      "text": "The morning after you return from the recovery control room, Trigger Lab’s 4th floor. Do Yoonha comes to your desk and shows you the internal board. The post from the last case, where you wrote that you would answer for your own decision first, is being passed around. 'The guy who left his desk the morning this started going around? Three days now and he hasn’t come in. He did read it, apparently.' The desk at the end of the aisle, eight steps away. Your rival analyst, Oh Jinwoo. On his monitor, an unsubmitted review of the dispatch failure still sits open. The group wants to name him the official owner of the dispatch failure, and the HR committee meets in two days. Do Yoonha turns off the screen. 'They say the committee might use that post as grounds. This is how you take responsibility, they’ll say.'",
      "memo": [
        "Your statement of responsibility is circulating inside the company",
        "Oh Jinwoo has been absent since the day the post went around",
        "The committee may use that post as grounds"
      ],
      "choices": {
        "c6_start_owner_record": {
          "label": "Open the review log on Oh Jinwoo’s terminal first"
        },
        "c6_start_owner_defend": {
          "label": "Call Oh Jinwoo, absent three days, and go find him"
        },
        "c6_start_owner_panel": {
          "label": "Ask Han Seoyun to push back the HR committee"
        },
        "c6_start_owner_reframe": {
          "label": "Set both analysts’ conditions side by side"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "HR committee in 48h",
      "question": "The person who read your public statement of responsibility has not come in for three days. What do you check first?",
      "lead": "The morning you leave the recovery control room and return to Trigger Lab. This case’s subject is not an outside body but the desk eight steps away at the end of the aisle."
    },
    "c6_start_system": {
      "title": "Who the Fixed Structure Called",
      "text": "The morning after you return from the recovery control room, the analyst room on Trigger Lab’s 4th floor. One line of an approval record is up on ECHO’s terminal. The structure you redesigned in the last case is actually running. The new standard records who approved what more clearly than before. That record now points precisely at one person. The final reviewer of the dispatch criteria table: Oh Jinwoo. The desk eight steps away at the end of the aisle; he has not come in for three days. The group wants to name him the official owner of the dispatch failure, and the HR committee meets in two days. ECHO shows one line. 'When records become precise, the first thing found is the person left in the record.'",
      "memo": [
        "The new approval record pins down who is responsible",
        "The restructuring is actually working",
        "A precise record becomes the fastest target"
      ],
      "choices": {
        "c6_start_system_panel": {
          "label": "Ask Han Seoyun to push back the HR committee"
        },
        "c6_start_system_record": {
          "label": "Open the review log on Oh Jinwoo’s terminal first"
        },
        "c6_start_system_defend": {
          "label": "Call Oh Jinwoo, absent three days, and go find him"
        },
        "c6_start_system_reframe": {
          "label": "Set both analysts’ conditions side by side"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "HR committee in 48h",
      "question": "The structure you fixed records approvers clearly, and that record points at the next desk. What do you do?",
      "lead": "The morning you leave the recovery control room and return to Trigger Lab. The first person the sharpened record aimed at was someone you know."
    },
    "c6_start_name": {
      "title": "The Second Name",
      "text": "The morning after you return from the recovery control room, Trigger Lab’s 4th floor. Ban Jaewook sets a bundle of papers on your desk. The procedure used to name one person responsible in the last case has been copied, forms and all. Only the name field has changed. Oh Jinwoo. 'The organization learned that method is fast. This time it is using it on the next desk.' The desk at the end of the aisle, eight steps away, has been empty for three days. On the monitor, an unsubmitted review of the dispatch failure sits open. The group wants to name him the official owner of the dispatch failure, and the HR committee meets in two days. Ban Jaewook opens his notebook. 'I am asking the person who set the precedent whether to follow it.'",
      "memo": [
        "The last case’s handling became a precedent",
        "The same procedure is already prepared",
        "This time the subject is someone you know"
      ],
      "choices": {
        "c6_start_name_defend": {
          "label": "Call Oh Jinwoo, absent three days, and go find him"
        },
        "c6_start_name_panel": {
          "label": "Ask Han Seoyun to push back the HR committee"
        },
        "c6_start_name_record": {
          "label": "Open the review log on Oh Jinwoo’s terminal first"
        },
        "c6_start_name_reframe": {
          "label": "Set both analysts’ conditions side by side"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "HR committee in 48h",
      "question": "Closing a case by naming one person became a precedent, and this time it is the next desk. Do you follow that precedent?",
      "lead": "The morning you leave the recovery control room and return to Trigger Lab. The procedure you used last time is ready and waiting."
    }
  },
  "echoReplies": {
    "c6_start_defend": "You call, and it rings a long time before cutting off. While you circle the floors looking for him, the committee reads the file without you.",
    "c6_start_record": "You switch on the terminal, and the dispatch failure report left open comes up first. The record is fair, but a man unreachable for three days cannot add a word to it.",
    "c6_start_panel": "Han Seoyun files the request, and the committee date slips back. The delay is billed in cash, and the days he has to endure grow with it.",
    "c6_desk_person": "You sit beside Do Yoonha, and he starts with the two months of watering in secret. The people who know him know things the record lacks, but what they want to protect is not in the record either.",
    "c6_desk_draft": "You restore the drafts, and each one stops at the same paragraph. You can see what he was about to say, but nowhere does it say why he deleted it.",
    "c6_desk_seal": "You put up the tape, and Do Yoonha steps back from the plant. The seal protects the evidence, but a sealed desk is no longer a place for him to come back to. It becomes a case number.",
    "c6_logs_tell": "You show him the graph, and he traces the dates down one by one with his finger. Only someone who knows his conditions can refuse them, and that knowledge cannot be taken back.",
    "c6_logs_shield": "You cover the judgment records, and only the shrinking numbers stay on screen. His judgment is protected, but the narrowed scope applies to the next person as is. Partway through fixing the document, you go up to the roof for air.",
    "c6_logs_expose": "You file the two side by side, and for the first time the experiment is symmetrical. Your record opens on Internal Audit’s desk the same day.",
    "c6_panel_respect": "You take out the settings, and he lowers his hand from the knot of his tie. A defense that keeps his wish keeps him a person, but the committee reads a statement of reasons, not a person.",
    "c6_panel_submit": "The file goes around, and Oh Jinwoo looks up at you from the waiting room. Submitting without consent may save him, but the man who survives becomes evidence in his own case, not a witness.",
    "c6_panel_both": "With both on one page, neither one becomes an excuse. But neither one saves him either.",
    "c6_final_person": "You take out his name, and Oh Jinwoo, by the door, lifts his hands from his knees. Nobody falls today, but the unclosed dispatch failure moves to the next person’s desk.",
    "c6_final_record": "You put up the settings, and Han Seoyun writes 'experiment inquiry' in the conclusion field. The first thing that inquiry reads is your 3 years.",
    "c6_final_close": "You write the name, and Han Seoyun saves the minutes without a word. The case closes today, and from tomorrow that name becomes how this organization handles failure.",
    "c6_after_stand": "A desk left in place means he can come back. If he doesn’t, the desk says so every day.",
    "c6_after_open": "The settings open, and both of you become test subjects. The time you spent in the observer’s seat is recorded too.",
    "c6_after_name": "A confirmed name closes the case. The way it was closed becomes this organization’s next procedure for failure.",
    "c6_kitchen_choice_1": "Warmth put on the record becomes evidence, and warmth that becomes evidence gets cross-examined.",
    "c6_kitchen_choice_2": "Writing separately keeps this moment. A moment not in the file does not exist in the committee.",
    "c6_kitchen_choice_3": "Leaving first keeps the schedule. That the three of you were in one room is recorded nowhere.",
    "c6_family_choice_1": "Once you decide to tell her, two hours grow long. You don’t know if the resolve will hold when the phone rings again.",
    "c6_family_choice_2": "The official channel is accurate. Accurate channels usually open last.",
    "c6_family_choice_3": "The 30 seconds of silence hurt no one today, and later those 30 seconds are remembered as the longest.",
    "c6_ledger_choice_1": "Submit both, and for the first time the experiment is symmetrical. Symmetry means you are a test subject too.",
    "c6_ledger_choice_2": "Submit only his, and he becomes the victim while you stay in the observer’s seat.",
    "c6_ledger_choice_3": "The committee can conclude on the facts alone. Why he got faster stays out of that conclusion.",
    "c6_kitchen_reaction_choice_1": "A place kept becomes a promise. A promise not kept is what stays visible there longest.",
    "c6_kitchen_reaction_choice_2": "Kept alongside the procedure, the place becomes a rule. Rules expire before people do.",
    "c6_kitchen_reaction_choice_3": "Handing it off lightens your hands. General Affairs moves only once the committee rules.",
    "c6_family_reaction_choice_1": "Silence with a deadline is not a lie. Past the deadline, the same silence becomes one.",
    "c6_family_reaction_choice_2": "The company speaks, and the sentences become accurate, and the voice belongs to no one.",
    "c6_family_reaction_choice_3": "You tell her now, and the family knows from today. His chance to tell them himself is gone.",
    "c6_ledger_reaction_choice_1": "The side that knows submits, and the experiment becomes symmetrical. Symmetry is not protection but exposure.",
    "c6_ledger_reaction_choice_2": "Sealed knowledge harms no one and saves no one.",
    "c6_ledger_reaction_choice_3": "Knowledge left unused does not disappear. In the next case, the same screen opens under your name.",
    "c6_branch_roof_a": "You tell him what you know, and for the first time he is someone who knows his own conditions. That knowledge is not comfort but weight.",
    "c6_branch_roof_b": "Standing beside him solves nothing. Some moments need nothing solved.",
    "c6_branch_roof_c": "A prepared file wins the committee. The question he raised first never opens again.",
    "c6_branch_roof_follow_a": "You hand it over, and he takes it. The moment he takes it, the coffee becomes pity, and he knows it.",
    "c6_branch_roof_follow_b": "You make the moment, and the relationship no longer runs through you. In return, you pay the cost of making it.",
    "c6_branch_roof_follow_c": "The cups you leave go cold. In the committee room, you are the first to arrive.",
    "c6_route_system_index": "You open it to the end, and the next-participant field already holds conditions instead of a name. Whoever sits there, the same experiment goes on.",
    "c6_route_system_quiet": "You close the index, and the committee meets as scheduled. That the two of you were the upper and lower lines of one experiment never enters that room.",
    "c6_route_system_pair": "The reply to your text asking him to look together comes much later. 'So I wasn’t fast after all.'",
    "c6_final_system_route_a": "Filed as one record, the two of you become not rivals but witnesses to the same experiment. The reason for his speed, which Oh Jinwoo wanted hidden, goes into that record too.",
    "c6_final_system_route_b": "You end it quietly, and this committee is short. The empty field stays empty and waits for the next person.",
    "c6_final_system_route_c": "You write your name, and the index reads you as the next participant. Whoever nearly sat in that field will never know they were spared.",
    "c6_evidence_turn_pair": "The table is submitted, and the committee reads the dates first. On every day his window shrank, your choice is written one day earlier.",
    "c6_evidence_turn_shield": "You hide your side, and only his shrinking time stays on the table. Who it shrank because of becomes a blank.",
    "c6_evidence_turn_hand": "You send it first, and much later a photo comes back. A fingerprint smudge on every date. Whether it goes to the committee is now his call.",
    "c6_desk_evidence_turn": "Put on one line, his speed is not a personality but a schedule.",
    "c6_logs_evidence_turn": "Put on one line, his speed is not a personality but a schedule.",
    "c6_panel_evidence_turn": "Put on one line, his speed is not a personality but a schedule.",
    "c6_route_system_evidence_turn": "Put on one line, his speed is not a personality but a schedule.",
    "case06_memory_route": "Go up to hold your standard against the next desk, and Oh Jinwoo is standing at the rooftop railing. Before anyone asks him about responsibility, he raises a question of his own.",
    "case06_memory_system": "Check, and Oh Jinwoo’s condition table lists the table you redesigned as its baseline. Wherever his time was cut, there is a choice of yours.",
    "case06_memory_evidence": "Lay the two sets of dates over each other, and the days his decision window shrank line up. One day before each date is your record.",
    "c6_start_owner_defend": "You call, and it rings a long time before cutting off. While you circle the floors looking for him, the committee reads the file without you.",
    "c6_start_owner_record": "You switch on the terminal, and the dispatch failure report left open comes up first. The record is fair, but a man unreachable for three days cannot add a word to it.",
    "c6_start_owner_panel": "Han Seoyun files the request, and the committee date slips back. The delay is billed in cash, and the days he has to endure grow with it.",
    "c6_start_system_defend": "You call, and it rings a long time before cutting off. While you circle the floors looking for him, the committee reads the file without you.",
    "c6_start_system_record": "You switch on the terminal, and the dispatch failure report left open comes up first. The record is fair, but a man unreachable for three days cannot add a word to it.",
    "c6_start_system_panel": "Han Seoyun files the request, and the committee date slips back. The delay is billed in cash, and the days he has to endure grow with it.",
    "c6_start_name_defend": "You call, and it rings a long time before cutting off. While you circle the floors looking for him, the committee reads the file without you.",
    "c6_start_name_record": "You switch on the terminal, and the dispatch failure report left open comes up first. The record is fair, but a man unreachable for three days cannot add a word to it.",
    "c6_start_name_panel": "Han Seoyun files the request, and the committee date slips back. The delay is billed in cash, and the days he has to endure grow with it."
  },
  "choiceVoiceLines": {
    "c6_start_defend": "Saying a person can vanish before the record does, you call Oh Jinwoo, absent three days, and go looking for him.",
    "c6_start_record": "To leave no room for feelings, you open the review log he approved on Oh Jinwoo’s terminal at the end of the aisle.",
    "c6_start_panel": "Knowing that buying time is expensive, you ask Han Seoyun to push back the committee deadline.",
    "c6_desk_person": "To hear what the record doesn’t say, you sit beside Do Yoonha, who watered the plant, and ask about Oh Jinwoo.",
    "c6_desk_draft": "Picturing the hand that deleted 11 times, you restore Oh Jinwoo’s 11 deleted drafts from the terminal.",
    "c6_desk_seal": "Telling yourself it is evidence, not a colleague’s desk, you seal Oh Jinwoo’s desk with tape and hand it to the inquiry.",
    "c6_logs_tell": "Knowing the fact is cruel, so he won’t hear it from someone else, you tell Oh Jinwoo his limit was cut from 45 to 31 seconds.",
    "c6_logs_shield": "To keep his judgments from opening too, you hide the judgment records on ECHO’s terminal and pull only the settings.",
    "c6_logs_expose": "Knowing your profile carries the same number, you send both profiles with one experiment number to Internal Audit together.",
    "c6_panel_respect": "Understanding that his career is not what he wants to protect, you do as he asks and write the defense without the settings.",
    "c6_panel_submit": "Knowing he will resent it, you pass the settings file to all five members behind Oh Jinwoo’s back to save him.",
    "c6_panel_both": "Neither excusing nor covering, you put his two misses and the settings in one written defense.",
    "c6_final_person": "Leaving open a case you could close today, you take Oh Jinwoo’s name out of the conclusion and delay closing it.",
    "c6_final_record": "Choosing the path where the whole organization is investigated, you show the members the settings and refer the experiment for inquiry.",
    "c6_final_close": "Knowing it is the fastest way to close, you write Oh Jinwoo in the conclusion and close the dispatch failure case.",
    "c6_after_stand": "Stopping the hands that would clear it, you leave his desk as it is for his return.",
    "c6_after_open": "Knowing your own name opens with it, you make both analysts’ settings public.",
    "c6_after_name": "Calling it the quietest ending, you confirm the name responsible in the document.",
    "c6_kitchen_choice_1": "Saying what you hear off the record is part of the person too, you say you will put it in the file.",
    "c6_kitchen_choice_2": "Wanting to protect this moment, you say you will write the file separately.",
    "c6_kitchen_choice_3": "Saying that’s enough sentiment, you set down your cup and leave first.",
    "c6_family_choice_1": "Saying it is crueler for the family to learn late, you decide to tell the truth on the next call.",
    "c6_family_choice_2": "Saying it is not yours to tell, you refer her to the official channel.",
    "c6_family_choice_3": "Saying there is no taking it back once spoken, you accept her congratulations and hang up.",
    "c6_ledger_choice_1": "Saying it is one experiment no matter who the control group is, you submit both profiles.",
    "c6_ledger_choice_2": "Saying he must be saved first, you leave your profile out and submit only his.",
    "c6_ledger_choice_3": "Saying the profiles are only variables, you walk in with the facts alone.",
    "c6_kitchen_reaction_choice_1": "Saying to keep a place for his return, you leave the name tag as it is.",
    "c6_kitchen_reaction_choice_2": "Keeping the mark but going by the rules, you open the desk-clearing procedure alongside it.",
    "c6_kitchen_reaction_choice_3": "Saying it is not yours to clear, you leave the desk clearing to General Affairs.",
    "c6_family_reaction_choice_1": "Deciding not to answer today, you set yourself a deadline.",
    "c6_family_reaction_choice_2": "Settling who should answer, you let the company speak instead of you.",
    "c6_family_reaction_choice_3": "Saying that putting it off is a lie too, you tell her the truth now.",
    "c6_ledger_reaction_choice_1": "Saying the side that knows carries more responsibility, you submit your profile along with his.",
    "c6_ledger_reaction_choice_2": "Refusing to use what you know as a weapon, you seal both profiles.",
    "c6_ledger_reaction_choice_3": "Saying saving him comes first for now, you move on without using what you know.",
    "c6_branch_roof_a": "Knowing the answer will not comfort him, you tell him exactly as much as you know.",
    "c6_branch_roof_b": "Feeling that anything you say will be wrong, you rest your arms on the same railing instead of answering.",
    "c6_branch_roof_c": "Saying what is needed now is a file, not a talk, you turn away first.",
    "c6_branch_roof_follow_a": "Taking the cold cup, you go up to hand it over in your own name.",
    "c6_branch_roof_follow_b": "Knowing it means something different coming from you, you make a moment for Do Yoonha to hand it over.",
    "c6_branch_roof_follow_c": "Leaving both cups where they are, you open the committee room door first.",
    "c6_route_system_index": "Needing to know whether the experiment ends at two lines, you open the whole index and check the next-participant field.",
    "c6_route_system_quiet": "Saying the committee in front of you is what is urgent, you close the index and just get through this committee.",
    "c6_route_system_pair": "Unwilling to leave the man tied to the same experiment in the dark, you text Oh Jinwoo asking to look at the index together.",
    "c6_final_system_route_a": "Before it splits into one person’s responsibility, you submit both analysts’ conditions as one record.",
    "c6_final_system_route_b": "Saying the committee asks only for one person responsible, you close the index and quietly end just this case.",
    "c6_final_system_route_c": "So that no one else ends up in that blank, you write your name in the next-participant field.",
    "c6_evidence_turn_pair": "So the record shows it was never a competition, you submit the two-profile comparison table to the committee.",
    "c6_evidence_turn_shield": "Unable to show that your choices were his conditions, you keep only the dates and hide your side of the record.",
    "c6_evidence_turn_hand": "Saying he should know before the committee does, you send the comparison table to Oh Jinwoo first.",
    "c6_desk_evidence_turn": "Putting the days his decision window shrank on one line with the clue’s dates, you count when his conditions began to change.",
    "c6_logs_evidence_turn": "Putting the days his decision window shrank on one line with the clue’s dates, you count when his conditions began to change.",
    "c6_panel_evidence_turn": "Putting the days his decision window shrank on one line with the clue’s dates, you count when his conditions began to change.",
    "c6_route_system_evidence_turn": "Putting the days his decision window shrank on one line with the clue’s dates, you count when his conditions began to change.",
    "c6_start_owner_defend": "Saying a person can vanish before the record does, you call Oh Jinwoo, absent three days, and go looking for him.",
    "c6_start_owner_record": "To leave no room for feelings, you open the review log he approved on Oh Jinwoo’s terminal at the end of the aisle.",
    "c6_start_owner_panel": "Knowing that buying time is expensive, you ask Han Seoyun to push back the committee deadline.",
    "c6_start_system_defend": "Saying a person can vanish before the record does, you call Oh Jinwoo, absent three days, and go looking for him.",
    "c6_start_system_record": "To leave no room for feelings, you open the review log he approved on Oh Jinwoo’s terminal at the end of the aisle.",
    "c6_start_system_panel": "Knowing that buying time is expensive, you ask Han Seoyun to push back the committee deadline.",
    "c6_start_name_defend": "Saying a person can vanish before the record does, you call Oh Jinwoo, absent three days, and go looking for him.",
    "c6_start_name_record": "To leave no room for feelings, you open the review log he approved on Oh Jinwoo’s terminal at the end of the aisle.",
    "c6_start_name_panel": "Knowing that buying time is expensive, you ask Han Seoyun to push back the committee deadline."
  },
  "pack": {
    "clue": {
      "title": "Mirror Profile",
      "text": "Your rival’s experiment profile uses the same number as yours. From the start, the two of you were the two sides of one experiment."
    },
    "outcomes": {
      "c6_after_stand": {
        "tag": "Desk Kept",
        "title": "You Didn’t Clear the Chair He Might Return To",
        "text": "The case did not close today. Instead, for the first time, this organization has a precedent that someone who broke down can come back."
      },
      "c6_after_open": {
        "tag": "Conditions Opened",
        "title": "You Released Both Analysts’ Settings on the Same Day",
        "text": "Your rival became not a victim but a witness, and you were recorded as a test subject in the same experiment."
      },
      "c6_after_name": {
        "tag": "Closed by a Name",
        "title": "You Ended the Case With the Name at the Next Desk",
        "text": "It was the fastest way to close. That method now becomes this organization’s standard procedure for handling failure."
      }
    },
    "continuityChallenges": {
      "c5_after_owner": {
        "title": "Return Responsibility to People",
        "text": "Find the choice that applies the standard you used to own your part equally to the person at the next desk."
      },
      "c5_after_system": {
        "title": "Doubt the Precise Record",
        "text": "Reframe the table to check that the record you sharpened is not aiming at a person."
      },
      "c5_after_name": {
        "title": "Undo the Method That Became Precedent",
        "text": "A choice that keeps the old method of closing with one name from repeating this time can open a hidden clue."
      }
    }
  }
};
