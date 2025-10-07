# BUGFIX - Phase 1.5 실패 분석 및 해결책

**날짜**: 2025-10-07
**버전**: v2.2.0
**배포**: @9
**상태**: 🔴 **실패** - 3가지 버그 발견

---

## 🐛 발견된 버그 (3개)

### 1. 중앙정렬 미적용 ❌

**증상**: Poker Room/Table Name이 좌측 정렬로 표시됨

**원인 분석**:
- CSS: `.roomTableInfo { text-align: center }` ✅ 정상
- HTML: `<div class="roomTableInfo">...</div>` ✅ 클래스 적용됨
- **추정 원인**:
  1. 브라우저 캐시로 인한 구버전 CSS 로드
  2. CSS 우선순위 문제 (다른 스타일이 override)
  3. HTML 구조 문제 (부모 요소의 flex 레이아웃)

**재현 방법**:
1. 웹앱 접속
2. Key Player Card 확인
3. "Merit Hall | Ocean Blue | T1" 좌측 정렬로 표시됨

**예상 해결책**:
- **해결책 1**: 브라우저 강제 새로고침 (Ctrl+Shift+R)
- **해결책 2**: CSS 우선순위 강제 (`text-align: center !important`)
- **해결책 3**: Flexbox 중앙 정렬 (`display: flex; justify-content: center`)

---

### 2. 시트 정렬 미적용 ❌

**증상**: Type 시트에서 행 추가 시 내림차순 정렬 안 됨

**원인 분석**:
- `sh.appendRow(row)` 사용 → 항상 마지막 행에 추가됨
- **Google Sheets는 appendRow() 후 자동 정렬 미지원**
- 정렬 기능이 코드에 구현되지 않음

**현재 동작**:
```javascript
sh.appendRow(row);  // 마지막 행에 추가만 함
// 정렬 코드 없음 ❌
```

**예상 해결책**:
- **해결책 1**: appendRow() 후 수동 정렬 (sort() 호출)
  ```javascript
  sh.appendRow(row);
  sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn())
    .sort([{column: 3, ascending: false}]);  // C열(Table No.) 내림차순
  ```
- **해결책 2**: 사용자가 Type 시트에서 수동 정렬 (필터 사용)
- **해결책 3**: 정렬 기능 제거 (PRD 요구사항 재확인)

**트레이드오프**:
- 자동 정렬: API 호출 증가, 처리 시간 증가 (0.5~1초)
- 수동 정렬: 사용자 불편, 데이터 혼란 가능성

---

### 3. A/B열 자동 입력 미작동 ❌

**증상**: 신규 플레이어 추가 시 A/B열에 빈값 들어감

**원인 분석**:

#### 가능한 원인 1: 컬럼 인덱스 감지 실패
```javascript
// tracker_gs.js:207-208
pokerRoom: findColIndex_(data.header, ['Poker Room', 'PokerRoom', 'poker_room']),
tableName: findColIndex_(data.header, ['Table Name', 'TableName', 'table_name']),
```

**확인 방법**:
- Type 시트 헤더가 정확히 "Poker Room", "Table Name"인지 확인
- 공백/대소문자 불일치 가능성

#### 가능한 원인 2: 배열 인덱스 오류
```javascript
// tracker_gs.js:457-460
const row = new Array(data.header.length).fill('');
if (cols.pokerRoom !== -1) row[cols.pokerRoom] = 'Merit Hall';
if (cols.tableName !== -1) row[cols.tableName] = 'Ocean Blue';
```

**문제**:
- `cols.pokerRoom`이 0이면 조건문 통과하지만 값이 설정되지 않을 수 있음
- 인덱스 0 = A열인데, 조건문에서 `-1`만 체크함

**올바른 조건**:
```javascript
if (cols.pokerRoom >= 0) row[cols.pokerRoom] = 'Merit Hall';
if (cols.tableName >= 0) row[cols.tableName] = 'Ocean Blue';
```

