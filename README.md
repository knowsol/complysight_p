# ComplySight 퍼블리싱 프로젝트

> **원본**: `complysight-app-v42.jsx` (12,880줄 단일 파일)  
> **마이그레이션**: Next.js 15 App Router + TypeScript 컴포넌트 기반 분리  
> **목적**: 백엔드 없는 순수 프론트엔드 퍼블리싱 (Mock 데이터 + 인라인 스타일)

---

## 목차

1. [빠른 시작](#1-빠른-시작)
2. [프로젝트 구조](#2-프로젝트-구조)
3. [사이트 구성](#3-사이트-구성)
4. [페이지 목록](#4-페이지-목록)
5. [UI 컴포넌트 가이드](#5-ui-컴포넌트-가이드)
6. [패널/모달 컴포넌트](#6-패널모달-컴포넌트)
7. [레이아웃 컴포넌트](#7-레이아웃-컴포넌트)
8. [데이터(Mock) 구조](#8-데이터mock-구조)
9. [Context (전역 상태)](#9-context-전역-상태)
10. [테마 & 스타일 시스템](#10-테마--스타일-시스템)
11. [타입 정의](#11-타입-정의)
12. [새 페이지 만들기](#12-새-페이지-만들기)
13. [컴포넌트 수정 가이드](#13-컴포넌트-수정-가이드)
14. [코드 규칙](#14-코드-규칙)
15. [빌드 & 검증](#15-빌드--검증)
16. [트러블슈팅](#16-트러블슈팅)

---

## 1. 빠른 시작

```bash
# 의존성 설치
pnpm install

# 개발 서버 (Turbopack)
pnpm dev          # → http://localhost:3000

# 프로덕션 빌드
pnpm build

# 빌드된 결과 실행
pnpm start
```

### 기술 스택

| 항목 | 버전 |
|------|------|
| Next.js | 15.5 (App Router, Turbopack) |
| React | 19.2 |
| TypeScript | 5.8 |
| 아이콘 | lucide-react 0.468 |
| 폰트 | Pretendard Variable (CDN) |
| 스타일 | **인라인 스타일 전용** (CSS 파일 없음) |

### 주요 특징

- **백엔드 없음** — 모든 데이터는 `src/data/` 안의 Mock 데이터
- **CSS 파일 없음** — 모든 스타일은 JSX 인라인 `style={{}}` 또는 `src/lib/theme/` 유틸리티 사용
- **정적 빌드** — 모든 29개 페이지가 Static Generation 방식
- **2개 사이트** — Manager(관리자)와 Sentinel(현장점검자) 분리

---

## 2. 프로젝트 구조

```
src/
├── app/                          # Next.js App Router 페이지
│   ├── layout.tsx                # 루트 레이아웃 (AuthProvider, 폰트)
│   ├── page.tsx                  # / → 로그인으로 리다이렉트
│   ├── globals.css               # 최소 CSS (box-sizing, 폰트만)
│   ├── login/page.tsx            # 로그인 페이지
│   ├── manager/                  # Manager 사이트 (관리자)
│   │   ├── layout.tsx            # Manager 레이아웃 (Header + Sidebar)
│   │   ├── dashboard/            # 대시보드
│   │   ├── resources/            # 자원관리
│   │   ├── inspection/           # 점검현황
│   │   │   ├── status/           #   - 점검현황
│   │   │   ├── schedule/         #   - 점검스케줄
│   │   │   └── special/          #   - 특별점검
│   │   ├── report/               # 보고현황
│   │   │   ├── view/             #   - 점검보고서
│   │   │   └── history/          #   - 보고이력
│   │   ├── board/                # 게시판
│   │   └── settings/             # 환경설정 (12개 하위 페이지)
│   └── sentinel/                 # Sentinel 사이트 (현장점검자)
│       ├── layout.tsx            # Sentinel 레이아웃 (Header + Sidebar)
│       ├── dashboard/            # 대시보드
│       ├── daily-inspection/     # 일상점검
│       ├── special-inspection/   # 특별점검
│       └── board/                # 게시판
│
├── components/
│   ├── ui/                       # 재사용 UI 컴포넌트 (32개)
│   ├── panels/                   # 상세 패널 & 모달 (19개)
│   └── layout/                   # 레이아웃 (Header, Sidebar, NoticeBanner)
│
├── contexts/                     # React Context (전역 상태)
│   ├── AuthContext.tsx            # 인증/사이트 전환
│   ├── DIContext.tsx              # 일상점검 데이터
│   └── CLContext.tsx              # 점검표 데이터
│
├── data/                         # Mock 데이터 (13개 파일)
│   ├── index.ts                  # 통합 re-export
│   ├── resources.ts              # 자원 목록
│   ├── inspections.ts            # 점검 데이터 + 메뉴 구조
│   ├── systems.ts                # 정보시스템 목록 + 중분류(_mids)
│   ├── reports.ts                # 보고서 데이터
│   ├── checklists.ts             # 점검표 데이터
│   ├── schedules.ts              # 스케줄 데이터
│   ├── users.ts                  # 사용자 목록
│   ├── boards.ts                 # 게시판 데이터
│   ├── notices.ts                # 공지사항
│   ├── common.ts                 # 공통코드
│   ├── manager.ts                # 관리자 전용 데이터
│   └── verification-codes.ts     # 검증코드
│
├── types/                        # TypeScript 타입 정의 (13개 파일)
│   ├── index.ts                  # 통합 re-export
│   ├── resource.ts, inspection.ts, report.ts, ...
│   └── menu.ts                   # 메뉴 구조 타입
│
└── lib/
    ├── theme/
    │   ├── colors.ts             # 테마 색상 (C 객체)
    │   ├── styles.ts             # 공통 스타일 프리셋 (fInput, fSelect 등)
    │   └── status-colors.ts      # 상태별 배지 색상 맵 (SC 객체)
    ├── constants/
    │   ├── menu.ts               # 사이드바 메뉴 구조
    │   └── routes.ts             # 라우트 경로 상수
    └── hooks/
        └── use-edit-panel.ts     # 편집 패널 공통 훅
```

---

## 3. 사이트 구성

이 프로젝트는 **2개의 독립 사이트**로 구성됩니다.

| 사이트 | 경로 접두사 | 테마 키 | 메인 컬러 | 대상 사용자 |
|--------|------------|---------|-----------|------------|
| **Manager** | `/manager/*` | `m` | 파랑 (`#339CD5`) | 시스템 관리자 |
| **Sentinel** | `/sentinel/*` | `s` | 초록 (`#19973C`) | 현장 점검자 |

각 사이트는 **자체 layout.tsx**를 가지며, 헤더의 "사이트 전환" 버튼으로 전환합니다.  
테마 색상은 `setTheme("m" | "s")`로 전환되며, `C` 객체의 값이 동적으로 변경됩니다.

---

## 4. 페이지 목록

### Manager (관리자) — 22 페이지

| 라우트 | 파일 | 설명 | 줄 수 |
|--------|------|------|-------|
| `/manager/dashboard` | `dashboard/page.tsx` | 대시보드 (통계 카드, 차트) | 309 |
| `/manager/resources` | `resources/page.tsx` | 자원관리 (테이블, 상세패널) | 280 |
| `/manager/inspection/status` | `inspection/status/page.tsx` | 점검현황 | 179 |
| `/manager/inspection/schedule` | `inspection/schedule/page.tsx` | 점검스케줄 | 224 |
| `/manager/inspection/special` | `inspection/special/page.tsx` | 특별점검 | 113 |
| `/manager/report/view` | `report/view/page.tsx` | 점검보고서 | 493 |
| `/manager/report/history` | `report/history/page.tsx` | 보고이력 | 157 |
| `/manager/board` | `board/page.tsx` | 게시판 | 100 |
| `/manager/settings/profile` | `settings/profile/page.tsx` | 시스템 프로필 | 118 |
| `/manager/settings/common-code` | `settings/common-code/page.tsx` | 공통코드 관리 | 825 |
| `/manager/settings/category` | `settings/category/page.tsx` | 카테고리 관리 | 281 |
| `/manager/settings/login-message` | `settings/login-message/page.tsx` | 로그인 안내메시지 | 95 |
| `/manager/settings/license` | `settings/license/page.tsx` | 라이선스 | 345 |
| `/manager/settings/users` | `settings/users/page.tsx` | 사용자 관리 | 399 |
| `/manager/settings/checklist` | `settings/checklist/page.tsx` | 점검표 관리 | 78 |
| `/manager/settings/verification-code` | `settings/verification-code/page.tsx` | 검증코드 | 124 |
| `/manager/settings/access-log` | `settings/access-log/page.tsx` | 접속로그 | 134 |
| `/manager/settings/error-log` | `settings/error-log/page.tsx` | 에러로그 | 128 |
| `/manager/settings/agent-auth` | `settings/agent-auth/page.tsx` | AGENT 권한관리 | 455 |
| `/manager/settings/system-info` | `settings/system-info/page.tsx` | 시스템정보 | 25 |

### Sentinel (현장점검자) — 4 페이지

| 라우트 | 파일 | 설명 | 줄 수 |
|--------|------|------|-------|
| `/sentinel/dashboard` | `dashboard/page.tsx` | 대시보드 | 40 |
| `/sentinel/daily-inspection` | `daily-inspection/page.tsx` | 일상점검 | 210 |
| `/sentinel/special-inspection` | `special-inspection/page.tsx` | 특별점검 | 106 |
| `/sentinel/board` | `board/page.tsx` | 게시판 | 34 |

### 공통 — 3 페이지

| 라우트 | 파일 | 설명 |
|--------|------|------|
| `/` | `page.tsx` | 루트 (로그인 리다이렉트) |
| `/login` | `login/page.tsx` | 로그인 페이지 (517줄) |

---

## 5. UI 컴포넌트 가이드

> 모든 UI 컴포넌트는 `src/components/ui/` 에 위치합니다.  
> import 경로: `@/components/ui/파일명`

### 5.1 버튼 — `Button.tsx` (290줄)

```tsx
import { Btn, SearchBtn, RefreshBtn, SecBtnO, SecBtnP } from '@/components/ui/Button';

// 기본 버튼 — primary, danger, success, outline 등의 variant
<Btn primary onClick={handleClick}>저장</Btn>
<Btn danger sm>삭제</Btn>
<Btn outline>취소</Btn>
<Btn outlineDanger small>거절</Btn>
<Btn ghost xs>더보기</Btn>
<Btn disabled>비활성</Btn>

// 검색/초기화 버튼 (아이콘 내장)
<SearchBtn onClick={doSearch} />
<RefreshBtn onClick={doReset} />

// 섹션 버튼 (테이블 제목 옆에 사용)
<SecBtnO onClick={fn}>텍스트 버튼</SecBtnO>
<SecBtnP onClick={fn}>Primary 버튼</SecBtnP>
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `primary` | `boolean` | `false` | 메인 컬러 배경 |
| `danger` | `boolean` | `false` | 빨간색 배경 |
| `success` | `boolean` | `false` | 초록색 배경 |
| `outline` | `boolean` | `false` | 테두리만 |
| `outlineDanger` | `boolean` | `false` | 빨간 테두리 |
| `ghost` | `boolean` | `false` | 배경 없음 |
| `sm` / `small` | `boolean` | `false` | 작은 크기 |
| `xs` | `boolean` | `false` | 아주 작은 크기 |
| `disabled` | `boolean` | `false` | 비활성 |

---

### 5.2 테이블 — `Table.tsx` (192줄)

```tsx
import { Tbl } from '@/components/ui/Table';

<Tbl
  secTitle="자원 목록"               // 섹션 제목
  secCount={filteredData.length}      // 건수 표시
  secButtons={<Btn>추가</Btn>}        // 제목 우측 버튼
  cols={[
    { t: "No.",     k: "id",    w: 60 },                               // 기본 컬럼
    { t: "이름",    k: "name",  align: "left" },                       // 좌측 정렬
    { t: "상태",    k: "status", w: 80, r: (v) => <Badge status={v} /> }, // 커스텀 렌더
    { t: "일시",    k: "dt",    w: 150 },
  ]}
  data={filteredData}                 // 배열 데이터
  onRow={(row) => setSelected(row)}   // 행 클릭 핸들러
  pageSize={10}                       // 페이지당 행 수 (기본 10)
  noPaging                            // 페이지네이션 숨기기
  rowStyle={(row) => ({ color: row.active ? C.txt : C.txL })}  // 행별 스타일
/>
```

| 컬럼 속성 (`cols`) | 타입 | 설명 |
|-----|------|------|
| `t` | `ReactNode` | 헤더 텍스트 (또는 JSX) |
| `k` | `string` | 데이터 키 |
| `w` | `number` | 고정 너비 (px) |
| `align` | `string` | 정렬 (`"left"`, `"center"`, `"right"`) |
| `r` | `(value, row, index) => ReactNode` | 커스텀 셀 렌더 함수 |

---

### 5.3 카드 — `Card.tsx`

```tsx
import { Card } from '@/components/ui/Card';

<Card title="점검종류" extra={<Btn sm>편집</Btn>} style={{ maxHeight: 500 }}>
  {children}
</Card>
```

| Prop | 타입 | 설명 |
|------|------|------|
| `title` | `string` | 카드 제목 |
| `extra` | `ReactNode` | 제목 우측 추가 요소 |
| `children` | `ReactNode` | 카드 본문 |
| `style` | `CSSProperties` | 추가 스타일 |
| `onClick` | `() => void` | 클릭 핸들러 |

---

### 5.4 배지 — `Badge.tsx` (90줄)

```tsx
import { Badge, YnBadge, RoleBadge } from '@/components/ui/Badge';

<Badge status="완료" />       // 상태 배지 (색상 자동 매핑)
<Badge status="지연" />       // → 빨간 배경
<YnBadge v="Y" />             // Y/N 토글 배지
<RoleBadge v="시스템관리자" /> // 역할 배지
```

배지 색상은 `src/lib/theme/status-colors.ts`의 `SC` 맵에서 자동 적용됩니다.  
새 상태를 추가하려면 해당 파일에 항목을 추가하세요.

---

### 5.5 입력 필드 — `Input.tsx` (103줄)

```tsx
import { FInput, FSelect, FTextarea, RoSelect } from '@/components/ui/Input';

// 텍스트 입력
<FInput value={kw} onChange={e => setKw(e.target.value)}
  placeholder="검색어" style={{ minWidth: 120 }} />

// 셀렉트 박스
<FSelect value={sys} onChange={e => setSys(e.target.value)}>
  <option value="">전체</option>
  {items.map(i => <option key={i.id} value={i.id}>{i.nm}</option>)}
</FSelect>

// 텍스트 에어리어
<FTextarea value={memo} onChange={e => setMemo(e.target.value)} rows={4} />

// 읽기 전용 셀렉트 (readOnly 일 때 비활성 표시)
<RoSelect readOnly={isReadOnly} value={val} onChange={e => setVal(e.target.value)}>
  {options}
</RoSelect>
```

> `FInput`, `FSelect`, `FTextarea`는 HTML 기본 속성을 모두 지원합니다.  
> `style` prop으로 개별 스타일을 덮어쓸 수 있습니다.

---

### 5.6 날짜/시간 선택 — `DatePicker.tsx` (524줄)

```tsx
import { DatePicker, DateRangePicker, TimePicker, DateTimePicker } from '@/components/ui/DatePicker';

// 단일 날짜
<DatePicker value={date} onChange={setDate} style={{ width: 130 }} />

// 날짜 범위
<DateRangePicker from={dtFrom} to={dtTo}
  onFromChange={setDtFrom} onToChange={setDtTo} />

// 시간
<TimePicker value={time} onChange={setTime} withSeconds />

// 날짜+시간
<DateTimePicker value={datetime} onChange={setDatetime} />
```

| 컴포넌트 | Props | 설명 |
|----------|-------|------|
| `DatePicker` | `value`, `onChange`, `placeholder`, `disabled`, `readOnly`, `style` | 캘린더 팝업 포함 |
| `DateRangePicker` | `from`, `to`, `onFromChange`, `onToChange`, `disabled` | 시작~종료 범위 |
| `TimePicker` | `value`, `onChange`, `withSeconds`, `disabled`, `readOnly` | HH:MM 또는 HH:MM:SS |
| `DateTimePicker` | `value`, `onChange`, `disabled`, `readOnly` | DatePicker + TimePicker 조합 |

---

### 5.7 검색바 — `SearchBar.tsx` (165줄)

```tsx
import { SB } from '@/components/ui/SearchBar';  // SB = SearchBar 별칭

<SB onSearch={doSearch} onReset={doReset}>
  {/* children으로 필터 필드를 자유롭게 배치 */}
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ ...LABEL_STYLE_SM }}>정보시스템</span>
    <FSelect value={sys} onChange={e => setSys(e.target.value)}>
      <option value="">전체</option>
    </FSelect>
  </div>
</SB>
```

> `SB`는 검색/초기화 버튼이 내장된 래퍼입니다.  
> 안에 원하는 필터 요소를 `children`으로 넣으면 됩니다.

---

### 5.8 페이지 헤더 — `PageHeader.tsx`

```tsx
import { PH } from '@/components/ui/PageHeader';

<PH title="자원관리" bc="홈 > 자원관리" extra={<Btn primary>추가</Btn>} />
```

| Prop | 타입 | 설명 |
|------|------|------|
| `title` | `string` | 페이지 제목 |
| `bc` | `string` | 브레드크럼 텍스트 (`>` 구분) |
| `extra` | `ReactNode` | 우측 추가 요소 (버튼 등) |

---

### 5.9 사이드 패널 — `SidePanel.tsx` (150줄)

```tsx
import { SidePanel } from '@/components/ui/SidePanel';

<SidePanel open={!!selected} onClose={() => setSelected(null)}
  title="자원 상세" width={580}>
  <FormRow label="자원명" required>
    <FInput value={name} onChange={...} />
  </FormRow>
  <PanelFooter onCancel={() => setSelected(null)} onSave={handleSave} />
</SidePanel>
```

> 우측에서 슬라이드되어 나오는 상세 편집 패널입니다.

---

### 5.10 모달 — `Modal.tsx`

```tsx
import { Modal } from '@/components/ui/Modal';

<Modal open={showModal} onClose={() => setShowModal(false)}
  title="엑셀 업로드" width={500}>
  {modalContent}
</Modal>
```

---

### 5.11 폼 행 — `FormRow.tsx` (75줄)

```tsx
import { FormRow, SecTitle, PanelFooter, PanelDeleteBtn } from '@/components/ui/FormRow';

// 폼 필드 행 (라벨 + 입력)
<FormRow label="시스템명" required half>
  <FInput value={name} onChange={...} />
</FormRow>

// 섹션 제목
<SecTitle label="기본정보" count={5} buttons={<SecBtnO>추가</SecBtnO>} />

// 패널 하단 버튼
<PanelFooter onCancel={close} onSave={save} saveLabel="등록"
  extraLeft={<PanelDeleteBtn onClick={del} />} />
```

---

### 5.12 점검 필터 — `InspFilter.tsx` (115줄)

```tsx
import { InspFilter } from '@/components/ui/InspFilter';
import { _dailyMenu } from '@/data/inspections';

<InspFilter
  menus={_dailyMenu}                        // 메뉴 구조: { label, sub? }[]
  sel={fKind}                                // 선택된 상위 메뉴
  sub={fSub}                                 // 선택된 하위 메뉴
  onSelect={(k, s) => { setFKind(k); setFSub(s); }}
  data={di}                                  // 필터링 대상 데이터
  kindKey="kind"                             // 데이터의 종류 키 (기본: "kind")
  midKey="mid"                               // 데이터의 중분류 키 (기본: "mid")
/>
```

> 트리/아코디언 스타일 필터 메뉴입니다.  
> `st === "지연"` 건수만 빨간 원형 배지로 표시됩니다.

---

### 5.13 아이콘 — `Icon.tsx` (43줄)

```tsx
import { Ic } from '@/components/ui/Icon';

<Ic n="check" s={16} c={C.sec} />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `n` | `string` | — | 아이콘 이름 (`check`, `close`, `down`, `right`, `edit`, `trash` 등) |
| `s` | `number` | `16` | 크기 (px) |
| `c` | `string` | `currentColor` | 색상 |

---

### 5.14 기타 UI 컴포넌트 요약

| 컴포넌트 | 파일 | 설명 | 주요 Props |
|----------|------|------|-----------|
| `Stat` | `Stat.tsx` | 통계 숫자 표시 | `label`, `value`, `color`, `icon`, `onClick` |
| `StatCard` | `StatCard.tsx` | 통계 카드 (아이콘+숫자) | `label`, `value`, `color`, `icon` |
| `TabNav` / `FilterTab` | `TabNav.tsx` / `FilterTab.tsx` | 탭 필터 | `options`, `value`, `onChange` |
| `Radio` | `Radio.tsx` | 라디오 버튼 그룹 | `options`, `value`, `onChange`, `disabled` |
| `Toggle` / `ToggleSwitch` | `Toggle.tsx` / `ToggleSwitch.tsx` | 토글 스위치 | `on`, `onClick`, `disabled` |
| `Pagination` | `Pagination.tsx` | 페이지네이션 | `page`, `totalPages`, `setPage` |
| `ConfirmDialog` | `ConfirmDialog.tsx` | 확인/취소 다이얼로그 | `open`, `title`, `msg`, `onOk`, `onCancel` |
| `ConfirmModal` | `ConfirmModal.tsx` | 확인 모달 (별도 구현) | `open`, `title`, `msg`, `onOk`, `onCancel` |
| `DataTable` | `DataTable.tsx` | 제네릭 데이터 테이블 | `Tbl`과 동일 인터페이스 |
| `FormField` | `FormField.tsx` | 폼 필드 (FormRow 대안) | `label`, `required`, `children`, `half` |
| `SelectField` | `SelectField.tsx` | 스타일링된 Select | `style`, `children`, + HTML Select 속성 |
| `TextArea` | `TextArea.tsx` | 스타일링된 Textarea | `style`, + HTML Textarea 속성 |
| `StatusBadge` | `StatusBadge.tsx` | Badge 별도 구현 | `Badge`와 동일 |

---

### 5.15 UI 컴포넌트 전체 레퍼런스 (32개)

아래 표는 `src/components/ui/`의 **모든 컴포넌트 파일**을 한 번에 확인할 수 있는 레퍼런스입니다.

| 컴포넌트(파일) | 기본 Import | 역할 | 핵심 Props/사용 포인트 |
|---|---|---|---|
| `Badge` (`Badge.tsx`) | `import { Badge } from '@/components/ui/Badge'` | 상태 배지 | `status` |
| `YnBadge` (`Badge.tsx`) | `import { YnBadge } from '@/components/ui/Badge'` | Y/N 배지 | `v` |
| `RoleBadge` (`Badge.tsx`) | `import { RoleBadge } from '@/components/ui/Badge'` | 역할 배지 | `v` |
| `Btn` (`Button.tsx`) | `import { Btn } from '@/components/ui/Button'` | 범용 버튼 | `primary`, `danger`, `outline`, `sm`, `xs`, `disabled` |
| `SearchBtn` (`Button.tsx`) | `import { SearchBtn } from '@/components/ui/Button'` | 검색 아이콘 버튼 | `onClick` |
| `RefreshBtn` (`Button.tsx`) | `import { RefreshBtn } from '@/components/ui/Button'` | 초기화 아이콘 버튼 | `onClick` |
| `SecBtnO` (`Button.tsx`) | `import { SecBtnO } from '@/components/ui/Button'` | 섹션 아웃라인 버튼 | `children`, `onClick` |
| `SecBtnP` (`Button.tsx`) | `import { SecBtnP } from '@/components/ui/Button'` | 섹션 프라이머리 버튼 | `children`, `onClick`, `style` |
| `Card` (`Card.tsx`) | `import { Card } from '@/components/ui/Card'` | 박스 카드 레이아웃 | `title`, `extra`, `children`, `style` |
| `ConfirmDialog` (`ConfirmDialog.tsx`) | `import { ConfirmDialog } from '@/components/ui/ConfirmDialog'` | 확인 다이얼로그 | `open`, `title`, `msg`, `onOk`, `onCancel`, `danger` |
| `UnsavedConfirmDialog` (`ConfirmDialog.tsx`) | `import { UnsavedConfirmDialog } from '@/components/ui/ConfirmDialog'` | 이탈 확인 다이얼로그 | `open`, `onDiscard`, `onSave` |
| `ConfirmModal` (`ConfirmModal.tsx`) | `import { ConfirmModal } from '@/components/ui/ConfirmModal'` | 확인 모달(대체 구현) | `open`, `title`, `msg`, `onOk`, `onCancel` |
| `UnsavedConfirm` (`ConfirmModal.tsx`) | `import { UnsavedConfirm } from '@/components/ui/ConfirmModal'` | 이탈 확인 모달 | `open`, `onDiscard`, `onSave` |
| `DataTable` (`DataTable.tsx`) | `import { DataTable } from '@/components/ui/DataTable'` | 제네릭 테이블 | `cols`, `data`, `onRow`, `pageSize`, `secTitle` |
| `DatePicker` (`DatePicker.tsx`) | `import { DatePicker } from '@/components/ui/DatePicker'` | 단일 날짜 선택 | `value`, `onChange`, `disabled`, `readOnly`, `style` |
| `DateRangePicker` (`DatePicker.tsx`) | `import { DateRangePicker } from '@/components/ui/DatePicker'` | 날짜 범위 선택 | `from`, `to`, `onFromChange`, `onToChange` |
| `TimePicker` (`DatePicker.tsx`) | `import { TimePicker } from '@/components/ui/DatePicker'` | 시간 선택 | `value`, `onChange`, `withSeconds` |
| `DateTimePicker` (`DatePicker.tsx`) | `import { DateTimePicker } from '@/components/ui/DatePicker'` | 날짜+시간 선택 | `value`, `onChange`, `disabled`, `readOnly` |
| `DateRangePicker` (`DateRangePicker.tsx`) | `import { DateRangePicker } from '@/components/ui/DateRangePicker'` | DateRange 단독 파일 버전 | `from`, `to`, `onFromChange`, `onToChange`, `disabled` |
| `DateTimePicker` (`DateTimePicker.tsx`) | `import { DateTimePicker } from '@/components/ui/DateTimePicker'` | DateTime 단독 파일 버전 | `value`, `onChange`, `disabled`, `readOnly` |
| `FilterTab` (`FilterTab.tsx`) | `import { FilterTab } from '@/components/ui/FilterTab'` | 필터 탭 | `options`, `value`, `onChange` |
| `FormField` (`FormField.tsx`) | `import { FormField } from '@/components/ui/FormField'` | 라벨+컨텐츠 폼 라인 | `label`, `required`, `half`, `style` |
| `FormInput` (`FormField.tsx`) | `import { FormInput } from '@/components/ui/FormField'` | FormField용 입력 필드 | `style` + HTML input props |
| `FormRow` (`FormRow.tsx`) | `import { FormRow } from '@/components/ui/FormRow'` | 패널용 폼 행 | `label`, `required`, `half`, `style` |
| `SecTitle` (`FormRow.tsx`) | `import { SecTitle } from '@/components/ui/FormRow'` | 섹션 제목줄 | `label`, `count`, `buttons`, `style` |
| `PanelDeleteBtn` (`FormRow.tsx`) | `import { PanelDeleteBtn } from '@/components/ui/FormRow'` | 패널 삭제 버튼 | `onClick` |
| `PanelFooter` (`FormRow.tsx`) | `import { PanelFooter } from '@/components/ui/FormRow'` | 패널 하단 저장/취소 | `onCancel`, `onSave`, `saveLabel`, `extraLeft` |
| `Ic` (`Icon.tsx`) | `import { Ic } from '@/components/ui/Icon'` | SVG 아이콘 | `n`, `s`, `c` |
| `FInput` (`Input.tsx`) | `import { FInput } from '@/components/ui/Input'` | 기본 텍스트 입력 | `style` + HTML input props |
| `FSelect` (`Input.tsx`) | `import { FSelect } from '@/components/ui/Input'` | 기본 셀렉트 | `style` + HTML select props |
| `FTextarea` (`Input.tsx`) | `import { FTextarea } from '@/components/ui/Input'` | 기본 텍스트에어리어 | `style` + HTML textarea props |
| `RoSelect` (`Input.tsx`) | `import { RoSelect } from '@/components/ui/Input'` | readOnly 지원 셀렉트 | `readOnly`, `value`, `onChange`, `placeholder` |
| `InspFilter` (`InspFilter.tsx`) | `import { InspFilter } from '@/components/ui/InspFilter'` | 점검 종류 트리 필터 | `menus`, `sel`, `sub`, `onSelect`, `data`, `kindKey`, `midKey` |
| `Modal` (`Modal.tsx`) | `import { Modal } from '@/components/ui/Modal'` | 중앙 모달 | `open`, `onClose`, `title`, `width`, `children` |
| `PH` (`PageHeader.tsx`) | `import { PH } from '@/components/ui/PageHeader'` | 페이지 상단 헤더 | `title`, `bc`, `extra` |
| `Pagination` (`Pagination.tsx`) | `import { Pagination } from '@/components/ui/Pagination'` | 페이지네이션 | `page`, `totalPages`, `setPage` |
| `Radio` (`Radio.tsx`) | `import { Radio } from '@/components/ui/Radio'` | 라디오 그룹 | `options`, `value`, `onChange`, `disabled` |
| `SearchBar` (`SearchBar.tsx`) | `import { SearchBar } from '@/components/ui/SearchBar'` | 검색 바 래퍼 | `onSearch`, `onReset`, `children`, `fields` |
| `SB` (`SearchBar.tsx`) | `import { SB } from '@/components/ui/SearchBar'` | SearchBar 별칭 | SearchBar와 동일 |
| `SelectField` (`SelectField.tsx`) | `import { SelectField } from '@/components/ui/SelectField'` | 대체 셀렉트 컴포넌트 | `style` + HTML select props |
| `ReadOnlySelect` (`SelectField.tsx`) | `import { ReadOnlySelect } from '@/components/ui/SelectField'` | readOnly 셀렉트 | `readOnly`, `value`, `onChange`, `placeholder` |
| `SidePanel` (`SidePanel.tsx`) | `import { SidePanel } from '@/components/ui/SidePanel'` | 우측 슬라이드 패널 | `open`, `onClose`, `title`, `width`, `noScroll` |
| `Stat` (`Stat.tsx`) | `import { Stat } from '@/components/ui/Stat'` | 숫자 통계 타일 | `label`, `value`, `color`, `icon`, `onClick` |
| `StatCard` (`StatCard.tsx`) | `import { StatCard } from '@/components/ui/StatCard'` | 카드형 통계 위젯 | `label`, `value`, `color`, `icon`, `onClick` |
| `StatusBadge` (`StatusBadge.tsx`) | `import { StatusBadge } from '@/components/ui/StatusBadge'` | 상태 배지 (대체 구현) | `status` |
| `YnBadge` (`StatusBadge.tsx`) | `import { YnBadge } from '@/components/ui/StatusBadge'` | Y/N 배지 (대체 구현) | `v` |
| `RoleBadge` (`StatusBadge.tsx`) | `import { RoleBadge } from '@/components/ui/StatusBadge'` | 역할 배지 (대체 구현) | `v` |
| `Tbl` (`Table.tsx`) | `import { Tbl } from '@/components/ui/Table'` | 메인 테이블 컴포넌트 | `cols`, `data`, `onRow`, `pageSize`, `secTitle` |
| `GuiPag` (`Table.tsx`) | `import { GuiPag } from '@/components/ui/Table'` | Table 전용 페이지네이션 | `page`, `totalPages`, `setPage` |
| `TabNav` (`TabNav.tsx`) | `import { TabNav } from '@/components/ui/TabNav'` | 탭 네비게이션 | `options`, `value`, `onChange` |
| `TextArea` (`TextArea.tsx`) | `import { TextArea } from '@/components/ui/TextArea'` | 대체 textarea 컴포넌트 | `style` + HTML textarea props |
| `TimePicker` (`TimePicker.tsx`) | `import { TimePicker } from '@/components/ui/TimePicker'` | 단독 파일 시간 선택기 | `value`, `onChange`, `withSeconds`, `disabled` |
| `Toggle` (`Toggle.tsx`) | `import { Toggle } from '@/components/ui/Toggle'` | 토글 버튼(단순형) | `on`, `onClick`, `disabled` |
| `ToggleSwitch` (`ToggleSwitch.tsx`) | `import { ToggleSwitch } from '@/components/ui/ToggleSwitch'` | 토글 스위치(개선형) | `on`, `onClick`, `disabled` |

> 참고:
> - `DateRangePicker`, `DateTimePicker`, `TimePicker`는 단독 파일 버전과 `DatePicker.tsx` 통합 버전이 **동시에 존재**합니다.
> - `Badge.tsx`와 `StatusBadge.tsx`, `Toggle.tsx`와 `ToggleSwitch.tsx`는 용도/디자인이 유사한 중복 계열입니다.
> - 신규 구현 시에는 프로젝트에서 더 많이 사용되는 컴포넌트(`Badge`, `DatePicker.tsx` 계열, `ToggleSwitch`)를 우선 권장합니다.

---

## 6. 패널/모달 컴포넌트

> 위치: `src/components/panels/`  
> import: `@/components/panels` (index.ts에서 통합 export)

| 컴포넌트 | 파일 | 줄 수 | 설명 |
|----------|------|-------|------|
| `ChecklistPanel` | `ChecklistPanel.tsx` | 928 | 점검표 편집 (항목 추가/삭제, 드래그 정렬) |
| `StlDailyPanel` | `StlDailyPanel.tsx` | 811 | Sentinel 일상점검 상세 (자동점검, 육안검수, 보고서) |
| `ResourcePanel` | `ResourcePanel.tsx` | 744 | 자원 상세 편집 |
| `SchedulePanel` | `SchedulePanel.tsx` | 599 | 점검스케줄 상세 편집 |
| `UserPanel` | `UserPanel.tsx` | 566 | 사용자 상세 편집 |
| `DailyReportPanel` | `DailyReportPanel.tsx` | 489 | 일상점검 보고서 뷰어 |
| `SpecialPanel` | `SpecialPanel.tsx` | 485 | 특별점검 상세 편집 |
| `SystemDetailPanel` | `SystemDetailPanel.tsx` | 340 | 시스템 상세 정보 |
| `NoticePanel` | `NoticePanel.tsx` | 304 | 공지사항 편집 |
| `GroupMgmtModal` | `GroupMgmtModal.tsx` | 217 | 그룹 관리 모달 |
| `StlSpecialPanel` | `StlSpecialPanel.tsx` | 207 | Sentinel 특별점검 입력 폼 |
| `BatchInspModal` | `BatchInspModal.tsx` | 172 | 일괄점검 모달 (자원 선택, 쿨다운 타이머) |
| `GroupPanel` | `GroupPanel.tsx` | — | 그룹 편집 패널 |
| `LibViewPanel` | `LibViewPanel.tsx` | — | 라이브러리 뷰 |
| `DailyRequestPanel` | `DailyRequestPanel.tsx` | — | 일상점검 요청 |
| `CodePanel` | `CodePanel.tsx` | — | 코드 편집 |
| `ExcelUploadModal` | `ExcelUploadModal.tsx` | — | 엑셀 업로드 |
| `AddSystemModal` | `AddSystemModal.tsx` | — | 시스템 추가 모달 |
| `VCAddPanel` | `VCAddPanel.tsx` | — | 검증코드 추가 |

### 패널 사용 패턴

```tsx
import { ResourcePanel } from '@/components/panels';

// 행 선택 시 패널 열기
const [selected, setSelected] = useState(null);

<Tbl onRow={(row) => setSelected(row)} ... />
<ResourcePanel item={selected} onClose={() => setSelected(null)} onSave={handleSave} />
```

---

## 7. 레이아웃 컴포넌트

> 위치: `src/components/layout/`

### Header (`Header.tsx`, 304줄)

```tsx
<Header user={user} site="m" siteName="Manager"
  onSiteSwitch={switchFn} onLogout={logoutFn} onPwChange={pwFn} />
```

| Prop | 타입 | 설명 |
|------|------|------|
| `user` | `AuthUser` | 현재 로그인 사용자 |
| `site` | `"m" \| "s"` | 현재 사이트 |
| `siteName` | `string` | 표시 이름 |
| `onSiteSwitch` | `() => void` | Manager ↔ Sentinel 전환 |
| `onLogout` | `() => void` | 로그아웃 |
| `onPwChange` | `() => void` | 비밀번호 변경 |

### Sidebar (`Sidebar.tsx`, 408줄)

```tsx
<Sidebar menuItems={MENU_ITEMS.m} site="m"
  collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />
```

| Prop | 타입 | 설명 |
|------|------|------|
| `menuItems` | `MenuItem[]` | 메뉴 구조 (`lib/constants/menu.ts`) |
| `site` | `"m" \| "s"` | 사이트 테마 |
| `collapsed` | `boolean` | 접힘 여부 |
| `onToggle` | `() => void` | 접힘 토글 |

### NoticeBanner (`NoticeBanner.tsx`, 104줄)

```tsx
<NoticeBanner />  // 상단 공지 배너 (닫기 가능)
```

---

## 8. 데이터(Mock) 구조

> 위치: `src/data/`  
> import: `@/data/파일명` 또는 `@/data` (index.ts 통합)

### 주요 데이터 파일

| 파일 | export | 설명 |
|------|--------|------|
| `systems.ts` | `SYS`, `_mids` | 정보시스템 목록, 중분류 배열 |
| `inspections.ts` | `DI_INIT`, `SCH`, `_dailyMenu`, `_specMenu` | 일상점검 데이터, 스케줄, 메뉴 구조 |
| `resources.ts` | `RES` | 자원 목록 |
| `reports.ts` | `RPT_INIT` | 보고서 데이터 |
| `checklists.ts` | `CL_INIT` | 점검표 초기 데이터 |
| `users.ts` | `USERS` | 사용자 목록 |
| `boards.ts` | `BOARDS` | 게시판 데이터 |
| `common.ts` | `COMMON_CODES` | 공통코드 |
| `notices.ts` | `NOTICES` | 공지사항 |
| `schedules.ts` | `SCHEDULES` | 스케줄 |
| `verification-codes.ts` | `VC_INIT` | 검증코드 |
| `manager.ts` | — | 관리자 전용 데이터 |

### 메뉴 구조 예시

```ts
// _dailyMenu — InspFilter에서 사용
export const _dailyMenu = [
  { label: "상태점검",   sub: ["서버","WEB","WAS","DBMS","네트워크","보안","스토리지","백업","서비스","유효성"] },
  { label: "유효성점검", sub: ["서버","WEB","WAS","DBMS","네트워크","보안","스토리지","백업","서비스","유효성"] },
  { label: "서비스점검", sub: ["서버","WEB","WAS","DBMS","네트워크","보안","스토리지","백업","서비스","유효성"] },
];

// _specMenu — 특별점검용 (하위 메뉴 없음)
export const _specMenu = [
  { label: "이중화점검" },
  { label: "성능점검" },
  { label: "업무집중기간점검" },
  { label: "오프라인점검" },
];
```

---

## 9. Context (전역 상태)

### AuthContext (`AuthContext.tsx`)

```tsx
import { useAuth } from '@/contexts/AuthContext';

const { isAuthenticated, user, login, logout, switchSite } = useAuth();
```

| 값 | 타입 | 설명 |
|----|------|------|
| `isAuthenticated` | `boolean` | 로그인 여부 |
| `user` | `AuthUser` | `{ userId, userNm, userRole, useYn }` |
| `login(id, pw)` | `function` | 로그인 처리 |
| `logout()` | `function` | 로그아웃 |
| `switchSite()` | `function` | Manager ↔ Sentinel 전환 |

### DIContext (`DIContext.tsx`)

```tsx
import { useDI } from '@/contexts/DIContext';

const { di, addDI, updateDI } = useDI();
```

| 값 | 타입 | 설명 |
|----|------|------|
| `di` | `DailyInspection[]` | 일상점검 데이터 배열 |
| `addDI(item)` | `function` | 점검 추가 |
| `updateDI(id, data)` | `function` | 점검 수정 |

### CLContext (`CLContext.tsx`)

```tsx
import { useCL } from '@/contexts/CLContext';

const { cl, setCL, addCL, updateCL, deleteCL } = useCL();
```

| 값 | 타입 | 설명 |
|----|------|------|
| `cl` | `Checklist[]` | 점검표 데이터 배열 |
| `setCL` | `function` | 전체 교체 |
| `addCL`, `updateCL`, `deleteCL` | `function` | CRUD |

---

## 10. 테마 & 스타일 시스템

### 10.1 색상 (`src/lib/theme/colors.ts`)

```tsx
import { C } from '@/lib/theme/colors';
```

`C` 는 현재 활성 테마의 색상 팔레트입니다.

#### 기본 색상 (양쪽 사이트 공통)

| 키 | 값 | 용도 |
|----|----|------|
| `C.white` | `#fff` | 흰 배경 |
| `C.bg` | `#F9FAFC` | 페이지 배경 |
| `C.bgSec` | `#E9ECF3` | 보조 배경 |
| `C.brd` | `#EEEEEE` | 테두리 (기본) |
| `C.brdD` | `#D7D7D7` | 테두리 (진한) |
| `C.txH` | `#111111` | 텍스트 (제목) |
| `C.txt` | `#333333` | 텍스트 (본문) |
| `C.txS` | `#666666` | 텍스트 (보조) |
| `C.txL` | `#929292` | 텍스트 (흐린) |
| `C.txX` | `#BBBBBB` | 텍스트 (매우 흐린) |
| `C.red` | `#E24949` | 빨강 (에러, 지연) |
| `C.green` | `#19973C` | 초록 (성공) |
| `C.purp` | `#9333EA` | 보라 |

#### 테마별 색상 (Manager `m` / Sentinel `s`)

| 키 | Manager (`m`) | Sentinel (`s`) | 용도 |
|----|--------------|----------------|------|
| `C.pri` | `#339CD5` 파랑 | `#19973C` 초록 | Primary 색상 |
| `C.priL` | `#E6F3FA` | `#E8F5EC` | Primary 연한 배경 |
| `C.priD` | `#2580AF` | `#147A30` | Primary 진한 |
| `C.sec` | `#457CE1` | `#19973C` | Secondary |
| `C.secL` | `#457CE11A` | `#19973C1A` | Secondary 연한 (hover 등) |
| `C.brand` | `#005CB9` | `#15803D` | 브랜드 컬러 |
| `C.brandG` | 파랑 그라데이션 | 초록 그라데이션 | 사이드바 배경 등 |

#### 테마 전환

```tsx
import { setTheme, C } from '@/lib/theme/colors';

setTheme("m");  // Manager 테마 적용
setTheme("s");  // Sentinel 테마 적용

// 이후 C.pri, C.sec 등이 해당 테마 색상으로 변경됨
```

### 10.2 공통 스타일 프리셋 (`src/lib/theme/styles.ts`)

```tsx
import { LABEL_STYLE, LABEL_STYLE_SM, fInput, fSelect, fTextarea, TH, TD } from '@/lib/theme/styles';
```

| 스타일 | 설명 | 사용처 |
|--------|------|--------|
| `LABEL_STYLE` | 폼 라벨 기본 스타일 | 검색폼 위 라벨 |
| `LABEL_STYLE_SM` | 폼 라벨 (작은 사이즈) | 검색폼 위 라벨 |
| `fInput` | input 기본 스타일 | `FInput` 내부에서 사용 |
| `fSelect` | select 기본 스타일 (커스텀 chevron 포함) | `FSelect` 내부에서 사용 |
| `fTextarea` | textarea 기본 스타일 | `FTextarea` 내부에서 사용 |
| `TH(sx?)` | 테이블 헤더 셀 스타일 팩토리 | `Tbl` 내부 |
| `TD(sx?)` | 테이블 바디 셀 스타일 팩토리 | `Tbl` 내부 |

### 10.3 상태 색상 (`src/lib/theme/status-colors.ts`)

```tsx
import { SC } from '@/lib/theme/status-colors';

// SC["완료"] → { b: "rgba(49,187,72,0.12)", t: "#22882E" }
// b = background, t = text color
```

50가지 이상의 상태 문자열에 대한 색상 매핑이 정의되어 있습니다.  
새로운 상태가 필요하면 이 파일에 `"상태명": { b: "배경색", t: "텍스트색" }` 형태로 추가합니다.

### 10.4 폰트

```
Pretendard Variable (CDN)
```

CDN 링크가 `app/layout.tsx`의 `<head>`에 포함되어 있으며,  
`globals.css`와 `PRETENDARD_FONT` 상수에서 폰트 패밀리를 정의합니다.

---

## 11. 타입 정의

> 위치: `src/types/`  
> import: `@/types` (index.ts 통합) 또는 `@/types/파일명`

| 파일 | 주요 타입 |
|------|-----------|
| `resource.ts` | 자원 관련 타입 |
| `inspection.ts` | 점검 관련 타입 |
| `report.ts` | 보고서 관련 타입 |
| `user.ts` | 사용자 타입 (`User`) |
| `checklist.ts` | 점검표 타입 |
| `board.ts` | 게시판 타입 |
| `common.ts` | 공통코드 타입 |
| `schedule.ts` | 스케줄 타입 |
| `system.ts` | 시스템 타입 |
| `menu.ts` | 사이드바 메뉴 타입 (`MenuItem`) |
| `notice.ts` | 공지사항 타입 |
| `verification-code.ts` | 검증코드 타입 |

---

## 12. 새 페이지 만들기

### Step 1: 파일 생성

```
src/app/manager/새기능/page.tsx
```

### Step 2: 기본 구조

```tsx
// @ts-nocheck
'use client';

import { useState } from 'react';
import { PH } from '@/components/ui/PageHeader';
import { Btn, SearchBtn, RefreshBtn } from '@/components/ui/Button';
import { Tbl } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { FInput, FSelect } from '@/components/ui/Input';
import { SB } from '@/components/ui/SearchBar';
import { C } from '@/lib/theme/colors';
import { LABEL_STYLE_SM } from '@/lib/theme/styles';

export default function NewFeaturePage() {
  const [data] = useState([
    { id: 1, name: "항목1", status: "완료" },
    { id: 2, name: "항목2", status: "지연" },
  ]);
  const [kw, setKw] = useState('');

  const filtered = data.filter(x => {
    const q = kw.trim().toLowerCase();
    if (q && !x.name.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div>
      <PH title="새 기능" bc="홈 > 새 기능" />

      {/* 검색폼 */}
      <SB onSearch={() => {}} onReset={() => setKw('')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ ...LABEL_STYLE_SM }}>검색</span>
          <FInput value={kw} onChange={e => setKw(e.target.value)} placeholder="검색어" />
        </div>
      </SB>

      {/* 테이블 */}
      <Tbl
        secTitle="목록"
        secCount={filtered.length}
        cols={[
          { t: 'No.',   k: 'id',     w: 60 },
          { t: '이름',   k: 'name',   align: 'left' },
          { t: '상태',   k: 'status', w: 80, r: (v) => <Badge status={v} /> },
        ]}
        data={filtered}
      />
    </div>
  );
}
```

### Step 3: 라우트 등록 (선택)

사이드바 메뉴에 추가하려면:

1. `src/lib/constants/routes.ts` — 라우트 경로 추가
2. `src/lib/constants/menu.ts` — 메뉴 아이템 추가

---

## 13. 컴포넌트 수정 가이드

### 기존 컴포넌트 스타일 수정

1. 해당 컴포넌트 파일을 열고 인라인 `style={{}}` 을 직접 수정
2. 색상은 반드시 `C.xxx` 상수를 사용 (하드코딩 금지)
3. 수정 후 `pnpm build` 로 빌드 확인

### 새 UI 컴포넌트 추가

1. `src/components/ui/NewComponent.tsx` 파일 생성
2. `export interface`로 Props 정의
3. `export function` 또는 `export const`로 컴포넌트 내보내기
4. 필요 시 `src/components/ui/index.ts`에 re-export 추가

### 패널/모달 추가

1. `src/components/panels/NewPanel.tsx` 파일 생성
2. `src/components/panels/index.ts`에 export 추가
3. 페이지에서 `import { NewPanel } from '@/components/panels'`

### 검색폼 패턴

모든 검색폼은 동일한 패턴을 따릅니다:

```tsx
// 1. 필터 상태
const [kw, setKw] = useState('');
const [fType, setFType] = useState('');

// 2. applied 패턴 (검색 버튼 누를 때만 적용)
const [applied, setApplied] = useState({ kw: '', fType: '' });
const doSearch = () => setApplied({ kw, fType });
const doReset = () => { setKw(''); setFType(''); setApplied({ kw: '', fType: '' }); };

// 3. 데이터 필터링 (applied 기준)
const filtered = data.filter(x => {
  if (applied.fType && x.type !== applied.fType) return false;
  const q = applied.kw.trim().toLowerCase();
  if (q && !x.name.toLowerCase().includes(q)) return false;
  return true;
});
```

### 좌측 필터 + 우측 테이블 레이아웃

```tsx
<div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 14 }}>
  {/* 좌측: 필터 */}
  <Card title="점검종류" style={{
    position: 'sticky', top: 20,
    maxHeight: 'calc(100vh - 170px)',
    overflow: 'hidden', display: 'flex', flexDirection: 'column'
  }}>
    <InspFilter menus={menu} sel={sel} sub={sub} onSelect={handleSelect} data={data} />
  </Card>

  {/* 우측: 검색 + 테이블 */}
  <div style={{ minWidth: 0 }}>
    {/* 검색폼 */}
    {/* 테이블 */}
  </div>
</div>
```

---

## 14. 코드 규칙

### 파일 상단 필수 주석

```tsx
// @ts-nocheck          ← TypeScript 에러 억제 (퍼블리싱용)
'use client';            ← Next.js 클라이언트 컴포넌트 선언
```

### Import 규칙

```tsx
// 1. React / Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. UI 컴포넌트 — 개별 파일에서 직접 import
import { PH } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Button';
import { Tbl } from '@/components/ui/Table';

// 3. 패널/모달 — index.ts에서 통합 import
import { ResourcePanel, AddSystemModal } from '@/components/panels';

// 4. Context
import { useAuth } from '@/contexts/AuthContext';
import { useDI } from '@/contexts/DIContext';

// 5. 데이터
import { SYS } from '@/data/systems';
import { _dailyMenu } from '@/data/inspections';

// 6. 테마/스타일
import { C } from '@/lib/theme/colors';
import { LABEL_STYLE_SM, fInput, fSelect } from '@/lib/theme/styles';

// 7. 라우트/메뉴 상수
import { ROUTES } from '@/lib/constants/routes';
import { MENU_ITEMS } from '@/lib/constants/menu';
```

### Import 별칭 (`@/`)

`tsconfig.json`에 정의된 경로 별칭:

```json
{ "paths": { "@/*": ["./src/*"] } }
```

| 별칭 | 실제 경로 |
|------|-----------|
| `@/components/ui/...` | `src/components/ui/...` |
| `@/components/panels` | `src/components/panels/index.ts` |
| `@/components/layout` | `src/components/layout/index.ts` |
| `@/contexts/...` | `src/contexts/...` |
| `@/data/...` | `src/data/...` |
| `@/lib/theme/...` | `src/lib/theme/...` |
| `@/lib/constants/...` | `src/lib/constants/...` |
| `@/types/...` | `src/types/...` |

### 스타일 규칙

1. **CSS 파일 사용 금지** — 모든 스타일은 인라인 `style={{}}` 사용
2. **색상 하드코딩 금지** — 반드시 `C.xxx` 상수 사용
3. **공통 스타일 재사용** — `fInput`, `fSelect`, `LABEL_STYLE_SM` 등 활용
4. **단위는 px** — rem/em 사용하지 않음
5. **폰트**: `fontFamily: "inherit"` 또는 `PRETENDARD_FONT` 상수

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 페이지 컴포넌트 | `PascalCase` + `Page` 접미사 | `ManagerDashboardPage` |
| UI 컴포넌트 | `PascalCase` | `InspFilter`, `StatCard` |
| 상수/Mock 데이터 | `UPPER_SNAKE` 또는 `_접두사` | `SYS`, `_dailyMenu`, `DI_INIT` |
| 컨텍스트 훅 | `use` + 도메인 | `useAuth`, `useDI`, `useCL` |
| 스타일 함수 | `camelCase` | `itemS()`, `subS()` |
| 상태 변수 | `camelCase` / 축약 허용 | `fKind`, `dtFrom`, `kw` |

---

## 15. 빌드 & 검증

### 빌드 명령어

```bash
pnpm build
```

성공 시 29개 페이지가 모두 정적 생성됩니다:

```
Route (app)                                 Size
┌ ○ /                                    1.42 kB
├ ○ /login                               5.68 kB
├ ○ /manager/dashboard                   10.4 kB
├ ○ /manager/resources                   5.15 kB
│   ... (총 29개 라우트)
└ ○ /sentinel/special-inspection         2.71 kB
```

### 빌드 확인 체크리스트

- [ ] `pnpm build` 에러 없이 완료
- [ ] 모든 페이지가 `○ (Static)` 으로 표시
- [ ] 타입 에러 없음 (`// @ts-nocheck` 사용 중이므로 빌드 시에는 무시됨)

### 개발 서버 확인

```bash
pnpm dev
```

- Manager: `http://localhost:3000/manager/dashboard`
- Sentinel: `http://localhost:3000/sentinel/dashboard`
- 로그인: 아무 ID/PW 입력 시 자동 로그인 (Mock)

---

## 16. 트러블슈팅

### `Module not found` 에러

Import 경로 확인. `@/` 별칭은 `src/` 를 가리킵니다.

```tsx
// ✗ 잘못된 경로
import { Btn } from '../components/ui/Button';

// ✓ 올바른 경로
import { Btn } from '@/components/ui/Button';
```

### 빌드 시 캐시 문제

```bash
rm -rf .next && pnpm build
```

### 새 Mock 데이터 추가

1. `src/data/새파일.ts` 에 데이터 정의 + export
2. `src/data/index.ts` 에 `export * from "@/data/새파일"` 추가
3. 필요 시 `src/types/새파일.ts` 에 타입 정의

### 새 상태 배지 색상 추가

`src/lib/theme/status-colors.ts` 에 추가:

```ts
export const STATUS_COLORS = {
  // ... 기존 항목
  "새상태": { b: "rgba(R,G,B,0.12)", t: "#HEX" },
};
```

### Context Provider 누락

`DIContext`나 `CLContext`를 사용하는 페이지가 Provider 범위 밖에 있으면 에러 발생.  
해당 Provider는 각 layout.tsx에 배치되어야 합니다.

---

## 파일 통계 요약

| 구분 | 파일 수 | 총 줄 수 |
|------|---------|---------|
| 페이지 (`app/`) | 29 | ~6,300 |
| UI 컴포넌트 (`components/ui/`) | 32 | ~3,200 |
| 패널/모달 (`components/panels/`) | 19 | ~5,600 |
| 레이아웃 (`components/layout/`) | 4 | ~820 |
| 데이터 (`data/`) | 13 | ~800 |
| 타입 (`types/`) | 13 | ~400 |
| 테마/상수/훅 (`lib/`) | 5 | ~310 |
| **합계** | **~115** | **~17,400** |
