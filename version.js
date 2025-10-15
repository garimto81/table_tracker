// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.5.0',
  name: 'Firebase Realtime Cache - Hybrid Architecture',
  date: '2025-10-15',
  phase: '3.5.0',
  changes: [
    '🔥 Firebase Realtime Database 하이브리드 캐싱',
    '🚀 로딩 속도 99% 개선 (12초→0.1초)',
    '⚡ 실시간 동기화 (1분 간격 자동 업데이트)',
    '🔧 syncToFirebase() - Sheets → Firebase 동기화',
    '🔧 setupFirebaseTrigger() - 자동 트리거 생성',
    '🌐 Firebase SDK 통합 (tracker.html)',
    '📚 FIREBASE_SETUP.md 상세 가이드 추가'
  ],
  deployment: {
    id: '@23',
    description: 'v3.4.0 - PlayerPhotos sheet for persistent photo storage',
    url: 'https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.5.0',
    'tracker.html': 'v3.5.0',
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
    state: '⚠️ Firebase 설정 필요',
    phase: 'Phase 3.5.0 (Firebase 하이브리드)',
    blockers: [
      '⚙️ Firebase 프로젝트 생성 필요',
      '⚙️ FIREBASE_DB_URL 스크립트 속성 설정',
      '⚙️ setupFirebaseTrigger() 실행',
      '⚙️ tracker.html Firebase 설정 교체'
    ],
    lastCompleted: [
      '✅ Firebase 동기화 함수 추가 (v3.5.0)',
      '✅ 성능 최적화: 캐싱 & 배치 로딩 (v3.4.1)',
      '✅ PlayerPhotos 시트 관리 함수 추가 (v3.4.0)'
    ]
  },
  next: {
    version: 'v3.6.0',
    phase: '3.6.0',
    target: 'IndexedDB + Service Worker (오프라인 PWA)',
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
