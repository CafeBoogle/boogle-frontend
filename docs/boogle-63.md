# boogle-63: 카페 검색 범위 및 필터링 개선

## 작업 배경

리뷰 작성 페이지(`AddReviewPage`)에서 카페를 검색할 때 약국, 대학교 등 카페가 아닌 장소도 함께 노출되고, 서비스 대상 지역과 무관한 먼 곳의 카페까지 검색되는 문제가 있었다.

## 변경 파일

`src/hooks/useKakaoSearch.ts`

## 변경 내용

### 1. 검색 중심 좌표 고정 (신촌역 기준)

```ts
const location = new window.kakao.maps.LatLng(37.5556, 126.9369);
```

서비스 대상 지역(서강대·연세대·홍익대·이화여대·합정)의 중심인 신촌역 좌표를 기준점으로 설정한다.  
이후 `keywordSearch` 옵션으로 전달하여 이 좌표를 기준으로 거리를 계산한다.

### 2. 검색 반경 3km 제한 및 거리순 정렬

```ts
{
  location,
  radius: 3000,
  sort: window.kakao.maps.services.SortBy.DISTANCE,
}
```

| 옵션 | 값 | 설명 |
|------|-----|------|
| `location` | 신촌역 좌표 | 거리 계산 기준점 |
| `radius` | 3000 (m) | 해당 좌표로부터 3km 이내 결과만 반환 |
| `sort` | `SortBy.DISTANCE` | 가까운 순으로 정렬 |

### 3. 카페 카테고리만 필터링

```ts
const cafesOnly = data.filter((place: any) =>
  place.category_group_code === 'CE7'
);
setResults(cafesOnly);
```

카카오 Places API의 `category_group_code`가 `'CE7'`인 장소만 남긴다.  
`CE7`은 카카오 카테고리 코드에서 **카페** 를 의미한다.  
키워드 검색 결과에 섞이는 약국, 학교, 음식점 등을 제거한다.

## 최종 코드

```ts
export const useKakaoSearch = () => {
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const location = new window.kakao.maps.LatLng(37.5556, 126.9369);

  const search = (keyword: string) => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data: KakaoPlace[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const cafesOnly = data.filter((place: any) =>
          place.category_group_code === 'CE7'
        );
        setResults(cafesOnly);
      } else {
        setResults([]);
      }
    }, {
      location,
      radius: 3000,
      sort: window.kakao.maps.services.SortBy.DISTANCE,
    });
  };

  return { results, search };
};
```
