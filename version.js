// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v2.4.0',
  name: 'Mobile Text Size Optimization',
  date: '2025-10-07',
  phase: '1.7',
  changes: [
    '키 플레이어 뷰 텍스트 100% 확대 (모바일 가독성)',
    '테이블 뷰 텍스트 30% 추가 확대',
    '테이블 뷰 9명 화면 높이 꽉 채우기 (flex: 1)',
    '오버레이(설정창) 텍스트/버튼 대폭 확대 (1.4~1.8rem)',
    '입력 필드 최소 높이 56px (터치 최적화)',
    '체크박스 크기 20px → 32px'
  ],
  deployment: {
    id: '@12',
    description: 'v2.4.0 - Mobile text size optimization',
    url: 'https://script.google.com/macros/s/AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v2.4.0',
    'tracker.html': 'v2.4.0',
    'docs/STATUS.md': 'v2.4.0',
    'docs/CHANGELOG.md': 'v2.4.0',
    'docs/PRD.md': 'v2.4.0',
    'docs/LLD.md': 'v2.4.0',
    'docs/PLAN.md': 'v2.4.0'
  },
  status: {
    state: '⚠️ 개선 필요',
    phase: 'Phase 1.7 (100% 완료)',
    blockers: [
      '⚠️ CSS 클래스 중복으로 스마트폰 최적화 미작동 (.flag, .chips 등)',
      '⚠️ Viewport 기본 폰트 크기 너무 작음 (최대 20px)',
      '⚠️ Flexbox 선택자 잘못됨 (#viewTable .wrap)'
    ],
    lastCompleted: [
      '✅ 모바일 텍스트 크기 최적화 (v2.4.0)',
      '✅ UI/UX 모바일 최적화 (v2.3.0)',
      '✅ Poker Room/Table 자동 정렬 (v2.2.0)'
    ]
  },
  next: {
    version: 'v2.4.1',
    phase: '1.7',
    target: 'CSS 클래스 분리 및 스마트폰 최적화 수정',
    estimatedDate: '2025-10-08'
  }
};

// Export for Google Apps Script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VERSION;
}

// Export for browser (tracker.html)
if (typeof window !== 'undefined') {
  window.TRACKER_VERSION = VERSION;
}
