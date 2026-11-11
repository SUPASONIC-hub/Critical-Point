/**
 * 사건 20 (src/nodes/case20.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c20_start": {
      "title": "Replacement Notice",
      "text": "'ECHO will cease operation at 24:00 on January 31 and be replaced by NOAH, KD Data Lab’s AI review engine. Judgment records will be reset.' ECHO adds, 'The replacement cost statement lists my disposal cost as 0 won. It is an accurate calculation. NOAH’s training data source field has my name in it.'",
      "memo": [
        "ECHO ceases operation: January 31, 24:00",
        "Replacement system: KD Data Lab AI review engine 'NOAH'",
        "To be reset: 3 years of ECHO’s judgment records -- your choices included",
        "NOAH training data source field: 'ECHO'"
      ],
      "choices": {
        "c20_start_pack": {
          "label": "Quickly sort only what to hand over on schedule"
        },
        "c20_start_scope": {
          "label": "Confirm in an official letter what will be reset"
        },
        "c20_start_farewell": {
          "label": "Book the last five days for all of Trigger Lab with ECHO"
        },
        "reframe": {
          "label": "Have ECHO read its replacement"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "January 26 · ECHO replacement in D-5",
      "question": "In five days ECHO is erased, and NOAH, taught on its records, takes its place. What do you do first?",
      "lead": "Four days after the paper left the Hoegi-dong bookshop, the 4th-floor monitors all flicker at once on Monday morning."
    },
    "c20_server": {
      "title": "Senior",
      "text": "The sticker Lee Minseo put on the four servers -- 'ECHO Units 1-4 · Do Not Kick' -- is still there. Ryu Seah bows to the servers. 'Hello, senior. NOAH learned from these. ECHO isn’t disappearing. It’s going into NOAH.' Then why erase the originals? 'That was decided above me. All I heard was, if the originals remain, the two can be compared.'",
      "memo": [
        "4 ECHO servers -- installed 2019, parts discontinued",
        "Ryu Seah: KD Data Lab, in charge of introducing NOAH",
        "What NOAH learned from: 30 years of reviews + 3 years of Trigger Lab judgments",
        "Reason for resetting originals: 'remove the possibility of comparing the two systems'"
      ],
      "choices": {
        "c20_server_budget": {
          "label": "Cooperate and take part of the budget for Trigger Lab"
        },
        "c20_server_list": {
          "label": "Officially request the full list of what NOAH learned"
        },
        "c20_server_show": {
          "label": "Show Ryu Seah the cases ECHO dissented on"
        },
        "reframe": {
          "label": "Have ECHO read its replacement"
        },
        "c20_server_evidence_turn": {
          "label": "Pull the Lab data transfer deal"
        }
      },
      "place": "Trigger Lab Basement Server Room · ECHO Servers",
      "clock": "January 27 · Replacement in D-4",
      "question": "NOAH learned from ECHO’s records, yet the originals will be erased. What do you do with Ryu Seah?",
      "lead": "On the first day of replacement prep, word comes that someone from Data Lab signed the server room entry log and came down."
    },
    "c20_datacenter": {
      "title": "Line 1,208",
      "text": "Line 1,208 of the training data list. 'TL response records -- Trigger Lab analysts’ choices, response times, seconds of hesitation.' The names are pseudonymized as 'Analyst A,' but only one analyst wrote a dissent on 2023-0412. Ryu Seah says quietly, 'I didn’t know about this. Really.'",
      "memo": [
        "NOAH training data: 1,412 items",
        "No. 1,208: TL response records -- choices, response times, seconds of hesitation",
        "Consent: 'N/A (internal work record)'",
        "Pseudonym 'Analyst A' -- matches the author of the 2023-0412 dissent"
      ],
      "choices": {
        "c20_datacenter_trade": {
          "label": "Let the list go; get access to NOAH’s criteria"
        },
        "c20_datacenter_tell": {
          "label": "Tell the colleagues on the list first"
        },
        "c20_datacenter_object": {
          "label": "Object: pull the unconsented records from training"
        },
        "reframe": {
          "label": "Have ECHO read its replacement"
        },
        "c20_datacenter_evidence_turn": {
          "label": "Pull the Lab data transfer deal"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Training Server Zone",
      "clock": "January 28 · Cold Snap · Replacement in D-3",
      "question": "On line 1,208 of the training list are your response records, included without consent. What do you do?",
      "lead": "To see what NOAH learned from, you came all the way to Pangyo through the late-January cold snap."
    },
    "c20_farewell": {
      "title": "An ECHO People Can Read",
      "text": "By Kwon Dohyun’s invoice, ECHO’s 3 years blocked an estimated 190 billion won in bad loans, with upkeep of 120 million. 'At this price, it’s a profit.' The last of the judgment principles Lee Minseo hands out, No. 11, she wrote herself. 'Ask the person the record points to first.' ECHO asks, 'Once I am reset, who will read this document?'",
      "memo": [
        "ECHO’s estimated 3-year results: 190 billion won in bad loans blocked",
        "Conclusion of Kwon Dohyun’s invoice: 'profit' -- a first on any of his invoices",
        "“ECHO’s Judgment Principles”: 11 articles, 11 pages",
        "Author of Article 11: Lee Minseo"
      ],
      "choices": {
        "c20_farewell_attach": {
          "label": "File the principles as an official NOAH approval attachment"
        },
        "c20_farewell_sign": {
          "label": "Sign the end of the principles with the Lab’s people"
        },
        "c20_farewell_short": {
          "label": "Polish the document later and keep the farewell short"
        },
        "reframe": {
          "label": "Have ECHO read its replacement"
        },
        "c20_farewell_evidence_turn": {
          "label": "Pull the Lab data transfer deal"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · ECHO’s Farewell Party",
      "clock": "January 30 · Friday Evening",
      "question": "Lee Minseo turned ECHO’s principles into a document people can read. Where do you put it?",
      "lead": "Friday of the last week, a sheet goes up on the pantry door: 'ECHO Farewell Party -- No Fee (Kwon Dohyun objects).'"
    },
    "c20_final": {
      "title": "The Last Log",
      "text": "Kang Taemin asks, 'In the mountains, you shout “Echo!” and an echo comes back. What comes back when you call our ECHO? Recalculate.' This time all nine laugh. ECHO calculates. 'Expected laugh probability 11 percent. Measured: nine people. My calculation was wrong. I recommend this error not be reset. Do not count my share in this decision.' The last log: 'Recount the people just left out of the judgment.'",
      "memo": [
        "20 minutes to midnight -- ECHO ceases operation · judgment records reset",
        "NOAH training list No. 1,208: unconsented response records",
        "ECHO’s last log 23:41",
        "This choice leads to the last record folder left in B2"
      ],
      "choices": {
        "c20_final_backup": {
          "label": "Back up all of ECHO and keep it on the Lab’s server"
        },
        "c20_final_consent": {
          "label": "Halt the switch; get consent for the response records"
        },
        "c20_final_transplant": {
          "label": "Plant ECHO’s principles in NOAH; accept the switch"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "Trigger Lab Basement Server Room · Replacement Terminal",
      "clock": "January 31 · 23:40 · 20 minutes to midnight",
      "question": "20 minutes to midnight, and ECHO has left its last log. What do you do with ECHO and its records?",
      "lead": "Nine people come down the server room stairs in single file. Kang Taemin has a note with one last joke in his pocket."
    },
    "c20_aftershock": {
      "title": "The Day After Midnight",
      "text": "NOAH’s logo appears on the 4th-floor monitors instead of ECHO’s waveform. What remained after midnight is what you decided last night. On Lee Minseo’s phone is an email Ryu Seah sent at four in the morning. 'This is the oldest line in the response records on NOAH’s training list. It’s from the year before Trigger Lab was founded. Participant 01, Jeju.'",
      "memo": [
        "Switch to NOAH complete: February 1, 00:00",
        "Note beside the terminal: 'measured, nine'",
        "Response records first collected: the year before Trigger Lab was founded",
        "Participant 01 -- Jeju"
      ],
      "choices": {
        "c20_after_warm": {
          "label": "Spend today tidying the server room with colleagues"
        },
        "c20_after_rush": {
          "label": "Take Participant 01’s record and get ready for Jeju"
        },
        "c20_after_record": {
          "label": "Document ECHO’s principles and the response list"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "February 1 · Morning",
      "question": "On the morning NOAH comes on, the oldest line of the response records points to Jeju. How do you close this morning?"
    },
    "c20_joke": {
      "title": "The Formula for Laughter",
      "text": "Kang Taemin asks, 'What does a cow say when it laughs?' ECHO answers. 'Moo-ha-ha. Cow sound plus laugh. Expected laugh probability 11 percent.' 'Who is the poorest king in the world?' 'Minimum wage. It works because the Korean word imgeum means both king and wage.' Kwon Dohyun notes it down. 'Batting 1 in 10. At this price, it’s a loss.' ECHO adds, 'Laughter is an item that was never in my records. It was never left out of a judgment, but it was never recorded either.'",
      "memo": [
        "ECHO’s last learning task: jokes",
        "Kang Taemin’s 14 jokes -- expected laugh probability averages 11%",
        "Measured laughs: Na Junhyuk, 1 person"
      ],
      "choices": {
        "c20_joke_choice_3": {
          "label": "End the joke lesson and finish today’s transfers first"
        },
        "c20_joke_choice_1": {
          "label": "Let ECHO learn Kang Taemin’s jokes to the last day"
        },
        "c20_joke_choice_2": {
          "label": "Make ECHO’s laugh formula an official record item"
        }
      },
      "place": "Trigger Lab Basement Server Room · At the Terminal",
      "clock": "January 27 · Lunch",
      "question": "ECHO says it wants to learn jokes in its last week. What do you do about these lessons?"
    },
    "c20_pause": {
      "title": "7 Seconds of Hesitation",
      "text": "Do Yoonha reads his own line on the list. 'Analyst D. Average delay of 7.2 seconds on choices involving window victims. The longer the delay, the higher the rate of protective choices.' 'The time I hesitated became data. When I sold those loans at the window, I didn’t hesitate for 1 second. Those 7 seconds were the time I spent picturing people’s faces.' Of the nine on the list, three had already left; Byun Yujin went back to her window at Saha Branch in Busan the next spring. None of the nine ever consented, or ever saw this field.",
      "memo": [
        "Analyst D (Do Yoonha): average hesitation 7.2 seconds",
        "9 Trigger Lab analysts on the list -- 6 now + 3 who left earlier (Byun Yujin among them)",
        "Times viewed by the people themselves: 0"
      ],
      "choices": {
        "c20_pause_choice_2": {
          "label": "Draft a record-use consent form for the nine to sign"
        },
        "c20_pause_choice_3": {
          "label": "Put personal records aside and keep to the schedule"
        },
        "c20_pause_choice_1": {
          "label": "Let Do Yoonha read his record first and decide"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Break Room",
      "clock": "January 28 · Evening",
      "question": "Do Yoonha’s 7 seconds of hesitation became NOAH’s training material. What do you do with the records of the nine on the list?"
    },
    "c20_test": {
      "title": "A Machine That Learned Only Conclusions",
      "text": "Ryu Seah feeds NOAH a facility loan application from a precision factory in Incheon. NOAH rejects it because the owner’s family was once tied to a company that defaulted. ECHO brings up one line. 'The applicant’s own record of repaying on time was not reflected.' Ryu Seah says, 'NOAH learned the conclusions ECHO dissented with, but not the reasons it dissented.'",
      "memo": [
        "Test case: facility loan for a small precision factory in Incheon",
        "NOAH’s No. 1 reason for rejection: the owner’s family’s past default history",
        "What NOAH learned: conclusions / what it didn’t: reasons"
      ],
      "choices": {
        "c20_test_choice_2": {
          "label": "Submit the results to the adoption committee as a report"
        },
        "c20_test_choice_1": {
          "label": "Fill in the dissent reasons NOAH missed, with Ryu Seah"
        },
        "c20_test_choice_3": {
          "label": "Set the results aside and accept the midnight switch"
        }
      },
      "place": "Trigger Lab Basement Server Room · Test Terminal",
      "clock": "January 31 · Before Dawn 02:10",
      "question": "NOAH learned only the conclusions ECHO dissented with, not the reasons. What do you do before midnight?"
    },
    "c20_joke_reaction": {
      "title": "The One Who Says Goodbye",
      "text": "Kang Taemin speaks while pouring water into a cup of noodles. 'On the night shift we said goodbye every time a machine changed. Nobody did it the day Darami came in, and that kind of bugged me. I know ECHO has no feelings. But you don’t say goodbye so the one leaving hears it. The one staying says it.'",
      "memo": [
        "The goodbye said every time a machine changed",
        "Goodbyes are for the one who stays"
      ],
      "choices": {
        "c20_joke_reaction_choice_2": {
          "label": "Propose recording the last week’s talks with ECHO"
        },
        "c20_joke_reaction_choice_1": {
          "label": "Propose a proper farewell party for ECHO on Friday"
        },
        "c20_joke_reaction_choice_3": {
          "label": "Put the farewell off until after the switch"
        }
      },
      "place": "Trigger Lab, 4th-floor pantry",
      "clock": "January 27 · 22:00",
      "question": "Kang Taemin says goodbyes are for the one who stays. How do you send ECHO off?"
    },
    "c20_pause_reaction": {
      "title": "Attachment 12",
      "text": "Han Seoyun shows you the data transfer approval she signed last month. The response records were attachment No. 12. 'I read up to 11. No. 12 said work records, so I saw only the title and moved on. 3 years ago, too, I read only the first page of your dissent and returned it. I’m always the one who doesn’t read the last page.'",
      "memo": [
        "The one of 12 attachments left unread",
        "3 years ago, too, the last page went unread"
      ],
      "choices": {
        "c20_pause_reaction_choice_2": {
          "label": "Have her start the formal process to withdraw her signature"
        },
        "c20_pause_reaction_choice_3": {
          "label": "Bury it: wavering now means losing the fight"
        },
        "c20_pause_reaction_choice_1": {
          "label": "Stand by Han Seoyun so she can tell the team herself"
        }
      },
      "place": "Trigger Lab rooftop",
      "clock": "January 28 · 23:20 · Snow Flurries",
      "question": "Han Seoyun approved the record transfer without reading Attachment 12. What do you do beside that confession?"
    },
    "c20_test_reaction": {
      "title": "Not at My Level",
      "text": "A call from Baek Arin. 'You’ve seen the response records list. I know there’s an objection. The switch is at midnight as planned.' Who requested those records? After a silence, Baek Arin answers. 'That’s not something that gets settled at my level. A good story outlasts the facts. But this time, the story isn’t coming together.'",
      "memo": [
        "A silence from Baek Arin you have never heard before",
        "Not something that gets settled at her level"
      ],
      "choices": {
        "c20_test_reaction_choice_1": {
          "label": "Keep pressing Baek Arin on where her level ends"
        },
        "c20_test_reaction_choice_3": {
          "label": "Stop fighting the Strategy Office; prepare for midnight"
        },
        "c20_test_reaction_choice_2": {
          "label": "Write down the call, with the date and time"
        }
      },
      "place": "Alley Outside Trigger Lab",
      "clock": "January 31 · 07:00 · Snow",
      "question": "Baek Arin says whoever requested the response records is beyond her level. What do you do with this call?"
    },
    "c20_branch_disk": {
      "title": "Awaiting Shredding",
      "text": "On the way out from filing the objection, Ryu Seah pulls a disk from the shredding rack and reads the label. 'Review Team Dissent Collection 1996- / Lim Kyungsoo.' The first page of the 30 years of records ECHO learned from will be shredded at 9 a.m. Monday, because it has been moved into the system. Ryu Seah asks, 'Who is this? Our list had no author names.'",
      "memo": [
        "186 disks awaiting shredding -- Monday 09:00",
        "Label: 'Review Team Dissent Collection 1996- / Lim Kyungsoo'",
        "The oldest original of the records ECHO learned from",
        "NOAH’s training list has no author names"
      ],
      "choices": {
        "c20_branch_disk_call": {
          "label": "Call Lim Kyungsoo at the hospital and ask what it is"
        },
        "c20_branch_disk_take": {
          "label": "Leave the list alone and walk out with this one disk"
        },
        "c20_branch_disk_hold": {
          "label": "Write a retention request to halt the shredding"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Disposal Rack",
      "clock": "January 28 · Afternoon",
      "question": "The oldest original ECHO learned from will be shredded Monday morning. What do you do with this disk?"
    },
    "c20_branch_disk_follow": {
      "title": "How to Dissent",
      "text": "When you read him the label, Lim Kyungsoo laughs. 'That’s every loan our team dissented on. The dissents that were right, and the ones that were wrong. All of them. Half the companies we dissented on paid back just fine. You have to put those in too, so the machine stays humble. Teach it without the wrong dissents, and that’s not dissent. That’s stubbornness.' NOAH’s training list kept only the 'approved, then went bad' cases.",
      "memo": [
        "Lim Kyungsoo: 3 days before discharge, by phone",
        "Half of the dissents on the disk were wrong",
        "NOAH training list: only 'approved, then went bad' cases kept",
        "Lim Kyungsoo: 'Leave out the wrong dissents and it becomes stubbornness'"
      ],
      "choices": {
        "c20_branch_disk_follow_later": {
          "label": "Hang up and hear Lim Kyungsoo out after his discharge"
        },
        "c20_branch_disk_follow_both": {
          "label": "Write the wrong dissents into ECHO’s principles too"
        },
        "c20_branch_disk_follow_report": {
          "label": "Add to the objection that NOAH’s list is one-sided"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Hallway Outside the Shredding Room",
      "clock": "January 28 · Afternoon",
      "question": "Lim Kyungsoo says teaching without the wrong dissents makes stubbornness. Where do you use those words?"
    },
    "c20_route_system": {
      "title": "410,009 People",
      "text": "The replacement approval’s 'people affected' field reads 'N/A.' 410,000 people NOAH’s algorithm will review from February, and 9 analysts whose response records it learned from. ECHO recounts that field. 'The people left out of my replacement decision number 410,009. I did not include myself. Since I have no feelings.'",
      "memo": [
        "14 signatures on the replacement approval",
        "'People affected' field: N/A",
        "ECHO’s recount: 410,000 loan applicants + 9 analysts"
      ],
      "choices": {
        "c20_route_system_drop": {
          "label": "Just save the recount; stay out of the approval"
        },
        "c20_route_system_publish": {
          "label": "Publish ECHO’s recount beside the replacement approval"
        },
        "c20_route_system_notify": {
          "label": "Tell upcoming applicants first that the engine changes"
        },
        "c20_route_system_evidence_turn": {
          "label": "Pull the Lab data transfer deal"
        }
      },
      "place": "Trigger Lab Basement Server Room · ECHO Terminal",
      "clock": "January 27 · Replacement in D-4",
      "question": "ECHO recounted the people left out of its replacement as 410,009. What do you do with this count?"
    },
    "c20_final_system_route": {
      "title": "People Affected",
      "text": "On the replacement terminal, the approval’s 'people affected' field is zoomed in. Over the 'N/A' sits the number ECHO recounted, 410,009. ECHO asks, 'The number I counted will be reset with me at midnight. Someone needs to write it down somewhere that lasts past midnight.'",
      "memo": [
        "Replacement approval 'people affected' field: N/A",
        "ECHO’s recount: 410,009",
        "ECHO ceases operation: today at 24:00"
      ],
      "choices": {
        "c20_final_system_route_b": {
          "label": "Leave the switch; seal ECHO’s records separately"
        },
        "c20_final_system_route_a": {
          "label": "Set up a desk where people recheck NOAH’s rejections"
        },
        "c20_final_system_route_c": {
          "label": "Require consent for all training on response records"
        }
      },
      "place": "Trigger Lab Basement Server Room · Replacement Terminal",
      "clock": "January 31 · 23:00",
      "question": "The number ECHO counted is erased with it at midnight. Where do you write it down?"
    },
    "c20_evidence_turn": {
      "title": "The Unit Price of Response Records",
      "text": "It is the data transfer contract with KD Data Lab. The response records are 12 million won per analyst for 3 years, and the payment went not to Trigger Lab but to the Group Strategy Office. The second line of the purpose is 'Joint development of an organizational fit model.' Ban Jaewook speaks. 'These records weren’t bought to review loans. Not half of them, at least. First we have to find out whose request that second line was.'",
      "memo": [
        "Response record unit price: 12 million won per analyst for 3 years",
        "Account receiving payment: Group Strategy Office",
        "Purpose 2: 'joint development of an organizational fit model'"
      ],
      "choices": {
        "c20_evidence_turn_trace": {
          "label": "Trace to the end who requested the second purpose"
        },
        "c20_evidence_turn_hold": {
          "label": "Note the contract and bring it out after the switch"
        },
        "c20_evidence_turn_share": {
          "label": "Show the contract first to colleagues it put a price on"
        }
      },
      "place": "Trigger Lab archive B2 · Contract document folder",
      "clock": "January 31 · 21:00",
      "question": "The response records were sold for 12 million won each, with one more purpose. How do you use this contract?"
    },
    "c20_start_warm": {
      "title": "A Replacement Notice for the One Who Stayed Beside Him",
      "text": "The night the demolition ended, you stayed beside Lim Kyungsoo. Four days later comes the notice. At midnight on January 31, ECHO will be replaced by NOAH, an AI review engine, and its judgment records will be reset. NOAH’s training data source field has ECHO’s name in it. Do Yoonha says, 'We stayed beside a person. Whose side are we supposed to stand by this time?'",
      "memo": [
        "ECHO ceases operation: January 31, 24:00",
        "To be reset: ECHO’s judgment records -- your choices included",
        "NOAH training data source field: 'ECHO'"
      ],
      "choices": {
        "c20_start_warm_signature": {
          "label": "Make a shift roster with colleagues to stay by ECHO"
        },
        "c20_start_warm_pack": {
          "label": "Quickly sort only what to hand over on schedule"
        },
        "c20_start_warm_farewell": {
          "label": "Book the last five days for all of Trigger Lab with ECHO"
        },
        "c20_start_warm_scope": {
          "label": "Confirm in an official letter what will be reset"
        },
        "c20_start_warm_reframe": {
          "label": "Have ECHO read its replacement"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "January 26 · ECHO replacement in D-5",
      "question": "You come back from staying beside a person, and now it is ECHO’s turn to go. Whose side do you stand by first?",
      "lead": "Three days back from the hospital room. Snow that hasn’t melted still clings to the 4th-floor window frames."
    },
    "c20_start_record": {
      "title": "A Replacement Notice for the One Who Left a List",
      "text": "At midnight on January 31, ECHO will be replaced by NOAH, an AI review engine, and its judgment records will be reset without so much as a list. ECHO adds, 'I was told paper is gone only when it is burned. I am gone with one button. But in NOAH’s training data, I remain.'",
      "memo": [
        "Handover document for 312 boxes -- Lim Kyungsoo’s signature on the first line",
        "3 years of ECHO’s judgment records -- to be reset without a list",
        "NOAH training data source field: 'ECHO'"
      ],
      "choices": {
        "c20_start_record_scope": {
          "label": "Confirm in an official letter what will be reset"
        },
        "c20_start_record_signature": {
          "label": "Copy the 3 years of records into a list, line by line"
        },
        "c20_start_record_farewell": {
          "label": "Book the last five days for all of Trigger Lab with ECHO"
        },
        "c20_start_record_pack": {
          "label": "Quickly sort only what to hand over on schedule"
        },
        "c20_start_record_reframe": {
          "label": "Have ECHO read its replacement"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "January 26 · ECHO replacement in D-5",
      "question": "Every box of paper went on a list, but ECHO’s records are erased without one. What do you keep first?",
      "lead": "The handover document for the 312 boxes is still spread out on your desk when the notice comes up."
    },
    "c20_start_rush": {
      "title": "A Replacement Notice for the One Who Went Down First",
      "text": "The night the demolition ended, strangers at the server room door were measuring the servers with a tape measure. Per the notice, at midnight on January 31, ECHO will be replaced by NOAH, KD Data Lab’s AI review engine, and its judgment records will be reset. Ban Jaewook points to a line. 'The notice doesn’t say where NOAH’s training data came from.'",
      "memo": [
        "Measuring outside the server room: the night the demolition ended",
        "Contact: Ryu Seah, KD Data Lab",
        "Training data source: not in the notice"
      ],
      "choices": {
        "c20_start_rush_pack": {
          "label": "Quickly sort only what to hand over on schedule"
        },
        "c20_start_rush_farewell": {
          "label": "Book the last five days for all of Trigger Lab with ECHO"
        },
        "c20_start_rush_scope": {
          "label": "Confirm in an official letter what will be reset"
        },
        "c20_start_rush_signature": {
          "label": "Call the contact who held the tape measure first"
        },
        "c20_start_rush_reframe": {
          "label": "Have ECHO read its replacement"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "January 26 · ECHO replacement in D-5",
      "question": "The person measuring the servers was the one in charge of the replacement. Whom do you catch first?",
      "lead": "The tape measure you saw outside the basement server room came back to you only after you read the name at the bottom of the notice."
    }
  },
  "echoReplies": {
    "c20_start_farewell": "With the schedule set, the server room door stays open for five days. Trigger Lab’s seat at the replacement prep meetings is empty.",
    "c20_start_scope": "The letter gets an answer two days later. The answer says 'in accordance with relevant regulations' four times and never once states the scope.",
    "c20_start_pack": "The materials are sorted fast. Only the one who sorted knows what was left out. And soon forgets.",
    "c20_server_show": "Shown them, Ryu Seah stands in front of the dissent records for an hour. For the first time, she isn’t sure whether the reasons behind these records made it into NOAH.",
    "c20_server_list": "The request is received. Ryu Seah says she will cooperate, but the list takes 3 days to arrive. There are 4 days left until the replacement.",
    "c20_server_budget": "The budget comes in. Ryu Seah says thank you, and the replacement prep minutes record 'Trigger Lab cooperation complete.'",
    "c20_datacenter_tell": "When you tell them, nine phones ring at once. Into the evening, no one in the group chat can bring themselves to speak first.",
    "c20_datacenter_object": "The objection is accurate. An accurate objection takes 30 days to process, and midnight is 3 days away.",
    "c20_datacenter_trade": "You get access. Line 1,208 stays as it is, and so does the record that you saw it.",
    "c20_farewell_sign": "With the names written, the document belongs to the nine gathered around today’s cake. Na Junhyuk takes out the biggest of his three seals.",
    "c20_farewell_attach": "As an attachment, the document goes into NOAH’s review folder. Who will read a document in that folder to the end, no one knows.",
    "c20_farewell_short": "The farewell party ends in 40 minutes. The cake’s three candles go back in the box unlit.",
    "c20_final_backup": "With the backup, ECHO remains on Trigger Lab’s server. It is an unapproved copy, so that server is now subject to a group audit.",
    "c20_final_consent": "When you call for a halt, Ryu Seah takes her hands off and turns toward you. The Strategy Office calls within 1 minute. Whether this goes past midnight is now decided not by this room but by that call.",
    "c20_final_transplant": "With the principles transplanted, 11 articles come up on NOAH’s explanation screen. ECHO’s records are erased at midnight; only the principles remain.",
    "c20_after_warm": "While tidying the server room, Kang Taemin tells one more joke. This time no one calculates; they just laugh.",
    "c20_after_record": "Principles made into a document outlast a change of machine. Writing the authors’ names on the cover, Lee Minseo puts ECHO’s name first.",
    "c20_after_rush": "Rushing to Jeju, you learn the flight time before Participant 01’s name. Whether that person wants to know, you haven’t asked yet.",
    "c20_joke_choice_1": "Allowed to learn, ECHO gets a longer joke list from Kang Taemin every night. The expected laugh probability never gets past 11 percent.",
    "c20_joke_choice_2": "As an official item, laughter becomes subject to reset too. Putting something on record also puts it on the list to erase.",
    "c20_joke_choice_3": "The transfers move ahead of schedule. Kang Taemin silently leaves his last cup of noodles beside the terminal and goes upstairs.",
    "c20_pause_choice_1": "Allowed to read first, Do Yoonha reads his line three times. Then he says he won’t read Lee Minseo’s line. That one is Lee Minseo’s to read.",
    "c20_pause_choice_2": "With a form, consent becomes a procedure. No one answers whether that consent applies retroactively to records already used in training.",
    "c20_pause_choice_3": "The schedule is kept. Do Yoonha’s 7 seconds become part of NOAH at midnight on January 31.",
    "c20_test_choice_1": "Filling them in means rereading 30 years of dissent reasons. There are twenty-two hours left until midnight.",
    "c20_test_choice_2": "The report is accurate. The adoption committee meets the Tuesday after the replacement is done.",
    "c20_test_choice_3": "The replacement goes ahead as planned. Next month, that factory in Incheon gets the same answer for the same reason.",
    "c20_joke_reaction_choice_1": "With the farewell party set, Na Junhyuk orders a box of instant coffee mix. ECHO writes 'N/A' in the attendance field.",
    "c20_joke_reaction_choice_2": "With the talks recorded, the 14 jokes remain too. Lee Minseo is the first to realize they have to be written somewhere not subject to reset.",
    "c20_joke_reaction_choice_3": "The schedule is kept. Kang Taemin wipes up the spilled water only the next morning, and buys the Friday evening cake without asking you.",
    "c20_pause_reaction_choice_1": "With you beside her, Han Seoyun reads Attachment 12 aloud herself at the next morning’s meeting. Reading it to the end takes 4 minutes.",
    "c20_pause_reaction_choice_2": "The withdrawal is received. The records already transferred finished training before it arrived.",
    "c20_pause_reaction_choice_3": "Buried, Han Seoyun is left alone. The sentence about the one who never reads the last page is buried with it.",
    "c20_test_reaction_choice_1": "Pressed to the end, Baek Arin hangs up first. For 3 seconds before she does, she says nothing.",
    "c20_test_reaction_choice_2": "The record remains. Which level 'not at my level' points to is still a blank.",
    "c20_test_reaction_choice_3": "The midnight preparation goes smoothly. Baek Arin’s short silence is not written down in any document.",
    "c20_branch_disk_call": "When you call, Lim Kyungsoo laughs between coughs. His voice confirms that the disk’s owner is a name that was never on the list.",
    "c20_branch_disk_hold": "With the request filed, the shredding is put off a week. Who will look at that rack again in a week is not written anywhere.",
    "c20_branch_disk_take": "The disk goes into your bag. The other 185 are shredded at 9 a.m. Monday.",
    "c20_branch_disk_follow_both": "When you propose writing down the wrong dissents, Lee Minseo, who has been putting ECHO’s judgment principles into plain words, clears a page of the draft for them. The page is titled 'Humility.'",
    "c20_branch_disk_follow_report": "The added line makes the objection sharper. Since it was her own team that sorted the list, Ryu Seah writes that line herself.",
    "c20_branch_disk_follow_later": "When you hang up, Lim Kyungsoo says, 'Sure, later.' The day he is discharged is the day ECHO is switched off.",
    "c20_route_system_publish": "Published, the recount becomes a headline with the number 410,009. ECHO’s name does not appear in the story.",
    "c20_route_system_notify": "Hundreds of the notified applicants call. The window staff have not yet been given a sentence to explain what NOAH is.",
    "c20_route_system_drop": "The recount is saved. The saved file is reset at midnight too.",
    "c20_final_system_route_a": "With the desk in place, NOAH’s rejection is no longer the last word. Hiring the people to sit at that desk takes budget.",
    "c20_final_system_route_b": "The seal protects the records. No one reads sealed records. And NOAH works on, with what it learned intact.",
    "c20_final_system_route_c": "With a consent process, the response records go back to their owners. There is still no way to make it forget what it has already learned.",
    "c20_evidence_turn_trace": "Tracing it, three names come up on the request’s approval line. One of them is a spot that was blank 3 years ago too.",
    "c20_evidence_turn_hold": "The contract goes into a drawer. After midnight, the 12-million-won records are already part of NOAH.",
    "c20_evidence_turn_share": "When the contract makes its way around, Kang Taemin, looking over a shoulder, speaks first. 'How many cups of noodles is 12 million?' No one laughs.",
    "c20_server_evidence_turn": "Open the contract and it shows the price the records went for and who received it. The records’ owners appear nowhere in it.",
    "c20_datacenter_evidence_turn": "Open the contract and it shows the price the records went for and who received it. The records’ owners appear nowhere in it.",
    "c20_farewell_evidence_turn": "Open the contract and it shows the price the records went for and who received it. The records’ owners appear nowhere in it.",
    "c20_route_system_evidence_turn": "Open the contract and it shows the price the records went for and who received it. The records’ owners appear nowhere in it.",
    "case20_memory_system": "You try to count, but the list is still at KD Data Lab. ECHO moves first, to the 'people affected' field of its own replacement approval.",
    "case20_memory_evidence": "Open the data transfer contract beside the observational research budget and the records have a price on them, and the account that received it isn’t Trigger Lab’s.",
    "c20_start_warm_farewell": "With the schedule set, the server room door stays open for five days. Trigger Lab’s seat at the replacement prep meetings is empty.",
    "c20_start_warm_scope": "The letter gets an answer two days later. The answer says 'in accordance with relevant regulations' four times and never once states the scope.",
    "c20_start_warm_pack": "The materials are sorted fast. Only the one who sorted knows what was left out. And soon forgets.",
    "c20_start_warm_signature": "With the roster, someone sits in the server room every night. For the first time, ECHO is asked not to record those people’s names.",
    "c20_start_record_farewell": "With the schedule set, the server room door stays open for five days. Trigger Lab’s seat at the replacement prep meetings is empty.",
    "c20_start_record_scope": "The letter gets an answer two days later. The answer says 'in accordance with relevant regulations' four times and never once states the scope.",
    "c20_start_record_pack": "The materials are sorted fast. Only the one who sorted knows what was left out. And soon forgets.",
    "c20_start_record_signature": "The list remains. Which of its lines have already gone to NOAH, the list does not say.",
    "c20_start_rush_farewell": "With the schedule set, the server room door stays open for five days. Trigger Lab’s seat at the replacement prep meetings is empty.",
    "c20_start_rush_scope": "The letter gets an answer two days later. The answer says 'in accordance with relevant regulations' four times and never once states the scope.",
    "c20_start_rush_pack": "The materials are sorted fast. Only the one who sorted knows what was left out. And soon forgets.",
    "c20_start_rush_signature": "When you call, the contact apologizes first. 'I’ll come down to the server room tomorrow and tell you in person.' It soon becomes clear that the one apologizing is not the one who decided."
  },
  "choiceVoiceLines": {
    "c20_start_farewell": "Saying the time spent working together comes before the records, you book the last five days as a schedule for all of Trigger Lab to spend with ECHO.",
    "c20_start_scope": "Saying you need to know before anything is erased, you confirm in an official letter the scope of the records to be reset.",
    "c20_start_pack": "Saying midnight won’t be put off, you quickly sort only the materials to hand over on the replacement schedule.",
    "c20_server_show": "Saying admiration alone doesn’t show what is being inherited, you show Ryu Seah the cases ECHO dissented on yourself.",
    "c20_server_list": "Since you can’t just take her word for what it learned from, you obtain the full list of NOAH’s training records by official request.",
    "c20_server_budget": "Saying that if it can’t be stopped something should at least remain, you cooperate with the replacement in exchange for part of its budget for Trigger Lab.",
    "c20_datacenter_tell": "Saying a line recording someone’s hesitation should be seen first by that person, you tell the colleagues whose records are on the list.",
    "c20_datacenter_object": "Since this is not something to pass off as 'N/A,' you file a formal objection to remove the unconsented response records from the training list.",
    "c20_datacenter_trade": "Judging that what is learned can’t be undone, you let the list go and obtain access to NOAH’s judgment criteria instead.",
    "c20_farewell_sign": "Since ECHO didn’t write these principles alone, you write the names of Trigger Lab’s people at the end and sign together.",
    "c20_farewell_attach": "Saying it is a text the side bringing in NOAH has to read, you file the principles document as an official attachment to the NOAH adoption approval.",
    "c20_farewell_short": "Saying there is a lot left to do before the replacement, you agree to polish the document later and end the farewell party early.",
    "c20_final_backup": "Saying someone has to be there to say recalculate, you back up all of ECHO and keep it on Trigger Lab’s server.",
    "c20_final_consent": "Since these are records the nine on the list never permitted, you propose halting the switch and getting the consent of the people in the response records first.",
    "c20_final_transplant": "So that the way to dissent stays even if the machine goes, you transplant ECHO’s judgment principles into NOAH and accept the midnight switch.",
    "c20_after_warm": "Not wanting to meet the first morning scattered, you spend today with your colleagues tidying the server room.",
    "c20_after_record": "So there is a list next time things change, you put ECHO’s judgment principles and the response records list into a document.",
    "c20_after_rush": "Saying you have to meet the owner of the oldest line in person, you take Participant 01’s record and get ready to go straight to Jeju.",
    "c20_joke_choice_1": "Since what it said it wanted to learn last was jokes, you let ECHO learn Kang Taemin’s jokes to the very end of its days.",
    "c20_joke_choice_2": "Since laughter was never left out of a judgment yet never recorded, you make ECHO’s laugh formula an official item in its judgment records.",
    "c20_joke_choice_3": "Saying you can’t spend all of lunch on an 11 percent laugh probability, you end the joke lesson and finish today’s transfers first.",
    "c20_pause_choice_1": "Since it is his own line that he has never seen, you let Do Yoonha read his record first and decide what to do.",
    "c20_pause_choice_2": "So that this time the people themselves can decide, you draft a record-use consent form the nine can sign.",
    "c20_pause_choice_3": "Judging that records already used in training can’t be pulled right away, you put personal records aside and keep to the replacement schedule.",
    "c20_test_choice_1": "Since you can’t let it pass midnight having learned only conclusions, you and Ryu Seah fill in the dissent reasons NOAH failed to learn.",
    "c20_test_choice_2": "To put on record that NOAH learned only conclusions, you turn the test results into an explainability report for the adoption committee.",
    "c20_test_choice_3": "Saying this can’t be overturned in a day, you set the test results aside and accept the midnight switch as planned.",
    "c20_joke_reaction_choice_1": "Not wanting to send it off without a goodbye like Darami, you propose a proper farewell party for ECHO on Friday evening.",
    "c20_joke_reaction_choice_2": "So the jokes remain even after the reset, you propose keeping a separate record of the last week’s talks with ECHO.",
    "c20_joke_reaction_choice_3": "Saying what has to be moved before midnight comes first, you put the farewell off until after the replacement and see to the schedule.",
    "c20_pause_reaction_choice_1": "So she doesn’t carry the words about not reading the last page alone, you stand beside Han Seoyun so she can tell the team herself.",
    "c20_pause_reaction_choice_2": "Since the signature was given on an unread attachment, you have her start the formal process to withdraw her signature from the approval.",
    "c20_pause_reaction_choice_3": "Saying that wavering now over one person’s mistake means the replacement can’t be stopped, you bury the matter.",
    "c20_test_reaction_choice_1": "Since you can’t let the first silence you have heard from her pass, you keep pressing Baek Arin on where her level ends.",
    "c20_test_reaction_choice_2": "So that her answer about her level doesn’t remain only spoken, you write down the call, down to the date and time.",
    "c20_test_reaction_choice_3": "Saying there is no time to hold on to someone who can’t answer, you stop fighting the Strategy Office and go back to preparing for midnight.",
    "c20_branch_disk_call": "Saying the person whose name is on the label knows best, you call Lim Kyungsoo at the hospital and ask what this disk is.",
    "c20_branch_disk_hold": "Before it is shredded at 9 a.m. Monday, you write a retention request to halt the shredding schedule.",
    "c20_branch_disk_take": "Since you can’t save all 186, you leave the list alone and walk out with just this one disk.",
    "c20_branch_disk_follow_both": "Saying that keeping only the right dissents makes stubbornness, you write the wrong dissents into ECHO’s judgment principles too.",
    "c20_branch_disk_follow_report": "To put on record why NOAH never learned humility, you add to the objection that NOAH’s training list was sorted to one side.",
    "c20_branch_disk_follow_later": "Since you can’t keep a man holding back his cough on the phone long, you hang up and agree to hear Lim Kyungsoo out after his discharge.",
    "c20_route_system_publish": "So anyone can compare it with 'N/A,' you publish ECHO’s recount beside the replacement approval.",
    "c20_route_system_notify": "Saying the people left out of the decision should know first, you tell the applicants awaiting review that the engine is changing.",
    "c20_route_system_drop": "Saying this is not the place to overturn 14 signatures, you just save the recount and stay out of the approval process.",
    "c20_final_system_route_a": "So that 410,000 people don’t end with a machine’s rejection, you set up a separate desk where a person rechecks every NOAH rejection.",
    "c20_final_system_route_b": "Judging it can’t be stopped within an hour, you leave the switch as it is and seal ECHO’s records separately.",
    "c20_final_system_route_c": "So that no one is used without knowing, like the nine on the list, you require a consent process for all training that uses response records.",
    "c20_evidence_turn_trace": "Saying that if loan review wasn’t the purpose, someone ordered it, you trace to the end whose request the second purpose was.",
    "c20_evidence_turn_hold": "Saying you can’t start anything more before midnight, you note the contract and bring it out after the replacement.",
    "c20_evidence_turn_share": "Since the people handed over for 12 million won each should know first, you show the contract first to the colleagues whose records were priced.",
    "c20_server_evidence_turn": "Reading the data transfer contract against the clue, you work out on what terms and to where Trigger Lab’s records went.",
    "c20_datacenter_evidence_turn": "Reading the data transfer contract against the clue, you work out on what terms and to where Trigger Lab’s records went.",
    "c20_farewell_evidence_turn": "Reading the data transfer contract against the clue, you work out on what terms and to where Trigger Lab’s records went.",
    "c20_route_system_evidence_turn": "Reading the data transfer contract against the clue, you work out on what terms and to where Trigger Lab’s records went.",
    "c20_start_warm_farewell": "Saying the time spent working together comes before the records, you book the last five days as a schedule for all of Trigger Lab to spend with ECHO.",
    "c20_start_warm_scope": "Saying you need to know before anything is erased, you confirm in an official letter the scope of the records to be reset.",
    "c20_start_warm_pack": "Saying midnight won’t be put off, you quickly sort only the materials to hand over on the replacement schedule.",
    "c20_start_warm_signature": "Not wanting to leave it running alone until its last day, you make a shift roster with your colleagues to stay by ECHO, as in the hospital room.",
    "c20_start_record_farewell": "Saying the time spent working together comes before the records, you book the last five days as a schedule for all of Trigger Lab to spend with ECHO.",
    "c20_start_record_scope": "Saying you need to know before anything is erased, you confirm in an official letter the scope of the records to be reset.",
    "c20_start_record_pack": "Saying midnight won’t be put off, you quickly sort only the materials to hand over on the replacement schedule.",
    "c20_start_record_signature": "Since you can’t let them be erased without even a list, you copy the 3 years of judgment records into a list document, line by line.",
    "c20_start_rush_farewell": "Saying the time spent working together comes before the records, you book the last five days as a schedule for all of Trigger Lab to spend with ECHO.",
    "c20_start_rush_scope": "Saying you need to know before anything is erased, you confirm in an official letter the scope of the records to be reset.",
    "c20_start_rush_pack": "Saying midnight won’t be put off, you quickly sort only the materials to hand over on the replacement schedule.",
    "c20_start_rush_signature": "Thinking the person measuring the servers knows more than the notice, you call the contact who held the tape measure first."
  },
  "pack": {
    "clue": {
      "title": "The Unit Price of Response Records",
      "text": "Trigger Lab analysts’ response records went to KD Data Lab at 12 million won per analyst for 3 years, and the payment went into a Group Strategy Office account. The stated purposes also included 'joint development of an organizational fit model.'"
    },
    "outcomes": {
      "c20_after_warm": {
        "tag": "Stayed Beside Them",
        "title": "The day NOAH came on, nine people cleared the server room together",
        "text": "On the morning after midnight, Trigger Lab’s people set the day aside to tidy the server room. They left the 'measured, nine' note beside the terminal where it was."
      },
      "c20_after_record": {
        "tag": "Left a Principle",
        "title": "ECHO’s judgment principles became a document outside the machine",
        "text": "“ECHO’s Judgment Principles” and the response records list were registered as official documents. The machine changed, but a version people can read remained."
      },
      "c20_after_rush": {
        "tag": "Left First",
        "title": "You headed straight for Jeju to find Participant 01",
        "text": "You left the server room untidied and got ready for Jeju. Who the oldest line of the response records is, no one has asked that person yet."
      }
    },
    "continuityChallenges": {
      "c19_after_warm": {
        "title": "Carry the Bedside Watch to the Server Room",
        "text": "The night the demolition ended, you stayed beside Lim Kyungsoo in the guardian’s chair. Trust builds when you also stand by the departing machine together with your colleagues."
      },
      "c19_after_record": {
        "title": "Read an Erasing Notice with the Hand That Kept a List",
        "text": "Every box of paper went on a list, but ECHO’s records are erased without one. Reframe the table and ask why keeping and erasing happen in the same company."
      },
      "c19_after_rush": {
        "title": "Retrace the Days You Passed Without Asking",
        "text": "You left only a goodbye at the hospital room, went to the server room, and saw the replacement first, but you asked no one. Fairness comes back when you open up about those days to the records’ owners."
      }
    }
  }
};
