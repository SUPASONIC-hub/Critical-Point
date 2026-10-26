/**
 * English (en): the language's dictionary, the chunk an `?lang=en` page
 * takes before its first paint (src/locale.js; 영어판 1단계, 2026-10-26).
 *
 * `copy` is laid over the Korean tables of the same names, in place
 * (src/locales/overlay.js): the season's copy between cases for 프롤로그
 * 01-05 and 사건 01-20, the play guide, the resource and thinking labels, and
 * the case list. A table keyed by case is laid over only up to
 * `previewThrough`, so 사건 11-20's words wait here until the preview reaches
 * them. The scenes are in `nodes/<caseId>.js`. A draft,
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
 * owner's F-8 choice 1) is the panel after `previewThrough` (사건 10 now): the
 * overlay gives that case's `nextCaseSignals` entry `endEyebrow`, the button
 * endButtons.korean and `endPremiseLead`, so the English stops there and the
 * story goes on in Korean. Widening the preview is that one constant.
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
  // 사건 11-최종 (2026-10-26): the spellings of #343-#346, one per person.
  "차지원": "Cha Jiwon",
  "서하린": "Seo Harin",
  "봉영훈": "Bong Younghoon",
  "곽민재": "Kwak Minjae",
  "주은채": "Joo Eunchae",
  "이정숙": "Lee Jungsook",
  "채윤슬": "Chae Yoonseul",
  "이찬빈": "Lee Chanbin",
  "최서진": "Choi Seojin",
  "배수경": "Bae Sookyung",
  "유하온": "Yoo Haon",
  "정태오": "Jung Taeo",
  "하은경": "Ha Eunkyung",
  "반서아": "Ban Seoa",
  "도하람": "Do Haram",
  "임소율": "Lim Soyul",
  "구태형": "Koo Taehyung",
  "류세아": "Ryu Seah",
  "선우진": "Sunwoo Jin",
  "고은비": "Ko Eunbi",
  "문하준": "Moon Hajun",
  "탁예린": "Tak Yerin",
  "표세린": "Pyo Serin",
  "채이안": "Chae Ian",
  "지강현": "Ji Kanghyun",
  "송하율": "Song Hayul",
  "남궁솔": "Namgoong Sol",
  "하정희": "Ha Junghee",
  "연하진": "Yeon Hajin",
  "채도훈": "Chae Dohoon",
  "조현석": "Cho Hyunseok",
  "백다온": "Baek Daon",
  "진서우": "Jin Seowoo",
  "하도율": "Ha Doyul",
  "한지우": "Han Jiwoo",
  "연지안": "Yeon Jian",
  "석재우": "Seok Jaewoo",
  "나은호": "Na Eunho",
  "진태윤": "Jin Taeyoon",
  "허윤경": "Heo Yoonkyung",
  "편종구": "Pyeon Jongku",
  "윤서진": "Yoon Seojin",
  "안기범": "Ahn Gibeom",
  "황혜원": "Hwang Hyewon",
  "서도경": "Seo Dokyung",
  "여민규": "Yeo Minkyu",
  "은재하": "Eun Jaeha",
  "석문호": "Seok Munho",
  "도건우": "Do Geonwoo",
  "선재윤": "Seon Jaeyoon",
  "연서준": "Yeon Seojun",
  "엄동균": "Eom Donggyun",
  "공병만": "Gong Byungman",
  "은시온": "Eun Sion",
  "홍예담": "Hong Yedam",
  "하예솔": "Ha Yesol",
  "여다인": "Yeo Dain",
  "은채원": "Eun Chaewon",
  "이하경": "Lee Hakyung",
  "임재윤": "Lim Jaeyoon",
  "연시우": "Yeon Siwoo",
  "김 반장": "Foreman Kim",
  "민하랑": "Min Harang",
};

/**
 * The last case of the preview: the one line to change to widen it (F-1, choice 1).
 * A case after it keeps its Korean scenes and names even when its file is
 * here (src/locales/overlay.js), the panel after it is the end of the preview,
 * `preview` below fills {last} and {next} from it, and `npm run check:locale`
 * checks the screen copy up to it.
 */
export const previewThrough = "case10";

