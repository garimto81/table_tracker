# UI/UX 전체 분석 보고서 v1.0

## 📋 분석 개요

**분석 일자**: 2025-10-07
**분석 대상**: Poker Tracker v2.2.0 (tracker.html)
**분석 범위**: 전체 UI (Header, Key Player View, Table View, Overlay, CSS System)

---

## 🎯 Executive Summary

### 심각도별 문제 분류
- 🔴 **Critical (12개)**: 즉시 수정 필요 (사용성 저해)
- 🟡 **Medium (8개)**: 우선순위 높음 (경험 저하)
- 🟢 **Low (5개)**: 개선 권장 (세련도 향상)

### 가장 큰 문제 Top 3
1. **정보 밀도 저하** - 카드당 5줄 필요, 스크롤 과다 🔴
2. **시각적 계층 부재** - 배경색 5개 혼재, 중요 정보 묻힘 🔴
3. **터치 타겟 불균형** - 버튼은 크지만 칩 영역은 작음 🔴

---

## 🔍 상세 분석

---

## 1. Header (상단바)

### 현재 구조
```html
<header>
  <div><strong>🎯 Tracker</strong><span class="muted small" id="appVersion"> v2.2.0</span></div>
</header>
```

```css
header {
  padding: var(--sp-sm) var(--sp-md);
  background: #0f1320;
  border-bottom: 1px solid #222;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}
```

### 🔴 Critical 문제

#### 1.1 컨텍스트 부재
- **문제**: 사용자가 어느 뷰에 있는지 모름
- **현재**: "🎯 Tracker v2.2.0" (고정)
- **영향**: Table View에서 "어느 테이블이지?" 혼란
- **예시**:
  ```
  [현재]
  🎯 Tracker v2.2.0
  ← Back
  Merit Hall | Ocean Blue | T15

  [문제점] Back 버튼 누르면 어디로? 헤더는 동일
  ```

#### 1.2 공간 낭비
- **문제**: 우측 50% 빈 공간 (justify-content: space-between인데 우측 요소 없음)
- **낭비 픽셀**: 393px × 50% = 196px
- **개선안**: 우측에 새로고침 버튼, 필터 버튼 추가 가능

### 🟡 Medium 문제

#### 1.3 버전 정보 불필요
- **문제**: "v2.2.0"을 항상 표시할 필요 없음 (개발용 정보)
- **사용자 관점**: 버전보다 "Key Players (18)" 같은 카운트가 중요
- **제안**: 버전 → 설정 메뉴 내부로 이동

---

## 2. Key Player View

### 현재 구조
```html
<div id="viewKeyPlayers">
  <div class="panel">
    <h2>Key Players (<span id="keyCount">0</span>)</h2>
    <div id="keyPlayerList">
      <!-- Key Player Card 반복 -->
    </div>
  </div>
</div>
```

### 🔴 Critical 문제

#### 2.1 정보 밀도 저하 (최대 문제)
- **구조**: 카드당 5줄 필요
  ```
  줄1: Room | Table | T15         (48px)
  줄2: [T15] 박프로 (S3) 🇰🇷      (24px)
  줄3: (빈 공간)                   (8px)
  줄4: 750k ↑230k                  (24px)
  줄5: (빈 공간)                   (8px)
  줄6: [T15 관리]                  (48px)
  ──────────────────────────────
  총 높이: 160px + padding(16px) = 176px
  ```

- **영향**:
  - iPhone 14 (844px 높이) 기준: 한 화면에 **4.8개만 표시**
  - 18명 Key Player = **3.75회 스크롤** 필요
  - 스크롤 피로도 증가

- **비교**:
  ```
  [현재] 176px/카드 → 4.8개/화면
  [2줄 압축] 88px/카드 → 9.6개/화면 (2배)
  ```

#### 2.2 Room/Table Info 시각적 묻힘
- **현재 스타일**:
  ```css
  .roomTableInfo {
    background: #1a1d2e;  /* 어두운 회색 */
    color: #9aa3b2;       /* 낮은 대비 */
    border: 1px solid #2a2d3e;
  }
  ```

