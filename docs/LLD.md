# LLD - Poker Tracker

> **기술 설계** | 비전: [PLAN](PLAN.md) | 작업: [PRD](PRD.md) | 상태: [STATUS](STATUS.md) | 버전: [version.js](../version.js) 참조

## 🔍 AI 인덱스

- **PRD 1.1**: `tracker_gs.js:1-618` (독립 GS 파일, 618줄), `tracker.html:1-461` (독립 HTML 파일, 461줄)
- **PRD 1.2**: `tracker.html:127` (loadKeyPlayers 함수), `tracker_gs.js:268` (getKeyPlayers 함수)
- **PRD 1.3**: `tracker.html:182` (loadTablePlayers 함수), `tracker_gs.js:308` (getTablePlayers 함수)
- **PRD 1.4**: `tracker.html:127-145` (응답 형식 버그 수정 완료), `tracker_gs.js:234` (successResponse_ 표준 응답)
- **PRD 1.5**: Type 시트 A/B열 추가 (Poker Room, Table Name)
  - 서버: `tracker_gs.js:268` (getKeyPlayers - A/B열 읽기), `tracker_gs.js:308` (getTablePlayers - A/B열 읽기)
  - 클라이언트: `tracker.html:147-184` (renderKeyPlayers - Poker Room/Table Name 표시), `tracker.html:206-233` (renderTablePlayers - 헤더 표시)

---

## 📑 아키텍처

### 전체 구조
```
Tracker (완전 독립 웹앱)
├── 프론트엔드 (tracker.html) ← 신규 파일
│   ├── Key Player View (keyPlayerList div)
│   ├── Table View (tablePlayerList div)
│   └── 오버레이 (칩 수정/플레이어 추가/삭제 확인)
│
├── 백엔드 (tracker_gs.js) ← 신규 파일
│   ├── getKeyPlayers() - Type 시트 Keyplayer=TRUE 읽기
│   ├── getTablePlayers(tableId) - 특정 테이블 9좌석 읽기
│   ├── updatePlayerChips(tableId, seatNo, chips) - 칩 수정
│   ├── addPlayer(tableId, seatNo, name, nation, chips, isKey) - 플레이어 추가
│   ├── removePlayer(tableId, seatNo) - 플레이어 삭제
│   └── doGet_Tracker(e) - 웹앱 진입점
│
└── 데이터 소스 (Type 시트)
    └── 컬럼: Poker Room (A), Table Name (B), Table No. (C), Seat No. (D), Player (E), Nation (F), Chips (G), Keyplayer (H)
```

---

## 🧠 기술 결정

### 1. 왜 완전 독립 파일 (tracker.html + tracker_gs.js)?
- **PLAN 근거**: HandLogger(index.html + code.gs)와 완전 분리
- **장점**:
  - index.html 수정 불필요 (기존 Record/Review 모드 무손실 유지)
  - Google Apps Script에서 별도 웹앱으로 배포 가능
  - 독립 개발/테스트 가능 (HandLogger 영향 없음)
- **트레이드오프**: 헬퍼 함수 중복 (withScriptLock_, readAll_ 등)

### 2. 왜 표준 응답 형식? (v1.3.0 리팩토링)
- **PLAN 근거**: 에러 핸들링 표준화, 메타데이터 활용
- **장점**:
  - 일관된 응답 구조: `{ success: true, data: {...}, meta: { timestamp, version } }`
  - 에러 처리 통일: `{ success: false, error: { code, message, details } }`
  - 버전/타임스탬프 로깅 가능
- **트레이드오프**:
  - 클라이언트 수정 필요 (response.data.players 추출)
  - v1.3.0 리팩토링 시 클라이언트 업데이트 누락 → v2.0 블로커 발생

### 3. 왜 독립 웹앱?
- **PLAN 근거**: Tracker는 Type 시트만 관리, HANDS/ACTIONS 시트 미사용
- **장점**: HandLogger Record/Review 모드와 완전 분리 → 충돌 없음
- **트레이드오프**: 사용자가 2개 URL 관리 필요 (HandLogger + Tracker)

