import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/common/Button";

interface LocationState {
  region: string | null;
}

export default function FilterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || { region: null };

  const regionId = state.region;
  const isLoggedIn = true; 

  const [selectedDoor, setSelectedDoor] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const regionLabels: Record<string, string> = {
    sogang: "서강대학교",
    yonsei: "연세대학교",
    hongik: "홍익대학교",
    ewha: "이화여자대학교",
    nearby: "근처 추천 카페",
    all: "전체 모아보기",
  };

  const regionLabel = (regionId && regionLabels[regionId]) || "지역 정보 없음";

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleApply = () => {
    navigate("/cafelist", {
      state: {
        region: regionId,
        door: selectedDoor,
        tags: selectedTags,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-10">
      <div className="w-full px-8 mt-10">
        {/* 지도 영역 (Placeholder) */}
        <div className="w-full h-52 bg-white flex items-center justify-center border border-gray-200 shadow-inner rounded-sm mb-10">
          <span className="text-3xl font-light text-gray-500">
            {regionLabel} 지도
          </span>
        </div>


        <section className="mb-8">
          <h2 className="text-lg font-semibold ml-2 mb-4 text-brown-4">선택 지역 : {regionLabel} </h2>
          <div className="flex gap-3">
            {["정문", "후문", "남문"].map((door) => {
              const isSelected = selectedDoor === door;
              return (
                <Button
                  key={door}
                  onClick={() => setSelectedDoor(door)}
                  variant={isSelected ? "brown4" : "brown1"}
                  size = "tag"
                  textColor = {isSelected ? "white" : "brown"}
                >{door}</Button>
                
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold ml-2 mb-4 flex items-center text-brown-4">
            저한테는 이게 특히 중요해요! 🔍
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "콘센트",
              "넓은 카페",
              "화장실",
              "와이파이",
              "24시 카페",
              "조용한 카페",
            ].map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <Button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  variant={isSelected ? "brown4" : "brown1"}
                  size = "tag"
                  textColor = {isSelected ? "white" : "brown"}
                >
                  # {tag}
                </Button>
              );
            })}
          </div>
        </section>

        <div className="flex justify-center mt-4">
        <Button
              variant = "brown4"
              size = "full"
              textColor = "white"
              onClick={handleApply}
              className = "text-lg"
            >
              적용하기
            </Button>
        </div>
      </div>
    </div>
  );
}