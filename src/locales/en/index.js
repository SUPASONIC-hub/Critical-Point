/**
 * English (en): the language's dictionary, the chunk an `?lang=en` page
 * takes before its first paint (src/locale.js; 영어판 1단계, 2026-10-26).
 *
 * `copy` is laid over the Korean tables of the same names, in place
 * (src/locales/overlay.js): the season's copy between cases for 프롤로그
 * 01-05 and 사건 01-10, the play guide, the resource and thinking labels, and
 * the case list. The scenes are in `nodes/<caseId>.js`. A draft,
 * machine-translated with the glossary (앱출시-G) and not yet edited by a
 * person; `npm run check:locale -- --lang=en` counts what is still Korean.
 *
 * `speakers` are the names the page prints for a scene's speaker (G-2, with
 * the owner's G-9 choice 1: common spellings). The scene keeps the Korean
 * name, which is the key of its portrait, its profile and the run log.
 *
 * `preview` is the copy of the preview's own screens (F-3, F-4). The language
 * choice shows `previewNote` under its buttons (LanguagePicker.jsx); the rest
 * waits for the screens that will use it. The end of the preview (F-3, the
 * owner's F-8 choice 1) is the panel after 사건 10: `nextCaseSignals.case10`
 * below says the English stops there and the story goes on in Korean.
 */
import screens from "./screens/index.js";

export const speakers = {
  "한서윤": "Han Seoyun",
  "반재욱": "Ban Jaewook",
  "도윤하": "Do Yoonha",
  "오진우": "Oh Jinwoo",
  "에코": "ECHO",
  "노아": "NOAH",
  "윤상혁": "Yoon Sanghyuk",
  "임경수": "Lim Kyungsoo",
  "백아린": "Baek Arin",
  "이민서": "Lee Minseo",
  "오상철": "Oh Sangchul",
  "권태호": "Kwon Taeho",
  "권승우": "Kwon Seungwoo",
  "배성준": "Bae Sungjun",
  "정해린": "Jung Haerin",
  "강태민": "Kang Taemin",
  "문성호": "Moon Sungho",
  "문가을": "Moon Gaeul",
  "진세라": "Jin Sera",
  "배승호": "Bae Seungho",
  "신영란": "Shin Youngran",
  "남지형": "Nam Jihyung",
  "변유진": "Byun Yujin",
  "나준혁": "Na Junhyuk",
  "권도현": "Kwon Dohyun",
};

export const preview = {
  chooseLanguage: "Choose your language",
  languageButtons: ["한국어", "English (preview)"],
  languageSetting: "Language",
  previewNote: "English is a preview: the prologue and Cases 01–10 are available.",
  reportTranslation: "Report a translation issue in this scene",
  reportTranslationNote: "Tell us what reads wrong. The scene ID is sent with it.",
  rankingLanguage: "Language: KO / EN",
  endTitle: "END OF THE ENGLISH PREVIEW",
  endText:
    "You’ve reached the end of Case 10 — the end of the English preview for now. Cases 11–49 and the finale are being translated. Your progress is saved on this device, and you’ll continue from Case 11 when they arrive.",
  endButtons: { korean: "Continue in Korean", wait: "Wait for English", feedback: "Tell us what you thought" },
  continueCard: "Case 11 — coming in English soon",
};

