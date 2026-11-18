/**
 * 번외 9 (src/nodes/side09.js) in English, for the English preview.
 *
 * A draft: translated with the glossary (앱출시-G), not yet edited by a
 * person. Words only, under the ids of the pack as the app is shipped it
 * (scripts/locale-words.mjs); the pack's label and title live in the
 * dictionary's `copy.sidePacks`, a scene or card left out here keeps its
 * Korean, and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "s9_start": {
      "title": "92 Days",
      "place": "KD Capital Head Office · Risk Management",
      "clock": "August 13 (Thu) 16:10, a day before the list closes",
      "lead": "A Thursday afternoon two days before Liberation Day. On a Risk Management desk lies a bundle of sample letters going out on Tuesday.",
      "text": "Chae Ian takes the pencil from behind his ear and turns the first sample. Customer Receivables’ “Notice with Care for the Bereaved,” 87 letters. Each is the first letter to tell a dead customer’s family about his debt. The first line reads “Notice to Pay Inherited Debt,” and below it the amount and a due date of September 30. 'They say Risk Management only checks the wording.' He points to the small print at the foot of the form. “Sent to: customers 92 days after the date of death. List closes August 14, 18:00. Sent August 18 (Tue).” 'Do you know why it’s 92 days? The longest three months there are is 92 days.'",
      "question": "You have to review the first line of 87 letters. What do you look at first?",
      "memo": [
        "87 Notices with Care for the Bereaved, sent August 18 (Tue)",
        "Sent to: customers 92 days after the date of death",
        "First line: 'Notice to Pay Inherited Debt', due September 30"
      ],
      "choices": {
        "s9_start_rule": {
          "label": "Find the paper the 92-day rule came from"
        },
        "s9_start_dates": {
          "label": "Check the 87 dates of death one by one"
        },
        "s9_start_list": {
          "label": "Read the wording, ask the team for the list"
        }
      }
    },
    "s9_rule": {
      "title": "Care for the Bereaved",
      "place": "KD Capital Head Office · Customer Receivables",
      "text": "In Customer Receivables’ files is the revised rule of March 2024. Its author: Wi Seonggyu, head of the inherited-debt unit. “Pressing for payment right after a funeral hurts the bereaved. Notify only after the inheritance is settled.” The next page is the collection rate on inherited debt. Before the revision 41%, after it 68%. Chae Ian says, 'A family has three months to tell a court it’ll pay only up to what it inherits (limited acceptance), or take nothing at all (renunciation).' He strikes through 92 twice with his pencil. 'If the letter comes after that, they never know the way was there.' A group message from Wi Seonggyu pops up. “87 bereaved notices go out Tuesday ^^ Let’s keep it at 0 complaints again this year!”",
      "question": "A rule called 'care' steps around the three months. What do you do?",
      "memo": [
        "Revised March 2024, by Wi Seonggyu, head of the inherited-debt unit",
        "Collection rate on inherited debt: 41% → 68%",
        "Limited acceptance and renunciation: three months from learning of the death"
      ],
      "choices": {
        "s9_rule_print": {
          "label": "Print the revision with the rate table"
        },
        "s9_rule_ask": {
          "label": "Ask Wi Seonggyu why the number is 92"
        },
        "s9_rule_skip": {
          "label": "Call the rule Receivables’ job and close it"
        }
      }
    },
    "s9_list": {
      "title": "A Name with a Day Left",
      "place": "KD Capital Head Office · Risk Management",
      "text": "Chae Ian is moving the 87 dates of death onto a calendar when his pencil stops on one line. Guk Jinho, 61. A sole trader who carried fish from Yeonan Pier in Incheon in a one-ton refrigerated truck. Dawn of May 14 (Thu), a heart attack in the driver’s seat. Left on the truck’s instalments 39.6 million won, a working-capital loan of 24.1 million won, 63.7 million won in all. 'For the other 86 the three months are over. Only this one has until tomorrow.' The family is a wife and a twenty-year-old daughter. He puts the pencil back behind his ear. 'By the rule, we can’t contact the family before Tuesday. That’s the rule.'",
      "question": "One house has a day left of its three months. What do you do?",
      "memo": [
        "Guk Jinho (61): died May 14 (Thu), three months run to August 14",
        "Debt left: truck instalments 39.6 million + working capital 24.1 million = 63.7 million won",
        "Rule: no contact with the family before the sending date"
      ],
      "choices": {
        "s9_list_go": {
          "label": "Go to the family yourself tonight"
        },
        "s9_list_log": {
          "label": "Log it first as contact outside the rule"
        },
        "s9_list_ian": {
          "label": "Ask Chae Ian to come with you"
        }
      }
    },
    "s9_villa": {
      "title": "Four Months",
      "place": "Namdong-gu, Incheon · Parking lot in front of a low-rise block",
      "text": "In the lot in front of the block, a white refrigerated truck has stood for three months. Aigul Serikova comes down the stairs. She came from Almaty, Kazakhstan, has lived 21 years in Korea, and answers in Korean. When you hold out a KD Capital business card she lays a hand on the truck’s door. 'My husband said four more months and the truck was paid off.' You say the numbers. Instalments 39.6 million won, the loan 24.1 million won. She repeats the numbers slowly. '63.7 million won. He wasn’t a man who could lie.' Then she asks, 'Why did nobody say anything for three months?'",
      "question": "A debt nobody spoke of for three months. How do you answer?",
      "memo": [
        "Aigul Serikova: from Almaty, 21 years in Korea, Guk Jinho’s wife",
        "Her husband’s words: 'Four more months and the truck is paid off'",
        "Debt actually left: 63.7 million won"
      ],
      "choices": {
        "s9_villa_rule": {
          "label": "Tell her the 92-day rule, hiding nothing"
        },
        "s9_villa_court": {
          "label": "Start with the court filing due tomorrow"
        },
        "s9_villa_sorry": {
          "label": "Apologise first, for the company"
        }
      }
    },
    "s9_home": {
      "title": "The Fortieth Day",
      "place": "Namdong-gu, Incheon · The flat’s living room",
      "text": "On the cabinet in the living room, in front of Guk Jinho’s photograph, sits a plate of baursak, fried bread. 'In Kazakhstan we lay a table on the fortieth day after someone leaves. I haven’t been able to clear it since.' Their daughter Guk Haneul comes out of her room and sits by her mother. A 2nd-year at university; the bill for her 2nd term’s fees is stuck to the fridge. You show them the sums. If the three months pass like this, the debt becomes the family’s. The wife 38.22 million won, the daughter 25.48 million won. Aigul Serikova shakes her head. 'If he said he would pay it, then I should pay it. Just take Haneul’s name off.'",
      "question": "The mother says she’ll pay, and asks only to take her daughter’s share off. What do you do?",
      "memo": [
        "If the three months pass: wife 38.22 million won, daughter 25.48 million won",
        "What her husband left: the truck, worth 18 million won; 4.1 million won in the bank",
        "The 2nd term’s fee bill on the fridge"
      ],
      "choices": {
        "s9_home_math": {
          "label": "Show in numbers the pay-what-you-inherit way"
        },
        "s9_home_both": {
          "label": "Explain it again to the daughter on her own"
        },
        "s9_home_wait": {
          "label": "Tell her to make up her mind first tonight"
        }
      }
    },
    "s9_name": {
      "title": "Serikkoba",
      "place": "Namdong-gu, Incheon · Community service centre",
      "clock": "August 14 (Fri) 09:40",
      "text": "Friday morning, at the community service centre’s counter. The clerk printing the papers for the court looks at the screen twice. Her residence card says “Serikova Aigul,” but her husband’s family register, from the 2005 marriage filing, spells it “Serikkoba Aigul.” They may need another paper to show it is the same person. Aigul Serikova takes a faded copy of the marriage registration from her purse. 'The clerk at the district office wrote it that way back then. In 21 years nobody asked.' The court takes filings until 18:00 today. Guk Haneul looks up the bus to the court on her phone.",
      "question": "One letter of a name is eating the last day. What do you do?",
      "memo": [
        "Residence card “Serikova” / family register “Serikkoba”",
        "Copy of the 2005 marriage registration: proof she is the same person",
        "Family court filings: until 18:00 today"
      ],
      "choices": {
        "s9_name_copy": {
          "label": "Make several copies of the marriage paper"
        },
        "s9_name_call": {
          "label": "Ask Chae Ian for the debt statement first"
        },
        "s9_name_bus": {
          "label": "Leave now; ask about papers at the court"
        }
      }
    },
    "s9_balance": {
      "title": "Unable to Confirm",
      "place": "KD Capital Head Office · Risk Management",
      "text": "The court papers also have to say how much debt is being inherited. When you request a balance statement for Guk Jinho’s debt, one line comes up on the screen. “Heir enquiry: unable to confirm before notice. Script no. 7.” Script 7 is 'This information will be sent to you by post at a later date.' Wi Seonggyu, head of the unit, comes up to Risk Management and says with a smile that the rule is for the bereaved, that you can’t push numbers at a house that just held a funeral. Chae Ian takes the pencil from behind his ear. 'A department head can sign for the statement too. But the name stays in the approval box.'",
      "question": "One statement leaves a name in the approval box. What do you do?",
      "memo": [
        "Heir enquiry: 'unable to confirm before notice', script no. 7",
        "Wi Seonggyu: 'You can’t push numbers at a house that just held a funeral'",
        "Can be issued on a department head’s approval; a name in the box"
      ],
      "choices": {
        "s9_bal_sign": {
          "label": "Put your name in the approval box too"
        },
        "s9_bal_script": {
          "label": "Print script no. 7 and put it in the file"
        },
        "s9_bal_listen": {
          "label": "Hear Wi Seonggyu out to the end"
        }
      }
    },
    "s9_buyer": {
      "title": "The Key",
      "place": "Namdong-gu, Incheon · Parking lot in front of the block",
      "text": "A used-truck dealer is already waiting in front of the block. It is an appointment made last week. He shows an envelope of cash. 18 million won for the truck, today. Aigul Serikova takes out the truck key. 'I can pay my husband’s debt with this first, can’t I? Living without paying back other people’s money, he couldn’t do it and neither can I.' Guk Haneul catches her mother’s sleeve. You remember what Chae Ian said on the phone. Sell something in her husband’s name before filing at the court, and the claim to pay only what she inherits could be blocked. The dealer looks at his watch. 'If not today, I’m looking at another truck.'",
      "question": "The key to pay her husband’s debt is in front of the dealer. What do you do?",
      "memo": [
        "Dealer’s cash: 18 million won, today only",
        "Selling before the court filing: the claim could be blocked",
        "Aigul Serikova: 'I can’t live without paying back other people’s money'"
      ],
      "choices": {
        "s9_buy_wait": {
          "label": "Say sell the truck after the filing"
        },
        "s9_buy_pay": {
          "label": "Say she’ll still pay what she inherits"
        },
        "s9_buy_send": {
          "label": "Tell the dealer yourself it can’t be today"
        }
      }
    },
    "s9_court": {
      "title": "16:52",
      "place": "Incheon Family Court · Public counter",
      "text": "The family court’s public counter, ticket number 61. The clerk lays the copy of the marriage registration next to the residence card and looks for a long time. Then stamps the filing. August 14, 16:52. Aigul Serikova takes the receipt in both hands and passes it to Guk Haneul. 'Is Haneul’s name all right now?' Leaving the court, she asks you, 'That letter, does it go to other houses too? How many?' You say 86. She stands still a moment and says, 'Those houses too, nobody said anything for three months? Like us?'",
      "question": "One house has its receipt, and 86 are left. What do you do?",
      "memo": [
        "Filed: August 14, 16:52, Incheon Family Court",
        "Aigul Serikova: 'That letter, does it go to other houses too?'",
        "86 letters left, the list closes at 18:00 today"
      ],
      "choices": {
        "s9_court_table": {
          "label": "Table when the 86 houses’ months ran out"
        },
        "s9_court_call": {
          "label": "Ask Chae Ian how long to fix the wording"
        },
        "s9_court_stop": {
          "label": "Walk the two of them to the bus stop"
        }
      }
    },
    "s9_aftershock": {
      "title": "The First Line",
      "place": "KD Capital Head Office · Risk Management",
      "clock": "17:50, 10 minutes before the list closes",
      "text": "Three things lie on the Risk Management desk. The sample of the 86 letters going out on Tuesday, the revised rule of March 2024, and a copy of Aigul Serikova’s receipt. For all 86 houses the three months are over. Even so, a family that did not know the debt was larger than the estate can still go to the court within three months of learning it (special limited acceptance). The only thing that can tell them is this one letter. Chae Ian sets the pencil down in front of you. 'The one thing Risk Management can change is the first line. It locks at 18:00.'",
      "question": "The 86 letters have one first line. What will you write?",
      "memo": [
        "86 letters, sent August 18 (Tue)",
        "A family that didn’t know: can still file within three months of learning",
        "The ending you choose stays on this device only"
      ],
      "choices": {
        "s9_after_notice": {
          "label": "Write that there’s a way not to pay it all"
        },
        "s9_after_cause": {
          "label": "Send the 92-day rate table to Audit"
        },
        "s9_after_none": {
          "label": "Leave 'Notice to Pay Inherited Debt' as it is"
        }
      }
    }
  },
  "outcomes": {
    "s9_after_notice": {
      "title": "86 Letters",
      "text": "You change the first line to this. 'There is a way not to have to pay all of this debt. Within three months of receiving this letter, please ask the family court.' Your name goes in the approval box, and that afternoon Customer Receivables’ expected collections for the second half are worked out again. On Tuesday the 86 letters go out. By November, 39 of those houses have filed papers at the court. Aigul Serikova’s filing (August 14, 16:52) is accepted in September, and Guk Haneul’s name comes off the 63.7 million won. The truck is sold after that for 18 million won and goes to pay her husband’s debt."
    },
    "s9_after_cause": {
      "title": "92 Days",
      "text": "You leave the first line as it is, and send the revision of March 2024 and the rate table (41% → 68%) to Audit. On Tuesday the 86 letters go out as 'Notice to Pay Inherited Debt.' Three months later one line of Customer Receivables’ rule changes. 'Notice to heirs: within 14 days of confirming the death, with a note on limited acceptance.' Wi Seonggyu keeps his desk, and is put up for a year-end commendation for fixing the rule. Aigul Serikova’s filing (August 14, 16:52) is accepted in September. How many of the 86 houses sent before that went back to the court is in no table."
    },
    "s9_after_none": {
      "title": "Notice to Pay",
      "text": "You don’t touch the first line. At 18:00 the list locks. On Tuesday the 86 letters go out as 'Notice to Pay Inherited Debt.' On Wednesday morning the first payment comes in. 500,000 won, with the payer’s note 'this first, for now.' A line pops up in Customer Receivables’ group chat. 'First payment from August’s bereaved notices ^^ Zero complaints again this year!' Aigul Serikova’s filing (August 14, 16:52) is accepted in September. The day before Chuseok, she sends a bag of baursak to Risk Management. On the note stuck to the bag, one line. 'What about the other houses?'"
    }
  }
};
