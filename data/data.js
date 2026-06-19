/**
 * 부천형 고등학교 교육과정·학생평가 길라잡이 - 데이터 파일
 * 향후 구글시트 연동 시 이 파일의 구조를 기준으로 API 응답을 매핑하세요.
 *
 * 구글시트 연동 방법:
 *   1. 구글시트 → 파일 → 웹에 게시 → CSV 형식으로 각 시트 공개
 *   2. script.js의 loadFromGoogleSheet() 함수에 URL 입력
 *   3. Papa.parse() 또는 fetch()로 CSV → JSON 변환 후 아래 구조와 동일하게 매핑
 */

const SITE_DATA = {

  // ─── 공지사항 ─────────────────────────────────────────────
  notices: [
    {
      id: 1,
      title: "2025학년도 고등학교 교육과정 편성 컨설팅 일정 안내",
      date: "2025-03-10",
      tag: "교육과정",
      important: true,
      link: "#"
    },
    {
      id: 2,
      title: "부천형 공동교육과정 2025년 2학기 개설 과목 안내",
      date: "2025-03-05",
      tag: "공동교육과정",
      important: false,
      link: "#"
    },
    {
      id: 3,
      title: "2025 계절학기 운영 계획 및 신청 안내",
      date: "2025-02-28",
      tag: "계절학기",
      important: true,
      link: "#"
    },
    {
      id: 4,
      title: "학업성적관리 시행지침 개정 사항 안내 (2025)",
      date: "2025-02-20",
      tag: "학생평가",
      important: false,
      link: "#"
    }
  ],

  // ─── 빠른 시작 카드 ────────────────────────────────────────
  quickLinks: [
    {
      id: "ql1",
      icon: "📋",
      title: "교육과정 편성·운영",
      desc: "학교 교육과정 편성 절차와 유의사항을 확인하세요",
      link: "#curriculum-planning",
      color: "blue"
    },
    {
      id: "ql2",
      icon: "🗂️",
      title: "2027 교육과정 편성 컨설팅",
      desc: "컨설팅 일정·준비자료·체크포인트 안내",
      link: "#consulting",
      color: "indigo"
    },
    {
      id: "ql3",
      icon: "🔗",
      title: "부천형 공동교육과정",
      desc: "공동교육과정 개설 과목 및 수강 신청 안내",
      link: "#joint-curriculum",
      color: "teal"
    },
    {
      id: "ql4",
      icon: "🌞",
      title: "부천형 계절학기",
      desc: "계절학기 개설 과목·운영 절차 길라잡이",
      link: "#seasonal",
      color: "orange"
    },
    {
      id: "ql5",
      icon: "📊",
      title: "최소 성취수준 보장지도",
      desc: "최소 성취수준 운영 절차 및 서식 모음",
      link: "#min-achievement",
      color: "purple"
    },
    {
      id: "ql6",
      icon: "💻",
      title: "나이스 성적처리",
      desc: "나이스 성적 입력·수정·마감 단계별 안내",
      link: "#neis",
      color: "green",
      highlight: true
    },
    {
      id: "ql7",
      icon: "❓",
      title: "학생평가 FAQ",
      desc: "자주 묻는 질문과 현장 질의회신 사례",
      link: "#faq",
      color: "red",
      highlight: true
    }
  ],

  // ─── 시즌별 바로가기 ───────────────────────────────────────
  seasons: [
    {
      id: "spring",
      label: "학기 초",
      icon: "🌱",
      items: [
        { title: "교육과정 편성", link: "#curriculum-planning" },
        { title: "평가계획 수립", link: "#eval-plan" }
      ]
    },
    {
      id: "pre-exam",
      label: "고사 전",
      icon: "📝",
      items: [
        { title: "정기고사 운영", link: "#regular-exam" },
        { title: "수행평가 계획", link: "#performance-eval" }
      ]
    },
    {
      id: "semester-end",
      label: "학기말",
      icon: "📋",
      items: [
        { title: "최소 성취수준", link: "#min-achievement" },
        { title: "나이스 성적처리", link: "#neis" }
      ]
    },
    {
      id: "vacation",
      label: "방학 전",
      icon: "☀️",
      items: [
        { title: "계절학기 신청", link: "#seasonal" }
      ]
    }
  ],

  // ─── 자료 아카이브 ────────────────────────────────────────
  resources: [
    {
      id: "r1",
      title: "2025 고등학교 교육과정 편성·운영 지침",
      category: "정책·지침",
      tags: ["교육과정", "편성", "필수"],
      access: "교사용",
      link: "#",
      updatedAt: "2025-03-01",
      fileType: "PDF"
    },
    {
      id: "r2",
      title: "부천형 공동교육과정 길라잡이 2025",
      category: "연수자료",
      tags: ["공동교육과정", "길라잡이"],
      access: "공개",
      link: "#",
      updatedAt: "2025-02-15",
      fileType: "PPT"
    },
    {
      id: "r3",
      title: "계절학기 운영 길라잡이",
      category: "연수자료",
      tags: ["계절학기", "길라잡이"],
      access: "공개",
      link: "#",
      updatedAt: "2025-01-20",
      fileType: "PDF"
    },
    {
      id: "r4",
      title: "학생평가 관련 서식 일체",
      category: "서식모음",
      tags: ["학생평가", "서식", "나이스"],
      access: "업무용",
      link: "#",
      updatedAt: "2025-03-05",
      fileType: "ZIP"
    },
    {
      id: "r5",
      title: "AI·디지털 기반 수업·평가 연수자료",
      category: "AI·디지털",
      tags: ["AI", "디지털", "수업"],
      access: "공개",
      link: "#",
      updatedAt: "2025-02-28",
      fileType: "PPT"
    },
    {
      id: "r6",
      title: "고교학점제 카드뉴스 시리즈",
      category: "카드뉴스",
      tags: ["고교학점제", "홍보"],
      access: "공개",
      link: "#",
      updatedAt: "2025-02-10",
      fileType: "IMG"
    }
  ],

  // ─── FAQ ─────────────────────────────────────────────────
  faqs: [
    {
      id: "f1",
      category: "교육과정",
      question: "교육과정 편성 시 최소 이수 단위는 어떻게 되나요?",
      answer: "고등학교 교육과정 총 이수 단위는 192단위이며, 교과(군)별 필수 이수 단위를 충족한 후 학교 자율 편성 단위를 배정합니다. 고교학점제 전환 학교의 경우 2025학년도부터 192학점 기준이 적용됩니다. 자세한 사항은 '교육과정 편성·운영 지침'을 참조하세요."
    },
    {
      id: "f2",
      category: "교육과정",
      question: "공동교육과정 수강 학생의 성적 처리는 어떻게 하나요?",
      answer: "공동교육과정 이수 학생의 성적은 개설 학교(주관교)에서 처리 후 수강 학생의 재적 학교로 통보합니다. 재적 학교는 통보받은 성적을 나이스에 입력하며, 공동교육과정 이수 과목은 학교생활기록부에 공동교육과정 이수로 표기됩니다."
    },
    {
      id: "f3",
      category: "학생평가",
      question: "수행평가 결시 학생의 인정점 부여 기준은?",
      answer: "질병 등 불가피한 사유로 수행평가에 결시한 학생에 대해 학교 학업성적관리위원회가 정한 기준에 따라 인정점을 부여할 수 있습니다. 다만, 인정점 부여 기준은 학업성적관리규정에 사전 명시되어 있어야 하며, 학업성적관리위원회의 심의를 거쳐야 합니다."
    },
    {
      id: "f4",
      category: "나이스",
      question: "나이스 성적 입력 마감 후 수정이 필요한 경우 어떻게 하나요?",
      answer: "성적 마감 후 수정이 필요한 경우 학교 담당자가 교육청 나이스 담당자에게 정정 요청을 해야 합니다. 정정 사유서 및 관련 증빙 서류를 첨부하여 공문으로 요청하며, 교육청 승인 후 수정이 가능합니다. 부득이한 경우 외 마감 후 수정은 지양해야 합니다."
    },
    {
      id: "f5",
      category: "학생평가",
      question: "전입생의 전 학교 성적 처리 방법은?",
      answer: "전입생의 전 학교 이수 과목 성적은 학교생활기록부를 통해 확인하고, 전입 학교 교육과정과 비교하여 처리합니다. 동일 과목의 경우 전 학교 성적을 인정하며, 학업성적관리위원회에서 과목 인정 여부를 심의합니다."
    }
  ],

  // ─── 질의회신 DB ───────────────────────────────────────────
  qnaCases: [
    {
      id: "q1",
      date: "2024-11-15",
      category: "학생평가",
      question: "수행평가 비율이 지필고사 비율보다 높아도 되나요?",
      answer: "가능합니다. 다만 지필고사를 실시하는 경우 지필고사 비율이 0%가 되어서는 안 됩니다. 수행평가 100%는 지필고사를 실시하지 않는 과목에만 가능하며, 이 경우 학교 학업성적관리규정에 사전 명시되어야 합니다.",
      source: "경기도교육청 질의회신 2024-평가-0341"
    },
    {
      id: "q2",
      date: "2024-10-08",
      category: "교육과정",
      question: "자율 선택 과목을 2개 학년에 걸쳐 편성할 수 있나요?",
      answer: "자율 선택 과목은 1개 학년 또는 2개 학년에 걸쳐 편성할 수 있습니다. 단, 학교 교육과정 편성·운영 계획서에 명시하고 학업성적관리규정에 관련 사항을 반영해야 합니다.",
      source: "경기도교육청 질의회신 2024-교육과정-0218"
    }
  ],

  // ─── 스토리 ───────────────────────────────────────────────
  stories: [
    {
      id: "s1",
      title: "부천형 공동교육과정, 학교의 벽을 넘다",
      subtitle: "2019년 첫 발걸음부터 2025년 현재까지",
      category: "공동교육과정",
      thumbnail: null,
      link: "#",
      date: "2025-02-01"
    },
    {
      id: "s2",
      title: "계절학기, 배움의 시간을 더하다",
      subtitle: "방학을 활용한 학생 맞춤형 교육 이야기",
      category: "계절학기",
      thumbnail: null,
      link: "#",
      date: "2025-01-15"
    },
    {
      id: "s3",
      title: "미래공감 설명회 현장 스케치",
      subtitle: "학생·학부모와 함께하는 고교학점제 이해",
      category: "미래공감",
      thumbnail: null,
      link: "#",
      date: "2024-12-10"
    }
  ]
};
