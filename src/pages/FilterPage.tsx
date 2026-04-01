import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Map from '../components/map/map';
import type { Coordinates, RegionId } from '@/constants/regions';
import { REGION_COORDINATES, REGION_LABELS, UNIVERSITY_COORDS } from '@/constants/regions';

const FILTER_TAGS = [
  '콘센트',
  '넓은 카페',
  '화장실',
  '와이파이',
  '24시 카페',
  '조용한 카페',
] as const;

interface LocationState {
  region: string | null;
}

function doorOptionsForRegion(regionId: string | null): string[] {
  if (regionId == null) return [];
  const coords = UNIVERSITY_COORDS[regionId];
  return coords ? Object.keys(coords) : [];
}

function getRegionLabel(regionId: string | null): string {
  if (regionId == null || !(regionId in REGION_LABELS)) return '지역 정보 없음';
  return REGION_LABELS[regionId as RegionId];
}

function mapCenterForRegion(regionId: string | null): Coordinates {
  if (regionId == null) return REGION_COORDINATES.sogang;
  return REGION_COORDINATES[regionId as RegionId];
}

export default function FilterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || { region: null };

  const regionId = state.region;
  const doorOptions = doorOptionsForRegion(regionId);
  const regionLabel = getRegionLabel(regionId);
  const mapCenter = mapCenterForRegion(regionId);

  const [selectedDoor, setSelectedDoor] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const doors = doorOptionsForRegion(regionId);
    if (doors.length === 0) {
      setSelectedDoor(null);
      return;
    }
    setSelectedDoor((prev) => (prev && doors.includes(prev) ? prev : doors[0]));
  }, [regionId]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleNavigateToCafeList = () => {
    navigate('/cafelist', {
      state: {
        region: regionId,
        door: selectedDoor,
        tags: selectedTags,
      },
    });
  };

  return (
    <div className="px-8 mt-10 pb-10">
      <div className="w-full h-52 bg-white border border-gray-200 shadow-inner rounded-sm mb-10 overflow-hidden">
        <Map center={mapCenter} />
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold ml-2 mb-4 text-brown-4">선택 지역 : {regionLabel}</h2>
        <div className="flex flex-wrap gap-3">
          {doorOptions.map((door) => {
            const selected = selectedDoor === door;
            return (
              <Button
                key={door}
                onClick={() => setSelectedDoor(door)}
                variant={selected ? 'brown4' : 'brown1'}
                size="tag"
                textColor={selected ? 'white' : 'brown'}
              >
                {door}
              </Button>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold ml-2 mb-4 flex items-center text-brown-4">
          저한테는 이게 특히 중요해요! 🔍
        </h2>
        <div className="flex flex-wrap gap-2">
          {FILTER_TAGS.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <Button
                key={tag}
                onClick={() => toggleTag(tag)}
                variant={selected ? 'brown4' : 'brown1'}
                size="tag"
                textColor={selected ? 'white' : 'brown'}
              >
                # {tag}
              </Button>
            );
          })}
        </div>
      </section>

      <div className="flex justify-center mt-4">
        <Button
          variant="brown4"
          size="full"
          textColor="white"
          onClick={handleNavigateToCafeList}
          className="text-lg"
        >
          적용하기
        </Button>
      </div>
    </div>
  );
}
