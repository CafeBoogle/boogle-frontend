import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CafeCard from '@/components/cafe/CafeCard';
import api from '@/api/axios';
import { REGION_LABELS, UNIVERSITY_COORDS } from '@/constants/regions';

export default function CafeListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cafes, setCafes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const state = location.state || { region: 'sogang', door: '정문', tags: [] };
  const { region, door, tags } = state;
  const regionLabel = REGION_LABELS[region as keyof typeof REGION_LABELS] || '지역 정보 없음';

  const handleCafeClick = async (cafe: any) => {
    try {
      const response = await api.post('/api/cafes/save', {
        kakaoPlaceId: String(cafe.id),
        name: cafe.name,
        address: cafe.review, // 카카오의 address_name
        latitude: Number(cafe.lat),
        longitude: Number(cafe.lng),
      });

      const dbCafeId = response.data;

      // 변경 포인트: cafeId 외에 상세 정보들도 함께 넘깁니다.
      navigate(`/cafe/${cafe.name}`, {
        state: {
          id: dbCafeId, // 우리 DB의 PK
          kakaoPlaceId: cafe.id, // 카카오 ID
          name: cafe.name,
          address: cafe.review, // 주소 (에러 방지 핵심!)
          lat: cafe.lat,
          lng: cafe.lng,
          placeUrl: cafe.placeUrl,
        },
      });
    } catch (error) {
      console.error('카페 저장 중 에러:', error);
    }
  };

  useEffect(() => {
    const searchCafes = () => {
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        setTimeout(searchCafes, 100);
        return;
      }

      setIsLoading(true);
      const ps = new window.kakao.maps.services.Places();

      const univCoords = UNIVERSITY_COORDS[region] || UNIVERSITY_COORDS.sogang;
      const center = univCoords[door] || univCoords['정문'];

      const searchLocation = new window.kakao.maps.LatLng(center.lat, center.lng);

      ps.categorySearch(
        'CE7',
        (data: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const mappedData = data.map((place: any) => ({
              id: place.id,
              name: place.place_name,
              tags: [place.category_name.split('>').pop().trim(), ...tags],
              review: place.address_name,
              imageUrl: 'https://via.placeholder.com/100',
              placeUrl: place.place_url,
              lat: place.y, // 위도
              lng: place.x, // 경도
            }));
            setCafes(mappedData);
          } else {
            setCafes([]);
          }
          setIsLoading(false);
        },
        {
          location: searchLocation,
          radius: 1000,
          sort: window.kakao.maps.services.SortBy.DISTANCE,
        },
      );
    };

    searchCafes();
  }, [region, door, tags]);

  return (
    <div className="p-4 font-sans flex flex-col gap-6 bg-[#FCFBF9] min-h-screen">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-[#4A3F35]">
            {regionLabel} {door}
          </h2>
          <p className="text-sm text-gray-500 mt-1">주변 1km 이내의 카페 목록</p>
        </div>
        <span className="text-[10px] text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm">
          Kakao Map Data
        </span>
      </header>

      {tags.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="whitespace-nowrap bg-[#EFEBE7] text-[#4A3F35] px-3 py-1 rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <main className="bg-white rounded-2xl p-6 shadow-sm flex-1 overflow-y-auto max-h-[60vh]">
        <div className="flex flex-col gap-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-[#4A3F35] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">주변 카페를 찾는 중...</p>
            </div>
          ) : cafes.length > 0 ? (
            cafes.map((cafe) => (
              <div
                key={cafe.id}
                onClick={() => handleCafeClick(cafe)}
                className="cursor-pointer active:opacity-70 transition-opacity"
              >
                <CafeCard cafe={cafe} />
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">주변에 카페 정보가 없습니다.</div>
          )}
        </div>
      </main>

      <button
        onClick={() => navigate('/map')}
        className="w-full py-4 bg-[#4A3F35] text-white rounded-xl font-bold shadow-lg hover:bg-[#3d342c] transition-colors"
      >
        지도로 자세히 보기
      </button>
    </div>
  );
}
