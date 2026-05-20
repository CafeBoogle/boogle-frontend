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
import TagInfoModal from '@/components/modals/TagInfoModal';

// 카카오 category_name에 포함되면 제외할 카페 유형 (일반 카페가 아닌 테마형 업종)
const EXCLUDE_CATEGORIES = [
  '보드카페',
  '북카페',
  '만화카페',
  '애견카페',
  '키즈카페',
  '룸카페',
  '모임카페',
  '모임공간',
  '테마카페',
];

export default function CafeListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cafes, setCafes] = useState<KakaoCafe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<ScoreFilterKey[]>([]);
  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [selectedCafe, setSelectedCafe] = useState<KakaoCafe | null>(null);
  const [showTagInfo, setShowTagInfo] = useState(false);
  const [showOnlyWithReviews, setShowOnlyWithReviews] = useState(false);

  const state = location.state || { region: 'sogang', door: '정문' };
  const { region, door } = state;
  const regionLabel = REGION_LABELS[region as keyof typeof REGION_LABELS] || '지역 정보 없음';

  const toggleFilter = (key: ScoreFilterKey) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // region 또는 door가 바뀔 때마다 카페 목록을 새로 불러옴
  useEffect(() => {
    // [변경] SDK 미준비 시 폴링 방식 → cleanup 가능한 setTimeout으로 교체
    if (!window.kakao?.maps?.services) {
      const timer = setTimeout(() => setCafes([]), 100);
      return () => clearTimeout(timer);
    }

    setIsLoading(true);

    const univCoords = UNIVERSITY_COORDS[region] || UNIVERSITY_COORDS.sogang;
    const center = univCoords[door] || univCoords['정문'];

    // [추가] 카카오 API 한계(45개)를 극복하기 위해 중심 좌표를 5방향으로 분산 검색 후 중복 제거
    // 0.008도 ≈ 약 880m 이동 → 각 500m 반경 원이 서로 겹쳐 빈 구간 없이 커버
    const SEARCH_OFFSETS = [
      { dlat: 0, dlng: 0 }, // 원점
      { dlat: 0.008, dlng: 0 },
      { dlat: -0.008, dlng: 0 },
      { dlat: 0, dlng: 0.008 },
      { dlat: 0, dlng: -0.008 },
    ];

    // [추가] 단일 중심 좌표로 카카오 검색 → 페이지네이션 포함 전체 결과를 Promise로 반환
    const searchFromCenter = (lat: number, lng: number): Promise<any[]> =>
      new Promise((resolve) => {
        const ps = new window.kakao.maps.services.Places();
        const collected: any[] = [];

        const callback = (data: any[], status: any, pagination: any) => {
          console.log(data[0]);
          console.log(
            JSON.stringify(
              data.find((p) => p.place_name.includes('디거즈')),
              null,
              2,
            ),
          );
          if (status !== window.kakao.maps.services.Status.OK) {
            resolve(collected);
            return;
          }
          collected.push(...data);
          if (pagination.hasNextPage) {
            pagination.nextPage();
          } else {
            resolve(collected);
          }
        };

        ps.categorySearch('CE7', callback, {
          location: new window.kakao.maps.LatLng(lat, lng),
          radius: 500,
          sort: window.kakao.maps.services.SortBy.DISTANCE,
        });
      });

    const run = async () => {
      try {
        // [추가] 5개 지점 병렬 검색 후 결과 합산
        const results = await Promise.all(
          SEARCH_OFFSETS.map(({ dlat, dlng }) =>
            searchFromCenter(center.lat + dlat, center.lng + dlng),
          ),
        );

        // [추가] 카카오 ID 기준 중복 제거
        const uniquePlaces = [...new Map(results.flat().map((p) => [p.id, p])).values()];

        // [추가] 원점 기준 500m 이내만 통과 — 오프셋 검색으로 범위 밖 카페가 섞일 수 있어 거리 필터링
        // 단순 평면 근사: 위도 1도 ≈ 111km, 경도 1도 ≈ 111km * cos(위도)
        const withinRadius = (placeLat: number, placeLng: number) => {
          const dLat = (placeLat - center.lat) * 111000;
          const dLng = (placeLng - center.lng) * 111000 * Math.cos((center.lat * Math.PI) / 180);
          return Math.sqrt(dLat * dLat + dLng * dLng) <= 500;
        };

        const allCafes: KakaoCafe[] = uniquePlaces
          .filter(
            (place) =>
              withinRadius(Number(place.y), Number(place.x)) &&
              !EXCLUDE_CATEGORIES.some((cat) => place.category_name.includes(cat)),
          )
          .map((place) => ({
            id: place.id,
            name: place.place_name,
            address: place.road_address_name || place.address_name,
            lat: Number(place.y),
            lng: Number(place.x),
            imageUrl: 'https://via.placeholder.com/100',
            placeUrl: place.place_url,
            tags: [],
          }));

        // 수집된 카카오 ID로 우리 DB 태그/점수 조회 후 병합
        try {
          const res = await api.post(
            '/api/cafes/by-kakao-ids',
            allCafes.map((c) => c.id),
          );
          const dbCafeMap = res.data;
          setCafes(
            allCafes.map((kc) =>
              dbCafeMap[kc.id]
                ? {
                    ...kc,
                    dbCafeId: dbCafeMap[kc.id].id,
                    tags: dbCafeMap[kc.id].tags ?? [],
                    score: dbCafeMap[kc.id].score,
                  }
                : kc,
            ),
          );
        } catch {
          // 백엔드 API 실패 시 카카오 데이터만으로 표시
          setCafes(allCafes);
        }
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [region, door]);

  const displayedCafes = cafes
    .filter((cafe) => {
      // [추가] 리뷰 있는 카페만 보기 ON이면 reviewCount > 0인 카페만 통과
      if (showOnlyWithReviews && !(cafe.score?.reviewCount && cafe.score.reviewCount > 0))
        return false;
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
      <header className="px-6 pt-10 pb-4 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#4A3A2E] leading-snug mb-1">
              {regionLabel} · {door}
            </h2>
            <p className="text-xs text-stone-400">주변 500m 이내 카페</p>
          </div>
          <button
            onClick={() => setShowTagInfo(true)}
            className="mt-1 w-6 h-6 rounded-full border border-stone-300 text-stone-400 text-xs flex items-center justify-center hover:border-[#8B7368] hover:text-[#8B7368] transition-colors"
          >
            ?
          </button>
          {/* <button
            onClick={() => setShowOnlyWithReviews((prev) => !prev)}
            className="mt-1 w-6 h-6 rounded-full border border-stone-300 text-stone-400 text-xs flex items-center justify-center hover:border-[#8B7368] hover:text-[#8B7368] transition-colors"
          >
            리뷰 있는 카페만 보기
          </button> */}
        </div>
      </header>
      {showTagInfo && <TagInfoModal onClose={() => setShowTagInfo(false)} />}
      <FilterBar
        selectedFilters={selectedFilters}
        sortBy={sortBy}
        onToggleFilter={toggleFilter}
        onSort={setSortBy}
      />

      <div className="px-6 pb-3 shrink-0">
        <button
          onClick={() => setShowOnlyWithReviews((prev) => !prev)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            showOnlyWithReviews
              ? 'bg-[#4A3A2E] text-white border-[#4A3A2E]'
              : 'bg-white text-stone-500 border-stone-200'
          }`}
        >
          리뷰 있는 카페만 보기
        </button>
      </div>
      <main className="flex-1 overflow-y-auto px-4 py-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-7 h-7 border-4 border-[#8B7368] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100">
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
          <Button onClick={() => navigate('/category')} variant="brown4" size="full">
            지역 다시 선택하기
          </Button>
        </div>
      )}
    </div>
  );
}