/** A speaker's role as the briefing prints it, by its Korean (the profile keeps the Korean). The roles of 프롤로그 01-05 and 사건 01-10; those of 사건 11-20 are `caseRoles`. */
export const roles = {
  "KD은행 기업금융전략팀 대리 · 당신의 사수": "Assistant Manager, KD Bank Corporate Finance Strategy Team · your mentor",
  "온새포장 대표 · 강서구 화곡동": "CEO of Onsae Packaging · Hwagok-dong, Gangseo",
  "KD은행 기업금융전략팀장": "Team Head, KD Bank Corporate Finance Strategy Team",
  "플로우온 창업주 · 8년차 · 51세": "Founder of FlowOn · 8 years in · age 51",
  "KD은행 기업금융전략팀 과장": "Manager, KD Bank Corporate Finance Strategy Team",
  "KD은행 기업대출심사팀장": "Team Head, KD Bank Corporate Credit Review Team",
  "KD은행 강서지점장": "Branch Manager, KD Bank Gangseo Branch",
  "KD은행 강서지점 4번 창구 · 입행 3년차": "Window 4, KD Bank Gangseo Branch · 3rd year at the bank",
  "망원시장 반찬가게 들깨한줌 사장": "Owner of Handful of Perilla, a side-dish shop in Mangwon Market",
  "KD은행 본점 인사부 대리 · 4년차": "Assistant Manager, KD Bank Human Resources · 4th year",
  "대출 판단 검증 시스템": "Loan-judgment verification system",
  "그룹 인지·판단 연구랩 분석관 · KD은행 부산 사하지점 창구 출신": "Analyst, Group Cognition & Judgment Research Lab · formerly a teller at KD Bank Saha Branch, Busan",
  "트리거랩 실장 · KD은행 기업금융전략팀 차장": "Lab Director, Trigger Lab · Deputy Manager, KD Bank Corporate Finance Strategy Team",
  "KD금융그룹 감사팀 조사역": "Investigator, KD Financial Group Internal Audit",
  "트리거랩 현장 담당 · KD은행 강서지점 창구 출신": "Field officer, Trigger Lab · formerly a teller at KD Bank Gangseo Branch",
  "경쟁 분석관 · KD은행 본점 기업금융전략팀 파견 3년차": "Rival analyst · 3rd year seconded from KD Bank’s Corporate Finance Strategy Team",
  "KD은행 기업대출심사팀장 출신 · 퇴직 2년차": "Former Team Head, KD Bank Corporate Credit Review Team · retired 2 years",
  "KD은행 강원 영동지점장 · 30년 지점 근무": "Branch Manager, KD Bank Gangwon Yeongdong Branch · 30 years in branches",
  "전 트리거랩 분석관 · 사직 후 혼자 추적 중": "Former Trigger Lab analyst · tracking it alone since resigning",
  "브릿지은행 기업구조개선부 심사역 · 플로우온 창업주 권태호의 장남": "Credit officer, Bridge Bank Corporate Restructuring · eldest son of FlowOn founder Kwon Taeho",
  "트리거랩 분석관 · 한 번 떠났다 돌아온 동료": "Trigger Lab analyst · a colleague who left once and came back",
  "트리거랩 데이터 기록 담당 · 3년차 계약직": "Data records officer, Trigger Lab · contract worker, 3rd year",
  "플로우온 풀필먼트센터 야간조 반장 · 창업 첫해 입사": "Night-shift foreman, FlowOn fulfillment center · hired in the founding year",
  "플로우온 재무책임자 · 권도현의 고모부 · 47세": "CFO of FlowOn · Kwon Dohyun’s uncle by marriage · age 47",
  "KD은행 부행장 · 대출심사위원회 위원장": "Deputy President, KD Bank · chair of the Credit Committee",
  "문래동 가온정밀 대표 · 문가을의 남편": "CEO of Gaon Precision, Mullae-dong · Moon Gaeul’s husband",
  "피해자 모임 대표 · 망원시장 가을떡방 사장": "Head of the victims’ group · owner of Gaeul Rice Cake Shop, Mangwon Market"
};

/**
 * The roles of the speakers who first appear in 사건 11-20, by the case they
 * first appear in: `roleName` (src/locales/overlay.js) reads a case's table
 * only once that case is in the preview (`previewThrough`), so a briefing
 * after the preview keeps its Korean role beside its Korean name.
 */
