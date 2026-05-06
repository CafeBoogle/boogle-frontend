# 소셜 로그인 로컬 리다이렉트 문제 및 해결

## 문제 상황

로컬(`http://localhost:5174`)에서 소셜 로그인(카카오/네이버) 후  
백엔드가 프론트를 Vercel 배포 URL로 리다이렉트하는 문제가 발생했다.

```
로컬에서 로그인 시도
→ OAuth 인증 완료
→ 백엔드가 https://boogle.vercel.app/auth/success 로 리다이렉트 ← 문제
→ 로컬에서 로그인 상태 확인 불가
```

---

## OAuth 소셜 로그인 전체 흐름

```
1. 유저가 로컬에서 로그인 버튼 클릭
2. 카카오/네이버 OAuth 서버로 이동
3. 유저가 소셜 계정으로 인증
4. OAuth 서버 → 백엔드 콜백 URL로 리다이렉트
   (예: https://api.moonsunpower.com/boogle/api/oauth/kakao/callback)
5. 백엔드에서 유저 정보 처리 후 → 프론트 URL로 리다이렉트
   (예: https://boogle.vercel.app/auth/success?isNewUser=false)
6. 프론트의 AuthSuccess 페이지에서 처리 후 메인으로 이동
```

**문제의 핵심**: 5번에서 백엔드가 리다이렉트하는 프론트 URL이  
Vercel 주소로 고정되어 있어 로컬에서 테스트 불가.

---

## 로컬에서 HTTPS가 필요한 근본 이유

네이버/카카오 상관없이, **이 프로젝트의 인증 구조는 아래와 같다**.

### 인증 방식: JWT + Secure 쿠키

백엔드는 로그인 완료 후 JWT를 `Set-Cookie`로 내려줄 때 `Secure` 플래그를 설정함.

```
Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=None
```

**Secure 플래그란?**  
해당 쿠키는 **HTTPS 연결에서만** 브라우저가 서버로 전송하도록 제한하는 속성.  
HTTP 연결에서는 브라우저가 쿠키를 아예 포함하지 않음.

```
[로컬 HTTP인 경우]
백엔드(HTTPS) → Set-Cookie: access_token=...; Secure
브라우저 → "Secure 쿠키 → HTTPS에서만 전송 가능"
→ http://localhost 요청 시 쿠키 미포함
→ 서버: 인증 정보 없음 → 인증 실패 ❌

[로컬 HTTPS인 경우]
백엔드(HTTPS) → Set-Cookie: access_token=...; Secure
브라우저 → HTTPS 연결이므로 쿠키 포함해서 전송
→ 서버: 인증 정보 확인 → 인증 성공 ✅
```

### SameSite=None 과의 관계

우리 서비스는 프론트(`localhost`)와 백엔드(`api.moonsunpower.com`)가 **서로 다른 도메인(cross-origin)** 구조.  
cross-origin 요청에서 쿠키를 전송하려면 `SameSite=None`이 필요한데,  
브라우저는 `SameSite=None`을 **반드시 `Secure`와 함께** 설정해야만 허용함.

```
SameSite=None; Secure    → cross-origin 요청에서도 쿠키 전송 허용 ✅
SameSite=None (Secure 없음) → 브라우저가 쿠키 자체를 거부 ❌
```

결론: **백엔드가 HTTPS이고 Secure 쿠키를 사용하는 이상, 프론트도 반드시 HTTPS여야 한다.**

---

## 네이버 로그인의 추가 제약

위의 HTTPS 필요성은 카카오/네이버 공통이지만, 네이버는 **Redirect URI 등록 정책 자체**가 더 엄격하다.

### 카카오 vs 네이버 비교

| | 카카오 | 네이버 |
|---|---|---|
| `http://localhost` 등록 | 허용 ✅ | 불가 ❌ |
| `https://localhost` 등록 | 허용 ✅ | 허용 ✅ |

```
http://localhost:5174  ← 네이버에 등록 불가 ❌
https://localhost:5174 ← 네이버에 등록 가능 ✅
```

### 왜 네이버가 더 엄격한가?

OAuth 인가 코드(`code`) 탈취 방지 보안 정책 때문.  
인가 코드가 HTTP를 통해 전달되면 네트워크 도청으로 탈취 가능하므로,  
네이버는 HTTPS 기반 Redirect URI만 허용해 이를 차단함.

