import { useLocation, useNavigate } from "react-router-dom";
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

  const regionLabels: Record<string, string> = {
    sogang: "서강대학교",
    yonsei: "연세대학교",
    hongik: "홍익대학교",
    ewha: "이화여자대학교",
    nearby: "근처 추천 카페",
    all: "전체 모아보기",
  };

  const regionLabel = (regionId && regionLabels[regionId]) || "지역을 다시 선택해주세요!";

  return (
    <div className="min-h-screen flex flex-col items-center pb-10">
      <div className="w-full px-8 mt-10">
        <div className="w-full h-52 bg-white flex items-center justify-center border border-gray-200 shadow-inner rounded-sm mb-10">
          <span className="text-3xl font-light text-gray-500">{regionLabel} 지도</span>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">{regionLabel}</h2>
          <div className="flex gap-3">
            {["정문", "후문", "남문"].map((door) => (
              <Button variant="brown2"  key={door} >정문</Button>

            ))}
          </div>
        </section>

        {/* 필터 섹션 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            저한테는 이게 특히 중요해요! 🔍
          </h2>
          <div className="flex flex-wrap gap-2">
            {["# 콘센트", "# 넓은 카페", "# 화장실", "# 와이파이", "# 24시 카페", "# 조용한 카페"].map((tag) => (
              <button key={tag} className="px-4 py-2 bg-[#D9D4CF] rounded-full text-sm font-medium hover:bg-[#8B7368] hover:text-white transition">
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* 로그인 상태에 따른 조건부 버튼 렌더링 */}
        <div className="flex justify-center mt-4 relative">
          {isLoggedIn ? (
            <Button 
              className="w-full max-w-xs py-4 bg-[#3E3431] text-white rounded-xl text-lg shadow-lg"
              onClick={() => navigate("/cafelist")}
            >
              적용하기
            </Button>
          ) : (
            <Button 
              className="w-full max-w-xs py-4 bg-[#8B7368] text-white rounded-xl text-lg shadow-lg"
              onClick={() => navigate("/login")}
            >
              로그인하기
            </Button>
          )}
          
      
        </div>
      </div>
    </div>
  );
}