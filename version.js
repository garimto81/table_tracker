// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.0.1',
  name: 'Keyplayer Column Fixed Index',
  date: '2025-10-12',
  phase: '3.0',
  changes: [
    'K열 Keyplayer 인덱스 고정 (헤더 무관, 인덱스 10)',
    '키 플레이어 필터링 로직 개선 (헤더 이름 의존성 제거)',
    'tableNo/seatNo > 0 조건으로 필터링 수정 (falsy 방지)'
  ],
  deployment: {
    id: '@12',
    description: 'v2.4.0 - Mobile text size optimization',
    url: 'https://script.google.com/macros/s/AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.0.1',
    'tracker.html': 'v3.0.0',
    'docs/STATUS.md': 'v3.0.0',
    'docs/CHANGELOG.md': 'v3.0.1',
    'docs/PRD.md': 'v2.4.0',
    'docs/LLD.md': 'v2.4.0',
    'docs/PLAN.md': 'v2.4.0',
    'docs/MIGRATION_SEATS_ONLY.md': 'v3.0.0'
  },
  status: {
    state: '✅ 배포 준비 완료',
    phase: 'Phase 3.0.1 (100% 완료)',
    blockers: [
      '⚠️ 웹앱 배포 후 키 플레이어 표시 확인 필요'
    ],
    lastCompleted: [
      '✅ Keyplayer 컬럼 인덱스 고정 (v3.0.1)',
      '✅ Seats.csv 구조 마이그레이션 (v3.0.0)',
      '✅ 모바일 텍스트 크기 최적화 (v2.4.0)'
    ]
  },
  next: {
    version: 'v3.1.0',
    phase: '3.1',
    target: '플레이어 사진 기능 추가 (L열 PlayerPhoto)',
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
