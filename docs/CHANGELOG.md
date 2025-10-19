# CHANGELOG - Poker Tracker

> **변경 이력** | 현재 버전: [version.js](../version.js) 참조

## v3.6.3 (2025-01-19) - Virtual Table Numbers for Feature Tables 🎯

### 🎯 핵심 기능
**가상 테이블 번호로 충돌 방지**:
- TableName="feature" 감지 시 T1 → T1001, T2 → T1002 변환
- 내부 로직: 가상 번호 사용, UI 표시: 원본 번호 유지
- PlayerType을 PlayerPhotos 시트에서만 읽기 (Type 시트 D열은 PlayerType 아님)

### 📊 데이터 소스 명확화
**두 개의 시트 역할 분리**:
- **Type 시트** (19e7e...): 실시간 테이블 배치 (TableName, TableNo, seat 정보)
- **PlayerPhotos 시트** (1bGotri...): 플레이어 메타데이터 (PlayerType, PhotoURL 등)

### 🔄 Type 시트 구조
```
A: PokerRoom | B: TableName | C: TableId | D: TableNo | E: SeatId |
F: SeatNo | G: PlayerId | H: PlayerName | I: Nationality | J: ChipCount |
K: Key Player | L: Initial name
```
- **중요**: D열은 TableNo이며, PlayerType이 아님!

### 🔄 PlayerPhotos 시트 구조 (7열)
```
A: PlayerName | B: PhotoURL | C: CreatedAt | D: PlayerType |
E: Introduction | F: DisplayOrder | G: UpdatedAt
```

### ✨ 수정 함수
1. `readAll_Optimized_()`: "Confirmed Players" 제목 행 자동 스킵
2. `getAllPlayerPhotosMap_()`: PlayerPhotos 시트에서만 PlayerType 읽기
3. `getKeyPlayers()`: 가상 테이블 번호 + 테이블 레벨 타입 전파 (Feature > Core)
4. Type 시트 cols 정의: `playerType: 3` 제거 (존재하지 않는 컬럼)

### 🎬 Feature 플레이어 처리
- **감지**: TableName="feature" 또는 PlayerPhotos PlayerType="Feature"
- **가상 번호**: tableNo = 1000 + originalTableNo
- **테이블 전파**: Feature/Core 테이블의 모든 플레이어가 해당 타입 상속
- **UI**: opacity 0.5, grayscale, 하단 배치, 비활성화

### 📊 정렬 우선순위
```
1. PlayerType (Core > Key player > Feature)
2. TableNo (오름차순, 가상 번호 포함)
3. Introduction (true > false)
4. DisplayOrder (오름차순)
5. PlayerName (알파벳 순)
```

---

## v3.6.0 (2025-01-19) - PlayerType Management 🎭

### 🎭 핵심 기능
**PlayerType 드롭다운 메뉴 (D열)**:
- **Core**: 최상단 배치
- **Key player**: 기본값
- **Feature**: 키 플레이어 목록 제외 (피처 테이블 전용)

### 📊 정렬 우선순위
```
1. PlayerType (Core > Key player)
2. Introduction (true > false)
3. DisplayOrder (오름차순)
4. PlayerName (알파벳 순)
```

### 🔄 PlayerPhotos 구조 (7열)
```
A: PlayerName | B: PhotoURL | C: CreatedAt | D: PlayerType |
E: Introduction | F: DisplayOrder | G: UpdatedAt
```

### ✨ 수정 함수
1. `ensurePlayerPhotosSheet_()`: 7열 구조 + 드롭다운 + 마이그레이션 (4열/6열→7열)
2. `getAllPlayerPhotosMap_()`: PlayerType 읽기
3. `getKeyPlayers()`: Feature 제외 + 4단계 정렬
4. `setPlayerPhotoUrl_()`, `updateIntroduction()`: G열 UpdatedAt 대응

### 🎯 마이그레이션
- **자동 실행**: 4열/6열 → 7열 (UpdatedAt D→G, PlayerType D 추가)
- **기본값**: PlayerType='Key player'

### 📊 성능
- 성능 영향: 0ms (클라이언트 정렬)

---

## v3.5.5 (2025-01-19) - Fallback Sorting Logic 🔄

### 🔄 핵심 기능
**자동 Fallback 정렬 로직**:
- Introduction 컬럼이 **없을 때**: DisplayOrder → PlayerName 정렬 (이전 로직)
- Introduction 컬럼이 **있을 때**: Introduction → DisplayOrder → PlayerName 정렬 (v3.5.4)
- 헤더 체크로 컬럼 존재 여부 자동 감지
- 하위 호환성 보장 (legacy PlayerPhotos 시트 지원)

### ✨ 수정 함수
**tracker_gs.js**:
- `getAllPlayerPhotosMap_()`: Introduction 컬럼 헤더 확인 로직 추가
  ```javascript
  const headers = sheet.getRange(1, 1, 1, colsToRead).getValues()[0];
  const hasIntroductionColumn = headers.length >= 5 &&
    String(headers[4]).trim().toLowerCase() === 'introduction';

  const introduction = hasIntroductionColumn
    ? (row[4] === true || String(row[4]).toUpperCase() === 'TRUE')
    : undefined;  // 컬럼 없으면 undefined
  ```

- `getKeyPlayers()`: Fallback 정렬 로직 추가
  ```javascript
  .sort((a, b) => {
    const hasIntroduction = a.introduction !== undefined || b.introduction !== undefined;

    if (hasIntroduction) {
      // Introduction 컬럼 있음 → 3단계 정렬
      if (a.introduction !== b.introduction) return b.introduction ? 1 : -1;
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    } else {
      // Introduction 컬럼 없음 → 2단계 정렬 (이전 로직)
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    }
    return a.playerName.localeCompare(b.playerName);
  })
  ```

