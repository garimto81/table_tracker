# v3.0.0 배포 가이드

> **배포 대상**: Google Apps Script 웹앱
> **변경 버전**: v2.4.0 → v3.0.0
> **배포일**: 2025-10-12

---

## 🎯 배포 방법

### 방법 1: Google Apps Script 에디터에서 직접 복사/붙여넣기 ⭐ 추천

#### Step 1: Apps Script 에디터 열기
1. Google Drive 접속
2. 기존 Apps Script 프로젝트 열기
   - Script ID: `17reWlyDY3W3aBsK9VYTnJ1C3iXnWhmzxOHJ-_s54S9QYje3COrwId38O`

#### Step 2: 파일 업데이트

**tracker_gs.js 업데이트**:
1. Apps Script 에디터에서 `tracker_gs.js` 파일 열기
2. 로컬 파일 `d:\AI\claude01\table_tracker\tracker_gs.js` 전체 내용 복사
3. Apps Script 에디터에 붙여넣기 (전체 교체)
4. **Ctrl + S** 저장

**tracker.html 업데이트**:
1. Apps Script 에디터에서 `tracker.html` 파일 열기
2. 로컬 파일 `d:\AI\claude01\table_tracker\tracker.html` 전체 내용 복사
3. Apps Script 에디터에 붙여넣기 (전체 교체)
4. **Ctrl + S** 저장

**version.js 업데이트** (선택사항):
1. Apps Script 에디터에서 `version.js` 파일 열기 (없으면 생략)
2. 로컬 파일 `d:\AI\claude01\table_tracker\version.js` 전체 내용 복사
3. Apps Script 에디터에 붙여넣기
4. **Ctrl + S** 저장

#### Step 3: 웹앱 재배포

1. Apps Script 에디터 우측 상단 **[배포]** → **[배포 관리]** 클릭
2. 기존 배포 선택 (현재 @12)
3. **[수정]** 버튼 클릭
4. **[버전]**: "새 버전" 선택
5. **[설명]**: "v3.0.0 - Seats.csv structure migration" 입력
6. **[배포]** 클릭
7. 새 배포 ID 확인 (예: @13)

#### Step 4: 웹앱 테스트

1. 배포된 웹앱 URL 접속:
   ```
   https://script.google.com/macros/s/AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA/exec
   ```

2. **브라우저 강제 새로고침**: **Ctrl + Shift + R** (Windows) 또는 **Cmd + Shift + R** (Mac)

3. 테스트 체크리스트:
   - [ ] Key Player View 로딩 성공
   - [ ] "T15" 형식 표시 확인
   - [ ] "S3" 형식 표시 확인
   - [ ] 플레이어 이름, 국적, 칩 정상 표시
   - [ ] 테이블 클릭 → Table View 이동
   - [ ] 칩 수정 테스트
   - [ ] 플레이어 추가 테스트 (11개 컬럼 확인)
   - [ ] 플레이어 삭제 테스트

---

### 방법 2: clasp CLI 사용 (선택사항)

#### 사전 준비: clasp 설치

```bash
# Node.js 설치 확인
node --version

# clasp 설치
npm install -g @google/clasp

# Google 계정 로그인
clasp login
```

#### 배포 명령

```bash
cd "d:\AI\claude01\table_tracker"

# 1. 코드 업로드
clasp push

# 2. 배포 ID 확인
clasp deployments

# 3. 기존 배포 업데이트
clasp deploy -i AKfycbzUVHRBgM30-pGruySbzz4uWHuG1YhPN9pyKwuku5azdPD8y2QNKnk63DNCP4hzpBeitA -d "v3.0.0 - Seats.csv structure migration"
```

---

## ✅ 배포 후 확인사항

### 1. Type 시트 구조 확인

Google Sheets에서 Type 시트 열기:
```
https://docs.google.com/spreadsheets/d/19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4/edit
```

**헤더 확인** (11개 컬럼):
```
A: PokerRoom
B: TableName
C: TableId
D: TableNo (숫자)
E: SeatId
F: SeatNo (숫자)
G: PlayerId
H: PlayerName
I: Nationality
J: ChipCount
K: Keyplayer
```

### 2. 데이터 샘플 확인

**TableNo/SeatNo가 숫자형인지 확인**:
- TableNo: 15 (숫자) ✅
- SeatNo: 3 (숫자) ✅

**잘못된 경우** (문자열):
- TableNo: "T15" ❌
- SeatNo: "S3" ❌

### 3. 웹앱 기능 테스트

#### Test 1: Key Player View
- [ ] getKeyPlayers() 호출 성공
- [ ] "T15" 형식 표시
- [ ] PlayerName, Nationality, ChipCount 표시

#### Test 2: Table View
- [ ] getTablePlayers(15) 호출 성공 (숫자 파라미터)
- [ ] "S3" 형식 표시
- [ ] 9개 좌석 정상 표시

#### Test 3: 칩 수정
- [ ] editChips(15, 3, 50000) 호출
- [ ] Type 시트 ChipCount 컬럼 업데이트 확인

#### Test 4: 플레이어 추가
- [ ] addPlayer(15, 3, "Test Player", "KR", 40000, false)
- [ ] Type 시트에 11개 컬럼 입력 확인
- [ ] TableId, SeatId, PlayerId = 0 (기본값)

#### Test 5: 플레이어 삭제
- [ ] removePlayer(15, 3)
- [ ] Type 시트에서 행 삭제 확인

---

## 🚨 문제 해결

### 문제 1: "TypeError: players.forEach is not a function"

**원인**: 브라우저 캐시에 이전 버전 코드
**해결**: **Ctrl + Shift + R** (강제 새로고침)

---

### 문제 2: "플레이어를 찾을 수 없습니다"

**원인**: TableNo/SeatNo가 문자열로 저장됨
**해결**:
1. Type 시트에서 TableNo/SeatNo 컬럼 선택
2. 문자열 "T15" → 숫자 15로 변환
3. 문자열 "S3" → 숫자 3으로 변환

---

### 문제 3: 플레이어 추가 시 "필수 컬럼이 없습니다"

**원인**: Type 시트 헤더가 v3.0.0 구조가 아님
**해결**:
1. Type 시트 헤더 확인
2. 11개 컬럼으로 변경:
   ```
   PokerRoom, TableName, TableId, TableNo, SeatId, SeatNo, PlayerId, PlayerName, Nationality, ChipCount, Keyplayer
   ```

---

## 📊 버전 정보

- **이전 버전**: v2.4.0 (8 컬럼)
- **현재 버전**: v3.0.0 (11 컬럼)
- **배포 ID**: @12 → @13 (예상)
- **배포 설명**: "v3.0.0 - Seats.csv structure migration"

---

## 📝 롤백 방법 (문제 발생 시)

### Step 1: 이전 배포 버전으로 복원

1. Apps Script 에디터 → **[배포]** → **[배포 관리]**
2. 이전 배포 (@12) 선택
3. **[활성]** 버튼 클릭

### Step 2: Type 시트 백업에서 복원

1. Google Sheets에서 Type 시트 백업 찾기
   - 이름: `Type_Backup_v2.4.0_YYYYMMDD_HHMMSS`
2. 백업 시트 → 복사 → Type 시트에 붙여넣기

---

**작성일**: 2025-10-12
**작성자**: Claude AI
**관련 문서**: [MIGRATION_SEATS_ONLY.md](docs/MIGRATION_SEATS_ONLY.md), [CHANGELOG.md](docs/CHANGELOG.md)
