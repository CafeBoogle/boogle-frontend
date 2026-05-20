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
const EXCLUDE_CATEGORIES = ['보드카페', '북카페', '만화카페', '애견카페', '키즈카페', '룸카페'];

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
    const searchCafes = () => {
      // 카카오 SDK는 <script>로 비동기 로드되므로, 준비될 때까지 100ms마다 재시도
      if (!window.kakao?.maps?.services) {
        setTimeout(searchCafes, 100);
        return;
      }

      setIsLoading(true);
      const ps = new window.kakao.maps.services.Places();

      // region + door 조합으로 검색 중심 좌표 결정 (없으면 서강대 정문으로 폴백)
      const univCoords = UNIVERSITY_COORDS[region] || UNIVERSITY_COORDS.sogang;
      const center = univCoords[door] || univCoords['정문'];
      const searchLocation = new window.kakao.maps.LatLng(center.lat, center.lng);

      // 카카오 API는 15개씩 페이지네이션으로 내려주므로, 전체 결과를 누적할 배열
      const allCafes: KakaoCafe[] = [];

      // categorySearch의 콜백 - 페이지마다 호출됨
      const handleSearch = async (data: any[], status: any, pagination: any) => {
        // 검색 실패(반경 내 카페 없음 등)이면 빈 배열로 세팅하고 종료
        console.log(data[0]); // ← 여기 추가
        if (status !== window.kakao.maps.services.Status.OK) {
          setCafes([]);
          setIsLoading(false);
          return;
        }

        // 카카오 응답 필드명 → KakaoCafe 타입으로 변환 (제외 업종 필터링 포함)
        const batch: KakaoCafe[] = data
          .filter((place) => !EXCLUDE_CATEGORIES.some((cat) => place.category_name.includes(cat)))
          .map((place) => ({
            id: place.id, // 카카오 장소 ID
            name: place.place_name,
            address: place.road_address_name || place.address_name, // 도로명 우선, 없으면 지번
            lat: Number(place.y),
            lng: Number(place.x),
            imageUrl: 'https://via.placeholder.com/100',
            placeUrl: place.place_url,
            tags: [], // DB 병합 전이라 빈 배열
          }));
        allCafes.push(...batch); // 이번 페이지 결과 누적

        // 다음 페이지가 있으면 nextPage() 호출 → handleSearch 재호출됨, DB 병합은 아직
        if (pagination.hasNextPage) {
          pagination.nextPage();
          return;
        }

        // 모든 페이지 수집 완료 → 우리 DB에서 태그/점수 조회
        try {
          // 카카오 ID 목록을 백엔드에 보내면, 우리 DB에 등록된 카페 정보를 맵으로 반환
          // 응답 형태: { "카카오ID": { id, tags, score }, ... }
          const res = await api.post(
            '/api/cafes/by-kakao-ids',
            allCafes.map((c) => c.id),
          );
          const dbCafeMap = res.data;

          // 카카오 카페마다 DB 데이터가 있으면 병합, 없으면 카카오 데이터만 유지
          const merged = allCafes.map(
            (kc) =>
              dbCafeMap[kc.id]
                ? {
                    ...kc,
                    dbCafeId: dbCafeMap[kc.id].id, // 우리 DB의 PK
                    tags: dbCafeMap[kc.id].tags ?? [], // 태그 목록
                    score: dbCafeMap[kc.id].score, // 항목별 평균 점수
                  }
                : kc, // DB에 없는 카페는 태그/점수 없이 카카오 데이터만
          );
          setCafes(merged);
        } catch {
          // 백엔드 API 실패 시 카카오 데이터만으로라도 화면에 표시
          setCafes(allCafes);
        } finally {
          setIsLoading(false);
        }
      };

      // 카테고리 CE7 = 카페, 중심 좌표 기준 500m 이내, 거리순 정렬
      ps.categorySearch('CE7', handleSearch, {
        location: searchLocation,
        radius: 500,
        sort: window.kakao.maps.services.SortBy.DISTANCE,
      });
    };
    searchCafes();
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
