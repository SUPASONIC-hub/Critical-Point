# Terminology (ko / en / ja)

One word per idea in each language, so a term the table taught in prologue 01
reads the same in case 07 and on every screen. Korean is the source and is
never changed to fit this table; English and Japanese follow it. The game's
own words on screen (`src/locales/<lang>/screens/`) are the reference, and
`tests/unit/terminology.test.mjs` holds the screen copy to the rows marked
**held**.

Written 2026-11-16 (N31, 결정 Q8 (1)) from the two translation notes of the
store work (영어 용어집 10-25, 일본어 용어집 10-28, kept outside git) and from
what the copy actually says today.

## Style

- **Korea stays Korea.** Seoul places, Korean names (family name first),
  won amounts. No numbers change: dates, times, amounts, ratios, head-counts
  are the canon's (`docs/canon.md`).
- **English**: short declarative sentences, present tense, second person
  ("you"). No hard-boiled noir. Scene titles in Title Case; an outcome's
  title is a sentence in sentence case ("You wrote one name in the author box
  and filed it").
- **Japanese**: です・ます for the narrator and the screens, the characters'
  own register in quotes. Katakana names with a middle dot (オ・ジヌ). The
  makers say 私たち.
- **The makers' voice** (board, notices) is 「우리」 / "we" / 私たち.
- A card label is one action, short enough for a phone line; a question is
  one sentence. A rewrite that lengthens a label is measured on Linux CI
  (Noto CJK) before it ships.

## Game terms

| 한국어 | English | 日本語 | Note |
|---|---|---|---|
| 사건 / 장면 / 시즌 / 프롤로그 | Case / Scene / Season / Prologue | 事件 / シーン / シーズン / プロローグ | 「事件01」「Case 01」 |
| 판 | hand | 勝負 | 「이번 판」 this hand / この勝負 |
| 테이블 | the table | テーブル | ja 卓 only in 卓を組み替える (below) |
| 판돈 | stake | 賭け金 | **held**: not "pot", "bet" (en); not 掛け金, ベット (ja) |
| 칩 | chips | チップ | |
| 금고 | the Vault | 金庫 | **held**: capital V on screens |
| 벽 | the Wall | 壁 | **held**: capital W on screens; a wall in a room stays "wall" |
| 열기 | Heat | 熱 | 「熱ゲージ」 |
| 심박 | heartbeat | 心拍 | |
| 밀어붙인다 (button) | Push | 押し切る | |
| 확정 (button) | Commit | 確定 | **held**: never "Lock in" (LOCK is its own word) |
| BUST / LOCK / COLD FEET / FRACTURE / OVERCLOCK | as is | as is | already English |
| 판을 다시 짠다 (wild card) | Reframe the Table | 卓を組み替える | |
| 논리 콤보 | Logic Combo | ロジックコンボ | |
| 버스트 점수 / 최고 버스트 / 랭크 | Burst Score / Best Burst / Rank | バーストスコア / 最高バースト / ランク | |
| 판단 DNA / 판단 유형 | Judgment DNA / judging type | 判断DNA / 判断タイプ | |
| 결말 / 판결 | Ending / Verdict | 結末 / 判決 | |
| 이번 주의 규칙 | Rule of the Week | 今週のルール | |
| 번외 사건 | side case | 番外事件 | |
| 스토리 모드 / 테이블 시간 | Story Mode / Table Time | ストーリーモード / テーブル時間 | |
| 명예의 전당 | Hall of Fame | 名誉の殿堂 | **held** (ja): not 殿堂 alone |
| 도구 드래프트 / 도감 | Tool Draft / Tool Index | ツール / ツール図鑑 | |
| 분석관 (the player) | the analyst / Analyst | 分析官 | |
| 사건 파일 | Case File | 事件ファイル | |
| 눈에 띔 | Noticed | 目立ち | 판 규칙 5 (G1). 같은 방향 다섯 번째부터 쌓임, 적발은 「적발」 / caught / 摘発 |
| 결재 판 | Sign-off hand | 決裁の勝負 | 판 규칙 5 (G6). 사건의 마지막 판 |
| 숨 고르기 (판 위 버튼) | Catch breath | 息を整える | 판 규칙 5 (G7). ko는 드래프트를 넘기는 「숨 고르기」(en catch your breath, ja ひと息つく)와 같은 말 |
| LOCK 닫힘 | LOCK shut | LOCK停止 | 판 규칙 5 (G3) |
| 이번 사건만 | This case only | この事件だけ | N26. 사건 09·11·14·16과 막 비틀기의 패널 |
| 막 비틀기: 합병 / 흩어진 자리 / 청문회 | The Merger / Scattered Desks / The Hearing | 合併 / 散らばった席 / 公聴会 | 판 규칙 5 (G5). 3·5·7막 |
| 막 비틀기: 떠넘겨진 손실 / 뒤늦은 청구서 / 학습된 벽 / 진술 고정 / 실명 서명 | Passed Down / The Late Bill / The Trained Wall / On the Record / Signed by Name | 押しつけられた損失 / 遅れてきた請求書 / 学習された壁 / 供述の固定 / 実名の署名 | 판 규칙 6 (G5). 1·2·4·6·8막 |
| 서명란: 이름만 쓴다 / 조건을 단다 | The signature line: Name only / With conditions | 署名欄: 名前だけ書く / 条件をつける | 판 규칙 6 (G5 8막). 고르지 않으면 조건을 단다 |
| 조서에 남은 자세 | On record until the Case ends | 調書に残った構え | 판 규칙 6 (G5 6막). 자세 줄의 고정 표시 |
| 지난 판 N에서 터짐 | Last BUST at N | 前回NでBUST | 판 규칙 6 (G15). 숨 고르기 옆, 60 이상이면 열기 −14 |
| 낮게 끊으면 감사 / 왜 | Low cash = audit / Why | 低く確定で監査 / なぜ | G17. 감사 한도 한 칸 앞에서 지금 확정하면 칸이 찰 때의 경고, 감사로 잃은 결과의 이유 줄 |
| 다시 뽑기 / 하나 더 | Reroll / One more | 引き直し / もう一つ | 도구 드래프트 |
| 판돈 배수는 합쳐 ×1.6까지 (도구 겹침) | pay ×1.6 at most together | 合わせて1.6倍まで | 판 규칙 7 (G11c). 드래프트 안내 줄. 혼자 더 큰 도구는 그 값 |
| 이번 서명란 (「이름만」의 벽 값) | this signature line | 今回の署名欄 | 판 규칙 7 (G16). 사건마다 1~3, 사건 49는 3 |

## People (prologue 01 to case 07)

| 한국어 | English | 日本語 |
|---|---|---|
| 오진우 | Oh Jinwoo | オ・ジヌ |
| 윤상혁 | Yoon Sanghyuk | ユン・サンヒョク |
| 한서윤 | Han Seoyun | ハン・ソユン |
| 임경수 | Lim Kyungsoo | イム・ギョンス |
| 반재욱 | Ban Jaewook | パン・ジェウク |
| 정해린 | Jung Haerin | チョン・ヘリン |
| 이민서 | Lee Minseo | イ・ミンソ |
| 차지원 | Cha Jiwon | チャ・ジウォン |

Titles go before the name in English (Assistant Manager Oh, Team Head Yoon)
and after the full name in Japanese narration (オ・ジヌ代理, ユン・サンヒョクチーム長;
spoken lines may shorten it, ハン課長). The full cast is each
dictionary's `speakers` (`src/locales/<lang>/index.js`).

## Not settled yet

- 판 in long prose: "hand" reads as cards; a human reviewer may prefer
  "round" in a few story lines. Screens keep "hand".
- ja 卓 vs テーブル in narrative lines outside 卓を組み替える (about 70 in
  prologue 01 to case 07, all in that metaphor today).
