/**
 * 프롤로그 03 (src/nodes/prologue03.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "p3_start": {
      "title": "Attachment No. 7",
      "text": "On a monitor in the Corporate Finance Strategy Team’s review room on the 6th floor of head office sits the Credit Committee agenda, posted to the intranet at five in the morning. The fourth item is 2023-0412, the loan to the logistics platform FlowOn. Your dissent is not in the main file. It is filed as 'Attachment 7'. The number only means it was the seventh to come in, but the clause you challenged happens to be Article 7 too. The debt-to-equity threshold is 180%, the reported figure sits 0.4 percentage points below it, and you argued that gap over eleven pages. Assistant Manager Oh Jinwoo comes over with two paper cups and sets one down. 'Attachments get read only if the chair asks for them. Otherwise they just sit there.' He taps the agenda twice with a fingertip. 'Eleven items today, one hour of meeting. Have you worked out how many minutes that leaves per item?'",
      "memo": [
        "Item 4: 2023-0412, FlowOn, 31 billion won",
        "Dissent -- not in the main file but 'Attachment 7', 11 pages · reported 179.6%",
        "11 items today, 60 minutes allotted",
        "5 hours 40 minutes until the committee opens"
      ],
      "choices": {
        "p3_start_ask": {
          "label": "Ask Manager Han Seoyun to read to the last page"
        },
        "p3_start_desk": {
          "label": "Leave a one-page summary at each of the nine seats"
        },
        "p3_start_rule": {
          "label": "Request in writing that the attachment become an item"
        },
        "reframe": {
          "label": "Count the dissents buried as attachments"
        }
      },
      "place": "KD Bank head office, 6th floor · Corporate Finance Strategy Team review room",
      "clock": "Thursday, April 27, 2023 · 08:20",
      "question": "Your dissent is filed as 'Attachment 7', not in the main file. What do you do before the meeting opens?",
      "lead": "On the agenda fixed at five this morning, an 11-page document has become the seventh attachment."
    },
    "p3_committee": {
      "title": "One Sentence",
      "text": "2 p.m., the Credit Committee room on the 8th floor of head office. Nine members sit at a long table; six observers sit along the wall. You have the fourth observer’s seat. The chair, Deputy President Jin Sera, calls Item 4. Manager Han Seoyun, the officer in charge, stands and reads 14 lines. The collateral structure, the revenue trend, and Article 7, which lets the bank call the loan at once if the debt crosses the threshold. She proposes a conditional approval. Jin Sera pushes up her glasses. 'Attachment 7 is marked as a dissent.' Han Seoyun bows her head once. 'It was returned at team review. It doesn’t affect the item.' Jin Sera moves to the next screen. 'A returned annexed opinion is not an agenda item. Next.' No one raises a voice, and no one looks at you. The committee clears 11 items in 47 minutes.",
      "memo": [
        "Time spent on Item 4 -- 4 min 12 sec",
        "Han Seoyun: 'It was returned at team review'",
        "Jin Sera: 'A returned annexed opinion is not an agenda item'",
        "2023-0412 approved -- 31 billion won, Article 7 included"
      ],
      "choices": {
        "p3_committee_stand": {
          "label": "Raise your hand and ask the chair for 3 minutes"
        },
        "p3_committee_record": {
          "label": "Ask that the return of Attachment 7 go in the record"
        },
        "p3_committee_after": {
          "label": "Catch Han Seoyun after the meeting and hear her reasons"
        },
        "reframe": {
          "label": "Count the dissents buried as attachments"
        },
        "p3_committee_evidence_turn": {
          "label": "Open the time Return was pressed and the call before it"
        }
      },
      "place": "KD Bank head office, 8th floor · Credit Committee room",
      "clock": "Thursday, April 27 · 14:00",
      "question": "The return took one sentence, and no one raised a voice. What do you do?",
      "lead": "Nine members at a long table, six observers along the wall. You are in the fourth chair."
    },
    "p3_corridor": {
      "title": "12 Years Ago",
      "text": "3:05 p.m., the 8th-floor corridor. The members have all left, and two fluorescent lights flicker. Manager Han Seoyun sets her tablet on the windowsill and speaks. 'I wrote one too, 12 years ago. I was twenty-nine, in my 2nd year as a reviewer. A whole branch was riding on it.' Her opinion went to the full committee and was read aloud to nine members. It was not accepted, and three months later she got a transfer order. She rotated through four branches in 3 years. 'When I came back, I had learned two things. One was how to write a document that doesn’t get returned.' She pauses. 'The other was that if you stand on the returning side, you can protect people.' Her face is not angry. It is explaining. 'There are seven people in the review room now. Three of them had babies this year. This is for your own good. Someday you’ll believe that.'",
      "memo": [
        "Han Seoyun -- wrote a dissent 12 years ago, read at full committee",
        "Branch transfer three months later, four branches over 3 years",
        "Review room staff 7 -- 3 new parents that year",
        "Her words: 'This is for your own good'"
      ],
      "choices": {
        "p3_corridor_push": {
          "label": "Set the seven aside and push to talk numbers only"
        },
        "p3_corridor_reason": {
          "label": "Ask on the spot for the reason for return in writing"
        },
        "p3_corridor_listen": {
          "label": "Stand in the corridor and hear the 3 years to the end"
        },
        "reframe": {
          "label": "Count the dissents buried as attachments"
        },
        "p3_corridor_evidence_turn": {
          "label": "Open the time Return was pressed and the call before it"
        }
      },
      "place": "Head office, 8th-floor corridor · by the window",
      "clock": "Thursday, April 27 · 15:05",
      "question": "The person who returned your dissent tells you about her own dissent 12 years ago. What do you do?",
      "lead": "In the emptied corridor, Han Seoyun lays her tablet on the windowsill and speaks first."
    },
    "p3_archive": {
      "title": "The One Who Seals",
      "text": "By the scanner, Lim Kyungsoo, head of the Corporate Credit Review Team, has his cardigan sleeves pushed up and is scanning today’s meeting printouts. He has 1 year and 2 months left before retirement, he says, though no one asked. 'In the system, a returned attachment only changes status. After 90 days it drops off the list. To find it you need the document number, and returned documents don’t get numbers. Printouts are different. A printout has to stay in this box until its retention period runs out.' He lifts the last page of your dissent and turns it over. One line is written on the back in pencil. 'Returned -- Yoon. Do not ask for reasons.' Below it, in the printed box marked 'Review Team Head comments', there are eraser marks. He covers the box with his palm. 'You only saw the front page. There’s always a back page somewhere else.'",
      "memo": [
        "System: returned attachments drop off the list after 90 days",
        "Meeting printouts -- sealed box, kept until the retention period ends",
        "Pencil note on the back page: 'Returned -- Yoon. Do not ask for reasons.'",
        "Review Team Head comments box -- eraser marks"
      ],
      "choices": {
        "p3_archive_trust": {
          "label": "Ask him to keep the back page for you"
        },
        "p3_archive_register": {
          "label": "Ask that the original, back page included, be logged"
        },
        "p3_archive_copy": {
          "label": "Copy it, back page too, before the copier shuts off"
        },
        "reframe": {
          "label": "Count the dissents buried as attachments"
        },
        "p3_archive_evidence_turn": {
          "label": "Open the time Return was pressed and the call before it"
        }
      },
      "place": "Head office, B1 · document scanning room",
      "clock": "Thursday, April 27 · 18:20",
      "question": "There is one line in pencil on the back of your dissent’s last page. What do you do with this sheet?",
      "lead": "The fluorescent lights come on row by row, and sealed retention boxes fill nine steel shelves beside the scanner."
    },
    "p3_final": {
      "title": "After the Return",
      "text": "10 p.m., two lights are still on in the 6th-floor review room. Yours and Assistant Manager Oh Jinwoo’s. He brings two cups of vending-machine coffee and sets one down. The bank’s rulebook lies open. Anyone notified of a return can file an appeal within 5 business days. The form asks for a rebuttal of the reason for return, but you never got the reason in writing, so the rebuttal box is empty. Oh Jinwoo turns the rulebook toward himself and studies it for a long time. 'I’m never late. I’ve seen what happens when you are. But today I can’t tell what counts as early.' He drinks half his coffee and puts the cup down. 'The committee record is finalized at eight-thirty tomorrow morning. Until then it’s still today. Just decide what you’ll do before today ends.'",
      "memo": [
        "Appeal deadline -- 5 business days from notice of return",
        "Rebuttal box on the form: blank, no reason received",
        "Committee record finalized: next day 08:30",
        "2 people left in the review room"
      ],
      "choices": {
        "p3_final_alone": {
          "label": "Go up to the 8th floor alone, telling no one"
        },
        "p3_final_reason": {
          "label": "Draft the appeal and a demand for reasons overnight"
        },
        "p3_final_team": {
          "label": "Tell the seven in the review room about today first"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Bank head office, 6th floor · Corporate Finance Strategy Team review room",
      "clock": "Thursday, April 27 · 22:00",
      "question": "You have been notified of the return, and you must decide what to do before today ends. What do you do?",
      "lead": "Two lights are left on the 6th floor. Yours, and Oh Jinwoo’s, with the rulebook open."
    },
    "p3_aftershock": {
      "title": "8:20 the Next Day",
      "text": "Friday, April 28, 8:20 a.m. The same paper cup lands in the same spot as yesterday. The committee record is finalized in 10 minutes. Manager Han Seoyun stands in front of your desk. Her voice is lower than yesterday. 'When you’re notified of a return, you can file an appeal within 5 business days. It’s in the rulebook. I could have told you yesterday, and I didn’t. That was my choice too.' She puts a printout of yesterday’s observer list on the corner of the desk. There is no mark next to your name. 'If you appeal, this time my name goes in the reason box. If you keep a copy, I know nothing about it. If you just accept it, in 3 years no one will remember today.' For the first time, she looks away. 'I tried all three 12 years ago. I still don’t know which was better.'",
      "memo": [
        "10 minutes until the committee record is finalized",
        "Observer list -- no mark next to your name",
        "Han Seoyun: did not tell you the appeal deadline",
        "She says she tried all three 12 years ago"
      ],
      "choices": {
        "p3_after_accept": {
          "label": "Accept the return and choose to trust Han Seoyun"
        },
        "p3_after_copy": {
          "label": "Skip the appeal and keep a copy of the returned dissent"
        },
        "p3_after_appeal": {
          "label": "Appeal today and ask for the reason head-on"
        }
      },
      "place": "KD Bank head office, 6th floor · Corporate Finance Strategy Team review room",
      "clock": "Friday, April 28 · 08:20",
      "question": "The committee record is finalized in 10 minutes. How do you begin what comes after the return?"
    },
    "p3_minutes": {
      "title": "No Annexed Opinion",
      "text": "After the meeting, when the members have left, Deputy President Jin Sera stays in her seat, leafing through the agenda. She sees you tidying the observers’ seats and waves you over. She is looking at the draft minutes, just produced. The last line under Item 4 is three words. 'No annexed opinion.' Jin Sera rests her pen tip on the line. 'What I heard in this room today was that it had been returned. Not that there was no opinion.' She puts the pen down. 'But the chair has no authority to open annexed documents herself. Only to request them, and the request must come before the meeting opens. I made no such request today.'",
      "memo": [
        "Draft minutes -- Item 4: 'No annexed opinion'",
        "Chair’s authority: request annexed documents before the meeting",
        "Jin Sera: made no such request today",
        "18 hours until the record is finalized"
      ],
      "choices": {
        "p3_minutes_choice_1": {
          "label": "Ask the deputy president to fix 'No annexed opinion'"
        },
        "p3_minutes_choice_2": {
          "label": "Ask that returned Attachment 7 go in as a footnote"
        },
        "p3_minutes_choice_3": {
          "label": "Leave the record; secure a turn to speak next meeting"
        }
      },
      "place": "Head office, 8th-floor meeting room · the chair’s seat",
      "clock": "Thursday, April 27 · 14:50",
      "question": "The last line under Item 4 in the draft minutes reads 'No annexed opinion.' What do you do?"
    },
    "p3_stairwell": {
      "title": "Window 4",
      "text": "4:20 p.m., the head office emergency stairs between the 6th and 7th floors. Your phone rings. It is Do Yoonha, the teller at Window 4, Gangseo Branch. He sounds cheerful. 'You’re the only person I know at head office. A new product showed up on this month’s sales list, and the info sheet is two pages. The front is the product name and the back is all tables.' He reads you the product code. It is a product tied to 2023-0412. The loan approved at 2 p.m. today has reached a branch counter in two hours. 'How am I supposed to explain this to customers? Selling something I don’t understand is mis-selling, right? The branch manager just says to put it on the sales board.' Somewhere below, a door opens.",
      "memo": [
        "Gangseo Branch counter sales begin -- 2 hours after approval",
        "Info sheet 2 pages, back page all tables",
        "Do Yoonha: doesn’t know what the product is",
        "New line added to the branch sales board"
      ],
      "choices": {
        "p3_stairwell_choice_2": {
          "label": "Formally ask head office for the counter info sheet"
        },
        "p3_stairwell_choice_1": {
          "label": "Tell him everything you know over the phone"
        },
        "p3_stairwell_choice_3": {
          "label": "Say nothing is final, promise to explain later, hang up"
        }
      },
      "place": "Head office emergency stairs · between the 6th and 7th floors",
      "clock": "Thursday, April 27 · 16:20",
      "question": "The loan approved today has reached a branch counter in two hours. How do you answer?"
    },
    "p3_boiler": {
      "title": "The Man Who Draws Your Seat",
      "text": "9 p.m., the team head’s office on the 6th floor. Yoon Sanghyuk, head of the Corporate Finance Strategy Team, waits for you with the blinds half drawn. He does not scold you for today. Instead he takes out a sheet of paper and sketches your future. It is about an analysis unit to be set up next year. It has no name yet and no people yet, he says; there are four seats, and one of them is empty. 'I never said your judgment was wrong. But I decide where that judgment gets to sit.' He closes his tablet. The speed of it is the answer. Before it closes, the first page on the screen shows an empty signature line. As you turn to go, he adds one thing. 'What did Manager Han tell you today? That it was for your own good? She believes that. People who believe have it easy.'",
      "memo": [
        "Analysis unit planned for next year -- 1 of 4 seats empty",
        "Yoon Sanghyuk’s tablet, first screen -- signature line empty",
        "His words: 'I decide where that judgment gets to sit'",
        "Meeting length 9 minutes"
      ],
      "choices": {
        "p3_boiler_choice_1": {
          "label": "Skip the seat talk and ask why it was returned"
        },
        "p3_boiler_choice_2": {
          "label": "Ask for the offer’s terms and timeline in writing"
        },
        "p3_boiler_choice_3": {
          "label": "Hold on to the seat offer for now and buy time"
        }
      },
      "place": "Head office, 6th floor, Team Head’s office",
      "clock": "Thursday, April 27 · 21:00",
      "question": "Instead of scolding you, the team head sketches a seat that will exist next year. What do you do?"
    },
    "p3_minutes_reaction": {
      "title": "Two Lines Under 179.6",
      "text": "Leaving the meeting room, you run into one of the observers at the vending machine in the corridor. It is Ban Jaewook, an investigator in his 17th year with Internal Audit. He holds open a black notebook with a worn cover. On the page that begins '2023-0412 -- 179.6' there is today’s date and two new lines. 'Item 4, 4 min 12 sec', and 'No annexed opinion -- heard it was returned'. He stops his pen and looks at you. 'I wasn’t here for an audit today. I sat in by rotation. So I have no authority at all.' He closes the notebook and opens it again. 'But writing things down isn’t authority, it’s habit. That Attachment 7, by the way. How many pages was it? I’d like to note the page count.'",
      "memo": [
        "Ban Jaewook’s notebook, 2023-0412 page -- 'Item 4, 4 min 12 sec'",
        "Attachment 7 page count: 11 pages"
      ],
      "choices": {
        "p3_minutes_reaction_choice_2": {
          "label": "Ask if he could confirm the noted times later"
        },
        "p3_minutes_reaction_choice_3": {
          "label": "Say nothing good comes of Audit, and walk off"
        },
        "p3_minutes_reaction_choice_1": {
          "label": "Tell Ban Jaewook exactly what you saw in the meeting"
        }
      },
      "place": "Head office, 8th-floor corridor · by the vending machine",
      "clock": "Thursday, April 27 · 15:00",
      "question": "The Internal Audit investigator wants to note Attachment 7’s page count. How do you answer?"
    },
    "p3_stairwell_reaction": {
      "title": "An Approval One Day Late",
      "text": "You hang up and climb the stairs, and Assistant Manager Oh Jinwoo is standing at the 7th-floor door. He doesn’t say how much of the call he heard. Instead he brings up something he told you before. 'Remember what I said about my father? That he sent one file up a day late. Just one day.' He rubs the stair rail with his palm. 'Because of that one day, another bank took the client, and that winter he was moved to a management desk over three branches. He stayed there 5 years and quit. I was in high school then.' He starts to smile and stops. 'So I’m never late. But today I see that being fast gets returned too.'",
      "memo": [
        "Oh Sangchul -- the branch manager who delayed an approval one day",
        "Moved to a management desk that winter, retired 5 years later"
      ],
      "choices": {
        "p3_stairwell_reaction_choice_2": {
          "label": "Suggest you both put today’s return on record"
        },
        "p3_stairwell_reaction_choice_3": {
          "label": "Draw a line: that story has nothing to do with today"
        },
        "p3_stairwell_reaction_choice_1": {
          "label": "Hear out his father’s story and leave work together"
        }
      },
      "place": "Head office emergency stairs · at the 7th-floor door",
      "clock": "Thursday, April 27 · 16:40",
      "question": "Your mentor tells you how one late approval pushed his father out. What do you do?"
    },
    "p3_boiler_reaction": {
      "title": "The Cardigan Pocket",
      "text": "9:40 p.m. Coming down from the team head’s office, you pass B1 and find the scanning room door still open. Team Head Lim Kyungsoo is putting sealing tape on today’s retention box. He signs across the tape and lifts the box onto the seventh shelf. Then he picks up one printout left on the table and folds it in half. It is the last page of your dissent, the sheet with the pencil line on the back. He slips it into the inside pocket of his cardigan. Only then does he see you standing there. He is not startled. 'In 90 days this attachment drops off the system list. When a document isn’t on the list, no one notices if one sheet goes missing from the box.' He takes off his glasses and wipes them. 'That’s why this one sheet can’t stay here.'",
      "memo": [
        "Lim Kyungsoo put the back page in his cardigan’s inside pocket",
        "'When a document isn’t on the list, no one notices one sheet missing'"
      ],
      "choices": {
        "p3_boiler_reaction_choice_3": {
          "label": "Pretend you saw nothing and quietly go upstairs"
        },
        "p3_boiler_reaction_choice_1": {
          "label": "Ask him right there why he is taking that sheet"
        },
        "p3_boiler_reaction_choice_2": {
          "label": "Ask him to enter what he took in the removal log"
        }
      },
      "place": "Head office, B1 · document scanning room · at the door",
      "clock": "Thursday, April 27 · 21:40",
      "question": "You saw Lim Kyungsoo fold the back page and put it in his inside pocket. What do you do?"
    },
    "p3_branch_closed": {
      "title": "The Closed Branch",
      "text": "When you have heard the 3 years out in the corridor, Manager Han Seoyun takes out her car keys. 'It’ll only take 30 minutes. There’s something I want to show you.' Yeonhui-dong, Seodaemun-gu, the corner of a narrow three-way junction. This is where KD Bank’s Yeonhui-dong Branch stood, the branch she tried to save 12 years ago. Now the 1st floor is a convenience store and the 2nd floor a self-service laundry. Where the bank’s sign hung, six bolt holes remain. Han Seoyun looks up at them. 'My opinion was read at the full committee back then. In front of nine members. They heard it all and approved anyway. I thought being read meant winning. It only got read.' The convenience store’s glass door opens, and the night clerk steps out for a cigarette. 'There were 14 of us at this branch. I’m the only one still at the bank.'",
      "memo": [
        "KD Bank Yeonhui-dong Branch -- closed 12 years ago",
        "Now: convenience store on the 1st floor, self-service laundry on the 2nd",
        "Of 14 staff then, 1 still at the bank",
        "Han Seoyun’s opinion -- read at full committee, then approved"
      ],
      "choices": {
        "p3_branch_closed_b": {
          "label": "Ask where that dissent from 12 years ago is kept"
        },
        "p3_branch_closed_c": {
          "label": "Say enough about the past and return to today’s case"
        },
        "p3_branch_closed_a": {
          "label": "Count together where those 14 people are now"
        }
      },
      "place": "Three-way junction, Yeonhui-dong, Seodaemun-gu · former KD Bank Yeonhui-dong Branch",
      "clock": "Thursday, April 27 · 15:35",
      "question": "Only bolt holes remain where the branch she tried to save 12 years ago stood. What do you do?"
    },
    "p3_branch_closed_follow": {
      "title": "The Folded Copy",
      "text": "Back in the car, before she starts the engine, Manager Han Seoyun opens the glove box. From the back she takes out a sheaf of paper folded in four. It is a copy of her own dissent from 12 years ago. The folds have worn white, and a few letters are broken. 'I’ve changed cars three times in 12 years, and I kept moving this. I don’t know why either.' She unfolds the first page to show you. A red pen line runs through the conclusion paragraph. She drew it herself, later. 'This is where I went wrong. I was too sure of myself here. That’s why it didn’t land.' She folds the paper again. 'Your dissent has the same spot. I was trying to fix it for you. A return gives you time to fix things.' She says this, then goes quiet for a moment, like someone hearing her own words a second time.",
      "memo": [
        "Copy from 12 years ago -- folded in four, kept in the car",
        "Red line she drew through the conclusion paragraph",
        "Her reading: 'I was too sure, so it didn’t land'",
        "28 minutes from Yeonhui-dong to head office"
      ],
      "choices": {
        "p3_branch_closed_follow_c": {
          "label": "Hand the copy back: if it was time to fix, give reasons"
        },
        "p3_branch_closed_follow_a": {
          "label": "Tell her right there that certainty wasn’t the problem"
        },
        "p3_branch_closed_follow_b": {
          "label": "Ask to read her copy side by side with today’s"
        }
      },
      "place": "Three-way junction, Yeonhui-dong · in the car",
      "clock": "Thursday, April 27 · 15:50",
      "question": "On the copy folded in four from 12 years ago is a red line she drew herself. What do you do?"
    },
    "p3_route_system": {
      "title": "34 Binders",
      "text": "Instead of looking for a way to get Attachment 7 read, you ask how many dissents have been annexed like this over the years. In the B1 document scanning room, Lim Kyungsoo, head of the Corporate Credit Review Team, points to the binders on the bottom shelf. In the past 10 years, 34 dissents went to the Credit Committee as annexes. He counts them, touching each binder. Only 2 were actually read at the full committee; all the rest came back at team review. Then he pulls up old personnel notices on the intranet and tells you one more thing. Most of the people who wrote the returned dissents left head office before long, and those who stayed hardly ever wrote a dissent again. 'If this were written in the rules, people would be angry. Since it isn’t, nobody is. The numbers are only here, in these binders.'",
      "memo": [
        "34 annexed dissents in 10 years",
        "Read at full committee 2 -- returned at team stage 32",
        "26 of the 32 left head office within 2 years",
        "4 of the remaining 6: 0 dissents afterward"
      ],
      "choices": {
        "p3_route_system_list": {
          "label": "List all 34 in a document and file it with the committee"
        },
        "p3_route_system_find": {
          "label": "Find the 26 who left and hear what happened then"
        },
        "p3_route_system_keep": {
          "label": "Put the numbers away and use them for your case only"
        },
        "p3_route_system_evidence_turn": {
          "label": "Open the time Return was pressed and the call before it"
        }
      },
      "place": "Head office, B1 · document scanning room · bottom shelf",
      "clock": "Thursday, April 27",
      "question": "Of 34 annexed dissents in 10 years, 32 came back at the team stage. What do you do?"
    },
    "p3_final_system_route": {
      "title": "The 35th Binder",
      "text": "Seven in the evening. The 34 binders go back into place on the bottom shelf of the scanning room. Attachment 7 was not read at today’s committee, and the 31 billion won was approved. Team Head Lim puts an empty binder and a roll of sealing tape next to the printout of your dissent. The committee record is finalized at eight-thirty tomorrow morning. 'Seal this and it’s the 35th. Sealing is my job. What you do before it’s sealed is yours.' He does not apply the tape. He waits.",
      "memo": [
        "34 annexed dissents in 10 years -- 2 read at full committee",
        "Attachment 7: not yet sealed",
        "Committee record finalized: next day 08:30"
      ],
      "choices": {
        "p3_final_system_route_c": {
          "label": "Send these numbers first to the authors of the 32"
        },
        "p3_final_system_route_b": {
          "label": "Leave the rule; find a way to resubmit Attachment 7"
        },
        "p3_final_system_route_a": {
          "label": "Propose that annexed dissents be read at full committee"
        }
      },
      "place": "Head office, B1 · document scanning room · bottom shelf",
      "clock": "Thursday, April 27 · 19:00",
      "question": "Lim Kyungsoo waits without applying the tape. What do you do before it becomes the 35th binder?"
    },
    "p3_evidence_turn": {
      "title": "28 Minutes",
      "text": "When you fit the clue into the meeting timetable, Internal Audit investigator Ban Jaewook hands you a processing log he printed with his observer access. Attachment 7 was returned 28 minutes before the committee opened. Right above it is one line from the internal phone log. An 11-minute call from the extension in the team head’s office on the 6th floor to Manager Han Seoyun’s desk. Ban Jaewook checks his watch. 'Return was pressed the moment the call ended. That’s not enough time to read an eleven-page document.' He writes the two times in his notebook and draws an arrow between them. 'Whatever Manager Han says about her situation, that’s her motive, not the stated reason. The reason is inside these 11 minutes.' Then he reads a line he copied into his notebook. The pencil line from the back of your dissent’s last page, which he saw while collecting the meeting papers. 'Returned -- Yoon. Do not ask for reasons. This isn’t Manager Han’s handwriting.'",
      "memo": [
        "Attachment 7 returned: 13:32 -- 28 minutes before the meeting",
        "Call just before: 13:21, team head’s extension to Han Seoyun’s desk, 11 min",
        "Pencil on the back page -- not Han Seoyun’s handwriting"
      ],
      "choices": {
        "p3_evidence_turn_file": {
          "label": "Attach both times and the call log to the appeal"
        },
        "p3_evidence_turn_ask": {
          "label": "Ask Han Seoyun what she was told in those 11 minutes"
        },
        "p3_evidence_turn_hold": {
          "label": "Hold the log and show it first where it counts"
        }
      },
      "place": "Head office, 8th-floor corridor · log printer",
      "clock": "Thursday, April 27 · 19:40",
      "question": "Return was pressed the moment an 11-minute call ended. How do you use this log?"
    },
    "p3_start_alone": {
      "title": "An Attachment with One Name",
      "text": "In the end you filled the signature line alone. One name at the end of 11 pages. On the agenda posted at five this morning, the document has become 'Attachment 7', and the author box holds only your name. 8:20 a.m. When you open the review room door, no one looks up from their screens. They have all seen it already. Assistant Manager Oh Jinwoo brings two paper cups, sets one down, and lowers his voice. 'Last night the team brought it up twice, that this one has a single name on it. Some of them meant it kindly.' He points to the fourth line of the agenda. 'With one name, one return finishes it. That’s the cheapest way for them.'",
      "memo": [
        "Attachment 7 authors -- 1",
        "Mentioned in the team last night 2 times",
        "Estimated time for Item 4: 5 minutes",
        "5 hours 40 minutes until the meeting"
      ],
      "choices": {
        "p3_start_alone_desk": {
          "label": "Leave a one-page summary at each of the nine seats"
        },
        "p3_start_alone_ask": {
          "label": "Ask Manager Han Seoyun to read to the last page"
        },
        "p3_start_alone_signature": {
          "label": "Take the one-name document up to the 8th floor first"
        },
        "p3_start_alone_rule": {
          "label": "Request in writing that the attachment become an item"
        },
        "p3_start_alone_reframe": {
          "label": "Count the dissents buried as attachments"
        }
      },
      "place": "KD Bank head office, 6th floor · Corporate Finance Strategy Team review room",
      "clock": "Thursday, April 27, 2023 · 08:20",
      "question": "Attachment 7’s author box holds only one name. What do you do before the meeting opens?",
      "lead": "The morning your solo-signed document reaches the agenda, everyone in the review room has already read it."
    },
    "p3_start_shared": {
      "title": "The Names That Got Calls All Night",
      "text": "On Friday you attached a list of co-signers to the dissent you had already filed. Four people signed, you included. From one in the morning, three of those four got calls, one after another. The callers were different; the message was nearly the same. Take your name off now and it never happened. 8:20 a.m. When you walk into the review room, the three are at their desks, eyes on their screens. The fourth has not come in yet. Assistant Manager Oh Jinwoo sets down a paper cup. 'Three calls overnight means they read this document. If they hadn’t, there’d be no reason to call.' He almost laughs, then stops. 'They read it, and it’s still just an attachment on today’s agenda.'",
      "memo": [
        "4 co-signers -- 3 got calls before dawn",
        "Message: take your name off and it never happened",
        "1 not yet at work",
        "5 hours 40 minutes until the meeting"
      ],
      "choices": {
        "p3_start_shared_ask": {
          "label": "Ask Manager Han Seoyun to read to the last page"
        },
        "p3_start_shared_signature": {
          "label": "Gather the three who got calls and talk first"
        },
        "p3_start_shared_desk": {
          "label": "Leave a one-page summary at each of the nine seats"
        },
        "p3_start_shared_rule": {
          "label": "Request in writing that the attachment become an item"
        },
        "p3_start_shared_reframe": {
          "label": "Count the dissents buried as attachments"
        }
      },
      "place": "KD Bank head office, 6th floor · Corporate Finance Strategy Team review room",
      "clock": "Thursday, April 27, 2023 · 08:20",
      "question": "Three co-signers got calls before dawn. What do you do before the meeting opens?",
      "lead": "Four people signed the document, and from one in the morning, three calls went out."
    },
    "p3_start_soften": {
      "title": "A Sentence That Doesn’t Read as Dissent",
      "text": "On the last night you rewrote the conclusion paragraph. 'This must not be approved' became 'This can be approved if the conditions are met', and the figure 179.6% moved from the body to a footnote. On the agenda posted before dawn, Attachment 7 is titled 'Approvable if conditions are met'. The title does not say dissent; that word survives only, in small type, in the filing category box. 8:20 a.m. Assistant Manager Oh Jinwoo looks from the agenda to your screen and back. 'Going by the title, this looks like a supporting document.' He sets down a paper cup. 'They teach you that if you write softly, you won’t get caught. That’s true, you won’t. But a document that doesn’t get caught doesn’t get read.' The review room phone rings once and stops.",
      "memo": [
        "Attachment 7 title: 'Approvable if conditions are met'",
        "Conclusion paragraph -- changed to 'can be approved if the conditions are met'",
        "179.6% -- moved from the body to a footnote",
        "5 hours 40 minutes until the meeting"
      ],
      "choices": {
        "p3_start_soften_rule": {
          "label": "Request in writing that the attachment become an item"
        },
        "p3_start_soften_desk": {
          "label": "Leave a one-page summary at each of the nine seats"
        },
        "p3_start_soften_signature": {
          "label": "Ask to change the title back to 'Dissent' first"
        },
        "p3_start_soften_ask": {
          "label": "Ask Manager Han Seoyun to read to the last page"
        },
        "p3_start_soften_reframe": {
          "label": "Count the dissents buried as attachments"
        }
      },
      "place": "KD Bank head office, 6th floor · Corporate Finance Strategy Team review room",
      "clock": "Thursday, April 27, 2023 · 08:20",
      "question": "Attachment 7 went up titled 'Approvable if conditions are met'. What do you do before the meeting opens?",
      "lead": "The softened conclusion changed even the title, and the word dissent survives only in the filing category box."
    }
  },
  "echoReplies": {
    "p3_start_ask": "When you ask, Han Seoyun answers, 'I’ve read it.' She does not say how many pages.",
    "p3_start_rule": "The rules have a procedure. To move an annexed document into the main agenda, the manager in charge must first attach review comments.",
    "p3_start_desk": "The summary lands at all nine seats. Just before the meeting opens, the clerk collects seven of them. They are not meeting materials, the clerk says.",
    "p3_committee_after": "When you decide to catch her, Han Seoyun is already waiting in the corridor. She expected this conversation today.",
    "p3_committee_record": "When you ask, the clerk looks at the chair. 3 seconds later Jin Sera says, 'Note it.' For those 3 seconds, no one moves.",
    "p3_committee_stand": "When you raise your hand, the room goes quiet. Jin Sera says, 'Observers speak only when a member asks,' and no member asks.",
    "p3_corridor_listen": "You hear her out, and Han Seoyun’s story takes 20 minutes. When she finishes, she says, 'I’ve never told anyone this.'",
    "p3_corridor_reason": "When you ask for it in writing, she smiles briefly. 'If I write a statement of reasons, my name stays on it. If you still want it, I’ll write it.'",
    "p3_corridor_push": "When you ask to talk only numbers, Han Seoyun nods. Then she answers only in numbers. Of the 11 pages, she read one.",
    "p3_archive_trust": "When you ask, Lim Kyungsoo stops wiping his glasses and looks at you. 'I’ve been told to take charge of things for years. This is the first time anyone’s asked me to keep something for them.'",
    "p3_archive_register": "Once it is on the formal list, the original is protected. But the eraser marks in the Review Team Head comments box go on the list with it.",
    "p3_archive_copy": "The copying takes 6 minutes. The copier keeps a usage log, and the log goes to the management department the next morning.",
    "p3_final_team": "Once you decide to tell them, you write out today exactly as it happened and send it, even to those who have gone home. Four of the seven read to the end and reply; three leave only a read receipt.",
    "p3_final_reason": "The documents are done at four in the morning. The rebuttal box stays empty to the end, because no one has given you the reason for return yet.",
    "p3_final_alone": "When you decide to go alone, Oh Jinwoo stacks the two paper cups, throws them out, and leaves first. He doesn’t turn off the light on his way out.",
    "p3_after_appeal": "When you appeal, the form is accepted. Han Seoyun’s name goes in the reason box, and the papers pass once through the 6th floor and once through the 8th.",
    "p3_after_copy": "When you keep a copy, nothing happens today. Nothing happening is the price of this choice.",
    "p3_after_accept": "When you accept, Han Seoyun doesn’t thank you. Instead, that evening she orders dinner for all seven in the review room.",
    "p3_minutes_choice_1": "When you speak, Jin Sera picks up her pen again. She leaves the three words as they are and draws one question mark beside them.",
    "p3_minutes_choice_2": "With the footnote, Attachment 7 goes from 'never existed' to 'returned'. The name of the person who returned it goes into the footnote too.",
    "p3_minutes_choice_3": "You get the promise. The next meeting is May 25, and 2023-0412 will be disbursed before then.",
    "p3_stairwell_choice_1": "When you tell him everything, Do Yoonha is quiet for a long time. Then he asks, 'So how many of these did I sell today?'",
    "p3_stairwell_choice_2": "Once the request goes in, the info sheet gets made. The department making it is the same one that designed the product.",
    "p3_stairwell_choice_3": "After you hang up, it is quiet. By that evening, four more sales go up on the Gangseo Branch sales board.",
    "p3_boiler_choice_1": "When you ask, Yoon Sanghyuk smiles for the first time. 'Ask for a reason and a reason appears. Would that be good for you?'",
    "p3_boiler_choice_2": "When you ask for it in writing, he picks up his pen and puts it down. 'It’s a unit with no name yet. Nothing without a name gets put in writing.'",
    "p3_boiler_choice_3": "You hold on to the offer, and that night the signature line on his tablet is still empty. Empty boxes get filled later.",
    "p3_minutes_reaction_choice_1": "When you tell him, Ban Jaewook writes down the number 11. Below it he adds, 'The page count stays; the content doesn’t.'",
    "p3_minutes_reaction_choice_2": "When you ask, he checks the times in his notebook against his watch. 'I’ll be carrying the same notebook 3 years from now.'",
    "p3_minutes_reaction_choice_3": "When you walk off, Ban Jaewook closes his notebook without a word. He does not erase the two lines he wrote today.",
    "p3_stairwell_reaction_choice_1": "You leave together, and on the walk to the subway station Oh Jinwoo brings up his father twice more. Neither time does he finish the story.",
    "p3_stairwell_reaction_choice_2": "When you suggest writing it down together, he hesitates a long time, then signs his name on the second line. He leaves the first line blank.",
    "p3_stairwell_reaction_choice_3": "When you draw the line, Oh Jinwoo says, 'Right,' and goes up first. He doesn’t mention his father again that day.",
    "p3_boiler_reaction_choice_1": "When you ask, Lim Kyungsoo puts his glasses back on. 'Someday you’ll come looking for it. Wouldn’t it be a problem if it weren’t there?'",
    "p3_boiler_reaction_choice_2": "Once it is in the log, the sheet’s whereabouts are on record. But whoever reads the log will also know where the sheet is.",
    "p3_boiler_reaction_choice_3": "When you go upstairs, that sheet exists in no record anywhere. Two people now know where it is.",
    "p3_branch_closed_a": "Counting together, you come up with names for 9 of the 14. Han Seoyun doesn’t know the other five either.",
    "p3_branch_closed_b": "When you ask, she is silent for a moment. 'It can’t be kept anywhere. Documents that were read and done with don’t get numbers.'",
    "p3_branch_closed_c": "When you ask to go back, the car goes quiet. Han Seoyun says not a word for the 28 minutes back to head office.",
    "p3_branch_closed_follow_a": "When you tell her, Han Seoyun starts to unfold the paper again and stops. 'No one has said that to me in 12 years.'",
    "p3_branch_closed_follow_b": "Side by side, the two conclusion paragraphs are nearly the same sentence. In 12 years only the amount and the company name have changed.",
    "p3_branch_closed_follow_c": "When you hand it back, she puts the copy back in the glove box and locks it. No statement of reasons arrives that night.",
    "p3_route_system_list": "Once the list goes in, it is accepted. Compiling the 34 takes ten days, and 2023-0412 is disbursed in the meantime.",
    "p3_route_system_find": "When you go looking, 9 of the 26 agree to meet. Two of them learn only today that their dissents still exist somewhere.",
    "p3_route_system_keep": "Put away, the numbers stay in the binders. Next year someone will make the 35th binder.",
    "p3_final_system_route_a": "Once the rule exists, the next annexed opinion gets read. Getting approved after being read still happens, as before.",
    "p3_final_system_route_b": "Resubmit only Attachment 7 and today’s survives. The other 32 still have no numbers today.",
    "p3_final_system_route_c": "When you send the numbers, the 32 learn of each other for the first time. The replies take years to come.",
    "p3_evidence_turn_ask": "When you ask, Han Seoyun doesn’t answer for a long time. Then she takes out her phone, glances at the screen, and puts it away.",
    "p3_evidence_turn_file": "Once attached, the appeal carries the two times side by side. The first office to receive it is the team head’s office on the 6th floor.",
    "p3_evidence_turn_hold": "While you hold it, today stays quiet. Those 11 minutes are deleted from the call log automatically in 1 year.",
    "p3_committee_evidence_turn": "Laid out in time order, the moment Return was pressed shows up. The time a decision was made and the time it was announced can differ.",
    "p3_corridor_evidence_turn": "Laid out in time order, the moment Return was pressed shows up. The time a decision was made and the time it was announced can differ.",
    "p3_archive_evidence_turn": "Laid out in time order, the moment Return was pressed shows up. The time a decision was made and the time it was announced can differ.",
    "p3_route_system_evidence_turn": "Laid out in time order, the moment Return was pressed shows up. The time a decision was made and the time it was announced can differ.",
    "prologue03_memory_system": "If you look, they are there. You are the first to count the same clause, but the binders holding returned dissents number thirty-four on the bottom shelf.",
    "prologue03_memory_evidence": "Match the employee numbers in the circulation sign-off boxes to the return log, and one time emerges. Earlier than the meeting, and too short to read 11 pages.",
    "p3_start_alone_ask": "When you ask, Han Seoyun answers, 'I’ve read it.' She does not say how many pages.",
    "p3_start_alone_rule": "The rules have a procedure. To move an annexed document into the main agenda, the manager in charge must first attach review comments.",
    "p3_start_alone_desk": "The summary lands at all nine seats. Just before the meeting opens, the clerk collects seven of them. They are not meeting materials, the clerk says.",
    "p3_start_alone_signature": "When you go up, the meeting room is still locked. Today’s 11 items are posted on the board by the door, and the fourth line already has a pencil mark beside it.",
    "p3_start_shared_ask": "When you ask, Han Seoyun answers, 'I’ve read it.' She does not say how many pages.",
    "p3_start_shared_rule": "The rules have a procedure. To move an annexed document into the main agenda, the manager in charge must first attach review comments.",
    "p3_start_shared_desk": "The summary lands at all nine seats. Just before the meeting opens, the clerk collects seven of them. They are not meeting materials, the clerk says.",
    "p3_start_shared_signature": "Gathered, all three say the same thing. 'I won’t take my name off.' And none of the three says who called.",
    "p3_start_soften_ask": "When you ask, Han Seoyun answers, 'I’ve read it.' She does not say how many pages.",
    "p3_start_soften_rule": "The rules have a procedure. To move an annexed document into the main agenda, the manager in charge must first attach review comments.",
    "p3_start_soften_desk": "The summary lands at all nine seats. Just before the meeting opens, the clerk collects seven of them. They are not meeting materials, the clerk says.",
    "p3_start_soften_signature": "The request is accepted. The clerk tells you the agenda was fixed at five this morning, and title changes take effect from the next meeting."
  },
  "choiceVoiceLines": {
    "p3_start_ask": "As an attachment it won’t be read in the meeting, so you ask Manager Han Seoyun yourself to read it to the last page.",
    "p3_start_rule": "So as not to rely on anyone’s goodwill, you find the procedure for moving an attachment into the main agenda and request it in writing.",
    "p3_start_desk": "No one will have time to flip to the attachments, so before the meeting you leave a one-page summary at each of the nine members’ seats.",
    "p3_committee_after": "This is not worth stopping the meeting over, so you decide to catch Han Seoyun afterward and hear her reasons first.",
    "p3_committee_record": "So the document doesn’t become one that never existed, you ask on the spot that the return of Attachment 7 go in the meeting record.",
    "p3_committee_stand": "Once they move to the next item it’s over, so from the observers’ seats you raise your hand and ask the chair for 3 minutes.",
    "p3_corridor_listen": "If this is explanation and not anger, it deserves a hearing, so you stand in the corridor and hear her 3 years to the end.",
    "p3_corridor_reason": "There is no rebutting “it’s for your own good”, so you ask on the spot for the reason for return in writing.",
    "p3_corridor_push": "Circumstances bury numbers, so you set the story of the seven aside and push to talk about the numbers only.",
    "p3_archive_trust": "In your hands it could be taken from you, so you ask him to keep the back page for you, sir.",
    "p3_archive_register": "So it is in the box whoever comes looking, you ask that the original, back page included, go on the formal retention list.",
    "p3_archive_copy": "A pencil line is gone with one eraser, so before the copier shuts off you copy everything, back page too, and take it out tonight.",
    "p3_final_team": "Before the people in your own room hear it from someone else, you tell the seven in the review room exactly what happened today.",
    "p3_final_reason": "The empty rebuttal box comes first, so you stay up all night drafting the appeal and a demand for the reason for return.",
    "p3_final_alone": "So no one else gets hurt with you, you tell no one and decide to go up to the 8th floor alone tomorrow morning.",
    "p3_after_appeal": "You can’t let no one remember this in 3 years, so you file an appeal today and ask for the reason for return head-on.",
    "p3_after_copy": "So today survives without putting her name in the reason box, you skip the appeal and keep one copy of the returned dissent aside.",
    "p3_after_accept": "It is the judgment of someone who went through this 12 years before you, so you accept the return and choose to trust Han Seoyun.",
    "p3_minutes_choice_1": "Saying it was returned is not saying there was no opinion, so you ask the deputy president yourself to fix those three words, 'No annexed opinion'.",
    "p3_minutes_choice_2": "Even if the three words can’t be fixed, a trace should remain, so you ask that the returned Attachment 7 be noted in the record as a footnote.",
    "p3_minutes_choice_3": "The next meeting matters more than the last one, so you leave the record alone and secure a turn to speak at the next meeting first.",
    "p3_stairwell_choice_1": "You can’t let him sell what he doesn’t understand, so you tell him everything you know over the phone, leaving nothing out.",
    "p3_stairwell_choice_2": "This can’t be one window’s problem, so you formally ask head office for the product info sheet that goes to the counters.",
    "p3_stairwell_choice_3": "The word of someone just returned shouldn’t reach a counter, so you say nothing is final, promise to explain later, and hang up.",
    "p3_boiler_choice_1": "Before the picture of your future covers up today, you set the seat talk aside and ask first why your dissent was returned.",
    "p3_boiler_choice_2": "The unit has no name and no people yet, so you ask for the offer’s terms and timeline in writing.",
    "p3_boiler_choice_3": "Refuse now and every road closes, so you hold on to the seat offer for now and buy time.",
    "p3_minutes_reaction_choice_1": "There is no reason to hide anything from a man who writes things down, so you tell Ban Jaewook exactly what you saw in the meeting.",
    "p3_minutes_reaction_choice_2": "Even without authority, someone has to have seen it, so you ask if he could confirm the times in his notebook later.",
    "p3_minutes_reaction_choice_3": "On the day you were returned you don’t want to end up in anyone’s notebook too, so you say nothing good comes of Audit and walk off.",
    "p3_stairwell_reaction_choice_1": "Not wanting to leave that half-smile alone, you hear his father’s story to the end and leave work with him today.",
    "p3_stairwell_reaction_choice_2": "Written alone, it stays one person’s word, so you suggest the two of you put today’s return on record together.",
    "p3_stairwell_reaction_choice_3": "This is no time to carry other people’s troubles too, so you draw a line and say that story has nothing to do with today.",
    "p3_boiler_reaction_choice_1": "You need to know whether he is guarding it or getting rid of it, so you ask him right there why he is taking that sheet.",
    "p3_boiler_reaction_choice_2": "So even a sheet in a pocket leaves a trail, you ask him to enter what he took in the removal log.",
    "p3_boiler_reaction_choice_3": "The fewer who know, the safer the sheet, so you pretend you saw nothing and quietly go upstairs.",
    "p3_branch_closed_a": "To help the one who stayed with her count, you work out together where those 14 people are now.",
    "p3_branch_closed_b": "A document that was only read should still survive, so you ask where that dissent from 12 years ago is kept.",
    "p3_branch_closed_c": "Bolt holes are no answer to today’s return, so you say enough about the past and steer back to today’s case.",
    "p3_branch_closed_follow_a": "It seems she has been drawing that red line alone for 12 years, so you tell her right there that certainty was not the problem.",
    "p3_branch_closed_follow_b": "You only see what matches by looking together, so you ask to lay her copy beside today’s and read them side by side.",
    "p3_branch_closed_follow_c": "You still haven’t been told what to fix, so you hand the copy back: if this was time to fix it, give the reasons.",
    "p3_route_system_list": "You decide to bring the numbers out of the binders, so you compile the 34 into a document and formally file it with the committee.",
    "p3_route_system_find": "Those people’s words come before the numbers, so you find the 26 who left head office and hear what happened back then.",
    "p3_route_system_keep": "You don’t have the strength to carry 10 years of it, so you put the numbers away and use them for your own case only.",
    "p3_final_system_route_a": "So the next dissent isn’t buried in a binder again, you propose a rule that annexed dissents must be read at the full committee.",
    "p3_final_system_route_b": "Before eight-thirty tomorrow there is time for only one thing, so you leave the rule and look for a way to resubmit your Attachment 7.",
    "p3_final_system_route_c": "They need to know they weren’t alone in this, so you send these numbers first to the authors of the 32 returned dissents.",
    "p3_evidence_turn_ask": "Not wanting to judge a person by a log alone, you ask Han Seoyun yourself what she was told in those 11 minutes.",
    "p3_evidence_turn_file": "The reason is inside those 11 minutes, so you attach both times and the call log to the appeal as they are.",
    "p3_evidence_turn_hold": "Show it first and it gets erased first, so you hold the log and bring it out for the first time where it counts.",
    "p3_committee_evidence_turn": "You spread out the return log, lay the clues in time order, and work out what time that one sentence was made.",
    "p3_corridor_evidence_turn": "You spread out the return log, lay the clues in time order, and work out what time that one sentence was made.",
    "p3_archive_evidence_turn": "You spread out the return log, lay the clues in time order, and work out what time that one sentence was made.",
    "p3_route_system_evidence_turn": "You spread out the return log, lay the clues in time order, and work out what time that one sentence was made.",
    "p3_start_alone_ask": "As an attachment it won’t be read in the meeting, so you ask Manager Han Seoyun yourself to read it to the last page.",
    "p3_start_alone_rule": "So as not to rely on anyone’s goodwill, you find the procedure for moving an attachment into the main agenda and request it in writing.",
    "p3_start_alone_desk": "No one will have time to flip to the attachments, so before the meeting you leave a one-page summary at each of the nine members’ seats.",
    "p3_start_alone_signature": "To show that one name is not a weakness, you take the one-name document as it is and go up to the 8th floor first.",
    "p3_start_shared_ask": "As an attachment it won’t be read in the meeting, so you ask Manager Han Seoyun yourself to read it to the last page.",
    "p3_start_shared_rule": "So as not to rely on anyone’s goodwill, you find the procedure for moving an attachment into the main agenda and request it in writing.",
    "p3_start_shared_desk": "No one will have time to flip to the attachments, so before the meeting you leave a one-page summary at each of the nine members’ seats.",
    "p3_start_shared_signature": "The people are wavering before the document is, so you first gather the three who got calls overnight and talk.",
    "p3_start_soften_ask": "As an attachment it won’t be read in the meeting, so you ask Manager Han Seoyun yourself to read it to the last page.",
    "p3_start_soften_rule": "So as not to rely on anyone’s goodwill, you find the procedure for moving an attachment into the main agenda and request it in writing.",
    "p3_start_soften_desk": "No one will have time to flip to the attachments, so before the meeting you leave a one-page summary at each of the nine members’ seats.",
    "p3_start_soften_signature": "He is right that a document that doesn’t get caught doesn’t get read, so this morning you ask to change the title back to 'Dissent' first."
  },
  "pack": {
    "clue": {
      "title": "Returned at 28 Minutes",
      "text": "Attachment 7 was returned at 13:32, 28 minutes before the committee opened. Right up to that moment, an 11-minute call had been running from the extension in the team head’s office on the 6th floor to Han Seoyun’s desk, and the note on the back of the dissent, 'Returned -- Yoon. Do not ask for reasons.', was not in Han Seoyun’s handwriting."
    },
    "outcomes": {
      "p3_after_appeal": {
        "tag": "Head-On Ending",
        "title": "You appealed the day after the return",
        "text": "The name of the person who returned it went into the reason box. The papers passed once through the 6th floor and once through the 8th, and your name was read in both places."
      },
      "p3_after_copy": {
        "tag": "Kept-Copy Ending",
        "title": "Instead of appealing, you kept one copy of the dissent",
        "text": "Nothing happened today. One copy, outside the system’s list, begins a 3-year wait."
      },
      "p3_after_accept": {
        "tag": "Trusting Ending",
        "title": "You accepted the return and chose to trust her",
        "text": "All seven in the review room stayed. Han Seoyun ordered dinner instead of saying thank you, and no one talked about today’s meeting."
      }
    },
    "continuityChallenges": {
      "p2_after_alone": {
        "title": "Protect the One Who Stood on One Name",
        "text": "You put only your own name on the dissent, so one return finished it. A card that finds even one person to stand beside that name today leaves trust behind."
      },
      "p2_after_shared": {
        "title": "Turn the Overnight Calls Around",
        "text": "Calls going out before dawn to three co-signers means the other side read the document. Now it is your turn to take the fact that it was read and reframe today’s table."
      },
      "p2_after_soften": {
        "title": "Put the Dissent Back on Record",
        "text": "Because of the softened conclusion, Attachment 7 became 'Approvable if conditions are met', and from the title alone no one reads it as a dissent. Getting this document written down again as a dissent raises fairness."
      }
    }
  }
};
