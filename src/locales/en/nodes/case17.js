/**
 * 사건 17 (src/nodes/case17.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c17_start": {
      "title": "Company Records",
      "text": "Ban Jaewook puts two envelopes on the desk. One is a certified letter group legal sent 2 weeks ago. The demand is two lines. Return the notebook used in audit investigations, as it is a company record. And submit that notebook to the December 19 HR committee as evidence of your 'improper interference in an investigation'. The other is a copy of a court application for a document production order, which arrived today. Ban Jaewook sets a black notebook with a worn cover beside the envelopes. 'Forty-seven people. The ones I let go over 20 years. The company says this is its property.' He speaks without opening the notebook. 'Before I hand it over, I mean to visit them one by one. Will you come with me?'",
      "memo": [
        "Legal’s certified letter: the notebook is a 'company record'",
        "December 19 HR committee -- agenda: your improper interference in an investigation",
        "47 names in the notebook, one line in pencil on the last page",
        "Court document production application -- hearing after the HR committee"
      ],
      "choices": {
        "c17_start_visit": {
          "label": "Visit the people in the notebook with Ban Jaewook first"
        },
        "c17_start_self": {
          "label": "Leave the notebook out; settle my case fast in writing"
        },
        "c17_start_clause": {
          "label": "Challenge the letter’s 'company record' basis point by point"
        },
        "reframe": {
          "label": "Sort out who audits have been disciplining"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "December 15 · HR committee D-4",
      "question": "Legal calls the notebook with 47 names company property and wants it handed over. What do you do first?",
      "lead": "Monday morning, the day the second envelope came from the court, Ban Jaewook is in earlier than usual."
    },
    "c17_truck": {
      "title": "The Sauce Bottle",
      "text": "A park parking lot in blowing snow; on the side of a truck, a handwritten sign reads 'Taeo’s Tteok Skewers'. The name on the notebook’s first page: Assistant Manager Jung Taeo, fired 7 years ago. He recognizes Ban Jaewook and does not stop turning skewers. 'On the house. But shake that.' Ban Jaewook, still in his navy coat, shakes the sauce bottle. He shakes it so earnestly that a customer in line asks, 'You the new part-timer?' Ban Jaewook answers, 'Temporary staff.' When the line breaks, Jung Taeo wipes his hands on his apron. 'Know why I got fired? I wrote down what the branch manager told me. To move the dates on loan papers forward. When the audit came, only my handwriting was left.' He looks at Ban Jaewook. 'In that notebook, what does it say about me?'",
      "memo": [
        "Jung Taeo: former corporate loans assistant manager, KD Bank Guro Branch, fired 7 years ago",
        "Reason: changed dates on loan papers -- his own handwriting in his work notebook",
        "The branch manager who gave the order retired with no discipline",
        "Truck sales 380,000 won a day; today 1 extra on sauce-bottle duty"
      ],
      "choices": {
        "c17_truck_stay": {
          "label": "Shake the sauce bottle until closing, then open the notebook"
        },
        "c17_truck_report": {
          "label": "Show the 7-year-old audit report beside the notebook line"
        },
        "c17_truck_consent": {
          "label": "Show legal’s papers first and get his consent to submit"
        },
        "reframe": {
          "label": "Sort out who audits have been disciplining"
        },
        "c17_truck_evidence_turn": {
          "label": "Overlay the 7-year-old notebook copy on the call log"
        }
      },
      "place": "Sangam-dong park parking lot · Taeo’s Tteok Skewers truck",
      "clock": "December 15 · Blowing snow · HR committee D-4",
      "question": "The man on the notebook’s first page asks what it says about him. How do you show him?",
      "lead": "The address on the notebook’s first page was not a bank but a food truck in a park parking lot."
    },
    "c17_office": {
      "title": "Two Lines",
      "text": "At the end of a 3rd-floor corridor in a Mullae-dong shopping building, the vinyl lettering 'Ha Yoonjae Tax & Accounting' is half peeled off the glass door. The only name in the notebook with two lines drawn under it. He opened this office after being fired 6 years ago, and last spring he collapsed from overwork and died. His older sister, Ha Eunkyung, is here to close up the business. When Ban Jaewook says the name, she puts down the box she was holding. 'My brother never told the family he was fired. He said he quit. That the bank was stifling, so he left.' An old planner comes out of the desk drawer. In one box from March 6 years ago, it says: 'Interview with Investigator Ban Jaewook. Tell him it wasn’t me.' Ha Eunkyung slides the planner toward Ban Jaewook. 'Did he say it? My brother, that day?'",
      "memo": [
        "Ha Yoonjae: former KD Bank assistant manager, fired 6 years ago, died last spring",
        "The family didn’t know he was fired -- 'quit on his own'",
        "One line in the planner: 'Tell him it wasn’t me'",
        "Of the 47 in the notebook: 3 unreachable, 1 deceased"
      ],
      "choices": {
        "c17_office_record": {
          "label": "Find his words in the 6-year-old investigation record"
        },
        "c17_office_leave": {
          "label": "Ask nothing more; write 'deceased' and leave"
        },
        "c17_office_truth": {
          "label": "Tell his sister what he said in that interview"
        },
        "reframe": {
          "label": "Sort out who audits have been disciplining"
        },
        "c17_office_evidence_turn": {
          "label": "Overlay the 7-year-old notebook copy on the call log"
        }
      },
      "place": "Mullae-dong shopping building, 3rd floor · Closed office at the end of the corridor",
      "clock": "December 16 · HR committee D-3",
      "question": "The sister of a man who died asks whether her brother said, that day, that it wasn’t his fault. What do you answer?",
      "lead": "You have found the address of the name with two lines under it. The lettering on the glass door is half peeled off."
    },
    "c17_legal": {
      "title": "The Attachment List",
      "text": "The legal team meeting room at KD Financial Group headquarters. Two lawyers push a file across. Its title: 'Evidence List re: Analyst’s Improper Interference in an Investigation'. Attachment 3 is the notebook. Below it, 47 names copied from audit reports are typed out, and the table has a new title. 'Subjects of the analyst’s interference.' Jung Taeo’s box says only 'Fired for forging work documents.' Who gave the order appears nowhere. The lead counsel speaks gently. 'Just give us the notebook, Mr. Ban, and we’ll take you off this list. You’re not handling investigations now, after all.' Ban Jaewook puts down his pen. It is the very format he used for 20 years. A table where only the one who wrote it down remains, and the one who gave the order does not. He looks at you. 'This time I’m the one taking dictation.'",
      "memo": [
        "Evidence list, Attachment 3: Ban Jaewook’s notebook",
        "Table retitled: 'Subjects of the analyst’s interference'",
        "Jung Taeo’s box: 'Fired for forging work documents' -- no one who gave the order",
        "Offer: hand over the notebook and Ban Jaewook comes off the list"
      ],
      "choices": {
        "c17_legal_walk": {
          "label": "Name the 17 who refused and get up from the table"
        },
        "c17_legal_basis": {
          "label": "Demand in writing who retitled the table, and on what basis"
        },
        "c17_legal_deal": {
          "label": "Take the offer to drop Ban Jaewook; hand over only a copy"
        },
        "reframe": {
          "label": "Sort out who audits have been disciplining"
        },
        "c17_legal_evidence_turn": {
          "label": "Overlay the 7-year-old notebook copy on the call log"
        }
      },
      "place": "KD Financial Group headquarters, legal team · Meeting room",
      "clock": "December 18 · Day before the HR committee",
      "question": "The list of 47 has been retitled 'subjects of the analyst’s interference', and they offer to drop only Ban Jaewook. What do you do?",
      "lead": "Legal asked to meet first. Two files are already on the meeting-room table."
    },
    "c17_final": {
      "title": "47 Names",
      "text": "In the corridor outside the HR committee room, a legal team lawyer checks the time. If the notebook is not on the table by 10:00, it goes to the court’s hearing on the document production order. Ban Jaewook takes the notebook from the inside pocket of his coat. On the cover is Seoa’s star sticker. Submit it to the court directly, and the 47 names become public record, but the title 'subjects of interference' never gets attached. Tear it out page by page and return each to its owner, and only the names of those who consent remain; the notebook disappears. Burn it, and today’s fight is over, and the one line Jung Taeo found after 7 years goes with it. Ban Jaewook places the notebook in your hand. 'I carried it for 20 years. This time, you decide.'",
      "memo": [
        "10:00 HR committee -- no notebook means a document production hearing",
        "Opposed 17 · don’t mind 12 · refused 7 · not yet visited 7 · unreachable 3 · deceased 1",
        "Seoa’s star sticker on the notebook cover",
        "This choice leads to the blank signature field on the 33rd floor"
      ],
      "choices": {
        "c17_final_return": {
          "label": "Tear out each page, get consent, return it to its owner"
        },
        "c17_final_court": {
          "label": "Submit the whole notebook to the court as public record"
        },
        "c17_final_burn": {
          "label": "Burn the notebook with Ban Jaewook to end today’s fight"
        },
        "reframe": {
          "label": "Reframe the table and propose, one last time"
        }
      },
      "place": "KD Financial Group headquarters, 12th floor · Corridor outside the HR committee room",
      "clock": "December 19 · HR committee 10:00",
      "question": "The notebook with 20 years of names is in your hand. Do you submit it to the court, return it, or burn it?",
      "lead": "Today Ban Jaewook has brought the notebook in the inside pocket of his coat. There is a star sticker on the cover."
    },
    "c17_aftershock": {
      "title": "A Year-End Party of Tteok Skewers",
      "text": "December 21, a Sunday evening, the snow coming down harder. Jung Taeo, who runs the tteok skewer food truck, tapes a sign to the front: 'Everything free today.' 11 of the people in the notebook come. They are strangers to one another, but when someone asks, 'What year did you leave?' the talk takes off. Ban Jaewook’s daughter Seoa hands out star stickers one by one, and Ban Jaewook takes off his coat and shakes the sauce bottle. This time no one asked him to. Kang Taemin grills skewers, and Kwon Dohyun, working out 'the loss from free service', is silenced by a skewer Jung Taeo pushes into his mouth. There is a text from legal on your phone. 'Tomorrow 9 a.m., follow-up meeting on the notebook.' Then Oh Jinwoo’s phone rings too. The screen says Bridge Bank. He stares at it for a long time, then walks behind the truck to take the call.",
      "memo": [
        "At the year-end party: 11 people from the notebook",
        "412 skewers free -- Kwon Dohyun’s estimated loss 820,000 won",
        "Legal: follow-up meeting on the notebook tomorrow morning",
        "A call from Bridge Bank for Oh Jinwoo"
      ],
      "choices": {
        "c17_after_warm": {
          "label": "Stay and shake the sauce bottle until the truck’s lights go out"
        },
        "c17_after_rush": {
          "label": "Leave the party to prepare for legal’s meeting tomorrow"
        },
        "c17_after_record": {
          "label": "Put the names principle and a 'who gave the order' box in a proposal"
        }
      },
      "place": "Sangam-dong park parking lot · Taeo’s Tteok Skewers truck",
      "clock": "December 21 · Blowing snow · Evening",
      "question": "The night the people in the notebook gather at the truck, legal sets a follow-up meeting and Bridge Bank calls Oh Jinwoo. How do you close this night?"
    },
    "c17_stars": {
      "title": "Star Ratings",
      "text": "Ban Jaewook’s living room that night. The notebook lies open on the dining table, and Ban Seoa, in 4th grade, is putting a star sticker on every name. 'The skewer man gets five stars. Because he gave us skewers.' Ban Jaewook starts to stop her, then doesn’t. Turning a page, Seoa stops at one name. Every name has one line under it, but this one has an extra. 'Dad, why does this man have two lines?' After a long while, Ban Jaewook answers. 'Even if you go looking for him now, he’s not there.' Seoa doesn’t peel the sticker off; she adds one more. This time it is not a star but a small flower.",
      "memo": [
        "12 star stickers from Seoa -- the standard is how Seoa feels",
        "The name with two lines: Ha Yoonjae, died last spring",
        "Seoa’s rule: give skewers, get five stars"
      ],
      "choices": {
        "c17_stars_choice_1": {
          "label": "Tell Seoa plainly what the two lines mean"
        },
        "c17_stars_choice_2": {
          "label": "It may be evidence; peel the stickers and restore the notebook"
        },
        "c17_stars_choice_3": {
          "label": "Leave it as Seoa made it tonight; find the next name"
        }
      },
      "place": "Ban Jaewook’s home · Living room",
      "clock": "December 15 · 21:00",
      "question": "A child is star-rating every name in her father’s notebook, and put a flower on the name with two lines. What do you do?"
    },
    "c17_unreached": {
      "title": "Number Not in Service",
      "text": "On the whiteboard in the Trigger Lab pantry, Kwon Dohyun draws a table. Of the 47, 29 met: 17 of them oppose submission, 12 don’t mind. 7 refused to meet, 7 not yet visited, 3 unreachable, 1 deceased. Kang Taemin brings two cups of noodles and sets one in front of Ban Jaewook. Kwon Dohyun taps the three boxes with his pen. 'One number now belongs to a Chinese restaurant, one person moved abroad, and no one lives at the third address.' He pauses. 'The restaurant owner remembered the previous owner. He said the man didn’t get a single won for the sign when he handed over the shop.' He puts down his pen. 'This box, I can’t put a price on.'",
      "memo": [
        "29 met: 17 oppose submission, 12 don’t mind",
        "7 refused to meet, 7 not yet visited, 3 unreachable, 1 deceased",
        "Restaurant owner: the previous owner handed over the shop without even getting paid for the sign"
      ],
      "choices": {
        "c17_unreached_choice_3": {
          "label": "No time; decide on the wishes of those reached"
        },
        "c17_unreached_choice_2": {
          "label": "Formally record the three unreachable as 'no consent'"
        },
        "c17_unreached_choice_1": {
          "label": "Use the restaurant owner’s clue to find one more"
        }
      },
      "place": "Trigger Lab, 4th floor · Pantry",
      "clock": "December 17 · HR committee D-2",
      "question": "3 of the 47 can’t be reached at all. What do you do with the share of those who can’t answer?"
    },
    "c17_name": {
      "title": "The Name That Remained",
      "text": "The night before the HR committee, in front of the truck after closing. Jung Taeo takes a yellowed work notebook from his apron pocket. His, from 7 years ago. 'The company recorded me as resigning voluntarily. In the HR records, in my cohort’s group chat, even in my mom’s memory.' He points at Ban Jaewook’s notebook. 'Only that one’s different. Jung Taeo, fired, wrote down orders.' He presses a skewer into Ban Jaewook’s hand. This time he doesn’t tell him to shake the sauce bottle. 'Because you wrote it down then, my name stayed. For 7 years, that was the one place that wrote me down straight.'",
      "memo": [
        "Jung Taeo’s HR record: 'voluntary resignation'",
        "Ban Jaewook’s notebook: 'fired · wrote down orders'",
        "Jung Taeo’s work notebook from 7 years ago -- the page from the day of the order, intact"
      ],
      "choices": {
        "c17_name_choice_3": {
          "label": "Just take his thanks and go back to committee prep"
        },
        "c17_name_choice_2": {
          "label": "Match the same date in both notebooks to trace the order"
        },
        "c17_name_choice_1": {
          "label": "Promise to protect Jung Taeo’s work notebook too"
        }
      },
      "place": "Sangam-dong park parking lot · In front of the shuttered truck",
      "clock": "December 18 · Blowing snow · 23:00",
      "question": "Jung Taeo says that notebook was the one place that wrote him down straight for 7 years. What do you answer?"
    },
    "c17_stars_reaction": {
      "title": "The Children’s Ages",
      "text": "After Seoa falls asleep, Ban Jaewook shows you the back of the notebook. Small numbers are written beside the names. 'I started writing them the year Seoa was born. If the person had a child, the child’s age.' Twenty-two names have numbers. 'Every time my daughter turned a year older, those children did too. In homes where the father was cut from the bank.' He takes off his glasses and sets them on the table. 'Legal will put even these numbers on the HR committee table.'",
      "memo": [
        "22 names with a child’s age",
        "Children who grew a year older alongside his daughter"
      ],
      "choices": {
        "c17_stars_reaction_choice_3": {
          "label": "Pretend you didn’t see the numbers; keep the name order"
        },
        "c17_stars_reaction_choice_1": {
          "label": "Visit the 22 with a child’s age first"
        },
        "c17_stars_reaction_choice_2": {
          "label": "Demand legal take family details out of the submission"
        }
      },
      "place": "Ban Jaewook’s home · Dining table",
      "clock": "December 15 · 23:30",
      "question": "Beside 22 names is the age of the child in that home. How do you handle these numbers?"
    },
    "c17_unreached_reaction": {
      "title": "Presumed Consent",
      "text": "ECHO brings up legal’s draft submission opinion. You decide not to ask how it got in. One footnote line at the bottom of page 12. 'Any person in the notebook who does not reply shall be deemed to have no objection to submission.' ECHO underlines it. 'With this sentence, the three unreachable and the one who died become people who consented. 20 years ago, the one who wrote it down became the one responsible; today, the ones who cannot answer become the ones who consented.'",
      "memo": [
        "A footnote that reads no reply as consent",
        "Four people who cannot answer"
      ],
      "choices": {
        "c17_unreached_reaction_choice_2": {
          "label": "Send legal a formal inquiry on the footnote’s basis"
        },
        "c17_unreached_reaction_choice_1": {
          "label": "Make public the footnote that counts silence as consent"
        },
        "c17_unreached_reaction_choice_3": {
          "label": "Plan to rebut it at the committee; move on"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · ECHO terminal",
      "clock": "December 17 · 19:00",
      "question": "The opinion has a footnote that reads no reply as consent. What do you do with this one line?"
    },
    "c17_name_reaction": {
      "title": "The First Box",
      "text": "After Jung Taeo pulls down the shutter, Ban Jaewook sits on a folding stool beside the truck and finishes his skewer. Then, for the first time, he turns the notebook’s first page toward you. Next to the name box there is one more box. Never once filled in 20 years, its heading is 'Who gave the order'. 'Without evidence I couldn’t write it, so I left it blank.' Snowflakes land on the notebook and melt. 'Come to think of it, I left the signature field blank too, just like the higher-ups. Only the way was different.'",
      "memo": [
        "The 'who gave the order' box, left blank for 20 years",
        "A blank signature field, only done a different way"
      ],
      "choices": {
        "c17_name_reaction_choice_3": {
          "label": "Talk about the box later; decide on submitting first"
        },
        "c17_name_reaction_choice_1": {
          "label": "Tell Ban Jaewook the blank box isn’t his fault"
        },
        "c17_name_reaction_choice_2": {
          "label": "Offer to find evidence to fill that box together"
        }
      },
      "place": "Sangam-dong park parking lot · Folding stool beside the truck",
      "clock": "December 19 · 00:20",
      "question": "There is a 'who gave the order' box he never once filled in 20 years. What do you say to Ban Jaewook?"
    },
    "c17_branch_pencil": {
      "title": "One Line in Pencil",
      "text": "On the way back from Mullae-dong, December snow piles up on the wipers. Seoa, picked up from her after-school academy, sleeps in the back, and Ban Jaewook stops at a light and opens the notebook’s last page. Under 47 names in ink, one line in pencil. Your name, and a date 2 weeks before you were pushed out to Trigger Lab. 'This is the line legal wants. I wrote your name before any investigation, so we must have been in it together.' He runs his thumb over the pencil marks. 'Back then, a document to push you out landed in my approval queue. I didn’t click approve. Instead I wrote it here in pencil. So it could be erased any time.' The light changes. 'This line. What should we do with it?'",
      "memo": [
        "Last page: your name in pencil, dated 2 weeks before your transfer order",
        "The document in Ban Jaewook’s approval queue then: a review of HR action against you",
        "Ban Jaewook never clicked approve",
        "Legal’s claim: writing the name before the investigation means it was planned"
      ],
      "choices": {
        "c17_branch_pencil_a": {
          "label": "Hear out why he never approved that document"
        },
        "c17_branch_pencil_b": {
          "label": "Match the pencil date to HR records to prove the facts"
        },
        "c17_branch_pencil_c": {
          "label": "It’s the line legal wants; erase it tonight"
        }
      },
      "place": "Ban Jaewook’s car · Seoa asleep in the back",
      "clock": "December 16 · Blowing snow · 22:00",
      "question": "The pencil line on the notebook’s last page is your name, and it is the line legal wants. What do you do with it?"
    },
    "c17_branch_pencil_follow": {
      "title": "The Flower Eraser",
      "text": "When the car parks in the apartment lot, Seoa wakes and leans forward from the back seat. The notebook is still open. 'Dad, only this one’s in pencil.' Seoa takes a flower-shaped eraser from her pencil case. 'Want me to erase it? Or trace over it in pen? My handwriting’s good.' Ban Jaewook tries not to laugh and fails. Of all the names he wrote in 20 years, this was the only line he left erasable. Seoa stares at you. 'This is your friend’s name, Dad? Then the name’s owner should decide.' The flower eraser and a ballpoint pen are set side by side in front of you.",
      "memo": [
        "Seoa’s pencil case: 1 flower eraser, 3 ballpoint pens",
        "47 names in ink, 1 in pencil",
        "3 days to the HR committee",
        "Ban Jaewook laughs out loud over the notebook for the first time"
      ],
      "choices": {
        "c17_branch_pencil_follow_a": {
          "label": "Take Seoa’s pen and trace the line yourself"
        },
        "c17_branch_pencil_follow_b": {
          "label": "Leave it in pencil; write the date and story beside it"
        },
        "c17_branch_pencil_follow_c": {
          "label": "Erase the line with the flower eraser, as if it never was"
        }
      },
      "place": "Ban Jaewook’s car · Back seat",
      "clock": "December 16 · 23:10",
      "question": "The flower eraser and the pen lie side by side. How do you leave your name in pencil?"
    },
    "c17_route_system": {
      "title": "The Hand That Wrote It Down",
      "text": "You propose sorting out first who audits have been disciplining. ECHO opens the audit office archive. 20 years of KD Bank audit reports, 312 of them, pour out. Among those disciplined, 241 were 'the one who wrote the document', and 19 were 'the one who ordered it written'. In cases where the order came only by word of mouth, the one who gave it was disciplined not once. 'Audits follow handwriting. Words leave no trace, so the hand that wrote it down has been learned as the final party responsible every time. 39 of the 47 in Ban Jaewook’s notebook are that hand.'",
      "memo": [
        "312 audit reports -- 241 writers disciplined, 19 who gave orders disciplined",
        "Orders given only by word of mouth: 0 who gave them disciplined",
        "39 of the 47 in the notebook are 'the hand that wrote it down'"
      ],
      "choices": {
        "c17_route_system_rule": {
          "label": "Propose a 'who gave the order' box in audit reports"
        },
        "c17_route_system_publish": {
          "label": "Send the figures to the committee and all 47 at once"
        },
        "c17_route_system_drop": {
          "label": "Shelve the figures; settle the notebook on schedule"
        },
        "c17_route_system_evidence_turn": {
          "label": "Overlay the 7-year-old notebook copy on the call log"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Lab terminal",
      "clock": "December 17",
      "question": "For 20 years, audits have cut the hand that wrote it down instead of the one who gave the order. What do you do with these figures?"
    },
    "c17_final_system_route": {
      "title": "Spoken Words Leave No Handwriting",
      "text": "December 19, the analyst room still dark. Two lines of discipline records sit one above the other on the terminal. Writers, 241. Those who ordered it, 19. When ECHO lays the 47 from Ban Jaewook’s notebook over them, 39 go to the top line. No name goes to the bottom line. At ten, it will be decided whether that notebook goes on the meeting-room table. 'The notebook is handwriting. Today, too, only handwriting goes on the table. The spoken order, once again, is written down nowhere.'",
      "memo": [
        "Discipline: 241 who wrote the document · 19 who gave the order",
        "39 of the 47 in the notebook were on the writing side",
        "Notebook deadline: 10:00 today"
      ],
      "choices": {
        "c17_final_system_route_c": {
          "label": "Make a rule protecting staff who record spoken orders"
        },
        "c17_final_system_route_a": {
          "label": "Bar audits that can’t name who gave the order from ending in discipline"
        },
        "c17_final_system_route_b": {
          "label": "Leave the rules; erase only the writers’ discipline records"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room · Lab terminal",
      "clock": "December 19 · Before dawn",
      "question": "At ten, once again only handwriting goes on the table. Where do you make a place for the spoken order to be written?"
    },
    "c17_evidence_turn": {
      "title": "Extension 3317",
      "text": "You pull up the extension call logs in the backup archive for the clue’s date, and a work-notebook page, kept as a scan in the audit record from 7 years ago, lines up with that day’s calls. It is the handwriting of Jung Taeo, former Guro Branch assistant manager, whose name is on the first page of Ban Jaewook’s notebook. On the day he wrote down the order to move the paper dates forward, a four-digit number is written in the corner of the page: 3317. Back then, the Corporate Finance Strategy Team head’s desk, where Yoon Sanghyuk sat. The branch manager only passed the call along, and Jung Taeo only wrote down what was passed along. In Ban Jaewook’s notebook, the 'who gave the order' box beside that name has never been filled. Lee Minseo closes the call log window. 'I nearly got fired over 11 missing seconds. This man got fired because his hand wrote down four digits. The one who writes it down always goes first.'",
      "memo": [
        "Corner of Jung Taeo’s work notebook: extension 3317",
        "3317 = Corporate Finance Strategy Team head’s desk, 7 years ago",
        "Team head at the time: Yoon Sanghyuk"
      ],
      "choices": {
        "c17_evidence_turn_tell": {
          "label": "Tell Jung Taeo first whose number it was"
        },
        "c17_evidence_turn_fill": {
          "label": "Write the number in the 'who gave the order' box, a first"
        },
        "c17_evidence_turn_hold": {
          "label": "Keep the number until the day you go up to the 33rd floor"
        }
      },
      "place": "Trigger Lab archive B2 · Extension call logs",
      "clock": "December 19 · 07:00",
      "question": "The order that got Jung Taeo fired came from Yoon Sanghyuk’s desk. How do you use these four digits?"
    },
    "c17_start_warm": {
      "title": "After the Last Cup of Noodles",
      "text": "The night you ate the 81st cup of noodles in the night-shift break room, you didn’t answer Ban Jaewook’s text until morning. Twelve days later, Kang Taemin has cleared one break-room locker for you, and in it is a postal envelope Ban Jaewook left. A certified letter from group legal. It demands that the notebook used in audit investigations be returned as a company record and submitted to the December 19 HR committee as evidence of your 'improper interference in an investigation'. Tearing open two cups of noodles, Kang Taemin says, 'He came by yesterday and sat here a long time. Says he’s going to visit the people in his notebook. On his own.'",
      "memo": [
        "Legal’s certified letter: return Ban Jaewook’s notebook as a 'company record'",
        "December 19 HR committee -- your improper interference in an investigation",
        "Ban Jaewook has decided to visit the 47 in the notebook alone"
      ],
      "choices": {
        "c17_start_warm_self": {
          "label": "Leave the notebook out; settle my case fast in writing"
        },
        "c17_start_warm_signature": {
          "label": "Bring Kang Taemin and a few of the night shift after Ban Jaewook"
        },
        "c17_start_warm_clause": {
          "label": "Challenge the letter’s 'company record' basis point by point"
        },
        "c17_start_warm_visit": {
          "label": "Visit the people in the notebook with Ban Jaewook first"
        },
        "c17_start_warm_reframe": {
          "label": "Sort out who audits have been disciplining"
        }
      },
      "place": "FlowOn fulfillment center · Night-shift break room",
      "clock": "December 15 · Dawn shift change",
      "question": "Ban Jaewook means to visit the people in the notebook alone. Who do you go after him with?",
      "lead": "Since the night the 80 cups of noodles were emptied, there has been a locker of your own in the night-shift break room."
    },
    "c17_start_record": {
      "title": "The Lawyer Who Wrote the Standard Clause",
      "text": "The night you were writing transition and retraining into the group’s standard lease terms, a text from Ban Jaewook said legal wanted his notebook. On the day the standard clause was reviewed line by line, legal sent that demand in writing. It demands that the audit notebook be returned as a company record and submitted to the December 19 HR committee as evidence of your 'improper interference in an investigation'. The notebook holds the names of 47 people Ban Jaewook let go over 20 years, and he means to visit them one by one before handing it over. A document production order has also been applied for in court. ECHO puts the author fields of the two papers side by side. The same lawyer. 'The hand that reviewed your document wrote this demand. The side that lost on paper pays it back on paper.'",
      "memo": [
        "Lawyer who reviewed the standard clause = author of the notebook demand",
        "December 19 HR committee -- your improper interference in an investigation",
        "47 names in the notebook -- Ban Jaewook means to visit them one by one",
        "Court document production application filed"
      ],
      "choices": {
        "c17_start_record_self": {
          "label": "Leave the notebook out; settle my case fast in writing"
        },
        "c17_start_record_signature": {
          "label": "Formally ask legal why both papers share an author"
        },
        "c17_start_record_clause": {
          "label": "Challenge the letter’s 'company record' basis point by point"
        },
        "c17_start_record_visit": {
          "label": "Visit the people in the notebook with Ban Jaewook first"
        },
        "c17_start_record_reframe": {
          "label": "Sort out who audits have been disciplining"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "December 15 · HR committee D-4",
      "question": "The lawyer who reviewed the standard lease clause also wrote the notebook demand. How do you handle this coincidence?",
      "lead": "The day the standard clause with the retraining condition came back from legal review, another envelope arrived."
    },
    "c17_start_rush": {
      "title": "The Night You Ran Ahead",
      "text": "The night you let the 81st cup of noodles from Kang Taemin go cold and took a taxi, Ban Jaewook, who had sent the text, crossed paths with you and went to the night-shift break room. He saw to the remaining papers of the 80 whose contracts were ending, one sheet at a time. Twelve days later, on Monday, December 15, he puts a postal envelope on your desk. A certified letter from group legal. It demands that the notebook used in audit investigations be returned as a company record and submitted to the December 19 HR committee as evidence of your 'improper interference in an investigation'. He sets a black notebook with a worn cover beside the envelope. 'Forty-seven people. The ones I let go over 20 years. That night, I saw to the break-room papers. This time, will you come with me from the first name?'",
      "memo": [
        "Legal’s certified letter: demand to return Ban Jaewook’s notebook",
        "47 names in the notebook -- people let go over 20 years",
        "That night, Ban Jaewook saw to the papers of the night shift of 80",
        "December 19 HR committee -- your improper interference in an investigation"
      ],
      "choices": {
        "c17_start_rush_visit": {
          "label": "Visit the people in the notebook with Ban Jaewook first"
        },
        "c17_start_rush_signature": {
          "label": "Put off replies and apologies; take his car to the first name"
        },
        "c17_start_rush_clause": {
          "label": "Challenge the letter’s 'company record' basis point by point"
        },
        "c17_start_rush_self": {
          "label": "Leave the notebook out; settle my case fast in writing"
        },
        "c17_start_rush_reframe": {
          "label": "Sort out who audits have been disciplining"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "December 15 · HR committee D-4",
      "question": "Ban Jaewook, who saw to the break-room papers for you that night, asks you to come from the first name. How do you answer?",
      "lead": "Twelve days after the night you left the cooling noodles and took a taxi, Ban Jaewook comes with a postal envelope."
    }
  },
  "echoReplies": {
    "c17_start_visit": "Some people won’t open the door when you visit. Ban Jaewook writes a date beside their names too.",
    "c17_start_clause": "When you challenge the basis, legal’s answer comes three days later. Ban Jaewook doesn’t wait those three days; he picks up his car keys.",
    "c17_start_self": "The written explanation goes out fast. That afternoon Ban Jaewook picks up his car keys alone, and looks back once at the door.",
    "c17_truck_stay": "You shake to the end, and Ban Jaewook’s coat sleeve is covered in sauce. Jung Taeo smiles for the first time.",
    "c17_truck_report": "Side by side, the two records clearly differ. Jung Taeo can’t look at the official report for long.",
    "c17_truck_consent": "When you hold out the consent form first, Jung Taeo’s hand stops turning skewers. 'Paperwork first, of course.'",
    "c17_office_truth": "When you tell her, Ha Eunkyung hugs the planner to her chest. After 6 years, the family learns that her brother did speak that day.",
    "c17_office_record": "When you open the record, his words survive as two words: 'Subject denies.' Whether to show those two words to his sister is another question.",
    "c17_office_leave": "You leave quietly, and Ha Eunkyung goes on packing boxes. The planner goes on top of the pile of scrap paper.",
    "c17_legal_walk": "When you stand, the meeting ends within 10 minutes. At the door, the lead counsel says, 'See you in court.'",
    "c17_legal_basis": "Demanded in writing, the answer has to name the person who retitled the table. Legal pushes the reply deadline as late as it can.",
    "c17_legal_deal": "At the idea of handing over only a copy, the lead counsel shakes his head. 'A copy isn’t evidence. Give us the original by 10:00 on the 19th.' Only the promise to drop Ban Jaewook stays in the file, and the 47 names stay as they are.",
    "c17_final_return": "As you return the pages, the notebook grows thin and then disappears. The evidence legal would submit disappears too, and Ban Jaewook’s 20 years scatter one page at a time.",
    "c17_final_court": "Submitted to the court, the 47 names go on public record. The title 'subjects of interference' is never attached, but the 17 who opposed look at you again.",
    "c17_final_burn": "With it burned, the HR committee meets without evidence. Jung Taeo’s one line turns to ash too, and once again, as 7 years ago, he becomes someone who exists nowhere.",
    "c17_after_warm": "When the lights go out, the 11 and Trigger Lab are left at the truck. Oh Jinwoo’s call isn’t over yet.",
    "c17_after_record": "Once in a proposal, the box survives a change of staff. At the very end of the proposal, Ban Jaewook writes his own name for the first time.",
    "c17_after_rush": "Upstairs, on the dark 4th floor, papers for tomorrow’s 9 a.m. meeting are waiting. At the truck, Oh Jinwoo, off the phone, looks for you and then gives up.",
    "c17_stars_choice_1": "When you tell her, Seoa goes quiet for a while. Then she brings two more flower stickers.",
    "c17_stars_choice_2": "With the stickers peeled, the notebook is clean as evidence. Seoa puts one star on the cover and closes her door.",
    "c17_stars_choice_3": "A star-rated notebook is flawed as evidence. A legal team lawyer will photograph those stickers.",
    "c17_unreached_choice_1": "Following the clue, you find one of them in a nursing hospital in Busan. Getting there takes a day. He doesn’t understand your questions, and the boxes still number three.",
    "c17_unreached_choice_2": "'No consent' goes on the record. The three never learn where their names were used.",
    "c17_unreached_choice_3": "The decision comes faster. The share of the four who can’t answer is decided for them by those who did.",
    "c17_name_choice_1": "After your promise, Jung Taeo wraps the work notebook in a plastic bag and hands it over. Now there are two to protect.",
    "c17_name_choice_2": "Matching the dates takes all night. At three in the morning, two pages from the same date lie open side by side.",
    "c17_name_choice_3": "Jung Taeo doesn’t press you. The work notebook goes back into his apron pocket.",
    "c17_stars_reaction_choice_1": "Going to the twenty-two homes first changes the order. A few who were waiting from the notebook’s first page wait another week.",
    "c17_stars_reaction_choice_2": "The demand stays on record as an official letter. Instead of deleting the numbers, legal creates a new field: 'Family details attached'.",
    "c17_stars_reaction_choice_3": "The order holds. The 22 numbers each go up by one again this year.",
    "c17_unreached_reaction_choice_1": "Once it’s public, Leadline posts a photo of the footnote. Legal starts by investigating how the draft leaked.",
    "c17_unreached_reaction_choice_2": "The inquiry creates a right to an answer. The date the answer arrives is set for the day after the HR committee.",
    "c17_unreached_reaction_choice_3": "You move on, and the footnote is printed as is. On paper, the four consent.",
    "c17_name_reaction_choice_1": "When you say it, Ban Jaewook doesn’t answer and wipes his glasses. He wipes them a long time.",
    "c17_name_reaction_choice_2": "When you offer to look together, Ban Jaewook doesn’t close the notebook. For the first time, that box becomes something to do.",
    "c17_name_reaction_choice_3": "Whether to submit gets decided. The blank box is still blank tonight.",
    "c17_branch_pencil_a": "As you hear him out, Ban Jaewook misses the light twice. The car behind honks, and Seoa stirs in her sleep.",
    "c17_branch_pencil_b": "Matched to the dates, the pencil line becomes a record not of collusion but of refusal. Proving it takes one request to view HR records.",
    "c17_branch_pencil_c": "Erased, legal’s evidence disappears. So does the only trace that Ban Jaewook refused to approve.",
    "c17_branch_pencil_follow_a": "Traced over, the pencil line becomes ink. Seoa puts a star sticker beside it. A half one.",
    "c17_branch_pencil_follow_b": "With the story written in, the line stays and gains an explanation. A long one, whether legal reads it or Seoa does.",
    "c17_branch_pencil_follow_c": "Erased, only a faint mark is left on the paper. Seoa gathers the eraser crumbs and shakes them out the window.",
    "c17_route_system_publish": "Sent to all at once, a few of the 47 contact each other for the first time. Legal starts by asking where the figures came from.",
    "c17_route_system_rule": "With the box made mandatory, the next audit on has to record who gave the order. What to write when it can’t be recorded is still blank.",
    "c17_route_system_drop": "With them shelved, the notebook problem is settled on schedule. The numbers 241 and 19 stay only in ECHO’s logs.",
    "c17_final_system_route_a": "Barred from ending in discipline, audits take longer. In exchange, cutting off just the one hand that wrote it down happens less.",
    "c17_final_system_route_b": "With the records erased, 39 names come out clean. Next year, someone still writes down what they are told, and that hand gets cut.",
    "c17_final_system_route_c": "With the protection rule in place, writing it down becomes leaving evidence. How many will trust the rule enough to write, no one knows.",
    "c17_evidence_turn_fill": "With the number written, a box blank for 20 years is filled for the first time. Ban Jaewook’s pen stops on those four digits for a long while.",
    "c17_evidence_turn_hold": "Kept back, the number becomes a card to play on the 33rd floor. Meanwhile, Jung Taeo doesn’t know whose call got him fired.",
    "c17_evidence_turn_tell": "When you tell him, Jung Taeo doesn’t turn the skewers for a long time. Then he asks, 'That man, is he still there?'",
    "c17_truck_evidence_turn": "Overlay the copy on the call log, and a record that never named who gave the order gains a number for the first time. Beside the number is the name of a desk.",
    "c17_office_evidence_turn": "Overlay the copy on the call log, and a record that never named who gave the order gains a number for the first time. Beside the number is the name of a desk.",
    "c17_legal_evidence_turn": "Overlay the copy on the call log, and a record that never named who gave the order gains a number for the first time. Beside the number is the name of a desk.",
    "c17_route_system_evidence_turn": "Overlay the copy on the call log, and a record that never named who gave the order gains a number for the first time. Beside the number is the name of a desk.",
    "case17_memory_system": "Sift through it and the opinion has rewritten your table with the word 'interference'. ECHO stacks 20 years of audit reports beside that word.",
    "case17_memory_evidence": "Hold the commitment with no requester against the audit record from 7 years ago, and four digits in the corner of a work-notebook copy catch your eye. An extension number.",
    "c17_start_warm_visit": "Some people won’t open the door when you visit. Ban Jaewook writes a date beside their names too.",
    "c17_start_warm_clause": "When you challenge the basis, legal’s answer comes three days later. Ban Jaewook doesn’t wait those three days; he picks up his car keys.",
    "c17_start_warm_self": "The written explanation goes out fast. That afternoon Ban Jaewook picks up his car keys alone, and looks back once at the door.",
    "c17_start_warm_signature": "When three hi-vis vests follow, Ban Jaewook is flustered. The people in the notebook are less wary of this crew than of a banker alone.",
    "c17_start_record_visit": "Some people won’t open the door when you visit. Ban Jaewook writes a date beside their names too.",
    "c17_start_record_clause": "When you challenge the basis, legal’s answer comes three days later. Ban Jaewook doesn’t wait those three days; he picks up his car keys.",
    "c17_start_record_self": "The written explanation goes out fast. That afternoon Ban Jaewook picks up his car keys alone, and looks back once at the door.",
    "c17_start_record_signature": "The inquiry stays on record. The next day, legal sends it again with the author field changed to 'Legal Team'.",
    "c17_start_rush_visit": "Some people won’t open the door when you visit. Ban Jaewook writes a date beside their names too.",
    "c17_start_rush_clause": "When you challenge the basis, legal’s answer comes three days later. Ban Jaewook doesn’t wait those three days; he picks up his car keys.",
    "c17_start_rush_self": "The written explanation goes out fast. That afternoon Ban Jaewook picks up his car keys alone, and looks back once at the door.",
    "c17_start_rush_signature": "This time you set off right away. No one has yet written the reply to legal or the apology to leave in the break room."
  },
  "choiceVoiceLines": {
    "c17_start_visit": "Saying you must meet them before it’s handed over, you visit the people in the notebook with Ban Jaewook first.",
    "c17_start_clause": "Asking how people’s names can be company property, you challenge the 'company record' basis point by point.",
    "c17_start_self": "With the December 19 HR committee set, you leave the notebook out and settle only your own disciplinary case fast in a written explanation.",
    "c17_truck_stay": "To let him finish the day’s business before rushing an answer, you shake the sauce bottle until closing, then open the notebook.",
    "c17_truck_report": "So he can see for himself where the two records part, you show the 7-year-old audit report beside that line in the notebook.",
    "c17_truck_consent": "To get his wishes on record before the notebook goes to the HR committee, you show legal’s papers first and get his consent to submit.",
    "c17_office_truth": "Unable to let it be closed up without the family knowing, you tell his sister exactly what he said in that interview.",
    "c17_office_record": "Saying you can’t hand his sister a guess, you open the investigation record from 6 years ago and find where his words survive.",
    "c17_office_leave": "Not wanting to break what her brother told the family, you ask the bereaved nothing more, write only 'deceased' in the notebook and leave.",
    "c17_legal_walk": "Unable to add the notebook to a table where only those who wrote it down remain, you name the 17 who opposed submission and get up from your seat.",
    "c17_legal_basis": "To leave a record of who turned the 47 into 'subjects', you demand in writing who retitled the table and on what basis.",
    "c17_legal_deal": "Saying Ban Jaewook at least must be pulled off the list, you take the offer to drop him and propose handing over only a copy.",
    "c17_final_return": "Saying the owners of the names must decide, you tear out each page, get consent and return it to the owner of the name.",
    "c17_final_court": "So the title 'subjects of interference' never gets attached, you submit the whole notebook to the court directly as public record.",
    "c17_final_burn": "To end today’s fight without handing these names to anyone, you burn the notebook together with Ban Jaewook.",
    "c17_after_warm": "Since legal’s meeting is tomorrow morning, you stay and shake the sauce bottle with them until the truck’s lights go out.",
    "c17_after_record": "So that box isn’t blank in the next audit, you put the principle for handling names and a 'who gave the order' box in a proposal.",
    "c17_after_rush": "Since legal’s text has come, saying the notebook comes first, you leave the party and go up to prepare for tomorrow’s follow-up meeting with legal.",
    "c17_stars_choice_1": "Not wanting to dodge what a child asked, you tell Seoa plainly what the two lines mean.",
    "c17_stars_choice_2": "Since signs of tampering could cloud the evidence, you peel off the stickers and restore the notebook.",
    "c17_stars_choice_3": "Saying the notebook can survive a few star stickers, you leave it as Seoa made it tonight and look for the next name.",
    "c17_unreached_choice_1": "Not wanting to leave three boxes empty, you use the clue the restaurant owner remembered to find at least one more.",
    "c17_unreached_choice_2": "Saying you can’t count the silent as yes, you formally record the three unreachable as 'no consent'.",
    "c17_unreached_choice_3": "Saying that looking for three more would run past the HR committee, you decide on the wishes of those reached alone.",
    "c17_name_choice_1": "Since someone might try to take his 7 years as well, you promise to protect Jung Taeo’s work notebook too.",
    "c17_name_choice_2": "To see whether two people writing separately point to the same place, you match the same date in both notebooks and trace who gave the order.",
    "c17_name_choice_3": "Saying tomorrow morning is right around the corner, you just take his thanks and go back to preparing for tomorrow’s HR committee.",
    "c17_stars_reaction_choice_1": "Saying those homes must know before it goes on the table, you visit the 22 with a child’s age first.",
    "c17_stars_reaction_choice_2": "So the children’s ages don’t become evidence too, you demand legal take family details out of the submission.",
    "c17_stars_reaction_choice_3": "Saying following the numbers would upset the order, you pretend you didn’t see them and go in name order as scheduled.",
    "c17_unreached_reaction_choice_1": "Saying outsiders should see it before it’s printed as is, you make public the footnote that counts those who can’t answer as consenting.",
    "c17_unreached_reaction_choice_2": "Saying you need the answer in writing to overturn it, you send legal a formal inquiry on the footnote’s basis.",
    "c17_unreached_reaction_choice_3": "Since touching it now could reveal you saw the draft, you plan to rebut the footnote on the day of the HR committee and move on.",
    "c17_name_reaction_choice_1": "So he doesn’t put himself in the same line as the higher-ups, you tell Ban Jaewook the blank box isn’t his fault.",
    "c17_name_reaction_choice_2": "Saying the 20 blank years should end here, you offer to look together for evidence to fill that box.",
    "c17_name_reaction_choice_3": "Since the HR committee comes when the night ends, you leave the box for later and decide first whether to submit tomorrow.",
    "c17_branch_pencil_a": "Wanting to know how he felt then before the dates, you hear out why he never approved that document.",
    "c17_branch_pencil_b": "To overturn legal’s claim of a plan with dates, you match the pencil line’s date to HR records and prove the facts.",
    "c17_branch_pencil_c": "Since legal wants that line to tie you two together, you suggest erasing it tonight.",
    "c17_branch_pencil_follow_a": "To make a line left erasable impossible to erase, you take the pen from Seoa and trace over the line with your own hand.",
    "c17_branch_pencil_follow_b": "Saying it is evidence only as written, you leave the line in pencil and write the date and the story beside it.",
    "c17_branch_pencil_follow_c": "Saying it was a line written to be erased any time, you erase it with the flower eraser as if it never happened.",
    "c17_route_system_publish": "Because the people involved must know that only the hands that wrote it down were disciplined, you send the figures to the HR committee and all 47 at once.",
    "c17_route_system_rule": "Saying orders given by word of mouth need a place to be written too, you propose making a 'who gave the order' box mandatory in audit reports.",
    "c17_route_system_drop": "Saying there’s no room to dig through all 312, you shelve the figures and settle only the notebook on schedule.",
    "c17_final_system_route_a": "Saying an audit must reach the spoken order to be an audit, you bar audits that can’t name who gave the order from ending in discipline.",
    "c17_final_system_route_b": "Judging the rules can’t be fixed by ten, you leave them as they are and erase only the discipline records of those who wrote it down.",
    "c17_final_system_route_c": "So the hand that wrote it down isn’t punished again, you make a rule protecting staff who record orders given by word of mouth.",
    "c17_evidence_turn_fill": "Now that there is evidence and no reason to leave it blank, you write the number in the notebook’s 'who gave the order' box for the first time.",
    "c17_evidence_turn_hold": "Saying four digits alone are not enough yet, you note the number and save it for the day you go up to the 33rd floor.",
    "c17_evidence_turn_tell": "Saying the man who waited 7 years should know first, you tell Jung Taeo whose number it was.",
    "c17_truck_evidence_turn": "You open the work-notebook copy kept in the 7-year-old audit record to the clue’s date and trace whether an extension call came into the branch that day.",
    "c17_office_evidence_turn": "You open the work-notebook copy kept in the 7-year-old audit record to the clue’s date and trace whether an extension call came into the branch that day.",
    "c17_legal_evidence_turn": "You open the work-notebook copy kept in the 7-year-old audit record to the clue’s date and trace whether an extension call came into the branch that day.",
    "c17_route_system_evidence_turn": "You open the work-notebook copy kept in the 7-year-old audit record to the clue’s date and trace whether an extension call came into the branch that day.",
    "c17_start_warm_visit": "Saying you must meet them before it’s handed over, you visit the people in the notebook with Ban Jaewook first.",
    "c17_start_warm_clause": "Asking how people’s names can be company property, you challenge the 'company record' basis point by point.",
    "c17_start_warm_self": "With the December 19 HR committee set, you leave the notebook out and settle only your own disciplinary case fast in a written explanation.",
    "c17_start_warm_signature": "Wanting to go with the people who even cleared a locker for you, you bring Kang Taemin and a few of the night shift and follow Ban Jaewook.",
    "c17_start_record_visit": "Saying you must meet them before it’s handed over, you visit the people in the notebook with Ban Jaewook first.",
    "c17_start_record_clause": "Asking how people’s names can be company property, you challenge the 'company record' basis point by point.",
    "c17_start_record_self": "With the December 19 HR committee set, you leave the notebook out and settle only your own disciplinary case fast in a written explanation.",
    "c17_start_record_signature": "To get an answer in writing on whether it’s a coincidence, you formally ask legal about the two papers sharing an author.",
    "c17_start_rush_visit": "Saying you must meet them before it’s handed over, you visit the people in the notebook with Ban Jaewook first.",
    "c17_start_rush_clause": "Asking how people’s names can be company property, you challenge the 'company record' basis point by point.",
    "c17_start_rush_self": "With the December 19 HR committee set, you leave the notebook out and settle only your own disciplinary case fast in a written explanation.",
    "c17_start_rush_signature": "Saying you must meet at least one more before December 19, you put off replies and apologies, get into Ban Jaewook’s car and start from the first name."
  },
  "pack": {
    "clue": {
      "title": "Extension 3317",
      "text": "The order that got Jung Taeo fired came down 7 years ago from the extension of the Corporate Finance Strategy Team head’s desk, Yoon Sanghyuk’s. The audit record kept only the handwriting of the one who wrote it down."
    },
    "outcomes": {
      "c17_after_warm": {
        "tag": "Stayed at the Truck",
        "title": "You shook the sauce bottle together until the lights went out",
        "text": "11 people from the notebook gathered in one place for the first time. That day, Ban Jaewook wrote down no one’s name."
      },
      "c17_after_record": {
        "tag": "Left a Principle",
        "title": "You put the names principle and a 'who gave the order' box on paper",
        "text": "The principle that no name in the notebook is used without its owner’s consent, and one new box in audit reports, became a proposal. Ban Jaewook’s name is at the end."
      },
      "c17_after_rush": {
        "tag": "Went Up First",
        "title": "You left the party early to prepare for legal’s meeting",
        "text": "You left the 11 at the truck and went up to the 4th floor. Meanwhile, no one could ask what the call Oh Jinwoo took behind the truck was about."
      }
    },
    "continuityChallenges": {
      "c16_after_warm": {
        "title": "Go Along, Like Someone Who Stayed in the Break Room",
        "text": "You stayed beside the night shift to the last cup of noodles. This time, choose the card that keeps Ban Jaewook from walking alone. Trust is at stake."
      },
      "c16_after_record": {
        "title": "Reframe a Table That Pays Back on Paper",
        "text": "The lawyer who reviewed your standard clause wrote the notebook demand. An attack on paper can’t be blocked on the same table, so you change the table first."
      },
      "c16_after_rush": {
        "title": "Stand Tall Even Before the Break Room You Left",
        "text": "You left the night-shift break room and ran ahead to the notebook case, and Ban Jaewook saw to the remaining papers. Fairness holds when you handle the notebook in a way you could explain to the people you left behind."
      }
    }
  }
};
