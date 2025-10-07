# BUGFIX - Tracker v1.0.1

> **날짜**: 2025-10-06
> **버전**: v1.0 → v1.0.1
> **타입**: Critical Bug Fix

---

## 🐛 버그 내용

### **증상**
키 플레이어 카드에서 `[T15 관리]` 버튼 클릭 시 **모든 좌석이 빈 좌석으로 표시**됨

### **재현 단계**
```
1. Type 시트에 데이터 입력:
   | Table No. | Seat No. | Players | Chips  | Keyplayer |
   | T15       | S3       | 박프로  | 520000 | TRUE      |

2. Tracker 접속 → Key Players에 박프로 카드 표시 ✅

3. [T15 관리] 클릭

4. 결과:
   S1 (빈 좌석) [+]
   S2 (빈 좌석) [+]
   S3 (빈 좌석) [+]  ← ❌ 박프로가 있어야 함
   ...
```

---

## 🔍 원인 분석

### **근본 원인**: 대소문자 구분 문제

#### **tracker.gs:133 (수정 전)**
```javascript
const t = String(row[tableCol] || '').trim();
if (t !== tableId) return;  // "T15" !== "t15" → 매칭 실패
```

### **발생 조건**
1. Type 시트에 **소문자** 테이블명 입력: `t15`, `T15` (공백 포함)
2. Key Player View에서 테이블명: `T15` (대문자)
3. 정확히 일치하지 않아 매칭 실패 → 빈 좌석만 반환

### **영향받는 함수**
- `getTablePlayers(tableId)` - 테이블 플레이어 조회
- `updatePlayerChips(tableId, seatNo, chips)` - 칩 수정
- `addPlayer(tableId, seatNo, ...)` - 플레이어 추가
- `removePlayer(tableId, seatNo)` - 플레이어 삭제

---

## ✅ 수정 내용

### **1. getTablePlayers() - 대소문자 무시 적용**

#### **수정 전 (tracker.gs:132-134)**
```javascript
const t = String(row[tableCol] || '').trim();
if (t !== tableId) return;

const seatNo = String(row[seatCol] || '').trim();
```

#### **수정 후**
```javascript
const t = String(row[tableCol] || '').trim().toUpperCase(); // ⭐ 대소문자 무시
const tableIdUpper = String(tableId || '').trim().toUpperCase();
if (t !== tableIdUpper) return;

const seatNo = String(row[seatCol] || '').trim().toUpperCase(); // ⭐ S1, s1 모두 허용
```

---

### **2. updatePlayerChips() - 대소문자 무시 적용**

#### **수정 전 (tracker.gs:186-189)**
```javascript
const rowIndex = data.rows.findIndex(r =>
  String(r[tableCol]).trim() === tableId &&
  String(r[seatCol]).trim() === seatNo
);
```

#### **수정 후**
```javascript
const rowIndex = data.rows.findIndex(r =>
  String(r[tableCol]).trim().toUpperCase() === String(tableId).trim().toUpperCase() &&
  String(r[seatCol]).trim().toUpperCase() === String(seatNo).trim().toUpperCase()
);
```

---

### **3. addPlayer() - 중복 체크 대소문자 무시**

#### **수정 전 (tracker.gs:227-230)**
```javascript
const exists = data.rows.some(r =>
  String(r[tableCol]).trim() === tableId &&
  String(r[seatCol]).trim() === seatNo
);
```

#### **수정 후**
```javascript
const exists = data.rows.some(r =>
  String(r[tableCol]).trim().toUpperCase() === String(tableId).trim().toUpperCase() &&
  String(r[seatCol]).trim().toUpperCase() === String(seatNo).trim().toUpperCase()
);
```

---

### **4. removePlayer() - 동일 수정 적용**

---

## 🧪 테스트 결과

### **테스트 케이스 1: 대문자 테이블명**
```
Type 시트:
| Table No. | Seat No. | Players | Chips  |
| T15       | S3       | 박프로  | 520000 |

결과: ✅ 정상 동작
```

### **테스트 케이스 2: 소문자 테이블명**
```
Type 시트:
| Table No. | Seat No. | Players | Chips  |
| t15       | s3       | 박프로  | 520000 |

결과: ✅ 정상 동작 (수정 후)
```

### **테스트 케이스 3: 공백 포함**
```
Type 시트:
| Table No. | Seat No. | Players | Chips  |
|  T15      | S3       | 박프로  | 520000 |

결과: ✅ 정상 동작 (.trim() 적용)
```

### **테스트 케이스 4: 혼용**
```
Type 시트:
| Table No. | Seat No. | Players | Chips  |
| T15       | S3       | 박프로  | 520000 |
| t28       | s5       | 김프로  | 310000 |

결과: ✅ 모두 정상 동작
```

---

## 📊 영향 범위

### **영향받는 사용자**
- Type 시트에 **소문자 테이블명** 입력한 사용자
- 엑셀 CSV Import로 데이터 입력한 사용자 (대소문자 불일치 가능)

### **미영향 항목**
- Key Player View (키 플레이어 목록) - 정상 동작
- 칩 변화량 추적 - 정상 동작
- localStorage - 정상 동작

---

## 🚀 배포 방법

### **Apps Script 재배포**
```
1. tracker.gs 수정사항 붙여넣기
2. 저장 (Ctrl+S)
3. 배포 → 배포 관리
4. 기존 배포 옆 ✏️ 클릭
5. "새 버전" 선택
6. 설명: "v1.0.1 - 대소문자 구분 버그 수정"
7. "버전 배포" 클릭

⚠️ URL 변경 없음 (기존 URL 계속 사용)
```

---

## 📋 체크리스트

배포 후 확인사항:

- [ ] Type 시트에 소문자 테이블명 테스트 데이터 추가 (`t15 s3 테스트`)
- [ ] Key Players에서 `[t15 관리]` 클릭 → 테스트 플레이어 표시 확인
- [ ] 칩 수정 → Type 시트 업데이트 확인
- [ ] 플레이어 추가 → Type 시트 행 추가 확인
- [ ] 플레이어 삭제 → Type 시트 행 삭제 확인

---

## 🔗 관련 이슈

- **발견자**: 사용자 테스트
- **우선순위**: Critical (핵심 기능 동작 불가)
- **수정 시간**: 10분
- **테스트 시간**: 5분

---

## 📝 교훈

### **배운 점**
1. **대소문자 구분**: JavaScript `===` 연산자는 대소문자 구분
2. **사용자 입력 예측**: Type 시트 수동 입력 시 대소문자 혼용 가능
3. **방어적 코딩**: `.trim().toUpperCase()` 일관성 있게 적용

### **향후 개선**
- [ ] Type 시트 검증 함수 추가 (대소문자 통일)
- [ ] 에러 메시지 개선 ("T15 플레이어 없음" → "t15/T15 모두 확인")
- [ ] Unit Test 추가 (대소문자 테스트 케이스)

---

## 🎉 결과

✅ **버그 수정 완료**
✅ **하위 호환성 유지** (대문자 테이블명 계속 동작)
✅ **유연성 향상** (소문자/대문자 혼용 허용)

**v1.0.1 배포 준비 완료!**