### 4. 왜 일반 텍스트 입력?
- **PLAN 근거**: Minimal Design 철학 (코드 최소화)
- **장점**: 숫자패드 커스텀 UI 불필요 → 구현 시간 50% 감소
- **트레이드오프**: 사용자가 "k" 단위 입력 필요 (예: 520000 또는 520k)

### 5. 왜 localStorage 칩 변화량 추적?
- **PLAN 근거**: 시나리오 3 (칩 변화량 시각화 ↑↓)
- **장점**: 서버 부하 없음, 클라이언트 사이드 완결
- **트레이드오프**: 브라우저 삭제 시 이력 손실

### 6. 왜 ScriptLock 사용?
- **PLAN 근거**: 동시 사용자 Type 시트 동시 쓰기 방지
- **장점**: 데이터 무결성 보장
- **트레이드오프**: 대기 시간 발생 (최대 0.5초)

### 7. 왜 Poker Room/Table Name 추가? (v2.2.0)
- **PLAN 근거**: 시나리오 1 (테이블 위치 상세 정보 제공)
- **배경**: 포커 대회장에는 여러 룸과 테이블이 있음 (예: Merit Hall - Ocean Blue)
- **장점**:
  - 물리적 위치 명확화 (T1만으로는 위치 파악 어려움)
  - 방송팀/스태프가 즉시 테이블 위치 확인 가능
  - UI 가독성 향상 (Roboto 12px, 중앙 정렬)
- **신규 플레이어 등록 로직**:
  - addPlayer() 함수에서 A/B열 기본값 자동 입력
  - Poker Room: "Merit Hall" (기본값)
  - Table Name: "Ocean Blue" (기본값)
  - 사용자가 Type 시트에서 수동으로 변경 가능
- **트레이드오프**:
  - Type 시트 컬럼 2개 사용 (A/B열)
  - 서버 함수 수정 필요 (A/B열 읽기/쓰기)
  - UI 수정 필요 (Poker Room/Table Name 표시)

---

## 🐛 v2.0 블로커: 응답 형식 불일치

### 문제 상황 (PRD Phase 1.4)

**시간순 정리:**
1. **v1.2 이전**: 서버가 배열 직접 반환
   ```javascript
   function getKeyPlayers() {
     return players;  // [{ ... }, { ... }]
   }
   ```

2. **v1.3.0 리팩토링** (2025-10-06): 표준 응답 형식 도입
   ```javascript
   function getKeyPlayers() {
     return successResponse_({ players, count });
     // { success: true, data: { players: [...] }, meta: {...} }
   }
   ```

3. **문제**: 클라이언트 업데이트 누락
   - tracker_gs.js: v1.3.0 ✅
   - tracker.html: v1.2 코드 그대로 ❌

### 실제 응답 vs 클라이언트 기대

**서버 (tracker_gs.js:268-298):**
```javascript
function getKeyPlayers() {
  // ...
  return successResponse_({ players, count: players.length });
}

// 실제 반환값:
{
  "success": true,
  "data": {
    "players": [{ tableNo: "T15", ... }, ...],
    "count": 18
  },
  "meta": {
    "timestamp": "2025-10-07T14:32:15Z",
    "version": "v1.3.0"
  }
}
```

**클라이언트 (tracker.html:127-135):**
```javascript
.withSuccessHandler(players => {
  keyPlayers = players;  // ❌ players = 위의 JSON 전체 (객체)
  renderKeyPlayers(players);  // ❌ TypeError: players.forEach is not a function
})
```

### 수정 전략

**패턴 1: 목록 조회 (loadKeyPlayers, loadTablePlayers)**
```javascript
// 수정 전
.withSuccessHandler(players => {
  keyPlayers = players;
  renderKeyPlayers(players);
})

// 수정 후
.withSuccessHandler(response => {
  if (!response.success) {
    showError(response.error?.message || '데이터 로드 실패');
    return;
  }
  const players = response.data.players;
  keyPlayers = players;
  renderKeyPlayers(players);
})
```

**패턴 2: 단일 작업 (updatePlayerChips, addPlayer, removePlayer)**
```javascript
// 수정 전
.withSuccessHandler(() => {
  loadKeyPlayers();  // 성공 시 리렌더링
})

// 수정 후
.withSuccessHandler(response => {
  if (!response.success) {
    showError(response.error?.message || '작업 실패');
    return;
  }
  loadKeyPlayers();  // 성공 시 리렌더링
})
```

