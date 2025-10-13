# FEATURE: 키 플레이어 사진 기능 (Phase 3.1)

> **기능 요약** | 전체: [PRD](PRD.md) | 설계: [PLAN](PLAN.md) | 상태: [STATUS](STATUS.md)

---

## 🎯 목표

**대회 현장 스태프가 키 플레이어를 사진으로 즉시 식별하고, Type 시트 구조 변경에도 안정적으로 사진 데이터를 유지하는 독립 사진 저장소**

---

## 💡 핵심 가치 제안

### Before (현재)
```
┌────────────────────────────┐
│ T15  박프로 (S3) 🇰🇷  520k │  ← 텍스트만
└────────────────────────────┘
```
**문제점**:
- 이름만으로 플레이어 식별 (읽기 필요)
- 시각적 인지 속도 느림
- Type 시트 변경 시 데이터 손실 위험

### After (Phase 3.1)
```
┌─────────────────────────────────────┐
│    Merit Hall | Ocean Blue          │  ← 큰 헤더
│                                     │
│  ┌──────┐                           │
│  │ 🖼️   │  박프로 (Park Pro)         │  ← 96px 사진
│  │ 사진 │  🇰🇷 South Korea           │  ← 풀네임
│  └──────┘  📍 Table 15, Seat 3     │  ← 명확한 위치
│            💰 520,000 chips        │  ← 쉼표 표시
│                                     │
│  [📸 사진 수정]  [🎰 테이블 보기]   │  ← 액션 버튼
└─────────────────────────────────────┘
```
**개선점**:
- ✅ 사진으로 0.5초 만에 플레이어 식별
- ✅ 국적 풀네임 표시 (KR → "South Korea")
- ✅ 칩 쉼표 표시 (520000 → "520,000")
- ✅ 명확한 위치 정보 (아이콘 + 텍스트)
- ✅ Type 시트 독립적 사진 저장

---

## 📊 아키텍처: KeyPlayers 시트 (사진 저장소 전용)

### 핵심 개념: **극단적 단순성**
```
Type 시트 (마스터 DB, SSOT)
┌──────────────────────────────┐
│ TableNo | Player | Keyplayer │  ← 모든 실제 데이터
│ 15      | 박프로  | TRUE      │
│ 28      | 김프로  | TRUE      │
└──────────────────────────────┘
              ↓ getKeyPlayers()
         PlayerName JOIN
              ↓
    KeyPlayers 시트 (사진 저장소)
    ┌──────────────────────┐
    │ PlayerName | PhotoURL│  ← 사진만
    │ 박프로      | imgur... │
    │ 김프로      | imgur... │
    └──────────────────────┘
              ↓
         UI 렌더링
    (Type 데이터 + 사진)
```

### KeyPlayers 시트 구조 (2개 컬럼만!)
```
A: PlayerName (PK) - "박프로"
B: PhotoURL (HTTPS) - "https://i.imgur.com/abc.jpg"
```

**끝! 이게 전부입니다.**

### 데이터 흐름
1. **Type 시트 → KeyPlayers JOIN** (자동)
   - getKeyPlayers() 호출 시 Type 시트의 Keyplayer=TRUE 필터링
   - PlayerName으로 KeyPlayers 시트 조회 (단순 JOIN)
   - Type 데이터(테이블/좌석/칩) + 사진 URL 병합
   - **동기화 로직 불필요** (Type이 SSOT이므로)

2. **UI 렌더링** (즉시)
   - JOIN 결과를 UI에 표시
   - 사진 + 이름 + 위치 정보

3. **UI → KeyPlayers 업데이트** (수동)
   - 사진 추가/수정 시 KeyPlayers 시트만 업데이트
   - PlayerName 검색 → 있으면 UPDATE, 없으면 INSERT
   - Type 시트는 건드리지 않음 (독립적)

---

## 🏆 핵심 장점

