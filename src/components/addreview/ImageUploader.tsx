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
    <div className="flex flex-col items-center">
      <label className="cursor-pointer">
        {previews.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="preview" className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div className="w-40 h-48 bg-gray-200 rounded-xl flex flex-col items-center justify-center border-2 border-transparent hover:border-stone-400">
            <span className="text-4xl text-gray-400">+</span>
          </div>
        )}
        <input type="file" className="hidden" onChange={handleFile} accept="image/*" multiple />
      </label>
      <span className="mt-2 text-sm text-gray-600 font-medium">사진 등록하기</span>
    </div>
  );
};
