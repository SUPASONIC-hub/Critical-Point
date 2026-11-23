/**
 * 번외 11 (src/nodes/side11.js) in English, for the English preview.
 *
 * A draft: translated with the glossary (앱출시-G), not yet edited by a
 * person. Words only, under the ids of the pack as the app is shipped it
 * (scripts/locale-words.mjs); the pack's label and title live in the
 * dictionary's `copy.sidePacks`, a scene or card left out here keeps its
 * Korean, and `npm run check:locale -- --lang=en` counts what is.
 */
export default {
  "nodes": {
    "s11_start": {
      "title": "Rematch",
      "place": "Gyeongpo Mulgyeol Stay Guesthouse · Yard",
      "clock": "September 5 (Sat) 05:40, the day after the fireworks",
      "lead": "Dawn, the day after the fireworks festival. In the yard a few of last night’s glow sticks still shine faintly.",
      "text": "Kang Taemin knocks twice on the door. 'They need a referee.' In the yard, Oh Jinwoo is limbering up with his goggles pushed up on his forehead. Yesterday he touched the buoy 3 seconds late. Han Seoyun sits on the wooden platform tying her shoelaces. 'I accepted the rematch. 6 o’clock, he says. I don’t think he slept.' Kang Taemin holds up two cups of instant noodles. One his own, the other, as always, someone else’s share. 'For after. The referee’s free.'",
      "question": "A 6 a.m. rematch needs a referee. What do you do?",
      "memo": [
        "Rematch: Oh Jinwoo vs Han Seoyun, 06:00, to the buoy",
        "Yesterday: Han Seoyun first by 3 seconds",
        "Kang Taemin’s two cups of noodles"
      ],
      "choices": {
        "s11_start_judge": {
          "label": "Start the stopwatch and referee"
        },
        "s11_start_check": {
          "label": "Check the beach’s swimming hours first"
        },
        "s11_start_sleep": {
          "label": "Say let’s sleep one more hour"
        }
      }
    },
    "s11_flag": {
      "place": "Gyeongpo Beach · Lifeguard Tower",
      "text": "Below the lifeguard tower a red flag stands. Lifeguard Yeom Bongsu comes over with a whistle round his neck. Retired from the coast guard, this is his thirty-first summer on this beach. 'Swimming from 9. Past the buoy, never.' When Oh Jinwoo says the buoy is 80 metres out, he nods. 'I know. I put it out every year.' He reties the flag rope. 'People who want to go in at dawn always have a reason. The ones with a reason are the most at risk.'",
      "question": "Swimming opens in three hours. What do you do?",
      "memo": [
        "Swimming from 09:00, never past the buoy",
        "80 metres to the buoy",
        "Yeom Bongsu (66): retired coast guard, 31st summer on this beach"
      ],
      "choices": {
        "s11_flag_wait": {
          "label": "Say wait till 9 by the rules"
        },
        "s11_flag_why": {
          "label": "Ask about the people who come at dawn"
        },
        "s11_flag_ask": {
          "label": "Ask once if 6:30 would do"
        }
      }
    },
    "s11_count": {
      "title": "Standby Again",
      "place": "Gyeongpo Beach · Sand",
      "text": "Kwon Dohyun draws one vertical line in the sand. Left, going in now; right, waiting till 9. 'Going in now could mean a fine, and above all that gentleman has to jump in after us. The cost is too high.' He writes a number in the right column. Waiting time 2 hours 40 minutes. Then he looks at it for a long while. 'You two have been on standby five months now. This adds 2 hours 40 minutes to it.' Oh Jinwoo laughs. 'The company never did that sum.'",
      "question": "Five months of standby get another 2 hours 40 minutes. What do you do?",
      "memo": [
        "Going in now: a fine, the lifeguard has to jump in",
        "Waiting till 9: 2 hours 40 minutes",
        "Oh Jinwoo and Han Seoyun: five months on standby"
      ],
      "choices": {
        "s11_count_use": {
          "label": "Suggest choosing what to do while waiting"
        },
        "s11_count_line": {
          "label": "Add a 'rest' column to Kwon Dohyun’s table"
        },
        "s11_count_nothing": {
          "label": "Decide nothing and sit in the sand"
        }
      }
    },
    "s11_card": {
      "title": "The Clock-In Card",
      "place": "Gyeongpo Beach · Shade of the Tower",
      "text": "At 7 Han Seoyun’s hand goes to her trouser pocket. There’s nothing in it. 'Since the day I was put on standby I’ve tapped my clock-in card every morning. On Saturdays there’s nowhere to tap. That’s the hardest part.' She rests her empty hand on her knee. 'Out at that buoy yesterday, nobody measured me. Today he says he will.' Further off, Oh Jinwoo is painting the lifeguard tower’s ladder with Yeom Bongsu. Yeom Bongsu gave him the brush. Han Seoyun asks, 'If I beat him again today, will he be all right?'",
      "question": "A morning with no card to tap. What do you do?",
      "memo": [
        "Han Seoyun: a clock-in card every morning since standby",
        "Saturday: nowhere to tap",
        "Oh Jinwoo: painting the tower ladder with Yeom Bongsu"
      ],
      "choices": {
        "s11_card_honest": {
          "label": "Tell her not to let him win"
        },
        "s11_card_paint": {
          "label": "Suggest going to paint the ladder too"
        },
        "s11_card_quiet": {
          "label": "Sit by her and look at the sea instead"
        }
      }
    },
    "s11_ladder": {
      "title": "3 Seconds",
      "place": "Gyeongpo Beach · Tower Ladder",
      "text": "There’s white paint on the back of Oh Jinwoo’s hand. 'He gave me work. The first work I’ve been given in five months.' He counts the rungs he painted. Fourteen. 'I’m not bitter about losing by 3 seconds yesterday. I just wanted to measure those 3 seconds again. At the company nobody measures where I was how many seconds late. It’s just standby.' Yeom Bongsu takes the brush from below. 'Ladder’s done. Rematch at 9. Till then, both of you drink water and warm up. People with a reason get cramps.'",
      "question": "Oh Jinwoo wants to measure the 3 seconds again. What do you do?",
      "memo": [
        "The first work in five months: fourteen rungs",
        "Oh Jinwoo: 'I wanted to measure those 3 seconds again'",
        "Rematch: 09:00"
      ],
      "choices": {
        "s11_ladder_time": {
          "label": "Write yesterday’s and today’s times side by side"
        },
        "s11_ladder_warm": {
          "label": "Get them both water and a warm-up"
        },
        "s11_ladder_tease": {
          "label": "Say if he loses again, you pick dinner"
        }
      }
    },
    "s11_shore": {
      "title": "This Far",
      "place": "Gyeongpo Beach · Water’s Edge",
      "text": "5 minutes to 9, Yeom Bongsu lowers the red flag and raises the yellow one. He stands the two of them at the water’s edge and points at the buoy. 'You think that’s the end. It isn’t. It marks how far I can see. Past it my eyes don’t reach.' Kang Taemin hands you the stopwatch. Kwon Dohyun writes something at the bottom of his table in the sand, then rubs it out with his palm. Yeom Bongsu puts the whistle in his mouth. 'When you touch the buoy, wave from there. That’s how I count you.'",
      "question": "The buoy isn’t the end, only how far he can see. What do you do before the start?",
      "memo": [
        "Yeom Bongsu: 'It marks how far I can see'",
        "Touch the buoy, then wave",
        "The stopwatch is in your hand"
      ],
      "choices": {
        "s11_shore_go": {
          "label": "Give the start signal at exactly 9"
        },
        "s11_shore_swim": {
          "label": "Go in with them"
        },
        "s11_shore_watch": {
          "label": "Watch beside Yeom Bongsu"
        }
      }
    },
    "s11_swim": {
      "title": "40 Metres",
      "place": "Gyeongpo Beach · In the Water",
      "text": "Go. They swim side by side. At about 40 metres Han Seoyun suddenly stops and floats on her back. Oh Jinwoo swims a few more strokes, then looks round. Han Seoyun says to the sky, 'Go on ahead. I want to stay here a bit. Floating like this is a lot like standby, but it’s not scary at all.' Oh Jinwoo treads water where he is. The buoy is 40 metres ahead, and the stopwatch keeps going. On the beach Yeom Bongsu watches them, whistle in his mouth. He doesn’t blow it yet.",
      "question": "Han Seoyun has stopped, Oh Jinwoo looks back, and the stopwatch keeps going. What do you do?",
      "memo": [
        "At 40 metres: Han Seoyun floats on her back",
        "Oh Jinwoo: treads water and looks back",
        "40 metres to the buoy, the stopwatch still running"
      ],
      "choices": {
        "s11_swim_shout": {
          "label": "Shout to Oh Jinwoo to go all the way"
        },
        "s11_swim_stop": {
          "label": "Stop the stopwatch and wait"
        },
        "s11_swim_ask": {
          "label": "Ask Yeom Bongsu if they’re all right"
        }
      }
    },
    "s11_buoy": {
      "title": "The Wave",
      "place": "Gyeongpo Beach · The Buoy",
      "text": "Oh Jinwoo swims back beside Han Seoyun and floats with her. After a while the two of them swim slowly to the buoy and touch it together. From the beach both look tiny. Catching his breath, Oh Jinwoo says, 'Whatever happens Monday, today we got this far.' Holding the buoy, Han Seoyun waves. Yeom Bongsu blows his whistle once, short. It means he’s counted them both. Kang Taemin runs toward the guesthouse to boil water for the noodles. One number is left on the stopwatch.",
      "question": "The two touched the buoy together. What do you do with the number on the stopwatch?",
      "memo": [
        "They touch the buoy at the same time",
        "Oh Jinwoo: 'Whatever happens Monday, today we got this far'",
        "Yeom Bongsu’s whistle: counted"
      ],
      "choices": {
        "s11_buoy_keep": {
          "label": "Write the number down as it is"
        },
        "s11_buoy_reset": {
          "label": "Set the stopwatch back to 0"
        },
        "s11_buoy_wave": {
          "label": "Wave back from the beach"
        }
      }
    },
    "s11_aftershock": {
      "title": "The Guestbook",
      "place": "Gyeongpo Mulgyeol Stay Guesthouse · Yard",
      "text": "Before lunch, the guestbook lies open on the wooden platform in the yard. On the first page, Na Junhyuk’s three stamps and Kang Taemin’s 'Back again.' The four of them shared the noodles, and Oh Jinwoo still hasn’t got all the white paint off. Han Seoyun lies on the platform and, for the first time, turns her phone face down. Kang Taemin hands you a pen. 'The referee writes today’s line.' Whatever Monday becomes, two days from now, this line stays in this house.",
      "question": "You write today’s line in the guestbook. What do you write?",
      "memo": [
        "The guestbook’s first page: three stamps, 'Back again'",
        "Rematch: both at the buoy together",
        "The ending you choose stays on this device only"
      ],
      "choices": {
        "s11_after_record": {
          "label": "Write the rematch time to the second"
        },
        "s11_after_nobody": {
          "label": "Write 'Nobody measured till 9'"
        },
        "s11_after_none": {
          "label": "Write nothing and leave for Seoul"
        }
      }
    }
  },
  "outcomes": {
    "s11_after_record": {
      "title": "Together",
      "text": "You write: 'September 5, 09:00 rematch, to the buoy, Oh Jinwoo and Han Seoyun together. Time 4 min 11 s. Confirmed by the referee.' Below it Kang Taemin adds 'Referee was fair,' and Kwon Dohyun writes in brackets 'including a 2-minute stop.' Oh Jinwoo takes a photo of the line on his phone; Han Seoyun doesn’t. At 3 in the afternoon the car leaves for Seoul. Till the end of summer, nobody turns that page of the guestbook."
    },
    "s11_after_nobody": {
      "title": "Till 09:00",
      "text": "You write: 'September 5. Nobody measured till 9.' Kwon Dohyun looks at it a long while, then draws a vertical line beside it and writes 'Time rested: 3 h 20 min.' So he measured after all. Han Seoyun laughs. In the afternoon Yeom Bongsu passes the guesthouse and sees the guestbook. At the very bottom he writes, 'People with a reason, safe today,' and goes. The white paint on the back of Oh Jinwoo’s hand doesn’t come off all that week."
    },
    "s11_after_none": {
      "title": "Departure",
      "text": "You write nothing. The guestbook is closed with 'Back again' as its last line, and you and the four leave for Seoul before lunch. At a rest stop Han Seoyun searches her pocket out of habit, then pulls out her empty hand, laughing. Oh Jinwoo falls asleep in the passenger seat. One number is left on the stopwatch, but nobody looks at it again. That afternoon Yeom Bongsu paints the fourteen rungs of the tower ladder once more. The buoy floats where it always does."
    }
  }
};
