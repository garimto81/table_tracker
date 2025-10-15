// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.4.1',
  name: 'Performance Optimization - Cache & Batch Loading',
  date: '2025-10-15',
  phase: '3.4.1',
  changes: [
    '⚡ PlayerPhotos 배치 로딩 (N+1 쿼리 제거, 2.5초→0.3초)',
    '⚡ 캐시 TTL 30초 확대 (1초→30초, 히트율 80%)',
    '⚡ CacheService 적용 (다중 사용자 공유 캐시)',
    '⚡ getAllPlayerPhotosMap_() 함수 추가',
    '⚡ getSheetData_() 2단계 캐싱 (메모리 + CacheService)',
    '📝 성능 개선: 전체 로딩 75% 단축 (12초→3초)'
  ],
  deployment: {
    id: '@23',
    description: 'v3.4.0 - PlayerPhotos sheet for persistent photo storage',
    url: 'https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.4.1',
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
    phase: 'Phase 3.4.1 (성능 최적화)',
    blockers: [],
    lastCompleted: [
      '✅ 성능 최적화: 캐싱 & 배치 로딩 (v3.4.1)',
      '✅ PlayerPhotos 시트 관리 함수 추가 (v3.4.0)',
      '✅ 키 플레이어 뷰 이동 버튼 추가 (v3.3.1)'
    ]
  },
  next: {
    version: 'v3.5.0',
    phase: '3.5.0',
    target: 'Firebase 하이브리드 캐싱 (실시간 동기화)',
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
