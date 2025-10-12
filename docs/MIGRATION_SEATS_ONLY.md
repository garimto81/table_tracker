# Seats.csv 기반 Type 시트 구조 적용 가이드

> **상황**: Type 시트가 이미 Seats.csv 구조로 변경됨 (10 컬럼 + Keyplayer)
> **목표**: tracker_gs.js + tracker.html을 새 구조에 맞게 수정
> **작성일**: 2025-10-12

---

## 🎯 현재 상황

### Type 시트 (이미 적용됨)

```
A: PokerRoom      ← "Main"
B: TableName      ← "Black"
C: TableId        ← 43149 (Seats.csv 내부 ID)
D: TableNo        ← 1 (숫자형, Seats.csv)
E: SeatId         ← 429396 (Seats.csv 내부 ID)
F: SeatNo         ← 1 (숫자형, Seats.csv)
G: PlayerId       ← 104616 (Seats.csv)
H: PlayerName     ← "Murat Altunok" (Seats.csv)
I: Nationality    ← "TR" (Seats.csv)
J: ChipCount      ← 10000 (Seats.csv)
K: Keyplayer      ← TRUE/FALSE (추가 컬럼)
```

**총 11개 컬럼**

### 코드 (수정 필요)

- **tracker_gs.js**: v2.4.0 (8개 컬럼 구조)
- **tracker.html**: v2.4.0 (8개 컬럼 구조)

---

## 🔄 컬럼 매핑 (v2.4.0 → Seats.csv)

| v2.4.0 (8 컬럼) | Seats.csv (11 컬럼) | 데이터 예시 | 주요 변경 |
|----------------|---------------------|------------|---------|
| A: Poker Room | A: PokerRoom | "Main" | 동일 |
| B: Table Name | B: TableName | "Black" | 동일 |
| C: Table No. | D: TableNo | "T15" → 15 | **문자열→숫자** |
| D: Seat No. | F: SeatNo | "S3" → 3 | **문자열→숫자** |
| E: Player | H: PlayerName | "Murat Altunok" | 위치 변경 (E→H) |
| F: Nation | I: Nationality | "TR" | 위치+이름 변경 (F→I) |
| G: Chips | J: ChipCount | 10000 | 위치+이름 변경 (G→J) |
| H: Keyplayer | K: Keyplayer | TRUE | 위치 변경 (H→K) |
| - | C: TableId | 43149 | **신규** (내부 ID) |
| - | E: SeatId | 429396 | **신규** (내부 ID) |
| - | G: PlayerId | 104616 | **신규** (내부 ID) |

---

## 🛠️ tracker_gs.js 수정사항

### 1. COLS 상수 업데이트

```javascript
// 기존 (v2.4.0) - 8개 컬럼
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

// 신규 (Seats.csv) - 11개 컬럼
const COLS = {
  pokerRoom: 0,     // A
  tableName: 1,     // B
  tableId: 2,       // C (신규, 내부 ID)
  tableNo: 3,       // D (숫자)
  seatId: 4,        // E (신규, 내부 ID)
  seatNo: 5,        // F (숫자)
  playerId: 6,      // G (신규, 고유 ID)
  playerName: 7,    // H
  nationality: 8,   // I
  chipCount: 9,     // J
  keyplayer: 10     // K
};
```

### 2. 테이블/좌석 비교 로직 변경

```javascript
// 기존 (문자열 비교)
if (row[cols.table] === 'T15' && row[cols.seat] === 'S3') { ... }

// 신규 (숫자 비교)
if (row[COLS.tableNo] === 15 && row[COLS.seatNo] === 3) { ... }
```

### 3. 수정 필요 함수 목록

| 함수 | 라인 (예상) | 수정 내용 | 우선순위 |
|------|------------|----------|----------|
| `getKeyPlayers()` | ~268 | COLS 인덱스 업데이트, 11개 필드 반환 | 🔴 Critical |
| `getTablePlayers(tableId)` | ~308 | tableId 숫자 변환, COLS 업데이트 | 🔴 Critical |
| `updatePlayerChips(tableId, seatNo, chips)` | ~400 | 숫자 비교, COLS.chipCount | 🔴 Critical |
| `addPlayer()` | ~420 | 11개 컬럼 입력 | 🔴 Critical |
| `removePlayer()` | ~454 | 숫자 비교 | 🔴 Critical |
| `readRoster_()` | ~200 | COLS 인덱스 업데이트 | 🔴 Critical |
| `validateTableId_()` | ~64 | 문자열/숫자 모두 지원 | 🟡 Medium |
| `validateSeatNo_()` | ~76 | 문자열/숫자 모두 지원 | 🟡 Medium |

---

## 🎨 tracker.html 수정사항

### 1. 테이블/좌석 번호 표시 변경

```javascript
// 기존 (문자열 그대로)
`<div class="table-label">${player.tableNo}</div>`  // "T15"
`<div class="seat-label">${player.seatNo}</div>`    // "S3"

// 신규 (숫자 → 문자열 변환)
`<div class="table-label">T${player.tableNo}</div>` // 15 → "T15"
`<div class="seat-label">S${player.seatNo}</div>`   // 3 → "S3"
```

### 2. 서버 함수 호출 시 숫자 전달

```javascript
// 기존 (문자열)
google.script.run.getTablePlayers('T15');
google.script.run.updatePlayerChips('T15', 'S3', 50000);

// 신규 (숫자)
google.script.run.getTablePlayers(15);
google.script.run.updatePlayerChips(15, 3, 50000);
```

### 3. 수정 필요 함수

