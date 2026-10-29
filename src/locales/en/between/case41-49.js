/**
 * English copy between cases for 사건 41-49 and the finale (en-between-21-49,
 * 2026-10-28): the same tables as the dictionary's `copy`
 * (src/locales/en/index.js), under the same keys, and the roles of the
 * speakers who first appear in these cases, by that case (`caseRoles`).
 *
 * Kept out of the dictionary like case11-20.js: src/locales/overlay.js
 * fetches this file only once `previewThrough` reaches its first case, and
 * lays a case's words over only while that case is in the preview. The
 * finale (`final`) lives here too, since the loader picks a file by its
 * first case. A draft, machine-translated with the glossary (앱출시-G); `npm
 * run check:locale` counts it.
 */
export const copy = {
  "caseCopy": {
    "chapterRules": {
      "case41": {
        "label": "One Question and a Prepared Answer",
        "rule": "The answer has already been decided. All you can change is what that answer remains as in the room.",
        "authority": "Propose whose name to spend the 1-minute question on"
      },
      "case42": {
        "label": "Rest and Addresses",
        "rule": "Cutting off one person doesn’t break the chain. The cost of the spot left behind is usually paid by whoever moves into it next.",
        "authority": "Propose terms for turning scores placed on addresses back into review by people"
      },
      "case43": {
        "label": "One Person and the Last Line",
        "rule": "A resolution that removes one person can open a case or close it. The difference is in one line, the last line of the resolution.",
        "authority": "Propose terms for putting the 2023 board’s responsibility into the resolution along with the dismissal"
      },
      "case44": {
        "label": "Forgiveness and Signatures",
        "rule": "In a crime where the company is the victim, when the company forgives, the person goes home. If no one asks whose name is on that forgiveness, the price is always paid by people with no names.",
        "authority": "Propose verifying who signed the no-punishment letter, and the scope of a request for appeal"
      },
      "case45": {
        "label": "Originals and the Bereaved",
        "rule": "Some things only an original can prove, and an original is always someone’s keepsake. The moment it becomes evidence, that paper stops belonging to the family.",
        "authority": "Propose a consent procedure with the bereaved for submitting the original, and a deferral of the demand to return it"
      },
      "case46": {
        "label": "Empty Fields and Dots",
        "rule": "The person who left a field empty doesn’t stay in the record; the person who wrote a name beside the field goes out instead. To read an empty field, you have to start by counting the dots beside it.",
        "authority": "Propose halting disposal with no approver, and how much of the design log to preserve"
      },
      "case47": {
        "label": "Ledgers and Paperwork",
        "rule": "Damage with no paperwork is not damage that didn’t happen. The people a machine couldn’t count are usually written down first in someone’s handwriting.",
        "authority": "Propose a clause recognizing neighbors’ guarantees and handwritten records as evidence for the compensation criteria"
      },
      "case48": {
        "label": "Empty Fields and Signatures",
        "rule": "A dissent that isn’t erased doesn’t stop a loan. Even when a signature can’t change the result, it leaves who read and who wrote, and empty fields always pile up the quietest and the most.",
        "authority": "Propose abolishing the practice of delegating to the chair, and a clause protecting dissenting members in personnel decisions"
      },
      "case49": {
        "label": "Empty Fields and Names",
        "rule": "An empty field doesn’t end empty. If the person who left it empty doesn’t fill it, it closes under the name of whoever arrives last.",
        "authority": "Propose the name to go into the empty signature field, and who goes with you to tomorrow’s meeting"
      },
      "final": {
        "label": "Names and the Signature Field",
        "rule": "Now it is not the case but your response records that are the attachment to a personnel file.",
        "authority": "Choose to disclose, destroy or pass on the experiment data"
      }
    },
    "nextCaseSignals": {
      "case41": {
        "eyebrow": "Next case unlocked",
        "title": "Case 42 - Fireworks at Gyeongpo",
        "button": "Start Case 42",
        "premise": "Six days after the second hearing, Na Junhyuk stamps three seals on a 'Leave Order' he wrote with a brush pen and posts it in the group chat. The Gyeongpo Fireworks Festival, four rooms, 12 sets of bedding.",
        "hook": "Your leave request has been stuck in the CEO’s field for four days. And the address of the guesthouse Na Junhyuk booked is the very address you were chasing last summer.",
        "movement": "KD Capital Risk Management Department > Mulgyeol Stay, Gyeongpo > Karaoke room by the beach > Gyeongpo breakwater > The beach before dawn",
        "reason": "To see whether a dismissal motion that cuts off one man is also cutting off the people at the addresses he passed through, and to answer out loud, under the fireworks, what kept you from stopping",
        "interlude": {
          "label": "Interlude · The Day After the Hearing",
          "title": "Na Junhyuk Put His Navy Suit Up for Sale",
          "text": "The morning after the hearing, a secondhand listing link goes up in the group chat. Seller Na Junhyuk, item: one navy suit. The description reads, 'Worn 2 times as Yoon Sanghyuk, buttons close, no memory-improving effect,' and the price is 41,000 won. Kwon Dohyun replies at once. 'A loss rate of 83% against the purchase price. A loss.' 3 minutes later, Moon Hajun hits the purchase request. 'It’s the same as my score. I’ll wear it to my college interview.' Na Junhyuk cancels the sale and leaves one line. 'Just take it. But at the interview, say everything you remember.'"
        }
      },
      "case42": {
        "eyebrow": "Next case unlocked",
        "title": "Case 43 - The Board",
        "button": "Start Case 43",
        "premise": "On the Monday you’re back from Gyeongpo, a notice goes up. KD Financial Group board meeting on September 7, agenda item No. 1: the dismissal of Yoon Sanghyuk. Eight floors above your seat is his CEO’s office.",
        "hook": "Kwon Dohyun turns the seven outside directors into seven income statements. Only the Chairman’s field is empty. Because he’s not a variable but a constant.",
        "movement": "KD Capital Risk Management Department > Bookshop 1st floor, Hoegi-dong > Business school faculty office > ClearVote, Yeouido > Inside a taxi > Hallway outside the boardroom, 33rd floor, head office > Boardroom",
        "reason": "To tell whether dismissing one man, Yoon Sanghyuk, is reform or cutting off the tail, and to find out what the eight votes are meant to end",
        "interlude": {
          "label": "Interlude · Car 4 of the Train to Seoul",
          "title": "Of the 12 Photos, None Had Everyone’s Eyes Open",
          "text": "In car 4 of the train from Gangneung to Seoul, the 12 photos taken that morning go up in the group chat. Every time, someone has their eyes closed; in the sixth Na Junhyuk is holding up his stamp, and in the ninth Kwon Dohyun is holding up the parasol receipt. Han Seoyun picks one of them and makes it the group chat’s cover photo. It is the one where only her eyes are open. When Oh Jinwoo writes 'Rematch,' Yeo Dain sends a photo. The first page of the guestbook, and under it a newly stuck note. 'The buoy will wait.'"
        }
      },
      "case43": {
        "eyebrow": "Next case unlocked",
        "title": "Case 44 - The First-Instance Verdict",
        "button": "Start Case 44",
        "premise": "Two days after the dismissal motion passes, the first-instance sentencing in the Haeon Partners advisory fee case is set for 10 a.m. tomorrow. The prosecutor has asked for 7 years in prison.",
        "hook": "On the afternoon before the sentencing, KD Bank, the victim, filed a paper saying it forgives Yoon Sanghyuk. The CEO’s signature field is empty; only the corporate seal is stamped on it.",
        "movement": "Bookshop 1st floor, Hoegi-dong > Gallery-pass line outside the East Wing, Seoul Central District Court > Courtroom 417 > Sundae-soup restaurant in the alley behind the court > Outside the court’s main gate",
        "reason": "On the day a forgiveness with only a seal and no name goes onto the scales of the ruling, to show who did the forgiving and who paid the price, and to decide who gets to say 'it’s over'",
        "interlude": {
          "label": "Interlude · The Morning After the Board Meeting",
          "title": "The 80 Cup Noodles Made It Through Security After All",
          "text": "The morning after the board meeting, Kang Taemin gets a call from head office security. They are holding, at the 1st-floor checkpoint, a box he left in the 33rd-floor hallway yesterday. When he goes to get it, there is a sticky note under the 80 names on the lids. 'We read every name. We ate two. Thanks for the rice cakes too. -- 1st-floor checkpoint.' When Kang Taemin posts the photo to the group chat, Kwon Dohyun writes at once. 'Two cup noodles lost, four rice cakes lost, security team’s goodwill gained. I’ll save the conclusion field.' Below it, Professor Eun Chaewon leaves an emoji for the first time. Four highlighters."
        }
      },
      "case44": {
        "eyebrow": "Next case unlocked",
        "title": "Case 45 - The Last Paper",
        "button": "Start Case 45",
        "premise": "Lim Kyungsoo, who said he was short of breath on the night of the sentencing, passes away before dawn five days later. Memorial Room 3, Ieum Hospital funeral hall. Where the memorial portrait should be stands a drawing by his granddaughter instead of a photo.",
        "hook": "In Lim Soyul’s pocket is a manila envelope. On the outside, in pencil: 'For Yul and the one who wrote the dissent, together. Open at dawn on the third day.'",
        "movement": "Memorial Room 3, Ieum Hospital funeral hall > Wreaths lining the memorial room entrance > Night in the reception room > Before the altar at dawn on the third day > By the hearse at the procession",
        "reason": "To learn what the last envelope of a man who died protecting paper proves and what it reveals, and to decide who gets to choose that paper’s path",
        "interlude": {
          "label": "Interlude · The Morning After the Sentencing",
          "title": "'However' x23",
          "text": "The morning after the sentencing, Moon Hajun tears one more drawing of the presiding judge out of his sketchbook and pins it to the bulletin board on the bookshop’s 1st floor. The title is ''However' x23.' Kwon Dohyun pins his betting settlement sheet beside it, and Oh Jinwoo pins a request for a recount. Under the request is one line signed by Kang Taemin. 'Dismissed.' Na Junhyuk goes to stamp it, stops and laughs. 'This isn’t worth my stamp.' In the afternoon, Seo Jiho sends a photo saying he has learned every way to fold a rice cake box. He isn’t wearing the navy cap."
        }
      },
      "case45": {
        "eyebrow": "Next case unlocked",
        "title": "Case 46 - ECHO’s Return",
        "button": "Start Case 46",
        "premise": "One day after seeing Lim Kyungsoo off, KD Data Lab’s disposal schedule goes up. 12 returned Trigger Lab servers will be shredded tomorrow at 18:00, and four of them are ECHO.",
        "hook": "The approver field on the disposal approval is empty. Lee Minseo turns her laptop around to show you and says, 'If we restore it, I know what its first words will be. Recalculate.'",
        "movement": "Bookshop 1st floor, Hoegi-dong > Disposal holding area, basement level 3, KD Data Lab data center, Pangyo > Test server room > Test server room terminal",
        "reason": "To bring back a machine about to vanish on one sheet of paper with no approver, to read the habit of a field that was always empty for 3 years, and to decide whether to put yourself into that calculation",
        "interlude": {
          "label": "Interlude · The Day After the Procession",
          "title": "Late Fee: 1,300 Won",
          "text": "The day after the procession, Lim Soyul finds a bundle of loan cards in the bookshop’s counter drawer. On the top card are Kwon Dohyun’s name and return date, and in her grandfather’s hand: '13 days overdue -- to collect.' Lim Soyul staples the 'Late fee 1,300 won' envelope from the condolence box to the card and writes in red pen: 'Paid in full.' Kwon Dohyun gets the photo, doesn’t answer for a long time, then sends one line. 'I will keep the receipt for the rest of my life.' Kang Taemin replies below. 'Keep the barley tea too.'"
        }
      },
      "case46": {
        "eyebrow": "Next case unlocked",
        "title": "Case 47 - Chuseok, 1 Year Later",
        "button": "Start Case 47",
        "premise": "On the morning three days before Chuseok, Moon Gaeul sends the same text as 1 year ago. 'Don’t just talk about it. Come steam rice cakes.' This time there is one more line. 'This year we have six steamers.'",
        "hook": "In the 2nd-round compensation criteria that arrive the same day, 31 of the 212 people with no paperwork are stamped 'Unconfirmable.' They are the very thirty-one Moon Gaeul asked about last Chuseok, stopping halfway through slicing rice cakes.",
        "movement": "KD Capital Risk Management Department > Gaeul Rice Cake Shop, Mangwon Market > To-the-End Precision, Namdong Industrial Complex, Incheon > Columbarium, memorial park, Incheon > Gaeul Rice Cake Shop > Rooftop under the full moon",
        "reason": "To prove that the 31 marked 'Unconfirmable' because the bank’s systems have not a single line on them were in fact the people who fed, clothed and carried for one factory, and this time to answer all the way to the end the question that stopped the slicing 1 year ago",
        "interlude": {
          "label": "Interlude · The Morning After the Shredding",
          "title": "31 Jokes",
          "text": "The morning after the shredding, Kang Taemin pins a notebook page to the bulletin board on the bookshop’s 1st floor. '31 jokes ECHO never heard -- in order.' No. 1: 'Why is the server room cold? Because the servers are so cool.' Kwon Dohyun draws a laugh-probability field under it, and Na Junhyuk leaves an instant-coffee stain in every field. At the very bottom Lim Soyul draws a small picture. Her grandfather, sitting in the chair on the stair landing, covering his ears and laughing. A text comes from Yeon Siwoo. 'I left that shelf from yesterday empty. These guys seemed to miss them.'"
        }
      },
      "case47": {
        "eyebrow": "Next case unlocked",
        "title": "Case 48 - Writing the Dissent Again",
        "button": "Start Case 48",
        "premise": "On Chuseok night, in the middle of the holiday, KD Capital has called an emergency credit committee. Tomorrow at 9 a.m., the agenda is a 29-billion-won working-capital loan to LoopNow, a 15-minute urban delivery company.",
        "hook": "Article 7 on page 14 of the contract is the same as the 2023-0412 contract down to where the commas fall. And this time your name is printed in the bottom field of the signature block.",
        "movement": "KD Capital Risk Management Department > LoopNow dark store, Seongsu-dong > Riders’ rest stop > KD Data Lab server room, Pangyo > Bookshop 1st floor, Hoegi-dong > KD Capital credit committee meeting room > Rooftop at dusk",
        "reason": "To find out all the way whether the dissent you wrote alone back then, which was returned, can be written again in your own name in front of a loan of the same shape, and whom that signature protects and to whom it sends the bill",
        "interlude": {
          "label": "Interlude · The Morning After Chuseok",
          "title": "Nicknames for 31 Songpyeon",
          "text": "The morning after Chuseok, a page of Moon Hajun’s sketchbook is stuck to the fridge door at Gaeul Rice Cake Shop. A plate of 31 songpyeon, each with a nickname. 'Two Pieces of Mackerel,' 'Red Motorbike,' 'Ironing Grandpa.' Under it, someone has drawn a 32nd songpyeon in ballpoint pen. It is so neatly shaped that everyone looks at Seo Jiho. Seo Jiho shakes his head and points at Na Junhyuk. Na Junhyuk clears his throat. 'My stamp retired. My hands didn’t.' Passing by, Nam Heewon writes one word beside that songpyeon. 'Rice.'"
        }
      },
      "case48": {
        "eyebrow": "Next case unlocked",
        "title": "Case 49 - To the 33rd Floor",
        "button": "Start Case 49",
        "premise": "On the evening the credit committee minutes go up, Yoon Sanghyuk sends one line. 'Now let’s talk about the empty signature field.' The next morning a second text comes. Tomorrow night at nine, the old Group Strategy Office on the 33rd floor.",
        "hook": "One day until you go up. At the rice cake shop everyone hands you something to take, in the old Trigger Lab B2 the successor-manager field waits for your name, and under the moonlight the Chairman calls one last time.",
        "movement": "Bookshop 1st floor, Hoegi-dong > Gaeul Rice Cake Shop, Mangwon Market > The old Trigger Lab archive, B2 > Crosswalk outside head office, Yeouido > Yoonkyung Alterations, Anyang > Bookshop 1st floor, Hoegi-dong",
        "reason": "On the day the owner of the field left empty through forty-eight cases asks to talk, to see who sends what up with you and who wrote your name in that field ahead of time, and to settle the one-line answer you will take into that room tomorrow",
        "interlude": {
          "label": "Interlude · The Morning After the Credit Committee",
          "title": "The Odds It’s the Same Person",
          "text": "The morning after the credit committee, a sheet of A4 is pinned to the bulletin board on the bookshop’s 1st floor. It is the twelve signatures you practiced before dawn. Under it, Kwon Dohyun’s handwriting. 'Odds it’s the same person 31% → remeasured this morning 34%. Improving.' Moon Hajun draws a 13th signature beside them and writes 'Official typeface.' Na Junhyuk goes to stamp it, stops and laughs. 'Stamping over a signature is exactly what they did back then.' In the afternoon Chae Ian sends a photo. On his Risk Management Department desk, beside the cherry-tree calendar, one field of the minutes is pinned up. The word 'abstain' isn’t in it."
        }
      },
      "case49": {
        "eyebrow": "Final case unlocked",
        "title": "Final Case - The Empty Signature Field",
        "button": "Start the Final Case",
        "premise": "The records of forty-nine cases gather into a single folder. In that folder’s manager field is a single dot, and in the recommendation field is your name. The person who left the field empty is waiting on the 33rd floor.",
        "hook": "Whether what kept you from stopping for 1 year was affection, revenge or responsibility. The man who designed those conditions now wants to hand them over to you. Take them, seal them, or open them to everyone. Tonight you answer whose name belongs in the empty signature field.",
        "movement": "The old Trigger Lab archive, B2 > 33rd floor, head office > Back to B2",
        "reason": "To answer in what format forty-nine cases and 1 year of response records were organized, who wrote your name ahead of time in that format’s manager field, and whose name belongs before the person who first left that field empty",
        "interlude": {
          "label": "Interlude · Before Going Up",
          "title": "The Second Cup Noodles",
          "text": "Before dawn, in the bookshop alley, an empty cup-noodle container and an unopened cup of noodles sit side by side. On the lid of the unopened one, Kang Taemin writes in marker: 'When you’re back.' Beside it Kwon Dohyun adds in small letters: 'Before the expiration date.' Moon Hajun’s sketchbook lies open on the counter, and one spot is empty, without even a pencil line. In the memorial drawing, Lim Kyungsoo’s eyes look at that empty spot."
        }
      }
    },
    "caseIntroEchoes": {
      "case41": "Cha Jiwon: An empty chair doesn’t push back. This time he says he’s coming.",
      "case42": "Na Junhyuk: I stamped three seals on the Leave Order. Gyeongpo guesthouse, four rooms, 12 sets of bedding.",
      "case43": "Han Seoyun: Eight people cast votes. Yoon Sanghyuk is the party concerned, so he’s out.",
      "case44": "Oh Jinwoo: It’s money I chased for 3 years, and the company is the one who forgives.",
      "case45": "Lim Soyul: It’s the envelope Grandpa asked for last. He wants it opened at dawn on the third day.",
      "case46": "ECHO: The dissent’s storage location is…… September 19, 18:00…… units 1~4 by foot……",
      "case47": "ECHO: 181 people will be paid within the holiday. Beside 31 is stamped 'Unconfirmable.' There are six steamers.",
      "case48": "ECHO: Your name is printed on the fifth line of the committee member list. This field cannot be left empty.",
      "case49": "ECHO: A text that came at 08:59, 1 minute before the hour. Tomorrow night at twelve, the 33rd floor.",
      "final": "ECHO: This folder’s template is not research material. It is a personnel report template."
    }
  },
  "appCopy": {
    "triggerLabSignals": {
      "case41": "Observing: how you choose your only question, your reaction to pressure that puts family up front, choosing between a name and a structure",
      "case42": "Observing: your reaction to an injustice that arrives during rest, how you speak about your own motives, your attitude toward the people hidden behind the dismissal motion’s numbers",
      "case43": "Observing: how you treat people outside the probability table, your standard for accepting a conditional win, your reaction to a sentence saying it’s over",
      "case44": "Observing: where you choose to stand before a conclusion you can’t change, how you hold back someone trying to stand up, how fast you move against a 7-day clock",
      "case45": "Observing: your pace in front of people in mourning, priorities when evidence and keepsakes overlap, the moment you decide to cut off laughter or let it go on",
      "case46": "Observing: your pace with a voice brought back, how you receive pieces brought without permission, the moment you put your own name into the calculation",
      "case47": "Observing: your attitude toward the names left over on a happy day, how you prove damage with no records, choosing between the dead’s shame and the living’s rights",
      "case48": "Observing: how you sign when there is no one to return it, your attitude toward a clause a good CEO swallowed, choosing between the deadline clock and the record",
      "case49": "Observing: how you carry what you’re handed, hesitation before your own name written in advance, how fast you respond to a call from above",
      "final": "Observing: awareness of your own conditions, how much of your profile you disclose, how far you allow the system to remain"
    }
  },
  "gameCases": {
    "caseObjectives": {
      "case41": "Facing 23 'I don’t recall's, choose your only question, and decide what an answer that can’t be proven becomes in this room",
      "case42": "At the seaside where you went to rest, decide which to protect first: the new owner punished for the last owner’s address, or the 47 places the dismissal motion lists as 'cleanup complete'",
      "case43": "Before the Chairman’s last vote, decide the last line of the resolution: whether the motion removing one man becomes a procedure that opens the 2023 record or one that closes it",
      "case44": "Facing a ruling where the company forgave and the employees paid, decide whether to stand beside the people in the gallery, prepare an appeal within 7 days, or start by negotiating to turn the forfeiture into compensation",
      "case45": "On the morning of the procession (sending the coffin off from the funeral hall), decide whether to leave to the family’s wishes the one original that can fill Yoon Sanghyuk’s four empty fields, submit it as evidence even if it reveals the consent the deceased crossed out, or file the appeal (asking for a new trial, disputing the first-instance ruling) with a copy first and hold the original back",
      "case46": "Before the shredding truck comes, bring ECHO back, and decide how to record where the dots beside the empty fields point and the 'missing person' ECHO names",
      "case47": "Between the path where 181 people are paid within Chuseok and the path that includes the 31 to the end, decide how to count damage that survives only in a meal-tab ledger and a dead man’s notebook, not in loan paperwork",
      "case48": "Facing a loan the exact shape of FlowOn’s, decide whether this time to write a dissent that won’t be erased, approve with conditions, or pass on your signature and leave the field empty. The dissent stays, but at the price of shaking 214 people’s October pay",
      "case49": "On the day before going up to the 33rd floor, carrying what everyone handed you, ECHO’s last calculation and the Chairman’s call, settle the answer you will take tomorrow: whose name belongs in the empty signature field",
      "final": "Settle whose name should have been in the empty signature field of the FlowOn credit review report"
    },
    "seasonCasesBase": {
      "case41": {
        "label": "Case 41",
        "title": "The Second Hearing",
        "trigger": "Anger / Laughter / Questions",
        "summary": "Yoon Sanghyuk, the empty chair last fall, takes the witness seat this time at the hearing (where the National Assembly calls witnesses to question them closely about one matter). The answer he has prepared is just one: 'I don’t recall.' What you’re given is 1 minute and one question."
      },
      "case42": {
        "label": "Case 42",
        "title": "Fireworks at Gyeongpo",
        "trigger": "Joy / Laughter / Anger / Sadness",
        "summary": "The week after the second hearing, on Na Junhyuk’s 'Leave Order,' everyone goes to the Gyeongpo Fireworks Festival. The lodging is the old Haeon Guesthouse, now Yeo Dain’s Mulgyeol Stay. At 7:04 on Friday evening, she, who has never once paid late, gets an automatic early-call text, and that night under the breakwater everyone says what kept them from stopping."
      },
      "case43": {
        "label": "Case 43",
        "title": "The Board",
        "trigger": "Anger / Laughter / Sadness / Joy",
        "summary": "The KD Financial Group board takes up a motion to dismiss Yoon Sanghyuk (an agenda item removing a director from the post). The votes are cast by the Chairman and seven outside directors (directors from outside the company who watch over management), eight in all. The agenda brief has not one line about the 2023 board, and the Chairman attaches a condition to the last vote."
      },
      "case44": {
        "label": "Case 44",
        "title": "The First-Instance Verdict",
        "trigger": "Anger / Laughter / Sadness / Joy",
        "summary": "Sentencing day at first instance in the breach-of-trust case (the crime of abandoning one’s duty and causing the company loss) over Haeon Partners’ advisory fees (money passed back and forth as the price of advice). The day before, KD Bank, the victim, filed a no-punishment letter (a paper saying it doesn’t want him punished), and over the 43 minutes of the ruling the presiding judge says 'however' 23 times."
      },
      "case45": {
        "label": "Case 45",
        "title": "The Last Paper",
        "trigger": "Sadness / Laughter / Anger / Joy",
        "summary": "Lim Kyungsoo passes away. Three days in the memorial room, mourners laughing as they tease the deceased, the group’s wreath beside the memorial portrait, and the Legal team’s demand to hand over the paper. At dawn on the third day, his granddaughter Lim Soyul opens the envelope he left. The original of the back page of the dissent, and the 'consent' he wrote and then crossed out."
      },
      "case46": {
        "label": "Case 46",
        "title": "ECHO’s Return",
        "trigger": "Laughter / Anger / Sadness / Joy",
        "summary": "20 hours before the returned Trigger Lab servers are shredded, Lee Minseo brings ECHO back. The returned ECHO recalculates 3,412 entries in the design log (the record of the dates and people who changed how the experiment was set up), finds the single dot in every empty field, and names you as the person left out of the calculation for 3 years."
      },
      "case47": {
        "label": "Case 47",
        "title": "Chuseok, 1 Year Later",
        "trigger": "Joy / Laughter / Sadness / Anger",
        "summary": "Exactly 1 year after Case 12, everyone ties on an apron again for Gaeul Rice Cake Shop’s Chuseok rush. The 2nd-round compensation criteria accepted 181 of the 212 people with no paperwork, and the remaining 31 were stamped 'Unconfirmable.' On To-the-End Precision’s first day in the black, a notebook titled 'To Repay' turns up in Moon Sungho’s drawer. It holds thirty-one names."
      },
      "case48": {
        "label": "Case 48",
        "title": "Writing the Dissent Again",
        "trigger": "Anger / Laughter / Sadness / Joy",
        "summary": "On Chuseok night, a 29-billion-won loan to LoopNow, a 15-minute urban delivery company, comes before KD Capital’s emergency credit committee. Article 7 of the contract is the same as 2023-0412 down to the commas, and in one of the five signature fields, for the first time, your name is printed. One night is left until the investment deadline."
      },
      "case49": {
        "label": "Case 49",
        "title": "To the 33rd Floor",
        "trigger": "Anger / Laughter / Sadness / Joy",
        "summary": "Three days after the credit committee, Yoon Sanghyuk says let’s talk about the empty signature field tomorrow night in the old Group Strategy Office on the 33rd floor. At the rice cake shop everyone hands you something to take, and on the old terminal in B2 a successor-manager designation with a single dot in the manager field waits for your name. The Chairman calls to tell you to accept it, and Han Seoyun says to decide tonight whose name to write in that field."
      },
      "final": {
        "label": "Final Case",
        "title": "The Empty Signature Field",
        "trigger": "Self-Awareness / Manipulation / Choice",
        "summary": "The signature field of the FlowOn credit review report has been empty for 3 years. The person who left that field empty built Trigger Lab, and sent you here."
      }
    }
  }
};

