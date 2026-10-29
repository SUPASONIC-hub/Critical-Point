/**
 * 사건 40 (src/nodes/case40.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c40_start": {
      "title": "41 Points",
      "text": "On the screen is a rejection notice for a weekend part-time job at Levain House, a bakery café, Mangwon branch. 'The applicant’s organizational fit score is 41, below the interview threshold of 60.' The shop called it an 'AI interview,' but not a single person appeared. When he applied, a link came for a 12-minute game-style aptitude test, and a week later, last night, this text arrived. 'College application fees are 380,000 won. I wanted to earn it without telling Mom. But they won’t tell me what doesn’t fit.' Then a message comes from Lee Minseo. The company that made the test is FitScore. The very company that bought Trigger Lab’s response records. It is also the subject of the 6 minutes of Part 5 of the documentary that the advertisers’ 'reference opinion' wanted cut.",
      "memo": [
        "Levain House Mangwon, weekend part-time job -- 41 points, threshold 60",
        "'AI interview' 12 minutes, human interview 0 minutes",
        "Test company: FitScore -- buyer of Trigger Lab’s response records",
        "Moon Hajun’s goal: 380,000 won in college application fees"
      ],
      "choices": {
        "c40_start_visit": {
          "label": "Go with Moon Hajun to see the shop’s manager first"
        },
        "c40_start_claim": {
          "label": "First demand the basis for the score on the notice"
        },
        "c40_start_post": {
          "label": "Screenshot the rejection text and post it online tonight"
        },
        "reframe": {
          "label": "Look into who was rejected"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market",
      "clock": "Saturday after the broadcast · Heat wave warning 14:00",
      "question": "Moon Hajun, in his 3rd year of high school, was rejected with 41 points and no interview. What do you do first?",
      "lead": "The day after the documentary aired, a Saturday afternoon on the third day of the heat wave warning, Moon Hajun holds out his phone in front of the fan at the Gaeul Rice Cake Shop."
    },
    "c40_demo": {
      "title": "A 12-Minute Game",
      "text": "A glass-walled meeting room. CEO Hong Yedam keeps time with the tip of her white sneaker and holds out a tablet. 'If you have doubts, try it yourself.' Kang Taemin, who set up 180 chairs alone in this building’s briefing hall three months ago, sits down first. 12 minutes later the result appears. 41 points, lacks leadership, collaboration index in the bottom 8%. Because in the team task he carried his teammate avatars’ loads all by himself. 'It’s faster if I carry it myself.' The room laughs at Kang Taemin’s remark, and Hong Yedam laughs too, then turns serious. 'I failed 21 interviews. Because of my Busan accent, because my smile looked awkward. Numbers don’t know accents.' She turns the pages of the algorithm documentation. Her hand stops at the training data source field. 'Provided by: KD Data Lab.' Her face says she does not know whose records those are.",
      "memo": [
        "138 companies use FitScore -- 62,000 test takers this year",
        "9,412 automatically rejected under 60 points",
        "Kang Taemin: 41 points, 'lacks leadership · tends to carry loads alone'",
        "Training data provided by: KD Data Lab"
      ],
      "choices": {
        "c40_demo_rehear": {
          "label": "Ask that Moon Hajun get a human interview instead"
        },
        "c40_demo_film": {
          "label": "Film Kang Taemin’s result and use it in the PR fight first"
        },
        "c40_demo_source": {
          "label": "First ask whose records the training data are"
        },
        "reframe": {
          "label": "Look into who was rejected"
        },
        "c40_demo_evidence_turn": {
          "label": "Open FitScore’s 4 billion approval"
        }
      },
      "place": "Seongsu-dong · FitScore · Demo Room",
      "clock": "Monday, 3rd week of August · Heat wave 11:00",
      "question": "The CEO shows you a fairness built from 21 failed interviews. How do you handle that score?",
      "lead": "Levain House headquarters said to ask FitScore about anything to do with the score, and FitScore’s CEO called you to Seongsu-dong to show you a demo herself."
    },
    "c40_anchor": {
      "title": "Similarity 0.83",
      "text": "The model has one 'unfit reference profile.' The more an applicant’s responses resemble this profile, the lower the score. When Ryu Seah traces the profile’s source number, a code comes up. Analyst A. The code the whole country read in the leak at the end of July: you. 3 years of response records, down to the time you wrote the 2023 dissent. Ryu Seah puts Moon Hajun’s test result beside it. The similarity between the two records is 0.83. Hajun paused 7 seconds on the item 'an order to recommend a product that hurts the customer,' and 3 years ago you paused 9 seconds on an item of the same shape. Ryu Seah lowers her voice. 'Hajun failed because he resembles you.' The data subject of this record is you, and no one ever asked you.",
      "memo": [
        "Unfit reference profile: Analyst A -- 3 years of your records",
        "Similarity with Moon Hajun 0.83",
        "Hajun 7 seconds, you 9 seconds -- an order item of the same shape",
        "Consent to use the records: never obtained"
      ],
      "choices": {
        "c40_anchor_hide": {
          "label": "Hide that it’s my record; use it quietly as evidence"
        },
        "c40_anchor_tell": {
          "label": "Tell Moon Hajun myself, first, that it was my record"
        },
        "c40_anchor_claim": {
          "label": "File an official request to see and delete my records"
        },
        "reframe": {
          "label": "Look into who was rejected"
        },
        "c40_anchor_evidence_turn": {
          "label": "Open FitScore’s 4 billion approval"
        }
      },
      "place": "KD Data Lab, Pangyo · Data Center",
      "clock": "Tuesday, 3rd week of August · 02:10",
      "question": "The reference point that failed Hajun was your record. What do you do with this fact?",
      "lead": "At 2 a.m., Ryu Seah calls you deep into the data center, saying she has found the record the model uses as its yardstick when it gives a low score."
    },
    "c40_steam": {
      "title": "A Retest at the Rice Cake Shop",
      "text": "Steam from the steamer scatters in the fan’s wind. Moon Gaeul does not offer Hong Yedam any rice cake. Instead she holds out her phone. 'Take your company’s test here, once.' Hong Yedam smiles and sits down. At the 9th minute, her finger stops on an item asking 'whether to tell the customer a fact that hurts them.' Much later the result appears. 44 points. The shop goes quiet. Kang Taemin speaks first. 'That’s 3 points higher than me and Hajun. Comrades in lacking leadership.' Someone laughs, and Hong Yedam laughs along, then bites her lip. 'I failed my own company’s test. That’s my 22nd.' Moon Gaeul watches her for a long while, then sets a slightly burnt piece of injeolmi in front of her. 'That one’s not for sale. Eat.' Holding the injeolmi, Hong Yedam asks. 'Then what did I believe in when I built this company?'",
      "memo": [
        "Hong Yedam took it herself: 44 points -- fails her own company’s threshold",
        "Item she stopped on: whether to tell the customer a fact that hurts them",
        "42 FitScore employees; KD hiring contract pending next week",
        "What Moon Gaeul served: burnt injeolmi she doesn’t sell"
      ],
      "choices": {
        "c40_steam_deal": {
          "label": "Let the service go on if only KD’s records are removed"
        },
        "c40_steam_persuade": {
          "label": "Persuade Hong Yedam, person to person, to stop it together"
        },
        "c40_steam_audit": {
          "label": "Get an outside expert review of the model in writing"
        },
        "reframe": {
          "label": "Look into who was rejected"
        },
        "c40_steam_evidence_turn": {
          "label": "Open FitScore’s 4 billion approval"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market",
      "clock": "Wednesday, 3rd week of August · Heat wave 19:00",
      "question": "FitScore’s CEO scored 44 on her own test and failed. What do you ask of her now?",
      "lead": "Moon Gaeul called FitScore herself and told them to 'come and explain,' and to everyone’s surprise Hong Yedam opens the rice cake shop door alone."
    },
    "c40_final": {
      "title": "Before Monday",
      "text": "One of the investor logos on the screen is KD Capital’s. Hong Yedam takes off her smartwatch and sets it on the table. 'When KD’s open hiring starts on Monday, 60,000 people take our test. The company has never been this big.' Ryu Seah lays three documents side by side. A re-review plan giving all 9,412 people who fell below 60 a human interview; documentation disclosing the algorithm and every item’s score weight; and a notice ending the KD records contract, prepared by Lee Minseo. If the contract ends, the service stops tonight, and so does Monday for 42 employees. In the hallway beyond the glass door, Moon Hajun waits with a sketchbook on his knees. Hong Yedam asks. 'Either way, you’re asking me to say what I believed in was wrong, aren’t you?'",
      "memo": [
        "9,412 people to re-review -- human interviews cost about 400 million won",
        "Disclosure documentation: 40 items and 2 reference profiles",
        "If the contract ends, the service stops at once; 42 employees",
        "KD Financial Group second-half hiring opens: Monday 09:00"
      ],
      "choices": {
        "c40_final_open": {
          "label": "Make full disclosure of the algorithm a condition of hiring"
        },
        "c40_final_list": {
          "label": "Have people re-interview all 9,412 who were rejected"
        },
        "c40_final_cut": {
          "label": "Cut the KD records contract and stop the service tonight"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Seongsu-dong · FitScore · Boardroom",
      "clock": "Friday, 3rd week of August · 17:30",
      "question": "Before Monday’s hiring, you must choose between 9,412 people and 42 employees. What do you sign?",
      "lead": "Friday afternoon, 30 minutes before a video call with investors, Hong Yedam calls you and Ryu Seah into the boardroom."
    },
    "c40_aftershock": {
      "title": "A 100-Point Résumé",
      "text": "Saturday afternoon, a sheet of A4 goes up on the glass door of the Gaeul Rice Cake Shop. It is the weekend the survey Do Yoonha and Hajun opened, 'the 41 Club,' has gathered 1,106 answers. 'Part-timer wanted. No test. Interview while slicing rice cakes.' Moon Gaeul’s handwriting. The first applicant is Moon Hajun, and in the score box of his résumé Moon Gaeul writes 100 in red pen. When Hajun says, 'Mom, this is hiring corruption,' Kwon Dohyun confirms, 'If the hourly wage is at least minimum wage, it’s legal.' Kang Taemin carries every box of rice cakes by himself and is told by everyone that he 'lacks leadership.' Toward sunset your phone rings. Cha Jiwon, the aide from the Policy Committee member’s office. It is about a National Assembly hearing. 'Next week’s witness list is final. Yoon Sanghyuk’s name is on it. You get exactly one question.'",
      "memo": [
        "Gaeul Rice Cake Shop part-time hire: 1 -- no test",
        "Résumé score box: 100 in red pen",
        "41 Club list: 1,106 people -- those rejected below 60",
        "Cha Jiwon: hearing witness Yoon Sanghyuk, 1 question"
      ],
      "choices": {
        "c40_after_warm": {
          "label": "Stay through Hajun’s first shift until the shutter comes down"
        },
        "c40_after_rush": {
          "label": "Take Cha Jiwon’s call and head straight to the Assembly"
        },
        "c40_after_record": {
          "label": "Document the 41 Club list as material for the hearing"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market · Out front",
      "clock": "Saturday, 3rd week of August · Heat wave 18:00",
      "question": "On the evening of the first day of the rice cake shop job, one hearing question comes to you. How do you close this evening?"
    },
    "c40_weight": {
      "title": "Minus 0.31",
      "text": "11 p.m., the server room of KD Data Lab in Pangyo. Ryu Seah sees you come in on Lee Minseo’s badge, prints a label and sticks it on a server rack. 'FitScore.' The model configuration file FitScore received opens on the screen. The weights of 40 items are listed one per line. The heaviest item is 'hesitation time before deciding,' and its value is minus 0.31. The longer you hesitate, the more points you lose. Ryu Seah screws the cap back on her thermos. 'People who read the question to the end, people who think once more before they answer, lose the most. This is a number that punishes diligence.'",
      "memo": [
        "40 model items -- the heaviest: hesitation time",
        "Value -0.31: the longer you pause, the more you lose",
        "Configuration file written by: KD Data Lab · FitScore jointly"
      ],
      "choices": {
        "c40_weight_choice_1": {
          "label": "Drop the hesitation item and rescore the rejected"
        },
        "c40_weight_choice_3": {
          "label": "Photograph the settings and leave before you’re caught"
        },
        "c40_weight_choice_2": {
          "label": "Formally send a request to explain the weight table"
        }
      },
      "place": "KD Data Lab, Pangyo · Server Room",
      "clock": "Monday, 3rd week of August · 23:00",
      "question": "The heaviest penalty item is hesitation time. What do you do with this configuration file?"
    },
    "c40_list": {
      "title": "The 41 Club",
      "text": "Tuesday night, the 1st floor of the Hoegi-dong secondhand bookshop. In the morning Do Yoonha and Moon Hajun opened an online survey looking for 'people rejected below 60.' When Hajun renames it 'the 41 Club,' 1,106 people leave answers within 12 hours. Do Yoonha reads one line aloud and stops. A former bookkeeper, fifty-four. 'My hand stopped on the question about moving a customer’s money to another account. At my old company I refused an order like that and was fired. I think that’s why I failed this time too.' Do Yoonha opens his notebook. The same kind of notebook he used at the window 3 years ago. On the first line he writes her name.",
      "memo": [
        "Survey: 1,106 responses in 12 hours",
        "Average respondent score: 47",
        "Most common word in the free answers: 'stopped'"
      ],
      "choices": {
        "c40_list_choice_3": {
          "label": "Pull just the numbers and give Seo Harin a story tonight"
        },
        "c40_list_choice_2": {
          "label": "Get consent forms and put the list in legal form"
        },
        "c40_list_choice_1": {
          "label": "Call each respondent and hear their story yourself"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · By the Shelves",
      "clock": "Tuesday, 3rd week of August · Tropical night 22:00",
      "question": "In 12 hours, 1,106 people answered that they, too, stopped and failed. How do you gather this list?"
    },
    "c40_notice": {
      "title": "Second-Half Hiring Notice",
      "text": "Thursday morning, Oh Jinwoo calls from the lobby of Bridge Bank. He talks faster than usual. 'KD Financial Group’s second-half hiring notice is out. 420 new hires. In the first half the FitScore score was reference material for the final interview; this time it’s the 1st gate. Under 60, they don’t even look at your application. Applications open next Monday, as announced.' At the very bottom of the notice is the reason for adopting it. 'Fair hiring that reduces interviewers’ bias.' Oh Jinwoo pauses a moment. 'My father would like that sentence. But if they pick people with that test, someone who writes dissents can’t get into that bank anymore. From the very start.'",
      "memo": [
        "KD Financial Group second-half hires: 420 -- FitScore as Round 1",
        "Under 60: excluded from document review",
        "Applications open: next Monday"
      ],
      "choices": {
        "c40_notice_choice_1": {
          "label": "Tell would-be applicants how the test works first"
        },
        "c40_notice_choice_2": {
          "label": "Officially ask Group HR for the basis for adopting it"
        },
        "c40_notice_choice_3": {
          "label": "Screenshot the notice and post a rebuttal today"
        }
      },
      "place": "Bridge Bank, Yeouido · Lobby",
      "clock": "Thursday, 3rd week of August · 08:00",
      "question": "KD Financial Group will screen next week’s 420 hires with this test. The notice is up today. What do you do first?"
    },
    "c40_weight_reaction": {
      "title": "A Tag Called Fit",
      "text": "Lee Minseo opens the answer field of the source records. The model learned from the 'fit' and 'unfit' tags attached to each response record of 63 Trigger Lab participants. The records were pseudonymized, leaving only numbers from A-001 to A-063. But the field for whoever attached the tags has no pseudonym. 'Written by: Group Strategy Office.' Lee Minseo taps the monitor with her fingertip. 'These tags weren’t based on performance. Records that followed orders from above quickly are fit; records that stopped are unfit. A machine that learned from this is picking part-timers now.'",
      "memo": [
        "Tags written by: Group Strategy Office",
        "Follow quickly: fit; stop: unfit"
      ],
      "choices": {
        "c40_weight_reaction_choice_3": {
          "label": "Set the tags aside and push for score disclosure first"
        },
        "c40_weight_reaction_choice_1": {
          "label": "First tell the owners of the tagged records"
        },
        "c40_weight_reaction_choice_2": {
          "label": "Formally add the tagging record to the evidence list"
        }
      },
      "place": "Pangyo · KD Data Lab · Server Room Terminal",
      "clock": "Tuesday, 3rd week of August · 00:40",
      "question": "The Group Strategy Office attached the fit and unfit tags. How do you handle these tags?"
    },
    "c40_list_reaction": {
      "title": "9,800 Won",
      "text": "Kwon Dohyun sets a calculator on the landing of the bookshop stairs. FitScore’s test fee is 9,800 won per applicant. If a company spends an hour of two interviewers’ time, it costs 42,000 won per applicant. 'The price of rejecting a person is 1/4 of the price of meeting one.' He turns the calculator face down. 'At this price it’s a profit. On the company’s books. The loss goes on the rejected people’s books, and they don’t have any books.' Beside him, Moon Hajun starts drawing a table of 1,106 cells in his sketchbook.",
      "memo": [
        "Price of rejecting: 9,800 won · price of meeting: 42,000 won",
        "People with no books to write the loss in"
      ],
      "choices": {
        "c40_list_reaction_choice_1": {
          "label": "Keep the books for the rejected people ourselves"
        },
        "c40_list_reaction_choice_3": {
          "label": "Drop the table and rally opinion with the strongest story"
        },
        "c40_list_reaction_choice_2": {
          "label": "Attach a test-fee vs. interview-cost table as evidence"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Stair Landing",
      "clock": "Tuesday, 3rd week of August · Tropical night 23:30",
      "question": "Rejecting a person costs 1/4 of what meeting one does. Where do you use this bill?"
    },
    "c40_notice_reaction": {
      "title": "The Model Answer",
      "text": "That night, Han Seoyun, on standby without a post, speaks the moment she picks up. 'I heard from Ryu Seah. About the fit reference profile.' The model did not have only a reference for unfit. There was also a 'fit reference profile' that pushed scores up, pseudonym Manager H. It holds the record of returning your dissent 3 years ago in 11 minutes. The line goes quiet for a long time. 'They say I’m the model answer. The person who sent your dissent back fastest is the person this company wants to hire.' You hear a breath you can’t tell is a laugh or a sob.",
      "memo": [
        "Fit reference profile: Manager H",
        "11 minutes to return -- the model answer"
      ],
      "choices": {
        "c40_notice_reaction_choice_3": {
          "label": "Skip the comfort tonight; just prepare for tomorrow’s talks"
        },
        "c40_notice_reaction_choice_1": {
          "label": "Ask Han Seoyun to go to FitScore with you tomorrow"
        },
        "c40_notice_reaction_choice_2": {
          "label": "Add Han Seoyun’s records to the deletion request too"
        }
      },
      "place": "Yeouido Hangang Park · Parking Lot by the Benches",
      "clock": "Thursday, 3rd week of August · Tropical night 23:20",
      "question": "Han Seoyun’s return record was the model’s model answer. What do you do on that call?"
    },
    "c40_branch_bakery": {
      "title": "The Manager’s Monitor",
      "text": "Levain House Mangwon, an empty shop at 3 p.m. Store manager Ha Yesol ties her apron strings twice and unties them. Moon Hajun, she says, once drew the chalkboard menu for this shop in the spring. She turns the counter monitor around to show you. Of 14 applicants for weekend part-time work this month, 11 were automatically rejected for scoring under 60. 'It’s headquarters’ guideline. Under 60, don’t even call them for an interview. I got this score last year too when I was hired. 72.' She points at one name. The granddaughter of the old woman from the next building who buys a loaf of bread every morning. 'This kid is deaf. She was slow to respond because she was reading captions.'",
      "memo": [
        "14 weekend part-time applicants -- 11 automatically rejected",
        "Headquarters guideline: no interviews under 60",
        "Store manager Ha Yesol’s own score: 72",
        "Among the rejected: 1 deaf applicant"
      ],
      "choices": {
        "c40_branch_bakery_c": {
          "label": "For the manager’s sake, quietly ask her to recheck only Hajun"
        },
        "c40_branch_bakery_b": {
          "label": "First get the 60-point guideline headquarters sent down"
        },
        "c40_branch_bakery_a": {
          "label": "Call the 11 rejected in for interviews with the manager"
        }
      },
      "place": "Levain House Mangwon · Café Counter",
      "clock": "Monday, 3rd week of August · 15:00",
      "question": "Even the manager is bound by headquarters’ score and can’t call 11 people for an interview. What do you do at this shop?"
    },
    "c40_branch_bakery_follow": {
      "title": "An Interview After Closing",
      "text": "9 p.m., with only half the lights on in the closed shop, Ha Yesol has called in three rejected applicants. Moon Hajun; Yoon Daon, twenty, who is deaf; and Ms. Han Mikyung, fifty-two, back looking for work after a career break. When Ha Yesol’s hands shake on her question sheet, Hajun writes 'Ask slowly' in his sketchbook and stands it on the table. Yoon Daon takes the questions in writing and writes her answers clearly, as if explaining bread dough. Ms. Han, with 20 years of warehouse management, finds two wrong cells in the inventory sheet. When the interview ends, Ha Yesol sighs. 'I want to hire all three. But headquarters’ system won’t open the input field for anyone under 60.'",
      "memo": [
        "Human interviews after closing: 3 -- all three good enough to hire",
        "Yoon Daon: most accurate answers when given questions in writing",
        "Han Mikyung: found 2 errors in the inventory sheet",
        "Headquarters system: no input under 60"
      ],
      "choices": {
        "c40_branch_bakery_follow_b": {
          "label": "Use the blocked field as evidence for a labor complaint"
        },
        "c40_branch_bakery_follow_c": {
          "label": "Call off today’s interviews and protect the manager’s job"
        },
        "c40_branch_bakery_follow_a": {
          "label": "Write the manager’s recommendation for the three together"
        }
      },
      "place": "Levain House Mangwon · Café After Closing",
      "clock": "Monday, 3rd week of August · 21:00",
      "question": "All three people you interviewed in person are good, but the system won’t open the field. What do you do?"
    },
    "c40_route_system": {
      "title": "The Histories of People Who Stopped",
      "text": "You don’t fight over the 41 points; you look into who the rejected people were. Ryu Seah lends a hand. The responses of FitScore’s 9,412 rejected applicants are grouped another way. Among the top 10% in hesitation time, people who wrote of 'refusing an unfair order' in their cover letters are 3.4 times more common than among other test takers. Ryu Seah stops in the middle of printing a label. 'This algorithm is screening out people who hesitate. Quite a few of them are people who stopped when they should have. And the model learned that as a defect.' She writes 'people who stopped' on the label and sticks it on top of the monitor.",
      "memo": [
        "Top 10% in hesitation -- 3.4 times as many refused unfair orders",
        "About 2,700 of the 9,412 rejected fit this",
        "This statistic appears nowhere in FitScore’s documentation"
      ],
      "choices": {
        "c40_route_system_drop": {
          "label": "Bury the statistic and quietly negotiate with FitScore"
        },
        "c40_route_system_reweight": {
          "label": "Propose flipping the hesitation item’s sign and rescoring"
        },
        "c40_route_system_publish": {
          "label": "Send the statistic to all 138 FitScore client companies"
        },
        "c40_route_system_evidence_turn": {
          "label": "Open FitScore’s 4 billion approval"
        }
      },
      "place": "Pangyo · KD Data Lab · Server Room Terminal",
      "clock": "Tuesday, 3rd week of August · 01:30",
      "question": "The top 10% in hesitation have 3.4 times as many people who refused unfair orders. What do you do with this statistic?"
    },
    "c40_final_system_route": {
      "title": "A Label With No Words",
      "text": "Friday before dawn, the label reading 'people who stopped' is still stuck on the server room terminal. Ryu Seah runs the rejected group once more and leaves the result as it is. About 2,700 people. When KD’s hiring opens at nine on Monday, the same test runs again. She prints one more label and holds it, blank. 'I don’t know what to write for these people. It’s not a defect. But unless the test is given a name for it, it’ll learn it as a defect again.'",
      "memo": [
        "Top 10% in hesitation -- 3.4 times as many refused unfair orders",
        "About 2,700 rejected people affected",
        "KD Financial Group hiring opens: Monday 09:00"
      ],
      "choices": {
        "c40_final_system_route_a": {
          "label": "Set a rule: hire only with tests that don’t dock hesitation"
        },
        "c40_final_system_route_c": {
          "label": "Put the right to a human interview into the terms"
        },
        "c40_final_system_route_b": {
          "label": "Leave the statistic; just have them pay the rejected"
        }
      },
      "place": "Pangyo · KD Data Lab · Server Room Terminal",
      "clock": "Friday, 3rd week of August · Before dawn",
      "question": "The test learns an unnamed pause as a defect. Before Monday, what name do you give that pause?"
    },
    "c40_evidence_turn": {
      "title": "Money That Goes Full Circle",
      "text": "When you fit the clue into the investor list, the approval for the 4 billion won a KD Capital investment fund put into FitScore opens. You learned in May that the group had put money into this company, but this is the first time you have seen the original approval. Under the signature of CEO Yoon Sanghyuk, two conditions are attached. 'Data supply: KD Data Lab.' 'Priority adoption in KD Financial Group hiring.' The 'fit' and 'unfit' tags on each record the model learned from were carried over as they were from a Trigger Lab HR evaluation auxiliary index. Ban Jaewook closes the notebook he was writing in. 'The group sells the records, a company the group invested in buys them, and uses them in the group’s hiring. The money goes full circle and comes back, and only the rejected people are left outside.'",
      "memo": [
        "KD Capital investment fund, 4 billion won -- approved and signed by Yoon Sanghyuk",
        "Investment terms: data from KD Data Lab · priority adoption in group hiring",
        "Source of the tags: Trigger Lab HR evaluation auxiliary index"
      ],
      "choices": {
        "c40_evidence_turn_hold": {
          "label": "Know the approval and hold it as a last card in the talks"
        },
        "c40_evidence_turn_show": {
          "label": "Show CEO Hong Yedam the approval first and ask her choice"
        },
        "c40_evidence_turn_hand": {
          "label": "Give the approval and tag records to Cha Jiwon for the hearing"
        }
      },
      "place": "KD Capital · Records Room",
      "clock": "Friday, 3rd week of August · 07:00",
      "question": "The money from selling the records became an investment and came back to the same group’s hiring. How do you use this approval?"
    },
    "c40_start_warm": {
      "title": "A Text Put Off Until Morning",
      "text": "On the night you stayed beside the interviewees until the editing room lights went off, you put Hajun’s text off until the next morning. Saturday afternoon at the Gaeul Rice Cake Shop, Hajun, sorting rice cake boxes, holds out the screen again. Levain House Mangwon, a weekend part-time job: the result of the 12-minute aptitude test the shop called an 'AI interview.' Organizational fit score 41, rejected. He never met a single person. Moon Gaeul, who was in the editing room last night, stops her rice cake knife. 'You’re saying the company in Part 5 of that documentary rejected my kid?' Hajun adds quietly, 'The application fees. I was going to earn them myself.'",
      "memo": [
        "The text put off overnight -- organizational fit 41, rejected",
        "'AI interview' 12 minutes, human interview 0 minutes",
        "FitScore -- buyer of Trigger Lab’s response records"
      ],
      "choices": {
        "c40_start_warm_signature": {
          "label": "Split Hajun’s case with the people from the editing room"
        },
        "c40_start_warm_visit": {
          "label": "Go with Moon Hajun to see the shop’s manager first"
        },
        "c40_start_warm_claim": {
          "label": "First demand the basis for the score on the notice"
        },
        "c40_start_warm_post": {
          "label": "Screenshot the rejection text and post it online tonight"
        },
        "c40_start_warm_reframe": {
          "label": "Look into who was rejected"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market",
      "clock": "Saturday after the broadcast · Heat wave warning 15:00",
      "question": "The 41-point text you put off to stay at the editing room waits at the rice cake shop. Who do you start this with?",
      "lead": "One by one, the people who spent the night in the editing room come back to the rice cake shop and tie on aprons."
    },
    "c40_start_record": {
      "title": "6 Minutes in the Preservation Folder",
      "text": "The day after you bound the 20 minutes of originals the 'reference opinion' flagged, and their edit history, into a preservation document, Lee Minseo plays one section from that folder again. The 6 minutes of Part 5 the advertisers’ 'reference opinion' wanted cut: the story of Trigger Lab’s response records being sold to FitScore. Then a text comes from Moon Hajun. He applied for a weekend part-time job, and a link came for an aptitude test the shop calls an 'AI interview.' The result: organizational fit score 41, rejected. Not a single person appeared. Lee Minseo’s voice drops. 'The company in these 6 minutes we bound up rejected Hajun the very night the documentary aired.'",
      "memo": [
        "Preservation folder: the 20 minutes of originals the 'reference opinion' flagged, and their edit history",
        "Part 5, 6 minutes -- response records sold to FitScore",
        "Moon Hajun: Levain House part-time job, 41 points, rejected"
      ],
      "choices": {
        "c40_start_record_claim": {
          "label": "First demand the basis for the score on the notice"
        },
        "c40_start_record_visit": {
          "label": "Go with Moon Hajun to see the shop’s manager first"
        },
        "c40_start_record_post": {
          "label": "Screenshot the rejection text and post it online tonight"
        },
        "c40_start_record_signature": {
          "label": "Reread the folder’s 6-minute original as FitScore material"
        },
        "c40_start_record_reframe": {
          "label": "Look into who was rejected"
        }
      },
      "place": "Pangyo · KD Data Lab · Records Room",
      "clock": "Saturday after the broadcast · Heat wave warning 11:00",
      "question": "The company in the 6 minutes you bound up rejected Hajun the same night. How do you use that original?",
      "lead": "Lee Minseo reopens the folder bound as a preservation document on the records room terminal at KD Data Lab."
    },
    "c40_start_rush": {
      "title": "Glass Door Before Dawn",
      "text": "At Exit 7 of Hapjeong Station at midnight, the informant left only the date of the next meeting, and on your phone was Hajun’s 41-point text. You rushed to Seongsu-dong with it, but at one in the morning FitScore’s building was dark. Hajun, clutching his phone, follows and stands beside you at the glass door. The text holds the result for a weekend part-time job at Levain House Mangwon: the 12-minute aptitude test the shop called an 'AI interview.' Organizational fit score 41, rejected. On the lobby wall a slogan shines in the emergency light. 'The right people, faster.' Hajun looks at the slogan for a long time, then asks. 'Did I fail because I’m slow? I read the questions to the end.' The intercom at the security desk blinks.",
      "memo": [
        "From Hapjeong Station straight to FitScore’s building in Seongsu-dong -- lights off",
        "Lobby slogan: 'The right people, faster'",
        "Moon Hajun: Levain House part-time job, 41 points, rejected"
      ],
      "choices": {
        "c40_start_rush_visit": {
          "label": "Go with Moon Hajun to see the shop’s manager first"
        },
        "c40_start_rush_post": {
          "label": "Screenshot the rejection text and post it online tonight"
        },
        "c40_start_rush_claim": {
          "label": "First demand the basis for the score on the notice"
        },
        "c40_start_rush_signature": {
          "label": "Use the security intercom to demand a meeting with the CEO"
        },
        "c40_start_rush_reframe": {
          "label": "Look into who was rejected"
        }
      },
      "place": "Seongsu-dong · FitScore · Lobby",
      "clock": "The day after the broadcast · Tropical night 01:00",
      "question": "At the glass door before dawn, Hajun asks whether he failed because he is slow. What do you do first?",
      "lead": "20 minutes after you took a taxi from Exit 7 of Hapjeong Station, the building at the end of a Seongsu-dong alley has only its emergency lights on."
    }
  },
  "echoReplies": {
    "c40_start_visit": "When you go, the manager only nods at you over the customers at the end of the weekend line. 'It’s headquarters’ guideline. Please come back on a weekday.'",
    "c40_start_claim": "The request goes to FitScore’s customer center. The auto-reply says 'the scoring method is a trade secret.'",
    "c40_start_post": "The screenshot spreads overnight. You hid Hajun’s name but not the shop’s, and the manager takes the calls first.",
    "c40_demo_rehear": "Hong Yedam answers that an exception for one person is not fair. You can hear in her voice that she believes it.",
    "c40_demo_source": "When you press on the source, Hong Yedam reopens the contract for the first time. Today she, too, reads the small print under the provider field for the first time.",
    "c40_demo_film": "The video is funny. The more the views climb, the more people remember Kang Taemin, and no one remembers the 9,412.",
    "c40_anchor_tell": "When you tell him, Hajun stares at his sketchbook for a long time. Then he asks. 'So when I stopped, was that the right thing?'",
    "c40_anchor_claim": "When you file, for the first time you are addressed as the owner of your records. The moment they are deleted, the reference point that failed Hajun disappears too.",
    "c40_anchor_hide": "Hidden, the evidence is clean. Hajun writes his next application without knowing whom he failed for resembling.",
    "c40_steam_persuade": "As you persuade her, Hong Yedam eats the injeolmi to the last bite. She puts off her answer until Friday. She is picturing the faces of 42 employees.",
    "c40_steam_audit": "The agreement is solid. The review takes three months, and KD’s hiring opens next Monday.",
    "c40_steam_deal": "Even with KD’s records removed, the model has already learned. The records are erased; the habits it learned remain.",
    "c40_final_list": "With re-interviews, the 9,412 people get interview dates. Who pays the 400 million won is still blank, and Monday’s hiring slips a week.",
    "c40_final_open": "With disclosure, anyone can read the weights. Some of those who read them start by selling tips for passing the test.",
    "c40_final_cut": "Cut, the service stops tonight. The road to re-review for the 9,412 stops with it, and the 42 employees have nowhere to go on Monday.",
    "c40_after_warm": "As the shutter comes down, Hajun’s first wages go into an envelope. Moon Gaeul writes '100 points' on it. The Assembly waits until Monday.",
    "c40_after_record": "Documented, the 1,106 go into the hearing materials list as one line. Cha Jiwon runs a highlighter over that line.",
    "c40_after_rush": "When you reach the Members’ Office Building, Cha Jiwon notices the smell of rice cake. In your bag is the injeolmi Moon Gaeul packed for you.",
    "c40_weight_choice_1": "Rescored, 6,030 of the 9,412 pass 60. No company is ready to take that number yet.",
    "c40_weight_choice_2": "The request gets a receipt number. The deadline for an answer is 30 days, and KD’s hiring is next week.",
    "c40_weight_choice_3": "The photos remain. They are not the original file, so FitScore can call them 'a doctored screen.'",
    "c40_list_choice_1": "As you make the calls, the night grows short. At the end of her call, the fifty-four-year-old bookkeeper says you are 'the first person who ever told me I was right.'",
    "c40_list_choice_2": "The consent forms make the list evidence. Some people hesitate before the signature line. That hesitation becomes a record too.",
    "c40_list_choice_3": "The story goes out fast. The 1,106 are called a number, and no one knows their names.",
    "c40_notice_choice_1": "Once told, applicants practice not stopping. Instead of avoiding the test, they start fixing themselves to fit it.",
    "c40_notice_choice_2": "The request goes into HR’s document box. HR prepares a reply: 'an outside vendor’s trade secret.'",
    "c40_notice_choice_3": "The rebuttal spreads within a day. The group PR office answers under the title 'People Who Oppose Fair Hiring.'",
    "c40_weight_reaction_choice_1": "Once told, the 63 start looking for their numbers. Beside Lee Minseo’s A-017, and beside Do Yoonha’s number, the tag is unfit.",
    "c40_weight_reaction_choice_2": "On the evidence list, the one line 'Group Strategy Office' cannot be erased. The name of the person who wrote that line is still far off.",
    "c40_weight_reaction_choice_3": "Score disclosure is fast. Who attached the tags hides behind the disclosed scores.",
    "c40_list_reaction_choice_1": "With the books, the 1,106 each get a column. Kwon Dohyun names the column 'cost of not meeting.'",
    "c40_list_reaction_choice_2": "The comparison table is hard to rebut. But few people read it. Numbers don’t travel as far as stories.",
    "c40_list_reaction_choice_3": "One story travels far. The fifty-four-year-old bookkeeper’s name becomes a trending search within a day, and she turns off her phone.",
    "c40_notice_reaction_choice_1": "When she agrees to come, the one who dissented and the one who returned it stand side by side in FitScore’s lobby. The originals of unfit and fit. Only you are called into the meeting room, and Han Seoyun sits beside Hajun in the hallway.",
    "c40_notice_reaction_choice_2": "On the list, Han Seoyun’s 11 minutes can be erased too. For a long time Han Seoyun does not answer whether she wants to be erased.",
    "c40_notice_reaction_choice_3": "The preparation is solid. Han Seoyun hangs up and leaves her light on for a long time.",
    "c40_branch_bakery_a": "To call people in for interviews, Ha Yesol has to clear an evening behind headquarters’ back. She says she will.",
    "c40_branch_bakery_b": "The guideline is two pages. At the very bottom of the second page, in bold: 'No manager discretion.'",
    "c40_branch_bakery_c": "When you ask her to look only at Hajun, Ha Yesol starts to nod and stops. The deaf applicant’s name is still on the monitor.",
    "c40_branch_bakery_follow_a": "When the recommendation goes up, headquarters calls in the manager instead of the three. Ha Yesol goes with a copy of the recommendation in her bag.",
    "c40_branch_bakery_follow_b": "When the complaint is filed, the labor office opens an investigation under 'fairness of the hiring process.' The results won’t come until the autumn is over.",
    "c40_branch_bakery_follow_c": "With the interviews undone, Ha Yesol keeps her job. The two wrong cells Ms. Han Mikyung found stay as they are too.",
    "c40_route_system_publish": "11 of the 138 write back. Three stop using the test, and eight write only 'under internal review.'",
    "c40_route_system_reweight": "With the sign flipped, the people who stopped rise. But this time people who answered quickly fail for no reason.",
    "c40_route_system_drop": "The quiet negotiation ends fast. The 2,700 people who stopped never learn why they failed.",
    "c40_final_system_route_a": "With the rule, a pause is no longer a penalty. Who will check that the rule is kept has not been decided.",
    "c40_final_system_route_b": "The payments go out fast. Those who receive them take the same test again on their next application.",
    "c40_final_system_route_c": "With the right in the terms, anyone can meet a person. Those who read the terms to the end meet one first.",
    "c40_evidence_turn_hand": "With the materials handed over, Cha Jiwon rewrites the questions. Yoon Sanghyuk’s signature waits for its turn on the hearing screen.",
    "c40_evidence_turn_show": "When you show her, the color drains from Hong Yedam’s face. Today she learns for the first time that the 4 billion won came with conditions. The one who signed was not her.",
    "c40_evidence_turn_hold": "Holding it, you win the negotiation. The terms of the won negotiation do not include Yoon Sanghyuk’s name.",
    "c40_demo_evidence_turn": "When you pick the overlapping name, the side that sold the records and the side that bought them meet in one person’s signature. The rejected people are outside that circle.",
    "c40_anchor_evidence_turn": "When you pick the overlapping name, the side that sold the records and the side that bought them meet in one person’s signature. The rejected people are outside that circle.",
    "c40_steam_evidence_turn": "When you pick the overlapping name, the side that sold the records and the side that bought them meet in one person’s signature. The rejected people are outside that circle.",
    "c40_route_system_evidence_turn": "When you pick the overlapping name, the side that sold the records and the side that bought them meet in one person’s signature. The rejected people are outside that circle.",
    "case40_memory_system": "The newly built table appears nowhere in the documentation. There is only a field that times how long each item was hesitated over. Ryu Seah regroups the rejected people by that field.",
    "case40_memory_evidence": "Overlay the two paths and the shape is the same: what was sent away comes back under another name. FitScore’s investment approval also carries a signature.",
    "c40_start_warm_visit": "When you go, the manager only nods at you over the customers at the end of the weekend line. 'It’s headquarters’ guideline. Please come back on a weekday.'",
    "c40_start_warm_claim": "The request goes to FitScore’s customer center. The auto-reply says 'the scoring method is a trade secret.'",
    "c40_start_warm_post": "The screenshot spreads overnight. You hid Hajun’s name but not the shop’s, and the manager takes the calls first.",
    "c40_start_warm_signature": "With the work split up, the rice cake shop group chat buzzes all night. When Seo Harin posts a photo of Jeongjeong, Hajun finally smiles.",
    "c40_start_record_visit": "When you go, the manager only nods at you over the customers at the end of the weekend line. 'It’s headquarters’ guideline. Please come back on a weekday.'",
    "c40_start_record_claim": "The request goes to FitScore’s customer center. The auto-reply says 'the scoring method is a trade secret.'",
    "c40_start_record_post": "The screenshot spreads overnight. You hid Hajun’s name but not the shop’s, and the manager takes the calls first.",
    "c40_start_record_signature": "The interviewee in the original is a former FitScore employee. One remark cut in the edit survives. 'Nobody ever asked what the model learned.'",
    "c40_start_rush_visit": "When you go, the manager only nods at you over the customers at the end of the weekend line. 'It’s headquarters’ guideline. Please come back on a weekday.'",
    "c40_start_rush_claim": "The request goes to FitScore’s customer center. The auto-reply says 'the scoring method is a trade secret.'",
    "c40_start_rush_post": "The screenshot spreads overnight. You hid Hajun’s name but not the shop’s, and the manager takes the calls first.",
    "c40_start_rush_signature": "Even before dawn, the intercom connects to the CEO. Half asleep, she says clearly that she 'will show you a demo herself.'"
  },
  "choiceVoiceLines": {
    "c40_start_visit": "Saying people come before numbers, you go with Moon Hajun to see the shop’s manager first.",
    "c40_start_claim": "Saying it can’t end without hearing what didn’t fit, you first demand the basis for the score on the rejection notice.",
    "c40_start_post": "Saying the world should know about an interview where not one person showed up, you screenshot the rejection text and post it online tonight.",
    "c40_demo_rehear": "Saying the kid who was rejected first should be put in front of a person first, you ask that Moon Hajun’s score be reviewed with a human interview.",
    "c40_demo_source": "Saying people are being measured with records even the CEO doesn’t know, you first ask whose records the training data are.",
    "c40_demo_film": "A man who carried every load himself, lacking leadership? You film Kang Taemin’s result screen and use it in the PR fight first.",
    "c40_anchor_tell": "Unable to let him hear it from someone else, you tell Moon Hajun yourself, first, that it was because of your record.",
    "c40_anchor_claim": "Saying no one asked, so you will, you file an official request as the data subject to see and delete your records.",
    "c40_anchor_hide": "Saying that if your name comes out Hajun’s case becomes yours, you hide that it’s your record and quietly use it only as evidence.",
    "c40_steam_persuade": "Feeling she might listen now that she has scored 44, you persuade Hong Yedam, person to person, to stop the service together.",
    "c40_steam_audit": "Saying today’s wavering will be gone by tomorrow, you get an outside expert review of the model in a written agreement.",
    "c40_steam_deal": "Saying you can’t corner someone who failed her own test any further, you let the service go on on the condition that only KD’s records are removed.",
    "c40_final_list": "Saying a door numbers shut must be reopened by people, you have all 9,412 rejected people reviewed again with human interviews.",
    "c40_final_open": "Saying 60,000 people should know what they’re measured by before they take it, you make full disclosure of the algorithm and score weights a condition for opening the hiring.",
    "c40_final_cut": "Unable to let 60,000 people take the same test on Monday, you cut the KD records contract and stop the service tonight.",
    "c40_after_warm": "Saying one question can wait until tomorrow, tonight you stay through Hajun’s first shift until the rice cake shop shutter comes down.",
    "c40_after_record": "So the words of the rejected get into the hearing room, you document the 41 Club list as material for the hearing.",
    "c40_after_rush": "Saying a single question has to be sharpened starting now, you take Cha Jiwon’s call and head straight to the Assembly.",
    "c40_weight_choice_1": "To see how many people minus 0.31 failed, you drop the hesitation item and rescore the rejected applicants.",
    "c40_weight_choice_2": "Saying you can’t rely on numbers seen on someone else’s badge, you formally send a request to explain the weight table.",
    "c40_weight_choice_3": "Before anyone catches you in on someone else’s badge, you photograph only the settings screen and leave the server room.",
    "c40_list_choice_1": "Feeling there are words that didn’t fit in one line of a survey, you call each respondent and hear their story yourself.",
    "c40_list_choice_2": "So the answers of 1,106 people don’t remain only stories, you get consent forms and put the list in the form of legal material.",
    "c40_list_choice_3": "Saying you can’t sit on 1,106 answers gathered in a day, you pull just the numbers and give Seo Harin a story tonight.",
    "c40_notice_choice_1": "Saying those who take it blind lose as much as they pause, you tell would-be applicants how the test is built first.",
    "c40_notice_choice_2": "Unable to let the one line about fairness pass, you officially ask Group HR for the basis for adopting the test.",
    "c40_notice_choice_3": "Before the words 'fair hiring' set, you screenshot the notice and post a rebuttal today.",
    "c40_weight_reaction_choice_1": "Saying people should know their records were called unfit, you first tell the owners of the tagged records.",
    "c40_weight_reaction_choice_2": "Before the author field left without a pseudonym disappears, you formally add the tagging record to the evidence list.",
    "c40_weight_reaction_choice_3": "Saying what the rejected need right now is their own scores, you set the tags aside and push for score disclosure first.",
    "c40_list_reaction_choice_1": "Bothered that the loss has nowhere to be written, you keep the books for the rejected people yourselves.",
    "c40_list_reaction_choice_2": "To put in numbers that this test is used because it’s cheap, you attach a test-fee vs. interview-cost table as official material.",
    "c40_list_reaction_choice_3": "Saying numbers don’t get read but people do, you drop the table and rally opinion with the single strongest story.",
    "c40_notice_reaction_choice_1": "Saying the model answer herself has to say no, you ask Han Seoyun to go to FitScore with you tomorrow.",
    "c40_notice_reaction_choice_2": "Saying that record, too, was used without asking its owner, you add Han Seoyun’s records to the deletion request list as well.",
    "c40_notice_reaction_choice_3": "Feeling no words would reach her now, you skip the comfort tonight and only prepare for tomorrow’s negotiation.",
    "c40_branch_bakery_a": "Having seen that even someone slowed by reading captions was rejected, you call the 11 rejected applicants in for human interviews with the manager.",
    "c40_branch_bakery_b": "So it doesn’t end as the manager’s fault, you first get the 60-point guideline document headquarters sent down.",
    "c40_branch_bakery_c": "For the sake of a manager bound by headquarters’ guideline, you quietly ask her to look at Moon Hajun alone again.",
    "c40_branch_bakery_follow_a": "To push for the three hires on paper if the field won’t open, you write the manager’s recommendation together.",
    "c40_branch_bakery_follow_b": "Because what blocked her from hiring is headquarters’ system, you keep the blocked input screen as evidence and prepare a complaint to the labor office.",
    "c40_branch_bakery_follow_c": "Saying the field won’t even open and only the manager will get hurt, you call off today’s interviews and protect the manager’s job first.",
    "c40_route_system_publish": "Because it’s a number found nowhere in the documentation, you send the statistic to all 138 companies that use FitScore at once.",
    "c40_route_system_reweight": "So people who stopped when they should have aren’t docked, you propose flipping the sign of the hesitation item and rescoring.",
    "c40_route_system_drop": "Saying the door will close if the numbers blow up, you bury the statistic and quietly negotiate with FitScore.",
    "c40_final_system_route_a": "So the people who stopped aren’t learned as a defect again, you set a rule that hiring may only use tests that don’t dock hesitation.",
    "c40_final_system_route_b": "Saying to take what you can get before applications open, you leave the statistic aside and have them pay only compensation to the rejected.",
    "c40_final_system_route_c": "Saying there must still be a way to meet a person even when the numbers are wrong, you have the right of the rejected to demand a human interview put into the terms of use.",
    "c40_evidence_turn_hand": "Saying money going full circle is for the Assembly to ask about, you hand the investment approval and the tag records to Assembly aide Cha Jiwon as hearing material.",
    "c40_evidence_turn_show": "Saying she should know what her own company is bound to, you show FitScore CEO Hong Yedam the approval first and ask for her choice.",
    "c40_evidence_turn_hold": "To give the group no time to act, you keep the approval in mind and hold it as a last card in the negotiation.",
    "c40_demo_evidence_turn": "Picking the name in FitScore’s investor list that overlaps with the clue, you follow the path the money from selling the records took back.",
    "c40_anchor_evidence_turn": "Picking the name in FitScore’s investor list that overlaps with the clue, you follow the path the money from selling the records took back.",
    "c40_steam_evidence_turn": "Picking the name in FitScore’s investor list that overlaps with the clue, you follow the path the money from selling the records took back.",
    "c40_route_system_evidence_turn": "Picking the name in FitScore’s investor list that overlaps with the clue, you follow the path the money from selling the records took back.",
    "c40_start_warm_visit": "Saying people come before numbers, you go with Moon Hajun to see the shop’s manager first.",
    "c40_start_warm_claim": "Saying it can’t end without hearing what didn’t fit, you first demand the basis for the score on the rejection notice.",
    "c40_start_warm_post": "Saying the world should know about an interview where not one person showed up, you screenshot the rejection text and post it online tonight.",
    "c40_start_warm_signature": "Not wanting to leave Hajun holding 41 points alone, you split his case with the people who gathered in the editing room last night.",
    "c40_start_record_visit": "Saying people come before numbers, you go with Moon Hajun to see the shop’s manager first.",
    "c40_start_record_claim": "Saying it can’t end without hearing what didn’t fit, you first demand the basis for the score on the rejection notice.",
    "c40_start_record_post": "Saying the world should know about an interview where not one person showed up, you screenshot the rejection text and post it online tonight.",
    "c40_start_record_signature": "In case the answer is in the 6 minutes you bound up, you reread the original of those 6 minutes in the preservation folder as FitScore material.",
    "c40_start_rush_visit": "Saying people come before numbers, you go with Moon Hajun to see the shop’s manager first.",
    "c40_start_rush_claim": "Saying it can’t end without hearing what didn’t fit, you first demand the basis for the score on the rejection notice.",
    "c40_start_rush_post": "Saying the world should know about an interview where not one person showed up, you screenshot the rejection text and post it online tonight.",
    "c40_start_rush_signature": "Saying you can’t turn away empty-handed at the glass door, you use the security desk intercom to demand a meeting with the CEO tomorrow."
  },
  "pack": {
    "clue": {
      "title": "The Reference Point for Unfit",
      "text": "The unfit reference in FitScore’s model was Analyst A, that is, your 3 years of response records, and the fit reference was the record of Han Seoyun returning that dissent in 11 minutes. The Group Strategy Office attached the tags, and KD Capital’s 4 billion won was in FitScore."
    },
    "outcomes": {
      "c40_after_warm": {
        "tag": "Stayed Beside Them",
        "title": "You stayed through Hajun’s first shift until the shutter came down",
        "text": "On the first day of a part-timer hired without a test, everyone at the rice cake shop tied on an apron. On the first wage envelope, in Moon Gaeul’s handwriting: '100 points.'"
      },
      "c40_after_record": {
        "tag": "Kept the List",
        "title": "The pauses of 1,106 people became hearing material",
        "text": "The 41 Club’s list and stories were bound into a document with consent forms. The people who stopped and failed each had a line and a name for the first time."
      },
      "c40_after_rush": {
        "tag": "Ran Ahead",
        "title": "You went to the Assembly with injeolmi in your bag",
        "text": "You left the rice cake shop’s first shift behind and headed to the Members’ Office Building. Cha Jiwon noticed the smell of rice cake before the questions."
      }
    },
    "continuityChallenges": {
      "c39_after_warm": {
        "title": "Go with the people who shared the editing room night",
        "text": "The people who stayed beside you until the editing room lights went off have come back to the rice cake shop. Trust finds its weight when you stand side by side with them in front of a kid who got 41 points."
      },
      "c39_after_record": {
        "title": "Use the 6 minutes you bound up again",
        "text": "Of the 20 minutes bound as a preservation document, 6 minutes were the FitScore story. What does a record bound so it won’t vanish become in front of one kid’s 41 points? Reframe the table and find out."
      },
      "c39_after_rush": {
        "title": "Turn back from the glass door before dawn",
        "text": "The building you rushed to with only a 41-point text was dark, and Hajun stands beside you instead of the rice cake shop people. Going back to the road of asking formally and getting an answer: fairness starts again there."
      }
    }
  }
};
