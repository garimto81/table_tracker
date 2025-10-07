# CHANGELOG - Poker Tracker

> **변경 이력** | 현재 버전: [version.js](../version.js) 참조

## v2.2.0 (2025-10-07) - Poker Room/Table Name 표시 추가 📍

### 🎯 핵심 기능
- **Poker Room/Table Name 표시**:
  - Type 시트 A/B열 추가 (Poker Room, Table Name)
  - Key Player Card: "Merit Hall | Ocean Blue | T1" 표시
  - Table View 헤더: "Merit Hall | Ocean Blue | T1" 표시
  - CSS: Roboto 12px, 중앙 정렬, 말줄임(...) 처리

### 🔒 보안 강화
- **XSS 방어 함수 추가**:
  - `validatePokerRoom_(room)` - HTML 태그 제거 + 50자 제한
  - `validateTableName_(name)` - HTML 태그 제거 + 50자 제한
  - 정규식: `/<[^>]*>/g`

### 🎯 신규 플레이어 등록 로직
- **addPlayer()** 함수 수정:
  - A/B열(Poker Room, Table Name) 기본값 자동 입력
  - Poker Room: "Merit Hall" (기본값)
  - Table Name: "Ocean Blue" (기본값)
  - Type 시트에서 수동 변경 가능

### 🧠 코드 품질
- **formatRoomTableInfo()** 헬퍼 함수 추가 (중복 제거)
- 폰트 크기 개선: 11px → 12px (모바일 가독성)
- 오버플로 처리: text-overflow:ellipsis

### 📝 버전 관리
- **version.js** 생성: SINGLE SOURCE OF TRUTH
  - 모든 버전 정보를 1곳에서 관리
  - 배포 정보, 파일별 버전, 상태, 다음 계획 통합
  - Google Apps Script + Browser 양방향 export

### 📦 배포
- **@8 배포 완료** (2025-10-07)
- Deployment ID: `AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA`

### ✅ 배포 상태
- @9 배포 예정 (신규 플레이어 등록 로직 추가)
- 웹앱 테스트 필요 (신규 플레이어 추가 시 A/B열 기본값 확인)

---

## v2.0.2 (2025-10-07) - XSS 방어 강화 🔒

### 🔒 보안 강화
- **XSS 방어 함수 추가**:
  - `validatePokerRoom_(room)` - Poker Room 이름 검증 + HTML 태그 제거
  - `validateTableName_(name)` - Table Name 검증 + HTML 태그 제거
  - 최대 길이: 50자 제한
  - 정규식 기반 HTML 태그 제거: `/<[^>]*>/g`
- **검증 적용**:
  - `getKeyPlayers()` (321-322줄) - Poker Room/Table Name 검증 적용
  - `getTablePlayers()` (369-370줄) - Poker Room/Table Name 검증 적용

### 📝 변경 사항
- tracker_gs.js v2.0.1 → v2.0.2
- 입력 검증 섹션 (88줄 아래): 검증 함수 2개 추가
- 기존 로직 정상 작동 (하위 호환성 유지)

### 🐛 코드 리뷰 피드백 반영
- code-reviewer 에이전트 XSS 취약점 발견
- Poker Room/Table Name 필드에 악성 스크립트 삽입 가능성 차단
- 사용자 입력 데이터 정제 프로세스 강화

---

## v2.2.0 (2025-10-07) - Poker Room/Table Name 표시 추가 📍 (진행 중)

### 📋 문서 작업
- **PLAN.md 업데이트**:
  - 시나리오 1: "Merit Hall | Ocean Blue | T15" 표시 반영
  - UI 모습: Key Player Card + Table View 헤더에 Poker Room/Table Name 추가
- **PRD.md Phase 1.5 추가**:
  - Type 시트 구조 변경 (A/B열 추가)
  - UI 스타일: Roboto 11px, 중앙 정렬
  - 8개 체크리스트 (Type 시트, tracker_gs.js, tracker.html, CSS, 배포, 테스트)
- **LLD.md 설계 추가**:
  - 기술 결정 7: "왜 Poker Room/Table Name 추가?"
  - 아키텍처: Type 시트 컬럼 구조 업데이트
  - AI 인덱스: PRD 1.5 참조 추가

### 📦 예정 작업
- [ ] Type 시트 A/B열 추가 (Poker Room, Table Name)
- [ ] tracker_gs.js: getKeyPlayers()/getTablePlayers() A/B열 데이터 포함
- [ ] tracker.html: Key Player Card + Table View 헤더에 Poker Room/Table Name 표시
- [ ] CSS: Roboto 11px, 중앙 정렬 스타일
- [ ] 배포: clasp push + clasp deploy @7
- [ ] 테스트: Poker Room/Table Name 표시 확인

