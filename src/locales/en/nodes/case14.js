/**
 * 사건 14 (src/nodes/case14.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c14_start": {
      "title": "As Long as the Bank Doesn’t Fail",
      "text": "The list of returns to regular departments set for Monday came back marked 'on hold', and the 4th floor stays as it is. On every screen at KD Bank windows, a green ad loops. 'Do good even after retirement: the Sangsaeng ESG Fund.' The launch was moved up, and in 2 weeks 107 billion won was sold. The average buyer is 71. The appendix at the very back of the prospectus lists what the fund buys. 38 loans from group affiliates. All non-performing loans. And the remaining piece of the FlowOn loan. Do Yoonha taps page two of the sales script he got from a Gangseo Branch peer. 'As long as the bank doesn’t fail, you have nothing to worry about.' 'That’s my sentence. What I used to say at the window 3 years ago. They’re mis-selling again, and this time in my voice.'",
      "memo": [
        "Sangsaeng ESG Fund Round 1: 107 billion won -- 3,146 buyers",
        "Average buyer age 71, sold at KD Bank windows",
        "Holdings: 38 group non-performing loans + the remaining piece of the FlowOn loan",
        "Page two of the sales script: Do Yoonha’s sentence from 3 years ago"
      ],
      "choices": {
        "c14_start_compare": {
          "label": "Read the sales script against the prospectus, line by line"
        },
        "c14_start_trace": {
          "label": "Leave the sales; pull the list of loans the fund bought"
        },
        "c14_start_shop": {
          "label": "Pose as a customer at the Gangseo Branch window"
        },
        "reframe": {
          "label": "List what the window sold"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Round 2 sales · D-8",
      "question": "The script for a fund sold to retirees has Do Yoonha’s sentence from 3 years ago. What do you do first?",
      "lead": "The last week of October. Overnight, the bank billboard outside the analyst room window has turned green."
    },
    "c14_counter": {
      "title": "Grandpa Knows Too Much",
      "text": "The Gangseo Branch lobby, 10:40 a.m. Holding ticket No. 51, Kang Taemin sits in a white wig, leaning on a cane. He is here as a mystery shopper, a 'retiree, seventy-three'. Beside him, Oh Jinwoo, playing the son, rehearses 'Dad, slow down.' The problem is that Kang Taemin memorized the question sheet overnight. The moment he sits at the window, he asks, 'I see redemption is locked for 3 years. What share of the holdings is subordinated?' The new teller’s pen stops. Oh Jinwoo whispers, 'Hyung, seventy-three-year-olds don’t ask that.' Then a quiet voice comes from the next window. 'Please say it again slowly. I’ll write it down.' A grandmother in a white blouse writes carefully in her notebook. 'The principal, the bank, protects.'",
      "memo": [
        "Under inspection: Gangseo Branch Windows 4 and 5",
        "Kang Taemin’s role: 'Mr. Kang', retired, 73 -- 22 questions memorized",
        "Customer at the next window: Lee Jungsook (72) -- investing 24 million won",
        "The 3-year redemption lock never once came up at the window"
      ],
      "choices": {
        "c14_counter_report": {
          "label": "List the missing disclosures; hand them to the manager"
        },
        "c14_counter_record": {
          "label": "Stay undercover and record the next window to the end"
        },
        "c14_counter_stop": {
          "label": "Ask Lee Jungsook at the next window to stop signing"
        },
        "reframe": {
          "label": "List what the window sold"
        },
        "c14_counter_evidence_turn": {
          "label": "Check the fund’s bad-loan price"
        }
      },
      "place": "KD Bank Gangseo Branch · Lobby windows",
      "clock": "Round 2 sales D-7 · 10:40",
      "question": "The grandmother at the next window is writing down 'the bank protects the principal'. What do you do?",
      "lead": "Wig and cane in hand, Kang Taemin practiced his walk three times outside the branch."
    },
    "c14_desk": {
      "title": "A Kind Name",
      "text": "The KD Asset Management trading floor in Pangyo. In front of six market screens, Joo Eunchae switches among three highlighters. She does not see you as an enemy. If anything, she is glad you came. 'I designed this fund. It buys bad loans cheap, gives the companies time to breathe, and waits 5 years to collect. Put the recovery rate at 68% and you get 4.8% a year. Kind money earning kind returns.' Flipping through the model, she switches on a second monitor. Next to the bank’s sales board is a table you have never seen. The KD Bank sales bonus table. 400,000 won per 100 million won, and one line at the bottom. '1.5x when converting maturing deposits of customers aged 70 or older.' Joo Eunchae’s highlighter stops. 'This… isn’t a table I made.'",
      "memo": [
        "Design assumptions: 5-year hold, 68% recovery, 4.8% a year",
        "Originally meant for: institutions like pension funds that can wait 5 years",
        "Sales bonus: 400,000 won per 100 million won, 1.5x for customers 70 or older",
        "Window script: 'You can take it out whenever you need it'"
      ],
      "choices": {
        "c14_desk_gap": {
          "label": "Chart where the design papers and the script diverge"
        },
        "c14_desk_model": {
          "label": "Take only her model file; trace where the loans came from"
        },
        "c14_desk_play": {
          "label": "Tell Joo Eunchae what the window says; ask her to stop it"
        },
        "reframe": {
          "label": "List what the window sold"
        },
        "c14_desk_evidence_turn": {
          "label": "Check the fund’s bad-loan price"
        }
      },
      "place": "KD Asset Management, Pangyo · Trading floor",
      "clock": "Round 2 sales · D-5",
      "question": "The designer of the kind fund has stopped in front of a bonus table she has never seen. What do you do with her?",
      "lead": "Carrying what you saw at the Gangseo Branch window, you have come to Pangyo to find the person who designed this fund."
    },
    "c14_class": {
      "title": "If You Don’t Understand, Don’t Sign",
      "text": "3rd floor of the Gangseo Senior Welfare Center, the 'Happy Retirement Finance Class'. The instructor is a Gangseo Branch private banker, and on the table at the back are 80 application forms. This is not a class; it is a sales pitch. Just as the instructor is about to say 'as long as the bank doesn’t fail', Lee Jungsook in the second row raises her hand. She opens her notebook and reads the sentence she wrote down at the window last week. 'You can take it out anytime. But the prospectus says you can’t for 3 years. Which one is wrong?' When the instructor can’t answer, Lee Jungsook walks to the front and picks up the chalk. A hand that stood at a blackboard for 38 years. She writes in big letters. 'If you don’t understand, don’t sign.' Around the room comes the sound of forms being folded. The instructor looks at you.",
      "memo": [
        "62 at the finance class -- 80 application forms at the back",
        "Instructor: Gangseo Branch private banker, sales target of 500 million won per class",
        "Lee Jungsook: elementary school teacher for 38 years, grades in red pencil",
        "Lee Jungsook’s cancellation deadline: 18:00 on Round 2’s first day"
      ],
      "choices": {
        "c14_class_read": {
          "label": "Read each senior’s form together with Lee Jungsook"
        },
        "c14_class_leave": {
          "label": "Leave the class to her; follow the money in Pangyo"
        },
        "c14_class_notice": {
          "label": "Send buyers written instructions on how to cancel"
        },
        "reframe": {
          "label": "List what the window sold"
        },
        "c14_class_evidence_turn": {
          "label": "Check the fund’s bad-loan price"
        }
      },
      "place": "Gangseo Senior Welfare Center · Finance class",
      "clock": "Round 2 sales · D-2",
      "question": "'If you don’t understand, don’t sign' is on the blackboard, and the instructor looks at you. What do you do with this class?",
      "lead": "After you saw the number 41 in Joo Eunchae’s model, a 'Finance Class' banner went up on the welfare center’s 3rd floor."
    },
    "c14_final": {
      "title": "Day 1 of Round 2",
      "text": "10 minutes until the shutter goes up in the Gangseo Branch lobby. Starting today, Monday, Round 2 of the Sangsaeng fund, 150 billion won, goes on sale, and a new green standing sign is up beside the ticket machine. A new script sits at every window, but that sentence on page two is unchanged. A text arrives from Joo Eunchae in Pangyo. 'Only my signature is left in the Round 2 approval field. Due by 9.' Outside the glass doors, seniors are already lined up, and at the front stands Lee Jungsook with her notebook. 18:00 today is her cancellation deadline. Do Yoonha runs a hand once over the chair at Window 4 and looks at you. '3 years ago I sat here and said that sentence. What should I say today?'",
      "memo": [
        "Round 2 target 150 billion won -- starts today at 09:00",
        "Round 2 approval field: only Joo Eunchae’s signature left",
        "Lee Jungsook’s cancellation deadline today at 18:00",
        "This choice sets how the group moves its losses next"
      ],
      "choices": {
        "c14_final_fix": {
          "label": "Block Round 2 until disclosure and process are fixed"
        },
        "c14_final_trace": {
          "label": "Let sales go on; trace the 150 billion won"
        },
        "c14_final_halt": {
          "label": "Demand a public halt before the shutter goes up"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Bank Gangseo Branch · Banking Hall",
      "clock": "Round 2, day 1 · 08:50",
      "question": "10 minutes before the shutter rises, Round 2, 150 billion won, is about to begin. What do you do?",
      "lead": "Monday morning. Before the shutter goes up, the only sound in the lobby is the ticket machine’s standby tone."
    },
    "c14_aftershock": {
      "title": "The Blackboard Photo",
      "text": "An hour before the deadline, Lee Jungsook, the retired teacher who put 24 million won into the Sangsaeng fund, fills out a cancellation form on the Window 4 tablet. Do Yoonha reads each box on the screen aloud, and Lee Jungsook writes at his pace. Having signed the signature pad, she holds out her phone. A photo from her grandson Jang Yoonjae. The 'If you don’t understand, don’t sign' she wrote on the welfare center blackboard is going around his school group chat. 'My grandma is famous now.' Kang Taemin offers her the white wig as a keepsake, and Lee Jungsook politely declines. 'I have the real thing.' While everyone laughs, a message comes from Lee Minseo. 'HR got in touch. About converting me to permanent staff. But they say there’s one condition.'",
      "memo": [
        "Lee Jungsook’s cancellation filed -- 24 million won to be returned",
        "Blackboard photo shared in her grandson’s school group chat",
        "Buyers’ group chat 40 → 186",
        "Lee Minseo: offer of permanent status, one condition"
      ],
      "choices": {
        "c14_after_record": {
          "label": "Put a sales-standard revision banning that line in writing"
        },
        "c14_after_rush": {
          "label": "Go straight to HR the moment Lee Minseo’s message lands"
        },
        "c14_after_warm": {
          "label": "Stay at the buyers’ dinner with Lee Jungsook to the end"
        }
      },
      "place": "KD Bank Gangseo Branch · Window 4",
      "clock": "Cancellation deadline · 17:00",
      "question": "The blackboard photo is going around her grandson’s school, and Lee Minseo has an offer with a condition. How do you close this evening?"
    },
    "c14_husband": {
      "title": "Jang Hyungyu, Born 1951",
      "text": "In the copy of Lee Jungsook’s application that Oh Jinwoo brought, Do Yoonha looks at one box. In the contact field, a name written and erased shows through. Jang Hyungyu. Do Yoonha takes his window notebook from 3 years ago out of his bag, flips through it, and stops. 'Mr. Jang Hyungyu, retirement pay 120 million won, FlowOn-linked bond product.' Beside it, a note in his own hand. 'Wife was a teacher. Brags about the grandkids a lot.' That product was cut in half along with FlowOn, and Jang Hyungyu died the following winter. Do Yoonha cannot close the notebook. 'The same loan comes to the same house twice. Both times in my words.'",
      "memo": [
        "Jang Hyungyu: Do Yoonha’s window customer 3 years ago, retirement pay 120 million won",
        "Losses on the FlowOn-linked product -- died the following winter",
        "Lee Jungsook’s investment: 4 years of her grandson Jang Yoonjae’s college tuition"
      ],
      "choices": {
        "c14_husband_choice_1": {
          "label": "Stand by Do Yoonha as he tells her about 3 years ago"
        },
        "c14_husband_choice_3": {
          "label": "Leave 3 years ago for later; stop this fund first"
        },
        "c14_husband_choice_2": {
          "label": "Match the script against sales records from 3 years ago"
        }
      },
      "place": "KD Bank Gangseo Branch · Consultation room",
      "clock": "Round 2 sales D-7 · Evening",
      "question": "Lee Jungsook’s husband was Do Yoonha’s window customer 3 years ago. What do you do with this?"
    },
    "c14_recovery": {
      "text": "Handed Joo Eunchae’s model, Kwon Dohyun points to one cell within 3 seconds. 'A 68% recovery rate? The FlowOn piece Bridge Bank bought last year came in at 41%. I know, because I bought it.' He taps his calculator. 'Put in 41 and you don’t get 4.8% a year; 22% of the principal disappears. At this price it’s a loss. For the customer.' When Oh Jinwoo asks 'And the seller?', he taps once more. 'The seller is in the black. I don’t want that kind of profit in my books.' Joo Eunchae types 41 into the model herself. The unit price chart bends down off the screen.",
      "memo": [
        "68% recovery rate in Joo Eunchae’s model",
        "Bridge Bank’s actual recovery rate on purchase: 41%",
        "At 41%: estimated 22% loss of principal"
      ],
      "choices": {
        "c14_recovery_choice_1": {
          "label": "Rewrite the 41% model in buyers’ terms with her"
        },
        "c14_recovery_choice_3": {
          "label": "Take only Kwon Dohyun’s numbers and move on"
        },
        "c14_recovery_choice_2": {
          "label": "Formally ask the manager for the recovery assumptions"
        }
      },
      "place": "KD Asset Management, Pangyo · Trading room meeting table",
      "clock": "Round 2 sales D-5 · 19:00",
      "question": "Change the 68% recovery rate to 41%, and 22% of the principal vanishes. How do you use this calculation?"
    },
    "c14_grade": {
      "title": "100 on the Dictation",
      "text": "When the class ends, Kang Taemin goes up to Lee Jungsook and takes off his wig. 'Ma’am, I’m not really seventy-three.' Lee Jungsook lowers her glasses and looks at him. 'I know. At seventy-three your knees don’t bend like that.' She takes Kang Taemin’s question sheet and grades it in red pencil. Circles on all twenty-two questions. 'A 100 on the dictation, but a zero for your face.' While everyone laughs, Lee Jungsook shows the last page of her notebook. Forty names she copied down from the buyers’ group chat. 'They all wrote things down at the window, like me. But they don’t know where to hand it in.'",
      "memo": [
        "Kang Taemin’s question sheet, 22 questions -- all correct",
        "40 names gathered from the buyers’ group chat",
        "All people who wrote down what the window told them"
      ],
      "choices": {
        "c14_grade_choice_2": {
          "label": "Tag each notebook with date and window; file a complaint"
        },
        "c14_grade_choice_3": {
          "label": "Leave the notebooks to her; focus on halting sales"
        },
        "c14_grade_choice_1": {
          "label": "Gather the 40 notebooks and take them in with the buyers"
        }
      },
      "place": "Gangseo Senior Welfare Center · Back row of the finance class",
      "clock": "Round 2 sales D-2 · Afternoon",
      "question": "There are 40 notebooks of what the window said. What do you do with them?"
    },
    "c14_husband_reaction": {
      "title": "The Kind Young Man",
      "text": "On a bench outside the welfare center, Do Yoonha opens his notebook to that page and shows Lee Jungsook. She studies it a long time, then takes out her red pencil and draws a circle beside his old handwriting. 'Brags about the grandkids a lot. Yes, that was him.' Then she closes her notebook. 'My husband said the young man at the window was so kind. That’s why he trusted him all the more.' Do Yoonha bows his head. Lee Jungsook takes his hand. 'So this time, don’t be kind to me. Tell me exactly.'",
      "memo": [
        "The kind window her husband trusted",
        "Exactly, instead of kindly"
      ],
      "choices": {
        "c14_husband_reaction_choice_3": {
          "label": "Just apologize today; explain at the next class"
        },
        "c14_husband_reaction_choice_2": {
          "label": "Ask if her notebook can be evidence of the sales process"
        },
        "c14_husband_reaction_choice_1": {
          "label": "Explain plainly the loans the fund bought"
        }
      },
      "place": "Alley outside the Gangseo Senior Welfare Center",
      "clock": "Round 2 sales D-6 · Morning",
      "question": "Lee Jungsook asks you to tell her exactly, not kindly. What do you tell her?"
    },
    "c14_recovery_reaction": {
      "title": "The Name I Gave It",
      "text": "11 at night. Everyone on the trading floor has gone except Joo Eunchae. Sipping cold barley tea, she speaks. 'It was meant to be sold to pension funds. Money that can wait 5 years. A month ago the group said to bring it down to the windows. I didn’t object. It’s a kind fund, so I thought it would grow grandmothers’ money kindly too.' She looks at the fund’s name on the monitor. 'Sangsaeng, I named it. Thanks to that name, the word risk got smaller in the prospectus.'",
      "memo": [
        "The month a pension-fund product came down to the windows",
        "Risk hidden by a kind name"
      ],
      "choices": {
        "c14_recovery_reaction_choice_3": {
          "label": "Set aside her guilt; just borrow her system access"
        },
        "c14_recovery_reaction_choice_1": {
          "label": "Ask Joo Eunchae to oppose Round 2 with you"
        },
        "c14_recovery_reaction_choice_2": {
          "label": "Have her record who decided on window sales"
        }
      },
      "place": "KD Asset Management trading floor, Pangyo · Night",
      "clock": "Round 2 sales D-5 · 23:00",
      "question": "Joo Eunchae says she named it Sangsaeng herself. What do you ask of her?"
    },
    "c14_grade_reaction": {
      "title": "The Bank Boy Fan Club",
      "text": "That night Lee Jungsook invites Oh Jinwoo to the buyers’ group chat. In 10 minutes, 213 messages pile up. 'Bank boy, can’t we take ours out for 3 years either?' 'Have you eaten, young man?' 'Post a photo of your face, so we can see and trust you.' Oh Jinwoo answers every question, then puts his phone down at one in the morning. 'All together it’s 4.1 billion won. 40 people, 4.1 billion. Most of it is money that got switched at the window on the day a deposit matured.' He has always picked the winning side; now he stares at the ceiling. 'This isn’t a fight you win. It’s a fight you can’t lose.'",
      "memo": [
        "40 people, 4.1 billion won",
        "Money switched on deposit maturity day"
      ],
      "choices": {
        "c14_grade_reaction_choice_2": {
          "label": "Match the 40 sign-up dates against deposit maturities"
        },
        "c14_grade_reaction_choice_1": {
          "label": "Ask the seniors to go to the window together tomorrow"
        },
        "c14_grade_reaction_choice_3": {
          "label": "Leave the chat to Oh Jinwoo; prepare tomorrow’s call"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Night",
      "clock": "Round 2 sales D-1 · 01:10",
      "question": "Most of the 4.1 billion won the 40 put in was switched on deposit maturity day. What do you say to this group chat?"
    },
    "c14_branch_tape": {
      "title": "3 Minutes 12 Seconds",
      "text": "Handed the inspection sheet, the branch manager surprisingly gives up the key to the call recording room without a fight. 'We did everything by the rules.' Ban Jaewook puts on headphones and plays 20 consultations with customers aged 70 or older, one after another. They are all about the same length. A little over 3 minutes. And all 20 cut off just before 'This product may lose principal' and resume at 'Then just sign here.' Ban Jaewook takes off the headphones. 'By the rules, sure. The rules only say to turn it on, not that you can’t turn it off.' In the corridor outside the room, someone is pacing.",
      "memo": [
        "20 consultation recordings with customers 70 or older checked",
        "Average length 3 minutes 12 seconds -- every risk-explanation segment missing",
        "Branch rule: 'The intent-to-buy segment must be recorded'",
        "Outside the room: the new teller at Window 4"
      ],
      "choices": {
        "c14_branch_tape_b": {
          "label": "Seal the recording list as an FSS complaint file"
        },
        "c14_branch_tape_a": {
          "label": "Call the 20 customers with cut recordings first"
        },
        "c14_branch_tape_c": {
          "label": "Note the manager’s reading of the rules and withdraw"
        }
      },
      "place": "KD Bank Gangseo Branch · Call recording room",
      "clock": "Round 2 sales D-7 · 14:00",
      "question": "All 20 consultation recordings cut off just before the risk explanation. What do you do with them?"
    },
    "c14_branch_tape_follow": {
      "title": "Window 4",
      "text": "The one pacing the corridor is a new teller, 8 months on the job. Name badge flipped around, she speaks to Do Yoonha. 'Sir, you used Window 4, didn’t you? Your name sticker is still in the drawer.' She holds out her phone. Sentences posted in the branch group chat every morning. 'Risk explanation: recorder off, keep it short.' 'If the customer hesitates: as long as the bank doesn’t fail.' Her voice shakes. 'If I miss this month’s target, I get sent to another branch. But yesterday a grandmother held my hand and thanked me.' Do Yoonha can’t answer for a long time.",
      "memo": [
        "New teller, 8 months in -- assigned to Window 4",
        "14 screenshots of instructions in the branch group chat",
        "Miss this month’s sales target and face transfer to another branch",
        "Do Yoonha’s name sticker is still in the drawer"
      ],
      "choices": {
        "c14_branch_tape_follow_c": {
          "label": "Send her back; leave with the recordings, no screenshots"
        },
        "c14_branch_tape_follow_b": {
          "label": "Trace up the chat to who issued the instructions"
        },
        "c14_branch_tape_follow_a": {
          "label": "Promise to protect her and take the screenshots"
        }
      },
      "place": "KD Bank Gangseo Branch · Staff corridor",
      "clock": "Round 2 sales D-7 · 15:00",
      "question": "The new teller at Window 4 shows you the instructions handed down every morning. What do you do for her?"
    },
    "c14_route_system": {
      "title": "Warm Names",
      "text": "You ask to line up the names of products sold at the window. ECHO goes through 15 years of bank window sales lists. Nine products that sold and then lost heavily come up. In all nine, the average buyer was over 65, and seven had words like 'Peace of Mind', 'Happiness' or 'Sangsaeng' in their names. ECHO overlays the two lists. The warmer the name, the shorter the key disclosure. The shortest was a page and a half. 'The length of the sentences explaining risk has been learned to move opposite to the warmth of the product’s name. This fund’s key disclosure is one page.'",
      "memo": [
        "9 products sold at windows with heavy losses -- average buyer 65 or older",
        "7 products with 'Peace of Mind · Happiness · Sangsaeng' in the name",
        "Sangsaeng fund key disclosure: 1 page"
      ],
      "choices": {
        "c14_route_system_publish": {
          "label": "Release the nine cases to buyers and reporters at once"
        },
        "c14_route_system_drop": {
          "label": "Bury the numbers and follow the sales schedule"
        },
        "c14_route_system_rename": {
          "label": "Demand 'Sangsaeng' be swapped for a risk grade"
        },
        "c14_route_system_evidence_turn": {
          "label": "Check the fund’s bad-loan price"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "Round 2 sales · D-3",
      "question": "The warmer the product name, the shorter the disclosure. What do you do with this statistic?"
    },
    "c14_final_system_route": {
      "title": "A One-Page Disclosure",
      "text": "A few hours before the shutter goes up, the Sangsaeng fund’s one-page key disclosure sits in the middle of the screen. Beside it, ECHO lines up the disclosures of the nine earlier products by length. This one page is shorter than the shortest, a page and a half. ECHO also brings up the window sales bonus table. Move the deposits of customers 70 or older into the fund, and it pays 1.5x. The shutter goes up at nine, and Lee Jungsook, a seventy-two-year-old buyer, will be at the front again today with her notebook. 'The ads read the name aloud. The customer reads the disclosure alone. The one read alone is one page.'",
      "memo": [
        "Sangsaeng fund key disclosure 1 page -- shorter than the shortest of the nine earlier products",
        "Window sales bonus: 1.5x for converting customers 70 or older",
        "Round 2 begins: today at 09:00",
        "Lee Jungsook’s cancellation deadline: today at 18:00"
      ],
      "choices": {
        "c14_final_system_route_a": {
          "label": "Require family to sit in for customers 70 or older"
        },
        "c14_final_system_route_b": {
          "label": "Let sales go on; just make the disclosure two pages"
        },
        "c14_final_system_route_c": {
          "label": "Demand the bonus drop its weighting for older customers"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "Round 2, day 1 · Dawn",
      "question": "The disclosure is one page and the shutter rises at nine. What do you add to the page the customer reads alone?"
    },
    "c14_evidence_turn": {
      "title": "92 Won and 41 Won",
      "text": "Line up the clues by purchase date, and the fund’s purchase statement opens. The fund bought 38 non-performing loans from group affiliates at 92 won per 100 won of original loan. Last year Bridge Bank bought the same kind of loans for 41 won. Ban Jaewook writes the subtraction in his notebook. 'A 51-won gap. On 107 billion won, that’s about 59 billion won. Losses that had to vanish from the group’s books before the quarterly results go up to the New York shareholder have moved into the accounts of 3,146 retirees.' He points to the bottom box of the statement. The purchase approver field is empty, and the approval record holds only two words: 'group consultation'.",
      "memo": [
        "Purchase price: 92 won per 100 won",
        "Market price: 41 won per 100 won -- Bridge Bank’s purchase price last year",
        "Purchase approver field: empty, approval record only says 'group consultation'"
      ],
      "choices": {
        "c14_evidence_turn_reprice": {
          "label": "No sales until the price is reset to market"
        },
        "c14_evidence_turn_hold": {
          "label": "Keep the statement; reveal it at Round 2 settlement"
        },
        "c14_evidence_turn_share": {
          "label": "Tell all 3,146 buyers the purchase price first"
        }
      },
      "place": "Trigger Lab archive (B2) · Purchase statement",
      "clock": "Round 2, day 1 · 07:00",
      "question": "The fund paid 92 won for 41-won loans, and the approver field is empty. How do you use this statement?"
    },
    "c14_start_warm": {
      "title": "A Script on the Lunch Table",
      "text": "Since the night after the livestream when you carried out every last light stand together, the list of returns set for Monday came back marked 'on hold', and the six have not eaten lunch apart once in 3 weeks. Onto that lunch table, Do Yoonha sets down a sales script. The group moved up the launch Baek Arin said was next month; for 2 weeks now bank windows have been selling the 'Sangsaeng fund' to retirees, and this is its script. What the fund buys is the group’s non-performing loans and the remaining piece of the FlowOn loan. 'This sentence on page two is what I used to say 3 years ago. This is mis-selling.' Six spoons stop at once.",
      "memo": [
        "Sangsaeng fund Round 1: 107 billion won -- 3,146 buyers, average age 71",
        "Holdings: 38 non-performing loans + the remaining piece of the FlowOn loan",
        "Page two of the sales script: Do Yoonha’s sentence from 3 years ago"
      ],
      "choices": {
        "c14_start_warm_signature": {
          "label": "Split roles among the lunch six and all go to the window"
        },
        "c14_start_warm_compare": {
          "label": "Read the sales script against the prospectus, line by line"
        },
        "c14_start_warm_shop": {
          "label": "Pose as a customer at the Gangseo Branch window"
        },
        "c14_start_warm_trace": {
          "label": "Leave the sales; pull the list of loans the fund bought"
        },
        "c14_start_warm_reframe": {
          "label": "List what the window sold"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Round 2 sales · D-8",
      "question": "Six spoons have stopped over one script. Where do the six of you go?",
      "lead": "Since clearing the Seongsu-dong set together, the six have always eaten lunch at the same snack bar."
    },
    "c14_start_record": {
      "title": "The Next Line Under the Same Code",
      "text": "3 weeks after you put the 33rd-floor offer on record, the list of returns set for Monday has come back marked 'on hold' and the 4th floor stays as it is. Ban Jaewook finds one more place where the Innovation Committee budget code in that document was used. The ad budget for the 'Sangsaeng fund', which KD Asset Management sold to 3,146 retirees for 107 billion won in 2 weeks. What the fund buys is the group’s non-performing loans and the remaining piece of the FlowOn loan. Ban Jaewook sets the sales script Do Yoonha obtained beside it. Not one line mentions risk, and page two carries word for word what Do Yoonha used to say 3 years ago. 'As long as the bank doesn’t fail, you have nothing to worry about.' Ban Jaewook says, 'Wash the face with ads, and pass the losses on at the window by mis-selling. With the same money.'",
      "memo": [
        "Same budget code as the Innovation Committee ads -- fund advertising",
        "Holdings: 38 non-performing loans + the remaining piece of the FlowOn loan",
        "Sales script: 0 lines on risk, page two is Do Yoonha’s sentence from 3 years ago"
      ],
      "choices": {
        "c14_start_record_shop": {
          "label": "Pose as a customer at the Gangseo Branch window"
        },
        "c14_start_record_compare": {
          "label": "Read the sales script against the prospectus, line by line"
        },
        "c14_start_record_signature": {
          "label": "File the shared ad-and-sales code with Internal Audit"
        },
        "c14_start_record_trace": {
          "label": "Leave the sales; pull the list of loans the fund bought"
        },
        "c14_start_record_reframe": {
          "label": "List what the window sold"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Round 2 sales · D-8",
      "question": "The Innovation Committee ads and the fund ads came from the same budget code. Where do you use this record?",
      "lead": "Sorting the offer documents, Ban Jaewook sees the same six-digit number twice."
    },
    "c14_start_rush": {
      "title": "The Next Fight of One Who Didn’t Stop",
      "text": "3 weeks after you started digging into the next 'Sangsaeng' product before the set had even cooled, the list of returns set for Monday came back marked 'on hold', and the 4th floor stays as it is. Oh Jinwoo calls first. 'A friend of my father’s bought a fund at the bank yesterday. A kind fund, they said, fine as long as the bank doesn’t fail.' KD Asset Management’s 'Sangsaeng fund', the product Baek Arin hinted was coming next month, has come out early. 107 billion won sold in 2 weeks, and what it bought is the group’s non-performing loans and the remaining piece of the FlowOn loan. Oh Jinwoo speaks faster. 'Do Yoonha says that sentence is one he used to say. This is mis-selling. If we’re late, another 30 billion won sells this week alone.'",
      "memo": [
        "Sangsaeng fund Round 1: 107 billion won · 3,146 buyers -- 30 billion won more expected this week",
        "Holdings: 38 non-performing loans + the remaining piece of the FlowOn loan",
        "Oh Sangchul’s friend signed up yesterday"
      ],
      "choices": {
        "c14_start_rush_compare": {
          "label": "Read the sales script against the prospectus, line by line"
        },
        "c14_start_rush_signature": {
          "label": "Visit Oh Sangchul’s friend and read his papers together"
        },
        "c14_start_rush_shop": {
          "label": "Pose as a customer at the Gangseo Branch window"
        },
        "c14_start_rush_trace": {
          "label": "Leave the sales; pull the list of loans the fund bought"
        },
        "c14_start_rush_reframe": {
          "label": "List what the window sold"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Round 2 sales · D-8",
      "question": "Oh Sangchul’s friend bought into that fund yesterday. Who do you see first, before it’s too late?",
      "lead": "On the morning of week 3 since you opened the folder called 'Sangsaeng ESG', Oh Jinwoo’s call comes first."
    }
  },
  "echoReplies": {
    "c14_start_shop": "At the window, the script turns into a human voice. What frightens you most is how kind that voice is.",
    "c14_start_compare": "Side by side, the prospectus’s 'possible loss of principal' becomes 'as long as the bank doesn’t fail' in the script. Checking one line takes a whole day.",
    "c14_start_trace": "The list comes out fast. While you pull it, 20 more people sign at the window.",
    "c14_counter_stop": "At your request, Lee Jungsook puts down her pen. Then she writes your words in her notebook. 'Wait, stop.' That afternoon she gets a deposit maturity call, comes back alone, and signs.",
    "c14_counter_report": "The inspection sheet is accurate. The branch manager takes it and puts it in a drawer, and meanwhile the signing at the next window is done.",
    "c14_counter_record": "The recording becomes evidence. While the evidence is recorded, Lee Jungsook’s signature crosses the window’s signature pad.",
    "c14_desk_play": "Hearing the pitch, Joo Eunchae asks twice for it again. The third time, she puts down her highlighter and stares at the screen for a while.",
    "c14_desk_gap": "Two columns are enough. Design document: '5-year hold'. Sales script: 'anytime'. Between them are 3,146 people.",
    "c14_desk_model": "The model comes over. Joo Eunchae sends the file without being able to ask what her design will be used for.",
    "c14_class_read": "Reading together, one form takes 20 minutes. Not one of the 62 leaves.",
    "c14_class_notice": "The written notice reaches everyone. The print is small, so Lee Jungsook passes her magnifier around and reads it again for them.",
    "c14_class_leave": "Lee Jungsook takes the class to the end. You see only the end and go to Pangyo to follow the money. The words on the welfare center blackboard are wiped off at cleaning time the next morning.",
    "c14_final_halt": "Your demand to stop echoes through the lobby. The shutter goes up, but the ticket machine stays off for an hour, and the group PR office’s phone rings first.",
    "c14_final_fix": "No opening until it is fixed, and Round 2 is pushed back 3 weeks. Over those 3 weeks, who writes page two of the new script becomes the new fight.",
    "c14_final_trace": "Sales open, and 20.7 billion won comes in today alone. The money’s path grows clear, and on that path are the people who lined up today.",
    "c14_after_warm": "At dinner, Lee Jungsook gives everyone a dictation test. Kang Taemin scores 100 again, and Kwon Dohyun loses points for writing the grading cost beside his answers.",
    "c14_after_record": "A standard in writing erases that sentence from the script. Do Yoonha signs his name at the very end of the revision.",
    "c14_after_rush": "The HR corridor is quiet. At the buyers’ dinner, one place setting goes unused.",
    "c14_husband_choice_1": "With you beside him, Do Yoonha rewrites his first sentence three times. The fourth time, he decides to just say her name.",
    "c14_husband_choice_2": "The records show the script from 3 years ago and today’s do not differ by a single letter. Only the writer has changed.",
    "c14_husband_choice_3": "You put it off; Do Yoonha nods and folds down that page of his notebook. The folded page doesn’t last the night.",
    "c14_recovery_choice_1": "Rewritten, '4.8% a year' becomes '5.28 million won out of 24 million won'. Joo Eunchae cannot read that number aloud.",
    "c14_recovery_choice_2": "The request is logged. The reply is due three days after Round 2 begins.",
    "c14_recovery_choice_3": "The numbers are accurate. Even as you pack your bag, Joo Eunchae erases 41 and types it again. It isn’t easy to get up and leave her there.",
    "c14_grade_choice_1": "Carrying them together, the 40 notebooks don’t fit in one bag. Kang Taemin borrows two shopping bags.",
    "c14_grade_choice_2": "Bundled, the notebooks become evidence. While they do, their owners fill in 20 form boxes each.",
    "c14_grade_choice_3": "Left with her, Lee Jungsook returns the notebooks one by one. Still no one knows where to hand them in.",
    "c14_husband_reaction_choice_1": "After the explanation, Lee Jungsook writes 'non-performing loans' in her notebook with three question marks. Erasing those question marks takes an hour.",
    "c14_husband_reaction_choice_2": "When you ask, Lee Jungsook holds out her notebook. 'A teacher’s notebook is evidence by nature.' The notebook is no longer only hers.",
    "c14_husband_reaction_choice_3": "You put it off; Lee Jungsook puts her notebook in her bag and takes the bus. One day fewer to undo her purchase.",
    "c14_recovery_reaction_choice_1": "At the idea of opposing it together, Joo Eunchae laughs for a long time. 'I’ve worked here 4 years. This is the first scary thing I’ve ever done.'",
    "c14_recovery_reaction_choice_2": "On record, it turns out the decision field holds no person’s name, only two words: 'group consultation'. Those two words are the signature field.",
    "c14_recovery_reaction_choice_3": "The access is borrowed. The next day, Joo Eunchae learns from the access log what it was used for.",
    "c14_grade_reaction_choice_1": "Asked to go together, 37 replies of 'What time?' come in. Three say their knees won’t let them and they will send rice cakes instead.",
    "c14_grade_reaction_choice_2": "Matched up, 38 signed up on the very day their deposit matured. The dates are too neat to call a coincidence.",
    "c14_grade_reaction_choice_3": "Left with it, Oh Jinwoo writes replies all night. By morning his eyes are red, and the chat has been renamed 'Bank Boy Fan Club'.",
    "c14_branch_tape_a": "Of the 20 you reach, 11 say 'No one ever explained the risk.' The rest say they don’t remember.",
    "c14_branch_tape_b": "A sealed list can’t be erased. The answer to the complaint comes 45 days later.",
    "c14_branch_tape_c": "The interpretation you write down is one line. 'No rule violated.' The footsteps in the corridor fade.",
    "c14_branch_tape_follow_a": "You promise, and the new teller turns her badge the right way round. The cost of keeping that promise is written in this month’s target sheet.",
    "c14_branch_tape_follow_b": "Tracing back, the sentences go up from the branch manager to regional HQ, and from HQ to 'group consultation'. There the names stop.",
    "c14_branch_tape_follow_c": "Sent back, the new teller returns to Window 4. Tomorrow morning the chat sentences will be posted again.",
    "c14_route_system_publish": "Released, it makes the news, and the group answers that it is 'an industry-wide problem'. This fund’s name appears in the article’s third paragraph.",
    "c14_route_system_rename": "Told to rename it, the asset manager holds out three days, citing 'brand damage'. On the third evening, 'Sangsaeng' shrinks to small print.",
    "c14_route_system_drop": "Buried, the schedule doesn’t waver. A 10th row quietly appears on the list of warm names.",
    "c14_final_system_route_a": "With family listening too, the explanation doubles in length. Daily window sales halve, and grandchildren ask the questions for their grandmothers.",
    "c14_final_system_route_b": "With a two-page disclosure, nobody turns to the second page. Page two of the script stays the same.",
    "c14_final_system_route_c": "With the weighting gone, window staff bonuses shrink. For the first time, the new tellers are a little less afraid of the target sheet.",
    "c14_evidence_turn_reprice": "Reset the price, and the 59 billion won loss returns to the group’s books. The group decides to call that number a 'one-time cost'.",
    "c14_evidence_turn_hold": "Knowing it gives you a weapon for settlement day. Until then, the gaps in the statement get filled a little more each day.",
    "c14_evidence_turn_share": "Told, all 3,146 call at once. The call center freezes, and the frozen call center becomes news.",
    "c14_counter_evidence_turn": "Set the prices side by side, and a gap opens between what the fund paid for the loans and what the market priced them at. Whose money filled that gap is in the buyer list.",
    "c14_desk_evidence_turn": "Set the prices side by side, and a gap opens between what the fund paid for the loans and what the market priced them at. Whose money filled that gap is in the buyer list.",
    "c14_class_evidence_turn": "Set the prices side by side, and a gap opens between what the fund paid for the loans and what the market priced them at. Whose money filled that gap is in the buyer list.",
    "c14_route_system_evidence_turn": "Set the prices side by side, and a gap opens between what the fund paid for the loans and what the market priced them at. Whose money filled that gap is in the buyer list.",
    "case14_memory_system": "The ads took only the warm words from your hand and dropped the conditions. ECHO calls up the nine products with warm names.",
    "case14_memory_evidence": "Set the budget code against the purchase statement, and the approver field is blank again. This time two prices sit beside the blank, and the money that covered the difference has owners.",
    "c14_start_warm_shop": "At the window, the script turns into a human voice. What frightens you most is how kind that voice is.",
    "c14_start_warm_compare": "Side by side, the prospectus’s 'possible loss of principal' becomes 'as long as the bank doesn’t fail' in the script. Checking one line takes a whole day.",
    "c14_start_warm_trace": "The list comes out fast. While you pull it, 20 more people sign at the window.",
    "c14_start_warm_signature": "As you split the roles, Kang Taemin raises his hand first. 'I’ll play the grandpa.' No one can stop him.",
    "c14_start_record_shop": "At the window, the script turns into a human voice. What frightens you most is how kind that voice is.",
    "c14_start_record_compare": "Side by side, the prospectus’s 'possible loss of principal' becomes 'as long as the bank doesn’t fail' in the script. Checking one line takes a whole day.",
    "c14_start_record_trace": "The list comes out fast. While you pull it, 20 more people sign at the window.",
    "c14_start_record_signature": "The record is logged. Internal Audit checks the code and records only the fact that it checked.",
    "c14_start_rush_shop": "At the window, the script turns into a human voice. What frightens you most is how kind that voice is.",
    "c14_start_rush_compare": "Side by side, the prospectus’s 'possible loss of principal' becomes 'as long as the bank doesn’t fail' in the script. Checking one line takes a whole day.",
    "c14_start_rush_trace": "The list comes out fast. While you pull it, 20 more people sign at the window.",
    "c14_start_rush_signature": "When you visit, the old man is glad to see you and brings out his papers. His glad face stiffens at page three."
  },
  "choiceVoiceLines": {
    "c14_start_shop": "Saying you need to hear how the script is actually spoken, you pose as a customer at the Gangseo Branch window and see the sales for yourself.",
    "c14_start_compare": "To see where what is said parts from what is written, you read the sales script against the prospectus line by line.",
    "c14_start_trace": "Saying what retirees’ money bought comes first, you leave the sales alone and pull the list of loans the fund bought.",
    "c14_counter_stop": "Because she needs to know the sentence she wrote down is wrong, you cross to the next window and ask Lee Jungsook to stop signing for a moment.",
    "c14_counter_report": "So it doesn’t end as the new teller’s fault, you list the missing disclosures on the inspection sheet and formally hand it to the branch manager.",
    "c14_counter_record": "Saying the evidence ends the moment you step in, you stay undercover and record the next window’s pitch to the end.",
    "c14_desk_play": "Saying she should hear how her fund is sold, you relay the window pitch to Joo Eunchae word for word and ask her to stop it with you.",
    "c14_desk_gap": "To show these were sales even the designer didn’t know about, you chart where the design document and the sales script diverge.",
    "c14_desk_model": "Saying you’ll follow only the money without dragging her in, you take just Joo Eunchae’s model file and trace where the loans came from.",
    "c14_class_read": "So it doesn’t end with one line on a blackboard, you and Lee Jungsook read the seniors’ forms together, one by one.",
    "c14_class_notice": "Saying what is heard changes again, you send seniors who already bought written instructions on how to cancel.",
    "c14_class_leave": "Saying the blackboard is better left to someone who stood there 38 years, you leave the class to Lee Jungsook and go back to Pangyo to follow the money.",
    "c14_final_halt": "Saying it has to happen in front of the seniors in line, you demand a public halt to sales before the shutter goes up.",
    "c14_final_fix": "Saying it can’t be sold with that sentence intact, you keep Round 2 closed until the disclosure and sales process are fixed.",
    "c14_final_trace": "To see the path of the losses to the end, you let sales go on and trace where the 150 billion won flows.",
    "c14_after_warm": "Not wanting to be first to leave a happy table, you stay at the buyers’ dinner with Lee Jungsook to the end tonight.",
    "c14_after_record": "Saying that if it ends with one cancellation the next window will use it again, you first put in writing a revised window sales standard that erases that sentence.",
    "c14_after_rush": "Uneasy at the words “one condition”, you go straight to HR the moment Lee Minseo’s message arrives.",
    "c14_husband_choice_1": "Saying the one whose sentence reached the same house twice must say it himself, you stand beside Do Yoonha as he tells Lee Jungsook what happened 3 years ago.",
    "c14_husband_choice_2": "To check it by records, not memory, you find the sales records from 3 years ago and see whether the script was the same.",
    "c14_husband_choice_3": "Since what Lee Jungsook put in is 4 years of her grandson’s tuition, you set aside what happened 3 years ago and stop this fund first.",
    "c14_recovery_choice_1": "So buyers can see how much of their own money the 22% is, you and Joo Eunchae rewrite the model rerun at 41% in buyers’ terms.",
    "c14_recovery_choice_2": "Saying the asset manager must answer where 68% came from, you formally request the basis for the recovery-rate assumption.",
    "c14_recovery_choice_3": "Saying the number is out and there is no reason to stay, you take only Kwon Dohyun’s figures and move on to the next hand.",
    "c14_grade_choice_1": "Saying it carries weight when the writers hand it in themselves, you gather the 40 notebooks and take them in with the buyers.",
    "c14_grade_choice_2": "So it doesn’t become a record with nowhere to go, you tag each notebook with a date and window number and bundle them as complaint material.",
    "c14_grade_choice_3": "Saying it’s useless if Round 2 opens first, you leave the notebooks with Lee Jungsook and focus only on demanding a halt.",
    "c14_husband_reaction_choice_1": "As she asked you to be exact, you explain to Lee Jungsook just what loans the fund bought.",
    "c14_husband_reaction_choice_2": "Saying the sentence she wrote down is the most accurate record, you ask whether her notebook can be used as evidence of the sales process.",
    "c14_husband_reaction_choice_3": "Since you can’t bring out numbers while she holds his hand, you only apologize today and leave the explanation for the next class.",
    "c14_recovery_reaction_choice_1": "To show her that this time she can object, you ask Joo Eunchae to oppose Round 2 with you.",
    "c14_recovery_reaction_choice_2": "So the one who named it isn’t the only one left holding it, you have her put on record who handed down the decision to sell at the window.",
    "c14_recovery_reaction_choice_3": "Saying there’s data to read instead of time to console, you set aside Joo Eunchae’s guilt and just borrow her system access.",
    "c14_grade_reaction_choice_1": "Saying the window must answer the 213 questions, you ask the seniors in the chat to go to the window together tomorrow.",
    "c14_grade_reaction_choice_2": "To show this is money switched at the window on maturity day, you match the 40 sign-up dates against their deposit maturity dates in one table.",
    "c14_grade_reaction_choice_3": "Saying the one the seniors trust is the bank boy, you leave the chat to Oh Jinwoo and prepare only tomorrow’s decision.",
    "c14_branch_tape_a": "Saying the people who never got the explanation should know first, you call the 20 customers whose recordings were cut.",
    "c14_branch_tape_b": "Before the cut spots can be erased, you seal the recording list as complaint material for the FSS.",
    "c14_branch_tape_c": "Saying they’ll take back the key if you argue here, you write down the branch manager’s reading of the rules and quietly withdraw.",
    "c14_branch_tape_follow_a": "Saying whoever hands over evidence must not get hurt, you promise to protect the new teller and take the chat screenshots.",
    "c14_branch_tape_follow_b": "So the lowest rung doesn’t take the blame, you trace up the chat to find who handed down the instructions.",
    "c14_branch_tape_follow_c": "Saying you can’t put this burden on someone 8 months in, you send the new teller back and leave with only the recordings, no screenshots.",
    "c14_route_system_publish": "Saying the next buyers should know first, you release the nine cases to the buyers’ group and reporters at once.",
    "c14_route_system_rename": "So the name can’t hide the risk, you demand that 'Sangsaeng' be taken out of the product name and a risk grade put in.",
    "c14_route_system_drop": "Saying nine past cases can’t stop this fund, you bury the numbers and follow the sales schedule.",
    "c14_final_system_route_a": "So no one reads that one page alone, you make it mandatory for customers 70 or older to hear the explanation with family.",
    "c14_final_system_route_b": "Saying you can’t stop the nine o’clock shutter, you let sales go on and only lengthen the disclosure to two pages.",
    "c14_final_system_route_c": "Saying the explanations shrink because of the bonuses, you demand the window sales bonus drop its weighting for older customers.",
    "c14_evidence_turn_reprice": "So the 51-won gap doesn’t pass into retirees’ accounts, you keep sales closed until the purchase price is reset to market.",
    "c14_evidence_turn_hold": "Saying the numbers must pile up more so there’s no way out, you keep the statement to yourself and bring it out at Round 2 settlement.",
    "c14_evidence_turn_share": "Saying they signed up without knowing it was bought at 92 won, you tell all 3,146 buyers the purchase price first.",
    "c14_counter_evidence_turn": "You set the clues one by one beside the prices on the fund’s purchase statement and read off what it paid for the loans.",
    "c14_desk_evidence_turn": "You set the clues one by one beside the prices on the fund’s purchase statement and read off what it paid for the loans.",
    "c14_class_evidence_turn": "You set the clues one by one beside the prices on the fund’s purchase statement and read off what it paid for the loans.",
    "c14_route_system_evidence_turn": "You set the clues one by one beside the prices on the fund’s purchase statement and read off what it paid for the loans.",
    "c14_start_warm_shop": "Saying you need to hear how the script is actually spoken, you pose as a customer at the Gangseo Branch window and see the sales for yourself.",
    "c14_start_warm_compare": "To see where what is said parts from what is written, you read the sales script against the prospectus line by line.",
    "c14_start_warm_trace": "Saying what retirees’ money bought comes first, you leave the sales alone and pull the list of loans the fund bought.",
    "c14_start_warm_signature": "Saying what one person sees stays one person’s word, the six from the lunch table split the roles and go to the window together.",
    "c14_start_record_shop": "Saying you need to hear how the script is actually spoken, you pose as a customer at the Gangseo Branch window and see the sales for yourself.",
    "c14_start_record_compare": "To see where what is said parts from what is written, you read the sales script against the prospectus line by line.",
    "c14_start_record_trace": "Saying what retirees’ money bought comes first, you leave the sales alone and pull the list of loans the fund bought.",
    "c14_start_record_signature": "To put on the books that the same money washes and sells, you formally file with Internal Audit the record that the ads and sales share one budget code.",
    "c14_start_rush_shop": "Saying you need to hear how the script is actually spoken, you pose as a customer at the Gangseo Branch window and see the sales for yourself.",
    "c14_start_rush_compare": "To see where what is said parts from what is written, you read the sales script against the prospectus line by line.",
    "c14_start_rush_trace": "Saying what retirees’ money bought comes first, you leave the sales alone and pull the list of loans the fund bought.",
    "c14_start_rush_signature": "Saying the one person who signed up yesterday comes before statistics, you visit Oh Sangchul’s friend first and reread his papers together."
  },
  "pack": {
    "clue": {
      "title": "92 Won and 41 Won",
      "text": "The Sangsaeng fund bought the group’s non-performing loans at 92 won per 100 won. The market price was 41 won, and the 59 billion won difference was covered by the money of 3,146 retirees."
    },
    "outcomes": {
      "c14_after_warm": {
        "tag": "Stayed Beside Them",
        "title": "You sat the dictation test with them to the end",
        "text": "At the buyers’ dinner, Lee Jungsook gave everyone a dictation test. You stayed to the last and got a red circle."
      },
      "c14_after_record": {
        "tag": "Sentence Erased",
        "title": "That sentence was erased from the window script",
        "text": "The revised sales standard was filed. 'As long as the bank doesn’t fail' is now a sentence no window script may use."
      },
      "c14_after_rush": {
        "tag": "Went Ahead",
        "title": "You left the dinner and went to HR first",
        "text": "You headed to HR the moment Lee Minseo’s message arrived. At the buyers’ dinner, one place setting went unused."
      }
    },
    "continuityChallenges": {
      "c13_after_warm": {
        "title": "Go Together with Your Lunch Companions",
        "text": "Since clearing the set together, the six have not scattered. Play the card that puts all six side by side at the window too, and trust follows."
      },
      "c13_after_record": {
        "title": "Read the Other Face of the Same Budget Code",
        "text": "The Innovation Committee ads and the fund ads came from the same money. That the face of reform and the face of sales share one ledger shows only when you turn the table over."
      },
      "c13_after_rush": {
        "title": "Ground a Fight You Rushed Into Without Records",
        "text": "A fight rushed straight from the studio has no records. Fairness stands when you can tell the buyers what you are basing the call to stop on."
      }
    }
  }
};
