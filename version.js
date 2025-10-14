// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.3.1',
  name: 'Move Button to Key Player View',
  date: '2025-10-14',
  phase: '3.3.1',
  changes: [
    '🔀 키 플레이어 뷰에 이동 버튼 추가',
    '🎨 [📷 사진] + [🔀 이동] 버튼 가로 배치',
    '🐛 오버레이 표시 버그 수정 (.active → .show)',
    '📋 label htmlFor 속성 추가 (접근성 개선)',
    '🔍 디버깅 로그 추가 (console.log)'
  ],
  deployment: {
    id: '@22',
    description: 'v3.3.1 - Move button in key player view',
    url: 'https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.3.0',
    'tracker.html': 'v3.3.1',
    'appsscript.json': 'v3.2.0',
    'docs/CHANGELOG.md': 'v3.3.1',
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
    phase: 'Phase 3.3.1 (키 플레이어 이동 버튼)',
    blockers: [],
    lastCompleted: [
      '✅ 키 플레이어 뷰 이동 버튼 추가 (v3.3.1)',
      '✅ 플레이어 이동 기능 (v3.3.0)',
      '✅ 사진 업로드 UX 개선 (v3.2.1)'
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
