/**
 * 사건 23 (src/nodes/case23.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c23_start": {
      "title": "Agenda Item No. 3",
      "text": "KD Financial Group sends notice of its annual shareholders’ meeting (where the shareholders who own the company vote on major matters). Friday, March 20, at 10. Agenda Item No. 3 is the appointment of Yoon Sanghyuk as an inside director (one who helps run the company). In the career history Han Seoyun points to, there is no 2023. 'By March 6, the cutoff for who gets to vote, the victims’ group, the night shift, To-the-End Precision, and 3,118 Leadline readers each bought one share. All together, that’s 0.0008%.' She holds out the shareholder breakdown. Foreign investors 68%, the National Pension Service 8%, employees 5%. 'These are the ones who vote. What we have is reasons for them to vote no. After the Gaeul Rice Cake Shop series, KD Bank’s brand rating fell for a month straight, and last week its ESG (environmental, social, and governance) rating dropped a notch. People holding other people’s money read that as a loss.'",
      "memo": [
        "Notice of meeting: March 20 (Fri) 10:00 · headquarters main auditorium",
        "Agenda Item No. 3: appoint Yoon Sanghyuk inside director -- no 2023 in his career history",
        "One-share group: 3,118 people -- 0.0008% of all shares",
        "Foreign 68% · National Pension 8% · employees 5% -- proxy advisor recommendations decide the vote"
      ],
      "choices": {
        "c23_start_notice": {
          "label": "Start with 2023, missing entirely from his career history"
        },
        "c23_start_count": {
          "label": "Count the big institutional investors first, then move"
        },
        "c23_start_tour": {
          "label": "Visit all 3,118 one by one to collect proxy forms"
        },
        "reframe": {
          "label": "Trace shareholders’ words"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "March 11 · Shareholders’ Meeting D-9",
      "question": "In the vote 9 days from now, the institutions cast the ballots. Where do you start gathering reasons for them to vote no?",
      "lead": "Twelve days after Moon Hajun’s winter internship ended, six identical thick envelopes are stuck in the mailbox on Trigger Lab’s 4th floor."
    },
    "c23_proxy": {
      "title": "Because the Branch Manager Asked",
      "text": "Past 3 p.m., in the banking hall of Yeongdong Branch, forty-one elderly customers sit without queue tickets. When the bank became a financial group in 2008, they took shares instead of their savings and have held them ever since. Na Junhyuk passes around instant coffee and hands out proxy forms (letting someone else vote for you at the meeting) one by one. Seo Jungran, 84, is the first to stamp hers. 'I don’t know what it is, but the branch manager asked.' The next person says the same, and the next. All 41 are filled in 17 minutes. Na Junhyuk fiddles with a vest button and looks around proudly, but Kwon Dohyun, leafing through the stack, stops. 'There isn’t a single ID copy. Turn these in as they are and the head office secretariat will throw out every one.'",
      "memo": [
        "41 Yeongdong elders · 63,000 shares in total",
        "About 20 times the whole one-share group",
        "41 proxy forms -- 0 ID copies",
        "Seo Jungran (84): 'Because the branch manager asked'"
      ],
      "choices": {
        "c23_proxy_fast": {
          "label": "Copy all the IDs on the branch copier today"
        },
        "c23_proxy_visit": {
          "label": "Go back house to house for the ID copies"
        },
        "c23_proxy_explain": {
          "label": "Explain the agenda from scratch; take only informed proxies"
        },
        "reframe": {
          "label": "Trace shareholders’ words"
        },
        "c23_proxy_evidence_turn": {
          "label": "Open the staff proxy tally"
        }
      },
      "place": "KD Bank Gangwon Yeongdong Branch · Banking hall",
      "clock": "March 13 · Shareholders’ Meeting D-7 · 15:20",
      "question": "The 41 proxy forms stamped 'because the branch manager asked' have no ID copies. What do you do?",
      "lead": "The first stop on the road to meet the shareholders is Gangwon’s Yeongdong Branch, 240km from Seoul. On the phone, Na Junhyuk said only, 'I’ve got the elders all seated.'"
    },
    "c23_advisor": {
      "title": "To the Third Decimal Place",
      "text": "Pyo Serin, an analyst at ClearVote, a proxy advisor (a firm that tells big investors how to vote on each item), turns the laptop around. On screen is the group’s 48-page 'Candidate Yoon Sanghyuk’s Innovation Achievements.' 'I don’t take requests to recommend a no vote. I write the recommendations.' Many foreign institutional investors (pension funds, asset managers, and other big pools of money) decide their votes by this recommendation. Another window shows four weeks of brand surveys since Leadline’s Gaeul Rice Cake Shop series ran, and two rating agencies’ announcements of ESG (environmental, social, and governance) downgrades. 'Articles aren’t grounds. A rating drop is. Give me a document showing this drop came from one candidate’s decision.' Kwon Dohyun says, 'You’re precise to two decimal places.' Pyo Serin looks up for the first time. 'To three.'",
      "memo": [
        "ClearVote recommendation deadline: tomorrow 09:00",
        "Group materials, 48 pages -- 2023 mentioned 0 times",
        "Of the 68% foreign shareholders, about 1/3 follow the recommendation",
        "Four weeks after the series: brand surveys down · two agencies downgrade"
      ],
      "choices": {
        "c23_advisor_voices": {
          "label": "Gather one-share shareholders’ statements and bring them tonight"
        },
        "c23_advisor_docs": {
          "label": "Submit the original dissent and Innovation Committee budget"
        },
        "c23_advisor_gap": {
          "label": "Point out only the missing year in the 48 pages; leave fast"
        },
        "reframe": {
          "label": "Trace shareholders’ words"
        },
        "c23_advisor_evidence_turn": {
          "label": "Open the staff proxy tally"
        }
      },
      "place": "ClearVote, Yeouido · Meeting Room",
      "clock": "March 16 · Day Before the Report Deadline",
      "question": "Pyo Serin wants grounds linking the rating drop to the candidate’s decision. What do you hand over by tomorrow morning?",
      "lead": "With the bundles of proxy forms from Yeongdong and Mangwon in your bag, you knock on the door of a small office in a Yeouido back alley."
    },
    "c23_backstage": {
      "title": "A Resignation Letter, Unsigned",
      "text": "Two things lie on the waiting room table. One is the 98-page run sheet for today’s shareholders’ meeting; the other, a one-page A4 draft resignation letter. It is dated last December, and the signature field is blank. Baek Arin’s tablet, always kept charged at 80%, is at 11% today. She opens the run sheet to page 14. 'If opposing remarks run long, the chair limits them to 1 minute per person. I wrote that sentence. I wrote the Innovation Committee ad script too. I believed a good story outlasts the facts.' She pushes the draft resignation toward you. The fold has worn white. 'Three months now and I haven’t handed it in. If I do, my story ends here. If I don’t, at 10 today the sentence I wrote shuts your mouth.'",
      "memo": [
        "Shareholders’ meeting run sheet, 98 pages -- written by Baek Arin",
        "Page 14: 'Opposing remarks limited to 1 minute per person'",
        "Draft resignation: dated last December, unsigned",
        "80 minutes to opening"
      ],
      "choices": {
        "c23_backstage_go": {
          "label": "No time to waver: leave the letter, go to the auditorium"
        },
        "c23_backstage_stay": {
          "label": "Skip the letter; stay and ask her to strike page 14’s line"
        },
        "c23_backstage_script": {
          "label": "Take the original run sheet as proof of the speech limit"
        },
        "reframe": {
          "label": "Trace shareholders’ words"
        },
        "c23_backstage_evidence_turn": {
          "label": "Open the staff proxy tally"
        }
      },
      "place": "KD Financial Group Headquarters, Yeouido · Auditorium Waiting Room",
      "clock": "March 20 · Meeting Day · 08:40",
      "question": "The person who wrote the 1-minute limit holds out an unsigned resignation. 80 minutes before opening, what do you do?",
      "lead": "On the morning of the meeting, you go to hand in your request to speak, and a secretariat staffer shows you to a waiting room behind the auditorium. The one waiting is Baek Arin."
    },
    "c23_final": {
      "title": "1 Minute",
      "text": "When Agenda Item No. 3 comes up, the chair says, 'Remarks will be limited to 1 minute per person.' Applause comes from the front six rows. In the back stand Moon Gaeul, the Yeongdong elders, the night shift, and Moon Hajun. Between them, 11 people sit in the institutional proxy seats. In front of the nameplate of the National Pension Service’s stewardship officer (who votes in the interest of the money’s owners), the ClearVote report lies open. By the votes already in, it is 55% in favor. The National Pension Service’s 8% has not gone either way yet. Just before you speak, Baek Arin passes you a note. The group will accept a governance (who decides, who watches) reform: the 'real-name signature field rule,' putting a real name on every loan signature field. The condition is that you drop your remarks today. In the candidate’s seat, Yoon Sanghyuk closes his tablet cover, and the timer starts counting down from 1:00.",
      "memo": [
        "Speaking time: 1 minute per person",
        "55% in favor by votes already in -- National Pension’s 8% not yet cast",
        "About 600 one-share shareholders inside -- 2,500-plus by proxy and e-vote",
        "This choice leads to the empty signature field on the 33rd floor"
      ],
      "choices": {
        "c23_final_deal": {
          "label": "Drop the remarks for the real-name rule and negotiate"
        },
        "c23_final_block": {
          "label": "Spend the 1 minute urging no votes to block him"
        },
        "c23_final_record": {
          "label": "Instead of votes, get all of the 1 minute on record"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Financial Group Headquarters, Yeouido · Auditorium, Shareholders’ Meeting",
      "clock": "March 20 · Agenda Item No. 3 Up · 11:05",
      "question": "The timer is set to 1 minute, and the group offers the real-name signature field rule in exchange for silence. What do you do?",
      "lead": "Agenda Item No. 3 came up only after 11. Meanwhile, the line in the lobby filed in one by one through the auditorium’s back doors."
    },
    "c23_aftershock": {
      "text": "The chair reads the result. Agenda Item No. 3: 50.6% in favor, passed. Applause from the front six rows; silence in the back. Pyo Serin of ClearVote (a firm that tells big investors how to vote) holds out a phone. 'Last year’s approval rate was 97.1%. It dropped 46.5 points. Our recommendation was against.' The 49.4% against is 22.7% from foreign institutions that followed ClearVote, the National Pension Service’s 8%, and 18.7% from other institutions. The votes of the 3,118 who each bought one share come to 0.0008%. 'Institutions cast the votes. The reasons they gave were the reputational damage and loss of asset value after the Gaeul Rice Cake Shop series, and the footnotes to those reasons are the people who stood in the back.' A message comes from Han Seoyun. 'An all-staff notice is scheduled for Monday at 8. The title is Reorganization, and the first line is Trigger Lab.'",
      "memo": [
        "Agenda Item No. 3: 50.6% in favor -- passed · last year 97.1%",
        "49.4% against: foreign institutions 22.7% · National Pension 8% · other institutions 18.7%",
        "ClearVote recommendation: against -- reputational damage · possible suit by 1,740 victims",
        "6 buses of one-share shareholders · notice scheduled Monday 08:00: 'Reorganization'"
      ],
      "choices": {
        "c23_after_record": {
          "label": "Send 50.6% and today’s remarks to the board in a letter"
        },
        "c23_after_rush": {
          "label": "Go straight up to the 33rd floor to stop Monday’s notice"
        },
        "c23_after_warm": {
          "label": "See the one-share shareholders off until the last bus leaves"
        }
      },
      "place": "KD Financial Group Headquarters, Yeouido · Lobby",
      "clock": "March 20 · Right After the Count · 13:12",
      "question": "It passed with 50.6%, and institutions cast the 49.4% against. With a reorganization notice due Monday morning, how do you close this afternoon?"
    },
    "c23_market": {
      "title": "The Bank Lad’s 42",
      "text": "On the raised wooden platform at the back of Gaeul Rice Cake Shop in Mangwon Market sit twelve grandmothers from the victims’ group. Every time Oh Jinwoo holds out a proxy form, another plate of rice cakes appears. 'Bank lad, have this one too.' Having gotten Na Junhyuk’s text that Yeongdong has 41, Oh Jinwoo swallows his 11th rice cake and declares, 'Mangwon will have 42.' But Moon Gaeul, still in her apron, pushes the form back. 'I’ll cast my own vote. Leaving it to someone else, I tried that once, 3 years ago. With a bank.' The grandmothers’ hands, holding their seals, stop above the forms.",
      "memo": [
        "Mangwon victims’ group: 12 grandmothers · 1 share each",
        "Oh Jinwoo’s goal: 42 forms -- one more than Yeongdong",
        "Moon Gaeul: refuses proxy, wants to attend in person"
      ],
      "choices": {
        "c23_market_choice_2": {
          "label": "Explain to each who can’t come how to fill in a proxy"
        },
        "c23_market_choice_1": {
          "label": "File for Moon Gaeul to speak at the meeting herself"
        },
        "c23_market_choice_3": {
          "label": "42 comes first; take the others’ forms before hers"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market · Back Platform",
      "clock": "March 14 · Shareholders’ Meeting D-6 · 11:00",
      "question": "Moon Gaeul says she will never again leave her vote to someone else. What do you do?"
    },
    "c23_nightshift": {
      "title": "The 80-Share Shift",
      "text": "2:30 a.m., the night shift break room at the FlowOn fulfillment center (a warehouse that stores, packs, and ships orders). Kang Taemin has written numbers in marker on the lids of 80 instant noodle cups. Early this month, the 80 night-shift workers pooled their noodle money and each bought one share. The shareholders’ meeting is Friday at 10 a.m., and the night shift ends at 6. There is also e-voting (voting by phone without attending), offered this year for the first time. The youngest, Yoo Gun, asks, 'Foreman, what percent are our 80 shares?' Kang Taemin taps at the calculator, then turns off the screen. 'Can’t see it. Too many 0s.' The break room bursts into laughter, and the laughter lasts a little long.",
      "memo": [
        "Night shift: 80 people · 1 share each",
        "Shift ends 06:00 → meeting at 10:00",
        "80 shares = 0.00002% of all shares"
      ],
      "choices": {
        "c23_nightshift_choice_3": {
          "label": "Let the night shift rest; pool the votes with Kang Taemin"
        },
        "c23_nightshift_choice_1": {
          "label": "All 80 take the bus together, even without sleep"
        },
        "c23_nightshift_choice_2": {
          "label": "Send just three; the rest vote electronically"
        }
      },
      "place": "FlowOn fulfillment center · Night-shift break room",
      "clock": "March 18 · 02:30",
      "question": "If they go on Friday, the 80 on the night shift get no sleep. How do you use these 80 shares?"
    },
    "c23_lobby": {
      "title": "The 40-Second Line",
      "text": "9:20, the headquarters lobby. The line of one-share shareholders runs past the revolving door out to the sidewalk of Yeouido’s main boulevard. There are two shareholder check-in windows, and each check takes 40 seconds. At this pace, a hundred and twenty people get in before 10. Right beside them, the 'employee shareholder' entrance stands open with no line, and 400 employees of affiliates (other companies in the same group), badges around their necks, have already filled the front six rows of the auditorium. Lee Minseo, handing out queue numbers at the very end of the line, turns around. 'The numbers are up to 640. The Yeongdong elders came on the 5 a.m. bus.'",
      "memo": [
        "2 check-in windows · 40 seconds per person",
        "Able to enter before 10: about 120 · queue number 640",
        "Employee shareholder entrance: 0 waiting, front six rows seated"
      ],
      "choices": {
        "c23_lobby_choice_1": {
          "label": "Seat the elders in lobby chairs and hold their places"
        },
        "c23_lobby_choice_2": {
          "label": "Formally request more windows before the meeting opens"
        },
        "c23_lobby_choice_3": {
          "label": "Have those who got in first fill seats in the back"
        }
      },
      "place": "KD Financial Group Headquarters, Yeouido · Lobby",
      "clock": "March 20 · Meeting Day · 09:20",
      "question": "The employee entrance is empty, and the one-share line reaches the sidewalk. Before the opening, what do you do?"
    },
    "c23_market_reaction": {
      "title": "We’ll Take Care of It",
      "text": "As the rice cake plates on the platform cool, Moon Gaeul speaks. 'Two months before my husband’s company collapsed, I stamped a sheet of paper at a bank window. The clerk said, we’ll take care of everything for you. The title on that paper was Proxy.' With that document, one more lien was put on the factory. The grandmothers fall silent, and Oh Jinwoo sets the rice cake in his hand back on the plate. Moon Gaeul tucks her seal into her apron pocket. 'So this time I’m going, and I’ll say it with my own mouth.'",
      "memo": [
        "A proxy that said 'we’ll take care of it'",
        "This time, in my own words"
      ],
      "choices": {
        "c23_market_reaction_choice_2": {
          "label": "First find the papers on how that proxy was used"
        },
        "c23_market_reaction_choice_3": {
          "label": "Leave that story for today; talk only about votes"
        },
        "c23_market_reaction_choice_1": {
          "label": "Suggest making that proxy story her opening line"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market · Out front",
      "clock": "March 14 · Shareholders’ Meeting D-6 · 13:00",
      "question": "3 years ago, a proxy that promised to 'take care of it' put one more lien on the factory. What do you do with that story?"
    },
    "c23_nightshift_reaction": {
      "title": "An 11-Second Speech",
      "text": "In a corner of the break room, Kang Taemin stands up with a sheet of paper. He wants to practice a shareholder’s remarks. 'I’m Kang Taemin, FlowOn night shift. 3 years ago, when that company went under, I was the one moving boxes before dawn. Why that loan’s signature field was empty, who is going to tell us today?' That’s it. Kwon Dohyun, who has tagged along the whole proxy tour, stops the stopwatch. '11.4 seconds. Very efficient.' Kang Taemin folds the paper. 'Give me 1 minute and that leaves 48 seconds. Those are for Yoo Gun.' The youngest goes bright red, and the 80 applaud by drumming on their noodle cup lids.",
      "memo": [
        "An 11.4-second speech",
        "Who gets the remaining 48 seconds"
      ],
      "choices": {
        "c23_nightshift_reaction_choice_2": {
          "label": "Add dates and loan numbers to the 11 seconds for the record"
        },
        "c23_nightshift_reaction_choice_3": {
          "label": "Take the floor yourself; the shift just claps from the back"
        },
        "c23_nightshift_reaction_choice_1": {
          "label": "Kang Taemin uses 11 seconds; the other 48 go to Yoo Gun"
        }
      },
      "place": "FlowOn fulfillment center · Night-shift break room",
      "clock": "March 18 · 02:50",
      "question": "Kang Taemin’s remarks take 11 seconds, leaving 48. What do you do with the time left?"
    },
    "c23_lobby_reaction": {
      "title": "The Votes He Doesn’t Count",
      "text": "The elevator doors open and Yoon Sanghyuk steps out, in a plain navy suit without a single ornament. Crossing the lobby, he stops in front of you and glances once at the line stretching to the sidewalk. '3,118 shares. I counted the votes you gathered, too. Three days ago.' He tugs once at the end of his sleeve. 'But I don’t count my own votes. Votes are cast by the people who hold big money. Those people don’t decide their votes on stories about a rice cake shop.' Behind him, secretariat staff wheel past boxes of ballots. 'Come in. There’ll be a seat. In the back.'",
      "memo": [
        "3,118 shares, counted three days ago",
        "Those who cast the votes: the holders of big money"
      ],
      "choices": {
        "c23_lobby_reaction_choice_2": {
          "label": "Request vote-count observers for the ballot boxes"
        },
        "c23_lobby_reaction_choice_1": {
          "label": "Ask, in front of the line, who counts the votes"
        },
        "c23_lobby_reaction_choice_3": {
          "label": "Skip the retort; go get one more person inside"
        }
      },
      "place": "KD Financial Group Headquarters, Yeouido · Lobby Elevators",
      "clock": "March 20 · Meeting Day · 09:35",
      "question": "Yoon Sanghyuk says votes are cast by the people who hold big money. What do you answer?"
    },
    "c23_branch_newsroom": {
      "title": "1,996 Readers",
      "text": "As you leave ClearVote, a text comes from Seo Harin. 'We got a letter from group Legal. Can you come to the newsroom?' On the sofa in Leadline’s newsroom in Mangwon-dong, 1,996 proxy forms are piled up still in their mailing envelopes, and on top of them sits the cat 'Jeongjeong,' an honorary press badge around its neck. Whenever someone tries to pull out an envelope, it presses down gently with a front paw. Seo Harin laughs, then holds out a printout. It is an official letter from KD Financial Group’s Legal. One sentence is underlined: 'a news outlet gathering its readers as shareholders to steer votes undermines the fairness of its reporting.' 'It isn’t wrong. We wrote the Gaeul Rice Cake Shop series, it spread and the bank’s rating fell, and readers bought shares. Today we have to decide where to draw the line in between.'",
      "memo": [
        "1,996 proxy forms from Leadline readers",
        "Letter from group Legal: 'undermines the fairness of reporting'",
        "Jeongjeong: won’t budge from the envelope pile",
        "Next article deadline: two days before the meeting"
      ],
      "choices": {
        "c23_branch_newsroom_a": {
          "label": "The newsroom charters buses so readers come themselves"
        },
        "c23_branch_newsroom_b": {
          "label": "Return the proxies; keep reporting and votes apart"
        },
        "c23_branch_newsroom_c": {
          "label": "Ignore the letter and submit the proxies as collected"
        }
      },
      "place": "Leadline Newsroom, Mangwon-dong",
      "clock": "March 16 · Shareholders’ Meeting D-4 · 21:00",
      "question": "The group sent a letter calling it a news outlet mobilizing shareholders. Where do you draw the line between reporting and votes?"
    },
    "c23_branch_newsroom_follow": {
      "title": "17 Red Dots",
      "text": "Sorting the envelope pile, Seo Harin sets one aside. The sender field is empty, and inside, instead of a proxy form, are a note and a screenshot. 'I work at a KD Bank branch. I am an employee shareholder with not one share but 1,200. Every branch circulates a proxy submission status sheet. A red dot goes next to the name of anyone who hasn’t submitted. That is how the employees’ 5% gets gathered as votes in favor.' In the screenshot, the sheet shows employee IDs instead of names, and there are seventeen red dots. Jeongjeong settles on every other envelope but will not climb onto that note. Seo Harin says, 'This is a story. But this person can be found by employee ID.'",
      "memo": [
        "Anonymous tip: employee shareholder holding 1,200 shares",
        "Screenshot of a branch proxy submission status sheet",
        "Non-submitters marked: 17 red dots",
        "Employee IDs visible in the screenshot"
      ],
      "choices": {
        "c23_branch_newsroom_follow_a": {
          "label": "Protect the source first; write after erasing the IDs"
        },
        "c23_branch_newsroom_follow_b": {
          "label": "Alert the FSS to the sheet first; hold the story"
        },
        "c23_branch_newsroom_follow_c": {
          "label": "Run the story with the raw screenshot before the meeting"
        }
      },
      "place": "Leadline Newsroom, Mangwon-dong · Sofa",
      "clock": "March 16 · 23:40",
      "question": "A status sheet with red dots beside employees who didn’t submit proxies has arrived. What do you do with a tip that shows employee IDs?"
    },
    "c23_route_system": {
      "text": "You stop counting votes and ask how shareholders’ words have been kept over the past 10 years. ECHO searches the group’s document system. Ten years of KD Financial Group shareholders’ meeting minutes (the official record of a meeting) open up. 312 agenda items, 0 rejected, an average approval rate of 96.4%. Nowhere in the agenda explanations for 26 inside director (one who helps run the company) candidates does it say how a candidate handled dissent. In 10 years, all remarks by minority shareholders (individuals holding a few shares) added up to 1 hour 52 minutes, and each year the minutes kept them as one line: 'Other opinions were raised.' 'Shareholders’ votes are counted. Shareholders’ words are designed not to be.'",
      "memo": [
        "312 agenda items in 10 years -- 0 rejected",
        "Average approval rate 96.4%",
        "Minority shareholder remarks: 1 hr 52 min → one line in the minutes"
      ],
      "choices": {
        "c23_route_system_send": {
          "label": "Send the 10-year statistics to the advisor and institutions"
        },
        "c23_route_system_drop": {
          "label": "Shelve the statistics; focus on gathering votes"
        },
        "c23_route_system_minutes": {
          "label": "Demand full remarks in this year’s minutes by letter"
        },
        "c23_route_system_evidence_turn": {
          "label": "Open the staff proxy tally"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "March 12 · Shareholders’ Meeting D-8",
      "question": "For 10 years, minority shareholders’ words were left as one line in the minutes. What do you do with these statistics?"
    },
    "c23_final_system_route": {
      "title": "Other Opinions Were Raised",
      "text": "Before dawn on the eve of the meeting, the last pages of ten years of meeting records lie side by side on the test terminal. Every year the last line is the same. 'Other opinions were raised.' Beneath them, ECHO draws one blank line for this year. Tomorrow, hundreds of people will stand in the back of the auditorium. 'Votes are recorded to one decimal place. Words are recorded in four words. Who will write tomorrow’s four words has not been decided.'",
      "memo": [
        "Last line of 10 years of minutes: 'Other opinions were raised'",
        "Minority shareholder remarks in total: 1 hr 52 min",
        "Shareholders’ meeting: tomorrow 10:00, headquarters main auditorium"
      ],
      "choices": {
        "c23_final_system_route_a": {
          "label": "Propose nominations list how candidates handled dissent"
        },
        "c23_final_system_route_b": {
          "label": "Just count votes this year; push the rule to next year"
        },
        "c23_final_system_route_c": {
          "label": "Collect minority remarks into separate public minutes"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Test Terminal",
      "clock": "March 19 · Eve of the Meeting · Before Dawn",
      "question": "This year’s last line in the minutes gets filled in tomorrow. What do you make sure is written there?"
    },
    "c23_evidence_turn": {
      "title": "Who Owns the Red Dots",
      "text": "When you match the clue against file names, a file counting employee shareholders at affiliates (other companies in the same group) opens in the group HR team’s shared folder. 'Shareholders’ Meeting Proxy Submission Status -- Affiliate Employee Shareholders: 11,840.' Those who submitted get a green dot; those who didn’t, a red dot. The notes column has one line. 'Refer to cooperation item, second-half performance review.' This is how the employees’ 5% was tied up as votes in favor. Collecting the proxies was handled by an outside agency, Agenda Partners, and its fee of 1.4 billion won went out under an Innovation Committee budget code. Ban Jaewook closes the notebook he has been writing in. 'They weren’t counting votes. They were counting people. Who didn’t go along.'",
      "memo": [
        "Proxy status sheet for 11,840 employee shareholders",
        "Note: 'Refer to cooperation, second-half review'",
        "Agency fee 1.4 billion won -- Innovation Committee budget code"
      ],
      "choices": {
        "c23_evidence_turn_disclose": {
          "label": "Reveal the sheet at the meeting; claim employee votes void"
        },
        "c23_evidence_turn_hold": {
          "label": "Keep the sheet as a card for after the meeting"
        },
        "c23_evidence_turn_protect": {
          "label": "First contact the red-dot employees to shield them"
        }
      },
      "place": "Trigger Lab Archive B2 · HR Records Room",
      "clock": "March 20 · Meeting Day · 06:00",
      "question": "Employee shareholders’ proxies were collected along with a review cooperation score. How do you use this status sheet?"
    },
    "c23_start_warm": {
      "title": "One Share from the Back Row of the Ceremony",
      "text": "On the day of Moon Hajun’s intern completion ceremony, you stayed with that family in Gangseo Branch’s banking hall until the rice cake box was empty. Twelve days later, an envelope arrives at Moon Gaeul’s rice cake shop. It is the notice of KD Financial Group’s annual shareholders’ meeting (where the shareholders who own the company vote on major matters), thanks to the one share bought that day after Foreman Kim. Agenda Item No. 3: appointment of Yoon Sanghyuk as inside director (one who helps run the company). Foreign investors hold 68% of the shares, the National Pension Service 8%, employees 5%, and the 3,118 who each bought one share hold 0.0008% all together. Do Yoonha shows you a message from Moon Hajun. Beneath a photo of the notice, marked with highlighter, is one line. 'What can I do with the voting rights (a shareholder’s right to vote) of this one share? You said you’d teach me to the end, mentor.'",
      "memo": [
        "Moon Hajun: photo of the notice, highlighted",
        "Agenda Item No. 3: appoint Yoon Sanghyuk inside director",
        "Foreign 68% · National Pension 8% · employees 5% -- one-share group of 3,118 is 0.0008%"
      ],
      "choices": {
        "c23_start_warm_signature": {
          "label": "Work out with Hajun and Moon Gaeul how to use their votes"
        },
        "c23_start_warm_tour": {
          "label": "Visit all 3,118 one by one to collect proxy forms"
        },
        "c23_start_warm_count": {
          "label": "Count the big institutional investors first, then move"
        },
        "c23_start_warm_notice": {
          "label": "Start with 2023, missing entirely from his career history"
        },
        "c23_start_warm_reframe": {
          "label": "Trace shareholders’ words"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "March 11 · Shareholders’ Meeting D-9",
      "question": "Moon Hajun asks what he can do with one share. How do you answer?",
      "lead": "Ever since you stayed in the banking hall until the ceremony rice cake box was empty, Moon Hajun asks you first whenever there is something he doesn’t know."
    },
    "c23_start_record": {
      "title": "A Calendar Faster Than the Objection",
      "text": "The objection bundling Moon Hajun’s intern report with 41 R-17 rejection cases has been given a filing number. The deadline for a response is 60 days. Meanwhile, KD Financial Group issues notice of its annual shareholders’ meeting (where the shareholders who own the company vote on major matters). Agenda Item No. 3: appointment of Yoon Sanghyuk as inside director (one who helps run the company). The first line of the reasons for his nomination credits him with bringing in NOAH, the AI review engine (a program that judges loan applications automatically), and making loan decisions consistent. The engine that automatically rejected To-the-End Precision has become one man’s career. ECHO adds, 'The answer to the objection comes in 60 days. The voting rights (a shareholder’s right to vote) of the 3,118 who each bought one share get used in 9 days. Their share is 0.0008%; foreign investors hold 68%, the National Pension Service 8%, employees 5%.'",
      "memo": [
        "R-17 objection -- 41 rejection cases · 60-day deadline",
        "First line of the nomination reasons: bringing in NOAH",
        "Foreign 68% · National Pension 8% · employees 5% · 9 days to the meeting"
      ],
      "choices": {
        "c23_start_record_count": {
          "label": "Count the big institutional investors first, then move"
        },
        "c23_start_record_signature": {
          "label": "Send a formal inquiry about the NOAH line in the nomination"
        },
        "c23_start_record_notice": {
          "label": "Start with 2023, missing entirely from his career history"
        },
        "c23_start_record_tour": {
          "label": "Visit all 3,118 one by one to collect proxy forms"
        },
        "c23_start_record_reframe": {
          "label": "Trace shareholders’ words"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "March 11 · Shareholders’ Meeting D-9",
      "question": "The engine that rejected To-the-End Precision became the candidate’s reason for nomination. What do you do with that sentence?",
      "lead": "Twelve days after you put the R-17 objection receipt in a drawer, a thick envelope lands on top of that drawer."
    },
    "c23_start_rush": {
      "title": "Two Weeks Without a Single Call",
      "text": "Before the ceremony applause had even ended, you started with Foreman Kim’s one share and went straight into preparing for the March vote. What you have gathered in nearly two weeks is a single sheet: KD Financial Group’s shareholder breakdown. Today the notice of the annual shareholders’ meeting (where the shareholders who own the company vote on major matters) is posted. Agenda Item No. 3: appointment of Yoon Sanghyuk as inside director (one who helps run the company). Kwon Dohyun draws a vertical line beside the breakdown. 'Foreign investors 68%, the National Pension Service 8%, employees 5%, and the 3,118 who each bought one share. Their voting rights (a shareholder’s right to vote), all gathered together, round to 0.' He stops his pen. 'But running ahead, you haven’t made a single call to those 3,118 yet, have you?'",
      "memo": [
        "Shareholder breakdown: foreign 68% · National Pension 8% · employees 5%",
        "One-share group of 3,118 -- 0 contacted",
        "9 days to the meeting"
      ],
      "choices": {
        "c23_start_rush_notice": {
          "label": "Start with 2023, missing entirely from his career history"
        },
        "c23_start_rush_tour": {
          "label": "Visit all 3,118 one by one to collect proxy forms"
        },
        "c23_start_rush_count": {
          "label": "Count the big institutional investors first, then move"
        },
        "c23_start_rush_signature": {
          "label": "Make the overdue calls to the 3,118, one by one"
        },
        "c23_start_rush_reframe": {
          "label": "Trace shareholders’ words"
        }
      },
      "place": "Trigger Lab, 4th-floor analyst room",
      "clock": "March 11 · Shareholders’ Meeting D-9",
      "question": "In the two weeks you ran ahead, you didn’t call the 3,118 once. What do you make up for first?",
      "lead": "The shareholder breakdown you gathered nonstop for nearly two weeks lies open on the desk. The phone is quiet."
    }
  },
  "echoReplies": {
    "c23_start_tour": "When you go, the 9 days pass on the road. In return, some of the 3,118 hear for the first time what that one share is.",
    "c23_start_notice": "Pressed, the missing year becomes a formal question. The secretariat’s reply is three words: 'Disclosure not required.'",
    "c23_start_count": "The count is fast and exact. Within it, the 3,118 move out of the votes and into the reason field.",
    "c23_proxy_visit": "Going round forty-one homes takes two days. Every house serves instant coffee, and Grandma Seo Jungran wraps up dried persimmons along with her ID copy.",
    "c23_proxy_explain": "After the explanation, nine of them take back their proxy forms. One even decides to vote in favor after learning who Yoon Sanghyuk is.",
    "c23_proxy_fast": "All 41 are filled in an hour. Also left on record: customers’ IDs went through the branch copier and into the group’s bag.",
    "c23_advisor_voices": "174 statements come in overnight. Pyo Serin puts only the 38 with dates and documents in the footnotes and writes 'Against' in the conclusion field. The reasons run two lines. 'Appointing the candidate raises reputational risk to shareholder assets. The possible lawsuit by 1,740 victims is a debt not yet on the books.'",
    "c23_advisor_docs": "Documents are strong. Pyo Serin writes 'Against' in the conclusion field and ties the reasons to the originals. 'The rating drop stems from the candidate’s decision to discard the dissent.' Han Seoyun’s signature in the return field goes into the appendix too.",
    "c23_advisor_gap": "One missing year isn’t grounds. Pyo Serin writes 'Against' on the rating drop alone, and beside the candidate’s 2023 adds one line: 'Further verification needed.'",
    "c23_backstage_stay": "Baek Arin looks at the run sheet for a long time. She doesn’t tear out page 14; she draws a line through it with a ballpoint. Whether the chair will skip that line, no one knows.",
    "c23_backstage_script": "The original becomes evidence. So does the name in the author field. Baek Arin hands it over knowing that.",
    "c23_backstage_go": "As the door closes, Baek Arin folds the draft resignation again. The fold, three months creased, wears a little thinner.",
    "c23_final_block": "1 minute is short. The back rows applaud, and the chair counts even the applause toward the speaking time. In the institutional proxy seats, the National Pension Service officer doesn’t applaud but takes notes.",
    "c23_final_deal": "When you negotiate, the reform plan goes on the next board agenda. The 600 in the back and the 11 in the institutional proxy seats watch you turn away from the microphone.",
    "c23_final_record": "The record remains. The votes flow on as they were, and the one remark that might have changed today goes into next year’s minutes file.",
    "c23_after_warm": "Hands wave from every window of the six buses. Meanwhile, Monday’s notice waits for its scheduled time.",
    "c23_after_record": "The letter is attached as an annex to the board’s agenda papers. Now there is no director who doesn’t know about 50.6%.",
    "c23_after_rush": "At the elevators on the 33rd floor, a security guard checks the list. There is already a red dot beside your name.",
    "c23_market_choice_1": "On the speaker request form, Moon Gaeul’s name goes above yours. As a vote, it is one share; as a reason, it is one statement with dates and documents. For the first time, Moon Gaeul says 'Thank you.'",
    "c23_market_choice_2": "Explained again, three grandmothers decide to go in person instead of signing proxies. Oh Jinwoo’s 42 becomes 39.",
    "c23_market_choice_3": "The 42 are filled. Moon Gaeul’s one vote isn’t in that bundle, and the grandmothers don’t look her way as they stamp.",
    "c23_nightshift_choice_1": "With all 80 going, one section of the back row fills with high-visibility vests. On the Friday night shift, two doze off and get woken by the foreman.",
    "c23_nightshift_choice_2": "With only three going, the 80 get their sleep. Votes cast by phone are invisible to everyone in the auditorium.",
    "c23_nightshift_choice_3": "Kang Taemin tucks the 80 proxy forms into his vest pocket. The youngest, Yoo Gun, heads home looking a little let down.",
    "c23_lobby_choice_1": "Seated, Grandma Seo Jungran rests her cane across her knees. The line is as slow as ever.",
    "c23_lobby_choice_2": "The request goes into the procedural record. The secretariat increases the windows to six, and the opening is delayed 40 minutes.",
    "c23_lobby_choice_3": "Those inside save seats in the back rows with their bags. The elders who took the dawn bus are still outside the revolving door.",
    "c23_market_reaction_choice_1": "As the opening line, the story reaches the whole auditorium. Practicing, Moon Gaeul chokes up twice.",
    "c23_market_reaction_choice_2": "Digging up the papers turns up the name of the clerk who pushed the collateral. That person is now deputy branch manager at Gangseo Branch.",
    "c23_market_reaction_choice_3": "The story stays on the platform. Moon Gaeul nods and chews her rice cake once more.",
    "c23_nightshift_reaction_choice_1": "Yoo Gun stays up two nights writing a 48-second script. The first line is 'I’m the youngest here.'",
    "c23_nightshift_reaction_choice_2": "With dates and numbers added, the speech grows to 19 seconds. Kang Taemin grumbles, 'It got long,' and memorizes it.",
    "c23_nightshift_reaction_choice_3": "Kang Taemin says 'Sure' and pockets the paper. On Friday, too, that paper never leaves his pocket.",
    "c23_lobby_reaction_choice_1": "At the question, the people in line look up. Yoon Sanghyuk smiles and, instead of answering, gestures toward the elevators.",
    "c23_lobby_reaction_choice_2": "The request for observers is accepted. Lee Minseo and Kwon Dohyun sit on folding chairs beside the counting table.",
    "c23_lobby_reaction_choice_3": "As you turn away, Yoon Sanghyuk turns too. Meanwhile, four more grandmothers come in through the revolving door.",
    "c23_branch_newsroom_a": "When the buses pull up, so does the phrase 'press mobilization.' At Seo Harin’s outlet, the reporters split the bus fare.",
    "c23_branch_newsroom_b": "How many of the 1,996 returned will come back, no one knows. But the letter loses its grounds.",
    "c23_branch_newsroom_c": "The votes go in intact. The next day, the group’s press release carries the phrase 'shareholder mobilization by a certain outlet.'",
    "c23_branch_newsroom_follow_a": "Erasing the IDs takes a day. The story runs the night before the meeting, and the source is safe.",
    "c23_branch_newsroom_follow_b": "The FSS gives a filing number. The meeting opens before anything comes of that number.",
    "c23_branch_newsroom_follow_c": "The story spreads fast. HR matches the employee IDs faster.",
    "c23_route_system_send": "The statistics become an appendix to Pyo Serin’s report. One in three institutions reads as far as the appendix.",
    "c23_route_system_minutes": "Once the letter is received, the secretariat sets out one more recorder. The speaking time stays the same.",
    "c23_route_system_drop": "A few more votes come in. The words kept as one line for 10 years get ready to be kept as one line again this year.",
    "c23_final_system_route_a": "With the rule in place, candidates from next year on must list how they handled dissent against themselves. This year’s candidate falls outside the rule.",
    "c23_final_system_route_b": "The votes are counted and the rule waits a year. For that year, the signature field stays just as it is.",
    "c23_final_system_route_c": "The one-share shareholders write down the public minutes themselves. They aren’t the official record, but anyone can read them.",
    "c23_evidence_turn_disclose": "When you reveal it, the front six rows stir. The owners of the red dots see their own employee IDs right there.",
    "c23_evidence_turn_protect": "Of the employees you contact, three don’t pick up. The one who does says, 'I didn’t know my dot was red.'",
    "c23_evidence_turn_hold": "The card stays in hand. Which of the green-dot employees submitted because they wanted to, you never learn.",
    "c23_proxy_evidence_turn": "Open the status sheet, and the notes column tells you whether the group was counting votes or people.",
    "c23_advisor_evidence_turn": "Open the status sheet, and the notes column tells you whether the group was counting votes or people.",
    "c23_backstage_evidence_turn": "Open the status sheet, and the notes column tells you whether the group was counting votes or people.",
    "c23_route_system_evidence_turn": "Open the status sheet, and the notes column tells you whether the group was counting votes or people.",
    "case23_memory_system": "Leafing through, you find your hand cut down to one line in the achievement materials. ECHO says there are more words cut down to one line and opens 10 years of minutes.",
    "case23_memory_evidence": "Hold the list up to the status sheet, and there are dots beside the names. Two kinds, green and red, and the notes column mentions performance reviews.",
    "c23_start_warm_tour": "When you go, the 9 days pass on the road. In return, some of the 3,118 hear for the first time what that one share is.",
    "c23_start_warm_notice": "Pressed, the missing year becomes a formal question. The secretariat’s reply is three words: 'Disclosure not required.'",
    "c23_start_warm_count": "The count is fast and exact. Within it, the 3,118 move out of the votes and into the reason field.",
    "c23_start_warm_signature": "Working it out takes one dinner. Moon Hajun draws a 'One-Share User Manual' in his sketchbook, and Moon Gaeul tapes it to the rice cake shop wall.",
    "c23_start_record_tour": "When you go, the 9 days pass on the road. In return, some of the 3,118 hear for the first time what that one share is.",
    "c23_start_record_notice": "Pressed, the missing year becomes a formal question. The secretariat’s reply is three words: 'Disclosure not required.'",
    "c23_start_record_count": "The count is fast and exact. Within it, the 3,118 move out of the votes and into the reason field.",
    "c23_start_record_signature": "The inquiry is received. The response deadline is set for the day after the meeting.",
    "c23_start_rush_tour": "When you go, the 9 days pass on the road. In return, some of the 3,118 hear for the first time what that one share is.",
    "c23_start_rush_notice": "Pressed, the missing year becomes a formal question. The secretariat’s reply is three words: 'Disclosure not required.'",
    "c23_start_rush_count": "The count is fast and exact. Within it, the 3,118 move out of the votes and into the reason field.",
    "c23_start_rush_signature": "The first to pick up is Moon Gaeul. 'So it’s been two weeks.' Two weeks’ worth of apology goes into that one line."
  },
  "choiceVoiceLines": {
    "c23_start_tour": "Saying you have to see the face of anyone who entrusts you with a vote, you visit the 3,118 one by one to collect proxy forms.",
    "c23_start_notice": "Saying you need to know who the candidate is before counting votes, you start with 2023, missing entirely from his career history.",
    "c23_start_count": "Saying one share at a time won’t get there in 9 days, you count the institutional investors holding big blocks first, then move.",
    "c23_proxy_visit": "Saying you can’t collect people’s IDs in bulk at the branch, you go back house to house for the copies.",
    "c23_proxy_explain": "Saying you can’t take a stamp given without knowing what it’s for, you explain the agenda from the beginning and take proxies only from those who understand.",
    "c23_proxy_fast": "Before all 41 are voided, you take the ID copies in bulk on the branch copier today.",
    "c23_advisor_voices": "Saying the people behind the numbers are grounds too, you gather one-share shareholders’ statements and bring them in tonight.",
    "c23_advisor_docs": "Saying originals work on someone who checks to the third decimal place, you submit the original dissent and the Innovation Committee budget documents as grounds.",
    "c23_advisor_gap": "Saying the deadline is 9 tomorrow morning, you point out only the missing year in the group’s 48 pages and leave quickly.",
    "c23_backstage_stay": "Saying only the one who wrote that sentence can delete it, you stay instead of taking the resignation and ask her to strike that sentence on page 14.",
    "c23_backstage_script": "So you can show the 1 minute was set in advance, you take the original run sheet and keep it as grounds against the speaking limit.",
    "c23_backstage_go": "Saying with only 80 minutes to opening there’s no time to waver, you leave the resignation and go to the auditorium first.",
    "c23_final_block": "Saying you can’t accept a condition to drop your remarks, you spend the 1 minute urging no votes to block the appointment.",
    "c23_final_deal": "Saying a lasting system outweighs 1 minute of words, you drop your remarks and negotiate on the condition of the real-name signature field rule.",
    "c23_final_record": "Saying you can’t overturn 55% in favor but can leave words behind, you have every word of the 1-minute remarks recorded instead of chasing votes.",
    "c23_after_warm": "Unable to just send off the people who came on the dawn bus, you see the one-share shareholders off until the last bus leaves.",
    "c23_after_record": "So the 46.5 points don’t get buried under applause, you put 50.6% and today’s remarks in a shareholder letter and send it to the board.",
    "c23_after_rush": "Hearing that the first line is Trigger Lab, you go straight up to the 33rd floor to stop Monday’s notice.",
    "c23_market_choice_1": "Because she is someone who got burned leaving it to others, you file a request for Moon Gaeul to speak at the meeting herself.",
    "c23_market_choice_2": "Saying that even entrusting a vote should be done knowingly, you explain again, one by one, how to fill in a proxy form to the grandmothers who can’t come.",
    "c23_market_choice_3": "Saying filling 42, one more than Yeongdong, comes first, you take the other grandmothers’ forms first.",
    "c23_nightshift_choice_1": "Saying votes bought with noodle money should be cast by their own hands, all 80 take the bus together, even without sleep.",
    "c23_nightshift_choice_2": "Saying a vote cast by this year’s first e-voting is still a vote, you send just three representatives and the rest vote electronically.",
    "c23_nightshift_choice_3": "Saying ten in the morning is too much after a shift ending at six, you let the night shift rest and pool their votes with Kang Taemin.",
    "c23_lobby_choice_1": "Saying these are people who came on the 5 a.m. bus, you seat the elders in line in lobby chairs first and hold their places.",
    "c23_lobby_choice_2": "Saying a meeting with only a hundred and twenty inside is no meeting, you formally request that it not open until more check-in windows are added.",
    "c23_lobby_choice_3": "Saying there are only 40 minutes until 10, you have those who got in first fill the back-row seats.",
    "c23_market_reaction_choice_1": "Saying no words will reach the auditorium better than these, you suggest making that proxy story the opening line of her remarks.",
    "c23_market_reaction_choice_2": "So she can see how a paper that promised to take care of things became collateral, you first find the papers showing how that proxy was used.",
    "c23_market_reaction_choice_3": "So the grandmothers who stopped stamping don’t waver further, you leave that story for today and talk only about votes.",
    "c23_nightshift_reaction_choice_1": "Saying the more you touch it the less it’s his, you use Kang Taemin’s 11 seconds as they are and give the remaining 48 to the youngest, Yoo Gun.",
    "c23_nightshift_reaction_choice_2": "So it gets on the record without being flattened into one line, you polish the 11-second speech with dates and loan numbers.",
    "c23_nightshift_reaction_choice_3": "Saying the 1 minute has to be used without mistakes, you take the remarks yourself and ask the night shift just to clap from the back.",
    "c23_lobby_reaction_choice_1": "Saying those who have waited since dawn should hear the answer too, you ask, in front of the people in line, who it is that counts the votes.",
    "c23_lobby_reaction_choice_2": "Saying there must be eyes on the hands that count, you request vote-count observers for the ballot boxes.",
    "c23_lobby_reaction_choice_3": "Saying this isn’t a place to win with words, you skip the retort and go get one more person inside.",
    "c23_branch_newsroom_a": "Saying votes aren’t gathered but cast by their owners, you have the newsroom charter buses so readers come to the meeting themselves.",
    "c23_branch_newsroom_b": "Saying the story wavers if its writers also hold the votes, you return the proxies to the readers and keep reporting and votes apart.",
    "c23_branch_newsroom_c": "Saying these are envelopes 1,996 people sent in trust, you ignore the letter and submit the proxies as collected.",
    "c23_branch_newsroom_follow_a": "Because one employee ID is enough to find this person, you protect the source first and write the story after erasing the IDs.",
    "c23_branch_newsroom_follow_b": "Saying the red dots should be stopped by regulators before a story, you alert the Financial Supervisory Service to the sheet first and hold the story.",
    "c23_branch_newsroom_follow_c": "Saying it will be too late after the vote, you run the story with the screenshot as is before the meeting.",
    "c23_route_system_send": "Saying these are numbers the deciders should see, you send the 10-year statistics to the proxy advisor and the institutions.",
    "c23_route_system_minutes": "So it doesn’t become another 'Other opinions were raised' line, you send a shareholder letter demanding the full remarks be kept in this year’s minutes.",
    "c23_route_system_drop": "Saying the few days left are more urgent than the past 10 years, you shelve the statistics and focus on gathering votes.",
    "c23_final_system_route_a": "So it stays on paper from the next candidate on, you propose a rule requiring nominations to list how the candidate handled dissent.",
    "c23_final_system_route_b": "Saying tomorrow’s vote alone is a lot, you just count votes this year and push the rule to next year’s meeting.",
    "c23_final_system_route_c": "Saying you will write down with your own hands the words that would be cut to four, you collect minority shareholders’ remarks into separate public minutes.",
    "c23_evidence_turn_disclose": "Saying votes collected with reviews on the line aren’t votes, you reveal the status sheet at the meeting and claim the employee votes are void.",
    "c23_evidence_turn_protect": "So the red dots don’t carry into second-half reviews as penalties, you contact those employees first.",
    "c23_evidence_turn_hold": "Saying it would be buried in the voting uproar if it came out now, you keep the status sheet as a card for after the meeting.",
    "c23_proxy_evidence_turn": "Holding the clue against each row of the proxy submission status sheet, you look at how the employee shareholders’ votes were collected.",
    "c23_advisor_evidence_turn": "Holding the clue against each row of the proxy submission status sheet, you look at how the employee shareholders’ votes were collected.",
    "c23_backstage_evidence_turn": "Holding the clue against each row of the proxy submission status sheet, you look at how the employee shareholders’ votes were collected.",
    "c23_route_system_evidence_turn": "Holding the clue against each row of the proxy submission status sheet, you look at how the employee shareholders’ votes were collected.",
    "c23_start_warm_tour": "Saying you have to see the face of anyone who entrusts you with a vote, you visit the 3,118 one by one to collect proxy forms.",
    "c23_start_warm_notice": "Saying you need to know who the candidate is before counting votes, you start with 2023, missing entirely from his career history.",
    "c23_start_warm_count": "Saying one share at a time won’t get there in 9 days, you count the institutional investors holding big blocks first, then move.",
    "c23_start_warm_signature": "To keep your promise to teach him to the end, you work out with Moon Hajun and Moon Gaeul how to use their votes together.",
    "c23_start_record_tour": "Saying you have to see the face of anyone who entrusts you with a vote, you visit the 3,118 one by one to collect proxy forms.",
    "c23_start_record_notice": "Saying you need to know who the candidate is before counting votes, you start with 2023, missing entirely from his career history.",
    "c23_start_record_count": "Saying one share at a time won’t get there in 9 days, you count the institutional investors holding big blocks first, then move.",
    "c23_start_record_signature": "Saying 41 rejections can’t be written up as an achievement, you send a formal inquiry about the NOAH sentence in the nomination reasons.",
    "c23_start_rush_tour": "Saying you have to see the face of anyone who entrusts you with a vote, you visit the 3,118 one by one to collect proxy forms.",
    "c23_start_rush_notice": "Saying you need to know who the candidate is before counting votes, you start with 2023, missing entirely from his career history.",
    "c23_start_rush_count": "Saying one share at a time won’t get there in 9 days, you count the institutional investors holding big blocks first, then move.",
    "c23_start_rush_signature": "Saying you counted them without ever asking, you make the overdue calls to the 3,118, one by one."
  },
  "pack": {
    "clue": {
      "title": "The Red-Dot List",
      "text": "The proxies of 11,840 employee shareholders were collected with the note 'refer to review cooperation.' The agency’s 1.4 billion won fee went out under an Innovation Committee budget code."
    },
    "outcomes": {
      "c23_after_warm": {
        "tag": "Saw Them Off",
        "title": "Hands waved from every window of the last bus",
        "text": "Passed with 50.6%. You stood outside the lobby until the last bus to Yeongdong left. Grandma Seo Jungran asked you to ask her again next year."
      },
      "c23_after_record": {
        "tag": "Left on Record",
        "title": "50.6% became an annex to the board papers",
        "text": "Today’s remarks and the approval rate went to the board as a shareholder letter. The number that fell from 97% to 50.6% is now on the official record."
      },
      "c23_after_rush": {
        "tag": "Went Up First",
        "title": "You took the 33rd-floor elevator before the buses left",
        "text": "Leaving the rice cake boxes and the line of buses behind, you went up to stop Monday’s notice. On the 33rd-floor list, there was already a red dot beside your name."
      }
    },
    "continuityChallenges": {
      "c22_after_warm": {
        "title": "Go With the People Who Stayed to the End",
        "text": "Since you stayed until the ceremony rice cake box was empty, Moon Hajun asks you first. Trust rides on the card that stands beside the people holding one share."
      },
      "c22_after_record": {
        "title": "Reread NOAH as a Candidate’s Career",
        "text": "The engine that rejected To-the-End Precision became Yoon Sanghyuk’s reason for nomination. Whose achievement that is, you question by reframing the table."
      },
      "c22_after_rush": {
        "title": "Make Up for Two Weeks Without a Call",
        "text": "The two weeks you ran ahead left the 3,118 nothing. The standing to ask for their words comes back with the card that restores fairness."
      }
    }
  }
};
