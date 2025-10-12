# Type 시트 v3.0.0 구조 변경 설계서 (Seats.csv 기반)

> **마이그레이션 계획** | v2.4.0 (8 컬럼) → v3.0.0 (16 컬럼)
> **기준 데이터**: Seats.csv (테이블 배치) + Players.csv (플레이어 상세)

---

## 🎯 변경 목적

**Seats.csv 테이블 배치 구조**를 Type 시트에 적용하여:

- ✅ **PlayerId 기반 중복 방지** (고유 식별자)
- ✅ **PokerRoom/TableName 표준화** (Seats.csv 컬럼명)
- ✅ **테이블/좌석 번호 숫자형** (문자열 "T15" → 숫자 15)
- ✅ **플레이어 상세 정보 통합** (Email, WSOP ID, DOB 등)
- ✅ **실시간 칩 추적** (ChipCount)

---

## 📊 최종 Type 시트 구조 (v3.0.0)

```
A: PokerRoom        ← "Main" (Seats.csv)
B: TableName        ← "Black" (Seats.csv)
C: TableNo          ← 1 (숫자형, Seats.csv)
D: SeatNo           ← 1-7 (숫자형, Seats.csv)
E: PlayerId         ← 103959 (고유 ID) ⭐
F: PlayerName       ← "Moritz Pape"
G: Email            ← "moritz_pape@hotmail.com" (Players.csv)
H: WsopId           ← "RBHU9U" (Players.csv)
I: DOB              ← "1985-02-08" (Players.csv)
J: Nationality      ← "DE" (Seats.csv)
K: State            ← "Nordrhein-Westfalen" (Players.csv)
L: City             ← "" (Players.csv)
M: ChipCount        ← 10000 (Seats.csv)
N: ReEntryCount     ← 0 (Players.csv)
O: UpdatedAt        ← "2025-10-12 20:35:13" (자동)
P: Keyplayer        ← TRUE/FALSE (기존 유지)
```

**총 16개 컬럼**

---

## 🔑 핵심 변경사항

### 1. 컬럼 이름 표준화 (Seats.csv 준수)

| 변경 전 | 변경 후 | 이유 |
|---------|---------|------|
| `Poker Room` | `PokerRoom` | 공백 제거 |
| `Table Name` | `TableName` | 공백 제거 |
| `Table No.` | `TableNo` | 마침표 제거 |
| `Seat No.` | `SeatNo` | 마침표 제거 |
| `Player` | `PlayerName` | 명확화 |
| `Nation` | `Nationality` | Seats.csv 표준 |
| `Chips` | `ChipCount` | Seats.csv 표준 |

### 2. 테이블/좌석 번호 형식 변경 ⭐ 중요

| 구분 | v2.4.0 | v3.0.0 |
|------|--------|--------|
| 저장 형식 | 문자열 ("T15", "S3") | **숫자 (15, 3)** |
| UI 표시 | "T15", "S3" | **"T15", "S3"** (동일) |
| 서버 비교 | `row[COLS.table] === 'T15'` | `row[COLS.tableNo] === 15` |
| 클라이언트 호출 | `getTablePlayers('T15')` | `getTablePlayers(15)` |

**변환 로직**:
- 저장: "T15" → 15 (문자열에서 숫자 추출)
- 표시: 15 → "T15" (UI에서 "T" 접두사 추가)

### 3. PlayerId 추가 (E열) ⭐

- **목적**: 중복 플레이어 방지
- **형식**: 6자리 숫자 (100000~999999)
- **생성**: `generatePlayerId()` 함수 (랜덤)
- **연동**: Players.csv PlayerId와 매칭 가능

---

## 🔄 컬럼 매핑 (v2.4.0 → v3.0.0)

