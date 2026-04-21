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

---

### 3단계 - 카카오 키워드 장소 검색 훅 구현 (`useKakaoSearch.ts`)
API 호출 로직을 컴포넌트에서 분리해 커스텀 훅으로 구현.

```ts
export interface KakaoPlace {
  id: string;           // 카카오 장소 고유 ID
  place_name: string;   // 카페 이름
  address_name: string; // 주소
  x: string;            // 경도
  y: string;            // 위도
}

export const useKakaoSearch = () => {
  const [results, setResults] = useState<KakaoPlace[]>([]);

  const search = (keyword: string) => {
    if (!keyword.trim()) { setResults([]); return; }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) setResults(data);
      else setResults([]);
    });
  };

  return { results, search };
};
```

**흐름**
1. 컴포넌트에서 `search("스타벅스")` 호출
2. `window.kakao.maps.services.Places()`로 카카오 SDK 장소 검색 객체 생성
3. `keywordSearch`로 카카오 서버에 비동기 요청
4. 결과 오면 `setResults(data)` → `results` 업데이트 → 컴포넌트 리렌더링

**`window.kakao` 타입 선언**
카카오 SDK는 `index.html`의 `<script>`로 로드되어 TypeScript가 타입을 모름.
`src/types/assets.d.ts`에 `interface Window { kakao: any; }` 추가해서 해결.

---

### 4단계 - CafeSearchSection 드롭다운 UI 추가
`CafeSearchSection`이 `useKakaoSearch`를 직접 사용하고 결과를 드롭다운으로 표시.

**주요 state**
```ts
const { results, search } = useKakaoSearch(); // 검색 결과, 검색 함수
const [selectedName, setSelectedName] = useState(''); // 선택된 카페 이름
const [open, setOpen] = useState(false);              // 드롭다운 열림/닫힘
```

**핸들러**
```ts
const handleSearch = (keyword: string) => {
  search(keyword);  // 카카오 API 호출
  setOpen(true);    // 드롭다운 열기
};

const handleSelect = (place: KakaoPlace) => {
  setSelectedName(place.place_name); // 선택된 카페 이름 저장
  setOpen(false);                    // 드롭다운 닫기
  onSelect(place);                   // 상위(AddReviewPage)에 전달
};
```

**드롭다운 렌더링**
```tsx
{open && results.length > 0 && (
  <ul className="absolute z-10 w-full ...">
    {results.map((place) => (
      <li key={place.id} onClick={() => handleSelect(place)}>
        <p>{place.place_name}</p>
        <p>{place.address_name}</p>
      </li>
    ))}
  </ul>
)}
```
- `open && results.length > 0` → 둘 다 true일 때만 드롭다운 렌더링
- `results.map` → 결과 배열을 `<li>` 목록으로 변환
- `absolute` → 검색창 바로 아래에 띄움 (부모 div가 `relative` 기준)

**Props 변경**
| 전 | 후 |
|---|---|
| `cafeName`, `onSearch` | `onSelect` 하나만 |

---

### 5단계 - 카페 선택 시 cafeId state 업데이트
`AddReviewPage`에서 `onSelect` 연결 및 하드코딩 제거.

```ts
// 전: 하드코딩, setter 없음
const [cafeId] = useState(1);
const [cafeName] = useState('스타벅스 서강대점');

// 후: setter 추가, 초기값 0
const [cafeId, setCafeId] = useState<number>(0);
```

```ts
const handleSelect = (place: KakaoPlace) => {
  setCafeId(Number(place.id)); // 카카오 id는 string이라 Number()로 변환
};
```

```tsx
<CafeSearchSection onSelect={handleSelect} />
```

**전체 흐름 (완성)**
```
검색창 입력
    ↓
handleSearch → 카카오 API → results 업데이트 → 드롭다운 표시
    ↓
카페 클릭
    ↓
handleSelect(CafeSearchSection) → onSelect → handleSelect(AddReviewPage)
    ↓
setCafeId → submitReview에 실제 cafeId 전달
```
