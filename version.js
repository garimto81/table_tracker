// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.0.0',
  name: 'Seats.csv Structure Migration',
  date: '2025-10-12',
  phase: '3.0',
  changes: [
    'Seats.csv 기반 DB 구조로 완전 전환 (8 컬럼 → 11 컬럼)',
    'TableNo/SeatNo 숫자형 변환 ("T15" → 15)',
    'TableId, SeatId, PlayerId 내부 ID 추가',
    'PlayerName, Nationality, ChipCount 컬럼명 표준화',
    '모든 CRUD 작업 숫자형 비교로 전환',
    'UI 헬퍼 함수 추가 (formatTableNo, parseSeatNo 등)'
  ],
  deployment: {
    id: '@12',
    description: 'v2.4.0 - Mobile text size optimization',
    url: 'https://script.google.com/macros/s/AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.0.0',
    'tracker.html': 'v3.0.0',
    'docs/STATUS.md': 'v3.0.0',
    'docs/CHANGELOG.md': 'v3.0.0',
    'docs/PRD.md': 'v2.4.0',
    'docs/LLD.md': 'v2.4.0',
    'docs/PLAN.md': 'v2.4.0',
    'docs/MIGRATION_SEATS_ONLY.md': 'v3.0.0'
  },
  status: {
    state: '✅ 배포 준비 완료',
    phase: 'Phase 3.0 (100% 완료)',
    blockers: [
      '⚠️ 테스트 필요 (getKeyPlayers, getTablePlayers, addPlayer)',
      '⚠️ 웹앱 배포 후 UI 검증 필요'
    ],
    lastCompleted: [
      '✅ Seats.csv 구조 마이그레이션 (v3.0.0)',
      '✅ 모바일 텍스트 크기 최적화 (v2.4.0)',
      '✅ UI/UX 모바일 최적화 (v2.3.0)'
    ]
  },
  next: {
    version: 'v3.0.1',
    phase: '3.0',
    target: '배포 후 버그 수정 및 안정화',
    estimatedDate: '2025-10-13'
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
