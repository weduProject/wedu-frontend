# 💍 WEDU

> 심리테스트 기반 맞춤 프로포즈 추천 + 웨딩 준비 통합 관리 플랫폼

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)

배포: https://wedu.io.kr/

---

## 📖 프로젝트 소개

WEDU는 **심리테스트로 커플의 프로포즈 취향을 분석**해 맞춤 상품과 스타일을 추천하고, 프로포즈 준비부터 웨딩홀·스드메·허니문 탐색, D-day·예산·체크리스트·일정 관리, 모바일 청첩장 제작까지 결혼 준비의 전 과정을 하나의 서비스에서 관리할 수 있는 웹 플랫폼입니다.

가장 핵심이 되는 가치는 **"취향 진단 → 맞춤 추천"** 흐름입니다. 온보딩 단계에서 12문항 심리테스트와 파트너 MBTI를 입력받아 궁합 점수와 추천 프로포즈 스타일을 제시하고, 이 결과를 프로포즈 빌더의 장소/분위기/음식/예산 추천에도 이어서 활용합니다.

---

## 🚀 주요 기능

`App.tsx` 라우팅 기준으로 실제 구현된 화면입니다.

### 로그인 & 온보딩
- 카카오 / 구글 소셜 로그인 (`/login`, `/auth/callback`)
- 심리테스트 온보딩: 인트로 → 퀴즈(다중 선택 포함) → 파트너 MBTI 입력 → 결과 (`/onboarding` ~ `/onboarding/result`)
- 결과 페이지에서 궁합 점수(%)와 추천 프로포즈 스타일 제시

### 프로포즈 상품샵 (Shop)
- 카테고리·스타일 필터, 검색, 취향 파인더(`TasteFinder`)
- 상품 상세, 장바구니, 찜하기 (`/shop`, `/shop/:id`, `/shop/cart`, `/shop/wishlist`)
- 인기 상품 랭킹 연동

### 나만의 프로포즈 빌더 (Builder)
- 장소 → 분위기 → 음식 → 예산 순 4단계 선택형 빌더 (`/builder-start`, `/builder`)
- 선택한 스타일/예산 기준 맞춤 추천 상품 및 빌더 전용 장바구니 (`/builder/cart`)

### 웨딩 정보 (WeddingShop / WeddingEstimate / Magazine)
- 웨딩 룩북 목록/상세 (`/wedding-shop`, `/wedding-shop/:id`)
- 웨딩 견적 시뮬레이션 (`/wedding-estimate`)
- 웨딩 매거진 콘텐츠 (`/magazine`)

### 웨딩 준비 관리
- D-day 대시보드 (`/dday`)
- 예산 관리: 카테고리별 목표/집행 금액, 진행률 (`/budget`)
- 체크리스트: 카테고리별 항목 관리, 진행률, 읽기 전용 공유 링크 (`/checklist`, `/shared/checklist/:token`)
- 캘린더 일정 관리 (`/calendar`)

### 커뮤니티
- 게시글 목록/상세/작성, 카테고리 필터, 좋아요, 댓글 (`/community`, `/community/:id`, `/community/write`)

### 모바일 청첩장
- 청첩장 템플릿 갤러리, 만들기, 상세 미리보기 (`/invitation`, `/invitation/create`, `/invitation/:id`)

### 마이페이지 & 파트너 연결
- 대시보드(D-day/예산/체크리스트 요약, 퀵메뉴), 프로필 수정 (`/mypage`, `/mypage/dashboard`, `/mypage/edit`)
- 파트너 계정 연결 (`/connect`)
- 외부 공유용 읽기 전용 페이지 (`/share/:token`)

---

## 🛠 기술 스택

`package.json` 기준입니다.

| 구분 | 스택 |
|---|---|
| 프레임워크 | React 19, TypeScript |
| 빌드 도구 | Vite 8 |
| 스타일링 | Tailwind CSS v4 (`@tailwindcss/vite`) |
| 라우팅 | React Router 7 |
| 아이콘 | lucide-react |
| HTTP 클라이언트 | axios (+ 자체 `fetch` 기반 `apiClient`) |
| 유틸 | clsx |
| 패키지 매니저 | pnpm (workspace) |
| 린트 | ESLint 10 + typescript-eslint |
| 배포 | Vercel |

---

## 📂 프로젝트 구조