export const caseRoles = {
  "case11": {
    "국회 정무위원회 의원실 보좌관 · 국정감사 4년차": "Aide in a lawmaker’s office, National Assembly Policy Committee · 4th year of audits",
    "탐사보도 매체 리드라인 기자 · 7년차": "Reporter, investigative outlet Leadline · 7 years in"
  },
  "case13": {
    "KD금융그룹 그룹전략실 상무 · 전 기업금융전략팀장": "Managing Director, Group Strategy Office, KD Financial Group · former Team Head, Corporate Finance Strategy Team",
    "광고 감독 · KD 혁신위원회 캠페인 연출": "Ad director · directing the KD Innovation Committee campaign",
    "KD금융그룹 그룹전략실 차장 · KD 혁신위원회 간사": "Deputy Manager, Group Strategy Office, KD Financial Group · secretary of the KD Innovation Committee",
    "보조출연자 · 전 플로우온 야간조": "Extra · formerly on FlowOn’s night shift"
  },
  "case14": {
    "KD자산운용 대체투자운용팀 펀드매니저 · 상생 펀드 설계자": "Fund manager, Alternative Investments Team, KD Asset Management · designer of the Sangsaeng Fund",
    "상생 펀드 가입 고객 · 전직 초등학교 교사 · 72세": "Sangsaeng Fund buyer · retired elementary school teacher · age 72"
  },
  "case15": {
    "KD은행 인사부 채용 담당 과장 · 전 창구 계약직": "Recruiting Manager, KD Bank Human Resources · formerly a contract teller",
    "이민서의 남동생 · 고3 수험생": "Lee Minseo’s younger brother · 3rd year of high school, sitting the exam"
  },
  "case16": {
    "KD캐피탈 리스 심사역 · 입사 3년차": "Lease credit officer, KD Capital · 3rd year at the company",
    "플로우온 풀필먼트센터 포장 라인 · 9년차": "Packing line, FlowOn fulfillment center · 9 years in",
    "플로우온 풀필먼트센터 야간조 막내 · 24세": "Youngest on the night shift, FlowOn fulfillment center · age 24",
    "트리거랩 데이터 기록 담당": "Data records officer, Trigger Lab"
  },
  "case17": {
    "푸드트럭 '태오네 떡꼬치' 사장 · 전 KD은행 구로지점 기업대출 대리": "Owner of the food truck 'Taeo’s Tteok Skewers' · former Assistant Manager, corporate loans, KD Bank Guro Branch",
    "고(故) 하윤재의 누나 · 동생의 세무회계 사무실 폐업 정리 중": "Older sister of the late Ha Yoonjae · closing down her brother’s tax accounting office",
    "반재욱의 딸 · 초등학교 4학년": "Ban Jaewook’s daughter · 4th grade"
  },
  "case18": {
    "브릿지은행 전략본부장 · 권도현의 상사": "Head of Strategy, Bridge Bank · Kwon Dohyun’s boss",
    "전 KD은행 수원 매탄지점장 · 오진우의 아버지": "Former Branch Manager, KD Bank Suwon Maetan Branch · Oh Jinwoo’s father"
  },
  "case19": {
    "웹툰 작가 · 임경수의 손녀": "Webtoon artist · Lim Kyungsoo’s granddaughter",
    "철거 용역 반장 · 경력 27년": "Demolition crew foreman · 27 years on the job"
  },
  "case20": {
    "KD데이터랩 노아 도입 책임자": "Head of the NOAH rollout, KD Data Lab"
  }
};

