# PRD - Poker Hand Logger

## 📋 프로젝트 개요
**버전**: v1.1.1 (2025-10-02)
**목적**: 포커 핸드 실시간 기록 및 리뷰 시스템
**플랫폼**: Google Apps Script + Web App (모바일 최적화)

## 🎯 핵심 목표
1. **실시간 핸드 기록**: 포커 게임 진행 중 액션/보드/결과 즉시 기록
2. **외부 시트 연동**: VIRTUAL 시트 자동 갱신 (파일명/히스토리/상태)
3. **데이터 리뷰**: 저장된 핸드 조회 및 상세 분석
4. **모바일 우선**: 터치 최적화 UI, 반응형 디자인

## 👥 주요 사용자
- **딜러/기록자**: 실시간 핸드 입력
- **분석가**: 히스토리 데이터 조회/분석
- **프로듀서**: 외부 시트 연동 및 자막 생성

## 🔑 핵심 기능

### 1. Record Mode (핸드 기록)
#### 1.1 테이블/플레이어 설정
- **테이블 선택**: Type 시트에서 테이블 목록 로드
- **참여자 선택**: 좌석별 토글 (비참여자 제외)
- **BTN 지정**: 이전 BTN 자동 복원
- **스택 입력**: 좌석별 시작 스택 (선택)

#### 1.2 핸드 정보 입력
- **시작 스트릿**: Preflop/Flop/Turn/River 고정 선택
- **핸드 번호**: 자동 부여 또는 수동 입력
- **선 누적 팟**: pre_pot 입력 (선택)
- **홀카드 선택**: 좌석별 2장 선택 (오버레이 UI)

#### 1.3 액션 기록
- **턴 기반 시스템**: 현재 차례 좌석 자동 표시
- **액션 버튼**: CHECK/CALL/BET/RAISE/FOLD/ALLIN
- **금액 입력**: BET/RAISE/ALLIN 시 프롬프트
- **실시간 계산**:
  - toCall: 현재 콜 금액 자동 계산
  - pot: 누적 팟 실시간 업데이트
  - contrib: 좌석별 기여액 추적

#### 1.4 보드 카드 선택
- **카드 토글**: A→2 / ♠→♥→♦→♣ 그리드
- **5장 제한**: 최대 5장 선택 (Flop 3 + Turn + River)
- **중복 방지**: 보드↔홀카드 간 중복 차단 (단방향)
- **재탭 해제**: 선택 카드 재클릭 시 선택 해제

#### 1.5 스트릿 진행
- **자동 전환**: 액션 완료 시 다음 스트릿 자동 이동
  - Preflop → Flop → Turn → River
- **턴 순서 재계산**: 스트릿별 BTN 기준 순서 재정렬
- **Undo 기능**: 마지막 액션 되돌리기

#### 1.6 데이터 전송 (커밋)
- **멱등성 보장**: client_uuid + started_at 중복 방지
- **외부 시트 갱신**:
  - VIRTUAL 시트 C열(Time) 기준 행 매칭
  - E열: "미완료" 상태
  - F열: 파일명 (예: VT12_JDoe_AhKs_vs_JSmith_QdQc)
  - G열: "A" 고정
  - H열: 3줄 요약 (참가자/보드/팟)
  - J열: 공란 (승자 제거)

### 2. Review Mode (핸드 리뷰)
#### 2.1 핸드 목록
- **최신순 정렬**: started_at 기준 내림차순
- **페이징**: 기본 50건
- **요약 정보**: 핸드번호/테이블/BTN/보드/시간

#### 2.2 핸드 상세
- **기본 정보**: hand_id, table_id, btn_seat, start_street
- **보드 배지**: 카드별 컬러 코딩 (♠검정/♥빨강/♦파랑/♣초록)
- **스택 스냅샷**: 시작 스트릿 기준 스택
- **홀카드**: 좌석별 2장 표시
- **액션 히스토리**: 스트릿별 그룹핑 + 배지 표시

### 3. 외부 연동 기능
#### 3.1 External Sheet ID 설정
- **시트 ID 저장**: localStorage 영구 저장
- **BB 설정**: Big Blind 금액 (팟 BB 환산용)

#### 3.2 VIRTUAL 시트 갱신
- **C열 파싱 (v1.1.1 개선)**:
  - Date 객체: getHours/getMinutes/getSeconds
  - 숫자(0~1): 하루 분수 → 초 환산
  - 문자열: "HH:mm(:ss)" 정규식 파싱
- **행 선택 로직**:
  - 현재 KST 시각 이하 중 가장 최근 행 (아래→위 검색)
  - rowTime <= nowKST 조건