export const copy = {
  screens,
  "caseCopy": {
    "chapterRules": {
      "prologue01": {
        "label": "Speed and Names",
        "rule": "An error you find becomes a record only when it is written down with who found it. Without a name, it is just a rumor.",
        "authority": "Propose which document the error goes into, and under whose name"
      },
      "prologue02": {
        "label": "Numbers and Signatures",
        "rule": "0.4 percentage points is not a question of math. It is a question of who drew that line.",
        "authority": "Propose the form of the dissent and who signs it"
      },
      "prologue03": {
        "label": "Returned and Protected",
        "rule": "The quietest door is the one closed with a promise to protect you. The person closing it once stood outside it too.",
        "authority": "Propose how to request a review and how to keep a copy"
      },
      "prologue04": {
        "label": "Scripts and Names",
        "rule": "What is sold in easy words is billed in hard ones. The person at the counter pays the difference first.",
        "authority": "Propose who sees the sales review results, and in what order"
      },
      "prologue05": {
        "label": "Blanks and Boxes",
        "rule": "The document that moves a person never names the person who moved them. From then on, the blank is the hero of this story.",
        "authority": "Propose which records to take and how to introduce yourself on day one"
      },
      "case01": {
        "label": "Cash and People",
        "rule": "Decide whose tomorrow comes first, not how fast you survive.",
        "authority": "Propose the payment order and the disclosure standard"
      },
      "case02": {
        "label": "Evidence and Protection",
        "rule": "Preserve the record and protect the witness’s right to speak.",
        "authority": "Adjust access rights and the testimony process"
      },
      "case03": {
        "label": "Speed and Long-Term Cost",
        "rule": "The fastest answer is not the cheapest failure.",
        "authority": "Redesign the criteria for judging the rival bids"
      },
      "case04": {
        "label": "Exceptions and Accountability",
        "rule": "Every exception made for results needs a name and an end date.",
        "authority": "Propose the terms for approving exceptions and the scope of oversight"
      },
      "case05": {
        "label": "Rules and Recovery",
        "rule": "Check that the rule that stops a repeat does not deepen the harm on the ground.",
        "authority": "Adjust the order of shutdown, recovery and blame"
      },
      "case06": {
        "label": "Colleagues and Records",
        "rule": "Check whether you can hold the person at the next desk to the same standard.",
        "authority": "Propose how far internal HR records are disclosed"
      },
      "case07": {
        "label": "Favors and Prices",
        "rule": "Every favor comes with a price paid by someone other than the person who receives it.",
        "authority": "Propose whose name goes into the document"
      },
      "case08": {
        "label": "Trails and Revenge",
        "rule": "Anger speeds up the hunt, but the evidence has to outlast the anger.",
        "authority": "Propose where to use the trace sheet"
      },
      "case09": {
        "label": "Rescue and Punishment",
        "rule": "The math that saves a company and the math that punishes people must sit on one table, or neither can be explained.",
        "authority": "Propose the order of the rescue plan and the criminal complaint"
      },
      "case10": {
        "label": "Goodwill and Endurance",
        "rule": "What survives on one person’s persistence ends when that person does.",
        "authority": "Propose how much of the list becomes policy, and who owns it"
      }
    },
    "nextCaseSignals": {
      "prologue01": {
        "eyebrow": "Next case unlocked",
        "title": "Prologue 02 - 2023-0412",
        "button": "Start Prologue 02",
        "premise": "Six months after your training ends, a 31-billion-won (about US$22 million) review lands on your desk. The loan number is 2023-0412. The borrower is FlowOn, the logistics platform everyone loves.",
        "hook": "As a trainee, you found a blank line worth 40 million won. This time the number that doesn’t fit is 0.4 percentage points, and the team that drew that line is the one you sit in.",
        "movement": "Trainee desk, 6th floor, KD Bank head office > Corporate Finance Strategy Team review room, same floor > FlowOn headquarters and logistics sites",
        "reason": "To count, on site, how that company’s numbers were made before the 31 billion won goes out",
        "interlude": {
          "label": "Interlude · The Bus Home",
          "title": "Your Mentor Got Off First",
          "text": "Oh Jinwoo gets off two stops early and raises a hand once at the window. Only after the bus pulls away do you realize he hasn’t talked about himself all day. Except about his father. At home you open your bag and find a copy of the summary sheet, folded in half. You don’t remember putting it there."
        }
      },
      "prologue02": {
        "eyebrow": "Next case unlocked",
        "title": "Prologue 03 - Returned",
        "button": "Start Prologue 03",
        "premise": "Your dissent is attached to the Credit Committee agenda. 28 minutes before the meeting opens, it is returned before it even reaches the room.",
        "hook": "The person who returns it is Manager Han Seoyun. She doesn’t get angry and doesn’t apologize. In the hallway, she tells you about a written opinion she wrote 12 years ago.",
        "movement": "Review room, 6th floor > Credit Committee room, 8th floor, head office > Hallway > Document scanning room, B1",
        "reason": "To see in that room whether a dissent signed by one person becomes an agenda item or an attachment",
        "interlude": {
          "label": "Interlude · Right After Filing",
          "title": "10:12, a Filing Number Appears",
          "text": "You press submit and the filing chime sounds once. It is quieter than you expected, so you check again. The filing number is there. In the hallway it is still bright outside, and you eat lunch for the first time that day. On the TV in the soup restaurant, FlowOn’s founder is giving an interview."
        }
      },
      "prologue03": {
        "eyebrow": "Next case unlocked",
        "title": "Prologue 04 - Window 4",
        "button": "Start Prologue 04",
        "premise": "The 31 billion won goes out, and two hours after approval the loan becomes a product at the counter. Your new job is a chore called 'post-sale suitability review.'",
        "hook": "At Window 4, Gangseo Branch, sits Do Yoonha, a teller in his 3rd year. He sells with a smile and doesn’t know what he is selling. And the people he sells to are people whose names he knows.",
        "movement": "Head office review room > KD Bank Gangseo Branch lobby > Branch meeting room, 2nd floor > Mangwon Market",
        "reason": "To see with your own eyes whose accounts the loan you couldn’t stop flows into at the counter",
        "interlude": {
          "label": "Interlude · The Scanning Room at Night",
          "title": "Lim Kyungsoo Adds One More Strip of Seal Tape",
          "text": "He puts two layers of seal tape on the box and signs across them. 'This way, if anyone opens it, it shows.' When you ask why he checks such things, he takes off his glasses and wipes them slowly. 'I’m not trying to check anything. I’m leaving it so it shows.' On the way out, you notice the inside pocket of his cardigan bulging by the thickness of one sheet."
        }
      },
      "prologue04": {
        "eyebrow": "Next case unlocked",
        "title": "Prologue 05 - The Basement",
        "button": "Start Prologue 05",
        "premise": "Two months later the transfer order comes. HR Order No. 2023-1187. The reason field and the proposer field are both blank.",
        "hook": "You are going to the 4th floor of the old data center in Hapjeong-dong, the room everyone calls the basement. The first one to speak to you there is not a person.",
        "movement": "Gangseo Branch > HR interview room, 7th floor, head office > Team office, 6th floor > Trigger Lab, Hapjeong-dong, 4th floor and B2",
        "reason": "To follow one transfer order with a blank reason field all the way to where it moves a person",
        "interlude": {
          "label": "Interlude · After the Shutters Close",
          "title": "Do Yoonha Gets Two Coffees",
          "text": "She hands you one, trying not to look at the sales board. 'They say I’m No. 1 this month.' She is smiling, but her voice catches first. 'So why do I feel like this?' You look for something to say and end up just drinking your coffee. Neither of you speaks until the paper cups go cold, and that is the most honest time of the day."
        }
      },
      "prologue05": {
        "eyebrow": "First case unlocked",
        "title": "Case 01 - 72 Hours",
        "button": "Start Case 01",
        "premise": "And then it is 2025, 3 years on. Han Seoyun hands you a review file she calls a training case. It is really a 72-hour due diligence KD Bank asked for, and the bottom edge of the cover still reads 2023-0412.",
        "hook": "The company you couldn’t stop back then runs out of cash in 72 hours. Being right 3 years ago now arrives not as proof but as a bill.",
        "movement": "Trigger Lab basement analyst room > FlowOn logistics site",
        "reason": "To see with your own eyes how the loan you dissented on 3 years ago actually collapses",
        "interlude": {
          "label": "Interlude · Leaving on Day One",
          "title": "The River from the 4th-Floor Window",
          "text": "Everyone calls it the basement, but the room has a window, and through it you can see the river. Byun Yujin says in passing, 'Everyone calls it the basement, but this is actually the 4th floor. New people always check that first.' You stand at the window for a long time, then turn off the light. For 3 years after that, you stand there almost every day."
        }
      },
      "case01": {
        "eyebrow": "Next case unlocked",
        "title": "Case 02 - False Signal",
        "button": "Start Case 02",
        "premise": "Overnight, the original review report you asked to see becomes a 'leak case.' The person accused is a contract worker 2 weeks from renewal.",
        "hook": "You looked at that loan’s signature line yesterday afternoon. This morning the document is evidence, and the access log has been tidied up under someone else’s name.",
        "movement": "FlowOn site > Trigger Lab security audit room",
        "reason": "To find out why the original review report you requested on site turned into a leak case in a single day",
        "interlude": {
          "label": "Interlude · 4 a.m.",
          "title": "The Night-Shift Lead Opens One More Cup of Noodles",
          "text": "Without asking anything, he pours in hot water and sets it in front of you. Neither of you speaks for the three minutes you wait together, and they are the easiest three minutes of the day. On the way out, he says just one thing. 'Next time, come during the day. In daylight this place feels like somewhere people live.'"
        }
      },
      "case02": {
        "eyebrow": "Next case unlocked",
        "title": "Case 03 - The Rival Strikes Back",
        "button": "Start Case 03",
        "premise": "In the Novaworks bid, you compete with Oh Jinwoo using the same data. Nobody tells you which loss this contract money is meant to erase.",
        "hook": "The time you spent between the record and the people has become a score. The next hand’s scoring sheet was built to compare two people, not two bids.",
        "movement": "Trigger Lab audit room > Novaworks bid room",
        "reason": "To see for yourself the channel that moves FlowOn’s loss onto another company’s books",
        "interlude": {
          "label": "Interlude · The Way Home",
          "title": "A Text from Lee Minseo",
          "text": "'The photo of the ER intake slip from that day. I can send it if you need it.' 30 minutes later, another. 'No, I don’t think you need it. I’ll just keep it.' Not knowing what to write back, you stare at the screen until you have missed your stop by two."
        }
      },
      "case03": {
        "eyebrow": "Next case unlocked",
        "title": "Case 04 - The Price to Pay",
        "button": "Start Case 04",
        "premise": "In a review that decides care for 4,200 people, the score falls short by exactly 3%. That 3% was made not by Onsae but by the repayment schedule the bank moved up.",
        "hook": "Losses don’t disappear. They move. The number erased in the bid room now shows up as 3% of care hours.",
        "movement": "Novaworks bid room > Onsae operations review room",
        "reason": "To find out how many percent of care the bank’s earlier repayment schedule costs on the ground",
        "interlude": {
          "label": "Interlude · At the Vending Machine",
          "title": "Oh Jinwoo Makes a Joke. It Isn’t Funny",
          "text": "He gets two coffees and hands you one. 'In the presentation earlier, my font was better.' When you don’t react, he adds, a little flustered, 'That was a joke.' Then he takes his coffee and leaves first. It is the first time he has ever tried a joke."
        }
      },
      "case04": {
        "eyebrow": "Next case unlocked",
        "title": "Case 05 - No One Was Guilty",
        "button": "Start Case 05",
        "premise": "312 people missed their home visits. No one broke a rule, and at the top of the rules sits a budget cap instead of people.",
        "hook": "The line you drew for exceptions doesn’t go away. In the next case it becomes a weight in the dispatch system and pushes out the quietest people first.",
        "movement": "Onsae operations review room > Care dispatch recovery control room",
        "reason": "To follow to the end the path that pushed out 312 people when no one broke a rule",
        "interlude": {
          "label": "Interlude · Onsae Office",
          "title": "A Letter in Wobbly Handwriting Arrives",
          "text": "It is a handwritten letter from someone who receives care. There are spelling mistakes in several places, and the last line is not 'Thank you' but 'I’m glad it didn’t stop.' The site manager laminates the letter and puts it on the wall. You stand in front of that wall for a long time."
        }
      },
      "case05": {
        "eyebrow": "Next case unlocked",
        "title": "Case 06 - The Person in the Same Room",
        "button": "Start Case 06",
        "premise": "The final reviewer who passed the weight table in 6 minutes hasn’t come to work for three days. His name is Oh Jinwoo, and his desk is eight steps from yours.",
        "hook": "How you name the person responsible is an organization’s habit. This time the habit lands on someone whose face you saw every day.",
        "movement": "Recovery control room > Trigger Lab, 4th-floor analyst room",
        "reason": "To check whether the standard you applied to outside institutions holds for a colleague eight steps away",
        "interlude": {
          "label": "Interlude · Bookshop, 2nd Floor",
          "title": "Lim Kyungsoo Pushes Over a Printout",
          "text": "The retired former review team head spends his days sorting old printouts on the 2nd floor of a secondhand bookshop. He doesn’t offer coffee. He just slides one printout across. The back page of the review report from 3 years ago, a page the system doesn’t have. 'You can fix the system and that’s that, but printouts have to be burned. And a burn mark shows.' Then he adds, 'Your opinion. I was the last person to read it.'"
        }
      },
      "case06": {
        "eyebrow": "Next case unlocked",
        "title": "Case 07 - Paying It Back",
        "button": "Start Case 07",
        "premise": "One morning, a week after the committee, a transfer order arrives. It is a personnel move, not discipline, so there is no reason and no appeal. In 48 hours the file stays here and you are 240km away.",
        "hook": "Whoever checks the terms of the person at the next desk is next. This time you are not the one asking questions. You are the one asking for help.",
        "movement": "Trigger Lab, 4th floor > Internal Audit records room > Gangseo Branch > Secondhand bookshop in Hoegi-dong",
        "reason": "To gather, one last time, what survives only in printouts and notebooks, with access that closes in 48 hours",
        "interlude": {
          "label": "Interlude · Street Stall Outside the Office",
          "title": "Ban Jaewook Buys the Drinks. He Doesn’t Drink",
          "text": [
            "Two days before the committee — Oh Jinwoo absent for the third day. No resignation submitted.",
            "Committee day — HR committee room, 2nd floor, 5 members. Oh Jinwoo agrees with neither side.",
            "Committee day — What you chose: {card}.",
            "Committee day, evening — Oh Jinwoo submits his resignation.",
            "Morning after the committee — Resignation not yet accepted. 3 requests to view the settings data.",
            "After a long while he says, 'I chose this job so I wouldn’t have to make trusting people my work.' Then he pushes the glass toward you. 'Today I failed.'"
          ],
          "fallback": "Committee day — Han Seoyun fills in the conclusion field of the minutes."
        }
      },
      "case07": {
        "eyebrow": "Next case unlocked",
        "title": "Case 08 - The Money Trail",
        "button": "Start Case 08",
        "premise": "Day 9 at Yeongdong Branch, Gangwon. A long-dormant company account receives an advisory fee every quarter and sends it the same day to a gallery in Seoul. The company is liquidated in 72 hours.",
        "hook": "People have desires, desires spend money, and money leaves a trail. The person who sent you 240km away sent you to the very counter that trail passes through.",
        "movement": "Trigger Lab, 4th floor > Yeongdong Branch, Gangwon > Gallery On, Cheongdam-dong > Haeon Guesthouse, Gyeongpo",
        "reason": "To follow one account found at a demoted counter to whose desire it leads, before the liquidation is registered",
        "interlude": {
          "label": "Interlude · 5:20 a.m.",
          "title": "The Soup Place by the Station Opens an Hour Early",
          "text": "Walking past the station before the 06:40 train, you see the soup restaurant’s lights on. The owner says, 'I open early for the first-train crowd. I never ask where anyone’s going.' You finish a bowl and leave with the ticket in your pocket. Even then, you haven’t decided which way to walk."
        }
      },
      "case08": {
        "eyebrow": "Next case unlocked",
        "title": "Case 09 - Two Income Statements",
        "button": "Start Case 09",
        "premise": "FlowOn stands 72 hours from the edge again. This time the agenda is liquidation. The lead reviewer for the bank pushing liquidation is the founder’s eldest son.",
        "hook": "A trail can punish people. Saving people takes a different bill. Half of that bill is held by the person you want to help, and he won’t accept pity.",
        "movement": "Yeongdong Branch > Yeouido > FlowOn creditors’ meeting room > Fulfillment center",
        "reason": "To save the company that fell the first time and put the bill of the people who brought it down on the same table",
        "interlude": {
          "label": "Interlude · Yeongdong Branch Night-Duty Room",
          "title": "The Branch Manager Shows You 30 Flounder Photos",
          "text": "On the heated mat in the night-duty room, Branch Manager Na Junhyuk scrolls through his phone’s photo album. Every picture shows the same breakwater, the same angle, the same size of flounder. 'Each one’s a different day.' When you can’t tell them apart, he is genuinely hurt. As the photos run out, he says, 'I’ve never seen someone from head office sit here this long. They all head back up fast.'"
        }
      },
      "case09": {
        "eyebrow": "Next case unlocked",
        "title": "Case 10 - The One Who Can’t Stop",
        "button": "Start Case 10",
        "premise": "The company survived, and the people who inflated its books stood trial. Ten days later, the person who pushed that hand to the end is rushed to the ER.",
        "hook": "Goodwill appears nowhere in this organization’s books as an expense. A cost that isn’t recorded doesn’t shrink either. This case asks who that bill is addressed to.",
        "movement": "Ieum Hospital, Gangseo > Window 4, Gangseo Branch > HR committee room > Secondhand bookshop in Hoegi-dong, 2nd floor",
        "reason": "To see who got the bill for the hand you won, and to move the list one person carried into a structure that won’t break",
        "interlude": {
          "label": "Interlude · 5 Weeks Before the Wedding",
          "title": "Kwon Dohyun Asks You to Sing",
          "text": "A month after the vote, a message comes from Kwon Dohyun. 'I have no one to sing at the wedding. Oh Jinwoo is tone-deaf and Mr. Ban said no.' You reply that you can’t sing, and the answer comes right back. 'I know. I did the math, and you’re still the smallest loss.' The seating chart photo with it shows the uncle’s seat next to the family table empty, and at the last round table: 'Kang Taemin and 10 others.'"
        }
      },
      "case10": {
        "eyebrow": "End of the English preview",
        "title": "Case 11 - The Room Everyone Watches",
        "button": "Continue in Korean",
        "premise": "You’ve reached the end of Case 10 — the end of the English preview for now. Your progress is saved on this device; from Case 11 the story continues in Korean until the English arrives. 3 weeks later, at six in the morning, the dissent that vanished 3 years ago becomes a news story. The anonymous Mr. A in the article is you, and five days later the National Assembly calls you.",
        "hook": "Every case so far was decided in a closed room. This time you speak in front of 12 cameras, and Yoon Sanghyuk’s seat at the witness stand is empty.",
        "movement": "Leadline newsroom, Mangwon-dong > National Assembly Members’ Office Building > Secondhand bookshop in Hoegi-dong, 2nd floor > Policy Committee room, National Assembly main building",
        "reason": "To say, for the first time and in the room everyone watches, whose hands erased the dissent 3 years ago",
        "interlude": {
          "label": "Interlude · Rota, Week 3",
          "title": "Na Junhyuk Sends Squid Sundae",
          "text": "3 weeks after the rota starts going around, an ice box arrives at the office. The sender is Na Junhyuk, and inside are six servings of squid sundae and a handwritten note. 'Six slots, so six servings. I put in double for Kang Taemin. The night shift needs to eat a lot.' That day Lee Minseo leaves on time for the first time, and Oh Jinwoo puts his share in the fridge and eats it two days later."
        }
      }
    },
    "caseIntroEchoes": {
      "prologue01": "Oh Jinwoo’s note: Last trainee assignment. It’s within the branch limit, so just check the numbers add up. Approval is Thursday.",
      "prologue02": "Team Head Yoon Sanghyuk’s note: You go out for the due diligence. Written opinion by next Tuesday.",
      "prologue03": "Oh Jinwoo’s text: The agenda is up. You’re item 4. Your opinion is attached as Attachment 7.",
      "prologue04": "Branch Manager Bae Seungho’s note: Head office review. Our branch: 0 complaints. Take your time.",
      "prologue05": "Nam Jihyung: The transfer takes effect next Monday. We don’t write down reasons.",
      "case01": "ECHO: I won’t ask how smart you are. I’ll watch for when you can’t stop thinking.",
      "case02": "ECHO: Login, transfer, security alert. All three lines at 23:41, all one account. Records rarely speak with one voice like this.",
      "case03": "ECHO: 4 hours to the deadline. Oh Jinwoo next door got the same envelope. Down to the last page.",
      "case04": "ECHO: In-person care hours are 3% below the standard. That 3% appeared in the quarter the repayment schedule was moved up.",
      "case05": "ECHO: 312 red dots. I haven’t found a single person who broke a rule.",
      "case06": "ECHO: The monitor at the end of the aisle has been on for three days. Oh Jinwoo has no clock-in record for three days.",
      "case07": "ECHO: The transfer order is dated 12 days before the investigation into Oh Jinwoo began. The final approval field is blank.",
      "case08": "ECHO: Haeon Partners. Advisory fees come in every quarter, and the same day the full amount goes out to a gallery in Cheongdam-dong.",
      "case09": "ECHO: Bridge Bank’s reviewer is Kwon Dohyun, the founder’s eldest son. 1,140 employees are waiting on that vote.",
      "case10": "ECHO: Retention period 0. The file from Do Yoonha’s locker is destroyed automatically in four days."
    },
    "legacyProfiles": {
      "S": {
        "title": "The trust your last call built supports the next case.",
        "text": "You explained your standard to the end in the last case. The next case starts with a little trust and fairness."
      },
      "A": {
        "title": "The balance of your last call remains.",
        "text": "You kept most of the pressure under control. The next case opens with some trust and fairness."
      },
      "B": {
        "title": "Unresolved costs carry over into the next case.",
        "text": "You got through the case, but unexplained losses remain. The next case starts with fatigue."
      },
      "C": {
        "title": "The cracks from your last call haven’t closed.",
        "text": "The pressure you couldn’t lower becomes the next case’s first question. Fairness and fatigue start against you."
      }
    },
    "tableReactions": {
      "low": [
        "You stopped early. Careful, but you kept little.",
        "You still had room. Next time, look a bit further.",
        "You didn’t go near the Wall. Safety first today?",
        "Quick decision. Let’s see if that speed works here too.",
        "A small push, then you pulled back. No loss, no big gain.",
        "You saved a lot. I wonder where you’ll spend it."
      ],
      "mid": [
        "You stopped at a good spot. I thought so too.",
        "You pulled back one step before the Wall. Steady.",
        "Not too early, not too late. Trust that sense.",
        "Just the push you needed. Let’s play this one the same way.",
        "You held back your greed. That isn’t easy.",
        "A good stop in the middle. The record kept that call."
      ],
      "hot": [
        "Right up to the Wall. Everyone held their breath.",
        "A big bet. You won this time. Can you do it again?",
        "You pushed all the way. This table needs that nerve too.",
        "That was close. Were your hands shaking?",
        "You took it high. Everyone’s watching you now.",
        "You stopped just short of the Wall. Luck or skill? We’ll see."
      ],
      "bust": [
        "That hand hit the Wall. Take a breath and start again.",
        "What’s lost is lost. Win it back at this table.",
        "You went too far. It’s fine. Everyone does it once.",
        "The Wall was closer than you thought. Look a little earlier this time.",
        "The stake is gone. The meeting goes on anyway.",
        "That one hurt. You won’t make the same mistake twice."
      ]
    }
  },
  "appCopy": {
    "resourceMeta": {
      "time": {
        "label": "Time left",
        "suffix": "h"
      },
      "capital": {
        "label": "Cash"
      },
      "trust": {
        "label": "Trust"
      },
      "legitimacy": {
        "label": "Fairness"
      },
      "humanCost": {
        "label": "Human cost"
      },
      "fatigue": {
        "label": "Fatigue"
      }
    },
    "playStyleOptions": {
      "instinct": {
        "label": "Instinct",
        "title": "Trust Your First Reaction",
        "text": "See less tactical detail and decide by the feel of the scene and how people react.",
        "payoff": "When you want to decide fast"
      },
      "auditor": {
        "label": "Auditor",
        "title": "Check the Evidence to the End",
        "text": "Lay out the costs and risks, then push the choice you can explain.",
        "payoff": "When you want to weigh things first"
      },
      "mediator": {
        "label": "Mediator",
        "title": "Ease Pressure Through Talk",
        "text": "Use ECHO’s hints and the context of relationships to spread the losses.",
        "payoff": "When you look at people first"
      }
    },
    "playGuideItems": [
      {
        "title": "ECHO",
        "text": "Not someone who gives you the answer, but a helper that points out what your last choice missed."
      },
      {
        "title": "Change the Game",
        "text": "When none of the options feels right, play the 'Reframe the Table' card. Commit it and a hidden path opens, one in each case."
      },
      {
        "title": "Status Changes",
        "text": "Shows how time, cash, trust, fairness, human cost and fatigue change after a choice."
      },
      {
        "title": "The Wall and Heartbeat",
        "text": "Every Push raises the Heat, and if you hit the invisible Wall you lose the stake riding on this case. A faster heartbeat means the Wall is close. Heat and time left also raise your heartbeat, and the Wall signal has some error."
      }
    ],
    "triggerLabSignals": {
      "prologue01": "Observing: how long you pause at a number that doesn’t fit, how you pass along credit, the threshold for putting your own name down",
      "prologue02": "Observing: whether you recalculate before a set conclusion, hesitation when it means aiming at your own team, the form of dissent you choose",
      "prologue03": "Observing: your first move right after the return notice, your reaction to the word protect, how fast your hand keeps a copy",
      "prologue04": "Observing: how long you stay silent after seeing the sales floor, choosing between familiar faces and rules, how you treat a chore handed down to you",
      "prologue05": "Observing: whether you ask about a decision with no reason, what you pack and what you leave, how fast you answer a voice you’ve never heard",
      "case01": "Observing: order of loss allocation, who is protected, tolerance for delayed disclosure",
      "case02": "Observing: trust in logs, trust in relationships, tolerance for checks outside procedure",
      "case03": "Observing: skipped verification under competition, response to speed rewards, sensitivity to the scoreboard",
      "case04": "Observing: tolerance for exceptions for good results, resistance to hiding records, preference for public audits",
      "case05": "Observing: need for a single culprit, patience with structural failure, noticing quiet victims",
      "case06": "Observing: choosing between protecting a colleague and the record, resistance to whistleblowing, tolerance for self-exposure",
      "case07": "Observing: limits on asking favors, weighing others’ costs, terms for putting your own name down",
      "case08": "Observing: how fast revenge drives the hunt, tolerance for traps, resistance to tracing family-held accounts",
      "case09": "Observing: how you count private loyalty, demands for compensation, rescuing and punishing at once",
      "case10": "Observing: when you notice burnout, tolerance for turning goodwill into policy, handling people outside the rules"
    }
  },
  "playerLanguage": {
    "easyResourceLabels": {
      "time": "Time left",
      "capital": "Cash",
      "trust": "Trust",
      "legitimacy": "Fairness",
      "humanCost": "Human cost",
      "fatigue": "Fatigue"
    },
    "easyCognitionLabels": {
      "persistence": "Hold Out",
      "inference": "Double-Check",
      "reframing": "Change the Game",
      "risk": "Handle Risk"
    }
  },
  "gameCases": {
    "caseObjectives": {
      "prologue01": "Decide whether the 40-million-won blank line you found in your last trainee assignment goes up under your mentor’s name, stays under yours, or gets let go",
      "prologue02": "Find out how the 179.6% debt-to-equity ratio was made, then decide whether to write the dissent on the 31-billion-won loan alone, with others, or softened",
      "prologue03": "Facing a dissent returned in one sentence, decide whether to request a review, keep a copy, or trust your boss’s word",
      "prologue04": "Watching the loan you tried to stop sold as a product at the counter, decide whether to protect the seller, report the sales method, or look away",
      "prologue05": "On the day one transfer order with a blank reason sends you down to Trigger Lab, decide what you take in with you",
      "case01": "Decide how to close the last 72 hours of the loan you dissented on 3 years ago",
      "case02": "Decide which to report first: the person the forged access log points to, or the hand that made the log",
      "case03": "Build not a faster conclusion than Oh Jinwoo’s, but a deal that still stands 3 years from now",
      "case04": "Decide how far to touch the 3% shortfall created by the bank’s repayment demand",
      "case05": "In a failure with no villain, separate blame from what can be improved",
      "case06": "In your colleague’s collapse, decide which comes first: protection or the record",
      "case07": "Decide what to gather in the 48 hours before your transfer, and who pays the price",
      "case08": "Decide how to keep the money trail leading to Yoon Sanghyuk as evidence, not revenge",
      "case09": "Put the bill that saves FlowOn and the bill that punishes the people who brought it down on one table",
      "case10": "Move the list one person’s persistence kept alive into a structure that won’t break, and decide what to do about the people that structure pushes out"
    },
    "seasonCasesBase": {
      "prologue01": {
        "label": "Prologue 01",
        "title": "Trainee Badge",
        "trigger": "Recognition / Responsibility / Competition",
        "summary": "Fall 2022, the last assignment of month 3 of your training. The debt total on the summary sheet is 40 million won less than the sum of its items, and adding that one line pushes the loan past what the branch can approve on its own. Here you first meet the number that becomes Article 7 a month later."
      },
      "prologue02": {
        "label": "Prologue 02",
        "trigger": "Responsibility / Curiosity / Injustice",
        "summary": "April 2023: 31 billion won about to go out to the logistics platform FlowOn. Due diligence shows revenue was booked 4 weeks early, and the real debt-to-equity ratio is 184.2%. The team that wrote in Article 7, which lets the bank call the loan at once, is yours."
      },
      "prologue03": {
        "label": "Prologue 03",
        "title": "Returned",
        "trigger": "Injustice / Trust / Helplessness",
        "summary": "28 minutes before the meeting opens, Manager Han Seoyun returns your dissent at the team review stage. In the committee room it ends in one sentence, and 11 agenda items pass in 47 minutes. In the hallway, she tells you about a written opinion she wrote 12 years ago."
      },
      "prologue04": {
        "label": "Prologue 04",
        "title": "Window 4",
        "trigger": "Protection / Empathy / Shame",
        "summary": "Two hours after approval, the loan becomes a product at the counter. At Window 4, Gangseo Branch, Do Yoonha uses a 3-minute script and sells it in 3 minutes 12 seconds, and the people she sells to are people whose names she knows. You are there for a chore called 'post-sale suitability review.'"
      },
      "prologue05": {
        "label": "Prologue 05",
        "title": "The Basement",
        "trigger": "Helplessness / Self-Awareness / System",
        "summary": "July 2023, HR Order No. 2023-1187. The reason field and the proposer field are both blank. On the 4th floor of the old data center in Hapjeong-dong, in the room everyone calls the basement, ECHO asks its first question. Then 3 years go by."
      },
      "case01": {
        "label": "Case 01",
        "title": "72 Hours",
        "trigger": "Responsibility / Protection / Injustice",
        "summary": "FlowOn runs out of cash in 72 hours. You go out on KD Bank’s due diligence and write the recommendation report. They called it a training case, but it is the very loan you dissented on alone at the bank 3 years ago."
      },
      "case02": {
        "label": "Case 02",
        "title": "False Signal",
        "trigger": "Trust / Justice / Affection",
        "summary": "A contract colleague is named as the leaker. The file that leaked is the original review report on the FlowOn loan, and the access log is as neat as if a person made it."
      },
      "case03": {
        "label": "Case 03",
        "title": "The Rival Strikes Back",
        "trigger": "Competition / Recognition / Curiosity",
        "summary": "In the Novaworks bid, you compete with Oh Jinwoo using the same data. The bid itself may be a channel for moving FlowOn’s losses onto another company’s books."
      },
      "case04": {
        "label": "Case 04",
        "title": "The Price to Pay",
        "trigger": "Reward / Responsibility / Order",
        "summary": "The 3% shortfall in the care platform Onsae’s review score is no accident. That 3% was created by the loan repayment schedule KD Bank suddenly moved up."
      },
      "case05": {
        "label": "Case 05",
        "title": "No One Was Guilty",
        "trigger": "System / Curiosity / Helplessness",
        "summary": "There is no obvious villain. Everyone followed the rules, and what pressed down on those rules from the top was a single contract from 3 years ago."
      },
      "case06": {
        "label": "Case 06",
        "title": "The Person in the Same Room",
        "trigger": "Competition / Affection / Self-Awareness",
        "summary": "Your rival Oh Jinwoo breaks down. The pressure settings that drove him used the same number as your experiment."
      },
      "case07": {
        "label": "Case 07",
        "title": "Paying It Back",
        "trigger": "Injustice / Trust / Choice",
        "summary": "It is a personnel move, not discipline. In 48 hours you will be at a branch 240km away, and the file stays here. This case is about who reaches out to you in those 48 hours."
      },
      "case08": {
        "label": "Case 08",
        "title": "The Money Trail",
        "trigger": "Revenge / Desire / Injustice",
        "summary": "At the branch you were demoted to, one dormant account receives an advisory fee every quarter and sends it to a gallery in Seoul. People have desires, desires spend money, and money leaves a trail."
      },
      "case09": {
        "label": "Case 09",
        "title": "Two Income Statements",
        "trigger": "Affection / Responsibility / Reward",
        "summary": "FlowOn stands 72 hours from the edge again. This time the agenda is liquidation. You have to put the bill that saves the company and the bill that punishes the people who brought it down on one table."
      },
      "case10": {
        "label": "Case 10",
        "title": "The One Who Can’t Stop",
        "trigger": "Affection / Helplessness / Choice",
        "summary": "The day after the win, the bill arrives. The person who carried the victims’ list alone for 3 years collapses, and the list is not an official record. It will be destroyed in four days."
      }
    }
  }
};
