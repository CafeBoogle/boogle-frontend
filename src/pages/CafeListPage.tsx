import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CafeCard from '@/components/cafe/CafeCard';
import { CafeDetailPanel } from '@/components/cafe/CafeDetailPanel';
import { FilterBar } from '@/components/cafe/FilterBar';
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
  const [selectedCafe, setSelectedCafe] = useState<KakaoCafe | null>(null);

  const state = location.state || { region: 'sogang', door: '정문' };
  const { region, door } = state;
  const regionLabel = REGION_LABELS[region as keyof typeof REGION_LABELS] || '지역 정보 없음';

  const toggleFilter = (key: ScoreFilterKey) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
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

      <FilterBar
        selectedFilters={selectedFilters}
        sortBy={sortBy}
        onToggleFilter={toggleFilter}
        onSort={setSortBy}
      />

      <main className="flex-1 overflow-y-auto px-4 py-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-7 h-7 border-4 border-[#8B7368] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col pb-20 divide-y divide-gray-100">
            {displayedCafes.map((cafe) => (
              <div
                key={cafe.id}
                onClick={() => setSelectedCafe(cafe)}
                className={`px-4 py-4 cursor-pointer border-l-4 transition-all ${selectedCafe?.id === cafe.id ? 'border-l-[#8B7368] bg-[#F7F2ED]' : 'border-l-transparent bg-white'}`}
              >
                <CafeCard cafe={cafe} />
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedCafe && (
        <CafeDetailPanel cafe={selectedCafe} onClose={() => setSelectedCafe(null)} />
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