| v2.4.0 | v3.0.0 | 데이터 변환 예시 | 비고 |
|--------|--------|-----------------|------|
| A: Poker Room → "Merit Hall" | A: PokerRoom → "Main" | 기본값 변경 | Seats.csv 표준 |
| B: Table Name → "Ocean Blue" | B: TableName → "Black" | 기본값 변경 | Seats.csv 표준 |
| C: Table No. → "T15" | C: TableNo → 15 | **문자열 → 숫자** | "T" 제거 |
| D: Seat No. → "S3" | D: SeatNo → 3 | **문자열 → 숫자** | "S" 제거 |
| - | E: PlayerId → 103959 | 신규 (6자리 랜덤) | 중복 방지 키 |
| E: Player → "박프로" | F: PlayerName → "박프로" | 컬럼명 변경 | - |
| - | G: Email → "" | 신규 (빈값) | Players.csv 참조 |
| - | H: WsopId → "" | 신규 (빈값) | Players.csv 참조 |
| - | I: DOB → "" | 신규 (빈값) | Players.csv 참조 |
| F: Nation → "KR" | J: Nationality → "KR" | 컬럼명 변경 | - |
| - | K: State → "" | 신규 (빈값) | Players.csv 참조 |
| - | L: City → "" | 신규 (빈값) | Players.csv 참조 |
| G: Chips → 520000 | M: ChipCount → 520000 | 컬럼명 변경 | - |
| - | N: ReEntryCount → 0 | 신규 (기본값 0) | - |
| - | O: UpdatedAt → "2025-10-12 ..." | 신규 (현재 시간) | 자동 생성 |
| H: Keyplayer → TRUE | P: Keyplayer → TRUE | 위치만 변경 | - |

---

## 🛠️ 마이그레이션 스크립트 (migrate.js)

