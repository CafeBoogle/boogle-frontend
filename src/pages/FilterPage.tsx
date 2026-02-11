import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";

interface LocationState {
  region: string | null;
}

export default function FilterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || { region: null };

  const regionId = state.region; // CategoryPage에서 넘겨받은 region 값


  const regionLabels: Record<string, string> = {
    sogang: "서강대학교",
    yonsei: "연세대학교",
    hongik: "홍익대학교",
    ewha: "이화여자대학교",
    nearby: "근처 추천 카페 (합정/상수/공덕)",
    all: "전체 모아보기",
  };

  const regionLabel =
    (regionId && regionLabels[regionId]) || "지역을 다시 선택해주세요.";

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">필터 페이지</h1>

      <p className="mb-8 text-lg">
        <span className="font-semibold">선택된 지역 :</span>{" "}
        <span>{regionLabel}</span>
      </p>

      <Button
       
        onClick={() => navigate("/cafelist")}
      >
        적용하기 
      </Button>
    </div>
  );
}
