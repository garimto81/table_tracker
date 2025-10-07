/** tracker_realtime.gs — Poker Tracker
 *
 * ⚠️ VERSION MANAGEMENT:
 * 버전 정보는 version.js에서 관리합니다.
 * 이 파일의 버전을 직접 수정하지 마세요.
 *
 * 현재 버전: version.js에서 자동 로드
 * 변경 이력: docs/CHANGELOG.md 참조
 *
 * @see version.js - SINGLE SOURCE OF TRUTH for version info
 * @see docs/CHANGELOG.md - Full version history
 */

/* ===== 버전 관리 ===== */
// version.js에서 버전 정보 로드 (Google Apps Script 환경)
let TRACKER_VERSION = 'v2.2.0'; // Fallback version
try {
  // version.js가 같은 프로젝트에 있다면 로드 시도
  // Google Apps Script는 require() 미지원이므로 수동 동기화 필요
  TRACKER_VERSION = 'v2.2.0'; // version.js의 VERSION.current와 수동 동기화
} catch (e) {
  Logger.log('version.js 로드 실패, fallback 버전 사용: ' + TRACKER_VERSION);
}

/* ===== 설정 ===== */
const TYPE_SHEET_NAME = 'Type';
const MAX_SEATS_PER_TABLE = 9;
const CACHE_TTL = 1000; // 1초
const MAX_LOCK_WAIT = 10000; // 10초

/* ===== 로깅 ===== */
const LOG_LEVEL = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
const CURRENT_LOG_LEVEL = LOG_LEVEL.INFO;

function log_(level, functionName, message, data = null) {
  if (level > CURRENT_LOG_LEVEL) return;

  const timestamp = new Date().toISOString();
  const levelName = Object.keys(LOG_LEVEL).find(k => LOG_LEVEL[k] === level);

  let logMsg = `[${timestamp}] [${levelName}] ${functionName}: ${message}`;
  if (data) logMsg += ` | ${JSON.stringify(data)}`;

  console.log(logMsg);
}

/* ===== 설정 관리 ===== */
const APP_SPREADSHEET_ID = '19e7eDjoZRFZooghZJF3XmOZzZcgmqsp9mFAfjvJWhj4';

function setupSpreadsheetId(spreadsheetId) {
  // 상수로 관리하므로 설정 불필요
  log_(LOG_LEVEL.INFO, 'setupSpreadsheetId', 'APP_SPREADSHEET_ID 상수 사용 중');
  return APP_SPREADSHEET_ID;
}

function getSpreadsheetId_() {
  return APP_SPREADSHEET_ID;
}

function appSS_() {
  return SpreadsheetApp.openById(APP_SPREADSHEET_ID);
}

/* ===== 입력 검증 ===== */
function validateTableId_(tableId) {
  const id = String(tableId || '').trim();

  if (!id) throw new Error('테이블 ID가 비어있습니다.');
  if (id.length > 50) throw new Error('테이블 ID가 너무 깁니다. (최대 50자)');
  if (!/^[A-Z0-9_-]+$/i.test(id)) {
    throw new Error('테이블 ID는 영문, 숫자, -, _ 만 사용 가능합니다.');
  }

  return id.toUpperCase();
}

function validateSeatNo_(seatNo) {
  const seat = normalizeSeat_(seatNo);

  if (!/^S[1-9]$/.test(seat)) {
    throw new Error('좌석 번호는 S1-S9 형식이어야 합니다.');
  }

  return seat;
}

function validatePlayerName_(name) {
  const n = String(name || '').trim();

  if (!n) throw new Error('플레이어 이름이 비어있습니다.');
  if (n.length > 100) throw new Error('플레이어 이름이 너무 깁니다. (최대 100자)');

  // XSS 방지
  const sanitized = n.replace(/<[^>]*>/g, '');

  return sanitized;
}

/**
 * Poker Room 이름 검증
 * @param {string} room - 검증할 Poker Room 이름
 * @return {string} 정제된 Poker Room 이름
 */
