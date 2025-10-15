# Firebase 하이브리드 캐싱 설정 가이드

**버전**: v3.5.0
**목적**: 로딩 속도 99% 개선 (12초 → 0.1초)
**아키텍처**: Google Sheets (Source of Truth) + Firebase (Realtime Cache)

---

## 📋 개요

Firebase Realtime Database를 읽기 전용 캐시로 사용하여 즉시 로딩을 구현합니다.

```
Browser ←0.1초→ Firebase (캐시) ←1분→ Google Sheets (원본)
```

---

## 🔥 1단계: Firebase 프로젝트 생성

### 1-1. Firebase Console 접속

https://console.firebase.google.com

### 1-2. 새 프로젝트 생성

1. **프로젝트 추가** 클릭
2. 프로젝트 이름: `poker-tracker` 입력
3. Google Analytics: **비활성화** (선택)
4. **프로젝트 만들기** 클릭

---

## 🗄️ 2단계: Realtime Database 활성화

### 2-1. 데이터베이스 만들기

1. 좌측 메뉴 → **Realtime Database** 클릭
2. **데이터베이스 만들기** 클릭
3. 위치: **United States (us-central1)** 선택
4. 보안 규칙: **테스트 모드로 시작** 선택
5. **사용 설정** 클릭

### 2-2. 보안 규칙 설정

**Realtime Database → 규칙** 탭에서 다음으로 변경:

```json
{
  "rules": {
    "keyPlayers": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

**설명**:
- `.read: true`: 모든 사용자가 읽기 가능 (브라우저에서 즉시 로드)
- `.write: "auth != null"`: 인증된 사용자만 쓰기 가능 (Apps Script)

**게시** 버튼 클릭하여 저장

---

## 🌐 3단계: 웹 앱 등록

### 3-1. 앱 추가

1. 프로젝트 설정 (⚙️) → **프로젝트 설정**
2. **일반** 탭 하단 → 웹 아이콘 `</>` 클릭
3. 앱 닉네임: `Poker Tracker Web` 입력
4. Firebase Hosting: **체크 안 함**
5. **앱 등록** 클릭

### 3-2. Firebase 구성 정보 복사

다음 형식의 코드가 표시됩니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz12345678",
  authDomain: "poker-tracker-abc12.firebaseapp.com",
  databaseURL: "https://poker-tracker-abc12-default-rtdb.firebaseio.com",
  projectId: "poker-tracker-abc12",
  storageBucket: "poker-tracker-abc12.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

**⚠️ 이 정보를 복사해두세요!** (다음 단계에서 사용)

---

## 🔧 4단계: Apps Script 설정

### 4-1. 스크립트 속성 설정

1. Apps Script 에디터 (https://script.google.com) 접속
2. **프로젝트 설정** (⚙️) 클릭
3. **스크립트 속성** → **스크립트 속성 추가** 클릭
4. 다음 2개 속성 추가:

| 속성 | 값 | 설명 |
|------|-----|------|
| `FIREBASE_DB_URL` | `https://poker-tracker-abc12-default-rtdb.firebaseio.com` | Firebase Database URL (3-2에서 복사) |
| `FIREBASE_SECRET` | *(선택)* | 인증 토큰 (나중에 추가 가능) |

**저장** 클릭

### 4-2. Firebase 트리거 설정

Apps Script 에디터에서 다음 함수 실행:

1. 함수 드롭다운에서 **`setupFirebaseTrigger`** 선택
2. **실행** (▶️) 버튼 클릭
3. 권한 요청 시 **승인** 클릭
4. 로그 확인: `✅ Firebase 트리거 설정 완료 (1분마다 동기화)`

**트리거 확인**:
- 좌측 메뉴 → **트리거** (⏰) 클릭
- `syncToFirebase` 함수가 1분마다 실행되도록 설정됨

### 4-3. 첫 동기화 실행

1. 함수 드롭다운에서 **`syncToFirebase`** 선택
2. **실행** (▶️) 버튼 클릭
3. 로그 확인: `✅ Firebase 동기화 완료`

**Firebase Console에서 데이터 확인**:
1. Realtime Database → **데이터** 탭
2. `keyPlayers` 노드 확인
3. 플레이어 데이터가 표시되면 성공

---

## 💻 5단계: 웹앱 설정

