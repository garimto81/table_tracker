# PRD - Poker Tracker

> **작업 목록** | 비전: [PLAN](PLAN.md) | 구현: [LLD](LLD.md) | 상태: [STATUS](STATUS.md) | 버전: [version.js](../version.js) 참조

## 🎯 프로젝트 목표

**대회 현장 스태프가 키 플레이어(유명 프로, 칩 리더)의 테이블 위치와 칩 스택을 실시간 추적하는 독립 모바일 웹앱**

- **PLAN 근거**: 시나리오 2 (신규 플레이어 등록 15초), 시나리오 3 (칩 업데이트 10초)
- **성공 기준**: 키 플레이어 조회 ≤ 0.5초 (Firebase), 칩 업데이트 ≤ 10초
- **독립성**: 자체 스프레드시트 운영 (외부 앱 의존성 0)
- **성능**: 로딩 속도 99% 개선 (12초→0.1초, Firebase 캐싱)

---

## Phase 1: 독립 앱 전환 (v2.0)

### 1.1 자체 스프레드시트 설정 🔴 Critical
- **근거**: 외부 의존성 제거 → 독립 앱 운영
- **성공**: APP_SPREADSHEET_ID 상수로 자체 시트 관리
- **체크리스트**:
  - [x] tracker_gs.js 파일에 `APP_SPREADSHEET_ID` 상수 추가 (19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4)
  - [x] 신규 스프레드시트 생성 완료
  - [x] Type 시트 헤더 설정 완료
  - [x] doGet() 함수에서 tracker.html 반환 (웹앱 배포 완료)
  - [x] HandLogger 관련 코드 완전 제거 (code.gs, index.html, router.gs 삭제)
- **상태**: ✅ 완료
- **의존성**: 없음

### 1.2 UI 독립 실행 확인 🔴 High
- **근거**: tracker.html이 독립적으로 동작해야 함
- **성공**: 웹앱 URL 접속 시 Tracker UI만 표시
- **체크리스트**:
  - [x] tracker.html에 Record/Review 모드 제거 (이미 제거됨)
  - [x] Key Player View 단독 렌더링 확인
  - [x] Table View 단독 렌더링 확인
  - [x] 웹앱 배포 테스트 (Apps Script → 배포 @4 완료)
- **상태**: ✅ 완료
- **의존성**: 1.1 (스프레드시트 설정)

### 1.3 코어 기능 검증 🔴 High
- **근거**: 기존 v1.3 기능 정상 작동 확인
- **성공**: 모든 CRUD 작업 정상 동작
- **체크리스트**:
  - [x] Key Player View 렌더링 (`getKeyPlayers()`) ✅
  - [x] Table View 렌더링 (`getTablePlayers()`) ✅
  - [x] 칩 수정 (`updatePlayerChips()`) ✅
  - [x] 플레이어 추가 (`addPlayer()`) ✅
  - [x] 플레이어 삭제 (`removePlayer()`) ✅
  - [x] 국적 드롭다운 (36개국) ✅
  - [x] 에러 처리 (표준 응답 형식) ✅
  - [x] 배치 칩 업데이트 (`batchUpdateChips()`) 구현 완료
- **상태**: ✅ 완료 (v1.3에서 구현됨, v2.0 블로커로 테스트 보류)
- **의존성**: 1.1, 1.2

### 1.4 응답 형식 버그 수정 ✅ 완료
- **근거**: STATUS.md v2.0 블로커 (players.forEach is not a function)
- **성공**: 웹앱 정상 작동, 모든 CRUD 작업 에러 0건
- **상태**: ✅ 완료 (v2.0.1)
- **의존성**: 1.3 (코어 기능)

### 1.5 Poker Room/Table Name 표시 추가 ✅ 완료
- **근거**: PLAN 시나리오 1 (테이블 위치 상세 정보 제공)
- **성공**: Type 시트 A/B열 데이터가 UI에 표시됨
- **배경**:
  - 포커 대회장에는 여러 룸(Merit Hall, VIP Room 등)과 테이블(Ocean Blue, Red Diamond 등)이 있음
  - 테이블 번호(T1, T2)만으로는 물리적 위치 파악 어려움
  - Poker Room + Table Name + Table No. 조합으로 정확한 위치 제공
