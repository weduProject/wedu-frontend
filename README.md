# 💍 WEDU Web

> AI 기반 맞춤형 프로포즈 추천과 결혼 준비를 위한 올인원 웹 플랫폼

---

# 📖 프로젝트 소개

WEDU는 AI 기반 심리테스트를 통해 사용자에게 맞춤형 프로포즈를 추천하고, 프로포즈 상품 탐색부터 예약, 일정 관리, D-Day, 체크리스트까지 결혼 준비 전 과정을 하나의 플랫폼에서 관리할 수 있는 웹 서비스입니다.

현재 프로젝트는 초기 MVP(Web) 개발을 목표로 진행 중이며, UI 및 기능은 개발 과정에서 지속적으로 개선될 예정입니다.

---

# 👥 팀원

| 파트 | 팀원 |
|------|------|
| PM | 배윤아 |
| Design | 천지향 |
| Frontend | 이예은, 주연우, 남건우, 오서진 |
| Backend (Spring Boot) | 김미미, 신경환, 이다은, 유완규 |

> **세부 기능별 역할 분담은 1차 회의 이후 확정 예정입니다.**

---

# 🚀 기술 스택

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

### Collaboration

- GitHub
- Notion
- Figma

---

# 📂 폴더 구조

```text
src
├── assets
├── components
│   ├── common
│   ├── layout
│   ├── planner
│   ├── product
│   ├── recommend
│   └── community
├── pages
│   ├── Home
│   ├── Login
│   ├── Signup
│   ├── PsychologicalTest
│   ├── Recommendation
│   ├── Product
│   ├── ProductDetail
│   ├── Planner
│   ├── Community
│   └── MyPage
├── api
├── hooks
├── layouts
├── router
├── styles
├── utils
└── main.tsx
```

---

# 🌱 브랜치 전략

```text
main
 └── dev
      ├── feature/login
      ├── feature/signup
      ├── feature/test
      ├── feature/recommend
      ├── feature/product
      ├── feature/planner
      ├── feature/community
      └── feature/mypage
```

| 브랜치 | 설명 |
|---------|------|
| main | 배포 브랜치 |
| dev | 개발 통합 브랜치 |
| feature/* | 기능 개발 브랜치 |

---

# 📝 Commit Convention

| Type | Description |
|------|-------------|
| feat | 새로운 기능 추가 |
| fix | 버그 수정 |
| refactor | 코드 리팩토링 |
| style | 코드 스타일 수정 |
| docs | 문서 수정 |
| test | 테스트 코드 |
| chore | 기타 설정 변경 |

### Example

```text
feat: 로그인 페이지 구현
fix: 추천 결과 오류 수정
docs: README 업데이트
```

---

# 🔀 PR Convention

### PR 제목

```text
[FE] 기능명
```

### 예시

```text
[FE] 로그인 페이지 구현
```

### PR 내용

```text
## 작업 내용

## 변경 사항

## 테스트 결과

## 참고 사항
```

---

# 💻 실행 방법

```bash
pnpm install
pnpm run dev
```

---

# 🖥 화면 목록

| 화면 ID | 화면명 |
|----------|---------|
| HOME-001 | 홈 |
| LOGIN-001 | 로그인 |
| SIGNUP-001 | 회원가입 |
| TEST-001 | 심리테스트 |
| RESULT-001 | 추천 결과 |
| PRODUCT-001 | 프로포즈 상품 목록 |
| PRODUCT-002 | 상품 상세 |
| PLANNER-001 | 프로포즈 플래닝 |
| COMMUNITY-001 | 커뮤니티 |
| MYPAGE-001 | 마이페이지 |

---

# 🔄 사용자 플로우

```text
홈
↓
로그인 / 회원가입
↓
심리테스트
↓
추천 결과
↓
프로포즈 상품 탐색
↓
상품 상세
↓
예약
↓
프로포즈 플래닝
(D-Day / 일정관리 / 체크리스트)
↓
마이페이지
```

---

# 📌 프로젝트 진행 현황

- ✅ GitHub Repository 생성
- ✅ README 작성
- ✅ Branch Strategy 수립
- ⏳ React + TypeScript + Vite 프로젝트 초기 세팅
- ⏳ .gitignore 설정

---

# 📄 License

This project is developed for the WEDU Team Project.