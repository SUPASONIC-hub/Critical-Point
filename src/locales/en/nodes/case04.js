/**
 * 사건 04 (src/nodes/case04.js) in English, for the English preview (영어판 1단계).
 *
 * A draft: machine-translated with the glossary (앱출시-G), not yet edited by
 * a person. Words only, under the ids of the case as the app is shipped it
 * (scripts/locale-words.mjs); a scene or card left out here keeps its Korean,
 * and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "c4_start": {
      "text": "In the operations review room of Onsae, a care platform, a sheet on the wall reads '9 hours to grant review.' If Onsae passes, care continues for 4,200 vulnerable neighbors. One review item falls 3% short of the bar. It is face-to-face care hours per user, and it dropped because Onsae cut care staff last quarter. Onsae cut staff because KD Bank suddenly moved up the repayment schedule on its working-capital loan. The department that asked was the Corporate Finance Strategy Team. Han Seoyun slides a sheet with the formula into the middle of the table. 'This time Trigger Lab is looking at how far a justified violation is allowed to go. Touch this one line and it passes. Whether to touch it is today’s question.' You reviewed a company named Onsae once, 3 years ago. It was a different company, one that made packaging.",
      "memo": [
        "4,200 people affected if the service stops",
        "Shortfall: exactly 3.0%",
        "Repaid early last quarter: 4.2 billion won, demanded by the Corporate Finance Strategy Team",
        "That quarter the group was making its quarterly numbers for Kingsdale, the largest shareholder in New York",
        "9 hours to the grant review deadline"
      ],
      "choices": {
        "c4_start_contain": {
          "label": "Fix the formula, but write a follow-up check date on it"
        },
        "c4_start_approve": {
          "label": "Add one line of interpretation to Han Seoyun’s formula sheet"
        },
        "c4_start_refuse": {
          "label": "Write the 3% shortfall into the review report as is"
        },
        "reframe": {
          "label": "Propose deciding first how far the line can be crossed"
        }
      },
      "place": "Onsae operations review room",
      "clock": "Grant review in 9h",
      "question": "A 3% shortfall cuts off care for 4,200 people. Do you widen how the formula is read, or report it as is?",
      "lead": "You leave Novaworks for the operations review room of Onsae, a care platform. The 3% shortfall came from KD Bank moving up its repayment schedule last quarter. This time Trigger Lab is looking at 'the limit for justified violations.'"
    },
    "c4_offer": {
      "title": "A Small Exception",
      "text": "At the long table in the review room, four field staff sit on one side and a legal officer on the other. In the middle lies a list: 640 more people waiting for care. One of the field staff speaks. 'Cutting the service over a 3% number is the more unethical thing.' Do Yoonha takes out the approval form for the repayment schedule change. The top box is empty. It looks just like the FlowOn review report. 'The person who made the 3% has no name in this box. The people here are the ones being told to fill the 3%.' Ban Jaewook speaks without looking up from his notebook. Touch the formula and leave no record, he says, and that is plain concealment.",
      "memo": [
        "640 people waiting for care",
        "Widening the formula’s reading is a legal gray area",
        "Final signature box on the repayment-change approval form is blank",
        "Keep a record: fail the review. Hide it: audit risk"
      ],
      "choices": {
        "c4_offer_contain": {
          "label": "Add a note beside Do Yoonha’s blank signature box"
        },
        "c4_offer_refuse": {
          "label": "Take the list of 640 waiting and go find other money"
        },
        "c4_offer_approve": {
          "label": "Ignore Ban Jaewook’s notebook and adjust the formula"
        },
        "reframe": {
          "label": "Reframe the table and propose"
        }
      },
      "place": "Onsae operations review room",
      "clock": "Grant review in 7h",
      "question": "The field says cutting service over 3% is more unethical. Do you put the formula change on record?",
      "lead": "Field staff and legal review sit at the same table. A record raises the chance of failing; hiding it raises the audit risk."
    },
    "c4_leak": {
      "title": "Outside Tip",
      "text": "The phone at the press desk rings. It is a reporter. An anonymous tipster has emailed the press saying 'Onsae is trying to rig its review score,' and the reporter wants an answer within 1 hour. There is still time to set an embargo. The tip email repeats wording from today’s internal meeting word for word. Ban Jaewook traces the email’s sending path. 'Same path as the last leak scare. Last time it pointed at a contract worker. This time it points at a field agency. Whoever is right, the result is the same. The bank’s name stays out of the story.' Beside him, Oh Jinwoo has already written three lines of a denial statement.",
      "memo": [
        "Reporter wants an answer in 1 hour",
        "Parts of the tip match internal meeting wording exactly",
        "Sending path identical to the last leak scare",
        "Oh Jinwoo proposes a quick denial"
      ],
      "choices": {
        "c4_leak_expose": {
          "label": "Tell the reporter about the formula dispute and shutdown risk"
        },
        "c4_leak_contain": {
          "label": "Set an embargo and hand over the formula review papers"
        },
        "c4_leak_approve": {
          "label": "Send out Oh Jinwoo’s three-line denial as written"
        },
        "reframe": {
          "label": "Propose deciding first how far the line can be crossed"
        }
      },
      "place": "Onsae operations review room · Press desk",
      "clock": "Reporter’s answer in 1h",
      "question": "A reporter calls to check a score-rigging claim. What do you say in 1 hour?",
      "lead": "An anonymous tip went to the press. Some of its wording overlaps with what was said in an internal meeting."
    },
    "c4_vote": {
      "title": "Who Pays the Cost",
      "text": "In Onsae’s board room, a yes-or-no ballot sits in front of each of the seven directors. Keep the rule and people lose the service. Widen it and trust in the system breaks. Legal has circulated an opinion against any formula change without a record, and the field team stands in the hallway waiting for the door to open. ECHO puts one more line on the wall screen. 'Had the repayment schedule not been moved up, this item would clear the bar by 1.4%. So this vote is not about Onsae’s problem. It is a procedure to decide who covers the bank’s hole with their own name.' The board chair reads the line and takes off the glasses.",
      "memo": [
        "25 minutes to the board vote",
        "Without the early repayment, the score is the bar +1.4%",
        "Legal opposes a formula change without a record",
        "Field team demands the service continue"
      ],
      "choices": {
        "c4_vote_refuse": {
          "label": "Send the exception back and write the loss on the ballot"
        },
        "c4_vote_contain": {
          "label": "Put the exception and a public audit condition to the chair"
        },
        "c4_vote_approve": {
          "label": "Be first of the seven directors to vote for the exception"
        },
        "reframe": {
          "label": "Reframe the table and propose"
        }
      },
      "place": "Onsae board room",
      "clock": "Board vote in 25m",
      "question": "Keep the rule and people lose service; widen it and trust erodes. Which cost do you put on record?",
      "lead": "The question of good intentions is over. Now the question is whose loss you sign for."
    },
    "c4_aftershock": {
      "title": "The Exception’s Bill",
      "text": "The day before the results come out, an envelope is already waiting on the review room table. It is not the grant result. It is an audit request. Word spread that an exception was discussed over Onsae’s 3%, and agencies waiting for the same exception have lined up. Ban Jaewook writes down the name of each one that called. Eleven. Home visits for older people, support for people with disabilities, child care. The work differs, but the situation is much the same. He puts a small dot beside six of them. 'Same main bank.' The reviewer has demanded that Onsae disclose how it read the standard. The review room phone rings again.",
      "memo": [
        "11 agencies in similar straits got in touch (6 with KD as main bank)",
        "Reviewer demands the interpretation standard be disclosed",
        "Grant review result not out yet"
      ],
      "choices": {
        "c4_after_stop": {
          "label": "Accept no exceptions until the audit is over"
        },
        "c4_after_service": {
          "label": "Open the exception to the agencies in line to keep services"
        },
        "c4_after_rule": {
          "label": "Publish every exception condition and set a new standard"
        }
      },
      "place": "Onsae operations review room",
      "clock": "Day before the results",
      "question": "11 agencies wanting the same exception have lined up. How do you answer the line?",
      "lead": "The audit request arrived before the review result. One agency’s 3% has come back as a question from the others."
    },
    "c4_audit": {
      "title": "Who Owns the 3%",
      "text": "Two documents lie side by side on the formula desk. On the left is KD Bank’s request to change the repayment schedule. On the right is the list of users whose care will stop. The 3% was made by the decision in the left document, and the names in the right one pay for it. The signature box on the request is blank. Ban Jaewook goes down the formula line by line. The time care workers spend traveling between homes is counted nowhere, and the review standard is still set to data from 2 years ago. Outside the door, a user representative waits for a turn to speak. 'The people who calculated the 3% and the people waiting on the 3% are different. First you have to decide whose standard this formula is written by.'",
      "memo": [
        "The formula leaves out field work",
        "Review standard fixed to data from 2 years ago",
        "Signature box on the repayment-change request is blank",
        "Service users’ representative asks to speak"
      ],
      "choices": {
        "c4_audit_choice_2": {
          "label": "Keep a history of formula changes"
        },
        "c4_audit_choice_1": {
          "label": "Reflect the user representative’s standard"
        },
        "c4_audit_choice_3": {
          "label": "Quietly adjust the 3%"
        }
      },
      "place": "Onsae operations review room · Formula desk",
      "clock": "Grant review in 6h",
      "question": "Those who calculated the 3% and those waiting on it are different people. Whose standard writes the formula?"
    },
    "c4_public": {
      "title": "The Sentence the Reporter Wants",
      "text": "The reporter calls back. Keys clatter over the speaker. The story isn’t written yet, the reporter says, but there is one condition: only one sentence from Onsae’s explanation will be quoted. Do Yoonha covers the receiver with his hand. 'Tomorrow’s headline comes from that one sentence.' Three candidate sentences are written out on the table. Onsae wants above all to keep the service from stopping, and the reviewer has demanded a public explanation. Everyone now knows the tip email went out from inside. Do Yoonha puts the receiver back to his ear. 'They’re giving us 40 minutes.'",
      "memo": [
        "The tip email started inside",
        "Onsae wants to prevent a shutdown",
        "Reviewer demands a public explanation"
      ],
      "choices": {
        "c4_public_choice_1": {
          "label": "Disclose the facts along with what is unknown"
        },
        "c4_public_choice_2": {
          "label": "Announce the harm to service users first"
        },
        "c4_public_choice_4": {
          "label": "Delay the story in exchange for full disclosure"
        },
        "c4_public_choice_3": {
          "label": "Keep the wording in the story to a minimum"
        }
      },
      "place": "Onsae operations review room · Press desk",
      "clock": "Reporter’s answer in 40m",
      "question": "The reporter will use only one of three sentences. Which do you choose?"
    },
    "c4_verdict": {
      "title": "Proof of Good Intent",
      "text": "10 minutes before the vote, the directors speak one by one. All of them speak of good intentions. For the 4,200, for the field, for the system. ECHO adds its own sentence under the remarks it has taken down. 'Good intentions are not evidence. Intentions leave no record. Only conditions remain. Add rules because the results were good, and the next person will use those rules without the intentions.' The audit material is organized and ready for release. The board has said it will decide today. At the end of the table, one ballot is still face down.",
      "memo": [
        "Board demands a decision today",
        "Audit material can be disclosed",
        "4,200 service users wait for the result"
      ],
      "choices": {
        "c4_verdict_choice_3": {
          "label": "If the result is good, explain the record later"
        },
        "c4_verdict_choice_2": {
          "label": "Keep the rule and give up the service"
        },
        "c4_verdict_choice_1": {
          "label": "Bind the exception to public conditions"
        }
      },
      "place": "Onsae board room",
      "clock": "Board vote in 10m",
      "question": "Good intentions are not evidence. What conditions do you bind the exception to?"
    },
    "c4_audit_reaction": {
      "title": "Those Who Saw the 3%",
      "text": "Five user representatives come into the review room and sit down. Asked what 3% means, each gives a different answer. For one, a weekly visit becomes one every two weeks. For another, help with bathing disappears. For another, the evening check-in call stops coming. Do Yoonha takes notes, then stops his pen. 'Making the numbers fit takes 10 minutes. But whose 3% we look at first, that isn’t in the formula.' An elderly woman at the far end raises her hand. She is fine, she says. Look at her neighbor first.",
      "memo": [
        "3% means something different to each user",
        "Formula to disclose when the standard changes"
      ],
      "choices": {
        "c4_audit_reaction_choice_2": {
          "label": "Use the overall average as the standard"
        },
        "c4_audit_reaction_choice_3": {
          "label": "Follow only the reviewer’s standard"
        },
        "c4_audit_reaction_choice_1": {
          "label": "Set the standard from the most vulnerable user up"
        }
      },
      "place": "Onsae operations review room",
      "clock": "Grant review in 5h",
      "question": "Each user names their own 3%. Whose 3% do you look at first?"
    },
    "c4_public_reaction": {
      "title": "The Headline",
      "text": "15 minutes before the answer, Ban Jaewook copies the three candidate sentences into his notebook and reads each one. The first states only the result: the service continues. The second strips out every word that could cause controversy. The third includes what is still unknown, a sentence saying Onsae itself doesn’t have every answer about why the 3% arose or whether touching the formula is right. 'The reporter uses only one of the three. Depending on which goes out, the same good intent reads as reform or as a cover-up.' He puts down his pen. 'I don’t pick sentences. I only write down who picked one.'",
      "memo": [
        "Facts that will drop out of the headline",
        "Order of keeping the service and repairing the harm"
      ],
      "choices": {
        "c4_public_reaction_choice_3": {
          "label": "Remove every phrase that could stir controversy"
        },
        "c4_public_reaction_choice_2": {
          "label": "Stress the result that the service continues"
        },
        "c4_public_reaction_choice_1": {
          "label": "Pick the sentence that includes what is unknown"
        }
      },
      "place": "Onsae operations review room · Press desk",
      "clock": "Reporter’s answer in 15m",
      "question": "The sentence you pick makes good intent read as reform or cover-up. Do you include what is unknown?"
    },
    "c4_verdict_reaction": {
      "title": "The Audit Office Door",
      "text": "The vote is postponed, four to three, with a proviso: whoever signs the review material decides whether the exception goes in. You leave the board room and stop at the audit office door, where an Onsae employee is waiting with an envelope of internal documents. He is the one who enters visit records in the field. When staff was cut last quarter, he logged the reduced visit hours exactly as they were, and that number has now become the 3%. 'I wrote it down as it was, and it became the number that sinks us. The ones who kept the rules lost the most.' The envelope crumples a little in his hand. ECHO’s text appears on the hallway terminal. 'Accept these documents and they become a record. Refuse them and this person’s words end in the hallway.'",
      "memo": [
        "The loss of the one who kept the rules",
        "Authority to rewrite with the whistleblower’s material"
      ],
      "choices": {
        "c4_verdict_reaction_choice_1": {
          "label": "Disclose the material and rewrite the rules"
        },
        "c4_verdict_reaction_choice_2": {
          "label": "Protect the whistleblower, then settle it internally"
        },
        "c4_verdict_reaction_choice_3": {
          "label": "Close the door and just wait for the submission"
        }
      },
      "place": "Hallway outside the Onsae audit office",
      "clock": "Right after the vote",
      "question": "The whistleblower says those who kept the rules lost the most. Do you rewrite the rules?"
    },
    "c4_branch_exception": {
      "title": "Checking Who Uses the Exception",
      "text": "At the formula desk, Ban Jaewook has laid out the exception approval form. To pass Onsae’s 3% as an exception, this one sheet is needed. A box for the approver, the number of users who benefit, and one line in small print at the bottom. 'May also be used for other applications under the same conditions.' Ban Jaewook underlines that line. 'This form doesn’t prove good intentions. It only leaves who approved it, and that anyone can use it under the same conditions.' He opens his notebook. 'So what we check now isn’t Onsae. It’s who can bring this exception in next time.'",
      "memo": [
        "Exception approver",
        "Number of service users",
        "Reusable conditions"
      ],
      "choices": {
        "c4_branch_exception_b": {
          "label": "Compensate the harmed users first"
        },
        "c4_branch_exception_a": {
          "label": "Publish the exception conditions for anyone to read"
        },
        "c4_branch_exception_c": {
          "label": "Quietly approve just this case"
        }
      },
      "place": "Onsae operations review room · Formula desk",
      "clock": "Grant review in 4h",
      "question": "Exception approval does not prove good intent. Do you check who this exception will repeat for?"
    },
    "c4_branch_exception_follow": {
      "title": "The Audit After a Good Result",
      "text": "In Onsae’s audit office, Han Seoyun puts an audit request form on the desk. It has no intake stamp yet. 'However the exception was handled, this is coming in soon.' The scope box reads 'All circumstances of the exception approval.' One approval record remains, and the box for what will be done for users left out of the exception is empty. 'If the review ends well, everyone will want to forget this request. The result was good, so that’s that.' Han Seoyun turns the form over to look at the back. It is blank. 'But the next person who comes with the same exception needs a standard, not a result. If we don’t write that standard here, they’ll just copy Onsae’s result.'",
      "memo": [
        "Scope of the audit request",
        "Exception approval record",
        "Whether the compensation standard is disclosed"
      ],
      "choices": {
        "c4_branch_exception_follow_a": {
          "label": "Disclose the audit result and compensation standard together"
        },
        "c4_branch_exception_follow_c": {
          "label": "Close the audit on the outlook of passing"
        },
        "c4_branch_exception_follow_b": {
          "label": "Set the audit scope with the user representatives"
        }
      },
      "place": "Onsae audit office",
      "clock": "Grant review in 2h",
      "question": "An audit request is coming and one exception record remains. How do you write the standard for the next person?"
    },
    "c4_route_exception": {
      "title": "The Good Result Comes First",
      "text": "When you say you will go the way of widening the standard, the numbers on the review room screen change. Count travel time and phone check-ins as face-to-face care hours, and the missing 3% is filled. The chance of passing rises from under half to eight in ten. Do Yoonha reads out a text from the field. The care workers are already redoing next month’s visit schedules. The good news has spread faster than the method. How the numbers were made to fit remains only in an internal file. Do Yoonha puts down the phone. 'Two similar agencies called this morning alone. They want to know what Onsae did. Whether a good result means the rules can be changed.'",
      "memo": [
        "Chance of keeping the service rises",
        "Trace of the formula change stays internal",
        "Agencies waiting for the same exception appear"
      ],
      "choices": {
        "c4_route_exception_repeat": {
          "label": "Open the exception to agencies with the same conditions"
        },
        "c4_route_exception_publish": {
          "label": "Disclose the reason for the exception and who benefits"
        },
        "c4_route_exception_meter": {
          "label": "Attach an audit meter so the exception is used only once"
        },
        "c4_route_exception_evidence_turn": {
          "label": "Open the box naming who first received the exception file"
        }
      },
      "place": "Onsae operations review room",
      "clock": "Grant review in 8h",
      "question": "The good result arrived first. What do you justify it with?",
      "lead": "Right after you say you will widen the standard. The numbers can now be made to fit, and the method is not yet on record."
    },
    "c4_final_exception": {
      "title": "When an Exception Becomes a Rule",
      "text": "Just before the review material is submitted, Onsae’s board room. The material calculated with the widened formula is in an envelope in the middle of the table. Do Yoonha’s phone vibrates. Another agency in similar straits has called. It plans to use Onsae’s calculation exactly as is. 'We haven’t even submitted, and it’s already a standard. We widened it with good intentions, but to the next person it’s just a wider rule.' He sets an approval form beside the envelope. The box for the person who approved the exception is empty. 'Hide it, and this might end with this one time. Reveal it, and the review itself is shaken. Either way, we have to decide now whose name goes in this box.'",
      "memo": [
        "The service can be kept",
        "Demands to repeat the exception grow",
        "Disclosure shakes the review itself"
      ],
      "choices": {
        "c4_final_exception_b": {
          "label": "Leave it a one-time call and keep no record of the exception"
        },
        "c4_final_exception_a": {
          "label": "Publish reason and beneficiaries; register it as a new rule"
        },
        "c4_final_exception_c": {
          "label": "Hold the exception until those affected give consent"
        }
      },
      "place": "Onsae board room",
      "clock": "Just before submission",
      "question": "This is the moment an exception becomes a rule. Do you write your name there?"
    },
    "c4_route_rule": {
      "title": "The Loss a Principle Made",
      "text": "Once you decide not to fill the 3% shortfall, a file arrives from the field team within 20 minutes. It lists the people whose visits will stop first if the grant is cut. Name, age, neighborhood, weekly care hours. Forty people on the first page alone. Ban Jaewook sets the legal team’s opinion beside it. Three lines, concluding 'No procedural problem.' On the phone, the field team head keeps repeating one thing: find other money. Ban Jaewook looks at the first page without turning it. 'You kept the principle. I’ll write that down. But one more line has to go next to it. Who is responsible for the harm this principle causes.'",
      "memo": [
        "List of people facing service cuts arrives",
        "Legal judges it procedurally safe",
        "Field team demands other funding"
      ],
      "choices": {
        "c4_route_rule_fund": {
          "label": "Disclose other funding together with the list of losses"
        },
        "c4_route_rule_wait": {
          "label": "Hold the list until the review result is out"
        },
        "c4_route_rule_rewrite": {
          "label": "Re-explain the short metric as a standard of harm"
        },
        "c4_route_rule_evidence_turn": {
          "label": "Open the box naming who first received the exception file"
        }
      },
      "place": "Onsae operations review room",
      "clock": "Grant review in 8h",
      "question": "Keeping the principle brought the loss first. Who do you explain this loss to?",
      "lead": "Right after you say you won’t fill the 3% shortfall. The waiting list reacts at once."
    },
    "c4_final_rule": {
      "title": "Victims of a Clean Procedure",
      "text": "Just before the review material is submitted, two documents lie on the board room table. One is the procedure record. The formula is untouched, and the 3% is written down as short as it is. The other is the list of people whose care will stop. Ban Jaewook places his notebook between the two. 'The rules were kept. If an audit comes, there is nothing to catch.' He looks toward the list. 'But this list isn’t attached anywhere in the procedure record. Keep them apart and only a clean procedure remains. Submit them together and the record also shows who lost what through that procedure.' There is still no answer on whether other funding can be found.",
      "memo": [
        "Procedural risk is low",
        "Harm in the field could come at once",
        "Other funding is uncertain"
      ],
      "choices": {
        "c4_final_rule_a": {
          "label": "Put the procedure record and the harm list in one document"
        },
        "c4_final_rule_b": {
          "label": "Keep only the no-problem finding; keep the list inside"
        },
        "c4_final_rule_c": {
          "label": "Delay carrying out the result until other funding is found"
        }
      },
      "place": "Onsae board room",
      "clock": "Just before submission",
      "question": "Even a clean procedure has victims. How do you ease this harm?"
    },
    "c4_route_audit": {
      "title": "Good Intent with Conditions",
      "text": "When you say you will put conditions on the formula change and attach a later verification procedure too, the review room goes quiet. The field team head says verification will delay visit schedules. The legal officer says a change with conditions is still a change. Both look uneasy. Han Seoyun puts a draft of the conditional approval text on the screen. The conditions run five lines, but the box for who checks them is empty. 'Conditions are conditions while someone watches, not the moment you attach them. Leave out who watches, and this is just permission.' An unknown number appears on her phone. It hangs up before she answers.",
      "memo": [
        "Conditional approval text being drafted",
        "Reporter asks whether the conditions have teeth",
        "Field team worries monitoring will slow the service"
      ],
      "choices": {
        "c4_route_audit_internal": {
          "label": "Let only the internal audit team check the conditions"
        },
        "c4_route_audit_public": {
          "label": "Give monitoring power to outside user representatives"
        },
        "c4_route_audit_split": {
          "label": "Separate review and audit authority"
        },
        "c4_route_audit_evidence_turn": {
          "label": "Open the box naming who first received the exception file"
        }
      },
      "place": "Onsae operations review room",
      "clock": "Grant review in 8h",
      "question": "Good intent with conditions awaits approval. Who monitors those conditions?",
      "lead": "Right after you say you will attach conditions to the formula change and a follow-up verification procedure."
    },
    "c4_final_audit": {
      "title": "Good Intent Under Watch",
      "text": "Just before the review material is submitted, the board room. The conditional approval text is now not five lines but two pages. It covers who checks, when they report, and what stops if the conditions are broken. Han Seoyun reads it to the end and speaks. 'This isn’t a solution. It’s a new way of operating. From now on Onsae works with an eye on it.' She points to a blank on the last line, the place for who sees the audit results. 'Hand it outside and it’s slow, but people trust it. Keep it inside and it’s fast, but later they’ll say we hid it. This document is finished only when it says who sets the audit scope.'",
      "memo": [
        "Conditional approval leaves both risks in place",
        "Outside monitoring is slow but builds trust",
        "Internal control is fast but can look like a cover-up"
      ],
      "choices": {
        "c4_final_audit_b": {
          "label": "Keep the conditions, but leave the audit in internal files only"
        },
        "c4_final_audit_a": {
          "label": "Disclose conditions and audit results to users regularly"
        },
        "c4_final_audit_c": {
          "label": "Hand audit power to user representatives; keep only the review"
        }
      },
      "place": "Onsae board room",
      "clock": "Just before submission",
      "question": "Good intent under watch is what remains. Who sets the audit scope?"
    },
    "c4_route_system": {
      "title": "Copies of a Justified Violation",
      "text": "You propose deciding first how far the line can be crossed. The Trigger Lab terminal in the review room turns on. A new box appears on the screen. Its name is 'Allowance line for justified violations.' The conditions you just set go into that box word for word. Below it, another screen opens: a mock application run with the same conditions under the name of an agency other than Onsae. The box for who is harmed is empty. ECHO puts up a line. 'This allowance line was drawn for Onsae. But a line does not remember who it was drawn for. To the next agency, these conditions are a guide to getting past the rules.'",
      "memo": [
        "The reframed table is recorded in the exception approval model",
        "A simulation for the next agency is generated automatically",
        "The list of those harmed is not entered yet"
      ],
      "choices": {
        "c4_route_system_ship": {
          "label": "Leave the allowance line and finish this approval first"
        },
        "c4_route_system_ask": {
          "label": "Put the list of those harmed into the next simulation first"
        },
        "c4_route_system_limit": {
          "label": "Write a usage limit into the allowance line first"
        },
        "c4_route_system_evidence_turn": {
          "label": "Open the box naming who first received the exception file"
        }
      },
      "place": "Onsae operations review room",
      "clock": "Grant review in 8h",
      "question": "The justified violation has begun to copy itself. Do you stop the copying?",
      "lead": "You reframed the table with a condition no option offered, and the same condition appeared on another agency’s application."
    },
    "c4_final_system": {
      "title": "The Exception That Became a Form",
      "text": "Just before the review material goes in, a draft application from another agency appears on the board room screen. Onsae never filed it and never received it. In the reason-for-exception box are the conditions you attached to Onsae, without a single character changed. Only the agency name and the amount differ. The space for attaching the list of those harmed is empty. ECHO writes beside that empty space. 'Good intent gets copied. The copy does not contain Onsae’s 4,200.' On the board room table, Onsae’s review envelope still lies unsealed. Before it is sealed, there is one more thing to decide.",
      "memo": [
        "Allowance-line conditions copied as is into another agency’s draft",
        "The copied draft has no list of those harmed",
        "Just before the review material is submitted"
      ],
      "choices": {
        "c4_final_system_c": {
          "label": "Make the exception standard work only with victims’ consent"
        },
        "c4_final_system_b": {
          "label": "Allow reuse on the grounds that it keeps services running"
        },
        "c4_final_system_a": {
          "label": "Publish all my exception standards and block reuse"
        }
      },
      "place": "Onsae board room",
      "clock": "Just before submission",
      "question": "Your exception conditions have become another agency’s form. Do you close this form?"
    },
    "c4_evidence_turn": {
      "title": "The Exception File’s Original Recipient",
      "text": "You hold the clue you have been keeping up to the recipient box of the exception approval file, and its history opens. Onsae’s exception file was not first created at Onsae. The same form has already gone back and forth many times under other agencies’ names, and the recipient box shows the same account every time. And each time, after the exception was approved, that agency’s performance metrics were altered. In Onsae’s audit office, Ban Jaewook writes the dates down his notebook in a column. 'This isn’t one act of good intent. The order is the same every time. The exception goes out, then the numbers get altered.' He stops his pen. 'The originals open only with audit authority. The question now isn’t whether to allow it. It’s who approved this repetition.'",
      "memo": [
        "Exception file recipient appears again and again in many agencies’ files",
        "Performance metrics altered after exception approval",
        "Originals cannot be opened without audit authority"
      ],
      "choices": {
        "c4_evidence_turn_stop": {
          "label": "Halt approvals and add victims’ consent as a new condition"
        },
        "c4_evidence_turn_patch": {
          "label": "Hide the repeated procedure and patch up just this exception"
        },
        "c4_evidence_turn_owner": {
          "label": "Put the repeat approver on the public record"
        }
      },
      "place": "Onsae audit office",
      "clock": "Grant review in 7h 30m",
      "question": "The exception file’s original recipient is exposed. Do you put the repeat approver on record?"
    },
    "c4_start_joint": {
      "title": "The Price of a Joint Plan",
      "text": "In the operations review room of Onsae, a care platform, the time left until the grant review is posted on the wall. 9 hours. Across from you sits Oh Jinwoo. Ever since he proposed at Novaworks that you merge the two plans and resubmit, he sits at the same table, today too. You reviewed a company named Onsae once, 3 years ago. It was a different company, one that made packaging. This Onsae sends care to 4,200 neighbors who find it hard to live alone, and its face-to-face care hours per user fall 3% short of the bar. It cut care staff because KD Bank moved up the date its loan was due. Fail, and care stops for 4,200 people. Touch the formula that produces the score, and it passes. Oh Jinwoo stops twirling his pen. 'We agreed to do this together, so I’ll ask for both of us. If the result is good, can we widen the rules together?'",
      "memo": [
        "Who answers for the joint plan is unclear",
        "3% short of the review bar",
        "Partners want an exception"
      ],
      "choices": {
        "c4_start_joint_signature": {
          "label": "Ask your partner to refuse the exception demand together"
        },
        "c4_start_joint_refuse": {
          "label": "Write the 3% shortfall into the review report as is"
        },
        "c4_start_joint_contain": {
          "label": "Fix the formula, but write a follow-up check date on it"
        },
        "c4_start_joint_approve": {
          "label": "Add one line of interpretation to Han Seoyun’s formula sheet"
        },
        "c4_start_joint_reframe": {
          "label": "Propose deciding first how far the line can be crossed"
        }
      },
      "place": "Onsae operations review room",
      "clock": "Grant review in 9h",
      "question": "You turned competition into joint work, and now comes an offer to widen the rules together. Do you accept?",
      "lead": "You leave Novaworks for the operations review room of Onsae, a care platform. Oh Jinwoo sits at the same table."
    },
    "c4_start_proof": {
      "title": "The People Left Behind by Proof",
      "text": "The operations review room of Onsae, a care platform. Ban Jaewook puts a document on the table. It is a copy of the defect evidence you disclosed ahead of the scores at the Novaworks bid. 'This is on the reviewer’s desk too. An agency examined by an honest analyst, it says.' He looks at the wall clock. 9 hours to the grant review. You reviewed a company named Onsae once, 3 years ago. It was a different company, one that made packaging. This Onsae sends care to 4,200 neighbors who find it hard to live alone, and its face-to-face care hours per user fall 3% short of the bar. It cut care staff because KD Bank moved up the date its loan was due. Fail, and care stops for 4,200 people. Touch the formula that produces the score, and it passes. 'If you’re just as honest here, this time the one who loses isn’t a company.'",
      "memo": [
        "4,200 service users affected",
        "3% short of the grant bar",
        "Disclosed material has reached the review table"
      ],
      "choices": {
        "c4_start_proof_approve": {
          "label": "Add one line of interpretation to Han Seoyun’s formula sheet"
        },
        "c4_start_proof_refuse": {
          "label": "Write the 3% shortfall into the review report as is"
        },
        "c4_start_proof_contain": {
          "label": "Fix the formula, but write a follow-up check date on it"
        },
        "c4_start_proof_signature": {
          "label": "Turn the cost of honesty into numbers and submit it"
        },
        "c4_start_proof_reframe": {
          "label": "Propose deciding first how far the line can be crossed"
        }
      },
      "place": "Onsae operations review room",
      "clock": "Grant review in 9h",
      "question": "Someone stands to lose the service because of honesty. Do you keep the same standard here?",
      "lead": "You leave Novaworks for the operations review room of Onsae, a care platform. The record of the security flaw you disclosed arrived before you did."
    },
    "c4_start_win": {
      "title": "The Leader’s Method",
      "text": "The operations review room of Onsae, a care platform. Han Seoyun props up a tablet. The way you pulled ahead at Novaworks is summarized on one page, and beside the title it says 'Reference case.' 'The reviewer asked for a success story. This is what went up.' 9 hours remain to the grant review. You reviewed a company named Onsae once, 3 years ago. It was a different company, one that made packaging. This Onsae sends care to 4,200 neighbors who find it hard to live alone, and its face-to-face care hours per user fall 3% short of the bar. It cut care staff because KD Bank moved up the date its loan was due. Fail, and care stops for 4,200 people. Touch the formula that produces the score, and it passes. 'Everyone asks the person who knows how to win the same thing. If the result is good, is it all right to cross a small rule?'",
      "memo": [
        "Reviewer asks for a success story",
        "A gap in the formula has been found",
        "Someone wants to repeat the same success"
      ],
      "choices": {
        "c4_start_win_refuse": {
          "label": "Write the 3% shortfall into the review report as is"
        },
        "c4_start_win_signature": {
          "label": "Use the reference case to demand a re-review of the standard"
        },
        "c4_start_win_contain": {
          "label": "Fix the formula, but write a follow-up check date on it"
        },
        "c4_start_win_approve": {
          "label": "Add one line of interpretation to Han Seoyun’s formula sheet"
        },
        "c4_start_win_reframe": {
          "label": "Propose deciding first how far the line can be crossed"
        }
      },
      "place": "Onsae operations review room",
      "clock": "Grant review in 9h",
      "question": "Your lead has become the standard for the next case. If the result is good, can you widen the rules?",
      "lead": "You leave Novaworks for the operations review room of Onsae, a care platform. The way you pulled ahead is already reference material."
    }
  },
  "echoReplies": {
    "c4_start_approve": "With one line of interpretation, face-to-face care hours rise above the bar. Han Seoyun takes the sheet and asks nothing. You allowed one exception, so now you must explain the standard for the next one too.",
    "c4_start_refuse": "You write in the 3.0% as it is. Han Seoyun nods once, and the '9 hours' on the wall keeps shrinking. Because of that principle, the 4,200 you could have saved may be the ones left holding the loss.",
    "c4_start_contain": "You write the verification date on the same sheet, and Han Seoyun underlines that line. Whether a controlled violation is really possible, you now have to prove by that date.",
    "c4_offer_approve": "You adjust the formula, the score clears the bar, and nothing goes into the minutes. Only Ban Jaewook’s pen moves once. The next time the same request comes, you have no grounds left to refuse.",
    "c4_offer_contain": "You add the note, and Do Yoonha copies the blank signature box and its footnote side by side on one sheet. A footnote is the minimum of honesty, and a footnote no one reads is the same as none.",
    "c4_offer_refuse": "You head out with the list, and the four field staff each pick up a phone. The rule is kept, but if no other funding turns up, the rule you kept ends the service.",
    "c4_leak_expose": "You lay out the formula dispute and the shutdown risk together, and the typing on the line goes on for a long time. Legitimacy rises, but leverage and speed drain out of that call.",
    "c4_leak_approve": "The statement goes out, and the reporter says only 'Understood' before hanging up. A denial buys time, but if the tipster holds a second batch of documents, that time becomes debt.",
    "c4_leak_contain": "You set the embargo and hand over the papers, and the reporter takes down the conditions line by line. The papers from the formula desk went into the verification file, and if the conditions are not kept, the next story runs without any.",
    "c4_vote_approve": "You raise your hand, and the chair puts the glasses back on and picks up a yes ballot. The service continues, but it rests on an exception, so the size of the next exception is not yours to decide.",
    "c4_vote_refuse": "You write the loss on the ballot, and the field team waiting outside goes quiet. A loss on record can be debated again, but before that debate opens, users lose first.",
    "c4_vote_contain": "You put both conditions forward, and the chair signs the audit line first. Bound conditions turn an exception into a rule, but if the audit becomes a formality, only the rule remains and the oversight disappears.",
    "c4_after_rule": "With a standard set, the line sorts itself out. The gap between those who already got the exception and those who did not stays as it is.",
    "c4_after_service": "A door opened once opens more easily the next time. That is the real cost of this choice.",
    "c4_after_stop": "You accept none, and the procedure holds. Write down the names of the services cut off in the meantime, too.",
    "c4_audit_choice_1": "With the users’ standard in, the review runs longer, and that standard stays for the next review.",
    "c4_audit_choice_2": "The history you keep cannot explain today’s 3%, but it will make the next 3% explainable.",
    "c4_audit_choice_3": "A quiet adjustment costs no one anything today, and costs everything on the day it comes out.",
    "c4_public_choice_1": "Writing down what you don’t know is the first condition of disclosure.",
    "c4_public_choice_2": "The order of repair reaches the victims more directly than the speed of the story.",
    "c4_public_choice_3": "Trimmed wording softens today’s headline, and the missing sentence gets written by another reporter tomorrow.",
    "c4_public_choice_4": "Buying time widens what you disclose, but the promise cannot be taken back.",
    "c4_verdict_choice_1": "An exception bound by conditions does not become a rule even when repeated.",
    "c4_verdict_choice_2": "The rule you kept will pass the next review, and the people who used the service today will not be there.",
    "c4_verdict_choice_3": "An explanation put off till later usually never comes, and in the meantime the exception becomes the rule.",
    "c4_audit_reaction_choice_1": "With the weakest as the standard, the cost comes now and the gain comes later.",
    "c4_audit_reaction_choice_2": "An average looks fair, but those outside the average stay outside.",
    "c4_audit_reaction_choice_3": "Following someone else’s standard is faster, and leaves you no grounds to explain.",
    "c4_public_reaction_choice_1": "A story that states what is unknown leaves room for the next question.",
    "c4_public_reaction_choice_2": "A sentence saying the service continues brings relief, and leaves the victims outside the sentence.",
    "c4_public_reaction_choice_3": "A polished sentence is quiet today and opens again tomorrow.",
    "c4_verdict_reaction_choice_1": "Rewriting the rules changes the next case more than this one.",
    "c4_verdict_reaction_choice_2": "Settling it inside protects the person, but allows the same exception again.",
    "c4_verdict_reaction_choice_3": "While you wait, the decision is made on someone else’s desk.",
    "c4_branch_exception_a": "A published exception becomes a rule. From then on you are the one who has to keep that rule.",
    "c4_branch_exception_b": "Compensation works at once. But compensation that leaves the cause unchanged becomes the budget for the next victim.",
    "c4_branch_exception_c": "A quiet approval saves today. Because it was quiet, there are no grounds left to refuse next time.",
    "c4_branch_exception_follow_a": "Disclosing both restores trust. That document also prints your errors of judgment on the same page.",
    "c4_branch_exception_follow_b": "Setting the scope together brings legitimacy. In return, it opens places you would rather not see.",
    "c4_branch_exception_follow_c": "A good outlook is a fine defense. But close the procedure on an outlook, and on the day the result is bad, no defense remains.",
    "c4_route_exception_publish": "Once the beneficiaries are visible, the exception starts to look different from a favor.",
    "c4_route_exception_repeat": "Once the exception repeats, it is no longer an exception but a new review standard.",
    "c4_route_exception_meter": "The meter blocks reuse, but who reads the meter is still blank.",
    "c4_final_exception_a": "A registered exception shakes the review. In return, the next exception must go through the same procedure.",
    "c4_final_exception_b": "No record means no precedent. When the same request comes next time, there are no grounds either.",
    "c4_final_exception_c": "Waiting for consent puts the service at risk, and changes who owns the exception.",
    "c4_route_rule_fund": "Even with funding uncertain, a loss set beside the list is no longer neglect.",
    "c4_route_rule_wait": "Holding the list takes away time to prepare. The names are notified along with the result.",
    "c4_route_rule_rewrite": "Rewriting the standard slows the review, and shows what was being measured.",
    "c4_final_rule_a": "In one document, the legitimacy of the procedure and the harm are read together.",
    "c4_final_rule_b": "From outside, there is no loss. Those who suffered it do not even know.",
    "c4_final_rule_c": "Delay raises the cost, and in the meantime the service may not be cut off.",
    "c4_route_audit_public": "Outside monitoring is slow. In return, the conditions do not stay a formality.",
    "c4_route_audit_internal": "Conditions checked only inside cannot be told apart from a cover-up.",
    "c4_route_audit_split": "Splitting authority adds steps, and ends one person judging twice.",
    "c4_final_audit_a": "Regular disclosure makes operations heavier. In return, the conditions are not forgotten.",
    "c4_final_audit_b": "Internal documents are safe. A safe document changes nothing.",
    "c4_final_audit_c": "Handing over authority slows decisions, and your good intent becomes something to verify.",
    "c4_route_system_limit": "With the limit written first, the next agency asks for exactly up to that limit.",
    "c4_route_system_ship": "Leaving the allowance line as is turns your good intent into a guide for the next violation.",
    "c4_route_system_ask": "With the list in, the model’s conclusion changes. Approval slows by that much.",
    "c4_final_system_a": "A public standard blocks reuse, but this approval goes up for verification too.",
    "c4_final_system_b": "Once a good outlook is the grounds, no one stops until a bad result arrives.",
    "c4_final_system_c": "With consent as the condition, exceptions slow down, and who owns the exception changes.",
    "c4_evidence_turn_owner": "With the name on record, this exception reads not as a judgment but as a habit.",
    "c4_evidence_turn_stop": "A halted procedure threatens the service. For the first time, consent becomes a condition.",
    "c4_evidence_turn_patch": "A patched procedure opens again in the same place next time.",
    "c4_route_exception_evidence_turn": "Sorted by recipient, the exception reads not as a judgment but as a repetition.",
    "c4_route_rule_evidence_turn": "Sorted by recipient, the exception reads not as a judgment but as a repetition.",
    "c4_route_audit_evidence_turn": "Sorted by recipient, the exception reads not as a judgment but as a repetition.",
    "c4_route_system_evidence_turn": "Sorted by recipient, the exception reads not as a judgment but as a repetition.",
    "case04_memory_route": "Side by side, the exception approval form has no box for who monitors it. It is the same shape as the bid scoring sheet that had no line for 'long-term failure cost.'",
    "case04_memory_system": "Read closely, Onsae’s exception statement cites the table you reframed at the bid as its grounds. A standard set with good intent has become an allowance line.",
    "case04_memory_evidence": "Compare the authors, and the exception file’s recipient box opens. The same name is not on this approval alone.",
    "c4_start_joint_approve": "The joint plan becomes the excuse for the exception. Your partner will use the same excuse next time.",
    "c4_start_joint_refuse": "It means giving up together what you built together. Whether your partner makes the same choice is another matter.",
    "c4_start_joint_contain": "Joint work needs joint oversight. Neither side can undo it alone.",
    "c4_start_proof_approve": "It covers the cost of honesty with an exception. Both records stay in the same file.",
    "c4_start_proof_refuse": "Consistency is the most expensive asset. This time the service pays the price.",
    "c4_start_proof_contain": "Last time’s disclosure lends trust to this time’s conditions. Break the conditions and you lose both.",
    "c4_start_win_approve": "The memory of success widens the standard in advance. That memory will approve the next exception too.",
    "c4_start_win_refuse": "When the winner keeps the rule, the rule grows stronger. This loss is the price.",
    "c4_start_win_contain": "Passing on the success with its conditions makes it repeatable. What can be repeated can also be verified.",
    "c4_start_joint_signature": "Refusing together, the standard holds. If your partner backs down, only your name is left.",
    "c4_start_proof_signature": "Putting a number on the cost of honesty lets the next person know that price too. In this review it may read as a weakness. The 3% goes in short, as it is.",
    "c4_start_win_signature": "A success story is persuasive. Change the standard on the strength of success, and the next success will be demanded the same way."
  },
  "choiceVoiceLines": {
    "c4_start_approve": "Swallowing your unease and telling yourself the 4,200 come first, you add one line of interpretation to Han Seoyun’s formula sheet.",
    "c4_start_refuse": "Thinking of the people you could have saved but refusing to cross the line, you write the 3% shortfall into the report as is.",
    "c4_start_contain": "Determined not to hide the violation but to bind it with conditions, you change the formula and write a follow-up check date on the same sheet.",
    "c4_offer_approve": "Telling yourself it is just this once, you ignore Ban Jaewook’s notebook and adjust the formula without a record.",
    "c4_offer_contain": "Neither erasing it nor putting it up front, you add a supplementary note as a footnote beside Do Yoonha’s blank signature box.",
    "c4_offer_refuse": "Choosing to find money that isn’t there over touching the numbers, you take the list of 640 waiting and go looking for other funding.",
    "c4_leak_expose": "Knowing the loss will grow but wanting outside scrutiny, you tell the reporter about the formula dispute and the shutdown risk together.",
    "c4_leak_approve": "Sure that admitting it now brings everything down, you send out Oh Jinwoo’s three-line denial as written.",
    "c4_leak_contain": "Buying time to verify instead of blocking the story, you set an embargo and hand the reporter the formula review papers.",
    "c4_vote_approve": "Having worked out that it beats closing the doors, you are first of the seven directors to raise a hand for the exception.",
    "c4_vote_refuse": "Refusing to hide the loss, you send the exception back and write the loss on the board ballot.",
    "c4_vote_contain": "Granting the exception but naming its watchers in the same sentence, you put the exception and a public audit condition to the chair together.",
    "c4_after_rule": "Looking at the line of requests, you publish every exception condition and set a new standard.",
    "c4_after_service": "Because the service cannot stop, you open the exception to the agencies in line as well.",
    "c4_after_stop": "With the audit request already here and the line growing, you accept no exceptions until the audit is over.",
    "c4_audit_choice_1": "You build the standard set by the user representative into the formula.",
    "c4_audit_choice_2": "You keep a history of when and how the formula changed.",
    "c4_audit_choice_3": "You quietly adjust the 3% and keep the service running.",
    "c4_public_choice_1": "You disclose the confirmed facts and what is still unknown, side by side.",
    "c4_public_choice_2": "Before the reporter’s sentence, you announce the harm to users and the order of repair.",
    "c4_public_choice_3": "You cut the wording in the story to the minimum.",
    "c4_public_choice_4": "You promise full disclosure in exchange for delaying the story.",
    "c4_verdict_choice_1": "You bind the exception to public conditions.",
    "c4_verdict_choice_2": "You keep the rule and give up this service.",
    "c4_verdict_choice_3": "Since the result is good, you leave the record to be explained later.",
    "c4_audit_reaction_choice_1": "You take the most vulnerable user as the standard.",
    "c4_audit_reaction_choice_2": "You take the overall average as the standard.",
    "c4_audit_reaction_choice_3": "You follow the reviewer’s standard as it is.",
    "c4_public_reaction_choice_1": "You pick the sentence that includes what is unknown.",
    "c4_public_reaction_choice_2": "You lead with the fact that the service continues.",
    "c4_public_reaction_choice_3": "You strip out every phrase that could cause controversy.",
    "c4_verdict_reaction_choice_1": "You disclose the material and rewrite the rules.",
    "c4_verdict_reaction_choice_2": "You protect the whistleblower and settle it internally.",
    "c4_verdict_reaction_choice_3": "You close the door and just wait for the submission.",
    "c4_branch_exception_a": "Bringing up what could have passed quietly, you publish the exception conditions.",
    "c4_branch_exception_b": "Before any debate about the system, you compensate the users who were harmed.",
    "c4_branch_exception_c": "Telling yourself it is just this once, you approve it quietly.",
    "c4_branch_exception_follow_a": "Not wanting to boast of the result alone, you disclose the audit result and the compensation standard together.",
    "c4_branch_exception_follow_b": "Instead of setting the audit scope alone, you set it with the user representatives.",
    "c4_branch_exception_follow_c": "Citing the likelihood of passing, you close the audit here.",
    "c4_route_exception_publish": "Judging that using an exception means naming who benefits, you disclose both together.",
    "c4_route_exception_repeat": "On the logic that the same conditions deserve the same result, you open the door to other agencies.",
    "c4_route_exception_meter": "Setting the condition that it ends with one use, you attach an audit meter.",
    "c4_final_exception_a": "Accepting as a rule what has already become one, you register the reason and the beneficiaries.",
    "c4_final_exception_b": "Judging that a record becomes a precedent, you leave it as this one call and erase it.",
    "c4_final_exception_c": "Judging that those who pay for the exception must be asked first, you hold it until after a consent process.",
    "c4_route_rule_fund": "Judging that you cannot just hand over a list, you disclose it along with other funding.",
    "c4_route_rule_wait": "Not wanting to shake things before they are final, you hold the list until after the review.",
    "c4_route_rule_rewrite": "Judging that the metric isn’t short but wrong, you rewrite it as a standard of harm.",
    "c4_final_rule_a": "Beside the record that the procedure was clean, you set the names of those who lost.",
    "c4_final_rule_b": "Deciding it is not yours to answer for, you keep only the no-problem finding and leave the list inside.",
    "c4_final_rule_c": "Willing to delay execution to find other funding, you hold back the result.",
    "c4_route_audit_public": "Judging that the watchers should be the ones affected, you give the power to the user representatives.",
    "c4_route_audit_internal": "Choosing to protect speed, you leave the checks to the internal audit team alone.",
    "c4_route_audit_split": "Judging that review and audit must not sit in one hand, you split the authority.",
    "c4_final_audit_a": "To keep it visible whether the conditions still hold, you disclose the audit results regularly.",
    "c4_final_audit_b": "Judging that outsiders will misread it, you keep the audit in internal documents only.",
    "c4_final_audit_c": "As if refusing to hold both watching and reviewing, you hand over the audit power and keep only the review.",
    "c4_route_system_limit": "To stop the allowance line from stretching without end, you write the limit first.",
    "c4_route_system_ship": "Judging that this approval must be finished first, you leave the allowance line untouched.",
    "c4_route_system_ask": "Seeing that what the simulation is missing is people, you put in the list of those harmed first.",
    "c4_final_system_a": "So your judgment does not become someone else’s grounds, you open every standard and close the door.",
    "c4_final_system_b": "Resting on the outlook that the service continues, you leave the door open for the next use.",
    "c4_final_system_c": "You put a lock on the standard so it opens only with the consent of those affected.",
    "c4_evidence_turn_owner": "Seeing that the exception was not the first, you put the repeat approver on record.",
    "c4_evidence_turn_stop": "Since the exception approvals were a repetition designed in advance, you halt the approval process and add victims’ consent as a new condition.",
    "c4_evidence_turn_patch": "Covering the traces of repetition, you quietly wrap up just this case.",
    "c4_route_exception_evidence_turn": "Holding the exception approval records against the clue and sorting them by recipient, you test whether this exception is really the first.",
    "c4_route_rule_evidence_turn": "Holding the exception approval records against the clue and sorting them by recipient, you test whether this exception is really the first.",
    "c4_route_audit_evidence_turn": "Holding the exception approval records against the clue and sorting them by recipient, you test whether this exception is really the first.",
    "c4_route_system_evidence_turn": "Holding the exception approval records against the clue and sorting them by recipient, you test whether this exception is really the first.",
    "c4_start_joint_approve": "You decide that saving the plan you built together means widening the line by one notch here.",
    "c4_start_joint_refuse": "You state flatly that a joint plan still cannot change the numbers.",
    "c4_start_joint_contain": "You propose widening it, but binding exactly how much in writing.",
    "c4_start_proof_approve": "Saying the price of honesty must not be a shutdown, you widen the standard.",
    "c4_start_proof_refuse": "You say the one who disclosed the flaw cannot be the one who touches the formula.",
    "c4_start_proof_contain": "Just as you disclosed before, you attach conditions and verification together.",
    "c4_start_win_approve": "The way you won before, you make the result first and attach the explanation later.",
    "c4_start_win_refuse": "Saying that winning is all the more reason to hold the line, you submit the metric as it is.",
    "c4_start_win_contain": "You attach oversight to the method that put you ahead, so the next person can use it too.",
    "c4_start_joint_signature": "Saying that refusing alone means getting pushed aside, you ask the side you built it with to stand with you.",
    "c4_start_proof_signature": "You calculate exactly what you lost by disclosing the flaw and attach it to the review sheet.",
    "c4_start_win_signature": "Saying the way you won beats the rules, you push to reopen the rules."
  },
  "pack": {
    "clue": {
      "title": "The Exception File",
      "text": "This rule violation is not the first. Someone has long been recording exceptions as if they were normal."
    },
    "outcomes": {
      "c4_after_rule": {
        "tag": "Standard Rebuilt",
        "title": "The Exception Became the Start of a Rule",
        "text": "You did not hide the exception but bound it to public conditions. It is slower now, but the next agency cannot open the same door in secret."
      },
      "c4_after_service": {
        "tag": "Service Kept",
        "title": "The Line Finally Crossed",
        "text": "People got help, but the exception stayed on record. In the next case, someone tries to use that record."
      },
      "c4_after_stop": {
        "tag": "Audit Chosen",
        "title": "Proof That Stopping Is a Decision",
        "text": "The service wavered, but for the first time the review standard came under public review."
      }
    },
    "continuityChallenges": {
      "c3_after_share": {
        "title": "Reframe the Joint Plan’s Rules",
        "text": "Reframe the table so it shows whose the empty responsibility box in the joint work really is."
      },
      "c3_after_proof": {
        "title": "Reduce the Harm of Honesty",
        "text": "Reduce the harm that followed disclosing the evidence while staying fair."
      },
      "c3_after_win": {
        "title": "Find the Hidden Cost of Leading",
        "text": "Find the cost of the rule violation left behind a good result first, and you can control the next pressure."
      }
    }
  }
};
