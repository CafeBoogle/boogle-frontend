import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Button from '@/components/common/Button';
import CafeImageList from '@/components/cafe/CafeImageList';
import ImageModal from '@/components/cafe/ImageModal';

function CafeInfoPage() {
  const { name } = useParams<{ name: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // 리스트 페이지에서 navigate 시 넘겨준 { cafeId, cafeName, ... } 정보
  // 만약 DB의 PK가 cafeId라는 이름으로 넘어온다면 해당 값을 사용하세요.
  const cafeData = location.state || {}; 
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isWished, setIsWished] = useState<boolean>(cafeData.isWished || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWishToggle = async () => {
    // 1. 카페 ID 존재 확인 (DB의 PK가 없으면 진행 불가)
    const cafeId = cafeData.cafeId || cafeData.id;
    
    if (!cafeId) {
      alert("카페 정보를 찾을 수 없습니다. 다시 시도해 주세요.");
      return;
    }

    setIsLoading(true);
    
    // 낙관적 업데이트: UI 먼저 변경
    const previousState = isWished;
    setIsWished(!previousState);

    try {
      // 2. 이미 DB에 카페가 있으므로 PathVariable로 ID만 전달
      // 두 번째 인자는 body인데, ID를 URL로 보내므로 빈 객체({})를 보냅니다.
      const response = await axios.post(
        `/api/cafes/${cafeId}/wish`, 
        {}, 
        { withCredentials: true }
      );

      // 서버가 리턴한 최종 찜 상태(boolean) 적용
      setIsWished(response.data); 
      
    } catch (error: any) {
      // 에러 발생 시 원래 상태로 복구
      setIsWished(previousState);
      
      if (error.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
        navigate('/login');
      } else {
        alert("찜하기 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl overflow-hidden bg-white shadow-xl/20 border border-neutral-200 p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center pt-4 text-brown-4">{name}</h1>

        <a href={cafeData.placeUrl} target="_blank" rel="noreferrer" className="text-blue-800 text-lg text-center font-medium">
          {name} 알아보기
        </a>
        
        {/* 그래프 영역 */}
        <div className="w-full h-52 bg-white flex items-center justify-center border border-gray-200 shadow-inner rounded-sm ">
          <span className="text-3xl font-light text-gray-500">그래프</span>
        </div>

        <div className="break-keep text-center text-neutral-600 leading-relaxed text-xs mb-2">
          실제 리뷰를 바탕으로 카페의 분위기와 작업 환경을 분석한 리포트입니다. <br />
          이용자 경험을 데이터로 정리해 더 정확한 카페 선택을 돕습니다.
        </div>

        <CafeImageList onImageClick={setSelectedImage} />

        {/* 찜하기 버튼 */}
        <Button 
          className="mt-3 bg-[#8B4513] text-white hover:bg-[#723a10] transition-all duration-300"
          onClick={handleWishToggle}
          disabled={isLoading}
        >
          {isWished ? "카페 찜 취소 ❤️" : "카페 찜하기 ♡"}
        </Button>
      </div>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}

export default CafeInfoPage;