### 1. **극단적 단순성** ⚡
- KeyPlayers = 사진 URL만 저장 (2개 컬럼)
- Type 시트 = 모든 실제 데이터 (테이블, 좌석, 칩)
- 중복 없음, 동기화 로직 불필요

### 2. **Type 시트가 여전히 SSOT** 📊
- Type 시트 = 진짜 마스터 데이터
- KeyPlayers = 사진 첨부 파일 느낌
- Type 시트 변경되면 바로 반영 (JOIN만 하면 끝)

### 3. **사진만 영구 보존** 🛡️
- Type 시트 삭제해도 사진 URL은 KeyPlayers에 보존
- 플레이어 이름 변경 안 됨 (실제 사람 이름이므로)
- 사진 한 번 등록하면 계속 사용

### 4. **구현 시간 30% 감소** 🚀
- 동기화 로직 불필요 (CurrentTable, CurrentSeat 등)
- 단순 JOIN 로직만: `Type.PlayerName = KeyPlayers.PlayerName`
- 4.5시간 → **3.5시간**

### 5. **빠른 성능** ⚡
- KeyPlayers 시트는 18명만 저장 (Type 시트는 720명)
- 2개 컬럼만 읽기 (매우 가벼움)
- photoMap 캐싱으로 반복 조회 불필요

---

## 📸 Imgur 무료 이미지 호스팅

### Imgur 선택 이유
```
서비스: https://imgur.com
무료 용량: 무제한
파일 크기: 최대 20MB
직접 링크: ✅ https://i.imgur.com/abc123.jpg
회원가입: 선택 (익명 업로드 가능)
만료: 없음 (영구 보존)
속도: ⚡⚡⚡⚡⚡ 매우 빠름 (CDN)
모바일 앱: ✅ iOS/Android
```

### 사용 시나리오
```
[대회 전날 준비]
1. Notable Players CSV 확인 (29명)
2. 구글 이미지 검색: "Espen Jorstad poker"
3. 프로필 사진 우클릭 → [이미지 주소 복사]
4. Imgur 접속 → 붙여넣기 → 업로드
5. 직접 링크 복사: https://i.imgur.com/abc123.jpg
6. Tracker 앱 → [📸 사진 수정] → URL 붙여넣기
7. 29명 반복 (총 15분)

[대회 당일 - 신규 키 플레이어]
1. 스마트폰 카메라로 플레이어 촬영
2. Imgur 앱에서 업로드
3. 직접 링크 복사 → Tracker 앱에 붙여넣기
4. 완료 (1분)
```

### Imgur API (Phase 3.2 선택)
```
무료 API: ✅ 있음
일일 한도: 12,500 업로드 (충분함)
시간당 한도: 500 업로드
인증: Client ID (무료 발급)
```

**Phase 3.1**: URL 직접 입력 (API 없이, 3.5시간)
**Phase 3.2**: Imgur API 자동 업로드 (+2시간, 향후)

---

## 📋 구현 체크리스트 (Phase 3.1)

### 3.1.1: KeyPlayers 시트 사진 저장소 (1시간) 🔴 Critical
- [ ] KeyPlayers 시트 자동 생성 (2개 컬럼만)
- [ ] getKeyPlayers() 수정:
  - [ ] Type 시트 Keyplayer=TRUE 필터링
  - [ ] KeyPlayers 시트에서 사진 일괄 조회 (photoMap)
  - [ ] PlayerName JOIN으로 데이터 병합
- [ ] updateKeyPlayerPhoto() 함수 구현 (단순 INSERT/UPDATE)
- [ ] HTTPS URL 검증

### 3.1.2: 프로 UI 디자인 (1.5시간) 🔴 High
- [ ] CSS 프로 스타일 추가:
  - [ ] `.keyPlayerCardPro` (그라데이션 카드)
  - [ ] `.playerPhotoPro` (96px 정사각형 사진)
  - [ ] `.roomTableInfoPro` (큰 헤더 배경)
  - [ ] `.playerNameLarge`, `.playerNationFull`, `.playerLocation`, `.playerChipsLarge`
  - [ ] `.cardActionsPro` (액션 버튼 스타일)