```
src/
├── components/
│   ├── layout/        # Header, Footer, PageLayout
│   └── ui/             # Button, TextField, BaseCard, SelectableCard,
│                        # Tabs, CategoryBadge, ProgressBar, EmptyState, ConfirmDeleteModal
├── contexts/            # AuthContext, DDayContext (전역 상태)
├── lib/                 # apiClient(공용 fetch 래퍼), oauth
├── pages/
│   ├── Landing/          # 랜딩 페이지 (Hero, Feature, Stats, Testimonial 등 섹션 구성)
│   ├── Login/             # 소셜 로그인, OAuth 콜백
│   ├── Onboarding/       # 심리테스트 퀴즈, 파트너 MBTI, 결과
│   ├── Shop/               # 프로포즈 상품샵 (목록/상세/장바구니/찜)
│   ├── Builder/            # 프로포즈 빌더 (4단계 선택 + 추천 + 장바구니)
│   ├── WeddingShop/       # 웨딩 룩북
│   ├── WeddingEstimate/   # 웨딩 견적
│   ├── WeddingMagazine/   # 웨딩 매거진
│   ├── Dashboard/          # D-day 대시보드
│   ├── Budget/              # 예산 관리
│   ├── Checklist/           # 체크리스트 (+ 공유 페이지)
│   ├── Calendar/            # 일정 관리
│   ├── Community/          # 커뮤니티
│   ├── Mypage/              # 마이페이지 · 프로필 수정
│   ├── Partner/             # 파트너 연결
│   ├── invitation/          # 모바일 청첩장
│   └── Share/                # 외부 공유 페이지
└── App.tsx                # 라우팅 + 전역 Provider 조합
```

---

## 🎨 디자인 시스템

`src/index.css`의 `@theme` 기준입니다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-primary` | `#E8796C` | 브랜드 메인 컬러 |
| `--color-primary-light` | `#FDF2F6` | 연한 강조 배경 |
| `--color-surface` | `#FDFBF9` | 카드/섹션 배경 |
| `--color-border` | `#EAE4D8` | 테두리 |
| `--color-text` / `--color-text-muted` | `#221A18` / `#8D8482` | 본문 / 보조 텍스트 |
| `--color-rosegold-1~4` | 로즈골드 계열 4단계 | 로고 텍스트 그라디언트 (`.text-rosegold`) |
| `--color-btn-from/mid/to` | 버튼 전용 그라디언트 | `.gradient-primary-bg`, `.category-tab-active` |

- **폰트**: 제목(`h1~h6`)은 `--font-serif`(Playfair Display), 본문은 `--font-sans`(Noto Sans KR)
- **카테고리 탭**: `.category-tab-active` / `.category-tab-inactive` 공용 클래스로 선택 상태 통일
- **공용 UI 컴포넌트**(`src/components/ui`): `Button`(variant: main/secondary/wishlist/pill), `TextField`, `BaseCard`, `SelectableCard`, `Tabs`, `CategoryBadge`, `ProgressBar`, `EmptyState`, `ConfirmDeleteModal` — 페이지마다 제각각이던 버튼/카드/빈 상태 UI를 이 컴포넌트들로 표준화

---

## 🧩 개발 과정 & 트러블슈팅

프로젝트를 진행하며 실제로 부딪혔던 문제들과 해결 과정입니다.

**스웨거 문서와 실제 응답이 다를 때**
Product·Cart·Wishlist·인기상품(PopularProduct) 등 도메인별로 API 연동을 나눠 맡았는데, 스웨거 문서만 보고 짠 타입과 실제 백엔드 응답이 어긋나는 경우가 종종 있었습니다. 인기상품 API가 실제 상품 ID 대신 랭킹 테이블의 ID를 내려주거나, 이미지 URL이 응답마다 상대경로/절대경로를 오갔던 게 대표적입니다. 이런 이슈는 실제 응답을 콘솔에 찍어가며 확인하고, 프론트 쪽에서 정규화(normalize) 함수로 방어 코드를 짜는 동시에 백엔드팀과 스키마를 맞춰나가는 방식으로 풀었습니다.

**여러 브랜치를 병렬로 굴리며 겪은 충돌**
기능별 브랜치(`feature/geon`, `feature/like`, `feature/schedules` 등)를 동시에 운영하다 보니 병합 충돌이 잦았습니다. 특히 `Header.tsx`의 네비게이션 링크 배열이 여러 브랜치에서 각자 추가되며 중복 선언되거나, `App.tsx`의 라우팅 구조가 서로 다른 방식으로 바뀌어 충돌하는 일이 있었습니다. 한 번은 팀원 노트북 배터리가 방전돼 로컬에서 작업을 이어갈 수 없는 급한 상황이 있었는데, 그때는 GitHub 웹 에디터로 직접 접속해 원격에서 충돌을 해결하고 넘어간 적도 있습니다.

