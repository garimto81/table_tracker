// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.2.1',
  name: 'Photo Upload UX Enhancement',
  date: '2025-10-14',
  phase: '3.2.1',
  changes: [
    '🔒 무한 루프 방지 (isUploading 플래그)',
    '🎯 자동 저장 및 팝업 닫기 (사용자 클릭 불필요)',
    '🚫 성공 알림 제거 (사일런트 UX)',
    '🔄 전체 화면 잠금 (업로드 → 저장 → 새로고침)',
    '⚡ 버튼 상태 관리 ([📷 사진 촬영] → [🔄 업로드 중...])'
  ],
  deployment: {
    id: '@18',
    description: 'v3.2.1 - Screen lock during upload and refresh',
    url: 'https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.2.0',
    'tracker.html': 'v3.2.1',
    'appsscript.json': 'v3.2.0',
    'docs/CHANGELOG.md': 'v3.2.1',
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
    phase: 'Phase 3.2.1 (UX 개선)',
    blockers: [],
    lastCompleted: [
      '✅ 사진 업로드 UX 개선 (v3.2.1)',
      '✅ 스마트폰 사진 촬영 자동 업로드 (v3.2.0)',
      '✅ KeyPlayers → Type N열 리팩토링 (v3.1.1)'
    ]
  },
  next: {
    version: 'v3.3.0',
    phase: '3.3',
    target: 'Optional: 개인 Imgur Client ID 등록 가이드',
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
