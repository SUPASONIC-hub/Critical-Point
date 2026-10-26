/**
 * 사건 15 (src/nodes/case15.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c15_start": {
      "title": "Congratulations in 7 Pages",
      "text": "Someone you have never seen comes down to Trigger Lab’s 4th floor with a bag of tangerines. Manager Chae Yoonseul, the recruiter from KD Bank Human Resources. 'First time down here. I’ve brought good news!' She hands Lee Minseo an envelope. Passed the document review for conversion to a permanent position; final interview next Thursday at 8:40 a.m. The first time in 3 years. Oh Jinwoo is the first to clap. But the papers run 7 pages, and the last page, which came only as a printout and not through the HR system, is a confirmation. 'I confirm that the 11-second gap in the access log during the leak scare was caused by my own terminal operating error.' Lee Minseo looks at her desk calendar. Thursday already has a red circle. Her younger brother’s college entrance exam day. Chae Yoonseul’s smile fades a beat late. 'I can’t change the date. Or that page.'",
      "memo": [
        "Final interview for permanent conversion: next Thursday 08:40, head office HR",
        "7 pages to submit -- signing the confirmation on the last page is mandatory",
        "Subject of the confirmation: the 11-second gap in the access log during the leak scare",
        "Same day, exam check-in closes 08:10 -- younger brother Lee Chanbin, high school year 3"
      ],
      "choices": {
        "c15_start_compare": {
          "label": "Check the confirmation line by line against the leak file"
        },
        "c15_start_prep": {
          "label": "Call it a 3-year chance and help her prepare first"
        },
        "c15_start_ask": {
          "label": "Ask Lee Minseo what she wants before the papers"
        },
        "reframe": {
          "label": "Count whose names closed 'personal error' cases"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room",
      "clock": "Permanent-post interview D-6 · Exam D-6",
      "question": "The condition for a permanent post is a signature admitting the 11 seconds as her own error. What do you do first?",
      "lead": "It is the first time anyone from HR has come to this 4th floor since Trigger Lab opened. The smell of tangerines arrives first."
    },
    "c15_form": {
      "title": "A Form with No Return Box",
      "text": "Chae Yoonseul spreads the confirmation out again and reads it to you one sentence at a time. On the last two lines her voice drops. 'I will raise no objection whatsoever regarding the above in the future. This confirmation is used only as reference material for the conversion review.' Lee Minseo asks, 'If it’s reference material, why do I fail if I don’t sign?' Chae Yoonseul turns her monitor. The internal email that came down from above has no sending department, and the only button she can press is 'Forwarded.' 'There’s no return box. Not on my form.' The 11 seconds that the Leadline story and the parliamentary audit called 'traces of someone’s tampering' become one contract worker’s slip of the finger with this single sheet. Chae Yoonseul adds quietly, 'You can file one request to adjust the wording. By 18:00 Wednesday.'",
      "memo": [
        "Last line of the confirmation: 'I will raise no objection whatsoever in the future'",
        "No sending department shown -- Chae Yoonseul’s only action button is 'Forwarded'",
        "1 chance to request a wording change, deadline Wednesday 18:00",
        "Refusing to sign means automatic failure in the conversion review"
      ],
      "choices": {
        "c15_form_ask": {
          "label": "Ask Chae Yoonseul aside if she ever got this paper"
        },
        "c15_form_refuse": {
          "label": "Sit with Lee Minseo and insist: interview, no confirmation"
        },
        "c15_form_amend": {
          "label": "Request 'operating error' be changed to 'cause unknown'"
        },
        "reframe": {
          "label": "Count whose names closed 'personal error' cases"
        },
        "c15_form_evidence_turn": {
          "label": "Spread out the 12 conversion candidates’ confirmations"
        }
      },
      "place": "KD Bank Head Office HR · Meeting Room",
      "clock": "Permanent-post interview D-3 · Monday",
      "question": "The confirmation from above has no sending department and no box to return it. What do you do with this paper?",
      "lead": "Monday after the weekend. Chae Yoonseul called Lee Minseo and you up to the 7th floor of head office to explain the confirmation."
    },
    "c15_rooftop": {
      "title": "100 Sample Business Cards",
      "text": "Trigger Lab’s people gather on the wooden platform of a rooftop room in Haebangchon. In the middle is a box of sweet rice cakes that Moon Gaeul sent 'so it sticks.' Lee Chanbin, headphones on, just bows and goes into the room. Then Ban Jaewook holds out a document envelope. Inside are 100 business cards. 'KD Bank Data Management Department, Lee Minseo.' 'Samples. I printed them on the Internal Audit printer, so I’ll write the incident report.' He is the man who copied three lines of records with Lee Minseo’s name into his notebook during the leak scare. Lee Minseo stares at one card for a long time. After everyone leaves, she stays on the platform and speaks. 'During those 11 seconds I was in the ER. Chanbin’s appendix burst. If I submit the medical records, it’s over. But Chanbin’s name is in them. He thinks that night was his fault. I don’t want to bring it up two days before his exam.'",
      "memo": [
        "100 sample business cards -- printed by Ban Jaewook on the Internal Audit printer",
        "Those 11 seconds: Lee Minseo was in the Ieum Hospital ER as a guardian",
        "Patient name on the medical records: Lee Chanbin",
        "38 hours until exam check-in"
      ],
      "choices": {
        "c15_rooftop_shield": {
          "label": "Propose fighting with other evidence, not Chanbin’s file"
        },
        "c15_rooftop_now": {
          "label": "Get the medical records tomorrow; attach to the request"
        },
        "c15_rooftop_consent": {
          "label": "Submit the records after the exam, with Chanbin’s consent"
        },
        "reframe": {
          "label": "Count whose names closed 'personal error' cases"
        },
        "c15_rooftop_evidence_turn": {
          "label": "Spread out the 12 conversion candidates’ confirmations"
        }
      },
      "place": "Lee Minseo’s Rooftop Room, Haebangchon · Rooftop Platform",
      "clock": "Exam D-2 · Evening",
      "question": "The medical records that would clear the 11 seconds carry her brother’s name. What do you do with them?",
      "lead": "On the platform with the rice cake box and the sample cards, Lee Minseo stays behind alone after the guests leave."
    },
    "c15_gate": {
      "title": "08:10",
      "text": "Minus 2 degrees, breath clouding white. Trigger Lab’s cheering squad stands at the gate of Eungang High School in Yongsan. Kang Taemin tears open a box of hand warmers and presses two into the hands of every passing student, hears 'We don’t go to this school' 20 times, and 20 times says 'Cold is cold' and hands them out anyway. Oh Jinwoo shouts himself hoarse because the next school’s cheering is louder, and Na Junhyuk’s sign 'Mark anything, you’ll pass' becomes a photo spot for parents. Chanbin went in at 7:50. At 8:02, Lee Minseo comes running up from the bottom of the slope. In her hand is an insulated lunch bag. The one Chanbin left on the platform. At 8:10, twenty steps short, the gate closes. A police officer shakes his head with an apologetic face. 30 minutes until the interview.",
      "memo": [
        "Check-in closes 08:10 -- Lee Minseo arrives 08:10:14",
        "Lunch: beef and radish soup and rolled omelet, a note on the lid",
        "Head office HR interview 08:40 -- 32 minutes by subway",
        "Na Junhyuk’s sign: 47 parent photos"
      ],
      "choices": {
        "c15_gate_office": {
          "label": "Ask exam HQ whether there’s a way to deliver lunch"
        },
        "c15_gate_taxi": {
          "label": "Keep the lunch, grab a taxi, and race to the interview"
        },
        "c15_gate_stay": {
          "label": "Stand by her until she calms down, even if late"
        },
        "reframe": {
          "label": "Count whose names closed 'personal error' cases"
        },
        "c15_gate_evidence_turn": {
          "label": "Spread out the 12 conversion candidates’ confirmations"
        }
      },
      "place": "Eungang High School, Yongsan · Gate · Outside the Exam Site",
      "clock": "Exam Day · 07:40",
      "question": "The gate closes twenty steps ahead, and the lunch is still in Lee Minseo’s hand. What do you do?",
      "lead": "30 minutes after you tore open the hand warmers and raised the signs, you hear someone running up from the bottom of the slope."
    },
    "c15_final": {
      "title": "One Fountain Pen",
      "text": "Across the long table in the interview room sit four interviewers. The head of HR, the head of Data Management, Baek Arin of the Group Strategy Office, and Chae Yoonseul in the secretary’s seat. In front of Lee Minseo are the confirmation and one fountain pen. You sit in a chair by the wall as the one who wrote her recommendation. The head of HR says gently, 'If you sign, the result comes out this afternoon.' At this moment, on the 3rd floor of Eungang High, Period 1, the Korean language exam, is 12 minutes in. Lee Minseo picks up the pen, puts it down, and turns to you. 'You’ll respect whatever I choose, right? But just one thing. I don’t want to be a sister who lies to Chanbin.' A sample business card sticks out of her coat pocket. Baek Arin glances at her watch once.",
      "memo": [
        "4 interviewers -- including Baek Arin; Chae Yoonseul as secretary",
        "If she signs: permanent post, the 11 seconds officially closed as 'her own error'",
        "If she refuses: automatic failure, 4 months until her contract ends",
        "12 contract workers up for conversion received the same form"
      ],
      "choices": {
        "c15_final_publish": {
          "label": "Make the confirmation itself public outside this room"
        },
        "c15_final_fight": {
          "label": "Tell her not to sign; fight for the 11 seconds together"
        },
        "c15_final_respect": {
          "label": "Respect her choice to sign and change it from within"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Bank Head Office 7th Floor HR · Conference Room",
      "clock": "Exam Day · 08:52 · Period 1, Korean",
      "question": "The confirmation and a fountain pen lie before Lee Minseo, and she turns to you. What do you do?",
      "lead": "Lee Minseo came in with her hair damp with sweat, a sample business card sticking out of her coat pocket."
    },
    "c15_aftershock": {
      "title": "A Cold Lunch",
      "text": "At 17:45, the gate opens again. Na Junhyuk flips his sign over. On the back: 'Every mark was right.' Lee Chanbin comes out of the crowd of students. The moment he sees Lee Minseo, he asks, 'Sis, how was the interview?' Instead of answering, Lee Minseo holds out the insulated lunch bag. The one Chanbin left on the platform that morning. The radish soup is cold, and three spoonfuls are gone -- what his sister ate instead of breakfast. Chanbin laughs. 'For lunch the proctor gave me a chocolate bar. The kid next to me gave me half a gimbap roll.' Brother and sister sit on the gate steps and share the cold soup. Kang Taemin puts a leftover hand warmer on each of their laps. Then he looks at his phone and his face stiffens. The night-shift group chat from the fulfillment center.",
      "memo": [
        "Exam ends 17:45 -- Lee Chanbin finished through the last period",
        "Lunch: beef and radish soup, three spoonfuls gone",
        "Back of Na Junhyuk’s sign: 'Every mark was right'",
        "Group text to Kang Taemin from the fulfillment center"
      ],
      "choices": {
        "c15_after_warm": {
          "label": "Share the cold lunch with them on the gate steps"
        },
        "c15_after_record": {
          "label": "Write up a proposal to end contract-worker confirmations"
        },
        "c15_after_rush": {
          "label": "Follow Kang Taemin’s text straight to the next site"
        }
      },
      "place": "Eungang High School, Yongsan · Gate",
      "clock": "Exam Day · 17:45",
      "question": "Brother and sister sit with a cold lunch between them, and Kang Taemin’s phone has gone off. How do you close this evening?"
    },
    "c15_report": {
      "title": "Supporting Document No. 1",
      "text": "At eleven at night, Oh Jinwoo comes in with a printout of the confirmation’s attachment list. Supporting document No. 1: 'Leak Incident Phase 1 Analysis Report -- Author: Oh Jinwoo.' The draft he wrote overnight and filed during the leak scare. The conclusion field reads 'High likelihood Lee Minseo leaked alone.' The report he thought had been discarded once the 11 seconds came to light is alive and well as an attachment on the HR server. Oh Jinwoo loosens his tie. 'I was fast, wasn’t I. Back then I thought fast meant winning. I need to end this report with my own hands.'",
      "memo": [
        "Confirmation supporting document No. 1: Oh Jinwoo’s Phase 1 analysis report",
        "Conclusion: 'High likelihood Lee Minseo leaked alone'",
        "No record of disposal -- original kept on the HR server"
      ],
      "choices": {
        "c15_report_choice_2": {
          "label": "Have him formally file a withdrawal of the report"
        },
        "c15_report_choice_1": {
          "label": "Take Oh Jinwoo to apologize to Lee Minseo for it first"
        },
        "c15_report_choice_3": {
          "label": "Put off the withdrawal until after the interview"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Night",
      "clock": "Permanent-post interview D-3 · 23:10",
      "question": "The confirmation’s supporting document No. 1 is Oh Jinwoo’s old report. How do you end that report?"
    },
    "c15_picket": {
      "title": "Mark Anything, You’ll Pass",
      "text": "The night before the exam, Trigger Lab’s pantry becomes a cheering-gear factory. Na Junhyuk, up from Yeongdong, writes signs with a brush pen. 'Mark anything, you’ll pass.' His hand stamped seals for 30 years, so the letters are as straight as a government signboard. When Han Seoyun asks, 'Is “mark anything” okay at a school gate?', Na Junhyuk adds in small letters in the corner, 'Seal marks, I mean.' Kang Taemin comes in shouldering a box of 200 hand warmers, and Kwon Dohyun, calculating the right number of hand warmers for 1 person, declares, 'This isn’t a loss, it’s a surplus.' As the laughter dies down, Do Yoonha spreads out a map. 32 minutes by subway from the exam site to head office. Check-in closes at 8:10, the interview is at 8:40. To keep both, someone has to let go of one side.",
      "memo": [
        "6 signs -- Na Junhyuk’s brush-pen lettering",
        "200 hand warmers -- Kang Taemin’s own money",
        "32 minutes by subway from the exam site to head office, no slack"
      ],
      "choices": {
        "c15_picket_choice_2": {
          "label": "Split into a gate team and an interview team"
        },
        "c15_picket_choice_1": {
          "label": "All go to the gate, then to the interview with her"
        },
        "c15_picket_choice_3": {
          "label": "Keep the cheering short, sleep early, go to the interview"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Pantry",
      "clock": "Night Before the Exam · 22:00",
      "question": "There are 30 minutes between check-in closing and the interview. How do you split the people tomorrow morning?"
    },
    "c15_lunchbox": {
      "title": "It’s Okay to Get It Wrong",
      "text": "In the back seat of a taxi headed for Euljiro, Lee Minseo sets the lunch bag on her lap. The beef and radish soup she made at five in the morning is still warm. On the lid is a note she stuck there. 'It’s okay to get it wrong. Your sister got a lot wrong too.' Reading the note, Lee Minseo laughs, and laughing, cries. Then she takes out a spoon. 'I didn’t have breakfast. Can I eat this before I go in? Chanbin will understand.' On the third spoonful, a text comes from Chae Yoonseul. 'One of the interviewers has changed. Deputy Manager Baek Arin of the Group Strategy Office is coming in.'",
      "memo": [
        "16 minutes until the interview",
        "Interviewer replaced: Baek Arin, Group Strategy Office",
        "Note on the lunch lid: 'It’s okay to get it wrong'"
      ],
      "choices": {
        "c15_lunchbox_choice_1": {
          "label": "In the taxi, sort out only what Lee Minseo wants to say"
        },
        "c15_lunchbox_choice_2": {
          "label": "Find the rule that lets Group Strategy sit in on HR"
        },
        "c15_lunchbox_choice_3": {
          "label": "Call Baek Arin first and sound out what she wants"
        }
      },
      "place": "In a Taxi Bound for Euljiro",
      "clock": "Exam Day · 08:24",
      "question": "One interviewer has been replaced by someone from the Group Strategy Office. How do you use the remaining 16 minutes?"
    },
    "c15_report_reaction": {
      "title": "17 Million Won a Second",
      "text": "The next morning, Kwon Dohyun draws a vertical line on the pantry whiteboard. Left: if she signs. Right: if she doesn’t. He adds up 30 years of the salary gap between permanent and contract staff, bonuses, severance, even family tuition support. 'The value of the signature is 190 million won. Divided by 11 seconds, about 17 million won a second. The most expensive 11 seconds I’ve ever seen.' Kang Taemin, passing with a cup of noodles, stops. 'So if she doesn’t sign, she throws away 190 million.' Kwon Dohyun shakes his head. 'No. If she signs, she sells the 11 seconds. And inside those 11 seconds is someone else’s name. I can’t put a price on that field.'",
      "memo": [
        "Value of the signature: 190 million won",
        "One field that can’t be priced"
      ],
      "choices": {
        "c15_report_reaction_choice_1": {
          "label": "Show Lee Minseo the numbers and leave it to her"
        },
        "c15_report_reaction_choice_2": {
          "label": "Find the other name inside the 11 seconds first"
        },
        "c15_report_reaction_choice_3": {
          "label": "Say honestly that 190 million is worth signing for"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Pantry",
      "clock": "Permanent-post interview D-2 · Morning",
      "question": "The signature has been priced at 17 million won a second. How do you use this calculation?"
    },
    "c15_picket_reaction": {
      "title": "Are You Signing Because of Me?",
      "text": "Past midnight, a call comes from Lee Minseo’s number. The voice is Lee Chanbin’s. 'Sis is in the shower. Um, can I ask you something?' He says he saw the copy of the confirmation on the kitchen table. 'The 11 seconds -- that’s that night, right? The night I went to the ER.' For a long time there is only breathing. 'Is she signing this because of me? So I can go to college?' Seven and a half hours until check-in. On the other end, the sound of the shower stops.",
      "memo": [
        "Her brother saw the copy of the confirmation",
        "Seven and a half hours until check-in"
      ],
      "choices": {
        "c15_picket_reaction_choice_1": {
          "label": "Tell Chanbin the truth and ask him to back his sister"
        },
        "c15_picket_reaction_choice_2": {
          "label": "Ask him to hand the phone over so she can tell him"
        },
        "c15_picket_reaction_choice_3": {
          "label": "Say you’ll talk after the exam and tell him to sleep"
        }
      },
      "place": "Lee Minseo’s Rooftop Room, Haebangchon · Rooftop Platform",
      "clock": "Exam Day · 00:40",
      "question": "Her brother saw the copy of the confirmation and asks if it’s because of him. What do you answer?"
    },
    "c15_lunchbox_reaction": {
      "title": "A Good Story",
      "text": "Baek Arin is waiting at the 1st-floor elevators of head office. A gray coat and one tablet. 'Ms. Lee Minseo, it’s exam day today, isn’t it? I hope your brother does well.' It sounds sincere. When the elevator doors close, she shows you the screen. A draft press release from the Innovation Committee, which the group set up to turn public opinion. 'All 12 contract workers converted to permanent positions -- past incidents have all been resolved.' 'If you sign, this goes out this afternoon. All 12 go in together. A good story outlasts the facts.' The 7th-floor button lights up.",
      "memo": [
        "Draft press release: 'past incidents have all been resolved'",
        "The 12 who would go in together"
      ],
      "choices": {
        "c15_lunchbox_reaction_choice_1": {
          "label": "Ask to see all 12 confirmations first"
        },
        "c15_lunchbox_reaction_choice_2": {
          "label": "Demand the draft release be attached to the interview record"
        },
        "c15_lunchbox_reaction_choice_3": {
          "label": "Say if it’s a good story, accept it for the 12"
        }
      },
      "place": "KD Bank Head Office · Elevator",
      "clock": "Exam Day · 08:38",
      "question": "Baek Arin ties one line of signature to 12 permanent conversions and holds it out. How do you answer?"
    },
    "c15_branch_roof": {
      "title": "Gimbap on the Roof",
      "text": "Half past nine at night. Chae Yoonseul is eating convenience-store gimbap on a bench on the head office roof. You are the one who asked her out, but she offers you half a roll first. After hearing your question, she just chews for a long time. Then she takes a paper folded in four from the inside of her wallet. A date 7 years ago, her signature. 'I confirm that the 300,000 won cash shortage at my window was caused by my own miscounting.' 'I was a contract teller back then. That 300,000 won wasn’t money I counted. But I signed and got in, and for 7 years I told myself I’d change things from inside.' She folds the paper again. 'And now here I am, delivering that paper.'",
      "memo": [
        "Chae Yoonseul: contract teller 7 years ago, signed a confirmation at conversion",
        "300,000 won cash shortage -- not money she counted",
        "That confirmation is still in her HR record",
        "Chae Yoonseul’s authority: 1 wording-change request, cannot return"
      ],
      "choices": {
        "c15_branch_roof_b": {
          "label": "Attach her 7-year-old confirmation to the request as a case"
        },
        "c15_branch_roof_a": {
          "label": "Ask if she’d show that paper to Lee Minseo herself"
        },
        "c15_branch_roof_c": {
          "label": "Leave her story buried; pay for the gimbap and go"
        }
      },
      "place": "KD Bank Head Office · Rooftop",
      "clock": "Permanent-post interview D-3 · 21:30",
      "question": "The person delivering the papers signed the same paper 7 years ago. What do you do with it?"
    },
    "c15_branch_roof_follow": {
      "title": "A Box Called Hold",
      "text": "Waiting for the elevator, Chae Yoonseul shows you her phone’s wallpaper. A girl missing her front teeth, wearing a backpack as big as she is. 'When I signed 7 years ago, she was on the way. That’s why I did it. If you ask whether I regret it, I don’t know.' The elevator passes the 7th floor without stopping and keeps going down. She lowers her voice. 'There’s no box in the rules for holding a forward. But there’s no line saying I can’t, either. If I don’t press 'Forwarded' until Thursday morning, the interview starts without the confirmation. What happens after that, I don’t know either.' The doors open, and she steps out first.",
      "memo": [
        "Chae Yoonseul’s daughter: 1st grade this year",
        "Rules: no clause for holding a forward -- no clause forbidding it either",
        "Holding it could make Chae Yoonseul herself subject to discipline",
        "Three days until the interview"
      ],
      "choices": {
        "c15_branch_roof_follow_c": {
          "label": "Talk her out of holding it so she doesn’t get hurt"
        },
        "c15_branch_roof_follow_b": {
          "label": "Co-write a proposal to add a return box to HR forms"
        },
        "c15_branch_roof_follow_a": {
          "label": "Put Trigger Lab’s name beside her hold"
        }
      },
      "place": "KD Bank Head Office · Elevator",
      "clock": "Permanent-post interview D-3 · 22:10",
      "question": "Chae Yoonseul says she’ll try a 'hold' the rules don’t mention. How do you share that risk?"
    },
    "c15_route_system": {
      "title": "Whose Error",
      "text": "You propose counting whose names closed the incidents filed as 'personal error.' ECHO opens KD Bank’s document management system. 1,284 internal incident reports from the past 10 years fill the screen. 342 were closed with the cause 'personal operating error.' Of those, 243 were closed under the names of contract or agency staff, and 231 have a confirmation attached. Of those who signed, 188 got permanent posts within 1 year. And 97 later had another incident with the same cause. 'Error has been learned to be assigned to whoever is contracted most cheaply. The cause is closed, and the incidents continue.'",
      "memo": [
        "Of 342 incidents closed as personal error, 243 involved contract or agency staff",
        "231 with confirmations attached -- 97 recurred from the same cause",
        "This statistic has never been cited in any HR material"
      ],
      "choices": {
        "c15_route_system_drop": {
          "label": "Bury the numbers and keep to the interview schedule"
        },
        "c15_route_system_reopen": {
          "label": "Demand the causes of the 97 recurrences be reopened"
        },
        "c15_route_system_publish": {
          "label": "Send the numbers to HR and the union at once"
        },
        "c15_route_system_evidence_turn": {
          "label": "Spread out the 12 conversion candidates’ confirmations"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "Permanent-post interview D-3",
      "question": "Most incidents closed as personal error were closed under contract workers’ names. What do you do with this statistic?"
    },
    "c15_final_system_route": {
      "title": "Names Contracted Cheaply",
      "text": "Before dawn on exam day, the 342 incidents closed as 'personal operating error' stand on the screen in order of name. When ECHO adds one contract-type column, the list splits in two. The longer side is the people who are not permanent staff. Lee Minseo’s interview is at 8:40, and her confirmation sits where the next line of this list would go. 'Once she signs, the cause field closes. A closed field has never reopened. Not in any of the 97 times the same incident happened again.'",
      "memo": [
        "342 incidents closed as 'personal operating error' -- 231 with confirmations attached",
        "97 incidents that recurred from the same cause",
        "Lee Minseo’s final interview: today 08:40"
      ],
      "choices": {
        "c15_final_system_route_a": {
          "label": "Add a return box so she’s reviewed without the confirmation"
        },
        "c15_final_system_route_b": {
          "label": "Keep the confirmation; ask for more conversion slots"
        },
        "c15_final_system_route_c": {
          "label": "Help the workers who refused to sign object together"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "Exam Day · Before Dawn",
      "question": "Lee Minseo’s confirmation sits where the next line of the list would go. Under whose name do you let that line close?"
    },
    "c15_evidence_turn": {
      "title": "The Same Sentence, 12 Times",
      "text": "When you search the HR records for the form number in the clue, the papers of all 12 candidates in this conversion review open at once. All 12 have a confirmation attached to the last page. A teller cash shortage, missing call center recordings, a failed server backup. Every incident is different and every sentence is the same. 'I confirm that it was caused by my own error.' The file properties list the authoring department not as HR but as the Group Strategy Office, and the creation date is the day after the Innovation Committee launched. Ban Jaewook closes the notebook he was writing in. 'They’re using permanent posts as bait to close 12 incidents of unknown cause at once. What I used to do in Internal Audit, they now do with one line of signature.'",
      "memo": [
        "All 12 conversion candidates have confirmations attached",
        "Authoring department: Group Strategy Office -- the day after the Innovation Committee launched",
        "All 12 are incidents whose cause investigations never finished"
      ],
      "choices": {
        "c15_evidence_turn_all": {
          "label": "Block signing until all 12 confirmations are dropped"
        },
        "c15_evidence_turn_share": {
          "label": "Tell the 12 about each other’s confirmations first"
        },
        "c15_evidence_turn_hold": {
          "label": "Hold the authoring record until after the interview"
        }
      },
      "place": "Trigger Lab Archive B2 · HR Records",
      "clock": "Exam Day · 06:30",
      "question": "12 different incidents are about to be closed with the same sentence. How do you use this record?"
    },
    "c15_start_warm": {
      "title": "The Day After the Dictation Test",
      "text": "On the evening the fund withdrawal was filed, you stayed to the end of the investors’ meeting and took the dictation test Ms. Lee Jungsook gave. The blackboard line 'If you don’t understand it, don’t sign' made it all the way to her grandson’s school group chat. What the 'one condition' in Lee Minseo’s message that evening meant becomes clear only 2 weeks later, when Manager Chae Yoonseul of HR comes down to Trigger Lab with papers. The last of the 7 pages is a confirmation. A sentence asking her to admit the 11-second gap in the access log during the leak scare as her own operating error. The interview falls on her younger brother’s college entrance exam day. Do Yoonha sends Lee Minseo the photo of the blackboard.",
      "memo": [
        "Blackboard line: 'If you don’t understand it, don’t sign'",
        "Lee Minseo’s permanent conversion -- conditional on signing the confirmation",
        "Interview day = her brother Lee Chanbin’s exam day"
      ],
      "choices": {
        "c15_start_warm_ask": {
          "label": "Ask Lee Minseo what she wants before the papers"
        },
        "c15_start_warm_signature": {
          "label": "Sit beside Lee Minseo with Ms. Lee’s blackboard line"
        },
        "c15_start_warm_compare": {
          "label": "Check the confirmation line by line against the leak file"
        },
        "c15_start_warm_prep": {
          "label": "Call it a 3-year chance and help her prepare first"
        },
        "c15_start_warm_reframe": {
          "label": "Count whose names closed 'personal error' cases"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room",
      "clock": "Permanent-post interview D-6 · Exam D-6",
      "question": "The blackboard line about not signing what you don’t understand has reached someone asked to sign knowing full well. How do you hand her that line?",
      "lead": "2 weeks since the dictation test, and the blackboard photo is still Do Yoonha’s phone wallpaper."
    },
    "c15_start_record": {
      "title": "A Document That Corrects, a Document That Erases",
      "text": "The revised teller sales standard you wrote was formally registered as an internal bank document. The one who pressed the register button was Lee Minseo, in charge of data records. What she left in the group chat that evening -- 'They say there’s one condition' -- arrives 2 weeks later. 7 pages of permanent conversion papers brought by Manager Chae Yoonseul, the HR recruiter; the last page is a confirmation. A sentence saying the 11-second gap in the access log during the leak scare was her own operating error. Sign, and she is permanent; the interview is on her younger brother’s college entrance exam day. ECHO puts the two documents side by side. One corrects the record; the other erases it.",
      "memo": [
        "Revised teller sales standard registered -- registered by Lee Minseo",
        "7 pages of conversion papers, 2 weeks later",
        "Confirmation: the 11-second gap as 'her own error'"
      ],
      "choices": {
        "c15_start_record_prep": {
          "label": "Call it a 3-year chance and help her prepare first"
        },
        "c15_start_record_ask": {
          "label": "Ask Lee Minseo what she wants before the papers"
        },
        "c15_start_record_compare": {
          "label": "Check the confirmation line by line against the leak file"
        },
        "c15_start_record_signature": {
          "label": "Log an objection to the confirmation as you did the revision"
        },
        "c15_start_record_reframe": {
          "label": "Count whose names closed 'personal error' cases"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room",
      "clock": "Permanent-post interview D-6 · Exam D-6",
      "question": "The person who registered a document that corrects the record is asked to sign one that erases it. What do you do?",
      "lead": "2 weeks after the registration notice, an HR envelope lands on Lee Minseo’s desk."
    },
    "c15_start_rush": {
      "title": "The One Who Read It First",
      "text": "As soon as you got Lee Minseo’s message, you went straight up to head office HR. At seven in the evening, Manager Chae Yoonseul was alone at the end of a dark hallway, and, flustered, she showed you papers not yet sent. 7 pages of permanent conversion papers; the last page is a confirmation. Admit the 11-second gap in the access log during the leak scare as her own error, and the post is permanent. The interview is on her younger brother’s college entrance exam day. On the morning the envelope formally arrives 2 weeks later, Ban Jaewook says quietly, 'Ms. Lee Minseo told me. Someone read her papers before she did.'",
      "memo": [
        "HR hallway, 19:00 -- read the papers before they were sent",
        "Read the confirmation before Lee Minseo did",
        "Interview day = her brother’s exam day"
      ],
      "choices": {
        "c15_start_rush_compare": {
          "label": "Check the confirmation line by line against the leak file"
        },
        "c15_start_rush_signature": {
          "label": "Apologize to Lee Minseo first for reading her papers"
        },
        "c15_start_rush_prep": {
          "label": "Call it a 3-year chance and help her prepare first"
        },
        "c15_start_rush_ask": {
          "label": "Ask Lee Minseo what she wants before the papers"
        },
        "c15_start_rush_reframe": {
          "label": "Count whose names closed 'personal error' cases"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room",
      "clock": "Permanent-post interview D-6 · Exam D-6",
      "question": "You read Lee Minseo’s confirmation before she did. Now that the envelope has formally arrived, what do you do first?",
      "lead": "2 weeks after you saw the papers in the HR hallway, the same envelope lands formally on Lee Minseo’s desk."
    }
  },
  "echoReplies": {
    "c15_start_ask": "Asked, Lee Minseo doesn’t answer for a long time. Then she says, 'I want to be permanent. Really, I do,' and surprises herself.",
    "c15_start_compare": "Comparing them shows the confirmation lifted words straight from the leak incident report. The same person wrote both.",
    "c15_start_prep": "Preparation speeds up. The very first question in the mock interview is 'You’ve submitted the confirmation, right?'",
    "c15_form_refuse": "When you dig in, Chae Yoonseul smiles awkwardly. 'I wish I could too.' Then she closes the window without pressing 'Forwarded.'",
    "c15_form_amend": "Even changed to 'cause unknown,' a signature is a signature. Reading the request, Lee Minseo says, 'My name still goes in, though.'",
    "c15_form_ask": "Asked, Chae Yoonseul doesn’t take her eyes off the monitor. 'Let’s talk on the roof after work.' Her hand drifts toward her wallet once.",
    "c15_rooftop_shield": "Other evidence is slow. Lee Minseo thanks you, then adds, 'But there’s no time.'",
    "c15_rooftop_consent": "While you wait for consent, the interview comes first. The medical records become evidence she can use only after signing.",
    "c15_rooftop_now": "With the records, the 11 seconds are nearly cleared. Chanbin’s name and diagnosis are added as one line to HR’s attachment list.",
    "c15_gate_stay": "While you stand by her, Lee Minseo grips the gate bars once and lets go. She reaches the interview 9 minutes late.",
    "c15_gate_office": "The HQ’s answer is kind and clear. 'Nothing can be brought in after check-in.' Confirming the rule takes 11 minutes.",
    "c15_gate_taxi": "The taxi is fast. Lee Minseo watches the gate recede through the rear window to the very end.",
    "c15_final_fight": "When you say fight, Lee Minseo caps the fountain pen. The sample cards stay samples, and four months until her contract ends begin.",
    "c15_final_respect": "When you respect it, Lee Minseo signs. Her handwriting shakes a little. She writes the date under her signature and, unseen by anyone, puts a small dot beside it.",
    "c15_final_publish": "Made public, the confirmation is no longer one person’s paper. The 12 names go out into the world with it. Some of them didn’t want that.",
    "c15_after_warm": "The soup is cold, but Chanbin drinks every drop of the broth. Kang Taemin’s text waits until tomorrow morning.",
    "c15_after_record": "The proposal is filed with HR. Manager Chae Yoonseul writes 'no hold' in the intake field and attaches, for the first time, a draft form with a return box.",
    "c15_after_rush": "When you get up, Chanbin says, 'Sis, your friend’s busy.' Instead of answering, Lee Minseo takes one more spoonful of the cold soup.",
    "c15_report_choice_1": "Hearing the apology, Lee Minseo is quiet for a while, then says, 'That report is how we found the 11 seconds. So I’m half grateful. Only half.'",
    "c15_report_choice_2": "The withdrawal gets a filing number. For the first time, Oh Jinwoo’s name is officially written on the wrong side.",
    "c15_report_choice_3": "With everyone quiet, the interviewers walk in having read attachment No. 1. That night Oh Jinwoo rereads his report three times.",
    "c15_picket_choice_1": "With everyone out, Trigger Lab is empty that morning. The 33rd floor makes a note of the empty seats.",
    "c15_picket_choice_2": "The roster is neat. But Lee Minseo’s name isn’t on either team, so she doesn’t know where she should stand.",
    "c15_picket_choice_3": "Sleeping early makes the morning light. Only one sign goes up at the gate.",
    "c15_lunchbox_choice_1": "What you sort out comes to three sentences. Lee Minseo deletes two of them and keeps one.",
    "c15_lunchbox_choice_2": "The rules have one line: 'relevant departments may participate when necessary.' Who decides what is necessary is not written.",
    "c15_lunchbox_choice_3": "Baek Arin picks up on the second ring. 'Good morning. I’ll see you in the interview room, then.' And she hangs up first.",
    "c15_report_reaction_choice_1": "Given the numbers, Lee Minseo writes one line at the bottom of the right column. 'Chanbin’s tuition, 4 years.' Kwon Dohyun quietly copies that line to the left column too.",
    "c15_report_reaction_choice_2": "Finding the name needs not the HR server but the original records from that dawn. The originals come later than the interview.",
    "c15_report_reaction_choice_3": "The honest words make the room go quiet. Kwon Dohyun leaves the whiteboard as it is, unerased.",
    "c15_picket_reaction_choice_1": "Hearing the truth, Chanbin says, 'Then, Sis, don’t sign.' Seven hours later, he walks into the exam carrying those words.",
    "c15_picket_reaction_choice_2": "Lee Minseo takes the phone and goes out to the platform. The siblings’ call lasts 40 minutes, and you don’t hear a word.",
    "c15_picket_reaction_choice_3": "Chanbin says 'Okay' and hangs up. No one knows whether he slept that night.",
    "c15_lunchbox_reaction_choice_1": "For the first time, Baek Arin answers about 1 second late. 'It’s personal information.' That 1 second is the answer.",
    "c15_lunchbox_reaction_choice_2": "The demand goes into the interview record. Baek Arin smiles, says 'Fine,' and deletes one line from the draft.",
    "c15_lunchbox_reaction_choice_3": "Accepted, the 12 become permanent that afternoon. What the 12 signed appears nowhere in the press release.",
    "c15_branch_roof_a": "Asked, Chae Yoonseul hesitates a long while, then nods. It is a paper she has shown no one in 7 years.",
    "c15_branch_roof_b": "Attached as a case, the request gets thicker. Chae Yoonseul’s name goes into that thickness too.",
    "c15_branch_roof_c": "The gimbap costs 3,500 won. Chae Yoonseul says 'Next time’s on me' and puts the paper back in her wallet. The story you didn’t ask about, she brings up herself at the elevator.",
    "c15_branch_roof_follow_a": "With the names side by side, Chae Yoonseul isn’t alone. In return, Trigger Lab makes its first enemy in HR.",
    "c15_branch_roof_follow_b": "The proposal is neat. A return box has to pass the HR committee twice, and Thursday comes sooner than that.",
    "c15_branch_roof_follow_c": "Talked out of it, Chae Yoonseul doesn’t get hurt. At 8 a.m. Thursday, 'Forwarded' is pressed on time.",
    "c15_route_system_publish": "The union calls an emergency meeting the moment it gets the numbers. HR sends only 'verifying the source of the data' the same day.",
    "c15_route_system_reopen": "Reopening shows the person in charge of the first of the 97 incidents has already quit. That person signed a confirmation too.",
    "c15_route_system_drop": "The buried numbers remain only in ECHO’s records. ECHO doesn’t erase them and carries them into the next case.",
    "c15_final_system_route_a": "With a return box, Chae Yoonseul has two buttons. What happens to the one who presses the second is not yet known.",
    "c15_final_system_route_b": "The slots increase. Signed confirmations increase by the same number.",
    "c15_final_system_route_c": "An objection made together is slow but heavy. Three people refused to sign, Lee Minseo included.",
    "c15_evidence_turn_all": "Tied together, the group has to lose all 12 at once or take them all in at once. The 33rd floor does that math.",
    "c15_evidence_turn_hold": "Holding it lets the interview run as scheduled. The record becomes a weapon, but Lee Minseo walks into the interview room without knowing about it.",
    "c15_evidence_turn_share": "Told, 8 of the 12 meet at a café that same evening. Setting their confirmations side by side for the first time, someone says, 'The sentences are identical.'",
    "c15_form_evidence_turn": "Go all the way down the list and it isn’t just Lee Minseo’s papers. 11 more people got the same form on the same day.",
    "c15_rooftop_evidence_turn": "Go all the way down the list and it isn’t just Lee Minseo’s papers. 11 more people got the same form on the same day.",
    "c15_gate_evidence_turn": "Go all the way down the list and it isn’t just Lee Minseo’s papers. 11 more people got the same form on the same day.",
    "c15_route_system_evidence_turn": "Go all the way down the list and it isn’t just Lee Minseo’s papers. 11 more people got the same form on the same day.",
    "case15_memory_system": "Set side by side, the confirmation carries over only the table’s conclusion and closes who is responsible under one person’s name. ECHO opens the incident reports closed as personal error, year by year.",
    "case15_memory_evidence": "Hold the purchase statement’s blank approver field against the confirmation file and the authoring department comes up. It isn’t HR.",
    "c15_start_warm_ask": "Asked, Lee Minseo doesn’t answer for a long time. Then she says, 'I want to be permanent. Really, I do,' and surprises herself.",
    "c15_start_warm_compare": "Comparing them shows the confirmation lifted words straight from the leak incident report. The same person wrote both.",
    "c15_start_warm_prep": "Preparation speeds up. The very first question in the mock interview is 'You’ve submitted the confirmation, right?'",
    "c15_start_warm_signature": "Seeing the blackboard photo, Lee Minseo laughs. 'What if I sign knowing exactly what it is?' The blackboard has no answer to that either.",
    "c15_start_record_ask": "Asked, Lee Minseo doesn’t answer for a long time. Then she says, 'I want to be permanent. Really, I do,' and surprises herself.",
    "c15_start_record_compare": "Comparing them shows the confirmation lifted words straight from the leak incident report. The same person wrote both.",
    "c15_start_record_prep": "Preparation speeds up. The very first question in the mock interview is 'You’ve submitted the confirmation, right?'",
    "c15_start_record_signature": "The objection gets a number. The HR system has no field to attach that number to, so the record stays only on Trigger Lab’s server.",
    "c15_start_rush_ask": "Asked, Lee Minseo doesn’t answer for a long time. Then she says, 'I want to be permanent. Really, I do,' and surprises herself.",
    "c15_start_rush_compare": "Comparing them shows the confirmation lifted words straight from the leak incident report. The same person wrote both.",
    "c15_start_rush_prep": "Preparation speeds up. The very first question in the mock interview is 'You’ve submitted the confirmation, right?'",
    "c15_start_rush_signature": "Hearing the apology, Lee Minseo says it’s all right. Then she opens the envelope slowly in front of you, as if for the first time."
  },
  "choiceVoiceLines": {
    "c15_start_ask": "Saying she is the one who waited 3 years, you ask Lee Minseo what she wants before looking at the papers.",
    "c15_start_compare": "To find out whether the 11 seconds really were her error, you check the confirmation line by line against the leak incident records.",
    "c15_start_prep": "Saying a chance that comes once in 3 years is too much to lose over one sheet, you help her prepare for the interview first.",
    "c15_form_refuse": "Saying that if it’s reference material it can do without, you sit beside Lee Minseo and insist she will interview without the confirmation.",
    "c15_form_amend": "Not wanting to waste the one chance, you write a wording-change request to turn 'operating error' into 'cause unknown.'",
    "c15_form_ask": "Sensing there’s a reason her voice drops, you take Chae Yoonseul aside and ask whether she has ever received this paper herself.",
    "c15_rooftop_shield": "Saying that night can’t be made her brother’s fault, you propose leaving Chanbin’s records out and fighting with other evidence.",
    "c15_rooftop_consent": "To protect both his exam and his name, you propose submitting the medical records after the exam, with Chanbin’s consent.",
    "c15_rooftop_now": "Knowing the records alone would end the 11 seconds, you get them tomorrow and attach them to the wording-change request.",
    "c15_gate_stay": "Since you can’t send her into the interview room with that face, you say being late is fine and stand by Lee Minseo until she catches her breath.",
    "c15_gate_office": "Saying even a closed gate must have a way, you formally ask the exam HQ whether there is a procedure for delivering lunch.",
    "c15_gate_taxi": "Saying the interview is the only thing you can keep within 30 minutes, you keep the lunch, grab a taxi, and race to the interview.",
    "c15_final_fight": "Saying you won’t make her a sister who lies to her brother, you tell her not to sign and to fight for the 11 seconds together to the end.",
    "c15_final_respect": "Saying you are not the one who chooses, you respect Lee Minseo’s choice to sign and change things from within.",
    "c15_final_publish": "So the 12 who got the same paper can know about each other, you make the confirmation itself public outside the interview room.",
    "c15_after_warm": "Saying today belongs to the siblings, you share the cold lunch with them on the gate steps to the end.",
    "c15_after_record": "So it doesn’t end as one person’s matter, you write up a proposal to end the practice of contract-worker confirmations.",
    "c15_after_rush": "Since you can’t let that stiff look pass, you follow Kang Taemin’s text straight to the next site.",
    "c15_report_choice_1": "Saying the person named in it comes before the paper, you go with Oh Jinwoo to apologize to Lee Minseo for that report first.",
    "c15_report_choice_2": "So the one who wrote it can end it, you have Oh Jinwoo formally file a withdrawal of the report in his name.",
    "c15_report_choice_3": "Saying touching it now would blow things up before the interview, you put off the withdrawal until after and propose staying quiet for now.",
    "c15_picket_choice_1": "So no one stands alone on either side, everyone goes to the gate and then on to the interview with Lee Minseo.",
    "c15_picket_choice_2": "Saying one team can’t cover a 32-minute gap, you split into a gate team and an interview team and draw up roles.",
    "c15_picket_choice_3": "Saying the real fight tomorrow is at head office, you leave the cheering short and have the rest sleep early and go to the interview.",
    "c15_lunchbox_choice_1": "Saying 16 minutes is no time to memorize someone else’s answers, you use the taxi ride to sort out only what Lee Minseo wants to say.",
    "c15_lunchbox_choice_2": "Saying their right to be there comes first, you search the rules for grounds for the Group Strategy Office to sit in on an HR interview.",
    "c15_lunchbox_choice_3": "Saying it’s better than hearing it first in the interview room, you call Baek Arin first and sound out what she wants.",
    "c15_report_reaction_choice_1": "Saying the one who pays the price should know the price, you show Lee Minseo the numbers and leave the call to her.",
    "c15_report_reaction_choice_2": "Saying the field he couldn’t price is the real problem, you propose finding the other name inside the 11 seconds first.",
    "c15_report_reaction_choice_3": "Since nice words can’t stand in for 30 years, you say honestly that 190 million is worth signing for.",
    "c15_picket_reaction_choice_1": "Since you can’t let him walk into the exam thinking it’s his fault, you tell Chanbin the truth and ask him to be on his sister’s side.",
    "c15_picket_reaction_choice_2": "Saying this answer isn’t for someone else to give, you ask him to hand over the phone so his sister can tell him herself.",
    "c15_picket_reaction_choice_3": "Saying the seven and a half hours until check-in are for sleeping, you tell him you’ll talk after the exam and to go to sleep now.",
    "c15_lunchbox_reaction_choice_1": "Saying you need to know the price of going in together, you ask to see all 12 confirmations first.",
    "c15_lunchbox_reaction_choice_2": "So it doesn’t vanish as words in an elevator, you demand the draft press release be attached to the interview record.",
    "c15_lunchbox_reaction_choice_3": "Saying twelve posts outweigh one person’s 11 seconds, you propose accepting it for the 12 if it’s a good story.",
    "c15_branch_roof_a": "Saying she can choose only after hearing about the 7 years after signing, you ask whether Chae Yoonseul would show that paper to Lee Minseo herself.",
    "c15_branch_roof_b": "To show it isn’t one person’s matter, you propose attaching the 7-year-old confirmation to the wording-change request as the same kind of case.",
    "c15_branch_roof_c": "Saying you can’t use even the paper she keeps in her wallet, you leave her story buried, pay for the gimbap, and go down.",
    "c15_branch_roof_follow_a": "Saying you won’t let her be disciplined alone, you say Trigger Lab will put its name beside Chae Yoonseul’s hold.",
    "c15_branch_roof_follow_b": "Saying one person not pressing a button won’t last, you co-write a proposal to add a return box to the HR form instead of a hold.",
    "c15_branch_roof_follow_c": "So that she, with a child in a backpack at home, doesn’t get hurt, you talk her out of the hold and have her forward it as usual.",
    "c15_route_system_publish": "So it isn’t buried in one drawer, you send the numbers to HR and the union at the same time.",
    "c15_route_system_reopen": "Saying the closed causes brought the incidents back, you demand the cause investigations for the 97 recurrences be reopened.",
    "c15_route_system_drop": "Saying you can’t miss one person’s interview arguing over 342 cases, you bury the numbers and keep to the interview schedule.",
    "c15_final_system_route_a": "Saying a signature with no box to refuse isn’t a choice, you add a return box to the form so she can be reviewed without the confirmation.",
    "c15_final_system_route_b": "Saying the form can’t be changed by 8:40, you leave the confirmation as it is and ask only for more conversion slots.",
    "c15_final_system_route_c": "Saying refusing alone just ends in failure, you help the contract workers who refused to sign file an objection together.",
    "c15_evidence_turn_all": "Saying separate signatures close 12 incidents with no investigation, you make sure no one signs until all 12 confirmations are dropped.",
    "c15_evidence_turn_hold": "So Lee Minseo’s interview isn’t held hostage, you hold the authoring department record and bring it out after the interview.",
    "c15_evidence_turn_share": "Saying each of them probably thinks they’re the only one, you tell the 12 about each other’s confirmations first.",
    "c15_form_evidence_turn": "Running down the list of conversion candidates as a clue, you count who all got the confirmation.",
    "c15_rooftop_evidence_turn": "Running down the list of conversion candidates as a clue, you count who all got the confirmation.",
    "c15_gate_evidence_turn": "Running down the list of conversion candidates as a clue, you count who all got the confirmation.",
    "c15_route_system_evidence_turn": "Running down the list of conversion candidates as a clue, you count who all got the confirmation.",
    "c15_start_warm_ask": "Saying she is the one who waited 3 years, you ask Lee Minseo what she wants before looking at the papers.",
    "c15_start_warm_compare": "To find out whether the 11 seconds really were her error, you check the confirmation line by line against the leak incident records.",
    "c15_start_warm_prep": "Saying a chance that comes once in 3 years is too much to lose over one sheet, you help her prepare for the interview first.",
    "c15_start_warm_signature": "Saying the line about not signing what you don’t understand fits here too, you sit beside Lee Minseo with Ms. Lee Jungsook’s blackboard line.",
    "c15_start_record_ask": "Saying she is the one who waited 3 years, you ask Lee Minseo what she wants before looking at the papers.",
    "c15_start_record_compare": "To find out whether the 11 seconds really were her error, you check the confirmation line by line against the leak incident records.",
    "c15_start_record_prep": "Saying a chance that comes once in 3 years is too much to lose over one sheet, you help her prepare for the interview first.",
    "c15_start_record_signature": "Saying a document that erases needs a corrective record beside it, you log an objection to the confirmation exactly the way the revision was registered.",
    "c15_start_rush_ask": "Saying she is the one who waited 3 years, you ask Lee Minseo what she wants before looking at the papers.",
    "c15_start_rush_compare": "To find out whether the 11 seconds really were her error, you check the confirmation line by line against the leak incident records.",
    "c15_start_rush_prep": "Saying a chance that comes once in 3 years is too much to lose over one sheet, you help her prepare for the interview first.",
    "c15_start_rush_signature": "Saying what you meant as help got ahead of what was hers, you apologize to Lee Minseo first for reading her papers before she did."
  },
  "pack": {
    "clue": {
      "title": "The Confirmation’s Authoring Department",
      "text": "The confirmations for the 12 contract workers up for conversion had different incidents but the same sentence, and the files were made not by HR but by the Group Strategy Office. They were made the day after the Innovation Committee launched."
    },
    "outcomes": {
      "c15_after_warm": {
        "tag": "Shared the Lunch",
        "title": "On the gate steps, you shared the cold soup to the end",
        "text": "On the evening the exam ended, the siblings and Trigger Lab’s people sat on the gate steps and shared one lunch. Chanbin drank every drop of the broth."
      },
      "c15_after_record": {
        "tag": "Fixed the Form",
        "title": "A form with a return box was filed instead of a confirmation",
        "text": "A proposal to end the practice of contract-worker confirmations was filed with HR. Chae Yoonseul’s form is next in line to get its second button for the first time."
      },
      "c15_after_rush": {
        "tag": "Left First",
        "title": "You left the cold lunch and went ahead to the next site",
        "text": "You left the siblings on the gate steps and got up to follow Kang Taemin’s text. A few spoonfuls of soup were left as your share."
      }
    },
    "continuityChallenges": {
      "c14_after_warm": {
        "title": "Take the Blackboard Line to Lee Minseo’s Side",
        "text": "The welfare center blackboard says not to sign what you don’t understand. Trust grows from the card that carries those words to the side of someone asked to sign knowing full well."
      },
      "c14_after_record": {
        "title": "Read the Erasing Document Through the Correcting One",
        "text": "The person who registered your revision has received a confirmation that erases the record. Only with the correcting document and the erasing document on one table can you read the difference."
      },
      "c14_after_rush": {
        "title": "Give the Confirmation You Read First Back to Its Owner",
        "text": "You read Lee Minseo’s confirmation before she did. Don’t pretend that evening didn’t happen; give the papers’ owner back the place to read them first. Fairness starts there."
      }
    }
  }
};