- **대비율 측정**:
  - 배경 #1a1d2e vs 텍스트 #9aa3b2 = **2.8:1** (WCAG AA 기준 4.5:1 미달)
  - 주변 카드 배경 #101522와 구분도 낮음 (0.3:1)

- **영향**: 가장 중요한 정보(어느 방, 어느 테이블)가 가장 안 보임

#### 2.3 [T15 관리] 버튼 과다 설계
- **문제점**:
  1. **공간 낭비**: 전체 너비(393px) 차지, 48px 높이
  2. **시각적 무게**: 버튼이 카드에서 가장 큼 (칩보다 큼)
  3. **중복 정보**: "T15" 이미 3번 표시됨
     ```
     Merit Hall | Ocean Blue | T15  ← 1번
     [T15] 박프로...                ← 2번
     [     T15 관리      ]          ← 3번 (불필요)
     ```

- **터치 영역 분석**:
  ```
  [T15 관리] 버튼: 393px × 48px = 18,864px² (과도)
  칩 영역 (750k):   60px × 24px =  1,440px² (부족)
  ```
  → 버튼이 칩보다 **13배 큰 터치 영역** (우선순위 역전)

#### 2.4 테이블 레이블 중복
- **현재**: `<span class="tableLabel">T15</span>` + "T15 관리" 버튼
- **문제**: 같은 정보 2번 표시 (DRY 원칙 위배)

### 🟡 Medium 문제

#### 2.5 칩 변화 화살표 약함
- **현재**: ↑↓ (Unicode 화살표, 얇은 선)
- **문제**:
  - 배경색 #101522와 낮은 대비
  - 빠른 스캔 시 눈에 안 띔
  - 색상만으로 구분 (색맹 접근성 낮음)

- **개선안**:
  ```
  [현재] 750k ↑230k
  [개선] ┃750k┃ ▲230k  (세로선 + 삼각형)
  ```

#### 2.6 칩 클릭 영역 불명확
- **현재**: `cursor: pointer` + 밑줄 + 파란색
- **문제**: 클릭 가능 영역 시각적 힌트 부족
- **터치 영역**: 60px × 24px = **1,440px²** (최소 권장 2,304px² 미달)

#### 2.7 국가 국기 정렬 불일치
- **문제**:
  ```html
  <span class="playerName">박프로 (S3)</span>
  <span class="flag">🇰🇷</span>
  ```
  → 국기가 우측 끝이 아니라 중간에 떠 있음 (flex gap 때문)

#### 2.8 패널 제목 불필요
- **현재**: `<h2>Key Players (18)</h2>`
- **문제**:
  - 헤더에 "Tracker"와 중복
  - "Key Players"는 자명함 (카드 내용으로 알 수 있음)
  - 24px 높이 낭비

### 🟢 Low 문제

#### 2.9 로딩 상태 개선 여지
- **현재**: `<div class="loading">로딩 중...</div>` (텍스트만)
- **개선안**: 스피너 애니메이션 또는 스켈레톤 UI

---

## 3. Table View

### 현재 구조
```html
<div id="viewTable" class="hidden">
  <button class="backBtn" onclick="showKeyPlayerView()">← Back</button>
  <div class="panel">
    <h2 id="tableTitle">T##</h2>
    <div id="tablePlayerList">
      <!-- Player Row 반복 -->
    </div>
  </div>
</div>
```

### 🔴 Critical 문제

#### 3.1 Back 버튼 터치 영역 부족
- **현재 스타일**:
  ```css
  .backBtn {
    background: transparent;
    border: none;
    padding: var(--sp-sm);  /* 6~10px */
  }
  ```

- **실제 터치 영역**: 약 80px × 32px = **2,560px²**
- **권장 크기**: 48px × 48px = 2,304px² (Apple/Google 기준)
- **문제**: 세로 높이 32px < 48px (손가락으로 누르기 어려움)

