/**
 * 사건 47 (src/nodes/case47.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c47_start": {
      "title": "1 Year Later, the Same Text",
      "text": "The first text is from Moon Gaeul. 'Six steamers, not enough hands.' It is one more line after her text from three days ago, 'Don’t talk. Come and steam rice cakes.' Exactly 1 year on, the lines under that sentence keep growing. The second is a long email from Seon Jaeyoon, the public-interest lawyer. The class action has moved to court mediation, and the group has put forward draft 2nd-round compensation criteria. Of the 212 without papers, 181 have their harm confirmed through subcontracting statements and testimony, and they will be paid within the Chuseok holiday. Next to the remaining 31, one word is stamped. 'Unconfirmable.' Seon Jaeyoon added a line at the end of the email. 'The 31 are the very people Moon Gaeul stopped slicing rice cakes to ask about last year.'",
      "memo": [
        "2nd-round compensation draft -- 181 of 212 confirmed, paid within the holiday",
        "The remaining 31: 'Unconfirmable'",
        "Plaintiffs’ consent deadline: 18:00, the day before Chuseok",
        "Moon Gaeul: 'Six steamers, not enough hands'"
      ],
      "choices": {
        "c47_start_first": {
          "label": "Lock in the 181 holiday payments; put the 31 off"
        },
        "c47_start_criteria": {
          "label": "Read the 'Unconfirmable' criteria line by line first"
        },
        "c47_start_names": {
          "label": "Go over the 31 names with Moon Gaeul before the shop opens"
        },
        "reframe": {
          "label": "Find compensation criteria that included people without papers"
        }
      },
      "place": "KD Capital Risk Management Department · Window Seat",
      "clock": "Three Days Before Chuseok · 07:40",
      "question": "The 181 get paid within the holiday; the 31 are stamped 'Unconfirmable.' What do you do first?",
      "lead": "On a morning before the Chuseok rush, your phone buzzes twice in a row at your window seat in the KD Capital office."
    },
    "c47_steam": {
      "title": "Six Steamers",
      "text": "Moon Gaeul’s handwritten work roster is taped to the fridge door at Gaeul Rice Cake Shop. Kang Taemin has been promoted to 'Steamer Foreman' this year. Seo Jiho, the former night-shift worker who came to the shop two weeks ago, learned songpyeon stamping from Na Junhyuk, and three days later people say his shapes are more even than his teacher’s. Na Junhyuk pretends to be pleased and sulks: '30 years of stamping, and now I have an heir.' Kwon Dohyun is back at the counter on the condition that he never says 'deficit.' Instead, each time a customer leaves, he writes something in the bottom row of the ledger. At 11, Nam Heewon walks in. She is 74 and ran the Gaon Precision cafeteria for 12 years. The year the company went bankrupt, she never got back the 23.4 million won it ran up on her tab. Her ledger, wrapped in plastic, took on water in the July monsoon, and seven pages have run. 'Last year I came to buy rice cakes. This year I came to find my name. But the paper cried first.'",
      "memo": [
        "Roster: Kang Taemin, steamer foreman; Seo Jiho, songpyeon stamping",
        "Kwon Dohyun: back at the counter, on condition he never says 'deficit'",
        "Nam Heewon (74): Gaon Precision cafeteria, 12 years; 23.4 million won on tab",
        "Seven ledger pages soaked in the monsoon"
      ],
      "choices": {
        "c47_steam_orders": {
          "label": "Finish the holiday orders; leave the 31 for the evening"
        },
        "c47_steam_dry": {
          "label": "Dry Nam Heewon’s wet ledger by the steamers and read it together"
        },
        "c47_steam_appeal": {
          "label": "File objections to all 31 'Unconfirmable' rulings"
        },
        "reframe": {
          "label": "Find compensation criteria that included people without papers"
        },
        "c47_steam_evidence_turn": {
          "label": "Find where the 2nd-round fund’s leftover money goes"
        }
      },
      "place": "Mangwon Market Gaeul Rice Cake Shop",
      "clock": "Three Days Before Chuseok · 10:00",
      "question": "In the middle of the holiday rush, someone holding a wet ledger has come to find a name. What do you do first?",
      "lead": "Your name is on the roster too. Your job: 'Dishes and odd jobs.' Next to it, in small letters: 'Reflects last year’s performance.'"
    },
    "c47_factory": {
      "title": "First Profit",
      "text": "In the July monsoon, the To-the-End Precision factory flooded to the knee. Now all six of its lathes are turning. Eleven months after the factory reopened as a cooperative, the August books show a profit for the first time. 4.12 million won. Foreman Kim printed the number large and taped it to every lathe, and Kwon Dohyun checks it three times and says, 'It’s a profit, all right.' He says it is his third profit this month alone, and looks a little moved. Clearing out the old president’s office for the party, Foreman Kim stops at the bottom drawer of the desk. It is the drawer Moon Gaeul could not bring herself to open. Inside is a black notebook. On the cover, in Moon Sungho’s handwriting: 'To Repay.' Inside are 31 names, amounts and dates. Cafeteria, 23.4 million won. Work-clothes laundry, 4.1 million won. Three quick-delivery riders… The last page holds a single line. 'Before Chuseok, the cafeteria first.'",
      "memo": [
        "First profit in the August books: 4.12 million won",
        "All 6 lathes running -- monsoon damage repaired",
        "Moon Sungho’s notebook 'To Repay': 31 names · amounts · dates",
        "Last line: 'Before Chuseok, the cafeteria first'"
      ],
      "choices": {
        "c47_factory_match": {
          "label": "Match the notebook’s 31 lines against the list of 31"
        },
        "c47_factory_family": {
          "label": "Take the notebook to Moon Gaeul first; let the family decide"
        },
        "c47_factory_send": {
          "label": "Photograph the notebook and send it to Yeon Seojun as leverage"
        },
        "reframe": {
          "label": "Find compensation criteria that included people without papers"
        },
        "c47_factory_evidence_turn": {
          "label": "Find where the 2nd-round fund’s leftover money goes"
        }
      },
      "place": "To-the-End Precision, Namdong Industrial Complex, Incheon · Factory",
      "clock": "Two Days Before Chuseok · 14:00",
      "question": "On the day of the first profit, Moon Sungho’s 'To Repay' notebook turned up in a drawer. What do you do with it?",
      "lead": "A sheet on the factory gate reads 'To-the-End Precision First Profit Party -- 18:00,' and below it someone has added in ballpoint, 'Rice cakes provided.'"
    },
    "c47_memorial": {
      "title": "2nd Anniversary",
      "text": "At the columbarium niche where the 1st anniversary was held this time last year, Moon Gaeul sets down three songpyeon and a glass of soju. This year the songpyeon are unusually even. Seo Jiho stamped them, she says. Moon Hajun, in his school uniform, holds his phone screen up to the glass door. A text that came last night. 'Early admission, round 1 passed -- Business Administration, interview October 18.' Hajun speaks quietly. 'Dad, I’ve still got a long way to go before I’m a banker, but round 1’s done.' Moon Gaeul laughs, then turns her head away. From her bag she takes out her husband’s black notebook from the factory drawer yesterday, 'To Repay.' Besides the 31 names and amounts, Moon Sungho’s notes to himself fill the margins. 'Couldn’t pay them again today. I’m sorry.' Moon Gaeul tightens her grip on the notebook. 'If I hand this in, everyone will know. That he died without even paying for people’s holiday meals.'",
      "memo": [
        "Moon Sungho’s 2nd anniversary -- three songpyeon, a glass of soju",
        "Moon Hajun: early admission round 1 passed, interview October 18",
        "'To Repay' notebook: 31 names and amounts",
        "Margin: 'Couldn’t pay them again today. I’m sorry.'"
      ],
      "choices": {
        "c47_memorial_cover": {
          "label": "Cover his private notes; submit only the 31 lines as evidence"
        },
        "c47_memorial_son": {
          "label": "Celebrate Hajun’s news first; leave the notebook for the evening"
        },
        "c47_memorial_wait": {
          "label": "Sit with Moon Gaeul on the columbarium bench until she decides"
        },
        "reframe": {
          "label": "Find compensation criteria that included people without papers"
        },
        "c47_memorial_evidence_turn": {
          "label": "Find where the 2nd-round fund’s leftover money goes"
        }
      },
      "place": "Incheon memorial park · Columbarium",
      "clock": "Day Before Chuseok · 11:00 · 2nd Anniversary",
      "question": "An acceptance text and a note saying 'couldn’t pay' sit before the glass door on the same day. What do you do with the notebook?",
      "lead": "On the first day of the Chuseok holiday, the columbarium corridor is crowded. As last year, you see a back in a school uniform first, a hand’s width taller now."
    },
    "c47_final": {
      "title": "The 31",
      "text": "When Yeon Seojun of Doyul Law Firm walks into Gaeul Rice Cake Shop in a gray suit, Moon Gaeul says nothing and hands him an apron first. He hesitates a moment, then puts it on. Seon Jaeyoon spreads out the mediation proposal. If they consent by 18:00 today, the 181 are paid during the holiday. The 31 keep their 'Unconfirmable' stamp, and in exchange each receives a 3 million won consolation payment. Whoever takes it signs a no-suit agreement. Yeon Seojun speaks quietly. 'We respect the notebook. But a handwritten note by the deceased is not a document that proves harm.' Beside the counter sits Nam Heewon, who ran the Gaon Precision cafeteria, hugging her ledger, soaked and dried again. Moon Gaeul looks at you. 'Last year, in my husband’s letter, he asked you to see it through next time. This year I’m the one asking. Don’t finish this without these people.'",
      "memo": [
        "181: paid during the holiday if they consent by 18:00 today",
        "31: 3 million won consolation each + no-suit agreement",
        "Total claims of the 31: 620 million won",
        "This choice leads to the credit committee the morning after next"
      ],
      "choices": {
        "c47_final_settle": {
          "label": "Let the 31 take the payment; close the 2nd round today"
        },
        "c47_final_split": {
          "label": "Consent for the 181 today; prove the 31 in court separately"
        },
        "c47_final_hold": {
          "label": "No consent until the notebook and neighbors bring in the 31"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Mangwon Market Gaeul Rice Cake Shop",
      "clock": "Day Before Chuseok · 17:00 · Consent Deadline 18:00",
      "question": "Close without the 31, and the 181 get paid during the holiday. What do you do with the hour that is left?",
      "lead": "An hour before the deadline, all six steamers in the shop let off steam at once. Outside the shutter, 12 of the 31 have come."
    },
    "c47_aftershock": {
      "title": "Thank…",
      "text": "On the roof of Gaeul Rice Cake Shop, the full moon has risen over the market roofs. Moon Gaeul spreads the leftover songpyeon on the low wooden platform, and Na Junhyuk holds one of Seo Jiho’s songpyeon up to the moon and finally admits, 'This beats my stamping.' Kwon Dohyun gets his calculator confiscated while totting up the rice cake bill, and Moon Hajun, sketching the people on the roof, counts '11.' When the moon is highest, Moon Gaeul sits down next to you. 'There’s something I’ve wanted to say since last year. Thank…' She stops and pushes a songpyeon into your mouth. '…just eat your rice cake.' Then a KD Capital notice pops up on your phone. Under the new rules, every committee member signs under their real name, and the first extraordinary credit committee meets tomorrow at 9 a.m. Your name is at the bottom of the member list. The agenda is still a single line. 'Working capital for a delivery platform.' The first line of that file 3 years ago began the same way.",
      "memo": [
        "Chuseok full moon -- 11 on the Gaeul Rice Cake Shop roof",
        "Moon Gaeul: songpyeon instead of 'Thank…'",
        "KD Capital extraordinary credit committee: tomorrow 09:00, members e-sign under real names",
        "One-line agenda: 'Working capital for a delivery platform'"
      ],
      "choices": {
        "c47_after_rush": {
          "label": "Grab a bag of songpyeon and go down first to prepare"
        },
        "c47_after_warm": {
          "label": "Stay on the roof making songpyeon until the moon sets"
        },
        "c47_after_record": {
          "label": "Write the 31 stories and evidence into a criteria revision request"
        }
      },
      "place": "Mangwon Market Gaeul Rice Cake Shop · Roof",
      "clock": "Chuseok · Full Moon · 21:00",
      "question": "Under the full moon come words left unsaid and a call to the committee the day after Chuseok. How do you close this night?"
    },
    "c47_ledger": {
      "title": "This Year’s Column",
      "text": "In the shop with its shutter half down, Kwon Dohyun opens Moon Gaeul’s ledger. This time he really has permission. It is the column he ruled off last Chuseok: free rice cakes for the owners whose shops closed. The 23 lines of names are down to nine this year. 14 people have reopened their shops or been compensated. But at the bottom of the column there is one new line. '31 -- one box a month.' Kwon Dohyun taps the calculator, then stops. 'Ma’am, this ledger is in the black this year for the first time. As long as you leave out this line.' Moon Gaeul answers as she slices rice cakes. 'A profit that leaves out that line, I’ll pass on.'",
      "memo": [
        "Last year 23 lines → this year 9",
        "New line: one box a month for the 31",
        "Shop ledger’s first profit -- if you leave out that line"
      ],
      "choices": {
        "c47_ledger_choice_1": {
          "label": "Ask colleagues to split the cost of the 31 boxes"
        },
        "c47_ledger_choice_3": {
          "label": "Leave the holiday books till after the break; close the shutter"
        },
        "c47_ledger_choice_2": {
          "label": "Turn that line’s dates into a record of dealings with the 31"
        }
      },
      "place": "Mangwon Market Gaeul Rice Cake Shop · Counter",
      "clock": "Three Days Before Chuseok · 22:00",
      "question": "A new line, '31,' has appeared at the bottom of the free rice cake column. What do you do with it?"
    },
    "c47_banner": {
      "title": "To the End, Three Times",
      "text": "Moon Hajun takes the subway straight from school and arrives in his uniform, a rolled banner slung on his back. He says he painted it on the sly in art class. It reads 'To-the-End Precision’s First Profit -- We Held On To the End, and Kept It To the End.' Kwon Dohyun says, 'That’s three “to the end”s. Way down from the eleven in last year’s business plan.' Hajun answers, 'That’s growth.' Once the banner is up, the members hold an impromptu general meeting in front of the lathes. One item on the agenda: where the 4.12 million won profit goes. Five members still haven’t been paid two months’ wages from last winter. Foreman Kim raises a hand. 'I’d like it to go first to the people in the boss’s notebook. We worked on the food from their kitchen.'",
      "memo": [
        "Banner: 'to the end' 3 times -- last year’s business plan: 11 times",
        "General meeting agenda: how to use the 4.12 million won profit",
        "5 members: two months’ wages unpaid since last winter"
      ],
      "choices": {
        "c47_banner_choice_3": {
          "label": "Put the profit toward back pay; leave the 31 to compensation"
        },
        "c47_banner_choice_2": {
          "label": "Let them decide by secret ballot, as the bylaws say"
        },
        "c47_banner_choice_1": {
          "label": "Back Foreman Kim: set the profit aside for the 31 first"
        }
      },
      "place": "To-the-End Precision, Namdong Industrial Complex, Incheon · Factory Yard",
      "clock": "Two Days Before Chuseok · 18:00",
      "question": "The meeting before the lathes asks where the first profit of 4.12 million won should go. Which side do you take?"
    },
    "c47_count": {
      "title": "From 212 to 31",
      "text": "Arriving late for the 2nd anniversary, Do Yoonha opens a worn notebook on the bench outside the columbarium. These are the names he began counting alone behind the window 3 years ago. Of the 212, 181 names have a thin line through them, with the date confirmed and the expected payment date beside each. 31 names remain without a line. Do Yoonha uncaps his pen, then caps it again. 'This time last year it was 212. Every line I drew felt good, but today, strangely, I’m scared. Do I write unconfirmable next to these 31, or write nothing?' On the back page of the notebook, the date of the year he collapsed is still there, pressed hard in ballpoint.",
      "memo": [
        "Do Yoonha’s notebook: 181 of 212 lined through",
        "31 names left -- no words to write",
        "Uncaps and caps his pen four times"
      ],
      "choices": {
        "c47_count_choice_2": {
          "label": "Enter Do Yoonha’s notebook in the plaintiffs’ evidence list"
        },
        "c47_count_choice_1": {
          "label": "Write today’s clue beside each of the thirty-one names"
        },
        "c47_count_choice_3": {
          "label": "Close the notebook today; celebrate the 181 payments first"
        }
      },
      "place": "Incheon memorial park · Bench",
      "clock": "Day Before Chuseok · 12:30",
      "question": "Do Yoonha asks what to write beside the thirty-one names without a line. What do you do?"
    },
    "c47_ledger_reaction": {
      "title": "The People Who Fed Them",
      "text": "Moon Gaeul sets down her knife and looks out past the shutter. A nearly round moon hangs over the market alley. 'Those thirty-one, they’re the people my husband ran a tab with. Heewon cooked the factory’s meals, the laundry owner washed the work clothes, and the three quick riders hauled parts every dawn. Of course they’re not in any loan papers. They’re the people my husband meant to pay back.' She scratches that line in the ledger with her fingernail. 'He died without paying. So I’m paying it back in rice cakes. No interest.'",
      "memo": [
        "The people who fed, clothed and ran for the factory on credit",
        "Paying it back in rice cakes, no interest"
      ],
      "choices": {
        "c47_ledger_reaction_choice_1": {
          "label": "Have Moon Gaeul name the 31 one by one, and write them down"
        },
        "c47_ledger_reaction_choice_2": {
          "label": "Propose rewriting her husband’s debts as the group’s liability"
        },
        "c47_ledger_reaction_choice_3": {
          "label": "Pull the shutter down together; talk tomorrow"
        }
      },
      "place": "Mangwon Market Gaeul Rice Cake Shop · By the Shutter",
      "clock": "Three Days Before Chuseok · 22:40",
      "question": "The 31 are the people her husband ran a tab with, and Moon Gaeul is paying that debt in rice cakes. What do you say?"
    },
    "c47_banner_reaction": {
      "title": "The Cafeteria First",
      "text": "In front of the lathes after the party, Kang Taemin pours barley tea into a paper cup and hands it to Foreman Kim. Foreman Kim looks at the last page of the notebook for a long time. 'A month before the factory closed, the boss said it. Before Chuseok, let’s pay the cafeteria tab first. The person who fed us can’t go into the holiday empty-handed.' Foreman Kim smiles, eyes red at the rims. 'The factory stopped before Chuseok came that year.' After a long pause, Kang Taemin says briefly, 'Then we pay it this Chuseok.' Foreman Kim sets the cup down. 'I wish we could. But they say those people have no papers.'",
      "memo": [
        "The promise a month before the factory closed: the cafeteria first",
        "Tabs owed to people without papers"
      ],
      "choices": {
        "c47_banner_reaction_choice_3": {
          "label": "Put the promise off; wrap up the party tonight"
        },
        "c47_banner_reaction_choice_2": {
          "label": "First find a way to verify the notebook as Moon Sungho’s hand"
        },
        "c47_banner_reaction_choice_1": {
          "label": "Promise the cafeteria tab gets paid first, this Chuseok"
        }
      },
      "place": "To-the-End Precision, Namdong Industrial Complex, Incheon · In Front of the Lathes",
      "clock": "Two Days Before Chuseok · 19:00",
      "question": "A month before the factory stopped, Moon Sungho said to pay the cafeteria tab first. What do you do with that promise?"
    },
    "c47_count_reaction": {
      "title": "Could They Be Accepted?",
      "text": "On Subway Line 1 on the way back, Moon Hajun opens his sketchbook and draws something. A plate holding 31 songpyeon. Each songpyeon has a nickname in small letters. 'Two Pieces of Mackerel,' 'Red Motorbike,' 'Ironing Grandpa.' Hajun stops his pencil. 'When I become a banker, could I accept people like this too? People without papers. NOAH would say no, right?' In the next seat, Moon Gaeul dozes with the notebook on her lap. Hajun lowers his voice. 'I know Mom is paying Dad’s debts with rice cakes. Mom thinks I don’t know.'",
      "memo": [
        "Nicknames for 31 songpyeon",
        "The debt Mom is paying in rice cakes"
      ],
      "choices": {
        "c47_count_reaction_choice_1": {
          "label": "Tell Hajun you’ll look for a way to accept them together"
        },
        "c47_count_reaction_choice_3": {
          "label": "It’s the day of his good news; drop the bank talk"
        },
        "c47_count_reaction_choice_2": {
          "label": "Explain there must be a rule to count people without papers"
        }
      },
      "place": "Subway Line 1 · Car",
      "clock": "Day Before Chuseok · 14:00",
      "question": "Moon Hajun asks whether, as a banker, he could accept people without papers. What do you answer?"
    },
    "c47_branch_screen": {
      "title": "0.3 Seconds, 31 Times",
      "text": "When you stop by the Gangseo Branch to pick up an objection form, Assistant Manager Tak Yerin turns the corporate loan window’s monitor toward you. The 1st-round screening for the 2nd-round compensation criteria was also handled by NOAH, the AI review engine. Of 212 cases, 31 were rejected in 0.3 seconds each, all for the same reason. 'No electronic transaction history.' Tak Yerin points at the screen. 'A tab doesn’t show up in the system. No owner gets paid for cafeteria meals by bank transfer, regular as clockwork. NOAH didn’t decide these people don’t exist. It just doesn’t know how to count people it can’t see.' Beyond the window, next to the ticket machine, the handwritten floor map Moon Hajun taped up last winter is still there.",
      "memo": [
        "2nd-round criteria, 1st-round screening: NOAH",
        "Each of the 31 rulings took 0.3 seconds",
        "Reason: no electronic transaction history",
        "Moon Hajun’s floor map by the ticket machine"
      ],
      "choices": {
        "c47_branch_screen_rule": {
          "label": "Demand that NOAH’s 'Unconfirmable' rule be disclosed"
        },
        "c47_branch_screen_review": {
          "label": "Write a request with Tak Yerin for human review of the 31"
        },
        "c47_branch_screen_skip": {
          "label": "Leave the rulings; check the 181 payment schedule first"
        }
      },
      "place": "KD Bank Gangseo Branch · Corporate Loan Window",
      "clock": "Three Days Before Chuseok · 15:00",
      "question": "31 cases fell in 0.3 seconds each, for 'No electronic transaction history.' What do you do about the ruling?"
    },
    "c47_branch_screen_follow": {
      "title": "Meal Payment Records",
      "text": "Tak Yerin types for a long time, then stops. 12 years ago, Nam Heewon opened an installment savings account at this branch. Every month, meal money came into it under the name Gaon Precision. 1.8 million won in a slow month, 2.6 million won in a busy one. Then, four months before the bankruptcy, the deposits stop. The date the tab began is stamped in the bank’s system, in reverse. Tak Yerin speaks more quietly. 'This is our bank’s own record, so I can look it up. But to submit it for mediation, we need the customer’s consent, and to search all 31 like this, I need the branch manager’s signature.' Through the gap in the branch manager’s door, you can see Branch Manager Seo Taekyung sorting Chuseok gift boxes.",
      "memo": [
        "Nam Heewon’s savings account: monthly Gaon Precision meal payments",
        "Deposits stop four months before the bankruptcy",
        "Submitting for mediation: customer consent needed",
        "Searching all 31: branch manager’s sign-off needed"
      ],
      "choices": {
        "c47_branch_screen_follow_all": {
          "label": "Get the branch manager’s approval to search all 31"
        },
        "c47_branch_screen_follow_consent": {
          "label": "Show Nam Heewon the records first and get her consent"
        },
        "c47_branch_screen_follow_one": {
          "label": "Get Nam Heewon’s case recognized first; find the rest later"
        }
      },
      "place": "KD Bank Gangseo Branch · Banking Hall",
      "clock": "Three Days Before Chuseok · 16:30",
      "question": "The bank’s system shows, in reverse, the date the tab began. How do you use this record?"
    },
    "c47_route_system": {
      "title": "Two Neighbors",
      "text": "You put off the consent decision and give ECHO one calculation. Was there ever a compensation standard that included people without papers? From a laptop in the corner of the shop, ECHO answers. It is the first calculation it has taken on since coming back. Of 64 domestic compensation standards over the past 20 years, 7 included victims without papers. All 7 used vouching by two neighbors or coworkers, and not a single vouch was later found to be false. Under the other 57, some 12,000 people were left out as 'Unconfirmable.' 'If I had a function for disliking things, I would use it on this output. Unconfirmable is not the name for where a calculation ends. It is the name for where someone stopped calculating.' Beside the laptop is a plate of songpyeon Moon Gaeul set down, saying, 'That’s its share,' and steam from the steamers fogs the screen.",
      "memo": [
        "7 of 64 compensation standards included victims without papers",
        "All 7 used neighbor vouching -- 0 false vouches",
        "Some 12,000 people left out as 'Unconfirmable'"
      ],
      "choices": {
        "c47_route_system_vouch": {
          "label": "Find two neighbors to vouch for each of the 31 today"
        },
        "c47_route_system_share": {
          "label": "Post the figures to the mediation panel and the plaintiffs’ chat"
        },
        "c47_route_system_skip": {
          "label": "Set the figures aside; stick to the mediation schedule"
        },
        "c47_route_system_evidence_turn": {
          "label": "Find where the 2nd-round fund’s leftover money goes"
        }
      },
      "place": "Mangwon Market Gaeul Rice Cake Shop · Corner Table",
      "clock": "Three Days Before Chuseok · 13:00",
      "question": "Every standard that included victims without papers used two neighbors’ vouching. What do you do with these figures?"
    },
    "c47_final_system_route": {
      "title": "62 Neighbors",
      "text": "At four in the afternoon on the day before Chuseok, steam from the six steamers drifts all the way to the corner table. ECHO’s screen shows 31 lines, each stamped 'Unconfirmable.' ECHO makes one more column beside them. 'Neighbors who can confirm.' The column on the screen is still empty. Two hours to the consent deadline. Words come up on the screen. 'Two neighbors each for 31 people is sixty-two. My calculation ends here. The next line gets filled by walking the market alley and asking. It is a column that fills if no one stops.'",
      "memo": [
        "31 'Unconfirmable' -- two vouchers each makes 62",
        "7 standards accepted neighbor vouching -- 0 false vouches",
        "Plaintiffs’ consent deadline: 18:00 today"
      ],
      "choices": {
        "c47_final_system_route_c": {
          "label": "Use the leftover money for a separate fund for victims without papers"
        },
        "c47_final_system_route_b": {
          "label": "Leave the clause; just raise the 31’s consolation payment"
        },
        "c47_final_system_route_a": {
          "label": "Add a clause accepting two neighbors’ vouching instead of papers"
        }
      },
      "place": "Mangwon Market Gaeul Rice Cake Shop · Corner Table",
      "clock": "Day Before Chuseok · 16:00",
      "question": "A new column has appeared beside 'Unconfirmable.' With two hours left, whose words will fill it?"
    },
    "c47_evidence_turn": {
      "title": "The Leftover Money",
      "text": "When you line the clue up against the totals field of the disbursement sheet, the structure of the 2nd-round compensation fund opens up. The fund is 14 billion won; 11.8 billion won goes to the 181. The remaining 2.2 billion won passes to the group’s social-contribution foundation at year-end as an 'unspent balance,' and the first line of the foundation’s plan for next year says where it will go. 'Hangawi Sharing Campaign -- TV commercials.' Add up all the claims of the 31, and it comes to 620 million won. Kwon Dohyun puts down his calculator. 'Pay the 31 in full and 1.58 billion won is still left. With the money for a Chuseok sharing ad, they cut out the people to share with at Chuseok. This isn’t a deficit or a profit. It’s just a wrong calculation.'",
      "memo": [
        "2nd-round compensation fund 14 billion won -- 11.8 billion won to the 181",
        "Unspent balance of 2.2 billion won: the foundation’s 'Hangawi Sharing' ads",
        "Total claims of the 31: 620 million won"
      ],
      "choices": {
        "c47_evidence_turn_hold": {
          "label": "Keep the balance document; bring it out if mediation falters"
        },
        "c47_evidence_turn_demand": {
          "label": "No consent until the 31’s share comes out of the 2.2 billion won"
        },
        "c47_evidence_turn_share": {
          "label": "Tell the 181 and the 31 where the leftover money goes"
        }
      },
      "place": "Seon Jaeyoon Law Office · Records Room",
      "clock": "Before Chuseok · Records Room",
      "question": "Pay the 31 in full and 1.5 billion won is still left, and it goes to sharing ads. How do you use this record?"
    },
    "c47_start_warm": {
      "title": "Chuseok for the One Who Stayed",
      "text": "The night the shredding truck left, you stayed beside ECHO with your colleagues until the lights went out in the Pangyo test server room. Meanwhile, 11 replies came into the rice cake shop group chat, saying they would come for the Chuseok rush. Three days later, at 7:40 in the morning, Moon Gaeul sends one more line. 'Six steamers, not enough hands.' Right below it, Seon Jaeyoon posts the class action’s draft 2nd-round compensation criteria. Of the 212 without papers, 181 will be paid within the holiday, and 31 are stamped 'Unconfirmable.' The consent deadline is 18:00 on the day before Chuseok. Lee Minseo replies. 'I asked ECHO. It says unconfirmable isn’t a judgment. It means no one judged. Oh, ECHO’s coming to the shop too. On the laptop.'",
      "memo": [
        "Rice cake shop group chat: 11 replies saying they’ll come for the rush",
        "2nd-round draft: 181 confirmed, 31 'Unconfirmable'",
        "Consent deadline: 18:00, the day before Chuseok"
      ],
      "choices": {
        "c47_start_warm_names": {
          "label": "Go over the 31 names with Moon Gaeul before the shop opens"
        },
        "c47_start_warm_criteria": {
          "label": "Read the 'Unconfirmable' criteria line by line first"
        },
        "c47_start_warm_first": {
          "label": "Lock in the 181 holiday payments; put the 31 off"
        },
        "c47_start_warm_signature": {
          "label": "Gather everyone from the chat outside the shop at dawn"
        },
        "c47_start_warm_reframe": {
          "label": "Find compensation criteria that included people without papers"
        }
      },
      "place": "KD Capital Risk Management Department · Window Seat",
      "clock": "Three Days Before Chuseok · 07:40",
      "question": "In the chat where 11 said they would come, the shop’s call and 'Unconfirmable' sit side by side. Who do you go with, and where?",
      "lead": "Three days since you stayed beside ECHO until the test server room went dark, and the group chat alerts haven’t stopped since morning."
    },
    "c47_start_record": {
      "title": "Chuseok for the One Who Left a Way to Read",
      "text": "Three days since you wrote ECHO’s recalculation and the 318 dots into a 14-page report. The last page was titled 'How to Read the Dot Beside an Empty Field.' Ban Jaewook, the report tucked into his notebook, calls at 7 in the morning. Seon Jaeyoon has sent the class action’s draft 2nd-round compensation criteria, he says. Of the 212 without papers, 181 confirmed, 31 'Unconfirmable.' The consent deadline is 18:00 on the day before Chuseok. Ban Jaewook reads it once more. 'The reason for all 31 rulings is the same single line. No electronic transaction history. And the decided-by field is empty on every one. Exactly the pattern in the report. This time we should ask first who left it empty.' As soon as you hang up, a text comes from Moon Gaeul. One line under her text from three days ago. 'Six steamers, not enough hands.'",
      "memo": [
        "Three days since handing over the 14-page report",
        "2nd-round draft: decided-by field blank for the 31",
        "Consent deadline: 18:00, the day before Chuseok"
      ],
      "choices": {
        "c47_start_record_signature": {
          "label": "Demand in writing that the 31 decided-by fields be filled"
        },
        "c47_start_record_first": {
          "label": "Lock in the 181 holiday payments; put the 31 off"
        },
        "c47_start_record_criteria": {
          "label": "Read the 'Unconfirmable' criteria line by line first"
        },
        "c47_start_record_names": {
          "label": "Go over the 31 names with Moon Gaeul before the shop opens"
        },
        "c47_start_record_reframe": {
          "label": "Find compensation criteria that included people without papers"
        }
      },
      "place": "KD Capital Risk Management Department · Window Seat",
      "clock": "Three Days Before Chuseok · 07:00",
      "question": "The decided-by field on the rulings that cut out the 31 is empty. How do you handle that empty field?",
      "lead": "Three days after handing in 'How to Read the Dot Beside an Empty Field' as a report, Ban Jaewook calls at 7 in the morning."
    },
    "c47_start_rush": {
      "title": "Chuseok for the One Who Ran Ahead",
      "text": "The night the shredding truck left, you walked out of the server room and dug into 26 pre-holiday files at the KD Capital office, and the three days since have gone to paperwork too. Moon Gaeul’s text has stayed unread at the top of your phone. This morning at 7:40, Oh Jinwoo knocks on the KD Capital office door. Instead of a box of rice cakes, he is holding a printout: the class action’s draft 2nd-round compensation criteria. Of the 212 without papers, 181 will be paid within the holiday, 31 'Unconfirmable.' The consent deadline is 18:00 on the day before Chuseok. Oh Jinwoo holds out his phone. It is a new message Moon Gaeul posted in the group chat. 'Six steamers, not enough hands.' You are the only one who hasn’t replied. 'Everyone’s there. They say only your apron is still hanging on its nail.'",
      "memo": [
        "26 pre-holiday files -- day three",
        "Rice cake shop chat: 1 person hasn’t replied",
        "2nd-round draft: 31 'Unconfirmable'"
      ],
      "choices": {
        "c47_start_rush_names": {
          "label": "Go over the 31 names with Moon Gaeul before the shop opens"
        },
        "c47_start_rush_criteria": {
          "label": "Read the 'Unconfirmable' criteria line by line first"
        },
        "c47_start_rush_first": {
          "label": "Lock in the 181 holiday payments; put the 31 off"
        },
        "c47_start_rush_signature": {
          "label": "Put the rest of the files in a drawer; go with Oh Jinwoo"
        },
        "c47_start_rush_reframe": {
          "label": "Find compensation criteria that included people without papers"
        }
      },
      "place": "KD Capital Risk Management Department · Window Seat",
      "clock": "Three Days Before Chuseok · 07:40",
      "question": "You are the only one who hasn’t replied in the shop chat. Arriving late, what do you do first?",
      "lead": "Since leaving the server room, you have spent three days among stacks of files. Oh Jinwoo knocks on the office door."
    }
  },
  "echoReplies": {
    "c47_start_names": "Going over the names together, Moon Gaeul recalls the faces of 26 of the 31. The other five have never come in to buy rice cakes.",
    "c47_start_criteria": "Reading the criteria shows that 'Unconfirmable' is defined in a single line. 'No electronic transaction history.' Overturning that one line takes the whole morning.",
    "c47_start_first": "The 181 payments are locked in. The 31 become 'next in line' once again, and the deadline clock keeps running.",
    "c47_steam_dry": "As the ledger dries, five of the seven blurred pages become readable again. A tray of songpyeon burns by the steamer, and Kang Taemin silently puts on a new one.",
    "c47_steam_appeal": "While you write the 31 forms, the holiday orders back up. The objections won’t be read until after the holiday.",
    "c47_steam_orders": "The orders go out on time. Nam Heewon waits until evening with the ledger on her lap.",
    "c47_factory_family": "At the evening party, Moon Gaeul stares at the notebook’s cover for a long time, then hands it back to Foreman Kim. Opening it takes a day, and the deadline comes a day closer.",
    "c47_factory_match": "Matched up, the 31 lines fit the 31 people without a single miss. Even the amounts agree with Nam Heewon’s ledger.",
    "c47_factory_send": "The photo arrives within 5 minutes. Yeon Seojun’s reply is one line. 'We will review it.' Moon Gaeul only learns in the evening that the photo went first.",
    "c47_memorial_wait": "You wait, and an hour later Moon Gaeul speaks. 'I’ll hand it in. My husband may be ashamed, but those people should get paid.'",
    "c47_memorial_cover": "The covered notebook becomes a document. Moon Gaeul says she will reread the covered parts alone at home.",
    "c47_memorial_son": "Hajun copies the acceptance text into the columbarium guestbook. Moon Gaeul tucks the notebook back into the deepest part of her bag.",
    "c47_final_hold": "You hold out, and Yeon Seojun asks for a recess. The 181 payments slip past the holiday, and more than a hundred messages saying 'It’s okay, we’ll wait' pour into the group chat. Not every message says that.",
    "c47_final_split": "Split in two, the 181 get their Chuseok and the 31 go to court. Nam Heewon hands her ledger to Seon Jaeyoon. 'Don’t let it get wet this time.'",
    "c47_final_settle": "The consolation payments arrive within the holiday. The 31 receive 3 million won along with 'Unconfirmable,' unchanged, and can never sue over this again.",
    "c47_after_warm": "11 people stay on the roof, and the shutter is only half down. No one has looked up the one-line agenda in the notice yet.",
    "c47_after_record": "Turned into a request, the stories of the 31 will remain even when the people in charge change. Moon Gaeul signs at the very end. 'This one goes all the way.'",
    "c47_after_rush": "As you go down from the roof first, Moon Gaeul tosses a bag of songpyeon from the top of the stairs. The file hasn’t arrived yet, but your name on the member list is already printed.",
    "c47_ledger_choice_1": "When you suggest splitting it, Kwon Dohyun opens his wallet first. This time he doesn’t ask for a receipt.",
    "c47_ledger_choice_2": "As the dates come together, a record forms that the 31 came to this shop every month. Told that rice cake bills can become evidence, Moon Gaeul looks less than pleased.",
    "c47_ledger_choice_3": "The shutter comes down, and today is over. Tomorrow, too, the last line in the ledger will still read '31.'",
    "c47_banner_choice_1": "When you take a side, one member sighs and raises a hand. 'In favor. But pay my wages out of next year’s profit.'",
    "c47_banner_choice_2": "The vote ends 3 to 2. When the result is read, the two on the losing side are the first to applaud.",
    "c47_banner_choice_3": "The wages come in, and the members’ Chuseok gets warmer. Foreman Kim quietly closes the notebook.",
    "c47_count_choice_1": "As you write the clues, 'Cafeteria, 12 years' and 'Work-clothes laundry, 8 years' fill the place of 'Unconfirmable.' For the first time, Do Yoonha presses his pen all the way down.",
    "c47_count_choice_2": "Once on the list, the notebook is read by the group’s legal team too. Even the back page with the date he collapsed gets copied.",
    "c47_count_choice_3": "The 181 payments are truly good news. The thirty-one names stay unlined for another day.",
    "c47_ledger_reaction_choice_1": "As you write, each of the 31 comes with a nickname. 'Two-Pieces-of-Mackerel Lady,' 'Red Motorbike.' It is past one in the morning.",
    "c47_ledger_reaction_choice_2": "At the idea of rewriting it, Moon Gaeul starts to shake her head, then stops. 'You mean my husband’s debt wasn’t only his fault? That’s the first time I’ve heard that.'",
    "c47_ledger_reaction_choice_3": "The shutter comes down, and the two of you stand in the alley. Tomorrow the moon will be a little rounder, and the deadline a day closer.",
    "c47_banner_reaction_choice_1": "You promise, and Foreman Kim presses the notebook into your hand. 'Please give it to the boss’s wife.' Two days are left until Chuseok.",
    "c47_banner_reaction_choice_2": "When you look for a way, Seon Jaeyoon brings up handwriting analysis. It would take ten days. The deadline is tomorrow.",
    "c47_banner_reaction_choice_3": "The party ends warmly. The notebook goes into Moon Gaeul’s bag, and the promise on the last page goes past its date once more.",
    "c47_count_reaction_choice_1": "When you say you’ll look together, Hajun writes 'A Way' on a fresh page of his sketchbook and underlines it twice. He puts more into it than into interview prep.",
    "c47_count_reaction_choice_2": "Hajun nods at the talk of rules, then asks. 'Who makes those rules?' The subway pulls into a station before you can answer.",
    "c47_count_reaction_choice_3": "Hajun closes his sketchbook. The 31 songpyeon spend the rest of the day inside the folded paper.",
    "c47_branch_screen_review": "Once the request goes in, the 31 cases land on a human desk for the first time. Whose desk, and who will sit at it over the holiday, no one knows.",
    "c47_branch_screen_rule": "The disclosure request goes on the record. The reply is due in 30 days, and the deadline is two days away.",
    "c47_branch_screen_skip": "The 181 payment schedule comes out neat. In the corner of the monitor, the 31 cases change to 'Closed.'",
    "c47_branch_screen_follow_consent": "Nam Heewon looks at the screen for a long time, then speaks. '12 years I cooked, and the bank knew it all along.' She writes her name on the consent form, letter by letter.",
    "c47_branch_screen_follow_all": "Branch Manager Seo Taekyung puts down the gift box and approves it under his own employee ID. Accounts turn up for 19 of the 31. 12 have no account at this bank.",
    "c47_branch_screen_follow_one": "Nam Heewon’s one case speeds up. The other 30 are moved to a column called 'Later.'",
    "c47_route_system_share": "The panel and the group chat see the same numbers. Yeon Seojun says, 'We will take it into account,' and the group chat underlines '0 false vouches.'",
    "c47_route_system_vouch": "As you start making the rounds of the market alley, 11 people line up for Nam Heewon alone. The names you took down are still on paper, and the sun sets before you can cover all 31.",
    "c47_route_system_skip": "Mediation goes ahead as scheduled. Before turning off its screen, ECHO leaves one line. 'Calculations stopped: 1 more.'",
    "c47_final_system_route_a": "With the clause in, neighbors, not papers, become the evidence. The group side objects that false vouching will rise, and ECHO brings up the number 0 again.",
    "c47_final_system_route_b": "The consolation payment doubles. Not one letter of 'Unconfirmable' changes.",
    "c47_final_system_route_c": "With the fund in place, there is room too for the people who come after the 31. Deciding who manages the fund takes three months.",
    "c47_evidence_turn_demand": "You hold out, and Yeon Seojun, the group’s lawyer, calls the foundation’s officer for the first time. The ad shoot schedule lands on the meeting-room table.",
    "c47_evidence_turn_hold": "The document is safe in your bag. The 31 meet the deadline without knowing it exists.",
    "c47_evidence_turn_share": "Once you tell them, the chat of the 181 boils over first. 'They’re shooting ads with what’s left after paying us?' Someone posts a joint petition to set aside the 31’s share first.",
    "c47_steam_evidence_turn": "Add it up to the last field, and they weren’t cut for lack of money. Where the leftover money goes is already written down.",
    "c47_factory_evidence_turn": "Add it up to the last field, and they weren’t cut for lack of money. Where the leftover money goes is already written down.",
    "c47_memorial_evidence_turn": "Add it up to the last field, and they weren’t cut for lack of money. Where the leftover money goes is already written down.",
    "c47_route_system_evidence_turn": "Add it up to the last field, and they weren’t cut for lack of money. Where the leftover money goes is already written down.",
    "case47_memory_system": "ECHO remembers. And beside that hand it brings out one calculation left over: how many times compensation criteria have included people without papers.",
    "case47_memory_evidence": "Line it all up, and in the last field of the fund there is money with no name too. A field called 'Unspent balance.'",
    "c47_start_warm_names": "Going over the names together, Moon Gaeul recalls the faces of 26 of the 31. The other five have never come in to buy rice cakes.",
    "c47_start_warm_criteria": "Reading the criteria shows that 'Unconfirmable' is defined in a single line. 'No electronic transaction history.' Overturning that one line takes the whole morning.",
    "c47_start_warm_first": "The 181 payments are locked in. The 31 become 'next in line' once again, and the deadline clock keeps running.",
    "c47_start_warm_signature": "You said to meet at six, but Kang Taemin is there at five. Raising the shutter, Moon Gaeul says it before anyone asks: 'No day wages.'",
    "c47_start_record_names": "Going over the names together, Moon Gaeul recalls the faces of 26 of the 31. The other five have never come in to buy rice cakes.",
    "c47_start_record_criteria": "Reading the criteria shows that 'Unconfirmable' is defined in a single line. 'No electronic transaction history.' Overturning that one line takes the whole morning.",
    "c47_start_record_first": "The 181 payments are locked in. The 31 become 'next in line' once again, and the deadline clock keeps running.",
    "c47_start_record_signature": "The letter reaches Yeon Seojun’s office. The answer is an auto-reply saying they will respond after the holiday, and the deadline is before the holiday. Ban Jaewook writes the reply time in his notebook.",
    "c47_start_rush_names": "Going over the names together, Moon Gaeul recalls the faces of 26 of the 31. The other five have never come in to buy rice cakes.",
    "c47_start_rush_criteria": "Reading the criteria shows that 'Unconfirmable' is defined in a single line. 'No electronic transaction history.' Overturning that one line takes the whole morning.",
    "c47_start_rush_first": "The 181 payments are locked in. The 31 become 'next in line' once again, and the deadline clock keeps running.",
    "c47_start_rush_signature": "When the drawer shuts, Oh Jinwoo opens the door first. 'If I go, they’ll call me the bank boy again. Let’s hear it together.' When you get to the shop, there is dust on your apron."
  },
  "choiceVoiceLines": {
    "c47_start_names": "To know who is behind 'Unconfirmable,' you go over the 31 names with Moon Gaeul before the shop opens.",
    "c47_start_criteria": "Saying you first have to know why the 31 were cut, you read the criteria behind 'Unconfirmable' line by line.",
    "c47_start_first": "Saying you can’t hold the holiday of people who have waited hostage, you lock in the 181 payments within the holiday and put the 31 off.",
    "c47_steam_dry": "Sure the names survive even on the seven blurred pages, you dry Nam Heewon’s wet ledger page by page by the steamers and read it together.",
    "c47_steam_appeal": "To contest the rulings on paper before the deadline, you write an objection for each of the 31 'Unconfirmable' rulings.",
    "c47_steam_orders": "Since the shop only holds up if all six steamers run, you finish the holiday orders first and leave the 31 for the evening.",
    "c47_factory_family": "Because it came from the drawer Moon Gaeul could not bring herself to open, you take the notebook to her first and let the family decide.",
    "c47_factory_match": "Since names and amounts that match make evidence, you check the notebook’s 31 lines against the list of 31, line by line.",
    "c47_factory_send": "Saying the other side only moves if they see it before the deadline, you photograph the notebook and send it to Yeon Seojun as leverage.",
    "c47_memorial_wait": "Saying no one can rush her into laying out her husband’s shame, you sit with Moon Gaeul on the columbarium bench until she decides.",
    "c47_memorial_cover": "Saying there’s no need to show even his apologies, you cover his private notes and submit only the 31 lines as evidence.",
    "c47_memorial_son": "Wanting to keep the good news on the 2nd anniversary whole, you congratulate Hajun first and leave the notebook for the evening.",
    "c47_final_hold": "To keep her plea not to finish without these people, you withhold consent until the notebook and neighbors’ vouching bring in the 31.",
    "c47_final_split": "Saying you will protect both the 181’s holiday and the 31’s path, you consent for the 181 today and file to prove the 31 in court separately.",
    "c47_final_settle": "Saying 3 million won beats empty hands at the holiday, you let the 31 take the consolation payment and close the 2nd-round criteria today.",
    "c47_after_warm": "Taking the unfinished thank-you in rice cakes, you stay on the roof making songpyeon with everyone until the full moon sets.",
    "c47_after_record": "So that this year becomes the next standard, you write the 31 stories and evidence into a request to revise the compensation criteria.",
    "c47_after_rush": "Already uneasy about 9 a.m. tomorrow, you grab a bag of songpyeon, go down first and start preparing for the committee.",
    "c47_ledger_choice_1": "Not wanting Moon Gaeul to carry that line alone, you suggest your colleagues split the cost of the 31’s rice cakes.",
    "c47_ledger_choice_2": "Since a box a month is itself a trace of dealings, you turn that line’s dates into a record of dealings between the 31 and the shop.",
    "c47_ledger_choice_3": "Saying this isn’t math for 10 at night, you leave the holiday books till after the break and pull down the shutter.",
    "c47_banner_choice_1": "Because it’s true they worked on the food from that kitchen, you side with Foreman Kim on setting the profit aside for the 31 first.",
    "c47_banner_choice_2": "So no one decides by reading the room, you have them decide by secret ballot, as the cooperative’s bylaws say.",
    "c47_banner_choice_3": "Saying the members unpaid for two months come first, you suggest the profit go to back pay and the 31 be left to compensation.",
    "c47_count_choice_1": "To show there are words to write besides 'Unconfirmable,' you write today’s clue beside each of the remaining thirty-one names.",
    "c47_count_choice_2": "So the names he counted alone for 3 years become a record, you formally enter Do Yoonha’s notebook in the plaintiffs’ evidence list.",
    "c47_count_choice_3": "Saying the 181 lines are his achievement too, you suggest closing the notebook today and celebrating the 181 payments first.",
    "c47_ledger_reaction_choice_1": "Wanting to know them as people, not the number 31, you have Moon Gaeul name the 31 one by one and write them down.",
    "c47_ledger_reaction_choice_2": "Saying it isn’t a debt for her to pay alone in rice cakes, you propose rewriting her husband’s debts as the group’s compensation liability.",
    "c47_ledger_reaction_choice_3": "Sensing it isn’t a night to press further, you pull the shutter down together and suggest talking tomorrow.",
    "c47_banner_reaction_choice_1": "Saying you will take up the words Moon Sungho couldn’t keep, you promise the cafeteria tab gets paid first, within this Chuseok.",
    "c47_banner_reaction_choice_2": "To get past the lack of papers with the notebook, you first look for a way to verify it as Moon Sungho’s handwritten record.",
    "c47_banner_reaction_choice_3": "Since nothing can be promised without papers, you put the promise off and suggest wrapping up the party tonight.",
    "c47_count_reaction_choice_1": "Saying there’s a way even if NOAH says no, you tell Hajun you’ll look for a way to accept those people together.",
    "c47_count_reaction_choice_2": "Not wanting to blur the answer for a kid who will be a banker, you explain there must be a rule that can count people without papers.",
    "c47_count_reaction_choice_3": "Not wanting grown-up worries on the day he shared his news, you suggest dropping the bank talk for today.",
    "c47_branch_screen_review": "Since the rulings fell in 0.3 seconds each, you write a request with Tak Yerin for people to review the 31 cases again.",
    "c47_branch_screen_rule": "Saying you need to know what it looked at in 0.3 seconds, you formally request that NOAH’s 'Unconfirmable' rule be disclosed.",
    "c47_branch_screen_skip": "Unable to hold up the payments by fighting a machine, you leave the rulings and check the 181 payment schedule first.",
    "c47_branch_screen_follow_consent": "Since no one can use another person’s account without their knowledge, you show Nam Heewon the records first and get her consent.",
    "c47_branch_screen_follow_all": "Not stopping at Nam Heewon, you get the branch manager’s approval to find deposit records for all 31.",
    "c47_branch_screen_follow_one": "Saying the rest will follow once one case breaks through, you get Nam Heewon’s case recognized first and find the rest later.",
    "c47_route_system_share": "Saying judge and plaintiffs alike should know the seven precedents, you post the figures to the mediation panel and the plaintiffs’ group chat.",
    "c47_route_system_vouch": "To carry the stopped calculation on foot, you set out to find two neighbors to vouch for each of the 31 today.",
    "c47_route_system_skip": "Unable to push back the deadline over 20 years of numbers, you set the figures aside and stick to the mediation schedule.",
    "c47_final_system_route_a": "Trusting the count of zero false vouches, you add a clause that recognizes harm on two neighbors’ vouching instead of papers.",
    "c47_final_system_route_b": "Since finding 62 people in two hours is hard, you leave the clause and only raise the 31’s consolation payment.",
    "c47_final_system_route_c": "Saying this won’t end with these thirty-one, you use the leftover compensation fund to set up a separate fund for victims without papers.",
    "c47_evidence_turn_demand": "Now that it’s clear they weren’t cut for lack of money, you withhold consent until the 31’s share comes out of the leftover 2.2 billion won.",
    "c47_evidence_turn_hold": "Since mediation hasn’t broken down yet, you keep the balance document and bring it out only if mediation falters.",
    "c47_evidence_turn_share": "Saying those who consent should decide knowing, you tell both the 181 and the 31 first where the leftover money goes.",
    "c47_steam_evidence_turn": "You add up the 2nd-round compensation fund’s disbursement sheet to the last field beside the clue, to see whether there really is no money for the 31.",
    "c47_factory_evidence_turn": "You add up the 2nd-round compensation fund’s disbursement sheet to the last field beside the clue, to see whether there really is no money for the 31.",
    "c47_memorial_evidence_turn": "You add up the 2nd-round compensation fund’s disbursement sheet to the last field beside the clue, to see whether there really is no money for the 31.",
    "c47_route_system_evidence_turn": "You add up the 2nd-round compensation fund’s disbursement sheet to the last field beside the clue, to see whether there really is no money for the 31.",
    "c47_start_warm_names": "To know who is behind 'Unconfirmable,' you go over the 31 names with Moon Gaeul before the shop opens.",
    "c47_start_warm_criteria": "Saying you first have to know why the 31 were cut, you read the criteria behind 'Unconfirmable' line by line.",
    "c47_start_warm_first": "Saying you can’t hold the holiday of people who have waited hostage, you lock in the 181 payments within the holiday and put the 31 off.",
    "c47_start_warm_signature": "Saying the 31 aren’t a load to carry alone, you gather with everyone from the chat outside the shop at dawn.",
    "c47_start_record_names": "To know who is behind 'Unconfirmable,' you go over the 31 names with Moon Gaeul before the shop opens.",
    "c47_start_record_criteria": "Saying you first have to know why the 31 were cut, you read the criteria behind 'Unconfirmable' line by line.",
    "c47_start_record_first": "Saying you can’t hold the holiday of people who have waited hostage, you lock in the 181 payments within the holiday and put the 31 off.",
    "c47_start_record_signature": "Saying this time you have to ask who left it empty, you demand in writing that the decided-by fields on the 31 rulings be filled.",
    "c47_start_rush_names": "To know who is behind 'Unconfirmable,' you go over the 31 names with Moon Gaeul before the shop opens.",
    "c47_start_rush_criteria": "Saying you first have to know why the 31 were cut, you read the criteria behind 'Unconfirmable' line by line.",
    "c47_start_rush_first": "Saying you can’t hold the holiday of people who have waited hostage, you lock in the 181 payments within the holiday and put the 31 off.",
    "c47_start_rush_signature": "Not wanting to stay the one who never replied, you put the rest of the files in a drawer and go to the shop with Oh Jinwoo."
  },
  "pack": {
    "clue": {
      "title": "The Leftover 2.2 Billion Won",
      "text": "Of the 14 billion won 2nd-round compensation fund, 11.8 billion won goes to the 181 and 2.2 billion won is left. That money was headed for 'Hangawi Sharing' ads, and the claims of the 31 came to 620 million won."
    },
    "outcomes": {
      "c47_after_warm": {
        "tag": "The Ending That Stayed Under the Moon",
        "title": "Under the Chuseok full moon, 11 people made songpyeon",
        "text": "You stayed on the Gaeul Rice Cake Shop roof and made songpyeon with everyone. Moon Gaeul never finished saying it; instead, she made your songpyeon the biggest."
      },
      "c47_after_record": {
        "tag": "The Ending That Rewrote the Criteria",
        "title": "The stories of the 31 became a revision request",
        "text": "You bundled the notebook, the wet ledger and all the evidence gathered so far. For the first time, 31 sentences went where 'Unconfirmable' had been."
      },
      "c47_after_rush": {
        "tag": "The Ending That Went Down First",
        "title": "A bag of songpyeon in your pocket, you left the shop first",
        "text": "You came down from the roof first under the full moon. The agenda was still the single line 'Working capital for a delivery platform,' and the file you wrote a dissent on 3 years ago began the same way."
      }
    },
    "continuityChallenges": {
      "c46_after_warm": {
        "title": "Carry the Server-Room Night to the Shop",
        "text": "The night you stayed beside ECHO, 11 replies came in saying they would come to the shop. If 11 stand together before the 31, trust grows that much heavier."
      },
      "c46_after_record": {
        "title": "Fill the Empty Decided-By Field",
        "text": "To the one who wrote 'How to Read the Dot Beside an Empty Field' come 31 rulings with the decided-by field left empty. With a card that resets the table, you put a person’s sentence into that empty field."
      },
      "c46_after_rush": {
        "title": "A Late Reply to an Unread Text",
        "text": "You went to the KD Capital office without reading Moon Gaeul’s text, and you are the only one who hasn’t replied in the group chat. Having come late, you reach fairness only by taking down the stories of the 31 in order."
      }
    }
  }
};