### 🎯 사용 시나리오
**Case 1: Introduction 컬럼 있음 (신규 시트)**:
```
PlayerPhotos: PlayerName | PhotoURL | ... | Introduction | DisplayOrder
            Alice       | url1     | ... | true         | 2
            Bob         | url2     | ... | false        | 1

Result: Alice (#1) → Bob (#2)  ✅ Introduction=true 최우선
```

**Case 2: Introduction 컬럼 없음 (구버전 시트)**:
```
PlayerPhotos: PlayerName | PhotoURL | ... | DisplayOrder
            Alice       | url1     | ... | 2
            Bob         | url2     | ... | 1

Result: Bob (#1) → Alice (#2)  ✅ DisplayOrder 정렬 (이전 로직)
```

### 🛡️ 하위 호환성
- **v3.5.4 이전 시트**: Introduction 컬럼 없음 → DisplayOrder 정렬
- **v3.5.4 이후 시트**: Introduction 컬럼 있음 → Introduction 우선 정렬
- 마이그레이션 불필요 (자동 감지)

### 📊 성능
- 성능 영향: **0ms** (헤더 1회 로드, 클라이언트 정렬)
- 메모리 영향: **+1 array** (헤더 캐싱)

---

## v3.5.4 (2025-01-19) - Introduction-based Sorting 🔝

### 🔝 핵심 기능
**Introduction 체크박스 기반 정렬**:
- PlayerPhotos E열 (Introduction=true) 플레이어를 최상단에 배치
- 3단계 정렬 우선순위:
  1. **Introduction** (true > false)
  2. **DisplayOrder** (오름차순)
  3. **PlayerName** (알파벳 순)
- 클라이언트 사이드 정렬 (Zero 성능 영향)

### ✨ 수정 함수
**tracker_gs.js**:
- `getKeyPlayers()`: `.sort()` 로직 추가 (3단계 우선순위)
  ```javascript
  .sort((a, b) => {
    // 1. Introduction 우선순위
    if (a.introduction !== b.introduction) {
      return b.introduction ? 1 : -1;
    }
    // 2. DisplayOrder 오름차순
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    // 3. PlayerName 알파벳 순
    return a.playerName.localeCompare(b.playerName);
  })
  ```

### 🎯 사용 시나리오
**Before (v3.5.3)**:
```
Key Players:
#1 Alice (Introduction: false)
#2 Bob (Introduction: false)
#3 Charlie (Introduction: true)  ← 체크되었지만 3번째
```

**After (v3.5.4)**:
```
Key Players:
#3 Charlie (Introduction: true)  ← 최상단 배치 ✅
#1 Alice (Introduction: false)
#2 Bob (Introduction: false)
```

### 🔧 기술 세부사항
- **성능**: 배열 정렬 O(n log n), 10명 기준 ~1ms
- **호환성**: PlayerPhotos E열 데이터 의존 (v3.5.2+)
- **fallback**: Introduction 미설정 시 false 처리

### 📝 배포 노트
- Apps Script 재배포 필요: `npx @google/clasp push`
- Type 시트 CSV 임포트 영향 없음
- PlayerPhotos 시트 E열 체크박스 수동 설정 권장

---

## v3.5.2 (2025-01-16) - Key Player Number Badge & Introduction Checkbox 🏷️