- **비연속 컬럼 쓰기**: E(5), F(6), G(7), H(8), J(10)

### 4. 설정/구성 관리
#### 4.1 CONFIG 시트
- **BTN 추적**: 테이블별 마지막 BTN 저장/복원
- **hand_seq 자동 증가**: 테이블별 핸드 번호 시퀀스
- **reset 기능**: 특정 테이블 시퀀스 초기화

#### 4.2 ROSTER 연동
- **Type 시트 파싱**:
  - TableNo/SeatNo/Player/Nationality/Chips 컬럼
  - 다중 별칭 지원 (예: "Table No.", "TableNo", "Table_Number")
- **플레이어 정보 자동 로드**: 테이블 선택 시 좌석별 정보 표시

## 📊 데이터 스키마

### HANDS 시트
| 컬럼 | 타입 | 설명 |
|------|------|------|
| hand_id | String | 고유 핸드 ID (yyyyMMdd_HHmmssSSS) |
| client_uuid | String | 멱등성 체크용 UUID |
| table_id | String | 테이블 번호 |
| hand_no | String | 핸드 번호 (자동/수동) |
| start_street | String | 시작 스트릿 |
| started_at | ISO8601 | 핸드 시작 시각 |
| ended_at | String | 핸드 종료 시각 (선택) |
| btn_seat | String | BTN 좌석 |
| board_f1~f3 | String | Flop 카드 (f1,f2,f3) |
| board_turn | String | Turn 카드 |
| board_river | String | River 카드 |
| pre_pot | Number | 선 누적 팟 |
| winner_seat | String | **v1.1 제거: 공란** |
| pot_final | String | 최종 팟 |
| stacks_json | JSON | 좌석별 시작 스택 |
| holes_json | JSON | 좌석별 홀카드 |
| schema_ver | String | 스키마 버전 (v1.1.1) |

### ACTIONS 시트
| 컬럼 | 타입 | 설명 |
|------|------|------|
| hand_id | String | 핸드 외래키 |
| seq | Number | 액션 순서 |
| street | String | 스트릿 (PREFLOP/FLOP/TURN/RIVER) |
| seat | String | 좌석 번호 |
| action | String | CHECK/CALL/BET/RAISE/FOLD/ALLIN |
| amount_input | Number | 입력 금액 |
| to_call_after | Number | 액션 후 toCall |
| contrib_after_seat | Number | 액션 후 좌석 기여액 |
| pot_after | Number | 액션 후 팟 |
| note | String | 메모 (선택) |

## 🚀 비기능 요구사항

### 성능
- **스크립트 락**: 500ms 대기 + 3회 재시도 (150ms backoff)
- **외부 쓰기 최적화**: 비연속 컬럼 개별 setValue (배치 금지)
- **로그 최소화**: 핵심 이벤트만 LOG 시트 기록

### UX
- **모바일 우선**: 28px 루트 폰트, 터치 친화적 버튼 크기
- **다크 테마**: --bg:#0b0d12, --panel:#101522
- **즉시 피드백**: 커밋/설정 저장 시 메시지 표시
- **오류 처리**: 사용자 친화적 오류 메시지 + 재시도 안내

### 보안/안정성
- **멱등성**: 중복 제출 방지 (client_uuid + started_at)
- **락 관리**: 동시 쓰기 충돌 방지 (LockService)
- **오류 격리**: 외부 시트 실패 시에도 HANDS/ACTIONS 저장 성공

## 🔄 v1.1.1 변경 사항
### C열 파싱 개선
- **혼합 데이터 지원**: Date/숫자/문자열 자동 감지
- **정규화**: HH:mm(:ss) 포맷으로 통일
- **KST 비교**: 오늘 날짜 기준 시각 비교

### 승자 판정 제거
- **J열 공란**: winner_seat 로직 완전 제거
- **외부 시트**: J열에 빈 문자열 쓰기

### 로그 강화
- **EXT_PICKROW**: 선택된 행 번호 + 현재 시각 기록
- **EXT_VALUES**: E/F/G/H/J 컬럼 값 요약 기록

## 📝 제약사항
- **BTN만 지원**: SB/BB 구분 없음
- **사이드팟 없음**: 자동 계산 미지원 (수동 입력)
- **보드 미완성 허용**: 5장 미만 보드 저장 가능
- **ALLIN 금액 수동**: 스택 기반 자동 계산 옵션 제공

## 🎯 성공 지표
1. **기록 정확도**: 액션/팟 계산 오류 0건
2. **외부 연동 성공률**: 95% 이상
3. **모바일 UX**: 터치 조작 3초 이내 완료
4. **데이터 무결성**: 멱등성 100% 보장
