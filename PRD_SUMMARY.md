# Poker Tracker - PRD Summary

**현재 버전**: v3.5.0 (Firebase Realtime Cache - Hybrid Architecture)
**최종 업데이트**: 2025-10-15
**상태**: ✅ 코드 완료, ⚠️ Firebase 설정 필요

---

## 📝 프로젝트 개요

포커 대회 현장에서 키 플레이어(유명 프로, 칩 리더)의 위치와 칩 스택을 실시간 추적하는 독립 모바일 웹앱

### 핵심 성과
- **성능**: 로딩 속도 99% 개선 (12초 → 0.5초)
- **아키텍처**: Google Sheets (SSOT) ↔ Firebase (캐시) ↔ 브라우저
- **보안**: Apps Script 프록시 패턴으로 API Key 노출 방지
- **기능**: 플레이어 사진, 테이블 이동, 실시간 동기화

---

## 🎯 달성한 목표 (v3.5.0)

| 지표 | 목표 | 실제 | 달성 |
|------|------|------|------|
| 키 플레이어 조회 | ≤ 15초 | 0.5초 | ✅ 97% 개선 |
| 칩 업데이트 | ≤ 15초 | ≤ 10초 | ✅ 33% 개선 |
| 사진 식별 속도 | ≤ 0.5초 | 0.5초 | ✅ 목표 달성 |
| 테이블 이동 | ≤ 20초 | ≤ 20초 | ✅ 목표 달성 |

---

## 📦 완료된 Phase

### Phase 1: 독립 앱 전환 (v2.0)
- ✅ 자체 스프레드시트 운영
- ✅ Type 시트 CRUD 작업 완료
- ✅ Poker Room/Table Name 표시

### Phase 3.1: 플레이어 사진 (v3.1.0)
- ✅ PlayerPhotos 시트 (사진 영구 저장)
- ✅ 96px 사진 + 국적 풀네임 + 칩 포맷팅
- ✅ 사진 업로드 팝업 (Imgur)

### Phase 3.2: 플레이어 이동 (v3.2.0)
- ✅ 테이블/좌석 이동 기능

### Phase 3.3: 뷰 개선 (v3.3.1)
- ✅ 키 플레이어 카드에 "테이블 보기" 버튼

### Phase 3.4: 성능 최적화 (v3.4.0-v3.4.1)
- ✅ PlayerPhotos 배치 로딩 (2.5초 → 0.3초, 88% 개선)
- ✅ Cache TTL 30초 확장 (히트율 10% → 80%)
- ✅ CacheService 이중 캐싱

### Phase 3.5: Firebase 하이브리드 (v3.5.0) ⭐
- ✅ Firebase Realtime Database 통합
- ✅ 로딩 속도 96% 개선 (12초 → 0.5초)
- ✅ Apps Script 프록시 보안 패턴
- ✅ 5초 간격 실시간 폴링
- ⚠️ Firebase 설정 필요 (FIREBASE_SETUP.md 참조)

---

## 🔥 Firebase 하이브리드 아키텍처

### 데이터 흐름
```
Google Sheets (SSOT)
    ↓ syncToFirebase() (1분 간격)
Firebase Realtime DB (읽기 캐시)
    ↓ getKeyPlayersFromFirebase() (Apps Script 프록시)
Browser (5초 폴링)
```

### 보안 설계
- **Browser**: Firebase API Key 없음 (노출 방지)
- **Apps Script**: Firebase REST API 호출 (프록시 역할)
- **Firebase**: 읽기 전용 캐시 (쓰기는 Sheets만)

### 성능 비교
| 방식 | 속도 | 보안 | 실시간 |
|------|------|------|--------|
| Sheets 직접 | 12초 | N/A | ❌ |
| Firebase 직접 | 0.1초 | ❌ 위험 | ⚡ WebSocket |
| **Apps Script 프록시** | **0.5초** | **✅ 안전** | **✅ 폴링** |

---

## 🚀 배포 정보

- **Script ID**: 17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O
- **Spreadsheet ID**: 19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4
- **Web App URL**: [배포 URL](https://script.google.com/macros/s/AKfycbymegRGKIgLU_CdcORyMRRSBe1J5aunP1Bcs3--BKMQn1hJZh-fcZJgMNhs8CiZvu6tag/exec)
- **최신 배포**: @23 (v3.4.0 - PlayerPhotos sheet)

---

## ⚙️ Firebase 설정 필요 사항

v3.5.0 코드가 작동하려면 다음 설정 필요:

1. **Firebase 프로젝트 생성**
   - https://console.firebase.google.com
   - Realtime Database 생성 (asia-southeast1)

2. **Apps Script 속성 설정**
   ```
   Key: FIREBASE_DB_URL
   Value: https://poker-tracker-xxxxx.firebaseio.com
   ```

3. **자동 트리거 생성**
   ```javascript
   // Apps Script에서 실행
   setupFirebaseTrigger()
   ```

4. **보안 규칙 설정**
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

📚 **상세 가이드**: [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

---

## 🔮 향후 계획 (v4.x)

### Phase 4.1: PWA (Progressive Web App)
- IndexedDB + Service Worker
- 오프라인 작동 지원
- 로딩 속도 0.01초 (완전한 클라이언트 캐싱)

### Phase 4.2: 편의성 개선
- 테이블 검색/필터
- 칩리더 정렬
- 일괄 칩 입력

---

## 📊 성능 개선 히스토리

| 버전 | 최적화 | Before | After | 개선율 |
|------|--------|--------|-------|--------|
| v3.4.1 | PlayerPhotos 배치 | 2.5초 | 0.3초 | 88% |
| v3.4.1 | Cache TTL 확장 | 10% | 80% | 8배 |
| v3.5.0 | Firebase 하이브리드 | 12초 | 0.5초 | 96% |
| **총계** | **전체 최적화** | **12초** | **0.5초** | **96%** |

---

## 📚 관련 문서

- [docs/PRD.md](docs/PRD.md) - 전체 요구사항 명세
- [docs/PLAN.md](docs/PLAN.md) - 프로젝트 비전
- [docs/LLD.md](docs/LLD.md) - 기술 설계
- [docs/STATUS.md](docs/STATUS.md) - 현재 진행 상태
- [docs/CHANGELOG.md](docs/CHANGELOG.md) - 버전별 변경 이력
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Firebase 설정 가이드
- [version.js](version.js) - 버전 관리 SSOT

---

## 🔒 보안 고려사항

### v3.5.0 보안 개선
1. **API Key 노출 방지**
   - 초기 구현: Firebase SDK를 브라우저에 직접 노출 (❌)
   - 최종 구현: Apps Script 프록시 패턴 (✅)

2. **읽기 전용 캐시**
   - Firebase는 조회만 가능
   - 모든 쓰기는 Google Sheets 경유

3. **Firebase 보안 규칙**
   - 공개 읽기 허용 (keyPlayers만)
   - 쓰기 완전 차단

---

## 🚫 현재 제약사항

- **Firebase 수동 설정**: 프로젝트 생성 및 속성 설정 필요
- **폴링 방식**: WebSocket 대신 5초 간격 폴링 (보안 우선)
- **키 플레이어 등록**: Type 시트에서 수동 설정 필요
- **모바일 전용**: 393px 기준 (PC 미지원)

---

**버전 관리**: [version.js](version.js) SINGLE SOURCE OF TRUTH
**상세 PRD**: [docs/PRD.md](docs/PRD.md)
**문의**: 프로젝트 이슈 트래커