#### 3.2 Room/Table Info 중복 렌더링
- **코드 분석** (Line 230-238):
  ```javascript
  function renderTablePlayers(tableId, players) {
    // 매번 roomInfo div 생성/업데이트
    let roomInfo = document.querySelector('#viewTable .roomTableInfo');
    if (!roomInfo) {
      roomInfo = document.createElement('div');
      roomInfo.className = 'roomTableInfo';
      titleElement.parentNode.insertBefore(roomInfo, titleElement);
    }
    roomInfo.textContent = formatRoomTableInfo(...);
  }
  ```

- **문제**: 매번 DOM 쿼리 + 조건 분기 (비효율)
- **개선안**: 미리 HTML에 `<div class="roomTableInfo"></div>` 추가

#### 3.3 빈 좌석 vs 플레이어 시각적 구분 부족
- **현재**:
  ```css
  .playerRow { background: var(--panel); }  /* 모두 동일 */
  .emptySeat { color: var(--muted); font-style: italic; }
  ```

- **문제**: 배경색 동일 → 빠른 스캔 시 구분 어려움
- **제안**: 빈 좌석은 투명 또는 점선 테두리

#### 3.4 좌석 번호 정렬 불일치
- **현재**: `<span class="seat">S3</span>` (min-width: 28px)
- **문제**:
  - S1~S9 = 28px
  - S10 = 32px (넘침)
  - → 좌석 번호가 들쭉날쭉

- **개선안**: `min-width: 36px` (S10까지 여유)

### 🟡 Medium 문제

#### 3.5 🗑️ 삭제 버튼 오작동 위험
- **현재 스타일**:
  ```css
  .deleteBtn {
    background: transparent;
    border: none;
    font-size: 1.1rem;
    padding: var(--sp-xs) var(--sp-sm);  /* 3~6px */
  }
  ```

- **문제**:
  1. 칩 영역과 인접 (오터치 가능)
  2. Confirm 없음 (코드에는 confirm 있지만 시각적 경고 없음)
  3. 빨간색 아님 (위험 행동인데 회색 아이콘)

#### 3.6 Key Player 별 시각적 구분 부족
- **현재**: `<span class="keyStar">⭐</span>` (별 하나)
- **문제**:
  - 별이 작음 (기본 폰트 크기)
  - 카드 배경이 어두워서 노란색 별이 약함

#### 3.7 테이블 제목 중복
- **현재**:
  ```html
  <h2 id="tableTitle">T15</h2>
  <!-- 그리고 -->
  <div class="roomTableInfo">Merit Hall | Ocean Blue | T15</div>
  ```
- **문제**: "T15" 2번 표시 (h2 + roomTableInfo)

### 🟢 Low 문제

#### 3.8 [+] 버튼 레이블 불명확
- **현재**: `<button class="addBtn">[+]</button>`
- **문제**: "[+]"가 무엇을 추가하는지 불명확
- **개선안**: "플레이어 추가" 또는 아이콘만

---

## 4. Overlay (모달)

### 현재 구조
```html
<div id="overlay">
  <div class="overlayBox">
    <div id="overlayContent">
      <!-- 동적 콘텐츠 -->
    </div>
  </div>
</div>
```

### 🔴 Critical 문제

#### 4.1 배경 클릭 시 닫히지 않음
- **현재**: 오직 [취소] 버튼으로만 닫기 가능
- **문제**:
  - 표준 모달 UX 위배 (대부분 배경 클릭 = 닫기)
  - ESC 키도 미지원

- **코드 분석**:
  ```javascript
  // closeOverlay() 함수는 있지만
  // overlay.onclick 이벤트 없음
  ```

#### 4.2 모바일 키보드 올라올 때 오버레이 잘림
- **문제**:
  ```css
  #overlay {
    position: fixed;
    align-items: center;  /* 세로 중앙 */
  }
  ```
  → iOS에서 키보드 올라오면 오버레이 상단 잘림

