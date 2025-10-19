# PRD Summary - Poker Tracker

> **빠른 참조 문서** | 전체 PRD: [PRD.md](PRD.md) | 버전: [version.js](../version.js)

---

## 📊 현재 상태 (v3.6.3)

**버전**: v3.6.3
**이름**: Virtual Table Numbers for Feature Tables
**배포일**: 2025-01-19
**배포 ID**: @24
**상태**: ✅ 코드 완료, 배포 준비 완료

---

## 🎯 핵심 기능

### 1. 키 플레이어 추적 (Phase 1-3.3) ✅
- Type 시트 기반 SSOT (Single Source of Truth)
- Key Player View + Table View 독립 웹앱
- 실시간 칩 업데이트, 플레이어 이동 추적
- Poker Room/Table Name 위치 정보 표시

### 2. 플레이어 사진 시스템 (Phase 3.1-3.4) ✅
- PlayerPhotos 시트 (6열 구조)
- 96px 정사각형 프로필 사진
- 사진 영구 보존 (플레이어 삭제 후에도 유지)
- 배치 로딩 최적화 (2.5초 → 0.3초)

### 3. 번호 뱃지 & 소개 체크박스 (Phase 3.5.2) ✅
- **번호 뱃지**: 키 플레이어 우선순위 시각화 (#1, #2, #3...)
- **보라색 그라디언트 UI**: #667eea → #764ba2
- **Introduction 체크박스**: PlayerPhotos E열로 이동 (영구 보존)
- **DisplayOrder 관리**: PlayerPhotos F열 (자동 번호 부여)

### 4. PlayerType 관리 (Phase 3.6.0-3.6.3) ✅ 최신
- **PlayerType 드롭다운**: PlayerPhotos D열 (Core/Key player/Feature)
- **4단계 정렬**: PlayerType > Introduction > DisplayOrder > PlayerName
- **가상 테이블 번호**: TableName="feature" → T1001+ (충돌 방지)
- **테이블 레벨 타입 전파**: Feature > Core 우선순위
- **Feature 플레이어 UI**: 비활성화 표시 + 하단 배치

---

## 🗂️ PlayerPhotos 시트 구조

```
A: PlayerName       - 플레이어 이름
B: PhotoURL         - Imgur URL
C: CreatedAt        - 생성 시간 (ISO 8601)
D: PlayerType       - Core/Key player/Feature (드롭다운)
E: Introduction     - 소개 체크박스 (TRUE/FALSE)
F: DisplayOrder     - 번호 순서 (1, 2, 3...)
G: UpdatedAt        - 수정 시간 (ISO 8601)
```

**자동 마이그레이션**: 4열 → 6열 → 7열 (기존 시트 자동 업그레이드)

---

## 📈 성능 지표

### 목표 달성 현황
| 지표 | 목표 | 실제 | 상태 |
|------|------|------|------|
| 키 플레이어 조회 | ≤ 15초 | 0.5초 | ✅ 97% 개선 |
| 칩 업데이트 | ≤ 15초 | 10초 | ✅ 목표 달성 |
| PlayerPhotos 로딩 | - | 0.3초 | ✅ 88% 개선 |
| Cache Hit Rate | - | 80% | ✅ 8배 향상 |

### 성능 개선 누적
```
v3.4.1: 배치 로딩 + 캐싱 (75% 개선)
v3.5.0: Firebase 하이브리드 (99% 개선) → v3.5.1에서 제거
v3.5.1: 성능 테스트 도구 추가
v3.5.2: PlayerPhotos 6열 확장 (기능 추가)

현재: 12초 → 0.5초 (96% 총 개선)
```

---

## 🚀 배포 정보

**웹앱 URL**: https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec

**Script ID**: 17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O

**Spreadsheet ID**: 19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4

**배포 명령어**:
```bash
npx @google/clasp push
npx @google/clasp deploy
```

---

## 🔄 다음 진행 사항

### Phase 3.5.2 완료 후 선택지

#### Option A: v3.6.0 - DisplayOrder 관리 UI (추천)
**소요 시간**: 2-3시간
**우선순위**: Medium
**목적**: PlayerPhotos F열 수동 편집 불편함 해결

**구현 내역**:
- [ ] Key Player View에 순서 변경 모드 토글
- [ ] 드래그 앤 드롭 또는 ↑/↓ 버튼
- [ ] updateDisplayOrder(playerName, newOrder) 서버 함수
- [ ] PlayerPhotos F열 자동 업데이트

**근거**: 현재 사용자는 Google Sheets에서 F열을 수동으로 편집해야 하므로 UX 개선 필요

---

#### Option B: v4.0.0 - Firebase 재구현 (장기)
**소요 시간**: 1-2주
**우선순위**: High (장기)
**목적**: 실시간 동기화 + 로딩 속도 극대화

**구현 내역**:
- [ ] Firebase Realtime Database 직접 연동
- [ ] WebSocket 기반 실시간 업데이트 (폴링 제거)
- [ ] IndexedDB 로컬 캐싱
- [ ] Service Worker PWA 지원
- [ ] Firebase Security Rules 설정

**근거**: v3.5.0에서 Firebase 코드 제거 (166줄 삭제), 보안 우선으로 Apps Script Proxy 방식 사용 중이나, 성능 극대화를 위해 재구현 필요

**성능 목표**:
- 현재: 0.5초 (Sheets + CacheService)
- 목표: 0.1초 (Firebase 직접 접속)

---

#### Option C: 소규모 기능 추가 (1-2시간)
**우선순위**: Low
**선택지**:
- 테이블 검색/필터 (Key Player View 상단 검색 박스)
- 칩리더 정렬 (칩 많은 순/적은 순 드롭다운)
- 테이블 일괄 칩 입력 (Table View 일괄 입력 UI)

---

## 🚫 현재 제약사항

### 기능적 제약
- **키 플레이어 등록**: Type 시트에서 Keyplayer 컬럼 수동 TRUE 설정 필요 (UI 미지원)
- **DisplayOrder 관리**: PlayerPhotos F열 수동 편집 필요 (UI 미지원)
- **Firebase 제거됨**: v3.5.0-3.5.1에서 제거, v4.0에서 재구현 예정

### 기술적 제약
- **Google Sheets SSOT**: 모든 데이터는 Sheets 기반 (읽기/쓰기)
- **ScriptLock 직렬화**: 동시 사용자 대기 발생 가능
- **버전 동기화**: tracker_gs.js TRACKER_VERSION 수동 업데이트 필요 (version.js 참조)

---

## 📁 핵심 파일

| 파일 | 버전 | 역할 |
|------|------|------|
| [tracker_gs.js](../tracker_gs.js) | v3.6.3 | 서버 로직 (Apps Script) |
| [tracker.html](../tracker.html) | v3.6.3 | UI + 클라이언트 로직 |
| [version.js](../version.js) | v3.6.3 | 버전 관리 SSOT |
| [performance_test.js](../performance_test.js) | v3.5.1 | 성능 측정 도구 |
| [appsscript.json](../appsscript.json) | v3.2.0 | Apps Script 설정 |

---

## 🎯 추천 다음 단계

**즉시 시작 가능 (v3.5.2 완료 직후)**:
1. ✅ **웹앱 테스트**: 번호 뱃지 + 소개 체크박스 동작 확인
2. ✅ **PlayerPhotos 시트 확인**: E/F열 자동 마이그레이션 검증
3. ⏳ **DisplayOrder 데이터 입력**: F열에 1, 2, 3... 수동 입력 (선택)

**다음 개발 선택**:
- **Option A (추천)**: v3.6.0 DisplayOrder 관리 UI (2-3시간, UX 개선)
- **Option B (장기)**: v4.0.0 Firebase 재구현 (1-2주, 성능 극대화)
- **Option C (간단)**: 소규모 기능 추가 (1-2시간, 검색/정렬)

---

## 📚 관련 문서

- [PRD.md](PRD.md) - 전체 요구사항 문서
- [STATUS.md](STATUS.md) - 현재 진행 상태
- [CHANGELOG.md](CHANGELOG.md) - 버전별 변경 이력
- [LLD.md](LLD.md) - 기술 설계
- [PLAN.md](PLAN.md) - 프로젝트 비전
- [version.js](../version.js) - 버전 관리 SSOT

---

**마지막 업데이트**: 2025-01-19
**작성자**: Claude Code
**다음 리뷰**: v4.0.0 시작 시