### 📝 문서 동기화
- 모든 문서 버전 v2.1.0 → v2.2.0 업데이트
- STATUS.md: 진행 중 상태 (Phase 1.5, 30% 완료)

---

## v2.1.0 (2025-10-07) - Nationality 입력 UX 개선 🎨

### 🎨 UX 개선
- **Nationality 입력 방식 변경**:
  - 드롭다운 (10개 고정) → 텍스트 입력 (무제한)
  - 이유: 사용자가 원하는 국가 코드를 자유롭게 입력 가능
  - 제약: 2자 대문자 (예: KR, US, JP)
  - 자동 대문자 변환 (`text-transform:uppercase`)
  - 입력 검증 추가 (빈 값 체크)

### 📦 배포
- clasp push 완료 (3 files)
- **clasp deploy @6 완료** (웹앱 재배포)
  - Deployment ID: `AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA`
  - 설명: "v1.5 - Nationality input method changed (dropdown → text)"

### 📝 변경 사항
- tracker.html v1.4 → v1.5
- `addPlayerPrompt()` 함수 (299줄): `<select>` → `<input type="text">`
- `confirmAddPlayer()` 함수 (317줄): `.value` → `.value.trim().toUpperCase()`
- 입력 placeholder: "국가 코드 (예: KR, US, JP)"
- maxlength="2" 제약 추가

### 📊 PRD 진행 상황
- Phase 1.4 완료 ✅ (응답 형식 버그 수정 완료, 테스트 통과)
- Phase 2 작업 준비 (키 플레이어 테이블 이동, 검색/필터, 정렬 등)

---

## v2.0.1 (2025-10-07) - 응답 형식 버그 수정 🐛

### 🐛 버그 수정 (Critical)
- **클라이언트/서버 응답 형식 불일치 해결**:
  - `TypeError: players.forEach is not a function` 완전 수정
  - tracker.html 5개 함수 응답 처리 수정:
    1. `loadKeyPlayers()` (132줄) - response.data.players 추출
    2. `loadTablePlayers()` (192줄) - response.data.players 추출
    3. `confirmEditChips()` (271줄) - response.success 체크
    4. `confirmAddPlayer()` (351줄) - response.success 체크
    5. `deletePlayerConfirm()` (377줄) - response.success 체크
  - 에러 핸들링 강화 (모든 함수에 response.success 체크 추가)

### 📦 배포
- clasp push 완료 (3 files: appsscript.json, tracker_gs.js, tracker.html)
- **clasp deploy @5 완료** (웹앱 재배포)
  - Deployment ID: `AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA`
  - 설명: "v2.0.1 - Response format bug fix"

### 🔧 배포 이슈 해결
- **문제**: clasp push 후에도 웹앱에서 에러 발생
- **원인**: clasp push는 코드만 업로드 (Draft 상태), 웹앱 자동 재배포 안 됨
- **해결**: `clasp deploy -i <DEPLOYMENT_ID>` 실행 필수
- **참고**: LLD.md:194-213 배포 프로세스 문서화

### 📝 문서 업데이트
- 모든 문서 버전 v2.0 → v2.0.1 동기화
- PRD Phase 1.4 체크리스트 9/10 완료 (테스트 제외)
- STATUS 상태: 블로커 → 테스트 필요 (배포 완료)
- LLD.md: 배포 이슈 해결 섹션 추가

---

## v2.0 (2025-10-07) - 독립 앱 전환 🎉

### 🎯 핵심 변경
- **독립 앱 전환**:
  - HandLogger 의존성 완전 제거 (code.gs, index.html, router.gs 삭제)
  - 자체 스프레드시트 운영 (`19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4`)
  - 별도 웹앱 배포 (Script ID: `17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O`)

### 📝 문서 재구성
- **페르소나 변경**: Henry.Lee (데이터 매니저) → Sophie.Park (테이블 매니저)
- **문서 독립화**: PLAN/PRD/LLD/STATUS/CHANGELOG 표준화
- **버전 통일**: v2.0 (5개 문서 동기화)

### ⚠️ 알려진 이슈 (v2.0.1 예정)
- **블로커**: 클라이언트/서버 응답 형식 불일치
  - 에러: `TypeError: players.forEach is not a function`
  - 원인: tracker_gs.js v1.3.0 (표준 응답) ↔ tracker.html v1.4 (구버전 응답 기대)
  - 서버 응답: `{ success: true, data: { players: [...] }, meta: {...} }`
  - 클라이언트 기대: `[...]` (배열 직접)
  - 해결 계획 (PRD Phase 1.4):
    - tracker.html 5개 함수 응답 처리 수정
    - 에러 핸들링 추가 (response.success 체크)
    - 라인: 132, 201, 345, 412, 478

