/**
 * 사건 12 (src/nodes/case12.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c12_start": {
      "title": "Strings on 30 Billion",
      "text": "2 weeks after the National Assembly audit, KD Financial Group announces a 'voluntary compensation plan'. The fund is 30 billion won, for the people harmed by loan 2023-0412. One condition is attached. Anyone who takes the money must sign a no-suit agreement. Do Yoonha brings in a printout of the notice. 'The head of the victims’ group wants to meet you. She runs a rice cake shop in Mangwon Market.' He hesitates for a moment. 'I don’t think she’s asking you over to say thank you.'",
      "memo": [
        "Voluntary compensation fund 30 billion won -- average 17 million won per person",
        "Condition for payment: sign the no-suit agreement",
        "Victims’ group: 1,021 registered, led by Moon Gaeul",
        "10 days to the FSS dispute mediation deadline"
      ],
      "choices": {
        "c12_start_visit": {
          "label": "Go see the victims’ group leader in person first"
        },
        "c12_start_fast": {
          "label": "Help people file now; getting paid comes first"
        },
        "c12_start_clause": {
          "label": "Read the no-suit clause line by line first"
        },
        "reframe": {
          "label": "Pull up every compensation plan with the same condition"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Mediation filing deadline · D-10",
      "question": "The 30 billion won plan comes with a condition: 'never sue again'. What do you do first?",
      "lead": "2 weeks after the National Assembly audit, group notices keep coming out of the analyst room printer."
    },
    "c12_mediation": {
      "title": "Why Didn’t You Stop It?",
      "text": "A briefing on FSS dispute mediation in Yeouido. The 200 folding chairs are not enough; more than a hundred people stand at the back. When you are introduced, a murmur spreads instead of applause. In the front row, Moon Gaeul stands up, still in her apron. 'They say you wrote a dissent. I read the article. So why didn’t you stop it? After you wrote it and went down to the basement, what did you do for 3 years?' There is no microphone, but her voice reaches the back of the room. Someone says 'Enough,' and someone else says 'No, we need to hear this.'",
      "memo": [
        "340 at the briefing -- 200 seats",
        "Moon Gaeul: husband ran supplier Gaon Precision, died right after it went bankrupt last fall",
        "Many attendees are weighing whether to take the voluntary payment",
        "The question is about you: your 3 years"
      ],
      "choices": {
        "c12_mediation_own": {
          "label": "Admit the 3 years you didn’t stop it and apologize"
        },
        "c12_mediation_ask": {
          "label": "Instead of answering, ask what they need now"
        },
        "c12_mediation_explain": {
          "label": "Show from the records how the dissent was erased"
        },
        "reframe": {
          "label": "Pull up every compensation plan with the same condition"
        },
        "c12_mediation_evidence_turn": {
          "label": "Find the 30 billion won’s account in the books"
        }
      },
      "place": "Financial Supervisory Service, Yeouido · Mediation briefing hall",
      "clock": "Mediation filing deadline · D-8",
      "question": "In front of 340 people, someone asks why you didn’t stop it. How do you answer?",
      "lead": "While you wait to be introduced, someone in an apron in the front row is watching you."
    },
    "c12_market": {
      "title": "Chuseok Rush",
      "text": "The day after the briefing, Moon Gaeul sent a text. 'Don’t talk. Come and steam rice cakes.' So three days before Chuseok, everyone came. Kang Taemin pounds rice with his night-shift muscles and hears from Moon Gaeul that 'all you’ve got is strength'. Na Junhyuk stamps songpyeon with 30 years of practice at stamping seals and takes all the praise. Kwon Dohyun shouts 'At this price you’re losing money' at 1-minute intervals at the counter until he is sent off to pack boxes, and the market grannies call Oh Jinwoo 'the bank boy' until he turns red. In the steam-filled shop, Moon Gaeul laughs for the first time. Then she stops slicing and asks. 'Do the 212 count for compensation? The ones with no paperwork. Our group has more than 30 people like that.'",
      "memo": [
        "Three days of Chuseok sales -- a usual month’s worth",
        "31 in the victims’ group have no paperwork",
        "Voluntary plan criteria: only people with loan papers",
        "Since Do Yoonha collapsed, the list of 212 is in no criteria yet"
      ],
      "choices": {
        "c12_market_split": {
          "label": "Pay those with papers first; fight for the rest apart"
        },
        "c12_market_include": {
          "label": "Agree to mediate only if the 212 are in the criteria"
        },
        "c12_market_prove": {
          "label": "Gather evidence of harm for the 31 without papers"
        },
        "reframe": {
          "label": "Pull up every compensation plan with the same condition"
        },
        "c12_market_evidence_turn": {
          "label": "Find the 30 billion won’s account in the books"
        }
      },
      "place": "Gaeul Rice Cakes, Mangwon Market",
      "clock": "Three days before Chuseok",
      "question": "In the steamy shop, she asks whether the 212 without paperwork count for compensation. What do you say?",
      "lead": "Steam covers your face the moment you open the shop door. Six aprons are already hanging up."
    },
    "c12_memorial": {
      "title": "1 Year On",
      "text": "It is the 1st memorial anniversary of Moon Sungho, head of Gaon Precision. Moon Gaeul sets three songpyeon and a glass of soju before the glass door. Her son Moon Hajun, in his 2nd year of high school, stands behind her in his uniform and suddenly speaks. 'I’m going to be a banker. One who doesn’t lend to people like Dad. No, one who lends to them, but does it right.' Moon Gaeul laughs, then turns her head away. She takes a yellowed envelope from her bag. On the front, in her husband’s hand: 'To the reviewer who wrote the dissent.'",
      "memo": [
        "Moon Sungho: head of Gaon Precision, died a month after the factory went bankrupt last fall",
        "Envelope found in his factory desk drawer, never sent",
        "Addressed: 'To the reviewer who wrote the dissent'",
        "Son Moon Hajun hopes to study business"
      ],
      "choices": {
        "c12_memorial_keep": {
          "label": "Take it unopened and read it out on the bench"
        },
        "c12_memorial_read": {
          "label": "Read the letter there, with the family"
        },
        "c12_memorial_son": {
          "label": "Promise to teach Moon Hajun how a bank judges"
        },
        "reframe": {
          "label": "Pull up every compensation plan with the same condition"
        },
        "c12_memorial_evidence_turn": {
          "label": "Find the 30 billion won’s account in the books"
        }
      },
      "place": "Incheon memorial park · Columbarium",
      "clock": "Two days before Chuseok · 1st anniversary",
      "question": "An envelope from her husband, 'To the reviewer who wrote the dissent', has turned up. What do you do?",
      "lead": "Before the Chuseok holiday, the columbarium is quiet. At the end of the corridor you see a back in a school uniform first."
    },
    "c12_final": {
      "title": "The 1,740th Person",
      "text": "The last meeting of the mediation committee. The group’s lawyer pushes the proposal across. The voluntary plan unchanged, no-suit agreement included, only the 1,528 with paperwork covered. Sign today and the money arrives before Chuseok. Beside you, Moon Gaeul turns the pages and stops her finger on one line. 'The people left out here are in our group too. One’s a granny who comes to buy rice cakes.' She looks at you. 'That’s what my husband’s letter said. Thank you for objecting, but next time see it through. This is that next time.'",
      "memo": [
        "Proposal covers 1,528 -- 212 excluded",
        "No-suit agreement included; sign today and get paid before Chuseok",
        "Refuse and a class action takes an expected 2-3 years",
        "This choice leads to the empty signature field on the 33rd floor"
      ],
      "choices": {
        "c12_final_both": {
          "label": "Pay those with papers now; take the 212 to a class action"
        },
        "c12_final_amend": {
          "label": "Hold out: sign only with the 212 in and the clause out"
        },
        "c12_final_accept": {
          "label": "Help them sign so the money arrives before Chuseok"
        },
        "reframe": {
          "label": "Reframe the table and propose, one last time"
        }
      },
      "place": "Financial Supervisory Service, Yeouido · Mediation committee room",
      "clock": "Pre-Chuseok payment cutoff · today 18:00",
      "question": "Sign the proposal without the 212 today, and the money arrives before Chuseok. What do you do?",
      "lead": "Moon Gaeul has come in a black jacket instead of her apron. The letter is in the inside pocket of her bag."
    },
    "c12_aftershock": {
      "title": "Rice Cake Day",
      "text": "The day the first payments land, a line forms outside Gaeul Rice Cakes. Moon Gaeul hands each group member a box of rice cakes, Kang Taemin carries boxes, and Na Junhyuk says 'Happy Chuseok' to each person for the 30th time. Moon Gaeul’s high school son Moon Hajun comes in his uniform to sort receipts and asks Kwon Dohyun 'Why do you write it like this?' 20 times. Kwon Dohyun answers all 20. Toward sunset, Moon Gaeul holds out the last box to you. 'This is my husband’s share. You take it for him.' Then your phone rings. It is the Group Strategy Office on the 33rd floor of group headquarters. Yoon Sanghyuk wants to talk, this time, about the signature field.",
      "memo": [
        "First compensation payments confirmed",
        "1,021 boxes of rice cakes -- every member",
        "Moon Hajun volunteers to sort receipts",
        "33rd-floor summons: this time, about the signature field"
      ],
      "choices": {
        "c12_after_fund": {
          "label": "Put a revised standard covering the 212 in writing first"
        },
        "c12_after_meet": {
          "label": "Take the last box straight up to the 33rd floor"
        },
        "c12_after_feast": {
          "label": "Hand out rice cakes until the shop shutter comes down"
        }
      },
      "place": "Gaeul Rice Cakes, Mangwon Market · Out front",
      "clock": "First payment day · Evening",
      "question": "As the last boxes go out, the 33rd floor wants to talk about the signature field. How do you close this evening?"
    },
    "c12_line": {
      "title": "Ticket No. 38",
      "text": "The day after the briefing, a line forms at the mediation filing window. Lee Minseo volunteers to help with the forms. The grandmother holding ticket No. 38 says she left her reading glasses at home and hands over her application. It has twenty-four boxes. Lee Minseo reads them aloud one by one and stops at 'loan agreement number'. She never received that number. The loan was in her son’s name, and her son has stopped answering. She smiles and says, 'Then I suppose I’m not a victim.'",
      "memo": [
        "186 waiting at the filing window",
        "No. 38: loan in her son’s name, no papers of her own",
        "Of the 24 boxes on the form, she can fill in 9"
      ],
      "choices": {
        "c12_line_choice_2": {
          "label": "Find her son and get the papers from him first"
        },
        "c12_line_choice_3": {
          "label": "Finish today’s filings for those with papers first"
        },
        "c12_line_choice_1": {
          "label": "Make a separate statement form for those without papers"
        }
      },
      "place": "Financial Supervisory Service, Yeouido · Filing window",
      "clock": "Mediation filing deadline · D-7",
      "question": "The grandmother with ticket No. 38 can fill in only nine boxes. What do you do?"
    },
    "c12_rival": {
      "title": "The Rice Cake Bill",
      "text": "At ten at night, with the shutter half down, Kwon Dohyun looks through Moon Gaeul’s ledger. He has permission. So he claims. He taps the calculator, then stops. 'Ma’am, you’re short 800,000 won every month.' Moon Gaeul keeps slicing and does not answer. On the back page of the ledger are 23 names. They are members of the group who closed their shops, and their rice cakes have never once been charged. After a long while, Kwon Dohyun draws a vertical line down that page. 'Let’s record this as an expense, not a loss. I’ll name the column.'",
      "memo": [
        "800,000 won of free rice cakes every month",
        "23 names on the back page -- owners of shops that closed",
        "Kwon Dohyun: give a column a name and it becomes a cost"
      ],
      "choices": {
        "c12_rival_choice_2": {
          "label": "Suggest covering the 800,000 first once payments come"
        },
        "c12_rival_choice_3": {
          "label": "It’s her way; leave the ledger alone"
        },
        "c12_rival_choice_1": {
          "label": "Name the column 'solidarity fee' and split it as dues"
        }
      },
      "place": "Gaeul Rice Cakes, Mangwon Market · Counter",
      "clock": "Three days before Chuseok · 22:00",
      "question": "The back page holds 23 rows of rice cakes never charged. What do you do?"
    },
    "c12_letter": {
      "title": "The Unsent Letter",
      "text": "You open the letter on a bench outside the columbarium. It is dated 3 years ago, the month after the FlowOn loan went through. 'To the reviewer. At my bank’s window I heard there was one dissent. I don’t know who wrote it. Thank you. Because of that one dissent, at least I knew I wasn’t crazy. But I have one request. Next time, please see it through. People like me don’t have the strength to.' Moon Gaeul folds the letter. 'He spent 1 year deciding whether to send it, and then he collapsed.'",
      "memo": [
        "Letter dated the month after the loan went through",
        "Addressed to the author of the dissent",
        "Request: 'next time, see it through'"
      ],
      "choices": {
        "c12_letter_choice_3": {
          "label": "Open your mediation statement with its last line"
        },
        "c12_letter_choice_1": {
          "label": "Submit the letter to the committee as reference"
        },
        "c12_letter_choice_2": {
          "label": "Give it back; the letter belongs to the family"
        }
      },
      "place": "Incheon memorial park · Bench",
      "clock": "Two days before Chuseok · 1st anniversary",
      "question": "The letter asks you to see it through next time. What do you do with it?"
    },
    "c12_line_reaction": {
      "title": "The No-Suit Clause",
      "text": "ECHO brings up the clauses of the voluntary plan’s agreement. Article 7, the no-suit agreement. Of all numbers, Article 7. Anyone who signs will bring no suit related to this loan against the group, its affiliates, or 'their officers and employees'. ECHO underlines 'their officers and employees'. 'Yoon Sanghyuk falls under these words. If 1,528 people sign, the name called at the National Assembly audit will never be called again in a civil court.'",
      "memo": [
        "The single phrase 'their officers and employees'",
        "A name that is never called again once they sign"
      ],
      "choices": {
        "c12_line_reaction_choice_1": {
          "label": "Demand 'officers and employees' be struck"
        },
        "c12_line_reaction_choice_3": {
          "label": "Payment is urgent; don’t contest the clause"
        },
        "c12_line_reaction_choice_2": {
          "label": "Explain the clause to every member first"
        }
      },
      "place": "Financial Supervisory Service, Yeouido · 1st-floor lobby",
      "clock": "Mediation filing deadline · D-7",
      "question": "Yoon Sanghyuk falls under the phrase 'their officers and employees'. What do you do about this clause?"
    },
    "c12_rival_reaction": {
      "title": "Free Rice Cakes",
      "text": "Moon Gaeul closes the ledger and smiles. 'The free rice cakes are my revenge. The bank took interest from us, didn’t it? I won’t take a thing from these people. That’s how I win.' Kwon Dohyun puts down the calculator, picks up a rice cake and eats it. He chews for a long time, then says, 'There’s no column for this in my books. That’s a first.'",
      "memo": [
        "Revenge by taking nothing",
        "Rice cakes with no column in the books"
      ],
      "choices": {
        "c12_rival_reaction_choice_3": {
          "label": "Just eat rice cakes today and add nothing"
        },
        "c12_rival_reaction_choice_2": {
          "label": "Urge her to make the system pay, not seek revenge"
        },
        "c12_rival_reaction_choice_1": {
          "label": "Ask for a column of your own in that revenge"
        }
      },
      "place": "Gaeul Rice Cakes, Mangwon Market · By the shutter",
      "clock": "Three days before Chuseok · 22:00",
      "question": "Moon Gaeul says the free rice cakes are her revenge. How do you answer it?"
    },
    "c12_letter_reaction": {
      "title": "The Month After",
      "text": "Han Seoyun gets a photo of the letter and calls late at night. The clipped, report-like endings of her sentences have loosened today. 'The date on the letter. It’s the month after I returned your dissent. He heard there was a dissent, but he never knew it had been returned.' The line is quiet for a long time. 'Could I come to the mediation committee with you? I want to tell his family my name there.'",
      "memo": [
        "A letter written the month after the return",
        "A name to say in front of the family"
      ],
      "choices": {
        "c12_letter_reaction_choice_2": {
          "label": "Ask the family first whether they want it"
        },
        "c12_letter_reaction_choice_3": {
          "label": "Talk Han Seoyun out of it and go alone today"
        },
        "c12_letter_reaction_choice_1": {
          "label": "Go to the committee with Han Seoyun"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Night",
      "clock": "Day before mediation · 23:10",
      "question": "The person who returned the dissent wants to give her name to the bereaved family. What do you do?"
    },
    "c12_branch_factory": {
      "title": "The Stopped Factory",
      "text": "Inside a factory shuttered for 1 year, six lathes stand under plastic sheets. Moon Gaeul handed over the key and said 'I can’t go in,' so you came in with Kang Taemin. The calendar on the wall stopped in the month of the bankruptcy, and a note reading 'Delivery D-3' is still stuck to the workbench. Kang Taemin pulls back one sheet and studies the lathe a long time. 'This one’s still alive. It just needs oil.' Outside, three of the seven machinists who worked here have come and are waiting.",
      "memo": [
        "6 lathes -- well preserved",
        "3 of 7 former staff want to restart",
        "Factory in Moon Gaeul’s name, pledged as collateral",
        "Compensation could cover initial restart costs"
      ],
      "choices": {
        "c12_branch_factory_c": {
          "label": "Check the loan papers for how the collateral was taken"
        },
        "c12_branch_factory_a": {
          "label": "Draw up a restart plan with the three machinists"
        },
        "c12_branch_factory_b": {
          "label": "Suggest closing it and using the money to live on"
        }
      },
      "place": "Gaon Precision, Namdong Industrial Complex, Incheon · Factory",
      "clock": "Mediation filing deadline · D-8 · Evening",
      "question": "The lathes stopped for 1 year are still alive. What do you do with this factory?"
    },
    "c12_branch_factory_follow": {
      "title": "The Lathe Turns Again",
      "text": "Kang Taemin oils it and switches on the power. The lathe spins loose once, then, for the first time in 1 year, gives a low, steady hum. The three machinists waiting outside come as far as the doorway, just to listen. The oldest, Foreman Kim, speaks. 'If we run it ourselves without the boss, the only way is a co-op. But the three of us can’t get a loan. Our credit’s all broken.' Kang Taemin takes off his gloves and tucks them into his vest pocket. 'Isn’t a loan meant for people exactly like this?'",
      "memo": [
        "1 lathe confirmed running normally",
        "A co-op needs at least 5 members",
        "All 3 machinists’ credit ratings have dropped",
        "Moon Hajun says he’ll come up with a name for the factory"
      ],
      "choices": {
        "c12_branch_factory_follow_b": {
          "label": "Propose loan terms to the bank for broken credit"
        },
        "c12_branch_factory_follow_c": {
          "label": "Put off the restart until mediation ends; cut the power"
        },
        "c12_branch_factory_follow_a": {
          "label": "Help found the co-op; ask Kang Taemin to be member four"
        }
      },
      "place": "Gaon Precision, Namdong Industrial Complex, Incheon · Factory",
      "clock": "Mediation filing deadline · D-8 · Evening",
      "question": "Machinists with broken credit cannot get a loan. What do you do with the lathe you turned back on?"
    },
    "c12_route_system": {
      "title": "The Wording of the Agreement",
      "text": "You ask for every compensation plan that carried the same condition. ECHO goes back over the last 10 years. 47 voluntary compensation plans from financial companies open. 43 of them carried a no-suit agreement. In 11 cases, greater harm came to light after people signed, but not one of them could sue again. 'Compensation has been learned as the price of buying silence, not an apology. No price tag has ever been attached.'",
      "memo": [
        "43 of 47 voluntary plans had a no-suit agreement",
        "11 cases where more harm surfaced -- 0 new suits",
        "This statistic has never been cited in any mediation material"
      ],
      "choices": {
        "c12_route_system_drop": {
          "label": "Bury the numbers and keep the mediation schedule"
        },
        "c12_route_system_publish": {
          "label": "Release the numbers to the committee and group at once"
        },
        "c12_route_system_price": {
          "label": "Demand the clause’s price be added to the payout"
        },
        "c12_route_system_evidence_turn": {
          "label": "Find the 30 billion won’s account in the books"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Test terminal",
      "clock": "Day before mediation",
      "question": "43 of 47 voluntary plans bought silence along with them. What do you do with this statistic?"
    },
    "c12_final_system_route": {
      "title": "The Price of Silence",
      "text": "The day the mediation committee meets, before sunrise. On screen, the last clause of forty-three agreements is stacked in the same spot. The wording differs by company, but the meaning is one. Never ask again. The proposal that will be put before Moon Gaeul and the group this afternoon carries the same clause. ECHO makes one empty box beside it. 'This clause has never been priced. What has no price can be neither bargained down nor refunded.'",
      "memo": [
        "43 plans with a no-suit agreement -- value assigned to the clause: 0 won",
        "People who sued again after more harm surfaced: 0",
        "Last meeting of the mediation committee: today"
      ],
      "choices": {
        "c12_final_system_route_a": {
          "label": "Set a term so the clause expires after 5 years"
        },
        "c12_final_system_route_b": {
          "label": "Leave the clause; raise only the payout"
        },
        "c12_final_system_route_c": {
          "label": "Set up a litigation fund for those who don’t sign"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Test terminal",
      "clock": "Mediation day · Dawn",
      "question": "A clause that has never been priced is in today’s proposal too. What do you do with it?"
    },
    "c12_evidence_turn": {
      "title": "Where the Money Lives",
      "text": "Match the clue against the account names one by one, and you see how the money for the voluntary plan was booked. Of the 30 billion won, 21 billion is this year’s cut to staff bonuses, and 9 billion sits in the 'brand trust recovery advertising' account. From the advisory fees that went through Haeon Partners to the gallery, the amount recovered is 0 won. Ban Jaewook closes his notebook. 'The people who took the money pay nothing, and the staff who took nothing pay the compensation. And the compensation is labeled advertising.'",
      "memo": [
        "Source of 21 billion won: staff bonus cuts",
        "Source of 9 billion won: advertising account",
        "Haeon Partners advisory fees recovered: 0 won",
        "Largest shareholder Kingsdale Partners (New York, about 30% stake) quarterly dividend: paid as scheduled"
      ],
      "choices": {
        "c12_evidence_turn_reclaim": {
          "label": "No mediation until the fees go into the payout"
        },
        "c12_evidence_turn_hold": {
          "label": "Keep the accounting quiet; reveal it on the last day"
        },
        "c12_evidence_turn_share": {
          "label": "Tell the staff whose bonuses were cut first"
        }
      },
      "place": "Trigger Lab archive (B2) · General ledger",
      "clock": "Mediation day · 07:00",
      "question": "The compensation came from staff bonuses, not from those who took the money. How do you use this record?"
    },
    "c12_start_toast": {
      "title": "A Plan for Those Who Shared a Table",
      "text": "The six who spent that night at the street stall have not scattered once in 2 weeks. Then the group announces the 30 billion won voluntary compensation plan. Anyone who takes it must sign that they will never sue again. All six point at the same line at once.",
      "memo": [
        "Voluntary plan 30 billion won -- conditional on a no-suit agreement",
        "Victims’ group leader Moon Gaeul asks to meet",
        "All six have cleared their schedules this week"
      ],
      "choices": {
        "c12_start_toast_clause": {
          "label": "Read the no-suit clause line by line first"
        },
        "c12_start_toast_fast": {
          "label": "Help people file now; getting paid comes first"
        },
        "c12_start_toast_signature": {
          "label": "Take the line the six found to the group, all together"
        },
        "c12_start_toast_visit": {
          "label": "Go see the victims’ group leader in person first"
        },
        "c12_start_toast_reframe": {
          "label": "Pull up every compensation plan with the same condition"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Mediation filing deadline · D-10",
      "question": "Six people point at the same clause. Where do you take that line first?",
      "lead": "Since that night at the street stall, the six have eaten lunch together every day."
    },
    "c12_start_record": {
      "title": "A Plan for the One Who Opened the Transcript",
      "text": "The victims’ group read the public transcript line by line. 2 weeks later the group announced the 30 billion won voluntary plan, and the press release quotes one line from your National Assembly audit testimony as 'a sincere raising of the issue'. Your sentence has become the plan’s publicity copy. Do Yoonha writes in the corner of the notice. 'Victims’ group leader Moon Gaeul, Gaeul Rice Cakes, Mangwon Market. Wants to meet at the FSS briefing the day after tomorrow.'",
      "memo": [
        "Voluntary plan 30 billion won -- conditional on a no-suit agreement",
        "Your testimony quoted in the press release",
        "The victims’ group shared the full transcript",
        "Victims’ group leader Moon Gaeul asks to meet"
      ],
      "choices": {
        "c12_start_record_clause": {
          "label": "Read the no-suit clause line by line first"
        },
        "c12_start_record_signature": {
          "label": "Formally ask that your quote be cut from the release"
        },
        "c12_start_record_fast": {
          "label": "Help people file now; getting paid comes first"
        },
        "c12_start_record_visit": {
          "label": "Go see the victims’ group leader in person first"
        },
        "c12_start_record_reframe": {
          "label": "Pull up every compensation plan with the same condition"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Mediation filing deadline · D-10",
      "question": "Your audit testimony has become the plan’s publicity copy. How do you take that sentence back?",
      "lead": "In the third paragraph of the group’s press release, you find your own words."
    },
    "c12_start_summon": {
      "title": "A Plan for the One Who Went to the 33rd Floor",
      "text": "The 33rd-floor meeting ended in 12 minutes. Yoon Sanghyuk asked you nothing and never brought up the signature field. 2 weeks later the group announces the 30 billion won voluntary plan. Several sentences in the announcement match what Yoon Sanghyuk said that day word for word. Do Yoonha writes in the corner of the notice. 'Victims’ group leader Moon Gaeul, Gaeul Rice Cakes, Mangwon Market. Wants to meet at the FSS briefing the day after tomorrow.'",
      "memo": [
        "33rd-floor meeting 12 minutes -- 0 questions",
        "Voluntary plan 30 billion won -- conditional on a no-suit agreement",
        "Sentences in the announcement match the meeting",
        "Victims’ group leader Moon Gaeul asks to meet"
      ],
      "choices": {
        "c12_start_summon_clause": {
          "label": "Read the no-suit clause line by line first"
        },
        "c12_start_summon_signature": {
          "label": "Tell the group first that the wording matches the meeting"
        },
        "c12_start_summon_fast": {
          "label": "Help people file now; getting paid comes first"
        },
        "c12_start_summon_visit": {
          "label": "Go see the victims’ group leader in person first"
        },
        "c12_start_summon_reframe": {
          "label": "Pull up every compensation plan with the same condition"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Mediation filing deadline · D-10",
      "question": "The words from the 12-minute meeting are in the announcement as they were. Whom do you tell first?",
      "lead": "2 weeks after coming down from the 33rd floor, you stop on a familiar sentence in the announcement."
    }
  },
  "echoReplies": {
    "c12_start_visit": "When you get there, a note is taped to the rice cake shop’s shutter. 'Say what you have to say at the briefing.' Moon Gaeul has no intention of welcoming you.",
    "c12_start_clause": "Reading the clause, the phrase 'their officers and employees' catches your eye. Explaining that phrase takes a whole day.",
    "c12_start_fast": "Filing speeds up. The signers’ no-suit agreements take effect just as fast.",
    "c12_mediation_own": "The room goes quiet at the apology. Moon Gaeul neither accepts nor refuses it, and sits down.",
    "c12_mediation_explain": "The record is accurate. An accurate explanation does not answer the question 'So what did you do?'",
    "c12_mediation_ask": "You ask, and answers pour out. Papers, hospital bills, closed shops. Writing them down takes two hours.",
    "c12_market_include": "You hold out, and mediation drags on. The 1,528 who could have been paid before Chuseok look at you.",
    "c12_market_prove": "As the material piles up, the 31 get names one by one. One market granny brings 30 years of household account books.",
    "c12_market_split": "Those paid first get their Chuseok. The ones without papers are next in line, again.",
    "c12_memorial_read": "When you suggest reading it together, Moon Gaeul points to the bench. Moon Hajun walks out first and takes a seat.",
    "c12_memorial_keep": "The letter is in your hand. Moon Hajun stays at the glass door, and Moon Gaeul follows you out to the bench a step behind.",
    "c12_memorial_son": "When you promise, Moon Hajun saves your number in his phone. In the name field he types 'Dissent'.",
    "c12_final_accept": "They sign, and the money arrives before Chuseok. The 212 are in no box of the proposal, and Yoon Sanghyuk’s name is never called again.",
    "c12_final_amend": "You hold out, and the group’s lawyer asks for a recess. Only the shares of those who signed early arrive before Chuseok; the 212 and the no-suit clause move to a next meeting with no date.",
    "c12_final_both": "Split in two, the 1,528 get their Chuseok and the 212 start a lawsuit. The one fighting both battles at once is you.",
    "c12_after_feast": "When the shutter comes down, the six and Moon Gaeul’s family are left in the shop. The 33rd-floor summons waits until tomorrow morning.",
    "c12_after_fund": "A standard in writing outlasts changes of staff. Signing it, Moon Gaeul says, 'This time you saw it through.'",
    "c12_after_meet": "You reach the 33rd floor with the box, and lobby security inspects it. Rice cakes. The guard asks for one.",
    "c12_line_choice_1": "With a form in place, the grandmother with No. 38 becomes a victim. Whether the committee will accept the form is still unknown.",
    "c12_line_choice_2": "Find the son and the papers appear. News she never wanted to hear may come with them.",
    "c12_line_choice_3": "The line gets shorter. The grandmother with No. 38 goes home still holding her ticket.",
    "c12_rival_choice_1": "With a name, the 23 become members, not debtors. Moon Gaeul says the name embarrasses her a little.",
    "c12_rival_choice_2": "Moon Gaeul laughs at the idea. 'That money is my husband’s share. He’d be glad to see it spent on rice cakes.'",
    "c12_rival_choice_3": "The ledger stays as it is. Next month, 800,000 won goes quietly missing again.",
    "c12_letter_choice_1": "As reference material, the letter is read by the committee members. The group’s lawyer reads it too.",
    "c12_letter_choice_2": "Moon Gaeul puts the returned letter in the innermost pocket of her bag. It will now serve no procedure at all.",
    "c12_letter_choice_3": "When your first sentence is 'next time, see it through', the room falls silent. Who that silence helps, you cannot tell.",
    "c12_line_reaction_choice_1": "When you ask to strike one phrase, the group’s lawyer raises his voice for the first time. It was the most expensive phrase in the document.",
    "c12_line_reaction_choice_2": "Of the 1,021 who hear the explanation, some hesitate to sign. While they hesitate, Chuseok draws closer.",
    "c12_line_reaction_choice_3": "The clause passes unchanged. The name called at the National Assembly audit will not be called again in court.",
    "c12_rival_reaction_choice_1": "Let in, you get a column of your own. Moon Gaeul writes its name: 'Dissent'.",
    "c12_rival_reaction_choice_2": "Systems last. Moon Gaeul remembers what the system did to her husband.",
    "c12_rival_reaction_choice_3": "The rice cakes are good. Kwon Dohyun picks up a second one.",
    "c12_letter_reaction_choice_1": "Together, the one who objected and the one who returned it stand side by side before the bereaved. Moon Gaeul has to decide which of you to look at first. Han Seoyun waits her turn on a corridor chair until the meeting ends.",
    "c12_letter_reaction_choice_2": "You ask, and Moon Gaeul takes a day to think. Then she answers, 'I want to see that person’s face.'",
    "c12_letter_reaction_choice_3": "You go alone, and the meeting is quiet. That night Han Seoyun looks at the photo of the letter for a long time.",
    "c12_branch_factory_a": "With a plan, the lathes get a date to turn again. Who pays until that date is still a blank.",
    "c12_branch_factory_b": "Closing it keeps the family warm this winter. The three machinists cover the lathes again and leave.",
    "c12_branch_factory_c": "The papers show the collateral was added two months before the bankruptcy. Who recommended it is written there too.",
    "c12_branch_factory_follow_a": "Kang Taemin signs the membership form. He says he won’t quit the night shift and will come only on weekends.",
    "c12_branch_factory_follow_b": "The proposal goes up for review. It is the first time the bank has received a proposal to lend to people with broken credit.",
    "c12_branch_factory_follow_c": "With the power off, the factory goes quiet again. Foreman Kim laughs: 'Guess we wait 1 more year.'",
    "c12_route_system_publish": "Once it is public, the same question floods the group chat. 'So if we sign, that’s it?' The committee attaches the statistic at the very end of its reference material.",
    "c12_route_system_price": "Asked to price it, the group’s lawyer answers that the clause is standard practice. He says it is the first time anyone has asked for a price tag on standard practice.",
    "c12_route_system_drop": "On schedule, the money goes out before Chuseok. The 44th agreement carries the same clause in the same spot.",
    "c12_final_system_route_a": "With a term, even those who signed can ask again after 5 years. The group starts calculating what it must clear away within those 5 years.",
    "c12_final_system_route_b": "As the payout rises, signing speeds up. Silence has a price for the first time, and the buyer set it.",
    "c12_final_system_route_c": "With a fund, a road remains even for those who don’t sign. That road takes 2 to 3 years, and no one can promise the fund will last that long.",
    "c12_evidence_turn_reclaim": "Your condition halts mediation. Only the shares of those who signed separately go out as scheduled, and that evening the rest flood Gaeul Rice Cakes with calls.",
    "c12_evidence_turn_hold": "Revealed on the last day, it silences the room. Those who signed before then never learn whose pay their compensation came from.",
    "c12_evidence_turn_share": "Once told, some staff whose bonuses were cut contact the victims’ group first. Both sides confirm they were talking about the same money.",
    "c12_mediation_evidence_turn": "Compare the accounts one by one, and it splits into whose pockets the compensation comes from, and whose it doesn’t.",
    "c12_market_evidence_turn": "Compare the accounts one by one, and it splits into whose pockets the compensation comes from, and whose it doesn’t.",
    "c12_memorial_evidence_turn": "Compare the accounts one by one, and it splits into whose pockets the compensation comes from, and whose it doesn’t.",
    "c12_route_system_evidence_turn": "Compare the accounts one by one, and it splits into whose pockets the compensation comes from, and whose it doesn’t.",
    "case12_memory_system": "Read closely, the press release carries everything from your hand except the deadlines and dates. Beside it, ECHO brings up the compensation plans that carried the same condition.",
    "case12_memory_evidence": "Set the record with the purge time against the compensation ledger, and you can read which accounts the money came from. The account on the side of the one who erased it is not on the list.",
    "c12_start_toast_visit": "When you get there, a note is taped to the rice cake shop’s shutter. 'Say what you have to say at the briefing.' Moon Gaeul has no intention of welcoming you.",
    "c12_start_toast_clause": "Reading the clause, the phrase 'their officers and employees' catches your eye. Explaining that phrase takes a whole day.",
    "c12_start_toast_fast": "Filing speeds up. The signers’ no-suit agreements take effect just as fast.",
    "c12_start_toast_signature": "When all six arrive together, the group members tense up. They have never seen six bank people sit on the victims’ side.",
    "c12_start_record_visit": "When you get there, a note is taped to the rice cake shop’s shutter. 'Say what you have to say at the briefing.' Moon Gaeul has no intention of welcoming you.",
    "c12_start_record_clause": "Reading the clause, the phrase 'their officers and employees' catches your eye. Explaining that phrase takes a whole day.",
    "c12_start_record_fast": "Filing speeds up. The signers’ no-suit agreements take effect just as fast.",
    "c12_start_record_signature": "The request goes on record. The group removes the quote and puts 'some witnesses' in its place.",
    "c12_start_summon_visit": "When you get there, a note is taped to the rice cake shop’s shutter. 'Say what you have to say at the briefing.' Moon Gaeul has no intention of welcoming you.",
    "c12_start_summon_clause": "Reading the clause, the phrase 'their officers and employees' catches your eye. Explaining that phrase takes a whole day.",
    "c12_start_summon_fast": "Filing speeds up. The signers’ no-suit agreements take effect just as fast.",
    "c12_start_summon_signature": "Once told, the group rereads the plan. Some who reread it say they will sign anyway. Chuseok is right around the corner."
  },
  "choiceVoiceLines": {
    "c12_start_visit": "Saying people come before paperwork, you go see the victims’ group leader in person first.",
    "c12_start_clause": "Saying they need to know before they sign, you read the no-suit clause line by line first.",
    "c12_start_fast": "Saying people are waiting while you argue, you help them file so they get paid quickly.",
    "c12_mediation_own": "Because it is true that you wrote it and didn’t stop it, you admit those 3 years without excuses and apologize.",
    "c12_mediation_explain": "Because the question of why you didn’t stop it needs a factual answer, you show from the records how the dissent was erased.",
    "c12_mediation_ask": "Saying their today matters more than your 3 years, you ask what they need now instead of answering.",
    "c12_market_include": "Saying money taken while people are left out is no agreement, you refuse to mediate unless the 212 are in the criteria.",
    "c12_market_prove": "Saying you should build something to submit before blaming the criteria, you start gathering evidence of harm for the 31 without papers.",
    "c12_market_split": "With Chuseok three days away, you let those with papers get paid first and fight for the rest separately.",
    "c12_memorial_read": "Saying this is not a letter to read alone, you read it there with the family.",
    "c12_memorial_keep": "As the one who wrote the dissent and still didn’t stop it, you take the letter, saying you won’t open it here but will read it out on the bench.",
    "c12_memorial_son": "Saying you won’t let that vow go unheard, you promise to teach Moon Hajun yourself how a bank makes its judgments.",
    "c12_final_accept": "Saying they must be paid before Chuseok, you help them sign the proposal.",
    "c12_final_amend": "Because this is the next time he asked you to see through, you hold out: you sign only with the 212 in and the no-suit clause out.",
    "c12_final_both": "Since only signing today brings the money before Chuseok, you let those with papers be paid now and take the 212 to a separate class action.",
    "c12_after_feast": "Saying the 33rd floor will still be there tomorrow, you hand out rice cakes until the shop shutter comes down.",
    "c12_after_fund": "Before it gets buried under today’s payments, you put a revised standard covering the 212 in writing first.",
    "c12_after_meet": "Saying there is no reason to put off talk of the signature field, you take the last box straight up to the 33rd floor.",
    "c12_line_choice_1": "Saying no number doesn’t mean no victim, you make a separate statement form that people without papers can submit.",
    "c12_line_choice_2": "Since the agreement number was issued in her son’s name, you find her son and get the papers from him first.",
    "c12_line_choice_3": "With 186 waiting at the window, you finish today’s filings for those with papers first.",
    "c12_rival_choice_1": "So Moon Gaeul doesn’t carry 800,000 won a month alone, you name the column 'solidarity fee' and split it as group dues.",
    "c12_rival_choice_2": "So the one who has been covering it alone doesn’t collapse first, you suggest covering that 800,000 won first once payments come.",
    "c12_rival_choice_3": "Sure there is meaning in rice cakes never charged, you leave the ledger alone because it is her way.",
    "c12_letter_choice_1": "Saying the committee should read the request to see it through too, you submit the letter to them as reference material.",
    "c12_letter_choice_2": "Since he held it for 1 year without sending it, you give the letter back to Moon Gaeul, saying it belongs to the family.",
    "c12_letter_choice_3": "Since you are the one asked to see it through, you open your mediation statement with the letter’s last line.",
    "c12_line_reaction_choice_1": "Saying one phrase cannot be allowed to cover Yoon Sanghyuk, you demand that 'their officers and employees' be struck from the clause.",
    "c12_line_reaction_choice_2": "Since they should know who 'their officers and employees' covers before signing, you explain the clause to every member first.",
    "c12_line_reaction_choice_3": "Since the people lined up at the window come first and payment is urgent, you don’t contest the clause.",
    "c12_rival_reaction_choice_1": "Since it is too good a fight to let her win alone, you ask for a column of your own in that revenge.",
    "c12_rival_reaction_choice_2": "Because the 800,000 won a month goes missing only from her ledger, you urge Moon Gaeul to make the system pay instead of seeking revenge.",
    "c12_rival_reaction_choice_3": "Saying a thing with no column in the books needs no words either, you just eat rice cakes today and add nothing.",
    "c12_letter_reaction_choice_1": "Saying the family should know it was returned, too, you go to the mediation committee with Han Seoyun.",
    "c12_letter_reaction_choice_2": "Since this means the one who returned it giving her name to the bereaved, you ask the family first whether they want it.",
    "c12_letter_reaction_choice_3": "Saying it is the family’s place, not a place for confession, you talk Han Seoyun out of it and go alone today.",
    "c12_branch_factory_a": "Since the lathes are still alive and three people are waiting outside, you draw up a restart plan with the three machinists.",
    "c12_branch_factory_b": "Saying the family left behind has to live first, you suggest closing the factory and using the money to live on.",
    "c12_branch_factory_c": "Saying you need to know first whether the factory can run, you check the loan papers for how the collateral was taken.",
    "c12_branch_factory_follow_a": "Saying the hands that saved the lathe should be owners too, you help found the co-op and ask Kang Taemin to be the fourth member.",
    "c12_branch_factory_follow_b": "Saying the three’s situation is not theirs alone, you propose loan terms to the bank that people with broken credit can get.",
    "c12_branch_factory_follow_c": "Since all three have broken credit and can’t get a loan, you put off the restart until mediation ends and cut the power.",
    "c12_route_system_publish": "Saying signing with knowledge differs from signing without it, you release the numbers to the committee and the group at once.",
    "c12_route_system_price": "So silence isn’t handed over for free, you demand a separate price on the no-suit clause, added to the payout.",
    "c12_route_system_drop": "Saying shaking the table delays the payments, you bury the numbers and keep the mediation schedule.",
    "c12_final_system_route_a": "So harm that surfaces later isn’t shut out too, you set a term on the no-suit clause so it expires after 5 years.",
    "c12_final_system_route_b": "Saying money is what you can win today, you leave the clause as it is and raise only the payout.",
    "c12_final_system_route_c": "Saying there must be a way to fight even for those who refuse to sign, you set up a separate litigation fund for them.",
    "c12_evidence_turn_reclaim": "Saying you can’t accept compensation the takers pay nothing toward, you refuse mediation until the advisory fees are recovered and added to the payout.",
    "c12_evidence_turn_hold": "To give them no time to fix it, you keep the accounting to yourself and reveal it on the committee’s last day.",
    "c12_evidence_turn_share": "Saying people should know where their own money went, you tell the staff whose bonuses were cut first.",
    "c12_mediation_evidence_turn": "You set the group’s stated source of the compensation against the clue line by line and work out which accounts the 30 billion won comes from.",
    "c12_market_evidence_turn": "You set the group’s stated source of the compensation against the clue line by line and work out which accounts the 30 billion won comes from.",
    "c12_memorial_evidence_turn": "You set the group’s stated source of the compensation against the clue line by line and work out which accounts the 30 billion won comes from.",
    "c12_route_system_evidence_turn": "You set the group’s stated source of the compensation against the clue line by line and work out which accounts the 30 billion won comes from.",
    "c12_start_toast_visit": "Saying people come before paperwork, you go see the victims’ group leader in person first.",
    "c12_start_toast_clause": "Saying they need to know before they sign, you read the no-suit clause line by line first.",
    "c12_start_toast_fast": "Saying people are waiting while you argue, you help them file so they get paid quickly.",
    "c12_start_toast_signature": "Saying the signers should see this line first, you take the line the six pointed at and all go to the victims’ group together.",
    "c12_start_record_visit": "Saying people come before paperwork, you go see the victims’ group leader in person first.",
    "c12_start_record_clause": "Saying they need to know before they sign, you read the no-suit clause line by line first.",
    "c12_start_record_fast": "Saying people are waiting while you argue, you help them file so they get paid quickly.",
    "c12_start_record_signature": "Saying you won’t let your sentence serve as publicity for the plan, you formally ask that your quote be removed from the press release.",
    "c12_start_summon_visit": "Saying people come before paperwork, you go see the victims’ group leader in person first.",
    "c12_start_summon_clause": "Saying they need to know before they sign, you read the no-suit clause line by line first.",
    "c12_start_summon_fast": "Saying people are waiting while you argue, you help them file so they get paid quickly.",
    "c12_start_summon_signature": "Saying they should know who wrote the plan before they sign, you tell the group first that the announcement and the meeting share the same sentences."
  },
  "pack": {
    "clue": {
      "title": "Where the Money Lives",
      "text": "Of the 30 billion won, 21 billion was cut from staff bonuses and 9 billion came from the advertising account. The money recovered from those who took it was 0 won."
    },
    "outcomes": {
      "c12_after_feast": {
        "tag": "Rice Cakes Delivered",
        "title": "You handed out 1,021 boxes until the shutter came down",
        "text": "The day the first payments landed, every member of the victims’ group got a box of rice cakes. You took the last box, as Moon Sungho’s share."
      },
      "c12_after_fund": {
        "tag": "Standard Revised",
        "title": "A box for the 212 now exists in writing",
        "text": "The revised compensation standard was filed. People who were not victims because they had no papers have a box for the first time."
      },
      "c12_after_meet": {
        "tag": "Went Up First",
        "title": "You took the last box of rice cakes up to the 33rd floor first",
        "text": "You left the line outside the shop and headed for the 33rd floor. Only the lobby guard got a rice cake out of it."
      }
    },
    "continuityChallenges": {
      "c11_after_toast": {
        "title": "Go Together with Those You Ate With",
        "text": "The six did not scatter. Standing before the victims as six, not alone, is the way to keep their trust."
      },
      "c11_after_record": {
        "title": "Take Back the Sentence Turned into Publicity",
        "text": "Your testimony was quoted in the plan’s press release. Who those words were really for will be read again on the new table."
      },
      "c11_after_summon": {
        "title": "Fill In What the 12-Minute Meeting Left",
        "text": "The meeting you went up for first left nothing behind. Revealing before the victims what was said in those 12 minutes is how you build fairness."
      }
    }
  }
};
