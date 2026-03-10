// CafeInfo 페이지에서 이미지 클릭시 이미지 커지게 함
interface ImageModalProps {
  image: string | null;
  onClose: () => void;
}

function ImageModal({ image, onClose }: ImageModalProps) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <img src={image} className="max-w-[90%] max-h-[90%] rounded-lg" />
    </div>
  );
}

export default ImageModal;