| 함수 | 수정 내용 | 우선순위 |
|------|----------|----------|
| `renderKeyPlayers()` | 숫자 → "T15" 변환, PlayerId 표시 추가 | 🔴 Critical |
| `renderTablePlayers()` | 숫자 → "S3" 변환, PlayerId 표시 추가 | 🔴 Critical |
| `loadTablePlayers(tableId)` | 문자열 → 숫자 변환 | 🔴 Critical |
| `editChips()` | 숫자 파라미터 전달 | 🔴 Critical |
| `parseTableNo()` | 신규 헬퍼 함수 ("T15" → 15) | 🔴 Critical |
| `parseSeatNo()` | 신규 헬퍼 함수 ("S3" → 3) | 🔴 Critical |

---

## 📋 단계별 실행 계획

### Phase 1: tracker_gs.js 수정 (3시간)

#### 1.1 COLS 상수 업데이트 (30분)
- [ ] `cols` → `COLS` 11개 컬럼 정의
- [ ] 모든 참조 업데이트 (Find & Replace)

#### 1.2 핵심 함수 수정 (2시간)
- [ ] `getKeyPlayers()` - COLS 인덱스 업데이트
- [ ] `getTablePlayers(tableId)` - tableId 숫자 변환
- [ ] `updatePlayerChips()` - 숫자 비교, COLS.chipCount
- [ ] `addPlayer()` - 11개 컬럼 입력 (TableId, SeatId, PlayerId 처리)
- [ ] `removePlayer()` - 숫자 비교
- [ ] `readRoster_()` - COLS 인덱스 업데이트

#### 1.3 검증 함수 수정 (30분)
- [ ] `validateTableId_()` - 문자열/숫자 모두 지원
- [ ] `validateSeatNo_()` - 문자열/숫자 모두 지원

---

### Phase 2: tracker.html 수정 (2시간)

#### 2.1 헬퍼 함수 추가 (30분)
- [ ] `parseTableNo(str)` - "T15" → 15
- [ ] `parseSeatNo(str)` - "S3" → 3
- [ ] `formatTableNo(num)` - 15 → "T15"
- [ ] `formatSeatNo(num)` - 3 → "S3"

#### 2.2 렌더링 함수 수정 (1.5시간)
- [ ] `renderKeyPlayers()` - 숫자 → "T15", PlayerId 표시
- [ ] `renderTablePlayers()` - 숫자 → "S3", PlayerId 표시
- [ ] `loadTablePlayers()` - 문자열 → 숫자 변환
- [ ] `editChips()` - 숫자 파라미터 전달

---

### Phase 3: 테스트 및 배포 (2시간)

#### 3.1 로컬 테스트 (1시간)
- [ ] `getKeyPlayers()` 호출 성공
- [ ] `getTablePlayers(15)` 호출 성공
- [ ] 칩 수정 테스트
- [ ] 플레이어 추가 테스트 (TableId, SeatId, PlayerId 처리)
- [ ] 플레이어 삭제 테스트

#### 3.2 배포 및 웹앱 테스트 (1시간)
- [ ] clasp push
- [ ] clasp deploy
- [ ] 웹앱 UI 렌더링 확인
- [ ] CRUD 작업 전체 테스트

---

## ✅ 검증 체크리스트

### 데이터 무결성
- [ ] Type 시트 11개 컬럼 확인
- [ ] TableNo 숫자형 (typeof === 'number')
- [ ] SeatNo 숫자형 (typeof === 'number')
- [ ] PlayerId, TableId, SeatId 존재

### 기능 검증
- [ ] `getKeyPlayers()` 호출 성공
- [ ] `getTablePlayers(15)` 호출 성공
- [ ] `updatePlayerChips(15, 3, 50000)` 성공
- [ ] `addPlayer()` → 11개 컬럼 입력 확인
- [ ] `removePlayer()` 성공

### UI 검증
- [ ] Key Player View 렌더링
- [ ] Table View 렌더링
- [ ] "T15", "S3" 형식 표시 확인
- [ ] PlayerId 표시 확인 (선택 사항)

---

## 🚨 주의사항

### 1. TableId, SeatId, PlayerId 처리

**addPlayer() 함수에서**:
- TableId, SeatId는 어떻게 생성?
  - **옵션 1**: 자동 증가 (현재 최대값 + 1)
  - **옵션 2**: 랜덤 생성
  - **옵션 3**: Seats.csv 임포트 시에만 채워짐 (수동 입력 시 빈값)

**추천**: 옵션 3 (임포트 전용 ID는 빈값 또는 0)

### 2. 테이블/좌석 번호 형식

**저장**: 숫자 (15, 3)
**표시**: 문자열 ("T15", "S3")
**입력**: 둘 다 지원 ("T15" 또는 "15")

### 3. 기존 데이터 호환성

Type 시트가 이미 Seats.csv 구조로 변경되었으므로:
- ✅ 데이터 마이그레이션 불필요
- ✅ 코드만 수정하면 됨

---

## 💡 추가 기능 제안 (선택 사항)

### PlayerId 기반 중복 방지

```javascript
function addPlayer(tableNo, seatNo, playerName, ...) {
  // PlayerId 기반 중복 체크
  const existingPlayer = findPlayerById(playerId);
  if (existingPlayer) {
    throw new Error(`PlayerId ${playerId}는 이미 ${existingPlayer.tableNo} 테이블에 등록되어 있습니다.`);
  }
  // ...
}
```

### PlayerId 표시 (UI)

Key Player Card에 PlayerId 추가:
```html
<div class="keyPlayerCard">
  <div class="cardHeader">
    <span class="tableLabel">T15</span>
    <span class="playerName">Murat Altunok</span>
    <span class="playerId">#104616</span> ← 신규
  </div>
  ...
</div>
```

---

**작성일**: 2025-10-12
**작성자**: Claude AI
**버전**: Seats.csv 기반 구조 적용
