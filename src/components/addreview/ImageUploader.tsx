import { useState } from 'react';
interface ImageUploaderProps {
  onFilesSelect: (files: File[]) => void;
  existingImages?: string[];
  onRemoveExisting?: (idx: number) => void;
}

export const ImageUploader = ({
  onFilesSelect,
  existingImages = [],
  onRemoveExisting,
}: ImageUploaderProps) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]); // 누적
    onFilesSelect(files);
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-2 mt-2 mb-5 w-full">
        <span className="text-sm font-semibold text-[#4A3A2E]">이미지 등록하기</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {/* 기존 이미지 */}
        {existingImages.map((url, idx) => (
          <div key={`existing-${idx}`} className="relative">
            <img src={url} className="w-20 h-20 object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => onRemoveExisting?.(idx)}
              className="absolute top-0 right-0 bg-black text-white text-xs px-1 rounded"
            >
              X
            </button>
          </div>
        ))}

        {/* 새 이미지 미리보기 */}
        {previews.map((src, i) => (
          <img key={`new-${i}`} src={src} className="w-20 h-20 object-cover rounded-xl" />
        ))}

        {/* 추가 버튼 */}
        <label className="cursor-pointer">
          <div className="w-20 h-20 bg-[#FAF7F4] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-stone-300 hover:border-[#4A3A2E] hover:bg-[#F0EBE5] transition-colors">
            <span className="text-3xl text-stone-400">+</span>
          </div>
          <input type="file" className="hidden" onChange={handleFile} accept="image/*" multiple />
        </label>
      </div>
    </div>
  );
};
