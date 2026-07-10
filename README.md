# 흡연 구역 탐색 앱(여기흡연)
현재 앱은 Next.js와 React 기반으로 리팩토링되었습니다. 로컬에서 실행하려면 다음을 수행하세요.

1. 의존성 설치

```bash
npm install
```

2. 개발 서버 실행

```bash
npm run dev
```

앱 진입점: `src/pages/index.jsx`, 주요 컴포넌트는 `src/components`에 있습니다.

## 카카오 로그인 플로우 (프론트엔드 적용)

이 앱은 프론트엔드에서 카카오 인가 코드를 받아 백엔드로 전달하는 방식으로 구성됩니다.

- `src/pages/mypage.jsx`: 카카오 로그인 버튼, 카카오 인가 코드 수신, 백엔드 `/api/auth/kakao` 호출, JWT 저장을 담당합니다.
- `src/context/AppContext.jsx`: 로그인 상태, JWT `authToken`, 사용자 정보 `user`를 관리합니다.
- `src/components/Header.jsx`: 로그인된 경우 닉네임을 표시합니다.
- `src/api.js`: JWT를 포함한 API 호출 헤더를 생성하는 헬퍼(`createAuthHeaders`)를 제공합니다.

### 동작 흐름

1. 사용자가 `마이 페이지`에서 `카카오 로그인` 버튼을 누르면 카카오 로그인 화면으로 이동합니다.
2. 로그인을 완료하면 카카오가 `code`를 쿼리 파라미터로 붙여서 `/mypage`로 리디렉션합니다.
3. 프론트엔드는 받은 `code`를 백엔드 `POST /api/auth/kakao`로 전송합니다.
4. 백엔드는 카카오에 `code`를 전달해 사용자 정보를 얻고 JWT를 발급합니다.
5. 프론트엔드는 JWT를 로컬 스토리지에 저장하고 이후 API 요청에 `Authorization: Bearer <JWT>` 헤더를 포함해 호출합니다.

### 환경 변수

```bash
NEXT_PUBLIC_KAKAO_CLIENT_ID=여기에_카카오_REST_API_KEY
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

- `NEXT_PUBLIC_KAKAO_CLIENT_ID`: 카카오 개발자 콘솔에서 발급받은 REST API 키
- `NEXT_PUBLIC_BACKEND_URL`: 백엔드 API 서버 주소

> 백엔드가 없는 경우 이 앱은 프론트엔드 로그인 시도까지만 보여줍니다. 실제 JWT 발급은 분리된 백엔드 서비스에서 구현해야 합니다。
