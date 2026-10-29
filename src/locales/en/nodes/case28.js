/**
 * 사건 28 (src/nodes/case28.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c28_start": {
      "title": "Script No. 4",
      "text": "On the 7th floor of KD Life’s Guro call center, among the counseling desks where only the night shift’s seats are lit, Do Yoonha waves. He is on a ten-day secondment from Gangseo Branch to KD Life, an affiliate in the same group. On a single A4 sheet on the desk, 'denial' appears 14 times. 'Standard Script No. 4 for claim-denial notices.' The first line of tomorrow’s 10 a.m. call list is Chae Dohoon. He ran a lathe at Gaon Precision for 23 years and is a member of the To-the-End Precision cooperative. Last February a workplace injury took the feeling from two fingers of his right hand, and his permanent-disability claim of 42 million won was denied on one line of the policy terms. Do Yoonha turns the script over. 'They say it takes 3 minutes on average. How am I supposed to read those 3 minutes?'",
      "memo": [
        "Script No. 4: claim-denial notice · average call 3 minutes",
        "Chae Dohoon (58) -- To-the-End Precision cooperative member, lost feeling in right index and middle fingers",
        "Claim: 42 million won · grounds for denial: Article 19 of the policy terms",
        "Do Yoonha’s secondment, day 1 of 10 · 'denial' 14 times in the script"
      ],
      "choices": {
        "c28_start_appeal": {
          "label": "Leave the script to Do Yoonha and file the appeal papers fast"
        },
        "c28_start_clause": {
          "label": "Get Article 19, the grounds for denial, and the review records first"
        },
        "c28_start_visit": {
          "label": "Go hear Chae Dohoon out before the script is read"
        },
        "reframe": {
          "label": "Ask why denials end in 3 minutes"
        }
      },
      "place": "KD Life Guro Call Center · Counseling Desks",
      "clock": "May 11 · Monday · 21:10",
      "question": "Tomorrow morning a 3-minute denial script has to be read to Chae Dohoon. What do you do first?",
      "lead": "The night Do Yoonha finishes his first day at KD Life, he calls you up to the 7th floor, where only the night shift remains."
    },
    "c28_headset": {
      "title": "180 Calls a Day",
      "text": "At 9 in the morning, 240 counseling desks, each partition fitted with two monitors, light up at once. On the wall display, next to the number of customers waiting, is today’s team metric. 'Denial retention rate 93.1%.' It is the share of denials customers never manage to overturn, and the number goes into the team bonus. Part Leader Yeon Hajin, 12 years in, gives Do Yoonha some tips. 'When the swearing starts, hit mute and count to three in your head. Then: Yes, dear customer. If they cry, don’t count, just wait.' In the first hour, six calls with swearing and not one thank-you. At 10 sharp, Chae Dohoon’s name comes up on the monitor. Do Yoonha lowers the hand holding the script to his knee. On the other end of the headset, a low, slow voice speaks first. 'If it’s a no, just tell me quick. I’ve got to get into the factory.'",
      "memo": [
        "240 counseling desks · daily quota of 180 calls per person",
        "Team metric: denial retention rate 93.1% -- counts toward bonuses",
        "First hour: 6 calls with swearing, 0 thank-yous",
        "10:00 Chae Dohoon’s call connected"
      ],
      "choices": {
        "c28_headset_quota": {
          "label": "Let him fill the quota and call Chae Dohoon back after work"
        },
        "c28_headset_metric": {
          "label": "Demand in writing why 'denial retention rate' is in the bonus"
        },
        "c28_headset_listen": {
          "label": "Have him hear Chae Dohoon out instead of reading the script"
        },
        "reframe": {
          "label": "Ask why denials end in 3 minutes"
        },
        "c28_headset_evidence_turn": {
          "label": "Find who cut No. 4 to 3 minutes"
        }
      },
      "place": "KD Life Guro Call Center · Counseling Desks, 7th Floor",
      "clock": "May 12 · Tuesday · 10:00",
      "question": "On the other end of the headset, Chae Dohoon says to tell him quick if it’s a no. How do you handle this call?",
      "lead": "You sit at the empty desk beside Do Yoonha with a spare headset on. The numbers on the display catch your eye first."
    },
    "c28_ruler": {
      "title": "6.5 Points",
      "text": "One alley over from the demolition site, the old woman who ran the 1st-floor bookshop reopened the secondhand bookshop in Hoegi-dong this spring. Lim Kyungsoo chipped in for the deposit. Kwon Dohyun, on his way home from Bridge Bank, takes out a steel ruler and a magnifying glass. He lays the ruler against Article 19 on page 87 of Chae Dohoon’s policy terms. 'The body text is 9-point. Only this clause is 6.5-point. Reading all of it at this size takes 4 hours 12 minutes, and the reader runs at a loss.' While he’s at it, he measures the origin label on the rice-cake wrapper Moon Gaeul sent and notes, 'This one’s bigger.' Article 19 is the notification clause, the duty to tell the insurer when your circumstances change. If your job changes and you don’t report it, the claim may not be paid. KD Life treated Chae Dohoon’s move from foreman at Gaon Precision to member of To-the-End Precision as a change of occupation. Kwon Dohyun sets down the ruler. 'Same lathe, same hands. The only thing that changed is the name tag.'",
      "memo": [
        "Policy body 9pt / Article 19 6.5pt",
        "Estimated time to read the whole policy aloud: 4 hours 12 minutes",
        "KD Life’s view: foreman → cooperative member = change of occupation",
        "KD Life’s unofficial offer: half paid if he settles"
      ],
      "choices": {
        "c28_ruler_read": {
          "label": "Read the terms line by line with Chae Dohoon and write the objection in his words"
        },
        "c28_ruler_mediate": {
          "label": "File for dispute mediation over the type size and poor explanation"
        },
        "c28_ruler_half": {
          "label": "Have him accept KD Life’s offer to settle for half"
        },
        "reframe": {
          "label": "Ask why denials end in 3 minutes"
        },
        "c28_ruler_evidence_turn": {
          "label": "Find who cut No. 4 to 3 minutes"
        }
      },
      "place": "Secondhand Bookshop, Hoegi-dong, 1st Floor · Bookshelves",
      "clock": "May 13 · Wednesday · 20:00",
      "question": "A 6.5-point clause treats a new name tag as a new occupation. How do you fight it?",
      "lead": "On the long table on the bookshop’s 1st floor sit the policy booklet, a steel ruler, and a box of rice cakes from Moon Gaeul."
    },
    "c28_factory": {
      "title": "The Gray Van",
      "text": "At the To-the-End Precision factory, weekend member Kang Taemin stops his broom in the middle of sweeping lathe chips. Across the road, in front of a convenience store, the same gray van has been parked for three days. He pulls off his gloves, tucks them in his vest pocket, crosses over and knocks on the window. The person inside hands over a business card: a staffer from a loss adjuster’s office hired by KD Life. On the passenger seat is a camera with a telephoto lens, holding two days of footage of Chae Dohoon lifting tools with his left hand. The staffer smiles awkwardly. 'They said if you can work, that counts as grounds it isn’t a disability.' Inside the factory, Moon Hajun closes the sketchbook he was drawing in. Without a word, Chae Dohoon puts his right hand in the pocket of his work clothes.",
      "memo": [
        "Gray van, day 3 -- loss adjuster’s office",
        "Footage: two days of Chae Dohoon working with his left hand",
        "Purpose of the investigation: grounds that 'he can still work'",
        "Chae Dohoon’s daughter Chae Yoona, 4th-year nursing student -- 2nd-semester tuition due in August"
      ],
      "choices": {
        "c28_factory_guard": {
          "label": "Stop the filming and stand by Chae Dohoon with the members"
        },
        "c28_factory_settle": {
          "label": "Point to the tuition and urge Chae Dohoon to settle fast"
        },
        "c28_factory_order": {
          "label": "Request the footage and the investigation order as evidence"
        },
        "reframe": {
          "label": "Ask why denials end in 3 minutes"
        },
        "c28_factory_evidence_turn": {
          "label": "Find who cut No. 4 to 3 minutes"
        }
      },
      "place": "To-the-End Precision, Namdong Industrial Complex, Incheon · Factory",
      "clock": "May 16 · Saturday · 14:00",
      "question": "The insurer is secretly filming Chae Dohoon working with his left hand. What do you do?",
      "lead": "After coffee on the wooden platform, you step into the factory, where three lathes are turning evenly."
    },
    "c28_final": {
      "title": "One Exception",
      "text": "In the claims review meeting room at KD Life headquarters, Managing Director Seo Jaeyoon of the Claims Division slides over a single agreement. Chae Dohoon gets the full 42 million won. But it is called an 'exception payment,' and you and Do Yoonha must both sign a confirmation that, for Chae Dohoon’s case only, Article 19 and the loss adjuster’s filming will no longer be contested. In the past 3 years, 1,318 people have been denied under the same clause. Managing Director Seo checks a wristwatch. 'Sign today and the money goes in on Monday. We know when his daughter’s tuition is due, too.' Do Yoonha takes Script No. 4 out of his bag and lays it beside the agreement. His hands don’t shake. 'If you pay just this one man, then next week I’ll still be reading this to the other 1,317. In my own voice.'",
      "memo": [
        "Exception payment of 42 million won -- deposited Monday",
        "Condition: a confirmation not to contest Article 19 or the filming, for Chae Dohoon’s case only",
        "Denied under the same clause in 3 years: 1,318 people",
        "Chae Yoona’s 2nd-semester tuition due early August"
      ],
      "choices": {
        "c28_final_both": {
          "label": "Take the payment, drop the confirmation, and demand the list of 1,318"
        },
        "c28_final_clause": {
          "label": "Refuse even the exception payment until Article 19 is fixed"
        },
        "c28_final_sign": {
          "label": "Sign the confirmation for the tuition and take the exception payment"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Life Headquarters · Claims Review Meeting Room",
      "clock": "May 20 · Wednesday · 16:00",
      "question": "They will pay one man in full if you keep quiet about the other 1,317. What do you do?",
      "lead": "Do Yoonha comes in with his secondment ID badge still around his neck. Script No. 4 is folded in his bag."
    },
    "c28_aftershock": {
      "title": "Returning the Headset",
      "text": "At 6 p.m. on the last day of the secondment, Do Yoonha wipes his headset with a disinfectant wipe and drops it in the return box. On his partition one note remains, written in her own hand by call center Part Leader Yeon Hajin. 'Don’t hang up within 3 minutes.' Kang Taemin hands round the box of rice cakes he brought in Chae Dohoon’s place to the whole floor, and Kwon Dohyun, saying, '0.8 rice cakes per person. At this price, it’s a loss,' gives his share to a new counselor. Just then a call comes from Seo Harin. 'Haeon Partners’ advisory fees last turned up in Singapore. On the board of the company that got the money, there’s one name from the KD Capital side. You have a passport, right?'",
      "memo": [
        "Do Yoonha’s secondment ends -- headset returned",
        "Note on the partition: 'Don’t hang up within 3 minutes'",
        "Seo Harin: Haeon Partners’ advisory fees, Singapore",
        "Flights available next week: 2"
      ],
      "choices": {
        "c28_after_record": {
          "label": "Leave a revision request setting Article 19 beside Script No. 4"
        },
        "c28_after_warm": {
          "label": "Stay until the call center lights go out, sharing rice cakes with the counselors"
        },
        "c28_after_rush": {
          "label": "Book the Singapore trip the moment Seo Harin calls"
        }
      },
      "place": "KD Life Guro Call Center · Counseling Desks",
      "clock": "May 20 · Wednesday · 18:00",
      "question": "The evening you return the headset, a call comes from Singapore’s direction. How do you close out this evening?"
    },
    "c28_mute": {
      "title": "Special Handling Team",
      "text": "In the break room in the afternoon, Yeon Hajin gets two cups of vending-machine coffee and hands one to Do Yoonha. Then she opens Script No. 4 to its very last page. There is a branching chart in small print. If a customer says the words 'Financial Supervisory Service' or 'reporter,' the call is to be passed to the special handling team. Of the cases passed to that team, 64% end up getting paid. For the rest, it is 7%. Yeon Hajin crumples her empty paper cup. 'The ones who get really angry get paid. The ones who quietly go yes, yes don’t. For 12 years, I’ve been the one calling those quiet people.'",
      "memo": [
        "Last page of Script No. 4: special handling team branching chart",
        "Trigger words: 'Financial Supervisory Service', 'reporter'",
        "Payout rate: special handling team 64% / ordinary cases 7%"
      ],
      "choices": {
        "c28_mute_choice_2": {
          "label": "Get the chart in writing and check it against payment records"
        },
        "c28_mute_choice_1": {
          "label": "Tell every customer the same words that reach the special team"
        },
        "c28_mute_choice_3": {
          "label": "Quietly route only Chae Dohoon’s case through that chart"
        }
      },
      "place": "KD Life Guro Call Center · Break Room",
      "clock": "May 12 · Tuesday · 17:10",
      "question": "A branching chart sends only the loudly angry to the special handling team. What do you do?"
    },
    "c28_bundle": {
      "title": "Coffee 3 Years Ago",
      "text": "Before dawn on Thursday, Do Yoonha, digging through Gangseo Branch’s old sales records, calls. His voice is cracked. The window where Chae Dohoon took out the policy was KD Bank Gangseo Branch, Window 4, and the seller was Do Yoonha. On the day 3 years ago that Gaon Precision took out a loan for factory equipment, a KD Life accident insurance sign-up screen was slipped in among the loan forms on the tablet. On the branch’s performance sheet it was recorded as '1 loan-linked insurance policy.' 'I remember. I made him coffee. I said it was good insurance. I didn’t say anything about Article 19. Because I didn’t know either.' After a long silence, he asks, 'So I sold this one too.'",
      "memo": [
        "Sign-up window: Gangseo Branch, Window 4 · seller Do Yoonha",
        "Sign-up date = the day Gaon Precision’s equipment loan was disbursed",
        "Performance sheet entry: '1 loan-linked insurance policy'"
      ],
      "choices": {
        "c28_bundle_choice_2": {
          "label": "Submit the record of insurance bundled with a loan as mis-selling evidence"
        },
        "c28_bundle_choice_1": {
          "label": "Stand by Do Yoonha as he tells Chae Dohoon himself what happened"
        },
        "c28_bundle_choice_3": {
          "label": "Leave out the sales record so Do Yoonha’s name stays hidden"
        }
      },
      "place": "KD Bank Gangseo Branch · Window 4",
      "clock": "May 14 · Thursday · 05:40",
      "question": "The person who sold Chae Dohoon this policy was Do Yoonha. What do you do with this record?"
    },
    "c28_thanks": {
      "title": "The 179th Call",
      "text": "Monday, 5:30 p.m., day eight of the secondment. Do Yoonha’s 179th call is an incoming one. It is the 71-year-old customer he told last week how to apply for dispute mediation instead of reading the script. Her husband’s hospitalization payout came in yesterday, she says. 'Tell me your name, young man. So I can at least send you rice cakes.' While Do Yoonha laughs and declines, an alert pops up in the corner of the monitor. Call quality evaluation, Do Yoonha: grade C. Reason: '3 script deviations, 1 instance of steering toward payment.' Yeon Hajin looks at the screen and says quietly, 'Even a thank-you call costs points here. Three Cs and your secondment ends early.'",
      "memo": [
        "179th call: a thank-you call -- hospitalization payout made",
        "Do Yoonha’s call quality grade C: 3 script deviations",
        "3 C grades in total: secondment ends early"
      ],
      "choices": {
        "c28_thanks_choice_3": {
          "label": "Have him take calls by the script this week so the secondment holds"
        },
        "c28_thanks_choice_1": {
          "label": "Share the rights-first approach with the whole team, points or not"
        },
        "c28_thanks_choice_2": {
          "label": "Submit a proposal to revise the call evaluation criteria to Compliance"
        }
      },
      "place": "KD Life Guro Call Center · Counseling Desks",
      "clock": "May 18 · Monday · 17:30",
      "question": "One thank-you call cost Do Yoonha points. What do you do about this evaluation?"
    },
    "c28_mute_reaction": {
      "title": "The Quiet Ones",
      "text": "On the way home, Do Yoonha posts a photo of the branching chart in the group chat, and within an hour Lee Minseo at KD Data Lab replies. It is 3 years of KD Life denials, opened with her group data access. Of those whose cases ended without objection, 71% are 60 or older, and for half of them the call was over in under 3 minutes. 'The script is 3 minutes long. The people who were done within 3 minutes lost the most.' A moment later, one more line arrives. 'But these might be numbers I’m not supposed to see.'",
      "memo": [
        "Those who were done within 3 minutes lost the most",
        "Lee Minseo: numbers she might not be supposed to see"
      ],
      "choices": {
        "c28_mute_reaction_choice_2": {
          "label": "Confirm the route to these numbers is lawful before using them"
        },
        "c28_mute_reaction_choice_3": {
          "label": "Have Lee Minseo delete the numbers and focus on Chae Dohoon’s case"
        },
        "c28_mute_reaction_choice_1": {
          "label": "Have customers over 60 called back first"
        }
      },
      "place": "Subway Line 2 · On the Way Home",
      "clock": "May 12 · Tuesday · 19:05",
      "question": "Customers over 60 whose calls were done within 3 minutes lost the most. How do you handle these numbers?"
    },
    "c28_bundle_reaction": {
      "title": "No One Read the Small Print",
      "text": "Saturday morning, on the wooden platform in front of the To-the-End Precision factory. Stirring instant coffee with his left hand, Chae Dohoon recognizes Do Yoonha. 'Ah, the young man from that window. Made a good cup of coffee.' When Do Yoonha bows his head, Chae Dohoon waves it off. 'You explained it all. You said it was good, and you didn’t lie.' He opens his right hand to show them. The index and middle fingers stay slightly bent and won’t straighten. 'But nobody read me that small print. If somebody had, I’d have made one phone call when I quit being foreman. That one phone call’s worth 42 million won.'",
      "memo": [
        "Chae Dohoon: he heard the whole explanation, but not the small print",
        "Price of one phone call: 42 million won"
      ],
      "choices": {
        "c28_bundle_reaction_choice_2": {
          "label": "Record 'the print nobody read aloud' as a flaw in the sales process"
        },
        "c28_bundle_reaction_choice_3": {
          "label": "Put off the apology and collect the claim papers first"
        },
        "c28_bundle_reaction_choice_1": {
          "label": "Let Chae Dohoon receive Do Yoonha’s apology the way he wants"
        }
      },
      "place": "To-the-End Precision, Namdong Industrial Complex, Incheon · Wooden Platform Outside the Factory",
      "clock": "May 16 · Saturday · 10:30",
      "question": "Chae Dohoon says he heard the whole explanation, but nobody ever read him the small print. What do you say?"
    },
    "c28_thanks_reaction": {
      "title": "A Practiced Voice",
      "text": "After work, in the dark 1st-floor lobby, Yeon Hajin unwraps a candy instead of a cigarette. 'My father had KD Life insurance too. His lung cancer diagnosis benefit was denied, because of a cough he didn’t mention when he signed up. I took that call in my 2nd year at the company. The one who made the call was a junior I’d trained. It was Script No. 4.' She bites down and crunches the candy. 'I’m the one who reads that script best, in my own voice. That’s why I became part leader.'",
      "memo": [
        "Yeon Hajin’s father -- denied with Script No. 4",
        "The one who read it best became part leader"
      ],
      "choices": {
        "c28_thanks_reaction_choice_2": {
          "label": "Ask Yeon Hajin to put the experience in a written statement"
        },
        "c28_thanks_reaction_choice_3": {
          "label": "Leave Yeon Hajin be today and just take Chae Dohoon’s papers"
        },
        "c28_thanks_reaction_choice_1": {
          "label": "Reach out to Yeon Hajin to rewrite that script together"
        }
      },
      "place": "KD Life Guro Call Center · 1st-Floor Lobby",
      "clock": "May 18 · Monday · 19:40",
      "question": "The one who reads the script best lost her father to that very script. What do you ask of Yeon Hajin?"
    },
    "c28_branch_market": {
      "title": "17 Denial Letters",
      "text": "At lunchtime, after a call from Moon Gaeul, you go to Mangwon Market. On the stainless-steel table where the rice cakes are steamed, 17 envelopes lie in a row. They are denial letters the victims’ group members got from KD Life. Moon Gaeul pushes her glasses up and reads them aloud one by one. 'While we deeply empathize with your valued claim.' Next sheet. 'While we deeply empathize with your valued claim.' When the same sentence runs on through the 17th, two customers who came for rice cakes applaud. Moon Gaeul doesn’t smile. 'I got empathy 17 times and money not once.' Of the 17, 11 cite the same clause: Article 19.",
      "memo": [
        "17 denial letters -- victims’ group members",
        "Same first sentence 17 times: 'While we deeply empathize'",
        "11 of them cite Article 19",
        "Moon Gaeul: empathy 17 times, payment 0 times"
      ],
      "choices": {
        "c28_branch_market_a": {
          "label": "Meet the 17 one by one and write the appeals together"
        },
        "c28_branch_market_c": {
          "label": "Pick out the 11 Article 19 letters and attach them to Chae Dohoon’s case"
        },
        "c28_branch_market_b": {
          "label": "Sort the 17 letters by clause into a table"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market · Work Table",
      "clock": "May 12 · Tuesday · 12:40",
      "question": "17 denial letters that open with the same sentence lie on the rice-cake table. What do you do?"
    },
    "c28_branch_market_follow": {
      "title": "Same Lathe",
      "text": "Out of school, Moon Hajun comes into the shop in his uniform and studies Article 19 for a long time. Then he draws a four-panel comic in his sketchbook. Panel one: a man at a lathe. Panel two: the same man at the same lathe, only his name tag changed from 'Gaon Precision' to 'To-the-End Precision.' Panel three: an insurance company person says, 'I see your occupation has changed.' Panel four: the man points at the lathe. 'This is the same one.' The customers pass it around and burst out laughing, and Moon Gaeul laughs along for the first time. Moon Hajun puts down his pencil. 'Write it in grown-up writing and nobody reads it. Everybody read this.'",
      "memo": [
        "Moon Hajun’s four-panel comic 'Same Lathe'",
        "Gist of Article 19: if your job changes, you must report it",
        "Chae Dohoon’s lathe -- the same machine for 23 years",
        "9 shop customers passed it around"
      ],
      "choices": {
        "c28_branch_market_follow_a": {
          "label": "Circulate Moon Hajun’s comic in the victims’ group chat first"
        },
        "c28_branch_market_follow_b": {
          "label": "Formally propose the comic as a draft plain-language policy guide"
        },
        "c28_branch_market_follow_c": {
          "label": "Save the comic for later and see to the afternoon call schedule"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market",
      "clock": "May 12 · Tuesday · 15:40",
      "question": "A high schooler’s four-panel comic has made Article 19 readable by anyone. How do you use it?"
    },
    "c28_route_system": {
      "title": "The Design of 3 Minutes",
      "text": "Stepping back from Chae Dohoon’s claim, you measure why denial calls end in 3 minutes. Lee Minseo at KD Data Lab comes in with group data access. Summaries of KD Life’s call recordings from the past 3 years open up. In all, 410,000 claim-denial calls, average length 3 minutes 4 seconds. Calls in which the customer said 'please explain that again' had four times as many objections, and Script No. 4 has its paragraphs ordered so the call ends before those words come up. The policy terms haven’t changed by a single letter. The only change is one line in the script’s revision history: 'Shorten average call time.' 'The denial is written in the terms. Why the denial never gets overturned isn’t written in the terms. It’s written in the timetable.'",
      "memo": [
        "Claim-denial calls: 410,000 -- average 3 minutes 4 seconds",
        "Objections 4 times higher on calls with 'please explain that again'",
        "Reason for script revision: shorten average call time"
      ],
      "choices": {
        "c28_route_system_slow": {
          "label": "Have the 'explain again' paragraph moved to the top of Script No. 4"
        },
        "c28_route_system_drop": {
          "label": "Bury the statistics and use them only for Chae Dohoon’s call"
        },
        "c28_route_system_publish": {
          "label": "Hand the recording statistics to the FSS and the victims’ group at once"
        },
        "c28_route_system_evidence_turn": {
          "label": "Find who cut No. 4 to 3 minutes"
        }
      },
      "place": "KD Data Lab · Lee Minseo’s Terminal",
      "clock": "May 19 · Tuesday · 23:10",
      "question": "The call time was designed so denials would not be overturned. What do you do with these statistics?"
    },
    "c28_final_system_route": {
      "title": "Denial Written in the Timetable",
      "text": "Before dawn on Wednesday, Script No. 4 lies split into paragraphs on Lee Minseo’s terminal. Lee Minseo types in how many seconds on average each paragraph takes to read. 'Shall I explain that again?' is the very last paragraph, and before you get there, 3 minutes 4 seconds have gone by on average. At 4 this afternoon, Chae Dohoon’s exception payment agreement will be laid on the meeting room table. 'They didn’t need to change a single letter of the contract terms. They only had to change the order. The record of the reordering has one line of reason, and no people appear in that line.'",
      "memo": [
        "Script No. 4 -- the 'explain again' paragraph comes last",
        "Average call 3 minutes 4 seconds",
        "Exception payment meeting: today, 16:00"
      ],
      "choices": {
        "c28_final_system_route_c": {
          "label": "Set up a fund to re-review every denial that ended in 3 minutes"
        },
        "c28_final_system_route_a": {
          "label": "Write a 10-minute minimum and a right to re-explanation into denial calls"
        },
        "c28_final_system_route_b": {
          "label": "Leave the script as is and just simplify the appeal form"
        }
      },
      "place": "KD Data Lab · Lee Minseo’s Terminal",
      "clock": "May 20 · Wednesday · Before Dawn",
      "question": "Denials never got overturned because of the order of the paragraphs. How do you put that order back?"
    },
    "c28_evidence_turn": {
      "title": "The Loss Ratio Target Sheet",
      "text": "When you slot the clues in by revision number, the revision request for Script No. 4 opens. The requesting department is not KD Life. It is the 'Group Insurance Loss Ratio Improvement Task Force,' set up under the KD Capital CEO’s office, the loss ratio being the share of premiums that goes out as claims. This year’s target: cut claim payouts by 18 billion won. At the bottom of the attached sheet is where the saved money goes. 'Covering construction losses on the Pyeongtaek officetel.' Ban Jaewook, up from a regional audit trip, sets down his bag and writes the two figures side by side in his notebook. 'They’re plugging the hole in a building whose construction stopped with injured people’s claims. Whoever shortened the script has probably never once set foot in the call center.'",
      "memo": [
        "Script No. 4 revision request: a TF under the KD Capital CEO’s office",
        "Target: cut claim payouts by 18 billion won",
        "Use of the savings: Pyeongtaek officetel construction losses"
      ],
      "choices": {
        "c28_evidence_turn_hold": {
          "label": "Hold on to the request and bring it out with the Pyeongtaek case"
        },
        "c28_evidence_turn_expose": {
          "label": "File the TF request and the Pyeongtaek figures in one FSS complaint"
        },
        "c28_evidence_turn_share": {
          "label": "Show the savings target sheet to the call center counselors first"
        }
      },
      "place": "KD Capital · Document Management System",
      "clock": "May 20 · Wednesday · 07:30",
      "question": "They meant to cover a stalled construction site’s losses by saving on injured people’s claims. How do you use this record?"
    },
    "c28_start_warm": {
      "title": "The Monday Back from Gunsan",
      "text": "You spent the weekend in Gunsan welcoming people as they came back, then took Sunday’s last train up with a box of dried bakdae fish that Boss Kwak brought. The next night, Do Yoonha calls you to KD Life’s call center in Guro. He is at KD Life, an affiliate, on a ten-day secondment. What he got on day one was 'Claim-Denial Notice Script No. 4.' Tomorrow’s first call is To-the-End Precision cooperative member Chae Dohoon. A lathe accident took the feeling from his right hand. His permanent-disability claim of 42 million won was denied. The grounds: one line of the policy terms. 'It reminds me of the grandmother in Gunsan who cried as she cashed in her savings. They say his call will be over in 3 minutes too.'",
      "memo": [
        "In Gunsan through the weekend -- back to Seoul on Sunday’s last train",
        "Script No. 4: claim-denial notice · average 3 minutes",
        "Chae Dohoon’s permanent-disability claim of 42 million won denied"
      ],
      "choices": {
        "c28_start_warm_visit": {
          "label": "Go hear Chae Dohoon out before the script is read"
        },
        "c28_start_warm_signature": {
          "label": "Learn Chae Dohoon’s name first, as in Gunsan, and go to the factory"
        },
        "c28_start_warm_appeal": {
          "label": "Leave the script to Do Yoonha and file the appeal papers fast"
        },
        "c28_start_warm_clause": {
          "label": "Get Article 19, the grounds for denial, and the review records first"
        },
        "c28_start_warm_reframe": {
          "label": "Ask why denials end in 3 minutes"
        }
      },
      "place": "KD Life Guro Call Center · Counseling Desks",
      "clock": "May 11 · Monday · 21:10",
      "question": "After Gunsan’s number tickets comes Guro’s denial script. Whose side do you stand by first this time?",
      "lead": "It is the day after you took Sunday’s last train up, and a Saebom Credit Union number ticket is still in your bag."
    },
    "c28_start_record": {
      "title": "The Script the Day After the Report",
      "text": "The seven-page rumor damage report, bundling the chat room logs and the restructuring plan, received a filing number. Its last page carried an empty approver field. The night that number came through, Do Yoonha shows you a different document: a script used at KD Life, an affiliate. Its title is 'Claim-Denial Notice Script No. 4.' He is on a ten-day secondment at KD Life’s call center, and tomorrow his first call is with Chae Dohoon. A permanent-disability claim of 42 million won was denied. The grounds: Article 19 of the policy terms. Do Yoonha pulls up the script file’s properties. 'The last page of the report had an empty approver field, right? This script has an empty author field. One more blank.'",
      "memo": [
        "Rumor damage report, 7 pages -- filing number received",
        "Script No. 4 file properties: author field blank",
        "Grounds for denying Chae Dohoon: Article 19 of the policy terms"
      ],
      "choices": {
        "c28_start_record_appeal": {
          "label": "Leave the script to Do Yoonha and file the appeal papers fast"
        },
        "c28_start_record_signature": {
          "label": "Formally ask KD Life which department wrote Script No. 4"
        },
        "c28_start_record_visit": {
          "label": "Go hear Chae Dohoon out before the script is read"
        },
        "c28_start_record_clause": {
          "label": "Get Article 19, the grounds for denial, and the review records first"
        },
        "c28_start_record_reframe": {
          "label": "Ask why denials end in 3 minutes"
        }
      },
      "place": "KD Life Guro Call Center · Counseling Desks",
      "clock": "May 11 · Monday · 21:10",
      "question": "After the report’s approver field, the script’s author field is empty too. How do you fill that blank?",
      "lead": "The night the rumor damage report got its filing number, a text from Do Yoonha brings you to Guro."
    },
    "c28_start_rush": {
      "title": "The Script After the Erased Room",
      "text": "When you rushed up with the screenshots, the Real Estate Finance Team on KD Capital’s 12th floor was dark, and the chat room had already vanished from the company messenger. Three days later, on Monday night, Do Yoonha calls you to KD Life’s call center. He is at KD Life, an affiliate, on a ten-day secondment. On the desk is 'Claim-Denial Notice Script No. 4.' Tomorrow’s first line is To-the-End Precision cooperative member Chae Dohoon. He was denied a permanent-disability claim of 42 million won. The grounds: one line of the policy terms. At the bottom of the script is a revision number. 'Revision 7.' The name in the approver’s e-signature beside it matches a Real Estate Finance Team name you saw in the chat room’s member list before it was erased.",
      "memo": [
        "One of the erased chat room’s members",
        "Script No. 4, Revision 7 approval signature: the same name",
        "Chae Dohoon’s permanent-disability claim of 42 million won denied"
      ],
      "choices": {
        "c28_start_rush_appeal": {
          "label": "Leave the script to Do Yoonha and file the appeal papers fast"
        },
        "c28_start_rush_signature": {
          "label": "Check the erased chat room name against the approval signature with Do Yoonha"
        },
        "c28_start_rush_clause": {
          "label": "Get Article 19, the grounds for denial, and the review records first"
        },
        "c28_start_rush_visit": {
          "label": "Go hear Chae Dohoon out before the script is read"
        },
        "c28_start_rush_reframe": {
          "label": "Ask why denials end in 3 minutes"
        }
      },
      "place": "KD Life Guro Call Center · Counseling Desks",
      "clock": "May 11 · Monday · 21:10",
      "question": "The erased chat room and the denial script bear the same name. How do you use this link?",
      "lead": "Three days after a wasted trip to the dark 12th floor, Do Yoonha calls you to Guro."
    }
  },
  "echoReplies": {
    "c28_start_visit": "When you go, Chae Dohoon, working the night shift, says just one thing through the gap in the factory door: 'Let’s do it by phone tomorrow.' That night Do Yoonha reads the script alone.",
    "c28_start_clause": "When you get the records, you learn Article 19 is on page 87. Just finding that page takes an hour.",
    "c28_start_appeal": "The appeal is filed today. Tomorrow morning Do Yoonha still has to read Script No. 4 word for word.",
    "c28_headset_listen": "When he hears him out, the call runs 41 minutes. Meanwhile 30 customers pile up in Do Yoonha’s queue.",
    "c28_headset_metric": "When you demand the grounds, a part leaders’ meeting is called. From that day, Do Yoonha’s seat is 'under management.'",
    "c28_headset_quota": "The quota gets filled. Chae Dohoon doesn’t answer the call back after work. He is on the night shift.",
    "c28_ruler_read": "Reading line by line, Chae Dohoon stops a long time at Article 19. The first sentence of the objection he writes is 'I was standing at the same lathe.'",
    "c28_ruler_mediate": "The application is filed. The mediation result will take three months, and the days Chae Dohoon can hold out are fewer than that.",
    "c28_ruler_half": "Half is 21 million won. Chae Dohoon nods, and Article 19 stays just as it is for the next person.",
    "c28_factory_guard": "The filming stops. The loss adjuster’s office writes the words 'obstruction of investigation' in its report.",
    "c28_factory_order": "When you get the order, out comes the date the filming was commissioned. It is the very day after the appeal went in.",
    "c28_factory_settle": "When you persuade him, Chae Dohoon laughs. 'My daughter’s school comes first.' Moon Hajun doesn’t open the sketchbook again.",
    "c28_final_both": "When you demand the list, Managing Director Seo halts the meeting for 30 minutes. Back again, Managing Director Seo offers to pay without the confirmation. The list is 'under review.'",
    "c28_final_clause": "When you hold out, the agreement goes back into the bag. No deposit on Monday, and no date yet for a meeting on Article 19.",
    "c28_final_sign": "When you sign, 42 million won comes in on Monday. Next week Script No. 4 is still read to the other 1,317.",
    "c28_after_warm": "As the lights go out, Do Yoonha rubs the marks his headset left and smiles. 'Today I got one more thank-you than curses.' Singapore waits until next week.",
    "c28_after_record": "Attached to the request is the list of 1,318 people caught by the same clause. Yeon Hajin copied it line by line from the call lists she kept for 12 years. On the first line, she writes in her own father’s name.",
    "c28_after_rush": "When you book it, Do Yoonha slips a pack of rice cakes into your bag. 'Eat them in Singapore. Rice cakes there will be expensive.'",
    "c28_mute_choice_1": "When you tell them, from the afternoon on, 'Financial Supervisory Service' comes up on every call. The special handling team’s wait grows to four hours.",
    "c28_mute_choice_2": "When you check, 64% and 7% stand side by side in the same table. Who made the branching chart is still a blank.",
    "c28_mute_choice_3": "Chae Dohoon’s case goes to the special handling team. The other 179 who quietly said only 'yes' that day stay where they were.",
    "c28_bundle_choice_1": "With you beside him, Do Yoonha can say it with his own mouth. How Chae Dohoon takes those words is up to Chae Dohoon.",
    "c28_bundle_choice_2": "Filed as evidence, the fight gets sturdier. The name Do Yoonha in the seller field goes into the same document.",
    "c28_bundle_choice_3": "With the record left out, Do Yoonha is protected. The practice of slipping insurance in with loans stays in no document at all.",
    "c28_thanks_choice_1": "When you share it, 5 of the 12 on Yeon Hajin’s team follow along. That week the whole team gets a C.",
    "c28_thanks_choice_2": "The proposal is filed. Compliance has 30 days to answer, and Do Yoonha’s secondment has two days left.",
    "c28_thanks_choice_3": "Taking calls by the script, Do Yoonha lasts to the end. In the two days left, he reads the script 360 times.",
    "c28_mute_reaction_choice_1": "When the calls go out again, on the first day alone 40 people say 'I didn’t know there was such a procedure.' Those 40 calls count toward no one’s quota.",
    "c28_mute_reaction_choice_2": "When you check the route, Lee Minseo is protected. For the 2 weeks the check takes, that 71% remains only a number.",
    "c28_mute_reaction_choice_3": "When they’re deleted, Lee Minseo is relieved. The fact that the people done within 3 minutes lost the most is deleted along with them.",
    "c28_bundle_reaction_choice_1": "What Chae Dohoon wants is simple. 'Just make me one more cup of coffee.' Do Yoonha puts in two packets of instant mix.",
    "c28_bundle_reaction_choice_2": "Once recorded, one person’s apology becomes a flaw in procedure. A flaw can be fixed. An apology can’t.",
    "c28_bundle_reaction_choice_3": "The papers come together fast. On the drive back, Do Yoonha doesn’t say a word.",
    "c28_thanks_reaction_choice_1": "When you reach out, Yeon Hajin gives you another candy. The first sentence of Script No. 4 is the first thing she deletes.",
    "c28_thanks_reaction_choice_2": "The statement records 12 years. The hand that signs it pauses longer than her hand ever did gripping a headset.",
    "c28_thanks_reaction_choice_3": "The papers get collected. Yeon Hajin sits alone in the lobby until the lights go out.",
    "c28_branch_market_a": "Meeting them one by one brings out 17 different stories. Writing them down takes two days, and Moon Gaeul steams rice cakes three times for you.",
    "c28_branch_market_b": "As a table, the 11 Article 19 cells are clear at a glance. The table keeps neither the steam off the rice-cake table nor the applause.",
    "c28_branch_market_c": "With the 11 letters attached, Chae Dohoon’s case grows heavier. The other six go back into their envelopes.",
    "c28_branch_market_follow_a": "In an hour the comic spreads to three hundred people. Moon Hajun adds, 'Copyright: To-the-End Precision.'",
    "c28_branch_market_follow_b": "The proposal is filed. KD Life answers that it 'will review it,' and asks that only the comic’s fourth panel be taken out.",
    "c28_branch_market_follow_c": "The call schedule is kept. The sketchbook waits a day on the rice-cake shop’s shelf.",
    "c28_route_system_slow": "When one paragraph moves, the average call stretches to 7 minutes. Each counselor’s daily quota is cut in half.",
    "c28_route_system_publish": "Once the statistics are handed over, the FSS demands the original recordings. Sorting through 410,000 takes three months.",
    "c28_route_system_drop": "Chae Dohoon’s call gets longer. The other 410,000 are still 3 minutes 4 seconds.",
    "c28_final_system_route_a": "Once 10 minutes is the rule, the call center has to hire more counselors. Costs go up, and denials go down.",
    "c28_final_system_route_b": "The form gets easier. If the script never mentions the easy form, nobody knows it exists.",
    "c28_final_system_route_c": "With the fund in place, there are 120,000 denials to re-review. Who will fill the fund is a blank.",
    "c28_evidence_turn_expose": "When the complaint goes in, the name of the task force appears in an official letter for the first time. Below it, so do the words CEO’s office.",
    "c28_evidence_turn_hold": "Held back, it becomes a strong card for the next hand. Meanwhile Script No. 4 is read every day, 3 minutes at a time.",
    "c28_evidence_turn_share": "When the counselors see the sheet, the 7th floor goes quiet. Part Leader Yeon Hajin, 12 years in, takes off her headset and sets it on the desk.",
    "c28_headset_evidence_turn": "Trace the revision history back, and the person who shortened the script is outside the call center. Where the money that person saved went is written at the bottom of the sheet.",
    "c28_ruler_evidence_turn": "Trace the revision history back, and the person who shortened the script is outside the call center. Where the money that person saved went is written at the bottom of the sheet.",
    "c28_factory_evidence_turn": "Trace the revision history back, and the person who shortened the script is outside the call center. Where the money that person saved went is written at the bottom of the sheet.",
    "c28_route_system_evidence_turn": "Trace the revision history back, and the person who shortened the script is outside the call center. Where the money that person saved went is written at the bottom of the sheet.",
    "case28_memory_system": "Nothing has carried over into the script. The word that appears 14 times is 'denial,' every time. Lee Minseo measures the length of the calls that ended with that script.",
    "case28_memory_evidence": "Hold the restructuring plan’s empty approver field against the script’s revision request, and the requesting department appears. It is neither the call center nor KD Life.",
    "c28_start_warm_visit": "When you go, Chae Dohoon, working the night shift, says just one thing through the gap in the factory door: 'Let’s do it by phone tomorrow.' That night Do Yoonha reads the script alone.",
    "c28_start_warm_clause": "When you get the records, you learn Article 19 is on page 87. Just finding that page takes an hour.",
    "c28_start_warm_appeal": "The appeal is filed today. Tomorrow morning Do Yoonha still has to read Script No. 4 word for word.",
    "c28_start_warm_signature": "Because you learned his name, Chae Dohoon recognizes you first. 'A bank person who gets my name right.' The factory door opens a little wider.",
    "c28_start_record_visit": "When you go, Chae Dohoon, working the night shift, says just one thing through the gap in the factory door: 'Let’s do it by phone tomorrow.' That night Do Yoonha reads the script alone.",
    "c28_start_record_clause": "When you get the records, you learn Article 19 is on page 87. Just finding that page takes an hour.",
    "c28_start_record_appeal": "The appeal is filed today. Tomorrow morning Do Yoonha still has to read Script No. 4 word for word.",
    "c28_start_record_signature": "The inquiry is filed. The deadline for a reply is 14 days, and Chae Dohoon’s call is tomorrow at 10 a.m.",
    "c28_start_rush_visit": "When you go, Chae Dohoon, working the night shift, says just one thing through the gap in the factory door: 'Let’s do it by phone tomorrow.' That night Do Yoonha reads the script alone.",
    "c28_start_rush_clause": "When you get the records, you learn Article 19 is on page 87. Just finding that page takes an hour.",
    "c28_start_rush_appeal": "The appeal is filed today. Tomorrow morning Do Yoonha still has to read Script No. 4 word for word.",
    "c28_start_rush_signature": "When you compare them, the rumor in Gunsan and the script in Guro connect through one name. Who sits above that name, you don’t know yet."
  },
  "choiceVoiceLines": {
    "c28_start_visit": "Saying you can’t not know whom the denial is being read to, you go hear Chae Dohoon out before the script is read.",
    "c28_start_clause": "Saying you need to know why one line denied 42 million won, you get Article 19, the grounds for denial, and the review records first.",
    "c28_start_appeal": "Saying a way to get the money back is more urgent than reading the denial, you leave the script to Do Yoonha and file the appeal papers fast.",
    "c28_headset_listen": "Saying that if the denial is read first, his story will never be heard, you have him put down the script and hear Chae Dohoon out.",
    "c28_headset_metric": "Saying you need to know how denials became a performance metric, you demand in writing the grounds for putting the 'denial retention rate' into bonuses.",
    "c28_headset_quota": "Because you can’t hold back a man who has to get into the factory, you let him fill today’s quota and call Chae Dohoon back after work.",
    "c28_ruler_read": "Saying this time you will read the small print together to the end, you read the terms line by line with Chae Dohoon and write the objection in his words.",
    "c28_ruler_mediate": "Saying 6.5 points is a fact you can measure with a ruler, you file for dispute mediation over the type size and the poor explanation.",
    "c28_ruler_half": "Saying the injured hand stays the same while the fight goes on, you have him accept the half-payment settlement KD Life quietly held out.",
    "c28_factory_guard": "Saying you won’t leave the hand in that pocket alone, you get the filming stopped and stand by Chae Dohoon with the members.",
    "c28_factory_order": "Saying there has to be a record of who ordered the filming, you formally request the footage and the investigation order as evidence.",
    "c28_factory_settle": "Because a fight with a side that goes as far as filming looks like a long one, you think of the tuition date and persuade Chae Dohoon toward a quick settlement.",
    "c28_final_both": "Saying you won’t let go of the tuition or the other 1,317, you take Chae Dohoon’s payment, drop the confirmation, and demand the list of 1,318.",
    "c28_final_clause": "Saying one exception leaves next week’s script just the same, you hold out, refusing even the exception payment unless Article 19 is fixed.",
    "c28_final_sign": "Saying the Monday deposit can’t be missed, you sign the confirmation for the tuition and take the exception payment.",
    "c28_after_warm": "Because you want to see the end of the place where you held out together for ten days, you stay until the call center lights go out, sharing rice cakes with the counselors.",
    "c28_after_record": "Saying that if it ends with rice cakes and applause the script stays the same, you first put on paper a revision request setting Article 19 beside Script No. 4.",
    "c28_after_rush": "Before the money vanishes again, you book the Singapore trip the moment Seo Harin calls.",
    "c28_mute_choice_1": "Saying it can’t be only the quiet ones who don’t get paid, you tell every customer the same words that reach the special handling team.",
    "c28_mute_choice_2": "Saying you have to check whether 64% and 7% are the right numbers, you get the chart in writing and check it against payment records.",
    "c28_mute_choice_3": "Saying at least one person should get paid first, you quietly route only Chae Dohoon’s case through that chart.",
    "c28_bundle_choice_1": "Because it is too heavy a thing to bring up alone, you stand by Do Yoonha as he tells Chae Dohoon himself what happened.",
    "c28_bundle_choice_2": "Saying it isn’t one person’s fault but a problem with how things are sold, you submit the record of insurance bundled with a loan as mis-selling evidence.",
    "c28_bundle_choice_3": "So that the name of Do Yoonha, who sold it without knowing, doesn’t come out too, you leave the sales record out.",
    "c28_thanks_choice_1": "Saying that alone, only he loses points, you share the rights-first approach with the whole team even if it costs points.",
    "c28_thanks_choice_2": "Saying the problem is a standard that docks points for a thank-you call, you submit a proposal to change the call evaluation criteria to KD Life’s Compliance.",
    "c28_thanks_choice_3": "So that three C grades don’t end the secondment early, you have him take calls by the script this week.",
    "c28_mute_reaction_choice_1": "Because 71% of those whose cases ended without objection are 60 or older, you have customers over 60 called back first.",
    "c28_mute_reaction_choice_2": "Saying that if these were numbers she shouldn’t have seen, Lee Minseo will get hurt, you confirm the route to them is lawful before using them.",
    "c28_mute_reaction_choice_3": "Saying you can’t use numbers that would hurt Lee Minseo, you have her delete them and focus on Chae Dohoon’s case.",
    "c28_bundle_reaction_choice_1": "Saying an apology is for the one receiving it to decide, you let Chae Dohoon receive Do Yoonha’s apology the way he wants.",
    "c28_bundle_reaction_choice_2": "Saying that if it ends with a sorry, the next window will be the same, you record 'the print nobody read aloud' as a flaw in the sales process.",
    "c28_bundle_reaction_choice_3": "Saying the 42 million won has to come back first, you put off the apology and collect the claim papers first.",
    "c28_thanks_reaction_choice_1": "Saying the one who reads it best can fix it best, you reach out to Yeon Hajin to rewrite that script together.",
    "c28_thanks_reaction_choice_2": "Saying these are the words of someone who went through that call from both sides, you ask Yeon Hajin to put the experience in a written statement.",
    "c28_thanks_reaction_choice_3": "Because asking more would only reopen the wound, you leave Yeon Hajin be today and just take Chae Dohoon’s papers.",
    "c28_branch_market_a": "Saying it’s people who need to go, not empathy, you meet the 17 one by one and write the appeals together.",
    "c28_branch_market_b": "So it shows which clause the same sentence clusters on, you sort the 17 letters by clause into a table.",
    "c28_branch_market_c": "Saying the same clause 11 times is strength, you pick out the 11 Article 19 letters and attach them to Chae Dohoon’s case.",
    "c28_branch_market_follow_a": "Saying the people it’s about should read it first, you circulate Moon Hajun’s comic in the victims’ group chat first.",
    "c28_branch_market_follow_b": "Saying the policy terms should be writing everybody reads, you formally propose the comic to KD Life as a draft plain-language policy guide.",
    "c28_branch_market_follow_c": "Because there isn’t long to spend laughing, you save the comic for later and see to the afternoon call schedule.",
    "c28_route_system_slow": "Saying calls where those words came up had four times the objections, you demand the 'explain again' paragraph of Script No. 4 be moved to the top.",
    "c28_route_system_publish": "Saying that if only insiders know, it gets buried again, you hand the recording summary statistics to the FSS and the victims’ group at once.",
    "c28_route_system_drop": "Saying you can’t take on 410,000 calls at once, you bury the statistics and use them only for Chae Dohoon’s call.",
    "c28_final_system_route_a": "Saying the time taken by ordering has to be given back, you write a 10-minute minimum and a right to re-explanation into the rules for denial calls.",
    "c28_final_system_route_b": "So the 4 p.m. agreement doesn’t waver, you leave the script as is and just simplify the appeal form.",
    "c28_final_system_route_c": "Saying there are people the timetable has already pushed aside, you set up a separate fund to re-review every denial that ended within 3 minutes.",
    "c28_evidence_turn_expose": "Saying plugging a construction hole with claim money has to be seen from outside, you attach the TF request and the Pyeongtaek figures together to an FSS complaint.",
    "c28_evidence_turn_hold": "Because one sheet isn’t enough to reach the CEO’s office, you hold on to the request and bring it out together with the Pyeongtaek case.",
    "c28_evidence_turn_share": "Saying they are the ones who have read that script in their own voices, you show the savings target sheet to the call center counselors first.",
    "c28_headset_evidence_turn": "Slotting the clues into Script No. 4’s revision history by date, you pin down where the 3-minute call was ordered.",
    "c28_ruler_evidence_turn": "Slotting the clues into Script No. 4’s revision history by date, you pin down where the 3-minute call was ordered.",
    "c28_factory_evidence_turn": "Slotting the clues into Script No. 4’s revision history by date, you pin down where the 3-minute call was ordered.",
    "c28_route_system_evidence_turn": "Slotting the clues into Script No. 4’s revision history by date, you pin down where the 3-minute call was ordered.",
    "c28_start_warm_visit": "Saying you can’t not know whom the denial is being read to, you go hear Chae Dohoon out before the script is read.",
    "c28_start_warm_clause": "Saying you need to know why one line denied 42 million won, you get Article 19, the grounds for denial, and the review records first.",
    "c28_start_warm_appeal": "Saying a way to get the money back is more urgent than reading the denial, you leave the script to Do Yoonha and file the appeal papers fast.",
    "c28_start_warm_signature": "To meet him as a person and not a line on a call list, you learn Chae Dohoon’s name first, as in Gunsan, and go to the factory.",
    "c28_start_record_visit": "Saying you can’t not know whom the denial is being read to, you go hear Chae Dohoon out before the script is read.",
    "c28_start_record_clause": "Saying you need to know why one line denied 42 million won, you get Article 19, the grounds for denial, and the review records first.",
    "c28_start_record_appeal": "Saying a way to get the money back is more urgent than reading the denial, you leave the script to Do Yoonha and file the appeal papers fast.",
    "c28_start_record_signature": "Saying you won’t let an empty author field slide by again, you formally ask KD Life which department wrote Script No. 4.",
    "c28_start_rush_visit": "Saying you can’t not know whom the denial is being read to, you go hear Chae Dohoon out before the script is read.",
    "c28_start_rush_clause": "Saying you need to know why one line denied 42 million won, you get Article 19, the grounds for denial, and the review records first.",
    "c28_start_rush_appeal": "Saying a way to get the money back is more urgent than reading the denial, you leave the script to Do Yoonha and file the appeal papers fast.",
    "c28_start_rush_signature": "Because you saw the name alone and may have seen it wrong, you first check with Do Yoonha that the name in the erased chat room matches the script’s approval signature."
  },
  "pack": {
    "clue": {
      "title": "The Order Behind the 3-Minute Script",
      "text": "The one that asked for Script No. 4 to be cut to 3 minutes was the loss ratio improvement task force under the KD Capital CEO’s office. The 18 billion won saved in claims was meant for losses at the Pyeongtaek construction site."
    },
    "outcomes": {
      "c28_after_warm": {
        "tag": "Stayed Beside Them",
        "title": "You shared rice cakes with the counselors on the darkened 7th floor",
        "text": "On the last day of the secondment, you and Do Yoonha stayed until the call center lights went out. For the first time, all 12 on Yeon Hajin’s team took off their headsets at the same moment."
      },
      "c28_after_record": {
        "tag": "Left It on Paper",
        "title": "A revision request setting the clause beside the script was filed",
        "text": "Article 19 and the sentences of Script No. 4 stood side by side in one document, with the list of 1,318 people caught by the same clause attached. Yeon Hajin copied the list from 12 years of call lists, and on its first line is her father’s name, written in by her."
      },
      "c28_after_rush": {
        "tag": "Left First",
        "title": "You booked the Singapore trip the day the headset was returned",
        "text": "You put a pack of rice cakes in your bag and set off after the last trail of the advisory fees. Next week, Guro’s 7th floor still starts with the 3-minute script."
      }
    },
    "continuityChallenges": {
      "c27_after_warm": {
        "title": "Protect the People After the Number Tickets",
        "text": "You stayed one more day in Gunsan to welcome people back. Trust holds when you protect Chae Dohoon and Do Yoonha, standing before the denial script, the same way."
      },
      "c27_after_record": {
        "title": "Reread the Script with No Author",
        "text": "The report’s approver field and the script’s author field are both empty. Turn the table over and read whom a document with no name was written for."
      },
      "c27_after_rush": {
        "title": "Retrace the Wasted Trip to the 12th Floor Through Procedure",
        "text": "Going up first to the dark 12th floor left nothing behind. Fairness tilts toward the card that proves, within procedure, the name you saw then."
      }
    }
  }
}
