/**
 * 프롤로그 04 (src/nodes/prologue04.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "p4_start": {
      "title": "Post-Sale Review",
      "text": "KD Bank, Gangseo Branch. A single sheet sent down from head office lies in front of you. Its title is 'Post-Sale Suitability Review'. Your name is in the assignee box; the reviewer box beside it is empty. The work you did in the credit review office until last week has gone to someone else. Open the door to the banking hall, and the first thing you see, before any customer, is the sales board on the wall. This week’s six windows are listed down the side, each with a number beside it. In 2nd place is Window 4. Its name box reads 'Do Yoonha', and under it are two top-seller stickers. Branch Manager Bae Seungho holds out a paper cup and smiles. 'Head office sent you to review us? This branch hasn’t had a single complaint. Take your time.' He points at the board. 'Almost all of those numbers are Smart Logistics No. 3. It’s the only thing selling these days.'",
      "memo": [
        "Review name: Post-Sale Suitability Review -- 1 assignee",
        "Sales board, 3rd week of May -- Window 4, 192 million won, 2nd",
        "Window 4, Do Yoonha -- 3rd year at the bank, 2 top-seller stickers",
        "Complaints filed at the branch: 0"
      ],
      "choices": {
        "p4_start_quick": {
          "label": "Fill only the 20 boxes and head back to head office today"
        },
        "p4_start_open": {
          "label": "Tell the tellers why you’re here before standing behind them"
        },
        "p4_start_board": {
          "label": "Photograph the sales board and this month’s target memo first"
        },
        "reframe": {
          "label": "Ask how much of this product sold nationwide"
        }
      },
      "place": "KD Bank Gangseo Branch, banking hall",
      "clock": "Monday, May 15, 2023 · 09:20",
      "question": "After your dissent was returned, you get a 'Post-Sale Suitability Review'. What do you do first?",
      "lead": "Open the door to the banking hall, and the first thing you see, before any customer, is the sales board on the wall."
    },
    "p4_window": {
      "title": "3 Minutes",
      "text": "A seventy-one-year-old customer comes to Window 4 with a matured savings passbook. She is a longtime regular, so Do Yoonha says her name first. What sells at the window is the KD Smart Logistics No. 3 Specified Money Trust. Do Yoonha never once says its name aloud. He looks down at a laminated script in the drawer and speaks. 'Ma’am, it pays a little more than your savings. It goes into one logistics company, and it’s our best seller right now.' The disclosure runs 22 pages; the stack at the window is the first 4. Page 12 has this sentence: if that company falters, this money is subordinated. The signature on the pad takes 3 minutes 12 seconds. Do Yoonha hands back the passbook with both hands and smiles. The hardest part to bear is that there is no lie in that smile.",
      "memo": [
        "Product disclosure 22 pages -- window copy 4 pages",
        "Page 12: if the company falters, subordinated",
        "Consultation 3 min 12 sec, minimum 3 million won",
        "Quoted return 5.8% a year -- principal not guaranteed"
      ],
      "choices": {
        "p4_window_watch": {
          "label": "Stay out of it and watch all six morning sales"
        },
        "p4_window_script": {
          "label": "Note each line where script and disclosure differ"
        },
        "p4_window_stop": {
          "label": "Step in before the signature and read page 12 together"
        },
        "reframe": {
          "label": "Ask how much of this product sold nationwide"
        },
        "p4_window_evidence_turn": {
          "label": "Open the account and time that created the window script"
        }
      },
      "place": "KD Bank Gangseo Branch · Window 4",
      "clock": "May 15, 2023 · 10:10",
      "question": "A product sold in 3 minutes 12 seconds. What do you do here?",
      "lead": "You set a folding chair beside the window and sit; you see his face in profile, not the side the customer sees."
    },
    "p4_quota": {
      "title": "The 2nd-Floor Whiteboard",
      "text": "Lunchtime, the branch’s 2nd-floor meeting room. On the left of the whiteboard is the branch’s May target of 1.2 billion won; on the right, a box for each of the six windows. Boxes that hit target get a circle; boxes that missed keep a name. Windows 3 and 6 kept their names last month too. A printout of the memo that sent the target down lies on the table. Sender: head office, Corporate Finance Strategy Team. Your team. Its title is 'Smart Logistics No. 3 Sales Cooperation', and the approval box at the bottom carries a department name and no person’s name. The attached terms and conditions run 18 pages and never reached the windows. Branch Manager Bae grips a marker and lets it go. 'I didn’t make that target. I just got it and split it six ways.' He smiles briefly. 'If you’re here to talk about mis-selling, my people only followed the script.'",
      "memo": [
        "May branch target 1.2 billion won -- 200 million won per window",
        "Names of windows under target never erased -- Windows 3 and 6, 2 months running",
        "Memo sender: head office Corporate Finance Strategy Team, no name in approval box",
        "Terms and conditions 18 pages -- not given to the windows"
      ],
      "choices": {
        "p4_quota_trace": {
          "label": "Copy the blank approval box into the review report as is"
        },
        "p4_quota_skip": {
          "label": "Call the target a branch matter, count sales, and leave"
        },
        "p4_quota_erase": {
          "label": "Ask the branch manager to erase the missed-target names first"
        },
        "reframe": {
          "label": "Ask how much of this product sold nationwide"
        },
        "p4_quota_evidence_turn": {
          "label": "Open the account and time that created the window script"
        }
      },
      "place": "KD Bank Gangseo Branch, 2nd-floor meeting room",
      "clock": "May 15, 2023 · 12:50",
      "question": "The approval box on the memo that sent down the sales target is empty. What do you do?",
      "lead": "The whiteboard keeps both the circles of the boxes that hit target and the names in the boxes that missed."
    },
    "p4_visit": {
      "title": "Next to Gaeul Rice Cakes",
      "text": "Four in the afternoon, Mangwon Market. The shutter of Gaeul Rice Cakes is half down, with a note taped to it: 'Gone to Incheon today.' Next door, Shin Youngran of the side-dish shop Handful of Perilla sits you down on her low wooden platform. She is sixty-three and has been in this alley for 19 years. She holds out a passbook. April 28, Window 4, 12 million won. 'They said it was a savings plan. In 2 years I have to raise the deposit on my shop.' She says she can read the product name printed on the passbook and still not know what it means. The cooling-off period ended last week, and redeeming now means a fee. Shin Youngran closes the lid of a kimchi tub. 'That young man is so kind. He lives in the alley right behind here. He buys our kimchi, and every time he asks how my knees are. That’s why everyone took the bus all the way to Gangseo. Would someone like that sell something bad?'",
      "memo": [
        "Shin Youngran -- Handful of Perilla, joined at Window 4 on April 28, 12 million won",
        "What she thinks she has: 'a savings plan'",
        "Cooling-off period ended -- May 10",
        "6 people in the alley confirmed holding the same product"
      ],
      "choices": {
        "p4_visit_record": {
          "label": "Verify the April 28 sale and log it in the review record"
        },
        "p4_visit_leave": {
          "label": "Say no loss yet, drop her from the review, and walk away"
        },
        "p4_visit_read": {
          "label": "Sit on the platform and read her all 22 pages of the disclosure"
        },
        "reframe": {
          "label": "Ask how much of this product sold nationwide"
        },
        "p4_visit_evidence_turn": {
          "label": "Open the account and time that created the window script"
        }
      },
      "place": "Mangwon Market · Handful of Perilla side-dish shop",
      "clock": "May 15, 2023 · 16:00",
      "question": "In front of you is someone who thinks her 12 million won is in a savings plan. What do you tell her?",
      "lead": "The shutter of Gaeul Rice Cakes is half down, and a note lifts in the wind."
    },
    "p4_final": {
      "title": "About Window 4",
      "text": "Eight in the evening. The shutter is down, and only two rows of fluorescent lights are on in the banking hall. Do Yoonha of Window 4 stays behind alone to close out. He takes a spiral notebook from drawer 4, starts counting something, and meets your eyes. 47 names; beside 31 of them, a one-line note. Matures in June. Son’s tuition in September. Knee surgery in August. Your phone rings. It is Manager Han Seoyun. Review results by 9:00 tomorrow morning, a 20-box form, no blanks. When you hang up, Do Yoonha closes the notebook and asks. 'You’re from head office, so you’d know.' He says it with the same smile. 'It is a good product, right? I told those ladies it was fine.'",
      "memo": [
        "Window 4 sales: 47 -- 31 customers he knows by name",
        "Review results due: 09:00 next day, 20 boxes",
        "Do Yoonha’s question: 'It is a good product, right?'",
        "Han Seoyun’s order: 20 boxes, no blanks"
      ],
      "choices": {
        "p4_final_file": {
          "label": "Write the sales method itself into the review report"
        },
        "p4_final_tell": {
          "label": "Tell Do Yoonha plainly what this product is"
        },
        "p4_final_close": {
          "label": "Fill the 20 boxes and write none of what you saw today"
        },
        "reframe": {
          "label": "Reframe the Table one last time"
        }
      },
      "place": "KD Bank Gangseo Branch, banking hall · behind the shutter",
      "clock": "May 15, 2023 · 20:00",
      "question": "The man who sold it asks if it’s a good product. What do you do about these sales?",
      "lead": "In the hall lit by two rows of fluorescent lights, drawer 4 opens once and closes."
    },
    "p4_aftershock": {
      "title": "The Last Friday in May",
      "text": "Eleven days later, the evening of the last Friday in May. The Gangseo sales board is wiped and the June targets go up. The branch hit its May target, and Window 4 is No. 1 for the first time. The top-seller stickers under Do Yoonha’s name now number three, and he sends you a photo of himself in front of the board. 'I made No. 1.' No exclamation mark. The review results you filed sit logged and stalled in your team. That afternoon a short memo arrives from Human Resources at head office. Your name is on the list for a transfer order to be announced in July, and the destination box is still empty. Outside it is early summer. The passbooks that left Window 4 sit untouched in their owners’ drawers, and no one has lost anything yet. That is the most frightening part right now.",
      "memo": [
        "Gangseo May target of 1.2 billion won met -- Window 4 No. 1",
        "Do Yoonha: 3 top-seller stickers",
        "HR memo: on the list for transfer orders announced July 17, destination box empty",
        "Passbooks from Window 4 -- losses so far: 0"
      ],
      "choices": {
        "p4_after_warn": {
          "label": "Take Do Yoonha aside and tell him how his product ends"
        },
        "p4_after_report": {
          "label": "Go over your team and formally report the window sales"
        },
        "p4_after_quiet": {
          "label": "Leave the results as filed and wait for the July transfer"
        }
      },
      "place": "KD Bank Gangseo Branch · in front of the sales board",
      "clock": "Friday, May 26, 2023 · evening",
      "question": "He made No. 1, and you got a memo about a July transfer. How do you close this May?"
    },
    "p4_ledger": {
      "title": "From April 27",
      "text": "Before lunch, Do Yoonha prints the sales records for you from the window terminal. Sales began on April 27, the very day the loan was approved. Gangseo Branch sold 213 in 19 days. At the bottom of the screen the unit price is logged once a day, and no one at the windows has ever looked at that line. Of the 213, 47 are Window 4’s. Do Yoonha scrolls the list and reads the names aloud. At the 31st he stops. 'This customer came to my sister’s wedding.' He keeps his eyes on the screen. 'It’s not that I sell well. It’s that this neighborhood knows me.'",
      "memo": [
        "Sales began April 27 -- the day the loan was approved",
        "Gangseo Branch: 213 in 19 days",
        "Window 4: 47 -- 31 customers he knows by name"
      ],
      "choices": {
        "p4_ledger_choice_3": {
          "label": "Copy only the numbers to the tally; leave names blank"
        },
        "p4_ledger_choice_2": {
          "label": "Download all sales records and seal them in the review file"
        },
        "p4_ledger_choice_1": {
          "label": "Go through the 47 customers line by line with Do Yoonha"
        }
      },
      "place": "KD Bank Gangseo Branch · window terminal",
      "clock": "May 15, 2023 · 11:30",
      "question": "213 sold in 19 days, 47 of them at Window 4. What do you do with this record?"
    },
    "p4_script": {
      "title": "The 3-Minute Script",
      "text": "As you leave the meeting room, Branch Manager Bae opens a window drawer to show you. A laminated A4 sheet lines the bottom of the drawer, and all six drawers are the same. The title is 'Smart Logistics No. 3 Sales Guide'. It is one side only and takes 3 minutes to read. The first line is 'Bring it up naturally along with the savings maturity notice.' Bae takes out last month’s mystery shopper report. Gangseo Branch, grade A. There are six criteria, and all six are in the script word for word. 'Follow the script and you get an A. So what did my people do wrong?'",
      "memo": [
        "All 6 window drawers: the same laminated script",
        "Script read time 3 minutes -- issued by head office",
        "Last month’s mystery shopper review: grade A"
      ],
      "choices": {
        "p4_script_choice_3": {
          "label": "Call the script head office’s business; drop it from scope"
        },
        "p4_script_choice_2": {
          "label": "Document the 11 lines where script and disclosure differ"
        },
        "p4_script_choice_1": {
          "label": "Ask, in front of the manager, which department wrote it"
        }
      },
      "place": "KD Bank Gangseo Branch · window drawers",
      "clock": "May 15, 2023 · 13:20",
      "question": "The same 3-minute script lines all six drawers. What do you do with this one sheet?"
    },
    "p4_list": {
      "title": "Six People in the Alley",
      "text": "Shin Youngran makes a few calls from the platform. In 20 minutes, six people gather: the dry cleaner, the fruit seller, the locksmith, the snack bar owner from across the way, and the couple from the dish shop next to the rice-cake shop. All six passbooks carry the same product name. The sign-up dates cluster between April 27 and May 9, and the amounts run from 6 million to 20 million won. All six took the bus to Window 4 to sign up, and all six call it 'something like a savings plan'. The locksmith smiles and asks. 'Is something wrong with it? Then will young Do Yoonha get in trouble?' No one mentions their own money first.",
      "memo": [
        "6 sign-ups in the alley -- 74 million won in total",
        "Sign-ups concentrated April 27–May 9",
        "All 6 at Window 4, all 6 think it’s 'a savings plan'"
      ],
      "choices": {
        "p4_list_choice_3": {
          "label": "Say nothing today and just take down the names"
        },
        "p4_list_choice_2": {
          "label": "Take a written account of each of the six sign-ups"
        },
        "p4_list_choice_1": {
          "label": "Gather all six and explain the product from the start"
        }
      },
      "place": "Mangwon Market · platform outside Handful of Perilla",
      "clock": "May 15, 2023 · 16:40",
      "question": "Six people from the alley have gathered with the same passbook. What do you do?"
    },
    "p4_ledger_reaction": {
      "title": "This Isn’t a Review",
      "text": "As soon as you get the sales records, Assistant Manager Oh Jinwoo calls. You can tell he is keeping his voice down at his desk at head office. 'That’s not a review. It’s a cleanup. Sending the person who wrote the dissent to check whether sales went well, what do you think that means?' He picks his words for a moment. 'I’m on your side. That’s why I’m telling you: make something big of it there, and no one can say where your seat goes in the summer reshuffle.' Through the receiver comes the sound of a team meeting starting. He adds one last thing. 'The people at the windows did nothing wrong. I know that too. That’s why you need to be more careful.'",
      "memo": [
        "Oh Jinwoo: 'That’s not a review, it’s a cleanup'",
        "Seat in the summer reshuffle -- no one has decided it yet"
      ],
      "choices": {
        "p4_ledger_reaction_choice_3": {
          "label": "Tell him not to worry and hang up first"
        },
        "p4_ledger_reaction_choice_2": {
          "label": "Formally ask the team to set the review scope in writing"
        },
        "p4_ledger_reaction_choice_1": {
          "label": "Tell Oh Jinwoo everything you saw at the windows"
        }
      },
      "place": "KD Bank Gangseo Branch · back-door stairs",
      "clock": "May 15, 2023 · 11:50",
      "question": "Your mentor says this isn’t a review but a cleanup. How do you answer?"
    },
    "p4_script_reaction": {
      "title": "4 Pages of 22",
      "text": "On the branch’s back-door stairs, the first thing you see is a familiar black notebook. It is Investigator Ban Jaewook of Internal Audit. He says his trip overlapped with a scheduled head-office inspection. He lays the 4-page window copy beside the 22-page original. 'Have you seen what the missing pages say? I have. And there is no one to ask why this got so thin.' On the 2023-0412 page of his notebook, under the line with the approval date, he writes today’s date and time. 'An investigator can do this for 17 years and change nothing. So I write things down instead. If someone ever comes looking for this notebook, there will need to be dates.'",
      "memo": [
        "Ban Jaewook’s notebook -- 17 years of writing the date first",
        "Window copy 4 pages / original 22 pages"
      ],
      "choices": {
        "p4_script_reaction_choice_3": {
          "label": "Say it’s no business of Internal Audit and go it alone"
        },
        "p4_script_reaction_choice_2": {
          "label": "Ask to hand it over as a formal Internal Audit inquiry"
        },
        "p4_script_reaction_choice_1": {
          "label": "Piece together the 18 missing pages with Ban Jaewook"
        }
      },
      "place": "KD Bank Gangseo Branch · back-door stairs",
      "clock": "May 15, 2023 · 13:40",
      "question": "The Internal Audit investigator has laid the 4-page copy beside the 22-page original. What do you do?"
    },
    "p4_list_reaction": {
      "title": "A Tub of Kimchi",
      "text": "The people scatter, and Shin Youngran packs one kimchi tub separately. She says it’s for the young man at Window 4. 'He came last week and bought a tub. Said his mother hasn’t had much appetite lately.' She stops tying the bag and looks at you. 'So, what happens to our money?' For the first time, she asks about her own money first. Then she adds right away. 'I mean, if it goes wrong, he won’t have to pay it back, will he? He shouldn’t have to.' The kimchi tub is still in your hands.",
      "memo": [
        "Shin Youngran’s first question: 'What happens to our money'",
        "Second question: 'He won’t have to pay it back, will he'"
      ],
      "choices": {
        "p4_list_reaction_choice_1": {
          "label": "Tell Shin Youngran what you know about her money"
        },
        "p4_list_reaction_choice_2": {
          "label": "Say you’ll check and let her know in writing"
        },
        "p4_list_reaction_choice_3": {
          "label": "Take the kimchi tub and go back to the branch in silence"
        }
      },
      "place": "Mangwon Market · platform outside Handful of Perilla",
      "clock": "May 15, 2023 · 17:00",
      "question": "She asked first what happens to her money. What do you answer?"
    },
    "p4_branch_drawer": {
      "title": "Drawer 4",
      "text": "When you read page 12 together, the next customer puts down the pen, says 'I’ll come back another time,' and leaves. Do Yoonha of Window 4 doesn’t get angry. Instead, in a gap between customers, he calls you behind the window. Drawer 4 opens. The laminated 3-minute script, a bag of peppermint candies, nail clippers, and a spiral notebook. The notebook holds 47 names, and beside 31 of them is a one-line note. 'Rice-cake shop owner -- savings matures in June', 'Dry cleaner -- son’s tuition, September', 'Handful of Perilla lady -- knee surgery, August'. Do Yoonha leaves the notebook open. 'I know what you’re going to say. It looks like a sales tracker. It isn’t, to me.'",
      "memo": [
        "Drawer 4 -- script, candy, spiral notebook",
        "Notebook: 47 names · 31 notes",
        "Notes: maturity, tuition, surgery dates",
        "1 customer turned back -- 'I’ll come back another time'"
      ],
      "choices": {
        "p4_branch_drawer_b": {
          "label": "Match the 31 noted customers against their products"
        },
        "p4_branch_drawer_c": {
          "label": "Call the notebook irrelevant, shut the drawer, go back"
        },
        "p4_branch_drawer_a": {
          "label": "Close the notebook; talk first about the customer who left"
        }
      },
      "place": "KD Bank Gangseo Branch · behind the windows",
      "clock": "May 15, 2023 · 10:40",
      "question": "Drawer 4 holds a notebook with 47 names. What do you do?"
    },
    "p4_branch_drawer_follow": {
      "title": "Why It Sold",
      "text": "In the narrow break room behind the windows, Do Yoonha of Window 4 fills a paper cup with water. Unasked, he explains why he is 2nd or 3rd every month. It isn’t because he talks well, he says. 'Do you know why I write these down? So I can call people by name next time. When you call their name, people smile.' He sets the cup down. 'That’s the one thing that got me through 3 years. I didn’t go to a good school and I have no certificates, but I know everyone’s name in that neighborhood.' Then, for the first time, his voice drops. 'I saw you reading page 12 earlier. I’ve never seen that page. I didn’t even know it existed.' He starts to smile and stops. 'You know what I just sold, don’t you?'",
      "memo": [
        "Do Yoonha -- 3rd year, holds 2nd–3rd on the sales board",
        "Sales method: learns names, calls people by name",
        "Disclosure page 12 -- never seen it",
        "Break room talk at 10:55"
      ],
      "choices": {
        "p4_branch_drawer_follow_b": {
          "label": "Take his dated statement that he never got the disclosure"
        },
        "p4_branch_drawer_follow_a": {
          "label": "Explain what page 12 means, fully, right here"
        },
        "p4_branch_drawer_follow_c": {
          "label": "Put it off until the review ends; now it would hurt him"
        }
      },
      "place": "KD Bank Gangseo Branch · break room",
      "clock": "May 15, 2023 · 10:55",
      "question": "He says he didn’t even know page 12 existed. What do you tell him now?"
    },
    "p4_route_system": {
      "title": "In 19 Days",
      "text": "Instead of stopping at one branch, you ask how much of this product sold nationwide, and Assistant Manager Oh Jinwoo pulls the national sales records from a head-office terminal and sends them. In the 19 days from April 27, 2,140 were sold. The form has no box to mark whether the customer received the full disclosure. No box was ever made, so no one can break the rule. And of the 10 windows that sold the most, 9 missed their sales targets last month. Oh Jinwoo adds one line at the end of the file. 'I didn’t send you this. And the scariest box in this table isn’t a number. It’s the box that isn’t there.'",
      "memo": [
        "2,140 in 19 days · 21.4 billion won",
        "Average buyer age 61 · average consultation 4 min 3 sec",
        "Box confirming disclosure delivery -- not on the form",
        "9 of the top 10 selling windows missed last month’s target"
      ],
      "choices": {
        "p4_route_system_freeze": {
          "label": "Ask head office to halt sales today"
        },
        "p4_route_system_drop": {
          "label": "Set aside the national numbers; finish only Gangseo"
        },
        "p4_route_system_call": {
          "label": "Phone the 10 top-selling windows and warn them first"
        },
        "p4_route_system_evidence_turn": {
          "label": "Open the account and time that created the window script"
        }
      },
      "place": "KD Bank Gangseo Branch · empty consultation room",
      "clock": "May 15, 2023 · 18:00",
      "question": "2,140 sold in 19 days, and the form has no confirmation box. What do you do with this table?"
    },
    "p4_final_system_route": {
      "title": "The Box Not on the Form",
      "text": "Six-thirty in the evening. On the table in the empty consultation room lies a printout of the table Oh Jinwoo sent. Next to the counts for those nineteen days, you have drawn a box in pencil. 'Received the full disclosure.' The table has no such box. One more line from Oh Jinwoo arrives on your phone. 'If you ask for that box, the first question will be who didn’t make it. The sales memo for this product went out from our team.' Out in the banking hall, Do Yoonha of Window 4 is counting the four-page disclosures for tomorrow.",
      "memo": [
        "National sales 2,140 -- no box confirming disclosure delivery",
        "Sales target memo sender: head office Corporate Finance Strategy Team",
        "Review results due: 09:00 next day"
      ],
      "choices": {
        "p4_final_system_route_c": {
          "label": "Demand all 22 pages go to the 2,140 buyers"
        },
        "p4_final_system_route_a": {
          "label": "Propose a minimum explanation time for window products"
        },
        "p4_final_system_route_b": {
          "label": "Leave the national table; recheck only Gangseo’s 47"
        }
      },
      "place": "KD Bank Gangseo Branch · empty consultation room",
      "clock": "May 15, 2023 · 18:30",
      "question": "You penciled in a box the table never had. Who do you show it to?"
    },
    "p4_evidence_turn": {
      "title": "The Hand That Wrote the Script",
      "text": "When you hold the clue to the script’s file name, the creation record of the file 'Smart Logistics No. 3 Sales Guide' opens. It was made not at Gangseo Branch but by the Corporate Finance Strategy Team at head office, on the day 2023-0412 was approved, two hours after approval. The same night, the same account cut the window copy of the disclosure from 22 pages to 4. Among the dropped sentences is this one: if the debt-to-equity ratio goes above 180%, the bank can call the loan first, and the money in this product goes to the very back of the line. The box for mandatory consultation recording is gone from the window copy too. Investigator Ban Jaewook closes his notebook. 'What was sold was written in two hours, and the people who sold it don’t even know when it was written.'",
      "memo": [
        "Script written: head office Corporate Finance Strategy Team account, April 27, 16:05",
        "Same night, window copy 22 pages -> 4 pages",
        "Dropped sentence: 180% · early call · pushed to the back",
        "Dropped box: mandatory consultation recording"
      ],
      "choices": {
        "p4_evidence_turn_hold": {
          "label": "Hold the record; produce it if the report is returned"
        },
        "p4_evidence_turn_attach": {
          "label": "Send the script record to Lim Kyungsoo and Audit at once"
        },
        "p4_evidence_turn_share": {
          "label": "Show that missing line to the six tellers first"
        }
      },
      "place": "KD Bank Gangseo Branch · document server access log",
      "clock": "May 15, 2023 · 19:00",
      "question": "The 3-minute script was written two hours after the loan was approved. How do you use this record?"
    },
    "p4_start_appeal": {
      "title": "Gangseo, for the One Who Appealed",
      "text": "You did not let the return stand; you filed an appeal. The request got a receipt number only on May 9, and three days later, on the afternoon of Friday, May 12, the answer came in one line. 'Re: appeal request. No reason to review.' The signature line has a department name and no person’s name. The next Monday morning, you stand in the banking hall of Gangseo Branch. The sheet in your hand is titled 'Post-Sale Suitability Review'. Assistant Manager Oh Jinwoo follows you out to the front of the branch, puts a cigarette in his mouth, then puts it back. 'An answer in three days means nobody read it before answering.' He nods toward the sales board inside the hall. 'Giving this job to the person who appealed, I don’t think that’s a coincidence.' On the board, the Window 4 box carries the name 'Do Yoonha' and two top-seller stickers, and Branch Manager Bae Seungho says almost all of those numbers are 'Smart Logistics No. 3'.",
      "memo": [
        "Appeal result: 'No reason to review' -- three days after receipt",
        "Notice signature line: department name only, no person",
        "Review assigned: the next working day after the notice"
      ],
      "choices": {
        "p4_start_appeal_quick": {
          "label": "Fill only the 20 boxes and head back to head office today"
        },
        "p4_start_appeal_signature": {
          "label": "Holding the rejection, tell the tellers your situation first"
        },
        "p4_start_appeal_board": {
          "label": "Photograph the sales board and this month’s target memo first"
        },
        "p4_start_appeal_open": {
          "label": "Tell the tellers why you’re here before standing behind them"
        },
        "p4_start_appeal_reframe": {
          "label": "Ask how much of this product sold nationwide"
        }
      },
      "place": "KD Bank Gangseo Branch, banking hall",
      "clock": "Monday, May 15, 2023 · 09:20",
      "question": "Your appeal was rejected in three days, and this job came the next working day. What do you do first?",
      "lead": "You open the branch door carrying a bag with one folded line inside: 'No reason to review.'"
    },
    "p4_start_copy": {
      "title": "Gangseo, for the One Who Kept a Copy",
      "text": "You kept one copy of the returned written opinion. That copy is in the inner pocket of your bag now, and it catches your fingertips every time you open the bag in the banking hall. The word to go down to Gangseo Branch came near quitting time on Friday. The title is 'Post-Sale Suitability Review'; the term, one day. On the subway, Team Head Lim Kyungsoo calls. His voice is low and short. 'Just know where that paper is. Don’t take it out today.' Through the static you hear tape being torn. 'Of the people I know who kept a copy, you’re the second. The first never once took it out in 12 years.' Open the hall door, and on the sales board on the wall, the Window 4 box carries the name 'Do Yoonha' and two top-seller stickers. Branch Manager Bae Seungho says almost all of those numbers are 'Smart Logistics No. 3'.",
      "memo": [
        "1 copy of the written opinion -- inner pocket of the bag",
        "Review notice: near quitting time Friday, term one day",
        "Lim Kyungsoo: 'Don’t take it out today'"
      ],
      "choices": {
        "p4_start_copy_board": {
          "label": "Photograph the sales board and this month’s target memo first"
        },
        "p4_start_copy_open": {
          "label": "Tell the tellers why you’re here before standing behind them"
        },
        "p4_start_copy_signature": {
          "label": "Put the copy in your bag and the sales records in one file"
        },
        "p4_start_copy_quick": {
          "label": "Fill only the 20 boxes and head back to head office today"
        },
        "p4_start_copy_reframe": {
          "label": "Ask how much of this product sold nationwide"
        }
      },
      "place": "KD Bank Gangseo Branch, banking hall",
      "clock": "Monday, May 15, 2023 · 09:20",
      "question": "There is a copy tucked inside your bag. What do you do with it today?",
      "lead": "Every time you open the bag, the copy in the inner pocket catches your fingertips."
    },
    "p4_start_accept": {
      "title": "Gangseo, for the One Who Accepted",
      "text": "You accepted the return. You pressed the confirm button, turned around, and opened the next file. 2 weeks later, this job came. The title is 'Post-Sale Suitability Review': one assignee, one day, at Gangseo Branch. Monday morning in the lobby, Manager Han Seoyun hands you a printout of the review order. She looks at your face for a moment. 'This isn’t a punishment. I know it looks like one.' She presses the elevator button and, before the doors close, adds. 'Go and see. You’ll find out there whether what you wrote was right. In the way that hurts most.' An hour later, in the Gangseo banking hall, the Window 4 box on the sales board carries the name 'Do Yoonha' and two top-seller stickers. Branch Manager Bae Seungho says almost all of those numbers are 'Smart Logistics No. 3'.",
      "memo": [
        "2 weeks after accepting the return -- credit review work reassigned",
        "Review assigned: 1 assignee, one day",
        "Han Seoyun: 'This isn’t a punishment'"
      ],
      "choices": {
        "p4_start_accept_quick": {
          "label": "Fill only the 20 boxes and head back to head office today"
        },
        "p4_start_accept_signature": {
          "label": "Ask Han Seoyun why this review was given to you"
        },
        "p4_start_accept_open": {
          "label": "Tell the tellers why you’re here before standing behind them"
        },
        "p4_start_accept_board": {
          "label": "Photograph the sales board and this month’s target memo first"
        },
        "p4_start_accept_reframe": {
          "label": "Ask how much of this product sold nationwide"
        }
      },
      "place": "KD Bank Gangseo Branch, banking hall",
      "clock": "Monday, May 15, 2023 · 09:20",
      "question": "A one-day review, sent to the one who accepted. What do you do first?",
      "lead": "The papers you got in the lobby carry only one name in the assignee box: yours."
    }
  },
  "echoReplies": {
    "p4_start_open": "When you tell them, the six tellers stop what they’re doing. Do Yoonha is the first to drag over a chair.",
    "p4_start_board": "The photos come to 22. The sales board is wiped every Friday; the photos keep what was there before.",
    "p4_start_quick": "The 20 boxes fill in two hours. In the remaining six hours, 11 more sell in the banking hall.",
    "p4_window_stop": "When you step in, the next customer puts down the pen, says 'I’ll come back another time,' and leaves. Do Yoonha doesn’t get angry; he just looks at you.",
    "p4_window_script": "Side by side, 11 lines differ. Two of them mean the exact opposite.",
    "p4_window_watch": "All six sell. The average is 3 minutes 40 seconds, and all six leave smiling.",
    "p4_quota_erase": "When you ask, Bae picks up the marker. Then he says, 'Erase them and they’ll be written again next month.'",
    "p4_quota_trace": "Once copied, the report holds one approval with no name. The department that sent it up is yours.",
    "p4_quota_skip": "Counting only sales makes the review faster. The two names on the whiteboard are still there in June.",
    "p4_visit_read": "Reading all 22 pages takes 40 minutes. When it’s done, Shin Youngran asks, 'So did that young man know all this?'",
    "p4_visit_record": "With a record, April 28 becomes a date. The name of the person at the window that day stays with it.",
    "p4_visit_leave": "You drop her and walk away, and today nothing happens. Shin Youngran goes on planning to raise her deposit in 2 years.",
    "p4_final_tell": "When you tell him, Do Yoonha stands there a long time. Then he opens the notebook and counts the 31 names again.",
    "p4_final_file": "Once it’s in the report, it reaches Han Seoyun’s desk tomorrow morning. If it goes above the team and a procedure starts, the first people the procedure calls are the six tellers who read the script.",
    "p4_final_close": "With all 20 boxes filled, the review ends with 'nothing unusual'. The product keeps selling, and at the end of the month Do Yoonha makes No. 1.",
    "p4_after_warn": "When you take him aside, Do Yoonha says nothing for a long time. That night he walks the alley for two hours, holding the notebook with his customers’ names. Nothing goes on any record.",
    "p4_after_report": "Once the report goes up, the six people at Gangseo Branch are called in first the next week. No one is called from the floor where the script was written.",
    "p4_after_quiet": "Left as it is, it becomes something that never happened. 3 years later, Do Yoonha remembers this summer alone.",
    "p4_ledger_choice_1": "Reading together, Do Yoonha tells you the story behind all 31. At the 47th name, he stops talking for the first time.",
    "p4_ledger_choice_2": "Once sealed, the record leaves the branch’s hands. Do Yoonha doesn’t know how many times his name is in that file.",
    "p4_ledger_choice_3": "With the name column blank, the tally looks clean. The number 213 keeps no faces.",
    "p4_script_choice_1": "When you ask, Bae opens the file properties to show you. It was made not at the branch but on the floor where you used to sit.",
    "p4_script_choice_2": "Laying out the 11 shows that two lines are exact opposites. The script has the teller read, 'Your principal is protected.'",
    "p4_script_choice_3": "Dropped from scope, today’s review ends two hours early. Tomorrow the script still lines all six drawers.",
    "p4_list_choice_1": "When you finish explaining, no one gets angry. The locksmith says, 'Don’t tell the young man.'",
    "p4_list_choice_2": "With six accounts gathered, the sentences are almost the same. 'They said it pays a little more than savings' appears six times.",
    "p4_list_choice_3": "You leave with only the names, and the alley is just as before. Shin Youngran puts a tub of kimchi in a bag for you.",
    "p4_ledger_reaction_choice_1": "When you tell him everything, Oh Jinwoo is quiet for a long time. Then he says, 'I was in the meeting about that script too.'",
    "p4_ledger_reaction_choice_2": "The request is logged. Once the scope is a document, what you saw has to go inside that document too.",
    "p4_ledger_reaction_choice_3": "You hang up first, and Oh Jinwoo texts one line. 'Think about why I told you about my father.'",
    "p4_script_reaction_choice_1": "Piecing it together, the same sentences go into both notebooks. Ban Jaewook writes your name beside the date on his page.",
    "p4_script_reaction_choice_2": "Once handed over, the inquiry begins. The first people it calls are the six tellers who read the script.",
    "p4_script_reaction_choice_3": "When you say you’ll go it alone, Ban Jaewook closes his notebook. 'Then what we saw today will be only in my notebook.'",
    "p4_list_reaction_choice_1": "When you tell her, Shin Youngran sits on the platform a long time. Then she says twice, 'That young man couldn’t have known.'",
    "p4_list_reaction_choice_2": "When you say you’ll put it in writing, she nods. She trusts what she gets on paper more.",
    "p4_list_reaction_choice_3": "The kimchi tub is heavy the whole way back. Put it in the branch fridge, and tomorrow Do Yoonha will take it home with a smile.",
    "p4_branch_drawer_a": "With the notebook closed, Do Yoonha talks about the customer who left. 'That customer will be back next week. They trust me.'",
    "p4_branch_drawer_b": "Matched up, 24 of the 31 hold the same product. For nine of them, the date in the note falls inside the product’s term.",
    "p4_branch_drawer_c": "With the drawer shut, window sales go on as planned. The notebook opens again in the evening.",
    "p4_branch_drawer_follow_a": "When you finish, Do Yoonha holds his paper cup a long time. 'Then what have I been doing all this time?'",
    "p4_branch_drawer_follow_b": "With a statement on file, there is a date. Later that date may protect Do Yoonha, or point at him.",
    "p4_branch_drawer_follow_c": "You put it off, and nine more go out this afternoon. Do Yoonha sells three of them.",
    "p4_route_system_freeze": "When you ask, a reply comes. 'Halting product sales is outside this department’s authority.' The sender is your department.",
    "p4_route_system_call": "Of the 10 you call, six pick up. Three say, 'We thought something was off too.'",
    "p4_route_system_drop": "Set aside, the national table goes nowhere. The 2,140 become 2,600 next week.",
    "p4_final_system_route_a": "With a minimum in place, a 3-minute consultation becomes impossible. But fewer sales fit in a day, and the target stays the same.",
    "p4_final_system_route_b": "The 47 are rechecked. Today, again, no one looks at the other 2,093.",
    "p4_final_system_route_c": "Once all 22 pages go out, 2,140 letters are mailed. Some who get them call the branch that day.",
    "p4_evidence_turn_attach": "Sent to both at once, the two open the same file on the same day. Lim Kyungsoo prints the record as a watermarked copy and seals it with tape.",
    "p4_evidence_turn_hold": "Held back, it becomes a strong card later. Meanwhile, the June sales targets come down window by window.",
    "p4_evidence_turn_share": "When you show them, the six pass that line around. When they finish, no one can speak first.",
    "p4_window_evidence_turn": "Open the file name, and the script’s creation record comes with it. The hands that sell and the hand that chose the sentences are not on the same floor.",
    "p4_quota_evidence_turn": "Open the file name, and the script’s creation record comes with it. The hands that sell and the hand that chose the sentences are not on the same floor.",
    "p4_visit_evidence_turn": "Open the file name, and the script’s creation record comes with it. The hands that sell and the hand that chose the sentences are not on the same floor.",
    "p4_route_system_evidence_turn": "Open the file name, and the script’s creation record comes with it. The hands that sell and the hand that chose the sentences are not on the same floor.",
    "prologue04_memory_system": "Lay them side by side, and the script never had a box for writing an opinion to send back. The national sales records Oh Jinwoo sent have the same empty spot.",
    "prologue04_memory_evidence": "Hold the time of the return against the script, and its creation record opens. By the afternoon your written opinion came back, the sentences to sell with were already chosen.",
    "p4_start_appeal_open": "When you tell them, the six tellers stop what they’re doing. Do Yoonha is the first to drag over a chair.",
    "p4_start_appeal_board": "The photos come to 22. The sales board is wiped every Friday; the photos keep what was there before.",
    "p4_start_appeal_quick": "The 20 boxes fill in two hours. In the remaining six hours, 11 more sell in the banking hall.",
    "p4_start_appeal_signature": "When you tell them, the six tellers go quiet for a moment. Do Yoonha is the first to ask, 'So how can we help you?'",
    "p4_start_copy_open": "When you tell them, the six tellers stop what they’re doing. Do Yoonha is the first to drag over a chair.",
    "p4_start_copy_board": "The photos come to 22. The sales board is wiped every Friday; the photos keep what was there before.",
    "p4_start_copy_quick": "The 20 boxes fill in two hours. In the remaining six hours, 11 more sell in the banking hall.",
    "p4_start_copy_signature": "In one file, the dissent and the sales results sit side by side. The first page shows the dates are eight days apart.",
    "p4_start_accept_open": "When you tell them, the six tellers stop what they’re doing. Do Yoonha is the first to drag over a chair.",
    "p4_start_accept_board": "The photos come to 22. The sales board is wiped every Friday; the photos keep what was there before.",
    "p4_start_accept_quick": "The 20 boxes fill in two hours. In the remaining six hours, 11 more sell in the banking hall.",
    "p4_start_accept_signature": "When you ask, Han Seoyun says nothing for a moment. 'I picked you. Anyone else would go and come back without seeing a thing.'"
  },
  "choiceVoiceLines": {
    "p4_start_open": "So you don’t stay someone who only watches from behind, you tell the tellers why you’re here before standing behind the windows.",
    "p4_start_board": "Saying you have to see the numbers on the wall before the windows, you photograph the sales board and this month’s target memo first.",
    "p4_start_quick": "Deciding there is nothing to add to a post-sale review, you fill only the 20 boxes and head back to head office today.",
    "p4_window_stop": "Once it’s signed it’s too late, so you step in before the next customer signs and read page 12 of the disclosure together.",
    "p4_window_script": "Choosing to question sentences, not people, you lay the script beside the disclosure and note each line that differs.",
    "p4_window_watch": "Since one sale is not enough to judge, you stay out of it and watch all six morning sales to the end.",
    "p4_quota_erase": "The names left since last month weigh on you first, so you ask the branch manager to erase the names of the windows that missed target.",
    "p4_quota_trace": "Insisting that even a nameless approval be recorded as seen, you copy the blank approval box into the review report as is.",
    "p4_quota_skip": "Finding it hard to question a memo your own team sent, you call the target a branch matter, count the sales, and leave the meeting room.",
    "p4_visit_read": "Insisting she should know what she signed, you sit on the platform and read her the disclosure, all 22 pages, from start to finish.",
    "p4_visit_record": "So it doesn’t end with a kind man having sold it, you verify how the April 28 sale was made and log it in the review record.",
    "p4_visit_leave": "Unwilling to hand her a worry for nothing, you say there is no loss yet, drop her from the review, and walk away.",
    "p4_final_tell": "Insisting the one who said it was fine should know first, you tell Do Yoonha, here and now, exactly what this product is.",
    "p4_final_file": "So it won’t read as one person’s fault, you write the sales method itself into the review report and send it up.",
    "p4_final_close": "Seeing no reason to answer what the form doesn’t ask, you fill the 20 boxes and write not a line of what you saw today.",
    "p4_after_warn": "This is not a May to close with one photo, so you take Do Yoonha aside and tell him yourself how what he sold could end.",
    "p4_after_report": "Insisting you must move before any loss, you go over your team and file a formal report on the window sales so a procedure starts.",
    "p4_after_quiet": "With the destination box still empty, you leave the review results as filed and wait for the July transfer.",
    "p4_ledger_choice_1": "Some things show only beside someone who knows the names, so you go through the 47 customers line by line with Do Yoonha.",
    "p4_ledger_choice_2": "So no one can touch it later, you download all the sales records and seal them in the review file.",
    "p4_ledger_choice_3": "Afraid that writing names will point at people first, you copy only the numbers to the tally and leave the name column blank.",
    "p4_script_choice_1": "Saying the source will tell whose fault it is, you ask in front of the branch manager which department wrote this script.",
    "p4_script_choice_2": "So it won’t end as the tellers’ fault, you document the 11 lines where the script and the disclosure differ.",
    "p4_script_choice_3": "With no one at the branch to answer for it, you call the script head office’s business and drop it from the review scope.",
    "p4_list_choice_1": "Saying they need to know about their own money more than who gets in trouble, you gather all six and explain the product again from the start.",
    "p4_list_choice_2": "So the words 'something like a savings plan' stay on record, you take a written account of each of the six sign-ups.",
    "p4_list_choice_3": "Afraid a careless word will shake the alley first, you say nothing today and just take down the names.",
    "p4_ledger_reaction_choice_1": "Seeing nothing to hide from someone who says he’s on your side, you tell Oh Jinwoo everything you saw at the windows.",
    "p4_ledger_reaction_choice_2": "So review-or-cleanup doesn’t just float around as talk, you formally ask the team to set the review scope in writing.",
    "p4_ledger_reaction_choice_3": "Not wanting to hold up a man headed into a meeting, you just tell him not to worry and hang up first.",
    "p4_script_reaction_choice_1": "If there is no one to ask, you have to look yourself, so you piece together the 18 missing pages with Ban Jaewook.",
    "p4_script_reaction_choice_2": "If there is no one to ask, someone needs the authority to ask, so you request that it go to Internal Audit as a formal inquiry.",
    "p4_script_reaction_choice_3": "Fearing the tellers’ names will end up in that notebook too, you say it’s no business of Internal Audit and that you’ll do it alone.",
    "p4_list_reaction_choice_1": "Unable to let her first question about her own money pass, you tell Shin Youngran what you know about what happens to it.",
    "p4_list_reaction_choice_2": "This is not money to answer for by guesswork, so you say you can’t answer now and will check and let her know in writing.",
    "p4_list_reaction_choice_3": "Choosing not to scare her with what you haven’t confirmed, you take only the kimchi tub and go back to the branch without a word.",
    "p4_branch_drawer_a": "The customer who just left weighs on you more than the notebook, so you close it and talk first about that customer.",
    "p4_branch_drawer_b": "To see what each line beside a name was traded for, you match the 31 noted customers, line by line, against the products they bought.",
    "p4_branch_drawer_c": "Seeing no need to review someone else’s drawer, you call the notebook irrelevant, shut the drawer, and go back to the windows.",
    "p4_branch_drawer_follow_a": "Unable to play dumb with someone who asked, you explain what page 12 means, fully, right here and now.",
    "p4_branch_drawer_follow_b": "So that not knowing can protect him, you take his statement, with dates, that he never received the disclosure.",
    "p4_branch_drawer_follow_c": "Unable to break today the one thing that carried him for 3 years, you say telling him now would hurt him and put it off until the review ends.",
    "p4_route_system_freeze": "Saying that arguing while it sells is too late, you ask head office to halt sales before the day is out.",
    "p4_route_system_call": "So the people who sold it aren’t the last to know, you phone the 10 top-selling windows first and tell them the facts.",
    "p4_route_system_drop": "Saying your job is one branch, you set aside the national numbers and finish only the Gangseo review.",
    "p4_final_system_route_a": "So no one signs in a few minutes again, you propose a minimum explanation time for products sold at the windows.",
    "p4_final_system_route_b": "Deciding this is no fight to pick with the department that sent the memo, you leave the national table and recheck only Gangseo’s 47.",
    "p4_final_system_route_c": "Insisting the people who put in the money should know first, you demand that all 22 pages of the disclosure go to the 2,140 buyers.",
    "p4_evidence_turn_attach": "So it survives in one place even if it’s buried in another, you send the script record to Lim Kyungsoo and Internal Audit at once.",
    "p4_evidence_turn_hold": "Saying it will be buried with the report if you play it first, you hold the record and produce it if the review report is returned.",
    "p4_evidence_turn_share": "Insisting the sellers should know before the writers, you show that missing line to the six tellers first.",
    "p4_window_evidence_turn": "Laying the 3-minute script over the clue, you work out who made this sheet and when.",
    "p4_quota_evidence_turn": "Laying the 3-minute script over the clue, you work out who made this sheet and when.",
    "p4_visit_evidence_turn": "Laying the 3-minute script over the clue, you work out who made this sheet and when.",
    "p4_route_system_evidence_turn": "Laying the 3-minute script over the clue, you work out who made this sheet and when.",
    "p4_start_appeal_open": "So you don’t stay someone who only watches from behind, you tell the tellers why you’re here before standing behind the windows.",
    "p4_start_appeal_board": "Saying you have to see the numbers on the wall before the windows, you photograph the sales board and this month’s target memo first.",
    "p4_start_appeal_quick": "Deciding there is nothing to add to a post-sale review, you fill only the 20 boxes and head back to head office today.",
    "p4_start_appeal_signature": "Choosing not to hide that you were pushed down from head office, you tell the tellers your situation first, the rejection notice still in hand.",
    "p4_start_copy_open": "So you don’t stay someone who only watches from behind, you tell the tellers why you’re here before standing behind the windows.",
    "p4_start_copy_board": "Saying you have to see the numbers on the wall before the windows, you photograph the sales board and this month’s target memo first.",
    "p4_start_copy_quick": "Deciding there is nothing to add to a post-sale review, you fill only the 20 boxes and head back to head office today.",
    "p4_start_copy_signature": "Saying what was written and what was sold are one thread, you decide to put the copy in your bag and today’s sales records in the same file.",
    "p4_start_accept_open": "So you don’t stay someone who only watches from behind, you tell the tellers why you’re here before standing behind the windows.",
    "p4_start_accept_board": "Saying you have to see the numbers on the wall before the windows, you photograph the sales board and this month’s target memo first.",
    "p4_start_accept_quick": "Deciding there is nothing to add to a post-sale review, you fill only the 20 boxes and head back to head office today.",
    "p4_start_accept_signature": "If it isn’t a punishment there must be a reason, so you call Han Seoyun and ask why she gave this review to you."
  },
  "pack": {
    "clue": {
      "title": "The Hand That Wrote the 3-Minute Script",
      "text": "The 'Smart Logistics No. 3 Sales Guide' in the window drawers was created by a head-office Corporate Finance Strategy Team account at 16:05 on April 27, the day 2023-0412 was approved. The same night, the window copy of the disclosure shrank from 22 pages to 4, and the dropped sentences held the 180%, the early call, and the mandatory consultation recording."
    },
    "outcomes": {
      "p4_after_warn": {
        "tag": "Told Him Yourself",
        "title": "You told the seller what he sold",
        "text": "That night Do Yoonha walked the alley for two hours with his notebook. He was protected, and no record anywhere holds this conversation."
      },
      "p4_after_report": {
        "tag": "Reported Up",
        "title": "The window sales method became a formal document",
        "text": "The procedure began. The first people it called were the six tellers who read the script, and no one was called from the floor where the script was written."
      },
      "p4_after_quiet": {
        "tag": "Left As It Was",
        "title": "The review ended with that one pass",
        "text": "The review report closed as filed. The product kept selling in June, and 3 years later there was one person who remembered that summer alone."
      }
    },
    "continuityChallenges": {
      "p3_after_appeal": {
        "title": "Stand With the Tellers, Rejection in Hand",
        "text": "Your appeal was rejected in one line in three days, and this review came the next working day. Cards that treat the tellers as allies, not suspects, gain trust."
      },
      "p3_after_copy": {
        "title": "Flip the Hand With the Copy in Your Bag",
        "text": "The copy of your returned written opinion is still in your bag. Put that paper and today’s sales records in one place, and reframe the hand: ask first what this review is meant to look at."
      },
      "p3_after_accept": {
        "title": "Give a Basis to a Review Sent Down as Busywork",
        "text": "The one-day review sent to the one who accepted lists no scope and no basis. Making this review stand as a procedure is the way to win back fairness."
      }
    }
  }
};
