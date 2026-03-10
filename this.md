  다음 Next.js 프로젝트에서 남아 있는 페이지 레벨 HTML 레이아웃을 MUI 기준으로 포팅해줘.

  프로젝트 경로:
  C:\Users\kopqw\Documents\workspace\tt\complysight_p

  목표:
  - 남아 있는 페이지에서 직접 작성된 `<div>`, `<span>` 중심 레이아웃/텍스트 구조를 MUI 컴포넌트로 치환
  - 기존 동작, 데이터 흐름, 라우팅, 상태 로직은 유지
  - 이미 포팅된 shared UI/MUI theme 구조를 재사용
  - 새 디자인을 만드는 작업이 아니라, 기존 화면 구조를 안전하게 MUI로 옮기는 작업

  중요 배경:
  - 이 프로젝트는 이미 MUI provider/theme가 붙어 있음
  - `src/components/ui`, `src/components/layout`의 공용 래퍼 상당수가 이미 MUI 기반으로 포팅되어 있음
  - 페이지 작업 시 공용 래퍼를 우선 재사용하고, 페이지 레벨 raw HTML만 줄이는 방향으로 작업할 것
  - 새로운 UI 라이브러리 추가 금지
  - 가능하면 MUI `Box`, `Stack`, `Paper`, `Typography`, `Table`, `Chip`, `Button`, `IconButton`, `Dialog`,
  `Snackbar`, `Pagination`, `ToggleButtonGroup` 등을 사용
  - 단순 form field는 기존 `FInput`, `FSelect`, `FTextarea`, `DatePicker`, `Tbl`, `PH`, `SidePanel` 등 shared
  wrapper 재사용 가능

  이번 작업 대상 페이지:
  1. `src/app/sentinel/board/page.tsx`
  2. `src/app/sentinel/daily-inspection/page.tsx`
  3. `src/app/sentinel/special-inspection/page.tsx`
  4. `src/app/manager/board/page.tsx`
  5. `src/app/manager/resources/page.tsx`
  6. `src/app/manager/report/history/page.tsx`
  7. `src/app/manager/inspection/status/page.tsx`
  8. `src/app/manager/inspection/schedule/page.tsx`
  9. `src/app/manager/inspection/special/page.tsx`
  10. `src/app/manager/settings/access-log/page.tsx`
  11. `src/app/manager/settings/category/page.tsx`
  12. `src/app/manager/settings/checklist/page.tsx`
  13. `src/app/manager/settings/error-log/page.tsx`
  14. `src/app/manager/settings/system-info/page.tsx`
  15. `src/app/manager/settings/users/page.tsx`
  16. `src/app/manager/settings/verification-code/page.tsx`

  참고:
  - 아래 페이지들은 `<div>/<span>`은 없지만 일반 HTML 태그(`<br>`, `<svg>`, `<option>`, `<strong>` 등)가 남아 있
  을 수 있음
  - 이들은 2차 정리 대상으로 보고, 우선순위는 위 16개보다 낮게 둬도 됨
    - `src/app/login/page.tsx`
    - `src/app/manager/dashboard/page.tsx`
    - `src/app/manager/settings/agent-auth/page.tsx`
    - `src/app/manager/settings/common-code/page.tsx`
    - `src/app/manager/settings/license/page.tsx`

  주의사항:
  - 무조건 전면 재작성하지 말고, 기존 상태/이벤트/데이터 조합 로직은 최대한 유지할 것
  - 페이지 구조를 MUI로 바꾸는 것이 목적이지, 비즈니스 로직 수정이 목적이 아님
  - mock data, context, route structure, import path를 불필요하게 변경하지 말 것
  - shared wrapper API를 깨지 말 것
  - 가능한 경우 `<div>` -> `Box`/`Stack`/`Paper`, `<span>` -> `Typography`/`Box component="span"`/`Chip` 등으로
  치환
  - 표 형태는 raw `<table>` 대신 MUI `Table` 계열 또는 기존 `Tbl` 사용
  - 커스텀 버튼/배지/패널은 이미 있는 공용 컴포넌트를 우선 사용
  - `option`은 기존 `FSelect`/native select 구조가 필요한 경우 유지 가능
  - `svg`는 단순 아이콘이면 MUI icon으로 교체, 커스텀 도식이면 의미를 보존하는 선에서 유지 가능
  - `strong`, `br` 같은 태그는 의미 보존이 필요하면 `Typography` 조합으로 대체하되, 억지로 로직을 복잡하게 만들
  지 말 것
  - accessibility와 반응형 깨짐이 생기지 않게 할 것
  - 기존 색상 체계는 `src/lib/theme/colors.ts`를 따를 것
  - 페이지별로 inline style만 MUI `sx`로 옮기는 수준이 아니라, 레이아웃 primitive 자체를 MUI로 바꿀 것
  - 불필요한 새 dependency 추가 금지
  - `@mui/x-*` 계열은 꼭 필요하지 않으면 추가하지 말 것

  특히 조심할 점:
  - App Router 환경이므로 client component 경계를 깨지 말 것
  - `use client`가 필요한 페이지/컴포넌트에서 누락되지 않게 할 것
  - 검색/필터/모달/사이드패널/테이블 row click/폼 validation 동작이 바뀌지 않게 할 것
  - 한 번에 너무 많은 파일을 건드려서 원인 추적이 어려워지지 않게, 검증 가능한 단위로 나눠서 진행할 것
  - 빌드 실패 시 무작정 코드 수정 반복하지 말고, 에러가 타입 문제인지 환경 문제인지 먼저 구분할 것

  검증 방법:
  - 우선 `pnpm exec tsc --noEmit` 실행
  - 가능하면 `pnpm exec next build`도 실행
  - 단, 이 워크스페이스는 가끔 `.next\\trace` 파일 잠금 때문에 `EPERM`으로 빌드가 실패할 수 있음
  - 만약 빌드 실패가 코드 에러가 아니라 `.next\\trace` 접근/잠금 문제라면, 그건 환경 이슈로 분리해서 보고할 것
  - 즉, 타입체크 통과 + 빌드 실패 원인이 `.next\\trace` 잠금이면 코드 회귀로 오판하지 말 것

  작업 방식:
  - 먼저 대상 페이지를 스캔해서 raw HTML 비중이 높은 순으로 우선순위 정리
  - 우선순위 높은 페이지부터 MUI 포팅
  - 각 배치마다 타입체크
  - 필요한 경우만 추가 수정
  - 최종적으로 변경 파일, 남은 페이지, 검증 결과, 환경 이슈를 요약

  최종 보고 형식:
  - 변경한 페이지 목록
  - 각 페이지에서 무엇을 MUI로 바꿨는지 한 줄 요약
  - `tsc` 결과
  - `next build` 결과
  - 남은 raw HTML 페이지가 있으면 목록
  - 빌드가 `.next\\trace` 잠금으로 실패하면 그 사실을 별도 명시