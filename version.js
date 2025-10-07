// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v2.2.0',
  name: 'Poker Room/Table Name Display',
  date: '2025-10-07',
  phase: '1.5',
  changes: [
    'Type 시트 A/B열 추가 (Poker Room, Table Name)',
    'UI에 Poker Room/Table Name 표시 (Key Player Card + Table View)',
    'XSS 방어 강화 (validatePokerRoom_, validateTableName_)',
    '마이그레이션 함수 추가 (migrateAddPokerRoomColumns)',
    '코드 품질 개선 (중복 제거, 모바일 가독성)'
  ],
  deployment: {
    id: '@8',
    description: 'v2.2.0 - Poker Room/Table Name display (final)',
    url: 'https://script.google.com/macros/s/AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v2.2.0',
    'tracker.html': 'v2.2.0',
    'docs/STATUS.md': 'v2.2.0',
    'docs/CHANGELOG.md': 'v2.2.0',
    'docs/PRD.md': 'v2.2.0',
    'docs/LLD.md': 'v2.2.0',
    'docs/PLAN.md': 'v2.2.0'
  },
  status: {
    state: '🟡 테스트 필요',
    phase: 'Phase 1.5 (30% 완료)',
    blockers: [
      '⚠️ migrateAddPokerRoomColumns() 함수 실행 필요 (Apps Script Editor)',
      '⚠️ 웹앱 테스트 필요 (Poker Room/Table Name 표시 확인)'
    ],
    lastCompleted: [
      '✅ XSS 방어 강화 (v2.0.2)',
      '✅ Nationality 입력 UX 개선 (v2.1.0)',
      '✅ 응답 형식 버그 수정 (v2.0.1)'
    ]
  },
  next: {
    version: 'v2.3.0',
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
