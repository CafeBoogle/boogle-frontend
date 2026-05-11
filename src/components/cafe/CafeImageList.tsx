interface CafeImageListProps {
  images?: string[];
  onImageClick: (url: string) => void;
}

function CafeImageList({ images = [], onImageClick }: CafeImageListProps) {

  // ✅ 1. 진짜 이미지 URL만 남긴다
  const validImages = images.filter(
    (url) =>
      typeof url === 'string' &&
      url.trim() !== '' &&
      !url.endsWith('/images/reviews/') &&
      !url.endsWith('/images/reviews')
  );

  return (
    <div className="flex flex-col gap-3">
      {/* 제목 항상 표시 */}
      <h2 className="text-sm font-semibold text-gray-700">카페 이미지</h2>

      {/* 영역 항상 표시 */}
      <div className="flex gap-3 overflow-x-auto pb-1 min-h-[96px] items-center">
        {validImages.length > 0 ? (
          validImages.map((url, i) => (
            <img
              key={i}
              src={url}
              alt="카페 이미지"
              className="w-32 h-24 object-cover rounded-xl flex-shrink-0 cursor-pointer"
              onClick={() => onImageClick(url)}
              onError={(e) => e.currentTarget.remove()}
            />
          ))
        ) : (
          // 배열이 비어있을 때 (이미지가 없을 때)
          <p className="text-sm text-gray-400 w-full text-center">
            아직 등록된 이미지가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

export default CafeImageList;