### 📂 파일 구조
```
프로젝트/
├── tracker_gs.js (v1.3.0 Refactored, 619줄)
├── tracker.html (v1.4, 825줄)
├── appsscript.json
└── docs/
    ├── PLAN.md (v2.0)
    ├── PRD.md (v2.0)
    ├── LLD.md (v2.0)
    ├── STATUS.md (v2.0)
    └── CHANGELOG.md (v2.0)
```

### 🔧 기술 개선
- **표준 응답 형식** (tracker_gs.js v1.3.0):
  - 성공: `{ success: true, data: {...}, meta: { timestamp, version } }`
  - 실패: `{ success: false, error: { code, message, details } }`
  - 장점: 에러 핸들링 통일, 메타데이터 활용
  - 트레이드오프: 클라이언트 수정 필요 (v2.0.1 예정)

---

## v1.2.0 (2025-10-06) - Performance Optimized ⚡

### ⚡ 성능 최적화 (Major)
- **PropertiesService 캐싱 (30초 TTL)**:
  - 읽기 속도: 1.5초 → 0.1초 (캐시 히트 시 **93% 개선**)
  - API 절약: 100 reads/30초 → 1 read/30초
  - 자동 무효화: 쓰기 작업 시 즉시 캐시 삭제
- **getRange 범위 최적화**:
  - `getDataRange()` → `getRange(1,1,lastRow,lastCol)`
  - 읽기 셀 수: 20,000셀 → 1,440셀 (**86% 감소**)
  - 처리 시간: 1.5초 → 0.8초 (**47% 개선**)
- **배치 칩 업데이트 (신규)**:
  - `batchUpdateChips()` 함수 추가
  - 10명 업데이트: 25초 → 2.5초 (**90% 개선**)
  - API 호출: 10회 → 1회

### 🧠 새 함수
- `getCachedTypeData_()` - 캐싱된 Type 시트 데이터 반환
- `invalidateCache_()` - 캐시 강제 무효화
- `readAll_Optimized_(sh)` - 범위 최적화 시트 읽기
- `batchUpdateChips(updates)` - 배치 칩 업데이트
- `debugCacheStats()` - 캐시 통계 확인

### 📊 성능 비교표
| 작업 | v1.1 | v1.2 | 개선율 |
|------|------|------|--------|
| 키 플레이어 로딩 (첫 요청) | 1.5초 | 0.8초 | 47% ↓ |
| 키 플레이어 로딩 (캐시 히트) | 1.5초 | 0.1초 | **93% ↓** |
| 칩 수정 10명 | 25초 | 2.5초 | **90% ↓** |

### 📄 문서
- [PERFORMANCE_Tracker.md](PERFORMANCE_Tracker.md) - 성능 최적화 가이드

### ⚠️ 주의사항
- PropertiesService 용량: 9KB/property (500행까지 안전)
- 캐시 TTL: 30초 (외부 시트 수정 시 최대 30초 지연)
- 쓰기 작업 시 자동 캐시 무효화

---

## v1.1.0 (2025-10-06)

### 🎨 UI/UX 전면 개선
- **프로페셔널 디자인 시스템**:
  - 색상 팔레트 확장 (8개 → 16개 CSS 변수)
  - Gradient 배경 (카드, 버튼, 오버레이)
  - Typography 개선 (font-variant-numeric, letter-spacing)
  - Hover/Active 인터랙션 강화 (transform, transition)
- **Information Density 강화**:
  - 키 플레이어 카드 압축 (여백 8px → 6px)
  - Stats Bar 추가 (Total/Avg/Players 통계)
  - 칩 변화량 inline 표시 (별도 줄 제거)
- **국가별 표시 개선**:
  - 지원 국가 10개 → 42개 (아시아, 유럽, 미주 전역)
  - 검색 가능한 국가 선택기 (코드/이름 필터)
  - Flag + Code + Name 표시 (예: 🇰🇷 KR Korea)
  - 선택된 국기 아이콘 표시
- **UX 개선**:
  - Overlay 외부 클릭 시 닫기
  - 입력 필드 포커스 스타일 강화 (3px ring)
  - 버튼 최소 터치 영역 (36px → 48px)
  - 키보드 내비게이션 지원

### 🌍 지원 국가 (42개)
- **아시아**: KR, JP, CN, TW, HK, SG, MY, TH, VN, PH, IN, ID
- **북미**: US, CA, MX
- **남미**: BR, AR
- **유럽**: GB, FR, DE, IT, ES, NL, SE, NO, DK, FI, PL, CZ, AT, CH, BE, PT, GR
- **중동**: TR, IL, SA, AE
- **오세아니아**: AU, NZ
- **아프리카**: ZA

### 🧠 기술 개선
- `NATIONS` 상수 배열 (42개 국가 메타데이터)
- `initNationSelector()` 동적 검색/필터 기능
- `getFlag()` 함수 NATIONS 배열 기반으로 리팩토링
- `handleOverlayClick()` 외부 클릭 핸들러