**npm → pnpm 워크스페이스 전환**
프로젝트 중반에 패키지 매니저를 npm에서 pnpm 워크스페이스로 옮기면서 `workspace:` 프로토콜을 npm이 이해하지 못해 설치가 깨지는 이슈를 겪었고, 이후로는 팀 전체가 pnpm으로 통일해서 사용하고 있습니다.

**디자인 시스템 통일 리팩토링**
4명이 각자 다른 톤으로 화면을 만들다 보니 프로젝트 막바지에 색상 하드코딩(각자 다른 코랄/로즈 계열 hex 값), 레이아웃 패딩 방식이 제각각이었습니다. 이를 `index.css`의 `@theme` 토큰과 공용 UI 컴포넌트로 통일하는 리팩토링을 진행했습니다. 특히 `PageLayout`이 헤더 높이만큼 상단 여백(`pt-[80px]`)을 이미 처리해주는데, 개별 페이지에서 `pt-20` 같은 자체 여백을 또 주는 바람에 헤더 아래 공백이 이중으로 벌어지는 문제가 여러 페이지에서 반복적으로 발견됐습니다. 이 패턴을 찾을 때마다 페이지 컨테이너에 음수 마진을 줘서 `PageLayout`의 기본 패딩을 뚫고 나간 뒤 내부에서 다시 여백을 잡는 "풀블리드 레이아웃 패턴"으로 표준화해서 정리했습니다.

**상태관리 버그**
온보딩 퀴즈를 재응시할 때 이전 답변이 초기화되지 않고 남아있던 버그가 있어 `OnboardingContext`에 `resetQuiz` 초기화 로직을 추가해 해결했습니다.

---

## 💻 실행 방법

패키지 매니저는 pnpm을 사용합니다.

```bash
pnpm install
pnpm run dev       # 개발 서버 실행
```

```bash
pnpm run build     # 프로덕션 빌드 (tsc -b && vite build)
pnpm run preview   # 빌드 결과 미리보기
pnpm run lint      # ESLint 검사
```

---

## 👥 팀 소개

| 파트 | 이름 | 담당 |
|---|---|---|
| PM | 배윤아 | 프로젝트 관리 |
| Design | 천지향 | 디자인 |
| Backend | 김미미, 신경환, 이다은, 유완규 | Spring Boot API 서버 |

### Frontend 역할 분담

| 담당자 | 주요 FE 담당 범위 | 최종 단계 역할 |
|---|---|---|
| **이예은** | 편집샵·상품·인기 프로포즈·찜하기·장바구니·웨딩 룩북 | Notion-FE 정리 / 배포 및 API 연동 |
| **남건우** | 로그인 UI·온보딩·취향테스트·마이페이지·매거진·파트너 연결 | README / 기능 명세 취합 |
| **오서진** | 나만의 프로포즈(빌더)·커뮤니티·모바일 청첩장 | 담당 페이지 코드 정리 |
| **주연우** | D-day·캘린더·체크리스트·예산관리·웨딩 견적 | 시연 영상 |

### API 연동 분담

| 담당자 | 프론트 기능 | Swagger API | 상태 |
|---|---|---|---|
| 이예은 | 로그인 / 회원가입 / 소셜 로그인 | Auth | 연동 완료 |
| 이예은 | 일정 관리 | Calendar (기본) | 연동 완료 |
| 이예은 | 인기 프로포즈 / 상품 / 장바구니 / 찜하기 | PopularProduct / Product / Cart / Wishlist | 최종 연동 대상 |
| 오서진 | 나만의 프로포즈 / 커뮤니티 | Proposal / Community Post·Like·Comment | 최종 연동 대상 |
| 남건우 | 파트너 / 친구 / 마이페이지 | ShareLink / Friend / User | 최종 연동 대상 |
| 주연우 | D-day / 친구 일정 / 예산 / 체크리스트 | D-day / Calendar / Budget / Checklist | 친구 Calendar 신규 API, Budget 전체 예산 API 부재 이슈 |

---

## 📝 Commit Convention

| Type | 설명 |
|---|---|
| feat | 새로운 기능 추가 |
| fix | 버그 수정 |
| refactor | 코드 리팩토링 |
| style | 코드 스타일 수정 |
| docs | 문서 수정 |
| chore | 기타 설정 변경 |

---

## 📄 License

This project is developed for the WEDU Team Project.
