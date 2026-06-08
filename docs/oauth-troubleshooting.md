# OAuth 소셜 로그인 트러블슈팅

## 문제 상황

로컬(`http://localhost:5174`)에서 소셜 로그인(카카오/네이버)을 시도하면, OAuth 인증 완료 후 백엔드가 프론트를 Vercel 배포 URL로 리다이렉트하는 문제가 발생한다.

```
로컬에서 로그인 시도
→ OAuth 인증 완료
→ 백엔드가 https://boogle.vercel.app/auth/success 로 리다이렉트  ← 문제
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

**문제의 핵심**: 5번에서 백엔드가 리다이렉트하는 프론트 URL이 Vercel 주소로 고정되어 있어 로컬 테스트가 불가능하다.

---

## 로컬에서 HTTPS가 필요한 이유
> 현재 진행중인 프로젝트 기준이다. 모든 프로젝트에서 그런지는 모름 ..

### 인증 방식: JWT + Secure 쿠키

백엔드는 로그인 완료 후 JWT를 `Set-Cookie`로 내려줄 때 `Secure` 플래그를 설정한다.

```
Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=None
```

**Secure 플래그**란 해당 쿠키를 **HTTPS 연결에서만** 브라우저가 서버로 전송하도록 제한하는 속성이다. HTTP 연결에서는 브라우저가 쿠키를 아예 포함하지 않는다.

```
[로컬이 HTTP인 경우]
백엔드(HTTPS) → Set-Cookie: access_token=...; Secure
브라우저 → "Secure 쿠키 → HTTPS에서만 전송 가능"
→ http://localhost 요청 시 쿠키 미포함
→ 서버: 인증 정보 없음 → 인증 실패 

[로컬이 HTTPS인 경우]
백엔드(HTTPS) → Set-Cookie: access_token=...; Secure
브라우저 → HTTPS 연결이므로 쿠키 포함해서 전송
→ 서버: 인증 정보 확인 → 인증 성공 
```

### SameSite=None 과의 관계

이 프로젝트는 프론트(`localhost`)와 백엔드(`api.moonsunpower.com`)가 **서로 다른 도메인(cross-origin)** 구조다. cross-origin 요청에서 쿠키를 전송하려면 `SameSite=None`이 필요한데, 브라우저는 `SameSite=None`을 **반드시 `Secure`와 함께** 설정해야만 허용한다.

```
SameSite=None; Secure           → cross-origin 요청에서도 쿠키 전송 허용 
SameSite=None (Secure 없음)     → 브라우저가 쿠키 자체를 거부 
```

결론: **백엔드가 HTTPS이고 Secure 쿠키를 사용하는 이상, 프론트도 반드시 HTTPS여야 한다.**

---

### 트러블슈팅 중 알게 된 네이버 로그인의 추가 제약

위의 HTTPS 필요성은 카카오/네이버 공통이지만, 네이버는 **Redirect URI 등록 정책 자체**가 더 엄격하다.

### 카카오 vs 네이버 비교

| | 카카오 | 네이버 |
|---|:---:|:---:|
| `http://localhost` 등록 | 허용 | 불가 |
| `https://localhost` 등록 | 허용 | 허용 |

```
http://localhost:5174   ← 네이버에 등록 불가 
https://localhost:5174  ← 네이버에 등록 가능 
```

### 왜 네이버가 더 엄격한가

OAuth 인가 코드(`code`) 탈취 방지 보안 정책 때문이다. 인가 코드가 HTTP를 통해 전달되면 네트워크 도청으로 탈취될 수 있으므로, 네이버는 HTTPS 기반 Redirect URI만 허용한다.

### Redirect URI는 정확히 일치해야 한다

네이버 개발자센터에 등록한 Redirect URI와 실제 요청 URI가 **한 글자라도 다르면 로그인이 실패**한다.

```
등록: https://localhost:5174/auth/naver/callback
요청: https://localhost:5174/callback
→ 오류 발생 

등록: https://localhost:5174/auth/success
요청: https://localhost:5174/auth/success
→ 정상 동작 
```

---

## 해결 방안

### 1. 로컬 HTTPS 적용

Vite의 `@vitejs/plugin-basic-ssl` 플러그인을 사용해 로컬 개발 서버에 자체 서명 SSL 인증서를 적용한다. 이를 통해 `https://localhost:5174` 주소로 서버를 띄울 수 있다.

> **SSL(Secure Sockets Layer)**: 인터넷에서 데이터를 암호화해 안전하게 주고받는 보안 기술.

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

- `basicSsl`은 `npm run dev` 시에만 작동하며 배포에는 영향을 주지 않는다.
- 브라우저 보안 경고가 뜨면 `고급 → 계속 진행`을 눌러 무시하고 진행한다.

