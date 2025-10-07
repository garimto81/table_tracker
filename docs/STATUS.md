# STATUS - Poker Tracker

> **현재 상태** | 버전: [version.js](../version.js) 참조

## 📌 현재 위치
**버전**: v2.2.0 (2025-10-07) - [version.js](../version.js)에서 관리
**현재 상태**: 🟡 **테스트 필요** - Phase 1.5 코드 작업 완료, 마이그레이션 + 테스트 대기

---

## ⚠️ 블로커 (Critical)

### 1. migrateAddPokerRoomColumns() 함수 실행 필요
**상태**: 🟡 사용자 실행 대기
**내용**: Type 시트 A/B열 추가 (Poker Room, Table Name)
**실행 방법**:
1. Apps Script Editor: https://script.google.com/home/projects/17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O
2. 함수 드롭다운: `migrateAddPokerRoomColumns` 선택
3. 실행 버튼(▶️) 클릭
4. 로그 확인: "✅ Poker Room/Table Name 컬럼 추가 완료"

### 2. 웹앱 테스트 필요
**상태**: 🟡 마이그레이션 후 테스트 대기
**확인 사항**:
- ✅ Key Player Card: "Merit Hall | Ocean Blue | T1" 표시
- ✅ Table View 헤더: "Merit Hall | Ocean Blue | T1" 표시
- ✅ Roboto 12px, 중앙 정렬, 말줄임(...) 처리

---

## ✅ 최근 완료 (최신 3개)

### 1. v2.2.0 - Poker Room/Table Name 표시 추가 (코드 작업 완료)
**날짜**: 2025-10-07
**변경사항**:
- ✅ Type 시트 A/B열 구조 설계 완료
- ✅ tracker_gs.js: getKeyPlayers()/getTablePlayers() A/B열 읽기 추가
- ✅ tracker.html: Key Player Card + Table View 헤더에 Poker Room/Table Name 표시
- ✅ CSS: .roomTableInfo 스타일 추가 (Roboto 12px, 중앙 정렬)
- ✅ 마이그레이션 함수 추가 (migrateAddPokerRoomColumns)
- ✅ XSS 방어 강화 (validatePokerRoom_, validateTableName_)
- ✅ 코드 품질 개선 (formatRoomTableInfo 헬퍼 함수, 중복 제거)
- ✅ 배포 완료 (@8)
- ⚠️ 마이그레이션 실행 + 테스트 대기

### 2. v2.1.0 - Nationality 입력 UX 개선
**날짜**: 2025-10-07
**변경사항**:
- ✅ Nationality 입력 방식 변경 (드롭다운 → 텍스트)
- ✅ 자동 대문자 변환 + 2자 제약
- ✅ 입력 검증 추가 (빈 값 체크)
- ✅ 배포 완료 (@6)

### 3. v2.0.1 - 응답 형식 버그 수정
**날짜**: 2025-10-07
**변경사항**:
- ✅ 클라이언트/서버 응답 형식 불일치 해결
- ✅ tracker.html 5개 함수 응답 처리 수정
- ✅ 에러 핸들링 추가 (response.success 체크)
- ✅ 배포 완료 (@5)

---

## 🚧 진행 중

### Phase 1.5 - Poker Room/Table Name 표시 (30% 완료)
- ✅ 문서 작업 완료 (PLAN, PRD, LLD 업데이트)
- ✅ 코드 작업 완료 (tracker_gs.js, tracker.html 수정)
- ✅ 배포 완료 (@8)
- ⏳ 마이그레이션 실행 대기 (migrateAddPokerRoomColumns)
- ⏳ 웹앱 테스트 대기 (Poker Room/Table Name 표시 확인)

---

## 📝 AI 메모리

### 마지막 작업
- **version.js 생성**: SINGLE SOURCE OF TRUTH 버전 관리 시스템 구축
- **STATUS.md 동기화**: v2.0.2 → v2.2.0 업데이트
- **Phase 1.5 코드 작업 완료**: Poker Room/Table Name 표시 기능 구현
- **배포**: @8 완료 (v2.2.0 - Poker Room/Table Name display final)

### 다음 할 일
1. **마이그레이션**: migrateAddPokerRoomColumns() 실행 (Apps Script Editor)
2. **테스트**: 웹앱에서 Poker Room/Table Name 표시 확인
3. **문서 갱신**: 테스트 완료 후 STATUS.md 블로커 제거, Phase 1.5 완료 처리
4. **다음 Phase**: v2.3.0 - 키 플레이어 테이블 이동 기능 (Phase 2.1)

### 프로젝트 구조
- **Frontend**: [tracker.html](../tracker.html) (v1.5, 461줄)
- **Backend**: [tracker_gs.js](../tracker_gs.js) (v2.0.2, 658줄)
- **Spreadsheet**: `19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4` (독립)
- **문서**: [PLAN](PLAN.md) | [PRD](PRD.md) | [LLD](LLD.md)

### 배포 정보
- **Script ID**: `17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O`
- **최신 배포**: @8 (v2.2.0 - Poker Room/Table Name display final)
- **Deployment ID**: `AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA`
- **웹앱 URL**: `https://script.google.com/macros/s/AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA/exec`
- **상태**: 🟡 테스트 필요 (Phase 1.5 코드 완료, 마이그레이션 대기)

### 핵심 기능
1. **Key Player View**: 키 플레이어 목록 + 칩 변화량
2. **Table View**: 테이블별 9좌석 플레이어 관리
3. **CRUD 작업**: 칩 수정, 플레이어 추가/삭제
4. **국가 선택기**: 42개국 지원, 검색/필터
5. **Stats Bar**: 총 칩/평균/인원 통계

### 독립성
- ✅ HandLogger 완전 분리
- ✅ 자체 스프레드시트 운영
- ✅ 별도 웹앱 배포 (doGet 진입점)

### 기술 스택
- **Frontend**: HTML + Vanilla JS (라이브러리 없음)
- **Backend**: Google Apps Script
- **Data**: Google Sheets (Type 시트)
- **Storage**: localStorage (칩 변화량 추적)

---

## 🔗 관련 문서

- [PLAN.md](PLAN.md) - 프로젝트 비전 (페르소나/시나리오)
- [PRD.md](PRD.md) - 작업 목록 (Phase 1~3)
- [LLD.md](LLD.md) - 기술 설계 (AI 인덱스)
- [CHANGELOG.md](CHANGELOG.md) - 버전별 변경 이력
