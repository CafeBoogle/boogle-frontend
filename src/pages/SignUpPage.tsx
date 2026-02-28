import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";

import sogangCat from "../assets/images/SignUp/sogangCat.png";
import yonseiCat from "../assets/images/SignUp/yonseiCat.png";
import hongikCat from "../assets/images/SignUp/hongikCat.png";
import ewhaCat from "../assets/images/SignUp/ewhaCat.png";

function SignUp() {
  const [selected, setSelected] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const cats = [
    { id: "SG", src: sogangCat, alt: "서강대" },
    { id: "Y", src: yonseiCat, alt: "연세대" },
    { id: "H", src: hongikCat, alt: "홍익대" },
    { id: "E", src: ewhaCat, alt: "이화여대" },
  ];

  const handleSignUp = () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요!");
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen  flex flex-col items-center px-12 py-10">
      <h1 className="text-3xl font-bold text-[#160101] mb-12">간편 회원가입</h1>
      <div className="w-full max-w-sm mb-12">
        <h2 className="text-xl font-bold text-[#4A3A2E] mb-2">학교 선택하기</h2>
        <p className="text-sm text-[#8C7A6B] mb-8">
          선택하지 않으면 기본 캐릭터로 설정됩니다 !
        </p>

        <div className="grid grid-cols-2 gap-6 mt-14">
          {cats.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`relative cursor-pointer transition-all duration-200 
                ${selected === cat.id ? "scale-112" : "hover:opacity-80"}
              `}
            >
              <img
                src={cat.src}
                alt={cat.alt}
                className={`w-full h-auto rounded-2xl ${
                  selected === cat.id ? "border-[#A68966]" : "border-transparent"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm mb-12">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full bg-transparent border-b-2 border-[#8C7A6B] py-2 outline-none text-center text-sm text-[#4A3A2E]"
          placeholder="Boogle에서 사용할 닉네임을 입력해주세요 (필수)"
        />
      </div>

      <Button size = "lg" variant="brown4" onClick={handleSignUp}>
        회원가입하기
      </Button>
    </div>
  );
}

export default SignUp;