### 일반적인 해결 방법 (다른 프로젝트 참고용)

**방법 1: HTTPS 로컬 서버 사용 (추천)**

`vite-plugin-mkcert` 를 사용하면 로컬에서 신뢰할 수 있는 HTTPS 인증서를 자동 생성.

```bash
npm install -D vite-plugin-mkcert
```

```ts
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: true,
    port: 5174,
  },
})
```

**방법 2: 배포 서버 URL 사용**

로컬 대신 Vercel, Netlify, ngrok 등의 HTTPS 주소를 Redirect URI로 등록해서 테스트.

```
https://abc123.ngrok.io  ← 네이버에 등록 가능
```

### Redirect URI 정확히 일치해야 함 (주의)

네이버 개발자센터에 등록한 Redirect URI와 실제 요청 URI가 **한 글자라도 다르면 로그인 실패**.

```
등록: https://localhost:5174/auth/naver/callback
요청: https://localhost:5174/callback
→ 오류 발생 ❌

등록: https://localhost:5174/auth/success
요청: https://localhost:5174/auth/success
→ 정상 동작 ✅
```

### 이 프로젝트에서의 해결

위의 문제들이 모두 존재하는 상황이었지만, 근본 원인인 **Secure 쿠키 + HTTPS 필요**를 해결하는 과정에서 자연스럽게 해결됨.

- `@vitejs/plugin-basic-ssl`로 로컬 HTTPS 적용 → Secure 쿠키 전송 가능 + 네이버 Redirect URI 조건 충족
- 백엔드 팀에서 네이버/카카오 개발자센터에 `https://localhost:5174` 등록

결국 **HTTPS 하나를 적용하는 것으로 두 문제가 동시에 해결**된 케이스.

---

## 해결 방안

### 1. 로컬 HTTPS 적용

Vite의 `@vitejs/plugin-basic-ssl` 플러그인을 사용해  
로컬 개발 서버에 자체 서명 SSL 인증서를 적용.  
이를 통해 `https://localhost:5174` 주소로 서버를 띄울 수 있음.

- SSL(Secure Sockets Layer) : 인터넷에서 데이터를 암호화해서 안전하게 주고받는 보안 기술.

```bash
npm install @vitejs/plugin-basic-ssl --save-dev
```

```ts
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    open: true,
  },
});
```

- basicSsl은 `npm run dev` 할 때만 작동하며 배포에는 영향 없음.
- 브라우저 보안 경고가 뜨면 `고급 → 계속 진행` 으로 무시하고 진행.

---

### 2. NaverLoginButton 코드 변경

#### 기존 코드 문제
```ts
// 백엔드 URL 고정 → 로그인 후 항상 Vercel로 리다이렉트
const NAVER_AUTH_URL = 'https://www.api.moonsunpower.com/boogle/api/oauth/naver'
```

OAuth 완료 후 백엔드가 어디로 보낼지 프론트가 알려주지 않아서  
백엔드에 하드코딩된 Vercel URL로만 리다이렉트됨.

#### 변경된 코드
```ts
// 현재 브라우저 주소를 redirect 파라미터로 백엔드에 전달
const redirectUrl = window.location.origin;
const NAVER_AUTH_URL = `https://www.api.moonsunpower.com/boogle/api/oauth/naver?redirect=${redirectUrl}`
```

#### `window.location.origin` 이란?
현재 브라우저가 실행 중인 주소의 origin을 자동으로 반환.

```
로컬 실행 시  → https://localhost:5174
Vercel 배포 시 → https://boogle.vercel.app
```

#### 동작 원리
```
프론트가 redirect=https://localhost:5174 를 백엔드에 전달
→ 백엔드가 OAuth 완료 후 해당 주소로 리다이렉트
→ 로컬/배포 환경 구분 없이 올바른 주소로 돌아옴
```

---

## 백엔드 담당 작업

| 작업 | 설명 |
|---|---|
| 네이버 개발자센터 | Redirect URI에 `https://localhost:5174/auth/success` 등록 |
| 백엔드 환경변수 | 로컬용 프론트 URL을 `https://localhost:5174`로 설정 |
| 카카오 개발자센터 | Web 플랫폼에 `https://localhost:5174` 등록 |

