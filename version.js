// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v2.3.0',
  name: 'UI/UX Optimization - Mobile First',
  date: '2025-10-07',
  phase: '1.6',
  changes: [
    'Key Player Card 2줄 압축 (Room/Table + Player/Chip 1줄)',
    'Room/Table Info 가독성 개선 (12px → 0.7rem, 그라디언트)',
    '칩 시각적 강조 (┃750k┃ 세로선, ▲▼ 삼각형)',
    '헤더 최적화 (Key Players 카운트 우측 이동)',
    '[T15 관리] 버튼 제거 → 카드 클릭으로 네비게이션',
    '전체 높이 30% 감소 → 스크롤 최소화'
  ],
  deployment: {
    id: '@11',
    description: 'v2.3.0 - Mobile-first UI optimization',
    url: 'https://script.google.com/macros/s/AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v2.3.0',
    'tracker.html': 'v2.3.0',
    'docs/STATUS.md': 'v2.3.0',
    'docs/CHANGELOG.md': 'v2.3.0',
    'docs/PRD.md': 'v2.3.0',
    'docs/LLD.md': 'v2.3.0',
    'docs/PLAN.md': 'v2.3.0'
  },
  status: {
    state: '🟢 정상',
    phase: 'Phase 1.6 (100% 완료)',
    blockers: [],
    lastCompleted: [
      '✅ UI/UX 모바일 최적화 (v2.3.0)',
      '✅ Poker Room/Table 자동 정렬 (v2.2.0)',
      '✅ XSS 방어 강화 (v2.0.2)'
    ]
  },
  next: {
    version: 'v2.4.0',
    phase: '2.1',
    target: '키 플레이어 테이블 이동 기능',
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
