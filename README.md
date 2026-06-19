# 부천형 고등학교 교육과정·학생평가 길라잡이

> 함께하는 배움으로, 부천의 미래를 열다  
> 이음 · 나눔 · 성장 · 미래

---

## 📁 폴더 구조

```
bucheon-guide/
├── index.html          ← 메인 페이지 (모든 뷰 포함)
├── css/
│   └── style.css       ← 전체 스타일시트
├── js/
│   └── script.js       ← 모든 인터랙션 로직
├── data/
│   └── data.js         ← 콘텐츠 데이터 (JSON)
└── assets/             ← 이미지, 아이콘 등 (향후)
```

---

## 🚀 GitHub Pages 배포 방법

### 1단계 - 저장소 생성
1. GitHub에서 새 저장소 생성 (예: `bucheon-guide`)
2. Public 설정 필수

### 2단계 - 파일 업로드
```bash
git init
git add .
git commit -m "초기 배포"
git remote add origin https://github.com/[계정명]/bucheon-guide.git
git push -u origin main
```

### 3단계 - Pages 설정
1. GitHub 저장소 → **Settings** → **Pages**
2. Source: `Deploy from a branch`
3. Branch: `main` / `/ (root)`
4. Save 클릭

### 4단계 - 배포 확인
- 약 1~3분 후 `https://[계정명].github.io/bucheon-guide/` 접속

---

## 📝 콘텐츠 업데이트 방법

### 자료 추가 (data/data.js 수정)

```javascript
// 자료 아카이브에 새 자료 추가
SITE_DATA.resources.push({
  id: "r7",
  title: "새 자료 제목",
  category: "연수자료",           // 정책·지침 / 연수자료 / 서식모음 / AI·디지털 / 카드뉴스
  tags: ["태그1", "태그2"],
  access: "교사용",              // 공개 / 교사용 / 업무용
  link: "https://실제링크주소",
  updatedAt: "2025-04-01",
  fileType: "PDF"               // PDF / PPT / ZIP / IMG / XLS
});
```

### 공지사항 추가
```javascript
SITE_DATA.notices.unshift({    // unshift = 맨 앞에 추가
  id: 5,
  title: "새 공지사항 제목",
  date: "2025-04-01",
  tag: "교육과정",
  important: true,
  link: "https://링크"
});
```

### FAQ 추가
```javascript
SITE_DATA.faqs.push({
  id: "f6",
  category: "학생평가",          // 교육과정 / 학생평가 / 나이스
  question: "질문 내용",
  answer: "답변 내용"
});
```

---

## 🔗 구글시트 DB 연동 방법

### 준비
1. 구글시트에 데이터 입력 (헤더: id, title, category, tags, access, link, updatedAt, fileType)
2. **파일** → **웹에 게시** → 원하는 시트 선택 → **CSV** 형식으로 게시
3. 생성된 URL 복사

### 코드 수정 (js/script.js 하단)

```javascript
// 페이지 로드 시 구글시트에서 데이터 가져오기
document.addEventListener('DOMContentLoaded', async () => {
  // 자료 아카이브 시트 연동
  await loadFromGoogleSheet(
    'https://docs.google.com/spreadsheets/d/[시트ID]/pub?gid=[시트GID]&single=true&output=csv',
    'resources'
  );
  
  // 공지사항 시트 연동
  await loadFromGoogleSheet(
    'https://docs.google.com/spreadsheets/d/[시트ID]/pub?gid=[시트GID]&single=true&output=csv',
    'notices'
  );
  
  // 초기화 (기존 코드 그대로)
  initNavigation();
  initMobileMenu();
  initSearch();
  renderHome();
  navigateTo('home');
});
```

### 구글시트 헤더 예시

| id | title | category | tags | access | link | updatedAt | fileType |
|----|-------|----------|------|--------|------|-----------|----------|
| r1 | 2025 편성 지침 | 정책·지침 | 편성,지침 | 교사용 | https://... | 2025-03-01 | PDF |

---

## 🎨 메뉴 추가 방법

### 1. 사이드바 메뉴 추가 (js/script.js)
```javascript
// SIDEBAR_CONFIG의 curriculum.items 배열에 추가
{
  id: 'new-menu',
  label: '새 메뉴',
  icon: '📋',
  ready: true,       // false이면 "준비중" 표시
}
```

### 2. 페이지 렌더링 추가 (js/script.js)
```javascript
// renderCurriculumPage() 함수의 switch문에 추가
case 'new-menu':
  container.innerHTML = renderNewMenuPage();
  break;

// 렌더링 함수 추가
function renderNewMenuPage() {
  return `
    <div class="page-header">...</div>
    <div style="padding:2rem 2.5rem;">...</div>
  `;
}
```

---

## 🖨️ 인쇄 / PDF 저장

상단 **🖨️ 인쇄·PDF** 버튼 클릭 → 브라우저 인쇄 대화상자 → **PDF로 저장** 선택

---

## 📞 문의

부천교육지원청 중등교육과 교육과정·학생평가 담당
