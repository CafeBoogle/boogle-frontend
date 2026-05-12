export interface CafeScore {
  cafeId: number;
  reviewCount: number;
  toiletScoreAvg: number;
  outletScoreAvg: number;
  seatScoreAvg: number;
  wifiScoreAvg: number;
  noiseScoreAvg: number;
  studyScoreAvg: number;
}

// 카카오 Places API 검색 결과
export interface KakaoCafe {
  id: number;
  name: string;
  address: string;
  tags: string[];
  imageUrl: string;
  placeUrl: string;
  lat: number;
  lng: number;
  dbCafeId?: number;
  score?: CafeScore;
}

// 마이페이지 내 리뷰 목록 아이템
export interface MyReview {
  id: number;
  cafeId: number;
  name: string;
  address: string;
  tags: string[];
  comment: string;
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
