# STATUS - Poker Tracker

> **현재 상태** | 버전: [version.js](../version.js) 참조

## 📌 현재 위치
**버전**: v3.5.2 (2025-01-16) - [version.js](../version.js)에서 관리
**현재 상태**: ✅ **안정 버전** - Phase 3.5.2 완료, 배포 준비 완료

---

## ⚠️ 블로커 (Critical)

없음 - Phase 3.5.2 완료

---

## ✅ 최근 완료 (최신 5개)

### 1. v3.5.2 - 키 플레이어 번호 뱃지 & 소개 체크박스 ✅ 완료
**날짜**: 2025-01-16
**변경사항**:
- ✅ PlayerPhotos E열 추가 (Introduction checkbox)
- ✅ PlayerPhotos F열 추가 (DisplayOrder)
- ✅ 자동 마이그레이션 로직 (4열→5열→6열)
- ✅ updateIntroduction() E열 연동
- ✅ getAllPlayerPhotosMap_() 6열 배치 로딩
- ✅ 번호 뱃지 UI (보라색 그라디언트 #667eea → #764ba2)
- ✅ 자동 순서 번호 부여 (배열 인덱스 + 1 fallback)
- ✅ setPlayerPhotoUrl_() UPSERT 로직 업데이트
- ✅ 버전 업데이트 (v3.5.1 → v3.5.2)
- ✅ Git 커밋 및 푸시 (commit 921e1fe)

### 2. v3.5.1 - 성능 테스트 도구 & 로딩 UX ✅ 완료
**날짜**: 2025-01-16
**변경사항**:
- ✅ performance_test.js 추가 (Sheets API 성능 측정)
- ✅ testPerformance() 서버 함수 구현
- ✅ 플레이어 이동 로딩 UI 개선 (LoadingManager + callServerWithLoading)
- ✅ 통합 로딩 시스템 (오버레이 + 스피너)
- ✅ 배포 완료 (@24)

### 3. v3.5.0 - Firebase 하이브리드 캐싱 (제거됨) ✅ 완료
**날짜**: 2025-01-15
**변경사항**:
- ✅ Firebase Realtime Database 통합 (99% 성능 개선)
- ⚠️ v3.5.1에서 제거됨 (166줄 삭제, 보안 우선)
- ✅ Sheets 기반 캐싱으로 복귀 (96% 성능 유지)

### 4. v3.4.1 - 배치 로딩 & 캐싱 최적화 ✅ 완료
**날짜**: 2025-10-15
**변경사항**:
- ✅ getAllPlayerPhotosMap_() 배치 로딩 함수
- ✅ 메모리 캐시 + CacheService 이중 캐싱
- ✅ 캐시 TTL 30초 확장
- ✅ 성능 개선: 2.5초 → 0.3초 (88% 개선)

### 5. v3.4.0 - PlayerPhotos 영구 저장 ✅ 완료
**날짜**: 2025-10-15
**변경사항**:
- ✅ PlayerPhotos 시트 구조 확정 (PlayerName, PhotoURL)
- ✅ 사진 저장/조회 함수 구현
- ✅ Type 시트와 독립적 관리
- ✅ 배포 완료 (@23)

---

## 🚧 진행 중

없음 - Phase 3.5.2 완료

---

## 📝 AI 메모리

### 마지막 작업
- **v3.5.2 배포**: 키 플레이어 번호 뱃지 & 소개 체크박스 (@24)
- **PlayerPhotos 확장**: E열 (Introduction), F열 (DisplayOrder) 추가
- **번호 뱃지 UI**: 보라색 그라디언트 (#667eea → #764ba2)
- **자동 마이그레이션**: 4열→5열→6열 (기존 시트 자동 업그레이드)
- **Git 커밋**: 버전 업데이트 + 문서 동기화 (commit 921e1fe)

### 다음 할 일 (선택지)
**Option A (추천)**: v3.6.0 - DisplayOrder 관리 UI
- [ ] Key Player View에 순서 변경 모드 토글
- [ ] 드래그 앤 드롭 또는 ↑/↓ 버튼
- [ ] updateDisplayOrder(playerName, newOrder) 서버 함수
- **예상**: 2-3시간

**Option B (장기)**: v4.0.0 - Firebase 재구현
- [ ] Firebase Realtime Database 직접 연동
- [ ] WebSocket 기반 실시간 업데이트
- [ ] IndexedDB 로컬 캐싱
- [ ] Service Worker PWA 지원
- **예상**: 1-2주

**Option C (간단)**: 소규모 기능 추가
- 테이블 검색/필터, 칩리더 정렬, 일괄 칩 입력
- **예상**: 1-2시간

### 프로젝트 구조
- **Frontend**: [tracker.html](../tracker.html) (v3.5.2, ~600줄)
- **Backend**: [tracker_gs.js](../tracker_gs.js) (v3.5.2, ~1500줄)
- **Performance**: [performance_test.js](../performance_test.js) (v3.5.1, 성능 측정)
- **Version**: [version.js](../version.js) (v3.5.2, SSOT)
- **Spreadsheet**: `19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4` (독립)
- **문서**: [PLAN](PLAN.md) | [PRD](PRD.md) | [PRD_SUMMARY](PRD_SUMMARY.md) | [LLD](LLD.md)

### 배포 정보
- **Script ID**: `17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O`
- **최신 배포**: @24 (v3.5.2 - Number Badge & Introduction Checkbox)
- **웹앱 URL**: `https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec`
- **상태**: ✅ 안정 버전 (배포 준비 완료)

### 핵심 기능
1. **Key Player View**: 키 플레이어 목록 + 칩 변화량 + 번호 뱃지
2. **Table View**: 테이블별 9좌석 플레이어 관리
3. **CRUD 작업**: 칩 수정, 플레이어 추가/삭제, 플레이어 이동
4. **Player Photos**: 96px 프로필 사진 + 소개 체크박스 + 번호 순서
5. **Performance**: 배치 로딩 + CacheService (로딩 0.5초)

### PlayerPhotos 시트 구조 (v3.5.2)
```
A: PlayerName       - 플레이어 이름
B: PhotoURL         - Imgur URL
C: CreatedAt        - 생성 시간 (ISO 8601)
D: UpdatedAt        - 수정 시간 (ISO 8601)
E: Introduction     - 소개 체크박스 (TRUE/FALSE)
F: DisplayOrder     - 번호 순서 (1, 2, 3...)
```

### 독립성
- ✅ HandLogger 완전 분리
- ✅ 자체 스프레드시트 운영
- ✅ 별도 웹앱 배포 (doGet 진입점)
- ✅ PlayerPhotos 영구 저장 (Type 시트 독립)

### 기술 스택
- **Frontend**: HTML + Vanilla JS (라이브러리 없음)
- **Backend**: Google Apps Script
- **Data**: Google Sheets (Type + PlayerPhotos 시트)
- **Cache**: CacheService (30초 TTL)
- **Performance**: 배치 로딩 (getAllPlayerPhotosMap_)

---

## 🔗 관련 문서

- [PLAN.md](PLAN.md) - 프로젝트 비전 (페르소나/시나리오)
- [PRD.md](PRD.md) - 작업 목록 (Phase 1~3)
- [LLD.md](LLD.md) - 기술 설계 (AI 인덱스)
- [CHANGELOG.md](CHANGELOG.md) - 버전별 변경 이력
