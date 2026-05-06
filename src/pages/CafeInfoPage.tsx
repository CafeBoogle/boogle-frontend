import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '@/components/common/Button';
import CafeImageList from '@/components/cafe/CafeImageList';
import ImageModal from '@/components/cafe/ImageModal';
import CafeReviewChart from '@/components/cafe/CafeReviewChart';
import { useCafeInfo } from '@/hooks/useCafeInfo';

function CafeInfoPage() {
  const { cafeId } = useParams<{ cafeId: string }>();
  const navigate = useNavigate();
  const { cafe, isWished, isLoading, handleWishToggle } = useCafeInfo(cafeId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!cafe) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="w-7 h-7 border-4 border-[#8B7368] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] bg-gray-50">

      {/* 헤더 카드 */}
      <div className="bg-white px-5 pt-5 pb-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900 leading-snug break-keep">
            {cafe.name}
          </h1>
          {cafe.placeId && (
            <a
              href={`https://place.map.kakao.com/${cafe.placeId}`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-[#F9E000] text-gray-900 text-xs font-semibold rounded-lg"
            >
              카카오맵 ↗
            </a>
          )}
        </div>

        {/* 주소 */}
        <div className="mt-3 flex items-start gap-2">
          <span className="text-base mt-0.5">📍</span>
          <p className="text-sm text-gray-700 font-medium break-keep leading-relaxed">
            {cafe.address}
          </p>
        </div>
        {cafe.contact && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-base">📞</span>
            <p className="text-sm text-gray-500">{cafe.contact}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4 py-4">

        {/* 리뷰 차트 */}
        <div className="bg-white rounded-2xl px-5 py-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-800">카페 분석 리포트</p>
            {cafe.score && cafe.score.reviewCount > 0 && (
              <p className="text-xs text-gray-400">리뷰 {cafe.score.reviewCount}개 기반 분석</p>
            )}
          </div>
          {!cafe.score || cafe.score.reviewCount === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">아직 등록된 리뷰가 없습니다.</p>
              <p className="text-xs text-gray-300 mt-1">첫 번째 리뷰를 남겨보세요!</p>
            </div>
          ) : (
            <CafeReviewChart scores={cafe.score} />
          )}
        </div>

        {/* 이미지 */}
        <div className="bg-white rounded-2xl px-5 py-5">
          <CafeImageList
            images={cafe.imageName ? [cafe.imageName] : []}
            onImageClick={setSelectedImage}
          />
        </div>

        {/* 안내 문구 */}
        <p className="text-xs text-gray-400 text-center leading-relaxed px-4 break-keep">
          실제 리뷰를 바탕으로 카페의 분위기와 작업 환경을 분석한 리포트입니다.
          이용자 경험을 데이터로 정리해 더 정확한 카페 선택을 돕습니다.
        </p>

        {/* 버튼 영역 */}
        <div className="flex flex-col gap-2 mt-4">
          <Button
            variant="brown4"
            size="full"
            textColor="white"
            onClick={handleWishToggle}
            disabled={isLoading}
          >
            {isWished ? '찜 취소 ❤️' : '카페 찜하기 ♡'}
          </Button>
          <Button
            variant="brown1"
            size="full"
            textColor="brown"
            onClick={() => navigate(-1)}
          >
            카페 목록으로 돌아가기
          </Button>
        </div>

      </div>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}

export default CafeInfoPage;
