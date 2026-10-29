/**
 * 사건 45 (src/nodes/case45.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c45_start": {
      "title": "Memorial Room 3",
      "text": "In Memorial Room 3 of the Ieum Hospital funeral hall, a drawing stands where the memorial photo should be. Lim Kyungsoo died at 4:50 this morning. It is five days since he heard the first-instance sentencing on the radio in his hospital room. The only photo left at home was his 1996 employee ID photo, so Lim Soyul drew all night. It shows a grandfather taking off his glasses and slowly wiping them. Her father, Lim Jaeyoon, is the chief mourner, but he is on a plane from Dubai, so Lim Soyul stands in his place, the sleeves of her borrowed mourning clothes folded back twice. She takes a yellowed envelope from her pocket. There is pencil writing on the front. 'Yul and the person who wrote the dissent, together. Open at dawn on the third day.' Lim Soyul puts the envelope back. 'This is the last thing Grandpa asked for. He didn’t say what’s inside. Keeping us waiting right to the end. That’s so him.'",
      "memo": [
        "Lim Kyungsoo dies: September 15, 4:50 a.m., Ieum Hospital",
        "Memorial portrait: a drawing by Lim Soyul instead of a photo",
        "Chief mourner Lim Jaeyoon -- on a flight from Dubai, arrives tomorrow afternoon",
        "Front of the envelope: 'Open at dawn on the third day'"
      ],
      "choices": {
        "c45_start_notify": {
          "label": "Tell Prosecutor Na Eunho only that the envelope exists"
        },
        "c45_start_open": {
          "label": "Ask to open the envelope now instead of on the third day"
        },
        "c45_start_stay": {
          "label": "Roll up your sleeves and greet mourners beside Lim Soyul"
        },
        "reframe": {
          "label": "Collect when the company called in papers after a death"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Memorial Room 3",
      "clock": "September 15 · Fallen leaves · 19:30 · Wake, Day One",
      "question": "The granddaughter holds an envelope meant to be opened at dawn on the third day. On the first night, what do you do first?",
      "lead": "Five days after the sentencing, a call at dawn brings you running to the memorial room, where a drawing stands in place of a photo."
    },
    "c45_wreath": {
      "title": "Two Wreaths",
      "text": "26 funeral wreaths line the entrance to Memorial Room 3. The two largest stand right beside the portrait. Their ribbons read 'All Employees of KD Financial Group' and a single name, 'Yoon Sanghyuk'. Two people in black suits come in, bow, and hold out an envelope straight away. It is not condolence money. It is a certified letter from Ha Seungwon, a manager on KD Bank’s legal team. 'Please return all bank documents the deceased took out during his employment before the funeral procession. This includes documents in envelope form.' The chief mourner, Lim Jaeyoon, has just arrived and reads the paper with his suitcase still in hand. He looks from one wreath to the other. 'The company that pushed my father out sends flowers, and on the same day tells us to hand over his papers. What kind of funeral is this?'",
      "memo": [
        "26 wreaths -- the two places beside the portrait: KD Financial Group, Yoon Sanghyuk",
        "Legal team demand: all bank documents, returned before the procession",
        "'Including documents in envelope form' -- five people know about the envelope",
        "Chief mourner Lim Jaeyoon lands from Dubai at 13:00"
      ],
      "choices": {
        "c45_wreath_reply": {
          "label": "Write on the spot that you’ll answer formally after the procession"
        },
        "c45_wreath_family": {
          "label": "Ask the family about wreaths and papers; keep legal outside"
        },
        "c45_wreath_ribbon": {
          "label": "Take down Yoon Sanghyuk’s ribbon and ask the florist who sent it"
        },
        "reframe": {
          "label": "Collect when the company called in papers after a death"
        },
        "c45_wreath_evidence_turn": {
          "label": "Light up the margins of the four acquitted approvals"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Memorial Room 3 Entrance",
      "clock": "Wednesday, September 16 · Fallen leaves · 14:00 · Wake, Day Two",
      "question": "The senders of the two wreaths beside the portrait want the deceased’s papers handed over on the same day. What do you do?",
      "lead": "Afternoon of the second day. The line of wreaths runs to the end of the corridor, and the chief mourner has just arrived, pulling his suitcase."
    },
    "c45_stories": {
      "title": "A Night of Grumbling",
      "text": "Once the bowls of yukgaejang are cleared and the soju bottles have been replaced three times, the grumbling about the deceased begins, no one quite first. Kwon Dohyun drops one more envelope into the condolence box. On the front: 'Late fee 1,300 won'. Na Junhyuk makes another cup of instant coffee. '30 years ago, in the rainy season. This man came down to a squid factory in Yeongdong for a site inspection, the road washed out, and he slept three nights in the night-duty room. Know what he wrote in his report when he got back? That instead of collateral, he counted the knife scars on the back of the owner’s hand. 31 of them.' Then the door opens and a man comes in carrying four styrofoam boxes. Yeo Sion, head of Badagyeol Seafood in Yeongdong, the son of that factory owner. 'My father says we can’t send him off without stuffed squid. He told me to be sure to say it was made at the factory that paid off its loan in full.' Lim Soyul looks at you, her finger resting over the record button on her phone.",
      "memo": [
        "Reception room, 23:00 -- 38 mourners remain",
        "Kwon Dohyun’s second envelope: 'Late fee 1,300 won'",
        "Na Junhyuk’s story: rainy season 30 years ago, a site inspection all the way down at the Yeongdong squid factory",
        "Yeo Sion, head of Badagyeol Seafood, four boxes of stuffed squid",
        "Ban Jaewook: in 3 years, never once got coffee at the bookshop -- always barley tea",
        "Kang Taemin: a handwritten thank-you letter came back with three red spelling marks",
        "Kwon Dohyun: signed a borrower’s card at the secondhand bookshop and returned the book 13 days late",
        "Yeongdong squid factory loan -- the one everyone at head office turned down; rain cut the road, three nights in the factory’s night-duty room",
        "Three nights in the duty room learning to gut squid -- burst the ink onto his own shirt on 19 of 20",
        "Yeo Sion’s father: the factory owner who had him count 31 knife scars on his hand; paid the loan off to the last won"
      ],
      "choices": {
        "c45_stories_meeting": {
          "label": "End the laughter here and meet on the legal team’s papers"
        },
        "c45_stories_archive": {
          "label": "With mourners’ consent, keep these stories as a memorial record"
        },
        "c45_stories_stay": {
          "label": "Stay till the stories end and take notes for Lim Soyul too"
        },
        "reframe": {
          "label": "Collect when the company called in papers after a death"
        },
        "c45_stories_evidence_turn": {
          "label": "Light up the margins of the four acquitted approvals"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Memorial Room 3 Reception Room",
      "clock": "September 16 · Fallen leaves · 23:00",
      "question": "On a night when every complaint about the deceased ends as praise, the granddaughter watches you, finger over the record button. What do you do with these stories?",
      "lead": "Late at night, with the mourners thinning out, soju bottles and a kettle of barley tea sit side by side on the reception table."
    },
    "c45_envelope": {
      "title": "Dawn, Day Three",
      "text": "Three hours before the funeral procession, Lim Soyul tears open the envelope. One sheet of paper and two sheets of letter paper come out. The front of the sheet is the last page of a printout of your dissent from 3 years ago, with your e-signature at the bottom. On the back, one line in pencil. 'Returned -- Yoon. Don’t ask why.' Below it is the 'Review Team Head comments' box, which on the copy showed only as a smudge. When you lay your phone light low across it, pencil marks rubbed out with an eraser rise up as letters. 'Agree -- Lim Kyungsoo.' The letter begins like this. 'Yul, and the person who wrote the dissent. That day I wrote agree, then erased it. I was a man with a date already set to leave the bank. Keeping this paper was not protecting your dissent. It was hiding the dissent I never wrote.' Lim Soyul’s hands stop.",
      "memo": [
        "Original, front: last page of the dissent printout, your e-signature",
        "Back: 'Returned -- Yoon. Don’t ask why.'",
        "Review Team Head comments box: erased pencil, 'Agree -- Lim Kyungsoo'",
        "One of the two letter pages is still unread"
      ],
      "choices": {
        "c45_envelope_send": {
          "label": "Read the letter later; send Na Eunho a photo of the original"
        },
        "c45_envelope_log": {
          "label": "Log the opening time and witnesses; seal the original on the spot"
        },
        "c45_envelope_read": {
          "label": "Read both letter pages aloud with Lim Soyul to the end"
        },
        "reframe": {
          "label": "Collect when the company called in papers after a death"
        },
        "c45_envelope_evidence_turn": {
          "label": "Light up the margins of the four acquitted approvals"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Memorial Room 3, Before the Altar",
      "clock": "Thursday, September 17 · Fallen leaves · 05:00, Before Dawn · 3 hours before the procession",
      "question": "In the blank on the back of the original is the 'agree' the deceased erased. What do you do with the letter and the paper?",
      "lead": "Dawn on the third day. As the incense burns nearly down, Lim Soyul sits before the altar with the envelope."
    },
    "c45_final": {
      "title": "The Procession",
      "text": "Lim Jaeyoon holds the memorial tablet, Lim Soyul the drawn portrait. A text from Prosecutor Na Eunho is waiting. 'We file the notice of appeal by midnight tonight. If the family’s consent to submit the original as evidence arrives by 16:00, I can attach a request for handwriting analysis.' Across the way stands Ha Seungwon from the legal team, holding a second certified letter. Lim Soyul takes the envelope out of the inside pocket of her mourning clothes and looks at it. 'By Grandpa’s words, this only goes away if it’s burned. We could send it with him at the cremation today. But Grandpa never burned it, his whole life. If we submit the original, the erased agree goes out with it. People will say Grandpa was a coward.' The funeral director calls the time. 5 minutes.",
      "memo": [
        "Na Eunho: family consent by 16:00 -- handwriting analysis request possible; notice of appeal due at midnight tonight",
        "Legal team’s second demand: return immediately after the procession",
        "Submitting the original also makes the erased 'Agree -- Lim Kyungsoo' public",
        "Cremation at 10:00 -- the envelope could go with him",
        "Pallbearers: Kang Taemin · Oh Jinwoo · Kwon Dohyun · Na Junhyuk · Ban Jaewook · Yeo Sion",
        "Day 7 after the sentencing -- the family may keep the original until the day of analysis"
      ],
      "choices": {
        "c45_final_family": {
          "label": "Let Lim Soyul’s family decide on the original; carry the coffin"
        },
        "c45_final_submit": {
          "label": "Ask the family to submit the original, erased agree and all"
        },
        "c45_final_hold": {
          "label": "Appeal on the copy; save the original for Yoon Sanghyuk"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Ieum Hospital Funeral Hall · In Front of the Hearse",
      "clock": "September 17 · Fallen leaves · 07:40 · Family consent due 16:00",
      "question": "Submitting the original fills Yoon Sanghyuk’s blank, and the deceased’s erased agree gets read with it. 5 minutes before the coffin goes out, what do you do?",
      "lead": "The hearse’s rear door opens, and the six people carrying the coffin share out gloves."
    },
    "c45_aftershock": {
      "title": "The Portrait at the Bookshop",
      "text": "After the ashes are laid to rest, everyone gathers at the secondhand bookshop. Lim Soyul hangs the portrait drawing, now with pupils drawn in, beside the counter. The eyes behind the glasses look this way now. Kwon Dohyun is already working out the shop’s monthly rent and the cost of barley tea. Moon Gaeul sets down a box of rice cakes. 'Last time you grumbled they weren’t steamed enough. These are steamed all the way.' Lee Minseo opens her laptop. 'Grandpa’s dissent disk. It’s the very first record ECHO learned. I want to show ECHO the original of that back page from this morning’s envelope. The erased agree of the man who taught it how to dissent.' Lim Soyul nods as she puts the envelope in her bag. 'Then I’ll bring it. Even though Grandpa cursed machines more than anything.' On Lee Minseo’s screen, an unfamiliar schedule sits next to the name ECHO.",
      "memo": [
        "Lim Kyungsoo’s ashes laid to rest: afternoon of September 17",
        "Beside the counter, 1st floor of the secondhand bookshop: the portrait with its eyes drawn in",
        "Lim Jaeyoon puts off his flight out by a week",
        "Lee Minseo: wants to show ECHO the back page"
      ],
      "choices": {
        "c45_after_record": {
          "label": "Scan the back page with Lim Soyul; file a custody confirmation"
        },
        "c45_after_warm": {
          "label": "Stay with Lim Soyul’s family tonight until the shutter comes down"
        },
        "c45_after_rush": {
          "label": "Go to Pangyo with Lee Minseo, still in black, and find ECHO"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop, 1st Floor · Portrait Beside the Counter",
      "clock": "September 17 · Fallen leaves · 19:40",
      "question": "Before the portrait with its eyes drawn in, a fragment of ECHO waits in a single folder. How do you close this night?"
    },
    "c45_guestbook": {
      "title": "Guestbook, Volume Two",
      "text": "The guestbook at the reception desk moves on to a second volume. Greeting mourners, Do Yoonha stops his pen in front of an old man. The man has run a print shop in Seongsu-dong for 42 years, and beside his name he writes one more line. 'August 2008, the one who was refused a loan.' When Do Yoonha looks up, the old man smiles. 'I went to borrow for two more machines. This man said no, told me to wait just a month. A month later the whole world reeled. If I’d borrowed that money, I’d have gone under that year.' Instead of an envelope, the old man lays a rolled-up calendar on the altar. Next year’s calendar. 'Every year I brought one to the bookshop. I printed this year’s too.'",
      "memo": [
        "Guestbook volume two -- over 400 mourners",
        "Seongsu-dong print shop owner: 'August 2008, the one who was refused a loan'",
        "Next year’s calendar on the altar -- one for the bookshop every year"
      ],
      "choices": {
        "c45_guestbook_choice_1": {
          "label": "Ask him to tell that story to Lim Soyul himself"
        },
        "c45_guestbook_choice_3": {
          "label": "The line is long; thank him and guide the next mourner"
        },
        "c45_guestbook_choice_2": {
          "label": "Add a 'Loans the deceased refused' column to the guestbook"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Reception Desk",
      "clock": "September 16 · Fallen leaves · 17:20",
      "question": "A man who survived because the deceased refused him a loan leaves a calendar behind. What do you do with his story?"
    },
    "c45_portrait": {
      "title": "Unfinished Eyes",
      "text": "In the chief mourner’s lounge, Lim Soyul has taken the portrait drawing out of its frame and rests it on her knees, a marker in her hand. She left the pupils blank, drawing in a hurry. The hand wiping the glasses hid them, so from a distance nobody noticed. 'The eyes I remember are Grandpa’s eyes when he looked at paper. I don’t really know his eyes when he looked at me.' She caps and uncaps the pen. 'What were his eyes like when he read your dissent? That’s what I want to draw.' You never saw that moment. No one saw his face as he read that paper 3 years ago.",
      "memo": [
        "Portrait drawing: the pupils are blank",
        "Lim Soyul’s memory: 'his eyes when he looked at paper'",
        "Five hours until the procession"
      ],
      "choices": {
        "c45_portrait_choice_2": {
          "label": "Suggest matching the eyes to his old ID photo and records"
        },
        "c45_portrait_choice_3": {
          "label": "Suggest leaving the eyes blank and getting ready for the procession"
        },
        "c45_portrait_choice_1": {
          "label": "Admit you don’t know, and gather memories with her"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Chief Mourner’s Lounge",
      "clock": "September 17 · Fallen leaves · 03:10, Before Dawn",
      "question": "The portrait’s pupils are blank, and the granddaughter wants to draw the eyes that read your dissent. How do you answer?"
    },
    "c45_indent": {
      "title": "Pressed Marks",
      "text": "Ban Jaewook takes out a flashlight and lays it almost flat against the paper. These hands have spent 20 years picking out altered documents. 'There’s one more thing besides the erased marks.' Letters are pressed into the top margin of the back. No ink, no pencil dust, only the grooves left by someone pressing hard as they wrote on a sheet laid on top. Ban Jaewook reads them one letter at a time. 'Author’s name -- note it separately. Yoon.' He switches off the flashlight and opens his notebook to the 2023-0412 page. On the fourth line: July 24, and your name. 'For 3 years I didn’t know why your file came all the way up to my desk that day. Someone said to note it separately.'",
      "memo": [
        "Pressed marks: 'Author’s name -- note it separately. Yoon.'",
        "Marks that exist only on the original -- invisible on copies and photos",
        "Ban Jaewook’s notebook, 2023-0412 page, fourth line: July 24, your name"
      ],
      "choices": {
        "c45_indent_choice_3": {
          "label": "Keep this line hidden until the day you face Yoon Sanghyuk"
        },
        "c45_indent_choice_1": {
          "label": "Explain this line to Lim Soyul first, with Ban Jaewook"
        },
        "c45_indent_choice_2": {
          "label": "Leave the marks alone; send the whole original to an examiner"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Table in the Chief Mourner’s Lounge",
      "clock": "September 17 · Fallen leaves · 05:30, Before Dawn",
      "question": "Pressed marks left only on the original tell why your name was noted separately. What do you do with this line?"
    },
    "c45_guestbook_reaction": {
      "title": "The August Graduation",
      "text": "On the outdoor bench behind the memorial room, Lim Jaeyoon cracks open a can of coffee. For 11 years he has been building plants in the Dubai desert that turn seawater into drinking water. 'That calendar man says he marks the day my father turned him down. August 22, 2008.' He laughs. It is not a smiling face. 'That was my college graduation. A late-summer ceremony, so the hall was half empty, and my father’s seat was empty too. He remembers some stranger’s print-shop machines, though.' The can slowly crumples. 'After the procession, I’m sending all the paper in the bookshop for pulping. Like my father said. It only goes away if you burn it, right?'",
      "memo": [
        "August 22, 2008: the day of the refusal, the day of the graduation",
        "'After the procession, the paper goes for pulping'"
      ],
      "choices": {
        "c45_guestbook_reaction_choice_1": {
          "label": "Stay and listen until he finishes the graduation story"
        },
        "c45_guestbook_reaction_choice_2": {
          "label": "Suggest making a list before the paper goes anywhere"
        },
        "c45_guestbook_reaction_choice_3": {
          "label": "Call it family business, add nothing, and leave"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Outdoor Bench Behind the Memorial Room",
      "clock": "September 16 · Fallen leaves · 18:05",
      "question": "The day of the refusal was the son’s graduation day, and the son says he will send the paper for pulping. What do you do?"
    },
    "c45_portrait_reaction": {
      "title": "The Box He Left Empty",
      "text": "In front of Memorial Room 3 stands Han Seoyun in a black coat, on standby for six months now and unable to go to work. She says she stood there 30 minutes without coming in. She is the one who returned your dissent 3 years ago. After bowing, she comes out and leans against the wall. 'He called me last month. The first time ever. He said just one thing. I saw your box too. I left a box empty myself.' Han Seoyun taps the wall once with a finger. 'He hung up before I could ask which box. I thought he meant my return.'",
      "memo": [
        "Lim Kyungsoo’s call last month: 'I left a box empty myself'",
        "The memorial room the one who returned it could not enter for 30 minutes"
      ],
      "choices": {
        "c45_portrait_reaction_choice_1": {
          "label": "Bring Han Seoyun inside and introduce her to Lim Soyul"
        },
        "c45_portrait_reaction_choice_2": {
          "label": "Write down the date and words of that call exactly"
        },
        "c45_portrait_reaction_choice_3": {
          "label": "Tell her it’s late and she should go home and rest"
        }
      },
      "place": "Ieum Hospital Funeral Hall · In Front of Memorial Room 3",
      "clock": "September 17 · Fallen leaves · 04:00, Before Dawn",
      "question": "The one who returned your dissent says the deceased called her: 'I left a box empty myself.' What do you do?"
    },
    "c45_indent_reaction": {
      "title": "The Letter’s Second Page",
      "text": "Around sunrise, on the outdoor bench behind the memorial room, Lim Jaeyoon reads the second page of the letter. Lim Soyul handed it to him, saying it was his. The first line is a date. 'August 22, 2008.' Below it: 'Jaeyoon. That day I was looking at a print shop’s papers from Seongsu-dong. It was your graduation day. I write that date here. I write that I am sorry. Writing it on paper is how I keep from forgetting. Not that I ever forgot.' Lim Jaeyoon looks at the paper for a long time. A sound comes out, laughing or crying, hard to tell. 'Even his apologies come as paperwork. And this one took 18 years.' He folds the letter into his shirt pocket. 'I won’t send the bookshop paper for pulping. I think I’ll read some of it myself.'",
      "memo": [
        "Second page: 'August 22, 2008, I write that I am sorry'",
        "The bookshop paper will not go for pulping"
      ],
      "choices": {
        "c45_indent_reaction_choice_3": {
          "label": "Say the procession is near and hurry the preparations"
        },
        "c45_indent_reaction_choice_1": {
          "label": "Step away quietly so he can read the letter to the end"
        },
        "c45_indent_reaction_choice_2": {
          "label": "Gently ask to keep this letter with the original too"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Outdoor Bench Behind the Memorial Room",
      "clock": "September 17 · Fallen leaves · 06:20",
      "question": "An apology 18 years late is written on the letter’s second page. What do you do beside the son reading it?"
    },
    "c45_branch_ribbon": {
      "title": "The Ribbon’s Handwriting",
      "text": "You carry the ribbon to the end of the corridor and dial the florist’s number on the wreath stand. The florist in Yeouido says little at first, but when Oh Jinwoo says, 'The late gentleman’s granddaughter wants to know who sent it,' a photo of the order form arrives. It was not a secretariat card. Yoon Sanghyuk came to the shop himself yesterday evening, paid with his personal card, and left the ribbon wording written in pencil. The original wording is crossed out. 'In his debt, Yoon Sanghyuk.' The florist said it would not all fit on the ribbon, so only the name stayed. Oh Jinwoo zooms in on the photo. The last stroke of 'Yoon' hooks upward. It is the same stroke as 'Returned -- Yoon' on the back of the dissent copy from 3 years ago.",
      "memo": [
        "Ordered by: Yoon Sanghyuk himself, personal card, September 15, 19:00",
        "Original wording, crossed out: 'In his debt, Yoon Sanghyuk'",
        "Pencil 'Yoon' -- the last stroke hooks upward",
        "Compare with: 'Returned -- Yoon' on the back of the dissent copy"
      ],
      "choices": {
        "c45_branch_ribbon_a": {
          "label": "Bring the ribbon back; let Lim Soyul decide to hang it or not"
        },
        "c45_branch_ribbon_b": {
          "label": "Get the florist’s original order form; seal it for comparison"
        },
        "c45_branch_ribbon_c": {
          "label": "Pass only the photo to Seo Harin; quietly rehang the ribbon"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Memorial Room Lined with Wreaths",
      "clock": "September 16 · Fallen leaves · 14:40",
      "question": "The hand that penciled the ribbon wording looks like the hand behind 'Returned -- Yoon' 3 years ago. What do you do with this ribbon?"
    },
    "c45_branch_ribbon_follow": {
      "title": "A Mourner Who Came Alone",
      "text": "In a lull between mourners, Yoon Sanghyuk walks into Memorial Room 3 alone. No lawyer, no secretary. Lim Jaeyoon starts to rise, and Lim Soyul catches his sleeve. Yoon Sanghyuk looks at the drawn portrait for a long time, bows twice, and his hand trembles once as he sets the incense. When he lays a white envelope in front of the condolence box, Lim Soyul shakes her head. He puts the envelope away. On his way out, he stops beside you. 'He waited for my name to the very end. Holding one sheet of paper.' His voice is low. 'I won’t talk about that here. This place is his.' He walks past the guestbook with no pen in his hand. At the reception desk, Do Yoonha holds a pen and looks at him.",
      "memo": [
        "16:40 Yoon Sanghyuk pays respects alone -- no entourage",
        "Condolence envelope: refused by Lim Soyul",
        "'I won’t talk about that here'",
        "Guestbook: his name is not there yet"
      ],
      "choices": {
        "c45_branch_ribbon_follow_b": {
          "label": "Ask him to sign the guestbook in his own hand before he goes"
        },
        "c45_branch_ribbon_follow_c": {
          "label": "Follow him out and ask now about that box from 3 years ago"
        },
        "c45_branch_ribbon_follow_a": {
          "label": "Stand silently by Lim Soyul until he leaves the room"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Memorial Room 3",
      "clock": "September 16 · Fallen leaves · 16:40",
      "question": "The man who kept the paper buried came alone to pay respects, and his name is not yet in the guestbook. What do you do?"
    },
    "c45_route_system": {
      "title": "The Papers of the Dead",
      "text": "A demand from KD Bank’s legal team has reached the memorial room: return all of the deceased’s documents before the funeral ends. Before writing a reply, you suggest gathering when the company has called in papers from people who died, and Lee Minseo opens her laptop in the reception room. She lays the material Seo Harin collected over published court rulings. Over the past 10 years, KD Financial Group sent 23 certified letters to retirees or their bereaved families demanding the 'return of company documents'. 19 of them arrived within a week of the person’s death. In 17, the family sent the boxes back without even opening them. Not one record says where the returned boxes were opened. Lee Minseo turns the screen around. 'When someone dies, their papers get called in first. While everyone is too busy with the funeral to read them.'",
      "memo": [
        "19 of 23 document-return demands: within a week of the death",
        "17 boxes the families sent back unopened",
        "Opening records for the returned boxes: 0"
      ],
      "choices": {
        "c45_route_system_grace": {
          "label": "Propose a rule: a 49-day grace on return demands to families"
        },
        "c45_route_system_drop": {
          "label": "Set the numbers aside and hold the funeral first"
        },
        "c45_route_system_publish": {
          "label": "Share the numbers with Seo Harin and the mourners at once"
        },
        "c45_route_system_evidence_turn": {
          "label": "Light up the margins of the four acquitted approvals"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Laptop in the Reception Room Corner",
      "clock": "September 16 · Fallen leaves · 21:30",
      "question": "Within a week of a death, the company calls in the papers first. What do you do with these numbers?"
    },
    "c45_final_system_route": {
      "title": "Who Reads First",
      "text": "Two in the morning. A few mourners and the smell of cold yukgaejang linger in the reception room. On the laptop in the corner, Lee Minseo lines up the 23 cases by arrival date. 19 came within a week of a death. The 24th line is the demand handed over in the memorial room yesterday afternoon. One day after Lim Kyungsoo died. Lee Minseo lowers her voice. 'The families never got to open those 17 boxes they sent back. And there’s no record of who opened them after. Grandpa’s envelope opens in three hours. This time the family reads it first.'",
      "memo": [
        "19 of 23 document-return demands: within a week of the death",
        "Legal team demand arrived one day after Lim Kyungsoo died",
        "Envelope: to be opened at 5 a.m. today"
      ],
      "choices": {
        "c45_final_system_route_b": {
          "label": "Leave the rules as they are; block only this return demand"
        },
        "c45_final_system_route_a": {
          "label": "Propose a family right to read the deceased’s papers first"
        },
        "c45_final_system_route_c": {
          "label": "Demand the 17 unopened boxes go back to the families"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Laptop in the Reception Room Corner",
      "clock": "September 17 · Fallen leaves · 02:15, Before Dawn",
      "question": "The 17 returned boxes reached the company before the families read them. How do you fix who reads the deceased’s papers first?"
    },
    "c45_evidence_turn": {
      "title": "The Same Pencil",
      "text": "When you lay the clue over the scans, the approval documents for the four cases acquitted at first instance come up side by side. These are the printout scans where no approver could be named because the approvals came from a shared account. Lee Minseo turns the contrast all the way up, and on all four sheets, erased pencil marks rise in the right margin. The same sentence. 'Don’t ask why.' Ban Jaewook sets the copy of the dissent’s back page beside them. 'Returned -- Yoon. Don’t ask why.' Scans and copies cannot support a handwriting analysis. Only one sheet keeps the pressure and stroke order alive: the original that came out of the envelope this morning. Its comments box still holds the 'agree' Lim Kyungsoo wrote and erased. Ban Jaewook writes in his notebook. 'One sheet of paper can fill four blanks.' Then he says, 'The moment it fills them, the erased agree gets read too.'",
      "memo": [
        "Margins of the 4 acquitted approval documents: erased pencil, 'Don’t ask why'",
        "The one original that allows handwriting analysis: Lim Kyungsoo’s back page",
        "Notice of appeal due: midnight, September 17"
      ],
      "choices": {
        "c45_evidence_turn_submit": {
          "label": "Request handwriting analysis of the four sheets and the original"
        },
        "c45_evidence_turn_hold": {
          "label": "Note the pencil marks; use them as a card with the legal team"
        },
        "c45_evidence_turn_family": {
          "label": "Explain this link to Lim Soyul’s family before submitting"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Chief Mourner’s Room, Inside",
      "clock": "September 17 · Fallen leaves · 06:40",
      "question": "The same pencil sentence sits in the margins of four acquitted blanks, and there is only one original. How do you use this link?"
    },
    "c45_start_warm": {
      "title": "Wake for the Man Who Knew His Rice Cakes",
      "text": "On the night of the sentencing, 11 people stood by the window of his room at Ieum Hospital, carrying the leftover rice cakes. Instead of talking about the ruling, Lim Kyungsoo said only, 'These rice cakes are underdone,' and when Moon Gaeul said, 'You’re eating them all, though,' he laughed out loud for the first time. That night was the last conversation. Five days later, at 4:50 a.m., he died. In the portrait’s place in Memorial Room 3 stands the drawing Lim Soyul made overnight, and before the altar sits a plate of rice cakes Moon Gaeul brought. Her father, the chief mourner, is still on the plane, so Lim Soyul keeps his place. She takes out a yellowed envelope. 'Open at dawn on the third day. He gave it to me that night after the rice cakes. Yul and the person who wrote the dissent are to open it together.'",
      "memo": [
        "Hospital room on the night of the sentencing: 11 people, a bundle of rice cakes",
        "Lim Kyungsoo’s last words: 'These rice cakes are underdone'",
        "Front of the envelope: 'Yul and the person who wrote the dissent, together'"
      ],
      "choices": {
        "c45_start_warm_signature": {
          "label": "Draw up a three-day wake rota with the 11 from that night"
        },
        "c45_start_warm_notify": {
          "label": "Tell Prosecutor Na Eunho only that the envelope exists"
        },
        "c45_start_warm_stay": {
          "label": "Roll up your sleeves and greet mourners beside Lim Soyul"
        },
        "c45_start_warm_open": {
          "label": "Ask to open the envelope now instead of on the third day"
        },
        "c45_start_warm_reframe": {
          "label": "Collect when the company called in papers after a death"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Memorial Room 3",
      "clock": "September 15 · Fallen leaves · 19:30 · Wake, Day One",
      "question": "The 11 from that night have gathered again at the wake of the man who knew his rice cakes. How do you keep the three days?",
      "lead": "The 11 who stood together by the hospital window gather again in black, five days later."
    },
    "c45_start_record": {
      "title": "Wake for the Man Who Heard the Explainer",
      "text": "The ruling explainer was finished at two in the morning, and in the morning you went to his hospital room and read him the first sentence aloud. 'A blank is not an acquittal.' With his eyes closed, Lim Kyungsoo held out his hand for a red pen. Then he fixed one spacing error in the second line. That was his last correction. Five days later, before dawn, he died. In the portrait’s place in Memorial Room 3 stands the drawing by Lim Soyul. Her father, the chief mourner, is still on the plane, so Lim Soyul keeps his place. She sets a yellowed envelope down beside the explainer. 'We open it at dawn on the third day. That’s what Grandpa said when he put down the red pen. Keep to the order.'",
      "memo": [
        "First sentence of the explainer: 'A blank is not an acquittal'",
        "Lim Kyungsoo’s last correction: one spacing fix",
        "Front of the envelope: 'Open at dawn on the third day'"
      ],
      "choices": {
        "c45_start_record_signature": {
          "label": "Turn the red-penned explainer into a notice for mourners"
        },
        "c45_start_record_notify": {
          "label": "Tell Prosecutor Na Eunho only that the envelope exists"
        },
        "c45_start_record_open": {
          "label": "Ask to open the envelope now instead of on the third day"
        },
        "c45_start_record_stay": {
          "label": "Roll up your sleeves and greet mourners beside Lim Soyul"
        },
        "c45_start_record_reframe": {
          "label": "Collect when the company called in papers after a death"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Memorial Room 3",
      "clock": "September 15 · Fallen leaves · 19:30 · Wake, Day One",
      "question": "Beside the explainer with his last correction lies an envelope that says to keep to the order. What do you do first?",
      "lead": "You stand at the entrance to the memorial room, the explainer with its red-pen mark still in your bag."
    },
    "c45_start_rush": {
      "title": "Wake of Two Missed Calls",
      "text": "On the night of the sentencing, you worked out the grounds for appeal with Na Eunho until the lights went off at the prosecutors’ office. Meanwhile two missed calls from Lim Soyul piled up. When you went to the hospital the next morning, Lim Kyungsoo was asleep, and he did not open his eyes again while you were there. Five days later, at 4:50 a.m., he died. In Memorial Room 3, Lim Soyul, standing in for the chief mourner, sees you and says nothing for a moment. Then she shows you her phone’s call log. 'Those two calls. I made them because Grandpa said your name twice.' She takes out a yellowed envelope. 'Let’s open this together at dawn on the third day. This time, come.'",
      "memo": [
        "Night of the sentencing: at the prosecutors’ office until 23:00",
        "2 missed calls -- the number of times Lim Kyungsoo said your name",
        "Front of the envelope: 'Open at dawn on the third day'"
      ],
      "choices": {
        "c45_start_rush_signature": {
          "label": "Tell Lim Soyul, without excuses, why you missed those calls"
        },
        "c45_start_rush_notify": {
          "label": "Tell Prosecutor Na Eunho only that the envelope exists"
        },
        "c45_start_rush_stay": {
          "label": "Roll up your sleeves and greet mourners beside Lim Soyul"
        },
        "c45_start_rush_open": {
          "label": "Ask to open the envelope now instead of on the third day"
        },
        "c45_start_rush_reframe": {
          "label": "Collect when the company called in papers after a death"
        }
      },
      "place": "Ieum Hospital Funeral Hall · Memorial Room 3",
      "clock": "September 15 · Fallen leaves · 19:30 · Wake, Day One",
      "question": "The two missed calls were the number of times he said your name. What do you do first at this wake?",
      "lead": "The draft grounds for appeal you wrote at the prosecutors’ office are still in your bag."
    }
  },
  "echoReplies": {
    "c45_start_stay": "You stand beside her, and Lim Soyul tugs your sleeve every time she gets the order of the bows wrong. On the first night, the two of you bow together to 196 mourners.",
    "c45_start_notify": "You tell Na Eunho, and the reply comes within 1 minute. 'Call the moment it’s open.' Lim Soyul learns later that word of the envelope went to the prosecutors first.",
    "c45_start_open": "When you say to open it now, Lim Soyul presses the envelope to her chest. 'Grandpa set the order.' The envelope stays shut, and a day’s worth of distance opens between you.",
    "c45_wreath_family": "When you ask the family, Lim Jaeyoon moves Yoon Sanghyuk’s wreath to the end of the corridor. Ha Seungwon stands outside the entrance for two hours, then leaves only a business card.",
    "c45_wreath_reply": "Handed your written reply, Ha Seungwon looks up from the papers for the first time. 'If it’s after the procession, I’ll pass that on upstairs.' Ha Seungwon pauses briefly at the condolence box, then walks on.",
    "c45_wreath_ribbon": "When you take the ribbon down, Lim Jaeyoon takes your side for the first time. Lim Soyul stares at the empty spot for a long time. Her face says flowers are flowers, whoever sent them.",
    "c45_stories_stay": "You take notes, and by two in the morning 23 complaints fill the notebook. Lim Soyul gives it a title. 'Grandpa’s Complaints Collection -- All of It Praise.'",
    "c45_stories_archive": "When you ask for consent, Yeo Sion raises his hand first. At the top of the recording, the squid-ink story goes in once more, longer this time.",
    "c45_stories_meeting": "The meeting opens and the laughter cools. The response draft is ready within an hour. Na Junhyuk’s story stays stopped at 31 knife scars.",
    "c45_envelope_read": "As you read aloud, Lim Soyul chokes up at the second page. You read on for her. It takes 11 minutes to reach the end.",
    "c45_envelope_log": "The opening record reads 5:07 a.m., four witnesses. Lim Soyul draws a tiny pair of glasses next to her name.",
    "c45_envelope_send": "The photo goes to Na Eunho at 5:12. 'Need the original.' While the reply comes in, Lim Soyul reads the letter alone.",
    "c45_final_family": "You lift the coffin, and Lim Soyul climbs into the hearse still holding the envelope. Where the original goes, the family decides among themselves in the crematorium waiting room. 16:00 may pass in the meantime.",
    "c45_final_submit": "Hearing your request, Lim Jaeyoon signs the consent form first. It reaches the prosecutors’ office at 3:40 p.m., and the next day an article carries the sentence 'The deceased also agreed, but erased it.' Lim Soyul, the original still in her bag, pins that article beside her grandfather’s drawing.",
    "c45_final_hold": "The copy goes in with the notice of appeal before midnight. Na Eunho’s reply is short. 'A copy can’t be analyzed. When do we get the original?' Lim Soyul pushes the envelope deep into her bag.",
    "c45_after_warm": "You stay, and in the shop with its shutter down, Lim Jaeyoon walks between his father’s bookshelves for the first time. The fragment of ECHO waits one more night inside the laptop.",
    "c45_after_record": "The scanning finishes slowly, one sheet at a time. Both your names go on two confirmations, and you each keep one. In the enlarged scan, Lim Soyul’s finger stops once beside the reviewer box.",
    "c45_after_rush": "On your way out, Lim Soyul hands you the envelope. 'Take it ahead. I’ll come tomorrow.' Only the portrait drawing and the family remain at the bookshop, and Moon Gaeul packs one more box of rice cakes for you to take.",
    "c45_guestbook_choice_1": "The old man sits down in front of Lim Soyul and unrolls the calendar. Every year there is a small circle in the August page. The day he was refused, he says.",
    "c45_guestbook_choice_2": "Once the column exists, names start to fill it. By ten at night, 11 people have written in it. Every entry ends with 'Thank you.'",
    "c45_guestbook_choice_3": "The line moves faster. The old man leaves only the calendar and slips out, and his story stays a single line in the guestbook.",
    "c45_portrait_choice_1": "When you say you don’t know, Lim Soyul actually smiles. Until four in the morning, six people each add one memory. Every one is a moment of him wiping his glasses.",
    "c45_portrait_choice_2": "The eyes in the ID photo are thirty-two years old. Drawn exactly, they look like him, but Lim Soyul says they don’t look like Grandpa.",
    "c45_portrait_choice_3": "The portrait without eyes goes into the hearse. From a distance no one can tell. Only Lim Soyul knows.",
    "c45_indent_choice_1": "After hearing the explanation, Lim Soyul looks at the paper for a long time. 'Grandpa must have known about this line too. That’s why he didn’t burn it.'",
    "c45_indent_choice_2": "Handed over whole, the original keeps the marks intact. In return, the envelope leaves the family’s hands today.",
    "c45_indent_choice_3": "The line you saved is safe. Ban Jaewook closes his notebook and, alone for a few more days, swallows the reason he went 3 years without knowing.",
    "c45_guestbook_reaction_choice_1": "As you listen, Lim Jaeyoon talks about the photo he took alone on graduation day. His mortarboard was crooked, he says. There was no one to straighten it.",
    "c45_guestbook_reaction_choice_2": "At the mention of a list, Lim Jaeyoon snorts. 'You sound exactly like my father.' Still, he doesn’t call the paper recycler.",
    "c45_guestbook_reaction_choice_3": "You leave, and only a crushed can and Lim Jaeyoon remain on the bench. A paper recycler’s number glows on his phone screen.",
    "c45_portrait_reaction_choice_1": "After the introduction, Lim Soyul looks at Han Seoyun for a long while. Then she sets out one more cushion before her grandfather’s drawing.",
    "c45_portrait_reaction_choice_2": "The line you wrote down becomes a dated record. Han Seoyun reads it and says, 'I’ll testify to this.'",
    "c45_portrait_reaction_choice_3": "Told to go home, Han Seoyun bows her head and leaves. At the elevator she looks back once.",
    "c45_indent_reaction_choice_1": "You step away, and from the bench comes a long sound like coughing. When you return, Lim Jaeyoon has buttoned his shirt all the way up.",
    "c45_indent_reaction_choice_2": "When you suggest keeping it together, Lim Jaeyoon hesitates, then shakes his head. 'This page is mine. You can have the other one.'",
    "c45_indent_reaction_choice_3": "When you say to hurry, Lim Jaeyoon stands. The letter goes into his pocket half read.",
    "c45_branch_ribbon_a": "Lim Soyul takes the ribbon, thinks for a long time, then hangs it at the very end of the wreaths. 'If he’s in debt, he can stand at the back of the line.'",
    "c45_branch_ribbon_b": "The original order form arrives in a plastic bag. The florist adds one thing. 'That man erased the wording three times while writing it.'",
    "c45_branch_ribbon_c": "The photo goes to Seo Harin, and the ribbon goes back in its place. That night, the draft article’s headline is 'In His Debt'. Lim Soyul does not know about the draft.",
    "c45_branch_ribbon_follow_a": "You stay beside her, and Lim Soyul keeps her head up until Yoon Sanghyuk’s back disappears behind the elevator doors. She does not lower it once.",
    "c45_branch_ribbon_follow_b": "At your request, Yoon Sanghyuk takes Do Yoonha’s pen. In the guestbook field he writes 'Yoon Sanghyuk'. The last stroke hooks upward. It is the first name he has written inside a field in 3 years.",
    "c45_branch_ribbon_follow_c": "When you ask in the corridor, Yoon Sanghyuk presses the elevator button. 'I said this isn’t talk for a house of mourning.' The doors close, and inside the memorial room, Lim Soyul is looking for you.",
    "c45_route_system_publish": "You share it, and a few mourners take out their phones. Two of them talk about boxes they sent back last year. They never opened those either.",
    "c45_route_system_grace": "At the number 49, Na Junhyuk nods. 'You wait at least until the 49th-day rite. That’s what decent people do.' The draft rule is written in plain human words from the first line.",
    "c45_route_system_drop": "You set it aside, and the funeral flows on quietly. 23 cases may become 24.",
    "c45_final_system_route_a": "Once the right to read first exists, returns slow down. In the time that buys, families learn whose paper it is.",
    "c45_final_system_route_b": "Blocking only this demand keeps Lim Kyungsoo’s papers safe. The next family gets the same envelope on the same day.",
    "c45_final_system_route_c": "Asked to return them, the legal team answers that there is no list of the boxes to begin with. That answer becomes a record too.",
    "c45_evidence_turn_submit": "Once the formal request goes in, the four blanks become subjects of analysis. The result comes out at the appeal. The erased agree goes into that file too.",
    "c45_evidence_turn_hold": "With it held as a card, the second demand from legal team manager Ha Seungwon never comes. Instead, the four blanks stay blank for a while.",
    "c45_evidence_turn_family": "After the explanation, Lim Soyul’s father, Lim Jaeyoon, speaks first. 'I can’t rewrite what my father erased, but I won’t stop you submitting it.' The explanation takes an hour.",
    "c45_wreath_evidence_turn": "Lit at the same brightness, the four blanks hold one sentence. The only original with that sentence pressed in pencil is the one sheet Lim Kyungsoo held on to until the end.",
    "c45_stories_evidence_turn": "Lit at the same brightness, the four blanks hold one sentence. The only original with that sentence pressed in pencil is the one sheet Lim Kyungsoo held on to until the end.",
    "c45_envelope_evidence_turn": "Lit at the same brightness, the four blanks hold one sentence. The only original with that sentence pressed in pencil is the one sheet Lim Kyungsoo held on to until the end.",
    "c45_route_system_evidence_turn": "Lit at the same brightness, the four blanks hold one sentence. The only original with that sentence pressed in pencil is the one sheet Lim Kyungsoo held on to until the end.",
    "case45_memory_system": "The demand is only a list of documents to return; there is nowhere for the table to shift. Lee Minseo gathers the dates on which demands like this have arrived.",
    "case45_memory_evidence": "On one screen, the right margin beside each blank field is smudged. Turn up the contrast and erased pencil marks rise.",
    "c45_start_warm_stay": "You stand beside her, and Lim Soyul tugs your sleeve every time she gets the order of the bows wrong. On the first night, the two of you bow together to 196 mourners.",
    "c45_start_warm_notify": "You tell Na Eunho, and the reply comes within 1 minute. 'Call the moment it’s open.' Lim Soyul learns later that word of the envelope went to the prosecutors first.",
    "c45_start_warm_open": "When you say to open it now, Lim Soyul presses the envelope to her chest. 'Grandpa set the order.' The envelope stays shut, and a day’s worth of distance opens between you.",
    "c45_start_warm_signature": "Once the rota goes up, the memorial room is never empty. In the dawn-shift column, Kang Taemin writes his name three times.",
    "c45_start_record_stay": "You stand beside her, and Lim Soyul tugs your sleeve every time she gets the order of the bows wrong. On the first night, the two of you bow together to 196 mourners.",
    "c45_start_record_notify": "You tell Na Eunho, and the reply comes within 1 minute. 'Call the moment it’s open.' Lim Soyul learns later that word of the envelope went to the prosecutors first.",
    "c45_start_record_open": "When you say to open it now, Lim Soyul presses the envelope to her chest. 'Grandpa set the order.' The envelope stays shut, and a day’s worth of distance opens between you.",
    "c45_start_record_signature": "At the top of the notice, the corrected spacing stays just as he marked it. Mourners see that one space and recognize the deceased.",
    "c45_start_rush_stay": "You stand beside her, and Lim Soyul tugs your sleeve every time she gets the order of the bows wrong. On the first night, the two of you bow together to 196 mourners.",
    "c45_start_rush_notify": "You tell Na Eunho, and the reply comes within 1 minute. 'Call the moment it’s open.' Lim Soyul learns later that word of the envelope went to the prosecutors first.",
    "c45_start_rush_open": "When you say to open it now, Lim Soyul presses the envelope to her chest. 'Grandpa set the order.' The envelope stays shut, and a day’s worth of distance opens between you.",
    "c45_start_rush_signature": "Hearing you out, Lim Soyul nods. 'Grandpa would have done the same. For work.' You cannot tell whether that is comfort or not."
  },
  "choiceVoiceLines": {
    "c45_start_stay": "Since the one standing alone in the chief mourner’s place comes first, you roll up your mourning sleeves and greet mourners beside Lim Soyul.",
    "c45_start_notify": "So no one can later say you hid it, you tell Prosecutor Na Eunho only that the envelope exists.",
    "c45_start_open": "Saying no one knows what could happen in two days, you ask to open the envelope now instead of waiting for the third day.",
    "c45_wreath_family": "Saying this place belongs to the chief mourner who just arrived, you ask the family about the wreaths and papers first and keep the legal team outside the entrance.",
    "c45_wreath_reply": "Saying even a demand made at a wake needs a record of the answer, you write on the spot that you will reply through formal channels after the procession.",
    "c45_wreath_ribbon": "Unable to just look at that name hanging beside the portrait, you take Yoon Sanghyuk’s ribbon down and press the florist on who sent it.",
    "c45_stories_stay": "So the granddaughter can put her hand down and simply laugh, you stay until the stories end and take notes for Lim Soyul too.",
    "c45_stories_archive": "Before the complaints and the 31 knife scars scatter, you get the mourners’ consent and keep these stories as a memorial record.",
    "c45_stories_meeting": "With the deadline to hand everything over before the procession closing in, you end the laughter here and hold a meeting on the legal team’s papers.",
    "c45_envelope_read": "With one letter page still left, you read both pages aloud with Lim Soyul to the end.",
    "c45_envelope_log": "So no one can later say it was tampered with, you log the opening time and the witnesses and seal the original on the spot.",
    "c45_envelope_send": "With only three hours until the procession, you read the letter later and send Na Eunho a photo of the original first.",
    "c45_final_family": "Since the one who will be called a coward is that family’s grandfather, you leave the original’s path to Lim Soyul’s family and carry the coffin with them.",
    "c45_final_submit": "Saying the reason he never burned it, all his life, is right there, you ask the family to submit the original as evidence, erased agree and all.",
    "c45_final_hold": "Saying you cannot press a family for an answer in 5 minutes, you file the appeal with only the copy attached and save the original for the day you put it in front of Yoon Sanghyuk.",
    "c45_after_warm": "Since it is the first night after the ashes were laid to rest, you stay with Lim Soyul’s family tonight until the shutter comes down.",
    "c45_after_record": "Before the envelope leaves in a bag, you scan the original back page with Lim Soyul and file it with a custody confirmation.",
    "c45_after_rush": "Uneasy about the unfamiliar schedule on the screen, you go to Pangyo with Lee Minseo, still in mourning clothes, and look for ECHO first.",
    "c45_guestbook_choice_1": "Since there is a grandfather here the granddaughter does not know, you ask him to tell that story to Lim Soyul himself.",
    "c45_guestbook_choice_2": "Sensing there are more grateful refusals out there, you add a separate 'Loans the deceased refused' column to the guestbook.",
    "c45_guestbook_choice_3": "With over four hundred mourners and a long line, you take his condolences and guide the next mourner forward.",
    "c45_portrait_choice_1": "Since you cannot pretend to have seen that moment, you admit you don’t know and gather memories with her.",
    "c45_portrait_choice_2": "Since you cannot make up eyes you never saw, you suggest finding his old ID photo and records to match the eyes.",
    "c45_portrait_choice_3": "Saying no one will notice from a distance, you suggest leaving the eyes blank and moving on to preparing for the procession.",
    "c45_indent_choice_1": "Saying the family that guarded the envelope should know first, you explain what this line means to Lim Soyul first, with Ban Jaewook.",
    "c45_indent_choice_2": "Since these marks survive on neither copies nor photos, you suggest leaving them untouched and sending the whole original to an examiner.",
    "c45_indent_choice_3": "Saying a leak would buy the other side time to prepare, you keep this line among yourselves for now and save it for the day you put it in front of Yoon Sanghyuk.",
    "c45_guestbook_reaction_choice_1": "Since the one who saw the empty seat should be heard first, you stay beside him until he finishes the graduation story.",
    "c45_guestbook_reaction_choice_2": "Saying that once it is pulped no one will even know what was there, you suggest making a list before the paper goes anywhere.",
    "c45_guestbook_reaction_choice_3": "Saying there is no place for you between a father and his son, you add nothing to a family matter and leave.",
    "c45_portrait_reaction_choice_1": "Since she stood for 30 minutes unable to come in, you bring Han Seoyun into the memorial room and introduce her to Lim Soyul.",
    "c45_portrait_reaction_choice_2": "So you can later work out which box he meant, you write down the date and the words of that call exactly.",
    "c45_portrait_reaction_choice_3": "Since she has bowed and it is very late, you tell her to go home and rest for tonight.",
    "c45_indent_reaction_choice_1": "So he can read a letter that took 18 years on his own to the end, you quietly step away.",
    "c45_indent_reaction_choice_2": "Saying a dated apology is also a record the deceased left, you gently ask to keep this letter with the original.",
    "c45_indent_reaction_choice_3": "Saying the hearse won’t wait, you suggest hurrying the preparations as the procession nears.",
    "c45_branch_ribbon_a": "Saying it is the granddaughter’s call whether to accept a man in his debt, you bring the ribbon back and let Lim Soyul decide whether to hang it.",
    "c45_branch_ribbon_b": "Saying the hooked stroke must survive on paper, not in a photo, you get the original order form from the florist and seal it for handwriting comparison.",
    "c45_branch_ribbon_c": "Saying word can get out without disturbing the wake, you pass only the photo to Seo Harin and quietly hang the ribbon back in place.",
    "c45_branch_ribbon_follow_a": "Since he is right that this place belongs to the deceased, you stand silently beside Lim Soyul until he leaves the memorial room.",
    "c45_branch_ribbon_follow_b": "Saying his visit should stand in his own handwriting, you ask him to write his name in the guestbook himself before he goes.",
    "c45_branch_ribbon_follow_c": "Saying that if he won’t talk in the memorial room you can listen outside, you follow him into the corridor and ask now about that box from 3 years ago.",
    "c45_route_system_publish": "So the next family to get a demand knows in advance, you share the numbers with Seo Harin and the mourners at the same time.",
    "c45_route_system_grace": "To put into a rule the fact that no one can read anything during a funeral, you propose a 49-day grace period on return demands sent to bereaved families.",
    "c45_route_system_drop": "Saying a wake is no place to bring out numbers, you set the statistics aside and hold the funeral first.",
    "c45_final_system_route_a": "So the next family can read first too, you propose writing into company rules the family’s right to read the deceased’s papers first.",
    "c45_final_system_route_b": "Saying the one thing to protect today is this envelope, you leave the rules as they are and block only this return demand.",
    "c45_final_system_route_c": "Saying they cannot be left with no record of who opened them, you demand that the 17 boxes sent back unopened be returned to the families.",
    "c45_evidence_turn_submit": "Since this one sheet is the only paper that can fill the four blanks, you bundle the four sheets of pencil marks with the original back page and formally request a handwriting analysis.",
    "c45_evidence_turn_hold": "Saying this is where the strength to protect the original comes from, you keep the pencil marks in mind and use them as a card in the return talks with the legal team.",
    "c45_evidence_turn_family": "Since the erased agree gets read the moment the blanks are filled, you explain this link to Lim Soyul’s family before submitting the original.",
    "c45_wreath_evidence_turn": "You light the approval documents of the four acquitted cases at the same brightness as the clue and check what is left in the blank margins.",
    "c45_stories_evidence_turn": "You light the approval documents of the four acquitted cases at the same brightness as the clue and check what is left in the blank margins.",
    "c45_envelope_evidence_turn": "You light the approval documents of the four acquitted cases at the same brightness as the clue and check what is left in the blank margins.",
    "c45_route_system_evidence_turn": "You light the approval documents of the four acquitted cases at the same brightness as the clue and check what is left in the blank margins.",
    "c45_start_warm_stay": "Since the one standing alone in the chief mourner’s place comes first, you roll up your mourning sleeves and greet mourners beside Lim Soyul.",
    "c45_start_warm_notify": "So no one can later say you hid it, you tell Prosecutor Na Eunho only that the envelope exists.",
    "c45_start_warm_open": "Saying no one knows what could happen in two days, you ask to open the envelope now instead of waiting for the third day.",
    "c45_start_warm_signature": "So the memorial room is never left empty, you draw up a three-day wake rota with the 11 from that night.",
    "c45_start_record_stay": "Since the one standing alone in the chief mourner’s place comes first, you roll up your mourning sleeves and greet mourners beside Lim Soyul.",
    "c45_start_record_notify": "So no one can later say you hid it, you tell Prosecutor Na Eunho only that the envelope exists.",
    "c45_start_record_open": "Saying no one knows what could happen in two days, you ask to open the envelope now instead of waiting for the third day.",
    "c45_start_record_signature": "So the mourners can see his last correction too, you turn the explainer the red pen fixed into a notice for mourners.",
    "c45_start_rush_stay": "Since the one standing alone in the chief mourner’s place comes first, you roll up your mourning sleeves and greet mourners beside Lim Soyul.",
    "c45_start_rush_notify": "So no one can later say you hid it, you tell Prosecutor Na Eunho only that the envelope exists.",
    "c45_start_rush_open": "Saying no one knows what could happen in two days, you ask to open the envelope now instead of waiting for the third day.",
    "c45_start_rush_signature": "Since her plea to come this time needs an answer first, you tell Lim Soyul, without excuses, why you missed those two calls."
  },
  "pack": {
    "clue": {
      "title": "The Erased Agree and the Pressed Name",
      "text": "The original back page of the dissent held the 'agree' Lim Kyungsoo wrote and erased, and the words pressed through from a sheet laid on top: 'Author’s name -- note it separately. Yoon.' The pencil sentence 'Don’t ask why' was also left, erased, in the margins of four printouts of the acquitted approval documents."
    },
    "outcomes": {
      "c45_after_warm": {
        "tag": "Stayed Beside Them",
        "title": "On the night of the procession, you stayed at the bookshop until the shutter came down",
        "text": "Lim Jaeyoon walked between his father’s bookshelves for the first time. The fragment of ECHO waited one more night inside the laptop."
      },
      "c45_after_record": {
        "tag": "Left on Record",
        "title": "You scanned the original back page and shared the custody confirmations",
        "text": "With Lim Soyul, you scanned the original one sheet at a time and wrote your names on two confirmations. On the enlarged screen, beside the reviewer box, was a single pencil dot that was not her grandfather’s."
      },
      "c45_after_rush": {
        "tag": "Ran Ahead",
        "title": "On the night of the procession, you took the last train to Pangyo, holding the back page",
        "text": "Only the portrait drawing and the family remained at the secondhand bookshop. You went to show the erased agree to the machine that had learned how to dissent."
      }
    },
    "continuityChallenges": {
      "c44_after_warm": {
        "title": "Keep the wake with the 11 from the hospital room",
        "text": "The people who stood by the hospital window on the night of the sentencing have gathered at the wake. Trust rides on taking turns beside the family for three days."
      },
      "c44_after_record": {
        "title": "Turn the last correction into the language of mourning",
        "text": "The last thing the deceased corrected was your ruling explainer. The card that reframes the table shows what that one red-pen space means at this wake."
      },
      "c44_after_rush": {
        "title": "Speak about the two missed calls in front of the family",
        "text": "On the night you were at the prosecutors’ office, the deceased said your name twice. You repay fairness by not hiding from the family where you were that night."
      }
    }
  }
};
