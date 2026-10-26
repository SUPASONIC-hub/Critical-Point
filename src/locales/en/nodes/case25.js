/**
 * 사건 25 (src/nodes/case25.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c25_start": {
      "title": "The One Who Didn’t Come",
      "text": "The elevator doors open on the 33rd floor. Only half the lights are on in the Group Strategy Office, and at the end of the hall the door to Yoon Sanghyuk’s office stands wide open. There isn’t a single document on the desk, and the nameplate is turned face down. Baek Arin, packing a box at her own desk, looks up. 'He isn’t coming. His car left at four in the afternoon. He sent that text from the car.' She points to the middle of the empty desk. A single sheet of paper lies there: a printout of a personnel notice dated April 1. The first line reads 'Yoon Sanghyuk, appointed CEO of KD Capital.' Below it runs the list of transfer orders following Trigger Lab’s dissolution, and on the very last line is your name. 'KD Capital Risk Management Department, reporting directly to the CEO.' Nowhere is there a word about the blank signature field.",
      "memo": [
        "Yoon Sanghyuk’s office, 33rd floor -- lights on, nobody there, nameplate face down",
        "Printout: personnel notice dated April 1, Yoon Sanghyuk CEO of KD Capital",
        "Your new post: KD Capital Risk Management Department, reporting directly to the CEO",
        "Copy of the receipt log in your pocket -- no one to hand it to tonight"
      ],
      "choices": {
        "c25_start_seat": {
          "label": "Take the printout and plan your move before the notice"
        },
        "c25_start_call": {
          "label": "Use the printout to warn listed colleagues before the notice"
        },
        "c25_start_log": {
          "label": "Record the empty office and printout, confirmed by Baek Arin"
        },
        "reframe": {
          "label": "Find out where the executives in trouble went"
        }
      },
      "place": "KD Financial Group Headquarters, 33rd Floor · Group Strategy Office",
      "clock": "March 27 · Friday 21:40",
      "question": "On the desk in the empty office lies a personnel notice with your name on it. What do you do with this paper?",
      "lead": "On the night Trigger Lab’s lights went out and a text said 'Come up,' the elevator to the 33rd floor rises without stopping once."
    },
    "c25_notice": {
      "title": "An April Fools’ Personnel Notice",
      "text": "An all-staff personnel notice comes up on every phone. Yoon Sanghyuk, promoted to CEO of KD Capital. Your access cards have been cut off, so the 20 boxes you packed last week come down through the window on a ladder truck. Oh Jinwoo reads the notice again. 'Of all days, April Fools’. I don’t suppose anyone’s going to tell us it was a joke?' Kang Taemin, stopping by after the night shift, picks up two boxes at once instead of answering. Do Yoonha to Gangseo Branch, Oh Jinwoo to Bridge Bank, just as you heard last week. Two lines have changed: Lee Minseo to KD Data Lab, Ban Jaewook to a regional rotation for Internal Audit. Only beside Han Seoyun’s name is there no department. 'Standby assignment.' The reason field is empty. Oh Jinwoo turns his phone face down. 'No results was at least two words. This time there isn’t a single one.'",
      "memo": [
        "Personnel notice, April 1, 07:00 -- Yoon Sanghyuk promoted to CEO of KD Capital",
        "Six posts on the transfer list: Gangseo Branch · KD Data Lab · regional rotation · Bridge Bank · standby · KD Capital",
        "Han Seoyun: standby assignment, reason field empty",
        "1 moving truck, 20 boxes packed last week, out by today",
        "Two changed lines: Lee Minseo (was pending reassignment) · Ban Jaewook (was returning to Internal Audit)"
      ],
      "choices": {
        "c25_notice_ask": {
          "label": "Demand HR’s official explanation for standby with no reason"
        },
        "c25_notice_call": {
          "label": "Call Han Seoyun before the boxes; say you’ll be by her side"
        },
        "c25_notice_load": {
          "label": "Leave the notice be; fill the truck by today first"
        },
        "reframe": {
          "label": "Find out where the executives in trouble went"
        },
        "c25_notice_evidence_turn": {
          "label": "Bring out KD Capital’s board minutes from before the vote"
        }
      },
      "place": "In Front of the Trigger Lab Building · Moving Truck in the Alley",
      "clock": "April 1 · Wednesday 10:00 · Cherry Blossoms",
      "question": "In the April Fools’ morning notice, only the space beside Han Seoyun’s name is empty. What do you do first?",
      "lead": "In front of the building you no longer have access to, a moving truck backs into the alley on Wednesday morning."
    },
    "c25_standby": {
      "title": "Desks Facing the Wall",
      "text": "At the end of the 7th-floor hallway at headquarters, in a room with no nameplate, six desks all sit facing the wall. There are no computers; each desk holds only a stack of A4 paper and a single ballpoint pen. Han Seoyun sits at the desk by the window. The first assignment HR gives a person on standby is a 'self-development plan, 10 pages of A4.' She twirls her pen and smiles. 'For 3 years I recorded other people’s thinking down to the second, and now they want me to write 10 pages of my own.' Yeouido’s cherry blossoms show through the window. She lowers her voice. 'My mom called yesterday. KD’s personnel news was on TV, and she asked if I’m going somewhere good too.' She writes only her name on the first page of the plan, and for a long while writes nothing more.",
      "memo": [
        "7th-floor standby room, headquarters -- 6 desks facing the wall, no computers",
        "First assignment: self-development plan, 10 pages of A4, due Friday",
        "Han Seoyun’s mother: 'Are you going somewhere good too?'",
        "Length of standby: not stated in the notice"
      ],
      "choices": {
        "c25_standby_rule": {
          "label": "Start the process to get standby length and reason in writing"
        },
        "c25_standby_sit": {
          "label": "Sit at the next desk today and fill the 10 pages together"
        },
        "c25_standby_leave": {
          "label": "Staying long makes you a target; say a quick hello and go"
        },
        "reframe": {
          "label": "Find out where the executives in trouble went"
        },
        "c25_standby_evidence_turn": {
          "label": "Bring out KD Capital’s board minutes from before the vote"
        }
      },
      "place": "KD Financial Group Headquarters, 7th Floor · Standby Room at the End of the Hall",
      "clock": "April 6 · Monday 09:00",
      "question": "At a desk facing the wall, Han Seoyun can’t fill the first page of her plan. What do you do in this room?",
      "lead": "Han Seoyun’s text gave only a floor and a room number. The 7th floor, end of the hall, a door with no nameplate."
    },
    "c25_chatroom": {
      "title": "A Group Chat for Six",
      "text": "Ban Jaewook stands on the Seoul Station platform in front of the KTX for Gunsan, the first stop on his regional rotation for Internal Audit. Han Seoyun holds up her phone. 'I made a group chat. Six of us. We’ll vote on the name.' Suggestions pour in. Oh Jinwoo offers 'Trigger Lab Alumni,' Lee Minseo 'No Results,' Do Yoonha 'Tuesday Lunch.' When Ban Jaewook posts '4th Floor,' Han Seoyun objects: 'It sounds like a floor the elevator doesn’t stop at.' Kang Taemin, who wasn’t even invited, texts from outside. 'Make it Let’s All Come In Tomorrow.' The count: 3 to 3. The departure bell rings, and as Ban Jaewook boards the train he hands the last vote to you. 'The decision was always yours. Make it a light one this time.' The doors close, and the poll window blinks on your phone screen.",
      "memo": [
        "Group chat of 6 -- name undecided, count 3 to 3",
        "Candidates: Trigger Lab Alumni · No Results · Tuesday Lunch · 4th Floor",
        "Write-in candidate: 'Let’s All Come In Tomorrow' (Kang Taemin, not invited)",
        "First stop on Ban Jaewook’s regional rotation: Gunsan"
      ],
      "choices": {
        "c25_chatroom_log": {
          "label": "Pick '4th Floor' and write down what you each see daily, dated"
        },
        "c25_chatroom_toast": {
          "label": "Pick 'Let’s All Come In Tomorrow,' bring in Kang Taemin, laugh"
        },
        "c25_chatroom_tuesday": {
          "label": "Pick 'Tuesday Lunch' and keep it a room for checking in"
        },
        "reframe": {
          "label": "Find out where the executives in trouble went"
        },
        "c25_chatroom_evidence_turn": {
          "label": "Bring out KD Capital’s board minutes from before the vote"
        }
      },
      "place": "Seoul Station · KTX Platform",
      "clock": "April 8 · Wednesday 21:00",
      "question": "The six-person group chat’s name is split 3 to 3, and the last vote has come to you. What do you choose?",
      "lead": "To see off Ban Jaewook as he leaves for the first stop of his regional rotation, the scattered six gather on the Seoul Station platform."
    },
    "c25_final": {
      "title": "The Window Seat",
      "text": "In the 1st-floor lobby of KD Capital headquarters, 20 potted cherry trees stand in a row behind the inauguration stage. Yoon Sanghyuk takes the podium and speaks for 4 minutes. 'Those who know risk should be the ones to take charge of it.' The applause comes twice. Stepping down from the podium, he walks along the receiving line and stops in front of you. The man who didn’t come to the 33rd floor two weeks ago is the first to hold out his hand this time. 'Do you like the window seat? I need someone like you beside me so I’m wrong less often.' Again there is no word about the signature field. He lowers his voice. 'Monday morning, eight o’clock, come up to the 20th floor. The first item on the agenda is Pyeongtaek.' He moves on to the next person. In your pocket, your phone buzzes nonstop with the six-person group chat.",
      "memo": [
        "KD Capital CEO inauguration -- 4-minute speech, applause twice",
        "Yoon Sanghyuk: 'I need someone like you beside me so I’m wrong less often'",
        "Monday 08:00, 20th floor -- first agenda item: Pyeongtaek",
        "Group chat: 47 unread messages"
      ],
      "choices": {
        "c25_final_refuse": {
          "label": "Refuse the post under the CEO and file a personnel objection"
        },
        "c25_final_enter": {
          "label": "Go in under Yoon Sanghyuk; watch from Monday’s first item"
        },
        "c25_final_share": {
          "label": "Go in, but share what you see on the 20th floor daily in the chat"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Capital Headquarters · 1st-Floor Lobby, Inauguration Hall",
      "clock": "April 10 · Friday 10:00 · Cherry Blossoms",
      "question": "The man who didn’t come now holds out his hand and asks you to stay by his side. How do you take that seat?",
      "lead": "Friday morning, the whole Risk Management Department goes down to the 1st-floor lobby to fill the seats at the inauguration. The owner of the window seat stands in that line too."
    },
    "c25_aftershock": {
      "title": "Week 1 on the Job",
      "text": "Friday, 11 at night: the cherry blossoms along Yunjung-ro fall like snow. A week after scattering, the six walk in a single line again. Ban Jaewook follows along on a video call from Gunsan. Han Seoyun adds small print next to the name of the group chat the six made this week. 'Week 1 on the job.' When Oh Jinwoo posts 'Bridge first-week lunch showdown: 3 wins in 4,' Kwon Dohyun, walking behind, answers over his shoulder at once. 'That 1 loss is me. I paid for the meal, so in real terms I won.' While everyone laughs, an email arrives in your inbox from Chae Ian, head of your new department. The subject: 'Pyeongtaek site -- 1 person on a tower crane.' The body is two lines. 'This is the CEO’s first agenda item Monday morning. I thought you should see it before then.'",
      "memo": [
        "Yunjung-ro cherry blossoms -- past their peak, falling",
        "Group chat: 'Week 1 on the job'",
        "Oh Jinwoo’s lunch showdowns: 3 wins in 4, the 1 loss Kwon Dohyun",
        "Email from Chae Ian: Pyeongtaek site, 1 person on a tower crane"
      ],
      "choices": {
        "c25_after_record": {
          "label": "Bind the first week of the six scattered posts into one document"
        },
        "c25_after_rush": {
          "label": "Open the email and drive straight to the Pyeongtaek site tonight"
        },
        "c25_after_warm": {
          "label": "Walk the blossom road to the end, all six; Monday can wait"
        }
      },
      "place": "Yunjung-ro, Yeouido · Alley of Falling Cherry Blossoms",
      "clock": "April 10 · Friday 23:10 · Cherry Blossoms",
      "question": "On the night the first scattered week ends, the email about the Pyeongtaek site has arrived. How do you close this night?"
    },
    "c25_photo": {
      "title": "The Last Group Photo",
      "text": "Before the truck doors close, Moon Hajun sets up a tripod. He tagged along on the rice cake delivery and ended up as the photographer. 'Last group photo. Stand so the Trigger Lab sign shows.' When Kang Taemin stands at the back he blocks the sign, and when he’s seated in the front row, Kwon Dohyun disappears behind him entirely. Kwon Dohyun goes up on tiptoe: 'I’ve always been the one behind the ledger.' One spot in the middle of the front row is empty. Han Seoyun hasn’t come. Moon Hajun is about to press the timer and stops. 'Should we leave the Lab Director’s spot empty? Or should I draw her in later?' A single petal lands on the lens.",
      "memo": [
        "Last group photo -- tripod, 10-second timer",
        "Empty spot, middle of the front row: Han Seoyun",
        "Photographer: Moon Hajun (came along on the rice cake delivery)"
      ],
      "choices": {
        "c25_photo_choice_2": {
          "label": "Write the date and everyone’s new post on the photo as a record"
        },
        "c25_photo_choice_1": {
          "label": "Leave Han Seoyun’s spot empty and take the photo to her"
        },
        "c25_photo_choice_3": {
          "label": "No empty spot; shoot whoever’s here and send the truck off"
        }
      },
      "place": "In Front of the Trigger Lab Building · Alley Under the Cherry Trees",
      "clock": "April 1 · Wednesday 11:30 · Cherry Blossoms",
      "question": "The middle of the front row in the last group photo is empty. What do you do with that empty spot?"
    },
    "c25_lunchbox": {
      "title": "Cherry Blossom Lunch Boxes",
      "text": "Tuesday lunch: at Do Yoonha’s suggestion, you spread a mat under the cherry trees on Yunjung-ro. Farewell lunch boxes. Do Yoonha brings six rolls of gimbap, Na Junhyuk rice balls stamped into the shape of a seal, brought up from Yeongdong, and Kang Taemin pours thermos water into cup noodles. 'Cherry blossoms call for cup noodles.' Kwon Dohyun, working out the cost for 1 person, blurts out, 'At this price we’re in the black,' and everyone applauds his second time in the black. Just then Han Seoyun appears carrying a cloth bundle: fried tofu rice pockets, made during the one-hour lunch break she gets in the standby room. 'When there’s nothing to do, your hands get busy.' Do Yoonha laughs, then goes quiet. 'Starting next week, we won’t have an excuse to get together like this.'",
      "memo": [
        "Farewell lunch boxes -- 6 rolls of gimbap, seal-shaped rice balls, cup noodles, fried tofu rice pockets",
        "Kwon Dohyun’s second 'in the black' declaration",
        "Next gathering: not set"
      ],
      "choices": {
        "c25_lunchbox_choice_2": {
          "label": "At each gathering, everyone brings a page of what they saw"
        },
        "c25_lunchbox_choice_1": {
          "label": "No excuse? Make one: promise lunch every Tuesday"
        },
        "c25_lunchbox_choice_3": {
          "label": "Just photos today; everyone settles into their new post"
        }
      },
      "place": "Yunjung-ro, Yeouido · Alley Under the Cherry Trees",
      "clock": "April 7 · Tuesday 12:00 · Cherry Blossoms at Peak",
      "question": "Do Yoonha says that from next week there’s no excuse to get together. What excuse do you make?"
    },
    "c25_firstday": {
      "title": "Those Who Look Out the Window",
      "text": "Thursday, your first day at KD Capital’s Risk Management Department. Department Head Chae Ian shows you to a window seat. Outside, cherry trees stand in a row. 'The CEO picked this seat himself. People who come here fall into two kinds. Those who look out the window and those who look at the monitor.' Chae Ian sets a thick file down on the desk: a list of real-estate project financing (PF) loans. At the top, in the status field for an officetel (live-work studio) project in Pyeongtaek, someone has written 'halted' in pencil. 'The work of this department isn’t reducing risk. It’s deciding whose name the risk gets written under. Spend the first week looking out the window. From the second week on, you won’t be able to.'",
      "memo": [
        "KD Capital Risk Management -- window seat, designated by the CEO",
        "Top of the real-estate PF list: Pyeongtaek officetel, status 'halted'",
        "Chae Ian: 'From the second week on, you won’t be able to'"
      ],
      "choices": {
        "c25_firstday_choice_3": {
          "label": "Watch the window the first week as told; quietly learn the seat"
        },
        "c25_firstday_choice_2": {
          "label": "Ask first for the documents behind the field marked halted"
        },
        "c25_firstday_choice_1": {
          "label": "First check, by name, who is waiting at the Pyeongtaek site"
        }
      },
      "place": "KD Capital Headquarters, 12th Floor · Risk Management Conference Room",
      "clock": "April 9 · Thursday 09:00 · Cherry Blossoms",
      "question": "On your first day, the file on the halted Pyeongtaek project lands on your desk. What do you look at first?"
    },
    "c25_photo_reaction": {
      "title": "A Rival on the Same Floor",
      "text": "Once the truck leaves, Kwon Dohyun takes out a wad of receipts. Moving truck fare 420,000 won, ladder truck 80,000 won, Kang Taemin’s arm strength 'no field to price it.' Then he stops at one line of the notice. Oh Jinwoo, Bridge Bank Corporate Banking Department. The cubicle right next to his own. 'Same floor from Monday. He’ll claim a win every lunch.' When Oh Jinwoo answers, 'Starting with lunch today,' Kwon Dohyun taps at his calculator. As the laughter dies down, he quietly adds, 'Bridge is looking into a bundle of KD Capital’s bad loans. The seat Oh Jinwoo is taking is that exact job.'",
      "memo": [
        "Oh Jinwoo’s new post: Bridge Bank Corporate Banking, next to Kwon Dohyun",
        "Under Bridge review: a bundle of KD Capital bad loans"
      ],
      "choices": {
        "c25_photo_reaction_choice_2": {
          "label": "File the Bridge–KD Capital deal as a conflict of interest"
        },
        "c25_photo_reaction_choice_1": {
          "label": "Offer to look into it together so Oh Jinwoo isn’t alone"
        },
        "c25_photo_reaction_choice_3": {
          "label": "Ask Oh Jinwoo for Bridge’s information and get it early"
        }
      },
      "place": "In Front of the Trigger Lab Building · Alley After the Truck Leaves",
      "clock": "April 1 · Wednesday 12:10",
      "question": "Oh Jinwoo’s new post is on the side looking to buy KD Capital’s bad loans. What do you do?"
    },
    "c25_lunchbox_reaction": {
      "title": "A Folder With Only a New Name",
      "text": "As the mat is being folded, Lee Minseo comes over beside you. She started at KD Data Lab yesterday. The photo on her new access badge is the same one from her Trigger Lab employee ID. 'On the server next to my desk there’s a Trigger Lab folder. Only the name has changed. Now it’s a supplementary performance-review metrics folder.' She puts a tofu rice pocket in her mouth and chews for a long time. 'And there’s one outside account that opens that folder every Monday before dawn. It’s not anyone from our group.'",
      "memo": [
        "KD Data Lab server -- Trigger Lab folder, only renamed",
        "Outside account logs in every Monday before dawn"
      ],
      "choices": {
        "c25_lunchbox_reaction_choice_1": {
          "label": "Tell Lee Minseo not to touch that folder, for her safety"
        },
        "c25_lunchbox_reaction_choice_2": {
          "label": "Formally request that the outside account’s access logs be kept"
        },
        "c25_lunchbox_reaction_choice_3": {
          "label": "Ask her to find out tonight who the outside account is"
        }
      },
      "place": "Yunjung-ro, Yeouido · Alley Where the Mat Is Folded",
      "clock": "April 7 · Tuesday 12:50 · Cherry Blossoms",
      "question": "Lee Minseo says an outside account opens the Trigger Lab folder every week. What do you ask Lee Minseo to do?"
    },
    "c25_firstday_reaction": {
      "title": "The Second Line",
      "text": "At 11 at night, Ban Jaewook sends a photo from his lodging in Gunsan. It is the statement of reasons for this round of transfer orders, with the reason that was blank in the notice filled in. For all six on the list, the reason is the same single line. 'Reassignment following the organization’s dissolution.' But only your statement has a second line. 'Requesting department: Office of the CEO, KD Capital.' Ban Jaewook keeps texting. 'The other five were scattered. You were summoned.' After a long while, one more line comes. 'And across from my lodging, on the glass door of Saebom Credit Union in Gunsan, the notice offering higher deposit interest has been replaced twice just this week. I don’t know why yet.'",
      "memo": [
        "Second line of your statement: requesting department, Office of the CEO, KD Capital",
        "Saebom Credit Union in Gunsan, deposit-rate notice replaced twice in a week -- reason unknown"
      ],
      "choices": {
        "c25_firstday_reaction_choice_1": {
          "label": "Until you know why you were summoned, don’t burden the five"
        },
        "c25_firstday_reaction_choice_2": {
          "label": "Ask that the statement with the second line be kept as the original"
        },
        "c25_firstday_reaction_choice_3": {
          "label": "Ask Ban Jaewook to look into the Saebom notice right away"
        }
      },
      "place": "Gunsan · Internal Audit Lodging",
      "clock": "April 9 · Thursday 23:00",
      "question": "Of the six on the list, only your statement names a requesting department. What do you do with that second line?"
    },
    "c25_branch_boxes": {
      "title": "Moving Boxes on the 33rd Floor",
      "text": "On your way out of the 7th floor, the elevator stops at 33. When the doors open, four movers are packing up Yoon Sanghyuk’s office. Every box gets an 'Office of the CEO, KD Capital' label, and at the end of the hall stand seven gray sacks from a shredding company. Baek Arin sits perched on her own box, watching. 'I handed in my resignation on Friday. They say it’ll be accepted in 2 weeks.' She nods her chin toward one of the gray sacks. 'Those sacks go out at seven this evening. In all my time here, no one has ever made a list of Group Strategy Office documents before they went out to be shredded.'",
      "memo": [
        "Moving boxes from Yoon Sanghyuk’s office -- label 'Office of the CEO, KD Capital'",
        "7 shredding sacks, out at 19:00 today",
        "Baek Arin’s resignation submitted, 2 weeks until accepted",
        "Removal list before shredding: none"
      ],
      "choices": {
        "c25_branch_boxes_b": {
          "label": "Request a removal list before the shredding sacks go out"
        },
        "c25_branch_boxes_c": {
          "label": "Casually ask the movers if you can open a sack"
        },
        "c25_branch_boxes_a": {
          "label": "Stay by Baek Arin and first hear what she’s afraid of"
        }
      },
      "place": "KD Financial Group Headquarters, 33rd Floor · Group Strategy Office Hallway",
      "clock": "April 6 · Monday 17:00",
      "question": "The shredding sacks from Yoon Sanghyuk’s office go out this evening with no list. What do you do?"
    },
    "c25_branch_boxes_follow": {
      "title": "The Email That Came Four Days Early",
      "text": "Baek Arin opens an email on her phone: notice that Yoon Sanghyuk has been named CEO-designate of KD Capital. The send date is March 16, four days ahead of the shareholders’ meeting. However the vote turned out, the post had already been decided. At the very bottom of the email is one more line. 'Risk Management Department: 1 additional hire, designated by the CEO.' Baek Arin lowers her phone. 'You were on his list before the dissolution notice. Not on the side being cleared out, but on the side being taken along. Isn’t that scarier?'",
      "memo": [
        "Email notifying the CEO designation -- sent March 16",
        "Four days before the shareholders’ meeting",
        "Last line of the email: Risk Management, 1 additional hire, designated by the CEO",
        "Baek Arin: 'On the side being taken along'"
      ],
      "choices": {
        "c25_branch_boxes_follow_a": {
          "label": "Keep Baek Arin’s name out until you know why you’re taken"
        },
        "c25_branch_boxes_follow_c": {
          "label": "If the post is bait, take it first and see what’s inside"
        },
        "c25_branch_boxes_follow_b": {
          "label": "Secure the designation email sent March 16 as a document"
        }
      },
      "place": "KD Financial Group Headquarters, 33rd Floor · Baek Arin’s Desk",
      "clock": "April 6 · Monday 17:40",
      "question": "Your post was decided before the shareholder vote. How do you handle that email?"
    },
    "c25_route_system": {
      "title": "Promotion Statistics",
      "text": "Setting aside talk of your new post, you look for where the executives in trouble went afterward. NOAH answers on the group work app. Since the Trigger Lab terminal went dark, it is the only calculator left on your account. 4,212 personnel notices from the past 10 years of KD Financial Group open up. Of 17 executives named in an audit or a parliamentary audit, 14 moved within three months to head another company in the group. All 14 notices called it a promotion, and every reason field is empty. 'The decision to move is recorded; the reason for the move is not. This format has learned to treat it as protection, not punishment.'",
      "memo": [
        "4,212 personnel notices from the last 10 years",
        "14 of 17 executives in trouble became heads of other companies within three months",
        "All 14 'promotions,' reason fields empty"
      ],
      "choices": {
        "c25_route_system_publish": {
          "label": "Line up the 14 promotion notices; share them with colleagues"
        },
        "c25_route_system_keep": {
          "label": "Hold the statistics and first bring them out before Yoon Sanghyuk"
        },
        "c25_route_system_file": {
          "label": "Formally ask the Audit Committee about notices with blank reasons"
        },
        "c25_route_system_evidence_turn": {
          "label": "Bring out KD Capital’s board minutes from before the vote"
        }
      },
      "place": "KD Capital Headquarters · Group Work App",
      "clock": "Early April",
      "question": "All fourteen executives in trouble were promoted, and the reason fields are empty. How do you use these statistics?"
    },
    "c25_final_system_route": {
      "title": "Promotions With Blank Reason Fields",
      "text": "Before dawn on Thursday, 14 notices of moves to head other companies scroll down the group work app screen. The companies they moved to all have different names, and the reason fields are uniformly white. The 15th is Yoon Sanghyuk’s notice, posted last Wednesday morning. The inauguration is tomorrow at ten. NOAH’s annotation is attached at the very bottom. 'There are no wrong letters in these notices. There are only missing ones. Missing letters are not within the scope of my verification.'",
      "memo": [
        "Promotion notices for 14 executives in trouble -- 0 with reasons stated",
        "Notice of Yoon Sanghyuk’s appointment as CEO of KD Capital: April 1",
        "Inauguration: Friday 10:00"
      ],
      "choices": {
        "c25_final_system_route_b": {
          "label": "Leave the rules; just secure colleagues’ terms at new posts"
        },
        "c25_final_system_route_c": {
          "label": "First gather stories of staff who went under promoted executives"
        },
        "c25_final_system_route_a": {
          "label": "Propose a rule that every executive move states its reason"
        }
      },
      "place": "KD Capital Headquarters · Group Work App",
      "clock": "April 9 · Thursday Before Dawn",
      "question": "Fifteen notices with no wrong letters, only missing ones. What do you make them write in the missing space?"
    },
    "c25_evidence_turn": {
      "title": "The March 16 Board Meeting",
      "text": "When you lay the clue’s date over the board calendar, the minutes of KD Capital’s board of directors open. The date: March 16. Item 1, 'Designation of new CEO'; Item 2, 'Risk Management Department staffing: 1 hire, designated by the CEO.' Both passed unanimously, and at the top of the list of votes in favor, two directors representing the group’s largest shareholder, Kingsdale Partners of New York, signed on by video. In the subject field for Item 2 is your employee ID. Four days later came the group’s shareholders’ meeting. Ban Jaewook, out on regional rotation, writes down the two dates over the phone. 'However the vote turned out, the posts were decided first. Yours included. When they moved one man, they decided at the same time who would stand beside him.'",
      "memo": [
        "KD Capital board minutes -- March 16",
        "Subject of Item 2: your employee ID",
        "Group shareholders’ meeting four days later"
      ],
      "choices": {
        "c25_evidence_turn_attach": {
          "label": "Attach the minutes to a personnel objection to the Audit Committee"
        },
        "c25_evidence_turn_hold": {
          "label": "Take the minutes in; first bring them out on the 20th floor"
        },
        "c25_evidence_turn_share": {
          "label": "Show the five the minutes before knowing why you were chosen"
        }
      },
      "place": "KD Capital Headquarters · Board Document System",
      "clock": "April 10 · Friday 07:00",
      "question": "Four days before the shareholder vote, the board had already settled on your employee ID. How do you use these minutes?"
    },
    "c25_start_warm": {
      "title": "The Empty Office at Four in the Morning",
      "text": "On the dark 4th floor, none of the 19 went down the stairs first in the end. Kang Taemin made cup noodles twice. Do Yoonha holds two cups of cold coffee and says, 'Let’s go now. Together.' The headquarters entrance opens only for your card. You leave five colleagues in the first-floor lobby and go up to the 33rd floor alone. Only half the lights are on in the Group Strategy Office, and only Baek Arin, packing up, remains. Yoon Sanghyuk’s office is empty, its door open. On the desk lies only a single printout of a personnel notice dated April 1. Yoon Sanghyuk, CEO of KD Capital, and at the very end of the transfer order list, your name. 'KD Capital Risk Management Department, reporting directly to the CEO.' Do Yoonha, in the lobby, asks over the phone, 'Is he there?' When you say no, he says after a long pause, 'While we waited all night, he’d already left.'",
      "memo": [
        "Arrived at the 33rd floor 04:20 -- two taxis, five colleagues in the lobby",
        "Yoon Sanghyuk’s office: door open, nobody there",
        "Printout on the desk: personnel notice dated April 1"
      ],
      "choices": {
        "c25_start_warm_call": {
          "label": "Use the printout to warn listed colleagues before the notice"
        },
        "c25_start_warm_seat": {
          "label": "Take the printout and plan your move before the notice"
        },
        "c25_start_warm_log": {
          "label": "Record the empty office and printout, confirmed by Baek Arin"
        },
        "c25_start_warm_signature": {
          "label": "Show the five in the lobby the empty office and stay by them"
        },
        "c25_start_warm_reframe": {
          "label": "Find out where the executives in trouble went"
        }
      },
      "place": "KD Financial Group Headquarters, 33rd Floor · Group Strategy Office",
      "clock": "March 28 · Saturday Before Dawn 04:20",
      "question": "You left the colleagues who waited all night in the lobby and stand before the empty office. How do you end this dawn?",
      "lead": "The six who stayed up all night on the dark 4th floor cross the river in two taxis before sunrise."
    },
    "c25_start_record": {
      "title": "Where the Request Arrived",
      "text": "The request to unseal was received on Friday at 17:58. 2 minutes before the dissolution, a document asking that every Trigger Lab participant’s records be returned to them. It is addressed to the Group Strategy Office, so at 10:50 at night you go up to the 33rd floor with the receipt slip. In the half-lit Group Strategy Office, Baek Arin is packing boxes alone, and Yoon Sanghyuk’s office is empty. On the first page of the printed request on the desk is a new processing mark. 'Transfer: Office of the CEO, KD Capital.' Beside it is a printout of a personnel notice dated April 1. Yoon Sanghyuk, CEO of KD Capital. At the very end of the transfer order list, your name. 'KD Capital Risk Management Department, reporting directly to the CEO.' A text comes from Lee Minseo. 'The intake lookup shows the request has moved. It’s following him. This time there’s a name in the recipient field.'",
      "memo": [
        "Unsealing request received 17:58 -- 2 minutes before the dissolution",
        "Processing mark on the first page: handed over to the Office of the CEO, KD Capital",
        "Printout on the desk: personnel notice dated April 1"
      ],
      "choices": {
        "c25_start_record_call": {
          "label": "Use the printout to warn listed colleagues before the notice"
        },
        "c25_start_record_log": {
          "label": "Record the empty office and printout, confirmed by Baek Arin"
        },
        "c25_start_record_signature": {
          "label": "Photograph the transfer-marked request and send it to all"
        },
        "c25_start_record_seat": {
          "label": "Take the printout and plan your move before the notice"
        },
        "c25_start_record_reframe": {
          "label": "Find out where the executives in trouble went"
        }
      },
      "place": "KD Financial Group Headquarters, 33rd Floor · Group Strategy Office",
      "clock": "March 27 · Friday 22:50",
      "question": "Your request followed Yoon Sanghyuk over to the new company. What do you do about that transfer mark?",
      "lead": "Following the address on the request received 2 minutes before the dissolution, you go up to the 33rd floor with the receipt slip."
    },
    "c25_start_rush": {
      "title": "The Empty Office at 18:26",
      "text": "26 minutes after the lights go out, you step out of a taxi and go up to the 33rd floor of headquarters in Yeouido. Your access really was still alive. All the lights in the Group Strategy Office are on, and Yoon Sanghyuk’s door is open too, but the office is empty. The teacup on the desk is still warm. Baek Arin, packing a box, stands up. 'He went down at 18:00. By the freight elevator. He sent the text on his way down.' While you stood on Yanghwa Bridge, his car pulled out of the headquarters parking lot. In the middle of the desk lies a printout of a personnel notice dated April 1. Yoon Sanghyuk, CEO of KD Capital. At the very end of the transfer order list, your name. 'KD Capital Risk Management Department, reporting directly to the CEO.' Baek Arin smiles bitterly. 'He told you to come up, then went down first. On this floor, we call that an invitation.'",
      "memo": [
        "Arrived at the 33rd floor 18:26 -- taxi, access still active",
        "Teacup still warm, freight elevator going down",
        "Printout on the desk: personnel notice dated April 1"
      ],
      "choices": {
        "c25_start_rush_signature": {
          "label": "Get the freight elevator logs from the security office"
        },
        "c25_start_rush_call": {
          "label": "Use the printout to warn listed colleagues before the notice"
        },
        "c25_start_rush_log": {
          "label": "Record the empty office and printout, confirmed by Baek Arin"
        },
        "c25_start_rush_seat": {
          "label": "Take the printout and plan your move before the notice"
        },
        "c25_start_rush_reframe": {
          "label": "Find out where the executives in trouble went"
        }
      },
      "place": "KD Financial Group Headquarters, 33rd Floor · Group Strategy Office",
      "clock": "March 27 · Friday 18:26",
      "question": "The man who told you to come up passed you on his way down. How do you prove you crossed paths?",
      "lead": "The taxi you caught the moment the lights went out reached Yeouido, and the button for 33 was still lit. On the floor where the doors open, there is only a teacup still warm."
    }
  },
  "echoReplies": {
    "c25_start_call": "You warn them, and replies come back within an hour. Only Han Seoyun’s is a single line: 'I knew.'",
    "c25_start_log": "You put it on record, and Baek Arin e-signs the confirmation field with her employee ID. The signature of someone who has resigned is the last signature this floor receives.",
    "c25_start_seat": "You plan ahead, and Wednesday morning’s notice doesn’t surprise you. You’re the only one not surprised, so your face doesn’t match your colleagues’.",
    "c25_notice_call": "You call, and Han Seoyun picks up on the third ring. 'What about the boxes?' 'Kang Taemin carried them.' She laughs for the first time.",
    "c25_notice_ask": "The demand for an explanation is received. The response deadline field comes back reading 'at the end of the standby period.'",
    "c25_notice_load": "The truck is full before noon. One of Han Seoyun’s boxes is loaded, ownerless, at the very back of the cargo bed.",
    "c25_standby_sit": "Filling them together, you finish the 10 pages at four in the afternoon. The last page is titled 'Who Do We Return the Records to Next Time?'",
    "c25_standby_rule": "You demand it in writing, and HR sends back 'undetermined' in the standby period field. Once even undetermined becomes a document, it gets a date.",
    "c25_standby_leave": "Leaving quickly, you both draw less attention. Han Seoyun never manages to fill the first page of her plan that day.",
    "c25_chatroom_tuesday": "As a check-in room, its first message is a photo of Do Yoonha’s gimbap. The second is Han Seoyun’s 'I have nothing to do today.'",
    "c25_chatroom_log": "As a record room, six lines pile up from the first day. Han Seoyun’s line is '7th floor, wall, 1 ballpoint pen.'",
    "c25_chatroom_toast": "The moment Kang Taemin is invited, he posts 'Clocked in.' Ban Jaewook laughs out loud on the train, then apologizes to the passenger beside him.",
    "c25_final_share": "Going in but sharing, the 20th floor’s work spreads to six people every night. Whether that group chat will someday be evidence or a burden, no one knows yet.",
    "c25_final_refuse": "The objection is received. The transfer stands until a decision is made, so on Monday your seat is still by the window on the 12th floor. HR wipes down one of the desks facing the wall on the 7th floor in advance.",
    "c25_final_enter": "Beside him, you see the most. Yoon Sanghyuk also watches you from closest of all.",
    "c25_after_warm": "The six walk to the end, and the blossom road is shorter than you thought. The Pyeongtaek email waits unread until Monday morning.",
    "c25_after_record": "Bound into one document, the six scattered posts become a single map. At the center of that map is Pyeongtaek.",
    "c25_after_rush": "You go straight there and reach the site at two in the morning. The light atop the tower crane sees your headlights first.",
    "c25_photo_choice_1": "The photo with the empty spot looks strangely full. After a long while, Han Seoyun, who got the photo, sends two words: 'Thank you.'",
    "c25_photo_choice_2": "With the date and posts written on, the photo becomes a roster. Whose hands this roster will be in 1 year from now, no one knows.",
    "c25_photo_choice_3": "The photo is taken quickly. The only one who notices the middle of the front row looks a little cramped is Moon Hajun.",
    "c25_lunchbox_choice_1": "Tuesday lunch becomes a promise. Kwon Dohyun worries, 'Weekly means 52 times a year. I’m not sure we’ll stay in the black.'",
    "c25_lunchbox_choice_2": "Once everyone agrees to bring a page, the lunch boxes turn into a meeting. Do Yoonha says he’ll still bring gimbap.",
    "c25_lunchbox_choice_3": "Everyone settles in on their own, and next Tuesday passes quietly. Han Seoyun’s fried tofu rice pocket container stays in Do Yoonha’s bag, never returned.",
    "c25_firstday_choice_1": "When you ask for the list, Chae Ian pulls a pencil from behind one ear. '212 households signed for units. The workers, no one has counted yet.'",
    "c25_firstday_choice_2": "The supporting documents arrive three days later. On every one, the field for who made the decision was written in pencil and then erased.",
    "c25_firstday_choice_3": "In a week the cherry trees outside the window are in leaf. In the meantime, the Pyeongtaek file is never once opened on your desk.",
    "c25_photo_reaction_choice_1": "When you offer to look together, Oh Jinwoo for the first time says 'Thank you' instead of talking about winning. Kwon Dohyun can’t put that moment on the bill.",
    "c25_photo_reaction_choice_2": "The report is received. On his first day, Oh Jinwoo gets two more pledge forms from HR.",
    "c25_photo_reaction_choice_3": "The information comes fast. From his first week in the new post, Oh Jinwoo ends up standing between two companies.",
    "c25_lunchbox_reaction_choice_1": "When you tell her not to touch it, Lee Minseo nods. The Monday pre-dawn logins continue the following week too.",
    "c25_lunchbox_reaction_choice_2": "The request is received, and KD Data Lab’s security team hears of it first. Lee Minseo’s seat gets a little uncomfortable.",
    "c25_lunchbox_reaction_choice_3": "That night Lee Minseo finds the first three characters of the account name. And the next morning her access badge stops working once.",
    "c25_firstday_reaction_choice_1": "With no burden placed on them, the group chat stays light. You face Monday carrying the second line alone.",
    "c25_firstday_reaction_choice_2": "The preservation request is accepted. A copy of the request also lands on the desk of your new department head.",
    "c25_firstday_reaction_choice_3": "The next morning Ban Jaewook takes a number ticket at a Saebom Credit Union window. That window isn’t on the Internal Audit rotation schedule.",
    "c25_branch_boxes_a": "When you stay, Baek Arin looks for a long time at her own employee ID instead of the shredding sacks. 'On this floor, I only ever made good stories.'",
    "c25_branch_boxes_b": "You request a list, and the seven o’clock removal is pushed back to nine. In those two hours, the seven sacks get numbers.",
    "c25_branch_boxes_c": "The mover shrugs. The sack opens, but the camera at the end of the hall sees it happen.",
    "c25_branch_boxes_follow_a": "With her name kept out, Baek Arin quietly gets through the 2 weeks. Every question about the email’s source comes to you.",
    "c25_branch_boxes_follow_b": "Secured as a document, the date doesn’t move. Instead, a line of access log is left in Baek Arin’s mailbox.",
    "c25_branch_boxes_follow_c": "You take the bait, and you see inside. At the same time, you become part of it too.",
    "c25_route_system_publish": "When you share, your colleagues reopen their own transfer notices. All six lines on the list have empty reason fields.",
    "c25_route_system_file": "The inquiry is received. Two of the three Audit Committee members are university classmates of promoted executives.",
    "c25_route_system_keep": "Held back, it becomes a strong card in the Office of the CEO on the 20th floor. Meanwhile, the 14th notice waits for the 15th.",
    "c25_final_system_route_a": "With the rule in place, the next promotion notice carries one line of reason. Yoon Sanghyuk’s notice never gets one.",
    "c25_final_system_route_b": "Your colleagues’ terms at their new posts improve. The reason fields stay empty.",
    "c25_final_system_route_c": "You gather them, and the same story comes from 14 companies. 'In the first month after the CEO changed, our team disappeared.'",
    "c25_evidence_turn_attach": "Attached, the objection speaks in dates. The Audit Committee sets its response deadline a month out.",
    "c25_evidence_turn_hold": "Taking them in, you have a card to play first in the Office of the CEO on the 20th floor. Holding that card, you may still be asked to sign the new CEO’s first agenda item.",
    "c25_evidence_turn_share": "When you show them, your five colleagues see your employee ID. Oh Jinwoo speaks first. 'If they took you, we just go and get you back.'",
    "c25_notice_evidence_turn": "Match the dates and a document written before the notice appears. Your employee ID is in it too.",
    "c25_standby_evidence_turn": "Match the dates and a document written before the notice appears. Your employee ID is in it too.",
    "c25_chatroom_evidence_turn": "Match the dates and a document written before the notice appears. Your employee ID is in it too.",
    "c25_route_system_evidence_turn": "Match the dates and a document written before the notice appears. Your employee ID is in it too.",
    "case25_memory_system": "The same field is empty in the promotion notices too. NOAH finds 14 more notices with blank reason fields.",
    "case25_memory_evidence": "Set the receipt log’s date against the board calendar and one meeting was held before the vote. It had two items, and the second carries an employee ID.",
    "c25_start_warm_call": "You send the photos, and the five in the lobby put their heads together over one screen. Only Han Seoyun says, 'I knew.'",
    "c25_start_warm_log": "You put it on record, and Baek Arin e-signs the confirmation field with her employee ID. The signature of someone who has resigned is the last signature this floor receives.",
    "c25_start_warm_seat": "You plan ahead, and Wednesday morning’s notice doesn’t surprise you. You’re the only one not surprised, so your face doesn’t match your colleagues’.",
    "c25_start_warm_signature": "Those who saw the empty office together share the anger. Around sunrise, Han Seoyun brings six coffees from the lobby vending machine.",
    "c25_start_record_call": "You warn them, and replies come back within an hour. Only Han Seoyun’s is a single line: 'I knew.'",
    "c25_start_record_log": "You put it on record, and Baek Arin e-signs the confirmation field with her employee ID. The signature of someone who has resigned is the last signature this floor receives.",
    "c25_start_record_seat": "You plan ahead, and Wednesday morning’s notice doesn’t surprise you. You’re the only one not surprised, so your face doesn’t match your colleagues’.",
    "c25_start_record_signature": "The photo stays on six phones. On Monday morning, the request’s electronic original is moved to a document box on KD Capital’s 20th floor.",
    "c25_start_rush_call": "You warn them, and replies come back within an hour. Only Han Seoyun’s is a single line: 'I knew.'",
    "c25_start_rush_log": "You put it on record, and Baek Arin e-signs the confirmation field with her employee ID. The signature of someone who has resigned is the last signature this floor receives.",
    "c25_start_rush_seat": "You plan ahead, and Wednesday morning’s notice doesn’t surprise you. You’re the only one not surprised, so your face doesn’t match your colleagues’.",
    "c25_start_rush_signature": "The log shows the freight elevator going down at 18:01. 1 minute earlier than the text was sent."
  },
  "choiceVoiceLines": {
    "c25_start_call": "Saying they can’t learn of the new list from a notice, you photograph the printout and warn the colleagues on it before the notice goes out.",
    "c25_start_log": "So what you saw tonight isn’t left as mere words, you put the empty office and the printout on record, confirmed by Baek Arin.",
    "c25_start_seat": "Saying whoever sees first can move first, you take the printout and plan your move before the notice goes up.",
    "c25_notice_call": "Troubled by the one name with no department, you call Han Seoyun before the boxes and tell her you’ll be by her side.",
    "c25_notice_ask": "Saying you can’t accept a personnel decision without a single word, you demand HR’s official explanation for a standby assignment with no reason.",
    "c25_notice_load": "Saying the truck won’t wait while you argue, you leave the notice be and fill the truck by today first.",
    "c25_standby_sit": "Unable to leave her writing alone facing the wall, you sit at the next desk today and fill the 10 pages together.",
    "c25_standby_rule": "Saying standby with no end date is no different from punishment, you start the process to get its length and reason in writing.",
    "c25_standby_leave": "Saying that lingering in a room with no nameplate makes you both targets, you just say a quick hello and leave.",
    "c25_chatroom_tuesday": "Saying whether everyone is all right comes before work, you pick 'Tuesday Lunch' and keep it a room for checking in.",
    "c25_chatroom_log": "So the work carries on even from scattered posts, you pick '4th Floor' and make it a room where everyone writes down what they see each day, with the date.",
    "c25_chatroom_toast": "Taking the advice to make it a light one, you pick 'Let’s All Come In Tomorrow,' bring in Kang Taemin too, and end it with a laugh.",
    "c25_final_share": "Saying an eye that watches alone is easily tamed, you go in, but share what you see on the 20th floor in the group chat every day.",
    "c25_final_refuse": "Saying you won’t be used as the one who keeps him from being wrong, you refuse the post under the CEO and file a personnel objection.",
    "c25_final_enter": "Saying Pyeongtaek can only be seen from inside, you go in under Yoon Sanghyuk and watch from beside him, starting with Monday’s first agenda item.",
    "c25_after_warm": "Not wanting to give a night together after a week apart to a single email, you walk the blossom road to the end with all six and leave Monday for Monday.",
    "c25_after_record": "Saying these are things that will be forgotten if you just laugh them off, you bind what each of the six scattered posts saw in the first week into one document.",
    "c25_after_rush": "Saying the one person atop the tower crane can’t wait until Monday, you open the email and drive straight to the Pyeongtaek site that very night.",
    "c25_photo_choice_1": "Saying the one who couldn’t come is one of the people in this photo too, you leave Han Seoyun’s spot empty and take the photo to her.",
    "c25_photo_choice_2": "So that anyone can tell later who scattered where, you write the date and everyone’s new post on the photo as a record.",
    "c25_photo_choice_3": "Saying you can’t wait forever for someone who isn’t coming, you shoot right away with whoever’s here, no empty spot, and send the truck off.",
    "c25_lunchbox_choice_1": "Saying that if there’s no excuse to get together from next week you’ll make one, you promise lunch every Tuesday.",
    "c25_lunchbox_choice_2": "Saying the six scattered posts become six pairs of eyes, you agree that at each gathering everyone brings a page of what they saw.",
    "c25_lunchbox_choice_3": "Saying that standing out from the first week will make things hard for everyone, you suggest just taking photos today and each settling into the new post first.",
    "c25_firstday_choice_1": "Saying there are people behind the list in the file too, you first check, by name, who is waiting at the Pyeongtaek site.",
    "c25_firstday_choice_2": "Saying pencil alone doesn’t tell you who halted it, you ask first for the documents behind the field marked halted.",
    "c25_firstday_choice_3": "As Department Head Chae Ian said to look out the window the first week, you quietly learn the seat until you can read the table.",
    "c25_photo_reaction_choice_1": "So Oh Jinwoo doesn’t shoulder the bundle of KD Capital bad loans alone, you offer to look into that work together.",
    "c25_photo_reaction_choice_2": "Saying a line must be drawn before Oh Jinwoo takes that seat, you first file the deal between Bridge and KD Capital as a conflict of interest.",
    "c25_photo_reaction_choice_3": "Calling it a rare window into KD Capital, you ask Oh Jinwoo for Bridge’s information and get it early.",
    "c25_lunchbox_reaction_choice_1": "So that Lee Minseo, who has only just started, isn’t put in danger alone, you tell her not to touch that folder.",
    "c25_lunchbox_reaction_choice_2": "Saying that once the logs are erased no one can ask who opened it, you formally request that the outside account’s access logs be kept.",
    "c25_lunchbox_reaction_choice_3": "Before the next Monday dawn comes, you ask her to find out tonight who the outside account is.",
    "c25_firstday_reaction_choice_1": "Saying being scattered is burden enough for them, you put nothing on your five colleagues until you know why you were summoned.",
    "c25_firstday_reaction_choice_2": "So the one line that sets you apart doesn’t disappear later, you ask that the statement with the second line be kept in its original form.",
    "c25_firstday_reaction_choice_3": "The notice replaced twice in one week seems more urgent, so you ask Ban Jaewook to look right away into what is going on with the Saebom Credit Union notice.",
    "c25_branch_boxes_a": "Troubled more by the 2 weeks ahead of someone who has resigned than by the sacks, you stay by Baek Arin and first hear what she fears before she leaves.",
    "c25_branch_boxes_b": "Saying that after seven o’clock no one will even know what went missing, you request that a removal list be made before the shredding sacks go out.",
    "c25_branch_boxes_c": "Saying the sacks will go out before any list arrives, you casually ask the movers whether you can open one.",
    "c25_branch_boxes_follow_a": "Because the one who showed you the email could be hurt first, you keep Baek Arin’s name out of everything until you know why you’re being taken along.",
    "c25_branch_boxes_follow_b": "Saying the proof it was decided four days early is the date, you secure the designation email as a document, its March 16 send date intact.",
    "c25_branch_boxes_follow_c": "Because it’s a reason you’ll never learn from outside, you take the bait-like post first and look inside.",
    "c25_route_system_publish": "Saying these aren’t numbers to hold alone, you line up the 14 promotion notices and share them with colleagues first.",
    "c25_route_system_file": "Saying the reason for a move should be a record too, you formally ask the Audit Committee about personnel notices with blank reason fields.",
    "c25_route_system_keep": "So that the man being protected has to answer himself, you hold the statistics and bring them out for the first time before Yoon Sanghyuk.",
    "c25_final_system_route_a": "So the reason fields no longer stay white, you propose a rule that every time an executive moves, the reason is written in the notice.",
    "c25_final_system_route_b": "Saying the 15th notice is already up, you leave the rules alone and just secure your scattered colleagues’ terms at their new posts.",
    "c25_final_system_route_c": "Saying the people who followed know the letters missing from the notices, you first gather the stories of staff who moved under promoted executives.",
    "c25_evidence_turn_attach": "Saying a post decided before the vote must be challenged, you attach the minutes to a personnel objection and file it with the Audit Committee.",
    "c25_evidence_turn_hold": "Saying you have to ask the ones who decided it directly, you take the minutes in and bring them out for the first time on the 20th floor.",
    "c25_evidence_turn_share": "Saying that holding it alone makes you one of them, you show your five colleagues the minutes before knowing why you were designated.",
    "c25_notice_evidence_turn": "You write the clues’ dates one by one onto the promotion notice and work out when this post was decided.",
    "c25_standby_evidence_turn": "You write the clues’ dates one by one onto the promotion notice and work out when this post was decided.",
    "c25_chatroom_evidence_turn": "You write the clues’ dates one by one onto the promotion notice and work out when this post was decided.",
    "c25_route_system_evidence_turn": "You write the clues’ dates one by one onto the promotion notice and work out when this post was decided.",
    "c25_start_warm_call": "Saying the five in the lobby can’t learn of the new list from a notice, you photograph the printout and warn the colleagues on it before the notice goes out.",
    "c25_start_warm_log": "So what you saw tonight isn’t left as mere words, you put the empty office and the printout on record, confirmed by Baek Arin.",
    "c25_start_warm_seat": "Saying whoever sees first can move first, you take the printout and plan your move before the notice goes up.",
    "c25_start_warm_signature": "Saying a night crossed together should end together, you show the five who waited in the lobby the photos of the empty office and stay by them until morning.",
    "c25_start_record_call": "Saying they can’t learn of the new list from a notice, you photograph the printout and warn the colleagues on it before the notice goes out.",
    "c25_start_record_log": "So what you saw tonight isn’t left as mere words, you put the empty office and the printout on record, confirmed by Baek Arin.",
    "c25_start_record_seat": "Saying whoever sees first can move first, you take the printout and plan your move before the notice goes up.",
    "c25_start_record_signature": "Saying everyone needs to know where the request went, you photograph the transfer-marked printout of the request on the spot and send it to everyone.",
    "c25_start_rush_call": "Saying they can’t learn of the new list from a notice, you photograph the printout and warn the colleagues on it before the notice goes out.",
    "c25_start_rush_log": "So what you saw tonight isn’t left as mere words, you put the empty office and the printout on record, confirmed by Baek Arin.",
    "c25_start_rush_seat": "Saying whoever sees first can move first, you take the printout and plan your move before the notice goes up.",
    "c25_start_rush_signature": "So the claim that he went down before the text doesn’t remain mere words, you get the freight elevator logs from the security office."
  },
  "pack": {
    "clue": {
      "title": "The March 16 Designation",
      "text": "Yoon Sanghyuk’s post as CEO of KD Capital had already been decided by the board four days before the shareholders’ meeting. Item 2 at the same meeting was 1 additional hire for the Risk Management Department, designated by the CEO, and the subject field held your employee ID."
    },
    "outcomes": {
      "c25_after_warm": {
        "tag": "Walked to the End",
        "title": "All six walked the blossom road to the end together",
        "text": "At the end of the first scattered week, the six walked in a single line again. The email about the Pyeongtaek site waited unread until Monday morning."
      },
      "c25_after_record": {
        "tag": "Bound into a Map",
        "title": "The six scattered posts became a single map",
        "text": "Gangseo Branch, KD Data Lab, Gunsan, Bridge Bank, the 7th-floor standby room, and KD Capital’s 12th floor. When what each saw in the first week was bound into one document, Pyeongtaek lay at its center."
      },
      "c25_after_rush": {
        "tag": "Rushed Straight There",
        "title": "The night you opened the email, you drove to Pyeongtaek",
        "text": "Leaving your colleagues on the blossom road, you got on the expressway. At two in the morning, the light atop the tower crane saw you first."
      }
    },
    "continuityChallenges": {
      "c24_after_warm": {
        "title": "Stay by Those Who Waited All Night",
        "text": "With the colleagues who stayed up all night with you on the dark 4th floor, you crossed the river at dawn and saw the empty office on the 33rd floor. Trust survives only if you don’t leave those people alone in the first scattered week."
      },
      "c24_after_record": {
        "title": "Reread Where the Request Went",
        "text": "The request to return the records followed Yoon Sanghyuk over to the new company. On this new table, you decide what to do with the fact that the recipient field now has a name."
      },
      "c24_after_rush": {
        "title": "Put the Crossed Elevators on Record",
        "text": "On the 33rd floor you rushed up to, you crossed paths with the man who told you to come up. Turn that crossing not into your own private anger but into a record anyone can check, and fairness follows."
      }
    }
  }
}
