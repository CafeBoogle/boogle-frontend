import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/common/Button";

interface LocationState {
  region: string | null;
  door: string | null;
  tags: string[];
}

const regionLabels: Record<string, string> = {
  sogang: "서강대학교",
  yonsei: "연세대학교",
  hongik: "홍익대학교",
  ewha: "이화여자대학교",
  nearby: "근처 추천 카페",
  all: "전체 모아보기",
};

const MOCK_CAFES = [
  {
    id: 1,
    name: "커피브레이크 서강대점",
    tags: ["콘센트가 있는 카페", "50석 이상 대형 카페"],
    review: "카공하기 좋고 음료 맛있었어요",
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    name: "커피브레이크 서강대점2",
    tags: ["콘센트가 있는 카페", "50석 이상 대형 카페"],
    review: "카공하기 좋고 음료 맛있었어요",
    imageUrl: "https://via.placeholder.com/100",
  },
];

export default function CafeListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as LocationState) || {
    region: "서강대",
    door: "정문",
    tags: ["카공"],
  };

  const { region, door, tags } = state;
  const regionLabel = (region && regionLabels[region]) || "지역 정보 없음";

  return (
    <div className="p-4 font-sans flex flex-col gap-6">
      <section>
        <h2 className="text-xl font-bold text-[#4A3F35] mb-4">
          {regionLabel} {door} 근처카페 리스트
        </h2>
        <p>선택한 태그 : {tags.join(", ")}</p>
      </section>

      <main className="bg-white rounded-2xl p-6 shadow-sm overflow-y-auto max-h-[70vh]">
        <div className="flex flex-col gap-8">
          {MOCK_CAFES.map((cafe, index) => (
            <div key={cafe.id} className="flex flex-col gap-4">
              <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-lg font-bold text-black">{cafe.name}</h3>

                  <div className="flex flex-wrap gap-2">
                    {cafe.tags.map((tag, idx) => (
                      <Button
                        key={idx}
                        variant="brown1"
                        size="xs"
                        className="rounded-lg text-[#8B7368] font-normal px-2 py-1"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={cafe.imageUrl}
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <span className="text-sm font-bold text-black shrink-0">
                  한줄리뷰
                </span>
                <span className="text-sm text-gray-700 truncate">
                  {cafe.review}
                </span>
              </div>

              {index !== MOCK_CAFES.length - 1 && (
                <hr className="border-[#4A3F35] border-t-2 mt-2" />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
