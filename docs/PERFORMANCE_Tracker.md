# Tracker 성능 최적화 가이드

> **Note**: 이 문서는 v1.0-v2.x 시대의 성능 최적화 가이드입니다.
> **최신 성능**: v3.4.1-v3.5.0에서 Firebase 하이브리드 캐싱으로 로딩 속도 96% 개선 (12초 → 0.5초)
>
> 상세한 최신 성능 정보는 [docs/PRD.md](PRD.md) 참조

## 📊 성능 병목 분석 (Historical)

### 기존 구조 (v1.0 ~ v1.1)

#### 문제점
1. **매번 전체 시트 읽기**
   ```javascript
   // 모든 함수가 독립적으로 시트 읽기
   getKeyPlayers() → readAll_() → getDataRange().getValues()
   getTablePlayers() → readAll_() → getDataRange().getValues()
   ```
   - 키 플레이어 로딩: 1회 시트 읽기
   - 테이블 관리 클릭: 1회 시트 읽기
   - **결과**: 사용자 액션마다 ~2초 지연

2. **캐싱 없음**
   - 30초 내 동일 데이터를 5번 요청 = 5번 시트 읽기
   - Google Sheets API 제한: 100 reads/100초/사용자

3. **getDataRange() 비효율**
   ```javascript
   getDataRange().getValues() // 1000행 × 20열 = 20,000셀 읽기
   // 실제 데이터: 180행 × 8열 = 1,440셀만 필요
   ```

4. **개별 셀 업데이트**
   ```javascript
   // 10명 칩 수정 = 10회 setValue() 호출
   for (let i = 0; i < 10; i++) {
     sh.getRange(row, col).setValue(chips);
   }
   ```

### 성능 측정 (v1.1 기준)

| 작업 | 시트 읽기 | 예상 시간 | 사용자 체감 |
|------|----------|----------|------------|
| 키 플레이어 로딩 | 1회 | 1.5 ~ 2초 | 느림 |
| 테이블 관리 클릭 | 1회 | 1.5 ~ 2초 | 느림 |
| 칩 수정 (1명) | 1회 | 2 ~ 3초 | 매우 느림 |
| 칩 수정 (10명) | 10회 | 20 ~ 30초 | 사용 불가 |

---

## ⚡ 최적화 전략 (v1.2)

### 1. PropertiesService 캐싱 (30초 TTL)

#### 원리
```javascript
// 첫 요청: Sheet 읽기 + PropertiesService 저장
getCachedTypeData_() → readAll_Optimized_() → PropertiesService.setProperty()

// 30초 내 재요청: PropertiesService에서 즉시 반환
getCachedTypeData_() → PropertiesService.getProperty() → 즉시 반환
```

#### 효과
- **읽기 속도**: 1.5초 → 0.1초 (15배 개선)
- **API 절약**: 100 reads → 3.3 reads (30초당 1회만 읽기)

#### 제약사항
- PropertiesService 용량: 9KB/property
- Type 시트 크기: ~500행까지 안전 (JSON 압축 시)

### 2. getRange 범위 최적화

#### 기존 (v1.1)
```javascript
sh.getDataRange().getValues() // 전체 범위 (빈 행/열 포함)
```

#### 개선 (v1.2)
```javascript
const lastRow = sh.getLastRow();
const lastCol = sh.getLastColumn();
sh.getRange(1, 1, lastRow, lastCol).getValues(); // 정확한 범위만
```

#### 효과
- **읽기 셀 수**: 20,000셀 → 1,440셀 (86% 감소)
- **처리 시간**: 1.5초 → 0.8초 (47% 개선)

### 3. 배치 쓰기 (신규 기능)

#### 개별 쓰기 (v1.1)
```javascript
// 10명 칩 수정 = 10회 API 호출
for (let i = 0; i < 10; i++) {
  updatePlayerChips(tableId, seatNo, chips); // 1회 API 호출
}
// 총 시간: 10 × 2.5초 = 25초
```

#### 배치 쓰기 (v1.2)
```javascript
// 10명 칩 수정 = 1회 API 호출
batchUpdateChips([
  { tableId: 'T1', seatNo: 'S1', chips: 50000 },
  { tableId: 'T1', seatNo: 'S2', chips: 45000 },
  // ... 8명 더
]);
// 총 시간: 1 × 2.5초 = 2.5초
```

#### 효과
- **10명 업데이트**: 25초 → 2.5초 (10배 개선)
- **API 호출**: 10회 → 1회

---

## 📈 성능 비교표

### v1.1 vs v1.2

| 작업 | v1.1 (기존) | v1.2 (최적화) | 개선율 |
|------|------------|--------------|--------|
| **키 플레이어 로딩 (첫 요청)** | 1.5초 | 0.8초 | **47% ↓** |
| **키 플레이어 로딩 (캐시 히트)** | 1.5초 | 0.1초 | **93% ↓** |
| **테이블 관리 (첫 요청)** | 1.5초 | 0.8초 | **47% ↓** |
| **테이블 관리 (캐시 히트)** | 1.5초 | 0.1초 | **93% ↓** |
| **칩 수정 1명** | 2.5초 | 2.5초 | 변화 없음 |
| **칩 수정 10명** | 25초 | 2.5초 | **90% ↓** |