function validatePokerRoom_(room) {
  const r = String(room || '').trim();
  if (r.length > 50) {
    throw new Error('Poker Room 이름이 너무 깁니다 (최대 50자)');
  }
  // HTML 태그 제거 (XSS 방지)
  return r.replace(/<[^>]*>/g, '');
}

/**
 * Table Name 검증
 * @param {string} name - 검증할 Table Name
 * @return {string} 정제된 Table Name
 */
function validateTableName_(name) {
  const n = String(name || '').trim();
  if (n.length > 50) {
    throw new Error('Table Name이 너무 깁니다 (최대 50자)');
  }
  // HTML 태그 제거 (XSS 방지)
  return n.replace(/<[^>]*>/g, '');
}

function validateChips_(chips) {
  const c = toInt_(chips);

  if (c < 0) throw new Error('칩 수는 음수일 수 없습니다.');
  if (c > 10000000000) throw new Error('칩 수가 너무 큽니다.');

  return c;
}

function normalizeSeat_(seatNo) {
  let seat = String(seatNo || '').trim().toUpperCase();
  seat = seat.replace(/^S/i, '');

  if (/^\d+$/.test(seat)) {
    return 'S' + seat;
  }

  return 'S' + seat;
}

function normalizeSeatRaw_(seatNo) {
  return String(seatNo || '').trim().replace(/^S/i, '');
}

function toInt_(v) {
  if (v == null) return 0;
  const s = String(v).replace(/[^\d-]/g, '').trim();
  if (!s) return 0;
  const n = parseInt(s, 10);
  return isNaN(n) ? 0 : n;
}

/* ===== 동시성 제어 ===== */
function withScriptLock_(fn) {
  const L = LockService.getScriptLock();
  const MAX_ATTEMPTS = 3;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      const waitTime = MAX_LOCK_WAIT * (i + 1);
      L.waitLock(waitTime);

      try {
        return fn();
      } finally {
        try { L.releaseLock(); }
        catch (e) { log_(LOG_LEVEL.WARN, 'withScriptLock_', 'Lock 해제 실패', e); }
      }

    } catch (e) {
      const backoff = 200 + 300 * i;
      Utilities.sleep(backoff);

      if (i === MAX_ATTEMPTS - 1) {
        throw new Error(`동시 접근 제한: 잠시 후 다시 시도하세요.`);
      }
    }
  }
}

/* ===== 캐싱 ===== */
let sheetCache = null;
let cacheTimestamp = 0;

function getSheetData_(forceRefresh = false) {
  const now = Date.now();

  // 캐시 유효
  if (!forceRefresh && sheetCache && (now - cacheTimestamp < CACHE_TTL)) {
    return sheetCache;
  }

  // 새로 읽기
  const ss = appSS_();
  const sh = ss.getSheetByName(TYPE_SHEET_NAME);
  if (!sh) throw new Error('Type 시트가 없습니다.');

  const data = readAll_Optimized_(sh);

  const cols = {
    pokerRoom: findColIndex_(data.header, ['Poker Room', 'PokerRoom', 'poker_room']),
    tableName: findColIndex_(data.header, ['Table Name', 'TableName', 'table_name']),
    table: findColIndex_(data.header, ['Table No.', 'TableNo', 'table_no']),
    seat: findColIndex_(data.header, ['Seat No.', 'Seat', 'SeatNo', 'seat_no']),
    player: findColIndex_(data.header, ['Players', 'Player', 'Name']),
    nation: findColIndex_(data.header, ['Nationality', 'Nation', 'Country']),
    chips: findColIndex_(data.header, ['Chips', 'Stack', 'Starting Chips']),
    key: findColIndex_(data.header, ['Keyplayer', 'Key Player', 'KeyPlayer', 'key_player'])
  };

  if (cols.table === -1 || cols.seat === -1 || cols.player === -1) {
    throw new Error('Type 시트에 필수 컬럼이 없습니다.');
  }

  sheetCache = { sh, data, cols };
  cacheTimestamp = now;

  return sheetCache;
}

function invalidateCache_() {
  sheetCache = null;
}

