/**
 * 사건 37 (src/nodes/case37.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c37_start": {
      "text": "Three hours after you came back from the Hannam-dong table, still awake in the tropical night, you take another call from Lee Minseo. Her voice shakes. 'That folder I told you about, it’s all out now. On an anonymous community called NoBound, as a file named TL_full.zip. The entire Trigger Lab response records.' 380,000 lines, 63 participants. The names are pseudonymized (erased so no one can tell at once who is who), but everyone knows who 'Analyst A' is, the one who wrote a dissent on 2023-0412. The seconds you hesitated over each choice are there, down to the date and time. Three hours after the first post, the view count is already 110,000. Lee Minseo catches her breath. 'I’m writing takedown requests now. But the copies appear faster than I can write them. Where do we block first?'",
      "memo": [
        "File name TL_full.zip -- 380,000 lines, 63 participants",
        "110,000 views within three hours of the first post",
        "Analyst A: seconds of hesitation and the time for every choice",
        "Group’s official position: none yet"
      ],
      "choices": {
        "c37_start_verify": {
          "label": "Check it line by line against the original copy first"
        },
        "c37_start_report": {
          "label": "Send the board operator a takedown request right away"
        },
        "c37_start_call": {
          "label": "Call the colleagues in the records before opening the file"
        },
        "reframe": {
          "label": "First ask what this file is for"
        }
      },
      "place": "Your Studio, Mangwon-dong · Rooftop",
      "clock": "July 27 · Tropical Night · 02:14",
      "question": "Your hesitation is on the internet, to the second. What will you block first?",
      "lead": "Back from Hannam-dong and unable to sleep, you are up on the roof when the phone rings again."
    },
    "c37_takedown": {
      "title": "1,204 Takedown Requests",
      "text": "Three laptops glow on a folding table between the shelves on the 1st floor of the Hoegi-dong secondhand bookshop, and the electric fan only pushes hot air around. Lee Minseo’s takedown requests have reached 1,204. Most sites send back the same answer. 'We can only process this if the data subject (the person the record belongs to) asks directly.' Of the 63, nine can be reached tonight; the other 53 are left as numbers, not names. Then the door opens and Kang Taemin comes in hugging a whole watermelon, who knows from where. There is no knife, so he splits it with his fist and says, 'Half of it split right.' On a video call, Na Junhyuk asks in all seriousness, 'Is there nowhere on the internet to put a stamp?' When the laughter dies down, Lee Minseo turns her screen around. 'They say it only gets erased if the person puts their name on it. But if they put their name on it, I’m the one revealing which record number they are.'",
      "memo": [
        "1,204 takedown requests -- 37 processed",
        "Condition for processing: a request from the person themselves",
        "9 reachable, the other 53 only numbers",
        "Copies spreading at 40 sites an hour"
      ],
      "choices": {
        "c37_takedown_file": {
          "label": "File a formal leak report with the privacy commission first"
        },
        "c37_takedown_bulk": {
          "label": "Skip consent for now and request a bulk takedown in my name"
        },
        "c37_takedown_consent": {
          "label": "Ask everyone reachable if they will put their name on it"
        },
        "reframe": {
          "label": "First ask what this file is for"
        },
        "c37_takedown_evidence_turn": {
          "label": "Dig up the leak account and date"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Between the Shelves",
      "clock": "July 27 · Tropical Night · 03:40",
      "question": "To erase a record, the person in it must put their name on the request. Whose name will you erase it under?",
      "lead": "Past three in the morning, the bookshop’s 1st floor holds only laptop light and the hum of the fan."
    },
    "c37_reading": {
      "title": "Top 1%",
      "text": "None of the nine gathered at the bookshop suggested looking up their own lines, yet all of them already have. Oh Jinwoo lifts his phone first. 'I’m top 1% in decision speed. Number one overall.' Kwon Dohyun reads the next column aloud. 'Top 1% in reversal rate too, I see.' Laughter shakes the shelves, and Oh Jinwoo insists to the end that 'fixing things fast is a skill too.' Then Han Seoyun, on standby assignment (a personnel measure that leaves you with no duties while you wait for your next post), holds out your line, her lunch bag still in hand. '2023-0412 dissent written: hesitation 0.0 seconds. Verdict: hard to control. Action: raise pressure intensity.' Han Seoyun lowers her voice. 'Because you didn’t hesitate, the next 3 years turned out like this.' The internet’s headline says the opposite. “Analyst Who Wrote Dissent Turns Out to Be Decision-Avoidant.”",
      "memo": [
        "Oh Jinwoo: #1 in decision speed, #1 in reversal rate",
        "Analyst A: 0.0 seconds of hesitation on the dissent -- 'hard to control'",
        "Average hesitation over the next 3 years: 11.4 seconds -- quoted in headlines",
        "Han Seoyun’s lunch: nine rolls of gimbap",
        "Do Yoonha 7.2 seconds, Ban Jaewook 'chose after checking the rules' 312 times"
      ],
      "choices": {
        "c37_reading_claim": {
          "label": "File a formal request to see who wrote the verdict field"
        },
        "c37_reading_own": {
          "label": "Say first, under my real name, that I am Analyst A"
        },
        "c37_reading_quiet": {
          "label": "Keep names hidden and send everyone home to rest tonight"
        },
        "reframe": {
          "label": "First ask what this file is for"
        },
        "c37_reading_evidence_turn": {
          "label": "Dig up the leak account and date"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Between the Shelves",
      "clock": "July 27 · Tropical Night · 21:00",
      "question": "A line says the pressure rose because you did not hesitate. What will you do with this line?",
      "lead": "People who stared at headlines all day drift into the bookshop one by one in the evening."
    },
    "c37_source": {
      "title": "The Seal Was Intact",
      "text": "In the interview room on the 11th floor of the Seoul Central District Prosecutors’ Office, energy-saving rules hold the air conditioner at 28°C. Prosecutor Na Eunho loosens his tie and tears open an ice cream wrapper as he speaks. 'Let me say this up front. It wasn’t us. The boxes we seized were still sealed at the time of the upload. We even have photos of the tape.' He slides a sheet of paper across. It is a statement confirmation naming you as an unsworn witness (someone with no duty to testify who comes in to explain the facts). 'Just confirm the leaked copy matches the original, and we use this file as evidence in the investigation. But then your 0.0 seconds, and the 3 years of hesitation after it, get read aloud in court. The other 62 people’s too.' The ice cream melts down his wrist. He doesn’t wipe it. 'Decide quickly. I’m rude because I’m short on time.'",
      "memo": [
        "Seized boxes: seal intact at the time of upload -- photos secured",
        "Request: a statement confirming the leaked copy matches the original",
        "If confirmed, all 63 people’s records become court evidence",
        "Interview room temperature: 28°C"
      ],
      "choices": {
        "c37_source_protect": {
          "label": "Say I won’t sign without the 63 people’s consent"
        },
        "c37_source_sign": {
          "label": "Confirm it matches, on condition they investigate the leak"
        },
        "c37_source_silent": {
          "label": "Neither confirm nor deny, and keep the interview short"
        },
        "reframe": {
          "label": "First ask what this file is for"
        },
        "c37_source_evidence_turn": {
          "label": "Dig up the leak account and date"
        }
      },
      "place": "Seoul Central District Prosecutors’ Office, 11th Floor · Interview Room",
      "clock": "July 28 · Heat Wave · 14:00",
      "question": "If you confirm the leaked copy matches the original, 63 people’s records are read in court. What will you do with the confirmation?",
      "lead": "The thermometer in the prosecutors’ office lobby reads 31°C, and the interview room is hotter."
    },
    "c37_final": {
      "title": "The Price of Erasing",
      "text": "The statement blamed the leak on an 'outside hack.' In the crisis response meeting room at KD Financial Group headquarters in Yeouido, Do Geonwoo, head of the group’s Crisis Response TF, lays down a two-page proposal, neatly squared. With group money, a digital undertaker (a company paid to find and erase records spread across the internet) will erase the 63 people’s records within a week. 20 million won’s worth per person. The condition is on page two. A confirmation that 'the leaked material is edited, distorted, unofficial material and does not match the facts.' Sign it, and even the original’s admissibility (its standing as evidence in court) is shaken. In the class action (a lawsuit filed jointly by many victims) too. Do Geonwoo smiles politely. 'We’re erasing it for you. Isn’t that what everyone wants?' On your phone is a text from Do Yoonha. 'I want mine erased. I’m sorry.'",
      "memo": [
        "Offer: erase 63 people’s records at group expense -- 20 million won each",
        "English version of the statement: settled first last night on a video call with Kingsdale, New York",
        "Condition: sign a confirmation of 'edited, distorted, unofficial material'",
        "Signing damages the original’s value as evidence -- first hearing August 6",
        "Sunwoo Jin: wants it kept / Do Yoonha: wants it erased"
      ],
      "choices": {
        "c37_final_seal": {
          "label": "Seal the original in court; erase spread copies officially"
        },
        "c37_final_choose": {
          "label": "Refuse to sign and let the 63 choose to erase or keep"
        },
        "c37_final_sign": {
          "label": "Sign it and let group money start erasing tonight"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Financial Group Headquarters, Yeouido · Crisis Response Meeting Room",
      "clock": "July 29 · Heat Wave · 10:00",
      "question": "In return for erasing the records, they want you to sign that the records are false. What will you do?",
      "lead": "The group statement scrolls across the lobby display. 'We are victims too.'"
    },
    "c37_aftershock": {
      "title": "Request No. 4,871",
      "text": "Five in the morning on July 30, on the 1st floor of the bookshop, where the tropical nights have finally let up. Two fans are off, and watermelon rinds are piled high on a tray. In three days, the group chat of the 13 people who could be reached has filled with 2,300 messages. Sunwoo Jin has just sent a photo. The sun rises over the sea at Gujwa, and there is a new entry in the Slow Island guestbook. 'July 28. I collapsed that day too.' Closing her laptop, Lee Minseo says the number of the last takedown request. No. 4,871. Kang Taemin is snoring, and Oh Jinwoo mumbles 'top 1%' even in his sleep. Then a text comes from Moon Gaeul. 'The plaintiff list is final. 1,740 people. The first hearing (the court session where both sides present their claims and evidence) is August 6, they say. I hear their side has eight lawyers. How many people should I make rice cakes for?'",
      "memo": [
        "4,871 takedown requests -- three days",
        "2,300 messages in the group chat of the 13 reached",
        "1,740 plaintiffs confirmed, first hearing August 6",
        "The group hires 8 lawyers"
      ],
      "choices": {
        "c37_after_rush": {
          "label": "Go straight after where the leaked file first circulated"
        },
        "c37_after_warm": {
          "label": "Read each other’s records to the end, no one leaving first"
        },
        "c37_after_record": {
          "label": "File the takedowns and a leak inquiry as official letters"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Between the Shelves",
      "clock": "July 30 · Tropical Nights End · 05:00",
      "question": "Three nights are over, and the first hearing date for 1,740 plaintiffs has come. How will you close this dawn?"
    },
    "c37_mirror": {
      "title": "The Rankings",
      "text": "At 5:10 in the morning, Ryu Seah calls. You can hear the label printer around her neck clicking. 'Someone made a mirror site (a site that copies the original exactly and puts it up at another address). It’s not just a copy. It has rankings.' 'Hesitation ranking,' 'decision speed ranking,' and a vote for 'the analyst who broke first.' Number one is participant 01, Sunwoo Jin. 8,000 votes. Ryu Seah is quiet for a long time, then adds one thing. 'You know I love sticking labels on things. But I’ve never seen labels like these stuck on people.'",
      "memo": [
        "Mirror site: 3 rankings -- with voting",
        "#1 in 'the analyst who broke first': participant 01",
        "Sunwoo Jin doesn’t know about this site yet"
      ],
      "choices": {
        "c37_mirror_choice_1": {
          "label": "Tell the people on the rankings first and decide together"
        },
        "c37_mirror_choice_2": {
          "label": "Trace the mirror site’s server and operator on record"
        },
        "c37_mirror_choice_3": {
          "label": "Ignore the rankings and focus on removing the original file"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Stair Landing",
      "clock": "July 27 · 05:10",
      "question": "The leaked records have become a vote for 'the analyst who broke first.' What will you do about these rankings?"
    },
    "c37_comments": {
      "title": "7 Seconds Is Time to Think",
      "text": "The next morning, Do Yoonha sits at his window at Gangseo Branch as usual. The customer holding ticket No. 12 starts to hand over a bankbook, then stops to look at a phone. The comments under the article have passed 30,000. 'You want me to trust my money to someone who hesitates for 7 seconds?' Then Lee Jungsook gets up from a chair in the banking hall. She is the 72-year-old retired teacher who took down fund explanations like dictation. On the back of a number ticket she writes, letter by letter. '7 seconds is time to think.' Then she points to one comment. 'I hear some companies pick people using these records. Is this why I failed my interview?' For the first time, Do Yoonha switches off the window microphone.",
      "memo": [
        "Comments under the article: 32,000",
        "Back of Lee Jungsook’s number ticket: '7 seconds is time to think'",
        "Comment from a rejected applicant: 'companies that pick people with these records'"
      ],
      "choices": {
        "c37_comments_choice_2": {
          "label": "Collect abusive comments by date as material for legal action"
        },
        "c37_comments_choice_3": {
          "label": "Take Do Yoonha off the window today and tell him not to read"
        },
        "c37_comments_choice_1": {
          "label": "Explain what the 7 seconds mean to customers, with Lee Jungsook"
        }
      },
      "place": "KD Bank Gangseo Branch · Banking Hall",
      "clock": "July 28 · Heat Wave · 09:10",
      "question": "A comment about 'someone who hesitates for 7 seconds' reaches Do Yoonha at his window. What will you do?"
    },
    "c37_island": {
      "title": "Effect Confirmed",
      "text": "At ten at night, as you walk the alley outside the prosecutors’ office, a call comes from a Jeju number. It is Sunwoo Jin. The gaps between his words are still long. 'I saw... mine. July 28, 2022, 3:02 a.m. Participant 01 dropped out. Pressure raised to level 2, effect confirmed.' You can hear waves. 'Effect confirmed, it says. Me collapsing.' After a long while he laughs. 'But strangely... I feel a bit lighter. It wasn’t because I was weak.' Today a guest wrote in the guestbook before leaving, he says. 'Boss, I collapsed at work that day too.' Sunwoo Jin speaks slowly. 'Don’t erase my line. I want to keep it. Under my own name.'",
      "memo": [
        "Participant 01: 2022-07-28 03:02 'dropped out -- effect confirmed'",
        "Slow Island guestbook: a guest who collapsed the same day",
        "Sunwoo Jin’s wish: keep it under his real name, not erase it"
      ],
      "choices": {
        "c37_island_choice_3": {
          "label": "Say feelings are raw now and suggest waiting a few days"
        },
        "c37_island_choice_2": {
          "label": "Keep it, but seal it so it serves only as court evidence"
        },
        "c37_island_choice_1": {
          "label": "Find a way to keep his line under his real name, as he wishes"
        }
      },
      "place": "Outside the Prosecutors’ Office, Seocho-dong · Alley",
      "clock": "July 28 · Tropical Night · 22:00",
      "question": "Sunwoo Jin wants his record kept under his real name, not erased. What will you do?"
    },
    "c37_mirror_reaction": {
      "title": "9 a.m. Embargo",
      "text": "At six thirty in the morning, Seo Harin calls from the newsroom. Behind her you can hear Jeongjeong, the newsroom cat, walking across a keyboard. 'We got the file too. By tip email. No sender.' Leadline is preparing a story on how the leak happened, and the embargo (an agreed delay on when a story can run) lifts at 9 this morning. Seo Harin checks the record button and asks. 'Other outlets are already graphing Analyst A’s hesitation. If we don’t write it, that graph becomes the story. Your name, what should we do with it?'",
      "memo": [
        "A tip email with no tipster",
        "0.0 seconds, made into a graph"
      ],
      "choices": {
        "c37_mirror_reaction_choice_1": {
          "label": "Ask them not to print a single letter of anyone’s name"
        },
        "c37_mirror_reaction_choice_3": {
          "label": "Say it will spread anyway, so write it properly first"
        },
        "c37_mirror_reaction_choice_2": {
          "label": "Ask them to write how it leaked and leave out the contents"
        }
      },
      "place": "Leadline Newsroom",
      "clock": "July 27 · 06:30 · Embargo 9 a.m.",
      "question": "Other outlets are graphing your hesitation. What will you ask of Leadline?"
    },
    "c37_comments_reaction": {
      "title": "The Useful Kind",
      "text": "At lunchtime, Oh Jinwoo sits on the lobby stairs of Bridge Bank. Yesterday he was boasting about the top 1%; today he has seen the remarks field in the original. 'Overreacts to reward stimuli. Controllable with promises of promotion.' He laughs. 'I was on the winning side here too. No, not winning. I was the useful kind.' His phone buzzes. A text from his father, Oh Sangchul. 'Still, they say you came first. Have you eaten?' Oh Jinwoo looks at the screen a long time, then turns it face down. 'My father thinks this is praise. So did I, until yesterday.'",
      "memo": [
        "Overreacts to reward stimuli",
        "The father of No. 1, asking if he’s eaten"
      ],
      "choices": {
        "c37_comments_reaction_choice_2": {
          "label": "Find the note writer’s name in the original and write it down"
        },
        "c37_comments_reaction_choice_3": {
          "label": "Laugh it off today and send Oh Jinwoo back to work"
        },
        "c37_comments_reaction_choice_1": {
          "label": "Tell Oh Jinwoo the note is a record of whoever wrote it"
        }
      },
      "place": "Bridge Bank, Yeouido · Lobby",
      "clock": "July 28 · Heat Wave · 12:20",
      "question": "The top 1%’s remarks field says 'controllable with promises of promotion.' What will you do for Oh Jinwoo?"
    },
    "c37_island_reaction": {
      "title": "Approved: H",
      "text": "Near midnight, Han Seoyun calls you up to the roof of her apartment building. Five months into her standby assignment, she has packed a lunch every day, left it at the bookshop and gone home. She holds out her phone. In the response records, Han Seoyun is not a participant but 'Manager H.' 'Analyst A · raise pressure intensity · approved: H.' The date is your first week after you were sent down to Trigger Lab. 'I signed this field. After reading only the first page. Just like when I returned your dissent.' She grips the railing. 'I want to apologize. But I’m scared my apology will become someone’s headline again.'",
      "memo": [
        "Manager H’s approval field",
        "An apology afraid of becoming a headline"
      ],
      "choices": {
        "c37_island_reaction_choice_3": {
          "label": "Stop Han Seoyun; the group would use an apology now"
        },
        "c37_island_reaction_choice_1": {
          "label": "Give Han Seoyun a place to speak to the people in the records"
        },
        "c37_island_reaction_choice_2": {
          "label": "Have her give the approval record to prosecutors first"
        }
      },
      "place": "Han Seoyun’s Apartment, Seongsan-dong · Rooftop",
      "clock": "July 28 · Tropical Night · 23:40",
      "question": "Han Seoyun’s signature is in the approval field that raised your pressure intensity. What will you do with her apology?"
    },
    "c37_branch_rooftop": {
      "title": "L, Again",
      "text": "At four thirty in the morning, Lee Minseo, who said she would pop home for a bit, calls after 20 minutes. She is on the roof by her rooftop room. A new post has gone up on the community. 'Leaker identified: L, a former KD Data Lab contract worker.' The comments even link articles about last year’s case. Her younger brother Lee Chanbin, now a college freshman, texts from the bottom of the stairs. 'Sis, two reporters at the front gate.' Lee Minseo starts to laugh and stops. 'Last year it was 11 seconds, and this time it’s 380,000 lines. I’m always the easy one to point at.' The ID lanyard hanging on the clothesline sways in the hot wind.",
      "memo": [
        "Community post: 'Leaker identified -- former contract worker L'",
        "Last year’s 'missing 11 seconds' article reshared 4,000 times",
        "2 reporters at the front gate",
        "Lee Chanbin: 1st-year college student, summer break"
      ],
      "choices": {
        "c37_branch_rooftop_b": {
          "label": "Pull Lee Minseo’s access logs and build proof she’s innocent"
        },
        "c37_branch_rooftop_c": {
          "label": "Get Lee Minseo somewhere safe today and say nothing"
        },
        "c37_branch_rooftop_a": {
          "label": "Go down with Lee Minseo to the reporters and stand by her"
        }
      },
      "place": "Lee Minseo’s Rooftop Room · Rooftop",
      "clock": "July 27 · Tropical Night · 04:30",
      "question": "The internet has pointed at Lee Minseo as the leaker again. What will you do about the reporters at the gate?"
    },
    "c37_branch_rooftop_follow": {
      "title": "After the 11 Seconds",
      "text": "Around daybreak, Lee Minseo opens her laptop. Her KD Data Lab account lost its permission to the response records folder on the afternoon of July 25. All she got was a one-line notice that said 'security check.' That was a day before the file was made. 'My account can only see access logs. It couldn’t have made this file. I can prove it.' She pauses. 'But if I only prove that, I’m the one who gets out alone again.' Lee Chanbin comes up, sets down two convenience-store iced coffees and taps his sister on the shoulder. Lee Minseo puts her own line on the screen. 'A-017 · average hesitation when requesting record corrections: 2.1 seconds.' 'I want to make my line public myself. Before someone else reads it out.'",
      "memo": [
        "Lee Minseo’s folder permission revoked: July 25, 15:00 -- a day before the file was made",
        "Reason given: a one-line 'security check' notice",
        "A-017: 2.1 seconds of hesitation when requesting record corrections",
        "Lee Chanbin’s two iced coffees"
      ],
      "choices": {
        "c37_branch_rooftop_follow_b": {
          "label": "Give Ban Jaewook the date her access was cut, as evidence"
        },
        "c37_branch_rooftop_follow_a": {
          "label": "Help Lee Minseo open her line first, and put mine up too"
        },
        "c37_branch_rooftop_follow_c": {
          "label": "Talk her out of it and wait for the rumors to cool"
        }
      },
      "place": "Lee Minseo’s Rooftop Room · Rooftop",
      "clock": "July 27 · Daybreak",
      "question": "Lee Minseo wants to make her own line public before anyone else does. How will you help?"
    },
    "c37_route_system": {
      "title": "The Leaked Scoresheet",
      "text": "You press first on where this file is being called up and used right now. ECHO is gone. NOAH, in its place, answers. NOAH, KD Data Lab’s AI review engine (an AI program that judges loan applications automatically), was built to show its grounds for every judgment. 'The 380,000 lines of the leaked file match bundle 3 of my training data (the material an AI learns its judgments from). Similarity (how alike they are) is 100%.' Another line comes up. 'In the last 48 hours, 186 outside requests. They ask me to take job applicants’ response times in this file’s format and give them scores.' NOAH adds one more. 'What leaked is not a record. It is a scoresheet. I refused to score. There was no field to write the reason for refusing.'",
      "memo": [
        "Leaked file = NOAH training bundle 3, 100% similarity",
        "186 outside scoring requests in 48 hours",
        "Request format: job applicants’ response times"
      ],
      "choices": {
        "c37_route_system_ignore": {
          "label": "Set NOAH’s report aside and go back to the takedowns"
        },
        "c37_route_system_block": {
          "label": "Block all outside scoring requests and publish the requesters"
        },
        "c37_route_system_warn": {
          "label": "Warn the 186 requesters that scoring may be illegal"
        },
        "c37_route_system_evidence_turn": {
          "label": "Dig up the leak account and date"
        }
      },
      "place": "KD Data Lab, Pangyo · Data Center",
      "clock": "July 27 · Tropical Night · 04:00",
      "question": "The leaked file is about to be used to score job applicants. What will you do with NOAH’s report?"
    },
    "c37_final_system_route": {
      "title": "A Scoresheet Already Read",
      "text": "Three in the morning on July 29. In the tropical night, the data center’s coolers run without rest. On NOAH’s screen, scoring requests from outside pile up line by line, and each line is stamped 'Refused.' The reason field beside each refusal was never there to begin with. A meeting at Yeouido headquarters is set for ten in the morning. NOAH attaches one paragraph to the end of the list. 'What can be erased is the posts. The scoresheet has already been read, and what has been read cannot be erased. I refuse. I do not know how many machines that do not refuse are out there, or where.'",
      "memo": [
        "Outside scoring requests -- NOAH refused them all, no reason field",
        "Leaked file = NOAH training bundle 3",
        "Group headquarters meeting: today, 10:00"
      ],
      "choices": {
        "c37_final_system_route_a": {
          "label": "Write a clause banning scoring with the leaked records"
        },
        "c37_final_system_route_b": {
          "label": "Make the group pay for removal only and bury the use issue"
        },
        "c37_final_system_route_c": {
          "label": "Issue a record owners’ rights declaration in the 63’s names"
        }
      },
      "place": "KD Data Lab, Pangyo · Data Center",
      "clock": "July 29 · Tropical Night · 03:00",
      "question": "The scoresheet has already been read, and NOAH is the only machine refusing. Where will you draw the line so a read scoresheet cannot measure people?"
    },
    "c37_evidence_turn": {
      "title": "A Sorted Leak",
      "text": "When you slot the clue into the creation-time field, the leaked file’s metadata (the creation time and author information hidden inside a file) opens. Created July 26 at 21:40, the moment you were being handed a peach under the persimmon tree in Hannam-dong. The creating account is 'fs-demo-kd07.' It is a demo server account of FitScore, a hiring-assessment company; the issue was requested by KD Financial Group’s Group Strategy Office, and the issue date is July 20, the day the invitation card came. The file is not in the original order either. The records of the seven people filed as witnesses in next week’s class action (a lawsuit filed jointly by many victims) are gathered at the very front. Ban Jaewook closes the notebook he was writing in. 'The group will announce an outside hack. Hacks don’t change the order. The one who changes the order is someone who knows who will read it.'",
      "memo": [
        "Creating account fs-demo-kd07 -- FitScore demo server",
        "Issue requested by: Group Strategy Office, the day the invitation came",
        "Sort order: the records of the 7 class-action witnesses at the front"
      ],
      "choices": {
        "c37_evidence_turn_hold": {
          "label": "Hold the account issue record until the first hearing"
        },
        "c37_evidence_turn_expose": {
          "label": "Give the metadata to prosecutors and the FSS at once, publicly"
        },
        "c37_evidence_turn_tell": {
          "label": "Tell the witnesses placed at the front of the sort first"
        }
      },
      "place": "KD Data Lab, Pangyo · Server Room",
      "clock": "July 29 · Tropical Night · 04:00",
      "question": "The file the group will call a hack came from an account the group opened, sorted in witness order. How will you use this record?"
    },
    "c37_start_warm": {
      "title": "Between Shelves Instead of at a Table",
      "text": "You had the truck turned around on its way down the Hannam-dong hill and went straight to the 1st floor of the Hoegi-dong secondhand bookshop. The rice cakes Moon Gaeul sent along were split into six pieces, and Kang Taemin, who said he couldn’t remember the name of a single dish at the chairman’s house, acted out the table with 'dish No. 3, dish No. 4.' At two in the morning on July 27, once the laughter has settled, six phones ring at once. The folder Lee Minseo mentioned is all out. 380,000 lines of Trigger Lab response records, 63 participants, the seconds of hesitation for every choice. Do Yoonha is the first to look for his own line, then stops. 'I can’t read this where everyone can see.'",
      "memo": [
        "TL_full.zip -- 380,000 lines, 63 participants",
        "6 people gathered on the bookshop’s 1st floor, six pieces of rice cake",
        "Do Yoonha: stopped while looking for his own line"
      ],
      "choices": {
        "c37_start_warm_verify": {
          "label": "Check it line by line against the original copy first"
        },
        "c37_start_warm_signature": {
          "label": "Open the file with everyone here and cover each other’s lines"
        },
        "c37_start_warm_report": {
          "label": "Send the board operator a takedown request right away"
        },
        "c37_start_warm_call": {
          "label": "Call the colleagues in the records before opening the file"
        },
        "c37_start_warm_reframe": {
          "label": "First ask what this file is for"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Between the Shelves",
      "clock": "July 27 · Tropical Night · 02:10",
      "question": "The records of all six people in the room went public at once. What will you do first in this room?",
      "lead": "The night you come back from Chairman Seo Dokyung’s table, the bookshop’s 1st floor is crowded with six people escaping the tropical night."
    },
    "c37_start_record": {
      "title": "The Last Line of the Statement",
      "text": "That night you put everything the chairman said at the table into your written statement, without leaving out a single line. Even the sentence telling you to go along with cutting off the tail (putting all the blame on one person below while those above walk away). The price was the compliance officer’s seat (the person inside a company who watches whether it follows the law and its rules). At two in the morning on July 27, as you sign the last line, all 380,000 lines of Trigger Lab response records are dumped whole onto an anonymous community. Ban Jaewook, on a tour of regional offices, calls from an early train. 'Have you seen who is on the file’s first line? Analyst A. In the original order, cohort 1 should come first. Someone changed the order.' The ink on the signed statement isn’t dry yet.",
      "memo": [
        "Statement of the chairman’s words -- signed early this morning",
        "All 380,000 lines leaked while you were signing",
        "First line of the file: Analyst A -- not the original order"
      ],
      "choices": {
        "c37_start_record_verify": {
          "label": "Check it line by line against the original copy first"
        },
        "c37_start_record_signature": {
          "label": "Add the leak time to the statement and send it to prosecutors"
        },
        "c37_start_record_call": {
          "label": "Call the colleagues in the records before opening the file"
        },
        "c37_start_record_report": {
          "label": "Send the board operator a takedown request right away"
        },
        "c37_start_record_reframe": {
          "label": "First ask what this file is for"
        }
      },
      "place": "Your Studio, Mangwon-dong · Rooftop",
      "clock": "July 27 · Tropical Night · 02:20",
      "question": "While you were signing the statement, a file with its order changed was released. How will you handle these overlapping times?",
      "lead": "On the desk lie 11 pages of statement copying out Chairman Seo Dokyung’s sentences."
    },
    "c37_start_rush": {
      "title": "The Dawn of the One Who Ran Ahead",
      "text": "Out of the truck, you went straight to the Yeouido office and first copied the papers that would be used to pin the blame on Yoon Sanghyuk alone. While the copier ran, a nameless account opened the folder once more, and you ran to KD Data Lab in Pangyo with the copies in hand. But the doors would not open before dawn, and your ID card only got you as far as the lobby. At two in the morning on July 27, as you sit on a chair in the dark lobby, your phone rings. It is Oh Jinwoo. 'They say I’m top 1%. Number one overall in decision speed.' His excited voice cuts off a few seconds later. '...Wait. Why is this on the internet?' What was one folder has come out as all 380,000 lines. The hesitation of 63 people is written down to the second, and you are on the first line.",
      "memo": [
        "Papers copied in Yeouido -- KD Data Lab only as far as the lobby",
        "Oh Jinwoo’s first reaction: 'They say I’m top 1%'",
        "First line of the file: Analyst A"
      ],
      "choices": {
        "c37_start_rush_call": {
          "label": "Call the colleagues in the records before opening the file"
        },
        "c37_start_rush_verify": {
          "label": "Check it line by line against the original copy first"
        },
        "c37_start_rush_report": {
          "label": "Send the board operator a takedown request right away"
        },
        "c37_start_rush_signature": {
          "label": "Leave the lobby and secure the original list separately first"
        },
        "c37_start_rush_reframe": {
          "label": "First ask what this file is for"
        }
      },
      "place": "KD Data Lab, Pangyo · Lobby",
      "clock": "July 27 · Tropical Night · 02:05",
      "question": "In the lobby by the locked door, Oh Jinwoo’s boast has turned into a scream. Where will you start?",
      "lead": "Before dawn in Pangyo, the glass door would not open, though you tapped your ID card three times."
    }
  },
  "echoReplies": {
    "c37_start_call": "Of the nine who pick up, six have already read their own lines. The other three hear it first in your voice.",
    "c37_start_verify": "The comparison takes an hour. Not one character of the 380,000 lines is wrong, and meanwhile the view count reaches 400,000.",
    "c37_start_report": "The operator takes the post down within 20 minutes. Before it comes down, 3,000 people have downloaded it.",
    "c37_takedown_consent": "Dawn passes while you ask. Seven of the nine say they will put their names on it, and two cannot answer.",
    "c37_takedown_file": "The report gets a filing number. Processing takes up to 60 days. The copies do not wait 60 days.",
    "c37_takedown_bulk": "Requests in your name go through fast. The records of 62 people who never put their names on anything are cleaned up by your hand.",
    "c37_reading_own": "Once you give your real name, the 'analyst' in the headlines becomes your name. The article’s views triple, and the other 62 people’s lines get read a little less.",
    "c37_reading_claim": "The request is filed. It will take at least ten days before the verdict field’s writer is disclosed, and until then the headline stays as it is.",
    "c37_reading_quiet": "Everyone scatters to sleep. The next morning, the comments under the headline have doubled.",
    "c37_source_protect": "Na Eunho tosses the ice cream stick into the bin. 'Then get the 62 people’s consent. By today.'",
    "c37_source_sign": "Na Eunho has never received a confirmation with conditions before. For the first time, he says 'Fine.' Your 0.0 seconds are now item 9 on the evidence list.",
    "c37_source_silent": "The interview ends after 11 minutes. Na Eunho writes 'On hold' in his notebook, and the confirmation goes into a drawer.",
    "c37_final_choose": "The 13 who were reached answer first. Six erase, five keep, and two say they don’t know yet. The fields for the other 50 are left blank. Do Geonwoo’s proposal goes back with page two torn off.",
    "c37_final_seal": "The original goes to the court vault. The official process for erasing the spread copies is slow, and Do Yoonha’s 7.2 seconds stay on the internet for another month.",
    "c37_final_sign": "From tonight the records disappear fast. Next week in court, the group’s lawyer submits your confirmation as the first piece of evidence.",
    "c37_after_warm": "No one goes home first until the sun is up. The chart you read together to the end turns up again a few days later, in someone’s court filing.",
    "c37_after_record": "The letter gets a document number. A trace remains of the records’ owners using their rights, and anyone can now cite that number.",
    "c37_after_rush": "After you leave, one more photo from Sunwoo Jin goes up in the group chat. You see it in a taxi before dawn, following the trail of the copies.",
    "c37_mirror_choice_1": "Once told, Sunwoo Jin sees the rankings before dawn. One night of sleeping without knowing is gone.",
    "c37_mirror_choice_2": "The server is overseas and the operator uses a pseudonym. The trace records pile up, and so do the votes.",
    "c37_mirror_choice_3": "The originals shrink. The rankings survive on their own, original or not.",
    "c37_comments_choice_1": "A few customers who heard the explanation line up at Do Yoonha’s window again. The wait gets that much longer.",
    "c37_comments_choice_2": "The file grows thick. While organizing it, Do Yoonha ends up reading all 30,000 comments once each.",
    "c37_comments_choice_3": "The window goes quiet. In the break room, Do Yoonha opens the comments anyway.",
    "c37_island_choice_1": "With a real name attached, the line is no longer #1 on the rankings. It becomes the record of a person called Sunwoo Jin. And Slow Island’s address gets out along with it.",
    "c37_island_choice_2": "Sealed, the line is safe. What Sunwoo Jin wanted was not safety but his name.",
    "c37_island_choice_3": "A few days later Sunwoo Jin says the same thing. In the meantime, the votes on the rankings double.",
    "c37_mirror_reaction_choice_1": "Seo Harin takes the names out. The story that runs at 9 is quiet, and another outlet’s graph takes the top search result.",
    "c37_mirror_reaction_choice_2": "The request goes to the editorial meeting. The story runs an hour late, and in that hour three more graphs appear.",
    "c37_mirror_reaction_choice_3": "Leadline’s story becomes the most accurate one. The most accurate story has your 0.0 seconds in it too.",
    "c37_comments_reaction_choice_1": "After a long while Oh Jinwoo nods. Then, for the first time, he replies to his father’s text. 'I ate.'",
    "c37_comments_reaction_choice_2": "The remarks field’s author code is 'GS-07.' The seventh account of the Group Strategy Office. Oh Jinwoo saves the code in his phone’s notes.",
    "c37_comments_reaction_choice_3": "Oh Jinwoo laughs and goes back to the lobby. In the afternoon meeting, he decides three times faster than usual.",
    "c37_island_reaction_choice_1": "A long post from Han Seoyun goes up in the group chat. The first reply is from Sunwoo Jin. 'I’ll read it slowly.'",
    "c37_island_reaction_choice_2": "One line of a statement lasts a long time in court. The apology is put off until after.",
    "c37_island_reaction_choice_3": "Stopped, Han Seoyun picks up her lunch bag and goes home. The apology becomes no one’s headline, and it reaches no one.",
    "c37_branch_rooftop_a": "As you go down together, both reporters raise their cameras at once. Lee Minseo grabs your sleeve once, then lets go.",
    "c37_branch_rooftop_b": "The access logs are exact. An exact record invites the next question: 'Then who did it?'",
    "c37_branch_rooftop_c": "Lee Minseo hides in Kang Taemin’s truck. That day a post goes up on the community: 'L goes into hiding.'",
    "c37_branch_rooftop_follow_a": "When the two lines go up side by side, marked only by codes, a comment appears that the rankings never had. 'These people are showing their own first.'",
    "c37_branch_rooftop_follow_b": "Ban Jaewook copies the date onto the first page of his notebook. Lee Minseo’s innocence becomes an official record, and Lee Minseo herself becomes evidence again.",
    "c37_branch_rooftop_follow_c": "The rumors don’t cool. Two days later, closing her laptop, Lee Minseo says, 'It was like this back then too.'",
    "c37_route_system_block": "The list of requesters behind the 186 blocked requests goes public. 41 of them are hiring-assessment companies, and the one that asked most often is FitScore.",
    "c37_route_system_warn": "Half of those warned write back. 'We only used it for reference.' It takes a day for reference to become scoring.",
    "c37_route_system_ignore": "The takedowns go on. On NOAH’s screen, the request count keeps climbing past 186.",
    "c37_final_system_route_a": "With the ban in place, the scoresheet becomes illegal. There is still no clause that brings back the applicants already rejected.",
    "c37_final_system_route_b": "The group pays for the removal. Outside the group, the scoresheet quietly stays in use.",
    "c37_final_system_route_c": "11 of the 63 sign the declaration first. The fields for the 52 not yet reached are left blank in it too.",
    "c37_evidence_turn_expose": "Once the metadata is public, the group’s 'outside hack' statement comes off its website two hours after it went up. The group’s Crisis Response TF, which issued it, stops answering the phone.",
    "c37_evidence_turn_hold": "The issue record sits in your drawer. Meanwhile the seven witnesses at the front prepare for court without knowing why their records come first.",
    "c37_evidence_turn_tell": "When the seven are told, two say they will stop being witnesses. Moon Gaeul takes rice cakes and visits those two homes one after the other.",
    "c37_takedown_evidence_turn": "Lay the time on top, and the word hack has less room to stand. It also shows whom the file was put together to be read by first.",
    "c37_reading_evidence_turn": "Lay the time on top, and the word hack has less room to stand. It also shows whom the file was put together to be read by first.",
    "c37_source_evidence_turn": "Lay the time on top, and the word hack has less room to stand. It also shows whom the file was put together to be read by first.",
    "c37_route_system_evidence_turn": "Lay the time on top, and the word hack has less room to stand. It also shows whom the file was put together to be read by first.",
    "case37_memory_system": "What is stamped in the verdict field is not your judgment but a score. NOAH opens the request records of who outside is asking for that score.",
    "case37_memory_evidence": "Lay the table’s times over the file, and the file was made just as the dessert peaches came out. The account that made it carries the name of the department that requested it.",
    "c37_start_warm_call": "Of the nine who pick up, six have already read their own lines. The other three hear it first in your voice.",
    "c37_start_warm_verify": "The comparison takes an hour. Not one character of the 380,000 lines is wrong, and meanwhile the view count reaches 400,000.",
    "c37_start_warm_report": "The operator takes the post down within 20 minutes. Before it comes down, 3,000 people have downloaded it.",
    "c37_start_warm_signature": "When everyone agrees to read only other people’s lines, Do Yoonha manages a smile. But no one yet knows how their own line was written.",
    "c37_start_record_call": "Of the nine who pick up, six have already read their own lines. The other three hear it first in your voice.",
    "c37_start_record_verify": "The comparison takes an hour. Not one character of the 380,000 lines is wrong, and meanwhile the view count reaches 400,000.",
    "c37_start_record_report": "The operator takes the post down within 20 minutes. Before it comes down, 3,000 people have downloaded it.",
    "c37_start_record_signature": "With that added line, the statement becomes a record of both the table and the leak. Na Eunho doesn’t reply; instead, an interview is scheduled for the next afternoon.",
    "c37_start_rush_call": "Of the nine who pick up, six have already read their own lines. The other three hear it first in your voice.",
    "c37_start_rush_verify": "The comparison takes an hour. Not one character of the 380,000 lines is wrong, and meanwhile the view count reaches 400,000.",
    "c37_start_rush_report": "The operator takes the post down within 20 minutes. Before it comes down, 3,000 people have downloaded it.",
    "c37_start_rush_signature": "The original list stays in your hands. Meanwhile Oh Jinwoo reads his own line to the end, alone."
  },
  "choiceVoiceLines": {
    "c37_start_call": "Saying they can’t hear it from strangers, you call the colleagues in the records before you open the file.",
    "c37_start_verify": "So no one moves in a panic over a fake, you check it line by line against the original copy to see if it is real.",
    "c37_start_report": "Saying it will be too late once the copies spread further, you send the board operator a takedown request right away.",
    "c37_takedown_consent": "Saying whether to come forward is each person’s own call, you ask everyone you can reach whether they will put their name on it.",
    "c37_takedown_file": "Saying one takedown at a time will never catch up, you formally file a leak report with the Personal Information Protection Commission.",
    "c37_takedown_bulk": "Because you can’t make others put their names on the line too, you put off confirming with each person and request a bulk takedown in your own name.",
    "c37_reading_own": "Before you are called by a headline someone else wrote, you say first, under your real name, that you are Analyst A.",
    "c37_reading_claim": "Saying even a verdict has a writer, you formally request access to the original to see who wrote the verdict field.",
    "c37_reading_quiet": "Saying a night spent reading your own line is first of all a night to get through, you keep the names hidden and send everyone off to rest.",
    "c37_source_protect": "Saying you can’t let other people’s hesitation be read aloud in court too, you tell him you won’t sign the confirmation without the 63 people’s consent.",
    "c37_source_sign": "Saying that using it as evidence means finding out who released it, you confirm it matches the original on condition that they investigate the leak.",
    "c37_source_silent": "Saying nothing either way can be taken back right now, you neither confirm nor deny and keep the interview short.",
    "c37_final_choose": "Saying Do Yoonha and Sunwoo Jin answered differently, you refuse the confirmation and let each of the 63 decide whether to erase or keep.",
    "c37_final_seal": "Saying you must protect both the evidence and the people, you seal the original with the court and erase only the spread copies through official channels.",
    "c37_final_sign": "Because you can’t make the one who texted that they want it erased wait any longer, you sign the confirmation and let group money start erasing tonight.",
    "c37_after_warm": "Saying a line read alone stays alone, you read each other’s records to the end together, with no one leaving first.",
    "c37_after_record": "So the 4,871 requests don’t scatter as mere words, you file the takedown requests and a request to look into the leak as official letters.",
    "c37_after_rush": "Saying you need to know who released it before the first hearing, you go straight after the trail of where the leaked file first circulated.",
    "c37_mirror_choice_1": "Because you can’t let Sunwoo Jin learn he is #1 from someone else, you tell the people on the rankings first and decide the response together.",
    "c37_mirror_choice_2": "Saying whoever stuck on the labels has a name too, you trace the mirror site’s server location and operator on record.",
    "c37_mirror_choice_3": "Saying you don’t have the hands to chase the rankings too, you ignore them and focus only on removing the original file.",
    "c37_comments_choice_1": "So the words on the back of that ticket travel farther than the comments, you explain the meaning of the 7 seconds to the customers in the hall yourself, with Lee Jungsook.",
    "c37_comments_choice_2": "So the 30,000 don’t just wash away, you collect the abusive comments by date and organize them as material for legal action.",
    "c37_comments_choice_3": "Saying you can’t leave him sitting in front of those comments, you take Do Yoonha off the window today and tell him not to read them.",
    "c37_island_choice_1": "Because he means to take back the day he collapsed under his own name, you look for a way to keep Sunwoo Jin’s line under his real name, as he wishes.",
    "c37_island_choice_2": "So that even if it is kept, it serves only as court evidence and not as a ranking, you suggest going through a sealing procedure.",
    "c37_island_choice_3": "Saying that right after seeing the record is a time when feelings run raw, you suggest putting off the decision for a few days.",
    "c37_mirror_reaction_choice_1": "Saying the 62 never agreed to be printed, you ask her not to write a single letter of the names of anyone in the records.",
    "c37_mirror_reaction_choice_2": "Saying the story should be who released it, you formally request that they write how it leaked first and leave out what the records say.",
    "c37_mirror_reaction_choice_3": "If it will spread as graphs anyway, you tell her, Leadline should write it properly first.",
    "c37_comments_reaction_choice_1": "So he doesn’t swallow the words the useful kind on his own, you tell Oh Jinwoo that the note is a record not of him but of whoever wrote it.",
    "c37_comments_reaction_choice_2": "Saying even a remarks field has a hand that wrote it, you find the name of the note’s writer in the original and write it down.",
    "c37_comments_reaction_choice_3": "Saying digging deeper would only hurt more today, you laugh it off and send Oh Jinwoo back to work.",
    "c37_island_reaction_choice_1": "So Han Seoyun can speak directly to the people in the records without going through a headline, you make a place for her to do it.",
    "c37_island_reaction_choice_2": "Saying an apology can vanish but a signature stays, you have her put the approval record in a statement to prosecutors before apologizing.",
    "c37_island_reaction_choice_3": "Saying the group would use those very words if she apologized now, you stop Han Seoyun.",
    "c37_branch_rooftop_a": "Not wanting her singled out alone this time, you go down with Lee Minseo to face the reporters and stand by her.",
    "c37_branch_rooftop_b": "Saying the finger-pointing must be stopped with facts before it sets, you pull Lee Minseo’s access logs and build proof that she is innocent.",
    "c37_branch_rooftop_c": "Saying anything said in front of reporters becomes a story, you get Lee Minseo somewhere safe today and say nothing.",
    "c37_branch_rooftop_follow_a": "So this doesn’t end as proof that gets only her out, you help Lee Minseo make her own line public first and put yours up with it.",
    "c37_branch_rooftop_follow_b": "Saying rumors have to be ended with evidence, you hand Ban Jaewook the date her access was cut as formal evidence.",
    "c37_branch_rooftop_follow_c": "Saying today, with reporters at the gate, is not the day, you talk her out of going public and suggest waiting for the rumors to cool.",
    "c37_route_system_block": "Saying people need to know who tried to score human beings, you block every outside scoring request and publish the list of requesters.",
    "c37_route_system_warn": "So you can stop first those who are using it without knowing, you send the 186 requesters a warning that scoring may be illegal.",
    "c37_route_system_ignore": "Saying stopping the spread is more urgent, you set NOAH’s report aside and go back to the takedowns.",
    "c37_final_system_route_a": "So the machines that do not refuse can’t score people with the leaked response records, you write a clause banning their use.",
    "c37_final_system_route_b": "Saying this is as much as today’s meeting can win, you make the group pay only for the removal and bury the question of use.",
    "c37_final_system_route_c": "Saying you must first establish who owns the records that were read, you issue a declaration of record owners’ rights in the 63 people’s names.",
    "c37_evidence_turn_expose": "So it can’t be buried in any one place, you hand the metadata to prosecutors and the FSS at the same time and make it public.",
    "c37_evidence_turn_hold": "To give the group no room to get its story straight, you hold the account issue record until the day of the first hearing.",
    "c37_evidence_turn_tell": "So the people who were targeted don’t walk into court unaware, you first tell the witnesses placed at the front of the sort order.",
    "c37_takedown_evidence_turn": "You lay the leaked file’s creation time over the clue and work out who put this file together, and in what order.",
    "c37_reading_evidence_turn": "You lay the leaked file’s creation time over the clue and work out who put this file together, and in what order.",
    "c37_source_evidence_turn": "You lay the leaked file’s creation time over the clue and work out who put this file together, and in what order.",
    "c37_route_system_evidence_turn": "You lay the leaked file’s creation time over the clue and work out who put this file together, and in what order.",
    "c37_start_warm_call": "Saying they can’t hear it from strangers, you call the colleagues in the records before you open the file.",
    "c37_start_warm_verify": "So no one moves in a panic over a fake, you check it line by line against the original copy to see if it is real.",
    "c37_start_warm_report": "Saying it will be too late once the copies spread further, you send the board operator a takedown request right away.",
    "c37_start_warm_signature": "Not wanting to leave Do Yoonha alone when he says he can’t read it, you open the file with the colleagues gathered there and cover each other’s lines.",
    "c37_start_record_call": "Saying they can’t hear it from strangers, you call the colleagues in the records before you open the file.",
    "c37_start_record_verify": "So no one moves in a panic over a fake, you check it line by line against the original copy to see if it is real.",
    "c37_start_record_report": "Saying it will be too late once the copies spread further, you send the board operator a takedown request right away.",
    "c37_start_record_signature": "To put on record that the statement and the leak happened the same night, you add one line with the leak time to the signed statement and send it to prosecutors.",
    "c37_start_rush_call": "Saying they can’t hear it from strangers, you call the colleagues in the records before you open the file.",
    "c37_start_rush_verify": "So no one moves in a panic over a fake, you check it line by line against the original copy to see if it is real.",
    "c37_start_rush_report": "Saying it will be too late once the copies spread further, you send the board operator a takedown request right away.",
    "c37_start_rush_signature": "Because you can’t waste more time at a closed door, you get out of the lobby and secure the original list separately first."
  },
  "pack": {
    "clue": {
      "title": "A Sorted Leak",
      "text": "The leaked file was made with an account on FitScore’s demo server, and the Group Strategy Office requested that account on the day the chairman’s invitation card came. The file was made while that table was set. It was sorted so that the records of the seven class-action witnesses came first."
    },
    "outcomes": {
      "c37_after_warm": {
        "tag": "Read Together",
        "title": "No one left first; you read each other’s records to the end",
        "text": "Even at the end of three nights, no one on the bookshop’s 1st floor went home first. Everyone looked at Sunwoo Jin’s sunrise photo from Gujwa on the same screen."
      },
      "c37_after_record": {
        "tag": "Left in Official Letters",
        "title": "The takedown and inquiry requests became official letters",
        "text": "In the names of the 13 who were reached, the takedown requests and the request to look into the leak received official document numbers. The people whose records were taken became, for the first time, the ones leaving a record."
      },
      "c37_after_rush": {
        "tag": "Followed the Trail",
        "title": "You went straight after where the leaked file first circulated",
        "text": "You left your sleeping colleagues and set off after the trail of the copies. Moon Gaeul’s rice cake order form said 'eight more people’s worth.'"
      }
    },
    "continuityChallenges": {
      "c36_after_warm": {
        "title": "Standing by the colleagues you turned the truck around for",
        "text": "The colleagues who first listened to the story of the table have now become names in the records. Trust leans toward the side that looks after their records before your own."
      },
      "c36_after_record": {
        "title": "Matching the statement against the leak time",
        "text": "The file came out while you were copying the chairman’s sentences into your statement. The two times that look like coincidence only join into one line after you reset the board."
      },
      "c36_after_rush": {
        "title": "Owning up to the night at the locked door",
        "text": "While you copied papers and ran to Pangyo alone, all your colleagues’ records came out. Telling your colleagues first about that night at the locked door is the first step toward fairness."
      }
    }
  }
};
