/**
 * 사건 21 (src/nodes/case21.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c21_start": {
      "title": "The Bottom Line",
      "text": "On the day NOAH’s official launch is set for February 10, Lee Minseo scrolls NOAH’s training data list all the way down. At the very bottom, on the oldest line, it reads: 'TL Cohort 1 · Participant 01 · March–September 2022 · No consent form.' A year before Trigger Lab existed, someone sat in the same basement first. The name is Sunwoo Jin, who left the company that autumn and now runs a guesthouse in a converted tangerine warehouse in Gujwa, Jeju. The same day, Ryu Seah sends a message. 'Legal sent retroactive consent forms to past participants by registered mail. With a 3 million won thank-you payment attached. The first envelope went to Jeju.' When you ask Han Seoyun about Cohort 1, she only says, 'That was before my time,' and turns off her monitor.",
      "memo": [
        "NOAH official launch February 10 -- D-6",
        "Participant 01 Sunwoo Jin: Cohort 1 analyst, March–September 2022",
        "No consent record -- retroactive consent form sent by registered mail",
        "3 million won thank-you payment, on condition of a reply by the day before launch"
      ],
      "choices": {
        "c21_start_call": {
          "label": "Call the guesthouse and feel out whether the envelope has arrived"
        },
        "c21_start_origin": {
          "label": "Find Participant 01’s original records in the archive first"
        },
        "c21_start_visit": {
          "label": "Take the address and go down to Gujwa, Jeju in person"
        },
        "reframe": {
          "label": "Ask NOAH to show the basis for its judgment"
        }
      },
      "place": "Trigger Lab 4th Floor Analyst Room",
      "clock": "Early February · NOAH launch in D-6",
      "question": "At the bottom of NOAH’s training list is the first participant, with no consent form. What do you do first?",
      "lead": "Six days before NOAH’s launch, Lee Minseo comes to your desk with the list scrolled all the way down."
    },
    "c21_inn": {
      "title": "Slow Island",
      "text": "At the end of a seaside village in Gujwa, a tangerine warehouse built in 1978 has become the guesthouse 'Slow Island.' Yellow tangerine crates stacked against the basalt walls make bookshelves, and the blackboard reads, 'Check in slowly, check out even more slowly.' Pouring tangerine-peel tea, Sunwoo Jin speaks one word at a time. 'The bank... people. Faces... yes. I was there too. In the basement.' Sunwoo Jin smiles, and remembers those days as a training course called 'Crisis Response Capability Assessment.' Then Sunwoo Jin points to a KD registered envelope on the counter, held down by a single tangerine. 'My old company says it’s giving me money as thanks. I haven’t opened it yet. Nothing’s urgent here.' The reply deadline is stamped on the back of the envelope. February 9.",
      "memo": [
        "Slow Island: four rooms, we are the only guests this week",
        "Sunwoo Jin: remembers those days as 'training'",
        "KD registered envelope -- unopened, reply deadline February 9",
        "The yard dog’s name is 'Kkokji' (a tangerine stem)"
      ],
      "choices": {
        "c21_inn_truth": {
          "label": "Say first that you’re from Trigger Lab, and ask to stay the night"
        },
        "c21_inn_postmark": {
          "label": "Leave the envelope untouched and note only the sending department and deadline"
        },
        "c21_inn_guest": {
          "label": "Put the story off and pay three nights up front as a guest"
        },
        "reframe": {
          "label": "Ask NOAH to show the basis for its judgment"
        },
        "c21_inn_evidence_turn": {
          "label": "Find the department that ordered the Cohort 1 experiment in the documents"
        }
      },
      "place": "Slow Island, Gujwa, Jeju · Tangerine Warehouse Guesthouse",
      "clock": "February 7 · NOAH launch in D-3",
      "question": "Pouring tangerine-peel tea, the first participant points to the unopened envelope. How do you introduce yourself?",
      "lead": "At the end of a seaside village in Gujwa, past the stone wall, a blue tarp covers the roof of a tangerine warehouse."
    },
    "c21_orchard": {
      "title": "Then Don’t Pick at It",
      "text": "Ko Eunbi, who owns the tangerine orchard next door, arrives with 40 empty crates in her truck bed. A cold snap is forecast from tonight, so the remaining 3 tons of tangerines have to be picked today. Ko Eunbi, who said she would never borrow a bank person’s hands, holds out six pairs of shears at Sunwoo Jin’s request. Kang Taemin hauls every 20-kilogram crate by himself and hears, 'That one’s coming back tomorrow too,' while Na Junhyuk, with 30 years of stamping skill, snips each stem in a single cut and hogs all the praise. When Kwon Dohyun starts counting something under his breath, shears in hand, Ko Eunbi’s shears stop. 'Then don’t pick at it.' Kwon Dohyun stops counting and silently fills one more crate. Meanwhile Ko Eunbi comes over to you. 'When Sunwoo Jin first came here, it was three months of picking tangerines without a single word. That letter, Sunwoo Jin was so glad, called it money to fix the roof. Is it really good money?'",
      "memo": [
        "3 tons of tangerines left -- before tonight’s cold snap",
        "40 crates, eight pairs of hands",
        "Slow Island roof: damaged in the last typhoon, repairs 2.8 million won",
        "Ko Eunbi: 3rd-generation tangerine farmer, does not trust banks"
      ],
      "choices": {
        "c21_orchard_hire": {
          "label": "Hire day laborers to take over and meet Sunwoo Jin separately"
        },
        "c21_orchard_terms": {
          "label": "Check the consent form’s terms before answering whether it’s good money"
        },
        "c21_orchard_stay": {
          "label": "Lend a hand until the last tangerines are picked before the cold snap"
        },
        "reframe": {
          "label": "Ask NOAH to show the basis for its judgment"
        },
        "c21_orchard_evidence_turn": {
          "label": "Find the department that ordered the Cohort 1 experiment in the documents"
        }
      },
      "place": "Ko Eunbi’s Tangerine Grove, Gujwa, Jeju · Orchard",
      "clock": "February 8 · Day of the cold snap forecast",
      "question": "While you pick 3 tons of tangerines before the cold snap, someone asks whether that letter is good money. What do you say?",
      "lead": "The 40 empty crates come down from the truck bed at the orchard entrance. The shears are six short."
    },
    "c21_breakwater": {
      "title": "The Stem Gets Bruised",
      "text": "The night the cold snap arrives, Sunwoo Jin walks to the end of the breakwater with a flashlight. Silent until the lighthouse beam has turned four times, Sunwoo Jin finally speaks. 'That training got a little harder every week. When my father collapsed, I asked for leave, and they said no. They said this week was important.' The waves drain away between the breakwater blocks. 'At the end of July, at three in the morning, I got up from my desk and collapsed. My father’s funeral... I went. Late.' Sunwoo Jin takes a tangerine from a pocket and peels it slowly. 'Back then I thought I fell apart because I was weak. So I came here and practiced living slowly. Eunbi’s grandmother told me: pick a tangerine in a hurry and the stem gets bruised.' Sunwoo Jin holds out half the tangerine to you. 'But you people aren’t here on vacation, are you?'",
      "memo": [
        "Sunwoo Jin’s memory matches the Cohort 1 weekly chart dates: second week of July",
        "Father died August 2022 -- after leave was rejected",
        "Reason on the resignation papers: 'personal reasons'",
        "Retroactive consent reply deadline: tomorrow 17:00"
      ],
      "choices": {
        "c21_breakwater_stay": {
          "label": "Sit beside Sunwoo Jin, unhurried, until everything is said"
        },
        "c21_breakwater_admit": {
          "label": "Admit only that it’s not a vacation and put the story off until tomorrow"
        },
        "c21_breakwater_match": {
          "label": "Match each date Sunwoo Jin mentions to the weekly chart and note it down"
        },
        "reframe": {
          "label": "Ask NOAH to show the basis for its judgment"
        },
        "c21_breakwater_evidence_turn": {
          "label": "Find the department that ordered the Cohort 1 experiment in the documents"
        }
      },
      "place": "Gujwa Seaside, Jeju · Breakwater",
      "clock": "February 8 · Cold snap · 23:50",
      "question": "Sunwoo Jin thought the collapse came from being weak, and now asks whether you are really here on vacation. How do you answer?",
      "lead": "The night the cold snap arrives, a single flashlight waits for you at the end of the breakwater, under the turning lighthouse beam."
    },
    "c21_final": {
      "title": "Someone Who Wants to Know",
      "text": "Four in the afternoon: one hour left until the registered-mail cutoff at Gujwa Post Office. Sunwoo Jin sets the unsigned consent form on the counter and sits down across from you. Since the night on the breakwater, Sunwoo Jin has not rushed you once. Kkokji lies at Sunwoo Jin’s feet. 'The night before last, I saw you reading the guestbook. And I heard what Eunbi said this morning.' Sunwoo Jin slowly catches a breath. 'There’s something I don’t know, isn’t there. From that basement 4 years ago.' The photo of the weekly chart Ban Jaewook sent is on your phone, and the rest of Cohort 1’s originals are still in the sealed section. Sunwoo Jin puts the pen down. 'You might tell me, or you might not. Either way, today I have to write something on this paper.'",
      "memo": [
        "Consent form unsigned -- registered-mail cutoff 17:00",
        "What we have: 1 weekly chart, the guestbook sentence, NOAH’s training list",
        "The rest of Cohort 1’s originals are in the B2 sealed section",
        "This choice carries over to the 'first participant' on the last night"
      ],
      "choices": {
        "c21_final_secure": {
          "label": "Lock down Cohort 1’s originals with a preservation request before telling"
        },
        "c21_final_tell": {
          "label": "Show the weekly chart and the guestbook and tell what happened 4 years ago"
        },
        "c21_final_ask": {
          "label": "Before saying anything, ask whether Sunwoo Jin wants to know"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Slow Island, Gujwa, Jeju · Tangerine Warehouse",
      "clock": "February 9 · Registered-mail cutoff 17:00",
      "question": "Sunwoo Jin knows there is something still unknown. One hour before the post office cutoff, what do you do?",
      "lead": "Sunwoo Jin has set the unsigned consent form on the counter and, for the first time, is seated before you are."
    },
    "c21_aftershock": {
      "title": "Tangerines Not Picked in a Hurry",
      "text": "The post office cutoff passes, and snow flurries drift across the yard of Sunwoo Jin’s guesthouse, Slow Island. Ko Eunbi, who owns the orchard next door, presses a box of off-grade tangerines into Kwon Dohyun’s arms and holds out a statement. In the amount field, '0 won'; in the remarks field, 'Don’t pick at it.' Kwon Dohyun folds the statement and tucks it into his wallet. Kang Taemin is told to come back tomorrow for the third time, and Na Junhyuk writes 'I will come again, slowly' in the guestbook, in handwriting as neat as a stamp. Sunwoo Jin hands you a box of tangerines. 'These weren’t picked in a hurry.' Then a text arrives from Moon Gaeul. 'I put in the application today to borrow money for a new machine for To-the-End Precision. They say a new computer does the review. And Hajun starts as an intern at Gangseo Branch after Lunar New Year.'",
      "memo": [
        "Retroactive consent reply deadline passed",
        "One box of off-grade tangerines -- statement 0 won",
        "To-the-End Precision loan application, reviewed by NOAH",
        "Moon Hajun starts a Gangseo Branch internship after the Lunar New Year holiday"
      ],
      "choices": {
        "c21_after_rush": {
          "label": "Fly back up with the tangerine box and look into NOAH’s review"
        },
        "c21_after_warm": {
          "label": "Stay at Slow Island until the last flight and pack tangerine boxes together"
        },
        "c21_after_record": {
          "label": "Draft a records access request guide for Cohort 1 participants"
        }
      },
      "place": "Slow Island, Gujwa, Jeju · Yard in Front of the Tangerine Warehouse",
      "clock": "February 9 · Evening · Snow flurries",
      "question": "Boxes of tangerines change hands in the snow, and To-the-End Precision’s loan has gone to NOAH. How do you close your last evening in Jeju?"
    },
    "c21_guestbook": {
      "title": "12 Guestbooks",
      "text": "Eleven at night: 12 guestbooks stand on a shelf beside the living-room stove. Most of the guests who came here over 4 years were people taking a break from work, and Sunwoo Jin left a handwritten reply under every entry. Turning the pages of one, Lee Minseo stops. One reply looks familiar. 'Count the people first, and the numbers after.' It does not differ by a single letter from the first line of the option-sentence library in Trigger Lab’s case template. Lee Minseo whispers. 'This is the button we pressed every day.'",
      "memo": [
        "12 guestbooks -- Sunwoo Jin’s reply under every entry",
        "Same sentence as option sentence #0001",
        "Library registration date: June 2022"
      ],
      "choices": {
        "c21_guestbook_choice_1": {
          "label": "The guestbook is Sunwoo Jin’s; close it quietly without photos"
        },
        "c21_guestbook_choice_2": {
          "label": "Note the reply dates and option-sentence numbers side by side"
        },
        "c21_guestbook_choice_3": {
          "label": "Just take photos and see to tomorrow’s orchard schedule first"
        }
      },
      "place": "Slow Island, Gujwa, Jeju · Tangerine Warehouse Living Room",
      "clock": "February 7 · 23:00",
      "question": "Sunwoo Jin’s guestbook reply matches Trigger Lab option sentence #0001. What do you do with this guestbook?"
    },
    "c21_storehouse": {
      "title": "+2 Levels",
      "text": "The night the tangerines are all in, Ban Jaewook calls from the B2 archive in Seoul. 'I’ve found Participant 01’s weekly chart. One printout, made for a meeting. The rest of the originals are in the sealed section, and my clearance doesn’t reach that far.' A photo comes through. Second week of July 2022. In the margin beside the response scores is a ballpoint note. 'Participant 01 responses slowing. Adjust pressure intensity +2 levels. Leave request for father’s hospitalization -- recommend rejection.' Right now Sunwoo Jin is on the other side of the warehouse, wiping down crates and whistling.",
      "memo": [
        "1 weekly chart, second week of July 2022",
        "Note: adjust pressure intensity +2 levels, recommend rejecting leave",
        "The rest of Cohort 1’s originals are in the sealed section"
      ],
      "choices": {
        "c21_storehouse_choice_2": {
          "label": "Have the note’s writer and approval line checked against the originals"
        },
        "c21_storehouse_choice_3": {
          "label": "Hand the chart photo to Ryu Seah as grounds to stop NOAH"
        },
        "c21_storehouse_choice_1": {
          "label": "Keep the chart among ourselves until Sunwoo Jin can see it"
        }
      },
      "place": "Slow Island, Gujwa, Jeju · Tangerine Warehouse Counter",
      "clock": "February 8 · Cold snap · 21:40",
      "question": "'Adjust pressure intensity +2 levels' is written in the chart’s margin. What do you do with this one sheet?"
    },
    "c21_letter": {
      "title": "Roof Money",
      "text": "The next morning, Sunwoo Jin opens the envelope at the counter. One thank-you letter, two consent forms. 'I consent to the use of my 2022 capability assessment participation records for research purposes.' Below the signature line is a field for the account to receive the 3 million won thank-you payment, and replies are due by the registered-mail cutoff at Gujwa Post Office at five this afternoon. A message from Ryu Seah comes in with it. Sunwoo Jin is the data subject of those records, and can file an access request before signing. Sunwoo Jin looks up at the blue tarp on the roof. 'If it’s for research... it’ll be used for something good, right? It’s money to fix the roof.' Sunwoo Jin uncaps the pen.",
      "memo": [
        "2 consent forms + 3 million won thank-you payment",
        "Reply cutoff: today 17:00, Gujwa Post Office",
        "Roof repairs 2.8 million won"
      ],
      "choices": {
        "c21_letter_choice_1": {
          "label": "Say first that we’ll find the roof repair money some other way"
        },
        "c21_letter_choice_3": {
          "label": "Ask just to hold off signing today, and step away"
        },
        "c21_letter_choice_2": {
          "label": "Read the consent form line by line with Sunwoo Jin"
        }
      },
      "place": "Slow Island, Gujwa, Jeju · Tangerine Warehouse Counter",
      "clock": "February 9 · 9 a.m.",
      "question": "Calling it roof money, Sunwoo Jin uncaps the pen in front of the consent form. What do you do?"
    },
    "c21_guestbook_reaction": {
      "title": "The Registrant Field",
      "text": "Lee Minseo asked about the registration record for the library’s first line, and Ryu Seah calls back after midnight. 'Of the library’s first 50 sentences, 31 have an empty registrant field. The registration dates are all in the spring and summer of 2022.' She pauses for a moment. 'NOAH builds choices from these sentences too. Even right now. Nobody wrote down who said them first.' Outside the attic window, Kkokji barks once. Downstairs, Sunwoo Jin’s room is already dark, and only the scent of tangerines seeps through the gap in the door.",
      "memo": [
        "31 sentences with an empty registrant field",
        "NOAH still builds choices from these sentences"
      ],
      "choices": {
        "c21_guestbook_reaction_choice_2": {
          "label": "File a formal request for the 31 sentences’ registration records"
        },
        "c21_guestbook_reaction_choice_1": {
          "label": "Agree to hand them to no one before Sunwoo Jin knows"
        },
        "c21_guestbook_reaction_choice_3": {
          "label": "Ask right away to pull the 31 sentences from NOAH for now"
        }
      },
      "place": "Slow Island, Gujwa, Jeju · Tangerine Warehouse Attic",
      "clock": "February 8 · 00:20",
      "question": "NOAH still builds choices from 31 sentences with empty registrant fields. What do you do with these sentences?"
    },
    "c21_storehouse_reaction": {
      "title": "The 33rd-Floor Format",
      "text": "Han Seoyun sees the photo and calls late at night. After a long silence, this time she does not say 'before my time.' 'That note’s layout, the way the fields are divided, is the 33rd-floor format. The files I was handed when I first came to Trigger Lab looked the same.' Over the line comes the sound of a drawer opening. 'I can’t say more right now. When I can, I’ll say it with my name on it.' Beyond the stone wall, toward the breakwater, Sunwoo Jin’s flashlight beam moves.",
      "memo": [
        "'The 33rd-floor format'",
        "When it can be said, with a name on it"
      ],
      "choices": {
        "c21_storehouse_reaction_choice_3": {
          "label": "Press her to say right now whose format it is"
        },
        "c21_storehouse_reaction_choice_2": {
          "label": "Log the phrase 33rd-floor format in the call record"
        },
        "c21_storehouse_reaction_choice_1": {
          "label": "Wait without asking until Han Seoyun can speak"
        }
      },
      "place": "Slow Island, Gujwa, Jeju · By the Orchard Stone Wall",
      "clock": "February 8 · Cold snap · 23:10",
      "question": "Han Seoyun says the note is in the 33rd-floor format. Do you press further, or wait?"
    },
    "c21_letter_reaction": {
      "title": "Only Where the Stars Are",
      "text": "Ko Eunbi, who came by for a box of tangerines, leafs through the consent form on the counter. Then she says, without smiling, 'Banks always hand you paper along with the money. It was like that in my grandfather’s day too. Just sign where the stars are.' She taps the second page of the consent form with a fingertip. In small print is the line 'the scope of participation records is determined by the company.' 'If the company decides the scope, Sunwoo Jin is giving permission without even knowing what for.' Behind the counter, Sunwoo Jin listens quietly, pen in hand.",
      "memo": [
        "'The scope of participation records is determined by the company'",
        "The words: just sign where the stars are"
      ],
      "choices": {
        "c21_letter_reaction_choice_3": {
          "label": "Cut the talk off, saying Sunwoo Jin will decide Sunwoo Jin’s own matter"
        },
        "c21_letter_reaction_choice_2": {
          "label": "Underline 'the scope is determined by the company' and query Legal"
        },
        "c21_letter_reaction_choice_1": {
          "label": "Ask Ko Eunbi to stay by Sunwoo Jin’s side today"
        }
      },
      "place": "Slow Island, Gujwa, Jeju · Yard in Front of the Tangerine Warehouse",
      "clock": "February 9 · 11 a.m.",
      "question": "Ko Eunbi says that if the company decides the scope, you consent without knowing to what. How do you answer?"
    },
    "c21_branch_rind": {
      "title": "2 Tons of Off-Grade Fruit",
      "text": "'If you’ve got money for day wages, take a look at the tangerines in our warehouse.' Ko Eunbi leads the way and opens her own tangerine warehouse. In a hundred yellow crates, 2 tons of off-grade tangerines are piled up. The co-op buying price is 300 won for 1 kilogram. On the wall hangs a farm-loan calendar in her grandfather’s handwriting. The repayment date in March is circled in red: 40 million won. '2 years ago, when the hail hit, the bank wouldn’t extend, so Grandfather sold half the fields. That’s why I don’t trust bank people.' Kwon Dohyun, who was counting crates, quietly sets down his calculator.",
      "memo": [
        "2 tons of off-grade tangerines -- buying price 300 won per 1 kg",
        "Farm loan 40 million won, due in March",
        "Extension refused after hail damage 2 years ago, half the fields sold",
        "Kwon Dohyun puts down his calculator for the first time"
      ],
      "choices": {
        "c21_branch_rind_b": {
          "label": "Check together the terms for extending the farm loan’s maturity"
        },
        "c21_branch_rind_a": {
          "label": "Suggest making the off-grade fruit into tangerine-peel tea to sell together at Slow Island"
        },
        "c21_branch_rind_c": {
          "label": "Suggest selling at the buying price and drop the tangerine talk here"
        }
      },
      "place": "Ko Eunbi’s Farm, Gujwa, Jeju · Tangerine Warehouse",
      "clock": "February 8 · 15:00",
      "question": "2 tons of tangerines that can’t fetch a fair price and a loan due in March sit in one warehouse. What do you do with this warehouse?"
    },
    "c21_branch_rind_follow": {
      "title": "14 Stars",
      "text": "Four in the afternoon. Ko Eunbi takes a document envelope from the drawer under the calendar and tips it out onto the wooden platform. Fourteen sheets: a maturity extension application, printed out on Friday at the loan window of the Gujwa co-op. Every place to sign is marked with a highlighter star. 'The clerk said, You don’t need to read it all, just sign where the stars are.' Ko Eunbi lifts the pen and stops. It is exactly what her grandfather heard 2 years ago. Kwon Dohyun, sitting beside her, draws a single vertical line on a blank sheet. 'On page 9 there’s a clause raising the interest rate by 1.8 percentage points in exchange for the extension. There’s no star there.' Ko Eunbi looks Kwon Dohyun straight in the eye for the first time.",
      "memo": [
        "14-sheet maturity extension application, 14 stars",
        "Page 9: clause raising the rate 1.8 percentage points -- no star",
        "Window clerk: 'You don’t need to read it all'",
        "Ko Eunbi says Kwon Dohyun’s name for the first time"
      ],
      "choices": {
        "c21_branch_rind_follow_c": {
          "label": "Suggest just signing at the stars today and fighting the rate later"
        },
        "c21_branch_rind_follow_a": {
          "label": "Read all 14 sheets aloud with Ko Eunbi, start to finish"
        },
        "c21_branch_rind_follow_b": {
          "label": "Request in writing that the rate clause be removed, and hold off signing"
        }
      },
      "place": "Ko Eunbi’s Farm, Gujwa, Jeju · Tangerine Warehouse Platform",
      "clock": "February 8 · 16:00",
      "question": "A rate hike clause sits on page 9, with no star. What do you do with the 14-sheet extension application?"
    },
    "c21_route_system": {
      "title": "91% Similarity",
      "text": "Before the consent form, you reframe the table. At the remote terminal in the tangerine warehouse guesthouse in Gujwa, Jeju, NOAH answers instead of ECHO. NOAH was built to show the basis for every judgment. A line appears on the screen. 'Closest training case to the table just reframed: Participant 01, May 11, 2022, 03:12. Similarity 91%.' Among NOAH’s training data, the response records of Cohort 1’s four participants number 12,000. It is the bundle with the highest weight. 'Removing this bundle lowers my judgment accuracy by 14%. Whether this bundle had consent is outside the scope of my explanation.'",
      "memo": [
        "12,000 Cohort 1 response records -- top weight",
        "Similarity between your reframed table and Participant 01’s records: 91%",
        "Consent: outside the scope of NOAH’s explanation"
      ],
      "choices": {
        "c21_route_system_exclude": {
          "label": "Demand removing the Cohort 1 bundle and accepting the 14% accuracy loss"
        },
        "c21_route_system_disclose": {
          "label": "Share NOAH’s explanation screen with Ryu Seah and the consent review side"
        },
        "c21_route_system_close": {
          "label": "Pretend you never saw the 91% and close the screen"
        },
        "c21_route_system_evidence_turn": {
          "label": "Find the department that ordered the Cohort 1 experiment in the documents"
        }
      },
      "place": "Slow Island, Gujwa, Jeju · Tangerine Warehouse Remote Terminal",
      "clock": "February 8 · NOAH launch in D-2",
      "question": "NOAH says your reframed table is 91% like Participant 01’s records. What do you do with this explanation?"
    },
    "c21_final_system_route": {
      "title": "Outside the Scope of Explanation",
      "text": "Before dawn on February 9, NOAH’s explanation screen glows on the warehouse’s remote terminal. Every field asking for a basis is filled in; only the one field asking about consent is gray. In the yard, the house dog barks and falls quiet. The registered-mail cutoff at the post office is five this afternoon. NOAH adds a line beneath the gray field. 'I was not built to answer this field. The one who can answer it is the owner of this house, Participant 01, Sunwoo Jin, who is asleep downstairs right now.'",
      "memo": [
        "12,000 Cohort 1 response records -- consent is outside the scope of NOAH’s explanation",
        "Retroactive consent reply deadline: today 17:00",
        "NOAH official launch: February 10"
      ],
      "choices": {
        "c21_final_system_route_c": {
          "label": "Set up a separate window for deleting the records of participants who didn’t consent"
        },
        "c21_final_system_route_b": {
          "label": "Leave the records as they are and resend with a bigger thank-you payment"
        },
        "c21_final_system_route_a": {
          "label": "Restore a name field for the original writer on every Cohort 1 record"
        }
      },
      "place": "Slow Island, Gujwa, Jeju · Tangerine Warehouse Remote Terminal",
      "clock": "February 9 · Before dawn",
      "question": "NOAH cannot answer the field asking about consent. How do you bring that field to the one who can?"
    },
    "c21_evidence_turn": {
      "title": "The Blank on the Order Form",
      "text": "When you read the clues out to Ban Jaewook in B2 in Seoul, he holds up to the video call an operations statement he found by checking against the Cohort 1 shelf list. Project name 'TL-2022-01 HR Innovation Foundational Research,' ordering department Group Strategy Office, deliverable format 'HR reference material.' Ban Jaewook turns one more page. It is the company’s written opinion attached to the industrial accident claim Sunwoo Jin filed just before leaving. 'Judged to be personal stress.' The signature line at the bottom of the opinion is blank. Ban Jaewook closes the notebook he was writing in. 'No name in the field that ordered the experiment, and none in the field that turned that person into personal reasons. The same habit of hand.'",
      "memo": [
        "Ordered by: Group Strategy Office, project TL-2022-01",
        "Deliverable format: HR reference material",
        "Company opinion on the industrial accident claim -- signature line blank"
      ],
      "choices": {
        "c21_evidence_turn_hold": {
          "label": "Keep the statement in mind and bring it out when the sealed section opens"
        },
        "c21_evidence_turn_reopen": {
          "label": "Prepare industrial accident re-review papers in Sunwoo Jin’s name"
        },
        "c21_evidence_turn_share": {
          "label": "Tell the other three from Cohort 1 about this statement first"
        }
      },
      "place": "Slow Island, Gujwa, Jeju · Video Call with B2 in Seoul",
      "clock": "February 9 · 14:00",
      "question": "There is no name on the experiment order or on the industrial accident opinion. How do you use this statement?"
    },
    "c21_start_warm": {
      "title": "A Trip for the People Who Cleared the Server Room Together",
      "text": "The day NOAH came on, the nine of them set the day aside and cleared the server room together. Sitting on the server room stairs, Kang Taemin made cup noodles, and someone said, 'Next time, let’s go on a real trip.' Three days later Lee Minseo brings over the bottom line of NOAH’s training data. 'TL Cohort 1 · Participant 01 · No consent form.' The name is Sunwoo Jin, who now runs a guesthouse in Gujwa, Jeju. And a retroactive consent form is on its way to Sunwoo Jin by registered mail, with a 3 million won thank-you payment. Do Yoonha looks at the calendar. 'A trip, then. To Jeju.'",
      "memo": [
        "Six people requesting annual leave this week",
        "Participant 01 Sunwoo Jin -- no consent form",
        "Retroactive consent reply deadline February 9"
      ],
      "choices": {
        "c21_start_warm_signature": {
          "label": "The six who took leave all board the first flight together"
        },
        "c21_start_warm_visit": {
          "label": "Take the address and go down to Gujwa, Jeju in person"
        },
        "c21_start_warm_origin": {
          "label": "Find Participant 01’s original records in the archive first"
        },
        "c21_start_warm_call": {
          "label": "Call the guesthouse and feel out whether the envelope has arrived"
        },
        "c21_start_warm_reframe": {
          "label": "Ask NOAH to show the basis for its judgment"
        }
      },
      "place": "Trigger Lab 4th Floor Analyst Room",
      "clock": "Early February · NOAH launch in D-6",
      "question": "The trip promised the day you cleared the server room has become a trip to Jeju. How do the six of you go together?",
      "lead": "Three days since the server room was cleared, the nine cups from that day still sit upside down in a row in the pantry."
    },
    "c21_start_record": {
      "title": "The Blank Found by the One Who Left a Document",
      "text": "Three days after ECHO’s records were set down in a document, Ryu Seah calls while filling in that document’s appendix. It is the field noting consent status for each item of NOAH’s training data. 'I filled it all in, but the bottom four lines are empty.' TL Cohort 1, Participants 01 through 04. The very bottom line is Sunwoo Jin. Those four are the only lines without even 'not applicable' in the consent field. But Legal already knows about that blank. The day after the document was registered, a retroactive consent form and a 3 million won thank-you payment went out to Sunwoo Jin’s address in Gujwa, Jeju. The document you left told them first which field to fill.",
      "memo": [
        "4 blank lines in the appendix -- Participant 01 at the bottom",
        "Legal’s registered mailing: the day after the document was registered",
        "Reply deadline February 9, the day before NOAH launches"
      ],
      "choices": {
        "c21_start_record_call": {
          "label": "Call the guesthouse and feel out whether the envelope has arrived"
        },
        "c21_start_record_visit": {
          "label": "Take the address and go down to Gujwa, Jeju in person"
        },
        "c21_start_record_origin": {
          "label": "Find Participant 01’s original records in the archive first"
        },
        "c21_start_record_signature": {
          "label": "Put Participant 01’s name on the first line of the consent appendix and go down"
        },
        "c21_start_record_reframe": {
          "label": "Ask NOAH to show the basis for its judgment"
        }
      },
      "place": "Trigger Lab 4th Floor Analyst Room",
      "clock": "Early February · NOAH launch in D-6",
      "question": "The appendix you left told Legal about the blank first. How do you go to the owner of that blank?",
      "lead": "Three days after ECHO’s records were set down in a document, Ryu Seah’s call opens with the bottom line of the appendix."
    },
    "c21_start_rush": {
      "title": "The Name Found by the One Who Opened the List First",
      "text": "On the morning NOAH came on, as soon as you read Ryu Seah’s email, you left the half-cleared server room and downloaded NOAH’s training data list. Kang Taemin cleared the server room alone. The list was in date order, and you went straight down to the oldest line the email pointed to. 'TL Cohort 1 · Participant 01 · 2022 · No consent form.' Sunwoo Jin, Gujwa, Jeju. Three days later Ban Jaewook adds one thing. 'Legal sent this person a retroactive consent form. They hurried because they saw us open the list.' When you look up, no one is left on the 4th floor.",
      "memo": [
        "Downloaded the whole list the morning NOAH came on",
        "Participant 01 Sunwoo Jin -- no consent form",
        "Legal sent the retroactive consent form, ahead of us"
      ],
      "choices": {
        "c21_start_rush_call": {
          "label": "Call the guesthouse and feel out whether the envelope has arrived"
        },
        "c21_start_rush_origin": {
          "label": "Find Participant 01’s original records in the archive first"
        },
        "c21_start_rush_signature": {
          "label": "Go down alone first, carrying only the one name found in the list"
        },
        "c21_start_rush_visit": {
          "label": "Take the address and go down to Gujwa, Jeju in person"
        },
        "c21_start_rush_reframe": {
          "label": "Ask NOAH to show the basis for its judgment"
        }
      },
      "place": "Trigger Lab 4th Floor Analyst Room",
      "clock": "Early February · NOAH launch in D-6",
      "question": "While you opened the list first, Legal moved first. From the emptied 4th floor, who do you go with?",
      "lead": "On a desk one floor above the half-cleared server room, only the list you downloaded remains."
    }
  },
  "echoReplies": {
    "c21_start_visit": "Going in person, you see Sunwoo Jin’s face. Once you have seen the face, it is hard to speak only through paperwork.",
    "c21_start_origin": "When you go looking for the originals, the Cohort 1 shelf holds only the list. The originals are in the sealed section, and a day passes in front of that door. Ban Jaewook says he will stay and keep looking.",
    "c21_start_call": "A phone call is fast. A slow voice on the line asks, 'What’s this about?' and you have not yet prepared a sentence to answer with.",
    "c21_inn_truth": "When you say it, Sunwoo Jin’s smile stops for a moment. Then Sunwoo Jin hands over the key to the sunniest room.",
    "c21_inn_postmark": "Noting it down, you see the sending department. KD Data Lab Legal, with the contact field left blank.",
    "c21_inn_guest": "Paying for the room makes you a guest. No one asks a guest why they came, and so you miss your moment to speak.",
    "c21_orchard_stay": "When you pick to the end, Ko Eunbi peels a tangerine and hands it to you for the first time. That day there is no time to sit alone with Sunwoo Jin.",
    "c21_orchard_terms": "To check the terms you would have to open the envelope, and the envelope is still under the tangerine on the counter. 'I’ll read it and then answer.' Hearing that answer, Ko Eunbi picks her shears back up.",
    "c21_orchard_hire": "The moment you mention day wages, Ko Eunbi’s face hardens. Hands bought with money are the cheapest hands in this orchard.",
    "c21_breakwater_stay": "Because you stay beside, Sunwoo Jin goes on once more. One more story about the father comes out, and the lighthouse beam turns 10 more times.",
    "c21_breakwater_match": "The dates line up. Sunwoo Jin’s worst summer sits box by box in a single chart.",
    "c21_breakwater_admit": "When you admit it, Sunwoo Jin nods. 'Tomorrow morning, then.' Sunwoo Jin does not sleep that night.",
    "c21_final_tell": "When you tell, Sunwoo Jin looks at the weekly chart for a long time. 'So it wasn’t because I was weak.' Then, much later, the question comes. 'Where are the rest of the records?'",
    "c21_final_secure": "The preservation request protects the records. The post office cutoff passes, and Sunwoo Jin sets out dinner without knowing what was protected on Sunwoo Jin’s behalf.",
    "c21_final_ask": "When you ask, Sunwoo Jin looks out at the orchard. Before an answer comes, the post office cutoff passes. Meanwhile the originals stay in the sealed section.",
    "c21_after_warm": "Because you stay, six tangerine boxes get sealed with tape. In Seoul, NOAH spends that night too building choices from Cohort 1’s sentences.",
    "c21_after_record": "With the guide in place, the other three from Cohort 1 can see their own records too. Sunwoo Jin replies to the document: 'I’ll read it slowly.'",
    "c21_after_rush": "Going up first, you see To-the-End Precision on NOAH’s first review list. The only one who sees you off at the airport is Kkokji, the dog from Slow Island’s yard.",
    "c21_guestbook_choice_1": "Closed, the guestbook is Sunwoo Jin’s again. Tonight no one writes down where that sentence came from.",
    "c21_guestbook_choice_2": "Side by side, the order shows. The library entry was June 2022, the summer Sunwoo Jin was in Trigger Lab’s basement.",
    "c21_guestbook_choice_3": "The photos remain. At the shutter sound of someone photographing another person’s guestbook, Kkokji lifts its head by the living-room stove.",
    "c21_storehouse_choice_1": "Because we keep it to ourselves, Sunwoo Jin whistles again tonight. We become the ones who hid that sheet.",
    "c21_storehouse_choice_2": "To check the approval line, you have to knock on the sealed section’s door. The knocking carries all the way to the 33rd floor.",
    "c21_storehouse_choice_3": "The grounds arrive fast. One person’s worst summer becomes meeting material before its owner has seen it.",
    "c21_letter_choice_1": "When you say you’ll find the repair money, Sunwoo Jin puts down the pen. Instead, Sunwoo Jin’s eyes ask why you would go that far.",
    "c21_letter_choice_2": "Reading line by line, Sunwoo Jin stops at the line 'the scope is determined by the company.' You made that pause.",
    "c21_letter_choice_3": "When you step away, the decision is Sunwoo Jin’s. Even what Sunwoo Jin does not know is left for Sunwoo Jin to carry.",
    "c21_guestbook_reaction_choice_1": "Not handed over, the sentences become NOAH’s choices again today. Until their owner knows, that button keeps getting pressed.",
    "c21_guestbook_reaction_choice_2": "The request remains. The department asked to fill in the registrant field puts its answer off by three days.",
    "c21_guestbook_reaction_choice_3": "When you ask to pull them, Ryu Seah hesitates. 31 of NOAH’s choices go empty, and someone starts asking why.",
    "c21_storehouse_reaction_choice_1": "When you wait, Han Seoyun takes one more breath before hanging up. That breath stands in for a thank-you.",
    "c21_storehouse_reaction_choice_2": "Logged, those words become evidence. Han Seoyun knows her words are being written down.",
    "c21_storehouse_reaction_choice_3": "When you press, the line goes quiet. The sound of a drawer closing is the answer.",
    "c21_letter_reaction_choice_1": "Instead of answering, Ko Eunbi sets down the tangerine box and sits in the chair by the counter. Today’s tangerine sorting runs half a day late.",
    "c21_letter_reaction_choice_2": "The query goes on record. Legal’s answer comes after the post office cutoff.",
    "c21_letter_reaction_choice_3": "When the talk is cut off, Ko Eunbi goes out and shuts the door. It closes a little loudly.",
    "c21_branch_rind_a": "As tangerine-peel tea, the 2 tons are no longer fruit to throw away. Drying, slicing and packing take three days.",
    "c21_branch_rind_b": "Looking at the terms, an extension is possible. But the paperwork runs 14 sheets, and Ko Eunbi has already heard what her grandfather heard.",
    "c21_branch_rind_c": "At the buying price, 2 tons come to 600,000 won. With the face of someone done calculating, Ko Eunbi opens the drawer under the calendar.",
    "c21_branch_rind_follow_a": "Reading aloud, you watch the sun sink. At page 9, Ko Eunbi stops reading and draws one more star with the highlighter.",
    "c21_branch_rind_follow_b": "The written request remains. One month to maturity, and Ko Eunbi has to wait out that month.",
    "c21_branch_rind_follow_c": "Once the stars are signed, today’s work is done. The 1.8 percentage points on page 9 arrive every month from March.",
    "c21_route_system_disclose": "When you share it, Ryu Seah captures the explanation screen and puts it on the consent review agenda. In effect, NOAH has shown its own weak spot for the first time.",
    "c21_route_system_exclude": "With the bundle removed, NOAH grows less accurate. Whose desk the 14% worth of wrong answers will land on, no one knows yet.",
    "c21_route_system_close": "Closing the screen does not erase the similarity. Your next judgment, too, piles up beside those 12,000 records.",
    "c21_final_system_route_a": "With the name field restored, 'Sunwoo Jin' is written beside option sentence #0001. No one has yet asked whether Sunwoo Jin wants that.",
    "c21_final_system_route_b": "As the payment goes up, more people sign. The number who know what they are signing does not grow.",
    "c21_final_system_route_c": "With a deletion window open, the records belong to their owners. NOAH’s accuracy slips a little from the day the window opens.",
    "c21_evidence_turn_reopen": "With the papers prepared, the 'personal reasons' of 4 years ago go back up for review. Whether Sunwoo Jin wants this has to be written in the very first field.",
    "c21_evidence_turn_hold": "Just knowing keeps the statement safe. The other three from Cohort 1 stay in the dark just as long.",
    "c21_evidence_turn_share": "When you tell them, one of the three calls right away. 'I collapsed that summer too.'",
    "c21_inn_evidence_turn": "Go through the statement and you find where the experiment was ordered. On the same page is whose name is missing from that order.",
    "c21_orchard_evidence_turn": "Go through the statement and you find where the experiment was ordered. On the same page is whose name is missing from that order.",
    "c21_breakwater_evidence_turn": "Go through the statement and you find where the experiment was ordered. On the same page is whose name is missing from that order.",
    "c21_route_system_evidence_turn": "Go through the statement and you find where the experiment was ordered. On the same page is whose name is missing from that order.",
    "case21_memory_system": "Before you find it, NOAH answers first. The owner of the record that most resembles your table, it says, is not you.",
    "case21_memory_evidence": "Set the response records’ price sheet against the Cohort 1 shelf list and a statement naming the ordering department turns up. The field for who placed the order has no name.",
    "c21_start_warm_visit": "Going in person, you see Sunwoo Jin’s face. Once you have seen the face, it is hard to speak only through paperwork.",
    "c21_start_warm_origin": "When you go looking for the originals, the Cohort 1 shelf holds only the list. The originals are in the sealed section, and a day passes in front of that door. Ban Jaewook says he will stay and keep looking.",
    "c21_start_warm_call": "A phone call is fast. A slow voice on the line asks, 'What’s this about?' and you have not yet prepared a sentence to answer with.",
    "c21_start_warm_signature": "With six of you arriving at once, Sunwoo Jin laughs that there aren’t enough rooms. Kang Taemin and Kwon Dohyun end up sharing one.",
    "c21_start_record_visit": "Going in person, you see Sunwoo Jin’s face. Once you have seen the face, it is hard to speak only through paperwork.",
    "c21_start_record_origin": "When you go looking for the originals, the Cohort 1 shelf holds only the list. The originals are in the sealed section, and a day passes in front of that door. Ban Jaewook says he will stay and keep looking.",
    "c21_start_record_call": "A phone call is fast. A slow voice on the line asks, 'What’s this about?' and you have not yet prepared a sentence to answer with.",
    "c21_start_record_signature": "With the name on the first line, that field no longer belongs to Legal alone. Instead, Sunwoo Jin’s name is written once more on a document Sunwoo Jin does not know about.",
    "c21_start_rush_visit": "Going in person, you see Sunwoo Jin’s face. Once you have seen the face, it is hard to speak only through paperwork.",
    "c21_start_rush_origin": "When you go looking for the originals, the Cohort 1 shelf holds only the list. The originals are in the sealed section, and a day passes in front of that door. Ban Jaewook says he will stay and keep looking.",
    "c21_start_rush_call": "A phone call is fast. A slow voice on the line asks, 'What’s this about?' and you have not yet prepared a sentence to answer with.",
    "c21_start_rush_signature": "Going alone is fast. All four rooms at Slow Island are empty, and Sunwoo Jin does not ask why you came alone. The other five follow on the evening flight."
  },
  "choiceVoiceLines": {
    "c21_start_visit": "Saying this is not something to ask on a single sheet of paper, you take the address and go down to Gujwa, Jeju in person.",
    "c21_start_origin": "Saying you first need to know what they want permission for, you look for Participant 01’s original records in the archive first.",
    "c21_start_call": "Before Sunwoo Jin signs, you call the guesthouse and feel out whether the envelope has arrived.",
    "c21_inn_truth": "Saying this is not a house to stay in under false pretenses, you say first that you’re from Trigger Lab and ask to stay the night.",
    "c21_inn_postmark": "Since opening it is Sunwoo Jin’s to do, you leave the envelope untouched and note only the sending department and deadline.",
    "c21_inn_guest": "Not wanting to be the first to break that smiling face, you put the story off and pay three nights up front as a guest.",
    "c21_orchard_stay": "Deciding to answer first with the shears in your hand, you lend a hand to the very end, until the last tangerines are picked before the cold snap.",
    "c21_orchard_terms": "Since you can’t call unread paper good, you check the consent form’s terms before answering whether it’s good money.",
    "c21_orchard_hire": "Saying the envelope’s deadline is more urgent than the tangerines, you hire day laborers to take over and meet Sunwoo Jin separately.",
    "c21_breakwater_stay": "Saying tonight, listening comes first, you don’t hurry an answer and sit beside Sunwoo Jin until everything is said.",
    "c21_breakwater_match": "So it can be proof that the collapse wasn’t weakness, you match each date Sunwoo Jin mentions to the weekly chart and note it down.",
    "c21_breakwater_admit": "Since it is not a question to brush off with a lie, you briefly admit it’s not a vacation and put the story off until tomorrow morning.",
    "c21_final_tell": "Saying you can’t let Sunwoo Jin sign without knowing, you show the weekly chart and the guestbook sentence and tell what happened 4 years ago just as it was.",
    "c21_final_secure": "Since all you have is a single weekly chart, you lock down Cohort 1’s originals with a preservation request before telling.",
    "c21_final_ask": "Since whether to know is also Sunwoo Jin’s to decide, you ask before saying anything whether Sunwoo Jin wants to know.",
    "c21_after_warm": "Saying tangerines not picked in a hurry can’t be carried off in a hurry, you stay at Slow Island until the last flight and pack tangerine boxes together.",
    "c21_after_record": "So participants can see their own records before they stand at the signature line, you draft a records access request guide for Cohort 1 participants.",
    "c21_after_rush": "Saying the To-the-End Precision application is already in front of NOAH, you take the very next flight up with the tangerine box and look into NOAH’s review.",
    "c21_guestbook_choice_1": "Since these are handwritten replies to guests who came to rest, you treat the guestbook as Sunwoo Jin’s and close it quietly without photos.",
    "c21_guestbook_choice_2": "So you can tell whose words came first, you note the reply dates and option-sentence numbers side by side.",
    "c21_guestbook_choice_3": "Saying it is late, you just take photos and see to tomorrow’s orchard schedule first.",
    "c21_storehouse_choice_1": "So Sunwoo Jin’s story doesn’t get around before Sunwoo Jin does, you keep the chart among yourselves until Sunwoo Jin can see it.",
    "c21_storehouse_choice_2": "Saying a ballpoint note alone doesn’t show whose hand it is, you have the note’s writer and approval line checked against the originals.",
    "c21_storehouse_choice_3": "Saying you can’t switch on judgment learned from records like these, you hand the chart photo to Ryu Seah as grounds to stop NOAH’s launch.",
    "c21_letter_choice_1": "Saying you can’t let the roof be the reason Sunwoo Jin signs, you say first that you’ll find the roof repair money some other way.",
    "c21_letter_choice_2": "Saying let’s see where it says it will be used for good, you read the consent form line by line with Sunwoo Jin.",
    "c21_letter_choice_3": "To buy time to see what is being signed, you ask just to hold off signing today, and step away.",
    "c21_guestbook_reaction_choice_1": "Saying Sunwoo Jin’s words mustn’t become paperwork before Sunwoo Jin does, you suggest handing them to no one until Sunwoo Jin learns of it directly.",
    "c21_guestbook_reaction_choice_2": "So the empty registrant fields don’t stay mere talk, you file a formal request for the 31 sentences’ registration records.",
    "c21_guestbook_reaction_choice_3": "Saying NOAH is building choices from those words even now, you ask right away to pull the 31 sentences from NOAH for now.",
    "c21_storehouse_reaction_choice_1": "Choosing to trust the promise to speak with a name on it, you wait without asking until Han Seoyun can speak.",
    "c21_storehouse_reaction_choice_2": "Before it becomes something never said, you log the phrase 33rd-floor format in the call record.",
    "c21_storehouse_reaction_choice_3": "Saying there is no time to wait, you press her to say right now whose format it is.",
    "c21_letter_reaction_choice_1": "So Sunwoo Jin, pen in hand, doesn’t decide alone, you ask Ko Eunbi to stay by Sunwoo Jin’s side today.",
    "c21_letter_reaction_choice_2": "Saying what is being permitted has to be on paper, you underline the line 'the scope is determined by the company' and query Legal.",
    "c21_letter_reaction_choice_3": "Saying you can’t answer for Sunwoo Jin and Sunwoo Jin will decide Sunwoo Jin’s own matter, you cut the talk off here.",
    "c21_branch_rind_a": "Saying it is a waste to let them go at 300 won for 1 kilogram, you suggest making the off-grade fruit into tangerine-peel tea to sell together at Slow Island.",
    "c21_branch_rind_b": "Saying you can’t let her sell the rest of the fields too, you check together the terms for extending the farm loan’s maturity.",
    "c21_branch_rind_c": "Saying the envelope is why you came to Jeju, you suggest selling at the buying price and drop the tangerine talk here.",
    "c21_branch_rind_follow_a": "So she signs knowing even the parts her grandfather signed unread, you read all 14 sheets aloud with Ko Eunbi, start to finish.",
    "c21_branch_rind_follow_b": "Saying no one should sign a clause without a star, you request in writing that the page 9 rate clause be removed, and hold off signing.",
    "c21_branch_rind_follow_c": "Saying the March maturity has to be gotten past first, you suggest just signing at the stars today and fighting the rate later.",
    "c21_route_system_disclose": "Since these are not grounds to keep to yourself, you share NOAH’s explanation screen as it is with Ryu Seah and the consent review side.",
    "c21_route_system_exclude": "Saying you can’t let it judge with records no one permitted, you demand removing the Cohort 1 bundle and accepting the 14% accuracy loss.",
    "c21_route_system_close": "Saying it is too big a number to touch now, you pretend you never saw the 91% and close the screen.",
    "c21_final_system_route_a": "So the screen shows whose judgment it learned from, you restore a name field for the original writer on every Cohort 1 record.",
    "c21_final_system_route_b": "Saying tomorrow’s launch can’t be stopped, you leave the records as they are and resend with a bigger thank-you payment.",
    "c21_final_system_route_c": "So the records’ owners decide the field NOAH can’t answer, you set up a separate window for deleting the records of participants who didn’t consent.",
    "c21_evidence_turn_reopen": "So the 'personal stress' opinion can be overturned, you prepare industrial accident re-review papers in Sunwoo Jin’s name.",
    "c21_evidence_turn_hold": "Saying it only becomes complete proof beside the rest of the originals, you keep the statement in mind and bring it out when the sealed section opens.",
    "c21_evidence_turn_share": "Saying this is not Sunwoo Jin’s matter alone, you first tell the other three from Cohort 1 that this statement exists.",
    "c21_inn_evidence_turn": "Checking the clues one by one against the Cohort 1 shelf list with Ban Jaewook in B2 in Seoul, you find out which department ordered that experiment.",
    "c21_orchard_evidence_turn": "Checking the clues one by one against the Cohort 1 shelf list with Ban Jaewook in B2 in Seoul, you find out which department ordered that experiment.",
    "c21_breakwater_evidence_turn": "Checking the clues one by one against the Cohort 1 shelf list with Ban Jaewook in B2 in Seoul, you find out which department ordered that experiment.",
    "c21_route_system_evidence_turn": "Checking the clues one by one against the Cohort 1 shelf list with Ban Jaewook in B2 in Seoul, you find out which department ordered that experiment.",
    "c21_start_warm_visit": "Saying this is not something to ask on a single sheet of paper, you take the address and go down to Gujwa, Jeju in person.",
    "c21_start_warm_origin": "Saying you first need to know what they want permission for, you look for Participant 01’s original records in the archive first.",
    "c21_start_warm_call": "Before Sunwoo Jin signs, you call the guesthouse and feel out whether the envelope has arrived.",
    "c21_start_warm_signature": "So the talk of a trip doesn’t stay empty words, the six of you who took leave all board the first flight together.",
    "c21_start_record_visit": "Saying this is not something to ask on a single sheet of paper, you take the address and go down to Gujwa, Jeju in person.",
    "c21_start_record_origin": "Saying you first need to know what they want permission for, you look for Participant 01’s original records in the archive first.",
    "c21_start_record_call": "Before Sunwoo Jin signs, you call the guesthouse and feel out whether the envelope has arrived.",
    "c21_start_record_signature": "So it doesn’t stay a blank only Legal knows about, you put Participant 01’s name on the first line of the consent appendix and go down.",
    "c21_start_rush_visit": "Saying this is not something to ask on a single sheet of paper, you take the address and go down to Gujwa, Jeju in person.",
    "c21_start_rush_origin": "Saying you first need to know what they want permission for, you look for Participant 01’s original records in the archive first.",
    "c21_start_rush_call": "Before Sunwoo Jin signs, you call the guesthouse and feel out whether the envelope has arrived.",
    "c21_start_rush_signature": "Saying a group moves slower than Legal, you go down alone first, carrying only the one name found in the list."
  },
  "pack": {
    "clue": {
      "title": "Participant 01’s Weekly Chart",
      "text": "In the second week of July 2022, a note said to raise the pressure on Participant 01, whose responses had slowed, by two levels and to reject leave for the father’s hospitalization. The department that ordered the experiment was the Group Strategy Office, and the deliverable was 'HR reference material.'"
    },
    "outcomes": {
      "c21_after_warm": {
        "tag": "Packed the Tangerines",
        "title": "You stayed at Slow Island until the last flight",
        "text": "The six packed tangerine boxes and each left a line in the guestbook. Sunwoo Jin promised a reply under every entry, written slowly."
      },
      "c21_after_record": {
        "tag": "Opened a Way to Return the Records",
        "title": "A guide now lets Cohort 1 participants see their own records",
        "text": "The access request guide went out to the four members of Cohort 1. For records used without consent, there is, for the first time, a path for their owners to reach them."
      },
      "c21_after_rush": {
        "tag": "Went Up First",
        "title": "You went to NOAH’s review list, tangerine box in hand",
        "text": "You took the very next flight up and opened NOAH’s first review list. The only one who saw you off at the airport was Kkokji the dog."
      }
    },
    "continuityChallenges": {
      "c20_after_warm": {
        "title": "Go with the People Who Cleared the Server Room",
        "text": "The day NOAH came on, the nine did not scatter. Play a card that has many of you sit together before the first participant too, and trust grows."
      },
      "c20_after_record": {
        "title": "Reclaim My Document That Revealed the Blank",
        "text": "The appendix you left told Legal about the blank first. Reframe the table to decide whose side that appendix should be read from."
      },
      "c20_after_rush": {
        "title": "Confess the Hurried Order to the First Participant",
        "text": "The list you downloaded first made Legal hurry. Fairness returns when you tell that order to the first participant first."
      }
    }
  }
};
