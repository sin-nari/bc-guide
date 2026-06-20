/**
 * 부천형 고등학교 교육과정·학생평가 길라잡이 — 메인 스크립트 v4.0
 * ─────────────────────────────────────────────────────────────────
 * 변경 이력 v4.0:
 *  - 기존 v3 모든 기능 완전 보존
 *  - 사이트맵 완전 복구: 고등학교 교육과정 9개 / 학생평가 8개 메뉴
 *  - 준비중 메뉴: 완전 숨김 → 준비중 표시로 복원 (업무 구조 보존)
 *  - 상황별 처리 하위 메뉴 (전입생/위탁학생/인정점/기타 사례) 복구
 *  - 나눔캠퍼스 하위 메뉴 (전문가특강/창의융합) 복구
 *  - STORY 메뉴 완전 복구 (7개 항목)
 *  - 검색: 출처유형·공개범위 필터 추가
 *  - 외부 링크 섹션: 구글드라이브·폼·시트 포함
 */

'use strict';

const AppState = { currentPage:'home', currentSubMenu:null, currentTab:null };

/* ══════════════════════════════════════════════════════════════
   1. 초기화
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initSearch();
  navigateTo('home');
});

/* ══════════════════════════════════════════════════════════════
   2. 네비게이션 / 사이드바
      ★ 준비중 메뉴는 숨기지 않고, 시각적으로 구분하여 표시합니다.
      ★ 업무 구조 보존 원칙에 따라 모든 메뉴 항목 유지.
   ══════════════════════════════════════════════════════════════ */
function initNavigation() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(el.dataset.page, el.dataset.submenu||null, el.dataset.tab||null);
    });
  });
}

function navigateTo(page, subMenu=null, tab=null) {
  AppState.currentPage = page;
  AppState.currentSubMenu = subMenu;

  document.querySelectorAll('.page-view').forEach(v => v.classList.remove('active'));
  document.getElementById(`page-${page}`)?.classList.add('active');

  document.querySelectorAll('.topnav-menu a').forEach(a =>
    a.classList.toggle('active', a.dataset.page === page));

  renderSidebar(page, subMenu);
  if (tab) activateTab(tab);

  switch(page) {
    case 'home':       renderHome();                   break;
    case 'curriculum': renderCurriculumPage(subMenu);  break;
    case 'evaluation': renderEvaluationPage(subMenu);  break;
    case 'qna':        renderQnaPage(subMenu);         break;
    case 'archive':    renderArchivePage(subMenu);     break;
    case 'story':      renderStoryPage(subMenu);       break;
  }
  closeMobileSidebar();
  document.getElementById('main-content')?.scrollTo(0,0);
}

/* ── 사이트맵 완전 복구 ──────────────────────────────────────
   ready: false 항목도 모두 표시하되, 'soon' 뱃지로 구분.
   extLink: true 항목은 '↗' 뱃지로 구분.
   ─────────────────────────────────────────────────────────── */
const SIDEBAR_CONFIG = {
  home: { title:'', items:[] },

  curriculum: {
    title: '고등학교 교육과정',
    items: [
      { id:'credit',     label:'고교학점제',              icon:'🎓', ready:false },
      {
        id:'planning',   label:'교육과정 편성·운영',       icon:'📋', ready:true,
        children:[
          {id:'planning-overview', label:'운영 개요',         tab:'overview'},
          {id:'planning-notice',   label:'편성 유의사항',      tab:'notice'},
          {id:'planning-check',    label:'학교별 체크리스트',  tab:'checklist'},
          {id:'planning-refs',     label:'참고자료',           tab:'refs'},
          {id:'planning-faq',      label:'FAQ',               tab:'faq'},
        ]
      },
      {
        id:'consulting', label:'교육과정 편성 컨설팅',      icon:'🗂️', ready:true,
        children:[
          {id:'consulting-overview',   label:'컨설팅 개요',      tab:'overview'},
          {id:'consulting-schedule',   label:'일정 및 대상',     tab:'schedule'},
          {id:'consulting-checkpoint', label:'컨설팅 체크포인트', tab:'checkpoint'},
          {id:'consulting-refs',       label:'자료실',           tab:'refs'},
          {id:'consulting-faq',        label:'FAQ',             tab:'faq'},
        ]
      },
      { id:'joint',      label:'부천형 공동교육과정',       icon:'🔗', ready:true, extLink:true },
      { id:'seasonal',   label:'부천형 계절학기',           icon:'🌞', ready:true, extLink:true },
      { id:'special',    label:'교과특성화학교',            icon:'⭐', ready:false },
      {
        id:'campus',     label:'나눔캠퍼스',                icon:'🏫', ready:false,
        children:[
          {id:'campus-lecture', label:'전문가 특강',          tab:''},
          {id:'campus-project', label:'창의융합 프로젝트 공유학교', tab:''},
        ]
      },
      { id:'expo',       label:'미래공감 설명회',           icon:'🎤', ready:false },
      { id:'minachieve', label:'최소 성취수준 보장지도',    icon:'📊', ready:false },
    ]
  },

  evaluation: {
    title: '중등 학생평가',
    items: [
      { id:'eval-overview', label:'평가 운영',          icon:'📋', ready:false },
      { id:'exam',          label:'정기고사',            icon:'📝', ready:false },
      { id:'performance',   label:'수행평가',            icon:'✏️',  ready:false },
      { id:'neis',          label:'나이스 성적처리',     icon:'💻', ready:true, highlight:true },
      { id:'committee',     label:'학업성적관리위원회',  icon:'🏛️', ready:false },
      {
        id:'cases',         label:'상황별 처리',         icon:'📂', ready:false,
        children:[
          {id:'cases-transfer',  label:'전입생',    tab:''},
          {id:'cases-consign',   label:'위탁학생',  tab:''},
          {id:'cases-credit',    label:'인정점',    tab:''},
          {id:'cases-etc',       label:'기타 사례', tab:''},
        ]
      },
      { id:'eval-faq',      label:'FAQ',               icon:'❓', ready:true, highlight:true },
      { id:'eval-qna',      label:'질의회신 DB',        icon:'📚', ready:true, highlight:true },
    ]
  },

  qna: {
    title: '질의회신 DB',
    items: [
      { id:'qna-all',        label:'전체',     icon:'📚', ready:true },
      { id:'qna-eval',       label:'학생평가', icon:'📊', ready:true },
      { id:'qna-curriculum', label:'교육과정', icon:'📋', ready:true },
      { id:'qna-neis',       label:'나이스',   icon:'💻', ready:true },
    ]
  },

  archive: {
    title: '자료 아카이브',
    items: [
      { id:'policy',      label:'정책·지침',   icon:'📜', ready:true },
      { id:'training',    label:'연수자료',    icon:'🎓', ready:true },
      { id:'forms',       label:'서식모음',    icon:'📄', ready:true },
      { id:'ai',          label:'AI·디지털',  icon:'🤖', ready:true },
      { id:'cardnews',    label:'카드뉴스',   icon:'🗞️',  ready:true },
      { id:'infographic', label:'인포그래픽', icon:'📊', ready:true },
      { id:'pr',          label:'홍보자료',   icon:'📣', ready:true },
      { id:'video',       label:'영상자료',   icon:'🎬', ready:true },
    ]
  },

  story: {
    title: '부천 교육 STORY',
    items: [
      { id:'joint-story',    label:'공동교육과정 STORY',  icon:'🔗', ready:true },
      { id:'seasonal-story', label:'계절학기 STORY',      icon:'☀️', ready:true },
      { id:'expo-story',     label:'미래공감 설명회 STORY',icon:'🎤', ready:true },
      { id:'campus-story',   label:'나눔캠퍼스 STORY',    icon:'🏫', ready:false },
      { id:'results',        label:'운영 성과',            icon:'📈', ready:false },
      { id:'cardnews-story', label:'카드뉴스',             icon:'🗞️',  ready:false },
      { id:'press',          label:'보도자료',             icon:'📰', ready:false },
    ]
  }
};