```javascript
/**
 * Type 시트 v2.4.0 → v3.0.0 마이그레이션
 * 기준: Seats.csv 구조 (PokerRoom, TableName, TableNo=숫자, SeatNo=숫자)
 */

const APP_SPREADSHEET_ID = '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4';
const TYPE_SHEET_NAME = 'Type';

function migrateTypeSheetToV3() {
  const ss = SpreadsheetApp.openById(APP_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(TYPE_SHEET_NAME);

  // 1. 백업
  const backupName = `Type_Backup_v2.4.0_${Utilities.formatDate(new Date(), 'GMT+9', 'yyyyMMdd_HHmmss')}`;
  const backup = sheet.copyTo(ss);
  backup.setName(backupName);
  Logger.log(`✅ 백업 완료: ${backupName}`);

  // 2. 기존 데이터 읽기
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log('⚠️ 데이터 없음, 헤더만 업데이트');
    updateHeadersToV3(sheet);
    return { success: true, backupSheet: backupName, migratedRows: 0 };
  }

  const oldData = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
  Logger.log(`📋 기존 데이터 ${oldData.length}행 읽기 완료`);

  // 3. 신규 구조로 변환
  const newData = oldData.map((row, index) => {
    try {
      return convertRowToV3(row);
    } catch (error) {
      Logger.log(`❌ 행 ${index + 2} 변환 실패: ${error.message}`);
      return null;
    }
  }).filter(row => row !== null);

  Logger.log(`✅ ${newData.length}/${oldData.length}행 변환 완료`);

  // 4. 기존 데이터 삭제
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }

  // 5. 헤더 업데이트
  updateHeadersToV3(sheet);

  // 6. 신규 데이터 입력
  if (newData.length > 0) {
    sheet.getRange(2, 1, newData.length, 16).setValues(newData);
  }

  Logger.log('🎉 마이그레이션 완료!');
  return {
    success: true,
    backupSheet: backupName,
    migratedRows: newData.length,
    failedRows: oldData.length - newData.length
  };
}

/**
 * v2.4.0 행 → v3.0.0 행 변환
 */
function convertRowToV3(oldRow) {
  const [pokerRoom, tableName, tableNo, seatNo, player, nation, chips, keyplayer] = oldRow;

  // TableNo 변환: "T15" → 15
  const tableNoNum = extractNumber(tableNo, 'T');
  if (tableNoNum === null) {
    throw new Error(`Invalid TableNo: ${tableNo}`);
  }

  // SeatNo 변환: "S3" → 3
  const seatNoNum = extractNumber(seatNo, 'S');
  if (seatNoNum === null) {
    throw new Error(`Invalid SeatNo: ${seatNo}`);
  }

  // PlayerId 생성 (6자리 랜덤)
  const playerId = generatePlayerId();

  return [
    pokerRoom || 'Main',             // A: PokerRoom
    tableName || 'Black',            // B: TableName
    tableNoNum,                      // C: TableNo (숫자)
    seatNoNum,                       // D: SeatNo (숫자)
    playerId,                        // E: PlayerId (신규)
    player || '',                    // F: PlayerName
    '',                              // G: Email (빈값)
    '',                              // H: WsopId (빈값)
    '',                              // I: DOB (빈값)
    nation || 'KR',                  // J: Nationality
    '',                              // K: State (빈값)
    '',                              // L: City (빈값)
    chips || 40000,                  // M: ChipCount
    0,                               // N: ReEntryCount (기본값)
    new Date(),                      // O: UpdatedAt (현재 시간)
    keyplayer === true || keyplayer === 'TRUE' // P: Keyplayer
  ];
}

/**
 * 문자열에서 숫자 추출 (예: "T15" → 15, "S3" → 3)
 */
function extractNumber(str, prefix) {
  if (!str) return null;

  const strUpper = String(str).toUpperCase().trim();

  // 이미 숫자인 경우
  if (!isNaN(strUpper)) {
    return parseInt(strUpper);
  }

  // 접두사 제거 후 숫자 추출
  if (strUpper.startsWith(prefix)) {
    const num = parseInt(strUpper.substring(prefix.length));
    return isNaN(num) ? null : num;
  }

  return null;
}

/**
 * PlayerId 생성 (6자리 랜덤 숫자)
 */
function generatePlayerId() {
  return Math.floor(100000 + Math.random() * 900000);
}

/**
 * v3.0.0 헤더 업데이트
 */
function updateHeadersToV3(sheet) {
  const headers = [
    'PokerRoom',      // A
    'TableName',      // B
    'TableNo',        // C
    'SeatNo',         // D
    'PlayerId',       // E
    'PlayerName',     // F
    'Email',          // G
    'WsopId',         // H
    'DOB',            // I
    'Nationality',    // J
    'State',          // K
    'City',           // L
    'ChipCount',      // M
    'ReEntryCount',   // N
    'UpdatedAt',      // O
    'Keyplayer'       // P
  ];

  sheet.getRange(1, 1, 1, 16).setValues([headers]);
  sheet.getRange(1, 1, 1, 16).setFontWeight('bold');
  sheet.getRange(1, 1, 1, 16).setBackground('#f3f3f3');

  Logger.log('✅ 헤더 업데이트 완료 (16개 컬럼)');
}

/**
 * 마이그레이션 검증
 */
function verifyMigration() {
  const ss = SpreadsheetApp.openById(APP_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(TYPE_SHEET_NAME);

  // 헤더 확인
  const headers = sheet.getRange(1, 1, 1, 16).getValues()[0];
  const expectedHeaders = [
    'PokerRoom', 'TableName', 'TableNo', 'SeatNo', 'PlayerId',
    'PlayerName', 'Email', 'WsopId', 'DOB', 'Nationality',
    'State', 'City', 'ChipCount', 'ReEntryCount', 'UpdatedAt', 'Keyplayer'
  ];

  let allMatch = true;
  expectedHeaders.forEach((expected, i) => {
    if (headers[i] !== expected) {
      Logger.log(`❌ 헤더 불일치: ${String.fromCharCode(65 + i)}열 - 기대: ${expected}, 실제: ${headers[i]}`);
      allMatch = false;
    }
  });

  if (allMatch) {
    Logger.log('✅ 헤더 검증 완료 (16개 컬럼)');
  }

  // 데이터 샘플 확인
  const lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    const sampleRow = sheet.getRange(2, 1, 1, 16).getValues()[0];
    Logger.log('📋 샘플 데이터:');
    Logger.log(`  PokerRoom: ${sampleRow[0]}`);
    Logger.log(`  TableName: ${sampleRow[1]}`);
    Logger.log(`  TableNo: ${sampleRow[2]} (숫자형: ${typeof sampleRow[2] === 'number'})`);
    Logger.log(`  SeatNo: ${sampleRow[3]} (숫자형: ${typeof sampleRow[3] === 'number'})`);
    Logger.log(`  PlayerId: ${sampleRow[4]} (6자리: ${String(sampleRow[4]).length === 6})`);
    Logger.log(`  PlayerName: ${sampleRow[5]}`);
    Logger.log(`  ChipCount: ${sampleRow[12]}`);
    Logger.log(`  Keyplayer: ${sampleRow[15]}`);

    // TableNo, SeatNo 숫자 형식 확인
    if (typeof sampleRow[2] === 'number' && typeof sampleRow[3] === 'number') {
      Logger.log('✅ TableNo/SeatNo 숫자형 변환 확인');
    } else {
      Logger.log('⚠️ TableNo/SeatNo가 숫자형이 아닙니다!');
    }
  }

  Logger.log(`📊 총 ${lastRow - 1}행 데이터`);

  return {
    headersValid: allMatch,
    rowCount: lastRow - 1
  };
}

/**
 * 롤백 함수
 */
function rollbackMigration(backupSheetName) {
  const ss = SpreadsheetApp.openById(APP_SPREADSHEET_ID);
  const backup = ss.getSheetByName(backupSheetName);

  if (!backup) {
    throw new Error(`백업 시트를 찾을 수 없습니다: ${backupSheetName}`);
  }

  // 현재 Type 시트 삭제
  const currentSheet = ss.getSheetByName(TYPE_SHEET_NAME);
  if (currentSheet) {
    ss.deleteSheet(currentSheet);
  }

  // 백업 시트를 Type으로 복사
  const restored = backup.copyTo(ss);
  restored.setName(TYPE_SHEET_NAME);

  Logger.log(`✅ 롤백 완료: ${backupSheetName} → Type`);
}
```

