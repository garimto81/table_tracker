/**
 * performance_test.js - 함수 실행 시간 측정 유틸리티
 *
 * 사용법:
 * 1. Google Apps Script 편집기에서 이 파일 추가
 * 2. runPerformanceTest() 실행
 * 3. 실행 로그에서 각 함수 실행 시간 확인
 */

// ===== 성능 측정 유틸리티 =====

/**
 * 함수 실행 시간 측정
 */
function measureTime(fn, fnName, ...args) {
  const start = Date.now();
  let result, error;

  try {
    result = fn(...args);
  } catch (e) {
    error = e;
  }

  const duration = Date.now() - start;

  return {
    name: fnName,
    duration: duration,
    success: !error,
    error: error ? error.message : null,
    result: result
  };
}

/**
 * 주요 API 함수들의 성능 테스트
 */
function runPerformanceTest() {
  console.log('========================================');
  console.log('📊 Poker Tracker 성능 테스트 시작');
  console.log('========================================\n');

  const results = [];

  // 1. getKeyPlayers() - 핵심 플레이어 조회
  console.log('🔍 [1/10] getKeyPlayers() 테스트...');
  results.push(measureTime(getKeyPlayers, 'getKeyPlayers'));

  // 2. getTablePlayers() - 테이블 플레이어 조회
  console.log('🔍 [2/10] getTablePlayers(1) 테스트...');
  results.push(measureTime(getTablePlayers, 'getTablePlayers(1)', 1));

  // 3. getSheetData_() - 캐시 히트
  console.log('🔍 [3/10] getSheetData_() (캐시 히트) 테스트...');
  results.push(measureTime(getSheetData_, 'getSheetData_(cache_hit)', false));

  // 4. getSheetData_() - 캐시 미스
  console.log('🔍 [4/10] getSheetData_() (캐시 미스) 테스트...');
  invalidateCache_();
  results.push(measureTime(getSheetData_, 'getSheetData_(cache_miss)', false));

  // 5. getAllPlayerPhotosMap_() - 사진 맵 조회
  console.log('🔍 [5/10] getAllPlayerPhotosMap_() 테스트...');
  results.push(measureTime(getAllPlayerPhotosMap_, 'getAllPlayerPhotosMap_'));

  // 6. getPlayerPhotoUrl_() - 단일 사진 조회
  console.log('🔍 [6/10] getPlayerPhotoUrl_() 테스트...');
  results.push(measureTime(getPlayerPhotoUrl_, 'getPlayerPhotoUrl_', 'TestPlayer'));

  // 7. validateSheetIntegrity() - 데이터 무결성 검증
  console.log('🔍 [7/10] validateSheetIntegrity() 테스트...');
  results.push(measureTime(validateSheetIntegrity, 'validateSheetIntegrity'));

  // 8. readAll_Optimized_() - 최적화된 시트 읽기
  console.log('🔍 [8/10] readAll_Optimized_() 테스트...');
  const sh = appSS_().getSheetByName(TYPE_SHEET_NAME);
  results.push(measureTime(readAll_Optimized_, 'readAll_Optimized_', sh));

  // 9. withScriptLock_() - 락 획득 시간
  console.log('🔍 [9/10] withScriptLock_() 테스트...');
  const testLockFn = () => withScriptLock_(() => 'lock_test');
  results.push(measureTime(testLockFn, 'withScriptLock_(test)'));

  // 10. debugGetAllTypeData() - 전체 데이터 조회
  console.log('🔍 [10/10] debugGetAllTypeData() 테스트...');
  results.push(measureTime(debugGetAllTypeData, 'debugGetAllTypeData'));

  // 결과 정렬 (실행 시간 내림차순)
  results.sort((a, b) => b.duration - a.duration);

  // 결과 출력
  console.log('\n========================================');
  console.log('📈 성능 테스트 결과 (느린 순)');
  console.log('========================================\n');

  let totalTime = 0;
  results.forEach((r, i) => {
    totalTime += r.duration;
    const status = r.success ? '✅' : '❌';
    const duration = r.duration.toString().padStart(6, ' ');
    const name = r.name.padEnd(35, ' ');

    console.log(`${(i+1).toString().padStart(2, ' ')}. ${status} ${duration}ms | ${name}`);

    if (!r.success) {
      console.log(`    └─ 에러: ${r.error}`);
    }
  });

  console.log('\n========================================');
  console.log(`⏱️  총 실행 시간: ${totalTime}ms`);
  console.log(`📊 평균 실행 시간: ${Math.round(totalTime / results.length)}ms`);
  console.log('========================================\n');

  // 성능 이슈 함수 경고 (500ms 초과)
  const slowFunctions = results.filter(r => r.duration > 500);
  if (slowFunctions.length > 0) {
    console.log('⚠️  성능 개선 필요 (500ms 초과):');
    slowFunctions.forEach(r => {
      console.log(`   - ${r.name}: ${r.duration}ms`);
    });
    console.log('');
  }

  // 성능 등급 평가
  const avgTime = totalTime / results.length;
  let grade, advice;

  if (avgTime < 100) {
    grade = 'S (매우 우수)';
    advice = '현재 성능 유지';
  } else if (avgTime < 200) {
    grade = 'A (우수)';
    advice = '현재 성능 유지';
  } else if (avgTime < 500) {
    grade = 'B (양호)';
    advice = '캐시 최적화 권장';
  } else if (avgTime < 1000) {
    grade = 'C (보통)';
    advice = '캐시 TTL 증가 또는 배치 처리 검토';
  } else {
    grade = 'D (개선 필요)';
    advice = 'Firebase 캐싱 또는 비동기 처리 검토';
  }

  console.log(`🏆 성능 등급: ${grade}`);
  console.log(`💡 권장사항: ${advice}\n`);

  return results;
}