/* ===== 최적화된 시트 읽기 ===== */
function readAll_Optimized_(sh) {
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();

  if (lastRow < 1 || lastCol < 1) {
    return { header: [], rows: [], map: {} };
  }

  const values = sh.getRange(1, 1, lastRow, lastCol).getValues();

  if (values.length < 2) {
    return { header: values[0] || [], rows: [], map: {} };
  }

  const header = values[0];
  const rows = values.slice(1);
  const map = {};
  header.forEach((h, i) => map[String(h).trim()] = i);

  return { header, rows, map };
}

function findColIndex_(headerRow, aliases) {
  return headerRow.findIndex(h =>
    aliases.some(a => String(h).trim().toLowerCase() === a.toLowerCase())
  );
}

/* ===== 공통 헬퍼 ===== */
function findPlayerRow_(data, cols, tableId, seatNo) {
  const tableUpper = String(tableId).trim().toUpperCase();
  const seatRaw = normalizeSeatRaw_(seatNo);

  return data.rows.findIndex(r => {
    const tableMatch = String(r[cols.table]).trim().toUpperCase() === tableUpper;
    const seatStr = normalizeSeatRaw_(r[cols.seat]);
    const seatMatch = seatStr === seatRaw;
    return tableMatch && seatMatch;
  });
}

/* ===== 표준 응답 ===== */
function successResponse_(data = {}) {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: TRACKER_VERSION
    }
  };
}

function errorResponse_(functionName, error) {
  const errorId = Utilities.getUuid();

  log_(LOG_LEVEL.ERROR, functionName, error.message || error, { errorId });

  return {
    success: false,
    error: {
      message: error.message || '알 수 없는 오류가 발생했습니다.',
      errorId
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: TRACKER_VERSION
    }
  };
}

/* ===== 읽기 함수 ===== */

/**
 * 키 플레이어 목록 반환
 */
function getKeyPlayers() {
  try {
    log_(LOG_LEVEL.INFO, 'getKeyPlayers', '키 플레이어 조회 시작');

    const { data, cols } = getSheetData_();

    const players = data.rows
      .filter(row => {
        const isKey = cols.key !== -1 && (
          row[cols.key] === true ||
          String(row[cols.key]).toUpperCase() === 'TRUE'
        );
        return isKey;
      })
      .map(row => {
        let seatNo = String(row[cols.seat] || '').trim();
        if (/^\d+$/.test(seatNo)) seatNo = 'S' + seatNo;

        return {
          pokerRoom: cols.pokerRoom !== -1 ? validatePokerRoom_(row[cols.pokerRoom]) : '',
          tableName: cols.tableName !== -1 ? validateTableName_(row[cols.tableName]) : '',
          tableNo: String(row[cols.table] || '').trim(),
          seatNo,
          player: String(row[cols.player] || '').trim(),
          nation: cols.nation !== -1 ? String(row[cols.nation] || '').trim() : '',
          chips: cols.chips !== -1 ? toInt_(row[cols.chips]) : 0
        };
      })
      .filter(p => p.tableNo && p.seatNo && p.player);

    log_(LOG_LEVEL.INFO, 'getKeyPlayers', '키 플레이어 조회 완료', { count: players.length });

    return successResponse_({ players, count: players.length });

  } catch (e) {
    return errorResponse_('getKeyPlayers', e);
  }
}

/**
 * 테이블 플레이어 목록 반환
 */