---

## 📋 구현 영향도

### 1. tracker_gs.js 수정 (10개 함수)

#### 1.1 컬럼 인덱스 상수 변경

```javascript
// 기존 (v2.4.0)
const cols = {
  pokerRoom: 0,    // A
  tableName: 1,    // B
  table: 2,        // C (문자열 "T15")
  seat: 3,         // D (문자열 "S3")
  player: 4,       // E
  nation: 5,       // F
  chips: 6,        // G
  key: 7           // H
};

// 신규 (v3.0.0)
const COLS = {
  pokerRoom: 0,     // A
  tableName: 1,     // B
  tableNo: 2,       // C (숫자 15)
  seatNo: 3,        // D (숫자 3)
  playerId: 4,      // E ⭐ 신규
  playerName: 5,    // F
  email: 6,         // G ⭐ 신규
  wsopId: 7,        // H ⭐ 신규
  dob: 8,           // I ⭐ 신규
  nationality: 9,   // J
  state: 10,        // K ⭐ 신규
  city: 11,         // L ⭐ 신규
  chipCount: 12,    // M
  reEntryCount: 13, // N ⭐ 신규
  updatedAt: 14,    // O ⭐ 신규
  keyplayer: 15     // P
};
```

#### 1.2 테이블/좌석 비교 로직 변경

```javascript
// 기존 (문자열 비교)
if (row[cols.table] === 'T15' && row[cols.seat] === 'S3') { ... }

// 신규 (숫자 비교)
if (row[COLS.tableNo] === 15 && row[COLS.seatNo] === 3) { ... }
```

#### 1.3 함수 파라미터 타입 변경