> **참고 (다른 프로젝트)**: `vite-plugin-mkcert`를 사용하면 브라우저가 신뢰하는 인증서를 자동 생성할 수 있다. 보안 경고 없이 HTTPS 환경을 구성하고 싶다면 이 방법을 고려할 수 있다.
> ```bash
> npm install -D vite-plugin-mkcert
> ```

---

### 2. NaverLoginButton 코드 변경

#### 기존 코드의 문제

```ts
// 백엔드 URL 고정 → 로그인 후 항상 Vercel로 리다이렉트
const NAVER_AUTH_URL = 'https://www.api.moonsunpower.com/boogle/api/oauth/naver'
```

OAuth 완료 후 백엔드가 어디로 보낼지 프론트가 알려주지 않아 백엔드에 하드코딩된 Vercel URL로만 리다이렉트된다.

#### 변경된 코드

```ts
// 현재 브라우저 주소를 redirect 파라미터로 백엔드에 전달
const redirectUrl = window.location.origin;
const NAVER_AUTH_URL = `https://www.api.moonsunpower.com/boogle/api/oauth/naver?redirect=${redirectUrl}`
```

#### `window.location.origin` 이란

현재 브라우저가 실행 중인 주소의 origin을 자동으로 반환한다.

```
로컬 실행 시   → https://localhost:5174
Vercel 배포 시  → https://boogle.vercel.app
```

#### 동작 원리

```
프론트가 redirect=https://localhost:5174 를 백엔드에 전달
→ 백엔드가 OAuth 완료 후 해당 주소로 리다이렉트
→ 로컬/배포 환경 구분 없이 올바른 주소로 돌아옴
```

---

### 3. 백엔드 담당 작업

| 작업 | 설명 |
|---|---|
| 네이버 개발자센터 | Redirect URI에 `https://localhost:5174/auth/success` 등록 |
| 백엔드 환경변수 | 로컬용 프론트 URL을 `https://localhost:5174`로 설정 |
| 카카오 개발자센터 | Web 플랫폼에 `https://localhost:5174` 등록 |

---

이번 케이스에서 **HTTPS 하나를 적용하는 것으로 두 문제가 동시에 해결**되었다.

| 문제 | 원인 | 해결 |
|---|---|---|
| Secure 쿠키 미전송 | 로컬이 HTTP → 브라우저가 쿠키 차단 | `basicSsl`로 로컬 HTTPS 적용 |
| 네이버 Redirect URI 등록 불가 | 네이버는 HTTPS URI만 허용 | HTTPS 적용으로 자동 충족 |
| 리다이렉트 주소 고정 | 백엔드에 Vercel URL 하드코딩 | `window.location.origin`을 파라미터로 전달 |

---

## [추가 문제] 리다이렉트 해결 후 로그인이 안 되는 문제

### 문제 상황

> `redirect` 파라미터 적용으로 리다이렉트는 `https://localhost:5173`으로 정상적으로 돌아오게 됐으나, 로그인 후 헤더에 유저 정보가 반영되지 않는 문제가 발생했다.

### 원인 파악

개발자도구 Network 탭을 확인한 결과, `/api/user/me` 요청이 **403 Forbidden**으로 실패하고 있다.

```
Request URL  : https://www.api.moonsunpower.com/boogle/api/user/me
Method       : GET
Status Code  : 403 Forbidden
Origin       : https://localhost:5173
```

원인은 **CORS 미허용**이다. 백엔드의 CORS 허용 목록에 `https://localhost:5173`이 등록되어 있지 않아 403 응답이 반환된다. 쿠키에 `access_token`은 정상적으로 존재하지만, 서버가 해당 Origin 자체를 허용하지 않아 요청을 거부한 것이다.

### 관련 지식

#### CORS (Cross-Origin Resource Sharing)

브라우저가 다른 출처(Origin)의 서버에 요청할 때 적용되는 보안 정책이다. `Origin: https://localhost:5173` → `api.moonsunpower.com`으로 요청 시 출처가 달라 CORS가 적용되며, 백엔드에서 해당 Origin을 허용해야만 요청이 가능하다.

#### 403 Forbidden vs CORS 에러가 동시에 뜨는 이유

두 에러는 별개처럼 보이지만, **원인이 하나여도 동시에 표시**될 수 있다.

```
CORS 에러  → 브라우저 레벨 : 서버 응답에 CORS 헤더가 없으면 브라우저가 응답을 차단
403        → 서버 레벨    : 서버가 요청을 받았지만 권한 없음으로 거부
```

실제 동작 흐름은 다음과 같다.

```
1. 브라우저 → 서버로 요청 전송
2. 서버 → 403 응답 반환 (Access-Control-Allow-Origin 헤더 없음)
3. 브라우저 → 응답에 CORS 헤더 없음을 확인 → CORS 에러 발생

결과:
  Network 탭 → 403 Forbidden  ← 서버가 직접 내려준 상태코드
  콘솔       → CORS 에러       ← 브라우저가 CORS 헤더 없음을 감지
```

