// Poker Tracker Version Manager
// SINGLE SOURCE OF TRUTH for all version information

const VERSION = {
  current: 'v3.1.0',
  name: 'Player Photo Feature',
  date: '2025-10-13',
  phase: '3.1',
  changes: [
    'KeyPlayers 시트 추가 (PlayerName, PhotoURL 2컬럼)',
    '96px 사진 + 프로 디자인 UI 구현',
    '국가 이름 매핑 40개국 (KR → South Korea)',
    '사진 편집 팝업 구현 (Imgur URL 입력)',
    'getKeyPlayers() photoUrl 필드 JOIN 추가'
  ],
  deployment: {
    id: '@12',
    description: 'v2.4.0 - Mobile text size optimization',
    url: 'https://script.google.com/macros/s/AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA/exec',
    scriptId: '17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O',
    spreadsheetId: '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4'
  },
  files: {
    'tracker_gs.js': 'v3.1.0',
    'tracker.html': 'v3.1.0',
    'docs/STATUS.md': 'v3.1.0',
    'docs/CHANGELOG.md': 'v3.1.0',
    'docs/PRD.md': 'v3.1.0',
    'docs/LLD.md': 'v2.4.0',
    'docs/PLAN.md': 'v2.4.0',
    'docs/MIGRATION_SEATS_ONLY.md': 'v3.0.0',
    'docs/FEATURE_PLAYER_PHOTO.md': 'v3.1.0',
    'docs/PHASE_3.1_SUMMARY.md': 'v3.1.0',
    'ROLLBACK_INFO.md': 'v3.0.1'
  },
  status: {
    state: '✅ 배포 준비 완료',
    phase: 'Phase 3.1 (100% 완료)',
    blockers: [
      '⚠️ 웹앱 배포 후 사진 표시 확인 필요',
      '⚠️ KeyPlayers 시트 자동 생성 확인 필요'
    ],
    lastCompleted: [
      '✅ 플레이어 사진 기능 추가 (v3.1.0)',
      '✅ Keyplayer 컬럼 인덱스 고정 (v3.0.1)',
      '✅ Seats.csv 구조 마이그레이션 (v3.0.0)'
    ]
  },
  next: {
    version: 'v3.2.0',
    phase: '3.2',
    target: 'Imgur API 자동 업로드 (Optional)',
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
