/**
 * 사건 41 (src/nodes/case41.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c41_start": {
      "title": "This Time He Comes",
      "text": "The National Assembly Policy Committee sets the date for a hearing. The agenda: the cover-up of Loan 2023-0412 and the leak of Trigger Lab’s response records. The first name on the witness list is Yoon Sanghyuk, CEO of KD Capital. Last autumn he did not appear at the parliamentary audit. Back then he filed a notice of absence; this time, through his lawyer, he says he 'will attend in good faith.' You are an unsworn witness again. On the phone, Cha Jiwon tears open a triangle kimbap wrapper. 'The ones who don’t show are easy. An empty chair doesn’t argue back. The scary ones are the ones who show up. It means they’re done preparing.'",
      "memo": [
        "Hearing in D-4 -- opens Friday at 10:00",
        "Witness Yoon Sanghyuk: CEO of KD Capital, on trial for breach of trust over advisory fees",
        "1 question for the unsworn witness -- 1 of a lawmaker’s 7 minutes",
        "Last autumn an empty chair; this time, notice that he will attend"
      ],
      "choices": {
        "c41_start_office": {
          "label": "Lock in your questioning slot at the lawmaker’s office"
        },
        "c41_start_timeline": {
          "label": "Line up Yoon Sanghyuk’s past statements and papers by date"
        },
        "c41_start_team": {
          "label": "Call your scattered colleagues to prepare together"
        },
        "reframe": {
          "label": "Ask how 'I don’t recall' has ended before"
        }
      },
      "place": "KD Capital Headquarters · Hallway outside the CEO’s Office",
      "clock": "Monday, Fourth Week of August · Hearing in D-4",
      "question": "The witness who was an empty chair now comes fully prepared. What do you prepare first?",
      "lead": "The day the witness list goes public, Yoon Sanghyuk passes you in the hallway outside the CEO’s office with only a nod."
    },
    "c41_drill": {
      "title": "I Don’t Recall",
      "text": "The 1st floor of the Hoegi-dong secondhand bookshop, mock hearing, round 2. Lim Kyungsoo’s chair beside the counter has been empty since August. Short of breath, he went back into Ieum Hospital, and only the recording goes to his room. Na Junhyuk plays Yoon Sanghyuk again. He says he bought a navy suit with his own money and buttons it to show you. It buttons. Applause. But whatever anyone asks, there is one answer. 'I don’t recall.' Kang Taemin asks what he had for dinner. Same answer. Kwon Dohyun asks, 'The third line of the 1994 Yeongdong Branch return report?' Na Junhyuk closes his eyes and recites it without missing a single word. The laughter stops. Memory is a choice. Oh Jinwoo draws a betting board on the whiteboard. 'How many times in the real thing? I say nineteen.' A text from Cha Jiwon. 'Format’s set. Face-to-face questioning, 1 minute, exactly one question.'",
      "memo": [
        "14 mock questions -- 'I don’t recall' 14 times",
        "Na Junhyuk’s new suit: buttons close; not claimable as an expense (Kwon Dohyun’s ruling)",
        "Betting board: Oh Jinwoo 19, Kwon Dohyun 23, Kang Taemin 'not counting'",
        "Unsworn witness question format: face-to-face questioning, 1 minute"
      ],
      "choices": {
        "c41_drill_paper": {
          "label": "Keep only document questions he can’t claim to forget"
        },
        "c41_drill_hand": {
          "label": "Leave the draft questions to the office; organize evidence"
        },
        "c41_drill_victims": {
          "label": "Collect the victims’ questions and choose one"
        },
        "reframe": {
          "label": "Ask how 'I don’t recall' has ended before"
        },
        "c41_drill_evidence_turn": {
          "label": "Attach that day’s papers to every 'I don’t recall'"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Mock Hearing between the Shelves",
      "clock": "Tuesday · Hearing in D-3 · 20:00",
      "question": "Whatever is asked, 'I don’t recall' comes back. How do you choose your single question?",
      "lead": "On their way home from work, your scattered colleagues gather one by one on the bookshop’s 1st floor. Paper cups sit on the folding table instead of nameplates."
    },
    "c41_corridor": {
      "title": "Waiting Room Hallway",
      "text": "In the hallway outside the witness waiting room on the 3rd floor of the National Assembly main building, Yoon Sanghyuk is already there with two lawyers. The CEO and an employee of the same company, waiting in the same hallway for different doors. He holds out a paper cup of coffee. The KD Capital logo is printed on the cup. 'I hear you get one question. Choose it carefully. Seojin says she’s coming to the gallery.' The moment his daughter’s name comes up, the hallway grows half as wide. He keeps the hand holding the coffee out and adds, 'I am not a man with a bad memory. It’s just that today is a day I have no need to remember.' One of the lawyers glances at a wristwatch. 40 minutes until the hearing opens.",
      "memo": [
        "Outside the witness waiting room -- 40 minutes before opening",
        "Yoon Sanghyuk’s side: 2 lawyers",
        "Yoon Seojin’s gallery application confirmed",
        "Contact between the witness and the unsworn witness before the hearing -- recorded nowhere"
      ],
      "choices": {
        "c41_corridor_cup": {
          "label": "Decline the coffee and walk past without a word"
        },
        "c41_corridor_daughter": {
          "label": "Find Yoon Seojin first and tell her what you’ll ask today"
        },
        "c41_corridor_report": {
          "label": "Write down what was said and report it to the chair’s office"
        },
        "reframe": {
          "label": "Ask how 'I don’t recall' has ended before"
        },
        "c41_corridor_evidence_turn": {
          "label": "Attach that day’s papers to every 'I don’t recall'"
        }
      },
      "place": "National Assembly Main Building 3rd Floor · Hallway outside the Witness Waiting Room",
      "clock": "Friday, Fourth Week of August · Hearing Day 09:20",
      "question": "Before the hearing, in the hallway, the witness brought up his daughter’s name. How do you answer this cup of coffee?",
      "lead": "At the end of the hallway, the paper cup with the KD Capital logo comes into view first."
    },
    "c41_chamber": {
      "title": "The 22nd",
      "text": "At 10:00, sworn in, Yoon Sanghyuk pulls the microphone one knuckle closer. The first lawmaker asks about the Haeon Partners advisory fees. 'I don’t recall.' The next lawmaker asks about Trigger Lab’s response records. 'I don’t recall.' The tally marks Oh Jinwoo draws go up in the group chat one stroke at a time. By noon, 22 times. Oh Jinwoo’s nineteen has already lost, and Kwon Dohyun’s twenty-three is one away. Just before the recess, a note from Cha Jiwon. 'The 1 minute right after the recess is yours. He’s prepared his 23rd answer too. Ask the question that makes that answer false.' You have three things you can bring out. On the desk, the receipt log for the original of the empty signature field that Baek Arin handed you. KD Capital’s approval for a 4 billion won investment in FitScore. And in Yoon Seojin’s bag in the gallery, her father’s notebook, which you have seen only in a photo in July.",
      "memo": [
        "'I don’t recall' 22 times -- before the recess",
        "Bet: Oh Jinwoo 19 out, Kwon Dohyun 23 waiting",
        "Papers: receipt log · notebook · FitScore investment approval",
        "Unsworn witness question, 1 minute -- right after the recess"
      ],
      "choices": {
        "c41_chamber_invest": {
          "label": "Grab the headlines with the 4 billion won FitScore approval"
        },
        "c41_chamber_notebook": {
          "label": "With Yoon Seojin’s consent, read one line from the notebook"
        },
        "c41_chamber_receipt": {
          "label": "Use the receipt log to establish that he got the papers"
        },
        "reframe": {
          "label": "Ask how 'I don’t recall' has ended before"
        },
        "c41_chamber_evidence_turn": {
          "label": "Attach that day’s papers to every 'I don’t recall'"
        }
      },
      "place": "National Assembly Policy Committee Room · Unsworn Witness Seat",
      "clock": "Hearing Day · 12:10, Just Before Recess",
      "question": "'I don’t recall' has come 22 times, and you have three papers. Which one do you set before your 1 minute?",
      "lead": "Yoon Sanghyuk’s right hand never trembled once as he took the oath. From the unsworn witness seat, you can see that hand clearly."
    },
    "c41_final": {
      "title": "One Question",
      "text": "Chair Seo Taerin stands two stopwatches side by side. 'Face-to-face questioning between the unsworn witness and the witness is allowed for 1 minute.' Between the witness stand and the unsworn witness seat: four steps. For the first time, Yoon Sanghyuk turns toward you. In the third row of the gallery sit Moon Gaeul and Yoon Seojin, and in the last seat, Moon Hajun has taken off his rice cake shop apron and folded it on his knees. The cameras’ red lights come on all at once. The chair presses a stopwatch. 60 seconds. Whatever you ask, the answer he has prepared will be 'I don’t recall.' One problem remains. What that answer becomes in this room.",
      "memo": [
        "Face-to-face questioning, 1 minute -- 1 question",
        "'I don’t recall' 22 times; 1 more for Kwon Dohyun’s bet",
        "Gallery: Moon Gaeul · Yoon Seojin · Moon Hajun",
        "One paper chosen before the recess -- whether it goes into the question is decided now"
      ],
      "choices": {
        "c41_final_chair": {
          "label": "Ask the chair to call the decision-maker above him"
        },
        "c41_final_name": {
          "label": "Point to the gallery: does he know her husband’s name?"
        },
        "c41_final_page": {
          "label": "Hold up page 3, its e-signature field empty, and ask whose"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "National Assembly Policy Committee Room · Between the Witness Stand and the Unsworn Witness Seat",
      "clock": "Hearing Day · 14:00, Resumed",
      "question": "60 seconds, one question, and the answer already decided. What do you ask?",
      "lead": "The recess ends, and the red light on the unsworn witness seat’s microphone comes on again."
    },
    "c41_aftershock": {
      "title": "Number 23",
      "text": "The hearing ends at 18:40. In the transcript, 'I don’t recall' appears exactly 23 times; the last came in the afternoon. Kwon Dohyun, who wrote twenty-three on the bookshop betting board, collects a box of cup noodles from Kang Taemin and says, 'I’ll look into whether prize money is taxable.' Outside the National Assembly’s main gate, Yoon Seojin does not get into her father’s car. She turns back and carries the empty rice cake boxes for Moon Gaeul, who took them out of the locker and handed the rice cakes around. At a tent bar in Yeouido, Cha Jiwon eats a real meal instead of triangle kimbap for the first time. It’s her second bowl. When the glasses have gone around once, Kang Taemin says briefly, 'Next time, let’s meet somewhere without papers.'",
      "memo": [
        "Transcript: 'I don’t recall' 23 times",
        "Bet winner Kwon Dohyun -- prize: 1 box of cup noodles",
        "Committee votes next week on whether to file a perjury complaint",
        "Kang Taemin: 'next time, somewhere without papers'"
      ],
      "choices": {
        "c41_after_record": {
          "label": "Match the 23 answers to that day’s papers in a table"
        },
        "c41_after_warm": {
          "label": "Stay at the tent bar and drink to the end with the gallery"
        },
        "c41_after_rush": {
          "label": "Head straight to the office to prepare the next fight"
        }
      },
      "place": "Yeouido · Tent Bar outside the National Assembly",
      "clock": "Hearing Day · 21:00 · Hot Night",
      "question": "On the night 23 rounds of 'I don’t recall' end, someone says to meet where there are no papers. How do you close this night?"
    },
    "c41_questions": {
      "title": "1,112 Questions",
      "text": "Before the Gangseo Branch windows open, Do Yoonha holds out his phone. Last night he posted a notice in the victims’ group chat, 'One line each: what you want to ask CEO Yoon Sanghyuk,' and by morning 1,112 replies were in. Half are curses. The other half are strangely specific. 'Who told you to add our factory as collateral?' 'Do you remember when my savings matured?' Moon Gaeul’s question is nine syllables. 'Do you know my husband’s name?' Do Yoonha can’t turn off the screen. 'We only get one question. Where do the other one thousand one hundred eleven go?'",
      "memo": [
        "1,112 questions in one night -- half are curses",
        "Moon Gaeul: 'Do you know my husband’s name?'",
        "Unsworn witness questions: 1"
      ],
      "choices": {
        "c41_questions_choice_3": {
          "label": "Close submissions today; focus on a single line"
        },
        "c41_questions_choice_2": {
          "label": "Sort the 1,112 questions and file them as written questions"
        },
        "c41_questions_choice_1": {
          "label": "Promise to carry Moon Gaeul’s nine syllables as they are"
        }
      },
      "place": "KD Bank Gangseo Branch · Before the Windows Open",
      "clock": "Hearing in D-2 · 08:40",
      "question": "1,112 questions came in one night, and you can use one. What do you do with the rest?"
    },
    "c41_gallery": {
      "title": "No Rice Cakes Allowed",
      "text": "At the security checkpoint at the gallery entrance, Moon Gaeul stops. Three boxes of rice cakes have been flagged. A National Assembly guard says, 'Food is not allowed inside,' and Moon Gaeul’s polite speech gets sharper. 'This isn’t food. This is 1,740 people.' Na Junhyuk starts negotiating in the voice of 30 years behind a bank counter, and Kang Taemin, saying 'I’ll reduce the evidence,' eats three pieces of injeolmi on the spot. In the end the rice cakes go to a locker. But there are 40 gallery passes, and eighty-two people came from the victims’ group and the 41 Club. Half will have to stay in front of the hallway monitors.",
      "memo": [
        "3 boxes of rice cakes -- locker 17",
        "40 gallery passes, 82 people came",
        "Kang Taemin attempts 'destruction of evidence' with 3 pieces of injeolmi"
      ],
      "choices": {
        "c41_gallery_choice_2": {
          "label": "Demand the Secretariat disclose how passes are allotted"
        },
        "c41_gallery_choice_3": {
          "label": "Let people in by order in line and wait for the opening"
        },
        "c41_gallery_choice_1": {
          "label": "Give your colleagues’ passes to the victims’ group"
        }
      },
      "place": "National Assembly Main Building · Lobby Security Checkpoint",
      "clock": "Hearing Day · 09:45",
      "question": "There are forty passes, and 82 people came. Whom do you let in?"
    },
    "c41_recess": {
      "title": "Lunch Recess",
      "text": "In the hallway behind the hearing room, Cha Jiwon finishes a triangle kimbap in two bites and folds the wrapper in half. 'The lawmaker wants a name. Like last year. Yoon Sanghyuk erased it, one sentence. That’s tomorrow’s page 1.' She shows you her phone. A text the Group PR office sent reporters before the recess even began. 'CEO Yoon Sanghyuk appeared in a personal capacity and has no connection to the Group.' Cha Jiwon says, without smiling, 'See, they’re already cutting off the tail. Say only the name and it ends with that one man. Is that what you want?'",
      "memo": [
        "Lawmaker’s office request: one sentence, 'Yoon Sanghyuk erased it'",
        "Group PR office text: 'appeared in a personal capacity'",
        "Resumes at 14:00"
      ],
      "choices": {
        "c41_recess_choice_2": {
          "label": "Ask to submit the Group PR text as committee material"
        },
        "c41_recess_choice_1": {
          "label": "Open your 1 minute with one victim’s story, not a name"
        },
        "c41_recess_choice_3": {
          "label": "Accept the one sentence the lawmaker’s office wants"
        }
      },
      "place": "National Assembly Main Building · Hallway behind the Hearing Room",
      "clock": "Hearing Day · Recess 12:15",
      "question": "The lawmaker’s office wants a name in one sentence, and the Group is already cutting off the tail. What do you do?"
    },
    "c41_questions_reaction": {
      "title": "The 41 Club’s Question",
      "text": "In his first week working part-time at the rice cake shop, Moon Hajun comes to the bookshop in his apron. He has tucked his FitScore result sheet into his sketchbook. 'The 41 Club people asked me to ask. Whose record is the standard that cut our scores?' Hajun hesitates a moment, then smiles. 'But they say that standard is your record. The 9 seconds you hesitated. I kind of liked that. That we’re alike.' He closes the sketchbook. 'Can I go to the hearing? I want to see that man’s face. I won’t curse. Probably.'",
      "memo": [
        "The 9 seconds that became the standard for cutting scores",
        "'I liked that we’re alike'"
      ],
      "choices": {
        "c41_questions_reaction_choice_3": {
          "label": "Say applications come first; stay at the shop this time"
        },
        "c41_questions_reaction_choice_2": {
          "label": "Submit his result sheet to the committee as FitScore material"
        },
        "c41_questions_reaction_choice_1": {
          "label": "Promise to take Moon Hajun to the gallery"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Stair Landing",
      "clock": "Hearing in D-2 · 16:00",
      "question": "A high school student who failed because he resembles you wants to see the witness’s face. What do you say?"
    },
    "c41_gallery_reaction": {
      "title": "The Next Seat",
      "text": "Gallery seats go by order of application. The seat next to Moon Gaeul is Yoon Seojin’s. Both check their seat tickets twice. Yoon Seojin stands first and bows her head. 'I’ll change seats.' Instead of answering, Moon Gaeul takes a piece of injeolmi from her bag and holds it out. A rice cake you thought had all gone into the locker. 'Sit. What did the daughter do wrong? But listen to your father’s answers properly. I’m going to listen properly too.' Yoon Seojin sits down, holding the rice cake. 2 minutes until the hearing opens.",
      "memo": [
        "The victim’s wife and the witness’s daughter, side by side",
        "One piece of injeolmi that slipped past the locker"
      ],
      "choices": {
        "c41_gallery_reaction_choice_2": {
          "label": "Report the seating to gallery staff and have it changed"
        },
        "c41_gallery_reaction_choice_1": {
          "label": "Leave the two of them sitting side by side"
        },
        "c41_gallery_reaction_choice_3": {
          "label": "Say there’s no time for this; go to your seat first"
        }
      },
      "place": "National Assembly Policy Committee Room · Gallery",
      "clock": "Hearing Day · 09:58",
      "question": "The victim’s wife and the witness’s daughter end up side by side. What do you do about these seats?"
    },
    "c41_recess_reaction": {
      "title": "Five Months’ File",
      "text": "3 minutes before the recess ends, Han Seoyun comes down from the back row of the gallery. She has been on standby assignment since April, so she wears a visitor’s pass around her neck instead of an employee ID. She presses her phone into your hand. The recording of her call with Yoon Sanghyuk on the day she returned the loan, the one she played for you last autumn. 'Last year this file was your fight. Today, use it with my name on it. Including the fact that I’m the one who returned it.' Her fingertips tremble a little. 'Five months without work, and this one file is all I had left.'",
      "memo": [
        "Five months on standby assignment, one file left",
        "The name of the one who returned it, too"
      ],
      "choices": {
        "c41_recess_reaction_choice_2": {
          "label": "Formally submit the recording in Han Seoyun’s name"
        },
        "c41_recess_reaction_choice_3": {
          "label": "Say there’s no time; just take the recording file"
        },
        "c41_recess_reaction_choice_1": {
          "label": "Protect Han Seoyun’s name; explain the recording yourself"
        }
      },
      "place": "National Assembly Policy Committee Room · Back Row of the Gallery",
      "clock": "Hearing Day · 13:57",
      "question": "The one who returned the loan hands you the recording and asks you to use her name too. How do you use this file?"
    },
    "c41_branch_study": {
      "title": "Behind the Study Door",
      "text": "When the mock hearing ends, Yoon Seojin comes to the alley outside the bookshop. In her graduate-school bag is a notebook she took from her father’s study. 'Dad practices in his study every night. His lawyer reads the questions and Dad answers. I counted through the door. Last night alone it was 23 times. I don’t recall.' She grips her bag strap tight. 'People who can’t remember don’t practice. I came to tell you that. And this, too.' The bag’s zipper opens halfway.",
      "memo": [
        "Yoon Seojin: graduate student in financial ethics, Yoon Sanghyuk’s daughter",
        "Practice in the study -- 'I don’t recall' 23 times in one night",
        "In the bag: her father’s 2023 notebook",
        "Three days until the hearing"
      ],
      "choices": {
        "c41_branch_study_c": {
          "label": "Say her father’s business is his; send her home for today"
        },
        "c41_branch_study_b": {
          "label": "Write up the practice she heard, with dates, as a statement"
        },
        "c41_branch_study_a": {
          "label": "First hear out what Seojin wants today, to the end"
        }
      },
      "place": "Outside the Hoegi-dong Secondhand Bookshop · Alley",
      "clock": "Hearing in D-3 · 23:00",
      "question": "The witness’s daughter counted her father’s practice through the door. How do you receive this visit?"
    },
    "c41_branch_study_follow": {
      "title": "Keep X",
      "text": "Under the alley streetlight, Yoon Seojin opens the notebook. The line she showed you only as a single photo in July is there in the Thursday box of the fourth week of April 2023, in her father’s handwriting. '0412 — dissent — keep X.' In the Friday box right beside it: 'Gallery On opening — check Seojin’s tuition.' Yoon Seojin smiles, but her eyes fill first. 'At first I wanted to protect Dad with this notebook. If I showed he didn’t forget, that he knew, at least he wouldn’t be a liar. Strange, isn’t it. Apparently that’s the best defense I can give him.'",
      "memo": [
        "Thursday, fourth week of April: '0412 — dissent — keep X'",
        "Friday, same week: 'Gallery On opening — check Seojin’s tuition'",
        "Original notebook kept by Yoon Seojin",
        "Yoon Seojin: hearing gallery application done"
      ],
      "choices": {
        "c41_branch_study_follow_b": {
          "label": "Submit a copy of the notebook as evidence first"
        },
        "c41_branch_study_follow_a": {
          "label": "Let Seojin decide on hearing day whether to use it"
        },
        "c41_branch_study_follow_c": {
          "label": "Say you won’t use it; put the notebook back in her bag"
        }
      },
      "place": "Outside the Hoegi-dong Secondhand Bookshop · Under the Alley Streetlight",
      "clock": "Hearing in D-3 · 23:40",
      "question": "In one week of the notebook, the dissent and his daughter’s tuition are written side by side. What do you do with it?"
    },
    "c41_route_system": {
      "title": "The Statistics of Memory",
      "text": "You put off the 1-minute question and ask for statistics first. How has 'I don’t recall' ended until now? Lee Minseo turns her laptop toward you. She spent the night scraping the National Assembly’s public meeting records, every hearing held over the past 20 years. In 1,406 transcripts, 'I don’t recall' and similar phrases appear 6,212 times. Of those, 14 were reported for perjury, and 2 ended in a final conviction. Lee Minseo closes the screen. 'You can’t prove that not remembering is a lie. That’s why it’s the safest answer. Everyone who uses it knows that.'",
      "memo": [
        "1,406 hearing transcripts -- 'I don’t recall' and its variants 6,212 times",
        "14 perjury complaints, 2 final convictions",
        "These statistics have never been cited in any hearing material"
      ],
      "choices": {
        "c41_route_system_skip": {
          "label": "Give the statistics to the press; keep the hearing as planned"
        },
        "c41_route_system_share": {
          "label": "Hand the statistics to every member and the gallery at once"
        },
        "c41_route_system_reframe": {
          "label": "Swap questions about memory for questions papers answer"
        },
        "c41_route_system_evidence_turn": {
          "label": "Attach that day’s papers to every 'I don’t recall'"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Laptop by the Shelves",
      "clock": "Hearing in D-1 · 02:30",
      "question": "For 20 years, 'I don’t recall' has been the safest answer. What do you do with these statistics?"
    },
    "c41_final_system_route": {
      "title": "One More Line for the Table",
      "text": "Ahead of the 14:00 resumption, the phone on the unsworn witness seat’s table buzzes briefly. A table from Lee Minseo. Of 6,212 times, 14 went as far as a complaint, two ended in conviction. Below that, this morning’s 22 times have been added as a new line. It is four steps to the witness stand, and you have 1 minute. Another message comes. 'If you ask about memory, that table gets one more line. Don’t ask about his memory. Ask about something else in this room. Paper or people.'",
      "memo": [
        "'I don’t recall' and variants 6,212 times -- 14 complaints, 2 convictions",
        "22 times this morning",
        "Unsworn witness question: 1 minute, 1 question"
      ],
      "choices": {
        "c41_final_system_route_a": {
          "label": "Lay down that day’s paper for every claim of no memory"
        },
        "c41_final_system_route_b": {
          "label": "Have the answer recorded with the perjury complaint criteria"
        },
        "c41_final_system_route_c": {
          "label": "Spend the 1 minute reading the names of the 212 without papers"
        }
      },
      "place": "National Assembly Policy Committee Room · Unsworn Witness Seat",
      "clock": "Hearing Day · 14:00, Resumed",
      "question": "Ask about memory, and the answer only adds one line to the table. For 1 minute, what do you make answer instead of memory?"
    },
    "c41_evidence_turn": {
      "title": "The Memory Date Table",
      "text": "In the records room behind the hearing room, Ban Jaewook opens his notebook and pushes a table toward you. From the morning transcript up to noon, he has copied, line by line, the 22 times Yoon Sanghyuk answered 'I don’t recall,' and in the next column attached the papers from the date each question points to. On 19 of the 22 lines, there is a document Yoon Sanghyuk personally received or e-signed that day. The receipt log for page 3, the one with the empty e-signature field, is one of them. The Haeon Partners advisory fee payment confirmation and the FitScore investment approval are there too. Ban Jaewook sets down his pen. 'Memory can fail. E-signature records don’t get erased.'",
      "memo": [
        "'I don’t recall' 22 times this morning",
        "19 of them: a document Yoon Sanghyuk received or e-signed that day",
        "The other 3: no document -- he may truly not know"
      ],
      "choices": {
        "c41_evidence_turn_one": {
          "label": "Pick 1 of the 19 lines and load it into one question"
        },
        "c41_evidence_turn_court": {
          "label": "Send the date table straight to next month’s trial court"
        },
        "c41_evidence_turn_submit": {
          "label": "Give the whole table to the chair; request a perjury complaint"
        }
      },
      "place": "National Assembly Main Building · Records Room behind the Hearing Room",
      "clock": "Hearing Day · Recess 13:20",
      "question": "Of the 22 times he said 'I don’t recall,' 19 carry his e-signature. How do you use this table?"
    },
    "c41_start_warm": {
      "title": "A Hearing after the Shutter Came Down",
      "text": "After the weekend you pulled down the rice cake shop’s shutter and counted Hajun’s first pay envelope together, the National Assembly Policy Committee sets the date for a hearing. Witness Yoon Sanghyuk, attending this time. You are an unsworn witness again, and you get one question. Hajun posts a line in the group chat. 'How do you apply for the gallery? Everyone in the 41 Club wants to go. I’ll ask for Friday off from work. The boss is my mom, so it’s fine.'",
      "memo": [
        "First pay envelope: '100 points' in Moon Gaeul’s handwriting",
        "Hearing in D-4 -- witness Yoon Sanghyuk will attend",
        "41 Club: gallery requests pouring in"
      ],
      "choices": {
        "c41_start_warm_timeline": {
          "label": "Line up Yoon Sanghyuk’s past statements and papers by date"
        },
        "c41_start_warm_signature": {
          "label": "Fill out gallery applications one by one with the 41 Club"
        },
        "c41_start_warm_team": {
          "label": "Call your scattered colleagues to prepare together"
        },
        "c41_start_warm_office": {
          "label": "Lock in your questioning slot at the lawmaker’s office"
        },
        "c41_start_warm_reframe": {
          "label": "Ask how 'I don’t recall' has ended before"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market · Inside, Shutter Down",
      "clock": "Monday, Fourth Week of August · Hearing in D-4",
      "question": "Everyone in the 41 Club wants a seat in the gallery. Where do you start gathering this?",
      "lead": "In the rice cake shop where you counted the first pay envelope, Hajun reads the group chat alert out loud."
    },
    "c41_start_record": {
      "title": "A Hearing for the One Who Bound the List",
      "text": "Two days after you bound and sent the list of 1,106 members of the 41 Club with their consent forms, the document sits at the very front of a file on the 7th floor of the Members’ Office Building. The National Assembly Policy Committee has set the date for a hearing, and witness Yoon Sanghyuk is attending this time. You are an unsworn witness again. Cha Jiwon taps the file. 'You write good paperwork. But 1,106 people don’t fit into 7 minutes. This time, this paperwork has to become one question.'",
      "memo": [
        "41 Club list, 1,106 people -- received by the lawmaker’s office",
        "Hearing in D-4 -- witness Yoon Sanghyuk will attend",
        "1 question for the unsworn witness"
      ],
      "choices": {
        "c41_start_record_team": {
          "label": "Call your scattered colleagues to prepare together"
        },
        "c41_start_record_timeline": {
          "label": "Line up Yoon Sanghyuk’s past statements and papers by date"
        },
        "c41_start_record_office": {
          "label": "Lock in your questioning slot at the lawmaker’s office"
        },
        "c41_start_record_signature": {
          "label": "Start by cutting the list of 1,106 down to one question"
        },
        "c41_start_record_reframe": {
          "label": "Ask how 'I don’t recall' has ended before"
        }
      },
      "place": "Members’ Office Building 7th Floor · Lawmaker’s Office",
      "clock": "Monday, Fourth Week of August · Hearing in D-4",
      "question": "The list of 1,106 doesn’t fit into 7 minutes. How do you turn this paper into a question?",
      "lead": "At the very front of the lawmaker’s office file, you find the document you bound and sent."
    },
    "c41_start_rush": {
      "title": "A Hearing for the One Who Brought Injeolmi",
      "text": "When you arrive on the 7th floor of the Members’ Office Building with injeolmi in your bag, Cha Jiwon is already printing the hearing’s witness list. First line: Yoon Sanghyuk, attending this time. The unsworn witness field is still blank. Cha Jiwon smells the injeolmi first, takes a piece, and holds out a ballpoint pen. 'You came early, so write your name yourself. But whoever comes early gets attacked first. I hear his lawyers have already pulled your HR records.'",
      "memo": [
        "Arrived at the Members’ Office Building 7th floor -- 1 injeolmi for Cha Jiwon",
        "Unsworn witness field blank -- fill it in yourself",
        "Yoon Sanghyuk’s side has viewed your HR records"
      ],
      "choices": {
        "c41_start_rush_signature": {
          "label": "Write your own name in the witness field; take the first slot"
        },
        "c41_start_rush_timeline": {
          "label": "Line up Yoon Sanghyuk’s past statements and papers by date"
        },
        "c41_start_rush_team": {
          "label": "Call your scattered colleagues to prepare together"
        },
        "c41_start_rush_office": {
          "label": "Lock in your questioning slot at the lawmaker’s office"
        },
        "c41_start_rush_reframe": {
          "label": "Ask how 'I don’t recall' has ended before"
        }
      },
      "place": "Members’ Office Building 7th Floor · Lawmaker’s Office",
      "clock": "Saturday, Third Week of August · Hearing in D-6",
      "question": "The unsworn witness field is blank, and the lawyers on the other side are already reading your records. What do you do first?",
      "lead": "You are still out of breath from running down the 7th-floor hallway of the Members’ Office Building."
    }
  },
  "echoReplies": {
    "c41_start_team": "You call, and six people come from six places. Their commutes all differ, so the first meeting only starts at eight at night.",
    "c41_start_timeline": "Lining up the dates shows you in advance the days Yoon Sanghyuk 'won’t recall.' Building that table takes a full day.",
    "c41_start_office": "The slot comes fast. The lawmaker’s office gets to rewrite the slot-holder’s question first.",
    "c41_drill_victims": "You collect them, and the questions pour in. The moment you choose one, there are people whose questions weren’t chosen.",
    "c41_drill_paper": "Document questions are solid. Solid questions rarely last past 40 seconds on air.",
    "c41_drill_hand": "The lawmaker’s office writes good questions. But the last line of each is the sentence the office wants.",
    "c41_corridor_daughter": "You tell her ahead of time, and Yoon Seojin stays in the gallery. But throughout the hearing she looks only at her father’s back.",
    "c41_corridor_report": "You report it, and the chair opens with a warning about 'the witness contacting the unsworn witness.' Yoon Sanghyuk’s expression doesn’t change at all.",
    "c41_corridor_cup": "You walk past, and the paper cup stays in his hand. He never finishes that coffee.",
    "c41_chamber_notebook": "Yoon Seojin puts her bag on her lap and nods. When that line comes out, the third row of the gallery will go quiet.",
    "c41_chamber_receipt": "A receipt log can’t be refuted. Except that the person who received it doesn’t remember.",
    "c41_chamber_invest": "Bring out the 4 billion won and it will be news. The moment it is news, the 1,740 people in the gallery get pushed off the screen.",
    "c41_final_name": "He answers, 'I don’t recall.' The 23rd time. In the gallery, Moon Gaeul stands and says her husband’s name clearly, syllable by syllable, and the transcript takes it down.",
    "c41_final_page": "He answers, 'I don’t recall.' The 23rd time. Given over a blank field, that answer itself becomes the first record to fill the field.",
    "c41_final_chair": "The chair hesitates, then says, 'We will consider it.' For the first time, Yoon Sanghyuk gets 1 minute with nothing to answer.",
    "c41_after_warm": "When the last glasses are emptied, 12 people remain at the tent bar. Moon Hajun makes three toasts with cider.",
    "c41_after_record": "The table has twenty-three rows. 19 rows carry his e-signature, and the other four rows, even you don’t know about.",
    "c41_after_rush": "Days of being the last to turn off the office lights follow. In the tent bar group chat, you are the only one with no photo.",
    "c41_questions_choice_1": "You promise, and Moon Gaeul asks three times, 'You’ll really ask?' The other one thousand one hundred eleven stay in the group chat as they are.",
    "c41_questions_choice_2": "Written questions get attached to the transcript. They don’t go out on air, and the answer deadline is after the hearing ends.",
    "c41_questions_choice_3": "Submissions close, and the group chat goes quiet. Some of those who went quiet won’t send questions next time either.",
    "c41_gallery_choice_1": "You hand them over, and your colleagues stand by the hallway monitors. Kang Taemin carries the chairs from in front of the monitors to the doorway and lines people up.",
    "c41_gallery_choice_2": "You ask for the criteria, and the Secretariat answers, 'Custom.' Custom isn’t written down, which makes it hard to refute.",
    "c41_gallery_choice_3": "By order in line, the people who took the first train at dawn get seats. Three of Moon Gaeul’s neighbors, who came late, are left in the hallway.",
    "c41_recess_choice_1": "Cha Jiwon sighs. 'Page 4, then.' Then she writes Moon Gaeul’s name in the margin of the question sheet.",
    "c41_recess_choice_2": "The submitted text is attached to the transcript. The time the Group cut off the tail stays on record: 11:52.",
    "c41_recess_choice_3": "That one sentence will make page 1. On that page 1 will be Yoon Sanghyuk alone, and no one above him.",
    "c41_questions_reaction_choice_1": "You promise, and Hajun takes off his apron and folds it into his bag. On hearing day, a sign on the rice cake shop shutter reads 'Closed today.'",
    "c41_questions_reaction_choice_2": "His result sheet becomes evidence, and Hajun’s 41 gets a case number. Hajun copies that number into his sketchbook.",
    "c41_questions_reaction_choice_3": "Hajun nods and turns away. You find out in the gallery line on the morning of the hearing that the nod wasn’t an answer.",
    "c41_gallery_reaction_choice_1": "Left as they are, the two never look at each other once during the hearing. The injeolmi slowly goes cold in Yoon Seojin’s hand.",
    "c41_gallery_reaction_choice_2": "A seat opens between them, and Moon Gaeul looks a little hurt. 'I gave her a rice cake. Isn’t that enough?'",
    "c41_gallery_reaction_choice_3": "You look back from the unsworn witness seat; the two are looking in the same direction. You never learn what passed between them.",
    "c41_recess_reaction_choice_1": "You protect her name, and Han Seoyun stays in her gallery seat. If the file is played, you alone will explain that voice.",
    "c41_recess_reaction_choice_2": "With her name on it, the recording becomes evidence and Han Seoyun a potential witness. She sits to the end without taking off her visitor’s pass.",
    "c41_recess_reaction_choice_3": "You only take it, and the file stays on your phone. Han Seoyun goes back to the back row empty-handed.",
    "c41_branch_study_a": "You listen to the end, and it takes Yoon Seojin 40 minutes to bring up the notebook. She needed those 40 minutes.",
    "c41_branch_study_b": "As a statement, Yoon Seojin’s name goes onto paper. She picks up the pen, then puts it down once.",
    "c41_branch_study_c": "You try to send her home, and Yoon Seojin turns around at the end of the alley. 'Just look at this before you go.' Her hand goes back to the zipper she closed.",
    "c41_branch_study_follow_a": "Left to her, the notebook stays in Yoon Seojin’s bag. Whether that bag enters the hearing room, you’ll know only that morning.",
    "c41_branch_study_follow_b": "Submitted, the notebook gets an evidence number. Yoon Seojin learns that number before her father does.",
    "c41_branch_study_follow_c": "You put it back, and Yoon Seojin thanks you. Then, on hearing day, she comes to the gallery carrying that bag.",
    "c41_route_system_share": "You hand them out, and the gallery reads the statistics first. The lawyers at the witness stand get the same sheet and read it too.",
    "c41_route_system_reframe": "To a question the papers answer, 'I don’t recall' is not an answer. But there’s not enough time to prepare.",
    "c41_route_system_skip": "The story runs. The hearing opens as planned, and the 6,213th 'I don’t recall' comes as planned too.",
    "c41_final_system_route_a": "The more papers pile up, the shorter his answers get. The 23rd is almost inaudible.",
    "c41_final_system_route_b": "With the criteria in the transcript, the complaint becomes a procedure. Procedures are slow, and meanwhile the 1 minute ends.",
    "c41_final_system_route_c": "While you read the names, Yoon Sanghyuk has no chance to answer. Not even a claim that he doesn’t recall comes out, this one time.",
    "c41_evidence_turn_submit": "You submit it, and the chair puts a perjury complaint on next week’s agenda. This table doesn’t appear on today’s broadcast.",
    "c41_evidence_turn_one": "One line is sharp. The other 18 lines stay in Ban Jaewook’s notebook.",
    "c41_evidence_turn_court": "The court receives the table. The people in the National Assembly gallery never learn it existed.",
    "c41_drill_evidence_turn": "Attaching dates runs until the lunch recess on hearing day. Wherever memory is empty, a paper stands. Unlike memory, papers can’t be picked and chosen.",
    "c41_corridor_evidence_turn": "Attaching dates runs until the lunch recess on hearing day. Wherever memory is empty, a paper stands. Unlike memory, papers can’t be picked and chosen.",
    "c41_chamber_evidence_turn": "Attaching dates runs until the lunch recess on hearing day. Wherever memory is empty, a paper stands. Unlike memory, papers can’t be picked and chosen.",
    "c41_route_system_evidence_turn": "Attaching dates runs until the lunch recess on hearing day. Wherever memory is empty, a paper stands. Unlike memory, papers can’t be picked and chosen.",
    "case41_memory_system": "The question sheet did not carry your play. Every expected-answer field has the same answer written in it. Lee Minseo counts that answer across 20 years of meeting records.",
    "case41_memory_evidence": "Put the approval beside it, and on the days he said he didn’t recall, his e-signature is there. Ban Jaewook fills the table the same way until the recess on hearing day.",
    "c41_start_warm_team": "You call, and six people come from six places. Their commutes all differ, so the first meeting only starts at eight at night.",
    "c41_start_warm_timeline": "Lining up the dates shows you in advance the days Yoon Sanghyuk 'won’t recall.' Building that table takes a full day.",
    "c41_start_warm_office": "The slot comes fast. The lawmaker’s office gets to rewrite the slot-holder’s question first.",
    "c41_start_warm_signature": "Filling them out together, you end up with 82 applications. So far, only you know there are just 40 gallery passes.",
    "c41_start_record_team": "You call, and six people come from six places. Their commutes all differ, so the first meeting only starts at eight at night.",
    "c41_start_record_timeline": "Lining up the dates shows you in advance the days Yoon Sanghyuk 'won’t recall.' Building that table takes a full day.",
    "c41_start_record_office": "The slot comes fast. The lawmaker’s office gets to rewrite the slot-holder’s question first.",
    "c41_start_record_signature": "As you cut it down, names drop out one by one. The last line left has no one’s name in it.",
    "c41_start_rush_team": "You call, and six people come from six places. Their commutes all differ, so the first meeting only starts at eight at night.",
    "c41_start_rush_timeline": "Lining up the dates shows you in advance the days Yoon Sanghyuk 'won’t recall.' Building that table takes a full day.",
    "c41_start_rush_office": "The slot comes fast. The lawmaker’s office gets to rewrite the slot-holder’s question first.",
    "c41_start_rush_signature": "The first slot is yours. The other side’s lawyers get that much longer to read your HR records."
  },
  "choiceVoiceLines": {
    "c41_start_team": "Refusing to prepare alone, you call your scattered colleagues to get ready for the hearing together.",
    "c41_start_timeline": "To see first what the witness who says he’ll attend has been saying, you line up Yoon Sanghyuk’s past statements and papers by date.",
    "c41_start_office": "This time the witness comes in person, so you go straight to the lawmaker’s office and lock in your questioning slot.",
    "c41_drill_victims": "Saying the only question should belong to the people who were hurt, you collect the questions the victims want to ask and choose one.",
    "c41_drill_paper": "Having just seen that memory is a choice, you keep only document questions he can’t claim to forget.",
    "c41_drill_hand": "Saying they know the 1-minute format better, you leave the draft questions to the lawmaker’s office and focus on organizing evidence.",
    "c41_corridor_daughter": "So she doesn’t hear it first from the gallery, you find Yoon Seojin and tell her in advance what you’ll be asking today.",
    "c41_corridor_report": "Since the contact is recorded nowhere, you write down what was said in the hallway, word for word, and report it to the chair’s office.",
    "c41_corridor_cup": "Saying that the moment you reply you step into his story, you decline the coffee and walk past without a word.",
    "c41_chamber_notebook": "Saying his own handwriting shows he knew, you get Yoon Seojin’s consent and bring out one line from her father’s notebook.",
    "c41_chamber_receipt": "Receiving something has nothing to do with memory, so with a single receipt log you first establish that he received those papers.",
    "c41_chamber_invest": "Saying big numbers move the room, you bring out the 4 billion won FitScore investment approval and grab today’s headlines.",
    "c41_final_name": "To make him give his prepared answer in front of Moon Gaeul, you point to the gallery and ask whether he knows her husband’s name.",
    "c41_final_page": "Saying memory may be gone but the blank is right in front of him, you hold up the printout of page 3 with its empty e-signature field and ask whose field this is.",
    "c41_final_chair": "Deciding not to spend your 1 minute on one man’s memory, you turn the question to the chair and propose calling the decision-maker above him as a witness.",
    "c41_after_warm": "Unable to just send off the people who listened with you, you stay at the tent bar and drink to the end with everyone who came to the gallery today.",
    "c41_after_record": "So there is something to look at during next week’s vote, you match the 23 answers to that day’s papers and keep them in a table.",
    "c41_after_rush": "Saying this is no time to rest with the complaint vote next week, you head straight back to the office from the hearing room to prepare the next fight.",
    "c41_questions_choice_1": "You may not know where the other one thousand one hundred eleven will go, but you know where this line goes, so you promise to carry Moon Gaeul’s nine syllables as they are.",
    "c41_questions_choice_2": "So the other one thousand one hundred eleven have somewhere to go too, you sort the 1,112 questions and file them with the committee as written questions.",
    "c41_questions_choice_3": "You can only ask one anyway, so you close submissions today and focus on a single line.",
    "c41_gallery_choice_1": "Saying others are the ones who need to hear that answer in person, you give your colleagues’ gallery passes to the victims’ group.",
    "c41_gallery_choice_2": "Saying you need to know why 40 means forty, you demand that the National Assembly Secretariat disclose how gallery passes are allotted.",
    "c41_gallery_choice_3": "Saying you can’t decide who among the 82 comes first, you let people in by order in line and wait for the hearing to open.",
    "c41_recess_choice_1": "Saying you don’t want this to end with Yoon Sanghyuk alone, you say you’ll open your 1 minute with one victim’s story instead of a name.",
    "c41_recess_choice_2": "So that the hand cutting off the tail goes on record too, you ask that the Group PR office’s text be submitted as committee material.",
    "c41_recess_choice_3": "Saying people only look if it’s on page 1, you accept the one sentence the lawmaker’s office wants.",
    "c41_questions_reaction_choice_1": "Saying someone whose score was cut has the right to see that face, you promise to take Moon Hajun to the gallery.",
    "c41_questions_reaction_choice_2": "So the record shows whose record cut the 41, you submit his result sheet to the committee along with the FitScore material.",
    "c41_questions_reaction_choice_3": "Saying you can’t let that man’s face make him miss his application deadline, you tell him to stay at the rice cake shop this time.",
    "c41_gallery_reaction_choice_1": "Saying the woman who offered the rice cake has already decided, you leave the two of them sitting side by side.",
    "c41_gallery_reaction_choice_2": "So no one gets hurt by seats the application order made, you report the seating to gallery staff and have it officially adjusted.",
    "c41_gallery_reaction_choice_3": "Saying with 2 minutes to opening you have no room to worry about seats, you go to the unsworn witness seat first.",
    "c41_recess_reaction_choice_1": "Saying you can’t add more to five months of standby assignment, you protect Han Seoyun’s name and explain the recording in your own voice only.",
    "c41_recess_reaction_choice_2": "Saying it is her own wish to have her name on it, you formally submit the recording to the committee in Han Seoyun’s name.",
    "c41_recess_reaction_choice_3": "Saying with 3 minutes to resumption there’s no time to argue about names, you just take the recording file.",
    "c41_branch_study_a": "Before the bag is fully open, you first hear out, to the end, what Seojin wants today.",
    "c41_branch_study_b": "So the 23 don’t remain only something she overheard, you suggest writing up the practice she heard in the study, with dates, as a statement.",
    "c41_branch_study_c": "Saying a daughter needn’t carry her father’s business, you have her close the bag and send her home for today.",
    "c41_branch_study_follow_a": "It is a notebook she brought out to protect her father, so you let Seojin decide herself on hearing day whether to use it.",
    "c41_branch_study_follow_b": "Saying proof that he knew belongs in that room, you submit a copy of the notebook to the committee as official evidence first.",
    "c41_branch_study_follow_c": "Saying you won’t put a father on the stand by his daughter’s hand, you leave the notebook unused and put it back in her bag.",
    "c41_route_system_share": "These numbers have never been cited in any hearing material, so you hand the statistics to every committee member and the gallery at once.",
    "c41_route_system_reframe": "Deciding not to fight words that can’t be proven false, you swap questions about memory for questions the papers answer.",
    "c41_route_system_skip": "Saying numbers won’t change the hearing’s 1 minute, you give the statistics to the press and keep the hearing as planned.",
    "c41_final_system_route_a": "So paper answers instead of memory, you lay down that day’s paper, one sheet at a time, for every claim of no memory.",
    "c41_final_system_route_b": "So it doesn’t end as one more line on the table, you have that answer entered into the transcript along with the criteria for a perjury complaint.",
    "c41_final_system_route_c": "Saying if there is no paper you’ll ask about people, you spend the 1 minute reading the names of the 212 without papers.",
    "c41_evidence_turn_submit": "Trusting the words that signature records don’t get erased, you give the whole date table to the chair and request a perjury complaint.",
    "c41_evidence_turn_one": "You can’t read the whole table in 1 minute, so you pick 1 of the 19 lines and load it into one question.",
    "c41_evidence_turn_court": "Saying the place to argue over e-signatures is a courtroom, you send the date table straight to next month’s breach-of-trust trial court.",
    "c41_drill_evidence_turn": "To each 'I don’t recall,' you attach the date from the clues and stand up the papers he received that day.",
    "c41_corridor_evidence_turn": "To each 'I don’t recall,' you attach the date from the clues and stand up the papers he received that day.",
    "c41_chamber_evidence_turn": "To each 'I don’t recall,' you attach the date from the clues and stand up the papers he received that day.",
    "c41_route_system_evidence_turn": "To each 'I don’t recall,' you attach the date from the clues and stand up the papers he received that day.",
    "c41_start_warm_team": "Refusing to prepare alone, you call your scattered colleagues to get ready for the hearing together.",
    "c41_start_warm_timeline": "To see first what the witness who says he’ll attend has been saying, you line up Yoon Sanghyuk’s past statements and papers by date.",
    "c41_start_warm_office": "This time the witness comes in person, so you go straight to the lawmaker’s office and lock in your questioning slot.",
    "c41_start_warm_signature": "These people start by asking how to apply, so you fill out gallery applications one by one with the 41 Club.",
    "c41_start_record_team": "Refusing to prepare alone, you call your scattered colleagues to get ready for the hearing together.",
    "c41_start_record_timeline": "To see first what the witness who says he’ll attend has been saying, you line up Yoon Sanghyuk’s past statements and papers by date.",
    "c41_start_record_office": "This time the witness comes in person, so you go straight to the lawmaker’s office and lock in your questioning slot.",
    "c41_start_record_signature": "Told it won’t all fit into 7 minutes, you start by cutting the list of 1,106 down to one question.",
    "c41_start_rush_team": "Refusing to prepare alone, you call your scattered colleagues to get ready for the hearing together.",
    "c41_start_rush_timeline": "To see first what the witness who says he’ll attend has been saying, you line up Yoon Sanghyuk’s past statements and papers by date.",
    "c41_start_rush_office": "This time the witness comes in person, so you go straight to the lawmaker’s office and lock in your questioning slot.",
    "c41_start_rush_signature": "Saying you’ll take what being early is worth even if you’re attacked first, you write your own name in the unsworn witness field and take the first slot."
  },
  "pack": {
    "clue": {
      "title": "The Memory Date Table",
      "text": "Of the 22 times Yoon Sanghyuk answered 'I don’t recall,' 19 had a document he personally received or e-signed that day."
    },
    "outcomes": {
      "c41_after_warm": {
        "tag": "Stayed to the End",
        "title": "The night the hearing ended, you stayed for the last glass at the tent bar",
        "text": "People who sat in the gallery and people who stood at the hallway monitors gathered under one tent. Meeting again somewhere without papers became a promise."
      },
      "c41_after_record": {
        "tag": "Kept in a Table",
        "title": "23 rounds of 'I don’t recall' became a table of 23 rows",
        "text": "Beside each answer, you attached that day’s document. Memory was empty, but the rows were not."
      },
      "c41_after_rush": {
        "tag": "Ran Ahead",
        "title": "Right out of the hearing room, you went to the next fight",
        "text": "Instead of the tent bar, you went back to a dark office. In that night’s photos in the group chat, you are the only one missing."
      }
    },
    "continuityChallenges": {
      "c40_after_warm": {
        "title": "Go with the people who counted at the rice cake shop",
        "text": "The people who shared Hajun’s first shift want to go to the hearing too. A card that makes room for them in the gallery brings trust along."
      },
      "c40_after_record": {
        "title": "Turn the list of 1,106 into one question",
        "text": "A list bound as a document doesn’t fit into 7 minutes. Play a card that reshapes the table, and the list shrinks to one question."
      },
      "c40_after_rush": {
        "title": "Recover the steps of the unsworn witness who came early",
        "text": "The other side read your HR records first because you came early. Retrace, one by one, the steps you skipped in your hurry, and fairness fills up as you go."
      }
    }
  }
};
