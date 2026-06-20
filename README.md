# 부천형 고등학교 교육과정·학생평가 길라잡이 — 운영 설명서

> 함께하는 배움으로, 부천의 미래를 열다 | 이음 · 나눔 · 성장 · 미래  
> 부천교육지원청 중등교육지원과 교육과정·학생평가 담당

---

## 📁 폴더 구조

```
bucheon-guide/
├── index.html        ← 전체 SPA (Single Page Application)
├── css/
│   └── style.css     ← 스타일시트
├── js/
│   └── script.js     ← 모든 인터랙션 로직
├── data/
│   └── data.js       ← 콘텐츠 데이터 (JSON)
└── assets/           ← 이미지·아이콘 (향후)
```

---

## 🆕 v2.0 변경 사항

| 항목 | 내용 |
|------|------|
| 날짜 | 2026~2027학년도 업무 맥락으로 전면 수정 |
| 문의처 | 부천교육지원청 **중등교육지원과** 교육과정·학생평가 담당 |
| 데이터 필드 | 근거문서명, 해당페이지, 실제근거문구, 공개범위, 태그, 수정일 추가 |
| 질의회신 DB | 독립 메뉴 신설 — 카드형 목록 + 상세 모달 |
| 나이스 성적처리 | 학생평가 내 독립 강조 메뉴 |
| 외부 링크 카드 | 공동교육과정·계절학기 길라잡이 외부 링크 연결 |
| 구글시트 헤더 | 15개 필드 표준 제시 |

---

## 🚀 GitHub Pages 배포

```bash
# 1. 저장소 초기화
git init
git add .
git commit -m "v2.0 배포"
git remote add origin https://github.com/[계정명]/bucheon-guide.git
git push -u origin main

# 2. GitHub → Settings → Pages → Branch: main / root → Save
# 3. https://[계정명].github.io/bucheon-guide/ 접속
```

---

## 📊 구글시트 DB 연동 — 최종 운영 방식

### 단일 시트 통합 헤더 (15개 필드)

| 필드명 | 설명 | 예시 |
|--------|------|------|
| `ID` | 고유 번호 | Q001, R001, F001 |
| `공개범위` | 공개 / 교사용 / 업무용 | 공개 |
| `대분류` | 학생평가 / 교육과정 / 나이스 | 학생평가 |
| `중분류` | 세부 구분 | 수행평가 |
| `제목` | 자료 또는 사례 제목 | 수행평가 결시 처리 기준 |
| `질문` | 질의 내용 | 수행평가 결시 학생 처리 방법은? |
| `답변요약` | 핵심 답변 | 학업성적관리규정 기준에 따라 위원회 심의 |
| `근거문서명` | 법령·지침명 | 경기도교육청 학업성적관리 시행지침(2026) |
| `해당페이지` | 쪽수 | p.34 |
| `실제근거문구` | 원문 발췌 | "결시 학생의 인정점은…" |
| `태그` | 파이프 구분 | 수행평가\|결시\|인정점 |
| `링크` | 원문 URL | https://... |
| `작성일` | YYYY-MM-DD | 2026-03-01 |
| `수정일` | YYYY-MM-DD | 2026-03-10 |
| `상태` | 공개 / 비공개 / 준비중 | 공개 |

### 구글시트 CSV URL 설정 방법

```
① 구글시트 → 파일 → 웹에 게시
② 시트 선택 → CSV 형식 → URL 복사
③ js/script.js 하단 loadFromGoogleSheet() 호출:

await loadFromGoogleSheet(
  'https://docs.google.com/spreadsheets/d/[ID]/pub?gid=[GID]&single=true&output=csv',
  'qnaCases'   // SITE_DATA 키: notices / resources / faqs / qnaCases / stories
);
```

### 데이터 분리 또는 통합 방법

- **통합**: 시트 1개, `ID` 접두어로 유형 구분 (Q=질의회신, R=자료, F=FAQ)
- **분리**: 시트별 URL을 각각 `loadFromGoogleSheet()`로 호출

---

## 📝 콘텐츠 추가·수정 방법

### 질의회신 사례 추가 (`data/data.js`)

```javascript
SITE_DATA.qnaCases.push({
  ID: "Q007",
  공개범위: "공개",
  대분류: "학생평가",
  중분류: "수행평가",
  제목: "사례 제목",
  질문: "질문 내용",
  답변요약: "답변 요약",
  근거문서명: "경기도교육청 학업성적관리 시행지침(2026)",
  해당페이지: "p.35",
  실제근거문구: "원문 내용",
  태그: ["태그1", "태그2"],
  링크: "https://실제링크",
  작성일: "2026-04-01",
  수정일: "2026-04-01",
  상태: "공개"
});
```

### 자료 추가 (`data/data.js`)

```javascript
SITE_DATA.resources.push({
  ID: "R008",
  공개범위: "교사용",
  대분류: "서식모음",
  중분류: "학생평가",
  제목: "자료 제목",
  근거문서명: "관련 지침명",
  해당페이지: "별지",
  실제근거문구: "관련 조항",
  태그: ["태그1", "태그2"],
  링크: "https://실제링크",
  작성일: "2026-04-01",
  수정일: "2026-04-01",
  상태: "공개"
});
```

### 외부 링크 연결 (`data/data.js`)

```javascript
// externalLinks 배열에서 실제 URL 입력
{ id: "ext1", link: "https://실제_공동교육과정_길라잡이_URL" },
{ id: "ext2", link: "https://실제_계절학기_길라잡이_URL" },
```

---

## 🎨 메뉴 추가 방법

### 1단계 — 사이드바 항목 추가 (`js/script.js`)

```javascript
// SIDEBAR_CONFIG.curriculum.items 배열에 추가
{ id: 'new-menu', label: '새 메뉴', icon: '📋', ready: true }
```

### 2단계 — 렌더링 함수 추가

```javascript
// renderCurriculumPage() switch 문에 추가
case 'new-menu':
  c.innerHTML = renderNewMenuPage(); break;

function renderNewMenuPage() {
  return `
    <div class="page-header">...</div>
    <div style="padding:2rem 2.5rem">...</div>`;
}
```

---

## 🖨️ 인쇄 / PDF 저장

상단 **🖨️ 인쇄·PDF** 버튼 → 브라우저 인쇄 대화상자 → **PDF로 저장**

---

## 📞 문의

**부천교육지원청 중등교육지원과 교육과정·학생평가 담당**