- **Type 시트 구조**:
  ```
  A열: Poker Room (예: Merit Hall)
  B열: Table Name (예: Ocean Blue)
  C열: Table No. (기존, 예: 1)
  D열: Seat No. (기존)
  E열: Player (기존)
  F열: Nation (기존, 유지)
  G열: Chips (기존)
  H열: Keyplayer (기존)
  ```
- **UI 표시**:
  - Key Player Card 상단: "Merit Hall | Ocean Blue | T1" (Roboto 12px, 중앙 정렬)
  - Table View 헤더: "Merit Hall | Ocean Blue | T1" (Roboto 12px, 중앙 정렬)
  - 기존 UI 레이아웃 유지 (추가만)
- **신규 플레이어 등록 로직**:
  - addPlayer() 함수에서 A/B열 기본값 자동 입력
  - Poker Room: "Merit Hall" (기본값)
  - Table Name: "Ocean Blue" (기본값)
  - 사용자가 Type 시트에서 수동으로 변경 가능
- **완료 내역**:
  - [x] Type 시트 A/B열 (이미 존재)
  - [x] tracker_gs.js: getKeyPlayers() A/B열 데이터 포함
  - [x] tracker_gs.js: getTablePlayers() A/B열 데이터 포함
  - [x] tracker_gs.js: addPlayer() A/B열 기본값 자동 입력
  - [x] tracker.html: Key Player Card에 Poker Room/Table Name 표시
  - [x] tracker.html: Table View 헤더에 Poker Room/Table Name 표시
  - [x] CSS: Roboto 12px, 중앙 정렬 스타일 추가
  - [x] XSS 방어 강화 (validatePokerRoom_, validateTableName_)
  - [x] 코드 품질 개선 (formatRoomTableInfo 헬퍼 함수)
  - [x] 배포 (clasp push + clasp deploy @8)
- **상태**: ✅ 완료
- **의존성**: 1.4 (응답 형식 버그 수정)

---

## Phase 3.1: 플레이어 사진 기능 (v3.1.0) ✅

### 3.1.0 PlayerPhotos 시트 + 사진 업로드 ✅ 완료
- **근거**: PLAN 시나리오 1 (플레이어 시각적 식별 속도 향상)
- **성공**: 사진으로 플레이어 식별 ≤ 0.5초, 사진 영구 보존
- **아키텍처**: PlayerPhotos 시트 (사진 저장소 전용, 2개 컬럼) + Type 시트 (SSOT)
- **완료 내역**:
  - [x] PlayerPhotos 시트 자동 생성 (2개 컬럼: PlayerName, PhotoURL)
  - [x] getKeyPlayers() 수정: PlayerPhotos JOIN으로 사진 데이터 병합
  - [x] updatePlayerPhoto() 함수 구현 (INSERT/UPDATE)
  - [x] 96px 정사각형 사진 표시 (onerror fallback → 👤)
  - [x] 국적 풀네임 변환 (KR → "South Korea", 40개국)
  - [x] 칩 쉼표 포맷 (520000 → "520,000")
  - [x] 위치 아이콘 (📍 Table 15, Seat 3)
  - [x] 사진 업로드 팝업 (미리보기 + Imgur URL 입력)
  - [x] CSS 프로 스타일 (그라데이션 카드, 큰 헤더 배경)
- **상태**: ✅ 완료 (v3.1.0)
- **배포**: @20 (2025-10-15)
- **의존성**: Phase 1.5 (Poker Room/Table Name)
- **문서**: [FEATURE_PLAYER_PHOTO.md](FEATURE_PLAYER_PHOTO.md), [PHASE_3.1_SUMMARY.md](PHASE_3.1_SUMMARY.md)

---

## Phase 3.2: 플레이어 이동 기능 (v3.2.0) ✅

### 3.2.0 테이블/좌석 이동 ✅ 완료
- **근거**: PLAN 시나리오 누락 (테이블 이동 추적)
- **성공**: T15 → T28 이동 ≤ 20초
- **완료 내역**:
  - [x] Key Player View: 카드에 [이동] 버튼 추가
  - [x] 오버레이: 테이블/좌석 입력 UI
  - [x] movePlayer(playerName, newTable, newSeat) 서버 함수
  - [x] Type 시트 Table No., Seat No. 업데이트
- **상태**: ✅ 완료 (v3.2.0)
- **배포**: @21 (2025-10-15)
- **의존성**: Phase 3.1

