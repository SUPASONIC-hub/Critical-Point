/**
 * 사건 30 (src/nodes/case30.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c30_start": {
      "title": "Temp (Really Temp)",
      "text": "The six-person group chat buzzes again. These are the six who scattered on transfer orders after Trigger Lab was dissolved. Do Yoonha is at the window of Gangseo Branch, Ban Jaewook on Internal Audit’s regional rounds, Oh Jinwoo at Bridge Bank, Han Seoyun on standby assignment, Lee Minseo at KD Data Lab in Pangyo, and you in KD Capital’s Risk Management Department, directly under Yoon Sanghyuk. In the meantime the chat has been renamed 14 times, and it is now 'Temp (Really Temp)'. Lee Minseo, who wrote 'Our records were sold outside' last night, posts a photo. 'Data Provision Agreement -- KD Data Lab ↔ FitScore.' FitScore sells applicant scores to hiring companies. The provision field reads 'Trigger Lab participant response records, 3 years’ worth'. One more line comes. 'Sorry for posting before asking. Can everyone meet tonight?'",
      "memo": [
        "Contract: KD Data Lab → FitScore, signed in the second week of May",
        "Provided: 3 years of response records for 63 Trigger Lab participants",
        "Group chat renamed 14 times -- now 'Temp (Really Temp)'",
        "Last day all six were in one place: first week of April"
      ],
      "choices": {
        "c30_start_gather": {
          "label": "Propose that the six meet face to face and decide"
        },
        "c30_start_forward": {
          "label": "Ask Lee Minseo to send all the remaining pages now"
        },
        "c30_start_verify": {
          "label": "Trace the original source to check the contract is real"
        },
        "reframe": {
          "label": "Pull out every one of the group’s data contracts"
        }
      },
      "place": "KD Capital, 12th Floor · Risk Management Department",
      "clock": "Wednesday, First Week of June · 07:12",
      "question": "The records of six scattered people were sold off in a single contract. How do you answer this photo?",
      "lead": "On the fifth morning since you got back from Singapore, the lights in Yoon Sanghyuk’s CEO office are still off."
    },
    "c30_bookstore": {
      "title": "3 to 3",
      "text": "Lim Kyungsoo has lent out the 1st floor of the secondhand bookshop in Hoegi-dong. All he got for chipping in on the deposit is one chair beside the counter. The first agenda item is the group chat’s name. The nominations: 'No Results Alumni', 'Dissent Club', 'Work Again Tomorrow'. The result is 3 to 3. Saying 'a tie in a six-person vote is a design flaw', Oh Jinwoo switches his vote, and Do Yoonha apologizes and switches the other way. 3 to 3 again. Lee Minseo spreads out the contract. Records for 63 people, at a price of 1.8 billion won. Nine analysts, four from Cohort 1, and the 50 who sat at Trigger Lab terminals during training. It says the records were pseudonymized. The purpose field reads 'Development of an organizational fit model'. Lee Minseo says, 'If we bring this out, everyone here has to put their job on the line.'",
      "memo": [
        "Group chat name vote -- 3 to 3, the revote tied too",
        "Contract price 1.8 billion won, 63 people covered",
        "Pseudonymization: A-001 through A-063 in place of names",
        "Purpose: developing FitScore’s 'organizational fit' model"
      ],
      "choices": {
        "c30_bookstore_list": {
          "label": "List who holds what first, and keep the originals in one place"
        },
        "c30_bookstore_front": {
          "label": "Put the one with the least to lose out in front first"
        },
        "c30_bookstore_share": {
          "label": "Split it evenly six ways so Lee Minseo doesn’t stake it alone"
        },
        "reframe": {
          "label": "Pull out every one of the group’s data contracts"
        },
        "c30_bookstore_evidence_turn": {
          "label": "Find the group’s money in FitScore’s shareholder list"
        }
      },
      "place": "Secondhand Bookshop, Hoegi-dong · Between the 1st-Floor Shelves",
      "clock": "Wednesday · 20:00",
      "question": "A contract that puts all six jobs on the line the moment it comes out lies open on the table. Who carries what?",
      "lead": "Inside the bookshop, its shutter half down, six chairs are pulled up to one table for the first time in two months."
    },
    "c30_datalab": {
      "text": "Lee Minseo registers you as a 'Risk Management inspection visit from an affiliate' to get you into KD Data Lab in Pangyo. Her mentor, Jin Seowoo, comes out with an armful of snacks from the pantry. 'I heard Risk Management was coming. It’s not a bribe, it’s a welcome.' She cheerfully brings up the contract dashboard. 41% of the team’s revenue this year comes from a single FitScore contract. 'We removed all the names. Only codes are left, so nobody can tell.' The specification has fields like 'hesitation time (sec)' and 'dissent writing history', and consent is replaced with a retroactive consent form. Lee Minseo points to one line. 'A-017. Average hesitation 4.2 seconds. That’s me. They numbered us in order of hire. After me come 46 more juniors who sat at the lab terminals during training.' The snack bag stops in Jin Seowoo’s hand.",
      "memo": [
        "FitScore contract -- 41% of KD Data Lab’s revenue this year",
        "Specification fields: hesitation time (sec), dissent writing history",
        "Personal consent: replaced with a retroactive consent form",
        "A-017 = Lee Minseo (numbered in order of hire)"
      ],
      "choices": {
        "c30_datalab_request": {
          "label": "File a formal access request for my own records as a subject"
        },
        "c30_datalab_snap": {
          "label": "Photograph the annexed specification while Jin Seowoo is away"
        },
        "c30_datalab_help": {
          "label": "Ask Jin Seowoo to look for a way to stop the contract together"
        },
        "reframe": {
          "label": "Pull out every one of the group’s data contracts"
        },
        "c30_datalab_evidence_turn": {
          "label": "Find the group’s money in FitScore’s shareholder list"
        }
      },
      "place": "KD Data Lab, Pangyo · Data Center",
      "clock": "Thursday · 15:00",
      "question": "A-017, behind the pseudonym, was the colleague at the next desk. What do you do in this room?",
      "lead": "Handing you a visitor pass, Lee Minseo whispers. 'My mentor is a good person. That’s what makes it worse.'"
    },
    "c30_leaving": {
      "title": "I’m Stepping Out",
      "text": "Done with his rounds in Mokpo, Ban Jaewook drives straight up and parks in the alley in front of the bookshop. His rounds papers and Ban Seoa’s indoor-shoe bag sit on the passenger seat, so you take the back. He speaks without turning off the engine. 'Before the rounds, Internal Audit had us sign a nondisclosure pledge. There’s a clause that, if you break it, you also consent to an investigation of accounts in your family’s names.' For a long while he looks only at the windshield. 'Seoa starts middle school next year. This time I’m stepping out. I’ll leave the group chat too.' On the 'Trigger Lab, 7 people' page of his notebook, where he wrote down six people and ECHO, he slowly draws a line through his own name. 'For the first time, I’m the one erasing my name.' Then he holds out a sheet of paper. This quarter’s audit schedule. Only KD Data Lab is left off it.",
      "memo": [
        "Ban Jaewook: nondisclosure pledge -- clause consenting to investigation of family-name accounts",
        "Ban Seoa starts middle school next year",
        "Notebook 'Trigger Lab, 7 people' -- a line through his own name",
        "This quarter’s audit schedule: only KD Data Lab left out"
      ],
      "choices": {
        "c30_leaving_ask": {
          "label": "Ask him to run a single search with Internal Audit’s access"
        },
        "c30_leaving_let": {
          "label": "Leave Ban Jaewook’s name out and keep only his spot in the chat"
        },
        "c30_leaving_note": {
          "label": "Ask him to put the audit exclusion on the record even if he steps out"
        },
        "reframe": {
          "label": "Pull out every one of the group’s data contracts"
        },
        "c30_leaving_evidence_turn": {
          "label": "Find the group’s money in FitScore’s shareholder list"
        }
      },
      "place": "Alley Outside the Secondhand Bookshop, Hoegi-dong · Back Seat of Ban Jaewook’s Car",
      "clock": "Friday · 23:00",
      "question": "The man who always wrote names down is erasing his own and stepping out. How do you send him off?",
      "lead": "In the idling car, you took the back seat because of the indoor-shoe bag on the passenger seat."
    },
    "c30_final": {
      "title": "What Each One Stakes",
      "text": "Six chairs are set out on the bookshop’s 1st floor, but one is empty, with only Ban Jaewook’s mug in its place. Han Seoyun flips over a sheet of book-wrapping paper and writes down what each person will stake. Do Yoonha, the window at Gangseo Branch. Lee Minseo, 5 months as a permanent employee. Oh Jinwoo, his team head post at Bridge Bank. Han Seoyun, 'nothing'. You, Risk Management directly under Yoon Sanghyuk. Lee Minseo turns the calendar page. 'The retroactive consent forms go out to 63 people next Friday. If everyone signs, the sale becomes something that was fine from the start.' There are three ways. Quietly gather more from each post, file a formal whistleblower report, or go to FitScore before the consent forms go out. Han Seoyun sets down her pen. 'Whichever way, someone loses their post. Decide whose goes first.'",
      "memo": [
        "Retroactive consent forms go out: next Friday, 63 people",
        "Posts at stake: window, permanent job, team head, nothing, Risk Management",
        "Ban Jaewook’s seat: only his mug left",
        "1.2 billion won paid up front -- ahead of the consent forms"
      ],
      "choices": {
        "c30_final_report": {
          "label": "Gather the 63 names and file a formal whistleblower report"
        },
        "c30_final_quiet": {
          "label": "Gather in secret from each post, but guard each other’s names to the end"
        },
        "c30_final_visit": {
          "label": "Go to FitScore first, before the consent forms go out"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Secondhand Bookshop, Hoegi-dong · Between the 1st-Floor Shelves",
      "clock": "Sunday · 21:00",
      "question": "Five days until the retroactive consent forms go out, and someone’s post will disappear. Which way do you go?",
      "lead": "Coming in through the bookshop’s back door, you find Han Seoyun has already laid out five lunchboxes."
    },
    "c30_aftershock": {
      "title": "Work Again Tomorrow",
      "text": "Sunday, 11:50 p.m., the bookshop’s 1st floor. Even after the decision, nobody gets up first. Han Seoyun renames the group chat. 'Work Again Tomorrow.' And so the 3-to-3 vote over the chat’s name comes to an end. Oh Jinwoo protests 'abuse of authority by the Lab Director', then is the first to post a clapping emoji. Just then the back door rattles open. Ban Jaewook, who said he was stepping out, stands there holding his daughter Seoa’s indoor-shoe bag. 'I only came to read.' He sits in the empty chair and picks up his own mug. Lee Minseo laughs, then wipes her eyes. Just before midnight, a company email arrives. 'Financial Supervisory Service regular inspection begins tomorrow at 09:00. Risk Management Department staff assigned: you. -- CEO Yoon Sanghyuk.'",
      "memo": [
        "Group chat name settled: 'Work Again Tomorrow'",
        "Ban Jaewook: back without a word, in his own chair",
        "FSS regular inspection -- tomorrow 09:00, KD Capital",
        "Staff assigned: you, sent by Yoon Sanghyuk"
      ],
      "choices": {
        "c30_after_warm": {
          "label": "Read the contract to the end, all six, until dawn, then part"
        },
        "c30_after_rush": {
          "label": "Go back to the 12th floor right after and search the shared folder"
        },
        "c30_after_record": {
          "label": "Bundle what you’ve gathered into a report and send it to the FSS"
        }
      },
      "place": "Secondhand Bookshop, Hoegi-dong · Between the 1st-Floor Shelves",
      "clock": "Sunday · 23:50 · Eve of the Inspection",
      "question": "On the night the empty chair is filled again, you are named the staff for tomorrow morning’s regular inspection. How do you close this night?"
    },
    "c30_lunch": {
      "title": "Six Lunchboxes",
      "text": "When the revote ties again, Han Seoyun unties a wrapping cloth. Six lunchboxes, each with a name sticker. Oh Jinwoo’s has spicy stir-fried pork and a note reading 'side dish for the winner'; Lee Minseo’s has a rolled omelet with no green onion; Ban Jaewook’s has two extra rows of the fried-tofu rice balls Ban Seoa is said to love. 'Two months on standby now. The 7th-floor standby room clocks out at five sharp, so my cooking’s improved.' Everyone laughs, but she sets down her chopsticks. 'I’ve told my mom I’m still a director. A director who looks out the window all day.' Then she looks at the contract. 'If the report needs a name, use mine. I have nothing left to lose now.'",
      "memo": [
        "6 lunchboxes -- name stickers, different side dishes for each person",
        "Han Seoyun on standby, week 9 -- family not told",
        "Han Seoyun’s offer: her own name in the whistleblower field"
      ],
      "choices": {
        "c30_lunch_choice_1": {
          "label": "Say you won’t let Han Seoyun stake her name alone"
        },
        "c30_lunch_choice_2": {
          "label": "Formally demand the reason for Han Seoyun’s standby first"
        },
        "c30_lunch_choice_3": {
          "label": "Take Han Seoyun’s offer as is, since she has nothing to lose"
        }
      },
      "place": "Secondhand Bookshop, Hoegi-dong · Between the 1st-Floor Shelves",
      "clock": "Wednesday · 21:00",
      "question": "Someone who says she has nothing to lose wants to put her name on the report. How do you answer?"
    },
    "c30_price": {
      "title": "Unit Price per Person",
      "text": "Friday evening, the 1st-floor café at KD Data Lab in Pangyo. Kwon Dohyun, straight from work in Yeouido, draws columns on a napkin. '1.8 billion won divided by 63 people. One person’s 3 years come to 28.57 million won. I can give you the price per second of hesitation too. Want to hear it?' When nobody answers, he scrolls to the end of the specification’s code list and goes a little quiet. 'I’m not in it. I wasn’t at Trigger Lab. It’s a relief, but oddly I feel left out. It means my hesitation has no price.' Lee Minseo bursts out laughing. Kwon Dohyun points to the last field. 'But 1.2 billion of the 1.8 billion has already come in. And not one consent form has gone out yet.'",
      "memo": [
        "1.8 billion won ÷ 63 people = 28.57 million won per person",
        "1.2 billion won paid up front -- 0 consent forms sent",
        "Kwon Dohyun: no code of his own in the specification"
      ],
      "choices": {
        "c30_price_choice_3": {
          "label": "Take Kwon Dohyun’s math straight to Jin Seowoo’s team head"
        },
        "c30_price_choice_1": {
          "label": "First tell all 63 people that their records were sold"
        },
        "c30_price_choice_2": {
          "label": "Match the money flow to affiliate transaction statements on record"
        }
      },
      "place": "KD Data Lab, Pangyo · 1st-Floor Café",
      "clock": "Friday · 19:00",
      "question": "One person’s 3 years were priced at 28.57 million won, and the money came in before the consent forms. What do you do first?"
    },
    "c30_notice": {
      "title": "Second-Half Recruitment Notice",
      "text": "Saturday evening, the street stall in front of the bookshop. Oh Jinwoo has printed out a notice from Bridge Bank’s HR team and sets it beside the fish-cake broth. 'FitScore organizational fit to be introduced from second-half open recruitment.' He spins an empty glass with his fingertips. 'They say they tried it on my team’s intern selection last month. Two of three got cut, and one was the kid I ranked No. 1 in the interview. The one who kept asking questions to the end.' He adds, without smiling. 'My father told me to stand on the winning side. These days the score decides first who’s on the winning side.' The stall owner points at the empty chair and asks if one more is coming.",
      "memo": [
        "Bridge Bank second-half recruitment: FitScore introduced",
        "Pilot use: 2 of 3 interns cut",
        "One of those cut: Oh Jinwoo’s No. 1 interviewee"
      ],
      "choices": {
        "c30_notice_choice_3": {
          "label": "Ask Oh Jinwoo for the Bridge contract before the night is out"
        },
        "c30_notice_choice_2": {
          "label": "Formally add Bridge Bank’s adoption notice to the evidence list"
        },
        "c30_notice_choice_1": {
          "label": "Promise Oh Jinwoo you’ll tell the two who were cut why"
        }
      },
      "place": "Outside the Secondhand Bookshop, Hoegi-dong · Street Stall",
      "clock": "Saturday · 20:00",
      "question": "The score cut the applicant Oh Jinwoo ranked No. 1 before anyone else could. How do you use that notice?"
    },
    "c30_lunch_reaction": {
      "title": "The Back-Door Key",
      "text": "As the lunchboxes empty, the tap of a cane sounds from between the inner shelves. Lim Kyungsoo looks down at the contract for a long time, then takes off his glasses and wipes them. 'Paper’s gone once you burn it. This won’t be, even if you burn it. Nobody knows how many copies were made.' He takes a key from his pocket and lays it on the table. The shop’s back-door key. 'Use it after the shutter’s down. But don’t tell even me about the papers you leave here. I’m old, so if someone asks, I answer everything.' In the doorway, Lim Kyungsoo’s granddaughter Lim Soyul is already drawing a little sign to hang on the back door.",
      "memo": [
        "1 back-door key to the bookshop",
        "Lim Kyungsoo’s condition: don’t tell even him about the papers left here"
      ],
      "choices": {
        "c30_lunch_reaction_choice_2": {
          "label": "Propose keeping only a list at the bookshop, not the originals"
        },
        "c30_lunch_reaction_choice_3": {
          "label": "Decline the key and change the meeting place every time"
        },
        "c30_lunch_reaction_choice_1": {
          "label": "Take the key and make the bookshop’s 1st floor the six’s hideout"
        }
      },
      "place": "Secondhand Bookshop, Hoegi-dong · Inner Shelves, 1st Floor",
      "clock": "Wednesday · 22:00",
      "question": "Lim Kyungsoo holds out the back-door key and tells you to tell him nothing. What do you do with this key?"
    },
    "c30_price_reaction": {
      "title": "Minus 0.31",
      "text": "Nine p.m., the NOAH operations room. Ryu Seah, who was in charge of bringing in NOAH, brings up a screen without turning on the lights. 'The input fields of FitScore’s model are identical to NOAH’s training data list. They sold the same records twice.' She enlarges one field. The weight on 'dissent writing history' is minus 0.31. 'NOAH at least tried to add explainability. Here only the score goes out. Anyone who has written a dissent even once gets marked down without knowing why.' She looks at you. 'You were probably marked down the most.'",
      "memo": [
        "'Dissent writing history' weight -0.31",
        "FitScore input fields = NOAH training list"
      ],
      "choices": {
        "c30_price_reaction_choice_3": {
          "label": "Ask Ryu Seah to copy the whole model file"
        },
        "c30_price_reaction_choice_2": {
          "label": "Take the weight list as Ryu Seah’s formal review opinion"
        },
        "c30_price_reaction_choice_1": {
          "label": "Ask Ryu Seah for a technical explanation only, without her name"
        }
      },
      "place": "KD Data Lab, Pangyo · NOAH Operations Room",
      "clock": "Friday · 21:00",
      "question": "A history of writing dissents was a field that cut the score. How do you protect the person who told you?"
    },
    "c30_notice_reaction": {
      "title": "What to Stake at the Window",
      "text": "Saturday night, Do Yoonha, who sat down late in the street stall’s empty chair, asks you to walk with him to the darkened Gangseo Branch. An hour on the subway, and under a streetlight he takes out two notebooks. The dog-eared one where he wrote 1,740 names, and a thin one he bought yesterday. On the first page of the new notebook are only numbers, A-001 through A-063. 'We don’t know the names, so numbers at least. Filling in a name beside each number feels like my job.' He points through the glass door to his window. '3 years ago at that seat, I didn’t even know I had anything to stake. This time I do. That window.' He smiles. 'It’s okay to stake it. Just don’t make me do it alone.'",
      "memo": [
        "Do Yoonha’s new notebook: A-001 ~ A-063",
        "What Do Yoonha will stake: the window at Gangseo Branch"
      ],
      "choices": {
        "c30_notice_reaction_choice_2": {
          "label": "Propose routing Do Yoonha’s part through official channels instead"
        },
        "c30_notice_reaction_choice_1": {
          "label": "If Do Yoonha stakes the window, stake yours beside him"
        },
        "c30_notice_reaction_choice_3": {
          "label": "Ask him to check the payment records on the branch system first"
        }
      },
      "place": "Outside KD Bank Gangseo Branch · Crosswalk",
      "clock": "Saturday · 23:00",
      "question": "This time Do Yoonha wants to stake that darkened window. What do you do with it?"
    },
    "c30_branch_fitscore": {
      "title": "Case No. 1",
      "text": "At the end of the specification you photographed are FitScore’s address and the schedule for this week’s 'corporate client briefing'. Friday morning, FitScore’s briefing hall in Seongsu-dong. You write 'Bridge Bank, recruitment' in the guest book, and Kang Taemin, saying going alone would stand out, comes in as 'companion, 1'. When a staffer asks for a little help setting out chairs, Kang Taemin unfolds all 180 by himself, and the staffer bows twice. The sales director’s slides come up on the stage screen. 'Case 1: Type A-017 -- the Hesitant Stickler. Not recommended for hire.' The HR people in the audience nod and take notes. Kang Taemin pulls off his gloves and tucks them in his vest pocket. 'That’s Minseo, isn’t it.'",
      "memo": [
        "FitScore corporate client briefing -- 38 companies attending",
        "Case No. 1 in the presentation: A-017 'not recommended for hire'",
        "Your name tag: Bridge Bank, recruitment (fake)",
        "Chairs set out by Kang Taemin: 180"
      ],
      "choices": {
        "c30_branch_fitscore_a": {
          "label": "In the Q&A, say that A-017 is a real person"
        },
        "c30_branch_fitscore_c": {
          "label": "Keep your cover and even get a free trial account"
        },
        "c30_branch_fitscore_b": {
          "label": "Formally request the briefing booklet as official evidence"
        }
      },
      "place": "FitScore, Seongsu-dong · Corporate Client Briefing Hall",
      "clock": "Friday · 10:00",
      "question": "A colleague’s code came up as 'Case No. 1' in a sales pitch. Wearing a fake name tag, what do you do?"
    },
    "c30_branch_fitscore_follow": {
      "title": "38 Points",
      "text": "In the lobby on the way out, a young man in a suit keeps folding and unfolding a results sheet. Ha Doyul, twenty-six. He made it to the final interview in KD Financial Group’s open recruitment and got this paper yesterday. 'Organizational fit: 38 points. Delayed-judgment tendency -- collaboration risk.' Seeing your name tag, he takes you for someone from Bridge Bank and asks. 'Is delay a bad thing? I’m late because I’m checking. In the interview they said that was a strength.' He tries to smile and stops. 'My mom ordered rice cakes, sure I’d get in this time. I have to go pick them up.' On the lobby wall hangs FitScore’s slogan. 'The right people, faster.'",
      "memo": [
        "Ha Doyul: cut at the final interview of KD Financial Group’s open recruitment",
        "Results sheet: organizational fit 38 points -- 'delayed-judgment tendency'",
        "Interviewer’s evaluation sheet: top score for 'thoroughness'",
        "Lobby slogan: 'The right people, faster'"
      ],
      "choices": {
        "c30_branch_fitscore_follow_c": {
          "label": "Say evidence comes first for now and take just a photo of the sheet"
        },
        "c30_branch_fitscore_follow_a": {
          "label": "Get Ha Doyul’s number and find others who went through the same"
        },
        "c30_branch_fitscore_follow_b": {
          "label": "First tell Ha Doyul of his right to an explanation for the rejection"
        }
      },
      "place": "FitScore, Seongsu-dong · 1st-Floor Lobby",
      "clock": "Friday · 11:30",
      "question": "A young man who is slow because he is thorough got 'delayed judgment, 38 points'. What do you do with that results sheet?"
    },
    "c30_route_system": {
      "title": "The Price of a Pseudonym",
      "text": "Not stopping at one contract, you ask for every data contract the group has signed. NOAH, the review engine on KD Capital’s terminal, answers. 38 data provision contracts signed by group affiliates over the past 5 years open up. 34 have pseudonymization clauses. In 2, the data subjects were told of the sale, and both times only after a leak. 'Pseudonymization has been learned not as protection but as a pricing condition. Pseudonymized records sold for 1.8 times the price of those that were not.'",
      "memo": [
        "38 affiliate data provision contracts, 34 with pseudonymization clauses",
        "2 sales disclosed to the people themselves -- both after leaks",
        "Unit price of pseudonymized records: 1.8 times"
      ],
      "choices": {
        "c30_route_system_publish": {
          "label": "Release the 38-contract statistics with the contract to all six"
        },
        "c30_route_system_notify": {
          "label": "Find the people in the two known cases and tell them directly"
        },
        "c30_route_system_drop": {
          "label": "Bury the statistics and focus only on the FitScore contract"
        },
        "c30_route_system_evidence_turn": {
          "label": "Find the group’s money in FitScore’s shareholder list"
        }
      },
      "place": "KD Capital, 12th Floor · Risk Management NOAH Terminal",
      "clock": "Wednesday · 08:00",
      "question": "Instead of guarding records, pseudonyms have raised their price. What do you do with these statistics?"
    },
    "c30_final_system_route": {
      "title": "A Price Called Protection",
      "text": "Before dawn, five days before KD Data Lab sends retroactive consent forms to 63 people, only the terminal at your desk is on on the 12th floor. NOAH lines up the unit prices of the 38 contracts in a row. The more a record’s names were turned into codes, the higher its price. At the very end is the FitScore contract, with a price stamped beside the code A-017. If the numbers follow hire order, that is Lee Minseo. 'The side that assigned the codes wrote this down as protection. The side that set the price wrote the same clause down as a pricing condition. The people behind the codes never received either document.'",
      "memo": [
        "38 data provision contracts -- pseudonymized records priced 1.8 times higher",
        "2 sales disclosed to the people themselves",
        "Retroactive consent forms go out: Friday, five days from now, 63 people"
      ],
      "choices": {
        "c30_final_system_route_a": {
          "label": "Propose a rule that people are told before their records are sold"
        },
        "c30_final_system_route_c": {
          "label": "Collect deletion requests for the sold records on behalf of the 63"
        },
        "c30_final_system_route_b": {
          "label": "Let the sale stand and have part of the price shared with the 63"
        }
      },
      "place": "KD Capital, 12th Floor · Risk Management NOAH Terminal",
      "clock": "Consent Forms Go Out · D-5 · Before Dawn",
      "question": "The people behind the codes don’t know their records were sold. What do you send them within five days?"
    },
    "c30_evidence_turn": {
      "title": "No Issues",
      "text": "When you wedge the clue between the investment date and the contract date, FitScore’s shareholder list opens. In the April investment round, someone bought a 14% stake. The KD Capital New Technology Investment Partnership. The investment was approved on Yoon Sanghyuk’s 9th day as CEO of KD Capital, and the data contract came 23 days after that. In the review opinion field of the approval document, one line is written under a March date. 'Risk Management review: no issues.' Han Seoyun’s finger stops on the reviewer’s name. Someone who sat at a Trigger Lab terminal during training. On the list of 63, A-041. The word data does not appear once in the investment review papers. 'The group sold its own employees’ records to a company it put money into. And whoever wrote no issues didn’t know A-041’s records would be in there either.'",
      "memo": [
        "14% of FitScore -- KD Capital New Technology Investment Partnership",
        "Investment approved: day 9 of Yoon Sanghyuk’s tenure, data contract 23 days later",
        "Risk Management review 'no issues' -- the writer is also one of the 63, A-041"
      ],
      "choices": {
        "c30_evidence_turn_hold": {
          "label": "Hold on to the approval record and bring it out when it hurts most"
        },
        "c30_evidence_turn_share": {
          "label": "First tell the 63 who put the money in and who sold"
        },
        "c30_evidence_turn_bundle": {
          "label": "Formally submit the approval record bundled with the contract"
        }
      },
      "place": "KD Capital · Investment Approval Records Room",
      "clock": "Sunday · 19:00",
      "question": "Group money sits on the buying side, and the one who wrote no issues was among the 63 sold. How do you use this record?"
    },
    "c30_start_warm": {
      "title": "The Contract of the One Who Came First",
      "text": "Friday morning at the arrivals hall, sharing cup noodles by the convenience store microwave with the people who came to meet you, you told Lee Minseo that if she called, you would be the first to come. Five days later, on Wednesday morning, the call comes, and as promised you are the first to head to Pangyo. It is your first time at Lee Minseo’s new company since Trigger Lab was dissolved and everyone scattered on transfer orders. In KD Data Lab’s 1st-floor lobby, Lee Minseo holds her employee ID turned face-down and hands you her phone. 'Data Provision Agreement -- KD Data Lab ↔ FitScore.' FitScore sells applicant scores to hiring companies, and what it provides is 3 years of Trigger Lab participants’ response records. She smiles a little. 'You really did come first. You only said it over cup noodles.'",
      "memo": [
        "The promise at arrivals: 'If you call, I’ll come first'",
        "Contract: KD Data Lab → FitScore, response records of 63 participants",
        "Lee Minseo: waiting in the lobby, employee ID turned face-down"
      ],
      "choices": {
        "c30_start_warm_signature": {
          "label": "Call the six together tonight under my name, not Lee Minseo’s"
        },
        "c30_start_warm_verify": {
          "label": "Trace the original source to check the contract is real"
        },
        "c30_start_warm_forward": {
          "label": "Ask Lee Minseo to send all the remaining pages now"
        },
        "c30_start_warm_gather": {
          "label": "Propose that the six meet face to face and decide"
        },
        "c30_start_warm_reframe": {
          "label": "Pull out every one of the group’s data contracts"
        }
      },
      "place": "KD Data Lab, Pangyo · 1st-Floor Lobby",
      "clock": "Wednesday, First Week of June · 08:00",
      "question": "In the lobby you reached first, as promised, you receive the contract. Whom do you call first?",
      "lead": "To keep the words 'If you call, I’ll come first', said at the arrivals-hall convenience store, you took the first bus to Pangyo."
    },
    "c30_start_record": {
      "title": "The Contract of the One Who Filed the Folder",
      "text": "On the flight back you bundled Annex C and Haeon Partners’ remittance trail into a summary, and yesterday you filed that folder with the Audit Committee. Wednesday morning, at your desk on KD Capital’s 12th floor, you wait for the receipt confirmation email. Meanwhile Lee Minseo’s photo appears in the six-person group chat. 'KD Data Lab ↔ FitScore Data Provision Agreement.' FitScore sells applicant scores to hiring companies, and what it provides is 3 years of Trigger Lab participants’ response records. The signing date is the second week of May, a month after Yoon Sanghyuk came to KD Capital as CEO. The six are scattered across six places, yet the documents keep gathering in the same spring. The Audit Committee’s receipt email still hasn’t come by afternoon.",
      "memo": [
        "Folder filed with the Audit Committee -- no receipt confirmation yet",
        "Contract: KD Data Lab → FitScore, response records of 63 participants",
        "Data contract signed: second week of May -- one month into Yoon Sanghyuk’s tenure"
      ],
      "choices": {
        "c30_start_record_forward": {
          "label": "Ask Lee Minseo to send all the remaining pages now"
        },
        "c30_start_record_gather": {
          "label": "Propose that the six meet face to face and decide"
        },
        "c30_start_record_signature": {
          "label": "Add the data contract to the Audit Committee folder as a second bundle"
        },
        "c30_start_record_verify": {
          "label": "Trace the original source to check the contract is real"
        },
        "c30_start_record_reframe": {
          "label": "Pull out every one of the group’s data contracts"
        }
      },
      "place": "KD Capital, 12th Floor · Risk Management Department",
      "clock": "Wednesday, First Week of June · 13:00",
      "question": "The annex you filed with the Audit Committee and the new contract came out in the same spring, under the same CEO. How do you handle the two documents?",
      "lead": "A day since you put the folder in the Audit Committee’s inbox, you refresh your mail for the 20th time."
    },
    "c30_start_rush": {
      "title": "The Contract of the One Who Rushed Over",
      "text": "That night, turning away from the CEO office’s closed door, you went to Lee Minseo still dragging your suitcase. Kang Taemin followed without a word, carrying his folded sign. 11:30 p.m., the wooden platform of Lee Minseo’s rooftop room. It is your first time here since Trigger Lab was dissolved and everyone scattered on transfer orders. Lee Minseo turns her laptop around. 'Data Provision Agreement -- KD Data Lab ↔ FitScore.' FitScore sells applicant scores to hiring companies, and what it provides is 3 years of Trigger Lab participants’ response records. 'Am I raising the stakes for nothing?' Kang Taemin stands his 'Cup noodles here' sign on the platform. 'The stakes were always high. You just turned the lights on, Minseo.'",
      "memo": [
        "Straight from the CEO office -- Kang Taemin along, sign 'Cup noodles here'",
        "Contract: KD Data Lab → FitScore, response records of 63 participants",
        "Lee Minseo: 'Am I raising the stakes for nothing?'"
      ],
      "choices": {
        "c30_start_rush_gather": {
          "label": "Propose that the six meet face to face and decide"
        },
        "c30_start_rush_verify": {
          "label": "Trace the original source to check the contract is real"
        },
        "c30_start_rush_signature": {
          "label": "Stay beside Lee Minseo tonight and read the contract together"
        },
        "c30_start_rush_forward": {
          "label": "Ask Lee Minseo to send all the remaining pages now"
        },
        "c30_start_rush_reframe": {
          "label": "Pull out every one of the group’s data contracts"
        }
      },
      "place": "Lee Minseo’s Rooftop Room · Rooftop Platform",
      "clock": "Friday Night, Back Home · 23:30",
      "question": "Lee Minseo asks if she is raising the stakes for nothing. With your suitcase still standing, what do you do first?",
      "lead": "Dragging the rattle of suitcase wheels from the hallway outside the CEO office, you climbed the rooftop stairs. Kang Taemin is behind you, holding his sign."
    }
  },
  "echoReplies": {
    "c30_start_gather": "When you suggest meeting face to face, everyone answers within 1 minute. Only Ban Jaewook’s reply comes two hours later. 'I’ll take the last train up.'",
    "c30_start_verify": "Following the original source confirms the contract is real. While you check, your own access record is left on KD Data Lab’s server too.",
    "c30_start_forward": "The remaining pages arrive in 10 minutes. They become the first file ever sent outside from Lee Minseo’s company account.",
    "c30_bookstore_share": "Split evenly, it lets Lee Minseo take her hand off the contract for the first time. The weight lightens, but all six leave handprints on the same document.",
    "c30_bookstore_list": "The list makes clear who holds what. A clear list, if lost, becomes evidence against someone just as it is.",
    "c30_bookstore_front": "The one with the least to lose is Han Seoyun. She nods first, and the other five remember that nod for a long time.",
    "c30_datalab_help": "When you ask her to look together, Jin Seowoo puts down the snack bag. 'This contract is what puts me up for promotion review this year.' Still, she doesn’t leave her seat.",
    "c30_datalab_request": "The access request is received. The response deadline is 30 days, more than 3 weeks after the retroactive consent forms go out.",
    "c30_datalab_snap": "The photo comes out sharp. Jin Seowoo comes back, sees the empty snack bag, and laughs. She doesn’t know anything yet.",
    "c30_leaving_let": "With his name taken out, Ban Jaewook is nowhere. In his spot in the group chat, only a single read count remains.",
    "c30_leaving_note": "When you ask for the official record, Ban Jaewook grips the steering wheel for a long time. 'I can’t do it under my name. I’ll write down the dates for you.'",
    "c30_leaving_ask": "When you ask, Ban Jaewook runs the search for you. And that search record becomes the first breach of his pledge.",
    "c30_final_quiet": "Gathering in secret, five days go by with no one hurt. On Friday, the 63 consent forms go out as scheduled.",
    "c30_final_report": "The 63 numbers go into the whistleblower report. The moment a name is written in the reporter field, that person’s post starts to shake from that day on.",
    "c30_final_visit": "When you go first, FitScore says it will 'review' the sale. The one who comes to deliver the result of that review is from the group’s Legal.",
    "c30_after_warm": "At two in the morning, the six close the last page of the contract and part. The inspection-response email waits for morning, opened again by no one.",
    "c30_after_record": "The report reaches the Financial Supervisory Service’s tip line after midnight. Received along with it: the fact that it was sent the night before the inspection by an employee of the company being inspected.",
    "c30_after_rush": "On the 12th floor, only the light at your desk comes on. Each time you open the shared folder, another line with your name and the time piles up in the access log.",
    "c30_lunch_choice_1": "When you say you won’t leave her alone, Han Seoyun closes her lunchbox lid, then opens it again. 'Then I’ll have to pack more side dishes.'",
    "c30_lunch_choice_2": "When you ask the reason, HR answers. 'Temporary standby due to reorganization.' When that temporary ends is written nowhere.",
    "c30_lunch_choice_3": "Taking the offer speeds things up. Han Seoyun’s name goes at the top of the report, and her mother may see that name on the news first.",
    "c30_price_choice_1": "When you tell them, 41 of the 63 reply that night. The other 22 don’t even know their number yet.",
    "c30_price_choice_2": "Matching it on record stamps the date the 1.2 billion won came in. It is ten days before the consent form template was made.",
    "c30_price_choice_3": "The team head reads the math to the end, says only 'the unit price is the market rate', and closes the meeting room door.",
    "c30_notice_choice_1": "When you promise, Oh Jinwoo prints out the two résumés again. Beside the name of the one he ranked No. 1, he writes a small 'again'.",
    "c30_notice_choice_2": "Once it is on the list, Bridge Bank becomes a link in this chain too. Oh Jinwoo’s team head post goes into that link with it.",
    "c30_notice_choice_3": "Oh Jinwoo sends a photo of the contract at two in the morning. Two in the morning is stamped on his access record too.",
    "c30_lunch_reaction_choice_1": "When you take the key, Lim Soyul’s sign goes up on the back door. 'After the shutter’s down -- six people only.' Lim Kyungsoo grumbles that the letters are too big.",
    "c30_lunch_reaction_choice_2": "Keeping only a list leaves Lim Kyungsoo a man who knows nothing. At the bottom of the list he writes in pencil, 'Copies of the contract: I don’t know either.'",
    "c30_lunch_reaction_choice_3": "At the idea of changing places every time, Lim Kyungsoo puts the key back. 'On days you’ve got nowhere to go, I’ll leave the back door open.' Han Seoyun ends up asking every time where to bring the next lunchboxes.",
    "c30_price_reaction_choice_1": "With her name left out, Ryu Seah writes three pages of explanation. The last line is 'If anyone asks, I didn’t write this.'",
    "c30_price_reaction_choice_2": "Once it is a formal opinion, Ryu Seah’s name stays at the bottom of the document. She takes one deep breath before signing.",
    "c30_price_reaction_choice_3": "The copy takes 4 minutes. In the NOAH operations room’s access log, Ryu Seah’s employee ID stays lit for those 4 minutes.",
    "c30_notice_reaction_choice_1": "When you say you’ll stake yours with him, Do Yoonha writes your name first, at the top of the new notebook’s first page. 'A-000. The one with no number.'",
    "c30_notice_reaction_choice_2": "Routing it through official channels keeps the window safe. Do Yoonha looks a little let down, but nods all the same.",
    "c30_notice_reaction_choice_3": "The search takes 3 minutes. Do Yoonha’s employee ID stays in the window terminal’s search log.",
    "c30_branch_fitscore_a": "When you speak up, the hall goes quiet for 3 seconds. The sales director answers, 'It’s a hypothetical case,' and moves to the next slide.",
    "c30_branch_fitscore_b": "The booklet comes through formally. With only the A-017 page missing. The missing page number is still there.",
    "c30_branch_fitscore_c": "The trial account is issued in Bridge Bank’s name. Kang Taemin comes back with two eco bags and two tumblers.",
    "c30_branch_fitscore_follow_a": "Once you have his number, Ha Doyul starts a group chat that night. 11 people join on the first day.",
    "c30_branch_fitscore_follow_b": "Knowing his rights, Ha Doyul writes a request for an explanation. The reply is one line. 'Our evaluation criteria are a trade secret.'",
    "c30_branch_fitscore_follow_c": "The photo becomes evidence. Ha Doyul folds the results sheet in four, puts it away, and goes to pick up the rice cakes.",
    "c30_route_system_publish": "Once it is public, the six split the 38 contracts between them to read. Lee Minseo finds that the person in charge of one of them is her own mentor, Jin Seowoo.",
    "c30_route_system_notify": "When you find them, the people in the two cases had long since moved on. One thanks you for telling them; the other asks why you only came now.",
    "c30_route_system_drop": "Burying it brings FitScore alone into sharp focus. The remaining 37 contracts stay as they are, price tags attached.",
    "c30_final_system_route_a": "With the rule in place, notices go out first from the next contract on. The 63 people’s records, already sold, left before the rule.",
    "c30_final_system_route_b": "With the price shared, a few million won lands in front of each person. Taking the money amounts to admitting the sale.",
    "c30_final_system_route_c": "As the deletion requests gather, the 63 learn each other’s numbers for the first time. How many copies exist, still no one knows.",
    "c30_evidence_turn_bundle": "Bundled together, the buying side and the selling side stand in one document. If the place receiving that document is inside the group, there is no telling how long it will stand.",
    "c30_evidence_turn_hold": "Holding on to it makes it a card to play at the most painful moment. Meanwhile, KD Data Lab’s retroactive consent forms go out to the 63, and some come back e-signed.",
    "c30_evidence_turn_share": "When you tell them, some of the 63 learn for the first time that the investor was their own company. A-041 is silent a long while, then sends one line. 'Then who am I supposed to take this up with?'",
    "c30_bookstore_evidence_turn": "Open the shareholder list, and the buying side and the selling side are linked by money from the same pocket. Wedged between them is one line of review opinion.",
    "c30_datalab_evidence_turn": "Open the shareholder list, and the buying side and the selling side are linked by money from the same pocket. Wedged between them is one line of review opinion.",
    "c30_leaving_evidence_turn": "Open the shareholder list, and the buying side and the selling side are linked by money from the same pocket. Wedged between them is one line of review opinion.",
    "c30_route_system_evidence_turn": "Open the shareholder list, and the buying side and the selling side are linked by money from the same pocket. Wedged between them is one line of review opinion.",
    "case30_memory_system": "What is written in the purpose field is one line: 'Development of an organizational fit model.' Your hand isn’t in it; your response records are, in the provision field. NOAH opens 38 contracts made the same way.",
    "case30_memory_evidence": "Hold the mailbox address up to FitScore’s shareholder list, and one line shows group money going in. The investment review opinion is one line, and the person who wrote that line is on the list that was sold too.",
    "c30_start_warm_gather": "When you suggest meeting face to face, everyone answers within 1 minute. Only Ban Jaewook’s reply comes two hours later. 'I’ll take the last train up.'",
    "c30_start_warm_verify": "Following the original source confirms the contract is real. While you check, your own access record is left on KD Data Lab’s server too.",
    "c30_start_warm_forward": "The remaining pages arrive in 10 minutes. They become the first file ever sent outside from Lee Minseo’s company account.",
    "c30_start_warm_signature": "When you reach out, Oh Jinwoo answers first. 'Anywhere, just nothing spicy.' From Mokpo, Ban Jaewook replies with a photo of his rounds papers: 'I’ll come, even if late.'",
    "c30_start_record_gather": "When you suggest meeting face to face, everyone answers within 1 minute. Only Ban Jaewook’s reply comes two hours later. 'I’ll take the last train up.'",
    "c30_start_record_verify": "Following the original source confirms the contract is real. While you check, your own access record is left on KD Data Lab’s server too.",
    "c30_start_record_forward": "The remaining pages arrive in 10 minutes. They become the first file ever sent outside from Lee Minseo’s company account.",
    "c30_start_record_signature": "Once attached, the two documents’ dates explain each other. The receipt confirmation comes two days later: one line saying both bundles were received.",
    "c30_start_rush_gather": "When you suggest meeting face to face, everyone answers within 1 minute. Only Ban Jaewook’s reply comes two hours later. 'I’ll take the last train up.'",
    "c30_start_rush_verify": "Following the original source confirms the contract is real. While you check, your own access record is left on KD Data Lab’s server too.",
    "c30_start_rush_forward": "The remaining pages arrive in 10 minutes. They become the first file ever sent outside from Lee Minseo’s company account.",
    "c30_start_rush_signature": "With you staying beside her, Lee Minseo dozes off briefly at two in the morning, for the first time. Kang Taemin lies down at the end of the platform, his sign for a pillow."
  },
  "choiceVoiceLines": {
    "c30_start_gather": "Saying it isn’t for one or two people to decide, you propose that the six meet face to face and decide together.",
    "c30_start_verify": "Saying six people can’t move on one wrong page, you trace the original source to check whether the contract is real.",
    "c30_start_forward": "Since one page can’t tell you how much was sold, you ask Lee Minseo to send all the remaining pages now.",
    "c30_bookstore_share": "So that Lee Minseo doesn’t stake it alone just for bringing it out first, the six of you split it evenly.",
    "c30_bookstore_list": "Saying there’s no telling whom scattered papers will point to, you list who holds what first and keep the originals in one place.",
    "c30_bookstore_front": "Saying everyone can’t stake their jobs all at once, you put the one with the least to lose out in front first.",
    "c30_datalab_help": "Saying she has only just learned who A-017 is, you ask Jin Seowoo to look for a way to stop the contract together.",
    "c30_datalab_request": "Saying the person behind the code can ask directly, you formally file an access request for your own records as a subject.",
    "c30_datalab_snap": "Saying there won’t be another chance to get in, you photograph the annexed specification while Jin Seowoo is away.",
    "c30_leaving_let": "Saying you can’t make him stake Seoa’s next year too, you take Ban Jaewook’s name off every record and keep only his spot in the group chat.",
    "c30_leaving_note": "Saying the gap in the schedule has to be written down, you ask that at least the audit exclusion go on the official record, even if he steps out.",
    "c30_leaving_ask": "Because why only KD Data Lab was left off can be seen only from inside, you ask him to run a search just once with Internal Audit’s access.",
    "c30_final_quiet": "Saying no one’s post can be given up yet, you gather in secret from each post but guard each other’s names to the end.",
    "c30_final_report": "Saying the people concerned must be heard before the consent forms reach them, you gather the 63 names and file a formal whistleblower report.",
    "c30_final_visit": "Saying that once the signatures pile up it becomes something fine from the start, you go to FitScore first, before the consent forms go out.",
    "c30_after_warm": "Since even the one who came only to read has taken his seat, the six of you read the contract to the end together until dawn, then part.",
    "c30_after_record": "Saying the regular inspection needs to know what to look at, you bundle what you’ve gathered into a report and send it to the Financial Supervisory Service tonight.",
    "c30_after_rush": "Saying you have to see it yourself before 09:00 tomorrow, you go back to the 12th floor right after the meeting and search the department’s shared folder.",
    "c30_lunch_choice_1": "Saying you don’t believe she has nothing to lose, you tell Han Seoyun you won’t let her stake her name alone.",
    "c30_lunch_choice_2": "Saying the side that left her nothing to lose should answer first, you formally demand the reason for Han Seoyun’s standby assignment.",
    "c30_lunch_choice_3": "Saying someone has to sign once the report needs a name, you take Han Seoyun’s offer as is, since she has nothing to lose.",
    "c30_price_choice_1": "Saying the people who were priced should know first, you tell all 63 that their records were sold.",
    "c30_price_choice_2": "Saying you can’t question anyone with napkin math, you match the money flow to the affiliate transaction statements and put it on record.",
    "c30_price_choice_3": "Saying the 1.2 billion won that came in without a single consent form needs questioning now, you take Kwon Dohyun’s math straight to Jin Seowoo’s team head.",
    "c30_notice_choice_1": "Saying the one who kept asking questions to the end shouldn’t be left in the dark, you promise Oh Jinwoo you’ll tell the two who were cut why.",
    "c30_notice_choice_2": "Saying it proves the score is already being used outside, you formally add Bridge Bank’s adoption notice to the evidence list.",
    "c30_notice_choice_3": "Saying it has to be stopped before second-half recruitment begins, you ask Oh Jinwoo to bring the Bridge contract before the night is out.",
    "c30_lunch_reaction_choice_1": "Saying the scattered six need a place to come back to, you take the key and make the bookshop’s 1st floor the six’s hideout.",
    "c30_lunch_reaction_choice_2": "So the old man has nothing to answer with, you propose keeping only a list at the bookshop, not the originals.",
    "c30_lunch_reaction_choice_3": "Saying gathering in one place means being exposed all at once, you decline the key and propose changing the meeting place every time.",
    "c30_price_reaction_choice_1": "Since you can’t make one more person stake her job, you ask Ryu Seah for a technical explanation only, without her name.",
    "c30_price_reaction_choice_2": "Saying it carries weight only from the person who brought in NOAH, you take the weight list as Ryu Seah’s formal review opinion.",
    "c30_price_reaction_choice_3": "Saying you need to open up the insides that send out only a score, you ask Ryu Seah to copy the whole model file.",
    "c30_notice_reaction_choice_1": "Saying you owe an answer to his plea not to be left to stake it alone, you tell Do Yoonha that if he stakes the window, you’ll stake yours beside him.",
    "c30_notice_reaction_choice_2": "Saying the window belongs to the customers too, you propose routing Do Yoonha’s part through official channels outside the window.",
    "c30_notice_reaction_choice_3": "Saying a window that will be staked anyway should be used while it still can be, you ask him to look up the contract payment records on the branch system first.",
    "c30_branch_fitscore_a": "Saying the people taking notes need to hear it now, you say on the spot, in the Q&A, that A-017 is a real person.",
    "c30_branch_fitscore_b": "To keep the 'Case 1' on the screen as official evidence, you formally request the briefing booklet.",
    "c30_branch_fitscore_c": "Saying you have to see inside to know what they sell, you keep your cover and even get a free trial account.",
    "c30_branch_fitscore_follow_a": "Saying he can’t be the only one who got 38 points, you get Ha Doyul’s number and look for others who went through the same thing together.",
    "c30_branch_fitscore_follow_b": "Since you can’t let him go pick up the rice cakes without knowing why, you first tell Ha Doyul of his right to an explanation for the rejection.",
    "c30_branch_fitscore_follow_c": "Saying the paper with 38 points on it must be kept first, you say evidence comes first for now and take just a photo of the results sheet.",
    "c30_route_system_publish": "Saying the people moving together need to know how big the table is, you release the 38-contract statistics with the contract to all six.",
    "c30_route_system_notify": "Saying these people heard of it only through leaks, you find the people in the two known cases and tell them of the sale directly.",
    "c30_route_system_drop": "Saying you can’t carry 38 contracts at once, you bury the statistics and focus only on the FitScore contract.",
    "c30_final_system_route_a": "So the person behind the code is never the last to know, you propose a rule that people are told first whenever their records are sold.",
    "c30_final_system_route_b": "Saying the 38 contracts can’t be undone, you let the sale stand and have part of the price shared with the 63.",
    "c30_final_system_route_c": "Saying these are people who never received either document, you collect deletion requests for the sold records on behalf of the 63.",
    "c30_evidence_turn_bundle": "Saying that filed separately it would read as coincidence, you formally submit the investment approval record bundled with the contract.",
    "c30_evidence_turn_hold": "Saying the one line 'no issues' can be used only once, you hold on to the approval record and bring it out when it hurts most.",
    "c30_evidence_turn_share": "Saying the people given codes should know first, you first tell the 63 who put the money in and who sold.",
    "c30_bookstore_evidence_turn": "Lining up the clues beside the contract in order of payment, you find out who put money into FitScore.",
    "c30_datalab_evidence_turn": "Lining up the clues beside the contract in order of payment, you find out who put money into FitScore.",
    "c30_leaving_evidence_turn": "Lining up the clues beside the contract in order of payment, you find out who put money into FitScore.",
    "c30_route_system_evidence_turn": "Lining up the clues beside the contract in order of payment, you find out who put money into FitScore.",
    "c30_start_warm_gather": "Saying it isn’t for one or two people to decide, you propose that the six meet face to face and decide together.",
    "c30_start_warm_verify": "Saying six people can’t move on one wrong page, you trace the original source to check whether the contract is real.",
    "c30_start_warm_forward": "Since one page can’t tell you how much was sold, you ask Lee Minseo to send all the remaining pages now.",
    "c30_start_warm_signature": "So it isn’t a meeting called alone by the one who brought it out, you message the six under your own name, not Lee Minseo’s, to meet tonight.",
    "c30_start_record_gather": "Saying it isn’t for one or two people to decide, you propose that the six meet face to face and decide together.",
    "c30_start_record_verify": "Saying six people can’t move on one wrong page, you trace the original source to check whether the contract is real.",
    "c30_start_record_forward": "Since one page can’t tell you how much was sold, you ask Lee Minseo to send all the remaining pages now.",
    "c30_start_record_signature": "Saying documents from the same spring should be read together, you add the data contract to the Audit Committee folder as a second bundle.",
    "c30_start_rush_gather": "Saying it isn’t for one or two people to decide, you propose that the six meet face to face and decide together.",
    "c30_start_rush_verify": "Saying six people can’t move on one wrong page, you trace the original source to check whether the contract is real.",
    "c30_start_rush_forward": "Since one page can’t tell you how much was sold, you ask Lee Minseo to send all the remaining pages now.",
    "c30_start_rush_signature": "Saying you won’t leave the one who turned on the lights alone, you stay beside Lee Minseo tonight and read the contract together, page by page."
  },
  "pack": {
    "clue": {
      "title": "The Field That Said No Issues",
      "text": "14% of FitScore’s shares was bought by an investment partnership KD Capital set up, and the data contract came 23 days after that investment. The investment review opinion was a single line from Risk Management: 'no issues'."
    },
    "outcomes": {
      "c30_after_warm": {
        "tag": "Stayed Till Dawn",
        "title": "With Ban Jaewook back, all six closed the contract’s last page together",
        "text": "The night the group chat was named 'Work Again Tomorrow', no one left first. The empty chair was filled again just before midnight."
      },
      "c30_after_record": {
        "tag": "Filed the Report",
        "title": "A report with the 63 numbers was received the night before the inspection",
        "text": "The contract and everything gathered so far became one document and went to the Financial Supervisory Service. The inspection begins in seven hours."
      },
      "c30_after_rush": {
        "tag": "Went Back First",
        "title": "Right after the meeting, you kept the 12th-floor department folder open until dawn",
        "text": "You left the five at the bookshop and went to the dark 12th floor. Access logs until four in the morning stayed under your name."
      }
    },
    "continuityChallenges": {
      "c29_after_warm": {
        "title": "Keep the Promise to Come First",
        "text": "Over cup noodles, you told Lee Minseo you would be the first to come. The card where the six share the weight, so Lee Minseo doesn’t stake it alone, keeps that promise and trust together."
      },
      "c29_after_record": {
        "title": "Documents That Gather in the Same Spring",
        "text": "Roundhill Annex C and the data contract came out in the same spring, under the same CEO. Lay both documents on one table and read them again from the start."
      },
      "c29_after_rush": {
        "title": "Turn the Night You Rushed Over, Suitcase and All, into a Decision of Six",
        "text": "You rushed to Lee Minseo first, still dragging your suitcase. This time, the card that leaves proof the six decided together sets fairness right."
      }
    }
  }
}
