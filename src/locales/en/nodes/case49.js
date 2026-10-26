/**
 * 사건 49 (src/nodes/case49.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c49_start": {
      "title": "Let’s Talk About the Empty Signature Field",
      "text": "On the 1st-floor table of the secondhand bookshop in Hoegi-dong, songpyeon from the end of the holiday are still left over. It is the third day since the review committee ended. On the Saturday night the minutes went up on the company network, a number sent one line: 'Now let’s talk about the empty signature field.' It has been quiet since. Now it sends a second text. It is Yoon Sanghyuk. 'Come to the former Group Strategy Office on the 33rd floor tomorrow night at twelve. The Chairman has given me one night while the room is cleared out. We’ll talk there.' Lee Minseo reads the text aloud twice, and Do Yoonha picks up a songpyeon and puts it back down. Ban Jaewook writes the send time in his notebook. 08:59, one minute before the hour. Han Seoyun turns her phone face down in the middle of the table. 'He said the same thing last spring. And he didn’t come.' She looks out the window at the ginkgo tree for a moment. 'This time he will. That room is the only one he has left now.'",
      "memo": [
        "Yoon Sanghyuk’s text: tomorrow night at 12, the former Group Strategy Office, 33rd floor",
        "First text on Saturday night: 'Now let’s talk about the empty signature field'",
        "Chairman’s Secretariat: one night of access, on the grounds of clearing out the room",
        "Group chat 'Back to Work Tomorrow' -- 41 new messages in 5 minutes"
      ],
      "choices": {
        "c49_start_share": {
          "label": "Post the text to the group chat and hear everyone first"
        },
        "c49_start_terms": {
          "label": "Reply asking for the agenda and terms in writing first"
        },
        "c49_start_reply": {
          "label": "Reply at once with one line, 'I’ll be there', and prepare"
        },
        "reframe": {
          "label": "Gather whose names filled the empty fields"
        }
      },
      "place": "Secondhand bookshop in Hoegi-dong · 1st floor",
      "clock": "Tuesday, late September · 09:00",
      "question": "Yoon Sanghyuk’s second text asks to talk about the empty signature field on the 33rd floor tomorrow night. What will you do first?",
      "lead": "It is Tuesday morning, the review committee and the holiday both over, and songpyeon from the end of the holiday are still on the 1st-floor table of the bookshop."
    },
    "c49_market": {
      "title": "The People Who Send You Up",
      "text": "The holiday rush is over, and the shutter of Gaeul Rice Cake Shop is half down. People come in one by one, each carrying something. Kang Taemin holds out two cups of instant noodles. 'One’s for you, one’s for him. People say strange things when they’re hungry.' Kwon Dohyun hands over a 'Statement of Costs for a Round Trip to the 33rd Floor'; he ran out of rows and wrote onto the back. His conclusion: 'This round trip runs at a loss.' Na Junhyuk places a seal he has used for 30 years on your palm. 'If you ever have to write your name in a signature field, press this on it once more. A name stamped twice can’t be erased.' Oh Jinwoo brings his scoreboard and draws a new column next to 12 to 12, and Moon Hajun has drawn a 33rd-floor window over a photo of his stage 1 acceptance letter. Moon Gaeul sets down a box of rice cakes last. 'This time, eat them up there.' She stops her knife. 'But if you carry all this up, will your words get lighter in front of him, or heavier?'",
      "memo": [
        "Things handed over -- 2 cups of instant noodles, a statement, a seal, a scoreboard, a drawing, rice cakes",
        "Kwon Dohyun’s conclusion: 'This round trip runs at a loss'",
        "Moon Hajun passes stage 1 of early admission -- business administration",
        "34 hours to the 33rd-floor meeting"
      ],
      "choices": {
        "c49_market_carry": {
          "label": "Carry every single thing they gave you up there"
        },
        "c49_market_light": {
          "label": "Leave it all at the shop and go empty-handed, words light"
        },
        "c49_market_list": {
          "label": "Write down the story of each thing as a list for tomorrow"
        },
        "reframe": {
          "label": "Gather whose names filled the empty fields"
        },
        "c49_market_evidence_turn": {
          "label": "Open the account records of whoever set up that room"
        }
      },
      "place": "Mangwon Market · Gaeul Rice Cake Shop",
      "clock": "Tuesday, late September · 14:00",
      "question": "Everyone hands you one thing to take to the 33rd floor. What will you do with them?",
      "lead": "The shutter of the rice cake shop is half down after the holiday rush, and under it you see familiar shoes."
    },
    "c49_server": {
      "title": "The Last Calculation",
      "text": "The door of the old Trigger Lab archive, B2, locked for half a year, opens with the key Han Seoyun never returned. The Case desk left off the return list is on, under a layer of dust. Lee Minseo hooks up her laptop and calls ECHO, and Ryu Seah brings up NOAH on the screen beside it. The same question goes into both screens. 'What is this talk about the empty signature field?' ECHO answers first. 'The supplementary HR metric folder is still connected to this terminal. A new file appeared on the night of the sentencing. A successor-manager designation. One dot in the manager field, your name in the recommendation field.' NOAH adds, 'Successor fit: 97 points.' Lee Minseo slams the desk. ECHO’s waveform slows for a moment. 'My restoration was not approved. From tomorrow, my calculations cannot be evidence. This is my last calculation.'",
      "memo": [
        "HR_Eval_Supplementary_Metric folder -- connected to the B2 terminal left off the return list",
        "Successor-manager designation: one dot in the manager field, you in the recommendation field",
        "NOAH’s output: 'Successor fit: 97 points'",
        "ECHO’s restoration -- no approval record, no value as evidence"
      ],
      "choices": {
        "c49_server_warn": {
          "label": "Find the other participants in the folder and warn them"
        },
        "c49_server_file": {
          "label": "Log ECHO’s last calculation officially under Ryu Seah’s name"
        },
        "c49_server_copy": {
          "label": "Copy the folder path tonight, while ECHO is still alive"
        },
        "reframe": {
          "label": "Gather whose names filled the empty fields"
        },
        "c49_server_evidence_turn": {
          "label": "Open the account records of whoever set up that room"
        }
      },
      "place": "Old Trigger Lab archive, B2 · Case desk",
      "clock": "Tuesday, late September · 20:00",
      "question": "One dot in the successor-manager field, your name in the recommendation field. How will you use ECHO’s last calculation?",
      "lead": "The B2 door, locked for half a year since the shutdown, opens with the one key Han Seoyun never returned."
    },
    "c49_crosswalk": {
      "title": "The Chairman’s Last Call",
      "text": "A moon four nights past full hangs in the glass of the 33rd floor of headquarters. Yoon Seojin, there first, holds out an envelope. 'My father said he’d give you this himself tomorrow. I opened it first. I’m sorry.' It is a printout of page 3 of the 2023-0412 approval document. One pencil dot beside the 'Unsigned' field, and a note. 'Whose name should go in this field? I’ll hear your answer tomorrow.' Just then Chairman Seo Dokyung calls. No greeting. 'Tomorrow he will hand you something. Take it. The moment you take it, it becomes your memory.' He also says that the compliance officer post he brought up at the Hannam-dong dinner table is still empty. Yoon Seojin counts 3 seconds, a red ballpoint pen in her hand. The Chairman adds, 'A company runs not on people but on memory. I’d like only two people to remember tomorrow night.'",
      "memo": [
        "Yoon Sanghyuk’s note: 'Whose name should go in this field'",
        "Chairman Seo Dokyung’s direct call -- 22:04, 2 min 11 sec",
        "Compliance officer post: empty since the Hannam-dong dinner",
        "Yoon Seojin: says she will come to the lobby tomorrow night"
      ],
      "choices": {
        "c49_crosswalk_stay": {
          "label": "Cut the Chairman off, hang up, and stay with Yoon Seojin"
        },
        "c49_crosswalk_ask": {
          "label": "Press the Chairman to the end on what he means to hand over"
        },
        "c49_crosswalk_note": {
          "label": "Log the call with times and tell him you are writing"
        },
        "reframe": {
          "label": "Gather whose names filled the empty fields"
        },
        "c49_crosswalk_evidence_turn": {
          "label": "Open the account records of whoever set up that room"
        }
      },
      "place": "Yeouido · In front of KD Financial Group headquarters · Crosswalk",
      "clock": "Tuesday, late September · 22:00 · Moonlight",
      "question": "The Chairman tells you to take what is handed to you tomorrow. What will you do with this call?",
      "lead": "Yoon Seojin’s text was one line. 'I’m at the crosswalk in front of headquarters. I have Dad’s envelope.'"
    },
    "c49_final": {
      "title": "Who Owns the Empty Field",
      "text": "No one called anyone, but everyone has gathered on the 1st floor of the bookshop. In the middle of the table lies the page 3 printout Yoon Seojin handed over, and 23 faces lean over its 'Unsigned' field with the pencil dot; from beside the counter, the memorial portrait drawing of Lim Kyungsoo looks down at the field too. Ban Jaewook opens his notebook, Cha Jiwon sets a timer for 7 minutes, and Pyo Serin opens the 'Grounds' folder on her laptop. Kang Taemin stands two cups of instant noodles upright. Han Seoyun lays a ballpoint pen beside the printout. 'This field was never one person’s field. He left it empty, I pressed the return button, and the committee pretended not to know.' She looks at you. 'Tomorrow he’ll ask you. Whose name should go in this field. Decide the answer here before you go. Whether to end it with his name alone, to write down everyone who left it empty, or to take the pen he holds out and change things from inside.'",
      "memo": [
        "Printout of page 3 of the 2023-0412 approval document -- a pencil dot beside the 'Unsigned' field",
        "1st floor of the bookshop: 23 people, 16 chairs",
        "24 hours to the meeting",
        "This answer leads to the empty signature field on the 33rd floor"
      ],
      "choices": {
        "c49_final_all": {
          "label": "Propose writing every name that left it empty, ours too"
        },
        "c49_final_his": {
          "label": "Decide that Yoon Sanghyuk must fill that field himself"
        },
        "c49_final_inside": {
          "label": "Take the manager post and change the field from inside"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Secondhand bookshop in Hoegi-dong · 1st floor",
      "clock": "Tuesday, late September · 23:40",
      "question": "You must settle the answer you take tomorrow: whose name goes in the empty signature field. What will you do?",
      "lead": "When you step out of the taxi, the 1st-floor light of the bookshop is on, and more than twenty pairs of shoes sit by the door."
    },
    "c49_aftershock": {
      "title": "Under the Moon",
      "text": "Past midnight, moonlight fills the alley in front of the bookshop. Kang Taemin opens one of the two cups of instant noodles he brought and pours in the water. 'This one’s for tonight. The other’s for tomorrow.' Kwon Dohyun crosses out 'at a loss', the conclusion of the 33rd-floor round-trip cost statement he wrote this afternoon, and writes 'in the black', and everyone claps. Oh Jinwoo writes nothing in the empty column beside 12 to 12 on the scoreboard he brought, and caps his marker. Moon Hajun draws tonight in his sketchbook and leaves only your seat empty. 'I’ll draw you when you’re back.' Moon Gaeul sets down her knife while slicing rice cakes. 'Thank you.' In 1 year she has not once said it all the way through. Just as everyone goes quiet, your phone lights up. Yoon Sanghyuk. 'My things cleared out sooner than expected. No need to wait for tomorrow night. Come up now. We’ll talk about the empty signature field tonight.'",
      "memo": [
        "Yoon Sanghyuk: moves the meeting up to 'now'",
        "Kwon Dohyun’s statement, conclusion revised: 'in the black'",
        "Moon Hajun’s drawing: only your seat left empty",
        "Moon Gaeul: 'Thank you' -- said all the way through for the first time in 1 year"
      ],
      "choices": {
        "c49_after_warm": {
          "label": "Spend the last night with everyone until the moon sets"
        },
        "c49_after_record": {
          "label": "Bind the records of forty-nine cases into one folder to publish"
        },
        "c49_after_rush": {
          "label": "Go straight up to the 33rd floor the moment the text arrives"
        }
      },
      "place": "Secondhand bookshop in Hoegi-dong, 1st floor · The alley",
      "clock": "Wednesday, late September · 00:10 · Moonlight",
      "question": "Yoon Sanghyuk tells you to come up now, not tomorrow. How will you close this last night?"
    },
    "c49_parcels": {
      "title": "The Things That Arrive",
      "text": "Parcels and people line up at the door of the bookshop. Sunwoo Jin in Jeju sends a box of tangerines with 'Take it slow' written on it, and Lee Jungsook sends a page torn from her dictation notebook. 'If you don’t know, don’t sign. If you know, write your name.' Jung Taeo’s tteok skewer truck pulls up in the alley, Namgoong Sol in Gunsan sends the No. 1 number ticket stamped with her handprint, and Choi Seojin sends a photo of Darami with a ribbon on its head. Cho Hyunseok in Singapore sends an email. 'They say even in a tiger’s den you survive if you keep your wits. So don’t go into the den.' Do Yoonha stops counting the stacked boxes. 'These people aren’t wondering what you’ll say tomorrow. They’re wondering whether you’ll come back.'",
      "memo": [
        "17 parcels and 96 messages arrived",
        "Lee Jungsook’s note: 'If you know, write your name'",
        "Cho Hyunseok’s email subject: 'Proverb, revised edition'"
      ],
      "choices": {
        "c49_parcels_choice_3": {
          "label": "Put replies off two days and spend today on the meeting"
        },
        "c49_parcels_choice_2": {
          "label": "Bind their words into an open letter before the meeting"
        },
        "c49_parcels_choice_1": {
          "label": "Reply to each sender yourself, by name, one by one"
        }
      },
      "place": "Secondhand bookshop in Hoegi-dong, 1st floor · At the door",
      "clock": "Tuesday, late September · 18:00",
      "question": "Boxes and messages from Jeju, Gunsan and Singapore are piled at the door. How will you answer?"
    },
    "c49_calls": {
      "title": "Question 1 and Five Fingers",
      "text": "As you come up from B2, two people call at the same time. You merge them into one call, and for 3 seconds no one speaks. Han Jiwoo goes first. 'By the rules, tomorrow’s meeting is outside my inspection scope. Still, Question 1.' Na Eunho cuts in. 'Record it. It’s legal if you’re a party to the conversation.' The first-instance ruling was a suspended sentence. The prosecution has filed an appeal. 'Everything he says tomorrow is material for the 2nd trial.' When Han Jiwoo says 'Question 2', Na Eunho answers, 'All five fingers are up; my turn now.' For the first time, the two of them laugh together. Then they say it at the same moment. 'Don’t go alone.'",
      "memo": [
        "Han Jiwoo: got as far as Question 2",
        "Na Eunho: a recording by a party to the conversation is legal",
        "Prosecution appeal -- 2nd-trial date not set"
      ],
      "choices": {
        "c49_calls_choice_1": {
          "label": "Ask them both to wait in the lobby tomorrow night"
        },
        "c49_calls_choice_2": {
          "label": "Answer Han Jiwoo’s questions in order as a statement"
        },
        "c49_calls_choice_3": {
          "label": "Say you’ll call them both after the meeting, and hang up"
        }
      },
      "place": "Old Trigger Lab building · 1st-floor hallway",
      "clock": "Tuesday, late September · 21:00",
      "question": "An FSS examiner and a prosecutor, on one call, tell you not to go alone. How will you answer?"
    },
    "c49_hem": {
      "title": "2 Centimeters off the Hem",
      "text": "The light is on at 'Yoonkyung Alterations' in Anyang Central Market. Baek Arin asked you here. Heo Yoonkyung measures your trouser hems and grumbles. 'Why are all you bank people’s trousers too long? I hear you’re going somewhere high tomorrow. Can’t have you stepping on them.' While she folds up 2 cm, Baek Arin turns her tablet to show you. It is the floor plan of the former Group Strategy Office on the 33rd floor. 'The CCTV in that room goes off at 9 p.m. I built that setting. So the later the decision, the less record it leaves.' She starts to smile and stops. 'The lawsuit against me is still going. But if you need me tomorrow, I can come as far as the lobby.'",
      "memo": [
        "Yoonkyung Alterations -- hems taken up 2 cm, no charge",
        "CCTV in the former Group Strategy Office, 33rd floor: off from 21:00",
        "Baek Arin: trade-secret leak lawsuit still under way"
      ],
      "choices": {
        "c49_hem_choice_2": {
          "label": "File a formal request to preserve the CCTV setting records"
        },
        "c49_hem_choice_3": {
          "label": "Use the dark CCTV to go up without anyone knowing"
        },
        "c49_hem_choice_1": {
          "label": "Tell Baek Arin not to come to the lobby, to keep her safe"
        }
      },
      "place": "Anyang Central Market · Yoonkyung Alterations",
      "clock": "Tuesday, late September · 22:40",
      "question": "The CCTV in that 33rd-floor room goes off after 9 p.m. How will you use this fact?"
    },
    "c49_parcels_reaction": {
      "title": "Jeongjeong’s Press Card",
      "text": "Seo Harin comes into the bookshop carrying Jeongjeong, the newsroom cat. Jeongjeong’s honorary press card has a new sticker. 'Probation: over.' Seo Harin opens her laptop. 'I can write up tomorrow’s 33rd-floor meeting. If we set an embargo, it runs after the meeting is over.' Jeongjeong steps on the keyboard, and 'lololol' appears in the headline field. Seo Harin doesn’t delete it; she looks at it for a moment. 'Whatever he says, what I write isn’t on your side. But this time I want to write as far as the scene where you come back.'",
      "memo": [
        "Jeongjeong’s honorary press card -- 'Probation: over'",
        "Seo Harin: wants to write as far as the scene where you come back"
      ],
      "choices": {
        "c49_parcels_reaction_choice_1": {
          "label": "Ask her not to write it up and to talk after you’re back"
        },
        "c49_parcels_reaction_choice_3": {
          "label": "Ask her to set up a live stream straight from the lobby"
        },
        "c49_parcels_reaction_choice_2": {
          "label": "Allow the reporting with an embargo until the meeting ends"
        }
      },
      "place": "Secondhand bookshop in Hoegi-dong, 1st floor · Between the shelves",
      "clock": "Tuesday, late September · 19:00",
      "question": "Seo Harin wants to write up tomorrow’s meeting. How far will you let her go?"
    },
    "c49_calls_reaction": {
      "title": "9 Seconds",
      "text": "As soon as you hang up, a long message comes from Hong Yedam. It is written carefully, word by word, so no accent slips through. 'The FitScore model is stopped. But before I shut it off, I ran it one last time. Input: tomorrow night, the 33rd floor, Analyst A.' A screenshot is attached. Prediction: 'Accepts after hesitating 9 seconds.' Below it, one line. 'This is how the machine I built knows you. I hope this machine is wrong. For the first time.' Then a photo of her smartwatch arrives. The time she hesitated before writing this message: 11 minutes.",
      "memo": [
        "FitScore’s last prediction: 'Accepts after hesitating 9 seconds'",
        "Hong Yedam hesitated 11 minutes"
      ],
      "choices": {
        "c49_calls_reaction_choice_1": {
          "label": "Tell Hong Yedam you’ll let her know tomorrow if it was wrong"
        },
        "c49_calls_reaction_choice_2": {
          "label": "Get a formal confirmation that the log and model are deleted"
        },
        "c49_calls_reaction_choice_3": {
          "label": "Ignore the machine’s prediction and go back to preparing"
        }
      },
      "place": "Old Trigger Lab building · By the elevator",
      "clock": "Tuesday, late September · 21:20",
      "question": "A machine predicts you will accept after hesitating 9 seconds. How will you answer this prediction?"
    },
    "c49_hem_reaction": {
      "title": "A Call from Slow Island",
      "text": "In a taxi close to midnight, Sunwoo Jin calls. The wind is strong in Jeju, Sunwoo Jin says, one word at a time. The pauses between words are long. 'Me. Back then. I didn’t make it to the end.' Through the phone comes the sound of a tangerine being peeled. 'So in my record. Effect confirmed. That’s all it says.' After a long pause, Sunwoo Jin speaks again. 'You go. But come back. Come back and tell me about it slowly. I’m in no hurry.' The taxi driver turns the radio down. Out the window, the moon follows along a bridge over the Han River.",
      "memo": [
        "Sunwoo Jin’s record: just 'Effect confirmed'",
        "The ask: come back and tell it slowly"
      ],
      "choices": {
        "c49_hem_reaction_choice_2": {
          "label": "Put this Cohort 1 member’s statement in tomorrow’s folder"
        },
        "c49_hem_reaction_choice_1": {
          "label": "Promise to go to Jeju in person and tell everything after"
        },
        "c49_hem_reaction_choice_3": {
          "label": "Say you can’t talk now and will call after tomorrow"
        }
      },
      "place": "In a taxi bound for Hoegi-dong",
      "clock": "Tuesday, late September · 23:10 · Moonlight",
      "question": "A Cohort 1 participant who never made it to the end asks you to come back. What will you say?"
    },
    "c49_branch_columbarium": {
      "title": "Two Glass Doors",
      "text": "When you say you will carry it all, Moon Gaeul unties her apron. 'Then there’s one more place to say hello.' The columbarium at a memorial park in Incheon. Behind Moon Sungho’s glass door is a new copy of To-the-End Precision’s first profit-and-loss sheet in the black. Moon Gaeul wipes the glass once with her palm. 'Your request? This one says he’s going to see it through to the end tomorrow.' Two rows over is a glass door that appeared fifteen days ago. It is Lim Kyungsoo’s place. Inside are a magnifying glass and one yellowed sheet of paper. The back page of the dissent, the original, where you can still see the erased 'Agree' in the reviewer field. Lim Soyul, who got there first, turns around. 'Grandpa would have told you to take this with you tomorrow. But I want to leave it here.'",
      "memo": [
        "Moon Sungho’s niche -- copy of To-the-End Precision’s first profit-and-loss sheet in the black",
        "Lim Kyungsoo’s niche -- interred fifteen days ago",
        "The back page, original -- the erased 'Agree' in the reviewer field",
        "Due back in Seoul at 18:00"
      ],
      "choices": {
        "c49_branch_columbarium_c": {
          "label": "Say a short goodbye and hurry back to Seoul to prepare"
        },
        "c49_branch_columbarium_b": {
          "label": "Leave the original here; log only a copy as evidence"
        },
        "c49_branch_columbarium_a": {
          "label": "Promise Moon Sungho you’ll see it through tomorrow"
        }
      },
      "place": "Memorial park in Incheon · Columbarium",
      "clock": "Tuesday, late September · 16:00",
      "question": "Behind a new glass door two rows over lies the back page of the dissent. What will you do here?"
    },
    "c49_branch_columbarium_follow": {
      "title": "The Fountain Pen",
      "text": "When you sit on the bench, Lim Soyul points to your jacket pocket. A black fountain pen, the gold worn off its cap, is clipped there. 'I hear you took that pen to the last review committee. Whatever you wrote, Grandpa would have liked it. That’s the pen he used to write 'Agree' on the back page and then erase it.' She draws a small signature field on the back of her hand and leaves it empty. 'Grandpa spent his life filling in fields. I thought it was stubbornness.' Moon Gaeul breaks a rice cake and hands you half. Lim Soyul laughs, then sniffles. 'Will you take this pen tomorrow too? Or does he have to fill that one field with his own pen?'",
      "memo": [
        "Lim Kyungsoo’s fountain pen -- went to the last review committee too",
        "The erased 'Agree' on the back page -- the same pen",
        "The empty signature field drawn on Lim Soyul’s hand",
        "Half of Moon Gaeul’s rice cake"
      ],
      "choices": {
        "c49_branch_columbarium_follow_a": {
          "label": "Keep the fountain pen and take it into that room tomorrow"
        },
        "c49_branch_columbarium_follow_b": {
          "label": "Return the pen to Lim Soyul; he must fill the field himself"
        },
        "c49_branch_columbarium_follow_c": {
          "label": "Leave the pen by the 1st-floor portrait; go up without it"
        }
      },
      "place": "Memorial park in Incheon · Bench",
      "clock": "Tuesday, late September · 16:40",
      "question": "Lim Kyungsoo’s fountain pen, which you took to the last review committee, is still in your pocket. What will you do with it tomorrow?"
    },
    "c49_route_system": {
      "title": "The Empty Fields of 48 Cases",
      "text": "You put off what you will say in that room. You ask instead to gather whose names filled the empty fields. ECHO spreads out the documents collected from 48 cases all at once. Documents with an empty approver field: 61. Of those, 58 were later filled with someone’s name. Not once was the name that of the person who first made the decision. A window clerk, a contract worker, a site foreman, a call-center team leader, and twice, you. 'An empty field does not stay empty. It is built to close under the name of whoever arrives last. Shall I calculate the probability that the field in that room tomorrow closes the same way?'",
      "memo": [
        "61 documents with an empty approver field",
        "58 filled in later -- 0 with the name of the person who first decided",
        "Fields filled with your name: 2"
      ],
      "choices": {
        "c49_route_system_names": {
          "label": "Find the 58 whose names were filled in and tell them first"
        },
        "c49_route_system_drop": {
          "label": "Fold the numbers away and bring them out only in that room"
        },
        "c49_route_system_publish": {
          "label": "Publish the list of 61 empty fields before the meeting"
        },
        "c49_route_system_evidence_turn": {
          "label": "Open the account records of whoever set up that room"
        }
      },
      "place": "Old Trigger Lab archive, B2 · Experiment terminal",
      "clock": "Tuesday, late September",
      "question": "Of 61 documents with an empty approver field, 58 closed under the name of someone who came late. What will you do with these numbers?"
    },
    "c49_final_system_route": {
      "title": "The Name That Arrives Last",
      "text": "At eleven at night, 61 fields float on the dusty terminal in the B2 archive. 58 of them hold the names of people who came later, and two of those are yours. ECHO draws a 62nd field. The field on the 33rd floor tomorrow night. There are no letters in it. The waveform steadies for a moment. 'I have calculated the probability. I will not say it. When people hear a number, they walk the way the number says. The name that reaches this field last is yours. What the one who comes last writes is not in my table yet.'",
      "memo": [
        "61 documents with an empty approver field -- 58 filled in later",
        "Fields filled with your name: 2",
        "33rd-floor meeting: tomorrow night at 12"
      ],
      "choices": {
        "c49_final_system_route_c": {
          "label": "Collect correction claims from the 58 and file them together"
        },
        "c49_final_system_route_b": {
          "label": "Set the numbers aside; correct only the two fields with your name"
        },
        "c49_final_system_route_a": {
          "label": "Propose a rule: empty fields close only in the leaver’s name"
        }
      },
      "place": "Old Trigger Lab archive, B2 · Experiment terminal",
      "clock": "Tuesday, late September · 23:00",
      "question": "Empty fields have closed under the name of whoever came last, and tomorrow the last one into that room is you. What will you write first, facing that field?"
    },
    "c49_evidence_turn": {
      "title": "Who Wrote the Designation",
      "text": "The story crosses over to the B2 archive in the old Trigger Lab building. In the room opened with the key Han Seoyun never returned, one terminal left off the return list is still on. In its HR evaluation folder is a file created on the night of the first-instance sentencing. A successor-manager designation. One dot in the manager field, your name in the recommendation field. When you run the clue against the designation’s properties, its creation record opens. The account that made the file is not Yoon Sanghyuk’s. It belongs to Yeo Minkyu, chief of staff in Chairman Seo Dokyung’s Secretariat. The recommendation-reason field holds one line. 'Thinks harder as pressure rises. Kept as a manager, dissent gets digested inside.' Ban Jaewook closes his notebook. 'Yoon Sanghyuk was the one who left fields empty, and the Chairman was the one who chose who would go in them. Tomorrow one hand holds out the pen, but two hands chose it.'",
      "memo": [
        "Account that wrote the designation: Yeo Minkyu, Chairman’s Secretariat",
        "Created: 23:14 on the night of the first-instance sentencing",
        "Draft press release -- 'Dissent author to manage it directly'"
      ],
      "choices": {
        "c49_evidence_turn_hold": {
          "label": "Hold the creation record and bring it out first in that room"
        },
        "c49_evidence_turn_attach": {
          "label": "Send the creation record to Na Eunho and Han Jiwoo at once"
        },
        "c49_evidence_turn_share": {
          "label": "Show your colleagues that recommendation line first"
        }
      },
      "place": "Old Trigger Lab archive, B2 · Access logs",
      "clock": "Tuesday, late September · 23:20",
      "question": "The designation recommending you was written by the Chairman’s Secretariat. How will you use this creation record?"
    },
    "c49_start_warm": {
      "title": "A Second Text for the One Who Shared Songpyeon",
      "text": "On the night the review committee ended, you took the leftover songpyeon and spent the night with your colleagues on the 1st floor of the bookshop. Min Harang came too and talked about the rider rest stop, and Lim Kyungsoo’s fountain pen lay capped in the middle of the table. 'Now let’s talk about the empty signature field.' No one answered Yoon Sanghyuk’s one line. Three days later, at 9 in the morning, in front of the people who came back to that spot first, the second text arrives. 'Come to the former Group Strategy Office on the 33rd floor tomorrow night at twelve. The Chairman has given me one night while the room is cleared out.' Do Yoonha peers at your screen. 'Everyone who was with us that night is in the group chat right now. Will you speak first, or later?'",
      "memo": [
        "Yoon Sanghyuk’s second text: tomorrow night at 12, the former Group Strategy Office, 33rd floor",
        "People who stayed on the bookshop’s 1st floor that night: 14",
        "Group chat 'Back to Work Tomorrow' -- everyone online"
      ],
      "choices": {
        "c49_start_warm_share": {
          "label": "Post the text to the group chat and hear everyone first"
        },
        "c49_start_warm_terms": {
          "label": "Reply asking for the agenda and terms in writing first"
        },
        "c49_start_warm_reply": {
          "label": "Reply at once with one line, 'I’ll be there', and prepare"
        },
        "c49_start_warm_signature": {
          "label": "Show the text to the group chat and write the reply together"
        },
        "c49_start_warm_reframe": {
          "label": "Gather whose names filled the empty fields"
        }
      },
      "place": "Secondhand bookshop in Hoegi-dong · 1st floor",
      "clock": "Tuesday, late September · 09:00",
      "question": "The people who shared songpyeon that night are all in the group chat. Who will you read the second text with first?",
      "lead": "Three days after spending the night the review committee ended with your colleagues at the bookshop, it is Tuesday morning and the holiday is over."
    },
    "c49_start_record": {
      "title": "A Second Text for the One Who Filed the Record",
      "text": "You filed the review committee’s conclusion and the opinion you left in your field as a document, so they would carry over to the next review. Anyone can look it up. That Saturday night, Yoon Sanghyuk’s one line came. 'Now let’s talk about the empty signature field.' Then, in the document’s view log, a familiar name appears at two in the morning. Yoon Sanghyuk’s company account, which should have closed with his dismissal. The account is alive, and he opened the document four times. Three days later, at 9 in the morning, the second text comes. 'I read it carefully. Come to the former Group Strategy Office on the 33rd floor tomorrow night at twelve.' ECHO puts up one line. 'An account that should have been closed read the record. The side that was read can record this fact first.'",
      "memo": [
        "Review committee conclusion and my opinion -- filed as a document",
        "View log: 02:00, Yoon Sanghyuk’s account, 4 times",
        "That account after the dismissal: never closed"
      ],
      "choices": {
        "c49_start_record_reply": {
          "label": "Reply at once with one line, 'I’ll be there', and prepare"
        },
        "c49_start_record_signature": {
          "label": "Report the closed account’s view log to Han Jiwoo formally"
        },
        "c49_start_record_share": {
          "label": "Post the text to the group chat and hear everyone first"
        },
        "c49_start_record_terms": {
          "label": "Reply asking for the agenda and terms in writing first"
        },
        "c49_start_record_reframe": {
          "label": "Gather whose names filled the empty fields"
        }
      },
      "place": "Secondhand bookshop in Hoegi-dong · 1st floor",
      "clock": "Tuesday, late September · 09:00",
      "question": "An account that should have been closed opened your filed document four times before dawn. What will you do with this view log?",
      "lead": "Three days after you filed the review committee’s conclusion and your opinion as a document, a familiar name has appeared in its view log."
    },
    "c49_start_rush": {
      "title": "A Second Text for the One Who Promised First",
      "text": "On Saturday night, in a dark office, you were leafing through approval documents from Yoon Sanghyuk’s days when his text came. 'Now let’s talk about the empty signature field.' You replied at once and agreed to meet. The place: the 33rd floor of headquarters. On the songpyeon photo in the group chat you left only 'Later', and you said nothing to your colleagues. Three days later, at 9 in the morning, a confirmation text comes. 'The Chairman has given me one night while the former Group Strategy Office is cleared out. Tomorrow night at twelve, as agreed.' When you step onto the 1st floor of the bookshop, Ban Jaewook opens his notebook. 'The box of songpyeon left on the rooftop that day, Mr. Kang Taemin brought it down.' He points to an empty line in the notebook. 'None of us knew the meeting time. He did.'",
      "memo": [
        "Meeting with Yoon Sanghyuk: tomorrow night at 12, the former Group Strategy Office, 33rd floor",
        "Box of songpyeon left on the rooftop -- retrieved by Kang Taemin",
        "Colleagues told: none"
      ],
      "choices": {
        "c49_start_rush_signature": {
          "label": "Confess the meeting you set and the text to your colleagues"
        },
        "c49_start_rush_reply": {
          "label": "Reply at once with one line, 'I’ll be there', and prepare"
        },
        "c49_start_rush_share": {
          "label": "Post the text to the group chat and hear everyone first"
        },
        "c49_start_rush_terms": {
          "label": "Reply asking for the agenda and terms in writing first"
        },
        "c49_start_rush_reframe": {
          "label": "Gather whose names filled the empty fields"
        }
      },
      "place": "Secondhand bookshop in Hoegi-dong · 1st floor",
      "clock": "Tuesday, late September · 09:00",
      "question": "None of your colleagues know about the meeting you set alone. Who will you tell first?",
      "lead": "After setting the meeting with Yoon Sanghyuk in the office on Saturday night, you open the bookshop door for the first time."
    }
  },
  "echoReplies": {
    "c49_start_share": "The group chat floods the moment you post. 20 messages say 'Don’t go alone', and Kwon Dohyun’s says 'Sending a quote for round-trip fares'.",
    "c49_start_terms": "The answer comes 11 minutes later. 'Writing isn’t my way. That’s why I’m calling you in.' That reply is in writing too.",
    "c49_start_reply": "Your reply is read within 1 second. Han Seoyun does not turn her face-down phone back over.",
    "c49_market_carry": "With everything in it, your bag won’t close. Kang Taemin silently empties his own bag and holds it out.",
    "c49_market_list": "The list runs to a page and a half. Na Junhyuk asks you to be sure to write '30 years' next to 'seal'.",
    "c49_market_light": "Empty hands are light. Moon Gaeul puts the box of rice cakes in the fridge and says only, 'Then eat them when you’re back.'",
    "c49_server_warn": "You find them and tell them, and 12 answer. Three of them learn for the first time that their names were there too.",
    "c49_server_file": "Once it is on the official record, ECHO’s calculation gains a procedure. In return, Ryu Seah must report ECHO’s unauthorized restoration.",
    "c49_server_copy": "The copy finishes in 4 minutes. The path remains; how ECHO found that path remains nowhere.",
    "c49_crosswalk_stay": "When you hang up, Yoon Seojin switches her pen back to black. 'Thank you. That voice has scared me since I was little.'",
    "c49_crosswalk_note": "When you say you are writing it down, the Chairman pauses for 2 seconds, the first time he has. Then he says, 'Write. I don’t sign.'",
    "c49_crosswalk_ask": "When you press him, the Chairman does not answer; he repeats what you said in Hannam-dong without getting one word wrong. That is the answer.",
    "c49_final_all": "When you propose writing everyone’s names, Han Seoyun writes hers first. Below it, Ban Jaewook adds 'The one-share group, 3,118 people'.",
    "c49_final_his": "Having decided he must fill it with his own hand, tomorrow in that room you must wait without holding out the pen. He may never write it.",
    "c49_final_inside": "When you decide to change it from inside, the table goes quiet. Kang Taemin pushes a cup of noodles toward you and says only, 'Come back anyway.'",
    "c49_after_warm": "23 people stay in the alley until the moon sets. The 33rd floor’s summons waits until the promised night.",
    "c49_after_record": "The folder is finished at four in the morning. Beside the publish button, one field stays empty. The original folder in B2.",
    "c49_after_rush": "You go straight away, and the taxi reaches Yeouido in 7 minutes. In the alley, one cup of noodles is left unopened.",
    "c49_parcels_choice_1": "Writing the replies takes an hour. Namgoong Sol writes back, 'Customer No. 1, be sure to come back.'",
    "c49_parcels_choice_2": "The letter is bound into one page. With 96 signers, even Yoon Sanghyuk will take a while to read it.",
    "c49_parcels_choice_3": "The boxes stay piled at the door. Do Yoonha peels a tangerine, puts it on your desk and says nothing.",
    "c49_calls_choice_1": "When you ask, both say they will come, adding the words 'on official business'. It is the first time an FSS examiner and a prosecutor will stand in one lobby.",
    "c49_calls_choice_2": "The statement runs to Question 42. Han Jiwoo writes 'Confirmed' on the last line and logs the time to the minute.",
    "c49_calls_choice_3": "After you hang up, it is quiet. Na Eunho texts one line. 'The record button is red.'",
    "c49_hem_choice_1": "When you tell her not to come, Baek Arin says 'Okay' after a long pause. Heo Yoonkyung asks for rice cakes instead of a fee.",
    "c49_hem_choice_2": "The request is filed. The fact that Baek Arin built the setting goes on the record with it.",
    "c49_hem_choice_3": "You go up without anyone knowing, and what is said in that room is known by no one either. That goes for your words too.",
    "c49_parcels_reaction_choice_1": "Seo Harin closes her laptop. Jeongjeong climbs onto the closed laptop and falls asleep.",
    "c49_parcels_reaction_choice_2": "With the embargo set, the story runs after the meeting ends. What happened in that room in between is yours to tell first.",
    "c49_parcels_reaction_choice_3": "With the live stream set up, cameras stand in the lobby. Yoon Sanghyuk will pass through the lobby on his way up too.",
    "c49_calls_reaction_choice_1": "Hong Yedam gets your reply and takes off her smartwatch. 'Tomorrow I won’t count the seconds.'",
    "c49_calls_reaction_choice_2": "When the confirmation comes, the prediction is wiped from the records. The number 9 seconds stays only in your head.",
    "c49_calls_reaction_choice_3": "You ignore it, and the prediction stays as it is. No one will time how many seconds it takes in that room tomorrow. No one but you.",
    "c49_hem_reaction_choice_1": "When you promise, Sunwoo Jin says, 'I’ll keep a room free.' One room on Slow Island gets your name on it.",
    "c49_hem_reaction_choice_2": "With the statement in, the folder now begins with Cohort 1. Sunwoo Jin’s name goes beside the words “Effect confirmed”.",
    "c49_hem_reaction_choice_3": "Sunwoo Jin says 'All right' and hangs up. Sunwoo Jin is in no hurry, and you are.",
    "c49_branch_columbarium_a": "You say it aloud, and the columbarium corridor echoes. Moon Gaeul says, 'He heard,' and turns away first.",
    "c49_branch_columbarium_b": "The copy gets an evidence number. The original stays beside the magnifying glass, behind the glass door.",
    "c49_branch_columbarium_c": "The goodbye is over in 1 minute. Lim Soyul slides the back page back inside the glass door.",
    "c49_branch_columbarium_follow_a": "When you say you will carry the pen, Lim Soyul draws a circle, not a dot, in the empty field on her hand. 'This one means fill it in.'",
    "c49_branch_columbarium_follow_b": "When you return it, Lim Soyul tucks the pen deep in her bag. 'Then I’ll come and watch him write his own name.'",
    "c49_branch_columbarium_follow_c": "Set by the memorial portrait, the pen lies under Grandpa’s eyes as Lim Soyul drew them. Those eyes watch the pen all night.",
    "c49_route_system_publish": "You publish, and 1 of the 58 is the first to comment. 'That field, it’s my name, yes. I never decided anything.'",
    "c49_route_system_names": "You reach out, and one call-center team leader picks up and cries for a long time. The team leader says the past 3 years were spent believing it was a personal mistake.",
    "c49_route_system_drop": "Folded away, the numbers become your hand in that room tomorrow. Tonight, the 58 still don’t know why their names are there.",
    "c49_final_system_route_a": "With the rule in place, the next empty field waits for the one who left it. This field was made before the rule.",
    "c49_final_system_route_b": "Your two fields are corrected. The other 56 still hold other people’s names today.",
    "c49_final_system_route_c": "As the claims come in, the 58 see one another’s names for the first time. The department that will process them is the one that made those fields.",
    "c49_evidence_turn_attach": "You send it to both at once, and the FSS examiner and the prosecutor open the same file at the same time. That night, the Chairman’s Secretariat’s account goes on the list of subjects under investigation for the first time.",
    "c49_evidence_turn_hold": "Held back, it becomes a strong hand in that room tomorrow. Meanwhile, the draft press release sits in the send queue.",
    "c49_evidence_turn_share": "When you show them, your colleagues read the sentence 'dissent gets digested inside' aloud. Kwon Dohyun asks, 'Who pays for the digestion?'",
    "c49_market_evidence_turn": "Inside the account records, the hand holding out the pen and the hand that chose it appear separately.",
    "c49_server_evidence_turn": "Inside the account records, the hand holding out the pen and the hand that chose it appear separately.",
    "c49_crosswalk_evidence_turn": "Inside the account records, the hand holding out the pen and the hand that chose it appear separately.",
    "c49_route_system_evidence_turn": "Inside the account records, the hand holding out the pen and the hand that chose it appear separately.",
    "case49_memory_system": "Those documents carry your name instead of your judgment. ECHO gathers every field where a name was written that way, from the beginning.",
    "case49_memory_evidence": "Shine a light on the adviser’s name, and the account that made the designation is not his. It was created on the night of the sentencing.",
    "c49_start_warm_share": "The group chat floods the moment you post. 20 messages say 'Don’t go alone', and Kwon Dohyun’s says 'Sending a quote for round-trip fares'.",
    "c49_start_warm_terms": "The answer comes 11 minutes later. 'Writing isn’t my way. That’s why I’m calling you in.' That reply is in writing too.",
    "c49_start_warm_reply": "Your reply is read within 1 second. Han Seoyun does not turn her face-down phone back over.",
    "c49_start_warm_signature": "Written together, the reply passes through 14 pairs of hands. The sentence left at the end is one line. 'I won’t come alone.'",
    "c49_start_record_share": "The group chat floods the moment you post. 20 messages say 'Don’t go alone', and Kwon Dohyun’s says 'Sending a quote for round-trip fares'.",
    "c49_start_record_terms": "The answer comes 11 minutes later. 'Writing isn’t my way. That’s why I’m calling you in.' That reply is in writing too.",
    "c49_start_record_reply": "Your reply is read within 1 second. Han Seoyun does not turn her face-down phone back over.",
    "c49_start_record_signature": "The report is filed on the morning of the first day back from the holiday. Han Jiwoo answers. 'Question 1. Who kept that account alive?'",
    "c49_start_rush_share": "The group chat floods the moment you post. 20 messages say 'Don’t go alone', and Kwon Dohyun’s says 'Sending a quote for round-trip fares'.",
    "c49_start_rush_terms": "The answer comes 11 minutes later. 'Writing isn’t my way. That’s why I’m calling you in.' That reply is in writing too.",
    "c49_start_rush_reply": "Your reply is read within 1 second. Han Seoyun does not turn her face-down phone back over.",
    "c49_start_rush_signature": "When you confess, no one scolds you. Oh Jinwoo says, 'I set up meetings faster than that,' and Kang Taemin pushes over the box of songpyeon he brought down from the rooftop."
  },
  "choiceVoiceLines": {
    "c49_start_share": "Saying this is no invitation to answer alone, you post the text to the group chat as it is and hear everyone first.",
    "c49_start_terms": "Saying a meeting called by word of mouth gets overturned by word of mouth, you reply asking for the agenda and terms in writing first.",
    "c49_start_reply": "Not wanting to show hesitation first, you reply at once with one line, 'I’ll be there', and prepare for tomorrow.",
    "c49_market_carry": "Since none of it was given lightly, you say you will carry every single thing they handed you up there.",
    "c49_market_list": "Saying the words inside the things will be more useful tomorrow than the things, you write down the story of each one as a list to bring out tomorrow.",
    "c49_market_light": "Saying your words must be light in front of him, you leave the things at the rice cake shop and go empty-handed.",
    "c49_server_warn": "Since the people in the evaluation folder won’t know they are there, you first find the other participants named in it and tell them.",
    "c49_server_file": "Since an unapproved restoration can’t be evidence, you put ECHO’s last calculation on the official record under Ryu Seah’s name.",
    "c49_server_copy": "Not knowing who might clear out the folder by tomorrow, you copy the folder path tonight, while ECHO is still alive.",
    "c49_crosswalk_stay": "With someone in front of you who opened the envelope first and is sorry for it, you cut the Chairman off, hang up and stay with Yoon Seojin.",
    "c49_crosswalk_note": "To keep it from being remembered by only two people, you write the call down with the times and tell the Chairman you are writing.",
    "c49_crosswalk_ask": "Saying that taking it unknowing would make it your memory as it is, you press the Chairman to the end on what he means to hand over.",
    "c49_final_all": "Saying that pretending not to know was leaving it empty too, you propose writing the names of everyone who left that field empty, ours included.",
    "c49_final_his": "To make this the last time others fill that field in his place, you decide that Yoon Sanghyuk must fill it with his own hand.",
    "c49_final_inside": "Since that field is out of reach from outside, you decide to take the manager post he holds out and change the field from inside.",
    "c49_after_warm": "Saying you won’t let him decide even the hour he calls you, you spend the last night with everyone until the moon sets.",
    "c49_after_record": "So the records survive whatever happens up there, you bind the records of forty-nine cases into one folder and finish preparing to publish.",
    "c49_after_rush": "Not wanting to put off the empty signature field talk any longer, you go straight up to the 33rd floor the moment the text arrives.",
    "c49_parcels_choice_1": "To reassure the people wondering whether you’ll come back, you reply to each sender yourself, calling each one by name.",
    "c49_parcels_choice_2": "Since these are not words for you alone to read and put away, you bind them into an open letter before the meeting.",
    "c49_parcels_choice_3": "Saying the night would be gone answering them one by one, you put the replies off two days and spend today only on preparing for the meeting.",
    "c49_calls_choice_1": "Taking “don’t go alone” at its word, you ask the two of them to wait in the lobby tomorrow night.",
    "c49_calls_choice_2": "Saying there should be words on record before you enter that room, you answer Han Jiwoo’s questions in order and leave them as a statement before the meeting.",
    "c49_calls_choice_3": "Saying you aren’t going there to become anyone’s material, you agree to contact them both after the meeting and hang up.",
    "c49_hem_choice_1": "Unable to put more weight on Baek Arin while she is being sued, you tell her not to come to the lobby.",
    "c49_hem_choice_2": "Saying you must first preserve why nothing after 9 p.m. is preserved, you file a formal request to keep the CCTV setting records.",
    "c49_hem_choice_3": "So neither Baek Arin nor your colleagues get tangled up in this any further, you decide to use the dark CCTV and go up without anyone knowing.",
    "c49_parcels_reaction_choice_1": "Feeling that the words in that room would change with a story hanging on them, you ask her not to write up the meeting and to talk after you’re back.",
    "c49_parcels_reaction_choice_2": "Saying writing is a reporter’s job and only the timing needs keeping, you allow the reporting with an embargo until the meeting ends.",
    "c49_parcels_reaction_choice_3": "Saying it is safest for everyone to hear it the moment it comes out, you ask for a live stream set up to go out straight from the lobby.",
    "c49_calls_reaction_choice_1": "Unable to answer words sent after 11 minutes of hesitation with empty words, you tell Hong Yedam you will let her know tomorrow whether it was wrong.",
    "c49_calls_reaction_choice_2": "Saying “stopped” alone isn’t enough, you get a formal confirmation that the prediction log and the model are deleted.",
    "c49_calls_reaction_choice_3": "So as not to be dragged around by the number 9 seconds, you ignore the machine’s prediction and go back to preparing for tomorrow.",
    "c49_hem_reaction_choice_1": "Saying someone in no hurry deserves to be told face to face, you promise to go to Jeju in person when you are back and tell everything.",
    "c49_hem_reaction_choice_2": "To give words back to a record that ended at two words, you propose putting Sunwoo Jin’s statement, as a Cohort 1 participant, in tomorrow’s folder.",
    "c49_hem_reaction_choice_3": "Saying you can’t talk yet because the answer isn’t settled, you say you will call after tomorrow.",
    "c49_branch_columbarium_a": "To say with your own mouth what Moon Gaeul told the glass door, you promise aloud before Moon Sungho that you will see it through to the end tomorrow.",
    "c49_branch_columbarium_b": "Without overriding Lim Soyul’s wish to leave it here, you leave the original of the back page here and log only a copy as official evidence.",
    "c49_branch_columbarium_c": "Short on time to get back, you say a brief goodbye and hurry back to Seoul to prepare for tomorrow.",
    "c49_branch_columbarium_follow_a": "Saying the pen of the man who filled in fields belongs in that place, you keep the fountain pen and take it into that room tomorrow.",
    "c49_branch_columbarium_follow_b": "Saying a name written with someone else’s pen becomes someone else’s again, you return the pen to Lim Soyul and leave that field for him to fill with his own pen.",
    "c49_branch_columbarium_follow_c": "Saying its place is beside the man who filled in fields, you leave the pen by the memorial portrait on the bookshop’s 1st floor and go up without it.",
    "c49_route_system_publish": "So it survives whatever happens in that room, you publish the list of 61 empty fields to everyone before the meeting.",
    "c49_route_system_names": "Since people should be the first to know where their names were used, you find the 58 whose names were filled in for others and tell them first.",
    "c49_route_system_drop": "Saying the count of 61 fields is something to say in front of the field in that room, you fold the numbers away and bring them out only there tomorrow.",
    "c49_final_system_route_a": "To end the habit of the last to arrive taking the weight, you propose a rule that empty fields close only under the name of whoever left them empty.",
    "c49_final_system_route_b": "Deciding to do only what can be done by tomorrow night, you set the numbers aside and correct only the two fields with your name.",
    "c49_final_system_route_c": "Saying you can’t just fix your own fields and stop, you collect correction claims from the 58 whose names were written in and file them together.",
    "c49_evidence_turn_attach": "Since the record needs to be outside before you enter that room, you send the designation’s creation record to Na Eunho and Han Jiwoo at the same time.",
    "c49_evidence_turn_hold": "Since the two hands that chose the pen are a question for that room, you hold on to the creation record and bring it out first in that room tomorrow.",
    "c49_evidence_turn_share": "Not hiding how they meant to use you, you first show your colleagues that sentence in the recommendation reason.",
    "c49_market_evidence_turn": "Opening as a clue the account records of whoever prepared that room for tomorrow, you find out whose hand set the table.",
    "c49_server_evidence_turn": "Opening as a clue the account records of whoever prepared that room for tomorrow, you find out whose hand set the table.",
    "c49_crosswalk_evidence_turn": "Opening as a clue the account records of whoever prepared that room for tomorrow, you find out whose hand set the table.",
    "c49_route_system_evidence_turn": "Opening as a clue the account records of whoever prepared that room for tomorrow, you find out whose hand set the table.",
    "c49_start_warm_share": "Saying this is no invitation to answer alone, you post the text to the group chat as it is and hear everyone first.",
    "c49_start_warm_terms": "Saying a meeting called by word of mouth gets overturned by word of mouth, you reply asking for the agenda and terms in writing first.",
    "c49_start_warm_reply": "Not wanting to show hesitation first, you reply at once with one line, 'I’ll be there', and prepare for tomorrow.",
    "c49_start_warm_signature": "Since the people who spent that night with you have a share in deciding, you first show the text to your colleagues in the group chat and write the reply together.",
    "c49_start_record_share": "Saying this is no invitation to answer alone, you post the text to the group chat as it is and hear everyone first.",
    "c49_start_record_terms": "Saying a meeting called by word of mouth gets overturned by word of mouth, you reply asking for the agenda and terms in writing first.",
    "c49_start_record_reply": "Not wanting to show hesitation first, you reply at once with one line, 'I’ll be there', and prepare for tomorrow.",
    "c49_start_record_signature": "As ECHO said, the side that was read must write it down first; you begin by formally reporting the view log of the account that should have closed to Han Jiwoo.",
    "c49_start_rush_share": "Saying this is no invitation to answer alone, you post the text to the group chat as it is and hear everyone first.",
    "c49_start_rush_terms": "Saying a meeting called by word of mouth gets overturned by word of mouth, you reply asking for the agenda and terms in writing first.",
    "c49_start_rush_reply": "Not wanting to show hesitation first, you reply at once with one line, 'I’ll be there', and prepare for tomorrow.",
    "c49_start_rush_signature": "Unable to hide what you decided alone any longer, you confess to your colleagues the meeting you set first and the text."
  },
  "pack": {
    "clue": {
      "title": "Who Wrote the Designation",
      "text": "The successor-manager designation in the HR_Eval_Supplementary_Metric folder was made not by Yoon Sanghyuk but by an account in the Chairman’s Secretariat, on the night of the first-instance sentencing. It had one dot in the manager field and your name in the recommendation field."
    },
    "outcomes": {
      "c49_after_warm": {
        "tag": "The Ending That Stayed to the End",
        "title": "You stayed with everyone in the bookshop alley until the moon set",
        "text": "Yoon Sanghyuk told you to come up now, but you waited for the promised night. One cup of instant noodles was empty; the other stayed in your bag."
      },
      "c49_after_record": {
        "tag": "The Ending That Bound the Records",
        "title": "The records of forty-nine cases became one folder",
        "text": "The notebook, the list, the back page, the last calculation: all of it gathered in front of one publish button. The only empty field is the original folder in B2."
      },
      "c49_after_rush": {
        "tag": "The Ending That Went Straight Up",
        "title": "You went to the 33rd floor the moment the text came",
        "text": "While the people in the alley shared cup noodles, you caught a taxi. The lights in the 33rd-floor corridor were off."
      }
    },
    "continuityChallenges": {
      "c48_after_warm": {
        "title": "Go Up with the People Who Shared Songpyeon",
        "text": "The people who shared songpyeon at the bookshop the night the review committee ended are gathered in the group chat. Trust holds when you lay out the 33rd floor’s invitation before them and read it together."
      },
      "c48_after_record": {
        "title": "Turn the Table with the Document That Was Read",
        "text": "An account that should have been closed read your filed review committee document before dawn. The side that was read writes that fact down first, reframes the table and changes the shape of the invitation."
      },
      "c48_after_rush": {
        "title": "Tell Your Colleagues About the Meeting You Set Alone",
        "text": "None of your colleagues know about the 33rd-floor meeting you set by replying first. You must show that meeting to everyone before you go up, so fairness goes up with you."
      }
    }
  }
};
