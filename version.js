// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.1.1',
  name: 'Photo Storage Refactoring',
  date: '2025-10-14',
  phase: '3.1.1',
  changes: [
    'KeyPlayers 시트 제거 → Type 시트 N열로 통합',
    'updateKeyPlayerPhoto() 단순화 (Type N열 직접 쓰기)',
    'getKeyPlayers() JOIN 제거 (N열 직접 읽기)',
    'migrateKeyPlayersToTypeSheetN() 마이그레이션 함수 추가',
    'invalidateCache_() 호출 추가 (사진 업데이트 시)'
  ],
  deployment: {
    id: '@12',
    description: 'v2.4.0 - Mobile text size optimization',
    url: 'https://script.google.com/macros/s/AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.1.1',
    'tracker.html': 'v3.1.0',
    'docs/STATUS.md': 'v3.1.0',
    'docs/CHANGELOG.md': 'v3.1.1',
    'docs/PRD.md': 'v3.1.0',
    'docs/LLD.md': 'v2.4.0',
    'docs/PLAN.md': 'v2.4.0',
    'docs/MIGRATION_SEATS_ONLY.md': 'v3.0.0',
    'docs/FEATURE_PLAYER_PHOTO.md': 'v3.1.0',
    'docs/PHASE_3.1_SUMMARY.md': 'v3.1.0',
    'ROLLBACK_INFO.md': 'v3.0.1'
  },
  status: {
    state: '⚠️ 마이그레이션 필요',
    phase: 'Phase 3.1.1 (코드 완료, 배포 전)',
    blockers: [
      '⚠️ migrateKeyPlayersToTypeSheetN() 실행 필요',
      '⚠️ Type 시트 N열 헤더 "PhotoURL" 확인 필요',
      '⚠️ 웹앱 배포 후 사진 표시 확인 필요'
    ],
    lastCompleted: [
      '✅ KeyPlayers → Type N열 리팩토링 (v3.1.1)',
      '✅ 플레이어 사진 기능 추가 (v3.1.0)',
      '✅ Keyplayer 컬럼 인덱스 고정 (v3.0.1)'
    ]
  },
  next: {
    version: 'v3.2.0',
    phase: '3.2',
    target: 'Imgur API 자동 업로드 (Optional)',
    estimatedDate: 'TBD'
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