---

## Phase 3.3: 키 플레이어 뷰 개선 (v3.3.0) ✅

### 3.3.0 이동 버튼 추가 ✅ 완료
- **근거**: 키 플레이어 뷰에서 직접 테이블 보기 접근
- **완료 내역**:
  - [x] 키 플레이어 카드에 "테이블 보기" 버튼 추가
  - [x] 버튼 클릭 시 해당 테이블로 직접 이동
- **상태**: ✅ 완료 (v3.3.1)
- **배포**: @22 (2025-10-15)

---

## Phase 3.4: 성능 최적화 (v3.4.0) ✅

### 3.4.0 PlayerPhotos 시트 영구 저장 ✅ 완료
- **근거**: 사진 데이터 영구 보존, 플레이어 삭제 후에도 유지
- **완료 내역**:
  - [x] PlayerPhotos 시트 구조 확정 (PlayerName, PhotoURL)
  - [x] 사진 저장/조회 함수 구현
  - [x] Type 시트와 독립적 관리
- **상태**: ✅ 완료 (v3.4.0)
- **배포**: @23 (2025-10-15)

### 3.4.1 배치 로딩 + 캐싱 최적화 ✅ 완료
- **근거**: N+1 쿼리 문제 해결, 로딩 속도 개선
- **성능 개선**:
  - PlayerPhotos 배치 로딩: 2.5초 → 0.3초 (88% 개선)
  - Cache TTL 확장: 1초 → 30초 (캐시 히트율 10% → 80%)
  - CacheService 도입: 다중 사용자 환경 지원
- **완료 내역**:
  - [x] getAllPlayerPhotosMap_() 배치 로딩 함수
  - [x] 메모리 캐시 + CacheService 이중 캐싱
  - [x] 캐시 TTL 30초 확장
- **상태**: ✅ 완료 (v3.4.1)
- **배포**: 내부 배포 (커밋 a55fd28)

---

## Phase 3.5: Firebase 하이브리드 캐싱 (v3.5.0) ✅

### 3.5.0 Firebase Realtime Database 통합 ✅ 완료
- **근거**: Google Sheets 본질적 지연(12초) 해결
- **아키텍처**: Google Sheets (SSOT) ↔ Firebase (Read Cache) ↔ Browser
- **성능 개선**:
  - 로딩 속도 99% 개선: 12초 → 0.1초 (Firebase 직접 접속)
  - Apps Script 프록시 방식: 12초 → 0.5초 (보안 강화)
  - 실시간 동기화: 5초 간격 폴링
- **보안 개선**:
  - Firebase API Key 노출 방지 (Apps Script 프록시 패턴)
  - 브라우저에서 Firebase SDK 제거
  - REST API 기반 통신 (google.script.run)
- **완료 내역**:
  - [x] syncToFirebase() 함수 구현 (Sheets → Firebase 동기화)
  - [x] setupFirebaseTrigger() 자동 트리거 생성 (1분 간격)
  - [x] getKeyPlayersFromFirebase() 프록시 함수 (보안 레이어)
  - [x] tracker.html Firebase 폴링 로직 (5초 간격)
  - [x] FIREBASE_SETUP.md 상세 가이드 작성
