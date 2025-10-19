// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.6.0',
  name: 'PlayerType Management (Core/Key player/Feature)',
  date: '2025-01-19',
  phase: '3.6.0',
  changes: [
    '🎭 PlayerType dropdown (Core/Key player/Feature) in PlayerPhotos D column',
    '🥇 Core players appear at the top (highest priority)',
    '🚫 Feature players excluded from Key Players list (dedicated Feature table)',
    '📊 Sort priority: PlayerType > Introduction > DisplayOrder > PlayerName',
    '🔄 Auto-migration: 4→6→7 column structure (UpdatedAt moved to G column)',
    '⚡ Zero performance impact (client-side sorting)'
  ],
  deployment: {
    id: '@24',
    description: 'v3.5.1 - Performance testing tools and loading UX improvements',
    url: 'https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.6.0',
    'tracker.html': 'v3.5.3',
    'performance_test.js': 'v3.5.1',
    'appsscript.json': 'v3.2.0',
    'version.js': 'v3.6.0',
    'docs/CHANGELOG.md': 'v3.6.0',
    'docs/STATUS.md': 'v3.6.0',
    'docs/PRD.md': 'v3.6.0',
    'docs/LLD.md': 'v2.4.0',
    'docs/PLAN.md': 'v2.4.0',
    'docs/MIGRATION_SEATS_ONLY.md': 'v3.0.0',
    'docs/FEATURE_PLAYER_PHOTO.md': 'v3.1.0',
    'docs/PHASE_3.1_SUMMARY.md': 'v3.1.0',
    'docs/PERFORMANCE_Tracker.md': 'v3.5.0',
    'docs/PERFORMANCE_TEST_GUIDE.md': 'v3.5.1',
    'PRD_SUMMARY.md': 'v3.5.0',
    'ROLLBACK_INFO.md': 'v3.0.1'
  },
  status: {
    state: '✅ Stable version (Code ready)',
    phase: 'Phase 3.6.0 (PlayerType Management)',
    blockers: [],
    lastCompleted: [
      '✅ PlayerType dropdown D column (Core/Key player/Feature) (v3.6.0)',
      '✅ Core players prioritized, Feature players excluded (v3.6.0)',
      '✅ Auto-migration 4→6→7 column structure (v3.6.0)',
      '✅ Auto-fallback to DisplayOrder sorting (v3.5.5)',
      '✅ Introduction-based sorting implemented (v3.5.4)'
    ]
  },
  next: {
    version: 'v4.0.0',
    phase: '4.0.0',
    target: 'Firebase Realtime Database + WebSocket 실시간 동기화',
    estimatedDate: 'TBD',
    features: [
      'Firebase 직접 연동 (Apps Script Proxy 제거)',
      'WebSocket 기반 실시간 업데이트',
      'IndexedDB 로컬 캐싱',
      'Service Worker PWA 지원'
    ]
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