- [ ] renderKeyPlayers() 수정:
  - [ ] 96px 사진 표시 (onerror fallback → 👤)
  - [ ] 국적 풀네임 변환 (`getCountryName()`)
  - [ ] 칩 쉼표 포맷 (`toLocaleString()`)
  - [ ] 위치 아이콘 추가 (📍, 💰)
  - [ ] 액션 버튼 추가 (사진 수정, 테이블 보기)
- [ ] 국적 코드 → 풀네임 매핑 함수 구현 (40개국)

### 3.1.3: 사진 수정 UI (1시간) 🟡 Medium
- [ ] editPlayerPhoto() 팝업 구현:
  - [ ] 현재 사진 미리보기 (있으면 표시)
  - [ ] PhotoURL 입력 필드 (HTTPS만)
  - [ ] 확인/취소 버튼
- [ ] confirmEditPhoto() 함수:
  - [ ] HTTPS URL 검증
  - [ ] updateKeyPlayerPhoto() 서버 함수 호출
  - [ ] 성공 시 화면 새로고침

### 총 예상 시간: **3.5시간** (4.5h → 3.5h, 1시간 단축)

---

## 🎨 UI 상세 스펙

### 1. 키 플레이어 카드
```
┌─────────────────────────────────────────┐
│  ╔════════════════════════════════════╗  │
│  ║  Merit Hall | Ocean Blue          ║  │ ← roomTableInfoPro
│  ╚════════════════════════════════════╝  │   (0.85rem, 볼드, 그라데이션)
│                                          │
│  ┌──────┐                                │
│  │ 🖼️   │  박프로 (Park Pro)              │ ← playerNameLarge
│  │      │  🇰🇷 South Korea               │   (1.8rem, 볼드)
│  │ 96px │                                │
│  └──────┘  📍 Table 15, Seat 3          │ ← playerLocation
│             💰 520,000 chips             │   (1.3rem, 파란색)
│                                          │
│  ┌────────────────┐ ┌─────────────────┐ │
│  │ 📸 사진 수정    │ │ 🎰 테이블 보기   │ │ ← cardActionsPro
│  └────────────────┘ └─────────────────┘ │   (버튼)
└─────────────────────────────────────────┘
```

### 2. 사진 수정 팝업 (URL 입력 방식)
```
┌─────────────────────────────────────┐
│  박프로 사진 수정                     │ ← overlayTitle
│                                     │
│  ┌─────────────────┐                │
│  │                 │                │ ← 현재 사진 미리보기
│  │  [현재 사진]     │                │   (있으면 표시)
│  │                 │                │
│  └─────────────────┘                │
│                                     │
│  [https://i.imgur.com/abc.jpg___]  │ ← photoInput
│                                     │
│  💡 Imgur에 업로드 후 URL 붙여넣기   │ ← 안내
│                                     │
│  [취소]          [확인]             │ ← overlayActions
└─────────────────────────────────────┘
```

### 3. 색상 팔레트
```css
--photo-border: #2a6fff (파란색 테두리)
--card-bg-start: #1a1f35 (다크 블루)
--card-bg-end: #0f1320 (매우 어두운 블루)
--header-gradient: linear-gradient(90deg, #2a6fff, #5a8fff)
--location-color: #2a6fff (파란색)
--chips-color: #22c55e (녹색)
--nation-color: #9aa3b2 (회색)
```

---

## 📊 성공 지표

### 정량적 지표
- [ ] **사진 로딩 속도** ≤ 1초 (18명 전체)
- [ ] **플레이어 식별 시간** ≤ 0.5초 (사진 인식)
- [ ] **사진 추가/수정 시간** ≤ 30초 (Imgur 업로드 + URL 입력)
- [ ] **Type 시트 변경 시 사진 보존율** = 100%

