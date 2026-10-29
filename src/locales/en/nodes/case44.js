/**
 * 사건 44 (src/nodes/case44.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c44_start": {
      "title": "The Night Before Sentencing",
      "text": "On the 1st floor of the secondhand bookshop in Hoegi-dong, Oh Jinwoo sets a single A4 sheet on the table between the shelves. Tomorrow at 10 a.m. is the first-instance sentencing in the Haeon Partners advisory fee case. The charge is breach of trust. The prosecutor asked for 7 years in prison. But this afternoon, Yoon Sanghyuk’s side filed two more documents. A no-punishment letter in KD Bank’s name, and a petition from 1,204 employees. Oh Jinwoo does not smile. 'Under the law, the victim of this crime is KD Bank. If the victim says it’s fine, the judge has to weigh that in the sentence. I chased this money for 3 years, and the company is the one doing the forgiving.'",
      "memo": [
        "Sentencing: September 10 (Thu), 10 a.m., Seoul Central District Court, Room 417",
        "Prosecution asks: 7 years in prison, confiscation of 3.84 billion won in Haeon advisory fees",
        "Filed the day before: no-punishment letter in KD Bank’s name, 1,204 petition sheets",
        "102 gallery seats -- lottery at dawn"
      ],
      "choices": {
        "c44_start_seats": {
          "label": "Secure gallery seats for the group first"
        },
        "c44_start_brief": {
          "label": "Write a rebuttal to the letter overnight for the prosecution"
        },
        "c44_start_trace": {
          "label": "Leave the sentencing to reporters and chase the money"
        },
        "reframe": {
          "label": "Count forgiven-executive trials"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Table Between the Shelves",
      "clock": "September 9 · Sentencing D-1 · 22:10",
      "question": "The night before sentencing, a letter arrives saying the victim, the company, forgives the offender. What do you do first?",
      "lead": "Two days after the dismissal motion passed 5 to 3, the lights stay on late on the 1st floor of the bookshop, the night before sentencing."
    },
    "c44_lottery": {
      "title": "102 Gallery Passes",
      "text": "Kang Taemin has stood at the very front of the line outside the East Wing of Seoul Central District Court for two hours already, a thermos tucked under his arm. There are 102 gallery passes, and the lottery is at 8:00. Na Junhyuk drove six seniors from the Yeongdong Branch banking hall up in a van and called it a 'Seoul court tour'. Kwon Dohyun counts the applicants, announces an 18.9% chance of winning, and works out an expected value nobody asked for. But in the middle of the line stand 20 people in navy caps. They don’t know each other, yet their caps match. One has a text open on his phone. 'Court gallery line, 120,000 won a day, 50,000 won extra if you win.' Moon Gaeul stands far back, hugging a bundle of rice cakes. At this rate, half the group won’t get into the courtroom.",
      "memo": [
        "102 gallery passes, 540 applicants",
        "20 navy caps -- the same job text",
        "38 members of the victims’ group attending",
        "Kwon Dohyun’s math: 18.9% chance of winning"
      ],
      "choices": {
        "c44_lottery_press": {
          "label": "Take a seat beside the press box and start the record"
        },
        "c44_lottery_report": {
          "label": "Report the paid line-standing text to the court officer"
        },
        "c44_lottery_give": {
          "label": "Hand our winning passes to the group first"
        },
        "reframe": {
          "label": "Count forgiven-executive trials"
        },
        "c44_lottery_evidence_turn": {
          "label": "Find the ledger behind the letter"
        }
      },
      "place": "Seoul Central District Court · Road Outside the East Wing",
      "clock": "September 10 · Dawn 04:30",
      "question": "In the middle of the gallery line stand 20 people paid by the day. What do you do about this line?",
      "lead": "The dawn air is already cool, the way September gets. At the front of the line, Kang Taemin waves his thermos."
    },
    "c44_court": {
      "title": "However",
      "text": "Courtroom 417. The presiding judge has been reading the reasons for the judgment for 31 minutes. Of the 12 advisory fee payments that went to Haeon Partners, Presiding Judge Lee Hakyung has found 8 to be breach of trust. Kwon Dohyun counts each 'however' on his fingers. Every time the ruling tilts, the judge turns it with a 'however'. This is the ninth. Oh Jinwoo bet 10,000 won on 15, Kwon Dohyun on 20. Then come the mitigating factors. 'However, considering that the victim, KD Bank, does not wish him punished, and that the defendant contributed to a 30 billion won voluntary compensation plan, so that much of the damage has been recovered…' Moon Gaeul’s hand clutches the bundle of rice cakes. Most of that 30 billion came from cutting employees’ bonuses. When Moon Gaeul starts to stand, the court officer looks this way.",
      "memo": [
        "Guilty on 8 of 12 advisory fee payments",
        "Mitigating factors: no-punishment letter, help with compensation plan, first offense, petition",
        "9th 'however' -- Kwon Dohyun and Oh Jinwoo’s 10,000 won bet",
        "A disturbance in court can mean detention for contempt"
      ],
      "choices": {
        "c44_court_leave": {
          "label": "Step out with Moon Gaeul and face the reporters"
        },
        "c44_court_note": {
          "label": "Write down the mitigating factors for the next trial"
        },
        "c44_court_hold": {
          "label": "Hold Moon Gaeul’s hand and listen to the end beside her"
        },
        "reframe": {
          "label": "Count forgiven-executive trials"
        },
        "c44_court_evidence_turn": {
          "label": "Find the ledger behind the letter"
        }
      },
      "place": "Seoul Central District Court · Courtroom 417",
      "clock": "September 10 · 10:31 · Judgment reading, minute 31",
      "question": "Compensation filled by cutting employees’ bonuses is being read as a reason to reduce the offender’s sentence. Beside Moon Gaeul as she starts to rise, what do you do?",
      "lead": "All 102 gallery seats are full, and Kwon Dohyun has already folded nine fingers."
    },
    "c44_lunch": {
      "title": "Eleven Bowls of Sundae Soup",
      "text": "A sundae-soup place in the alley behind the court. 11 people push three tables together. Moon Gaeul’s bundle of rice cakes lands on the table, minus the three the court officer took at the morning security check, saying 'Just one.' Moon Hajun shows on his sketchbook how many times the judge pushed up his glasses (14), and Kwon Dohyun wins the bet with a final 'however' count of twenty-three and collects 10,000 won from Oh Jinwoo. Oh Jinwoo hands over the bill and demands a recount. After the laughter goes round, Moon Gaeul puts down her spoon. 'They say the money that ruined my husband’s shop was 2.5 billion won. He goes home today and eats dinner. And we eat here.' Then Prosecutor Na Eunho walks in and takes the empty seat. The prosecutor sets gimbap, still in its foil, beside the sundae soup and raises one finger. 'To appeal, I need a reason. The deadline is 7 days.'",
      "memo": [
        "Judgment: 3 years in prison, suspended for 5 years, forfeiture of 2.56 billion won",
        "4 acquittals -- the e-signature field on the approvals is empty",
        "Prosecution’s appeal deadline: 7 days from sentencing",
        "Na Eunho: needs new evidence or grounds to overturn the sentence"
      ],
      "choices": {
        "c44_lunch_money": {
          "label": "Find a way for the forfeiture to reach the victims first"
        },
        "c44_lunch_state": {
          "label": "Give a statement as a witness who knows all 12 dates"
        },
        "c44_lunch_ask": {
          "label": "Gather the group’s wishes into a letter asking for appeal"
        },
        "reframe": {
          "label": "Count forgiven-executive trials"
        },
        "c44_lunch_evidence_turn": {
          "label": "Find the ledger behind the letter"
        }
      },
      "place": "Alley Behind the Seocho-dong Court · Sundae-Soup Place",
      "clock": "September 10 · 12:20",
      "question": "The prosecutor sits down by the sundae soup and asks for a reason to appeal. What do you put on the table?",
      "lead": "An hour after the sentencing, 11 people walked without a word and stopped at the same moment in front of a steaming shop."
    },
    "c44_final": {
      "title": "The Word That It’s Over",
      "text": "Seventeen cameras guard the main gate of Seoul Central District Court. KD Financial Group’s PR office has already sent out its statement. 'We respect the court’s judgment, and the Group’s reform will continue.' Reporters herd their microphones toward Moon Gaeul. She has turned down interviews all day. A black jacket instead of an apron, two leftover rice cakes in her hand. Moon Gaeul pushes one microphone away with the back of her hand and says one sentence. 'The judge set the sentence. But saying it’s over, we’ll do that.' The cameras swing toward you all at once. The appeal deadline is 7 days, and the 2.56 billion won forfeiture goes into the national treasury. Not a single won of it goes to the 1,740 people. The next sentence is yours.",
      "memo": [
        "17 cameras -- Group statement: 'reform will continue'",
        "2.56 billion won forfeiture -- goes to the treasury, not to victims",
        "Appeal deadline D-7, the decision is the prosecution’s",
        "Moon Gaeul: 'saying it’s over is ours'"
      ],
      "choices": {
        "c44_final_fund": {
          "label": "Say you’ll negotiate now to put the forfeiture to compensation"
        },
        "c44_final_mic": {
          "label": "Hand the microphone to the group and stand behind Moon Gaeul"
        },
        "c44_final_appeal": {
          "label": "File a victims’ opinion asking the prosecution to appeal"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Seoul Central District Court · Road outside the front gate",
      "clock": "September 10 · 17:20",
      "question": "Behind Moon Gaeul, who says they will be the ones to say it’s over, 17 cameras look at you. What is your next sentence?",
      "lead": "The sun has dipped and the shadow of the court gate has grown long. Moon Gaeul puts the two leftover rice cakes in her jacket pocket."
    },
    "c44_aftershock": {
      "title": "Rice Cakes on Sentencing Day",
      "text": "Yoon Sanghyuk got 3 years in prison, suspended for 5 years, and walked home. At Gaeul Rice Cake Shop, its shutter half down, 11 people gather. Na Junhyuk passes on what the Yeongdong seniors thought. 'They said the court was colder than they expected. Who pays the power bill, they asked.' Kang Taemin brings Seo Jiho, the former night-shift worker who came to the court as a paid line-stander, and has him fold rice-cake boxes. Kwon Dohyun splits the lunch bill for sundae soup into 1/11 shares and gets told by Moon Gaeul, 'Don’t stick a bill on free rice cakes.' Moon Hajun tears a page from his sketchbook and tapes it to the wall. Beside the judge’s face: 'however ×23', the number of times the judge turned the sentence around during the 43 minutes of reading. At 10 p.m., Lim Soyul, granddaughter of Lim Kyungsoo, who is in Ieum Hospital, calls. 'Grandpa heard the sentencing on the radio in his room. Then he started looking for an envelope. He says it’s time to hand it over. But he’s so short of breath.'",
      "memo": [
        "Result: suspended sentence, not taken into custody",
        "Gaeul Rice Cake Shop wall: Moon Hajun’s 'however ×23'",
        "Seo Jiho, first day folding rice-cake boxes",
        "Lim Kyungsoo: 'it’s time to hand it over' -- short of breath"
      ],
      "choices": {
        "c44_after_rush": {
          "label": "Go straight to the prosecutors and build the appeal with Na Eunho"
        },
        "c44_after_warm": {
          "label": "Pack the leftover rice cakes and all go to Lim Kyungsoo"
        },
        "c44_after_record": {
          "label": "Get the full judgment and write a plain guide for the group"
        }
      },
      "place": "Mangwon Market Gaeul Rice Cake Shop · Shutter Half Down",
      "clock": "September 10 · 22:00",
      "question": "On the night of sentencing, gathered at the rice cake shop, a call comes that Lim Kyungsoo is short of breath. How do you close this night?"
    },
    "c44_cap": {
      "title": "Navy Caps",
      "text": "One of the navy caps sees Kang Taemin and bows his head. Seo Jiho, twenty-six. A FlowOn night-shift worker whose contract ended last winter, the month 120 robots came in. Now he lives day to day on a line-standing app. Yesterday an idol fan signing, today the court. He says he didn’t know whose trial it was. Kang Taemin pours barley tea into the thermos cap and hands it over. Seo Jiho fiddles with the brim of his cap. 'Foreman, if I win this I get 50,000 won more. I’m exactly 50,000 won short on rent this month.'",
      "memo": [
        "Seo Jiho: former FlowOn night shift, contract ended when the robots came",
        "Line-standing pay 120,000 won a day + 50,000 won if he wins",
        "Seo Jiho doesn’t know who the client is"
      ],
      "choices": {
        "c44_cap_choice_1": {
          "label": "Cover the 50,000 won and give him work for the group"
        },
        "c44_cap_choice_3": {
          "label": "It’s his day’s pay -- leave the line as it is"
        },
        "c44_cap_choice_2": {
          "label": "Take Seo Jiho’s job text as evidence"
        }
      },
      "place": "Seoul Central District Court · Road Outside the East Wing",
      "clock": "September 10 · Dawn 05:10",
      "question": "The face under the navy cap belongs to a night-shift worker who lost his place to a robot. What do you do about his 50,000 won?"
    },
    "c44_verdict": {
      "title": "The Order",
      "text": "The presiding judge reads the order. 3 years in prison, suspended for 5 years. Forfeiture of 2.56 billion won. 4 of the 12 counts are acquittals. Those four approvals went through a shared account, so the e-signature field is empty and the approver cannot be identified. He is not taken into custody. Yoon Sanghyuk bows toward the bench and walks out with his eight lawyers. Somewhere in the gallery, someone cries briefly. Moon Hajun writes in the corner of his sketchbook. 'Empty field = acquittal.'",
      "memo": [
        "3 years in prison, suspended for 5 years, forfeiture of 2.56 billion won",
        "4 acquittals: shared-account approvals, e-signature field empty",
        "Yoon Sanghyuk leaves the courtroom, not taken into custody"
      ],
      "choices": {
        "c44_verdict_choice_3": {
          "label": "Follow Yoon Sanghyuk straight down the corridor"
        },
        "c44_verdict_choice_2": {
          "label": "Post the gist of the ruling to the group chat as is"
        },
        "c44_verdict_choice_1": {
          "label": "Go to Moon Gaeul first and stand by her in silence"
        }
      },
      "place": "Seoul Central District Court · Courtroom 417",
      "clock": "September 10 · 10:43",
      "question": "Four empty e-signature fields became acquittals, and Yoon Sanghyuk walks out. Right after the sentencing, where do you stand?"
    },
    "c44_petition": {
      "title": "1,204 Sheets",
      "text": "Do Yoonha leafs through the petition list Na Eunho left behind. Of the 1,204, thirty-one are Gangseo Branch staff. On the sixth page, Do Yoonha’s hand stops. Tak Yerin. The assistant manager who fought to the end to overturn NOAH’s rejection. Next to the name, the collection route is printed. 'Chuseok gift request screen.' On the intranet, you picked a gift set, pressed 'Next', and a 'Colleague signature for organizational stability' field followed. Do Yoonha closes the list. 'People whose bonuses were cut begged leniency for the man who took the credit with that money. While picking gift sets.'",
      "memo": [
        "Of the 1,204 petition sheets, 31 from Gangseo Branch",
        "How it was signed: the next field after the Chuseok gift request screen",
        "Includes Tak Yerin’s signature"
      ],
      "choices": {
        "c44_petition_choice_1": {
          "label": "Call Tak Yerin and hear how she signed"
        },
        "c44_petition_choice_3": {
          "label": "Blame no one who signed and close the list"
        },
        "c44_petition_choice_2": {
          "label": "Ask the prosecution to look into how signatures were gathered"
        }
      },
      "place": "Alley Behind the Seocho-dong Court · Café Window Seat",
      "clock": "September 10 · 14:10",
      "question": "People whose bonuses were cut signed a leniency petition while picking gift sets. What do you do with this list?"
    },
    "c44_cap_reaction": {
      "title": "The Price of 20",
      "text": "On the app screen Seo Jiho shows you, the client’s name is up. 'Moment PR'. Kwon Dohyun finds it in two searches. A PR firm that has run events for KD Financial Group affiliates for 3 years. Kwon Dohyun takes out his calculator, then puts it back. '20 people at 120,000 won is 2.4 million won. That means the price of keeping 20 victims’ family members outside the courtroom is 2.4 million won.' He looks around once at the people in caps. 'They blocked it cheap. At this price, their side is in the black.'",
      "memo": [
        "Client: a PR firm that runs events for Group affiliates",
        "20 people × 120,000 won = 2.4 million won"
      ],
      "choices": {
        "c44_cap_reaction_choice_3": {
          "label": "The lottery is luck anyway -- let it go"
        },
        "c44_cap_reaction_choice_1": {
          "label": "Explain to the 20 navy caps and ask for their places"
        },
        "c44_cap_reaction_choice_2": {
          "label": "Capture the job record and notify the court in writing"
        }
      },
      "place": "Seoul Central District Court · East Wing Lobby",
      "clock": "September 10 · 07:50",
      "question": "Keeping 20 victims’ family members outside cost 2.4 million won. How do you make them pay that price?"
    },
    "c44_verdict_reaction": {
      "title": "Seaweed Soup",
      "text": "Yoon Seojin is waiting at the vending machine at the end of the corridor. Her face is flushed. 'Dad comes home today. Mom says she’s making seaweed soup tonight. It’s not even a birthday.' She gets two canned coffees and holds one out. 'I heard the order earlier. The empty field.' She pauses for exactly 3 seconds. 'I’m glad Dad is coming home today. And I hate myself for being glad.' The hand holding the can shakes. 'You know both of those can be true at once?'",
      "memo": [
        "Being glad, and hating being glad",
        "The unopened can on top of the vending machine"
      ],
      "choices": {
        "c44_verdict_reaction_choice_2": {
          "label": "Ask her to tell the prosecution what she knows of the field"
        },
        "c44_verdict_reaction_choice_3": {
          "label": "Say you have nothing to say now and go back to the group"
        },
        "c44_verdict_reaction_choice_1": {
          "label": "Take the coffee and stay until she finishes"
        }
      },
      "place": "Seoul Central District Court · 4th-floor hallway",
      "clock": "September 10 · 10:55",
      "question": "Someone who is glad her father is coming home, and hates herself for it, holds out a canned coffee. What do you do?"
    },
    "c44_petition_reaction": {
      "title": "The Hanwoo Beef Set",
      "text": "Over the phone you hear a branch shutter rolling down. It’s Tak Yerin. 'It’s my signature. I picked the Hanwoo beef set, and the next screen said to enter my name, so I did. Everyone did.' A long silence, then the voice drops. 'When Hajun was an intern and I watched NOAH reject To-the-End Precision all the way, I cried in the restroom. And then I signed my name asking for leniency for the man who sat above all that. Can it be erased? If not, can you at least write down somewhere that I didn’t know?'",
      "memo": [
        "The signature on the screen after the Hanwoo beef set",
        "If it can’t be erased, at least a record that I didn’t know"
      ],
      "choices": {
        "c44_petition_reaction_choice_1": {
          "label": "Visit the branch tomorrow to find a way to erase it together"
        },
        "c44_petition_reaction_choice_3": {
          "label": "Say honestly that after sentencing nothing will change"
        },
        "c44_petition_reaction_choice_2": {
          "label": "Draft a confirmation form to withdraw the signature and send it"
        }
      },
      "place": "KD Bank Gangseo Branch · Banking Hall, Shutter Coming Down",
      "clock": "September 10 · 16:05",
      "question": "If it can’t be erased, the request is to at least write down that Tak Yerin didn’t know. How do you answer?"
    },
    "c44_branch_seal": {
      "title": "Forgiveness with Only a Seal",
      "text": "As you take notes, Ban Jaewook tilts his phone toward you. It’s a copy of the no-punishment letter that Prosecutor Na Eunho let him view last night. At the very bottom, the 'CEO, KD Bank' field is empty, with only the corporate seal stamped beside it. The date is August 28, the day before the board agenda was set. Ban Jaewook opens his notebook and shows you the line he just wrote. 'The company forgave. Who forgave is nowhere.' Right now, the presiding judge is reading out that very document as grounds.",
      "memo": [
        "No-punishment letter: CEO signature field empty, corporate seal only",
        "Dated August 28 -- the day before the board agenda was fixed",
        "Ban Jaewook’s notebook: 'Who forgave is nowhere'",
        "The court is reading this letter as a mitigating factor"
      ],
      "choices": {
        "c44_branch_seal_c": {
          "label": "Hear the sentencing first and use the photo later"
        },
        "c44_branch_seal_a": {
          "label": "Show Moon Gaeul the photo first and ask what she wants"
        },
        "c44_branch_seal_b": {
          "label": "Pass a note to the prosecutor’s table about the empty signature field"
        }
      },
      "place": "Seoul Central District Court · Courtroom 417 Gallery",
      "clock": "September 10 · 10:36",
      "question": "The letter of forgiveness has no person’s name on it. Now, as the judge reads that letter, what do you do?"
    },
    "c44_branch_seal_follow": {
      "title": "3 Minutes Before the Order",
      "text": "The presiding judge turns to the last page. 3 minutes to the conclusion. At the prosecutor’s table, Na Eunho turns around, glances once at Ban Jaewook’s phone, and faces front again. The lips form two short words. 'Too late.' There is no way to submit new material on sentencing day. The only place it can go is an appeal, and the deadline is 7 days from sentencing. In the back row of the gallery sits a young woman with a cap pulled low. Yoon Seojin, Yoon Sanghyuk’s daughter. You know she saw the screen of the phone on this side.",
      "memo": [
        "No additional evidence on sentencing day",
        "Appeal deadline: 7 days from sentencing",
        "Back row of the gallery: Yoon Seojin",
        "Photo original is in Prosecutor Na Eunho’s viewing record"
      ],
      "choices": {
        "c44_branch_seal_follow_b": {
          "label": "Organize the photo and date into appeal material within 7 days"
        },
        "c44_branch_seal_follow_c": {
          "label": "Give the photo to Seo Harin for a story today"
        },
        "c44_branch_seal_follow_a": {
          "label": "Stay beside Moon Gaeul the moment the conclusion comes"
        }
      },
      "place": "Seoul Central District Court · Courtroom 417 Gallery",
      "clock": "September 10 · 10:40 · 3 minutes to the conclusion",
      "question": "No new material can be filed on sentencing day, and Yoon Seojin is watching from the back row. How do you use the last 3 minutes?"
    },
    "c44_route_system": {
      "title": "The Statistics of Forgiveness",
      "text": "Looking for words to answer the no-punishment letter, you stop. At the suggestion to count how many trials ended with a company forgiving its executive, Lee Minseo moves. Public court ruling search results come up on the laptop on the bookshop table. In the last 10 years, 64 first-instance rulings on breach of trust by financial company executives. 49 were suspended sentences. In 41 of those, the victim company had filed a no-punishment letter. Only two of those letters came with a board resolution attached. Lee Minseo turns the screen around. 'When the company forgives, the person goes home. But who inside the company decided to forgive is written down almost nowhere.'",
      "memo": [
        "Of 64 first-instance breach-of-trust rulings on financial executives, 49 suspended sentences",
        "Of those, 41 with no-punishment letters in the company’s name",
        "2 letters with a board resolution attached"
      ],
      "choices": {
        "c44_route_system_drop": {
          "label": "Shelve the statistics and just wait for the sentencing"
        },
        "c44_route_system_rule": {
          "label": "Require board resolutions and named signatures on such letters"
        },
        "c44_route_system_publish": {
          "label": "Release the statistics to Seo Harin and the group at once"
        },
        "c44_route_system_evidence_turn": {
          "label": "Find the ledger behind the letter"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Laptop by the Shelves",
      "clock": "September 9 · Sentencing D-1 · 23:40",
      "question": "Of the 41 cases where a company forgave, only two record who did the forgiving. What do you do with these statistics?"
    },
    "c44_final_system_route": {
      "title": "Whose Forgiveness",
      "text": "At two in the morning on sentencing day, the laptop by the shelves lines up the 64 rulings by date. Lee Minseo keeps only the 41 with no-punishment letters and pages through for where it says who decided to forgive. Two have a board resolution attached; the other 39 have no such page. Eight hours to sentencing. Without taking her eyes off the screen, she speaks. 'Forty-one companies forgave, but the people who decided to forgive show up in only two. The letter filed yesterday is the 42nd. If we can’t find a person there either, then whose forgiveness is the judge reading in the morning?'",
      "memo": [
        "41 no-punishment letters in company names -- 2 with a board resolution attached",
        "Filed yesterday: no-punishment letter in KD Bank’s name",
        "Sentencing: today at 10, Room 417"
      ],
      "choices": {
        "c44_final_system_route_c": {
          "label": "File a complaint to name who decided KD Bank’s letter"
        },
        "c44_final_system_route_b": {
          "label": "Leave the system as is and accept this sentence"
        },
        "c44_final_system_route_a": {
          "label": "Propose that harmed employees consent to company forgiveness"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Laptop by the Shelves",
      "clock": "September 10 · Dawn 02:15",
      "question": "41 companies forgave, and only two record the person who decided to. Before sentencing, whose name will you find in that letter?"
    },
    "c44_evidence_turn": {
      "title": "The Name of Who Paid",
      "text": "The morning’s judgment was 3 years in prison, suspended for 5 years, and one line among the reasons for reducing the sentence was 'that much of the damage has been recovered'. When you set the clue against that phrase, one line of KD Bank’s general ledger opens. Of the 30 billion won voluntary compensation plan, 21 billion won made by cutting employees’ bonuses was renamed on August 28 as 'Yoon Sanghyuk matter damage recovery reserve'. That is the day the no-punishment letter was made. Ban Jaewook opens the very back page of his notebook. 'The man who took it has 2.5 billion won in forfeiture, and the ones who paid were the employees, yet the judgment says he paid. This one line, I’ll write down.'",
      "memo": [
        "21 billion won: employees’ bonus cuts",
        "Account renamed August 28: 'Yoon Sanghyuk matter damage recovery reserve'",
        "Mitigating factor in the judgment: 'much of the damage recovered'",
        "Ban Jaewook’s notebook: the names of 47 people who lost their jobs to his investigations over 20 years"
      ],
      "choices": {
        "c44_evidence_turn_submit": {
          "label": "Formally submit the ledger copy to the prosecution for appeal"
        },
        "c44_evidence_turn_hold": {
          "label": "Hold the ledger as a card in compensation talks with the Group"
        },
        "c44_evidence_turn_share": {
          "label": "Tell the employees whose bonuses were cut about this line first"
        }
      },
      "place": "Seoul Central District Prosecutors’ Office · Records Room",
      "clock": "September 10 · 16:30",
      "question": "The 21 billion won the employees paid was renamed in the ledger as money the offender repaid. How do you use this one line?"
    },
    "c44_start_warm": {
      "title": "The Night Before Sentencing, for the One Who Stayed in the Corridor",
      "text": "The day the dismissal motion passed 5 to 3, you stayed with the one-share group and with Yoon Seojin, who had been watching her father, from the 33rd-floor corridor to the tent bar outside the company, until you parted at two in the morning. Two days later, those people gather again on the 1st floor of the bookshop. Tomorrow is the first-instance sentencing in the Haeon Partners advisory fee case. The charge is breach of trust. Do Yoonha reads the news that came in this afternoon. Yoon Sanghyuk’s side filed a no-punishment letter in KD Bank’s name and a petition from 1,204 employees. 'Not one person in that corridor signed this paper. And yet it’s 1,204.'",
      "memo": [
        "Everyone in the one-share group from that corridor applied for gallery passes",
        "No-punishment letter in KD Bank’s name filed",
        "1,204 petition sheets -- list of signers not disclosed"
      ],
      "choices": {
        "c44_start_warm_signature": {
          "label": "Stand in the gallery line all night with the corridor crowd"
        },
        "c44_start_warm_seats": {
          "label": "Secure gallery seats for the group first"
        },
        "c44_start_warm_brief": {
          "label": "Write a rebuttal to the letter overnight for the prosecution"
        },
        "c44_start_warm_trace": {
          "label": "Leave the sentencing to reporters and chase the money"
        },
        "c44_start_warm_reframe": {
          "label": "Count forgiven-executive trials"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Table Between the Shelves",
      "clock": "September 9 · Sentencing D-1 · 22:10",
      "question": "No one who held out in the corridor with you signed, yet there are 1,204 petition sheets. What do you do first?",
      "lead": "The faces that held the 33rd-floor corridor together on board day sit among the shelves, just as they were."
    },
    "c44_start_record": {
      "title": "The Night Before Sentencing, for the One Who Wrote Down the Vote",
      "text": "At the end of the vote record you wrote line by line on board day, you also copied the date stamped in the corner of the draft resolution. August 28. Ban Jaewook sets that date next to the document filed with the court today. The dates match. It’s the day KD Bank made the document for the court in the Haeon Partners advisory fee case. The charge in that case is breach of trust. The document is a no-punishment letter. The day before the board agenda was set. Sentencing is tomorrow at 10 a.m. Ban Jaewook does not close the record. 'There’s no meeting anywhere where the company decided to forgive. The forgiveness came before the meeting.'",
      "memo": [
        "Draft resolution date matches no-punishment letter date: August 28",
        "No record of a meeting that decided the letter",
        "Sentencing tomorrow at 10 a.m."
      ],
      "choices": {
        "c44_start_record_brief": {
          "label": "Write a rebuttal to the letter overnight for the prosecution"
        },
        "c44_start_record_signature": {
          "label": "Chart the August 28 date and send it to the prosecution"
        },
        "c44_start_record_seats": {
          "label": "Secure gallery seats for the group first"
        },
        "c44_start_record_trace": {
          "label": "Leave the sentencing to reporters and chase the money"
        },
        "c44_start_record_reframe": {
          "label": "Count forgiven-executive trials"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Table Between the Shelves",
      "clock": "September 9 · Sentencing D-1 · 22:10",
      "question": "There is no meeting that decided to forgive, but there is a date for the forgiveness. How do you use this date?",
      "lead": "Paging through the board-day vote record, Ban Jaewook stops at the line where you copied the date of the draft resolution."
    },
    "c44_start_rush": {
      "title": "The Night Before Sentencing, for the One Who Ran Ahead",
      "text": "You rode the same elevator as the dismissed Yoon Sanghyuk. Neither of you spoke the whole 32 floors down, and when the doors opened on the 1st floor he said just one thing. 'See you on sentencing day.' For the two days since, you went back and forth to the court’s filing office, so you were the first to see the documents come in this afternoon. A no-punishment letter in KD Bank’s name, and 1,204 petition sheets. Tomorrow at 10 a.m. is the first-instance sentencing in the Haeon Partners advisory fee case. The charge is breach of trust. Oh Jinwoo gets up from a filing office chair. 'We came fast and saw it fast. There’s no time to stop it.'",
      "memo": [
        "Elevator, 33rd floor to 1st -- Yoon Sanghyuk: 'See you on sentencing day'",
        "Saw the letter and petition being filed firsthand",
        "Bookshop colleagues haven’t heard yet"
      ],
      "choices": {
        "c44_start_rush_trace": {
          "label": "Leave the sentencing to reporters and chase the money"
        },
        "c44_start_rush_brief": {
          "label": "Write a rebuttal to the letter overnight for the prosecution"
        },
        "c44_start_rush_signature": {
          "label": "Tell the group tonight what you saw filed"
        },
        "c44_start_rush_seats": {
          "label": "Secure gallery seats for the group first"
        },
        "c44_start_rush_reframe": {
          "label": "Count forgiven-executive trials"
        }
      },
      "place": "Seoul Central District Court · Filing Office Waiting Room",
      "clock": "September 9 · Sentencing D-1 · 17:40",
      "question": "You were the first to see the documents come in, but there’s no time to stop them. Who do you take what you saw to first?",
      "lead": "On the same filing office chair for a second day, you saw two document envelopes go through the intake window."
    }
  },
  "echoReplies": {
    "c44_start_seats": "Once the seats are handled, 38 members of the group gather at four in the morning. The night passes with no one writing a rebuttal.",
    "c44_start_brief": "The rebuttal arrives at three in the morning. The court has no time to read paper that came the night before sentencing. It stays in the prosecution’s record.",
    "c44_start_trace": "Chasing the money, you see one more line tracing the rest of the Haeon advisory fees to a Singapore account. You are still holding that line at four in the morning when Kang Taemin’s call pulls you out to the court.",
    "c44_lottery_give": "When you hand it over, Moon Gaeul holds the pass and looks at it for a long time. Your own seat exists only if a pass is left after the 8:00 lottery.",
    "c44_lottery_report": "The lottery runs 20 minutes late while the court officer checks. The answer comes back that no rule forbids standing in line for money. The 20 navy caps stay in line, and the seniors behind them rub their legs.",
    "c44_lottery_press": "You are promised the seat beside the press box. But if Moon Gaeul’s number is called at 8:00, you will give up that seat and move to sit beside her.",
    "c44_court_hold": "When you take her hand, Moon Gaeul sits back down. That hand does not let go once in 43 minutes.",
    "c44_court_note": "The mitigating factors you write down come to eleven lines. Three of them point to the same 30 billion won.",
    "c44_court_leave": "In the corridor, the cameras catch Moon Gaeul’s trembling face. She turns away without a word, and the two of you hear the conclusion standing just inside the courtroom door.",
    "c44_lunch_ask": "As the letter comes together, the 11 people each write a line beside the sundae soup, and the other 27 add theirs through the group chat. Moon Gaeul’s line is the shortest. 'To the end.'",
    "c44_lunch_state": "When you say you’ll give a statement, Na Eunho puts down the spoon for the first time. 'Then you take the stand as a witness too. Their eight lawyers will ask about every one of your 3 years.'",
    "c44_lunch_money": "When you say to find the money first, Moon Gaeul nods. Na Eunho says, 'That’s not my job,' finishes the sundae soup, and leaves.",
    "c44_final_mic": "When you hand over the microphone, 38 members of the group line up behind Moon Gaeul. Your face does not appear on the evening news.",
    "c44_final_appeal": "The opinion is filed that night. Whether to appeal is the prosecution’s call, and for 7 days the group chat opens every morning with the same question.",
    "c44_final_fund": "When you say you’ll negotiate, the Group PR office gets in touch within an hour. It’s so fast that Ban Jaewook writes the time in his notebook.",
    "c44_after_warm": "When you arrive with the rice cakes, 11 people stand by the hospital window. Lim Kyungsoo opens his eyes and knows the smell of rice cakes first.",
    "c44_after_record": "The guide is done at two in the morning. Its first sentence is 'An empty field is not an acquittal.' You go to the hospital in the morning.",
    "c44_after_rush": "The lights at the prosecutors’ office stay on until eleven at night. The skeleton of the appeal brief takes shape. Two missed calls from Lim Soyul pile up.",
    "c44_cap_choice_1": "With the 50,000 won covered, Seo Jiho takes off the navy cap and carries Moon Gaeul’s bundle of rice cakes. One place in the line opens, and another part-timer fills it.",
    "c44_cap_choice_2": "The text becomes evidence. Seo Jiho knows he may never get another job from that app.",
    "c44_cap_choice_3": "The line stays as it is. If Seo Jiho wins, he pays his rent, and one member of the group watches the sentencing on the corridor monitor.",
    "c44_verdict_choice_1": "Standing beside her, Moon Gaeul says nothing for a long time. Then she takes out a rice cake and presses it into your hand.",
    "c44_verdict_choice_2": "When the gist goes up, the group chat is silent for 1 minute. Then 40 messages come in asking, 'What’s an empty field?'",
    "c44_verdict_choice_3": "In the corridor, Yoon Sanghyuk does not slow down. His eight lawyers stand like a wall between you and him.",
    "c44_petition_choice_1": "When you call, Tak Yerin makes no excuses. Instead, Tak Yerin explains step by step how the branch administrator sent the request link around.",
    "c44_petition_choice_2": "Once you ask, the signing method comes under investigation. All 31 will each have to be called in to explain. Do Yoonha says one person should hear it first and makes a call.",
    "c44_petition_choice_3": "The number 1,204 stays in the judgment as it is. On top of the closed list, Do Yoonha’s phone rings. It’s Tak Yerin.",
    "c44_cap_reaction_choice_1": "Of the 20 who hear the story, 7 take off their caps. The rest lower their heads, saying they can’t give up the day’s pay.",
    "c44_cap_reaction_choice_2": "The written notice is filed. The court reads that paper after the sentencing is over.",
    "c44_cap_reaction_choice_3": "Letting it go keeps today quiet. The navy caps come to the next trial too.",
    "c44_verdict_reaction_choice_1": "As you stay, Yoon Seojin talks about her father until the can is empty. Most of the stories are good ones.",
    "c44_verdict_reaction_choice_2": "Hearing the request, Yoon Seojin’s face hardens. 'You’re asking me to report my dad?' She turns away without waiting for an answer.",
    "c44_verdict_reaction_choice_3": "Behind your back as you leave, a can pops open once. The second can stays unopened on top of the vending machine.",
    "c44_petition_reaction_choice_1": "When you go, Tak Yerin is waiting at the branch’s back door, with two colleagues who signed on the same screen.",
    "c44_petition_reaction_choice_2": "Once the form goes out, 19 of the 31 submit withdrawals. The judgment is already out, but the record remains.",
    "c44_petition_reaction_choice_3": "At your honesty, Tak Yerin laughs, 'Right.' The laugh does not last until the call ends.",
    "c44_branch_seal_a": "After looking at the photo for a long while, Moon Gaeul speaks. 'A person stamps a seal. I want to know that person’s name.'",
    "c44_branch_seal_b": "The note reaches the prosecutor’s table. Na Eunho reads it, folds it, and tucks it at the front of the file.",
    "c44_branch_seal_c": "The photo stays on the phone. For the 3 minutes the judge reads that letter, you know and do nothing.",
    "c44_branch_seal_follow_a": "You stay beside her, and the moment the conclusion comes, Moon Gaeul grabs your sleeve. The photo stays in your pocket.",
    "c44_branch_seal_follow_b": "The bundled material becomes a 7-day clock. Today is day one.",
    "c44_branch_seal_follow_c": "The story runs at three in the afternoon. The two words 'empty field' in the headline move the Group PR office an hour sooner.",
    "c44_route_system_publish": "Once released, '49 of 64 cases' becomes the headline of Seo Harin’s story. It’s the night before sentencing, so the judge sees the headline too.",
    "c44_route_system_rule": "The proposal goes first to Aide Cha Jiwon at the National Assembly. 'It explains itself in 7 minutes.' For the first time, she doesn’t count the seconds.",
    "c44_route_system_drop": "With the statistics shelved, tomorrow is a quiet sentencing. 64 cases become 65.",
    "c44_final_system_route_a": "Requiring employee consent slows the company’s forgiveness. Slowed down, the forgiveness shows for the first time whose it is.",
    "c44_final_system_route_b": "Once you accept it, the morning’s sentence heads toward becoming final as it is. The 12,000 people whose bonuses were cut appear nowhere in that letter.",
    "c44_final_system_route_c": "With the complaint filed, the field where no forgiver was written becomes the subject of an investigation. Asking who left it empty takes months.",
    "c44_evidence_turn_submit": "Once submitted, the ledger line goes on the first page of the appeal brief. The Group legal team renames the account again that night. It’s already too late.",
    "c44_evidence_turn_hold": "Holding it, the Group’s voice drops at the negotiating table. The employees get next month’s pay slips without knowing that line.",
    "c44_evidence_turn_share": "Once told, screenshots spread on the company message board. The first of 1,300 comments is 'My bonus was repaid in that man’s name?'",
    "c44_lottery_evidence_turn": "Set the date against the ledger, and who paid splits from who was written down as paying. The distance between them is one account name. That line opens only in the afternoon, after the sentencing.",
    "c44_court_evidence_turn": "Set the date against the ledger, and who paid splits from who was written down as paying. The distance between them is one account name. That line opens only in the afternoon, after the sentencing.",
    "c44_lunch_evidence_turn": "Set the date against the ledger, and who paid splits from who was written down as paying. The distance between them is one account name. That line opens only in the afternoon, after the sentencing.",
    "c44_route_system_evidence_turn": "Set the date against the ledger, and who paid splits from who was written down as paying. The distance between them is one account name. That line opens only in the afternoon, after the sentencing.",
    "case44_memory_system": "Even reading the statement to the end, there is no trace of the table having moved. Instead, Lee Minseo searches 10 years of trials where a company forgave.",
    "case44_memory_evidence": "Raise the date, and the habit of writing the ending first shows up in the ledger too. One line of compensation changed its name before the sentencing.",
    "c44_start_warm_seats": "Once the seats are handled, 38 members of the group gather at four in the morning. The night passes with no one writing a rebuttal.",
    "c44_start_warm_brief": "The rebuttal arrives at three in the morning. The court has no time to read paper that came the night before sentencing. It stays in the prosecution’s record.",
    "c44_start_warm_trace": "Chasing the money, you see one more line tracing the rest of the Haeon advisory fees to a Singapore account. You are still holding that line at four in the morning when Kang Taemin’s call pulls you out to the court.",
    "c44_start_warm_signature": "Standing all night, the front of the line is ours. At three in the morning, Kang Taemin passes the thermos around.",
    "c44_start_record_seats": "Once the seats are handled, 38 members of the group gather at four in the morning. The night passes with no one writing a rebuttal.",
    "c44_start_record_brief": "The rebuttal arrives at three in the morning. The court has no time to read paper that came the night before sentencing. It stays in the prosecution’s record.",
    "c44_start_record_trace": "Chasing the money, you see one more line tracing the rest of the Haeon advisory fees to a Singapore account. You are still holding that line at four in the morning when Kang Taemin’s call pulls you out to the court.",
    "c44_start_record_signature": "The chart arrives. Prosecutor Na Eunho’s reply is two words. 'Too late.' Still, the chart stays in the record.",
    "c44_start_rush_seats": "Once the seats are handled, 38 members of the group gather at four in the morning. The night passes with no one writing a rebuttal.",
    "c44_start_rush_brief": "The rebuttal arrives at three in the morning. The court has no time to read paper that came the night before sentencing. It stays in the prosecution’s record.",
    "c44_start_rush_trace": "Chasing the money, you see one more line tracing the rest of the Haeon advisory fees to a Singapore account. You are still holding that line at four in the morning when Kang Taemin’s call pulls you out to the court.",
    "c44_start_rush_signature": "Once you tell them, the group chat buzzes all night. Moon Gaeul only asks, 'How many rice cakes should I steam?'"
  },
  "choiceVoiceLines": {
    "c44_start_seats": "Saying people have to be seated first, you secure gallery seats for the group.",
    "c44_start_brief": "Saying you can’t let the company do the forgiving for others, you write a rebuttal to the no-punishment letter overnight and send it to the prosecution.",
    "c44_start_trace": "Saying the sentence may not change but the money can be found, you leave the sentencing to reporters and chase where the diverted money went.",
    "c44_lottery_give": "Saying the people who need to hear this sentencing aren’t us, you hand our winning passes to the group first.",
    "c44_lottery_report": "Saying a line bought with money shouldn’t mix into the lottery, you report the paid line-standing text to the court officer and ask for a check.",
    "c44_lottery_press": "Saying whoever wins, someone has to be inside taking notes, you get the seat beside the press box and go in first to start the record.",
    "c44_court_hold": "Because you can’t let her be dragged out here, you hold Moon Gaeul’s hand and sit beside her to the end.",
    "c44_court_note": "Saying you have to know the reasons exactly to overturn them, you write the mitigating factors down line by line for the next trial.",
    "c44_court_leave": "So she can say it outside before the court officer comes, you step out first with Moon Gaeul and stand before the reporters.",
    "c44_lunch_ask": "Because whether to fight again is for the people eating here to decide, you gather the group’s wishes into a letter asking for an appeal.",
    "c44_lunch_state": "Saying the reason the prosecutor is looking for is sitting right here, you offer to give a statement as a witness who knows all 12 dates.",
    "c44_lunch_money": "Saying a longer sentence won’t bring the shop back, you suggest finding a way for the forfeiture to reach the victims before any appeal.",
    "c44_final_mic": "Saying the word that it’s over belongs to these people, you hand the microphone to the group and stand behind Moon Gaeul.",
    "c44_final_appeal": "To put on paper within 7 days that it isn’t over, you file a victims’ opinion in the group’s name asking the prosecution to appeal.",
    "c44_final_fund": "Saying you’ll fix the fact that not a won goes to the 1,740 people first, you announce you’ll negotiate with the Group now to put the forfeiture toward compensation.",
    "c44_after_warm": "Because you can’t keep someone short of breath waiting, you pack the leftover rice cakes and all go to Lim Kyungsoo together.",
    "c44_after_record": "So the group can read what the judgment says, you get the full text and first write a plain guide for them.",
    "c44_after_rush": "Saying the 7 days start shrinking today, you go straight to the prosecutors’ office and build the grounds for appeal with Na Eunho.",
    "c44_cap_choice_1": "Saying a line stood for 50,000 won of rent can be traded for other work, you cover the missing 50,000 won and give him a job for the group.",
    "c44_cap_choice_2": "Because this is the only way to show who bought the line, you take Seo Jiho’s job text as evidence.",
    "c44_cap_choice_3": "Because you can’t blame someone who stood without knowing whose trial it was, you leave the line, his day’s pay, as it is and walk past.",
    "c44_verdict_choice_1": "Because no words are enough right now, you go to Moon Gaeul first and stand beside her in silence.",
    "c44_verdict_choice_2": "Saying those who couldn’t get in should hear the same words, you write down the gist of the ruling and post it to the group chat as is.",
    "c44_verdict_choice_3": "Saying whose empty field it is has to be asked of him, you follow Yoon Sanghyuk straight down the corridor.",
    "c44_petition_choice_1": "Not wanting to judge anyone by one line on a list, you call Tak Yerin directly and hear how the signature happened.",
    "c44_petition_choice_2": "Saying names taken from a gift request screen went into the sentence, you ask the prosecution to investigate how the signatures were gathered.",
    "c44_petition_choice_3": "Because these names were written while picking gift sets, you blame no one who signed and close the list.",
    "c44_cap_reaction_choice_1": "Because they stood without knowing whose trial it was, you explain the situation to the 20 navy caps and ask for their places.",
    "c44_cap_reaction_choice_2": "Saying the court should know even the price of keeping people outside, you capture the job record and notify the court in writing.",
    "c44_cap_reaction_choice_3": "Since the lottery is luck anyway, you let the 2.4 million won line go without a fuss.",
    "c44_verdict_reaction_choice_1": "Knowing both feelings can be true at once, you take the canned coffee and stay beside her until she finishes.",
    "c44_verdict_reaction_choice_2": "Because four acquittals hang on that empty field, you ask her to tell the prosecution anything she knows about it.",
    "c44_verdict_reaction_choice_3": "Saying you have nothing to offer a daughter who is glad right now, you go back to the group.",
    "c44_petition_reaction_choice_1": "Because this isn’t something to finish over the phone, you visit the branch tomorrow to find a way to erase it together.",
    "c44_petition_reaction_choice_2": "So that at least the not knowing gets written down somewhere, you draft a confirmation form to withdraw the signature and send it.",
    "c44_petition_reaction_choice_3": "Not wanting to pile on false hope, you say honestly that after sentencing nothing will change.",
    "c44_branch_seal_a": "Saying the one who never forgave should know first, you show Moon Gaeul the photo first and ask what she wants.",
    "c44_branch_seal_b": "Saying it’s now, while the judge reads that letter, or never, you pass a note to the prosecutor’s table about the empty signature field.",
    "c44_branch_seal_c": "Saying there’s no way to break into the reading, you hear the sentencing first and save the photo for later.",
    "c44_branch_seal_follow_a": "Saying the photo will still be there in 3 minutes but a person won’t, you stay beside Moon Gaeul the moment the conclusion comes.",
    "c44_branch_seal_follow_b": "If an appeal is the only place it can go, you aim for that, organizing the photo and the date into appeal material within 7 days.",
    "c44_branch_seal_follow_c": "Saying it will be buried under the sentencing news if you wait 7 days, you give the photo to Seo Harin to run as a story today.",
    "c44_route_system_publish": "Saying everyone should know before hearing the sentencing, you release the statistics to Seo Harin and the group at the same time.",
    "c44_route_system_rule": "So that who forgave is never left unwritten, you propose a rule requiring a board resolution and named signatures on no-punishment letters.",
    "c44_route_system_drop": "Saying numbers won’t change tomorrow’s judgment, you shelve the statistics and just wait for the sentencing.",
    "c44_final_system_route_a": "Saying forgiveness belongs to those who paid the price, you propose that when a company forgives, it must go through the consent of the employees who bore the harm.",
    "c44_final_system_route_b": "Saying one judgment can’t change 10 years of them, you leave the system as is and decide to accept this sentence.",
    "c44_final_system_route_c": "Saying you can’t let a nameless forgiveness be read as it is, you file a separate complaint demanding the name of whoever decided KD Bank’s no-punishment letter.",
    "c44_evidence_turn_submit": "Saying that if someone else paid, the sentence must be reviewed again, you formally submit the ledger copy to the prosecution as appeal material.",
    "c44_evidence_turn_hold": "Saying it is the one line the Group most wants hidden, you hold the ledger and use it as a card in compensation talks with the Group.",
    "c44_evidence_turn_share": "Saying people should know whose name their own money was written under, you tell the employees whose bonuses were cut about this line first.",
    "c44_lottery_evidence_turn": "You set the day the no-punishment letter was made against the clue’s ledger and pin down which money went under whose name that day.",
    "c44_court_evidence_turn": "You set the day the no-punishment letter was made against the clue’s ledger and pin down which money went under whose name that day.",
    "c44_lunch_evidence_turn": "You set the day the no-punishment letter was made against the clue’s ledger and pin down which money went under whose name that day.",
    "c44_route_system_evidence_turn": "You set the day the no-punishment letter was made against the clue’s ledger and pin down which money went under whose name that day.",
    "c44_start_warm_seats": "Saying people have to be seated first, you secure gallery seats for the group.",
    "c44_start_warm_brief": "Saying you can’t let the company do the forgiving for others, you write a rebuttal to the no-punishment letter overnight and send it to the prosecution.",
    "c44_start_warm_trace": "Saying the sentence may not change but the money can be found, you leave the sentencing to reporters and chase where the diverted money went.",
    "c44_start_warm_signature": "Saying the people who didn’t sign that paper should be the ones in the courtroom, you stand in the gallery line all night with the people from the corridor.",
    "c44_start_record_seats": "Saying people have to be seated first, you secure gallery seats for the group.",
    "c44_start_record_brief": "Saying you can’t let the company do the forgiving for others, you write a rebuttal to the no-punishment letter overnight and send it to the prosecution.",
    "c44_start_record_trace": "Saying the sentence may not change but the money can be found, you leave the sentencing to reporters and chase where the diverted money went.",
    "c44_start_record_signature": "To show that the forgiveness came before the meeting, you chart the August 28 date and send it to the prosecution.",
    "c44_start_rush_seats": "Saying people have to be seated first, you secure gallery seats for the group.",
    "c44_start_rush_brief": "Saying you can’t let the company do the forgiving for others, you write a rebuttal to the no-punishment letter overnight and send it to the prosecution.",
    "c44_start_rush_trace": "Saying the sentence may not change but the money can be found, you leave the sentencing to reporters and chase where the diverted money went.",
    "c44_start_rush_signature": "Saying there’s no time to stop it but they deserve time to know, you tell the group tonight the list of documents you saw at the filing office."
  },
  "pack": {
    "clue": {
      "title": "Forgiveness with Only a Seal",
      "text": "KD Bank’s no-punishment letter had only the corporate seal, with no CEO signature, and on the same day 21 billion won in employee bonuses was renamed in the ledger as 'Yoon Sanghyuk matter damage recovery'."
    },
    "outcomes": {
      "c44_after_warm": {
        "tag": "The ending where you went to his side",
        "title": "On sentencing day, you took the leftover rice cakes to Lim Kyungsoo’s room",
        "text": "11 people stood by the hospital window. Instead of talking about the judgment, Lim Kyungsoo first said the rice cakes were underdone."
      },
      "c44_after_record": {
        "tag": "The ending where you spelled it out",
        "title": "You put the judgment into words the group could read",
        "text": "A guide beginning with 'An empty field is not an acquittal' went up in the group chat. 38 people read it to the end."
      },
      "c44_after_rush": {
        "tag": "Ran Ahead",
        "title": "On the night of sentencing, you built the grounds for appeal at the prosecutors’ office",
        "text": "You spent the first night of the 7-day clock at the prosecutors’ office. Missed calls from Lim Soyul stayed on your phone."
      }
    },
    "continuityChallenges": {
      "c43_after_warm": {
        "title": "Entering the courtroom with the people from the corridor",
        "text": "The people who held the 33rd-floor corridor together on board day have gathered again. Even with too few passes, trust gathers on the side that wants to sit in one row with them."
      },
      "c43_after_record": {
        "title": "Turning the resolution’s date into the language of sentencing",
        "text": "The draft resolution date copied into the vote record overlaps with the date of the no-punishment letter. What that date means in court can be read only by rearranging the table."
      },
      "c43_after_rush": {
        "title": "Bringing the documents you saw alone into due process",
        "text": "No one yet knows the words heard in the elevator or the documents you saw alone at the filing office. Only by filing what you saw as an official record does fairness follow."
      }
    }
  }
};
