// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.5.4',
  name: 'Introduction-based Sorting',
  date: '2025-01-19',
  phase: '3.5.4',
  changes: [
    '🔝 Introduction checkbox sorting (PlayerPhotos E column)',
    '✨ Introduced players appear at the top',
    '📊 Sort priority: Introduction > DisplayOrder > PlayerName',
    '⚡ Zero performance impact (client-side sorting)',
    '🎯 Enhanced key player visibility'
  ],
  deployment: {
    id: '@24',
    description: 'v3.5.1 - Performance testing tools and loading UX improvements',
    url: 'https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.5.4',
    'tracker.html': 'v3.5.3',
    'performance_test.js': 'v3.5.1',
    'appsscript.json': 'v3.2.0',
    'version.js': 'v3.5.4',
    'docs/CHANGELOG.md': 'v3.5.4',
    'docs/STATUS.md': 'v3.5.4',
    'docs/PRD.md': 'v3.5.4',
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
    phase: 'Phase 3.5.4 (Introduction-based Sorting)',
    blockers: [],
    lastCompleted: [
      '✅ Introduction-based sorting implemented (v3.5.4)',
      '✅ Complete English UI translation (v3.5.3)',
      '✅ Key player number badge added (v3.5.2)',
      '✅ Introduction checkbox moved to PlayerPhotos column E (v3.5.2)',
      '✅ Performance testing tools added (v3.5.1)'
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
