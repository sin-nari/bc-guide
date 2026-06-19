/**
 * 부천형 고등학교 교육과정·학생평가 길라잡이 - 메인 스크립트
 * ──────────────────────────────────────────────────────────────
 * 구조:
 *   1. 초기화 & 라우팅
 *   2. 네비게이션 (상단/사이드바)
 *   3. 홈 페이지 렌더링
 *   4. 교육과정 페이지
 *   5. 학생평가 페이지
 *   6. 자료 아카이브
 *   7. STORY 페이지
 *   8. 검색 기능
 *   9. FAQ 아코디언
 *  10. 공통 유틸리티
 *  11. 구글시트 연동 (향후)
 */

'use strict';

/* ══════════════════════════════════════════════════════════════
   1. 초기화 & 라우팅
   ══════════════════════════════════════════════════════════════ */

// 현재 활성 페이지 & 탭 추적
const AppState = {
  currentPage: 'home',
  currentSubMenu: null,
  currentTab: null,
  searchQuery: '',
};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initSearch();
  renderHome();
  // 기본 페이지: 홈
  navigateTo('home');
});

/* ══════════════════════════════════════════════════════════════
   2. 네비게이션
   ══════════════════════════════════════════════════════════════ */

/**
 * 상단 메뉴 + 사이드바 네비게이션 초기화
 */
function initNavigation() {
  // 상단 메뉴 클릭
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const page = el.dataset.page;
      const subMenu = el.dataset.submenu || null;
      const tab = el.dataset.tab || null;
      navigateTo(page, subMenu, tab);
    });
  });

  // 사이드바 토글 (상위 메뉴의 하위 펼치기)
  document.querySelectorAll('.sidebar-parent').forEach(el => {
    el.addEventListener('click', () => {
      const targetId = el.dataset.target;
      const targetSub = document.getElementById(targetId);
      const icon = el.querySelector('.sidebar-toggle-icon');
      if (!targetSub) return;

      const isOpen = targetSub.classList.contains('open');
      // 모든 서브메뉴 닫기
      document.querySelectorAll('.sidebar-submenu.open').forEach(s => s.classList.remove('open'));
      document.querySelectorAll('.sidebar-toggle-icon.rotated').forEach(i => i.classList.remove('rotated'));

      if (!isOpen) {
        targetSub.classList.add('open');
        if (icon) icon.classList.add('rotated');
      }
    });
  });
}

/**
 * 페이지 전환 함수
 * @param {string} page - 페이지 ID
 * @param {string|null} subMenu - 하위 메뉴 ID
 * @param {string|null} tab - 탭 ID
 */