### 5-1. tracker.html 수정

`tracker.html` 파일 상단(144줄)에서 Firebase 설정 교체:

**수정 전**:
```javascript
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  // ...
};

const ENABLE_FIREBASE = false;
```

**수정 후** (3-2에서 복사한 값으로 교체):
```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz12345678",
  authDomain: "poker-tracker-abc12.firebaseapp.com",
  databaseURL: "https://poker-tracker-abc12-default-rtdb.firebaseio.com",
  projectId: "poker-tracker-abc12",
  storageBucket: "poker-tracker-abc12.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

const ENABLE_FIREBASE = true; // ← false를 true로 변경
```

### 5-2. 배포

```bash
cd table_tracker
npx @google/clasp push
```

---

## ✅ 6단계: 테스트

### 6-1. 웹앱 새로고침

1. 웹앱 URL 접속
2. **Ctrl+Shift+R** (강력 새로고침)
3. 개발자 도구 (F12) → **Console** 탭 확인

**성공 시 로그**:
```
🔥 Firebase 초기화 중...
✅ Firebase 실시간 구독 활성화
✅ Firebase 데이터 수신: 5명
⚡ 로딩 시간: 즉시 (캐시)
```

### 6-2. 성능 측정

**Chrome DevTools → Network 탭**:
- Firebase: `0.1초` (즉시)
- Google Sheets (이전): `3~12초`

**개선율**: **99%** (12초 → 0.1초)

### 6-3. 실시간 업데이트 테스트

1. Google Sheets에서 칩 수 변경
2. **1분 이내** 웹앱에 자동 반영 확인
3. 헤더에 `🔥 Live` 표시 확인

---

## 🔄 7단계: 운영 모드

### 동기화 주기 변경 (선택)

**현재**: 1분마다 (무료 플랜 최적)

**더 빠른 동기화** (유료 플랜):
```javascript
// tracker_gs.js - setupFirebaseTrigger() 함수
ScriptApp.newTrigger('syncToFirebase')
  .timeBased()
  .everyMinutes(1)  // ← 변경: 1, 5, 10, 15, 30
  .create();
```

### Firebase 비활성화 (롤백)

문제 발생 시 즉시 롤백:

**tracker.html**:
```javascript
const ENABLE_FIREBASE = false; // true → false
```

**clasp push** 실행 → Google Sheets 모드로 복귀

---

## 📊 무료 플랜 한도

| 항목 | 무료 플랜 | 프로젝트 사용량 (10명 기준) |
|------|-----------|----------------------------|
| **저장소** | 1GB | ~10KB (0.001%) |
| **다운로드** | 10GB/월 | ~100MB/월 (1%) |
| **동시 접속** | 100명 | 충분 |
| **비용** | **$0** | **무료** |

**결론**: 무료 플랜으로 충분히 사용 가능

---

## 🐛 문제 해결

### 1. "FIREBASE_DB_URL이 설정되지 않았습니다"

**원인**: Apps Script 속성 누락
**해결**: 4-1 단계 재실행

### 2. "Firebase 에러: Permission denied"

**원인**: 보안 규칙 미설정
**해결**: 2-2 단계 재실행 (`.read: true` 확인)

### 3. 데이터가 Firebase에 없음

**원인**: 첫 동기화 미실행
**해결**: 4-3 단계 재실행 (`syncToFirebase` 함수 실행)

### 4. 로딩이 여전히 느림

**체크리스트**:
- [ ] `ENABLE_FIREBASE = true` 확인
- [ ] `FIREBASE_CONFIG.apiKey` 올바른 값 확인
- [ ] Firebase Console → 데이터 존재 확인
- [ ] 브라우저 강력 새로고침 (Ctrl+Shift+R)

---

## 📚 참고 자료

- [Firebase Realtime Database 문서](https://firebase.google.com/docs/database)
- [Apps Script 트리거 가이드](https://developers.google.com/apps-script/guides/triggers)
- [프로젝트 GitHub](https://github.com/garimto81/table_tracker)

---

## 🎯 다음 단계

Firebase 설정 완료 후:

1. ✅ 성능 측정 결과 확인
2. ✅ 실시간 업데이트 동작 검증
3. ⚡ 추가 최적화 (IndexedDB, Service Worker)

**문의**: GitHub Issues