```javascript
// 기존
function getTablePlayers(tableId) { // tableId = "T15"
  const players = roster.filter(p => p.tableNo === tableId);
}

// 신규
function getTablePlayers(tableId) { // tableId = 15 (숫자)
  const tableNum = typeof tableId === 'string' ? extractNumber(tableId, 'T') : tableId;
  const players = roster.filter(p => p.tableNo === tableNum);
}
```

#### 1.4 수정 필요 함수 목록

| 함수 | 수정 내용 | 우선순위 |
|------|----------|----------|
| `getKeyPlayers()` | COLS 인덱스 업데이트, 숫자 비교 | 🔴 Critical |
| `getTablePlayers(tableId)` | tableId 숫자 변환, COLS 업데이트 | 🔴 Critical |
| `updatePlayerChips(tableId, seatNo, chips)` | 숫자 비교, COLS.chipCount | 🔴 Critical |
| `addPlayer()` | 16개 컬럼 입력, PlayerId 생성 | 🔴 Critical |
| `removePlayer()` | 숫자 비교 | 🔴 Critical |
| `validateTableId_()` | 숫자 검증 추가 ("T15" → 15 변환) | 🟡 Medium |
| `validateSeatNo_()` | 숫자 검증 추가 ("S3" → 3 변환) | 🟡 Medium |
| `readRoster_()` | COLS 인덱스 업데이트 | 🔴 Critical |
| `generatePlayerId_()` | 신규 함수 (6자리 랜덤 숫자) | 🟡 Medium |
| `extractNumber_()` | 신규 유틸 함수 ("T15" → 15) | 🟡 Medium |

---

### 2. tracker.html 수정 (6개 부분)

#### 2.1 테이블/좌석 번호 표시 변경

```javascript
// 기존 (문자열 그대로 표시)
`<div class="table-label">${player.tableNo}</div>`  // "T15"
`<div class="seat-label">${player.seatNo}</div>`    // "S3"

// 신규 (숫자 → 문자열 변환)
`<div class="table-label">T${player.tableNo}</div>` // 15 → "T15"
`<div class="seat-label">S${player.seatNo}</div>`   // 3 → "S3"
```

#### 2.2 서버 함수 호출 시 숫자 전달

```javascript
// 기존 (문자열)
google.script.run.getTablePlayers('T15');
google.script.run.updatePlayerChips('T15', 'S3', 50000);

// 신규 (숫자)
google.script.run.getTablePlayers(15);
google.script.run.updatePlayerChips(15, 3, 50000);
```

#### 2.3 UI에서 문자열 → 숫자 변환

```javascript
// 헬퍼 함수 추가
function parseTableNo(tableNoStr) {
  // "T15" → 15 또는 "15" → 15
  const str = String(tableNoStr).toUpperCase().trim();
  if (!isNaN(str)) return parseInt(str);
  if (str.startsWith('T')) return parseInt(str.substring(1));
  return null;
}

function parseSeatNo(seatNoStr) {
  // "S3" → 3 또는 "3" → 3
  const str = String(seatNoStr).toUpperCase().trim();
  if (!isNaN(str)) return parseInt(str);
  if (str.startsWith('S')) return parseInt(str.substring(1));
  return null;
}
```

#### 2.4 수정 필요 부분

| 함수/영역 | 수정 내용 | 우선순위 |
|----------|----------|----------|
| `renderKeyPlayers()` | 숫자 → "T15" 형식 변환 | 🔴 Critical |
| `renderTablePlayers()` | 숫자 → "S3" 형식 변환 | 🔴 Critical |
| `loadTablePlayers(tableId)` | 문자열 → 숫자 변환 | 🔴 Critical |
| `editChips()` | 숫자 파라미터 전달 | 🔴 Critical |
| `addPlayerPrompt()` | 16개 필드 입력 폼 (생략 가능) | 🟡 Medium |
| `deletePlayerConfirm()` | 숫자 파라미터 전달 | 🟡 Medium |
| 헬퍼 함수 | `parseTableNo()`, `parseSeatNo()` 추가 | 🔴 Critical |