function getTablePlayers(tableId) {
  try {
    log_(LOG_LEVEL.INFO, 'getTablePlayers', '테이블 플레이어 조회 시작', { tableId });

    const validTableId = validateTableId_(tableId);
    const { data, cols } = getSheetData_();

    const playersMap = {};

    data.rows.forEach(row => {
      const t = String(row[cols.table] || '').trim().toUpperCase();
      if (t !== validTableId) return;

      let seatNo = String(row[cols.seat] || '').trim().toUpperCase();
      if (/^\d+$/.test(seatNo)) seatNo = 'S' + seatNo;

      const player = String(row[cols.player] || '').trim();
      const nation = cols.nation !== -1 ? String(row[cols.nation] || '').trim() : '';
      const chips = cols.chips !== -1 ? toInt_(row[cols.chips]) : 0;
      const keyplayer = cols.key !== -1 && (
        row[cols.key] === true ||
        String(row[cols.key]).toUpperCase() === 'TRUE'
      );

      if (seatNo && player) {
        const pokerRoom = cols.pokerRoom !== -1 ? validatePokerRoom_(row[cols.pokerRoom]) : '';
        const tableName = cols.tableName !== -1 ? validateTableName_(row[cols.tableName]) : '';
        playersMap[seatNo] = { pokerRoom, tableName, tableNo: validTableId, seatNo, player, nation, chips, keyplayer };
      }
    });

    const players = [];
    for (let i = 1; i <= MAX_SEATS_PER_TABLE; i++) {
      const seat = `S${i}`;
      if (playersMap[seat]) {
        players.push(playersMap[seat]);
      } else {
        players.push({ tableNo: validTableId, seatNo: seat, empty: true });
      }
    }

    log_(LOG_LEVEL.INFO, 'getTablePlayers', '테이블 플레이어 조회 완료', { tableId, count: players.length });

    return successResponse_({ players, count: players.length });

  } catch (e) {
    return errorResponse_('getTablePlayers', e);
  }
}

/* ===== 쓰기 함수 ===== */

/**
 * 플레이어 칩 수정
 */
function updatePlayerChips(tableId, seatNo, newChips) {
  return withScriptLock_(() => {
    try {
      log_(LOG_LEVEL.INFO, 'updatePlayerChips', '칩 업데이트 시작', { tableId, seatNo, newChips });

      const validTableId = validateTableId_(tableId);
      const validSeatNo = validateSeatNo_(seatNo);
      const validChips = validateChips_(newChips);

      const { sh, data, cols } = getSheetData_(true);

      const rowIndex = findPlayerRow_(data, cols, validTableId, validSeatNo);

      if (rowIndex === -1) {
        throw new Error('플레이어를 찾을 수 없습니다.');
      }

      const actualRow = rowIndex + 2;
      sh.getRange(actualRow, cols.chips + 1).setValue(validChips);

      invalidateCache_();

      log_(LOG_LEVEL.INFO, 'updatePlayerChips', '칩 업데이트 완료');

      return successResponse_();

    } catch (e) {
      return errorResponse_('updatePlayerChips', e);
    }
  });
}

/**
 * 플레이어 추가
 */
function addPlayer(tableId, seatNo, name, nation, chips, isKey) {
  return withScriptLock_(() => {
    try {
      log_(LOG_LEVEL.INFO, 'addPlayer', '플레이어 추가 시작', { tableId, seatNo, name });

      const validTableId = validateTableId_(tableId);
      const validSeatNo = validateSeatNo_(seatNo);
      const validName = validatePlayerName_(name);
      const validChips = validateChips_(chips);

      const { sh, data, cols } = getSheetData_(true);

      const exists = findPlayerRow_(data, cols, validTableId, validSeatNo) !== -1;
      if (exists) {
        throw new Error('해당 좌석에 이미 플레이어가 있습니다.');
      }

      const row = new Array(data.header.length).fill('');
      // A/B열: Poker Room/Table Name 기본값 설정
      if (cols.pokerRoom !== -1) row[cols.pokerRoom] = 'Merit Hall';
      if (cols.tableName !== -1) row[cols.tableName] = 'Ocean Blue';
      // 기존 컬럼
      row[cols.table] = validTableId;
      row[cols.seat] = normalizeSeatRaw_(validSeatNo);
      if (cols.player !== -1) row[cols.player] = validName;
      if (cols.nation !== -1) row[cols.nation] = nation || '';
      if (cols.chips !== -1) row[cols.chips] = validChips;
      if (cols.key !== -1) row[cols.key] = Boolean(isKey);

      sh.appendRow(row);

      // 자동 정렬: Poker Room → Table Name → Table No. → Seat No. 순서
      const lastRow = sh.getLastRow();
      if (lastRow > 1) {
        const sortRange = sh.getRange(2, 1, lastRow - 1, sh.getLastColumn());
        sortRange.sort([
          {column: 1, ascending: true},  // A열: Poker Room
          {column: 2, ascending: true},  // B열: Table Name
          {column: 3, ascending: true},  // C열: Table No.
          {column: 4, ascending: true}   // D열: Seat No.
        ]);
      }

      invalidateCache_();

      log_(LOG_LEVEL.INFO, 'addPlayer', '플레이어 추가 완료');

      return successResponse_();

    } catch (e) {
      return errorResponse_('addPlayer', e);
    }
  });
}