- 이 부분은 백엔드 개발자가 담당해서 내가 하지 않았다

---

## 정리

- **HTTPS 필수 이유**: JWT를 Secure 쿠키로 발급하는 구조 → 프론트가 HTTP면 쿠키가 전송되지 않아 인증 불가 (카카오/네이버 공통)
- **네이버 추가 제약**: 개발자센터 Redirect URI에 HTTPS만 등록 가능
- `@vitejs/plugin-basic-ssl`로 로컬 HTTPS 적용해 해결
- `window.location.origin`을 `redirect` 파라미터로 전달해 환경에 따라 올바른 주소로 리다이렉트
- 브라우저 보안 경고는 개발 환경에서 무시해도 무방

---

## 추가 문제: 리다이렉트 해결 후 로그인이 안 되는 문제

### 문제 상황

`redirect` 파라미터 적용으로 리다이렉트는 `https://localhost:5173`으로 정상 돌아오게 됐으나,  
로그인 후 헤더에 유저 정보가 반영되지 않는 문제 발견.

### 원인 파악 (개발자도구 Network 탭)

개발자도구를 열어 확인한 결과, `/api/user/me` 요청이 **403 Forbidden** 으로 실패하고 있었음.

```
Request URL  : https://www.api.moonsunpower.com/boogle/api/user/me
Method       : GET
Status Code  : 403 Forbidden
Origin       : https://localhost:5173
```

### 에러 원인

**CORS 미허용** — 백엔드의 CORS 허용 목록에 `https://localhost:5173`이 등록되어 있지 않아서 403 응답.

쿠키에 `access_token`은 정상적으로 존재했으나, 서버가 해당 Origin을 허용하지 않아 요청 자체를 거부한 것.

### 관련 지식

**CORS (Cross-Origin Resource Sharing)**
- 브라우저가 다른 출처(Origin)의 서버에 요청할 때 적용되는 보안 정책
- `Origin: https://localhost:5173` → `api.moonsunpower.com` 으로 요청 시 출처가 달라 CORS 적용
- 백엔드에서 해당 Origin을 허용해야만 요청 가능

**403 Forbidden vs CORS 에러 — 레이어가 다른 에러**

두 에러는 공존하지 않는 별개의 에러처럼 보이지만, 실제로는 **원인이 하나여도 두 에러가 동시에 표시**될 수 있다.

```
CORS 에러  → 브라우저 레벨 : 서버 응답에 CORS 헤더가 없으면 브라우저가 응답을 차단
403        → 서버 레벨   : 서버가 요청을 받았지만 권한 없음으로 거부
```

**CORS 미설정 시 실제 동작 흐름**
```
1. 브라우저 → 서버로 요청 전송
2. 서버 → 403 응답 반환 (Access-Control-Allow-Origin 헤더 없음)
3. 브라우저 → 응답에 CORS 헤더 없음을 확인 → CORS 에러 발생

결과:
  Network 탭 → 403 Forbidden 표시  ← 서버가 직접 내려준 상태코드
  콘솔       → CORS 에러 표시       ← 브라우저가 CORS 헤더 없음을 감지
```

즉, **원인은 CORS 미설정 하나**인데 Network 탭에는 403, 콘솔에는 CORS 에러가 동시에 뜨는 것처럼 보이는 구조.

이번 케이스에서 쿠키(`access_token`)가 요청에 담겨 있음에도 403이 떨어진 것도 같은 이유.  
토큰 문제가 아니라 서버가 해당 Origin 자체를 허용하지 않아 요청을 거부한 것.

**`/api/user/me` 의 역할**

`AuthContext`에서 앱 로드 시 호출하는 엔드포인트.  
이 요청이 성공해야 `user` 상태가 세팅되고 헤더에 닉네임이 표시됨.

```
앱 로드 → /api/user/me 호출
  성공 → user 세팅 → 헤더에 닉네임 표시
  실패 → user = null → 헤더에 로그인 버튼 표시
```

### 해결

백엔드 팀에 `https://localhost:5173` CORS 허용 요청 → 백엔드에서 허용 목록 추가 후 정상 동작 확인.

```
백엔드 CORS 허용 목록에 https://localhost:5173 추가
→ /api/user/me 요청 성공 (200 OK)
→ user 상태 세팅 → 헤더에 닉네임 표시 ✅
```
