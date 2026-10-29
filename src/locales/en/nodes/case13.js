/**
 * 사건 13 (src/nodes/case13.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c13_start": {
      "title": "The Past Is Settled",
      "text": "The morning after the first compensation payments, the Group Strategy Office on the 33rd floor of group headquarters. Yoon Sanghyuk, who wanted to talk about the signature field, never brings it up. Instead he slides a tablet across. A launch plan for the 'KD Innovation Committee', and at the top of the list of public outside members, your name. 'Since the National Assembly audit, people want a face. The face of someone who wrote a dissent, telling them the past is settled.' The price is two lines. The compensation standard for the 212 confirmed, and every Trigger Lab colleague returned to a regular department. A woman standing by the window holds out a business card. Baek Arin, Deputy Manager, Group Strategy Office, secretary of the Innovation Committee. 'We shoot tomorrow and go live in six days. I wrote the script. A good story outlasts the facts.' Yoon Sanghyuk caps his pen. 'This time it’s not a signature field but a performance contract. One box.'",
      "memo": [
        "KD Innovation Committee -- 5 public outside members, 1 face for the ads",
        "Price: standard for the 212 confirmed + every Trigger Lab colleague back to a regular department",
        "Condition: the dissent writer says 'the past is settled'",
        "D-6 to the launch campaign livestream",
        "Launch date timed to the quarterly review week of New York major shareholder Kingsdale Partners"
      ],
      "choices": {
        "c13_start_read": {
          "label": "Check the committee plan against the contract"
        },
        "c13_start_colleagues": {
          "label": "Tell your colleagues the offer and its price first"
        },
        "c13_start_accept": {
          "label": "Fix the price first and accept on the spot"
        },
        "reframe": {
          "label": "Ask how panels ended"
        }
      },
      "place": "KD Financial Group headquarters, 33rd floor · Group Strategy Office",
      "clock": "Early October · Launch livestream D-6",
      "question": "In exchange for the 212 and your colleagues’ jobs, they want you to say 'the past is settled'. What do you do first?",
      "lead": "On a morning when your clothes still smell of Chuseok rice cakes, the 33rd-floor elevator opens and a stranger greets you first."
    },
    "c13_studio": {
      "title": "17 Blown Takes",
      "text": "Even the colleagues who tagged along to watch end up on set. In front of the green screen, the take is blown 17 times. Five times because your smile looks 'like a hostage', three because 'KD' sounds like 'caddie'. Na Junhyuk, manager of the Yeongdong Branch, called in for a cameo, nails the stamping scene in one. It is a prop seal, but with 30 years in his wrist, even the sound of it landing on paper is clean. Director Bong Younghoon presses his face to the monitor. 'Can we make him the lead instead?' When the lighting crew runs late, Kang Taemin moves four stands by himself. On take 18, the last line rises on the teleprompter. 'The past has all been settled.'",
      "memo": [
        "17 blown takes -- 5 for expression, 3 for saying 'KD'",
        "Cameo Na Junhyuk: stamping scene done in 1 take",
        "4 light stands -- moved by Kang Taemin alone",
        "Last line of the script: 'The past has all been settled'"
      ],
      "choices": {
        "c13_studio_meet": {
          "label": "Stop the shoot and meet the people in this ad first"
        },
        "c13_studio_basis": {
          "label": "Demand a written basis for the last line"
        },
        "c13_studio_read": {
          "label": "Read it for now; ask them to cut it in the edit"
        },
        "reframe": {
          "label": "Ask how panels ended"
        },
        "c13_studio_evidence_turn": {
          "label": "Find the 3.8 billion cost code"
        }
      },
      "place": "Ad studio in Seongsu-dong · Set",
      "clock": "Shoot day · Livestream D-5",
      "question": "On take 18, 'The past has all been settled' comes up on the teleprompter. What do you do?",
      "lead": "The day after the 33rd-floor offer, the black van Baek Arin sent, saying 'just come see the set', was waiting outside Trigger Lab."
    },
    "c13_market": {
      "title": "15 Seconds",
      "text": "On the TV in the corner of Gaeul Rice Cake Shop, a 15-second trailer airs. The green screen is gone, replaced by a blue sky. On screen, you smile. Whether or not you read the last line aloud, the edit suite has laid a caption over your face. 'The past has all been settled.' Moon Gaeul’s knife stops mid-slice. Moon Hajun hunts for the remote, can’t find it, and pulls the TV’s plug. After a long while Moon Gaeul speaks. 'Settled, then. My husband too.' She peels your business card from beside her husband’s photo on the shelf and puts it in her apron pocket. 'It’s not that I’m hurt. I just don’t want the group to see it.' Moon Hajun asks, 'Are you really doing that?'",
      "memo": [
        "15-second trailer -- first aired in the evening news ad slot",
        "Caption: 'The past has all been settled'",
        "Moon Gaeul took your card off the shelf",
        "340 messages in the victims’ group chat -- within 1 hour"
      ],
      "choices": {
        "c13_market_deal": {
          "label": "Ask her to bear the trailer; the 212 are at stake"
        },
        "c13_market_correct": {
          "label": "File a formal request to pull the trailer caption"
        },
        "c13_market_stay": {
          "label": "No excuses; slice rice cakes beside her until closing"
        },
        "reframe": {
          "label": "Ask how panels ended"
        },
        "c13_market_evidence_turn": {
          "label": "Find the 3.8 billion cost code"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market",
      "clock": "Livestream D-3 · 20:00",
      "question": "Moon Gaeul took your card down from beside her husband’s photo. What do you do in this shop?",
      "lead": "You got a text that the trailer was airing and ran to the shop, but when you opened the door the ad had already begun."
    },
    "c13_lab": {
      "title": "The Real Script",
      "text": "Lee Minseo turns the laptop around and plays a 1-minute 'real script' your colleagues shot on their phones. Do Yoonha says, 'The 212 with no paperwork are still waiting.' Ban Jaewook opens his notebook. '47 names written. 0 names settled.' Kwon Dohyun holds up his calculator. 'A production budget of 1.1 billion won would cover their share. It’s a loss.' Na Junhyuk presses down a seal he spent three days carving. 'Unsettled.' Kang Taemin has one line. 'It’s not over.' Oh Jinwoo said he’d do it with no blown takes and got it on the fifth try, and Lee Minseo put all five after the end credits. The last shot is everyone’s voice. 'The past is not settled. That is why we are here.' Lee Minseo asks, 'Where are you going to use this?'",
      "memo": [
        "'Real script' video 1 minute 04 seconds -- shot on 7 phones",
        "Na Junhyuk’s new seal: 'Unsettled'",
        "Oh Jinwoo 5 blown takes -- included after the end credits",
        "The livestream cue sheet sits in the system of Lee Minseo’s old department"
      ],
      "choices": {
        "c13_lab_share": {
          "label": "Send the video to Moon Gaeul and the victims first"
        },
        "c13_lab_submit": {
          "label": "Formally submit it to the committee as a revised script"
        },
        "c13_lab_cue": {
          "label": "Secretly change the cue sheet so it airs live"
        },
        "reframe": {
          "label": "Ask how panels ended"
        },
        "c13_lab_evidence_turn": {
          "label": "Find the 3.8 billion cost code"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "Day before the livestream · 21:00",
      "question": "The 'real script' your colleagues shot on their phones is finished. Where do you use this video?",
      "lead": "The night before the livestream, the 4th-floor lights are still on. You go up and find everyone gathered around one laptop."
    },
    "c13_final": {
      "title": "The Teleprompter’s Last Line",
      "text": "On the monitor behind the set, the concurrent viewer count climbs. 40,000, 70,000, 110,000. Baek Arin hands you an earpiece. 'The last line stays. Read it, and the official letter confirming the 212 standard goes out at 9, and your colleagues return to their old posts on Monday.' Along the back wall of the studio, the Trigger Lab people stand like an audience. Kang Taemin beside the light stands he moved, Na Junhyuk clutching his 'Unsettled' seal. Moon Gaeul has not come. In the very back row, Moon Hajun, in his school uniform, holds a sketchbook to his chest. Director Bong Younghoon folds his fingers. Five, four, three. The first line comes up on the teleprompter.",
      "memo": [
        "110,000 concurrent livestream viewers",
        "If you read it: letter confirming the 212 standard sent at 21:00",
        "Colleagues’ return orders Monday -- the same day the Trigger Lab 4th floor is cleared",
        "Very back row of the audience: Moon Hajun in his school uniform"
      ],
      "choices": {
        "c13_final_terms": {
          "label": "Take the seat only if the last line is cut"
        },
        "c13_final_refuse": {
          "label": "Reveal the offer and price on camera; decline the seat"
        },
        "c13_final_rewrite": {
          "label": "Accept, then change the last line on air"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Ad studio in Seongsu-dong · Live set",
      "clock": "Livestream day · 19:59",
      "question": "110,000 people are watching live, and the teleprompter’s last line is unchanged. What do you say?",
      "lead": "When you step out of the van, the red 'On Air -- No Entry' light at the studio entrance is already on."
    },
    "c13_aftershock": {
      "title": "The Dark Set",
      "text": "12 minutes after the broadcast ends, the last thing you said starts circulating as a clip. Whatever you said, the top comments split in two. Teardown is in full swing. Kang Taemin carries out the four light stands by himself, and Director Bong Younghoon, who shot the ad, presses his card into the hand of Na Junhyuk, who lent a hand for the stamping scene. Moon Gaeul’s son Moon Hajun, from the very back row, opens his sketchbook. A drawing of tonight’s set, and under the last light, in small letters: 'to the end'. Alone at the monitor, Baek Arin is rewinding your last 8 seconds for the 11th time. Without turning around, she says, 'A new product launches next week. Its name has “Sangsaeng” in it. Shared growth. It’ll need a story too.'",
      "memo": [
        "Clip views: 900,000 in 3 hours",
        "Moon Hajun’s sketch: 'to the end'",
        "Baek Arin replays the last 8 seconds 11 times",
        "Launching next week: a new product named 'Sangsaeng'"
      ],
      "choices": {
        "c13_after_record": {
          "label": "Put every term and price of the offer in writing"
        },
        "c13_after_rush": {
          "label": "Dig straight into the next 'Sangsaeng' product"
        },
        "c13_after_warm": {
          "label": "Stay until the last stand is carried out tonight"
        }
      },
      "place": "Ad studio in Seongsu-dong · Set being struck",
      "clock": "Livestream day · 22:00",
      "question": "The clip is spreading, and Baek Arin brings up the next product. How do you close this night?"
    },
    "c13_script": {
      "title": "68% Trust",
      "text": "On a break, at the makeup mirror, Baek Arin flips through the script’s revision history on a tablet. The last line has changed 14 times. Version 1 was 'We will not forget the past.' 'It scored 41% trust with the focus group. They hear not forgetting as meaning it isn’t over yet. “Has been settled” scored 68%.' She caps her highlighter and adds, evenly, 'We’re not changing the facts. We’re choosing the sentence people will listen to the end.'",
      "memo": [
        "Last line revised 14 times",
        "Version 1 'We will not forget the past' -- 41% trust",
        "Current version 'has been settled' -- 68% trust"
      ],
      "choices": {
        "c13_script_choice_1": {
          "label": "Argue to go back to version 1: not forgetting"
        },
        "c13_script_choice_3": {
          "label": "68% is a winning line; leave the script as is"
        },
        "c13_script_choice_2": {
          "label": "Demand the focus group’s raw data"
        }
      },
      "place": "Ad studio in Seongsu-dong · Makeup room",
      "clock": "Shoot day · 15:00 break",
      "question": "Not forgetting scored 41%; settled scored 68%. Which number do you fight?"
    },
    "c13_rumor": {
      "title": "Whose Side Is the Bank Boy On",
      "text": "The next morning, Oh Jinwoo goes to Mangwon Market to buy rice cakes for the team and is cornered by three grannies outside a vegetable stall. 'Bank boy, is that ad yesterday for real?' Oh Jinwoo starts explaining, drawing the committee’s org chart in his phone’s notes. Chair, secretary, outside members, advisory panel. After about 3 minutes, the granny in the middle covers the screen with her palm. 'So whose side are you on?' Oh Jinwoo opens his mouth and closes it. This is a man who has never been lost for words in a contest. The granny slips two more sticks of garaetteok into his bag. 'Come back when you have an answer. I’ll take your money then.'",
      "memo": [
        "Victims’ group chat: 'betrayal' mentioned 27 times",
        "Reply from the No. 38 grandmother: 'He sliced rice cakes well enough'",
        "Oh Jinwoo stopped the org chart after 3 minutes"
      ],
      "choices": {
        "c13_rumor_choice_3": {
          "label": "Tell Oh Jinwoo to just buy rice cakes and get out"
        },
        "c13_rumor_choice_2": {
          "label": "Post an official statement in the group chat"
        },
        "c13_rumor_choice_1": {
          "label": "Explain the offer’s terms and price to them plainly"
        }
      },
      "place": "Mangwon Market · Outside a vegetable stall",
      "clock": "Livestream D-2 · Morning market",
      "question": "The market grannies ask 'So whose side are you on?' What do you answer in Oh Jinwoo’s place?"
    },
    "c13_offer": {
      "title": "The Secretary’s Coffee",
      "text": "At 11:40 at night, the elevator stops on the 4th floor. Baek Arin steps out with eight coffees. Oh Jinwoo accidentally posted the video as his status on the company messenger and took it down after 4 minutes, and in those 4 minutes she saw it. 'Well made. It’d be better if I edited it, though.' She sets out the coffees one by one and sits across from you. 'Here’s my offer. We put 20 seconds of this video into tomorrow’s livestream. In return, you read the last line as written.' A brief pause. 'A good story outlasts the facts. I do this job because I believe that. But this video, the facts beat the story. Inconveniently.'",
      "memo": [
        "Baek Arin’s offer: 20 seconds of video ↔ reading the last line",
        "Oh Jinwoo’s messenger slip -- exposed for 4 minutes",
        "8 coffees -- she knows exactly how many are still on the 4th floor that night"
      ],
      "choices": {
        "c13_offer_choice_2": {
          "label": "Ask her to put the offer in writing, not words"
        },
        "c13_offer_choice_3": {
          "label": "Accept the trade: 20 seconds for the last line"
        },
        "c13_offer_choice_1": {
          "label": "Counter: skip the 20 seconds, cut the last line"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Night",
      "clock": "Day before the livestream · 23:40",
      "question": "An offer to trade 20 seconds of video for the last line arrives with coffee. How do you answer?"
    },
    "c13_script_reaction": {
      "title": "Hand Model",
      "text": "In the parking lot outside the set, Na Junhyuk waves a business card. Director Bong Younghoon gave it to him. 'He wants an exclusive contract as a stamping model. Only my hands are on screen, and the fee is a month of my salary. When I retire I can live off my hands.' Kang Taemin laughs, and Oh Jinwoo silently looks down at his own hands. Na Junhyuk takes a sip of instant coffee and pockets the card. 'But you know, of all the loans I stamped with these hands over 30 years, not one was ever settled. Paid off, couldn’t pay, or still paying. Those three, that’s all.'",
      "memo": [
        "Exclusive stamping-model offer -- fee is a month’s salary",
        "Paid off, couldn’t pay, or still paying"
      ],
      "choices": {
        "c13_script_reaction_choice_3": {
          "label": "Laugh it off today and buy another coffee"
        },
        "c13_script_reaction_choice_2": {
          "label": "Have him check the cameo contract’s image rights"
        },
        "c13_script_reaction_choice_1": {
          "label": "Write down his three as alternative script lines"
        }
      },
      "place": "Seongsu-dong side street · Studio parking lot",
      "clock": "Shoot day · 19:00",
      "question": "Na Junhyuk says that in 30 years, not one loan was ever settled. How do you take that?"
    },
    "c13_rumor_reaction": {
      "title": "The Return List",
      "text": "11 at night, the Trigger Lab rooftop. Han Seoyun shows you an email from Human Resources. 'List of staff returning to regular departments.' Lee Minseo, Do Yoonha, Oh Jinwoo, Ban Jaewook. Na Junhyuk and Kang Taemin, on loan, go back to their original posts. Nowhere on the list is Han Seoyun’s name, and nowhere is the department name Trigger Lab. 'Of course. Return is a word for people who have somewhere to go back to. This place is being shut down.' She rests her arms on the railing. 'Everyone will be happy. They’re getting out of the basement after 3 years. I should be happy too.'",
      "memo": [
        "Two names missing from the return list: Han Seoyun, Trigger Lab",
        "A word for people who have somewhere to go back to"
      ],
      "choices": {
        "c13_rumor_reaction_choice_1": {
          "label": "Tell the others what the list means, with Han Seoyun"
        },
        "c13_rumor_reaction_choice_2": {
          "label": "Formally ask HR for the documents behind the list"
        },
        "c13_rumor_reaction_choice_3": {
          "label": "Put off the list until after the livestream"
        }
      },
      "place": "Trigger Lab rooftop",
      "clock": "Livestream D-2 · 23:00",
      "question": "Han Seoyun and Trigger Lab are missing from the return list. What do you do with it?"
    },
    "c13_offer_reaction": {
      "title": "A Text at 1 a.m.",
      "text": "At 1:10 a.m., as you rinse cups in the pantry, a text arrives. It is Moon Gaeul. 'Hajun showed me the video. It was nice to see the people who sliced rice cakes. Kang Taemin talks even worse than he pounds rice.' A moment later, one more line. 'Whatever you say tomorrow, I’ll decide after that whether to put your card back up. My husband would have trusted you once more. I’m a little less kind than he was.' In the reply box, the cursor blinks for a long time.",
      "memo": [
        "'Whether to put the card back up, after that'",
        "A little less kind than her husband"
      ],
      "choices": {
        "c13_offer_reaction_choice_3": {
          "label": "Decide to reply after the livestream"
        },
        "c13_offer_reaction_choice_1": {
          "label": "Ask Moon Gaeul to sit in the audience tomorrow"
        },
        "c13_offer_reaction_choice_2": {
          "label": "Clip her text to the end of tomorrow’s remarks"
        }
      },
      "place": "Trigger Lab, 4th floor · Pantry",
      "clock": "Livestream day · 01:10",
      "question": "She texts that she’ll decide after tomorrow whether to put your card back. How do you answer?"
    },
    "c13_branch_extras": {
      "title": "The Extras’ Waiting Room",
      "text": "In the studio’s basement waiting room, eight extras are eating boxed lunches. The role is 'small business owner back on their feet after compensation', paying 80,000 won a day. At the bottom of the casting sheet on the wall is small print. 'Real victims may not be cast -- image risk.' Kang Taemin stops in the doorway. In the corner, someone drops his chopsticks. Kwak Minjae, a junior who worked the FlowOn night shift with him for 3 years and left in last year’s cuts. 'Hyung, I’m playing a business owner today. No lines. I just have to smile.' He smiles, then lowers his voice. 'But hyung, can someone like me really get compensation?'",
      "memo": [
        "8 extras -- role: 'small business owner back on their feet after compensation'",
        "Casting sheet: 'Real victims may not be cast'",
        "Kwak Minjae: FlowOn night shift 3 years, cut last year",
        "80,000 won a day, minus a 20% agency fee"
      ],
      "choices": {
        "c13_branch_extras_tell": {
          "label": "Tell Kwak Minjae and the extras what this ad really is"
        },
        "c13_branch_extras_quiet": {
          "label": "They need today’s pay; look away and let them finish"
        },
        "c13_branch_extras_sheet": {
          "label": "Secure the original 'no real victims' casting sheet"
        }
      },
      "place": "Ad studio in Seongsu-dong · Extras’ waiting room",
      "clock": "Shoot day · Lunchtime",
      "question": "Among the extras playing victims is a junior from the night shift. What do you do in this waiting room?"
    },
    "c13_branch_extras_follow": {
      "title": "80,000 Won a Day",
      "text": "In the afternoon, after the extras wrap first, the studio parking lot. Kwak Minjae shows you his payment text. 80,000 won minus the fee: 64,000 won. 'I’ve done six bank ads. Always the customer beaming after a loan consultation. I’ve never once smiled at a real bank.' Kang Taemin buys two canned coffees and hands him one. Neither speaks for a long while. Opening his can, Kwak Minjae says, 'The guys still at the center say robots are coming at year-end. A hundred-some of them. They say the money comes from KD too.' Kang Taemin tightens his grip on the can. The aluminum crumples.",
      "memo": [
        "Paid 64,000 won -- 20% fee",
        "6 bank ads as an extra, every role a 'smiling customer'",
        "Fulfillment center rumor: logistics robots at year-end",
        "Funding: only talk that it’s a KD affiliate"
      ],
      "choices": {
        "c13_branch_extras_follow_fee": {
          "label": "Formally ask the agency for casting rules and fees"
        },
        "c13_branch_extras_follow_invite": {
          "label": "Invite Kwak Minjae to the live audience by name"
        },
        "c13_branch_extras_follow_later": {
          "label": "Robots can wait; just take his number"
        }
      },
      "place": "Ad studio in Seongsu-dong · Parking lot",
      "clock": "Shoot day · 14:00",
      "question": "Paid 64,000 won for the day, Kwak Minjae passes on the robot rumor. What do you do for him?"
    },
    "c13_route_system": {
      "title": "The Life of a Committee",
      "text": "Instead of one box on a contract, you line up how the committees set up after scandals ended. ECHO scans the last 15 years. 23 innovation and reform committees created by Korean financial companies after scandals open in a row. Average lifespan: 14 months. Of the 186 recommendations from outside members, 17 were carried through to the end. Committee advertising averaged 3.4 times operating costs, and the most common last line of a first ad was 'We will be reborn,' the second 'Settling the past'. 'Committees have been learned as cheaper than an apology and longer-lasting. With a face attached, they last longer still.'",
      "memo": [
        "23 committees, average lifespan 14 months",
        "17 of 186 outside recommendations implemented",
        "Advertising = 3.4 times operating costs"
      ],
      "choices": {
        "c13_route_system_drop": {
          "label": "Bury the numbers and keep the shoot schedule"
        },
        "c13_route_system_publish": {
          "label": "Publish the 23 committees’ rates before the livestream"
        },
        "c13_route_system_clause": {
          "label": "Add a clause: report progress every quarter"
        },
        "c13_route_system_evidence_turn": {
          "label": "Find the 3.8 billion cost code"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "Livestream D-5",
      "question": "Of the 23 committees’ 186 recommendations, only 17 went the distance. What do you do with this statistic?"
    },
    "c13_final_system_route": {
      "title": "The 24th Committee",
      "text": "A little over 15 hours to the livestream, ECHO has stacked the last lines of the 23 committees’ first ads in a column. The bottom box is empty, and the line you read this evening goes there. ECHO places one number beside the blank. 'The average is 14 months. For this committee to last longer, at least one thing must remain after the ads end. A face does not count.'",
      "memo": [
        "Last lines of the 23 committees’ first ads -- bottom box blank",
        "Average lifespan 14 months, 17 recommendations implemented",
        "Livestream: today at 20:00"
      ],
      "choices": {
        "c13_final_system_route_a": {
          "label": "Demand a clause publishing reasons for any rejection"
        },
        "c13_final_system_route_c": {
          "label": "Seat a monitor elected by the victims, outside it"
        },
        "c13_final_system_route_b": {
          "label": "No clause; just raise your fee"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "Livestream day · Dawn",
      "question": "Tonight’s line fills the blank in the list. What do you add that will remain after the ads end?"
    },
    "c13_evidence_turn": {
      "title": "The Budget’s Number",
      "text": "Follow the account number stamped on the clue, and the Innovation Committee’s budget opens. 3.8 billion won in total. Ad production 1.1 billion, broadcast ads 1.9 billion, member activity 800 million. Kwon Dohyun searches the group general ledger for cost code SP-0412. One more line turns up under the same code. 'Trigger Lab wind-down costs -- staff redeployment, equipment return, 4th-floor restoration.' He puts down the calculator. 'Every colleague back to a regular department. That’s not a price, it’s the closure bill. One budget shoots the ad and clears out our room.' He taps the end of the code with his fingernail. 'And these four digits, we all know this number.'",
      "memo": [
        "Innovation Committee budget 3.8 billion won -- cost code SP-0412",
        "Same code: Trigger Lab wind-down costs",
        "Last four digits of the code = loan number 2023-0412"
      ],
      "choices": {
        "c13_evidence_turn_tell": {
          "label": "Tell the colleagues awaiting transfer orders first"
        },
        "c13_evidence_turn_confront": {
          "label": "Put the code before Baek Arin; renegotiate the price"
        },
        "c13_evidence_turn_hold": {
          "label": "Keep the code; bring it out at the first meeting"
        }
      },
      "place": "Trigger Lab archive (B2) · General ledger",
      "clock": "Livestream day · 07:00",
      "question": "The committee budget and Trigger Lab’s wind-down costs share one code. How do you use this number?"
    },
    "c13_start_warm": {
      "title": "An Offer That Smells of Rice Cakes",
      "text": "The morning after pulling down the shop shutter, you go up to the 33rd floor in a jacket still smelling of sesame oil. Yoon Sanghyuk, who wanted to talk about the signature field, hands you a 'KD Innovation Committee' plan instead. A public outside member and the face of the ads, on condition that the dissent writer says 'the past is settled'. The price: the standard for the 212 confirmed and every Trigger Lab colleague back in a regular department. Baek Arin, Deputy Manager of the Group Strategy Office, standing by the window, holds out a performance contract. 'We shoot tomorrow and go live in six days.' Kang Taemin, waiting in the lobby, texts you. 'The people who got rice cakes yesterday are outside the shop again today.'",
      "memo": [
        "Yesterday 1,021 boxes of rice cakes -- every member",
        "Offer: face of the Innovation Committee ads",
        "Price: standard for the 212 + every colleague returned"
      ],
      "choices": {
        "c13_start_warm_accept": {
          "label": "Fix the price first and accept on the spot"
        },
        "c13_start_warm_colleagues": {
          "label": "Tell your colleagues the offer and its price first"
        },
        "c13_start_warm_read": {
          "label": "Check the committee plan against the contract"
        },
        "c13_start_warm_signature": {
          "label": "Hold your answer; ask the rice cake people first"
        },
        "c13_start_warm_reframe": {
          "label": "Ask how panels ended"
        }
      },
      "place": "KD Financial Group headquarters, 33rd floor · Group Strategy Office",
      "clock": "Early October · Launch livestream D-6",
      "question": "The people who got rice cakes yesterday are outside the shop again today. How do you answer this offer?",
      "lead": "You left the shop after pulling down the shutter at midnight, and at 9 a.m. the 33rd-floor executive office called."
    },
    "c13_start_record": {
      "title": "The Revision Turned Prop",
      "text": "You take the revised compensation standard covering the 212 up to the 33rd floor. When the door opens, a stranger has already printed that document and highlighted it. Baek Arin, Deputy Manager, Group Strategy Office. 'Nicely written. Let’s make it the Innovation Committee’s agenda item No. 1. And announce it with an ad.' Yoon Sanghyuk adds the condition. In the ad, you, the dissent writer, say 'the past is settled'. The price: the revision confirmed and every Trigger Lab colleague back in a regular department. Baek Arin lays a performance contract on top. 'We shoot tomorrow and go live in six days.' Your document is No. 3 on the shoot’s prop list.",
      "memo": [
        "Revised compensation standard -- No. 3 on the prop list",
        "Planned as Innovation Committee agenda item No. 1",
        "Condition: one sentence, 'the past is settled'"
      ],
      "choices": {
        "c13_start_record_colleagues": {
          "label": "Tell your colleagues the offer and its price first"
        },
        "c13_start_record_read": {
          "label": "Check the committee plan against the contract"
        },
        "c13_start_record_accept": {
          "label": "Fix the price first and accept on the spot"
        },
        "c13_start_record_signature": {
          "label": "Get the revision an official agenda number, not a prop"
        },
        "c13_start_record_reframe": {
          "label": "Ask how panels ended"
        }
      },
      "place": "KD Financial Group headquarters, 33rd floor · Group Strategy Office",
      "clock": "Early October · Launch livestream D-6",
      "question": "The revision you wrote is on the ad’s prop list. How do you take that document back?",
      "lead": "You brought the revision you worked on all night in a document envelope, but the same document is already lying on the 33rd-floor meeting table."
    },
    "c13_start_rush": {
      "title": "The One with the Rice Cake Box",
      "text": "You walk onto the 33rd floor still holding the last box of rice cakes. Yoon Sanghyuk lifts the lid and takes a songpyeon. 'Mrs. Moon’s rice cakes. She steams them well.' The signature field doesn’t come up. Baek Arin, Deputy Manager of the Group Strategy Office, standing by the window, photographs the box with her phone. 'Nice shot. Let’s put it in the ad.' The offer is to be the face of the 'KD Innovation Committee' ads. If the dissent writer says 'the past is settled', the standard for the 212 is confirmed and every Trigger Lab colleague returns to a regular department. Baek Arin holds out a performance contract. 'We shoot tomorrow and go live in six days.' The box that was Moon Sungho’s share has already become a scene in someone’s ad.",
      "memo": [
        "Photo of the rice cake box -- 1 frame in the ad draft",
        "Yoon Sanghyuk ate 1 songpyeon",
        "Price: standard for the 212 + every colleague returned"
      ],
      "choices": {
        "c13_start_rush_colleagues": {
          "label": "Tell your colleagues the offer and its price first"
        },
        "c13_start_rush_read": {
          "label": "Check the committee plan against the contract"
        },
        "c13_start_rush_accept": {
          "label": "Fix the price first and accept on the spot"
        },
        "c13_start_rush_signature": {
          "label": "Insist the box photo stays out of the ad"
        },
        "c13_start_rush_reframe": {
          "label": "Ask how panels ended"
        }
      },
      "place": "KD Financial Group headquarters, 33rd floor · Group Strategy Office",
      "clock": "Payment day night · Launch livestream D-7",
      "question": "The box that was Moon Sungho’s share is about to become an ad draft. What do you nail down here?",
      "lead": "On the 33rd floor, having left the line outside the shop, you are still holding the box the lobby guard took a rice cake from."
    }
  },
  "echoReplies": {
    "c13_start_colleagues": "You tell them, and applause breaks out in the pantry first. A transfer above ground after 3 years. You may be the one who has to cut that applause short.",
    "c13_start_read": "Reading it, you spot Article 11 of the contract. 'For 1 year after the broadcast, the performer makes no public statement that differs from the campaign.' Finding that one line takes a whole day.",
    "c13_start_accept": "You accept, and Baek Arin sends the shoot schedule at once. The standard for the 212 is still written as 'to be confirmed'.",
    "c13_studio_meet": "You stop the shoot; Director Bong Younghoon sighs and the lights cool. Behind the waiting-room door, the 'victims' in this ad are eating boxed lunches.",
    "c13_studio_basis": "You demand it in writing, and Baek Arin sends the revision history file. The basis is not fact but survey results.",
    "c13_studio_read": "You read it, and the take is done in one. The edit suite takes your voice before it takes your request.",
    "c13_market_stay": "As you slice, Moon Gaeul corrects your grip on the knife once. The card is still in her apron pocket.",
    "c13_market_correct": "The request is logged. Meanwhile the trailer airs four more times tonight alone.",
    "c13_market_deal": "Hearing the request, Moon Gaeul slices once more. 'Which of those 212 asked you to bear it for them?'",
    "c13_lab_share": "You send it; the group chat goes quiet for a long time, then rice cake emojis appear one by one. The group will see this video soon too.",
    "c13_lab_submit": "You submit it and get a filing number. The committee’s first meeting is 3 weeks after the livestream.",
    "c13_lab_cue": "You change it, and Lee Minseo’s old account shows up in the dawn access log. 3 years ago, it was an access log that made her the leaker. The secretary checks the cue sheet once more an hour before air.",
    "c13_final_terms": "You set your condition, and Baek Arin calls the 33rd floor over the earpiece. The broadcast starts 3 minutes late, and the letter for the 212 is delayed just as long.",
    "c13_final_refuse": "You decline, and 110,000 people hear the price too. The 212 standard and your colleagues’ return orders appear in no official letter tonight.",
    "c13_final_rewrite": "You change the line, and for the first time the teleprompter and your mouth say different things. Baek Arin does not cut those 3 seconds. Article 11 of the contract arrives tomorrow morning.",
    "c13_after_warm": "Once the last stand is on the truck, Kang Taemin buys eight cup noodles. Baek Arin’s 'Sangsaeng' waits until tomorrow.",
    "c13_after_record": "In writing, the 33rd-floor offer gets dates and sentences too. Even the empty signature field is recorded.",
    "c13_after_rush": "Digging straight in, you find a folder called 'Sangsaeng ESG' on a KD Asset Management server. The colleagues left on set carry the stands without you.",
    "c13_script_choice_1": "When you argue, Baek Arin delays her answer for the first time. 'If we go with 41%, who makes up those 27%?'",
    "c13_script_choice_2": "The raw data shows that of the 120 participants, 0 were victims. Whom to show that to, you don’t know yet.",
    "c13_script_choice_3": "The script stays. 68% of people listen to the end, and the 1,740 will hear that sentence to the end too.",
    "c13_rumor_choice_1": "Hearing it plainly, the grannies do the math for a long while. The 212, your colleagues’ jobs, and your face. One says, 'That’s not a profitable deal.'",
    "c13_rumor_choice_2": "The statement is accurate. Among the 340 messages in the chat, that accuracy is quickly pushed up out of sight.",
    "c13_rumor_choice_3": "Oh Jinwoo comes back with two sticks of garaetteok. The grannies’ question stays in the market.",
    "c13_offer_choice_1": "Hearing your counter, Baek Arin sets down her coffee. 'That’s beyond my authority.' Then, after a long while, 'I’ll ask.'",
    "c13_offer_choice_2": "When you ask for it in writing, Baek Arin laughs. 'Spoken like the dissent writer.' An email comes at 1 a.m. The signature field is blank.",
    "c13_offer_choice_3": "You accept, and the 20 seconds go into the cut. Right after those 20 seconds, the teleprompter still shows 'The past has all been settled.' The one standing before that line is tomorrow’s you.",
    "c13_script_reaction_choice_1": "As you write it down, Na Junhyuk says shyly that 'copyright belongs to the Yeongdong Branch'. Whether that sentence can air, you don’t know.",
    "c13_script_reaction_choice_2": "The contract says image use is 'indefinite'. Na Junhyuk’s hands will keep stamping in KD ads after he retires.",
    "c13_script_reaction_choice_3": "The coffee is sweet and the evening short. Na Junhyuk’s three scatter in the parking lot wind.",
    "c13_rumor_reaction_choice_1": "You tell them, and the pantry goes quiet. Lee Minseo is the first to say 'I want to stay here,' and no one can answer.",
    "c13_rumor_reaction_choice_2": "You ask, and HR replies 'under review' three days later. The livestream comes before that.",
    "c13_rumor_reaction_choice_3": "You put it off, and your colleagues wait for their return until the day of the livestream. Only Han Seoyun knows how that wait ends.",
    "c13_offer_reaction_choice_1": "You ask, and the reply comes much later. 'I have to open the shop. I’ll send Hajun.' The answer is half no, half yes.",
    "c13_offer_reaction_choice_2": "Only you see the text clipped to your remarks. Whether to read it, you have to decide in front of the camera.",
    "c13_offer_reaction_choice_3": "Moon Gaeul checks her silent phone twice and turns off the light.",
    "c13_branch_extras_tell": "You tell them, and two of the eight close their lunch boxes and stand. The other six need today’s pay. Kwak Minjae stays too.",
    "c13_branch_extras_sheet": "You photograph the original, and an agency staffer pulls the paper off the wall. The photo stays, and that staffer writes an incident report tonight.",
    "c13_branch_extras_quiet": "The shoot wraps. Kwak Minjae smiles 11 times without a line and becomes the ad’s 'boss back on his feet'.",
    "c13_branch_extras_follow_invite": "When you invite him, Kwak Minjae hesitates a long time, then asks. 'Hyung, do I not have to smile that day?'",
    "c13_branch_extras_follow_fee": "The statement shows 20% of each day’s pay goes back to a group-affiliated ad agency. Kwak Minjae’s 64,000 won stays what it is.",
    "c13_branch_extras_follow_later": "His number is saved. Kang Taemin doesn’t throw away the crumpled can; he puts it in his vest pocket.",
    "c13_route_system_publish": "You publish it, and two articles follow. Baek Arin reads them and cuts one word from the script. 'All'.",
    "c13_route_system_clause": "With the clause in, the committee must report numbers every quarter. The first numbers take three months to come out.",
    "c13_route_system_drop": "The schedule holds. Your committee is added to ECHO’s table as row 24.",
    "c13_final_system_route_a": "With that clause, the committee’s 'no' comes with sentences too. The group opposes that clause the longest.",
    "c13_final_system_route_b": "Your fee doubles. In ECHO’s table, your committee tilts toward the average lifespan of 14 months.",
    "c13_final_system_route_c": "With the seat created, Moon Gaeul is the first nominee. She says 'I can only come on days the shop is closed.'",
    "c13_evidence_turn_confront": "Seeing the code, Baek Arin puts down her tablet. It is the face of someone seeing a document with no revision history for the first time.",
    "c13_evidence_turn_hold": "Over the 3 weeks of waiting, the 4th floor’s equipment return list grows page by page.",
    "c13_evidence_turn_tell": "You tell them, and Lee Minseo quietly feeds her return application into the shredder. Do Yoonha can’t, and holds his for a long time.",
    "c13_studio_evidence_turn": "Search the code, and where the ad money comes from comes up. What that money also pays to clear away is on the same line.",
    "c13_market_evidence_turn": "Search the code, and where the ad money comes from comes up. What that money also pays to clear away is on the same line.",
    "c13_lab_evidence_turn": "Search the code, and where the ad money comes from comes up. What that money also pays to clear away is on the same line.",
    "c13_route_system_evidence_turn": "Search the code, and where the ad money comes from comes up. What that money also pays to clear away is on the same line.",
    "case13_memory_system": "Look closely, and the words from your hand survive only in the plan’s title. Under it, ECHO adds the 23 committees set up after scandals.",
    "case13_memory_evidence": "Attach the advertising account to the budget, and one cost code appears twice. Once for the ad, once for the work to clear out the 4th floor.",
    "c13_start_warm_colleagues": "You tell them, and applause breaks out in the pantry first. A transfer above ground after 3 years. You may be the one who has to cut that applause short.",
    "c13_start_warm_read": "Reading it, you spot Article 11 of the contract. 'For 1 year after the broadcast, the performer makes no public statement that differs from the campaign.' Finding that one line takes a whole day.",
    "c13_start_warm_accept": "You accept, and Baek Arin sends the shoot schedule at once. The standard for the 212 is still written as 'to be confirmed'.",
    "c13_start_warm_signature": "You hold your answer, and Yoon Sanghyuk checks his watch for the first time. The people outside the shop ask back, 'Why are you asking us that?'",
    "c13_start_record_colleagues": "You tell them, and applause breaks out in the pantry first. A transfer above ground after 3 years. You may be the one who has to cut that applause short.",
    "c13_start_record_read": "Reading it, you spot Article 11 of the contract. 'For 1 year after the broadcast, the performer makes no public statement that differs from the campaign.' Finding that one line takes a whole day.",
    "c13_start_record_accept": "You accept, and Baek Arin sends the shoot schedule at once. The standard for the 212 is still written as 'to be confirmed'.",
    "c13_start_record_signature": "With an agenda number, the document comes off the prop list. Baek Arin prints a fresh copy of it and uses that as the prop instead.",
    "c13_start_rush_colleagues": "You tell them, and applause breaks out in the pantry first. A transfer above ground after 3 years. You may be the one who has to cut that applause short.",
    "c13_start_rush_read": "Reading it, you spot Article 11 of the contract. 'For 1 year after the broadcast, the performer makes no public statement that differs from the campaign.' Finding that one line takes a whole day.",
    "c13_start_rush_accept": "You accept, and Baek Arin sends the shoot schedule at once. The standard for the 212 is still written as 'to be confirmed'.",
    "c13_start_rush_signature": "You nail it down, and Baek Arin deletes the photo. In front of you, she empties the trash too. Whether it remains on another device, you don’t know."
  },
  "choiceVoiceLines": {
    "c13_start_colleagues": "Saying their jobs are at stake, you tell your colleagues the offer first, price and all.",
    "c13_start_read": "Because you need to know what you give up for one sentence, you read the committee plan and the performance contract line by line.",
    "c13_start_accept": "Saying one sentence is cheap if it confirms the 212 standard, you get the price confirmed first and accept on the spot.",
    "c13_studio_meet": "Saying you need to know whose story you are reading, you stop the shoot and meet the people in this ad first.",
    "c13_studio_basis": "Saying whoever wrote “settled” must give the basis, you demand a written answer on what the last line is based on.",
    "c13_studio_read": "Since you can’t stop the set on take 18, you read it for now and ask them to cut it in the edit.",
    "c13_market_stay": "Since no words can put back a card taken down, you offer no excuses and slice rice cakes beside Moon Gaeul until the shutter comes down.",
    "c13_market_correct": "Since the edit suite laid that sentence over your face, you file a formal correction request to pull the trailer caption.",
    "c13_market_deal": "Even seeing the card taken down, you can’t back off, so you ask her to bear the trailer because the 212’s compensation is at stake.",
    "c13_lab_share": "So the one who took down your card doesn’t find out from a broadcast, you send the video to Moon Gaeul and the victims’ group first.",
    "c13_lab_submit": "Saying a video played in secret gets written off as an accident, you formally submit it to the committee as a revised script.",
    "c13_lab_cue": "Saying it is 1 minute that would be cut if you asked permission, you secretly change the cue sheet so the video airs during the livestream.",
    "c13_final_terms": "Saying you will protect the 212 but cannot say those words, you accept the seat only on condition that the last line is cut.",
    "c13_final_refuse": "Since this is no deal to hide in front of 110,000 people, you reveal the offer and its price on camera and decline the seat.",
    "c13_final_rewrite": "Saying the words “not settled” must come from your own mouth, you take the seat and change the last line on air.",
    "c13_after_warm": "So Kang Taemin doesn’t carry it all alone, you stay with your colleagues tonight until the last stand is carried out.",
    "c13_after_record": "Saying the clip may be cut but the deal must remain, you put every term and price of the offer in writing.",
    "c13_after_rush": "Before the next story gets written, you dig straight into the next product with 'Sangsaeng' in its name.",
    "c13_script_choice_1": "Saying 41% or not, that one is the truth, you argue with Baek Arin to go back to version 1, the line about not forgetting.",
    "c13_script_choice_2": "To see how the number came about first, you demand the focus group’s raw data.",
    "c13_script_choice_3": "Saying compensation reaches people only if they listen to the end, you call 68% a winning line and leave the script as it is.",
    "c13_rumor_choice_1": "Saying an org chart is no answer, you explain the offer’s terms and price to the grannies just as they are.",
    "c13_rumor_choice_2": "Before the rumor goes around the whole market, you post an official statement in the victims’ group chat.",
    "c13_rumor_choice_3": "Saying talking without an answer only tangles things more, you tell Oh Jinwoo to just buy the rice cakes and get out today.",
    "c13_offer_choice_1": "Saying she was the one who said the facts beat the story, you counter Baek Arin: drop the 20 seconds and cut the last line.",
    "c13_offer_choice_2": "Saying an 11:40 p.m. promise vanishes by morning, you ask her to put the offer in writing, not words.",
    "c13_offer_choice_3": "Since even a piece of the 'real script' could air live, you accept the trade of 20 seconds of video for the last line.",
    "c13_script_reaction_choice_1": "Saying it is more accurate than “settled”, you write down Na Junhyuk’s three as alternative lines for the script.",
    "c13_script_reaction_choice_2": "Saying no one knows how far the ad will use him, you have him check the image rights in the cameo contract first.",
    "c13_script_reaction_choice_3": "Not yet ready to take those words on, you laugh it off today and buy another coffee.",
    "c13_rumor_reaction_choice_1": "Saying they need to know before they celebrate, you and Han Seoyun tell your colleagues what the list means first.",
    "c13_rumor_reaction_choice_2": "So a department’s closure doesn’t end with one email, you formally ask HR for the documents behind the return list.",
    "c13_rumor_reaction_choice_3": "Since you can’t shake colleagues awaiting their return before the livestream, you put off the list until after the broadcast.",
    "c13_offer_reaction_choice_1": "So she can see for herself whether to trust you once more, you ask Moon Gaeul to sit in the audience at tomorrow’s livestream.",
    "c13_offer_reaction_choice_2": "So you can look at it if you waver at the teleprompter, you clip Moon Gaeul’s text to the end of tomorrow’s remarks.",
    "c13_offer_reaction_choice_3": "Since you can’t yet promise what you will say, you decide to reply after the livestream.",
    "c13_branch_extras_tell": "Saying they have a right to know before they smile, you tell Kwak Minjae and the extras what this ad is first.",
    "c13_branch_extras_sheet": "Saying they will deny anything said aloud later, you secure the original casting sheet that reads 'Real victims may not be cast'.",
    "c13_branch_extras_quiet": "Since you can’t cut off eight people’s day’s earnings, you look away and let them finish the shoot so they get today’s pay.",
    "c13_branch_extras_follow_invite": "Saying he should have a seat as himself, not a role, you invite Kwak Minjae to the livestream audience under his own name.",
    "c13_branch_extras_follow_fee": "Saying the reason it became 64,000 won should be on paper, you formally ask the agency for its casting rules and a fee statement.",
    "c13_branch_extras_follow_later": "With the livestream right around the corner, you put off the robot rumor and just take his number.",
    "c13_route_system_publish": "Saying viewers should know what they’re watching too, you publish the 23 committees’ implementation rates before the livestream.",
    "c13_route_system_clause": "So it doesn’t follow the precedent that ended at 17, you add a clause to your terms requiring quarterly disclosure of whether recommendations are implemented.",
    "c13_route_system_drop": "Saying it is enough to be different from the 23 before, you bury the numbers and keep the shoot schedule.",
    "c13_final_system_route_a": "So nothing gets buried without a sound, you demand a clause requiring the reasons to be published whenever a recommendation is rejected.",
    "c13_final_system_route_b": "Saying the livestream is at eight tonight with no time to fight over clauses, you skip the clause and just raise your fee.",
    "c13_final_system_route_c": "Saying there must be eyes that stay instead of a face, you create a monitor’s seat outside the committee, elected by the victims’ group.",
    "c13_evidence_turn_confront": "Saying what you agreed to was not a price, you put the budget code before Baek Arin before the livestream and renegotiate the price.",
    "c13_evidence_turn_hold": "To use it where it stays in the minutes, you keep the code to yourself and bring it out on the day of the committee’s first meeting.",
    "c13_evidence_turn_tell": "Saying the people involved should know their return is the closure bill, you tell the colleagues awaiting transfer orders first.",
    "c13_studio_evidence_turn": "You slot the clue into each line of the Innovation Committee’s budget and find where else the code on the 3.8 billion won was used.",
    "c13_market_evidence_turn": "You slot the clue into each line of the Innovation Committee’s budget and find where else the code on the 3.8 billion won was used.",
    "c13_lab_evidence_turn": "You slot the clue into each line of the Innovation Committee’s budget and find where else the code on the 3.8 billion won was used.",
    "c13_route_system_evidence_turn": "You slot the clue into each line of the Innovation Committee’s budget and find where else the code on the 3.8 billion won was used.",
    "c13_start_warm_colleagues": "Saying their jobs are at stake, you tell your colleagues the offer first, price and all.",
    "c13_start_warm_read": "Because you need to know what you give up for one sentence, you read the committee plan and the performance contract line by line.",
    "c13_start_warm_accept": "Saying one sentence is cheap if it confirms the 212 standard, you get the price confirmed first and accept on the spot.",
    "c13_start_warm_signature": "Saying 'settled' is for those people to say, you hold your answer until you have asked the people who got rice cakes.",
    "c13_start_record_colleagues": "Saying their jobs are at stake, you tell your colleagues the offer first, price and all.",
    "c13_start_record_read": "Because you need to know what you give up for one sentence, you read the committee plan and the performance contract line by line.",
    "c13_start_record_accept": "Saying one sentence is cheap if it confirms the 212 standard, you get the price confirmed first and accept on the spot.",
    "c13_start_record_signature": "Saying the document must outlast the shoot, you first get the revision an official committee agenda number instead of a place among the props.",
    "c13_start_rush_colleagues": "Saying their jobs are at stake, you tell your colleagues the offer first, price and all.",
    "c13_start_rush_read": "Because you need to know what you give up for one sentence, you read the committee plan and the performance contract line by line.",
    "c13_start_rush_accept": "Saying one sentence is cheap if it confirms the 212 standard, you get the price confirmed first and accept on the spot.",
    "c13_start_rush_signature": "Saying the box was Moon Sungho’s share, you insist on the spot that the photo of it stays out of the ad."
  },
  "pack": {
    "clue": {
      "title": "The Budget’s Number",
      "text": "The Innovation Committee’s 3.8 billion won budget and Trigger Lab’s wind-down costs use the same cost code, SP-0412. The code’s last four digits match the loan number from 3 years ago."
    },
    "outcomes": {
      "c13_after_warm": {
        "tag": "Carried the Stands",
        "title": "You stayed on set with your colleagues until every light was off",
        "text": "The night the livestream ended, four stands and eight cup noodles were left. Whatever you said, you rode the same truck as the people who heard it."
      },
      "c13_after_record": {
        "tag": "Offer on Record",
        "title": "The 33rd-floor offer became a document, empty signature field and all",
        "text": "The date, terms and price of the offer are on record. Anyone can now read what the committee tried to buy with your face."
      },
      "c13_after_rush": {
        "tag": "Dug Ahead",
        "title": "You went after the next product, named 'Sangsaeng', first",
        "text": "Before the set had cooled, you opened the 'Sangsaeng ESG' folder. You found the next fight first, and tonight you weren’t beside your colleagues."
      }
    },
    "continuityChallenges": {
      "c12_after_feast": {
        "title": "Stand Before the People Who Got Rice Cakes",
        "text": "The 1,021 who got rice cakes yesterday will soon see your face in the ad. Trust remains with the card that lets you hold your head up before them."
      },
      "c12_after_fund": {
        "title": "Take Back the Revision Turned Prop",
        "text": "The document you wrote for the 212 is on the ad’s prop list. Who owns that document only shows once you reframe the table."
      },
      "c12_after_meet": {
        "title": "Set Right the Rice Cake Box Turned Ad Draft",
        "text": "On the 33rd floor you went up to first, the box that was Moon Sungho’s share became an ad draft. The card that hides nothing from the victims about how that scene was used restores fairness."
      }
    }
  }
};
