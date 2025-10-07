# PRD - Poker Tracker

> **작업 목록** | 비전: [PLAN](PLAN.md) | 구현: [LLD](LLD.md) | 상태: [STATUS](STATUS.md) | 버전: [version.js](../version.js) 참조

## 🎯 프로젝트 목표

**대회 현장 스태프가 키 플레이어(유명 프로, 칩 리더)의 테이블 위치와 칩 스택을 실시간 추적하는 독립 모바일 웹앱**

- **PLAN 근거**: 시나리오 2 (신규 플레이어 등록 15초), 시나리오 3 (칩 업데이트 10초)
- **성공 기준**: 키 플레이어 칩 업데이트 ≤ 15초, 신규 플레이어 등록 ≤ 20초
- **독립성**: 자체 스프레드시트 운영 (외부 앱 의존성 0)

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

## Phase 2: 편의성 개선 (v2.3 예정)

### 2.1 키 플레이어 테이블 이동 🟡 Medium
- **근거**: PLAN 시나리오 누락 (테이블 이동 추적)
- **성공**: T15 → T28 이동 ≤ 20초
- **체크리스트**:
  - [ ] Key Player View: 카드에 [이동] 버튼 추가
  - [ ] 오버레이: 테이블 입력 (T__) + 좌석 자동/수동 선택
  - [ ] `movePlayer(oldTable, oldSeat, newTable, newSeat)` 서버 함수
  - [ ] Type 시트 Table No., Seat No. 업데이트
- **예상**: 2시간
- **의존성**: 1.2 (Key Player View)

---

### 2.2 테이블 검색/필터 🟢 Low
- **근거**: 80개 테이블 중 특정 테이블 빠른 접근
- **성공**: 테이블 검색 ≤ 5초
- **체크리스트**:
  - [ ] Key Player View 상단: 검색 입력 (`[T__]`)
  - [ ] 입력 시 카드 목록 필터링 (클라이언트 사이드)
  - [ ] 검색 초기화 버튼
- **예상**: 1시간
- **의존성**: 1.2 (Key Player View)

---

### 2.3 칩리더 정렬 🟢 Low
- **근거**: 칩 리더 10명 빠른 확인
- **성공**: 칩 내림차순 정렬 ≤ 2초
- **체크리스트**:
  - [ ] Key Player View: [칩리더 ▼] 드롭다운
  - [ ] 정렬 옵션: 칩 많은 순, 칩 적은 순, 테이블 번호순
  - [ ] localStorage 정렬 설정 저장
- **예상**: 1시간
- **의존성**: 1.2 (Key Player View)

---

### 2.4 칩 변화량 추적 개선 🟢 Low
- **근거**: 데이터 시각화
- **성공**: 칩 변화량 색상 코딩 (↑ 녹색, ↓ 빨강)
- **체크리스트**:
  - [ ] localStorage에 칩 이력 저장 (최근 3회)
  - [ ] 칩 변화량 CSS 클래스 (`.chip-up`, `.chip-down`)
  - [ ] 변화율 표시 (+50% 등)
- **예상**: 1.5시간
- **의존성**: 1.2 (Key Player View)

---

## Phase 3: 일괄 작업 (v1.2 예정)

### 3.1 테이블 일괄 칩 입력 🟡 Medium
- **근거**: 휴식 시간 칩 일괄 업데이트
- **성공**: 9명 칩 입력 ≤ 60초
- **체크리스트**:
  - [ ] Table View: [일괄 칩 입력] 버튼
  - [ ] 오버레이: S1~S9 입력 필드 (Enter로 다음 이동)
  - [ ] `updateTableChipsBulk(tableId, chipsArray)` 서버 함수
  - [ ] Type 시트 일괄 업데이트 (batchUpdate)
- **예상**: 3시간
- **의존성**: 1.3 (Table View)

---

### 3.2 Type 시트 초기화 🟢 Low
- **근거**: 신규 대회 시작 시 데이터 초기화
- **성공**: Type 시트 전체 삭제 ≤ 5초
- **체크리스트**:
  - [ ] 설정 모드에 [Type 초기화] 버튼
  - [ ] 확인 다이얼로그 (위험 경고)
  - [ ] `clearTypeSheet()` 서버 함수 (헤더 제외 전체 삭제)
- **예상**: 1시간
- **의존성**: 없음

---

## 🚫 제약사항

### 기능적 제약 (v1.0)
- **키 플레이어 직접 등록 불가**: Type 시트에서 Keyplayer 컬럼 수동 TRUE 설정 필요
- **테이블 이동 미지원**: v1.1에서 추가 예정
- **일괄 작업 미지원**: 칩 일괄 입력, 테이블 초기화 v1.2 예정

### 기술적 제약
- **Type 시트 의존성**: Tracker는 Type 시트만 사용 (HANDS/ACTIONS 독립)
- **ScriptLock 직렬화**: 동시 사용자 대기 발생 가능
- **모바일 최적화**: 393px 기준 (PC 미지원)

---

## 📊 성공 지표

### PLAN 기준
- [ ] **키 플레이어 칩 업데이트** ≤ 15초 (현재: 종이 메모 → 30분)
- [ ] **신규 플레이어 등록** ≤ 20초
- [ ] **플레이어 삭제** ≤ 10초
- [ ] **Type 시트 동기화 성공률** ≥ 99%

### 기술적 지표
- [ ] **Key Player View 로딩** ≤ 2초
- [ ] **Table View 로딩** ≤ 1초
- [ ] **모바일 터치 반응속도** ≤ 300ms

---

## 🔗 관련 문서

- [PLAN.md](PLAN.md) - 프로젝트 비전 (페르소나/시나리오/성공 기준)
- [LLD.md](LLD.md) - 기술 설계 (AI 인덱스/기술 결정)
- [STATUS.md](STATUS.md) - 현재 진행 상태
- [CHANGELOG.md](CHANGELOG.md) - 버전별 변경 이력