export const caseRoles = {
  "case41": {
    "국회 정무위원장 · 3선 의원": "Chair of the National Assembly Policy Committee · three-term lawmaker"
  },
  "case42": {
    "경포 '물결스테이' 사장 · 전 KD은행 영동지점 창구 계약직": "Owner of 'Mulgyeol Stay,' Gyeongpo · former contract teller, KD Bank Yeongdong Branch"
  },
  "case43": {
    "KD금융그룹 사외이사 · 경영대 회계학 교수": "Outside director, KD Financial Group · accounting professor, business school",
    "KD금융그룹 이사회 의장 · 사외이사 · 전 금융위원회 국장": "Board Chair, KD Financial Group · outside director · former Director General, Financial Services Commission"
  },
  "case44": {
    "줄서기 대행 아르바이트 · 전 플로우온 풀필먼트센터 야간조": "Paid line-stander · formerly on the FlowOn fulfillment center night shift",
    "서울중앙지방법원 형사합의부 재판장": "Presiding judge, Criminal Panel, Seoul Central District Court"
  },
  "case45": {
    "임경수의 아들 · 두바이 담수화 설비 현장 소장": "Lim Kyungsoo’s son · site manager of a desalination plant in Dubai",
    "KD은행 법무팀 과장": "Manager, Legal team, KD Bank",
    "영동 바다결수산 대표 · 30년 전 그 오징어 공장 사장의 아들": "Head of Badagyeol Seafood, Yeongdong · son of the owner of that squid factory 30 years ago"
  },
  "case46": {
    "KD데이터랩 판교 데이터센터 인프라 엔지니어 · 야간 당직": "Infrastructure engineer, KD Data Lab data center, Pangyo · on night duty"
  },
  "case47": {
    "가온정밀 전 구내식당 사장 · 서류 없는 31명 중 한 사람": "Former owner of the Gaon Precision cafeteria · one of the 31 with no paperwork",
    "끝까지정밀 협동조합 반장": "Foreman, To-the-End Precision cooperative"
  },
  "case48": {
    "루프나우 대표 · 전 플로우온 야간 배차 매니저 · 31세": "CEO of LoopNow · former night dispatch manager at FlowOn · age 31",
    "KD캐피탈 기업금융본부장 · 루프나우 안건 발의자": "Head of Corporate Finance, KD Capital · proposer of the LoopNow agenda item"
  }
};
