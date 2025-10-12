# Type 시트 v3.0.0 마이그레이션 종합 계획서

> **프로젝트**: Poker Tracker - Type 시트 구조 변경
> **목표**: v2.4.0 (8 컬럼) → v3.0.0 (16 컬럼)
> **기준**: Seats.csv (테이블 배치) + Players.csv (플레이어 상세)
> **작성일**: 2025-10-12

---

## 📋 목차

1. [개요](#-개요)
2. [변경 목표](#-변경-목표)
3. [구조 변경 요약](#-구조-변경-요약)
4. [마이그레이션 전략](#-마이그레이션-전략)
5. [단계별 실행 계획](#-단계별-실행-계획)
6. [파일별 수정 사항](#-파일별-수정-사항)
7. [검증 및 테스트](#-검증-및-테스트)
8. [위험 관리](#-위험-관리)
9. [롤백 계획](#-롤백-계획)

---

## 🎯 개요

### 현재 상황 (v2.4.0)

- **Type 시트**: 8개 컬럼 (Poker Room ~ Keyplayer)
- **테이블/좌석 번호**: 문자열 형식 ("T15", "S3")
- **플레이어 정보**: 최소 정보만 저장 (이름, 국적, 칩)
- **고유 식별자**: 없음 (중복 플레이어 가능)

### 목표 (v3.0.0)

- **Type 시트**: 16개 컬럼 (Seats.csv 기반)
- **테이블/좌석 번호**: 숫자 형식 (15, 3)
- **플레이어 정보**: 상세 정보 (Email, WSOP ID, DOB 등)
- **고유 식별자**: PlayerId 추가 (중복 방지)

### 데이터 소스

- **Seats.csv**: 테이블 배치 정보 (PokerRoom, TableName, TableNo, SeatNo, PlayerId, ChipCount)
- **Players.csv**: 플레이어 상세 정보 (Email, WsopId, DOB, State, City, ReEntryCount)

---

## 🎯 변경 목표

### 1. 구조 표준화

- ✅ **Seats.csv 컬럼명 준수** (PokerRoom, TableName, TableNo, SeatNo)
- ✅ **공백 제거** ("Table No." → "TableNo")
- ✅ **명확한 컬럼명** ("Player" → "PlayerName", "Chips" → "ChipCount")

### 2. 데이터 타입 정규화

- ✅ **숫자형 변환**: TableNo, SeatNo (문자열 "T15" → 숫자 15)
- ✅ **타임스탬프 추가**: UpdatedAt (자동 생성)
- ✅ **고유 ID**: PlayerId (6자리 랜덤 숫자)

### 3. 플레이어 정보 확장

- ✅ **연락처**: Email (Players.csv)
- ✅ **WSOP 정보**: WsopId (Players.csv)
- ✅ **개인 정보**: DOB, State, City (Players.csv)
- ✅ **참가 정보**: ReEntryCount (Players.csv)

### 4. 중복 방지

- ✅ **PlayerId 기반 중복 체크**
- ✅ **Players.csv와 JOIN 가능**

---

## 📊 구조 변경 요약

### v2.4.0 → v3.0.0 컬럼 매핑

| v2.4.0 (8 컬럼) | v3.0.0 (16 컬럼) | 변경 내용 | 데이터 예시 |
|----------------|-----------------|----------|------------|
| A: Poker Room | A: PokerRoom | 공백 제거 | "Merit Hall" → "Main" |
| B: Table Name | B: TableName | 공백 제거 | "Ocean Blue" → "Black" |
| C: Table No. | C: TableNo | **문자열→숫자** | "T15" → 15 |
| D: Seat No. | D: SeatNo | **문자열→숫자** | "S3" → 3 |
| - | E: PlayerId | **신규 추가** | 103959 |
| E: Player | F: PlayerName | 컬럼명 변경 | "박프로" |
| - | G: Email | **신규 추가** | "moritz@..." |
| - | H: WsopId | **신규 추가** | "RBHU9U" |
| - | I: DOB | **신규 추가** | "1985-02-08" |
| F: Nation | J: Nationality | 컬럼명 변경 | "KR" |
| - | K: State | **신규 추가** | "" |
| - | L: City | **신규 추가** | "" |
| G: Chips | M: ChipCount | 컬럼명 변경 | 520000 |
| - | N: ReEntryCount | **신규 추가** | 0 |
| - | O: UpdatedAt | **신규 추가** | "2025-10-12..." |
| H: Keyplayer | P: Keyplayer | 위치만 변경 | TRUE |

### 최종 Type 시트 구조 (v3.0.0)

```
A: PokerRoom        (Seats.csv)
B: TableName        (Seats.csv)
C: TableNo          (Seats.csv, 숫자형) ⭐
D: SeatNo           (Seats.csv, 숫자형) ⭐
E: PlayerId         (신규, 6자리 랜덤) ⭐
F: PlayerName       (기존 Player)
G: Email            (Players.csv)
H: WsopId           (Players.csv)
I: DOB              (Players.csv)
J: Nationality      (기존 Nation)
K: State            (Players.csv)
L: City             (Players.csv)
M: ChipCount        (기존 Chips)
N: ReEntryCount     (Players.csv)
O: UpdatedAt        (자동 생성)
P: Keyplayer        (기존 위치 변경)
```

---

## 🛠️ 마이그레이션 전략

### 전략 1: 백업 우선 (Backup-First)

```
1. Type 시트 전체 복사 → Type_Backup_v2.4.0_YYYYMMDD_HHMMSS
2. 마이그레이션 실행
3. 검증 실패 시 백업에서 복원
```

**장점**: 안전, 롤백 용이
**단점**: 추가 시트 생성

### 전략 2: 데이터 변환 중심 (Data-Transformation)

```
1. 기존 데이터 읽기 (8개 컬럼)
2. 신규 구조로 변환 (16개 컬럼)
   - TableNo: "T15" → 15
   - SeatNo: "S3" → 3
   - PlayerId: 생성 (6자리 랜덤)
   - 신규 컬럼: 기본값 또는 빈값
3. 기존 데이터 삭제
4. 신규 데이터 입력
```

**장점**: 데이터 무결성 유지
**단점**: 변환 실패 시 롤백 필요

### 전략 3: 단계별 검증 (Validation-First)

```
1. 테스트 시트에서 마이그레이션 실행
2. 검증 함수로 데이터 검증
   - 헤더 16개 확인
   - TableNo/SeatNo 숫자형 확인
   - 행 수 일치 확인
3. 검증 성공 시 실제 시트 마이그레이션
```

**장점**: 안전성 최대화
**단점**: 시간 소요

### 최종 선택: **전략 1 + 2 + 3 통합**

1. 백업 생성
2. 테스트 시트 검증
3. 실제 시트 마이그레이션
4. 검증 함수 실행
5. 실패 시 롤백

---

## 📅 단계별 실행 계획

### Phase 1: 준비 단계 (30분)

**목표**: 마이그레이션 환경 구축

- [ ] **Task 1.1**: Type 시트 수동 백업 (Google Sheets 복사) (5분)
- [ ] **Task 1.2**: migrate.js 파일 생성 (10분)
- [ ] **Task 1.3**: 테스트용 스프레드시트 생성 (10분)
- [ ] **Task 1.4**: APP_SPREADSHEET_ID 확인 (5분)

**산출물**:
- Type_Backup_Manual_YYYYMMDD (수동 백업 시트)
- migrate.js (마이그레이션 스크립트)
- Test_Spreadsheet (테스트 시트)

---

### Phase 2: 마이그레이션 스크립트 작성 (2시간)

**목표**: migrate.js 완성 및 테스트

- [ ] **Task 2.1**: `migrateTypeSheetToV3()` 함수 작성 (30분)
  - 백업 시트 생성
  - 기존 데이터 읽기
  - 데이터 변환
  - 신규 데이터 입력
- [ ] **Task 2.2**: `convertRowToV3()` 함수 작성 (30분)
  - TableNo/SeatNo 숫자 변환
  - PlayerId 생성
  - 16개 컬럼 매핑
- [ ] **Task 2.3**: `extractNumber()` 유틸 함수 작성 (15분)
  - "T15" → 15 변환 로직
  - "S3" → 3 변환 로직
- [ ] **Task 2.4**: `generatePlayerId()` 함수 작성 (15분)
  - 6자리 랜덤 숫자 생성
- [ ] **Task 2.5**: `verifyMigration()` 검증 함수 작성 (30분)
  - 헤더 검증
  - 데이터 샘플 확인
  - 숫자형 확인

**산출물**:
- migrate.js (완성)

**테스트**:
- [ ] 테스트 시트에서 마이그레이션 실행
- [ ] 검증 함수 실행
- [ ] 결과 확인 (행 수, 데이터 타입)

---

### Phase 3: 백엔드 수정 (tracker_gs.js) (4시간)

**목표**: 서버 함수 v3.0.0 호환

#### 3.1 컬럼 인덱스 상수 업데이트 (30분)

- [ ] **Task 3.1.1**: `cols` → `COLS` 상수 변경
- [ ] **Task 3.1.2**: 16개 컬럼 인덱스 정의

```javascript
const COLS = {
  pokerRoom: 0,     // A
  tableName: 1,     // B
  tableNo: 2,       // C (숫자)
  seatNo: 3,        // D (숫자)
  playerId: 4,      // E
  playerName: 5,    // F
  email: 6,         // G
  wsopId: 7,        // H
  dob: 8,           // I
  nationality: 9,   // J
  state: 10,        // K
  city: 11,         // L
  chipCount: 12,    // M
  reEntryCount: 13, // N
  updatedAt: 14,    // O
  keyplayer: 15     // P
};
```

#### 3.2 핵심 함수 수정 (3시간)

| 함수 | 수정 내용 | 시간 | 우선순위 |
|------|----------|------|----------|
| `getKeyPlayers()` | COLS 인덱스 업데이트, 16개 필드 반환 | 30분 | 🔴 Critical |
| `getTablePlayers(tableId)` | tableId 숫자 변환, COLS 업데이트 | 30분 | 🔴 Critical |
| `updatePlayerChips(tableId, seatNo, chips)` | 숫자 비교, COLS.chipCount | 30분 | 🔴 Critical |
| `addPlayer()` | 16개 컬럼 입력, PlayerId 생성 | 45분 | 🔴 Critical |
| `removePlayer()` | 숫자 비교 | 15분 | 🔴 Critical |
| `readRoster_()` | COLS 인덱스 업데이트 | 30분 | 🔴 Critical |

#### 3.3 헬퍼 함수 추가 (30분)

- [ ] **Task 3.3.1**: `generatePlayerId_()` 함수 (15분)
- [ ] **Task 3.3.2**: `extractNumber_()` 함수 (15분)

#### 3.4 검증 함수 수정 (30분)

- [ ] **Task 3.4.1**: `validateTableId_()` - 문자열/숫자 모두 지원 (15분)
- [ ] **Task 3.4.2**: `validateSeatNo_()` - 문자열/숫자 모두 지원 (15분)

**테스트**:
- [ ] `getKeyPlayers()` 호출 → 16개 필드 확인
- [ ] `getTablePlayers(15)` 호출 → 응답 확인
- [ ] `addPlayer()` → Type 시트 16개 컬럼 확인

---

### Phase 4: 프론트엔드 수정 (tracker.html) (3시간)

**목표**: UI v3.0.0 호환

#### 4.1 헬퍼 함수 추가 (30분)

- [ ] **Task 4.1.1**: `parseTableNo(str)` 함수 (15분)
  - "T15" → 15 또는 "15" → 15
- [ ] **Task 4.1.2**: `parseSeatNo(str)` 함수 (15분)
  - "S3" → 3 또는 "3" → 3

#### 4.2 렌더링 함수 수정 (2시간)

| 함수 | 수정 내용 | 시간 | 우선순위 |
|------|----------|------|----------|
| `renderKeyPlayers()` | 숫자 → "T15" 변환, 16개 필드 표시 | 45분 | 🔴 Critical |
| `renderTablePlayers()` | 숫자 → "S3" 변환, 16개 필드 표시 | 45분 | 🔴 Critical |
| `loadTablePlayers(tableId)` | 문자열 → 숫자 변환 후 서버 호출 | 15분 | 🔴 Critical |
| `editChips()` | 숫자 파라미터 전달 | 15분 | 🔴 Critical |

#### 4.3 CSS 스타일 추가 (30분)

- [ ] **Task 4.3.1**: 신규 필드 표시 스타일 (Email, WSOP ID 등) (30분)

**테스트**:
- [ ] Key Player View 렌더링 → "T15" 표시 확인
- [ ] Table View 렌더링 → "S3" 표시 확인
- [ ] 칩 수정 → 숫자 파라미터 전달 확인

---

### Phase 5: 통합 테스트 (2시간)

**목표**: 전체 기능 검증

#### 5.1 로컬 테스트 (1시간)

- [ ] **Task 5.1.1**: Key Player View 로딩 (15분)
  - [ ] getKeyPlayers() 호출 성공
  - [ ] 16개 필드 표시
  - [ ] "T15" 형식 표시
- [ ] **Task 5.1.2**: Table View 로딩 (15분)
  - [ ] getTablePlayers(15) 호출 성공
  - [ ] "S3" 형식 표시
- [ ] **Task 5.1.3**: 플레이어 추가 (15분)
  - [ ] addPlayer() 호출 성공
  - [ ] Type 시트 16개 컬럼 확인
  - [ ] PlayerId 자동 생성 확인
- [ ] **Task 5.1.4**: 칩 수정 (15분)
  - [ ] updatePlayerChips(15, 3, 50000) 성공
  - [ ] Type 시트 ChipCount 업데이트 확인

#### 5.2 웹앱 테스트 (1시간)

- [ ] **Task 5.2.1**: 배포 (15분)
  - [ ] clasp push
  - [ ] clasp deploy @X
- [ ] **Task 5.2.2**: 웹앱 접속 (15분)
  - [ ] URL 접속
  - [ ] 브라우저 강제 새로고침 (Ctrl+Shift+R)
- [ ] **Task 5.2.3**: CRUD 테스트 (30분)
  - [ ] 플레이어 추가
  - [ ] 칩 수정
  - [ ] 플레이어 삭제
  - [ ] Key Player 조회

---

### Phase 6: 실제 마이그레이션 실행 (1시간)

**목표**: 실제 Type 시트 변환

- [ ] **Task 6.1**: 실제 Type 시트 백업 (5분)
  - [ ] Google Apps Script에서 `migrateTypeSheetToV3()` 실행
  - [ ] 백업 시트 이름 기록: `Type_Backup_v2.4.0_YYYYMMDD_HHMMSS`
- [ ] **Task 6.2**: 마이그레이션 실행 (10분)
  - [ ] Logger 확인 (변환된 행 수, 실패 행 수)
- [ ] **Task 6.3**: 검증 실행 (10분)
  - [ ] `verifyMigration()` 실행
  - [ ] 헤더 16개 확인
  - [ ] TableNo/SeatNo 숫자형 확인
  - [ ] PlayerId 6자리 확인
- [ ] **Task 6.4**: 데이터 샘플 수동 확인 (10분)
  - [ ] Type 시트 직접 열기
  - [ ] 샘플 3~5행 확인
- [ ] **Task 6.5**: 배포 및 웹앱 테스트 (25분)
  - [ ] clasp push
  - [ ] clasp deploy @X
  - [ ] 웹앱 CRUD 테스트

**실패 시**: Phase 9 롤백 계획 실행

---

### Phase 7: 문서 업데이트 (1시간)

**목표**: 프로젝트 문서 v3.0.0 반영

- [ ] **Task 7.1**: [PRD.md](PRD.md) 업데이트 (15분)
  - [ ] Phase 3.0 추가 (v3.0.0 구조 변경)
  - [ ] 성공 기준 업데이트
- [ ] **Task 7.2**: [LLD.md](LLD.md) 업데이트 (20분)
  - [ ] v3.0.0 컬럼 구조 업데이트
  - [ ] AI 인덱스 업데이트 (라인 번호)
- [ ] **Task 7.3**: [STATUS.md](STATUS.md) 업데이트 (10분)
  - [ ] v3.0.0 완료 표시
  - [ ] 다음 계획 추가
- [ ] **Task 7.4**: [CHANGELOG.md](CHANGELOG.md) 업데이트 (10분)
  - [ ] v3.0.0 엔트리 작성
  - [ ] 변경사항 상세 기록
- [ ] **Task 7.5**: [version.js](../version.js) 업데이트 (5분)
  - [ ] VERSION.current = 'v3.0.0'
  - [ ] deployments 업데이트

---

### Phase 8: 최종 검증 및 모니터링 (1시간)

**목표**: 안정화 확인

- [ ] **Task 8.1**: 웹앱 연속 테스트 (30분)
  - [ ] 10회 이상 Key Player View 로딩
  - [ ] 5회 이상 플레이어 추가
  - [ ] 5회 이상 칩 수정
- [ ] **Task 8.2**: 성능 모니터링 (15분)
  - [ ] getKeyPlayers() 응답 시간 측정
  - [ ] getTablePlayers() 응답 시간 측정
- [ ] **Task 8.3**: 에러 로그 확인 (15분)
  - [ ] Google Apps Script 로그 확인
  - [ ] 브라우저 콘솔 에러 확인

---

## 📂 파일별 수정 사항

### 1. migrate.js (신규 파일)

**위치**: `d:\AI\claude01\table_tracker\migrate.js`

**주요 함수**:
- `migrateTypeSheetToV3()` - 마이그레이션 메인 함수
- `convertRowToV3(oldRow)` - 행 변환 함수
- `extractNumber(str, prefix)` - 문자열 → 숫자 변환
- `generatePlayerId()` - PlayerId 생성 (6자리 랜덤)
- `updateHeadersToV3(sheet)` - 헤더 업데이트
- `verifyMigration()` - 검증 함수
- `rollbackMigration(backupSheetName)` - 롤백 함수

**코드 라인 수**: ~200줄

---

### 2. tracker_gs.js (수정)

**위치**: `d:\AI\claude01\table_tracker\tracker_gs.js`

**수정 함수 (10개)**:

| 함수 | 라인 (예상) | 수정 내용 | 변경 라인 수 |
|------|------------|----------|-------------|
| `cols` 상수 | ~150 | `COLS` 16개 컬럼 정의 | +8줄 |
| `getKeyPlayers()` | ~268 | COLS 인덱스 업데이트, 16개 필드 반환 | +10줄 |
| `getTablePlayers()` | ~308 | tableId 숫자 변환, COLS 업데이트 | +15줄 |
| `updatePlayerChips()` | ~400 | 숫자 비교, COLS.chipCount | +5줄 |
| `addPlayer()` | ~420 | 16개 컬럼 입력, PlayerId 생성 | +20줄 |
| `removePlayer()` | ~454 | 숫자 비교 | +3줄 |
| `readRoster_()` | ~200 | COLS 인덱스 업데이트 | +10줄 |
| `validateTableId_()` | ~64 | 문자열/숫자 모두 지원 | +10줄 |
| `validateSeatNo_()` | ~76 | 문자열/숫자 모두 지원 | +10줄 |
| `generatePlayerId_()` | 신규 | PlayerId 생성 | +10줄 |
| `extractNumber_()` | 신규 | 문자열 → 숫자 변환 | +15줄 |

**총 변경 라인 수**: ~116줄

---

### 3. tracker.html (수정)

**위치**: `d:\AI\claude01\table_tracker\tracker.html`

**수정 함수 (6개)**:

| 함수 | 라인 (예상) | 수정 내용 | 변경 라인 수 |
|------|------------|----------|-------------|
| `parseTableNo()` | 신규 | "T15" → 15 변환 | +10줄 |
| `parseSeatNo()` | 신규 | "S3" → 3 변환 | +10줄 |
| `renderKeyPlayers()` | ~147 | 숫자 → "T15" 변환, 16개 필드 표시 | +20줄 |
| `renderTablePlayers()` | ~206 | 숫자 → "S3" 변환, 16개 필드 표시 | +20줄 |
| `loadTablePlayers()` | ~182 | 문자열 → 숫자 변환 | +5줄 |
| `editChips()` | ~226 | 숫자 파라미터 전달 | +5줄 |

**총 변경 라인 수**: ~70줄

---

## ✅ 검증 및 테스트

### 검증 체크리스트

#### 데이터 무결성
- [ ] Type 시트 행 수 일치 (마이그레이션 전 = 후)
- [ ] 모든 플레이어 이름 유지
- [ ] 모든 ChipCount 값 유지
- [ ] 모든 Keyplayer 값 유지 (TRUE/FALSE)

#### 구조 검증
- [ ] 헤더 16개 컬럼 확인
- [ ] 컬럼명 정확성 (PokerRoom, TableName, ...)
- [ ] TableNo 숫자형 (`typeof === 'number'`)
- [ ] SeatNo 숫자형 (`typeof === 'number'`)
- [ ] PlayerId 6자리 숫자

#### 기능 검증
- [ ] `getKeyPlayers()` 호출 성공
- [ ] `getTablePlayers(15)` 호출 성공
- [ ] `updatePlayerChips(15, 3, 50000)` 성공
- [ ] `addPlayer()` → 16개 컬럼 입력 확인
- [ ] `removePlayer()` 성공

#### UI 검증
- [ ] Key Player View 렌더링
- [ ] Table View 렌더링
- [ ] "T15", "S3" 형식 표시 확인
- [ ] 16개 필드 표시 확인 (Email, WSOP ID 등)

---

## 🚨 위험 관리

### 위험 1: 테이블/좌석 번호 변환 실패

**위험도**: 🔴 High

**시나리오**: "T15" → 15 변환 시 예외 발생 (예: "T15A", "T")

**대응**:
```javascript
function extractNumber(str, prefix) {
  if (!str) return null;
  const strUpper = String(str).toUpperCase().trim();

  // 이미 숫자인 경우
  if (!isNaN(strUpper)) return parseInt(strUpper);

  // 접두사 제거 후 숫자 추출
  if (strUpper.startsWith(prefix)) {
    const num = parseInt(strUpper.substring(prefix.length));
    return isNaN(num) ? null : num; // 실패 시 null 반환
  }

  return null;
}
```

**완화책**: 변환 실패 시 해당 행 스킵, 로그 기록

---

### 위험 2: PlayerId 중복

**위험도**: 🟡 Medium

**시나리오**: 랜덤 생성 시 중복 발생 (확률 낮음)

**대응**:
```javascript
function generatePlayerId() {
  const existing = getExistingPlayerIds(); // Type 시트 기존 PlayerId 조회
  let playerId;
  do {
    playerId = Math.floor(100000 + Math.random() * 900000);
  } while (existing.includes(playerId));
  return playerId;
}
```

**완화책**: 중복 체크 로직 추가

---

### 위험 3: 마이그레이션 중 데이터 손실

**위험도**: 🔴 High

**시나리오**: 마이그레이션 중 스크립트 오류 발생

**대응**:
- 백업 시트 자동 생성 (마이그레이션 시작 전)
- try-catch 블록으로 에러 핸들링
- 롤백 함수 준비

**완화책**: 테스트 시트에서 먼저 실행

---

### 위험 4: 웹앱 배포 후 UI 깨짐

**위험도**: 🟡 Medium

**시나리오**: 숫자 → "T15" 변환 누락

**대응**:
```javascript
// 모든 렌더링 함수에서 일관된 변환
function formatTableNo(num) {
  return `T${num}`;
}
function formatSeatNo(num) {
  return `S${num}`;
}
```

**완화책**: UI 테스트 체크리스트 실행

---

## 🔄 롤백 계획

### 롤백 시나리오

1. **마이그레이션 실패** (데이터 변환 오류)
2. **검증 실패** (헤더 불일치, 행 수 불일치)
3. **웹앱 테스트 실패** (CRUD 작업 오류)

### 롤백 절차

#### Step 1: 백업 시트 확인

```javascript
// Google Apps Script에서 실행
const ss = SpreadsheetApp.openById(APP_SPREADSHEET_ID);
const sheets = ss.getSheets();
const backupSheets = sheets.filter(s => s.getName().startsWith('Type_Backup_v2.4.0_'));

backupSheets.forEach(s => Logger.log(s.getName()));
// 예: Type_Backup_v2.4.0_20251012_143000
```

#### Step 2: 롤백 실행

```javascript
// 백업 시트 이름 입력
const backupName = 'Type_Backup_v2.4.0_20251012_143000';

// 롤백 함수 실행
rollbackMigration(backupName);

// 결과 확인
// ✅ 롤백 완료: Type_Backup_v2.4.0_20251012_143000 → Type
```

#### Step 3: 웹앱 롤백

```bash
# 이전 배포 ID 확인
clasp deployments

# 출력 예:
# @9 AKfycby... v3.0.0 (2025-10-12)
# @8 AKfycbz... v2.4.0 (2025-10-11)

# 이전 버전으로 재배포
clasp deploy -i AKfycbz... -d "Rollback to v2.4.0"
```

#### Step 4: 검증

- [ ] Type 시트 8개 컬럼 확인
- [ ] 헤더 확인 (Poker Room, Table Name, ...)
- [ ] TableNo 문자열 형식 확인 ("T15")
- [ ] SeatNo 문자열 형식 확인 ("S3")
- [ ] 웹앱 CRUD 테스트

---

## 📊 성공 기준

### 마이그레이션 성공 기준

- ✅ Type 시트 16개 컬럼 확인
- ✅ 데이터 행 수 100% 일치
- ✅ TableNo/SeatNo 숫자형 100% 변환
- ✅ PlayerId 6자리 숫자 100% 생성
- ✅ Keyplayer 값 100% 유지

### 기능 성공 기준

- ✅ getKeyPlayers() 호출 성공률 100%
- ✅ getTablePlayers() 호출 성공률 100%
- ✅ CRUD 작업 성공률 100%
- ✅ UI 렌더링 에러 0건

### 성능 기준

- ✅ getKeyPlayers() 응답 시간 ≤ 3초
- ✅ getTablePlayers() 응답 시간 ≤ 2초
- ✅ updatePlayerChips() 응답 시간 ≤ 1초

---

## 📈 예상 타임라인

| Phase | 작업 내용 | 예상 시간 | 담당 | 상태 |
|-------|----------|----------|------|------|
| Phase 1 | 준비 단계 | 0.5시간 | Claude | ⬜ Pending |
| Phase 2 | 마이그레이션 스크립트 | 2시간 | Claude | ⬜ Pending |
| Phase 3 | 백엔드 수정 | 4시간 | Claude | ⬜ Pending |
| Phase 4 | 프론트엔드 수정 | 3시간 | Claude | ⬜ Pending |
| Phase 5 | 통합 테스트 | 2시간 | Claude | ⬜ Pending |
| Phase 6 | 실제 마이그레이션 | 1시간 | Claude | ⬜ Pending |
| Phase 7 | 문서 업데이트 | 1시간 | Claude | ⬜ Pending |
| Phase 8 | 최종 검증 | 1시간 | Claude | ⬜ Pending |

**총 예상 시간**: 14.5시간

---

## 📝 추가 고려사항

### Players.csv 데이터 임포트 (선택 사항)

마이그레이션 후 Players.csv에서 Email, WsopId 등을 PlayerId 기준으로 채우기:

```javascript
function importPlayersData(playersCsvUrl) {
  const csv = UrlFetchApp.fetch(playersCsvUrl).getContentText();
  const rows = Utilities.parseCsv(csv);

  // PlayerId → 상세 정보 매핑
  const playerMap = {};
  rows.slice(1).forEach(row => {
    const playerId = row[7]; // PlayerId 컬럼
    playerMap[playerId] = {
      email: row[8],
      wsopId: row[9],
      dob: row[11],
      state: row[14],
      city: row[15],
      reEntryCount: row[17]
    };
  });

  // Type 시트 업데이트
  const sheet = SpreadsheetApp.openById(APP_SPREADSHEET_ID).getSheetByName(TYPE_SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const playerId = data[i][4]; // E열 PlayerId
    if (playerMap[playerId]) {
      data[i][6] = playerMap[playerId].email;
      data[i][7] = playerMap[playerId].wsopId;
      data[i][8] = playerMap[playerId].dob;
      data[i][10] = playerMap[playerId].state;
      data[i][11] = playerMap[playerId].city;
      data[i][13] = playerMap[playerId].reEntryCount;
    }
  }

  sheet.getRange(1, 1, data.length, 16).setValues(data);
  Logger.log('✅ Players.csv 데이터 임포트 완료');
}
```

---

## ✅ 체크리스트 요약

### 마이그레이션 전
- [ ] Type 시트 수동 백업
- [ ] migrate.js 작성 완료
- [ ] 테스트 시트 검증 성공
- [ ] tracker_gs.js 수정 완료
- [ ] tracker.html 수정 완료

### 마이그레이션 중
- [ ] 백업 시트 자동 생성 확인
- [ ] 변환 로그 확인 (성공/실패 행 수)
- [ ] 검증 함수 실행

### 마이그레이션 후
- [ ] Type 시트 16개 컬럼 확인
- [ ] 데이터 샘플 확인 (3~5행)
- [ ] CRUD 테스트 성공
- [ ] UI 렌더링 성공
- [ ] 문서 업데이트 완료

---

**작성일**: 2025-10-12
**작성자**: Claude AI
**버전**: v3.0.0 Migration Plan
**관련 문서**: [TYPE_SHEET_V3_SEATS_MIGRATION.md](TYPE_SHEET_V3_SEATS_MIGRATION.md)
