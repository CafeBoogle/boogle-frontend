// 카카오 Places API 검색 결과
export interface KakaoCafe {
  id: string;
  name: string;
  address: string;
  tags: string[];
  imageUrl: string;
  placeUrl: string;
  lat: number;
  lng: number;
  dbCafeId? :number;
  score? : any;
}

// 우리 DB에 저장된 카페 (지도 마커용)
export interface DbCafe {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  thumbnail: string;
}
