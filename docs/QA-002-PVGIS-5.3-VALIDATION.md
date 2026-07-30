# QA-002 · PVGIS 5.3 비교 검증

검증일: 2026-07-30

## 기준

- 공식 기준: European Commission JRC PVGIS 5.3 non-interactive API `PVcalc`
- 버전 고정 엔드포인트: `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc`
- 대표 조건: 서울 37.5665, 126.9780 / 10 kWp / 시스템 손실 14% / 결정질 실리콘 / 건물 부착형 / 남향 0° / 경사 30°

## 확인 결과

### 입력 매핑

| SolPlanit 입력 | PVGIS 5.3 파라미터 | 결과 |
|---|---|---|
| 위도·경도 | `lat`, `lon` | 일치 |
| 설치 용량 | `peakpower` | 일치 |
| 시스템 손실 | `loss` | 일치 |
| 경사각 | `angle` | 일치 |
| 방위각 | `aspect` | 일치 |
| 설치 방식 | `mountingplace` | 일치 |
| 모듈 기술 | `pvtechchoice` | 일치 |
| 지평선 음영 | `usehorizon` | 프록시 계약·URL 생성 보강 |
| 복사 데이터베이스 | `raddatabase` | SARAH3·ERA5 허용 목록과 URL 생성 보강 |
| 최적 경사 | `optimalinclination=1` | 누락 경사 입력을 공식 옵션으로 변환하도록 보강 |
| 최적 경사·방위 | `optimalangles=1` | 경사·방위 모두 누락 시 공식 옵션으로 변환하도록 보강 |

### 결과와 다운로드

- 연간 발전량은 `outputs.totals.fixed.E_y`, 경사면 일사량은 `H(i)_y`, 연간 변동성은 `SD_y`, 총손실은 `l_total`에서 읽는다.
- 월별 발전량·일사량·표준편차는 `outputs.monthly.fixed`의 12개 행에서 읽는다.
- CSV와 JSON은 입력 조건, PVGIS 버전, 검증일, 조회 시각과 비보장 면책을 보존한다.
- 다운로드 버튼은 정상 결과가 생기기 전에는 비활성화된다.

### 오류 동작

- 입력 경계, 지원하지 않는 데이터베이스와 잘못된 지평선 값은 400 계열의 명시적 코드로 거부한다.
- 408, 429, 5xx는 제한된 재시도 대상이다.
- 반복 429는 한국어 `PVGIS_RATE_LIMITED`, timeout은 `PVGIS_TIMEOUT`, 연결 실패는 `PVGIS_UNAVAILABLE`로 매핑한다.

## 발견된 후속 결함

현재 `/pro`의 지평선 체크박스와 복사 데이터베이스 선택값은 화면 상태에는 반영되지만 분석 요청 본문에는 포함되지 않는다. 프록시는 이번 작업에서 두 값을 받을 수 있도록 보강했지만, UI 요청 직렬화 수정은 별도 `PRO-007`로 추적한다. 이 결함이 수정되기 전에는 기본값인 `usehorizon=1`, `PVGIS-SARAH3`만 실제 요청에 적용된다.

## 검증 제한

자동 실행 환경에서는 JRC API 직접 응답 본문을 안전하게 가져오지 못해 실시간 수치 스냅샷 비교는 완료하지 못했다. 공식 파라미터 계약, URL 생성, 응답 필드 매핑, 오류·다운로드 테스트를 자동 검증 대상으로 고정했으며, `PRO-007` 완료 후 Preview 또는 Production에서 대표 조건의 실시간 결과를 다시 대조해야 한다.
