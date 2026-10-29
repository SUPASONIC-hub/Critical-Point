/**
 * 사건 43 (src/nodes/case43.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c43_start": {
      "title": "Agenda Item 1",
      "text": "Every monitor shows the same notice. Agenda Item 1 for the KD Financial Group board is the future of inside director Yoon Sanghyuk. The item puts forward a dismissal motion against him. The board will also decide whether to call an extraordinary shareholders’ meeting. Han Seoyun, six months into her standby assignment, calls you. 'Eight people vote. The Chairman, and seven outside directors. The brief doesn’t have a single line about the 2023 board. The only one willing to testify about it is Baek Arin. If it all ends with one man leaving, then people like me, who pressed the return button back then, never happened. I don’t know if that’s a relief.'",
      "memo": [
        "Board meeting: Monday, September 7, 14:00 · Headquarters, 33rd floor",
        "Agenda Item 1: dismissal motion against inside director Yoon Sanghyuk · calling an extraordinary shareholders’ meeting",
        "8 voters -- Chairman Seo Dokyung 1 · outside directors 7 (2 recommended by Kingsdale) · 5 votes to pass",
        "Last line of the brief: 'related risk assets cleared' at 47 sites · mentions of 2023: 0 lines"
      ],
      "choices": {
        "c43_start_charter": {
          "label": "Go through the board rules and agenda brief clause by clause"
        },
        "c43_start_arin": {
          "label": "Find Baek Arin first and organize her testimony together"
        },
        "c43_start_count": {
          "label": "Count the seven outside directors’ votes first, fast"
        },
        "reframe": {
          "label": "Ask what the board has used dismissals for"
        }
      },
      "place": "KD Capital Headquarters · Risk Management Department",
      "clock": "Monday, August 31 · Board meeting in D-7",
      "question": "The board votes on dismissing Yoon Sanghyuk alone. 2023 is not in the brief. What do you do first?",
      "lead": "Your first day back at work from Gyeongpo. Eight floors up, the light in the CEO’s office has been off since this morning."
    },
    "c43_ledger": {
      "title": "Seven Profit-and-Loss Sheets",
      "text": "Seven A4 sheets land on the bookshop table. Kwon Dohyun made one profit-and-loss sheet per outside director, with the probability of a yes in the bottom box. At the end of the table, a note sent from Lim Kyungsoo’s hospital room. 'Check the back, too.' Oh Jinwoo pushes his phone forward. 'I put Professor Eun Chaewon at 0.6.' 'Based on what?' 'Gut feeling.' Without a word, Kwon Dohyun strikes a line through it. Three certain yeses, two likely noes. Two of the yeses are directors recommended by the top shareholder, Kingsdale Partners, who join by video from New York. What remains: the youngest, Eun Chaewon, at 0.48, Board Chair Yeon Taekyung at 0.50, and Chairman Seo Dokyung’s box, left blank. 'The Chairman can’t be calculated. He isn’t a variable. He’s a constant.' He flips Yeon Taekyung’s sheet over. On the back, one line in pencil. 'Attended the April 2023 board -- an outside director then, too.'",
      "memo": [
        "7 outside directors · 1 profit-and-loss sheet each",
        "Certain yes 3 · likely no 2 (former Haeon Partners advisers)",
        "Boxes left: Eun Chaewon 0.48 · Board Chair Yeon Taekyung 0.50 · Chairman 1 vote",
        "Yeon Taekyung: also attended the April 2023 board"
      ],
      "choices": {
        "c43_ledger_visit": {
          "label": "Bring the victims’ stories to Eun Chaewon, the youngest director"
        },
        "c43_ledger_conflict": {
          "label": "Formally flag the two likely noes’ advisory ties as conflicts"
        },
        "c43_ledger_target": {
          "label": "Work only the two the probability table says will turn"
        },
        "reframe": {
          "label": "Ask what the board has used dismissals for"
        },
        "c43_ledger_evidence_turn": {
          "label": "Open the two press releases written before the vote"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Table between the Shelves",
      "clock": "September 1 · Board meeting in D-6 · 20:00",
      "question": "Two boxes are open on the seven outside directors’ probability sheets. How do you approach those two people?",
      "lead": "On the 1st floor of the bookshop where your scattered colleagues gather, Kwon Dohyun has his calculator out before he even opens his briefcase."
    },
    "c43_advisor": {
      "title": "What the Tail Is Worth",
      "text": "Pyo Serin turns her laptop around. If the board passes the dismissal motion, an extraordinary shareholders’ meeting follows a month later. Many institutional investors decide their votes by her recommendation. 'Recommending a yes on dismissal is easy. Then this company’s governance score goes up. Because they pushed one person out.' She points to the 2023 board materials. 'The director who received the dissent report back then is chairing this vote. This isn’t reform. It’s putting the blame on one subordinate while the people above walk away.' She sets the cursor in the empty conclusion box. 'Give me the grounds, and I’ll write a conditional one: dismissal alone isn’t enough. Just know, when you hand them over, that the recommendation could sink the dismissal.'",
      "memo": [
        "ClearVote draft recommendation -- conclusion box empty",
        "Extraordinary shareholders’ meeting: a month after the board passes it",
        "Director who received the 2023 dissent report = current board chair",
        "Pyo Serin: 'This isn’t reform. It’s cutting off the tail.'"
      ],
      "choices": {
        "c43_advisor_amend": {
          "label": "Draft a named-approver amendment for the outside directors"
        },
        "c43_advisor_voices": {
          "label": "Gather the one-share group’s demands as grounds for the condition"
        },
        "c43_advisor_simple": {
          "label": "Shelve the reform terms and ask for a plain yes on dismissal"
        },
        "reframe": {
          "label": "Ask what the board has used dismissals for"
        },
        "c43_advisor_evidence_turn": {
          "label": "Open the two press releases written before the vote"
        }
      },
      "place": "ClearVote, Yeouido · Meeting Room",
      "clock": "September 4 · Board meeting in D-3",
      "question": "Pyo Serin calls dismissal alone cutting off the tail and offers a conditional recommendation. What do you hand her for it?",
      "lead": "The small office of ClearVote, the proxy adviser. Six months on, you knock on the same door."
    },
    "c43_corridor": {
      "title": "A Bench with No Back",
      "text": "The secretariat accepted only one witness: you. The waiting seat in the hallway outside the 33rd-floor boardroom is a single bench with no back. Yoon Sanghyuk is already sitting at the end of it. As the subject of the motion he cannot vote; he has been allowed 10 minutes to explain himself. He brushes the seat beside him once with his palm. For six months you have been his subordinate. 'I read your reports every week. The longest of any from Risk Management.' He tugs at the end of his sleeve. 'Go in and talk about me, by all means. Just know this before you do. If I had been the only one who said to leave that field empty, do you think no one could have touched me for 3 years?' Board Chair Yeon Taekyung’s low voice leaks through the gap in the door. Yoon Sanghyuk turns his phone over. The lock screen is his daughter Yoon Seojin’s graduation photo. 'Seojin is in the lobby. Not for me. To see you.'",
      "memo": [
        "Board opens 14:00 · witness to be called at 14:40",
        "Yoon Sanghyuk: 10 minutes to explain · excluded from the vote",
        "'If I had been the only one who said to leave that field empty'",
        "Yoon Seojin, waiting in the 1st-floor lobby"
      ],
      "choices": {
        "c43_corridor_ignore": {
          "label": "No time to waver: reread only your prepared remarks"
        },
        "c43_corridor_speak": {
          "label": "Persuade Yoon Sanghyuk to go in and say the name himself"
        },
        "c43_corridor_statement": {
          "label": "Demand he put what he just said in a signed statement"
        },
        "reframe": {
          "label": "Ask what the board has used dismissals for"
        },
        "c43_corridor_evidence_turn": {
          "label": "Open the two press releases written before the vote"
        }
      },
      "place": "KD Financial Group Headquarters, Yeouido · Hallway outside the 33rd-Floor Boardroom",
      "clock": "Monday, September 7 · Board Day · 14:20",
      "question": "At the end of the bench, Yoon Sanghyuk says he was not the only one who said to leave that field empty. What do you do before you go in?",
      "lead": "Called up to the 33rd floor as a witness, you find someone already waiting on the bench outside the boardroom door."
    },
    "c43_final": {
      "title": "The Last Vote",
      "text": "When the witness remarks end, Board Chair Yeon Taekyung puts the motion to a vote. One by one, the seven outside directors tap the secret-ballot box on their tablets, and the tally appears on the secretariat’s screen. Four yes, three no. Under the table, Eun Chaewon’s hand is shaking. Only Chairman Seo Dokyung’s vote remains. The Chairman sets down his pen and turns a page of the draft resolution. A sentence has been added at the bottom. 'With this, the inquiry into responsibility for 2023-0412 is deemed concluded.' The Chairman speaks. 'New York wants this line in the quarterly report. With this line, I vote yes. Without it, this company keeps fighting a fight that never ends, so I vote no.' For the first time, he looks straight at you. 'I’ll ask the witness. Do you push one man out and end it, or go on without pushing anyone out?' The ticking of the wall clock fills the boardroom.",
      "memo": [
        "Outside directors’ 7 votes counted: yes 4 · no 3",
        "Vote left: Chairman Seo Dokyung 1 · 5 votes pass it",
        "Last line of the resolution: 'inquiry into responsibility concluded'",
        "The Chairman’s question: push one out and end it, or go on without pushing anyone out"
      ],
      "choices": {
        "c43_final_names": {
          "label": "Name the people in the lobby and ask to cut the last line"
        },
        "c43_final_amend": {
          "label": "Propose a probe of the 2023 board in place of the last line"
        },
        "c43_final_take": {
          "label": "Accept the vote: dismissal first, even with the last line"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Financial Group Headquarters, Yeouido · 33rd-Floor Boardroom",
      "clock": "September 7 · Board Vote · 15:40",
      "question": "The Chairman will cast the last vote only if the line 'inquiry into responsibility concluded' stays. What do you do?",
      "lead": "Your remarks are done, but the Board Chair has not sent you out. You are to watch the vote to the end."
    },
    "c43_aftershock": {
      "title": "5 to 3",
      "text": "The dismissal motion passes, 5 yes, 3 no. The last line of the resolution, the sentence saying the inquiry into responsibility is over, will be publicly disclosed tonight. When the doors open, 20 representatives of the one-share group are standing in the hallway. Kang Taemin holds a cup-noodle box with 80 names written on it, and Moon Gaeul hands the leftover rice cakes to the security guards. The guard who once raised a radio and lowered it again takes a second one. Yoon Sanghyuk hands his employee ID to his secretary and turns around at the elevator. 'The first-instance sentencing is coming up. That day, I’m the one in the defendant’s seat.' A text arrives from Pyo Serin of ClearVote, the proxy adviser. 'Filled in the conclusion box. Conditional yes, 11 footnotes.' At the end of the hallway, Yoon Seojin watches the elevator numbers until they reach 1.",
      "memo": [
        "Dismissal motion passed -- yes 5 · no 3",
        "Last line of the resolution: to be disclosed tonight",
        "20 representatives of the one-share group, let up to the 33rd-floor hallway",
        "First-instance sentencing near · ClearVote recommends a conditional yes"
      ],
      "choices": {
        "c43_after_rush": {
          "label": "Go from the hallway straight to Seocho-dong for the sentencing"
        },
        "c43_after_warm": {
          "label": "Stay till dawn with the people who held the hallway"
        },
        "c43_after_record": {
          "label": "Write down today’s vote line by line, with the date"
        }
      },
      "place": "KD Financial Group Headquarters, Yeouido · 33rd-Floor Hallway",
      "clock": "September 7 · Right after the Vote · 16:07",
      "question": "The dismissal passed 5 to 3, and the last line is disclosed tonight. How do you close this afternoon with the people in the hallway?"
    },
    "c43_professor": {
      "title": "2 Million Won an Hour",
      "text": "On the door of a corner office on the 5th floor of the business school, a sheet of paper says 'Meetings by email.' Eun Chaewon opens the door anyway; she is the youngest of the seven outside directors. Before you ask anything, she tells you that one board meeting pays 4 million won. 'It’s a two-hour meeting, so that’s 2 million won an hour. That’s why I’m the most scared. What if I take this money and get it wrong?' The agenda brief on her desk is dense with four colors of highlighter, and there are 23 question marks in the margins. She points to the biggest one. 'If you dismiss him, is it over? That’s what I want to know most. If it’s over, I vote yes, and if not...' The rest is lost in the click of a highlighter cap.",
      "memo": [
        "Eun Chaewon: accounting professor · 1st year as an outside director",
        "Board fee 4 million won per meeting · 23 question marks in the brief’s margins",
        "Question: 'If you dismiss him, is it over?'"
      ],
      "choices": {
        "c43_professor_choice_2": {
          "label": "Show her the 2023 board liability that outlasts the dismissal"
        },
        "c43_professor_choice_3": {
          "label": "Say it ends now and lock in her yes first"
        },
        "c43_professor_choice_1": {
          "label": "Say it won’t end, and ask her to meet the one-share group"
        }
      },
      "place": "Business School 5th Floor · Professor Eun Chaewon’s Office",
      "clock": "September 3 · Board meeting in D-4 · 16:00",
      "question": "The youngest outside director asks whether dismissal ends it. How do you answer?"
    },
    "c43_call": {
      "title": "A Company That Runs on Memory",
      "text": "In the taxi after leaving ClearVote, an unknown number rings. 'I’ll put the Chairman on.' The voice of chief of staff Yeo Minkyu passes, and Chairman Seo Dokyung asks without a greeting. 'Do you think it ends when that man leaves?' He goes on before you can answer. 'I think it ends. A company runs not on people but on memory. Push one man out, and the company doesn’t remember him. I call that reform.' The lights of Mapo Bridge pass outside the window. 'On Monday I vote last. However the votes before me go. I hear you’re coming in as a witness. You decide what to say. I decide whether to listen.' Call time 3 minutes 12 seconds; the line goes dead from his end.",
      "memo": [
        "Direct call from Chairman Seo Dokyung · 3 minutes 12 seconds",
        "'A company runs not on people but on memory'",
        "The Chairman votes last"
      ],
      "choices": {
        "c43_call_choice_2": {
          "label": "Log the call with date and time and leave it with Han Seoyun"
        },
        "c43_call_choice_1": {
          "label": "Reply that you’ll bring the names the company will forget"
        },
        "c43_call_choice_3": {
          "label": "Write off the Chairman’s vote and focus on the ones before"
        }
      },
      "place": "In a Taxi · From Yeouido to Mapo Bridge",
      "clock": "September 4 · Board meeting in D-3 · 21:00",
      "question": "The Chairman says the company reforms by forgetting one man. How do you answer that call?"
    },
    "c43_lobby": {
      "title": "Names on a Box Lid",
      "text": "The board meets behind closed doors, so the one-share group can come only as far as the lobby inside the revolving door. Beside the security gate, Kang Taemin sets down cup-noodle boxes for the 80 people on the night shift. Then he starts writing the 80 names on the lid, one line each. A security guard raises a radio, then lowers it. Moon Gaeul holds a box of rice cakes, and Moon Hajun a sketchbook. On its first page, in big letters: 'To the end.' At the end of a lobby sofa, Yoon Seojin sits alone and meets no one’s eyes. Then a text comes from Lee Minseo on the 33rd floor. 'They say the vote is secret. Who voted which way won’t even go in the minutes.'",
      "memo": [
        "About 140 people from the one-share group waiting in the lobby",
        "80 names on the cup-noodle box lid",
        "Board vote: secret ballot · no record of each director’s vote"
      ],
      "choices": {
        "c43_lobby_choice_3": {
          "label": "Let the recording method go and get the result first"
        },
        "c43_lobby_choice_2": {
          "label": "Open your remarks by demanding each director’s vote in the minutes"
        },
        "c43_lobby_choice_1": {
          "label": "Call the lobby and have Yoon Seojin seated with the one-share group"
        }
      },
      "place": "KD Financial Group Headquarters, Yeouido · Lobby",
      "clock": "September 7 · Board Day · 14:30",
      "question": "The vote is secret, and no director’s vote is recorded anywhere. Between the lobby and the 33rd floor, what do you do first?"
    },
    "c43_professor_reaction": {
      "title": "Decided Upstairs",
      "text": "Eun Chaewon puts down her highlighter and opens the window. 'Shall I tell you why I studied accounting?' Her father ran a mold factory in Ansan, and in her 3rd year of high school it went bankrupt. The manager of the bank branch they dealt with came to the house and bowed his head at the front door. 'It was decided upstairs, for me too.' Eun Chaewon smiles. She smiles, but the rims of her eyes are red. 'What I hated most was that he wasn’t a bad person. And no one ever told us who upstairs was.' She presses her palm on the first page of the agenda brief. 'Is upstairs only one person this time too?'",
      "memo": [
        "'It was decided upstairs, for me too'",
        "Is upstairs only one person this time too"
      ],
      "choices": {
        "c43_professor_reaction_choice_1": {
          "label": "Ask her to tell the branch manager’s story at Monday’s board"
        },
        "c43_professor_reaction_choice_2": {
          "label": "Offer to trace that 'upstairs' in the 2023 approval order together"
        },
        "c43_professor_reaction_choice_3": {
          "label": "Call her past irrelevant to the vote and return to the agenda"
        }
      },
      "place": "Business School 5th Floor · By the Window, Professor Eun Chaewon’s Office",
      "clock": "September 3 · Board meeting in D-4 · 16:30",
      "question": "Eun Chaewon still remembers the branch manager who said 'it was decided upstairs.' What do you do with that memory?"
    },
    "c43_call_reaction": {
      "title": "The Name That Wanted Out",
      "text": "Hearing about the call, Han Seoyun stares at the corner of the bookshop counter for a long time. 'I’ll be honest. I was glad to hear what the Chairman said. When one man leaves, the company doesn’t remember. Then I drop out of its memory too.' She folds and unfolds the printout of her standby assignment notice. The same sheet for six months. 'That’s what I’m most ashamed of. So I’m going on Monday too. As the person who returned the dissent in 2023. Put my name on the witness list.' Kang Taemin, dozing on a pile of boxes, sits up and bumps his head on a shelf. No one laughs, and then all three of you laugh at once.",
      "memo": [
        "A name that wanted out of the company’s memory",
        "She will be a witness as the one who returned it"
      ],
      "choices": {
        "c43_call_reaction_choice_2": {
          "label": "Gather the papers from the return first to back her statement"
        },
        "c43_call_reaction_choice_3": {
          "label": "Talk her out of it: exposing Han Seoyun could shake the votes"
        },
        "c43_call_reaction_choice_1": {
          "label": "Say you’ll stand beside Han Seoyun as a board witness"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Counter",
      "clock": "September 4 · 23:00",
      "question": "Han Seoyun, who pressed the return button, says she will stand as a witness too. What do you do?"
    },
    "c43_lobby_reaction": {
      "title": "Someone Who Has Waited",
      "text": "Moon Gaeul carries the rice-cake box to the end of the lobby sofa. Yoon Seojin looks up and recognizes her. Instead of a greeting, Moon Gaeul sets a pack of rice cakes on her lap. 'You’re waiting for your father, aren’t you. I waited for my husband once. In a hospital hallway.' Yoon Seojin holds back tears and takes a bite. 'I know everything my father did. That’s why I’m sitting here. I feel like if I run away, I’ll become just like him.' Moon Gaeul fiddles with the string on the box for a long while, then speaks. 'Go say that to the person who wrote the dissent. It’s probably what that person has wanted to hear most for 3 years.'",
      "memo": [
        "Someone who has waited in a hospital hallway",
        "Afraid that running away would make her just like her father"
      ],
      "choices": {
        "c43_lobby_reaction_choice_2": {
          "label": "Propose taking Yoon Seojin’s words as a family statement"
        },
        "c43_lobby_reaction_choice_1": {
          "label": "Send word through Moon Gaeul: you’ll come down after your remarks"
        },
        "c43_lobby_reaction_choice_3": {
          "label": "Silence your phone to focus on the board for now"
        }
      },
      "place": "KD Financial Group Headquarters, Yeouido · Lobby Sofa",
      "clock": "September 7 · Board Day · 14:45",
      "question": "Yoon Seojin sits in the lobby with something to tell you in her father’s place. What do you do?"
    },
    "c43_branch_witness": {
      "title": "One Line on Page 17",
      "text": "Baek Arin sits by the window of a café outside the court in Seocho-dong. The group’s legal team has sued her for leaking trade secrets. She has just finished the first preparatory hearing. Two months after her whistleblower report, she has sold her car for lawyer’s fees, and her tablet battery is at 9% again today. She puts a document envelope on the table. A copy of the KD Financial Group board report from April 2023. In a corner of page 17 is one line, '1 dissent in the review process -- handled,' and next to it the review e-signature of Yeon Taekyung, an outside director at the time. 'If I take this in on Monday, the legal team will double the claim.' She laughs. 'My mom still has the receipt for that report framed on the wall.'",
      "memo": [
        "April 2023 board report, page 17",
        "'1 dissent -- handled' · review e-signature: Yeon Taekyung",
        "Baek Arin: trade-secret lawsuit · car sold",
        "Four days until the board meeting"
      ],
      "choices": {
        "c43_branch_witness_a": {
          "label": "Share Baek Arin’s legal costs with the one-share group"
        },
        "c43_branch_witness_b": {
          "label": "Have the copy’s source and signature notarized as evidence"
        },
        "c43_branch_witness_c": {
          "label": "Take only the papers and tell Baek Arin to stay away"
        }
      },
      "place": "Café outside the Court, Seocho-dong · By the Window",
      "clock": "September 3 · Board meeting in D-4 · 11:00",
      "question": "The current board chair signed off on 'dissent handled' in 2023. How do you protect the person holding this one sheet?"
    },
    "c43_branch_witness_follow": {
      "title": "The 13:00 Settlement",
      "text": "As the coffee cools, Baek Arin’s phone rings. The group’s legal team. You point at the speaker button, and after a moment’s hesitation she turns it on. 'Ms. Baek, if you sign the settlement by 13:00 on Monday, we’ll drop the suit. One condition: no statements of any kind on this matter for a month before and after the board meeting.' The line goes dead. The board meets at 14:00. Baek Arin folds and unfolds a corner of the envelope with her fingernail. '1 year ago, I’d have written this settlement myself. With smoother sentences, too.' Outside, an early leaf falls from the ginkgo tree in front of the court. She turns her phone over. 'If I sign, the receipt in Mom’s frame becomes just paper. If I don’t, I have to go to the end of this story.'",
      "memo": [
        "Settlement offer: deadline Monday 13:00 · board at 14:00",
        "Condition: no statements for a month before and after the board",
        "In return: the trade-secret suit is dropped",
        "Baek Arin: '1 year ago, I’d have written it myself'"
      ],
      "choices": {
        "c43_branch_witness_follow_a": {
          "label": "Build a legal team to protect Baek Arin’s testimony instead"
        },
        "c43_branch_witness_follow_b": {
          "label": "Report the offer to regulators as whistleblower retaliation"
        },
        "c43_branch_witness_follow_c": {
          "label": "Tell Baek Arin it’s her choice, and signing is all right"
        }
      },
      "place": "Café outside the Court, Seocho-dong · By the Window",
      "clock": "September 3 · Board meeting in D-4 · 11:40",
      "question": "A settlement that drops the suit if she stays silent is open until an hour before the board. What do you tell Baek Arin?"
    },
    "c43_route_system": {
      "title": "486 Items and the Last Line",
      "text": "You do not count votes. You ask what this board has used dismissals for, and NOAH wakes on the KD Capital terminal. 10 years of agenda items scroll up in rows. NOAH has read every set of KD Financial Group board minutes from the past 10 years. Of 486 agenda items, outside directors voted no three times, and none of those three was reappointed the next year. There were two resolutions dismissing executives, and both ended with the same last line. 'The inquiry into related responsibility is deemed concluded.' NOAH adds one line. 'At this board, dismissal has been used not to open a case but to close one. Probability that the same pattern repeats: 0.97.'",
      "memo": [
        "486 board agenda items -- outside director no votes: 3",
        "The three who voted no: none reappointed the next year",
        "2 executive dismissal resolutions -- same last line"
      ],
      "choices": {
        "c43_route_system_line": {
          "label": "Pull out the resolution’s last line and challenge it publicly"
        },
        "c43_route_system_publish": {
          "label": "Send the 10-year minutes data to Eun Chaewon and Pyo Serin"
        },
        "c43_route_system_drop": {
          "label": "Set the statistics aside and focus on the vote count"
        },
        "c43_route_system_evidence_turn": {
          "label": "Open the two press releases written before the vote"
        }
      },
      "place": "KD Capital Headquarters · Risk Management Terminal",
      "clock": "September 1 · Board meeting in D-6",
      "question": "For 10 years, dismissal at this board has been a way to close a case. What do you do with these statistics?"
    },
    "c43_final_system_route": {
      "title": "Two Things in One Ballot",
      "text": "Before dawn on the day before the board, in the dark Risk Management office, NOAH puts the two past dismissal resolutions side by side. Their last lines match word for word. In a third box beside them, it has written only tomorrow’s date. Eight floors up is Yoon Sanghyuk’s CEO office. Under the third box NOAH writes. 'Tomorrow, a yes vote does two things. It pushes one man out, and it closes the rest. A ballot is one sheet, so the two cannot be cast separately. In the two dismissals I have read, no one proposed splitting them.'",
      "memo": [
        "2 executive dismissal resolutions -- identical last line: 'inquiry into responsibility concluded'",
        "Outside director no votes: 3 -- none of the three reappointed",
        "Board meeting: Monday, September 7, 14:00"
      ],
      "choices": {
        "c43_final_system_route_b": {
          "label": "Leave the rules alone and pass this dismissal first"
        },
        "c43_final_system_route_c": {
          "label": "Make outside directors’ no votes and reappointments public yearly"
        },
        "c43_final_system_route_a": {
          "label": "Propose a rule barring closing language in dismissal resolutions"
        }
      },
      "place": "KD Capital Headquarters · Risk Management Terminal",
      "clock": "September 6 · Day before the Board · Before Dawn",
      "question": "One yes ballot pushes one man out and closes the rest. What do you demand in the resolution to split that vote in two?"
    },
    "c43_evidence_turn": {
      "title": "Two Press Releases",
      "text": "Before the vote, a link arrives on your phone. When you filter the folder by the date the clue pointed to, two files open in the group PR office’s shared folder. The sender is a 3rd-year staffer in the PR office, and the email carries no name, only 'I’m sorry.' Both files were created three days before the board meeting. One is 'Dismissal Motion Passes -- KD Financial Group Completes Its Reform,' the other 'Dismissal Motion Fails -- Board Independence Confirmed.' The last paragraphs of the two files do not differ by a single letter. 'With this, the controversy over 2023-0412 has been put to rest.' The last person to edit them was Yeo Minkyu, chief of staff to Chairman Seo Dokyung. Ban Jaewook closes the notebook he was writing in. 'It’s built so the company wins however the vote goes. Whatever the eight of them cast, the end date was already set.'",
      "memo": [
        "2 draft press releases -- created three days before the board",
        "Pass and fail versions, same last paragraph: 'put to rest'",
        "Last edit: chief of staff Yeo Minkyu · source: 3rd-year PR staffer"
      ],
      "choices": {
        "c43_evidence_turn_reveal": {
          "label": "Send both press releases to every outside director before the vote"
        },
        "c43_evidence_turn_hold": {
          "label": "Keep the press releases as a card for after the vote"
        },
        "c43_evidence_turn_protect": {
          "label": "First find a way to protect the PR staffer who sent the files"
        }
      },
      "place": "KD Financial Group Headquarters, Yeouido · End of the 33rd-Floor Hallway",
      "clock": "September 7 · Board Day · Before the Vote",
      "question": "Press releases for both a pass and a fail were written three days ago with the same ending. How do you use these two sheets?"
    },
    "c43_start_warm": {
      "title": "The Nine Who Stayed by the Sea",
      "text": "You took the group photo 12 times and stayed by the sea with your colleagues until the afternoon train. The written opinion for two outside directors, the nine of you passed around and revised on the train to Seoul before sending it. Agenda Item 1 for the KD Financial Group board is inside director Yoon Sanghyuk. A dismissal motion to push him out is up. Eight people vote: Chairman Seo Dokyung and seven outside directors. Na Junhyuk posts a photo in the group chat. It is the notebook page he wrote on the night at the breakwater, when each of you said what had kept you from stopping. 'Let’s get through this week on this. Even I can’t read my handwriting.' Under it, Han Seoyun adds a line. '2023 isn’t in the brief. The only one willing to testify about it is Baek Arin.'",
      "memo": [
        "One page of Na Junhyuk’s notebook: seven answers from the breakwater",
        "Written opinion sent: 7 minutes to midnight · 2 outside directors",
        "7 days until the board -- 8 voters"
      ],
      "choices": {
        "c43_start_warm_signature": {
          "label": "Take the Gyeongpo notebook page and split the votes among the nine"
        },
        "c43_start_warm_count": {
          "label": "Count the seven outside directors’ votes first, fast"
        },
        "c43_start_warm_arin": {
          "label": "Find Baek Arin first and organize her testimony together"
        },
        "c43_start_warm_charter": {
          "label": "Go through the board rules and agenda brief clause by clause"
        },
        "c43_start_warm_reframe": {
          "label": "Ask what the board has used dismissals for"
        }
      },
      "place": "KD Capital Headquarters · Risk Management Department",
      "clock": "Monday, August 31 · Board meeting in D-7",
      "question": "They want to get through this week on the answers written down at the breakwater. How do you divide the nine?",
      "lead": "The group chat of the people who stayed by the sea to the end has not gone quiet since Seoul."
    },
    "c43_start_record": {
      "title": "A Brief with One Name",
      "text": "On the train back, you put the answers from below the breakwater and the 47 addresses into one file and attached it to the written opinion. Agenda Item 1 for the KD Financial Group board is inside director Yoon Sanghyuk. A dismissal motion to push him out is up. Ban Jaewook prints the agenda brief and sets it beside your file. The brief is two pages; the reason for dismissal is one line, 'damage to group trust from a matter under trial,' and the last line is 'related risk assets cleared.' Those who vote are Chairman Seo Dokyung and seven outside directors. 'Your file has 20 names, and this brief has only one. Where did the names that sat on the 2023 board go? The only one willing to testify to those names is Baek Arin.'",
      "memo": [
        "File written on the train: 20 names · 47 addresses",
        "Agenda brief, 2 pages -- names in it: 1",
        "7 days until the board -- 8 voters"
      ],
      "choices": {
        "c43_start_record_signature": {
          "label": "Formally ask that the 2023 board be added to the brief"
        },
        "c43_start_record_charter": {
          "label": "Go through the board rules and agenda brief clause by clause"
        },
        "c43_start_record_arin": {
          "label": "Find Baek Arin first and organize her testimony together"
        },
        "c43_start_record_count": {
          "label": "Count the seven outside directors’ votes first, fast"
        },
        "c43_start_record_reframe": {
          "label": "Ask what the board has used dismissals for"
        }
      },
      "place": "KD Capital Headquarters · Risk Management Department",
      "clock": "Monday, August 31 · Board meeting in D-7",
      "question": "Your file has twenty names; the agenda brief has one. How do you get the missing names back?",
      "lead": "The file you finished around Wonju is still open in the middle of your desktop."
    },
    "c43_start_rush": {
      "title": "The Gap the One in a Hurry Left",
      "text": "Hearing about the dismissal motion before dawn, you left Gyeongpo on the first train, before the group photo. Your colleagues took the photo with your spot left empty, and the last line of the guestbook still reads 'the one in a hurry,' written for you by the guesthouse owner, Yeo Dain. On Monday, a notice comes up on the monitors in KD Capital’s Risk Management Department. KD Financial Group board, September 7, Agenda Item 1: inside director Yoon Sanghyuk. Kwon Dohyun has already printed a vote table. 'The Chairman, one vote; outside directors, seven. Three certain yes, two likely no, two unknown.' He stops his pen. 'The math is done, but one box is empty. Baek Arin. She must have texted you over 20 times in Gyeongpo, and there’s no record of a reply, is there?'",
      "memo": [
        "Group photo: only your spot empty · guestbook: 'the one in a hurry'",
        "Kwon Dohyun’s table: yes 3 · likely no 2 · undecided 2 · Chairman 1",
        "Baek Arin’s texts: 23 -- replies: 0"
      ],
      "choices": {
        "c43_start_rush_charter": {
          "label": "Go through the board rules and agenda brief clause by clause"
        },
        "c43_start_rush_signature": {
          "label": "Answer Baek Arin’s 23 texts and call your colleagues"
        },
        "c43_start_rush_count": {
          "label": "Count the seven outside directors’ votes first, fast"
        },
        "c43_start_rush_arin": {
          "label": "Find Baek Arin first and organize her testimony together"
        },
        "c43_start_rush_reframe": {
          "label": "Ask what the board has used dismissals for"
        }
      },
      "place": "KD Capital Headquarters · Risk Management Department",
      "clock": "Monday, August 31 · Board meeting in D-7",
      "question": "While you rushed ahead, the photo kept your spot empty and the guestbook kept 'the one in a hurry.' What do you fill first?",
      "lead": "After the weekend you came up early on the first train, Kwon Dohyun’s printout is already waiting on your desk on Monday."
    }
  },
  "echoReplies": {
    "c43_start_arin": "You go to her, and two days pass among Baek Arin’s lawsuit papers. The one sheet to take to the board, she says, can come out only after Thursday’s court date.",
    "c43_start_charter": "You question the rules, and the single-line reason for dismissal becomes a formal question. The secretariat answers, 'no problem under the rules.'",
    "c43_start_count": "The count is fast. Inside it, Han Seoyun’s 2023 fits in no variable box.",
    "c43_ledger_visit": "Eun Chaewon’s reply is short. Thursday, four in the afternoon, her office. A text from Baek Arin asking to meet outside the court that same morning has already arrived. You now have one more story to bring.",
    "c43_ledger_conflict": "You raise it, and one of the two outside directors offers to recuse from the vote, then takes it back the next day. The other calls a lawyer.",
    "c43_ledger_target": "The two agree to meet you. The probability table was right that far, and in that table no one was ever called by name.",
    "c43_advisor_voices": "Overnight, 140 demands come in. Pyo Serin footnotes only the 11 that come with dates and documents.",
    "c43_advisor_amend": "The amendment lands in seven inboxes. Four open it, and only Eun Chaewon replies.",
    "c43_advisor_simple": "Pyo Serin closes her laptop. 'I told you I don’t take requests.' The recommendation goes out conditional, as it was. Only your request stays on the record.",
    "c43_corridor_speak": "Yoon Sanghyuk laughs for a long time. 'So the day comes when you tell me to go in.' He stands, but whether he says that name, he decides inside the door.",
    "c43_corridor_statement": "At the mention of a statement, Yoon Sanghyuk takes out a pen. The pen stops at the signature field, and he hands over the sheet with that field left empty.",
    "c43_corridor_ignore": "Your script does not waver. You never learn what else the man at the end of the bench meant to say.",
    "c43_final_names": "As the names are read, Eun Chaewon lifts her head. The Chairman hears every one of them, then picks up his pen again.",
    "c43_final_amend": "When the amendment comes up, Board Chair Yeon Taekyung calls a recess. The resolution that comes back 20 minutes later says 'review' instead of 'investigation.'",
    "c43_final_take": "The dismissal happens today. The last line passes with it, and the 2023 board goes quiet beneath that line.",
    "c43_after_warm": "You go down with the people from the hallway to a tent bar outside the company and part at two in the morning. The disclosure goes up in the meantime, and no one is the first to look at a phone.",
    "c43_after_record": "Opening time, the 20-minute recess, the order of the vote, down to the wording of the last line: it all goes down line by line. A few days later, one date in that record overlaps with the date on another document.",
    "c43_after_rush": "You reach the civil petitions office at the Seocho-dong court 5 minutes before closing. The rice-cake boxes empty without you, and the 20 in the hallway ask in the group chat where you went.",
    "c43_professor_choice_1": "You ask, and Eun Chaewon checks her calendar. Saturday morning, Mangwon Market. She spends an hour on 'may a director meet an interested party?' and then comes.",
    "c43_professor_choice_2": "With the documents in front of her, Eun Chaewon’s question marks go from 23 to 30. What shrinks is her certainty.",
    "c43_professor_choice_3": "Eun Chaewon nods and strikes through one question mark. That what you said is not true stays under that line.",
    "c43_call_choice_1": "Your reply shows only as read. In the boardroom on Monday, the Chairman says the first name on the list himself. Before you do.",
    "c43_call_choice_2": "The record is exact. Han Seoyun puts the sheet in the same envelope as her standby assignment notice.",
    "c43_call_choice_3": "While you count the seven votes before it, the Chairman’s one vote goes untouched all the way to Monday.",
    "c43_lobby_choice_1": "Do Yoonha offers Yoon Seojin a seat. She sits one seat apart, but she does not get up.",
    "c43_lobby_choice_2": "The demand stays on the first line of the record of remarks. Board Chair Yeon Taekyung answers 'we will review it,' and that too stays on the record.",
    "c43_lobby_choice_3": "The result comes quickly. Who voted which way, only the eight know.",
    "c43_professor_reaction_choice_1": "Eun Chaewon looks out the window for a long time. 'If it’s 4 million won for two hours, there’s time for that story.'",
    "c43_professor_reaction_choice_2": "Following the approval order brings you to page 17 of the April 2023 board report. Eun Chaewon marks that page number in her fifth highlighter color.",
    "c43_professor_reaction_choice_3": "Eun Chaewon closes the window. Not one question mark in the brief’s margins has gone.",
    "c43_call_reaction_choice_1": "When you say you’ll stand beside her, Han Seoyun puts the notice in an envelope. Whether one more name goes on the witness list, the secretariat decides on Monday morning.",
    "c43_call_reaction_choice_2": "With documents attached, Han Seoyun’s statement becomes evidence, not a confession. Her name stays in the evidence too.",
    "c43_call_reaction_choice_3": "Han Seoyun says 'all right' and folds the notice again. The crease turns a little whiter.",
    "c43_lobby_reaction_choice_1": "Hearing it, Yoon Seojin puts the rice-cake pack in her bag and stays put. A promise begins to wait in the lobby.",
    "c43_lobby_reaction_choice_2": "At the word statement, Yoon Seojin’s face stiffens. She signs, but holds back what she was going to say next.",
    "c43_lobby_reaction_choice_3": "On your silenced phone, three messages from Moon Gaeul pile up. The last is a photo of rice cakes.",
    "c43_branch_witness_a": "A fundraising notice goes up in the one-share group chat, and the first to send money is Moon Gaeul. 30,000 won, her rice-cake money.",
    "c43_branch_witness_b": "Once notarized, the copy becomes evidence. Baek Arin’s name goes on the first line of the evidence list with it.",
    "c43_branch_witness_c": "Baek Arin hands over the envelope and looks out the window. 'So I’m to stay in the back again.' The documents go into your bag.",
    "c43_branch_witness_follow_a": "Three lawyers join for free. One of them has handled the lawsuit of Moon Gaeul’s group. The claim still doubles.",
    "c43_branch_witness_follow_b": "The report gets a filing number. The settlement deadline comes sooner than that number does.",
    "c43_branch_witness_follow_c": "Told it is all right, Baek Arin laughs for a long while. Then she puts the settlement in her bag. Even after 13:00 on Monday, the signature field on that sheet is still empty.",
    "c43_route_system_publish": "The statistics go into the margins of Eun Chaewon’s brief and into Pyo Serin’s footnotes. The names of the three who voted no go in with them.",
    "c43_route_system_line": "Once the question is public, the secretariat calls the line 'customary wording.' For the first time, the word customary becomes a headline.",
    "c43_route_system_drop": "The votes get counted a little more precisely. That last line gets ready to sit in the same place again this year.",
    "c43_final_system_route_a": "With the rule in place, from the next dismissal on, a resolution cannot say it is over. This resolution falls outside that rule.",
    "c43_final_system_route_b": "The dismissal passes. The rule waits for the next board, and meanwhile the last line keeps its current shape.",
    "c43_final_system_route_c": "Once disclosure starts, anyone can see what happens the next year to those who vote no. Whoever might vote no this year sees it first.",
    "c43_evidence_turn_reveal": "Of the seven who get the files, two step out of the boardroom to make calls. The vote is delayed 30 minutes, and an email from the PR office hunting for the source goes around.",
    "c43_evidence_turn_protect": "The staffer is safe. Instead, the two press releases stay in your bag until the board meeting ends.",
    "c43_evidence_turn_hold": "The card stays in your hand. Today the eight fold their ballots believing they decide the outcome.",
    "c43_ledger_evidence_turn": "Spread them on one desk, and on board day you will know. Whether the vote decided the outcome, or the outcome waited for the vote.",
    "c43_advisor_evidence_turn": "Spread them on one desk, and on board day you will know. Whether the vote decided the outcome, or the outcome waited for the vote.",
    "c43_corridor_evidence_turn": "Spread them on one desk, and on board day you will know. Whether the vote decided the outcome, or the outcome waited for the vote.",
    "c43_route_system_evidence_turn": "Spread them on one desk, and on board day you will know. Whether the vote decided the outcome, or the outcome waited for the vote.",
    "case43_memory_system": "The brief does not follow your play. There is not one line about 2023 either. NOAH opens 10 years of meeting records to find the missing line.",
    "case43_memory_evidence": "Lay the dates over each other, and the answer comes on board day. The tally sheet and the press releases were both written before the result. The folder holds two files.",
    "c43_start_warm_arin": "You go to her, and two days pass among Baek Arin’s lawsuit papers. The one sheet to take to the board, she says, can come out only after Thursday’s court date.",
    "c43_start_warm_charter": "You question the rules, and the single-line reason for dismissal becomes a formal question. The secretariat answers, 'no problem under the rules.'",
    "c43_start_warm_count": "The count is fast. Inside it, Han Seoyun’s 2023 fits in no variable box.",
    "c43_start_warm_signature": "Divided up, nearly one person takes each outside director. Na Junhyuk picks the oldest director, saying 'we’re of an age to talk.'",
    "c43_start_record_arin": "You go to her, and two days pass among Baek Arin’s lawsuit papers. The one sheet to take to the board, she says, can come out only after Thursday’s court date.",
    "c43_start_record_charter": "You question the rules, and the single-line reason for dismissal becomes a formal question. The secretariat answers, 'no problem under the rules.'",
    "c43_start_record_count": "The count is fast. Inside it, Han Seoyun’s 2023 fits in no variable box.",
    "c43_start_record_signature": "The question is filed. The secretariat’s answer is 'not directly related to the agenda,' dated the day after the board meeting.",
    "c43_start_rush_arin": "You go to her, and two days pass among Baek Arin’s lawsuit papers. The one sheet to take to the board, she says, can come out only after Thursday’s court date.",
    "c43_start_rush_charter": "You question the rules, and the single-line reason for dismissal becomes a formal question. The secretariat answers, 'no problem under the rules.'",
    "c43_start_rush_count": "The count is fast. Inside it, Han Seoyun’s 2023 fits in no variable box.",
    "c43_start_rush_signature": "Baek Arin’s answer is one line. 'Late, but it’s okay.' Oh Jinwoo, who picks up the next call, says, 'We can retake the photo. Please don’t go ahead this time.'"
  },
  "choiceVoiceLines": {
    "c43_start_arin": "Saying the witness comes first, you find Baek Arin and organize the documents together.",
    "c43_start_charter": "Saying you need to know what is on paper before the votes, you go through the board rules and agenda brief clause by clause.",
    "c43_start_count": "With seven of the eight votes in outside directors’ hands, you quickly count the seven outside directors’ votes first.",
    "c43_ledger_visit": "Saying 0.48 is a person, not a number, you visit Eun Chaewon, the youngest outside director, and pass on the victims’ stories.",
    "c43_ledger_conflict": "Saying former Haeon Partners advisers should not be casting this vote, you formally raise the two likely noes’ advisory history as a conflict of interest.",
    "c43_ledger_target": "With no time left to meet all seven, you work only the two the probability table says will become votes.",
    "c43_advisor_voices": "Saying it has to be the people affected who call it not enough, you gather the one-share group’s demands as grounds for the conditional recommendation.",
    "c43_advisor_amend": "Saying it takes a safeguard so the people above can never slip out again, you draft an amendment naming every approver and send it to the outside directors.",
    "c43_advisor_simple": "Hearing that conditions could sink the dismissal, you shelve the reform terms and ask only for a yes recommendation on dismissal.",
    "c43_corridor_speak": "Saying the name carries weight only from his own mouth, you persuade Yoon Sanghyuk to go in and say that person’s name himself.",
    "c43_corridor_statement": "Saying what is said on a bench vanishes on the bench, you demand that he put what he just said in a signed statement.",
    "c43_corridor_ignore": "With 20 minutes until you are called and no time to be shaken, you reread only your prepared remarks.",
    "c43_final_names": "Saying whether it is over is for the people waiting to decide, you name the people in the lobby and plead for the last line to be cut.",
    "c43_final_amend": "Saying the closing line can become an opening one, you propose putting an investigation of the 2023 board’s responsibility into the resolution in place of the last line.",
    "c43_final_take": "Unable to walk away with no one pushed out, you accept the vote: today the dismissal comes first, even with the last line attached.",
    "c43_after_warm": "For the people who came up from the lobby to the 33rd floor, you stay till dawn beside those who held the hallway.",
    "c43_after_record": "Before the last line gets tidied away overnight, you write down today’s vote line by line and keep it on record with the date.",
    "c43_after_rush": "Saying next comes the day he sits in the defendant’s seat, you go from the hallway straight to Seocho-dong for the sentencing.",
    "c43_professor_choice_1": "Saying one look at their faces shows it is not over, you ask her to meet the one-share group in person.",
    "c43_professor_choice_2": "Saying whether it ends must be answered with numbers, you show her with documents the 2023 board’s responsibility that remains after the dismissal.",
    "c43_professor_choice_3": "Holding on to her yes if it ends, you tell her it ends now and lock in her vote first.",
    "c43_call_choice_1": "Against the idea that pushing one man out means forgetting, you reply that you will bring the names of the people the company will forget.",
    "c43_call_choice_2": "Saying the Chairman may decide whether to listen but the writing is yours, you log the call down to the date and time and leave it with Han Seoyun.",
    "c43_call_choice_3": "Reckoning that a man who votes last has already decided, you write off the Chairman’s vote and focus on the ones before it.",
    "c43_lobby_choice_1": "Not wanting to leave her alone at the end of the sofa, you call the lobby and ask them to seat Yoon Seojin with the one-share group.",
    "c43_lobby_choice_2": "Saying a nameless vote carries no responsibility, you open your remarks by demanding that each director’s vote go in the minutes.",
    "c43_lobby_choice_3": "Saying five votes are enough whoever casts them, you let the recording method go and get the result first.",
    "c43_professor_reaction_choice_1": "So the directors hear how a decision from upstairs ends at a front door, you ask her to tell the branch manager’s story herself at Monday’s board.",
    "c43_professor_reaction_choice_2": "So that this time it does not end with no one telling, you offer to search the 2023 approval order together for who that 'upstairs' was.",
    "c43_professor_reaction_choice_3": "Saying a vote swayed by her father’s story will waver later, you set her past apart from the vote and return to the agenda.",
    "c43_call_reaction_choice_1": "Saying the one who returned it cannot be left to stand alone, you say you will stand beside Han Seoyun as a board witness.",
    "c43_call_reaction_choice_2": "Saying a confession in words alone hurts only her, you first gather the documents from the time of the return to back her statement.",
    "c43_call_reaction_choice_3": "With every vote precious, you talk her out of it this time: if Han Seoyun is exposed too, the votes could shake.",
    "c43_lobby_reaction_choice_1": "Not wanting to miss the words you have waited 3 years to hear, you send word through Moon Gaeul that you will come down as soon as your remarks end.",
    "c43_lobby_reaction_choice_2": "Saying a daughter’s words that she knows everything are worth keeping, you propose taking Yoon Seojin’s words as a family statement.",
    "c43_lobby_reaction_choice_3": "With your call moments away, you say you will focus on the board for now and silence your phone.",
    "c43_branch_witness_a": "Unable to ask someone who sold her car for testimony first, you share Baek Arin’s legal costs with the one-share group first.",
    "c43_branch_witness_b": "Saying the legal team can shake a single copy, you have its source and signature notarized to lock it in as evidence.",
    "c43_branch_witness_c": "Unwilling to let the claim double, you take only the documents and tell Baek Arin not to come to the board.",
    "c43_branch_witness_follow_a": "So she does not walk the road to the end alone, you build a legal team from the one-share group to protect Baek Arin’s testimony instead of the settlement.",
    "c43_branch_witness_follow_b": "Saying a deadline one hour before the board means to shut her up, you report the offer itself to regulators as retaliation against a whistleblower.",
    "c43_branch_witness_follow_c": "Saying you have no right to tell her to go to the end, you tell her signing is Baek Arin’s choice and that it is all right.",
    "c43_route_system_publish": "So those who decide the votes decide knowing this pattern, you send the 10 years of minutes statistics to Eun Chaewon and Pyo Serin at once.",
    "c43_route_system_line": "Before a third resolution closes with the same line, you pull out only the resolution’s last line and challenge it publicly.",
    "c43_route_system_drop": "Saying the past 10 years will not make five votes, you set the statistics aside and focus on the vote count.",
    "c43_final_system_route_a": "So that one ballot cannot do two things, you propose a board rule barring closing language in dismissal resolutions.",
    "c43_final_system_route_b": "Unwilling to lose even the dismissal by trying to split the two, you leave the rules alone and pass this dismissal first.",
    "c43_final_system_route_c": "So those who vote no do not quietly drop away, you have outside directors’ no votes and later reappointments disclosed every year.",
    "c43_evidence_turn_reveal": "So they vote knowing the ending was set in advance, you send both press releases to every outside director before the vote.",
    "c43_evidence_turn_protect": "Saying the one who sent them without even a name comes first, you look for a way to protect the PR staffer who sent the files.",
    "c43_evidence_turn_hold": "Saying the matching endings will stand out more once the result is in, you keep the press releases as a card for after the vote.",
    "c43_ledger_evidence_turn": "You spread the clue on one desk with the board’s agenda brief and show where the vote’s result was written first.",
    "c43_advisor_evidence_turn": "You spread the clue on one desk with the board’s agenda brief and show where the vote’s result was written first.",
    "c43_corridor_evidence_turn": "You spread the clue on one desk with the board’s agenda brief and show where the vote’s result was written first.",
    "c43_route_system_evidence_turn": "You spread the clue on one desk with the board’s agenda brief and show where the vote’s result was written first.",
    "c43_start_warm_arin": "Saying the witness comes first, you find Baek Arin and organize the documents together.",
    "c43_start_warm_charter": "Saying you need to know what is on paper before the votes, you go through the board rules and agenda brief clause by clause.",
    "c43_start_warm_count": "With seven of the eight votes in outside directors’ hands, you quickly count the seven outside directors’ votes first.",
    "c43_start_warm_signature": "Deciding to get through this week on the answers from the breakwater, you take the Gyeongpo notebook page and split the votes among the nine.",
    "c43_start_record_arin": "Saying the witness comes first, you find Baek Arin and organize the documents together.",
    "c43_start_record_charter": "Saying you need to know what is on paper before the votes, you go through the board rules and agenda brief clause by clause.",
    "c43_start_record_count": "With seven of the eight votes in outside directors’ hands, you quickly count the seven outside directors’ votes first.",
    "c43_start_record_signature": "Unwilling to leave a brief with only one name as it is, you formally ask that the 2023 board be added to the agenda brief.",
    "c43_start_rush_arin": "Saying the witness comes first, you find Baek Arin and organize the documents together.",
    "c43_start_rush_charter": "Saying you need to know what is on paper before the votes, you go through the board rules and agenda brief clause by clause.",
    "c43_start_rush_count": "With seven of the eight votes in outside directors’ hands, you quickly count the seven outside directors’ votes first.",
    "c43_start_rush_signature": "To fill the gap you left by leaving first, you answer Baek Arin’s 23 texts and call your colleagues."
  },
  "pack": {
    "clue": {
      "title": "Two Press Releases",
      "text": "Three days before the board meeting, the PR office had written both a pass version and a fail version of the press release. Both ended with 'the controversy over 2023-0412 has been put to rest,' and the last to edit them was Yeo Minkyu, the Chairman’s chief of staff."
    },
    "outcomes": {
      "c43_after_warm": {
        "tag": "Stayed Beside Them",
        "title": "You stayed till dawn with the people who held the hallway",
        "text": "The dismissal passed 5 to 3. You stayed till dawn with the one-share group, who came up to the 33rd-floor hallway and waited, and with Yoon Seojin, who had watched her father."
      },
      "c43_after_record": {
        "tag": "Left on Record",
        "title": "The day of the vote was kept line by line, with the date",
        "text": "From the opening to the wording of the last line, you wrote down today’s vote line by line. When, and from whose hand, the sentence 'inquiry into responsibility concluded' came is now on record."
      },
      "c43_after_rush": {
        "tag": "Ran Ahead",
        "title": "From the hallway where the dismissal passed, you went straight to court",
        "text": "You left the rice-cake boxes and the 20 in the hallway and headed for Seocho-dong. The few days left until the first-instance sentencing began on a chair in the court’s civil petitions office."
      }
    },
    "continuityChallenges": {
      "c42_after_warm": {
        "title": "Going On with Those Who Watched the Fireworks",
        "text": "The nine who stayed by the Gyeongpo sea to the end want to get through this week together. Putting many names together before the eight votes deepens trust."
      },
      "c42_after_record": {
        "title": "Rewriting 20 Names in the Board’s Language",
        "text": "Your file has 20 names; the agenda brief has one. What one man’s dismissal erases, you press with a card that reframes the table."
      },
      "c42_after_rush": {
        "title": "Explaining the Empty Seat from the First Train",
        "text": "While you rushed ahead, your spot in the photo stayed empty, and Baek Arin’s texts wait for an answer. Only if you account fully for why you left first can you face fairness with a clear conscience."
      }
    }
  }
};
