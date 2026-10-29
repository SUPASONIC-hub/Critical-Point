/**
 * 사건 18 (src/nodes/case18.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c18_start": {
      "title": "Double the Salary",
      "text": "The moment he arrives, Oh Jinwoo puts a white envelope on your desk. A job offer from Bridge Bank’s strategy division. The post: acquisitions team head. A team head at thirty-four would be the youngest at that bank, and the salary is double what he makes now. The team’s job is one line. Buy the bundle of bad loans KD Bank is putting up at year end, 186 billion won of them, at 19% of principal. Lining his pen up with the monitor, Oh Jinwoo says, 'Buy this bundle and I get to see every KD loan file. Even the files of the people who pushed my father out.' He pauses. 'I haven’t told anyone yet. You’re the first. I can calculate which side wins. Which side is right, I don’t know.'",
      "memo": [
        "Bridge Bank acquisitions team head offer -- double salary, youngest ever",
        "Job: buy a 186 billion won bundle of KD Bank bad loans",
        "Price offered: 19% of principal",
        "KD’s side: dumping bad loans before the New York shareholder’s year-end dividend",
        "Reply due: December 29, 09:00"
      ],
      "choices": {
        "c18_start_listen": {
          "label": "Set the envelope aside and hear Oh Jinwoo out first"
        },
        "c18_start_terms": {
          "label": "Check the offer’s terms and the sale bundle line by line"
        },
        "c18_start_knife": {
          "label": "Work out first whether this post could be a blade against KD"
        },
        "reframe": {
          "label": "Ask to open the offer’s attachments first"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "December 22 · Reply due D-7",
      "question": "Oh Jinwoo shows you first an envelope holding double his salary and a blade to cut KD. What do you do first?",
      "lead": "The morning of December 22, someone has stacked a tower of instant noodle cups in the Trigger Lab 4th-floor pantry instead of a Christmas tree."
    },
    "c18_lounge": {
      "title": "The One Who Reads People",
      "text": "The 32nd-floor lounge at Bridge Bank’s head office. Straight ahead, through the glass, is KD Financial Group headquarters. Do Haram, head of the strategy division, brings three coffees herself. One is for Kwon Dohyun, who stays standing by the window and does not take it. Do Haram speaks the moment she sits. 'I didn’t pick Mr. Oh because he’s fast. It’s because he can’t stand losing. People like that go all the way.' She turns her tablet around. 48 hours of acquisition due diligence access, all 1,214 KD loan files open. 'I’ll give you the blade. Where to cut is the team head’s call.' Then she looks at you. 'Analyst, did you come to hold him back, or to see him off?' Kwon Dohyun says, eyes still on the window, 'At 19%, KD takes a loss and we turn a profit. The debtor box… no one has filled it yet.'",
      "memo": [
        "Do Haram: Bridge Bank strategy division head, Kwon Dohyun’s boss",
        "48 hours of due diligence access -- 1,214 KD loan files",
        "Buying at 19%: Bridge’s expected return 2.1 times",
        "The plan’s 'debtor handling plan' box: said to be empty"
      ],
      "choices": {
        "c18_lounge_paper": {
          "label": "Ask for the basis of the price in writing"
        },
        "c18_lounge_blade": {
          "label": "Weigh first where that blade could cut KD"
        },
        "c18_lounge_ask": {
          "label": "Ask who Oh Jinwoo would protect there, before the salary"
        },
        "reframe": {
          "label": "Ask to open the offer’s attachments first"
        },
        "c18_lounge_evidence_turn": {
          "label": "Leaf through the side agreement to the draft sale contract"
        }
      },
      "place": "Bridge Bank head office, Yeouido · 32nd-floor lounge meeting room",
      "clock": "December 22 · Afternoon · Reply due D-7",
      "question": "Do Haram holds out a blade to Oh Jinwoo and asks whether you came to hold him back or see him off. How do you answer?",
      "lead": "Not wanting to go alone, Oh Jinwoo has brought you up to the 32nd floor of Bridge Bank’s head office. KD headquarters stands straight ahead outside the window."
    },
    "c18_party": {
      "title": "Secret Santa",
      "text": "The year-end party in the Trigger Lab pantry. Kang Taemin has stacked 40 cups of noodles into a tree, and Lee Minseo folded the star on top out of foil. At the Secret Santa reveal, Na Junhyuk holds out to Kwon Dohyun a box he carried up from Yeongdong on a dawn bus. Rice cakes shaped like a calculator, made to order at Gaeul Rice Cake Shop. Every button is studded with sesame, and on the '=' key, red bean spells 'profit'. Kwon Dohyun stares at it a long time. 'Eat this and it’s a loss. I can’t eat it.' While everyone laughs, Do Yoonha finds Oh Jinwoo in the emergency stairwell. The note on his phone is titled 'Farewell speech'; this is his fifth solo rehearsal. 'Thank you for all… no, the people I should thank… no.' Do Yoonha stands holding the door. Oh Jinwoo lowers his phone. 'I haven’t decided. It’s just, in case.'",
      "memo": [
        "Secret Santa reveal: Na Junhyuk → Kwon Dohyun, calculator-shaped rice cakes",
        "Noodle-cup tree of 40 -- Kang Taemin",
        "Oh Jinwoo’s note 'Farewell speech' -- 5 rehearsals, every one stopped at the first sentence",
        "Six days to the reply deadline"
      ],
      "choices": {
        "c18_party_share": {
          "label": "Show the whole team the sale plan and decide together"
        },
        "c18_party_wait": {
          "label": "Keep the party going until Oh Jinwoo speaks on his own"
        },
        "c18_party_push": {
          "label": "Press Oh Jinwoo to decide before tonight is over"
        },
        "reframe": {
          "label": "Ask to open the offer’s attachments first"
        },
        "c18_party_evidence_turn": {
          "label": "Leaf through the side agreement to the draft sale contract"
        }
      },
      "place": "Trigger Lab, 4th floor · Pantry year-end party",
      "clock": "December 23 · 19:30",
      "question": "In the middle of the party, Oh Jinwoo was rehearsing a farewell speech alone for the fifth time. What do you do?",
      "lead": "The evening of December 23, fairy lights hang in the Trigger Lab pantry. Do Yoonha has been planning the party for 3 weeks."
    },
    "c18_table": {
      "title": "The Winning Side",
      "text": "The dining table at Oh Sangchul’s home in Suwon. His wife is frying a third plate of rolled omelet, and a Christmas carol special plays silently on the living-room TV. When Oh Jinwoo brings up the offer, Oh Sangchul puts down his chopsticks. Even when told the sale bundle includes old Maetan Branch customers, he says nothing for a while. Then he speaks. 'Go. Stand on the winning side.' Oh Jinwoo’s face sets. 'You held it off a day, Dad. You said that was right.' Oh Sangchul takes a spoonful of cold soup. 'It was right. And so I became a man who can’t even visit customers of 30 years on the holidays. When the right man loses, the people on his side lose with him.' His mother quietly slides the omelet plate toward her son. No one touches it.",
      "memo": [
        "64 old Maetan Branch customers in the sale bundle",
        "Oh Sangchul: cut contact with old customers after he was replaced as branch manager",
        "Mother: third plate of rolled omelet",
        "Five days to the reply deadline"
      ],
      "choices": {
        "c18_table_stay": {
          "label": "Stay at the table and help them talk it through"
        },
        "c18_table_list": {
          "label": "Go over the old customers in the bundle with Oh Sangchul"
        },
        "c18_table_win": {
          "label": "Urge Oh Jinwoo to take the advice to stand on the winning side"
        },
        "reframe": {
          "label": "Ask to open the offer’s attachments first"
        },
        "c18_table_evidence_turn": {
          "label": "Leaf through the side agreement to the draft sale contract"
        }
      },
      "place": "Oh Sangchul’s home, Suwon · Dining table",
      "clock": "December 24 · Christmas Eve 19:00",
      "question": "A father who was right tells his son to stand on the winning side. What do you do at this table?",
      "lead": "On Christmas Eve, saying 'If I go alone we’ll just fight again', Oh Jinwoo has sat you down at his parents’ table in Suwon."
    },
    "c18_final": {
      "title": "8:21",
      "text": "No one called anyone, yet everyone is on the Trigger Lab 4th floor. Kang Taemin came straight off the night shift in his vest, and Na Junhyuk took the first bus from Yeongdong. Oh Jinwoo lays out on the desk the offer, a stack of business cards bound with a rubber band, and Kwon Dohyun’s profit-and-loss sheet. The 612 in Appendix 3, the 31 at Sodam Chanbang, and the blade Do Haram handed him. 'If I go, I can change the price and terms from inside. If I don’t, the next team head buys this bundle without even knowing where Maetan Branch is.' He looks at you. 'You asked me once whether I was fast or was made fast. This time I want to decide myself. But I want to hear from you first.' The wall clock turns to 8:21.",
      "memo": [
        "Signing: 09:00 today, Bridge Bank 32nd floor",
        "Sale bundle 186 billion won · 612 slated for job cuts",
        "Kwon Dohyun’s review opinion: price box still empty"
      ],
      "choices": {
        "c18_final_block": {
          "label": "Don’t wait for Oh Jinwoo; go block the sale itself"
        },
        "c18_final_keep": {
          "label": "Hold Oh Jinwoo back: Trigger Lab is where he belongs"
        },
        "c18_final_terms": {
          "label": "Let him go on protection terms and a promise to fight together"
        },
        "reframe": {
          "label": "Reframe the table and propose, one last time"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "December 29 · 08:21 · 39 minutes to signing",
      "question": "39 minutes before signing, Oh Jinwoo wants to hear from you before he decides. What do you say?",
      "lead": "On the morning of the signing, Oh Jinwoo stops by the Trigger Lab 4th floor before heading to Bridge Bank."
    },
    "c18_aftershock": {
      "title": "The Sixth Farewell Speech",
      "text": "The evening of December 31, the pantry tree Kang Taemin stacked out of noodle cups for the party has shrunk by about half. Oh Jinwoo opens the note on his phone and stands. The farewell speech he rehearsed alone five times, stopping each time at the first sentence; this is the sixth. This time he doesn’t stop. 'I was always afraid of being late. In this room, for the first time, I learned that being late isn’t being wrong. Whatever desk I sit at, I won’t forget that.' Kang Taemin claps first, and Kwon Dohyun grumbles, 'I can’t classify this as a farewell speech or a New Year’s address,' as he eats the last piece of the calculator rice cake Na Junhyuk gave him. Then a text comes to your phone from an unknown number. 'I’m Grandpa Lim Kyungsoo’s granddaughter. Grandpa’s in the hospital with pneumonia. They say a demolition notice went up on the bookshop building.'",
      "memo": [
        "Oh Jinwoo’s 6th farewell speech -- finished for the first time",
        "Noodle-cup tree: 19 left",
        "Kwon Dohyun: finally ate all of the calculator rice cake",
        "Lim Kyungsoo hospitalized with pneumonia · bookshop demolition notice"
      ],
      "choices": {
        "c18_after_rush": {
          "label": "Go straight to the Hoegi-dong bookshop on getting the text"
        },
        "c18_after_record": {
          "label": "Put debtor protection standards for sale bundles on paper"
        },
        "c18_after_warm": {
          "label": "Stay with Oh Jinwoo until the pantry lights go off tonight"
        }
      },
      "place": "Trigger Lab, 4th floor · Pantry",
      "clock": "December 31 · Evening",
      "question": "As the sixth farewell speech ends, news comes of the bookshop’s demolition. How do you close the last evening of the year?"
    },
    "c18_appendix": {
      "title": "Appendix 3",
      "text": "In the elevator out of the lounge, Kwon Dohyun hands you a printout. Appendix 3 of the plan, 'Debtor handling plan'. The box said to be empty is packed with someone’s draft. 43 debtor companies, 612 slated for job cuts. No. 1 on the list is 'Sodam Chanbang', a side-dish factory in Suwon, 31 employees. Eyes on the floor buttons, Kwon Dohyun says, 'I didn’t write this. But it goes up under my name. Because I’m the reviewer who sets the price.' Just before the elevator reaches the 1st floor, he adds one more thing. 'Did you see the owner’s name at Sodam Chanbang? Song Miran. A 30-year customer of Mr. Oh’s father’s branch.'",
      "memo": [
        "Appendix 3: 43 debtor companies · 612 slated for job cuts",
        "No. 1: Sodam Chanbang (Suwon), 31 employees",
        "Review opinion signed by: Kwon Dohyun"
      ],
      "choices": {
        "c18_appendix_choice_3": {
          "label": "Ignore the appendix; read only the offer itself"
        },
        "c18_appendix_choice_1": {
          "label": "Show Oh Jinwoo the appendix today"
        },
        "c18_appendix_choice_2": {
          "label": "Check first who drafted the appendix"
        }
      },
      "place": "Bridge Bank, Yeouido · Elevator",
      "clock": "December 22 · 15:10",
      "question": "The debtor box said to be empty is filled with a plan to cut 612 jobs. What do you do with this appendix?"
    },
    "c18_ledger": {
      "title": "One Box",
      "text": "Oh Jinwoo’s Secret Santa was Kwon Dohyun. The gift, in a clear file instead of wrapping paper, is one A4 sheet: 'Oh Jinwoo Job Move: Profit and Loss'. In the gains column on the left, an 84 million won salary difference, a team head title and access to KD files are written out neatly to the margins. In the losses column on the right is a single line, 'Commute +12 minutes', and below it, blank. Kwon Dohyun clears his throat. 'I couldn’t fill in below that. I observed in secret for a month and couldn’t calculate it.' Oh Jinwoo peers at the sheet and bursts out laughing. Then the laughter slowly dies.",
      "memo": [
        "Gains: 84 million won salary difference and 2 other items",
        "Losses: 12 minutes of commute -- the rest blank",
        "Kwon Dohyun: 'Observed a month, cannot calculate'"
      ],
      "choices": {
        "c18_ledger_choice_2": {
          "label": "Hand him the pen: the blank is his to fill"
        },
        "c18_ledger_choice_3": {
          "label": "Give the file back with the blank left blank"
        },
        "c18_ledger_choice_1": {
          "label": "Write the names of his Trigger Lab colleagues in the blank"
        }
      },
      "place": "Trigger Lab, 4th floor · Pantry",
      "clock": "December 23 · 21:00",
      "question": "On Kwon Dohyun’s profit-and-loss sheet, the space below the losses is blank. What do you do with it?"
    },
    "c18_snow": {
      "title": "Holiday Greetings",
      "text": "Out the gate, the December snow thickens. As you walk to the bus stop, Oh Sangchul follows in slippers. In his hand is a stack of business cards bound with a yellow rubber band. Hundreds of customer cards from 30 years at Maetan Branch; on top, Song Miran of Sodam Chanbang. 'I told you to stand on the winning side because if you’re the one buying those people, at least you can handle them gently.' He presses the stack into his son’s hand. 'Stand on the losing side, and like me, you can’t do a thing for them.' The display at the stop shows the bus 2 minutes away. Oh Jinwoo can’t put the cards in his inside coat pocket; he stands holding them.",
      "memo": [
        "Stack of cards: Maetan Branch customers of 30 years",
        "On top: Song Miran, Sodam Chanbang",
        "Oh Sangchul: 'so you can at least handle them gently'"
      ],
      "choices": {
        "c18_snow_choice_3": {
          "label": "Leave the cards with Oh Jinwoo and board the bus first"
        },
        "c18_snow_choice_1": {
          "label": "Let one bus go and hear Oh Sangchul out"
        },
        "c18_snow_choice_2": {
          "label": "Work out how to tell the customers on the cards about the sale"
        }
      },
      "place": "Maetan-dong, Suwon · Alley by the bus stop",
      "clock": "December 24 · Blowing snow · 21:40",
      "question": "Oh Sangchul, in slippers, presses 30 years of customer cards into his son’s hand. What do you do before the bus comes?"
    },
    "c18_appendix_reaction": {
      "title": "A Test I Wrote",
      "text": "At the revolving door in the lobby, Do Haram catches up with you. Her face says she already knows what Kwon Dohyun showed you. 'That appendix. Show it to him. To Mr. Oh.' She pulls on her gloves. 'If he still comes after seeing the 612, he’s someone who can do this job. If he sees it and doesn’t come, then I’ve met a good person. Either way, I don’t lose.' The revolving door turns once. 'If you hide it, Analyst, I suppose that means you don’t trust him.'",
      "memo": [
        "Someone who doesn’t lose either way",
        "Hiding it means not trusting him"
      ],
      "choices": {
        "c18_appendix_reaction_choice_3": {
          "label": "Test or not, shelve the appendix for now"
        },
        "c18_appendix_reaction_choice_2": {
          "label": "Pass Do Haram’s words on to Oh Jinwoo as they are"
        },
        "c18_appendix_reaction_choice_1": {
          "label": "Have Kwon Dohyun explain the appendix, not me"
        }
      },
      "place": "Bridge Bank head office, Yeouido · 1st-floor lobby",
      "clock": "December 22 · 15:15",
      "question": "Do Haram says hiding the appendix means you don’t trust Oh Jinwoo. How do you answer that test?"
    },
    "c18_ledger_reaction": {
      "title": "Just Once",
      "text": "As the party winds down, Na Junhyuk follows Oh Jinwoo into the emergency stairwell with two cups of instant coffee. 'In 30 years another bank called me just once, too. 1.5 times the salary. Know what my wife said? Who’s going to carry your three seals then?' Oh Jinwoo laughs. Na Junhyuk laughs too, then looks down at his coffee. 'I didn’t go. And I stayed and returned that report three times. Staying doesn’t mean you do it all right. And going isn’t running away.' At the bottom of the stairs, the fairy lights flicker once.",
      "memo": [
        "An offer that came just once in 30 years",
        "Neither staying nor going is running away"
      ],
      "choices": {
        "c18_ledger_reaction_choice_2": {
          "label": "Suggest writing out what the stayer and the leaver each do"
        },
        "c18_ledger_reaction_choice_3": {
          "label": "Leave the two alone and quietly go back to the pantry"
        },
        "c18_ledger_reaction_choice_1": {
          "label": "Sit on the stairs with them and hear them out"
        }
      },
      "place": "Trigger Lab, 4th floor · Emergency exit corridor",
      "clock": "December 23 · 22:10",
      "question": "Na Junhyuk brings up the one offer he got in 30 years. What do you do here?"
    },
    "c18_snow_reaction": {
      "title": "The Name on the Price Tag",
      "text": "11 p.m., on the bus to Seoul, you take a call from Kwon Dohyun. 'Director Do has nailed the signing to 9 a.m. on December 29. Whether Mr. Oh comes or not, the price is fixed that day.' On the line you hear a calculator being tapped. 'My name goes on that price tag. Write 19% and we profit, KD loses, and Sodam Chanbang goes to court. Write 23% and I become the most expensive reviewer at this bank.' He gives a short laugh. 'First time in my life I’ve priced my own name. At this price, it’s a loss. On my side.'",
      "memo": [
        "Signing: December 29, 09:00",
        "The price of a name, between 19% and 23%"
      ],
      "choices": {
        "c18_snow_reaction_choice_3": {
          "label": "Tell him to write 19% and save his name for the next fight"
        },
        "c18_snow_reaction_choice_2": {
          "label": "Leave the price to Kwon Dohyun; just keep a record"
        },
        "c18_snow_reaction_choice_1": {
          "label": "Build the case for 23% with Kwon Dohyun overnight"
        }
      },
      "place": "Express bus from Suwon · On board",
      "clock": "December 24 · 23:00",
      "question": "Kwon Dohyun asks what price to put on his name on the price tag. How do you answer?"
    },
    "c18_branch_dataroom": {
      "title": "Five Words",
      "text": "With the temporary account Do Haram gave you, you log in to a terminal in the due diligence data room. A windowless room, four monitors, a 'NO PRINTING' sticker on every desk. Oh Jinwoo types 'Maetan Branch' into the search box. The branch where his father held off an approval by a day. One file comes up. A 2009 review on replacing the branch manager, author Yoon Sanghyuk, Corporate Finance Strategy Team. In the reason field, one handwritten line. 'Uncooperative with head office schedule.' Oh Jinwoo’s hand stops on the mouse. 'That’s the reason for my father’s 30 years. Five words.' Below the review runs a list: loans of 64 old customers of the same branch are in this sale bundle.",
      "memo": [
        "Temporary account -- every view is logged",
        "Branch manager replacement review: author Yoon Sanghyuk",
        "Reason: 'Uncooperative with head office schedule'",
        "64 old Maetan Branch customers in this bundle"
      ],
      "choices": {
        "c18_branch_dataroom_a": {
          "label": "Read only his father’s file to the end, with Oh Jinwoo"
        },
        "c18_branch_dataroom_c": {
          "label": "Ignore the no-printing rule; photograph the screen"
        },
        "c18_branch_dataroom_b": {
          "label": "Log that you viewed it and close the file"
        }
      },
      "place": "Bridge Bank, Yeouido · Due diligence data room",
      "clock": "December 22 · 14:07",
      "question": "The reason his father was pushed out is on the screen in five words. What do you do with this file?"
    },
    "c18_branch_dataroom_follow": {
      "title": "Who Owns the Blade",
      "text": "As you leave the data room, Do Haram is standing at the end of the corridor. In her hand, one A4 printout of the access log. '14:07, Maetan Branch. You opened that first, as expected.' She folds the paper in half and tucks it into Oh Jinwoo’s jacket pocket. 'I won’t send this log to anyone. But I’ll remember it. If you join, that file is yours, Team Head. If not, it goes to the next team head.' Oh Jinwoo presses his pocket. Turning away, Do Haram adds, 'The next team head won’t even know where Maetan Branch is. I’ll admit that’s more convenient for me.'",
      "memo": [
        "Original access log: kept by Do Haram",
        "If he joins, he keeps access to that file",
        "If he declines, access passes to the next candidate",
        "Next candidate: an outsider with no tie to Maetan Branch"
      ],
      "choices": {
        "c18_branch_dataroom_follow_c": {
          "label": "Leave the log with Do Haram and quietly go"
        },
        "c18_branch_dataroom_follow_b": {
          "label": "Demand a copy of the access log for us too"
        },
        "c18_branch_dataroom_follow_a": {
          "label": "Say you’ll stand with Oh Jinwoo whoever holds the file"
        }
      },
      "place": "Bridge Bank, Yeouido · 22nd-floor corridor",
      "clock": "December 22 · 14:40",
      "question": "Holding the access log, Do Haram says who will own that file. How do you answer?"
    },
    "c18_route_system": {
      "title": "The Scouting File",
      "text": "You ask to open the attachments first. ECHO spreads out the Bridge Bank offer. The attachments open. In Do Haram’s 'candidate evaluation sheet', Oh Jinwoo is described as 'top 3% in decision speed under pressure, 1.8 times focus under competitive stimulus'. ECHO underlines the two figures. 'These numbers don’t come out of an interview. They match the item names in the Trigger Lab response records, down to the decimal point.' In a corner of the screen, the account that first created the file appears. KD Financial Group, Group Strategy Office. 'Oh Jinwoo may not have been scouted but recommended. There is no record of his consent.'",
      "memo": [
        "Candidate evaluation figures = Trigger Lab response record items",
        "File created by: KD Financial Group, Group Strategy Office",
        "No record of Oh Jinwoo’s consent"
      ],
      "choices": {
        "c18_route_system_card": {
          "label": "Shelve the sheet and hold it as a card in the sale talks"
        },
        "c18_route_system_audit": {
          "label": "Request an official probe into how the records got out"
        },
        "c18_route_system_tell": {
          "label": "Show Oh Jinwoo the evaluation sheet as it is"
        },
        "c18_route_system_evidence_turn": {
          "label": "Leaf through the side agreement to the draft sale contract"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Lab terminal",
      "clock": "December 22 · 23:40",
      "question": "Bridge’s candidate evaluation sheet carries the Trigger Lab response figures unchanged. What do you do about it?"
    },
    "c18_final_system_route": {
      "title": "The Recommended Man",
      "text": "Half past five in the morning; on the lab terminal, the candidate evaluation sheet and the Trigger Lab response records sit side by side on one screen. The same item names, the same digits after the decimal point. At nine, on Bridge Bank’s 32nd floor, Oh Jinwoo decides whether to sign, and he still doesn’t know how he was chosen. ECHO brings up the file’s creating account again. 'He is calculating which side wins. One number he needs in that calculation is missing only for him.'",
      "memo": [
        "Candidate evaluation sheet = Trigger Lab response record items",
        "File created by: KD Financial Group, Group Strategy Office",
        "Oh Jinwoo signs at: 09:00 today"
      ],
      "choices": {
        "c18_final_system_route_b": {
          "label": "Known or not, just get the offer terms raised for him"
        },
        "c18_final_system_route_a": {
          "label": "Add a term voiding any hire based on response records"
        },
        "c18_final_system_route_c": {
          "label": "Ask Do Haram with Oh Jinwoo who recommended him"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Lab terminal",
      "clock": "December 29 · 05:30",
      "question": "Response records used without consent became the basis for a hire. What do you change before the signing?"
    },
    "c18_evidence_turn": {
      "title": "Deal Term No. 7",
      "text": "You fit the clue into the draft contract by page number, and the side agreement to the draft sale contract opens. Terms 1 through 6 are prices and dates. No. 7 is one line. 'The seller shall cooperate in the buyer’s hiring of key personnel. Subject: Oh Jinwoo, Trigger Lab.' It is dated eleven days before Bridge sent the offer. Ban Jaewook puts down the pen he was writing with. 'Not scouting. Transplanting. KD sells the loan bundle cheap and, as a bonus, clears out one noisy analyst.' He straightens his glasses. 'The seat Mr. Oh thought was the winning side was one KD set aside from the start.'",
      "memo": [
        "Side agreement No. 7: cooperation in hiring Oh Jinwoo of Trigger Lab",
        "Dated: 11 days before the offer was sent",
        "Signed: KD Financial Group Group Strategy Office · Bridge Bank strategy division"
      ],
      "choices": {
        "c18_evidence_turn_file": {
          "label": "Report No. 7 to the FSS as an improper deal term"
        },
        "c18_evidence_turn_show": {
          "label": "Show No. 7 to Oh Jinwoo before anyone"
        },
        "c18_evidence_turn_hold": {
          "label": "Hold No. 7 and play it as a card just before signing"
        }
      },
      "place": "Trigger Lab archive B2 · Copy of the sale contract",
      "clock": "December 29 · 07:00",
      "question": "The scouting was written in as deal term No. 7 eleven days before the offer. How do you use this clause?"
    },
    "c18_start_warm": {
      "title": "An Envelope for the One Who Stayed",
      "text": "Last night you stayed until Jung Taeo’s tteok skewer truck turned off its lights, shaking sauce bottles with Ban Jaewook. Meanwhile, the call Oh Jinwoo took behind the truck didn’t end even when the lights went out. Monday morning, he puts a white envelope on your desk. Bridge Bank acquisitions team head, double the salary. The job is buying KD Bank’s 186 billion won bundle of bad loans at 19% of principal, and the buyer opens every KD loan file. The answer is due by 9 a.m. on December 29. 'It’s that call yesterday. If I’d brought it up at the truck, my name would’ve gone in Mr. Ban’s notebook too. They say I could see even the files of the people who pushed my father out.'",
      "memo": [
        "Last night’s call behind the truck: Bridge Bank",
        "Bridge Bank acquisitions team head offer -- double salary",
        "Job: buy KD Bank’s 186 billion won bad-loan bundle at 19% of principal",
        "Reply due: December 29, 09:00"
      ],
      "choices": {
        "c18_start_warm_signature": {
          "label": "Write down Oh Jinwoo’s whole story in a notebook, like Ban Jaewook"
        },
        "c18_start_warm_terms": {
          "label": "Check the offer’s terms and the sale bundle line by line"
        },
        "c18_start_warm_listen": {
          "label": "Set the envelope aside and hear Oh Jinwoo out first"
        },
        "c18_start_warm_knife": {
          "label": "Work out first whether this post could be a blade against KD"
        },
        "c18_start_warm_reframe": {
          "label": "Ask to open the offer’s attachments first"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "December 22 · Reply due D-7",
      "question": "The call taken behind the skewer truck has come back as a white envelope. How do you take Oh Jinwoo’s words?",
      "lead": "A Monday morning, the smell of skewer sauce not yet out of your coat."
    },
    "c18_start_record": {
      "title": "An Envelope for the One Who Signed the Paper",
      "text": "Last night you left a proposal to add a 'who gave the order' box to audit reports, and Oh Jinwoo put his name in the reviewer field. The proposal went to group legal before dawn. Monday morning, at the bottom of the experience section in the Bridge Bank job offer Oh Jinwoo holds out, that review is listed as one line. Acquisitions team head, double the salary. The job is buying KD Bank’s 186 billion won bundle of bad loans at 19% of principal, and the buyer opens every KD loan file. Even the files of the people who pushed Oh Jinwoo’s father out. The answer is due by 9 a.m. on December 29. ECHO points it out. 'A document written 10 hours ago is in another bank’s experience section. Someone passed it on overnight.'",
      "memo": [
        "Reviewer of last night’s proposal: Oh Jinwoo",
        "Bridge’s job offer cites that review as experience",
        "Job: buy KD Bank’s 186 billion won bad-loan bundle at 19% of principal",
        "Reply due: December 29, 09:00"
      ],
      "choices": {
        "c18_start_record_knife": {
          "label": "Work out first whether this post could be a blade against KD"
        },
        "c18_start_record_terms": {
          "label": "Check the offer’s terms and the sale bundle line by line"
        },
        "c18_start_record_signature": {
          "label": "Ask Bridge first who passed on my document overnight"
        },
        "c18_start_record_listen": {
          "label": "Set the envelope aside and hear Oh Jinwoo out first"
        },
        "c18_start_record_reframe": {
          "label": "Ask to open the offer’s attachments first"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "December 22 · Reply due D-7",
      "question": "The document you left last night has become a line of experience in an offer that would take your colleague away. How do you get it back?",
      "lead": "Looking through the sharing log of last night’s proposal, you stop at an unfamiliar bank’s name."
    },
    "c18_start_rush": {
      "title": "An Envelope for the One Who Waited in the Corridor",
      "text": "Last night you left the party and went up first, and no one could ask what the call Oh Jinwoo took behind the truck was. Monday morning, back from legal’s meeting, you find Oh Jinwoo waiting in the corridor. He puts a white envelope on your desk. Bridge Bank acquisitions team head, double the salary. The job is buying KD Bank’s 186 billion won bundle of bad loans at 19% of principal, and the buyer opens every KD loan file. 'It’s that call yesterday. Nobody asked, so I held it alone all night. They say I could see even the files of the people who pushed my father out. But please don’t drag it out.'",
      "memo": [
        "Last night’s call behind the truck -- no one could ask",
        "Bridge Bank acquisitions team head offer -- double salary",
        "Job: buy KD Bank’s 186 billion won bad-loan bundle at 19% of principal",
        "Reply due: December 29, 09:00"
      ],
      "choices": {
        "c18_start_rush_signature": {
          "label": "Settle leaving early last night with Oh Jinwoo, no excuses"
        },
        "c18_start_rush_knife": {
          "label": "Work out first whether this post could be a blade against KD"
        },
        "c18_start_rush_terms": {
          "label": "Check the offer’s terms and the sale bundle line by line"
        },
        "c18_start_rush_listen": {
          "label": "Set the envelope aside and hear Oh Jinwoo out first"
        },
        "c18_start_rush_reframe": {
          "label": "Ask to open the offer’s attachments first"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "December 22 · Reply due D-7",
      "question": "The call no one asked about last night now lies on your desk as an envelope. What do you say first?",
      "lead": "A Monday morning, and still no one has asked what the call behind the truck was."
    }
  },
  "echoReplies": {
    "c18_start_listen": "Heard out, Oh Jinwoo talks longer about his father than about the envelope. The whole morning’s schedule slips.",
    "c18_start_terms": "Reading the list, you see that 64 of the 1,214 loans came from one branch. Oh Jinwoo knows you looked at the list before his face.",
    "c18_start_knife": "Worked out, the blade is clearly sharp. Oh Jinwoo is a little relieved, and a little let down, that you saw the blade first too.",
    "c18_lounge_ask": "Asked, Do Haram is slow to answer for the first time. Instead of answering, Oh Jinwoo looks out at KD headquarters.",
    "c18_lounge_paper": "Asked for it in writing, the basis stays on record. Do Haram smiles only at Oh Jinwoo: 'You brought a thorough one.'",
    "c18_lounge_blade": "Weighing it, there are many places to cut. None of them lists the 1,214 debtors.",
    "c18_party_wait": "Waiting, the party runs long. Oh Jinwoo doesn’t bring it up first, but he doesn’t leave either.",
    "c18_party_share": "Shown the plan, the pantry goes quiet. Everyone adds a view, and Oh Jinwoo finds it a little heavy that his business has become everyone’s agenda.",
    "c18_party_push": "Pressed, Oh Jinwoo says 'I’ll tell you tomorrow' and reaches for his coat, then stops. One Secret Santa reveal is still left. The star on top of the tree tilts.",
    "c18_table_stay": "You stay and help, and dinner runs past two hours. His mother fries a fourth rolled omelet.",
    "c18_table_list": "Going over it, Oh Sangchul recalls each shop’s location and the children’s names for every name. The dinner table turns into a review room.",
    "c18_table_win": "When you urge it, Oh Sangchul looks straight at you for the first time. Oh Jinwoo puts down his chopsticks with the face of someone who heard the same thing from both of you.",
    "c18_final_keep": "Held back, Oh Jinwoo stays. That afternoon Do Haram picks another team head, who doesn’t know where Maetan Branch is.",
    "c18_final_terms": "With terms set, Oh Jinwoo signs, and a debtor protection clause is attached to the contract. He starts in the spring, once his Trigger Lab work is wrapped up. By spring, the person who would make them keep it will be at another bank.",
    "c18_final_block": "You go to block it, and the 9:00 signing never opens. For a while, Oh Jinwoo doesn’t challenge you over a morning someone else decided for him.",
    "c18_after_warm": "Staying until the lights go off, the noodle-cup tree is gone. You answer the bookshop text on the first bus tomorrow morning.",
    "c18_after_record": "Put on paper, the standard survives whoever becomes team head. Oh Jinwoo writes his name in the reviewer field and adds a note: don’t copy this document into anyone’s experience section.",
    "c18_after_rush": "Going straight there, you find a woman in her 20s you’ve never seen, standing at the bookshop shutter holding a box marked 'Belongings'.",
    "c18_appendix_choice_1": "Shown it, Oh Jinwoo stops at the name Song Miran for a long while. Then, instead of putting the offer in a drawer, he leaves it open on the desk.",
    "c18_appendix_choice_2": "You check, and the draft file’s author field carries a KD Financial Group Group Strategy Office account. The seller wrote the buyer’s appendix.",
    "c18_appendix_choice_3": "Reading only the body, the offer is clean. The 612 stay in Appendix 3 as they are.",
    "c18_ledger_choice_1": "With the names written in, the box runs out of room. Kwon Dohyun says, 'That’s why it wouldn’t calculate.'",
    "c18_ledger_choice_2": "Given the pen, Oh Jinwoo can’t write for a long time. Then he writes 'Father' at the top of the box and draws no line under it.",
    "c18_ledger_choice_3": "The returned file goes into Oh Jinwoo’s bag. The blank opens again when he is alone.",
    "c18_snow_choice_1": "Letting the bus go, snow piles on Oh Sangchul’s shoulders. In his slippers, he tells a story he has told no one.",
    "c18_snow_choice_2": "As you work out how to tell them, the stack of cards becomes a contact list. Song Miran’s number is just as it is on her card.",
    "c18_snow_choice_3": "Boarding first, you see through the window father and son standing in the snow. Neither goes inside first.",
    "c18_appendix_reaction_choice_1": "When Kwon Dohyun explains, he points first to the box his name will go in. For the first time, Oh Jinwoo reads Kwon Dohyun’s sheet to the end.",
    "c18_appendix_reaction_choice_2": "When you pass it on as is, Oh Jinwoo laughs. 'He tells you a test is a test. That’s scarier.'",
    "c18_appendix_reaction_choice_3": "With it shelved, the party starts quietly. Appendix 3 waits another day in Kwon Dohyun’s bag.",
    "c18_ledger_reaction_choice_1": "Hearing them out, the coffee goes cold. Na Junhyuk insists he likes his instant coffee cold anyway.",
    "c18_ledger_reaction_choice_2": "Writing it out, you get a table. Oh Jinwoo sees that the 'one who goes' column has more to do than he thought.",
    "c18_ledger_reaction_choice_3": "You go back, and only the two of them are left on the stairs. Do Yoonha tells you later that Na Junhyuk’s story went on to his wife’s second remark.",
    "c18_snow_reaction_choice_1": "Working all night, you build a basis. At 4 a.m., Kwon Dohyun creates, for the first time, a column called 'skill level of Sodam Chanbang’s 31 employees'.",
    "c18_snow_reaction_choice_2": "Left to it, Kwon Dohyun decides alone. He always decided alone, and always carried the result around alone as a sheet.",
    "c18_snow_reaction_choice_3": "Told to save it, Kwon Dohyun says, 'Understood.' The answer comes so fast that it lingers.",
    "c18_branch_dataroom_a": "Reading to the end, you find Oh Sangchul’s rebuttal memo attached to the last page of the review. A memo no one has read since.",
    "c18_branch_dataroom_b": "With the view logged, it is above board. The five words Oh Jinwoo saw stay on the screen as they are.",
    "c18_branch_dataroom_c": "The photo becomes a blade. The account that broke the no-printing rule is Oh Jinwoo’s temporary account.",
    "c18_branch_dataroom_follow_a": "At your pledge, Do Haram nods. 'Then I’d better hire you both.' Whether it’s a joke, you can’t tell.",
    "c18_branch_dataroom_follow_b": "With the copy, there are two pieces of evidence. Do Haram readily prints one more, and that readiness looks even more calculated.",
    "c18_branch_dataroom_follow_c": "You leave, and the log goes into Do Haram’s drawer. In the elevator, Oh Jinwoo presses his pocket once more.",
    "c18_route_system_tell": "Shown it, Oh Jinwoo stares at the two figures for a long time. 'They didn’t buy me. They bought my reactions.'",
    "c18_route_system_audit": "With the probe requested, how it happened becomes paperwork. The probe runs longer than Oh Jinwoo’s reply deadline.",
    "c18_route_system_card": "Held as a card, it helps in the talks. Oh Jinwoo goes to the signing without knowing the most important fact about himself.",
    "c18_final_system_route_a": "With the voiding clause in, Bridge has to start the hire over. This time with an interview.",
    "c18_final_system_route_b": "With the terms raised, Oh Jinwoo gets a better contract. The figures it rests on were still used without his consent.",
    "c18_final_system_route_c": "Asked directly, Do Haram smiles briefly. 'The recommendation came from the 33rd floor. I thought it was odd at first too.'",
    "c18_evidence_turn_show": "Shown it, Oh Jinwoo folds the offer in half. Then he unfolds it and looks at the price box.",
    "c18_evidence_turn_file": "The report stays on record. The 9:00 signing opens as planned, and the findings come out in spring.",
    "c18_evidence_turn_hold": "Holding it, the room just before signing is yours. Oh Jinwoo learns later that you knew the clause before he did.",
    "c18_lounge_evidence_turn": "Leaf through the clauses to the end and something other than price is being traded. The part not written in the contract body may cost more.",
    "c18_party_evidence_turn": "Leaf through the clauses to the end and something other than price is being traded. The part not written in the contract body may cost more.",
    "c18_table_evidence_turn": "Leaf through the clauses to the end and something other than price is being traded. The part not written in the contract body may cost more.",
    "c18_route_system_evidence_turn": "Leaf through the clauses to the end and something other than price is being traded. The part not written in the contract body may cost more.",
    "case18_memory_system": "Check it and what the evaluation sheet carries is not a table but numbers. They match the Trigger Lab response records down to the decimal point, and ECHO underlines both.",
    "case18_memory_evidence": "Hold the extension’s owner against the sale contract, and one more side agreement comes out with it. Something other than price is among the deal terms.",
    "c18_start_warm_listen": "Heard out, Oh Jinwoo talks longer about his father than about the envelope. The whole morning’s schedule slips.",
    "c18_start_warm_terms": "Reading the list, you see that 64 of the 1,214 loans came from one branch. Oh Jinwoo knows you looked at the list before his face.",
    "c18_start_warm_knife": "Worked out, the blade is clearly sharp. Oh Jinwoo is a little relieved, and a little let down, that you saw the blade first too.",
    "c18_start_warm_signature": "As you write it down, Oh Jinwoo speaks slowly for the first time. Until a full notebook page is filled, salary never comes up once.",
    "c18_start_record_listen": "Heard out, Oh Jinwoo talks longer about his father than about the envelope. The whole morning’s schedule slips.",
    "c18_start_record_terms": "Reading the list, you see that 64 of the 1,214 loans came from one branch. Oh Jinwoo knows you looked at the list before his face.",
    "c18_start_record_knife": "Worked out, the blade is clearly sharp. Oh Jinwoo is a little relieved, and a little let down, that you saw the blade first too.",
    "c18_start_record_signature": "Asked, Bridge sends a polite reply. 'We referred to publicly available material.' Who passed on that material isn’t stated.",
    "c18_start_rush_listen": "Heard out, Oh Jinwoo talks longer about his father than about the envelope. The whole morning’s schedule slips.",
    "c18_start_rush_terms": "Reading the list, you see that 64 of the 1,214 loans came from one branch. Oh Jinwoo knows you looked at the list before his face.",
    "c18_start_rush_knife": "Worked out, the blade is clearly sharp. Oh Jinwoo is a little relieved, and a little let down, that you saw the blade first too.",
    "c18_start_rush_signature": "Skipping the excuses, the talk goes fast. Oh Jinwoo looks relieved at the quick conclusion, and that look weighs on you a little."
  },
  "choiceVoiceLines": {
    "c18_start_listen": "Saying the heart of the one who brought it comes before the paper, you set the envelope aside and hear Oh Jinwoo out first.",
    "c18_start_terms": "Saying you need to see what’s attached behind double the salary, you check the offer’s terms and the sale bundle list line by line.",
    "c18_start_knife": "Your eye caught by a post that buys up KD’s bad loans, you work out first whether it could be a blade against KD.",
    "c18_lounge_ask": "Bothered that no one has filled the debtor box yet, you ask who Oh Jinwoo would protect in that seat before asking about the salary.",
    "c18_lounge_paper": "Saying a price heard aloud changes later, you ask for the basis of the price in writing.",
    "c18_lounge_blade": "Since you should know what a blade put in your hand is good for, you weigh first where it could cut KD.",
    "c18_party_wait": "Not wanting to be first to break a happy moment, you don’t press him and keep the party going until Oh Jinwoo speaks on his own.",
    "c18_party_share": "Saying this isn’t a weight for one person, you propose showing the whole team the sale plan and deciding together.",
    "c18_party_push": "Saying the longer it drags the more everyone tiptoes, you press Oh Jinwoo to decide before tonight is over.",
    "c18_table_stay": "Unable to let dinner end on set faces, you stay at the table and help the two of them talk it through.",
    "c18_table_list": "Saying you should see with your own eyes who the winning side buys, you go over the old customers in the bundle with Oh Sangchul line by line.",
    "c18_table_win": "Saying it’s the word of a man who lived through 30 years, you urge Oh Jinwoo to take the advice to stand on the winning side.",
    "c18_final_keep": "Saying Trigger Lab is where he belongs, not a place that hands him a blade, you hold Oh Jinwoo back.",
    "c18_final_terms": "Not wanting him to go in alone and fight alone, you let him go on terms: a debtor protection clause and a promise to fight together from inside and out.",
    "c18_final_block": "Saying the 612 stay the same whoever becomes team head, you go block the sale itself without waiting for Oh Jinwoo’s decision.",
    "c18_after_warm": "Saying the text can wait for an answer tomorrow, you stay with Oh Jinwoo until the pantry lights go off tonight.",
    "c18_after_record": "So it can be used when the next bundle is sold too, you put debtor protection standards for sale bundles on paper.",
    "c18_after_rush": "Unable to sit still at news of a demolition notice, you go straight to the Hoegi-dong bookshop the moment you get the text.",
    "c18_appendix_choice_1": "Unable to let him decide without knowing about the 612, you show Oh Jinwoo the appendix today.",
    "c18_appendix_choice_2": "Since it goes up under Kwon Dohyun’s name though he didn’t write it, you check first who drafted the appendix.",
    "c18_appendix_choice_3": "Saying you can’t take on someone else’s draft too, you ignore the appendix and read only the body of the offer.",
    "c18_ledger_choice_1": "To show that 12 minutes isn’t all he’d lose, you write the names of his Trigger Lab colleagues in the blank.",
    "c18_ledger_choice_2": "Saying the blank must be filled by Oh Jinwoo himself for it to be his own math, you hand him the pen.",
    "c18_ledger_choice_3": "Saying some boxes just don’t calculate, you give the file back with the blank left blank.",
    "c18_snow_choice_1": "Unable to leave a man who followed you out in slippers, you let one bus go and hear Oh Sangchul out at the stop.",
    "c18_snow_choice_2": "Saying handling them gently means telling them first, you work out how to tell the customers on the cards about the sale.",
    "c18_snow_choice_3": "Thinking father and son still have something to say, you leave the cards with Oh Jinwoo and board the bus first.",
    "c18_appendix_reaction_choice_1": "Saying the one whose name goes on it should speak, you have Kwon Dohyun explain the appendix himself, not you.",
    "c18_appendix_reaction_choice_2": "Since it’s only fair if he knows it’s a test, you pass Do Haram’s words on to Oh Jinwoo as they are.",
    "c18_appendix_reaction_choice_3": "Saying there’s no reason to answer a test someone else set, you shelve the appendix for now, test or not.",
    "c18_ledger_reaction_choice_1": "Feeling that one more person beside them would be good tonight, you sit on the stairs with them and hear both out.",
    "c18_ledger_reaction_choice_2": "So the point that both staying and going have work to do doesn’t slip by, you suggest writing out what the stayer and the leaver each do.",
    "c18_ledger_reaction_choice_3": "Saying it isn’t your place to cut into the words of a man of 30 years, you leave the two alone and quietly go back to the pantry.",
    "c18_snow_reaction_choice_1": "So Sodam Chanbang doesn’t go to court, you build the case for 23% with Kwon Dohyun overnight.",
    "c18_snow_reaction_choice_2": "Since it’s a price for the one whose name goes on it, you leave the price to Kwon Dohyun’s judgment and tell him just to keep a record.",
    "c18_snow_reaction_choice_3": "Saying he can’t stake his whole name on this one time, you tell him to write 19% as is and save his name for the next fight.",
    "c18_branch_dataroom_a": "To see together what lies behind those five words, you read only his father’s file to the end with Oh Jinwoo.",
    "c18_branch_dataroom_b": "Saying what you saw on a borrowed account must leave a trace, you log the view and close the file.",
    "c18_branch_dataroom_c": "Saying you may never see it again once you leave this room, you ignore the no-printing rule and photograph the screen with your phone.",
    "c18_branch_dataroom_follow_a": "Not letting a file bind a person, you say you’ll stand with Oh Jinwoo whoever holds that file.",
    "c18_branch_dataroom_follow_b": "Because a record held by one side becomes a weak spot, you demand a copy of the access log for us too.",
    "c18_branch_dataroom_follow_c": "Saying confronting her here means stepping onto her table, you leave the log with Do Haram and quietly go.",
    "c18_route_system_tell": "Because he should know how he was chosen, you show Oh Jinwoo the evaluation sheet as it is.",
    "c18_route_system_audit": "Since the figures went out without any record of his consent, you request an official probe into how the response records got out.",
    "c18_route_system_card": "Saying it’s used up once if set off now, you shelve the evaluation sheet and hold it as a card in the sale talks.",
    "c18_final_system_route_a": "So no one is chosen by numbers measured in secret, you add a signing term voiding any hire based on response records.",
    "c18_final_system_route_b": "Saying there’s no need to shake him with nine o’clock so close, you just get the offer terms raised for him, whether he knows or not.",
    "c18_final_system_route_c": "So he hears with his own ears the one number missing only for him, you go with Oh Jinwoo and ask Do Haram directly who recommended him.",
    "c18_evidence_turn_show": "Because the person named in a line should see it first, you show No. 7 to Oh Jinwoo before anyone.",
    "c18_evidence_turn_file": "Saying a contract that puts a person in its deal terms must be seen from outside, you report No. 7 to the FSS as an improper deal term.",
    "c18_evidence_turn_hold": "Saying it changes the price only if played when it hurts most, you hold No. 7 and play it as a card just before signing.",
    "c18_lounge_evidence_turn": "Using the draft sale contract as a clue, you go through it clause by clause to see what changes hands besides the price.",
    "c18_party_evidence_turn": "Using the draft sale contract as a clue, you go through it clause by clause to see what changes hands besides the price.",
    "c18_table_evidence_turn": "Using the draft sale contract as a clue, you go through it clause by clause to see what changes hands besides the price.",
    "c18_route_system_evidence_turn": "Using the draft sale contract as a clue, you go through it clause by clause to see what changes hands besides the price.",
    "c18_start_warm_listen": "Saying the heart of the one who brought it comes before the paper, you set the envelope aside and hear Oh Jinwoo out first.",
    "c18_start_warm_terms": "Saying you need to see what’s attached behind double the salary, you check the offer’s terms and the sale bundle list line by line.",
    "c18_start_warm_knife": "Your eye caught by a post that buys up KD’s bad loans, you work out first whether it could be a blade against KD.",
    "c18_start_warm_signature": "Not wanting to miss a single word, you write down Oh Jinwoo’s whole story in a notebook, the way Ban Jaewook does.",
    "c18_start_record_listen": "Saying the heart of the one who brought it comes before the paper, you set the envelope aside and hear Oh Jinwoo out first.",
    "c18_start_record_terms": "Saying you need to see what’s attached behind double the salary, you check the offer’s terms and the sale bundle list line by line.",
    "c18_start_record_knife": "Your eye caught by a post that buys up KD’s bad loans, you work out first whether it could be a blade against KD.",
    "c18_start_record_signature": "Since a document written 10 hours ago is in someone else’s experience section, you ask Bridge first who passed on your document overnight.",
    "c18_start_rush_listen": "Saying the heart of the one who brought it comes before the paper, you set the envelope aside and hear Oh Jinwoo out first.",
    "c18_start_rush_terms": "Saying you need to see what’s attached behind double the salary, you check the offer’s terms and the sale bundle list line by line.",
    "c18_start_rush_knife": "Your eye caught by a post that buys up KD’s bad loans, you work out first whether it could be a blade against KD.",
    "c18_start_rush_signature": "To honor his request not to drag it out, you skip the excuses for leaving early last night and talk it through to a conclusion with Oh Jinwoo."
  },
  "pack": {
    "clue": {
      "title": "Deal Term No. 7",
      "text": "No. 7 of the sale contract’s side agreement read: 'The seller shall cooperate in the buyer’s hiring of key personnel. Subject: Oh Jinwoo, Trigger Lab.' The scouting was written in as a deal term eleven days before the offer."
    },
    "outcomes": {
      "c18_after_warm": {
        "tag": "Stayed to the End",
        "title": "You stayed with Oh Jinwoo until the pantry lights went off",
        "text": "The night the sixth farewell speech ended, you all ate the last 19 cups of the noodle tree together. The last to turn off the lights was Oh Jinwoo."
      },
      "c18_after_record": {
        "tag": "Left a Standard",
        "title": "Debtor protection standards for sale bundles went on paper",
        "text": "A one-page standard remains that must be followed whoever buys and whoever is team head. The first line lists Sodam Chanbang’s 31 employees."
      },
      "c18_after_rush": {
        "tag": "Ran Ahead",
        "title": "You went to the bookshop the moment the farewell speech ended",
        "text": "Before the applause died, you picked up your coat. Oh Jinwoo followed you to the stairs and said, 'Go. This time I’ll be the late one.'"
      }
    },
    "continuityChallenges": {
      "c17_after_warm": {
        "title": "Stay Beside a Colleague Who May Leave",
        "text": "Just as you stayed beside the people in the notebook until the truck’s lights went out, this time the card that stays beside a colleague who may leave keeps Trust going."
      },
      "c17_after_record": {
        "title": "Take Back Your Document Turned Résumé Line",
        "text": "The document you left has become a line of experience in the offer that would take Oh Jinwoo away. Whose hands it belongs in will be sorted out on a new table."
      },
      "c17_after_rush": {
        "title": "Turn a Night No One Asked Into a Morning That Waits",
        "text": "Last night you left first, and no one asked what the call behind the truck was. This time, not rushing his choice is what Fairness asks, and no more."
      }
    }
  }
};