즉, **원인은 CORS 미설정 하나**인데 Network 탭에는 403, 콘솔에는 CORS 에러가 동시에 나타나는 구조다.

#### `/api/user/me` 의 역할

`AuthContext`에서 앱 로드 시 호출하는 엔드포인트다. 이 요청이 성공해야 `user` 상태가 세팅되고 헤더에 닉네임이 표시된다.

```
앱 로드 → /api/user/me 호출
  성공 → user 세팅 → 헤더에 닉네임 표시
  실패 → user = null → 헤더에 로그인 버튼 표시
```

### 해결

백엔드 팀에 `https://localhost:5173` CORS 허용을 요청하고, 백엔드에서 허용 목록에 추가한 후 정상 동작을 확인한다.

```
백엔드 CORS 허용 목록에 https://localhost:5173 추가
→ /api/user/me 요청 성공 (200 OK)
→ user 상태 세팅 → 헤더에 닉네임 표시 
```

---

## [0606] basicSsl 제거 — Chrome ERR_SSL_PROTOCOL_ERROR 문제

### 문제 상황

팀원 전원이 `npm run dev` 후 `https://localhost:5173` 접속 시 앱이 열리지 않는 문제가 갑자기 발생했다.

```
https://localhost:5173 접속
→ ERR_SSL_PROTOCOL_ERROR
→ "사이트에 보안 연결할 수 없음"
→ 앱 자체가 열리지 않음
```

### 원인

Chrome이 `@vitejs/plugin-basic-ssl`이 생성하는 **자체 서명(self-signed) 인증서**를 더 이상 허용하지 않기 시작했다.

`ERR_SSL_PROTOCOL_ERROR`는 인증서 신뢰 문제가 아니라 **SSL 핸드셰이크 자체가 실패**한 것으로, Chrome 업데이트 이후 자체 서명 인증서에 대한 보안 정책이 강화되면서 발생했다.

> **SSL 핸드셰이크**: 클라이언트(브라우저)와 서버가 암호화 통신을 시작하기 전에 서로 인증서를 확인하고 암호화 방식을 협의하는 과정. 이 과정에서 인증서가 거부되면 연결 자체가 성립되지 않는다.

### 해결 방안 — basicSsl 제거, HTTP로 전환

`vite.config.ts`에서 `basicSsl` 플러그인을 제거하여 HTTP로 실행되도록 변경했다.

```ts
// 변경 전
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  ...
});

// 변경 후
export default defineConfig({
  plugins: [react(), tailwindcss()],
  ...
});
```

이후 `http://localhost:5173` 으로 앱이 정상적으로 열린다.

### "그럼 로그인이 안 돼야 하는 거 아닌가?" — localhost 예외 규칙

위 문서에서 설명했듯이 이론적으로는 HTTP 환경에서 Secure 쿠키가 전송되지 않아야 한다. 그러나 **실제로 로그인이 정상 동작**했다.

이유는 브라우저가 `localhost`를 특별 취급하기 때문이다.

#### Potentially Trustworthy Origin

W3C Secure Contexts 스펙에서 `http://localhost`를 **"potentially trustworthy origin"** 으로 정의한다. Chrome을 포함한 모던 브라우저는 이 스펙을 따라 `localhost`를 HTTP임에도 **보안 컨텍스트(Secure Context)** 로 취급한다.

```
일반 HTTP 도메인 (http://myapp.com)
  → 보안 컨텍스트 X
  → Secure 쿠키 전송 안 됨 ← 이론 그대로 적용

http://localhost
  → 브라우저가 예외적으로 보안 컨텍스트로 취급
  → Secure 쿠키 전송 됨 ← 예외 적용
```

즉 위 문서의 이론(Secure 쿠키는 HTTPS에서만 전송)은 **실제 도메인에서는 정확히 맞지만**, `localhost`는 개발 편의를 위해 스펙 레벨에서 의도적으로 만들어진 예외다.

#### SameSite=None은?

`localhost`가 보안 컨텍스트로 취급되므로, `SameSite=None; Secure` 쿠키도 `http://localhost`에서 정상적으로 동작한다.

### 정리

| | 실제 HTTP 도메인 | http://localhost |
|---|:---:|:---:|
| Secure 컨텍스트 | X | O (브라우저 예외) |
| Secure 쿠키 전송 | X | O |
| SameSite=None 동작 | X | O |

**결론**: 이 프로젝트에서는 `localhost` 예외 덕분에 basicSsl 없이 HTTP로도 소셜 로그인이 정상 동작한다. 다만 이는 localhost에서만 해당되며, 실제 배포 환경은 반드시 HTTPS여야 한다.
