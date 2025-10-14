// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.2.0',
  name: 'Smartphone Camera & Imgur Auto-Upload',
  date: '2025-10-14',
  phase: '3.2.0',
  changes: [
    '📷 스마트폰 사진 촬영 버튼 추가 (HTML5 capture="environment")',
    '🔼 Imgur Anonymous Upload API 연동 (uploadToImgur)',
    '🔒 OAuth 스코프 추가 (script.external_request)',
    '✅ Base64 인코딩 자동 처리 (FileReader API)',
    '⚡ 사진 업로드 자동화 (60초 → 10초)'
  ],
  deployment: {
    id: '@17',
    description: 'v3.2.0 - Add OAuth scope for Imgur upload',
    url: 'https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.2.0',
    'tracker.html': 'v3.2.0',
    'appsscript.json': 'v3.2.0',
    'docs/STATUS.md': 'v3.1.0',
    'docs/CHANGELOG.md': 'v3.2.0',
    'docs/PRD.md': 'v3.1.0',
    'docs/LLD.md': 'v2.4.0',
    'docs/PLAN.md': 'v2.4.0',
    'docs/MIGRATION_SEATS_ONLY.md': 'v3.0.0',
    'docs/FEATURE_PLAYER_PHOTO.md': 'v3.1.0',
    'docs/PHASE_3.1_SUMMARY.md': 'v3.1.0',
    'ROLLBACK_INFO.md': 'v3.0.1'
  },
  status: {
    state: '⚠️ 재인증 필요',
    phase: 'Phase 3.2.0 (배포 완료, 사용자 액션 필요)',
    blockers: [
      '⚠️ 웹앱 재접속 시 OAuth 재인증 필요 (UrlFetchApp 권한 승인)',
      '⚠️ 스마트폰에서 사진 촬영 → Imgur 업로드 테스트 필요'
    ],
    lastCompleted: [
      '✅ 스마트폰 사진 촬영 자동 업로드 (v3.2.0)',
      '✅ KeyPlayers → Type N열 리팩토링 (v3.1.1)',
      '✅ 플레이어 사진 기능 추가 (v3.1.0)'
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
