import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CafeCard from '@/components/cafe/CafeCard';
import { SCORE_FILTERS, type ScoreFilterKey, type SortKey } from '@/constants/filterTags';
import api from '@/api/axios';
import { REGION_LABELS, UNIVERSITY_COORDS } from '@/constants/regions';
import type { KakaoCafe } from '@/types/cafe';
import Button from '@/components/common/Button';

export default function CafeListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cafes, setCafes] = useState<KakaoCafe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<ScoreFilterKey[]>([]);
  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (key: ScoreFilterKey) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const currentSortLabel = sortBy
    ? (SCORE_FILTERS.find((f) => f.scoreKey === sortBy)?.label ?? '') + ' 순'
    : '정렬';

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

          const kakaoCafes: KakaoCafe[] = data.map((place) => ({
            id: place.id,
            name: place.place_name,
            address: place.road_address_name || place.address_name,
            lat: Number(place.y),
            lng: Number(place.x),
            imageUrl: 'https://via.placeholder.com/100',
            placeUrl: place.place_url,
            tags: [],
          }));

          const kakaoIds = kakaoCafes.map((cafe) => cafe.id);

          try {
            const res = await api.post('/api/cafes/by-kakao-ids', kakaoIds);
            const dbCafeMap = res.data;

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
              return kakaoCafe;
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

  const displayedCafes = cafes
    .filter((cafe) => {
      if (selectedFilters.length === 0) return true;
      return selectedFilters.every((filterKey) => {
        const scoreKey = SCORE_FILTERS.find((f) => f.key === filterKey)?.scoreKey;
        if (!scoreKey || !cafe.score) return false;
        return cafe.score[scoreKey] >= 3.5;
      });
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      const aScore = a.score?.[sortBy] ?? 0;
      const bScore = b.score?.[sortBy] ?? 0;
      return bScore - aScore;
    });

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* 헤더 */}
      <header className="px-5 pt-6 pb-3 shrink-0">
        <h2 className="text-lg font-bold text-gray-900">{regionLabel} · {door}</h2>
        <p className="text-xs text-gray-400 mt-0.5">주변 1km 이내 카페</p>
      </header>

      {/* 카페 선택 기준 + 정렬 드롭다운 */}
      <div className="flex items-center justify-between px-4 pb-2 shrink-0">
        <span className="text-sm font-semibold text-gray-800">카페 선택 기준</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-600 bg-white"
          >
            {currentSortLabel}
            <span className="text-xs">{isDropdownOpen ? '▲' : '▼'}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-xl shadow-lg z-10 w-40 py-1">
              {SCORE_FILTERS.map(({ scoreKey, label }) => (
                <button
                  key={scoreKey}
                  onClick={() => { setSortBy(scoreKey); setIsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    sortBy === scoreKey ? 'text-[#8B7368] font-semibold' : 'text-gray-700'
                  }`}
                >
                  {label} 순
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 필터 칩 */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide shrink-0">
        {SCORE_FILTERS.map(({ key, label }) => {
          const selected = selectedFilters.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggleFilter(key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                selected
                  ? 'bg-[#8B7368] text-white border-[#8B7368]'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 카페 목록 */}
      <main className="flex-1 overflow-y-auto px-4 py-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-7 h-7 border-4 border-brown-4 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">주변 카페를 찾는 중...</p>
          </div>
        ) : displayedCafes.length > 0 ? (
          <div className="flex flex-col gap-2">
            {displayedCafes.map((cafe) => (
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
        <Button variant="brown4" size="full" onClick={() => navigate('/category')}>
          지역 다시 선택하기
        </Button>
      </div>
    </div>
  );
}
