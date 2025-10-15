// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.4.0',
  name: 'PlayerPhotos Sheet - Image URL Persistent Storage',
  date: '2025-10-15',
  phase: '3.4.0',
  changes: [
    '🗄️ PlayerPhotos 시트 추가 (플레이어 사진 URL 영구 저장)',
    '🔧 Type 시트 CSV 임포트 시 사진 URL 보존',
    '♻️ getKeyPlayers() - PlayerPhotos JOIN 로직 추가',
    '♻️ uploadToImgur() - PlayerPhotos에 자동 저장',
    '♻️ updateKeyPlayerPhoto() - PlayerPhotos UPSERT',
    '🔀 migrateTypeSheetNToPlayerPhotos() 마이그레이션 함수'
  ],
  deployment: {
    id: '@23',
    description: 'v3.4.0 - PlayerPhotos sheet for persistent photo storage',
    url: 'https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.4.0',
    'tracker.html': 'v3.3.1',
    'appsscript.json': 'v3.2.0',
    'docs/CHANGELOG.md': 'v3.4.0',
    'docs/STATUS.md': 'v3.1.0',
    'docs/PRD.md': 'v3.1.0',
    'docs/LLD.md': 'v2.4.0',
    'docs/PLAN.md': 'v2.4.0',
    'docs/MIGRATION_SEATS_ONLY.md': 'v3.0.0',
    'docs/FEATURE_PLAYER_PHOTO.md': 'v3.1.0',
    'docs/PHASE_3.1_SUMMARY.md': 'v3.1.0',
    'ROLLBACK_INFO.md': 'v3.0.1'
  },
  status: {
    state: '✅ 배포 완료',
    phase: 'Phase 3.4.0 (PlayerPhotos 시트)',
    blockers: [],
    lastCompleted: [
      '✅ PlayerPhotos 시트 관리 함수 추가 (v3.4.0)',
      '✅ 키 플레이어 뷰 이동 버튼 추가 (v3.3.1)',
      '✅ 플레이어 이동 기능 (v3.3.0)'
    ]
  },
  next: {
    version: 'v3.4.1',
    phase: '3.4.1',
    target: 'PlayerPhotos 성능 최적화 (캐싱)',
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