function renderSidebar(page, subMenu) {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  const cfg = SIDEBAR_CONFIG[page];
  if (!cfg || !cfg.items.length) { nav.innerHTML=''; return; }

  let html = cfg.title ? `<div class="sidebar-section-header">${cfg.title}</div>` : '';

  cfg.items.forEach(item => {
    const isActive   = subMenu === item.id;
    const hlClass    = item.highlight ? ' hl-item' : '';
    const hlBadge    = item.highlight ? '<span class="hl-badge">★</span>' : '';
    const soonBadge  = !item.ready && !item.extLink
      ? '<span class="sidebar-soon">준비중</span>' : '';
    const extBadge   = item.extLink
      ? '<span class="sidebar-ext">↗</span>' : '';

    if (item.children?.length) {
      const childActive = item.children.some(c => c.id === subMenu);
      const disabledAttr = !item.ready ? ' data-soon="true"' : '';
      html += `
        <div class="sidebar-nav-item sidebar-parent${isActive||childActive?' active':''}${hlClass}${!item.ready?' sidebar-item-soon':''}"
             data-target="sub-${item.id}"${disabledAttr}>
          <span class="item-icon">${item.icon}</span>
          <span class="item-label">${item.label}</span>
          ${soonBadge}
          <span class="sidebar-toggle-icon${childActive?' rotated':''}">▶</span>
        </div>
        <div class="sidebar-submenu${childActive?' open':''}" id="sub-${item.id}">
          ${item.children.map(c => `
            <div class="sidebar-nav-item${subMenu===c.id?' active':''}${!item.ready?' sidebar-item-soon':''}"
                 data-page="${page}" data-submenu="${c.id}" data-tab="${c.tab||''}">
              ${c.label}${!item.ready?'<span class="sidebar-soon" style="margin-left:auto">준비중</span>':''}
            </div>`).join('')}
        </div>`;
    } else {
      html += `
        <div class="sidebar-nav-item${isActive?' active':''}${hlClass}${!item.ready?' sidebar-item-soon':''}"
             data-page="${page}" data-submenu="${item.id}">
          <span class="item-icon">${item.icon}</span>
          <span class="item-label">${item.label}</span>${hlBadge}${soonBadge}${extBadge}
        </div>`;
    }
  });

  nav.innerHTML = html;

  nav.querySelectorAll('[data-page]').forEach(el =>
    el.addEventListener('click', () =>
      navigateTo(el.dataset.page, el.dataset.submenu||null, el.dataset.tab||null)));

  nav.querySelectorAll('.sidebar-parent').forEach(el => {
    el.addEventListener('click', () => {
      const sub  = document.getElementById(el.dataset.target);
      const icon = el.querySelector('.sidebar-toggle-icon');
      if (!sub) return;
      const was = sub.classList.contains('open');
      nav.querySelectorAll('.sidebar-submenu.open').forEach(s=>s.classList.remove('open'));
      nav.querySelectorAll('.sidebar-toggle-icon.rotated').forEach(i=>i.classList.remove('rotated'));
      if (!was) { sub.classList.add('open'); icon?.classList.add('rotated'); }
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   3. 홈 (v3 보존 + quickLinks 8개 복원)
   ══════════════════════════════════════════════════════════════ */
function renderHome() {
  renderTodayBanner();
  renderNoticeTicker();
  renderQuickLinks();
  renderSeasons();
  renderNoticeTable();
  renderExternalLinksHome();
}

function renderTodayBanner() {
  const wrap = document.getElementById('today-banner-wrap');
  if (!wrap) return;
  const cfg = SITE_CONFIG;
  if (!cfg.bannerActive) { wrap.style.display='none'; return; }
  wrap.style.display='';
  wrap.innerHTML = `
    <div class="today-banner">
      <div class="today-banner-icon">📅</div>
      <div class="today-banner-body">
        <div class="today-banner-label">📍 ${cfg.bannerDate} 오늘의 바로가기</div>
        <div class="today-banner-title">${cfg.bannerTitle}</div>
        <div class="today-banner-desc">${cfg.bannerDesc}</div>
      </div>
      <button class="today-banner-btn"
              onclick="navigateTo('${cfg.bannerPage}','${cfg.bannerSubMenu}')">
        바로가기 →
      </button>
      <button class="today-banner-close" onclick="dismissBanner()" title="닫기">✕</button>
    </div>`;
}

function dismissBanner() {
  const wrap = document.getElementById('today-banner-wrap');
  if (wrap) wrap.style.display='none';
}

function renderNoticeTicker() {
  const track = document.getElementById('notice-ticker-track');
  if (!track) return;
  track.innerHTML = SITE_DATA.notices.map(n =>
    `<span class="notice-ticker-item">
      ${n.important?'<span class="imp">★</span> ':''}${n.title}
    </span>`).join('');
}

function renderQuickLinks() {
  const grid = document.getElementById('quick-grid');
  if (!grid) return;
  grid.innerHTML = SITE_DATA.quickLinks.map(q => `
    <div class="quick-card${q.highlight?' highlight':''}"
         style="border-top:3px solid var(--${q.color||'primary'})"
         onclick="navigateTo('${q.page}','${q.submenu||''}')">
      <div class="quick-card-icon">${q.icon}</div>
      <div class="quick-card-title">${q.title}</div>
      <div class="quick-card-desc">${q.desc}</div>
      <div class="quick-card-arrow">바로가기 →</div>
    </div>`).join('');
}

function renderSeasons() {
  const grid = document.getElementById('season-grid');
  if (!grid) return;
  grid.innerHTML = SITE_DATA.seasons.map(s => `
    <div class="season-card">
      <div class="season-card-header">
        <span class="season-icon">${s.icon}</span>
        <span class="season-label">${s.label}</span>
      </div>
      <div class="season-links">
        ${s.items.map(i=>`
          <span class="season-link" onclick="navigateTo('${i.page}','${i.submenu||''}')">
            ${i.title}
          </span>`).join('')}
      </div>
    </div>`).join('');
}

function renderNoticeTable() {
  const tb = document.getElementById('notice-tbody');
  if (!tb) return;
  tb.innerHTML = SITE_DATA.notices.map(n => `
    <div class="notice-row">
      <div class="notice-row-title">
        ${n.important?'<span class="notice-badge important">중요</span>':''}
        <span class="notice-badge tag">${n.tag}</span>
        <a href="${n.link}">${n.title}</a>
      </div>
      <div></div>
      <div class="notice-row-date">${n.date}</div>
    </div>`).join('');
}

/* 홈 하단 외부 링크 섹션 */
function renderExternalLinksHome() {
  const wrap = document.getElementById('ext-links-home');
  if (!wrap) return;
  wrap.innerHTML = SITE_DATA.externalLinks.map(e => `
    <a href="${e.link}" target="_blank" class="ext-link-mini"
       title="${e.desc}">
      <span class="ext-link-mini-icon">${e.icon}</span>
      <span class="ext-link-mini-title">${e.title}</span>
      <span class="access-badge ${e.access}" style="margin-left:auto;flex-shrink:0">${e.access}</span>
    </a>`).join('');
}

/* ══════════════════════════════════════════════════════════════
   4. 교육과정 — 모든 메뉴 유지 (준비중 안내 포함)
   ══════════════════════════════════════════════════════════════ */
function renderCurriculumPage(subMenu) {
  const c = document.getElementById('curriculum-content');
  if (!c) return;

  if (!subMenu) { c.innerHTML = renderCurriculumHome(); return; }
  if (subMenu.startsWith('planning')) {
    c.innerHTML = renderPlanningPage();
    initTabs('planning-tabs');
    const m = {'planning-notice':'notice','planning-check':'checklist',
               'planning-refs':'refs','planning-faq':'faq'};
    activateTab(m[subMenu]||'overview');
    initFAQ(); initChecklist(); return;
  }
  if (subMenu.startsWith('consulting')) {
    c.innerHTML = renderConsultingPage();
    initTabs('consulting-tabs');
    const m = {'consulting-schedule':'schedule','consulting-checkpoint':'checkpoint',
               'consulting-refs':'refs','consulting-faq':'faq'};
    activateTab(m[subMenu]||'overview');
    initFAQ(); return;
  }
  if (subMenu === 'joint')    { c.innerHTML = renderExtLinkPage('joint');    return; }
  if (subMenu === 'seasonal') { c.innerHTML = renderExtLinkPage('seasonal'); return; }

  // 준비중 메뉴 — 이름 표시 + 안내
  const labelMap = {
    credit:'고교학점제', special:'교과특성화학교',
    campus:'나눔캠퍼스', 'campus-lecture':'전문가 특강',
    'campus-project':'창의융합 프로젝트 공유학교',
    expo:'미래공감 설명회', minachieve:'최소 성취수준 보장지도'
  };
  c.innerHTML = renderComingSoon(labelMap[subMenu]||subMenu, 'curriculum');
}

function renderCurriculumHome() {
  return `
  <div class="page-header">
    <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 고등학교 교육과정</div>
    <div class="page-header-title">📚 고등학교 교육과정</div>
    <div class="page-header-desc">고교학점제 기반 교육과정 편성·운영의 모든 것</div>
    <div style="height:1.1rem"></div>
  </div>
  <div style="padding:1.8rem 2.5rem">
    <div class="alert alert-info">
      <span class="alert-icon">ℹ️</span>
      <span>
        <strong>교육과정 편성·운영</strong>과 <strong>교육과정 편성 컨설팅</strong>이 우선 활성화되어 있습니다.
        공동교육과정·계절학기는 외부 길라잡이로 연결됩니다.
      </span>
    </div>
    <div class="section-header"><span class="section-title">⚡ 활성화 메뉴</span></div>
    <div class="quick-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));margin-bottom:1.8rem">
      ${[
        {icon:'📋', title:'교육과정 편성·운영',      sub:'planning',   color:'blue',   desc:'편성 절차·유의사항·체크리스트'},
        {icon:'🗂️', title:'교육과정 편성 컨설팅',     sub:'consulting', color:'indigo', desc:'일정·대상·컨설팅 체크포인트'},
        {icon:'🔗', title:'부천형 공동교육과정',      sub:'joint',      color:'teal',   desc:'공동교육과정 길라잡이 ↗'},
        {icon:'🌞', title:'부천형 계절학기',          sub:'seasonal',   color:'orange', desc:'계절학기 길라잡이 ↗'},
      ].map(c=>`
        <div class="quick-card" style="border-top:3px solid var(--${c.color})"
             onclick="navigateTo('curriculum','${c.sub}')">
          <div class="quick-card-icon">${c.icon}</div>
          <div class="quick-card-title">${c.title}</div>
          <div class="quick-card-desc">${c.desc}</div>
          <div class="quick-card-arrow">바로가기 →</div>
        </div>`).join('')}
    </div>
    <div class="section-header">
      <span class="section-title">🚧 준비 중 메뉴</span>
      <span class="section-subtitle">콘텐츠 구축 후 순차 공개</span>
    </div>
    <div class="coming-soon-grid">
      ${[
        {icon:'🎓', label:'고교학점제', sub:'credit'},
        {icon:'⭐', label:'교과특성화학교', sub:'special'},
        {icon:'🏫', label:'나눔캠퍼스', sub:'campus'},
        {icon:'🎤', label:'미래공감 설명회', sub:'expo'},
        {icon:'📊', label:'최소 성취수준 보장지도', sub:'minachieve'},
      ].map(m=>`
        <div class="soon-chip" onclick="navigateTo('curriculum','${m.sub}')">
          ${m.icon} ${m.label}
        </div>`).join('')}
    </div>
    <div class="section-header" style="margin-top:2rem"><span class="section-title">🔗 외부 길라잡이 연결</span></div>
    <div class="ext-link-grid">
      ${SITE_DATA.externalLinks.map(e=>`
        <div class="ext-link-card">
          <div class="ext-link-icon">${e.icon}</div>
          <div class="ext-link-title">${e.title}</div>
          <div class="ext-link-desc">${e.desc}</div>
          <a href="${e.link}" target="_blank" class="ext-link-btn">열기 ↗</a>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderPlanningPage() {
  const faqHtml = SITE_DATA.faqs.filter(f=>f.대분류==='교육과정').map(f=>renderFaqItem(f)).join('');
  return `
  <div class="page-header">
    <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 고등학교 교육과정 <span>›</span> 교육과정 편성·운영</div>
    <div class="page-header-title">📋 교육과정 편성·운영</div>
    <div class="page-header-desc">2026~2027학년도 고등학교 교육과정 편성·운영 안내</div>
    <div class="tab-nav" id="planning-tabs">
      <button class="tab-btn" data-tab="overview">운영 개요</button>
      <button class="tab-btn" data-tab="notice">편성 유의사항</button>
      <button class="tab-btn" data-tab="checklist">학교별 체크리스트</button>
      <button class="tab-btn" data-tab="refs">참고자료</button>
      <button class="tab-btn" data-tab="faq">FAQ</button>
    </div>
  </div>
  <div class="tab-content" id="tab-overview">
    <div class="alert alert-info">
      <span class="alert-icon">📌</span>
      <span>2026학년도부터 고교학점제 전환 학교는 <strong>총 192학점</strong> 기준을 적용합니다.</span>
    </div>
    <div class="two-col">
      <div class="info-card">
        <div class="info-card-title">🎯 편성 목적 및 원칙</div>
        <div class="info-card-body">
          <p>학생의 진로와 적성에 맞는 맞춤형 교육과정을 편성합니다.</p>
          <ul style="margin-top:.6rem;padding-left:1rem;list-style:disc;font-size:.85rem;color:var(--text-secondary);display:flex;flex-direction:column;gap:.3rem">
            <li>학생 선택 중심 교육과정 편성</li>
            <li>교과(군)별 필수 이수 학점 준수</li>
            <li>학교 여건에 맞는 자율 편성 확대</li>
            <li>지역 협력 공동교육과정 연계</li>
          </ul>
        </div>
      </div>
      <div class="info-card">
        <div class="info-card-title">📅 2026~2027 편성 일정</div>
        <div class="info-card-body">
          <div class="timeline">
            ${[
              ['2026. 1~2월','수요 조사 및 개설 과목 결정','학생 수강 신청 수요 조사, 2027학년도 개설 과목 검토'],
              ['2026. 2~3월','교육과정 편성 컨설팅','부천교육지원청 방문 컨설팅 및 학교 간 상호 컨설팅'],
              ['2026. 3월','2026학년도 교육과정 공시 및 운영','학교 홈페이지 공시 후 교육과정 운영 시작'],
              ['2026. 12월','2027학년도 수요 조사 시작','차년도 교육과정 편성을 위한 사전 수요 조사'],
            ].map(([s,t,d])=>`
              <div class="timeline-item">
                <div class="timeline-step">${s}</div>
                <div class="timeline-title">${t}</div>
                <div class="timeline-desc">${d}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="info-card">
      <div class="info-card-title">📐 이수 학점 구조 (고교학점제 전환 학교)</div>
      <div class="info-card-body">
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:.84rem">
            <thead><tr style="background:var(--primary-light)">
              ${['구분','필수 이수 학점','학교 자율 학점','합계'].map(h=>
                `<th style="padding:.55rem;border:1px solid var(--border);text-align:left">${h}</th>`).join('')}
            </tr></thead>
            <tbody>
              ${[['교과 영역','84','90','174'],['창의적 체험활동','—','18','18'],['총계','84','108','192']]
                .map((r,i)=>`<tr${i===2?' style="font-weight:700;background:var(--accent-light)"':''}>
                  ${r.map((c,j)=>`<td style="padding:.5rem .55rem;border:1px solid var(--border);${j>0?'text-align:center':''}">${c}</td>`).join('')}
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <p style="margin-top:.5rem;font-size:.78rem;color:var(--text-muted)">
          ※ 근거: 경기도교육청 고등학교 교육과정 편성·운영 지침(2026) p.8
        </p>
      </div>
    </div>
  </div>
  <div class="tab-content" id="tab-notice">
    <div class="three-col">
      ${[
        {icon:'⚠️',title:'필수 이수 학점',color:'red',
         items:['국어·수학·영어 각 10학점 이상','한국사 6학점 이상 필수','체육·예술·기술가정 등 필수','교과군별 필수 이수 학점 준수']},
        {icon:'📝',title:'학업성적관리규정 반영',color:'blue',
         items:['수행평가 방법·반영 비율 사전 명시','지필평가 횟수·범위 명시','최소 성취수준 보장지도 계획 포함','공동교육과정·계절학기 성적처리 기준']},
        {icon:'✅',title:'교육청 제출 서류',color:'green',
         items:['학교 교육과정 편성·운영 계획서','교과별 이수 학점 배당표','창의적 체험활동 편성 계획','학업성적관리규정(개정 시)']},
      ].map(card=>`
        <div class="info-card" style="border-top:3px solid var(--${card.color})">
          <div class="info-card-title">${card.icon} ${card.title}</div>
          <div class="info-card-body">
            <ul style="padding-left:1rem;list-style:disc;display:flex;flex-direction:column;gap:.38rem">
              ${card.items.map(i=>`<li>${i}</li>`).join('')}
            </ul>
          </div>
        </div>`).join('')}
    </div>
    <div class="alert alert-warning">
      <span class="alert-icon">⚠️</span>
      <span>근거: 경기도교육청 고등학교 교육과정 편성·운영 지침(2026) pp.3–15 / 학업성적관리 시행지침(2026)</span>
    </div>
  </div>
  <div class="tab-content" id="tab-checklist">
    <div class="info-card">
      <div class="info-card-title">✅ 교육과정 편성 최종 체크리스트</div>
      <div class="info-card-body">
        <p style="margin-bottom:.9rem;font-size:.83rem;color:var(--text-muted)">항목을 클릭하면 완료 처리됩니다.</p>
        <div class="checklist">
          ${['교과(군)별 필수 이수 학점이 충족되었는가?','총 이수 학점(192학점)이 맞는가?',
             '창의적 체험활동 18학점이 편성되었는가?','학생 수강 신청 수요가 반영되었는가?',
             '공동교육과정 연계 과목이 확인되었는가?','학업성적관리규정에 평가 계획이 반영되었는가?',
             '수행평가 반영 비율이 교과별로 명시되었는가?','최소 성취수준 보장지도 계획이 포함되었는가?',
             '교육청 제출 서류가 모두 준비되었는가?','학교 홈페이지 공시 일정이 확인되었는가?']
            .map((item,i)=>`
              <div class="checklist-item" onclick="toggleCheck(this)">
                <input type="checkbox" id="chk-${i}" onclick="event.stopPropagation()">
                <label for="chk-${i}">${item}</label>
              </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
  <div class="tab-content" id="tab-refs">
    <div class="resource-grid">
      ${SITE_DATA.resources.filter(r=>r.중분류==='교육과정'||r.중분류==='공동교육과정')
        .map(r=>renderResourceCard(r)).join('')}
    </div>
  </div>
  <div class="tab-content" id="tab-faq">
    <div class="faq-list">${faqHtml}</div>
  </div>`;
}

function renderConsultingPage() {
  const faqHtml = SITE_DATA.faqs.filter(f=>f.대분류==='교육과정').map(f=>renderFaqItem(f)).join('');
  return `
  <div class="page-header">
    <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 고등학교 교육과정 <span>›</span> 교육과정 편성 컨설팅</div>
    <div class="page-header-title">🗂️ 교육과정 편성 컨설팅</div>
    <div class="page-header-desc">2027학년도 학교 교육과정 편성 컨설팅 안내 (2026년 시행)</div>
    <div class="tab-nav" id="consulting-tabs">
      <button class="tab-btn" data-tab="overview">컨설팅 개요</button>
      <button class="tab-btn" data-tab="schedule">일정 및 대상</button>
      <button class="tab-btn" data-tab="checkpoint">컨설팅 체크포인트</button>
      <button class="tab-btn" data-tab="refs">자료실</button>
      <button class="tab-btn" data-tab="faq">FAQ</button>
    </div>
  </div>
  <div class="tab-content" id="tab-overview">
    <div class="two-col">
      <div class="info-card">
        <div class="info-card-title">🎯 컨설팅 목적</div>
        <div class="info-card-body">
          <p>2027학년도 학교 교육과정 편성의 적합성을 함께 검토하고 학교별 여건에 맞는 교육과정 운영을 지원합니다.</p>
          <br><p><strong>운영 방식</strong></p>
          <ul style="margin-top:.5rem;padding-left:1rem;list-style:disc;font-size:.86rem;color:var(--text-secondary);display:flex;flex-direction:column;gap:.3rem">
            <li>교육지원청 → 학교 방문 컨설팅</li>
            <li>학교 간 상호 컨설팅</li>
            <li>권역별 집합 컨설팅</li>
          </ul>
        </div>
      </div>
      <div class="info-card">
        <div class="info-card-title">📋 준비 자료</div>
        <div class="info-card-body">
          <ul style="padding-left:1rem;list-style:disc;font-size:.86rem;color:var(--text-secondary);display:flex;flex-direction:column;gap:.38rem">
            <li>2027학년도 교육과정 편성·운영 계획(안)</li>
            <li>교과별 이수 학점 배당표</li>
            <li>학업성적관리규정</li>
            <li>수행평가 계획서</li>
            <li>2026학년도 교육과정 운영 결과</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="tab-content" id="tab-schedule">
    <div class="info-card">
      <div class="info-card-title">📅 2027학년도 교육과정 편성 컨설팅 일정</div>
      <div class="info-card-body">
        <div class="alert alert-warning" style="margin-bottom:.9rem">
          <span class="alert-icon">⚠️</span>
          <span>예정 일정입니다. 개별 학교 일정은 공문으로 별도 안내됩니다.</span>
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:.84rem">
            <thead><tr style="background:var(--primary-light)">
              ${['구분','대상','일정','장소','비고'].map(h=>
                `<th style="padding:.55rem;border:1px solid var(--border);text-align:left">${h}</th>`).join('')}
            </tr></thead>
            <tbody>
              ${[
                ['1차 컨설팅','부천 관내 전 고등학교','2026. 3월','각 학교','2027학년도 편성(안) 확인'],
                ['상호 컨설팅','희망 학교','2026. 4월','참여 학교','학교 간 교류·공유'],
                ['2차 컨설팅','1차 후속 학교','2026. 5월','각 학교','수정 사항 확인'],
                ['최종 확인','전 고등학교','2026. 6월','각 학교','최종 편성 확정'],
              ].map(row=>`<tr>${row.map(c=>`<td style="padding:.5rem .55rem;border:1px solid var(--border)">${c}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="tab-content" id="tab-checkpoint">
    <div class="info-card">
      <div class="info-card-title">🔍 2027학년도 컨설팅 체크포인트</div>
      <div class="info-card-body">
        <div class="checklist">
          ${['[교과 편성] 교과(군)별 필수 이수 학점이 충족되어 있는가?',
             '[교과 편성] 총 이수 학점(192학점)이 올바른가?',
             '[교과 편성] 학생 선택 과목이 충분히 반영되어 있는가?',
             '[공동교육과정] 공동교육과정 연계 과목이 확인되었는가?',
             '[성적 처리] 학업성적관리규정에 평가 방법이 명시되어 있는가?',
             '[성적 처리] 수행평가 비율이 교과별로 명시되어 있는가?',
             '[공동교육과정] 공동교육과정 성적 처리 기준이 규정에 반영되어 있는가?',
             '[최소 성취수준] 최소 성취수준 보장지도 계획이 수립되어 있는가?',
             '[서류] 교육청 제출 서류가 모두 준비되어 있는가?']
            .map((item,i)=>`
              <div class="checklist-item" onclick="toggleCheck(this)">
                <input type="checkbox" id="con-chk-${i}" onclick="event.stopPropagation()">
                <label for="con-chk-${i}">${item}</label>
              </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
  <div class="tab-content" id="tab-refs">
    <div class="resource-grid">
      ${SITE_DATA.resources.filter(r=>r.태그?.includes('컨설팅')||r.태그?.includes('2027'))
        .map(r=>renderResourceCard(r)).join('')}
    </div>
  </div>
  <div class="tab-content" id="tab-faq">
    <div class="faq-list">${faqHtml}</div>
  </div>`;
}

function renderExtLinkPage(subMenu) {
  const map = {joint:'ext1', seasonal:'ext2'};
  const ext = SITE_DATA.externalLinks.find(e=>e.id===map[subMenu]);
  const label = subMenu==='joint'?'부천형 공동교육과정':'부천형 계절학기';
  return `
  <div class="page-header">
    <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 고등학교 교육과정 <span>›</span> ${label}</div>
    <div class="page-header-title">${ext?.icon||'🔗'} ${label}</div>
    <div class="page-header-desc">별도 길라잡이 사이트로 연결됩니다</div>
    <div style="height:1.1rem"></div>
  </div>
  <div style="padding:1.8rem 2.5rem">
    <div class="alert alert-info">
      <span class="alert-icon">ℹ️</span>
      <span>${label} 길라잡이는 별도 사이트에서 운영됩니다. 아래 카드를 클릭해 이동하세요.</span>
    </div>
    ${ext?`
    <div class="ext-link-card" style="max-width:400px">
      <div class="ext-link-icon">${ext.icon}</div>
      <div class="ext-link-title">${ext.title}</div>
      <div class="ext-link-desc">${ext.desc}</div>
      <a href="${ext.link}" target="_blank" class="ext-link-btn">${ext.title} 열기 ↗</a>
    </div>`:''}
    <div class="section-header" style="margin-top:2rem"><span class="section-title">🔗 관련 외부 자료</span></div>
    <div class="ext-link-grid">
      ${SITE_DATA.externalLinks.filter(e=>e.id!==map[subMenu]).map(e=>`
        <div class="ext-link-card">
          <div class="ext-link-icon">${e.icon}</div>
          <div class="ext-link-title">${e.title}</div>
          <div class="ext-link-desc">${e.desc}</div>
          <a href="${e.link}" target="_blank" class="ext-link-btn">열기 ↗</a>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderComingSoon(label, backPage) {
  return `
  <div class="page-header">
    <div class="page-header-breadcrumb">🏠 홈 <span>›</span> ${backPage==='curriculum'?'고등학교 교육과정':'중등 학생평가'}</div>
    <div class="page-header-title">${label}</div>
    <div style="height:1.1rem"></div>
  </div>
  <div class="coming-soon-section">
    <div class="coming-soon-icon">🚧</div>
    <div class="coming-soon-title">콘텐츠 준비 중입니다</div>
    <div class="coming-soon-desc">
      이 메뉴는 현재 콘텐츠를 구축 중입니다.<br>빠른 시일 내에 제공하겠습니다.
    </div>
    <div style="display:flex;gap:.6rem;justify-content:center">
      <button class="btn btn-outline" onclick="navigateTo('${backPage}')">← 상위 메뉴로</button>
      <button class="btn btn-primary" onclick="navigateTo('qna')">질의회신 DB 바로가기</button>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════════
   5. 학생평가 — 모든 메뉴 복구 (준비중 포함)
   ══════════════════════════════════════════════════════════════ */
function renderEvaluationPage(subMenu) {
  const c = document.getElementById('evaluation-content');
  if (!c) return;

  if (subMenu==='neis')     { c.innerHTML=renderNeisPage();    return; }
  if (subMenu==='eval-faq') { c.innerHTML=renderEvalFaqPage(); initFAQ(); return; }
  if (subMenu==='eval-qna') { navigateTo('qna'); return; }

  // 준비중 메뉴들
  const labelMap = {
    'eval-overview':'평가 운영', exam:'정기고사', performance:'수행평가',
    committee:'학업성적관리위원회',
    cases:'상황별 처리', 'cases-transfer':'전입생',
    'cases-consign':'위탁학생', 'cases-credit':'인정점', 'cases-etc':'기타 사례'
  };

  if (subMenu && labelMap[subMenu]) {
    // 전입생·위탁학생·인정점은 질의회신 DB로 연결
    const qnaLinks = {
      'cases-transfer': () => { navigateTo('qna','qna-eval'); },
      'cases-consign':  () => { navigateTo('qna','qna-eval'); },
      'cases-credit':   () => { navigateTo('qna','qna-eval'); },
    };
    if (qnaLinks[subMenu]) {
      c.innerHTML = renderComingSoonWithQna(labelMap[subMenu], subMenu);
      return;
    }
    c.innerHTML = renderComingSoon(labelMap[subMenu], 'evaluation');
    return;
  }

  // 학생평가 홈
  c.innerHTML = `
  <div class="page-header">
    <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 중등 학생평가</div>
    <div class="page-header-title">📊 중등 학생평가</div>
    <div class="page-header-desc">학생평가 운영 전반을 안내하는 길라잡이</div>
    <div style="height:1.1rem"></div>
  </div>
  <div style="padding:1.8rem 2.5rem">
    <div class="alert alert-info">
      <span class="alert-icon">ℹ️</span>
      <span>현재 <strong>나이스 성적처리</strong>, <strong>FAQ</strong>, <strong>질의회신 DB</strong>가 우선 활성화되어 있습니다.</span>
    </div>
    <div class="section-header"><span class="section-title">⚡ 활성화 메뉴</span></div>
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
        <div class="highlight-menu-card-desc">자주 묻는 질문 + 근거 문서</div>
        <span class="highlight-menu-card-badge">바로가기</span>
      </div>
      <div class="highlight-menu-card" onclick="navigateTo('qna')">
        <div class="highlight-menu-card-icon">📚</div>
        <div class="highlight-menu-card-title">질의회신 DB</div>
        <div class="highlight-menu-card-desc">근거 기반 지식 DB</div>
        <span class="highlight-menu-card-badge">바로가기</span>
      </div>
    </div>
    <div class="section-header" style="margin-top:2rem">
      <span class="section-title">🚧 준비 중 메뉴</span>
      <span class="section-subtitle">콘텐츠 구축 후 순차 공개</span>
    </div>
    <div class="coming-soon-grid">
      ${[
        {icon:'📋', label:'평가 운영', sub:'eval-overview'},
        {icon:'📝', label:'정기고사', sub:'exam'},
        {icon:'✏️', label:'수행평가', sub:'performance'},
        {icon:'🏛️', label:'학업성적관리위원회', sub:'committee'},
        {icon:'📂', label:'상황별 처리 (전입생·위탁학생·인정점)', sub:'cases'},
      ].map(m=>`
        <div class="soon-chip" onclick="navigateTo('evaluation','${m.sub}')">
          ${m.icon} ${m.label}
        </div>`).join('')}
    </div>
  </div>`;
}

function renderComingSoonWithQna(label, subMenu) {
  // 관련 질의회신 자동 연결
  const relatedQna = {
    'cases-transfer': ['Q007','F005'],
    'cases-consign':  ['Q004'],
    'cases-credit':   ['Q005','F003'],
  };
  const ids = relatedQna[subMenu] || [];
  const relatedItems = [
    ...SITE_DATA.qnaCases.filter(q=>ids.includes(q.ID)),
    ...SITE_DATA.faqs.filter(f=>ids.includes(f.ID))
  ];

  return `
  <div class="page-header">
    <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 중등 학생평가 <span>›</span> 상황별 처리</div>
    <div class="page-header-title">📂 ${label}</div>
    <div style="height:1.1rem"></div>
  </div>
  <div style="padding:1.8rem 2.5rem">
    <div class="alert alert-warning">
      <span class="alert-icon">🚧</span>
      <span>이 페이지는 콘텐츠를 구축 중입니다. 아래 관련 질의회신을 먼저 확인해 보세요.</span>
    </div>
    ${relatedItems.length ? `
    <div class="section-header"><span class="section-title">📚 관련 질의회신</span></div>
    <div class="faq-list">
      ${relatedItems.map(item => item.질문 ? renderFaqItem(item) : '').join('')}
    </div>` : ''}
    <div style="margin-top:1.5rem;display:flex;gap:.6rem">
      <button class="btn btn-outline" onclick="navigateTo('evaluation')">← 학생평가 홈으로</button>
      <button class="btn btn-primary" onclick="navigateTo('qna')">질의회신 DB 전체보기</button>
    </div>
  </div>`;
}

function renderNeisPage() {
  return `
  <div class="page-header">
    <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 중등 학생평가 <span>›</span> 나이스 성적처리</div>
    <div class="page-header-title" style="color:var(--primary)">💻 나이스 성적처리</div>
    <div class="page-header-desc">나이스 성적 입력·수정·마감 단계별 안내 (2026학년도)</div>
    <div style="height:1.1rem"></div>
  </div>
  <div style="padding:1.8rem 2.5rem">
    <div class="two-col">
      <div class="info-card">
        <div class="info-card-title">📋 나이스 성적처리 단계</div>
        <div class="info-card-body">
          <div class="timeline">
            ${[['1단계','성적 입력','교과 담당 교사가 지필·수행평가 성적 나이스 입력'],
               ['2단계','성적 확인','학년부장·교무부장 검토 및 확인'],
               ['3단계','성적 마감','교무부장 나이스 성적 마감 처리'],
               ['4단계','성적 공시','학생·학부모 성적 열람 및 확인'],
               ['5단계','이의 처리','이의 신청 접수·처리 후 최종 확정']]
              .map(([s,t,d])=>`
                <div class="timeline-item">
                  <div class="timeline-step">${s}</div>
                  <div class="timeline-title">${t}</div>
                  <div class="timeline-desc">${d}</div>
                </div>`).join('')}
          </div>
        </div>
      </div>
      <div>
        <div class="info-card">
          <div class="info-card-title">⚠️ 마감 후 성적 수정 절차</div>
          <div class="info-card-body">
            <div class="timeline">
              ${[['확인','오기 발견','담당 교사 → 교무부장 보고'],
                 ['준비','서류 준비','정정사유서 + 증빙서류 작성'],
                 ['신청','공문 발송','교무부장 → 교육지원청 공문 제출'],
                 ['승인','처리','교육지원청 승인 후 나이스 수정']]
                .map(([s,t,d])=>`
                  <div class="timeline-item">
                    <div class="timeline-step">${s}</div>
                    <div class="timeline-title">${t}</div>
                    <div class="timeline-desc">${d}</div>
                  </div>`).join('')}
            </div>
            <div class="alert alert-info" style="margin-top:.9rem">
              <span class="alert-icon">📎</span>
              <span>근거: 경기도교육청 학업성적관리 시행지침(2026) pp.48–50</span>
            </div>
          </div>
        </div>
        <div class="info-card">
          <div class="info-card-title">📞 문의처</div>
          <div class="info-card-body">
            부천교육지원청 중등교육지원과<br>교육과정·학생평가 담당
          </div>
        </div>
      </div>
    </div>
    <div class="section-header" style="margin-top:.5rem"><span class="section-title">📚 관련 질의회신</span></div>
    <div class="faq-list">
      ${SITE_DATA.qnaCases.filter(q=>q.대분류==='나이스').map(q=>renderFaqItem(q)).join('')}
    </div>
    <div class="section-header" style="margin-top:1.5rem"><span class="section-title">📂 관련 서식</span></div>
    <div class="resource-grid">
      ${SITE_DATA.resources.filter(r=>r.태그?.includes('나이스')||r.태그?.includes('서식'))
        .map(r=>renderResourceCard(r)).join('')}
    </div>
  </div>`;
}

function renderEvalFaqPage() {
  return `
  <div class="page-header">
    <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 중등 학생평가 <span>›</span> FAQ</div>
    <div class="page-header-title">❓ 학생평가 FAQ</div>
    <div class="page-header-desc">자주 묻는 질문과 근거 문서 안내</div>
    <div style="height:1.1rem"></div>
  </div>
  <div style="padding:1.8rem 2.5rem">
    <div class="faq-filters">
      <button class="filter-chip active" data-filter="all">전체</button>
      <button class="filter-chip" data-filter="학생평가">학생평가</button>
      <button class="filter-chip" data-filter="나이스">나이스</button>
      <button class="filter-chip" data-filter="교육과정">교육과정</button>
    </div>
    <div class="faq-list">${SITE_DATA.faqs.map(f=>renderFaqItem(f)).join('')}</div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════════
   6. 질의회신 DB (v3 기능 완전 보존 + 출처유형 필터 추가)
   ══════════════════════════════════════════════════════════════ */
function renderQnaPage(subMenu) {
  const c = document.getElementById('qna-content');
  if (!c) return;

  const catMap = {'qna-eval':'학생평가','qna-curriculum':'교육과정','qna-neis':'나이스'};
  const activeCat = catMap[subMenu]||'';
  const items = activeCat ? SITE_DATA.qnaCases.filter(q=>q.대분류===activeCat) : SITE_DATA.qnaCases;

  c.innerHTML = `
  <div class="page-header">
    <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 질의회신 DB</div>
    <div class="page-header-title">📚 질의회신 DB</div>
    <div class="page-header-desc">근거 기반 교육과정·학생평가 지식 DB — 답변전문 + 출처유형 포함 (총 ${SITE_DATA.qnaCases.length}건)</div>
    <div style="height:1.1rem"></div>
  </div>
  <div style="padding:1.8rem 2.5rem">
    <div class="alert alert-warning">
      <span class="alert-icon">⚠️</span>
      <span>질의회신 사례는 참고용입니다. 구체적 사항은 부천교육지원청 중등교육지원과에 문의하세요.</span>
    </div>
    <div class="access-legend">
      <span class="access-legend-label">공개범위</span>
      <div class="access-legend-item"><div class="access-legend-dot" style="background:var(--green)"></div>공개</div>
      <div class="access-legend-item"><div class="access-legend-dot" style="background:var(--indigo)"></div>교사용</div>
      <div class="access-legend-item"><div class="access-legend-dot" style="background:var(--purple)"></div>업무용</div>
    </div>
    <div class="faq-filters" id="qna-filters">
      <button class="filter-chip${!activeCat?' active':''}" onclick="filterQnaCards('')">전체 (${SITE_DATA.qnaCases.length})</button>
      ${['학생평가','교육과정','나이스'].map(cat=>{
        const cnt=SITE_DATA.qnaCases.filter(q=>q.대분류===cat).length;
        return `<button class="filter-chip${activeCat===cat?' active':''}" onclick="filterQnaCards('${cat}')">${cat} (${cnt})</button>`;
      }).join('')}
    </div>
    <div class="archive-toolbar">
      <div class="archive-search">
        <span class="search-icon">🔍</span>
        <input type="text" id="qna-search" placeholder="질문·키워드·태그 검색..." oninput="filterQnaCards()">
      </div>
      <select class="archive-select" id="qna-source-filter" onchange="filterQnaCards()">
        <option value="">전체 출처유형</option>
        ${Object.keys(SOURCE_TYPES).map(k=>`<option value="${k}">${k}</option>`).join('')}
      </select>
      <select class="archive-select" id="qna-access-filter" onchange="filterQnaCards()">
        <option value="">전체 공개범위</option>
        <option value="공개">공개</option>
        <option value="교사용">교사용</option>
        <option value="업무용">업무용</option>
      </select>
    </div>
    <div class="qna-grid" id="qna-card-grid">
      ${items.map(q=>renderQnaCard(q)).join('')}
    </div>
  </div>
  <div class="qna-modal-overlay" id="qna-modal-overlay" onclick="closeQnaModal(event)">
    <div class="qna-modal" id="qna-modal"></div>
  </div>`;
}

function sourceTypeBadge(type) {
  const s = SOURCE_TYPES[type];
  if (!s) return '';
  const stars = '★'.repeat(s.grade) + '☆'.repeat(3-s.grade);
  return `<span class="source-badge" style="background:${s.bg};color:${s.color}">
    <span class="source-grade-stars">${stars}</span>${s.label}
  </span>`;
}

function renderQnaCard(q) {
  const access = q.공개범위||'공개';
  const tagHtml = (q.태그||[]).slice(0,3).map(t=>`<span class="tag-chip">${t}</span>`).join('');
  return `
  <div class="qna-card" data-id="${q.ID}" data-cat="${q.대분류}"
       data-source="${q.출처유형||''}" data-access="${access}"
       data-q="${(q.질문||'').replace(/"/g,'&quot;')}"
       onclick="openQnaModal('${q.ID}')">
    <div class="qna-card-header">
      <span class="qna-card-id">${q.ID}</span>
      <div class="qna-card-badges">
        <span class="access-badge ${access}">${access}</span>
        <span class="faq-category-badge">${q.대분류}</span>
      </div>
    </div>
    ${q.출처유형 ? `<div>${sourceTypeBadge(q.출처유형)}</div>` : ''}
    <div class="qna-card-q">${q.질문}</div>
    <div class="qna-card-summary">${q.답변요약}</div>
    <div class="resource-card-tags">${tagHtml}</div>
    <div class="qna-card-footer">
      <span class="qna-card-date">수정: ${q.수정일||'—'}</span>
      <span class="qna-card-more">상세보기 →</span>
    </div>
  </div>`;
}

function openQnaModal(id) {
  const q = SITE_DATA.qnaCases.find(c=>c.ID===id);
  if (!q) return;
  const modal = document.getElementById('qna-modal');
  if (!modal) return;
  const tagHtml = (q.태그||[]).map(t=>`<span class="tag-chip">${t}</span>`).join('');
  const access = q.공개범위||'공개';
  modal.innerHTML = `
  <div class="qna-modal-header">
    <span class="qna-modal-id">${q.ID}</span>
    <div class="qna-modal-title">${q.질문}</div>
    <button class="qna-modal-close" onclick="closeQnaModal()">✕</button>
  </div>
  <div class="qna-modal-body">
    <div class="qna-section">
      <div class="qna-section-label">📋 분류 및 출처</div>
      <div style="display:flex;gap:.38rem;flex-wrap:wrap;margin-bottom:.4rem">
        <span class="access-badge ${access}">${access}</span>
        <span class="faq-category-badge">${q.대분류}</span>
        <span class="faq-category-badge" style="background:var(--teal-light);color:var(--teal)">${q.중분류}</span>
        ${q.출처유형 ? sourceTypeBadge(q.출처유형) : ''}
        ${tagHtml}
      </div>
    </div>
    <div class="qna-section">
      <div class="qna-section-label">❓ 질의</div>
      <div class="qna-section-content" style="font-weight:600">${q.질문}</div>
    </div>
    <div class="qna-section">
      <div class="qna-section-label">💬 답변 요약</div>
      <div class="qna-section-content">${q.답변요약}</div>
    </div>
    ${q.답변전문 ? `
    <div class="qna-section">
      <div class="qna-section-label">📄 답변 전문</div>
      <div class="qna-fulltext-box">${q.답변전문.replace(/\n/g,'<br>').replace(/\[([^\]]+)\]/g,'<strong>[$1]</strong>')}</div>
    </div>` : ''}
    <div class="qna-section">
      <div class="qna-section-label">📑 근거 문서</div>
      <div class="qna-evidence-box">
        <table class="qna-evidence-table">
          <tr><th>근거문서명</th><td>${q.근거문서명||'—'}</td></tr>
          <tr><th>해당 페이지</th><td>${q.해당페이지||'—'}</td></tr>
        </table>
        ${q.실제근거문구&&q.실제근거문구!=='—'?`
        <div class="qna-quote-box">"${q.실제근거문구}"</div>`:''}
      </div>
    </div>
    <div class="qna-section">
      <div class="qna-section-label">🗓️ 이력</div>
      <div style="font-size:.8rem;color:var(--text-muted)">
        작성일: ${q.작성일||'—'} &nbsp;|&nbsp; 최종 수정: ${q.수정일||'—'}
      </div>
    </div>
  </div>
  <div class="qna-modal-footer">
    ${q.링크&&q.링크!=='#'?`<a href="${q.링크}" target="_blank" class="btn btn-outline btn-sm">원문 링크 ↗</a>`:''}
    <button class="btn btn-ghost btn-sm" onclick="closeQnaModal()">닫기</button>
  </div>`;

  document.getElementById('qna-modal-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeQnaModal(e) {
  if (e && e.target!==document.getElementById('qna-modal-overlay')) return;
  document.getElementById('qna-modal-overlay')?.classList.remove('open');
  document.body.style.overflow='';
}

function filterQnaCards(cat) {
  const grid = document.getElementById('qna-card-grid');
  if (!grid) return;

  if (cat!==undefined) {
    document.querySelectorAll('#qna-filters .filter-chip').forEach(c=>{
      const label = c.textContent.trim().replace(/\s*\(\d+\)/,'');
      c.classList.toggle('active', label === (cat||'전체'));
    });
  }

  const activeChip = document.querySelector('#qna-filters .filter-chip.active');
  const activeCat = activeChip
    ? activeChip.textContent.trim().replace(/\s*\(\d+\)/,'') === '전체' ? '' : activeChip.textContent.trim().replace(/\s*\(\d+\)/,'')
    : '';

  const q      = (document.getElementById('qna-search')?.value||'').toLowerCase();
  const source = document.getElementById('qna-source-filter')?.value||'';
  const access = document.getElementById('qna-access-filter')?.value||'';

  let visible = 0;
  grid.querySelectorAll('.qna-card').forEach(card=>{
    const matchCat    = !activeCat || card.dataset.cat===activeCat;
    const matchSource = !source   || card.dataset.source===source;
    const matchAccess = !access   || card.dataset.access===access;
    const matchQ      = !q || card.textContent.toLowerCase().includes(q);
    const show = matchCat&&matchSource&&matchAccess&&matchQ;
    card.style.display=show?'':'none';
    if(show) visible++;
  });

  // 결과 없음 처리
  let noResult = grid.querySelector('.qna-no-result');
  if (!visible) {
    if (!noResult) {
      noResult = document.createElement('div');
      noResult.className = 'qna-no-result';
      noResult.style.cssText = 'grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted);font-size:.9rem';
      noResult.textContent = '검색 결과가 없습니다.';
      grid.appendChild(noResult);
    }
  } else {
    noResult?.remove();
  }
}

/* ══════════════════════════════════════════════════════════════
   7. 자료 아카이브 (v3 보존 + 서브메뉴 필터 추가)
   ══════════════════════════════════════════════════════════════ */
function renderArchivePage(subMenu) {
  const c = document.getElementById('archive-content');
  if (!c) return;

  const catFilter = {
    policy:'정책·지침', training:'연수자료', forms:'서식모음',
    ai:'AI·디지털', cardnews:'카드뉴스', infographic:'인포그래픽',
    pr:'홍보자료', video:'영상자료'
  };
  const preFilter = catFilter[subMenu] || '';

  c.innerHTML = `
  <div class="page-header">
    <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 자료 아카이브${preFilter?' <span>›</span> '+preFilter:''}</div>
    <div class="page-header-title">📂 자료 아카이브</div>
    <div class="page-header-desc">실무 활용도 중심 자료 모음 — 근거 문서 정보 포함</div>
    <div style="height:1.1rem"></div>
  </div>
  <div style="padding:1.8rem 2.5rem">
    <div class="access-legend">
      <span class="access-legend-label">공개범위</span>
      <div class="access-legend-item"><div class="access-legend-dot" style="background:var(--green)"></div>공개</div>
      <div class="access-legend-item"><div class="access-legend-dot" style="background:var(--indigo)"></div>교사용</div>
      <div class="access-legend-item"><div class="access-legend-dot" style="background:var(--purple)"></div>업무용</div>
    </div>
    <div class="archive-toolbar">
      <div class="archive-search">
        <span class="search-icon">🔍</span>
        <input type="text" id="archive-search-input" placeholder="자료 검색..." oninput="filterResources(this.value)">
      </div>
      <select class="archive-select" id="archive-cat-filter" onchange="filterResources()">
        <option value="${preFilter}">${preFilter||'전체 분류'}</option>
        ${['정책·지침','연수자료','서식모음','AI·디지털','카드뉴스','인포그래픽','홍보자료','영상자료']
          .filter(x=>x!==preFilter).map(c=>`<option value="${c}">${c}</option>`).join('')}
        ${preFilter?`<option value="">전체 분류</option>`:''}
      </select>
      <select class="archive-select" id="archive-access-filter" onchange="filterResources()">
        <option value="">전체 공개범위</option>
        ${['공개','교사용','업무용'].map(a=>`<option value="${a}">${a}</option>`).join('')}
      </select>
    </div>
    <div class="resource-grid" id="resource-grid">
      ${SITE_DATA.resources
        .filter(r=> !preFilter || r.대분류===preFilter)
        .map(r=>renderResourceCard(r)).join('')}
    </div>
  </div>`;
}

function renderResourceCard(r) {
  const title   = r.제목||r.title||'';
  const cat     = r.대분류||r.category||'';
  const access  = r.공개범위||r.access||'공개';
  const tags    = r.태그||r.tags||[];
  const link    = r.링크||r.link||'#';
  const date    = r.수정일||r.updatedAt||'';
  const ft      = r.fileType||'PDF';
  const ev      = r.근거문서명&&r.근거문서명!=='—'
    ? `${r.근거문서명}${r.해당페이지&&r.해당페이지!=='—'?' '+r.해당페이지:''}` : '';
  return `
  <div class="resource-card" data-category="${cat}" data-access="${access}" data-title="${title}">
    <div class="resource-card-header">
      <div class="resource-card-title">${title}</div>
      <span class="file-type-badge ${ft}">${ft}</span>
    </div>
    ${ev?`<div class="resource-card-evidence"><span>근거:</span> ${ev}</div>`:''}
    <div class="resource-card-tags">
      <span class="tag-chip" style="background:var(--accent-light);color:var(--orange)">${cat}</span>
      ${tags.map(t=>`<span class="tag-chip">${t}</span>`).join('')}
    </div>
    <div class="resource-card-footer">
      <div style="display:flex;gap:.38rem;align-items:center">
        <span class="access-badge ${access}">${access}</span>
        <span class="resource-date">${date}</span>
      </div>
      <a href="${link}" class="resource-link-btn" target="_blank">열기 ↗</a>
    </div>
  </div>`;
}

function filterResources(searchVal) {
  const grid = document.getElementById('resource-grid');
  if (!grid) return;
  const search=(searchVal!==undefined?searchVal:document.getElementById('archive-search-input')?.value||'').toLowerCase();
  const cat   =document.getElementById('archive-cat-filter')?.value||'';
  const access=document.getElementById('archive-access-filter')?.value||'';
  grid.querySelectorAll('.resource-card').forEach(card=>{
    const match=(!search||(card.dataset.title||'').toLowerCase().includes(search))
             &&(!cat   ||card.dataset.category===cat)
             &&(!access||card.dataset.access===access);
    card.style.display=match?'':'none';
  });
}

/* ══════════════════════════════════════════════════════════════
   8. STORY (완전 복구 — 7개 메뉴)
   ══════════════════════════════════════════════════════════════ */
function renderStoryPage(subMenu) {
  const c = document.getElementById('story-content');
  if (!c) return;
  c.innerHTML = `
  <div class="page-header">
    <div class="page-header-breadcrumb">🏠 홈 <span>›</span> 부천 교육 STORY</div>
    <div class="page-header-title">📖 부천 교육 STORY</div>
    <div class="page-header-desc">"왜 시작했는가" "어떻게 발전했는가" — 부천 교육의 브랜드 기록관</div>
    <div style="height:1.1rem"></div>
  </div>
  <div style="padding:1.8rem 2.5rem">
    <div class="story-grid">
      ${SITE_DATA.stories.map(s=>s.comingSoon ? `
        <div class="story-card" style="opacity:.55;cursor:default">
          <div class="story-card-thumb" style="background:var(--bg-page)">${s.icon||'🚧'}</div>
          <div class="story-card-body">
            <div class="story-card-category">${s.category}</div>
            <div class="story-card-title">${s.title}</div>
            <div class="story-card-subtitle">${s.subtitle}</div>
            <div style="margin-top:.6rem;font-size:.72rem;font-weight:700;color:var(--text-muted)">🚧 준비 중</div>
          </div>
        </div>` : `
        <div class="story-card">
          <div class="story-card-thumb">${s.icon||'📖'}</div>
          <div class="story-card-body">
            <div class="story-card-category">${s.category}</div>
            <div class="story-card-title">${s.title}</div>
            <div class="story-card-subtitle">${s.subtitle}</div>
            <div class="story-card-date">${s.date}</div>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════════
   9. 통합 검색 (그룹별 결과 + 출처유형·공개범위 필터)
   ══════════════════════════════════════════════════════════════ */
function initSearch() {
  const input = document.getElementById('search-input');
  const dropdown = document.getElementById('search-dropdown');
  if (!input||!dropdown) return;

  input.addEventListener('input', debounce(()=>{
    const q=input.value.trim();
    if (q.length<1){closeSearch();return;}
    renderSearchDropdown(searchAll(q),q);
  },200));

  document.addEventListener('click',e=>{
    if (!e.target.closest('.topnav-search')) closeSearch();
  });
  input.addEventListener('keydown',e=>{if(e.key==='Escape')closeSearch();});
}

function searchAll(query) {
  const q=query.toLowerCase();
  const groups = {
    '📢 공지사항':[],
    '📚 질의회신 DB':[],
    '❓ FAQ':[],
    '📂 자료 아카이브':[],
  };

  SITE_DATA.notices.forEach(n=>{
    if(n.title.toLowerCase().includes(q))
      groups['📢 공지사항'].push({title:n.title,meta:n.date,action:()=>navigateTo('home')});
  });
  SITE_DATA.qnaCases.forEach(qc=>{
    const text = [qc.질문,qc.답변요약,qc.답변전문,...(qc.태그||[])].join(' ').toLowerCase();
    if(text.includes(q))
      groups['📚 질의회신 DB'].push({
        title:qc.질문||'',
        meta:`${qc.대분류} · ${qc.출처유형||''}`,
        action:()=>{navigateTo('qna');setTimeout(()=>openQnaModal(qc.ID),300);}
      });
  });
  SITE_DATA.faqs.forEach(f=>{
    const text = [f.질문,f.답변요약,f.답변전문,...(f.태그||[])].join(' ').toLowerCase();
    if(text.includes(q))
      groups['❓ FAQ'].push({title:f.질문||'',meta:f.대분류,action:()=>navigateTo('evaluation','eval-faq')});
  });
  SITE_DATA.resources.forEach(r=>{
    const title=r.제목||'';
    const text = [title,...(r.태그||[]),r.근거문서명||''].join(' ').toLowerCase();
    if(text.includes(q))
      groups['📂 자료 아카이브'].push({title,meta:r.대분류,action:()=>navigateTo('archive')});
  });

  return groups;
}

function renderSearchDropdown(groups,query) {
  const dd=document.getElementById('search-dropdown');
  if(!dd) return;
  const total=Object.values(groups).reduce((s,g)=>s+g.length,0);

  if(!total){
    dd.innerHTML=`<div class="search-empty">검색 결과가 없습니다</div>`;
    dd.classList.add('open'); return;
  }

  let html=`<div class="search-total-count">총 ${total}건의 결과</div>`;
  const allItems=[];
  Object.entries(groups).forEach(([label,items])=>{
    if(!items.length) return;
    html+=`<div class="search-result-group-label">${label} ${items.length}건</div>`;
    items.slice(0,3).forEach((r,i)=>{
      allItems.push(r);
      html+=`<div class="search-result-item">
        <div class="search-result-title">${highlight(r.title,query)}</div>
        <div class="search-result-meta">${r.meta||''}</div>
      </div>`;
    });
  });

  dd.innerHTML=html;
  dd.classList.add('open');

  dd.querySelectorAll('.search-result-item').forEach((el,i)=>{
    el.addEventListener('click',()=>{
      allItems[i]?.action?.();
      document.getElementById('search-input').value='';
      closeSearch();
    });
  });
}

function closeSearch(){ document.getElementById('search-dropdown')?.classList.remove('open'); }
function highlight(text,query){
  if(!query) return text;
  return text.replace(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'),
    '<mark style="background:#fff9c4;border-radius:2px">$1</mark>');
}

/* ══════════════════════════════════════════════════════════════
   10. FAQ (v3 보존 — 답변전문·출처유형 포함)
   ══════════════════════════════════════════════════════════════ */
function renderFaqItem(f) {
  const cat=f.대분류||'';
  const evHtml=(f.근거문서명||f.실제근거문구)?`
    <div class="faq-evidence">
      <div class="faq-evidence-label">📑 근거 문서</div>
      ${f.근거문서명?`<div class="faq-evidence-row"><span class="faq-evidence-key">문서명</span><span class="faq-evidence-val">${f.근거문서명}</span></div>`:''}
      ${f.해당페이지?`<div class="faq-evidence-row"><span class="faq-evidence-key">해당 페이지</span><span class="faq-evidence-val">${f.해당페이지}</span></div>`:''}
      ${f.실제근거문구&&f.실제근거문구!=='—'?`<div class="faq-evidence-quote">"${f.실제근거문구}"</div>`:''}
    </div>`:'';

  const sourceHtml=f.출처유형?`<div style="margin-bottom:.5rem">${sourceTypeBadge(f.출처유형)}</div>`:'';

  return `
  <div class="faq-item" data-category="${cat}">
    <div class="faq-question" onclick="toggleFaq(this.parentElement)">
      <div class="faq-q-label">Q</div>
      <div class="faq-q-text">${f.질문||''}</div>
      <span class="faq-category-badge">${cat}</span>
      <span class="faq-toggle-icon">▼</span>
    </div>
    <div class="faq-answer">
      ${sourceHtml}
      <div class="faq-a-label">▶ 답변 요약</div>
      <div class="faq-a-text">${f.답변요약||''}</div>
      ${f.답변전문?`
      <div class="faq-fulltext">
        <div class="faq-fulltext-label">📄 답변 전문</div>
        ${f.답변전문.replace(/\n/g,'<br>').replace(/\[([^\]]+)\]/g,'<strong>[$1]</strong>')}
      </div>`:''}
      ${evHtml}
    </div>
  </div>`;
}

function toggleFaq(item) {
  const isOpen=item.classList.contains('open');
  item.closest('.faq-list')?.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
  if(!isOpen) item.classList.add('open');
}

function initFAQ() {
  document.querySelectorAll('.faq-filters .filter-chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const parent=chip.closest('.faq-filters');
      parent?.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      const filter=chip.dataset.filter||'';
      chip.closest('div')?.nextElementSibling
        ?.querySelectorAll('.faq-item').forEach(item=>{
          const cat=item.dataset.category||'';
          item.style.display=(!filter||filter==='all'||cat===filter)?'':'none';
        });
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   11. 공통 유틸 (v3 완전 보존)
   ══════════════════════════════════════════════════════════════ */
function initTabs(navId) {
  document.getElementById(navId)?.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>activateTab(btn.dataset.tab));
  });
}
function activateTab(tabId) {
  if(!tabId) return;
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(`tab-${tabId}`)?.classList.add('active');
  document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add('active');
  AppState.currentTab=tabId;
}
function toggleCheck(item) {
  const cb=item.querySelector('input[type="checkbox"]');
  if(cb){cb.checked=!cb.checked;item.classList.toggle('checked',cb.checked);}
}
function initChecklist() {
  document.querySelectorAll('.checklist-item input').forEach(cb=>{
    cb.addEventListener('change',()=>cb.closest('.checklist-item').classList.toggle('checked',cb.checked));
  });
}
function initMobileMenu() {
  document.getElementById('menu-toggle')?.addEventListener('click',()=>{
    document.getElementById('sidebar')?.classList.toggle('open');
    document.getElementById('sidebar-overlay')?.classList.toggle('open');
  });
  document.getElementById('sidebar-overlay')?.addEventListener('click',closeMobileSidebar);
}
function closeMobileSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('open');
}
function printPage(){ window.print(); }
function debounce(fn,delay){ let t; return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),delay);}; }

/* ══════════════════════════════════════════════════════════════
   12. 구글시트 DB 연동
   ══════════════════════════════════════════════════════════════ */
async function loadFromGoogleSheet(csvUrl, dataKey, transformFn) {
  try {
    const res=await fetch(csvUrl);
    const text=await res.text();
    const parseRow=row=>{
      const cells=[];let cur='';let inQ=false;
      for(let i=0;i<row.length;i++){
        const ch=row[i];
        if(ch==='"'){inQ=!inQ;continue;}
        if(ch===','&&!inQ){cells.push(cur.trim());cur='';continue;}
        cur+=ch;
      }
      cells.push(cur.trim());return cells;
    };
    const lines=text.trim().split('\n');
    const headers=parseRow(lines[0]);
    const data=lines.slice(1).filter(l=>l.trim()).map(l=>{
      const cells=parseRow(l);
      const obj={};
      headers.forEach((h,i)=>{obj[h]=cells[i]||'';});
      if(obj['태그']) obj['태그']=obj['태그'].split('|').map(t=>t.trim());
      return obj;
    }).filter(obj=>!obj['상태']||obj['상태']==='공개');
    SITE_DATA[dataKey]=transformFn?transformFn(data):data;
    console.log(`[구글시트] ${dataKey}: ${data.length}건 로드`);
    return data;
  } catch(err){ console.error('[구글시트] 로드 실패:',err); return null; }
}

/* ── 전역 노출 ────────────────────────────────────────────────── */
window.navigateTo      = navigateTo;
window.dismissBanner   = dismissBanner;
window.toggleFaq       = toggleFaq;
window.toggleCheck     = toggleCheck;
window.filterResources = filterResources;
window.filterQnaCards  = filterQnaCards;
window.openQnaModal    = openQnaModal;
window.closeQnaModal   = closeQnaModal;
window.printPage       = printPage;