---

## 📅 단계별 실행 계획

### Phase 1: 준비 (30분)
- [ ] Type 시트 수동 백업 (Google Sheets 복사)
- [ ] migrate.js 파일 생성
- [ ] 테스트용 스프레드시트 생성

### Phase 2: 마이그레이션 스크립트 완성 (1시간)
- [ ] `migrateTypeSheetToV3()` 함수 테스트
- [ ] `extractNumber()` 로직 검증
- [ ] `verifyMigration()` 실행

### Phase 3: 백엔드 수정 (3시간)
- [ ] tracker_gs.js: COLS 상수 업데이트
- [ ] `getKeyPlayers()` 수정
- [ ] `getTablePlayers()` 수정 (문자열/숫자 모두 지원)
- [ ] `updatePlayerChips()` 수정
- [ ] `addPlayer()` 수정 (16개 컬럼)
- [ ] `validateTableId_()`, `validateSeatNo_()` 수정
- [ ] `generatePlayerId_()`, `extractNumber_()` 추가

### Phase 4: 프론트엔드 수정 (3시간)
- [ ] tracker.html: 숫자 → "T15" 변환 헬퍼 함수
- [ ] `renderKeyPlayers()` 수정
- [ ] `renderTablePlayers()` 수정
- [ ] `loadTablePlayers()` 수정
- [ ] `editChips()` 수정
- [ ] `parseTableNo()`, `parseSeatNo()` 추가

### Phase 5: 실제 마이그레이션 (30분)
- [ ] 실제 Type 시트 백업
- [ ] `migrateTypeSheetToV3()` 실행
- [ ] `verifyMigration()` 검증

### Phase 6: 배포 및 테스트 (2시간)
- [ ] clasp push
- [ ] clasp deploy (v3.0.0)
- [ ] 웹앱 테스트 (Key Player View, Table View)
- [ ] CRUD 테스트 (추가/수정/삭제)

### Phase 7: 문서 업데이트 (1시간)
- [ ] PRD.md - Phase 3.0 추가
- [ ] LLD.md - v3.0.0 컬럼 구조 업데이트
- [ ] STATUS.md - v3.0.0 진행 상황
- [ ] CHANGELOG.md - v3.0.0 엔트리
- [ ] version.js - v3.0.0 업데이트

**총 예상 시간: 11시간**

---

## ✅ 검증 체크리스트

마이그레이션 완료 후:

- [ ] 헤더 16개 컬럼 확인
- [ ] 기존 데이터 행 수 일치
- [ ] **TableNo가 숫자형** (`typeof === 'number'`)
- [ ] **SeatNo가 숫자형** (`typeof === 'number'`)
- [ ] PlayerId가 6자리 숫자
- [ ] Keyplayer 값 유지 (TRUE/FALSE)
- [ ] ChipCount 값 유지
- [ ] `getKeyPlayers()` 호출 → 응답 확인
- [ ] `getTablePlayers(15)` 호출 → 응답 확인
- [ ] 웹앱 UI "T15", "S3" 표시 확인

---

## 🚨 주의사항

### 1. 테이블/좌석 번호 형식 변경 ⭐ 중요

**저장 형식**: 문자열 → 숫자
**영향**: 모든 비교 로직 수정 필수
**호환성**: 서버 함수는 문자열/숫자 모두 지원 (하위 호환)

### 2. 롤백 계획

```javascript
// 백업 시트 이름 확인
const backupName = 'Type_Backup_v2.4.0_20251012_143000';

// 롤백 실행
rollbackMigration(backupName);

// 이전 배포 버전으로 복원
// clasp deploy -i <PREVIOUS_DEPLOYMENT_ID> -d "Rollback to v2.4.0"
```

---

**작성일**: 2025-10-12
**작성자**: Claude AI
**버전**: v3.0.0 Migration Plan (Seats.csv 기반)
