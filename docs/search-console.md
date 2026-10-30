# Google Search Console — 사이트 확인과 사이트맵

AdSense 검토는 사이트에 읽을 글이 있는지, 검색 엔진이 그 글을 찾을 수 있는지를 봅니다. 게임은 스크립트로 그려지는
페이지라 `/`를 받은 크롤러가 읽는 것은 제목과 설명뿐이고, 글은 빌드가 `index.html` 옆에 쓰는 정적 페이지 열다섯에
있습니다(README 「데이터와 접근성」, `scripts/site-pages.mjs`). Search Console은 그 페이지들이 색인되는지 보고,
`sitemap.xml`을 직접 제출하는 곳입니다.

## 빌드가 쓰는 것 (설정 없이 늘)

| 파일 | 내용 |
| --- | --- |
| `/robots.txt` | `User-agent: *` · `Allow: /` · `Sitemap: <사이트 주소>/sitemap.xml` |
| `/sitemap.xml` | 시작 페이지(`/`, 대체 주소 `/?lang=en`·`/?lang=ja`)와 정적 페이지 열다섯, 16항목. 항목마다 세 언어와 x-default의 대체 주소, `lastmod`는 빌드한 날 |
| 정적 페이지 15개 | `/about.html` `/faq.html` `/contact.html` `/privacy.html` `/terms.html`과 `/en/`·`/ja/`의 같은 이름. canonical과 hreflang은 사이트 주소 위의 절대 주소 |

사이트 주소는 `SITE_URL`(자기 도메인을 둘 때), 없으면 Render가 빌드마다 넣는 `RENDER_EXTERNAL_URL`입니다. 둘 다
없는 로컬·CI 빌드는 주소가 상대 주소로 남고 `robots.txt`에 `Sitemap:` 줄이 없습니다.

## 사이트 확인 (`GOOGLE_SITE_VERIFICATION`)

| 환경 변수 | 값 | 들어가는 것 | 번들 JS |
| --- | --- | --- | --- |
| (없음) | — | 아무것도 없음 | 변화 0 |
| `GOOGLE_SITE_VERIFICATION` | Search Console이 주는 meta 태그의 `content` 값(태그 전체를 붙여도 읽음) | `index.html` `<head>`의 `<meta name="google-site-verification">` | 변화 0 |

- `ADSENSE_CLIENT`처럼 이름에 `VITE_`가 없습니다. `VITE_` 변수는 `import.meta.env`를 거쳐 진입 청크에 들어갑니다
  (docs/web-ads.md).
- 값은 원래 공개됩니다(누구나 페이지 소스에서 봄). 그래도 저장소에는 쓰지 않고 Render 환경 변수로만 둡니다.
- 형식이 틀리면(영문·숫자·`-`·`_` 20~100자가 아니면) 빌드가 실패합니다(`scripts/search-console.mjs`).

### Render 환경 변수 (대시보드 → 서비스 → Environment)

| Key | Value |
| --- | --- |
| `GOOGLE_SITE_VERIFICATION` | Search Console → 속성 추가 → 「URL 접두어」 → `https://critical-point-wn6p.onrender.com/` → 확인 방법 「HTML 태그」에 보이는 `content="…"`의 값 |

환경 변수는 빌드할 때 읽으므로 넣은 뒤 다시 빌드해야 반영됩니다(「Save, rebuild, and deploy」 또는 다음 배포).

### 확인 명령

```sh
curl -s https://critical-point-wn6p.onrender.com/ | grep -o '<meta name="google-site-verification"[^>]*>'
curl -s https://critical-point-wn6p.onrender.com/robots.txt
curl -s https://critical-point-wn6p.onrender.com/sitemap.xml | grep -c '<url>'   # 16
curl -s -o /dev/null -w '%{http_code}\n' https://critical-point-wn6p.onrender.com/faq.html   # 200
```

### 순서

| # | 할 일 | 누가 |
| --- | --- | --- |
| 1 | Search Console에서 URL 접두어 속성을 추가하고 「HTML 태그」의 값을 복사 | 사용자 |
| 2 | Render 환경 변수 `GOOGLE_SITE_VERIFICATION`을 넣고 다시 배포 | 사용자 |
| 3 | 위 확인 명령으로 meta 태그 확인 | 사용자 또는 Claude |
| 4 | Search Console에서 「확인」 | 사용자 |
| 5 | Search Console → 색인 생성 → Sitemaps → `sitemap.xml` 제출 | 사용자 |

Render 하위 도메인은 「도메인」 속성(DNS 확인)을 쓸 수 없으므로 「URL 접두어」 속성으로 확인합니다. 자기 도메인으로
옮기면 그 도메인으로 다시 확인합니다.