function navigateTo(page, subMenu = null, tab = null) {
  AppState.currentPage = page;
  AppState.currentSubMenu = subMenu;

  // 모든 페이지 뷰 숨김
  document.querySelectorAll('.page-view').forEach(v => v.classList.remove('active'));
  // 대상 페이지 표시
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  // 상단 메뉴 active 업데이트
  document.querySelectorAll('.topnav-menu a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });

  // 사이드바 렌더링
  renderSidebar(page, subMenu);

  // 탭이 있으면 활성화
  if (tab) activateTab(tab);

  // 페이지별 렌더링
  switch (page) {
    case 'home':           renderHome(); break;
    case 'curriculum':     renderCurriculumPage(subMenu); break;
    case 'evaluation':     renderEvaluationPage(subMenu); break;
    case 'archive':        renderArchivePage(); break;
    case 'story':          renderStoryPage(); break;
  }

  // 모바일: 사이드바 닫기
  closeMobileSidebar();

  // 최상단 스크롤
  const mc = document.getElementById('main-content');
  if (mc) mc.scrollTop = 0;
}

/* ══════════════════════════════════════════════════════════════
   사이드바 렌더링
   ══════════════════════════════════════════════════════════════ */

const SIDEBAR_CONFIG = {
  home: {
    title: '홈',
    items: []
  },
  curriculum: {
    title: '고등학교 교육과정',
    items: [
      { id: 'credit', label: '고교학점제', icon: '🎓', ready: true },
      {
        id: 'planning', label: '교육과정 편성·운영', icon: '📋', ready: true,
        children: [
          { id: 'planning-overview', label: '운영 개요', tab: 'overview' },
          { id: 'planning-notice', label: '편성 유의사항', tab: 'notice' },
          { id: 'planning-check', label: '학교별 체크리스트', tab: 'checklist' },
          { id: 'planning-faq', label: 'FAQ', tab: 'faq' },
        ]
      },
      {
        id: 'consulting', label: '교육과정 편성 컨설팅', icon: '🗂️', ready: true,
        children: [
          { id: 'consulting-overview', label: '컨설팅 개요', tab: 'overview' },
          { id: 'consulting-schedule', label: '일정 및 대상', tab: 'schedule' },
          { id: 'consulting-check', label: '컨설팅 체크포인트', tab: 'checkpoint' },
          { id: 'consulting-faq', label: 'FAQ', tab: 'faq' },
        ]
      },
      { id: 'joint', label: '부천형 공동교육과정', icon: '🔗', ready: false },
      { id: 'seasonal', label: '부천형 계절학기', icon: '🌞', ready: false },
      { id: 'special', label: '교과특성화학교', icon: '⭐', ready: false },
      { id: 'campus', label: '나눔캠퍼스', icon: '🏫', ready: false },
      { id: 'expo', label: '미래공감 설명회', icon: '🎤', ready: false },
      { id: 'minachieve', label: '최소 성취수준 보장지도', icon: '📊', ready: false },
    ]
  },
  evaluation: {
    title: '중등 학생평가',
    items: [
      { id: 'eval-overview', label: '평가 운영', icon: '📋', ready: false },
      { id: 'exam', label: '정기고사', icon: '📝', ready: false },
      { id: 'performance', label: '수행평가', icon: '✏️', ready: false },
      { id: 'neis', label: '나이스 성적처리', icon: '💻', ready: true, highlight: true },
      { id: 'committee', label: '학업성적관리위원회', icon: '🏛️', ready: false },
      { id: 'cases', label: '상황별 처리', icon: '📂', ready: false },
      { id: 'eval-faq', label: 'FAQ', icon: '❓', ready: true, highlight: true },
      { id: 'qna', label: '질의회신 DB', icon: '📚', ready: true, highlight: true },
    ]
  },
  archive: {
    title: '자료 아카이브',
    items: [
      { id: 'policy', label: '정책·지침', icon: '📜', ready: true },
      { id: 'training', label: '연수자료', icon: '🎓', ready: true },
      { id: 'forms', label: '서식모음', icon: '📄', ready: true },
      { id: 'ai', label: 'AI·디지털', icon: '🤖', ready: true },
      { id: 'cardnews', label: '카드뉴스', icon: '🗞️', ready: true },
      { id: 'infographic', label: '인포그래픽', icon: '📊', ready: true },
      { id: 'pr', label: '홍보자료', icon: '📣', ready: true },
      { id: 'video', label: '영상자료', icon: '🎬', ready: true },
    ]
  },
  story: {
    title: '부천 교육 STORY',
    items: [
      { id: 'joint-story', label: '공동교육과정 STORY', icon: '🔗', ready: true },
      { id: 'seasonal-story', label: '계절학기 STORY', icon: '☀️', ready: true },
      { id: 'expo-story', label: '미래공감 설명회 STORY', icon: '🎤', ready: true },
      { id: 'campus-story', label: '나눔캠퍼스 STORY', icon: '🏫', ready: true },
      { id: 'results', label: '운영 성과', icon: '📈', ready: true },
      { id: 'cardnews-story', label: '카드뉴스', icon: '🗞️', ready: true },
      { id: 'press', label: '보도자료', icon: '📰', ready: true },
    ]
  }
};

function renderSidebar(page, subMenu) {
  const sidebar = document.getElementById('sidebar-nav');
  if (!sidebar) return;

  const config = SIDEBAR_CONFIG[page];
  if (!config || config.items.length === 0) {
    sidebar.innerHTML = '';
    return;
  }

  let html = `<div class="sidebar-section-header">${config.title}</div>`;

  config.items.forEach(item => {
    const isActive = subMenu === item.id;
    const highlightClass = item.highlight ? ' highlight-item' : '';
    const readyLabel = item.ready ? '' : '<span style="font-size:0.68rem;opacity:0.5;float:right;">준비중</span>';

    if (item.children && item.children.length > 0) {
      const isParentActive = subMenu && item.children.some(c => c.id === subMenu || subMenu === item.id);
      html += `
        <div class="sidebar-nav-item sidebar-parent${isActive || isParentActive ? ' active' : ''}${highlightClass}"
             data-target="sub-${item.id}">
          <span class="item-icon">${item.icon}</span>${item.label}
          <span class="sidebar-toggle-icon${isParentActive ? ' rotated' : ''}">▶</span>
        </div>
        <div class="sidebar-submenu${isParentActive ? ' open' : ''}" id="sub-${item.id}">
          ${item.children.map(child => `
            <div class="sidebar-nav-item${subMenu === child.id ? ' active' : ''}"
                 data-page="${page}" data-submenu="${child.id}" data-tab="${child.tab || ''}">
              ${child.label}
            </div>
          `).join('')}
        </div>`;
    } else {
      html += `
        <div class="sidebar-nav-item${isActive ? ' active' : ''}${highlightClass}"
             data-page="${page}" data-submenu="${item.id}">
          <span class="item-icon">${item.icon}</span>${item.label}${readyLabel}
        </div>`;
    }
  });

  sidebar.innerHTML = html;

  // 이벤트 재바인딩
  sidebar.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', () => {
      const p = el.dataset.page;
      const sub = el.dataset.submenu || null;
      const tab = el.dataset.tab || null;
      navigateTo(p, sub, tab);
    });
  });

  sidebar.querySelectorAll('.sidebar-parent').forEach(el => {
    el.addEventListener('click', () => {
      const targetId = el.dataset.target;
      const targetSub = document.getElementById(targetId);
      const icon = el.querySelector('.sidebar-toggle-icon');
      if (!targetSub) return;
      const isOpen = targetSub.classList.contains('open');
      sidebar.querySelectorAll('.sidebar-submenu.open').forEach(s => s.classList.remove('open'));
      sidebar.querySelectorAll('.sidebar-toggle-icon.rotated').forEach(i => i.classList.remove('rotated'));
      if (!isOpen) {
        targetSub.classList.add('open');
        if (icon) icon.classList.add('rotated');
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   3. 홈 페이지 렌더링
   ══════════════════════════════════════════════════════════════ */

function renderHome() {
  renderNoticeTicker();
  renderQuickLinks();
  renderSeasons();
  renderNoticeTable();
}

function renderNoticeTicker() {
  const track = document.getElementById('notice-ticker-track');
  if (!track || !SITE_DATA.notices) return;
  track.innerHTML = SITE_DATA.notices.map(n =>
    `<span class="notice-ticker-item" onclick="void(0)">
      ${n.important ? '<span class="important">★</span> ' : ''}${n.title}
    </span>`
  ).join('');
}

function renderQuickLinks() {
  const grid = document.getElementById('quick-grid');
  if (!grid || !SITE_DATA.quickLinks) return;
  grid.innerHTML = SITE_DATA.quickLinks.map(q => `
    <a href="${q.link}" class="quick-card${q.highlight ? ' highlight' : ''}"
       style="border-top: 3px solid var(--${q.color || 'primary'})">
      <div class="quick-card-icon">${q.icon}</div>
      <div class="quick-card-title">${q.title}</div>
      <div class="quick-card-desc">${q.desc}</div>
      <div class="quick-card-arrow">바로가기 →</div>
    </a>
  `).join('');
}

function renderSeasons() {
  const grid = document.getElementById('season-grid');
  if (!grid || !SITE_DATA.seasons) return;
  grid.innerHTML = SITE_DATA.seasons.map(s => `
    <div class="season-card">
      <div class="season-card-header">
        <span class="season-icon">${s.icon}</span>
        <span class="season-label">${s.label}</span>
      </div>
      <div class="season-links">
        ${s.items.map(item => `
          <a href="${item.link}" class="season-link">${item.title}</a>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderNoticeTable() {
  const tbody = document.getElementById('notice-tbody');
  if (!tbody || !SITE_DATA.notices) return;
  tbody.innerHTML = SITE_DATA.notices.map(n => `
    <div class="notice-row">
      <div class="notice-row-title">
        ${n.important ? '<span class="notice-badge important">중요</span>' : ''}
        <span class="notice-badge tag">${n.tag}</span>
        <a href="${n.link}">${n.title}</a>
      </div>
      <div></div>
      <div class="notice-row-date">${n.date}</div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════════════════
   4. 교육과정 페이지
   ══════════════════════════════════════════════════════════════ */

function renderCurriculumPage(subMenu) {
  const container = document.getElementById('curriculum-content');
  if (!container) return;

  // 서브메뉴별 콘텐츠 렌더링
  switch (subMenu) {
    case 'planning':
    case 'planning-overview':
    case 'planning-notice':
    case 'planning-check':
    case 'planning-faq':
      container.innerHTML = renderPlanningPage(subMenu);
      initTabs('planning-tabs');
      if (subMenu === 'planning-check') activateTab('checklist');
      else if (subMenu === 'planning-faq') activateTab('faq');
      else if (subMenu === 'planning-notice') activateTab('notice');
      else activateTab('overview');
      initFAQ();
      initChecklist();
      break;

    case 'consulting':
    case 'consulting-overview':
    case 'consulting-schedule':
    case 'consulting-check':
    case 'consulting-faq':
      container.innerHTML = renderConsultingPage(subMenu);
      initTabs('consulting-tabs');
      if (subMenu === 'consulting-schedule') activateTab('schedule');
      else if (subMenu === 'consulting-check') activateTab('checkpoint');
      else if (subMenu === 'consulting-faq') activateTab('faq');
      else activateTab('overview');
      initFAQ();
      break;

    case 'credit':
      container.innerHTML = renderCreditPage();
      break;

    default:
      container.innerHTML = renderCurriculumHome();
      break;
  }
}

function renderCurriculumHome() {
  return `
    <div class="page-header">
      <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 고등학교 교육과정</div>
      <div class="page-header-title">📚 고등학교 교육과정</div>
      <div class="page-header-desc">고교학점제 기반 교육과정 편성·운영의 모든 것</div>
      <div style="height: 1.2rem;"></div>
    </div>
    <div style="padding: 2rem 2.5rem;">
      <div class="alert alert-info">
        <span class="alert-icon">ℹ️</span>
        <span>좌측 메뉴에서 필요한 항목을 선택하세요. 
        <strong>교육과정 편성·운영</strong>과 <strong>교육과정 편성 컨설팅</strong>이 우선 활성화되어 있습니다.</span>
      </div>
      <div class="quick-grid">
        ${[
          { icon: '📋', title: '교육과정 편성·운영', desc: '편성 절차 및 유의사항', sub: 'planning', color: 'blue' },
          { icon: '🗂️', title: '교육과정 편성 컨설팅', desc: '컨설팅 일정·체크포인트', sub: 'consulting', color: 'indigo' },
          { icon: '🔗', title: '부천형 공동교육과정', desc: '준비 중', sub: 'joint', color: 'teal', soon: true },
          { icon: '🌞', title: '부천형 계절학기', desc: '준비 중', sub: 'seasonal', color: 'orange', soon: true },
          { icon: '📊', title: '최소 성취수준 보장지도', desc: '준비 중', sub: 'minachieve', color: 'purple', soon: true },
        ].map(c => `
          <div class="quick-card" style="border-top: 3px solid var(--${c.color});${c.soon ? 'opacity:0.6' : ''}"
               onclick="navigateTo('curriculum','${c.sub}')">
            <div class="quick-card-icon">${c.icon}</div>
            <div class="quick-card-title">${c.title}${c.soon ? ' <span style="font-size:0.7rem;color:var(--text-muted)">준비중</span>' : ''}</div>
            <div class="quick-card-desc">${c.desc}</div>
            ${!c.soon ? '<div class="quick-card-arrow">바로가기 →</div>' : ''}
          </div>
        `).join('')}
      </div>
    </div>`;
}

function renderPlanningPage(subMenu) {
  return `
    <div class="page-header">
      <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 고등학교 교육과정 <span>›</span> 교육과정 편성·운영</div>
      <div class="page-header-title">📋 교육과정 편성·운영</div>
      <div class="page-header-desc">2025학년도 고등학교 교육과정 편성·운영 안내</div>
      <div class="tab-nav" id="planning-tabs">
        <button class="tab-btn" data-tab="overview">운영 개요</button>
        <button class="tab-btn" data-tab="notice">편성 유의사항</button>
        <button class="tab-btn" data-tab="checklist">학교별 체크리스트</button>
        <button class="tab-btn" data-tab="refs">참고자료</button>
        <button class="tab-btn" data-tab="faq">FAQ</button>
      </div>
    </div>

    <!-- 운영 개요 탭 -->
    <div class="tab-content" id="tab-overview">
      <div class="alert alert-info">
        <span class="alert-icon">📌</span>
        <span>2025학년도부터 고교학점제 전환 학교는 <strong>192학점</strong> 기준을 적용합니다. 
        아래 절차에 따라 교육과정을 편성하세요.</span>
      </div>
      <div class="two-col">
        <div class="info-card">
          <div class="info-card-title">🎯 편성 목적</div>
          <div class="info-card-body">
            <p>학생의 진로와 적성에 맞는 맞춤형 교육과정을 편성하여 학생 선택권을 확대하고, 
            고교학점제 안착을 지원합니다.</p>
            <br>
            <p><strong>주요 원칙</strong></p>
            <ul style="margin-top:0.5rem;padding-left:1.2rem;list-style:disc;font-size:0.87rem;color:var(--text-secondary)">
              <li>학생 선택 중심 교육과정 편성</li>
              <li>교과(군)별 필수 이수 단위 준수</li>
              <li>학교 여건에 맞는 자율 편성 확대</li>
              <li>지역 협력 공동교육과정 연계</li>
            </ul>
          </div>
        </div>
        <div class="info-card">
          <div class="info-card-title">📅 편성 일정</div>
          <div class="info-card-body">
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-step">1월~2월</div>
                <div class="timeline-title">수요 조사 및 개설 과목 결정</div>
                <div class="timeline-desc">학생 수강 신청 수요 조사 실시, 개설 가능 과목 검토</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-step">2월~3월</div>
                <div class="timeline-title">교육과정 편성 완료</div>
                <div class="timeline-desc">학업성적관리규정 반영, 편성 컨설팅 실시</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-step">3월</div>
                <div class="timeline-title">교육과정 공시 및 운영</div>
                <div class="timeline-desc">학교 홈페이지 공시 후 교육과정 운영 시작</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-card">
        <div class="info-card-title">📐 이수 단위 구조 (고교학점제 전환 학교)</div>
        <div class="info-card-body">
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
              <thead>
                <tr style="background:var(--primary-light)">
                  <th style="padding:0.6rem;text-align:left;border:1px solid var(--border)">구분</th>
                  <th style="padding:0.6rem;text-align:center;border:1px solid var(--border)">필수 이수 학점</th>
                  <th style="padding:0.6rem;text-align:center;border:1px solid var(--border)">학교 자율 학점</th>
                  <th style="padding:0.6rem;text-align:center;border:1px solid var(--border)">합계</th>
                </tr>
              </thead>
              <tbody>
                ${[
                  ['교과 영역', '84', '90', '174'],
                  ['창의적 체험활동', '-', '18', '18'],
                  ['총계', '84', '108', '192'],
                ].map(row => `
                  <tr>
                    ${row.map((cell, i) => `
                      <td style="padding:0.55rem 0.6rem;border:1px solid var(--border);
                        ${i===0?'':'text-align:center'}
                        ${row[0]==='총계'?'font-weight:700;background:var(--accent-light)':''}">${cell}</td>
                    `).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 편성 유의사항 탭 -->
    <div class="tab-content" id="tab-notice">
      <div class="three-col">
        ${[
          {
            icon: '⚠️', title: '필수 이수 단위', color: 'red',
            items: ['국어, 수학, 영어 각 10학점 이상', '한국사 6학점 이상 필수', '체육, 예술, 기술·가정/정보 등 필수 과목 이수', '교과군별 필수 이수 학점 준수']
          },
          {
            icon: '📝', title: '학업성적관리규정 반영', color: 'blue',
            items: ['수행평가 방법 및 반영 비율 사전 명시', '지필평가 횟수 및 범위 명시', '최소 성취수준 보장지도 계획 포함', '공동교육과정·계절학기 성적 처리 기준 명시']
          },
          {
            icon: '✅', title: '교육청 제출 서류', color: 'green',
            items: ['학교 교육과정 편성·운영 계획서', '교과별 이수 단위 배당표', '창의적 체험활동 편성 계획', '학업성적관리규정(개정 시)']
          }
        ].map(card => `
          <div class="info-card" style="border-top:3px solid var(--${card.color})">
            <div class="info-card-title">${card.icon} ${card.title}</div>
            <div class="info-card-body">
              <ul style="padding-left:1rem;list-style:disc;display:flex;flex-direction:column;gap:0.4rem;">
                ${card.items.map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 체크리스트 탭 -->
    <div class="tab-content" id="tab-checklist">
      <div class="info-card">
        <div class="info-card-title">✅ 교육과정 편성 최종 체크리스트</div>
        <div class="info-card-body">
          <p style="margin-bottom:1rem;font-size:0.84rem;color:var(--text-muted)">
            항목을 클릭하여 완료 표시를 하세요. (새로고침 시 초기화됩니다)
          </p>
          <div class="checklist" id="curriculum-checklist">
            ${[
              '교과(군)별 필수 이수 학점이 충족되었는가?',
              '총 이수 학점(192학점)이 맞는가?',
              '창의적 체험활동 18학점이 편성되었는가?',
              '학생 수강 신청 수요가 반영되었는가?',
              '공동교육과정 연계 과목이 확인되었는가?',
              '학업성적관리규정에 평가 계획이 반영되었는가?',
              '수행평가 반영 비율이 명시되었는가?',
              '최소 성취수준 보장지도 계획이 포함되었는가?',
              '교육청 제출 서류가 준비되었는가?',
              '학교 홈페이지 공시 일정이 확인되었는가?',
            ].map((item, i) => `
              <div class="checklist-item" onclick="toggleCheck(this)">
                <input type="checkbox" id="chk-${i}" onclick="event.stopPropagation()">
                <label for="chk-${i}">${item}</label>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- 참고자료 탭 -->
    <div class="tab-content" id="tab-refs">
      <div class="resource-grid">
        ${[
          { title: '2025 고등학교 교육과정 편성·운영 지침', type: 'PDF', access: '교사용', date: '2025-03-01', tags: ['편성', '지침'] },
          { title: '고교학점제 교육과정 편성 예시', type: 'PPT', access: '교사용', date: '2025-02-15', tags: ['고교학점제', '예시'] },
          { title: '교육과정 편성 서식 모음', type: 'ZIP', access: '업무용', date: '2025-02-20', tags: ['서식', '편성'] },
        ].map(r => renderResourceCard(r)).join('')}
      </div>
    </div>

    <!-- FAQ 탭 -->
    <div class="tab-content" id="tab-faq">
      <div class="faq-list" id="planning-faq-list">
        ${SITE_DATA.faqs.filter(f => f.category === '교육과정').map(f => renderFaqItem(f)).join('')}
      </div>
    </div>`;
}

function renderConsultingPage(subMenu) {
  return `
    <div class="page-header">
      <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 고등학교 교육과정 <span>›</span> 교육과정 편성 컨설팅</div>
      <div class="page-header-title">🗂️ 교육과정 편성 컨설팅</div>
      <div class="page-header-desc">2025학년도 학교 교육과정 편성 컨설팅 운영 안내</div>
      <div class="tab-nav" id="consulting-tabs">
        <button class="tab-btn" data-tab="overview">컨설팅 개요</button>
        <button class="tab-btn" data-tab="schedule">일정 및 대상</button>
        <button class="tab-btn" data-tab="checkpoint">컨설팅 체크포인트</button>
        <button class="tab-btn" data-tab="refs">자료실</button>
        <button class="tab-btn" data-tab="faq">FAQ</button>
      </div>
    </div>

    <!-- 개요 탭 -->
    <div class="tab-content" id="tab-overview">
      <div class="two-col">
        <div class="info-card">
          <div class="info-card-title">🎯 컨설팅 목적</div>
          <div class="info-card-body">
            <p>학교 교육과정 편성의 적합성을 함께 검토하고, 학교별 여건에 맞는 교육과정 운영을 지원합니다.</p>
            <br>
            <p><strong>운영 방식</strong></p>
            <ul style="margin-top:0.5rem;padding-left:1.2rem;list-style:disc;font-size:0.87rem;color:var(--text-secondary)">
              <li>교육지원청 → 학교 방문 컨설팅</li>
              <li>학교 간 상호 컨설팅</li>
              <li>권역별 집합 컨설팅</li>
            </ul>
          </div>
        </div>
        <div class="info-card">
          <div class="info-card-title">📋 준비 자료</div>
          <div class="info-card-body">
            <ul style="padding-left:1.2rem;list-style:disc;font-size:0.87rem;color:var(--text-secondary);display:flex;flex-direction:column;gap:0.4rem">
              <li>학교 교육과정 편성·운영 계획서</li>
              <li>교과별 이수 단위 배당표</li>
              <li>학업성적관리규정</li>
              <li>수행평가 계획서</li>
              <li>전년도 교육과정 운영 결과</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 일정 탭 -->
    <div class="tab-content" id="tab-schedule">
      <div class="info-card">
        <div class="info-card-title">📅 2025학년도 컨설팅 일정</div>
        <div class="info-card-body">
          <div class="alert alert-warning" style="margin-bottom:1rem">
            <span class="alert-icon">⚠️</span>
            <span>아래 일정은 예정 일정입니다. 개별 학교 일정은 공문으로 별도 안내됩니다.</span>
          </div>
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
              <thead>
                <tr style="background:var(--primary-light)">
                  ${['구분','대상','일정','장소','비고'].map(h=>
                    `<th style="padding:0.6rem;border:1px solid var(--border);text-align:left">${h}</th>`
                  ).join('')}
                </tr>
              </thead>
              <tbody>
                ${[
                  ['1차 컨설팅','부천 관내 전 고등학교','2025. 3월','각 학교','교육과정 편성 확인'],
                  ['상호 컨설팅','희망 학교','2025. 4월','참여 학교','학교 간 교류'],
                  ['2차 컨설팅','1차 후속 학교','2025. 5월','각 학교','수정 사항 확인'],
                ].map(row=>`
                  <tr>
                    ${row.map(cell=>`<td style="padding:0.55rem 0.6rem;border:1px solid var(--border)">${cell}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 체크포인트 탭 -->
    <div class="tab-content" id="tab-checkpoint">
      <div class="info-card">
        <div class="info-card-title">🔍 컨설팅 체크포인트</div>
        <div class="info-card-body">
          <div class="checklist" id="consulting-checklist">
            ${[
              '[교과 편성] 교과(군)별 필수 이수 학점이 충족되어 있는가?',
              '[교과 편성] 총 이수 학점(192학점)이 올바른가?',
              '[교과 편성] 학생 선택 과목이 충분히 반영되어 있는가?',
              '[성적 처리] 학업성적관리규정에 평가 방법이 명시되어 있는가?',
              '[성적 처리] 수행평가 비율이 교과별로 명시되어 있는가?',
              '[공동교육과정] 공동교육과정 성적 처리 기준이 규정에 반영되어 있는가?',
              '[최소 성취수준] 최소 성취수준 보장지도 계획이 수립되어 있는가?',
              '[서류] 교육청 제출 서류가 모두 준비되어 있는가?',
            ].map((item, i) => `
              <div class="checklist-item" onclick="toggleCheck(this)">
                <input type="checkbox" id="con-chk-${i}" onclick="event.stopPropagation()">
                <label for="con-chk-${i}">${item}</label>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- 자료실 탭 -->
    <div class="tab-content" id="tab-refs">
      <div class="resource-grid">
        ${[
          { title: '교육과정 편성 컨설팅 자료집', type: 'PDF', access: '교사용', date: '2025-03-10', tags: ['컨설팅', '자료'] },
          { title: '상호 컨설팅 운영 안내', type: 'PPT', access: '교사용', date: '2025-03-05', tags: ['상호컨설팅'] },
          { title: '컨설팅 체크리스트 서식', type: 'ZIP', access: '업무용', date: '2025-03-01', tags: ['서식', '체크리스트'] },
        ].map(r => renderResourceCard(r)).join('')}
      </div>
    </div>

    <!-- FAQ 탭 -->
    <div class="tab-content" id="tab-faq">
      <div class="faq-list">
        ${SITE_DATA.faqs.filter(f => f.category === '교육과정').map(f => renderFaqItem(f)).join('')}
      </div>
    </div>`;
}

function renderCreditPage() {
  return `
    <div class="page-header">
      <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 고등학교 교육과정 <span>›</span> 고교학점제</div>
      <div class="page-header-title">🎓 고교학점제</div>
      <div class="page-header-desc">고교학점제 이해와 부천 운영 현황</div>
      <div style="height:1.2rem;"></div>
    </div>
    <div style="padding:2rem 2.5rem;">
      <div class="alert alert-info">
        <span class="alert-icon">ℹ️</span>
        <span>이 페이지는 준비 중입니다. 빠른 시일 내에 콘텐츠를 제공하겠습니다.</span>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════
   5. 학생평가 페이지
   ══════════════════════════════════════════════════════════════ */

function renderEvaluationPage(subMenu) {
  const container = document.getElementById('evaluation-content');
  if (!container) return;

  if (subMenu === 'eval-faq' || subMenu === 'neis' || subMenu === 'qna') {
    switch (subMenu) {
      case 'eval-faq':
        container.innerHTML = renderEvalFAQ();
        initFAQ();
        break;
      case 'qna':
        container.innerHTML = renderQnaDB();
        break;
      case 'neis':
        container.innerHTML = renderNeisPage();
        break;
    }
    return;
  }

  // 기본: 준비중 화면
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 중등 학생평가</div>
      <div class="page-header-title">📊 중등 학생평가</div>
      <div class="page-header-desc">학생평가 운영 전반을 안내하는 길라잡이</div>
      <div style="height:1.2rem;"></div>
    </div>
    <div class="coming-soon-section">
      <div class="coming-soon-icon">🚧</div>
      <div class="coming-soon-title">준비 중입니다</div>
      <div class="coming-soon-desc">
        중등 학생평가 콘텐츠를 구축 중입니다.<br>
        아래 우선 활성화된 메뉴를 먼저 이용해 보세요.
      </div>
      <div class="highlight-menus-grid">
        <div class="highlight-menu-card" onclick="navigateTo('evaluation','neis')">
          <div class="highlight-menu-card-icon">💻</div>
          <div class="highlight-menu-card-title">나이스 성적처리</div>
          <div class="highlight-menu-card-desc">단계별 성적 입력·수정·마감 안내</div>
          <span class="highlight-menu-card-badge">바로가기</span>
        </div>
        <div class="highlight-menu-card" onclick="navigateTo('evaluation','eval-faq')">
          <div class="highlight-menu-card-icon">❓</div>
          <div class="highlight-menu-card-title">학생평가 FAQ</div>
          <div class="highlight-menu-card-desc">자주 묻는 질문 모음</div>
          <span class="highlight-menu-card-badge">바로가기</span>
        </div>
        <div class="highlight-menu-card" onclick="navigateTo('evaluation','qna')">
          <div class="highlight-menu-card-icon">📚</div>
          <div class="highlight-menu-card-title">질의회신 DB</div>
          <div class="highlight-menu-card-desc">현장 질의 및 회신 사례 모음</div>
          <span class="highlight-menu-card-badge">바로가기</span>
        </div>
      </div>
    </div>`;
}

function renderEvalFAQ() {
  return `
    <div class="page-header">
      <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 중등 학생평가 <span>›</span> FAQ</div>
      <div class="page-header-title">❓ 학생평가 FAQ</div>
      <div class="page-header-desc">자주 묻는 질문과 답변</div>
      <div style="height:1.2rem;"></div>
    </div>
    <div style="padding:2rem 2.5rem;">
      <div class="faq-filters">
        <button class="filter-chip active" data-filter="all">전체</button>
        <button class="filter-chip" data-filter="학생평가">학생평가</button>
        <button class="filter-chip" data-filter="나이스">나이스</button>
        <button class="filter-chip" data-filter="교육과정">교육과정</button>
      </div>
      <div class="faq-list">
        ${SITE_DATA.faqs.map(f => renderFaqItem(f)).join('')}
      </div>
    </div>`;
}

function renderQnaDB() {
  return `
    <div class="page-header">
      <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 중등 학생평가 <span>›</span> 질의회신 DB</div>
      <div class="page-header-title">📚 질의회신 DB</div>
      <div class="page-header-desc">현장 질의 및 교육청 회신 사례</div>
      <div style="height:1.2rem;"></div>
    </div>
    <div style="padding:2rem 2.5rem;">
      <div class="alert alert-warning">
        <span class="alert-icon">⚠️</span>
        <span>질의회신 사례는 참고용으로만 활용하세요. 상황에 따라 적용이 달라질 수 있으니 구체적인 사항은 교육지원청에 문의하세요.</span>
      </div>
      <div class="faq-list">
        ${SITE_DATA.qnaCases.map(q => `
          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this.parentElement)">
              <div class="faq-q-label">Q</div>
              <div class="faq-q-text">${q.question}</div>
              <span class="faq-category-badge">${q.category}</span>
              <span class="faq-toggle-icon">▼</span>
            </div>
            <div class="faq-answer">
              <div class="faq-a-label">▶ 회신</div>
              <div class="faq-a-text">${q.answer}</div>
              <div style="margin-top:0.8rem;font-size:0.75rem;color:var(--text-muted)">출처: ${q.source} (${q.date})</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function renderNeisPage() {
  return `
    <div class="page-header">
      <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 중등 학생평가 <span>›</span> 나이스 성적처리</div>
      <div class="page-header-title">💻 나이스 성적처리</div>
      <div class="page-header-desc">나이스 성적 입력·수정·마감 단계별 안내</div>
      <div style="height:1.2rem;"></div>
    </div>
    <div style="padding:2rem 2.5rem;">
      <div class="alert alert-warning">
        <span class="alert-icon">⚠️</span>
        <span>이 페이지는 콘텐츠를 구축 중입니다. 관련 자료는 자료 아카이브의 <strong>서식모음</strong>에서 확인하세요.</span>
      </div>
      <div class="info-card">
        <div class="info-card-title">📋 나이스 성적처리 단계</div>
        <div class="info-card-body">
          <div class="timeline">
            ${[
              ['1단계', '성적 입력', '교과 담당 교사가 나이스에 성적 입력 (수행평가, 지필평가)'],
              ['2단계', '성적 확인', '학년부장 / 교무부장 성적 검토 및 확인'],
              ['3단계', '성적 마감', '교무부장 나이스 성적 마감 처리'],
              ['4단계', '성적 공시', '학생·학부모 성적 열람 및 확인'],
              ['5단계', '이의 처리', '이의 신청 접수 및 처리 후 최종 확정'],
            ].map(([step, title, desc]) => `
              <div class="timeline-item">
                <div class="timeline-step">${step}</div>
                <div class="timeline-title">${title}</div>
                <div class="timeline-desc">${desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="alert alert-info">
        <span class="alert-icon">📎</span>
        <span>세부 처리 방법은 준비 중입니다. 문의사항은 교육지원청 중등교육과로 연락하세요.</span>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════
   6. 자료 아카이브
   ══════════════════════════════════════════════════════════════ */

function renderArchivePage() {
  const container = document.getElementById('archive-content');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 자료 아카이브</div>
      <div class="page-header-title">📂 자료 아카이브</div>
      <div class="page-header-desc">실무 활용도 중심으로 분류된 자료 모음</div>
      <div style="height:1.2rem;"></div>
    </div>
    <div style="padding:2rem 2.5rem;">
      <div class="archive-toolbar">
        <div class="archive-search">
          <span class="search-icon">🔍</span>
          <input type="text" id="archive-search-input" placeholder="자료 검색..." oninput="filterResources(this.value)">
        </div>
        <select class="archive-select" id="archive-cat-filter" onchange="filterResources()">
          <option value="">전체 분류</option>
          ${['정책·지침','연수자료','서식모음','AI·디지털','카드뉴스','인포그래픽','홍보자료','영상자료']
            .map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <select class="archive-select" id="archive-access-filter" onchange="filterResources()">
          <option value="">전체 공개범위</option>
          ${['공개','교사용','업무용'].map(a => `<option value="${a}">${a}</option>`).join('')}
        </select>
      </div>
      <div class="resource-grid" id="resource-grid">
        ${SITE_DATA.resources.map(r => renderResourceCard(r)).join('')}
      </div>
    </div>`;
}

/**
 * 자료 카드 HTML 생성
 */
function renderResourceCard(r) {
  const tagsHtml = (r.tags || []).map(t => `<span class="tag-chip">${t}</span>`).join('');
  const access = r.access || '공개';
  const fileType = r.fileType || 'PDF';
  return `
    <div class="resource-card" data-category="${r.category||''}" data-access="${access}" data-title="${r.title}">
      <div class="resource-card-header">
        <div class="resource-card-title">${r.title}</div>
        <span class="file-type-badge ${fileType}">${fileType}</span>
      </div>
      <div class="resource-card-tags">
        <span class="tag-chip" style="background:var(--accent-light);color:var(--orange)">${r.category || '기타'}</span>
        ${tagsHtml}
      </div>
      <div class="resource-card-footer">
        <div style="display:flex;gap:0.4rem;align-items:center">
          <span class="access-badge ${access}">${access}</span>
          <span class="resource-date">${r.updatedAt || ''}</span>
        </div>
        <a href="${r.link || '#'}" class="resource-link-btn" target="_blank">
          열기 ↗
        </a>
      </div>
    </div>`;
}

/**
 * 자료 아카이브 필터링
 */
function filterResources(searchVal) {
  const grid = document.getElementById('resource-grid');
  if (!grid) return;
  const search = (searchVal !== undefined ? searchVal : document.getElementById('archive-search-input')?.value || '').toLowerCase();
  const cat = document.getElementById('archive-cat-filter')?.value || '';
  const access = document.getElementById('archive-access-filter')?.value || '';

  grid.querySelectorAll('.resource-card').forEach(card => {
    const title = (card.dataset.title || '').toLowerCase();
    const cardCat = card.dataset.category || '';
    const cardAccess = card.dataset.access || '';
    const matchSearch = !search || title.includes(search);
    const matchCat = !cat || cardCat === cat;
    const matchAccess = !access || cardAccess === access;
    card.style.display = (matchSearch && matchCat && matchAccess) ? '' : 'none';
  });
}

/* ══════════════════════════════════════════════════════════════
   7. STORY 페이지
   ══════════════════════════════════════════════════════════════ */

function renderStoryPage() {
  const container = document.getElementById('story-content');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 부천 교육 STORY</div>
      <div class="page-header-title">📖 부천 교육 STORY</div>
      <div class="page-header-desc">왜 시작했는가, 어떻게 발전했는가를 담은 브랜드 기록관</div>
      <div style="height:1.2rem;"></div>
    </div>
    <div style="padding:2rem 2.5rem;">
      <div class="story-grid">
        ${SITE_DATA.stories.map(s => `
          <div class="story-card" onclick="void(0)">
            <div class="story-card-thumb">
              ${{ '공동교육과정': '🔗', '계절학기': '☀️', '미래공감': '🎤' }[s.category] || '📖'}
            </div>
            <div class="story-card-body">
              <div class="story-card-category">${s.category}</div>
              <div class="story-card-title">${s.title}</div>
              <div class="story-card-subtitle">${s.subtitle}</div>
              <div class="story-card-date">${s.date}</div>
            </div>
          </div>
        `).join('')}
        <!-- 스토리 추가 예정 카드 -->
        <div class="story-card" style="opacity:0.5;cursor:default">
          <div class="story-card-thumb" style="background:var(--bg-page)">🚧</div>
          <div class="story-card-body">
            <div class="story-card-category">나눔캠퍼스</div>
            <div class="story-card-title">나눔캠퍼스 STORY</div>
            <div class="story-card-subtitle">준비 중입니다</div>
          </div>
        </div>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════
   8. 검색 기능
   ══════════════════════════════════════════════════════════════ */

function initSearch() {
  const input = document.getElementById('search-input');
  const dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  // 검색어 입력 시
  input.addEventListener('input', debounce(() => {
    const q = input.value.trim();
    if (q.length < 1) { closeSearchDropdown(); return; }
    const results = searchAll(q);
    renderSearchDropdown(results, q);
  }, 200));

  // 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.topnav-search')) closeSearchDropdown();
  });

  // 엔터키
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearchDropdown();
  });
}

/**
 * 전체 데이터 검색
 */
function searchAll(query) {
  const q = query.toLowerCase();
  const results = [];

  // 공지사항
  SITE_DATA.notices.forEach(n => {
    if (n.title.toLowerCase().includes(q)) {
      results.push({ type: '공지', title: n.title, link: n.link, meta: n.date });
    }
  });

  // 자료
  SITE_DATA.resources.forEach(r => {
    if (r.title.toLowerCase().includes(q) || (r.tags || []).join(' ').includes(q)) {
      results.push({ type: '자료', title: r.title, link: r.link, meta: r.category });
    }
  });

  // FAQ
  SITE_DATA.faqs.forEach(f => {
    if (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)) {
      results.push({ type: 'FAQ', title: f.question, link: '#', meta: f.category });
    }
  });

  return results.slice(0, 8);
}

function renderSearchDropdown(results, query) {
  const dropdown = document.getElementById('search-dropdown');
  if (!dropdown) return;

  if (results.length === 0) {
    dropdown.innerHTML = `<div class="search-result-item"><div class="search-result-title">검색 결과가 없습니다</div></div>`;
  } else {
    dropdown.innerHTML = results.map(r => `
      <div class="search-result-item" onclick="void(0)">
        <div class="search-result-title">
          <span style="font-size:0.7rem;background:var(--primary-light);color:var(--primary);padding:1px 5px;border-radius:3px;margin-right:5px">${r.type}</span>
          ${highlight(r.title, query)}
        </div>
        <div class="search-result-meta">${r.meta || ''}</div>
      </div>
    `).join('');
  }

  dropdown.classList.add('open');
}

function closeSearchDropdown() {
  const dropdown = document.getElementById('search-dropdown');
  if (dropdown) dropdown.classList.remove('open');
}

function highlight(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(re, '<mark style="background:#fff9c4;border-radius:2px">$1</mark>');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ══════════════════════════════════════════════════════════════
   9. FAQ 아코디언
   ══════════════════════════════════════════════════════════════ */

function renderFaqItem(f) {
  return `
    <div class="faq-item" data-category="${f.category}">
      <div class="faq-question" onclick="toggleFaq(this.parentElement)">
        <div class="faq-q-label">Q</div>
        <div class="faq-q-text">${f.question}</div>
        <span class="faq-category-badge">${f.category}</span>
        <span class="faq-toggle-icon">▼</span>
      </div>
      <div class="faq-answer">
        <div class="faq-a-label">▶ 답변</div>
        <div class="faq-a-text">${f.answer}</div>
      </div>
    </div>`;
}

function toggleFaq(item) {
  const isOpen = item.classList.contains('open');
  // 같은 리스트 내 모두 닫기
  item.closest('.faq-list')?.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

function initFAQ() {
  // 필터 칩
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const parent = chip.closest('.faq-filters');
      parent?.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      const list = chip.closest('div')?.nextElementSibling;
      if (!list) return;
      list.querySelectorAll('.faq-item').forEach(item => {
        const cat = item.dataset.category || '';
        item.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   탭 시스템
   ══════════════════════════════════════════════════════════════ */

function initTabs(tabsId) {
  const tabsNav = document.getElementById(tabsId);
  if (!tabsNav) return;

  tabsNav.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activateTab(btn.dataset.tab);
    });
  });
}

function activateTab(tabId) {
  if (!tabId) return;
  // 모든 탭 콘텐츠 숨기기
  document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
  // 모든 탭 버튼 비활성화
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  // 대상 활성화
  const content = document.getElementById(`tab-${tabId}`);
  if (content) content.classList.add('active');
  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');

  AppState.currentTab = tabId;
}

/* ══════════════════════════════════════════════════════════════
   체크리스트
   ══════════════════════════════════════════════════════════════ */

function toggleCheck(item) {
  const checkbox = item.querySelector('input[type="checkbox"]');
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    item.classList.toggle('checked', checkbox.checked);
  }
}

function initChecklist() {
  document.querySelectorAll('.checklist-item input').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.closest('.checklist-item').classList.toggle('checked', cb.checked);
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   모바일 메뉴
   ══════════════════════════════════════════════════════════════ */

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
      overlay?.classList.toggle('open');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileSidebar);
  }
}

function closeMobileSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('open');
}

/* ══════════════════════════════════════════════════════════════
   인쇄/PDF 저장
   ══════════════════════════════════════════════════════════════ */

function printPage() {
  window.print();
}

/* ══════════════════════════════════════════════════════════════
   공통 유틸리티
   ══════════════════════════════════════════════════════════════ */

/**
 * 디바운스 함수
 */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ══════════════════════════════════════════════════════════════
   11. 구글시트 DB 연동 (향후 활용)
   ══════════════════════════════════════════════════════════════ */

/**
 * 구글시트 공개 CSV URL에서 데이터 로드
 * 사용 방법:
 *   1. 구글시트 → 파일 → 웹에 게시 → CSV 선택 후 시트별 URL 복사
 *   2. 아래 함수 호출: loadFromGoogleSheet('YOUR_CSV_URL', 'notices')
 *   3. 데이터 파싱 후 SITE_DATA[key]에 주입하고 해당 페이지 재렌더링
 *
 * @param {string} csvUrl - 구글시트 CSV 공개 URL
 * @param {string} dataKey - SITE_DATA의 키 (notices, resources, faqs 등)
 */
async function loadFromGoogleSheet(csvUrl, dataKey) {
  try {
    const response = await fetch(csvUrl);
    const text = await response.text();
    const rows = text.trim().split('\n').map(r => r.split(',').map(c => c.replace(/^"|"$/g, '').trim()));
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] || ''; });
      return obj;
    });
    SITE_DATA[dataKey] = data;
    console.log(`[구글시트 연동] ${dataKey} 데이터 로드 완료:`, data.length, '건');
    return data;
  } catch (err) {
    console.error('[구글시트 연동] 로드 실패:', err);
    return null;
  }
}

// 전역 노출 (HTML onclick에서 사용)
window.navigateTo = navigateTo;
window.toggleFaq = toggleFaq;
window.toggleCheck = toggleCheck;
window.filterResources = filterResources;
window.printPage = printPage;
