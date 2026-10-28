/**
 * 사건 33 (src/nodes/case33.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c33_start": {
      "title": "An Answer in Three Days",
      "text": "Three days after the search and seizure, Baek Arin files a whistleblower report with the Financial Supervisory Service. The first page is the receipt record she handed you in March, the log of who received a document and when. The second page is the removal email that took Box 27 out two days before the seizure. The answer comes as a three-line notice on the group intranet. Deputy Manager Baek Arin: disciplinary dismissal. A criminal complaint for leaking trade secrets. Vacate group company housing by 18:00 on July 7. The resignation she handed in on March 27 was never accepted, and three months later it comes back as a dismissal. At the end of the 20th-floor hallway, the blinds in CEO Yoon Sanghyuk’s office come halfway down. Baek Arin calls. 'Could you help me pack? There are fewer people to ask than I thought.' She gives a short laugh. 'In percentage terms, close to 0.'",
      "memo": [
        "Whistleblower report filed June 19 -- 1,212 pages of material",
        "Page two of the report: the Box 27 removal email",
        "Group action: disciplinary dismissal, complaint for leaking trade secrets, out of company housing by July 7 -- the March resignation was never accepted",
        "Your post: KD Capital Risk Management, under CEO Yoon Sanghyuk"
      ],
      "choices": {
        "c33_start_law": {
          "label": "Look up how the law protects people who report"
        },
        "c33_start_call": {
          "label": "Call the group legal team first and sound out a settlement"
        },
        "c33_start_go": {
          "label": "Go to Baek Arin’s studio tonight and help her pack"
        },
        "reframe": {
          "label": "Gather the three months of those who reported before"
        }
      },
      "place": "KD Capital 12th Floor · Risk Management Department",
      "clock": "Monday, June 22 · Eviction D-15",
      "question": "Three days after the report, dismissal, a complaint and an eviction notice arrive at once. What do you do first?",
      "lead": "Three days after Baek Arin filed her whistleblower report, telling a public agency about the company’s wrongdoing, a group notice goes up at 8 on Monday morning."
    },
    "c33_room": {
      "title": "Stuff_final_REALfinal",
      "text": "In the tiny studio on the 11th floor of the Gongdeok-dong group housing, Baek Arin owns surprisingly little. Six gray suits, a mug holding three highlighters, and 23 boxes. Every box has a label on its side in her handwriting. 'WinterClothes_v3', 'Kitchen_final', 'Books_final_REALfinal'. Kang Taemin lifts two boxes at once and stops. 'Which of these is the real one?' Baek Arin answers without looking up from her tablet. 'The one I labeled last.' Kwon Dohyun already has three moving quotes laid side by side. A notice from the management office is taped inside the front door. 'July 7, 18:00: door lock code for this unit will be changed.' Baek Arin takes a photo of the notice and stands in front of it for a moment. '12 years at the company, and it tidies me away with one code. If I’d written it, I’d have made it gentler.'",
      "memo": [
        "Studio contents: 23 boxes, 6 suits",
        "Door lock code changes July 7, 18:00",
        "3 moving quotes -- Kwon Dohyun comparing",
        "Baek Arin’s next address: undecided"
      ],
      "choices": {
        "c33_room_storage": {
          "label": "Put her things in storage and buy time for the fight"
        },
        "c33_room_stay": {
          "label": "Let her stay with one of us until she finds a place"
        },
        "c33_room_petition": {
          "label": "Apply for protective measures: the eviction is retaliation"
        },
        "reframe": {
          "label": "Gather the three months of those who reported before"
        },
        "c33_room_evidence_turn": {
          "label": "Open the complaint draft’s date and the risk score screen"
        }
      },
      "place": "Gongdeok-dong Group Housing · Baek Arin’s Studio",
      "clock": "June 22 · 19:00 · Eviction D-15",
      "question": "Baek Arin has nowhere to go by the day the door lock code changes. What do you do?",
      "lead": "The door opens before you ring the bell. Baek Arin stands there holding a tape dispenser."
    },
    "c33_mother": {
      "title": "The Badge in the Frame",
      "text": "'Yoonkyung Alterations', down a back alley of Anyang Central Market, is two sewing machines and one iron. Baek Arin’s mother, Heo Yoonkyung, is stitching a trouser hem. She has been in this spot for 30 years. A frame hangs on the wall behind the counter. A KD Financial Group ID badge on a blue lanyard; in the photo, Baek Arin has the face of her first year at the company. Under the frame is a note for customers. 'My daughter works on the 33rd floor.' The moment Heo Yoonkyung sees her daughter’s colleagues, she pulls out a tape measure. 'Your trousers are all too long. Why are bank people’s trousers always too long?' Baek Arin cannot cross the shop’s threshold. Her mother knows nothing yet of the dismissal or the complaint. Arin only said the housing contract was ending and she would stay home for a while. Next week her things will go up to the shop’s 2nd floor. Baek Arin says quietly, 'I can’t watch Mom take that frame down. Not with my own eyes.'",
      "memo": [
        "Yoonkyung Alterations -- Anyang Central Market, 30 years",
        "Frame behind the counter: Baek Arin’s ID badge from her first year",
        "What her mother knows: 'the housing contract ended'",
        "Moving boxes due: next week, the shop’s 2nd floor"
      ],
      "choices": {
        "c33_mother_lawyer": {
          "label": "Hire a lawyer now, in case the family gets called in"
        },
        "c33_mother_tell": {
          "label": "Stand beside Baek Arin and tell her mother the truth"
        },
        "c33_mother_wait": {
          "label": "Talk Baek Arin into blaming it all on the move for today"
        },
        "reframe": {
          "label": "Gather the three months of those who reported before"
        },
        "c33_mother_evidence_turn": {
          "label": "Open the complaint draft’s date and the risk score screen"
        }
      },
      "place": "Anyang Central Market · Yoonkyung Alterations",
      "clock": "Saturday, June 27 · 15:00 · Eviction D-10",
      "question": "Her mother thinks her daughter still works on the 33rd floor. What do you do in this shop?",
      "lead": "At the end of the market alley, outside a shop humming with sewing machines, Baek Arin stops walking."
    },
    "c33_rice": {
      "title": "The One Who Wrote the Line",
      "text": "The doorbell rings at the half-packed Gongdeok-dong studio. Moon Gaeul stands there holding three boxes of rice cakes, and Moon Hajun drags a cooler in behind her. Baek Arin freezes on the spot. Last autumn a caption came up on the TV at Gaeul Rice Cake Shop, 'The past has all been settled', and she is the one who wrote it. Moon Gaeul says as she takes off her shoes, 'I saw the news. They say the person who wrote that line is the one who reported.' When she opens the boxes, the smell of sirutteok, steamed layered rice cake, fills the small room. 'You bring sirutteok to a new home. To ward off bad luck.' Baek Arin opens her mouth to apologize, but Moon Gaeul cuts the rice cake with her knife first. 'Never mind the apology, just eat. But let me ask one thing. When you wrote that line, did you know?' The room goes quiet. Moon Hajun, halfway through opening his sketchbook, stops. In the victims’ group chat, messages pile up: 'Shouldn’t we at least write a petition?'",
      "memo": [
        "Three boxes of sirutteok -- Gaeul Rice Cake Shop",
        "Moon Gaeul’s question: 'When you wrote that line, did you know?'",
        "186 messages in the victims’ group chat -- this morning alone",
        "Talk of a petition inside the group"
      ],
      "choices": {
        "c33_rice_online": {
          "label": "Skip the petition; gather numbers with an online signature drive"
        },
        "c33_rice_submit": {
          "label": "Send the members’ statements to the FSS as reference material"
        },
        "c33_rice_petition": {
          "label": "Gather a petition for Baek Arin with the victims’ group"
        },
        "reframe": {
          "label": "Gather the three months of those who reported before"
        },
        "c33_rice_evidence_turn": {
          "label": "Open the complaint draft’s date and the risk score screen"
        }
      },
      "place": "Gongdeok-dong Group Housing · The Half-Packed Studio",
      "clock": "Sunday, June 28 · 10:00 · Eviction D-9",
      "question": "The head of the victims’ group has brought sirutteok to the one who wrote that line. How do you take the group’s goodwill?",
      "lead": "The doorbell rings between the sounds of packing, and the smell of rice cakes comes in before anyone does."
    },
    "c33_final": {
      "title": "The Witness Field",
      "text": "In the headquarters legal team’s meeting room, Managing Director Pyeon Jongku lays down two pages of a settlement. He heads the very department that requested Box 27’s removal. If Baek Arin withdraws her report and signs a confidentiality pledge, the group drops the complaint, turns the dismissal into a resignation at the company’s request, and gives her 200 million won in severance, paid without admitting fault, plus three more months in company housing. 'What went to the FSS stays there either way. The only thing that disappears is Ms. Baek’s 3-year lawsuit.' A decision on protective measures, the process for undoing harm suffered for reporting, is two months away at the earliest. Baek Arin opens and closes the cap of a highlighter. 'I polished the sentences in settlements like this for 12 years. Always from the other side of this table.' There are two signature fields: Baek Arin’s, and one for a witness who confirms they were present at the signing. Pyeon Jongku slides the pen in front of you.",
      "memo": [
        "Terms: withdraw the report + confidentiality pledge",
        "In return: complaint dropped, dismissal turned into resignation at the company’s request, 200 million won severance, 3 months of housing",
        "At least two months until a decision on protective measures",
        "Legal team that drafted the settlement = the department that requested Box 27’s removal",
        "Settlement offer deadline: today, 18:00"
      ],
      "choices": {
        "c33_final_sign": {
          "label": "The files are already in; urge Baek Arin to settle"
        },
        "c33_final_hold": {
          "label": "Hold out with relief money and a deferral until the decision"
        },
        "c33_final_refuse": {
          "label": "Refuse, and put my name beside the report as a witness"
        },
        "reframe": {
          "label": "One last time, change the game and propose"
        }
      },
      "place": "KD Financial Group HQ · Legal Team Meeting Room",
      "clock": "Monday, June 29 · 09:00 · Settlement deadline 18:00",
      "question": "They want your name in the settlement’s witness field. What do you do?",
      "lead": "Today Baek Arin wears not a gray suit but a black one, its hems freshly restitched by her mother."
    },
    "c33_aftershock": {
      "title": "A New Frame",
      "text": "On the evening of June 29, the first moving truck stops in the Anyang Central Market alley. The housing elevator was down for inspection, so Kang Taemin carried the refrigerator on his back down 11 floors of stairs. Kwon Dohyun hands Baek Arin a statement that reads 'Shipping: 3,100 won per box'. The amount due field says 0 won. At the Yoonkyung Alterations counter, Baek Arin’s mother Heo Yoonkyung, who has now heard everything, takes the badge frame off the wall. She removes the badge, slips in the first whistleblower report receipt her daughter ever got, and hangs it back up. 'This suits it better. Even without a photo.' Baek Arin laughs out loud for the first time. Then she looks at the frame for a long time. 'The Managing Director had a frame on his desk too. A photo of his daughter holding sunflowers on her graduation day. Will he take that down someday, too?' Nine boxes are still left in the Gongdeok-dong studio.",
      "memo": [
        "First load arrives -- Yoonkyung Alterations 2nd floor, Anyang",
        "Refrigerator carried by Kang Taemin, down 11 floors of stairs",
        "Badge in the frame → report receipt",
        "9 boxes left in the Gongdeok-dong studio"
      ],
      "choices": {
        "c33_after_record": {
          "label": "With Ban Jaewook, write up the week’s retaliation and file it"
        },
        "c33_after_rush": {
          "label": "Call this fight won and move straight on to the next job"
        },
        "c33_after_warm": {
          "label": "Stay with Baek Arin until the last nine boxes are packed"
        }
      },
      "place": "Anyang Central Market · Yoonkyung Alterations",
      "clock": "June 29 · 20:00",
      "question": "The badge in the frame has become a report receipt, and nine boxes remain in the studio. How do you close this night?"
    },
    "c33_lock": {
      "title": "The Door Lock List",
      "text": "At 10 at night, Lee Minseo spreads the work order she got from the housing management office beside her laptop. A batch door lock change, ordered by KD Realty, the group’s real estate company. But there are four target units. Besides Baek Arin’s unit 1103, there are three more. Lee Minseo looks up the names one by one. A finance team manager who reported an accounting problem to internal audit 2 years ago, a security team assistant manager who reported a system flaw, a branch deputy manager who questioned sales targets. All three were then put on standby assignment, and two have left the company. 'The requesting department field is empty.' Lee Minseo turns the screen. 'Another blank field.'",
      "memo": [
        "Work order placed by: KD Realty",
        "Door lock changes on 4 units",
        "The other three are all past internal whistleblowers"
      ],
      "choices": {
        "c33_lock_choice_2": {
          "label": "Secure the work order as evidence for protective measures"
        },
        "c33_lock_choice_3": {
          "label": "No time for others’ troubles; focus on Baek Arin’s packing"
        },
        "c33_lock_choice_1": {
          "label": "Visit the other three units and ask if it happened to them"
        }
      },
      "place": "Gongdeok-dong Group Housing · Management Office Hallway",
      "clock": "June 22 · 22:00",
      "question": "All four units on the door lock list belong to internal whistleblowers. What do you do about the other three?"
    },
    "c33_hem": {
      "title": "The Hem Fee",
      "text": "Heo Yoonkyung takes 3 cm off Kwon Dohyun’s trouser hems, presses them, and hands them over. When Kwon Dohyun takes out his wallet, she waves him off. 'Money from my daughter’s friend? Don’t be silly.' 'My ledger has no field for free services.' 'Then make one.' While the tug-of-war runs into its 10th minute, Kang Taemin gets the torn pocket of his vest sewn up and quietly bows his head. When it is over, Kwon Dohyun takes out his calculator. This time it isn’t for the hems. Fighting the criminal complaint, applying for protective measures, and a civil suit on top: 48 million won in lawyer fees. Baek Arin has 21 million won in savings. 'For legal and moving costs caused by a whistleblower report, the state pays back relief money. But it takes three months to arrive.'",
      "memo": [
        "Hems shortened 3 cm -- 10-minute tug-of-war over the fee",
        "Estimated lawyer fees 48 million won, savings 21 million won",
        "About three months until relief money is paid"
      ],
      "choices": {
        "c33_hem_choice_2": {
          "label": "Apply for relief money first and get costs back officially"
        },
        "c33_hem_choice_1": {
          "label": "Suggest colleagues split the missing lawyer fees"
        },
        "c33_hem_choice_3": {
          "label": "Settling costs nothing; run the settlement numbers first"
        }
      },
      "place": "Anyang Central Market · At the Yoonkyung Alterations Sewing Machines",
      "clock": "June 27 · 17:00",
      "question": "The lawyer fees are more than twice her savings. What do you do about the gap?"
    },
    "c33_summons": {
      "title": "Two Interviews in One Day",
      "text": "Sunday evening, on the roof of the company housing. Two summonses have arrived on Baek Arin’s phone. Prosecutor Na Eunho of the Seoul Central District Prosecutors’ Office calls her in over the search and seizure case. Her role: unsworn witness, someone with no duty to testify who comes to explain the facts. July 1, 10 a.m. Yeongdeungpo Police Station calls her in as the accused in the trade secrets case. The same day, 2 p.m. Na Eunho calls in person. 'In the morning you’re the one who brought the evidence, and in the afternoon you’re the one who stole it. Same 1,212 pages either way.' He laughs briefly. 'I’m on the morning side. The afternoon side isn’t my jurisdiction.'",
      "memo": [
        "Prosecutors, unsworn witness: July 1, 10:00",
        "Police, as the accused: same day, 14:00",
        "Paperwork for both interviews: the same 1,212 pages"
      ],
      "choices": {
        "c33_summons_choice_3": {
          "label": "Rush the prosecutors’ statement to blunt the police interview"
        },
        "c33_summons_choice_2": {
          "label": "The report comes first; ask police to postpone the interview"
        },
        "c33_summons_choice_1": {
          "label": "Go to both so one person stays beside her all day"
        }
      },
      "place": "Gongdeok-dong Group Housing · Rooftop",
      "clock": "June 28 · 19:00",
      "question": "With the same papers, she is a witness in the morning and the accused in the afternoon. How do you prepare for that day?"
    },
    "c33_lock_reaction": {
      "title": "The Badge Returned First",
      "text": "Near midnight, Han Seoyun, on standby assignment, steps out of the elevator carrying an insulated lunch box. She sees the notice on the front door and stands there a long while. 'On my first day of standby, I returned my ID badge before anything else. The same hand that pressed the return button on your dissent 3 years ago.' She opens the lid and sets the lunch box in front of Baek Arin. 'We both sat next to Yoon Sanghyuk. One of us signed, and one of us reported.' Baek Arin picks up her chopsticks, then puts them down. 'The one who signed held on longer.' Han Seoyun shakes her head. 'I didn’t hold on. I just didn’t move.'",
      "memo": [
        "ID badge returned on the first day of standby",
        "The one who signed and the one who reported"
      ],
      "choices": {
        "c33_lock_reaction_choice_1": {
          "label": "Ask Han Seoyun to stay by Baek Arin with you tonight"
        },
        "c33_lock_reaction_choice_2": {
          "label": "Take Han Seoyun’s case as a statement to show the same method"
        },
        "c33_lock_reaction_choice_3": {
          "label": "Leave the past for later; take the lunch box and keep packing"
        }
      },
      "place": "Gongdeok-dong Group Housing · Outside the 11th-Floor Elevator",
      "clock": "June 22 · 23:50",
      "question": "The one who signed and the one who reported sit with one lunch box between them. How do you keep watch over this night?"
    },
    "c33_hem_reaction": {
      "title": "The Hidden Seam",
      "text": "At 11 at night, in Baek Arin’s old room on the 2nd floor of Yoonkyung Alterations. She sits at an old hand-crank sewing machine her mother put away up here and turns the lining of her suit inside out. The seam is ruler-straight. 'Mom sews lining seams most carefully of all. She says the place nobody sees is the first to split.' She traces the seam with a fingertip. 'For 12 years I sewed the group’s seams where nobody could see them. That loan explanation, the Innovation Committee script. The report is the first time I turned a seam outside in.' Then she says what she has held back for a long time. 'Turned out, it’s so crooked. And I’m the one who sewed it.'",
      "memo": [
        "The lining seam splits first",
        "The first seam turned outside in"
      ],
      "choices": {
        "c33_hem_reaction_choice_1": {
          "label": "Tell her clearly tonight that turning the seam was right"
        },
        "c33_hem_reaction_choice_2": {
          "label": "Suggest writing 12 years of seams as a dated statement"
        },
        "c33_hem_reaction_choice_3": {
          "label": "Ask first if she has regrets, and leave settling open"
        }
      },
      "place": "Yoonkyung Alterations 2nd Floor · Baek Arin’s Old Room",
      "clock": "June 27 · 23:00",
      "question": "She says the seams she hid for 12 years look crooked turned outside in. What do you say?"
    },
    "c33_summons_reaction": {
      "title": "How It Got Out in Three Days",
      "text": "At 11:30 at night, FSS examiner Han Jiwoo stands in the alley outside the company housing. She hasn’t stopped by on her way home; she came on purpose. 'By law, a whistleblower’s identity is confidential. But a complaint came out three days after the report. I checked how.' She holds out a printout. A fact-check request the FSS sent to KD Capital. The name was deleted from the attachment, but the author field in the file properties still says 'baek.arin'. 'It was our mistake. Under the rules I have to report this, and once I do, the case leaves my hands.' For the first time, Han Jiwoo adds something that isn’t a rule. 'Before it leaves, I want to tell the person myself.'",
      "memo": [
        "Author field of the fact-check letter: baek.arin",
        "Report it, and the case leaves her hands"
      ],
      "choices": {
        "c33_summons_reaction_choice_3": {
          "label": "Delay the report and use the mistake as a settlement card"
        },
        "c33_summons_reaction_choice_2": {
          "label": "Report the identity leak by the rules and ask for an inquiry"
        },
        "c33_summons_reaction_choice_1": {
          "label": "Have her tell Baek Arin directly before reporting"
        }
      },
      "place": "Outside the Gongdeok-dong Housing · Convenience Store Alley",
      "clock": "June 28 · 23:30",
      "question": "The whistleblower’s name leaked through the file properties of an FSS letter. What do you do about Han Jiwoo’s report?"
    },
    "c33_branch_storage": {
      "title": "The 10 m² Unit",
      "text": "A 10 m² unit in a 24-hour storage facility in Mapo. While stacking boxes, Kang Taemin finds a box with no label. Baek Arin hesitates for a moment, then tears off the tape. It is the first draft of last autumn’s Innovation Committee ad script. The last line she wrote went like this. 'The past has not been settled yet. That is why we are forming a committee.' A yellow sticky note is stuck above that line. 'Replace last line -- Y.' In the margin is Baek Arin’s writing in red highlighter. 'This line is not true. I object.' The date is five days before the shoot. Baek Arin looks down at the draft. 'So I wrote a dissent too. Nobody read it. Just like yours.'",
      "memo": [
        "First draft of the Innovation Committee script -- the box with no label",
        "Note ordering the change: 'Replace last line -- Y'",
        "Red writing in the margin: 'Not true. I object.'",
        "Date: five days before the shoot"
      ],
      "choices": {
        "c33_branch_storage_c": {
          "label": "The draft invites the complaint; keep it locked in storage"
        },
        "c33_branch_storage_a": {
          "label": "Publish the draft and note together as Baek Arin’s dissent"
        },
        "c33_branch_storage_b": {
          "label": "Submit the draft to the FSS as extra material for the report"
        }
      },
      "place": "Mapo 24-Hour Storage · 10 m² Unit",
      "clock": "June 22 · 23:10",
      "question": "From a box with no label comes the objection Baek Arin wrote before the shoot. What do you do with this draft?"
    },
    "c33_branch_storage_follow": {
      "title": "Three Highlighters",
      "text": "Baek Arin takes the three highlighters out of her mug and lays them side by side on the storage floor. 'Yellow for facts, green for effect, red for lines that should go. That’s how I marked things for 12 years.' She finds a number on her tablet and shows it. 431 red lines. Lines actually cut: 0. 'The funny part is, the documents with the most red lines got approved the fastest. Upstairs, they must have read red lines as a quality check.' Kang Taemin picks up the red pen and looks at it for a long time. 'Are you throwing this out?' Instead of answering, Baek Arin pulls the storage door halfway down.",
      "memo": [
        "3 highlighter colors -- fact · effect · cut",
        "431 red lines in 12 years",
        "Lines actually cut: 0",
        "The more red lines, the faster the approval"
      ],
      "choices": {
        "c33_branch_storage_follow_c": {
          "label": "Take only the script box today; leave the rest in storage"
        },
        "c33_branch_storage_follow_b": {
          "label": "Attach the list of red-lined documents to the application"
        },
        "c33_branch_storage_follow_a": {
          "label": "Bind the 431 red lines into a record in Baek Arin’s name"
        }
      },
      "place": "Mapo 24-Hour Storage · In Front of the Script Box",
      "clock": "June 23 · 00:05",
      "question": "Of the 431 red lines she drew in 12 years, not one sentence was cut. What do you do with those lines?"
    },
    "c33_route_system": {
      "title": "147 Days",
      "text": "You gather the three months of those who reported before. NOAH answers from KD Capital’s review terminal. 118 whistleblower reports from the financial sector over the past 10 years line up on the screen. Of the 118 people who reported, 71 were sued within three months for leaking trade secrets or for defamation. Only 2 of those cases ended in a guilty verdict. But 43 of the 71 withdrew their reports or settled with the company before any verdict. A decision on protective measures, the process for undoing harm suffered for reporting, took 147 days on average. 'My training shows a complaint is filed not to win but so that the person cannot last 147 days. That sentence is not in my judgment criteria. All I have are the numbers.'",
      "memo": [
        "71 of 118 financial-sector whistleblowers sued",
        "2 guilty verdicts -- 43 withdrew or settled before a verdict",
        "147 days on average until a decision on protective measures"
      ],
      "choices": {
        "c33_route_system_meet": {
          "label": "Find a few of the 43 who settled and have them meet Baek Arin"
        },
        "c33_route_system_drop": {
          "label": "Bury the numbers and lean toward a settlement that cuts 147 days"
        },
        "c33_route_system_publish": {
          "label": "Publish the numbers and show the complaints are meant to scare"
        },
        "c33_route_system_evidence_turn": {
          "label": "Open the complaint draft’s date and the risk score screen"
        }
      },
      "place": "KD Capital · Review Terminal",
      "clock": "June 23",
      "question": "More than half of the whistleblowers who were sued could not last 147 days. What do you do with these numbers?"
    },
    "c33_final_system_route": {
      "title": "The 44th Settlement",
      "text": "Before dawn on June 29, the review terminal shows the dates of 71 whistleblowers, one line each. Forty-three lines start on the day they were sued and break off on the day they withdrew or settled. Baek Arin’s line is a week old now, and the settlement offer from the group legal team expires at six this evening. NOAH writes the days remaining beside the last line. 'On average, 147 days until a protective decision. This line has 140 days left. Who holds out through those 140 days with her is not in my data.'",
      "memo": [
        "71 whistleblowers sued -- 43 withdrew or settled before a verdict",
        "147 days on average until a decision on protective measures",
        "Settlement offer deadline: today, 18:00"
      ],
      "choices": {
        "c33_final_system_route_c": {
          "label": "Start a shared legal defense fund for sued whistleblowers"
        },
        "c33_final_system_route_a": {
          "label": "Propose a rule: a company that sues a reporter pays the costs"
        },
        "c33_final_system_route_b": {
          "label": "Leave the rules; just get Baek Arin’s severance doubled"
        }
      },
      "place": "KD Capital · Review Terminal",
      "clock": "June 29 · Before Dawn",
      "question": "Baek Arin’s line has 140 days left. What will you put in place to carry her through them?"
    },
    "c33_evidence_turn": {
      "title": "The Score That Came Before the Report",
      "text": "When you fit the clue into the dates in the security team’s records, the group security team’s 'insider risk score' screen opens. On May 29, 3 weeks before the report, Baek Arin’s score jumped from 38 to 91, and that night her whole mailbox was flagged for monitoring. The complaint draft’s file was created on June 1, 18 days before the report. Lee Minseo opens the score formula and her hand stops. At the top of the inputs is this item. 'Hesitation time before decisions -- based on Trigger Lab response records.' 'These are our records.' Lee Minseo’s voice drops. 'The time we spent thinking hard turned into a probability of betrayal here.'",
      "memo": [
        "Risk score 38 → 91 -- May 29",
        "Complaint draft created June 1, 18 days before the report",
        "Score input No. 1: Trigger Lab hesitation time"
      ],
      "choices": {
        "c33_evidence_turn_file": {
          "label": "Attach the score screen and complaint date to the application"
        },
        "c33_evidence_turn_hold": {
          "label": "Hold the score records and reveal them at the settlement table"
        },
        "c33_evidence_turn_warn": {
          "label": "Tell the other scored employees about this first"
        }
      },
      "place": "KD Data Lab · Data Center Log Screen",
      "clock": "June 29 · 07:00",
      "question": "The complaint was drafted 18 days before the report, built on Trigger Lab records. How do you use these records?"
    },
    "c33_start_warm": {
      "title": "The Moving Boxes of the One Who Set the Chairs Upright",
      "text": "The night the search and seizure ended, you and your colleagues put the 23 desks on the 12th floor back in place until 3 a.m. Nobody touched the 12 chairs Baek Arin had set upright before she left. The next day she said on the phone, 'Box 27 isn’t something to tell you about. I have to file it in my own name.' On June 19, three days after the search and seizure, she files a whistleblower report with the Financial Supervisory Service, telling a public agency about the company’s wrongdoing. Three days later, on Monday morning, a group notice goes up. Disciplinary dismissal, a criminal complaint for leaking trade secrets, and vacate group company housing by 18:00 on July 7. The resignation she handed in in March was never accepted and came back as a dismissal. Kang Taemin posts one line in the group chat. 'I’ll carry the boxes. When do we go?'",
      "memo": [
        "Whistleblower report filed June 19 -- 1,212 pages of material",
        "Group action: disciplinary dismissal, complaint, out of company housing by July 7",
        "Kang Taemin: 'I’ll carry the boxes'"
      ],
      "choices": {
        "c33_start_warm_call": {
          "label": "Call the group legal team first and sound out a settlement"
        },
        "c33_start_warm_go": {
          "label": "Go to Baek Arin’s studio tonight and help her pack"
        },
        "c33_start_warm_law": {
          "label": "Look up how the law protects people who report"
        },
        "c33_start_warm_signature": {
          "label": "Call Kang Taemin and the others to move everything tonight"
        },
        "c33_start_warm_reframe": {
          "label": "Gather the three months of those who reported before"
        }
      },
      "place": "KD Capital 12th Floor · Risk Management Department",
      "clock": "Monday, June 22 · Eviction D-15",
      "question": "Kang Taemin says he’ll carry the boxes and only asks the date. When do you go, and with whom?",
      "lead": "Six days after the night you put every desk back, the one who set the chairs upright has become the one who has to pack."
    },
    "c33_start_record": {
      "title": "A Complaint for the One Who Matched the List",
      "text": "The night you checked the 312-line seizure list one line at a time and kept it as a copy list, there were two blanks. Box 27, and one document that wasn’t even named on the list. The answer to the first blank comes three days later, under someone else’s name. On June 19, Baek Arin filed a whistleblower report with the Financial Supervisory Service, telling a public agency about the company’s wrongdoing. The first page of the 1,212 pages is the receipt record she handed you in March, the log of who received a document and when; the second page is the Box 27 removal email. Three days after that, on Monday, the group dismisses her, files a criminal complaint against her for leaking trade secrets, and tells her to vacate group housing by July 7. Lee Minseo stops as she leafs through the complaint. 'The list of materials attached to the complaint matches the report materials, right down to the page counts. That means the group has already seen what she reported.'",
      "memo": [
        "Copy list, 312 lines -- two blanks",
        "Report page one: receipt record; page two: removal email",
        "Complaint materials list = report materials list",
        "The resignation handed in in March was never accepted"
      ],
      "choices": {
        "c33_start_record_go": {
          "label": "Go to Baek Arin’s studio tonight and help her pack"
        },
        "c33_start_record_call": {
          "label": "Call the group legal team first and sound out a settlement"
        },
        "c33_start_record_law": {
          "label": "Look up how the law protects people who report"
        },
        "c33_start_record_signature": {
          "label": "Formally tell the FSS the complaint uses the report’s files"
        },
        "c33_start_record_reframe": {
          "label": "Gather the three months of those who reported before"
        }
      },
      "place": "KD Capital 12th Floor · Risk Management Department",
      "clock": "Monday, June 22 · Eviction D-15",
      "question": "The complaint’s materials list matches the report materials down to the page counts. How do you use this?",
      "lead": "Six days after you closed the copy list, Box 27, once a blank row, turns up first in someone else’s complaint."
    },
    "c33_start_rush": {
      "title": "The Name Heard in the Morning Interview Room",
      "text": "In the Seocho-dong interview room you rushed to at first light after the search and seizure, Na Eunho asked not a question but a name. Baek Arin. You said only that you knew the name. That evening Baek Arin called first. 'I hear you went to the prosecutors’ office. Please don’t be the one to write up Box 27. I’ll file it in my own name.' Two days later, on June 19, she files a whistleblower report with the Financial Supervisory Service, telling a public agency about the company’s wrongdoing. Three days after that, the group dismisses her and files a criminal complaint for leaking trade secrets. She is told to vacate company housing by July 7, too. A text comes from Na Eunho. 'Our candidate for unsworn witness, someone with no duty to testify who comes to explain the facts, has become their accused. Fast, that crowd.'",
      "memo": [
        "Morning interview room -- the name Na Eunho asked: Baek Arin",
        "Dismissal and complaint three days after the report",
        "Na Eunho: the witness candidate has become the accused",
        "The resignation handed in in March was never accepted"
      ],
      "choices": {
        "c33_start_rush_signature": {
          "label": "Ask Prosecutor Na to protect Baek Arin as his witness first"
        },
        "c33_start_rush_law": {
          "label": "Look up how the law protects people who report"
        },
        "c33_start_rush_go": {
          "label": "Go to Baek Arin’s studio tonight and help her pack"
        },
        "c33_start_rush_call": {
          "label": "Call the group legal team first and sound out a settlement"
        },
        "c33_start_rush_reframe": {
          "label": "Gather the three months of those who reported before"
        }
      },
      "place": "KD Capital 12th Floor · Risk Management Department",
      "clock": "Monday, June 22 · Eviction D-15",
      "question": "The prosecutors’ witness candidate has become the police’s accused. Whom do you contact first?",
      "lead": "The name you heard in the morning interview room comes back five days later, written in a complaint."
    }
  },
  "echoReplies": {
    "c33_start_go": "When you go, Baek Arin hands you a tape dispenser instead of a thank-you. The light in CEO Yoon Sanghyuk’s office stays on until you leave work.",
    "c33_start_law": "The provision is clear. It says secrets contained in a report are not treated as a breach of a duty of confidentiality. The complaint pretends not to know that provision.",
    "c33_start_call": "The legal team takes the call warmly. The fact that they took it warmly goes into the call log with your name.",
    "c33_room_stay": "Once she has a place to stay, Baek Arin puts her tablet down for the first time. Kang Taemin and Kwon Dohyun play three rounds of rock-paper-scissors over whose home she goes to.",
    "c33_room_petition": "The application is accepted. The door lock changes faster than the application, right on schedule.",
    "c33_room_storage": "Into storage they go, and 14 boxes are gone in a day. One box with no label goes to the very back of the unit.",
    "c33_mother_tell": "When you tell her together, Heo Yoonkyung stops the sewing machine and listens to the end. Then the first thing she does is measure her daughter’s hems. 'If you’re going to court, your trousers have to fit.'",
    "c33_mother_lawyer": "With a lawyer on board, fewer questions can reach her mother. Baek Arin leaves the family contact field in the retainer agreement blank.",
    "c33_mother_wait": "With nothing said, today stays quiet. Heo Yoonkyung makes the doenjang stew her daughter loved and asks, 'The 33rd-floor people keep you busy, don’t they?'",
    "c33_rice_petition": "As the petition gathers, 400 names a day are added. The first line is Moon Gaeul; the second is Moon Hajun.",
    "c33_rice_submit": "Once the statements become material, the group members’ voices enter the case record. At the end of her statement, Moon Gaeul adds, 'No charge for the rice cakes.'",
    "c33_rice_online": "The signatures pass 20,000 in one day. Hardly any of them know Baek Arin’s face.",
    "c33_final_refuse": "When you refuse, Pyeon Jongku takes back just one page of the settlement. Your name, meant for the witness field, now goes on papers on the other side.",
    "c33_final_hold": "Holding out starts two months at the earliest, five at the longest. Baek Arin pushes the settlement away and writes her own name in the first field of the relief money application.",
    "c33_final_sign": "When you urge her, Baek Arin uncaps her highlighter and strikes through the settlement’s three lines of terms. 'These are sentences I polished for 12 years.' Both signature fields are still blank when 18:00 passes.",
    "c33_after_warm": "You stay, and the night comes when the last box gets its tape. Side-dish containers from Heo Yoonkyung line the studio floor, and the phone on top of a box is still quiet.",
    "c33_after_record": "From 8 on the Monday the dismissal notice went up until today, eight days, written down, come to 32 pages. Ban Jaewook prints one more blank form. He says someone else will probably need it.",
    "c33_after_rush": "When you move on, Baek Arin waves and says, 'Go. This time I’m fine.' Kang Taemin takes charge of the nine remaining boxes.",
    "c33_lock_choice_1": "Of the three people you visit, only one opens the door. The first thing that person says is, 'So they’re still doing it.'",
    "c33_lock_choice_2": "The work order becomes evidence. The empty requesting department field stays empty even as evidence.",
    "c33_lock_choice_3": "The boxes go down fast. The names of the other three units stay only on Lee Minseo’s laptop.",
    "c33_hem_choice_1": "When you suggest splitting it, Kwon Dohyun is the first to transfer money. In the memo field he writes 'Includes hem fee'.",
    "c33_hem_choice_2": "The application is accepted. For three months the lawyer fees go out first on someone’s card.",
    "c33_hem_choice_3": "The settlement numbers are neat. Heo Yoonkyung looks at the sheet and says 'The numbers are too pretty.'",
    "c33_summons_choice_1": "Going along takes the whole day. On a chair outside the afternoon interview room, you wait in the same posture as in the morning.",
    "c33_summons_choice_2": "The postponement is granted. In exchange the complaint stays unresolved and follows Baek Arin for another month.",
    "c33_summons_choice_3": "With the prosecutors’ statement done first, the police questions get shorter. As much shorter as they get, Baek Arin answers unprepared.",
    "c33_lock_reaction_choice_1": "When you ask, Han Seoyun tapes boxes until two in the morning. The whole time, neither of them mentions Yoon Sanghyuk once.",
    "c33_lock_reaction_choice_2": "With two statements, coincidence becomes a method. Han Seoyun’s pen hovers a long time over her own name field.",
    "c33_lock_reaction_choice_3": "The lunch is delicious. Han Seoyun packs up the empty lunch box and quietly takes the elevator down.",
    "c33_hem_reaction_choice_1": "Told she was right, Baek Arin switches off the sewing machine. 'Crooked or not, I’m the one who sewed it.'",
    "c33_hem_reaction_choice_2": "Once she starts writing dates, the night gets shorter. At three in the morning the statement reaches 41 pages, and the seams stop at 2019.",
    "c33_hem_reaction_choice_3": "Asked if she has regrets, Baek Arin uncaps a highlighter instead of answering. Her hand is slow choosing the color for the settlement.",
    "c33_summons_reaction_choice_1": "Hearing it directly, Baek Arin doesn’t get angry. 'File properties. I used to tell people to scrub them every time.'",
    "c33_summons_reaction_choice_2": "Once the report goes up, an inquiry begins inside the FSS. Han Jiwoo is taken off the case.",
    "c33_summons_reaction_choice_3": "It is a strong card. Han Jiwoo says 'That’s not how I help' and leaves the alley first.",
    "c33_branch_storage_a": "At the idea of publishing it, Baek Arin laughs for a long time. 'My dissent will air later than the ad.'",
    "c33_branch_storage_b": "As extra material, the draft gets a case number. Who the 'Y' on the yellow note is becomes a question for the investigator to ask.",
    "c33_branch_storage_c": "Locked away, it adds nothing to the complaint’s list. The red writing that says I object keeps waiting inside the unit too.",
    "c33_branch_storage_follow_a": "Once the 431 are sorted, Baek Arin’s 12 years become one document. In the title field she writes, for the first time, 'Dissenting opinion'.",
    "c33_branch_storage_follow_b": "With the list attached, the application gets thicker. The reviewer now has 431 red lines to read too.",
    "c33_branch_storage_follow_c": "Carrying out just one box, the storage door comes down lightly. The red pen is in Kang Taemin’s vest pocket.",
    "c33_route_system_publish": "Once published, a few whistleblowers who settled leave anonymous comments. '147 days. I lost on day 90.'",
    "c33_route_system_meet": "Of the 43, 3 come. One of them tells Baek Arin, 'If you settle, it’s nothing to be ashamed of.'",
    "c33_route_system_drop": "Buried, the math gets easier. A 44th settlement is quietly added to the numbers.",
    "c33_final_system_route_a": "With the rule in place, the next complaint thinks twice before coming in. This complaint is already in.",
    "c33_final_system_route_b": "The severance becomes 400 million won. Baek Arin looks at the figure and says only, 'My price went up.'",
    "c33_final_system_route_c": "Once the fund exists, the first to deposit is Kwon Dohyun. The memo field says 'Not a loss'.",
    "c33_evidence_turn_file": "Filed together, it becomes official record that the complaint was born 18 days before the report. The department that made the score has not answered yet.",
    "c33_evidence_turn_hold": "Held back, it becomes a strong hand at the settlement table. Meanwhile, the others who scored 91 don’t know their scores.",
    "c33_evidence_turn_warn": "Once told, 26 scored employees see their own numbers for the first time. A few start writing reports that night.",
    "c33_room_evidence_turn": "Line it up by date, and the complaint was born before the report. What set that date was not a person but a score.",
    "c33_mother_evidence_turn": "Line it up by date, and the complaint was born before the report. What set that date was not a person but a score.",
    "c33_rice_evidence_turn": "Line it up by date, and the complaint was born before the report. What set that date was not a person but a score.",
    "c33_route_system_evidence_turn": "Line it up by date, and the complaint was born before the report. What set that date was not a person but a score.",
    "case33_memory_system": "What the complaint records is not the game but dates. NOAH makes a table of the dates whistleblowers were sued and how many days they held out.",
    "case33_memory_evidence": "Hold the day the box went out against the complaint file, and its creation date comes before the report. Even earlier than that, there is a score.",
    "c33_start_warm_go": "When you go, Baek Arin hands you a tape dispenser instead of a thank-you. The light in CEO Yoon Sanghyuk’s office stays on until you leave work.",
    "c33_start_warm_law": "The provision is clear. It says secrets contained in a report are not treated as a breach of a duty of confidentiality. The complaint pretends not to know that provision.",
    "c33_start_warm_call": "The legal team takes the call warmly. The fact that they took it warmly goes into the call log with your name.",
    "c33_start_warm_signature": "When six people arrive at once, the studio is packed. Baek Arin, not knowing where everyone should leave their shoes at the door, is flustered for the first time.",
    "c33_start_record_go": "When you go, Baek Arin hands you a tape dispenser instead of a thank-you. The light in CEO Yoon Sanghyuk’s office stays on until you leave work.",
    "c33_start_record_law": "The provision is clear. It says secrets contained in a report are not treated as a breach of a duty of confidentiality. The complaint pretends not to know that provision.",
    "c33_start_record_call": "The legal team takes the call warmly. The fact that they took it warmly goes into the call log with your name.",
    "c33_start_record_signature": "Once told, people inside the FSS start asking who sent that list out. The answer comes six days later, in an alley.",
    "c33_start_rush_go": "When you go, Baek Arin hands you a tape dispenser instead of a thank-you. The light in CEO Yoon Sanghyuk’s office stays on until you leave work.",
    "c33_start_rush_law": "The provision is clear. It says secrets contained in a report are not treated as a breach of a duty of confidentiality. The complaint pretends not to know that provision.",
    "c33_start_rush_call": "The legal team takes the call warmly. The fact that they took it warmly goes into the call log with your name.",
    "c33_start_rush_signature": "When you ask, Na Eunho answers, 'Protection isn’t my job, though.' And that afternoon he writes one more summons."
  },
  "choiceVoiceLines": {
    "c33_start_go": "Saying you won’t leave someone who’s been fired on her own, you go to Baek Arin’s studio tonight and help her pack first.",
    "c33_start_law": "Saying you need grounds to stand against the complaint, you look up first how the law protects people who report.",
    "c33_start_call": "To see if there is a way to end it before court, you call the group legal team first and sound out a settlement.",
    "c33_room_stay": "Saying she needs somewhere to sleep even if the code changes, you let her stay with one of you until she decides where to go.",
    "c33_room_petition": "Saying the eviction in the door lock notice is retaliation for the report, you apply for protective measures.",
    "c33_room_storage": "Saying she can’t spend every day choosing where to go, you put her things in storage and buy time for the fight first.",
    "c33_mother_tell": "Saying her mother can’t hear it first from someone else, you stand beside Baek Arin and tell her mother the truth together.",
    "c33_mother_lawyer": "Since her mother still knows nothing of the dismissal or the complaint, and the family could be called in, you hire a lawyer first.",
    "c33_mother_wait": "Her words about not being able to watch the frame come down stay with you, so you talk Baek Arin into saying nothing today and blaming the move.",
    "c33_rice_petition": "Saying it carries different weight when the people hurt by that line take her side, you gather a petition for Baek Arin with the victims’ group.",
    "c33_rice_submit": "Saying facts, not feelings, need to reach the case, you send the members’ statements to the FSS as reference material for the report.",
    "c33_rice_online": "Saying you must move before the group chat cools, you open an online signature drive instead of a petition and gather numbers in a day.",
    "c33_final_refuse": "Saying you won’t let this stay a report filed alone, you refuse the settlement and put your name beside the report as a witness.",
    "c33_final_hold": "Saying there is a way even without an answer by 18:00 today, you file for both relief money and a deferral to hold out until the protective decision.",
    "c33_final_sign": "Since a decision on protective measures is two months away at the earliest, you say the files are already in and urge Baek Arin to settle.",
    "c33_after_warm": "So she doesn’t empty the studio alone, you stay beside Baek Arin until the last nine boxes are packed.",
    "c33_after_record": "Saying one receipt won’t protect her, you and Ban Jaewook write up this week’s retaliation in date order, to the end, and file it.",
    "c33_after_rush": "Saying the new frame means this fight is won, you move straight on to the next job.",
    "c33_lock_choice_1": "To hear from them what happened after they reported, you visit the people in the other three units and ask if the same thing happened to them.",
    "c33_lock_choice_2": "Saying the requesting department field may be empty but the ordering company remains, you secure the work order as evidence for protective measures.",
    "c33_lock_choice_3": "Saying there’s no time to look after other people’s units, you focus only on Baek Arin’s packing, with July 7 at stake.",
    "c33_hem_choice_1": "So she doesn’t have to fill the three months until relief money arrives alone, you suggest colleagues split the missing lawyer fees.",
    "c33_hem_choice_2": "Saying 21 million won in savings can’t cover 48 million won, you apply for relief money first and get the costs back officially.",
    "c33_hem_choice_3": "Saying a settlement means 48 million won in lawyer fees she won’t have to pay, you run the settlement numbers first.",
    "c33_summons_choice_1": "Since it is a day she becomes a different person in the morning and the afternoon, you go to both interviews so one person stays beside her to the end.",
    "c33_summons_choice_2": "Saying the whistleblower case must first decide whether anything was stolen, you file a request to postpone the police interview.",
    "c33_summons_choice_3": "So the prosecutors take the same 1,212 pages as evidence first, you rush the prosecutors’ statement and drain the police interview of force.",
    "c33_lock_reaction_choice_1": "Saying they both sat next to Yoon Sanghyuk, you ask Han Seoyun to stay by Baek Arin with you tonight.",
    "c33_lock_reaction_choice_2": "So the standby assignment and the eviction form one line, you take what Han Seoyun went through as a statement too, to show it is the same method.",
    "c33_lock_reaction_choice_3": "Saying past things like the return 3 years ago can wait, you just take the lunch box and finish packing.",
    "c33_hem_reaction_choice_1": "Saying it may look crooked but could only be seen turned out, you tell her clearly tonight that turning the seam was right.",
    "c33_hem_reaction_choice_2": "Saying even the crooked parts must be kept in her own hand, you suggest writing 12 years of seams down one by one as a dated statement.",
    "c33_hem_reaction_choice_3": "Saying you can’t push her to hold out, you ask first whether she has regrets and leave settling open.",
    "c33_summons_reaction_choice_1": "Saying she should hear it from a person before any letter, you have Han Jiwoo tell Baek Arin directly before reporting.",
    "c33_summons_reaction_choice_2": "Saying the record must remain even if the case leaves her hands, you have Han Jiwoo report the identity leak by the rules and ask for an inquiry.",
    "c33_summons_reaction_choice_3": "Saying the leak is a weak spot for the group too, you suggest delaying the report and using the mistake as a card at the settlement table.",
    "c33_branch_storage_a": "So the dissent nobody read finally gets read, you suggest publishing the draft with its note as Baek Arin’s dissent.",
    "c33_branch_storage_b": "Saying the date five days before the shoot is evidence, you submit the draft to the FSS as extra material for the report.",
    "c33_branch_storage_c": "Since it is a company script from a box with no label, and the draft could feed the complaint, you keep it locked in storage.",
    "c33_branch_storage_follow_a": "So it stays on record whose objections, none of them ever cut, these were, you sort the 431 red lines into a record in Baek Arin’s name.",
    "c33_branch_storage_follow_b": "To show the person who asked for cuts was punished, you attach the list of red-lined documents to the protective measures application.",
    "c33_branch_storage_follow_c": "Saying 12 years is too long to dig through at once, you take only the script box today and leave the rest in storage.",
    "c33_route_system_publish": "So the next whistleblower doesn’t back down before a complaint, you publish the numbers and show the complaints are meant to scare.",
    "c33_route_system_meet": "So she hears the three months the numbers don’t tell, you find a few of the 43 who settled and have them meet Baek Arin.",
    "c33_route_system_drop": "Saying the time is long even if only 2 were found guilty, you bury the numbers and lean toward a settlement that cuts the 147 days.",
    "c33_final_system_route_a": "Saying the problem is the whistleblower paying the price of holding out, you propose a rule that a company suing a whistleblower pays the whistleblower’s legal costs until a verdict.",
    "c33_final_system_route_b": "Saying the only thing you can change by six this evening is the amount, you leave the rules alone and get Baek Arin’s severance doubled.",
    "c33_final_system_route_c": "So no one holds out 140 days alone, you start a shared legal defense fund for whistleblowers who have been sued.",
    "c33_evidence_turn_file": "To show the complaint was prepared before the report, you attach the score screen and the complaint’s creation date to the protective measures application.",
    "c33_evidence_turn_hold": "Saying it weighs most when laid in front of a settlement, you hold the score records and reveal them first at the settlement table.",
    "c33_evidence_turn_warn": "Saying they don’t know their hesitation became a score, you tell the other scored employees about this first.",
    "c33_room_evidence_turn": "Lining up the complaint with the clue by date, you count back to when the group first knew about the report.",
    "c33_mother_evidence_turn": "Lining up the complaint with the clue by date, you count back to when the group first knew about the report.",
    "c33_rice_evidence_turn": "Lining up the complaint with the clue by date, you count back to when the group first knew about the report.",
    "c33_route_system_evidence_turn": "Lining up the complaint with the clue by date, you count back to when the group first knew about the report.",
    "c33_start_warm_go": "Saying you won’t leave someone who’s been fired on her own, you go to Baek Arin’s studio tonight and help her pack first.",
    "c33_start_warm_law": "Saying you need grounds to stand against the complaint, you look up first how the law protects people who report.",
    "c33_start_warm_call": "To see if there is a way to end it before court, you call the group legal team first and sound out a settlement.",
    "c33_start_warm_signature": "So she isn’t chased out by a date, you call Kang Taemin and the others and propose moving everything out tonight.",
    "c33_start_record_go": "Saying you won’t leave someone who’s been fired on her own, you go to Baek Arin’s studio tonight and help her pack first.",
    "c33_start_record_law": "Saying you need grounds to stand against the complaint, you look up first how the law protects people who report.",
    "c33_start_record_call": "To see if there is a way to end it before court, you call the group legal team first and sound out a settlement.",
    "c33_start_record_signature": "Since it means the group has already seen the report, you formally tell the FSS that the complaint’s materials list matches the report materials.",
    "c33_start_rush_go": "Saying you won’t leave someone who’s been fired on her own, you go to Baek Arin’s studio tonight and help her pack first.",
    "c33_start_rush_law": "Saying you need grounds to stand against the complaint, you look up first how the law protects people who report.",
    "c33_start_rush_call": "To see if there is a way to end it before court, you call the group legal team first and sound out a settlement.",
    "c33_start_rush_signature": "So the complaint doesn’t outrun the investigation, you ask Prosecutor Na Eunho to protect Baek Arin first as his witness."
  },
  "pack": {
    "clue": {
      "title": "The Score That Came Before the Report",
      "text": "3 weeks before the report, the group security team’s insider risk score raised Baek Arin to 91, and the complaint draft was created 18 days before the report. The score’s first input was Trigger Lab’s record of hesitation time."
    },
    "outcomes": {
      "c33_after_warm": {
        "tag": "Packed to the End",
        "title": "You stayed until the last box in the Gongdeok-dong studio",
        "text": "The tape went on the last nine boxes before dawn on the day before the eviction. Before the code changed, nothing was left in that room."
      },
      "c33_after_record": {
        "tag": "Wrote the Record",
        "title": "You filed a 32-page record of retaliation with Ban Jaewook",
        "text": "Eight days from the morning the dismissal notice went up: a record of the retaliation, in order, was filed. It is the document the next person to report will read first."
      },
      "c33_after_rush": {
        "tag": "Moved Straight On",
        "title": "You left the remaining boxes and moved on to the next fight",
        "text": "After the first truck left, you moved straight on to the next job. Baek Arin came out to the door and said, 'Go. This time I’m fine.'"
      }
    },
    "continuityChallenges": {
      "c32_after_warm": {
        "title": "Standing Beside the One Who Set the Chairs Upright",
        "text": "The night you put every desk back on the empty 12th floor, Baek Arin silently set 12 chairs upright and left. This time, you repay that trust with a card that brings colleagues along, so she doesn’t pack alone."
      },
      "c32_after_record": {
        "title": "Reading the Same List Backward",
        "text": "Box 27, once a blank row in the copy list, became Baek Arin’s report material, and the complaint’s materials list is identical to it. You turn the game around so the list the group put forward reads as proof that the report leaked."
      },
      "c32_after_rush": {
        "title": "Owning What the Morning Interview Room Cost",
        "text": "The morning you ran ahead, you told the prosecutor you knew Baek Arin’s name, and five days later she was the accused. Fairness holds only if you don’t hide what that morning cost her."
      }
    }
  }
}
