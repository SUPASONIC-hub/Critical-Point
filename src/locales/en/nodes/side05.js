/**
 * 번외 5 (src/nodes/side05.js) in English, for the English preview.
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the pack as the app is shipped it
 * (scripts/locale-words.mjs); the pack's label and title live in the
 * dictionary's `copy.sidePacks`, a scene or card left out here keeps its
 * Korean, and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "s5_start": {
      "title": "Nine Times",
      "place": "Trigger Lab · Analysts’ room",
      "clock": "February 12 (Thu) 21:40, 12 hours 20 minutes to the listing",
      "lead": "A Thursday night in February, just before the Lunar New Year holiday. As you are about to leave, Lee Minseo calls you over to her monitor.",
      "text": "Lee Minseo points at a graph, her ID badge held face-down in her hand. Deposits into the virtual-asset exchange Kanova are running at nine times the usual, this evening alone. KD Bank is Kanova’s partner bank: it provides the real-name accounts (bank accounts in a user’s own name, the only way money goes in or out of the exchange). At 10 a.m. tomorrow a new coin, 'Mireon', goes up on Kanova. On the Anti-Money Laundering team’s screen, 1,900 unusual-transaction alerts have piled up. 'They say there are two people left on the team. They want us to decide, before the 9 a.m. meeting, how many go up as suspicious transaction reports (telling the financial authorities about a suspicious flow of money).' Lee Minseo puts down a cold coffee. 'I’ve never seen numbers like this.'",
      "question": "Lee Minseo asks you to go through the 1,900 alerts with her until morning. What do you do?",
      "memo": [
        "Deposits to Kanova: 9 times the usual",
        "Mireon listing: tomorrow 10:00",
        "Unusual-transaction alerts: 1,900",
        "AML team on duty: 2 people, 09:00 meeting"
      ],
      "choices": {
        "s5_start_stay": {
          "label": "Take off your coat and say you’ll stay till morning"
        },
        "s5_start_rule": {
          "label": "Ask first what made the alerts go off"
        },
        "s5_start_cut": {
          "label": "Cut the 1,900 down fast, largest amounts first"
        }
      }
    },
    "s5_banner": {
      "title": "In Partnership with KD Bank",
      "place": "Trigger Lab · Analysts’ room · A phone screen",
      "text": "Your phone buzzes. It is Moon Hajun, who says he got your number from Do Yunha. A photo comes first: the banner on the Kanova app’s front screen. '12% a year on deposits, in partnership with KD Bank.' Texts follow. 'Is this really KD Bank? A friend in my class, his mum put the money he saved for his college application fees in here. She says it’s fine because the bank’s name is on it.' One more line. 'I’m going to KD Bank as an intern the week after next. Can I ask then?' Lee Minseo looks at the screen over your shoulder. At the very bottom of the deposit product’s (money you leave with them) terms is a line of small print. 'This product is not covered by deposit insurance.'",
      "question": "A high-school student asks whether he can trust the bank’s name. What do you do?",
      "memo": [
        "Kanova app banner: '12% a year on deposits, in partnership with KD Bank'",
        "Moon Hajun: a friend’s mother put in his application-fee savings",
        "Bottom of the terms: 'not covered by deposit insurance'"
      ],
      "choices": {
        "s5_banner_reply": {
          "label": "Reply honestly, only as far as the bank knows"
        },
        "s5_banner_save": {
          "label": "Save the banner and the terms’ last line together"
        },
        "s5_banner_later": {
          "label": "Leave the reply till morning and go back to the alerts"
        }
      }
    },
    "s5_partner": {
      "title": "Triangle Gimbap",
      "place": "Trigger Lab · Analysts’ room door",
      "text": "Manager Yuk Seongbin of the Digital Asset Partnerships team comes down with a convenience-store bag. It is the night before the listing, so he is on duty alone for his team. He hands round triangle gimbap, one each, and pulls up a chair. 'Lots of alerts, huh. We saw them too.' He shows you a table on his own phone. The Kanova partnership fees: 40% of the team’s target for the year. 'Filing reports is your job, Analyst. But if a few hundred go up the night before a listing, the exchange’s accounts can get frozen. Then the money people put in today gets frozen with them.' He sets down his gimbap without getting the wrapper all the way off. 'The banner? The exchange made it. We only checked it.'",
      "question": "The partnership manager says a report could freeze people’s money too. What do you do?",
      "memo": [
        "Yuk Seongbin: manager, Digital Asset Partnerships, on duty tonight",
        "Kanova partnership fees: 40% of the team’s target",
        "'The exchange made the banner, we only checked it'"
      ],
      "choices": {
        "s5_partner_eat": {
          "label": "Take the gimbap and hear him out to the end"
        },
        "s5_partner_doc": {
          "label": "Ask if there is a paper where the banner was 'checked'"
        },
        "s5_partner_deal": {
          "label": "Agree to file fewer reports so nothing gets frozen"
        }
      }
    },
    "s5_call": {
      "title": "Then That’s Fine",
      "place": "Trigger Lab · Analysts’ room · Customer check call",
      "text": "Near the top of the alert list is a transfer at 22:58: 38 million won. The sender is Chu Yeongbok, sixty-four, who runs a hardware store in Gongdeok-dong. By the rules, you make a check call. Over the sound of a shutter coming down, a voice. 'Nobody told me to send it. It’s my money and I’m putting it in.' He laughs. 'My granddaughter starts university in March. If I leave it in for just one month before the tuition’s due, it earns 380,000 won, they say. And KD Bank is in on it.' He says he has kept his shop account at this bank for 32 years. 'You’re the bank, right? Then that’s fine.' The script on the call screen has five check questions, and this case is nowhere in those five lines.",
      "question": "Chu Yeongbok says he sent the money because he saw the bank’s name. What do you do?",
      "memo": [
        "Chu Yeongbok (64): hardware store, Gongdeok-dong, with KD Bank 32 years",
        "22:58, 38 million won to Kanova",
        "Granddaughter’s university tuition: due in March",
        "The script’s 5 check questions -- none fits this"
      ],
      "choices": {
        "s5_call_listen": {
          "label": "Hear out the granddaughter story, don’t rush the call"
        },
        "s5_call_terms": {
          "label": "Read him what 'partnership' means in the terms"
        },
        "s5_call_script": {
          "label": "Ask only the script’s five lines and end the call"
        }
      }
    },
    "s5_overseas": {
      "title": "Minseo",
      "place": "Trigger Lab · Analysts’ room · Video call",
      "clock": "February 13 (Fri) 00:40, 23:40 in Singapore",
      "text": "Lee Minseo opens a video call. Through the window on screen, the lights of Singapore. It is Marisa Tan, regional head of compliance (checking that a company keeps to the law and its rules) for the group that owns Kanova. She greets them in English and goes straight to the point. 'Minseo, we saw the numbers too. Last week I advised putting off the listing, and the Seoul business side didn’t take it.' Called by her given name, Lee Minseo pauses for a moment. Marisa Tan puts a document up on the screen. The approval record for the banner’s wording; in the checked-by box, KD Bank’s Digital Asset Partnerships team. 'All we can see is the inside of the exchange. Where the money came from, the bank sees. That’s the shape of this partnership.'",
      "question": "The exchange’s compliance head shows you the banner’s check record. What do you do?",
      "memo": [
        "Marisa Tan: regional head of compliance, Kanova Group, Singapore",
        "Last week: advised delaying the listing -- not taken up",
        "Banner wording checked by: KD Bank Digital Asset Partnerships team"
      ],
      "choices": {
        "s5_overseas_thanks": {
          "label": "Thank her first for joining so late"
        },
        "s5_overseas_record": {
          "label": "Take the approval record and note the checked-by box"
        },
        "s5_overseas_delay": {
          "label": "Ask whether the listing can still be put off"
        }
      }
    },
    "s5_sort": {
      "title": "Three Rows",
      "place": "Trigger Lab · Analysts’ room · Alert screen",
      "text": "Lee Minseo splits the 1,900 into three rows on the screen. The first row is 312. Accounts opened only today sent similar amounts all evening. The second row is some 1,400. Like Chu Yeongbok, a large sum goes once from an old account. The third row is the rest; nobody knows yet what they are. 'A suspicious transaction report is for telling them about a suspicious flow of money, right? The people in the second row may not be suspicious. They may be the ones who were fooled.' Lee Minseo takes her hands off the keyboard. 'Report them, hold them till morning, or hand them to the partnership team. You decide. I’ll just get the numbers right.'",
      "question": "The 1,900 are split into three rows. What do you do?",
      "memo": [
        "Row one, 312: accounts opened today, similar amounts",
        "Row two, some 1,400: old accounts, one large sum",
        "Row three: not known yet",
        "Report / hold / hand to the partnership team"
      ],
      "choices": {
        "s5_sort_report": {
          "label": "File the 312 new accounts as suspicious transactions"
        },
        "s5_sort_hold": {
          "label": "Hold all 1,900 until the morning meeting"
        },
        "s5_sort_pass": {
          "label": "Hand the call to the partnership team, keep the list"
        }
      }
    },
    "s5_fee": {
      "title": "The Checked-By Box",
      "place": "Trigger Lab · Analysts’ room",
      "text": "Manager Yuk Seongbin comes down again. Empty-handed this time. His tie is loose and one shirt button is done up in the wrong hole. 'I saw the papers for the morning meeting.' He does not sit; he grips the back of the chair. 'Three of the seven on my team are on contracts. If the fees drop below target, renewals come up in March.' He is quiet a moment, then adds, 'I didn’t like the banner’s wording either. I said let’s drop the word partnership, and the exchange said then they won’t do it. So I put my name in the checked-by box.' He starts to smile and stops. 'My name will come up at the meeting, won’t it.'",
      "question": "The man who put his name in the box knows it will be read out. What do you do?",
      "memo": [
        "Partnerships team: 3 of 7 on contracts, renewals in March",
        "Yuk Seongbin: asked to drop 'partnership', then backed down",
        "Banner checked-by box: Yuk Seongbin"
      ],
      "choices": {
        "s5_fee_sit": {
          "label": "Offer him a chair and listen to him first"
        },
        "s5_fee_name": {
          "label": "Leave the name in the checked-by box as it is"
        },
        "s5_fee_soft": {
          "label": "Change his name in the papers to the team’s name"
        }
      }
    },
    "s5_morning": {
      "title": "If the Bank Tells Me",
      "place": "Trigger Lab · Analysts’ room · An incoming call",
      "text": "Chu Yeongbok calls first. The sound of a shop door opening, a heater being lit. 'I was a bit short with you last night. I thought about it all night, though.' He catches his breath. 'So is it all right to leave it in, or not? If the bank tells me, I’ll do just that.' On the screen in front of you, the time to the listing counts down by the second. The bank never sold that product, and it cannot choose for him either. All it can say is a few lines in the terms, and that this call is recorded. He says the tuition bill with his granddaughter’s name on it is lying on the counter.",
      "question": "Chu Yeongbok says he will do whatever the bank decides. What do you do?",
      "memo": [
        "Chu Yeongbok: 'If the bank tells me, I’ll do just that'",
        "The bank never sold this product",
        "Call being recorded",
        "On the counter: his granddaughter’s tuition bill"
      ],
      "choices": {
        "s5_morning_plain": {
          "label": "Say in plain words the bank does not guarantee it"
        },
        "s5_morning_terms": {
          "label": "Read out the terms’ 'not covered by deposit insurance'"
        },
        "s5_morning_script": {
          "label": "Say only, as scripted, 'It’s your decision, sir'"
        }
      }
    },
    "s5_aftershock": {
      "title": "20 Minutes to the Meeting",
      "place": "Trigger Lab · Analysts’ room",
      "clock": "08:40, 20 minutes to the meeting · 80 minutes to the listing",
      "text": "It is getting light outside. Lee Minseo stretches, leaving the three rows on the screen as they are. On the desk: one cold triangle gimbap, the banner photo Moon Hajun sent, Marisa Tan’s approval record, Chu Yeongbok’s call log. At 9 there is the meeting, at 10 the listing. Neither can be stopped from this room. 'They say we can take just one thing from tonight into the meeting.' Lee Minseo turns the badge she has been holding face-down the right way round and hangs it on. 'You choose. I’ll keep the rest in a folder.'",
      "question": "Listing eve is ending. What will you take into the meeting?",
      "memo": [
        "09:00 AML team meeting",
        "10:00 Mireon listing -- cannot be stopped from this room",
        "The ending you choose stays on this device only"
      ],
      "choices": {
        "s5_after_report": {
          "label": "Take in the 312 suspicious transaction reports"
        },
        "s5_after_banner": {
          "label": "Ask for the 'KD Bank partnership' banner to come down"
        },
        "s5_after_folder": {
          "label": "Take nothing in, and just leave the folder"
        }
      }
    }
  },
  "outcomes": {
    "s5_after_report": {
      "title": "A Filing Number",
      "text": "At the 9 o’clock meeting you read out the 312. Accounts opened today, similar amounts, the same evening. Manager Yuk Seongbin writes it down, head bowed. At 9:40 the reports are filed and a filing number comes up on the screen. At 10, Mireon is listed as planned. Nobody says what the filing number will change. In the afternoon Lee Minseo renames the folder. 'Listing eve, filed 312.' Under it she adds one more line. 'Row two, 1,400 people: not for reporting. May be the ones who were fooled.'"
    },
    "s5_after_banner": {
      "title": "Partnership",
      "text": "At the meeting you put up two pictures instead of numbers. The banner Moon Hajun sent, and Marisa Tan’s approval record. At the team name in the checked-by box, the meeting room goes quiet. At 9:50, 'in partnership with KD Bank' disappears from the banner on the Kanova app. The 12% stays. At 10, the listing goes ahead as planned. At lunchtime a text comes from Moon Hajun. 'The banner changed. My friend’s mum saw it and says she’ll call the bank.' Manager Yuk Seongbin folds the fee table and puts it in his drawer."
    },
    "s5_after_folder": {
      "title": "A Folder Named Only by Date",
      "text": "You take nothing into the meeting. It ends in 11 minutes, and at 10 Mireon is listed as planned. The number on the alert screen goes back to 0. Lee Minseo puts the three rows she split overnight into one folder. The folder’s name is only the date. At 3 p.m. Chu Yeongbok calls once more. 'Is that analyst from yesterday there? Just, to say thanks.' Whether he put the money in or took it out, you do not ask. Closing the folder, Lee Minseo says, 'Don’t delete this one. If anybody asks, it has to be there.'"
    }
  }
};
