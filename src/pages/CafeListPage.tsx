import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CafeCard from '@/components/cafe/CafeCard';
import api from '@/api/axios';
import { REGION_LABELS, UNIVERSITY_COORDS } from '@/constants/regions';
import type { KakaoCafe } from '@/types/cafe';
import Button from '@/components/common/Button';

export default function CafeListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cafes, setCafes] = useState<KakaoCafe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const state = location.state || { region: 'sogang', door: '정문', tags: [] };
  const { region, door, tags } = state;
  const regionLabel = REGION_LABELS[region as keyof typeof REGION_LABELS] || '지역 정보 없음';

  const handleCafeClick = async (cafe: KakaoCafe) => {
    try {
      const response = await api.post('/api/cafes/save', {
        kakaoPlaceId: String(cafe.id),
        name: cafe.name,
        address: cafe.address,
        latitude: Number(cafe.lat),
        longitude: Number(cafe.lng),
      });

      const dbCafeId = response.data;

      navigate(`/cafe/${cafe.name}`, {
        state: {
          id: dbCafeId,
          kakaoPlaceId: cafe.id,
          name: cafe.name,
          address: cafe.address,
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
              // TODO: 백엔드에 카페별 태그 API 생성 후 실제 태그로 교체
              tags: [place.category_name.split('>').pop().trim()],
              address: place.address_name,
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
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* 헤더 */}
      <header className="px-5 pt-6 pb-4 shrink-0">
        <h2 className="text-lg font-bold text-gray-900">{regionLabel} · {door}</h2>
        <p className="text-xs text-gray-400 mt-0.5">주변 1km 이내 카페</p>

        {/* 필터 태그 */}
        {tags.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto mt-3 scrollbar-hide">
            {tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="whitespace-nowrap bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 카페 목록 */}
      <main className="flex-1 overflow-y-auto px-4 py-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-7 h-7 border-4 border-brown-4 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">주변 카페를 찾는 중...</p>
          </div>
        ) : cafes.length > 0 ? (
          <div className="flex flex-col gap-2">
            {cafes.map((cafe) => (
              <div
                key={cafe.id}
                onClick={() => handleCafeClick(cafe)}
                className="bg-white rounded-xl px-4 py-4 cursor-pointer active:opacity-70 transition-opacity"
              >
                <CafeCard cafe={cafe} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32">
            <p className="text-gray-400 text-sm">주변에 카페 정보가 없습니다.</p>
          </div>
        )}
      </main>

      {/* 하단 버튼 */}
      <div className="px-4 py-4 border-t border-gray-100 shrink-0">
        <Button onClick={() => navigate('/filter')} className="w-full">
          카테고리 다시 선택하기
        </Button>
      </div>
    </div>
  );
}
