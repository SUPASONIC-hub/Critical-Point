/**
 * 사건 22 (src/nodes/case22.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c22_start": {
      "title": "0.8 Seconds",
      "text": "Do Yoonha holds out two phones side by side. One shows the intern name tag of Moon Hajun, assigned to Gangseo Branch. The other shows a text from Assistant Manager Tak Yerin at the same branch. To-the-End Precision, a worker cooperative (owned and run by its workers), has applied for 350 million won. A facility loan (for machinery). NOAH, the new AI review engine (a program that judges loan applications automatically), rejected it in 0.8 seconds. Reason code R-17: related-party history (someone close, like family). That person’s default was flagged. The related-party field reads: Moon Sungho, deceased. Since NOAH arrived, there has not been a single exception approval (a manager signing off outside the rules). 'Today is Hajun’s first day as an intern.'",
      "memo": [
        "To-the-End Precision facility loan application: 350 million won -- 5-axis machining center, 1 unit",
        "NOAH’s judgment time 0.8 seconds, reason code R-17",
        "Related party: Moon Sungho (deceased) -- former head of Gaon Precision",
        "Moon Hajun’s internship: 5 days, mentor Do Yoonha"
      ],
      "choices": {
        "c22_start_desk": {
          "label": "Go first to Tak Yerin’s business loan window at Gangseo"
        },
        "c22_start_code": {
          "label": "First open up what rule R-17 was built from"
        },
        "c22_start_swap": {
          "label": "Propose refiling with Foreman Kim as representative"
        },
        "reframe": {
          "label": "Keep asking NOAH why it refused, to the end"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room",
      "clock": "Fourth Monday of February · Internship Day 1 · 08:00",
      "question": "A factory’s loan was rejected in 0.8 seconds because of a dead man’s name. What do you do first?",
      "lead": "On the fourth Monday morning of February, Do Yoonha opens the analyst room door with two phones in hand."
    },
    "c22_counter": {
      "title": "At the Ticket Machine",
      "text": "Moon Hajun pins his intern name tag over his school uniform and takes his place beside the queue ticket machine in Gangseo Branch’s banking hall. He has torn a page from his sketchbook, drawn a map of the windows, and taped it up, and he is already telling elderly customers 'Passbook updates are at the machine on the right' for the twentieth-something time. At 10, Moon Gaeul comes in carrying four boxes of rice cakes. Saying they are to cheer on her intern son, she hands them out in turn to the tellers, the security guard, and the waiting customers, and in the end knocks on the branch manager’s door too. Branch Manager Seo Taekyung accepts the injeolmi and bows awkwardly. Meanwhile, Tak Yerin at Window 2, business loans, calls you over. To-the-End Precision’s rejection screen is up on her monitor. 'The owner doesn’t know yet. I only told her it’s under review.' Moon Gaeul, still handing out rice cakes, waves toward the window.",
      "memo": [
        "Intern’s first day guiding the ticket line -- Moon Hajun’s hand-drawn map",
        "Moon Gaeul: 4 boxes of rice cakes, delivered as far as the branch manager’s office",
        "To-the-End Precision rejected; applicant not yet told",
        "Tak Yerin: NOAH in full operation 2 weeks, results overturned by a person: 0"
      ],
      "choices": {
        "c22_counter_tell": {
          "label": "Tell Moon Gaeul yourself before the cakes are all handed out"
        },
        "c22_counter_appeal": {
          "label": "File a re-review request with Tak Yerin, then tell her"
        },
        "c22_counter_wait": {
          "label": "Hold the news until Hajun’s internship week ends"
        },
        "reframe": {
          "label": "Keep asking NOAH why it refused, to the end"
        },
        "c22_counter_evidence_turn": {
          "label": "Search NOAH’s training list for 'default-linked party'"
        }
      },
      "place": "KD Bank Gangseo Branch · Banking Hall",
      "clock": "Internship Day 1 · 10:00",
      "question": "Moon Gaeul, handing out rice cakes, doesn’t know about the rejection yet. When and how do you tell her?",
      "lead": "On the first day of the internship, before the shutter even goes up, an intern in a school uniform is wiping down the ticket machine."
    },
    "c22_factory": {
      "title": "To the End, 11 Times",
      "text": "Namdong Industrial Complex, Incheon. The February wind slips in through gaps in the shutter, but inside, the noise of the machines keeps the factory warm. Four of the six lathes are running, and Foreman Kim sets a kettle of barley tea on the stove. Kwon Dohyun, leafing through the business plan for the re-review, taps the desk with his ballpoint pen. 'Delivery to the end, quality to the end, responsibility to the end. “To the end” appears 11 times. In a business plan, an adverb once is enough.' In the corner, Moon Hajun quietly raises his hand. 'I wrote that.' Kwon Dohyun pauses, then circles all 11. 'Then let’s prove it with numbers.' Foreman Kim holds out a purchase order. Seon Medical, a medical device parts company: 200 prototypes by April 3. Hitting a tolerance of 0.005mm takes a 5-axis machining center (a precision machine whose cutter moves in five directions).",
      "memo": [
        "4 of 6 lathes running, 5 co-op members",
        "Business plan: 'to the end' 11 times -- written by Moon Hajun",
        "Seon Medical order: 200 prototypes by April 3",
        "Required precision 0.005mm -- impossible on the current lathes"
      ],
      "choices": {
        "c22_factory_record": {
          "label": "Rewrite Moon Sungho’s history as skill, not default"
        },
        "c22_factory_crew": {
          "label": "Rewrite the plan in numbers overnight with the members"
        },
        "c22_factory_used": {
          "label": "Cut the amount with a used machine instead of a new one"
        },
        "reframe": {
          "label": "Keep asking NOAH why it refused, to the end"
        },
        "c22_factory_evidence_turn": {
          "label": "Search NOAH’s training list for 'default-linked party'"
        }
      },
      "place": "To-the-End Precision, Namdong Industrial Complex, Incheon · Factory",
      "clock": "February · Internship Day 3 · 19:00",
      "question": "A plan that says 'to the end' 11 times will hardly win anyone over to an April 3 deadline. What do you fix?",
      "lead": "The evening you arrive with news of the rejection, machine noise leaks out through the gaps in the factory shutter."
    },
    "c22_roleplay": {
      "title": "Try Selling the Product",
      "text": "In the 3rd-floor training room at Gangseo Branch, four interns get a role-play assignment. 'Sell this month’s recommended product to a customer.' At the top of the handout are 'KD Dream Installment Fund' and the branch’s sales target, and the customer is played by Do Yoonha. Reading the handout, Moon Hajun stops at the third line. The room goes quiet. 'My dad heard this at a bank too. That the terms were best if he took it now. So he took it, the factory went under, and this week the bank I work at turned my mom down because of my dad’s name.' Hajun puts the handout down. 'I can’t sell this. You teach us how to sell. Won’t you teach us how not to?' Do Yoonha doesn’t move from the customer’s chair. 3 years ago, at a window in this branch, that third line was a sentence he used every day.",
      "memo": [
        "Intern role-play task: sell this month’s recommended product",
        "Handout with the sales target -- given to the interns too",
        "Moon Hajun stops at the third line",
        "Do Yoonha: worked a window at the same branch 3 years ago"
      ],
      "choices": {
        "c22_roleplay_hold": {
          "label": "Stop the role-play and hear Do Yoonha and Hajun out"
        },
        "c22_roleplay_task": {
          "label": "Propose 'how not to sell' as an official internship task"
        },
        "c22_roleplay_next": {
          "label": "Let Hajun rest and move the role-play to the next intern"
        },
        "reframe": {
          "label": "Keep asking NOAH why it refused, to the end"
        },
        "c22_roleplay_evidence_turn": {
          "label": "Search NOAH’s training list for 'default-linked party'"
        }
      },
      "place": "KD Bank Gangseo Branch · 3rd-Floor Training Room",
      "clock": "Internship Day 4 · 14:00",
      "question": "In the middle of a sales role-play, Hajun stopped while talking about his dad. What do you do with this room?",
      "lead": "Thursday afternoon. The intern training schedule reads 'Sales Role-Play.'"
    },
    "c22_final": {
      "title": "The Signature Line on Completion Day",
      "text": "The door of the 2nd-floor meeting room at Gangseo Branch closes. In an hour, the interns’ completion ceremony begins in the banking hall downstairs. Seon Medical has given notice: without a machine contract by the Tuesday after the Independence Movement Day holiday, it will move the order to a Vietnamese company. Three printed documents lie on the table. The exception approval application Tak Yerin has filled out completely; the R-17 objection with Kwon Dohyun’s and Ryu Seah’s numbers attached; and appointment slips for consultations at two other banks. Branch Manager Seo Taekyung pushes the injeolmi box aside. Beyond the glass wall, in the banking hall, Moon Hajun is lining up chairs for the ceremony. Tak Yerin speaks. 'An exception approval saves To-the-End Precision alone. An objection gets all 41 looked at again, but it takes weeks. Either way, someone has to put their name down this week.'",
      "memo": [
        "Seon Medical’s final notice: contract by Tuesday",
        "41 R-17 rejections -- 29 of them families of FlowOn suppliers",
        "Exception approval signature field: needs a responsible manager’s name",
        "This choice leads to the March shareholders’ meeting"
      ],
      "choices": {
        "c22_final_bank": {
          "label": "Bring in another bank; lock in the machine deal by Tuesday"
        },
        "c22_final_object": {
          "label": "Object to the R-17 standard and get all 41 re-reviewed"
        },
        "c22_final_override": {
          "label": "Have a person overturn the result by exception approval"
        },
        "reframe": {
          "label": "Reframe the table and propose one last time"
        }
      },
      "place": "KD Bank Gangseo Branch · 2nd-Floor Meeting Room",
      "clock": "Seon Medical deadline D-4 · Today 15:00",
      "question": "Save one now, review all 41 late, or send them to another bank: you have to decide. What do you do?",
      "lead": "An hour before the ceremony, three documents lie side by side on the meeting room table."
    },
    "c22_aftershock": {
      "title": "Certificates and Queue Tickets",
      "text": "At 4 p.m., the interns’ completion ceremony is held in Gangseo Branch’s banking hall. When his name is called, Moon Hajun starts forward, then stops at the ticket machine. Only after pulling a ticket for a grandmother who was waiting does he go up for his certificate. In the back row, Moon Gaeul, whose face became known through Leadline’s series on Gaeul Rice Cake Shop, claps with a box of rice cakes on her lap, and this time Branch Manager Seo Taekyung comes over first and takes one. The last line of Hajun’s intern report reads: 'A bank must give its reasons for refusing in words a person can read.' Foreman Kim, eyes on a phone, asks you, 'About KD Financial Group stock. If I buy just one share, can I go to the meeting where the shareholders gather in March and speak?'",
      "memo": [
        "4 interns complete -- Moon Hajun submits his report",
        "Last guidance at the ticket machine",
        "Foreman Kim: asks about 1 share of KD Financial Group stock",
        "March 20 annual shareholders’ meeting"
      ],
      "choices": {
        "c22_after_rush": {
          "label": "Start on the shareholders’ meeting now, from Kim’s 1 share"
        },
        "c22_after_warm": {
          "label": "Stay with Hajun’s family till the rice cake box is empty"
        },
        "c22_after_record": {
          "label": "Put Hajun’s report and the R-17 cases in one document"
        }
      },
      "place": "KD Bank Gangseo Branch · Banking Hall",
      "clock": "Internship Day 5 · Ceremony 16:00",
      "question": "As the ceremony winds down, Foreman Kim asks whether one share is enough to speak at the shareholders’ meeting. How do you close this afternoon?"
    },
    "c22_comment": {
      "title": "19 Opinion Fields",
      "text": "Tuesday, 6 p.m. At Window 2, business loans, closed for the day, Tak Yerin walks you through NOAH’s review screen from the beginning. Below the result is a field labeled 'Officer’s opinion.' You can type in it, but it can’t change the result. In 2 weeks of full operation, Tak Yerin has written 19 opinions in this field. 'Sales are growing.' 'Collateral sufficient.' 'Owner is diligent.' NOAH gave the same result all 19 times. She lets go of the mouse and rests both hands on her knees. 'I’m 4 years into business loans. But now my job is writing pretty rejection texts. The one I wrote today starts with “We regret,” too.'",
      "memo": [
        "Officer’s opinion field: can be filled in, reflected in results: 0",
        "Tak Yerin: 19 opinions in 2 weeks -- results changed: 0",
        "Standard opening of rejection texts: 'We regret'"
      ],
      "choices": {
        "c22_comment_choice_2": {
          "label": "Bundle the 19 opinions into a formal report to head office"
        },
        "c22_comment_choice_1": {
          "label": "Propose calling applicants before the rejection text"
        },
        "c22_comment_choice_3": {
          "label": "Propose dropping the opinions and speeding up rejections"
        }
      },
      "place": "KD Bank Gangseo Branch · Window 2, Business Loans",
      "clock": "Internship Day 2 · 18:00",
      "question": "One officer has written 19 times in an opinion field that can’t change the result. How do you use that field?"
    },
    "c22_heater": {
      "title": "The Stove and the Wages",
      "text": "11 p.m., and the factory stove goes out. Kang Taemin pulls off his gloves, tucks them into his vest pocket, and takes the stove apart. A part has burned out. He takes three cups of instant noodles from his pocket and sets them in front of Foreman Kim, Kwon Dohyun, and you, then pours the leftover hot water into a plastic bottle and stands it beside a lathe. 'When the machines get cold, the tolerance gets worse.' Foreman Kim laughs, then opens the ledger. The five members haven’t taken their December or January wages. The 1.8 million won electricity bill came first. 'If we miss the Seon order, there’s no March pay either. We’re fine. But orders don’t wait.'",
      "memo": [
        "Stove broken -- 3 degrees above zero inside the factory",
        "5 members unpaid for a second month",
        "Monthly electricity bill of 1.8 million won paid first"
      ],
      "choices": {
        "c22_heater_choice_3": {
          "label": "Propose taking orders with easier tolerances first"
        },
        "c22_heater_choice_2": {
          "label": "Ask Seon Medical in writing to extend the deadline"
        },
        "c22_heater_choice_1": {
          "label": "Propose pooling living costs until the April prototypes"
        }
      },
      "place": "To-the-End Precision, Namdong Industrial Complex, Incheon · Beside the Lathes",
      "clock": "February · 23:10",
      "question": "The stove is out, and the members have gone two months without pay. What do you hold out on until March?"
    },
    "c22_notebook": {
      "title": "Notebook, Page 3",
      "text": "After work, on the stairs in the alley behind Gangseo Branch, February snow piles up on the railing. Do Yoonha opens the notebook he started after leaving the hospital. On page 3 is the name Moon Sungho. An additional loan consultation he handled himself at this branch’s window 3 years ago. 'Delivery payments three months late, says he’s counting on FlowOn alone.' Below it, in Do Yoonha’s handwriting: '1 sale.' Do Yoonha closes the notebook. 'Should I tell Hajun? That the one who sold your dad the loan is your mentor? Tomorrow is the ceremony.'",
      "memo": [
        "Do Yoonha’s notebook, page 3: Moon Sungho consultation record",
        "3 years ago, Gangseo Branch window, additional loan: '1 sale'",
        "One day until the ceremony"
      ],
      "choices": {
        "c22_notebook_choice_1": {
          "label": "Offer to stand by as Do Yoonha tells him before the ceremony"
        },
        "c22_notebook_choice_2": {
          "label": "Put that record in the re-review file as the bank’s fault"
        },
        "c22_notebook_choice_3": {
          "label": "Propose keeping the notebook shut until the ceremony ends"
        }
      },
      "place": "KD Bank Gangseo Branch · Alley Stairs Out Back",
      "clock": "February Snow · Internship Day 4 · 19:00",
      "question": "The one who sold Hajun’s dad the loan was his mentor. The day before the ceremony, what do you do with this?"
    },
    "c22_comment_reaction": {
      "title": "A Machine That Learned to Refuse",
      "text": "Contacted by Tak Yerin, Ryu Seah makes a video call from Pangyo. As PM for NOAH’s adoption, she puts R-17’s training basis on the screen. In KD Bank’s records over the past 30 years, 94% of loan applications from the families of heads of defaulted companies were rejected. Yet the 6% that were approved failed to repay at a lower rate than the overall average. In 2 weeks of full operation, 41 applications nationwide have been rejected under R-17. Ryu Seah takes off her glasses. 'NOAH didn’t learn risk. It learned our habit of rejecting those families. I took this job to make it explainable, and now that it explains, this is what it says.'",
      "memo": [
        "Rejection rate for applications from defaulted-company families: 94%",
        "The approved 6% repaid better than average"
      ],
      "choices": {
        "c22_comment_reaction_choice_2": {
          "label": "Request R-17’s training basis as official verification data"
        },
        "c22_comment_reaction_choice_1": {
          "label": "Propose telling the 41 applicants this statistic first"
        },
        "c22_comment_reaction_choice_3": {
          "label": "Ask to keep the rule and quietly release just this one"
        }
      },
      "place": "KD Bank Gangseo Branch · Interview Room Behind the Windows",
      "clock": "Internship Day 2 · 19:00",
      "question": "NOAH learned not risk but a habit of refusing. How do you use this statistic?"
    },
    "c22_heater_reaction": {
      "title": "The Bill on a Noodle Cup Lid",
      "text": "1 a.m. Kwon Dohyun does his math on the back of an empty noodle cup lid. 5-axis machining center: 390 million won. 1 year of sales from the Seon order: 720 million won. 1 year of the five members’ lives. Beside that he writes the cost of NOAH’s rejection. 0 won. Kwon Dohyun turns the lid around to show you. 'The rejecting side’s books don’t have this line. The losses are all written only in the books of the side that got rejected.' He caps his pen. 'At this price, it’s a loss. The question is whose loss.'",
      "memo": [
        "Cost in the rejecting side’s books: 0 won",
        "Cost in the rejected side’s books: 1 year of sales"
      ],
      "choices": {
        "c22_heater_reaction_choice_1": {
          "label": "Read the lid’s math again in front of the members"
        },
        "c22_heater_reaction_choice_3": {
          "label": "Set the math aside and rush the loan papers first"
        },
        "c22_heater_reaction_choice_2": {
          "label": "Put the cost of rejection on page one of the re-review request"
        }
      },
      "place": "To-the-End Precision, Namdong Industrial Complex, Incheon · Workbench",
      "clock": "February · Before Dawn 01:00",
      "question": "A noodle cup lid says the rejecting side’s cost is 0 won. Where do you use this bill?"
    },
    "c22_notebook_reaction": {
      "title": "The Empty Field",
      "text": "10 p.m. Tak Yerin finds the exception approval application form and sends it over. It is the first time anyone has opened the form since NOAH arrived. At the very bottom is a signature field: 'Person responsible for exception approval.' A clause is attached: whoever overturns NOAH’s result signs electronically with their employee ID, and if that loan goes bad, it is reflected in their performance review. Since adoption, not one person in the whole country has put a name in that field. Tak Yerin sends one more message. 'Should I sign it? I don’t know if a 4th-year assistant manager’s name even counts, though.'",
      "memo": [
        "Exception approval signature field -- 0 people nationwide",
        "Tak Yerin: the name of a 4th-year assistant manager"
      ],
      "choices": {
        "c22_notebook_reaction_choice_3": {
          "label": "File it right away under Tak Yerin’s name, as she offered"
        },
        "c22_notebook_reaction_choice_1": {
          "label": "Don’t leave Tak Yerin alone; sign with the branch manager"
        },
        "c22_notebook_reaction_choice_2": {
          "label": "Change the form to a committee signature, not one person"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Night",
      "clock": "Day Before the Ceremony · 22:00",
      "question": "No one in the country has put a name on the exception approval line. Who do you have fill that field?"
    },
    "c22_branch_shop": {
      "title": "The Half-Lowered Shutter",
      "text": "That evening at Mangwon Market, the shutter of Gaeul Rice Cake Shop is half down. Moon Gaeul sets the printout of the rejection screen you gave her beside the cutting board and slices rice cakes for a long time. Her knife moves faster than usual. 'A dead man is blocking a loan again. Alive, he couldn’t keep the factory; dead, he won’t let it open.' On the fridge door, held by a magnet, is the receipt for 40 million won in member capital (money members put into the cooperative), pooled by the five members who deferred their December wages. Moon Gaeul puts down the knife. 'If the bank stuck my husband’s name on me, I can just peel it off, right? I’ll step down as chair.'",
      "memo": [
        "Evening of the rejection notice -- Gaeul Rice Cake Shop shutter half down",
        "5 members’ capital: 40 million won, December wages deferred",
        "Chair of record: Moon Gaeul",
        "Moon Gaeul: intends to resign as chair"
      ],
      "choices": {
        "c22_branch_shop_b": {
          "label": "Call a general meeting of members before she resigns"
        },
        "c22_branch_shop_c": {
          "label": "Propose just changing the chair’s name to get the loan"
        },
        "c22_branch_shop_a": {
          "label": "Tell her not to step down; keep the chair and fight"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market · At the Shutter",
      "clock": "February · Internship Day 1 · 20:00",
      "question": "To peel off her husband’s name, Moon Gaeul says she will step down as chair. What do you say?"
    },
    "c22_branch_shop_follow": {
      "title": "The Last Page of the Sketchbook",
      "text": "School uniform trousers appear under the shutter, and Moon Hajun ducks in. He has finished his first day as an intern and eaten tteokbokki at the snack bar in front of the branch, and he is in high spirits until he sees the printout by the cutting board. After a long silence, Hajun opens his sketchbook to the last page. A draft logo for the cooperative’s sign and business cards. Inside a gear, 'To the End,' and beneath it, small, 'Chair Moon Gaeul.' 'If Mom steps down, I have to redraw this.' Moon Gaeul laughs, then turns her head away. Hajun looks at you. 'Is this how banks always decide? Mom can’t get it because of Dad?'",
      "memo": [
        "Moon Hajun’s intern Day 1 over",
        "Draft logo: 'To the End' inside a gear",
        "Hajun sees the rejection reason himself",
        "Question: a loan denied because of family"
      ],
      "choices": {
        "c22_branch_shop_follow_c": {
          "label": "Put off the answer for today and talk only about the logo"
        },
        "c22_branch_shop_follow_a": {
          "label": "Show Hajun the R-17 screen and explain it as it is"
        },
        "c22_branch_shop_follow_b": {
          "label": "Write down Hajun’s question and attach it to the re-review"
        }
      },
      "place": "Gaeul Rice Cake Shop, Mangwon Market · At the Cutting Board",
      "clock": "February · Internship Day 1 · 21:00",
      "question": "Hajun asks if Mom can’t get it because of Dad. How do you answer?"
    },
    "c22_route_system": {
      "title": "An Explanation Going in Circles",
      "text": "You decide to keep asking NOAH, to the end, why it refused. Ryu Seah opens NOAH’s test terminal for you. The first question appears on the screen. 'Explain the reason for the R-17 rejection.' The explanation NOAH writes in 0.3 seconds: 'Since 94% of similar past applications were rejected, rejecting this application is appropriate.' You ask again. 'Why were the past applications rejected?' NOAH answers. 'Because most similar past applications were rejected.' Ryu Seah captures the screen. 'We announced it as explainable AI. It does explain. It explains in circles. In 2 weeks of full operation, 41 applications have been rejected under this code.'",
      "memo": [
        "NOAH’s explanation feature: explains rejections by past rejections",
        "41 R-17 rejections -- 2 weeks of full operation",
        "This circular explanation is recorded as 'explainable' in the adoption report"
      ],
      "choices": {
        "c22_route_system_drop": {
          "label": "Bury the capture; just refile this one application"
        },
        "c22_route_system_human": {
          "label": "Demand a human-written reason for every R-17 rejection"
        },
        "c22_route_system_publish": {
          "label": "Publish the circular capture to the 41 applicants and branches"
        },
        "c22_route_system_evidence_turn": {
          "label": "Search NOAH’s training list for 'default-linked party'"
        }
      },
      "place": "KD Data Lab, Pangyo · Server Room Test Terminal",
      "clock": "Internship Day 1 · 23:30",
      "question": "NOAH explains its rejections only by past rejections. How do you break this circle?"
    },
    "c22_final_system_route": {
      "title": "An Answer That Comes Back Around",
      "text": "Before dawn on ceremony day, the screen Ryu Seah captured is still open on the data center terminal. The question of why it refused, and the answer that it refused before. When Ryu Seah enters the same question once more, the same answer comes back in 0.3 seconds. She swivels her chair around. 'The adoption report calls this explainable. It isn’t wrong. It does give an explanation. And the people at To-the-End Precision are waiting for this answer today too.'",
      "memo": [
        "NOAH’s rejection explanation: cites past rejections as the reason",
        "41 R-17 rejections -- 2 weeks of full operation",
        "To-the-End Precision’s customer’s notice: machine contract by Tuesday"
      ],
      "choices": {
        "c22_final_system_route_b": {
          "label": "Keep the rule; just make the rejection notice kinder"
        },
        "c22_final_system_route_c": {
          "label": "Form a joint objection group with the 41 rejected under R-17"
        },
        "c22_final_system_route_a": {
          "label": "Make a human second look mandatory for every R-17 rejection"
        }
      },
      "place": "KD Data Lab, Pangyo · Data Center Control Terminal",
      "clock": "Ceremony Day · Before Dawn",
      "question": "The same question gets the same answer in 0.3 seconds. What do you send along to the people waiting for it?"
    },
    "c22_evidence_turn": {
      "title": "R-17’s List",
      "text": "When you enter the reason code from the clue, NOAH’s training data list (the material the AI learned its judgments from) opens. Lee Minseo stops scrolling. 1,021 names tagged 'default-linked party.' It is the list of applicants for last Chuseok’s voluntary compensation. The papers people filed to be compensated went straight into NOAH’s risk list, and the entry date is the week after the first compensation payments went out. Lee Minseo points to the top of the list. 'People who applied for compensation get rejected for loans. The people who raised their hands as victims became risky people. Moon Gaeul’s name is on the first line.'",
      "memo": [
        "1,021 tagged 'default-linked party' -- matches the compensation applicant list",
        "Entry date: the week after the first compensation payments",
        "29 of the 41 R-17 rejections came from this list"
      ],
      "choices": {
        "c22_evidence_turn_hold": {
          "label": "Keep this record and bring it out at the March meeting"
        },
        "c22_evidence_turn_purge": {
          "label": "Refuse review until the list is purged from training data"
        },
        "c22_evidence_turn_share": {
          "label": "Tell the 1,021 in the victims’ group first"
        }
      },
      "place": "KD Data Lab, Pangyo · Server Room Training Data List",
      "clock": "Ceremony Day · 07:00",
      "question": "The 1,021 who applied for compensation had become NOAH’s risk list. How do you use this record?"
    },
    "c22_start_warm": {
      "title": "A Monday That Still Smells of Tangerines",
      "text": "The six who packed tangerine boxes at Slow Island still had the smell of tangerines on their fingertips after the Lunar New Year holiday had passed. Kwon Dohyun’s wallet still holds Ko Eunbi’s statement. Amount: 0 won. Note: 'Don’t pick at it.' On Monday, Do Yoonha holds out two phones. One shows the name tag of Moon Hajun, who started as an intern today; the other, a text from Assistant Manager Tak Yerin. To-the-End Precision, a worker cooperative (owned and run by its workers), filed the facility loan (for machinery) application you heard about from Moon Gaeul in Jeju, and NOAH rejected it in 0.8 seconds. Reason code R-17: related-party history (someone close, like family). The default of the late Moon Sungho was flagged. Since NOAH came, there has not been a single exception approval (a manager signing off outside the rules) where a person overturns it.",
      "memo": [
        "6 tangerine boxes packed at Slow Island",
        "To-the-End Precision facility loan rejected -- reason code R-17",
        "Moon Hajun’s internship starts today, mentor Do Yoonha"
      ],
      "choices": {
        "c22_start_warm_code": {
          "label": "First open up what rule R-17 was built from"
        },
        "c22_start_warm_swap": {
          "label": "Propose refiling with Foreman Kim as representative"
        },
        "c22_start_warm_signature": {
          "label": "Take the tangerine boxes; all go to the factory first"
        },
        "c22_start_warm_desk": {
          "label": "Go first to Tak Yerin’s business loan window at Gangseo"
        },
        "c22_start_warm_reframe": {
          "label": "Keep asking NOAH why it refused, to the end"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room",
      "clock": "Fourth Monday of February · Internship Day 1 · 08:00",
      "question": "Before the smell of tangerines has even faded, To-the-End Precision is rejected. With those hands, where do you go first?",
      "lead": "A Monday morning, with the smell of tangerines still on your fingertips."
    },
    "c22_start_record": {
      "title": "A Rejection After the Access Requests",
      "text": "Three days after you sent access request notices (asking to see one’s own records) to the four in Cohort 1, Sunwoo Jin replied, 'I’ll read it slowly.' A text from Assistant Manager Tak Yerin at Gangseo Branch reaches Lee Minseo. To-the-End Precision, a worker cooperative (owned and run by its workers), has had its application rejected by NOAH. It was a facility loan (for machinery). Reason code R-17: related-party history (someone close, like family). That person’s default was flagged. The related-party field reads: Moon Sungho, deceased. The exception approval button (for a manager signing off outside the rules) is grayed out. At the same branch, Moon Hajun starts his internship today. 'We’ve only just opened a way for records’ owners to see them, and now a machine is pulling out a dead man’s records and using them.'",
      "memo": [
        "4 access request notices sent to Cohort 1",
        "To-the-End Precision facility loan rejected -- related party Moon Sungho (deceased)",
        "Moon Hajun’s internship starts today, same branch"
      ],
      "choices": {
        "c22_start_record_desk": {
          "label": "Go first to Tak Yerin’s business loan window at Gangseo"
        },
        "c22_start_record_code": {
          "label": "First open up what rule R-17 was built from"
        },
        "c22_start_record_signature": {
          "label": "Request access to the R-17 review record with Moon Gaeul"
        },
        "c22_start_record_swap": {
          "label": "Propose refiling with Foreman Kim as representative"
        },
        "c22_start_record_reframe": {
          "label": "Keep asking NOAH why it refused, to the end"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Lee Minseo’s Desk",
      "clock": "Fourth Monday of February · Internship Day 1 · 08:00",
      "question": "The week after you opened a way for records’ owners to see them, a machine used a dead man’s records. Which record do you open first?",
      "lead": "A Monday morning, with a reply reading 'I’ll read it slowly' stuck beside the monitor."
    },
    "c22_start_rush": {
      "title": "Line 12",
      "text": "You flew back on the next plane still holding a tangerine box, and you have spent two weeks glued to NOAH’s review list. The tangerine box sits under your desk, still unopened. Line 12 is To-the-End Precision, a worker cooperative (owned and run by its workers). Facility loan (for machinery): 350 million won. Result: rejected. Judgment time: 0.8 seconds. Reason code R-17: related-party history (someone close, like family). That person’s default was flagged. The related-party field reads: Moon Sungho, deceased. Oh Jinwoo arrives for work and looks at the screen. 'I asked Assistant Manager Tak Yerin at Gangseo Branch. She says there hasn’t been a single exception approval (a manager signing off outside the rules) since NOAH went live. Starting today, Hajun’s an intern at that branch. His mentor is Do Yoonha.'",
      "memo": [
        "NOAH review list -- line 12, To-the-End Precision",
        "Tangerine box under the desk, still unopened",
        "0 exception approvals -- NOAH in full operation 2 weeks"
      ],
      "choices": {
        "c22_start_rush_desk": {
          "label": "Go first to Tak Yerin’s business loan window at Gangseo"
        },
        "c22_start_rush_code": {
          "label": "First open up what rule R-17 was built from"
        },
        "c22_start_rush_swap": {
          "label": "Propose refiling with Foreman Kim as representative"
        },
        "c22_start_rush_signature": {
          "label": "Take line 12 of the list straight to Gangseo Branch"
        },
        "c22_start_rush_reframe": {
          "label": "Keep asking NOAH why it refused, to the end"
        }
      },
      "place": "Trigger Lab 4th Floor · Analyst Room · Before Dawn",
      "clock": "Fourth Monday of February · Before Dawn 06:10",
      "question": "Line 12 of the review list you rushed back to is To-the-End Precision. Where do you go first?",
      "lead": "Before dawn on Monday, the review list refreshes on a monitor that has been on for two weeks."
    }
  },
  "echoReplies": {
    "c22_start_desk": "When you go, Tak Yerin pulls over another chair. While you sit in it, no one opens up what R-17 was built from.",
    "c22_start_code": "When you open the rule, a table of weights comes out from under R-17. While you read the table, Moon Gaeul gets only a text saying 'under review.'",
    "c22_start_swap": "With the representative changed, NOAH might let it through. But that is Moon Gaeul’s decision, and no one has asked her yet. The day it changes, her name comes off the registry, and the bank never writes down why it made her take it off.",
    "c22_counter_tell": "When you tell her, the rice cake box stops on the counter. Moon Gaeul hands out the rest of the rice cakes, every last one, before she sits down.",
    "c22_counter_appeal": "When you tell her with the request in hand, Moon Gaeul at least knows there is something to be done. For the two hours it takes that request to be filed, she is handing out rice cakes and smiling.",
    "c22_counter_wait": "With the news held back, Hajun’s first day at work is quiet. The news doesn’t last two days. On Wednesday, when the re-review papers need the cooperative’s seal, Moon Gaeul learns of the rejection, and also who knew for those two days.",
    "c22_factory_crew": "After a night of writing, 'to the end' drops from 11 times to once in the business plan, and the numbers grow by 23. Hajun is a little hurt.",
    "c22_factory_record": "Rewritten, Moon Sungho is no longer the head of a defaulted company but a precision machinist with 20 years of experience. Whether NOAH knows how to read that sentence, no one knows.",
    "c22_factory_used": "With a smaller amount, the review gets lighter. On a used machine, 0.005mm comes out right one time in two.",
    "c22_roleplay_hold": "Heard out to the end, Hajun tells his dad’s story from beginning to end for the first time. The other three interns’ role-plays are pushed to tomorrow morning.",
    "c22_roleplay_task": "The proposal goes to Talent Development. Whether an hour of 'how not to sell' makes it into the next cohort’s training will be decided in the summer.",
    "c22_roleplay_next": "Moved on to the next turn, the role-play ends on time. Hajun stands in front of the hallway vending machine for a long while.",
    "c22_final_override": "With a person overturning it, To-the-End Precision signs the machine contract on Tuesday. A name goes on the country’s first exception approval signature field, and the other 40 are still under R-17.",
    "c22_final_object": "With the objection filed, all 41 go back up for review. Seon Medical does not wait, and To-the-End Precision’s first big order goes to Vietnam.",
    "c22_final_bank": "The other bank charges more interest and takes the papers on Tuesday morning, when the holiday ends. The factory runs, and KD Bank’s R-17 rejects the next application as if nothing had happened.",
    "c22_after_warm": "Because you stay, rice cakes go around until the banking hall lights go out. Hajun sets the last rice cake on top of the ticket machine.",
    "c22_after_record": "The first page of the bound document is one line from a high school student. Someone in head office Credit Review runs a highlighter over that line.",
    "c22_after_rush": "Going straight to it, you leave before the ceremony applause is over. In the photo, Hajun sees the empty spot where you stood.",
    "c22_comment_choice_1": "Of the applicants who take the call, two get angry, and one thanks you for telling them why. Tak Yerin doesn’t send a single text that day.",
    "c22_comment_choice_2": "The report is received. The reply from head office Credit Review is one line: 'Per NOAH operating standards.'",
    "c22_comment_choice_3": "The notices go out faster. Tak Yerin stops halfway through her 20th opinion and closes the window.",
    "c22_heater_choice_1": "With the money pooled, the five hold out until March. Kwon Dohyun writes the word 'temporary' three times on the fundraising statement.",
    "c22_heater_choice_2": "To the written request, Seon Medical replies that it 'will review it.' While it reviews, a Vietnamese company submits a quote.",
    "c22_heater_choice_3": "The easy orders pay the electricity bill. The work that needs a 5-axis machine goes to other factories.",
    "c22_notebook_choice_1": "With you beside him, Do Yoonha starts to speak three times and stops. On the fourth, Hajun asks first. 'Is that your handwriting?'",
    "c22_notebook_choice_2": "Made the bank’s responsibility, the record helps To-the-End Precision’s re-review. Do Yoonha’s name stays in that record with it.",
    "c22_notebook_choice_3": "The notebook stays shut. In the ceremony photos, Do Yoonha’s smile comes half a beat late.",
    "c22_comment_reaction_choice_1": "When you tell them, some of the 41 learn for the first time that it was not their fault. Ryu Seah becomes the one who told them before reporting up the line.",
    "c22_comment_reaction_choice_2": "The request goes through procedure. The verification committee meets next month.",
    "c22_comment_reaction_choice_3": "Ryu Seah hesitates a moment, then shakes her head. 'If we release just one, the other 40 will never know why.'",
    "c22_heater_reaction_choice_1": "When you read it out, Foreman Kim takes the lid and slips it under the glass of the workbench. For the first time, the bill belongs to the factory.",
    "c22_heater_reaction_choice_2": "The 0 won on page one catches the eye of the review staff. Catching their eye does not change the result.",
    "c22_heater_reaction_choice_3": "The papers move faster. The lid goes into the recycling bin with the noodle cup.",
    "c22_notebook_reaction_choice_1": "Branch Manager Seo Taekyung asks for a night to think it over. The injeolmi box is still on the branch manager’s desk.",
    "c22_notebook_reaction_choice_2": "The request to change the form goes to head office. Seon Medical’s deadline arrives before the new form does.",
    "c22_notebook_reaction_choice_3": "A 4th-year assistant manager’s name goes into the application’s responsible-person field first. The branch’s approval will be decided in the meeting room tomorrow afternoon, and until then that name sits alone in the field.",
    "c22_branch_shop_a": "Kept on, Moon Gaeul’s name stays on the registry. NOAH’s rejection stays right beside that name too.",
    "c22_branch_shop_b": "At the general meeting, Foreman Kim raises a hand first. 'If you step out, boss, we all step out.' Posting notice of the meeting takes three days.",
    "c22_branch_shop_c": "With the name changed, the loan might come faster. That night, Moon Gaeul puts the chair’s seal deep in a drawer.",
    "c22_branch_shop_follow_a": "Told it as it is, Hajun writes 'R-17' in his sketchbook. Then he draws three question marks beside it.",
    "c22_branch_shop_follow_b": "Head office Credit Review has never received a request with a high school student’s question attached. There is no field yet for the answer.",
    "c22_branch_shop_follow_c": "When you talk about the logo, Hajun laughs. The question stays on the last page of the sketchbook, unanswered.",
    "c22_route_system_publish": "Published, the 41 all receive the same sentence. That afternoon KD Data Lab posts a notice: 'Explanation feature improvements planned.'",
    "c22_route_system_human": "With reasons attached, every rejection gets one line with a person’s name. For the first time, Tak Yerin writes a reason instead of a rejection text.",
    "c22_route_system_drop": "The refiled application gets the same result in 0.8 seconds. The capture stays on Ryu Seah’s desktop.",
    "c22_final_system_route_a": "With a person taking a second look, each rejection takes one more day. In that day, someone gets to hear not a result but a reason.",
    "c22_final_system_route_b": "The notice gets kinder. 'We regret' becomes 'We sincerely regret.'",
    "c22_final_system_route_c": "With the 41 gathered, the voice grows louder. It takes that much longer, and in the meantime the most desperate close their doors first.",
    "c22_evidence_turn_purge": "If you hold out, the list might be purged. In the meantime, the 29, To-the-End Precision included, can’t get any loan at all.",
    "c22_evidence_turn_hold": "Held back, it becomes the sharpest knife on the day of the shareholders’ meeting. In the meantime, one of the 1,021 applies for a loan again, and is rejected again.",
    "c22_evidence_turn_share": "When you tell them, the victims’ group chat buzzes all night. The very first message Moon Gaeul writes is 'If anyone has applied for a loan, speak up.'",
    "c22_counter_evidence_turn": "Search the tag and what comes up is not a reason for rejection but a list of the rejected. Who handed over that list, the entry date tells you.",
    "c22_factory_evidence_turn": "Search the tag and what comes up is not a reason for rejection but a list of the rejected. Who handed over that list, the entry date tells you.",
    "c22_roleplay_evidence_turn": "Search the tag and what comes up is not a reason for rejection but a list of the rejected. Who handed over that list, the entry date tells you.",
    "c22_route_system_evidence_turn": "Search the tag and what comes up is not a reason for rejection but a list of the rejected. Who handed over that list, the entry date tells you.",
    "case22_memory_system": "There is nothing to read between the lines. NOAH’s explanation holds neither your judgment nor anyone else’s. Past rejections are simply written down as the reason for this one.",
    "case22_memory_evidence": "Hold the ordering department on the weekly sheet up against the training list, and names bearing a single tag come pouring out. The people who applied for compensation.",
    "c22_start_warm_desk": "When you go, Tak Yerin pulls over another chair. While you sit in it, no one opens up what R-17 was built from.",
    "c22_start_warm_code": "When you open the rule, a table of weights comes out from under R-17. While you read the table, Moon Gaeul gets only a text saying 'under review.'",
    "c22_start_warm_swap": "With the representative changed, NOAH might let it through. But that is Moon Gaeul’s decision, and no one has asked her yet. The day it changes, her name comes off the registry, and the bank never writes down why it made her take it off.",
    "c22_start_warm_signature": "At the factory you stop by before work, Foreman Kim stops a lathe. The tangerines are welcome, but six bank people turning up at once has never been good news. Moon Gaeul has already left for Gangseo Branch with the rice cake boxes loaded.",
    "c22_start_record_desk": "When you go, Tak Yerin pulls over another chair. While you sit in it, no one opens up what R-17 was built from.",
    "c22_start_record_code": "When you open the rule, a table of weights comes out from under R-17. While you read the table, Moon Gaeul gets only a text saying 'under review.'",
    "c22_start_record_swap": "With the representative changed, NOAH might let it through. But that is Moon Gaeul’s decision, and no one has asked her yet. The day it changes, her name comes off the registry, and the bank never writes down why it made her take it off.",
    "c22_start_record_signature": "With the access request filed, the bank has to answer within ten days. The order waiting on the machine won’t wait ten days.",
    "c22_start_rush_desk": "When you go, Tak Yerin pulls over another chair. While you sit in it, no one opens up what R-17 was built from.",
    "c22_start_rush_code": "When you open the rule, a table of weights comes out from under R-17. While you read the table, Moon Gaeul gets only a text saying 'under review.'",
    "c22_start_rush_swap": "With the representative changed, NOAH might let it through. But that is Moon Gaeul’s decision, and no one has asked her yet. The day it changes, her name comes off the registry, and the bank never writes down why it made her take it off.",
    "c22_start_rush_signature": "Arriving before the shutter even goes up, you surprise Tak Yerin. Hajun at the ticket machine is even more surprised. The goodbye you couldn’t say slowly to Sunwoo Jin is still owed."
  },
  "choiceVoiceLines": {
    "c22_start_desk": "Saying people come before screens, you go first to Tak Yerin’s business loan window at Gangseo Branch.",
    "c22_start_code": "Saying you need to see inside a rejection that ended with one code, you first open up what rule R-17 was built from.",
    "c22_start_swap": "If one name is the problem, you propose refiling the papers with Foreman Kim as the representative.",
    "c22_counter_tell": "Since you can’t let her hear it from someone else, you tell Moon Gaeul about the rejection yourself before she finishes handing out the rice cakes.",
    "c22_counter_appeal": "Saying you won’t tell her empty-handed, you file a re-review request with Tak Yerin first and then tell her.",
    "c22_counter_wait": "Not wanting to spoil her son’s first day at work, you hold the news until Hajun’s internship week is over.",
    "c22_factory_crew": "Saying 'to the end' has to be proven by the people who wrote it, you rewrite the business plan in numbers overnight with the members.",
    "c22_factory_record": "Saying his is not a name to be left as one line about a default, you rewrite Moon Sungho’s history as a record of skill rather than default.",
    "c22_factory_used": "Saying meeting April 3 comes first, you cut the amount by applying for a used machining center instead of a new one.",
    "c22_roleplay_hold": "Saying the two people’s words come before the assignment, you stop the role-play and hear Do Yoonha and Hajun out to the end.",
    "c22_roleplay_task": "So Hajun’s question doesn’t end in this room, you propose making 'how not to sell' an official internship assignment.",
    "c22_roleplay_next": "Saying the other interns’ time matters too, you let Hajun rest a while and move the role-play on to the next turn.",
    "c22_final_override": "Saying this is not a factory that can hold out for weeks, you have a person overturn To-the-End Precision’s result through an exception approval.",
    "c22_final_object": "Saying that saving one leaves the rest as they are, you object to the R-17 standard itself and get all 41 reviewed again.",
    "c22_final_bank": "Saying the order will go to Vietnam while everyone argues over a name, you bring in another bank and lock in the machine contract before Tuesday.",
    "c22_after_warm": "Saying that today, at least, applause comes before work, you stay with Hajun’s family until the ceremony’s rice cake box is empty.",
    "c22_after_record": "To make visible what a reason a person can read looks like, you bind Hajun’s report and the R-17 rejection cases into one document.",
    "c22_after_rush": "Saying there isn’t much time before March 20, you start with Foreman Kim’s 1 share and go straight into preparing for the shareholders’ meeting.",
    "c22_comment_choice_1": "Saying this isn’t news to end with 'We regret,' you propose calling the applicants directly before the rejection texts go out.",
    "c22_comment_choice_2": "So head office reads the 19 fields that couldn’t change the result, you bundle the 19 opinions into a formal report to head office Credit Review.",
    "c22_comment_choice_3": "Saying there is no point wearing yourselves out on a field no one reads, you propose dropping the opinion field and finishing the rejection notices quickly.",
    "c22_heater_choice_1": "Unable to take their word that they’re fine, you propose temporarily pooling the members’ living costs until the April prototypes.",
    "c22_heater_choice_2": "Saying they can breathe again if only the deadline loosens, you ask Seon Medical in writing to extend the deadline.",
    "c22_heater_choice_3": "Saying they have gone two months without pay, you propose taking orders with less demanding tolerances first.",
    "c22_notebook_choice_1": "Saying these are words Hajun should hear from his mentor’s own mouth, you offer to stand by so Do Yoonha can tell him before the ceremony.",
    "c22_notebook_choice_2": "Saying this isn’t something to end with one man’s confession, you put that consultation record into the re-review file as the bank’s responsibility.",
    "c22_notebook_choice_3": "Wanting to protect at least Hajun’s last day, you propose keeping the notebook shut until the ceremony is over.",
    "c22_comment_reaction_choice_1": "Saying the rejected side should be the first to know, you propose telling the 41 R-17 applicants this statistic first.",
    "c22_comment_reaction_choice_2": "Saying numbers seen on a video call aren’t evidence, you request R-17’s training basis as official verification data.",
    "c22_comment_reaction_choice_3": "Saying a 30-year-old habit takes a long time to fix, you ask them to keep the rule and quietly release just this one case.",
    "c22_heater_reaction_choice_1": "Saying the people who bear this loss should know, you read the lid’s math again in front of the members.",
    "c22_heater_reaction_choice_2": "So that the rejecting side’s books get this line too, you put the cost of rejection on the first page of the re-review request.",
    "c22_heater_reaction_choice_3": "Saying orders won’t wait while you argue, you set the math aside and rush the loan papers first.",
    "c22_notebook_reaction_choice_1": "Saying this is not a weight for a 4th-year assistant manager to carry alone, you propose that Tak Yerin not be left alone and sign together with the branch manager.",
    "c22_notebook_reaction_choice_2": "Saying it is a field that falls on one person’s performance review if things go wrong, you propose changing the form to a review committee signature instead of a single responsible person.",
    "c22_notebook_reaction_choice_3": "Saying the name no one in the country has written is needed now, you file it right away under Tak Yerin’s name, as she offered.",
    "c22_branch_shop_a": "Saying it was the bank that attached the name, so the bank is the one that should back down, you tell her not to step down and to fight on as chair.",
    "c22_branch_shop_b": "Saying the seat also belongs to the five who pooled the capital, you call a general meeting of members before she resigns and ask everyone’s wishes.",
    "c22_branch_shop_c": "Saying the members who deferred their wages come first, you propose changing just the chair’s name for now to get the loan.",
    "c22_branch_shop_follow_a": "Saying the one who asks deserves an answer as you saw it, you show Hajun the R-17 screen and explain it just as it is.",
    "c22_branch_shop_follow_b": "Since it is a question the bank has to answer, you write down Hajun’s question word for word and attach it to the re-review request.",
    "c22_branch_shop_follow_c": "Saying it is the first day he came in so excited, you put off the answer for today and talk only about the logo.",
    "c22_route_system_publish": "Since the rejected side should see this screen first, you publish the circular explanation capture to the 41 applicants and the branches.",
    "c22_route_system_human": "Saying an answer that goes in circles is no reason, you demand that every R-17 rejection carry a reason written by a person.",
    "c22_route_system_drop": "Saying the one waiting is To-the-End Precision, you bury the capture and just refile this one application.",
    "c22_final_system_route_a": "So that someone can break an answer that keeps coming back to the same place, you attach a mandatory human second look to every R-17 rejection.",
    "c22_final_system_route_b": "Saying to change first the words the people waiting today will read, you keep the rule as it is and just make the rejection notice kinder.",
    "c22_final_system_route_c": "Saying that asking one by one only gets the same answer back, you gather the 41 rejected under R-17 into a joint objection group.",
    "c22_evidence_turn_purge": "Saying you can’t stand before a machine that reads victims as risks, you refuse any review until the list is purged from the training data.",
    "c22_evidence_turn_hold": "Saying it won’t get buried if it comes out where the shareholders gather, you keep this record and bring it out at the March shareholders’ meeting.",
    "c22_evidence_turn_share": "Saying people should be the first to know where their own names were used, you tell the 1,021 in the victims’ group first.",
    "c22_counter_evidence_turn": "Going through NOAH’s training data list with the name from the clue, you find out where R-17 learned its names.",
    "c22_factory_evidence_turn": "Going through NOAH’s training data list with the name from the clue, you find out where R-17 learned its names.",
    "c22_roleplay_evidence_turn": "Going through NOAH’s training data list with the name from the clue, you find out where R-17 learned its names.",
    "c22_route_system_evidence_turn": "Going through NOAH’s training data list with the name from the clue, you find out where R-17 learned its names.",
    "c22_start_warm_desk": "Saying people come before screens, you go first to Tak Yerin’s business loan window at Gangseo Branch.",
    "c22_start_warm_code": "Saying you need to see inside a rejection that ended with one code, you first open up what rule R-17 was built from.",
    "c22_start_warm_swap": "If one name is the problem, you propose refiling the papers with Foreman Kim as the representative.",
    "c22_start_warm_signature": "Saying you have to see first what 0.8 seconds failed to see, you all take the tangerine boxes and go to To-the-End Precision’s factory first.",
    "c22_start_record_desk": "Saying people come before screens, you go first to Tak Yerin’s business loan window at Gangseo Branch.",
    "c22_start_record_code": "Saying you need to see inside a rejection that ended with one code, you first open up what rule R-17 was built from.",
    "c22_start_record_swap": "If one name is the problem, you propose refiling the papers with Foreman Kim as the representative.",
    "c22_start_record_signature": "Saying you will first open a way to see how a dead man’s record was used, you request access to the R-17 review record together with Moon Gaeul.",
    "c22_start_rush_desk": "Saying people come before screens, you go first to Tak Yerin’s business loan window at Gangseo Branch.",
    "c22_start_rush_code": "Saying you need to see inside a rejection that ended with one code, you first open up what rule R-17 was built from.",
    "c22_start_rush_swap": "If one name is the problem, you propose refiling the papers with Foreman Kim as the representative.",
    "c22_start_rush_signature": "Before Hajun gets to that screen first, you take line 12 of the list and go straight to Gangseo Branch."
  },
  "pack": {
    "clue": {
      "title": "R-17’s List",
      "text": "NOAH’s 1,021 'default-linked party' tags were the list of applicants for last Chuseok’s voluntary compensation. The people who raised their hands as victims were learned as risky people."
    },
    "outcomes": {
      "c22_after_warm": {
        "tag": "Stayed Beside",
        "title": "You stayed in the banking hall until the ceremony rice cake box was empty",
        "text": "Long after the ceremony ended, Moon Gaeul’s family, Tak Yerin, and the six put away the banking hall chairs together. The last rice cake was left on top of the ticket machine."
      },
      "c22_after_record": {
        "tag": "Put It on Record",
        "title": "An intern’s one line became the first page of the R-17 objection",
        "text": "The last line of Hajun’s report and the 41 rejection cases were bound into one volume and filed with both head office Credit Review and the Financial Supervisory Service."
      },
      "c22_after_rush": {
        "tag": "Ran Ahead",
        "title": "You began preparing for the shareholders’ meeting with Foreman Kim’s 1 share",
        "text": "Before the ceremony applause had even ended, you were looking up the shareholders’ meeting schedule. That night, Foreman Kim bought one share of KD Financial Group stock."
      }
    },
    "continuityChallenges": {
      "c21_after_warm": {
        "title": "Go With the People Who Shared the Tangerine Boxes",
        "text": "The six who packed tangerine boxes until the last flight are still together. Trust rides on the card where all six stand together in front of To-the-End Precision too."
      },
      "c21_after_record": {
        "title": "Give Records Back to Their Owners",
        "text": "The week after you opened a way for Cohort 1 to see their own records, NOAH wrote down a dead man’s name as a risk. In a new hand, ask first who owns this record."
      },
      "c21_after_rush": {
        "title": "Repay the Goodbye You Couldn’t Take Slowly",
        "text": "You couldn’t say a slow goodbye to Sunwoo Jin and opened NOAH’s list first. This time, fairness depends on making the reasons understandable to the people who were rejected."
      }
    }
  }
};