/**
 * 플레이어 삭제
 */
function removePlayer(tableId, seatNo) {
  return withScriptLock_(() => {
    try {
      log_(LOG_LEVEL.INFO, 'removePlayer', '플레이어 삭제 시작', { tableId, seatNo });

      const validTableId = validateTableId_(tableId);
      const validSeatNo = validateSeatNo_(seatNo);

      const { sh, data, cols } = getSheetData_(true);

      const rowIndex = findPlayerRow_(data, cols, validTableId, validSeatNo);

      if (rowIndex === -1) {
        throw new Error('플레이어를 찾을 수 없습니다.');
      }

      const actualRow = rowIndex + 2;
      sh.deleteRow(actualRow);

      invalidateCache_();

      log_(LOG_LEVEL.INFO, 'removePlayer', '플레이어 삭제 완료');

      return successResponse_();

    } catch (e) {
      return errorResponse_('removePlayer', e);
    }
  });
}

/**
 * 배치 칩 업데이트 (최적화)
 */
function batchUpdateChips(updates) {
  return withScriptLock_(() => {
    try {
      log_(LOG_LEVEL.INFO, 'batchUpdateChips', '배치 업데이트 시작', { count: updates.length });

      if (!Array.isArray(updates) || updates.length === 0) {
        throw new Error('업데이트 목록이 비어있습니다.');
      }

      const { sh, data, cols } = getSheetData_(true);

      // 업데이트 대상 수집
      const updateMap = new Map();

      updates.forEach(u => {
        const validTableId = validateTableId_(u.tableId);
        const validSeatNo = validateSeatNo_(u.seatNo);
        const validChips = validateChips_(u.chips);

        const rowIndex = findPlayerRow_(data, cols, validTableId, validSeatNo);

        if (rowIndex !== -1) {
          const actualRow = rowIndex + 2;
          updateMap.set(actualRow, validChips);
        }
      });

      if (updateMap.size === 0) {
        return successResponse_({ updated: 0 });
      }

      // 연속 범위 병합
      const rows = Array.from(updateMap.keys()).sort((a, b) => a - b);
      const ranges = [];
      let start = rows[0];
      let end = rows[0];
      let values = [[updateMap.get(start)]];

      for (let i = 1; i < rows.length; i++) {
        if (rows[i] === end + 1) {
          end = rows[i];
          values.push([updateMap.get(rows[i])]);
        } else {
          ranges.push({
            range: sh.getRange(start, cols.chips + 1, end - start + 1, 1),
            values
          });
          start = rows[i];
          end = rows[i];
          values = [[updateMap.get(rows[i])]];
        }
      }

      ranges.push({
        range: sh.getRange(start, cols.chips + 1, end - start + 1, 1),
        values
      });

      // 배치 업데이트
      ranges.forEach(r => r.range.setValues(r.values));

      invalidateCache_();

      log_(LOG_LEVEL.INFO, 'batchUpdateChips', '배치 업데이트 완료', { updated: updateMap.size });

      return successResponse_({ updated: updateMap.size });

    } catch (e) {
      return errorResponse_('batchUpdateChips', e);
    }
  });
}

/* ===== 데이터 무결성 검증 ===== */

