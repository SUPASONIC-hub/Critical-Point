/**
 * 사건 26 (src/nodes/case26.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c26_start": {
      "title": "The Author Field",
      "text": "The door of the CEO’s office on KD Capital’s 20th floor stands open. Three days after taking office, Yoon Sanghyuk already has papers piled on his desk. He slides the top file across. It is the real-estate project financing (PF) for 'Reheim Godeok,' a 22-story officetel in Godeok, Pyeongtaek—a loan made before a building goes up, on the strength of the sales money expected to come in. KD Capital lent 62 billion won from the front of the line, and maturity is April 27. Construction stopped in January, and since last week a man has been sitting at the top of the tower crane. 'We’ll go with a 1-year extension. You write the Risk Management opinion. The one who knows the risk should be the one to write it down.' When you go down to the 12th floor, Department Head Chae Ian takes the pencil from behind one ear and lays it flat on the desk. 'Your name’s already printed in the author field, isn’t it? On this floor, we call that consideration.'",
      "memo": [
        "Reheim Godeok PF -- KD Capital 62 billion won, maturity April 27",
        "Construction halted for three months -- tower crane sit-in, day 8",
        "CEO’s instruction: extend maturity by 1 year",
        "Opinion author field: your name already printed"
      ],
      "choices": {
        "c26_start_site": {
          "label": "Go to the Pyeongtaek site before writing the opinion"
        },
        "c26_start_terms": {
          "label": "Check the loan agreement against site records, page by page"
        },
        "c26_start_draft": {
          "label": "Draft the extension opinion first and buy time"
        },
        "reframe": {
          "label": "See how the loans ended"
        }
      },
      "place": "KD Capital 20th Floor · CEO’s Office",
      "clock": "April 13 · Monday · 08:00 · Maturity in D-14",
      "question": "Three days into his tenure, the first item on his desk already has your name printed on it. What do you do first?",
      "lead": "Just as you were told at the inauguration to come up at eight on Monday, the elevator doors open on the 20th floor."
    },
    "c26_crane": {
      "title": "The Foreman 40 Meters Up",
      "text": "Godeok, Pyeongtaek: a construction site with a 'Construction Temporarily Suspended' banner on the fence. Beside a frame that stopped rising at the 15th floor, formwork foreman Ji Kanghyun has been up in the tower crane’s cab for 9 days. A cloth tied to the crane mast reads 'Three months’ wages, 1.4 billion won, 87 workers.' Six subcontractors were not paid by the general contractor, Seum Construction, and the workers were not paid by those subcontractors. When you put your phone on speaker, a voice comes down from 40 meters up. 'You’re from the company that lent the money? Good, you came. Whose building is this? We put it up, and they say it ain’t ours.' On the fence is a warning posted by the developer. 'Unauthorized occupation will face civil and criminal action.'",
      "memo": [
        "Sit-in day 9 -- tower crane cab, 40m up",
        "6 subcontractors unpaid -- 87 workers, 1.4 billion won",
        "Contractor Seum Construction: cash crunch after signing a completion guarantee",
        "Developer’s warning: unauthorized occupation faces civil and criminal action"
      ],
      "choices": {
        "c26_crane_listen": {
          "label": "Stay under the crane and write down every demand"
        },
        "c26_crane_ledger": {
          "label": "Trace in the subcontracts where the wages stopped"
        },
        "c26_crane_down": {
          "label": "Talks can wait; persuade him to come down first"
        },
        "reframe": {
          "label": "See how the loans ended"
        },
        "c26_crane_evidence_turn": {
          "label": "Find Reheim money left unbuilt"
        }
      },
      "place": "Reheim Officetel, Godeok, Pyeongtaek · Under the Tower Crane",
      "clock": "April 14 · 10:00 · April · Sit-in Day 9",
      "question": "The foreman 40 meters up asks whose building this is. How do you answer?",
      "lead": "You get off at the Godeok intersection in Pyeongtaek and walk along the fence. Atop the crane beside the stalled frame, a white cloth flaps."
    },
    "c26_creditors": {
      "title": "The Middle Column",
      "text": "In a meeting room at Bridge Bank in Yeouido, the Reheim Godeok creditors’ committee convenes. At the head of the table is KD Capital, senior lender for 62 billion won; in the middle, Bridge Bank with 18 billion won. At the far end are the junior lenders, five of them including Gunsan’s Saebom Credit Union with 6 billion won, all on video. Kwon Dohyun, there for Bridge Bank, hands round a one-page sheet. The left column is a 1-year extension, the right column is taking the loss now. Between them he has drawn one more column. 'Wages of 1.4 billion won first, replace the contractor.' He pushes up his glasses. 'If the workers file a lien, nobody can sell this building. For reference, the crane rental is 830,000 won a day. This isn’t sympathy. It’s arithmetic.'",
      "memo": [
        "7 creditors -- KD Capital 62 billion won · Bridge Bank 18 billion won · 5 junior lenders",
        "Kwon Dohyun’s plan: wages of 1.4 billion won first, replace the contractor",
        "A lien would make a sale impossible",
        "KD Capital’s position: a 1-year extension, as the CEO instructed"
      ],
      "choices": {
        "c26_creditors_audit": {
          "label": "Halt the meeting for due diligence on site first"
        },
        "c26_creditors_wages": {
          "label": "Back Kwon Dohyun’s wages-first middle column"
        },
        "c26_creditors_extend": {
          "label": "Cast KD Capital’s vote for the CEO’s 1-year extension"
        },
        "reframe": {
          "label": "See how the loans ended"
        },
        "c26_creditors_evidence_turn": {
          "label": "Find Reheim money left unbuilt"
        }
      },
      "place": "Bridge Bank, Yeouido · Creditors’ Meeting Room",
      "clock": "April 17 · 14:00 · Maturity in D-10",
      "question": "Between extension and loss, a middle column has appeared that pays wages first. Where do you put KD Capital’s vote?",
      "lead": "In the Bridge Bank lobby, Oh Jinwoo hands you a visitor’s pass and whispers, 'Kwon Dohyun has redone his sheet three times today.'"
    },
    "c26_tower": {
      "title": "Night in the Cab",
      "text": "For the first time, Ji Kanghyun tells you to come up. You clip on a safety line and climb the ladder inside the crane mast. Around the 150th rung your legs start to shake, and from below Kang Taemin shouts, 'Resting makes it scarier!' The cab, barely 7 square meters, holds an electric blanket, a flat cola and a photo of his grandchild. Beyond the lights of Pyeongtaek, the stalled frame stands black. Ji Kanghyun points at one floor. '9th floor. Last summer our youngest fell from there. He lived, but he can never come up again. Took four months just to get it recognized as an industrial accident.' He takes out a cigarette, then puts it back. 'If I go down, everyone has to climb back up to that floor. For pay. So you tell me. If I go down, what changes?'",
      "memo": [
        "Crane height 40m -- about 200 ladder rungs",
        "The cab: electric blanket, grandchild’s photo, sit-in day 17",
        "9th floor: a fall last summer, four months to be recognized as an industrial accident",
        "Ji Kanghyun’s question: what changes if he comes down"
      ],
      "choices": {
        "c26_tower_explain": {
          "label": "Instead of promising, explain the order decisions are made in"
        },
        "c26_tower_warn": {
          "label": "Go down together tonight before a forced removal"
        },
        "c26_tower_promise": {
          "label": "Stake your name: come down and wages come first"
        },
        "reframe": {
          "label": "See how the loans ended"
        },
        "c26_tower_evidence_turn": {
          "label": "Find Reheim money left unbuilt"
        }
      },
      "place": "Reheim Officetel, Godeok, Pyeongtaek · Tower Crane Cab",
      "clock": "April 22 · 23:30 · Sit-in Day 17",
      "question": "From 40 meters up, he asks what changes if he goes down. What can you promise?",
      "lead": "The first call telling you to come up comes, and with a safety line at your waist you set your foot on the ladder’s first rung."
    },
    "c26_final": {
      "title": "The Field to Sign",
      "text": "KD Capital’s Credit Committee. In front of the five members is an opinion with your name on it. The site section carries the numbers as they stood: frame up to the 15th floor, reported progress 72%, actual on site 58%. A 1-year extension means no loss on this year’s books, and interest piles up for a year instead of construction money. Taking the loss sends the building to public auction. KD Capital, as senior lender, gets most of its money back, but the five junior lenders and 212 households with sale contracts go to the back of the line. Kwon Dohyun’s middle column—an extension tied to wages first and a new contractor—needs 4 billion won of new money. Chae Ian lays the pencil flat. 'Either way, the signature is yours. The CEO’s field says not applicable.' A photo from Pyeongtaek comes up on your phone. The light in the crane cab, day 19.",
      "memo": [
        "Maturity April 27 -- committee on the 24th, the last business day",
        "1-year extension: 0 loss this year, a year of accrued interest",
        "Taking the loss: public auction, 5 junior lenders and 212 households at the back of the line",
        "Conditional extension: 4 billion won in new money, wages of 1.4 billion won first"
      ],
      "choices": {
        "c26_final_dissent": {
          "label": "Dissent from the extension and record the loss in the opinion"
        },
        "c26_final_condition": {
          "label": "Sign the extension on condition: wages first, new contractor"
        },
        "c26_final_sign": {
          "label": "Sign the CEO’s 1-year extension and keep your seat"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Capital 19th Floor · Credit Committee Room",
      "clock": "April 24 · 15:00 · Last Business Day Before Maturity",
      "question": "You must sign a document whose CEO field is empty. Which opinion do you put your name to?",
      "lead": "At the meeting room door, Chae Ian takes the pencil from behind one ear and grips it. Today, it seems, it won’t go back."
    },
    "c26_aftershock": {
      "title": "The Foreman Comes Down",
      "text": "On Friday evening, after the committee ends, the first wages land in the accounts of the 87 workers. One month out of three. Whichever way the decision went, the single line 'wages first' that Bridge Bank’s Kwon Dohyun drove into the creditors’ committee minutes has survived. At dusk, formwork foreman Ji Kanghyun, who held his sit-in atop the tower crane, comes down the ladder after 19 days. When his legs give out on the last rung, Kang Taemin catches him and presses an opened cup of noodles into his hands. The workers applaud, and Kwon Dohyun switches off his calculator, saying, 'The crane rental stops as of today.' In the middle of the applause, a text comes from Department Head Chae Ian. A photo of the seven creditors’ sheet, with a pencil circle around the very last row: Gunsan’s Saebom Credit Union, 6 billion won. 'In a game like this, the first to collapse is always the last row.'",
      "memo": [
        "First wages paid -- 87 workers, one month out of three",
        "Ji Kanghyun comes down after 19 days of sit-in",
        "Last row of the junior lenders: Gunsan’s Saebom Credit Union, 6 billion won",
        "Chae Ian: 'The first to collapse is the last row'"
      ],
      "choices": {
        "c26_after_record": {
          "label": "Put the seven lenders and their sums in one table on record"
        },
        "c26_after_rush": {
          "label": "Leave the site, head straight to HQ and open the next item"
        },
        "c26_after_warm": {
          "label": "Stay with the foreman and the workers through the night"
        }
      },
      "place": "Reheim Officetel, Godeok, Pyeongtaek · Under the Tower Crane",
      "clock": "April 24 · 18:40",
      "question": "The foreman comes down after 19 days, and the credit union in the last row has been circled. How do you close this evening?"
    },
    "c26_ramen": {
      "title": "More Broth",
      "text": "At nine at night, Kang Taemin turns up at the container that serves as the site office, carrying two boxes of cup noodles. Three of the workers on the sit-in are old colleagues who left the logistics center’s night shift after the robots came in and moved to construction. Instead of a greeting, he puts water on in the electric kettle. He sends a cup of noodles up in a bucket on the end of the rope hanging from the crane mast, and 10 minutes later the bucket comes down. Inside the empty cup is a note in marker. 'More broth.' Sending up a second cup, Kang Taemin says, 'That guy’s never once stopped at one.' A worker laughing nearby looks for a long time at a photo of his daughter on his phone. Her college tuition is due Friday.",
      "memo": [
        "3 of the 87 workers are former night-shift colleagues",
        "Bucket round trip 10 minutes -- second cup of noodles requested",
        "A worker’s child’s tuition deadline: Friday"
      ],
      "choices": {
        "c26_ramen_choice_2": {
          "label": "Itemize the 87 workers’ unpaid wages one by one"
        },
        "c26_ramen_choice_3": {
          "label": "Just share noodles today; leave it to the creditors"
        },
        "c26_ramen_choice_1": {
          "label": "Find a way to pay the most urgent part of their wages first"
        }
      },
      "place": "Reheim Officetel, Godeok, Pyeongtaek · Site Office Container",
      "clock": "April 14 · 21:00",
      "question": "Beside the cup noodles riding the bucket, one worker’s tuition deadline draws near. What do you do?"
    },
    "c26_nursery": {
      "title": "The Baby’s Room",
      "text": "Saturday. In the parking lot in front of the closed Reheim Godeok model house, 40 buyers with sale contracts have gathered. Their representative, Song Hayul, is thirty-two and due in October. She traces a small room on the floor plan taped to the glass door. 'This one. I was going to make it the baby’s room—I even picked the wallpaper color.' Every buyer took out an interim-payment loan, and the interest keeps going out each month even though construction has stopped. Song Hayul’s jeonse lease ends in December, when the move-in was originally scheduled. 'You bank people talk about extension, about loss. Where do we sleep in December?'",
      "memo": [
        "212 households with sale contracts -- 40 gathered today",
        "Interim-payment loan interest: still monthly after the halt",
        "Song Hayul: due in October, lease ends in December"
      ],
      "choices": {
        "c26_nursery_choice_1": {
          "label": "Make the developer answer for where buyers live in December"
        },
        "c26_nursery_choice_3": {
          "label": "Say it’ll be fixed when work resumes; just explain today"
        },
        "c26_nursery_choice_2": {
          "label": "Formally add the 212 households’ losses to the decision file"
        }
      },
      "place": "Reheim Godeok Model House · Front Parking Lot",
      "clock": "April 18 · 11:00",
      "question": "In front of 40 people, someone has asked where they will sleep in December. What do you say?"
    },
    "c26_elevator": {
      "title": "The One Who Was Right",
      "text": "7:50 on the morning before the committee. You step into the elevator on the 12th floor, and Yoon Sanghyuk is already inside. It is the first time you have met him alone outside the CEO’s office. A plain navy suit, a tablet showing a document with an empty signature field. He doesn’t press a button; he waits for the doors to close. 'I hear you go to Pyeongtaek often. Climbed the crane, too.' The floor display changes from 18 to 19. 'Risk Management is where risk is written down, not where it’s removed. Your name goes only in the author field. The committee makes the decision.' The doors open on the 20th floor. As he steps out, he adds, 'You were right 3 years ago, too. That’s why you went to the basement.'",
      "memo": [
        "Alone with Yoon Sanghyuk outside the CEO’s office -- 50 seconds in an elevator",
        "'Your name goes only in the author field'",
        "Credit Committee: 15:00 on the last business day before maturity"
      ],
      "choices": {
        "c26_elevator_choice_1": {
          "label": "Put Ji Kanghyun’s question to Yoon Sanghyuk as it was"
        },
        "c26_elevator_choice_3": {
          "label": "Don’t answer; buy time to write the opinion"
        },
        "c26_elevator_choice_2": {
          "label": "Write down today’s talk, with date and time, for the record"
        }
      },
      "place": "KD Capital Headquarters · Elevator",
      "clock": "April 23 · 07:50 · Day Before the Committee",
      "question": "Yoon Sanghyuk says your name goes only in the author field. How do you answer in these 50 seconds?"
    },
    "c26_ramen_reaction": {
      "title": "30 Years of Formwork",
      "text": "Around midnight, Ji Kanghyun calls. On the other end there is only the sound of wind. 'I’ve done nothing but formwork for 30 years. Building the wooden molds before the concrete’s poured. Once the building’s up, the molds get torn off and thrown away. Ever seen our faces in a completion-ceremony photo?' He laughs briefly. 'It’s nice, Taemin sending noodles up from down there. But if I go down, who sees that banner? Once this building’s finished, nobody’ll know it was put up by people cheated out of three months’ pay.'",
      "memo": [
        "Formwork never appears in the completion-ceremony photo",
        "If he comes down, no one will see the banner"
      ],
      "choices": {
        "c26_ramen_reaction_choice_2": {
          "label": "Formally put the sit-in’s reasons on the creditors’ agenda"
        },
        "c26_ramen_reaction_choice_1": {
          "label": "Propose adding the workers’ names to the building’s records"
        },
        "c26_ramen_reaction_choice_3": {
          "label": "Promise to guard the banner and just ask him down"
        }
      },
      "place": "Reheim Officetel, Godeok, Pyeongtaek · Under the Tower Crane",
      "clock": "April 15 · 00:10",
      "question": "The foreman says no one will see the banner if he comes down. How do you keep those names?"
    },
    "c26_nursery_reaction": {
      "title": "Not Applicable",
      "text": "Monday morning, Chae Ian prints out the approval form that will go to the committee. Your name is printed in the author field, Chae Ian’s in the reviewer field. In the CEO’s field at the very end of the approval line, the words 'Not applicable' are already stamped. Chae Ian takes the pencil from behind one ear and lays it on the form. 'Under the rules, the CEO doesn’t sign anything under 100 billion won. The rule changed last month.' Last month was the month Yoon Sanghyuk’s appointment as CEO was settled. 'I’ve served three CEOs, and this is the first time a field has vanished. Funny, isn’t it? Keep laughing and only my name is left.'",
      "memo": [
        "CEO approval field: 'Not applicable' preprinted",
        "Rule amended: in the month Yoon Sanghyuk’s appointment was settled"
      ],
      "choices": {
        "c26_nursery_reaction_choice_2": {
          "label": "Formally request the rule-change date and approval record"
        },
        "c26_nursery_reaction_choice_1": {
          "label": "Suggest a separate review opinion to protect Chae Ian’s name too"
        },
        "c26_nursery_reaction_choice_3": {
          "label": "A field is just a field; fill in the opinion per the form"
        }
      },
      "place": "KD Capital 12th Floor · Risk Management Department",
      "clock": "April 20 · 08:30",
      "question": "Only the CEO’s field has 'Not applicable' stamped in advance. What do you do with this form?"
    },
    "c26_elevator_reaction": {
      "title": "The Desk Facing the Wall",
      "text": "At nine at night, Han Seoyun, on standby assignment, picks up your call. For 3 weeks now she has reported to a room at the end of the 7th-floor hallway at headquarters. A desk set facing the wall, no computer, a stack of A4 paper and one ballpoint pen. 'He said that in the elevator? That you went to the basement because you were right?' She laughs, then stops. 'I’m the one who pressed the return button on your dissent 3 years ago. That was an author field too. The person who decided had no field.' Pages turn. 'I have nothing to do, so these days I’m reading the rulebook from the start. That rule letting the CEO skip signing—its supplementary provisions are strange. I’ll send them tomorrow.'",
      "memo": [
        "Han Seoyun: standby assignment for 3 weeks, a desk facing the wall",
        "The supplementary provisions of the CEO signature-exemption rule"
      ],
      "choices": {
        "c26_elevator_reaction_choice_1": {
          "label": "Don’t leave her alone; ask her to lunch tomorrow"
        },
        "c26_elevator_reaction_choice_3": {
          "label": "Hear only the provisions tonight and keep the call short"
        },
        "c26_elevator_reaction_choice_2": {
          "label": "Formally attach Han Seoyun’s find to the committee file"
        }
      },
      "place": "KD Financial Group Headquarters 7th Floor · Standby Room",
      "clock": "April 23 · 21:00",
      "question": "The person who once pressed the return button has found the provisions of the CEO signature-exemption rule. What do you do?"
    },
    "c26_branch_frame": {
      "title": "The Floors Open to the Sky",
      "text": "Leafing through the subcontracts, one date catches you. The end-of-January report the contractor submitted to its lenders puts the progress rate at 72%. From atop the crane, Ji Kanghyun guides you by phone. 'Go up to the 14th floor. No stair railings, so keep to the wall.' In a hard hat, you climb the frame’s stairs. From the 10th floor up, only columns stand; the floors are empty. Chalk writing remains on a wall. '1/9 Formwork pulled out -- no money coming.' Over the phone, Ji Kanghyun says, '72%? Stand there and you can tell. Guess they counted everything up to the floors open to the sky as built.'",
      "memo": [
        "Reported progress 72% -- estimated on site 58%",
        "No floor slabs above the 10th floor",
        "Chalk on the wall: '1/9 Formwork pulled out -- no money coming'",
        "Loan money is paid out in stages to match the progress rate"
      ],
      "choices": {
        "c26_branch_frame_a": {
          "label": "Photograph the chalk and empty floors; gather workers’ accounts"
        },
        "c26_branch_frame_b": {
          "label": "Record reported vs. actual progress, floor by floor"
        },
        "c26_branch_frame_c": {
          "label": "Save the gap in numbers for the committee; go down today"
        }
      },
      "place": "Reheim Officetel, Godeok, Pyeongtaek · Frame, 14th Floor",
      "clock": "April 14 · 14:00",
      "question": "The building reported at 72% has no floor on its 14th story. What do you do with this empty floor?"
    },
    "c26_branch_frame_follow": {
      "title": "A Field with Only a Seal",
      "text": "When you open the door of the site office container, someone is already there. Bridge Bank’s Kwon Dohyun is aiming a laser measure out the window at the frame. Bridge Bank, too, lent 18 billion won to this project. He holds out a printout of the progress report he pulled from the site’s shared folder. In the verification box beside the figure 72% is the electronic seal of KD Capital’s Real Estate Finance Team, and the verifier’s name field is empty. Kwon Dohyun taps at his calculator. 'The money paid out on a progress rate inflated by 14% comes to 8.7 billion won. Six times the workers’ three months of wages.' He draws a vertical line on a blank sheet. 'Who fills in this field?'",
      "memo": [
        "Bridge Bank 18 billion won -- Kwon Dohyun checks the site",
        "Progress report 72% verification box: KD Capital electronic seal, no name",
        "Extra loan money paid out on the inflated progress rate: 8.7 billion won",
        "Six times the workers’ wages of 1.4 billion won"
      ],
      "choices": {
        "c26_branch_frame_follow_a": {
          "label": "Show the workers the empty verifier field and press it together"
        },
        "c26_branch_frame_follow_b": {
          "label": "Formally ask Real Estate Finance how the seal got there"
        },
        "c26_branch_frame_follow_c": {
          "label": "Hand the printout to Kwon Dohyun; let Bridge Bank fight first"
        }
      },
      "place": "Reheim Officetel, Godeok, Pyeongtaek · Site Office",
      "clock": "April 14 · 16:00",
      "question": "Beside the inflated progress rate, the verification box has only a team seal and no name. What do you do with this field?"
    },
    "c26_route_system": {
      "title": "A Decision That Moves the Date",
      "text": "Before taking the loss, you first lay out how the extended loans ended. The group’s review engine, NOAH, an AI program that judges loan applications automatically, handles the calculation. Line by line, it opens the 41 real-estate loans whose maturity KD Capital extended over the past 7 years. 9 were repaid in full after extension; the other 32 ended 1 to 2 years later in bigger losses. In every year of extension, the responsible executive’s performance review read 'no loss.' NOAH adds one line. 'Extension is learned not as a decision that removes a loss, but as a decision that moves the loss’s date. The person sitting in that seat on the moved date is usually someone else.'",
      "memo": [
        "41 KD Capital real-estate loans with extended maturity",
        "9 repaid in full -- 32 bigger losses",
        "Responsible executive’s review in the extension year: all 'no loss'"
      ],
      "choices": {
        "c26_route_system_names": {
          "label": "Find who sat in the seat on the day each of the 32 collapsed"
        },
        "c26_route_system_drop": {
          "label": "Bury the statistics and write the opinion for extension"
        },
        "c26_route_system_publish": {
          "label": "Disclose the statistics to the committee and the creditors"
        },
        "c26_route_system_evidence_turn": {
          "label": "Find Reheim money left unbuilt"
        }
      },
      "place": "KD Capital 12th Floor · Risk Management Review Terminal",
      "clock": "April 15 · 19:00",
      "question": "Of 41 extended real-estate loans, 32 ended in bigger losses. What do you do with these statistics?"
    },
    "c26_final_system_route": {
      "title": "The One Who Takes the Date",
      "text": "At dawn on committee day, NOAH leaves a table up on the 12th-floor review terminal. It lists, side by side, the executive in charge in the year of extension and the person in charge in the year the loss broke. Of the 32 rows, the ones where the 2 fields hold the same name can be counted on one hand. On the blank bottom row, Reheim Godeok is written in pencil, and the name for the extension column is already printed on the opinion. 'I cannot calculate who will be sitting there on the moved date. This table has no field for the one person on the crane.'",
      "memo": [
        "41 maturity extensions -- 32 bigger losses",
        "Reheim Godeok maturity: April 27",
        "Opinion author field: your name already printed"
      ],
      "choices": {
        "c26_final_system_route_b": {
          "label": "Extend, but change the terms so wages go out before interest"
        },
        "c26_final_system_route_c": {
          "label": "Warn the credit union members who are repaid last first"
        },
        "c26_final_system_route_a": {
          "label": "Propose a rule requiring the CEO’s signature on every extension"
        }
      },
      "place": "KD Capital 12th Floor · Risk Management Review Terminal",
      "clock": "Committee Day · Dawn",
      "question": "The name for the extension column is already printed. What do you write under that name?"
    },
    "c26_evidence_turn": {
      "title": "One Line in the Project Cost Statement",
      "text": "Ban Jaewook, who squeezed a day in Pyeongtaek into Internal Audit’s regional circuit, comes to KD Capital’s records room at 6 a.m. When you spread the clue out on his travel bag, the Reheim Godeok project cost statement opens. Among land, construction and design costs sits 'project advisory fee: 3.2 billion won'—money sent out as the price of advice. The recipient: Haeon Partners. The very company that collected advisory fees every quarter during the 2023-0412 loan. The payment date is two months before construction stopped, and on the same day the progress report went up to 72%. Ban Jaewook opens his notebook. 'They couldn’t pay the workers 1.4 billion won in wages, but they paid 3.2 billion won for advice. To the same company as 3 years ago.'",
      "memo": [
        "Project cost statement: project advisory fee 3.2 billion won -- Haeon Partners",
        "Payment date: two months before construction stopped",
        "Same day, progress report raised to 72%"
      ],
      "choices": {
        "c26_evidence_turn_share": {
          "label": "Tell workers and buyers first where the 3.2 billion won went"
        },
        "c26_evidence_turn_hold": {
          "label": "Hold the statement for when you go after Haeon Partners"
        },
        "c26_evidence_turn_reclaim": {
          "label": "Ask the committee to claw back the 3.2 billion won for wages"
        }
      },
      "place": "KD Capital 17th Floor · Records Room",
      "clock": "Committee Day · 06:00",
      "question": "1.4 billion won in wages went unpaid, but 3.2 billion won for advice went out. How do you use this statement?"
    },
    "c26_start_warm": {
      "title": "First Item for One Who Walked to the End",
      "text": "That night the six of you walked to the end of the cherry-blossom path together, you let the weekend pass without reading Chae Ian’s email. Only on Monday morning, in the elevator up to the 20th floor, do you open it. In the attached photo, a cloth is tied to a tower crane mast. 'Three months’ wages, 1.4 billion won, 87 workers.' At 8 sharp, Yoon Sanghyuk holds out a file. Real-estate project financing (PF) for a Pyeongtaek officetel—a loan made before a building goes up, on the strength of expected sales money—62 billion won, maturity April 27. 'We’ll go with a 1-year extension. You write the opinion.' On the opinion form you are handed, your name is already printed in the author field. When you post the photo in the group chat, Do Yoonha is first to reply. 'While we were looking at cherry blossoms, that man was up there all weekend.'",
      "memo": [
        "Reheim Godeok PF 62 billion won -- maturity April 27",
        "Chae Ian’s email: unread over the weekend",
        "Crane sit-in day 8 -- photo shared in the group chat"
      ],
      "choices": {
        "c26_start_warm_draft": {
          "label": "Draft the extension opinion first and buy time"
        },
        "c26_start_warm_site": {
          "label": "Go to the Pyeongtaek site before writing the opinion"
        },
        "c26_start_warm_terms": {
          "label": "Check the loan agreement against site records, page by page"
        },
        "c26_start_warm_signature": {
          "label": "Split the six in the group chat into site and paper teams"
        },
        "c26_start_warm_reframe": {
          "label": "See how the loans ended"
        }
      },
      "place": "KD Capital 20th Floor · CEO’s Office",
      "clock": "April 13 · Monday · 08:00 · Maturity in D-14",
      "question": "All the weekend you spent watching cherry blossoms, someone was up on a crane. How do you share this file with the six?",
      "lead": "In the elevator up to the 20th floor, you open the email you left unread all weekend."
    },
    "c26_start_record": {
      "title": "First Item for One Who Drew the Map",
      "text": "When you bound what the six of you saw from six scattered posts in your first week into one document, Pyeongtaek sat in the middle of the map. Two buyers of a Pyeongtaek officetel came to Do Yoonha’s window at Gangseo Branch to ask about their loan interest; Oh Jinwoo’s Bridge Bank had put money into the same site; and at Lee Minseo’s KD Data Lab, the credit scores of that site’s workers had dropped all at once. Monday at 8, on the 20th floor, Yoon Sanghyuk holds out that very file. Real-estate project financing (PF)—a loan made before a building goes up, on the strength of expected sales money—62 billion won, maturity April 27. 'A 1-year extension. The opinion goes in your name.' On the form, that name is already printed in the author field. Lee Minseo sends a message. 'The middle of the map turned into your desk.'",
      "memo": [
        "The middle of the six-post map: Pyeongtaek",
        "Reheim Godeok PF 62 billion won -- maturity April 27",
        "Site workers’ credit scores dropped at once -- KD Data Lab"
      ],
      "choices": {
        "c26_start_record_site": {
          "label": "Go to the Pyeongtaek site before writing the opinion"
        },
        "c26_start_record_terms": {
          "label": "Check the loan agreement against site records, page by page"
        },
        "c26_start_record_signature": {
          "label": "Attach the six-post map to the opinion as an official record"
        },
        "c26_start_record_draft": {
          "label": "Draft the extension opinion first and buy time"
        },
        "c26_start_record_reframe": {
          "label": "See how the loans ended"
        }
      },
      "place": "KD Capital 20th Floor · CEO’s Office",
      "clock": "April 13 · Monday · 08:00 · Maturity in D-14",
      "question": "The middle of the six-post map has become the file on your desk. How do you use that map?",
      "lead": "With the document you bound over the weekend in your bag, you press the button for the 20th floor."
    },
    "c26_start_rush": {
      "title": "First Item for One Who Ran Ahead",
      "text": "The Friday night you opened the email, you drove straight there and reached the Pyeongtaek site at two in the morning. The light in the tower crane cab saw your headlights first, and from 40 meters up a flashlight blinked three times. You stayed in your car outside the fence until daybreak. Monday at 8, on the 20th floor, Yoon Sanghyuk holds out a file. Real-estate project financing (PF) for a Pyeongtaek officetel—a loan made before a building goes up, on the strength of expected sales money—62 billion won, maturity April 27. 'I hear you went to the site over the weekend. Diligent. Write the opinion for a 1-year extension.' On the opinion form, your name is already printed in the author field. Ban Jaewook, in Gunsan, asks over the phone, 'Who was there at that hour? How does the CEO know about it?'",
      "memo": [
        "Saturday 02:00, arrived at the Pyeongtaek site -- crane flashlight signal, 3 times",
        "Reheim Godeok PF 62 billion won -- maturity April 27",
        "Yoon Sanghyuk: 'I hear you went to the site over the weekend'"
      ],
      "choices": {
        "c26_start_rush_terms": {
          "label": "Check the loan agreement against site records, page by page"
        },
        "c26_start_rush_site": {
          "label": "Go to the Pyeongtaek site before writing the opinion"
        },
        "c26_start_rush_draft": {
          "label": "Draft the extension opinion first and buy time"
        },
        "c26_start_rush_signature": {
          "label": "Tell colleagues first about the dawn site and the CEO’s words"
        },
        "c26_start_rush_reframe": {
          "label": "See how the loans ended"
        }
      },
      "place": "KD Capital 20th Floor · CEO’s Office",
      "clock": "April 13 · Monday · 08:00 · Maturity in D-14",
      "question": "The CEO knows about a dawn visit no one saw. Whom do you tell about that dawn first?",
      "lead": "Two days after seeing the crane’s light from outside the fence before dawn on Saturday, you come up to the 20th floor."
    }
  },
  "echoReplies": {
    "c26_start_site": "When you go to the site, the blanks in the opinion wait just as they are. Instead, someone up on the crane reads your license plate.",
    "c26_start_terms": "When you compare them, page 17 of the agreement holds the contractor’s promise to finish construction no matter what. That the contractor has no money to keep that promise appears nowhere.",
    "c26_start_draft": "The draft is done in an hour. Above your printed name, the first sentence you wrote recommends extension.",
    "c26_crane_listen": "When you write them down, the demands are three lines. Wages, an apology, and 'my people’s names.' No document form has a field for the third line.",
    "c26_crane_ledger": "The contracts show the money stopped at the contractor. The contractor points to the developer, and the developer points to KD Capital.",
    "c26_crane_down": "When you try to persuade him, Ji Kanghyun laughs. 'If I go down, the talks aren’t later. They’re gone.' The call ends.",
    "c26_creditors_wages": "When you add your vote, the middle column stays in the creditors’ committee minutes as one line. Whether KD Capital accepts it is up to the Credit Committee, and the throat-clearing travels up to the CEO’s office that afternoon.",
    "c26_creditors_audit": "When you halt the meeting, due diligence takes ten days. Maturity is also ten days away, and the crane rental runs 830,000 won a day all the while.",
    "c26_creditors_extend": "When the votes gather on the extension side, the meeting ends in 40 minutes. Kwon Dohyun doesn’t erase the middle column; at the bottom of the minutes he appends one line, 'wages first,' as a minority opinion.",
    "c26_tower_promise": "When you promise, Ji Kanghyun glances once at the photo of his grandchild. 'You staked your name, so you can’t run.' One more name goes up on the crane: yours.",
    "c26_tower_explain": "When you explain, Ji Kanghyun listens to the end. 'So the people who decide never come here.' He isn’t wrong.",
    "c26_tower_warn": "When you suggest going down together, he looks down the ladder. Below, Kang Taemin waves a flashlight. He shakes his head.",
    "c26_final_condition": "When you sign, 4 billion won of new money goes in and the wages go out first. The interest for the 1-year extension piles on top of that 4 billion won as well.",
    "c26_final_dissent": "The dissent stays in the committee record. It isn’t erased like 3 years ago, but once the public auction begins, the people at the back of the line are the first to read it.",
    "c26_final_sign": "When you sign, this year’s books are clean. Even if the light on the crane goes out, it won’t be thanks to your signature, and you move one field closer to the seat the 20th floor trusts.",
    "c26_after_warm": "When you stay, the light in the site office container burns late. Ji Kanghyun calls the names of the 87 workers one by one, and instead of answering, Kang Taemin passes round cups of noodles.",
    "c26_after_record": "When you put it in a table, the seven lenders’ money and order fit on one page. So does how thin the last row is.",
    "c26_after_rush": "When you go straight back, people are still on the 12th floor on a Friday night. Beyond the partitions, messenger alerts chime unusually often.",
    "c26_ramen_choice_1": "When you find a way, one person’s share comes through before the tuition deadline. The other 86 watch that order.",
    "c26_ramen_choice_2": "Once the statements are sorted, the 87 have names. Writing them down one at a time takes the whole night.",
    "c26_ramen_choice_3": "The noodles are warm. The bucket goes up and down three more times through the night, and no one decides anything.",
    "c26_nursery_choice_1": "When you demand accountability, the developer sends a one-line text: 'We will look into it.' Song Hayul screenshots it and posts it in the group’s chat room.",
    "c26_nursery_choice_2": "Once in the file, the 212 households become not a number but a one-page table. No one knows how many seconds the committee will look at it.",
    "c26_nursery_choice_3": "The explanation is kind. Song Hayul nods, and on a real-estate app searches again for December jeonse listings.",
    "c26_elevator_choice_1": "When you pass on the question, Yoon Sanghyuk looks straight at you for the first time. 'A question is not a signature.' The doors close.",
    "c26_elevator_choice_2": "The record runs 50 seconds. Ban Jaewook receives the memo and replies, 'Same as what he said 3 years ago, down to the sentence endings.'",
    "c26_elevator_choice_3": "Silence buys time. Yoon Sanghyuk is the kind of man who writes silence down as consent.",
    "c26_ramen_reaction_choice_1": "When you suggest adding the names, Ji Kanghyun is quiet for a long while. 'If you’re carving them in the cornerstone, my handwriting’s good.'",
    "c26_ramen_reaction_choice_2": "Once it is on the agenda, the sit-in stays in the minutes as one line. The meeting is this Friday.",
    "c26_ramen_reaction_choice_3": "When you tell him to come down, Ji Kanghyun doesn’t hang up; he just listens for a long time. The crane light doesn’t go out.",
    "c26_nursery_reaction_choice_1": "When you suggest writing it separately, Chae Ian rolls the pencil around for a long while. 'In 17 years I’ve never written a separate review opinion. I do know how.'",
    "c26_nursery_reaction_choice_2": "When you request it, the rule-amendment document comes out. In the field for the department that submitted the amendment: the CEO’s Secretariat.",
    "c26_nursery_reaction_choice_3": "When you fill it in per the form, the document comes out neat. The words 'Not applicable' go up to the committee just as they are, too.",
    "c26_elevator_reaction_choice_1": "When you set the lunch, Han Seoyun says, 'I’ll pack two lunch boxes.' A lunch box packed by someone with nothing to do has seven side dishes.",
    "c26_elevator_reaction_choice_2": "Once the provisions are attached, it comes out that the rule took effect two weeks before this loan’s maturity. The members stop turning pages at that line.",
    "c26_elevator_reaction_choice_3": "The call ends in 3 minutes. At the desk facing the wall, Han Seoyun opens the rulebook again.",
    "c26_branch_frame_a": "When you take photos, six workers each point out a floor they left half-framed. The accounts pile up, as many as the floors.",
    "c26_branch_frame_b": "Compared floor by floor, the gap is 14%. By that 14%, the money went out early.",
    "c26_branch_frame_c": "When you go down, the chalk writing stays on the wall. Only until the next rain.",
    "c26_branch_frame_follow_a": "When you show them, the workers look at the verifier field for a long time. Someone mutters, 'Our pay slips had a field like that too.'",
    "c26_branch_frame_follow_b": "The inquiry is received. Real Estate Finance replies, 'Employee in charge has resigned,' and the resignation date is the day after the seal was applied.",
    "c26_branch_frame_follow_c": "When you hand it over, Kwon Dohyun takes it. 'If Bridge fights, Bridge only takes care of Bridge’s share. You know that when you hand it over, right?'",
    "c26_route_system_publish": "When you disclose it, a credit union officer on the creditors’ meeting screen turns on the mic for the first time. 'So we’re always the ones at the very end who take that date.'",
    "c26_route_system_names": "When you look, 21 of the last people in charge of the 32 have already left the company. The reason for leaving is mostly 'responsibility for losses.'",
    "c26_route_system_drop": "When you bury them, the opinion smoothly recommends extension. A 42nd extension is quietly recorded.",
    "c26_final_system_route_a": "Once the rule exists, a signature goes into the CEO’s field from the next extension on. On this document, the CEO’s field stays as printed: 'Not applicable.'",
    "c26_final_system_route_b": "When you change the terms, the workers get paid first. That it is a decision that moves the date does not change.",
    "c26_final_system_route_c": "When you warn them, the credit union members learn for the first time that their money hangs on a crane in Pyeongtaek. From the moment they know, that money turns uneasy.",
    "c26_evidence_turn_reclaim": "When you take it to the committee, the 3.2 billion won becomes an agenda title for the first time. That afternoon, Haeon Partners moves the address in its corporate registry.",
    "c26_evidence_turn_hold": "Held, it becomes a strong card. While you hold it, the workers’ three months of wages stay unpaid.",
    "c26_evidence_turn_share": "When you tell them, formwork foreman Ji Kanghyun, up on the crane, says nothing for a long time. Then he adds one line beneath the banner. 'Advice money: 3.2 billion won.'",
    "c26_crane_evidence_turn": "Go through it item by item and one field turns out not to be construction costs. The company written in that field took money under the same name 3 years ago.",
    "c26_creditors_evidence_turn": "Go through it item by item and one field turns out not to be construction costs. The company written in that field took money under the same name 3 years ago.",
    "c26_tower_evidence_turn": "Go through it item by item and one field turns out not to be construction costs. The company written in that field took money under the same name 3 years ago.",
    "c26_route_system_evidence_turn": "Go through it item by item and one field turns out not to be construction costs. The company written in that field took money under the same name 3 years ago.",
    "case26_memory_system": "The form has no room to cut in. There is only your name, printed in the author field ahead of you. NOAH opens 41 loans extended on the same form.",
    "case26_memory_evidence": "Hold the board dates against the project cost statement, and one line that isn’t construction costs is tucked in. The name of the receiving company is familiar.",
    "c26_start_warm_site": "When you go to the site, the blanks in the opinion wait just as they are. Instead, someone up on the crane reads your license plate.",
    "c26_start_warm_terms": "When you compare them, page 17 of the agreement holds the contractor’s promise to finish construction no matter what. That the contractor has no money to keep that promise appears nowhere.",
    "c26_start_warm_draft": "The draft is done in an hour. Above your printed name, the first sentence you wrote recommends extension.",
    "c26_start_warm_signature": "When you split them up, Do Yoonha takes the site and Lee Minseo the papers. Oh Jinwoo says he’ll do both, and hears from Kwon Dohyun, 'Then you’ll do half of each.'",
    "c26_start_record_site": "When you go to the site, the blanks in the opinion wait just as they are. Instead, someone up on the crane reads your license plate.",
    "c26_start_record_terms": "When you compare them, page 17 of the agreement holds the contractor’s promise to finish construction no matter what. That the contractor has no money to keep that promise appears nowhere.",
    "c26_start_record_draft": "The draft is done in an hour. Above your printed name, the first sentence you wrote recommends extension.",
    "c26_start_record_signature": "With it attached, the opinion runs 12 pages. Saying, 'First time I’ve seen an attachment longer than the body in this department,' Chae Ian tucks the pencil back behind one ear.",
    "c26_start_rush_site": "When you go to the site, the blanks in the opinion wait just as they are. Instead, someone up on the crane reads your license plate.",
    "c26_start_rush_terms": "When you compare them, page 17 of the agreement holds the contractor’s promise to finish construction no matter what. That the contractor has no money to keep that promise appears nowhere.",
    "c26_start_rush_draft": "The draft is done in an hour. Above your printed name, the first sentence you wrote recommends extension.",
    "c26_start_rush_signature": "When you tell them, Ban Jaewook asks first for the name of the site security company. The security company is on the list of partner firms KD Capital manages."
  },
  "choiceVoiceLines": {
    "c26_start_site": "Because you can’t write it without seeing where the 62 billion won went, you go to the Pyeongtaek site before writing the opinion.",
    "c26_start_terms": "Because you need to know what promises the 62 billion won went out on, you check the loan agreement against the site records, page by page.",
    "c26_start_draft": "Because you can’t defy the CEO outright, you draft the extension opinion first and buy time.",
    "c26_crane_listen": "Saying you have to hear the people who built it first, you stay under the crane and write down every one of the foreman’s demands.",
    "c26_crane_ledger": "Saying you can only press the point once you know whose money went unpaid, you check in the subcontracts where the wages stopped.",
    "c26_crane_down": "Because he has been 40 meters up for 9 days, you say talks can wait and first persuade him to come down from the crane.",
    "c26_creditors_wages": "Saying the arithmetic is right—with a lien no one can sell—you add your vote to Kwon Dohyun’s wages-first middle column.",
    "c26_creditors_audit": "Saying all three columns should be chosen after seeing the site, you halt the meeting for due diligence before any decision.",
    "c26_creditors_extend": "Saying this is no place to overturn the company’s will, you cast KD Capital’s vote for the CEO’s 1-year extension.",
    "c26_tower_promise": "Saying the question of what changes deserves an answer, you stake your name on a promise that if he comes down, wages come first.",
    "c26_tower_explain": "Resolved to say nothing you can’t keep, you explain, instead of promising, exactly the order in which the decision gets made.",
    "c26_tower_warn": "Saying it must not end with him dragged down, you suggest going down together tonight before a forced removal comes.",
    "c26_final_condition": "Saying you’ll put out the crane light burning for 19 days first, you sign the extension opinion on condition of wages first and a new contractor.",
    "c26_final_dissent": "Saying you can’t lend your name to pushing the loss to next year, you dissent from the extension and record the loss in the opinion.",
    "c26_final_sign": "Saying that if you’re pushed out now there will be no one left to write next time, you sign the CEO’s 1-year extension and keep your seat for the next fight.",
    "c26_after_warm": "Because you can’t send off people who held out for 19 days with applause alone, you stay with the foreman and the workers through the site’s night.",
    "c26_after_record": "So the last row is visible next time too, you put the seven lenders and their sums in one table and record this decision.",
    "c26_after_rush": "Saying you must act before the last row collapses, you leave the site and head straight back to HQ to open the next item.",
    "c26_ramen_choice_1": "Because someone’s tuition is due Friday, you find a way for the most urgent to receive part of their wages first.",
    "c26_ramen_choice_2": "So no one’s unpaid amount gets lumped together, you itemize the 87 workers’ back wages one person at a time.",
    "c26_ramen_choice_3": "Saying the order of the money isn’t yours to decide, you just share noodles today and leave the decision to the creditors.",
    "c26_nursery_choice_1": "Saying a place to sleep comes before extension or loss, you make the developer answer for where the buyers will live in December.",
    "c26_nursery_choice_2": "Saying what you heard in the parking lot must reach the committee, you formally add the 212 households’ losses to the decision file.",
    "c26_nursery_choice_3": "Saying move-in and interest will both be solved once construction resumes, you just explain today and leave.",
    "c26_elevator_choice_1": "Saying there is a question you received outside the author field, you put Ji Kanghyun’s question to Yoon Sanghyuk as it was.",
    "c26_elevator_choice_2": "Because words in an elevator stay nowhere, you write down today’s conversation, down to the date and time, for the record.",
    "c26_elevator_choice_3": "Saying nothing is gained by standing up to him here, you don’t answer and buy time to write the opinion.",
    "c26_ramen_reaction_choice_1": "So the names of those who built it remain even after he comes down, you propose adding the workers’ names to the building’s records.",
    "c26_ramen_reaction_choice_2": "So the minutes say what the banner was saying, you formally put the sit-in’s reasons on the creditors’ meeting agenda.",
    "c26_ramen_reaction_choice_3": "Saying you’ll guard the banner he asked who would see, you just ask him to come down.",
    "c26_nursery_reaction_choice_1": "To protect Chae Ian’s name too, left alone on the form, you suggest writing a separate review opinion.",
    "c26_nursery_reaction_choice_2": "Saying you need to know why the field vanished last month, you formally request the date of the rule change and its approval record.",
    "c26_nursery_reaction_choice_3": "Saying even 'Not applicable' is just a field, you fill in the opinion per the form.",
    "c26_elevator_reaction_choice_1": "Saying you won’t leave her alone in a standby room facing the wall, you ask her to lunch tomorrow.",
    "c26_elevator_reaction_choice_2": "Saying it should go up with the name of the person who found it, you formally attach the provisions Han Seoyun found to the committee file.",
    "c26_elevator_reaction_choice_3": "Because it’s the night before the committee and there’s no time, you hear only about the provisions tonight and keep the call short.",
    "c26_branch_frame_a": "Saying the word of those who stood here is surest, you photograph the chalk writing and the empty floors and gather the workers’ accounts.",
    "c26_branch_frame_b": "So it’s on record where the 72% went wrong, you compare reported progress with actual work floor by floor and write it down.",
    "c26_branch_frame_c": "Saying the gap between 72% and the empty floors is for the committee, you go down for today.",
    "c26_branch_frame_follow_a": "Saying they are the ones who would know whose share the 8.7 billion won came out of, you show the workers the empty verifier field and press it together.",
    "c26_branch_frame_follow_b": "Saying it’s your own team’s seal, so you should ask first, you formally ask Real Estate Finance how the seal came to be applied.",
    "c26_branch_frame_follow_c": "Because it’s hard to expose your own seal with your own hands, you hand the printout to Kwon Dohyun and let Bridge Bank fight first.",
    "c26_route_system_publish": "Saying everyone choosing should see the same numbers, you disclose the statistics to both the committee file and the creditors’ meeting.",
    "c26_route_system_names": "Curious more about the people who faced those days than the numbers, you look for who sat in the seat on the day each of the 32 collapsed.",
    "c26_route_system_drop": "Saying 41 past loans are not the answer for this one, you bury the statistics and write the opinion for extension.",
    "c26_final_system_route_a": "So the name of whoever moves the date stays on record too, you propose a rule that every maturity extension must carry the CEO’s signature.",
    "c26_final_system_route_b": "Saying you’ll put the people with no field in the table into the terms at least, you extend but change the terms so the workers’ wages go out before interest.",
    "c26_final_system_route_c": "Saying they are the ones who will take the moved date at the very end, you warn the credit union members, who are repaid last, of the loss risk first.",
    "c26_evidence_turn_reclaim": "Saying you’ll set right the order in which advice got paid and wages didn’t, you ask the committee to claw back the 3.2 billion won advisory fee and pay wages first.",
    "c26_evidence_turn_hold": "So you don’t lose the same company as 3 years ago this time, you hold the statement and use it when you go after Haeon Partners.",
    "c26_evidence_turn_share": "Saying the people cheated out of their pay should be first to know, you tell the workers and the buyers first where the 3.2 billion won went.",
    "c26_crane_evidence_turn": "Holding Reheim Godeok’s project cost statement against the clue item by item, you trace where the lent money went.",
    "c26_creditors_evidence_turn": "Holding Reheim Godeok’s project cost statement against the clue item by item, you trace where the lent money went.",
    "c26_tower_evidence_turn": "Holding Reheim Godeok’s project cost statement against the clue item by item, you trace where the lent money went.",
    "c26_route_system_evidence_turn": "Holding Reheim Godeok’s project cost statement against the clue item by item, you trace where the lent money went.",
    "c26_start_warm_site": "Because you can’t write it without seeing where the 62 billion won went, you go to the Pyeongtaek site before writing the opinion.",
    "c26_start_warm_terms": "Because you need to know what promises the 62 billion won went out on, you check the loan agreement against the site records, page by page.",
    "c26_start_warm_draft": "Because you can’t defy the CEO outright, you draft the extension opinion first and buy time.",
    "c26_start_warm_signature": "Saying no one can watch both alone, you split the six in the group chat into those who go to the site and those who read the papers.",
    "c26_start_record_site": "Because you can’t write it without seeing where the 62 billion won went, you go to the Pyeongtaek site before writing the opinion.",
    "c26_start_record_terms": "Because you need to know what promises the 62 billion won went out on, you check the loan agreement against the site records, page by page.",
    "c26_start_record_draft": "Because you can’t defy the CEO outright, you draft the extension opinion first and buy time.",
    "c26_start_record_signature": "So what the six saw doesn’t scatter, you attach the six-post map to the opinion and leave it as an official record.",
    "c26_start_rush_site": "Because you can’t write it without seeing where the 62 billion won went, you go to the Pyeongtaek site before writing the opinion.",
    "c26_start_rush_terms": "Because you need to know what promises the 62 billion won went out on, you check the loan agreement against the site records, page by page.",
    "c26_start_rush_draft": "Because you can’t defy the CEO outright, you draft the extension opinion first and buy time.",
    "c26_start_rush_signature": "Saying it mustn’t stay something only you saw, you tell your colleagues first what you saw at the site at dawn and what the CEO said."
  },
  "pack": {
    "clue": {
      "title": "One Line in the Project Cost Statement",
      "text": "From Reheim Godeok’s project costs, a 'project advisory fee' of 3.2 billion won went to Haeon Partners two months before construction stopped. On the same day the progress report went up to 72%, and the 87 workers’ wages of 1.4 billion won never went out."
    },
    "outcomes": {
      "c26_after_warm": {
        "tag": "Stayed Beside Them",
        "title": "You spent the site’s night with the foreman who came down after 19 days",
        "text": "The night Ji Kanghyun came down the ladder, the light in the site office container stayed on late. The names of all 87 workers were called once each, and the cup noodles never ran short."
      },
      "c26_after_record": {
        "tag": "Left It in a Table",
        "title": "The seven lenders became one table",
        "text": "The seven lenders behind Reheim Godeok, their sums and their order of repayment were left on record. So was how thin the last row is."
      },
      "c26_after_rush": {
        "tag": "Went Back First",
        "title": "You returned to HQ before the applause ended",
        "text": "Leaving the workers’ applause behind, you went back to the 12th floor and opened the next item. Even on Friday night, the messenger alerts beyond the partitions didn’t stop."
      }
    },
    "continuityChallenges": {
      "c25_after_warm": {
        "title": "Stand Under the Crane with the Six from the Cherry-Blossom Path",
        "text": "The six who walked together to the end of the cherry-blossom path saw the same photo on Monday morning. A card that stands under the crane together with them holds on to trust."
      },
      "c25_after_record": {
        "title": "Read the Middle of the Map in Reverse",
        "text": "The middle of the six-post map has become a file with your name printed on it. Turn the table so the map reads not as grounds for extension but as evidence of people."
      },
      "c25_after_rush": {
        "title": "Tell Colleagues About the Dawn No One Saw",
        "text": "The CEO knew about the dawn visit you ran ahead to make. Only if you first tell your colleagues whose judgment that dawn was will fairness hold steady."
      }
    }
  }
}
