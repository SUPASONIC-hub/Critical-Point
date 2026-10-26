/**
 * 사건 11 (src/nodes/case11.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c11_start": {
      "title": "Anonymous Source A",
      "text": "Your phone rings at six in the morning. A new story from the investigative outlet Leadline. The headline: “Why the Dissent Disappeared -- 3 Years of KD Bank Loan 2023-0412.” The 'anonymous dissent author, Source A' in the story is you. At nine, KD Financial Group’s PR office issues a statement. 'The review at the time followed the rules, and we are verifying the facts regarding the personal judgment of certain employees.' At noon, the National Assembly Policy Committee calls you. The occasion is the parliamentary audit. You are called as an unsworn witness. Han Seoyun turns her phone face down. 'My phone rang 40 times today. 39 of those calls were asking for your number.' For a while she has ended her sentences as if filing a report; today she is back to her old way of talking.",
      "memo": [
        "Leadline story: 410,000 views this morning alone",
        "Group PR statement: 'the personal judgment of certain employees'",
        "4 a.m., English email from top shareholder Kingsdale Partners (New York): 'Clean this up before the Asia portfolio review'",
        "5 days until you appear as a witness",
        "Managing Director Yoon Sanghyuk summoned as a sworn witness; expected to skip it, citing an overseas trip"
      ],
      "choices": {
        "c11_start_reporter": {
          "label": "Contact the reporter first to correct what’s wrong"
        },
        "c11_start_pr": {
          "label": "Get the PR office’s draft statement and read it first"
        },
        "c11_start_team": {
          "label": "Gather colleagues first and agree on what to say"
        },
        "reframe": {
          "label": "Ask how answers have been put off"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · News Screen",
      "clock": "Parliamentary audit in D-5",
      "question": "The dissent that vanished 3 years ago is now a story, and Source A is you. Who do you talk to first?",
      "lead": "Monday, six in the morning. On the news screen on the analyst room wall, one sentence you wrote is being quoted."
    },
    "c11_script": {
      "title": "Two Scripts",
      "text": "The 7th floor of the Members’ Office Building, a Policy Committee member’s office. Aide Cha Jiwon eats a rice-ball triangle standing up and holds out two A4 sheets. One is the office’s questioning script. Your answer is already written on the last line. 'Managing Director Yoon Sanghyuk directly ordered the deletion of the dissent.' The other is the 'witness answer reference material' the group PR office sent an hour ago. Its last line: 'The judgment at the time was an individual’s personal conviction, and there was no organizational pressure.' Cha Jiwon folds the wrapper in half. 'The member gets 7 minutes of questioning. A truth that doesn’t fit in 7 minutes doesn’t exist here.' Both scripts end with a sentence you cannot prove.",
      "memo": [
        "Office script: 'Yoon Sanghyuk directly ordered the deletion' -- no direct evidence",
        "PR material: 'no organizational pressure' -- not true",
        "7 minutes of questioning; witness answers average 40 seconds",
        "Both ask for a reply by 12 midnight tonight"
      ],
      "choices": {
        "c11_script_trim": {
          "label": "Take the office script but cut its unproven last line"
        },
        "c11_script_own": {
          "label": "Return both and write anew with only provable lines"
        },
        "c11_script_pr": {
          "label": "Skip the PR script; get a no-retaliation promise instead"
        },
        "reframe": {
          "label": "Ask how answers have been put off"
        },
        "c11_script_evidence_turn": {
          "label": "Pin down when the dissent was switched to purge"
        }
      },
      "place": "Members’ Office Building 7th Floor · Policy Committee Member’s Office",
      "clock": "Parliamentary audit in D-4",
      "question": "Both scripts end with a sentence you cannot prove. What do you take with you?",
      "lead": "Your first time in the Members’ Office Building. Every hallway is covered in fluorescent sticky notes."
    },
    "c11_rehearsal": {
      "title": "Mock Audit",
      "text": "A mock audit room is set up on the 2nd floor of the Hoegi-dong secondhand bookshop. The members’ bench is three apple crates; the witness stand is Lim Kyungsoo’s old reading stand. Na Junhyuk, who volunteered to play Yoon Sanghyuk, borrowed a navy suit two sizes too small, and the buttons won’t close. Kang Taemin, playing the member, ends every question with 'So who’s buying the cup noodles?', and Kwon Dohyun holds a stopwatch and shouts '41 seconds, too long' after every answer. Oh Jinwoo, playing a reporter, throws the nastiest questions and bursts out laughing before anyone else. Do Yoonha laughs out loud for the first time in 3 weeks. As the laughter dies down, Lee Minseo quietly raises his hand. 'But will my name come up too? My account is in the access log from that leak scare. I’m still on contract.'",
      "memo": [
        "12 mock questions -- answers average 41 seconds",
        "Na Junhyuk’s suit: 1 button lost",
        "Lee Minseo’s contract renewal review is next month",
        "Lee Minseo’s account remains in the access log of the leak scare"
      ],
      "choices": {
        "c11_rehearsal_truth": {
          "label": "Practice answering truthfully with Lee Minseo"
        },
        "c11_rehearsal_contract": {
          "label": "Demand Lee Minseo’s permanent post before you appear"
        },
        "c11_rehearsal_shield": {
          "label": "Block in advance any question that names Lee Minseo"
        },
        "reframe": {
          "label": "Ask how answers have been put off"
        },
        "c11_rehearsal_evidence_turn": {
          "label": "Pin down when the dissent was switched to purge"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 2nd Floor · Stacks of Ledgers",
      "clock": "Parliamentary audit in D-2",
      "question": "As the laughter fades, Lee Minseo asks whether his name will come up too. How do you answer?",
      "lead": "Three apple crates make the members’ bench. The witness stand is Lim Kyungsoo’s old reading stand."
    },
    "c11_sign": {
      "title": "The One Who Returned It",
      "text": "Han Seoyun calls you up to the Trigger Lab rooftop. The wind is strong, and her voice keeps breaking up. For a while she has ended her sentences as if filing a report; tonight she talks the old way. 'The person who returned your dissent 3 years ago was me. I signed it. That afternoon Managing Director Yoon called. He said if the dissent went up, the seven people on our team would be scattered. Three of those seven had babies that year.' She plays an audio file on her phone. It is that call, 3 years ago. 'If you submit this tomorrow, it proves you were right. And I’m finished. I only figured out today why I couldn’t delete this file for 3 years.'",
      "memo": [
        "Recording of the call 3 years ago -- Yoon Sanghyuk’s voice can be confirmed",
        "Content of the call: 'If the dissent goes up, the team is broken up'",
        "Han Seoyun: the one who signed the return",
        "If submitted, Han Seoyun could also face discipline and a criminal complaint"
      ],
      "choices": {
        "c11_sign_together": {
          "label": "Propose the dissenter and the returner speak together"
        },
        "c11_sign_ask": {
          "label": "Ask her to submit the recording with you tomorrow"
        },
        "c11_sign_spare": {
          "label": "Leave the recording; name Yoon on your testimony alone"
        },
        "reframe": {
          "label": "Ask how answers have been put off"
        },
        "c11_sign_evidence_turn": {
          "label": "Pin down when the dissent was switched to purge"
        }
      },
      "place": "Trigger Lab Rooftop",
      "clock": "Night before the hearing · 23:40",
      "question": "The person who signed the return holds out the recording of that call. What do you do with this file?",
      "lead": "The night before the hearing, Han Seoyun called you up to the rooftop. The wind is so strong that no one goes near the railing."
    },
    "c11_final": {
      "title": "7 Minutes",
      "text": "The chair behind the 'Yoon Sanghyuk' nameplate at the witness table is empty, and 12 cameras take turns shooting the empty chair and the witness stand. Oh Sangchul sits in the back row of the gallery, and Oh Jinwoo has sat down beside him. Three of the member’s 7 minutes have passed. The last question comes. 'Witness, why did that dissent disappear 3 years ago? Who deleted it?' From behind, Cha Jiwon slips you a note. '4 minutes left. Say a name and it’s page 1 tomorrow. Explain the system and it’s page 4.' Camera shutters pour down all at once.",
      "memo": [
        "4 minutes of questioning left",
        "Empty chair at the witness table: Yoon Sanghyuk",
        "Gallery: Oh Sangchul and Oh Jinwoo, 7 Trigger Lab colleagues",
        "Cha Jiwon’s note: a name is page 1, the system is page 4"
      ],
      "choices": {
        "c11_final_system": {
          "label": "Explain the system that erases dissent, not one name"
        },
        "c11_final_name": {
          "label": "Hold up the evidence and say Yoon Sanghyuk’s name"
        },
        "c11_final_people": {
          "label": "Start with the 1,740 and give the victims the time left"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "National Assembly Main Building · Policy Committee Room · Witness Stand",
      "clock": "4 of 7 minutes left",
      "question": "You have 4 minutes left on the question of who deleted the dissent. What do you say?",
      "lead": "Before you sat at the witness stand, you met the eyes of each of the seven Trigger Lab colleagues in the front row of the gallery."
    },
    "c11_aftershock": {
      "title": "A Street Stall in Yeouido",
      "text": "The night after the audit, at a street stall by the Yeouido Hangang Park. The video of your testimony ran on three evening newscasts, and at the end of the same table Oh Jinwoo and his father share fish-cake broth in silence. Kang Taemin buys tteokbokki instead of cup noodles for the first time. 'Tonight, let’s eat real food instead of cup noodles.' Na Junhyuk brings up his buttonless suit for the third time, and Do Yoonha laughs, cries, and laughs again. Then everyone’s phone rings at once. KD Financial Group, Group Strategy Office. Managing Director Yoon Sanghyuk flew back this afternoon, and he wants to see you tomorrow morning on the 33rd floor of headquarters.",
      "memo": [
        "Testimony video: 3.8 million views in one day",
        "Oh Jinwoo and his father at the same table for the first time in 2 years",
        "Managing Director Yoon Sanghyuk back in Korea this afternoon",
        "Meeting request, 33rd floor of headquarters: tomorrow 09:00"
      ],
      "choices": {
        "c11_after_summon": {
          "label": "Reply that you’ll take the 33rd-floor meeting now"
        },
        "c11_after_toast": {
          "label": "Turn your phone face down and eat with them to the end"
        },
        "c11_after_record": {
          "label": "Release the full transcript instead of the video"
        }
      },
      "place": "By Yeouido Hangang Park · Street Stall",
      "clock": "Audit day · 22:00",
      "question": "On a night when everyone is laughing, the 33rd floor calls you. How do you close this night?"
    },
    "c11_press": {
      "title": "23 Missed Calls",
      "text": "At ten at night, Leadline reporter Seo Harin tracks you down at the convenience store outside the Members’ Office Building. Your phone shows 23 missed calls from her. She pours hot water into two cups of noodles and slides one over. 'There’s one thing wrong in the story. The tipster said so, so I wrote that Source A is a woman. Should I fix it, or leave it? If I leave it, you can stay hidden a little longer.' The store clerk glances from one of you to the other, then quietly turns down the TV. The story is on the screen.",
      "memo": [
        "Source A’s gender is wrong in the story",
        "Leaving it delays tracing your identity by a few days",
        "Fixing it makes the story more credible and exposes you"
      ],
      "choices": {
        "c11_press_choice_1": {
          "label": "Ask her to fix the error and choose to be exposed"
        },
        "c11_press_choice_2": {
          "label": "Ask her to leave it only until the audit day"
        },
        "c11_press_choice_3": {
          "label": "Leave the story to her judgment and draw a line"
        }
      },
      "place": "Convenience Store outside the Members’ Office Building · Window Seat",
      "clock": "Parliamentary audit in D-4 · 22:00",
      "question": "The wrong story hides you a little longer. Do you fix it, or leave it?"
    },
    "c11_father": {
      "title": "One Gallery Pass",
      "text": "After the rehearsal, Oh Jinwoo stares at his phone on the stair landing for a long time. On the list of gallery pass applications for the audit is the name 'Oh Sangchul.' His father, who was pushed out of his branch long ago for delaying an approval by one day. Father and son have not spoken for 2 years, not even on holidays. 'I don’t know why he’s coming. To see that I was wrong, or to see that he was right.' He tries to smile, then stops.",
      "memo": [
        "Oh Sangchul on the gallery application list",
        "Oh Jinwoo and his father: no contact for 2 years",
        "Oh Sangchul: the former branch manager who delayed an approval by one day"
      ],
      "choices": {
        "c11_father_choice_2": {
          "label": "Move his gallery seat next to Oh Jinwoo"
        },
        "c11_father_choice_1": {
          "label": "Set up a dinner for the two the night before"
        },
        "c11_father_choice_3": {
          "label": "Let Oh Jinwoo decide about his father and don’t ask"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 2nd Floor · Stair Landing",
      "clock": "Parliamentary audit in D-2 · Night",
      "question": "Oh Jinwoo’s father is on the gallery application list. What do you do about it?"
    },
    "c11_eve": {
      "title": "6:40",
      "text": "6:40 in the morning on the day of the hearing, at the crosswalk in front of the National Assembly. Do Yoonha is there first, holding a thermos. Kang Taemin joins straight off the night shift, still in his reflective vest, and Na Junhyuk arrives in his suit with a new button sewn on and shows it to everyone. Do Yoonha’s hand shakes as he pours barley tea into paper cups. 'My name will come up today too. As the one who sold them. It’s fine. I’m the one who said that the most for 3 years.' The light changes, and no one crosses first.",
      "memo": [
        "3 hours before you appear",
        "Do Yoonha: may be named as the seller",
        "All 7 gallery applicants have arrived"
      ],
      "choices": {
        "c11_eve_choice_1": {
          "label": "Say you’ll answer first if Do Yoonha is named"
        },
        "c11_eve_choice_3": {
          "label": "Tell Do Yoonha it’s better he skips the gallery today"
        },
        "c11_eve_choice_2": {
          "label": "Agree to speak of the seller and the system apart"
        }
      },
      "place": "In Front of the National Assembly · Dawn Crosswalk",
      "clock": "3 hours before · 06:40",
      "question": "Today Do Yoonha’s name will come up as the seller. How do you take that name?"
    },
    "c11_press_reaction": {
      "title": "No. 3 Trending",
      "text": "ECHO brings up the last 48 hours of search data. 'KD Bank Source A' is the No. 3 trending search, and Do Yoonha’s name is among the related searches. A photo of his No. 1 sales award at the Gangseo Branch has spread, and of 1,200 comments, the most-liked line is 'Isn’t the seller an accomplice too?' 'For the two days no one knew who Source A was, people looked for a visible face instead.'",
      "memo": [
        "Do Yoonha in the related searches",
        "No. 1 most-liked comment: the seller is an accomplice too"
      ],
      "choices": {
        "c11_press_reaction_choice_1": {
          "label": "Tell Do Yoonha first and decide the response together"
        },
        "c11_press_reaction_choice_3": {
          "label": "Agree not to read comments and just prepare"
        },
        "c11_press_reaction_choice_2": {
          "label": "Check first which accounts spread the award photo"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "Parliamentary audit in D-3",
      "question": "The face exposed in your place is Do Yoonha’s. What do you do first?"
    },
    "c11_father_reaction": {
      "title": "The Day He Delayed",
      "text": "Oh Sangchul calls first. Oh Jinwoo turns on the speaker. A hoarse voice hesitates for a long time, then speaks. 'That one day I delayed it, I still think I did right. But I never once asked what it meant to you all this time.' Oh Jinwoo can’t answer and pushes the phone toward you. The call passes 1 minute, then 2.",
      "memo": [
        "First call between father and son in 2 years",
        "What he says he did right, and what he never asked"
      ],
      "choices": {
        "c11_father_reaction_choice_1": {
          "label": "Put the phone back in Oh Jinwoo’s hand"
        },
        "c11_father_reaction_choice_3": {
          "label": "Step away and leave the two of them alone"
        },
        "c11_father_reaction_choice_2": {
          "label": "Greet him yourself and say see you at the hearing"
        }
      },
      "place": "Alley in Front of the Hoegi-dong Secondhand Bookshop",
      "clock": "Parliamentary audit in D-2 · Night",
      "question": "For the first time in 2 years his father called first, and Oh Jinwoo can’t answer. What do you do?"
    },
    "c11_eve_reaction": {
      "title": "Notice of Absence",
      "text": "Yoon Sanghyuk’s notice of absence goes up on the National Assembly board. The reason: 'Attending an investor briefing in Singapore.' ECHO overlays one line. A notice from the briefing’s organizer. 'The event has been canceled due to the organizer’s circumstances.' The notice is dated three days ago. 'The notice was written on top of a schedule that no longer exists. When you say so decides the shape of the 7 minutes.'",
      "memo": [
        "A notice written on a schedule that no longer exists",
        "When in the 7 minutes to bring it up"
      ],
      "choices": {
        "c11_eve_reaction_choice_3": {
          "label": "Leave the notice alone and keep to your own story"
        },
        "c11_eve_reaction_choice_2": {
          "label": "Hand it to the member’s office so the member asks"
        },
        "c11_eve_reaction_choice_1": {
          "label": "Open minute 1 with the cancellation notice"
        }
      },
      "place": "National Assembly Main Building · Hallway",
      "clock": "1 hour before",
      "question": "The notice of absence was written on a schedule already canceled. When do you say so?"
    },
    "c11_branch_newsroom": {
      "title": "Evening in the Newsroom",
      "text": "Leadline’s newsroom is on the 3rd floor of a shopping building in Mangwon-dong. 11 reporters and one cat. Seo Harin turns her two monitors to show you the original tip. A watermarked printout of the dissent from 3 years ago, and on the back, one line in pencil. 'Returned -- Yoon. Don’t ask why.' The tipster didn’t give a name, but Seo Harin says she thinks she knows. 'Someone who would have kept this paper for 3 years. You know who, too. The one who runs a secondhand bookshop in Hoegi-dong.' The cat walks across the keyboard and types 'hahahaha' into the draft. Seo Harin laughs and doesn’t delete it. 'That’s the most honest sentence in this story.'",
      "memo": [
        "Original tip: watermarked printout of the dissent with a pencil note on the back",
        "Note: 'Returned -- Yoon. Don’t ask why.'",
        "Presumed tipster: Lim Kyungsoo",
        "KD’s legal team has announced a demand for a correction"
      ],
      "choices": {
        "c11_branch_newsroom_b": {
          "label": "Act as if you never saw the original and slip out"
        },
        "c11_branch_newsroom_a": {
          "label": "Help verify the original if the tipster is protected"
        },
        "c11_branch_newsroom_c": {
          "label": "Call Lim Kyungsoo first and ask if it can go public"
        }
      },
      "place": "Leadline Newsroom, Mangwon-dong",
      "clock": "Parliamentary audit in D-4 · 18:00",
      "question": "On the back of the dissent is a pencil note: 'Returned -- Yoon.' What do you do with this original?"
    },
    "c11_branch_newsroom_follow": {
      "title": "Demand for Correction",
      "text": "At eight in the evening, a demand for correction arrives from KD Financial Group’s legal team. It asks for one thing. Proof that the 'Yoon' in 'Returned -- Yoon' is Yoon Sanghyuk. Seo Harin reads the demand aloud, then stops. 'There is proof. A handwriting analysis. But if I submit it, who the tipster is comes out in court.' A bus passes outside the window. The cat has fallen asleep on the demand.",
      "memo": [
        "Deadline to answer the correction demand: the day before the audit",
        "Handwriting analysis: 'Yoon' likely matches Yoon Sanghyuk’s handwriting",
        "Submitting the analysis risks exposing the tipster",
        "Seo Harin: pulling the story is not an option"
      ],
      "choices": {
        "c11_branch_newsroom_follow_b": {
          "label": "Instead of the analysis, state the note on the stand"
        },
        "c11_branch_newsroom_follow_a": {
          "label": "Submit the analysis; keep the tipster’s name hidden"
        },
        "c11_branch_newsroom_follow_c": {
          "label": "Stall to the deadline and push it past the audit"
        }
      },
      "place": "Leadline Newsroom, Mangwon-dong",
      "clock": "Parliamentary audit in D-4 · 20:00",
      "question": "Producing the proof exposes the tipster. How do you answer the correction demand?"
    },
    "c11_route_system": {
      "title": "We’ll Look Into It",
      "text": "You ask how answers have been put off at the parliamentary audit. ECHO goes through the Policy Committee’s records for the past 10 years. 1,812 audit transcripts open. Financial company witnesses were asked 7,430 questions, and the most common answer, given 2,114 times, is 'We’ll look into it.' Of those promises, results were actually reported at the next year’s audit 3% of the time. 'This room has learned to be a place not for asking the truth, but for choosing sentences that can be put off for 1 year.'",
      "memo": [
        "1,812 transcripts over the past 10 years",
        "'We’ll look into it' 2,114 times -- follow-up reported 3%",
        "This statistic has never been cited in any report"
      ],
      "choices": {
        "c11_route_system_pledge": {
          "label": "Never say 'We’ll look into it' in your answers"
        },
        "c11_route_system_publish": {
          "label": "Give the numbers to Leadline’s Seo Harin for a story"
        },
        "c11_route_system_drop": {
          "label": "Bury the numbers and follow the prepared answers"
        },
        "c11_route_system_evidence_turn": {
          "label": "Pin down when the dissent was switched to purge"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "Parliamentary audit in D-1",
      "question": "The most common answer in this room was 'We’ll look into it.' What do you do with this statistic?"
    },
    "c11_final_system_route": {
      "title": "One Thing Not Put Off",
      "text": "Dawn on the day of the hearing. The numbers on the test terminal have not changed by a single line overnight. The most common answer was 'We’ll look into it,' and results were reported the next year 3% of the time. ECHO brings up the last line. 'The answer time you’ll get today averages 40 seconds. Of the words that fit in it, how many won’t roll over to next year?'",
      "memo": [
        "'We’ll look into it' 2,114 times -- follow-up reported 3%",
        "Witness answers average 40 seconds",
        "A few hours until you appear"
      ],
      "choices": {
        "c11_final_system_route_b": {
          "label": "Pass on the question; leave the numbers on record"
        },
        "c11_final_system_route_c": {
          "label": "Promise to come back yourself to next year’s audit"
        },
        "c11_final_system_route_a": {
          "label": "Attach a check deadline and report date to each answer"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "Audit day · Dawn",
      "question": "In a room for choosing sentences that can be put off, what will you not put off?"
    },
    "c11_evidence_turn": {
      "title": "5 Hours 12 Minutes",
      "text": "When you fit the clues together, the change log of the approval system from 3 years ago opens. Han Seoyun’s return signature is at 1:32 p.m. But the dissent was switched from 'retain' to 'purge' at 6:44 p.m., and the account that switched it belonged to Yoon Sanghyuk, then head of the Corporate Finance Strategy Team. The one who returned it and the one who erased it were different people. Ban Jaewook writes the two times side by side in his notebook. '5 hours 12 minutes. Who decided what in between -- that is this case.'",
      "memo": [
        "Return signature 13:32 -- Han Seoyun",
        "Purge 18:44 -- Yoon Sanghyuk’s account",
        "Purge reason field: blank"
      ],
      "choices": {
        "c11_evidence_turn_hold": {
          "label": "Hold the record and reveal it yourself on the stand"
        },
        "c11_evidence_turn_share": {
          "label": "Show Han Seoyun first and leave the choice to her"
        },
        "c11_evidence_turn_submit": {
          "label": "Give the two-times record to the office and the press"
        }
      },
      "place": "Trigger Lab Archive B2 · Approval Records",
      "clock": "Audit day · 07:00",
      "question": "The one who returned it and the one who erased it were different. How do you use these two times?"
    },
    "c11_start_rest": {
      "title": "A Story for the One Who Turned Off the Lights",
      "text": "For 3 weeks since that weekend the 4th-floor lights went off on time, the duty roster has kept running, slowly but without stopping. Then, at six on Monday morning, a story goes up on Leadline. It covers the dissent that vanished 3 years ago, and the 'anonymous author, Source A' in the story is you. At nine the group PR office issued a statement about 'the personal judgment of certain employees,' and at noon the National Assembly called you to the parliamentary audit. You are called as an unsworn witness. Managing Director Yoon Sanghyuk, summoned as a sworn witness, says he will not come, citing an overseas trip. People who have rested have the strength to get through this week. The question is whose name that strength goes under.",
      "memo": [
        "Duty roster: 102 cases handled in 3 weeks",
        "Leadline story: anonymous dissent author, Source A",
        "5 days until you appear"
      ],
      "choices": {
        "c11_start_rest_reporter": {
          "label": "Contact the reporter first to correct what’s wrong"
        },
        "c11_start_rest_pr": {
          "label": "Get the PR office’s draft statement and read it first"
        },
        "c11_start_rest_team": {
          "label": "Gather colleagues first and agree on what to say"
        },
        "c11_start_rest_signature": {
          "label": "Split the hearing prep among the roster’s six too"
        },
        "c11_start_rest_reframe": {
          "label": "Ask how answers have been put off"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · News Screen",
      "clock": "Parliamentary audit in D-5",
      "question": "The six who rested have the strength to get through this week. Whose name do you put that strength under?",
      "lead": "An office where the duty roster has run for 3 weeks. This morning everyone is reading the same story."
    },
    "c11_start_record": {
      "title": "A Story for the One Who Left a Policy",
      "text": "3 weeks after the duty roster was filed as a group policy proposal, the group PR office put it in a press release as a 'model case of proactive victim relief.' Before dawn that same day, the Leadline story went up. It covers the dissent that vanished 3 years ago, and the 'anonymous author, Source A' in the story is you. At nine the PR office issued a statement about 'the personal judgment of certain employees,' and at noon the National Assembly called you to the parliamentary audit. You are called as an unsworn witness. Managing Director Yoon Sanghyuk, summoned as a sworn witness, says he will not come, citing an overseas trip. The policy you made is now the group’s grounds for refuting you.",
      "memo": [
        "Group press release: cites the duty roster as a model case",
        "Leadline story: anonymous dissent author, Source A",
        "5 days until you appear"
      ],
      "choices": {
        "c11_start_record_reporter": {
          "label": "Contact the reporter first to correct what’s wrong"
        },
        "c11_start_record_pr": {
          "label": "Get the PR office’s draft statement and read it first"
        },
        "c11_start_record_signature": {
          "label": "Send the reporter the full policy text the release cut"
        },
        "c11_start_record_team": {
          "label": "Gather colleagues first and agree on what to say"
        },
        "c11_start_record_reframe": {
          "label": "Ask how answers have been put off"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · News Screen",
      "clock": "Parliamentary audit in D-5",
      "question": "The policy you made has been used as the group’s model case. How do you take it back?",
      "lead": "The group press release and the Leadline story went up side by side the same morning."
    },
    "c11_start_keep": {
      "title": "A Story for the One Who Kept the Drawer Open",
      "text": "The list of 212 names is still in your drawer. At six in the morning a story about the dissent that vanished 3 years ago went up on Leadline, and the 'anonymous author, Source A' in the story is you. At nine the group PR office issued a statement about 'the personal judgment of certain employees,' and at noon the National Assembly called you to the parliamentary audit. You are called as an unsworn witness. Managing Director Yoon Sanghyuk, summoned as a sworn witness, says he will not come, citing an overseas trip. That afternoon, the group legal team announces it will investigate 'employees who kept unofficial lists.' The list in your drawer could now become evidence aimed at you.",
      "memo": [
        "Legal team notice: investigation of employees holding unofficial lists",
        "List of 212 kept privately",
        "5 days until you appear"
      ],
      "choices": {
        "c11_start_keep_reporter": {
          "label": "Contact the reporter first to correct what’s wrong"
        },
        "c11_start_keep_team": {
          "label": "Gather colleagues first and agree on what to say"
        },
        "c11_start_keep_signature": {
          "label": "Give the 212-name list back to Do Yoonha first"
        },
        "c11_start_keep_pr": {
          "label": "Get the PR office’s draft statement and read it first"
        },
        "c11_start_keep_reframe": {
          "label": "Ask how answers have been put off"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · News Screen",
      "clock": "Parliamentary audit in D-5",
      "question": "The legal team will investigate employees holding unofficial lists. What do you do with the 212 in your drawer?",
      "lead": "On the afternoon the story broke, the legal team’s notice landed in every employee’s inbox."
    }
  },
  "echoReplies": {
    "c11_start_reporter": "Leadline’s main line is busy all day, so all you can leave is a message. The day the reporter answers it, the fact that Source A reached out first spreads too.",
    "c11_start_pr": "Reading the draft, you know in advance whom the group will turn into a personal lapse. The record that you read it stays with the group.",
    "c11_start_team": "Deciding together makes the five days bearable. A sentence six people agreed on has to be rewritten if any one of them drops out.",
    "c11_script_own": "Keeping only provable sentences makes the 7 minutes shorter. Short answers don’t get edited.",
    "c11_script_trim": "With the last line cut, the office has to change its question. Where the new question goes is not yours to decide.",
    "c11_script_pr": "You got the promise. It came by phone, not in writing, and you will read a sentence on air that isn’t true.",
    "c11_rehearsal_shield": "With it blocked, Lee Minseo isn’t named in that room. Instead the question comes on another day, in another room.",
    "c11_rehearsal_truth": "A rehearsed answer doesn’t shake. A name that comes out truthfully also goes into the contract renewal file.",
    "c11_rehearsal_contract": "The demand becomes a negotiation. The moment it hits the table, Lee Minseo’s permanent post can read as the price of your testimony.",
    "c11_sign_ask": "When the recording goes out, it proves you were right. Han Seoyun stands before the disciplinary committee with that proof.",
    "c11_sign_spare": "Going without the recording, Han Seoyun stays. Yoon Sanghyuk can answer you with 'I don’t recall.'",
    "c11_sign_together": "Standing together, the dissent and the return become one sentence. That sentence exposes both of you.",
    "c11_final_name": "The name makes page 1 tomorrow. From the next day, a name on page 1 answers through its lawyer.",
    "c11_final_system": "The system runs on page 4. The people who read page 4 to the end are the ones who work inside that system.",
    "c11_final_people": "Starting with the number, the room goes quiet. The broadcast airs only 3 seconds of that silence.",
    "c11_after_toast": "The phones face down ring all night. No one turns them over. The tteokbokki is gone before it cools.",
    "c11_after_record": "The transcript isn’t cut. The 12 seconds you stumbled and the one sentence the group will quote both stay in.",
    "c11_after_summon": "Answering at once makes you look in control. The 33rd floor first records how fast you come.",
    "c11_press_choice_1": "The corrected story is stronger. From the day the correction runs, cameras come to your door too.",
    "c11_press_choice_2": "You can hide for five days. On the day you appear, you show up as the person in a wrong story.",
    "c11_press_choice_3": "With a line drawn, the reporter writes freely. What the next story gets wrong is not yours to choose.",
    "c11_father_choice_1": "You book it for the evening before the hearing. Whether the two of them will really sit at that table, no one knows yet.",
    "c11_father_choice_2": "A seat side by side doesn’t force words. It just has them face the same way for 7 minutes.",
    "c11_father_choice_3": "When you don’t ask, Oh Jinwoo decides alone. He always has, and so he has always been a beat late.",
    "c11_eve_choice_1": "When you take it first, Do Yoonha doesn’t hear the question directly. Your 40 seconds of answer go there instead.",
    "c11_eve_choice_2": "Splitting it makes the sentence longer. Long sentences get cut on air.",
    "c11_eve_choice_3": "When he doesn’t come, he is safe. The record also shows that the one who counted for 3 years wasn’t in that room.",
    "c11_press_reaction_choice_1": "News heard first hurts less. That night Do Yoonha leaves his phone on and reads the comments to the end.",
    "c11_press_reaction_choice_2": "Following the accounts leads to the name of the group’s PR agency. Confirming it takes a day.",
    "c11_press_reaction_choice_3": "The preparation gets done. Do Yoonha reads those comments alone.",
    "c11_father_reaction_choice_1": "With the phone in his hand, he has to speak. His first words are 'Have you eaten?'",
    "c11_father_reaction_choice_2": "With you greeting him instead, the call ends gently. What Oh Jinwoo meant to say is put off until the hearing.",
    "c11_father_reaction_choice_3": "When you step away, only Oh Jinwoo is left on the landing. The call goes on for 11 minutes.",
    "c11_eve_reaction_choice_1": "Bringing it up in minute 1 changes the air in the room. The remaining 6 minutes all go to that empty chair.",
    "c11_eve_reaction_choice_2": "When the member asks, it carries weight. Whose credit the question becomes, the member’s office decides.",
    "c11_eve_reaction_choice_3": "Your story stays whole. The canceled schedule shows up only as one line in the next day’s news.",
    "c11_branch_newsroom_a": "With the original verified, the story holds up even in court. Protecting the tipster becomes a promise Seo Harin has to keep.",
    "c11_branch_newsroom_b": "Acting as if you never saw it keeps you safe. The reporter is left to protect that one pencil line alone.",
    "c11_branch_newsroom_c": "Asking first lets Lim Kyungsoo choose. On the other end, he laughs for a long time, then says, 'Finally someone asks.'",
    "c11_branch_newsroom_follow_a": "When the analysis goes in, 'Yoon' becomes Yoon Sanghyuk. The tipster whose name you hid becomes someone the court wants to know.",
    "c11_branch_newsroom_follow_b": "When you say it, the tipster stays hidden. Instead you carry the weight of that note alone on the stand.",
    "c11_branch_newsroom_follow_c": "Stalling keeps tonight quiet. The lapsed demand comes out first, as a story the morning after the audit.",
    "c11_route_system_publish": "Handed over, the story runs before you appear. The members read their own room’s statistics in the news before they walk in.",
    "c11_route_system_pledge": "Refusing the phrase means saying you don’t know when you don’t. In a 40-second answer, that sounds longer than you think.",
    "c11_route_system_drop": "Following the template, your answers are smooth. The transcript gets one more 'We’ll look into it.'",
    "c11_final_system_route_a": "With dates attached, the promises stay in the transcript with deadlines. The first person to get a call that day is you.",
    "c11_final_system_route_b": "The question passes. The numbers go in an appendix, and the one who opens it is likely an aide preparing next year’s audit.",
    "c11_final_system_route_c": "When you promise, the room goes quiet for a moment. A witness saying they will come back on their own is hard to find in that room’s transcripts.",
    "c11_evidence_turn_submit": "Handing it to both at once, neither side can bury it first. The empty time between the two stamps becomes the first question tomorrow.",
    "c11_evidence_turn_hold": "Revealed on the stand, the paper is shot by 12 cameras. Until then, Han Seoyun remains the one who thinks she erased it.",
    "c11_evidence_turn_share": "Shown first, Han Seoyun looks at the two times for a long time. She learns for the first time that what she believed for 3 years she erased went only as far as the return.",
    "c11_script_evidence_turn": "Calling up the change log shows that the hand that returned it and the hand that erased it were not the same.",
    "c11_rehearsal_evidence_turn": "Calling up the change log shows that the hand that returned it and the hand that erased it were not the same.",
    "c11_sign_evidence_turn": "Calling up the change log shows that the hand that returned it and the hand that erased it were not the same.",
    "c11_route_system_evidence_turn": "Calling up the change log shows that the hand that returned it and the hand that erased it were not the same.",
    "case11_memory_system": "Compared side by side, the group statement rewrote your judgment as 'personal judgment.' The method of choosing sentences that can be put off is inside it.",
    "case11_memory_evidence": "Look up that department and the change log of the approval system from 3 years ago opens. One more time stamp sits between the return and the purge.",
    "c11_start_rest_reporter": "Leadline’s main line is busy all day, so all you can leave is a message. The day the reporter answers it, the fact that Source A reached out first spreads too.",
    "c11_start_rest_pr": "Reading the draft, you know in advance whom the group will turn into a personal lapse. The record that you read it stays with the group.",
    "c11_start_rest_team": "Deciding together makes the five days bearable. A sentence six people agreed on has to be rewritten if any one of them drops out.",
    "c11_start_rest_signature": "Splitting it up makes the five days bearable. Once the prepared answers are six people’s sentences, whose words they are may blur.",
    "c11_start_record_reporter": "Leadline’s main line is busy all day, so all you can leave is a message. The day the reporter answers it, the fact that Source A reached out first spreads too.",
    "c11_start_record_pr": "Reading the draft, you know in advance whom the group will turn into a personal lapse. The record that you read it stays with the group.",
    "c11_start_record_team": "Deciding together makes the five days bearable. A sentence six people agreed on has to be rewritten if any one of them drops out.",
    "c11_start_record_signature": "Once the full text is out, the words “model case” lose their force. The group checks again who wrote that policy proposal.",
    "c11_start_keep_reporter": "Leadline’s main line is busy all day, so all you can leave is a message. The day the reporter answers it, the fact that Source A reached out first spreads too.",
    "c11_start_keep_pr": "Reading the draft, you know in advance whom the group will turn into a personal lapse. The record that you read it stays with the group.",
    "c11_start_keep_team": "Deciding together makes the five days bearable. A sentence six people agreed on has to be rewritten if any one of them drops out.",
    "c11_start_keep_signature": "Once it’s returned, your drawer is empty, and the investigation finds an empty drawer. The weight of that list goes back to one person."
  },
  "choiceVoiceLines": {
    "c11_start_reporter": "Saying anything wrong in the story comes first, you reach out to the reporter.",
    "c11_start_pr": "Saying you want to see what the other side means to say, you get the PR office’s draft statement and read it.",
    "c11_start_team": "Saying this is not a place to go alone, you gather your colleagues first and decide together what to say.",
    "c11_script_own": "Since both end with sentences no one can prove, you return both scripts and write anew with only provable sentences.",
    "c11_script_trim": "Since a direct order can’t be proven, you take the office script but cut only its unproven last line.",
    "c11_script_pr": "Since the office’s sentence can’t be proven either, instead of following the PR material you get a promise of no retaliation against your colleagues.",
    "c11_rehearsal_shield": "So that someone still on contract isn’t named in that room, you block in advance the answers to any question that names Lee Minseo.",
    "c11_rehearsal_truth": "Saying the access log is there anyway and hiding will only hurt more, you practice answering truthfully with Lee Minseo.",
    "c11_rehearsal_contract": "So his name doesn’t hang over next month’s renewal review, you demand Lee Minseo’s permanent post before you appear.",
    "c11_sign_ask": "Since Yoon Sanghyuk’s voice is on the call as it was, you ask Han Seoyun to submit the recording with you tomorrow.",
    "c11_sign_spare": "Telling her to keep the recording, you say you will name Yoon Sanghyuk on your testimony alone.",
    "c11_sign_together": "Not wanting only one person to be finished, you propose that the one who dissented and the one who returned it appear and speak together.",
    "c11_final_name": "Since the question of who erased it calls for a name, you hold up the evidence and say Yoon Sanghyuk’s name.",
    "c11_final_system": "Saying that if it ends with one name it will vanish again next time, you describe the system that erases dissent instead of one person’s name.",
    "c11_final_people": "Saying neither the name nor the system, but the people who lost, come first, you start with the number 1,740 and give the victims the time left.",
    "c11_after_toast": "Since the meeting is at nine tomorrow morning, you turn your phone face down tonight and eat with everyone to the end.",
    "c11_after_record": "Saying it all has to be kept, not a cut video, you release the full transcript.",
    "c11_after_summon": "Saying there is no reason to wait, you reply that you will take the 33rd-floor meeting right now.",
    "c11_press_choice_1": "Since you can’t appear hiding behind a wrong story, you ask her to fix the error and choose to be exposed.",
    "c11_press_choice_2": "To delay tracing your identity even a few days, you ask her to leave it as it is only until the audit day.",
    "c11_press_choice_3": "Since a witness can’t dictate the story’s sentences, you leave its content to the reporter’s judgment and draw a line.",
    "c11_father_choice_1": "So Oh Jinwoo can ask his father himself why he is coming, you set up a dinner for the two of them the night before the hearing.",
    "c11_father_choice_2": "So that a father and son who haven’t spoken in 2 years at least sit side by side, you move the gallery seat next to Oh Jinwoo.",
    "c11_father_choice_3": "Since no outsider can step into 2 years of silence, you let Oh Jinwoo decide about his father and don’t ask.",
    "c11_eve_choice_1": "Saying you won’t leave him to hear it alone, you tell him that if Do Yoonha’s name comes up, you will take it and answer first.",
    "c11_eve_choice_2": "So no one person takes all of it, you agree to speak separately of the one who sold and the system that made them sell.",
    "c11_eve_choice_3": "So he doesn’t hear himself called the seller in that room, you tell Do Yoonha it would be better if he skipped the gallery today.",
    "c11_press_reaction_choice_1": "Saying Do Yoonha should know first, you tell him and decide the response together.",
    "c11_press_reaction_choice_2": "To see where the award photo spread from, you check those accounts first.",
    "c11_press_reaction_choice_3": "Saying you can’t answer 1,200 comments, you agree not to read them and focus only on preparing.",
    "c11_father_reaction_choice_1": "Saying this answer can’t be given for him, you put the phone back in Oh Jinwoo’s hand.",
    "c11_father_reaction_choice_2": "Since Oh Jinwoo can’t answer and pushes the phone to you, you greet his father yourself and say you will see him at the hearing.",
    "c11_father_reaction_choice_3": "Since there is no room for an outsider between father and son, you step away and leave the two of them alone.",
    "c11_eve_reaction_choice_1": "Saying the first thing to tell is why the chair is empty, you open minute 1 of questioning with the cancellation notice.",
    "c11_eve_reaction_choice_2": "Since the fact is too big for your 40 seconds, you hand the cancellation notice to the member’s office first so the member asks.",
    "c11_eve_reaction_choice_3": "Saying the 7 minutes can’t be spent on someone who isn’t there, you leave the notice alone and keep to your own story.",
    "c11_branch_newsroom_a": "On the condition that the tipster is protected, you agree to help verify the original.",
    "c11_branch_newsroom_b": "Saying you will act as if you never saw the original, you quietly leave the newsroom.",
    "c11_branch_newsroom_c": "Saying going public is for the tipster to decide, you call Lim Kyungsoo first.",
    "c11_branch_newsroom_follow_a": "Since the demand asks for proof that 'Yoon' is Yoon Sanghyuk, you submit the handwriting analysis and keep the tipster’s name hidden to the end.",
    "c11_branch_newsroom_follow_b": "Instead of the analysis, you say you will state that note yourself on the witness stand.",
    "c11_branch_newsroom_follow_c": "Since you can’t expose the tipster just before the hearing, you stall until the deadline and push the response past the audit.",
    "c11_route_system_publish": "Saying a number never cited is a number that doesn’t exist, you hand the statistics to Leadline reporter Seo Harin for a story.",
    "c11_route_system_pledge": "So as not to add one more to the 2,114, you decide never to say 'We’ll look into it' in your own answers.",
    "c11_route_system_drop": "Saying this is not the place to fight the whole room, you bury the numbers and follow the prepared answer template.",
    "c11_final_system_route_a": "To make sentences that can’t be put off, you attach a check deadline and a report date to every answer.",
    "c11_final_system_route_b": "Saying 40 seconds can’t hold it all, you pass on the question and leave the numbers only in the record.",
    "c11_final_system_route_c": "Saying someone has to bring back the results, you promise to come back yourself to next year’s audit.",
    "c11_evidence_turn_submit": "So neither side can bury it, you hand the record with the two times side by side to the member’s office and the press at once.",
    "c11_evidence_turn_hold": "Saying a leak gives them time to explain, you hold the record and reveal it yourself on the witness stand.",
    "c11_evidence_turn_share": "Saying she should be the first to know the return and the purge were different, you show Han Seoyun first and let her choose what to do.",
    "c11_script_evidence_turn": "Calling up the approval system’s change log from 3 years ago as a clue, you pin down when the dissent’s status changed.",
    "c11_rehearsal_evidence_turn": "Calling up the approval system’s change log from 3 years ago as a clue, you pin down when the dissent’s status changed.",
    "c11_sign_evidence_turn": "Calling up the approval system’s change log from 3 years ago as a clue, you pin down when the dissent’s status changed.",
    "c11_route_system_evidence_turn": "Calling up the approval system’s change log from 3 years ago as a clue, you pin down when the dissent’s status changed.",
    "c11_start_rest_reporter": "Saying anything wrong in the story comes first, you reach out to the reporter.",
    "c11_start_rest_pr": "Saying you want to see what the other side means to say, you get the PR office’s draft statement and read it.",
    "c11_start_rest_team": "Saying this is not a place to go alone, you gather your colleagues first and decide together what to say.",
    "c11_start_rest_signature": "Like the duty roster, you propose the six split the hearing preparation into fields too.",
    "c11_start_record_reporter": "Saying anything wrong in the story comes first, you reach out to the reporter.",
    "c11_start_record_pr": "Saying you want to see what the other side means to say, you get the PR office’s draft statement and read it.",
    "c11_start_record_team": "Saying this is not a place to go alone, you gather your colleagues first and decide together what to say.",
    "c11_start_record_signature": "Since the group used the policy proposal as grounds to refute you, you send the reporter the full text the press release cut.",
    "c11_start_keep_reporter": "Saying anything wrong in the story comes first, you reach out to the reporter.",
    "c11_start_keep_pr": "Saying you want to see what the other side means to say, you get the PR office’s draft statement and read it.",
    "c11_start_keep_team": "Saying this is not a place to go alone, you gather your colleagues first and decide together what to say.",
    "c11_start_keep_signature": "Since the list could become evidence aimed at you, you give the 212-name list in your drawer back to Do Yoonha before the investigation."
  },
  "pack": {
    "clue": {
      "title": "5 Hours 12 Minutes",
      "text": "The return was signed at 13:32 and the purge processed at 18:44. The one who returned it and the one who erased the dissent were not the same person."
    },
    "outcomes": {
      "c11_after_toast": {
        "tag": "Ate Together",
        "title": "The phones rang all night and no one turned them over",
        "text": "That night, for the first time, the six laughed at the same table to the end. The 33rd floor’s summons had to wait until the next morning."
      },
      "c11_after_record": {
        "tag": "Left on Record",
        "title": "The uncut 7 minutes became a document anyone can read",
        "text": "The full transcript was released. The 12 seconds you stumbled and the one sentence the group will quote both stayed in."
      },
      "c11_after_summon": {
        "tag": "Answered at Once",
        "title": "You left the street stall first and headed for the 33rd floor",
        "text": "You were the first to answer the summons. On the table were left a plate of tteokbokki and your empty chair."
      }
    },
    "continuityChallenges": {
      "c10_after_rest": {
        "title": "Speak with the Ones Who Rested",
        "text": "The six have the strength to get through this week. You have to find the choice that uses it not as one person’s testimony, but as six people’s sentences."
      },
      "c10_after_record": {
        "title": "Take Back the Policy They Took",
        "text": "The policy you made became the group’s model case. Reframe the table around whose policy it is, and a hidden clue may open."
      },
      "c10_after_keep": {
        "title": "Make the Drawer List Something to Stand Behind",
        "text": "The investigation is aimed at the drawer. You have to find the choice that turns the 212 names from a record you hid into a record you protected."
      }
    }
  }
};