export const preview = {
  chooseLanguage: "Choose your language",
  languageButtons: ["한국어", "English (preview)"],
  languageSetting: "Language",
  previewNote: "English is a preview: the prologue and Cases 01–{last} are available.",
  reportTranslation: "Report a translation issue in this scene",
  reportTranslationNote: "Tell us what reads wrong. The scene ID is sent with it.",
  rankingLanguage: "Language: KO / EN",
  endTitle: "END OF THE ENGLISH PREVIEW",
  endText:
    "You’ve reached the end of Case {last} — the end of the English preview for now. Cases {next}–49 and the finale are being translated. Your progress is saved on this device, and you’ll continue from Case {next} when they arrive.",
  endButtons: { korean: "Continue in Korean", wait: "Wait for English", feedback: "Tell us what you thought" },
  continueCard: "Case {next} — coming in English soon",
  // The panel after `previewThrough` (nextCaseSignals): its eyebrow, and the
  // lead put before its premise; its button is endButtons.korean.
  endEyebrow: "End of the English preview",
  endPremiseLead:
    "You’ve reached the end of Case {last} — the end of the English preview for now. Your progress is saved on this device; from Case {next} the story continues in Korean until the English arrives.",
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
      },
      "case11": {
        "label": "Disclosure and Protection",
        "rule": "The moment you tell the truth, the people whose names hang on that truth are exposed with it.",
        "authority": "Propose whose names to say, and in what order"
      },
      "case12": {
        "label": "Compensation and Conditions",
        "rule": "Fast compensation usually buys silence along with it. The price of that silence is paid by the people outside the criteria.",
        "authority": "Propose who goes into the compensation criteria, and the terms of the signature"
      },
      "case13": {
        "label": "Faces and Scripts",
        "rule": "The moment you lend your face, the sentence that face reads becomes your signature.",
        "authority": "Propose the terms of your appearance and the last line of the script"
      },
      "case14": {
        "label": "Kindness and Accuracy",
        "rule": "The kindest sentence at the counter can be the most dangerous one, so in this case you judge at the pace of the person writing the explanation down.",
        "authority": "Put the sales script beside the disclosure, and propose halting sales or revising the procedure"
      },
      "case15": {
        "label": "Signatures and Respect",
        "rule": "No choice decides Lee Minseo’s signature for her. You can only choose how to stand beside her.",
        "authority": "Propose changes to the confirmation’s wording, and sitting in on the interview"
      },
      "case16": {
        "label": "Automation and People",
        "rule": "A machine can take people out of dangerous work. If you don’t write down where those people go, the danger just moves off the books.",
        "authority": "Propose the conversion and retraining terms to put in the lease, and protections for the workers whose contracts end"
      },
      "case17": {
        "label": "Records and Names",
        "rule": "Writing a name down can protect a person, or call them up again. Which one depends on who keeps the list.",
        "authority": "Propose how the notebook is used, and how the owners of its names give consent"
      },
      "case18": {
        "label": "Competition and Choice",
        "rule": "The person offering the best seat is usually the one who decided on that seat first. The winning side and the side you chose yourself can be different.",
        "authority": "Propose the terms to put on Oh Jinwoo’s choice, and debtor protections for the sale bundle"
      },
      "case19": {
        "label": "Originals and Owners",
        "rule": "Saving the originals is not moving paper. It is moving the place of the people written on that paper.",
        "authority": "Propose where the originals go, the donor’s name, and how they are registered"
      },
      "case20": {
        "label": "Records and Consent",
        "rule": "A machine that learned someone’s hesitation should have asked that person first.",
        "authority": "Propose a consent process for the people in the response records, and judgment principles a person can read"
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
        "eyebrow": "Next case unlocked",
        "title": "Case 11 - The Room Everyone Watches",
        "button": "Start Case 11",
        "premise": "3 weeks later, at six in the morning, the dissent that vanished 3 years ago becomes a news story. The anonymous Mr. A in the article is you, and five days later the National Assembly calls you.",
        "hook": "Every case so far was decided in a closed room. This time you speak in front of 12 cameras, and Yoon Sanghyuk’s seat at the witness stand is empty.",
        "movement": "Leadline newsroom, Mangwon-dong > National Assembly Members’ Office Building > Secondhand bookshop in Hoegi-dong, 2nd floor > Policy Committee room, National Assembly main building",
        "reason": "To say, for the first time and in the room everyone watches, whose hands erased the dissent 3 years ago",
        "interlude": {
          "label": "Interlude · Rota, Week 3",
          "title": "Na Junhyuk Sends Squid Sundae",
          "text": "3 weeks after the rota starts going around, an ice box arrives at the office. The sender is Na Junhyuk, and inside are six servings of squid sundae and a handwritten note. 'Six slots, so six servings. I put in double for Kang Taemin. The night shift needs to eat a lot.' That day Lee Minseo leaves on time for the first time, and Oh Jinwoo puts his share in the fridge and eats it two days later."
        }
      },
      "case11": {
        "eyebrow": "Next case unlocked",
        "title": "Case 12 - The 1,740th Person",
        "button": "Start Case 12",
        "premise": "2 weeks after the parliamentary audit, the group puts forward a 30-billion-won voluntary compensation plan. To take the money, people have to sign that they will never sue again.",
        "hook": "You go to the shops, the factories and the memorial park of the 1,740 people who have been a number until now. The people there don’t thank you for writing the dissent.",
        "movement": "Financial Supervisory Service, Yeouido > Gaeul Rice Cake Shop, Mangwon Market > Namdong Industrial Complex, Incheon > Memorial park, Incheon",
        "reason": "To meet, for the first time as faces, the 1,740 people known only as a number, and to decide whose names go into the criteria for money that comes with conditions",
        "interlude": {
          "label": "Interlude · The Week After the Audit",
          "title": "The Newsroom Cat Gets a Press Pass",
          "text": "The week after the parliamentary audit, Leadline issues the newsroom cat an honorary press pass. Its name is 'Correction.' Seo Harin sends a message with the photo. 'Legal withdrew the demand for correction. We named it to celebrate.' Na Junhyuk makes the photo the background of the waiting-area monitor at Yeongdong Branch, and Kang Taemin posts it to the night-shift group chat as 'the cat on our side.' Lee Minseo’s permanent conversion review still has no result. Even so, this week she comes to work for the first time with her ID badge hanging face out."
        }
      },
      "case12": {
        "eyebrow": "Next case unlocked",
        "title": "Case 13 - The Face of Innovation",
        "button": "Start Case 13",
        "premise": "Instead of talking about the signature field, the 33rd floor makes an offer: be the face of the ad for the group’s new Innovation Committee.",
        "hook": "The price is the compensation criteria for 212 people and your colleagues’ jobs. The condition is one sentence. The person who wrote the dissent says on camera, 'The past is settled.'",
        "movement": "Group Strategy Office, 33rd floor, group headquarters > Ad studio in Seongsu-dong > Gaeul Rice Cake Shop, Mangwon Market > Trigger Lab, 4th floor > Live broadcast set",
        "reason": "To find out what the face of the person who wrote the dissent is meant to cover, and to decide for yourself the last sentence you will read on camera",
        "interlude": {
          "label": "Interlude · The Day After Chuseok",
          "title": "Moon Hajun Brings Names for the Factory",
          "text": "The day after Chuseok, Moon Hajun comes to the rice cake shop with a page from his sketchbook. They are candidate names for Gaon Precision, reopening as a cooperative: 'Gaon Precision 2,' 'Dad’s Factory,' 'To-the-End Precision.' Foreman Kim circles the third, Kang Taemin claps, and Kwon Dohyun earnestly searches 'Can a business name with an adverb in it be registered?' Moon Gaeul says nothing and slices one more plate of rice cakes. That plate is her answer."
        }
      },
      "case13": {
        "eyebrow": "Next case unlocked",
        "title": "Case 14 - The Good Fund",
        "button": "Start Case 14",
        "premise": "3 weeks after the Innovation Committee livestream, the 'Sangsaeng ESG Fund,' whose launch KD Asset Management moved up, is being sold to retirees at the bank counter. 107 billion won in 2 weeks, and the average buyer is 71.",
        "hook": "One line on page two of the sales script: 'As long as the bank doesn’t go under, you have nothing to worry about.' It is the sentence Do Yoonha used at the counter 3 years ago. The 33rd floor never brings up the empty signature field. Nor who your records piling up at Trigger Lab are worth something to.",
        "movement": "Trigger Lab, 4th floor > Gangseo Branch counter > KD Asset Management trading floor, Pangyo > Money class at the Gangseo Senior Welfare Center > Gangseo Branch lobby",
        "reason": "To connect in one line the words sold at the counter, the risk written in the disclosure, and the 59-billion-won loss that moves between them",
        "interlude": {
          "label": "Interlude · The Week After the Livestream",
          "title": "Na Junhyuk Turns Down a Stamp-Modeling Offer",
          "text": "The week after the livestream, the ad director’s business card is pinned to the bulletin board in the Yeongdong Branch lobby. Next to it, in Na Junhyuk’s handwriting: 'Stamp model wanted -- Qualification: a hand returned for 30 years or more.' Kang Taemin posts a photo of a light stand to the night-shift group chat with 'Now I carry four by myself,' and Kwon Dohyun sends a table turning the ad’s 1.1-billion-won production budget into boxes of rice cakes. 36,000 boxes, enough for every member of the victims’ group to get more than 35. Under the table is one line. 'At this price, it’s still a loss.'"
        }
      },
      "case14": {
        "eyebrow": "Next case unlocked",
        "title": "Case 15 - The Permanent-Post Review",
        "button": "Start Case 15",
        "premise": "HR offers Lee Minseo permanent conversion, the first offer in 3 years. The last of the 7 pages is a confirmation.",
        "hook": "Admit the missing 11 seconds as 'my own operating error,' and the post is permanent. The interview is at 8:40 a.m. on the day of her brother’s college entrance exam. Like HR’s paperwork, the Trigger Lab records have a second use nobody has read yet.",
        "movement": "Trigger Lab, 4th floor > HR interview room, head office > Rooftop room in Haebangchon > School gate at the exam site > HR interview hall, head office",
        "reason": "To follow to the end how one confirmation with no box for refusal hands the cause of an incident to one contract worker",
        "interlude": {
          "label": "Interlude · The Dictation Test",
          "title": "A Red Circle",
          "text": "At the buyers’ group dinner, Lee Jungsook tears pages from her notebook and hands out test sheets. There are five questions: redemption, subordinated, recovery rate, cancellation, and 'If you don’t understand it, what don’t you do?' Kang Taemin scores 100 again, Oh Jinwoo disputes question 4 to the very end, and Kwon Dohyun loses points for writing the time cost of grading next to his answers. On Do Yoonha’s sheet, only the last question has an answer. Lee Jungsook draws a big circle over it."
        }
      },
      "case15": {
        "eyebrow": "Next case unlocked",
        "title": "Case 16 - The Unmanned Warehouse",
        "button": "Start Case 16",
        "premise": "At 4:12 a.m. on the morning of the first snow, the 80 workers on FlowOn’s night shift get a contract-termination text in the middle of their shift. The center is bringing in 120 logistics robots on a lease.",
        "hook": "The person who opened cup noodles for you on the first night of the 72 hours comes to see you in daylight this time. The robots aren’t the enemy, and the credit officer leasing them out is a decent person. But page 3 of the contract’s annex says the people have to go first. Today ECHO again writes down how many seconds you hesitated. Nowhere does it say who on the 33rd floor receives that number.",
        "movement": "Trigger Lab, 4th floor > FlowOn fulfillment center floor > KD Capital review team, Euljiro > Center rooftop > KD Capital lease approval committee",
        "reason": "To find out at whose request a condition sending people out got into a contract for leasing robots, and to turn the way 80 people leave into terms of the contract",
        "interlude": {
          "label": "Interlude · One Business Card",
          "title": "Every Guess Was Right",
          "text": "The day after the college entrance exam, a business card mockup is pinned to the Trigger Lab bulletin board. Word goes around that Ban Jaewook handed in a two-page A4 explanation of his use of the Internal Audit printer, and Na Junhyuk says he’ll laminate two picket signs and hang them in the Yeongdong Branch lobby. Lee Chanbin leaves one line in the group chat from his sister’s phone. 'There are still 60 hand warmers left. They’re yours, Foreman, right?' Kang Taemin’s answer is short. 'Use them.'"
        }
      },
      "case16": {
        "eyebrow": "Next case unlocked",
        "title": "Case 17 - The Names in the Notebook",
        "button": "Start Case 17",
        "premise": "In December, the group’s Legal team demands Ban Jaewook’s notebook, calling it 'company records.' They say they’ll use it as evidence in your disciplinary case.",
        "hook": "The notebook holds the names of the 47 people he pushed out over 20 years. Before you hand it over, you visit them one by one. The first name is grilling rice cake skewers in a park parking lot. Legal asks for one notebook, but the record of you that the 33rd floor holds is far thicker.",
        "movement": "Trigger Lab, 4th floor > Food truck in a Sangam-dong park parking lot > Closed office in Mullae-dong > Legal meeting room, group headquarters > Hallway outside the HR committee room",
        "reason": "To meet the names in the notebook as people before it becomes evidence, and to see who the audit rule is really aimed at when it blames only the hand that took the notes",
        "interlude": {
          "label": "Interlude · Second Week of December",
          "title": "80 on the Night Shift, 13 Days After the Text",
          "text": [
            "November 27, 04:12 — 1 contract-termination text. Recipients: 80. End date: December 31.",
            "November 27 — Kang Taemin visits Trigger Lab’s 4th floor in daylight for the first time.",
            "December 3 — KD Capital lease approval committee. Condition in the original draft: 80 night-shift workers let go within the year.",
            "December 3 — What you chose: {card}.",
            "December 10 — Notices canceling the text: 0. Days until December 31: 21."
          ],
          "fallback": "December 3 — Speaking time the committee gave you: 5 minutes."
        }
      },
      "case17": {
        "eyebrow": "Next case unlocked",
        "title": "Case 18 - The Offer",
        "button": "Start Case 18",
        "premise": "Just before Christmas, Oh Jinwoo puts a white envelope on your desk. Head of the acquisitions team at Bridge Bank, double the salary. The job is buying the 186-billion-won loan bundle KD Bank puts up for sale at year’s end.",
        "hook": "It is a seat from which he can see every document of the bank that pushed out his father. Oh Jinwoo says he can calculate which side will win. Which side is right, he says, he doesn’t know. Meanwhile, on a shelf in Yoon Sanghyuk’s study at home sits a 2023 notebook no one has opened yet.",
        "movement": "Trigger Lab, 4th floor > Lounge, Bridge Bank head office, Yeouido > Year-end party in the Trigger Lab pantry > Oh Sangchul’s kitchen table, Suwon",
        "reason": "To find out whose calculation made the offer to Oh Jinwoo, and to help him stand not on the winning side but on the side he chose himself",
        "interlude": {
          "label": "Interlude · The Day After the Year-End Party",
          "title": "Seoa Leaves a New Page in Her Dad’s Bag",
          "text": "The morning after the year-end party, Ban Jaewook opens his bag and stops. In the front pocket, Seoa has folded in a page from her practice notebook. The title is 'People Dad Met Again.' Mr. Jung Taeo, five stars. Sauce-Bottle Dad, four and a half stars (half off for shaking too hard). Kwon Dohyun gets a photo of the page and replies, 'The rating criteria are not transparent,' and gets one star from Seoa. That day Ban Jaewook goes to work with the page in his front pocket."
        }
      },
      "case18": {
        "eyebrow": "Next case unlocked",
        "title": "Case 19 - The Weight of Paper",
        "button": "Start Case 19",
        "premise": "On a Monday in a January cold snap, the demolition of the secondhand bookshop in Hoegi-dong is moved up from April to January 22. On the 2nd floor are 40 years of originals that aren’t in the system, and the owner, Lim Kyungsoo, is in the hospital with pneumonia.",
        "hook": "There are 72 hours left and 312 boxes. In his hospital bed, Lim Kyungsoo asks you this time to burn it all. The receipt record from the day the 2023-0412 original reached the 33rd floor 3 years ago, its signature field empty, is still in someone’s hands on the 33rd floor.",
        "movement": "Alley in front of the secondhand bookshop, Hoegi-dong > Bookshop, 2nd floor > Hospital room, Gangseo Ieum Hospital > Trigger Lab archive, B2 > Snowy alley before dawn",
        "reason": "To move the only record that can’t be erased before it goes under the excavator, and to find out who moved that date up, and why",
        "interlude": {
          "label": "Interlude · First Day Back in the New Year",
          "title": "Oh Jinwoo, 11 Days After the Offer",
          "text": [
            "December 22 — 1 offer letter: head of acquisitions at Bridge Bank. Recipient: Oh Jinwoo. Double the salary, reply due December 29, 09:00.",
            "December 23 — Trigger Lab pantry, 4th floor. Oh Jinwoo rehearses a 'farewell speech' in his phone notes 5 times, stopping each time at the first sentence.",
            "December 29 — What you chose: {card}.",
            "December 31 — The sixth farewell speech, all the way through for the first time. 'Whatever desk I sit at, I won’t forget that.'",
            "January 2 — 42,000 won into the Gaeul Rice Cake Shop account under Kwon Dohyun’s name. Memo: '1 calculator rice cake, profit noted.'"
          ],
          "fallback": "December 29, 09:00 — Bridge Bank, 32nd floor. The signing time Do Haram set."
        }
      },
      "case19": {
        "eyebrow": "Next case unlocked",
        "title": "Case 20 - ECHO’s Update",
        "button": "Start Case 20",
        "premise": "At midnight on January 31, ECHO is replaced by NOAH, KD Data Lab’s new AI review engine, and 3 years of judgment records are reset.",
        "hook": "On line 1,208 of NOAH’s training list, even the seconds you hesitated are written down.",
        "movement": "Trigger Lab, 4th floor > Basement server room > KD Data Lab data center, Pangyo > ECHO’s farewell party > The server room at midnight",
        "reason": "To find out what a machine taught on records about to be erased failed to learn, and whose records they are",
        "interlude": {
          "label": "Interlude · One Label",
          "title": "The Demolition Foreman Takes Home a Hard-Hat Drawing",
          "text": "The week after the demolition, Koo Taehyung shows up in the Trigger Lab lobby with a thermos. Lim Soyul hands him the label she promised: a white hard hat with his name on it in marker, and under it in small letters, 'Kept for 72 hours.' Koo Taehyung studies it for a long time, then sticks the label inside his hard hat. 'From the next site on, I’ll ask first what’s still inside.' Na Junhyuk makes one more cup of instant coffee. This time there is hot water."
        }
      },
      "case20": {
        "eyebrow": "Next case unlocked",
        "title": "Case 21 - The First Participant",
        "button": "Start Case 21",
        "premise": "On the bottom line of the records NOAH learned from is the name of someone who passed through the same basement before Trigger Lab existed. There is no consent form.",
        "hook": "He now runs a guesthouse in a converted tangerine warehouse in Jeju. And the company’s envelope of thank-you money has reached that house’s front desk before you.",
        "movement": "Trigger Lab, 4th floor > Slow Island, Gujwa, Jeju > Tangerine groves and the tangerine warehouse > Breakwater on the Gujwa shore",
        "reason": "To find out what the records of cohort 1, used without consent, did to one person’s summer, and to sit down in front of him before the company’s envelope of thank-you money does",
        "interlude": {
          "label": "Interlude · Nine People, Measured",
          "title": "The First Joke Told to NOAH",
          "text": "At the first lunch of February, Kang Taemin sets a cup of noodles in front of the new terminal and clears his throat. 'What do you call a cow that laughs?' In 0.2 seconds NOAH answers, 'Classified as a joke from context. No response.' Kwon Dohyun writes it down. 'Batting average .000. Its predecessor was in the black.' Lee Minseo pencils into field 12 of the principles document: 'Laughter goes into the calculation too.'"
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
      "case10": "ECHO: Retention period 0. The file from Do Yoonha’s locker is destroyed automatically in four days.",
      "case11": "ECHO: 39 calls since this morning asking about 'Mr. A, author of the dissent' in the article.",
      "case12": "ECHO: The compensation is 30 billion won, and everyone who takes it has to sign that they will never sue.",
      "case13": "ECHO: Your name is at the top of the appearance contract. The shoot is tomorrow, and the livestream is six days later.",
      "case14": "ECHO: 107 billion won in 2 weeks, buyers 71 on average. Page two of the sales script is the sentence Do Yoonha used at the counter 3 years ago.",
      "case15": "ECHO: The final interview is Thursday at 8:40 a.m. On the same day, entry to the college entrance exam closes at 8:10.",
      "case16": "ECHO: The contract-termination text went out at 4:12 a.m. That is when the 80 night-shift workers were carrying boxes.",
      "case17": "ECHO: Ban Jaewook’s notebook has forty-seven lines. The company calls it company records.",
      "case18": "ECHO: Head of acquisitions at Bridge Bank, double the salary. You are the first person Oh Jinwoo has shown this envelope to.",
      "case19": "ECHO: The demolition date has been moved up from April 14 to January 22, 06:00. Lim Kyungsoo is still in the hospital.",
      "case20": "ECHO: On the replacement cost statement, the cost of disposing of me is listed as 0 won. An accurate calculation."
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
    "INSTALL_HINT_COPY": {
      "title": "Keep it on your home screen",
      "prompt": "On your home screen it opens like an app, without the address bar.",
      "ios": "Tap the Share button and choose “Add to Home Screen”; it then opens like an app, without the address bar.",
      "install": "Add to home screen",
      "dismiss": "Close this tip"
    },
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
      "case10": "Observing: when you notice burnout, tolerance for turning goodwill into policy, handling people outside the rules",
      "case11": "Observing: the order of public statements, how you protect colleagues’ names, your reaction to the empty witness stand",
      "case12": "Observing: how you apologize to victims, handling people outside the paperwork, trading fast compensation for giving up rights",
      "case13": "Observing: how you read a sentence that comes with a price, comparing the people in the ad with the real ones, trading colleagues’ jobs for your own name",
      "case14": "Observing: your reaction to your own past words, how you deal with a designer who means well, how often you choose accuracy over speed",
      "case15": "Observing: moments of respecting someone else’s choice, hesitation to protect family, anger at a form with no box for refusal",
      "case16": "Observing: your first reaction to notice by text, handling a decent counterpart’s erased opinion, trading efficiency for transition costs",
      "case17": "Observing: how you treat private records, the share of people who can’t answer, telling the one who wrote it down from the one who gave the order",
      "case18": "Observing: your reaction to a colleague about to leave, telling the winning side from the right side, how fast you read the deal behind an offer",
      "case19": "Observing: what records come first under time pressure, the owner’s wishes against preserving evidence, what you call the belongings in front of family",
      "case20": "Observing: saying goodbye to something that isn’t a person, your reaction to your own records used without consent, choosing between erasing and keeping"
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
      "case10": "Move the list one person’s persistence kept alive into a structure that won’t break, and decide what to do about the people that structure pushes out",
      "case11": "In the room everyone watches, decide whether to say who erased the dissent that vanished 3 years ago, and whose names to put behind those words",
      "case12": "Facing compensation that comes with conditions, decide whether to bring the 212 people with no paperwork into the criteria, and who pays the price",
      "case13": "Facing the offer to be the face of the Innovation Committee, decide whether to read the line 'The past is settled' in exchange for the 212 people’s compensation criteria and your colleagues’ jobs",
      "case14": "Before a fund with a good name moves its losses onto retirees, decide whether to stop the sales, fix them, or follow the money",
      "case15": "Between Lee Minseo’s permanent conversion and the truth of the 11 seconds, stand beside her without making her choice for her",
      "case16": "Facing the lease that brings in 120 robots, decide whether the door the 80 night-shift workers leave through can be a path rather than a single text, and who pays the price",
      "case17": "Decide whether to hand the notebook with 47 names to the court, return it to the names’ owners, or burn it, and who pays the price",
      "case18": "Facing an offer that comes with a blade that could cut KD, decide whether to hold on to Oh Jinwoo, let him go with conditions, or stop the sale itself, and who in the sale bundle pays the price",
      "case19": "In the 72 hours before demolition, move 40 years of paper originals, and decide under whose name and where that paper stays",
      "case20": "Before the midnight replacement, protect the judgment principles ECHO left and the owners of the response records used without consent"
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
      },
      "case11": {
        "label": "Case 11",
        "title": "The Room Everyone Watches",
        "trigger": "Fear / Anger / Laughter",
        "summary": "The dissent that vanished 3 years ago becomes a news story, and you end up in the unsworn witness seat at a parliamentary audit. Yoon Sanghyuk’s seat at the sworn witness stand is empty."
      },
      "case12": {
        "label": "Case 12",
        "title": "The 1,740th Person",
        "trigger": "Anger / Laughter / Mourning",
        "summary": "The group puts forward a 30-billion-won voluntary compensation plan. The condition is a signature promising never to sue again. For the first time, you go to the victims’ shops, factories and memorial park."
      },
      "case13": {
        "label": "Case 13",
        "title": "The Face of Innovation",
        "trigger": "Anger / Laughter / Solidarity",
        "summary": "To turn public opinion after the parliamentary audit, the group sets up an Innovation Committee and asks you, the one who wrote the dissent, to be the face of its ad. The last line of the script is 'The past has all been settled.'"
      },
      "case14": {
        "label": "Case 14",
        "title": "The Good Fund",
        "trigger": "Anger / Laughter / Sadness / Joy",
        "summary": "The group sells the 'Sangsaeng Fund' to retirees at the bank counter. What the fund buys is the group’s bad loans and what is left of the FlowOn loan, and the sales script still has the sentence Do Yoonha used 3 years ago."
      },
      "case15": {
        "label": "Case 15",
        "title": "The Permanent-Post Review",
        "trigger": "Joy / Anger / Laughter / Sadness",
        "summary": "Lee Minseo, a contract worker in her 3rd year, gets an offer of permanent conversion. The condition is signing a confirmation that the 11 seconds lost in the leak scandal were her own mistake, and the interview falls on the day of her brother’s college entrance exam."
      },
      "case16": {
        "label": "Case 16",
        "title": "The Unmanned Warehouse",
        "trigger": "Anger / Laughter / Mourning / Joy",
        "summary": "The FlowOn fulfillment center brings in 120 logistics robots on a lease, and the 80 night-shift workers learn from a single text before dawn that their contracts are ending. This is the case of Kang Taemin, who opened cup noodles for you on that first night."
      },
      "case17": {
        "label": "Case 17",
        "title": "The Names in the Notebook",
        "trigger": "Responsibility / Laughter / Mourning",
        "summary": "The group’s Legal team calls Ban Jaewook’s notebook company records and wants to use it as evidence for disciplining you. Before you hand it over, you visit, one by one, the 47 people he pushed out over 20 years."
      },
      "case18": {
        "label": "Case 18",
        "title": "The Offer",
        "trigger": "Competition / Laughter / Affection",
        "summary": "Bridge Bank is trying to buy a bundle of KD Bank’s bad loans, and it offers the head of that team to Oh Jinwoo. Double the salary, and a blade that could cut KD."
      },
      "case19": {
        "label": "Case 19",
        "title": "The Weight of Paper",
        "trigger": "Laughter / Anger / Sadness / Joy",
        "summary": "The 2nd floor of the secondhand bookshop in Hoegi-dong, where the originals that aren’t in the system are kept, is being demolished. The date has been moved up to ten days before the National Assembly’s records retention period ends, and the owner of the paper, Lim Kyungsoo, is in the hospital."
      },
      "case20": {
        "label": "Case 20",
        "title": "ECHO’s Update",
        "trigger": "Sadness / Laughter / Anger / Joy",
        "summary": "ECHO is being replaced by NOAH, a new AI review engine, and its judgment records are being reset. But NOAH learned from those very records, without consent."
      }
    }
  }
};
