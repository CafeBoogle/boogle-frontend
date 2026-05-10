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

  const [selectedCafe, setSelectedCafe] = useState<KakaoCafe | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const state = location.state || { region: 'sogang', door: '정문' };
  const { region, door } = state;
  const regionLabel = REGION_LABELS[region as keyof typeof REGION_LABELS] || '지역 정보 없음';

  const toggleFilter = (key: ScoreFilterKey) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleCafeClick = (cafe: KakaoCafe) => {
    setSelectedCafe(cafe);
  };

  const goToDetailPage = async (cafe: KakaoCafe) => {
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
      console.error(error);
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
          try {
            const res = await api.post(
              '/api/cafes/by-kakao-ids',
              kakaoCafes.map((c) => c.id),
            );
            const dbCafeMap = res.data;
            const merged = kakaoCafes.map((kc) =>
              dbCafeMap[kc.id]
                ? {
                    ...kc,
                    dbCafeId: dbCafeMap[kc.id].id,
                    tags: dbCafeMap[kc.id].tags ?? [],
                    score: dbCafeMap[kc.id].score,
                  }
                : kc,
            );
            setCafes(merged);
          } catch {
            setCafes(kakaoCafes);
          } finally {
            setIsLoading(false);
          }
        },
        {
          location: searchLocation,
          radius: 1000,
          sort: window.kakao.maps.services.SortBy.DISTANCE,
        },
      );
    };
    searchCafes();
  }, [region, door]);

  useEffect(() => {
    if (selectedCafe && mapRef.current) {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(selectedCafe.lat, selectedCafe.lng),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(selectedCafe.lat, selectedCafe.lng),
      });
      marker.setMap(map);
    }
  }, [selectedCafe]);

  const displayedCafes = cafes
    .filter((cafe) => {
      if (selectedFilters.length === 0) return true;
      return selectedFilters.every((fKey) => {
        const sKey = SCORE_FILTERS.find((f) => f.key === fKey)?.scoreKey;
        return sKey && cafe.score && cafe.score[sKey] >= 3.5;
      });
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      return (b.score?.[sortBy] ?? 0) - (a.score?.[sortBy] ?? 0);
    });

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] relative overflow-hidden">
      <header className="px-5 pt-6 pb-3 shrink-0">
        <h2 className="text-lg font-bold text-gray-900">
          {regionLabel} · {door}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">주변 1km 이내 카페</p>
      </header>

      <div className="flex items-center justify-between px-4 pb-2 shrink-0">
        <span className="text-sm font-semibold text-gray-800">카페 선택 기준</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-600 bg-white"
          >
            {sortBy ? SCORE_FILTERS.find((f) => f.scoreKey === sortBy)?.label + ' 순' : '정렬'}
            <span className="text-xs">{isDropdownOpen ? '▲' : '▼'}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-xl shadow-lg z-30 w-40 py-1">
              {SCORE_FILTERS.map(({ scoreKey, label }) => (
                <button
                  key={scoreKey}
                  onClick={() => {
                    setSortBy(scoreKey);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${sortBy === scoreKey ? 'text-[#8B7368] font-semibold' : 'text-gray-700'}`}
                >
                  {label} 순
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide shrink-0">
        {SCORE_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedFilters.includes(key) ? 'bg-[#8B7368] text-white border-[#8B7368]' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-7 h-7 border-4 border-[#8B7368] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-2 pb-20">
            {displayedCafes.map((cafe) => (
              <div
                key={cafe.id}
                onClick={() => handleCafeClick(cafe)}
                className={`bg-white rounded-xl px-4 py-4 cursor-pointer border-2 transition-all ${selectedCafe?.id === cafe.id ? 'border-[#8B7368]' : 'border-transparent'}`}
              >
                <CafeCard cafe={cafe} />
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedCafe && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-white border-t rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.12)] z-40 animate-in fade-in slide-in-from-bottom-10 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedCafe.name}</h3>
                <p className="text-sm text-gray-500">{selectedCafe.address}</p>
              </div>
              <button
                onClick={() => setSelectedCafe(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <div
              ref={mapRef}
              className="w-full h-48 rounded-2xl bg-gray-100 mb-5 overflow-hidden shadow-inner"
              onClick={(e) => e.stopPropagation()}
            />

            <Button
              onClick={() => goToDetailPage(selectedCafe)}
              className="w-full h-12 text-base font-bold"
            >
              이 카페 상세 정보 보기
            </Button>
          </div>
        </div>
      )}

      {!selectedCafe && (
        <div className="px-4 py-4 border-t border-gray-100 bg-white shrink-0">
          <Button onClick={() => navigate('/category')} className="w-full outline">
            지역 다시 선택하기
          </Button>
        </div>
      )}
    </div>
  );
}