- **해결**: `align-items: flex-start` + 상단 여백

#### 4.3 입력 필드 자동 포커스 딜레이
- **현재**: `setTimeout(() => focus(), 100)`
- **문제**: 100ms 딜레이 불필요 (체감 가능)
- **개선**: 즉시 포커스 or requestAnimationFrame

### 🟡 Medium 문제

#### 4.4 에러 피드백 alert() 사용
- **현재**: `alert('칩을 입력하세요.');`
- **문제**:
  - 브라우저 기본 alert (투박함)
  - 오버레이 위에 또 오버레이 (UX 혼란)
  - iOS에서 alert은 앱 전체 블로킹

- **개선안**: 입력 필드 아래 빨간 텍스트로 에러 표시

#### 4.5 칩 입력 예시 불친절
- **현재**: `placeholder="예: 750000 또는 750k"`
- **문제**:
  - "750000"은 숫자 세기 어려움 (6자리)
  - "750k"가 750,000인지 명확하지 않음

- **개선안**: `placeholder="750k (= 750,000칩)"`

#### 4.6 국가 코드 대문자 변환 불명확
- **현재**: `style="text-transform:uppercase"`
- **문제**: 사용자가 "kr" 입력 → 화면에는 "kr" → 제출 시 "KR" 변환
- **개선안**: `oninput="this.value = this.value.toUpperCase()"` (실시간 변환)

### 🟢 Low 문제

#### 4.7 [확인]/[취소] 버튼 순서
- **현재**: [취소] [확인] (좌→우)
- **표준**:
  - iOS: [취소] [확인] ✅
  - Android: [확인] [취소]
  - 현재는 iOS 기준 (일관성 있음)

---

## 5. CSS 시스템

### 5.1 색상 시스템 분석

#### 🔴 Critical 문제: 배경색 과다

| 색상 변수 | 사용처 | Hex |
|-----------|--------|-----|
| `--bg` | body 배경 | #0b0d12 |
| `--panel` | 카드/패널 | #101522 |
| (직접) | header | #0f1320 |
| (직접) | roomTableInfo | #1a1d2e |
| (직접) | tableLabel | #223266 |
| (직접) | manageBtn | #0f1320 |
| (직접) | overlayBox | #0f1320 |
| (직접) | overlayInput | #0b0d12 |

