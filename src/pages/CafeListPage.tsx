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

  const state = location.state || { region: 'sogang', door: '정문' };
  const { region, door } = state;
  const regionLabel =
    REGION_LABELS[region as keyof typeof REGION_LABELS] || '지역 정보 없음';

  const handleCafeClick = async (cafe: KakaoCafe) => {
    try {
      if (cafe.dbCafeId) {
        navigate(`/cafes/${cafe.dbCafeId}`);
        return;
      }

      // 카페가 DB에 없으면 저장 후 이동
      const response = await api.post('/api/cafes/save', {
        kakaoPlaceId: String(cafe.id),
        name: cafe.name,
        address: cafe.address,
        latitude: Number(cafe.lat),
        longitude: Number(cafe.lng),
      });

      navigate(`/cafes/${response.data}`);
    } catch (error) {
      console.error('카페 저장 중 에러:', error);
    }
  };

  useEffect(() => {
    const searchCafes = () => {
      if (!window.kakao?.maps?.services) {
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
        async (data: any[], status: any) => {
          if (status !== window.kakao.maps.services.Status.OK) {
            setCafes([]);
            setIsLoading(false);
            return;
          }

          
          // 카카오 검색 결과
          const kakaoCafes: KakaoCafe[] = data.map((place) => ({
            id: place.id,
            name: place.place_name,
            address: place.address_name,
            lat: Number(place.y),
            lng: Number(place.x),
            imageUrl: 'https://via.placeholder.com/100',
            placeUrl: place.place_url,
            tags: [], 
          }));

          // kakaoPlaceId 목록 추출
          const kakaoIds = kakaoCafes.map((cafe) => cafe.id);

          try {
            // 백엔드에서 우리 DB에 저장되어 있는 카페 검색
            const res = await api.post('/api/cafes/by-kakao-ids', kakaoIds);
            const dbCafeMap = res.data;

            // 우리 DB에 있는 카페는 우리 DB에서만 가져옴(카카오에서 또 주면 중복되니까)
            const merged = kakaoCafes.map((kakaoCafe) => {
              const dbCafe = dbCafeMap[kakaoCafe.id];

              if (dbCafe) {
                return {
                  ...kakaoCafe,
                  dbCafeId: dbCafe.id,
                  tags: dbCafe.tags ?? [],
                  score: dbCafe.score,
                };
              }

              return kakaoCafe; // DB 없으면 tags=[]
            });

            setCafes(merged);
          } catch (e) {
            console.error('DB 카페 병합 실패:', e);
            setCafes(kakaoCafes);
          } finally {
            setIsLoading(false);
          }
        },
        {
          location: searchLocation,
          radius: 1000,
          sort: window.kakao.maps.services.SortBy.DISTANCE,
        }
      );
    };

    searchCafes();
  }, [region, door]);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* 헤더 */}
      <header className="px-5 pt-6 pb-4 shrink-0">
        <h2 className="text-lg font-bold text-gray-900">
          {regionLabel} · {door}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          주변 1km 이내 카페
        </p>
      </header>

      {/* 카페 목록 */}
      <main className="flex-1 overflow-y-auto px-4 py-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-7 h-7 border-4 border-brown-4 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">
              주변 카페를 찾는 중...
            </p>
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
            <p className="text-gray-400 text-sm">
              주변에 카페 정보가 없습니다.
            </p>
          </div>
        )}
      </main>

      {/* 하단 버튼 */}
      <div className="px-4 py-4 border-t border-gray-100 shrink-0">
        <Button onClick={() => navigate('/category')} className="w-full">
          카테고리 다시 선택하기
        </Button>
      </div>
    </div>
  );
}
