// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.5.2',
  name: 'Key Player Number Badge & Introduction Checkbox',
  date: '2025-01-16',
  phase: '3.5.2',
  changes: [
    '🏷️ 키 플레이어 번호 뱃지 추가 (#1, #2, #3...)',
    '📊 PlayerPhotos F열 DisplayOrder 자동 관리',
    '✅ 소개 체크박스 E열로 이동 (Introduction)',
    '🎨 보라색 그라디언트 번호 뱃지 UI',
    '🔄 자동 순서 번호 부여 시스템',
    '📝 PlayerPhotos 시트 구조 확장 (A~F열)',
    '⚡ getAllPlayerPhotosMap_() 성능 최적화'
  ],
  deployment: {
    id: '@24',
    description: 'v3.5.1 - Performance testing tools and loading UX improvements',
    url: 'https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.5.2',
    'tracker.html': 'v3.5.2',
    'performance_test.js': 'v3.5.1',
    'appsscript.json': 'v3.2.0',
    'version.js': 'v3.5.2',
    'docs/CHANGELOG.md': 'v3.5.2',
    'docs/STATUS.md': 'v3.5.2',
    'docs/PRD.md': 'v3.5.0',
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
    state: '✅ 안정 버전 (배포 완료)',
    phase: 'Phase 3.5.2 (키 플레이어 번호 뱃지 & 체크박스)',
    blockers: [],
    lastCompleted: [
      '✅ 키 플레이어 번호 뱃지 추가 (v3.5.2)',
      '✅ Introduction 체크박스 PlayerPhotos E열로 이동 (v3.5.2)',
      '✅ DisplayOrder F열 자동 관리 (v3.5.2)',
      '✅ 성능 테스트 도구 추가 (v3.5.1)',
      '✅ 플레이어 이동 로딩 UX 개선 (v3.5.1)'
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
