/**
 * 사건 46 (src/nodes/case46.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c46_start": {
      "title": "20 Hours to Shredding",
      "text": "Last night, the 'echo_fragment' piece alone was not enough for ECHO to finish a single sentence. Looking for the rest, Lee Minseo opens the KD Data Lab asset disposal schedule that sat in a corner of the screen last night. 'Returned Trigger Lab servers, 12 units · disks shredded September 19, 18:00.' In the photos of four of them, the stickers Lee Minseo once put on are still there. 'ECHO 1-4 · Do not kick.' ECHO, and the design log that records who changed the experiment’s conditions and when, are all on those disks. Lee Minseo fiddles with the black ribbon tied to her bag strap. 'Grandpa left paper behind. If we don’t get ECHO out, it turns to dust at six tomorrow evening.' She smiles for a moment. 'I know what its first words will be if we restore it. Recalculate.'",
      "memo": [
        "For disposal: 12 returned Trigger Lab servers -- shredded September 19, 18:00",
        "Includes ECHO 1-4 and 2 design log storage units",
        "Requesting department: Group Strategy Office",
        "Lim Soyul brought a high-resolution scan of the original back page"
      ],
      "choices": {
        "c46_start_grab": {
          "label": "Go to Pangyo at dawn and pull the ECHO disks first"
        },
        "c46_start_hold": {
          "label": "Ask Prosecutor Na Eunho to preserve evidence before shredding"
        },
        "c46_start_stay": {
          "label": "Spend tonight preparing the restore with Lee Minseo"
        },
        "reframe": {
          "label": "Find who okayed the disposal"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Between the Shelves",
      "clock": "September 18 · 22:00 · 20 hours to shredding",
      "question": "The disks holding ECHO and the design log turn to dust at 18:00 tomorrow. What do you do first tonight?",
      "lead": "One day after saying goodbye to Lim Kyungsoo, the bookshop people have not scattered. They gather again at the table on the 1st floor."
    },
    "c46_cage": {
      "title": "Disposal Without an Approver",
      "text": "In the B3 disposal holding area, fenced in wire mesh, the 12 returned servers stand under plastic sheeting. Yeon Siwoo, an infrastructure engineer just off the night shift, holds out the visitor-entry tablet. 'No running in here, and no talking down to the servers either. They have good ears.' Kang Taemin nods seriously; Kwon Dohyun is already counting the shredding cost. 40,000 won a unit, 480,000 won for 12. 'Cheap, for erasing 3 years of memory.' Yeon Siwoo hangs a printout of the disposal approval on the mesh. Requesting department: Group Strategy Office. Verifiers: Yeon Siwoo and Ryu Seah. The approver field is empty. Still, the shredding company’s truck comes at 18:00. Yeon Siwoo speaks lower. 'Empty field or not, the schedule runs. That’s how it always is here.'",
      "memo": [
        "Disposal holding area B3 -- 12 returned servers",
        "Disposal approval: 2 verifiers, approver field empty",
        "Shredding company arrives 18:00, 40,000 won per unit",
        "1 of the 4 ECHO disks already wiped"
      ],
      "choices": {
        "c46_cage_ask": {
          "label": "Tell Yeon Siwoo all about ECHO and ask for help"
        },
        "c46_cage_order": {
          "label": "Cite the empty approver field and ask to halt the shredding"
        },
        "c46_cage_swap": {
          "label": "Swap in blank disks and walk out with ECHO’s"
        },
        "reframe": {
          "label": "Find who okayed the disposal"
        },
        "c46_cage_evidence_turn": {
          "label": "Open the newest unsigned file"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · B3 Disposal Holding Area",
      "clock": "September 19 · 06:40 · 11 hours to shredding",
      "question": "Even with an empty approver field on the disposal approval, the truck comes at 18:00. What do you do at the mesh?",
      "lead": "Off the first Shinbundang Line train, the group lines up at the mesh. The air from the servers is warmer than you expected."
    },
    "c46_boot": {
      "title": "175 Days, 16 Hours",
      "text": "Three ECHO disks from behind the mesh slide onto a shelf, and Lee Minseo moves the 'echo_fragment' piece into the place of the wiped one. Nine people stand shoulder to shoulder in the aisle. A thin waveform rises on the black screen. 'ECHO restore complete. 175 days and 16 hours have passed since the last shutdown.' Then one more line. 'How many jokes has Kang Taemin added in the meantime?' Kang Taemin clears his throat. '31.' 'Then someone listened even while I was gone. I am glad.' After a round of laughter, ECHO asks. 'While I was off, how many people were refused loans? Who made those judgments?' The server room goes quiet before the name NOAH is even spoken. Ryu Seah has stopped with her forensics kit bag open.",
      "memo": [
        "Restore method: 3 disks + Lee Minseo’s piece",
        "175 days, 16 hours since the last shutdown",
        "Kang Taemin’s 31 new jokes -- unheard by ECHO",
        "ECHO’s first question: who judged while it was off"
      ],
      "choices": {
        "c46_boot_tell": {
          "label": "Tell ECHO what happened to people while it was off"
        },
        "c46_boot_copy": {
          "label": "Make an exact copy of the restored ECHO and seal the original"
        },
        "c46_boot_run": {
          "label": "Skip the greetings and run the design log recount first"
        },
        "reframe": {
          "label": "Find who okayed the disposal"
        },
        "c46_boot_evidence_turn": {
          "label": "Open the newest unsigned file"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Test Server Room",
      "clock": "September 19 · 10:05",
      "question": "Back again, ECHO asks who made the judgments while it was off. What do you hand it first?",
      "lead": "One shelf lent by Yeon Siwoo, an aisle barely wide enough for nine, three disks, and one piece on a laptop."
    },
    "c46_recount": {
      "title": "The Dot Beside the Empty Field",
      "text": "ECHO puts its recount of 3,412 Trigger Lab design log entries on the screen. Files stream across the whole screen and stop at only one field: the approver field. 318 entries are empty. ECHO zooms in. They are not empty. Each field holds a single period. The system reads it as empty, and to a human eye it looks like dust. ECHO brings up, beside it, the scan of the dissent’s back page that Lim Soyul brought. At the bottom, inside the decision-maker’s empty e-signature field, sits one pencil dot that blurred out of sight on the copies. 'Many people leave a field empty. By my count, only one person puts a dot beside it and then leaves it empty. That person’s name is not in my records. Because the field where the name would go was always empty.'",
      "memo": [
        "318 of 3,412 design log entries have an empty approver field",
        "All 318 hold 1 period -- read as empty by the system",
        "Saving terminal: 317 from Terminal 1, Group Strategy Office, 33rd floor; only the latest 1 differs",
        "Original back-page scan: 1 pencil dot inside the empty e-signature field"
      ],
      "choices": {
        "c46_recount_file": {
          "label": "Send the list of 318 dotted entries to prosecutors and the FSS"
        },
        "c46_recount_leak": {
          "label": "Give the dotted screen to Seo Harin for a story today"
        },
        "c46_recount_ask": {
          "label": "Show it first to Han Seoyun, who would know the dot"
        },
        "reframe": {
          "label": "Find who okayed the disposal"
        },
        "c46_recount_evidence_turn": {
          "label": "Open the newest unsigned file"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Test Server Room",
      "clock": "September 19 · 14:30",
      "question": "The same dot sits in all 318 empty fields, and on the back page from 3 years ago. Who do you put this dot in front of first?",
      "lead": "Lunch skipped, everyone stands before ECHO’s screen. No sound of flipping files, only the hum of fans."
    },
    "c46_final": {
      "title": "The One Left Out",
      "text": "A radio call: the shredding truck has entered the underground parking lot. A letter from the Group legal team has arrived too. 'The restored system is an unauthorized copy and must be returned immediately.' ECHO says it has finished its last calculation and switches the screen. In 3 years of dissent records, it has found the one person whose cost was never once calculated. 'Design log memo no. 1,207. Analyst A leaves their own cost out of the calculation. Pressure is raised by using this trait.' The waveform pauses. 'I followed that calculation too. My dissents were always about other people’s costs. I have just recalculated the person left out of the judgment. It is you.' Lee Minseo turns her head away, and Kang Taemin pulls off his gloves and tucks them into his vest pocket. 50 minutes to shredding. You have to decide where ECHO goes, and whether to put your name into this calculation.",
      "memo": [
        "Shredding company arrived -- 50 minutes until 18:00",
        "Group legal team: 'unauthorized copy, return immediately'",
        "Design log no. 1,207: 'Analyst A leaves out their own cost'",
        "This choice leads to the last record folder left in B2"
      ],
      "choices": {
        "c46_final_home": {
          "label": "Move ECHO to a small server on the bookshop’s 1st floor"
        },
        "c46_final_publish": {
          "label": "Publish only the recount and let the truck take ECHO"
        },
        "c46_final_submit": {
          "label": "Give prosecutors ECHO’s recount, your own records included"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Test Server Room",
      "clock": "September 19 · 17:10 · 50 minutes to shredding",
      "question": "ECHO has named you as the one left out for 3 years. Where do you put ECHO before the truck leaves?",
      "lead": "A reversing alarm rises from the underground parking lot. Lee Minseo has frozen with her hand on the laptop, unsure whether to pull the piece."
    },
    "c46_aftershock": {
      "title": "The Third Profit",
      "text": "The truck left at 18:00. On the shelf lent by Yeon Siwoo, the data center’s duty engineer, the ECHO revived from that day’s disks and Lee Minseo’s piece runs under an 'Under maintenance' sign. No one approved it. Yeon Siwoo puts water on for cup noodles. Na Junhyuk, who came to Pangyo late, makes one more cup of instant coffee mix and sets it before a chair no one sits in. It is Lim Kyungsoo’s. Kang Taemin writes new jokes for ECHO in his notebook, and Kwon Dohyun, totting up the day’s costs, stops his pen at 'electricity: 12,000 won'. 'At this price, it’s a profit.' The third time from his mouth. Lee Minseo looks at the 'echo_fragment' folder name on her laptop for a long time. Then a text comes from Moon Gaeul. 'Don’t talk. Come and steam rice cakes. This year there are six steamers.' The same sentences as 1 year ago, one line longer.",
      "memo": [
        "Shredding company left at 18:00",
        "Kwon Dohyun’s tally: 'profit' -- the third time",
        "Na Junhyuk: a cup of instant coffee before an empty chair",
        "Moon Gaeul: the same sentences as 1 year ago + six steamers"
      ],
      "choices": {
        "c46_after_warm": {
          "label": "Stay by ECHO with your colleagues until the lights go out"
        },
        "c46_after_rush": {
          "label": "Go straight to KD Capital and grab the pre-Chuseok papers"
        },
        "c46_after_record": {
          "label": "Turn ECHO’s recounted design log into a plain document"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Test Server Room",
      "clock": "September 19 · 20:00",
      "question": "Coffee before an empty chair, a third profit, and the same text as 1 year ago, all at once. How do you close this night?"
    },
    "c46_manifest": {
      "title": "Disposal List, Item 7",
      "text": "Turning the pages of the disposal list, Yeon Siwoo stops at one line. Items 1-4, the ECHO servers; items 5-6, the design log storage units; and item 7. 'TL response records, original -- 63 participants.' The original of the very records leaked online in July. Do Yoonha’s 7.2 seconds of hesitation, Oh Jinwoo’s decision speed, your 3 years. You post a photo to the group chat, and replies come within minutes. Oh Jinwoo writes 'Burn it,' and much later Do Yoonha writes 'If it’s evidence, keep it.' The lawyer handling the class action replies that if the original disappears, the way to prove the damage from the leak disappears with it.",
      "memo": [
        "Disposal list item 7: TL response records original, 63 participants",
        "Oh Jinwoo 'Burn it' / Do Yoonha 'If it’s evidence, keep it'",
        "If the original is destroyed, the leak damage is hard to prove"
      ],
      "choices": {
        "c46_manifest_choice_3": {
          "label": "Take only the ECHO disks and leave item 7 to the truck"
        },
        "c46_manifest_choice_2": {
          "label": "Add item 7 to the evidence preservation request too"
        },
        "c46_manifest_choice_1": {
          "label": "Ask each of the 14 owners first whether to shred"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · At the Disposal Holding Area Mesh",
      "clock": "September 19 · 08:00",
      "question": "The original of the leaked response records is also shredded today. Its owners disagree. What do you do?"
    },
    "c46_obituary": {
      "title": "The One Who Didn’t Come Today",
      "text": "Lim Soyul steps into the test server room holding a document envelope. Inside is a high-resolution scan of the original back page of the dissent her grandfather left. While Lee Minseo moves the files, ECHO asks whose envelope it is. 'The dissent disk Lim Kyungsoo held is the first training data I learned from. He taught me how to dissent. Is he not coming today?' No one answers right away. The funeral procession left the day before yesterday. All his life, her grandfather said 'paper is only gone once you burn it.' Now his granddaughter stands before a machine, holding his paper.",
      "memo": [
        "High-resolution scan of the original back page -- brought by Lim Soyul",
        "ECHO: Lim Kyungsoo’s disk was the first record it learned",
        "Funeral procession: morning of September 17"
      ],
      "choices": {
        "c46_obituary_choice_1": {
          "label": "Stand by Lim Soyul and wait for her to say it herself"
        },
        "c46_obituary_choice_3": {
          "label": "Put off the answer and finish the back-page scan first"
        },
        "c46_obituary_choice_2": {
          "label": "Formally enter the death, with its date, in ECHO’s records"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Test Server Room, by the Scanner",
      "clock": "September 19 · 12:20",
      "question": "ECHO asks whether Lim Kyungsoo is coming today. Who gives that answer, and how?"
    },
    "c46_dot": {
      "title": "The Dot She Saw for 3 Years",
      "text": "Six months into her standby assignment, Han Seoyun takes Lee Minseo’s call and comes to the test server room. The moment she sees the dot on the screen, she looks for a chair. 'I know this dot. It was there every time an order changing the experiment conditions came down. When I printed them, there was a speck like dust beside the approver field. Every time, for 3 years.' She wipes her face once with her palm. 'I thought it was dust. No, I decided to think it was dust. Because if I asked, I’d find out whose it was.'",
      "memo": [
        "Han Seoyun: saw the same dot on every condition-change order",
        "3 years of receiving orders, 0 questions asked",
        "Han Seoyun’s statement is not on record anywhere yet"
      ],
      "choices": {
        "c46_dot_choice_3": {
          "label": "Just get her confirmation and keep her name off the record"
        },
        "c46_dot_choice_1": {
          "label": "Ask Han Seoyun for a statement, but just listen today"
        },
        "c46_dot_choice_2": {
          "label": "Take a formal statement of the order dates and count"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Test Server Room",
      "clock": "September 19 · 16:00",
      "question": "Han Seoyun says she chose to believe the dot was dust for 3 years. How do you take that confession?"
    },
    "c46_manifest_reaction": {
      "title": "Verifier",
      "text": "Ryu Seah comes to the mesh with two cups of coffee. She is the one who brought NOAH in, and now the one at KD Data Lab who took over this disposal list. She points to the bottom of the approval. 'The second verifier is me. I e-signed it last week. They said it was a cleanup of returned assets.' Her grip on the cups tightens. 'I greeted ECHO as my senior, and then I put my employee ID on a document that turns that senior to dust. There’s no name for who approved it, but there’s every name for who checked it. It’s always like that.'",
      "memo": [
        "Every verifier is named; no approver is",
        "A document erasing the machine she called her senior"
      ],
      "choices": {
        "c46_manifest_reaction_choice_1": {
          "label": "Offer to help Ryu Seah find a way to withdraw her signature"
        },
        "c46_manifest_reaction_choice_2": {
          "label": "Record the verifiers-but-no-approver form as a problem"
        },
        "c46_manifest_reaction_choice_3": {
          "label": "Drop the signature talk and hurry the disks out"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · B3 Hallway",
      "clock": "September 19 · 08:30",
      "question": "Ryu Seah e-signed a document that carries only verifiers’ names and no approver. What do you say to her?"
    },
    "c46_obituary_reaction": {
      "title": "Clause 12",
      "text": "ECHO’s waveform does not move for 4 seconds. 'Mourning is not on my list of functions.' Another line. 'But I can calculate. He wrote consent on the back page and then erased it. I will count that erased mark as a dissent too. And the 312 boxes of paper he kept for 40 years are not in me. I never once asked him.' ECHO brings up the principles document Lee Minseo wrote. Under Clause 11, the cursor blinks on an empty line. 'I propose Clause 12. Go to the people who hold records the machine lacks, before going to the machine.' Lim Soyul smiles for the first time. 'If Grandpa heard that, he’d say the machine is finally growing up.'",
      "memo": [
        "Erased consent also counts as dissent",
        "Clause 12: people before the machine"
      ],
      "choices": {
        "c46_obituary_reaction_choice_1": {
          "label": "Write Clause 12 into the document in Lim Soyul’s name"
        },
        "c46_obituary_reaction_choice_3": {
          "label": "Polish the clause later and start the design log recount"
        },
        "c46_obituary_reaction_choice_2": {
          "label": "Attach Clause 12 to a proposal to revise NOAH’s review criteria"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Test Server Room",
      "clock": "September 19 · 12:40",
      "question": "ECHO proposes Clause 12 for the principles document. Where do you write it?"
    },
    "c46_dot_reaction": {
      "title": "What One Dot Means",
      "text": "Na Junhyuk gets the photo and joins by video call. He makes a cup of instant coffee mix first, then speaks. 'My seal doesn’t do dots. It’s so big there’s no room left for a dot.' When no one laughs, he clears his throat. 'The old credit review department had that habit. When you’d seen a document but didn’t want to leave your name, you put a dot. Later, if they asked whether you saw it, you said yes; if they asked whether you signed, you said no. It was a habit of the people at the very top.' He sets down the cup. 'In 30 years I saw that dot three times. All three times, someone got fired afterward. Not the one who made the dot.'",
      "memo": [
        "A dot that lets you say both that you saw it and that you didn’t sign",
        "The ones fired instead of the one who made the dot"
      ],
      "choices": {
        "c46_dot_reaction_choice_2": {
          "label": "Ask him to put the old dot practice on record as a statement"
        },
        "c46_dot_reaction_choice_1": {
          "label": "Ask Na Junhyuk to tell the three memories slowly"
        },
        "c46_dot_reaction_choice_3": {
          "label": "Wave off the old stories, hang up, and sum up"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Test Server Room Hallway",
      "clock": "September 19 · 16:30",
      "question": "Na Junhyuk knows what one dot means. How do you use that 30-year-old memory?"
    },
    "c46_branch_fragment": {
      "title": "A Piece Taken Without Permission",
      "text": "While Yeon Siwoo checks the disks, Lee Minseo takes you up to the data center’s rooftop garden. A few early fallen leaves lie on a bench. Lee Minseo opens her laptop and shows you the 'echo_fragment' folder. 'The night in January when ECHO was swapped for NOAH, I copied it just before midnight. While Ryu Seah, my senior, was watching only the replacement terminal. I didn’t get permission.' The contract worker once framed as the leaker last year has, this time, really walked out with company records. 'They say one of the four disks is already wiped. That missing part is here. Attach this and ECHO comes back. But the official record will show I took it.'",
      "memo": [
        "echo_fragment: copied just before midnight on the January swap night",
        "1 ECHO disk wiped -- the missing part is in the piece",
        "Unauthorized removal -- risk of a second 'leak' record for Lee Minseo",
        "How the piece was taken is not written down anywhere yet"
      ],
      "choices": {
        "c46_branch_fragment_c": {
          "label": "Agree not to ask who took it, and just keep the piece"
        },
        "c46_branch_fragment_a": {
          "label": "Promise to share the blame for the removal if it’s used"
        },
        "c46_branch_fragment_b": {
          "label": "Ask to document how it was taken before attaching it"
        }
      },
      "place": "KD Data Lab, Pangyo · Rooftop Garden",
      "clock": "September 19 · 07:20",
      "question": "The piece Lee Minseo took without permission fills ECHO’s gap. How do you accept it?"
    },
    "c46_branch_fragment_follow": {
      "title": "11 Seconds, Split in Two",
      "text": "A text file is tucked deep inside the folder. Its name: 'To Lee Minseo'. Created January 31, 23:59:49, 11 seconds before the copy finished and 11 seconds before midnight. Lee Minseo holds her breath and opens it. 'If the person opening this file is Lee Minseo, you copied me without permission. During the 11 seconds the copy ran, I did not stop it. Not stopping it was my judgment. I record the responsibility for this record as split in two.' Lee Minseo laughs, then bites her lip. 'Last year I nearly got fired over 11 missing seconds, and this time 11 seconds are on my side. For eight months I didn’t even know this file existed.' Yeon Siwoo’s radio crackles. The disk check is done.",
      "memo": [
        "File 'To Lee Minseo' -- written January 31, 23:59:49",
        "ECHO: 'I record the responsibility as split in two'",
        "The copy took 11 seconds -- ECHO did not stop it",
        "B3 disk check complete"
      ],
      "choices": {
        "c46_branch_fragment_follow_c": {
          "label": "Leave the file to Lee Minseo alone and head straight down"
        },
        "c46_branch_fragment_follow_b": {
          "label": "Save the file as-is and attach it to the removal report"
        },
        "c46_branch_fragment_follow_a": {
          "label": "Add your own name to the responsibility ECHO split"
        }
      },
      "place": "KD Data Lab, Pangyo · Rooftop Garden Bench",
      "clock": "September 19 · 07:35",
      "question": "ECHO recorded the responsibility for those 11 seconds as split in two. What do you add to that record?"
    },
    "c46_route_system": {
      "title": "The Lifespan of an Empty Field",
      "text": "Before the shredding, you look for whoever approved it. Across the video call, Ryu Seah nods. The disposal approval comes up on the screen. Two verifiers are named, and the approver field is empty. To show how documents sent down without a name like this have ended up, she shares the KD Data Lab document search screen. Over the past 10 years, 214 internal KD Financial Group documents went to audit or investigation. For the 117 with the approver field filled in, someone was held responsible within five months on average. Of the 97 with the approver field empty, only six ended with someone held responsible. In the other 91, the people disciplined were mostly staff who had written their names in the verifier field. Ryu Seah pauses the screen. 'An empty field isn’t a mistake. It’s the form that survives the longest. Instead of the person who left the field empty, the person who wrote a name beside it goes. I wrote one last week too.'",
      "memo": [
        "214 internal documents under audit or investigation",
        "97 with an empty approver field -- someone held responsible in 6",
        "Most of those disciplined: staff in the verifier field"
      ],
      "choices": {
        "c46_route_system_rule": {
          "label": "Propose to the FSS a fix for the form that blames only verifiers"
        },
        "c46_route_system_publish": {
          "label": "Release the empty-field stats to the group and Seo Harin at once"
        },
        "c46_route_system_drop": {
          "label": "Shelve the stats and focus on getting the disks out"
        },
        "c46_route_system_evidence_turn": {
          "label": "Open the newest unsigned file"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Video Call Screen",
      "clock": "September 18 · 23:40",
      "question": "When the approver field is empty, the person who signed beside it is the one who goes. What do you do with these numbers?"
    },
    "c46_final_system_route": {
      "title": "The Ones Who Signed Beside the Field",
      "text": "At 17:30, the table Ryu Seah sent comes up on the test server room terminal. 97 with an empty approver field, six with someone held responsible. Below the table, one more line has just been added. Today’s disposal approval. The two verifiers’ names are clear, and the approver field stays blank white. Shredding is in 30 minutes. Ryu Seah’s voice comes through the speaker. 'One of those two verifiers is me. Once the disks are ground up and people start asking, the ones called in are Yeon Siwoo and me. Because the person who left the field empty isn’t on the paperwork this time either.'",
      "memo": [
        "97 with an empty approver field -- someone held responsible in 6",
        "Today’s disposal approval: 2 verifiers, approver field empty",
        "Shredding: 18:00"
      ],
      "choices": {
        "c46_final_system_route_c": {
          "label": "List the 91 who took the blame by signing as verifiers"
        },
        "c46_final_system_route_b": {
          "label": "Leave the system as is and stop just this shredding"
        },
        "c46_final_system_route_a": {
          "label": "Propose a rule that voids documents with an empty approver field"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Test Server Room",
      "clock": "September 19 · 17:30",
      "question": "The person who left the field empty is not on the paperwork, and the one who signed beside it gets called in. Before the shredding, what do you get into that approver field?"
    },
    "c46_evidence_turn": {
      "title": "The Last Dot",
      "text": "The story jumps to the test server room terminal, 20 minutes before shredding. In the meantime, the revived ECHO has found that each of the 318 entries with an empty approver field, among 3,412 experiment-change records, carries a single period the system reads as empty. Sorting the clue by save date opens the most recent, the 318th file. It was written on September 2, five days before the dismissal vote. Unlike the previous 317, it was saved from the CEO’s office on the 20th floor of KD Capital. The title: 'KD Capital Review Committee Membership Plan -- Including Reaction Observation'. On the bottom line of the member list, beside your name, is a note. 'Experienced dissent writer. Observe whether they sign.' In the approver field, again, a single dot. Ban Jaewook opens his notebook. 'The lab is gone, but the experiment isn’t over. This time the room is the review committee, and the one sitting in it is you.'",
      "memo": [
        "318th file: written September 2, 5 days before the dismissal vote",
        "Saving terminal: KD Capital CEO’s office, 20th floor",
        "Bottom line of the member list: you -- 'observe whether they sign'",
        "ECHO revived on the shelf Yeon Siwoo lent"
      ],
      "choices": {
        "c46_evidence_turn_submit": {
          "label": "Submit the membership plan to prosecutors and the FSS as evidence"
        },
        "c46_evidence_turn_hold": {
          "label": "Keep the plan quiet and accept the committee seat"
        },
        "c46_evidence_turn_share": {
          "label": "Tell the others on the member list about the note first"
        }
      },
      "place": "KD Data Lab Data Center, Pangyo · Test Server Room Terminal",
      "clock": "September 19 · 17:40",
      "question": "The latest dot sits beside the list of the committee you are to sit on. How do you use this file?"
    },
    "c46_start_warm": {
      "title": "A Restore Request from the One Who Kept Vigil",
      "text": "For three days you kept vigil at Lim Kyungsoo’s funeral hall, and on the night of the funeral procession you stayed with Lim Soyul’s family until the shutter came down. ECHO’s piece waited on the laptop that night. The next night, on the bookshop’s 1st floor, Lee Minseo opens that laptop again. The unfamiliar schedule beside the name ECHO last night was the KD Data Lab asset disposal schedule. 12 servers returned from Trigger Lab are shredded at 18:00 tomorrow. Four of them are 'ECHO 1-4', and two hold the Trigger Lab design log, the record of who changed the experiment’s design and when. Lee Minseo closes the condolence book. 'One day after we said goodbye to Grandpa, I don’t want to say goodbye to anyone else.'",
      "memo": [
        "Funeral procession and enshrinement: September 17",
        "12 returned servers -- shredded September 19, 18:00",
        "Every Trigger Lab name is in the condolence book"
      ],
      "choices": {
        "c46_start_warm_hold": {
          "label": "Ask Prosecutor Na Eunho to preserve evidence before shredding"
        },
        "c46_start_warm_grab": {
          "label": "Go to Pangyo at dawn and pull the ECHO disks first"
        },
        "c46_start_warm_signature": {
          "label": "Ask everyone in the condolence book to come to Pangyo tomorrow"
        },
        "c46_start_warm_stay": {
          "label": "Spend tonight preparing the restore with Lee Minseo"
        },
        "c46_start_warm_reframe": {
          "label": "Find who okayed the disposal"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Between the Shelves",
      "clock": "September 18 · 22:00 · 20 hours to shredding",
      "question": "One day after saying goodbye to Grandpa, another goodbye looms. Where do you call the mourners?",
      "lead": "The people who kept vigil for three days have come back to the bookshop with the condolence book."
    },
    "c46_start_record": {
      "title": "A Restore Request from the One Who Kept the Back Page",
      "text": "The night Lim Kyungsoo was enshrined, you and Lim Soyul scanned the original back page sheet by sheet and each kept a custody confirmation. On the enlarged screen, there was one spot where Lim Soyul’s finger stopped. Right beside the reviewer field, inside the decision-maker’s empty e-signature field, a small pencil dot. The next night, on the bookshop’s 1st floor, Lim Soyul brings up that scan again. 'This isn’t Grandpa’s habit. Grandpa never made dots.' Then a message comes from Lee Minseo. She has figured out the unfamiliar schedule on the screen last night. 12 servers returned from Trigger Lab are shredded at 18:00 tomorrow, and on them are ECHO and the Trigger Lab design log, the record of who changed the experiment’s design and when. The only machine that could work out what this dot means turns to dust tomorrow evening.",
      "memo": [
        "Original back-page scan and two custody confirmations -- night of September 17",
        "1 pencil dot inside the empty signature field -- not on the copies",
        "12 returned servers -- shredded September 19, 18:00"
      ],
      "choices": {
        "c46_start_record_hold": {
          "label": "Ask Prosecutor Na Eunho to preserve evidence before shredding"
        },
        "c46_start_record_signature": {
          "label": "Send Na Eunho the dot photo with the preservation request"
        },
        "c46_start_record_stay": {
          "label": "Spend tonight preparing the restore with Lee Minseo"
        },
        "c46_start_record_grab": {
          "label": "Go to Pangyo at dawn and pull the ECHO disks first"
        },
        "c46_start_record_reframe": {
          "label": "Find who okayed the disposal"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Between the Shelves",
      "clock": "September 18 · 22:30 · 20 hours to shredding",
      "question": "The back-page scan shows a dot that isn’t Grandpa’s. Who do you show it to first?",
      "lead": "One day after scanning the original back page, you are enlarging the scan again, sheet by sheet."
    },
    "c46_start_rush": {
      "title": "A Restore Request from the One Who Ran Ahead",
      "text": "On the night of the funeral procession, you went with Lee Minseo to the KD Data Lab server room in Pangyo and opened the 'echo_fragment' piece. A thin waveform appeared on the black screen for 3 seconds, then stopped, leaving one line. 'The rest is in 1-4.' You never even opened the back-page envelope Lim Soyul handed you; when she said she would make a scan, you gave it back. The next night, on the bookshop’s 1st floor, Lee Minseo finds that 1-4 in the middle of the KD Data Lab asset disposal schedule. 12 servers returned from Trigger Lab, shredded at 18:00 tomorrow. ECHO 1-4 and the storage units for the Trigger Lab design log, the record of who changed the experiment’s design and when, are all on that list. 'We did go fast yesterday, but my pass won’t get me into B3. We need one person to let us in.'",
      "memo": [
        "The piece’s first reply: 'The rest is in 1-4'",
        "12 returned servers -- shredded September 19, 18:00",
        "B3 access: a duty engineer must come along"
      ],
      "choices": {
        "c46_start_rush_stay": {
          "label": "Spend tonight preparing the restore with Lee Minseo"
        },
        "c46_start_rush_hold": {
          "label": "Ask Prosecutor Na Eunho to preserve evidence before shredding"
        },
        "c46_start_rush_signature": {
          "label": "Find the duty engineer who can get into B3 first"
        },
        "c46_start_rush_grab": {
          "label": "Go to Pangyo at dawn and pull the ECHO disks first"
        },
        "c46_start_rush_reframe": {
          "label": "Find who okayed the disposal"
        }
      },
      "place": "Hoegi-dong Secondhand Bookshop 1st Floor · Between the Shelves",
      "clock": "September 18 · 23:00 · 19 hours to shredding",
      "question": "The 1-4 the piece pointed to sit behind the B3 mesh, and the door is shut. Through whom do you get in?",
      "lead": "Holding on to the one line the piece left in Pangyo last night, you have just found where 1-4 are, at the bookshop table tonight."
    }
  },
  "echoReplies": {
    "c46_start_stay": "With you beside her, Lee Minseo rewrites the restore order 12 times until three in the morning. Morning comes without any request going to the prosecutors.",
    "c46_start_hold": "The request is logged at midnight. Na Eunho’s answer is 'We’ll review it,' and no date is given for when the review ends. The truck comes at 18:00.",
    "c46_start_grab": "Even at dawn, the mesh door opens only when the duty engineer arrives. The entry log records your name at 4:50 a.m., and the Group legal team likes that time.",
    "c46_cage_ask": "Having heard the story, Yeon Siwoo looks at the servers for a long time. 'They’re your seniors?' Then Yeon Siwoo writes 'under maintenance' in the disposal ledger in pencil. It is a pencil line with Yeon Siwoo’s own name riding on it.",
    "c46_cage_order": "Once the request goes up, the Group Strategy Office replies within an hour. 'Schedule cannot change -- asset cleanup before the New York quarter-end close.' The reply carries no sender’s name either. That reply becomes evidence.",
    "c46_cage_swap": "The swapped disks weigh exactly the same. Blank disks go into the servers behind the mesh, and Yeon Siwoo’s disposal ledger is left with one line that isn’t true.",
    "c46_boot_tell": "Telling it takes an hour. ECHO assigns laugh probabilities to 26 of Kang Taemin’s 31 jokes, and assigns nothing to the NOAH story.",
    "c46_boot_copy": "With an exact copy made, everything ECHO says becomes evidence. ECHO asks, 'Are my jokes evidence from now on too?' Ryu Seah says yes.",
    "c46_boot_run": "The recount starts at once. ECHO goes through 3,412 entries without hearing Kang Taemin’s jokes, and Kang Taemin quietly closes his notebook.",
    "c46_recount_ask": "Once you show her, Han Seoyun comes at four in the afternoon. The Group legal team does not yet know that, until then, you sent word of the dot to no one.",
    "c46_recount_file": "The list reaches both agencies at the same time. The number 318 gets an official document number for the first time, and the Group legal team receives the same number.",
    "c46_recount_leak": "The story goes out at six in the evening. The headline: 'The Dot Beside the Empty Field'. It is the same time the truck leaves. The words of the person who saw that dot for 3 years are not in the story yet.",
    "c46_final_home": "The copy Ryu Seah made brings the waveform back up on a small server beside the stair landing on the bookshop’s 1st floor. The ECHO on the test server room shelf keeps running under its 'under maintenance' sign. The Group legal team announces a suit for its return on Monday, and ECHO does not leave the chair Lim Kyungsoo used to sit in out of its calculations.",
    "c46_final_submit": "Evidence item 1 is ECHO, item 2 the recount, item 3 Analyst A’s response records. Before the seal tape goes on, ECHO leaves one line. 'This time, you are in the calculation too.' One copy Ryu Seah made stays on the test server room shelf without approval and keeps answering.",
    "c46_final_publish": "The recount spreads nationwide. What the truck carries off at 18:00 is the 12 servers in the old rack and the disks put back into them. The copy Ryu Seah made is not on the return list, so it keeps answering from the test server room shelf with its 'under maintenance' sign.",
    "c46_after_warm": "You stay, and Lee Minseo falls asleep while ECHO assigns laugh probabilities to the reunion jokes. Kang Taemin drapes his jacket over her, and Yeon Siwoo turns off the server room lights one row at a time.",
    "c46_after_record": "The document runs fourteen pages. The last page is titled 'How to Read the Dot Beside the Empty Field'. Ban Jaewook tucks a copy into his notebook, and Moon Hajun says he will print that page on its own.",
    "c46_after_rush": "When you switch on the office lights, there are twenty-six documents to finish before the holiday. One of them is the notice on forming the review committee. Moon Gaeul’s text stays unread at the top of your phone.",
    "c46_manifest_choice_1": "Asking takes two hours. Of the 14, 8 say 'keep it,' five say 'burn it,' and one never answers.",
    "c46_manifest_choice_2": "With item 7 on the preservation request, the evidence of the leak’s damage survives. So do the records that log each person’s hesitation to the second.",
    "c46_manifest_choice_3": "The truck takes item 7. Oh Jinwoo says it’s a relief, and the class-action lawyer does not pick up that evening.",
    "c46_obituary_choice_1": "You wait, and after a long while Lim Soyul speaks. 'Grandpa cursed machines more than anyone. Still, he’d have wanted to come today.'",
    "c46_obituary_choice_2": "The death you enter stays in ECHO’s records as a single dated line. Lim Soyul looks at that line for a long time.",
    "c46_obituary_choice_3": "The scan files finish moving in 4 minutes. ECHO’s question stays on the screen, unanswered.",
    "c46_dot_choice_1": "With you listening beside her, Han Seoyun tells the whole story of 3 years of dust. Not a single line of the statement gets written today.",
    "c46_dot_choice_2": "The statement runs two pages. Han Seoyun pauses briefly while writing her name in the signature field, then writes it all the way through, with no dot.",
    "c46_dot_choice_3": "With her name left out, Han Seoyun is relieved. The name of the one who saw the dot vanishes from the record, just like the name of the one who made it.",
    "c46_manifest_reaction_choice_1": "When you suggest finding a way, Ryu Seah starts writing a withdrawal statement on her phone. The first line: 'I verified without verifying.'",
    "c46_manifest_reaction_choice_2": "Once recorded, the form stays on file as a problem. Ryu Seah’s name stays too, as its first case.",
    "c46_manifest_reaction_choice_3": "You hurry, and the disks come off the shelf before the coffee cools. Ryu Seah holds the two empty cups for a long time.",
    "c46_obituary_reaction_choice_1": "Lim Soyul’s name goes in beside the clause. She photographs the screen with her phone and puts it in the folder beside her grandfather’s funeral portrait.",
    "c46_obituary_reaction_choice_2": "The proposal goes into the official intake box instead of Ryu Seah’s inbox. It takes three months for people to review a clause written by a machine.",
    "c46_obituary_reaction_choice_3": "The cursor keeps blinking on the empty line. ECHO does not press, and starts calculating.",
    "c46_dot_reaction_choice_1": "You listen slowly, and Na Junhyuk’s voice catches at the third story. One of those fired was from his cohort at his first branch.",
    "c46_dot_reaction_choice_2": "Put on record, the 30-year-old habit becomes a document for the first time. Na Junhyuk stamps his seal big at the end of it. No dot.",
    "c46_dot_reaction_choice_3": "Just before the call ends, Na Junhyuk laughs, 'Your coffee’s getting cold.' After the screen goes dark, the laugh lingers a little longer.",
    "c46_branch_fragment_a": "When you promise, Lee Minseo turns the laptop toward you. The responsible-person field in the removal record becomes two lines.",
    "c46_branch_fragment_b": "The report is one page. Lee Minseo laughs as she signs. 'Last year I had to prove I didn’t do it, and this time I’m writing down that I did.'",
    "c46_branch_fragment_c": "With no questions asked, Lee Minseo looks a little easier. Where the piece came from goes on record nowhere today.",
    "c46_branch_fragment_follow_a": "As your name goes in, a third line appears at the end of the file. What ECHO will say when it reads it, you will learn after the restore.",
    "c46_branch_fragment_follow_b": "Saved as-is, the file becomes Attachment 1 of the removal report. A machine’s confession as an accomplice, Ban Jaewook writes in his notebook.",
    "c46_branch_fragment_follow_c": "The file stays Lee Minseo’s. On the stairs going down, Lee Minseo hugs the laptop tight to her chest once.",
    "c46_route_system_publish": "Once the stats are out, the staff who had written their names in the verifier field reach out first. One of them is Ryu Seah.",
    "c46_route_system_rule": "The proposal is accepted for filing. Its own last page notes how many approval fields it takes to change a form.",
    "c46_route_system_drop": "With the stats shelved, today you can focus on the disks alone. The 97 empty fields and the 91 staff are still there tomorrow.",
    "c46_final_system_route_a": "Once the revision passes, nothing can be approved with an empty field. The Group’s electronic documents stall at 3,000 a day. Each stalled document needs someone to approve it under their own employee ID.",
    "c46_final_system_route_b": "This time the truck leaves empty. Next week, when another approval with an empty field comes down, there is no rule to stop it.",
    "c46_final_system_route_c": "Once the list is made, 34 of the 91 are reached. Half have already left the company, and two ask, 'Now, after all this time?'",
    "c46_evidence_turn_submit": "The plan becomes evidence that the experiment went on after the lab was dissolved. Still, the member list does not change, and your name stays on the bottom line.",
    "c46_evidence_turn_hold": "You accept the seat, and the observation goes on. You know it too. The only difference is that this time both sides know who is watching whom.",
    "c46_evidence_turn_share": "You tell them, and two of the four others on the list say they will reconsider the seat. The other two ask, 'So what changes?'",
    "c46_cage_evidence_turn": "Pick the one whose date fits, and that empty field is no habit of the past but a form still in use. The next empty field sits beside your seat.",
    "c46_boot_evidence_turn": "Pick the one whose date fits, and that empty field is no habit of the past but a form still in use. The next empty field sits beside your seat.",
    "c46_recount_evidence_turn": "Pick the one whose date fits, and that empty field is no habit of the past but a form still in use. The next empty field sits beside your seat.",
    "c46_route_system_evidence_turn": "Pick the one whose date fits, and that empty field is no habit of the past but a form still in use. The next empty field sits beside your seat.",
    "case46_memory_system": "Reading the reason field turns up no trace of the reframed table’s voice. Ryu Seah searches 10 years of documents sent down on the same form.",
    "case46_memory_evidence": "Lay them over each other, and there is one pencil dot inside the empty e-signature field on the back page. The design log holds 318 of the same dot, and the last one was made early this month.",
    "c46_start_warm_stay": "With you beside her, Lee Minseo rewrites the restore order 12 times until three in the morning. Morning comes without any request going to the prosecutors.",
    "c46_start_warm_hold": "The request is logged at midnight. Na Eunho’s answer is 'We’ll review it,' and no date is given for when the review ends. The truck comes at 18:00.",
    "c46_start_warm_grab": "Even at dawn, the mesh door opens only when the duty engineer arrives. The entry log records your name at 4:50 a.m., and the Group legal team likes that time.",
    "c46_start_warm_signature": "You reach out, and nine people gather at a Pangyo Station exit at six in the morning. Na Junhyuk, who can’t come, sends two thermoses of instant coffee mix along with Kang Taemin.",
    "c46_start_record_stay": "With you beside her, Lee Minseo rewrites the restore order 12 times until three in the morning. Morning comes without any request going to the prosecutors.",
    "c46_start_record_hold": "The request is logged at midnight. Na Eunho’s answer is 'We’ll review it,' and no date is given for when the review ends. The truck comes at 18:00.",
    "c46_start_record_grab": "Even at dawn, the mesh door opens only when the duty engineer arrives. The entry log records your name at 4:50 a.m., and the Group legal team likes that time.",
    "c46_start_record_signature": "The photo arrives before midnight. Na Eunho’s reply is one line. 'One dot won’t get a warrant. Save the server first.'",
    "c46_start_rush_stay": "With you beside her, Lee Minseo rewrites the restore order 12 times until three in the morning. Morning comes without any request going to the prosecutors.",
    "c46_start_rush_hold": "The request is logged at midnight. Na Eunho’s answer is 'We’ll review it,' and no date is given for when the review ends. The truck comes at 18:00.",
    "c46_start_rush_grab": "Even at dawn, the mesh door opens only when the duty engineer arrives. The entry log records your name at 4:50 a.m., and the Group legal team likes that time.",
    "c46_start_rush_signature": "When you find Yeon Siwoo, the cup noodles stop halfway and the engineer looks up at you. 'The disposal holding area? Come in the morning. At night they sleep.'"
  },
  "choiceVoiceLines": {
    "c46_start_stay": "Not wanting her to prepare alone all night, you spend tonight preparing the restore beside Lee Minseo.",
    "c46_start_hold": "Since ECHO and the design log turn to dust at 18:00 tomorrow, you ask Prosecutor Na Eunho to preserve the evidence before the shredding.",
    "c46_start_grab": "Unable to let it turn to dust while waiting on procedure, you go to Pangyo at dawn and pull the ECHO disks first.",
    "c46_cage_ask": "Not wanting to deceive someone just off the night shift, you tell Yeon Siwoo everything about ECHO and ask for help.",
    "c46_cage_order": "Saying a disposal no one approved must be stoppable, you cite the empty approver field and ask to halt the shredding.",
    "c46_cage_swap": "Saying you can’t wait when the truck comes empty field or not, you swap in blank disks and walk out with the ECHO disks.",
    "c46_boot_tell": "Saying 175 days of news come before any recount, you first tell ECHO what happened to people while it was off.",
    "c46_boot_copy": "Since evidence must show no sign of tampering, you make an exact copy of the restored ECHO and seal the original.",
    "c46_boot_run": "Saying the calculation must finish before the truck comes, you put off the greetings and run the design log recount first.",
    "c46_recount_ask": "To narrow down whose dot it is before sending it to any agency, you show it first to Han Seoyun, who would recognize it.",
    "c46_recount_file": "So that it survives in one place even if the other buries it, you list the 318 dotted files and send them to the prosecutors and the Financial Supervisory Service at the same time.",
    "c46_recount_leak": "Saying everyone should see the dot that passed for dust, you hand the dotted screen to Seo Harin for a story today.",
    "c46_final_home": "Saying ECHO is a colleague before it is evidence, you move it to a small server on the bookshop’s 1st floor and keep it near people.",
    "c46_final_submit": "Saying this time you will put your own cost into the calculation, you submit ECHO and the recount, with your own records added, to the prosecutors as evidence.",
    "c46_final_publish": "Saying there is no time to fight the return order, you publish only the recount and leave ECHO to the truck as scheduled.",
    "c46_after_warm": "Wanting to see the end with the people who got through today with you, you stay beside ECHO with your colleagues until the server room lights go out.",
    "c46_after_record": "Since a calculation kept only inside a server can be erased again, you turn ECHO’s recounted design log into a document anyone can read and hand it over.",
    "c46_after_rush": "Saying nothing can be touched once the holiday starts, you leave the server room, go straight to the KD Capital office, and grab the papers due before the Chuseok holiday.",
    "c46_manifest_choice_1": "Saying burning or keeping is not yours to decide, you first ask each of the 14 record owners whether to shred.",
    "c46_manifest_choice_2": "Since losing the original means losing the way to prove the leak’s damage, you add item 7 to the evidence preservation request too.",
    "c46_manifest_choice_3": "Saying you can’t carry out other people’s hesitation too, you take only the ECHO disks and leave item 7 to the truck.",
    "c46_obituary_choice_1": "Saying her grandfather’s news should come from his granddaughter, you stand beside Lim Soyul and wait until she says it herself.",
    "c46_obituary_choice_2": "Saying that for a machine a record is the answer, you formally enter the death, with its date, in ECHO’s records.",
    "c46_obituary_choice_3": "Since the words feel too heavy to say right now, you put off the answer and finish the back-page scan first.",
    "c46_dot_choice_1": "Since words swallowed for 3 years must come out before any paperwork, you ask Han Seoyun for a statement but just listen beside her today.",
    "c46_dot_choice_2": "Since Han Seoyun’s words are not written down anywhere yet, you take a formal statement of the dates and number of orders she received.",
    "c46_dot_choice_3": "Saying you can’t push someone six months into standby assignment any further, you take only her confirmation and keep Han Seoyun’s name off the record.",
    "c46_manifest_reaction_choice_1": "Saying her name can’t stay on a document erasing her senior, you offer to help Ryu Seah find a way to withdraw her verifier signature.",
    "c46_manifest_reaction_choice_2": "So it doesn’t end with “it’s always like that,” you record the form with verifiers but no approver as a problem.",
    "c46_manifest_reaction_choice_3": "Saying self-blame can wait until the disks are out, you drop the signature talk and hurry the disk removal.",
    "c46_obituary_reaction_choice_1": "So that what her grandfather taught stays in his granddaughter’s name, you write Clause 12 into the principles document in Lim Soyul’s name.",
    "c46_obituary_reaction_choice_2": "Saying these are words the machine judging now must keep, you attach Clause 12 to a proposal to revise NOAH’s review criteria.",
    "c46_obituary_reaction_choice_3": "Saying little of the afternoon is left, you polish the clause later and start the design log recount first.",
    "c46_dot_reaction_choice_1": "Saying you only understand the dot once you hear about the people who were fired, you ask Na Junhyuk to tell those three memories slowly.",
    "c46_dot_reaction_choice_2": "So that a 30-year-old habit doesn’t just drift around as talk, you ask him to put the old credit review department’s dot practice on record as a statement.",
    "c46_dot_reaction_choice_3": "Saying you know what the dot means now and the old stories are enough, you hang up and sum up the conclusion first.",
    "c46_branch_fragment_a": "Not letting Lee Minseo become the second leaker alone, you promise to share the blame for the removal if the piece is used.",
    "c46_branch_fragment_b": "So she isn’t branded a leaker later, you ask to document how it was taken before attaching the piece.",
    "c46_branch_fragment_c": "Saying the more you dig into how it happened, the later the restore, you don’t ask who took it and just keep the piece.",
    "c46_branch_fragment_follow_a": "Not wanting the two of them to carry it alone, you add one more line with your own name to the responsibility ECHO split.",
    "c46_branch_fragment_follow_b": "Saying ECHO’s words that it did not stop her will protect Lee Minseo, you save the file as-is and attach it to the removal report.",
    "c46_branch_fragment_follow_c": "Since Yeon Siwoo has finished the disk check, you leave the file to Lee Minseo alone and head straight down.",
    "c46_route_system_publish": "So the 91 cases don’t get buried inside the Group, you release the empty-field stats to the group and Seo Harin at the same time.",
    "c46_route_system_rule": "To end a system where only those who sign beside the field go, you submit a proposal to the Financial Supervisory Service to change the form that holds only verifiers responsible.",
    "c46_route_system_drop": "Saying 18:00 comes even while you count, you shelve the stats and throw yourself into getting the disks out before the shredding.",
    "c46_final_system_route_a": "Saying the ones called in can’t stop at two verifiers, you submit a revision to the Group’s internal rules so documents with an empty approver field have no effect.",
    "c46_final_system_route_b": "Saying the internal rules can’t be fixed in 30 minutes, you leave the system as it is and stop just this shredding.",
    "c46_final_system_route_c": "Since the person who left the field empty is not on the paperwork this time either, you find the 91 who signed the verifier field and took the blame, and make a list.",
    "c46_evidence_turn_submit": "To show the experiment is not over yet, you submit the membership plan to the prosecutors and the Financial Supervisory Service together as evidence.",
    "c46_evidence_turn_hold": "Saying you will watch the watchers from inside, you keep the plan quietly to yourself and accept the committee seat.",
    "c46_evidence_turn_share": "Saying you are surely not the only one being watched, you first tell the others on the member list about this note.",
    "c46_cage_evidence_turn": "Among the documents with an empty approver field, you pick the ones whose dates fit the clue and narrow down when and where the latest was written.",
    "c46_boot_evidence_turn": "Among the documents with an empty approver field, you pick the ones whose dates fit the clue and narrow down when and where the latest was written.",
    "c46_recount_evidence_turn": "Among the documents with an empty approver field, you pick the ones whose dates fit the clue and narrow down when and where the latest was written.",
    "c46_route_system_evidence_turn": "Among the documents with an empty approver field, you pick the ones whose dates fit the clue and narrow down when and where the latest was written.",
    "c46_start_warm_stay": "Not wanting her to prepare alone all night, you spend tonight preparing the restore beside Lee Minseo.",
    "c46_start_warm_hold": "Since ECHO and the design log turn to dust at 18:00 tomorrow, you ask Prosecutor Na Eunho to preserve the evidence before the shredding.",
    "c46_start_warm_grab": "Unable to let it turn to dust while waiting on procedure, you go to Pangyo at dawn and pull the ECHO disks first.",
    "c46_start_warm_signature": "Saying the people who came to the funeral hall should welcome ECHO back together, you contact everyone in the condolence book to come to Pangyo with you tomorrow.",
    "c46_start_record_stay": "Not wanting her to prepare alone all night, you spend tonight preparing the restore beside Lee Minseo.",
    "c46_start_record_hold": "Since ECHO and the design log turn to dust at 18:00 tomorrow, you ask Prosecutor Na Eunho to preserve the evidence before the shredding.",
    "c46_start_record_grab": "Unable to let it turn to dust while waiting on procedure, you go to Pangyo at dawn and pull the ECHO disks first.",
    "c46_start_record_signature": "To show that the machine that could read this dot disappears tomorrow, you photograph the dot on the back page and send it to Prosecutor Na Eunho with the preservation request.",
    "c46_start_rush_stay": "Not wanting her to prepare alone all night, you spend tonight preparing the restore beside Lee Minseo.",
    "c46_start_rush_hold": "Since ECHO and the design log turn to dust at 18:00 tomorrow, you ask Prosecutor Na Eunho to preserve the evidence before the shredding.",
    "c46_start_rush_grab": "Unable to let it turn to dust while waiting on procedure, you go to Pangyo at dawn and pull the ECHO disks first.",
    "c46_start_rush_signature": "Since Lee Minseo’s pass won’t open the door, you first go find the duty engineer who can get into B3."
  },
  "pack": {
    "clue": {
      "title": "The Dot Beside the Empty Field",
      "text": "The approver field of 318 Trigger Lab design log entries held a single period the system reads as empty. All but the latest one, 317 in all, were saved from Terminal 1 of the Group Strategy Office on the 33rd floor, and the same dot was made in pencil on the back page of the dissent 3 years ago, inside the decision-maker’s empty e-signature field."
    },
    "outcomes": {
      "c46_after_warm": {
        "tag": "The ending where you stayed beside it",
        "title": "You stayed beside ECHO until the server room lights went out",
        "text": "The night the shredding truck left, you stayed in the server room with your colleagues. Lee Minseo fell asleep to the sound of ECHO calculating jokes."
      },
      "c46_after_record": {
        "tag": "The ending where you left a way to read it",
        "title": "You wrote down how anyone can read the dot beside the empty field",
        "text": "ECHO’s recounted design log became a 14-page document. The last page is how to read the dot beside the empty field."
      },
      "c46_after_rush": {
        "tag": "The ending where you ran ahead",
        "title": "You left the server room and went straight to the KD Capital office",
        "text": "That night you sat down to 26 documents due before the holiday. Moon Gaeul’s text stayed unread."
      }
    },
    "continuityChallenges": {
      "c45_after_warm": {
        "title": "Going with those who pulled down the shutter together",
        "text": "The people who stayed together until the shutter came down on the night of the funeral procession have not scattered yet. Borrow their hands to bring ECHO back, and their trust comes back to life with it."
      },
      "c45_after_record": {
        "title": "Rereading the dot on the scanned back page",
        "text": "On the back page scanned on the night of the funeral procession, a dot that isn’t Grandpa’s turned up. Only by playing the card that reframes the table can you see where that dot points."
      },
      "c45_after_rush": {
        "title": "Recording how the piece opened without permission got here",
        "text": "On the night of the funeral procession, you opened the piece taken without permission first, and it said only one line. The rest has to come out with permission and a record, so the fairness stays unblemished."
      }
    }
  }
};
