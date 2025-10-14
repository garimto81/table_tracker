// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.3.0',
  name: 'Player Move Feature',
  date: '2025-10-14',
  phase: '3.3.0',
  changes: [
    '🔀 플레이어 이동 기능 추가 (테이블/좌석 변경)',
    '📝 목적지 덮어쓰기 지원 (중복 방지)',
    '🔒 원자적 트랜잭션 (ScriptLock)',
    '🎨 [🔀] 이동 버튼 추가 (Table View)',
    '⚠️ 덮어쓰기 경고 메시지'
  ],
  deployment: {
    id: '@19',
    description: 'v3.3.0 - Player move feature with overwrite',
    url: 'https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.3.0',
    'tracker.html': 'v3.3.0',
    'appsscript.json': 'v3.2.0',
    'docs/CHANGELOG.md': 'v3.3.0',
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
    phase: 'Phase 3.3.0 (플레이어 이동)',
    blockers: [],
    lastCompleted: [
      '✅ 플레이어 이동 기능 (v3.3.0)',
      '✅ 사진 업로드 UX 개선 (v3.2.1)',
      '✅ 스마트폰 사진 촬영 자동 업로드 (v3.2.0)'
    ]
  },
  next: {
    version: 'v3.4.0',
    phase: '3.4',
    target: 'TBD',
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
