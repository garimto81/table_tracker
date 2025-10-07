# Tracker 배포 가이드

> **독립 웹앱 배포** | 버전: v1.0 | HandLogger와 완전 분리

---

## 📦 배포 파일

Tracker는 **2개 파일만** 필요합니다:

1. **[tracker.gs](../tracker.gs)** (300줄) - 백엔드
2. **[tracker.html](../tracker.html)** (430줄) - 프론트엔드

---

## 🚀 배포 방법 (독립 웹앱)

### **1단계: 새 Apps Script 프로젝트 생성**

```
1. https://script.google.com 접속
2. 새 프로젝트 클릭
3. 프로젝트 이름: "Tracker v1.0"
```

---

### **2단계: 파일 추가**

#### **A. tracker.gs 추가**
```
1. Code.gs 파일명 변경 → tracker.gs
2. 로컬 tracker.gs 내용 전체 복사 → 붙여넣기
3. 저장 (Ctrl+S)
```

#### **B. tracker.html 추가**
```
1. 파일 추가 (+) → HTML 파일
2. 파일명: tracker
3. 로컬 tracker.html 내용 전체 복사 → 붙여넣기
4. 저장 (Ctrl+S)
```

---

### **3단계: 웹앱 배포**

```
1. 배포 버튼 클릭 (오른쪽 상단)
2. "새 배포" 선택
3. 설정:
   ┌────────────────────────────────────┐
   │ 유형: 웹 앱                         │
   │ 설명: Tracker v1.0 (독립 웹앱)     │
   │ 실행 주체: 나                       │
   │ 액세스 권한: 나만                   │
   │             (또는 조직 내 모든 사용자)│
   └────────────────────────────────────┘
4. "배포" 클릭
5. 권한 승인 (Google 계정 인증)
6. URL 복사:
   https://script.google.com/macros/s/AKfycby.../exec
```

---

### **4단계: Type 시트 ID 확인**

```
⚠️ 중요: Tracker는 Type 시트를 사용합니다.

1. Google Sheets에서 Type 시트 열기
2. URL에서 스프레드시트 ID 확인:
   https://docs.google.com/spreadsheets/d/[ID]/edit

3. tracker.gs 15번째 줄 확인:
   const APP_SPREADSHEET_ID = '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4';

   ✅ ID가 일치하면 OK
   ❌ ID가 다르면 수정 후 재배포
```

---

## ✅ 배포 완료 확인

### **테스트 시나리오**

#### **1. Type 시트 준비**
```
| Table No. | Seat No. | Players  | Nationality | Chips  | Keyplayer |
|-----------|----------|----------|-------------|--------|-----------|
| T15       | S3       | 박프로   | KR          | 520000 | TRUE      |
| T28       | S5       | 김프로   | KR          | 310000 | TRUE      |
```

#### **2. Tracker 웹앱 접속**
```
https://script.google.com/macros/s/.../exec
```

#### **3. Key Player View 확인**
```
✅ "Key Players (2)" 표시
✅ 박프로 (T15 S3 520k) 카드 표시
✅ 김프로 (T28 S5 310k) 카드 표시
```

#### **4. 칩 수정 테스트**
```
1. "520k" 클릭
2. "750000" 입력 → 확인
3. Type 시트에서 박프로 칩 520000 → 750000 확인 ✅
4. Tracker 새로고침 → "750k ↑230k" 표시 ✅
```

#### **5. 테이블 관리 테스트**
```
1. [T15 관리] 클릭
2. S1~S9 좌석 표시 확인 ✅
3. S3 박프로⭐ 750k 🗑️ 표시 ✅
4. 빈 좌석 [+] 버튼 표시 ✅
```

#### **6. 플레이어 추가 테스트**
```
1. S1 빈 좌석 [+] 클릭
2. 이름: "Alice"
3. 국적: US
4. 칩: 280000
5. 키: ☐ (체크 안 함)
6. [추가] → Type 시트 행 추가 확인 ✅
```

---

## 🔗 HandLogger 연동 (선택사항)

### **index.html에 버튼 추가**

```javascript
// 헤더에 버튼 추가
<button id="modeTracker" onclick="openTrackerMode()">🎯</button>

// 스크립트 추가
const TRACKER_URL = 'https://script.google.com/.../exec';
function openTrackerMode() {
  window.open(TRACKER_URL, '_blank');
}
```

---

## 🛠️ 재배포 (업데이트)

### **코드 수정 후 재배포**

```
1. tracker.gs 또는 tracker.html 수정
2. 저장 (Ctrl+S)
3. 배포 → 배포 관리
4. 기존 배포 옆 ✏️ 클릭
5. "새 버전" 선택
6. 설명: "v1.0.1 - 버그 수정"
7. "버전 배포" 클릭

⚠️ 중요: URL은 변경되지 않습니다!
```

---

## ⚙️ 설정 (선택사항)

### **다른 스프레드시트 사용**

```javascript
// tracker.gs 15번째 줄 수정
const APP_SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
```

### **Type 시트 이름 변경**

```javascript
// tracker.gs 16번째 줄 수정
const TYPE_SHEET_NAME = 'YourSheetName';
```

---

## 🐛 문제 해결

### **1. "Type 시트가 없습니다" 에러**
```
원인: APP_SPREADSHEET_ID가 잘못됨
해결: tracker.gs 15번째 줄 ID 확인 후 재배포
```

### **2. "키 플레이어가 없습니다" 표시**
```
원인: Type 시트에 Keyplayer=TRUE 플레이어 없음
해결: Type 시트에서 Keyplayer 컬럼 TRUE로 설정
```

### **3. "권한이 없습니다" 에러**
```
원인: 스프레드시트 액세스 권한 없음
해결:
1. 배포 → 배포 관리
2. 액세스 권한: "나만" → "조직 내 모든 사용자"
3. 버전 배포
```

### **4. "에러: 플레이어를 찾을 수 없습니다"**
```
원인: Type 시트 컬럼명 불일치
해결:
- Table No. (또는 TableNo, table_no)
- Seat No. (또는 Seat, SeatNo)
- Players (또는 Player, Name)
- Nationality (또는 Nation, Country)
- Chips (또는 Stack, Starting Chips)
- Keyplayer (또는 Key Player, KeyPlayer)
```

---

## 📊 성능 최적화

### **ScriptLock 타임아웃 조정**

```javascript
// tracker.gs 19번째 줄 수정 (기본 500ms)
L.waitLock(500);  // → 1000 (1초)
```

### **localStorage 칩 이력 초기화**

```javascript
// 브라우저 개발자 도구 (F12) → Console
localStorage.removeItem('phl_chipHistory');
```

---

## 🔗 관련 문서

- [PLAN_Tracker.md](PLAN_Tracker.md) - 프로젝트 비전
- [PRD_Tracker.md](PRD_Tracker.md) - 작업 목록
- [LLD_Tracker.md](LLD_Tracker.md) - 기술 설계
- [STATUS_Tracker.md](STATUS_Tracker.md) - 현재 상태

---

## 📞 지원

문제 발생 시:
1. tracker.gs 실행 로그 확인 (Apps Script 에디터 → 실행 → 로그)
2. 브라우저 개발자 도구 (F12) → Console 확인
3. Type 시트 데이터 형식 확인
