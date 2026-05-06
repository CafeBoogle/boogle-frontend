interface CafeImageListProps {
  images?: string[];
  onImageClick: (url: string) => void;
}

function CafeImageList({ images = [], onImageClick }: CafeImageListProps) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-700">카페 이미지</h2>
        <p className="text-sm text-gray-400 text-center py-4">등록된 이미지가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-gray-700">카페 이미지</h2>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt="카페 이미지"
            className="w-32 h-24 object-cover rounded-xl flex-shrink-0 cursor-pointer hover:opacity-80 transition"
            onClick={() => onImageClick(url)}
          />
        ))}
      </div>
    </div>
  );
}

export default CafeImageList;
