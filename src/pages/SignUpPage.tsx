import { useState } from "react";

import sogangCat from "../assets/images/SignUp/sogangCat.png";
import yonseiCat from "../assets/images/SignUp/yonseiCat.png";
import hongikCat from "../assets/images/SignUp/hongikCat.png";
import ewhaCat from "../assets/images/SignUp/ewhaCat.png";

function CatSelection() {
  const [selected, setSelected] = useState<string | null>(null);

  const cats = [
    { id: "SG", src: sogangCat, alt: "서강대 " },
    { id: "Y", src: yonseiCat, alt: "연세대 " },
    { id: "H", src: hongikCat, alt: "홍익대 " },
    { id: "E", src: ewhaCat, alt: "이화여대 " },
  ];

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="grid grid-cols-2 gap-6">
        {cats.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelected(cat.id)}
            className={`cursor-pointer transition-all duration-200 transform 
              ${selected === cat.id ? "scale-100" : "hover:opacity-80"}
            `}
          >
            <img 
              src={cat.src} 
              alt={cat.alt} 
              className={`w-full h-auto rounded-2xl ${
                selected === cat.id ? "ring-2 ring-brown-500 shadow-lg" : ""
              }`} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatSelection;