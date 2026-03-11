import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/common/Button";

function CafeInfoPage() {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();

  return (
    <div>
      <div>{name} 카페 상세 페이지 </div>
      <Button onClick={() => navigate("/mainpage")}>홈으로</Button>
    </div>
  );
}

export default CafeInfoPage;