### 캐시 히트율 예상

| 시나리오 | 캐시 히트율 | 평균 응답 시간 |
|---------|-----------|--------------|
| 단독 사용 (30초 내 재방문) | 70% | 0.34초 |
| 2명 동시 사용 | 80% | 0.26초 |
| 5명 동시 사용 | 90% | 0.18초 |

---

## 🚀 구현 방법

### Step 1: tracker_optimized.gs 배포

1. Google Apps Script에서 `tracker_optimized.gs` 파일 추가
2. 기존 `tracker.gs` 삭제 (또는 백업)
3. 함수명 동일하므로 프론트엔드 수정 불필요

### Step 2: 캐시 무효화 규칙 이해

#### 자동 무효화
- `updatePlayerChips()` 호출 시
- `addPlayer()` 호출 시
- `removePlayer()` 호출 시
- **결과**: 쓰기 직후 다음 읽기는 최신 데이터 보장

#### 수동 무효화
```javascript
// 외부에서 Type 시트 직접 수정 시
invalidateCache_(); // 캐시 강제 삭제
```

### Step 3: 배치 업데이트 사용 (선택)

#### 프론트엔드에 배치 UI 추가
```javascript
// 테이블 전체 칩 입력 모드
const updates = [];
for (let i = 1; i <= 9; i++) {
  const chips = prompt(`S${i} 칩 입력:`);
  if (chips) {
    updates.push({ tableId, seatNo: `S${i}`, chips: parseChips(chips) });
  }
}

// 한 번에 업데이트
google.script.run
  .withSuccessHandler(() => loadTablePlayers(tableId))
  .batchUpdateChips(updates);
```

---

## 🧪 성능 테스트

### 캐시 통계 확인
```javascript
// Apps Script 실행 → 로그 확인
function testCacheStats() {
  const stats = debugCacheStats();
  Logger.log('캐시 상태:', stats);
  // 출력:
  // {
  //   cached: true,
  //   ageMs: 12500,
  //   ageSeconds: 12,
  //   valid: true,
  //   expiresIn: 17500
  // }
}
```

### 부하 테스트 시나리오

#### 시나리오 1: 키 플레이어 반복 확인
```
1. 키 플레이어 로딩 (첫 요청: 0.8초)
2. 10초 후 새로고침 (캐시 히트: 0.1초) ✅
3. 15초 후 새로고침 (캐시 히트: 0.1초) ✅
4. 35초 후 새로고침 (캐시 만료: 0.8초)
```

#### 시나리오 2: 테이블 순회
```
1. T1 관리 클릭 (첫 요청: 0.8초)
2. T2 관리 클릭 (캐시 히트: 0.1초) ✅
3. T3 관리 클릭 (캐시 히트: 0.1초) ✅
```

#### 시나리오 3: 배치 업데이트
```
1. T1 전체 9명 칩 수정 (배치: 2.5초)
2. 키 플레이어 확인 (캐시 무효화됨: 0.8초)
```

---

## ⚠️ 주의사항

### 1. 캐시 일관성
- **문제**: 외부에서 Type 시트 직접 수정 시 30초간 구버전 데이터 표시
- **해결**:
  - Option A: 캐시 TTL 단축 (30초 → 10초)
  - Option B: "새로고침" 버튼 추가 (캐시 강제 무효화)

### 2. PropertiesService 용량 제한
- **제한**: 9KB/property, 500KB/total
- **Type 시트 크기**: 500행 × 8열 = JSON 4KB (안전)
- **초과 시**: 자동으로 캐싱 비활성화 (정상 동작)

### 3. 동시 사용자
- **캐시 공유**: 모든 사용자가 동일 캐시 사용
- **장점**: 2명째부터는 즉시 응답
- **단점**: 첫 사용자만 0.8초 대기

---

## 📋 마이그레이션 체크리스트

- [ ] `tracker_optimized.gs` 파일 추가
- [ ] 기존 `tracker.gs` 백업
- [ ] 배포 → 새 배포 → 웹 앱
- [ ] 테스트: 키 플레이어 로딩 (0.8초 → 0.1초 확인)
- [ ] 테스트: 칩 수정 (캐시 무효화 확인)
- [ ] 30초 후 재테스트 (캐시 히트 확인)
- [ ] `debugCacheStats()` 실행 → 캐시 상태 확인

---

## 🔮 향후 최적화 방안

### v1.3 예정
1. **IndexedDB 클라이언트 캐싱**
   - localStorage → IndexedDB (용량 무제한)
   - 오프라인 지원

2. **WebSocket 실시간 동기화**
   - Type 시트 변경 감지 → 자동 업데이트
   - 캐시 일관성 완벽 보장

3. **Service Worker**
   - 백그라운드 동기화
   - 네트워크 오류 복구

### v2.0 예정
1. **Firebase Realtime Database**
   - Google Sheets → Firebase 이관
   - 100배 빠른 응답 속도

2. **GraphQL API**
   - 필요한 필드만 요청
   - 네트워크 페이로드 90% 감소