### 📊 Stats Bar 기능
- **Total**: 키 플레이어 총 칩
- **Avg**: 평균 칩
- **Players**: 키 플레이어 수
- 플레이어 0명일 때 자동 숨김

---

## v1.0.2 (2025-10-06)

### 🐛 버그 수정 (Critical)
- **Seat No. 숫자 형식 지원**: Type 시트 Seat No. 컬럼이 숫자(1, 2, 3)일 때 정상 동작
  - 증상: `[1 관리]` 클릭 시 모든 좌석 빈 좌석으로 표시
  - 원인: Type 시트 Seat No. = 1 (숫자), 코드 = "S1" (문자열) 불일치
  - 수정:
    - 읽기: 숫자 1 → "S1" 자동 변환 (`/^\d+$/.test()`)
    - 쓰기: "S1" → 1 자동 변환 (`.replace(/^S/i, '')`)
  - 영향: 모든 함수 (`getKeyPlayers`, `getTablePlayers`, `updatePlayerChips`, `addPlayer`, `removePlayer`)

### 🧪 테스트 확인
- Type 시트 형식: `Table No. = 1, Seat No. = 1` (숫자) ✅ 정상 동작
- Type 시트 형식: `Table No. = "T1", Seat No. = "S1"` (문자열) ✅ 정상 동작
- 혼용 형식 ✅ 모두 정상 동작

---

## v1.0.1 (2025-10-06)

### 🐛 버그 수정
- **Critical**: 테이블 플레이어 조회 대소문자 구분 버그 수정
  - 증상: `[T15 관리]` 클릭 시 모든 좌석 빈 좌석으로 표시
  - 원인: Type 시트 "t15" vs 프론트엔드 "T15" 대소문자 불일치
  - 수정: `.toUpperCase()` 적용으로 대소문자 무시 처리
  - 영향: `getTablePlayers()`, `updatePlayerChips()`, `addPlayer()`, `removePlayer()`
- **테스트 확인**: 소문자/대문자/혼용 모두 정상 동작

---

## v1.0 (2025-10-06)

### 🎉 새 기능
- **독립 웹앱**: tracker.html + tracker.gs 신규 생성 (HandLogger와 완전 분리)
- **Key Player View**: 키 플레이어 18명 목록 표시 (Keyplayer=TRUE 필터)
- **칩 변화량 추적**: localStorage 기반 칩 변화량 표시 (↑↓→)
- **Table View**: 테이블별 9좌석 플레이어 관리 (빈 좌석 포함)
- **칩 수정**: 텍스트 클릭 → 입력 오버레이 (750000 또는 750k 지원)
- **플레이어 추가**: 이름/국적/칩/키 여부 입력 → Type 시트 appendRow
- **플레이어 삭제**: 🗑️ 버튼 → Type 시트 deleteRow
- **국적 드롭다운**: 10개국 지원 (KR, US, JP, CN, GB, FR, DE, CA, AU, TW)

### 📄 문서
- **PLAN_Tracker.md**: 페르소나 Henry + 5개 시나리오 + 성공기준
- **PRD_Tracker.md**: Phase 1~3 작업 목록 (MVP 6개 기능)
- **LLD_Tracker.md**: 기술 설계 + AI 인덱스 + 함수 스펙
- **STATUS_Tracker.md**: 현재 상태 추적
- **CHANGELOG_Tracker.md**: 버전별 변경 이력

### 🎨 디자인
- **Minimal Design 준수**:
  - BB 설정 제거
  - 숫자패드 제거 (일반 텍스트 입력)
  - 칩 클릭 즉시 수정 (버튼 없음)
  - 휴지통 아이콘만 표시

### 🧠 기술
- **서버 함수**:
  - `getKeyPlayers()` - 키 플레이어 목록 반환
  - `getTablePlayers(tableId)` - 테이블 9좌석 반환
  - `updatePlayerChips(tableId, seatNo, chips)` - 칩 수정
  - `addPlayer(tableId, seatNo, name, nation, chips, isKey)` - 플레이어 추가
  - `removePlayer(tableId, seatNo)` - 플레이어 삭제
- **ScriptLock**: 동시 쓰기 방지 (3회 재시도)
- **localStorage**: 칩 변화량 이력 저장 (phl_chipHistory)

### ⚡ 성능
- **클라이언트 사이드 렌더링**: 서버 호출 최소화
- **칩 변화량 계산**: localStorage 기반 (서버 부하 0)

---

## 다음 버전 예정 (v1.1)

### 🔮 Phase 2 작업
- 키 플레이어 테이블 이동 (T15 → T28)
- 테이블 검색/필터
- 칩리더 정렬
- 칩 변화량 색상 코딩

### 🔮 Phase 3 작업
- 테이블 일괄 칩 입력
- Type 시트 초기화