#### 가능한 원인 3: 배포 미반영
- clasp push는 성공했지만 웹앱이 구버전 로드 중
- Deployment ID 불일치 (@9로 배포했지만 웹앱이 @8 사용 중)

**확인 방법**:
```bash
clasp deployments
# 현재 웹앱이 어느 버전을 사용 중인지 확인
```

---

## 🎯 우선순위 해결 순서

### 1순위: A/B열 자동 입력 (Critical)
**근거**: 핵심 기능, 데이터 무결성 직접 영향
**해결책**:
1. Type 시트 헤더 확인 (A1="Poker Room", B1="Table Name")
2. 조건문 수정 (`!== -1` → `>= 0`)
3. 디버그 로그 추가 (cols.pokerRoom, cols.tableName 값 확인)

### 2순위: 중앙정렬 (High)
**근거**: UX 이슈, 기능은 작동하지만 가독성 저하
**해결책**:
1. 브라우저 캐시 클리어 (Ctrl+Shift+R)
2. CSS 우선순위 강제 (`!important`)
3. 배포 URL에 쿼리 파라미터 추가 (`?v=2.2.0`)

### 3순위: 시트 정렬 (Medium)
**근거**: 편의 기능, 수동으로 정렬 가능
**해결책**:
1. PRD 요구사항 재확인 (정렬이 필수인지?)
2. 필수면 appendRow() 후 sort() 추가
3. 필수 아니면 사용자 수동 정렬 안내

---

## 📝 다음 단계

### 즉시 실행 (디버깅)
```javascript
// tracker_gs.js addPlayer() 함수에 추가
Logger.log('=== addPlayer 디버그 ===');
Logger.log('cols.pokerRoom: ' + cols.pokerRoom);
Logger.log('cols.tableName: ' + cols.tableName);
Logger.log('row[cols.pokerRoom]: ' + row[cols.pokerRoom]);
Logger.log('row[cols.tableName]: ' + row[cols.tableName]);
Logger.log('최종 row: ' + JSON.stringify(row));
```

### Type 시트 헤더 확인
1. Type 시트 접속
2. A1, B1 셀 확인
3. 정확한 텍스트: "Poker Room", "Table Name" (공백/대소문자 일치?)

### 조건문 수정 (추정 해결책)
```javascript
// 수정 전
if (cols.pokerRoom !== -1) row[cols.pokerRoom] = 'Merit Hall';

// 수정 후
if (cols.pokerRoom !== undefined && cols.pokerRoom >= 0) {
  row[cols.pokerRoom] = 'Merit Hall';
  Logger.log('✅ Poker Room 설정: ' + row[cols.pokerRoom]);
}
```

---

## 🔗 관련 파일

- **코드**: [tracker_gs.js:457-467](../tracker_gs.js#L457) (addPlayer 함수)
- **CSS**: [tracker.html:66](../tracker.html#L66) (.roomTableInfo)
- **문서**: [PRD.md Phase 1.5](PRD.md#15-poker-roomtable-name-표시-추가)
- **배포**: [version.js](../version.js) (@9)

---

## 📊 예상 소요 시간

- 디버깅: 10분
- 수정: 20분
- 테스트: 10분
- **총**: 40분

---

## ⚠️ 블로커 업데이트

**STATUS.md 업데이트 필요**:
```markdown
## ⚠️ 블로커 (Critical)

### 1. A/B열 자동 입력 미작동
**원인**: 조건문 오류 또는 헤더 불일치
**해결**: Type 시트 헤더 확인 + 조건문 수정

### 2. 중앙정렬 미적용
**원인**: 브라우저 캐시 또는 CSS 우선순위
**해결**: 강제 새로고침 또는 CSS !important

### 3. 시트 정렬 미적용
**원인**: appendRow() 후 자동 정렬 미구현
**해결**: sort() 호출 추가 (또는 수동 정렬 안내)
```
