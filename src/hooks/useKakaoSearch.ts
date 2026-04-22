import { useState } from 'react';

export interface KakaoPlace {
  // 카카오 API가 돌려주는 필드 중 필요한 것들만 정의
  // 카카오 내부 장소 고유 ID, 카페 이름, 주소, 경도, 위도 
  id: string;
  place_name: string;
  address_name: string;
  x: string;
  y: string;
}

export const useKakaoSearch = () => {
  const [results, setResults] = useState<KakaoPlace[]>([]);

  const search = (keyword: string) => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data: KakaoPlace[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setResults(data);
      } else {
        setResults([]);
      }
    },
    {
      location,
      radius:3000,
      sort: window.kakao.maps.services.SortBy.DISTANCE,
    });
  };

  return { results, search };
};
