import { useState } from 'react';

interface ImageUploaderProps {
  onFilesSelect: (files: File[]) => void;
}

export const ImageUploader = ({ onFilesSelect }: ImageUploaderProps) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setPreviews(files.map((f) => URL.createObjectURL(f)));
    onFilesSelect(files);
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-2 mt-2 mb-5 w-full">
        <span className="text-sm font-semibold text-[#4A3A2E]">이미지 등록하기</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      <label className="cursor-pointer">
        {previews.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="preview"
                className="w-30 h-30 object-cover rounded-xl flex-shrink-0"
              />
            ))}
          </div>
        ) : (
          <div className="w-30 h-30 bg-[#FAF7F4] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-stone-300 hover:border-[#4A3A2E] hover:bg-[#F0EBE5] transition-colors">
            <span className="text-3xl text-stone-400">+</span>
            <span className="text-xs text-stone-400 mt-1">사진 추가</span>
          </div>
        )}
        <input type="file" className="hidden" onChange={handleFile} accept="image/*" multiple />
      </label>
    </div>
  );
};