### 정성적 지표
- [ ] 방송팀: "누구예요?" 질문 70% 감소 (사진으로 즉시 식별)
- [ ] 스태프: Type 시트 데이터 삭제 시 사진 손실 걱정 0건
- [ ] UI: 키 플레이어 카드 시각적 만족도 9/10 이상

---

## 🔄 Notable Players CSV 처리 방식

### CSV는 참고만, 입력은 앱에서

**Notable Players CSV 활용**:
- ❌ 자동 임포트 (취소)
- ✅ 참고 자료로만 사용 (29명 Notable Players 명단)
- ✅ 앱에서 키 플레이어 추가할 때 CSV 보고 이름 확인
- ✅ 사진 URL은 Imgur에 업로드 → 직접 복붙

**작업 흐름**:
```
1. Type 시트에 플레이어 등록 (Keyplayer=TRUE)
2. Tracker 앱에서 해당 플레이어 표시됨 (사진 없음 👤)
3. [📸 사진 수정] 버튼 클릭
4. 구글 이미지 검색 → Imgur 업로드 → URL 복사
5. 팝업에 URL 붙여넣기 → 확인
6. KeyPlayers 시트에 자동 저장
```

---

## 🚀 배포 계획

### Phase 3.1.1: 사진 저장소 구조 (1시간)
1. KeyPlayers 시트 생성 함수 (2개 컬럼)
2. getKeyPlayers() 수정 (단순 JOIN)
3. updateKeyPlayerPhoto() 구현
4. Apps Script 배포 (@13)

### Phase 3.1.2: UI 디자인 (1.5시간)
1. CSS 프로 스타일 추가
2. renderKeyPlayers() 수정
3. 국적 풀네임 매핑 (40개국)
4. HTML 배포 및 캐시 갱신

### Phase 3.1.3: 사진 수정 UI (1시간)
1. editPlayerPhoto() 팝업
2. confirmEditPhoto() 구현
3. 최종 테스트 및 배포

### 총 예상 시간: **3.5시간**

---

## 📊 최종 데이터 구조

### Type 시트 (변경 없음, SSOT)
```
A: PokerRoom | B: TableName | C: TableId | D: TableNo
E: SeatId | F: SeatNo | G: PlayerId | H: PlayerName
I: Nationality | J: ChipCount | K: Keyplayer
```

### KeyPlayers 시트 (신규, 2개 컬럼)
```
A: PlayerName (PK) | B: PhotoURL (HTTPS)
─────────────────────────────────────────
박프로                | https://i.imgur.com/park.jpg
김프로                | https://i.imgur.com/kim.jpg
Alice                | https://i.imgur.com/alice.jpg
Espen Jorstad        | https://i.imgur.com/espen.jpg
```

---

## 🔗 관련 문서

- [PRD.md](PRD.md) - 전체 프로젝트 요구사항
- [PLAN.md](PLAN.md) - 프로젝트 비전 및 시나리오
- [LLD.md](LLD.md) - 기술 설계 문서
- [STATUS.md](STATUS.md) - 현재 진행 상태
- [CHANGELOG.md](CHANGELOG.md) - 버전별 변경 이력
- [version.js](../version.js) - 버전 정보 (SSOT)

---

## 📝 Notes

### 왜 단순한 2개 컬럼 구조인가?
- **Type 시트 = SSOT**: 테이블/좌석/칩 등 모든 실제 데이터
- **KeyPlayers = 첨부 파일**: 사진 URL만 저장
- **동기화 불필요**: JOIN만 하면 끝 (중복 데이터 없음)
- **구현 간단**: 복잡한 로직 제거, 유지보수 쉬움

### 향후 확장 (Phase 3.2)
- Imgur API 자동 업로드 (파일 선택 → 자동 업로드)
- Google Drive 업로드 옵션
- 외부 API 연동 (Hendon Mob, Poker Atlas)
- 플레이어 프로필 페이지 (승률, 이력, 메모)

---

**작성일**: 2025-10-12
**버전**: v3.1.0 (예정)
**작성자**: Claude AI Assistant
**승인**: Pending
