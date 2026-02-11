import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import sogangImg from "@/assets/images/Category/sogang.png";
import yonseiImg from "@/assets/images/Category/yonsei.png";
import hongikImg from "@/assets/images/Category/hongik.png";
import ewhaImg from "@/assets/images/Category/ewha.png";
import hapjeongImg from "@/assets/images/Category/hapjeong.png";
import boogleCatImg from "@/assets/images/Category/boogleCat.png";

type CategoryId = "sogang" | "yonsei" | "hongik" | "ewha" | "nearby" | "all";

interface CircleImageButtonProps {
  id: CategoryId;
  selected: CategoryId | null;
  onSelect: (id: CategoryId) => void;
  imgSrc: string;
  alt: string;
}

function CircleImageButton({
  id,
  selected,
  onSelect,
  imgSrc,
  alt,
}: CircleImageButtonProps) {
  const isActive = selected === id;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`w-36 h-36 rounded-full overflow-hidden border-4 flex items-center justify-center transition
        ${isActive ? "border-black" : "border-transparent"}`}
    >
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </button>
  );
}

export default function CategoryPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CategoryId | null>(null);

  const handleSelect = (value: CategoryId) => {
    setSelected(value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-8">
      <h1 className="text-3xl font-semibold text-center mt-8 mb-16">
        원하는 지역을 선택해주세요 !
      </h1>

      <div className="grid grid-cols-2 gap-x-10 gap-y-8 mb-6">
        <CircleImageButton
          id="sogang"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={sogangImg}
          alt="서강대학교"
        />
        <CircleImageButton
          id="yonsei"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={yonseiImg}
          alt="연세대학교"
        />
        <CircleImageButton
          id="hongik"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={hongikImg}
          alt="홍익대학교"
        />
        <CircleImageButton
          id="ewha"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={ewhaImg}
          alt="이화여자대학교"
        />

        <CircleImageButton
          id="nearby"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={hapjeongImg}
          alt="근처 추천 카페"
        />
        <CircleImageButton
          id="all"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={boogleCatImg}
          alt="전체 모아보기"
        />
      </div>

      <Button
        size="large"
        textColor="white"
        className="mt-20"
        onClick={() => navigate("/filter", { state: { region: selected } })}
      >
        선택 완료
      </Button>
    </div>
  );
}

