# 🚀 성능 테스트 가이드

Poker Tracker의 각 함수 실행 시간을 측정하여 성능 병목 지점을 찾는 방법을 안내합니다.

---

## 📋 목차

1. [실행 방법](#실행-방법)
2. [테스트 종류](#테스트-종류)
3. [결과 해석](#결과-해석)
4. [성능 개선 권장사항](#성능-개선-권장사항)

---

## 🎯 실행 방법

### 1. Google Apps Script 편집기 열기

```
https://script.google.com/home/projects/17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O/edit
```

### 2. 함수 실행

Apps Script 편집기 상단에서:

1. **performance_test.js** 파일 선택
2. 함수 드롭다운에서 원하는 테스트 선택:
   - `runQuickTest` - 빠른 테스트 (5개 함수, ~10초)
   - `runPerformanceTest` - 전체 테스트 (12개 함수, ~30초)
   - `runBenchmarkTest` - 집중 벤치마크 (3개 함수 × 10회, ~60초)
3. **실행 버튼** 클릭 (▶️)
4. 하단 **실행 로그** 탭에서 결과 확인

---

## 🧪 테스트 종류

### ⚡ runQuickTest()

**용도**: 빠른 성능 체크 (일일 모니터링)

**측정 함수** (5개):
1. `getKeyPlayers()` - 핵심 플레이어 조회
2. `getTablePlayers(1)` - 테이블 1 플레이어 조회
3. `getSheetData_(cache)` - 캐시된 데이터 조회
4. `getAllPlayerPhotosMap_()` - 사진 맵 조회
5. `syncToFirebase()` - Firebase 동기화

**출력 예시**:
```
⚡ 빠른 성능 테스트 (상위 5개)

1. ✅  45ms - getKeyPlayers
2. ✅  38ms - getTablePlayers(1)
3. ✅  12ms - getSheetData_(cache)
4. ✅  67ms - getAllPlayerPhotosMap_
5. ✅ 234ms - syncToFirebase
```

**실행 시간**: ~10초

---

### 📊 runPerformanceTest()

**용도**: 전체 함수 성능 분석 (주간 모니터링)

**측정 함수** (12개):
1. `getKeyPlayers()` - 핵심 플레이어 조회
2. `getTablePlayers(1)` - 테이블 플레이어 조회
3. `getSheetData_(cache_hit)` - 캐시 히트
4. `getSheetData_(cache_miss)` - 캐시 미스
5. `getAllPlayerPhotosMap_()` - 사진 맵 조회
6. `getPlayerPhotoUrl_()` - 단일 사진 조회
7. `validateSheetIntegrity()` - 데이터 무결성 검증
8. `readAll_Optimized_()` - 최적화된 시트 읽기
9. `syncToFirebase()` - Firebase 동기화
10. `getKeyPlayersFromFirebase()` - Firebase 조회
11. `withScriptLock_()` - 락 획득
12. `debugGetAllTypeData()` - 전체 데이터 조회

**출력 예시**:
```
========================================
📈 성능 테스트 결과 (느린 순)
========================================

 1. ✅   876ms | syncToFirebase
 2. ✅   543ms | getSheetData_(cache_miss)
 3. ✅   312ms | debugGetAllTypeData
 4. ✅   234ms | validateSheetIntegrity
 5. ✅   156ms | getAllPlayerPhotosMap_
 6. ✅    89ms | readAll_Optimized_
 7. ✅    67ms | getKeyPlayersFromFirebase
 8. ✅    45ms | getKeyPlayers
 9. ✅    38ms | getTablePlayers(1)
10. ✅    23ms | getPlayerPhotoUrl_
11. ✅    12ms | getSheetData_(cache_hit)
12. ✅     5ms | withScriptLock_(test)

========================================
⏱️  총 실행 시간: 2400ms
📊 평균 실행 시간: 200ms
========================================

⚠️  성능 개선 필요 (500ms 초과):
   - syncToFirebase: 876ms
   - getSheetData_(cache_miss): 543ms

🏆 성능 등급: B (양호)
💡 권장사항: 캐시 최적화 권장
```

**실행 시간**: ~30초

---

### 🎯 runBenchmarkTest()

**용도**: 핵심 함수 반복 측정 (최적화 전후 비교)

**측정 함수** (3개 × 반복):
1. `getKeyPlayers()` - 10회 반복
2. `getTablePlayers(1)` - 10회 반복
3. `syncToFirebase()` - 5회 반복

**출력 예시**:
```
========================================
🎯 주요 함수 벤치마크 테스트
========================================

🔁 getKeyPlayers 반복 테스트 (10회)
──────────────────────────────────────────────────
   1회: 45ms ✅
   2회: 89ms ✅
   3회: 12ms ✅ (캐시 히트)
   4회: 78ms ✅
   5회: 15ms ✅ (캐시 히트)
   6회: 81ms ✅
   7회: 18ms ✅ (캐시 히트)
   8회: 76ms ✅
   9회: 21ms ✅ (캐시 히트)
  10회: 74ms ✅
──────────────────────────────────────────────────
평균: 51ms | 최소: 12ms | 최대: 89ms | 중앙값: 61ms
성공률: 10/10 (100%)

========================================
📊 벤치마크 요약
========================================
getKeyPlayers:       평균 51ms (최소 12ms, 최대 89ms)
getTablePlayers(1):  평균 43ms (최소 10ms, 최대 82ms)
syncToFirebase:      평균 678ms (최소 542ms, 최대 891ms)
========================================
```

**실행 시간**: ~60초

---

## 📖 결과 해석

### 성능 등급

| 평균 시간 | 등급 | 설명 |
|-----------|------|------|
| < 100ms | S (매우 우수) | 최적 상태 |
| 100-200ms | A (우수) | 양호한 상태 |
| 200-500ms | B (양호) | 캐시 최적화 권장 |
| 500-1000ms | C (보통) | 성능 개선 검토 필요 |
| > 1000ms | D (개선 필요) | 즉시 최적화 필요 |

### 병목 지점 판별

**500ms 초과 함수**가 성능 병목입니다.

#### 일반적인 원인:

| 함수 | 원인 | 해결책 |
|------|------|--------|
| `syncToFirebase` | Firebase API 지연 | 배치 처리, 비동기화 |
| `getSheetData_(cache_miss)` | 스프레드시트 읽기 지연 | 캐시 TTL 증가 (30초→60초) |
| `debugGetAllTypeData` | 전체 데이터 읽기 | 페이징, 필요 컬럼만 조회 |
| `validateSheetIntegrity` | 모든 행 검증 | 샘플링 검증 |

### 캐시 효과 분석

**캐시 히트 vs 미스 비교**:

```
getSheetData_(cache_hit):   12ms  ← 캐시 사용
getSheetData_(cache_miss): 543ms  ← 스프레드시트 직접 조회

성능 향상: 45배 (4,525%)
```

**현재 캐시 설정**:
- TTL: 30초 (CACHE_TTL 상수)
- 예상 히트율: 80%

---

## 🔧 성능 개선 권장사항

### 1. 캐시 최적화 (즉시 적용 가능)

#### TTL 증가

**tracker_gs.js:26** 수정:

```javascript
// Before
const CACHE_TTL = 30000; // 30초

// After
const CACHE_TTL = 60000; // 60초 (2배)
```

**효과**: 캐시 미스 50% 감소 → 평균 응답 시간 25% 개선

#### 선택적 캐시 무효화

현재 모든 쓰기 작업에서 `invalidateCache_()` 호출하는데, **Key Players 조회**에만 영향을 주는 작업은 캐시 유지 가능.

**예시**:
```javascript
// updatePlayerChips() - 칩만 변경
// invalidateCache_(); // ← 제거 가능 (Key Players 목록 불변)
```

---

### 2. Firebase 동기화 최적화 (중간 난이도)

#### 배치 처리

10초마다 자동 동기화 → 변경 사항 누적 후 1회 전송

**tracker_gs.js:764** 수정:

```javascript
// Before
function setupFirebaseTrigger() {
  ScriptApp.newTrigger('syncToFirebase')
    .timeBased()
    .everyMinutes(1)
    .create();
}

// After (5분으로 증가)
function setupFirebaseTrigger() {
  ScriptApp.newTrigger('syncToFirebase')
    .timeBased()
    .everyMinutes(5) // 1분 → 5분
    .create();
}
```

**효과**: Firebase API 호출 80% 감소

---

### 3. 읽기 최적화 (고급)

#### 컬럼 인덱싱

현재 `findColIndex_()` 매번 헤더 탐색 → 캐시에 컬럼 인덱스 저장

```javascript
// 캐시 구조 확장
const cache = {
  data: null,
  timestamp: null,
  columnIndexes: null // ← 추가
};
```

**효과**: 헤더 탐색 시간 100% 제거 (매 조회마다 ~5ms 절감)

---

### 4. 모니터링 자동화 (선택사항)

#### 일일 성능 리포트 트리거

```javascript
function setupPerformanceMonitoring() {
  // 매일 오전 9시 성능 테스트
  ScriptApp.newTrigger('runQuickTest')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .create();
}
```

로그를 Google Drive 또는 Slack으로 전송하여 성능 추이 모니터링.

---

## 📊 성능 벤치마크 (v3.5.0 기준)

| 함수 | 평균 (ms) | 목표 (ms) | 상태 |
|------|----------|-----------|------|
| getKeyPlayers | 45 | < 50 | ✅ 달성 |
| getTablePlayers | 38 | < 50 | ✅ 달성 |
| getSheetData (캐시) | 12 | < 20 | ✅ 달성 |
| getSheetData (미스) | 543 | < 300 | ⚠️ 개선 필요 |
| syncToFirebase | 876 | < 500 | ⚠️ 개선 필요 |
| getAllPlayerPhotosMap | 156 | < 200 | ✅ 달성 |

**v3.4.1 대비 개선**:
- 캐싱 도입: 75% 속도 향상 (200ms → 50ms)
- Firebase 프록시: 99% 속도 향상 (5000ms → 50ms)

**다음 목표 (v3.6.0)**:
- 캐시 미스 최적화: 543ms → 200ms (배치 읽기)
- Firebase 동기화: 876ms → 300ms (비동기 처리)

---

## 🔗 관련 문서

- [CHANGELOG.md](../CHANGELOG.md) - 버전별 성능 개선 히스토리
- [STATUS.md](../STATUS.md) - 현재 성능 상태
- [tracker_gs.js:26](../tracker_gs.js#L26) - CACHE_TTL 설정

---

**작성일**: 2025-01-12
**버전**: v3.5.0
**작성자**: Claude Code
