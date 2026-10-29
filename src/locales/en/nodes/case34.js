/**
 * 사건 34 (src/nodes/case34.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c34_start": {
      "title": "Unknown Number",
      "text": "Your phone rings in the hideout on the 1st floor of the Hoegi-dong secondhand bookshop. It is the number that sent you just one line last night: 'Could you meet me?' 'This is Yoon Seojin, Yoon Sanghyuk’s daughter. It’s a 2023 notebook I found in my father’s study. I’m sending it because I want to protect my father.' One photo is attached. A page of a black leather notebook worn at the corners, written in fountain pen: '0412 — dissent — retain: X.' Ban Jaewook looks at the screen a long time, without a magnifying glass. 'That’s the Managing Director’s handwriting. I got notes in that hand for 7 years.' Lee Minseo is zooming in on the photo when her hand stops. 'Someone who wants to protect him sent the most damaging line first. Either this is a trap, or it’s completely sincere.'",
      "memo": [
        "From: Yoon Seojin -- Yoon Sanghyuk’s daughter, graduate student in financial ethics",
        "One photo: '0412 — dissent — retain: X'",
        "Ban Jaewook: looks like Yoon Sanghyuk’s own handwriting",
        "Yoon Seojin’s condition: she shows the notebook only in person"
      ],
      "choices": {
        "c34_start_meet": {
          "label": "Go meet her alone, in person, as she asks"
        },
        "c34_start_verify": {
          "label": "Check the handwriting and date against records first"
        },
        "c34_start_scan": {
          "label": "Reply asking her to photograph the whole notebook first"
        },
        "reframe": {
          "label": "Find out whether only one dissent was erased"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor Hideout · By the Bookshelves",
      "clock": "July 1 · 21:40",
      "question": "Yoon Sanghyuk’s daughter says she wants to protect her father and sends the most damaging line. How do you answer?",
      "lead": "From the number that sent only 'Could you meet me?' last night, a single photo wakes the phone on the table tonight."
    },
    "c34_study": {
      "title": "The Unsigned Decision",
      "text": "Yoon Seojin’s seat is the last carrel in the shared research room beside the stacks, on the 4th floor of the graduate research building in Sinchon. The first thing you see is a paper title taped above her monitor. “Whose Is the Decision No One Signed?” She says it without smiling. 'I picked the title before I knew about my father. Now it’s a little embarrassing.' A black leather notebook comes out of the drawer. Two or three lines in fountain pen for each date. In the box for Thursday of the fourth week of April is '0412 — dissent — retain: X', and in the next day’s box, Friday, is 'On opening — check Seojin’s tuition.' Gallery On is her mother’s gallery. Yoon Seojin covers that line with her fingertip. 'I want to protect my father. I just don’t know whether that means even this line has to be read.'",
      "memo": [
        "2023 notebook -- found at the back of the desk drawer in Yoon Sanghyuk’s study",
        "Thursday, fourth week of April: '0412 — dissent — retain: X'",
        "The next day, Friday: 'On opening — check Seojin’s tuition'",
        "Yoon Seojin’s master’s thesis: “Whose Is the Decision No One Signed?”"
      ],
      "choices": {
        "c34_study_together": {
          "label": "Ask to read it all together, start to finish, nothing covered"
        },
        "c34_study_copy": {
          "label": "With Yoon Seojin’s consent, copy every page"
        },
        "c34_study_page": {
          "label": "Shoot only the pages you need; treat the covered line as unseen"
        },
        "reframe": {
          "label": "Find out whether only one dissent was erased"
        },
        "c34_study_evidence_turn": {
          "label": "Open the records of the day the 2023-0412 dissent was erased"
        }
      },
      "place": "Sinchon Graduate Research Building · Shared Research Room by the Stacks",
      "clock": "July 2 · 15:20",
      "question": "Yoon Seojin covers the tuition line with her fingertip. Do you have to read that line too?",
      "lead": "The research room door has a note that says 'Quiet,' and in the last carrel someone has already set out the notebook and is waiting."
    },
    "c34_sketch": {
      "title": "The Banker Who Lends to the End",
      "text": "Yoon Seojin brings the notebook to the 1st floor of the bookshop. Someone is there first: Moon Hajun. He has borrowed Lim Soyul’s desk to write his college application essay, and its title is 'The Banker Who Lends to the End.' Reading over his shoulder, Yoon Seojin can’t hold back. 'A banker who lends to the end isn’t a banker. That’s Santa.' Moon Hajun doesn’t back down. 'It means looking all the way to the end before you lend.' The two argue financial ethics for an hour. In his sketchbook Moon Hajun draws Yoon Seojin holding a magnifying glass; she draws a bank building with three legs. Laughing, Moon Hajun asks, 'So why are you studying this?' Yoon Seojin pushes the notebook deep into her bag. Who this boy’s father was, she had already read up on before coming today.",
      "memo": [
        "Moon Hajun’s essay title: 'The Banker Who Lends to the End'",
        "Yoon Seojin: came knowing Moon Hajun’s father was Moon Sungho, head of Gaon Precision",
        "Sketchbook: Yoon Seojin with a magnifying glass, a bank with three legs",
        "Moon Hajun hasn’t asked Yoon Seojin’s last name yet"
      ],
      "choices": {
        "c34_sketch_part": {
          "label": "Say today is for the notebook only and separate them"
        },
        "c34_sketch_wait": {
          "label": "Stay close and wait until Yoon Seojin says it herself"
        },
        "c34_sketch_mother": {
          "label": "Tell Moon Gaeul first and ask if the two may meet"
        },
        "reframe": {
          "label": "Find out whether only one dissent was erased"
        },
        "c34_sketch_evidence_turn": {
          "label": "Open the records of the day the 2023-0412 dissent was erased"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor Hideout · By the Bookshelves",
      "clock": "July 3 · 19:30",
      "question": "Moon Hajun is laughing without knowing whose daughter sits next to him. What do you do?",
      "lead": "Before Yoon Seojin arrives with the notebook, a 3rd-year high school student studying for exams sits at Lim Soyul’s desk with a sketchbook open."
    },
    "c34_seminar": {
      "title": "The Father in the Back Row",
      "text": "Eleven people come to Yoon Seojin’s interim thesis presentation in the small basement auditorium of the research building. At the end of the back row, a man in a navy polo shirt sits alone. No tie, no folder, just a single convenience store sunflower resting on his knee. It is Yoon Sanghyuk. When his daughter turns to the first slide, he opens a notebook and takes notes. When her advisor asks, 'Can you hold someone responsible who didn’t sign?' Yoon Seojin pauses for 3 seconds, and for those 3 seconds Yoon Sanghyuk’s pen stops too. He is the first to clap. When he runs into you in the hallway, he isn’t surprised. 'Seojin must have taken the notebook. She’s been opening my drawers since she was little.' He looks down at the sunflower. 'Today is her day. Just in front of her, please don’t bring that up.'",
      "memo": [
        "11 in the audience -- Yoon Sanghyuk at the end of the back row",
        "At the advisor’s question Yoon Seojin goes silent 3 seconds; Yoon Sanghyuk’s pen stops 3 seconds too",
        "Yoon Sanghyuk: already knows his daughter took the notebook",
        "One request: don’t talk about the notebook in front of his daughter"
      ],
      "choices": {
        "c34_seminar_honor": {
          "label": "Grant the request; let today be Yoon Seojin’s day"
        },
        "c34_seminar_ask": {
          "label": "In the hallway, away from her, ask why he wrote 'retain: X'"
        },
        "c34_seminar_bargain": {
          "label": "Agree on one condition: he goes to the prosecutors himself"
        },
        "reframe": {
          "label": "Find out whether only one dissent was erased"
        },
        "c34_seminar_evidence_turn": {
          "label": "Open the records of the day the 2023-0412 dissent was erased"
        }
      },
      "place": "Sinchon Graduate Research Building · Small Basement Auditorium",
      "clock": "Saturday, July 4 · 10:30",
      "question": "Yoon Sanghyuk came to see his daughter present and asks you not to mention the notebook in front of her. How do you answer?",
      "lead": "In the back row of the small auditorium, where you went to cheer on the presentation, is a familiar face without a tie."
    },
    "c34_final": {
      "title": "Retain: X",
      "text": "Yoon Seojin sets the notebook, in a plastic sleeve, on the table on the 1st floor of the bookshop. She says she sat across from her father at dinner tonight. 'He didn’t ask anything. He just peeled me a peach. Without breaking the peel once. That was the scariest part.' The deadline Prosecutor Na Eunho set is 10 a.m. tomorrow. If the notebook isn’t in by then, Yoon Seojin gets called in. She rests her hand on the notebook. 'If I hand it in myself, I’m the daughter who reported her father. If I don’t, I’m the daughter called in instead of her father. I’m not asking you to decide. I’m asking you to decide with me.' A moment later she adds, 'If the way to protect my father is to hide this, then I’ve studied all of this wrong.'",
      "memo": [
        "Deadline: July 6, 10 a.m., Prosecutor Na Eunho’s office, Seoul Central District Prosecutors’ Office",
        "Past the deadline, Yoon Seojin is called in herself",
        "Group legal: calls the notebook a 'trade secret document' and demands it back",
        "Yoon Sanghyuk: asks his daughter nothing, only peels peaches"
      ],
      "choices": {
        "c34_final_copy": {
          "label": "Leave the original with Yoon Seojin; I give prosecutors a copy"
        },
        "c34_final_father": {
          "label": "Buy a day so Yoon Seojin can ask her father first"
        },
        "c34_final_submit": {
          "label": "Yoon Seojin submits it herself and applies for protection too"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor Hideout · By the Bookshelves",
      "clock": "July 5 · 23:05 · Deadline July 6, 10:00",
      "question": "Hand it in and she is the daughter who reported her father; don’t, and she is the daughter called in instead. How do you decide, together?",
      "lead": "The bookshop shutter is half down for the night when Yoon Seojin comes down the stairs, a plastic sleeve held to her chest."
    },
    "c34_aftershock": {
      "title": "A Box of Peaches",
      "text": "The next evening, the shared research room in the Sinchon graduate research building. Wherever the notebook went, one full copy stayed in Yoon Seojin’s drawer. She sets a box of peaches on the desk. Her father bought it, she says, and it’s too much to eat alone. Moon Hajun, the 3rd-year high schooler who tagged along from writing his essay at the bookshop, draws Yoon Seojin with a magnifying glass again in his sketchbook and adds a little sunflower beside her. Ban Jaewook peels off one star sticker his daughter Seoa stuck on his new notebook’s cover and hands it over. Sticking it on her laptop, Yoon Seojin laughs out loud for the first time. 'I grew up banned from putting stickers on things.' Peeling a peach, she opens the first page of the copy. 'I haven’t read it to the end yet. Not alone.' Then a text comes from Kang Taemin. 'The drain at the Incheon plant is blocked, they say. It has to be cleared before the monsoon.'",
      "memo": [
        "One full copy of the notebook left in Yoon Seojin’s drawer",
        "A box of peaches -- bought by Yoon Sanghyuk",
        "One of Ban Seoa’s star stickers -- now on Yoon Seojin’s laptop",
        "Kang Taemin: drain blocked at To-the-End Precision, needs fixing before the monsoon"
      ],
      "choices": {
        "c34_after_rush": {
          "label": "Take the copy and chase the trace that line left in the system"
        },
        "c34_after_warm": {
          "label": "Read the copy to the end together until the lab lights go off"
        },
        "c34_after_record": {
          "label": "Put that one line, and how it came out, on the official record"
        }
      },
      "place": "Sinchon Graduate Research Building · Shared Research Room by the Stacks",
      "clock": "July 6 · Evening",
      "question": "Yoon Seojin says she couldn’t read the notebook to the end alone. How do you close this evening?"
    },
    "c34_margin": {
      "title": "Red Ink",
      "text": "Ban Jaewook lays out on the bookshop table, one by one, the notebook pages Yoon Seojin photographed and sent herself. Every work note is in black ink, but lines in red ink appear 23 times in the year. All of them are his daughter’s schedule. 'Seojin conference talk 5/2 — don’t miss', 'Seojin birthday — reserve cake'. '0412 — dissent — retain: X' is in black ink, and the line right under it is red. 'Seojin midterms — do not call.' Whether the two colors went down on the same day, only handwriting analysis that covers the ink as well can tell. Ban Jaewook opens his newly bought notebook beside them. His original notebook went into an evidence bag. 'The same hand writes things like these side by side. I did too.'",
      "memo": [
        "23 red-ink lines -- all his daughter’s schedule",
        "The line right under 'retain: X': 'Seojin midterms — do not call'",
        "Ban Jaewook’s original notebook is in a prosecutors’ evidence bag"
      ],
      "choices": {
        "c34_margin_choice_2": {
          "label": "Send the ink colors for handwriting analysis to date the lines"
        },
        "c34_margin_choice_3": {
          "label": "Pick out only the black lines and make a summary today"
        },
        "c34_margin_choice_1": {
          "label": "Say the 23 red lines belong to the family and cover them"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor Hideout · Table by the Bookshelves",
      "clock": "July 3 · 16:00",
      "question": "The line right under 'retain: X' is his daughter’s midterm. How do you handle the red-ink lines?"
    },
    "c34_pear": {
      "title": "A Pear at One in the Morning",
      "text": "After Moon Hajun leaves, under a convenience store parasol in the alley outside the bookshop, Yoon Seojin rolls a can of soda between her hands and talks. 'At one in the morning, the night before my master’s interview, my father peeled me a pear. The peel never broke once. And while he did, he said: if an interviewer objects, keep asking why, all the way. You need someone who disagrees before a judgment can stand.' She puts the can down. 'I chose this field after hearing that. And the man who said it wrote, that spring, not to keep a dissent.'",
      "memo": [
        "1 a.m. the night before the master’s interview -- a pear peel that never broke",
        "Yoon Sanghyuk’s words: 'You need someone who disagrees before a judgment can stand'",
        "Between those words and 'retain: X': less than a year"
      ],
      "choices": {
        "c34_pear_choice_3": {
          "label": "Set her father aside and help prepare tomorrow’s talk first"
        },
        "c34_pear_choice_2": {
          "label": "Match the date he said it against the notebook’s dates"
        },
        "c34_pear_choice_1": {
          "label": "Take Yoon Seojin’s side and say he must have meant it"
        }
      },
      "place": "Alley Outside the Hoegi-dong Secondhand Bookshop · Convenience Store Parasol",
      "clock": "July 3 · 22:15",
      "question": "The father who taught that you need someone who disagrees erased a dissent. What do you say to Yoon Seojin?"
    },
    "c34_hallway": {
      "title": "10 A.M. the Day After Tomorrow",
      "text": "In the hallway after the presentation, your phone rings. Prosecutor Na Eunho. The first thing you hear is him chewing gimbap. 'I know about the notebook. The housekeeper at that house saw the drawer open.' What he wants is a voluntary submission (the holder handing the evidence over to investigators of their own accord). 'Bring it by 10 a.m. the day after tomorrow. Otherwise I call in Yoon Seojin. Making a grad student talk about her father, I don’t like it either. But I’m paid to do things I don’t like.' Before hanging up, he adds, 'Ah, I was rude just now, wasn’t I. I’ll note that down too.'",
      "memo": [
        "Deadline: July 6, 10 a.m.",
        "Na Eunho: past the deadline, he calls in Yoon Seojin himself",
        "The notebook’s existence is already known from the housekeeper’s statement"
      ],
      "choices": {
        "c34_hallway_choice_2": {
          "label": "Get the submission steps and Yoon Seojin’s rights in writing"
        },
        "c34_hallway_choice_3": {
          "label": "Don’t wait two days; propose handing it over today"
        },
        "c34_hallway_choice_1": {
          "label": "Step in first so Yoon Seojin isn’t called in"
        }
      },
      "place": "Sinchon Graduate Research Building · 1st Floor Hallway",
      "clock": "July 4 · 12:10",
      "question": "If the notebook isn’t in by 10 a.m. the day after tomorrow, the prosecutor calls in Yoon Seojin. What do you do?"
    },
    "c34_margin_reaction": {
      "title": "Five Stars, Zero Stickers",
      "text": "Back from school, Ban Seoa makes a video call. She begs to see the notebook photos, then hands down her review. 'Handwriting, five stars. Stickers, zero. I guess this man’s daughter couldn’t stick anything in her dad’s notebook.' Ban Jaewook laughs, then zooms in on one photo again. Inside the cover are six square sticky marks. Someone stuck stickers there, and someone carefully peeled them off. 'Seoa, how many stars for this?' Ban Seoa looks for a long while, then says, 'This one doesn’t get stars. It needs a bandage.'",
      "memo": [
        "Six sticker marks inside the cover",
        "A bandage instead of stars"
      ],
      "choices": {
        "c34_margin_reaction_choice_3": {
          "label": "Say the marks have nothing to do with the case; move on"
        },
        "c34_margin_reaction_choice_1": {
          "label": "Tell Yoon Seojin yourself what the sticker marks mean"
        },
        "c34_margin_reaction_choice_2": {
          "label": "Log the cover marks as signs the notebook was handled"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Stair Landing",
      "clock": "July 3 · 17:05",
      "question": "Inside the notebook’s cover are six marks where someone peeled off stickers. What do you do with these traces?"
    },
    "c34_pear_reaction": {
      "title": "What’s Your Last Name?",
      "text": "Moon Hajun comes running back from the end of the alley. He left his sketchbook, he says. Picking it up, he looks at Yoon Seojin. 'I know your last name is Yoon. I searched your name earlier and a conference photo came up.' Yoon Seojin freezes. Moon Hajun tears the 'Yoon Seojin with a magnifying glass' page out of his sketchbook and holds it out. 'Your dad did it, not you. My mom might see it differently. But that’s how I see it.' He adds one more thing. 'And the Santa argument isn’t over yet.'",
      "memo": [
        "A last name he already knew",
        "The Santa argument is still going"
      ],
      "choices": {
        "c34_pear_reaction_choice_3": {
          "label": "Thank him, but put it off until the case is over"
        },
        "c34_pear_reaction_choice_1": {
          "label": "Have them meet again next week to revise his essay"
        },
        "c34_pear_reaction_choice_2": {
          "label": "Tell Moon Gaeul about today first and ask what she thinks"
        }
      },
      "place": "Alley outside the Hoegi-dong secondhand bookshop",
      "clock": "July 3 · 22:40",
      "question": "Moon Hajun already knew Yoon Seojin’s last name. What do you do about these two?"
    },
    "c34_hallway_reaction": {
      "title": "Only the Recipient’s Name",
      "text": "That evening a registered envelope comes for Yoon Seojin. It is a certified letter from group legal. The notebook is a document containing the group’s trade secrets, it says, and if she doesn’t return it within three days they will take legal action. Baek Arin gets the photo and calls right away. 'It’s word for word the one I got last week. Down to where the commas go. Only the recipient’s name changed.' She takes a breath. 'This time it’s a grad student. Those people don’t look at who they’re dealing with. They only look at the sentences.'",
      "memo": [
        "Two envelopes alike down to the commas",
        "Sentences where only the recipient’s name changed"
      ],
      "choices": {
        "c34_hallway_reaction_choice_1": {
          "label": "Have Baek Arin meet Yoon Seojin and tell what she went through"
        },
        "c34_hallway_reaction_choice_2": {
          "label": "Lay the two letters side by side and name the same author"
        },
        "c34_hallway_reaction_choice_3": {
          "label": "Ignore the envelope and stick to the notebook schedule"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Stair Landing",
      "clock": "July 4 · 19:20",
      "question": "An envelope identical to Baek Arin’s, down to the commas, has come to a grad student. What do you do?"
    },
    "c34_branch_study": {
      "title": "Her Father’s Study",
      "text": "Once you agree to read it together, Yoon Seojin closes the notebook. 'There’s a gap before and after. The 2022 and 2024 notebooks are in the study. My father has dinner plans tonight, so he’ll be home late.' That evening, the 2nd-floor study of the house in Pyeongchang-dong. One wall is all bookshelves, and on one shelf 15 black notebooks stand in order of year. Only the 2023 spot is empty. Yoon Seojin points to the bottom shelf. Drawings from elementary school, middle school certificates, a printout of her college acceptance text, each in its own clear sleeve. 'A man who writes retain: X can’t throw away a single one of these.'",
      "memo": [
        "15 black notebooks -- from 2011, only the 2023 spot empty",
        "Bottom shelf: Yoon Seojin’s drawings, certificates, printed acceptance text",
        "Yoon Sanghyuk expected home: after 23:00, following dinner plans",
        "A room entered with Yoon Seojin’s permission -- no warrant"
      ],
      "choices": {
        "c34_branch_study_a": {
          "label": "Take out only the two she picks; read before and after together"
        },
        "c34_branch_study_b": {
          "label": "First log the list and location of all 15"
        },
        "c34_branch_study_c": {
          "label": "Touch nothing in the study and leave"
        }
      },
      "place": "Yoon Sanghyuk’s House, Pyeongchang-dong · 2nd-Floor Study Bookshelves",
      "clock": "July 2 · 20:10",
      "question": "The shelves of the man who wrote retain: X keep everything of his daughter’s. What do you do in this room?"
    },
    "c34_branch_study_follow": {
      "title": "The Light at the Front Door",
      "text": "The moment you open the 2024 notebook to its first page, the motion-sensor light at the front door comes on. Yoon Sanghyuk, who was supposed to have plans, is home early. From the foot of the stairs his voice comes up with the rustle of a plastic bag. 'Seojin, I brought peaches. I’ll wash them, so come down and eat.' A slow, round voice you never once heard at the company. Yoon Seojin goes white and grips the notebook. The first page of 2024 holds one line. 'Last year’s business stays in last year’s notebook.' Outside the study window is the garden, and there is only one staircase.",
      "memo": [
        "Yoon Sanghyuk home at 21:00 -- two hours earlier than expected",
        "First page of the 2024 notebook: 'Last year’s business stays in last year’s notebook'",
        "Ways out of the study: one staircase, one window over the garden",
        "The sound of water from the 1st-floor kitchen, peaches being washed"
      ],
      "choices": {
        "c34_branch_study_follow_c": {
          "label": "Leave it to Yoon Seojin and slip out the garden window"
        },
        "c34_branch_study_follow_a": {
          "label": "Stay by Yoon Seojin, go down together, and say hello"
        },
        "c34_branch_study_follow_b": {
          "label": "Photograph the first page of 2024 and reshelve the notebook"
        }
      },
      "place": "Yoon Sanghyuk’s House, Pyeongchang-dong · 2nd-Floor Study Bookshelves",
      "clock": "July 2 · 21:02",
      "question": "Yoon Sanghyuk is home early and calls his daughter. There is only one staircase. What do you do?"
    },
    "c34_route_system": {
      "title": "The Dissents Nobody Kept",
      "text": "You suggest checking whether that was the only dissent erased. Lee Minseo logs in with a KD Data Lab account. The group’s document management records open. In the last 10 years, 214 dissents were attached to review reports. Of those, 61 had their retention period changed to '0 years', and for all 61 the change came within three days before the loan went out. In the changed-by field, 60 show a system account; only one, 2023-0412, shows Yoon Sanghyuk’s account. Lee Minseo turns the screen. 'There’s one line in the notebook, but 61 lines in the system. And the only one with a person’s name on it is that one.'",
      "memo": [
        "Of 214 dissents, 61 had retention changed to '0 years'",
        "All 61 changed within 72 hours before the loan was disbursed",
        "Changed by: system account 60, a person’s account 1"
      ],
      "choices": {
        "c34_route_system_owners": {
          "label": "First find and notify the 61 people who wrote the dissents"
        },
        "c34_route_system_hold": {
          "label": "Set the list aside; focus on the one line in the notebook"
        },
        "c34_route_system_publish": {
          "label": "Send the list of 61 to the prosecutor’s office and the FSS"
        },
        "c34_route_system_evidence_turn": {
          "label": "Open the records of the day the 2023-0412 dissent was erased"
        }
      },
      "place": "KD Data Lab, Pangyo · Data Center Terminal",
      "clock": "July 2 · 01:20",
      "question": "Sixty-one dissents were erased, but a person’s name is on only one line. What do you do with this list?"
    },
    "c34_final_system_route": {
      "title": "61 Lines of a System Account",
      "text": "Two in the morning. At the data center terminal, Lee Minseo scrolls through all 61 lines. In the changed-by field, 60 lines carry the same system account. She goes back to the top and puts a fingertip on the 2023-0412 line. Only that line has a person’s account, and only that line has a notebook beside it. The deadline Prosecutor Na Eunho set for the notebook is ten tomorrow morning; miss it and Yoon Seojin gets called in. 'If the notebook goes in, this one line gets a person. The other 60 lines stay something a machine did. I hope Yoon Seojin doesn’t end up carrying all 61 alone.'",
      "memo": [
        "61 dissents with retention changed to 0 years -- 60 by a system account",
        "Records with a person’s name: the 2023-0412 line and one notebook line",
        "Notebook deadline: July 6, 10:00"
      ],
      "choices": {
        "c34_final_system_route_c": {
          "label": "Give dissent writers the right to keep their own copy"
        },
        "c34_final_system_route_b": {
          "label": "Use the notebook line to target Yoon Sanghyuk alone"
        },
        "c34_final_system_route_a": {
          "label": "Change the rules so no dissent is erased before loan maturity"
        }
      },
      "place": "KD Data Lab, Pangyo · Data Center Terminal",
      "clock": "July 5 · 02:00",
      "question": "Of the 61 lines, only one carries a person’s name. How do you find who owns the other 60?"
    },
    "c34_evidence_turn": {
      "title": "The One Who Printed a Copy",
      "text": "When you set the clue next to the notebook’s date, the document management records of the 2023-0412 review report open. The retention period on 1 dissent changed from '10 years' to '0 years' on the same day as the notebook line: April 27, 2023, 18:44. The change was requested from the account of Yoon Sanghyuk himself, then head of the Corporate Finance Strategy Team, and the approver field is blank. The account that returned the dissent at 13:32 that day was Han Seoyun’s. The person who returned it and the person who erased it are not the same. But one record remains of the dissent being printed 40 minutes before it was erased. The printer was in the team head’s office on the 6th floor of head office, and it printed 11 pages. Ban Jaewook closes the new notebook he was writing in. 'He wrote not to keep it, and then printed himself a copy.'",
      "memo": [
        "Retention change date = the notebook’s 'retain: X' date",
        "Change requested: Yoon Sanghyuk’s account 18:44, approver field blank -- returned by Han Seoyun 13:32",
        "40 minutes before deletion: 11 pages printed on the 6th-floor team head’s office printer, head office"
      ],
      "choices": {
        "c34_evidence_turn_quiet": {
          "label": "Hold the record until the day you sit down with Yoon Sanghyuk"
        },
        "c34_evidence_turn_print": {
          "label": "Ask prosecutors to find the 11 pages printed on the 6th floor"
        },
        "c34_evidence_turn_daughter": {
          "label": "Show Yoon Seojin this record first and judge it together"
        }
      },
      "place": "KD Bank Head Office · Document Management System Terminal",
      "clock": "July 5 · 19:00",
      "question": "40 minutes before the dissent was erased, 11 pages came off the team head’s office printer. How do you use this record?"
    },
    "c34_start_warm": {
      "title": "An Evening of Measuring Hems",
      "text": "Last night, while you were packing Baek Arin’s remaining boxes in the studio in Gongdeok-dong, a line came from an unknown number to the phone sitting on a box: 'Could you meet me?' It was the night you were packing up for someone moving out of company housing as the price of a whistleblower report, so you answered in the morning, and in the evening a photo comes. 'This is Yoon Seojin, Yoon Sanghyuk’s daughter. It’s a 2023 notebook I found in my father’s study. I’m sending it because I want to protect my father. I’ll show you the original only in person.' A page of a black leather notebook, in fountain pen: '0412 — dissent — retain: X'. On the 2nd floor of Yoonkyung Alterations, where the first boxes you moved are stacked, Heo Yoonkyung stops measuring your hem and glances at the screen. Baek Arin places the name first. 'Seojin? She’s the girl in the frame on the Managing Director’s desk. The photo from her graduation, holding sunflowers.'",
      "memo": [
        "9 boxes left in the Gongdeok-dong studio -- packing since last night",
        "Yoon Seojin’s second text and one photo of the notebook",
        "Baek Arin: remembers the daughter’s face in the frame on Yoon Sanghyuk’s desk"
      ],
      "choices": {
        "c34_start_warm_verify": {
          "label": "Check the handwriting and date against records first"
        },
        "c34_start_warm_meet": {
          "label": "Go meet her alone, in person, as she asks"
        },
        "c34_start_warm_signature": {
          "label": "Ask Baek Arin first what kind of person Yoon Seojin is"
        },
        "c34_start_warm_scan": {
          "label": "Reply asking her to photograph the whole notebook first"
        },
        "c34_start_warm_reframe": {
          "label": "Find out whether only one dissent was erased"
        }
      },
      "place": "Yoonkyung Alterations, Anyang Central Market · 2nd-Floor Workroom",
      "clock": "July 1 · 19:20",
      "question": "The day after packing Baek Arin’s last things, Yoon Sanghyuk’s daughter sent a photo of the notebook. Whom do you ask what first?",
      "lead": "The evening after packing boxes at the studio, you gather again on the 2nd floor, where Heo Yoonkyung measures her daughter’s colleagues’ hems one pair at a time."
    },
    "c34_start_record": {
      "title": "The Document for the Next Person",
      "text": "The record of retaliation, eight days of it starting from Monday at 8:00 when the dismissal notice went up, you organized overnight and filed today. It is the first document the next person will read about what a whistleblower goes through. Back on the 1st floor of the bookshop, you find a photo from the number that texted last night. 'This is Yoon Seojin. I’m sending it because I want to protect my father.' A page of a black leather notebook: '0412 — dissent — retain: X'. Ban Jaewook looks down at the copy of the record just filed. 'I didn’t think the next person would come this fast.'",
      "memo": [
        "Baek Arin’s week on record -- filed today",
        "Yoon Seojin’s second text and one photo of the notebook",
        "Ban Jaewook: printed one more copy of the record form"
      ],
      "choices": {
        "c34_start_record_signature": {
          "label": "Check if Yoon Seojin qualifies for whistleblower protection"
        },
        "c34_start_record_verify": {
          "label": "Check the handwriting and date against records first"
        },
        "c34_start_record_scan": {
          "label": "Reply asking her to photograph the whole notebook first"
        },
        "c34_start_record_meet": {
          "label": "Go meet her alone, in person, as she asks"
        },
        "c34_start_record_reframe": {
          "label": "Find out whether only one dissent was erased"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor Hideout · By the Bookshelves",
      "clock": "July 1 · 22:10",
      "question": "On the day you filed a record for the next whistleblower, someone else came in holding a dangerous record. What do you check first?",
      "lead": "It is the night you come back to the bookshop with a copy of the record of Baek Arin’s week."
    },
    "c34_start_rush": {
      "title": "The Midnight Café",
      "text": "An hour after you got up, leaving the box tape half torn, Yoon Seojin was sitting in a 24-hour café in front of Sinchon Station. She hadn’t brought the notebook; she only showed one photo on her phone. In fountain pen: '0412 — dissent — retain: X'. 'I contacted you because I want to protect my father. I’ll show you the original only in my lab.' The next morning Lee Minseo arrives at the 1st floor of the bookshop, hears the story, and her eyes go wide. 'You went out alone, at night? Without checking? And how did CEO Yoon Sanghyuk’s daughter get your number?'",
      "memo": [
        "40-minute midnight café meeting -- saw only one photo",
        "Yoon Seojin’s condition: the original only in her lab",
        "Lee Minseo: wants to check first how she got the number"
      ],
      "choices": {
        "c34_start_rush_meet": {
          "label": "Go meet her alone, in person, as she asks"
        },
        "c34_start_rush_verify": {
          "label": "Check the handwriting and date against records first"
        },
        "c34_start_rush_scan": {
          "label": "Reply asking her to photograph the whole notebook first"
        },
        "c34_start_rush_signature": {
          "label": "From the next meeting on, seat a colleague across the room"
        },
        "c34_start_rush_reframe": {
          "label": "Find out whether only one dissent was erased"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor Hideout · By the Bookshelves",
      "clock": "July 1 · 09:10",
      "question": "Without checking anything, you met Yoon Sanghyuk’s daughter alone at night. How do you prepare for the next meeting?",
      "lead": "The morning after you came back from the midnight café, the air on the 1st floor of the bookshop is cold."
    }
  },
  "echoReplies": {
    "c34_start_meet": "Going alone, you get Yoon Seojin to lower her guard one layer. For those two hours your colleagues at the bookshop just stare at their phones.",
    "c34_start_verify": "Checked against the records, the handwriting matches and so does the date. Meanwhile Yoon Seojin stares all night at a phone with no reply.",
    "c34_start_scan": "An hour after your reply, Yoon Seojin writes back briefly. 'I said I wanted to show you the original in person.' No photos come.",
    "c34_study_together": "Read from the start, the notebook becomes 1 year of one man’s life. It takes 20 minutes before Yoon Seojin lifts her finger off the tuition line.",
    "c34_study_copy": "The copy is exact. Every time the copier hums, Yoon Seojin looks out the window.",
    "c34_study_page": "You get the pages you need. The covered line stays covered, Yoon Seojin’s alone to carry.",
    "c34_sketch_wait": "You wait, and around midnight Yoon Seojin says it herself. By then Moon Hajun has already gone home.",
    "c34_sketch_mother": "Moon Gaeul is silent a long while, then says, 'Why would I stop kids from drawing pictures together?' Her voice shakes a little.",
    "c34_sketch_part": "Separated, the Santa argument breaks off in the middle. Moon Hajun leaves his sketchbook behind. Whether on purpose, no one knows.",
    "c34_seminar_honor": "When you grant the request, Yoon Sanghyuk bows his head once. An angle you never saw at the company. That debt is written down nowhere.",
    "c34_seminar_ask": "When you ask, Yoon Sanghyuk moves the sunflower to his other hand. 'I did write that line. The reason is simpler than you think.' He says nothing more.",
    "c34_seminar_bargain": "When you set the condition, Yoon Sanghyuk smiles for the first time. 'So now you bargain over positions too.' Whether that smile is an answer, there is no telling.",
    "c34_final_father": "With a day bought, Yoon Seojin stands outside her father’s room. What she asked and what she heard remain hers. Na Eunho puts up one more finger.",
    "c34_final_submit": "Submitted in person, Yoon Seojin’s name goes in the submitter field of the record. Right above her father’s name. She looks at that field a long time.",
    "c34_final_copy": "With only a copy handed over, Yoon Seojin isn’t called in. Instead she has to decide alone where to keep the original. Group legal’s envelopes keep coming.",
    "c34_after_warm": "You close the last page around midnight. Yoon Seojin says, 'If I’d read it alone I would have shut it halfway.' Moon Hajun eats the last peach.",
    "c34_after_record": "The record is two pages. Yoon Seojin signs her name on the last line, and you sign too, so the field next to hers isn’t blank.",
    "c34_after_rush": "After you leave, a half-peeled peach stays in the lab. Yoon Seojin turns the remaining pages of the copy alone. Moon Hajun quietly sits down beside her.",
    "c34_margin_choice_1": "Covering them lets Yoon Seojin open the notebook a little more easily. One of the covered lines may turn out to be the only one that can prove a date later.",
    "c34_margin_choice_2": "The analysis goes out on the copies and enlarged photos. Results come in 2 weeks, and until then no one can say whether the two colors went down on the same day.",
    "c34_margin_choice_3": "The summary is neat. Without 'midterms — do not call,' the notebook reads like one man’s work log.",
    "c34_pear_choice_1": "When you take her side, Yoon Seojin nods. Then, a long while later, she asks. 'Then why would someone who meant it write that?'",
    "c34_pear_choice_2": "Matching the dates, the interview comes four months after 'retain: X'. Those words came after he erased the dissent.",
    "c34_pear_choice_3": "The slides are done at two in the morning. The pear story doesn’t come up again.",
    "c34_hallway_choice_1": "When you step in, Na Eunho puts up one finger. 'Then you bring it, how about that.' The weight shifts onto you.",
    "c34_hallway_choice_2": "The confirmation arrives only on the morning of the deadline. Meanwhile Yoon Seojin keeps her phone face down all weekend.",
    "c34_hallway_choice_3": "At the idea of handing it over today, Yoon Seojin hugs the bag with the notebook in it. 'Just one day. Just one dinner with my father.' The deadline stays at 10 a.m. the day after tomorrow.",
    "c34_margin_reaction_choice_1": "Hearing it from you, Yoon Seojin is quiet a long time. Then she says. 'I stuck them on. When I was six. I wasn’t the one who peeled them off.'",
    "c34_margin_reaction_choice_2": "The record is exact. 'Inside cover: 6 adhesive marks.' Who peeled them off, and why, doesn’t go in that field.",
    "c34_margin_reaction_choice_3": "When you move on, Ban Seoa pouts. 'Dad gets two stars.'",
    "c34_pear_reaction_choice_1": "Next week’s meeting is set. Moon Hajun’s essay title changes to 'The Banker Who Looks to the End Before Lending.' The Santa argument ends in a draw.",
    "c34_pear_reaction_choice_2": "Moon Gaeul takes the call and just chews rice cake for a long time. Then she says. 'If Hajun says so, then it’s so. Me, I don’t know yet.'",
    "c34_pear_reaction_choice_3": "At the idea of waiting, Moon Hajun nods. The drawing he tore out spends the weekend folded in Yoon Seojin’s bag.",
    "c34_hallway_reaction_choice_1": "Baek Arin and Yoon Seojin sit side by side on the bookshop’s stair landing. For the first time Yoon Seojin hears that being scared is nothing strange.",
    "c34_hallway_reaction_choice_2": "Side by side, the two envelopes’ document numbers differ by a single digit. Envelopes written by the same person in the same week.",
    "c34_hallway_reaction_choice_3": "Ignored, the three days pass quietly. Yoon Seojin holds her breath every time a registered mail notice comes.",
    "c34_branch_study_a": "With the volumes from before and after laid side by side, only 2023’s handwriting shrinks. That year he wrote more words into each box.",
    "c34_branch_study_b": "The list is perfect. Yoon Seojin silently watches you write up her own family’s bookshelf like an evidence list.",
    "c34_branch_study_c": "Touching nothing, you leave the study as it was. The empty 2023 spot stays as it was too.",
    "c34_branch_study_follow_a": "As you come down the stairs, Yoon Sanghyuk stops washing peaches and looks at you. He takes out one more plate. He asks nothing.",
    "c34_branch_study_follow_b": "The photo stays. Your hand shakes as you reshelve the notebook, and 2024 goes into 2022’s spot. The next morning someone puts it back right.",
    "c34_branch_study_follow_c": "Going out the window, you leave shoe prints in the hydrangea bed. The next day Yoon Seojin texts. 'My father says a water deer came by.'",
    "c34_route_system_publish": "Once the list goes over, both agencies send the group the same question on the same day: who was behind the system account.",
    "c34_route_system_owners": "Half of the 61 didn’t know their dissent had been erased. One takes the call, laughs a long time, then cries.",
    "c34_route_system_hold": "Focusing on one line makes the story sharp. The other 60 lines live on under the system account’s name.",
    "c34_final_system_route_a": "With the rules changed, the next dissent lives as long as the loan does. Who enforces the rules is the next problem.",
    "c34_final_system_route_b": "Aimed at one man, the notebook becomes powerful evidence. The system that erased the other 60 waits, unchanged, for the next loan.",
    "c34_final_system_route_c": "With the right to keep their own copy, people who dissent no longer depend on the company’s goodwill. The company fights that clause for a long time.",
    "c34_evidence_turn_print": "The request is granted, and investigators start with the shredding logs of the rooms Yoon Sanghyuk passed through. No one knows whether those 11 pages still exist.",
    "c34_evidence_turn_quiet": "While you hold it, no one knows until that day. Not even Yoon Seojin. She may have been the one who should have known first.",
    "c34_evidence_turn_daughter": "Shown the record, Yoon Seojin reads the figure '40 minutes' three times. 'He kept one copy before erasing it. That is so like my father.'",
    "c34_study_evidence_turn": "Put on one calendar, the notebook’s date becomes the system’s date. Who printed a copy of what that day is in the printer log too.",
    "c34_sketch_evidence_turn": "Put on one calendar, the notebook’s date becomes the system’s date. Who printed a copy of what that day is in the printer log too.",
    "c34_seminar_evidence_turn": "Put on one calendar, the notebook’s date becomes the system’s date. Who printed a copy of what that day is in the printer log too.",
    "c34_route_system_evidence_turn": "Put on one calendar, the notebook’s date becomes the system’s date. Who printed a copy of what that day is in the printer log too.",
    "case34_memory_system": "The records hold things erased before your hand was ever played. Lee Minseo counts, line by line, the dissents whose retention was changed to 0 years.",
    "case34_memory_evidence": "Set the risk score’s date against the document management records and you find a trace of one printout made just before the erasure. The floor it was printed on is listed.",
    "c34_start_warm_meet": "Going alone, you get Yoon Seojin to lower her guard one layer. For those two hours your colleagues at the bookshop just stare at their phones.",
    "c34_start_warm_verify": "Checked against the records, the handwriting matches and so does the date. Meanwhile Yoon Seojin stares all night at a phone with no reply.",
    "c34_start_warm_scan": "An hour after your reply, Yoon Seojin writes back briefly. 'I said I wanted to show you the original in person.' No photos come.",
    "c34_start_warm_signature": "Until Heo Yoonkyung finishes measuring the hems, Baek Arin talks about the girl she knows from one photo. A graduation photo with sunflowers, and a boss who closed his folders slowly only when he looked at it.",
    "c34_start_record_meet": "Going alone, you get Yoon Seojin to lower her guard one layer. For those two hours your colleagues at the bookshop just stare at their phones.",
    "c34_start_record_verify": "Checked against the records, the handwriting matches and so does the date. Meanwhile Yoon Seojin stares all night at a phone with no reply.",
    "c34_start_record_scan": "An hour after your reply, Yoon Seojin writes back briefly. 'I said I wanted to show you the original in person.' No photos come.",
    "c34_start_record_signature": "The requirements have no clause for a family member handing in a family member’s records. The gap could help Yoon Seojin, or hurt her.",
    "c34_start_rush_meet": "Going alone, you get Yoon Seojin to lower her guard one layer. For those two hours your colleagues at the bookshop just stare at their phones.",
    "c34_start_rush_verify": "Checked against the records, the handwriting matches and so does the date. Meanwhile Yoon Seojin stares all night at a phone with no reply.",
    "c34_start_rush_scan": "An hour after your reply, Yoon Seojin writes back briefly. 'I said I wanted to show you the original in person.' No photos come.",
    "c34_start_rush_signature": "Kang Taemin sits on a sofa in the 1st-floor lobby of the research building. He drinks four cups of vending machine coffee in two hours, and Yoon Seojin works out who he is in the first 5 minutes."
  },
  "choiceVoiceLines": {
    "c34_start_meet": "Saying the rest of the 'retain: X' line has to be heard face to face, you go meet her alone, in person, as she asks.",
    "c34_start_verify": "Saying you can’t take one photo at face value, you check the handwriting and date against records before seeing the original.",
    "c34_start_scan": "Saying one page can’t show the lines before and after, you reply asking her to photograph the whole notebook first.",
    "c34_study_together": "Saying that if you pick what to read, you also pick what to protect, you ask to read it all together, start to finish, nothing covered.",
    "c34_study_copy": "Saying the notebook isn’t safe sitting in a drawer, you copy every page with Yoon Seojin’s consent.",
    "c34_study_page": "Leaving the tuition line as hers to carry, you photograph only the pages you need and treat the covered line as unseen.",
    "c34_sketch_wait": "Saying whose daughter she is should come from her own mouth, you stay close and wait until Yoon Seojin says it herself.",
    "c34_sketch_mother": "So this isn’t a meeting the boy’s mother knows nothing about, you tell Moon Gaeul first and ask if the two may meet.",
    "c34_sketch_part": "Cutting off the question of why she studies this, you say today is for the notebook only and separate the two.",
    "c34_seminar_honor": "Saying that at the presentation he is only a father, you grant the request and let today be Yoon Seojin’s day.",
    "c34_seminar_ask": "Saying the request covered only what is said in front of her, you ask in the hallway, away from his daughter, why he wrote 'retain: X'.",
    "c34_seminar_bargain": "Saying protecting his daughter’s day has to have a price, you agree on one condition: he goes to the prosecutors himself.",
    "c34_final_father": "Saying the silence of peeling peaches has to be broken first, you buy a day so Yoon Seojin can ask her father herself before it goes in.",
    "c34_final_submit": "Taking her at her word that hiding is no way to protect him, you have Yoon Seojin submit the notebook herself and apply for protection at the same time.",
    "c34_final_copy": "So she isn’t made the daughter who reported her father, you leave the original with Yoon Seojin and hand prosecutors only a copy yourself.",
    "c34_after_warm": "Hearing she can’t read it alone, you read the copy to the end together tonight, until the lab lights go off.",
    "c34_after_record": "So Yoon Seojin isn’t left to answer alone on the day its source is questioned, you put that one line, and how it came out, on the official record.",
    "c34_after_rush": "Saying you have to get there before the traces are wiped, you take the copy and go straight after the trace that line left in the system.",
    "c34_margin_choice_1": "Saying the 23 red lines of his daughter’s schedule belong to the family, you cover them.",
    "c34_margin_choice_2": "Saying you can’t just guess whether the two colors went down on the same day, you send the ink colors for handwriting analysis to date the lines.",
    "c34_margin_choice_3": "Since every work note is in black ink, you pick out only the black lines and make a summary today.",
    "c34_pear_choice_1": "Saying the hands that peeled her a pear weren’t a lie either, you take Yoon Seojin’s side and say he must have meant it.",
    "c34_pear_choice_2": "Saying you need to know which came first, the night before the interview or that spring, you match the date he said it against the notebook’s dates.",
    "c34_pear_choice_3": "Saying this isn’t a question that gets answered tonight, you set her father aside and help prepare tomorrow’s talk first.",
    "c34_hallway_choice_1": "So that Yoon Seojin, a grad student, isn’t called in over her father’s doings, you step in first to stop it.",
    "c34_hallway_choice_2": "Saying what is said on the phone can change later, you get the submission steps and Yoon Seojin’s rights confirmed in writing.",
    "c34_hallway_choice_3": "Saying the longer the deadline runs, the more Yoon Seojin alone frets, you propose handing the notebook over today instead of waiting two days.",
    "c34_margin_reaction_choice_1": "Saying this should reach the daughter before it reaches the case, you tell Yoon Seojin yourself what the sticker marks mean.",
    "c34_margin_reaction_choice_2": "Saying a day will come to ask who touched it and when, you log the cover marks as signs the notebook was handled.",
    "c34_margin_reaction_choice_3": "Saying marks a daughter probably made have nothing to do with the case, you simply move on.",
    "c34_pear_reaction_choice_1": "So the unfinished Santa argument can go on, you have the two meet again next week to revise his essay.",
    "c34_pear_reaction_choice_2": "Bothered by his words that his mother might think differently, you tell Moon Gaeul about today first and ask what she thinks.",
    "c34_pear_reaction_choice_3": "Saying no one knows yet where the notebook will go, you thank him but put it off until the case is over.",
    "c34_hallway_reaction_choice_1": "So she knows someone got the same envelope before her, you have Baek Arin meet Yoon Seojin and tell her what she went through.",
    "c34_hallway_reaction_choice_2": "Saying matching down to the commas is no coincidence, you lay the two letters side by side and name the same author.",
    "c34_hallway_reaction_choice_3": "Saying you won’t be shaken by sentences sent to scare, you ignore the envelope and stick to the notebook schedule.",
    "c34_branch_study_a": "Saying that in her house she should be the one choosing, you take out only the two Yoon Seojin picks and read before and after together.",
    "c34_branch_study_b": "Saying you first have to record what was where, you log the list and location of all 15 before anything else.",
    "c34_branch_study_c": "Since the study’s owner isn’t there, you touch nothing in it and leave.",
    "c34_branch_study_follow_a": "Unable to send that white face downstairs alone, you stay by Yoon Seojin, go down the stairs together, and say hello.",
    "c34_branch_study_follow_b": "Saying you keep what you saw but leave no trace, you photograph the first page of 2024 and reshelve the notebook.",
    "c34_branch_study_follow_c": "Saying it only gets more tangled if you step in between father and daughter, you leave it to Yoon Seojin and slip out the garden window.",
    "c34_route_system_publish": "To show it is a method and not a single case, you send the list of 61 to the prosecutor’s office and the FSS together.",
    "c34_route_system_owners": "Saying these people don’t even know their words were erased, you first find and notify the 61 who wrote the dissents.",
    "c34_route_system_hold": "Saying you start with the one that has a name on it, you set the list aside and focus on the one line in the notebook.",
    "c34_final_system_route_a": "So the other 60 lines never happen again, you change the rules so no dissent can be erased until the loan is over.",
    "c34_final_system_route_b": "Saying that line is the only one with a person’s name on it, you use the notebook line to target Yoon Sanghyuk alone.",
    "c34_final_system_route_c": "So it stays in the writer’s hands even if it is erased, you give dissent writers the right to keep their own copy.",
    "c34_evidence_turn_print": "Saying one copy of the erased dissent may still exist, you ask the prosecutor’s office to find the 11 pages printed on the 6th floor that day.",
    "c34_evidence_turn_quiet": "Saying why he printed a copy has to be asked of the man himself, you hold the record until the day you sit down with Yoon Sanghyuk.",
    "c34_evidence_turn_daughter": "Saying you can’t use it behind the back of the one who brought the notebook, you show Yoon Seojin this record first and judge it together.",
    "c34_study_evidence_turn": "You put that one notebook line on the same calendar as the clue and find out when and how the dissent was erased from the system.",
    "c34_sketch_evidence_turn": "You put that one notebook line on the same calendar as the clue and find out when and how the dissent was erased from the system.",
    "c34_seminar_evidence_turn": "You put that one notebook line on the same calendar as the clue and find out when and how the dissent was erased from the system.",
    "c34_route_system_evidence_turn": "You put that one notebook line on the same calendar as the clue and find out when and how the dissent was erased from the system.",
    "c34_start_warm_meet": "Saying the rest of the 'retain: X' line has to be heard face to face, you go meet her alone, in person, as she asks.",
    "c34_start_warm_verify": "Saying you can’t take one photo at face value, you check the handwriting and date against records before seeing the original.",
    "c34_start_warm_scan": "Saying one page can’t show the lines before and after, you reply asking her to photograph the whole notebook first.",
    "c34_start_warm_signature": "With someone beside you who knows the girl in the frame, you ask Baek Arin first what kind of person Yoon Seojin is.",
    "c34_start_record_meet": "Saying the rest of the 'retain: X' line has to be heard face to face, you go meet her alone, in person, as she asks.",
    "c34_start_record_verify": "Saying you can’t take one photo at face value, you check the handwriting and date against records before seeing the original.",
    "c34_start_record_scan": "Saying one page can’t show the lines before and after, you reply asking her to photograph the whole notebook first.",
    "c34_start_record_signature": "Saying whoever brings in her father’s notebook can get hurt too, you check first whether Yoon Seojin can be protected as a whistleblower.",
    "c34_start_rush_meet": "Saying the rest of the 'retain: X' line has to be heard face to face, you go meet her alone, in person, as she asks.",
    "c34_start_rush_verify": "Saying you can’t take one photo at face value, you check the handwriting and date against records before seeing the original.",
    "c34_start_rush_scan": "Saying one page can’t show the lines before and after, you reply asking her to photograph the whole notebook first.",
    "c34_start_rush_signature": "Saying going out alone at night once is enough, from the next meeting on you seat a colleague across the room."
  },
  "pack": {
    "clue": {
      "title": "The Date of Retain: X",
      "text": "'0412 — dissent — retain: X', written in Yoon Sanghyuk’s 2023 notebook. That same day, the system changed that dissent’s retention period to 0 years, and 40 minutes before it was erased, 11 pages were printed in the team head’s office on the 6th floor of head office."
    },
    "outcomes": {
      "c34_after_warm": {
        "tag": "Read to the End",
        "title": "You read the copy to the end together until the lab lights went off",
        "text": "Wherever the notebook went, that night Yoon Seojin did not read 1 year of her father’s life alone. A star sticker went on her laptop, and Moon Hajun’s sketchbook gained one more sunflower."
      },
      "c34_after_record": {
        "tag": "Kept the One Line",
        "title": "The one line 'retain: X' went on the official record",
        "text": "Who found the notebook, when and where, whom it was handed to, and what that one line said all went on record. The road a daughter took to hand in her father’s records became a document, not a rumor."
      },
      "c34_after_rush": {
        "tag": "Ran Ahead",
        "title": "You left the half-peeled peach and chased that line’s trace",
        "text": "You took the copy and went straight to the next fight that night. Left in the lab, Yoon Seojin finished peeling the peach alone."
      }
    },
    "continuityChallenges": {
      "c33_after_warm": {
        "title": "Standing by her like someone who stays to the last box",
        "text": "At the studio in Gongdeok-dong you chose to stay with Baek Arin until her last box. This time trust comes from standing the same way beside a daughter holding her father’s records."
      },
      "c33_after_record": {
        "title": "Rewriting the next person’s document for one more person",
        "text": "You recorded the week a whistleblower went through. Widen that record’s frame by one person’s share, so someone who hands in a family member’s records is protected too."
      },
      "c33_after_rush": {
        "title": "Accounting for the midnight meeting",
        "text": "You met her alone at night without checking. Fairness rests on the card that lets you answer anyone who asks how the notebook came into your hands."
      }
    }
  }
};
