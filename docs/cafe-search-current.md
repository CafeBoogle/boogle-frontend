# AddReview 카페 검색 기능 - 현재 구조 정리

## 파일 구조

```
src/
├── pages/
│   └── AddReviewPage.tsx
└── components/
    ├── addreview/
    │   └── CafeSearchSection.tsx
    └── common/
        └── SearchInput.tsx
```

---

## 1. AddReviewPage.tsx

### 검색 관련 핵심 코드
```tsx
const [cafeId] = useState(1);                      // ❌ 하드코딩, setter 없음
const [cafeName] = useState('스타벅스 서강대점');   // ❌ 하드코딩, setter 없음

<CafeSearchSection
  cafeName={cafeName}
  onSearch={(v) => console.log(v)}   // ❌ 콘솔만 찍힘
/>
```

### 원리
- `cafeId`, `cafeName`에 setter가 없어서 카페를 선택해도 state가 바뀌지 않음
- `onSearch`가 동작하지 않으므로 검색 자체가 미구현 상태
- `submitReview`에 항상 하드코딩된 `cafeId: 1`이 넘어감

---

## 2. CafeSearchSection.tsx

### 검색 관련 핵심 코드
```tsx
interface CafeSearchSectionProps {
  cafeName: string;
  onSearch: (value: string) => void;   // 검색어만 올려줌, onSelect 없음
}

<SearchInput placeholder="카페를 검색하세요" onSearch={onSearch} />
{cafeName && <p>📍 {cafeName}</p>}
```

### 원리
- `onSearch`로 검색어를 상위에 전달하는 것까지만 존재
- 검색 결과 드롭다운 UI 없음
- 카페를 **선택**하는 `onSelect` 콜백 개념 자체가 없음

---

## 3. SearchInput.tsx

### 검색 관련 핵심 코드
```tsx
<input
  onChange={(e) => onSearch(e.target.value)}   // 글자 입력마다 즉시 호출
/>
```

### 원리
- 글자 하나 입력할 때마다 `onSearch` 즉시 호출
- **디바운스 없음** → API 연동 시 요청 폭발

---

## 데이터 흐름 (현재)

```
사용자 입력
    ↓
SearchInput (onChange 즉시 발생)
    ↓
CafeSearchSection (onSearch로 그대로 전달)
    ↓
AddReviewPage (console.log만 찍고 끝)
```

---

## 문제점 요약

| # | 문제 | 위치 |
|---|------|------|
| 1 | `cafeId`, `cafeName` 하드코딩, setter 없음 | `AddReviewPage` |
| 2 | `onSearch`가 `console.log`만 함 | `AddReviewPage` |
| 3 | 검색 결과 드롭다운 UI 없음 | `CafeSearchSection` |
| 4 | `onSelect` 콜백 없음 (카페 선택 개념 없음) | `CafeSearchSection` |
| 5 | 디바운스 없음 | `SearchInput` |
| 6 | 카카오 API 연동 없음 | 전체 |

---

## 구현 순서

1. 카카오 API 키 환경변수 세팅 (`.env`)
2. `SearchInput` 디바운스 적용
3. 카카오 키워드 장소 검색 API 훅 구현 (`useKakaoSearch.ts`)
4. `CafeSearchSection` 검색 결과 드롭다운 UI 추가
5. 카페 선택 시 `cafeId`, `cafeName` state 업데이트

### useKakaoSearch.ts 역할
검색어를 받아 카카오 API를 호출하고, 결과 목록을 반환하는 커스텀 훅.
API 호출 로직을 컴포넌트에서 분리해서 관심사를 나눔.

---

## 구현

### 1단계 - 카카오 API 키 환경변수 세팅
`.env` 파일 생성 후 JavaScript 키 등록.
Vite 프로젝트는 `VITE_` 접두사를 붙여야 코드에서 접근 가능.
```
VITE_KAKAO_JS_KEY=발급받은키
```
코드에서는 `import.meta.env.VITE_KAKAO_JS_KEY` 로 접근.

---

### 2단계 - SearchInput 디바운스 적용
글자 입력마다 API를 호출하면 요청이 폭발하므로 디바운스 적용.

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(value);  // delay 후 실행
  }, delay);

  return () => clearTimeout(timer);  // 다음 입력 오면 이전 타이머 취소
}, [value, delay]);
```

**1. 타이머 설치**
`value`가 바뀔 때마다 useEffect 실행 → "300ms 후 `onSearch` 실행" 타이머 예약

**2. 기존 예약 취소 (핵심)**
새 글자 입력 → 이전 타이머 `clearTimeout` → 새 타이머 시작
타이핑 멈추고 300ms가 지나야 비로소 `onSearch` 호출됨

**3. 의존성 배열 `[value, delay]`**
`value` 또는 `delay`가 바뀔 때만 1~2 과정 반복