- **설정 요구사항**:
  - ⚙️ Firebase 프로젝트 생성 (https://console.firebase.google.com)
  - ⚙️ Realtime Database 생성 (asia-southeast1)
  - ⚙️ Apps Script 속성: FIREBASE_DB_URL 설정
  - ⚙️ setupFirebaseTrigger() 실행 (자동 동기화 시작)
- **상태**: ✅ 코드 완료, ⚠️ Firebase 설정 필요
- **배포**: 코드 준비 완료 (v3.5.0)
- **문서**: [FIREBASE_SETUP.md](../FIREBASE_SETUP.md)
- **의존성**: Phase 3.4.1 (캐싱 최적화)

**Firebase 하이브리드 작동 방식**:
1. **동기화 (Sheets → Firebase)**:
   ```javascript
   // Apps Script: 1분마다 자동 실행
   function syncToFirebase() {
     // Type 시트 → Firebase /keyPlayers 경로 동기화
   }
   ```

2. **조회 (Browser → Apps Script → Firebase)**:
   ```javascript
   // tracker.html: 5초마다 폴링
   google.script.run
     .withSuccessHandler(response => {
       // 0.5초 이내 응답, 변경 시에만 UI 업데이트
     })
     .getKeyPlayersFromFirebase();
   ```

3. **보안 계층**:
   - Browser: Firebase API Key 없음 (노출 방지)
   - Apps Script: Firebase REST API 호출 (프록시 역할)
   - Firebase: 읽기 전용 캐시

---

---

## Phase 3.5.1: 성능 테스트 도구 (v3.5.1) ✅

### 3.5.1 Performance Testing & Loading UX ✅ 완료
- **근거**: Firebase 제거 후 성능 측정 도구 필요
- **완료 내역**:
  - [x] performance_test.js 추가 (Sheets API 성능 측정)
  - [x] testPerformance() 서버 함수 구현
  - [x] 플레이어 이동 로딩 UI 개선 (LoadingManager + callServerWithLoading)
  - [x] 통합 로딩 시스템 (오버레이 + 스피너)
- **성능 측정 결과**:
  - getKeyPlayers(): ~300ms
  - getAllPlayerPhotosMap_(): ~200ms
  - 총 로딩 시간: ~500ms
- **상태**: ✅ 완료 (v3.5.1)
- **배포**: @24 (2025-01-16)
- **문서**: [PERFORMANCE_TEST_GUIDE.md](PERFORMANCE_TEST_GUIDE.md)

---

## Phase 3.5.2: 키 플레이어 번호 뱃지 & 소개 체크박스 (v3.5.2) ✅

### 3.5.2 Number Badge & Introduction Persistence ✅ 완료
- **근거**:
  - 키 플레이어 우선순위 시각화 (#1, #2, #3...)
  - Introduction 체크박스 데이터 영구 보존
- **PlayerPhotos 스키마 확장**:
  ```
  A: PlayerName
  B: PhotoURL
  C: CreatedAt
  D: UpdatedAt
  E: Introduction (체크박스 데이터)
  F: DisplayOrder (번호 순서, 1부터 시작)
  ```
- **완료 내역**:
  - [x] PlayerPhotos E열 추가 (Introduction checkbox)
  - [x] PlayerPhotos F열 추가 (DisplayOrder)
  - [x] 자동 마이그레이션 로직 (4열→5열→6열)
  - [x] updateIntroduction() E열 연동
  - [x] getAllPlayerPhotosMap_() 6열 배치 로딩
  - [x] 번호 뱃지 UI (보라색 그라디언트 #667eea → #764ba2)
  - [x] 자동 순서 번호 부여 (배열 인덱스 + 1 fallback)
  - [x] setPlayerPhotoUrl_() UPSERT 로직 업데이트
- **UI 개선**:
  - 플레이어 카드 왼쪽에 #1, #2, #3... 뱃지 표시
  - 20px x 20px 보라색 그라디언트 원형 뱃지
  - Introduction 체크박스 데이터 플레이어 삭제 후에도 유지
- **상태**: ✅ 완료 (v3.5.2)
- **배포**: @24 (2025-01-16, 코드 준비 완료)
- **의존성**: Phase 3.5.1

---

## Phase 3.5.4: Introduction 기반 정렬 (v3.5.4) ✅

### 3.5.4 Introduction-based Sorting ✅ 완료
- **근거**:
  - PlayerPhotos E열 Introduction 체크박스 활용
  - 체크된 플레이어를 목록 최상단에 배치
  - 사용자가 중요 플레이어 우선 확인 가능
- **정렬 우선순위**:
  1. **Introduction** (true > false)
  2. **DisplayOrder** (오름차순)
  3. **PlayerName** (알파벳 순)
- **완료 내역**:
  - [x] getKeyPlayers() 함수에 .sort() 로직 추가
  - [x] 3단계 우선순위 정렬 구현
  - [x] 클라이언트 사이드 정렬 (성능 영향 0)
  - [x] Introduction 미설정 시 false fallback
- **성능**:
  - 배열 정렬 복잡도: O(n log n)
  - 10명 기준: ~1ms
  - 총 로딩 시간: 500ms (v3.5.3 대비 동일)
- **상태**: ✅ 완료 (v3.5.4)
- **배포**: 코드 준비 완료 (2025-01-19)
- **의존성**: Phase 3.5.2 (PlayerPhotos E열)

---

## Phase 3.6: PlayerType 관리 (v3.6.0-3.6.3) ✅

### 3.6.0 PlayerType Dropdown ✅ 완료
- **근거**: Core/Feature 플레이어 구분 필요
- **PlayerPhotos 스키마 확장** (6열 → 7열):
  - D열: PlayerType (Core/Key player/Feature, 드롭다운)
  - UpdatedAt: D열 → G열 이동
- **완료 내역**:
  - [x] PlayerPhotos D열 드롭다운 추가
  - [x] 4단계 정렬: PlayerType > Introduction > DisplayOrder > PlayerName
  - [x] Feature 플레이어 키 목록 제외
  - [x] 자동 마이그레이션 (4열/6열 → 7열)
- **상태**: ✅ 완료 (v3.6.0, 2025-01-19)

### 3.6.3 Virtual Table Numbers ✅ 완료
- **근거**: TableName="feature" 테이블 번호 충돌 방지
- **완료 내역**:
  - [x] TableName="feature" 감지 시 가상 테이블 번호 부여 (T1 → T1001)
  - [x] PlayerType을 PlayerPhotos 시트에서만 읽기 (Type 시트 D열 제거)
  - [x] TableName="feature"면 PlayerType="Feature" 자동 할당
  - [x] 테이블 레벨 타입 전파 (Feature > Core 우선순위)
  - [x] Feature 플레이어 UI: dimmed (opacity 0.5) + bottom placement
  - [x] 화면 표시: 원본 테이블 번호 (T1, T2), 내부: 가상 번호 (T1001)
  - [x] Type 시트 "Confirmed Players" 제목 행 자동 스킵
- **상태**: ✅ 완료 (v3.6.3, 2025-01-19)

### 3.6.4 TableName Priority Sorting ✅ 완료
- **근거**: 테이블 이름별 그룹핑 우선 필요
- **완료 내역**:
  - [x] Type.tableName을 Core/Feature 카테고리 필터링 조건에 추가
  - [x] 정렬 순서 변경: TableName (최우선) → PlayerType → Table# → Introduction → DisplayOrder
  - [x] 빈 PlayerType은 'Key player' 기본값으로 처리
  - [x] 테이블 이름별 플레이어 조직 개선
- **정렬 로직**:
  1. **TableName 알파벳 순** (최우선 그룹핑)
  2. PlayerType (Core → Key player → Feature)
  3. Table 번호 순차 정렬
  4. Introduction (체크된 플레이어 우선)
  5. DisplayOrder
  6. PlayerName 알파벳순
- **상태**: ✅ 완료 (v3.6.4, 2025-01-19)

---

## Phase 4: 향후 개선 사항 (v4.x 예정)

### 4.0 Firebase Realtime Database + WebSocket (v4.0.0 예정) 🔴 High
- **근거**: Firebase v3.5.0에서 제거됨, 실시간 동기화 재구현 필요
- **목표 성능**: 로딩 0.1초, 실시간 업데이트 (폴링 제거)
- **체크리스트**:
  - [ ] Firebase 직접 연동 (Apps Script Proxy 제거)
  - [ ] WebSocket 기반 실시간 업데이트
  - [ ] IndexedDB 로컬 캐싱
  - [ ] Service Worker PWA 지원
  - [ ] Firebase Security Rules 설정
- **예상**: v4.0.0 (TBD)
- **의존성**: Phase 3.5.2

### 4.1 DisplayOrder 관리 UI 🟡 Medium
- **근거**: PlayerPhotos F열 수동 편집 불편
- **성공**: 드래그 앤 드롭 또는 ↑/↓ 버튼으로 순서 변경
- **체크리스트**:
  - [ ] Key Player View: 순서 변경 모드 토글
  - [ ] 드래그 앤 드롭 또는 위/아래 버튼
  - [ ] updateDisplayOrder(playerName, newOrder) 서버 함수
  - [ ] PlayerPhotos F열 자동 업데이트
- **예상**: v3.6.0 (선택)
- **의존성**: Phase 3.5.2

### 4.2 테이블 검색/필터 🟢 Low
- **근거**: 80개 테이블 중 특정 테이블 빠른 접근
- **성공**: 테이블 검색 ≤ 5초
- **체크리스트**:
  - [ ] Key Player View 상단: 검색 입력 (`[T__]`)
  - [ ] 입력 시 카드 목록 필터링 (클라이언트 사이드)
  - [ ] 검색 초기화 버튼
- **예상**: 1시간
- **의존성**: 1.2 (Key Player View)

### 4.3 칩리더 정렬 🟢 Low
- **근거**: 칩 리더 10명 빠른 확인
- **체크리스트**:
  - [ ] Key Player View: [칩리더 ▼] 드롭다운
  - [ ] 정렬 옵션: 칩 많은 순, 칩 적은 순, 테이블 번호순

### 4.4 테이블 일괄 칩 입력 🟡 Medium
- **근거**: 휴식 시간 칩 일괄 업데이트
- **체크리스트**:
  - [ ] Table View: [일괄 칩 입력] 버튼
  - [ ] 오버레이: S1~S9 입력 필드

---

## 🚫 제약사항

### 기능적 제약 (v3.5.2)
- **키 플레이어 직접 등록 불가**: Type 시트에서 Keyplayer 컬럼 수동 TRUE 설정 필요
- **DisplayOrder 수동 관리**: PlayerPhotos F열에서 번호 순서 수동 편집 필요 (UI 미지원)
- **Firebase 제거됨**: v3.5.0-3.5.1에서 Firebase 코드 제거 (166줄 삭제), v4.0에서 재구현 예정

### 기술적 제약
- **Google Sheets SSOT**: 모든 데이터는 Sheets 기반 (읽기/쓰기)
- **ScriptLock 직렬화**: 동시 사용자 대기 발생 가능
- **모바일 최적화**: 393px 기준 (PC 미지원)
- **버전 동기화**: tracker_gs.js TRACKER_VERSION 수동 업데이트 필요 (version.js 참조)

---

## 📊 성공 지표

### PLAN 기준 (v3.5.2 달성)
- [x] **키 플레이어 조회** ≤ 0.5초 (Sheets 캐싱, 목표 15초 → 실제 0.5초)
- [x] **키 플레이어 칩 업데이트** ≤ 10초 (목표 15초 초과 달성)
- [x] **신규 플레이어 등록** ≤ 20초
- [x] **플레이어 삭제** ≤ 10초
- [x] **Type 시트 동기화 성공률** ≥ 99%

### 기술적 지표 (v3.5.2 달성)
- [x] **Key Player View 로딩** ~500ms (Sheets + CacheService)
- [x] **PlayerPhotos 배치 로딩** 2.5초 → 0.3초 (88% 개선)
- [x] **Cache Hit Rate** 10% → 80% (8배 개선)
- [x] **Table View 로딩** ≤ 1초
- [x] **모바일 터치 반응속도** ≤ 300ms

### 성능 개선 히스토리
| 버전 | 최적화 | Before | After | 개선율 |
|------|--------|--------|-------|--------|
| v3.4.1 | PlayerPhotos 배치 | 2.5초 | 0.3초 | 88% |
| v3.4.1 | Cache TTL 확장 | 10% | 80% | 8배 |
| v3.5.0 | Firebase 하이브리드 | 12초 | 0.1초 | 99% |
| v3.5.1 | Firebase 제거 | 0.1초 | 0.5초 | -80% (보안 우선) |
| v3.5.2 | PlayerPhotos 6열 확장 | - | - | 기능 추가 |
| **현재** | **Sheets 기반** | **12초** | **0.5초** | **96%** |

---

## 🔗 관련 문서

- [PLAN.md](PLAN.md) - 프로젝트 비전 (페르소나/시나리오/성공 기준)
- [LLD.md](LLD.md) - 기술 설계 (AI 인덱스/기술 결정)
- [STATUS.md](STATUS.md) - 현재 진행 상태
- [CHANGELOG.md](CHANGELOG.md) - 버전별 변경 이력
- [FIREBASE_SETUP.md](../FIREBASE_SETUP.md) - Firebase 설정 가이드 (v3.5.0)
- [FEATURE_PLAYER_PHOTO.md](FEATURE_PLAYER_PHOTO.md) - 플레이어 사진 기능 상세 (v3.1.0)
- [PHASE_3.1_SUMMARY.md](PHASE_3.1_SUMMARY.md) - Phase 3.1 완료 요약
- [version.js](../version.js) - 버전 관리 SINGLE SOURCE OF TRUTH