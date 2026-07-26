# 💍 WEDU Web

> AI 기반 맞춤형 프로포즈 추천과 결혼 준비를 위한 올인원 웹 플랫폼

---

# 📖 프로젝트 소개

WEDU는 프로포즈 상품 탐색부터 나만의 프로포즈 빌더, 웨딩홀/스드메/허니문 정보, 일정 관리(캘린더), 체크리스트, 예산 관리, 커뮤니티까지 결혼 준비 전 과정을 하나의 플랫폼에서 관리할 수 있는 웹 서비스입니다.

배포 링크: https://wedu-phi.vercel.app

---

# 👥 팀원

| 파트 | 팀원 |
|------|------|
| PM | 배윤아 |
| Design | 천지향 |
| Frontend | 이예은, 주연우, 남건우, 오서진 |
| Backend (Spring Boot) | 김미미, 신경환, 이다은, 유완규 |

---

# 🚀 기술 스택

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- lucide-react (아이콘)
- clsx

### Collaboration
- GitHub
- Notion
- Figma
- Vercel (배포)

---

# 📂 폴더 구조

- **src/**
  - **components/**
    - `layout` — Header, SideNav, PageLayout
    - `ui` — 공용 UI 컴포넌트 (Button, TextField, BaseCard, Tabs 등)
  - **contexts/** — AuthContext 등 전역 인증 상태
  - **pages/**
    - `Landing` — 랜딩 페이지
    - `Login` — 로그인
    - `Onboarding` — 온보딩 퀴즈 (심리테스트 기반 맞춤 추천)
    - `Home` — 홈 대시보드 (D-Day, 예산/체크리스트 요약, 다가오는 일정)
    - `Shop` — 프로포즈 편집샵 (상품 목록/상세, 찜, 장바구니)
    - `Builder` — 나만의 프로포즈 빌더
    - `Checklist` — 체크리스트
    - `Calendar` — 캘린더 일정 관리
    - `Budget` — 예산 관리
    - `Community` — 커뮤니티
    - `Mypage` — 마이페이지
  - `App.tsx` — 라우팅 및 전역 Provider 설정


---

# 🌱 브랜치 전략

| 브랜치 | 설명 |
|---------|------|
| `main` | 배포 브랜치 |
| `dev` | 개발 통합 브랜치 (main의 하위 브랜치) |
| `feature/geon` | 기능 개발 브랜치 |
| `feature/like` | 기능 개발 브랜치 |
| `feature/schedules` | 기능 개발 브랜치 |
| `feature/budget` | 기능 개발 브랜치 |
| `feature/seojin` | 기능 개발 브랜치 |
| `feature/yen` | 기능 개발 브랜치 |

---

# 📝 Commit Convention

| Type | Description |
|------|-------------|
| feat | 새로운 기능 추가 |
| fix | 버그 수정 |
| refactor | 코드 리팩토링 |
| style | 코드 스타일 수정 |
| docs | 문서 수정 |
| chore | 기타 설정 변경 |

---

# 💻 실행 방법

```bash
# 패키지 매니저는 pnpm을 사용합니다.
pnpm install
pnpm run dev
```

프로덕션 빌드 확인:
```bash
pnpm run build
```

---

# 🖥 화면 목록

| 경로 | 화면명 |
|------|--------|
| `/` | 랜딩 페이지 |
| `/login` | 로그인 |
| `/onboarding` | 온보딩 시작 |
| `/onboarding/quiz` | 맞춤 프로포즈 퀴즈 |
| `/home` | 홈 대시보드 |
| `/dday` | D-Day 상세 |
| `/shop` | 프로포즈 편집샵 (상품 목록) |
| `/shop/:id` | 상품 상세 |
| `/shop/wishlist` | 찜한 상품 |
| `/shop/cart` | 장바구니 |
| `/builder-start` | 나만의 프로포즈 시작 |
| `/builder` | 프로포즈 빌더 |
| `/checklist` | 체크리스트 |
| `/calendar` | 캘린더 일정 |
| `/budget` | 예산 관리 |
| `/community` | 커뮤니티 |
| `/community/:id` | 커뮤니티 상세 |
| `/mypage` | 마이페이지 |

---

# 🔄 사용자 플로우

# 🔄 사용자 플로우

1. 랜딩 페이지
2. 로그인
3. 온보딩 (맞춤 프로포즈 퀴즈)
4. 홈 대시보드 (D-Day / 예산 / 체크리스트 요약)
5. 프로포즈 편집샵 · 나만의 프로포즈 빌더
6. 캘린더 일정 관리 / 체크리스트 / 예산 관리
7. 커뮤니티
8. 마이페이지


---

# 📌 프로젝트 진행 현황

- ✅ GitHub Repository 생성
- ✅ React + TypeScript + Vite 프로젝트 초기 세팅
- ✅ MVP 핵심 화면 구현 (편집샵, 빌더, 체크리스트, 예산관리, 캘린더, 커뮤니티, 마이페이지)
- ✅ Vercel 배포
- ⏳ 백엔드 API 연동
- ⏳ 상태 관리 고도화

---

# 📄 License

This project is developed for the WEDU Team Project.
