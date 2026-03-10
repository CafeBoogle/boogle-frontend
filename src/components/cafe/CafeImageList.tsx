import { cafeImages } from '@/data/cafeImage';

interface CafeImageListProps {
  onImageClick: (url: string) => void;
}

function CafeImageList({ onImageClick }: CafeImageListProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">카페 이미지</h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {cafeImages.map((image) => (
          <img
            key={image.id}
            src={image.url}
            className="w-32 h-24 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition"
            onClick={() => onImageClick(image.url)}
          />
        ))}
      </div>
    </div>
  );
}

export default CafeImageList;
