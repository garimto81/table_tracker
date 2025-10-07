# STATUS - Poker Tracker

> **현재 상태** | 버전: [version.js](../version.js) 참조

## 📌 현재 위치
**버전**: v2.4.0 (2025-10-07) - [version.js](../version.js)에서 관리
**현재 상태**: ⚠️ **개선 필요** - Phase 1.7 완료, CSS 클래스 중복 이슈 해결 필요

---

## ⚠️ 블로커 (Critical)

### CSS 클래스 중복으로 스마트폰 최적화 미작동
- **문제**: `.flag`, `.chips` 등 클래스가 키 플레이어 뷰와 테이블 뷰에서 중복
- **영향**: 나중 규칙이 둘 다에 적용되어 의도한 크기 차이 무시됨
- **해결**: 클래스명 분리 필요 (`.kp-flag`, `.tv-flag` 등)

### Viewport 기본 폰트 크기 제약
- **문제**: `font-size: clamp(15px, 4.8vw, 20px)` - 최대 20px로 제한
- **영향**: `1.7rem` = 최대 34px (여전히 작음)
- **해결**: 절대 크기(`px`) 직접 사용 또는 최대값 증가

### Flexbox 선택자 오류
- **문제**: `#viewTable .wrap` - HTML에서 `.wrap`이 `#viewTable` 밖에 있음
- **영향**: 테이블 뷰 화면 꽉 채우기 미작동
- **해결**: 선택자 수정 또는 HTML 구조 변경

---

## ✅ 최근 완료 (최신 3개)

### 1. v2.4.0 - 모바일 텍스트 크기 최적화 ✅ 완료
**날짜**: 2025-10-07
**변경사항**:
- ✅ 키 플레이어 뷰 텍스트 100% 확대
- ✅ 테이블 뷰 텍스트 30% 추가 확대
- ✅ 테이블 뷰 9명 화면 높이 꽉 채우기 (flex: 1)
- ✅ 오버레이 텍스트/버튼 대폭 확대 (1.4~1.8rem)
- ✅ 입력 필드/버튼 최소 높이 56px
- ✅ 배포 완료 (@12)

### 2. v2.3.0 - UI/UX 모바일 최적화 ✅ 완료
**날짜**: 2025-10-07
**변경사항**:
- ✅ Key Player Card 2줄 압축
- ✅ Room/Table Info 가독성 개선
- ✅ 칩 시각적 강조 (┃750k┃, ▲▼)
- ✅ [T15 관리] 버튼 제거
- ✅ 배포 완료 (@11)

### 3. v2.2.0 - Poker Room/Table Name 표시 추가 ✅ 완료
**날짜**: 2025-10-07
**변경사항**:
- ✅ Type 시트 A/B열 구조 설계 완료
- ✅ tracker_gs.js: getKeyPlayers()/getTablePlayers() A/B열 읽기 추가
- ✅ tracker_gs.js: addPlayer() A/B열 기본값 자동 입력
- ✅ tracker_gs.js: addPlayer() 후 자동 정렬 (Poker Room → Table Name → Table No. → Seat No.)
- ✅ tracker.html: Key Player Card + Table View 헤더에 Poker Room/Table Name 표시
- ✅ CSS: .roomTableInfo 중앙 정렬 강제 (!important)
- ✅ XSS 방어 강화 (validatePokerRoom_, validateTableName_)
- ✅ 코드 품질 개선 (formatRoomTableInfo 헬퍼 함수, 중복 제거)
- ✅ 배포 완료 (@10)
- ✅ 테스트 완료 (A/B열 자동 입력, 중앙 정렬, 자동 정렬)

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

없음 - Phase 1.7 완료

---

## 📝 AI 메모리

### 마지막 작업
- **v2.4.0 배포**: 모바일 텍스트 크기 최적화 (@12)
- **키 플레이어 뷰**: 텍스트 100% 확대
- **테이블 뷰**: 텍스트 30% 추가 확대 + 화면 꽉 채우기
- **오버레이**: 터치 친화적 크기로 확대 (56px 최소 높이)

### 다음 할 일
1. **CSS 클래스 분리**: `.flag` → `.kp-flag`, `.tv-flag` 등으로 분리
2. **폰트 크기 수정**: `rem` → `px` 직접 사용 또는 `:root` 최대값 증가
3. **Flexbox 수정**: `#viewTable .wrap` 선택자 수정
4. **테스트**: 실제 스마트폰에서 텍스트 크기 확인
5. **다음 Phase**: v2.4.1 - CSS 구조 개선

### 프로젝트 구조
- **Frontend**: [tracker.html](../tracker.html) (v2.4.0, 509줄)
- **Backend**: [tracker_gs.js](../tracker_gs.js) (v2.4.0, 658줄)
- **Spreadsheet**: `19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4` (독립)
- **문서**: [PLAN](PLAN.md) | [PRD](PRD.md) | [LLD](LLD.md)

### 배포 정보
- **Script ID**: `17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O`
- **최신 배포**: @12 (v2.4.0 - Mobile text size optimization)
- **Deployment ID**: `AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA`
- **웹앱 URL**: `https://script.google.com/macros/s/AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA/exec`
- **상태**: ⚠️ 개선 필요 (CSS 클래스 중복 해결 필요)

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