/**
 * 특정 함수 반복 테스트 (평균 시간 측정)
 */
function benchmarkFunction(fn, fnName, iterations = 10, ...args) {
  console.log(`\n🔁 ${fnName} 반복 테스트 (${iterations}회)`);
  console.log('─'.repeat(50));

  const times = [];
  let successCount = 0;

  for (let i = 0; i < iterations; i++) {
    const result = measureTime(fn, fnName, ...args);
    times.push(result.duration);
    if (result.success) successCount++;

    console.log(`  ${(i+1).toString().padStart(2, ' ')}회: ${result.duration}ms ${result.success ? '✅' : '❌'}`);

    // 캐시 영향 최소화를 위해 짝수 번째마다 캐시 무효화
    if (i % 2 === 1) {
      invalidateCache_();
    }
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];

  console.log('─'.repeat(50));
  console.log(`평균: ${Math.round(avg)}ms | 최소: ${min}ms | 최대: ${max}ms | 중앙값: ${median}ms`);
  console.log(`성공률: ${successCount}/${iterations} (${Math.round(successCount/iterations*100)}%)\n`);

  return { avg, min, max, median, successRate: successCount/iterations };
}

/**
 * 주요 함수 집중 벤치마크
 */
function runBenchmarkTest() {
  console.log('========================================');
  console.log('🎯 주요 함수 벤치마크 테스트');
  console.log('========================================');

  // 1. getKeyPlayers() - 가장 자주 호출되는 함수
  const r1 = benchmarkFunction(getKeyPlayers, 'getKeyPlayers', 10);

  // 2. getTablePlayers() - 두 번째로 자주 호출
  const r2 = benchmarkFunction(getTablePlayers, 'getTablePlayers(1)', 10, 1);

  // 3. getSheetData_() - 캐시 미스 성능
  const r3 = benchmarkFunction(() => {
    invalidateCache_();
    return getSheetData_(false);
  }, 'getSheetData_(cache_miss)', 5);

  console.log('========================================');
  console.log('📊 벤치마크 요약');
  console.log('========================================');
  console.log(`getKeyPlayers:           평균 ${Math.round(r1.avg)}ms (최소 ${r1.min}ms, 최대 ${r1.max}ms)`);
  console.log(`getTablePlayers(1):      평균 ${Math.round(r2.avg)}ms (최소 ${r2.min}ms, 최대 ${r2.max}ms)`);
  console.log(`getSheetData_(캐시미스): 평균 ${Math.round(r3.avg)}ms (최소 ${r3.min}ms, 최대 ${r3.max}ms)`);
  console.log('========================================\n');
}

/**
 * 간단한 성능 테스트 (상위 5개만)
 */
function runQuickTest() {
  console.log('⚡ 빠른 성능 테스트 (상위 5개)\n');

  const tests = [
    { fn: getKeyPlayers, name: 'getKeyPlayers' },
    { fn: () => getTablePlayers(1), name: 'getTablePlayers(1)' },
    { fn: () => getSheetData_(false), name: 'getSheetData_(cache)' },
    { fn: getAllPlayerPhotosMap_, name: 'getAllPlayerPhotosMap_' },
    { fn: validateSheetIntegrity, name: 'validateSheetIntegrity' }
  ];

  tests.forEach((t, i) => {
    const result = measureTime(t.fn, t.name);
    const status = result.success ? '✅' : '❌';
    console.log(`${i+1}. ${status} ${result.duration}ms - ${result.name}`);
  });

  console.log('');
}