function validateSheetIntegrity() {
  try {
    const { data, cols } = getSheetData_(true);

    const errors = [];
    const seen = new Set();

    data.rows.forEach((row, idx) => {
      const rowNum = idx + 2;

      // 필수 필드
      if (!row[cols.table]) errors.push(`행 ${rowNum}: 테이블 번호 누락`);
      if (!row[cols.seat]) errors.push(`행 ${rowNum}: 좌석 번호 누락`);
      if (!row[cols.player]) errors.push(`행 ${rowNum}: 플레이어 이름 누락`);

      // 좌석 범위
      const seat = normalizeSeat_(row[cols.seat]);
      if (!/^S[1-9]$/.test(seat)) {
        errors.push(`행 ${rowNum}: 잘못된 좌석 번호 "${seat}"`);
      }

      // 칩 음수
      if (cols.chips !== -1 && toInt_(row[cols.chips]) < 0) {
        errors.push(`행 ${rowNum}: 음수 칩 수`);
      }

      // 중복
      const key = `${row[cols.table]}_${row[cols.seat]}`.toUpperCase();
      if (seen.has(key)) {
        errors.push(`행 ${rowNum}: 중복된 테이블/좌석 조합`);
      }
      seen.add(key);
    });

    return successResponse_({ valid: errors.length === 0, errors });

  } catch (e) {
    return errorResponse_('validateSheetIntegrity', e);
  }
}

/* ===== 디버그 ===== */

function debugGetAllTypeData() {
  try {
    const ss = appSS_();
    const sh = ss.getSheetByName(TYPE_SHEET_NAME);
    if (!sh) return errorResponse_('debugGetAllTypeData', new Error('Type 시트가 없습니다'));

    const data = sh.getDataRange().getValues();

    return successResponse_({
      sheetName: sh.getName(),
      totalRows: data.length,
      header: data[0],
      firstDataRow: data.length > 1 ? data[1] : null,
      allData: data
    });

  } catch (e) {
    return errorResponse_('debugGetAllTypeData', e);
  }
}

/**
 * 웹앱 진입점
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('tracker')
    .setTitle(`Tracker ${TRACKER_VERSION} - Refactored`)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ===== 일회성 마이그레이션 ===== */

/**
 * [일회성] Type 시트에 Poker Room/Table Name 컬럼 추가
 *
 * 실행 순서:
 * 1. Apps Script 에디터 (https://script.google.com) 접속
 * 2. tracker_gs.js 파일 열기
 * 3. 함수 드롭다운에서 "migrateAddPokerRoomColumns" 선택
 * 4. 실행 버튼 (▶️) 클릭
 * 5. 권한 요청 시 승인
 * 6. 로그 확인 (보기 → 로그)
 *
 * ⚠️ 주의: 이 함수는 1회만 실행하세요. 재실행 시 컬럼이 중복 생성됩니다.
 */
function migrateAddPokerRoomColumns() {
  try {
    const ss = SpreadsheetApp.openById(APP_SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Type');

    if (!sheet) {
      throw new Error('Type 시트를 찾을 수 없습니다.');
    }

    // 1. A/B열에 컬럼 2개 삽입
    sheet.insertColumnsBefore(1, 2);

    // 2. 헤더 설정
    sheet.getRange('A1').setValue('Poker Room');
    sheet.getRange('B1').setValue('Table Name');

    // 3. 기존 데이터 행 수 확인
    const lastRow = sheet.getLastRow();

    if (lastRow > 1) {
      // 4. 기존 데이터에 기본값 설정 (A2:B{lastRow})
      const defaultValues = [];
      for (let i = 2; i <= lastRow; i++) {
        defaultValues.push(['Merit Hall', 'Ocean Blue']); // 기본값
      }
      sheet.getRange(2, 1, lastRow - 1, 2).setValues(defaultValues);
    }

    Logger.log('✅ Poker Room/Table Name 컬럼 추가 완료');
    Logger.log(`📊 총 ${lastRow - 1}개 행에 기본값 설정 완료`);

    return { success: true, message: `컬럼 추가 완료 (${lastRow - 1}개 행)` };

  } catch (err) {
    Logger.log('❌ 에러:', err.message);
    throw err;
  }
}