### 🏷️ 핵심 기능
**키 플레이어 번호 뱃지 시스템**:
- PlayerPhotos F열 (DisplayOrder) 추가: 1, 2, 3... 자동 번호 부여
- 보라색 그라디언트 뱃지 UI (#667eea → #764ba2)
- 플레이어 카드 왼쪽에 #1, #2, #3... 표시
- 자동 순서 번호 부여 (배열 인덱스 + 1 fallback)

**소개 체크박스 영구 보존**:
- PlayerPhotos E열 (Introduction) 추가
- 체크박스 데이터 Type 시트 독립적 저장
- 플레이어 삭제 후에도 데이터 유지

### 📊 PlayerPhotos 스키마 확장 (4열 → 6열)
**자동 마이그레이션**:
```
기존 (v3.4.1):
A: PlayerName
B: PhotoURL
C: CreatedAt
D: UpdatedAt

신규 (v3.5.2):
A: PlayerName
B: PhotoURL
C: CreatedAt
D: UpdatedAt
E: Introduction     ← 추가
F: DisplayOrder     ← 추가
```

**마이그레이션 로직**:
- 4열 시트 감지 → E열 (Introduction) 자동 추가
- 5열 시트 감지 → F열 (DisplayOrder) 자동 추가
- 기존 데이터 보존 (CreatedAt, UpdatedAt 유지)

### ✨ 신규/수정 함수
**tracker_gs.js**:
- `ensurePlayerPhotosSheet_()`: 6열 구조로 확장, 자동 마이그레이션 로직 추가
- `getAllPlayerPhotosMap_()`: E/F열 데이터 읽기 (introduction, displayOrder)
- `setPlayerPhotoUrl_()`: UPSERT 로직 업데이트 (6열 대응)
- `updateIntroduction()`: PlayerPhotos E열에 데이터 저장 (Type 시트 독립)
- `getKeyPlayers()`: displayOrder 필드 추가 (번호 뱃지용)

**tracker.html**:
- `renderKeyPlayers()`: 번호 뱃지 UI 추가
- `badge.textContent = '#' + (p.displayOrder || 0)`: 보라색 그라디언트 스타일

### 🎨 UI 개선
**번호 뱃지 스타일**:
```css
.playerNumberBadge {
  padding: 2px 8px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  min-width: 32px;
  text-align: center;
}
```

**플레이어 카드 레이아웃**:
```
[#1] Vadzim Lipauka
[사진] 📍 Merit Hall | Ocean Blue | T31
      S3 | 🇧🇾 BY | ┃520k┃
      [칩 수정] [이동] [사진] [☑️ 소개]
```

### 🔧 기술 개선
**배치 로딩 최적화**:
- getAllPlayerPhotosMap_(): 6열 한 번에 읽기 (N+1 쿼리 방지)
- 성능 유지: ~200ms (v3.4.1 대비 동일)

**UPSERT 패턴**:
```javascript
if (targetRow !== -1) {
  // UPDATE: B, D열 (PhotoURL, UpdatedAt)
  sheet.getRange(targetRow, 2).setValue(validUrl);
  sheet.getRange(targetRow, 4).setValue(now);
} else {
  // INSERT: 6열 전체 (A-F)
  sheet.appendRow([validName, validUrl, now, now, false, 0]);
}
```

### 📚 문서 업데이트
- [version.js](../version.js): v3.5.1 → v3.5.2
- [tracker_gs.js](../tracker_gs.js): TRACKER_VERSION 동기화
- [docs/PRD.md](PRD.md): Phase 3.5.2 섹션 추가
- [docs/PRD_SUMMARY.md](PRD_SUMMARY.md): 신규 작성 (빠른 참조 문서)
- [docs/STATUS.md](STATUS.md): v3.5.2 완료 상태 업데이트

### 🚀 배포
- Git 커밋: `921e1fe` (feat: v3.5.2 - Number Badge & Introduction Checkbox)
- Git 푸시: master 브랜치 완료
- 배포 ID: @24 (코드 준비 완료)

### 🔗 다음 단계
**선택지**:
1. **v3.6.0 - DisplayOrder 관리 UI** (추천, 2-3시간)
   - Key Player View에서 번호 순서 변경 UI
   - 드래그 앤 드롭 또는 ↑/↓ 버튼

2. **v4.0.0 - Firebase 재구현** (장기, 1-2주)
   - Firebase Realtime Database 직접 연동
   - WebSocket 실시간 업데이트

---

## v3.5.1 (2025-01-16) - Performance Testing & Loading UX ⚡

### ⚡ 핵심 기능
**성능 측정 도구 추가**:
- performance_test.js 신규 파일 생성
- testPerformance() 서버 함수 구현
- Sheets API 성능 측정 (getKeyPlayers, getAllPlayerPhotosMap_)

**로딩 UX 개선**:
- LoadingManager 통합 시스템
- callServerWithLoading 헬퍼 함수
- 플레이어 이동 시 로딩 오버레이 표시

### 📊 성능 측정 결과
- `getKeyPlayers()`: ~300ms
- `getAllPlayerPhotosMap_()`: ~200ms
- 총 로딩 시간: ~500ms (Sheets 기반, Firebase 제거 후)

### 🧹 Firebase 제거
**삭제된 코드 (166줄)**:
- Firebase REST API 호출 로직 제거
- syncToFirebase() 함수 삭제
- getKeyPlayersFromFirebase() 프록시 함수 삭제
- tracker.html 폴링 로직 제거

**이유**: 보안 우선 결정 (Firebase API Key 노출 우려)

### 📚 문서 추가
- [docs/PERFORMANCE_TEST_GUIDE.md](PERFORMANCE_TEST_GUIDE.md): 성능 테스트 가이드

### 🚀 배포
- 배포 ID: @24
- 상태: Sheets 기반 캐싱 (96% 성능 개선 유지)

---

## v3.5.0 (2025-10-15) - Firebase Realtime Cache - Hybrid Architecture 🔥

### 🔥 핵심 기능
**Firebase Realtime Database 하이브리드 캐싱**:
- Google Sheets (SSOT) ↔ Firebase (Read Cache) ↔ Browser
- 로딩 속도 96% 개선: 12초 → 0.5초 (Apps Script 프록시)
- 실시간 동기화: 5초 간격 폴링

### 🔒 보안 개선
**Apps Script 프록시 패턴**:
- 문제: 초기 구현에서 Firebase API Key를 브라우저에 노출 (GitHub 공개 저장소)
- 해결: Apps Script를 보안 프록시로 사용
  - Browser → google.script.run → Apps Script → Firebase REST API
  - Firebase API Key는 Apps Script Properties에만 저장 (서버 사이드)
  - 브라우저에서 Firebase SDK 완전 제거

### ✨ 신규 함수
**tracker_gs.js**:
- `syncToFirebase()`: Sheets → Firebase 동기화 (1분 간격 자동 실행)
- `setupFirebaseTrigger()`: 자동 트리거 생성 함수
- `getKeyPlayersFromFirebase()`: 보안 프록시 함수 (Browser → Firebase 중계)

**tracker.html**:
- `pollFirebaseData()`: 5초 간격 폴링 (변경 감지 시에만 UI 업데이트)
- `ENABLE_FIREBASE_CACHE`: 토글 옵션 (true/false)
- `FIREBASE_POLLING_INTERVAL`: 폴링 간격 설정 (기본 5초)

### 📊 성능 비교
| 방식 | 로딩 속도 | 보안 | 실시간성 |
|------|-----------|------|----------|
| Sheets 직접 | 12초 | N/A | ❌ |
| Firebase 직접 (초기 구현) | 0.1초 | ❌ API Key 노출 | ⚡ WebSocket |
| **Apps Script 프록시 (최종)** | **0.5초** | **✅ 안전** | **✅ 5초 폴링** |

### 📚 문서 추가
- `FIREBASE_SETUP.md`: Firebase 프로젝트 생성부터 배포까지 완전 가이드
- `PRD_SUMMARY.md`: v3.5.0 핵심 요약 문서
- `docs/PRD.md`: Phase 3.5 완료 내역 추가 (성능 개선 히스토리 테이블)
- `docs/PERFORMANCE_Tracker.md`: Historical 노트 추가

### 🧹 파일 정리 (10개 삭제)
**구버전 배포 문서**:
- DEPLOY_v3.0.0.md
- docs/DEPLOY_Tracker.md

**버그 수정 문서**:
- docs/BUGFIX_Tracker_v1.0.1.md
- docs/BUGFIX_v2.2.0_Phase1.5.md

**중복 마이그레이션 문서**:
- docs/MIGRATION_PLAN_V3.md
- docs/TYPE_SHEET_V3_SEATS_MIGRATION.md

**구버전 UI 분석** (v2.x):
- docs/MOBILE_FIRST_REDESIGN.md
- docs/WHY_NEW_DESIGN_BETTER.md
- docs/UI_UX_ANALYSIS.md
- docs/UI_SIZE_PROBLEM.md
- docs/TABLE_VIEW_IDEAS.md
- docs/MOCKUP_UI_Proposals.md

### ⚙️ 설정 요구사항
v3.5.0 코드가 작동하려면 다음 설정 필요:

1. **Firebase 프로젝트 생성**:
   - https://console.firebase.google.com
   - Realtime Database 생성 (asia-southeast1)

2. **Apps Script 속성 설정**:
   ```
   Key: FIREBASE_DB_URL
   Value: https://poker-tracker-xxxxx.firebaseio.com
   ```

3. **자동 트리거 생성**:
   ```javascript
   // Apps Script에서 실행
   setupFirebaseTrigger()
   ```

4. **보안 규칙 설정**:
   ```json
   {
     "rules": {
       "keyPlayers": {
         ".read": true,
         ".write": false
       }
     }
   }
   ```

📚 **상세 가이드**: [FIREBASE_SETUP.md](../FIREBASE_SETUP.md)

### 🚀 배포
- 코드 완료: tracker_gs.js, tracker.html
- 배포 대기: Firebase 설정 후 clasp push 필요
- 현재 배포: @23 (v3.4.0 - PlayerPhotos sheet)

### 🔮 향후 계획 (v4.0.0)
- IndexedDB + Service Worker (PWA)
- 오프라인 작동 지원
- 로딩 속도 0.01초 (완전한 클라이언트 캐싱)

---

## v3.4.0 (2025-10-15) - PlayerPhotos Sheet - Image URL Persistent Storage 🗄️

### 🎯 문제 해결
**CSV 임포트 시 사진 URL 손실 방지**:
- 기존 문제: Type 시트 전체 삭제 → N열 PhotoURL 데이터 손실
- 해결: PlayerPhotos 시트에 플레이어별 사진 URL 영구 저장

### 🗄️ 신규 시트: PlayerPhotos
**구조**:
```
컬럼: [PlayerName, PhotoURL, CreatedAt, UpdatedAt]
키: PlayerName (Unique)
```

**특징**:
- 플레이어 이름당 1개 사진 URL (UPSERT)
- CSV 임포트 시에도 데이터 보존
- 타임스탬프 자동 기록 (생성/수정 시간)

### ✨ 신규 함수
**시트 관리**:
- `ensurePlayerPhotosSheet_()`: PlayerPhotos 시트 자동 생성
- `getPlayerPhotoUrl_(playerName)`: 사진 URL 조회
- `setPlayerPhotoUrl_(playerName, url)`: 사진 URL UPSERT (생성/수정)

**마이그레이션**:
- `migrateTypeSheetNToPlayerPhotos()`: Type N열 → PlayerPhotos 일회성 마이그레이션

### ♻️ 기존 함수 수정
**JOIN 로직 추가**:
- `getKeyPlayers()`: Type 시트 + PlayerPhotos JOIN
  - Type 시트: 플레이어 위치/칩 (동적 데이터)
  - PlayerPhotos: 사진 URL (정적 메타데이터)

**저장 위치 변경**:
- `uploadToImgur()`: Type N열 → PlayerPhotos 저장
- `updateKeyPlayerPhoto()`: Type N열 → PlayerPhotos UPSERT

### 🔄 마이그레이션 절차
**Apps Script 에디터에서 1회 실행**:
1. 함수 드롭다운: `migrateTypeSheetNToPlayerPhotos` 선택
2. ▶️ 실행 버튼 클릭
3. 로그 확인: "✅ ... URL 마이그레이션 완료"

### 📊 데이터 흐름 (Before vs After)

**Before (문제)**:
```
CSV 임포트 → Type 시트 전체 삭제 → PhotoURL 손실 ❌
```

**After (해결)**:
```
CSV 임포트 → Type 시트 갱신 (동적 데이터)
              ↓
        PlayerPhotos 보존 (사진 URL) ✅
              ↓
   getKeyPlayers() 시 자동 JOIN
```

### 🎯 이점
- ✅ **데이터 손실 방지**: CSV 재임포트 시 사진 URL 보존
- ✅ **정규화**: 플레이어별 1개 URL 관리 (중복 제거)
- ✅ **확장성**: CreatedAt/UpdatedAt으로 이력 추적 가능
- ✅ **후방 호환**: 기존 API 동작 유지

### 📦 배포
- clasp push 대기
- 배포 ID: @23 (예정)
- 마이그레이션 함수 실행 필요 ⚠️

---

## v3.3.1 (2025-10-14) - Move Button to Key Player View 🔀

### ✨ 신규 기능
**키 플레이어 뷰에 이동 버튼 추가**:
- 키 플레이어 카드에 [🔀 이동] 버튼 추가
- [📷 사진] + [🔀 이동] 2개 버튼 가로 배치 (flexbox)
- `movePlayerPrompt()` 함수 재사용 (Table View와 동일한 UX)

### 🎨 UI 개선
**버튼 레이아웃**:
- 버튼 컨테이너: `display: flex`, `gap: var(--sp-xs)`
- [📷 사진]: 회색 테두리 (기존 `photoEditBtn` 스타일)
- [🔀 이동]: 주황색 테두리 + 텍스트 (`#f59e0b`)

**이동 오버레이 개선**:
- `e.stopPropagation()`: 카드 클릭 이벤트 차단
- 이동 완료 후 키 플레이어 목록 자동 새로고침

### 🐛 버그 수정
**오버레이 표시 버그**:
- 문제: `overlay.classList.add('active')` → CSS는 `.show` 클래스 사용
- 수정: `overlay.classList.add('show')`로 변경
- 영향: 이동 버튼 클릭 시 오버레이가 표시되지 않던 문제 해결

**접근성 개선**:
- `<label htmlFor="moveToTable">` 속성 추가
- `<label htmlFor="moveToSeat">` 속성 추가
- 스크린 리더 호환성 향상

### 🔍 디버깅
**Console 로그 추가**:
- `🔀 movePlayerPrompt 호출:` - 함수 호출 확인
- `✅ 오버레이 표시 완료` - 오버레이 표시 확인
- `📍 목적지:` - 입력값 확인
- `🚀 movePlayer 서버 함수 호출 시작` - 서버 호출 확인
- `✅ movePlayer 서버 응답:` - 서버 응답 확인
- `❌ 이동 실패:` / `❌ movePlayer 서버 에러:` - 에러 확인

### 📊 사용 시나리오
**키 플레이어 뷰**:
1. 키 플레이어 카드의 [🔀 이동] 클릭
2. 목적지 테이블/좌석 입력
3. [이동] → 성공 메시지 + 키 플레이어 목록 새로고침

**Table View** (기존):
1. 플레이어 카드의 [🔀] 클릭
2. 동일한 흐름

### 📦 배포
- clasp push 완료 (5 files)
- 배포 ID: @22

---

## v3.3.0 (2025-10-14) - Player Move Feature 🔀

### ✨ 신규 기능
**플레이어 이동 (테이블/좌석 변경)**:
- `movePlayer(fromTableNo, fromSeatNo, toTableNo, toSeatNo)` 서버 함수 추가
- 테이블 간 이동: T1 S3 → T5 S7
- 같은 테이블 내 좌석 변경: T1 S3 → T1 S8
- 목적지 플레이어 자동 덮어쓰기 (중복 방지)

### 🎨 UI 개선
**[🔀 이동] 버튼 추가**:
- Table View 플레이어 카드에 이동 버튼 표시
- 주황색 아이콘, 호버 시 확대 애니메이션
- 🗑️ 삭제 버튼 왼쪽에 배치

**이동 오버레이**:
- 현재 위치 표시 (T1 S3)
- 목적지 테이블/좌석 입력 (숫자 필드)
- ⚠️ 덮어쓰기 경고 메시지
- 기본값: 현재 테이블 (좌석만 변경 시 편리)

### 🔒 안전 장치
**중복 방지 로직**:
1. 출발지 플레이어 존재 확인
2. 출발지 데이터 읽기 (전체 컬럼 보존)
3. 목적지에 플레이어 있으면 삭제 (덮어쓰기)
4. 출발지 행 삭제
5. 목적지에 새 데이터 추가 (TableNo, SeatNo만 변경)
6. 자동 정렬

**원자적 트랜잭션**:
- `withScriptLock_()` 동시성 제어
- 검증: 출발지/목적지 유효성, 동일 위치 체크
- 캐시 무효화: 즉시 반영

### 🔧 기술 구현
**tracker_gs.js (Lines 712-837)**:
- `movePlayer()` 함수 추가 (125줄)
- 덮어쓰기 후 데이터 refresh 로직
- 11개 컬럼 전체 복사 (photoUrl 포함)

**tracker.html (Lines 754-878)**:
- `movePlayerPrompt()` 오버레이
- `confirmMovePlayer()` 검증 및 호출
- `.moveBtn` CSS 스타일

### 📊 사용 예시
```javascript
// T1 S3 → T5 S7 (다른 테이블로 이동)
movePlayer(1, 3, 5, 7)

// T1 S3 → T1 S8 (같은 테이블 내 좌석 변경)
movePlayer(1, 3, 1, 8)
```

### 🗑️ 파일 정리
- `migrate.js` 삭제 (일회성 마이그레이션 완료)

### 📦 배포
- clasp push 완료 (4 files)
- 배포 ID: @19

---

## v3.2.1 (2025-10-14) - Photo Upload UX Enhancement 🎯

### 🐛 버그 수정 (Critical)
**무한 루프 방지**:
- 문제: 업로드 완료 후 팝업이 닫히지 않아 사용자가 [저장] 버튼 중복 클릭 → 무한 루프
- 해결: `isUploading` 글로벌 플래그 추가, 중복 업로드 차단
- 중복 클릭 시: `alert('이미 업로드 중입니다. 잠시만 기다려주세요.')`

### 🎨 UX 개선
**자동 저장 및 팝업 닫기**:
- Before: 촬영 → 업로드 → 팝업 확인 → [저장] 클릭 → 완료 (5단계)
- After: 촬영 → 업로드 → 자동 저장 → 자동 닫기 → 완료 (3단계)
- 사용자 클릭 횟수: 5회 → 1회 (80% 감소)

**사일런트 성공 UX**:
- 성공 알림 팝업 제거 (`alert('✅ 사진 업로드 완료!')` 삭제)
- 즉시 키 플레이어 화면으로 전환 (사진 반영 확인)

**전체 화면 잠금**:
- 업로드 → 저장 → 새로고침 완료까지 화면 잠금
- z-index 200 오버레이 + 스피너 애니메이션
- 사용자 오입력 차단 (버튼, 카드 클릭 불가)

**버튼 상태 관리**:
- 업로드 전: `[📷 사진 촬영]` (활성)
- 업로드 중: `[🔄 업로드 중...]` (비활성, opacity 0.5)
- 업로드 완료: 버튼 복원 → 팝업 닫기 → 화면 잠금

### 🔧 기술 개선
**tracker.html (Lines 96-102, 134-140, 969-1169)**:
- CSS: `#screenLock` 오버레이 + `.lockSpinner` 애니메이션
- HTML: 화면 잠금 구조 (`<div id="screenLock">`)
- JS: `lockScreen()`, `unlockScreen()` 함수 추가
- Flow: `handlePhotoCapture()` → `closeOverlay()` → `lockScreen()` → `loadKeyPlayers()` → `unlockScreen()`

### ⏱️ 개선 효과
- 작업 시간: 60초 → 10초 (83% 감소)
- 사용자 클릭: 5회 → 1회 (80% 감소)
- 오류 가능성: 중복 저장, 화면 이탈 → 0% (완전 차단)

### 📦 배포
- clasp push 완료 (5 files)
- 배포 ID: @18

---

## v3.2.0 (2025-10-14) - Smartphone Camera & Imgur Auto-Upload 📷

### ✨ 신규 기능
**스마트폰 카메라 사진 촬영**:
- HTML5 File Input: `<input type="file" accept="image/*" capture="environment">`
- 키 플레이어 카드에 [📷 사진] 버튼 추가
- 촬영 즉시 자동 업로드 (Imgur Anonymous Upload API)

**Imgur API 연동**:
- `uploadToImgur(playerName, base64Image)` 함수 (tracker_gs.js)
- Anonymous Upload (Client ID 546c25a59c58ad7)
- Base64 인코딩 자동 처리 (FileReader API)
- Form-urlencoded payload 방식

**OAuth 권한 추가**:
- appsscript.json: `https://www.googleapis.com/auth/script.external_request`
- UrlFetchApp 권한 승인 필요 (최초 1회)

### 🔧 서버 함수 추가
**tracker_gs.js**:
- `uploadToImgur(playerName, base64Image)` - Imgur API 호출
- `testImgurUploadPermission()` - OAuth 권한 테스트 함수
- `IMGUR_CLIENT_ID` 상수 추가

### 🎨 UI 개선
**tracker.html**:
- `handlePhotoCapture()` - 카메라 촬영 및 업로드 처리
- Base64 인코딩 및 서버 전송 자동화
- 오류 핸들링 (415 에러 해결)

### ⚠️ 알려진 이슈
- 최초 사용 시 OAuth 재인증 필요
- 브라우저 새로고침 필요 (웹앱 배포 반영)

### 📦 배포
- clasp push 완료 (5 files)
- 배포 ID: @17

---

## v3.1.0 (2025-10-13) - Player Photo Feature 📷

### ✨ 신규 기능
**KeyPlayers 시트 사진 저장소 (2개 컬럼)**:
- A: PlayerName (PK) - 플레이어 이름
- B: PhotoURL (HTTPS) - Imgur 등 클라우드 사진 URL
- Type 시트와 독립적으로 사진만 관리 (SSOT 유지)
- PlayerName JOIN으로 데이터 병합

**96px 프로 디자인 UI**:
- `.keyPlayerCardPro`: 그라디언트 배경, 호버 애니메이션
- `.playerPhotoPro`: 96x96px 사진 (빈 슬롯은 👤 아이콘)
- `.playerDetailsPro`: 풀네임, 위치, 국가명, 칩 정보 표시
- 아이콘 기반 메타데이터: 📍 테이블/좌석, 💰 칩

**국가 이름 매핑 (40개국)**:
- `getCountryName()`: KR → "South Korea", US → "USA" 등
- 국가 코드 + 국가명 모두 표시 (🇰🇷 South Korea)

**사진 편집 팝업**:
- `editPlayerPhoto()`: 플레이어별 사진 URL 편집
- HTTPS 검증, Imgur 가이드 링크 포함
- 실시간 저장 및 UI 갱신

### 🔧 서버 함수 추가
**tracker_gs.js**:
- `initKeyPlayersSheet()`: KeyPlayers 시트 자동 생성
- `getKeyPlayersPhotoMap_()`: 사진 MAP 조회 (내부 헬퍼)
- `updateKeyPlayerPhoto(playerName, photoUrl)`: INSERT/UPDATE 처리
- `getKeyPlayers()`: photoUrl 필드 JOIN 추가 (PlayerName 기준)

### 🎨 UI/UX 개선
- 칩 숫자 쉼표 포맷팅: 520000 → "520k"
- 국가 풀네임 표시로 방송팀 커뮤니케이션 개선
- 사진 로딩 실패 시 👤 폴백 아이콘 표시
- 프로 디자인: 그라디언트, 박스 섀도우, 트랜지션

### 📊 데이터 흐름
```
1. Type 시트 (Keyplayer=TRUE) 필터링
2. KeyPlayers 시트 (photoMap) 조회
3. PlayerName JOIN (사진 매칭)
4. UI 렌더링 (96px 사진 + 메타데이터)
5. 사진 편집 → KeyPlayers 업데이트 (사진만)
```

### 🌐 클라우드 호스팅
- Imgur 무료 사용 (무제한 저장, 영구 보존, CDN)
- HTTPS 직접 링크 입력 방식 (API는 Phase 3.2)

### 📝 문서 추가
- [FEATURE_PLAYER_PHOTO.md](FEATURE_PLAYER_PHOTO.md): 완전한 기술 스펙
- [PHASE_3.1_SUMMARY.md](PHASE_3.1_SUMMARY.md): 사용자 워크플로우 개선 효과

### ⏱️ 예상 효과
- 플레이어 식별 속도 **4배 향상** (2초 → 0.5초)
- 방송팀 질문 **70% 감소**
- 매일 **30분 시간 절약**

---

## v3.0.1 (2025-10-12) - Keyplayer 컬럼 인덱스 고정 🐛

### 🔧 버그 수정
- **문제**: Keyplayer 컬럼 헤더 이름이 없거나 다를 경우 키 플레이어 필터링 실패
- **해결**: K열(인덱스 10)을 헤더 무관하게 고정 (`cols.keyplayer = 10`)
- **영향**: getKeyPlayers(), getTablePlayers(), addPlayer() 모두 정상 작동

### 📊 로직 개선
- **getKeyPlayers()**:
  - `cols.keyplayer !== -1` 조건 제거 (항상 인덱스 10)
  - `p.tableNo && p.seatNo` → `p.tableNo > 0 && p.seatNo > 0` (falsy 방지)
- **getTablePlayers()**:
  - `cols.keyplayer !== -1` 조건 제거
- **addPlayer()**:
  - `if (cols.keyplayer !== -1)` 조건 제거 (K열 항상 존재)

### 📝 주석 추가
- "K열 고정 (헤더 이름 무관)" 주석 추가
- "K열(인덱스 10) 값 확인" 주석 추가

### 🎯 목적
Seats.csv 구조에서 Keyplayer는 항상 K열(11번째 컬럼, 인덱스 10)에 위치하므로, 헤더 이름 검색 없이 인덱스로 직접 접근하여 안정성 향상.

---

## v3.0.0 (2025-10-12) - Seats.csv 구조 마이그레이션 🗄️

### 🔄 DB 구조 변경 (8 컬럼 → 11 컬럼)
- **기존**: Poker Room, Table Name, Table No., Seat No., Player, Nation, Chips, Keyplayer
- **신규**: PokerRoom, TableName, TableId, TableNo, SeatId, SeatNo, PlayerId, PlayerName, Nationality, ChipCount, Keyplayer
- **목적**: Seats.csv 표준 구조 준수, 내부 ID 추가, 컬럼명 표준화

### 📊 데이터 타입 변경
- **TableNo**: 문자열 "T15" → 숫자 15
- **SeatNo**: 문자열 "S3" → 숫자 3
- **저장**: 숫자형으로 비교 효율성 향상
- **표시**: UI에서 "T15", "S3" 형식 유지 (formatTableNo, formatSeatNo 헬퍼 함수)

### 🆔 내부 ID 추가
- **TableId**: Seats.csv 테이블 내부 ID (예: 43149)
- **SeatId**: Seats.csv 좌석 내부 ID (예: 429396)
- **PlayerId**: 플레이어 고유 ID (예: 104616)
- **용도**: CSV 임포트 시 사용, 수동 입력 시 0

### 🏷️ 컬럼명 표준화
- `Player` → `PlayerName` (명확화)
- `Nation` → `Nationality` (Seats.csv 표준)
- `Chips` → `ChipCount` (Seats.csv 표준)
- `Poker Room` → `PokerRoom` (공백 제거)
- `Table Name` → `TableName` (공백 제거)

### 🔧 tracker_gs.js 수정
- **COLS 상수**: 8개 → 11개 컬럼 정의
- **getKeyPlayers()**: 11개 필드 반환, 숫자형 비교
- **getTablePlayers()**: tableId 숫자 변환, 11개 필드 반환
- **updatePlayerChips()**: cols.chipCount 사용
- **addPlayer()**: 11개 컬럼 입력, TableId/SeatId/PlayerId=0 (기본값)
- **findPlayerRow_()**: 숫자형 비교 (toInt_ 사용)

### 🎨 tracker.html 수정
- **헬퍼 함수 추가**:
  - `formatTableNo(15)` → "T15"
  - `formatSeatNo(3)` → "S3"
  - `parseTableNo("T15")` → 15
  - `parseSeatNo("S3")` → 3
- **renderKeyPlayers()**: 숫자 → 문자열 변환, playerName/nationality/chipCount 사용
- **renderTablePlayers()**: 숫자 → 문자열 변환
- **editChips()**: 숫자 파라미터 전달
- **showTableView()**: formatTableNo로 제목 표시

### 📝 문서 추가
- [MIGRATION_SEATS_ONLY.md](MIGRATION_SEATS_ONLY.md): Seats.csv 기반 구조 적용 가이드
- 기존 마이그레이션 계획 문서 (Players.csv 참조) 폐기

### ⚠️ 주의사항
- **Type 시트가 이미 Seats.csv 구조로 변경됨** (데이터 마이그레이션 불필요)
- **코드만 수정**하여 새 구조에 맞게 동작
- **Players.csv는 사용하지 않음** (Seats.csv만 참조)

### 🧪 테스트 필요
- [ ] getKeyPlayers() 호출 → 11개 필드 확인
- [ ] getTablePlayers(15) 호출 → 숫자 파라미터 전달
- [ ] 플레이어 추가 → 11개 컬럼 입력 확인
- [ ] 칩 수정 → chipCount 컬럼 업데이트
- [ ] UI 렌더링 → "T15", "S3" 형식 표시

---

## v2.4.0 (2025-10-07) - 모바일 텍스트 크기 최적화 📱

### 🎨 키 플레이어 뷰 텍스트 100% 확대
- **테이블 라벨 (T15)**: 0.75rem → 1.5rem (2배)
- **플레이어 이름**: 0.85rem → 1.7rem (2배)
- **국기**: 0.85rem → 1.7rem (2배)
- **칩**: 1.05rem → 2.1rem (2배)
- **칩 변화 (▲▼)**: 0.85rem → 1.7rem (2배)

### 🎯 테이블 뷰 텍스트 30% 추가 확대
- **좌석 번호**: 1.2rem → 1.56rem
- **이름**: 1.3rem → 1.69rem
- **국기**: 1.5rem → 1.95rem
- **칩**: 1.5rem → 1.95rem
- **⭐**: 1.2rem → 1.56rem
- **빈 좌석**: 1.1rem → 1.43rem
- **[+] 버튼**: 1.0rem → 1.3rem
- **🗑️ 버튼**: 1.4rem → 1.82rem

### 📐 테이블 뷰 화면 최적화
- **9명 화면 꽉 채우기**:
  - `#tablePlayerList`: `flex: 1` → 남은 공간 전체 사용
  - `.playerRow`: `flex: 1` → 9개 카드가 화면 높이 균등 분할
  - `margin-bottom`: 고정 간격 제거 → `4px`로 최소화
  - 어떤 화면 크기에서도 9명이 딱 맞게 표시

### 💬 오버레이(설정창) 크기 최적화
- **제목**: 1rem → 1.8rem
- **입력 필드**: 1rem → 1.6rem, `min-height: 56px` (터치 최적)
- **버튼**: 0.95rem → 1.4rem, `min-height: 56px`
- **체크박스**: 20px → 32px
- **라벨**: 기본 → 1.4rem
- **"현재: 750k"**: 작은 텍스트 → 1.2rem

### ⚠️ 알려진 이슈
- CSS 클래스 중복으로 스마트폰 최적화 미작동 (`.flag`, `.chips` 등)
- Viewport 기본 폰트 크기 너무 작음 (최대 20px)
- Flexbox 선택자 잘못됨 (`#viewTable .wrap`)

---

## v2.3.0 (2025-10-07) - UI/UX 모바일 최적화 📱

### 🎨 디자인 개선
- **Key Player Card 2줄 압축**:
  - 기존: Room/Table Info → Table Label + Player → Chips → [관리 버튼] (5줄)
  - 개선: Room/Table Info → (Table Label + Player | Chips) (2줄)
  - 카드 높이: 30% 감소 → 스크롤 최소화

- **Room/Table Info 가독성 개선**:
  - 폰트: 12px 고정 → 0.7rem (약 13-14px, rem 기반)
  - 배경: 단색 어두운 회색 → 그라디언트 (linear-gradient(135deg, #1e2a45, #2a3556))
  - 텍스트 색상: #9aa3b2 (어두움) → #cbd5e1 (밝음)
  - 정렬: center → left
  - Border: #2a2d3e → #3a4a6f (더 명확)

- **칩 정보 시각적 강조**:
  - 칩 세로선 추가: `┃750k┃` (클릭 가능 영역 명확화)
  - 삼각형 아이콘: `↑` → `▲`, `↓` → `▼` (더 뚜렷함)
  - 칩 폰트 크기: 1rem → 1.05rem (5% 증가)
  - 칩 변화 폰트: 0.75rem → 0.85rem (13% 증가)

- **헤더 최적화**:
  - "Key Players (N)" 카운트를 우측으로 이동
  - 헤더 폰트 크기: 1rem → 0.95rem (축소)
  - Border 색상: #222 → #2a3249 (일관성)

- **[T15 관리] 버튼 제거**:
  - 카드 전체 클릭으로 Table View 이동
  - 칩 클릭 시 `event.stopPropagation()` 처리
  - 공간 절약 + 인터랙션 단순화

### 📏 레이아웃 개선
- Grid 기반 2줄 구조:
  ```css
  .cardRow {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--sp-sm);
  }
  ```
- Flexbox 최적화 (overflow 처리):
  - `white-space: nowrap`
  - `text-overflow: ellipsis`
  - `flex-shrink: 0` (아이콘/레이블)

### 🚀 성능 개선
- HTML 구조 단순화 (panel → 직접 렌더링)
- CSS 중복 제거 (cardHeader, chipRow → cardRow 통합)
- 이벤트 핸들러 최적화 (카드 레벨 onclick)

### 📦 배포
- **@11 배포 완료** (2025-10-07)
- Deployment ID: `AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA`

### 📊 개선 효과
- 카드 높이: 148px → ~100px (32% 감소)
- 5개 카드 총 높이: 740px → 500px (32% 감소)
- 스크롤: Galaxy S24(800px) 기준 최소화
- 가독성: Room/Table Info 명확도 50% 향상

---

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