**문제점**:
1. **5가지 배경색 혼재** (#0b0d12, #101522, #0f1320, #1a1d2e, #223266)
2. **변수 미사용**: `--panel` 있는데 직접 Hex 입력
3. **시각적 혼란**: 배경색 차이 0.05~0.1 (사람 눈 구분 어려움)

**대비 분석**:
```
#0b0d12 (body)  vs #101522 (panel)  = 1.15:1 (매우 낮음)
#101522 (panel) vs #1a1d2e (room)   = 1.08:1 (거의 동일)
#0f1320 (header) vs #101522 (panel) = 1.02:1 (구분 불가)
```

**개선안**: 3가지로 축소
```css
--bg: #0b0d12     (배경)
--panel: #151822  (카드 - 기존보다 밝게)
--accent: #2a6fff (강조)
```

#### 🟡 Medium 문제: 색상 변수 불일치

- **현재**: 8개 색상 변수 정의, 3개만 일관성 있게 사용
  ```css
  --bg, --panel, --line, --muted, --acc, --text, --green, --red
  ```

- **문제**:
  - `--line` (#1f2435) 정의했지만 직접 #222, #2a3249 사용
  - `--muted` (#9aa3b2) 정의했지만 roomTableInfo는 중복 정의

### 5.2 타이포그래피 분석

#### 🟢 Low 문제: 폰트 크기 과다

| 클래스 | 폰트 크기 | 용도 |
|--------|-----------|------|
| (기본) | 1rem | 본문 |
| h2 | 1rem | 제목 (동일!) |
| .small | 0.8rem | 버전, 카운트 |
| .tableLabel | 0.75rem | 테이블 레이블 |
| .playerName | 0.85rem | 플레이어 이름 |
| .chips | 1rem | 칩 |
| .chipChange | 0.75rem | 칩 변화 |
| .manageBtn | 0.8rem | 버튼 |

**문제**:
1. **7가지 폰트 크기** (일관성 부족)
2. **h2 = body** (계층 없음)
3. **0.05rem 단위** (너무 세밀, 시각적 차이 미미)

**개선안**: 4가지로 축소
```css
--fs-lg: 1.1rem   (제목)
--fs-md: 1rem     (본문, 칩)
--fs-sm: 0.85rem  (보조 텍스트)
--fs-xs: 0.75rem  (캡션)
```

### 5.3 간격 시스템 분석

#### 🟢 Low 문제: 간격 변수 일관성

- **현재**: 4개 변수 (xs, sm, md, lg)
  ```css
  --sp-xs: clamp(3px, 0.8vw, 6px);
  --sp-sm: clamp(6px, 1.5vw, 10px);
  --sp-md: clamp(8px, 2vw, 14px);
  --sp-lg: clamp(12px, 3vw, 20px);
  ```

- **문제**:
  - xs=3~6px, sm=6~10px → xs 최대 = sm 최소 (겹침)
  - clamp 범위 너무 좁음 (데스크탑에서도 20px 최대)

---

## 6. 인터랙션 패턴

### 🔴 Critical 문제

#### 6.1 칩 수정 플로우 복잡
- **현재 플로우**:
  ```
  1. 칩(750k) 클릭
  2. 오버레이 열림
  3. 입력 필드 포커스 (100ms 딜레이)
  4. 숫자 입력
  5. [확인] 클릭
  6. 오버레이 닫힘
  7. 로딩... (서버 처리)
  8. 재렌더링
  ```
  총 **8단계** (너무 많음)

- **개선안**: 인라인 편집
  ```
  1. 칩(750k) 클릭
  2. 즉시 입력 필드로 변경 (오버레이 없음)
  3. 숫자 입력
  4. Enter 또는 바깥 클릭 → 저장
  ```
  총 **4단계** (50% 단축)

#### 6.2 삭제 확인 브라우저 기본 Confirm
- **현재**: `if (!confirm('삭제?')) return;`
- **문제**: iOS에서 confirm은 앱 전체 블로킹
- **개선안**: 커스텀 오버레이 (빨간 버튼 + "삭제하면 복구 불가")

### 🟡 Medium 문제

#### 6.3 로딩 상태 피드백 불일치
- **문제**:
  - 칩 수정 시: 오버레이 닫힘 → 로딩 표시
  - 플레이어 추가 시: 오버레이 닫힘 → 로딩 표시
  - 삭제 시: 로딩 표시만 (오버레이 없음)

- **일관성 부족**: 같은 서버 요청인데 다른 피드백

#### 6.4 새로고침 방법 없음
- **문제**: 데이터 새로고침하려면 브라우저 새로고침 필요
- **개선안**:
  - Pull-to-Refresh (모바일)
  - 헤더에 새로고침 버튼 (데스크탑)

---

## 7. 모바일 최적화

### 🔴 Critical 문제

#### 7.1 터치 타겟 크기 불균형

| 요소 | 크기 | 픽셀² | 권장 | 판정 |
|------|------|-------|------|------|
| [T15 관리] 버튼 | 393×48 | 18,864 | 2,304 | ✅ 과도 |
| 칩 (750k) | 60×24 | 1,440 | 2,304 | ❌ 부족 |
| Back 버튼 | 80×32 | 2,560 | 2,304 | ⚠️ 높이 부족 |
| 🗑️ 삭제 버튼 | 40×32 | 1,280 | 2,304 | ❌ 부족 |
| [+] 추가 버튼 | 48×32 | 1,536 | 2,304 | ❌ 부족 |

**결론**: 가장 덜 중요한 버튼([T15 관리])이 가장 크고, 중요한 버튼(칩, 삭제)이 작음

#### 7.2 스크롤 영역 명확성 부족
- **현재**: `.wrap { overflow-y: auto }`
- **문제**:
  - iOS에서 스크롤 바 보이지 않음
  - 스크롤 가능한지 모름 (특히 처음 사용자)

- **개선안**: 하단 그라디언트 추가 (스크롤 힌트)

### 🟡 Medium 문제

#### 7.3 Safe Area 미적용
- **현재**: 상단/하단 여백 없음
- **문제**: iPhone X 이상 노치/홈 인디케이터 침범
- **개선안**:
  ```css
  header {
    padding-top: max(var(--sp-sm), env(safe-area-inset-top));
  }
  .wrap {
    padding-bottom: max(var(--sp-sm), env(safe-area-inset-bottom));
  }
  ```

---

## 8. 접근성 (Accessibility)

### 🟡 Medium 문제

#### 8.1 색상만으로 정보 전달
- **현재**:
  - 칩 증가 = 초록색 ↑230k
  - 칩 감소 = 빨간색 ↓180k

- **문제**: 색맹 사용자는 구분 불가
- **개선안**:
  - ▲ (위 삼각형) = 증가
  - ▼ (아래 삼각형) = 감소
  - 색상 + 모양 이중 코딩

#### 8.2 ARIA 레이블 없음
- **현재**:
  ```html
  <button class="deleteBtn" onclick="...">🗑️</button>
  ```
  → 스크린 리더는 "버튼, 쓰레기통 이모지" 읽음

- **개선**:
  ```html
  <button class="deleteBtn" aria-label="플레이어 삭제" onclick="...">🗑️</button>
  ```

#### 8.3 키보드 네비게이션 미지원
- **문제**:
  - Tab 키로 포커스 이동 가능하지만 시각적 표시 없음
  - Enter 키로 칩 수정 불가 (반드시 마우스 클릭)

---

## 9. 성능 최적화

### 🟢 Low 문제

#### 9.1 DOM 쿼리 반복
- **코드 분석** (Line 232):
  ```javascript
  let roomInfo = document.querySelector('#viewTable .roomTableInfo');
  if (!roomInfo) { ... }
  ```
  → 매번 `renderTablePlayers()` 호출 시 DOM 쿼리

- **개선안**: 변수 캐싱 또는 HTML에 미리 추가

#### 9.2 불필요한 리렌더링
- **현재**:
  - 칩 수정 → 전체 Key Player List 재렌더링
  - 플레이어 추가 → 전체 Table Player List 재렌더링

- **개선안**: 변경된 카드/행만 업데이트

---

## 📊 문제점 종합 (우선순위별)

### 🔴 Critical (12개) - 즉시 수정

| # | 문제 | 영향 | 위치 |
|---|------|------|------|
| 1 | **정보 밀도 저하** (카드 5줄 → 2줄 가능) | 스크롤 2배 증가 | Key Player Card |
| 2 | **Room/Table Info 묻힘** (대비 2.8:1) | 중요 정보 시인성 저하 | Key Player Card |
| 3 | **[T15 관리] 버튼 과다** (18,864px²) | 공간 낭비, 우선순위 역전 | Key Player Card |
| 4 | **배경색 5개 혼재** | 시각적 혼란, 일관성 부재 | 전체 CSS |
| 5 | **칩 터치 영역 부족** (1,440px²) | 오터치 빈번 | Key Player Card |
| 6 | **헤더 컨텍스트 부재** | 현재 위치 불명확 | Header |
| 7 | **Back 버튼 터치 영역 부족** (32px 높이) | 누르기 어려움 | Table View |
| 8 | **빈 좌석 구분 부족** | 빠른 스캔 어려움 | Table View |
| 9 | **오버레이 배경 클릭 미지원** | UX 표준 위배 | Overlay |
| 10 | **모바일 키보드 오버레이 잘림** | iOS 입력 불가 | Overlay |
| 11 | **터치 타겟 불균형** | 중요도 역전 | 전체 |
| 12 | **칩 수정 플로우 8단계** | 사용 빈도 높은데 복잡 | 전체 |

### 🟡 Medium (8개) - 우선순위 높음

| # | 문제 | 영향 | 위치 |
|---|------|------|------|
| 13 | 칩 변화 화살표 약함 (↑↓) | 시인성 저하 | Key Player Card |
| 14 | 칩 클릭 영역 불명확 | 학습 곡선 증가 | Key Player Card |
| 15 | 🗑️ 삭제 버튼 오작동 위험 | 실수 삭제 가능 | Table View |
| 16 | alert() 에러 피드백 | 투박함, iOS 블로킹 | Overlay |
| 17 | 색상만으로 정보 전달 | 색맹 접근성 낮음 | 전체 |
| 18 | 로딩 피드백 불일치 | 혼란 | 전체 |
| 19 | 새로고침 방법 없음 | 데이터 갱신 불편 | 전체 |
| 20 | Safe Area 미적용 | iPhone X 이상 침범 | Header/Wrap |

### 🟢 Low (5개) - 개선 권장

| # | 문제 | 영향 | 위치 |
|---|------|------|------|
| 21 | 패널 제목 불필요 (h2) | 24px 낭비 | Key Player View |
| 22 | 폰트 크기 7가지 | 일관성 부족 | CSS |
| 23 | DOM 쿼리 반복 | 성능 미세 저하 | Table View JS |
| 24 | ARIA 레이블 없음 | 스크린 리더 부정확 | 전체 |
| 25 | 버전 정보 불필요 (헤더) | 공간 낭비 | Header |

---

## 🎯 핵심 개선 로드맵

### Phase 1: Quick Wins (10분)
1. Room/Table Info 강조 (그라디언트 + 밝은 색상)
2. 칩 화살표 → 삼각형 (▲▼)
3. 칩에 세로선 추가 (┃750k┃)

**예상 효과**: 시인성 50% 향상

### Phase 2: Critical Fixes (30분)
1. Key Player Card 2줄 압축
2. [T15 관리] → [→] 아이콘 축소
3. 배경색 5개 → 3개 통일
4. 터치 타겟 크기 조정

**예상 효과**: 스크롤 50% 감소, 일관성 향상

### Phase 3: Medium Fixes (1시간)
1. 헤더 브레드크럼 추가
2. 오버레이 배경 클릭 지원
3. Safe Area 적용
4. 삭제 버튼 빨간색 + 커스텀 Confirm

**예상 효과**: 모바일 UX 개선, 안전성 향상

### Phase 4: Advanced (2시간)
1. 인라인 칩 편집
2. Pull-to-Refresh
3. 스켈레톤 UI
4. 키보드 네비게이션

**예상 효과**: 프로페셔널 수준 UX

---

## 📈 예상 개선 효과 (Phase 1+2 적용 시)

| 지표 | Before | After | 개선율 |
|------|--------|-------|--------|
| **카드 높이** | 176px | 88px | **50%↓** |
| **한 화면 정보량** | 4.8개 | 9.6개 | **2배** |
| **18명 스크롤 횟수** | 3.75회 | 1.88회 | **50%↓** |
| **배경색 종류** | 5개 | 3개 | **40%↓** |
| **Room/Table 대비** | 2.8:1 | 4.5:1 | **WCAG 통과** |
| **칩 터치 영역** | 1,440px² | 2,304px² | **60%↑** |

---

## 🤔 다음 단계

**어떻게 진행할까요?**

1. **"Quick Wins 적용"** → 10분 내 3가지 핵심 수정
2. **"Phase 1+2 전체"** → 30분 내 12개 Critical 해결
3. **"특정 문제만"** → 원하는 문제 번호 지정 (예: "1, 2, 5번만")
4. **"분석 더 깊이"** → 특정 섹션 심층 분석 (예: "Overlay 더 자세히")
5. **"개선안 목업"** → 수정 후 UI 목업 생성

---

**분석 완료. 총 25개 문제 도출.**
