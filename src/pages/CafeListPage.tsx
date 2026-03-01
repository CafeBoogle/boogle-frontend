import { useNavigate, useLocation } from "react-router-dom";

interface LocationState {
  region: string | null;
  door: string | null;
  tags: string[];
}

export default function CafeListPage () {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || { region: null, door: null, tags: [] };

  const { region, door, tags } = state;

  return (
    <div>
      <h2>선택된 필터 정보</h2>
      <p>지역: {region}</p> 
      <p>문: {door}</p>  
      <p>태그: {tags.join(", ")}</p> 
      <button onClick={() => navigate("/cafeinfo")}>
         카페소개페이지로 이동
      </button>
    </div>
  );
}