### 영향 범위

| 함수 | 라인 | 서버 함수 | 수정 패턴 | 우선순위 |
|------|------|-----------|----------|----------|
| `loadKeyPlayers()` | 127 | `getKeyPlayers()` | 패턴 1 | 🔴 Critical |
| `loadTablePlayers()` | 182 | `getTablePlayers()` | 패턴 1 | 🔴 Critical |
| `editChips()` | 226 | `updatePlayerChips()` | 패턴 2 | 🟡 Medium |
| `addPlayerPrompt()` | 277 | `addPlayer()` | 패턴 2 | 🟡 Medium |
| `deletePlayerConfirm()` | 351 | `removePlayer()` | 패턴 2 | 🟡 Medium |

### 수정 완료 시 효과

1. ✅ `TypeError: players.forEach is not a function` 해결
2. ✅ 키 플레이어 목록 정상 표시
3. ✅ 테이블 관리 기능 정상 작동
4. ✅ 서버 에러 메시지 사용자에게 표시 가능
5. ✅ 메타데이터 활용 가능 (버전, 타임스탬프)

### 배포 이슈 해결 (2025-10-07)

**문제**: `clasp push` 성공했지만 웹앱에서 여전히 에러 발생
- **원인**: `clasp push`는 코드만 업로드 (Draft 상태), 웹앱 자동 재배포 안 됨
- **해결**: `clasp deploy -i <DEPLOYMENT_ID> -d "버전 설명"` 실행 필요

**배포 과정**:
```bash
# 1. 현재 배포 ID 확인
clasp deployments

# 2. 특정 배포 ID로 재배포
clasp deploy -i AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA -d "v2.0.1 - Response format bug fix"

# 결과: @5 버전으로 배포 완료
```

**테스트 방법**:
- URL에 `?v=2.0.1` 추가하거나 Ctrl+Shift+R (하드 리프레시)
- 시크릿 모드로 브라우저 캐시 우회

---

## 🗂️ 데이터 모델

### Type 시트 구조
```
| Table No. | Seat No. | Players  | Nationality | Chips  | Keyplayer |
|-----------|----------|----------|-------------|--------|-----------|
| T15       | S3       | 박프로   | KR          | 520000 | TRUE      |
| T15       | S1       | Alice    | US          | 280000 | FALSE     |
| T28       | S5       | 김프로   | KR          | 310000 | TRUE      |
```

### localStorage 구조
```javascript
{
  "phl_chipHistory": {
    "T15_S3": [520000, 750000], // 이전 칩, 현재 칩
    "T28_S5": [310000, 270000]
  }
}
```

---

## 🔧 핵심 함수 설계

### 프론트엔드 (index.html)

#### `loadKeyPlayers()` - 키 플레이어 목록 렌더링
```javascript
function loadKeyPlayers() {
  showLoading();
  google.script.run
    .withSuccessHandler(players => {
      const list = document.getElementById('keyPlayerList');
      list.innerHTML = '';
      players.forEach(p => {
        const card = createKeyPlayerCard(p); // 카드 HTML 생성
        list.appendChild(card);
      });
      hideLoading();
    })
    .withFailureHandler(err => showError(err))
    .getKeyPlayers();
}
```

#### `loadTablePlayers(tableId)` - 테이블 플레이어 목록 렌더링
```javascript
function loadTablePlayers(tableId) {
  showLoading();
  google.script.run
    .withSuccessHandler(players => {
      const list = document.getElementById('tablePlayerList');
      list.innerHTML = '';
      for (let i = 1; i <= 9; i++) {
        const seat = `S${i}`;
        const player = players.find(p => p.seatNo === seat);
        const row = player ? createPlayerRow(player) : createEmptySeatRow(seat);
        list.appendChild(row);
      }
      hideLoading();
    })
    .withFailureHandler(err => showError(err))
    .getTablePlayers(tableId);
}
```

#### `editChips(tableId, seatNo, currentChips)` - 칩 수정 오버레이
```javascript
function editChips(tableId, seatNo, currentChips) {
  const newChips = prompt(`현재: ${currentChips}\n새 칩 (예: 750000 또는 750k):`);
  if (!newChips) return;

  const parsed = parseChips(newChips); // "750k" → 750000 변환
  showLoading();
  google.script.run
    .withSuccessHandler(() => {
      saveChipHistory(tableId, seatNo, currentChips, parsed); // localStorage
      loadKeyPlayers(); // UI 리렌더링
    })
    .withFailureHandler(err => showError(err))
    .updatePlayerChips(tableId, seatNo, parsed);
}
```

#### `addPlayerPrompt(tableId, seatNo)` - 플레이어 추가 오버레이
```javascript
function addPlayerPrompt(tableId, seatNo) {
  // 간단 구현: 4개 prompt 연속 (v1.1에서 폼 오버레이로 개선)
  const name = prompt('이름:');
  if (!name) return;
  const nation = prompt('국적 (KR, US, JP 등):', 'KR');
  const chips = prompt('칩:');
  const isKey = confirm('키 플레이어로 등록?');

  showLoading();
  google.script.run
    .withSuccessHandler(() => loadTablePlayers(tableId))
    .withFailureHandler(err => showError(err))
    .addPlayer(tableId, seatNo, name, nation, parseChips(chips), isKey);
}
```

#### `deletePlayerConfirm(tableId, seatNo, playerName)` - 삭제 확인
```javascript
function deletePlayerConfirm(tableId, seatNo, playerName) {
  if (!confirm(`${seatNo} ${playerName} 삭제하시겠습니까?`)) return;

  showLoading();
  google.script.run
    .withSuccessHandler(() => loadTablePlayers(tableId))
    .withFailureHandler(err => showError(err))
    .removePlayer(tableId, seatNo);
}
```

---

### 백엔드 (tracker_gs.js)

#### `getKeyPlayers()` - 키 플레이어 목록 반환
```javascript
function getKeyPlayers() {
  const roster = readRoster_(); // 기존 함수 재사용
  return roster
    .filter(p => p.keyplayer === true)
    .map(p => ({
      tableNo: p.tableNo,
      seatNo: p.seatNo,
      player: p.player,
      nation: p.nation,
      chips: p.chips
    }));
}
```

#### `getTablePlayers(tableId)` - 테이블 전체 플레이어 반환
```javascript
function getTablePlayers(tableId) {
  const roster = readRoster_();
  const players = roster.filter(p => p.tableNo === tableId);

  const result = [];
  for (let i = 1; i <= 9; i++) {
    const seat = `S${i}`;
    const found = players.find(p => p.seatNo === seat);
    if (found) {
      result.push({
        seatNo: seat,
        player: found.player,
        nation: found.nation,
        chips: found.chips,
        keyplayer: found.keyplayer
      });
    } else {
      result.push({ seatNo: seat, empty: true });
    }
  }
  return result;
}
```

#### `updatePlayerChips(tableId, seatNo, newChips)` - 칩 업데이트
```javascript
function updatePlayerChips(tableId, seatNo, newChips) {
  return withScriptLock_(() => {
    const ss = appSS_();
    const sh = ss.getSheetByName(SH.TYPE);
    const data = readAll_(sh);

    const rowIndex = data.rows.findIndex(r =>
      r[data.map['Table No.']] === tableId &&
      r[data.map['Seat No.']] === seatNo
    );

    if (rowIndex === -1) throw new Error(`${tableId} ${seatNo} 플레이어 없음`);

    const chipsCol = data.map['Chips'];
    sh.getRange(rowIndex + 2, chipsCol + 1).setValue(newChips); // +2 = 헤더 + 0-index

    return { success: true };
  });
}
```

#### `addPlayer(tableId, seatNo, name, nation, chips, isKey)` - 플레이어 추가
```javascript
function addPlayer(tableId, seatNo, name, nation, chips, isKey) {
  return withScriptLock_(() => {
    const ss = appSS_();
    const sh = ss.getSheetByName(SH.TYPE);

    // 중복 체크
    const data = readAll_(sh);
    const exists = data.rows.some(r =>
      r[data.map['Table No.']] === tableId &&
      r[data.map['Seat No.']] === seatNo
    );
    if (exists) throw new Error(`${tableId} ${seatNo} 이미 존재`);

    // 추가 (A/B열 기본값 포함)
    const row = [];
    row[cols.pokerRoom] = 'Merit Hall';  // A열 기본값
    row[cols.tableName] = 'Ocean Blue';  // B열 기본값
    row[cols.table] = tableId;
    row[cols.seat] = seatNo;
    row[cols.player] = name;
    row[cols.nation] = nation;
    row[cols.chips] = chips;
    row[cols.key] = isKey;

    sh.appendRow(row);
    return { success: true };
  });
}
```

#### `removePlayer(tableId, seatNo)` - 플레이어 삭제
```javascript
function removePlayer(tableId, seatNo) {
  return withScriptLock_(() => {
    const ss = appSS_();
    const sh = ss.getSheetByName(SH.TYPE);
    const data = readAll_(sh);

    const rowIndex = data.rows.findIndex(r =>
      r[data.map['Table No.']] === tableId &&
      r[data.map['Seat No.']] === seatNo
    );

    if (rowIndex === -1) throw new Error(`${tableId} ${seatNo} 플레이어 없음`);

    sh.deleteRow(rowIndex + 2); // +2 = 헤더 + 0-index
    return { success: true };
  });
}
```

---

## 🎨 UI 컴포넌트 설계

### Key Player Card
```html
<div class="keyPlayerCard">
  <div class="cardHeader">
    <span class="tableLabel">T15</span>
    <span class="playerName">박프로 (S3)</span>
    <span class="flag">🇰🇷</span>
  </div>
  <div class="chipRow" onclick="editChips('T15', 'S3', 750000)">
    <span class="chips">750k</span>
    <span class="chipChange up">↑230k</span>
  </div>
  <button onclick="loadTablePlayers('T15')">T15 관리</button>
</div>
```

### Table Player Row
```html
<!-- 플레이어 있을 때 -->
<div class="playerRow">
  <span class="seat">S3</span>
  <span class="name">박프로⭐</span>
  <span class="flag">🇰🇷</span>
  <span class="chips" onclick="editChips('T15', 'S3', 750000)">750k</span>
  <button class="deleteBtn" onclick="deletePlayerConfirm('T15', 'S3', '박프로')">🗑️</button>
</div>

<!-- 빈 좌석 -->
<div class="playerRow empty">
  <span class="seat">S2</span>
  <span class="emptySeat">(빈 좌석)</span>
  <button onclick="addPlayerPrompt('T15', 'S2')">[+]</button>
</div>
```

---

## 🚀 성능 최적화

### 1. 클라이언트 사이드 캐싱
- localStorage에 키 플레이어 목록 저장 (30초 TTL)
- 서버 호출 최소화

### 2. 배치 업데이트 (v1.2)
- 일괄 칩 입력 시 `batchUpdate` 사용
- 9명 칩 업데이트를 1번의 API 호출로 처리

### 3. UI 리렌더링 최적화
- 칩 수정 시 전체 리렌더링 대신 해당 카드만 업데이트 (v1.1)

---

## 🧪 테스트 시나리오

### 1. 키 플레이어 목록 로딩
- **Given**: Type 시트에 Keyplayer=TRUE 18명
- **When**: Tracker 모드 진입
- **Then**: 18개 카드 표시, 2초 이내 로딩

### 2. 칩 수정
- **Given**: 박프로 520k
- **When**: "520k" 클릭 → "750000" 입력 → 확인
- **Then**: Type 시트 업데이트, UI "750k" 표시, 변화량 "↑230k"

### 3. 플레이어 추가
- **Given**: T15 S2 빈 좌석
- **When**: [+] → "Alice", "US", "280000", ☐ 입력
- **Then**: Type 시트 행 추가, Table View 리렌더링

### 4. 플레이어 삭제
- **Given**: T15 S3 박프로
- **When**: 🗑️ → 확인
- **Then**: Type 시트 행 삭제, Table View 리렌더링

---

## 🔗 관련 문서

- [PLAN.md](PLAN.md) - 프로젝트 비전 (페르소나/시나리오/성공 기준)
- [PRD.md](PRD.md) - 작업 목록 (Phase 1~3)
- [STATUS.md](STATUS.md) - 현재 진행 상태
- [CHANGELOG.md](CHANGELOG.md) - 버전별 변경 이력